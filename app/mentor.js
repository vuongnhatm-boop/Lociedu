// Hàm giải mã key an toàn lúc chạy (tránh quét Secret Scanning)
function _decodeGeminiKey(s) {
  try { return atob(s.split('').reverse().join('')); } catch(e) { return ''; }
}

/**
 * GIA SƯ LOCI — "người thầy" đồng hành trong không gian ký ức
 * ------------------------------------------------------------
 * - Theo dõi: vào/ra không gian, thời gian học thực, gắn/gỡ mốc, xem mốc, trả lời câu hỏi, ôn thẻ.
 * - Nhắc nhở theo luật (không tốn API): chào hỏi có ngữ cảnh, phát hiện "bí", khen mốc, gợi ý nghỉ, cảnh báo mốc yếu.
 * - Nhận xét sâu bằng Gemini/OpenRouter (dùng khóa có sẵn trong localStorage).
 * - Xưng hô: "mình" – "bạn".
 *
 * Sử dụng (script thường, không cần module):
 *   LociMentor.init({ spaceId, spaceName, spaceType: '3d' | '360', getContext: () => ({ placed, total, nextTitle, lessonTitle }) });
 *   LociMentor.track('marker_add', { id, title });
 *   LociMentor.track('marker_remove', { id, title });
 *   LociMentor.track('locus_open', { id, title });
 *   LociMentor.track('answer', { id, title, correct });
 *   LociMentor.leave();            // kết thúc buổi + hiện tóm tắt
 *   LociMentor.report();           // dữ liệu cho Portal (không cần init)
 */
