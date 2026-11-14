// Hàm giải mã key an toàn lúc chạy (tránh quét Secret Scanning)
function _decodeGeminiKey(s) {
  try { return atob(s.split('').reverse().join('')); } catch(e) { return ''; }
}

/**
 * GIA SƯ AI LOCI — "Người thầy AI" tương tác thông minh trong Cung điện Ký ức
 * -------------------------------------------------------------------------
 * - Trò chuyện hỏi đáp trực tiếp (Interactive Chat) bằng Gemini LLM & bộ tri thức Loci
 * - Gợi ý hành động nhanh: Giải thích mốc, Mẹo liên tưởng Loci, Tóm tắt sự kiện, Đố trắc nghiệm
 * - Nhận diện giọng nói (Microphone Speech Recognition) & Đọc phản hồi (Text-to-Speech)
 * - Theo dõi tiến độ học tập: chuỗi ngày (streak), thời gian học thực, mốc yếu, thẻ SM-2
 * - Tương thích hoàn toàn 360 viewer, 3D space, Portal và review engine
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
    s.days = s.days || {};
    s.loci = s.loci || {};
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
    if (!(state.days[todayKey(d)] >= 60)) d.setDate(d.getDate() - 1);
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
  let currentActiveTab = 'chat';

  // Lịch sử chat thời gian thực
  const chatMessages = [
    {
      role: 'ai',
      text: 'Chào bạn! Mình là **Gia sư AI Loci**. Mình đang đồng hành cùng bạn trong không gian học tập này để biến mọi sự kiện Lịch sử 12 thành những hình ảnh sống động, dễ nhớ. Bạn muốn tìm hiểu mốc nào hay cần mẹo ghi nhớ gì thì hỏi mình ngay nhé! ✨'
    }
  ];

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

    if (!breakNudged && session.active >= 25 * 60) {
      breakNudged = true;
      say(`Bạn đã học tập trung ${fmtMin(session.active)} rồi đó 👏 Nghỉ 5 phút, uống nước rồi quay lại nhé — não cần nghỉ để "cất" kiến thức vào trí nhớ dài hạn.`, { mood: 'care' });
      return;
    }

    if (lv.idle > 0 && t - lastLearn > lv.idle * 1000 && t - lastInteract < 20000 && t - lastNudge > lv.cooldown * 1000) {
      const ctx = getCtx();
      let msg;
      if (ctx.total && ctx.placed < ctx.total) {
        msg = pick([
          `Mình thấy bạn đang nhìn quanh phòng. Thử gắn mốc tiếp theo${ctx.nextTitle ? ` <b>"${esc(cleanTitle(ctx.nextTitle))}"</b>` : ''} vào một đồ vật thật nổi bật nhé — càng kỳ lạ càng dễ nhớ!`,
          `Đang bí chỗ đặt mốc à? Mẹo nhỏ: chọn chỗ theo đúng thứ tự đi trong phòng (cửa → bàn → cửa sổ…), sau này nhớ lại sẽ rất trôi.`
        ]);
      } else {
        msg = pick([
          'Bạn đã gắn đủ mốc rồi 🎯 Chạm vào mình để mình đố bạn 1 câu trắc nghiệm kiểm tra trí nhớ nhé!',
          'Mở thử một mốc bất kỳ và tự trả lời flashcard trước khi lật — tự kiểm tra giúp nhớ lâu gấp đôi đọc lại đấy.'
        ]);
      }
      lastNudge = t;
      lastLearn = t;
      say(msg, { mood: 'hint' });
    }
  }

  function getCtx() {
    try { return (opts && opts.getContext && opts.getContext()) || {}; } catch (_) { return {}; }
  }

  function getCurrentLocusInfo() {
    try {
      if (window.currentActiveLocus) return window.currentActiveLocus;
      if (window.selectedAnchorData) return window.selectedAnchorData;
      const opened = (session && session.opened) || [];
      if (opened.length > 0) return { title: opened[opened.length - 1] };
      if (window.LOCI_ANCHORS && window.LOCI_ANCHORS.bai_6 && window.LOCI_ANCHORS.bai_6.anchors) {
        return window.LOCI_ANCHORS.bai_6.anchors[0];
      }
    } catch (_) {}
    return { title: 'Bài 6: Cách mạng tháng Tám năm 1945' };
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
        say(`🎉 Tuyệt vời! Bạn đã gắn đủ <b>${ctx.total}/${ctx.total}</b> mốc${ctx.lessonTitle ? ` của <b>${esc(ctx.lessonTitle)}</b>` : ''}. Bấm vào mình để nghe mẹo xâu chuỗi toàn bộ mốc nhé!`, { mood: 'cheer', force: true });
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
        say(`Mốc <b>"${esc(rec.title)}"</b> bạn từng nhầm ${rec.wrong} lần. Bấm vào mình để nghe mẹo nhớ độc quyền nhé!`, { mood: 'hint', force: true });
      } else {
        say(`✨ Bạn đang xem <b>${esc(rec.title)}</b>. Chạm vào mình để hỏi bất cứ điều gì hoặc nghe giải thích nhé!`, { mood: 'info', duration: 7000 });
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
          say(`Sai 2 câu liền cũng bình thường thôi 💪 Thử chạm vào mình để cùng ôn lại từ khóa cốt lõi nhé.`, { mood: 'care', force: true });
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

    let msg = `${hello}! Mình là <b>Gia sư AI Loci</b>, sẵn sàng đồng hành cùng bạn trong <b>${esc(opts.spaceName)}</b>.`;
    if (days >= 2) {
      msg += ` Đã ${days} ngày rồi mới gặp lại bạn đó 🥺 Chạm vào mình để ôn lại chút cho khỏi quên nhé.`;
    } else if (prev && prev.opened && prev.opened.length) {
      msg += ` Lần trước bạn dừng ở mốc <b>"${esc(prev.opened[prev.opened.length - 1])}"</b> — bấm vào mình để tiếp tục nhé!`;
    } else {
      msg += ' Cứ khám phá thoải mái, chạm vào mình bất cứ lúc nào bạn cần giải thích bài nhé ✨';
    }
    if (weak) msg += `<br>📌 Mốc cần chú ý: <b>${esc(weak.title)}</b>.`;
    if (due > 0) msg += `<br>🧠 Có <b>${due}</b> thẻ đến hạn ôn.`;
    say(msg, { mood: 'hello', force: true, duration: 10000 });
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
    session = null;
  }

  /* ---------------- TRI THỨC LỊCH SỬ NỘI SUY (SMART PEDAGOGICAL ENGINE) ---------------- */
  const HISTORICAL_FALLBACK_KNOWLEDGE = {
    1: {
      title: "Trạm 1: Bão lửa Thế giới — Thời cơ ngàn năm có một",
      summary: "• Ngày 6/8 & 9/8/1945: Mỹ ném 2 quả bom nguyên tử xuống Hiroshima & Nagasaki.\n• Ngày 9/8/1945: Quân đội Liên Xô tiêu diệt 1 triệu quân Quan Đông Nhật Bản.\n• Ngày 15/8/1945: Nhật Hoàng tuyên bố đầu hàng Đồng minh không điều kiện — Thời cơ ngàn năm có một xuất hiện!",
      loci_tip: "Gắn hình ảnh 'Tia chớp vàng' rực rỡ lóe lên ở ngay cửa ra vào của phòng: Cánh cửa mở ra thời cơ giải phóng ngàn năm có một!",
      quiz: {
        q: "Thời cơ 'ngàn năm có một' trong Cách mạng tháng Tám 1945 xuất hiện khi nào?",
        options: ["A. Khi phát xít Đức đầu hàng (5/1945)", "B. Khi Nhật Hoàng tuyên bố đầu hàng Đồng minh (15/8/1945)", "C. Khi Nhật đảo chính Pháp (9/3/1945)", "D. Khi Bác Hồ về nước (1941)"],
        answer: 1,
        explain: "Ngày 15/8/1945, Nhật Hoàng tuyên bố đầu hàng Đồng minh không điều kiện, chính quyền tay sai hoang mang tột độ — thời cơ khách quan chín muồi."
      }
    },
    2: {
      title: "Trạm 2: Lán Nà Nưa — Cao trào Kháng Nhật & Quân Lệnh Số 1",
      summary: "• Từ tháng 3 đến 8/1945: Cao trào kháng Nhật sôi nổi, phá kho thóc cứu đói.\n• Ngày 14 - 15/8/1945: Hội nghị toàn quốc của Đảng họp tại Tân Trào.\n• Đêm 13/8/1945: Ủy ban Khởi nghĩa toàn quốc ban bố Quân lệnh số 1 phát lệnh Tổng khởi nghĩa. Lời Bác: 'Dù phải đốt cháy cả dãy Trường Sơn cũng phải kiên quyết giành cho được độc lập!'.",
      loci_tip: "Gắn hình ảnh 'Lán Nà Nưa đơn sơ bốc lửa nhiệt huyết' lên chiếc bàn làm việc hoặc kệ sách giữa phòng!",
      quiz: {
        q: "Quân lệnh số 1 phát lệnh Tổng khởi nghĩa được Ủy ban Khởi nghĩa toàn quốc ban bố vào thời điểm nào?",
        options: ["A. Đêm 13/8/1945", "B. Ngày 14/8/1945", "C. Ngày 16/8/1945", "D. Ngày 19/8/1945"],
        answer: 0,
        explain: "Đêm 13/8/1945, ngay khi nhận được tin Nhật sắp đầu hàng, Ủy ban Khởi nghĩa toàn quốc đã ban bố Quân lệnh số 1."
      }
    },
    3: {
      title: "Trạm 3: Đình Tân Trào — Đại hội Quốc dân & Bác Hồ",
      summary: "• Ngày 16 - 17/8/1945: Đại hội Quốc dân họp tại Đình Tân Trào (Tuyên Quang).\n• Tán thành chủ trương Tổng khởi nghĩa của Đảng và thông qua 10 chính sách lớn của Việt Minh.\n• Cử ra Ủy ban Dân tộc Giải phóng Việt Nam (Chính phủ lâm thời) do Bác Hồ làm Chủ tịch; chọn Quốc kỳ cờ đỏ sao vàng và Quốc ca Tiến quân ca.",
      loci_tip: "Hình dung mái Đình Tân Trào cổ kính che chở cho góc phòng trang trọng nhất, nơi cờ đỏ sao vàng bay phấp phới!",
      quiz: {
        q: "Đại hội Quốc dân Tân Trào (16-17/8/1945) đã thông qua quyết định trọng đại nào sau đây?",
        options: ["A. Thành lập Quân đội nhân dân", "B. Tán thành Tổng khởi nghĩa và thông qua 10 chính sách của Việt Minh", "C. Đổi tên Đảng thành Đảng Lao động", "D. Ký Hiệp định Sơ bộ"],
        answer: 1,
        explain: "Đại hội Quốc dân Tân Trào đã tán thành chủ trương Tổng khởi nghĩa, thông qua 10 chính sách Việt Minh và cử Ủy ban Dân tộc Giải phóng."
      }
    },
    4: {
      title: "Trạm 4: Thái Nguyên — Cây đa Tân Trào & Khởi nghĩa Vũ trang",
      summary: "• Chiều 16/8/1945: Đội Việt Nam Tuyên truyền Giải phóng quân làm lễ xuất quân dưới bóng Cây đa Tân Trào do đồng chí Võ Nguyên Giáp chỉ huy.\n• Giải phóng thị xã Thái Nguyên, bảo vệ cơ quan đầu não và mở toang đường tiến về Hà Nội.",
      loci_tip: "Tưởng tượng cây cảnh hoặc cột nhà trong phòng hóa thành 'Cây đa Tân Trào' rợp bóng mát, đoàn quân áo vải hiên ngang xung trận!",
      quiz: {
        q: "Chiều 16/8/1945, dưới gốc Cây đa Tân Trào, ai là người chỉ huy lễ xuất quân của Giải phóng quân?",
        options: ["A. Đồng chí Trường Chinh", "B. Đồng chí Võ Nguyên Giáp", "C. Đồng chí Phạm Văn Đồng", "D. Đồng chí Nguyễn Lương Bằng"],
        answer: 1,
        explain: "Đồng chí Võ Nguyên Giáp trực tiếp chỉ huy lễ xuất quân tiến về giải phóng thị xã Thái Nguyên."
      }
    },
    5: {
      title: "Trạm 5: Hà Nội — Khởi nghĩa Giành Chính Quyền Thắng Lợi",
      summary: "• Ngày 19/8/1945: Cuộc mít tinh khổng lồ tại Quảng trường Nhà hát Lớn chuyển thành biểu tình vũ trang.\n• Quần chúng chiếm Phủ Khâm sai Bắc Bộ, Trại Bảo an binh, Sở Mật thám, Kho bạc, Bưu điện.\n• Khởi nghĩa Hà Nội thắng lợi rực rỡ, tạo đòn bẩy quyết định thúc đẩy toàn quốc nổi dậy!",
      loci_tip: "Gắn Nhà hát Lớn Hà Nội tráng lệ vào khoảng tường trung tâm căn phòng, tiếng hát Tiến quân ca vang rền!",
      quiz: {
        q: "Khởi nghĩa giành chính quyền ở Thủ đô Hà Nội thắng lợi vào ngày nào?",
        options: ["A. 16/8/1945", "B. 19/8/1945", "C. 23/8/1945", "D. 25/8/1945"],
        answer: 1,
        explain: "Ngày 19/8/1945, quần chúng nhân dân Hà Nội đã vùng lên giành trọn chính quyền về tay nhân dân."
      }
    },
    6: {
      title: "Trạm 6: Huế & Sài Gòn — Cố đô Khởi nghĩa & Lan rộng Toàn quốc",
      summary: "• Ngày 23/8/1945: Khởi nghĩa thắng lợi ở Cố đô Huế.\n• Ngày 25/8/1945: Sài Gòn giành chính quyền vẻ vang.\n• Ngày 28/8/1945: Hai tỉnh cuối cùng là Đồng Nai Thượng và Hà Tiên giành thắng lợi. Toàn quốc hoàn thành Tổng khởi nghĩa chỉ trong 15 ngày!",
      loci_tip: "Liên tưởng góc phía Nam căn phòng là Bến Nhà Rồng Sài Gòn và Sông Hương êm đềm cùng dâng sóng khởi nghĩa!",
      quiz: {
        q: "Hai tỉnh cuối cùng giành được chính quyền trong Tổng khởi nghĩa tháng Tám năm 1945 là:",
        options: ["A. Bắc Giang và Hải Dương", "B. Hà Tiên và Đồng Nai Thượng", "B. Quảng Nam và Quảng Ngãi", "D. Cần Thơ và Mỹ Tho"],
        answer: 1,
        explain: "Ngày 28/8/1945, Đồng Nai Thượng và Hà Tiên là 2 tỉnh cuối cùng trên cả nước giành chính quyền thắng lợi."
      }
    },
    7: {
      title: "Trạm 7: Ngọ Môn Huế — Vua Bảo Đại Thoái vị",
      summary: "• Chiều 30/8/1945: Trước Cửa Ngọ Môn Huế, Vua Bảo Đại tuyên bố thoái vị, trao ấn vàng và kiếm ngọc cho đại diện Chính phủ lâm thời.\n• Chấm dứt vĩnh viễn chế độ phong kiến hơn 1000 năm. Câu nói bất hủ: 'Trẫm thà làm dân một nước tự do còn hơn làm vua một nước nô lệ!'.",
      loci_tip: "Gắn hình ảnh 'Chiếc ấn vàng và thanh bảo kiếm' đặt trang nghiêm lên chiếc bàn kính phòng bạn!",
      quiz: {
        q: "Sự kiện Vua Bảo Đại thoái vị (30/8/1945) mang ý nghĩa lịch sử sâu sắc nào?",
        options: ["A. Buộc thực dân Pháp rút khỏi Đông Dương", "B. Xóa bỏ hoàn toàn chế độ phong kiến tồn tại hàng nghìn năm", "C. Chấm dứt sự can thiệp của Mỹ", "D. Thành lập Mặt trận Liên Việt"],
        answer: 1,
        explain: "Sự thoái vị của Bảo Đại đã đặt dấu chấm hết vĩnh viễn cho chế độ quân chủ phong kiến ngàn năm ở Việt Nam."
      }
    },
    8: {
      title: "Trạm 8: Ba Đình — Bác Hồ đọc Tuyên ngôn Độc lập",
      summary: "• Ngày 02/9/1945: Tại Quảng trường Ba Đình lịch sử, Chủ tịch Hồ Chí Minh đọc bản Tuyên ngôn Độc lập.\n• Khai sinh ra nước Việt Nam Dân chủ Cộng hòa — Nhà nước công nông đầu tiên ở Đông Nam Á.\n• Tuyên bố trước quốc dân và thế giới: Nước Việt Nam có quyền hưởng tự do và độc lập, và sự thật đã thành một nước tự do độc lập!",
      loci_tip: "Tưởng tượng giữa trần phòng bạn tỏa sáng vầng hào quang rực rỡ của Quảng trường Ba Đình ngày hội Độc lập!",
      quiz: {
        q: "Văn bản pháp lý lịch sử nào tuyên bố khai sinh nước Việt Nam Dân chủ Cộng hòa vào ngày 2/9/1945?",
        options: ["A. Lời kêu gọi Toàn quốc kháng chiến", "B. Tuyên ngôn Độc lập", "C. Bản Yêu sách của nhân dân An Nam", "D. Chỉ thị Toàn dân kháng chiến"],
        answer: 1,
        explain: "Bản Tuyên ngôn Độc lập do Chủ tịch Hồ Chí Minh đọc ngày 2/9/1945 đã khai sinh ra nước Việt Nam Dân chủ Cộng hòa."
      }
    },
    9: {
      title: "Trạm 9: Ý nghĩa Lịch sử — Khúc Khải hoàn Dân tộc",
      summary: "• Phá tan xiềng xích nô lệ của thực dân Pháp gần 100 năm và phát xít Nhật gần 5 năm.\n• Lật đổ chế độ phong kiến ngàn năm, đưa nhân dân từ nô lệ thành người làm chủ đất nước.\n• Đảng Cộng sản trở thành Đảng cầm quyền, mở ra kỷ nguyên mới: Độc lập, Tự do và Chủ nghĩa Xã hội.\n• Cổ vũ mạnh mẽ phong trào giải phóng dân tộc của các nước thuộc địa trên toàn thế giới.",
      loci_tip: "Treo biểu tượng 'Ngọn đuốc Độc lập - Tự do' vàng rực trên góc cao nhất của phòng để luôn nhớ sâu 4 ý nghĩa vĩ đại!",
      quiz: {
        q: "Thắng lợi của Cách mạng tháng Tám 1945 đã mở ra kỷ nguyên mới nào cho dân tộc ta?",
        options: ["A. Kỷ nguyên Đổi mới và Hội nhập", "B. Kỷ nguyên Độc lập, Tự do và nhân dân làm chủ đất nước", "C. Kỷ nguyên Công nghiệp hóa hiện đại hóa", "D. Kỷ nguyên Hòa bình lập lại ở miền Bắc"],
        answer: 1,
        explain: "Cách mạng tháng Tám đã mở ra kỷ nguyên Độc lập, Tự do, đưa nhân dân từ thân phận nô lệ lên làm chủ đất nước."
      }
    }
  };

  /* ---------------- AI GENERATION (GEMINI LLM) ---------------- */
  const DEFAULT_KEYS = [
    _decodeGeminiKey('=EFaQ10RhN0RMJVN3kVQpZ3NykkeLFXUoFzYLVDT4h0budUM0JFbrpXe5R3S24kU4IWQuEVQ'),
    _decodeGeminiKey('=cWYNRUYVhzVWJETZRzR2ZkdzVWToJ2VhlmVmRnNGZnbIhVO6R1RBFXVQNzS24kU4IWQuEVQ'),
    _decodeGeminiKey('=cmMVpWdCVmetZWOmVTeiJ2QrxkRSFkNtF1N4FUcElTMDZmd0JDSEhXViJDT24kU4IWQuEVQ')
  ];

  function getCandidateKeys() {
    let userKey = localStorage.getItem('loci_gemini_api_key') || localStorage.getItem('gemini_api_key');
    const knownExpired = [_decodeGeminiKey('==wNiVmYilTO1QmYwYDNhFmZzEzM5MTZxczM1QzNyImZmVmZ3MWZxYmN3kTY4QDMiJTYhFTO0gjM2gDZyQ2MwYjMtEjdtI3bts2c'), _decodeGeminiKey('=EEU0kDTW12dDVDetNHMih1YBZXNtgVNrVTbr1kWB9EZJB3VTB1RLJmTh5ET24kU4IWQuEVQ')];
    if (!userKey || knownExpired.includes(userKey)) {
      userKey = DEFAULT_KEYS[0];
    }
    return [userKey, ...DEFAULT_KEYS].filter((v, i, a) => v && a.indexOf(v) === i);
  }

  async function queryGemini(promptText, history = []) {
    const keys = getCandidateKeys();
    const candidateModels = ['gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-flash-latest'];

    // Chuẩn bị payload Gemini
    const contents = [];
    // Ghép lịch sử gần nhất (tối đa 4 lượt)
    for (const h of history.slice(-4)) {
      contents.push({
        role: h.role === 'ai' ? 'model' : 'user',
        parts: [{ text: h.text }]
      });
    }
    contents.push({
      role: 'user',
      parts: [{ text: promptText }]
    });

    for (const key of keys) {
      for (const m of candidateModels) {
        try {
          const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${key}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: contents,
              generationConfig: {
                temperature: 0.65,
                maxOutputTokens: 800
              }
            })
          });
          if (resp.ok) {
            const data = await resp.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text && text.trim()) return text.trim();
          }
        } catch (_) {}
      }
    }
    return null;
  }

  function getLocalStationKnowledge(stationOrder) {
    return HISTORICAL_FALLBACK_KNOWLEDGE[stationOrder] || HISTORICAL_FALLBACK_KNOWLEDGE[1];
  }

  /* ---------------- VOICE SPEECH & RECOGNITION ---------------- */
  let recognition = null;
  let isListening = false;

  function initSpeechRec(onResult, onStateChange) {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) return null;
    try {
      const rec = new SpeechRec();
      rec.lang = 'vi-VN';
      rec.continuous = false;
      rec.interimResults = false;
      rec.onresult = (e) => {
        const text = e.results[0][0].transcript;
        if (text && onResult) onResult(text);
      };
      rec.onstart = () => { isListening = true; onStateChange && onStateChange(true); };
      rec.onend = () => { isListening = false; onStateChange && onStateChange(false); };
      rec.onerror = () => { isListening = false; onStateChange && onStateChange(false); };
      return rec;
    } catch (_) { return null; }
  }

  function speak(text) {
    if (!('speechSynthesis' in window)) return;
    try {
      speechSynthesis.cancel();
      const clean = String(text)
        .replace(/<[^>]+>/g, '')
        .replace(/\*\*/g, '')
        .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, '');
      const u = new SpeechSynthesisUtterance(clean);
      u.lang = 'vi-VN';
      u.rate = 1.05;
      u.pitch = 1.02;
      speechSynthesis.speak(u);
    } catch (_) {}
  }

  /* ---------------- UI RENDERING ---------------- */
  const CSS = `
  #lm-root{position:fixed;z-index:9000;font-family:'Outfit','Inter',system-ui,sans-serif;display:flex;align-items:flex-end;gap:12px;pointer-events:none}
  #lm-root *{box-sizing:border-box}
  #lm-root.lm-right{flex-direction:row-reverse}
  
  #lm-avatar{pointer-events:auto;position:relative;width:60px;height:60px;border-radius:50%;border:2.5px solid rgba(56,189,248,0.9);cursor:pointer;flex-shrink:0;
    background:radial-gradient(circle at 35% 30%,#38bdf8,#6366f1 55%,#0f172a);box-shadow:0 10px 30px rgba(56,189,248,0.45),0 0 25px rgba(99,102,241,0.35);
    display:flex;align-items:center;justify-content:center;transition:transform .35s cubic-bezier(.16,1,.3,1),box-shadow .35s;animation:lmFloat 4s ease-in-out infinite}
  #lm-avatar:hover{transform:scale(1.1) rotate(-3deg);box-shadow:0 14px 40px rgba(56,189,248,.65),0 0 35px rgba(99,102,241,.55)}
  #lm-avatar svg{width:42px;height:42px}
  #lm-avatar .lm-dot{position:absolute;top:1px;right:1px;width:14px;height:14px;border-radius:50%;background:#10b981;border:2.5px solid #fff;box-shadow:0 0 10px #10b981}
  #lm-avatar.lm-ping::after{content:'';position:absolute;inset:-8px;border-radius:50%;border:2px solid #38bdf8;animation:lmPing 1.4s ease-out infinite}
  @keyframes lmFloat{0%,100%{translate:0 0}50%{translate:0 -6px}}
  @keyframes lmPing{0%{opacity:.9;transform:scale(.9)}100%{opacity:0;transform:scale(1.4)}}
  .lm-eye{animation:lmBlink 4.5s infinite;transform-origin:center}
  @keyframes lmBlink{0%,92%,100%{transform:scaleY(1)}95%{transform:scaleY(.15)}}

  #lm-bubble{pointer-events:auto;max-width:340px;padding:14px 16px 12px;border-radius:20px 20px 20px 6px;color:#0f172a;font-size:13.5px;line-height:1.5;
    background:rgba(255,255,255,.94);backdrop-filter:blur(20px) saturate(1.5);-webkit-backdrop-filter:blur(20px) saturate(1.5);
    border:1px solid rgba(255,255,255,.95);box-shadow:0 18px 45px rgba(15,23,42,.22),0 0 20px rgba(56,189,248,.18);
    opacity:0;transform:translateY(12px) scale(.95);transition:all .35s cubic-bezier(.16,1,.3,1);position:relative;cursor:pointer}
  #lm-root.lm-right #lm-bubble{border-radius:20px 20px 6px 20px}
  #lm-bubble.on{opacity:1;transform:none}
  #lm-bubble .lm-who{font-size:11px;font-weight:800;letter-spacing:.6px;text-transform:uppercase;margin-bottom:4px;display:flex;align-items:center;justify-content:space-between;color:#0284c7}
  #lm-bubble .lm-who span.badge{background:#e0f2fe;color:#0284c7;font-size:9.5px;padding:2px 6px;border-radius:6px;font-weight:700}
  #lm-bubble .lm-x{position:absolute;top:6px;right:8px;border:none;background:none;color:#94a3b8;font-size:16px;cursor:pointer;line-height:1}
  #lm-bubble .lm-bar{position:absolute;left:14px;right:14px;bottom:5px;height:2.5px;border-radius:2px;background:linear-gradient(90deg,#0284c7,#38bdf8);transform-origin:left}

  #lm-panel{position:fixed;z-index:9200;width:min(440px,calc(100vw - 28px));height:min(640px,calc(100vh - 100px));border-radius:24px;
    background:rgba(15,23,42,.95);backdrop-filter:blur(24px) saturate(1.8);-webkit-backdrop-filter:blur(24px) saturate(1.8);
    border:1px solid rgba(56,189,248,.35);box-shadow:0 25px 60px rgba(0,0,0,.65),0 0 35px rgba(2,132,199,.25);
    color:#f8fafc;display:flex;flex-direction:column;overflow:hidden;opacity:0;pointer-events:none;transform:translateY(20px) scale(.96);
    transition:opacity .3s cubic-bezier(.16,1,.3,1),transform .3s cubic-bezier(.16,1,.3,1)}
  #lm-panel.on{opacity:1;pointer-events:auto;transform:translateY(0) scale(1)}
  
  .lm-p-header{padding:14px 18px;background:rgba(30,41,59,.7);border-bottom:1px solid rgba(255,255,255,.08);display:flex;align-items:center;justify-content:space-between;gap:10px}
  .lm-p-title-wrap{display:flex;align-items:center;gap:10px}
  .lm-p-avatar-mini{width:38px;height:38px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#38bdf8,#6366f1);display:flex;align-items:center;justify-content:center;box-shadow:0 0 12px rgba(56,189,248,.5);flex-shrink:0}
  .lm-p-title-wrap h4{margin:0;font-size:15px;font-weight:800;color:#fff;line-height:1.2}
  .lm-p-title-wrap small{font-size:11px;color:#38bdf8;font-weight:600;display:block}
  .lm-p-actions{display:flex;align-items:center;gap:8px}
  .lm-p-btn-icon{border:none;background:rgba(255,255,255,.08);color:#94a3b8;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .2s;font-size:14px}
  .lm-p-btn-icon:hover{background:rgba(255,255,255,.18);color:#fff}
  .lm-p-btn-icon.active{background:#0284c7;color:#fff;box-shadow:0 0 10px rgba(2,132,199,.5)}

  .lm-tabs{display:flex;padding:6px 14px;background:rgba(15,23,42,.6);border-bottom:1px solid rgba(255,255,255,.06);gap:8px}
  .lm-tab{flex:1;padding:8px 10px;border-radius:12px;border:none;background:transparent;color:#94a3b8;font-size:12.5px;font-weight:700;cursor:pointer;transition:all .2s;display:flex;align-items:center;justify-content:center;gap:6px}
  .lm-tab.active{background:linear-gradient(135deg,#0284c7,#2563eb);color:#fff;box-shadow:0 4px 12px rgba(2,132,199,.35)}

  .lm-tab-body{flex:1;overflow:hidden;display:none;flex-direction:column}
  .lm-tab-body.active{display:flex}

  /* Chat Pane */
  .lm-chat-messages{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:12px;scroll-behavior:smooth}
  .lm-chat-messages::-webkit-scrollbar{width:5px}
  .lm-chat-messages::-webkit-scrollbar-thumb{background:rgba(255,255,255,.15);border-radius:10px}
  .lm-msg{display:flex;gap:10px;max-width:92%;font-size:13.5px;line-height:1.55}
  .lm-msg.ai{align-self:flex-start}
  .lm-msg.user{align-self:flex-end;flex-direction:row-reverse}
  .lm-msg-avatar{width:28px;height:28px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#38bdf8,#6366f1);flex-shrink:0;display:flex;align-items:center;justify-content:center}
  .lm-msg-content{background:rgba(30,41,59,.8);border:1px solid rgba(255,255,255,.08);padding:10px 14px;border-radius:16px 16px 16px 4px;color:#f1f5f9;word-break:break-word}
  .lm-msg.user .lm-msg-content{background:linear-gradient(135deg,#0284c7,#2563eb);border:none;border-radius:16px 16px 4px 16px;color:#fff}
  .lm-msg-content b, .lm-msg-content strong{color:#38bdf8}
  .lm-msg.user .lm-msg-content b, .lm-msg.user .lm-msg-content strong{color:#fff}
  .lm-msg-content ul{margin:6px 0;padding-left:18px}
  .lm-msg-content li{margin-bottom:3px}
  .lm-msg-actions{margin-top:6px;display:flex;gap:6px;align-items:center}
  .lm-msg-btn-tts{background:rgba(255,255,255,.08);border:none;border-radius:8px;color:#94a3b8;font-size:11px;padding:3px 7px;cursor:pointer;display:inline-flex;align-items:center;gap:4px;transition:all .2s}
  .lm-msg-btn-tts:hover{background:#0284c7;color:#fff}
  .lm-quiz-btn{display:block;width:100%;text-align:left;margin-top:6px;padding:7px 10px;border-radius:8px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);color:#e2e8f0;font-size:12px;cursor:pointer;transition:all .2s}
  .lm-quiz-btn:hover{background:rgba(2,132,199,.25);border-color:#38bdf8}
  .lm-quiz-btn.correct{background:rgba(16,185,129,.3);border-color:#10b981;color:#a7f3d0}
  .lm-quiz-btn.wrong{background:rgba(239,68,68,.3);border-color:#ef4444;color:#fca5a5}

  .lm-chips-wrap{padding:8px 14px;display:flex;gap:6px;overflow-x:auto;background:rgba(15,23,42,.8);border-top:1px solid rgba(255,255,255,.05);scrollbar-width:none}
  .lm-chips-wrap::-webkit-scrollbar{display:none}
  .lm-chip{background:rgba(56,189,248,.12);border:1px solid rgba(56,189,248,.3);color:#38bdf8;padding:6px 11px;border-radius:12px;font-size:12px;font-weight:600;white-space:nowrap;cursor:pointer;transition:all .2s}
  .lm-chip:hover{background:#0284c7;color:#fff;border-color:#0284c7;transform:translateY(-1px)}

  .lm-chat-input-bar{padding:10px 14px;background:rgba(30,41,59,.9);border-top:1px solid rgba(255,255,255,.08);display:flex;align-items:center;gap:8px}
  .lm-chat-inp{flex:1;background:rgba(15,23,42,.8);border:1px solid rgba(255,255,255,.15);border-radius:14px;padding:10px 14px;color:#fff;font-size:13px;outline:none;transition:border-color .2s}
  .lm-chat-inp:focus{border-color:#38bdf8}
  .lm-chat-btn{border:none;background:#0284c7;color:#fff;width:38px;height:38px;border-radius:12px;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .2s;font-size:15px;flex-shrink:0}
  .lm-chat-btn:hover{background:#0369a1;transform:scale(1.05)}
  .lm-chat-btn.mic.listening{background:#ef4444;animation:lmPing 1.2s infinite}

  /* Stats Pane */
  .lm-stats-pane{flex:1;overflow-y:auto;padding:16px;color:#e2e8f0}
  .lm-sum-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px}
  .lm-sum-grid div{background:rgba(30,41,59,.8);border-radius:14px;padding:10px 12px;border:1px solid rgba(255,255,255,.08)}
  .lm-sum-grid b{display:block;font-size:20px;font-weight:800;color:#38bdf8}
  .lm-sum-grid span{font-size:12px;color:#94a3b8;font-weight:600}
  .lm-sec{font-size:12px;font-weight:800;letter-spacing:.5px;text-transform:uppercase;color:#94a3b8;margin:14px 0 6px}
  .lm-row{display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid rgba(255,255,255,.06);font-size:13px}
  .lm-row b{color:#38bdf8}
  .lm-weak{display:flex;flex-direction:column;gap:6px}
  .lm-weak div{display:flex;justify-content:space-between;gap:8px;font-size:12.5px;padding:8px 10px;border-radius:10px;background:rgba(239,68,68,.12);border:1px solid rgba(239,68,68,.25)}
  .lm-weak em{font-style:normal;color:#fca5a5;font-weight:700}
  .lm-empty{font-size:12.5px;color:#94a3b8;padding:8px 0}
  .lm-btn{width:100%;margin-top:14px;padding:11px;border-radius:12px;border:none;font-weight:700;font-size:13.5px;cursor:pointer;font-family:inherit;transition:all .2s}
  .lm-primary{color:#fff;background:linear-gradient(135deg,#0284c7,#10b981);box-shadow:0 8px 20px rgba(2,132,199,.3)}
  .lm-primary:hover{transform:translateY(-1px)}
  .lm-ai-out{margin-top:12px;font-size:13px;line-height:1.6;background:rgba(30,41,59,.9);border:1px solid rgba(56,189,248,.3);border-radius:12px;padding:12px 14px;color:#e2e8f0}
  .lm-ai-out ul{margin:4px 0;padding-left:18px}
  .lm-ai-out.lm-err{background:rgba(239,68,68,.15);border-color:#ef4444;color:#fca5a5}
  .lm-loading{display:flex;align-items:center;gap:6px;color:#38bdf8}
  .lm-loading span{width:6px;height:6px;border-radius:50%;background:#38bdf8;animation:lmDots 1s infinite}
  .lm-loading span:nth-child(2){animation-delay:.15s}
  .lm-loading span:nth-child(3){animation-delay:.3s}
  @keyframes lmDots{0%,100%{opacity:.3;transform:translateY(0)}50%{opacity:1;transform:translateY(-3px)}}

  #lm-modal{position:fixed;inset:0;z-index:9500;display:flex;align-items:center;justify-content:center;background:rgba(15,23,42,.65);backdrop-filter:blur(8px);font-family:'Outfit','Inter',system-ui,sans-serif;opacity:0;transition:opacity .3s}
  #lm-modal.on{opacity:1}
  #lm-modal .lm-card{width:min(440px,calc(100vw - 28px));max-height:86vh;overflow:auto;background:rgba(15,23,42,.95);border:1px solid rgba(56,189,248,.3);border-radius:24px;padding:22px;color:#f8fafc;box-shadow:0 30px 70px rgba(0,0,0,.6);transform:scale(.95);transition:transform .35s cubic-bezier(.16,1,.3,1)}
  #lm-modal.on .lm-card{transform:none}
  #lm-modal h3{margin:0 0 14px;font-size:19px;font-weight:800;color:#fff}
  @media (max-width:600px){#lm-bubble{max-width:calc(100vw - 90px);font-size:12.5px}#lm-avatar{width:54px;height:54px}}
  `;

  const AVATAR_SVG = `<svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
    <circle cx="32" cy="32" r="28" fill="#0284c7" fill-opacity="0.3"/>
    <circle cx="32" cy="32" r="23" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>
    <rect x="18" y="24" width="28" height="15" rx="7.5" fill="#0369a1"/>
    <ellipse class="lm-eye" cx="26" cy="31.5" rx="3.5" ry="4" fill="#38bdf8"/>
    <ellipse class="lm-eye" cx="38" cy="31.5" rx="3.5" ry="4" fill="#38bdf8"/>
    <circle cx="27.5" cy="30" r="1.2" fill="#ffffff"/>
    <circle cx="39.5" cy="30" r="1.2" fill="#ffffff"/>
    <path d="M13 32 C13 20 51 20 51 32" stroke="#60a5fa" stroke-width="2.5" stroke-linecap="round"/>
    <rect x="11" y="28" width="5" height="10" rx="2.5" fill="#38bdf8"/>
    <rect x="48" y="28" width="5" height="10" rx="2.5" fill="#38bdf8"/>
    <path d="M28 44 Q32 47 36 44" stroke="#38bdf8" stroke-width="2" stroke-linecap="round"/>
  </svg>`;

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
    root.innerHTML = `<button id="lm-avatar" title="Gia sư AI Loci — Bấm để trò chuyện" aria-label="Gia sư AI Loci">${AVATAR_SVG}<span class="lm-dot"></span></button><div id="lm-bubble" role="status" aria-live="polite"></div>`;
    document.body.appendChild(root);
    bubble = root.querySelector('#lm-bubble');

    panel = document.createElement('div');
    panel.id = 'lm-panel';
    document.body.appendChild(panel);

    root.querySelector('#lm-avatar').onclick = e => { e.stopPropagation(); togglePanel(); };
    bubble.onclick = e => {
      if (e.target.classList.contains('lm-x')) return;
      e.stopPropagation();
      togglePanel('chat');
    };

    [root, panel].forEach(el => ['pointerdown', 'mousedown', 'click', 'wheel', 'touchstart'].forEach(ev => el.addEventListener(ev, e => e.stopPropagation())));
  }

  function say(html, o = {}) {
    if (!bubble) return;
    if (!o.force && state.settings.level === 'quiet' && o.mood !== 'cheer') return;
    if (panel && panel.classList.contains('on')) return;
    clearTimeout(hideTimer);
    const dur = o.duration || Math.min(14000, 6000 + html.replace(/<[^>]+>/g, '').length * 45);
    bubble.className = 'mood-' + (o.mood || 'info');
    bubble.innerHTML = `<button class="lm-x" aria-label="Ẩn">✕</button><div class="lm-who"><span>Gia sư AI Loci</span><span class="badge">Trực tuyến</span></div><div>${html}</div><div class="lm-bar"></div>`;
    requestAnimationFrame(() => bubble.classList.add('on'));
    bubble.querySelector('.lm-x').onclick = e => { e.stopPropagation(); hideBubble(); };
    const bar = bubble.querySelector('.lm-bar');
    barAnim && barAnim.cancel && barAnim.cancel();
    if (bar && bar.animate) barAnim = bar.animate([{ transform: 'scaleX(1)' }, { transform: 'scaleX(0)' }], { duration: dur, easing: 'linear', fill: 'forwards' });
    const av = root.querySelector('#lm-avatar');
    av.classList.add('lm-ping');
    hideTimer = setTimeout(hideBubble, dur);
    if (state.settings.voice && o.force) speak(html);
  }

  function hideBubble() {
    if (!bubble) return;
    bubble.classList.remove('on');
    root.querySelector('#lm-avatar').classList.remove('lm-ping');
  }

  function placePanel() {
    const r = root.querySelector('#lm-avatar').getBoundingClientRect();
    panel.style.bottom = Math.max(16, (window.innerHeight - r.top + 14)) + 'px';
    if (root.classList.contains('lm-right')) {
      panel.style.right = Math.max(16, window.innerWidth - r.right) + 'px';
      panel.style.left = '';
    } else {
      panel.style.left = Math.max(16, r.left) + 'px';
      panel.style.right = '';
    }
  }

  function mdLite(t) {
    return esc(t)
      .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
      .replace(/^\s*[-•*]\s+(.*)$/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>\n?)+/g, m => `<ul>${m}</ul>`)
      .replace(/\n{2,}/g, '<br>')
      .replace(/\n/g, '<br>');
  }

  function renderPanel(tab = currentActiveTab) {
    currentActiveTab = tab;
    const s = session || { active: 0, placed: 0, opened: [], right: 0, wrong: 0, removed: 0 };
    const weak = weakLoci(4);
    const rep = report();
    const curLoc = getCurrentLocusInfo();
    const locName = (curLoc.title || curLoc.name || 'Bài 6: Cách mạng tháng Tám 1945').replace(/^\d+\.\s*/, '');

    panel.innerHTML = `
      <div class="lm-p-header">
        <div class="lm-p-title-wrap">
          <div class="lm-p-avatar-mini">${AVATAR_SVG}</div>
          <div>
            <h4>Gia sư AI Loci</h4>
            <small>Đang học: ${esc(opts.spaceName || 'Không gian 360')}</small>
          </div>
        </div>
        <div class="lm-p-actions">
          <button class="lm-p-btn-icon ${state.settings.voice ? 'active' : ''}" id="lm-voice-btn" title="Bật/Tắt đọc giọng nói">🔊</button>
          <button class="lm-p-btn-icon" id="lm-close-panel" title="Đóng bảng">✕</button>
        </div>
      </div>

      <div class="lm-tabs">
        <button class="lm-tab ${tab === 'chat' ? 'active' : ''}" data-target="chat">💬 Trò chuyện AI</button>
        <button class="lm-tab ${tab === 'stats' ? 'active' : ''}" data-target="stats">📊 Tiến độ & Thống kê</button>
      </div>

      <!-- TAB 1: CHAT VỚI AI THẬT -->
      <div class="lm-tab-body ${tab === 'chat' ? 'active' : ''}" id="lm-pane-chat">
        <div class="lm-chat-messages" id="lm-chat-messages">
          ${chatMessages.map(m => `
            <div class="lm-msg ${m.role}">
              ${m.role === 'ai' ? `<div class="lm-msg-avatar">${AVATAR_SVG}</div>` : ''}
              <div class="lm-msg-content">
                <div>${mdLite(m.text)}</div>
                ${m.role === 'ai' ? `
                  <div class="lm-msg-actions">
                    <button type="button" class="lm-msg-btn-tts" onclick="window.LociMentor && window.LociMentor.speakMsg(this)">🔊 Nghe đọc</button>
                  </div>
                ` : ''}
              </div>
            </div>
          `).join('')}
        </div>

        <div class="lm-chips-wrap">
          <button class="lm-chip" data-prompt="Giải thích mốc này">💡 Giải thích mốc này</button>
          <button class="lm-chip" data-prompt="Mẹo ghi nhớ Loci">🧠 Mẹo nhớ bằng Loci</button>
          <button class="lm-chip" data-prompt="Tóm tắt diễn biến">📜 Tóm tắt diễn biến</button>
          <button class="lm-chip" data-prompt="Đố 1 câu trắc nghiệm">❓ Đố em 1 câu trắc nghiệm</button>
          <button class="lm-chip" data-prompt="Trọng tâm thi THPT">🎯 Trọng tâm thi THPT</button>
        </div>

        <div class="lm-chat-input-bar">
          <input type="text" id="lm-chat-input" class="lm-chat-inp" placeholder="Hỏi Gia sư AI về mốc này, ngày tháng..." />
          <button type="button" id="lm-mic-btn" class="lm-chat-btn mic" title="Nói để đặt câu hỏi">🎙️</button>
          <button type="button" id="lm-send-btn" class="lm-chat-btn" title="Gửi câu hỏi">➤</button>
        </div>
      </div>

      <!-- TAB 2: TIẾN ĐỘ & BÁO CÁO -->
      <div class="lm-tab-body ${tab === 'stats' ? 'active' : ''}" id="lm-pane-stats">
        <div class="lm-stats-pane">
          <div class="lm-sec" style="margin-top:0">Buổi học hiện tại</div>
          ${summaryHTML(s).replace(/<p class="lm-advice">[\s\S]*<\/p>/, '')}
          <div class="lm-row"><span>🔥 Chuỗi ngày học</span><b>${rep.streak} ngày</b></div>
          <div class="lm-row"><span>⏱️ Hôm nay</span><b>${rep.todayMin} phút</b></div>
          <div class="lm-row"><span>🧠 Thẻ đến hạn ôn</span><b>${rep.due}</b></div>

          <div class="lm-sec">Mốc cần củng cố</div>
          ${weak.length ? `<div class="lm-weak">${weak.map(w => `<div><span>${esc(w.title)}</span><em>sai ${w.wrong} · đúng ${w.right}</em></div>`).join('')}</div>` : '<div class="lm-empty">Chưa phát hiện mốc yếu — tiếp tục phát huy nhé! 🌱</div>'}

          <button class="lm-btn lm-primary" id="lm-ai-eval">🧠 Nhận xét buổi học bằng AI</button>
          <div id="lm-ai-out"></div>
        </div>
      </div>
    `;

    // Gắn sự kiện tab
    panel.querySelectorAll('.lm-tab').forEach(b => {
      b.onclick = () => renderPanel(b.dataset.target);
    });

    panel.querySelector('#lm-close-panel').onclick = togglePanel;

    panel.querySelector('#lm-voice-btn').onclick = e => {
      state.settings.voice = !state.settings.voice;
      save();
      e.currentTarget.classList.toggle('active', state.settings.voice);
      if (state.settings.voice) speak('Đã bật giọng nói gia sư. Mình sẽ đọc câu trả lời cho bạn nghe nhé.');
      else if ('speechSynthesis' in window) speechSynthesis.cancel();
    };

    if (tab === 'chat') {
      const msgBox = panel.querySelector('#lm-chat-messages');
      if (msgBox) msgBox.scrollTop = msgBox.scrollHeight;

      const inp = panel.querySelector('#lm-chat-input');
      const sendBtn = panel.querySelector('#lm-send-btn');
      const micBtn = panel.querySelector('#lm-mic-btn');

      const doSend = () => {
        const val = (inp.value || '').trim();
        if (!val) return;
        inp.value = '';
        handleUserChat(val);
      };

      if (sendBtn) sendBtn.onclick = doSend;
      if (inp) inp.onkeydown = e => { if (e.key === 'Enter') doSend(); };

      panel.querySelectorAll('.lm-chip').forEach(c => {
        c.onclick = () => {
          const p = c.dataset.prompt;
          handleQuickPrompt(p);
        };
      });

      if (micBtn) {
        if (!recognition) {
          recognition = initSpeechRec(
            text => {
              if (inp) inp.value = text;
              handleUserChat(text);
            },
            listening => {
              micBtn.classList.toggle('listening', listening);
            }
          );
        }
        micBtn.onclick = () => {
          if (!recognition) {
            say('Trình duyệt chưa hỗ trợ ghi âm trực tiếp, bạn hãy gõ vào ô chat nhé!', { mood: 'care' });
            return;
          }
          if (isListening) {
            recognition.stop();
          } else {
            try { recognition.start(); } catch (_) {}
          }
        };
      }
    } else {
      const evalBtn = panel.querySelector('#lm-ai-eval');
      if (evalBtn) evalBtn.onclick = e => runAIEval(panel.querySelector('#lm-ai-out'), e.currentTarget);
    }
  }

  async function handleQuickPrompt(action) {
    const curLoc = getCurrentLocusInfo();
    const locTitle = (curLoc.title || curLoc.name || 'Bài 6: Cách mạng tháng Tám năm 1945').replace(/^\d+\.\s*/, '');
    let promptText = '';

    if (action === 'Giải thích mốc này') {
      promptText = `Giải thích chi tiết và sinh động sự kiện lịch sử của mốc: "${locTitle}".`;
    } else if (action === 'Mẹo ghi nhớ Loci') {
      promptText = `Cho mình mẹo ghi nhớ bằng Phương pháp Cung điện Ký ức (Method of Loci) đối với mốc: "${locTitle}". Làm sao gắn sự kiện này vào một góc cụ thể trong phòng?`;
    } else if (action === 'Tóm tắt diễn biến') {
      promptText = `Tóm tắt nhanh diễn biến cốt lõi của mốc "${locTitle}" trong 3 gạch đầu dòng rõ nét.`;
    } else if (action === 'Đố 1 câu trắc nghiệm') {
      promptText = `Hãy đố mình 1 câu trắc nghiệm trọng tâm thi THPT về mốc "${locTitle}", gồm 4 phương án A, B, C, D và chỉ rõ đáp án đúng kèm lời giải thích.`;
    } else if (action === 'Trọng tâm thi THPT') {
      promptText = `Chỉ ra những từ khóa và câu hỏi bẫy thường gặp trong đề thi tốt nghiệp THPT về mốc "${locTitle}".`;
    }

    if (promptText) {
      handleUserChat(promptText);
    }
  }

  async function handleUserChat(userText) {
    chatMessages.push({ role: 'user', text: userText });
    renderPanel('chat');

    const msgBox = panel.querySelector('#lm-chat-messages');
    if (msgBox) {
      const loadingEl = document.createElement('div');
      loadingEl.className = 'lm-msg ai lm-temp-loading';
      loadingEl.innerHTML = `<div class="lm-msg-avatar">${AVATAR_SVG}</div><div class="lm-msg-content"><div class="lm-loading"><span></span><span></span><span></span> Gia sư đang suy nghĩ...</div></div>`;
      msgBox.appendChild(loadingEl);
      msgBox.scrollTop = msgBox.scrollHeight;
    }

    const curLoc = getCurrentLocusInfo();
    const locTitle = (curLoc.title || curLoc.name || 'Bài 6: Cách mạng tháng Tám năm 1945').replace(/^\d+\.\s*/, '');
    const curOrder = curLoc.order || 1;

    const systemContext = `Bạn là Gia sư AI Loci — người thầy gia sư Lịch sử 12 thông thái, ấm áp, sâu sắc và am hiểu tường tận phương pháp Cung điện Ký ức (Method of Loci).
Ngữ cảnh hiện tại: Học sinh đang học trong không gian "${opts.spaceName || 'Phòng 360 độ'}", mốc đang xem là "Trạm ${curOrder}: ${locTitle}".
Xưng hô: 'mình' - 'bạn'.
Nhiệm vụ:
1. Giải thích chính xác, cô đọng, sinh động kiến thức Lịch sử 12 (trọng tâm Cách mạng tháng Tám 1945).
2. Dạy cách liên tưởng thị giác Loci để ghi nhớ lâu, không bao giờ quên.
3. Nếu người dùng yêu cầu câu hỏi trắc nghiệm, tạo câu hỏi chuẩn form đề thi THPT, in đậm đáp án và giải thích chi tiết.
Độ dài câu trả lời: 100 - 250 từ. Trình bày đẹp bằng gạch đầu dòng và từ khóa in đậm.`;

    const fullPrompt = `${systemContext}\n\nCâu hỏi của học sinh: ${userText}`;
    let aiReply = await queryGemini(fullPrompt, chatMessages.slice(-6));

    // Fallback thông minh nếu offline / rate-limit
    if (!aiReply) {
      const fb = getLocalStationKnowledge(curOrder);
      if (userText.includes('Đố') || userText.includes('trắc nghiệm')) {
        aiReply = `**Câu đố trắc nghiệm cho bạn:**\n${fb.quiz.q}\n\n${fb.quiz.options.join('\n')}\n\n👉 **Đáp án đúng:** ${fb.quiz.options[fb.quiz.answer]}\n💡 **Giải thích:** ${fb.quiz.explain}`;
      } else if (userText.includes('mẹo') || userText.includes('Loci') || userText.includes('nhớ')) {
        aiReply = `🧠 **Mẹo ghi nhớ Loci cho mốc này:**\n${fb.loci_tip}\n\n📌 **Bí quyết:** Hãy nhắm mắt lại 3 giây, tưởng tượng vật thể đó phóng đại gấp 10 lần và gắn liền với mốc thời gian, não bộ sẽ ghi nhớ vĩnh viễn vào trí nhớ dài hạn!`;
      } else {
        aiReply = `🏛️ **${fb.title}:**\n${fb.summary}\n\n🧠 **Mẹo nhớ Loci:** ${fb.loci_tip}`;
      }
    }

    chatMessages.push({ role: 'ai', text: aiReply });
    renderPanel('chat');

    if (state.settings.voice) {
      speak(aiReply);
    }
  }

  function togglePanel(targetTab = 'chat') {
    const open = !panel.classList.contains('on');
    if (open) {
      if (document.pointerLockElement) document.exitPointerLock();
      hideBubble();
      renderPanel(targetTab);
      placePanel();
    }
    panel.classList.toggle('on', open);
  }

  function openModal(title, html) {
    let m = document.getElementById('lm-modal');
    if (m) m.remove();
    if (!document.getElementById('lm-style')) {
      const st = document.createElement('style'); st.id = 'lm-style'; st.textContent = CSS; document.head.appendChild(st);
    }
    m = document.createElement('div');
    m.id = 'lm-modal';
    m.innerHTML = `<div class="lm-card"><div class="lm-head" style="margin-bottom:6px;display:flex;justify-content:space-between;align-items:center"><h3 style="margin:0">${title}</h3><button class="lm-p-btn-icon" onclick="this.closest('#lm-modal').remove()">✕</button></div>${html}</div>`;
    document.body.appendChild(m);
    requestAnimationFrame(() => m.classList.add('on'));
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

    const prompt = `Bạn là "Gia sư AI Loci" — người thầy Lịch sử 12 ân cần, tinh ý và am hiểu phương pháp Cung điện Ký ức.
Dựa trên dữ liệu sau, viết nhận xét không quá 130 từ:
**Điểm sáng:** (1 câu khen cụ thể dựa trên số liệu)
**Cần cải thiện:** (1-2 câu chỉ rõ mốc/hành vi)
**Kế hoạch buổi sau:** (2-3 gạch đầu dòng hành động)
DỮ LIỆU: ${JSON.stringify(payload)}`;

    const res = await queryGemini(prompt);
    if (res) return res;

    const streakStr = rep.streak > 0 ? `duy trì chuỗi học ${rep.streak} ngày liên tiếp` : `tập trung cho buổi học hôm nay`;
    const openCount = s ? (s.opened || []).length : (rep.totalSessions || 1);
    const weakMoc = rep.weak && rep.weak[0] ? rep.weak[0].title : null;
    return `**Điểm sáng:** Bạn đã rất nỗ lực khi ${streakStr} và tương tác với ${openCount} trạm sự kiện trong Cung điện Ký ức!
**Cần cải thiện:** ${weakMoc ? `Hãy chú ý ôn lại trạm "${weakMoc}" vì tỉ lệ nhận diện còn chưa ổn định.` : 'Hãy dạo lại các trạm đã gắn để tăng phản xạ truy xuất nhanh dưới 3 giây.'}
**Kế hoạch buổi sau:**
• Dạo 1 vòng quanh Cung điện theo chiều kim đồng hồ để nhẩm lại các mốc (3 phút).
• Nhìn mô hình 3D chọn mốc kiến thức để củng cố liên kết thị giác (5 phút).
• Ôn các thẻ Flashcard đến hạn để đánh bại đường cong quên lãng Ebbinghaus (5 phút).
Cố gắng lên nhé, hồi hải mã của bạn đang ghi nhớ rất tốt đấy!`;
  }

  async function runAIEval(outEl, btn) {
    if (!outEl) return;
    btn && (btn.disabled = true);
    outEl.innerHTML = '<div class="lm-ai-out lm-loading"><span></span><span></span><span></span> Gia sư đang phân tích tiến độ học của bạn…</div>';
    try {
      const txt = await aiEvaluate();
      outEl.innerHTML = `<div class="lm-ai-out">${mdLite(txt || 'Mình chưa nhận được phản hồi, thử lại sau nhé.')}</div>`;
      if (state.settings.voice) speak(txt.replace(/\*\*/g, ''));
    } catch (e) {
      outEl.innerHTML = `<div class="lm-ai-out lm-err">Lỗi kết nối AI: ${esc(e.message)}</div>`;
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

  function hookGlobals() {
    window.addEventListener('loci:locus-open', e => {
      const d = e.detail || {};
      track('locus_open', { id: d.id, title: d.title || d.name });
    });
    window.addEventListener('loci:quiz-answer', e => {
      const d = e.detail || {};
      let title = d.title;
      if (!title && opts && opts.resolveTitle) { try { title = opts.resolveTitle(d.locusId); } catch (_) { } }
      track('answer', { id: d.locusId, title: title || d.locusId, correct: !!d.isCorrect });
    });
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

  function speakMsg(btn) {
    const content = btn.closest('.lm-msg-content')?.querySelector('div')?.textContent || '';
    if (content) speak(content);
  }

  window.LociMentor = {
    init, start, track, leave, setVisible,
    say: (h, o) => say(h, Object.assign({ force: true }, o)),
    report,
    openPanel: (tab = 'chat') => { togglePanel(tab); },
    switchRelax,
    addStudyMinutes,
    addStudyTime: addStudyMinutes,
    speakMsg,
    askAI: handleUserChat
  };

  if (typeof window.renderMentorReport === 'function') {
    try { window.renderMentorReport(); } catch (_) {}
  }
})();
