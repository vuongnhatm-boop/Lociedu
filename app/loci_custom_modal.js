/**
 * LOCI EDU - Hệ Thống Pop-up Thông Báo & Hộp Thoại Riêng Biệt (Custom Pop-up Modal)
 * Thay thế hoàn toàn pop-up mặc định của hệ thống / trình duyệt (window.alert, window.confirm, window.prompt).
 * Đảm bảo giao diện kính mờ sang trọng, chuẩn học thuật Loci và không bao giờ làm gián đoạn 3D/VR.
 */
(function () {
    if (typeof window === 'undefined') return;
    if (window.LociCustomPopupLoaded) return;
    window.LociCustomPopupLoaded = true;

    // 1. Tạo và chèn CSS giao diện Pop-up kính mờ cao cấp
    const style = document.createElement('style');
    style.id = 'loci-custom-popup-styles';
    style.textContent = `
    .loci-popup-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(4, 9, 20, 0.75);
      backdrop-filter: blur(12px) saturate(160%);
      -webkit-backdrop-filter: blur(12px) saturate(160%);
      z-index: 99999999 !important;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      box-sizing: border-box;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.22s ease-out;
      font-family: 'Outfit', 'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    .loci-popup-overlay.active {
      opacity: 1;
      pointer-events: auto;
    }
    .loci-popup-box {
      width: 100%;
      max-width: 450px;
      background: linear-gradient(145deg, rgba(15, 23, 42, 0.98), rgba(24, 33, 56, 0.96));
      border: 1px solid rgba(56, 189, 248, 0.3);
      box-shadow: 0 25px 65px rgba(0, 0, 0, 0.75), 0 0 35px rgba(56, 189, 248, 0.15);
      border-radius: 22px;
      padding: 24px 26px 22px;
      color: #f8fafc;
      box-sizing: border-box;
      transform: scale(0.92) translateY(12px);
      transition: transform 0.24s cubic-bezier(0.16, 1, 0.3, 1);
      position: relative;
    }
    .loci-popup-overlay.active .loci-popup-box {
      transform: scale(1) translateY(0);
    }
    .loci-popup-header {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-bottom: 14px;
    }
    .loci-popup-icon-badge {
      width: 44px;
      height: 44px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .loci-popup-icon-badge.info,
    .loci-popup-icon-badge.noti {
      background: rgba(2, 132, 199, 0.18);
      border: 1px solid rgba(56, 189, 248, 0.45);
      color: #38bdf8;
    }
    .loci-popup-icon-badge.success {
      background: rgba(16, 185, 129, 0.18);
      border: 1px solid rgba(16, 185, 129, 0.45);
      color: #34d399;
    }
    .loci-popup-icon-badge.warning {
      background: rgba(245, 158, 11, 0.18);
      border: 1px solid rgba(245, 158, 11, 0.45);
      color: #fbbf24;
    }
    .loci-popup-icon-badge.error {
      background: rgba(239, 68, 68, 0.18);
      border: 1px solid rgba(239, 68, 68, 0.45);
      color: #f87171;
    }
    .loci-popup-title {
      font-size: 17.5px;
      font-weight: 700;
      color: #f8fafc;
      margin: 0;
      flex: 1;
      letter-spacing: -0.2px;
      line-height: 1.35;
    }
    .loci-popup-close-btn {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #94a3b8;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.18s;
      outline: none;
      font-size: 14px;
    }
    .loci-popup-close-btn:hover {
      background: rgba(255, 255, 255, 0.14);
      color: #ffffff;
      transform: scale(1.06);
    }
    .loci-popup-body {
      font-size: 14.5px;
      line-height: 1.6;
      color: #cbd5e1;
      margin: 0 0 20px 0;
      white-space: pre-line;
      word-break: break-word;
    }
    .loci-popup-input {
      width: 100%;
      box-sizing: border-box;
      background: rgba(2, 6, 23, 0.75);
      border: 1.5px solid rgba(56, 189, 248, 0.35);
      border-radius: 12px;
      padding: 12px 14px;
      font-size: 14px;
      color: #f8fafc;
      outline: none;
      margin-bottom: 20px;
      transition: all 0.2s;
      font-family: inherit;
    }
    .loci-popup-input:focus {
      border-color: #38bdf8;
      box-shadow: 0 0 14px rgba(56, 189, 248, 0.35);
      background: rgba(2, 6, 23, 0.95);
    }
    .loci-popup-actions {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 10px;
    }
    .loci-popup-btn {
      padding: 10px 20px;
      border-radius: 12px;
      font-size: 13.5px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.18s;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      font-family: inherit;
    }
    .loci-popup-btn-cancel {
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.16);
      color: #cbd5e1;
    }
    .loci-popup-btn-cancel:hover {
      background: rgba(255, 255, 255, 0.14);
      color: #ffffff;
    }
    .loci-popup-btn-confirm {
      background: linear-gradient(135deg, #0284c7, #06b6d4);
      border: none;
      color: #ffffff;
      box-shadow: 0 4px 16px rgba(2, 132, 199, 0.4);
    }
    .loci-popup-btn-confirm:hover {
      box-shadow: 0 6px 20px rgba(6, 182, 212, 0.5);
      transform: translateY(-1px);
    }
    .loci-popup-btn-danger {
      background: linear-gradient(135deg, #ef4444, #dc2626);
      border: none;
      color: #ffffff;
      box-shadow: 0 4px 16px rgba(239, 68, 68, 0.4);
    }
    .loci-popup-btn-danger:hover {
      box-shadow: 0 6px 20px rgba(239, 68, 68, 0.5);
      transform: translateY(-1px);
    }
  `;
    document.head.appendChild(style);

    // 2. Icon SVGs cho từng trạng thái
    const ICONS = {
        noti: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>`,
        info: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`,
        success: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
        warning: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
        error: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`,
        question: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`
    };

    // 3. Quản lý DOM Pop-up dùng chung
    let overlay = null;
    let currentResolver = null;

    function getOverlay() {
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'loci-popup-overlay';
            overlay.id = 'loci-custom-popup-overlay';
            document.body.appendChild(overlay);

            // Bấm ra ngoài backdrop để đóng
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    closeLociPopup(null);
                }
            });

            // Lắng nghe phím Enter / Escape
            window.addEventListener('keydown', (e) => {
                if (!overlay || !overlay.classList.contains('active')) return;
                if (e.key === 'Escape') {
                    e.preventDefault();
                    closeLociPopup(null);
                } else if (e.key === 'Enter') {
                    // Nếu đang trong input, submit
                    const inputEl = overlay.querySelector('.loci-popup-input');
                    if (inputEl && document.activeElement === inputEl) {
                        e.preventDefault();
                        closeLociPopup(inputEl.value);
                    } else {
                        const confirmBtn = overlay.querySelector('.loci-popup-btn-confirm, .loci-popup-btn-danger');
                        if (confirmBtn) {
                            e.preventDefault();
                            closeLociPopup(true);
                        }
                    }
                }
            });
        }
        return overlay;
    }

    function closeLociPopup(result) {
        if (!overlay) return;
        overlay.classList.remove('active');
        if (currentResolver) {
            currentResolver(result);
            currentResolver = null;
        }
    }

    /**
     * Hiển thị Pop-up tùy chỉnh với đầy đủ các cấu hình
     */
    function showLociPopup(options = {}) {
        return new Promise((resolve) => {
            currentResolver = resolve;
            const container = getOverlay();

            const type = options.type || 'info';
            const iconSvg = ICONS[type] || ICONS.info;
            const title = options.title || (type === 'success' ? 'Thành công' : type === 'warning' ? 'Lưu ý' : type === 'error' ? 'Cảnh báo' : 'Thông báo');
            const message = options.message || '';
            const confirmText = options.confirmText || 'Đồng ý';
            const cancelText = options.cancelText || 'Hủy';
            const showCancel = options.showCancel || false;
            const isDanger = options.isDanger || false;
            const hasInput = options.input || false;
            const inputValue = options.inputValue || '';
            const inputPlaceholder = options.inputPlaceholder || '';

            container.innerHTML = `
        <div class="loci-popup-box" role="dialog" aria-modal="true">
          <div class="loci-popup-header">
            <div class="loci-popup-icon-badge ${type}">
              ${iconSvg}
            </div>
            <h3 class="loci-popup-title">${title}</h3>
            <button class="loci-popup-close-btn" id="loci-popup-btn-close" aria-label="Đóng">✕</button>
          </div>
          <div class="loci-popup-body">${message}</div>
          ${hasInput ? `<input type="text" class="loci-popup-input" id="loci-popup-input-field" placeholder="${inputPlaceholder}" value="${inputValue}">` : ''}
          <div class="loci-popup-actions">
            ${showCancel ? `<button class="loci-popup-btn loci-popup-btn-cancel" id="loci-popup-btn-cancel">${cancelText}</button>` : ''}
            <button class="loci-popup-btn ${isDanger ? 'loci-popup-btn-danger' : 'loci-popup-btn-confirm'}" id="loci-popup-btn-confirm">${confirmText}</button>
          </div>
        </div>
      `;

            // Gán sự kiện nút
            const closeBtn = container.querySelector('#loci-popup-btn-close');
            if (closeBtn) closeBtn.onclick = () => closeLociPopup(null);

            const cancelBtn = container.querySelector('#loci-popup-btn-cancel');
            if (cancelBtn) cancelBtn.onclick = () => closeLociPopup(false);

            const confirmBtn = container.querySelector('#loci-popup-btn-confirm');
            if (confirmBtn) {
                confirmBtn.onclick = () => {
                    if (hasInput) {
                        const inputVal = container.querySelector('#loci-popup-input-field')?.value || '';
                        closeLociPopup(inputVal);
                    } else {
                        closeLociPopup(true);
                    }
                };
            }

            // Kích hoạt hiển thị
            container.classList.add('active');

            // Auto focus
            setTimeout(() => {
                if (hasInput) {
                    const inputField = container.querySelector('#loci-popup-input-field');
                    if (inputField) {
                        inputField.focus();
                        inputField.select();
                    }
                } else if (confirmBtn) {
                    confirmBtn.focus();
                }
            }, 50);
        });
    }

    // 4. Các hàm tiện ích chuyên dụng
    window.showLociPopup = showLociPopup;

    window.lociAlert = function (message, title, type) {
        let inferredType = type || 'info';
        let inferredTitle = title || 'Thông báo';
        if (typeof message === 'string') {
            const lower = message.toLowerCase();
            if (lower.includes('lỗi') || lower.includes('thất bại') || lower.includes('error') || lower.includes('chặn')) {
                inferredType = type || 'error';
                inferredTitle = title || 'Cảnh báo';
            } else if (lower.includes('thành công') || lower.includes('đã lưu') || lower.includes('hoàn thành')) {
                inferredType = type || 'success';
                inferredTitle = title || 'Thành công';
            } else if (lower.includes('lưu ý') || lower.includes('vui lòng') || lower.includes('chưa') || lower.includes('chú ý')) {
                inferredType = type || 'warning';
                inferredTitle = title || 'Lưu ý';
            }
        }
        return showLociPopup({
            title: inferredTitle,
            message: message,
            type: inferredType,
            confirmText: 'Đồng ý',
            showCancel: false
        });
    };

    window.lociConfirm = function (message, title = 'Xác nhận', type = 'warning') {
        const isDanger = type === 'error' || (typeof message === 'string' && (message.toLowerCase().includes('xóa') || message.toLowerCase().includes('đặt lại') || message.toLowerCase().includes('đăng xuất')));
        return showLociPopup({
            title: title,
            message: message,
            type: isDanger ? 'error' : (type || 'warning'),
            confirmText: 'Xác nhận',
            cancelText: 'Hủy',
            showCancel: true,
            isDanger: isDanger
        });
    };

    window.lociPrompt = function (message, defaultValue = '', title = 'Nhập thông tin') {
        return showLociPopup({
            title: title,
            message: message,
            type: 'info',
            input: true,
            inputValue: defaultValue,
            confirmText: 'Xác nhận',
            cancelText: 'Hủy',
            showCancel: true
        });
    };

    window.lociNotify = function (title, message, type = 'noti') {
        return showLociPopup({
            title: title || 'Thông báo từ LOCI EDU',
            message: message,
            type: type,
            confirmText: 'Đã hiểu',
            showCancel: false
        });
    };

    // 5. GHI ĐÈ window.alert MẶC ĐỊNH CỦA TRÌNH DUYỆT
    // Khi bất kỳ mã nào gọi alert(...) -> Tự động chuyển thành Pop-up riêng LOCI EDU!
    if (typeof window.alert === 'function') {
        window._nativeAlert = window.alert;
    }
    window.alert = function (message) {
        return window.lociAlert(message);
    };

    console.log('[LociPopup] Đã kích hoạt hệ thống Pop-up thông báo riêng biệt LOCI EDU!');
})();
