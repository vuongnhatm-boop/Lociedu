/**
 * ═══════════════════════════════════════════════════════════════════════════
 * KHO MÔ HÌNH 3D LỊCH SỬ & 3D INSPECTOR CHO PHÒNG 360°
 * DỰ ÁN CUNG ĐIỆN KÝ ỨC LOCI EDU (NCKH)
 * ═══════════════════════════════════════════════════════════════════════════
 * - Cung cấp thanh trượt Dock chọn mô hình 3D (Bài 6, 7, 8) ngay trong không gian 360.
 * - Khung nổi 3D Inspector tương tác xoay 360°, phóng to/thu nhỏ, ngắm hiện vật.
 * - Tích hợp kiến thức cốt lõi SGK Lịch sử 12 + Trắc nghiệm Mini-Quiz ôn tập nhanh.
 * - Hỗ trợ ghim mốc 3D trực tiếp vào tọa độ 360° và mở chế độ AR camera thực tế.
 */

(function init3DModelPicker() {
    'use strict';

    // ─── 1. DANH MỤC 27 MÔ HÌNH 3D CHUẨN LỊCH SỬ 12 (BÀI 6, 7, 8) ───────────
    const ALL_3D_MODELS = [
        // BÀI 6: CÁCH MẠNG THÁNG TÁM 1945
        {
            id: 'b6_m1_bao_lua_the_gioi',
            lessonKey: 'bai_6',
            lessonName: 'Bài 6: Cách mạng Tháng Tám (1945)',
            order: 1,
            badge: 'BÀI 6 · TRẠM 1',
            icon: '💣',
            title: 'Quả bom nguyên tử Little Boy & Thời cơ ngàn năm có một',
            url: 'assets/models/tram1/little_boy_atomic_bomb.glb',
            scale: 0.35,
            summary: 'Tháng 8/1945, Chiến tranh thế giới thứ hai bước vào giai đoạn kết thúc. Mỹ ném 2 quả bom nguyên tử xuống Hiroshima và Nagasaki; Liên Xô đánh tan đạo quân Quan Đông của Nhật. Nhật hoàng tuyên bố đầu hàng Đồng minh không điều kiện, tạo ra thời cơ khách quan thuận lợi ngàn năm có một cho Cách mạng Việt Nam.',
            keyPoints: [
                'Ngày 06/08 và 09/08/1945: Mỹ ném 2 quả bom nguyên tử xuống Hiroshima và Nagasaki.',
                'Ngày 08/08/1945: Liên Xô tuyên chiến với phát xít Nhật, tiêu diệt đạo quân Quan Đông.',
                'Ngày 15/08/1945: Nhật hoàng tuyên bố đầu hàng Đồng minh vô điều kiện.',
                'Thời cơ ngàn năm có một: Kẻ thù chính gục ngã, chính quyền tay sai hoang mang rệu rã.'
            ],
            mnemonic: 'Nhớ mốc bom nổ - Nhật hàng - Thời cơ chín muồi giành chính quyền.',
            quiz: {
                question: 'Sự kiện quốc tế nào trực tiếp báo hiệu thời cơ Cách mạng Tháng Tám 1945 đã chín muồi?',
                options: [
                    'Mỹ ném bom nguyên tử và Nhật hoàng tuyên bố đầu hàng Đồng minh không điều kiện',
                    'Đồng minh đổ bộ thành công vào Normandie giải phóng nước Pháp',
                    'Hội nghị Ianta phân chia khu vực ảnh hưởng kết thúc',
                    'Liên Hợp Quốc chính thức được thành lập tại San Francisco'
                ],
                answer: 0,
                explanation: 'Ngày 15/8/1945, Nhật hoàng đầu hàng Đồng minh không điều kiện, quân Nhật ở Đông Dương tê liệt, chính quyền tay sai hoang mang cùng cực, tạo thời cơ thuận lợi chưa từng có.'
            }
        },
        {
            id: 'b6_m2_lan_na_nua',
            lessonKey: 'bai_6',
            lessonName: 'Bài 6: Cách mạng Tháng Tám (1945)',
            order: 2,
            badge: 'BÀI 6 · TRẠM 2',
            icon: '🏡',
            title: 'Lán Nà Nưa lịch sử & Quân lệnh số 1 Khởi nghĩa',
            url: 'assets/models/tram2/lan_na_nua_opt.glb',
            scale: 0.85,
            summary: 'Lán Nà Nưa (Tân Trào, Tuyên Quang) là nơi Chủ tịch Hồ Chí Minh ở và chỉ đạo phong trào chuẩn bị Tổng khởi nghĩa. Tại đây, Người đã ra chỉ thị lịch sử: "Dù hy sinh tới đâu, dù phải đốt cháy cả dãy Trường Sơn cũng phải kiên quyết giành cho được độc lập". Ủy ban Khởi nghĩa toàn quốc ban bố Quân lệnh số 1 phát lệnh Tổng khởi nghĩa.',
            keyPoints: [
                'Địa điểm lịch sử: Lán Nà Nưa, thôn Tân Lập, Tân Trào, Tuyên Quang.',
                'Đêm 13/08/1945: Ủy ban Khởi nghĩa toàn quốc ban bố Quân lệnh số 1 chính thức phát động Tổng khởi nghĩa.',
                'Hội nghị toàn quốc của Đảng (14 - 15/8/1945) quyết định phát động toàn dân Tổng khởi nghĩa giành chính quyền trước khi quân Đồng minh vào.'
            ],
            mnemonic: 'Nà Nưa lán nhỏ - Quyết tâm cháy Trường Sơn - Quân lệnh số 1 phát động.',
            quiz: {
                question: 'Quân lệnh số 1 phát lệnh Tổng khởi nghĩa toàn quốc được ban bố vào thời gian nào?',
                options: [
                    'Đêm ngày 13 tháng 8 năm 1945',
                    'Sáng ngày 16 tháng 8 năm 1945',
                    'Ngày 19 tháng 8 năm 1945',
                    'Ngày 02 tháng 9 năm 1945'
                ],
                answer: 0,
                explanation: 'Đêm 13/8/1945, Ủy ban Khởi nghĩa toàn quốc họp tại Tân Trào đã ban bố Quân lệnh số 1, chính thức phát động Tổng khởi nghĩa toàn quốc.'
            }
        },
        {
            id: 'b6_m3_dinh_tan_trao',
            lessonKey: 'bai_6',
            lessonName: 'Bài 6: Cách mạng Tháng Tám (1945)',
            order: 3,
            badge: 'BÀI 6 · TRẠM 3',
            icon: '🏛️',
            title: 'Hội trường Đình Tân Trào & Quốc dân Đại hội',
            url: 'assets/models/tram3/uy_ban.glb',
            scale: 0.75,
            summary: 'Ngày 16 và 17/8/1945, Quốc dân Đại hội Tân Trào họp dưới mái đình Tân Trào lịch sử. Đại hội tán thành quyết định Tổng khởi nghĩa của Đảng, thông qua 10 chính sách lớn của Việt Minh, cử ra Ủy ban Dân tộc Giải phóng Việt Nam (Chính phủ lâm thời) do đồng chí Hồ Chí Minh làm Chủ tịch.',
            keyPoints: [
                'Ngày 16 - 17/08/1945: Quốc dân Đại hội họp tại Đình Tân Trào.',
                'Thông qua 10 chính sách lớn của Mặt trận Việt Minh.',
                'Bầu ra Ủy ban Dân tộc Giải phóng Việt Nam (Hồ Chí Minh làm Chủ tịch).',
                'Quy định Quốc kỳ cờ đỏ sao vàng và Quốc ca là bài Tiến quân ca.'
            ],
            mnemonic: 'Đình Tân Trào - Quốc dân đại hội - Cờ đỏ sao vàng - Bác làm Chủ tịch.',
            quiz: {
                question: 'Cơ quan nào được Quốc dân Đại hội Tân Trào bầu ra mang tư cách là Chính phủ lâm thời?',
                options: [
                    'Ủy ban Dân tộc Giải phóng Việt Nam',
                    'Ủy ban Khởi nghĩa toàn quốc',
                    'Tổng bộ Việt Minh',
                    'Ủy ban Hành chính Kháng chiến'
                ],
                answer: 0,
                explanation: 'Quốc dân Đại hội Tân Trào đã bầu ra Ủy ban Dân tộc Giải phóng Việt Nam do Hồ Chí Minh làm Chủ tịch, có tư cách như Chính phủ lâm thời của nước Việt Nam mới.'
            }
        },
        {
            id: 'b6_m4_duong_thai_nguyen',
            lessonKey: 'bai_6',
            lessonName: 'Bài 6: Cách mạng Tháng Tám (1945)',
            order: 4,
            badge: 'BÀI 6 · TRẠM 4',
            icon: '🚩',
            title: 'Đoàn quân giải phóng Thái Nguyên & Bốn tỉnh sớm nhất',
            url: 'assets/models/tram4/nguoi_dan_khoi_nghia.glb',
            scale: 0.85,
            summary: 'Chiều 16/8/1945, một đội Giải phóng quân do đồng chí Võ Nguyên Giáp chỉ huy tiến về giải phóng thị xã Thái Nguyên, mở đường tiến về đồng bằng Bắc Bộ. Cùng lúc đó, nhân dân 4 tỉnh giành chính quyền sớm nhất cả nước: Bắc Giang, Hải Dương, Hà Tĩnh, Quảng Nam (18/8/1945).',
            keyPoints: [
                'Chiều 16/08/1945: Đồng chí Võ Nguyên Giáp chỉ huy Giải phóng quân xuất phát từ Cây đa Tân Trào tiến đánh Thái Nguyên.',
                'Ngày 18/08/1945: Bốn tỉnh giành chính quyền sớm nhất nước: Bắc Giang, Hải Dương, Hà Tĩnh, Quảng Nam.',
                'Khí thế cách mạng bùng sôi khắp nông thôn và đô thị tạo thế bao vây cô lập địch.'
            ],
            mnemonic: 'Bắc Giang - Hải Dương - Hà Tĩnh - Quảng Nam: 4 tỉnh tiên phong ngày 18/8.',
            quiz: {
                question: 'Bốn tỉnh giành được chính quyền sớm nhất trong cả nước ngày 18/8/1945 là:',
                options: [
                    'Bắc Giang, Hải Dương, Hà Tĩnh, Quảng Nam',
                    'Hà Nội, Huế, Sài Gòn, Hải Phòng',
                    'Tuyên Quang, Thái Nguyên, Cao Bằng, Lạng Sơn',
                    'Nghệ An, Hà Tĩnh, Quảng Bình, Quảng Trị'
                ],
                answer: 0,
                explanation: 'Ngày 18/8/1945, 4 tỉnh giành được chính quyền ở tỉnh lị sớm nhất cả nước là Bắc Giang, Hải Dương, Hà Tĩnh và Quảng Nam.'
            }
        },
        {
            id: 'b6_m5_nha_hat_lon',
            lessonKey: 'bai_6',
            lessonName: 'Bài 6: Cách mạng Tháng Tám (1945)',
            order: 5,
            badge: 'BÀI 6 · TRẠM 5',
            icon: '🎭',
            title: 'Mít tinh khởi nghĩa Nhà hát Lớn Hà Nội (19/8/1945)',
            url: 'assets/models/tram5/mit_tinh_nha_hat_lon.glb',
            scale: 0.90,
            summary: 'Sáng 19/8/1945, hàng vạn quần chúng nhân dân Hà Nội mang theo cờ đỏ sao vàng tập trung tại Quảng trường Nhà hát Lớn. Cuộc mít tinh nhanh chóng biến thành cuộc tuần hành vũ trang, đánh chiếm Phủ Khâm sai, Tòa Thị chính, Trại Bảo an binh... Hà Nội hoàn toàn về tay nhân dân, cổ vũ mạnh mẽ phong trào toàn quốc.',
            keyPoints: [
                'Sáng 19/08/1945: Biển người cuồn cuộn đổ về Quảng trường Nhà hát Lớn mít tinh.',
                'Cuộc mít tinh biến thành biểu tình vũ trang chiếm các cơ quan đầu não của tay sai bù nhìn.',
                'Đến tối 19/08/1945, cuộc khởi nghĩa tại Hà Nội hoàn toàn thắng lợi.',
                'Thắng lợi tại Hà Nội tạo xung lực quyết định đẩy nhanh cách mạng trên khắp cả nước.'
            ],
            mnemonic: '19/8 Hà Nội mít tinh rực lửa - Cờ đỏ sao vàng tung bay Nhà hát Lớn.',
            quiz: {
                question: 'Khởi nghĩa giành chính quyền thắng lợi ở Hà Nội diễn ra vào ngày nào?',
                options: [
                    'Ngày 19 tháng 8 năm 1945',
                    'Ngày 16 tháng 8 năm 1945',
                    'Ngày 23 tháng 8 năm 1945',
                    'Ngày 25 tháng 8 năm 1945'
                ],
                answer: 0,
                explanation: 'Ngày 19/8/1945, cuộc khởi nghĩa giành chính quyền ở Hà Nội toàn thắng, có ý nghĩa quyết định thúc đẩy khí thế cả nước tiến lên.'
            }
        },
        {
            id: 'b6_m6_ngo_mon_sai_gon',
            lessonKey: 'bai_6',
            lessonName: 'Bài 6: Cách mạng Tháng Tám (1945)',
            order: 6,
            badge: 'BÀI 6 · TRẠM 6',
            icon: '✊',
            title: 'Khởi nghĩa giành chính quyền ở Huế & Sài Gòn',
            url: 'assets/models/bai7/tram2/nhan_dan_nambo_chien_dau.glb',
            scale: 0.85,
            summary: 'Sau thắng lợi ở Hà Nội, cuộc khởi nghĩa tiếp tục bùng nổ ở các đô thị lớn. Ngày 23/8/1945, nhân dân Thừa Thiên Huế giành chính quyền, cô lập hoàng cung triều Nguyễn. Ngày 25/8/1945, hơn một triệu đồng bào Sài Gòn - Chợ Lớn rầm rộ khởi nghĩa làm chủ thành phố. Cả ba trung tâm Hà Nội - Huế - Sài Gòn toàn thắng.',
            keyPoints: [
                'Ngày 23/08/1945: Khởi nghĩa thắng lợi ở Huế, trung tâm đầu não của chế độ phong kiến.',
                'Ngày 25/08/1945: Hơn một triệu quần chúng Sài Gòn - Gia Định quật khởi làm chủ đô thành.',
                'Sự thắng lợi liên tiếp tại Hà Nội, Huế, Sài Gòn đã quyết định thắng lợi của CMT8 trên toàn quốc.'
            ],
            mnemonic: 'Hà Nội (19/8) ➔ Huế (23/8) ➔ Sài Gòn (25/8): Ba đòn sấm sét chấn động non sông.',
            quiz: {
                question: 'Thứ tự thắng lợi của khởi nghĩa giành chính quyền tại ba đô thị lớn trong CMT8 1945 là:',
                options: [
                    'Hà Nội ➔ Huế ➔ Sài Gòn',
                    'Huế ➔ Hà Nội ➔ Sài Gòn',
                    'Sài Gòn ➔ Hà Nội ➔ Huế',
                    'Hà Nội ➔ Sài Gòn ➔ Huế'
                ],
                answer: 0,
                explanation: 'Hà Nội giành chính quyền ngày 19/8, Huế ngày 23/8 và Sài Gòn ngày 25/8/1945.'
            }
        },
        {
            id: 'b6_m7_hoang_trieu_cao_chung',
            lessonKey: 'bai_6',
            lessonName: 'Bài 6: Cách mạng Tháng Tám (1945)',
            order: 7,
            badge: 'BÀI 6 · TRẠM 7',
            icon: '👑',
            title: 'Vua Bảo Đại thoái vị — Chấm dứt chế độ phong kiến ngàn năm',
            url: 'assets/models/tram7/vua_bao_dai_thoai_vi.glb',
            scale: 0.85,
            summary: 'Chiều ngày 30/8/1945, trước hàng vạn nhân dân tại Ngọ Môn (Huế), vua Bảo Đại đọc Chiếu thoái vị và trao lại ấn kiếm bằng vàng cho đại diện Chính phủ lâm thời nước Việt Nam Dân chủ Cộng hòa, với câu nói nổi tiếng: "Trẫm muốn làm dân một nước tự do hơn làm vua một nước nô lệ". Chế độ phong kiến chính thức cáo chung.',
            keyPoints: [
                'Ngày 30/08/1945: Vua Bảo Đại trao quốc ấn và bảo kiếm cho đại diện phái đoàn Chính phủ.',
                'Chấm dứt hoàn toàn triều đại nhà Nguyễn (1802 - 1945) và chế độ phong kiến hàng ngàn năm.',
                'Việt Nam chuyển từ chế độ quân chủ chuyên chế sang chế độ dân chủ cộng hòa.'
            ],
            mnemonic: '30/8 Ngọ Môn trao ấn kiếm - Xóa bỏ ngai vàng - Độc lập tự do.',
            quiz: {
                question: 'Sự kiện vua Bảo Đại tuyên bố thoái vị ngày 30/8/1945 mang ý nghĩa lịch sử gì?',
                options: [
                    'Xóa bỏ hoàn toàn chế độ quân chủ phong kiến ngàn năm ở Việt Nam',
                    'Đánh đuổi hoàn toàn quân phát xít Nhật ra khỏi bờ cõi',
                    'Buộc thực dân Pháp phải công nhận độc lập của Việt Nam',
                    'Hoàn thành cách mạng ruộng đất cho nông dân'
                ],
                answer: 0,
                explanation: 'Việc Bảo Đại trao ấn kiếm cho phái đoàn Chính phủ ngày 30/8/1945 đã chính thức chấm dứt chế độ phong kiến tồn tại hàng ngàn năm tại Việt Nam.'
            }
        },
        {
            id: 'b6_m8_quang_truong_ba_dinh',
            lessonKey: 'bai_6',
            lessonName: 'Bài 6: Cách mạng Tháng Tám (1945)',
            order: 8,
            badge: 'BÀI 6 · TRẠM 8',
            icon: '📜',
            title: 'Bác Hồ đọc Tuyên ngôn Độc lập — Quảng trường Ba Đình (2/9/1945)',
            url: 'assets/models/tram8/bac_ho_tuyen_ngon.glb',
            scale: 0.85,
            summary: 'Ngày 2/9/1945, tại Quảng trường Ba Đình lịch sử, Chủ tịch Hồ Chí Minh thay mặt Chính phủ lâm thời trịnh trọng đọc bản Tuyên ngôn Độc lập, tuyên bố với quốc dân và toàn thế giới: Nước Việt Nam Dân chủ Cộng hòa ra đời. Nước Việt Nam có quyền hưởng tự do và độc lập, và sự thật đã thành một nước tự do, độc lập.',
            keyPoints: [
                'Ngày 02/09/1945: Ngày Quốc khánh của nước Việt Nam Dân chủ Cộng hòa.',
                'Văn kiện lịch sử: Tuyên ngôn Độc lập khẳng định quyền bình đẳng, quyền tự do và quyền mưu cầu hạnh phúc.',
                'Đập tan ách thống trị thực dân Pháp hơn 80 năm và ách phát xít Nhật gần 5 năm.',
                'Khai sinh ra nhà nước công nông đầu tiên ở Đông Nam Á.'
            ],
            mnemonic: 'Mùng 2 tháng 9 Ba Đình - Bác đọc Tuyên ngôn - Khai sinh nước Việt Nam.',
            quiz: {
                question: 'Bản Tuyên ngôn Độc lập do Chủ tịch Hồ Chí Minh đọc ngày 2/9/1945 đã khai sinh ra nhà nước nào?',
                options: [
                    'Nước Việt Nam Dân chủ Cộng hòa',
                    'Nước Cộng hòa Xã hội Chủ nghĩa Việt Nam',
                    'Nước Việt Nam Độc lập Đồng minh',
                    'Chính phủ Cách mạng Lâm thời miền Nam Việt Nam'
                ],
                answer: 0,
                explanation: 'Ngày 2/9/1945, Chủ tịch Hồ Chí Minh đọc Tuyên ngôn Độc lập khai sinh nước Việt Nam Dân chủ Cộng hòa.'
            }
        },
        {
            id: 'b6_m9_phong_vang_son',
            lessonKey: 'bai_6',
            lessonName: 'Bài 6: Cách mạng Tháng Tám (1945)',
            order: 9,
            badge: 'BÀI 6 · TRẠM 9',
            icon: '⭐',
            title: 'Đài Thắng Lợi & Nguyên nhân, Ý nghĩa lịch sử CMT8',
            url: 'assets/models/bai7/tram8/chien_thang_dien_bien_phu.glb',
            scale: 0.80,
            summary: 'Cách mạng Tháng Tám thành công vẻ vang trong vòng 15 ngày nhờ đường lối đúng đắn của Đảng đứng đầu là Chủ tịch Hồ Chí Minh, khối đại đoàn kết toàn dân và tinh thần quật khởi sẵn sàng hy sinh. Thắng lợi đã mở ra kỷ nguyên mới: Kỷ nguyên độc lập, tự do và nhân dân lao động làm chủ vận mệnh đất nước.',
            keyPoints: [
                'Thời gian diễn ra chớp nhoáng: Chỉ trong vòng 15 ngày (từ 14/8 đến 28/8/1945).',
                'Nguyên nhân chủ quan quyết định: Sự lãnh đạo tài tình của Đảng Cộng sản Đông Dương.',
                'Ý nghĩa trong nước: Mở ra kỷ nguyên độc lập, tự do, nhân dân làm chủ non sông.',
                'Ý nghĩa quốc tế: Cổ vũ phong trào giải phóng dân tộc của các nước thuộc địa trên thế giới.'
            ],
            mnemonic: '15 ngày thần tốc - Mở kỷ nguyên độc lập - Tự do làm chủ.',
            quiz: {
                question: 'Nhân tố chủ quan có ý nghĩa quyết định nhất dẫn đến thắng lợi của CMT8 năm 1945 là gì?',
                options: [
                    'Sự lãnh đạo đúng đắn, tài tình của Đảng Cộng sản Đông Dương đứng đầu là Hồ Chí Minh',
                    'Sự ủng hộ to lớn về vũ khí và tiền bạc từ các nước Đồng minh',
                    'Quân phiệt Nhật Bản đầu hàng Đồng minh vô điều kiện',
                    'Chính quyền bù nhìn tay sai Trần Trọng Kim tự nguyện giao lại chính quyền'
                ],
                answer: 0,
                explanation: 'Sự lãnh đạo của Đảng và Chủ tịch Hồ Chí Minh là nhân tố chủ quan quyết định nhất, đã chuẩn bị chu đáo suốt 15 năm và chớp đúng thời cơ.'
            }
        },

        // BÀI 7: CUỘC KHÁNG CHIẾN CHỐNG THỰC DÂN PHÁP (1945 - 1954)
        {
            id: 'b7_m1',
            lessonKey: 'bai_7',
            lessonName: 'Bài 7: Kháng chiến chống Pháp (1945 - 1954)',
            order: 1,
            badge: 'BÀI 7 · TRẠM 1',
            icon: '⚖️',
            title: 'Tình thế hiểm nghèo: Ngàn cân treo sợi tóc & Thù trong giặc ngoài',
            url: 'assets/models/bai7/tram1/3ooong.glb',
            scale: 0.85,
            summary: 'Sau năm 1945, nước Việt Nam non trẻ phải đối mặt với muôn vàn khó khăn: Giặc đói, giặc dốt, giặc ngoại xâm (20 vạn quân Tưởng ở phía Bắc, quân Anh dọn đường cho Pháp ở phía Nam). Đất nước lâm vào tình thế "ngàn cân treo sợi tóc". Đảng và Bác Hồ đã linh hoạt diệt giặc đói, giặc dốt và củng cố chính quyền.',
            keyPoints: [
                'Giặc đói: Nạn đói năm 1945 cướp đi hơn 2 triệu sinh mạng, sản xuất tê liệt.',
                'Giặc dốt: Hơn 90% dân số mù chữ, tàn dư văn hóa nô dịch phong kiến thực dân.',
                'Giặc ngoại xâm: 20 vạn quân Trung Hoa Dân quốc (Tưởng) ở miền Bắc, quân Anh - Pháp ở miền Nam.',
                'Biện pháp: Hũ gạo cứu đói, tuần lễ vàng, phong trào Bình dân học vụ, Tổng tuyển cử bầu Quốc hội (6/1/1946).'
            ],
            mnemonic: 'Ba thứ giặc: Giặc đói, giặc dốt, giặc ngoại xâm - Ngàn cân treo sợi tóc.',
            quiz: {
                question: 'Biện pháp lâu dài và căn bản nhất để giải quyết nạn đói sau CMT8 1945 của nước ta là gì?',
                options: [
                    'Đẩy mạnh tăng gia sản xuất "Tấc đất tấc vàng"',
                    'Tổ chức "Hũ gạo cứu đói" và "Ngày đồng tâm"',
                    'Nghiêm cấm đầu cơ tích trữ thóc gạo',
                    'Nhập khẩu gạo từ các nước láng giềng'
                ],
                answer: 0,
                explanation: 'Tăng gia sản xuất là biện pháp căn bản, lâu dài và bền vững nhất để giải quyết tận gốc nạn đói.'
            }
        },
        {
            id: 'b7_m2',
            lessonKey: 'bai_7',
            lessonName: 'Bài 7: Kháng chiến chống Pháp (1945 - 1954)',
            order: 2,
            badge: 'BÀI 7 · TRẠM 2',
            icon: '🔥',
            title: 'Nhân dân Nam Bộ anh dũng kháng chiến (23/9/1945)',
            url: 'assets/models/bai7/tram2/mit_tinh_saigon_phap_danh.glb',
            scale: 0.85,
            summary: 'Đêm 22 rạng sáng 23/9/1945, thực dân Pháp nổ súng đánh chiếm Sài Gòn, mở đầu cuộc xâm lược Việt Nam lần thứ hai. Nhân dân Nam Bộ dưới sự lãnh đạo của Xứ ủy và Ủy ban Kháng chiến đã nhất tề đứng lên chiến đấu kiên cường với gậy tầm vông, vinh dự được Bác Hồ phong tặng danh hiệu "Thành đồng Tổ quốc".',
            keyPoints: [
                'Ngày 23/09/1945: Thực dân Pháp nổ súng tái chiếm Sài Gòn.',
                'Quân dân Nam Bộ anh dũng chiến đấu, giam chân địch trong thành phố suốt một tháng.',
                'Nhân dân cả nước dấy lên phong trào Nam tiến chi viện sức người, sức của cho tiền tuyến Nam Bộ.'
            ],
            mnemonic: '23/9 Nam Bộ kháng chiến - Gậy tầm vông đánh Pháp - Thành đồng Tổ quốc.',
            quiz: {
                question: 'Thực dân Pháp mở đầu cuộc chiến tranh xâm lược nước ta lần thứ hai vào ngày nào?',
                options: [
                    'Ngày 23 tháng 9 năm 1945',
                    'Ngày 02 tháng 9 năm 1945',
                    'Ngày 19 tháng 12 năm 1946',
                    'Ngày 06 tháng 3 năm 1946'
                ],
                answer: 0,
                explanation: 'Đêm 22 rạng ngày 23/9/1945, thực dân Pháp nổ súng tấn công Sài Gòn, mở đầu cuộc chiến tranh xâm lược nước ta lần thứ hai.'
            }
        },
        {
            id: 'b7_m3',
            lessonKey: 'bai_7',
            lessonName: 'Bài 7: Kháng chiến chống Pháp (1945 - 1954)',
            order: 3,
            badge: 'BÀI 7 · TRẠM 3',
            icon: '✍️',
            title: 'Sách lược hòa hoãn: Hiệp định Sơ bộ (6/3) & Tạm ước (14/9/1946)',
            url: 'assets/models/bai7/tram3/bac_ho_ki_cam_ket.glb',
            scale: 0.85,
            summary: 'Trước nguy cơ bị kẹp giữa quân Tưởng và quân Pháp, Đảng và Chủ tịch Hồ Chí Minh đã chủ trương sách lược mềm dẻo: Ban đầu hòa Tưởng đánh Pháp; sau đó ký Hiệp định Sơ bộ 6/3/1946 và Tạm ước 14/9/1946 để đuổi 20 vạn quân Tưởng về nước, tranh thủ thời gian vàng chuẩn bị lực lượng cho cuộc kháng chiến trường kỳ.',
            keyPoints: [
                'Trước 6/3/1946: Tạm hòa hoãn với quân Tưởng ở miền Bắc để tập trung kháng chiến chống Pháp ở miền Nam.',
                'Ngày 06/03/1946: Ký Hiệp định Sơ bộ với Pháp, đuổi 20 vạn quân Tưởng về nước mà không tốn một viên đạn.',
                'Ngày 14/09/1946: Ký Tạm ước tại Fontainebleau để kéo dài thời gian hòa hoãn chuẩn bị kháng chiến lâu dài.'
            ],
            mnemonic: 'Hòa để tiến - Đuổi Tưởng về nước - Thêm thời gian vàng chuẩn bị kháng chiến.',
            quiz: {
                question: 'Ý nghĩa quan trọng nhất của việc ký kết Hiệp định Sơ bộ ngày 6/3/1946 là gì?',
                options: [
                    'Đuổi được 20 vạn quân Tưởng về nước và tranh thủ thời gian chuẩn bị lực lượng',
                    'Buộc Pháp phải công nhận nền độc lập hoàn toàn của Việt Nam',
                    'Chấm dứt hoàn toàn chiến tranh trên phạm vi toàn quốc',
                    'Được các nước Đồng minh công nhận về mặt ngoại giao'
                ],
                answer: 0,
                explanation: 'Hiệp định Sơ bộ giúp ta tránh được việc đối đầu một lúc với hai kẻ thù, đuổi sạch 20 vạn quân Tưởng và có thêm thời gian quý báu chuẩn bị lực lượng.'
            }
        },
        {
            id: 'b7_m4',
            lessonKey: 'bai_7',
            lessonName: 'Bài 7: Kháng chiến chống Pháp (1945 - 1954)',
            order: 4,
            badge: 'BÀI 7 · TRẠM 4',
            icon: '🛡️',
            title: 'Toàn quốc kháng chiến (19/12/1946) & 60 ngày đêm giam chân địch',
            url: 'assets/models/bai7/tram4/chien_si_chien_dau.glb',
            scale: 0.85,
            summary: 'Bất chấp thiện chí hòa bình của ta, thực dân Pháp liên tiếp khiêu khích và gửi tối hậu thư đòi giải tán lực lượng tự vệ. Đêm 19/12/1946, Chủ tịch Hồ Chí Minh ra Lời kêu gọi Toàn quốc kháng chiến: "Chúng ta thà hy sinh tất cả, chứ nhất định không chịu mất nước, nhất định không chịu làm nô lệ!". Chiến sĩ Thủ đô thề "Quyết tử để Tổ quốc quyết sinh".',
            keyPoints: [
                'Tối 19/12/1946: Tiếng súng pháo đài Láng phát hỏa, toàn quốc bước vào kháng chiến.',
                'Lời kêu gọi Toàn quốc kháng chiến của Chủ tịch Hồ Chí Minh: Bất kỳ đàn ông, đàn bà, người già, người trẻ... hễ là người Việt Nam thì phải đứng lên đánh Pháp.',
                'Quân dân Hà Nội chiến đấu kiên cường 60 ngày đêm, giam chân địch để cơ quan đầu não rút lên an toàn khu Việt Bắc.'
            ],
            mnemonic: '19/12 Lời kêu gọi Toàn quốc - Quyết tử để Tổ quốc quyết sinh.',
            quiz: {
                question: 'Đoạn trích "Chúng ta thà hy sinh tất cả, chứ nhất định không chịu mất nước, nhất định không chịu làm nô lệ" nằm trong văn kiện nào?',
                options: [
                    'Lời kêu gọi Toàn quốc kháng chiến (19/12/1946)',
                    'Tuyên ngôn Độc lập (02/09/1945)',
                    'Tác phẩm Kháng chiến nhất định thắng lợi (1947)',
                    'Chỉ thị Toàn dân kháng chiến (22/12/1946)'
                ],
                answer: 0,
                explanation: 'Đây là lời hiệu triệu thiêng liêng trong bản Lời kêu gọi Toàn quốc kháng chiến do Chủ tịch Hồ Chí Minh viết đêm 19/12/1946.'
            }
        },
        {
            id: 'b7_m5',
            lessonKey: 'bai_7',
            lessonName: 'Bài 7: Kháng chiến chống Pháp (1945 - 1954)',
            order: 5,
            badge: 'BÀI 7 · TRẠM 5',
            icon: '🌲',
            title: 'Chiến dịch Việt Bắc Thu - Đông 1947 — Bẻ gãy gọng kìm giặc',
            url: 'assets/models/bai7/tram5/tap_luyen_chien_dich_vbtd.glb',
            scale: 0.85,
            summary: 'Thu - Đông 1947, thực dân Pháp mở cuộc hành quân quy mô lớn đánh lên chiến khu Việt Bắc nhằm tiêu diệt cơ quan đầu não kháng chiến và quân chủ lực của ta. Dưới sự chỉ huy sáng suốt, quân và dân ta đã phục kích bẻ gãy cả hai gọng kìm thủy - bộ của địch tại Sông Lô, Đoan Hùng, Khe Lau, đập tan âm mưu "đánh nhanh thắng nhanh" của Pháp.',
            keyPoints: [
                'Âm mưu của Pháp: Tiêu diệt cơ quan đầu não và bộ đội chủ lực, kết thúc chiến tranh chớp nhoáng.',
                'Các chiến thắng oanh liệt: Chiến thắng Sông Lô, Đoan Hùng, đèo Bông Lau.',
                'Kết quả: Đập tan hoàn toàn chiến lược "đánh nhanh thắng nhanh", buộc Pháp chuyển sang "đánh lâu dài".',
                'Bảo vệ an toàn cơ quan đầu não kháng chiến và căn cứ địa Việt Bắc.'
            ],
            mnemonic: 'Việt Bắc 1947 - Mồ chôn giặc Pháp - Phá tan đánh nhanh thắng nhanh.',
            quiz: {
                question: 'Ý nghĩa chiến lược quan trọng nhất của chiến thắng Việt Bắc Thu - Đông 1947 là gì?',
                options: [
                    'Làm phá sản hoàn toàn chiến lược "đánh nhanh thắng nhanh" của thực dân Pháp',
                    'Giành lại quyền chủ động chiến lược trên chiến trường chính Bắc Bộ',
                    'Buộc Pháp phải ngồi vào bàn đàm phán ký kết Hiệp định Giơ-ne-vơ',
                    'Giải phóng hoàn toàn biên giới phía Bắc tiếp giáp với Trung Quốc'
                ],
                answer: 0,
                explanation: 'Chiến dịch Việt Bắc 1947 đã đập tan mưu đồ đánh nhanh thắng nhanh của thực dân Pháp, buộc chúng phải chuyển sang chiến lược đánh lâu dài.'
            }
        },
        {
            id: 'b7_m6',
            lessonKey: 'bai_7',
            lessonName: 'Bài 7: Kháng chiến chống Pháp (1945 - 1954)',
            order: 6,
            badge: 'BÀI 7 · TRẠM 6',
            icon: '🔭',
            title: 'Chiến dịch Biên giới Thu - Đông 1950 — Giành thế chủ động',
            url: 'assets/models/bai7/tram6/bac_ho_chi_dao_bien_gioi.glb',
            scale: 0.85,
            summary: 'Chiến dịch Biên giới Thu - Đông 1950 là chiến dịch tiến công quy mô lớn đầu tiên do quân đội ta chủ động mở. Hình ảnh Bác Hồ trực tiếp ra mặt trận quan sát chỉ đạo trên đỉnh núi Báo Đông trở thành biểu tượng lịch sử. Ta tiêu diệt cụm cứ điểm Đông Khê, khai thông biên giới Việt - Trung dài 750km, giành quyền chủ động trên chiến trường Bắc Bộ.',
            keyPoints: [
                'Mục tiêu: Tiêu diệt một bộ phận quan trọng sinh lực địch, khai thông biên giới Việt - Trung, mở rộng căn cứ địa.',
                'Trận mở màn then chốt: Đánh chiếm cứ điểm Đông Khê (18/9/1950), chặt đứt đường số 4.',
                'Ý nghĩa bước ngoặt: Quân đội ta giành quyền chủ động chiến lược trên chiến trường chính Bắc Bộ.',
                'Nối liền hậu phương kháng chiến với các nước XHCN anh em.'
            ],
            mnemonic: 'Biên giới 1950 - Mở toang cửa khẩu - Giành thế chủ động chiến trường.',
            quiz: {
                question: 'Chiến dịch Biên giới Thu - Đông 1950 đánh dấu bước ngoặt gì trong cuộc kháng chiến chống Pháp?',
                options: [
                    'Quân đội ta giành được quyền chủ động chiến lược trên chiến trường chính Bắc Bộ',
                    'Đập tan âm mưu "đánh nhanh thắng nhanh" của quân Pháp',
                    'Chuyển cuộc kháng chiến sang giai đoạn phòng ngự tích cực',
                    'Mỹ chính thức viện trợ toàn bộ chiến phí cho quân Pháp'
                ],
                answer: 0,
                explanation: 'Sau chiến dịch Biên giới 1950, quân đội ta giành quyền chủ động chiến lược trên chiến trường chính Bắc Bộ, đẩy quân Pháp vào thế bị động phòng ngự.'
            }
        },
        {
            id: 'b7_m7',
            lessonKey: 'bai_7',
            lessonName: 'Bài 7: Kháng chiến chống Pháp (1945 - 1954)',
            order: 7,
            badge: 'BÀI 7 · TRẠM 7',
            icon: '🚲',
            title: 'Đoàn xe đạp thồ tiếp tế & Sức mạnh hậu phương',
            url: 'assets/models/bai7/tram7/xe_dap_tho.glb',
            scale: 0.85,
            summary: 'Trong chiến dịch Điện Biên Phủ, hàng vạn chiến sĩ dân công hỏa tuyến đã dùng đôi chân và chiếc xe đạp thồ thô sơ băng qua đèo cao dốc thẳm để vận chuyển hàng chục ngàn tấn lương thực, vũ khí ra tiền tuyến. Chiếc xe đạp thồ trở thành "vũ khí vận tải thần kỳ" làm kinh ngạc cả các tướng lĩnh thực dân Pháp và cố vấn Mỹ.',
            keyPoints: [
                'Hơn 26 vạn dân công phục vụ chiến dịch Điện Biên Phủ với 12 triệu ngày công.',
                'Hơn 2 vạn xe đạp thồ được cải tiến: Mỗi xe chở được từ 200kg đến hơn 300kg hàng hóa.',
                'Khẳng định chân lý: Chiến tranh nhân dân toàn dân, toàn diện, hậu phương vững chắc nuôi dưỡng tiền tuyến thắng lợi.'
            ],
            mnemonic: 'Xe đạp thồ thần kỳ - Vượt đèo Pha Đin - Nuôi trọn Điện Biên Phủ.',
            quiz: {
                question: 'Phương tiện vận chuyển thô sơ nhưng tạo nên kỳ tích hậu cần vĩ đại trong chiến dịch Điện Biên Phủ là:',
                options: [
                    'Xe đạp thồ',
                    'Xe kéo tay',
                    'Ngựa thồ hàng',
                    'Thuyền độc mộc'
                ],
                answer: 0,
                explanation: 'Hơn 2 vạn chiếc xe đạp thồ cải tiến đã vận chuyển hàng vạn tấn lương thực, đạn dược vượt đèo dốc hiểm trở chi viện kịp thời cho mặt trận Điện Biên Phủ.'
            }
        },
        {
            id: 'b7_m8',
            lessonKey: 'bai_7',
            lessonName: 'Bài 7: Kháng chiến chống Pháp (1945 - 1954)',
            order: 8,
            badge: 'BÀI 7 · TRẠM 8',
            icon: '🎖️',
            title: 'Tướng Đờ Cát & Kế hoạch Nava: "Pháo đài bất khả xâm phạm"',
            url: 'assets/models/bai7/tram8/tuong_do_cat.glb',
            scale: 0.85,
            summary: 'Năm 1953, với viện trợ Mỹ, thực dân Pháp cử tướng Nava xây dựng Điện Biên Phủ thành tập đoàn cứ điểm quân sự khổng lồ mạnh nhất Đông Dương với 49 cứ điểm chia làm 3 phân khu, do đại tá (sau thăng tướng) Đờ Cát (De Castries) chỉ huy. Pháp và Mỹ huênh hoang đây là "pháo đài bất khả xâm phạm", thách thức quân ta tiến công.',
            keyPoints: [
                'Quy mô: 49 cứ điểm kiên cố, 3 phân khu (Bắc, Trung tâm, Nam), 2 sân bay Mường Thanh và Hồng Cúm.',
                'Lực lượng địch: Hơn 16.200 quân tinh nhuệ nhất, pháo binh và xe tăng bọc thép.',
                'Âm mưu: Biến Điện Biên Phủ thành chiếc cối xay thịt nghiền nát quân chủ lực của ta.',
                'Bộ Chính trị Đảng ta quyết định: Biến Điện Biên Phủ thành điểm quyết chiến chiến lược tiêu diệt địch.'
            ],
            mnemonic: 'Tập đoàn cứ điểm 49 cứ điểm - Đờ Cát huênh hoang - Nava bế tắc.',
            quiz: {
                question: 'Tập đoàn cứ điểm Điện Biên Phủ được Pháp và Mỹ ca ngợi là gì?',
                options: [
                    'Một "pháo đài bất khả xâm phạm" và "chiếc cối xay thịt khổng lồ"',
                    'Vành đai thép bảo vệ an toàn cho vùng đồng bằng Bắc Bộ',
                    'Căn cứ hải quân chiến lược kiểm soát toàn Đông Dương',
                    'Bức tường phòng thủ kiên cố ngăn chặn phe Xã hội chủ nghĩa'
                ],
                answer: 0,
                explanation: 'Pháp và Mỹ đánh giá Điện Biên Phủ là pháo đài bất khả xâm phạm, không lực lượng nào của ta có thể công phá được.'
            }
        },
        {
            id: 'b7_m9',
            lessonKey: 'bai_7',
            lessonName: 'Bài 7: Kháng chiến chống Pháp (1945 - 1954)',
            order: 9,
            badge: 'BÀI 7 · TRẠM 9',
            icon: '🏆',
            title: 'Bắt sống Tướng Đờ Cát & Toàn thắng Điện Biên Phủ (7/5/1954)',
            url: 'assets/models/bai7/tram9/do_cat_bi_bat.glb',
            scale: 0.85,
            summary: 'Sau 56 ngày đêm "khoét núi, ngủ hầm, mưa dầm, cơm vắt, máu trộn bùn non", chiều ngày 7/5/1954, lá cờ Quyết chiến Quyết thắng tung bay trên nóc hầm tướng Đờ Cát. Toàn bộ ban chỉ huy tập đoàn cứ điểm bị bắt sống. Chiến thắng chấn động địa cầu đã buộc Pháp ký Hiệp định Giơ-ne-vơ lập lại hòa bình ở Đông Dương.',
            keyPoints: [
                'Trải qua 3 đợt tiến công ác liệt kéo dài suốt 56 ngày đêm (13/3 đến 7/5/1954).',
                'Chiều 07/05/1954: Chiếm sở chỉ huy, bắt sống toàn bộ tướng Đờ Cát và bộ chỉ huy tập đoàn.',
                'Tiêu diệt và bắt sống toàn bộ 16.200 quân địch.',
                'Ý nghĩa: Đập tan kế hoạch Nava, kết thúc thắng lợi 9 năm kháng chiến chống Pháp, mở đường ký Hiệp định Genève.'
            ],
            mnemonic: 'Chiều 7 tháng 5 cờ bay nóc hầm - Lừng lẫy năm châu - Chấn động địa cầu.',
            quiz: {
                question: 'Chiến thắng Điện Biên Phủ ngày 7/5/1954 đã trực tiếp dẫn đến việc ký kết hiệp định ngoại giao nào?',
                options: [
                    'Hiệp định Giơ-ne-vơ năm 1954 về Đông Dương',
                    'Hiệp định Pa-ri năm 1973 về Việt Nam',
                    'Hiệp định Sơ bộ ngày 6 tháng 3 năm 1946',
                    'Tạm ước ngày 14 tháng 9 năm 1946'
                ],
                answer: 0,
                explanation: 'Thắng lợi Điện Biên Phủ trực tiếp buộc thực dân Pháp phải ngồi vào bàn đàm phán và ký kết Hiệp định Genève năm 1954 công nhận độc lập, chủ quyền của Việt Nam, Lào, Campuchia.'
            }
        },

        // BÀI 8: CUỘC KHÁNG CHIẾN CHỐNG MỸ, CỨU NƯỚC (1954 - 1975)
        {
            id: 'b8_m1',
            lessonKey: 'bai_8',
            lessonName: 'Bài 8: Kháng chiến chống Mỹ (1954 - 1975)',
            order: 1,
            badge: 'BÀI 8 · TRẠM 1',
            icon: '🏗️',
            title: 'Xây dựng CNXH ở miền Bắc & Đấu tranh chính trị miền Nam',
            url: 'assets/models/bai8/tram1/xay_dung_xa_hoi_chu_nghia.glb',
            scale: 0.85,
            summary: 'Sau Hiệp định Giơ-ne-vơ 1954, đất nước tạm thời bị chia cắt làm hai miền. Miền Bắc hoàn toàn giải phóng bước vào thời kỳ khôi phục kinh tế, cải tạo và xây dựng Chủ nghĩa Xã hội, làm hậu phương lớn vững chắc. Miền Nam nằm dưới ách thống trị tàn bạo của đế quốc Mỹ và chính quyền tay sai Ngô Đình Diệm.',
            keyPoints: [
                'Đặc điểm lớn: Đất nước tạm thời chia cắt làm hai miền với hai chế độ chính trị khác nhau.',
                'Miền Bắc: Hậu phương lớn, vai trò quyết định nhất đối với sự phát triển của cách mạng cả nước.',
                'Miền Nam: Tiền tuyến lớn, vai trò quyết định trực tiếp đánh đổ ách thống trị của Mỹ - Diệm.',
                'Nhiệm vụ chung: Giải phóng miền Nam, bảo vệ miền Bắc, tiến tới hòa bình thống nhất đất nước.'
            ],
            mnemonic: 'Hai miền hai nhiệm vụ: Bắc là hậu phương lớn - Nam là tiền tuyến lớn.',
            quiz: {
                question: 'Vai trò của cách mạng miền Bắc đối với sự nghiệp kháng chiến chống Mỹ cứu nước là gì?',
                options: [
                    'Giữ vai trò quyết định nhất đối với toàn bộ sự phát triển của cách mạng cả nước',
                    'Giữ vai trò quyết định trực tiếp đánh đổ ách thống trị của Mỹ và tay sai',
                    'Chỉ đơn thuần hỗ trợ ngoại giao trên trường quốc tế',
                    'Tập trung phát triển công nghiệp nặng không chi viện cho miền Nam'
                ],
                answer: 0,
                explanation: 'Đại hội III của Đảng (1960) xác định cách mạng xã hội chủ nghĩa ở miền Bắc giữ vai trò quyết định nhất đối với sự phát triển của toàn bộ cách mạng Việt Nam.'
            }
        },
        {
            id: 'b8_m2',
            lessonKey: 'bai_8',
            lessonName: 'Bài 8: Kháng chiến chống Mỹ (1954 - 1975)',
            order: 2,
            badge: 'BÀI 8 · TRẠM 2',
            icon: '🌴',
            title: 'Phong trào Đồng Khởi (1959 - 1960) & Đội quân tóc dài Bến Tre',
            url: 'assets/models/bai8/tram2/doi_quan_toc_dai_ben_tre.glb',
            scale: 0.85,
            summary: 'Dưới ánh sáng Nghị quyết 15 của Đảng, ngày 17/1/1960, nhân dân ba xã Định Thủy, Phước Hiệp, Bình Khánh (Mỏ Cày, Bến Tre) đã đồng loạt nổi dậy, mở đầu phong trào Đồng Khởi bão táp. Hình ảnh "Đội quân tóc dài" mưu trí, dũng cảm đã làm rung chuyển bộ máy cai trị ngụy quyền, chuyển cách mạng miền Nam từ thế giữ gìn lực lượng sang thế tiến công.',
            keyPoints: [
                'Khởi nguồn: Bắt đầu từ Mỏ Cày (Bến Tre) ngày 17/1/1960 rồi lan nhanh khắp Nam Bộ, Tây Nguyên.',
                'Lực lượng tiêu biểu: "Đội quân tóc dài" kiên cường đấu tranh chính trị và binh vận.',
                'Bước ngoặt: Chuyển cách mạng miền Nam từ thế giữ gìn lực lượng sang thế tiến công.',
                'Hệ quả: Ngày 20/12/1960, Mặt trận Dân tộc Giải phóng miền Nam Việt Nam ra đời.'
            ],
            mnemonic: 'Đồng Khởi Bến Tre - Đội quân tóc dài - Chuyển sang thế tiến công.',
            quiz: {
                question: 'Ý nghĩa quan trọng nhất của phong trào "Đồng Khởi" (1959 - 1960) ở miền Nam là:',
                options: [
                    'Chuyển cách mạng miền Nam từ thế giữ gìn lực lượng sang thế tiến công',
                    'Làm phá sản hoàn toàn chiến lược "Chiến tranh đặc biệt" của Mỹ',
                    'Buộc Mỹ phải ký kết Hiệp định Pa-ri rút quân về nước',
                    'Giải phóng hoàn toàn các đô thị lớn ở miền Nam'
                ],
                answer: 0,
                explanation: 'Phong trào Đồng Khởi giáng đòn chí mạng vào chính sách thực dân mới của Mỹ, làm lung lay chính quyền Ngô Đình Diệm và chuyển cách mạng miền Nam sang thế tiến công.'
            }
        },
        {
            id: 'b8_m3',
            lessonKey: 'bai_8',
            lessonName: 'Bài 8: Kháng chiến chống Mỹ (1954 - 1975)',
            order: 3,
            badge: 'BÀI 8 · TRẠM 3',
            icon: '🚁',
            title: 'Đánh bại Chiến tranh đặc biệt & Trực thăng vận của Mỹ (1961 - 1965)',
            url: 'assets/models/bai8/tram3/my_dung_truc_thang_van.glb',
            scale: 0.85,
            summary: 'Chiến lược "Chiến tranh đặc biệt" của Mỹ được tiến hành bằng quân đội tay sai Sài Gòn, dưới sự chỉ huy của cố vấn quân sự Mỹ cùng vũ khí tối tân, nổi bật là chiến thuật "trực thăng vận" và "thiết xa vận". Quân dân miền Nam đã anh dũng đánh bại các chiến thuật này, tiêu biểu là chiến thắng vang dội Ấp Bắc (Mỹ Tho) ngày 2/1/1963.',
            keyPoints: [
                'Công thức của Mỹ: Quân đội Sài Gòn + Cố vấn Mỹ + Vũ khí trang bị Mỹ.',
                'Chiến thuật mới: "Trực thăng vận" và "Thiết xa vận" cùng việc lập "Ấp chiến lược" làm quốc sách.',
                'Chiến thắng Ấp Bắc (2/1/1963): Dấy lên phong trào "Thi đua Ấp Bắc, giết giặc lập công", chứng minh ta hoàn toàn có thể đánh bại chiến tranh đặc biệt.',
                'Các chiến dịch Đông - Xuân 1964 - 1965 (Bình Giã, Ba Gia, Đồng Xoài) làm phá sản hoàn toàn chiến lược này.'
            ],
            mnemonic: 'Ấp Bắc mở đầu - Trực thăng vận tan tác - Chiến tranh đặc biệt sụp đổ.',
            quiz: {
                question: 'Chiến thắng nào của quân dân miền Nam đã mở ra cao trào "Thi đua Ấp Bắc, giết giặc lập công"?',
                options: [
                    'Chiến thắng Ấp Bắc (02/01/1963)',
                    'Chiến thắng Vạn Tường (18/08/1965)',
                    'Chiến thắng Bình Giã (1964)',
                    'Chiến thắng Đồng Xoài (1965)'
                ],
                answer: 0,
                explanation: 'Chiến thắng Ấp Bắc (2/1/1963) khẳng định quân dân miền Nam có đầy đủ khả năng đánh bại chiến thuật "trực thăng vận", "thiết xa vận" của Mỹ.'
            }
        },
        {
            id: 'b8_m4',
            lessonKey: 'bai_8',
            lessonName: 'Bài 8: Kháng chiến chống Mỹ (1954 - 1975)',
            order: 4,
            badge: 'BÀI 8 · TRẠM 4',
            icon: '🎯',
            title: 'Chiến thắng Vạn Tường & Đánh bại hai mùa khô (Chiến tranh cục bộ)',
            url: 'assets/models/bai8/tram4/chien_thang_ap_bac.glb',
            scale: 0.85,
            summary: 'Sau thất bại của Chiến tranh đặc biệt, Mỹ ồ ạt đưa quân viễn chinh Mỹ và chư hầu vào trực tiếp tham chiến ở miền Nam, phát động "Chiến tranh cục bộ" với chiến lược "Tìm và diệt". Trận Vạn Tường (Quảng Ngãi, 18/8/1965) là trận đánh trực tiếp đầu tiên giữa quân ta và lính thủy đánh bộ Mỹ, mở ra phong trào "Tìm Mỹ mà đánh, lùng ngụy mà diệt".',
            keyPoints: [
                'Trận Vạn Tường (18/8/1965): Được ví như "Ấp Bắc đối với quân Mỹ", chứng minh quân ta hoàn toàn có thể đánh thắng trực tiếp lính viễn chinh Mỹ.',
                'Đánh bại 2 cuộc phản công chiến lược mùa khô (1965 - 1966 và 1966 - 1967) của Mỹ.',
                'Bẻ gãy cuộc hành quân quy mô lớn nhất mang tên Gian-xơn Xi-ti (Junction City) đánh vào căn cứ kháng chiến Tây Ninh.'
            ],
            mnemonic: 'Vạn Tường đánh Mỹ - Tìm Mỹ mà đánh - Phá tan hai mùa khô.',
            quiz: {
                question: 'Chiến thắng nào được coi là trận mở màn đánh dấu ta có khả năng đánh thắng quân viễn chinh Mỹ trong "Chiến tranh cục bộ"?',
                options: [
                    'Chiến thắng Vạn Tường (Quảng Ngãi, 1965)',
                    'Chiến thắng Núi Thành (Quảng Nam, 1965)',
                    'Chiến thắng Ấp Bắc (Mỹ Tho, 1963)',
                    'Chiến thắng Khe Sanh (Quảng Trị, 1968)'
                ],
                answer: 0,
                explanation: 'Chiến thắng Vạn Tường (18/8/1965) khẳng định quân dân miền Nam có khả năng đánh bại quân viễn chinh Mỹ, mở ra phong trào "Tìm Mỹ mà đánh, lùng ngụy mà diệt".'
            }
        },
        {
            id: 'b8_m5',
            lessonKey: 'bai_8',
            lessonName: 'Bài 8: Kháng chiến chống Mỹ (1954 - 1975)',
            order: 5,
            badge: 'BÀI 8 · TRẠM 5',
            icon: '💥',
            title: 'Tổng tiến công & nổi dậy Xuân Mậu Thân 1968 — Đòn sấm sét',
            url: 'assets/models/bai8/tram5/tong_tien_cong_mau_than.glb',
            scale: 0.85,
            summary: 'Đêm giao thừa Tết Mậu Thân 1968, quân và dân ta đồng loạt tiến công và nổi dậy tại 37 thị xã, 4 đô thị lớn và hàng loạt cơ quan đầu não địch (Tòa Đại sứ Mỹ, Dinh Độc Lập, Đài phát thanh). Đòn bất ngờ đã làm lung lay tận gốc ý chí xâm lược của giới cầm quyền Washington, buộc Tổng thống Johnson phải tuyên bố ngừng ném bom miền Bắc và chấp nhận đàm phán tại Paris.',
            keyPoints: [
                'Mục tiêu: Đánh đồng loạt vào sào huyệt của địch tại các đô thị, buộc Mỹ phải xuống thang chiến tranh.',
                'Kết quả: Đánh sập ý chí xâm lược của đế quốc Mỹ, làm phá sản chiến lược "Chiến tranh cục bộ".',
                'Buộc Mỹ phải chấp nhận đàm phán bốn bên tại Paris và tuyên bố "phi Mỹ hóa" chiến tranh.'
            ],
            mnemonic: 'Mậu Thân 1968 - Bất ngờ sấm sét - Mỹ chấp nhận ngồi vào bàn đàm phán Paris.',
            quiz: {
                question: 'Ý nghĩa chiến lược to lớn nhất của cuộc Tổng tiến công và nổi dậy Xuân Mậu Thân 1968 là:',
                options: [
                    'Làm lung lay ý chí xâm lược của Mỹ, buộc Mỹ phải ngồi vào bàn đàm phán Paris',
                    'Giải phóng hoàn toàn miền Nam thống nhất đất nước',
                    'Đập tan chiến lược "Việt Nam hóa chiến tranh"',
                    'Buộc Mỹ phải ký ngay Hiệp định Pa-ri rút quân'
                ],
                answer: 0,
                explanation: 'Xuân Mậu Thân 1968 giáng đòn quyết định làm lung lay ý chí xâm lược của đế quốc Mỹ, buộc Mỹ tuyên bố ngừng ném bom miền Bắc và chấp nhận đàm phán tại Paris.'
            }
        },
        {
            id: 'b8_m6',
            lessonKey: 'bai_8',
            lessonName: 'Bài 8: Kháng chiến chống Mỹ (1954 - 1975)',
            order: 6,
            badge: 'BÀI 8 · TRẠM 6',
            icon: '🏰',
            title: 'Đánh bại Việt Nam hóa chiến tranh & Mặt trận Thành cổ Quảng Trị (1972)',
            url: 'assets/models/bai8/tram6/mat_tran_quang_tri.glb',
            scale: 0.85,
            summary: 'Chiến lược "Việt Nam hóa chiến tranh" của Nixon thực chất là dùng người Việt đánh người Việt, người Đông Dương đánh người Đông Dương. Năm 1972, quân ta mở cuộc Tiến công chiến lược trên ba hướng (Quảng Trị, Tây Nguyên, Đông Nam Bộ). Cuộc chiến đấu 81 ngày đêm bảo vệ Thành cổ Quảng Trị đã trở thành bản anh hùng ca bất tử về ý chí giữ vững trận địa.',
            keyPoints: [
                'Bản chất: "Dùng người Việt đánh người Việt" nhằm rút quân Mỹ nhưng duy trì quyền lợi thực dân mới.',
                'Cuộc chiến đấu 81 ngày đêm bảo vệ Thành cổ Quảng Trị (hè 1972) hứng chịu lượng bom đạn tương đương 7 quả bom nguyên tử.',
                'Cuộc Tiến công chiến lược 1972 chọc thủng ba phòng tuyến kiên cố của địch, tạo thế áp đảo trên bàn đàm phán ngoại giao.'
            ],
            mnemonic: 'Quảng Trị 81 ngày đêm - Thép rực lửa - Đập tan phòng tuyến giặc.',
            quiz: {
                question: 'Bản chất của chiến lược "Việt Nam hóa chiến tranh" của đế quốc Mỹ là gì?',
                options: [
                    'Dùng người Việt đánh người Việt, dùng tiền của và vũ khí Mỹ để kéo dài chiến tranh',
                    'Tăng cường quân đội các nước đồng minh chư hầu của Mỹ vào tham chiến',
                    'Rút toàn bộ lực lượng quân sự và từ bỏ can thiệp vào Việt Nam',
                    'Tập trung đánh phá bằng hải quân và không quân ra miền Bắc'
                ],
                answer: 0,
                explanation: 'Nixon thực hiện chiến lược "Việt Nam hóa chiến tranh" nhằm giảm thương vong cho lính Mỹ bằng cách dùng quân đội Sài Gòn làm nòng cốt dưới sự chỉ huy của Mỹ.'
            }
        },
        {
            id: 'b8_m7',
            lessonKey: 'bai_8',
            lessonName: 'Bài 8: Kháng chiến chống Mỹ (1954 - 1975)',
            order: 7,
            badge: 'BÀI 8 · TRẠM 7',
            icon: '✈️',
            title: 'Hà Nội - Điện Biên Phủ trên không (1972) & Hiệp định Paris 1973',
            url: 'assets/models/bai8/tram7/ban_pha_phao_dai_bay_b52.glb',
            scale: 0.85,
            summary: 'Cuối năm 1972, hòng ép ta trên bàn đàm phán, Nixon mở cuộc tập kích chiến lược đường không bằng máy bay ném bom chiến lược B-52 vào Hà Nội, Hải Phòng trong 12 ngày đêm. Quân dân miền Bắc đã kiên cường bắn rơi 81 máy bay (trong đó có 34 chiếc B-52), lập nên kỳ tích "Điện Biên Phủ trên không", buộc Mỹ phải ký Hiệp định Paris (27/1/1973) rút toàn bộ quân viễn chinh về nước.',
            keyPoints: [
                '12 ngày đêm khói lửa (18 - 29/12/1972): Bắn rơi 34 siêu pháo đài bay B-52 và 5 chiếc F-111.',
                'Ngày 27/01/1973: Ký kết Hiệp định Paris về chấm dứt chiến tranh, lập lại hòa bình ở Việt Nam.',
                'Thực hiện xuất sắc lời căn dặn của Bác Hồ: "Đánh cho Mỹ cút, đánh cho ngụy nhào" (bước 1: Mỹ cút).',
                'Mỹ buộc phải tôn trọng độc lập, chủ quyền, thống nhất và toàn vẹn lãnh thổ của Việt Nam.'
            ],
            mnemonic: '12 ngày đêm B-52 rụng - Hiệp định Paris 1973 - Đánh cho Mỹ cút!',
            quiz: {
                question: 'Ý nghĩa quan trọng hàng đầu của Hiệp định Pa-ri năm 1973 đối với cuộc kháng chiến chống Mỹ là:',
                options: [
                    'Buộc quân đội Mỹ và đồng minh phải rút hết về nước, tạo so sánh lực lượng có lợi cho ta',
                    'Giải phóng hoàn toàn miền Nam, thống nhất đất nước',
                    'Làm sụp đổ hoàn toàn chính quyền tay sai Sài Gòn',
                    'Các nước phương Tây công nhận miền Bắc là thành viên Liên Hợp Quốc'
                ],
                answer: 0,
                explanation: 'Hiệp định Paris buộc quân Mỹ rút khỏi nước ta, làm thay đổi căn bản tương quan so sánh lực lượng ở miền Nam theo hướng có lợi tuyệt đối cho cách mạng.'
            }
        },
        {
            id: 'b8_m8',
            lessonKey: 'bai_8',
            lessonName: 'Bài 8: Kháng chiến chống Mỹ (1954 - 1975)',
            order: 8,
            badge: 'BÀI 8 · TRẠM 8',
            icon: '🗺️',
            title: 'Hội nghị 21 & Chiến thắng Phước Long (1/1975) — Trinh sát chiến lược',
            url: 'assets/models/bai8/tram8/chien_thang_phuoc_long.glb',
            scale: 0.85,
            summary: 'Sau Hiệp định Paris, kẻ thù vi phạm trắng trợn thỏa thuận ngừng bắn. Hội nghị Trung ương 21 (7/1973) xác định tiếp tục con đường bạo lực cách mạng. Chiến thắng giải phóng hoàn toàn tỉnh Phước Long (6/1/1975) là đòn "trinh sát chiến lược" quan trọng, chứng minh quân ngụy đã suy yếu không thể giữ được tỉnh và Mỹ bất lực không thể can thiệp trở lại.',
            keyPoints: [
                'Nghị quyết 21 (7/1973): Khẳng định con đường bạo lực cách mạng, giữ vững thế tiến công.',
                'Ngày 06/01/1975: Giải phóng hoàn toàn thị xã và toàn tỉnh Phước Long.',
                'Ý nghĩa: Trinh sát chiến lược kiểm tra phản ứng của Mỹ và sức kháng cự của quân đội Sài Gòn.',
                'Bộ Chính trị họp củng cố quyết tâm giải phóng miền Nam trong hai năm 1975 - 1976.'
            ],
            mnemonic: 'Phước Long đòn thử lửa - Mỹ bất lực không thể quay lại - Thời cơ giải phóng tới.',
            quiz: {
                question: 'Chiến thắng nào vào đầu năm 1975 được coi là đòn "trinh sát chiến lược" mở đường cho quyết tâm giải phóng miền Nam?',
                options: [
                    'Chiến thắng Phước Long (06/01/1975)',
                    'Chiến thắng Buôn Ma Thuột (10/03/1975)',
                    'Chiến thắng Tây Ninh (1974)',
                    'Chiến thắng Xuân Lộc (1975)'
                ],
                answer: 0,
                explanation: 'Chiến thắng Phước Long (6/1/1975) cho thấy sự bất lực của quân đội Sài Gòn và phản ứng hạn chế của Mỹ, củng cố quyết tâm giải phóng miền Nam của Đảng ta.'
            }
        },
        {
            id: 'b8_m9',
            lessonKey: 'bai_8',
            lessonName: 'Bài 8: Kháng chiến chống Mỹ (1954 - 1975)',
            order: 9,
            badge: 'BÀI 8 · TRẠM 9',
            icon: '🎖️',
            title: 'Xe tăng 390 Húc đổ cổng Dinh Độc Lập — Toàn thắng mùa Xuân 1975 (30/4)',
            url: 'assets/models/bai8/tram9/xe_tang_giai_phong_390.glb',
            scale: 0.85,
            summary: 'Cuộc Tổng tiến công và nổi dậy mùa Xuân 1975 diễn ra qua ba chiến dịch lớn: Chiến dịch Tây Nguyên, Chiến dịch Huế - Đà Nẵng và Chiến dịch Hồ Chí Minh lịch sử. Đúng 11 giờ 30 phút ngày 30/4/1975, xe tăng 390 húc đổ cánh cổng Dinh Độc Lập, cờ giải phóng tung bay trên nóc dinh. Chiến dịch Hồ Chí Minh toàn thắng, non sông thu về một mối.',
            keyPoints: [
                'Ba chiến dịch đòn bẩy: Chiến dịch Tây Nguyên (tháng 3) ➔ Huế - Đà Nẵng (cuối tháng 3) ➔ Chiến dịch Hồ Chí Minh (cuối tháng 4).',
                'Đúng 11h30 ngày 30/04/1975: Cờ Mặt trận Giải phóng tung bay trên nóc Dinh Độc Lập, Tổng thống Dương Văn Minh tuyên bố đầu hàng.',
                'Ý nghĩa vĩ đại: Kết thúc 21 năm kháng chiến chống Mỹ và 30 năm chiến tranh giải phóng dân tộc.',
                'Non sông thu về một mối, mở ra kỷ nguyên độc lập, thống nhất và đi lên Chủ nghĩa Xã hội.'
            ],
            mnemonic: '11h30 ngày 30/4 Xe tăng húc cổng Dinh - Toàn thắng Mùa Xuân 1975.',
            quiz: {
                question: 'Chiếc xe tăng húc đổ cánh cổng chính Dinh Độc Lập lúc 11h30 trưa ngày 30/4/1975 mang số hiệu bao nhiêu?',
                options: [
                    'Xe tăng 390',
                    'Xe tăng 843',
                    'Xe tăng 980',
                    'Xe tăng 555'
                ],
                answer: 0,
                explanation: 'Xe tăng mang số hiệu 390 dưới sự chỉ huy của Trung úy Vũ Đăng Toàn đã húc tung cánh cổng chính Dinh Độc Lập lúc 11h30 ngày 30/4/1975.'
            }
        }
    ];

    // ─── 2. HÀM LẤY DỮ LIỆU TỪ LOCI_ANCHORS ĐỂ ĐỒNG BỘ 100% KIẾN THỨC ────────
    function getEnrichedModelData(m) {
        if (!m) return null;
        const copy = Object.assign({}, m);
        if (window.LOCI_ANCHORS && window.LOCI_ANCHORS[m.lessonKey]) {
            const lessonData = window.LOCI_ANCHORS[m.lessonKey];
            const anchor = (lessonData.anchors || []).find(a => a.id === m.id || a.order === m.order);
            if (anchor) {
                if (anchor.title) copy.title = anchor.title;
                if (anchor.summary) copy.summary = anchor.summary;
                if (Array.isArray(anchor.keyPoints) && anchor.keyPoints.length) copy.keyPoints = anchor.keyPoints;
                if (anchor.mnemonic) copy.mnemonic = anchor.mnemonic;
                if (Array.isArray(anchor.quizzes) && anchor.quizzes.length) {
                    const q = anchor.quizzes[0];
                    copy.quiz = {
                        question: q.question,
                        options: q.options,
                        answer: q.answer,
                        explanation: q.explanation || 'Kiến thức cốt lõi chuẩn chương trình Lịch sử 12.'
                    };
                }
            }
        }
        return copy;
    }

    // ─── 3. TIÊM CSS GIAO DIỆN HIỆN ĐẠI (GLASSMORPHISM, DOCK & INSPECTOR) ────
    function injectPickerStyles() {
        if (document.getElementById('loci-3d-picker-styles')) return;
        const style = document.createElement('style');
        style.id = 'loci-3d-picker-styles';
        style.textContent = `
        /* ════════════════════════════════════════════════════════════════════
           3D MODEL PICKER DOCK & INSPECTOR STYLES
           ════════════════════════════════════════════════════════════════════ */
        
        /* 1. Backdrop làm mờ khi mở Dock */
        .dock-backdrop {
            position: fixed;
            inset: 0;
            background: rgba(15, 23, 42, 0.45);
            backdrop-filter: blur(4px);
            -webkit-backdrop-filter: blur(4px);
            z-index: 10000;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s ease;
        }
        .dock-backdrop.open {
            opacity: 1;
            pointer-events: auto;
        }

        /* 2. Bottom Dock trượt từ dưới lên */
        .loci-3d-dock {
            position: fixed;
            left: 0;
            right: 0;
            bottom: 0;
            max-height: 440px;
            background: rgba(15, 23, 42, 0.88);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border-top: 1.5px solid rgba(255, 255, 255, 0.15);
            box-shadow: 0 -12px 35px rgba(0, 0, 0, 0.5);
            z-index: 10001;
            padding: 16px 20px 20px;
            display: flex;
            flex-direction: column;
            gap: 12px;
            transform: translateY(105%);
            transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
            color: #ffffff;
            font-family: inherit;
        }
        .loci-3d-dock.open {
            transform: translateY(0%);
        }

        /* Header Dock */
        .dock-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
        }
        .dock-title-group {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .dock-title-icon {
            font-size: 24px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, rgba(16, 185, 129, 0.25), rgba(6, 182, 212, 0.25));
            border: 1px solid rgba(16, 185, 129, 0.4);
            border-radius: 12px;
        }
        .dock-title {
            margin: 0;
            font-size: 16.5px;
            font-weight: 800;
            color: #ffffff;
            letter-spacing: -0.2px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .dock-subtitle {
            margin: 2px 0 0;
            font-size: 12.5px;
            color: #94a3b8;
            font-weight: 400;
        }
        .dock-close-btn {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.1);
            color: #cbd5e1;
            border: none;
            display: grid;
            place-items: center;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.2s;
        }
        .dock-close-btn:hover {
            background: rgba(239, 68, 68, 0.25);
            color: #fca5a5;
            transform: rotate(90deg);
        }

        /* Tabs lọc bài học */
        .dock-tabs {
            display: flex;
            align-items: center;
            gap: 8px;
            overflow-x: auto;
            padding-bottom: 2px;
        }
        .dock-tabs::-webkit-scrollbar {
            height: 0;
        }
        .dock-tab-btn {
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.12);
            color: #cbd5e1;
            font-size: 12.5px;
            font-weight: 600;
            padding: 6px 14px;
            border-radius: 99px;
            white-space: nowrap;
            cursor: pointer;
            transition: all 0.2s;
        }
        .dock-tab-btn:hover {
            background: rgba(255, 255, 255, 0.16);
            color: #ffffff;
        }
        .dock-tab-btn.active {
            background: linear-gradient(135deg, #10b981, #0d9488);
            border-color: #34d399;
            color: #ffffff;
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.35);
        }

        /* Dải thẻ cuộn ngang */
        .dock-cards-scroll {
            display: flex;
            align-items: stretch;
            gap: 14px;
            overflow-x: auto;
            padding: 4px 2px 8px;
            scroll-behavior: smooth;
        }
        .dock-cards-scroll::-webkit-scrollbar {
            height: 6px;
        }
        .dock-cards-scroll::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 99px;
        }
        .dock-cards-scroll::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.25);
            border-radius: 99px;
        }

        /* Từng thẻ mô hình trong Dock */
        .dock-card {
            flex: 0 0 215px;
            background: rgba(30, 41, 59, 0.7);
            border: 1px solid rgba(255, 255, 255, 0.12);
            border-radius: 16px;
            padding: 12px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            gap: 10px;
            cursor: pointer;
            transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
            user-select: none;
            position: relative;
            overflow: hidden;
        }
        .dock-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 3px;
            background: linear-gradient(90deg, #10b981, #06b6d4);
            opacity: 0;
            transition: opacity 0.2s;
        }
        .dock-card:hover {
            transform: translateY(-4px);
            background: rgba(30, 41, 59, 0.95);
            border-color: rgba(52, 211, 153, 0.5);
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
        }
        .dock-card:hover::before {
            opacity: 1;
        }
        .dock-card-top {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .dock-card-badge {
            font-size: 10.5px;
            font-weight: 800;
            color: #5eead4;
            background: rgba(20, 184, 166, 0.18);
            border: 1px solid rgba(45, 212, 191, 0.3);
            padding: 2px 8px;
            border-radius: 99px;
            letter-spacing: 0.3px;
        }
        .dock-card-icon-box {
            width: 100%;
            height: 90px;
            background: linear-gradient(135deg, rgba(51, 65, 85, 0.6), rgba(30, 41, 59, 0.8));
            border-radius: 12px;
            display: grid;
            place-items: center;
            font-size: 40px;
            box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.25);
            transition: transform 0.2s;
        }
        .dock-card:hover .dock-card-icon-box {
            transform: scale(1.05);
        }
        .dock-card-title {
            font-size: 13.5px;
            font-weight: 700;
            color: #f1f5f9;
            line-height: 1.35;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            min-height: 36px;
        }
        .dock-card-action {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            padding: 7px 10px;
            background: rgba(255, 255, 255, 0.08);
            border-radius: 10px;
            font-size: 12px;
            font-weight: 700;
            color: #38bdf8;
            transition: all 0.2s;
        }
        .dock-card:hover .dock-card-action {
            background: linear-gradient(135deg, #0284c7, #06b6d4);
            color: #ffffff;
        }

        /* ════════════════════════════════════════════════════════════════════
           3. MODAL 3D INSPECTOR (XOAY 360°, KIẾN THỨC & MINI-QUIZ)
           ════════════════════════════════════════════════════════════════════ */
        .inspector-modal {
            position: fixed;
            inset: 0;
            background: rgba(10, 15, 30, 0.82);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            z-index: 100005;
            display: none;
            align-items: center;
            justify-content: center;
            padding: 20px;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        .inspector-modal.open {
            display: flex;
            opacity: 1;
        }
        .inspector-container {
            width: 100%;
            max-width: 1060px;
            max-height: 90vh;
            background: #0f172a;
            background: linear-gradient(145deg, rgba(15, 23, 42, 0.98), rgba(30, 41, 59, 0.96));
            border: 1.5px solid rgba(255, 255, 255, 0.16);
            border-radius: 24px;
            box-shadow: 0 25px 60px rgba(0, 0, 0, 0.65), 0 0 35px rgba(56, 189, 248, 0.15);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            animation: inspScaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes inspScaleUp {
            from { transform: scale(0.92); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }

        /* Header của Inspector */
        .inspector-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 16px;
            padding: 16px 22px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            background: rgba(255, 255, 255, 0.03);
            flex-wrap: wrap;
        }
        .inspector-title-box {
            display: flex;
            flex-direction: column;
            gap: 3px;
        }
        .inspector-badge {
            align-self: flex-start;
            font-size: 11px;
            font-weight: 800;
            color: #38bdf8;
            background: rgba(56, 189, 248, 0.16);
            border: 1px solid rgba(56, 189, 248, 0.35);
            padding: 2px 10px;
            border-radius: 99px;
            letter-spacing: 0.5px;
            text-transform: uppercase;
        }
        .inspector-title {
            margin: 0;
            font-size: 18px;
            font-weight: 800;
            color: #ffffff;
            letter-spacing: -0.2px;
        }
        .inspector-actions {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .insp-btn {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 7px 14px;
            border-radius: 12px;
            font-size: 13px;
            font-weight: 700;
            cursor: pointer;
            border: none;
            transition: all 0.2s;
        }
        .insp-btn-ar {
            background: linear-gradient(135deg, #2563eb, #06b6d4);
            color: #ffffff;
            box-shadow: 0 4px 14px rgba(37, 99, 235, 0.3);
        }
        .insp-btn-ar:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 18px rgba(37, 99, 235, 0.45);
        }
        .insp-btn-pin {
            background: linear-gradient(135deg, #10b981, #059669);
            color: #ffffff;
            box-shadow: 0 4px 14px rgba(16, 185, 129, 0.3);
        }
        .insp-btn-pin:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 18px rgba(16, 185, 129, 0.45);
        }
        .insp-btn-close {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.1);
            color: #cbd5e1;
            border: none;
            display: grid;
            place-items: center;
            font-size: 16px;
            cursor: pointer;
            transition: all 0.2s;
        }
        .insp-btn-close:hover {
            background: rgba(239, 68, 68, 0.3);
            color: #fca5a5;
            transform: rotate(90deg);
        }

        /* Thân Inspector: 2 Cột */
        .inspector-body {
            display: grid;
            grid-template-columns: 1.15fr 1fr;
            min-height: 480px;
            max-height: calc(90vh - 140px);
            overflow: hidden;
        }
        @media (max-width: 860px) {
            .inspector-body {
                grid-template-columns: 1fr;
                max-height: calc(90vh - 120px);
                overflow-y: auto;
            }
        }

        /* Cột trái: Khung 3D */
        .inspector-canvas-pane {
            position: relative;
            background: radial-gradient(circle at 50% 50%, #1e293b, #0f172a 75%);
            border-right: 1px solid rgba(255, 255, 255, 0.1);
            display: flex;
            flex-direction: column;
            min-height: 340px;
        }
        .insp-canvas-wrapper {
            flex: 1;
            position: relative;
            width: 100%;
            height: 100%;
            min-height: 320px;
        }
        .insp-canvas-wrapper model-viewer {
            width: 100%;
            height: 100%;
            min-height: 320px;
            display: block;
            background: transparent;
        }
        .insp-loading {
            position: absolute;
            inset: 0;
            background: rgba(15, 23, 42, 0.7);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 12px;
            color: #38bdf8;
            font-size: 13.5px;
            font-weight: 600;
            transition: opacity 0.3s;
            pointer-events: none;
        }
        .insp-loading.hide {
            opacity: 0;
        }
        .insp-spinner {
            width: 38px;
            height: 38px;
            border: 3px solid rgba(56, 189, 248, 0.2);
            border-top-color: #38bdf8;
            border-radius: 50%;
            animation: inspSpin 0.8s linear infinite;
        }
        @keyframes inspSpin { to { transform: rotate(360deg); } }

        /* Nút điều khiển 3D */
        .insp-3d-controls {
            position: absolute;
            bottom: 14px;
            left: 14px;
            right: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            flex-wrap: wrap;
            z-index: 5;
        }
        .insp-ctrl-btn {
            background: rgba(15, 23, 42, 0.82);
            backdrop-filter: blur(8px);
            border: 1px solid rgba(255, 255, 255, 0.18);
            color: #f1f5f9;
            font-size: 12px;
            font-weight: 600;
            padding: 6px 12px;
            border-radius: 99px;
            cursor: pointer;
            transition: all 0.2s;
        }
        .insp-ctrl-btn:hover {
            background: rgba(56, 189, 248, 0.25);
            border-color: #38bdf8;
            color: #ffffff;
        }

        /* Cột phải: Thẻ kiến thức & Quiz */
        .inspector-info-pane {
            display: flex;
            flex-direction: column;
            background: rgba(15, 23, 42, 0.5);
            overflow-y: auto;
        }
        .insp-info-tabs {
            display: flex;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            background: rgba(255, 255, 255, 0.02);
            position: sticky;
            top: 0;
            z-index: 2;
        }
        .insp-info-tab {
            flex: 1;
            padding: 12px 14px;
            background: transparent;
            border: none;
            border-bottom: 2px solid transparent;
            color: #94a3b8;
            font-size: 13.5px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.2s;
        }
        .insp-info-tab:hover {
            color: #ffffff;
            background: rgba(255, 255, 255, 0.04);
        }
        .insp-info-tab.active {
            color: #38bdf8;
            border-bottom-color: #38bdf8;
            background: rgba(56, 189, 248, 0.08);
        }

        /* Nội dung thẻ kiến thức */
        .insp-tab-content {
            display: none;
            padding: 20px;
            flex-direction: column;
            gap: 16px;
        }
        .insp-tab-content.active {
            display: flex;
        }
        .insp-section-label {
            font-size: 11px;
            font-weight: 800;
            color: #94a3b8;
            letter-spacing: 0.6px;
            text-transform: uppercase;
            margin-bottom: 6px;
        }
        .insp-summary-card {
            background: rgba(30, 41, 59, 0.5);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 14px;
            padding: 14px 16px;
        }
        .insp-summary-text {
            margin: 0;
            font-size: 14.5px;
            line-height: 1.6;
            color: #e2e8f0;
        }
        .insp-points-card {
            background: rgba(30, 41, 59, 0.5);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 14px;
            padding: 14px 16px;
        }
        .insp-points-list {
            margin: 0;
            padding-left: 18px;
            color: #cbd5e1;
            font-size: 13.5px;
            line-height: 1.65;
        }
        .insp-points-list li {
            margin-bottom: 6px;
        }
        .insp-mnemonic-card {
            background: linear-gradient(135deg, rgba(245, 158, 11, 0.12), rgba(217, 119, 6, 0.12));
            border: 1px solid rgba(245, 158, 11, 0.35);
            border-radius: 14px;
            padding: 12px 16px;
        }
        .insp-mnemonic-text {
            margin: 0;
            font-size: 13.5px;
            font-weight: 600;
            color: #fde68a;
            line-height: 1.5;
        }

        /* Ôn tập Mini-Quiz */
        .insp-quiz-box {
            display: flex;
            flex-direction: column;
            gap: 14px;
        }
        .insp-quiz-q {
            font-size: 15px;
            font-weight: 700;
            color: #ffffff;
            line-height: 1.5;
            background: rgba(30, 41, 59, 0.6);
            padding: 14px;
            border-radius: 14px;
            border-left: 4px solid #38bdf8;
        }
        .insp-quiz-opts {
            display: flex;
            flex-direction: column;
            gap: 9px;
        }
        .insp-quiz-opt {
            display: flex;
            align-items: flex-start;
            gap: 10px;
            padding: 12px 14px;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.12);
            border-radius: 12px;
            color: #e2e8f0;
            font-size: 13.5px;
            line-height: 1.45;
            cursor: pointer;
            transition: all 0.2s;
            text-align: left;
        }
        .insp-quiz-opt:hover {
            background: rgba(255, 255, 255, 0.1);
            border-color: rgba(56, 189, 248, 0.4);
            transform: translateX(3px);
        }
        .insp-quiz-opt.correct {
            background: rgba(16, 185, 129, 0.2) !important;
            border-color: #10b981 !important;
            color: #6ee7b7 !important;
        }
        .insp-quiz-opt.wrong {
            background: rgba(239, 68, 68, 0.2) !important;
            border-color: #ef4444 !important;
            color: #fca5a5 !important;
        }
        .insp-quiz-feedback {
            margin-top: 6px;
            padding: 12px 14px;
            border-radius: 12px;
            font-size: 13px;
            line-height: 1.5;
            display: none;
        }
        .insp-quiz-feedback.show-correct {
            display: block;
            background: rgba(16, 185, 129, 0.15);
            border: 1px solid #10b981;
            color: #a7f3d0;
        }
        .insp-quiz-feedback.show-wrong {
            display: block;
            background: rgba(239, 68, 68, 0.15);
            border: 1px solid #ef4444;
            color: #fecaca;
        }

        /* Footer điều hướng trước / sau */
        .inspector-footer {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px 22px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            background: rgba(255, 255, 255, 0.02);
        }
        .insp-nav-btn {
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.14);
            color: #cbd5e1;
            font-size: 13px;
            font-weight: 700;
            padding: 8px 16px;
            border-radius: 99px;
            cursor: pointer;
            transition: all 0.2s;
        }
        .insp-nav-btn:hover {
            background: rgba(56, 189, 248, 0.2);
            border-color: #38bdf8;
            color: #ffffff;
        }
        .insp-counter {
            font-size: 13px;
            font-weight: 700;
            color: #94a3b8;
        }
        `;
        document.head.appendChild(style);
    }

    // ─── 4. TIÊM CẤU TRÚC HTML CHO DOCK & INSPECTOR ───────────────────────────
    function injectPickerHTML() {
        if (document.getElementById('loci-3d-dock')) return;

        // Container chung
        const wrap = document.createElement('div');
        wrap.id = 'loci-3d-picker-wrapper';
        wrap.innerHTML = `
        <!-- BACKDROP CHO DOCK -->
        <div id="loci-3d-dock-backdrop" class="dock-backdrop"></div>

        <!-- BOTTOM DOCK: KHO MÔ HÌNH 3D HỌC TẬP -->
        <div id="loci-3d-dock" class="loci-3d-dock" role="region" aria-label="Kho Mô hình 3D Lịch Sử">
            <div class="dock-header">
                <div class="dock-title-group">
                    <span class="dock-title-icon">🏛️</span>
                    <div>
                        <h3 class="dock-title">Kho Mô Hình 3D Lịch Sử</h3>
                        <p class="dock-subtitle">Chọn mô hình để quan sát chi tiết 360°, phóng to hiện vật và học kiến thức SGK ngay trong không gian này</p>
                    </div>
                </div>
                <button class="dock-close-btn" id="dock-close-btn" aria-label="Đóng bảng chọn mô hình">✕</button>
            </div>
            <div class="dock-tabs" id="dock-tabs">
                <button class="dock-tab-btn active" data-filter="suggested">✨ Gợi ý theo phòng này</button>
                <button class="dock-tab-btn" data-filter="all">Tất cả (27)</button>
                <button class="dock-tab-btn" data-filter="bai_6">Bài 6: CMT8 1945 (9)</button>
                <button class="dock-tab-btn" data-filter="bai_7">Bài 7: Chống Pháp (9)</button>
                <button class="dock-tab-btn" data-filter="bai_8">Bài 8: Chống Mỹ (9)</button>
            </div>
            <div class="dock-cards-scroll" id="dock-cards-scroll"></div>
        </div>

        <!-- MODAL 3D INSPECTOR: TƯƠNG TÁC XOAY 360 & HỌC KIẾN THỨC -->
        <div id="modal-3d-inspector" class="inspector-modal" role="dialog" aria-modal="true" aria-label="Khám phá mô hình 3D">
            <div class="inspector-container">
                <!-- Header -->
                <div class="inspector-header">
                    <div class="inspector-title-box">
                        <span class="inspector-badge" id="insp-badge">BÀI 6 · TRẠM 1</span>
                        <h3 class="inspector-title" id="insp-title">Quả bom nguyên tử Little Boy</h3>
                    </div>
                    <div class="inspector-actions">
                        <button class="insp-btn insp-btn-ar" id="insp-btn-ar" title="Đặt vào không gian thật bằng camera AR">
                            <span>📱</span>
                            <span>Xem AR</span>
                        </button>
                        <button class="insp-btn insp-btn-pin" id="insp-btn-pin" title="Ghim mô hình này vào phòng 360 hiện tại">
                            <span>📌</span>
                            <span>Ghim vào 360°</span>
                        </button>
                        <button class="insp-btn-close" id="insp-btn-close" aria-label="Đóng khung 3D">✕</button>
                    </div>
                </div>

                <!-- Body: 2 Columns -->
                <div class="inspector-body">
                    <!-- Left: Interactive 3D Canvas -->
                    <div class="inspector-canvas-pane">
                        <div class="insp-canvas-wrapper" id="insp-canvas-wrapper">
                            <model-viewer id="insp-mv" alt="Mô hình 3D Lịch Sử"
                                loading="eager"
                                camera-controls
                                touch-action="pan-y"
                                shadow-intensity="1.3"
                                shadow-softness="0.8"
                                exposure="1.05"
                                environment-image="neutral"
                                auto-rotate
                                auto-rotate-delay="2000"
                                rotation-per-second="15deg"
                                interaction-prompt="auto"
                                ar ar-modes="webxr scene-viewer quick-look">
                            </model-viewer>
                            <div class="insp-loading" id="insp-loading">
                                <div class="insp-spinner"></div>
                                <span>Đang tải mô hình 3D...</span>
                            </div>
                        </div>
                        <!-- 3D Controls Bar -->
                        <div class="insp-3d-controls">
                            <button class="insp-ctrl-btn" id="insp-btn-autorotate" title="Bật/Tắt xoay tự động">🔄 Tự xoay: Bật</button>
                            <button class="insp-ctrl-btn" id="insp-btn-resetview" title="Đặt lại góc nhìn">📐 Góc chuẩn</button>
                            <button class="insp-ctrl-btn" id="insp-btn-fullscreen" title="Phóng to toàn màn hình">⛶ Toàn màn hình</button>
                        </div>
                    </div>

                    <!-- Right: Knowledge & Quiz -->
                    <div class="inspector-info-pane">
                        <!-- Info Tabs -->
                        <div class="insp-info-tabs">
                            <button class="insp-info-tab active" data-tab="knowledge">💡 Kiến thức cốt lõi</button>
                            <button class="insp-info-tab" data-tab="quiz">🧠 Ôn tập nhanh (Quiz)</button>
                        </div>

                        <!-- Tab Content: Knowledge -->
                        <div class="insp-tab-content active" id="insp-tab-knowledge">
                            <div class="insp-summary-card">
                                <div class="insp-section-label">TỔNG QUAN SỰ KIỆN SGK</div>
                                <p id="insp-summary-text" class="insp-summary-text"></p>
                            </div>

                            <div class="insp-points-card">
                                <div class="insp-section-label">Ý CHÍNH THEN CHỐT</div>
                                <ul id="insp-points-list" class="insp-points-list"></ul>
                            </div>

                            <div class="insp-mnemonic-card" id="insp-mnemonic-wrap">
                                <div class="insp-section-label">⚡ CÔNG THỨC GHI NHỚ LOCI</div>
                                <p id="insp-mnemonic-text" class="insp-mnemonic-text"></p>
                            </div>
                        </div>

                        <!-- Tab Content: Quiz -->
                        <div class="insp-tab-content" id="insp-tab-quiz">
                            <div class="insp-quiz-box" id="insp-quiz-box"></div>
                        </div>
                    </div>
                </div>

                <!-- Footer / Navigation -->
                <div class="inspector-footer">
                    <button class="insp-nav-btn" id="insp-btn-prev">◀ Mô hình trước</button>
                    <span class="insp-counter" id="insp-counter">1 / 27</span>
                    <button class="insp-nav-btn" id="insp-btn-next">Mô hình sau ▶</button>
                </div>
            </div>
        </div>
        `;
        document.body.appendChild(wrap);
    }

    // ─── 5. TRẠNG THÁI & LOGIC ĐIỀU KHIỂN DOCK & INSPECTOR ────────────────────
    let currentFilteredList = [];
    let currentModelIndex = 0;
    let currentActiveFilter = 'suggested';
    let isAutoRotating = true;

    function detectCurrentSpaceLesson() {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const lessonParam = urlParams.get('lesson');
            if (lessonParam && ['bai_6', 'bai_7', 'bai_8'].includes(lessonParam)) return lessonParam;

            const lessonSelect = document.getElementById('lesson');
            if (lessonSelect && lessonSelect.value && ['bai_6', 'bai_7', 'bai_8'].includes(lessonSelect.value)) {
                return lessonSelect.value;
            }

            if (window.space && window.space.lesson && ['bai_6', 'bai_7', 'bai_8'].includes(window.space.lesson)) {
                return window.space.lesson;
            }
        } catch (_) {}
        return 'bai_6';
    }

    function getFilteredModels(filterKey) {
        if (filterKey === 'all') return ALL_3D_MODELS;
        if (filterKey === 'suggested') {
            const curLesson = detectCurrentSpaceLesson();
            const list = ALL_3D_MODELS.filter(m => m.lessonKey === curLesson);
            return list.length ? list : ALL_3D_MODELS.filter(m => m.lessonKey === 'bai_6');
        }
        return ALL_3D_MODELS.filter(m => m.lessonKey === filterKey);
    }

    function renderDockCards(filterKey = currentActiveFilter) {
        const container = document.getElementById('dock-cards-scroll');
        if (!container) return;

        currentFilteredList = getFilteredModels(filterKey);
        container.innerHTML = currentFilteredList.map((m, idx) => {
            const enriched = getEnrichedModelData(m);
            return `
            <div class="dock-card" data-idx="${idx}" data-id="${enriched.id}" title="Bấm để khám phá ${enriched.title}">
                <div class="dock-card-top">
                    <span class="dock-card-badge">${enriched.badge}</span>
                </div>
                <div class="dock-card-icon-box">
                    <span>${enriched.icon}</span>
                </div>
                <div class="dock-card-title">${enriched.title}</div>
                <div class="dock-card-action">
                    <span>Khám phá 3D</span>
                    <span>➔</span>
                </div>
            </div>
            `;
        }).join('');

        // Gắn sự kiện click vào từng card
        container.querySelectorAll('.dock-card').forEach(card => {
            card.addEventListener('click', () => {
                const idx = parseInt(card.dataset.idx, 10);
                openInspector(idx);
            });
        });
    }

    function toggleDock(open) {
        const dock = document.getElementById('loci-3d-dock');
        const backdrop = document.getElementById('loci-3d-dock-backdrop');
        if (!dock || !backdrop) return;

        const shouldOpen = open !== undefined ? open : !dock.classList.contains('open');
        if (shouldOpen) {
            renderDockCards(currentActiveFilter);
            dock.classList.add('open');
            backdrop.classList.add('open');
            if (window.LociMentor && typeof window.LociMentor.say === 'function') {
                window.LociMentor.say('Bạn đang mở Kho mô hình 3D. Hãy chọn một mô hình để xoay ngắm và học kiến thức nhé!');
            }
        } else {
            dock.classList.remove('open');
            backdrop.classList.remove('open');
        }
    }

    // ─── 6. LOGIC CHO KHUNG 3D INSPECTOR ────────────────────────────────────
    function openInspector(modelIndex = 0) {
        const modal = document.getElementById('modal-3d-inspector');
        if (!modal) return;

        if (modelIndex < 0) modelIndex = 0;
        if (modelIndex >= currentFilteredList.length) modelIndex = currentFilteredList.length - 1;
        currentModelIndex = modelIndex;

        const raw = currentFilteredList[currentModelIndex];
        const m = getEnrichedModelData(raw);
        if (!m) return;

        // Cập nhật thông tin Header
        const badgeEl = document.getElementById('insp-badge');
        const titleEl = document.getElementById('insp-title');
        const counterEl = document.getElementById('insp-counter');
        if (badgeEl) badgeEl.textContent = m.badge;
        if (titleEl) titleEl.textContent = m.title;
        if (counterEl) counterEl.textContent = `${currentModelIndex + 1} / ${currentFilteredList.length}`;

        // Cập nhật Model Viewer
        const mv = document.getElementById('insp-mv');
        const loading = document.getElementById('insp-loading');
        if (loading) loading.classList.remove('hide');

        if (mv) {
            mv.src = m.url;
            mv.alt = m.title;
            isAutoRotating = true;
            mv.autoRotate = true;
            const autoBtn = document.getElementById('insp-btn-autorotate');
            if (autoBtn) autoBtn.textContent = '🔄 Tự xoay: Bật';

            mv.addEventListener('load', () => {
                if (loading) loading.classList.add('hide');
            }, { once: true });

            mv.addEventListener('error', () => {
                if (loading) {
                    loading.innerHTML = '<span style="color:#f87171">⚠️ Không thể tải file mô hình 3D</span>';
                }
            }, { once: true });
        }

        // Cập nhật Kiến thức SGK
        const sumEl = document.getElementById('insp-summary-text');
        if (sumEl) sumEl.textContent = m.summary;

        const ptsEl = document.getElementById('insp-points-list');
        if (ptsEl) {
            ptsEl.innerHTML = (m.keyPoints || []).map(pt => `<li>${pt}</li>`).join('');
        }

        const mnemWrap = document.getElementById('insp-mnemonic-wrap');
        const mnemEl = document.getElementById('insp-mnemonic-text');
        if (mnemEl && m.mnemonic) {
            mnemEl.textContent = m.mnemonic;
            if (mnemWrap) mnemWrap.style.display = 'block';
        } else if (mnemWrap) {
            mnemWrap.style.display = 'none';
        }

        // Cập nhật Quiz
        renderMiniQuiz(m);

        // Mặc định tab kiến thức
        switchInspectorTab('knowledge');

        // Mở Modal
        modal.classList.add('open');

        // Thông báo Gia sư
        if (window.LociMentor && typeof window.LociMentor.say === 'function') {
            window.LociMentor.say(`Đang quan sát mô hình 3D: "${m.title}". Bạn có thể dùng chuột hoặc chạm để xoay 360°.`);
        }
    }

    function closeInspector() {
        const modal = document.getElementById('modal-3d-inspector');
        if (modal) modal.classList.remove('open');
        const mv = document.getElementById('insp-mv');
        if (mv) {
            // Tạm dừng xoay để tiết kiệm tài nguyên
            mv.autoRotate = false;
        }
    }

    function switchInspectorTab(tabId) {
        document.querySelectorAll('.insp-info-tab').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabId);
        });
        document.querySelectorAll('.insp-tab-content').forEach(pane => {
            pane.classList.toggle('active', pane.id === `insp-tab-${tabId}`);
        });
    }

    function renderMiniQuiz(m) {
        const box = document.getElementById('insp-quiz-box');
        if (!box) return;

        if (!m.quiz || !m.quiz.question || !Array.isArray(m.quiz.options)) {
            box.innerHTML = `
                <div style="text-align:center; padding: 24px; color:#94a3b8;">
                    <div style="font-size:28px; margin-bottom:8px;">🌱</div>
                    <div>Chưa có câu hỏi trắc nghiệm cho mô hình này.</div>
                </div>
            `;
            return;
        }

        const q = m.quiz;
        box.innerHTML = `
            <div class="insp-quiz-q">❓ ${q.question}</div>
            <div class="insp-quiz-opts">
                ${q.options.map((opt, i) => `
                    <button class="insp-quiz-opt" data-opt="${i}">
                        <b>${String.fromCharCode(65 + i)}.</b>
                        <span>${opt}</span>
                    </button>
                `).join('')}
            </div>
            <div class="insp-quiz-feedback" id="insp-quiz-feedback"></div>
        `;

        const optButtons = box.querySelectorAll('.insp-quiz-opt');
        const feedback = box.querySelector('#insp-quiz-feedback');

        optButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const chosen = parseInt(btn.dataset.opt, 10);
                const isCorrect = chosen === q.answer;

                optButtons.forEach((b, i) => {
                    b.disabled = true;
                    if (i === q.answer) b.classList.add('correct');
                    else if (i === chosen && !isCorrect) b.classList.add('wrong');
                });

                if (isCorrect) {
                    feedback.className = 'insp-quiz-feedback show-correct';
                    feedback.innerHTML = `<b>🎉 CHÍNH XÁC!</b> ${q.explanation}`;
                    if (window.LociMentor && typeof window.LociMentor.say === 'function') {
                        window.LociMentor.say('Tuyệt vời! Bạn đã trả lời đúng câu hỏi trắc nghiệm của mốc này.');
                    }
                } else {
                    feedback.className = 'insp-quiz-feedback show-wrong';
                    feedback.innerHTML = `<b>⚠️ CHƯA CHÍNH XÁC.</b> Đáp án đúng là <b>${String.fromCharCode(65 + q.answer)}</b>. ${q.explanation}`;
                    if (window.LociMentor && typeof window.LociMentor.say === 'function') {
                        window.LociMentor.say('Chưa đúng rồi! Đọc lại giải thích để ghi nhớ sâu hơn nhé.');
                    }
                }
            });
        });
    }

    // ─── 7. HỖ TRỢ GHIM MỐC VÀO PHÒNG 360° ──────────────────────────────────
    function pinCurrentModelTo360() {
        const m = currentFilteredList[currentModelIndex];
        if (!m) return;

        // Nếu có hàm đặt mốc trong không gian 360
        if (typeof window.addMarkerAtCurrentView === 'function') {
            window.addMarkerAtCurrentView(m);
            closeInspector();
            toggleDock(false);
            return;
        }

        // Kích hoạt chế độ đặt mốc chuẩn của khong_gian_360.html
        if (typeof window.setPlacing === 'function') {
            window.selId = m.id;
            window.setPlacing(true);
            if (typeof window.renderAnchorsList === 'function') window.renderAnchorsList();
            closeInspector();
            toggleDock(false);
            if (typeof window.toast === 'function') {
                window.toast(`📍 Hãy bấm vào mặt sàn hoặc góc phòng 360° để đặt mô hình: "${m.title}"`);
            }
            return;
        }

        alert(`✅ Đã chọn mốc "${m.title}". Bạn hãy bấm vào điểm bất kỳ trong phòng 360 để gắn vị trí!`);
        closeInspector();
        toggleDock(false);
    }

    // ─── 8. MỞ CHẾ ĐỘ AR CAMERA THỰC TẾ CHO MÔ HÌNH NÀY ─────────────────────
    function openCurrentModelInAR() {
        const m = currentFilteredList[currentModelIndex];
        if (!m) return;

        closeInspector();
        toggleDock(false);

        // Kích hoạt LociModelAR sẵn có
        if (window.LociModelAR && typeof window.LociModelAR.openWithModel === 'function') {
            window.LociModelAR.openWithModel({
                title: m.title,
                url: m.url
            });
            return;
        }

        // Hoặc mở model-viewer native AR
        const mv = document.getElementById('lmar-mv');
        if (mv) {
            mv.src = m.url;
            const arBtn = document.getElementById('v-model-ar');
            if (arBtn) arBtn.click();
        } else {
            alert('Trình duyệt của bạn đang sẵn sàng hiển thị mô hình 3D tương tác.');
        }
    }

    // ─── 9. KHỞI TẠO TOÀN BỘ SỰ KIỆN ─────────────────────────────────────────
    function initEvents() {
        // Nút mở Dock trên thanh topbar
        const dockBtn = document.getElementById('v-3d-dock-btn');
        if (dockBtn) {
            dockBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleDock();
            });
        }

        // Nút đóng Dock
        const closeDockBtn = document.getElementById('dock-close-btn');
        if (closeDockBtn) closeDockBtn.addEventListener('click', () => toggleDock(false));

        const backdrop = document.getElementById('loci-3d-dock-backdrop');
        if (backdrop) backdrop.addEventListener('click', () => toggleDock(false));

        // Tabs lọc trong Dock
        const tabBtns = document.querySelectorAll('.dock-tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentActiveFilter = btn.dataset.filter;
                renderDockCards(currentActiveFilter);
            });
        });

        // Inspector: Đóng
        const closeInspBtn = document.getElementById('insp-btn-close');
        if (closeInspBtn) closeInspBtn.addEventListener('click', closeInspector);

        // Inspector: Backdrop click
        const inspModal = document.getElementById('modal-3d-inspector');
        if (inspModal) {
            inspModal.addEventListener('click', (e) => {
                if (e.target === inspModal) closeInspector();
            });
        }

        // Inspector: Chuyển tab Kiến thức / Quiz
        const infoTabs = document.querySelectorAll('.insp-info-tab');
        infoTabs.forEach(tab => {
            tab.addEventListener('click', () => switchInspectorTab(tab.dataset.tab));
        });

        // Inspector: Tự xoay 3D
        const autoRotateBtn = document.getElementById('insp-btn-autorotate');
        const mv = document.getElementById('insp-mv');
        if (autoRotateBtn && mv) {
            autoRotateBtn.addEventListener('click', () => {
                isAutoRotating = !isAutoRotating;
                mv.autoRotate = isAutoRotating;
                autoRotateBtn.textContent = isAutoRotating ? '🔄 Tự xoay: Bật' : '⏸️ Tự xoay: Tắt';
            });
        }

        // Inspector: Đặt lại góc nhìn chuẩn
        const resetViewBtn = document.getElementById('insp-btn-resetview');
        if (resetViewBtn && mv) {
            resetViewBtn.addEventListener('click', () => {
                mv.cameraOrbit = '0deg 75deg 105%';
                mv.fieldOfView = 'auto';
            });
        }

        // Inspector: Phóng to toàn màn hình
        const fsBtn = document.getElementById('insp-btn-fullscreen');
        const canvasWrapper = document.getElementById('insp-canvas-wrapper');
        if (fsBtn && canvasWrapper) {
            fsBtn.addEventListener('click', () => {
                if (!document.fullscreenElement) {
                    canvasWrapper.requestFullscreen().catch(() => {});
                } else {
                    document.exitFullscreen().catch(() => {});
                }
            });
        }

        // Inspector: Nút AR & Ghim mốc
        const arBtn = document.getElementById('insp-btn-ar');
        if (arBtn) arBtn.addEventListener('click', openCurrentModelInAR);

        const pinBtn = document.getElementById('insp-btn-pin');
        if (pinBtn) pinBtn.addEventListener('click', pinCurrentModelTo360);

        // Inspector: Trước / Sau
        const prevBtn = document.getElementById('insp-btn-prev');
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                const nextIdx = currentModelIndex > 0 ? currentModelIndex - 1 : currentFilteredList.length - 1;
                openInspector(nextIdx);
            });
        }

        const nextBtn = document.getElementById('insp-btn-next');
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                const nextIdx = currentModelIndex < currentFilteredList.length - 1 ? currentModelIndex + 1 : 0;
                openInspector(nextIdx);
            });
        }

        // Phím tắt bàn phím
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeInspector();
                toggleDock(false);
            }
            const modalOpen = inspModal && inspModal.classList.contains('open');
            if (modalOpen) {
                if (e.key === 'ArrowLeft' && prevBtn) prevBtn.click();
                if (e.key === 'ArrowRight' && nextBtn) nextBtn.click();
            }
        });
    }

    // ─── 10. KHỞI CHẠY TỰ ĐỘNG ────────────────────────────────────────────────
    function start() {
        injectPickerStyles();
        injectPickerHTML();
        initEvents();

        // Đăng ký API toàn cục
        window.Loci3DModelPicker = {
            toggleDock,
            openInspector,
            closeInspector,
            getModels: () => ALL_3D_MODELS
        };
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }
})();

