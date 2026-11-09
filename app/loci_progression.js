// ═══════════════════════════════════════════════════════════════════════════════
// LOCI PROGRESSION SYSTEM — HỆ THỐNG KHÓA & MỞ TIẾN TRÌNH HỌC TẬP TUẦN TỰ
// DỰ ÁN: CUNG ĐIỆN KÍ ỨC LOCI EDU (CHỦ ĐỀ 3 LỊCH SỬ 12)
// QUY TẮC BẮT BUỘC: 
// 1. Phải hoàn thành Bài 6 (Trạm 3D >= 7/9 + Ôn Flashcard + Đề trắc nghiệm >= 70%) mới mở Bài 7
// 2. Phải hoàn thành Bài 7 mới mở Bài 8
// ═══════════════════════════════════════════════════════════════════════════════

(function(window) {
    const STORAGE_KEY = 'loci_study_progression';

    const LESSON_ORDER = ['bai_6', 'bai_7', 'bai_8'];
    const LESSON_TITLES = {
        bai_6: 'Bài 6: Cách mạng tháng Tám năm 1945',
        bai_7: 'Bài 7: Kháng chiến chống thực dân Pháp (1945 - 1954)',
        bai_8: 'Bài 8: Kháng chiến chống Mỹ cứu nước (1954 - 1975)'
    };

    function getDefaultProgression() {
        return {
            bai_6: {
                unlocked: true,
                stationsVisited: [],
                flashcardsReviewed: false,
                quizScore: null,
                quizPassed: false,
                completed: false
            },
            bai_7: {
                unlocked: false,
                stationsVisited: [],
                flashcardsReviewed: false,
                quizScore: null,
                quizPassed: false,
                completed: false
            },
            bai_8: {
                unlocked: false,
                stationsVisited: [],
                flashcardsReviewed: false,
                quizScore: null,
                quizPassed: false,
                completed: false
            }
        };
    }

    function getProgression() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                const def = getDefaultProgression();
                return {
                    bai_6: Object.assign({}, def.bai_6, parsed.bai_6 || {}),
                    bai_7: Object.assign({}, def.bai_7, parsed.bai_7 || {}),
                    bai_8: Object.assign({}, def.bai_8, parsed.bai_8 || {})
                };
            }
        } catch (_) {}
        return getDefaultProgression();
    }

    function saveProgression(prog) {
        try {
            // Đánh giá hoàn thành Bài 6
            const b6 = prog.bai_6;
            const b6StationsOk = (b6.stationsVisited && b6.stationsVisited.length >= 7);
            const b6CardsOk = !!b6.flashcardsReviewed;
            const b6QuizOk = (b6.quizPassed || (b6.quizScore != null && b6.quizScore >= 70));
            b6.completed = b6StationsOk && b6CardsOk && b6QuizOk;
            if (b6.completed) {
                prog.bai_7.unlocked = true;
            }

            // Đánh giá hoàn thành Bài 7
            const b7 = prog.bai_7;
            const b7StationsOk = (b7.stationsVisited && b7.stationsVisited.length >= 7);
            const b7CardsOk = !!b7.flashcardsReviewed;
            const b7QuizOk = (b7.quizPassed || (b7.quizScore != null && b7.quizScore >= 70));
            b7.completed = b7StationsOk && b7CardsOk && b7QuizOk;
            if (b7.completed) {
                prog.bai_8.unlocked = true;
            }

            localStorage.setItem(STORAGE_KEY, JSON.stringify(prog));

            // Kích hoạt event để các component khác lắng nghe
            if (typeof window.dispatchEvent === 'function') {
                window.dispatchEvent(new CustomEvent('loci_progression_updated', { detail: prog }));
            }
        } catch (e) {
            console.warn('[LociProgression] Lỗi lưu tiến trình:', e);
        }
    }

    const LociProgression = {
        getProgression,
        
        isLessonUnlocked(lessonId) {
            if (lessonId === 'bai_6') return true;
            const prog = getProgression();
            return !!(prog[lessonId] && prog[lessonId].unlocked);
        },

        isLessonCompleted(lessonId) {
            const prog = getProgression();
            return !!(prog[lessonId] && prog[lessonId].completed);
        },

        getLessonStatus(lessonId) {
            const prog = getProgression();
            const p = prog[lessonId] || {
                unlocked: lessonId === 'bai_6',
                stationsVisited: [],
                flashcardsReviewed: false,
                quizScore: null,
                quizPassed: false,
                completed: false
            };

            const stationsCount = (p.stationsVisited || []).length;
            const isStationsDone = stationsCount >= 7;
            const isFlashcardsDone = !!p.flashcardsReviewed;
            const isQuizDone = !!p.quizPassed || (p.quizScore != null && p.quizScore >= 70);
            const isCompleted = isStationsDone && isFlashcardsDone && isQuizDone;

            return {
                id: lessonId,
                title: LESSON_TITLES[lessonId] || lessonId,
                unlocked: !!p.unlocked || lessonId === 'bai_6',
                completed: isCompleted,
                stationsCount,
                stationsTarget: 7,
                stationsTotal: 9,
                isStationsDone,
                isFlashcardsDone,
                quizScore: p.quizScore,
                isQuizDone
            };
        },

        hasUserAnyStudyActivity() {
            try {
                const prog = getProgression();
                return Object.values(prog).some(p => 
                    (p.stationsVisited && p.stationsVisited.length > 0) ||
                    p.flashcardsReviewed ||
                    (p.quizScore != null && p.quizScore > 0)
                );
            } catch (_) {
                return false;
            }
        },

        recordStationVisit(lessonId, stationId) {
            if (!lessonId || !stationId) return;
            const prog = getProgression();
            if (!prog[lessonId]) return;
            prog[lessonId].stationsVisited = prog[lessonId].stationsVisited || [];
            if (!prog[lessonId].stationsVisited.includes(stationId)) {
                prog[lessonId].stationsVisited.push(stationId);
                saveProgression(prog);
                console.log(`[LociProgression] Đã ghi nhận trạm ${stationId} (${prog[lessonId].stationsVisited.length}/9)`);
            }
        },

        recordFlashcardReviewed(lessonId) {
            if (!lessonId) return;
            const prog = getProgression();
            if (!prog[lessonId]) return;
            prog[lessonId].flashcardsReviewed = true;
            saveProgression(prog);
            console.log(`[LociProgression] Đã ghi nhận hoàn thành ôn thẻ nhớ cho ${lessonId}`);
        },

        recordQuizScore(lessonId, scorePercent) {
            if (!lessonId) return;
            const prog = getProgression();
            if (!prog[lessonId]) return;
            const score = Math.round(Number(scorePercent) || 0);
            prog[lessonId].quizScore = Math.max(prog[lessonId].quizScore || 0, score);
            if (prog[lessonId].quizScore >= 70) {
                prog[lessonId].quizPassed = true;
            }
            saveProgression(prog);
            console.log(`[LociProgression] Đã ghi nhận điểm kiểm tra cho ${lessonId}: ${score}% (Đạt: ${prog[lessonId].quizPassed})`);
        },

        showLockedModal(targetLessonId, onContinue) {
            const existing = document.getElementById('loci-progression-lock-modal');
            if (existing) existing.remove();

            const idx = LESSON_ORDER.indexOf(targetLessonId);
            const reqLessonId = idx > 0 ? LESSON_ORDER[idx - 1] : 'bai_6';
            const reqStatus = this.getLessonStatus(reqLessonId);

            const targetTitle = LESSON_TITLES[targetLessonId] || targetLessonId;
            const reqTitle = LESSON_TITLES[reqLessonId] || reqLessonId;

            const modal = document.createElement('div');
            modal.id = 'loci-progression-lock-modal';
            modal.style.cssText = `
                position: fixed; inset: 0; z-index: 100060;
                background: rgba(15, 23, 42, 0.65);
                backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
                display: flex; align-items: center; justify-content: center;
                padding: 16px; font-family: 'Outfit', sans-serif;
                animation: lociLockFade 0.25s ease forwards;
            `;

            modal.innerHTML = `
                <div style="background: rgba(255, 255, 255, 0.95); border: 1.5px solid rgba(255,255,255,0.8); border-radius: 24px; max-width: 500px; width: 100%; padding: 26px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.35); text-align: left; color: #0f172a;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
                        <span style="display: inline-flex; align-items: center; gap: 6px; padding: 4px 12px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 99px; color: #dc2626; font-size: 12px; font-weight: 800;">
                            <span>🔒</span> BÀI HỌC CHƯA MỞ KHÓA
                        </span>
                        <button id="lock-modal-close" style="background:none; border:none; color:#94a3b8; font-size:18px; cursor:pointer; padding:4px;">✕</button>
                    </div>

                    <h3 style="font-size: 18px; font-weight: 800; color: #0f172a; margin: 0 0 8px;">
                        ${targetTitle}
                    </h3>
                    <p style="font-size: 13.5px; color: #475569; margin: 0 0 18px; line-height: 1.5;">
                        Để mở khóa bài này, theo lộ trình Cung điện Ký ức Loci, bạn cần hoàn thành đầy đủ 3 điều kiện của <strong>${reqTitle}</strong>:
                    </p>

                    <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 22px;">
                        <!-- ĐIỀU KIỆN 1: TRẠM 3D -->
                        <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; background: ${reqStatus.isStationsDone ? '#f0fdf4' : '#f8fafc'}; border: 1px solid ${reqStatus.isStationsDone ? '#bbf7d0' : '#e2e8f0'}; border-radius: 14px;">
                            <div style="display: flex; align-items: center; gap: 10px;">
                                <span style="font-size: 16px;">${reqStatus.isStationsDone ? '✅' : '⏳'}</span>
                                <div>
                                    <div style="font-size: 13px; font-weight: 700; color: #0f172a;">Khám phá các trạm không gian 3D/360</div>
                                    <div style="font-size: 11.5px; color: #64748b;">Đã khám phá ${reqStatus.stationsCount}/9 trạm (Yêu cầu tối thiểu: 7/9)</div>
                                </div>
                            </div>
                            <span style="font-size: 12px; font-weight: 800; color: ${reqStatus.isStationsDone ? '#16a34a' : '#ea580c'};">
                                ${reqStatus.isStationsDone ? 'ĐẠT' : `${reqStatus.stationsCount}/7`}
                            </span>
                        </div>

                        <!-- ĐIỀU KIỆN 2: THẺ FLASHCARD -->
                        <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; background: ${reqStatus.isFlashcardsDone ? '#f0fdf4' : '#f8fafc'}; border: 1px solid ${reqStatus.isFlashcardsDone ? '#bbf7d0' : '#e2e8f0'}; border-radius: 14px;">
                            <div style="display: flex; align-items: center; gap: 10px;">
                                <span style="font-size: 16px;">${reqStatus.isFlashcardsDone ? '✅' : '⏳'}</span>
                                <div>
                                    <div style="font-size: 13px; font-weight: 700; color: #0f172a;">Ôn luyện thẻ nhớ Flashcard</div>
                                    <div style="font-size: 11.5px; color: #64748b;">Hoàn thành tối thiểu 1 phiên luyện tập theo SM-2</div>
                                </div>
                            </div>
                            <span style="font-size: 12px; font-weight: 800; color: ${reqStatus.isFlashcardsDone ? '#16a34a' : '#ea580c'};">
                                ${reqStatus.isFlashcardsDone ? 'ĐẠT' : 'CHƯA'}
                            </span>
                        </div>

                        <!-- ĐIỀU KIỆN 3: BÀI TẬP TRẮC NGHIỆM -->
                        <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; background: ${reqStatus.isQuizDone ? '#f0fdf4' : '#f8fafc'}; border: 1px solid ${reqStatus.isQuizDone ? '#bbf7d0' : '#e2e8f0'}; border-radius: 14px;">
                            <div style="display: flex; align-items: center; gap: 10px;">
                                <span style="font-size: 16px;">${reqStatus.isQuizDone ? '✅' : '⏳'}</span>
                                <div>
                                    <div style="font-size: 13px; font-weight: 700; color: #0f172a;">Làm bài tập / đề thi trắc nghiệm</div>
                                    <div style="font-size: 11.5px; color: #64748b;">Điểm số đạt từ 70% trở lên (Hiện tại: ${reqStatus.quizScore != null ? reqStatus.quizScore + '%' : 'Chưa thi'})</div>
                                </div>
                            </div>
                            <span style="font-size: 12px; font-weight: 800; color: ${reqStatus.isQuizDone ? '#16a34a' : '#ea580c'};">
                                ${reqStatus.isQuizDone ? 'ĐẠT' : (reqStatus.quizScore != null ? reqStatus.quizScore + '%' : 'CHƯA')}
                            </span>
                        </div>
                    </div>

                    <div style="display: flex; gap: 10px;">
                        <button id="lock-modal-btn-action" style="flex: 1; padding: 12px 18px; border-radius: 12px; background: linear-gradient(135deg, #0284c7, #38bdf8); color: #fff; font-size: 13.5px; font-weight: 800; border: none; cursor: pointer; box-shadow: 0 4px 14px rgba(2,132,199,0.35);">
                            👉 Vào hoàn thành ${reqTitle.split(':')[0]} ngay
                        </button>
                    </div>
                </div>
            `;

            document.body.appendChild(modal);

            modal.querySelector('#lock-modal-close').onclick = () => modal.remove();
            modal.onclick = (e) => { if (e.target === modal) modal.remove(); };

            modal.querySelector('#lock-modal-btn-action').onclick = () => {
                modal.remove();
                if (typeof onContinue === 'function') {
                    onContinue(reqLessonId);
                } else if (typeof window.selectLessonTab === 'function') {
                    window.selectLessonTab(reqLessonId);
                }
            };
        }
    };

    window.LociProgression = LociProgression;
})(typeof window !== 'undefined' ? window : global);
