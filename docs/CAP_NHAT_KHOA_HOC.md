# Hướng dẫn cập nhật khóa học EduBee

## Cấu trúc mỗi khóa học

Mỗi khóa học nằm trong một thư mục riêng tại `data/courses/<slug>/`:

- `index.ts`: điểm chọn phiên bản đang chạy của riêng khóa học.
- `catalog.ts`: thông tin thẻ khóa học ở trang chủ.
- `versions/vN/course.json`: tên môn, lớp, bộ sách và phiên bản dữ liệu.
- `versions/vN/lessons.json`: danh sách bài/chặng học và nhóm chủ đề.
- `versions/vN/questions.json`: ngân hàng câu hỏi đã chuẩn hóa.
- `versions/vN/vocabulary.json`: kho từ vựng gốc nếu là khóa ngoại ngữ.

Giao diện học dùng chung nằm trong `components/CourseLearningApp.tsx`. Không tạo
một bản sao giao diện cho từng môn.

## Quy trình cập nhật an toàn một khóa học

Không chỉnh trực tiếp phiên bản đang chạy và không tải đè toàn bộ dự án.

1. Tạo nhánh Git riêng, ví dụ `course/tieng-anh-4-v2`.
2. Tạo bản sao từ phiên bản đang chạy:

   ```bash
   npm run course:clone -- tieng-anh-4-ben-bella v2
   ```

3. Chỉ sửa dữ liệu trong `versions/v2/` của khóa đó.
4. Kiểm tra riêng phiên bản mới:

   ```bash
   npm run course:validate -- tieng-anh-4-ben-bella v2
   ```

5. Xem bản Preview của Vercel. Chỉ khi đạt mới kích hoạt:

   ```bash
   npm run course:activate -- tieng-anh-4-ben-bella v2
   ```

6. Commit chỉ các file của khóa đang cập nhật. Vercel Production vẫn giữ bản cũ
   nếu bản build mới thất bại.

## Hoàn tác riêng một khóa học

Ví dụ cần đưa Tiếng Anh 4 từ `v2` về `v1`:

```bash
npm run course:activate -- tieng-anh-4-ben-bella v1
```

Sau đó commit file `data/courses/tieng-anh-4-ben-bella/index.ts`. Khoa học 4 và
các khóa khác không bị thay đổi.

Nếu toàn website gặp sự cố cần khôi phục ngay, có thể chọn deployment tốt gần
nhất trong Vercel và Promote/Rollback trước, sau đó mới sửa mã nguồn.

## Thêm khóa học mới

1. Tạo thư mục dữ liệu mới theo slug không dấu, ví dụ `toan-4-kntt`.
2. Chuẩn hóa dữ liệu theo các kiểu trong `data/course-types.ts`.
3. Đăng ký dữ liệu trong `data/courses.ts`.
4. Thêm thẻ khóa học vào `data/course-catalog.ts`.
5. Chạy `npm run lint` và `npm run build`.

Khóa học sẽ tự có đường dẫn `/khoa-hoc/<slug>` và được tạo trang tĩnh khi build.

## Cập nhật dữ liệu đã có

- Giữ nguyên `id` của câu hỏi hoặc từ vựng nếu chỉ sửa nội dung.
- Mỗi lần cập nhật tạo thư mục `versions/vN` mới; không sửa `v1`, `v2` đã phát hành.
- Tăng `version` trong `course.json` để tách tiến độ cũ khi cấu trúc dữ liệu thay đổi.
- Không đổi `slug` sau khi website đã công khai, tránh làm hỏng đường dẫn cũ.
- Kiểm tra đáp án phải tồn tại trong `options` đối với câu trắc nghiệm.
- Không gắn nội dung mở rộng hoặc nâng cao thành kiến thức cốt lõi của một lớp.

Lưu ý: thay đổi dữ liệu trong một khóa được cô lập. Thay đổi component dùng
chung trong `components/` vẫn có thể ảnh hưởng nhiều khóa, nên phải kiểm tra toàn
hệ thống trước khi phát hành.

## Công cụ chuyển đổi hiện có

- `scripts/extract-science-course.mjs`: chuyển file Khoa học 4 sang dữ liệu chuẩn.
- `scripts/extract-english-course.mjs`: chuyển kho Ben & Bella, giữ dữ liệu từ
  vựng gốc và tạo câu luyện tập.
