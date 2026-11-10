// review_engine.js - Hệ thống Sinh bài tập AI & Ôn tập ngắt quãng (SM-2)

class ReviewEngine {
    constructor() {
        this.storageKey = 'loci_sm2_progress';
        this.progressData = JSON.parse(localStorage.getItem(this.storageKey)) || {};
    }

    saveProgress() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.progressData));
    }

    getApiKey() {
        return localStorage.getItem('loci_gemini_api_key');
    }
    
    getModel() {
        return localStorage.getItem('loci_gemini_model') || 'gemini-3.5-flash';
    }

    // --- SINH BÀI TẬP QUA AI ---
    async generateExercises(locusData) {
        const apiKey = this.getApiKey();
        if (!apiKey) {
            console.warn("Chưa có API key, sử dụng bài tập mặc định nếu có.");
            return { flashcards: locusData.flashcards || [], quizzes: locusData.quizzes || [] };
        }

        const model = this.getModel();
        const contentContext = `
Tiêu đề: ${locusData.name}
Tóm tắt: ${locusData.summary || locusData.details}
Chi tiết: ${locusData.detailContent || ''}
        `.trim();

        const prompt = `
Dựa vào nội dung bài học dưới đây, hãy tạo ra một bộ bài tập ôn tập. 
TUYỆT ĐỐI KHÔNG BỊA ĐẶT nội dung ngoài ngữ cảnh này.
Trích xuất dữ liệu trả về DƯỚI DẠNG ĐÚNG CHUẨN JSON (không bọc trong markdown \`\`\`json ... \`\`\`).
JSON schema:
{
    "flashcards": [
        { "front": "Câu hỏi ngắn", "back": "Đáp án ngắn" }
    ],
    "quizzes": [
        { 
            "question": "Câu hỏi trắc nghiệm?",
            "options": ["A. Sai", "B. Sai", "C. Đúng", "D. Sai"],
            "correct": 2, 
            "explanation": "Giải thích ngắn gọn tại sao C đúng."
        }
    ],
    "fillInBlanks": [
        {
            "sentence": "Sự kiện [BLANK] đánh dấu sự kết thúc của...",
            "answer": "tên sự kiện"
        }
    ]
}

Nội dung:
${contentContext}
        `;

        try {
            let aiReplyText = "";
            const isOpenRouter = apiKey.startsWith('sk-');
            
            if (isOpenRouter) {
                const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKey}`,
                        'HTTP-Referer': window.location.origin
                    },
                    body: JSON.stringify({
                        model: model,
                        messages: [{ role: 'user', content: prompt }],
                        response_format: { type: 'json_object' }
                    })
                });
                const data = await response.json();
                aiReplyText = data.choices?.[0]?.message?.content || "{}";
            } else {
                const actualModel = model.replace('google/', '');
                const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${actualModel}:generateContent?key=${apiKey}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ role: 'user', parts: [{ text: prompt }] }],
                        generationConfig: { responseMimeType: "application/json" }
                    })
                });
                const data = await response.json();
                aiReplyText = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
            }
            
            // Dọn dẹp markdown nếu API lỡ trả về
            aiReplyText = aiReplyText.replace(/^```json\s*/, '').replace(/```\s*$/, '').trim();
            const parsed = JSON.parse(aiReplyText);
            
            return {
                flashcards: parsed.flashcards || locusData.flashcards || [],
                quizzes: parsed.quizzes || locusData.quizzes || [],
                fillInBlanks: parsed.fillInBlanks || []
            };

        } catch (e) {
            console.error("Lỗi khi sinh bài tập AI:", e);
            return { flashcards: locusData.flashcards || [], quizzes: locusData.quizzes || [], fillInBlanks: [] };
        }
    }

    // --- SM-2 ALGORITHM ĐIỀU CHỈNH THEO YÊU CẦU ---
    // quality:
    //   1-2: Chưa nhớ / Quên sạch -> reset repetition, interval 0 (15 phút), xuất hiện lại nhiều lần
    //   3: Nhớ mang máng -> interval 1 ngày, xuất hiện lại sớm để củng cố
    //   4-5: Đã nhớ / Nhớ hoàn hảo -> giãn cách nhanh (3 -> 8 -> 21 ngày...), không ôn lại nhiều nữa
    // --- ĐỘNG CƠ THUẬT TOÁN SM-2 CHUẨN XÁC THEO BÁO CÁO NCKH ---
    // EF' = EF + [0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)], EF >= 1.3
    // I(1) = 1 ngày; I(2) = 3 ngày; I(n) = round(I(n-1) * EF) -> chuỗi 1, 3, 7,... ngày
    processReview(questionId, quality) {
        if (!this.progressData[questionId]) {
            this.progressData[questionId] = {
                repetitions: 0,
                interval: 0, // days
                easinessFactor: 2.5,
                nextReviewDate: Date.now(),
                lastReviewDate: Date.now(),
                lastQuality: null
            };
        }

        let item = this.progressData[questionId];
        const q = Math.max(0, Math.min(5, Number(quality) || 0));
        item.lastQuality = q;
        item.lastReviewDate = Date.now();
        item.totalAttempts = (item.totalAttempts || 0) + 1;

        // Cập nhật hệ số dễ nhớ EF theo chuẩn Piotr Woźniak
        const deltaEF = 0.1 - (5 - q) * (0.08 + (5 - q) * 0.02);
        item.easinessFactor = Math.max(1.3, Math.min(3.5, (item.easinessFactor || 2.5) + deltaEF));

        if (q >= 3) {
            // Nhớ rõ (q=5) hoặc nhớ mang máng (q=3): Lập lịch tự động 1 -> 3 -> 7,... ngày
            if (item.repetitions === 0) {
                item.interval = 1; // I(1) = 1 ngày
            } else if (item.repetitions === 1) {
                item.interval = 3; // I(2) = 3 ngày
            } else {
                // I(n) = I(n-1) * EF -> Với EF = 2.5: 3 * 2.5 = 7.5 ~ 7 ngày (Khớp chuỗi 1-3-7)
                item.interval = Math.max(item.interval + 1, Math.round(item.interval * item.easinessFactor));
            }
            item.repetitions += 1;
            item.nextReviewDate = Date.now() + item.interval * 24 * 60 * 60 * 1000;
            item.correctCount = (item.correctCount || 0) + 1;
            item.status = (q >= 4) ? 'mastered' : 'vague';
        } else {
            // Chưa nhớ (q < 3): Chuỗi bị reset, nhắc ôn lại ngày hôm sau và sau 15 phút trong phiên
            item.repetitions = 0;
            item.interval = 1; // Yêu cầu lặp lại ngày hôm sau
            item.nextReviewDate = Date.now() + 15 * 60 * 1000; // Ôn lại sau 15 phút
            item.status = 'forgotten';
        }

        this.saveProgress();
        return item;
    }

    // Xác định trạng thái ghi nhớ & trọng số xuất hiện bất chợt cho từng thẻ:
    // 1. Chưa làm: weight = 5.0 (tần suất nhiều nhất)
    // 2. Chưa nhớ: weight = 4.0 (tần suất cao để lặp lại)
    // 3. Nhớ mang máng: weight = 2.5 (xuất hiện bất chợt để củng cố)
    // 4. Đã nhớ: weight = 0 (trong hạn không xuất hiện lại; nếu quá hạn nhiều ngày chỉ 0.25 để nhắc nhẹ)
    getCardRecallState(questionId) {
        const item = this.progressData[questionId];
        if (!item || item.totalAttempts === 0 || item.lastQuality === null) {
            return {
                status: 'unattempted',
                weight: 5.0,
                label: 'Chưa làm',
                badgeText: 'Chưa làm · Ưu tiên cao nhất',
                interval: 0,
                repetitions: 0
            };
        }

        const now = Date.now();
        const isPastDue = now >= item.nextReviewDate;

        if (item.lastQuality >= 4) {
            // Đã nhớ: Nếu chưa đến hạn thì trọng số = 0 (tuyệt đối không làm phiền)
            // Nếu đã quá hạn hơn 7 ngày thì trọng số nhỏ 0.25
            const overdueDays = (now - item.nextReviewDate) / (24 * 60 * 60 * 1000);
            const weight = (isPastDue && overdueDays > 7) ? 0.25 : 0;
            return {
                status: 'mastered',
                weight: weight,
                label: 'Đã nhớ vững',
                badgeText: weight > 0 ? 'Đã nhớ · Nhắc nhẹ' : 'Đã nhớ · Giãn cách dài',
                interval: item.interval,
                repetitions: item.repetitions
            };
        }

        if (item.lastQuality === 3) {
            // Nhớ mang máng: Trọng số 2.5, ưu tiên xuất hiện lại để củng cố
            return {
                status: 'vague',
                weight: 2.5,
                label: 'Nhớ mang máng',
                badgeText: 'Mang máng · Hỏi củng cố',
                interval: item.interval,
                repetitions: item.repetitions
            };
        }

        // Chưa nhớ (lastQuality < 3)
        // Trọng số 4.0, tần suất cao
        return {
            status: 'forgotten',
            weight: 4.0,
            label: 'Chưa nhớ',
            badgeText: 'Chưa nhớ · Lặp lại ngay',
            interval: item.interval,
            repetitions: item.repetitions
        };
    }

    isDue(questionId) {
        if (!this.progressData[questionId]) return true; // Chưa làm bao giờ
        return Date.now() >= this.progressData[questionId].nextReviewDate;
    }

    getStats(questionId) {
        return this.progressData[questionId] || null;
    }

    // --- RENDER UI THẺ ÔN TẬP ---
    openReviewUI(exercises, locusTitle) {
        // Collect all questions
        let allQuestions = [];
        if (exercises.flashcards) {
            exercises.flashcards.forEach((f, i) => allQuestions.push({ type: 'flashcard', data: f, id: `fc_${locusTitle}_${i}` }));
        }
        if (exercises.quizzes) {
            exercises.quizzes.forEach((q, i) => allQuestions.push({ type: 'quiz', data: q, id: `qz_${locusTitle}_${i}` }));
        }
        if (exercises.fillInBlanks) {
            exercises.fillInBlanks.forEach((b, i) => allQuestions.push({ type: 'blank', data: b, id: `fb_${locusTitle}_${i}` }));
        }
        if (exercises.typeins) {
            exercises.typeins.forEach((t, i) => allQuestions.push({ type: 'typein', data: t, id: `ti_${locusTitle}_${i}` }));
        }

        if (allQuestions.length === 0) {
            alert("Không tìm thấy bài tập nào cho mốc này.");
            return;
        }

        // Create overlay if not exists
        let overlay = document.getElementById('loci-review-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'loci-review-overlay';
            Object.assign(overlay.style, {
                position: 'fixed', top: '0', left: '0', width: '100vw', height: '100vh',
                backgroundColor: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(10px)',
                zIndex: '10000', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: "'Inter', sans-serif", color: '#fff'
            });
            document.body.appendChild(overlay);
        }
        
        let currentIndex = 0;
        
        const renderCurrentQuestion = () => {
            if (currentIndex >= allQuestions.length) {
                overlay.innerHTML = `
                    <div style="background: rgba(255,255,255,0.1); padding: 40px; border-radius: 20px; text-align: center; border: 1px solid rgba(255,255,255,0.2);">
                        <h2 style="font-size: 24px; color: #10b981; margin-bottom: 20px;">Hoàn thành xuất sắc!</h2>
                        <p style="margin-bottom: 30px;">Bạn đã ôn tập xong các mốc kiến thức này.</p>
                        <button id="rv-close-btn" style="padding: 12px 24px; border-radius: 99px; border: none; background: #3b82f6; color: white; cursor: pointer; font-weight: bold;">Đóng</button>
                    </div>
                `;
                document.getElementById('rv-close-btn').onclick = () => overlay.remove();
                return;
            }

            const q = allQuestions[currentIndex];
            const stats = this.getStats(q.id);
            const streak = stats ? stats.correctCount : 0;
            const repInfo = stats && stats.repetitions > 0 ? `<div style="font-size:12px; opacity:0.6; margin-bottom: 10px;">Đã ôn: ${stats.repetitions} lần | Mức nhớ: ${stats.easinessFactor.toFixed(1)}</div>` : '';

            let contentHTML = '';

            if (q.type === 'flashcard') {
                contentHTML = `
                    <div id="rv-fc-card" style="perspective: 1000px; width: 100%; height: 250px; cursor: pointer; margin-bottom: 20px;">
                        <div id="rv-fc-inner" style="width: 100%; height: 100%; transition: transform 0.6s; transform-style: preserve-3d; position: relative;">
                            <!-- Mặt trước -->
                            <div style="position: absolute; width: 100%; height: 100%; backface-visibility: hidden; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.2); border-radius: 16px; display: flex; align-items: center; justify-content: center; padding: 20px; text-align: center; font-size: 20px;">
                                <div>
                                    <div style="font-size: 14px; opacity: 0.5; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 1px;">Câu hỏi (Bấm để lật)</div>
                                    ${q.data.front}
                                </div>
                            </div>
                            <!-- Mặt sau -->
                            <div style="position: absolute; width: 100%; height: 100%; backface-visibility: hidden; background: rgba(59, 130, 246, 0.15); border: 1px solid rgba(59, 130, 246, 0.4); border-radius: 16px; display: flex; align-items: center; justify-content: center; padding: 20px; text-align: center; font-size: 18px; transform: rotateY(180deg);">
                                <div>
                                    <div style="font-size: 14px; opacity: 0.5; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 1px;">Đáp án</div>
                                    ${q.data.back}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="rv-feedback" style="display: none; gap: 10px; justify-content: center;">
                        <button class="rv-rate-btn" data-quality="1" style="background:#ef4444; border:none; padding:10px 15px; border-radius:8px; color:white; cursor:pointer;">Quên sạch</button>
                        <button class="rv-rate-btn" data-quality="3" style="background:#f59e0b; border:none; padding:10px 15px; border-radius:8px; color:white; cursor:pointer;">Nhớ mang máng</button>
                        <button class="rv-rate-btn" data-quality="5" style="background:#10b981; border:none; padding:10px 15px; border-radius:8px; color:white; cursor:pointer;">Nhớ hoàn hảo</button>
                    </div>
                `;
            } else if (q.type === 'quiz') {
                let optionsHtml = '';
                q.data.options.forEach((opt, idx) => {
                    optionsHtml += `<button class="rv-quiz-opt" data-idx="${idx}" style="display:block; width:100%; padding:15px; margin-bottom:10px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.2); border-radius:12px; color:white; text-align:left; cursor:pointer; transition: 0.2s;">${opt}</button>`;
                });
                
                contentHTML = `
                    <div style="font-size: 14px; opacity: 0.5; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 1px;">Trắc nghiệm</div>
                    <div style="font-size: 20px; margin-bottom: 25px;">${q.data.question}</div>
                    <div>${optionsHtml}</div>
                    <div id="rv-explanation" style="display:none; margin-top: 20px; padding: 15px; background: rgba(59, 130, 246, 0.15); border-radius: 12px; border: 1px solid rgba(59, 130, 246, 0.4); font-size: 15px;">
                        ${q.data.explanation || 'Không có giải thích chi tiết.'}
                    </div>
                    <button id="rv-next-btn" style="display:none; margin-top: 20px; padding: 12px 24px; border-radius: 99px; border: none; background: #3b82f6; color: white; cursor: pointer; font-weight: bold; width: 100%;">Tiếp tục ➔</button>
                `;
            } else if (q.type === 'blank') {
                // Điền từ vào chỗ trống
                contentHTML = `
                    <div style="font-size: 14px; opacity: 0.5; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 1px;">Điền từ</div>
                    <div style="font-size: 20px; margin-bottom: 25px; line-height: 1.6;">
                        ${q.data.sentence.replace(/\[BLANK\]/g, '<input type="text" id="rv-blank-input" style="background:transparent; border:none; border-bottom: 2px solid #3b82f6; color:#60a5fa; font-size:20px; outline:none; text-align:center; width: 150px; margin: 0 5px;" placeholder="...">')}
                    </div>
                    <button id="rv-check-blank-btn" style="padding: 12px 24px; border-radius: 99px; border: none; background: #3b82f6; color: white; cursor: pointer; font-weight: bold; width: 100%;">Kiểm tra</button>
                    <div id="rv-blank-result" style="display:none; margin-top: 20px; font-size: 18px;"></div>
                    <button id="rv-next-btn" style="display:none; margin-top: 20px; padding: 12px 24px; border-radius: 99px; border: none; background: #3b82f6; color: white; cursor: pointer; font-weight: bold; width: 100%;">Tiếp tục ➔</button>
                `;
            } else if (q.type === 'typein') {
                // Gõ đáp án chính xác
                contentHTML = `
                    <div style="font-size: 14px; opacity: 0.5; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 1px;">Gõ đáp án</div>
                    <div style="font-size: 20px; margin-bottom: 20px;">${q.data.prompt || q.data.question}</div>
                    <input type="text" id="rv-typein-input" style="width:100%; box-sizing:border-box; padding:12px 16px; border-radius:12px; background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.3); color:#fff; font-size:16px; margin-bottom:15px; outline:none;" placeholder="Gõ câu trả lời..." />
                    <button id="rv-check-typein-btn" style="padding: 12px 24px; border-radius: 99px; border: none; background: #3b82f6; color: white; cursor: pointer; font-weight: bold; width: 100%;">Kiểm tra</button>
                    <div id="rv-typein-result" style="display:none; margin-top: 15px; padding: 14px; border-radius: 12px; background: rgba(255,255,255,0.06); font-size: 15px;"></div>
                    <button id="rv-next-btn" style="display:none; margin-top: 20px; padding: 12px 24px; border-radius: 99px; border: none; background: #3b82f6; color: white; cursor: pointer; font-weight: bold; width: 100%;">Tiếp tục ➔</button>
                `;
            }

            overlay.innerHTML = `
                <div style="background: rgba(30, 41, 59, 0.95); width: 90%; max-width: 500px; padding: 35px; border-radius: 24px; border: 1px solid rgba(255,255,255,0.15); position: relative; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);">
                    <button id="rv-close-top" style="position: absolute; top: 15px; right: 20px; background: transparent; border: none; color: white; font-size: 24px; cursor: pointer; opacity: 0.5;">✕</button>
                    <div style="margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 15px;">
                        <span style="font-weight: bold; color: #60a5fa;">Ôn Tập: ${locusTitle}</span>
                        <span style="font-size: 14px; opacity: 0.6;">Câu ${currentIndex + 1}/${allQuestions.length}</span>
                    </div>
                    ${repInfo}
                    ${contentHTML}
                </div>
            `;

            document.getElementById('rv-close-top').onclick = () => overlay.remove();

            // Handle Interactions
            if (q.type === 'flashcard') {
                let isFlipped = false;
                const fcCard = document.getElementById('rv-fc-card');
                const fcInner = document.getElementById('rv-fc-inner');
                const feedbackDiv = document.getElementById('rv-feedback');
                
                fcCard.onclick = () => {
                    if (isFlipped) return; // Only flip once
                    isFlipped = true;
                    fcInner.style.transform = 'rotateY(180deg)';
                    setTimeout(() => {
                        feedbackDiv.style.display = 'flex';
                    }, 400);
                };

                document.querySelectorAll('.rv-rate-btn').forEach(btn => {
                    btn.onclick = (e) => {
                        const quality = parseInt(e.currentTarget.dataset.quality);
                        this.processReview(q.id, quality);
                        currentIndex++;
                        renderCurrentQuestion();
                    };
                });
            } else if (q.type === 'quiz') {
                const nextBtn = document.getElementById('rv-next-btn');
                const expl = document.getElementById('rv-explanation');
                let answered = false;
                
                document.querySelectorAll('.rv-quiz-opt').forEach(btn => {
                    btn.onclick = (e) => {
                        if (answered) return;
                        answered = true;
                        const selectedIdx = parseInt(e.currentTarget.dataset.idx);
                        const isCorrect = selectedIdx === q.data.correct;
                        
                        if (isCorrect) {
                            e.currentTarget.style.background = 'rgba(16, 185, 129, 0.2)';
                            e.currentTarget.style.borderColor = '#10b981';
                            this.processReview(q.id, 5); // perfect
                        } else {
                            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
                            e.currentTarget.style.borderColor = '#ef4444';
                            // Show correct one
                            document.querySelector(`.rv-quiz-opt[data-idx="${q.data.correct}"]`).style.borderColor = '#10b981';
                            this.processReview(q.id, 1); // wrong
                        }
                        
                        expl.style.display = 'block';
                        nextBtn.style.display = 'block';
                    };
                });
                
                nextBtn.onclick = () => {
                    currentIndex++;
                    renderCurrentQuestion();
                };
            } else if (q.type === 'blank') {
                const checkBtn = document.getElementById('rv-check-blank-btn');
                const nextBtn = document.getElementById('rv-next-btn');
                const resultDiv = document.getElementById('rv-blank-result');
                const input = document.getElementById('rv-blank-input');
                
                if (input) input.focus();

                checkBtn.onclick = () => {
                    const userAns = input.value.trim().toLowerCase();
                    const correctAns = q.data.answer.toLowerCase();
                    
                    if (userAns === correctAns || correctAns.includes(userAns) && userAns.length > 2) {
                        resultDiv.innerHTML = '<span style="color:#10b981; font-weight:700;">Chính xác!</span> (' + q.data.answer + ')';
                        this.processReview(q.id, 5);
                    } else {
                        resultDiv.innerHTML = '<span style="color:#ef4444; font-weight:700;">Sai.</span> Đáp án đúng: <b>' + q.data.answer + '</b>';
                        this.processReview(q.id, 1);
                    }
                    
                    resultDiv.style.display = 'block';
                    checkBtn.style.display = 'none';
                    nextBtn.style.display = 'block';
                    input.disabled = true;
                };

                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') checkBtn.click();
                });

                nextBtn.onclick = () => {
                    currentIndex++;
                    renderCurrentQuestion();
                };
            } else if (q.type === 'typein') {
                const checkBtn = document.getElementById('rv-check-typein-btn');
                const nextBtn = document.getElementById('rv-next-btn');
                const resultDiv = document.getElementById('rv-typein-result');
                const input = document.getElementById('rv-typein-input');

                if (input) input.focus();

                checkBtn.onclick = () => {
                    const typed = input.value.trim();
                    const checker = window.LociFlashcardFormats?.checkTypeInAnswer;
                    const res = checker 
                        ? checker(typed, q.data.answer, q.data.accepted || [])
                        : { score: 100, status: 'exact', title: 'Hoàn tất', target: q.data.answer, recommendedGrade: 5 };

                    const isOk = res.score >= 50;
                    this.processReview(q.id, res.recommendedGrade || (isOk ? 5 : 1));

                    resultDiv.innerHTML = `
                        <div style="font-weight:bold; color:${res.status === 'exact' ? '#4ade80' : res.status === 'close' ? '#facc15' : '#f87171'}; margin-bottom:6px;">
                            ${res.title}
                        </div>
                        <div style="opacity:0.8; margin-bottom:4px;">Bạn đã gõ: <i>${typed || '(Trống)'}</i></div>
                        <div>Đáp án chuẩn: <b style="color:#60a5fa;">${q.data.answer}</b></div>
                    `;

                    resultDiv.style.display = 'block';
                    checkBtn.style.display = 'none';
                    nextBtn.style.display = 'block';
                    input.disabled = true;
                };

                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') checkBtn.click();
                });

                nextBtn.onclick = () => {
                    currentIndex++;
                    renderCurrentQuestion();
                };
            }
        };

        renderCurrentQuestion();
    }
}

// Instantiate globally to avoid module import headaches in non-module scripts
window.reviewEngine = new ReviewEngine();
