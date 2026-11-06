/**
 * LOCI COMPANION PET SYSTEM (LINH THÚ TRI THỨC)
 * Dự án Cung Điện Ký Ức LOCI EDU (NCKH)
 * 
 * - Đồ họa Vector SVG hoạt họa chân thực (Breathing, Idle, Feed, Evolve), hoàn toàn KHÔNG DÙNG EMOJI.
 * - Chọn Linh thú lần đầu (Phượng Hoàng Lửa, Kỳ Lân Hoàng Quang, Bạch Hổ Thần Tốc).
 * - Tiến trình nuôi dưỡng: Cấp độ, Điểm no, Hạnh phúc, Năng lượng tri thức kết nối với XP học tập.
 * - Chế độ Nuôi Pet Cùng Bạn (Collaborative Duo / Classroom Pet Room) qua mã phòng nhóm.
 * - Tích hợp âm thanh thông báo chuẩn "tính tinh" (ting_ting.mp3).
 */

(function() {
    'use strict';

    const STORAGE_KEY = 'loci_companion_pet_data_v1';
    const AUDIO_PATH = 'assets/audio/ting_ting.mp3';

    // Âm thanh thông báo "tính tinh" chuẩn
    window.playTingTing = function() {
        try {
            const audio = new Audio(AUDIO_PATH);
            audio.volume = 0.8;
            audio.play().catch(() => {});
        } catch (_) {}
    };

    // Danh mục 3 Linh thú tri thức thần thoại được vẽ vector chuẩn xác
    const PET_SPECIES = {
        phoenix: {
            id: 'phoenix',
            name: 'Phượng Hoàng Lửa',
            subName: 'Ignis Phoenix · Linh Thú Ý Chí',
            desc: 'Biểu trưng cho ý chí kiên định và sự tái sinh của tri thức lịch sử. Tăng 20% khả năng truy xuất mốc sự kiện.',
            color: '#f97316',
            colorGrad: 'linear-gradient(135deg, #ea580c, #f59e0b)',
            badge: 'HỎA HỆ · TĂNG TRUY XUẤT',
            svgBody: (level) => `
                <g class="pet-phoenix-root">
                    <defs>
                        <linearGradient id="phxGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stop-color="#ea580c" />
                            <stop offset="50%" stop-color="#f97316" />
                            <stop offset="100%" stop-color="#fbbf24" />
                        </linearGradient>
                        <radialGradient id="phxAura" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stop-color="rgba(249, 115, 22, 0.45)" />
                            <stop offset="100%" stop-color="rgba(249, 115, 22, 0)" />
                        </radialGradient>
                    </defs>
                    <circle cx="100" cy="100" r="85" fill="url(#phxAura)" class="pet-glow-pulse" />
                    <!-- Đuôi lửa thần thoại -->
                    <path d="M100 130 C85 160, 60 185, 45 195 C65 175, 80 155, 95 135" fill="none" stroke="url(#phxGrad)" stroke-width="4.5" stroke-linecap="round" class="phx-tail-l" />
                    <path d="M100 130 C100 165, 100 195, 100 205 C102 180, 103 155, 100 135" fill="none" stroke="url(#phxGrad)" stroke-width="5" stroke-linecap="round" class="phx-tail-m" />
                    <path d="M100 130 C115 160, 140 185, 155 195 C135 175, 120 155, 105 135" fill="none" stroke="url(#phxGrad)" stroke-width="4.5" stroke-linecap="round" class="phx-tail-r" />
                    <!-- Đôi cánh hoàng kim vỗ nhịp -->
                    <g class="phx-wings">
                        <path d="M75 105 C40 70, 20 85, 12 110 C28 102, 50 110, 70 120 Z" fill="url(#phxGrad)" />
                        <path d="M125 105 C160 70, 180 85, 188 110 C172 102, 150 110, 130 120 Z" fill="url(#phxGrad)" />
                    </g>
                    <!-- Thân phượng hoàng -->
                    <ellipse cx="100" cy="112" rx="20" ry="28" fill="url(#phxGrad)" />
                    <!-- Bụng sáng hào quang -->
                    <ellipse cx="100" cy="116" rx="12" ry="18" fill="#fef08a" opacity="0.9" />
                    <!-- Đầu & Mào lửa -->
                    <circle cx="100" cy="74" r="16" fill="url(#phxGrad)" />
                    <path d="M100 60 Q106 42 100 34 Q94 48 98 60" fill="#fef08a" />
                    <path d="M103 62 Q115 48 114 40 Q105 52 102 62" fill="#f97316" />
                    <!-- Mỏ vàng -->
                    <polygon points="100,74 92,79 100,84" fill="#fbbf24" stroke="#d97706" stroke-width="1" />
                    <!-- Mắt ngọc -->
                    <circle cx="96" cy="71" r="2.8" fill="#0f172a" />
                    <circle cx="95" cy="70" r="1" fill="#ffffff" />
                    <!-- Vương miện khi đạt Cấp 3 -->
                    ${level >= 3 ? `<polygon points="90,56 95,44 100,52 105,44 110,56" fill="#fbbf24" stroke="#b45309" stroke-width="1.2" />` : ''}
                </g>
            `
        },
        kirin: {
            id: 'kirin',
            name: 'Kỳ Lân Hoàng Quang',
            subName: 'Aureus Kirin · Linh Thú Trí Tuệ',
            desc: 'Linh thú thần thánh bảo hộ Cung Điện Trí Thức. Nhân đôi điểm tập trung và mở rộng không gian 3D Loci.',
            color: '#0284c7',
            colorGrad: 'linear-gradient(135deg, #0284c7, #06b6d4)',
            badge: 'QUANG HỆ · NHÂN ĐÔI TẬP TRUNG',
            svgBody: (level) => `
                <g class="pet-kirin-root">
                    <defs>
                        <linearGradient id="kirinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stop-color="#0284c7" />
                            <stop offset="50%" stop-color="#38bdf8" />
                            <stop offset="100%" stop-color="#a5f3fc" />
                        </linearGradient>
                        <radialGradient id="kirinAura" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stop-color="rgba(56, 189, 248, 0.45)" />
                            <stop offset="100%" stop-color="rgba(56, 189, 248, 0)" />
                        </radialGradient>
                    </defs>
                    <circle cx="100" cy="100" r="85" fill="url(#kirinAura)" class="pet-glow-pulse" />
                    <!-- Thân Kỳ Lân đĩnh đạc -->
                    <ellipse cx="100" cy="118" rx="30" ry="24" fill="url(#kirinGrad)" />
                    <!-- Bờm mây thần thoại -->
                    <path d="M78 88 C65 72, 60 95, 72 105 C60 112, 68 132, 85 125" fill="#e0f2fe" opacity="0.9" />
                    <path d="M122 88 C135 72, 140 95, 128 105 C140 112, 132 132, 115 125" fill="#e0f2fe" opacity="0.9" />
                    <!-- Chân Kỳ Lân lướt mây -->
                    <rect x="80" y="136" width="10" height="24" rx="5" fill="#0284c7" />
                    <rect x="110" y="136" width="10" height="24" rx="5" fill="#0284c7" />
                    <ellipse cx="85" cy="160" rx="7" ry="3.5" fill="#38bdf8" />
                    <ellipse cx="115" cy="160" rx="7" ry="3.5" fill="#38bdf8" />
                    <!-- Đầu Kỳ Lân -->
                    <circle cx="100" cy="80" r="22" fill="url(#kirinGrad)" />
                    <!-- Mũi & miệng -->
                    <ellipse cx="100" cy="88" rx="10" ry="7" fill="#e0f2fe" />
                    <circle cx="96" cy="87" r="1.5" fill="#0369a1" />
                    <circle cx="104" cy="87" r="1.5" fill="#0369a1" />
                    <!-- Đôi mắt sáng thông thái -->
                    <ellipse cx="91" cy="76" rx="3.5" ry="5" fill="#0f172a" />
                    <circle cx="90" cy="74" r="1.5" fill="#ffffff" />
                    <ellipse cx="109" cy="76" rx="3.5" ry="5" fill="#0f172a" />
                    <circle cx="108" cy="74" r="1.5" fill="#ffffff" />
                    <!-- Sừng Kỳ Lân ngọc bích -->
                    <polygon points="100,42 96,62 104,62" fill="#fbbf24" stroke="#d97706" stroke-width="1.2" class="kirin-horn-glow" />
                    ${level >= 3 ? `<circle cx="100" cy="38" r="5" fill="#fef08a" class="pet-star-pulse" />` : ''}
                </g>
            `
        },
        tiger: {
            id: 'tiger',
            name: 'Bạch Hổ Thần Tốc',
            subName: 'Solar Tiger · Linh Thú Phản Xạ',
            desc: 'Linh thú biểu trưng cho phản xạ nhạy bén và tốc độ ghi nhớ đỉnh cao trong mọi kỳ thi trắc nghiệm.',
            color: '#4f46e5',
            colorGrad: 'linear-gradient(135deg, #4338ca, #6366f1)',
            badge: 'LÔI HỆ · TĂNG PHẢN XẠ THI CỬ',
            svgBody: (level) => `
                <g class="pet-tiger-root">
                    <defs>
                        <linearGradient id="tigerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stop-color="#4f46e5" />
                            <stop offset="60%" stop-color="#818cf8" />
                            <stop offset="100%" stop-color="#e0e7ff" />
                        </linearGradient>
                        <radialGradient id="tigerAura" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stop-color="rgba(99, 102, 241, 0.45)" />
                            <stop offset="100%" stop-color="rgba(99, 102, 241, 0)" />
                        </radialGradient>
                    </defs>
                    <circle cx="100" cy="100" r="85" fill="url(#tigerAura)" class="pet-glow-pulse" />
                    <!-- Thân hổ trắng dũng mãnh -->
                    <ellipse cx="100" cy="122" rx="32" ry="24" fill="url(#tigerGrad)" />
                    <!-- Vằn lôi điện -->
                    <path d="M85 110 L92 118 L84 126" stroke="#312e81" stroke-width="2.5" fill="none" stroke-linecap="round" />
                    <path d="M115 110 L108 118 L116 126" stroke="#312e81" stroke-width="2.5" fill="none" stroke-linecap="round" />
                    <!-- Tai hổ -->
                    <polygon points="76,68 82,48 94,62" fill="#4338ca" />
                    <polygon points="80,64 84,52 90,62" fill="#fbcfe8" />
                    <polygon points="124,68 118,48 106,62" fill="#4338ca" />
                    <polygon points="120,64 116,52 110,62" fill="#fbcfe8" />
                    <!-- Đầu hổ -->
                    <circle cx="100" cy="82" r="24" fill="url(#tigerGrad)" />
                    <!-- Vết trán chữ Vương (王) -->
                    <path d="M93 68 H107 M100 68 V76 M95 72 H105 M92 76 H108" stroke="#fbbf24" stroke-width="1.8" stroke-linecap="round" />
                    <!-- Mõm -->
                    <ellipse cx="100" cy="91" rx="11" ry="8" fill="#ffffff" />
                    <polygon points="100,89 96,86 104,86" fill="#ec4899" />
                    <!-- Đôi mắt hổ tinh anh -->
                    <ellipse cx="88" cy="78" rx="3.5" ry="4.5" fill="#0f172a" />
                    <circle cx="87" cy="76" r="1.5" fill="#ffffff" />
                    <ellipse cx="112" cy="78" rx="3.5" ry="4.5" fill="#0f172a" />
                    <circle cx="111" cy="76" r="1.5" fill="#ffffff" />
                    <!-- Chân & vuốt thần tốc -->
                    <rect x="76" y="138" width="12" height="22" rx="6" fill="#3730a3" />
                    <rect x="112" y="138" width="12" height="22" rx="6" fill="#3730a3" />
                    ${level >= 3 ? `<circle cx="100" cy="122" r="34" fill="none" stroke="#fbbf24" stroke-width="2" stroke-dasharray="6,4" class="pet-spin-halo" />` : ''}
                </g>
            `
        }
    };

    class LociPetManager {
        constructor() {
            this.petData = this.loadData();
            this.init();
        }

        loadData() {
            try {
                const raw = localStorage.getItem(STORAGE_KEY);
                if (raw) return JSON.parse(raw);
            } catch (_) {}
            return null; // Chưa có pet -> mở modal chọn
        }

        saveData() {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(this.petData));
            } catch (_) {}
            this.renderUI();
        }

        createNewPet(speciesId, nickname, roomCode = null) {
            const species = PET_SPECIES[speciesId] || PET_SPECIES.phoenix;
            this.petData = {
                speciesId: species.id,
                name: nickname || species.name,
                level: 1,
                exp: 25,
                maxExp: 100,
                fullness: 80, // Điểm no
                happiness: 85, // Hạnh phúc
                roomCode: roomCode || ('LOCI-PET-' + Math.floor(1000 + Math.random() * 9000)),
                lastFed: Date.now(),
                coCareMembers: ['Bạn (Trưởng nhóm)'],
                history: [
                    { time: new Date().toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'}), act: 'Nhận nuôi thành công Linh thú!' }
                ]
            };
            this.saveData();
            window.playTingTing();
        }

        feed() {
            if (!this.petData) return;
            this.petData.fullness = Math.min(100, this.petData.fullness + 15);
            this.addExp(10, 'Được cho ăn Năng lượng Tri thức');
            window.playTingTing();
            this.showFloatingEffect('🍖 +15 No');
        }

        play() {
            if (!this.petData) return;
            this.petData.happiness = Math.min(100, this.petData.happiness + 20);
            this.addExp(15, 'Cùng chơi đùa và kích hoạt tư duy');
            window.playTingTing();
            this.showFloatingEffect('💖 +20 Hạnh phúc');
        }

        trainWithStudy(studyExp) {
            if (!this.petData) return;
            this.addExp(studyExp, 'Tích lũy XP qua phiên học Loci');
            this.petData.happiness = Math.min(100, this.petData.happiness + 10);
            this.saveData();
        }

        addExp(amount, reason = '') {
            this.petData.exp += amount;
            if (reason) {
                this.petData.history.unshift({
                    time: new Date().toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'}),
                    act: `${reason} (+${amount} XP)`
                });
                if (this.petData.history.length > 8) this.petData.history.pop();
            }

            // Thăng cấp
            while (this.petData.exp >= this.petData.maxExp) {
                this.petData.exp -= this.petData.maxExp;
                this.petData.level += 1;
                this.petData.maxExp = Math.round(this.petData.maxExp * 1.5);
                window.playTingTing();
                this.showFloatingEffect(`⭐ THĂNG CẤP ${this.petData.level}!`);
            }
            this.saveData();
        }

        showFloatingEffect(text) {
            const el = document.getElementById('pet-action-toast');
            if (el) {
                el.textContent = text;
                el.style.opacity = '1';
                el.style.transform = 'translateY(-10px)';
                setTimeout(() => {
                    el.style.opacity = '0';
                    el.style.transform = 'translateY(0)';
                }, 1400);
            }
        }

        init() {
            this.injectStyles();
            this.renderUI();
            this.bindGlobalTriggers();
        }

        injectStyles() {
            if (document.getElementById('loci-pet-styles')) return;
            const style = document.createElement('style');
            style.id = 'loci-pet-styles';
            style.textContent = `
                @keyframes petFloat {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-8px) rotate(1deg); }
                }
                @keyframes petGlow {
                    0%, 100% { opacity: 0.5; transform: scale(1); }
                    50% { opacity: 0.85; transform: scale(1.05); }
                }
                @keyframes petStar {
                    0%, 100% { opacity: 0.7; transform: scale(0.9); }
                    50% { opacity: 1; transform: scale(1.3); }
                }
                @keyframes petHaloSpin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .pet-glow-pulse { animation: petGlow 3s ease-in-out infinite; transform-origin: center; }
                .pet-star-pulse { animation: petStar 1.8s ease-in-out infinite; transform-origin: center; }
                .pet-spin-halo { animation: petHaloSpin 12s linear infinite; transform-origin: 100px 122px; }
                .pet-svg-container {
                    animation: petFloat 4s ease-in-out infinite;
                    filter: drop-shadow(0 10px 20px rgba(0,0,0,0.15));
                    cursor: pointer;
                    transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                .pet-svg-container:active { transform: scale(0.95); }
                .phx-wings { animation: petFloat 2s ease-in-out infinite; transform-origin: 100px 110px; }

                /* MODAL OVERLAYS */
                .loci-pet-modal-overlay {
                    position: fixed; inset: 0; background: rgba(15, 23, 42, 0.6);
                    backdrop-filter: blur(8px); z-index: 100050; display: none;
                    place-items: center; padding: 20px;
                }
                .loci-pet-modal-overlay.open { display: grid !important; }
                .loci-pet-modal-card {
                    background: #ffffff; border-radius: 24px; width: 100%; max-width: 680px;
                    box-shadow: 0 25px 60px rgba(15, 23, 42, 0.25); border: 1px solid #e2e8f0;
                    overflow: hidden; animation: petPopIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                }
                @keyframes petPopIn {
                    from { opacity: 0; transform: scale(0.94); }
                    to { opacity: 1; transform: scale(1); }
                }
            `;
            document.head.appendChild(style);
        }

        renderUI() {
            const container = document.getElementById('loci-pet-dashboard-slot');
            if (!container) return;

            if (!this.petData) {
                // Chưa chọn pet -> Hiển thị Call-to-action chọn pet
                container.innerHTML = `
                    <div style="background: linear-gradient(135deg, #f8fafc, #edf9ff); border: 1.5px dashed #38bdf8; border-radius: 20px; padding: 28px 24px; text-align: center; position: relative; overflow: hidden;">
                        <div style="display:inline-flex; align-items:center; gap:6px; background:#e0f2fe; color:#0284c7; padding:4px 12px; border-radius:99px; font-size:12px; font-weight:800; margin-bottom:12px;">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                            TÍNH NĂNG MỚI · LINH THÚ ĐỒNG HÀNH
                        </div>
                        <h3 style="font-size: 20px; font-weight: 800; color: #0f172a; margin-bottom: 8px;">Kích Hoạt Linh Thú Tri Thức Của Bạn</h3>
                        <p style="font-size: 13.5px; color: #64748b; max-width: 480px; margin: 0 auto 20px; line-height: 1.5;">
                            Chọn một thần thú đồng hành trong suốt hành trình chinh phục 12 trạm Loci. Cùng bạn bè học tập, cho ăn và tích lũy XP thăng cấp!
                        </p>
                        <button type="button" onclick="window.LociPet.openAdoptionModal()" style="background: linear-gradient(135deg, #0284c7, #0ea5e9); color: #fff; border: none; padding: 12px 28px; border-radius: 99px; font-weight: 800; font-size: 14px; cursor: pointer; box-shadow: 0 4px 14px rgba(2,132,199,0.35); transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.04)'" onmouseout="this.style.transform='scale(1)'">
                            Chọn Linh Thú Ngay ➔
                        </button>
                    </div>
                `;
            } else {
                // Đã có pet -> Hiển thị Dashboard Linh thú sinh động
                const species = PET_SPECIES[this.petData.speciesId] || PET_SPECIES.phoenix;
                const evoTitle = this.petData.level >= 3 ? 'Cấp 3: Thần Thoại Khởi Sắc' : (this.petData.level >= 2 ? 'Cấp 2: Trưởng Thành Dũng Mãnh' : 'Cấp 1: Sơ Sinh Đáng Yêu');
                const expPct = Math.min(100, Math.round((this.petData.exp / this.petData.maxExp) * 100));

                container.innerHTML = `
                    <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 24px; padding: 24px; box-shadow: 0 10px 30px rgba(15,23,42,0.06); position: relative; overflow: hidden;">
                        
                        <!-- Top status bar -->
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; flex-wrap: wrap; gap: 10px;">
                            <div style="display: flex; align-items: center; gap: 10px;">
                                <span style="background: ${species.colorGrad}; color: #fff; font-size: 11.5px; font-weight: 800; padding: 4px 12px; border-radius: 99px; letter-spacing: 0.5px;">${species.badge}</span>
                                <span style="font-size: 13px; font-weight: 700; color: #64748b;">Phòng nuôi chung: <b style="color: #0284c7;">${this.petData.roomCode}</b></span>
                            </div>
                            <button type="button" onclick="window.LociPet.openCoCareModal()" style="background: rgba(2,132,199,0.08); border: 1px solid #bae6fd; color: #0284c7; padding: 6px 14px; border-radius: 99px; font-size: 12.5px; font-weight: 700; cursor: pointer;">
                                Nuôi Cùng Bạn Bè ↗
                            </button>
                        </div>

                        <!-- Main Grid: Pet SVG on Left, Stats & Controls on Right -->
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 24px; align-items: center;">
                            
                            <!-- Left: Interactive Vector Pet Stage -->
                            <div style="background: radial-gradient(circle at center, #f0fdf4 0%, #f8fafc 80%); border-radius: 20px; border: 1px solid #f1f5f9; padding: 20px; text-align: center; position: relative;" onclick="window.LociPet.play()">
                                <div id="pet-action-toast" style="position: absolute; top: 12px; left: 50%; transform: translateX(-50%); background: #0f172a; color: #fff; padding: 4px 14px; border-radius: 99px; font-size: 12px; font-weight: 800; opacity: 0; pointer-events: none; transition: all 0.3s;"></div>
                                
                                <div class="pet-svg-container" title="Bấm vào để vuốt ve và chơi cùng Linh Thú">
                                    <svg width="190" height="190" viewBox="0 0 200 200">
                                        ${species.svgBody(this.petData.level)}
                                    </svg>
                                </div>

                                <div style="font-size: 18px; font-weight: 800; color: #0f172a; margin-top: 10px;">${this.petData.name}</div>
                                <div style="font-size: 12.5px; font-weight: 600; color: #64748b;">${evoTitle}</div>
                            </div>

                            <!-- Right: Stats Bars & Action Buttons -->
                            <div>
                                <!-- Level & EXP -->
                                <div style="margin-bottom: 14px;">
                                    <div style="display: flex; justify-content: space-between; font-size: 13px; font-weight: 700; margin-bottom: 6px;">
                                        <span style="color: #0f172a;">Cấp Độ ${this.petData.level}</span>
                                        <span style="color: #0284c7;">${this.petData.exp} / ${this.petData.maxExp} XP (${expPct}%)</span>
                                    </div>
                                    <div style="height: 10px; background: #e2e8f0; border-radius: 99px; overflow: hidden;">
                                        <div style="height: 100%; width: ${expPct}%; background: ${species.colorGrad}; border-radius: 99px; transition: width 0.4s ease;"></div>
                                    </div>
                                </div>

                                <!-- Fullness & Happiness Bars -->
                                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 18px;">
                                    <div style="background: #f8fafc; border: 1px solid #f1f5f9; padding: 10px; border-radius: 12px;">
                                        <div style="display: flex; justify-content: space-between; font-size: 12px; font-weight: 700; color: #475569; margin-bottom: 4px;">
                                            <span>Độ No</span>
                                            <span style="color: #ea580c;">${this.petData.fullness}%</span>
                                        </div>
                                        <div style="height: 6px; background: #e2e8f0; border-radius: 99px; overflow: hidden;">
                                            <div style="height: 100%; width: ${this.petData.fullness}%; background: #f97316; border-radius: 99px;"></div>
                                        </div>
                                    </div>
                                    <div style="background: #f8fafc; border: 1px solid #f1f5f9; padding: 10px; border-radius: 12px;">
                                        <div style="display: flex; justify-content: space-between; font-size: 12px; font-weight: 700; color: #475569; margin-bottom: 4px;">
                                            <span>Hạnh Phúc</span>
                                            <span style="color: #ec4899;">${this.petData.happiness}%</span>
                                        </div>
                                        <div style="height: 6px; background: #e2e8f0; border-radius: 99px; overflow: hidden;">
                                            <div style="height: 100%; width: ${this.petData.happiness}%; background: #ec4899; border-radius: 99px;"></div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Action buttons -->
                                <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                                    <button type="button" onclick="window.LociPet.feed()" style="flex: 1; min-width: 120px; padding: 11px 16px; background: #0284c7; color: #fff; border: none; border-radius: 12px; font-weight: 700; font-size: 13.5px; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.background='#0369a1'" onmouseout="this.style.background='#0284c7'">
                                        Cho Ăn (+15 No)
                                    </button>
                                    <button type="button" onclick="window.LociPet.play()" style="flex: 1; min-width: 120px; padding: 11px 16px; background: #ffffff; border: 1.5px solid #cbd5e1; color: #0f172a; border-radius: 12px; font-weight: 700; font-size: 13.5px; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.borderColor='#0284c7'; this.style.color='#0284c7';" onmouseout="this.style.borderColor='#cbd5e1'; this.style.color='#0f172a';">
                                        Chơi Đùa (+20 Vui)
                                    </button>
                                </div>

                                <div style="margin-top: 14px; font-size: 12px; color: #94a3b8; line-height: 1.4;">
                                    💡 <i>Mẹo: Mỗi khi bạn hoàn thành 1 câu trắc nghiệm hoặc học 1 trạm Loci, Linh thú sẽ tự động nhận thêm XP để nhanh chóng thức tỉnh hình thái Thần Thoại!</i>
                                </div>
                            </div>

                        </div>
                    </div>
                `;
            }
        }

        openAdoptionModal() {
            let modal = document.getElementById('pet-adoption-modal');
            if (!modal) {
                modal = document.createElement('div');
                modal.id = 'pet-adoption-modal';
                modal.className = 'loci-pet-modal-overlay';
                document.body.appendChild(modal);
            }

            modal.innerHTML = `
                <div class="loci-pet-modal-card" style="padding: 32px 28px; text-align: left;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 18px;">
                        <div>
                            <h3 style="font-size: 20px; font-weight: 800; color: #0f172a; margin: 0;">Chọn Linh Thú Tri Thức Đồng Hành</h3>
                            <p style="font-size: 13px; color: #64748b; margin: 4px 0 0;">Lựa chọn một linh thú thần thoại phù hợp với phong cách học tập của bạn</p>
                        </div>
                        <button type="button" onclick="document.getElementById('pet-adoption-modal').classList.remove('open')" style="background:#f1f5f9; border:none; width:32px; height:32px; border-radius:50%; cursor:pointer;">✕</button>
                    </div>

                    <!-- 3 Cards chọn linh thú -->
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 14px; margin-bottom: 22px;">
                        ${Object.values(PET_SPECIES).map((sp, idx) => `
                            <div class="pet-pick-card" onclick="window.LociPet.selectSpecies('${sp.id}', this)" style="border: 2px solid ${idx === 0 ? sp.color : '#e2e8f0'}; background: ${idx === 0 ? 'rgba(2,132,199,0.04)' : '#fff'}; border-radius: 16px; padding: 16px; cursor: pointer; text-align: center; transition: all 0.2s;" data-species="${sp.id}">
                                <div style="width: 90px; height: 90px; margin: 0 auto 8px;">
                                    <svg viewBox="0 0 200 200" width="100%" height="100%">${sp.svgBody(1)}</svg>
                                </div>
                                <div style="font-size: 14.5px; font-weight: 800; color: #0f172a;">${sp.name}</div>
                                <div style="font-size: 11px; font-weight: 700; color: ${sp.color}; margin: 4px 0;">${sp.badge}</div>
                                <div style="font-size: 11.5px; color: #64748b; line-height: 1.4;">${sp.desc}</div>
                            </div>
                        `).join('')}
                    </div>

                    <!-- Ô đặt tên & mã phòng nuôi chung -->
                    <div style="margin-bottom: 16px;">
                        <label style="display: block; font-size: 13px; font-weight: 700; color: #334155; margin-bottom: 6px;">Đặt tên cho Linh Thú</label>
                        <input type="text" id="pet-custom-name" placeholder="Ví dụ: Phượng Hoàng Lộc, Bạch Hổ 12A..." style="width: 100%; padding: 12px 14px; border: 1px solid #cbd5e1; border-radius: 10px; font-size: 14px; outline: none;">
                    </div>

                    <div style="display: flex; gap: 10px; justify-content: flex-end;">
                        <button type="button" onclick="document.getElementById('pet-adoption-modal').classList.remove('open')" style="padding: 10px 18px; border: 1px solid #cbd5e1; background: #fff; border-radius: 10px; font-weight: 700; cursor: pointer;">Hủy</button>
                        <button type="button" onclick="window.LociPet.confirmAdoption()" style="padding: 10px 24px; background: #0284c7; color: #fff; border: none; border-radius: 10px; font-weight: 700; cursor: pointer;">Xác Nhận Nhận Nuôi ➔</button>
                    </div>
                </div>
            `;
            modal.classList.add('open');
            this.selectedSpeciesId = 'phoenix';
        }

        selectSpecies(speciesId, cardEl) {
            this.selectedSpeciesId = speciesId;
            document.querySelectorAll('.pet-pick-card').forEach(c => {
                c.style.borderColor = '#e2e8f0';
                c.style.background = '#ffffff';
            });
            const sp = PET_SPECIES[speciesId];
            if (cardEl && sp) {
                cardEl.style.borderColor = sp.color;
                cardEl.style.background = 'rgba(2,132,199,0.05)';
            }
        }

        confirmAdoption() {
            const nameInput = document.getElementById('pet-custom-name');
            const nickname = nameInput ? nameInput.value.trim() : '';
            this.createNewPet(this.selectedSpeciesId || 'phoenix', nickname);
            const modal = document.getElementById('pet-adoption-modal');
            if (modal) modal.classList.remove('open');
        }

        openCoCareModal() {
            if (!this.petData) return;
            let modal = document.getElementById('pet-cocare-modal');
            if (!modal) {
                modal = document.createElement('div');
                modal.id = 'pet-cocare-modal';
                modal.className = 'loci-pet-modal-overlay';
                document.body.appendChild(modal);
            }

            modal.innerHTML = `
                <div class="loci-pet-modal-card" style="padding: 30px 26px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 16px;">
                        <h3 style="font-size: 19px; font-weight: 800; color: #0f172a; margin: 0;">Nuôi Linh Thú Cùng Nhóm Bạn</h3>
                        <button type="button" onclick="document.getElementById('pet-cocare-modal').classList.remove('open')" style="background:#f1f5f9; border:none; width:32px; height:32px; border-radius:50%; cursor:pointer;">✕</button>
                    </div>

                    <p style="font-size: 13px; color: #64748b; line-height: 1.5; margin-bottom: 18px;">
                        Chia sẻ mã phòng này cho bạn cùng bàn hoặc nhóm học sinh lớp 12 của bạn. Khi các bạn cùng vào phòng, toàn bộ hành động học bài, làm trắc nghiệm và cho ăn sẽ được cộng hưởng tăng cấp chung cho Linh Thú!
                    </p>

                    <!-- Khung mã phòng -->
                    <div style="background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 14px; padding: 14px 18px; display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px;">
                        <div>
                            <div style="font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">MÃ PHÒNG NUÔI CHUNG HIỆN TẠI</div>
                            <div style="font-size: 20px; font-weight: 800; color: #0284c7; letter-spacing: 1px;" id="cocare-room-display">${this.petData.roomCode}</div>
                        </div>
                        <button type="button" onclick="navigator.clipboard.writeText('${this.petData.roomCode}'); alert('Đã sao chép mã phòng vào bộ nhớ tạm!');" style="background: #0284c7; color: #fff; border: none; padding: 8px 16px; border-radius: 8px; font-weight: 700; font-size: 13px; cursor: pointer;">
                            Sao Chép Mã
                        </button>
                    </div>

                    <!-- Tham gia phòng khác -->
                    <div style="border-top: 1px solid #f1f5f9; padding-top: 18px; margin-bottom: 18px;">
                        <label style="display: block; font-size: 13px; font-weight: 700; color: #334155; margin-bottom: 6px;">Hoặc gia nhập phòng nuôi chung của bạn bè</label>
                        <div style="display: flex; gap: 8px;">
                            <input type="text" id="input-join-room-code" placeholder="Nhập mã phòng (vd: LOCI-PET-12A3)" style="flex: 1; padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 10px; font-size: 14px; outline: none;">
                            <button type="button" onclick="window.LociPet.joinRoom()" style="padding: 10px 18px; background: #0f172a; color: #fff; border: none; border-radius: 10px; font-weight: 700; cursor: pointer;">
                                Kết Nối
                            </button>
                        </div>
                    </div>

                    <!-- Lịch sử chăm sóc chung -->
                    <div>
                        <div style="font-size: 13px; font-weight: 700; color: #0f172a; margin-bottom: 8px;">Nhật ký chăm sóc gần đây:</div>
                        <div style="background: #f8fafc; border-radius: 12px; padding: 10px 14px; max-height: 120px; overflow-y: auto; font-size: 12px; color: #475569;">
                            ${this.petData.history.map(h => `<div style="padding: 3px 0; border-bottom: 1px dashed #e2e8f0;"><b>[${h.time}]</b> ${h.act}</div>`).join('')}
                        </div>
                    </div>
                </div>
            `;
            modal.classList.add('open');
        }

        joinRoom() {
            const input = document.getElementById('input-join-room-code');
            const code = input ? input.value.trim().toUpperCase() : '';
            if (!code) return alert('Vui lòng nhập mã phòng hợp lệ.');
            if (code === this.petData.roomCode) return alert('Bạn đang ở trong phòng này rồi!');

            this.petData.roomCode = code;
            this.petData.coCareMembers.push('Thành viên mới');
            this.addExp(30, `Đã kết nối thành công phòng nuôi chung [${code}]`);
            window.playTingTing();
            alert(`Đã kết nối thành công vào phòng [${code}]!`);
            const modal = document.getElementById('pet-cocare-modal');
            if (modal) modal.classList.remove('open');
        }

        bindGlobalTriggers() {
            // Khi học sinh làm trắc nghiệm, trả lời đúng, hoặc hoàn thành mốc Loci
            window.addEventListener('loci_study_activity', (e) => {
                const expGain = (e.detail && e.detail.exp) ? e.detail.exp : 15;
                this.trainWithStudy(expGain);
            });
        }
    }

    window.LociPet = new LociPetManager();
})();
