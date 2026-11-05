// ═══════════════════════════════════════════════════════════════
// FLASHCARD FORMATS & ADVANCED RETRIEVAL ENGINE
// Dự án: Cung Điện Kí Ức Loci VR — Ôn thi Lịch Sử 12
// Hỗ trợ đa dạng hình thức:
// 1. Classic Flashcard (Thẻ 2 mặt truyền thống)
// 2. Reversed Card (Hỏi-đáp đảo hai chiều)
// 3. Type-in (Gõ đáp án chính xác bằng bàn phím)
// 4. Cloze Deletion (Điền khuyết giữ ngữ cảnh)
// 5. Quiz (Trắc nghiệm nhận diện phương án)
// ═══════════════════════════════════════════════════════════════

(function(global) {
  'use strict';

  // Chuẩn hóa văn bản tiếng Việt để so khớp câu trả lời
  function normalizeText(str) {
    if (!str) return '';
    return String(str)
      .toLowerCase()
      .trim()
      .normalize('NFC')
      .replace(/[.,/#!$%^&*;:{}=\-_`~()?"'<>]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  // Hàm bỏ dấu tiếng Việt để so khớp linh hoạt
  function removeVietnameseDiacritics(str) {
    if (!str) return '';
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D');
  }

  function cleanNorm(str) {
    return normalizeText(removeVietnameseDiacritics(str));
  }

  const HISTORICAL_ALIASES = [
    ['hiroshima', 'hi ro si ma', 'hi-ro-si-ma', 'hi rô si ma'],
    ['nagasaki', 'na ga xa ki', 'na-ga-xa-ki', 'na ga sa ki'],
    ['quan lenh so 1', 'quan lenh 1', 'quan lenh so mot', 'quan lenh 01'],
    ['uy ban khoi nghia toan quoc', 'uy ban khoi nghia'],
    ['15/8/1945', '15-8-1945', '15/8', '15 8 1945', '15 thang 8', '15 thang 8 nam 1945'],
    ['bac giang hai duong ha tinh quang nam', 'bac hai ha quang', 'bac giang, hai duong, ha tinh, quang nam'],
    ['dai hoi quoc dan tan trao', 'dai hoi quoc dan', 'tan trao'],
    ['hoi nghi toan quoc cua dang', 'hoi nghi toan quoc'],
    ['nha hat lon ha noi', 'nha hat lon', 'quang truong nha hat lon'],
    ['tuyen ngon doc lap', 'quang truong ba dinh', 'ba dinh', '2/9/1945', '2 9 1945', '2-9-1945']
  ];

  const STOPWORDS = new Set(['và', 'các', 'những', 'ở', 'tại', 'trong', 'của', 'được', 'là', 'vào', 'về', 'cho', 'một', 'này', 'đó', 'ngay', 'thang', 'nam', 'va']);

  // Thuật toán so khớp câu trả lời học sinh đã gõ với đáp án chuẩn
  function checkTypeInAnswer(typed, target, acceptedList = [], hint = '') {
    const normTyped = normalizeText(typed);
    const normTarget = normalizeText(target);
    const cleanTyped = cleanNorm(typed);
    const cleanTarget = cleanNorm(target);

    const rawAccepted = [target, ...(acceptedList || []), hint].filter(Boolean);
    const allAccepted = rawAccepted.map(normalizeText);
    const allCleanAccepted = rawAccepted.map(cleanNorm);

    if (!normTyped) {
      return {
        score: 0,
        status: 'wrong',
        title: 'Chưa nhập câu trả lời',
        typed: typed || '(Bỏ trống)',
        target: target,
        recommendedGrade: 1
      };
    }

    // 1. Khớp hoàn toàn (Exact Match)
    if (allAccepted.some(acc => acc === normTyped) || allCleanAccepted.some(acc => acc === cleanTyped)) {
      return {
        score: 100,
        status: 'exact',
        title: '🎯 Chính xác 100%!',
        typed: typed,
        target: target,
        recommendedGrade: 5
      };
    }

    // 2. Tra cứu nhóm từ đồng nghĩa / bí danh lịch sử (Historical Aliases)
    for (const group of HISTORICAL_ALIASES) {
      const hasTyped = group.some(alias => cleanTyped.includes(cleanNorm(alias)));
      const hasTarget = group.some(alias => cleanTarget.includes(cleanNorm(alias)));
      if (hasTyped && hasTarget) {
        return {
          score: 100,
          status: 'exact',
          title: '🎯 Chính xác 100%!',
          typed: typed,
          target: target,
          recommendedGrade: 5
        };
      }
    }

    // 3. Chứa toàn bộ câu trả lời chấp nhận được hoặc đáp án chứa từ khoá người dùng gõ
    if (allCleanAccepted.some(acc => acc && (cleanTyped.includes(acc) || (acc.includes(cleanTyped) && cleanTyped.length >= 3)))) {
      return {
        score: 95,
        status: 'exact',
        title: '🎯 Rất chính xác!',
        typed: typed,
        target: target,
        recommendedGrade: 5
      };
    }

    // 4. Kiểm tra từ khóa then chốt (Token overlap sau khi loại bỏ stopwords)
    const filterTokens = (s) => s.split(' ').filter(w => w.length > 1 && !STOPWORDS.has(w));
    const targetTokens = filterTokens(cleanTarget);
    const typedTokens = filterTokens(cleanTyped);

    let matchedCount = 0;
    typedTokens.forEach(token => {
      if (targetTokens.includes(token)) matchedCount++;
    });

    const overlapRatio = targetTokens.length > 0 ? (matchedCount / targetTokens.length) : 0;

    // Nếu gõ được >= 35% từ khóa cốt lõi hoặc trùng ít nhất 2 từ khóa chính
    if (overlapRatio >= 0.35 || matchedCount >= 2) {
      return {
        score: Math.round(Math.max(overlapRatio * 100, 85)),
        status: 'close',
        title: '⚡ Nắm rất vững ý chính!',
        typed: typed,
        target: target,
        recommendedGrade: 5
      };
    }

    // 5. Sai hoặc chưa nhớ
    return {
      score: Math.round(overlapRatio * 100),
      status: 'wrong',
      title: '❌ Chưa chính xác',
      typed: typed,
      target: target,
      recommendedGrade: 1
    };
  }

  // Ngân hàng câu hỏi được quản lý thống nhất và chuẩn hóa trực tiếp từ 9 mốc neo (anchors) của mỗi bài
  const CURATED_CARDS = {
    bai_6: { typein: [], cloze: [] },
    bai_7: { typein: [], cloze: [] },
    bai_8: { typein: [], cloze: [] },
    bai_9: { typein: [], cloze: [] }
  };

  // Hàm sinh bộ câu hỏi đa dạng (FC thường, Đảo chiều, Gõ đáp án, Điền khuyết, Trắc nghiệm)
  function buildDiverseQuestionsForLesson(lesson) {
    if (!lesson) return [];
    const out = [];
    const lessonKey = lesson.id;
    const curated = CURATED_CARDS[lessonKey] || {};

    // 1. Thêm các thẻ Gõ đáp án (Type-in) chọn lọc
    if (curated.typein) {
      curated.typein.forEach(c => {
        out.push({
          id: c.id,
          type: 'typein',
          lessonTitle: lesson.title,
          data: {
            prompt: c.prompt,
            answer: c.answer,
            accepted: c.accepted || [],
            hint: c.hint || ''
          }
        });
      });
    }

    // 2. Thêm các thẻ Điền khuyết (Cloze) chọn lọc
    if (curated.cloze) {
      curated.cloze.forEach(c => {
        out.push({
          id: c.id,
          type: 'cloze',
          lessonTitle: lesson.title,
          data: {
            sentence: c.sentence,
            blank: c.blank,
            fullText: c.fullText
          }
        });
      });
    }

    // 3. Trích xuất trực tiếp từ các mốc neo của bài học (anchors)
    (lesson.anchors || []).forEach(a => {
      const typeinsList = (Array.isArray(a.typeins) && a.typeins.length > 0) ? a.typeins : ((a.quizTypes && Array.isArray(a.quizTypes.typeins)) ? a.quizTypes.typeins : []);
      const clozesList = (Array.isArray(a.clozes) && a.clozes.length > 0) ? a.clozes : ((a.quizTypes && Array.isArray(a.quizTypes.clozes)) ? a.quizTypes.clozes : []);
      const reversedsList = (Array.isArray(a.reverseds) && a.reverseds.length > 0) ? a.reverseds : ((a.quizTypes && Array.isArray(a.quizTypes.reverseds)) ? a.quizTypes.reverseds : []);

      // 3.1 Gõ đáp án (Typein) từ mốc neo
      if (typeinsList.length > 0) {
        typeinsList.forEach((ti, i) => {
          const prompt = ti.prompt || ti.question;
          const ans = ti.answer;
          out.push({
            id: `${a.id}_typein_${i}`,
            type: 'typein',
            anchorTitle: a.title,
            lessonTitle: lesson.title,
            data: {
              prompt: prompt,
              answer: ans,
              accepted: ti.accepted || [ans],
              hint: ti.hint || a.title
            }
          });
        });
      }

      // 3.2 Điền khuyết (Cloze) từ mốc neo
      if (clozesList.length > 0) {
        clozesList.forEach((cz, i) => {
          const text = cz.text || cz.sentence || '';
          const blank = (cz.blanks && cz.blanks[0]) || cz.hidden || cz.blank || '';
          const sentence = text.includes('{') ? text.replace(/\{([^}]+)\}/g, '[BLANK]') : text;
          const fullText = text.replace(/[{}]/g, '');
          out.push({
            id: `${a.id}_cloze_${i}`,
            type: 'cloze',
            anchorTitle: a.title,
            lessonTitle: lesson.title,
            data: {
              sentence: sentence,
              blank: blank,
              fullText: fullText
            }
          });
        });
      }

      // 3.3 Hỏi-đáp đảo chiều (Reversed) từ mốc neo
      if (reversedsList.length > 0) {
        reversedsList.forEach((rv, i) => {
          const qText = rv.reversedQuestion || rv.reverseQ || rv.front || `Fact: ${rv.fact}\n⇄ Đây là đặc trưng gắn liền với sự kiện nào?`;
          const aText = rv.answer || rv.back || rv.fact;
          out.push({
            id: `${a.id}_rev_${i}`,
            type: 'reversed',
            anchorTitle: a.title,
            lessonTitle: lesson.title,
            data: {
              front: qText,
              back: aText,
              mnemonic: rv.mnemonic || a.mnemonic || rv.hint || ''
            }
          });
        });
      }

      // 3.4 Flashcards truyền thống & Flashcards đảo chiều bổ trợ
      (a.flashcards || []).forEach((f, i) => {
        // Classic Flashcard
        out.push({
          id: `${a.id}_fc${i}`,
          type: 'fc',
          anchorTitle: a.title,
          lessonTitle: lesson.title,
          data: {
            front: f.front,
            back: f.back,
            mnemonic: a.mnemonic || ''
          }
        });

        // Nếu anchor chưa có reversed chuyên biệt thì tự sinh
        if (reversedsList.length === 0) {
          const firstBackLine = f.back.split('\n')[0].replace(/^[①②③④⑤\d\.\-\s]+/, '').trim();
          const reversedPrompt = `Nội dung cốt lõi: "${firstBackLine}"\n⇄ Đây là câu trả lời / đặc trưng gắn liền với sự kiện nào?`;
          out.push({
            id: `${a.id}_rev_gen_${i}`,
            type: 'reversed',
            anchorTitle: a.title,
            lessonTitle: lesson.title,
            data: {
              front: reversedPrompt,
              back: f.front,
              mnemonic: a.mnemonic || ''
            }
          });
        }
      });

      // 3.5 Trắc nghiệm (Quiz)
      (a.quizzes || []).forEach((q, i) => {
        out.push({
          id: `${a.id}_qz${i}`,
          type: 'quiz',
          anchorTitle: a.title,
          lessonTitle: lesson.title,
          data: q
        });
      });
    });

    return out;
  }

  // Xuất API ra môi trường trình duyệt và Node.js
  const LociFlashcardFormats = {
    normalizeText,
    checkTypeInAnswer,
    buildDiverseQuestionsForLesson,
    CURATED_CARDS
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = LociFlashcardFormats;
  }
  if (typeof window !== 'undefined') {
    window.LociFlashcardFormats = LociFlashcardFormats;
  }
})(typeof window !== 'undefined' ? window : globalThis);
