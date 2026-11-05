/**
 * ══════════════════════════════════════════════════════════════════════════════
 * LOCI EDU — HỆ THỐNG THẺ ÔN TẬP BẤT CHỢT SM-2 (ACTIVE RECALL & TESTING ENGINE)
 * ──────────────────────────────────────────────────────────────────────────────
 * - HÌNH THỨC KIỂM TRA CHỦ ĐỘNG (ACTIVE RECALL):
 *   + 1. Chọn đáp án đúng (Quiz 4 lựa chọn A, B, C, D)
 *   + 2. Gõ điền câu trả lời / từ khuyết (Type-in / Cloze test)
 *   + TUYỆT ĐỐI KHÔNG DÙNG NÚT BẤM TỰ NHẬN (chấm điểm hoàn toàn tự động qua câu trả lời).
 * - THUẬT TOÁN SM-2 ĐIỀU CHỈNH:
 *   + Đã nhớ (Trả lời đúng / Score >= 80%): Giãn cách xa (3 -> 8 -> 21 ngày...), KHÔNG ôn lại nhiều nữa.
 *   + Nhớ mang máng (Score 50-79%): Giữ chu kỳ ngắn 1 ngày, xuất hiện lại sớm để củng cố.
 *   + Chưa nhớ (Trả lời sai / Bỏ trống): Hẹn lại sau 15 phút, xuất hiện tần suất cao.
 *   + Chưa làm: Trọng số ưu tiên cao nhất (5.0), tần suất nhiều hơn tất cả các nhóm.
 * - CƠ CHẾ BẤT CHỢT & BẢO VỆ PHÒNG THI (EXAM SHIELD):
 *   + Tự động kích hoạt câu hỏi ngẫu nhiên sau 2.5 - 4.5 phút.
 *   + TUYỆT ĐỐI KHÔNG HIỆN KHI ĐANG LÀM ĐỀ THI THPT.
 * ══════════════════════════════════════════════════════════════════════════════
 */

