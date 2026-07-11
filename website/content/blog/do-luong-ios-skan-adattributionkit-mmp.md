---
title: "Đo lường trên iOS sau ATT: SKAN, AdAttributionKit và MMP"
category: "Marketing"
description: Từ khi Apple bật ATT, đo lường trên iOS thành một bài toán riêng đầy rối rắm. Đây là cách hiểu SKAN, AdAttributionKit và vai trò của MMP cho người làm UA.
pubDate: 2026-05-11T10:15
cover: https://images.pexels.com/photos/28678083/pexels-photo-28678083.jpeg?auto=compress&cs=tinysrgb&w=1200
tags:
  - Marketing
  - UA
  - Đo lường
draft: false
---

Có một cột mốc chia nghề UA thành trước và sau, đó là lúc Apple tung ATT. Từ đó, đo lường trên iOS không còn là chuyện hiển nhiên nữa mà thành một bài toán riêng, rối và luôn thay đổi. Nếu bạn làm UA cho app, đây là phần bắt buộc phải hiểu, dù nó khô.

## ATT đã đổi luật chơi thế nào

ATT, viết tắt của App Tracking Transparency, là cái hộp thoại xin phép theo dõi mà iPhone hiện lên khi bạn mở app. Phần lớn người dùng bấm không cho phép. Khi họ từ chối, app không lấy được mã định danh thiết bị để nối hành vi của một người xuyên các app.

Hệ quả là cách đo cũ, kiểu biết chính xác người này bấm quảng cáo kia rồi cài rồi chi tiền, gần như sập trên iOS. Người làm UA mất đi thứ họ từng coi là hiển nhiên: nhìn thấy đường đi của từng người dùng. Từ đó trở đi, mọi thứ trên iOS phải làm theo kiểu tôn trọng riêng tư, tức là đo ở mức gộp, không đo từng cá nhân.

## SKAN, cách Apple cho bạn đo mà không lộ người dùng

Để bù lại, Apple đưa ra SKAdNetwork, dân trong nghề gọi tắt là SKAN. Ý tưởng là nền tảng vẫn cho bạn biết quảng cáo nào mang lại cài đặt và giá trị, nhưng ở dạng gộp và có độ trễ, để không lần ra được cá nhân nào.

SKAN có một thứ gọi là conversion value, một khoảng giá trị nhỏ mà bạn mã hóa hành vi sớm của người dùng vào đó, ví dụ họ có chi tiền trong ngày đầu không. Bản SKAN 4, ra cuối 2022, cho nhiều mốc đo và linh hoạt hơn các bản cũ. Cái khó là bạn chỉ có một không gian rất hẹp để nhét thông tin, nên phải thiết kế sơ đồ conversion value cho khôn. Đây là một kỹ năng riêng, và thú thật nhiều đội tới giờ vẫn chưa khai thác hết SKAN 4.

## AdAttributionKit, thế hệ tiếp theo

Tại WWDC 2024, Apple giới thiệu AdAttributionKit, gọi tắt AAK, được xem là thế hệ kế nhiệm của SKAN, ra cùng iOS 17.4. AAK mở rộng mô hình của SKAN: hỗ trợ đo lại tương tác với người dùng cũ, phủ được nhiều kho ứng dụng, và cho tùy chỉnh cửa sổ đo linh hoạt hơn. Bản cập nhật giữa 2025 còn thêm cửa sổ và thời gian chờ tùy chỉnh, cùng khả năng đo re-engagement chi tiết hơn.

Điều cần nhớ cho thực tế: Apple nói AAK và SKAN chạy song song và tương thích, và tới giờ chưa hề công bố ngày khai tử SKAN. Nên nếu bạn chỉ chạy trên App Store, SKAN 4 vẫn hoạt động đầy đủ, không cần hốt hoảng đập đi xây lại. Cứ hiểu AAK là hướng đi của tương lai để chuẩn bị dần, còn SKAN vẫn là công cụ vận hành của hiện tại.

## MMP, người phiên dịch giữa mớ hỗn độn

Giữa một rừng nền tảng, mỗi chỗ một cách báo cáo, một cách đo, thì ai gom lại thành một bức tranh chung? Đó là MMP, mobile measurement partner, những công cụ như AppsFlyer, Adjust hay Singular.

MMP đứng ở giữa, nhận dữ liệu từ các mạng quảng cáo và từ app của bạn, rồi chuẩn hóa lại để bạn nhìn mọi kênh trên cùng một thước đo. Không có MMP, bạn phải tin số mỗi nền tảng tự khai, mà nền tảng nào cũng có xu hướng nhận công về mình. MMP giúp bạn có một nguồn số tương đối trung lập để so kênh với kênh. Với hầu hết đội làm app nghiêm túc, MMP gần như là hạ tầng bắt buộc.

## Sống chung với sự mờ

Điều quan trọng nhất khi làm đo lường iOS thời nay là chấp nhận rằng bạn sẽ không bao giờ thấy rõ như xưa. Số liệu bị gộp, bị trễ, có phần phải suy đoán. Người làm nghề giỏi không phải người đòi số phải sạch tuyệt đối, mà là người ra quyết định tốt trong điều kiện số mờ.

Nghĩa là dựa nhiều hơn vào xu hướng thay vì con số tuyệt đối, dựa vào dữ liệu bên mình như doanh thu thật, kết hợp nhiều nguồn để tam giác hóa ra sự thật. Kỷ nguyên nhìn thấy mọi thứ đã qua. Kỷ nguyên mới là của người biết ra quyết định khôn ngoan dù chỉ thấy lờ mờ.
