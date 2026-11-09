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

  const DEFAULT_SEED_ACCOUNTS = {
    "admin": {
      uid: "loci_admin_bgk",
      username: "admin",
      displayName: "Ban Giám Khảo Loci",
      email: "bengiamkhao@loci.edu.vn",
      password: (typeof global.btoa === 'function' ? global.btoa('admin123') : 'admin123'),
      photoURL: "assets/images/avatar_quangminh.jpg",
      avatar: "assets/images/avatar_quangminh.jpg",
      school: "Hội Đồng Ban Giám Khảo Loci",
      role: "admin",
      isAdmin: true,
      xp: 99999,
      level: 5,
      streak: 99,
      honorRole: "Ban Giám Khảo Đặc Quyền Toàn Không Gian",
      petName: "Kỳ Lân Hoàng Kim",
      petTier: 5,
      lociCups: 99,
      registeredAt: "2026-01-01T00:00:00.000Z"
    },
    "quangminh": {
      uid: "loci_quangminh",
      username: "quangminh",
      displayName: "Trần Quang Minh (12A1 Chu Văn An)",
      email: "quangminh@loci.edu.vn",
      password: (typeof global.btoa === 'function' ? global.btoa('loci123456') : 'loci123456'),
      photoURL: "assets/images/avatar_quangminh.jpg",
      avatar: "assets/images/avatar_quangminh.jpg",
      school: "THPT Chuyên Chu Văn An, Hà Nội",
      xp: 3850,
      level: 5,
      streak: 14,
      honorRole: "Quán quân Top 1 Toàn quốc · 3,850 pts",
      petName: "Bạch Hổ Thần Tốc",
      petTier: 4,
      registeredAt: "2026-10-15T08:30:00.000Z"
    },
    "hamy": {
      uid: "loci_hamy",
      username: "hamy",
      displayName: "Nguyễn Hà My (12 Sử Ams)",
      email: "hamy@loci.edu.vn",
      password: (typeof global.btoa === 'function' ? global.btoa('loci123456') : 'loci123456'),
      photoURL: "assets/images/avatar_hamy.jpg",
      avatar: "assets/images/avatar_hamy.jpg",
      school: "THPT Chuyên Hà Nội - Amsterdam",
      xp: 3620,
      level: 5,
      streak: 12,
      honorRole: "Á quân Top 2 · 3,620 pts",
      petName: "Phượng Hoàng Lửa",
      petTier: 3,
      registeredAt: "2026-10-18T09:15:00.000Z"
    },
    "baoanh": {
      uid: "loci_baoanh",
      username: "baoanh",
      displayName: "Lê Bảo Anh (12 Chuyên LHP)",
      email: "baoanh@loci.edu.vn",
      password: (typeof global.btoa === 'function' ? global.btoa('loci123456') : 'loci123456'),
      photoURL: "assets/images/avatar_baoanh.jpg",
      avatar: "assets/images/avatar_baoanh.jpg",
      school: "THPT Chuyên Lê Hồng Phong, TP.HCM",
      xp: 3410,
      level: 4,
      streak: 10,
      honorRole: "Cao thủ Đấu Trường Tri Thức · 3,410 pts",
      petName: "Kỳ Lân Trí Tuệ",
      petTier: 3,
      registeredAt: "2026-10-22T14:20:00.000Z"
    },
    "nhathoang": {
      uid: "loci_nhathoang",
      username: "nhathoang",
      displayName: "Phạm Nhật Hoàng (12A4 Phan Đình Phùng)",
      email: "nhathoang@loci.edu.vn",
      password: (typeof global.btoa === 'function' ? global.btoa('loci123456') : 'loci123456'),
      photoURL: "assets/images/avatar_nhathoang.jpg",
      avatar: "assets/images/avatar_nhathoang.jpg",
      school: "THPT Phan Đình Phùng, Hà Nội",
      xp: 3150,
      level: 4,
      streak: 9,
      honorRole: "Linh Thú Bậc 4: Bạch Hổ · 3,150 pts",
      petName: "Bạch Hổ Thần Tốc",
      petTier: 4,
      registeredAt: "2026-10-25T11:00:00.000Z"
    },
    "thaolinh": {
      uid: "loci_thaolinh",
      username: "thaolinh",
      displayName: "Hoàng Vũ Thảo Linh (12A1 Lê Khiết)",
      email: "thaolinh@loci.edu.vn",
      password: (typeof global.btoa === 'function' ? global.btoa('loci123456') : 'loci123456'),
      photoURL: "assets/images/avatar_thaolinh.jpg",
      avatar: "assets/images/avatar_thaolinh.jpg",
      school: "THPT Chuyên Lê Khiết, Quảng Ngãi",
      xp: 2980,
      level: 4,
      streak: 8,
      honorRole: "Quán quân Đường Lên Đỉnh Loci · 2,980 pts",
      petName: "Phượng Hoàng Lửa",
      petTier: 3,
      registeredAt: "2026-10-28T16:45:00.000Z"
    },
    "tuankiet": {
      uid: "loci_tuankiet",
      username: "tuankiet",
      displayName: "Đặng Tuấn Kiệt (12 Sử Quốc Học Huế)",
      email: "tuankiet@loci.edu.vn",
      password: (typeof global.btoa === 'function' ? global.btoa('loci123456') : 'loci123456'),
      photoURL: "assets/images/avatar_tuankiet.jpg",
      avatar: "assets/images/avatar_tuankiet.jpg",
      school: "THPT Chuyên Quốc Học Huế",
      xp: 2750,
      level: 3,
      streak: 7,
      honorRole: "Học sinh Xuất sắc · 2,750 pts",
      petName: "Kỳ Lân Trí Tuệ",
      petTier: 2,
      registeredAt: "2026-11-01T10:10:00.000Z"
    }
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
      // Tự động gieo sẵn 6 tài khoản học sinh thật vào hệ thống nếu chưa có
      try {
        const raw = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
        const accs = raw ? JSON.parse(raw) : {};
        let updated = false;
        Object.keys(DEFAULT_SEED_ACCOUNTS).forEach(k => {
          if (!accs[k]) {
            accs[k] = DEFAULT_SEED_ACCOUNTS[k];
            updated = true;
          }
        });
        if (updated || !raw) {
          localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accs));
        }
      } catch (_) {}

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
      const isAdminUser = cleanUname === 'admin' || src.role === 'admin' || !!src.isAdmin;
      const dname = src.displayName || (isAdminUser ? 'Ban Giám Khảo Loci' : uname) || 'Học sinh Loci';
      const uid = src.uid || ('loci_' + cleanUname);
      const email = src.email || (cleanUname + '@loci.edu.vn');
      const xp = isAdminUser ? 99999 : parseInt(src.xp || (src.stats && src.stats.xp) || 50, 10);
      const lvlInfo = calcLevel(xp);

      return {
        uid: uid,
        username: cleanUname,
        displayName: dname,
        email: email,
        role: isAdminUser ? 'admin' : (src.role || 'student'),
        isAdmin: isAdminUser,
        avatarUrl: src.avatarUrl || src.photoURL || '',
        avatarFrame: isAdminUser ? 'tier5_legendary' : (src.avatarFrame || 'bronze'),
        xp: lvlInfo.xp,
        level: lvlInfo.level,
        tierName: isAdminUser ? 'Ban Giám Khảo Loci' : lvlInfo.tierName,
        progressPct: lvlInfo.progressPct,
        xpNeeded: lvlInfo.xpNeeded,
        streak: isAdminUser ? 99 : parseInt(src.streak || (src.stats && src.stats.streak) || 1, 10),
        hasCustomNickname: !!(src.hasCustomNickname),
        lastNicknameChangeDate: src.lastNicknameChangeDate || null,
        lociCups: parseInt(src.lociCups || (isAdminUser ? 99 : 0), 10),
        studyMinutes: parseInt(src.studyMinutes || 0, 10),
        stats: {
          answered: parseInt((src.stats && src.stats.answered) || 0, 10),
          correct: parseInt((src.stats && src.stats.correct) || 0, 10),
          accuracy: (src.stats && typeof src.stats.accuracy === 'number') ? src.stats.accuracy : null,
          weeklyMinutes: parseInt((src.stats && src.stats.weeklyMinutes) || 0, 10),
          weakPoints: (src.stats && Array.isArray(src.stats.weakPoints)) ? src.stats.weakPoints : []
        },
        completedStations: src.completedStations || { bai_6: [], bai_7: [], bai_8: [] },
        completedLessons: src.completedLessons || (isAdminUser ? ['bai_6', 'bai_7', 'bai_8'] : []),
        badges: Array.isArray(src.badges) ? src.badges : (isAdminUser ? ['dai_su_loci', 'kien_truc_su', 'sieu_ky_uc', 'than_nho_loci', 'khoi_dau_loci'] : ['khoi_dau_loci']),
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

        // Also register into accounts list (bảo lưu mật khẩu và quy tắc đổi tên)
        const accounts = JSON.parse(localStorage.getItem(STORAGE_KEYS.ACCOUNTS) || '{}');
        const prevAcc = accounts[profile.username] || {};
        accounts[profile.username] = {
          ...prevAcc,
          uid: profile.uid,
          username: profile.username,
          displayName: profile.displayName,
          email: profile.email,
          hasCustomNickname: profile.hasCustomNickname !== undefined ? profile.hasCustomNickname : (prevAcc.hasCustomNickname !== undefined ? prevAcc.hasCustomNickname : true),
          lastNicknameChangeDate: profile.lastNicknameChangeDate || prevAcc.lastNicknameChangeDate || null,
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

    register(usernameOrEmail, password, displayName) {
      const username = usernameOrEmail.includes('@') ? usernameOrEmail.split('@')[0] : usernameOrEmail.trim();
      const cleanName = username.replace(/[^a-zA-Z0-9_-]/g, '').toLowerCase() || 'hocsinh';
      const realDisplayName = (displayName && displayName.trim()) ? displayName.trim() : username;
      const uid = 'loci_' + cleanName;

      // Lưu mật khẩu vào danh mục accounts
      const accounts = JSON.parse(localStorage.getItem(STORAGE_KEYS.ACCOUNTS) || '{}');
      accounts[cleanName] = {
        uid: uid,
        username: cleanName,
        displayName: realDisplayName,
        email: cleanName + '@loci.edu.vn',
        password: password ? (typeof global.btoa === 'function' ? global.btoa(password) : password) : '',
        hasCustomNickname: false,
        lastNicknameChangeDate: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      try {
        localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
      } catch (_) {}

      const profile = this._normalizeProfile({
        uid: uid,
        username: cleanName,
        displayName: realDisplayName,
        email: cleanName + '@loci.edu.vn',
        hasCustomNickname: false,
        lastNicknameChangeDate: null,
        xp: 50,
        level: 1,
        tierName: 'Tập sự Loci'
      });

      this._currentUser = profile;
      this._persistAll(profile);
      try {
        localStorage.setItem('loci_last_login_user', cleanName);
      } catch (_) {}
      try {
        localStorage.setItem('loci_last_login_user', cleanName);
      } catch (_) {}
      this._notify(profile);

      return profile;
    },

    linkGoogle(googleUser) {
      if (!this._currentUser) return null;
      if (!googleUser) return this._currentUser;

      const email = googleUser.email || (this._currentUser.username + '@loci.edu.vn');
      const googleUid = googleUser.uid;
      const photoURL = googleUser.photoURL || this._currentUser.avatarUrl;

      this._currentUser.googleLinked = true;
      this._currentUser.googleEmail = email;
      this._currentUser.googleUid = googleUid;
      if (photoURL && !this._currentUser.avatarUrl) {
        this._currentUser.avatarUrl = photoURL;
      }
      this._currentUser.updatedAt = new Date().toISOString();

      try {
        const accounts = JSON.parse(localStorage.getItem(STORAGE_KEYS.ACCOUNTS) || '{}');
        if (accounts[this._currentUser.username]) {
          accounts[this._currentUser.username].googleLinked = true;
          accounts[this._currentUser.username].googleEmail = email;
          accounts[this._currentUser.username].googleUid = googleUid;
          accounts[this._currentUser.username].updatedAt = this._currentUser.updatedAt;
          localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
        }
      } catch (_) {}

      this._persistAll(this._currentUser);
      this._notify(this._currentUser);

      return this._currentUser;
    },

    exportBackupData() {
      const u = this.getUser();
      if (!u) return null;
      return JSON.stringify({
        version: 'LOCI_EDU_V2',
        exportedAt: new Date().toISOString(),
        student: u,
        spaces: JSON.parse(localStorage.getItem('loci360_spaces_meta_v2') || '[]'),
        accounts: JSON.parse(localStorage.getItem(STORAGE_KEYS.ACCOUNTS) || '{}')
      }, null, 2);
    },

    downloadBackupFile() {
      const jsonStr = this.exportBackupData();
      if (!jsonStr) throw new Error('Chưa đăng nhập để tải sao lưu.');
      const u = this.getUser();
      const filename = `loci_can_cuoc_${u ? u.username : 'hocsinh'}_${new Date().toISOString().slice(0, 10)}.json`;
      if (typeof Blob !== 'undefined' && typeof document !== 'undefined') {
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
      return filename;
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
        if (cleanName === 'admin' && !accounts['admin']) {
          accounts['admin'] = DEFAULT_SEED_ACCOUNTS['admin'];
          localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
        }
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
      try {
        localStorage.setItem('loci_last_login_user', cleanName);
      } catch (_) {}
      try {
        localStorage.setItem('loci_last_login_user', cleanName);
      } catch (_) {}
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
      try { this._notify(null); } catch (_) {}

      if (!global._isLoggingOut && global.LociFirebase && typeof global.LociFirebase.logout === 'function') {
        try { global.LociFirebase.logout(); } catch (_) {}
      }
    },

    /**
     * Kiểm tra điều kiện đổi biệt danh (14 ngày / 1 lần, lần đầu được đổi tự do)
     */
    canChangeNickname() {
      const u = this.getUser();
      if (!u) return { canChange: false, reason: 'Chưa đăng nhập' };
      // Lần đầu tiên luôn được đổi tên thoải mái
      if (!u.hasCustomNickname || !u.lastNicknameChangeDate) {
        return {
          canChange: true,
          isFirstTime: true,
          daysRemaining: 0,
          nextEligibleDate: null
        };
      }
      const lastChange = new Date(u.lastNicknameChangeDate).getTime();
      const now = Date.now();
      const fourteenDaysMs = 14 * 24 * 60 * 60 * 1000;
      const diffMs = now - lastChange;
      if (diffMs >= fourteenDaysMs) {
        return {
          canChange: true,
          isFirstTime: false,
          daysRemaining: 0,
          nextEligibleDate: null
        };
      }
      const remainingMs = fourteenDaysMs - diffMs;
      const daysRemaining = Math.ceil(remainingMs / (24 * 60 * 60 * 1000));
      const nextEligibleDate = new Date(lastChange + fourteenDaysMs);
      return {
        canChange: false,
        isFirstTime: false,
        daysRemaining: daysRemaining,
        nextEligibleDate: nextEligibleDate
      };
    },

    /**
     * Đổi biệt danh học sinh theo quy định 14 ngày
     */
    changeNickname(newNickname) {
      if (!this.isLoggedIn()) {
        throw new Error('Vui lòng đăng nhập để thực hiện đổi tên.');
      }
      const check = this.canChangeNickname();
      if (!check.canChange) {
        const dateStr = check.nextEligibleDate ? check.nextEligibleDate.toLocaleDateString('vi-VN') : '';
        throw new Error(`Quy định học thuật: Mỗi tài khoản chỉ được đổi tên 14 ngày một lần. Vui lòng quay lại sau ${check.daysRemaining} ngày nữa (sau ngày ${dateStr}).`);
      }

      const clean = String(newNickname || '').trim().replace(/<[^>]*>/g, '');
      if (!clean || clean.length < 2 || clean.length > 32) {
        throw new Error('Biệt danh phải có độ dài từ 2 đến 32 ký tự.');
      }

      const u = this.getUser();
      u.displayName = clean;
      u.hasCustomNickname = true;
      u.lastNicknameChangeDate = new Date().toISOString();
      u.updatedAt = new Date().toISOString();

      this._persistAll(u);
      this._notify(u);

      return {
        success: true,
        displayName: clean,
        nextEligibleDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
      };
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

    awardLociCup(rank, xpBonus, score) {
      if (!this.isLoggedIn()) return;
      const u = this.getUser();
      if (!u) return;
      if (rank === 1) {
        u.lociCups = (u.lociCups || 0) + 1;
        this.addBadge('quan_quan_cup_loci');
      }
      const xp = xpBonus || (rank === 1 ? 250 : (rank === 2 ? 150 : (rank === 3 ? 100 : 50)));
      this.addXP(xp, `Thành tích Cúp Loci (Hạng ${rank})`);
      this._persistAll(u);
      this._notify(u);
      return u;
    },

    addBadge(badgeId) {
      if (!this.isLoggedIn()) return;
      const u = this.getUser();
      if (!u) return;
      if (!Array.isArray(u.badges)) u.badges = [];
      if (!u.badges.includes(badgeId)) {
        u.badges.push(badgeId);
        this._persistAll(u);
        this._notify(u);
      }
    },

    recordLessonCompletion(lessonId) {
      if (!this.isLoggedIn()) return;
      const u = this.getUser();
      if (!u) return;
      if (!Array.isArray(u.completedLessons)) u.completedLessons = [];
      if (!u.completedLessons.includes(lessonId)) {
        u.completedLessons.push(lessonId);
        this.addXP(150, `Tốt nghiệp bài học ${lessonId.toUpperCase()}`);
        this.checkAllLessonsCompleted();
        this._persistAll(u);
        this._notify(u);
      }
    },

    checkAllLessonsCompleted() {
      if (!this.isLoggedIn()) return false;
      const u = this.getUser();
      if (!u) return false;
      if (u.isAdmin) return true;

      const c = u.completedLessons || [];
      const hasAll = ['bai_6', 'bai_7', 'bai_8'].every(k => c.includes(k));
      if (hasAll) {
        const allGoldBadges = ['dai_su_loci', 'kien_truc_su', 'sieu_ky_uc', 'than_nho_loci', 'master_cung_dien'];
        let updated = false;
        allGoldBadges.forEach(b => {
          if (!u.badges.includes(b)) {
            u.badges.push(b);
            updated = true;
          }
        });
        u.avatarFrame = 'tier5_legendary';
        if (updated) {
          this.addXP(500, 'Đại sứ Hoàn Thành Tất Cả Bài Học Loci!');
          this._persistAll(u);
          this._notify(u);
          if (typeof global.showToast === 'function') {
            global.showToast('🎉 Vinh danh: Bạn đã hoàn thành tất cả bài học và mở khóa toàn bộ thành tích vàng!', 'success', 6000);
          }
        }
        return true;
      }
      return false;
    },

    recordActiveMinutes(minutes) {
      if (!this.isLoggedIn()) return;
      const u = this.getUser();
      if (!u) return;
      u.studyMinutes = (u.studyMinutes || 0) + (parseInt(minutes, 10) || 1);
      this._persistAll(u);
      this._notify(u);
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