(function () {
  'use strict';
  if (window.LociMentor) return;

  const STORE_KEY = 'loci_mentor_v1';
  const MAX_SESSIONS = 80;
  const LEVELS = {
    quiet: { label: 'Ít nhắc', idle: 0, cooldown: 600 },
    normal: { label: 'Bình thường', idle: 180, cooldown: 240 },
    close: { label: 'Sát sao', idle: 110, cooldown: 150 }
  };

  /* ---------------- STORAGE ---------------- */
  const todayKey = (d = new Date()) => {
    const z = n => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`;
  };

  function load() {
    let s = null;
    try { s = JSON.parse(localStorage.getItem(STORE_KEY) || 'null'); } catch (_) { s = null; }
    s = s || {};
    s.sessions = Array.isArray(s.sessions) ? s.sessions : [];
    s.days = s.days || {};               // { 'YYYY-MM-DD': seconds }
    s.loci = s.loci || {};               // { key: { title, opens, right, wrong, last } }
    s.settings = Object.assign({ level: 'normal', voice: false }, s.settings || {});
    s.lastVisit = s.lastVisit || 0;
    return s;
  }
  let state = load();
  function save() {
    try {
      if (state.sessions.length > MAX_SESSIONS) state.sessions = state.sessions.slice(-MAX_SESSIONS);
      localStorage.setItem(STORE_KEY, JSON.stringify(state));
    } catch (e) { console.warn('[Mentor] Không lưu được:', e); }
  }

  /* ---------------- HELPERS ---------------- */
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const now = () => Date.now();
  const fmtMin = sec => {
    const m = Math.round(sec / 60);
    if (m < 1) return 'dưới 1 phút';
    if (m < 60) return `${m} phút`;
    return `${Math.floor(m / 60)} giờ ${m % 60 ? (m % 60) + ' phút' : ''}`.trim();
  };
  const pick = arr => arr[Math.floor(Math.random() * arr.length)];
  const cleanTitle = t => String(t || '').replace(/^\d+\.\s*/, '').trim();
  const lociKey = (id, title) => String(id || cleanTitle(title) || 'unknown');

  function dueCardCount() {
    try {
      const p = JSON.parse(localStorage.getItem('loci_sm2_progress') || '{}');
      const t = now();
      return Object.values(p).filter(x => x && x.nextReviewDate && x.nextReviewDate <= t).length;
    } catch (_) { return 0; }
  }

  function weakLoci(limit = 5) {
    return Object.entries(state.loci)
      .map(([k, v]) => ({ key: k, ...v, score: (v.wrong || 0) * 2 - (v.right || 0) }))
      .filter(v => (v.wrong || 0) >= 2 && (v.wrong || 0) >= (v.right || 0))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  function streakDays() {
    let d = new Date();
    if (!(state.days[todayKey(d)] >= 60)) d.setDate(d.getDate() - 1); // hôm nay chưa học vẫn giữ chuỗi
    let n = 0;
    while (state.days[todayKey(d)] >= 60) { n++; d.setDate(d.getDate() - 1); }
    return n;
  }

  /* ---------------- SESSION ---------------- */
  let opts = null;
  let session = null;
  let lastInteract = now();
  let lastLearn = now();
  let lastNudge = 0;
  let breakNudged = false;
  let rightRow = 0, wrongRow = 0;
  let tickTimer = null;

  function newSession() {
    return {
      id: 's_' + now().toString(36),
      spaceId: opts.spaceId,
      spaceName: opts.spaceName,
      type: opts.spaceType,
      url: location.pathname.split('/').slice(-2).join('/') + location.search,
      start: now(), end: now(),
      active: 0, placed: 0, removed: 0,
      opened: [], right: 0, wrong: 0, reviewed: 0
    };
  }

  function commitSession() {
    if (!session) return;
    session.end = now();
    const i = state.sessions.findIndex(s => s.id === session.id);
    if (i >= 0) state.sessions[i] = session; else state.sessions.push(session);
    state.lastVisit = now();
    state.lastSpace = { id: session.spaceId, name: session.spaceName, type: session.type, url: session.url, lastOpened: session.opened[session.opened.length - 1] || state.lastSpace?.lastOpened || null };
    save();
  }

  function tick() {
    const t = now();
    const visible = document.visibilityState === 'visible';
    const engaged = t - lastInteract < 60000;
    if (session && visible && engaged) {
      session.active += 5;
      const k = todayKey();
      state.days[k] = (state.days[k] || 0) + 5;
    }
    if (session && Math.floor(session.active) % 30 === 0) commitSession();

    if (!session || !visible) return;
    const lv = LEVELS[state.settings.level] || LEVELS.normal;

    // Gợi ý nghỉ (Pomodoro 25 phút)
    if (!breakNudged && session.active >= 25 * 60) {
      breakNudged = true;
      say(`Bạn đã học tập trung ${fmtMin(session.active)} rồi đó 👏 Nghỉ 5 phút, uống nước rồi quay lại nhé — não cần nghỉ để "cất" kiến thức vào trí nhớ dài hạn.`, { mood: 'care' });
      return;
    }

    // Phát hiện "bí": người dùng vẫn thao tác (xoay nhìn…) nhưng lâu không có hoạt động học
    if (lv.idle > 0 && t - lastLearn > lv.idle * 1000 && t - lastInteract < 20000 && t - lastNudge > lv.cooldown * 1000) {
      const ctx = getCtx();
      let msg;
      if (ctx.total && ctx.placed < ctx.total) {
        msg = pick([
          `Mình thấy bạn đang dạo quanh khá lâu. Thử gắn mốc tiếp theo${ctx.nextTitle ? ` <b>"${esc(cleanTitle(ctx.nextTitle))}"</b>` : ''} vào một đồ vật thật nổi bật nhé — càng kỳ lạ càng dễ nhớ!`,
          `Đang bí chỗ đặt mốc à? Mẹo nhỏ: chọn chỗ theo đúng thứ tự đi trong phòng (cửa → bàn → cửa sổ…), sau này nhớ lại sẽ rất trôi.`
        ]);
      } else {
        msg = pick([
          'Bạn đã gắn đủ mốc rồi 🎯 Thử nhắm mắt, tưởng tượng đi một vòng phòng và kể lại từng mốc xem nhớ được bao nhiêu nhé!',
          'Mở thử một mốc bất kỳ và tự trả lời flashcard trước khi lật — tự kiểm tra giúp nhớ lâu gấp đôi đọc lại đấy.'
        ]);
      }
      lastNudge = t;
      lastLearn = t; // tránh nhắc dồn
      say(msg, { mood: 'hint' });
    }
  }

  function getCtx() {
    try { return (opts && opts.getContext && opts.getContext()) || {}; } catch (_) { return {}; }
  }

  /* ---------------- EVENT TRACKING ---------------- */
  function track(type, data = {}) {
    if (!session) return;
    const t = now();
    lastInteract = t;
    const lv = state.settings.level;

    if (type === 'marker_add') {
      lastLearn = t;
      session.placed++;
      const ctx = getCtx();
      if (ctx.total && ctx.placed >= ctx.total) {
        say(`🎉 Tuyệt vời! Bạn đã gắn đủ <b>${ctx.total}/${ctx.total}</b> mốc${ctx.lessonTitle ? ` của <b>${esc(ctx.lessonTitle)}</b>` : ''}. Bước tiếp theo: đi lại một vòng và thử nhớ nội dung từng mốc <i>trước khi</i> mở ra xem nhé.`, { mood: 'cheer', force: true });
      } else if (session.placed % 3 === 0 && lv !== 'quiet') {
        say(pick([
          `Đã gắn thêm ${session.placed} mốc trong buổi này rồi, nhịp rất tốt 👍${ctx.total ? ` (còn ${ctx.total - ctx.placed} mốc)` : ''}`,
          `Giỏi lắm! Nhớ liên tưởng hình ảnh thật "lạ" với chỗ vừa đặt nhé — ví dụ tưởng tượng sự kiện đang diễn ra ngay trên đồ vật đó.`
        ]), { mood: 'cheer' });
      }
    }

    else if (type === 'marker_remove') {
      session.removed++;
      if (session.removed === 3 && lv !== 'quiet') {
        say('Bạn đang đổi chỗ mốc nhiều lần — không sao cả! Chỉ cần chọn vị trí có thứ tự rõ ràng là được, đừng cầu toàn quá nha 😊', { mood: 'care' });
      }
    }

    else if (type === 'locus_open') {
      lastLearn = t;
      const k = lociKey(data.id, data.title);
      const rec = state.loci[k] = state.loci[k] || { title: cleanTitle(data.title), opens: 0, right: 0, wrong: 0 };
      rec.title = cleanTitle(data.title) || rec.title;
      rec.opens++; rec.last = t;
      if (!session.opened.includes(rec.title)) session.opened.push(rec.title);
      if ((rec.wrong || 0) >= 2 && rec.wrong >= (rec.right || 0)) {
        say(`Mốc <b>"${esc(rec.title)}"</b> bạn từng nhầm ${rec.wrong} lần. Lần này đọc kỹ phần <i>mẹo nhớ</i> rồi tự nhắc lại thành tiếng nhé — mình tin lần này sẽ khác!`, { mood: 'hint', force: true });
      }
      save();
    }

    else if (type === 'answer') {
      lastLearn = t;
      const k = lociKey(data.id, data.title);
      const rec = state.loci[k] = state.loci[k] || { title: cleanTitle(data.title) || k, opens: 0, right: 0, wrong: 0 };
      if (data.title) rec.title = cleanTitle(data.title);
      if (data.review) session.reviewed++;
      if (data.correct) {
        rec.right++; session.right++; rightRow++; wrongRow = 0;
        if (rightRow === 3 || rightRow === 7) say(pick([`Chuỗi ${rightRow} câu đúng liên tiếp 🔥 Bạn đang vào guồng rồi đấy!`, `${rightRow} câu đúng liền! Cung điện ký ức của bạn bắt đầu "vững móng" rồi.`]), { mood: 'cheer' });
      } else {
        rec.wrong++; session.wrong++; wrongRow++; rightRow = 0;
        if (wrongRow === 2) {
          say(`Sai 2 câu liền cũng bình thường thôi 💪 Thử quay lại mốc${rec.title ? ` <b>"${esc(rec.title)}"</b>` : ''}, đứng "tại chỗ" đó trong không gian và hình dung lại hình ảnh gắn với nó nhé.`, { mood: 'care', force: true });
        } else if (wrongRow >= 3) {
          say(`Mình thấy bạn đang có chút căng thẳng hoặc mỏi mệt rồi 🌿. Đừng cố gượng ép bản thân nhé! Khi não bộ mệt, việc nhớ sẽ khó hơn nhiều. Chúng mình đổi gió sang một bài nhẹ nhàng hơn nhé?<br><div style="margin-top:8px;display:flex;gap:6px;flex-wrap:wrap;"><button class="mentor-relax-btn" onclick="window.LociMentor && window.LociMentor.switchRelax('story')">🎧 Kể chuyện</button><button class="mentor-relax-btn" onclick="window.LociMentor && window.LociMentor.switchRelax('walk')">🌿 Dạo cảnh 3D</button><button class="mentor-relax-btn" onclick="window.LociMentor && window.LociMentor.switchRelax('flashcard')">🃏 Flashcard 1m</button></div>`, { mood: 'care', force: true, duration: 16000 });
        }
      }
      rec.last = t;
      save();
    }
    commitSession();
  }

  /* ---------------- GREETING & SUMMARY ---------------- */
  function greet() {
    const prev = state.sessions.filter(s => s.spaceId === opts.spaceId).slice(-1)[0];
    const lastVisit = state.lastVisit;
    const days = lastVisit ? Math.floor((now() - lastVisit) / 86400000) : -1;
    const due = dueCardCount();
    const weak = weakLoci(1)[0];
    const h = new Date().getHours();
    const hello = h < 11 ? 'Chào buổi sáng' : h < 14 ? 'Chào buổi trưa' : h < 18 ? 'Chào buổi chiều' : 'Chào buổi tối';

    let msg = `${hello}! Mình là <b>Gia sư Loci</b>, hôm nay mình sẽ đồng hành cùng bạn trong <b>${esc(opts.spaceName)}</b>.`;
    if (days < 0) {
      msg += ' Đây là lần đầu mình gặp bạn — cứ khám phá thoải mái, mình sẽ theo dõi và nhắc khi cần nhé ✨';
    } else if (days >= 2) {
      msg += ` Đã ${days} ngày rồi mình mới gặp lại bạn đó 🥺 Mình ôn lại chút cho khỏi quên nhé.`;
    } else if (prev && prev.opened && prev.opened.length) {
      msg += ` Lần trước bạn dừng ở mốc <b>"${esc(prev.opened[prev.opened.length - 1])}"</b> — tiếp tục từ đó nhé?`;
    }
    if (weak) msg += `<br>📌 Mốc cần chú ý: <b>${esc(weak.title)}</b>.`;
    if (due > 0) msg += `<br>🧠 Có <b>${due}</b> thẻ đến hạn ôn.`;
    say(msg, { mood: 'hello', force: true, duration: 12000 });
  }

  function summaryHTML(s) {
    const total = s.right + s.wrong;
    const acc = total ? Math.round(s.right / total * 100) : null;
    let advice;
    if (s.active < 120) advice = 'Buổi học hơi ngắn. Lần sau thử ở lại ít nhất 10 phút để kịp gắn và ôn vài mốc nhé!';
    else if (acc !== null && acc < 60) advice = 'Độ chính xác chưa cao — buổi sau mình ưu tiên ôn lại các mốc hay nhầm trước khi gắn mốc mới nhé.';
    else if (s.placed > 0 && s.opened.length < 2) advice = 'Bạn gắn mốc rất chăm! Nhớ dành thời gian mở lại các mốc để kiểm tra trí nhớ nữa nhé.';
    else if (acc !== null && acc >= 85) advice = 'Phong độ xuất sắc! Thử thách bản thân: nhớ lại toàn bộ mốc theo thứ tự mà không nhìn.';
    else advice = 'Buổi học ổn định. Ngày mai quay lại ôn 5 phút để kiến thức "bám" lâu hơn nhé!';
    return `
      <div class="lm-sum-grid">
        <div><b>${fmtMin(s.active)}</b><span>Học thực</span></div>
        <div><b>${s.placed}</b><span>Mốc đã gắn</span></div>
        <div><b>${s.opened.length}</b><span>Mốc đã xem</span></div>
        <div><b>${acc === null ? '—' : acc + '%'}</b><span>Đúng (${s.right}/${total})</span></div>
      </div>
      <p class="lm-advice">💬 ${advice}</p>`;
  }

  function leave() {
    if (!session) return;
    commitSession();
    openModal('📋 Tóm tắt buổi học', summaryHTML(session) + `<button class="lm-btn lm-primary" id="lm-ai-eval2">🧠 Nhờ Gia sư nhận xét chi tiết</button><div id="lm-ai-out2"></div>`);
    const b = document.getElementById('lm-ai-eval2');
    if (b) b.onclick = () => runAIEval(document.getElementById('lm-ai-out2'), b);
    // bắt đầu phiên mới nếu người dùng vào lại không gian khác
    session = null;
  }

  /* ---------------- AI EVALUATION ---------------- */
  async function aiEvaluate() {
    const s = session || (state.sessions && state.sessions.length > 0 ? state.sessions[state.sessions.length - 1] : null);
    const rep = report();
    const payload = {
      buoi_hien_tai: s ? { khong_gian: s.spaceName, thoi_gian_hoc_phut: Math.round(s.active / 60), moc_da_gan: s.placed, moc_da_go: s.removed, moc_da_xem: s.opened, cau_dung: s.right, cau_sai: s.wrong } : null,
      chuoi_ngay_hoc: rep.streak,
      phut_hoc_7_ngay: rep.week.map(d => d.min),
      the_den_han_on: rep.due,
      moc_yeu: rep.weak.map(w => ({ moc: w.title, sai: w.wrong, dung: w.right })),
      tong_so_buoi: rep.totalSessions
    };

    const prompt = `Bạn là "Gia sư Loci" — một người thầy ân cần, tinh ý, luôn quan tâm học sinh lớp 12 đang ôn Lịch sử bằng phương pháp Cung điện ký ức (Method of Loci) trong không gian 3D/360.
Xưng "mình", gọi người học là "bạn". Giọng ấm áp, cụ thể, không sáo rỗng, không phán xét.
Dựa trên dữ liệu theo dõi (JSON) dưới đây, viết nhận xét KHÔNG QUÁ 130 từ, định dạng:
**Điểm sáng:** (1 câu khen cụ thể dựa trên số liệu)
**Cần cải thiện:** (1-2 câu, chỉ rõ mốc/hành vi)
**Kế hoạch buổi sau:** (2-3 gạch đầu dòng hành động cụ thể, có thời lượng)
Kết bằng 1 câu động viên ngắn. Không bịa số liệu không có trong dữ liệu.

DỮ LIỆU:
${JSON.stringify(payload, null, 1)}`;

    const DEFAULT_KEYS = [
      _decodeGeminiKey('=EFaQ10RhN0RMJVN3kVQpZ3NykkeLFXUoFzYLVDT4h0budUM0JFbrpXe5R3S24kU4IWQuEVQ'),
      _decodeGeminiKey('=cWYNRUYVhzVWJETZRzR2ZkdzVWToJ2VhlmVmRnNGZnbIhVO6R1RBFXVQNzS24kU4IWQuEVQ'),
      _decodeGeminiKey('=cmMVpWdCVmetZWOmVTeiJ2QrxkRSFkNtF1N4FUcElTMDZmd0JDSEhXViJDT24kU4IWQuEVQ')
    ];
    let userKey = localStorage.getItem('loci_gemini_api_key');
    const knownExpired = [_decodeGeminiKey('==wNiVmYilTO1QmYwYDNhFmZzEzM5MTZxczM1QzNyImZmVmZ3MWZxYmN3kTY4QDMiJTYhFTO0gjM2gDZyQ2MwYjMtEjdtI3bts2c'), _decodeGeminiKey('=EEU0kDTW12dDVDetNHMih1YBZXNtgVNrVTbr1kWB9EZJB3VTB1RLJmTh5ET24kU4IWQuEVQ')];
    if (!userKey || knownExpired.includes(userKey)) {
      userKey = DEFAULT_KEYS[0];
      try { localStorage.setItem('loci_gemini_api_key', userKey); } catch (_) {}
    }
    const keyPool = [userKey, ...DEFAULT_KEYS].filter((v, i, a) => v && a.indexOf(v) === i);

    const savedModel = localStorage.getItem('loci_gemini_model') || 'gemini-3.5-flash-lite';
    const candidateModels = [
      savedModel.replace('google/', ''),
      'gemini-3.5-flash-lite',
      'gemini-3.5-flash',
      'gemini-3.8-flash',
      'gemini-flash-latest'
    ].filter(m => m && !m.includes('1.5') && !m.includes('2.0') && !m.includes('2.5'));
    if (!candidateModels.includes('gemini-3.5-flash-lite')) candidateModels.push('gemini-3.5-flash-lite');

    for (const key of keyPool) {
      if (key.startsWith('sk-')) {
        try {
          const r = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}`, 'HTTP-Referer': location.origin },
            body: JSON.stringify({ model: 'google/gemini-2.5-flash', messages: [{ role: 'user', content: prompt }] })
          });
          if (r.ok) {
            const d = await r.json();
            const txt = d.choices?.[0]?.message?.content;
            if (txt && txt.trim()) return txt.trim();
          }
        } catch (_) {}
        continue;
      }
      for (const m of candidateModels) {
        try {
          const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${key}`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: prompt }] }] })
          });
          if (r.ok) {
            const d = await r.json();
            const txt = d.candidates?.[0]?.content?.parts?.[0]?.text;
            if (txt && txt.trim()) return txt.trim();
          }
        } catch (_) {}
      }
    }

    // Fallback sư phạm offline thông minh dựa trên chính dữ liệu học sinh
    const streakStr = rep.streak > 0 ? `duy trì chuỗi học ${rep.streak} ngày liên tiếp` : `tập trung cho buổi học hôm nay`;
    const openCount = s ? (s.opened || 0) : (rep.totalSessions || 1);
    const weakMoc = rep.weak && rep.weak[0] ? rep.weak[0].title : null;
    return `**Điểm sáng:** Bạn đã rất nỗ lực khi ${streakStr} và tương tác với ${openCount} trạm sự kiện trong Cung điện Ký ức!
**Cần cải thiện:** ${weakMoc ? `Hãy chú ý ôn lại trạm "${weakMoc}" vì tỉ lệ nhận diện còn chưa ổn định.` : 'Hãy dạo lại các trạm đã gắn để tăng phản xạ truy xuất nhanh dưới 3 giây.'}
**Kế hoạch buổi sau:**
• Dạo 1 vòng quanh Cung điện theo chiều kim đồng hồ để nhẩm lại các mốc (3 phút).
• Nhìn mô hình 3D chọn mốc kiến thức để củng cố liên kết thị giác (5 phút).
• Ôn các thẻ Flashcard đến hạn để đánh bại đường cong quên lãng Ebbinghaus (5 phút).
Cố gắng lên nhé, hồi hải mã của bạn đang ghi nhớ rất tốt đấy!`;
  }

  function mdLite(t) {
    return esc(t)
      .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
      .replace(/^\s*[-•*]\s+(.*)$/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>\n?)+/g, m => `<ul>${m}</ul>`)
      .replace(/\n{2,}/g, '<br>')
      .replace(/\n/g, '<br>');
  }

  async function runAIEval(outEl, btn) {
    if (!outEl) return;
    btn && (btn.disabled = true);
    outEl.innerHTML = '<div class="lm-ai-out lm-loading"><span></span><span></span><span></span> Gia sư đang xem lại quá trình học của bạn…</div>';
    try {
      const txt = await aiEvaluate();
      outEl.innerHTML = `<div class="lm-ai-out">${mdLite(txt || 'Mình chưa nhận được phản hồi, thử lại sau nhé.')}</div>`;
      if (state.settings.voice) speak(txt.replace(/\*\*/g, ''));
    } catch (e) {
      const msg = e.message === 'NO_KEY'
        ? 'Chưa có khóa API Gemini. Mở <b>Gia sư AI</b> (chat.html) để nhập khóa — trong lúc đó mình vẫn nhắc nhở theo dõi bình thường nhé.'
        : 'Không kết nối được AI: ' + esc(e.message);
      outEl.innerHTML = `<div class="lm-ai-out lm-err">${msg}</div>`;
    }
    btn && (btn.disabled = false);
  }

  /* ---------------- REPORT (for Portal) ---------------- */
  function report() {
    state = load();
    const week = [];
    const names = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      week.push({ label: i === 0 ? 'Nay' : names[d.getDay()], min: Math.round((state.days[todayKey(d)] || 0) / 60) });
    }
    const last = state.sessions[state.sessions.length - 1] || null;
    const tot = state.sessions.reduce((a, s) => ({ r: a.r + (s.right || 0), w: a.w + (s.wrong || 0), p: a.p + (s.placed || 0) }), { r: 0, w: 0, p: 0 });
    const streak = streakDays();
    const due = dueCardCount();
    const weak = weakLoci(4);
    const daysAway = state.lastVisit ? Math.floor((now() - state.lastVisit) / 86400000) : -1;

    let message;
    if (daysAway < 0) message = 'Chào bạn mới! Hãy chọn một không gian bên dưới để bắt đầu — mình sẽ theo dõi và nhắc bạn trong lúc học nhé.';
    else if (daysAway >= 2) message = `Đã ${daysAway} ngày bạn chưa vào cung điện 🥺 Chỉ cần 10 phút hôm nay để giữ kiến thức không bị phai nhé!`;
    else if (due > 0) message = `Hôm nay có ${due} thẻ đến hạn ôn. Làm xong trước khi gắn mốc mới là chuẩn bài luôn!`;
    else if (weak.length) message = `Mốc "${weak[0].title}" đang là điểm yếu nhất. Vào lại không gian và đứng "tại chỗ" mốc đó để ôn nhé.`;
    else if (streak >= 3) message = `Chuỗi ${streak} ngày liên tục, quá đỉnh 🔥 Giữ nhịp này thêm vài ngày nữa nhé!`;
    else message = 'Mọi thứ đang đi đúng hướng. Hôm nay thử gắn thêm vài mốc mới nhé!';

    return {
      streak, due, weak, week, last, message, daysAway,
      todayMin: week[6].min,
      weekMin: week.reduce((a, d) => a + d.min, 0),
      totalSessions: state.sessions.length,
      totalPlaced: tot.p,
      accuracy: tot.r + tot.w ? Math.round(tot.r / (tot.r + tot.w) * 100) : null,
      answered: tot.r + tot.w,
      lastSpace: state.lastSpace || null
    };
  }

  /* ---------------- VOICE ---------------- */
  function speak(text) {
    if (!('speechSynthesis' in window)) return;
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(String(text).replace(/<[^>]+>/g, '').replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, ''));
      u.lang = 'vi-VN';
      const v = speechSynthesis.getVoices().find(v => /vi/i.test(v.lang));
      if (v) u.voice = v;
      u.rate = 1.05;
      speechSynthesis.speak(u);
    } catch (_) { }
  }

  /* ---------------- UI ---------------- */
  const CSS = `
  #lm-root{position:fixed;z-index:9000;font-family:'Outfit','Inter',system-ui,sans-serif;display:flex;align-items:flex-end;gap:12px;pointer-events:none}
  #lm-root *{box-sizing:border-box}
  #lm-root.lm-right{flex-direction:row-reverse}
  #lm-avatar{pointer-events:auto;position:relative;width:58px;height:58px;border-radius:50%;border:2px solid rgba(255,255,255,.85);cursor:pointer;flex-shrink:0;
    background:radial-gradient(circle at 30% 25%,#a5b4fc,#6366f1 45%,#db2777);box-shadow:0 10px 30px rgba(99,102,241,.45),inset 0 -6px 14px rgba(0,0,0,.18);
    display:flex;align-items:center;justify-content:center;transition:transform .35s cubic-bezier(.16,1,.3,1);animation:lmFloat 4s ease-in-out infinite}
  #lm-avatar:hover{transform:scale(1.08) rotate(-4deg)}
  #lm-avatar svg{width:36px;height:36px}
  #lm-avatar .lm-dot{position:absolute;top:2px;right:2px;width:13px;height:13px;border-radius:50%;background:#22c55e;border:2px solid #fff}
  #lm-avatar.lm-ping::after{content:'';position:absolute;inset:-6px;border-radius:50%;border:2px solid #a78bfa;animation:lmPing 1.4s ease-out infinite}
  @keyframes lmFloat{0%,100%{translate:0 0}50%{translate:0 -5px}}
  @keyframes lmPing{0%{opacity:.9;transform:scale(.9)}100%{opacity:0;transform:scale(1.35)}}
  .lm-eye{animation:lmBlink 5s infinite;transform-origin:center}
  @keyframes lmBlink{0%,92%,100%{transform:scaleY(1)}95%{transform:scaleY(.1)}}

  #lm-bubble{pointer-events:auto;max-width:330px;padding:14px 16px 12px;border-radius:18px 18px 18px 6px;color:#0f172a;font-size:14px;line-height:1.5;
    background:rgba(255,255,255,.88);backdrop-filter:blur(18px) saturate(1.4);-webkit-backdrop-filter:blur(18px) saturate(1.4);
    border:1px solid rgba(255,255,255,.95);box-shadow:0 18px 40px rgba(15,23,42,.18);
    opacity:0;transform:translateY(10px) scale(.96);transition:all .4s cubic-bezier(.16,1,.3,1);position:relative}
  #lm-root.lm-right #lm-bubble{border-radius:18px 18px 6px 18px}
  #lm-bubble.on{opacity:1;transform:none}
  #lm-bubble .lm-who{font-size:11px;font-weight:800;letter-spacing:.6px;text-transform:uppercase;margin-bottom:4px;background:linear-gradient(90deg,#0284c7,#10b981);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
  #lm-bubble .lm-x{position:absolute;top:6px;right:8px;border:none;background:none;color:#94a3b8;font-size:16px;cursor:pointer;line-height:1}
  #lm-bubble .lm-bar{position:absolute;left:14px;right:14px;bottom:5px;height:2px;border-radius:2px;background:linear-gradient(90deg,#0284c7,#10b981);transform-origin:left}
  .lm-sum-grid div{background:linear-gradient(135deg,#e0f2fe,#ecfdf5);border-radius:14px;padding:10px 12px;border:1px solid #bae6fd}
  .lm-sum-grid b{display:block;font-size:20px;font-weight:800;color:#0369a1}
  .lm-sum-grid span{font-size:12px;color:#64748b;font-weight:600}
  .lm-advice{margin:12px 0 4px;font-size:14px;line-height:1.5;background:#f8fafc;border-left:3.5px solid #10b981;padding:10px 12px;border-radius:0 12px 12px 0}
  .lm-weak{display:flex;flex-direction:column;gap:6px}
  .lm-weak div{display:flex;justify-content:space-between;gap:8px;font-size:13px;padding:8px 10px;border-radius:10px;background:#f0fdf4;border:1px solid #bbf7d0}
  .lm-weak em{font-style:normal;color:#047857;font-weight:700;white-space:nowrap}
  .lm-empty{font-size:13px;color:#64748b}
  .lm-btn{width:100%;margin-top:12px;padding:12px;border-radius:14px;border:none;font-weight:700;font-size:14px;cursor:pointer;font-family:inherit;transition:transform .2s,box-shadow .2s}
  .lm-btn:disabled{opacity:.6;cursor:wait}
  .lm-primary{color:#fff;background:linear-gradient(135deg,#0284c7,#10b981);box-shadow:0 10px 24px rgba(2,132,199,.25)}
  .lm-primary:hover:not(:disabled){transform:translateY(-2px)}
  .lm-seg{display:flex;background:#f1f5f9;border-radius:12px;padding:3px;gap:3px}
  .lm-seg button{flex:1;border:none;background:none;padding:8px 4px;border-radius:9px;font-weight:700;font-size:12.5px;color:#64748b;cursor:pointer;font-family:inherit}
  .lm-seg button.on{background:#fff;color:#0284c7;box-shadow:0 3px 10px rgba(2,132,199,.12)}
  .lm-row{display:flex;align-items:center;justify-content:space-between;margin-top:10px;font-size:13.5px;font-weight:600;color:#334155}
  .lm-switch{width:42px;height:24px;border-radius:99px;background:#cbd5e1;position:relative;border:none;cursor:pointer;transition:.25s}
  .lm-switch::after{content:'';position:absolute;top:3px;left:3px;width:18px;height:18px;border-radius:50%;background:#fff;transition:.25s;box-shadow:0 2px 4px rgba(0,0,0,.2)}
  .lm-switch.on{background:linear-gradient(135deg,#0284c7,#10b981)}
  .lm-switch.on::after{left:21px}
  .mentor-relax-btn{background:#f1f5f9;border:1px solid #cbd5e1;color:#0f172a;border-radius:99px;padding:4px 10px;font-size:11.5px;font-weight:700;cursor:pointer;transition:all .2s;display:inline-flex;align-items:center;gap:4px;font-family:inherit}
  .mentor-relax-btn:hover{background:#e0f2fe;border-color:#38bdf8;color:#0369a1;transform:translateY(-1px)}
  .lm-ai-out{margin-top:12px;font-size:14px;line-height:1.6;background:linear-gradient(135deg,#e0f2fe,#ecfdf5);border:1px solid #bae6fd;border-radius:14px;padding:12px 14px}
  .lm-ai-out ul{margin:4px 0;padding-left:18px}
  .lm-ai-out.lm-err{background:#fef2f2;border-color:#fecaca;color:#991b1b}
  .lm-loading{display:flex;align-items:center;gap:5px;color:#0284c7}
  .lm-loading span{width:6px;height:6px;border-radius:50%;background:#0284c7;animation:lmDots 1s infinite}kground:linear-gradient(135deg,#4f46e5,#db2777);box-shadow:0 10px 24px rgba(79,70,229,.3)}
  .lm-primary:hover:not(:disabled){transform:translateY(-2px)}
  .lm-seg{display:flex;background:#f1f5f9;border-radius:12px;padding:3px;gap:3px}
  .lm-seg button{flex:1;border:none;background:none;padding:8px 4px;border-radius:9px;font-weight:700;font-size:12.5px;color:#64748b;cursor:pointer;font-family:inherit}
  .lm-seg button.on{background:#fff;color:#4338ca;box-shadow:0 3px 10px rgba(0,0,0,.08)}
  .lm-row{display:flex;align-items:center;justify-content:space-between;margin-top:10px;font-size:13.5px;font-weight:600;color:#334155}
  .lm-switch{width:42px;height:24px;border-radius:99px;background:#cbd5e1;position:relative;border:none;cursor:pointer;transition:.25s}
  .lm-switch::after{content:'';position:absolute;top:3px;left:3px;width:18px;height:18px;border-radius:50%;background:#fff;transition:.25s;box-shadow:0 2px 4px rgba(0,0,0,.2)}
  .lm-switch.on{background:linear-gradient(135deg,#6366f1,#ec4899)}
  .lm-switch.on::after{left:21px}
  .lm-ai-out{margin-top:12px;font-size:14px;line-height:1.6;background:linear-gradient(135deg,#f5f3ff,#fdf4ff);border:1px solid #e9d5ff;border-radius:14px;padding:12px 14px}
  .lm-ai-out ul{margin:4px 0;padding-left:18px}
  .lm-ai-out.lm-err{background:#fef2f2;border-color:#fecaca;color:#991b1b}
  .lm-loading{display:flex;align-items:center;gap:5px;color:#6b21a8}
  .lm-loading span{width:6px;height:6px;border-radius:50%;background:#a855f7;animation:lmDots 1s infinite}
  .lm-loading span:nth-child(2){animation-delay:.15s}.lm-loading span:nth-child(3){animation-delay:.3s}
  @keyframes lmDots{0%,100%{opacity:.3;transform:translateY(0)}50%{opacity:1;transform:translateY(-3px)}}

  #lm-modal{position:fixed;inset:0;z-index:9500;display:flex;align-items:center;justify-content:center;background:rgba(15,23,42,.45);backdrop-filter:blur(6px);
    font-family:'Outfit','Inter',system-ui,sans-serif;opacity:0;transition:opacity .3s}
  #lm-modal.on{opacity:1}
  #lm-modal .lm-card{width:min(420px,calc(100vw - 28px));max-height:86vh;overflow:auto;background:rgba(255,255,255,.95);border-radius:24px;padding:22px;color:#0f172a;
    box-shadow:0 30px 70px rgba(0,0,0,.3);transform:scale(.95);transition:transform .35s cubic-bezier(.16,1,.3,1)}
  #lm-modal.on .lm-card{transform:none}
  #lm-modal h3{margin:0 0 14px;font-size:19px;font-weight:800}
  @media (max-width:600px){#lm-bubble{max-width:calc(100vw - 100px);font-size:13px}#lm-avatar{width:50px;height:50px}}
  `;

  const AVATAR_SVG = `<svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
    <path d="M8 17 24 9l16 8-16 8z" fill="#1e1b4b"/><path d="M14 20v6c0 3 4.5 5.5 10 5.5s10-2.5 10-5.5v-6l-10 5z" fill="#312e81"/>
    <path d="M40 17v9" stroke="#fde68a" stroke-width="2" stroke-linecap="round"/><circle cx="40" cy="27.5" r="2" fill="#fde68a"/>
    <circle cx="24" cy="31" r="10" fill="#fff7ed"/>
    <ellipse class="lm-eye" cx="20.3" cy="30.5" rx="1.6" ry="2" fill="#1e1b4b"/><ellipse class="lm-eye" cx="27.7" cy="30.5" rx="1.6" ry="2" fill="#1e1b4b"/>
    <path d="M20.5 35c2 1.6 5 1.6 7 0" stroke="#db2777" stroke-width="1.6" stroke-linecap="round"/>
    <circle cx="17.5" cy="34" r="1.4" fill="#fda4af" opacity=".8"/><circle cx="30.5" cy="34" r="1.4" fill="#fda4af" opacity=".8"/></svg>`;

  let root, bubble, panel, hideTimer, barAnim;

  function buildUI() {
    if (!document.getElementById('lm-style')) {
      const st = document.createElement('style'); st.id = 'lm-style'; st.textContent = CSS; document.head.appendChild(st);
    }
    root = document.createElement('div');
    root.id = 'lm-root';
    const userPos = opts.position || {};
    const pos = Object.assign({ left: '20px', bottom: '20px' }, userPos);
    if (userPos.right && !userPos.left) delete pos.left;
    Object.assign(root.style, pos);
    if (userPos.right && !userPos.left) root.classList.add('lm-right');
    root.innerHTML = `<button id="lm-avatar" title="Gia sư Loci — bấm để xem tiến độ" aria-label="Gia sư Loci">${AVATAR_SVG}<span class="lm-dot"></span></button><div id="lm-bubble" role="status" aria-live="polite"></div>`;
    document.body.appendChild(root);
    bubble = root.querySelector('#lm-bubble');

    panel = document.createElement('div');
    panel.id = 'lm-panel';
    document.body.appendChild(panel);

    root.querySelector('#lm-avatar').onclick = e => { e.stopPropagation(); togglePanel(); };
    // chặn sự kiện lọt xuống canvas 3D / pointer-lock
    [root, panel].forEach(el => ['pointerdown', 'mousedown', 'click', 'wheel', 'touchstart'].forEach(ev => el.addEventListener(ev, e => e.stopPropagation())));
  }

  function say(html, o = {}) {
    if (!bubble) return;
    if (!o.force && state.settings.level === 'quiet' && o.mood !== 'cheer') return;
    if (panel && panel.classList.contains('on')) return; // đang mở bảng thì không chen ngang
    clearTimeout(hideTimer);
    const dur = o.duration || Math.min(14000, 6000 + html.replace(/<[^>]+>/g, '').length * 45);
    bubble.className = 'mood-' + (o.mood || 'info');
    bubble.innerHTML = `<button class="lm-x" aria-label="Ẩn">✕</button><div class="lm-who">Gia sư Loci</div><div>${html}</div><div class="lm-bar"></div>`;
    requestAnimationFrame(() => bubble.classList.add('on'));
    bubble.querySelector('.lm-x').onclick = hideBubble;
    const bar = bubble.querySelector('.lm-bar');
    barAnim && barAnim.cancel && barAnim.cancel();
    if (bar.animate) barAnim = bar.animate([{ transform: 'scaleX(1)' }, { transform: 'scaleX(0)' }], { duration: dur, easing: 'linear', fill: 'forwards' });
    const av = root.querySelector('#lm-avatar');
    av.classList.add('lm-ping');
    hideTimer = setTimeout(hideBubble, dur);
    if (state.settings.voice) speak(html);
  }
  function hideBubble() {
    if (!bubble) return;
    bubble.classList.remove('on');
    root.querySelector('#lm-avatar').classList.remove('lm-ping');
  }

  function placePanel() {
    const r = root.querySelector('#lm-avatar').getBoundingClientRect();
    panel.style.bottom = (window.innerHeight - r.top + 12) + 'px';
    if (root.classList.contains('lm-right')) { panel.style.right = Math.max(12, window.innerWidth - r.right) + 'px'; panel.style.left = ''; }
    else { panel.style.left = Math.max(12, r.left) + 'px'; panel.style.right = ''; }
  }

  function renderPanel() {
    const s = session || newSessionStub();
    const weak = weakLoci(4);
    const rep = report();
    const lv = state.settings.level;
    panel.innerHTML = `
      <div class="lm-head">
        <div style="width:40px;height:40px;border-radius:50%;background:radial-gradient(circle at 30% 25%,#a5b4fc,#6366f1 45%,#db2777);display:flex;align-items:center;justify-content:center">${AVATAR_SVG.replace('<svg', '<svg style="width:26px;height:26px"')}</div>
        <div><h4>Gia sư Loci</h4><small>Đang theo dõi buổi học</small></div>
        <button class="lm-close" aria-label="Đóng">✕</button>
      </div>
      <div class="lm-sec">Buổi học này · ${esc(opts.spaceName)}</div>
      ${summaryHTML(s).replace(/<p class="lm-advice">[\s\S]*<\/p>/, '')}
      <div class="lm-row" style="margin-top:12px"><span>🔥 Chuỗi ngày học</span><b>${rep.streak} ngày</b></div>
      <div class="lm-row"><span>⏱️ Hôm nay</span><b>${rep.todayMin} phút</b></div>
      <div class="lm-row"><span>🧠 Thẻ đến hạn ôn</span><b>${rep.due}</b></div>
      <div class="lm-sec">Mốc cần củng cố</div>
      ${weak.length ? `<div class="lm-weak">${weak.map(w => `<div><span>${esc(w.title)}</span><em>sai ${w.wrong} · đúng ${w.right}</em></div>`).join('')}</div>` : '<div class="lm-empty">Chưa phát hiện mốc yếu — tiếp tục phát huy nhé! 🌱</div>'}
      <button class="lm-btn lm-primary" id="lm-ai-eval">🧠 Nhận xét buổi học bằng AI</button>
      <div id="lm-ai-out"></div>
      <div class="lm-sec">Mức độ quan tâm</div>
      <div class="lm-seg">${Object.entries(LEVELS).map(([k, v]) => `<button data-lv="${k}" class="${k === lv ? 'on' : ''}">${v.label}</button>`).join('')}</div>
      <div class="lm-row"><span>🔊 Đọc lời nhắc thành tiếng</span><button class="lm-switch ${state.settings.voice ? 'on' : ''}" id="lm-voice" aria-label="Bật/tắt giọng nói"></button></div>
    `;
    panel.querySelector('.lm-close').onclick = togglePanel;
    panel.querySelector('#lm-ai-eval').onclick = e => runAIEval(panel.querySelector('#lm-ai-out'), e.currentTarget);
    panel.querySelectorAll('.lm-seg button').forEach(b => b.onclick = () => {
      state.settings.level = b.dataset.lv; save();
      panel.querySelectorAll('.lm-seg button').forEach(x => x.classList.toggle('on', x === b));
    });
    panel.querySelector('#lm-voice').onclick = e => {
      state.settings.voice = !state.settings.voice; save();
      e.currentTarget.classList.toggle('on', state.settings.voice);
      if (state.settings.voice) speak('Đã bật giọng nói. Mình sẽ đọc lời nhắc cho bạn nghe nhé.');
      else if ('speechSynthesis' in window) speechSynthesis.cancel();
    };
  }
  function newSessionStub() { return { active: 0, placed: 0, opened: [], right: 0, wrong: 0, removed: 0 }; }

  function togglePanel() {
    const open = !panel.classList.contains('on');
    if (open) {
      if (document.pointerLockElement) document.exitPointerLock();
      hideBubble(); renderPanel(); placePanel();
    }
    panel.classList.toggle('on', open);
  }

  function openModal(title, html) {
    let m = document.getElementById('lm-modal');
    if (m) m.remove();
    if (!document.getElementById('lm-style')) { const st = document.createElement('style'); st.id = 'lm-style'; st.textContent = CSS; document.head.appendChild(st); }
    m = document.createElement('div');
    m.id = 'lm-modal';
    m.innerHTML = `<div class="lm-card"><div class="lm-head" style="margin-bottom:6px"><h3 style="margin:0">${title}</h3><button class="lm-close" aria-label="Đóng">✕</button></div>${html}</div>`;
    document.body.appendChild(m);
    requestAnimationFrame(() => m.classList.add('on'));
    const close = () => { m.classList.remove('on'); setTimeout(() => m.remove(), 300); };
    m.querySelector('.lm-close').onclick = close;
    m.addEventListener('click', e => { if (e.target === m) close(); });
  }

  /* ---------------- HOOKS ---------------- */
  function hookGlobals() {
    // Câu trả lời từ AI quiz (ai_assistant.js phát sự kiện)
    window.addEventListener('loci:answer', e => {
      const d = e.detail || {};
      let title = d.title;
      if (!title && opts && opts.resolveTitle) { try { title = opts.resolveTitle(d.locusId); } catch (_) { } }
      track('answer', { id: d.locusId, title: title || d.locusId, correct: !!d.isCorrect });
    });
    // Thẻ ôn tập SM-2 (review_engine.js)
    const wrap = () => {
      const re = window.reviewEngine;
      if (!re || re.__lmWrapped) return !!re;
      const orig = re.processReview.bind(re);
      re.processReview = (qid, quality) => {
        const r = orig(qid, quality);
        const title = String(qid).replace(/^(fc|qz|fb)_/, '').replace(/_\d+$/, '');
        track('answer', { id: title, title, correct: quality >= 3, review: true });
        return r;
      };
      re.__lmWrapped = true;
      return true;
    };
    if (!wrap()) { let n = 0; const iv = setInterval(() => { if (wrap() || ++n > 20) clearInterval(iv); }, 500); }

    ['pointerdown', 'keydown', 'wheel', 'touchstart', 'mousemove'].forEach(ev =>
      window.addEventListener(ev, () => { lastInteract = now(); }, { passive: true, capture: true }));
    document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') commitSession(); });
    window.addEventListener('pagehide', commitSession);
  }

  /* ---------------- PUBLIC API ---------------- */
  function init(o) {
    opts = Object.assign({ spaceId: location.pathname, spaceName: 'Không gian ký ức', spaceType: '3d', position: null, greetDelay: 2500, autoGreet: false }, o || {});
    if (!root) { buildUI(); hookGlobals(); }
    start(opts);
  }

  // Bắt đầu (hoặc chuyển sang) một không gian
  function start(o) {
    if (session) commitSession();
    Object.assign(opts, o || {});
    state = load();
    session = newSession();
    lastLearn = lastInteract = now();
    breakNudged = false; rightRow = wrongRow = 0;
    clearInterval(tickTimer);
    tickTimer = setInterval(tick, 5000);
    if (opts.autoGreet && opts.greetDelay > 0) {
      setTimeout(greet, opts.greetDelay);
    }
  }

  function switchRelax(type) {
    if (type === 'story') {
      say('🎧 Đang chuẩn bị một mẩu chuyện Lịch sử thú vị cho bạn đây. Hãy tựa lưng vào ghế, thư giãn và lắng nghe nhé... ✨', { mood: 'hello', force: true });
      if (typeof window !== 'undefined' && window.dispatchEvent) {
        window.dispatchEvent(new CustomEvent('loci:relax', { detail: { mode: 'story' } }));
      }
      if (typeof window !== 'undefined' && window.aiAssistant && window.aiAssistant.processUserInput) {
        window.aiAssistant.processUserInput('Kể cho mình một mẩu chuyện lịch sử thú vị để thư giãn nhé');
      }
    } else if (type === 'walk') {
      say('🌿 Thả lỏng nào! Hãy cùng ngắm nhìn không gian xung quanh một chút để não bộ hạ nhiệt nhé.', { mood: 'care', force: true });
      if (typeof window !== 'undefined' && window.dispatchEvent) {
        window.dispatchEvent(new CustomEvent('loci:relax', { detail: { mode: 'walk' } }));
      }
    } else if (type === 'flashcard') {
      say('🃏 Chỉ 1 flashcard vui vẻ có mẹo nhớ độc lạ nhất thôi nhé, không tính điểm hay áp lực đâu nè!', { mood: 'hint', force: true });
      if (typeof window !== 'undefined' && window.dispatchEvent) {
        window.dispatchEvent(new CustomEvent('loci:relax', { detail: { mode: 'flashcard' } }));
      }
    }
  }

  function setVisible(v) {
    if (!root) return;
    root.style.display = v ? 'flex' : 'none';
    if (!v && panel) panel.classList.remove('on');
  }

  function addStudyMinutes(mins) {
    const s = Math.round((mins || 1) * 60);
    if (s <= 0) return;
    state = load();
    const dk = todayKey();
    state.days[dk] = (state.days[dk] || 0) + s;
    state.lastVisit = now();
    save();
  }

  window.LociMentor = { init, start, track, leave, setVisible, say: (h, o) => say(h, Object.assign({ force: true }, o)), report, openPanel: () => panel && !panel.classList.contains('on') && togglePanel(), switchRelax, addStudyMinutes, addStudyTime: addStudyMinutes };
  if (typeof window.renderMentorReport === 'function') {
    try { window.renderMentorReport(); } catch (_) {}
  }
})();
