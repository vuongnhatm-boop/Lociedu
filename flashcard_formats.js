// ═══════════════════════════════════════════════════════════════
// FLASHCARD FORMATS & ADVANCED RETRIEVAL ENGINE
// Dự án: Cung Điện Kí Ức Loci VR — Ôn thi Lịch Sử 12
// Hỗ trợ đa dạng hình thức:
// 1. Classic Flashcard (Thẻ 2 mặt truyền thống)
// 2. Reversed Card (Hỏi-đáp đảo hai chiều)
// 3. Type-in (Gõ đáp án chính xác bằng bàn phím)
// 4. Cloze Deletion (Điền khuyết giữ ngữ cảnh)
// 5. Quiz (Trắc nghiệm nhận diện phương án)
// Kèm Bộ Não Chấm Điểm AI Ngữ Nghĩa Lịch Sử (Loci Semantic Evaluator)
// ═══════════════════════════════════════════════════════════════

(function(global) {
  'use strict';

  // 1. XỬ LÝ VĂN BẢN VÀ DẤU TIẾNG VIỆT
  function removeVietnameseDiacritics(str) {
    if (!str) return '';
    return String(str)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D');
  }

  function normalizeText(str) {
    if (!str) return '';
    return String(str)
      .toLowerCase()
      .trim()
      .normalize('NFC')
      .replace(/[–—]/g, '-') // Chuẩn hóa gạch ngang en-dash, em-dash thành dấu nối
      .replace(/[.,/#!$%^&*;:{}=\_`~()?"'<>•+\[\]]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function cleanNorm(str) {
    return normalizeText(removeVietnameseDiacritics(str));
  }

  // 2. CHUẨN HÓA MỐC THỜI GIAN, TÊN RIÊNG & TỪ SỐ THÀNH DẠNG QUY CHUẨN
  function canonicalizeHistoricalText(str) {
    if (!str) return '';
    // Chuẩn hóa bỏ dấu trước để các regex boundary (\b) hoạt động chuẩn xác 100%
    let s = ' ' + removeVietnameseDiacritics(str).toLowerCase()
      .replace(/[–—]/g, '-')
      .replace(/\s+/g, ' ') + ' ';

    // Tháng bằng chữ sang số
    s = s.replace(/\bthang\s+muoi\s+hai\b/gi, 'thang 12');
    s = s.replace(/\bthang\s+muoi\s+mot\b/gi, 'thang 11');
    s = s.replace(/\bthang\s+muoi\b/gi, 'thang 10');
    s = s.replace(/\bthang\s+chin\b/gi, 'thang 9');
    s = s.replace(/\bthang\s+tam\b/gi, 'thang 8');
    s = s.replace(/\bthang\s+bay\b/gi, 'thang 7');
    s = s.replace(/\bthang\s+sau\b/gi, 'thang 6');
    s = s.replace(/\bthang\s+nam\b/gi, 'thang 5');
    s = s.replace(/\bthang\s+tu\b|\bthang\s+bon\b/gi, 'thang 4');
    s = s.replace(/\bthang\s+ba\b/gi, 'thang 3');
    s = s.replace(/\bthang\s+hai\b/gi, 'thang 2');
    s = s.replace(/\bthang\s+mot\b/gi, 'thang 1');

    // Ngày bằng chữ sang số (có hoặc không có chữ 'ngày')
    s = s.replace(/\b(?:ngay\s+)?ba\s+muoi\b/gi, ' ngay 30 ');
    s = s.replace(/\b(?:ngay\s+)?hai\s+muoi\s+bay\b/gi, ' ngay 27 ');
    s = s.replace(/\b(?:ngay\s+)?hai\s+muoi\s+lam\b/gi, ' ngay 25 ');
    s = s.replace(/\b(?:ngay\s+)?hai\s+muoi\s+ba\b/gi, ' ngay 23 ');
    s = s.replace(/\b(?:ngay\s+)?hai\s+muoi\s+mot\b/gi, ' ngay 21 ');
    s = s.replace(/\b(?:ngay\s+)?muoi\s+chin\b/gi, ' ngay 19 ');
    s = s.replace(/\b(?:ngay\s+)?muoi\s+tam\b/gi, ' ngay 18 ');
    s = s.replace(/\b(?:ngay\s+)?muoi\s+bay\b/gi, ' ngay 17 ');
    s = s.replace(/\b(?:ngay\s+)?muoi\s+sau\b/gi, ' ngay 16 ');
    s = s.replace(/\b(?:ngay\s+)?muoi\s+lam\b/gi, ' ngay 15 ');
    s = s.replace(/\b(?:ngay\s+)?muoi\s+bon\b/gi, ' ngay 14 ');
    s = s.replace(/\b(?:ngay\s+)?muoi\s+ba\b/gi, ' ngay 13 ');
    s = s.replace(/\b(?:ngay\s+)?muoi\s+hai\b/gi, ' ngay 12 ');
    s = s.replace(/\b(?:ngay\s+)?chin\b/gi, ' ngay 9 ');
    s = s.replace(/\b(?:ngay\s+)?tam\b/gi, ' ngay 8 ');
    s = s.replace(/\b(?:ngay\s+)?bay\b/gi, ' ngay 7 ');
    s = s.replace(/\b(?:ngay\s+)?sau\b/gi, ' ngay 6 ');
    s = s.replace(/\b(?:ngay\s+)?tu\b|\b(?:ngay\s+)?bon\b/gi, ' ngay 4 ');
    s = s.replace(/\b(?:ngay\s+)?ba\b/gi, ' ngay 3 ');
    s = s.replace(/\b(?:ngay\s+)?hai\b|\bmung\s+hai\b/gi, ' ngay 2 ');
    s = s.replace(/\b(?:ngay\s+)?mot\b|\bmung\s+mot\b/gi, ' ngay 1 ');

    // Giờ và phút: 17 giờ 30 phút, 17 giờ 30, 17h30, 17:30 -> 17h30
    s = s.replace(/(\d{1,2})\s*(?:gio|g|h)\s*(\d{1,2})(?:\s*phut)?/gi, '$1h$2');
    s = s.replace(/(\d{1,2}):(\d{2})/g, '$1h$2');

    // Ngày tháng năm: ngày 15 tháng 8 năm 1945 -> 15/8/1945
    s = s.replace(/(?:ngay\s*)?(\d{1,2})\s*[\/\-\s]\s*(?:thang\s*)?(\d{1,2})\s*[\/\-\s]\s*(?:nam\s*)?(\d{4})/gi, ' $1/$2/$3 ');
    // Ngày tháng: ngày 15 tháng 8 -> 15/8
    s = s.replace(/(?:ngay\s*)?(\d{1,2})\s*[\/\-\s]\s*(?:thang\s*)(\d{1,2})/gi, ' $1/$2 ');
    // Tháng năm: tháng 8 năm 1945 -> 8/1945
    s = s.replace(/(?:thang\s*)(\d{1,2})\s*[\/\-\s]\s*(?:nam\s*)(\d{4})/gi, ' $1/$2 ');

    // Dấu gạch nối hoặc chấm: 30 - 4 - 1975 -> 30/4/1975
    s = s.replace(/(\d{1,2})\s*[\-\.]\s*(\d{1,2})\s*[\-\.]\s*(\d{4})/g, ' $1/$2/$3 ');
    s = s.replace(/(\d{1,2})\s*[\-\.]\s*(\d{1,2})/g, ' $1/$2 ');

    // Phiên âm danh nhân, địa danh, vũ khí & hiệp định
    s = s.replace(/do\s*ca\s*[-–—\s]*xt[oơ]\s*[-–—\s]*ri|de\s*castries|do\s*caxtri|do\s*cat/gi, 'do ca-xto-ri');
    s = s.replace(/hi\s*[-–—\s]*r[oô]\s*[-–—\s]*si\s*[-–—\s]*ma/gi, 'hiroshima');
    s = s.replace(/na\s*[-–—\s]*ga\s*[-–—\s]*[sx]a\s*[-–—\s]*ki/gi, 'nagasaki');
    s = s.replace(/gi[oơ]\s*[-–—\s]*ne\s*[-–—\s]*v[oơ]|geneva|geneve/gi, 'gio-ne-vo');
    s = s.replace(/b\s*[-–—\s]*52/gi, 'b52');
    s = s.replace(/pari|paris/gi, 'paris');
    s = s.replace(/na\s*[-–—\s]*va|navarre/gi, 'nava');
    s = s.replace(/\bdbp\b/gi, 'dien bien phu');

    return s.replace(/\s+/g, ' ').trim();
  }

  function extractDatesAndTimes(text) {
    const canon = canonicalizeHistoricalText(text);
    const dates = [];
    const times = [];
    const years = [];

    // Ngày đầy đủ D/M/Y
    const fullDateRegex = /\b(\d{1,2})\/(\d{1,2})\/(\d{4})\b/g;
    let match;
    while ((match = fullDateRegex.exec(canon)) !== null) {
      const fullStr = `${parseInt(match[1])}/${parseInt(match[2])}/${match[3]}`;
      const shortStr = `${parseInt(match[1])}/${parseInt(match[2])}`;
      dates.push({
        full: fullStr,
        short: shortStr,
        year: match[3]
      });
      if (!years.includes(match[3])) years.push(match[3]);
    }

    // Ngày ngắn D/M (nếu không phải là một phần của D/M/Y)
    const shortDateRegex = /\b(\d{1,2})\/(\d{1,2})\b/g;
    while ((match = shortDateRegex.exec(canon)) !== null) {
      const after = canon.slice(shortDateRegex.lastIndex);
      if (!after.startsWith('/')) {
        const shortStr = `${parseInt(match[1])}/${parseInt(match[2])}`;
        if (!dates.some(d => d.short === shortStr)) {
          dates.push({
            full: null,
            short: shortStr,
            year: null
          });
        }
      }
    }

    // Năm độc lập (1945, 1954, 1975...)
    const yearRegex = /\b(19\d{2})\b/g;
    while ((match = yearRegex.exec(canon)) !== null) {
      if (!years.includes(match[1])) {
        years.push(match[1]);
      }
    }

    // Giờ phút (11h30, 17h30)
    const timeRegex = /\b(\d{1,2}h\d{2})\b/g;
    while ((match = timeRegex.exec(canon)) !== null) {
      if (!times.includes(match[1])) {
        times.push(match[1]);
      }
    }

    return { dates, times, years, canon };
  }

  // 3. TỪ ĐIỂN CỤM TRI THỨC LỊCH SỬ CHUẨN SGK CHỦ ĐỀ 3 (BÀI 6, 7, 8)
  const HISTORICAL_KNOWLEDGE_CLUSTERS = [
    // BÀI 6: CÁCH MẠNG THÁNG TÁM 1945
    {
      id: 'nhat_dau_hang',
      terms: ['nhat dau hang', 'nhat ban dau hang', 'nhat dau hang dong minh', 'dau hang khong dieu kien', 'dau hang vo dieu kien', 'nhat hoang dau hang'],
      keyKeywords: [['nhat', 'dau hang'], ['dau hang', 'dong minh'], ['dau hang', 'khong dieu kien'], ['dau hang', 'vo dieu kien']],
      dates: ['15/8/1945', '15/8']
    },
    {
      id: 'bom_nguyen_tu',
      terms: ['bom nguyen tu', 'hiroshima', 'nagasaki', 'my nem bom', '2 qua bom'],
      keyKeywords: [['bom nguyen tu'], ['hiroshima'], ['nagasaki']],
      dates: ['6/8/1945', '9/8/1945', '6/8', '9/8']
    },
    {
      id: 'lien_xo_man_chau',
      terms: ['lien xo', 'hong quan', 'man chau', 'dao quan quan dong', 'quan quan dong', 'tieu diet quan quan dong'],
      keyKeywords: [['lien xo', 'quan dong'], ['hong quan', 'man chau'], ['quan quan dong']],
      dates: ['9/8/1945', '9/8']
    },
    {
      id: 'quan_lenh_so_1',
      terms: ['quan lenh so 1', 'quan lenh 1', 'quan lenh so mot', 'uy ban khoi nghia toan quoc', 'uy ban khoi nghia', 'phat lenh khoi nghia'],
      keyKeywords: [['quan lenh', '1'], ['quan lenh', 'so 1'], ['uy ban khoi nghia']],
      dates: ['13/8/1945', '13/8']
    },
    {
      id: 'hoi_nghi_toan_quoc',
      terms: ['hoi nghi toan quoc', 'hoi nghi toan quoc cua dang', 'hoi nghi dang toan quoc'],
      keyKeywords: [['hoi nghi toan quoc'], ['hoi nghi toan quoc', 'dang']],
      dates: ['14/8/1945', '14/8']
    },
    {
      id: 'dai_hoi_quoc_dan_tan_trao',
      terms: ['dai hoi quoc dan', 'dai hoi quoc dan tan trao', 'tan trao', '10 chinh sach viet minh', 'uy ban dan toc giai phong viet nam', 'uy ban dan toc giai phong'],
      keyKeywords: [['dai hoi quoc dan'], ['tan trao'], ['uy ban dan toc giai phong']],
      dates: ['16/8/1945', '16/8']
    },
    {
      id: 'giai_phong_thai_nguyen',
      terms: ['vo nguyen giap', 'giai phong thai nguyen', 'thi xa thai nguyen', 'tinh li thai nguyen', 'giai phong quan'],
      keyKeywords: [['vo nguyen giap', 'thai nguyen'], ['giai phong', 'thai nguyen']],
      dates: ['16/8/1945', '16/8']
    },
    {
      id: 'bon_tinh_som_nhat',
      terms: ['bac giang hai duong ha tinh quang nam', 'bac giang', 'hai duong', 'ha tinh', 'quang nam', '4 tinh som nhat', 'gianh chinh quyen som nhat'],
      keyKeywords: [['bac giang', 'hai duong'], ['ha tinh', 'quang nam'], ['4 tinh']],
      dates: ['18/8/1945', '18/8']
    },
    {
      id: 'khoi_nghia_ha_noi',
      terms: ['ha noi', 'nha hat lon', 'bac bo phu', 'khoi nghia ha noi', 'quang truong nha hat lon'],
      keyKeywords: [['khoi nghia', 'ha noi'], ['nha hat lon'], ['bac bo phu']],
      dates: ['19/8/1945', '19/8']
    },
    {
      id: 'khoi_nghia_hue',
      terms: ['hue', 'khoi nghia hue', 'khoi nghia o hue'],
      keyKeywords: [['khoi nghia', 'hue']],
      dates: ['23/8/1945', '23/8']
    },
    {
      id: 'khoi_nghia_sai_gon',
      terms: ['sai gon', 'khoi nghia sai gon', 'khoi nghia o sai gon'],
      keyKeywords: [['khoi nghia', 'sai gon']],
      dates: ['25/8/1945', '25/8']
    },
    {
      id: 'bao_dai_thoai_vi',
      terms: ['bao dai', 'bao dai thoai vi', 'vua bao dai', 'ngo mon', 'trao an kiem', 'an kiem', 'tuyen bo thoai vi'],
      keyKeywords: [['bao dai', 'thoai vi'], ['ngo mon'], ['an kiem']],
      dates: ['30/8/1945', '30/8']
    },
    {
      id: 'tuyen_ngon_doc_lap',
      terms: ['tuyen ngon doc lap', 'quang truong ba dinh', 'ba dinh', 'khai sinh nuoc viet nam dan chu cong hoa', 'viet nam dan chu cong hoa'],
      keyKeywords: [['tuyen ngon doc lap'], ['ba dinh'], ['viet nam dan chu cong hoa']],
      dates: ['2/9/1945', '2/9']
    },
    {
      id: 'thoi_co',
      terms: ['thoi co', 'thoi co ngan nam co mot', 'thoi co vang', 'dieu kien khach quan', 'dieu kien chu quan'],
      keyKeywords: [['thoi co'], ['ngan nam co mot']]
    },
    {
      id: 'pha_kho_thoc',
      terms: ['pha kho thoc nhat', 'pha kho thoc', 'cuu doi', 'nan doi', 'pha kho thoc nhat de cuu doi'],
      keyKeywords: [['pha kho thoc'], ['cuu doi']]
    },

    // BÀI 7: KHÁNG CHIẾN CHỐNG PHÁP (1945 - 1954)
    {
      id: 'toan_quoc_khang_chien',
      terms: ['loi keu goi toan quoc khang chien', 'toan quoc khang chien', 'phao dai lang', 'quyet tu cho to quoc quyet sinh'],
      keyKeywords: [['toan quoc khang chien'], ['loi keu goi'], ['phao dai lang']],
      dates: ['19/12/1946', '19/12']
    },
    {
      id: 'chien_dich_viet_bac',
      terms: ['chien dich viet bac', 'viet bac thu dong 1947', 'viet bac 1947', 'viet bac'],
      keyKeywords: [['viet bac', '1947'], ['chien dich viet bac']],
      dates: ['1947']
    },
    {
      id: 'chien_dich_bien_gioi',
      terms: ['chien dich bien gioi', 'bien gioi thu dong 1950', 'dong khe', 'bien gioi 1950', 'khai thong bien gioi'],
      keyKeywords: [['bien gioi', '1950'], ['dong khe']],
      dates: ['1950']
    },
    {
      id: 'dai_hoi_II',
      terms: ['dai hoi II', 'dai hoi 2', 'dang lao dong viet nam', 'chiem hoa tuyen quang'],
      keyKeywords: [['dai hoi', '2'], ['dai hoi', 'ii'], ['dang lao dong']],
      dates: ['1951', '2/1951']
    },
    {
      id: 'ke_hoach_nava',
      terms: ['ke hoach nava', 'navarre', 'nava', 'ke hoach quan su nava'],
      keyKeywords: [['ke hoach nava'], ['nava']]
    },
    {
      id: 'dien_bien_phu',
      terms: ['dien bien phu', 'dbp', 'chien dich dien bien phu', 'tap doan cu diem dien bien phu'],
      keyKeywords: [['dien bien phu'], ['tap doan cu diem']],
      dates: ['1954']
    },
    {
      id: 'dot_1_dbp',
      terms: ['dot 1 dien bien phu', 'him lam', 'doc lap', 'ban keo', 'phan dinh giot'],
      keyKeywords: [['him lam'], ['doc lap', 'ban keo'], ['phan dinh giot']],
      dates: ['13/3/1954', '13/3']
    },
    {
      id: 'dot_2_dbp',
      terms: ['dot 2 dien bien phu', 'doi a1', 'doi c1', 'to vinh dien'],
      keyKeywords: [['doi a1'], ['doi c1'], ['to vinh dien']]
    },
    {
      id: 'dot_3_dbp_toan_thang',
      terms: ['dot 3 dien bien phu', 'do ca-xto-ri', 'do caxtori', 'do caxtri', 'de castries', 'bo tham muu phap dau hang', 'la co quyet chien quyet thang', 'dien bien phu toan thang', 'ham do caxtori'],
      keyKeywords: [['do ca-xto-ri', 'dau hang'], ['do caxtri', 'dau hang'], ['bo tham muu', 'dau hang'], ['dien bien phu toan thang']],
      dates: ['7/5/1954', '7/5'],
      times: ['17h30', '17:30']
    },
    {
      id: 'hiep_dinh_geneva',
      terms: ['hiep dinh gio-ne-vo', 'hiep dinh geneva', 'gio ne vo', 'geneve', 'vi tuyen 17', 'song ben hai'],
      keyKeywords: [['hiep dinh geneva'], ['hiep dinh gio-ne-vo'], ['vi tuyen 17']],
      dates: ['21/7/1954', '21/7']
    },

    // BÀI 8: KHÁNG CHIẾN CHỐNG MỸ (1954 - 1975)
    {
      id: 'nghi_quyet_15',
      terms: ['nghi quyet 15', 'con duong bao luc cach mang', 'bao luc cach mang'],
      keyKeywords: [['nghi quyet 15'], ['bao luc cach mang']],
      dates: ['1/1959', '1959']
    },
    {
      id: 'phong_trao_dong_khoi',
      terms: ['phong trao dong khoi', 'dong khoi ben tre', 'dong khoi', 'dinh thuy', 'mat tran dan toc giai phong mien nam viet nam'],
      keyKeywords: [['dong khoi'], ['dong khoi', 'ben tre']],
      dates: ['1959 - 1960', '1960', '17/1/1960', '17/1']
    },
    {
      id: 'chien_tranh_dac_biet',
      terms: ['chien tranh dac biet', 'ap chien luoc', 'truc thang van', 'thiet xa van', 'ap bac', 'binh gia', 'ba gia', 'dong xoai'],
      keyKeywords: [['chien tranh dac biet'], ['ap chien luoc'], ['ap bac']],
      dates: ['1961 - 1965', '1961', '1965']
    },
    {
      id: 'chien_tranh_cuc_bo',
      terms: ['chien tranh cuc bo', 'van tuong', 'tim diet', 'binh dinh', 'hai mua kho', 'tet mau than 1968', 'tet mau than'],
      keyKeywords: [['chien tranh cuc bo'], ['van tuong'], ['tet mau than']],
      dates: ['1965 - 1968', '1968']
    },
    {
      id: 'viet_nam_hoa_chien_tranh',
      terms: ['viet nam hoa chien tranh', 'dong duong hoa chien tranh', 'dung nguoi viet danh nguoi viet'],
      keyKeywords: [['viet nam hoa chien tranh'], ['dung nguoi viet']]
    },
    {
      id: 'dien_bien_phu_tren_khong',
      terms: ['dien bien phu tren khong', '12 ngay dem', 'ha noi dien bien phu tren khong', 'b52', 'may bay b52'],
      keyKeywords: [['dien bien phu tren khong'], ['12 ngay dem'], ['b52']],
      dates: ['12/1972', '1972']
    },
    {
      id: 'hiep_dinh_paris',
      terms: ['hiep dinh paris', 'hiep dinh pari', 'my phai rut quan', 'my rut quan ve nuoc'],
      keyKeywords: [['hiep dinh paris'], ['hiep dinh pari'], ['my rut quan']],
      dates: ['27/1/1973', '27/1', '1973']
    },
    {
      id: 'chien_dich_tay_nguyen',
      terms: ['chien dich tay nguyen', 'buon ma thuot', 'tay nguyen'],
      keyKeywords: [['tay nguyen'], ['buon ma thuot']],
      dates: ['3/1975', '1975']
    },
    {
      id: 'chien_dich_hue_da_nang',
      terms: ['chien dich hue da nang', 'giai phong hue', 'giai phong da nang', 'hue - da nang'],
      keyKeywords: [['hue da nang'], ['giai phong hue']],
      dates: ['3/1975', '1975']
    },
    {
      id: 'chien_dich_ho_chi_minh',
      terms: ['chien dich ho chi minh', 'dinh doc lap', 'cam co tren noc dinh doc lap', 'la co cach mang tung bay tren noc dinh doc lap', 'duong van minh dau hang', 'giai phong hoan toan mien nam', 'thong nhat dat nuoc', 'giai phong sai gon'],
      keyKeywords: [['chien dich ho chi minh'], ['dinh doc lap'], ['cam co', 'dinh doc lap'], ['giai phong sai gon']],
      dates: ['30/4/1975', '30/4', '1975'],
      times: ['11h30', '11:30']
    }
  ];

  const VIETNAMESE_STOPWORDS = new Set([
    'va', 'cac', 'nhung', 'o', 'tai', 'trong', 'cua', 'duoc', 'la', 'vao', 've',
    'cho', 'mot', 'nay', 'do', 'ngay', 'thang', 'nam', 'khi', 'sau', 'de', 'den',
    'ra', 'co', 'da', 'voi', 'theo', 'nhu', 'boi', 'vi', 'tren', 'duoi', 'luc',
    'trieu', 'tinh', 'li', 'thi', 'xa'
  ]);

  // 4. THUẬT TOÁN CHẤM ĐIỂM GÕ ĐÁP ÁN (FLASHCARD & RETRIEVAL TYPE-IN)
  function checkTypeInAnswer(typed, target, acceptedList = [], hint = '') {
    if (!typed || !typed.trim()) {
      return {
        score: 0,
        status: 'wrong',
        title: 'Chưa nhập câu trả lời',
        typed: typed || '(Bỏ trống)',
        target: target,
        recommendedGrade: 1
      };
    }

    const rawAccepted = [target, ...(acceptedList || []), hint].filter(Boolean);
    const userCanon = canonicalizeHistoricalText(typed);
    const targetCanon = canonicalizeHistoricalText(target);
    const allCanonAccepted = rawAccepted.map(canonicalizeHistoricalText);

    const cleanTyped = cleanNorm(userCanon);
    const cleanTarget = cleanNorm(targetCanon);
    const allCleanAccepted = allCanonAccepted.map(cleanNorm);

    // 4.1 Khớp hoàn toàn (Exact Match)
    if (allCleanAccepted.some(acc => acc === cleanTyped) || cleanTarget === cleanTyped) {
      return {
        score: 100,
        status: 'exact',
        title: '🎯 Chính xác 100%!',
        typed: typed,
        target: target,
        recommendedGrade: 5
      };
    }

    // 4.2 So khớp Ngày tháng & Mốc thời gian chuẩn hóa
    const targetTimeData = extractDatesAndTimes(target + ' ' + (acceptedList || []).join(' '));
    const userTimeData = extractDatesAndTimes(typed);

    let dateMatchScore = 0;
    if (targetTimeData.dates.length > 0) {
      const targetDate = targetTimeData.dates[0];
      const userMatchedFull = userTimeData.dates.some(ud => ud.full && ud.full === targetDate.full);
      const userMatchedShort = userTimeData.dates.some(ud => ud.short === targetDate.short);
      const userMatchedYear = targetDate.year && userTimeData.years.includes(targetDate.year);

      if (userMatchedFull) {
        dateMatchScore = 100;
      } else if (userMatchedShort && (userMatchedYear || userTimeData.years.length === 0)) {
        dateMatchScore = userMatchedYear ? 100 : 95;
      }
    }

    // Nếu target chủ yếu là ngày tháng (ví dụ "15/8/1945", "30/4/1975", "27/1/1973")
    if (targetTimeData.dates.length > 0 && cleanTarget.replace(/[0-9\/\-\s]/g, '').length <= 8) {
      if (dateMatchScore >= 95) {
        return {
          score: dateMatchScore,
          status: 'exact',
          title: dateMatchScore === 100 ? '🎯 Chính xác 100%!' : '🎯 Rất chính xác (Đúng ngày tháng)!',
          typed: typed,
          target: target,
          recommendedGrade: 5
        };
      }
    }

    // 4.3 Kiểm tra câu trả lời người dùng CHỨA trọn vẹn đáp án (Inclusion with Context)
    const containsAccepted = allCleanAccepted.some(acc => {
      if (!acc || acc.length < 3) return false;
      const regex = new RegExp('(?:^|\\s)' + acc.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(?:$|\\s)');
      return regex.test(cleanTyped) || cleanTyped.includes(acc);
    });

    if (containsAccepted) {
      return {
        score: 100,
        status: 'exact',
        title: '🎯 Chính xác 100%!',
        typed: typed,
        target: target,
        recommendedGrade: 5
      };
    }

    // 4.4 Tra cứu theo Cụm tri thức Lịch sử (Knowledge Clusters)
    for (const cluster of HISTORICAL_KNOWLEDGE_CLUSTERS) {
      const targetMatchesCluster = cluster.terms.some(t => cleanTarget.includes(t)) ||
        (cluster.keyKeywords && cluster.keyKeywords.some(kwGroup => kwGroup.every(kw => cleanTarget.includes(kw)))) ||
        (cluster.dates && cluster.dates.some(d => cleanTarget.includes(d)));

      if (targetMatchesCluster) {
        const userMatchesTerm = cluster.terms.some(t => {
          const regex = new RegExp('(?:^|\\s)' + t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(?:$|\\s)');
          return regex.test(cleanTyped) || cleanTyped === t;
        });

        const userMatchesKeywordGroup = cluster.keyKeywords && cluster.keyKeywords.some(kwGroup => {
          return kwGroup.every(kw => cleanTyped.includes(kw));
        });

        const userMatchesDate = cluster.dates && cluster.dates.some(d => {
          const dNorm = d.replace(/[\-\.]/g, '/');
          return userTimeData.dates.some(ud => (ud.full === dNorm) || (ud.short === dNorm));
        });

        if ((userMatchesTerm || userMatchesKeywordGroup) && (userMatchesDate || !cluster.dates || targetTimeData.dates.length === 0 || dateMatchScore > 0)) {
          return {
            score: 100,
            status: 'exact',
            title: '🎯 Chính xác 100%!',
            typed: typed,
            target: target,
            recommendedGrade: 5
          };
        } else if (userMatchesTerm || userMatchesKeywordGroup || userMatchesDate) {
          return {
            score: 90,
            status: 'close',
            title: '⚡ Nắm rất vững ý chính!',
            typed: typed,
            target: target,
            recommendedGrade: 5
          };
        }
      }
    }

    // 4.5 Đáp án chứa câu trả lời của người dùng (Substring Check)
    // ⚠️ CHỐNG LỖI TYPING "chi" -> 95%:
    // Tuyệt đối không cho điểm nếu từ người dùng gõ quá ngắn so với đáp án (tỉ lệ chiều dài < 0.65)
    for (const acc of allCleanAccepted) {
      if (acc && acc.includes(cleanTyped)) {
        const lenRatio = cleanTyped.length / acc.length;
        const typedWords = cleanTyped.split(/\s+/).filter(Boolean);
        if (lenRatio >= 0.65 && (typedWords.length >= 2 || cleanTyped.length >= 6)) {
          return {
            score: 85,
            status: 'close',
            title: '⚡ Nắm rất vững ý chính!',
            typed: typed,
            target: target,
            recommendedGrade: 5
          };
        }
      }
    }

    // 4.6 Token Overlap & Bigram Semantic Matching
    const filterTokens = (s) => s.split(' ').filter(w => w.length > 1 && !VIETNAMESE_STOPWORDS.has(w));
    const targetTokens = filterTokens(cleanTarget);
    const typedTokens = filterTokens(cleanTyped);

    if (typedTokens.length <= 1 && cleanTyped.length <= 4) {
      return {
        score: 0,
        status: 'wrong',
        title: '❌ Chưa chính xác',
        typed: typed,
        target: target,
        recommendedGrade: 1
      };
    }

    let matchedTokenCount = 0;
    typedTokens.forEach(token => {
      if (targetTokens.includes(token)) matchedTokenCount++;
    });

    const targetRecall = targetTokens.length > 0 ? (matchedTokenCount / targetTokens.length) : 0;
    const userPrecision = typedTokens.length > 0 ? (matchedTokenCount / typedTokens.length) : 0;

    const getBigrams = (tokens) => {
      const bg = [];
      for (let i = 0; i < tokens.length - 1; i++) bg.push(tokens[i] + ' ' + tokens[i+1]);
      return bg;
    };
    const targetBigrams = getBigrams(targetTokens);
    const typedBigrams = getBigrams(typedTokens);
    let matchedBigramCount = 0;
    typedBigrams.forEach(bg => {
      if (targetBigrams.includes(bg)) matchedBigramCount++;
    });

    if (targetRecall >= 0.7 && userPrecision >= 0.4) {
      return {
        score: 90,
        status: 'close',
        title: '⚡ Nắm rất vững ý chính!',
        typed: typed,
        target: target,
        recommendedGrade: 5
      };
    }

    if (matchedBigramCount >= 1 || (targetRecall >= 0.4 && matchedTokenCount >= 2)) {
      return {
        score: 75,
        status: 'close',
        title: '⚡ Nắm được ý chính cốt lõi!',
        typed: typed,
        target: target,
        recommendedGrade: 4
      };
    }

    if (targetRecall >= 0.3 && matchedTokenCount >= 2) {
      return {
        score: 55,
        status: 'vague',
        title: '⚠️ Có ý đúng nhưng chưa đầy đủ',
        typed: typed,
        target: target,
        recommendedGrade: 3
      };
    }

    return {
      score: Math.min(25, Math.round(targetRecall * userPrecision * 100)),
      status: 'wrong',
      title: '❌ Chưa chính xác',
      typed: typed,
      target: target,
      recommendedGrade: 1
    };
  }

  // 5. THUẬT TOÁN CHẤM ĐIỂM ÔN TẬP KÝ ỨC KHÔNG GIAN 3D (SPATIAL RECALL EVALUATOR)
  function evaluateStepRecall(userRawText, targetPointText, locus) {
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

    const cleanTarget = targetPointText.replace(/^[•\-\s\d\.]+/, '').trim();
    const targetCanon = canonicalizeHistoricalText(cleanTarget);
    const userCanon = canonicalizeHistoricalText(userRawText);
    const normUser = cleanNorm(userCanon);
    const normTarget = cleanNorm(targetCanon);

    const targetTime = extractDatesAndTimes(cleanTarget);
    const userTime = extractDatesAndTimes(userRawText);

    let datePoints = 0;
    let maxDatePoints = 0;
    const matchedDates = [];
    const missingDates = [];

    if (targetTime.dates.length > 0) {
      maxDatePoints = targetTime.dates.length * 35;
      targetTime.dates.forEach(td => {
        let hit = false;
        if (td.full && userTime.dates.some(ud => ud.full === td.full)) {
          hit = true;
        } else if (td.short && userTime.dates.some(ud => ud.short === td.short)) {
          hit = true;
        } else if (td.year && userTime.years.includes(td.year) && normUser.includes(td.short.replace('/', ' '))) {
          hit = true;
        }

        if (hit) {
          datePoints += 35;
          matchedDates.push('Thời gian: ' + (td.full || td.short));
        } else {
          missingDates.push('Mốc thời gian: ' + (td.full || td.short));
        }
      });
    }

    if (targetTime.times.length > 0) {
      maxDatePoints += targetTime.times.length * 15;
      targetTime.times.forEach(tt => {
        if (userTime.times.includes(tt) || normUser.includes(tt)) {
          datePoints += 15;
          matchedDates.push('Thời điểm: ' + tt);
        } else {
          missingDates.push('Thời điểm: ' + tt);
        }
      });
    }

    let clusterPoints = 0;
    const matchedEntities = [];

    for (const cluster of HISTORICAL_KNOWLEDGE_CLUSTERS) {
      const targetHasCluster = cluster.terms.some(t => normTarget.includes(t)) ||
        (cluster.keyKeywords && cluster.keyKeywords.some(kwGroup => kwGroup.every(kw => normTarget.includes(kw)))) ||
        (cluster.dates && cluster.dates.some(d => normTarget.includes(d.replace(/[\-\.]/g, '/'))));

      if (targetHasCluster) {
        let matchedTerm = cluster.terms.find(t => {
          const regex = new RegExp('(?:^|\\s)' + t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(?:$|\\s)');
          return regex.test(normUser) || normUser.includes(t);
        });

        if (!matchedTerm && cluster.keyKeywords) {
          const kwHit = cluster.keyKeywords.find(kwGroup => kwGroup.every(kw => normUser.includes(kw)));
          if (kwHit) matchedTerm = kwHit.join(' + ');
        }

        if (matchedTerm) {
          clusterPoints += 40;
          matchedEntities.push(matchedTerm);
        }
      }
    }

    const targetWords = normTarget.split(' ').filter(w => w.length > 2 && !VIETNAMESE_STOPWORDS.has(w));
    const uniqueTargetWords = [...new Set(targetWords)];
    const userWords = normUser.split(' ').filter(w => w.length > 2 && !VIETNAMESE_STOPWORDS.has(w));
    const uniqueUserWords = [...new Set(userWords)];

    let hitWordsCount = 0;
    uniqueTargetWords.forEach(w => {
      if (uniqueUserWords.includes(w) || normUser.includes(w)) hitWordsCount++;
    });

    const wordCoverage = uniqueTargetWords.length > 0 ? (hitWordsCount / uniqueTargetWords.length) : 0;

    let baseScore = 0;
    const hasMatchedDate = matchedDates.length > 0;
    const hasMatchedEntity = matchedEntities.length > 0;

    if (hasMatchedDate && hasMatchedEntity) {
      baseScore = 80 + Math.round(wordCoverage * 20);
    } else if (hasMatchedEntity) {
      baseScore = 65 + Math.round(wordCoverage * 30);
    } else if (hasMatchedDate) {
      baseScore = 45 + Math.round(wordCoverage * 40);
    } else {
      baseScore = Math.round(wordCoverage * 60);
    }

    const totalUserWords = userRawText.trim().split(/\s+/).length;
    if (baseScore >= 50) {
      if (totalUserWords >= 7) baseScore = Math.min(100, baseScore + 6);
      if (totalUserWords >= 12) baseScore = Math.min(100, baseScore + 6);
    }

    if (hitWordsCount === 0 && matchedDates.length === 0 && matchedEntities.length === 0) {
      baseScore = 0;
    } else if (hitWordsCount <= 1 && matchedDates.length === 0 && matchedEntities.length === 0) {
      baseScore = Math.min(baseScore, 15);
    }

    const finalScore = Math.max(0, Math.min(100, baseScore));
    const passed = finalScore >= 50;

    let grade = 'Chưa đạt yêu cầu';
    let gradeColor = '#ef4444';
    let feedback = '';

    if (finalScore >= 85) {
      grade = 'Xuất sắc — Vượt qua phần này! 🌟';
      gradeColor = '#10b981';
      feedback = 'Bạn nhớ rất chính xác các chi tiết lịch sử cốt lõi của phần này!';
    } else if (finalScore >= 70) {
      grade = 'Tốt — Đủ điểm qua phần này! 👍';
      gradeColor = '#06b6d4';
      feedback = 'Nắm vững các ý chính. Đã đủ điều kiện mở khóa phần tiếp theo!';
    } else if (finalScore >= 50) {
      grade = 'Đạt yêu cầu qua phần này ⚠️';
      gradeColor = '#eab308';
      feedback = 'Đã nắm được ý khái quát, hãy ôn lại để nhớ sâu hơn mốc thời gian và chi tiết.';
    } else {
      grade = 'Chưa đủ điểm để qua (Cần >= 50%) ❌';
      gradeColor = '#ef4444';
      feedback = 'Thiếu các mốc thời gian hoặc sự kiện then chốt. Hãy nhìn lại ảnh tư liệu để ghi nhớ!';
    }

    const allMatched = [...matchedDates, ...matchedEntities.map(e => 'Ý chính: ' + e)];

    return {
      score: finalScore,
      passed: passed,
      grade: grade,
      gradeColor: gradeColor,
      matched: allMatched,
      missing: missingDates,
      feedback: feedback
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

  // Đóng gói Bộ Não Chấm Điểm AI Ngữ Nghĩa Toàn Cầu
  const LociSemanticEvaluator = {
    checkTypeInAnswer,
    evaluateStepRecall,
    canonicalizeHistoricalText,
    extractDatesAndTimes,
    HISTORICAL_KNOWLEDGE_CLUSTERS,
    normalizeText,
    removeVietnameseDiacritics,
    cleanNorm
  };

  // Xuất API ra môi trường trình duyệt và Node.js
  const LociFlashcardFormats = {
    normalizeText,
    cleanNorm,
    checkTypeInAnswer,
    evaluateStepRecall,
    buildDiverseQuestionsForLesson,
    CURATED_CARDS
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = LociFlashcardFormats;
    module.exports.LociSemanticEvaluator = LociSemanticEvaluator;
  }
  if (typeof window !== 'undefined') {
    window.LociFlashcardFormats = LociFlashcardFormats;
    window.LociSemanticEvaluator = LociSemanticEvaluator;
  }
})(typeof window !== 'undefined' ? window : globalThis);
