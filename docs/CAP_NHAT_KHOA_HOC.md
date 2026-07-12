# Hướng dẫn cập nhật khóa học EduBee

## Cấu trúc mỗi khóa học

Mỗi khóa học nằm trong một thư mục riêng tại `data/courses/<slug>/`:

- `course.json`: tên môn, lớp, bộ sách, nhãn hiển thị và phiên bản dữ liệu.
- `lessons.json`: danh sách bài/chặng học và nhóm chủ đề.
- `questions.json`: ngân hàng câu hỏi đã chuẩn hóa cho giao diện luyện tập.
- `vocabulary.json`: kho từ vựng gốc, chỉ dùng với khóa học ngoại ngữ.

Giao diện học dùng chung nằm trong `components/CourseLearningApp.tsx`. Không tạo
một bản sao giao diện cho từng môn.

## Thêm khóa học mới

1. Tạo thư mục dữ liệu mới theo slug không dấu, ví dụ `toan-4-kntt`.
2. Chuẩn hóa dữ liệu theo các kiểu trong `data/course-types.ts`.
3. Đăng ký dữ liệu trong `data/courses.ts`.
4. Thêm thẻ khóa học vào `data/course-catalog.ts`.
5. Chạy `npm run lint` và `npm run build`.

Khóa học sẽ tự có đường dẫn `/khoa-hoc/<slug>` và được tạo trang tĩnh khi build.

## Cập nhật dữ liệu đã có

- Giữ nguyên `id` của câu hỏi hoặc từ vựng nếu chỉ sửa nội dung.
- Tăng `version` trong `course.json` khi thay đổi lớn cần tách tiến độ cũ.
- Không đổi `slug` sau khi website đã công khai, tránh làm hỏng đường dẫn cũ.
- Kiểm tra đáp án phải tồn tại trong `options` đối với câu trắc nghiệm.
- Không gắn nội dung mở rộng hoặc nâng cao thành kiến thức cốt lõi của một lớp.

## Công cụ chuyển đổi hiện có

- `scripts/extract-science-course.mjs`: chuyển file Khoa học 4 sang dữ liệu chuẩn.
- `scripts/extract-english-course.mjs`: chuyển kho Ben & Bella, giữ dữ liệu từ
  vựng gốc và tạo câu luyện tập.
