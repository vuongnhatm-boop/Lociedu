/**
 * ══════════════════════════════════════════════════════════════════════════════
 * LOCI EDU — HỆ THỐNG POPUP & DIALOG TỰ THIẾT KẾ CAO CẤP (CUSTOM POPUP SYSTEM)
 * PHONG CÁCH LIQUID GLASS SIÊU MƯỢT iOS 18 (100% NO EMOJI)
 * ──────────────────────────────────────────────────────────────────────────────
 * - THAY THẾ HOÀN TOÀN ALERT / CONFIRM MẶC ĐỊNH CỦA TRÌNH DUYỆT (0 POPUP HỆ THỐNG).
 * - Kính mờ Translucent Liquid Glass chuẩn iOS 18, không gian mờ đa chiều, phản chiếu ánh sáng.
 * - 100% SVG Vector tinh xảo (Chuẩn Apple SF Symbols), không sử dụng emoji rườm rà.
 * - Hỗ trợ phím tắt: [ESC], [Enter], [Space] để đóng nhanh, tương thích 3D FPS.
 * ══════════════════════════════════════════════════════════════════════════════
 */

(function () {
  'use strict';

  // 1. INJECT CSS LIQUID GLASS iOS 18
  const STYLES = `
    /* OVERLAY NỀN MỜ LIQUID GLASS iOS 18 */
    .loci-popup-overlay {
      position: fixed;
      inset: 0;
      z-index: 2147483647;
      background: rgba(15, 23, 42, 0.45);
      backdrop-filter: blur(24px) saturate(180%);
      -webkit-backdrop-filter: blur(24px) saturate(180%);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.26s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.26s;
      pointer-events: none;
      font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Plus Jakarta Sans', system-ui, sans-serif;
    }

    .loci-popup-overlay.active {
      opacity: 1;
      visibility: visible;
      pointer-events: auto;
    }

    /* CARD MODAL TRONG SUỐT LIQUID GLASS */
    .loci-popup-card {
      width: 100%;
      max-width: 480px;
      background: rgba(255, 255, 255, 0.82);
      backdrop-filter: blur(32px) saturate(200%);
      -webkit-backdrop-filter: blur(32px) saturate(200%);
      border: 1px solid rgba(255, 255, 255, 0.85);
      border-radius: 28px;
      box-shadow: 0 30px 70px rgba(0, 0, 0, 0.18), 0 8px 24px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.95);
      padding: 24px 26px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      position: relative;
      overflow: hidden;
      transform: scale(0.94) translateY(12px);
      transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1);
      color: #0f172a;
    }

    .loci-popup-overlay.active .loci-popup-card {
      transform: scale(1) translateY(0);
    }

    /* GIAO DIỆN TỐI NẾU HỆ THỐNG / BODY CHỌN DARK MODE */
    body.theme-dark .loci-popup-card,
    [data-theme="dark"] .loci-popup-card {
      background: rgba(28, 32, 42, 0.85);
      border-color: rgba(255, 255, 255, 0.12);
      color: #f8fafc;
      box-shadow: 0 30px 70px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.15);
    }

    /* HEADER */
    .loci-popup-header {
      display: flex;
      align-items: center;
      gap: 14px;
      position: relative;
    }

    .loci-popup-icon-wrap {
      width: 46px;
      height: 46px;
      border-radius: 14px;
      background: rgba(2, 132, 199, 0.1);
      border: 1px solid rgba(2, 132, 199, 0.22);
      color: #0284c7;
      display: grid;
      place-items: center;
      flex-shrink: 0;
      transition: all 0.2s;
    }

    .type-hint .loci-popup-icon-wrap { background: rgba(245, 158, 11, 0.12); border-color: rgba(245, 158, 11, 0.28); color: #d97706; }
    .type-success .loci-popup-icon-wrap { background: rgba(16, 185, 129, 0.12); border-color: rgba(16, 185, 129, 0.28); color: #059669; }
    .type-knowledge .loci-popup-icon-wrap { background: rgba(14, 165, 233, 0.12); border-color: rgba(14, 165, 233, 0.28); color: #0284c7; }
    .type-error .loci-popup-icon-wrap { background: rgba(239, 68, 68, 0.12); border-color: rgba(239, 68, 68, 0.28); color: #dc2626; }

    .loci-popup-titles {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .loci-popup-badge {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      width: fit-content;
      padding: 3px 10px;
      border-radius: 999px;
      background: rgba(2, 132, 199, 0.1);
      color: #0284c7;
      border: 1px solid rgba(2, 132, 199, 0.22);
    }

    .type-hint .loci-popup-badge { background: rgba(245, 158, 11, 0.12); color: #d97706; border-color: rgba(245, 158, 11, 0.28); }
    .type-success .loci-popup-badge { background: rgba(16, 185, 129, 0.12); color: #059669; border-color: rgba(16, 185, 129, 0.28); }
    .type-knowledge .loci-popup-badge { background: rgba(14, 165, 233, 0.12); color: #0284c7; border-color: rgba(14, 165, 233, 0.28); }
    .type-error .loci-popup-badge { background: rgba(239, 68, 68, 0.12); color: #dc2626; border-color: rgba(239, 68, 68, 0.28); }

    .loci-popup-title {
      font-size: 17px;
      font-weight: 700;
      color: #0f172a;
      margin: 0;
      line-height: 1.35;
      letter-spacing: -0.3px;
    }

    body.theme-dark .loci-popup-title,
    [data-theme="dark"] .loci-popup-title {
      color: #f8fafc;
    }

    .loci-popup-close-btn {
      position: absolute;
      top: -2px;
      right: -2px;
      background: rgba(0, 0, 0, 0.05);
      border: 1px solid rgba(0, 0, 0, 0.06);
      color: #64748b;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      font-size: 13px;
      cursor: pointer;
      display: grid;
      place-items: center;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .loci-popup-close-btn:hover {
      background: rgba(239, 68, 68, 0.12);
      color: #dc2626;
      border-color: rgba(239, 68, 68, 0.25);
    }

    /* BODY NỘI DUNG */
    .loci-popup-body {
      display: flex;
      flex-direction: column;
      gap: 10px;
      color: #334155;
      font-size: 14px;
      line-height: 1.6;
      max-height: 60vh;
      overflow-y: auto;
      padding-right: 4px;
    }

    body.theme-dark .loci-popup-body,
    [data-theme="dark"] .loci-popup-body {
      color: #cbd5e1;
    }

    .loci-popup-body::-webkit-scrollbar { width: 5px; }
    .loci-popup-body::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.15); border-radius: 99px; }

    .loci-popup-bullet {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      background: rgba(255, 255, 255, 0.65);
      border: 1px solid rgba(0, 0, 0, 0.06);
      border-radius: 14px;
      padding: 10px 14px;
      font-size: 13.5px;
      color: #334155;
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
    }

    body.theme-dark .loci-popup-bullet,
    [data-theme="dark"] .loci-popup-bullet {
      background: rgba(255, 255, 255, 0.05);
      border-color: rgba(255, 255, 255, 0.1);
      color: #e2e8f0;
    }

    .loci-popup-bullet b { color: #0284c7; }
    .type-hint .loci-popup-bullet b { color: #d97706; }
    .type-success .loci-popup-bullet b { color: #059669; }

    .loci-bullet-icon {
      color: #0284c7;
      font-size: 13px;
      margin-top: 2px;
    }

    /* ẢNH TƯ LIỆU NẾU CÓ */
    .loci-popup-photo-preview {
      width: 100%;
      height: 180px;
      border-radius: 16px;
      background-size: cover;
      background-position: center;
      border: 1px solid rgba(0, 0, 0, 0.08);
      position: relative;
      overflow: hidden;
      margin-bottom: 4px;
    }

    .loci-popup-photo-caption {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
      color: #f8fafc;
      font-size: 11.5px;
      padding: 16px 12px 8px;
    }

    /* FOOTER */
    .loci-popup-footer {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 4px;
    }

    .loci-popup-btn-confirm {
      padding: 10px 22px;
      border-radius: 999px;
      background: linear-gradient(135deg, rgba(14, 165, 233, 0.92), rgba(2, 132, 199, 0.96));
      border: 1px solid rgba(255, 255, 255, 0.3);
      color: #ffffff;
      font-size: 13.5px;
      font-weight: 600;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      box-shadow: 0 4px 14px rgba(2, 132, 199, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.4);
    }

    .loci-popup-btn-confirm:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(2, 132, 199, 0.35);
    }
  `;

  // 2. ICON SVG CHO CÁC PHÂN LOẠI (100% NO EMOJI)
  const ICONS = {
    hint: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-1 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>`,
    success: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`,
    knowledge: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>`,
    error: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`,
    warning: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
    info: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>`
  };

  let overlayEl = null;
  let cardEl = null;
  let currentResolve = null;

  function initPopupDOM() {
    if (document.getElementById('loci-custom-popup-overlay')) return;

    // Inject CSS
    const styleEl = document.createElement('style');
    styleEl.id = 'loci-custom-popup-styles';
    styleEl.textContent = STYLES;
    document.head.appendChild(styleEl);

    // Tạo Overlay DOM
    overlayEl = document.createElement('div');
    overlayEl.id = 'loci-custom-popup-overlay';
    overlayEl.className = 'loci-popup-overlay';
    overlayEl.innerHTML = `
      <div class="loci-popup-card" id="loci-popup-card" onclick="event.stopPropagation();">
        <div class="loci-popup-header">
          <div class="loci-popup-icon-wrap" id="loci-popup-icon"></div>
          <div class="loci-popup-titles">
            <span class="loci-popup-badge" id="loci-popup-badge">GỢI Ý KÝ ỨC</span>
            <h3 class="loci-popup-title" id="loci-popup-title">Tiêu Đề Thông Báo</h3>
          </div>
          <button class="loci-popup-close-btn" id="loci-popup-close-btn" title="Đóng [ESC]">✕</button>
        </div>
        <div id="loci-popup-photo-slot"></div>
        <div class="loci-popup-body" id="loci-popup-body"></div>
        <div class="loci-popup-footer">
          <button class="loci-popup-btn-confirm" id="loci-popup-confirm-btn">
            <span id="loci-popup-confirm-text">Đã hiểu & Tiếp tục ôn tập</span>
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(overlayEl);
    cardEl = document.getElementById('loci-popup-card');

    // Sự kiện đóng
    overlayEl.addEventListener('click', () => closePopup());
    document.getElementById('loci-popup-close-btn').addEventListener('click', () => closePopup());
    document.getElementById('loci-popup-confirm-btn').addEventListener('click', () => closePopup());

    // Phím tắt bàn phím
    window.addEventListener('keydown', (e) => {
      if (!overlayEl || !overlayEl.classList.contains('active')) return;
      if (e.key === 'Escape' || e.key === 'Enter' || e.code === 'Space') {
        e.preventDefault();
        e.stopPropagation();
        closePopup();
      }
    });
  }

  function closePopup() {
    if (!overlayEl) return;
    overlayEl.classList.remove('active');
    if (currentResolve) {
      currentResolve(true);
      currentResolve = null;
    }
  }

  function cleanEmojiText(text) {
    if (!text) return '';
    return String(text).replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '').trim();
  }

  /**
   * HÀM MỞ CUSTOM DIALOG CHÍNH
   */
  function showCustomDialog(options) {
    initPopupDOM();

    let opts = {};
    if (typeof options === 'string') {
      opts = parseRawMessageToOptions(options);
    } else {
      opts = Object.assign({}, options);
    }

    const type = opts.type || 'info';
    const title = cleanEmojiText(opts.title || 'Thông Báo Loci Edu');
    const badge = cleanEmojiText(opts.badge || (type === 'hint' ? 'GỢI Ý KÝ ỨC' : type === 'success' ? 'HOÀN THÀNH' : type === 'knowledge' ? 'KIẾN THỨC CHUẨN' : 'THÔNG BÁO'));
    const iconHtml = ICONS[type] || ICONS.info;
    const confirmText = cleanEmojiText(opts.confirmText || (type === 'hint' ? 'Đã hiểu manh mối, tôi sẽ tự gõ' : 'Đã hiểu & Tiếp tục'));

    // Thiết lập class theme
    cardEl.className = `loci-popup-card type-${type}`;

    // Cập nhật header
    document.getElementById('loci-popup-icon').innerHTML = iconHtml;
    document.getElementById('loci-popup-badge').textContent = badge;
    document.getElementById('loci-popup-title').textContent = title;
    document.getElementById('loci-popup-confirm-text').textContent = confirmText;

    // Ảnh tư liệu nếu có
    const photoSlot = document.getElementById('loci-popup-photo-slot');
    if (opts.photoUrl) {
      photoSlot.innerHTML = `
        <div class="loci-popup-photo-preview" style="background-image: url('${opts.photoUrl}');">
          <div class="loci-popup-photo-caption">${opts.photoCaption || 'Tư liệu lịch sử liên quan'}</div>
        </div>
      `;
      photoSlot.style.display = 'block';
    } else {
      photoSlot.innerHTML = '';
      photoSlot.style.display = 'none';
    }

    // Xử lý nội dung văn bản (tự động phân tích bullet points)
    const bodyEl = document.getElementById('loci-popup-body');
    const rawMsg = opts.message || opts.text || '';
    bodyEl.innerHTML = formatMessageContent(rawMsg);

    // Hiển thị popup
    overlayEl.classList.add('active');

    // Thoát pointer lock nếu đang khóa
    if (document.pointerLockElement) {
      try { document.exitPointerLock(); } catch (_) {}
    }

    return new Promise((resolve) => {
      currentResolve = resolve;
    });
  }

  /**
   * TỰ ĐỘNG PHÂN TÍCH TEXT ĐỂ TẠO CÁC BULLET ITEM ĐẸP MẮT
   */
  function formatMessageContent(text) {
    if (!text) return '';
    const cleanText = cleanEmojiText(text);
    const lines = cleanText.split('\n').map(l => l.trim()).filter(Boolean);

    let html = '';
    lines.forEach(line => {
      if (line.startsWith('- ') || line.startsWith('• ') || line.startsWith('* ')) {
        const clean = line.replace(/^[\-•\*]\s*/, '');
        html += `
          <div class="loci-popup-bullet">
            <span class="loci-bullet-icon">●</span>
            <span>${highlightKeywords(clean)}</span>
          </div>
        `;
      } else {
        html += `<div style="font-size:13.5px; line-height:1.55; color:inherit;">${highlightKeywords(line)}</div>`;
      }
    });

    return html;
  }

  function highlightKeywords(str) {
    if (!str) return '';
    return str
      .replace(/(\b\d{1,2}[\/\-\.]\d{1,2}(?:[\/\-\.]\d{4})?\b|\b\d{4}\b)/g, '<b style="color:#0284c7; font-weight:700;">$1</b>')
      .replace(/(Tổng khởi nghĩa|Đình Tân Trào|Lán Nà Nưa|Quân lệnh số 1|Bác Hồ|Hồ Chí Minh|Bảo Đại|Ngọ Môn|Ba Đình|Tuyên ngôn Độc lập|Cách mạng Tháng Tám)/g, '<b style="color:#0369a1; font-weight:700;">$1</b>');
  }

  /**
   * BỘ TỰ ĐỘNG PHÂN LOẠI TIN NHẮN TỪ RAW STRING (CHO DROP-IN ALERT)
   */
  function parseRawMessageToOptions(msg) {
    if (!msg) return { message: '', type: 'info' };

    let type = 'info';
    let title = 'Thông Báo Loci Edu';

    if (msg.includes('GỢI Ý') || msg.includes('Gợi ý')) {
      type = 'hint';
      title = 'Gợi Ý Ký Ức Không Gian';
    } else if (msg.includes('Chúc mừng') || msg.includes('hoàn thành') || msg.includes('Xuất sắc')) {
      type = 'success';
      title = 'Hoàn Thành Xuất Sắc!';
    } else if (msg.includes('KIẾN THỨC GỐC') || msg.includes('SGK')) {
      type = 'knowledge';
      title = 'Kiến Thức Chuẩn Lịch Sử 12';
    } else if (msg.includes('Lỗi') || msg.includes('Không thể') || msg.includes('thất bại')) {
      type = 'error';
      title = 'Thông Báo Lỗi';
    } else if (msg.includes('Cảnh báo') || msg.includes('Chưa')) {
      type = 'warning';
      title = 'Cảnh Báo Luyện Tập';
    }

    return {
      type: type,
      title: title,
      message: msg
    };
  }

  // 3. EXPORT GLOBAL OBJECT
  window.LociCustomPopup = {
    show: showCustomDialog,
    close: closePopup,
    showHint: function (stepNum, totalSteps, hintText, photoUrl) {
      return showCustomDialog({
        type: 'hint',
        badge: 'GỢI Ý KÝ ỨC',
        title: 'Manh mối gợi ý Phần ' + stepNum + '/' + totalSteps + ':',
        message: hintText,
        photoUrl: photoUrl,
        confirmText: 'Đã hiểu manh mối, tôi sẽ tự gõ'
      });
    },
    showKnowledge: function (anchorName, knowledgeText, photoUrl) {
      return showCustomDialog({
        type: 'knowledge',
        badge: 'KIẾN THỨC SGK CHUẨN',
        title: 'Tư Liệu Gốc: ' + anchorName,
        message: knowledgeText,
        photoUrl: photoUrl,
        confirmText: 'Đã nắm vững kiến thức'
      });
    },
    showSuccess: function (title, msg) {
      return showCustomDialog({
        type: 'success',
        badge: 'XUẤT SẮC',
        title: title || 'Hoàn Thành Thử Thách!',
        message: msg,
        confirmText: 'Tiếp tục hành trình'
      });
    },
    showError: function (title, msg) {
      return showCustomDialog({
        type: 'error',
        badge: 'CẦN CHÚ Ý',
        title: title || 'Thao Tác Chưa Đúng',
        message: msg,
        confirmText: 'Thử lại'
      });
    }
  };

  // Thay thế alert mặc định của window
  window.alert = function (message) {
    showCustomDialog(message);
  };

  console.log('[CustomPopupSystem] Đã kích hoạt hệ thống Popup Liquid Glass iOS 18 (100% No Emoji)!');
})();
