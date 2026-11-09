/**
 * LOCI EDU - ĐƯỜNG LÊN ĐỈNH LOCI (4-PLAYER OLYMPIA DUEL ENGINE)
 * ============================================================================
 * Chuẩn format 4 Vòng thi Đường Lên Đỉnh Olympia:
 * 1. KHỞI ĐỘNG (60 giây câu hỏi nhanh dồn dập, +10 điểm/câu)
 * 2. VƯỢT CHƯỚNG NGẠI VẬT (4 hàng ngang hé lộ góc ảnh + Bấm chuông đoán CNV)
 * 3. TĂNG TỐC (4 câu 10s - 20s - 30s - 40s, tính điểm theo tốc độ +40, +30, +20, +10)
 * 4. VỀ ĐÍCH (Gói 20đ - 30đ + Đặt Ngôi Sao Hy Vọng x2 điểm + Bấm chuông cướp điểm)
 * 5. LỄ TRAO VÒNG NGUYỆT QUẾ HOÀNG QUANG
 * ============================================================================
 */

(function (global) {
    'use strict';

    // ÂM THANH TỰ NHẬN DIỆN WEB AUDIO SYNTHESIZER
    const OlympiaAudio = {
        ctx: null,
        init() {
            if (!this.ctx) {
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                if (AudioContext) this.ctx = new AudioContext();
            }
        },
        playTone(freq, type, duration, delay = 0) {
            try {
                this.init();
                if (!this.ctx) return;
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = type;
                osc.frequency.setValueAtTime(freq, this.ctx.currentTime + delay);
                gain.gain.setValueAtTime(0.18, this.ctx.currentTime + delay);
                gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + delay + duration);
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start(this.ctx.currentTime + delay);
                osc.stop(this.ctx.currentTime + delay + duration);
            } catch (e) {}
        },
        tick() { this.playTone(880, 'sine', 0.04); },
        bell() {
            this.playTone(523.25, 'triangle', 0.6);
            this.playTone(659.25, 'triangle', 0.6, 0.08);
            this.playTone(783.99, 'sine', 0.8, 0.16);
        },
        buzzer() {
            this.playTone(180, 'sawtooth', 0.4);
            this.playTone(160, 'sawtooth', 0.4, 0.1);
        },
        correct() {
            this.playTone(523.25, 'sine', 0.18);
            this.playTone(659.25, 'sine', 0.18, 0.1);
            this.playTone(783.99, 'sine', 0.25, 0.2);
            this.playTone(1046.50, 'sine', 0.35, 0.3);
        },
        wrong() {
            this.playTone(220, 'square', 0.25);
            this.playTone(196, 'square', 0.3, 0.2);
        },
        hopeStar() {
            [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98].forEach((f, i) => {
                this.playTone(f, 'sine', 0.25, i * 0.08);
            });
        },
        fanfare() {
            [523.25, 523.25, 523.25, 659.25, 783.99, 1046.50].forEach((f, i) => {
                this.playTone(f, 'triangle', 0.35, i * 0.12);
            });
        }
    };

    // BỘ DỮ LIỆU CÂU HỎI OLYMPIA CHUYÊN SÂU LỊCH SỬ THPT & CUNG ĐIỆN LOCI
    const OLYMPIA_DATA = {
        // Vòng 1: Khởi động (20 câu hỏi nhanh)
        warmup: [
            { q: "Cây đa Tân Trào (Tuyên Quang) là nơi làm lễ xuất quân của đơn vị vũ trang nào vào chiều 16/8/1945?", a: "Việt Nam Giải phóng quân", opts: ["Việt Nam Giải phóng quân", "Cứu quốc quân", "Việt Nam Tuyên truyền Giải phóng quân", "Vệ quốc đoàn"] },
            { q: "Vào ngày 19/8/1945, cuộc mít tinh khổng lồ biến thành khởi nghĩa giành chính quyền ở Hà Nội diễn ra tại đâu?", a: "Nhà hát Lớn Hà Nội", opts: ["Nhà hát Lớn Hà Nội", "Quảng trường Ba Đình", "Cột Cờ Hà Nội", "Bắc Bộ Phủ"] },
            { q: "Sự kiện nào đánh dấu sự sụp đổ hoàn toàn của chế độ phong kiến Việt Nam vào ngày 30/8/1945?", a: "Vua Bảo Đại thoái vị tại Huế", opts: ["Vua Bảo Đại thoái vị tại Huế", "Tuyên ngôn Độc lập", "Tổng khởi nghĩa Hà Nội", "Hội nghị Quốc dân Tân Trào"] },
            { q: "Tuyên ngôn Độc lập khai sinh nước VNDCCH được Bác Hồ đọc vào thời gian nào?", a: "2/9/1945", opts: ["2/9/1945", "19/8/1945", "25/8/1945", "16/8/1945"] },
            { q: "Chiến dịch quyết chiến chiến lược kết thúc thắng lợi cuộc kháng chiến chống Pháp năm 1954 là gì?", a: "Chiến dịch Điện Biên Phủ", opts: ["Chiến dịch Điện Biên Phủ", "Chiến dịch Biên giới", "Chiến dịch Tây Bắc", "Chiến dịch Việt Bắc"] },
            { q: "Trận tiến công tiêu diệt sân bay quân sự Pháp ngày 7/3/1954 tại Hải Phòng diễn ra ở đâu?", a: "Sân bay Cát Bi", opts: ["Sân bay Cát Bi", "Sân bay Gia Lâm", "Sân bay Bạch Mai", "Sân bay Kiến An"] },
            { q: "Hiệp định quốc tế buộc Pháp công nhận độc lập, chủ quyền, thống nhất và toàn vẹn lãnh thổ của Việt Nam là hiệp định nào?", a: "Hiệp định Giơ-ne-vơ 1954", opts: ["Hiệp định Giơ-ne-vơ 1954", "Hiệp định Paris 1973", "Hiệp định Sơ bộ 1946", "Tạm ước 14/9"] },
            { q: "Năm 1973, hiệp định nào buộc đế quốc Mỹ phải rút hết quân đội về nước, tôn trọng độc lập của Việt Nam?", a: "Hiệp định Paris 1973", opts: ["Hiệp định Paris 1973", "Hiệp định Giơ-ne-vơ 1954", "Hội nghị Genève", "Hiệp ước Vientiane"] },
            { q: "Chiến dịch mở màn cho cuộc Tổng tiến công và nổi dậy mùa Xuân 1975 là chiến dịch nào?", a: "Chiến dịch Tây Nguyên", opts: ["Chiến dịch Tây Nguyên", "Chiến dịch Huế - Đà Nẵng", "Chiến dịch Hồ Chí Minh", "Chiến dịch Đường 14 - Phước Long"] },
            { q: "Chiếc xe tăng mang số hiệu bao nhiêu đã húc đổ cổng chính Dinh Độc Lập trưa 30/4/1975?", a: "Xe tăng 390", opts: ["Xe tăng 390", "Xe tăng 843", "Xe tăng 380", "Xe tăng 846"] },
            { q: "Trong phương pháp Cung điện Ký ức (Method of Loci), thông tin trừu tượng được gắn kết vào đâu?", a: "Tọa độ đồ vật trong không gian 3D", opts: ["Tọa độ đồ vật trong không gian 3D", "Trang sách in đậm", "Bảng chữ cái tuần tự", "Âm thanh lặp đi lặp lại"] },
            { q: "Phương pháp chu kỳ ôn tập ngắt quãng (Spaced Repetition) phổ biến dựa trên thuật toán nào?", a: "Thuật toán SM-2", opts: ["Thuật toán SM-2", "Thuật toán Dijkstra", "Thuật toán Huffman", "Thuật toán A*"] }
        ],

        // Vòng 2: Vượt chướng ngại vật (Gói hoàn chỉnh)
                obstacles: [
            {
                id: "cmt8",
                keyword: "CÁCH MẠNG THÁNG TÁM",
                charCount: "16 CHỮ CÁI",
                hintImg: "assets/images/bai6/tram5_nha_hat_lon_hanoi.jpg",
                imageCaption: "Mít tinh ngày 19/8/1945 tại Quảng trường Nhà hát Lớn Hà Nội",
                rows: [
                    { id: 1, q: "Hàng ngang 1 (7 chữ cái): Căn cứ địa tại Tuyên Quang nơi Bác Hồ triệu tập Quốc dân Đại hội tháng 8/1945?", answer: "TÂN TRÀO", clue: "Gợi ý: Cây đa lịch sử, mái đình Tân Trào." },
                    { id: 2, q: "Hàng ngang 2 (5 chữ cái): Trung tâm đầu não giành chính quyền thắng lợi rực rỡ vào ngày 19/8/1945?", answer: "HÀ NỘI", clue: "Gợi ý: Thủ đô ngàn năm văn hiến." },
                    { id: 3, q: "Hàng ngang 3 (8 chữ cái): Mặt trận dân tộc thống nhất do Đảng thành lập năm 1941 lãnh đạo quần chúng?", answer: "VIỆT MINH", clue: "Gợi ý: Việt Nam Độc lập Đồng minh." },
                    { id: 4, q: "Hàng ngang 4 (4 chữ cái): Năm dương lịch khai sinh ra nước Việt Nam Dân chủ Cộng hòa?", answer: "1945", clue: "Gợi ý: Mốc son chói lọi thế kỷ 20." }
                ]
            },
            {
                id: "dbp",
                keyword: "ĐIỆN BIÊN PHỦ",
                charCount: "12 CHỮ CÁI",
                hintImg: "assets/images/post_dienbienphu.jpg",
                imageCaption: "Lá cờ Quyết chiến Quyết thắng tung bay trên nóc hầm Đờ Cát chiều 7/5/1954",
                rows: [
                    { id: 1, q: "Hàng ngang 1 (6 chữ cái): Cứ điểm mở màn bị tiêu diệt ngày 13/3/1954 trong đợt tiến công thứ nhất?", answer: "HIM LAM", clue: "Gợi ý: Phân khu Bắc của tập đoàn cứ điểm." },
                    { id: 2, q: "Hàng ngang 2 (5 chữ cái): Điểm cao phía Đông nơi diễn ra cuộc giao tranh công kiên ác liệt nhất?", answer: "ĐỒI A1", clue: "Gợi ý: Khối bộc phá ngàn cân nổ rền vang." },
                    { id: 3, q: "Hàng ngang 3 (5 chữ cái): Tướng chỉ huy tập đoàn cứ điểm Pháp bị bắt sống tại căn hầm chỉ huy?", answer: "ĐỜ CÁT", clue: "Gợi ý: Christian de Castries." },
                    { id: 4, q: "Hàng ngang 4 (10 chữ cái): Thời gian diễn ra chiến dịch Điện Biên Phủ từ 13/3 đến 7/5/1954?", answer: "56 NGÀY ĐÊM", clue: "Gợi ý: 'Năm mươi sáu ngày đêm khoét núi, ngủ hầm...'" }
                ]
            },
            {
                id: "dtmx",
                keyword: "ĐẠI THẮNG MÙA XUÂN",
                charCount: "16 CHỮ CÁI",
                hintImg: "assets/images/post_xetang_1975.jpg",
                imageCaption: "Xe tăng 390 húc đổ cổng Dinh Độc Lập trưa ngày 30/4/1975",
                rows: [
                    { id: 1, q: "Hàng ngang 1 (9 chữ cái): Địa bàn chiến lược miền Trung mở màn cuộc Tổng tiến công tháng 3/1975?", answer: "TÂY NGUYÊN", clue: "Gợi ý: Đòn điểm huyệt Buôn Ma Thuột rung chuyển." },
                    { id: 2, q: "Hàng ngang 2 (11 chữ cái): Chiến dịch giải phóng Sài Gòn mang tên vị lãnh tụ vĩ đại của dân tộc?", answer: "HỒ CHÍ MINH", clue: "Gợi ý: Chiến dịch quyết chiến chiến lược cuối cùng." },
                    { id: 3, q: "Hàng ngang 3 (10 chữ cái): Biểu tượng cơ quan đầu não chính quyền Sài Gòn bị giải phóng trưa 30/4?", answer: "DINH ĐỘC LẬP", clue: "Gợi ý: Tọa độ cắm cờ chiến thắng." },
                    { id: 4, q: "Hàng ngang 4 (7 chữ cái): Phương tiện cơ giới dẫn đầu húc đổ cánh cổng sắt Dinh Độc Lập?", answer: "XE TĂNG", clue: "Gợi ý: Thiết giáp thép số hiệu 390 và 843." }
                ]
            },
            {
                id: "tndl",
                keyword: "TUYÊN NGÔN ĐỘC LẬP",
                charCount: "16 CHỮ CÁI",
                hintImg: "assets/images/post_tuyenngondoclap.jpg",
                imageCaption: "Chủ tịch Hồ Chí Minh đọc bản Tuyên ngôn Độc lập tại Quảng trường Ba Đình (2/9/1945)",
                rows: [
                    { id: 1, q: "Hàng ngang 1 (6 chữ cái): Tên quảng trường lịch sử nơi hàng vạn đồng bào lắng nghe Tuyên ngôn Độc lập?", answer: "BA ĐÌNH", clue: "Gợi ý: Trái tim của thủ đô Hà Nội." },
                    { id: 2, q: "Hàng ngang 2 (11 chữ cái): Người soạn thảo và đọc bản Tuyên ngôn Độc lập ngày 2/9/1945?", answer: "HỒ CHÍ MINH", clue: "Gợi ý: Vị cha già kính yêu của dân tộc." },
                    { id: 3, q: "Hàng ngang 3 (4 chữ cái): Giá trị thiêng liêng gắn liền với Độc lập trong tiêu ngữ Quốc gia?", answer: "TỰ DO", clue: "Gợi ý: 'Không có gì quý hơn Độc lập,...'" },
                    { id: 4, q: "Hàng ngang 4 (5 chữ cái): Thủ đô ngàn năm văn hiến nơi sự kiện lịch sử 2/9 diễn ra?", answer: "HÀ NỘI", clue: "Gợi ý: Trung tâm chính trị, văn hóa của cả nước." }
                ]
            },
            {
                id: "truongson",
                keyword: "ĐƯỜNG TRƯỜNG SƠN",
                charCount: "14 CHỮ CÁI",
                hintImg: "assets/images/post_duongtruongson.jpg",
                imageCaption: "Tuyến vận tải chiến lược huyền thoại mang tên Bác chi viện cho chiến trường miền Nam",
                rows: [
                    { id: 1, q: "Hàng ngang 1 (7 chữ cái): Đơn vị bộ đội đặc biệt thành lập tháng 5/1959 chịu trách nhiệm mở đường Trường Sơn?", answer: "ĐOÀN 559", clue: "Gợi ý: Đoàn vận tải quân sự chiến lược." },
                    { id: 2, q: "Hàng ngang 2 (5 chữ cái): Hai từ mở đầu câu thơ nổi tiếng: '... Trường Sơn đi cứu nước mà lòng phơi phới dậy tương lai'?", answer: "XẺ DỌC", clue: "Gợi ý: Thơ Tố Hữu." },
                    { id: 3, q: "Hàng ngang 3 (6 chữ cái): Phương tiện cơ giới băng đạn bom tiếp tế vũ khí, lương thực cho tiền tuyến?", answer: "XE TẢI", clue: "Gợi ý: 'Tiểu đội xe không kính' của Phạm Tiến Duật." },
                    { id: 4, q: "Hàng ngang 4 (7 chữ cái): Mục tiêu chiến lược huyết mạch nhằm đưa sức người, sức của từ Bắc vào Nam?", answer: "CHI VIỆN", clue: "Gợi ý: Tiếp sức không ngừng nghỉ cho tiền tuyến lớn." }
                ]
            },
            {
                id: "paris",
                keyword: "HIỆP ĐỊNH PARIS",
                charCount: "13 CHỮ CÁI",
                hintImg: "Ảnh/Hiệp định Paris.jpg",
                imageCaption: "Lễ ký kết Hiệp định Paris chấm dứt chiến tranh lập lại hòa bình ở Việt Nam (27/1/1973)",
                rows: [
                    { id: 1, q: "Hàng ngang 1 (4 chữ cái): Năm ký kết chính thức Hiệp định Paris buộc quân đội Mỹ rút về nước?", answer: "1973", clue: "Gợi ý: Sau thất bại Điện Biên Phủ trên không 1972 của Mỹ." },
                    { id: 2, q: "Hàng ngang 2 (7 chữ cái): Nghĩa vụ quân sự then chốt mà quân Mỹ phải hoàn thành trong 60 ngày sau ký kết?", answer: "RÚT QUÂN", clue: "Gợi ý: Rút toàn bộ quân đội và căn cứ về nước." },
                    { id: 3, q: "Hàng ngang 3 (9 chữ cái): Cố vấn đặc biệt của phái đoàn Việt Nam Dân chủ Cộng hòa tại đàm phán Paris?", answer: "LÊ ĐỨC THỌ", clue: "Gợi ý: Nhà ngoại giao kiệt xuất đàm phán trực tiếp với Kissinger." },
                    { id: 4, q: "Hàng ngang 4 (7 chữ cái): Mục tiêu cao đẹp mà nhân dân ta kiên cường đấu tranh để lập lại trên đất nước?", answer: "HOÀ BÌNH", clue: "Gợi ý: Chấm dứt chiến tranh, lập lại..." }
                ]
            }
        ],

        // Vòng 3: Tăng tốc (4 câu hỏi chia mốc 10s, 20s, 30s, 40s)
        speedup: [
            {
                id: 1,
                time: 10,
                scoreBase: [40, 30, 20, 10],
                q: "Câu 1 (10s): Hãy sắp xếp 4 sự kiện sau theo thứ tự thời gian xảy ra trước - sau: (A) Tuyên ngôn Độc lập; (B) Khởi nghĩa ở Hà Nội; (C) Vua Bảo Đại thoái vị; (D) Hội nghị Quân sự Bắc Kỳ.",
                correct: "D-B-C-A",
                explain: "Thứ tự đúng: (D) Hội nghị Quân sự Bắc Kỳ (4/1945) -> (B) Hà Nội khởi nghĩa (19/8) -> (C) Bảo Đại thoái vị (30/8) -> (A) Tuyên ngôn Độc lập (2/9/1945).",
                opts: ["D-B-C-A", "B-D-C-A", "D-C-B-A", "B-A-C-D"]
            },
            {
                id: 2,
                time: 20,
                scoreBase: [40, 30, 20, 10],
                q: "Câu 2 (20s): Đồ vật nào trong Cung điện Loci đại diện cho tinh thần thần tốc 'khoét núi, ngủ hầm, mưa dầm, cơm vắt' tiếp tế hàng vạn tấn lương thực lên Điện Biên Phủ 1954?",
                correct: "Xe đạp thồ",
                explain: "Xe đạp thồ là 'vũ khí đặc biệt' của dân công hỏa tuyến tiếp tế cho chiến dịch Điện Biên Phủ.",
                opts: ["Xe đạp thồ", "Bao cát công sự", "Pháo cao xạ", "Mũ cối gắn cành lá"]
            },
            {
                id: 3,
                time: 30,
                scoreBase: [40, 30, 20, 10],
                q: "Câu 3 (30s): Điền cụm từ còn thiếu vào lời kêu gọi của Đại tướng Võ Nguyên Giáp tháng 4/1975: 'Thần tốc, thần tốc hơn nữa; Táo bạo, táo bạo hơn nữa; Tranh thủ từng giờ, từng phút; Xốc tới mặt trận, giải phóng...!'",
                correct: "miền Nam",
                explain: "Bức điện mật lịch sử ngày 7/4/1975: '...Xốc tới mặt trận, giải phóng miền Nam! Quyết chiến và toàn thắng!'.",
                opts: ["miền Nam", "Tây Nguyên", "Sài Gòn", "Tổ quốc"]
            },
            {
                id: 4,
                time: 40,
                scoreBase: [40, 30, 20, 10],
                q: "Câu 4 (40s): Trong trận Điện Biên Phủ trên không tháng 12/1972, pháo đài bay B-52 của đế quốc Mỹ đã bị lực lượng phòng không - không quân Việt Nam bắn rơi tổng cộng bao nhiêu chiếc?",
                correct: "34 chiếc",
                explain: "Quân dân ta đã bắn rơi 81 máy bay Mỹ, trong đó có 34 pháo đài bay B-52, lập nên kỳ tích 'Hà Nội - Điện Biên Phủ trên không'.",
                opts: ["34 chiếc", "25 chiếc", "42 chiếc", "18 chiếc"]
            }
        ],

        // Vòng 4: Về đích (Gói câu hỏi 20 và 30 điểm)
        finish: [
            {
                points: 20,
                q: "Ý nghĩa bước ngoặt to lớn nhất của thắng lợi Chiến dịch Điện Biên Phủ 1954 đối với phong trào giải phóng dân tộc trên toàn thế giới là gì?",
                a: "Đập tan pháo đài bất khả xâm phạm của chủ nghĩa thực dân cũ",
                opts: [
                    "Đập tan pháo đài bất khả xâm phạm của chủ nghĩa thực dân cũ",
                    "Buộc Mỹ phải ký hiệp định Paris ngay lập tức",
                    "Hoàn thành triệt để cuộc cách mạng ruộng đất",
                    "Giải phóng toàn bộ bán đảo Đông Dương thành một liên bang"
                ]
            },
            {
                points: 20,
                q: "Trong Hiệp định Paris 1973, điều khoản mang tính quyết định tạo so sánh lực lượng có lợi tuyệt đối cho cách mạng miền Nam là gì?",
                a: "Hoa Kỳ rút hết quân viễn chinh nhưng quân đội miền Bắc ở lại miền Nam",
                opts: [
                    "Hoa Kỳ rút hết quân viễn chinh nhưng quân đội miền Bắc ở lại miền Nam",
                    "Hai bên lập tức sáp nhập quân đội thành một khối duy nhất",
                    "Mỹ bồi thường ngay lập tức toàn bộ chiến phí",
                    "Tổng tuyển cử tự do dưới sự giám sát độc quyền của Liên Hợp Quốc"
                ]
            },
            {
                points: 30,
                q: "Phân tích nghệ thuật quân sự: Tại sao Bộ Chính trị quyết định chọn Tây Nguyên làm hướng tiến công chiến lược mở đầu cho cuộc Tổng tiến công mùa Xuân 1975?",
                a: "Địa bàn chiến lược hiểm yếu nhưng địch bố phòng sơ hở, có thể tạo thế chẻ tre",
                opts: [
                    "Địa bàn chiến lược hiểm yếu nhưng địch bố phòng sơ hở, có thể tạo thế chẻ tre",
                    "Là nơi tập trung quân đông nhất của toàn bộ quân đội ngụy Sài Gòn",
                    "Được sự hỗ trợ trực tiếp của hải quân đồng minh quốc tế",
                    "Là thủ phủ chính trị của chính quyền Việt Nam Cộng Hòa"
                ]
            },
            {
                points: 30,
                q: "Phương pháp Cung điện Ký ức (Method of Loci) phát huy tác dụng ghi nhớ vượt trội trong học Lịch sử nhờ kích hoạt đồng thời 2 vùng chức năng nào của não bộ?",
                a: "Hồi hải mã (Hippocampus) và Vỏ não định vị thị giác không gian",
                opts: [
                    "Hồi hải mã (Hippocampus) và Vỏ não định vị thị giác không gian",
                    "Tiểu não vận động và Hạch hạnh nhân sợ hãi",
                    "Vùng Broca ngôn ngữ và Thùy trán kiểm soát cảm xúc",
                    "Thân não sinh tồn và Vùng Wernicke tiếp nhận thính giác"
                ]
            }
        ]
    };

    // CLASS OLYMPIA DUEL ENGINE QUẢN LÝ TRẬN ĐẤU 4 THÍ SINH
    const OlympiaLociEngine = {
        active: false,
        partyMode: false, // true nếu chơi 4 người thật trên cùng 1 máy
        currentRoundIndex: 1, // 1: Khởi động, 2: VCNV, 3: Tăng tốc, 4: Về đích, 5: Trao giải
        timerInterval: null,
        roundSeconds: 60,

        // 4 Thí sinh
        players: [
            { id: 'p1', name: 'Bạn', school: 'THPT Loci Scholar', score: 0, avatar: 'assets/images/loci_avatar.jpg', isUser: true, hopeStarUsed: false },
            { id: 'p2', name: 'Nguyễn Nhật Minh', school: 'Chuyên Hà Nội - Amsterdam', score: 0, avatar: 'assets/images/pets/owl_scholar.png', isUser: false, hopeStarUsed: false },
            { id: 'p3', name: 'Trần Bảo Vy', school: 'Chuyên Lê Hồng Phong TP.HCM', score: 0, avatar: 'assets/images/pets/phoenix_fire.png', isUser: false, hopeStarUsed: false },
            { id: 'p4', name: 'Lê Quốc Tuấn', school: 'Chuyên Quốc Học Huế', score: 0, avatar: 'assets/images/pets/tiger_speed.png', isUser: false, hopeStarUsed: false }
        ],

        // Trạng thái các vòng thi
        state: {
            warmupQuestionIdx: 0,
            warmupAnswered: 0,
            warmupCorrect: 0,
            obstacle: null,
            obstacleRowsSolved: [],
            obstacleBuzzerLocked: false,
            speedupQuestionIdx: 0,
            finishTurnPlayerIdx: 0,
            finishQuestionIdx: 0,
            hopeStarActive: false,
            stealChanceActive: false
        },

        init() {
            this.injectStyles();
            this.ensureModal();
        },

        open() {
            OlympiaAudio.init();
            this.init();
            this.syncMyUser();
            const modal = document.getElementById('olympia-modal-overlay');
            if (modal) {
                modal.classList.add('open');
                this.renderLobby();
            }
        },

        close() {
            this.clearTimer();
            const modal = document.getElementById('olympia-modal-overlay');
            if (modal) modal.classList.remove('open');
            this.active = false;
        },

        syncMyUser() {
            try {
                let name = 'Bạn';
                if (window.LociAccountManager && typeof window.LociAccountManager.getCurrentUser === 'function') {
                    const u = window.LociAccountManager.getCurrentUser();
                    if (u && (u.displayName || u.username)) name = u.displayName || u.username;
                } else {
                    const saved = localStorage.getItem('loci_user_profile');
                    if (saved) {
                        const parsed = JSON.parse(saved);
                        if (parsed.nickname || parsed.name) name = parsed.nickname || parsed.name;
                    }
                }
                this.players[0].name = name;
            } catch (e) {}
        },

        injectStyles() {
            if (document.getElementById('olympia-loci-styles')) return;
            const style = document.createElement('style');
            style.id = 'olympia-loci-styles';
            style.textContent = `
                /* SÂN KHẤU OLYMPIA TRƯỜNG QUAY S9 ĐẲNG CẤP */
                .olympia-overlay {
                    position: fixed;
                    inset: 0;
                    z-index: 1000000;
                    background: radial-gradient(circle at 50% 20%, #0b1a30 0%, #060d18 60%, #02050a 100%);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 12px;
                    opacity: 0;
                    visibility: hidden;
                    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                    font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
                    color: #ffffff;
                }
                .olympia-overlay.open {
                    opacity: 1;
                    visibility: visible;
                }
                .olympia-arena-box {
                    width: 100%;
                    max-width: 1060px;
                    max-height: 94vh;
                    background: linear-gradient(180deg, rgba(15, 23, 42, 0.95) 0%, rgba(10, 15, 29, 0.98) 100%);
                    border-radius: 28px;
                    border: 2px solid #38bdf8;
                    box-shadow: 0 0 50px rgba(56, 189, 248, 0.25), 0 25px 70px rgba(0, 0, 0, 0.8);
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    position: relative;
                }
                .olympia-topbar {
                    padding: 16px 24px;
                    background: linear-gradient(90deg, #0369a1 0%, #0284c7 50%, #0f766e 100%);
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    border-bottom: 2px solid rgba(255, 255, 255, 0.15);
                }
                .olympia-brand {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .olympia-logo-badge {
                    width: 38px;
                    height: 38px;
                    border-radius: 10px;
                    background: #fde047;
                    color: #854d0e;
                    display: grid;
                    place-items: center;
                    font-size: 20px;
                    box-shadow: 0 0 15px rgba(253, 224, 71, 0.6);
                }
                .olympia-title {
                    font-size: 20px;
                    font-weight: 800;
                    letter-spacing: -0.3px;
                    text-shadow: 0 2px 8px rgba(0,0,0,0.4);
                }

                /* HÀNG BỤC 4 THÍ SINH */
                .olympia-podium-row {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 12px;
                    padding: 14px 20px;
                    background: rgba(15, 23, 42, 0.8);
                    border-bottom: 1.5px solid rgba(56, 189, 248, 0.2);
                }
                .player-podium-card {
                    background: rgba(30, 41, 59, 0.7);
                    border: 1.5px solid rgba(148, 163, 184, 0.25);
                    border-radius: 16px;
                    padding: 10px;
                    text-align: center;
                    position: relative;
                    transition: all 0.25s;
                }
                .player-podium-card.active-turn {
                    border-color: #facc15;
                    box-shadow: 0 0 20px rgba(250, 204, 21, 0.4);
                    background: rgba(250, 204, 21, 0.1);
                    transform: translateY(-2px);
                }
                .player-podium-card.is-me {
                    border-color: #38bdf8;
                }
                .podium-avatar-wrap {
                    width: 44px;
                    height: 44px;
                    border-radius: 50%;
                    margin: 0 auto 6px;
                    position: relative;
                    border: 2px solid #bae6fd;
                    overflow: hidden;
                }
                .podium-avatar-img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                .podium-pname {
                    font-size: 13px;
                    font-weight: 800;
                    color: #f8fafc;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .podium-pschool {
                    font-size: 10px;
                    color: #94a3b8;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    margin-bottom: 4px;
                }
                .podium-pscore-box {
                    background: #020617;
                    border: 1.5px solid #0284c7;
                    border-radius: 8px;
                    padding: 3px 0;
                    font-size: 18px;
                    font-weight: 900;
                    color: #38bdf8;
                    letter-spacing: 0.5px;
                    font-family: monospace;
                    text-shadow: 0 0 10px rgba(56, 189, 248, 0.6);
                }
                .player-podium-card.active-turn .podium-pscore-box {
                    border-color: #facc15;
                    color: #fde047;
                    text-shadow: 0 0 12px rgba(250, 204, 21, 0.8);
                }

                /* MAIN ARENA STAGE BODY */
                .olympia-body {
                    padding: 22px 28px;
                    overflow-y: auto;
                    flex: 1;
                }

                /* ROUND SELECTOR & STAGE TABS */
                .olympia-round-track {
                    display: flex;
                    gap: 8px;
                    margin-bottom: 20px;
                    border-bottom: 1.5px solid rgba(255, 255, 255, 0.1);
                    padding-bottom: 10px;
                    overflow-x: auto;
                    white-space: nowrap;
                }
                .round-step-btn {
                    background: rgba(255, 255, 255, 0.06);
                    border: 1px solid rgba(255, 255, 255, 0.12);
                    padding: 7px 14px;
                    border-radius: 99px;
                    color: #94a3b8;
                    font-size: 12.5px;
                    font-weight: 700;
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                }
                .round-step-btn.active {
                    background: #0284c7;
                    color: #ffffff;
                    border-color: #38bdf8;
                    box-shadow: 0 0 14px rgba(2, 132, 199, 0.5);
                }

                /* QUESTION CARD & COUNTDOWN */
                .olympia-q-card {
                    background: rgba(15, 23, 42, 0.75);
                    border: 1.5px solid rgba(56, 189, 248, 0.4);
                    border-radius: 20px;
                    padding: 24px;
                    margin-bottom: 20px;
                    box-shadow: 0 12px 30px rgba(0,0,0,0.3);
                }
                .olympia-timer-bar {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 16px;
                }
                .olympia-clock-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    background: #020617;
                    border: 2px solid #e11d48;
                    color: #fda4af;
                    padding: 6px 16px;
                    border-radius: 99px;
                    font-size: 20px;
                    font-weight: 900;
                    font-family: monospace;
                    box-shadow: 0 0 16px rgba(225, 29, 72, 0.5);
                }
                .olympia-q-text {
                    font-size: 18.5px;
                    font-weight: 700;
                    color: #ffffff;
                    line-height: 1.5;
                    margin-bottom: 20px;
                }
                .olympia-options-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 12px;
                }
                .olympia-opt-btn {
                    background: rgba(30, 41, 59, 0.85);
                    border: 1.5px solid rgba(148, 163, 184, 0.3);
                    border-radius: 14px;
                    padding: 14px 18px;
                    color: #f1f5f9;
                    font-size: 14.5px;
                    font-weight: 600;
                    text-align: left;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    transition: all 0.15s;
                }
                .olympia-opt-btn:hover:not(:disabled) {
                    border-color: #38bdf8;
                    background: rgba(2, 132, 199, 0.2);
                    transform: translateY(-2px);
                }
                .olympia-opt-btn.correct {
                    background: #065f46 !important;
                    border-color: #10b981 !important;
                    color: #ffffff !important;
                    box-shadow: 0 0 20px rgba(16, 185, 129, 0.4);
                }
                .olympia-opt-btn.wrong {
                    background: #7f1d1d !important;
                    border-color: #ef4444 !important;
                    color: #ffffff !important;
                }
                .olympia-opt-tag {
                    width: 28px;
                    height: 28px;
                    border-radius: 8px;
                    background: rgba(255, 255, 255, 0.1);
                    display: grid;
                    place-items: center;
                    font-size: 12px;
                    font-weight: 800;
                    color: #facc15;
                }

                /* CHƯỚNG NGẠI VẬT PIECES */
                .cnv-image-frame {
                    position: relative;
                    width: 100%;
                    max-width: 460px;
                    height: 260px;
                    border-radius: 18px;
                    overflow: hidden;
                    border: 2px solid #fde047;
                    margin: 0 auto 20px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                    background: #000;
                }
                .cnv-bg-img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                .cnv-tile {
                    position: absolute;
                    background: #0f172a;
                    border: 1px solid rgba(253, 224, 71, 0.4);
                    display: grid;
                    place-items: center;
                    font-size: 26px;
                    font-weight: 900;
                    color: #fde047;
                    transition: opacity 0.5s ease;
                }
                .cnv-tile.revealed {
                    opacity: 0;
                    pointer-events: none;
                }
                .cnv-tile-1 { top: 0; left: 0; width: 50%; height: 50%; }
                .cnv-tile-2 { top: 0; right: 0; width: 50%; height: 50%; }
                .cnv-tile-3 { bottom: 0; left: 0; width: 50%; height: 50%; }
                .cnv-tile-4 { bottom: 0; right: 0; width: 50%; height: 50%; }

                /* CHUÔNG BẤM OLYMPIA */
                .olympia-buzzer-btn {
                    background: radial-gradient(circle, #ef4444 0%, #991b1b 100%);
                    color: #ffffff;
                    border: 3px solid #fecdd3;
                    border-radius: 99px;
                    padding: 14px 28px;
                    font-size: 16px;
                    font-weight: 900;
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                    gap: 10px;
                    box-shadow: 0 0 25px rgba(239, 68, 68, 0.6), inset 0 2px 4px rgba(255,255,255,0.4);
                    transition: all 0.2s;
                }
                .olympia-buzzer-btn:hover {
                    transform: scale(1.05);
                    box-shadow: 0 0 35px rgba(239, 68, 68, 0.85);
                }

                /* NGÔI SAO HY VỌNG */
                .hope-star-btn {
                    background: linear-gradient(135deg, #f59e0b, #d97706);
                    color: #fff;
                    border: 2px solid #fef08a;
                    border-radius: 99px;
                    padding: 10px 20px;
                    font-size: 14px;
                    font-weight: 800;
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    box-shadow: 0 0 20px rgba(245, 158, 11, 0.5);
                    animation: starGlow 1.5s infinite alternate;
                }
                @keyframes starGlow {
                    from { box-shadow: 0 0 10px rgba(245, 158, 11, 0.4); }
                    to { box-shadow: 0 0 25px rgba(245, 158, 11, 0.9); }
                }

                /* RESPONSIVE MOBILE STYLES */
                @media (max-width: 768px) {
                    .olympia-arena-box {
                        border-radius: 20px;
                        max-height: 98vh;
                    }
                    .olympia-topbar {
                        padding: 12px 16px;
                    }
                    .olympia-podium-row {
                        grid-template-columns: repeat(4, 1fr);
                        padding: 8px;
                        gap: 6px;
                    }
                    .podium-avatar-wrap {
                        width: 34px;
                        height: 34px;
                    }
                    .podium-pname {
                        font-size: 11px;
                    }
                    .podium-pschool {
                        display: none;
                    }
                    .podium-pscore-box {
                        font-size: 14px;
                        padding: 2px 0;
                    }
                    .olympia-body {
                        padding: 14px 14px 24px 14px;
                    }
                    .olympia-q-text {
                        font-size: 15px;
                    }
                    .olympia-options-grid {
                        grid-template-columns: 1fr;
                        gap: 8px;
                    }
                    .olympia-opt-btn {
                        padding: 11px 14px;
                        font-size: 13.5px;
                    }
                    .cnv-image-frame {
                        height: 180px;
                    }
                }
            `;
            document.head.appendChild(style);
        },

        ensureModal() {
            if (document.getElementById('olympia-modal-overlay')) return;
            const overlay = document.createElement('div');
            overlay.id = 'olympia-modal-overlay';
            overlay.className = 'olympia-overlay';
            overlay.innerHTML = `
                <div class="olympia-arena-box" onclick="event.stopPropagation()">
                    <!-- TOPBAR SÂN KHẤU -->
                    <div class="olympia-topbar">
                        <div class="olympia-brand">
                            <div class="olympia-logo-badge">🌿</div>
                            <div>
                                <div class="olympia-title">ĐƯỜNG LÊN ĐỈNH LOCI</div>
                                <div style="font-size: 11px; color: #bae6fd; font-weight: 600;">Đấu Trường Lịch Sử 4 Thí Sinh · Chuẩn Format Olympia</div>
                            </div>
                        </div>
                        <button type="button" onclick="window.OlympiaLociEngine.close()"
                            style="background: rgba(255,255,255,0.15); border: none; width: 34px; height: 34px; border-radius: 50%; color: #fff; font-size: 16px; cursor: pointer; display: grid; place-items: center;">✕</button>
                    </div>

                    <!-- HÀNG BỤC 4 THÍ SINH CỐ ĐỊNH -->
                    <div class="olympia-podium-row" id="olympia-podium-slot">
                        <!-- Rendered by JS -->
                    </div>

                    <!-- THÂN SÂN KHẤU THI ĐẤU -->
                    <div class="olympia-body" id="olympia-main-stage">
                        <!-- Rendered by Stage state -->
                    </div>
                </div>
            `;
            document.body.appendChild(overlay);
        },

        renderPodium() {
            const slot = document.getElementById('olympia-podium-slot');
            if (!slot) return;
            slot.innerHTML = this.players.map((p, idx) => `
                <div class="player-podium-card ${idx === this.state.finishTurnPlayerIdx && this.currentRoundIndex === 4 ? 'active-turn' : ''} ${p.isUser ? 'is-me' : ''}" id="podium-card-${p.id}">
                    <div class="podium-avatar-wrap">
                        <img src="${p.avatar}" alt="${p.name}" class="podium-avatar-img" onerror="this.src='assets/images/loci_avatar.jpg'">
                    </div>
                    <div class="podium-pname" title="${p.name}">${p.isUser ? '⭐ ' : ''}${p.name}</div>
                    <div class="podium-pschool" title="${p.school}">${p.school}</div>
                    <div class="podium-pscore-box" id="podium-score-${p.id}">${p.score}</div>
                </div>
            `).join('');
        },

        // 1. PHÒNG CHỜ (LOBBY): CHỌN CHẾ ĐỘ THI ĐẤU 4 NGƯỜI
        renderLobby() {
            this.currentRoundIndex = 0;
            this.players.forEach(p => p.score = 0);

            // Nạp 3 đối thủ thủ khoa từ pool 120 học sinh thật toàn quốc
            if (window.LociStudentBotEngine && typeof window.LociStudentBotEngine.getOlympiaOpponents === 'function') {
                const opponents = window.LociStudentBotEngine.getOlympiaOpponents(3);
                for (let i = 0; i < 3; i++) {
                    this.players[i + 1] = opponents[i];
                }
            }

            // Chọn ngẫu nhiên 1 bộ Chướng Ngại Vật phong phú
            if (OLYMPIA_DATA.obstacles && OLYMPIA_DATA.obstacles.length > 0) {
                const randObs = OLYMPIA_DATA.obstacles[Math.floor(Math.random() * OLYMPIA_DATA.obstacles.length)];
                this.state.obstacle = JSON.parse(JSON.stringify(randObs));
            }

            this.renderPodium();
            const stage = document.getElementById('olympia-main-stage');
            if (!stage) return;

            stage.innerHTML = `
                <div style="text-align: center; max-width: 700px; margin: 10px auto;">
                    <div style="font-size: 54px; margin-bottom: 12px; animation: starGlow 2s infinite alternate;">🏛️</div>
                    <h2 style="font-size: 26px; font-weight: 900; color: #fde047; margin: 0 0 8px 0; text-shadow: 0 0 20px rgba(253, 224, 71, 0.5);">
                        CHÀO MỪNG ĐẾN VỚI ĐƯỜNG LÊN ĐỈNH LOCI!
                    </h2>
                    <p style="font-size: 14.5px; color: #cbd5e1; line-height: 1.5; margin: 0 0 24px 0;">
                        Cuộc so tài trí tuệ đỉnh cao của 4 nhà leo núi chinh phục Cung Điện Ký Ức Lịch Sử qua 4 vòng thi đầy kịch tính: 
                        <b style="color:#38bdf8;">Khởi Động</b> ➔ <b style="color:#34d399;">Vượt Chướng Ngại Vật</b> ➔ <b style="color:#f59e0b;">Tăng Tốc</b> ➔ <b style="color:#f43f5e;">Về Đích & Vòng Nguyệt Quế</b>!
                    </p>

                    <!-- CHỌN CHẾ ĐỘ THI ĐẤU -->
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 24px; text-align: left;">
                        <div style="background: rgba(30, 41, 59, 0.85); border: 2px solid #38bdf8; border-radius: 18px; padding: 20px; cursor: pointer; transition: all 0.2s;"
                             onclick="window.OlympiaLociEngine.setMode(false)" id="mode-opt-ai">
                            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                                <span style="font-size: 28px;">🤖</span>
                                <span style="background: #0284c7; color: #fff; font-size: 11px; font-weight: 800; padding: 3px 10px; border-radius: 99px;">PHỔ BIẾN</span>
                            </div>
                            <h3 style="font-size: 17px; font-weight: 800; color: #f8fafc; margin: 0 0 4px 0;">Đấu Với 3 Thủ Khoa Trường Chuyên</h3>
                            <p style="font-size: 12.5px; color: #94a3b8; margin: 0;">Tranh tài trực diện cùng 3 bạn học xuất sắc (Amsterdam, Lê Hồng Phong, Quốc Học Huế) với thuật toán bấm chuông thông minh.</p>
                        </div>

                        <div style="background: rgba(30, 41, 59, 0.85); border: 2px solid rgba(148, 163, 184, 0.3); border-radius: 18px; padding: 20px; cursor: pointer; transition: all 0.2s;"
                             onclick="window.OlympiaLociEngine.setMode(true)" id="mode-opt-party">
                            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                                <span style="font-size: 28px;">👥</span>
                                <span style="background: rgba(255,255,255,0.15); color: #e2e8f0; font-size: 11px; font-weight: 800; padding: 3px 10px; border-radius: 99px;">HỌC NHÓM</span>
                            </div>
                            <h3 style="font-size: 17px; font-weight: 800; color: #f8fafc; margin: 0 0 4px 0;">Chơi 4 Bạn Cùng 1 Máy (Party Mode)</h3>
                            <p style="font-size: 12.5px; color: #94a3b8; margin: 0;">Cả 4 bạn ngồi cùng 1 thiết bị, tự đặt tên và lần lượt bấm chuông/gõ phím giải mã câu hỏi ngay trên lớp hoặc thư viện.</p>
                        </div>
                    </div>

                    <!-- NÚT BẮT ĐẦU VÒNG KHỞI ĐỘNG -->
                    <button type="button" onclick="window.OlympiaLociEngine.startRound1Warmup()"
                        style="background: linear-gradient(135deg, #0284c7, #0369a1); border: 2px solid #38bdf8; border-radius: 99px; padding: 14px 44px; font-size: 17px; font-weight: 900; color: #ffffff; cursor: pointer; box-shadow: 0 0 30px rgba(56, 189, 248, 0.5); letter-spacing: 0.5px; transition: all 0.2s;">
                        BƯỚC VÀO TRẬN ĐẤU (VÒNG 1: KHỞI ĐỘNG) ➔
                    </button>
                </div>
            `;
        },

        setMode(isParty) {
            this.partyMode = isParty;
            const bAi = document.getElementById('mode-opt-ai');
            const bParty = document.getElementById('mode-opt-party');
            if (bAi && bParty) {
                bAi.style.borderColor = isParty ? 'rgba(148, 163, 184, 0.3)' : '#38bdf8';
                bParty.style.borderColor = isParty ? '#38bdf8' : 'rgba(148, 163, 184, 0.3)';
            }
            if (isParty) {
                const n1 = prompt('Nhập tên Thí sinh 1 (Bạn):', this.players[0].name) || this.players[0].name;
                const n2 = prompt('Nhập tên Thí sinh 2:', this.players[1].name) || this.players[1].name;
                const n3 = prompt('Nhập tên Thí sinh 3:', this.players[2].name) || this.players[2].name;
                const n4 = prompt('Nhập tên Thí sinh 4:', this.players[3].name) || this.players[3].name;
                this.players[0].name = n1;
                this.players[1].name = n2;
                this.players[2].name = n3;
                this.players[3].name = n4;
                this.renderPodium();
            }
        },

        // =========================================================================
        // VÒNG 1: KHỞI ĐỘNG (60 GIÂY - CÂU HỎI NHANH DỒN DẬP)
        // =========================================================================
        startRound1Warmup() {
            this.currentRoundIndex = 1;
            this.state.warmupQuestionIdx = 0;
            this.state.warmupAnswered = 0;
            this.state.warmupCorrect = 0;
            this.roundSeconds = 60;
            OlympiaAudio.bell();
            this.renderRound1();

            // Đếm ngược 60s
            this.clearTimer();
            this.timerInterval = setInterval(() => {
                this.roundSeconds--;
                if (this.roundSeconds <= 10 && this.roundSeconds > 0) OlympiaAudio.tick();
                const clock = document.getElementById('warmup-clock');
                if (clock) clock.textContent = this.roundSeconds + 's';
                if (this.roundSeconds <= 0) {
                    this.clearTimer();
                    OlympiaAudio.buzzer();
                    this.finishRound1();
                }
            }, 1000);
        },

        renderRound1() {
            const stage = document.getElementById('olympia-main-stage');
            if (!stage) return;
            const q = OLYMPIA_DATA.warmup[this.state.warmupQuestionIdx % OLYMPIA_DATA.warmup.length];

            stage.innerHTML = `
                <div class="olympia-round-track">
                    <span class="round-step-btn active">VÒNG 1: KHỞI ĐỘNG</span>
                    <span class="round-step-btn">VÒNG 2: VƯỢT CHƯỚNG NGẠI VẬT</span>
                    <span class="round-step-btn">VÒNG 3: TĂNG TỐC</span>
                    <span class="round-step-btn">VÒNG 4: VỀ ĐÍCH</span>
                </div>

                <div class="olympia-q-card">
                    <div class="olympia-timer-bar">
                        <div style="font-size: 13.5px; font-weight: 800; color: #38bdf8;">
                            LƯỢT KHỞI ĐỘNG CỦA BẠN (CÂU ${this.state.warmupQuestionIdx + 1}) · +10 ĐIỂM/CÂU ĐÚNG
                        </div>
                        <div class="olympia-clock-badge" id="warmup-clock">${this.roundSeconds}s</div>
                    </div>

                    <div class="olympia-q-text">${q.q}</div>

                    <div class="olympia-options-grid">
                        ${(() => {
                            if (!q.shuffledOpts || q._shuffleKey !== ('w_' + this.state.warmupQuestionIdx)) {
                                q._shuffleKey = 'w_' + this.state.warmupQuestionIdx;
                                q.shuffledOpts = [...q.opts].sort(() => Math.random() - 0.5);
                            }
                            return q.shuffledOpts.map((opt, i) => `
                                <button type="button" class="olympia-opt-btn" onclick="window.OlympiaLociEngine.answerRound1('${this.escapeHtml(opt)}', '${this.escapeHtml(q.a)}', this)">
                                    <span class="olympia-opt-tag">${String.fromCharCode(65 + i)}</span>
                                    <span>${opt}</span>
                                </button>
                            `).join('');
                        })()}
                    </div>
                </div>
            `;
        },

        answerRound1(chosen, correct, btn) {
            const isCorrect = chosen === correct;
            if (isCorrect) {
                OlympiaAudio.correct();
                btn.classList.add('correct');
                this.players[0].score += 10;
                this.state.warmupCorrect++;
            } else {
                OlympiaAudio.wrong();
                btn.classList.add('wrong');
            }
            this.state.warmupAnswered++;
            this.renderPodium();

            setTimeout(() => {
                this.state.warmupQuestionIdx++;
                this.renderRound1();
            }, 350);
        },

        finishRound1() {
            // Giả lập điểm số 3 đối thủ trường chuyên
            if (!this.partyMode) {
                this.players[1].score = Math.floor(Math.random() * 3 + 3) * 10; // 30-50đ
                this.players[2].score = Math.floor(Math.random() * 3 + 4) * 10; // 40-60đ
                this.players[3].score = Math.floor(Math.random() * 3 + 3) * 10; // 30-50đ
            }
            this.renderPodium();

            const stage = document.getElementById('olympia-main-stage');
            if (!stage) return;
            stage.innerHTML = `
                <div style="text-align: center; padding: 20px 0;">
                    <div style="font-size: 48px; margin-bottom: 8px;">🔔 HẾT THỜI GIAN KHỞI ĐỘNG!</div>
                    <h3 style="font-size: 22px; font-weight: 800; color: #fde047; margin: 0 0 10px;">KẾT THÚC VÒNG 1: KHỞI ĐỘNG</h3>
                    <p style="font-size: 15px; color: #cbd5e1; margin: 0 0 24px;">Bạn đã trả lời đúng <b>${this.state.warmupCorrect}</b> câu và đạt <b>${this.players[0].score} điểm</b>!</p>

                    <div style="background: rgba(30, 41, 59, 0.7); border: 1.5px solid #38bdf8; border-radius: 18px; padding: 16px; max-width: 480px; margin: 0 auto 24px; text-align: left;">
                        <div style="font-size: 12px; font-weight: 800; color: #38bdf8; text-transform: uppercase; margin-bottom: 8px;">Bảng Điểm Sau Vòng 1:</div>
                        ${this.players.map(p => `
                            <div style="display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 14px;">
                                <span>${p.name} (${p.school}):</span>
                                <b style="color: #fde047;">${p.score} điểm</b>
                            </div>
                        `).join('')}
                    </div>

                    <button type="button" onclick="window.OlympiaLociEngine.startRound2Obstacle()"
                        style="background: linear-gradient(135deg, #10b981, #059669); border: none; border-radius: 99px; padding: 14px 40px; font-size: 16px; font-weight: 800; color: #fff; cursor: pointer; box-shadow: 0 0 24px rgba(16, 185, 129, 0.5);">
                        TIẾP TỤC VÀO VÒNG 2: VƯỢT CHƯỚNG NGẠI VẬT ➔
                    </button>
                </div>
            `;
        },

        // =========================================================================
        // VÒNG 2: VƯỢT CHƯỚNG NGẠI VẬT (4 HÀNG NGANG + BẤM CHUÔNG ĐOÁN TỪ KHÓA)
        // =========================================================================
        startRound2Obstacle() {
            this.currentRoundIndex = 2;
            this.state.obstacle = OLYMPIA_DATA.obstacles[Math.floor(Math.random() * OLYMPIA_DATA.obstacles.length)];
            this.state.obstacleRowsSolved = [];
            this.state.obstacleBuzzerLocked = false;
            OlympiaAudio.bell();
            this.renderRound2();
        },

        renderRound2() {
            const stage = document.getElementById('olympia-main-stage');
            if (!stage) return;
            const obs = this.state.obstacle;

            stage.innerHTML = `
                <div class="olympia-round-track">
                    <span class="round-step-btn">VÒNG 1: KHỞI ĐỘNG</span>
                    <span class="round-step-btn active">VÒNG 2: VƯỢT CHƯỚNG NGẠI VẬT</span>
                    <span class="round-step-btn">VÒNG 3: TĂNG TỐC</span>
                    <span class="round-step-btn">VÒNG 4: VỀ ĐÍCH</span>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1.15fr; gap: 24px; align-items: start;">
                    <!-- Cột Trái: Bức tranh Chướng ngại vật & Chuông bấm -->
                    <div style="text-align: center;">
                        <div class="cnv-image-frame">
                            <img src="${obs.hintImg}" alt="Chướng ngại vật" class="cnv-bg-img" onerror="this.src='assets/images/loci_avatar.jpg'">
                            <div class="cnv-tile cnv-tile-1 ${this.state.obstacleRowsSolved.includes(1) ? 'revealed' : ''}">1</div>
                            <div class="cnv-tile cnv-tile-2 ${this.state.obstacleRowsSolved.includes(2) ? 'revealed' : ''}">2</div>
                            <div class="cnv-tile cnv-tile-3 ${this.state.obstacleRowsSolved.includes(3) ? 'revealed' : ''}">3</div>
                            <div class="cnv-tile cnv-tile-4 ${this.state.obstacleRowsSolved.includes(4) ? 'revealed' : ''}">4</div>
                        </div>

                        <div style="background: rgba(30,41,59,0.7); border: 1.5px solid rgba(253,224,71,0.4); border-radius: 14px; padding: 10px 14px; margin-bottom: 16px;">
                            <span style="font-size: 11px; font-weight: 800; color: #fde047; text-transform: uppercase;">TỪ KHÓA BÍ MẬT GỒM:</span>
                            <div style="font-size: 16px; font-weight: 900; color: #fff; letter-spacing: 2px;">${obs.charCount}</div>
                        </div>

                        <!-- CHUÔNG BẤM GIÀNH QUYỀN ĐOÁN CNV -->
                        <button type="button" class="olympia-buzzer-btn" onclick="window.OlympiaLociEngine.promptGuessCNV()" ${this.state.obstacleBuzzerLocked ? 'disabled style="opacity:0.5; filter:grayscale(1);"' : ''}>
                            <span style="font-size: 20px;">🔔</span>
                            <span>BẤM CHUÔNG ĐOÁN CHƯỚNG NGẠI VẬT</span>
                        </button>
                    </div>

                    <!-- Cột Phải: 4 Hàng Ngang -->
                    <div>
                        <h4 style="font-size: 16px; font-weight: 800; color: #38bdf8; margin: 0 0 12px 0;">CHỌN HÀNG NGANG ĐỂ GIẢI MÃ (+10đ/câu):</h4>
                        <div style="display: flex; flex-direction: column; gap: 10px;">
                            ${obs.rows.map(row => {
                                const solved = this.state.obstacleRowsSolved.includes(row.id);
                                return `
                                    <div style="background: rgba(30, 41, 59, 0.85); border: 1.5px solid ${solved ? '#10b981' : 'rgba(148, 163, 184, 0.3)'}; border-radius: 14px; padding: 12px 16px;">
                                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                                            <b style="color: ${solved ? '#34d399' : '#fde047'}; font-size: 13.5px;">HÀNG NGANG ${row.id}</b>
                                            <span style="font-size: 11.5px; font-weight: 700; color: ${solved ? '#10b981' : '#94a3b8'};">
                                                ${solved ? '✓ ĐÃ MỞ: ' + row.answer : 'Chưa mở'}
                                            </span>
                                        </div>
                                        <p style="font-size: 13px; color: #e2e8f0; margin: 0 0 8px 0;">${row.q}</p>
                                        ${!solved ? `
                                            <button type="button" onclick="window.OlympiaLociEngine.solveRow(${row.id})"
                                                style="background: #0284c7; color: #fff; border: none; padding: 6px 14px; border-radius: 8px; font-size: 12px; font-weight: 700; cursor: pointer;">
                                                Trả lời hàng ngang này ➔
                                            </button>
                                        ` : ''}
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                </div>
            `;
        },

        solveRow(rowId) {
            const obs = this.state.obstacle;
            const row = obs.rows.find(r => r.id === rowId);
            if (!row) return;

            const ans = prompt(`${row.q}
(${row.clue})
Nhập câu trả lời của bạn:`);
            if (!ans) return;

            const cleanAns = ans.trim().toUpperCase();
            const correctAns = row.answer.toUpperCase();

            if (cleanAns === correctAns || cleanAns.replace(/[- ]/g, '') === correctAns.replace(/[- ]/g, '')) {
                OlympiaAudio.correct();
                alert(`CHÍNH XÁC! Bạn nhận được +10 điểm và mở miếng ghép số ${rowId}!`);
                this.players[0].score += 10;
                this.state.obstacleRowsSolved.push(rowId);
            } else {
                OlympiaAudio.wrong();
                alert(`Chưa chính xác! Đáp án đúng là: ${row.answer}. Miếng ghép số ${rowId} được hé mở.`);
                this.state.obstacleRowsSolved.push(rowId);
            }
            this.renderPodium();
            this.renderRound2();

            // AI Thí sinh có thể bấm chuông sau khi 2-3 hàng ngang đã mở
            if (!this.partyMode && this.state.obstacleRowsSolved.length >= 2 && Math.random() < 0.45) {
                setTimeout(() => {
                    const aiIdx = Math.floor(Math.random() * 3 + 1);
                    OlympiaAudio.bell();
                    alert(`🔔 THÍ SINH ${this.players[aiIdx].name} (${this.players[aiIdx].school}) ĐÃ BẤM CHUÔNG XIN TRẢ LỜI CHƯỚNG NGẠI VẬT!`);
                    alert(`Thí sinh ${this.players[aiIdx].name} đưa ra đáp án: "${obs.keyword}" và CHÍNH XÁC TUYỆT ĐỐI!`);
                    this.players[aiIdx].score += 60;
                    this.finishRound2(this.players[aiIdx].name);
                }, 800);
            }
        },

        promptGuessCNV() {
            OlympiaAudio.bell();
            const obs = this.state.obstacle;
            const ans = prompt(`BẠN ĐÃ BẤM CHUÔNG! Hãy nhập từ khóa Chướng ngại vật (${obs.charCount}):`);
            if (!ans) return;

            const cleanAns = ans.trim().toUpperCase().replace(/[- ]/g, '');
            const correctAns = obs.keyword.toUpperCase().replace(/[- ]/g, '');

            if (cleanAns === correctAns) {
                OlympiaAudio.fanfare();
                const bonus = 80 - (this.state.obstacleRowsSolved.length * 15);
                alert(`XUẤT SẮC! BẠN ĐÃ GIẢI ĐƯỢC CHƯỚNG NGẠI VẬT: "${obs.keyword}"!
Bạn nhận được +${bonus} điểm!`);
                this.players[0].score += bonus;
                this.finishRound2(this.players[0].name);
            } else {
                OlympiaAudio.buzzer();
                alert(`RẤT TIẾC! Câu trả lời "${ans}" chưa chính xác. Bạn bị khóa chuông trong phần thi Vượt chướng ngại vật!`);
                this.state.obstacleBuzzerLocked = true;
                this.renderRound2();
            }
        },

        finishRound2(winnerName) {
            this.renderPodium();
            const stage = document.getElementById('olympia-main-stage');
            if (!stage) return;
            const obs = this.state.obstacle;

            stage.innerHTML = `
                <div style="text-align: center; padding: 20px 0;">
                    <div style="font-size: 48px; margin-bottom: 8px;">🏆 CHƯỚNG NGẠI VẬT ĐÃ ĐƯỢC GIẢI MÃ!</div>
                    <h3 style="font-size: 24px; font-weight: 800; color: #fde047; margin: 0 0 6px;">TỪ KHÓA: ${obs.keyword}</h3>
                    <p style="font-size: 14px; color: #94a3b8; margin: 0 0 20px;">${obs.imageCaption}</p>

                    <div style="max-width: 440px; margin: 0 auto 24px; border-radius: 18px; overflow: hidden; border: 2px solid #10b981; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
                        <img src="${obs.hintImg}" alt="${obs.keyword}" style="width: 100%; display: block;" onerror="this.src='assets/images/loci_avatar.jpg'">
                    </div>

                    <button type="button" onclick="window.OlympiaLociEngine.startRound3Speedup()"
                        style="background: linear-gradient(135deg, #f59e0b, #d97706); border: none; border-radius: 99px; padding: 14px 44px; font-size: 16px; font-weight: 800; color: #fff; cursor: pointer; box-shadow: 0 0 24px rgba(245, 158, 11, 0.5);">
                        BƯỚC VÀO VÒNG 3: TĂNG TỐC ➔
                    </button>
                </div>
            `;
        },

        // =========================================================================
        // VÒNG 3: TĂNG TỐC (4 CÂU HỎI THỜI GIAN 10s - 20s - 30s - 40s)
        // =========================================================================
        startRound3Speedup() {
            this.currentRoundIndex = 3;
            this.state.speedupQuestionIdx = 0;
            OlympiaAudio.bell();
            this.renderRound3();
        },

        renderRound3() {
            const stage = document.getElementById('olympia-main-stage');
            if (!stage) return;
            const q = OLYMPIA_DATA.speedup[this.state.speedupQuestionIdx];

            this.roundSeconds = q.time;
            this.clearTimer();
            this.timerInterval = setInterval(() => {
                this.roundSeconds--;
                const clock = document.getElementById('speedup-clock');
                if (clock) clock.textContent = this.roundSeconds + 's';
                if (this.roundSeconds <= 0) {
                    this.clearTimer();
                    OlympiaAudio.buzzer();
                    this.resolveSpeedupQuestion(null, 99);
                }
            }, 1000);

            stage.innerHTML = `
                <div class="olympia-round-track">
                    <span class="round-step-btn">VÒNG 1: KHỞI ĐỘNG</span>
                    <span class="round-step-btn">VÒNG 2: VƯỢT CHƯỚNG NGẠI VẬT</span>
                    <span class="round-step-btn active">VÒNG 3: TĂNG TỐC (${this.state.speedupQuestionIdx + 1}/4)</span>
                    <span class="round-step-btn">VÒNG 4: VỀ ĐÍCH</span>
                </div>

                <div class="olympia-q-card">
                    <div class="olympia-timer-bar">
                        <div style="font-size: 13.5px; font-weight: 800; color: #f59e0b;">
                            CÂU HỎI TĂNG TỐC SỐ ${this.state.speedupQuestionIdx + 1} · THỜI GIAN ${q.time}S · ĐIỂM THƯỞNG: 40 - 30 - 20 - 10
                        </div>
                        <div class="olympia-clock-badge" id="speedup-clock" style="border-color: #f59e0b; color: #fde047;">${this.roundSeconds}s</div>
                    </div>

                    <div class="olympia-q-text">${q.q}</div>

                    <div class="olympia-options-grid">
                        ${(() => {
                            if (!q.shuffledOpts || q._shuffleKey !== ('s_' + this.state.speedupQuestionIdx)) {
                                q._shuffleKey = 's_' + this.state.speedupQuestionIdx;
                                q.shuffledOpts = [...q.opts].sort(() => Math.random() - 0.5);
                            }
                            return q.shuffledOpts.map((opt, i) => `
                                <button type="button" class="olympia-opt-btn" onclick="window.OlympiaLociEngine.selectSpeedupAnswer('${this.escapeHtml(opt)}')">
                                    <span class="olympia-opt-tag">${String.fromCharCode(65 + i)}</span>
                                    <span>${opt}</span>
                                </button>
                            `).join('');
                        })()}
                    </div>
                </div>
            `;
        },

        selectSpeedupAnswer(chosen) {
            this.clearTimer();
            const q = OLYMPIA_DATA.speedup[this.state.speedupQuestionIdx];
            const timeUsed = (q.time - this.roundSeconds) + (Math.random() * 0.8);
            this.resolveSpeedupQuestion(chosen, timeUsed);
        },

        resolveSpeedupQuestion(chosen, timeUsed) {
            const q = OLYMPIA_DATA.speedup[this.state.speedupQuestionIdx];
            const isUserCorrect = chosen === q.correct;

            // Giả lập thời gian và độ chính xác của 3 thí sinh AI
            const results = [
                { player: this.players[0], correct: isUserCorrect, time: isUserCorrect ? timeUsed : 99 }
            ];
            for (let i = 1; i <= 3; i++) {
                const aiCorrect = Math.random() < 0.75;
                const aiTime = aiCorrect ? (Math.random() * (q.time - 2) + 1.8) : 99;
                results.push({ player: this.players[i], correct: aiCorrect, time: aiTime });
            }

            // Sắp xếp các thí sinh trả lời đúng theo thời gian
            const correctOrder = results.filter(r => r.correct).sort((a, b) => a.time - b.time);
            const scoreTiers = [40, 30, 20, 10];
            correctOrder.forEach((r, idx) => {
                const pts = scoreTiers[idx] || 10;
                r.pointsAdded = pts;
                r.player.score += pts;
            });

            this.renderPodium();
            if (isUserCorrect) OlympiaAudio.correct(); else OlympiaAudio.wrong();

            const stage = document.getElementById('olympia-main-stage');
            if (!stage) return;

            stage.innerHTML = `
                <div class="olympia-q-card" style="text-align: center;">
                    <div style="font-size: 36px; margin-bottom: 6px;">${isUserCorrect ? '🎯 CHÍNH XÁC!' : '❌ CHƯA CHÍNH XÁC!'}</div>
                    <div style="font-size: 16px; color: #fde047; font-weight: 800; margin-bottom: 12px;">Đáp án đúng: ${q.correct}</div>
                    <p style="font-size: 13.5px; color: #cbd5e1; margin-bottom: 20px;">${q.explain}</p>

                    <div style="background: rgba(15, 23, 42, 0.8); border: 1.5px solid rgba(56,189,248,0.3); border-radius: 16px; padding: 14px; max-width: 500px; margin: 0 auto 20px; text-align: left;">
                        <div style="font-size: 12px; font-weight: 800; color: #38bdf8; text-transform: uppercase; margin-bottom: 8px;">KẾT QUẢ TĂNG TỐC CÂU ${this.state.speedupQuestionIdx + 1}:</div>
                        ${results.map(r => `
                            <div style="display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 13.5px;">
                                <span>${r.player.name}:</span>
                                <b>${r.correct ? `<span style="color:#10b981;">✓ ${r.time.toFixed(2)}s (+${r.pointsAdded}đ)</span>` : '<span style="color:#ef4444;">Sai (0đ)</span>'}</b>
                            </div>
                        `).join('')}
                    </div>

                    ${this.state.speedupQuestionIdx < 3 ? `
                        <button type="button" onclick="window.OlympiaLociEngine.nextSpeedupQuestion()"
                            style="background: #0284c7; color: #fff; border: none; padding: 12px 32px; border-radius: 99px; font-weight: 800; font-size: 15px; cursor: pointer;">
                            Sang câu Tăng tốc tiếp theo (${this.state.speedupQuestionIdx + 2}/4) ➔
                        </button>
                    ` : `
                        <button type="button" onclick="window.OlympiaLociEngine.startRound4Finish()"
                            style="background: linear-gradient(135deg, #e11d48, #be123c); color: #fff; border: none; padding: 14px 40px; border-radius: 99px; font-weight: 900; font-size: 16px; cursor: pointer; box-shadow: 0 0 25px rgba(225, 29, 72, 0.6);">
                            BƯỚC VÀO VÒNG 4: VỀ ĐÍCH QUYẾT ĐỊNH ➔
                        </button>
                    `}
                </div>
            `;
        },

        nextSpeedupQuestion() {
            this.state.speedupQuestionIdx++;
            this.renderRound3();
        },

        // =========================================================================
        // VÒNG 4: VỀ ĐÍCH (GÓI 20-30đ + NGÔI SAO HY VỌNG + BẤM CHUÔNG CƯỚP ĐIỂM)
        // =========================================================================
        startRound4Finish() {
            this.currentRoundIndex = 4;
            this.state.finishTurnPlayerIdx = 0; // Bắt đầu lượt của bạn
            this.state.finishQuestionIdx = 0;
            this.state.hopeStarActive = false;
            OlympiaAudio.bell();
            this.renderRound4();
        },

        renderRound4() {
            const stage = document.getElementById('olympia-main-stage');
            if (!stage) return;
            this.renderPodium();

            const p = this.players[this.state.finishTurnPlayerIdx];
            const q = OLYMPIA_DATA.finish[this.state.finishQuestionIdx % OLYMPIA_DATA.finish.length];

            stage.innerHTML = `
                <div class="olympia-round-track">
                    <span class="round-step-btn">VÒNG 1: KHỞI ĐỘNG</span>
                    <span class="round-step-btn">VÒNG 2: VƯỢT CHƯỚNG NGẠI VẬT</span>
                    <span class="round-step-btn">VÒNG 3: TĂNG TỐC</span>
                    <span class="round-step-btn active">VÒNG 4: VỀ ĐÍCH (${p.name})</span>
                </div>

                <div class="olympia-q-card">
                    <div class="olympia-timer-bar">
                        <div style="font-size: 13.5px; font-weight: 800; color: #f43f5e;">
                            LƯỢT VỀ ĐÍCH: <b>${p.name.toUpperCase()}</b> · CÂU HỎI ${q.points} ĐIỂM
                        </div>
                        ${!p.hopeStarUsed && p.isUser ? `
                            <button type="button" class="hope-star-btn" onclick="window.OlympiaLociEngine.toggleHopeStar(this)" id="btn-hope-star">
                                <span>⭐</span>
                                <span>ĐẶT NGÔI SAO HY VỌNG (x2 ĐIỂM)</span>
                            </button>
                        ` : (this.state.hopeStarActive ? '<span style="color:#fde047; font-weight:900;">⭐ ĐANG BẬT NGÔI SAO HY VỌNG!</span>' : '')}
                    </div>

                    <div class="olympia-q-text">${q.q}</div>

                    <div class="olympia-options-grid">
                        ${(() => {
                            if (!q.shuffledOpts || q._shuffleKey !== ('f_' + this.state.finishQuestionIdx)) {
                                q._shuffleKey = 'f_' + this.state.finishQuestionIdx;
                                q.shuffledOpts = [...q.opts].sort(() => Math.random() - 0.5);
                            }
                            return q.shuffledOpts.map((opt, i) => `
                                <button type="button" class="olympia-opt-btn" onclick="window.OlympiaLociEngine.answerRound4('${this.escapeHtml(opt)}', '${this.escapeHtml(q.a)}', ${q.points})">
                                    <span class="olympia-opt-tag">${String.fromCharCode(65 + i)}</span>
                                    <span>${opt}</span>
                                </button>
                            `).join('');
                        })()}
                    </div>
                </div>
            `;
        },

        toggleHopeStar(btn) {
            OlympiaAudio.hopeStar();
            this.state.hopeStarActive = true;
            this.players[0].hopeStarUsed = true;
            btn.style.background = '#15803d';
            btn.style.borderColor = '#4ade80';
            btn.innerHTML = '<span>⭐ ĐÃ ĐẶT NGÔI SAO HY VỌNG (x2)!</span>';
        },

        answerRound4(chosen, correct, pts) {
            const p = this.players[this.state.finishTurnPlayerIdx];
            const isCorrect = chosen === correct;
            const star = this.state.hopeStarActive;

            if (isCorrect) {
                OlympiaAudio.correct();
                const gained = star ? pts * 2 : pts;
                p.score += gained;
                alert(`CHÍNH XÁC! ${p.name} nhận được +${gained} điểm ${star ? '(Đã nhân đôi Ngôi sao hy vọng ⭐)' : ''}!`);
            } else {
                OlympiaAudio.wrong();
                const lost = star ? pts : 0;
                p.score -= lost;
                alert(`CHƯA CHÍNH XÁC! ${p.name} bị trừ ${lost} điểm. Chuông giành quyền trả lời mở ra cho 3 thí sinh còn lại!`);
                // 3 Thí sinh còn lại bấm chuông
                if (!this.partyMode) {
                    const stealerIdx = Math.floor(Math.random() * 3 + 1);
                    OlympiaAudio.bell();
                    alert(`🔔 Thí sinh ${this.players[stealerIdx].name} bấm chuông giành quyền trả lời!`);
                    if (Math.random() < 0.6) {
                        OlympiaAudio.correct();
                        this.players[stealerIdx].score += pts;
                        alert(`Thí sinh ${this.players[stealerIdx].name} trả lời đúng và nhận được +${pts} điểm!`);
                    } else {
                        OlympiaAudio.buzzer();
                        this.players[stealerIdx].score -= Math.floor(pts / 2);
                        alert(`Thí sinh ${this.players[stealerIdx].name} trả lời sai và bị trừ ${Math.floor(pts / 2)} điểm!`);
                    }
                }
            }

            this.state.hopeStarActive = false;
            this.renderPodium();

            // Nếu người dùng vừa thi xong 2 câu về đích -> kết thúc và trao giải
            if (this.state.finishQuestionIdx < 1) {
                this.state.finishQuestionIdx++;
                this.renderRound4();
            } else {
                this.renderCoronationCeremony();
            }
        },

        // =========================================================================
        // 5. LỄ TRAO VÒNG NGUYỆT QUẾ HOÀNG QUANG (CORONATION CEREMONY)
        // =========================================================================
        renderCoronationCeremony() {
            this.currentRoundIndex = 5;
            OlympiaAudio.fanfare();
            this.renderPodium();

            const stage = document.getElementById('olympia-main-stage');
            if (!stage) return;

            // Xếp hạng 4 thí sinh
            const ranking = [...this.players].sort((a, b) => b.score - a.score);
            const champ = ranking[0];
            const isMeChamp = champ.isUser;

            stage.innerHTML = `
                <div style="text-align: center; padding: 20px 0;">
                    <div style="font-size: 64px; margin-bottom: 8px; animation: starGlow 1.5s infinite alternate;">🌿</div>
                    <h2 style="font-size: 32px; font-weight: 900; color: #fde047; margin: 0 0 6px; text-shadow: 0 0 30px rgba(253, 224, 71, 0.7);">
                        ${isMeChamp ? 'CHÚC MỪNG QUÁN QUÂN ĐƯỜNG LÊN ĐỈNH LOCI!' : `QUÁN QUÂN: ${champ.name.toUpperCase()}!`}
                    </h2>
                    <p style="font-size: 15px; color: #cbd5e1; margin: 0 0 28px;">
                        ${isMeChamp ? 'Bạn đã xuất sắc đánh bại các đối thủ trường chuyên và vinh dự nhận Vòng Nguyệt Quế Hoàng Quang Loci!' : 'Bạn đã có một trận đấu quả cảm và tích lũy thêm nhiều tri thức quý giá!'}
                    </p>

                    <!-- BỤC VINH QUANG 4 VỊ TRÍ -->
                    <div style="display: flex; justify-content: center; align-items: flex-end; gap: 14px; max-width: 650px; margin: 0 auto 30px; padding: 0 10px;">
                        <!-- HẠNG 2 -->
                        <div style="flex: 1; text-align: center;">
                            <div style="font-size: 18px; margin-bottom: 4px;">🥈</div>
                            <div style="font-size: 13px; font-weight: 800; color: #f1f5f9; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${ranking[1].name}</div>
                            <div style="font-size: 16px; font-weight: 900; color: #cbd5e1; margin-bottom: 8px;">${ranking[1].score}đ</div>
                            <div style="background: linear-gradient(180deg, #94a3b8, #475569); height: 90px; border-radius: 12px 12px 0 0; display: grid; place-items: center; font-size: 20px; font-weight: 900; color: #fff;">2</div>
                        </div>

                        <!-- HẠNG 1 (QUÁN QUÂN) -->
                        <div style="flex: 1.25; text-align: center;">
                            <div style="font-size: 32px; margin-bottom: 4px; animation: starGlow 1s infinite alternate;">👑</div>
                            <div style="font-size: 15px; font-weight: 900; color: #fde047; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${ranking[0].name}</div>
                            <div style="font-size: 22px; font-weight: 900; color: #facc15; margin-bottom: 8px;">${ranking[0].score}đ</div>
                            <div style="background: linear-gradient(180deg, #eab308, #ca8a04); height: 135px; border-radius: 16px 16px 0 0; display: grid; place-items: center; font-size: 28px; font-weight: 900; color: #fff; box-shadow: 0 0 30px rgba(234, 179, 8, 0.5);">1</div>
                        </div>

                        <!-- HẠNG 3 -->
                        <div style="flex: 1; text-align: center;">
                            <div style="font-size: 18px; margin-bottom: 4px;">🥉</div>
                            <div style="font-size: 13px; font-weight: 800; color: #f1f5f9; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${ranking[2].name}</div>
                            <div style="font-size: 16px; font-weight: 900; color: #cbd5e1; margin-bottom: 8px;">${ranking[2].score}đ</div>
                            <div style="background: linear-gradient(180deg, #b45309, #78350f); height: 70px; border-radius: 12px 12px 0 0; display: grid; place-items: center; font-size: 18px; font-weight: 900; color: #fff;">3</div>
                        </div>
                    </div>

                    <!-- NÚT HÀNH ĐỘNG -->
                    <div style="display: flex; justify-content: center; gap: 14px; flex-wrap: wrap;">
                        <button type="button" onclick="window.OlympiaLociEngine.renderLobby()"
                            style="background: #0284c7; color: #fff; border: none; padding: 14px 32px; border-radius: 99px; font-weight: 800; font-size: 15px; cursor: pointer; box-shadow: 0 0 20px rgba(2, 132, 199, 0.4);">
                            Thi Đấu Trận Mới ➔
                        </button>
                        <button type="button" onclick="window.OlympiaLociEngine.close()"
                            style="background: rgba(255, 255, 255, 0.15); color: #fff; border: 1px solid rgba(255, 255, 255, 0.25); padding: 14px 26px; border-radius: 99px; font-weight: 700; font-size: 14.5px; cursor: pointer;">
                            Đóng Sân Khấu ✕
                        </button>
                    </div>
                </div>
            `;
        },

        clearTimer() {
            if (this.timerInterval) {
                clearInterval(this.timerInterval);
                this.timerInterval = null;
            }
        },

        escapeHtml(str) {
            return String(str).replace(/"/g, '&quot;').replace(/'/g, '&#39;');
        }
    };

    global.OlympiaLociEngine = OlympiaLociEngine;

    // Tự khởi tạo khi DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => OlympiaLociEngine.init());
    } else {
        OlympiaLociEngine.init();
    }

})(typeof window !== 'undefined' ? window : this);
