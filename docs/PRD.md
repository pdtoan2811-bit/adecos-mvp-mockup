# Tài liệu Yêu cầu Sản phẩm (PRD) - Adecos MVP

## 1. Giới thiệu
**Adecos MVP** là một nền tảng tiên tiến hỗ trợ bởi AI, được thiết kế để hỗ trợ các nhà tiếp thị kỹ thuật số và nhà nghiên cứu tự động hóa và tối ưu hóa quy trình làm việc của họ. Nền tảng tích hợp hệ thống AI đa tác nhân để cung cấp khả năng nghiên cứu sâu, tạo nội dung và thông tin chiến lược, được bao gói trong một ứng dụng web hiện đại, đáp ứng nhanh.

### Mục đích
Cung cấp một không gian làm việc thống nhất nơi người dùng có thể quản lý các dự án quảng cáo, thực hiện nghiên cứu thị trường chuyên sâu và tương tác với các tác nhân AI chuyên biệt để đẩy nhanh quá trình ra quyết định.

### Phạm vi
MVP bao gồm giao diện hội thoại AI, bảng điều khiển (dashboard) cho các chỉ số, công cụ quản lý dự án, theo dõi chiến dịch quảng cáo và khả năng nghiên cứu sâu. Hệ thống dựa trên backend Python FastAPI và frontend React/Vite.

### Định nghĩa
- **Agent (Tác nhân)**: Mô-đun AI chuyên biệt (ví dụ: Nhà phân tích, Người kể chuyện) thực hiện các nhiệm vụ cụ thể.
- **Deep Research (Nghiên cứu sâu)**: Quá trình chạy ngầm dài hạn để thu thập và tổng hợp dữ liệu.
- **Stream (Luồng)**: Truyền dữ liệu thời gian thực cho kết quả trò chuyện và nghiên cứu.

## 2. Chân dung Người dùng & Câu chuyện (User Stories)

### Chân dung
1.  **Digital Marketer**: Tập trung vào các chiến dịch quảng cáo, thử nghiệm A/B và tối ưu hóa. Cần truy cập nhanh vào các chỉ số và quản lý chiến dịch liền mạch.
2.  **Market Researcher**: Cần các báo cáo chuyên sâu, toàn diện về các thị trường ngách và xu hướng. Coi trọng độ chính xác và chiều sâu hơn tốc độ.
3.  **Business Owner**: Muốn có cái nhìn tổng quan cấp cao về các dự án và hiệu suất.

### Câu chuyện Người dùng Chính
- "Là Marketer, tôi muốn trò chuyện với tác nhân AI để phân tích hiệu suất quảng cáo của mình."
- "Là Researcher, tôi muốn bắt đầu một tác vụ nghiên cứu sâu về một thị trường ngách cụ thể và nhận được báo cáo chi tiết."
- "Là Người dùng, tôi muốn quản lý nhiều dự án và giữ cho không gian làm việc của mình ngăn nắp."
- "Là Người dùng, tôi muốn mô phỏng các thử nghiệm A/B để quyết định các chiến lược quảng cáo tốt nhất."

## 3. Yêu cầu Chức năng

### 3.1 AI Chat & Điều phối
- **Hệ thống Đa Tác nhân**: Xác định ý định của người dùng và định tuyến đến các tác nhân thích hợp (Nhà phân tích - Analyst, Người kể chuyện - Narrator).
- **Phản hồi dạng Stream**: Truyền văn bản và dữ liệu theo thời gian thực.
- **Nhận biết Ngữ cảnh**: Duy trì lịch sử trò chuyện để tương tác mạch lạc.

### 3.2 Nghiên cứu Sâu (Deep Research)
- **Đầu vào**: Người dùng xác định thị trường ngách hoặc chủ đề.
- **Quy trình**: Thực thi ngầm các bước nghiên cứu.
- **Đầu ra**: Cập nhật trạng thái được stream và báo cáo tổng hợp cuối cùng.

### 3.3 Dashboard & Phân tích
- Tổng quan trực quan về các chỉ số chính (Quảng cáo đang chạy, ROI, v.v.).
- Nhật ký hoạt động và thẻ tương tác nhanh.

### 3.4 Quản lý Dự án & Quảng cáo
- **Dự án**: Tạo, xem, cập nhật và xóa dự án. Khả năng lọc và sắp xếp.
- **Quảng cáo**: Quản lý chiến dịch quảng cáo, xem trạng thái (Đang chạy, Tạm dừng) và tích hợp dữ liệu liên kết (affiliate).

### 3.5 Thử nghiệm (Experiments)
- Thiết lập và theo dõi các thử nghiệm A/B.
- Chỉ báo trạng thái trực quan cho các thử nghiệm đang diễn ra.

### 3.6 Cài đặt
- Tùy chỉnh giao diện (Chế độ Tối/Sáng).
- Quản lý Khóa API cho các dịch vụ AI.

## 4. Yêu cầu Phi Chức năng

### 4.1 Hiệu năng
- **Độ trễ**: Thời gian phản hồi API cho việc bắt đầu trò chuyện < 200ms.
- **Streaming**: Hiển thị mượt mà các token được stream mà không làm chặn giao diện người dùng (UI blocking).

### 4.2 Bảo mật
- **Quyền riêng tư Dữ liệu**: Không chia sẻ dữ liệu người dùng ra bên ngoài mà không có sự đồng ý (sử dụng khóa API cục bộ hoặc riêng tư nếu có).
- **Môi trường**: Quản lý an toàn các khóa API thông qua `.env`.

### 4.3 Khả năng sử dụng
- **Thiết kế**: Thẩm mỹ "Cao cấp" với phong cách glassmorphism, chuyển cảnh mượt mà và typography chất lượng cao.
- **Đáp ứng**: Hoạt động đầy đủ trên các điểm ngắt (breakpoints) máy tính để bàn và máy tính bảng.

### 4.4 Ngăn xếp Công nghệ (Tech Stack)
- **Frontend**: React, Vite, Tailwind CSS.
- **Backend**: Python, FastAPI.
- **Tích hợp AI**: Google GenAI, CrewAI.

## 5. Lộ trình Tương lai
- Xác thực người dùng & Kiểm soát truy cập dựa trên vai trò (RBAC).
- Tích hợp cơ sở dữ liệu (PostgreSQL) để lưu trữ dữ liệu bền vững.
- Tích hợp với các Nền tảng Quảng cáo trực tiếp (Facebook Ads, Google Ads APIs).
- Xuất báo cáo (PDF/CSV).
