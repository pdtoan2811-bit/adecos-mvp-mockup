# Tài Liệu Tính Năng: Chat Thông Minh (Smart Chat)

**Phiên bản**: 1.0 (Draft)
**Người viết**: AI Assistant
**Ngày**: 06/02/2026

---

## 1. Tổng quan (Overview)

Tính năng **Chat Thông Minh** là giao diện chính giúp người dùng tương tác với hệ thống Adecos. Tại đây, người dùng có thể đặt câu hỏi, yêu cầu tìm kiếm các chương trình Affiliate, hoặc yêu cầu giải thích dữ liệu. Hệ thống sử dụng AI (Gemini) để phân tích ý định và phản hồi dưới dạng văn bản hoặc bảng dữ liệu một cách trực quan.

## 2. Minh họa Trực quan (Visual Demonstration)

Dưới đây là giao diện thực tế của tính năng Chat khi đang hoạt động:

![Giao diện Chat Feature](assets/chat_sample.png)

*Hình 1: Giao diện Chat với phản hồi từ AI (Sample)*

## 3. Luồng Người Dùng (User Flow)

1.  **Truy cập**: Người dùng vào trang chủ Dashboard, chọn tab "AI Agent" hoặc sử dụng khung chat chính giữa màn hình.
2.  **Nhập liệu**: Người dùng nhập câu hỏi vào ô input (ví dụ: "Tìm các chương trình affiliate về du lịch").
3.  **Xử lý (Processing)**:
    *   Hệ thống hiển thị trạng thái đang suy nghĩ (loading indicator).
    *   AI phân tích câu hỏi để quyết định format trả về (Text hoặc Table).
4.  **Hiển thị kết quả**:
    *   Kết quả xuất hiện dần (streaming) để giảm cảm giác chờ đợi.
    *   Nếu là dữ liệu so sánh, kết quả hiện dưới dạng Bảng (Table).
    *   Nếu là giải thích, kết quả hiện dưới dạng đoạn văn (Markdown).

## 4. Yêu cầu Kỹ thuật (Technical Specs)

### Frontend Components
*   `ChatInterface`: Container chính quản lý danh sách tin nhắn.
*   `MessageBubble`: Component hiển thị tin nhắn (phân biệt User/AI).
*   `DataGrid` (Dự kiến): Dùng để hiển thị bảng dữ liệu phức tạp.

### Dữ liệu (Data Model)
Mỗi tin nhắn trong lịch sử chat sẽ có cấu trúc JSON cơ bản:

```json
{
  "id": "msg_001",
  "role": "user" | "assistant",
  "content": "Nội dung tin nhắn...",
  "type": "text" | "table",
  "timestamp": 1707190000
}
```

## 5. Ghi chú cho Dev Team
*   **Styling**: Sử dụng Tailwind CSS với Dark Mode mặc định. Đảm bảo các hiệu ứng glassmorphism thống nhất với Design System.
*   **Performance**: Cần tối ưu việc render khi danh sách tin nhắn dài (Virtual Scroll).
