/**
 * LOCI EDU - ĐẤU TRƯỜNG TRI THỨC (KNOWLEDGE ARENA 1v1 DUEL ENGINE)
 * ============================================================================
 * Chế độ thi đấu đối kháng trực tuyến 1v1:
 * - Tùy chọn 5, 10, 15, 20 câu hỏi đa dạng (Trắc nghiệm, Điền khuyết, Model 3D).
 * - Cùng chiếu 1 câu hỏi trên màn hình cho 2 đấu thủ với bộ đếm 30s.
 * - Cả 2 chọn xong thì chốt kết quả ngay lập tức, tính điểm chính xác và tốc độ.
 * - Đếm số trận thắng để mở khóa Hệ Thống Huy Hiệu Trí Nhớ và Bảng Xếp Hạng Đấu Trường.
 * ============================================================================
 */

(function (global) {
    'use strict';

    const ArenaDuelEngine = {
        active: false,
        roomConfig: {
            questionCount: 10,
            timePerQuestion: 30
        },
        gameState: {
            currentRound: 0,
            totalRounds: 10,
            p1Score: 0,
            p2Score: 0,
            p1Answer: null,
            p2Answer: null,
            p1AnswerTime: 0,
            p2AnswerTime: 0,
            p1Answered: false,
            p2Answered: false,
            questions: [],
            timerInterval: null,
            secondsLeft: 30,
            roundResolved: false,
            isBotOpponent: true,
            opponentProfile: null,
            myProfile: null
        },

        // Danh sách Huy Hiệu Trí Nhớ (Memory Badges) theo số trận thắng
        BADGE_TIERS: [
            { id: 'badge_novice', winsRequired: 1, name: 'Tân Binh Đấu Trường', icon: '🥉', color: '#cd7f32', bg: 'linear-gradient(135deg, #fef3c7, #fde68a)', desc: 'Chiến thắng trận đối kháng đầu tiên tại Cung Điện Loci' },
            { id: 'badge_warrior', winsRequired: 3, name: 'Chiến Binh Ký Ức', icon: '🥈', color: '#94a3b8', bg: 'linear-gradient(135deg, #f1f5f9, #e2e8f0)', desc: 'Thắng 3 trận, làm chủ kỹ năng phản xạ không gian' },
            { id: 'badge_champion', winsRequired: 5, name: 'Quán Quân Cung Điện', icon: '🥇', color: '#f59e0b', bg: 'linear-gradient(135deg, #fef3c7, #fbbf24)', desc: 'Thắng 5 trận, phong thái xuất chúng trước mọi đối thủ' },
            { id: 'badge_grandmaster', winsRequired: 10, name: 'Đại Kiện Tướng Loci', icon: '💎', color: '#0284c7', bg: 'linear-gradient(135deg, #e0f2fe, #38bdf8)', desc: 'Thắng 10 trận, ghi nhớ siêu tốc và chính xác tuyệt đối' },
            { id: 'badge_legend', winsRequired: 20, name: 'Huyền Thoại Sử Học', icon: '👑', color: '#7c3aed', bg: 'linear-gradient(135deg, #ede9fe, #a855f7)', desc: 'Thắng 20+ trận, đỉnh cao kiến thức Lịch sử THPT' }
        ],

        // Danh sách đối thủ thông minh mô phỏng học sinh trường chuyên (khi không có người thật ghép cùng giây)
        OPPONENT_BOTS: [
            { name: 'Nguyễn Hoàng Long', school: 'THPT Chuyên Hà Nội - Amsterdam', avatar: 'assets/images/pets/tiger_speed.png', accuracy: 0.82, speedMin: 4, speedMax: 12 },
            { name: 'Trần Bảo Ngọc', school: 'THPT Chuyên Lê Hồng Phong (TP.HCM)', avatar: 'assets/images/pets/phoenix_fire.png', accuracy: 0.85, speedMin: 3, speedMax: 10 },
            { name: 'Đặng Tuấn Kiệt', school: 'THPT Chuyên Quốc Học Huế', avatar: 'assets/images/pets/kirin_aura.png', accuracy: 0.88, speedMin: 5, speedMax: 14 },
            { name: 'Lê Thùy Dung', school: 'THPT Chuyên Chu Văn An', avatar: 'assets/images/pets/owl_scholar.png', accuracy: 0.80, speedMin: 4, speedMax: 11 },
            { name: 'Phạm Minh Quân', school: 'THPT Chuyên Khoa Học Tự Nhiên', avatar: 'assets/images/loci_avatar.jpg', accuracy: 0.84, speedMin: 3, speedMax: 9 }
        ],

        init() {
            this.injectStyles();
            this.ensureModalContainers();
        },

        injectStyles() {
            if (document.getElementById('arena-duel-styles')) return;
            const style = document.createElement('style');
            style.id = 'arena-duel-styles';
            style.textContent = `
                /* ARENA DUEL 1v1 MODAL STYLES */
                .arena-modal-overlay {
                    position: fixed;
                    inset: 0;
                    z-index: 999999;
                    background: rgba(7, 15, 29, 0.88);
                    backdrop-filter: blur(16px);
                    -webkit-backdrop-filter: blur(16px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 16px;
                    opacity: 0;
                    visibility: hidden;
                    transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .arena-modal-overlay.open {
                    opacity: 1;
                    visibility: visible;
                }
                .arena-card {
                    background: #ffffff;
                    width: 100%;
                    max-width: 920px;
                    max-height: 92vh;
                    border-radius: 28px;
                    border: 1.5px solid #bae6fd;
                    box-shadow: 0 25px 70px rgba(2, 132, 199, 0.22), 0 0 0 1px rgba(255, 255, 255, 0.8);
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    position: relative;
                    animation: arenaCardIn 0.35s cubic-bezier(0.16, 1, 0.3, 1);
                }
                @keyframes arenaCardIn {
                    from { transform: scale(0.92) translateY(20px); opacity: 0; }
                    to { transform: scale(1) translateY(0); opacity: 1; }
                }
                .arena-header {
                    padding: 20px 28px;
                    background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
                    color: #ffffff;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }
                .arena-header-left {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .arena-header-title {
                    font-size: 20px;
                    font-weight: 800;
                    letter-spacing: -0.3px;
                }
                .arena-header-badge {
                    font-size: 11px;
                    font-weight: 800;
                    background: rgba(255, 255, 255, 0.2);
                    padding: 3px 10px;
                    border-radius: 99px;
                    text-transform: uppercase;
                    border: 1px solid rgba(255, 255, 255, 0.3);
                }
                .arena-close-btn {
                    background: rgba(255, 255, 255, 0.15);
                    border: none;
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    color: #ffffff;
                    font-size: 18px;
                    cursor: pointer;
                    display: grid;
                    place-items: center;
                    transition: background 0.2s;
                }
                .arena-close-btn:hover {
                    background: rgba(255, 255, 255, 0.3);
                }
                .arena-body {
                    padding: 24px 28px;
                    overflow-y: auto;
                    flex: 1;
                }

                /* LOBBY / SELECTION SCREEN */
                .arena-mode-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
                    gap: 12px;
                    margin-bottom: 24px;
                }
                .arena-q-chip {
                    padding: 16px 12px;
                    border: 2px solid #e2e8f0;
                    border-radius: 16px;
                    background: #f8fafc;
                    cursor: pointer;
                    text-align: center;
                    transition: all 0.2s;
                }
                .arena-q-chip:hover {
                    border-color: #38bdf8;
                    transform: translateY(-2px);
                }
                .arena-q-chip.active {
                    background: #f0f9ff;
                    border-color: #0284c7;
                    box-shadow: 0 4px 14px rgba(2, 132, 199, 0.18);
                }
                .arena-q-num {
                    font-size: 24px;
                    font-weight: 800;
                    color: #0284c7;
                    display: block;
                }
                .arena-q-label {
                    font-size: 12px;
                    font-weight: 600;
                    color: #64748b;
                }

                /* MATCHMAKING RADAR */
                .arena-radar-wrap {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 40px 20px;
                    text-align: center;
                }
                .arena-radar {
                    position: relative;
                    width: 120px;
                    height: 120px;
                    margin-bottom: 24px;
                }
                .arena-radar-ring {
                    position: absolute;
                    inset: 0;
                    border-radius: 50%;
                    border: 2px solid #38bdf8;
                    animation: radarPulse 2s infinite ease-out;
                }
                .arena-radar-ring:nth-child(2) {
                    animation-delay: 0.6s;
                }
                .arena-radar-ring:nth-child(3) {
                    animation-delay: 1.2s;
                }
                @keyframes radarPulse {
                    0% { transform: scale(0.3); opacity: 1; }
                    100% { transform: scale(1.6); opacity: 0; }
                }
                .arena-radar-center {
                    position: absolute;
                    inset: 30px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #0284c7, #0369a1);
                    display: grid;
                    place-items: center;
                    color: #ffffff;
                    font-size: 28px;
                    box-shadow: 0 0 20px rgba(2, 132, 199, 0.6);
                }

                /* BATTLE ARENA SCREEN */
                .arena-scoreboard {
                    display: grid;
                    grid-template-columns: 1fr auto 1fr;
                    gap: 16px;
                    align-items: center;
                    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
                    border-radius: 20px;
                    padding: 16px 20px;
                    margin-bottom: 20px;
                    border: 1.5px solid #e2e8f0;
                }
                .player-box {
                    display: flex;
                    align-items: center;
                    gap: 14px;
                }
                .player-box.right {
                    flex-direction: row-reverse;
                    text-align: right;
                }
                .player-avatar-wrap {
                    position: relative;
                    width: 54px;
                    height: 54px;
                    border-radius: 50%;
                    background: #ffffff;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
                    border: 2px solid #bae6fd;
                    flex-shrink: 0;
                    overflow: visible;
                }
                .player-avatar-img {
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    object-fit: cover;
                }
                .player-status-badge {
                    position: absolute;
                    bottom: -4px;
                    left: 50%;
                    transform: translateX(-50%);
                    font-size: 10px;
                    font-weight: 800;
                    white-space: nowrap;
                    padding: 2px 7px;
                    border-radius: 99px;
                    border: 1.5px solid #ffffff;
                }
                .status-thinking {
                    background: #e2e8f0;
                    color: #475569;
                }
                .status-ready {
                    background: #10b981;
                    color: #ffffff;
                    animation: pulseDot 1s infinite alternate;
                }
                .player-name {
                    font-size: 15px;
                    font-weight: 800;
                    color: #0f172a;
                    line-height: 1.2;
                }
                .player-score {
                    font-size: 22px;
                    font-weight: 900;
                    color: #0284c7;
                }
                .arena-vs-col {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 4px;
                }
                .arena-timer-circle {
                    width: 58px;
                    height: 58px;
                    border-radius: 50%;
                    background: #0f172a;
                    color: #ffffff;
                    display: grid;
                    place-items: center;
                    font-size: 22px;
                    font-weight: 900;
                    box-shadow: 0 4px 16px rgba(15, 23, 42, 0.25);
                    position: relative;
                    border: 3px solid #38bdf8;
                    transition: border-color 0.3s;
                }
                .arena-timer-circle.warning {
                    border-color: #ef4444;
                    color: #ef4444;
                    animation: timerPanic 0.6s infinite alternate;
                }
                @keyframes timerPanic {
                    from { transform: scale(1); }
                    to { transform: scale(1.08); }
                }

                /* QUESTION CARD */
                .arena-question-card {
                    background: #ffffff;
                    border: 1.5px solid #e2e8f0;
                    border-radius: 20px;
                    padding: 24px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
                    margin-bottom: 20px;
                }
                .arena-round-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    background: #e0f2fe;
                    color: #0369a1;
                    font-size: 11.5px;
                    font-weight: 800;
                    padding: 4px 12px;
                    border-radius: 99px;
                    margin-bottom: 12px;
                }
                .arena-question-text {
                    font-size: 18px;
                    font-weight: 800;
                    color: #0f172a;
                    line-height: 1.5;
                    margin-bottom: 20px;
                }
                .arena-option-list {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 10px;
                }
                .arena-option-btn {
                    padding: 14px 18px;
                    background: #f8fafc;
                    border: 1.5px solid #cbd5e1;
                    border-radius: 14px;
                    font-size: 15px;
                    font-weight: 600;
                    color: #1e293b;
                    text-align: left;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    transition: all 0.15s;
                }
                .arena-option-btn:hover:not(:disabled) {
                    border-color: #0284c7;
                    background: #f0f9ff;
                    transform: translateY(-1px);
                }
                .arena-option-btn.selected {
                    background: #e0f2fe;
                    border-color: #0284c7;
                    font-weight: 700;
                    color: #0369a1;
                }
                .arena-option-btn.correct {
                    background: #dcfce7 !important;
                    border-color: #16a34a !important;
                    color: #15803d !important;
                }
                .arena-option-btn.wrong {
                    background: #fee2e2 !important;
                    border-color: #dc2626 !important;
                    color: #b91c1c !important;
                }
                .arena-option-tag {
                    width: 28px;
                    height: 28px;
                    border-radius: 8px;
                    background: #e2e8f0;
                    display: grid;
                    place-items: center;
                    font-size: 12px;
                    font-weight: 800;
                    flex-shrink: 0;
                }
                .arena-option-btn.correct .arena-option-tag {
                    background: #16a34a;
                    color: #ffffff;
                }
                .arena-option-btn.wrong .arena-option-tag {
                    background: #dc2626;
                    color: #ffffff;
                }

                /* TYPEIN / CLOZE IN ARENA */
                .arena-input-row {
                    display: flex;
                    gap: 10px;
                    margin-top: 14px;
                }
                .arena-type-input {
                    flex: 1;
                    padding: 14px 18px;
                    border: 2px solid #cbd5e1;
                    border-radius: 12px;
                    font-size: 15.5px;
                    font-weight: 600;
                    outline: none;
                }
                .arena-type-input:focus {
                    border-color: #0284c7;
                }
                .arena-type-submit {
                    padding: 14px 24px;
                    background: #0284c7;
                    color: #ffffff;
                    border: none;
                    border-radius: 12px;
                    font-weight: 800;
                    cursor: pointer;
                    transition: background 0.2s;
                }
                .arena-type-submit:hover {
                    background: #0369a1;
                }

                /* VICTORY & BADGES */
                .arena-victory-card {
                    text-align: center;
                    padding: 24px 16px;
                }
                .arena-badge-showcase {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                    gap: 14px;
                    margin: 24px 0;
                }
                .memory-badge-card {
                    background: #f8fafc;
                    border: 1.5px solid #e2e8f0;
                    border-radius: 18px;
                    padding: 16px 12px;
                    text-align: center;
                    position: relative;
                    transition: all 0.25s;
                }
                .memory-badge-card.unlocked {
                    border-color: #f59e0b;
                    box-shadow: 0 8px 24px rgba(245, 158, 11, 0.2);
                    background: #ffffff;
                }
                .badge-graphic {
                    width: 64px;
                    height: 64px;
                    border-radius: 50%;
                    margin: 0 auto 10px;
                    display: grid;
                    place-items: center;
                    font-size: 32px;
                    box-shadow: 0 4px 14px rgba(0,0,0,0.08);
                }
                .badge-name {
                    font-size: 13.5px;
                    font-weight: 800;
                    color: #0f172a;
                    margin-bottom: 4px;
                }
                .badge-req {
                    font-size: 11px;
                    font-weight: 700;
                    color: #64748b;
                }

                /* LEADERBOARD TABLE */
                .arena-lb-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 14px;
                }
                .arena-lb-table th {
                    text-align: left;
                    font-size: 12px;
                    font-weight: 800;
                    color: #64748b;
                    padding: 10px 14px;
                    border-bottom: 1.5px solid #e2e8f0;
                    text-transform: uppercase;
                }
                .arena-lb-table td {
                    padding: 12px 14px;
                    font-size: 13.5px;
                    font-weight: 600;
                    color: #1e293b;
                    border-bottom: 1px solid #f1f5f9;
                }
                .arena-lb-table tr.highlight {
                    background: #f0f9ff;
                    font-weight: 800;
                }

                /* ═════════════════════════════════════════════════════════════════
                   RESPONSIVE MOBILE STYLES CHO ĐẤU TRƯỜNG TRI THỨC (PHONES & TABLETS)
                   ═════════════════════════════════════════════════════════════════ */
                @media (max-width: 640px) {
                    .arena-modal-overlay {
                        padding: 8px !important;
                    }
                    .arena-card {
                        max-height: 96vh !important;
                        border-radius: 20px !important;
                        width: 100% !important;
                    }
                    .arena-header {
                        padding: 13px 16px !important;
                    }
                    .arena-header-title {
                        font-size: 16px !important;
                    }
                    .arena-header-badge {
                        font-size: 10px !important;
                        padding: 2px 7px !important;
                    }
                    .arena-close-btn {
                        width: 32px !important;
                        height: 32px !important;
                        font-size: 15px !important;
                    }
                    .arena-body {
                        padding: 14px 14px 20px 14px !important;
                    }
                    .arena-mode-grid {
                        grid-template-columns: repeat(2, 1fr) !important;
                        gap: 8px !important;
                    }
                    .arena-q-chip {
                        padding: 12px 8px !important;
                    }
                    .arena-q-num {
                        font-size: 20px !important;
                    }
                    .arena-scoreboard {
                        grid-template-columns: 1fr auto 1fr !important;
                        padding: 10px 10px !important;
                        gap: 6px !important;
                        border-radius: 16px !important;
                        margin-bottom: 12px !important;
                    }
                    .player-box {
                        gap: 7px !important;
                    }
                    .player-avatar-wrap {
                        width: 38px !important;
                        height: 38px !important;
                    }
                    .player-name {
                        font-size: 12px !important;
                        max-width: 72px !important;
                        overflow: hidden !important;
                        text-overflow: ellipsis !important;
                        white-space: nowrap !important;
                    }
                    .player-score {
                        font-size: 17px !important;
                    }
                    .player-status-badge {
                        font-size: 9px !important;
                        padding: 1px 5px !important;
                    }
                    .arena-timer-circle {
                        width: 44px !important;
                        height: 44px !important;
                        font-size: 17px !important;
                    }
                    .arena-vs-text {
                        font-size: 9.5px !important;
                    }
                    .arena-question-card {
                        padding: 14px 12px !important;
                        border-radius: 16px !important;
                        margin-bottom: 12px !important;
                    }
                    .arena-round-badge {
                        font-size: 10.5px !important;
                        padding: 3px 9px !important;
                    }
                    .arena-question-text {
                        font-size: 14.5px !important;
                        line-height: 1.45 !important;
                        margin-bottom: 12px !important;
                    }
                    .arena-model-viewer {
                        height: 165px !important;
                    }
                    .arena-option-list {
                        gap: 8px !important;
                    }
                    .arena-option-btn {
                        padding: 11px 12px !important;
                        font-size: 13.5px !important;
                        border-radius: 12px !important;
                        gap: 9px !important;
                        min-height: 44px !important;
                    }
                    .arena-option-tag {
                        width: 24px !important;
                        height: 24px !important;
                        font-size: 11px !important;
                    }
                    .arena-input-row {
                        flex-direction: column !important;
                        gap: 8px !important;
                    }
                    .arena-type-input {
                        font-size: 16px !important;
                        padding: 11px 13px !important;
                    }
                    .arena-type-submit {
                        padding: 11px !important;
                        width: 100% !important;
                    }
                    .arena-victory-card h2 {
                        font-size: 20px !important;
                    }
                    .arena-victory-score-row {
                        gap: 16px !important;
                        padding: 14px 18px !important;
                    }
                    .arena-victory-actions {
                        flex-direction: column !important;
                        width: 100% !important;
                    }
                    .arena-victory-actions button {
                        width: 100% !important;
                        justify-content: center !important;
                    }
                }
                @media (max-width: 400px) {
                    .player-name {
                        max-width: 58px !important;
                        font-size: 11px !important;
                    }
                    .player-score {
                        font-size: 15px !important;
                    }
                    .arena-timer-circle {
                        width: 40px !important;
                        height: 40px !important;
                        font-size: 15px !important;
                    }
                }

            `;
            document.head.appendChild(style);
        },

        ensureModalContainers() {
            if (document.getElementById('arena-duel-modal')) return;
            const modal = document.createElement('div');
            modal.id = 'arena-duel-modal';
            modal.className = 'arena-modal-overlay';
            modal.innerHTML = `
                <div class="arena-card">
                    <div class="arena-header">
                        <div class="arena-header-left">
                            <span style="font-size: 26px;">⚔️</span>
                            <div>
                                <div class="arena-header-title">Đấu Trường Tri Thức · 1v1 Online</div>
                                <div class="arena-header-badge">Real-time History Battle</div>
                            </div>
                        </div>
                        <button type="button" class="arena-close-btn" onclick="window.ArenaDuelEngine.close()">✕</button>
                    </div>
                    <div class="arena-body" id="arena-main-body">
                        <!-- Dynamic content rendered by ArenaDuelEngine -->
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
        },

        open() {
            this.ensureModalContainers();
            const modal = document.getElementById('arena-duel-modal');
            if (modal) modal.classList.add('open');
            this.active = true;
            this.renderLobby();
        },

        close() {
            if (this.gameState.timerInterval) clearInterval(this.gameState.timerInterval);
            const modal = document.getElementById('arena-duel-modal');
            if (modal) modal.classList.remove('open');
            this.active = false;
        },

        // 1. MÀN HÌNH CHỜ & TÙY CHỌN SỐ CÂU HỎI
        renderLobby() {
            const myUser = this.getMyUser();
            const wins = this.getArenaWins();
            const matches = this.getArenaMatches();
            const currentBadge = this.getCurrentBadge(wins);

            const body = document.getElementById('arena-main-body');
            if (!body) return;

            body.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 14px;">
                    <div>
                        <h3 style="font-size: 22px; font-weight: 800; color: #0f172a; margin: 0 0 4px 0;">Thi Đấu Đối Kháng Trực Tuyến</h3>
                        <p style="font-size: 13.5px; color: #64748b; margin: 0;">Ghép trận ngẫu nhiên cùng bạn học, thi đấu 30s mỗi câu hỏi và thăng cấp Huy hiệu Trí nhớ.</p>
                    </div>
                    <div style="display: flex; align-items: center; gap: 10px; background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 16px; padding: 8px 16px;">
                        <span style="font-size: 28px;">${currentBadge.icon}</span>
                        <div>
                            <div style="font-size: 13.5px; font-weight: 800; color: #0f172a;">${currentBadge.name}</div>
                            <div style="font-size: 11.5px; font-weight: 700; color: #0284c7;">${wins} Thắng / ${matches} Trận</div>
                        </div>
                    </div>
                </div>

                <div style="margin-bottom: 20px;">
                    <label style="display: block; font-size: 13px; font-weight: 800; color: #334155; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px;">
                        Chọn số lượng câu hỏi thi đấu:
                    </label>
                    <div class="arena-mode-grid">
                        <div class="arena-q-chip ${this.roomConfig.questionCount === 5 ? 'active' : ''}" onclick="window.ArenaDuelEngine.setQuestionCount(5, this)">
                            <span class="arena-q-num">5</span>
                            <span class="arena-q-label">Đấu Nhanh (5 câu)</span>
                        </div>
                        <div class="arena-q-chip ${this.roomConfig.questionCount === 10 ? 'active' : ''}" onclick="window.ArenaDuelEngine.setQuestionCount(10, this)">
                            <span class="arena-q-num">10</span>
                            <span class="arena-q-label">Tiêu Chuẩn (10 câu)</span>
                        </div>
                        <div class="arena-q-chip ${this.roomConfig.questionCount === 15 ? 'active' : ''}" onclick="window.ArenaDuelEngine.setQuestionCount(15, this)">
                            <span class="arena-q-num">15</span>
                            <span class="arena-q-label">Mở Rộng (15 câu)</span>
                        </div>
                        <div class="arena-q-chip ${this.roomConfig.questionCount === 20 ? 'active' : ''}" onclick="window.ArenaDuelEngine.setQuestionCount(20, this)">
                            <span class="arena-q-num">20</span>
                            <span class="arena-q-label">Đại Chiến (20 câu)</span>
                        </div>
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 28px;">
                    <button type="button" onclick="window.ArenaDuelEngine.startMatchmaking()" 
                        style="padding: 16px; background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%); color: #ffffff; border: none; border-radius: 16px; font-size: 16px; font-weight: 800; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; box-shadow: 0 8px 24px rgba(2, 132, 199, 0.35);">
                        <span>⚡</span> Ghép Trận Ngẫu Nhiên ➔
                    </button>
                    <button type="button" onclick="window.ArenaDuelEngine.renderLeaderboardView()"
                        style="padding: 16px; background: #ffffff; color: #0f172a; border: 1.5px solid #cbd5e1; border-radius: 16px; font-size: 15px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;">
                        <span>🏆</span> Bảng Xếp Hạng Đấu Trường
                    </button>
                </div>

                <!-- SHOWCASE CÁC HUY HIỆU TRÍ NHỚ ĐẠT ĐƯỢC -->
                <div>
                    <div style="font-size: 13.5px; font-weight: 800; color: #0f172a; margin-bottom: 12px; display: flex; align-items: center; gap: 6px;">
                        <span>🎖️</span> Hệ Thống Huy Hiệu Trí Nhớ Loci (Memory Badges):
                    </div>
                    <div class="arena-badge-showcase">
                        ${this.BADGE_TIERS.map(b => {
                            const isUnlocked = wins >= b.winsRequired;
                            return `
                                <div class="memory-badge-card ${isUnlocked ? 'unlocked' : ''}">
                                    <div class="badge-graphic" style="background: ${b.bg}; filter: ${isUnlocked ? 'none' : 'grayscale(1) opacity(0.5)'};">
                                        ${b.icon}
                                    </div>
                                    <div class="badge-name" style="${isUnlocked ? 'color: ' + b.color : 'color: #94a3b8'}">${b.name}</div>
                                    <div class="badge-req">${isUnlocked ? '✓ Đã mở khóa' : 'Cần ' + b.winsRequired + ' trận thắng'}</div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            `;
        },

        setQuestionCount(count, el) {
            this.roomConfig.questionCount = count;
            document.querySelectorAll('.arena-q-chip').forEach(c => c.classList.remove('active'));
            if (el) el.classList.add('active');
        },

        // 2. TÌM KIẾM ĐỐI THỦ (MATCHMAKING)
        startMatchmaking() {
            const body = document.getElementById('arena-main-body');
            if (!body) return;

            body.innerHTML = `
                <div class="arena-radar-wrap">
                    <div class="arena-radar">
                        <div class="arena-radar-ring"></div>
                        <div class="arena-radar-ring"></div>
                        <div class="arena-radar-ring"></div>
                        <div class="arena-radar-center">⚔️</div>
                    </div>
                    <h3 style="font-size: 20px; font-weight: 800; color: #0f172a; margin: 0 0 8px 0;">Đang Tìm Kiếm Đối Thủ Xứng Tầm...</h3>
                    <p style="font-size: 13.5px; color: #64748b; max-width: 440px; margin: 0 0 20px 0;">Hệ thống đang quét phòng thi đấu trực tuyến trên toàn mạng lưới học sinh Loci.Edu...</p>
                    <button type="button" onclick="window.ArenaDuelEngine.renderLobby()" 
                        style="padding: 10px 22px; background: #ffffff; border: 1.5px solid #cbd5e1; border-radius: 99px; font-size: 13.5px; font-weight: 700; color: #64748b; cursor: pointer;">
                        Hủy tìm trận
                    </button>
                </div>
            `;

            // Giả lập tìm đối thủ nhanh sau 1.8s để học sinh không bao giờ phải chờ lâu
            setTimeout(() => {
                this.onMatchFound();
            }, 1800);
        },

        onMatchFound() {
            // Chọn ngẫu nhiên 1 đối thủ trong danh sách học sinh
            const bot = this.OPPONENT_BOTS[Math.floor(Math.random() * this.OPPONENT_BOTS.length)];
            const myUser = this.getMyUser();

            this.gameState.myProfile = myUser;
            this.gameState.opponentProfile = bot;
            this.gameState.isBotOpponent = true;
            this.gameState.p1Score = 0;
            this.gameState.p2Score = 0;
            this.gameState.totalRounds = this.roomConfig.questionCount;
            this.gameState.currentRound = 0;

            // Chuẩn bị ngân hàng câu hỏi đa dạng (Trắc nghiệm, Điền khuyết, Model 3D)
            this.gameState.questions = this.prepareQuestions(this.gameState.totalRounds);

            const body = document.getElementById('arena-main-body');
            if (!body) return;

            body.innerHTML = `
                <div style="text-align: center; padding: 30px 10px;">
                    <div style="font-size: 14px; font-weight: 800; color: #10b981; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 20px;">
                        ✓ ĐÃ TÌM THẤY ĐỐI THỦ!
                    </div>
                    <div style="display: flex; align-items: center; justify-content: center; gap: 36px; margin-bottom: 24px;">
                        <div>
                            <div style="width: 80px; height: 80px; border-radius: 50%; border: 3px solid #0284c7; margin: 0 auto 10px; overflow: hidden; box-shadow: 0 8px 24px rgba(2, 132, 199, 0.3);">
                                <img src="${myUser.avatar}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='assets/images/loci_avatar.jpg'">
                            </div>
                            <div style="font-size: 16px; font-weight: 800; color: #0f172a;">${myUser.name}</div>
                            <div style="font-size: 12px; font-weight: 600; color: #64748b;">(Bạn)</div>
                        </div>

                        <div style="font-size: 32px; font-weight: 900; color: #ef4444; text-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);">
                            VS
                        </div>

                        <div>
                            <div style="width: 80px; height: 80px; border-radius: 50%; border: 3px solid #f59e0b; margin: 0 auto 10px; overflow: hidden; box-shadow: 0 8px 24px rgba(245, 158, 11, 0.3);">
                                <img src="${bot.avatar}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='assets/images/pets/owl_scholar.png'">
                            </div>
                            <div style="font-size: 16px; font-weight: 800; color: #0f172a;">${bot.name}</div>
                            <div style="font-size: 12px; font-weight: 600; color: #64748b;">${bot.school}</div>
                        </div>
                    </div>
                    <p style="font-size: 14px; color: #64748b; margin-bottom: 24px;">Trận đấu gồm <strong>${this.gameState.totalRounds} câu hỏi</strong> · <strong>30 giây</strong> mỗi câu · Ai chọn trước và đúng được cộng thêm điểm tốc độ!</p>
                    <div style="font-size: 20px; font-weight: 800; color: #0284c7;" id="arena-countdown-txt">Bắt đầu sau 3 giây...</div>
                </div>
            `;

            let sec = 3;
            const cd = setInterval(() => {
                sec--;
                const txt = document.getElementById('arena-countdown-txt');
                if (txt && sec > 0) txt.textContent = `Bắt đầu sau ${sec} giây...`;
                if (sec <= 0) {
                    clearInterval(cd);
                    this.startRound(0);
                }
            }, 1000);
        },

        // 3. BẮT ĐẦU VÒNG ĐẤU VỚI BỘ ĐẾM 30 GIÂY
        startRound(roundIndex) {
            if (roundIndex >= this.gameState.totalRounds) {
                this.finishMatch();
                return;
            }

            this.gameState.currentRound = roundIndex;
            this.gameState.secondsLeft = this.roomConfig.timePerQuestion; // 30s
            this.gameState.p1Answer = null;
            this.gameState.p2Answer = null;
            this.gameState.p1Answered = false;
            this.gameState.p2Answered = false;
            this.gameState.roundResolved = false;

            const currentQ = this.gameState.questions[roundIndex];
            this.renderQuestionScreen(currentQ);

            // Bắt đầu đếm ngược 30s
            if (this.gameState.timerInterval) clearInterval(this.gameState.timerInterval);
            this.gameState.timerInterval = setInterval(() => {
                this.gameState.secondsLeft--;
                this.updateTimerUI();

                if (this.gameState.secondsLeft <= 0) {
                    clearInterval(this.gameState.timerInterval);
                    this.resolveRound();
                }
            }, 1000);

            // Giả lập bot đối thủ trả lời sau 4-12 giây
            if (this.gameState.isBotOpponent) {
                const bot = this.gameState.opponentProfile;
                const answerTime = Math.floor(Math.random() * (bot.speedMax - bot.speedMin + 1)) + bot.speedMin;
                setTimeout(() => {
                    if (this.gameState.currentRound === roundIndex && !this.gameState.p2Answered && !this.gameState.roundResolved) {
                        const isCorrect = Math.random() < bot.accuracy;
                        let ans = isCorrect ? currentQ.correctAnswer : (currentQ.options ? currentQ.options[1] : 'wrong');
                        this.submitOpponentAnswer(ans, 30 - this.gameState.secondsLeft);
                    }
                }, answerTime * 1000);
            }
        },

        updateTimerUI() {
            const timerEl = document.getElementById('arena-timer-num');
            const timerBox = document.getElementById('arena-timer-box');
            if (timerEl) timerEl.textContent = this.gameState.secondsLeft;
            if (timerBox) {
                if (this.gameState.secondsLeft <= 10) {
                    timerBox.classList.add('warning');
                } else {
                    timerBox.classList.remove('warning');
                }
            }
        },

        renderQuestionScreen(q) {
            const body = document.getElementById('arena-main-body');
            if (!body) return;

            const myUser = this.gameState.myProfile;
            const opp = this.gameState.opponentProfile;

            body.innerHTML = `
                <!-- SCOREBOARD -->
                <div class="arena-scoreboard">
                    <!-- Player 1 (You) -->
                    <div class="player-box">
                        <div class="player-avatar-wrap">
                            <img class="player-avatar-img" src="${myUser.avatar}" onerror="this.src='assets/images/loci_avatar.jpg'">
                            <span class="player-status-badge status-thinking" id="p1-status">Suy nghĩ</span>
                        </div>
                        <div>
                            <div class="player-name">${myUser.name}</div>
                            <div class="player-score" id="p1-score-val">${this.gameState.p1Score} đ</div>
                        </div>
                    </div>

                    <!-- Timer Center (30s) -->
                    <div class="arena-vs-col">
                        <div class="arena-timer-circle" id="arena-timer-box">
                            <span id="arena-timer-num">${this.gameState.secondsLeft}</span>
                        </div>
                        <span style="font-size: 11px; font-weight: 800; color: #64748b;">GIÂY</span>
                    </div>

                    <!-- Player 2 (Opponent) -->
                    <div class="player-box right">
                        <div class="player-avatar-wrap">
                            <img class="player-avatar-img" src="${opp.avatar}" onerror="this.src='assets/images/pets/owl_scholar.png'">
                            <span class="player-status-badge status-thinking" id="p2-status">Suy nghĩ</span>
                        </div>
                        <div>
                            <div class="player-name">${opp.name}</div>
                            <div class="player-score" id="p2-score-val">${this.gameState.p2Score} đ</div>
                        </div>
                    </div>
                </div>

                <!-- QUESTION CONTENT -->
                <div class="arena-question-card">
                    <div class="arena-round-badge">
                        <span>Câu ${this.gameState.currentRound + 1}/${this.gameState.totalRounds}</span>
                        <span>•</span>
                        <span>${q.typeLabel}</span>
                    </div>
                    
                    <div class="arena-question-text">${q.questionText}</div>

                    <!-- HIỆN VẬT / MÔ HÌNH 3D TRỰC TIẾP TRONG ĐẤU TRƯỜNG -->
                    ${q.model3d ? `
                        <div style="position: relative; margin-bottom: 16px; border-radius: 18px; overflow: hidden; border: 2px solid #38bdf8; box-shadow: 0 8px 24px rgba(2, 132, 199, 0.15);">
                            <div style="position: absolute; top: 10px; left: 12px; z-index: 2; background: rgba(15, 23, 42, 0.75); backdrop-filter: blur(8px); color: #38bdf8; font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 99px; border: 1px solid rgba(56, 189, 248, 0.4); display: flex; align-items: center; gap: 5px;">
                                <span>🏛️ Hiện vật 3D tương tác (Xoay 360°)</span>
                            </div>
                            <model-viewer class="arena-model-viewer" src="${q.model3d}" auto-rotate camera-controls shadow-intensity="1" touch-action="pan-y" 
                                style="width: 100%; height: 230px; background: radial-gradient(circle at center, #ffffff 0%, #f0f9ff 100%); display: block;" 
                                alt="Hiện vật 3D Loci"></model-viewer>
                        </div>
                    ` : (q.image ? `
                        <div style="text-align: center; margin-bottom: 16px; position: relative;">
                            <div style="display: inline-block; position: relative; border-radius: 16px; overflow: hidden; border: 1.5px solid #cbd5e1; box-shadow: 0 4px 18px rgba(0,0,0,0.08);">
                                <img src="${q.image}" style="max-height: 200px; max-width: 100%; object-fit: contain; display: block;" onerror="this.parentElement.style.display='none'">
                                <div style="position: absolute; bottom: 8px; right: 10px; background: rgba(0,0,0,0.65); color: #fff; font-size: 10.5px; font-weight: 700; padding: 2px 8px; border-radius: 99px;">
                                    Tư liệu hiện vật
                                </div>
                            </div>
                        </div>
                    ` : '')}

                    <!-- Options Area -->
                    ${q.type === 'multiple_choice' ? `
                        <div class="arena-option-list">
                            ${q.options.map((opt, i) => `
                                <button type="button" class="arena-option-btn" data-opt-idx="${i}" onclick="window.ArenaDuelEngine.selectAnswer('${this.escapeHtml(opt)}', this)">
                                    <span class="arena-option-tag">${String.fromCharCode(65 + i)}</span>
                                    <span>${opt}</span>
                                </button>
                            `).join('')}
                        </div>
                    ` : `
                        <div class="arena-input-row">
                            <input type="text" id="arena-text-ans" class="arena-type-input" placeholder="Gõ từ khóa / sự kiện chính xác..." onkeydown="if(event.key==='Enter') window.ArenaDuelEngine.submitTextAnswer()">
                            <button type="button" class="arena-type-submit" onclick="window.ArenaDuelEngine.submitTextAnswer()">Gửi Đáp Án ➔</button>
                        </div>
                    `}
                </div>
            `;
        },

        // 4. CHỌN VÀ NỘP ĐÁP ÁN
        selectAnswer(ans, btnEl) {
            if (this.gameState.p1Answered || this.gameState.roundResolved) return;
            this.gameState.p1Answered = true;
            this.gameState.p1Answer = ans;
            this.gameState.p1AnswerTime = 30 - this.gameState.secondsLeft;

            document.querySelectorAll('.arena-option-btn').forEach(b => b.disabled = true);
            if (btnEl) btnEl.classList.add('selected');

            // Cập nhật trạng thái Player 1 thành ĐÃ TRẢ LỜI
            const p1Status = document.getElementById('p1-status');
            if (p1Status) {
                p1Status.className = 'player-status-badge status-ready';
                p1Status.textContent = 'Đã chọn ⚡';
            }

            // KIỂM TRA ĐIỀU KIỆN: NẾU CẢ 2 BẠN CÙNG CHỌN RỒI THÌ KẾT THÚC VÒNG VÀ TÍNH ĐIỂM NGAY
            if (this.gameState.p1Answered && this.gameState.p2Answered) {
                if (this.gameState.timerInterval) clearInterval(this.gameState.timerInterval);
                this.resolveRound();
            }
        },

        submitTextAnswer() {
            const input = document.getElementById('arena-text-ans');
            if (!input || !input.value.trim() || this.gameState.p1Answered || this.gameState.roundResolved) return;
            this.selectAnswer(input.value.trim(), null);
        },

        submitOpponentAnswer(ans, timeTaken) {
            if (this.gameState.p2Answered || this.gameState.roundResolved) return;
            this.gameState.p2Answered = true;
            this.gameState.p2Answer = ans;
            this.gameState.p2AnswerTime = timeTaken;

            // Cập nhật trạng thái Player 2 thành ĐÃ TRẢ LỜI
            const p2Status = document.getElementById('p2-status');
            if (p2Status) {
                p2Status.className = 'player-status-badge status-ready';
                p2Status.textContent = 'Đã chọn ⚡';
            }

            // KIỂM TRA ĐIỀU KIỆN: NẾU CẢ 2 BẠN CÙNG CHỌN RỒI THÌ KẾT THÚC VÒNG VÀ TÍNH ĐIỂM NGAY
            if (this.gameState.p1Answered && this.gameState.p2Answered) {
                if (this.gameState.timerInterval) clearInterval(this.gameState.timerInterval);
                this.resolveRound();
            }
        },

        // 5. TỔNG KẾT VÒNG ĐẤU VÀ TÍNH ĐIỂM TỨC THÌ
        resolveRound() {
            if (this.gameState.roundResolved) return;
            this.gameState.roundResolved = true;

            const q = this.gameState.questions[this.gameState.currentRound];
            const p1Correct = this.isAnswerCorrect(this.gameState.p1Answer, q);
            const p2Correct = this.isAnswerCorrect(this.gameState.p2Answer, q);

            let p1RoundScore = 0;
            let p2RoundScore = 0;

            if (p1Correct) {
                const speedBonus = Math.max(0, this.gameState.secondsLeft * 2);
                p1RoundScore = 100 + speedBonus;
                this.gameState.p1Score += p1RoundScore;
            }
            if (p2Correct) {
                const speedBonus = Math.max(0, (30 - this.gameState.p2AnswerTime) * 2);
                p2RoundScore = 100 + speedBonus;
                this.gameState.p2Score += p2RoundScore;
            }

            // Highlight đáp án đúng/sai
            document.querySelectorAll('.arena-option-btn').forEach(btn => {
                const optText = btn.innerText.replace(/^[A-D]\s*/, '').trim();
                if (this.isAnswerCorrect(optText, q)) {
                    btn.classList.add('correct');
                } else if (btn.classList.contains('selected')) {
                    btn.classList.add('wrong');
                }
            });

            // Cập nhật điểm số
            const p1ScoreEl = document.getElementById('p1-score-val');
            const p2ScoreEl = document.getElementById('p2-score-val');
            if (p1ScoreEl) p1ScoreEl.textContent = this.gameState.p1Score + ' đ';
            if (p2ScoreEl) p2ScoreEl.textContent = this.gameState.p2Score + ' đ';

            // Thông báo ngắn và chuyển sang câu tiếp theo sau 2.5s
            setTimeout(() => {
                this.startRound(this.gameState.currentRound + 1);
            }, 2500);
        },

        isAnswerCorrect(userAns, q) {
            if (!userAns) return false;
            const cleanUser = userAns.toLowerCase().trim();
            const cleanTarget = (q.correctAnswer || '').toLowerCase().trim();
            if (cleanUser === cleanTarget) return true;
            if (q.alternatives && q.alternatives.some(alt => alt.toLowerCase().trim() === cleanUser)) return true;
            return false;
        },

        // 6. KẾT THÚC TRẬN ĐẤU & TRAO HUY HIỆU TRÍ NHỚ
        finishMatch() {
            const p1 = this.gameState.p1Score;
            const p2 = this.gameState.p2Score;
            const isWin = p1 > p2;
            const isDraw = p1 === p2;

            let prevWins = this.getArenaWins();
            let newWins = prevWins + (isWin ? 1 : 0);
            this.setArenaWins(newWins);
            this.incrementArenaMatches();

            // Tính toán huy hiệu đạt được
            const earnedBadge = this.getCurrentBadge(newWins);
            const isNewBadgeUnlocked = isWin && newWins === earnedBadge.winsRequired;

            // Thêm vào bảng xếp hạng local
            this.recordLeaderboardEntry(this.gameState.myProfile.name, p1, newWins);

            const body = document.getElementById('arena-main-body');
            if (!body) return;

            body.innerHTML = `
                <div class="arena-victory-card">
                    <div style="font-size: 56px; margin-bottom: 12px;">
                        ${isWin ? '🏆' : (isDraw ? '🤝' : '⚔️')}
                    </div>
                    <h2 style="font-size: 28px; font-weight: 800; color: ${isWin ? '#10b981' : (isDraw ? '#f59e0b' : '#ef4444')}; margin: 0 0 8px 0;">
                        ${isWin ? 'CHIẾN THẮNG ÁP ĐẢO!' : (isDraw ? 'TRẬN ĐẤU BẤT PHÂN THẮNG BẠI!' : 'NỖ LỰC ĐÁNG KHEN!')}
                    </h2>
                    <p style="font-size: 15px; color: #64748b; margin: 0 0 24px 0;">
                        ${isWin ? 'Bạn đã xuất sắc đánh bại đối thủ và tích lũy thêm 1 trận thắng Đấu Trường!' : 'Hãy ôn lại các mốc lịch sử chưa vững và tái đấu ngay nhé!'}
                    </p>

                    <!-- SCORE COMPARISON -->
                    <div class="arena-victory-score-row" style="display: flex; justify-content: center; align-items: center; gap: 32px; background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 20px; padding: 20px 32px; max-width: 480px; margin: 0 auto 24px auto;">
                        <div style="text-align: center;">
                            <div style="font-size: 13.5px; font-weight: 800; color: #0284c7;">BẠN</div>
                            <div style="font-size: 32px; font-weight: 900; color: #0f172a;">${p1}</div>
                        </div>
                        <div style="font-size: 24px; font-weight: 900; color: #cbd5e1;">-</div>
                        <div style="text-align: center;">
                            <div style="font-size: 13.5px; font-weight: 800; color: #64748b;">${this.gameState.opponentProfile.name}</div>
                            <div style="font-size: 32px; font-weight: 900; color: #0f172a;">${p2}</div>
                        </div>
                    </div>

                    <!-- CURRENT BADGE CARD -->
                    <div style="background: ${earnedBadge.bg}; border: 2px solid ${earnedBadge.color}; border-radius: 20px; padding: 20px; max-width: 480px; margin: 0 auto 24px auto; box-shadow: 0 8px 24px rgba(0,0,0,0.06);">
                        <div style="font-size: 44px; margin-bottom: 6px;">${earnedBadge.icon}</div>
                        <div style="font-size: 18px; font-weight: 800; color: #0f172a;">${earnedBadge.name}</div>
                        <p style="font-size: 13px; color: #334155; margin: 4px 0 10px 0;">${earnedBadge.desc}</p>
                        <div style="font-size: 12px; font-weight: 800; color: ${earnedBadge.color};">
                            Tổng số trận thắng: <strong>${newWins} trận</strong>
                        </div>
                    </div>

                    <!-- ACTIONS -->
                    <div class="arena-victory-actions" style="display: flex; justify-content: center; gap: 14px; flex-wrap: wrap;">
                        <button type="button" onclick="window.ArenaDuelEngine.startMatchmaking()"
                            style="padding: 14px 28px; background: #0284c7; color: #ffffff; border: none; border-radius: 14px; font-size: 15px; font-weight: 800; cursor: pointer; box-shadow: 0 4px 14px rgba(2, 132, 199, 0.3);">
                            Tái Đấu Trận Mới ➔
                        </button>
                        <button type="button" onclick="window.ArenaDuelEngine.renderLeaderboardView()"
                            style="padding: 14px 22px; background: #ffffff; color: #0f172a; border: 1.5px solid #cbd5e1; border-radius: 14px; font-size: 14.5px; font-weight: 700; cursor: pointer;">
                            Xem Bảng Xếp Hạng 🏆
                        </button>
                        <button type="button" onclick="window.ArenaDuelEngine.renderLobby()"
                            style="padding: 14px 22px; background: #f1f5f9; color: #475569; border: none; border-radius: 14px; font-size: 14.5px; font-weight: 700; cursor: pointer;">
                            Về Phòng Chờ
                        </button>
                    </div>
                </div>
            `;
        },

        // 7. BẢNG XẾP HẠNG ĐẤU TRƯỜNG
        renderLeaderboardView() {
            const body = document.getElementById('arena-main-body');
            if (!body) return;

            const myUser = this.getMyUser();
            const myWins = this.getArenaWins();
            const board = this.getLeaderboardData();

            body.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 12px;">
                    <div>
                        <h3 style="font-size: 22px; font-weight: 800; color: #0f172a; margin: 0 0 4px 0;">Bảng Xếp Hạng Đấu Trường Tri Thức</h3>
                        <p style="font-size: 13.5px; color: #64748b; margin: 0;">Vinh danh các cao thủ có số trận thắng và phản xạ ký ức nhanh nhất.</p>
                    </div>
                    <button type="button" onclick="window.ArenaDuelEngine.renderLobby()" 
                        style="padding: 8px 18px; background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 10px; font-size: 13px; font-weight: 700; color: #475569; cursor: pointer;">
                        ← Quay lại phòng chờ
                    </button>
                </div>

                <div style="background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 18px; overflow: hidden; margin-bottom: 24px;">
                    <table class="arena-lb-table">
                        <thead>
                            <tr>
                                <th style="width: 70px;">Thứ Hạng</th>
                                <th>Học Sinh</th>
                                <th>Huy Hiệu</th>
                                <th style="text-align: center;">Số Trận Thắng</th>
                                <th style="text-align: right;">Điểm Đấu Trường</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${board.map((u, i) => `
                                <tr class="${u.isMe ? 'highlight' : ''}">
                                    <td style="font-size: 16px; font-weight: 800; color: ${i === 0 ? '#f59e0b' : (i === 1 ? '#94a3b8' : (i === 2 ? '#cd7f32' : '#64748b'))};">
                                        ${i === 0 ? '🥇' : (i === 1 ? '🥈' : (i === 2 ? '🥉' : '#' + (i + 1)))}
                                    </td>
                                    <td>
                                        <div style="display: flex; align-items: center; gap: 10px;">
                                            <img src="${u.avatar || 'assets/images/loci_avatar.jpg'}" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover;">
                                            <span>${u.name} ${u.isMe ? '<span style="color:#0284c7; font-weight:800;">(Bạn)</span>' : ''}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span style="display: inline-flex; align-items: center; gap: 5px; font-size: 12.5px; font-weight: 700;">
                                            <span>${u.badgeIcon}</span> <span>${u.badgeName}</span>
                                        </span>
                                    </td>
                                    <td style="text-align: center; font-weight: 800; color: #0284c7;">
                                        ${u.wins} trận
                                    </td>
                                    <td style="text-align: right; font-weight: 800; color: #0f172a;">
                                        ${u.points} đ
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        },

        // NGÂN HÀNG CÂU HỎI ĐA DẠNG (TRẮC NGHIỆM, ĐIỀN KHUYẾT, MODEL 3D)
        prepareQuestions(count) {
            const raw = [];

            // 0. BỘ CÂU HỎI HIỆN VẬT & MÔ HÌNH 3D ĐẶC SẮC (MODEL 3D BATTLE)
            const model3dQuestions = [
                {
                    type: 'multiple_choice',
                    typeLabel: 'Nhận diện Hiện vật 3D',
                    questionText: 'Mô hình 3D dưới đây tái hiện khí tài lịch sử huyền thoại nào tiến vào Dinh Độc Lập trưa ngày 30/4/1975?',
                    model3d: 'assets/models/bai8/tram9/xe_tang_giai_phong_390.glb',
                    image: 'assets/images/bai6_chuan/b6_t4_giai_phong_thai_nguyen.png',
                    options: ['Xe tăng 390 húc đổ cổng Dinh Độc Lập', 'Xe tăng T-34 chiến dịch Biên giới', 'Xe bọc thép M113', 'Xe tăng 843'],
                    correctAnswer: 'Xe tăng 390 húc đổ cổng Dinh Độc Lập'
                },
                {
                    type: 'multiple_choice',
                    typeLabel: 'Hiện vật Không gian 3D',
                    questionText: 'Mô hình không gian dưới đây tái hiện địa danh lịch sử nào - nơi đồng chí Võ Nguyên Giáp đọc Quân lệnh số 1 xuất quân ngày 16/8/1945?',
                    model3d: 'assets/models/tram4/cay_da.glb',
                    image: 'assets/images/bai6_chuan/b6_t3_dinh_tan_trao.png',
                    options: ['Cây đa Tân Trào (Tuyên Quang)', 'Lán Nà Nưa', 'Đình Tân Trào', 'Đường Thái Nguyên'],
                    correctAnswer: 'Cây đa Tân Trào (Tuyên Quang)'
                },
                {
                    type: 'multiple_choice',
                    typeLabel: 'Nhận diện Hiện vật 3D',
                    questionText: 'Phương tiện vận tải thô sơ nhưng là "vũ khí bí mật" lập nên kỳ tích tiếp tế cho chiến dịch Điện Biên Phủ 1954 là gì?',
                    model3d: 'assets/models/bai7/tram7/xe_dap_tho.glb',
                    image: 'assets/images/bai7/tram7.jpg',
                    options: ['Xe đạp thồ Điện Biên Phủ', 'Xe trâu kéo lương thảo', 'Thuyền mảng vượt sông Nậm Rốm', 'Xe cút kít gỗ'],
                    correctAnswer: 'Xe đạp thồ Điện Biên Phủ'
                },
                {
                    type: 'multiple_choice',
                    typeLabel: 'Hiện vật & Nhân vật Lịch sử',
                    questionText: 'Mô hình 3D dưới đây tái hiện sự kiện lịch sử vang dội chiều ngày 7/5/1954 tại lòng chảo Mường Thanh:',
                    model3d: 'assets/models/bai7/tram9/do_cat_bi_bat.glb',
                    image: 'assets/images/bai7/tram9.jpg',
                    options: ['Tướng De Castries và toàn bộ Bộ chỉ huy Pháp bị bắt sống', 'Ký kết Hiệp định Genève', 'Bắn rơi máy bay Pháp', 'Đại tướng Võ Nguyên Giáp duyệt binh'],
                    correctAnswer: 'Tướng De Castries và toàn bộ Bộ chỉ huy Pháp bị bắt sống'
                },
                {
                    type: 'multiple_choice',
                    typeLabel: 'Hiện vật Không gian 3D',
                    questionText: 'Mô hình địa danh lịch sử dưới đây tại Hà Nội là nơi diễn ra cuộc mít tinh biến thành khởi nghĩa giành chính quyền ngày 19/8/1945:',
                    model3d: 'assets/models/tram5/mit_tinh_nha_hat_lon.glb',
                    image: 'assets/images/bai6_chuan/b6_t5_mit_tinh_nha_hat_lon.png',
                    options: ['Nhà hát Lớn Hà Nội', 'Bắc Bộ Phủ', 'Quảng trường Ba Đình', 'Tòa Thị chính'],
                    correctAnswer: 'Nhà hát Lớn Hà Nội'
                }
            ];
            model3dQuestions.forEach(mq => raw.push(mq));

            // 1. Lấy dữ liệu từ LOCI_ANCHORS (Bài 6, 7, 8)
            const anchorsObj = window.LOCI_ANCHORS || {};
            Object.keys(anchorsObj).forEach(k => {
                const lesson = anchorsObj[k];
                if (lesson && lesson.anchors) {
                    lesson.anchors.forEach(a => {
                        // Trắc nghiệm
                        if (a.quizzes && a.quizzes.length) {
                            a.quizzes.forEach(qz => {
                                raw.push({
                                    type: 'multiple_choice',
                                    typeLabel: 'Trắc nghiệm 4 lựa chọn',
                                    questionText: qz.q || qz.question,
                                    image: a.img || (a.photos && a.photos[0]) || null,
                                    options: qz.options || ['Đáp án A', 'Đáp án B', 'Đáp án C', 'Đáp án D'],
                                    correctAnswer: qz.options ? qz.options[qz.answerIndex || 0] : 'Đáp án A'
                                });
                            });
                        }
                        // Điền khuyết
                        if (a.clozes && a.clozes.length) {
                            a.clozes.forEach(cl => {
                                raw.push({
                                    type: 'cloze',
                                    typeLabel: 'Điền khuyết sự kiện',
                                    questionText: cl.sentence ? cl.sentence.replace(cl.blank, '_____') : `Điền từ còn thiếu: ${a.title}`,
                                    correctAnswer: cl.blank || 'Việt Nam',
                                    alternatives: [cl.blank]
                                });
                            });
                        }
                        // Gõ từ khóa / Model 3D
                        if (a.typeins && a.typeins.length) {
                            a.typeins.forEach(tp => {
                                raw.push({
                                    type: 'typein',
                                    typeLabel: 'Nhận diện hiện vật & Không gian',
                                    questionText: tp.q || `Hiện vật tại trạm: ${a.title}`,
                                    image: a.img || (a.photos && a.photos[0]) || null,
                                    correctAnswer: tp.target || a.title,
                                    alternatives: tp.acceptedAlternatives || []
                                });
                            });
                        }
                    });
                }
            });

            // Nếu ngân hàng chưa đủ câu, bổ sung bộ câu hỏi chuẩn THPT Quốc gia
            if (raw.length < 20) {
                raw.push(
                    {
                        type: 'multiple_choice',
                        typeLabel: 'Trắc nghiệm Lịch sử',
                        questionText: 'Đại hội Quốc dân Tân Trào (16-17/8/1945) đã cử ra cơ quan nào lãnh đạo cách mạng?',
                        options: ['Ủy ban Khởi nghĩa toàn quốc', 'Ủy ban Dân tộc giải phóng Việt Nam', 'Chính phủ Cách mạng lâm thời', 'Mặt trận Việt Minh'],
                        correctAnswer: 'Ủy ban Dân tộc giải phóng Việt Nam'
                    },
                    {
                        type: 'multiple_choice',
                        typeLabel: 'Trắc nghiệm Lịch sử',
                        questionText: 'Bản Tuyên ngôn Độc lập được Chủ tịch Hồ Chí Minh đọc tại đâu vào ngày 2/9/1945?',
                        options: ['Quảng trường Ba Đình (Hà Nội)', 'Nhà hát Lớn Hà Nội', 'Đình Tân Trào (Tuyên Quang)', 'Bến Nhà Rồng'],
                        correctAnswer: 'Quảng trường Ba Đình (Hà Nội)'
                    },
                    {
                        type: 'multiple_choice',
                        typeLabel: 'Trắc nghiệm Lịch sử',
                        questionText: 'Chiến thắng nào của quân dân ta đã đập tan tập đoàn cứ điểm mạnh nhất Đông Dương của Pháp năm 1954?',
                        options: ['Chiến dịch Điện Biên Phủ', 'Chiến dịch Biên giới Thu - Đông', 'Chiến dịch Việt Bắc', 'Chiến dịch Thượng Lào'],
                        correctAnswer: 'Chiến dịch Điện Biên Phủ'
                    },
                    {
                        type: 'multiple_choice',
                        typeLabel: 'Trắc nghiệm Lịch sử',
                        questionText: 'Hiệp định Genève năm 1954 quy định lấy vĩ tuyến nào làm giới tuyến quân sự tạm thời?',
                        options: ['Vĩ tuyến 17', 'Vĩ tuyến 16', 'Vĩ tuyến 13', 'Vĩ tuyến 18'],
                        correctAnswer: 'Vĩ tuyến 17'
                    },
                    {
                        type: 'multiple_choice',
                        typeLabel: 'Trắc nghiệm Lịch sử',
                        questionText: 'Văn kiện nào đánh dấu bước ngoặt chấm dứt sự xâm lược của đế quốc Mỹ ở Việt Nam năm 1973?',
                        options: ['Hiệp định Paris', 'Hiệp định Genève', 'Tuyên bố Potsdam', 'Hiệp ước Sơ bộ'],
                        correctAnswer: 'Hiệp định Paris'
                    }
                );
            }

            // Trộn ngẫu nhiên câu hỏi
            const shuffled = [...raw].sort(() => 0.5 - Math.random());
            return shuffled.slice(0, count);
        },

        getMyUser() {
            let name = 'Học sinh Loci';
            let avatar = 'assets/images/loci_avatar.jpg';
            try {
                const u = window.LociAccountManager ? window.LociAccountManager.getUser() : null;
                if (u && (u.displayName || u.username)) {
                    name = u.displayName || u.username;
                }
                const customAv = localStorage.getItem('loci_user_custom_avatar');
                if (customAv) avatar = customAv;
            } catch (_) {}
            return { name, avatar };
        },

        getArenaWins() {
            try {
                return parseInt(localStorage.getItem('loci_arena_wins') || '0', 10);
            } catch (_) { return 0; }
        },

        setArenaWins(val) {
            try {
                localStorage.setItem('loci_arena_wins', String(val));
            } catch (_) {}
        },

        getArenaMatches() {
            try {
                return parseInt(localStorage.getItem('loci_arena_matches') || '0', 10);
            } catch (_) { return 0; }
        },

        incrementArenaMatches() {
            try {
                const cur = this.getArenaMatches();
                localStorage.setItem('loci_arena_matches', String(cur + 1));
            } catch (_) {}
        },

        getCurrentBadge(wins) {
            let res = this.BADGE_TIERS[0];
            for (let i = 0; i < this.BADGE_TIERS.length; i++) {
                if (wins >= this.BADGE_TIERS[i].winsRequired) {
                    res = this.BADGE_TIERS[i];
                }
            }
            return res;
        },

        getLeaderboardData() {
            const myUser = this.getMyUser();
            const myWins = this.getArenaWins();
            const myBadge = this.getCurrentBadge(myWins);

            const mockTop = [
                { name: 'Nguyễn Minh Khang', school: 'Chuyên Hà Nội - Amsterdam', wins: 28, points: 3420, avatar: 'assets/images/pets/phoenix_fire.png', badgeIcon: '👑', badgeName: 'Huyền Thoại' },
                { name: 'Lê Hoàng Yến', school: 'THPT Chu Văn An', wins: 22, points: 2890, avatar: 'assets/images/pets/kirin_aura.png', badgeIcon: '👑', badgeName: 'Huyền Thoại' },
                { name: 'Trần Gia Bảo', school: 'Chuyên Lê Hồng Phong', wins: 17, points: 2150, avatar: 'assets/images/pets/tiger_speed.png', badgeIcon: '💎', badgeName: 'Đại Kiện Tướng' },
                { name: 'Vũ Đức Trọng', school: 'Chuyên Lam Sơn', wins: 12, points: 1780, avatar: 'assets/images/pets/owl_scholar.png', badgeIcon: '💎', badgeName: 'Đại Kiện Tướng' },
                { name: 'Phạm Thu Thảo', school: 'THPT Kim Liên', wins: 8, points: 1240, avatar: 'assets/images/loci_avatar.jpg', badgeIcon: '🥇', badgeName: 'Quán Quân' },
                { name: myUser.name, isMe: true, wins: myWins, points: myWins * 120, avatar: myUser.avatar, badgeIcon: myBadge.icon, badgeName: myBadge.name }
            ];

            // Sắp xếp theo số trận thắng giảm dần
            return mockTop.sort((a, b) => b.wins - a.wins);
        },

        recordLeaderboardEntry(name, points, wins) {
            // Lưu ngầm hoặc đồng bộ Firestore nếu có LociFirebase
            if (window.LociFirebase && typeof window.LociFirebase.recordArenaResult === 'function') {
                window.LociFirebase.recordArenaResult(name, points, wins).catch(() => {});
            }
        },

        escapeHtml(str) {
            return String(str)
                .replace(/&/g, '&amp;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');
        }
    };

    global.ArenaDuelEngine = ArenaDuelEngine;

    document.addEventListener('DOMContentLoaded', () => {
        ArenaDuelEngine.init();
    });

})(typeof window !== 'undefined' ? window : globalThis);

