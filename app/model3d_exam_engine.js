/**
 * ===========================================================================
 * LOCI EDU - HỆ THỐNG KIỂM TRA MÔ HÌNH 3D LỊCH SỬ TƯƠNG TÁC
 * Chuyên biệt Chủ đề 3: Bài 6, Bài 7, Bài 8 (27 Mô hình 3D chuẩn)
 * Đa dạng hình thức: Gõ đáp án, Trắc nghiệm 4 lựa chọn, Đúng/Sai (Bộ GD&ĐT 2025)
 * ===========================================================================
 */

(function (global) {
  'use strict';

  // 1. KHO DỮ LIỆU 27 MÔ HÌNH 3D & BỘ CÂU HỎI KIỂM TRA ĐA DẠNG
  const MODEL_EXAM_DATA = {
    bai_6: [
      {
        order: 1,
        stationBadge: 'BÀI 6 · TRẠM 1',
        title: 'Quả bom nguyên tử Little Boy & Thời cơ ngàn năm có một',
        modelUrl: 'assets/models/tram1/little_boy_atomic_bomb.glb',
        poster: 'assets/images/bai6_chuan/b6_t1_bom_nguyen_tu.png',
        summary: 'Tháng 8/1945, phát xít Nhật đầu hàng Đồng minh không điều kiện sau 2 quả bom nguyên tử và đòn tấn công của Liên Xô. Thời cơ vàng ngàn năm có một xuất hiện để toàn dân đứng lên Tổng khởi nghĩa.',
        mnemonic: 'Tưởng tượng 2 quả cầu lửa bom nguyên tử trên cổng Loci (6/8 & 9/8) và tờ hịch Nhật đầu hàng 15/8.',
        keyPoints: [
          'Ngày 6/8 & 9/8/1945: Mỹ ném bom nguyên tử xuống Hiroshima và Nagasaki.',
          'Ngày 15/8/1945: Nhật hoàng tuyên bố đầu hàng Đồng minh vô điều kiện.',
          'Thời cơ ngàn năm có một: Kẻ thù chính ngã gục, chính quyền bù nhìn rệu rã.'
        ],
        typein: {
          prompt: 'Quan sát mô hình 3D: Gõ ngày phát xít Nhật chính thức tuyên bố đầu hàng Đồng minh vô điều kiện, mở ra thời cơ ngàn năm có một:',
          target: '15/8/1945',
          accepted: ['15/8/1945', '15-8-1945', '15/8', '15 tháng 8 năm 1945', '15/08/1945'],
          hint: 'Ngày giữa tháng 8 năm 1945 (trước ngày Khởi nghĩa Hà Nội 4 ngày)',
          explanation: 'Trưa 15/8/1945, Nhật hoàng tuyên bố đầu hàng Đồng minh không điều kiện, tạo ra thời cơ khách quan thuận lợi nhất cho dân tộc ta.'
        },
        quiz: {
          question: 'Sự kiện quốc tế nào trực tiếp báo hiệu thời cơ Cách mạng Tháng Tám năm 1945 đã hoàn toàn chín muồi?',
          options: [
            'A. Nhật hoàng tuyên bố đầu hàng Đồng minh không điều kiện (15/8/1945)',
            'B. Hội nghị Ianta phân chia phạm vi ảnh hưởng kết thúc',
            'C. Đồng minh mở mặt trận thứ hai đổ bộ vào Normandie giải phóng nước Pháp',
            'D. Liên Hợp Quốc chính thức được thành lập tại Xan Phran-xi-xcô'
          ],
          correct: 0,
          explanation: 'Ngày 15/8/1945, Nhật tuyên bố đầu hàng Đồng minh không điều kiện, quân Nhật ở Đông Dương tê liệt, chính quyền tay sai hoang mang cùng cực, tạo thời cơ thuận lợi ngàn năm có một.'
        },
        trueFalse: {
          context: 'Quan sát mô hình 3D quả bom nguyên tử và kiến thức lịch sử về thời cơ Cách mạng Tháng Tám năm 1945:',
          statements: [
            { id: 'a', text: 'Hai quả bom nguyên tử ném xuống Nhật Bản ngày 6/8 và 9/8/1945 đã bẻ gãy ý chí kháng cự của phát xít Nhật.', isTrue: true, explain: 'Đòn tấn công hạt nhân cùng sự tham chiến của Liên Xô buộc Nhật phải đầu hàng vô điều kiện.' },
            { id: 'b', text: 'Thời cơ ngàn năm có một tồn tại từ khi Nhật đầu hàng đến trước khi quân Đồng minh kéo vào Đông Dương.', isTrue: true, explain: 'Đây là khoảng thời gian thuận lợi nhất để ta giành chính quyền với tư cách là chủ nhân đất nước.' },
            { id: 'c', text: 'Đảng ta chủ trương hoãn khởi nghĩa để đợi quân Đồng minh vào tước vũ khí quân Nhật rồi mới đàm phán.', isTrue: false, explain: 'Đảng chủ trương phát động toàn dân đứng lên giành chính quyền trước khi quân Đồng minh vào nước ta.' },
            { id: 'd', text: 'Việc Nhật đầu hàng đã làm cho quân đội Nhật tại Đông Dương hoang mang rệu rã và chính phủ Trần Trọng Kim tê liệt.', isTrue: true, explain: 'Kẻ thù chính đã gục ngã, chính quyền bù nhìn không còn chỗ dựa.' }
          ]
        }
      },
      {
        order: 2,
        stationBadge: 'BÀI 6 · TRẠM 2',
        title: 'Lán Nà Nưa lịch sử & Quân lệnh số 1 Khởi nghĩa',
        modelUrl: 'assets/models/tram2/lan_na_nua_opt.glb',
        poster: 'assets/images/bai6_chuan/b6_t2_luc_luong_chuan_bi.png',
        summary: 'Lán Nà Nưa (Tân Trào, Tuyên Quang) là nơi Bác Hồ ở và chỉ đạo Tổng khởi nghĩa. Đêm 13/8/1945, Ủy ban Khởi nghĩa toàn quốc ban bố Quân lệnh số 1 chính thức phát động Tổng khởi nghĩa.',
        mnemonic: 'Lán Nà Nưa đơn sơ - Quyết tâm cháy Trường Sơn - Quân lệnh số 1 lệnh phát động.',
        keyPoints: [
          'Đêm 13/8/1945: Ủy ban Khởi nghĩa toàn quốc ban bố Quân lệnh số 1.',
          'Hội nghị toàn quốc của Đảng (14 - 15/8/1945) quyết định phát động Tổng khởi nghĩa.',
          'Lời dặn của Bác: "Dù phải đốt cháy cả dãy Trường Sơn cũng phải kiên quyết giành độc lập".'
        ],
        typein: {
          prompt: 'Quan sát mô hình 3D Lán Nà Nưa: Gõ khẩu hiệu hành động tiêu biểu nhất trong cao trào kháng Nhật cứu nước thổi bùng khí thế toàn dân:',
          target: 'Phá kho thóc Nhật',
          accepted: ['Phá kho thóc Nhật', 'Pha kho thoc Nhat', 'Phá kho thóc của Nhật', 'Phá kho thóc', 'Pha kho thoc'],
          hint: 'Bắt đầu bằng cụm từ "Phá kho...", nhằm giải quyết nạn đói lịch sử năm 1945',
          explanation: 'Khẩu hiệu "Phá kho thóc Nhật, giải quyết nạn đói" đã đáp ứng đúng nguyện vọng cấp bách của quần chúng, lôi cuốn hàng triệu người vào phong trào cách mạng.'
        },
        quiz: {
          question: 'Quân lệnh số 1 chính thức phát lệnh Tổng khởi nghĩa giành chính quyền trong cả nước được ban bố vào thời điểm nào?',
          options: [
            'A. Đêm ngày 13 tháng 8 năm 1945',
            'B. Sáng ngày 16 tháng 8 năm 1945',
            'C. Chiều ngày 19 tháng 8 năm 1945',
            'D. Sáng ngày 02 tháng 9 năm 1945'
          ],
          correct: 0,
          explanation: 'Đêm 13/8/1945, ngay sau khi nhận được tin Nhật sắp đầu hàng, Ủy ban Khởi nghĩa toàn quốc thành lập tại Tân Trào đã lập tức ban bố Quân lệnh số 1.'
        },
        trueFalse: {
          context: 'Quan sát mô hình 3D Lán Nà Nưa và sự kiện chuẩn bị Tổng khởi nghĩa tại Tân Trào tháng 8/1945:',
          statements: [
            { id: 'a', text: 'Lán Nà Nưa thuộc địa phận thôn Tân Lập, xã Tân Trào, huyện Sơn Dương, tỉnh Tuyên Quang.', isTrue: true, explain: 'Đây là căn cứ địa đầu não của Trung ương Đảng và Bác Hồ trong những ngày tiền khởi nghĩa.' },
            { id: 'b', text: 'Hội nghị toàn quốc của Đảng họp tại Tân Trào từ ngày 14 đến 15/8/1945 đã quyết định hoãn khởi nghĩa vũ trang.', isTrue: false, explain: 'Hội nghị đã quyết định phát động toàn dân Tổng khởi nghĩa giành chính quyền trước khi Đồng minh kéo vào.' },
            { id: 'c', text: 'Bác Hồ đã ra chỉ thị kiên quyết giành cho được độc lập dù phải hy sinh, đốt cháy cả dãy Trường Sơn.', isTrue: true, explain: 'Đây là quyết tâm sắt đá của Bác Hồ và toàn Đảng trước vận mệnh ngàn năm có một.' },
            { id: 'd', text: 'Quân lệnh số 1 kêu gọi đồng bào và các lực lượng vũ trang vùng lên tước vũ khí của giặc Nhật.', isTrue: true, explain: 'Nội dung Quân lệnh số 1 phát lệnh tiến công đánh chiếm các đô thị và đồn trại giặc.' }
          ]
        }
      },
      {
        order: 3,
        stationBadge: 'BÀI 6 · TRẠM 3',
        title: 'Hội trường Đình Tân Trào & Quốc dân Đại hội',
        modelUrl: 'assets/models/tram3/uy_ban.glb',
        poster: 'assets/images/bai6_chuan/b6_t3_khu_giai_phong.png',
        summary: 'Ngày 16 - 17/8/1945, Quốc dân Đại hội họp tại Đình Tân Trào, tán thành quyết định Tổng khởi nghĩa, thông qua 10 chính sách Việt Minh và bầu Ủy ban Dân tộc Giải phóng Việt Nam do Hồ Chí Minh làm Chủ tịch.',
        mnemonic: 'Mái đình Tân Trào - Quốc dân đại hội - Cờ đỏ sao vàng - Bác làm Chủ tịch.',
        keyPoints: [
          'Ngày 16 - 17/8/1945: Quốc dân Đại hội Tân Trào triệu tập gần 60 đại biểu 3 miền.',
          'Thông qua 10 chính sách lớn của Mặt trận Việt Minh.',
          'Bầu Ủy ban Dân tộc Giải phóng Việt Nam (Chính phủ lâm thời).'
        ],
        typein: {
          prompt: 'Quan sát mô hình 3D Đình Tân Trào: Gõ tên cơ quan đại diện cho toàn dân tộc được Đại hội bầu ra mang tư cách Chính phủ lâm thời:',
          target: 'Ủy ban Dân tộc giải phóng Việt Nam',
          accepted: ['Ủy ban Dân tộc giải phóng Việt Nam', 'Uy ban Dan toc giai phong Viet Nam', 'Ủy ban Dân tộc giải phóng', 'Uy ban Dan toc giai phong'],
          hint: 'Bắt đầu bằng cụm từ: "Ủy ban Dân tộc...", do Bác Hồ làm Chủ tịch',
          explanation: 'Quốc dân Đại hội Tân Trào đã bầu ra Ủy ban Dân tộc giải phóng Việt Nam do đồng chí Hồ Chí Minh làm Chủ tịch.'
        },
        quiz: {
          question: 'Quốc dân Đại hội Tân Trào (16 - 17/8/1945) đã có quyết định lịch sử nào dưới đây?',
          options: [
            'A. Tán thành lệnh Tổng khởi nghĩa, thông qua 10 chính sách Việt Minh và quy định Quốc kỳ, Quốc ca',
            'B. Thành lập Mặt trận Việt Nam Độc lập Đồng minh (Việt Minh)',
            'C. Ký kết Hiệp định Sơ bộ với đại diện chính phủ Pháp',
            'D. Quyết định mở chiến dịch Biên giới giải phóng vùng Đông Bắc'
          ],
          correct: 0,
          explanation: 'Đại hội đã nhất trí tán thành quyết định Tổng khởi nghĩa của Đảng, thông qua 10 chính sách Việt Minh và quy định Quốc kỳ cờ đỏ sao vàng, Quốc ca là bài Tiến quân ca.'
        },
        trueFalse: {
          context: 'Quan sát mô hình 3D và kiến thức lịch sử về Quốc dân Đại hội Tân Trào tháng 8/1945:',
          statements: [
            { id: 'a', text: 'Quốc dân Đại hội Tân Trào được ví như Hội nghị Diên Hồng thứ hai trong lịch sử dân tộc Việt Nam.', isTrue: true, explain: 'Đại hội biểu thị ý chí quật cường, thống nhất lòng dân của cả nước trước bước ngoặt sống còn.' },
            { id: 'b', text: 'Đại hội Tân Trào đã cử ra Chính phủ chính thức đầu tiên của nước Việt Nam sau bầu cử Quốc hội.', isTrue: false, explain: 'Đại hội cử ra Ủy ban Dân tộc giải phóng Việt Nam, mang tư cách là Chính phủ lâm thời.' },
            { id: 'c', text: 'Bài hát "Tiến quân ca" của nhạc sĩ Văn Cao được Đại hội lựa chọn làm Quốc ca của nước ta.', isTrue: true, explain: 'Tiến quân ca chính thức trở thành Quốc ca Việt Nam từ Đại hội Tân Trào.' },
            { id: 'd', text: 'Đại hội Tân Trào chỉ có đại biểu của Việt Bắc tham dự do thời gian quá gấp rút.', isTrue: false, explain: 'Đại hội quy tụ gần 60 đại biểu đại diện cho cả ba miền Bắc - Trung - Nam, các đảng phái và kiều bào.' }
          ]
        }
      },
      {
        order: 4,
        stationBadge: 'BÀI 6 · TRẠM 4',
        title: 'Đoàn quân giải phóng Thái Nguyên & Bốn tỉnh sớm nhất',
        modelUrl: 'assets/models/tram4/dung_day_khoi_nghia.glb',
        poster: 'assets/images/bai6_chuan/b6_t4_khoi_nghia_tung_phan.png',
        summary: 'Chiều 16/8/1945, Quân Giải phóng do đồng chí Võ Nguyên Giáp chỉ huy tiến về giải phóng thị xã Thái Nguyên. Ngày 18/8/1945, 4 tỉnh Bắc Giang, Hải Dương, Hà Tĩnh, Quảng Nam giành chính quyền sớm nhất nước.',
        mnemonic: 'Bắc Giang - Hải Dương - Hà Tĩnh - Quảng Nam: 4 ngôi sao tiên phong ngày 18/8.',
        keyPoints: [
          'Chiều 16/8/1945: Quân Giải phóng xuất phát từ Cây đa Tân Trào tiến đánh Thái Nguyên.',
          'Ngày 18/8/1945: 4 tỉnh giành chính quyền ở tỉnh lỵ sớm nhất cả nước.',
          'Khí thế cách mạng bùng nổ mạnh mẽ tại vùng nông thôn và thị xã.'
        ],
        typein: {
          prompt: 'Quan sát mô hình 3D Giải phóng quân xuất quân: Gõ ngày đồng chí Võ Nguyên Giáp chỉ huy đơn vị tiến về giải phóng thị xã Thái Nguyên:',
          target: '16/8/1945',
          accepted: ['16/8/1945', '16-8-1945', '16/8', '16 tháng 8 năm 1945', '16/08/1945'],
          hint: 'Chiều ngày 16 tháng 8 năm 1945, ngay sau lệnh xuất quân tại Cây đa Tân Trào',
          explanation: 'Chiều 16/8/1945, dưới sự chỉ huy của đồng chí Võ Nguyên Giáp, một đơn vị Quân Giải phóng xuất phát đánh chiếm đồn Nhật ở thị xã Thái Nguyên.'
        },
        quiz: {
          question: 'Bốn tỉnh giành được chính quyền ở tỉnh lỵ sớm nhất trong cả nước ngày 18/8/1945 là:',
          options: [
            'A. Bắc Giang, Hải Dương, Hà Tĩnh, Quảng Nam',
            'B. Hà Nội, Huế, Sài Gòn, Hải Phòng',
            'C. Tuyên Quang, Thái Nguyên, Cao Bằng, Lạng Sơn',
            'D. Nghệ An, Hà Tĩnh, Quảng Bình, Quảng Trị'
          ],
          correct: 0,
          explanation: 'Ngày 18/8/1945, nhân dân 4 tỉnh Bắc Giang, Hải Dương, Hà Tĩnh, Quảng Nam đã chớp thời cơ vùng lên lật đổ ách thống trị của tay sai, giành chính quyền sớm nhất.'
        },
        trueFalse: {
          context: 'Quan sát mô hình 3D và diễn biến khởi nghĩa giành chính quyền ở các địa phương tháng 8/1945:',
          statements: [
            { id: 'a', text: 'Quân Giải phóng xuất phát từ Cây đa Tân Trào chiều 16/8/1945 mở đầu cuộc tiến công vũ trang hỗ trợ khởi nghĩa.', isTrue: true, explain: 'Đồng chí Võ Nguyên Giáp đọc bản Quân lệnh số 1 rồi chỉ huy xuất quân tiến về Thái Nguyên.' },
            { id: 'b', text: 'Bắc Giang, Hải Dương, Hà Tĩnh, Quảng Nam giành chính quyền vào ngày 18/8/1945.', isTrue: true, explain: 'Đây là 4 tỉnh giành chính quyền sớm nhất cả nước.' },
            { id: 'c', text: 'Khởi nghĩa ở 4 tỉnh trên chỉ giành được chính quyền sau khi quân đội Đồng minh can thiệp tước vũ khí Nhật.', isTrue: false, explain: 'Quần chúng đã tự lực nổi dậy làm chủ tình thế trước khi Đồng minh kéo vào.' },
            { id: 'd', text: 'Thắng lợi ở các địa phương đã tạo thành vòng vây siết chặt các đô thị lớn chuẩn bị cho khởi nghĩa toàn quốc.', isTrue: true, explain: 'Nông thôn bao vây đô thị, tạo điều kiện thuận lợi cho khởi nghĩa ở Hà Nội, Huế, Sài Gòn.' }
          ]
        }
      },
      {
        order: 5,
        stationBadge: 'BÀI 6 · TRẠM 5',
        title: 'Mít tinh khởi nghĩa Nhà hát Lớn Hà Nội (19/8/1945)',
        modelUrl: 'assets/models/tram5/mit_tinh_nha_hat_lon.glb',
        poster: 'assets/images/bai6_chuan/b6_t5_khoi_nghia_ha_noi.png',
        summary: 'Sáng 19/8/1945, biển người Hà Nội tập trung tại Nhà hát Lớn mít tinh rồi biến thành biểu tình vũ trang đánh chiếm Phủ Khâm sai, Tòa Thị chính, Trại Bảo an binh... Hà Nội hoàn toàn về tay nhân dân.',
        mnemonic: '19/8 Hà Nội mít tinh rực lửa - Cờ đỏ sao vàng tung bay Nhà hát Lớn.',
        keyPoints: [
          'Sáng 19/8/1945: Mít tinh biến thành cuộc tuần hành vũ trang chiếm các cơ quan đầu não địch.',
          'Đến tối 19/8/1945: Khởi nghĩa tại Thủ đô Hà Nội hoàn toàn thắng lợi.',
          'Thắng lợi tại Hà Nội quyết định tốc độ thắng lợi của CMT8 trên toàn quốc.'
        ],
        typein: {
          prompt: 'Quan sát mô hình 3D Nhà hát Lớn: Gõ ngày nhân dân Hà Nội tổ chức mít tinh lớn rồi biến thành khởi nghĩa vũ trang làm chủ Thủ đô:',
          target: '19/8/1945',
          accepted: ['19/8/1945', '19-8-1945', '19/8', '19 tháng 8 năm 1945', '19/08/1945'],
          hint: 'Ngày 19 tháng 8 năm 1945 (ngày kỷ niệm truyền thống lực lượng Công an nhân dân)',
          explanation: 'Ngày 19/8/1945, cuộc khởi nghĩa giành chính quyền ở Hà Nội toàn thắng, giáng đòn quyết định vào chính quyền tay sai bù nhìn.'
        },
        quiz: {
          question: 'Địa điểm nào tại Hà Nội là nơi diễn ra cuộc mít tinh lịch sử sáng 19/8/1945 biến thành biểu tình vũ trang chiếm Phủ Khâm sai?',
          options: [
            'A. Quảng trường Nhà hát Lớn Hà Nội',
            'B. Quảng trường Ba Đình lịch sử',
            'C. Cột cờ Hà Nội (Hoàng thành Thăng Long)',
            'D. Quảng trường Đông Kinh Nghĩa Thục'
          ],
          correct: 0,
          explanation: 'Sáng 19/8/1945, hàng vạn quần chúng tập trung tại Quảng trường Nhà hát Lớn mít tinh, hát vang bài Tiến quân ca rồi rầm rộ tỏa đi đánh chiếm các cơ quan đầu não địch.'
        },
        trueFalse: {
          context: 'Quan sát mô hình 3D Nhà hát Lớn và diễn biến khởi nghĩa tại Hà Nội ngày 19/8/1945:',
          statements: [
            { id: 'a', text: 'Cuộc mít tinh sáng 19/8/1945 do Mặt trận Việt Minh tổ chức với sự tham gia của đông đảo các tầng lớp nhân dân.', isTrue: true, explain: 'Biển người mang cờ đỏ sao vàng biến cuộc mít tinh thành biểu tình vũ trang.' },
            { id: 'b', text: 'Lực lượng tự vệ và quần chúng đã đánh chiếm Phủ Khâm sai, Tòa Thị chính, Kho bạc và Trại Bảo an binh.', isTrue: true, explain: 'Các mục tiêu đầu não của chính quyền tay sai nhanh chóng sụp đổ.' },
            { id: 'c', text: 'Quân đội Nhật tại Hà Nội đã nổ súng phản kích quyết liệt khiến khởi nghĩa kéo dài nhiều ngày.', isTrue: false, explain: 'Trước khí thế áp đảo của quần chúng, quân Nhật án binh bất động, ta thương lượng buộc chúng không can thiệp.' },
            { id: 'd', text: 'Thắng lợi ở Hà Nội có ý nghĩa quyết định, cổ vũ mạnh mẽ nhân dân cả nước đứng lên khởi nghĩa.', isTrue: true, explain: 'Hà Nội là trái tim của cả nước, thắng lợi ở đây tạo xung lực quyết định.' }
          ]
        }
      },
      {
        order: 6,
        stationBadge: 'BÀI 6 · TRẠM 6',
        title: 'Khởi nghĩa giành chính quyền ở Huế & Sài Gòn',
        modelUrl: 'assets/models/bai7/tram2/nhan_dan_nambo_chien_dau.glb',
        poster: 'assets/images/bai6_chuan/b6_t6_khoi_nghia_hue_saigon.png',
        summary: 'Sau thắng lợi ở Hà Nội, nhân dân Thừa Thiên Huế giành chính quyền ngày 23/8/1945. Hơn một triệu đồng bào Sài Gòn - Chợ Lớn rầm rộ nổi dậy ngày 25/8/1945. Ba trung tâm lớn toàn thắng.',
        mnemonic: 'Hà Nội (19/8) ➔ Huế (23/8) ➔ Sài Gòn (25/8): Ba đòn sấm sét chấn động non sông.',
        keyPoints: [
          'Ngày 23/8/1945: Khởi nghĩa thắng lợi ở Huế, cô lập triều đình phong kiến.',
          'Ngày 25/8/1945: Hơn một triệu quần chúng Sài Gòn - Gia Định làm chủ thành phố.',
          'Ngày 28/8/1945: Hai tỉnh cuối cùng Đồng Nai Thượng và Hà Tiên hoàn tất thắng lợi.'
        ],
        typein: {
          prompt: 'Quan sát mô hình 3D Nhân dân miền Nam quật khởi: Gõ ngày nhân dân Sài Gòn rầm rộ biểu tình vũ trang khởi nghĩa thắng lợi rực rỡ:',
          target: '25/8/1945',
          accepted: ['25/8/1945', '25-8-1945', '25/8', '25 tháng 8 năm 1945', '25/08/1945'],
          hint: 'Ngày 25 tháng 8 năm 1945 (ngay sau ngày khởi nghĩa ở Huế 2 ngày)',
          explanation: 'Ngày 25/8/1945, hơn một triệu quần chúng Sài Gòn - Chợ Lớn xuống đường khởi nghĩa làm chủ toàn thành phố.'
        },
        quiz: {
          question: 'Hai tỉnh cuối cùng trong cả nước giành được chính quyền vào ngày 28/8/1945 là:',
          options: [
            'A. Đồng Nai Thượng và Hà Tiên',
            'B. Bạc Liêu và Cà Mau',
            'C. Lai Châu và Sơn La',
            'D. Kon Tum và Gia Lai'
          ],
          correct: 0,
          explanation: 'Ngày 28/8/1945, hai tỉnh cuối cùng là Đồng Nai Thượng và Hà Tiên giành được chính quyền, khép lại cuộc Tổng khởi nghĩa Tháng Tám toàn thắng.'
        },
        trueFalse: {
          context: 'Quan sát mô hình 3D và sự kiện khởi nghĩa tại Huế, Sài Gòn cùng các địa phương cuối tháng 8/1945:',
          statements: [
            { id: 'a', text: 'Khởi nghĩa ở Huế thắng lợi ngày 23/8/1945 đã cô lập hoàn toàn hoàng cung triều Nguyễn.', isTrue: true, explain: 'Chính quyền về tay nhân dân khiến triều đình Bảo Đại mất hoàn toàn chỗ dựa.' },
            { id: 'b', text: 'Khởi nghĩa tại Sài Gòn thắng lợi vào ngày 25/8/1945 với lực lượng tham gia lên đến hơn một triệu người.', isTrue: true, explain: 'Lực lượng Thanh niên Tiền phong và các tầng lớp nhân dân Nam Bộ nổi dậy áp đảo.' },
            { id: 'c', text: 'Tổng khởi nghĩa Tháng Tám 1945 diễn ra trong khoảng thời gian hơn một năm ròng rã.', isTrue: false, explain: 'Tổng khởi nghĩa diễn ra thần tốc và thắng lợi trọn vẹn trong vòng 15 ngày (từ 14/8 đến 28/8/1945).' },
            { id: 'd', text: 'Thắng lợi tại ba đô thị Hà Nội - Huế - Sài Gòn có ý nghĩa quyết định thắng lợi của CMT8 trên toàn quốc.', isTrue: true, explain: 'Ba trung tâm chính trị, văn hóa, kinh tế lớn bị đập tan khiến cả nước thắng lợi nhanh chóng.' }
          ]
        }
      },
      {
        order: 7,
        stationBadge: 'BÀI 6 · TRẠM 7',
        title: 'Vua Bảo Đại thoái vị — Chấm dứt chế độ phong kiến',
        modelUrl: 'assets/models/tram7/vua_bao_dai_thoai_vi.glb',
        poster: 'assets/images/bai6_chuan/b6_t7_bao_dai_thoai_vi.png',
        summary: 'Chiều 30/8/1945 tại Ngọ Môn Huế, Bảo Đại nộp ấn kiếm thoái vị. Tuyên bố nổi tiếng: "Thà làm dân một nước độc lập hơn làm vua một nước nô lệ", chấm dứt chế độ phong kiến ngàn năm.',
        mnemonic: 'Ngọ Môn chiều 30/8 - Bảo Đại nộp ấn vàng kiếm ngọc - Phong kiến sụp đổ.',
        keyPoints: [
          'Chiều 30/8/1945: Lễ thoái vị long trọng tổ chức tại lầu Ngọ Môn (Huế).',
          'Bảo Đại trao ấn vàng và kiếm ngọc cho đại diện Chính phủ lâm thời.',
          'Chế độ phong kiến quân chủ chuyên chế ngót chục thế kỷ chính thức chấm dứt.'
        ],
        typein: {
          prompt: 'Quan sát mô hình 3D Vua Bảo Đại trao ấn kiếm: Gõ ngày vua Bảo Đại làm lễ thoái vị chấm dứt chế độ phong kiến triều Nguyễn:',
          target: '30/8/1945',
          accepted: ['30/8/1945', '30-8-1945', '30/8', '30 tháng 8 năm 1945', '30/08/1945'],
          hint: 'Chiều ngày 30 tháng 8 năm 1945 (trước ngày Tuyên ngôn Độc lập 3 ngày)',
          explanation: 'Chiều 30/8/1945 tại Ngọ Môn, Bảo Đại nộp ấn kiếm thoái vị, tuyên bố trao lại chính quyền cho nước Việt Nam mới.'
        },
        quiz: {
          question: 'Sự kiện vua Bảo Đại tuyên bố thoái vị tại lầu Ngọ Môn ngày 30/8/1945 mang ý nghĩa lịch sử sâu sắc nào?',
          options: [
            'A. Chấm dứt hoàn toàn chế độ quân chủ chuyên chế phong kiến ngót chục thế kỷ ở Việt Nam',
            'B. Đánh dấu sự chuyển giao quyền lực sang chính thể cộng hòa quân sự',
            'C. Bắt đầu thời kỳ liên hiệp giữa lực lượng Việt Minh và các đảng phái thân Pháp',
            'D. Thừa nhận vai trò thống trị của thực dân Pháp tại khu vực miền Trung'
          ],
          correct: 0,
          explanation: 'Bảo Đại thoái vị đã khép lại vĩnh viễn vương triều nhà Nguyễn và chế độ quân chủ phong kiến kéo dài hàng ngàn năm trong lịch sử dân tộc.'
        },
        trueFalse: {
          context: 'Quan sát mô hình 3D và sự kiện vua Bảo Đại thoái vị tại Huế ngày 30/8/1945:',
          statements: [
            { id: 'a', text: 'Bảo Đại đọc Tuyên ngôn thoái vị với câu nói nổi tiếng: "Thà làm dân một nước tự do, hơn làm vua một nước nô lệ".', isTrue: true, explain: 'Lời tuyên bố thừa nhận quyền tự do độc lập của dân tộc trước hàng vạn đồng bào.' },
            { id: 'b', text: 'Bảo Đại trao lại quốc ấn bằng vàng và quốc kiếm nạm ngọc cho phái đoàn Chính phủ lâm thời.', isTrue: true, explain: 'Đoàn đại biểu do đồng chí Trần Huy Liệu dẫn đầu tiếp nhận biểu tượng quyền lực chuyển giao cho nhân dân.' },
            { id: 'c', text: 'Sau khi thoái vị, Bảo Đại lập tức thành lập chính phủ lưu vong tại nước ngoài để chống phá cách mạng.', isTrue: false, explain: 'Bảo Đại trở thành công dân Vĩnh Thụy và được Chủ tịch Hồ Chí Minh mời làm Cố vấn tối cao của Chính phủ.' },
            { id: 'd', text: 'Sự kiện thoái vị đánh dấu thắng lợi triệt để của CMT8 trên mặt trận lật đổ ách thống trị phong kiến nội xâm.', isTrue: true, explain: 'Đập tan chế độ quân chủ, thiết lập nền cộng hòa dân chủ.' }
          ]
        }
      },
      {
        order: 8,
        stationBadge: 'BÀI 6 · TRẠM 8',
        title: 'Bác Hồ đọc Tuyên ngôn Độc lập — Quảng trường Ba Đình (2/9/1945)',
        modelUrl: 'assets/models/tram8/bac_ho_tuyen_ngon.glb',
        poster: 'assets/images/bai6_chuan/b6_t8_tuyen_ngon_doc_lap.png',
        summary: 'Ngày 2/9/1945 tại Quảng trường Ba Đình, Chủ tịch Hồ Chí Minh đọc bản Tuyên ngôn Độc lập lịch sử, tuyên bố khai sinh nước Việt Nam Dân chủ Cộng hòa trước quốc dân và toàn thế giới.',
        mnemonic: 'Ba Đình nắng Ba Đình gió 2/9 - Bác Hồ đọc Tuyên ngôn - Nước VNDCCH ra đời.',
        keyPoints: [
          'Ngày 2/9/1945: Lễ Độc lập tổ chức trọng thể tại Quảng trường Ba Đình.',
          'Chủ tịch Hồ Chí Minh thay mặt Chính phủ lâm thời đọc Tuyên ngôn Độc lập.',
          'Nước Việt Nam Dân chủ Cộng hòa ra đời — Nhà nước dân chủ nhân dân đầu tiên ở Đông Nam Á.'
        ],
        typein: {
          prompt: 'Quan sát mô hình 3D Bác Hồ đọc Tuyên ngôn: Gõ ngày khai sinh nước Việt Nam Dân chủ Cộng hòa tại Quảng trường Ba Đình lịch sử:',
          target: '2/9/1945',
          accepted: ['2/9/1945', '02/09/1945', '2-9-1945', '2/9', '2 tháng 9 năm 1945'],
          hint: 'Ngày Quốc khánh mùng 2 tháng 9 năm 1945',
          explanation: 'Ngày 2/9/1945, Chủ tịch Hồ Chí Minh đọc bản Tuyên ngôn Độc lập lịch sử, khai sinh nước Việt Nam Dân chủ Cộng hòa.'
        },
        quiz: {
          question: 'Trong bản Tuyên ngôn Độc lập (2/9/1945), Chủ tịch Hồ Chí Minh đã mở đầu bằng việc trích dẫn những văn kiện bất hủ nào?',
          options: [
            'A. Tuyên ngôn Độc lập năm 1776 của nước Mỹ và Tuyên ngôn Nhân quyền & Dân quyền năm 1789 của nước Pháp',
            'B. Tuyên ngôn của Đảng Cộng sản (1848) và Luận cương Tháng Mười Nga (1917)',
            'C. Bản Yêu sách của nhân dân An Nam (1919) và Cương lĩnh chính trị đầu tiên (1930)',
            'D. Hiến chương Liên Hợp Quốc (1945) và Tuyên ngôn Quốc tế Nhân quyền (1948)'
          ],
          correct: 0,
          explanation: 'Người đã khéo léo trích dẫn hai bản tuyên ngôn của Mỹ và Pháp để khẳng định quyền tự nhiên thiêng liêng của mọi dân tộc trên thế giới.'
        },
        trueFalse: {
          context: 'Quan sát mô hình 3D Bác Hồ trên lễ đài Ba Đình và nội dung bản Tuyên ngôn Độc lập ngày 2/9/1945:',
          statements: [
            { id: 'a', text: 'Ngày 2/9/1945 trở thành ngày Quốc khánh của nước Cộng hòa Xã hội Chủ nghĩa Việt Nam.', isTrue: true, explain: 'Đây là ngày hội non sông, mốc son chói lọi mở ra kỷ nguyên mới.' },
            { id: 'b', text: 'Tuyên ngôn Độc lập khẳng định dân tộc Việt Nam có quyền hưởng tự do và độc lập, và sự thật đã thành một nước tự do độc lập.', isTrue: true, explain: 'Lời tuyên thệ đanh thép trước toàn thể nhân dân và thế giới.' },
            { id: 'c', text: 'Tuyên ngôn Độc lập thừa nhận quân đội Đồng minh có quyền bảo hộ đối với lãnh thổ Việt Nam sau chiến tranh.', isTrue: false, explain: 'Tuyên ngôn khẳng định nước ta độc lập hoàn toàn, kiên quyết bác bỏ mọi mưu toan tái chiếm của ngoại bang.' },
            { id: 'd', text: 'Toàn thể dân tộc Việt Nam quyết đem tất cả tinh thần và lực lượng, tính mạng và của cải để giữ vững quyền tự do, độc lập ấy.', isTrue: true, explain: 'Đây là lời thề độc lập kết thúc bản Tuyên ngôn lịch sử.' }
          ]
        }
      },
      {
        order: 9,
        stationBadge: 'BÀI 6 · TRẠM 9',
        title: 'Đài Thắng Lợi & Nguyên nhân, Ý nghĩa lịch sử CMT8',
        modelUrl: 'assets/models/tram9/lanh_dao_cua_dang.glb',
        poster: 'assets/images/bai6_chuan/b6_t9_y_nghia_lich_su.png',
        summary: 'Cách mạng Tháng Tám phá tan xiềng xích thực dân - phát xít, mở ra kỷ nguyên độc lập tự do. Nguyên nhân thắng lợi quyết định nhất là sự lãnh đạo đúng đắn, sáng tạo của Đảng Cộng sản Đông Dương.',
        mnemonic: 'Đảng dẫn đường - Dân đoàn kết - CMT8 thành công - Kỷ nguyên độc lập bừng sáng.',
        keyPoints: [
          'Đập tan ách thống trị thực dân phát xít kéo dài hơn 80 năm.',
          'Mở ra kỷ nguyên độc lập, tự do và nhân dân lao động làm chủ vận mệnh.',
          'Nguyên nhân quyết định hàng đầu: Sự lãnh đạo sáng suốt của Đảng và Bác Hồ.'
        ],
        typein: {
          prompt: 'Quan sát mô hình 3D Sự lãnh đạo của Đảng: Gõ nhân tố chủ quan hàng đầu quyết định thắng lợi Cách mạng Tháng Tám năm 1945:',
          target: 'Sự lãnh đạo của Đảng',
          accepted: ['Sự lãnh đạo của Đảng', 'Su lanh dao cua Dang', 'Đảng lãnh đạo', 'Dang lanh dao', 'Sự lãnh đạo đúng đắn của Đảng'],
          hint: 'Bắt đầu bằng cụm từ: "Sự lãnh đạo của..."',
          explanation: 'Sự lãnh đạo đúng đắn, sáng tạo của Đảng Cộng sản Đông Dương đứng đầu là Chủ tịch Hồ Chí Minh là nhân tố chủ quan quyết định nhất thắng lợi Cách mạng Tháng Tám.'
        },
        quiz: {
          question: 'Cách mạng Tháng Tám năm 1945 đã mở ra bước ngoặt vĩ đại nào trong lịch sử dân tộc Việt Nam?',
          options: [
            'A. Mở ra kỷ nguyên độc lập, tự do và nhân dân lao động làm chủ đất nước',
            'B. Mở đầu cho cuộc đấu tranh vũ trang đánh bại chủ nghĩa đế quốc phương Tây',
            'C. Hoàn thành trọn vẹn mục tiêu cách mạng XHCN trên cả hai miền đất nước',
            'D. Chuyển giao hoàn toàn nền kinh tế Việt Nam sang cơ chế thị trường mở cửa'
          ],
          correct: 0,
          explanation: 'CMT8 đưa dân tộc ta bước vào kỷ nguyên độc lập, tự do, đưa người dân từ thân phận nô lệ trở thành người làm chủ đất nước.'
        },
        trueFalse: {
          context: 'Quan sát mô hình 3D và kiến thức lịch sử về ý nghĩa cùng nguyên nhân thắng lợi của Cách mạng Tháng Tám năm 1945:',
          statements: [
            { id: 'a', text: 'CMT8 là thắng lợi đầu tiên của một dân tộc thuộc địa tự giải phóng khỏi ách thống trị của chủ nghĩa thực dân phương Tây.', isTrue: true, explain: 'Thắng lợi cổ vũ mạnh mẽ phong trào giải phóng dân tộc trên thế giới.' },
            { id: 'b', text: 'Khối liên minh công - nông vững chắc dưới sự lãnh đạo của Đảng là nền tảng sức mạnh to lớn của cách mạng.', isTrue: true, explain: 'Đoàn kết toàn dân trong Mặt trận Việt Minh là bài học kinh nghiệm then chốt.' },
            { id: 'c', text: 'Thắng lợi CMT8 hoàn toàn là do sự trùng hợp ngẫu nhiên của các yếu tố quốc tế thuận lợi, không cần đến sự chuẩn bị bên trong.', isTrue: false, explain: 'Thời cơ quốc tế chỉ phát huy tác dụng khi ta có 15 năm chuẩn bị chu đáo về đường lối, lực lượng và căn cứ địa.' },
            { id: 'd', text: 'CMT8 để lại bài học kinh nghiệm sâu sắc về chớp thời cơ và kết hợp đấu tranh chính trị với đấu tranh vũ trang.', isTrue: true, explain: 'Nghệ thuật chớp thời cơ ngàn năm có một là đỉnh cao nghệ thuật chỉ đạo của Đảng ta.' }
          ]
        }
      }
    ],

    // BÀI 7: KHÁNG CHIẾN CHỐNG PHÁP (1945 - 1954)
    bai_7: [
      {
        order: 1,
        stationBadge: 'BÀI 7 · TRẠM 1',
        title: 'Tình thế hiểm nghèo: Ngàn cân treo sợi tóc & Thù trong giặc ngoài',
        modelUrl: 'assets/models/bai7/tram1/3ooong.glb',
        poster: 'assets/images/bai7/tram1.jpg',
        summary: 'Sau Cách mạng Tháng Tám 1945, nước Việt Nam Dân chủ Cộng hòa đứng trước muôn vàn khó khăn: giặc đói, giặc dốt và thù trong giặc ngoài (quân Tưởng, quân Anh, thực dân Pháp).',
        mnemonic: 'Ngàn cân treo sợi tóc: Giặc đói - Giặc dốt - Giặc ngoại xâm bủa vây.',
        keyPoints: [
          'Miền Bắc: 20 vạn quân Tưởng Giới Thạch và tay sai kéo vào.',
          'Miền Nam: Quân Anh mở đường cho thực dân Pháp tái chiếm.',
          'Hơn 2 triệu người chết đói cuối 1944 đầu 1945, hơn 90% dân số mù chữ.'
        ],
        typein: {
          prompt: 'Quan sát mô hình 3D Ba thế lực thù trong giặc ngoài: Sau CMT8 1945, nhân dân ta lần đầu tiên giành được quyền gì khiến họ kiên quyết bảo vệ chính quyền non trẻ?',
          target: 'Quyền làm chủ',
          accepted: ['Quyền làm chủ', 'quyen lam chu', 'quyền làm chủ', 'làm chủ', 'lam chu'],
          hint: 'Quyền tự mình quyết định vận mệnh đất nước: "Quyền làm..."',
          explanation: 'Lần đầu tiên nhân dân ta giành được quyền làm chủ đất nước, thoát khỏi kiếp nô lệ lầm than nên kiên quyết đồng lòng bảo vệ chính quyền cách mạng.'
        },
        quiz: {
          question: 'Biện pháp cấp bách hàng đầu được Chính phủ lâm thời phát động nhằm giải quyết nạn đói năm 1945 là:',
          options: [
            'A. Quyên góp gạo cứu đói (Hũ gạo cứu đói, Ngày đồng tâm) và đẩy mạnh tăng gia sản xuất',
            'B. Vay vốn khẩn cấp từ các nước xã hội chủ nghĩa Đông Âu',
            'C. Thu hồi toàn bộ thóc gạo của thương nhân người Hoa ở miền Nam',
            'D. Nhập khẩu lương thực quy mô lớn từ các nước phương Tây'
          ],
          correct: 0,
          explanation: 'Chủ tịch Hồ Chí Minh đã phát động "Hũ gạo cứu đói", "Ngày đồng tâm" và khẩu hiệu "Tăng gia sản xuất! Tăng gia sản xuất ngay! Tăng gia sản xuất nữa!".'
        },
        trueFalse: {
          context: 'Quan sát mô hình 3D và tình hình nước Việt Nam non trẻ sau CMT8 năm 1945:',
          statements: [
            { id: 'a', text: 'Tình thế nước ta sau ngày 2/9/1945 được ví như "ngàn cân treo sợi tóc" trước họa thù trong giặc ngoài.', isTrue: true, explain: 'Ngoại xâm bao vây, kinh tế kiệt quệ, ngân sách trống rỗng.' },
            { id: 'b', text: 'Hơn 90% dân số nước ta bị mù chữ là hậu quả của chính sách ngu dân do thực dân Pháp thi hành.', isTrue: true, explain: 'Phong trào Bình dân học vụ lập tức được phát động để diệt giặc dốt.' },
            { id: 'c', text: 'Quân đội Tưởng Giới Thạch vào miền Bắc với danh nghĩa tước vũ khí quân Nhật nhưng âm mưu lật đổ chính quyền cách mạng.', isTrue: true, explain: 'Chúng dựng lên các tổ chức phản động Việt Quốc, Việt Cách để quấy phá.' },
            { id: 'd', text: 'Đảng ta chủ trương phát động chiến tranh tổng lực ngay lập tức với cả quân Tưởng và quân Pháp vào tháng 9/1945.', isTrue: false, explain: 'Ta thực hiện sách lược mềm dẻo, phân hóa kẻ thù: hòa Tưởng đánh Pháp ở miền Nam, sau đó hòa hoãn với Pháp để đuổi Tưởng.' }
          ]
        }
      },
      {
        order: 2,
        stationBadge: 'BÀI 7 · TRẠM 2',
        title: 'Nhân dân Nam Bộ anh dũng kháng chiến (23/9/1945)',
        modelUrl: 'assets/models/bai7/tram2/mit_tinh_saigon_phap_danh.glb',
        poster: 'assets/images/bai7/tram2.jpg',
        summary: 'Đêm 22 rạng sáng 23/9/1945, thực dân Pháp nổ súng đánh chiếm Sài Gòn, mở đầu cuộc chiến tranh xâm lược nước ta lần thứ hai. Nhân dân Nam Bộ nhất tề đứng lên kháng chiến.',
        mnemonic: 'Nam Bộ thành đồng Tổ quốc 23/9 - Tiếng súng Sài Gòn - Quyết tử giữ vững miền Nam.',
        keyPoints: [
          'Ngày 23/9/1945: Thực dân Pháp nổ súng gây hấn đánh chiếm Sài Gòn.',
          'Ủy ban Kháng chiến Nam Bộ ra lệnh tổng đình công, bất hợp tác.',
          'Hàng vạn thanh niên miền Bắc, miền Trung gia nhập đoàn quân "Nam tiến".'
        ],
        typein: {
          prompt: 'Quan sát mô hình 3D Mít tinh kháng chiến Sài Gòn: Gõ tên phong trào thanh niên miền Bắc, miền Trung xung phong lên đường chi viện cho chiến trường Nam Bộ năm 1945:',
          target: 'Nam tiến',
          accepted: ['Nam tiến', 'Nam tien', 'nam tien', 'Đoàn quân Nam tiến', 'Phong trào Nam tiến'],
          hint: 'Đoàn quân tình nguyện tiến về phương Nam: "Nam..."',
          explanation: 'Hàng vạn đoàn quân "Nam tiến" đã hừng hực khí thế lên đường vào Nam chi viện sức người, sức của cho đồng bào đánh giặc.'
        },
        quiz: {
          question: 'Ngày 23/9/1945 đi vào lịch sử dân tộc với sự kiện quan trọng nào dưới đây?',
          options: [
            'A. Ngày Nam Bộ kháng chiến, mở đầu cuộc kháng chiến chống thực dân Pháp xâm lược lần thứ hai',
            'B. Ngày ký kết Hiệp định Sơ bộ giữa đại diện Việt Nam và đại diện Pháp',
            'C. Ngày Bác Hồ ra Lời kêu gọi Toàn quốc kháng chiến tại Vạn Phúc (Hà Đông)',
            'D. Ngày Chủ tịch Hồ Chí Minh lên đường sang thăm nước Pháp với tư cách thượng khách'
          ],
          correct: 0,
          explanation: 'Đêm 22 rạng sáng 23/9/1945, thực dân Pháp nổ súng ở Sài Gòn, nhân dân Nam Bộ anh dũng đứng lên mở đầu cuộc kháng chiến bảo vệ độc lập.'
        },
        trueFalse: {
          context: 'Quan sát mô hình 3D và sự kiện nhân dân Nam Bộ đứng lên kháng chiến chống Pháp tháng 9/1945:',
          statements: [
            { id: 'a', text: 'Quân đội Anh đã che chở, hỗ trợ vũ khí cho thực dân Pháp nổ súng tái chiếm Sài Gòn ngày 23/9/1945.', isTrue: true, explain: 'Quân Anh lợi dụng danh nghĩa Đồng minh để giúp Pháp quay lại xâm lược Đông Dương.' },
            { id: 'b', text: 'Ủy ban Kháng chiến Nam Bộ đã kêu gọi triệt để tổng đình công, không hợp tác với thực dân Pháp.', isTrue: true, explain: 'Nhân dân dựng chiến lũy, phong tỏa đường sá, thiêu hủy các kho tàng của giặc.' },
            { id: 'c', text: 'Chính phủ Trung ương đã chủ trương bỏ rơi Nam Bộ để dồn toàn lực bảo vệ Thủ đô Hà Nội.', isTrue: false, explain: 'Đảng và Bác Hồ luôn khẳng định "Nam Bộ là máu của máu Việt Nam, thịt của thịt Việt Nam", toàn quốc chi viện cho Nam Bộ.' },
            { id: 'd', text: 'Danh hiệu "Thành đồng Tổ quốc" được Bác Hồ và Chính phủ trao tặng cho đồng bào Nam Bộ anh dũng.', isTrue: true, explain: 'Tôn vinh tinh thần kiên cường đi trước về sau của quân dân miền Nam.' }
          ]
        }
      },
      {
        order: 3,
        stationBadge: 'BÀI 7 · TRẠM 3',
        title: 'Sách lược hòa hoãn: Hiệp định Sơ bộ & Tạm ước 1946',
        modelUrl: 'assets/models/bai7/tram3/bac_ho_ki_cam_ket.glb',
        poster: 'assets/images/bai7/tram3.jpg',
        summary: 'Trước nguy cơ đụng độ cùng lúc nhiều kẻ thù, Đảng và Bác Hồ thực hiện sách lược "hòa để tiến": ký Hiệp định Sơ bộ (6/3/1946) và Tạm ước (14/9/1946), đuổi 20 vạn quân Tưởng về nước.',
        mnemonic: 'Hòa hoãn phân hóa kẻ thù - 6/3 Sơ bộ - Đuổi Tưởng về nước - Thêm thời gian chuẩn bị.',
        keyPoints: [
          'Ngày 6/3/1946: Ký Hiệp định Sơ bộ với đại diện Pháp (Sainteny).',
          'Đuổi 20 vạn quân Tưởng ra khỏi miền Bắc không tốn một viên đạn.',
          'Ngày 14/9/1946: Ký Tạm ước tại Paris để kéo dài thời gian hòa bình chuẩn bị kháng chiến.'
        ],
        typein: {
          prompt: 'Quan sát mô hình 3D Bác Hồ ký cam kết hòa hoãn: Gõ ngày, tháng, năm ký kết bản Hiệp định Sơ bộ lịch sử giữa Việt Nam và Pháp:',
          target: '6/3/1946',
          accepted: ['6/3/1946', '06/03/1946', '6-3-1946', '6/3', '6 tháng 3 năm 1946'],
          hint: 'Ngày mùng 6 tháng 3 năm 1946 tại Hà Nội',
          explanation: 'Ngày 6/3/1946, Chủ tịch Hồ Chí Minh thay mặt Chính phủ ký bản Hiệp định Sơ bộ với đại diện chính phủ Pháp.'
        },
        quiz: {
          question: 'Mục đích lớn nhất của Đảng và Chủ tịch Hồ Chí Minh khi chủ động ký bản Hiệp định Sơ bộ (6/3/1946) với Pháp là:',
          options: [
            'A. Đuổi 20 vạn quân Tưởng về nước và tranh thủ thời gian hòa hoãn quý báu để chuẩn bị lực lượng kháng chiến lâu dài',
            'B. Chấp nhận để thực dân Pháp tiếp tục cai trị toàn bộ ba nước Đông Dương',
            'C. Từ bỏ hoàn toàn mục tiêu độc lập dân tộc để xây dựng liên bang Pháp',
            'D. Nhờ quân đội Pháp tước vũ khí và tiêu diệt lực lượng phản động trong nước'
          ],
          correct: 0,
          explanation: 'Ký Hiệp định Sơ bộ là nước cờ ngoại giao tài tình, tránh đối đầu cùng lúc với nhiều kẻ thù, đuổi quân Tưởng về nước và chuẩn bị lực lượng cho cuộc chiến không thể tránh khỏi.'
        },
        trueFalse: {
          context: 'Quan sát mô hình 3D và sách lược ngoại giao tài tình của nước ta trong năm 1946:',
          statements: [
            { id: 'a', text: 'Hiệp ước Hoa - Pháp (28/2/1946) đã đặt cách mạng nước ta trước nguy cơ phải đối đầu cùng lúc cả quân Tưởng và quân Pháp.', isTrue: true, explain: 'Pháp và Tưởng câu kết đổi chác quyền lợi nhằm chèn ép Việt Nam.' },
            { id: 'b', text: 'Trong Hiệp định Sơ bộ 6/3/1946, chính phủ Pháp công nhận nước Việt Nam là một quốc gia tự do có chính phủ, nghị viện, quân đội và tài chính riêng.', isTrue: true, explain: 'Thắng lợi ngoại giao bước đầu vô cùng to lớn của nền cộng hòa non trẻ.' },
            { id: 'c', text: 'Bản Tạm ước ngày 14/9/1946 được Bác Hồ ký với Pháp khi quân Pháp đã đơn phương chiếm đóng toàn bộ Hà Nội.', isTrue: false, explain: 'Tạm ước ký tại Paris nhằm cứu vãn hòa bình và kéo dài thời gian chuẩn bị cho cả nước.' },
            { id: 'd', text: 'Sách lược "hòa để tiến" đã bảo toàn được chính quyền cách mạng và thống nhất lực lượng vũ trang.', isTrue: true, explain: 'Sách lược thể hiện bản lĩnh kiên định về nguyên tắc, mềm dẻo về sách lược.' }
          ]
        }
      },
      {
        order: 4,
        stationBadge: 'BÀI 7 · TRẠM 4',
        title: 'Toàn quốc kháng chiến & 60 ngày đêm giam chân địch',
        modelUrl: 'assets/models/bai7/tram4/chien_si_chien_dau.glb',
        poster: 'assets/images/bai7/tram4.jpg',
        summary: 'Đêm 19/12/1946, Chủ tịch Hồ Chí Minh ra Lời kêu gọi Toàn quốc kháng chiến: "Chúng ta thà hy sinh tất cả, chứ nhất định không chịu mất nước, nhất định không chịu làm nô lệ!". Quân dân Hà Nội chiến đấu 60 ngày đêm giam chân địch.',
        mnemonic: '19/12 Đêm bùng cháy - Quyết tử để Tổ quốc quyết sinh - 60 ngày đêm giam chân Pháp.',
        keyPoints: [
          'Đêm 19/12/1946: Tiếng súng tại Pháo đài Láng phát lệnh Toàn quốc kháng chiến.',
          'Trung đoàn Thủ đô chiến đấu kiên cường giam chân địch suốt 60 ngày đêm.',
          'Bảo vệ an toàn cơ quan đầu não của Đảng và Chính phủ rút lên chiến khu an toàn.'
        ],
        typein: {
          prompt: 'Quan sát mô hình 3D Chiến sĩ quyết tử: Gõ ngày Chủ tịch Hồ Chí Minh ra Lời kêu gọi Toàn quốc kháng chiến lịch sử:',
          target: '19/12/1946',
          accepted: ['19/12/1946', '19-12-1946', '19/12', '19 tháng 12 năm 1946', '19/12/46'],
          hint: 'Ngày 19 tháng 12 năm 1946',
          explanation: 'Đêm 19/12/1946, Chủ tịch Hồ Chí Minh phát động Toàn quốc kháng chiến, mở đầu 9 năm trường kỳ kháng chiến chống thực dân Pháp.'
        },
        quiz: {
          question: 'Khẩu hiệu thiêng liêng thể hiện tinh thần sẵn sàng hy sinh của Trung đoàn Thủ đô trong 60 ngày đêm giam chân địch tại Hà Nội là:',
          options: [
            'A. "Quyết tử để Tổ quốc quyết sinh"',
            'B. "Nhằm thẳng quân thù mà bắn"',
            'C. "Thần tốc, thần tốc hơn nữa, táo bạo hơn nữa"',
            'D. "Đánh chắc, tiến chắc, chắc thắng mới đánh"'
          ],
          correct: 0,
          explanation: 'Bác Hồ đã gửi thư khen ngợi các chiến sĩ cảm tử quân Thủ đô với lời ngợi ca bất hủ: "Các em quyết tử để Tổ quốc quyết sinh".'
        },
        trueFalse: {
          context: 'Quan sát mô hình 3D và cuộc chiến đấu mở màn kháng chiến toàn quốc tại Hà Nội mùa đông năm 1946:',
          statements: [
            { id: 'a', text: 'Ngày 18/12/1946, thực dân Pháp gửi tối hậu thư đòi tước vũ khí của Tự vệ Hà Nội và đòi quyền kiểm soát Thủ đô.', isTrue: true, explain: 'Hành động khiêu khích trắng trợn buộc ta phải đứng lên tự vệ.' },
            { id: 'b', text: 'Lời kêu gọi Toàn quốc kháng chiến của Chủ tịch Hồ Chí Minh khẳng định tinh thần: "Chúng ta muốn hòa bình, chúng ta phải nhân nhượng. Nhưng chúng ta càng nhân nhượng, thực dân Pháp càng lấn tới...".', isTrue: true, explain: 'Bản hiệu triệu nung nấu ý chí tự do độc lập của muôn triệu con người.' },
            { id: 'c', text: 'Mục đích chiến đấu 60 ngày đêm của quân dân Hà Nội là tiêu diệt gọn toàn bộ tập đoàn quân chủ lực của Pháp.', isTrue: false, explain: 'Mục đích chính là giam chân địch trong đô thị để cơ quan đầu não và đồng bào tản cư lên chiến khu an toàn.' },
            { id: 'd', text: 'Đêm 17/2/1947, Trung đoàn Thủ đô đã hoàn thành xuất sắc nhiệm vụ và bí mật rút quân an toàn qua gầm cầu Long Biên vượt sông Hồng.', isTrue: true, explain: 'Bảo toàn lực lượng chiến đấu lâu dài theo đường lối trường kỳ kháng chiến.' }
          ]
        }
      },
      {
        order: 5,
        stationBadge: 'BÀI 7 · TRẠM 5',
        title: 'Chiến dịch Việt Bắc Thu - Đông 1947 — Bẻ gãy gọng kìm giặc',
        modelUrl: 'assets/models/bai7/tram5/tap_luyen_chien_dich_vbtd.glb',
        poster: 'assets/images/bai7/tram5.jpg',
        summary: 'Thu - Đông 1947, Pháp mở cuộc hành quân rầm rộ lên Việt Bắc hòng chụp bắt cơ quan đầu não và tiêu diệt chủ lực ta. Ta bẻ gãy 2 gọng kìm sông Lô và đường số 4, bảo vệ vững chắc căn cứ địa.',
        mnemonic: 'Việt Bắc Thu - Đông 1947: Đánh tan hai gọng kìm - Phá sản chiến lược đánh nhanh thắng nhanh.',
        keyPoints: [
          'Thu - Đông 1947: Thực dân Pháp mở cuộc hành quân lên căn cứ địa Việt Bắc.',
          'Quân dân ta phục kích giáng đòn sấm sét trên sông Lô, Đoan Hùng và đường số 4.',
          'Làm phá sản hoàn toàn chiến lược "đánh nhanh, thắng nhanh" của thực dân Pháp.'
        ],
        typein: {
          prompt: 'Quan sát mô hình 3D Luyện tập chiến dịch Việt Bắc: Thắng lợi của Chiến dịch Việt Bắc Thu - Đông 1947 đã làm phá sản hoàn toàn chiến lược nào của Pháp?',
          target: 'Đánh nhanh thắng nhanh',
          accepted: ['Đánh nhanh thắng nhanh', 'danh nhanh thang nhanh', 'Đánh nhanh, thắng nhanh', 'chien luoc danh nhanh thang nhanh'],
          hint: 'Chiến lược quân sự muốn kết thúc chiến tranh trong chớp nhoáng: "Đánh nhanh..."',
          explanation: 'Chiến dịch Việt Bắc Thu - Đông 1947 đã bẻ gãy hai gọng kìm của địch, đập tan hoàn toàn chiến lược "đánh nhanh, thắng nhanh", buộc Pháp phải chuyển sang đánh lâu dài.'
        },
        quiz: {
          question: 'Ý nghĩa chiến lược quan trọng nhất của chiến thắng Việt Bắc Thu - Đông năm 1947 là gì?',
          options: [
            'A. Phá sản hoàn toàn chiến lược "đánh nhanh, thắng nhanh" của thực dân Pháp, buộc địch phải chuyển sang đánh lâu dài',
            'B. Giành lại hoàn toàn quyền chủ động chiến lược trên chiến trường chính Bắc Bộ',
            'C. Buộc chính phủ Pháp phải ký kết Hiệp định Giơ-ne-vơ lập lại hòa bình',
            'D. Khai thông hoàn toàn tuyến biên giới Việt - Trung để nhận viện trợ quốc tế'
          ],
          correct: 0,
          explanation: 'Thắng lợi Việt Bắc đã bảo vệ vững chắc căn cứ địa cách mạng và cơ quan đầu não, làm sụp đổ hoàn toàn mưu toan đánh nhanh thắng nhanh của thực dân Pháp.'
        },
        trueFalse: {
          context: 'Quan sát mô hình 3D và diễn biến Chiến dịch Việt Bắc Thu - Đông năm 1947:',
          statements: [
            { id: 'a', text: 'Kế hoạch tiến công của Pháp hình thành hai gọng kìm: gọng kìm phía Đông (đường bộ số 4) và gọng kìm phía Tây (đường thủy sông Lô).', isTrue: true, explain: 'Pháp mưu toan khép chặt hai gọng kìm tại Đài Thị (Tuyên Quang).' },
            { id: 'b', text: 'Trận chiến thắng vang dội trên sông Lô và Đoan Hùng đã bắn chìm nhiều tàu chiến và ca nô của địch.', isTrue: true, explain: 'Bẻ gãy hoàn toàn gọng kìm phía Tây của thực dân Pháp.' },
            { id: 'c', text: 'Sau chiến dịch Việt Bắc 1947, thực dân Pháp đã quyết định rút toàn bộ quân đội về nước chấm dứt chiến tranh.', isTrue: false, explain: 'Pháp chuyển sang âm mưu "dùng người Việt đánh người Việt, lấy chiến tranh nuôi chiến tranh".' },
            { id: 'd', text: 'Chiến dịch Việt Bắc Thu - Đông 1947 là chiến dịch phản công lớn đầu tiên của quân đội ta trong kháng chiến chống Pháp.', isTrue: true, explain: 'Đánh dấu bước trưởng thành vượt bậc về nghệ thuật quân sự của Quân đội nhân dân Việt Nam.' }
          ]
        }
      },
      {
        order: 6,
        stationBadge: 'BÀI 7 · TRẠM 6',
        title: 'Chiến dịch Biên giới Thu - Đông 1950 — Giành thế chủ động',
        modelUrl: 'assets/models/bai7/tram6/bac_ho_chi_dao_bien_gioi.glb',
        poster: 'assets/images/bai7/tram6.jpg',
        summary: 'Thu - Đông 1950, ta chủ động mở chiến dịch Biên giới. Bác Hồ trực tiếp ra mặt trận quan sát chỉ đạo. Tiêu diệt cụm cứ điểm Đông Khê, giải phóng dải biên giới, giành thế chủ động chiến lược.',
        mnemonic: 'Biên giới 1950: Bác Hồ trên đỉnh núi - Khai thông biên giới - Giành thế chủ động.',
        keyPoints: [
          'Chiến dịch tiến công quy mô lớn đầu tiên do bộ đội chủ lực ta chủ động mở.',
          'Chủ tịch Hồ Chí Minh trực tiếp lên đài quan sát chỉ đạo trận đánh.',
          'Tiêu diệt Đông Khê, giải phóng 750km biên giới Việt - Trung với 35 vạn dân.'
        ],
        typein: {
          prompt: 'Quan sát mô hình 3D Bác Hồ chỉ đạo mặt trận Biên giới: Chiến dịch Biên giới Thu - Đông 1950 mở đầu bằng trận tiến công tiêu diệt cụm cứ điểm then chốt nào?',
          target: 'Đông Khê',
          accepted: ['Đông Khê', 'Dong Khe', 'đông khê', 'dong khe', 'cứ điểm Đông Khê'],
          hint: 'Cụm cứ điểm nằm giữa Cao Bằng và Thất Khê trên đường số 4: "Đông..."',
          explanation: 'Trận đánh tiêu diệt cứ điểm Đông Khê (18/9/1950) đã cô lập hoàn toàn quân Pháp ở Cao Bằng, mở toang mắt xích chiến lược then chốt.'
        },
        quiz: {
          question: 'Chiến dịch Biên giới Thu - Đông năm 1950 có sự thay đổi mang tính bước ngoặt nào trong cuộc kháng chiến chống Pháp?',
          options: [
            'A. Ta giành lại quyền chủ động chiến lược trên chiến trường chính Bắc Bộ, mở ra giai đoạn tiến công và phản công',
            'B. Buộc thực dân Pháp phải ký hiệp định rút quân khỏi miền Bắc',
            'C. Tiêu diệt hoàn toàn pháo đài bất khả xâm phạm Điện Biên Phủ',
            'D. Lần đầu tiên ta sử dụng xe tăng và máy bay chiến đấu trên chiến trường'
          ],
          correct: 0,
          explanation: 'Chiến dịch Biên giới 1950 đánh dấu bước ngoặt ta chuyển từ thế giữ gìn lực lượng sang thế chủ động tiến công và phản công trên chiến trường chính.'
        },
        trueFalse: {
          context: 'Quan sát mô hình 3D Bác Hồ tại mặt trận Biên giới Thu - Đông 1950:',
          statements: [
            { id: 'a', text: 'Đây là chiến dịch duy nhất trong cuộc đời cách mạng mà Chủ tịch Hồ Chí Minh trực tiếp ra mặt trận chỉ đạo chiến đấu.', isTrue: true, explain: 'Bức ảnh Bác Hồ chống gậy trên đỉnh núi Đông Khê là biểu tượng bất hủ.' },
            { id: 'b', text: 'Mục đích chiến dịch là tiêu diệt một bộ phận quan trọng sinh lực địch, khai thông biên giới Việt - Trung và mở rộng căn cứ địa Việt Bắc.', isTrue: true, explain: 'Cả 3 mục tiêu chiến lược đề ra đều hoàn thành xuất sắc.' },
            { id: 'c', text: 'Anh hùng La Văn Cầu đã nhờ đồng đội chặt cánh tay bị thương để tiếp tục ôm bộc phá phá lô cốt giặc trong chiến dịch này.', isTrue: true, explain: 'Tấm gương anh dũng sáng ngời của người chiến sĩ Quân đội nhân dân Việt Nam.' },
            { id: 'd', text: 'Sau chiến dịch Biên giới 1950, căn cứ địa cách mạng của ta hoàn toàn bị cô lập khỏi các nước XHCN.', isTrue: false, explain: 'Đường biên giới dài 750km được khai thông, mở đường đón nhận viện trợ to lớn từ Trung Quốc và Liên Xô.' }
          ]
        }
      },
      {
        order: 7,
        stationBadge: 'BÀI 7 · TRẠM 7',
        title: 'Đoàn xe đạp thồ tiếp tế & Sức mạnh hậu phương',
        modelUrl: 'assets/models/bai7/tram7/xe_dap_tho.glb',
        poster: 'assets/images/bai7/tram7.jpg',
        summary: 'Xe đạp thồ trở thành "vũ khí vận tải thần kỳ" vượt hàng trăm cây số đèo dốc hiểm trở tiếp tế hàng ngàn tấn gạo, đạn dược ra mặt trận Điện Biên Phủ, minh chứng cho sức mạnh toàn dân đánh giặc.',
        mnemonic: 'Xe đạp thồ Điện Biên - Đôi chân trần chí thép - Vượt dốc Pha Đin chi viện hỏa tuyến.',
        keyPoints: [
          'Hơn 20.000 chiếc xe đạp thồ được cải tiến thành phương tiện vận tải cơ động.',
          'Kỷ lục vận chuyển: Kiện tướng xe thồ Ma Văn Thắng chở tới 352 kg gạo/chuyến.',
          'Cung cấp đầy đủ hậu cần cho chiến dịch dài ngày trên địa hình hiểm trở.'
        ],
        typein: {
          prompt: 'Quan sát mô hình 3D Xe đạp thồ: Chiến sĩ dân công hỏa tuyến lập kỷ lục thồ chuyến hàng nặng nhất (352 kg gạo) phục vụ Điện Biên Phủ tên là gì?',
          target: 'Ma Văn Thắng',
          accepted: ['Ma Văn Thắng', 'Ma Van Thang', 'ma van thang'],
          hint: 'Chiến sĩ dân công họ Ma, quê ở Phú Thọ: "Ma Văn..."',
          explanation: 'Kiện tướng xe đạp thồ Ma Văn Thắng (quê Phú Thọ) đã đạt kỷ lục thồ tới 352 kg hàng/chuyến tiếp tế mặt trận Điện Biên Phủ.'
        },
        quiz: {
          question: 'Phương tiện vận tải thô sơ nào được coi là "binh chủng vận tải đặc biệt" góp công quyết định bảo đảm hậu cần cho Chiến dịch Điện Biên Phủ?',
          options: [
            'A. Xe đạp thồ',
            'B. Ngựa thồ vùng cao',
            'C. Xe bò bánh gỗ',
            'D. Thuyền độc mộc trên sông Nậm Rốm'
          ],
          correct: 0,
          explanation: 'Hơn 2 vạn chiếc xe đạp thồ đã vượt dốc Pha Đin, đèo Lũng Lô đưa hàng vạn tấn lương thực đạn dược lên lòng chảo Điện Biên.'
        },
        trueFalse: {
          context: 'Quan sát mô hình 3D Xe đạp thồ và công tác hậu cần trong chiến dịch Điện Biên Phủ năm 1954:',
          statements: [
            { id: 'a', text: 'Quân đội Pháp hoàn toàn bất ngờ trước năng lực tiếp tế phi thường bằng xe đạp thồ của nhân dân ta.', isTrue: true, explain: 'Tướng Nava tính toán ta không thể tiếp tế lương thực quá 3 tuần trên chiến trường Điện Biên.' },
            { id: 'b', text: 'Những chiếc xe đạp thồ được người dân gia cố thêm tay ngai bằng tre và thanh sắt để chịu tải trọng gấp nhiều lần.', isTrue: true, explain: 'Sáng kiến cải tiến kỹ thuật thông minh của dân công hỏa tuyến.' },
            { id: 'c', text: 'Chỉ có thanh niên nam giới mới được huy động tham gia đoàn xe đạp thồ phục vụ chiến dịch.', isTrue: false, explain: 'Hàng vạn phụ nữ và đồng bào các dân tộc thiểu số đều hăng hái tham gia tiếp lương, tải đạn.' },
            { id: 'd', text: 'Khẩu hiệu nổi tiếng của hậu phương lúc này là: "Tất cả cho tiền tuyến, tất cả để chiến thắng".', isTrue: true, explain: 'Khí thế dốc toàn tâm toàn lực chi viện cho trận quyết chiến chiến lược.' }
          ]
        }
      },
      {
        order: 8,
        stationBadge: 'BÀI 7 · TRẠM 8',
        title: 'Tướng Đờ Cát & Kế hoạch Nava: "Pháo đài bất khả xâm phạm"',
        modelUrl: 'assets/models/bai7/tram8/tuong_do_cat.glb',
        poster: 'assets/images/bai7/tram8.jpg',
        summary: 'Tập đoàn cứ điểm Điện Biên Phủ gồm 49 cứ điểm, 3 phân khu kiên cố với sân bay Mường Thanh và hầm De Castries, được tướng lĩnh Pháp và Mỹ ca ngợi là "cối xay thịt", "pháo đài bất khả xâm phạm".',
        mnemonic: 'Điện Biên Phủ 49 cứ điểm - Kế hoạch Nava đầy tham vọng - Hầm ngầm Đờ Cát kiên cố.',
        keyPoints: [
          'Điện Biên Phủ được xây dựng thành tập đoàn cứ điểm mạnh nhất Đông Dương.',
          'Gồm 49 cứ điểm chia làm 3 phân khu: Bắc, Trung tâm và Nam (Hồng Cúm).',
          'Được giới quân sự Pháp và cố vấn Mỹ coi là "pháo đài bất khả xâm phạm".'
        ],
        typein: {
          prompt: 'Quan sát mô hình 3D Tướng Đờ Cát: Đại tướng Võ Nguyên Giáp đã quyết định chuyển phương châm tác chiến từ "Đánh nhanh, thắng nhanh" sang phương châm lịch sử nào?',
          target: 'Đánh chắc tiến chắc',
          accepted: ['Đánh chắc tiến chắc', 'Đánh chắc, tiến chắc', 'danh chac tien chac', 'chac thang moi danh'],
          hint: 'Phương châm 4 chữ mang tính sống còn đối với chiến dịch: "Đánh chắc..."',
          explanation: 'Quyết định chuyển sang "Đánh chắc, tiến chắc" của Đại tướng Tổng tư lệnh Võ Nguyên Giáp là quyết định khó khăn nhất nhưng sáng suốt nhất trong cuộc đời chỉ huy của ông.'
        },
        quiz: {
          question: 'Tập đoàn cứ điểm Điện Biên Phủ được thực dân Pháp bố trí thành bao nhiêu cụm cứ điểm và chia làm mấy phân khu?',
          options: [
            'A. Gồm 49 cứ điểm chia thành 3 phân khu (Bắc, Trung tâm và Nam)',
            'B. Gồm 21 cứ điểm chia thành 2 phân khu lớn',
            'C. Gồm 86 cứ điểm phân bố rải rác khắp thung lũng Mường Thanh',
            'D. Gồm 12 cứ điểm kiên cố tập trung quanh sở chỉ huy Đờ Cát'
          ],
          correct: 0,
          explanation: 'Tập đoàn cứ điểm Điện Biên Phủ gồm 49 cứ điểm tổ chức thành 8 cụm, chia làm 3 phân khu có hỏa lực pháo binh và không quân bảo vệ lẫn nhau.'
        },
        trueFalse: {
          context: 'Quan sát mô hình 3D Tướng Đờ Cát và tập đoàn cứ điểm Điện Biên Phủ năm 1954:',
          statements: [
            { id: 'a', text: 'Tướng De Castries (Đờ Cát) là chỉ huy trưởng toàn bộ tập đoàn cứ điểm Điện Biên Phủ.', isTrue: true, explain: 'Đại tá Đờ Cát được thăng hàm Thiếu tướng ngay giữa vòng vây chiến dịch.' },
            { id: 'b', text: 'Cố vấn quân sự Mỹ đã trực tiếp thị sát, viện trợ tới 73% chi phí chiến tranh cho Pháp thực hiện kế hoạch Nava.', isTrue: true, explain: 'Mỹ can thiệp sâu hòng biến Điện Biên Phủ thành căn cứ ngăn chặn chủ nghĩa cộng sản.' },
            { id: 'c', text: 'Đại tướng Võ Nguyên Giáp quyết định nổ súng đánh nhanh giải quyết chiến dịch chỉ trong 3 đêm 2 ngày.', isTrue: false, explain: 'Đại tướng đã quyết đoán hoãn nổ súng, kéo pháo ra và chuyển sang phương châm "Đánh chắc, tiến chắc".' },
            { id: 'd', text: 'Sân bay Mường Thanh và Hồng Cúm giữ vai trò là "dạ dày và buồng phổi" cung cấp tiếp tế duy nhất cho cứ điểm.', isTrue: true, explain: 'Khi ta đào chiến hào siết chặt và khống chế sân bay, quân Pháp rơi vào cảnh tuyệt vọng.' }
          ]
        }
      },
      {
        order: 9,
        stationBadge: 'BÀI 7 · TRẠM 9',
        title: 'Bắt sống Tướng Đờ Cát & Toàn thắng Điện Biên Phủ (7/5/1954)',
        modelUrl: 'assets/models/bai7/tram9/do_cat_bi_bat.glb',
        poster: 'assets/images/bai7/tram9.jpg',
        summary: '17h30 ngày 7/5/1954, lá cờ "Quyết chiến Quyết thắng" tung bay trên nóc hầm Đờ Cát. Toàn bộ bộ chỉ huy Pháp bị bắt sống. Điện Biên Phủ chấn động địa cầu, buộc Pháp ký Hiệp định Giơ-ne-vơ.',
        mnemonic: '7/5/1954 Cờ đỏ tung bay nóc hầm Đờ Cát - Lừng lẫy năm châu chấn động địa cầu.',
        keyPoints: [
          '56 ngày đêm khoét núi, ngủ hầm, mưa dầm, cơm vắt, máu trộn bùn non.',
          '17 giờ 30 phút ngày 7/5/1954: Bắt sống Tướng Đờ Cát và toàn bộ ban tham mưu.',
          'Ngày 21/7/1954: Hiệp định Giơ-ne-vơ ký kết, công nhận độc lập, chủ quyền của Việt Nam.'
        ],
        typein: {
          prompt: 'Quan sát mô hình 3D Bắt sống Tướng Đờ Cát: Gõ ngày, tháng, năm Chiến dịch lịch sử Điện Biên Phủ toàn thắng rực rỡ:',
          target: '7/5/1954',
          accepted: ['7/5/1954', '07/05/1954', '7-5-1954', '7/5', '7 tháng 5 năm 1954'],
          hint: 'Ngày mùng 7 tháng 5 năm 1954 (lúc 17 giờ 30 phút chiều)',
          explanation: 'Chiều ngày 7/5/1954, tập đoàn cứ điểm Điện Biên Phủ bị tiêu diệt hoàn toàn, kết thúc vẻ vang 9 năm trường kỳ kháng chiến chống Pháp.'
        },
        quiz: {
          question: 'Hiệp định Giơ-ne-vơ về chấm dứt chiến tranh, lập lại hòa bình ở Đông Dương được ký kết vào năm nào sau chiến thắng Điện Biên Phủ?',
          options: [
            'A. Năm 1954',
            'B. Năm 1946',
            'C. Năm 1950',
            'D. Năm 1973'
          ],
          correct: 0,
          explanation: 'Ngày 21/7/1954, Hiệp định Giơ-ne-vơ được ký kết, Pháp buộc phải công nhận độc lập, chủ quyền, thống nhất và toàn vẹn lãnh thổ của 3 nước Đông Dương.'
        },
        trueFalse: {
          context: 'Quan sát mô hình 3D Bắt sống tướng Đờ Cát và thắng lợi vĩ đại Điện Biên Phủ ngày 7/5/1954:',
          statements: [
            { id: 'a', text: 'Tổ xung kích do đồng chí Tạ Quốc Luật chỉ huy đã xông vào hầm ngầm bắt sống tướng De Castries cùng toàn bộ ban tham mưu giặc.', isTrue: true, explain: 'Khoảnh khắc lịch sử đánh dấu sự sụp đổ hoàn toàn của tập đoàn cứ điểm.' },
            { id: 'b', text: 'Chiến thắng Điện Biên Phủ đã đập tan hoàn toàn kế hoạch Nava và ý chí xâm lược của thực dân Pháp có Mỹ giúp sức.', isTrue: true, explain: 'Giáng đòn quyết định buộc Pháp phải ngồi vào bàn đàm phán ký Hiệp định Giơ-ne-vơ.' },
            { id: 'c', text: 'Hiệp định Giơ-ne-vơ 1954 quy định vĩ tuyến 17 là ranh giới quân sự tạm thời để tập kết chuyển quân, không phải biên giới quốc gia.', isTrue: true, explain: 'Hiệp định ghi rõ tổng tuyển cử thống nhất đất nước sẽ tiến hành vào tháng 7/1956.' },
            { id: 'd', text: 'Chiến dịch Điện Biên Phủ là thắng lợi thuần túy trên mặt trận ngoại giao, quân ta không phải chịu thương vong nào.', isTrue: false, explain: 'Là thành quả 56 ngày đêm chiến đấu kiên cường với bao xương máu của các anh hùng Phan Đình Giót, Tô Vĩnh Diện, Bế Văn Đàn...' }
          ]
        }
      }
    ],

    // BÀI 8: KHÁNG CHIẾN CHỐNG MỸ (1954 - 1975)
    bai_8: [
      {
        order: 1,
        stationBadge: 'BÀI 8 · TRẠM 1',
        title: 'Xây dựng CNXH ở miền Bắc & Đấu tranh chính trị miền Nam',
        modelUrl: 'assets/models/bai8/tram1/xay_dung_xa_hoi_chu_nghia.glb',
        poster: 'assets/images/bai8/tram1.jpg',
        summary: 'Sau Hiệp định Giơ-ne-vơ 1954, đất nước tạm thời bị chia cắt làm hai miền. Miền Bắc tiến lên xây dựng CNXH là hậu phương lớn; miền Nam tiếp tục cách mạng dân tộc dân chủ nhân dân chống Mỹ - Diệm.',
        mnemonic: 'Đất nước hai miền - Hai nhiệm vụ chiến lược - Miền Bắc hậu phương lớn, miền Nam tiền tuyến lớn.',
        keyPoints: [
          'Đặc điểm lớn nhất: Một Đảng lãnh đạo đồng thời 2 chiến lược cách mạng ở 2 miền.',
          'Miền Bắc: Hậu phương lớn giữ vai trò quyết định nhất đối với sự nghiệp cách mạng.',
          'Miền Nam: Tiền tuyến lớn giữ vai trò quyết định trực tiếp đánh đổ ách thống trị của Mỹ.'
        ],
        typein: {
          prompt: 'Quan sát mô hình 3D Xây dựng CNXH: Vai trò của hậu phương miền Bắc đối với toàn bộ sự nghiệp cách mạng chống Mỹ cứu nước là gì?',
          target: 'Quyết định nhất',
          accepted: ['Quyết định nhất', 'quyet dinh nhat', 'quyết định nhất', 'Vai trò quyết định nhất'],
          hint: 'Vai trò then chốt hàng đầu của hậu phương: "Quyết định..."',
          explanation: 'Đại hội III của Đảng (9/1960) xác định cách mạng XHCN ở miền Bắc giữ vai trò quyết định nhất đối với toàn bộ sự phát triển của cách mạng cả nước.'
        },
        quiz: {
          question: 'Đặc điểm lớn nhất, bao trùm của cách mạng Việt Nam trong thời kỳ 1954 - 1975 là gì?',
          options: [
            'A. Một Đảng lãnh đạo đồng thời hai chiến lược cách mạng khác nhau ở hai miền đất nước',
            'B. Miền Bắc và miền Nam cùng tiến hành cách mạng xã hội chủ nghĩa',
            'C. Cả nước tập trung toàn bộ nhân lực cho mặt trận ngoại giao quốc tế',
            'D. Kháng chiến chống thực dân Pháp xâm lược lần thứ ba'
          ],
          correct: 0,
          explanation: 'Việt Nam thực hiện đồng thời hai nhiệm vụ: cách mạng XHCN ở miền Bắc và cách mạng dân tộc dân chủ nhân dân ở miền Nam nhằm mục tiêu thống nhất Tổ quốc.'
        },
        trueFalse: {
          context: 'Quan sát mô hình 3D và đặc điểm tình hình cách mạng nước ta giai đoạn 1954 - 1975:',
          statements: [
            { id: 'a', text: 'Mỹ đã phá hoại Hiệp định Giơ-ne-vơ, dựng lên chính quyền bù nhìn Ngô Đình Diệm hòng biến miền Nam thành thuộc địa kiểu mới.', isTrue: true, explain: 'Âm mưu chia cắt lâu dài đất nước ta và ngăn chặn làn sóng cách mạng.' },
            { id: 'b', text: 'Miền Bắc là căn cứ địa chung của cả nước, chi viện sức người sức của vô tận cho tiền tuyến miền Nam.', isTrue: true, explain: 'Tất cả vì miền Nam ruột thịt, thóc không thiếu một cân, quân không thiếu một người.' },
            { id: 'c', text: 'Cách mạng ở miền Nam giữ vai trò quyết định trực tiếp trong việc đánh đổ ách thống trị của đế quốc Mỹ và tay sai.', isTrue: true, explain: 'Tiền tuyến trực tiếp giáng đòn tiêu diệt các chiến lược chiến tranh của Mỹ.' },
            { id: 'd', text: 'Đến năm 1960, hai miền Nam - Bắc đã hoàn thành việc hiệp thương và tổ chức tổng tuyển cử hòa bình.', isTrue: false, explain: 'Mỹ - Diệm cự tuyệt tổng tuyển cử, ban hành đạo luật 10/59 lê máy chém đi khắp miền Nam tàn sát đồng bào.' }
          ]
        }
      },
      {
        order: 2,
        stationBadge: 'BÀI 8 · TRẠM 2',
        title: 'Phong trào Đồng Khởi (1959 - 1960) & Đội quân tóc dài Bến Tre',
        modelUrl: 'assets/models/bai8/tram2/doi_quan_toc_dai_ben_tre.glb',
        poster: 'assets/images/bai8/tram2.jpg',
        summary: 'Nghị quyết 15 của Đảng (1959) mở đường cho đồng bào miền Nam đứng lên nổi dậy. Phong trào Đồng khởi bùng nổ tiêu biểu tại Bến Tre (17/1/1960), chuyển cách mạng từ thế giữ gìn lực lượng sang thế tiến công.',
        mnemonic: 'Đồng khởi Bến Tre 1960 - Đội quân tóc dài - Chuyển sang thế tiến công.',
        keyPoints: [
          'Nghị quyết 15 Trung ương Đảng (1/1959): Kết hợp đấu tranh chính trị với vũ trang.',
          'Ngày 17/1/1960: Đồng khởi bùng nổ tại 3 xã Định Thủy, Phước Hiệp, Bình Khánh (Mỏ Cày, Bến Tre).',
          'Chuyển cách mạng miền Nam từ thế giữ gìn lực lượng sang thế tiến công mạnh mẽ.'
        ],
        typein: {
          prompt: 'Quan sát mô hình 3D Đội quân tóc dài: Gõ tên tỉnh tiêu biểu nhất nơi phong trào Đồng Khởi (1960) bùng nổ dữ dội làm lung lay chính quyền Mỹ - Diệm:',
          target: 'Bến Tre',
          accepted: ['Bến Tre', 'Ben Tre', 'bến tre', 'ben tre'],
          hint: 'Vùng đất xứ dừa miền Tây Nam Bộ: "Bến..."',
          explanation: 'Ngày 17/1/1960, dưới sự lãnh đạo của đồng chí Nguyễn Thị Định, phong trào Đồng khởi bùng nổ như triều dâng bão cuốn tại huyện Mỏ Cày, tỉnh Bến Tre.'
        },
        quiz: {
          question: 'Ý nghĩa lịch sử quan trọng nhất của phong trào Đồng khởi (1959 - 1960) ở miền Nam là gì?',
          options: [
            'A. Chuyển cách mạng miền Nam từ thế giữ gìn lực lượng sang thế tiến công liên tục',
            'B. Đánh bại hoàn toàn chiến lược Chiến tranh cục bộ của quân đội viễn chinh Mỹ',
            'C. Buộc đế quốc Mỹ phải rút toàn bộ cố vấn quân sự về nước',
            'D. Giải phóng hoàn toàn các đô thị lớn tại miền Nam'
          ],
          correct: 0,
          explanation: 'Đồng khởi đã giáng đòn bất ngờ vào chính quyền tay sai Ngô Đình Diệm, phá vỡ từng mảng lớn kìm kẹp của địch, chuyển cách mạng miền Nam sang thế tiến công.'
        },
        trueFalse: {
          context: 'Quan sát mô hình 3D và diễn biến của phong trào Đồng Khởi miền Nam (1959 - 1960):',
          statements: [
            { id: 'a', text: 'Nghị quyết 15 Ban Chấp hành Trung ương Đảng (1/1959) đã vạch ra con đường bạo lực cách mạng giải phóng miền Nam.', isTrue: true, explain: 'Nghị quyết như ngọn đuốc mở đường cho phong trào nổi dậy của quần chúng.' },
            { id: 'b', text: '"Đội quân tóc dài" huyền thoại gắn liền với vai trò chỉ huy mẫu mực của nữ tướng Nguyễn Thị Định.', isTrue: true, explain: 'Đội quân chính trị của phụ nữ Bến Tre nổi tiếng với nghệ thuật đánh giặc bằng ba mũi giáp công.' },
            { id: 'c', text: 'Thành quả lớn nhất của Đồng khởi là sự ra đời của Mặt trận Dân tộc Giải phóng miền Nam Việt Nam (20/12/1960).', isTrue: true, explain: 'Mặt trận tập hợp toàn thể các tầng lớp nhân dân miền Nam đấu tranh chống Mỹ.' },
            { id: 'd', text: 'Phong trào Đồng khởi chỉ diễn ra ở vùng đô thị Sài Gòn, vùng nông thôn hoàn toàn bất động.', isTrue: false, explain: 'Phong trào nổ ra mạnh mẽ nhất từ nông thôn đồng bằng Nam Bộ lan sang Tây Nguyên và Trung Trung Bộ.' }
          ]
        }
      },
      {
        order: 3,
        stationBadge: 'BÀI 8 · TRẠM 3',
        title: 'Đánh bại Chiến tranh đặc biệt & Trực thăng vận của Mỹ (1961 - 1965)',
        modelUrl: 'assets/models/bai8/tram3/my_dung_truc_thang_van.glb',
        poster: 'assets/images/bai8/tram3.jpg',
        summary: 'Chiến lược Chiến tranh đặc biệt (1961 - 1965) dùng quân đội Sài Gòn dưới sự chỉ huy của cố vấn Mỹ, áp dụng chiến thuật "trực thăng vận", "thiết xa vận" và quốc sách ấp chiến lược. Ta đánh bại bằng Chiến thắng Ấp Bắc.',
        mnemonic: 'Chiến tranh đặc biệt - Ấp chiến lược, trực thăng vận - Chiến thắng Ấp Bắc 1963 phá tan.',
        keyPoints: [
          'Công thức: Quân đội tay sai Sài Gòn + Cố vấn, vũ khí, phương tiện Mỹ.',
          'Xương sống chiến lược: Gom dân lập "Ấp chiến lược".',
          'Chiến thắng Ấp Bắc (2/1/1963) chứng minh ta hoàn toàn có khả năng đánh bại chiến thuật mới của Mỹ.'
        ],
        typein: {
          prompt: 'Quan sát mô hình 3D Trực thăng vận của Mỹ: Gõ tên trận chiến thắng oanh liệt ngày 2/1/1963 tại Mỹ Tho mở ra phong trào "Thi đua Ấp Bắc, giết giặc lập công":',
          target: 'Ấp Bắc',
          accepted: ['Ấp Bắc', 'Ap Bac', 'ấp bắc', 'ap bac', 'Chiến thắng Ấp Bắc'],
          hint: 'Địa danh thuộc tỉnh Mỹ Tho (nay là Tiền Giang): "Ấp..."',
          explanation: 'Chiến thắng Ấp Bắc (2/1/1963) là mốc son chói lọi chứng minh quân dân miền Nam có thể đánh bại chiến thuật trực thăng vận và thiết xa vận của Mỹ.'
        },
        quiz: {
          question: 'Yếu tố nào được đế quốc Mỹ và chính quyền Sài Gòn coi là "xương sống", "quốc sách" của chiến lược Chiến tranh đặc biệt?',
          options: [
            'A. Quốc sách lập "Ấp chiến lược" nhằm tách dân khỏi lực lượng cách mạng',
            'B. Ném bom phá hoại miền Bắc bằng không quân chiến lược',
            'C. Ký kết hiệp định thương mại song phương mở cửa kinh tế',
            'D. Rút toàn bộ cố vấn quân sự về nước'
          ],
          correct: 0,
          explanation: 'Mỹ và chính quyền Diệm coi dồn dân lập ấp chiến lược là xương sống để kìm kẹp, kiểm soát nhân dân, cách ly lực lượng vũ trang cách mạng.'
        },
        trueFalse: {
          context: 'Quan sát mô hình 3D và cuộc chiến đấu chống chiến lược "Chiến tranh đặc biệt" (1961 - 1965):',
          statements: [
            { id: 'a', text: 'Chiến lược Chiến tranh đặc biệt được tiến hành bằng quân đội tay sai Sài Gòn dưới sự chỉ huy của cố vấn quân sự Mỹ.', isTrue: true, explain: 'Âm mưu dùng người Việt đánh người Việt của đế quốc Mỹ.' },
            { id: 'b', text: 'Quân dân miền Nam đã kiên cường đánh địch bằng "Ba mũi giáp công": quân sự, chính trị và binh vận.', isTrue: true, explain: 'Sức mạnh tổng hợp của chiến tranh nhân dân.' },
            { id: 'c', text: 'Chiến thắng Ba Gia, Đồng Xoài (1965) đã làm phá sản hoàn toàn chiến lược Chiến tranh đặc biệt của Mỹ.', isTrue: true, explain: 'Quân chủ lực Sài Gòn đứng trước nguy cơ tan rã hoàn toàn.' },
            { id: 'd', text: 'Trong Chiến tranh đặc biệt, Mỹ đã đưa 50 vạn lính lục quân trực tiếp tham chiến trên các chiến trường miền Nam.', isTrue: false, explain: 'Lục quân chiến đấu của Mỹ chỉ đổ bộ ồ ạt từ năm 1965 trong chiến lược "Chiến tranh cục bộ".' }
          ]
        }
      },
      {
        order: 4,
        stationBadge: 'BÀI 8 · TRẠM 4',
        title: 'Chiến thắng Vạn Tường & Đánh bại hai mùa khô (Chiến tranh cục bộ)',
        modelUrl: 'assets/models/bai8/tram4/chien_thang_ap_bac.glb',
        poster: 'assets/images/bai8/tram4.jpg',
        summary: 'Chiến lược Chiến tranh cục bộ (1965 - 1968) là hình thức chiến tranh tàn bạo nhất của Mỹ với quân viễn chinh Mỹ trực tiếp tham chiến. Chiến thắng Vạn Tường (8/1965) mở đầu phong trào "Tìm Mỹ mà đánh, lùng ngụy mà diệt".',
        mnemonic: 'Chiến tranh cục bộ: Lính Mỹ ồ ạt - Vạn Tường mở đầu - Đánh bại 2 mùa khô.',
        keyPoints: [
          'Quân viễn chinh Mỹ, quân đồng minh chư hầu và quân Sài Gòn cùng tham chiến.',
          'Chiến thắng Vạn Tường (18/8/1965) chứng minh ta hoàn toàn có thể đánh bại quân Mỹ.',
          'Đập tan 2 cuộc phản công chiến lược mùa khô (1965 - 1966 và 1966 - 1967).'
        ],
        typein: {
          prompt: 'Quan sát mô hình 3D Phục kích: Gõ tên trận đánh ngày 18/8/1965 tại Quảng Ngãi được coi là "Ấp Bắc đối với quân Mỹ":',
          target: 'Vạn Tường',
          accepted: ['Vạn Tường', 'Van Tuong', 'vạn tường', 'van tuong', 'Chiến thắng Vạn Tường'],
          hint: 'Địa danh thuộc huyện Bình Sơn, tỉnh Quảng Ngãi: "Vạn..."',
          explanation: 'Chiến thắng Vạn Tường (18/8/1965) khẳng định quân dân miền Nam hoàn toàn có khả năng đánh thắng quân đội viễn chinh Mỹ hiện đại.'
        },
        quiz: {
          question: 'Chiến lược "Chiến tranh cục bộ" (1965 - 1968) của đế quốc Mỹ ở miền Nam khác với "Chiến tranh đặc biệt" ở điểm mấu chốt nào?',
          options: [
            'A. Có sự tham chiến trực tiếp của quân đội viễn chinh Mỹ và quân đồng minh chư hầu với vai trò chủ yếu',
            'B. Dừng hoàn toàn việc dồn dân lập ấp chiến lược',
            'C. Không còn sử dụng bom đạn và phương tiện chiến tranh hiện đại',
            'D. Rút hết cố vấn quân sự Mỹ về nước'
          ],
          correct: 0,
          explanation: 'Chiến tranh cục bộ dựa vào quân viễn chinh Mỹ và quân chư hầu (Hàn Quốc, Thái Lan, Úc...) làm lực lượng nòng cốt mở các cuộc hành quân "tìm diệt" và "bình định".'
        },
        trueFalse: {
          context: 'Quan sát mô hình 3D và cuộc đụng đầu lịch sử chống chiến lược "Chiến tranh cục bộ" (1965 - 1968):',
          statements: [
            { id: 'a', text: 'Chiến thắng Vạn Tường (8/1965) đã mở ra cao trào "Tìm Mỹ mà đánh, lùng ngụy mà diệt" trên khắp chiến trường miền Nam.', isTrue: true, explain: 'Xua tan tâm lý e ngại vũ khí tối tân của quân đội Mỹ.' },
            { id: 'b', text: 'Quân dân ta đã bẻ gãy hai cuộc phản công chiến lược mùa khô 1965 - 1966 và 1966 - 1967 của Mỹ.', isTrue: true, explain: 'Cuộc hành quân Gian-xơn Xi-ti lớn nhất của Mỹ bị đập tan tại căn cứ Tây Ninh.' },
            { id: 'c', text: 'Trong giai đoạn này, Mỹ đồng thời tiến hành chiến tranh phá hoại miền Bắc bằng không quân và hải quân.', isTrue: true, explain: 'Hòng ngăn chặn nguồn chi viện của hậu phương lớn miền Bắc cho miền Nam.' },
            { id: 'd', text: 'Quân đội Mỹ đã chiếm đóng và làm chủ hoàn toàn các vùng giải phóng của cách mạng miền Nam.', isTrue: false, explain: 'Vùng giải phóng không ngừng mở rộng, quân Mỹ bị sa lầy và phân tán lực lượng.' }
          ]
        }
      },
      {
        order: 5,
        stationBadge: 'BÀI 8 · TRẠM 5',
        title: 'Tổng tiến công & nổi dậy Xuân Mậu Thân 1968 — Đòn sấm sét',
        modelUrl: 'assets/models/bai8/tram5/tong_tien_cong_mau_than.glb',
        poster: 'assets/images/bai8/tram5.jpg',
        summary: 'Đêm giao thừa Tết Mậu Thân 1968, quân dân ta đồng loạt tổng tiến công vào 37 thị xã, 4 đô thị lớn và Tòa Đại sứ Mỹ tại Sài Gòn. Giáng đòn sấm sét, bẻ gãy ý chí xâm lược của Mỹ.',
        mnemonic: 'Xuân Mậu Thân 1968 - Đánh thẳng hang ổ địch - Buộc Mỹ ngồi vào đàm phán Paris.',
        keyPoints: [
          'Đêm 30 rạng 31/1/1968: Đồng loạt nổ súng tại Sài Gòn, Huế, Đà Nẵng và 37 thị xã.',
          'Đánh trúng Tòa Đại sứ Mỹ, Dinh Độc Lập, Bộ Tổng tham mưu Sài Gòn.',
          'Buộc Tổng thống Johnson tuyên bố ngừng ném bom miền Bắc và đàm phán tại Paris.'
        ],
        typein: {
          prompt: 'Quan sát mô hình 3D Biệt động Sài Gòn tiến công: Gõ mốc năm diễn ra cuộc Tổng tiến công và nổi dậy Tết Mậu Thân chấn động nước Mỹ:',
          target: '1968',
          accepted: ['1968', 'Mậu Thân 1968', 'Xuân 1968', 'Tết Mậu Thân 1968'],
          hint: 'Mùa xuân năm 1968',
          explanation: 'Cuộc Tổng tiến công và nổi dậy Tết Mậu Thân 1968 đã giáng đòn quyết định làm phá sản chiến lược "Chiến tranh cục bộ", buộc Mỹ phải xuống thang chiến tranh.'
        },
        quiz: {
          question: 'Thắng lợi vang dội của cuộc Tổng tiến công và nổi dậy Xuân Mậu Thân 1968 đã buộc đế quốc Mỹ phải chấp nhận nhượng bộ chiến lược nào?',
          options: [
            'A. Tuyên bố "phi Mỹ hóa" chiến tranh, ngừng ném bom miền Bắc từ vĩ tuyến 20 trở ra và chấp nhận ngồi vào bàn đàm phán tại Paris',
            'B. Rút toàn bộ quân viễn chinh Mỹ về nước ngay lập tức trong năm 1968',
            'C. Ký kết bản Hiệp định Paris chấm dứt chiến tranh lập tức',
            'D. Chuyển giao toàn bộ vũ khí hạt nhân cho chính quyền Sài Gòn'
          ],
          correct: 0,
          explanation: 'Đòn bất ngờ Mậu Thân 1968 đã buộc Tổng thống Johnson không ra tranh cử nhiệm kỳ mới, chấp nhận đàm phán hòa bình tại Paris.'
        },
        trueFalse: {
          context: 'Quan sát mô hình 3D và sự kiện Tổng tiến công và nổi dậy Xuân Mậu Thân năm 1968:',
          statements: [
            { id: 'a', text: 'Cuộc tập kích táo bạo của các chiến sĩ Biệt động Sài Gòn vào Tòa Đại sứ Mỹ đã làm chấn động toàn bộ chính giới và nhân dân Mỹ.', isTrue: true, explain: 'Hình ảnh chiến sự ngay trong cơ quan ngoại giao đầu não phơi bày sự bế tắc của cuộc chiến.' },
            { id: 'b', text: 'Quân ta đã làm chủ thành phố Huế trong suốt 26 ngày đêm kiên cường chống trả địch phản kích.', isTrue: true, explain: 'Lá cờ Mặt trận giải phóng tung bay kiêu hãnh trên đỉnh Cột cờ Phu Văn Lâu.' },
            { id: 'c', text: 'Sau Mậu Thân 1968, Mỹ đã tăng thêm 1 triệu quân viễn chinh sang chiến trường miền Nam để gỡ gạc thể diện.', isTrue: false, explain: 'Mỹ buộc phải tuyên bố "phi Mỹ hóa", bắt đầu rút dần quân viễn chinh về nước.' },
            { id: 'd', text: 'Thắng lợi Mậu Thân 1968 mở ra cục diện "vừa đánh vừa đàm" trên mặt trận ngoại giao quốc tế.', isTrue: true, explain: 'Đưa cuộc đàm phán hòa bình Paris chính thức khởi động.' }
          ]
        }
      },
      {
        order: 6,
        stationBadge: 'BÀI 8 · TRẠM 6',
        title: 'Đánh bại Việt Nam hóa chiến tranh & Mặt trận Quảng Trị (1972)',
        modelUrl: 'assets/models/bai8/tram6/mat_tran_quang_tri.glb',
        poster: 'assets/images/bai8/tram6.jpg',
        summary: 'Chiến lược "Việt Nam hóa chiến tranh" (1969 - 1973) dùng người Việt đánh người Việt dưới sự hỗ trợ hỏa lực Mỹ. Cuộc tiến công chiến lược 1972 và 81 ngày đêm Thành cổ Quảng Trị đã bẻ gãy chiến lược này.',
        mnemonic: 'Việt Nam hóa chiến tranh - 81 ngày đêm Thành cổ Quảng Trị - Máu hoa đỏ rực sông Thạch Hãn.',
        keyPoints: [
          'Âm mưu dùng quân đội Sài Gòn làm nòng cốt + hỏa lực, không quân Mỹ tối đa.',
          'Mở rộng chiến tranh sang Campuchia và Lào ("Đông Dương hóa chiến tranh").',
          '81 ngày đêm bảo vệ Thành cổ Quảng Trị (1972) là khúc tráng ca bất tử.'
        ],
        typein: {
          prompt: 'Quan sát mô hình 3D Mặt trận Thành cổ: Gõ số ngày đêm quân dân ta kiên cường bám trụ bảo vệ Thành cổ Quảng Trị mùa hè đỏ lửa năm 1972:',
          target: '81 ngày đêm',
          accepted: ['81 ngày đêm', '81 ngay dem', '81 ngày', '81 ngay', '81'],
          hint: 'Con số 81 ngày đêm lịch sử bên dòng sông Thạch Hãn',
          explanation: '81 ngày đêm bảo vệ Thành cổ Quảng Trị (từ 28/6 đến 16/9/1972) hứng chịu lượng bom đạn tương đương 7 quả bom nguyên tử, minh chứng cho ý chí sắt đá của quân dân ta.'
        },
        quiz: {
          question: 'Chiến lược "Việt Nam hóa chiến tranh" (1969 - 1973) của Tổng thống Mỹ Nixon được xây dựng dựa trên công thức cốt lõi nào?',
          options: [
            'A. Quân đội Sài Gòn làm nòng cốt + Hỏa lực, không quân và cố vấn Mỹ hỗ trợ tối đa',
            'B. Sử dụng 100% quân đội viễn chinh Mỹ trực tiếp càn quét trên mặt đất',
            'C. Nhờ quân đội các nước đồng minh NATO kéo vào chiếm đóng',
            'D. Rút toàn bộ viện trợ quân sự cho chính quyền Sài Gòn'
          ],
          correct: 0,
          explanation: 'Âm mưu nham hiểm của Nixon là rút dần quân Mỹ về nước nhưng tăng cường trang bị cho quân đội Sài Gòn để tiếp tục "dùng người Việt đánh người Việt".'
        },
        trueFalse: {
          context: 'Quan sát mô hình 3D và cuộc chiến đấu chống chiến lược "Việt Nam hóa chiến tranh" (1969 - 1973):',
          statements: [
            { id: 'a', text: 'Chiến thắng Đường 9 - Nam Lào (1971) đã đánh bại cuộc hành quân "Lam Sơn 719" thử nghiệm của Việt Nam hóa chiến tranh.', isTrue: true, explain: 'Bảo vệ vững chắc tuyến hành lang vận tải chiến lược đường Trường Sơn.' },
            { id: 'b', text: 'Cuộc Tiến công chiến lược năm 1972 của ta đã chọc thủng ba phòng tuyến phòng ngự kiên cố của địch tại Quảng Trị, Tây Nguyên và Đông Nam Bộ.', isTrue: true, explain: 'Buộc Mỹ phải thừa nhận sự phá sản của học thuyết Nixon.' },
            { id: 'c', text: 'Lượng bom đạn dội xuống Thành cổ Quảng Trị trong 81 ngày đêm tương đương sức công phá của 7 quả bom nguyên tử.', isTrue: true, explain: '"Mỗi tấc đất tấc hoa / Máu và hoa ngàn năm tươi thắm".' },
            { id: 'd', text: 'Chiến lược Việt Nam hóa chiến tranh đã giúp Mỹ kiểm soát vĩnh viễn toàn bộ miền Nam Việt Nam.', isTrue: false, explain: 'Chiến lược bị phá sản nặng nề, buộc Mỹ phải quay lại đàm phán ký Hiệp định Paris.' }
          ]
        }
      },
      {
        order: 7,
        stationBadge: 'BÀI 8 · TRẠM 7',
        title: 'Hà Nội - Điện Biên Phủ trên không (1972) & Hiệp định Paris 1973',
        modelUrl: 'assets/models/bai8/tram7/ban_pha_phao_dai_bay_b52.glb',
        poster: 'assets/images/bai8/tram7.jpg',
        summary: '12 ngày đêm cuối năm 1972, Mỹ ném bom rải thảm B-52 vào Hà Nội và Hải Phòng hòng "đưa miền Bắc về thời kỳ đồ đá". Quân dân ta bắn rơi 81 máy bay (34 chiếc B-52), lập nên trận Điện Biên Phủ trên không, ép Mỹ ký Hiệp định Paris.',
        mnemonic: '12 ngày đêm B-52 bốc cháy - Điện Biên Phủ trên không 1972 - Hiệp định Paris 1973.',
        keyPoints: [
          'Từ 18/12 đến 29/12/1972: Chiến dịch tập kích chiến lược đường không tàn khốc của Mỹ.',
          'Bắn rơi 34 pháo đài bay B-52 và 5 máy bay F-111 cánh cụp cánh xòe.',
          'Ngày 27/1/1973: Ký Hiệp định Paris, Mỹ buộc phải rút hết quân về nước.'
        ],
        typein: {
          prompt: 'Quan sát mô hình 3D Bắn hạ pháo đài bay B-52: Gõ ngày, tháng, năm bản Hiệp định Paris về chấm dứt chiến tranh, lập lại hòa bình ở Việt Nam được ký kết:',
          target: '27/1/1973',
          accepted: ['27/1/1973', '27-1-1973', '27/1', '27 tháng 1 năm 1973', '27/01/1973'],
          hint: 'Ngày 27 tháng 1 năm 1973 tại Paris (Pháp)',
          explanation: 'Ngày 27/1/1973, Hiệp định Paris được ký kết, buộc Mỹ phải công nhận độc lập, chủ quyền của Việt Nam và rút hết quân đội về nước.'
        },
        quiz: {
          question: 'Chiến thắng lịch sử nào trong 12 ngày đêm cuối năm 1972 được ví là trận "Điện Biên Phủ trên không", quyết định buộc Mỹ phải ký Hiệp định Paris?',
          options: [
            'A. Trận đánh bại cuộc tập kích chiến lược đường không bằng máy bay B-52 vào Hà Nội - Hải Phòng',
            'B. Trận bắn chìm tàu khu trục Ma-đốc trên Vịnh Bắc Bộ',
            'C. Trận bẻ gãy cuộc tập kích giải cứu phi công tù binh tại Sơn Tây',
            'D. Trận chiến thắng trên cầu Hàm Rồng (Thanh Hóa)'
          ],
          correct: 0,
          explanation: '12 ngày đêm "Điện Biên Phủ trên không" kiên cường bắn rơi 34 pháo đài bay B-52 đã giáng đòn quyết định đập tan uy thế không lực Hoa Kỳ.'
        },
        trueFalse: {
          context: 'Quan sát mô hình 3D Pháo phòng không bắn rơi B-52 và Hiệp định Paris năm 1973:',
          statements: [
            { id: 'a', text: 'Âm mưu của Mỹ khi mở cuộc tập kích B-52 là ép ta phải ký một hiệp định có lợi cho Mỹ tại hội nghị Paris.', isTrue: true, explain: 'Hòng dùng bom đạn đè bẹp ý chí tự do của nhân dân miền Bắc.' },
            { id: 'b', text: 'Bộ đội Tên lửa và Không quân nhân dân Việt Nam đã lập công xuất sắc bắn rơi nhiều "pháo đài bay" B-52 bốc cháy ngay trên bầu trời Thủ đô.', isTrue: true, explain: 'Chiến công chấn động thế giới của quân dân Việt Nam.' },
            { id: 'c', text: 'Hiệp định Paris 1973 quy định Mỹ phải rút hết quân viễn chinh và quân đồng minh, phá hết căn cứ quân sự ở miền Nam.', isTrue: true, explain: 'Hoàn thành trọn vẹn mục tiêu "Đánh cho Mỹ cút" của Bác Hồ.' },
            { id: 'd', text: 'Hiệp định Paris cho phép quân đội Mỹ để lại 10 vạn quân chiến đấu bảo vệ Tòa Đại sứ tại Sài Gòn.', isTrue: false, explain: 'Hiệp định quy định Mỹ và các nước chư hầu phải rút 100% quân đội về nước trong vòng 60 ngày.' }
          ]
        }
      },
      {
        order: 8,
        stationBadge: 'BÀI 8 · TRẠM 8',
        title: 'Hội nghị 21 & Chiến thắng Phước Long (1/1975) — Trinh sát chiến lược',
        modelUrl: 'assets/models/bai8/tram8/chien_thang_phuoc_long.glb',
        poster: 'assets/images/bai8/tram8.jpg',
        summary: 'Sau Hiệp định Paris, Hội nghị 21 (7/1973) khẳng định tiếp tục con đường cách mạng bạo lực. Chiến thắng Phước Long (6/1/1975) là đòn "trinh sát chiến lược", chứng minh quân Sài Gòn suy yếu và Mỹ bất lực không thể quay lại.',
        mnemonic: 'Phước Long 1/1975: Đòn trinh sát chiến lược - Mỹ không thể quay lại - Thời cơ giải phóng đã đến.',
        keyPoints: [
          'Hội nghị 21 Ban Chấp hành Trung ương Đảng (7/1973): Tiếp tục bạo lực cách mạng.',
          'Ngày 6/1/1975: Giải phóng hoàn toàn thị xã và toàn tỉnh Phước Long.',
          'Khẳng định thực tế: Quân đội Sài Gòn bất lực suy yếu, Mỹ không thể nhảy vào can thiệp.'
        ],
        typein: {
          prompt: 'Quan sát mô hình 3D Chiến sĩ giải phóng: Gõ tên tỉnh đầu tiên ở miền Nam được giải phóng hoàn toàn ngày 6/1/1975:',
          target: 'Phước Long',
          accepted: ['Phước Long', 'Phuoc Long', 'phước long', 'phuoc long', 'tỉnh Phước Long'],
          hint: 'Tỉnh miền Đông Nam Bộ: "Phước..."',
          explanation: 'Chiến thắng Phước Long (6/1/1975) là đòn trinh sát chiến lược củng cố quyết tâm giải phóng hoàn toàn miền Nam trong năm 1975.'
        },
        quiz: {
          question: 'Chiến thắng Phước Long (ngày 6/1/1975) có ý nghĩa như một "đòn trinh sát chiến lược" vì đã chứng minh điều gì?',
          options: [
            'A. Khả năng suy sụp bất lực của quân đội Sài Gòn và sự bất lực của Mỹ, Mỹ rất khó có khả năng can thiệp trở lại bằng quân sự',
            'B. Quân đội Mỹ đã tái xuất hiện ồ ạt trên chiến trường miền Đông Nam Bộ',
            'C. Pháo binh ta đã chiếm ưu thế tuyệt đối về số lượng đạn dược so với địch',
            'D. Chính quyền Sài Gòn quyết định đầu hàng vô điều kiện'
          ],
          correct: 0,
          explanation: 'Thắng lợi Phước Long giúp Bộ Chính trị khẳng định thời cơ giải phóng miền Nam đã chín muồi, Mỹ chỉ phản ứng yếu ớt bằng ngoại giao.'
        },
        trueFalse: {
          context: 'Quan sát mô hình 3D và sự kiện Chiến thắng Phước Long đầu năm 1975:',
          statements: [
            { id: 'a', text: 'Phước Long là tỉnh đầu tiên ở miền Nam được quân dân ta giải phóng hoàn toàn.', isTrue: true, explain: 'Địa bàn chiến lược cửa ngõ phía Bắc Sài Gòn.' },
            { id: 'b', text: 'Sau khi mất Phước Long, tổng thống Mỹ đã lập tức điều 3 sư đoàn lính thủy đánh bộ đổ bộ tái chiếm.', isTrue: false, explain: 'Mỹ chỉ phản ứng chiếu lệ bằng lời đe dọa từ xa, không dám đem quân quay lại.' },
            { id: 'c', text: 'Chiến thắng Phước Long củng cố quyết tâm giải phóng miền Nam trong hai năm 1975 - 1976 của Bộ Chính trị.', isTrue: true, explain: 'Bộ Chính trị quyết định: "Nếu thời cơ đến vào đầu hoặc cuối năm 1975 thì lập tức giải phóng miền Nam trong năm 1975".' },
            { id: 'd', text: 'Quân đội Sài Gòn sau khi Mỹ rút vẫn duy trì được tinh thần chiến đấu và khả năng phòng thủ bất khả xâm phạm.', isTrue: false, explain: 'Quân đội Sài Gòn suy sụp nghiêm trọng cả về tinh thần, vũ khí và viện trợ.' }
          ]
        }
      },
      {
        order: 9,
        stationBadge: 'BÀI 8 · TRẠM 9',
        title: 'Xe tăng 390 Húc đổ cổng Dinh Độc Lập — Toàn thắng 30/4/1975',
        modelUrl: 'assets/models/bai8/tram9/xe_tang_giai_phong_390.glb',
        poster: 'assets/images/bai8/tram9.jpg',
        summary: '11 giờ 30 phút ngày 30/4/1975, Xe tăng 390 húc tung cổng chính Dinh Độc Lập. Lá cờ giải phóng tung bay trên nóc dinh, Tổng thống Dương Văn Minh đầu hàng không điều kiện. Đại thắng mùa Xuân 1975 toàn thắng.',
        mnemonic: 'Xe tăng 390 húc tung cổng Dinh - 11h30 ngày 30/4/1975 - Non sông thu về một mối.',
        keyPoints: [
          'Ba đòn tiến công chiến lược: Chiến dịch Tây Nguyên ➔ Huế - Đà Nẵng ➔ Hồ Chí Minh.',
          '10 giờ 45 phút ngày 30/4/1975: Xe tăng 390 húc đổ cổng chính Dinh Độc Lập.',
          '11 giờ 30 phút ngày 30/4/1975: Lá cờ cách mạng tung bay trên nóc Dinh Độc Lập.'
        ],
        typein: {
          prompt: 'Quan sát mô hình 3D Xe tăng 390: Gõ thời khắc (giờ, phút, ngày, tháng, năm) lá cờ cách mạng tung bay trên nóc Dinh Độc Lập báo hiệu giải phóng hoàn toàn miền Nam:',
          target: '11h30 ngày 30/4/1975',
          accepted: ['11h30 ngày 30/4/1975', '11h30 30/4/1975', '30/4/1975', '30/04/1975', '30-4-1975', '11:30 30/4/1975'],
          hint: '11 giờ 30 phút trưa ngày 30 tháng 4 năm 1975',
          explanation: 'Đúng 11 giờ 30 phút ngày 30/4/1975, lá cờ Mặt trận Dân tộc giải phóng miền Nam Việt Nam tung bay trên nóc Dinh Độc Lập, non sông trọn niềm vui thống nhất.'
        },
        quiz: {
          question: 'Chiếc xe tăng lịch sử nào của Quân đoàn 2 đã húc đổ cổng chính Dinh Độc Lập trưa ngày 30/4/1975?',
          options: [
            'A. Xe tăng mang số hiệu 390',
            'B. Xe tăng mang số hiệu 843',
            'C. Xe tăng mang số hiệu 985',
            'D. Xe tăng mang số hiệu 102'
          ],
          correct: 0,
          explanation: 'Xe tăng 390 (do Trung úy Vũ Đăng Toàn làm Trưởng xe) đã húc tung cánh cổng chính Dinh Độc Lập trưa ngày 30/4/1975, mở đường cho quân giải phóng tiến vào.'
        },
        trueFalse: {
          context: 'Quan sát mô hình 3D Xe tăng 390 và Chiến dịch Hồ Chí Minh lịch sử đại thắng mùa Xuân năm 1975:',
          statements: [
            { id: 'a', text: 'Chiến dịch Hồ Chí Minh là chiến dịch quyết chiến chiến lược cuối cùng giải phóng hoàn toàn miền Nam.', isTrue: true, explain: 'Năm cánh quân lớn thần tốc tiến vào giải phóng Sài Gòn - Gia Định.' },
            { id: 'b', text: 'Xe tăng 390 đã húc đổ cổng chính Dinh Độc Lập lúc 10 giờ 45 phút ngày 30/4/1975.', isTrue: true, explain: 'Hình ảnh biểu tượng chiến thắng vang dội của Quân đội nhân dân Việt Nam.' },
            { id: 'c', text: 'Tổng thống cuối cùng của chính quyền Sài Gòn là Nguyễn Văn Thiệu đã trực tiếp ký biên bản đầu hàng tại Dinh.', isTrue: false, explain: 'Tổng thống Dương Văn Minh (vừa nhậm chức vài ngày) đã tuyên bố đầu hàng không điều kiện.' },
            { id: 'd', text: 'Đại thắng mùa Xuân 1975 đã kết thúc vẻ vang 30 năm chiến tranh giải phóng dân tộc và bảo vệ Tổ quốc (1945 - 1975).', isTrue: true, explain: 'Đưa giang sơn thu về một mối, mở ra kỷ nguyên độc lập thống nhất cả nước đi lên CNXH.' }
          ]
        }
      }
    ]
  };

  // Export data globally
  global.LOCI_MODEL_EXAM_DATA = MODEL_EXAM_DATA;


  // ===========================================================================
  // 2. CONTROLLER GIAO DIỆN & BỘ ĐIỀU HƯỚNG KIỂM TRA MÔ HÌNH 3D
  // ===========================================================================
  const LociModel3DExam = {

    injectStyles() {
      if (document.getElementById('loci-m3d-styles')) return;
      const styleEl = document.createElement('style');
      styleEl.id = 'loci-m3d-styles';
      styleEl.textContent = `
        /* LOCI EDU - 3D MODEL EXAM STYLES (CALM BLUE & SOFT GREEN EDTECH) */
        .m3d-exam-wrapper {
          width: 100%;
          max-width: 1280px;
          margin: 0 auto;
          padding: 16px 20px 48px;
          box-sizing: border-box;
          font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          color: #0f172a;
          animation: m3dFadeIn 0.3s ease-out;
        }

        @keyframes m3dFadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* TOP BAR */
        .m3d-top-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 1px solid #e2e8f0;
        }

        .m3d-header-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .m3d-back-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 10px;
          color: #475569;
          font-size: 13.5px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }

        .m3d-back-btn:hover {
          background: #f1f5f9;
          color: #0f172a;
          border-color: #94a3b8;
          transform: translateX(-2px);
        }

        .m3d-header-title-box {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .m3d-header-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #0284c7;
        }

        .m3d-main-title {
          font-size: 20px;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
          letter-spacing: -0.3px;
        }

        .m3d-lesson-pills {
          display: flex;
          gap: 8px;
          background: #f1f5f9;
          padding: 4px;
          border-radius: 12px;
        }

        .m3d-lesson-pill {
          padding: 8px 14px;
          font-size: 13px;
          font-weight: 700;
          color: #64748b;
          background: transparent;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .m3d-lesson-pill:hover {
          color: #0284c7;
        }

        .m3d-lesson-pill.active {
          background: #ffffff;
          color: #0284c7;
          box-shadow: 0 2px 6px rgba(2, 132, 199, 0.12);
        }

        /* STATION STRIP */
        .m3d-station-strip {
          margin-bottom: 24px;
          overflow-x: auto;
          padding-bottom: 4px;
        }

        .m3d-station-strip-inner {
          display: flex;
          gap: 8px;
          min-width: max-content;
        }

        .m3d-station-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
          padding: 8px 14px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s;
          min-width: 86px;
        }

        .m3d-station-btn:hover {
          border-color: #0284c7;
          background: #f8fafc;
        }

        .m3d-st-num {
          font-size: 12.5px;
          font-weight: 800;
          color: #334155;
        }

        .m3d-st-status {
          font-size: 11px;
          font-weight: 600;
          color: #94a3b8;
        }

        .m3d-station-btn.current {
          background: #e0f2fe;
          border-color: #0284c7;
        }

        .m3d-station-btn.current .m3d-st-num {
          color: #0284c7;
        }

        .m3d-station-btn.current .m3d-st-status {
          color: #0369a1;
          font-weight: 700;
        }

        .m3d-station-btn.completed {
          background: #ecfdf5;
          border-color: #10b981;
        }

        .m3d-station-btn.completed .m3d-st-num {
          color: #047857;
        }

        .m3d-station-btn.completed .m3d-st-status {
          color: #059669;
          font-weight: 700;
        }

        .m3d-station-btn.partial {
          background: #fffbeb;
          border-color: #f59e0b;
        }

        .m3d-station-btn.partial .m3d-st-num {
          color: #b45309;
        }

        /* WORKSPACE GRID */
        .m3d-workspace-grid {
          display: grid;
          grid-template-columns: 1.05fr 1fr;
          gap: 20px;
          align-items: start;
        }

        @media (max-width: 980px) {
          .m3d-workspace-grid {
            grid-template-columns: 1fr;
          }
        }

        /* CARDS */
        .m3d-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 18px;
          box-shadow: 0 4px 16px rgba(15, 23, 42, 0.04);
          overflow: hidden;
        }

        /* VIEWER CARD */
        .m3d-viewer-card {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .m3d-viewer-header {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .m3d-badge-station {
          align-self: flex-start;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.5px;
          color: #0284c7;
          background: #e0f2fe;
          border: 1px solid #bae6fd;
          padding: 4px 10px;
          border-radius: 99px;
        }

        .m3d-station-title {
          font-size: 18px;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
          line-height: 1.35;
        }

        .m3d-viewer-stage {
          position: relative;
          border-radius: 14px;
          overflow: hidden;
          background: radial-gradient(circle, #f8fafc 0%, #e2e8f0 100%);
          border: 1px solid #e2e8f0;
        }

        .m3d-poster-slot {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          background: #f8fafc;
          color: #64748b;
          font-size: 13px;
          font-weight: 600;
        }

        .m3d-loading-spinner {
          width: 36px;
          height: 36px;
          border: 3px solid #e2e8f0;
          border-top-color: #0284c7;
          border-radius: 50%;
          animation: m3dSpin 0.8s linear infinite;
        }

        @keyframes m3dSpin {
          to { transform: rotate(360deg); }
        }

        .m3d-viewer-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 8px;
          padding: 10px 12px;
          background: #f8fafc;
          border-top: 1px solid #e2e8f0;
        }

        .m3d-tool-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          font-size: 12.5px;
          font-weight: 700;
          color: #334155;
          cursor: pointer;
          transition: all 0.2s;
        }

        .m3d-tool-btn:hover {
          border-color: #0284c7;
          color: #0284c7;
          background: #f0f9ff;
        }

        .m3d-viewer-hint {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 11.5px;
          color: #64748b;
          font-weight: 600;
        }

        /* LOCI KNOWLEDGE BOX */
        .m3d-loci-knowledge {
          display: flex;
          flex-direction: column;
          gap: 12px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 16px;
        }

        .m3d-loci-head {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 800;
          color: #0284c7;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        .m3d-summary-p {
          font-size: 13.5px;
          line-height: 1.55;
          color: #334155;
          margin: 0;
        }

        .m3d-mnemonic-box {
          background: #ecfdf5;
          border: 1px solid #a7f3d0;
          border-radius: 10px;
          padding: 10px 12px;
        }

        .m3d-mnemonic-tag {
          font-size: 11px;
          font-weight: 800;
          color: #047857;
          text-transform: uppercase;
          margin-bottom: 2px;
        }

        .m3d-mnemonic-text {
          font-size: 13px;
          font-weight: 700;
          color: #065f46;
          line-height: 1.45;
        }

        .m3d-keypoints-box {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .m3d-keypoints-title {
          font-size: 12px;
          font-weight: 800;
          color: #475569;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        .m3d-keypoints-list {
          margin: 0;
          padding-left: 18px;
          font-size: 13px;
          line-height: 1.5;
          color: #334155;
        }

        .m3d-keypoints-list li {
          margin-bottom: 4px;
        }

        /* EXAM CARD */
        .m3d-exam-card {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        /* TABS */
        .m3d-tabs-nav {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          background: #f1f5f9;
          padding: 5px;
          border-radius: 12px;
        }

        .m3d-tab-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 10px 8px;
          background: transparent;
          border: none;
          border-radius: 9px;
          cursor: pointer;
          font-size: 12.5px;
          font-weight: 700;
          color: #64748b;
          transition: all 0.2s;
        }

        .m3d-tab-btn:hover {
          color: #0284c7;
        }

        .m3d-tab-btn.active {
          background: #ffffff;
          color: #0284c7;
          box-shadow: 0 2px 6px rgba(2, 132, 199, 0.12);
        }

        .m3d-badge-check {
          color: #10b981;
          font-weight: 800;
          font-size: 12px;
        }

        .m3d-badge-wrong {
          color: #ef4444;
          font-weight: 800;
          font-size: 12px;
        }

        .m3d-badge-score {
          background: #fef3c7;
          color: #b45309;
          font-size: 11px;
          font-weight: 800;
          padding: 2px 6px;
          border-radius: 99px;
        }

        /* TAB CONTENT PANES */
        .m3d-tab-content {
          display: flex;
          flex-direction: column;
          gap: 16px;
          min-height: 380px;
        }

        .m3d-pane-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 8px;
          border-bottom: 1px solid #f1f5f9;
        }

        .m3d-pane-tag {
          font-size: 12px;
          font-weight: 800;
          text-transform: uppercase;
          color: #64748b;
          letter-spacing: 0.3px;
        }

        .tag-correct {
          font-size: 11.5px;
          font-weight: 800;
          color: #059669;
          background: #ecfdf5;
          padding: 3px 8px;
          border-radius: 99px;
          border: 1px solid #a7f3d0;
        }

        .tag-wrong {
          font-size: 11.5px;
          font-weight: 800;
          color: #dc2626;
          background: #fef2f2;
          padding: 3px 8px;
          border-radius: 99px;
          border: 1px solid #fecaca;
        }

        .tag-pending {
          font-size: 11.5px;
          font-weight: 600;
          color: #94a3b8;
          background: #f8fafc;
          padding: 3px 8px;
          border-radius: 99px;
        }

        .tag-score {
          font-size: 11.5px;
          font-weight: 800;
          color: #b45309;
          background: #fef3c7;
          padding: 3px 8px;
          border-radius: 99px;
          border: 1px solid #fde68a;
        }

        .m3d-question-prompt {
          font-size: 15.5px;
          font-weight: 700;
          line-height: 1.5;
          color: #0f172a;
          margin: 4px 0 10px;
        }

        /* TYPE-IN STYLES */
        .m3d-input-group {
          display: flex;
          gap: 8px;
          margin-bottom: 8px;
        }

        .m3d-text-field {
          flex: 1;
          padding: 12px 16px;
          font-size: 14.5px;
          font-weight: 600;
          color: #0f172a;
          background: #f8fafc;
          border: 1.5px solid #cbd5e1;
          border-radius: 12px;
          outline: none;
          transition: all 0.2s;
        }

        .m3d-text-field:focus {
          border-color: #0284c7;
          background: #ffffff;
          box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.15);
        }

        .m3d-text-field.valid {
          border-color: #10b981;
          background: #f0fdf4;
          color: #047857;
        }

        .m3d-text-field.invalid {
          border-color: #ef4444;
          background: #fef2f2;
          color: #b91c1c;
        }

        .m3d-btn-submit {
          padding: 0 20px;
          font-size: 14px;
          font-weight: 700;
          color: #ffffff;
          background: #0284c7;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .m3d-btn-submit:hover:not(:disabled) {
          background: #0369a1;
          transform: translateY(-1px);
        }

        .m3d-btn-submit:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .m3d-hint-row {
          display: flex;
          justify-content: flex-start;
          margin-bottom: 8px;
        }

        .m3d-btn-hint {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: transparent;
          border: none;
          color: #0284c7;
          font-size: 12.5px;
          font-weight: 700;
          cursor: pointer;
          padding: 4px 0;
        }

        .m3d-btn-hint:hover {
          text-decoration: underline;
        }

        .m3d-hint-box {
          background: #f0f9ff;
          border: 1px dashed #bae6fd;
          border-radius: 10px;
          padding: 10px 14px;
          font-size: 13px;
          color: #0369a1;
          line-height: 1.45;
          margin-bottom: 12px;
        }

        /* FEEDBACK BOX */
        .m3d-feedback-box {
          border-radius: 12px;
          padding: 14px 16px;
          font-size: 13.5px;
          line-height: 1.5;
          margin-top: 10px;
          animation: m3dFadeIn 0.25s ease-out;
        }

        .m3d-feedback-box.correct {
          background: #ecfdf5;
          border: 1px solid #a7f3d0;
          color: #065f46;
        }

        .m3d-feedback-box.wrong {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #991b1b;
        }

        .m3d-fb-title {
          font-weight: 800;
          margin-bottom: 4px;
        }

        .m3d-fb-answer {
          margin-bottom: 4px;
        }

        .m3d-fb-explanation {
          color: #475569;
          font-size: 13px;
        }

        /* QUIZ STYLES */
        .m3d-quiz-options {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 12px;
        }

        .m3d-quiz-opt {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 14px;
          background: #ffffff;
          border: 1.5px solid #e2e8f0;
          border-radius: 12px;
          text-align: left;
          cursor: pointer;
          transition: all 0.2s;
        }

        .m3d-quiz-opt:hover:not(:disabled) {
          border-color: #0284c7;
          background: #f0f9ff;
          transform: translateX(2px);
        }

        .m3d-opt-letter {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          background: #f1f5f9;
          color: #475569;
          font-weight: 800;
          font-size: 13px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .m3d-opt-text {
          flex: 1;
          font-size: 13.5px;
          font-weight: 600;
          color: #1e293b;
          line-height: 1.45;
        }

        .m3d-opt-check {
          color: #10b981;
          font-weight: 800;
          font-size: 15px;
        }

        .m3d-opt-cross {
          color: #ef4444;
          font-weight: 800;
          font-size: 15px;
        }

        .m3d-quiz-opt.opt-correct {
          background: #ecfdf5;
          border-color: #10b981;
        }

        .m3d-quiz-opt.opt-correct .m3d-opt-letter {
          background: #10b981;
          color: #ffffff;
        }

        .m3d-quiz-opt.opt-wrong {
          background: #fef2f2;
          border-color: #ef4444;
        }

        .m3d-quiz-opt.opt-wrong .m3d-opt-letter {
          background: #ef4444;
          color: #ffffff;
        }

        .m3d-quiz-opt.opt-dimmed {
          opacity: 0.6;
        }

        /* TRUE / FALSE STYLES */
        .m3d-tf-context {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          padding: 10px 12px;
          font-size: 13.5px;
          line-height: 1.45;
          color: #334155;
          margin-bottom: 12px;
        }

        .m3d-tf-table {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 14px;
        }

        .m3d-tf-table-head {
          display: grid;
          grid-template-columns: 1fr 48px 48px;
          gap: 8px;
          padding: 6px 10px;
          font-size: 11.5px;
          font-weight: 800;
          text-transform: uppercase;
          color: #64748b;
          border-bottom: 1px solid #e2e8f0;
        }

        .m3d-tf-table-head .col-choice {
          text-align: center;
        }

        .m3d-tf-row {
          display: grid;
          grid-template-columns: 1fr 48px 48px;
          gap: 8px;
          align-items: center;
          padding: 10px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          transition: all 0.2s;
        }

        .m3d-tf-stmt-text {
          display: flex;
          gap: 8px;
          font-size: 13.5px;
          line-height: 1.45;
          color: #1e293b;
        }

        .m3d-tf-letter {
          font-weight: 800;
          color: #0284c7;
        }

        .m3d-tf-btn-col {
          display: flex;
          justify-content: center;
        }

        .m3d-choice-btn {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          border: 1.5px solid #cbd5e1;
          background: #f8fafc;
          font-weight: 800;
          font-size: 13px;
          color: #475569;
          cursor: pointer;
          transition: all 0.2s;
        }

        .m3d-choice-btn:hover:not(:disabled) {
          border-color: #0284c7;
          color: #0284c7;
        }

        .m3d-choice-btn.selected {
          border-color: #0284c7;
          background: #e0f2fe;
          color: #0284c7;
        }

        .m3d-choice-btn.target-true {
          background: #10b981 !important;
          border-color: #10b981 !important;
          color: #ffffff !important;
        }

        .m3d-choice-btn.target-false {
          background: #ef4444 !important;
          border-color: #ef4444 !important;
          color: #ffffff !important;
        }

        .m3d-tf-sub-explain {
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 12.5px;
          line-height: 1.45;
          margin-top: -4px;
        }

        .m3d-tf-sub-explain.exp-correct {
          background: #f0fdf4;
          color: #166534;
          border-left: 3px solid #10b981;
        }

        .m3d-tf-sub-explain.exp-wrong {
          background: #fef2f2;
          color: #991b1b;
          border-left: 3px solid #ef4444;
        }

        .m3d-btn-grade-tf {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          background: #10b981;
          color: #ffffff;
          border: none;
          border-radius: 10px;
          font-size: 13.5px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }

        .m3d-btn-grade-tf:hover {
          background: #059669;
          transform: translateY(-1px);
        }

        .m3d-moet-scale-note {
          font-size: 12px;
          color: #64748b;
          padding: 8px 10px;
          background: #f8fafc;
          border-radius: 8px;
        }

        /* FOOTER NAVIGATION */
        .m3d-footer-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 14px;
          border-top: 1px solid #e2e8f0;
          margin-top: auto;
          gap: 10px;
        }

        .m3d-nav-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 10px 16px;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 10px;
          font-size: 13.5px;
          font-weight: 700;
          color: #334155;
          cursor: pointer;
          transition: all 0.2s;
        }

        .m3d-nav-btn:hover:not(:disabled) {
          border-color: #0284c7;
          color: #0284c7;
          background: #f0f9ff;
        }

        .m3d-nav-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .m3d-nav-btn.next {
          background: #0284c7;
          border-color: #0284c7;
          color: #ffffff;
        }

        .m3d-nav-btn.next:hover {
          background: #0369a1;
        }

        .m3d-nav-btn.finish {
          background: #10b981;
          border-color: #10b981;
          color: #ffffff;
        }

        .m3d-nav-btn.finish:hover {
          background: #059669;
        }

        .m3d-dropdown-station {
          padding: 8px 12px;
          font-size: 13px;
          font-weight: 600;
          color: #334155;
          background: #f8fafc;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          outline: none;
        }

        /* RESULTS SCREEN */
        .m3d-results-container {
          width: 100%;
          max-width: 720px;
          margin: 40px auto;
          padding: 20px;
          animation: m3dFadeIn 0.3s ease-out;
        }

        .m3d-results-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          padding: 36px 32px;
          box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .m3d-results-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 11.5px;
          font-weight: 800;
          color: #059669;
          background: #ecfdf5;
          border: 1px solid #a7f3d0;
          padding: 5px 12px;
          border-radius: 99px;
          text-transform: uppercase;
          margin-bottom: 12px;
        }

        .m3d-results-title {
          font-size: 22px;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 6px;
        }

        .m3d-results-sub {
          font-size: 14px;
          color: #64748b;
          margin: 0 0 24px;
        }

        .m3d-score-circle-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 140px;
          height: 140px;
          border-radius: 50%;
          background: linear-gradient(135deg, #e0f2fe 0%, #ecfdf5 100%);
          border: 3px solid #0284c7;
          margin-bottom: 24px;
        }

        .m3d-score-num {
          font-size: 38px;
          font-weight: 900;
          color: #0284c7;
          line-height: 1;
        }

        .m3d-score-max {
          font-size: 11px;
          font-weight: 800;
          color: #64748b;
          margin-top: 2px;
        }

        .m3d-score-tag {
          font-size: 14px;
          font-weight: 700;
          color: #047857;
          margin-bottom: 24px;
          max-width: 500px;
          line-height: 1.45;
        }

        .m3d-stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          width: 100%;
          margin-bottom: 28px;
        }

        @media (max-width: 600px) {
          .m3d-stats-grid {
            grid-template-columns: 1fr;
          }
        }

        .m3d-stat-box {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 14px 10px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .m3d-stat-label {
          font-size: 12px;
          font-weight: 700;
          color: #64748b;
        }

        .m3d-stat-val {
          font-size: 17px;
          font-weight: 900;
        }

        .m3d-stat-note {
          font-size: 11px;
          color: #94a3b8;
        }

        .m3d-results-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          justify-content: center;
        }

        .m3d-btn-action {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 22px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }

        .m3d-btn-action.primary {
          background: #0284c7;
          border: none;
          color: #ffffff;
        }

        .m3d-btn-action.primary:hover {
          background: #0369a1;
          transform: translateY(-1px);
        }

        .m3d-btn-action.secondary {
          background: #ffffff;
          border: 1px solid #cbd5e1;
          color: #334155;
        }

        .m3d-btn-action.secondary:hover {
          background: #f1f5f9;
          color: #0f172a;
        }
      `;
      document.head.appendChild(styleEl);
    },

    currentLessonId: 'bai_6',
    currentStationIndex: 0,
    activeTab: 'typein', // 'typein' | 'quiz' | 'trueFalse'
    answersState: {}, // Stores user answers & score per station
    rootEl: null,
    onBackCallback: null,

    init(lessonId, rootEl, onBack) {
      this.injectStyles();
      // Normalize lesson id
      let lid = lessonId || 'bai_6';
      if (lid === 'all' || !MODEL_EXAM_DATA[lid]) {
        lid = 'bai_6';
      }
      this.currentLessonId = lid;
      this.currentStationIndex = 0;
      this.activeTab = 'typein';
      this.rootEl = rootEl;
      this.onBackCallback = onBack;
      this.initLessonState(this.currentLessonId);
      this.render();
    },

    initLessonState(lessonId) {
      if (!this.answersState[lessonId]) {
        const stations = MODEL_EXAM_DATA[lessonId] || [];
        this.answersState[lessonId] = stations.map(() => ({
          typein: { answered: false, value: '', isCorrect: false, showHint: false },
          quiz: { answered: false, selectedIndex: -1, isCorrect: false },
          trueFalse: { answered: false, userChoices: { a: null, b: null, c: null, d: null }, score: 0, maxScore: 1.0, correctCount: 0 }
        }));
      }
    },

    switchLesson(lessonId) {
      if (this.currentLessonId === lessonId) return;
      this.currentLessonId = lessonId;
      this.currentStationIndex = 0;
      this.activeTab = 'typein';
      this.initLessonState(lessonId);
      this.render();
    },

    jumpToStation(index) {
      const stations = MODEL_EXAM_DATA[this.currentLessonId] || [];
      if (index >= 0 && index < stations.length) {
        this.currentStationIndex = index;
        this.render();
      }
    },

    nextStation() {
      const stations = MODEL_EXAM_DATA[this.currentLessonId] || [];
      if (this.currentStationIndex < stations.length - 1) {
        this.currentStationIndex++;
        this.render();
      } else {
        this.finishExam();
      }
    },

    prevStation() {
      if (this.currentStationIndex > 0) {
        this.currentStationIndex--;
        this.render();
      }
    },

    setTab(tab) {
      this.activeTab = tab;
      this.render();
    },

    // Fuzzy string matching for Type-in
    normalizeStr(s) {
      return (s || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/[^a-z0-9]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    },

    checkTypeinAnswer(userVal) {
      const station = this.getStation();
      const state = this.getStationState().typein;
      if (!userVal || !userVal.trim()) return;

      const normUser = this.normalizeStr(userVal);
      const accepted = (station.typein.accepted || [station.typein.target]).map(a => this.normalizeStr(a));
      
      const isCorrect = accepted.some(acc => {
        if (normUser === acc) return true;
        // Check partial inclusion if phrase length > 6
        if (acc.length >= 6 && (normUser.includes(acc) || acc.includes(normUser))) return true;
        return false;
      });

      state.answered = true;
      state.value = userVal;
      state.isCorrect = isCorrect;
      this.render();
    },

    selectQuizOption(optIdx) {
      const station = this.getStation();
      const state = this.getStationState().quiz;
      if (state.answered) return; // Prevent changing after answered

      state.answered = true;
      state.selectedIndex = optIdx;
      state.isCorrect = (optIdx === station.quiz.correct);
      this.render();
    },

    selectTrueFalseChoice(id, val) {
      const state = this.getStationState().trueFalse;
      if (state.answered) return;
      state.userChoices[id] = val;
      this.render();
    },

    gradeTrueFalse() {
      const station = this.getStation();
      const state = this.getStationState().trueFalse;
      const choices = state.userChoices;

      // Check all 4 answered
      const allSelected = ['a', 'b', 'c', 'd'].every(k => choices[k] !== null);
      if (!allSelected) {
        alert('Vui lòng chọn Đúng hoặc Sai cho cả 4 ý (a, b, c, d) trước khi chấm điểm.');
        return;
      }

      let correctCount = 0;
      station.trueFalse.statements.forEach(st => {
        if (choices[st.id] === st.isTrue) {
          correctCount++;
        }
      });

      // MOET 2025 grading scale:
      // 1 ý đúng = 0.1 đ; 2 ý đúng = 0.25 đ; 3 ý đúng = 0.5 đ; 4 ý đúng = 1.0 đ
      let earned = 0;
      if (correctCount === 1) earned = 0.1;
      else if (correctCount === 2) earned = 0.25;
      else if (correctCount === 3) earned = 0.5;
      else if (correctCount === 4) earned = 1.0;

      state.answered = true;
      state.correctCount = correctCount;
      state.score = earned;
      this.render();
    },

    toggleHint() {
      const state = this.getStationState().typein;
      state.showHint = !state.showHint;
      this.render();
    },

    getStation() {
      const stations = MODEL_EXAM_DATA[this.currentLessonId] || [];
      return stations[this.currentStationIndex] || stations[0];
    },

    getStationState() {
      this.initLessonState(this.currentLessonId);
      return this.answersState[this.currentLessonId][this.currentStationIndex];
    },

    getLessonTitle(lessonId) {
      if (lessonId === 'bai_6') return 'Bài 6: Cách mạng tháng Tám năm 1945';
      if (lessonId === 'bai_7') return 'Bài 7: Kháng chiến chống Pháp (1945 - 1954)';
      if (lessonId === 'bai_8') return 'Bài 8: Kháng chiến chống Mỹ (1954 - 1975)';
      return 'Chủ đề Lịch sử 12';
    },

    calculateOverallStats(lessonId) {
      const list = this.answersState[lessonId] || [];
      let totalQuestions = list.length * 3;
      let answeredCount = 0;
      let typeinCorrect = 0;
      let quizCorrect = 0;
      let tfPoints = 0;
      let tfMax = list.length * 1.0;

      list.forEach(st => {
        if (st.typein.answered) {
          answeredCount++;
          if (st.typein.isCorrect) typeinCorrect++;
        }
        if (st.quiz.answered) {
          answeredCount++;
          if (st.quiz.isCorrect) quizCorrect++;
        }
        if (st.trueFalse.answered) {
          answeredCount++;
          tfPoints += st.trueFalse.score;
        }
      });

      return {
        totalStations: list.length,
        totalQuestions,
        answeredCount,
        typeinCorrect,
        quizCorrect,
        tfPoints,
        tfMax
      };
    },

    finishExam() {
      const stats = this.calculateOverallStats(this.currentLessonId);
      const totalEarned = (stats.typeinCorrect * 1.0) + (stats.quizCorrect * 1.0) + stats.tfPoints;
      const maxPossible = (stats.totalStations * 3.0); // 1.0 per typein, 1.0 per quiz, 1.0 per TF
      const scoreOn10 = ((totalEarned / maxPossible) * 10).toFixed(1);

      let evaluation = 'Xuất sắc! Bạn đã khắc sâu kiến thức qua 9 mô hình Loci 3D.';
      if (scoreOn10 < 5.0) {
        evaluation = 'Cần ôn luyện thêm các trạm Loci để nắm chắc mốc sự kiện.';
      } else if (scoreOn10 < 8.0) {
        evaluation = 'Khá tốt! Bạn đã ghi nhớ được phần lớn các hình mẫu trực quan.';
      }

      this.rootEl.innerHTML = `
        <div class="m3d-results-container">
          <div class="m3d-results-card">
            <div class="m3d-results-badge">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              HOÀN THÀNH PHIÊN KIỂM TRA MÔ HÌNH 3D
            </div>
            
            <h2 class="m3d-results-title">${this.getLessonTitle(this.currentLessonId)}</h2>
            <p class="m3d-results-sub">Tổng kết tiến trình quan sát hiện vật không gian 3D & giải bài tập Loci</p>

            <div class="m3d-score-circle-box">
              <div class="m3d-score-num">${scoreOn10}</div>
              <div class="m3d-score-max">/ 10 ĐIỂM</div>
              <div class="m3d-score-tag">${evaluation}</div>
            </div>

            <div class="m3d-stats-grid">
              <div class="m3d-stat-box">
                <span class="m3d-stat-label">Gõ đáp án (Type-in)</span>
                <span class="m3d-stat-val" style="color:#0284c7;">${stats.typeinCorrect} / ${stats.totalStations} đúng</span>
                <span class="m3d-stat-note">Nhận diện chi tiết mô hình</span>
              </div>
              <div class="m3d-stat-box">
                <span class="m3d-stat-label">Trắc nghiệm 4 lựa chọn</span>
                <span class="m3d-stat-val" style="color:#10b981;">${stats.quizCorrect} / ${stats.totalStations} đúng</span>
                <span class="m3d-stat-note">Phản xạ bối cảnh lịch sử</span>
              </div>
              <div class="m3d-stat-box">
                <span class="m3d-stat-label">Đúng / Sai (Bộ GD&ĐT 2025)</span>
                <span class="m3d-stat-val" style="color:#f59e0b;">${stats.tfPoints.toFixed(2)} / ${stats.tfMax.toFixed(1)} đ</span>
                <span class="m3d-stat-note">Đánh giá 4 mệnh đề tư duy</span>
              </div>
            </div>

            <div class="m3d-results-actions">
              <button class="m3d-btn-action primary" id="m3d-btn-restart">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"></polyline><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path></svg>
                Kiểm tra lại bài này
              </button>
              <button class="m3d-btn-action secondary" id="m3d-btn-home">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                Quay lại Trang chủ Ôn tập
              </button>
            </div>
          </div>
        </div>
      `;

      // Event listeners
      document.getElementById('m3d-btn-restart').onclick = () => {
        delete this.answersState[this.currentLessonId];
        this.currentStationIndex = 0;
        this.activeTab = 'typein';
        this.initLessonState(this.currentLessonId);
        this.render();
      };

      document.getElementById('m3d-btn-home').onclick = () => {
        if (typeof this.onBackCallback === 'function') {
          this.onBackCallback();
        }
      };
    },

    render() {
      const station = this.getStation();
      const state = this.getStationState();
      const stations = MODEL_EXAM_DATA[this.currentLessonId] || [];
      const totalStations = stations.length;

      // Status of stations
      const stationStatuses = (this.answersState[this.currentLessonId] || []).map(st => {
        const anyAnswered = st.typein.answered || st.quiz.answered || st.trueFalse.answered;
        const allAnswered = st.typein.answered && st.quiz.answered && st.trueFalse.answered;
        return { anyAnswered, allAnswered };
      });

      this.rootEl.innerHTML = `
        <div class="m3d-exam-wrapper">
          <!-- TOP BAR: BREADCRUMB, LESSON TABS, BACK BUTTON -->
          <div class="m3d-top-header">
            <div class="m3d-header-left">
              <button class="m3d-back-btn" id="m3d-back-btn" title="Quay lại danh mục Ôn tập">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                <span>Thoát kiểm tra</span>
              </button>
              <div class="m3d-header-title-box">
                <div class="m3d-header-badge">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                  KHÔNG GIAN KIỂM TRA 3D
                </div>
                <h1 class="m3d-main-title">Kiểm tra Mô hình 3D Lịch sử</h1>
              </div>
            </div>

            <!-- CHỌN BÀI HỌC (BÀI 6, BÀI 7, BÀI 8) -->
            <div class="m3d-lesson-pills">
              <button class="m3d-lesson-pill ${this.currentLessonId === 'bai_6' ? 'active' : ''}" data-lesson="bai_6">
                Bài 6: CMT8 1945
              </button>
              <button class="m3d-lesson-pill ${this.currentLessonId === 'bai_7' ? 'active' : ''}" data-lesson="bai_7">
                Bài 7: KC Pháp 1945-1954
              </button>
              <button class="m3d-lesson-pill ${this.currentLessonId === 'bai_8' ? 'active' : ''}" data-lesson="bai_8">
                Bài 8: KC Mỹ 1954-1975
              </button>
            </div>
          </div>

          <!-- STATION NAVIGATION STRIP -->
          <div class="m3d-station-strip">
            <div class="m3d-station-strip-inner">
              ${stations.map((st, i) => {
                const isActive = (i === this.currentStationIndex);
                const sStat = stationStatuses[i] || {};
                let statusClass = '';
                if (isActive) statusClass = 'current';
                else if (sStat.allAnswered) statusClass = 'completed';
                else if (sStat.anyAnswered) statusClass = 'partial';

                return `
                  <button class="m3d-station-btn ${statusClass}" data-station="${i}" title="${st.stationBadge}: ${st.title}">
                    <span class="m3d-st-num">Trạm ${st.order}</span>
                    <span class="m3d-st-status">
                      ${sStat.allAnswered ? '✓ 3/3' : sStat.anyAnswered ? '● Đang làm' : '○'}
                    </span>
                  </button>
                `;
              }).join('')}
            </div>
          </div>

          <!-- MAIN 2-COLUMN WORKSPACE -->
          <div class="m3d-workspace-grid">
            
            <!-- LEFT COLUMN: 3D MODEL VIEWER & LOCI MNEMONIC CARD -->
            <div class="m3d-model-column">
              <div class="m3d-card m3d-viewer-card">
                <div class="m3d-viewer-header">
                  <div class="m3d-badge-station">${station.stationBadge}</div>
                  <h2 class="m3d-station-title">${station.title}</h2>
                </div>

                <!-- 3D MODEL VIEWER -->
                <div class="m3d-viewer-stage">
                  <model-viewer
                    id="loci-exam-model-viewer"
                    src="${station.modelUrl}"
                    poster="${station.poster || ''}"
                    alt="${station.title}"
                    camera-controls
                    auto-rotate
                    rotation-per-second="25deg"
                    shadow-intensity="1.2"
                    exposure="1.0"
                    loading="lazy"
                    camera-orbit="45deg 75deg 105%"
                    style="width: 100%; height: 420px; background: radial-gradient(circle, #f8fafc 0%, #e2e8f0 100%); border-radius: 14px;"
                  >
                    <div slot="poster" class="m3d-poster-slot">
                      <div class="m3d-loading-spinner"></div>
                      <span>Đang tải mô hình 3D tương tác...</span>
                    </div>
                  </model-viewer>

                  <!-- 3D VIEWER CONTROLS FLOATING BAR -->
                  <div class="m3d-viewer-toolbar">
                    <button class="m3d-tool-btn" id="m3d-btn-toggle-rotate" title="Bật/Tắt xoay tự động">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
                      <span id="m3d-rotate-text">Tạm dừng xoay</span>
                    </button>
                    <button class="m3d-tool-btn" id="m3d-btn-reset-cam" title="Đặt lại góc quan sát ban đầu">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg>
                      <span>Góc nhìn chuẩn</span>
                    </button>
                    <span class="m3d-viewer-hint">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                      Giữ chuột / vuốt để xoay 360° quan sát
                    </span>
                  </div>
                </div>

                <!-- LOCI MNEMONIC & CORE KNOWLEDGE CARD -->
                <div class="m3d-loci-knowledge">
                  <div class="m3d-loci-head">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0284c7" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
                    <span>Cung điện Ký ức Loci · Bối cảnh lịch sử</span>
                  </div>
                  <p class="m3d-summary-p">${station.summary}</p>

                  <div class="m3d-mnemonic-box">
                    <div class="m3d-mnemonic-tag">Mẹo ghi nhớ Loci:</div>
                    <div class="m3d-mnemonic-text">${station.mnemonic}</div>
                  </div>

                  <div class="m3d-keypoints-box">
                    <div class="m3d-keypoints-title">3 Điểm cốt lõi cần nhớ:</div>
                    <ul class="m3d-keypoints-list">
                      ${station.keyPoints.map(kp => `<li>${kp}</li>`).join('')}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <!-- RIGHT COLUMN: TESTING CARD WITH 3 FORMAT TABS -->
            <div class="m3d-exam-column">
              <div class="m3d-card m3d-exam-card">
                
                <!-- FORMAT TAB SELECTOR -->
                <div class="m3d-tabs-nav">
                  <button class="m3d-tab-btn ${this.activeTab === 'typein' ? 'active' : ''}" data-tab="typein">
                    <span class="m3d-tab-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 7 4 4 20 4 20 7"></polyline><line x1="9" y1="20" x2="15" y2="20"></line><line x1="12" y1="4" x2="12" y2="20"></line></svg>
                    </span>
                    <span class="m3d-tab-label">Gõ đáp án</span>
                    ${state.typein.answered ? (state.typein.isCorrect ? '<span class="m3d-badge-check">✓</span>' : '<span class="m3d-badge-wrong">✕</span>') : ''}
                  </button>

                  <button class="m3d-tab-btn ${this.activeTab === 'quiz' ? 'active' : ''}" data-tab="quiz">
                    <span class="m3d-tab-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="9.5" y1="6" x2="20.5" y2="6"></line><line x1="9.5" y1="12" x2="20.5" y2="12"></line><line x1="9.5" y1="18" x2="20.5" y2="18"></line><polyline points="3.5 6 4.8 7.3 7 5"></polyline></svg>
                    </span>
                    <span class="m3d-tab-label">Trắc nghiệm</span>
                    ${state.quiz.answered ? (state.quiz.isCorrect ? '<span class="m3d-badge-check">✓</span>' : '<span class="m3d-badge-wrong">✕</span>') : ''}
                  </button>

                  <button class="m3d-tab-btn ${this.activeTab === 'trueFalse' ? 'active' : ''}" data-tab="trueFalse">
                    <span class="m3d-tab-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
                    </span>
                    <span class="m3d-tab-label">Đúng / Sai 2025</span>
                    ${state.trueFalse.answered ? `<span class="m3d-badge-score">${state.trueFalse.score}đ</span>` : ''}
                  </button>
                </div>

                <!-- TAB BODY CONTENT -->
                <div class="m3d-tab-content">
                  
                  <!-- TAB 1: GÕ ĐÁP ÁN (TYPE-IN) -->
                  ${this.activeTab === 'typein' ? `
                    <div class="m3d-pane-typein">
                      <div class="m3d-pane-header">
                        <span class="m3d-pane-tag">Hình thức 1 · Điền trực tiếp</span>
                        <div class="m3d-pane-status">
                          ${state.typein.answered ? (state.typein.isCorrect ? '<span class="tag-correct">Chính xác</span>' : '<span class="tag-wrong">Chưa chính xác</span>') : '<span class="tag-pending">Chưa hoàn thành</span>'}
                        </div>
                      </div>

                      <div class="m3d-question-prompt">
                        ${station.typein.prompt}
                      </div>

                      <div class="m3d-input-group">
                        <input
                          type="text"
                          id="m3d-typein-input"
                          class="m3d-text-field ${state.typein.answered ? (state.typein.isCorrect ? 'valid' : 'invalid') : ''}"
                          placeholder="Nhập câu trả lời hoặc số liệu lịch sử..."
                          value="${state.typein.value || ''}"
                          ${state.typein.answered ? 'readonly' : ''}
                        />
                        <button class="m3d-btn-submit" id="m3d-btn-submit-typein" ${state.typein.answered ? 'disabled' : ''}>
                          Kiểm tra
                        </button>
                      </div>

                      <!-- HINT ACCORDION -->
                      <div class="m3d-hint-row">
                        <button class="m3d-btn-hint" id="m3d-btn-toggle-hint">
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18h6"></path><path d="M10 22h4"></path><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5.76.76 1.23 1.52 1.41 2.5"></path></svg>
                          <span>${state.typein.showHint ? 'Ẩn gợi ý' : 'Xem gợi ý ghi nhớ'}</span>
                        </button>
                      </div>

                      ${state.typein.showHint ? `
                        <div class="m3d-hint-box">
                          <strong>Gợi ý từ Loci:</strong> ${station.typein.hint}
                        </div>
                      ` : ''}

                      <!-- FEEDBACK BOX -->
                      ${state.typein.answered ? `
                        <div class="m3d-feedback-box ${state.typein.isCorrect ? 'correct' : 'wrong'}">
                          <div class="m3d-fb-title">
                            ${state.typein.isCorrect ? 'Chúc mừng! Bạn đã trả lời hoàn toàn chính xác.' : 'Chưa đúng! Đáp án chuẩn lịch sử:'}
                          </div>
                          <div class="m3d-fb-answer">
                            <strong>Đáp án chuẩn:</strong> ${station.typein.target}
                          </div>
                          <div class="m3d-fb-explanation">
                            <strong>Giải thích từ SGK:</strong> ${station.typein.explanation}
                          </div>
                        </div>
                      ` : ''}
                    </div>
                  ` : ''}

                  <!-- TAB 2: TRẮC NGHIỆM 4 PHƯƠNG ÁN (QUIZ) -->
                  ${this.activeTab === 'quiz' ? `
                    <div class="m3d-pane-quiz">
                      <div class="m3d-pane-header">
                        <span class="m3d-pane-tag">Hình thức 2 · Trắc nghiệm 4 lựa chọn</span>
                        <div class="m3d-pane-status">
                          ${state.quiz.answered ? (state.quiz.isCorrect ? '<span class="tag-correct">Chính xác</span>' : '<span class="tag-wrong">Chưa chính xác</span>') : '<span class="tag-pending">Chưa hoàn thành</span>'}
                        </div>
                      </div>

                      <div class="m3d-question-prompt">
                        ${station.quiz.question}
                      </div>

                      <div class="m3d-quiz-options">
                        ${station.quiz.options.map((opt, oIdx) => {
                          const isSelected = (state.quiz.selectedIndex === oIdx);
                          const isTarget = (station.quiz.correct === oIdx);
                          let optClass = '';
                          if (state.quiz.answered) {
                            if (isTarget) optClass = 'opt-correct';
                            else if (isSelected && !isTarget) optClass = 'opt-wrong';
                            else optClass = 'opt-dimmed';
                          } else if (isSelected) {
                            optClass = 'opt-selected';
                          }

                          return `
                            <button class="m3d-quiz-opt ${optClass}" data-opt="${oIdx}" ${state.quiz.answered ? 'disabled' : ''}>
                              <span class="m3d-opt-letter">${String.fromCharCode(65 + oIdx)}</span>
                              <span class="m3d-opt-text">${opt.replace(/^[A-D]\.\s*/, '')}</span>
                              ${state.quiz.answered && isTarget ? '<span class="m3d-opt-check">✓</span>' : ''}
                              ${state.quiz.answered && isSelected && !isTarget ? '<span class="m3d-opt-cross">✕</span>' : ''}
                            </button>
                          `;
                        }).join('')}
                      </div>

                      <!-- FEEDBACK FOR QUIZ -->
                      ${state.quiz.answered ? `
                        <div class="m3d-feedback-box ${state.quiz.isCorrect ? 'correct' : 'wrong'}">
                          <div class="m3d-fb-title">
                            ${state.quiz.isCorrect ? 'Lựa chọn xuất sắc!' : 'Giải thích phương án đúng:'}
                          </div>
                          <div class="m3d-fb-explanation">
                            ${station.quiz.explanation}
                          </div>
                        </div>
                      ` : ''}
                    </div>
                  ` : ''}

                  <!-- TAB 3: ĐÚNG / SAI CHUẨN BỘ GD&ĐT 2025 -->
                  ${this.activeTab === 'trueFalse' ? `
                    <div class="m3d-pane-tf">
                      <div class="m3d-pane-header">
                        <span class="m3d-pane-tag">Hình thức 3 · Đúng / Sai chuẩn Bộ GD&ĐT 2025</span>
                        <div class="m3d-pane-status">
                          ${state.trueFalse.answered ? `<span class="tag-score">Đạt ${state.trueFalse.score} / 1.0 điểm (${state.trueFalse.correctCount}/4 ý)</span>` : '<span class="tag-pending">Chưa chấm điểm</span>'}
                        </div>
                      </div>

                      <div class="m3d-tf-context">
                        <strong>Bối cảnh trạm:</strong> ${station.trueFalse.context}
                      </div>

                      <div class="m3d-tf-table">
                        <div class="m3d-tf-table-head">
                          <span class="col-stmt">Mệnh đề lịch sử</span>
                          <span class="col-choice">Đúng</span>
                          <span class="col-choice">Sai</span>
                        </div>

                        ${station.trueFalse.statements.map((st) => {
                          const userChoice = state.trueFalse.userChoices[st.id];
                          const isGraded = state.trueFalse.answered;
                          const isUserCorrect = (userChoice === st.isTrue);

                          return `
                            <div class="m3d-tf-row ${isGraded ? (isUserCorrect ? 'row-correct' : 'row-wrong') : ''}">
                              <div class="m3d-tf-stmt-text">
                                <span class="m3d-tf-letter">${st.id})</span>
                                <span>${st.text}</span>
                              </div>
                              <div class="m3d-tf-btn-col">
                                <button
                                  class="m3d-choice-btn true-btn ${userChoice === true ? 'selected' : ''} ${isGraded && st.isTrue === true ? 'target-true' : ''}"
                                  data-stmt="${st.id}"
                                  data-choice="true"
                                  ${isGraded ? 'disabled' : ''}
                                >
                                  Đ
                                </button>
                              </div>
                              <div class="m3d-tf-btn-col">
                                <button
                                  class="m3d-choice-btn false-btn ${userChoice === false ? 'selected' : ''} ${isGraded && st.isTrue === false ? 'target-false' : ''}"
                                  data-stmt="${st.id}"
                                  data-choice="false"
                                  ${isGraded ? 'disabled' : ''}
                                >
                                  S
                                </button>
                              </div>
                            </div>
                            ${isGraded ? `
                              <div class="m3d-tf-sub-explain ${isUserCorrect ? 'exp-correct' : 'exp-wrong'}">
                                <strong>${st.id.toUpperCase()} là ${st.isTrue ? 'ĐÚNG' : 'SAI'}:</strong> ${st.explain}
                              </div>
                            ` : ''}
                          `;
                        }).join('')}
                      </div>

                      <!-- ACTION & GRADING -->
                      <div class="m3d-tf-bottom-bar">
                        ${!state.trueFalse.answered ? `
                          <button class="m3d-btn-grade-tf" id="m3d-btn-grade-tf">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            Chấm điểm Đúng / Sai (Cả 4 ý)
                          </button>
                        ` : `
                          <div class="m3d-moet-scale-note">
                            <strong>Thang điểm chuẩn 2025:</strong> 1 ý đúng = 0.1đ · 2 ý đúng = 0.25đ · 3 ý đúng = 0.5đ · 4 ý đúng = 1.0đ
                          </div>
                        `}
                      </div>
                    </div>
                  ` : ''}

                </div>

                <!-- STATION FOOTER NAVIGATION -->
                <div class="m3d-footer-nav">
                  <button class="m3d-nav-btn" id="m3d-btn-prev" ${this.currentStationIndex === 0 ? 'disabled' : ''}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M15 18l-6-6 6-6"/></svg>
                    <span>Trạm trước</span>
                  </button>

                  <div class="m3d-nav-quick">
                    <select id="m3d-select-station" class="m3d-dropdown-station">
                      ${stations.map((st, i) => `
                        <option value="${i}" ${i === this.currentStationIndex ? 'selected' : ''}>
                          Trạm ${st.order}: ${st.title.length > 30 ? st.title.substring(0, 30) + '...' : st.title}
                        </option>
                      `).join('')}
                    </select>
                  </div>

                  ${this.currentStationIndex < totalStations - 1 ? `
                    <button class="m3d-nav-btn next" id="m3d-btn-next">
                      <span>Trạm tiếp theo</span>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M9 18l6-6-6-6"/></svg>
                    </button>
                  ` : `
                    <button class="m3d-nav-btn finish" id="m3d-btn-finish">
                      <span>Hoàn thành & Xem kết quả</span>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </button>
                  `}
                </div>

              </div>
            </div>

          </div>
        </div>
      `;

      this.bindEvents();
    },

    bindEvents() {
      // Back button
      const btnBack = document.getElementById('m3d-back-btn');
      if (btnBack) {
        btnBack.onclick = () => {
          if (typeof this.onBackCallback === 'function') {
            this.onBackCallback();
          }
        };
      }

      // Lesson switcher pills
      this.rootEl.querySelectorAll('.m3d-lesson-pill').forEach(btn => {
        btn.onclick = () => {
          this.switchLesson(btn.dataset.lesson);
        };
      });

      // Station pills in strip
      this.rootEl.querySelectorAll('.m3d-station-btn').forEach(btn => {
        btn.onclick = () => {
          this.jumpToStation(parseInt(btn.dataset.station, 10));
        };
      });

      // Quick jump dropdown
      const selStation = document.getElementById('m3d-select-station');
      if (selStation) {
        selStation.onchange = (e) => {
          this.jumpToStation(parseInt(e.target.value, 10));
        };
      }

      // Prev / Next / Finish
      const btnPrev = document.getElementById('m3d-btn-prev');
      if (btnPrev) {
        btnPrev.onclick = () => this.prevStation();
      }
      const btnNext = document.getElementById('m3d-btn-next');
      if (btnNext) {
        btnNext.onclick = () => this.nextStation();
      }
      const btnFinish = document.getElementById('m3d-btn-finish');
      if (btnFinish) {
        btnFinish.onclick = () => this.finishExam();
      }

      // Tabs
      this.rootEl.querySelectorAll('.m3d-tab-btn').forEach(btn => {
        btn.onclick = () => {
          this.setTab(btn.dataset.tab);
        };
      });

      // 3D Model viewer toolbar
      const mv = document.getElementById('loci-exam-model-viewer');
      const btnRotate = document.getElementById('m3d-btn-toggle-rotate');
      const txtRotate = document.getElementById('m3d-rotate-text');
      if (mv && btnRotate) {
        btnRotate.onclick = () => {
          if (mv.autoRotate) {
            mv.autoRotate = false;
            if (txtRotate) txtRotate.textContent = 'Bật xoay';
          } else {
            mv.autoRotate = true;
            if (txtRotate) txtRotate.textContent = 'Tạm dừng xoay';
          }
        };
      }

      const btnResetCam = document.getElementById('m3d-btn-reset-cam');
      if (mv && btnResetCam) {
        btnResetCam.onclick = () => {
          mv.cameraOrbit = '45deg 75deg 105%';
          mv.cameraTarget = 'auto auto auto';
          mv.fieldOfView = 'auto';
        };
      }

      // Tab 1: Type-in input & submit
      const inputTypein = document.getElementById('m3d-typein-input');
      const btnSubmitTypein = document.getElementById('m3d-btn-submit-typein');
      if (inputTypein && btnSubmitTypein) {
        btnSubmitTypein.onclick = () => {
          this.checkTypeinAnswer(inputTypein.value);
        };
        inputTypein.onkeydown = (e) => {
          if (e.key === 'Enter') {
            this.checkTypeinAnswer(inputTypein.value);
          }
        };
      }

      // Hint toggle
      const btnToggleHint = document.getElementById('m3d-btn-toggle-hint');
      if (btnToggleHint) {
        btnToggleHint.onclick = () => {
          this.toggleHint();
        };
      }

      // Tab 2: Quiz option select
      this.rootEl.querySelectorAll('.m3d-quiz-opt').forEach(btn => {
        btn.onclick = () => {
          this.selectQuizOption(parseInt(btn.dataset.opt, 10));
        };
      });

      // Tab 3: True / False radio choice select
      this.rootEl.querySelectorAll('.m3d-choice-btn').forEach(btn => {
        btn.onclick = () => {
          const stmtId = btn.dataset.stmt;
          const choice = (btn.dataset.choice === 'true');
          this.selectTrueFalseChoice(stmtId, choice);
        };
      });

      // Tab 3: Grade True/False
      const btnGradeTF = document.getElementById('m3d-btn-grade-tf');
      if (btnGradeTF) {
        btnGradeTF.onclick = () => {
          this.gradeTrueFalse();
        };
      }
    }
  };

  // Expose LociModel3DExam globally
  global.LociModel3DExam = {
    start: function (lessonId, rootContainer, onBack) {
      LociModel3DExam.init(lessonId, rootContainer, onBack);
    }
  };

})(typeof window !== 'undefined' ? window : this);
