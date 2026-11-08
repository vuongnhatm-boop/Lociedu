/**
 * ============================================================================
 * LOCI EDU - UNIFIED ACCOUNT & PROGRESS MANAGER (BACKEND CORE)
 * Quản lý đồng bộ tập trung: Tài khoản, Căn cước học sinh, Tiến độ học, XP,
 * Cấp bậc Loci, Thống kê làm bài và Trạng thái xác thực.
 * Hoạt động mượt mà cả Offline (Local) và Real-time Cloud (Firestore).
 * ============================================================================
 */

(function (global) {
  'use strict';

  const STORAGE_KEYS = {
    SESSION: 'loci_auth_session',
    PROFILE: 'loci_user_profile',
    LOCAL_USER: 'loci_local_user',
    CURRENT_USER: 'loci_current_user',
    ACTIVE_UID: 'loci_active_student_uid',
    ACCOUNTS: 'loci_accounts',
    TOKEN: 'loci_auth_token'
  };

  const TIERS = [
    { level: 1, name: 'Tập sự Loci', minXp: 0, nextXp: 150 },
    { level: 2, name: 'Khám phá Không gian', minXp: 150, nextXp: 400 },
    { level: 3, name: 'Chiến binh Trí nhớ', minXp: 400, nextXp: 800 },
    { level: 4, name: 'Bậc thầy Cung điện', minXp: 800, nextXp: 1500 },
    { level: 5, name: 'Huyền thoại Trí tuệ', minXp: 1500, nextXp: null }
  ];

  function calcLevel(xp) {
    const curXp = Math.max(0, parseInt(xp || 0, 10));
    let tier = TIERS[0];
    for (let i = TIERS.length - 1; i >= 0; i--) {
      if (curXp >= TIERS[i].minXp) {
        tier = TIERS[i];
        break;
      }
    }
    let pct = 100;
    let needed = 0;
    if (tier.nextXp) {
      const range = tier.nextXp - tier.minXp;
      const inTier = curXp - tier.minXp;
      pct = Math.min(100, Math.max(0, Math.round((inTier / range) * 100)));
      needed = tier.nextXp - curXp;
    }
    return {
      xp: curXp,
      level: tier.level,
      tierName: tier.name,
      progressPct: pct,
      xpNeeded: needed
    };
  }

  const LociAccountManager = {
    _currentUser: null,
    _listeners: [],

    init() {
      this.loadSession();
      // Listen for cross-tab storage changes
      if (typeof window !== 'undefined') {
        window.addEventListener('storage', (e) => {
          if (e.key === STORAGE_KEYS.SESSION || e.key === STORAGE_KEYS.PROFILE) {
            this.loadSession();
          }
        });
      }
    },

    loadSession() {
      try {
        const sessionActive = localStorage.getItem(STORAGE_KEYS.SESSION) === 'active';
        if (!sessionActive) {
          this._currentUser = null;
          this._notify(null);
          return null;
        }

        const raw = localStorage.getItem(STORAGE_KEYS.PROFILE) ||
                    localStorage.getItem(STORAGE_KEYS.LOCAL_USER) ||
                    localStorage.getItem(STORAGE_KEYS.CURRENT_USER);

        if (!raw) {
          this._currentUser = null;
          this._notify(null);
          return null;
        }

        const parsed = JSON.parse(raw);
        if (parsed && (parsed.uid || parsed.username || parsed.displayName)) {
          // Normalize user profile
          this._currentUser = this._normalizeProfile(parsed);
          this._persistAll(this._currentUser);
          this._notify(this._currentUser);
          return this._currentUser;
        }
      } catch (err) {
        console.warn('[LociAccountManager] Lỗi đọc session:', err);
      }
      this._currentUser = null;
      return null;
    },

    _normalizeProfile(src) {
      const uname = src.username || (src.email ? src.email.split('@')[0] : 'hocsinh');
      const cleanUname = String(uname).replace(/[^a-zA-Z0-9_-]/g, '').toLowerCase() || 'hocsinh';
      const dname = src.displayName || uname || 'Học sinh Loci';
      const uid = src.uid || ('loci_' + cleanUname);
      const email = src.email || (cleanUname + '@loci.edu.vn');
      const xp = parseInt(src.xp || (src.stats && src.stats.xp) || 50, 10);
      const lvlInfo = calcLevel(xp);

      return {
        uid: uid,
        username: cleanUname,
        displayName: dname,
        email: email,
        role: src.role || 'student',
        avatarUrl: src.avatarUrl || src.photoURL || '',
        avatarFrame: src.avatarFrame || 'bronze',
        xp: lvlInfo.xp,
        level: lvlInfo.level,
        tierName: lvlInfo.tierName,
        progressPct: lvlInfo.progressPct,
        xpNeeded: lvlInfo.xpNeeded,
        streak: parseInt(src.streak || (src.stats && src.stats.streak) || 1, 10),
        stats: {
          answered: parseInt((src.stats && src.stats.answered) || 0, 10),
          correct: parseInt((src.stats && src.stats.correct) || 0, 10),
          accuracy: (src.stats && typeof src.stats.accuracy === 'number') ? src.stats.accuracy : null,
          weeklyMinutes: parseInt((src.stats && src.stats.weeklyMinutes) || 0, 10),
          weakPoints: (src.stats && Array.isArray(src.stats.weakPoints)) ? src.stats.weakPoints : []
        },
        completedStations: src.completedStations || { bai_6: [], bai_7: [], bai_8: [] },
        badges: Array.isArray(src.badges) ? src.badges : ['khoi_dau_loci'],
        updatedAt: new Date().toISOString()
      };
    },

    _persistAll(profile) {
      try {
        const json = JSON.stringify(profile);
        localStorage.setItem(STORAGE_KEYS.PROFILE, json);
        localStorage.setItem(STORAGE_KEYS.LOCAL_USER, json);
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, json);
        localStorage.setItem(STORAGE_KEYS.ACTIVE_UID, profile.uid);
        localStorage.setItem(STORAGE_KEYS.SESSION, 'active');

        // Also register into accounts list
        const accounts = JSON.parse(localStorage.getItem(STORAGE_KEYS.ACCOUNTS) || '{}');
        accounts[profile.username] = {
          uid: profile.uid,
          username: profile.username,
          displayName: profile.displayName,
          email: profile.email,
          updatedAt: profile.updatedAt
        };
        localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
      } catch (err) {
        console.warn('[LociAccountManager] Lỗi lưu LocalStorage:', err);
      }

      // Sync to Firestore if available
      this._syncToFirestore(profile);
    },

    async _syncToFirestore(profile) {
      try {
        if (global.LociFirebase && global.LociFirebase.db) {
          const { doc, setDoc } = await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js");
          const userRef = doc(global.LociFirebase.db, 'users', profile.uid);
          await setDoc(userRef, profile, { merge: true });
          console.log('[LociAccountManager] Đã đồng bộ lên Cloud Firestore thành công cho UID:', profile.uid);
        }
      } catch (e) {
        // Silent fallback to local offline mode
      }
    },

    isLoggedIn() {
      if (this._currentUser) return true;
      const user = this.loadSession();
      return !!(user && user.uid);
    },

    getUser() {
      if (!this._currentUser) {
        this.loadSession();
      }
      return this._currentUser;
    },

    login(usernameOrEmail, password, displayName) {
      const username = usernameOrEmail.includes('@') ? usernameOrEmail.split('@')[0] : usernameOrEmail.trim();
      const cleanName = username.replace(/[^a-zA-Z0-9_-]/g, '').toLowerCase() || 'hocsinh';
      const realDisplayName = displayName || username;
      const uid = 'loci_' + cleanName;

      // Look up previous stats or initialize
      let prevProfile = null;
      try {
        const accounts = JSON.parse(localStorage.getItem(STORAGE_KEYS.ACCOUNTS) || '{}');
        if (accounts[cleanName]) {
          prevProfile = accounts[cleanName];
        }
      } catch (_) {}

      const profile = this._normalizeProfile({
        uid: uid,
        username: cleanName,
        displayName: realDisplayName,
        email: cleanName + '@loci.edu.vn',
        ...(prevProfile || {})
      });

      this._currentUser = profile;
      this._persistAll(profile);
      this._notify(profile);

      return profile;
    },

    logout() {
      try {
        localStorage.removeItem(STORAGE_KEYS.SESSION);
        localStorage.removeItem(STORAGE_KEYS.PROFILE);
        localStorage.removeItem(STORAGE_KEYS.LOCAL_USER);
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
        localStorage.removeItem(STORAGE_KEYS.ACTIVE_UID);
      } catch (_) {}

      this._currentUser = null;
      this._notify(null);

      if (global.LociFirebase && typeof global.LociFirebase.logout === 'function') {
        try { global.LociFirebase.logout(); } catch (_) {}
      }
    },

    addXP(amount, reason) {
      if (!this.isLoggedIn()) return;
      const u = this.getUser();
      const added = parseInt(amount, 10) || 0;
      u.xp += added;
      const lvlInfo = calcLevel(u.xp);
      const oldLevel = u.level;
      u.level = lvlInfo.level;
      u.tierName = lvlInfo.tierName;
      u.progressPct = lvlInfo.progressPct;
      u.xpNeeded = lvlInfo.xpNeeded;
      u.updatedAt = new Date().toISOString();

      this._persistAll(u);
      this._notify(u);

      if (typeof global.showToast === 'function') {
        const title = reason ? `+${added} XP: ${reason}` : `+${added} XP`;
        global.showToast(title, 'success', 3000);
      }

      if (u.level > oldLevel && typeof global.showToast === 'function') {
        setTimeout(() => {
          global.showToast(`Chúc mừng! Bạn đã thăng cấp: Cấp ${u.level} - ${u.tierName}!`, 'success', 5000);
        }, 800);
      }

      return u;
    },

    recordQuizAnswer(isCorrect) {
      if (!this.isLoggedIn()) return;
      const u = this.getUser();
      u.stats.answered += 1;
      if (isCorrect) {
        u.stats.correct += 1;
      }
      u.stats.accuracy = Math.round((u.stats.correct / u.stats.answered) * 100);
      this.addXP(isCorrect ? 10 : 2, isCorrect ? 'Trả lời chính xác' : 'Ôn luyện ghi nhớ');
      this._persistAll(u);
    },

    completeStation(lessonId, stationOrder) {
      if (!this.isLoggedIn()) return;
      const u = this.getUser();
      if (!u.completedStations[lessonId]) {
        u.completedStations[lessonId] = [];
      }
      if (!u.completedStations[lessonId].includes(stationOrder)) {
        u.completedStations[lessonId].push(stationOrder);
        this.addXP(25, `Hoàn thành Trạm 3D số ${stationOrder}`);
      }
      this._persistAll(u);
    },

    onAuthChange(fn) {
      if (typeof fn === 'function') {
        this._listeners.push(fn);
        if (this._currentUser) {
          try { fn(this._currentUser); } catch (_) {}
        }
      }
    },

    _notify(user) {
      this._listeners.forEach(fn => {
        try { fn(user); } catch (e) { console.error(e); }
      });
      // Fire custom event
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('loci:auth:change', { detail: { user } }));
      }
    }
  };

  LociAccountManager.init();

  // Expose globally
  global.LociAccountManager = LociAccountManager;

})(typeof window !== 'undefined' ? window : this);
