---
title: "Khách này thật ra đến từ đâu?"
category: "Marketing"
description: GA4, UTM và bài toán gán nguồn chuyển đổi. Vì sao mọi mô hình attribution đều sai một phần, và làm sao để vẫn ra quyết định đúng dựa trên dữ liệu.
pubDate: 2026-06-21
cover: https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80
tags:
  - Đo lường
  - Dữ liệu
  - Attribution
draft: false
---

"Ông khách này ở đâu ra vậy?" Nghe thì như câu hỏi vớ vẩn, nhưng nó là một trong những bài toán khó nhằn nhất của marketing. Một người có thể lướt thấy quảng cáo của bạn trên mạng xã hội, vài hôm sau gõ Google tìm lại, rồi cả tuần sau bấm vào cái email mới chịu chốt. Vậy công đó tính cho ai? Đây chính là bài toán attribution.

## Sao mà đo cái này khó dữ vậy

Hành trình mua hàng thời nay hiếm khi đi thẳng một mạch. Người ta chạm vào thương hiệu qua đủ kênh, đủ thiết bị, rải ra mấy ngày trời. Điểm chạm nào cũng góp một tay, nhưng công cụ thì hay bắt bạn dồn hết công cho một nguồn duy nhất. Thế nên mới có chuyện hai báo cáo khác nhau cho ra hai câu trả lời chỏi nhau về cùng một chiến dịch.

Hiểu được cái giới hạn này còn quan trọng hơn việc đi săn con số "đúng tuyệt đối", vì nói thật, con số đó không tồn tại. Cái bạn thực sự cần là một thước đo nhất quán, đủ ổn để so sánh và ra quyết định.

## UTM: phần nền không được phép bỏ qua

Trước khi bàn tới mấy mô hình cao siêu, làm cho chắc cái căn bản đã: gắn thẻ **UTM** cho mọi cái link bạn tung ra. UTM là mấy tham số nhỏ thêm vào URL, để công cụ phân tích biết được traffic này đến từ chiến dịch nào, kênh nào, nội dung nào.

Luật sống còn ở đây là một chữ: nhất quán. "facebook", "Facebook" với "fb" sẽ bị đếm thành ba nguồn khác nhau, và thế là báo cáo của bạn nát bét. Thống nhất một quy ước đặt tên, viết nó ra hẳn hoi, rồi bắt cả đội theo cho bằng được. Một hệ thống UTM kỷ luật còn đáng tiền hơn khối công cụ xịn.

## GA4 và chuyện đo theo sự kiện

Công cụ phân tích phổ biến giờ chạy theo kiểu sự kiện: mỗi hành động của người dùng, từ xem trang, bấm nút, tới hoàn tất mua, đều là một sự kiện được ghi lại. Cách này linh hoạt hơn kiểu cũ dựa trên phiên, nhưng đổi lại nó bắt bạn phải tự mình khai báo đâu mới là những sự kiện đáng giá với mình.

Cứ bắt đầu bằng cách liệt kê ra mấy hành động thật sự quan trọng: để lại liên hệ, thêm vào giỏ, mua hàng, đăng ký. Đó là mấy thứ cần bám sát. Phần còn lại chủ yếu là nhiễu thôi. Đo ít mà đo trúng vẫn hơn đo cả đống một cách hời hợt.

## Mấy mô hình attribution, dùng cái nào khi nào

Có vài cách gán công hay gặp. "Lần chạm cuối" thì dồn hết công cho điểm chạm ngay trước khi mua. Đơn giản, nhưng nó phủi sạch mọi công sức ở đầu phễu. "Lần chạm đầu" thì ngược lại. Còn mấy mô hình "tuyến tính" hay "theo thời gian" thì cố chia công ra cho nhiều điểm chạm.

Chẳng cái nào hoàn hảo cả. Quan trọng là chọn lấy một mô hình, hiểu rõ nó thiên lệch chỗ nào, rồi dùng cho nhất quán. Nếu bạn xài lần chạm cuối, nhớ giùm rằng nó luôn đánh giá thấp mấy kênh xây nhận biết như content hay quảng cáo thương hiệu. Đừng vội cắt mấy kênh đó chỉ vì báo cáo bảo chúng "không ra đơn" nhé.

## Đừng để con số nghĩ thay bạn

Cái bẫy to nhất là tin con số một cách mù quáng. Dữ liệu cho bạn manh mối thôi, nó không phải mệnh lệnh. Khi một kênh bị mô hình chấm công thấp, thử tắt nó một thời gian rồi nhìn tổng thể xem có tụt không. Nhiều khi giá trị của một kênh chỉ lộ ra đúng lúc nó biến mất.

Một cách kiểm tra khá lành là đối chiếu cái dữ liệu nói với cái khách nói. Thỉnh thoảng chỉ cần hỏi thẳng "anh chị biết tới bên em qua đâu vậy?" cũng hé lộ ra mấy nguồn mà công cụ không bao giờ thấy được, kiểu như được người quen rỉ tai nhau chẳng hạn.

Cứ làm chắc phần móng trước (UTM gọn gàng, theo dõi đúng sự kiện đáng quan tâm) rồi hẵng lao vào cãi nhau chuyện mô hình. Chấp nhận rằng attribution mãi mãi chỉ là ước lượng, chọn một thước đo ổn định, rồi dùng nó để so tương đối giữa các lựa chọn. Đích cuối đâu phải một con số đẹp để khoe, mà là tháng này bạn rót tiền khôn hơn tháng trước một chút.
