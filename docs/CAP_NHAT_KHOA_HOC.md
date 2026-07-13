# Hướng dẫn cập nhật khóa học EduBee

## Cấu trúc mỗi khóa học

Mỗi khóa học nằm trong một thư mục riêng tại `data/courses/<slug>/`:

- `index.ts`: điểm chọn phiên bản đang chạy của riêng khóa học.
- `catalog.ts`: thông tin thẻ khóa học ở trang chủ.
- `versions/vN/course.json`: tên môn, lớp, bộ sách và phiên bản dữ liệu.
- `versions/vN/lessons.json`: danh sách bài/chặng học và nhóm chủ đề.
- `versions/vN/questions.json`: ngân hàng câu hỏi đã chuẩn hóa.
- `versions/vN/vocabulary.json`: kho từ vựng gốc nếu là khóa ngoại ngữ.
- `html-app.ts`: điểm chọn phiên bản giao diện HTML nguyên bản nếu khóa học dùng
  chế độ `exact-html`.
- `html-versions.json`: mã SHA-256 để phát hiện file HTML bị sửa ngoài chủ đích.
- `public/course-apps/<slug>/vN/index.html`: ứng dụng HTML nguyên bản theo phiên bản.

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
   Nếu khóa dùng giao diện HTML nguyên bản, thay riêng file tại
   `public/course-apps/<slug>/v2/index.html` và cập nhật SHA-256 trong
   `html-versions.json` theo đúng file nguồn được duyệt.
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
các khóa khác không bị thay đổi. Với khóa HTML nguyên bản, lệnh kích hoạt cũng
chuyển riêng `html-app.ts` về phiên bản tương ứng.

Nếu toàn website gặp sự cố cần khôi phục ngay, có thể chọn deployment tốt gần
nhất trong Vercel và Promote/Rollback trước, sau đó mới sửa mã nguồn.

## Thêm khóa học mới

1. Tạo thư mục dữ liệu mới theo slug không dấu, ví dụ `toan-4-kntt`.
2. Chuẩn hóa dữ liệu theo các kiểu trong `data/course-types.ts`.
3. Đăng ký dữ liệu trong `data/courses.ts`.
4. Thêm thẻ khóa học vào `data/course-catalog.ts`.
5. Chạy `npm run lint` và `npm run build`.

Khóa học lớp 4 sẽ có đường dẫn `/lop-4/khoa-hoc/<slug>` và được tạo trang tĩnh
khi build. Đường dẫn cũ `/khoa-hoc/<slug>` chỉ giữ để chuyển hướng, không dùng
cho liên kết mới.

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

## Tiếng Việt 4 gồm hai tập

Tiếng Việt 4 là một khóa học chung tại
`/lop-4/khoa-hoc/tieng-viet-4-kntt`, nhưng dữ liệu mỗi tập được quản lý độc lập:

- Tập 1: slug nội bộ `tieng-viet-4-kntt-tap-1`, ứng dụng tại
  `/lop-4/khoa-hoc/tieng-viet-4-kntt/tap-1`.
- Tập 2: để trạng thái `Sắp cập nhật`; khi có file nguồn sẽ tạo slug nội bộ
  `tieng-viet-4-kntt-tap-2` và lịch sử phiên bản riêng.

Khi cập nhật Tập 1, chỉ chạy lệnh clone/validate/activate với slug
`tieng-viet-4-kntt-tap-1`. Khi bổ sung Tập 2, không sửa thư mục hoặc điểm chọn
phiên bản của Tập 1. Trang chọn tập chỉ thay trạng thái Tập 2 từ chờ dữ liệu sang
sẵn sàng sau khi bản Tập 2 đã kiểm tra thành công.

## Công cụ chuyển đổi hiện có

- `scripts/extract-science-course.mjs`: chuyển file Khoa học 4 sang dữ liệu chuẩn.
- `scripts/extract-english-course.mjs`: chuyển kho Ben & Bella, giữ dữ liệu từ
  vựng gốc và tạo câu luyện tập.
