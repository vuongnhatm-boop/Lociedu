/**
 * ══════════════════════════════════════════════════════════════════════════════
 * SPATIAL ACTIVE RECALL MODE (CHẾ ĐỘ ÔN TẬP KÝ ỨC KHÔNG GIAN CAO CẤP)
 * ──────────────────────────────────────────────────────────────────────────────
 * - Ôn tập tuần tự từng Phần 1, 2, 3... tương ứng với từng ý kiến thức & ảnh tư liệu.
 * - Ẩn 100% nội dung SGK chuẩn, chỉ hiển thị mốc 3D + ảnh tư liệu gợi nhớ.
 * - Giao diện thẻ kiểm tra rộng rãi, thoáng đãng, chống rung giật đường nối SVG.
 * - AI chấm điểm mượt mà với hiệu ứng quét nhận thức (Cognitive Scanning) 450ms.
 * - Khi hoàn thành mốc: Đổi màu mốc 3D sang Xanh lục và mở đường sang trạm tiếp theo.
 * ══════════════════════════════════════════════════════════════════════════════
 */

(function () {
  'use strict';

  function normalizeText(text) {
    if (!text) return '';
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s\d]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * CHẤM ĐIỂM NGỮ NGHĨA CHO TỪNG PHẦN KIẾN THỨC RIÊNG BIỆT (Step-by-Step Evaluator)
   * Sử dụng LociSemanticEvaluator chuẩn SGK Chủ đề 3 hoặc thuật toán nâng cao nội tại
   */
  function evaluateStepRecall(userRawText, targetPointText, locus) {
    if (window.LociSemanticEvaluator && typeof window.LociSemanticEvaluator.evaluateStepRecall === 'function') {
      return window.LociSemanticEvaluator.evaluateStepRecall(userRawText, targetPointText, locus);
    }
    if (window.LociFlashcardFormats && typeof window.LociFlashcardFormats.evaluateStepRecall === 'function') {
      return window.LociFlashcardFormats.evaluateStepRecall(userRawText, targetPointText, locus);
    }

    if (!userRawText || userRawText.trim().length === 0) {
      return {
        score: 0,
        passed: false,
        grade: 'Chưa nhập nội dung',
        gradeColor: '#ef4444',
        matched: [],
        missing: ['Bạn cần viết nội dung kiến thức của phần này để AI đánh giá.'],
        feedback: 'Hãy viết các sự kiện, mốc thời gian, địa danh, nhân vật hoặc ý nghĩa mà bạn nhớ.'
      };
    }

    // Fallback: Nếu LociSemanticEvaluator chưa nạp kịp, chuẩn hóa tự động
    const cleanNorm = (str) => {
      if (!str) return '';
      return String(str).toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').replace(/[–—]/g, '-').replace(/[^\w\s\d]/g, ' ').replace(/\s+/g, ' ').trim();
    };

    const normUser = cleanNorm(userRawText);
    const cleanTarget = targetPointText.replace(/^[•\-\s\d\.]+/, '').trim();
    const normTarget = cleanNorm(cleanTarget);

    // Chuẩn hóa ngày tháng & năm
    const rawDates = cleanTarget.match(/\b\d{1,2}[\/\-\.\s–—]+\d{1,2}([\/\-\.\s–—]+\d{4})?\b/g) || [];
    let dateScore = 0;
    const matchedDates = [];
    const missingDates = [];

    rawDates.forEach(d => {
      const cleanD = d.replace(/[\-\.\s–—]+/g, '/');
      const parts = cleanD.split('/');
      let hit = normUser.includes(parts.slice(0, 2).join(' ')) || normUser.includes(cleanD) || normUser.includes(parts.slice(0, 2).join('/'));
      if (hit) {
        dateScore += 35;
        matchedDates.push('Thời gian: ' + d);
      } else {
        missingDates.push('Mốc thời gian: ' + d);
      }
    });

    const targetWords = normTarget.split(' ').filter(w => w.length > 2);
    const uniqueWords = [...new Set(targetWords)];
    const stopWords = ['cua', 'va', 'la', 'cac', 'nhung', 'cho', 'trong', 'duoc', 'voi', 'mot', 'ngay', 'thang', 'nam', 'sau', 'khi', 'de', 'den', 'ra', 'co', 'da'];
    const meaningfulWords = uniqueWords.filter(w => !stopWords.includes(w));

    let hitWordsCount = 0;
    meaningfulWords.forEach(w => {
      if (normUser.includes(w)) hitWordsCount++;
    });

    const coverage = meaningfulWords.length > 0 ? (hitWordsCount / meaningfulWords.length) : 0;
    let finalScore = Math.min(100, Math.round(dateScore + (coverage * 65)));
    if (hitWordsCount >= 4 && dateScore > 0) finalScore = Math.max(finalScore, 85);
    if (hitWordsCount >= 2 && dateScore > 0) finalScore = Math.max(finalScore, 75);

    const passed = finalScore >= 50;
    let grade = passed ? (finalScore >= 85 ? 'Xuất sắc — Vượt qua phần này! 🌟' : 'Tốt — Đủ điểm qua phần này! 👍') : 'Chưa đủ điểm để qua (Cần >= 50%) ❌';
    let gradeColor = passed ? (finalScore >= 85 ? '#10b981' : '#06b6d4') : '#ef4444';

    return {
      score: finalScore,
      passed: passed,
      grade: grade,
      gradeColor: gradeColor,
      matched: matchedDates,
      missing: missingDates,
      feedback: passed ? 'Nắm vững ý chính lịch sử!' : 'Hãy đọc kỹ lại mốc thời gian và chi tiết sự kiện.'
    };
  }

  const STYLES = `
    #spatial-recall-mode-indicator {
      position: fixed;
      top: 16px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 2147483640;
      background: rgba(11, 18, 33, 0.94);
      border: 1.5px solid #f59e0b;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.7), 0 0 25px rgba(245, 158, 11, 0.35);
      border-radius: 99px;
      padding: 7px 22px;
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      display: flex;
      align-items: center;
      gap: 12px;
      color: #ffffff;
      font-size: 13px;
      font-weight: 700;
      pointer-events: auto;
      user-select: none;
      animation: fadeInDown 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }

    @keyframes fadeInDown {
      from { transform: translate(-50%, -20px); opacity: 0; }
      to { transform: translate(-50%, 0); opacity: 1; }
    }

    /* ĐỊNH DẠNG CHUYÊN BIỆT CHO THẺ KIỂM TRA: THOÁNG ĐÃNG, RỘNG RÃI, KHÔNG GIẬT KHỰNG */
    body.spatial-recall-active #bdt-step-card {
      width: 480px !important;
      max-width: 44vw !important;
      flex-direction: column !important;
      align-items: stretch !important;
      padding: 22px 24px !important;
      border-radius: 22px !important;
      background: rgba(11, 18, 33, 0.96) !important;
      backdrop-filter: blur(32px) saturate(200%) !important;
      -webkit-backdrop-filter: blur(32px) saturate(200%) !important;
      border: 1.5px solid rgba(245, 158, 11, 0.55) !important;
      box-shadow: 0 25px 70px rgba(0, 0, 0, 0.8), 0 0 35px rgba(245, 158, 11, 0.22) !important;
      animation: none !important;
      transition: border-color 0.25s ease, box-shadow 0.25s ease !important;
      cursor: default !important;
    }
    body.spatial-recall-active #bdt-step-card:hover {
      transform: none !important;
      border-color: rgba(245, 158, 11, 0.8) !important;
    }
    body.spatial-recall-active .bdt-step-badge,
    body.spatial-recall-active .bdt-step-icon {
      display: none !important;
    }
    body.spatial-recall-active .bdt-step-text {
      width: 100% !important;
      flex: initial !important;
    }

    body.spatial-recall-active #bdt-keyword-box {
      display: none !important;
      visibility: hidden !important;
      pointer-events: none !important;
    }

    .bdt-step-dot.passed-step {
      background: #10b981 !important;
      box-shadow: 0 0 8px #10b981 !important;
    }

    /* HIỆU ỨNG AI QUÉT TRI THỨC VÀ KẾT QUẢ TRƯỢT MƯỢT */
    @keyframes aiScanPulse {
      0%, 100% { opacity: 0.6; transform: scale(0.98); }
      50% { opacity: 1; transform: scale(1.02); }
    }
    .ai-scanning-state {
      animation: aiScanPulse 0.9s infinite ease-in-out !important;
      pointer-events: none !important;
    }

    @keyframes recallFadeInUp {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .recall-eval-card {
      animation: recallFadeInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) both;
    }
  `;

  const state = {
    active: false,
    history: {} // { [locusId]: { passedSteps: Set(), stepScores: {}, stepTexts: {} } }
  };

  function injectStyles() {
    if (!document.getElementById('spatial-recall-styles')) {
      const style = document.createElement('style');
      style.id = 'spatial-recall-styles';
      style.textContent = STYLES;
      document.head.appendChild(style);
    }
  }

  function getLocusHistory(locusId) {
    if (!state.history[locusId]) {
      state.history[locusId] = {
        passedSteps: new Set(),
        stepScores: {},
        stepTexts: {}
      };
    }
    return state.history[locusId];
  }

  function updateMarker3DColor(locusId, isAllPassed) {
    if (!window.marker3DObjects || marker3DObjects.length === 0) return;
    const targetMarker = marker3DObjects.find(m => m.userData && (m.userData.id === locusId || (m.userData.locus && m.userData.locus.id === locusId)));
    if (!targetMarker) return;

    let targetHex = isAllPassed ? 0x10b981 : 0xf59e0b;

    targetMarker.traverse(c => {
      if (c.isMesh && c.material) {
        if (c.name === 'diamond' || c.name === 'pedestalRim' || c.name === 'glowRing') {
          c.material.color.setHex(targetHex);
          if (c.material.emissive) c.material.emissive.setHex(targetHex);
        }
      }
    });
  }

  function toggleSpatialRecallMode() {
    const isNowActive = state.active || window.isSpatialRecallMode || (document.body && document.body.classList.contains('spatial-recall-active'));
    if (isNowActive) {
      exitSpatialRecallMode();
    } else {
      enterSpatialRecallMode();
    }
  }

  function enterSpatialRecallMode() {
    injectStyles();
    state.active = true;
    window.isSpatialRecallMode = true;
    document.body.classList.add('spatial-recall-active');

    let ind = document.getElementById('spatial-recall-mode-indicator');
    if (!ind) {
      ind = document.createElement('div');
      ind.id = 'spatial-recall-mode-indicator';
      document.body.appendChild(ind);
    }
    ind.innerHTML = `
      <span style="background:#f59e0b; color:#0f172a; font-size:11px; font-weight:800; padding:2px 8px; border-radius:99px;">ÔN TẬP</span>
      <span>🎯 Chế độ Ôn tập: Đang bật. Nhập kiến thức lần lượt từng Phần 1, 2, 3... để qua mốc!</span>
      <a href="de_thi.html" style="background:linear-gradient(135deg, #6366f1, #4f46e5); color:#fff; text-decoration:none; border-radius:99px; padding:3px 12px; font-size:11px; font-weight:700; display:inline-flex; align-items:center; gap:4px; box-shadow:0 2px 8px rgba(79,70,229,0.35);" title="Vào Phòng thi chuẩn THPT Quốc Gia (28 câu · 50 phút)">📝 Đề thi THPT</a>
      <button onclick="window.SpatialRecallMode.toggle()" style="background:rgba(255,255,255,0.12); border:1px solid rgba(255,255,255,0.25); color:#cbd5e1; border-radius:99px; padding:2px 10px; font-size:11px; cursor:pointer;">Thoát [R]</button>
    `;

    const toggleBtn = document.getElementById('btn-spatial-recall-toggle');
    if (toggleBtn) {
      toggleBtn.innerHTML = '<span>🎯</span><span>Chế độ Ôn tập: ĐANG BẬT</span>';
      toggleBtn.style.background = 'linear-gradient(135deg, #10b981, #06b6d4)';
      toggleBtn.style.borderColor = '#10b981';
    }

    // Nếu đang mở mốc thì re-render ngay lập tức theo chế độ ôn tập
    const curLocus = (typeof currentActiveLocus !== 'undefined' && currentActiveLocus) || window.currentActiveLocus;
    if (curLocus) {
      const step = (typeof window.bdtCurrentStep !== 'undefined') ? window.bdtCurrentStep : 0;
      if (typeof window.renderRecallInStepCard === 'function') {
        window.renderRecallInStepCard(curLocus, step);
      } else if (typeof window.renderBrownStep === 'function') {
        window.renderBrownStep(step);
      }
    }
  }

  function exitSpatialRecallMode() {
    state.active = false;
    window.isSpatialRecallMode = false;
    document.body.classList.remove('spatial-recall-active');

    const ind = document.getElementById('spatial-recall-mode-indicator');
    if (ind) ind.remove();

    const toggleBtn = document.getElementById('btn-spatial-recall-toggle');
    if (toggleBtn) {
      toggleBtn.innerHTML = '<span>🎯</span><span>Ôn tập Ký ức [R]</span>';
      toggleBtn.style.background = 'linear-gradient(135deg, rgba(2, 132, 199, 0.95), rgba(6, 182, 212, 0.95))';
      toggleBtn.style.borderColor = '#00f2fe';
    }

    // Khôi phục lại hiển thị bài học bình thường
    const curLocus = (typeof currentActiveLocus !== 'undefined' && currentActiveLocus) || window.currentActiveLocus;
    if (curLocus && typeof window.renderBrownStep === 'function') {
      const step = (typeof window.bdtCurrentStep !== 'undefined') ? window.bdtCurrentStep : 0;
      window.renderBrownStep(step);
    }
  }

  function goToNextStation(currentLocusId) {
    if (typeof closeBrownSpatialDualTabs === 'function') closeBrownSpatialDualTabs();
    const loci = (typeof lociList !== 'undefined' && Array.isArray(lociList)) ? lociList : [];
    const currentIdx = loci.findIndex(l => l.id === currentLocusId);
    const nextIdx = currentIdx + 1;

    if (nextIdx < loci.length) {
      const nextLocus = loci[nextIdx];
      if (typeof smoothGlideToLocus === 'function') {
        smoothGlideToLocus(nextLocus);
      }
      setTimeout(() => {
        if (typeof openLocusModal === 'function') {
          openLocusModal(nextLocus);
        }
      }, 1200);
    } else {
      if (typeof window.showCustomDialog === 'function') {
        window.showCustomDialog({
          type: 'success',
          title: 'Hoàn Thành Tất Cả Các Mốc!',
          icon: '🏆',
          badge: 'XUẤT SẮC 100%',
          message: '🎉 Chúc mừng bạn đã hoàn thành xuất sắc toàn bộ các mốc ký ức trong bài học này!\n- Ký ức không gian đã được củng cố vững chắc vào Hồi hải mã.\n- Giờ hãy thử sức ngay với Đề thi chuẩn THPT Quốc Gia (28 câu) để kiểm tra toàn diện kiến thức!',
          confirmText: 'Vào Phòng thi THPT ➔',
          onConfirm: () => { window.location.href = 'de_thi.html'; }
        });
      } else {
        alert('🎉 Chúc mừng bạn đã hoàn thành ôn tập tất cả các mốc trong không gian! Hãy vào Đề thi THPT để kiểm tra toàn diện.');
        window.location.href = 'de_thi.html';
      }
    }
  }

  // ────────────────────────────────────────────────────────────────────────────
  // 3. PUBLIC API
  // ────────────────────────────────────────────────────────────────────────────
  window.SpatialRecallMode = {
    toggle: toggleSpatialRecallMode,
    start: enterSpatialRecallMode,
    close: exitSpatialRecallMode,
    isActive: () => !!(state.active || window.isSpatialRecallMode),
    evaluateStepRecall,
    getLocusHistory,
    updateMarker3DColor,
    goToNextStation
  };

  window.addEventListener('keydown', (e) => {
    if (e.code === 'KeyR' || e.key === 'r' || e.key === 'R') {
      if (document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA' || document.activeElement.isContentEditable)) {
        return;
      }
      e.preventDefault();
      toggleSpatialRecallMode();
    }
  });

  console.log('✅ [SpatialRecallMode] Đã nạp thành công Chế độ Ôn tập từng phần 1, 2, 3...! Phím tắt [R]');
})();