(function () {
  'use strict';

  if (window.LociSurpriseRecall) return;

  // 1. ÂM THANH PHẢN HỒI WEB AUDIO API (100% OFFLINE)
  function playAudioFeedback(type = 'surprise') {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;

      if (type === 'surprise') {
        // Âm chime 2 nốt báo câu hỏi bất chợt: D5 (587Hz) -> A5 (880Hz)
        const o1 = ctx.createOscillator();
        const g1 = ctx.createGain();
        o1.type = 'sine';
        o1.frequency.setValueAtTime(587.33, now);
        g1.gain.setValueAtTime(0, now);
        g1.gain.linearRampToValueAtTime(0.18, now + 0.04);
        g1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        o1.connect(g1); g1.connect(ctx.destination);
        o1.start(now); o1.stop(now + 0.35);

        const o2 = ctx.createOscillator();
        const g2 = ctx.createGain();
        o2.type = 'sine';
        o2.frequency.setValueAtTime(880.00, now + 0.12);
        g2.gain.setValueAtTime(0, now + 0.12);
        g2.gain.linearRampToValueAtTime(0.22, now + 0.16);
        g2.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
        o2.connect(g2); g2.connect(ctx.destination);
        o2.start(now + 0.12); o2.stop(now + 0.65);
      } else if (type === 'success') {
        // Âm chúc mừng trả lời đúng: C5 -> E5 -> G5
        [523.25, 659.25, 783.99].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.09);
          gain.gain.setValueAtTime(0, now + idx * 0.09);
          gain.gain.linearRampToValueAtTime(0.16, now + idx * 0.09 + 0.03);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.35);
          osc.connect(gain); gain.connect(ctx.destination);
          osc.start(now + idx * 0.09); osc.stop(now + idx * 0.09 + 0.35);
        });
      } else if (type === 'wrong') {
        // Âm thông báo cần cố gắng thêm
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(260, now);
        osc.frequency.linearRampToValueAtTime(200, now + 0.25);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
        osc.connect(gain); gain.connect(ctx.destination);
        osc.start(now); osc.stop(now + 0.28);
      }
    } catch (_) { }
  }

  // 2. PHÁT HIỆN ĐANG LÀM ĐỀ THI ĐỂ CHẶN TUYỆT ĐỐI (EXAM SHIELD)
  function isExamActive() {
    try {
      const path = (window.location.pathname || '').toLowerCase();
      const href = (window.location.href || '').toLowerCase();

      // 1. URL chứa từ khóa đề thi / giấy thi / kiểm tra
      if (path.includes('de_thi') || href.includes('de_thi') || path.includes('giay-thi') || href.includes('giay-thi') || path.includes('kiem_tra') || href.includes('kiem_tra')) {
        return true;
      }

      // 2. Biến cờ toàn cục báo đang thi
      if (window.isExamActive === true || window.__LOCI_EXAM_ACTIVE === true) {
        return true;
      }

      // 3. Cờ trong localStorage
      if (localStorage.getItem('loci_exam_in_progress') === 'true') {
        return true;
      }

      // 4. Tab đang mở là tab Đề thi THPT
      if (typeof window.activePortalTab !== 'undefined' && window.activePortalTab === 'exam') {
        return true;
      }
      const examNavActive = document.querySelector('.nav-item.active[data-tab="exam"], [data-tab="exam"].active');
      if (examNavActive) {
        return true;
      }

      // 5. Iframe app-frame đang nạp đề thi
      const appFrame = document.getElementById('app-frame');
      if (appFrame && appFrame.src) {
        const fsrc = appFrame.src.toLowerCase();
        if (fsrc.includes('de_thi') || fsrc.includes('giay-thi') || fsrc.includes('kiem_tra')) return true;
      }

      // 6. Kiểm tra từ cửa sổ cha (window.top) nếu đang nằm trong iframe
      if (window.top && window.top !== window.self) {
        const topHref = (window.top.location.href || '').toLowerCase();
        if (topHref.includes('de_thi') || topHref.includes('giay-thi') || topHref.includes('kiem_tra')) return true;
        if (window.top.isExamActive === true || window.top.__LOCI_EXAM_ACTIVE === true) return true;
        if (window.top.activePortalTab === 'exam') return true;
        const topExamNav = window.top.document.querySelector('.nav-item.active[data-tab="exam"], [data-tab="exam"].active');
        if (topExamNav) return true;
        const topFrame = window.top.document.getElementById('app-frame');
        if (topFrame && topFrame.src) {
          const tfsrc = topFrame.src.toLowerCase();
          if (tfsrc.includes('de_thi') || tfsrc.includes('giay-thi') || tfsrc.includes('kiem_tra')) return true;
        }
      }
    } catch (_) { }
    return false;
  }

  // 3. THUẬT TOÁN SO KHỚP VĂN BẢN THÔNG MINH CHO CÂU HỎI GÕ ĐIỀN
  function evaluateTypeInText(typed, target, acceptedList = [], hint = '') {
    if (window.LociFlashcardFormats && typeof window.LociFlashcardFormats.checkTypeInAnswer === 'function') {
      return window.LociFlashcardFormats.checkTypeInAnswer(typed, target, acceptedList, hint);
    }

    const norm = (s) => String(s || '').toLowerCase().trim().normalize('NFC').replace(/[^\p{L}\p{N}\s]/gu, ' ').replace(/\s+/g, ' ');
    const stripDiacritics = (s) => norm(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D');

    const cleanTyped = stripDiacritics(typed);
    const cleanTarget = stripDiacritics(target);

    if (!cleanTyped) {
      return { score: 0, status: 'wrong', title: 'Chưa nhập câu trả lời', target: target, recommendedGrade: 1 };
    }

    const allAccepted = [target, ...(acceptedList || []), hint].filter(Boolean);
    const allCleanAccepted = allAccepted.map(stripDiacritics);

    // 1. Khớp hoàn toàn
    if (allCleanAccepted.some(acc => acc === cleanTyped) || cleanTarget === cleanTyped) {
      return { score: 100, status: 'exact', title: 'Chính xác 100%!', target: target, recommendedGrade: 5 };
    }

    // 2. Chứa chuỗi con (nếu dài >= 3 ký tự)
    if (allCleanAccepted.some(acc => acc.length >= 3 && (cleanTyped.includes(acc) || acc.includes(cleanTyped)))) {
      return { score: 92, status: 'exact', title: 'Rất chính xác!', target: target, recommendedGrade: 5 };
    }

    // 3. So khớp từ khóa cốt lõi
    const stopwords = new Set(['va', 'cac', 'nhung', 'o', 'tai', 'trong', 'cua', 'duoc', 'la', 'vao', 've', 'cho', 'mot', 'nay', 'do', 'ngay', 'thang', 'nam']);
    const getTokens = (s) => s.split(' ').filter(w => w.length > 1 && !stopwords.has(w));
    const targetTokens = getTokens(cleanTarget);
    const typedTokens = getTokens(cleanTyped);

    let matchCount = 0;
    typedTokens.forEach(t => {
      if (targetTokens.includes(t)) matchCount++;
    });

    const ratio = targetTokens.length > 0 ? (matchCount / targetTokens.length) : 0;
    if (ratio >= 0.35 || matchCount >= 2) {
      return { score: Math.round(Math.max(ratio * 100, 85)), status: 'close', title: 'Nắm rất vững ý chính!', target: target, recommendedGrade: 5 };
    }

    if (ratio >= 0.18 || matchCount >= 1) {
      return { score: 60, status: 'vague', title: 'Có ý đúng nhưng chưa trọn vẹn', target: target, recommendedGrade: 3 };
    }

    return { score: Math.round(ratio * 100), status: 'wrong', title: 'Chưa chính xác', target: target, recommendedGrade: 1 };
  }

  // 4. INJECT CSS GIAO DIỆN GLASSMORPHISM SANG TRỌNG
  const STYLES = `
    .loci-surprise-wrapper {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 2147483646;
      width: 450px;
      max-width: calc(100vw - 32px);
      pointer-events: auto;
      font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
      animation: lociSurpriseSlideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    @keyframes lociSurpriseSlideUp {
      from { opacity: 0; transform: translateY(30px) scale(0.95); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes lociSurpriseFadeOut {
      from { opacity: 1; transform: translateY(0) scale(1); }
      to { opacity: 0; transform: translateY(20px) scale(0.92); }
    }
    .loci-surprise-card {
      background: #ffffff !important;
      border: 2px solid #e2e8f0 !important;
      border-radius: 24px !important;
      box-shadow: 
        0 25px 60px -10px rgba(15, 23, 42, 0.35),
        0 10px 25px rgba(0, 0, 0, 0.12),
        0 0 0 1px rgba(148, 163, 184, 0.25) !important;
      padding: 22px 24px !important;
      color: #0f172a !important;
      position: relative;
      overflow: hidden;
    }
    body.dark-mode .loci-surprise-card {
      background: #0f172a !important;
      border: 2px solid #334155 !important;
      box-shadow: 
        0 25px 60px -10px rgba(0, 0, 0, 0.85),
        0 10px 25px rgba(0, 0, 0, 0.5),
        0 0 0 1px rgba(255, 255, 255, 0.15) !important;
      color: #f8fafc !important;
    }
    .loci-surprise-card::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0; height: 3px;
      background: linear-gradient(90deg, #38bdf8, #818cf8, #ec4899);
    }
    .loci-surprise-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;
    }
    .loci-surprise-badge-group {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }
    .loci-surprise-pill-title {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(56, 189, 248, 0.15);
      border: 1px solid rgba(56, 189, 248, 0.4);
      color: #38bdf8;
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 4px 10px;
      border-radius: 99px;
    }
    .loci-surprise-pill-title .pulse-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #38bdf8;
      box-shadow: 0 0 8px #38bdf8;
      animation: lociPulse 1.5s infinite;
    }
    @keyframes lociPulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(0.85); }
    }
    .loci-surprise-status-badge {
      font-size: 11px;
      font-weight: 700;
      padding: 3px 9px;
      border-radius: 99px;
    }
    .loci-surprise-status-badge.unattempted {
      background: rgba(168, 85, 247, 0.18);
      color: #c084fc;
      border: 1px solid rgba(168, 85, 247, 0.35);
    }
    .loci-surprise-status-badge.forgotten {
      background: rgba(239, 68, 68, 0.18);
      color: #fca5a5;
      border: 1px solid rgba(239, 68, 68, 0.35);
    }
    .loci-surprise-status-badge.vague {
      background: rgba(245, 158, 11, 0.18);
      color: #fcd34d;
      border: 1px solid rgba(245, 158, 11, 0.35);
    }
    .loci-surprise-status-badge.mastered {
      background: rgba(16, 185, 129, 0.18);
      color: #6ee7b7;
      border: 1px solid rgba(16, 185, 129, 0.35);
    }
    .loci-surprise-dismiss-btn {
      background: rgba(0, 0, 0, 0.05);
      border: 1px solid rgba(0, 0, 0, 0.08);
      color: #64748b;
      border-radius: 50%;
      width: 28px;
      height: 28px;
      display: grid;
      place-items: center;
      cursor: pointer;
      font-size: 13px;
      transition: all 0.2s;
    }
    .loci-surprise-dismiss-btn:hover {
      background: rgba(239, 68, 68, 0.25);
      color: #fca5a5;
      border-color: rgba(239, 68, 68, 0.4);
    }
    .loci-surprise-meta-sub {
      font-size: 12px;
      color: #64748b;
      font-weight: 600;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .loci-surprise-question {
      font-size: 14.5px;
      font-weight: 700;
      color: #0f172a !important;
      line-height: 1.55;
      margin-bottom: 14px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      padding: 12px 14px;
      border-radius: 14px;
    }
    body.dark-mode .loci-surprise-question {
      color: #f8fafc !important;
      background: #1e293b !important;
      border-color: #334155 !important;
    }
    .loci-surprise-blank-word {
      display: inline-block;
      padding: 1px 8px;
      margin: 0 4px;
      background: rgba(56, 189, 248, 0.18);
      border-bottom: 2px solid #38bdf8;
      border-radius: 5px;
      color: #38bdf8;
      font-weight: 800;
    }
    .loci-surprise-action-area {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    /* QUIZ (CHỌN ĐÁP ÁN ĐÚNG) */
    .loci-surprise-quiz-opts {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .loci-surprise-quiz-opt {
      width: 100%;
      text-align: left;
      background: rgba(255, 255, 255, 0.62);
      border: 1px solid rgba(255, 255, 255, 0.55);
      color: #1e293b;
      padding: 12px 16px;
      border-radius: 16px;
      font-size: 13.5px;
      line-height: 1.45;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 12px;
      transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02), inset 0 1px 1px rgba(255, 255, 255, 0.85);
    }
    body.dark-mode .loci-surprise-quiz-opt {
      background: rgba(30, 41, 59, 0.65);
      border-color: rgba(255, 255, 255, 0.12);
      color: #e2e8f0;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
    }
    .loci-surprise-quiz-opt:hover:not(:disabled) {
      background: rgba(56, 189, 248, 0.15);
      border-color: rgba(56, 189, 248, 0.4);
      color: #fff;
    }
    .loci-surprise-quiz-opt.correct {
      background: rgba(16, 185, 129, 0.28) !important;
      border-color: #10b981 !important;
      color: #6ee7b7 !important;
      font-weight: 700;
    }
    .loci-surprise-quiz-opt.wrong {
      background: rgba(239, 68, 68, 0.28) !important;
      border-color: #ef4444 !important;
      color: #fca5a5 !important;
    }
    /* TYPE-IN (GÕ ĐIỀN ĐÁP ÁN) */
    .loci-typein-container {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .loci-typein-input {
      width: 100%;
      box-sizing: border-box;
      background: rgba(255, 255, 255, 0.72);
      border: 1.5px solid rgba(2, 132, 199, 0.35);
      border-radius: 16px;
      padding: 12px 16px;
      color: #0f172a;
      font-size: 14.5px;
      outline: none;
      transition: all 0.2s;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.03), inset 0 1px 1.5px rgba(255, 255, 255, 0.9);
    }
    body.dark-mode .loci-typein-input {
      background: rgba(15, 23, 42, 0.75);
      border-color: rgba(56, 189, 248, 0.4);
      color: #ffffff;
    }
    .loci-typein-input::placeholder {
      color: #94a3b8;
    }
    .loci-typein-input:focus {
      border-color: #0284c7;
      box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.2), inset 0 1px 1px #fff;
      background: #ffffff;
      color: #0f172a;
    }
    body.dark-mode .loci-typein-input:focus {
      border-color: #38bdf8;
      box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.25);
      background: rgba(15, 23, 42, 0.95);
      color: #ffffff;
    }
    .loci-typein-input:disabled {
      opacity: 0.75;
      cursor: not-allowed;
    }
    .loci-btn-typein-submit {
      width: 100%;
      background: linear-gradient(135deg, #0284c7, #06b6d4);
      color: #fff;
      border: none;
      padding: 11px 16px;
      border-radius: 12px;
      font-weight: 700;
      font-size: 13.5px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      box-shadow: 0 4px 14px rgba(2, 132, 199, 0.35);
      transition: all 0.2s;
    }
    .loci-btn-typein-submit:hover:not(:disabled) {
      filter: brightness(1.12);
      transform: translateY(-1px);
    }
    .loci-btn-typein-submit:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
    }
    /* EVALUATION CARD - iOS 18 Glass */
    .loci-surprise-eval-card {
      background: rgba(255, 255, 255, 0.75);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border-radius: 16px;
      padding: 14px 16px;
      margin-top: 10px;
      border: 1px solid rgba(0, 0, 0, 0.08);
      color: #0f172a;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.03), inset 0 1px 1px rgba(255, 255, 255, 0.8);
      animation: lociSurpriseSlideUp 0.22s ease-out;
      font-size: 13px;
      line-height: 1.5;
    }
    body.dark-mode .loci-surprise-eval-card {
      background: rgba(15, 23, 42, 0.75);
      border-color: rgba(255, 255, 255, 0.12);
      color: #f8fafc;
    }
    .loci-surprise-eval-card.exact, .loci-surprise-eval-card.close {
      border-color: rgba(16, 185, 129, 0.5);
      background: rgba(16, 185, 129, 0.1);
      color: #065f46;
    }
    body.dark-mode .loci-surprise-eval-card.exact, body.dark-mode .loci-surprise-eval-card.close {
      color: #6ee7b7;
      background: rgba(16, 185, 129, 0.15);
    }
    .loci-surprise-eval-card.vague {
      border-color: rgba(245, 158, 11, 0.5);
      background: rgba(245, 158, 11, 0.1);
      color: #92400e;
    }
    body.dark-mode .loci-surprise-eval-card.vague {
      color: #fcd34d;
      background: rgba(245, 158, 11, 0.15);
    }
    .loci-surprise-eval-card.wrong {
      border-color: rgba(239, 68, 68, 0.5);
      background: rgba(239, 68, 68, 0.1);
      color: #991b1b;
    }
    body.dark-mode .loci-surprise-eval-card.wrong {
      color: #fca5a5;
      background: rgba(239, 68, 68, 0.15);
    }
    .loci-btn-continue {
      width: 100%;
      background: #0284c7;
      border: none;
      color: #ffffff;
      padding: 10px;
      border-radius: 12px;
      font-weight: 700;
      font-size: 13px;
      cursor: pointer;
      margin-top: 10px;
      transition: all 0.2s;
      box-shadow: 0 4px 12px rgba(2, 132, 199, 0.3);
    }
    .loci-btn-continue:hover {
      filter: brightness(1.1);
      transform: translateY(-1px);
    }
    /* FEEDBACK TOAST */
    .loci-surprise-feedback-toast {
      padding: 11px 13px;
      border-radius: 12px;
      font-size: 12.5px;
      font-weight: 600;
      line-height: 1.45;
      display: flex;
      align-items: center;
      gap: 10px;
      margin-top: 10px;
      animation: lociSurpriseSlideUp 0.22s ease-out;
    }
    .loci-surprise-feedback-toast.mastered {
      background: rgba(16, 185, 129, 0.2);
      border: 1px solid rgba(16, 185, 129, 0.45);
      color: #6ee7b7;
    }
    .loci-surprise-feedback-toast.vague {
      background: rgba(245, 158, 11, 0.2);
      border: 1px solid rgba(245, 158, 11, 0.45);
      color: #fcd34d;
    }
    .loci-surprise-feedback-toast.forgotten {
      background: rgba(239, 68, 68, 0.2);
      border: 1px solid rgba(239, 68, 68, 0.45);
      color: #fca5a5;
    }
  `;

  let styleTag = document.getElementById('loci-surprise-recall-styles');
  if (!styleTag) {
    styleTag = document.createElement('style');
    styleTag.id = 'loci-surprise-recall-styles';
    styleTag.textContent = STYLES;
    document.head.appendChild(styleTag);
  }


  // Đảm bảo model-viewer được nạp động an toàn trên mọi trang web
  function ensureModelViewerLoaded() {
    if (typeof window === 'undefined') return Promise.resolve();
    if (window.customElements && window.customElements.get('model-viewer')) return Promise.resolve();
    if (window._modelViewerLoadingPromise) return window._modelViewerLoadingPromise;
    window._modelViewerLoadingPromise = new Promise((resolve) => {
      const script = document.createElement('script');
      script.type = 'module';
      script.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js';
      script.onload = () => resolve();
      script.onerror = () => {
        const script2 = document.createElement('script');
        script2.type = 'module';
        script2.src = 'https://unpkg.com/@google/model-viewer@3.5.0/dist/model-viewer.min.js';
        script2.onload = () => resolve();
        script2.onerror = () => resolve();
        document.head.appendChild(script2);
      };
      document.head.appendChild(script);
    });
    return window._modelViewerLoadingPromise;
  }
  ensureModelViewerLoaded();

  // 5. BỘ ĐIỀU HƯỚNG BẤT CHỢT & CHỌN LỌC CÂU HỎI
  // ════════════════════════════════════════════════════════════════════════════
  // HỆ THỐNG MÔ HÌNH 3D BẤT CHỢT & BẮT BUỘC GÕ ĐÚNG (ACTIVE RECALL TYPE-IN)
  // ÁP DỤNG ĐỒNG BỘ 100% CHO CẢ 3 KHÔNG GIAN BÀI 6, BÀI 7, BÀI 8
  // ════════════════════════════════════════════════════════════════════════════
  const SPATIAL_SURPRISE_MODELS = {
    bai_6: [
      {
        order: 1,
        modelName: "Xe tăng T-34 & Bom nguyên tử kết thúc CTTG II",
        modelUrl: "assets/models/tram1/t34_tank.glb",
        prompt: "Mô hình 3D Xe tăng T-34: Gõ ngày phát xít Nhật chính thức tuyên bố đầu hàng Đồng minh không điều kiện, mở ra thời cơ 'ngàn năm có một' cho Cách mạng Tháng Tám:",
        target: "15/8/1945",
        accepted: ["15/8/1945", "15-8-1945", "15/8", "15 tháng 8 năm 1945", "15/08/1945", "15/8/45"],
        hint: "Giữa tháng 8 năm 1945 (trước ngày Khởi nghĩa Hà Nội 4 ngày)",
        explanation: "Ngày 15/8/1945, Nhật hoàng tuyên bố đầu hàng Đồng minh vô điều kiện, quân Nhật ở Đông Dương tê liệt, tạo thời cơ thuận lợi ngàn năm có một cho dân tộc ta.",
        offset: { x: 0, y: 0.6, z: 0 }
      },
      {
        order: 2,
        modelName: "Lán Nà Nưa & Quân lệnh số 1 Tổng khởi nghĩa",
        modelUrl: "assets/models/tram2/lan_na_nua_opt.glb",
        prompt: "Mô hình 3D Lán Nà Nưa: Gõ khẩu hiệu hành động tiêu biểu nhất trong cao trào kháng Nhật cứu nước (từ 3/1945) thổi bùng khí thế toàn dân:",
        target: "Phá kho thóc Nhật",
        accepted: ["Phá kho thóc Nhật", "Pha kho thoc Nhat", "Phá kho thóc của Nhật", "Pha kho thoc", "Phá kho thóc Nhật giải quyết nạn đói", "Phá kho thóc"],
        hint: "Bắt đầu bằng cụm từ 'Phá kho...', nhằm cứu đói cho hàng triệu đồng bào",
        explanation: "Khẩu hiệu 'Phá kho thóc Nhật, giải quyết nạn đói' đã đáp ứng nguyện vọng cấp bách của quần chúng, dấy lên phong trào cách mạng sôi sục khắp cả nước.",
        offset: { x: 0, y: 0.6, z: 0 }
      },
      {
        order: 3,
        modelName: "Bác Hồ & Đại hội Quốc dân tại Đình Tân Trào",
        modelUrl: "assets/models/tram3/bac_ho.glb?v=nobraid2",
        prompt: "Mô hình 3D Bác Hồ tại Tân Trào: Gõ tên cơ quan đại diện cho dân tộc được Đại hội Quốc dân bầu ra (Chính phủ lâm thời) do Hồ Chí Minh làm Chủ tịch:",
        target: "Ủy ban Dân tộc giải phóng Việt Nam",
        accepted: ["Ủy ban Dân tộc giải phóng Việt Nam", "Uy ban Dan toc giai phong Viet Nam", "Ủy ban Dân tộc giải phóng", "Uy ban Dan toc giai phong"],
        hint: "Tên gọi gồm 7 chữ: 'Ủy ban Dân tộc...'",
        explanation: "Đại hội Quốc dân Tân Trào (16 - 17/8/1945) bầu ra Ủy ban Dân tộc giải phóng Việt Nam do Bác Hồ làm Chủ tịch, lãnh đạo cuộc Tổng khởi nghĩa thắng lợi.",
        offset: { x: 0, y: 0.6, z: 0 }
      },
      {
        order: 4,
        modelName: "Đoàn Giải phóng quân xuất quân dưới Cây đa Tân Trào",
        modelUrl: "assets/models/tram4/nguoi_dan_khoi_nghia.glb",
        prompt: "Mô hình 3D Giải phóng quân xuất quân: Gõ ngày đồng chí Võ Nguyên Giáp chỉ huy đơn vị xuất phát từ Tân Trào tiến về giải phóng thị xã Thái Nguyên:",
        target: "16/8/1945",
        accepted: ["16/8/1945", "16-8-1945", "16/8", "16 tháng 8 năm 1945", "16/08/1945"],
        hint: "Chiều ngày 16 tháng 8 năm 1945, ngay sau lệnh xuất quân của Đại hội Quốc dân",
        explanation: "Chiều 16/8/1945, đồng chí Võ Nguyên Giáp chỉ huy Quân Giải phóng tiến về bao vây đồn Nhật tại thị xã Thái Nguyên, mở màn Tổng khởi nghĩa.",
        offset: { x: 0, y: 0.6, z: 0 }
      },
      {
        order: 5,
        modelName: "Mít tinh khởi nghĩa tại Quảng trường Nhà hát Lớn Hà Nội",
        modelUrl: "assets/models/tram5/mit_tinh_nha_hat_lon.glb",
        prompt: "Mô hình 3D Quảng trường Nhà hát Lớn: Gõ ngày nhân dân Hà Nội tổ chức mít tinh lớn rồi biến thành khởi nghĩa vũ trang chiếm trọn chính quyền Thủ đô:",
        target: "19/8/1945",
        accepted: ["19/8/1945", "19-8-1945", "19/8", "19 tháng 8 năm 1945", "19/08/1945"],
        hint: "Ngày 19 tháng 8 năm 1945 (ngày truyền thống Công an nhân dân Việt Nam)",
        explanation: "Ngày 19/8/1945, khởi nghĩa thắng lợi tại Hà Nội đã giáng đòn quyết định vào chính quyền tay sai, tạo thế cổ vũ cho cả nước vùng lên.",
        offset: { x: 0, y: 0.6, z: 0 }
      },
      {
        order: 6,
        modelName: "Khởi nghĩa Sài Gòn & Thắng lợi trên toàn miền Nam",
        modelUrl: "assets/models/tram6/gianh_khoi_nghia_cuoi_cung.glb",
        prompt: "Mô hình 3D Khởi nghĩa miền Nam: Gõ ngày nhân dân Sài Gòn rầm rộ biểu tình vũ trang khởi nghĩa thắng lợi rực rỡ (ngay sau Huế 23/8):",
        target: "25/8/1945",
        accepted: ["25/8/1945", "25-8-1945", "25/8", "25 tháng 8 năm 1945", "25/08/1945"],
        hint: "Ngày 25 tháng 8 năm 1945",
        explanation: "Ngày 25/8/1945, hơn 1 triệu quần chúng Sài Gòn - Chợ Lớn biểu tình vũ trang lật đổ chính quyền địch, giành thắng lợi vang dội.",
        offset: { x: 0, y: 0.6, z: 0 }
      },
      {
        order: 7,
        modelName: "Vua Bảo Đại trao ấn kiếm thoái vị tại Cố đô Huế",
        modelUrl: "assets/models/tram7/vua_bao_dai_thoai_vi.glb",
        prompt: "Mô hình 3D Vua Bảo Đại trao ấn kiếm: Gõ ngày vua Bảo Đại làm lễ thoái vị tại Ngọ Môn (Huế), chấm dứt hoàn toàn triều đại phong kiến nhà Nguyễn:",
        target: "30/8/1945",
        accepted: ["30/8/1945", "30-8-1945", "30/8", "30 tháng 8 năm 1945", "30/08/1945"],
        hint: "Chiều ngày 30 tháng 8 năm 1945",
        explanation: "Chiều 30/8/1945 tại Ngọ Môn (Huế), Bảo Đại nộp ấn kiếm thoái vị, chế độ quân chủ chuyên chế ngót chục thế kỷ chính thức sụp đổ.",
        offset: { x: 0, y: 0.6, z: 0 }
      },
      {
        order: 8,
        modelName: "Chủ tịch Hồ Chí Minh đọc Tuyên ngôn Độc lập tại Ba Đình",
        modelUrl: "assets/models/tram8/bac_ho_tuyen_ngon.glb",
        prompt: "Mô hình 3D Bác Hồ đọc Tuyên ngôn: Gõ ngày, tháng, năm khai sinh nước Việt Nam Dân chủ Cộng hòa tại Quảng trường Ba Đình:",
        target: "2/9/1945",
        accepted: ["2/9/1945", "02/09/1945", "2-9-1945", "2/9", "2 tháng 9 năm 1945"],
        hint: "Ngày Quốc khánh 2 tháng 9 năm 1945",
        explanation: "Ngày 2/9/1945, Chủ tịch Hồ Chí Minh đọc bản Tuyên ngôn Độc lập lịch sử, tuyên bố nước Việt Nam Dân chủ Cộng hòa chính thức ra đời.",
        offset: { x: 0, y: 0.6, z: 0 }
      },
      {
        order: 9,
        modelName: "Tượng đài Kỷ nguyên Độc lập Tự do 1945",
        modelUrl: "assets/models/tram8/bac_ho_tuyen_ngon.glb",
        prompt: "Mô hình 3D Kỷ nguyên Độc lập: Gõ kỷ nguyên mới mà Cách mạng Tháng Tám năm 1945 đã mở ra cho lịch sử dân tộc Việt Nam:",
        target: "Kỷ nguyên độc lập, tự do",
        accepted: ["Kỷ nguyên độc lập, tự do", "Độc lập, tự do", "doc lap tu do", "Ky nguyen doc lap tu do", "Độc lập tự do", "Kỷ nguyên độc lập tự do"],
        hint: "Kỷ nguyên bắt đầu bằng hai từ 'Độc lập...' và 'Tự do...'",
        explanation: "Cách mạng Tháng Tám mở ra kỷ nguyên mới: Kỷ nguyên độc lập dân tộc gắn liền với tự do và chủ nghĩa xã hội.",
        offset: { x: 0, y: 0.6, z: 0 }
      }
    ],
    bai_7: [
      {
        order: 1,
        modelName: "Quân Đồng minh & Tình thế 'Ngàn cân treo sợi tóc'",
        modelUrl: "assets/models/bai7/tram1/dong_minh_ngoai_xam.glb",
        prompt: "Mô hình 3D Quân Đồng minh: Gõ cụm từ lịch sử mô tả tình thế hiểm nghèo của nước Việt Nam non trẻ ngay sau Cách mạng Tháng Tám 1945:",
        target: "Ngàn cân treo sợi tóc",
        accepted: ["Ngàn cân treo sợi tóc", "Ngan can treo soi toc", "ngan can treo soi toc", "ngàn cân treo sợi tóc"],
        hint: "Thành ngữ 5 chữ bắt đầu bằng 'Ngàn cân...'",
        explanation: "Sau 1945, nước ta rơi vào tình thế 'ngàn cân treo sợi tóc' do cùng lúc đối đầu với giặc đói, giặc dốt và quân thù ngoại xâm bao vây.",
        offset: { x: 0, y: 0.6, z: 0 }
      },
      {
        order: 2,
        modelName: "Nhân dân Nam Bộ anh dũng đứng lên kháng chiến",
        modelUrl: "assets/models/bai7/tram2/nhan_dan_nambo_chien_dau.glb",
        prompt: "Mô hình 3D Nhân dân Nam Bộ chiến đấu: Gõ ngày thực dân Pháp nổ súng đánh úp Sài Gòn, mở đầu cuộc chiến tranh xâm lược nước ta lần thứ hai:",
        target: "23/9/1945",
        accepted: ["23/9/1945", "23-9-1945", "23/9", "23 tháng 9 năm 1945", "23/09/1945"],
        hint: "Ngày 23 tháng 9 năm 1945 (Ngày Nam Bộ kháng chiến)",
        explanation: "Đêm 22 rạng sáng 23/9/1945, thực dân Pháp nổ súng đánh chiếm Sài Gòn, quân dân Nam Bộ anh dũng đứng lên mở màn cuộc kháng chiến cứu nước.",
        offset: { x: 0, y: 0.6, z: 0 }
      },
      {
        order: 3,
        modelName: "Bác Hồ & Lời kêu gọi Toàn quốc kháng chiến",
        modelUrl: "assets/models/bai7/tram3/bac_ho_ki_cam_ket.glb",
        prompt: "Mô hình 3D Bác Hồ kêu gọi kháng chiến: Gõ ngày Bác Hồ phát động 'Lời kêu gọi Toàn quốc kháng chiến' khi Pháp ngang ngược gửi tối hậu thư:",
        target: "19/12/1946",
        accepted: ["19/12/1946", "19-12-1946", "19/12", "19 tháng 12 năm 1946", "19/12/46"],
        hint: "Tối ngày 19 tháng 12 năm 1946 (Pháo đài Láng nổ súng)",
        explanation: "Đêm 19/12/1946, Chủ tịch Hồ Chí Minh ra Lời kêu gọi Toàn quốc kháng chiến: 'Chúng ta thà hi sinh tất cả, chứ nhất định không chịu mất nước...'",
        offset: { x: 0, y: 0.6, z: 0 }
      },
      {
        order: 4,
        modelName: "Chiến sĩ Quyết tử quân Thủ đô giam chân địch 60 ngày đêm",
        modelUrl: "assets/models/bai7/tram4/chien_si_chien_dau.glb",
        prompt: "Mô hình 3D Quyết tử quân: Gõ số ngày đêm quân dân Hà Nội kiên cường giam chân địch trong thành phố để Trung ương rút lên căn cứ an toàn:",
        target: "60 ngày đêm",
        accepted: ["60 ngày đêm", "60 ngay dem", "60 ngày", "60 ngay", "60"],
        hint: "Tròn 2 tháng (chính xác là 60 ngày đêm từ 19/12/1946 đến 17/2/1947)",
        explanation: "60 ngày đêm chiến đấu ngoan cường tại Hà Nội đã hoàn thành xuất sắc nhiệm vụ giam chân địch, tiêu hao sinh lực đối phương, bảo vệ an toàn cho Trung ương.",
        offset: { x: 0, y: 0.6, z: 0 }
      },
      {
        order: 5,
        modelName: "Quân dân ta bẻ gãy gọng kìm tiến công Việt Bắc (1947)",
        modelUrl: "assets/models/bai7/tram5/tap_luyen_viet_bac_thu_dong.glb",
        prompt: "Mô hình 3D Chiến dịch Việt Bắc: Gõ tên dòng sông lịch sử nơi quân dân ta phục kích bắn chìm nhiều tàu chiến và ca-nô Pháp thu - đông 1947:",
        target: "Sông Lô",
        accepted: ["Sông Lô", "Song Lo", "song lo", "sông Lô"],
        hint: "Dòng sông gắn liền với ca khúc bất hủ 'Trường ca Sông Lô' của Văn Cao",
        explanation: "Chiến thắng Đoan Hùng - Sông Lô bẻ gãy gọng kìm đường thủy của Pháp, đập tan âm mưu 'đánh nhanh thắng nhanh' của địch trong chiến dịch Việt Bắc 1947.",
        offset: { x: 0, y: 0.6, z: 0 }
      },
      {
        order: 6,
        modelName: "Chủ tịch Hồ Chí Minh trực tiếp chỉ đạo mặt trận Biên giới",
        modelUrl: "assets/models/bai7/tram6/bac_ho_chi_dao_bien_gioi.glb",
        prompt: "Mô hình 3D Bác Hồ ở Biên giới: Gõ tên cụm cứ điểm quan trọng trên Đường số 4 quân ta nổ súng tiêu diệt mở màn thắng lợi chiến dịch Biên giới 1950:",
        target: "Đông Khê",
        accepted: ["Đông Khê", "Dong Khe", "dong khe", "đông khê"],
        hint: "Cứ điểm nằm giữa Cao Bằng và Thất Khê, bắt đầu bằng chữ 'Đ...'",
        explanation: "Trận đánh chiếm cụm cứ điểm Đông Khê (9/1950) mở màn toàn thắng cho Chiến dịch Biên giới, ta khai thông đường liên lạc quốc tế và giành thế chủ động chiến lược.",
        offset: { x: 0, y: 0.6, z: 0 }
      },
      {
        order: 7,
        modelName: "Hội trường Đại hội đại biểu toàn quốc lần thứ II tại Chiêm Hóa",
        modelUrl: "assets/models/bai7/tram7/dai_hoi_2_chiem_hoa.glb",
        prompt: "Mô hình 3D Hội trường Chiêm Hóa: Gõ tên mới của Đảng khi quyết định ra hoạt động công khai tại Đại hội đại biểu toàn quốc lần II (2/1951):",
        target: "Đảng Lao động Việt Nam",
        accepted: ["Đảng Lao động Việt Nam", "Dang Lao dong Viet Nam", "Đảng Lao động", "Dang Lao Dong Viet Nam", "dang lao dong viet nam"],
        hint: "Đảng của giai cấp công nhân và nhân dân lao động: 'Đảng Lao...'",
        explanation: "Đại hội II (2/1951) tại Chiêm Hóa (Tuyên Quang) quyết định đưa Đảng ra hoạt động công khai với tên gọi Đảng Lao động Việt Nam, đưa kháng chiến bước sang giai đoạn mới.",
        offset: { x: 0, y: 0.6, z: 0 }
      },
      {
        order: 8,
        modelName: "Đại tướng Võ Nguyên Giáp chỉ huy Tiến công Đông – Xuân",
        modelUrl: "assets/models/bai7/tram8/dai_tuong_vo_nguyen_giap_chi_huy.glb",
        prompt: "Mô hình 3D Đại tướng Võ Nguyên Giáp: Gõ số nơi lực lượng Pháp bị ta phân tán trong cuộc Tiến công chiến lược Đông – Xuân 1953 – 1954:",
        target: "5 nơi",
        accepted: ["5", "5 nơi", "năm nơi", "5 noi", "nam noi"],
        hint: "Một con số (Đồng bằng Bắc Bộ, Điện Biên Phủ, Sê-nô, Luông Pha-bang, Plâyku)",
        explanation: "Đòn tiến công chiến lược Đông - Xuân 1953 - 1954 xé lẻ quân cơ động của Na-va ra 5 nơi tập trung, làm phá sản bước đầu Kế hoạch Na-va của Pháp - Mỹ.",
        offset: { x: 0, y: 0.6, z: 0 }
      },
      {
        order: 9,
        modelName: "Hiệp định Giơ-ne-vơ về chấm dứt chiến tranh ở Đông Dương",
        modelUrl: "assets/models/bai7/tram9/gie_ne_ve.glb",
        prompt: "Mô hình 3D Bàn đàm phán Giơ-ne-vơ: Gõ ngày tướng Đờ Cát đầu hàng, lá cờ Quyết chiến Quyết thắng tung bay trên nóc hầm báo hiệu Điện Biên Phủ toàn thắng:",
        target: "7/5/1954",
        accepted: ["7/5/1954", "07/05/1954", "7-5-1954", "7/5", "7 tháng 5 năm 1954"],
        hint: "Chiều ngày 7 tháng 5 năm 1954",
        explanation: "Chiều 7/5/1954, toàn bộ tập đoàn cứ điểm Điện Biên Phủ bị tiêu diệt, đập tan ý chí xâm lược của thực dân Pháp, buộc Pháp phải ký Hiệp định Giơ-ne-vơ 1954.",
        offset: { x: 0, y: 0.6, z: 0 }
      }
    ],
    bai_8: [
      {
        order: 1,
        modelName: "Xây dựng CNXH ở miền Bắc & Đấu tranh chính trị miền Nam",
        modelUrl: "assets/models/bai8/tram1/xay_dung_xa_hoi_chu_nghia.glb",
        prompt: "Mô hình 3D Xây dựng CNXH: Gõ tên dòng sông lịch sử là giới tuyến quân sự tạm thời chia cắt hai miền Nam - Bắc theo Hiệp định Giơ-ne-vơ 1954:",
        target: "Sông Bến Hải",
        accepted: ["Sông Bến Hải", "Song Ben Hai", "Bến Hải", "Ben Hai", "sông Bến Hải", "vĩ tuyến 17"],
        hint: "Dòng sông thuộc tỉnh Quảng Trị nằm trên vĩ tuyến 17",
        explanation: "Theo Hiệp định Giơ-ne-vơ 1954, sông Bến Hải (vĩ tuyến 17) là giới tuyến quân sự tạm thời phân chia vùng tập kết của quân đội hai bên.",
        offset: { x: 0, y: 0.45, z: 0 }
      },
      {
        order: 2,
        modelName: "Đội quân tóc dài & Ngọn cờ Phong trào 'Đồng khởi' Bến Tre",
        modelUrl: "assets/models/bai8/tram2/doi_quan_toc_dai_ben_tre.glb",
        prompt: "Mô hình 3D Đội quân tóc dài: Gõ tên tỉnh nơi ngọn lửa Phong trào 'Đồng khởi' bùng nổ đầu tiên ngày 17/1/1960:",
        target: "Bến Tre",
        accepted: ["Bến Tre", "Ben Tre", "Mỏ Cày Bến Tre", "Mo Cay Ben Tre", "huyện Mỏ Cày, tỉnh Bến Tre"],
        hint: "Tỉnh thuộc đồng bằng sông Cửu Long, xứ sở dừa ngút ngàn",
        explanation: "Phong trào Đồng khởi (17/1/1960) tại Mỏ Cày (Bến Tre) đã chuyển cách mạng miền Nam từ thế giữ gìn lực lượng sang thế tiến công mạnh mẽ.",
        offset: { x: 0, y: 0.45, z: 0 }
      },
      {
        order: 3,
        modelName: "Chiến thuật Trực thăng vận & Chiến thắng Ấp Bắc lịch sử",
        modelUrl: "assets/models/bai8/tram3/my_dung_truc_thang_van.glb",
        prompt: "Mô hình 3D Trực thăng vận: Gõ tên trận đánh vang dội (2/1/1963 tại Mỹ Tho) mở đầu cao trào 'Thi đua Ấp Bắc, giết giặc lập công':",
        target: "Ấp Bắc",
        accepted: ["Ấp Bắc", "Ap Bac", "Trận Ấp Bắc", "Chiến thắng Ấp Bắc", "ap bac"],
        hint: "Địa danh thuộc tỉnh Mỹ Tho (nay thuộc tỉnh Tiền Giang)",
        explanation: "Chiến thắng Ấp Bắc (2/1/1963) khẳng định quân dân miền Nam hoàn toàn có khả năng đánh bại chiến thuật 'trực thăng vận' và 'thiết xa vận' của Mỹ.",
        offset: { x: 0, y: 0.45, z: 0 }
      },
      {
        order: 4,
        modelName: "Xe đạp thồ chi viện tiền tuyến & Trận đầu thắng Mỹ tại Vạn Tường",
        modelUrl: "assets/models/bai8/tram4/xe_dap_tho.glb",
        prompt: "Mô hình 3D Xe đạp thồ & Vạn Tường: Gõ tên trận thắng đầu tiên (8/1965 tại Quảng Ngãi) mở đầu cao trào 'Tìm Mỹ mà đánh, lùng ngụy mà diệt':",
        target: "Vạn Tường",
        accepted: ["Vạn Tường", "Van Tuong", "Chiến thắng Vạn Tường", "Trận Vạn Tường"],
        hint: "Thôn Vạn Tường thuộc xã Bình Hải, huyện Bình Sơn, tỉnh Quảng Ngãi",
        explanation: "Chiến thắng Vạn Tường (18/8/1965) được coi là 'trận Ấp Bắc đối với quân Mỹ', chứng minh quân dân ta hoàn toàn có thể đánh bại quân viễn chinh Mỹ.",
        offset: { x: 0, y: 0.45, z: -0.65 }
      },
      {
        order: 5,
        modelName: "Đặc công đánh chiếm Đại sứ quán Mỹ trong Tết Mậu Thân 1968",
        modelUrl: "assets/models/bai8/tram5/tong_tien_cong_mau_than.glb",
        prompt: "Mô hình 3D Tổng tiến công Mậu Thân: Gõ tên cơ quan ngoại giao đầu não của Mỹ tại Sài Gòn bị đặc công ta đánh chiếm rung chuyển Nhà Trắng:",
        target: "Đại sứ quán Mỹ",
        accepted: ["Đại sứ quán Mỹ", "Dai su quan My", "Tòa Đại sứ Mỹ", "Toa dai su My", "Đại sứ quán", "Tòa Đại sứ"],
        hint: "Cơ quan ngoại giao đại diện chính phủ Mỹ ở trung tâm Sài Gòn",
        explanation: "Đòn đánh táo bạo vào Tòa Đại sứ Mỹ Tết Mậu Thân 1968 làm rung chuyển dư luận nước Mỹ, buộc Mỹ tuyên bố ngừng ném bom miền Bắc và chấp nhận đàm phán tại Paris.",
        offset: { x: -1.05, y: 0.45, z: 0.40 }
      },
      {
        order: 6,
        modelName: "Thành cổ Quảng Trị kiên cường 81 ngày đêm mùa hè đỏ lửa 1972",
        modelUrl: "assets/models/bai8/tram6/mat_tran_quang_tri.glb",
        prompt: "Mô hình 3D Thành cổ Quảng Trị: Gõ số ngày đêm quân dân ta anh dũng giữ chốt dưới mưa bom bão đạn bảo vệ Thành cổ Quảng Trị năm 1972:",
        target: "81 ngày đêm",
        accepted: ["81 ngày đêm", "81 ngay dem", "81 ngày", "81 ngay", "81", "tam muoi mot ngay dem"],
        hint: "Hơn 2 tháng rưỡi (chính xác là 81 ngày đêm năm 1972)",
        explanation: "81 ngày đêm Thành cổ Quảng Trị kiên cường tạo thế áp đảo trên bàn đàm phán Paris, giáng đòn nặng nề vào chiến lược 'Việt Nam hóa chiến tranh'.",
        offset: { x: -1.05, y: 0.45, z: 0.40 }
      },
      {
        order: 7,
        modelName: "Tên lửa SAM-2 hạ pháo đài bay B-52 & Hiệp định Paris 1973",
        modelUrl: "assets/models/bai8/tram7/ban_pha_phao_dai_bay_b52.glb",
        prompt: "Mô hình 3D Điện Biên Phủ trên không: Gõ tên loại tên lửa phòng không của ta đã bắn rụng hàng loạt pháo đài bay B-52 trên bầu trời Hà Nội:",
        target: "SAM-2",
        accepted: ["SAM-2", "SAM 2", "Sam 2", "sam-2", "Tên lửa SAM-2", "S-75", "sam 2"],
        hint: "Tên lửa do Liên Xô viện trợ, bắt đầu bằng chữ 'SAM-...'",
        explanation: "Tên lửa SAM-2 lập công xuất sắc trong 12 ngày đêm Điện Biên Phủ trên không, hạ gục uy danh pháo đài bay B-52, buộc Mỹ phải ký Hiệp định Paris 1973.",
        offset: { x: -1.05, y: 0.45, z: 0.40 }
      },
      {
        order: 8,
        modelName: "Hội nghị Trung ương 21 & Đòn trinh sát chiến lược Phước Long",
        modelUrl: "assets/models/bai8/tram8/chien_thang_phuoc_long.glb",
        prompt: "Mô hình 3D Chiến thắng Phước Long: Gõ tên tỉnh đầu tiên ở miền Nam được giải phóng hoàn toàn (1/1975) được coi là 'đòn trinh sát chiến lược':",
        target: "Phước Long",
        accepted: ["Phước Long", "Phuoc Long", "Đường 14 Phước Long", "Đường 14 - Phước Long", "tỉnh Phước Long"],
        hint: "Tỉnh thuộc miền Đông Nam Bộ (nay là một phần tỉnh Bình Phước)",
        explanation: "Chiến thắng Phước Long (6/1/1975) chứng minh ngụy quân bất lực và Mỹ không thể can thiệp trở lại, củng cố quyết tâm giải phóng miền Nam trong năm 1975.",
        offset: { x: -0.90, y: 0.45, z: 0 }
      },
      {
        order: 9,
        modelName: "Xe tăng 390 húc đổ cổng Dinh Độc Lập — Toàn thắng mùa Xuân 1975",
        modelUrl: "assets/models/bai8/tram9/xe_tang_giai_phong_390.glb",
        prompt: "Mô hình 3D Xe tăng 390: Gõ số hiệu chiếc xe tăng dẫn đầu húc tung cánh cổng sắt Dinh Độc Lập trưa ngày 30/4/1975:",
        target: "390",
        accepted: ["390", "Xe tăng 390", "Xe tang 390", "xe tang 390", "390 xe tang"],
        hint: "Số hiệu 3 chữ số bắt đầu bằng số 3 (ba trăm chín mươi)",
        explanation: "11 giờ 30 phút ngày 30/4/1975, xe tăng 390 húc tung cổng chính Dinh Độc Lập, đánh dấu cuộc kháng chiến chống Mỹ cứu nước toàn thắng, non sông thống nhất.",
        offset: { x: 0, y: 0.45, z: 0.45 }
      }
    ]
  };
  window.SPATIAL_SURPRISE_MODELS = SPATIAL_SURPRISE_MODELS;

  class SurpriseRecallService {
    constructor() {
      this.lastPopTime = 0;
      this.minCooldownMs = 120 * 1000; // Tối thiểu 2 phút giữa các lần xuất hiện
      this.timerId = null;
      this.activeCardEl = null;
      this.lastUserActivity = Date.now();
      this.snoozedUntil = 0;
      this.autoDismissTimer = null;

      this.initActivityTracker();
      this.scheduleNextCheck(10 * 1000); // Lần kiểm tra đầu tiên sau 10s mở trang (phản xạ nhanh)
    }

    initActivityTracker() {
      const ping = () => { this.lastUserActivity = Date.now(); };
      window.addEventListener('mousemove', ping, { passive: true });
      window.addEventListener('keydown', ping, { passive: true });
      window.addEventListener('touchstart', ping, { passive: true });
      window.addEventListener('scroll', ping, { passive: true });
    }

    scheduleNextCheck(delayMs) {
      if (this.timerId) clearTimeout(this.timerId);
      const nextDelay = delayMs || (150 * 1000 + Math.floor(Math.random() * 90 * 1000)); // 2.5 - 4.0 phút
      this.timerId = setTimeout(() => {
        this.attemptSurprisePop();
      }, nextDelay);
    }

    // Thu thập toàn bộ câu hỏi (100% là Quiz hoặc Type-in / Cloze)
    getAllCandidateQuestions() {
      const anchorsData = window.LOCI_ANCHORS || {};
      const ALLOWED = ['bai_6', 'bai_7', 'bai_8'];
      const questions = [];

      ALLOWED.forEach(k => {
        const l = anchorsData[k];
        if (!l) return;

        (l.anchors || []).forEach(a => {
          // 1. Trắc nghiệm (Chọn đáp án đúng)
          (a.quizzes || []).forEach((qz, idx) => {
            questions.push({
              id: `${a.id}_qz_${idx}`,
              mode: 'quiz', // Chọn đáp án đúng
              lessonKey: k,
              lessonTitle: l.title,
              anchorTitle: a.title,
              data: qz
            });
          });

          // 2. Gõ đáp án (Typein - Gõ điền)
          const typeinsList = (Array.isArray(a.typeins) && a.typeins.length > 0) ? a.typeins : ((a.quizTypes && Array.isArray(a.quizTypes.typeins)) ? a.quizTypes.typeins : []);
          typeinsList.forEach((ti, idx) => {
            questions.push({
              id: `${a.id}_ti_${idx}`,
              mode: 'typein', // Gõ điền
              lessonKey: k,
              lessonTitle: l.title,
              anchorTitle: a.title,
              data: {
                prompt: ti.prompt || ti.question,
                answer: ti.answer,
                accepted: ti.accepted || [ti.answer],
                hint: ti.hint || a.title
              }
            });
          });

          // 3. Điền từ khuyết (Cloze - Gõ điền)
          const clozesList = (Array.isArray(a.clozes) && a.clozes.length > 0) ? a.clozes : ((a.quizTypes && Array.isArray(a.quizTypes.clozes)) ? a.quizTypes.clozes : []);
          clozesList.forEach((cz, idx) => {
            const text = cz.text || cz.sentence || '';
            const blank = (cz.blanks && cz.blanks[0]) || cz.hidden || cz.blank || '';
            const sentence = text.includes('{') ? text.replace(/\{([^}]+)\}/g, '[BLANK]') : (text.includes('[BLANK]') ? text : text + ' [BLANK]');
            questions.push({
              id: `${a.id}_cz_${idx}`,
              mode: 'typein', // Gõ điền
              lessonKey: k,
              lessonTitle: l.title,
              anchorTitle: a.title,
              data: {
                prompt: sentence,
                sentence: sentence,
                answer: blank,
                blank: blank,
                hint: a.title,
                accepted: [blank]
              }
            });
          });

          // 4. Flashcards -> Tự động chuyển đổi thành Gõ điền (Type-in)
          (a.flashcards || []).forEach((fc, idx) => {
            const lines = (fc.back || '').split('\n').map(s => s.trim()).filter(Boolean);
            const shortAns = lines[0] ? lines[0].replace(/^[①②③④⑤\d\.\-\s]+/, '').trim() : fc.back;
            questions.push({
              id: `${a.id}_fc_${idx}`,
              mode: 'typein', // Gõ điền
              lessonKey: k,
              lessonTitle: l.title,
              anchorTitle: a.title,
              data: {
                prompt: fc.front,
                answer: shortAns,
                fullAnswer: fc.back,
                hint: fc.mnemonic || a.mnemonic || '',
                accepted: [shortAns, fc.back]
              }
            });
          });
        });
      });

      return questions;
    }

    // Chọn câu hỏi theo trọng số thuật toán SM-2:
    // Chưa làm (Weight 5.0) -> Chưa nhớ (Weight 4.0) -> Nhớ mang máng (Weight 2.5) -> Đã nhớ (Weight 0)
    pickWeightedQuestion() {
      const questions = this.getAllCandidateQuestions();
      if (!questions.length) return null;

      const engine = window.reviewEngine || (typeof ReviewEngine !== 'undefined' ? new ReviewEngine() : null);
      if (!engine) return questions[Math.floor(Math.random() * questions.length)];

      const pool = [];
      let totalWeight = 0;

      questions.forEach(q => {
        const state = typeof engine.getCardRecallState === 'function'
          ? engine.getCardRecallState(q.id)
          : { status: 'unattempted', weight: 5.0, label: 'Chưa làm', badgeText: 'Chưa làm · Tần suất cao' };

        if (state.weight > 0) {
          pool.push({ question: q, state: state, weight: state.weight });
          totalWeight += state.weight;
        }
      });

      if (!pool.length || totalWeight <= 0) return null;

      // Vòng quay Roulette
      let randomVal = Math.random() * totalWeight;
      for (let i = 0; i < pool.length; i++) {
        randomVal -= pool[i].weight;
        if (randomVal <= 0) {
          return pool[i];
        }
      }

      return pool[0];
    }

    attemptSurprisePop(force = false, forceItem = null) {
      // 1. NẾU ĐANG TRONG KỲ KIỂM TRA / ĐỀ THI: CHẶN TUYỆT ĐỐI KHÔNG LÀM PHIỀN HỌC SINH
      if (isExamActive()) {
        console.log('[Surprise Recall] Đang trong kỳ kiểm tra/đề thi THPT. Exam Shield chặn pop-up bảo vệ phòng thi.');
        if (this.activeCardEl) this.dismissCard(15);
        this.scheduleNextCheck(180 * 1000);
        return false;
      }

      if (!force && Date.now() < this.snoozedUntil) {
        this.scheduleNextCheck(Math.max(30000, this.snoozedUntil - Date.now()));
        return false;
      }

      const elapsed = Date.now() - this.lastPopTime;
      if (!force && elapsed < this.minCooldownMs) {
        this.scheduleNextCheck(this.minCooldownMs - elapsed + 10000);
        return false;
      }

      if (!force && Date.now() - this.lastUserActivity > 8 * 60 * 1000) {
        this.scheduleNextCheck(60 * 1000);
        return false;
      }

      if (this.activeCardEl) {
        return false;
      }

      // 2. KÍCH HOẠT THỬ THÁCH MÔ HÌNH 3D TYPE-IN (CẢ TRONG KHÔNG GIAN 3D LẪN Ở NGOÀI PORTAL / TỔNG QUAN)
      const allKeys = ['bai_6', 'bai_7', 'bai_8'];
      let lessonKey = (typeof window.EFFECTIVE_LESSON_KEY !== 'undefined' && window.EFFECTIVE_LESSON_KEY)
        ? window.EFFECTIVE_LESSON_KEY
        : ((typeof localStorage !== 'undefined' && localStorage.getItem('last_visited_lesson')) || 'bai_8');

      if (!SPATIAL_SURPRISE_MODELS[lessonKey]) {
        lessonKey = allKeys[Math.floor(Math.random() * allKeys.length)];
      }

      let item = forceItem;
      if (!item) {
        // Nếu ở ngoài Portal (không có camera 3D), xoay vòng ngẫu nhiên giữa cả 3 bài
        const targetLesson = (window.camera && window.lociList) ? lessonKey : allKeys[Math.floor(Math.random() * allKeys.length)];
        const pool = SPATIAL_SURPRISE_MODELS[targetLesson] || SPATIAL_SURPRISE_MODELS['bai_8'];
        item = pool[Math.floor(Math.random() * pool.length)];
        if (item) item.lessonKey = targetLesson;
      } else if (!item.lessonKey) {
        item.lessonKey = lessonKey;
      }

      if (item) {
        this.render3DModelSurpriseCard(item);
        this.lastPopTime = Date.now();
        playAudioFeedback('surprise');
        return true;
      }

      // 3. DỰ PHÒNG NẾU CÓ CÂU HỎI TỪ KHO KÝ ỨC
      const selected = this.pickWeightedQuestion();
      if (selected) {
        this.renderSurpriseCard(selected.question, selected.state);
        this.lastPopTime = Date.now();
        playAudioFeedback('surprise');
        return true;
      }

      this.scheduleNextCheck(240 * 1000);
      return false;
    }

    // BAY CAMERA ĐẾN MODEL 3D VÀ CHIẾU SPOTLIGHT VÀNG KIM
    focusSpatialModel(item) {
      if (!window.camera || !window.lociList) return;
      const locus = window.lociList.find(l => l.order === item.order) || window.lociList[item.order - 1];
      if (!locus || !locus.pos) return;

      const basePos = locus.pos;
      const off = item.offset || { x: 0, y: 0.6, z: 0 };
      const modelCenter = new THREE.Vector3(
        basePos[0] + off.x,
        (basePos[1] || 0.01) + off.y,
        basePos[2] + off.z
      );

      let dir = window.camera.position.clone().sub(modelCenter);
      dir.y = 0;
      if (dir.lengthSq() < 0.05) dir.set(0, 0, 1);
      dir.normalize();

      const endCamPos = modelCenter.clone().addScaledVector(dir, 1.65);
      endCamPos.y = Math.max(1.15, Math.min(1.45, modelCenter.y + 0.35));

      const startPos = window.camera.position.clone();
      const startQuat = window.camera.quaternion.clone();
      const m = new THREE.Matrix4().lookAt(endCamPos, modelCenter, new THREE.Vector3(0, 1, 0));
      const endQuat = new THREE.Quaternion().setFromRotationMatrix(m);

      const t0 = performance.now(), dur = 750;
      const step = (now) => {
        const t = Math.min(1, (now - t0) / dur);
        const k = 1 - Math.pow(1 - t, 3);
        window.camera.position.lerpVectors(startPos, endCamPos, k);
        window.camera.quaternion.slerpQuaternions(startQuat, endQuat, k);
        if (t < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);

      // Thêm đèn spotlight vàng rực rỡ chiếu vào mô hình
      if (window.scene) {
        let spot = window.scene.getObjectByName('surprise_3d_spotlight');
        if (!spot) {
          spot = new THREE.PointLight(0xfbbf24, 3.5, 5.0);
          spot.name = 'surprise_3d_spotlight';
          window.scene.add(spot);
        }
        spot.position.copy(modelCenter);
        spot.position.y += 1.2;
        spot.visible = true;
      }
    }

    // GIAO DIỆN THỬ THÁCH MÔ HÌNH 3D BẤT CHỢT (ACTIVE RECALL TYPE-IN)
    render3DModelSurpriseCard(item) {
      const existing = document.getElementById('loci-surprise-wrapper');
      if (existing) existing.remove();

      // Đảm bảo model-viewer luôn sẵn sàng
      if (typeof ensureModelViewerLoaded === 'function') ensureModelViewerLoaded();

      // Hướng camera và chiếu sáng mô hình trong không gian 3D nếu có
      this.focusSpatialModel(item);

      const wrapper = document.createElement('div');
      wrapper.id = 'loci-surprise-wrapper';
      wrapper.className = 'loci-surprise-wrapper';

      const lKey = item.lessonKey || (typeof window.EFFECTIVE_LESSON_KEY !== 'undefined' ? window.EFFECTIVE_LESSON_KEY : 'bai_8');
      const lessonName = (lKey === 'bai_8')
        ? 'Bài 8: Kháng chiến chống Mỹ (1954 – 1975)'
        : ((lKey === 'bai_7')
          ? 'Bài 7: Kháng chiến chống thực dân Pháp (1945 – 1954)'
          : 'Bài 6: Cách mạng Tháng Tám năm 1945');

      const modelUrl = item.modelUrl || '';

      wrapper.innerHTML = `
        <div class="loci-surprise-card">
          <div class="loci-surprise-head">
            <div class="loci-surprise-badge-group">
              <span class="loci-surprise-pill-title" style="background:rgba(245,158,11,0.2); border-color:#f59e0b; color:#fbbf24;">
                <span class="pulse-dot" style="background:#fbbf24; box-shadow:0 0 8px #fbbf24;"></span>
                <span>🚨 Thử thách 3D Bất chợt</span>
              </span>
              <span class="loci-surprise-status-badge vague" style="background:rgba(56,189,248,0.18); color:#38bdf8; border-color:rgba(56,189,248,0.35);">
                Active Recall Type-in
              </span>
            </div>
            <button type="button" class="loci-surprise-dismiss-btn" title="Để sau (Snooze 3 phút)" id="btn-surprise-dismiss">✕</button>
          </div>

          <div class="loci-surprise-meta-sub" style="color:#d97706; font-weight:700; margin-bottom:8px;">
            <span>🏛️ ${lessonName}</span> • <span style="color:#0284c7;">Mô hình: ${item.modelName}</span>
          </div>

          <!-- MÔ HÌNH 3D XUẤT HIỆN TRỰC QUAN XOAY 360 ĐỘ -->
          <div class="loci-surprise-3d-viewport" style="
            width: 100%;
            height: 200px;
            margin: 6px 0 12px 0;
            border-radius: 18px;
            overflow: hidden;
            position: relative;
            background: radial-gradient(circle at 50% 50%, rgba(30, 41, 59, 0.85) 0%, rgba(15, 23, 42, 0.98) 100%);
            border: 1.5px solid rgba(56, 189, 248, 0.4);
            box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.5), 0 8px 25px -4px rgba(0, 0, 0, 0.3);
          ">
            <model-viewer
              src="${modelUrl}"
              alt="${item.modelName}"
              auto-rotate
              rotation-per-second="28deg"
              camera-controls
              shadow-intensity="1.5"
              shadow-softness="0.75"
              exposure="1.15"
              loading="eager"
              reveal="auto"
              touch-action="pan-y"
              style="width: 100%; height: 100%; background: transparent;"
            >
              <div slot="poster" style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; color:#38bdf8; font-size:12px; font-weight:700; gap:8px;">
                <div class="pulse-dot" style="width:12px; height:12px; background:#38bdf8;"></div>
                <span>Đang tải mô hình 3D...</span>
              </div>
            </model-viewer>
            <div style="position:absolute; bottom:6px; left:10px; right:10px; display:flex; justify-content:space-between; align-items:center; font-size:10.5px; color:#cbd5e1; pointer-events:none;">
              <span style="background:rgba(0,0,0,0.65); padding:2px 8px; border-radius:6px; border:1px solid rgba(255,255,255,0.15);">🔄 Kéo xoay 360° · Thu phóng</span>
              <span style="background:rgba(56,189,248,0.25); color:#38bdf8; padding:2px 8px; border-radius:6px; border:1px solid rgba(56,189,248,0.4); font-weight:700;">3D GLB</span>
            </div>
          </div>

          <div class="loci-surprise-question" style="font-size:14.5px; font-weight:700; color:#0f172a; line-height:1.5; margin-bottom:12px;">
            ${item.prompt}
          </div>

          <div class="loci-typein-container">
            <input type="text" class="loci-typein-input" id="loci-typein-input"
                   placeholder="Gõ chính xác câu trả lời rồi nhấn Enter..."
                   autocomplete="off" spellcheck="false" />
            
            <div style="display:flex; gap:8px;">
              <button type="button" class="loci-btn-typein-submit" id="loci-typein-submit" style="flex:2;">
                <span>Kiểm tra đáp án [Enter]</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </button>
              <button type="button" id="loci-btn-hint" style="
                flex:1;
                background:rgba(245,158,11,0.1);
                border:1px solid rgba(245,158,11,0.3);
                color:#d97706;
                border-radius:12px;
                font-weight:700;
                font-size:12.5px;
                cursor:pointer;
                display:flex;
                align-items:center;
                justify-content:center;
                gap:4px;
              " title="Xem gợi ý nếu gặp khó khăn">
                <span>💡 Gợi ý</span>
              </button>
            </div>
            <div id="loci-hint-text" style="display:none; font-size:12.5px; color:#92400e; background:rgba(245,158,11,0.15); border:1px solid rgba(245,158,11,0.3); padding:8px 12px; border-radius:10px; margin-top:6px;">
              <b>Gợi ý:</b> ${item.hint}
            </div>
          </div>

          <div id="loci-surprise-toast-slot"></div>
        </div>
      `;

      document.body.appendChild(wrapper);
      this.activeCardEl = wrapper;

      const dismissBtn = wrapper.querySelector('#btn-surprise-dismiss');
      if (dismissBtn) {
        dismissBtn.onclick = () => {
          this.removeSpatialSpotlight();
          this.dismissCard(3);
        };
      }

      const hintBtn = wrapper.querySelector('#loci-btn-hint');
      const hintText = wrapper.querySelector('#loci-hint-text');
      if (hintBtn && hintText) {
        hintBtn.onclick = () => {
          hintText.style.display = (hintText.style.display === 'none') ? 'block' : 'none';
        };
      }

      const inputEl = wrapper.querySelector('#loci-typein-input');
      const submitBtn = wrapper.querySelector('#loci-typein-submit');
      if (inputEl) {
        setTimeout(() => inputEl.focus(), 150);
        inputEl.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            submitBtn.click();
          }
        });
      }

      if (submitBtn) {
        submitBtn.onclick = () => {
          const typedVal = (inputEl ? inputEl.value : '').trim();
          if (!typedVal) {
            inputEl.focus();
            return;
          }
          inputEl.disabled = true;
          submitBtn.disabled = true;

          const res = evaluateTypeInText(typedVal, item.target, item.accepted || [], item.hint || '');
          const quality = res.recommendedGrade || (res.score >= 80 ? 5 : (res.score >= 50 ? 3 : 1));

          if (quality >= 4) {
            playAudioFeedback('success');
            // Thưởng điểm vào hệ sinh thái
            if (typeof window.awardLociBonusPoints === 'function') {
              window.awardLociBonusPoints(100);
            }
          } else if (quality <= 2) {
            playAudioFeedback('wrong');
          }

          const engine = window.reviewEngine || (typeof ReviewEngine !== 'undefined' ? new ReviewEngine() : null);
          this.handleEvaluatedResult({
            id: `spatial_surprise_${item.order}`,
            lessonTitle: lessonName,
            anchorTitle: item.modelName,
            data: { fullAnswer: item.explanation }
          }, quality, engine, {
            isTypeIn: true,
            res: res,
            typed: typedVal,
            target: item.target,
            fullAnswer: item.explanation
          });

          this.removeSpatialSpotlight();
        };
      }
    }

    removeSpatialSpotlight() {
      if (window.scene) {
        const spot = window.scene.getObjectByName('surprise_3d_spotlight');
        if (spot) spot.visible = false;
      }
    }

    dismissCard(snoozeMin = 3) {
      if (this.autoDismissTimer) {
        clearTimeout(this.autoDismissTimer);
        this.autoDismissTimer = null;
      }
      if (!this.activeCardEl) return;
      this.snoozedUntil = Date.now() + snoozeMin * 60 * 1000;
      this.activeCardEl.style.animation = 'lociSurpriseFadeOut 0.25s ease-in forwards';
      setTimeout(() => {
        if (this.activeCardEl) {
          this.activeCardEl.remove();
          this.activeCardEl = null;
        }
      }, 250);
      this.scheduleNextCheck();
    }

    // GIAO DIỆN CÂU HỎI: CHỈ GỒM "CHỌN ĐÁP ÁN ĐÚNG" HOẶC "GÕ ĐIỀN"
    renderSurpriseCard(q, state) {
      const existing = document.getElementById('loci-surprise-wrapper');
      if (existing) existing.remove();

      const wrapper = document.createElement('div');
      wrapper.id = 'loci-surprise-wrapper';
      wrapper.className = 'loci-surprise-wrapper';

      const lessonName = q.lessonTitle ? q.lessonTitle.split(':')[0] : (q.lessonKey === 'bai_6' ? 'Bài 6' : q.lessonKey === 'bai_7' ? 'Bài 7' : 'Bài 8');
      const anchorName = q.anchorTitle || (q.data && (q.data.anchorTitle || q.data.title)) || 'Mốc Loci';
      const isQuiz = (q.mode === 'quiz');

      let promptText = '';
      let targetAnswer = '';
      let quizOptions = [];
      let quizCorrectIdx = 0;
      let quizExplanation = '';

      if (isQuiz) {
        promptText = q.data.question || '';
        quizOptions = q.data.options || [];
        quizCorrectIdx = q.data.correct !== undefined ? q.data.correct : 0;
        quizExplanation = q.data.explanation || '';
      } else {
        promptText = q.data.prompt || q.data.sentence || '';
        targetAnswer = q.data.answer || q.data.blank || '';
        if (promptText.includes('[BLANK]')) {
          promptText = promptText.replace(/\b\[BLANK\]\b|\[BLANK\]/g, '<span class="loci-surprise-blank-word">... ? ...</span>');
        }
      }

      wrapper.innerHTML = `
        <div class="loci-surprise-card">
          <div class="loci-surprise-head">
            <div class="loci-surprise-badge-group">
              <span class="loci-surprise-pill-title">
                <span class="pulse-dot"></span>
                <span>${isQuiz ? 'Phản xạ · Trắc nghiệm' : 'Phản xạ · Gõ điền'}</span>
              </span>
              <span class="loci-surprise-status-badge ${state.status}">
                ${state.badgeText}
              </span>
            </div>
            <button class="loci-surprise-dismiss-btn" id="btn-surprise-dismiss" title="Tạm hoãn 3 phút">✕</button>
          </div>

          <div class="loci-surprise-meta-sub">
            <span>${lessonName}</span>
            <span>•</span>
            <span style="color:#e2e8f0; font-weight:600;">${anchorName}</span>
          </div>

          <div class="loci-surprise-question">${promptText}</div>

          <div class="loci-surprise-action-area" id="loci-surprise-action-area">
            ${isQuiz ? `
              <div class="loci-surprise-quiz-opts">
                ${quizOptions.map((opt, oIdx) => `
                  <button type="button" class="loci-surprise-quiz-opt" data-opt-idx="${oIdx}">
                    <b style="color:#38bdf8; min-width:20px;">${String.fromCharCode(65 + oIdx)}.</b>
                    <span>${typeof opt === 'string' ? opt : opt.text}</span>
                  </button>
                `).join('')}
              </div>
            ` : `
              <div class="loci-typein-container">
                <input type="text" id="loci-typein-input" class="loci-typein-input" placeholder="Gõ câu trả lời hoặc từ khóa của bạn tại đây..." autocomplete="off" />
                <button type="button" id="loci-typein-submit" class="loci-btn-typein-submit">
                  <span>Kiểm tra đáp án ↵</span>
                </button>
              </div>
            `}
          </div>

          <div id="loci-surprise-toast-slot"></div>
        </div>
      `;

      document.body.appendChild(wrapper);
      this.activeCardEl = wrapper;

      const dismissBtn = wrapper.querySelector('#btn-surprise-dismiss');
      if (dismissBtn) dismissBtn.onclick = () => this.dismissCard(3);

      const engine = window.reviewEngine || (typeof ReviewEngine !== 'undefined' ? new ReviewEngine() : null);

      // XỬ LÝ MODE 1: TRẮC NGHIỆM (CHỌN ĐÁP ÁN ĐÚNG)
      if (isQuiz) {
        const optBtns = wrapper.querySelectorAll('.loci-surprise-quiz-opt');
        optBtns.forEach(btn => {
          btn.onclick = () => {
            optBtns.forEach(b => b.disabled = true);
            const chosenIdx = parseInt(btn.dataset.optIdx, 10);
            const isCorrect = (chosenIdx === quizCorrectIdx);

            if (isCorrect) {
              btn.classList.add('correct');
              playAudioFeedback('success');
              this.handleEvaluatedResult(q, 5, engine, {
                isCorrect: true,
                message: 'Chính xác! Bạn đã ghi nhớ vững vàng kiến thức này.'
              });
            } else {
              btn.classList.add('wrong');
              if (optBtns[quizCorrectIdx]) optBtns[quizCorrectIdx].classList.add('correct');
              playAudioFeedback('wrong');
              this.handleEvaluatedResult(q, 1, engine, {
                isCorrect: false,
                explanation: quizExplanation,
                correctLetter: String.fromCharCode(65 + quizCorrectIdx)
              });
            }
          };
        });
      }

      // XỬ LÝ MODE 2: GÕ ĐIỀN (TYPE-IN / CLOZE)
      if (!isQuiz) {
        const inputEl = wrapper.querySelector('#loci-typein-input');
        const submitBtn = wrapper.querySelector('#loci-typein-submit');

        if (inputEl) {
          setTimeout(() => inputEl.focus(), 150);
          inputEl.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              submitBtn.click();
            }
          });
        }

        if (submitBtn) {
          submitBtn.onclick = () => {
            const typedVal = (inputEl ? inputEl.value : '').trim();
            inputEl.disabled = true;
            submitBtn.disabled = true;

            const res = evaluateTypeInText(typedVal, targetAnswer, q.data.accepted || [], q.data.hint || '');
            const quality = res.recommendedGrade || (res.score >= 80 ? 5 : (res.score >= 50 ? 3 : 1));

            if (quality >= 4) {
              playAudioFeedback('success');
            } else if (quality <= 2) {
              playAudioFeedback('wrong');
            }

            this.handleEvaluatedResult(q, quality, engine, {
              isTypeIn: true,
              res: res,
              typed: typedVal,
              target: targetAnswer,
              fullAnswer: q.data.fullAnswer || ''
            });
          };
        }
      }
    }

    // HIỂN THỊ KẾT QUẢ CHẤM ĐIỂM TỰ ĐỘNG & CẬP NHẬT SM-2
    handleEvaluatedResult(q, quality, engine, details = {}) {
      if (engine && typeof engine.processReview === 'function') {
        engine.processReview(q.id, quality);
      }

      const toastSlot = this.activeCardEl ? this.activeCardEl.querySelector('#loci-surprise-toast-slot') : null;
      if (!toastSlot) return;

      let resultHtml = '';

      if (details.isTypeIn) {
        const statusClass = details.res.status === 'exact' ? 'exact' : (details.res.status === 'close' ? 'close' : (details.res.status === 'vague' ? 'vague' : 'wrong'));
        resultHtml = `
          <div class="loci-surprise-eval-card ${statusClass}">
            <div style="font-weight:800; font-size:13.5px; margin-bottom:5px; color:${quality >= 4 ? '#4ade80' : (quality === 3 ? '#facc15' : '#f87171')};">
              ${details.res.title} ${details.res.score > 0 ? '(' + details.res.score + '%)' : ''}
            </div>
            <div style="font-size:12px; opacity:0.85; margin-bottom:4px;">Bạn đã gõ: <i>${details.typed || '(Bỏ trống)'}</i></div>
            <div style="font-size:12.5px; margin-bottom:4px;">Đáp án chuẩn: <b style="color:#38bdf8;">${details.target}</b></div>
            ${details.fullAnswer && details.fullAnswer !== details.target ? `<div style="font-size:11.5px; color:#cbd5e1; margin-top:4px; opacity:0.8;">Chi tiết: ${details.fullAnswer}</div>` : ''}
          </div>
        `;
      }

      let toastHtml = '';
      if (quality >= 4) {
        toastHtml = `
          <div class="loci-surprise-feedback-toast mastered">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            <div>
              <b>Đã ghi nhớ vững vàng!</b><br>
              <span>Thuật toán SM-2 đã giãn cách thẻ này. Bạn sẽ <b>không bị ôn lại nhiều nữa</b>.</span>
            </div>
          </div>`;
      } else if (quality === 3) {
        toastHtml = `
          <div class="loci-surprise-feedback-toast vague">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            <div>
              <b>Đã ghi nhận nhớ mang máng!</b><br>
              <span>Thẻ này sẽ <b>bất chợt xuất hiện lại sớm</b> để bạn hoàn thiện trọn vẹn.</span>
            </div>
          </div>`;
      } else {
        toastHtml = `
          <div class="loci-surprise-feedback-toast forgotten">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
            <div>
              <b>Chưa nhớ? Đừng lo!</b><br>
              <span>Thuật toán đã tăng tần suất. Thẻ sẽ <b>lặp lại thường xuyên</b> giúp bạn khắc sâu phản xạ.</span>
              ${details.explanation ? `<div style="margin-top:4px; font-size:11.5px; color:#fecaca;">${details.explanation}</div>` : ''}
            </div>
          </div>`;
      }

      toastSlot.innerHTML = `
        ${resultHtml}
        ${toastHtml}
        <button type="button" class="loci-btn-continue" id="btn-surprise-continue">
          ${quality >= 4 ? 'Hoàn tất & Tiếp tục học' : 'Đã hiểu & Tiếp tục'}
        </button>
      `;

      const btnContinue = toastSlot.querySelector('#btn-surprise-continue');
      if (btnContinue) {
        btnContinue.onclick = () => this.dismissCard(quality >= 4 ? 4 : 2);
      }

      // Tự động đóng sau khoảng thời gian hợp lý (để người học kịp xem đáp án)
      const autoDismissSec = quality >= 4 ? 3500 : (quality === 3 ? 4500 : 6000);
      this.autoDismissTimer = setTimeout(() => {
        this.dismissCard(quality >= 4 ? 4 : 2);
      }, autoDismissSec);
    }
  }

  // Khởi tạo Singleton toàn cục
  window.LociSurpriseRecall = new SurpriseRecallService();


  // KÍCH HOẠT THỬ THÁCH MÔ HÌNH 3D BẤT CHỢT TOÀN CỤC (PHÍM TẮT T HOẶC GỌI TỪ NÚT HUD)
  window.trigger3DModelSurpriseRecall = function (forceItem = null) {
    if (window.LociSurpriseRecall) {
      window.LociSurpriseRecall.attemptSurprisePop(true, forceItem);
    }
  };

  window.addEventListener('keydown', (e) => {
    if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
    if (e.key === 't' || e.key === 'T') {
      e.preventDefault();
      window.trigger3DModelSurpriseRecall();
    }
  });

})();
