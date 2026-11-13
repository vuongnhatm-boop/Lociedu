// app/reminder_137.js - Hệ thống Thuật toán Chu kỳ Ôn tập 1-3-7 & Đặt Giờ Nhắc Hẹn trên Web
(function (window) {
    'use strict';

    const isEmbedded = (typeof window !== 'undefined' && window.self !== window.top);
    
    // Tự động dọn dẹp các toast cũ nếu có
    if (typeof document !== 'undefined') {
        const oldToasts = document.getElementById('loci-toast-container');
        if (oldToasts) oldToasts.remove();
    }

    const CYCLE_MS = {
        cycle1: 1 * 24 * 60 * 60 * 1000, // 24 giờ (Ngày 1)
        cycle3: 3 * 24 * 60 * 60 * 1000, // 72 giờ (Ngày 3)
        cycle7: 7 * 24 * 60 * 60 * 1000  // 168 giờ (Ngày 7)
    };

    const STORAGE_KEY_137 = 'loci_cycle_137_data';
    const STORAGE_KEY_SETTINGS = 'loci_reminder_settings';

    // 1. Quản lý dữ liệu chu kỳ 1-3-7
    function getCycleData() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY_137) || '{}');
        } catch (e) {
            return {};
        }
    }

    function saveCycleData(data) {
        try {
            localStorage.setItem(STORAGE_KEY_137, JSON.stringify(data));
        } catch (e) {}
    }

    // 2. Quản lý cài đặt nhắc hẹn
    function getSettings() {
        const defaults = {
            enabled: true,
            time: '20:00', // Giờ mặc định 20:00 mỗi tối
            notify137: true,
            sound: true,
            lastNotifiedDate: null,
            lastNotified137Lesson: null,
            notifiedLessons: {}
        };
        try {
            const saved = JSON.parse(localStorage.getItem(STORAGE_KEY_SETTINGS) || '{}');
            return Object.assign(defaults, saved);
        } catch (e) {
            return defaults;
        }
    }

    function saveSettings(settings) {
        try {
            localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
        } catch (e) {}
    }

    // 3. Ghi nhận khi học xong 1 bài (cập nhật chu kỳ)
    function recordLessonCompleted(lessonId, scorePercent = 100) {
        const data = getCycleData();
        const now = Date.now();
        const item = data[lessonId] || {
            lessonId,
            history: [],
            lastCompletedAt: 0,
            cycle1Done: false,
            cycle3Done: false,
            cycle7Done: false
        };

        // Nếu đã từng làm, kiểm tra lần làm này hoàn tất mốc nào
        if (item.lastCompletedAt > 0) {
            const elapsed = now - item.lastCompletedAt;
            if (elapsed >= CYCLE_MS.cycle1 && !item.cycle1Done) {
                item.cycle1Done = true;
                item.cycle1DoneAt = now;
            } else if (elapsed >= CYCLE_MS.cycle3 && item.cycle1Done && !item.cycle3Done) {
                item.cycle3Done = true;
                item.cycle3DoneAt = now;
            } else if (elapsed >= CYCLE_MS.cycle7 && item.cycle3Done && !item.cycle7Done) {
                item.cycle7Done = true;
                item.cycle7DoneAt = now;
            }
        }

        // Cập nhật mốc hoàn thành mới
        item.lastCompletedAt = now;
        if (!item.history) item.history = [];
        item.history.push({ timestamp: now, scorePercent });
        data[lessonId] = item;
        saveCycleData(data);
        return item;
    }

    // 4. Lấy trạng thái chi tiết chu kỳ 1-3-7 của một bài
    function getLessonCycleStatus(lessonId) {
        const data = getCycleData();
        const item = data[lessonId];
        const now = Date.now();

        if (!item || !item.lastCompletedAt) {
            return {
                lessonId,
                hasStarted: false,
                currentMilestone: 1,
                overallText: 'Chưa bắt đầu chu kỳ 1-3-7',
                milestones: {
                    cycle1: { label: 'Ngày 1 (+24h)', desc: 'Củng cố trí nhớ ban đầu', status: 'pending', text: 'Chưa làm bài', dueAt: null },
                    cycle3: { label: 'Ngày 3 (+72h)', desc: 'Ngăn sụt giảm trí nhớ', status: 'pending', text: 'Chờ ngày 1', dueAt: null },
                    cycle7: { label: 'Ngày 7 (+168h)', desc: 'Khắc sâu trí nhớ dài hạn', status: 'pending', text: 'Chờ ngày 3', dueAt: null }
                }
            };
        }

        const t0 = item.lastCompletedAt;
        const due1 = t0 + CYCLE_MS.cycle1;
        const due3 = t0 + CYCLE_MS.cycle3;
        const due7 = t0 + CYCLE_MS.cycle7;

        function calcMilestone(isDone, dueTime, prevDone, label, desc) {
            if (isDone) {
                return { label, desc, status: 'done', text: 'Đã hoàn thành', dueAt: dueTime, isDone: true };
            }
            if (!prevDone) {
                return { label, desc, status: 'pending', text: 'Chờ mốc trước', dueAt: dueTime };
            }
            const diff = dueTime - now;
            if (diff <= 0) {
                return { label, desc, status: 'due', text: 'Đến hạn hôm nay', dueAt: dueTime, isDue: true };
            }
            const hours = Math.ceil(diff / (1000 * 60 * 60));
            if (hours < 24) {
                return { label, desc, status: 'waiting', text: `Còn ${hours} giờ`, dueAt: dueTime };
            }
            const days = Math.ceil(hours / 24);
            return { label, desc, status: 'waiting', text: `Còn ${days} ngày`, dueAt: dueTime };
        }

        const m1 = calcMilestone(item.cycle1Done, due1, true, 'Ngày 1 (+24h)', 'Củng cố trí nhớ ban đầu');
        const m3 = calcMilestone(item.cycle3Done, due3, item.cycle1Done, 'Ngày 3 (+72h)', 'Ngăn sụt giảm trí nhớ');
        const m7 = calcMilestone(item.cycle7Done, due7, item.cycle3Done, 'Ngày 7 (+168h)', 'Khắc sâu trí nhớ dài hạn');

        let overallText = 'Đang trong lộ trình 1-3-7';
        let isAnyDue = m1.isDue || m3.isDue || m7.isDue;
        if (m1.isDue) overallText = 'Đến hạn ôn Ngày 1 (+24h)';
        else if (m3.isDue) overallText = 'Đến hạn ôn Ngày 3 (+72h)';
        else if (m7.isDue) overallText = 'Đến hạn ôn Ngày 7 (+168h)';
        else if (item.cycle7Done) overallText = 'Đã hoàn thành trọn vẹn chu kỳ 1-3-7';

        return {
            lessonId,
            hasStarted: true,
            lastCompletedAt: t0,
            isAnyDue,
            overallText,
            milestones: { cycle1: m1, cycle3: m3, cycle7: m7 }
        };
    }

    // 5. Phát âm thanh chuông melodic thanh thoát (Web Audio API)
        // Global Audio Context Unlocker for Mobile Autoplay Policy (iOS Safari & Android Chrome)
    (function setupAudioAutoplayResilience() {
        function unlockAudio() {
            try {
                const AudioCtx = window.AudioContext || window.webkitAudioContext;
                if (AudioCtx) {
                    if (!window.LociSharedAudioCtx) {
                        window.LociSharedAudioCtx = new AudioCtx();
                    }
                    if (window.LociSharedAudioCtx.state === 'suspended') {
                        window.LociSharedAudioCtx.resume().catch(function() {});
                    }
                }
            } catch (e) {}
        }
        window.addEventListener('touchstart', unlockAudio, { passive: true, once: true });
        window.addEventListener('click', unlockAudio, { passive: true, once: true });
    })();

    // 5. Phát âm thanh chuông melodic thanh thoát (Web Audio API - Tương thích 100% di động)
    function playChime() {
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;
            const ctx = window.LociSharedAudioCtx || new AudioCtx();
            if (ctx.state === 'suspended') {
                ctx.resume().catch(function() {});
            }
            window.LociSharedAudioCtx = ctx;
            
            // Hợp âm Đô trưởng (C5 - E5 - G5) nhẹ nhàng, dễ chịu
            const notes = [523.25, 659.25, 783.99];
            notes.forEach((freq, idx) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);
                
                gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.12);
                gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + idx * 0.12 + 0.04);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.12 + 0.45);
                
                osc.connect(gain);
                gain.connect(ctx.destination);
                
                osc.start(ctx.currentTime + idx * 0.12);
                osc.stop(ctx.currentTime + idx * 0.12 + 0.5);
            });
        } catch (e) {
            console.warn('[Loci Audio] Autoplay deferred until user interaction:', e);
        }
    }

    // Hàm trích xuất gợi nhớ các trạm neo trong phòng quen thuộc phục vụ pop up ôn tập
    function getRoomAnchorCues(lessonId) {
        try {
            const roomNotes = JSON.parse(localStorage.getItem('loci_room_anchor_notes') || '{}');
            const defaultNotes = {
                1: 'Cửa ra vào',
                2: 'Góc giá sách',
                3: 'Bức tranh tường',
                4: 'Bàn học',
                5: 'Cửa sổ đón nắng',
                6: 'Tủ sách Lịch sử',
                7: 'Góc đèn học',
                8: 'Bàn phụ / Ghế',
                9: 'Kệ lưu niệm'
            };
            const lid = lessonId || 'bai_6';
            const cues = [];
            [4, 1, 5].forEach(order => {
                const note = roomNotes[`${lid}_m${order}`] || defaultNotes[order];
                if (note) cues.push(`Trạm ${order} (${note})`);
            });
            return cues.join(' · ');
        } catch (_) {
            return 'Trạm 4 (Bàn học) · Trạm 1 (Cửa ra vào)';
        }
    }

    function showInAppToast(title, message, actionText, actionCallback) {
        // Tuyệt đối không hiển thị popup toast nếu đang nhúng trong iframe (để tránh đè/lặp giao diện)
        if (isEmbedded) return;

        let container = document.getElementById('loci-toast-container');
        if (container && container.children.length >= 1) {
            // Giới hạn tối đa 1 toast tại một thời điểm, tránh spam che khuất màn hình
            return;
        }
        if (!container) {
            container = document.createElement('div');
            container.id = 'loci-toast-container';
            Object.assign(container.style, {
                position: 'fixed',
                top: '20px',
                right: '20px',
                zIndex: '99999',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                maxWidth: '400px',
                width: 'calc(100vw - 40px)',
                pointerEvents: 'none'
            });
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = 'loci-toast-item';
        Object.assign(toast.style, {
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            border: '2px solid #0284c7',
            borderRadius: '16px',
            padding: '16px 18px',
            boxShadow: '0 12px 30px rgba(2, 132, 199, 0.25)',
            pointerEvents: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            fontFamily: "'Outfit', sans-serif",
            animation: 'slideInRight 0.3s ease forwards'
        });

        toast.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <div style="font-weight:800; font-size:14.5px; color:#0284c7; display:flex; align-items:center; gap:6px;">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> ${title}
                </div>
                <button class="toast-close" style="background:none; border:none; color:#94a3b8; font-size:16px; cursor:pointer; padding:2px;">✕</button>
            </div>
            <div style="font-size:13px; color:#334155; line-height:1.45;">
                ${message}
            </div>
            ${actionText ? `
            <div style="display:flex; justify-content:flex-end; margin-top:4px;">
                <button class="toast-action" style="padding:6px 14px; border-radius:99px; background:#0284c7; color:#fff; border:none; font-size:12.5px; font-weight:700; cursor:pointer; transition:all 0.2s;">
                    ${actionText}
                </button>
            </div>` : ''}
        `;

        container.appendChild(toast);

        toast.querySelector('.toast-close').onclick = () => toast.remove();
        if (actionText && actionCallback) {
            toast.querySelector('.toast-action').onclick = () => {
                actionCallback();
                toast.remove();
            };
        }

        // Tự biến mất sau 8 giây
        setTimeout(() => {
            if (toast.parentElement) {
                toast.style.opacity = '0';
                toast.style.transition = 'opacity 0.4s ease';
                setTimeout(() => toast.remove(), 400);
            }
        }, 8000);
    }

    // 7. Kích hoạt thông báo nhắc hẹn
    function triggerWebReminder(title, message, options = {}) {
        // Chỉ trang cấp cao nhất (top window) mới phát chuông và thông báo, iframe không phát
        if (isEmbedded) return;

        const settings = getSettings();
        if (!settings.enabled) return;

        // Âm thanh chuông
        if (settings.sound) {
            playChime();
        }

        // Bổ sung gợi nhớ vị trí neo phòng học quen thuộc Loci
        const cues = getRoomAnchorCues(options.lessonId || 'bai_6');
        const enrichedMessage = message + (cues ? `<br><span style="display:inline-block; margin-top:6px; font-size:11.5px; color:#0284c7; font-weight:700; background:#f0f9ff; border:1px solid #bae6fd; border-radius:8px; padding:3px 8px;">📍 Gợi nhớ Loci: ${cues}</span>` : '');

        // Web Notification (nếu đã cấp quyền và là top window)
        if (window.Notification && Notification.permission === 'granted') {
            try {
                new Notification(title, {
                    body: message.replace(/<[^>]*>/g, '') + (cues ? ` (Neo Loci: ${cues})` : ''),
                    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%230284c7" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>'
                });
            } catch (e) {}
        }

        // In-App Toast
        showInAppToast(title, enrichedMessage, options.actionText || 'Ôn tập ngay', options.onAction || (() => {
            if (typeof window.switchPortalTab === 'function') {
                window.switchPortalTab('review');
                const targetSrc = `review.html?embed=1` + (options.lessonId ? `&lesson=${options.lessonId}` : '');
                if (window.tabUrls) {
                    window.tabUrls.review = targetSrc;
                }
                const appFrame = document.getElementById('app-frame');
                if (appFrame && options.lessonId) {
                    appFrame.src = `review.html?embed=1&lesson=${options.lessonId}`;
                if (appFrame && appFrame.src !== new URL(targetSrc, window.location.href).href) {
                    appFrame.src = targetSrc;
                }
                window.switchPortalTab('review');
            } else if (options.lessonId && typeof window.selectLessonTab === 'function') {
                window.selectLessonTab(options.lessonId);
            } else if (options.lessonId && window.location.pathname.includes('review.html')) {
                window.location.search = `?lesson=${options.lessonId}`;
            } else if (window.location.pathname.includes('review.html')) {
                if (options.lessonId && typeof window.filterLesson === 'function') {
                    window.filterLesson(options.lessonId);
                }
            } else {
                window.location.href = 'review.html' + (options.lessonId ? `?lesson=${options.lessonId}` : '');
            }
        }));
    }

    // 8. Trình quét kiểm tra hẹn giờ nền (Chỉ chạy ở trang cha, không chạy trong iframe)
    function checkReminders() {
        if (isEmbedded) return;

        // TUYỆT ĐỐI CHẶN POPUP KHI CHƯA ĐĂNG NHẬP HOẶC TÀI KHOẢN CHƯA CÓ TIẾN ĐỘ HỌC THỰC TẾ
        try {
            const isAuth = (typeof window !== 'undefined' && typeof window.isUserLoggedIn === 'function' && window.isUserLoggedIn());
            const hasAuthSession = localStorage.getItem('loci_auth_session') === 'active';
            if (!isAuth || !hasAuthSession) return;

            const user = (window.LociAccountManager && typeof window.LociAccountManager.getUser === 'function') 
                ? window.LociAccountManager.getUser() 
                : (window._lociLocalUser || JSON.parse(localStorage.getItem('loci_user_profile') || 'null'));
            
            if (!user || user.isGuest || user.username === 'Khách') return;

            // KIỂM TRA TIẾN ĐỘ THỰC TẾ: NẾU CHƯA HỌC BÀI NÀO -> CHẶN 100% POPUP
            let hasStudied = false;
            if (window.LociProgression && typeof window.LociProgression.hasUserAnyStudyActivity === 'function') {
                hasStudied = window.LociProgression.hasUserAnyStudyActivity();
            }
            if (!hasStudied) {
                try {
                    const prog = JSON.parse(localStorage.getItem('loci_study_progression') || '{}');
                    hasStudied = Object.values(prog).some(p => (p.stationsVisited && p.stationsVisited.length > 0) || p.flashcardsReviewed || (p.quizScore && p.quizScore > 0));
                } catch (_) {}
            }
            if (!hasStudied) {
                return; // Người học chưa bắt đầu học bài nào -> TUYỆT ĐỐI KHÔNG HIỆN POPUP
            }
        } catch (_) {
            return;
        }

        const settings = getSettings();
        if (!settings.enabled) return;

        // Nếu người dùng đang xem trang ôn tập (review tab hoặc review.html) thì không hiện popup làm phiền
        if (typeof document !== 'undefined') {
            const activeNav = document.querySelector('.sidebar .nav-item.active');
            if (activeNav && activeNav.dataset.tab === 'review') return;
            if (window.location.pathname.includes('review.html')) return;
        }

        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const currentTimeStr = `${hours}:${minutes}`;
        const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

        // 1. Kiểm tra giờ hẹn hàng ngày (CHỈ NHẮC KHI ĐÃ CÓ BÀI BẮT ĐẦU HỌC)
        if (currentTimeStr === settings.time && settings.lastNotifiedDate !== todayStr) {
            const prog = (window.LociProgression ? window.LociProgression.getProgression() : JSON.parse(localStorage.getItem('loci_study_progression') || '{}'));
            const hasStartedLesson = ['bai_6', 'bai_7', 'bai_8'].some(lid => {
                const stat = getLessonCycleStatus(lid);
                const p = prog[lid] || {};
                const hasAct = (p.stationsVisited && p.stationsVisited.length > 0) || p.flashcardsReviewed || (p.quizScore && p.quizScore > 0);
                return stat && stat.hasStarted && hasAct;
            });
            if (!hasStartedLesson) return;

            settings.lastNotifiedDate = todayStr;
            saveSettings(settings);

            triggerWebReminder(
                'Loci Edu - Đến giờ ôn tập hôm nay',
                `Đã đến giờ nhắc học (${settings.time}) bạn đã hẹn. Hãy dành 5 phút củng cố trí nhớ không gian nhé!`,
                { actionText: 'Vào ôn ngay', lessonId: 'bai_6' }
            );
            return;
        }

        // 2. Kiểm tra chu kỳ 1-3-7 thông minh (CHỈ HIỆN BÀI ĐÃ HỌC, BÀI CHƯA HỌC TUYỆT ĐỐI KHÔNG HIỆN)
        if (settings.notify137) {
            const lessons = ['bai_6', 'bai_7', 'bai_8'];
            const lessonNames = {
                bai_6: 'Bài 6 (CM tháng Tám 1945)',
                bai_7: 'Bài 7 (Kháng chiến chống Pháp)',
                bai_8: 'Bài 8 (Kháng chiến chống Mỹ)'
            };

            if (!settings.notifiedLessons) settings.notifiedLessons = {};
            if (!settings.notifiedLessons[todayStr]) settings.notifiedLessons[todayStr] = {};

            const prog = (window.LociProgression ? window.LociProgression.getProgression() : JSON.parse(localStorage.getItem('loci_study_progression') || '{}'));
            const dueLessons = [];
            for (const lid of lessons) {
                const stat = getLessonCycleStatus(lid);
                const p = prog[lid] || {};
                const hasActualActivity = (p.stationsVisited && p.stationsVisited.length > 0) || p.flashcardsReviewed || (p.quizScore && p.quizScore > 0);

                // CHỈ TÍNH VÀ HIỆN THÔNG BÁO CHO BÀI ĐÃ HỌC (hasStarted === true && hasActualActivity)
                if (stat && stat.hasStarted && hasActualActivity && stat.isAnyDue) {
                    if (!settings.notifiedLessons[todayStr][lid]) {
                        dueLessons.push({ id: lid, name: lessonNames[lid], stat });
                    }
                }
            }

            if (dueLessons.length > 0) {
                // Đánh dấu tất cả bài này đã được nhắc hôm nay
                dueLessons.forEach(d => {
                    settings.notifiedLessons[todayStr][d.id] = Date.now();
                });
                saveSettings(settings);

                console.log('📈 [Loci 1-3-7] Đã kiểm tra chu kỳ ngày hôm nay:', dueLessons.map(d => d.id));
            }
        }
    }

    // Khởi động vòng lặp kiểm tra (chỉ kích hoạt ở cửa sổ chính, không kích hoạt trong iframe)
    if (!isEmbedded) {
        setInterval(checkReminders, 60000);
        setTimeout(checkReminders, 2500);
    }

    // 9. RENDER GIAO DIỆN TIMELINE 1-3-7
    function renderTimelineWidget(lessonId) {
        const stat = getLessonCycleStatus(lessonId);
        const m = stat.milestones;

        return `
        <div class="cycle-137-widget">
            <div class="cycle-137-head">
                <div class="cycle-137-title">
                    Chu kỳ Ôn tập Ngắt quãng 1-3-7 (Ebbinghaus)
                </div>
                <div class="cycle-137-status-badge ${stat.isAnyDue ? 'is-due' : ''}">
                    ${stat.overallText}
                </div>
            </div>

            <div class="cycle-137-steps">
                <!-- MỐC 1: NGÀY 1 (+24H) -->
                <div class="cycle-step-card ${m.cycle1.status}">
                    <div class="step-num-pill">Mốc 1</div>
                    <div class="step-label">${m.cycle1.label}</div>
                    <div class="step-desc">${m.cycle1.desc}</div>
                    <div class="step-state">${m.cycle1.text}</div>
                </div>

                <div class="cycle-arrow">➔</div>

                <!-- MỐC 2: NGÀY 3 (+72H) -->
                <div class="cycle-step-card ${m.cycle3.status}">
                    <div class="step-num-pill">Mốc 2</div>
                    <div class="step-label">${m.cycle3.label}</div>
                    <div class="step-desc">${m.cycle3.desc}</div>
                    <div class="step-state">${m.cycle3.text}</div>
                </div>

                <div class="cycle-arrow">➔</div>

                <!-- MỐC 3: NGÀY 7 (+168H) -->
                <div class="cycle-step-card ${m.cycle7.status}">
                    <div class="step-num-pill">Mốc 3</div>
                    <div class="step-label">${m.cycle7.label}</div>
                    <div class="step-desc">${m.cycle7.desc}</div>
                    <div class="step-state">${m.cycle7.text}</div>
                </div>
            </div>
        </div>
        `;
    }

    // 10. MODAL CÀI ĐẶT NHẮC HẸN TRÊN WEB
    function openReminderModal() {
        const existing = document.getElementById('loci-reminder-modal');
        if (existing) existing.remove();

        // Đảm bảo CSS Kính mờ iOS 18 cho Modal
        if (!document.getElementById('loci-reminder-glass-styles')) {
            const st = document.createElement('style');
            st.id = 'loci-reminder-glass-styles';
            st.textContent = `
                .loci-reminder-overlay {
                    position: fixed !important;
                    top: 0 !important; left: 0 !important;
                    width: 100vw !important; height: 100vh !important;
                    background: rgba(15, 23, 42, 0.45) !important;
                    backdrop-filter: blur(16px) !important;
                    -webkit-backdrop-filter: blur(16px) !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    z-index: 100050 !important;
                    padding: 20px !important;
                    box-sizing: border-box !important;
                    animation: lociRemFadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards !important;
                }
                @keyframes lociRemFadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .loci-reminder-glass-box {
                    background: rgba(255, 255, 255, 0.78) !important;
                    backdrop-filter: blur(32px) saturate(190%) contrast(102%) !important;
                    -webkit-backdrop-filter: blur(32px) saturate(190%) contrast(102%) !important;
                    border: 1px solid rgba(255, 255, 255, 0.65) !important;
                    border-radius: 28px !important;
                    box-shadow: 
                        0 25px 60px -15px rgba(0, 0, 0, 0.18),
                        0 4px 16px rgba(0, 0, 0, 0.04),
                        inset 0 1.5px 1.5px rgba(255, 255, 255, 0.95),
                        inset 0 -1px 1px rgba(0, 0, 0, 0.03) !important;
                    max-width: 860px !important;
                    width: 94% !important;
                    width: 100% !important;
                    padding: 24px 26px !important;
                    box-sizing: border-box !important;
                    color: #0f172a !important;
                    animation: lociRemSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards !important;
                    font-family: 'Outfit', 'Plus Jakarta Sans', system-ui, sans-serif !important;
                }
                body.dark-mode .loci-reminder-glass-box {
                    background: rgba(22, 30, 46, 0.82) !important;
                    border-color: rgba(255, 255, 255, 0.16) !important;
                    box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.65), inset 0 1px 1px rgba(255, 255, 255, 0.2) !important;
                    color: #f8fafc !important;
                }
                @keyframes lociRemSlideUp {
                    from { opacity: 0; transform: translateY(22px) scale(0.96); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                
                .loci-rem-grid {
                    display: grid !important;
                    grid-template-columns: 1.12fr 0.98fr !important;
                    gap: 16px !important;
                    margin-bottom: 8px !important;
                }
                @media (max-width: 720px) {
                    .loci-rem-grid {
                        grid-template-columns: 1fr !important;
                    }
                }
  
                .loci-rem-row-card {
                    background: rgba(255, 255, 255, 0.6) !important;
                    backdrop-filter: blur(12px) !important;
                    border: 1px solid rgba(255, 255, 255, 0.55) !important;
                    border-radius: 18px !important;
                    padding: 13px 16px !important;
                    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.02), inset 0 1px 1px rgba(255, 255, 255, 0.8) !important;
                }
                body.dark-mode .loci-rem-row-card {
                    background: rgba(30, 41, 59, 0.65) !important;
                    border-color: rgba(255, 255, 255, 0.12) !important;
                    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25) !important;
                }
            `;
            document.head.appendChild(st);
        }

        const settings = getSettings();
        const hasNotiPermission = window.Notification && Notification.permission === 'granted';

        const lessons = [
            { id: 'bai_6', title: 'Bài 6: CM tháng Tám 1945' },
            { id: 'bai_7', title: 'Bài 7: Kháng chiến chống Pháp' },
            { id: 'bai_8', title: 'Bài 8: Kháng chiến chống Mỹ' }
        ];

        const modal = document.createElement('div');
        modal.id = 'loci-reminder-modal';
        modal.className = 'loci-reminder-overlay';
        modal.innerHTML = `
            <div class="loci-reminder-glass-box">
                <!-- HEADER (KHÔNG EMOJI - ICON SVG APPLE) -->
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; padding-bottom: 12px; border-bottom: 1px solid rgba(0,0,0,0.06);">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <div style="width: 36px; height: 36px; border-radius: 10px; background: rgba(2, 132, 199, 0.12); border: 1px solid rgba(2, 132, 199, 0.25); display: flex; align-items: center; justify-content: center; color: #0284c7;">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                        </div>
                        <div>
                            <h3 style="font-size: 17px; font-weight: 800; color: inherit; margin: 0; letter-spacing: -0.3px;">Đặt Nhắc Hẹn Ôn Tập Loci</h3>
                            <div style="font-size: 12px; color: #64748b;">Hệ thống tự động phát chuông và nhắc bạn học đúng giờ</div>
                        </div>
                    </div>
                    <button id="modal-close-btn" style="background: rgba(0,0,0,0.05); border: 1px solid rgba(0,0,0,0.08); width: 30px; height: 30px; border-radius: 50%; display: grid; place-items: center; font-size: 14px; color: #64748b; cursor: pointer; transition: all 0.2s;">✕</button>
                </div>

                <div class="loci-rem-grid">
                    <!-- CỘT TRÁI (THIẾT LẬP THỜI GIAN & THÔNG BÁO) -->
                    <div style="display: flex; flex-direction: column; gap: 12px;">
                        <!-- BẬT/TẮT NHẮC HẸN -->
                        <div class="loci-rem-row-card" style="display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <div style="font-size: 13.5px; font-weight: 700; color: inherit;">Bật nhắc hẹn trên Web</div>
                                <div style="font-size: 11.5px; color: #64748b;">Nhận thông báo khi tab mở hoặc chạy nền</div>
                            </div>
                            <input type="checkbox" id="cfg-reminder-enabled" ${settings.enabled ? 'checked' : ''} style="width: 19px; height: 19px; accent-color: #0284c7; cursor: pointer;">
                        </div>

                        <!-- GIỜ NHẮC HÀNG NGÀY -->
                        <div class="loci-rem-row-card">
                            <label for="cfg-reminder-time" style="display: block; font-size: 13px; font-weight: 700; color: inherit; margin-bottom: 6px;">
                                Giờ nhắc học tập mỗi ngày:
                            </label>
                            <div style="display: flex; align-items: center; gap: 12px;">
                                <input type="time" id="cfg-reminder-time" value="${settings.time}" style="font-size: 17px; font-weight: 800; padding: 7px 12px; border-radius: 12px; border: 1.5px solid rgba(2, 132, 199, 0.35); outline: none; font-family: inherit; color: #0284c7; background: rgba(255,255,255,0.7);">
                                <span style="font-size: 12px; color: #64748b;">Mặc định 20:00 tối</span>
                            </div>
                        </div>

                        <!-- TÙY CHỌN 1-3-7 VÀ ÂM THANH -->
                        <div style="display: flex; flex-direction: column; gap: 8px; padding: 2px 4px;">
                            <label style="display: flex; align-items: center; gap: 10px; font-size: 13px; font-weight: 600; color: inherit; cursor: pointer;">
                                <input type="checkbox" id="cfg-reminder-137" ${settings.notify137 ? 'checked' : ''} style="accent-color: #0284c7; width: 16px; height: 16px;">
                                <span>Tự động nhắc khi có bài đến hạn chu kỳ 1-3-7</span>
                            </label>
                            <label style="display: flex; align-items: center; gap: 10px; font-size: 13px; font-weight: 600; color: inherit; cursor: pointer;">
                                <input type="checkbox" id="cfg-reminder-sound" ${settings.sound ? 'checked' : ''} style="accent-color: #0284c7; width: 16px; height: 16px;">
                                <span>Phát chuông âm thanh nhẹ nhàng khi nhắc</span>
                            </label>
                        </div>

                        <!-- NÚT THỬ THÔNG BÁO VÀ CHUÔNG NGAY -->
                        <button id="btn-test-notification" style="width: 100%; padding: 10px 14px; border-radius: 14px; background: rgba(2, 132, 199, 0.12); color: #0284c7; border: 1px solid rgba(2, 132, 199, 0.28); font-size: 13px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.2s;">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M11 5L6 9H2v6h4l5 4V5z"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
                            Thử chuông & thông báo ngay
                        </button>
                    </div>

                    <!-- CỘT PHẢI (LỘ TRÌNH 1-3-7 & NGUYÊN LÝ EBBINGHAUS) -->
                    <div style="display: flex; flex-direction: column; gap: 12px;">
                        <div class="loci-rem-row-card" style="padding: 13px 15px !important; flex: 1; display: flex; flex-direction: column;">
                            <div style="font-size: 11.5px; font-weight: 800; color: #64748b; text-transform: uppercase; margin-bottom: 8px; letter-spacing: 0.5px; display: flex; justify-content: space-between; align-items: center;">
                                <span>Tình trạng chu kỳ 1-3-7 hiện tại:</span>
                                <span style="font-size: 10px; color: #0284c7; font-weight: 700; text-transform: none;">Khoa học trí nhớ</span>
                            </div>
                            <div style="display: flex; flex-direction: column; gap: 6px; margin-bottom: 12px;">
                                ${lessons.map(l => {
                                    const st = getLessonCycleStatus(l.id);
                                    const cleanOverall = (st.overallText || '').replace(/[⚡🎉📈📋🔔⏰]/g, '').trim();
                                    return `
                                    <div style="display: flex; justify-content: space-between; align-items: center; font-size: 12px; background: rgba(255,255,255,0.7); padding: 7px 10px; border-radius: 10px; border: 1px solid rgba(0,0,0,0.06);">
                                        <span style="font-weight: 700; color: inherit;">${l.title}</span>
                                        <span style="font-weight: 700; padding: 2px 8px; border-radius: 6px; font-size: 11px; background: ${st.isAnyDue ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)'}; color: ${st.isAnyDue ? '#dc2626' : '#059669'}; border: 1px solid ${st.isAnyDue ? 'rgba(239, 68, 68, 0.25)' : 'rgba(16, 185, 129, 0.25)'};">${cleanOverall}</span>
                                    </div>`;
                                }).join('')}
                            </div>
                            <div style="background: rgba(2, 132, 199, 0.06); border: 1px solid rgba(2, 132, 199, 0.16); border-radius: 12px; padding: 10px 12px; font-size: 11.5px; color: #0369a1; line-height: 1.5; margin-top: auto;">
                                <b>Thuật toán Ebbinghaus:</b> Ôn lại sau <b>24h</b>, <b>3 ngày</b> và <b>7 ngày</b> giúp khắc phục 80% độ dốc lãng quên tự nhiên, neo giữ kiến thức Lịch sử vào trí nhớ dài hạn.
                            </div>
                        </div>
                    </div>
                </div>

                <!-- HÀNG DƯỚI (NÚT LƯU VÀ ĐÓNG NGANG) -->
                <div style="display: flex; justify-content: flex-end; gap: 12px; padding-top: 14px; border-top: 1px solid rgba(0,0,0,0.06); margin-top: 6px;">
                    <button id="btn-cancel-settings" style="padding: 10px 24px; border-radius: 14px; background: rgba(0,0,0,0.06); color: inherit; border: 1px solid rgba(0,0,0,0.08); font-size: 13px; font-weight: 600; cursor: pointer;">
                        Đóng
                    </button>
                    <button id="btn-save-settings" style="padding: 10px 28px; border-radius: 14px; background: linear-gradient(135deg, #0284c7, #0369a1); color: #ffffff; border: none; font-size: 13.5px; font-weight: 700; cursor: pointer; box-shadow: 0 4px 14px rgba(2, 132, 199, 0.35); transition: transform 0.2s;">
                        Lưu cài đặt nhắc hẹn
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Đóng modal
        const closeModal = () => modal.remove();
        document.getElementById('modal-close-btn').onclick = closeModal;
        document.getElementById('btn-cancel-settings').onclick = closeModal;

        // Thử thông báo
        document.getElementById('btn-test-notification').onclick = async () => {
            if (window.Notification && Notification.permission !== 'granted') {
                try {
                    await Notification.requestPermission();
                } catch (e) {}
            }
            playChime();
            triggerWebReminder(
                'Loci Edu - Thử nghiệm nhắc hẹn thành công!',
                `Web đã ghi nhận giờ nhắc ${document.getElementById('cfg-reminder-time').value} và chu kỳ 1-3-7. Thông báo và âm thanh hoạt động chuẩn xác!`,
                { actionText: 'Đã hiểu' }
            );
        };

        // Lưu cài đặt
        document.getElementById('btn-save-settings').onclick = async () => {
            const enabled = document.getElementById('cfg-reminder-enabled').checked;
            const time = document.getElementById('cfg-reminder-time').value || '20:00';
            const notify137 = document.getElementById('cfg-reminder-137').checked;
            const sound = document.getElementById('cfg-reminder-sound').checked;

            if (enabled && window.Notification && Notification.permission !== 'granted') {
                try {
                    await Notification.requestPermission();
                } catch (e) {}
            }

            saveSettings({ enabled, time, notify137, sound });
            
            // Cập nhật text trên pill header (nếu có)
            const pillTime = document.getElementById('header-reminder-time');
            if (pillTime) pillTime.textContent = enabled ? time : 'Đang tắt';

            closeModal();
            showInAppToast('Đã lưu thành công!', `Web sẽ tự động nhắc bạn lúc ${time} và khi đến mốc 1-3-7.`, 'Đóng');
        };
    }

    // Xuất khẩu đối tượng
    window.LociReminder137 = {
        getCycleData,
        recordLessonCompleted,
        getLessonCycleStatus,
        getSettings,
        saveSettings,
        playChime,
        triggerWebReminder,
        checkReminders,
        renderTimelineWidget,
        openReminderModal
    };

})(window);
