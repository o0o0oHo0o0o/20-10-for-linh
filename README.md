# A Little Garden for Linh

Website quà tặng 20/10 gồm 5 chương, ảnh thật và ba loại thử thách tăng độ khó: canh nhịp tưới, nhớ thứ tự hoa, suy luận cách sắp xếp luống hoa.

## Mở website

Mở `index.html` bằng trình duyệt hiện đại. Toàn bộ CSS, JavaScript, ảnh, hình SVG và font nằm trong dự án; không cần cài thư viện hay chạy build. Nếu trình duyệt hạn chế file cục bộ, mở qua một máy chủ tĩnh, ví dụ khi máy có Python:

```text
python -m http.server 8000
```

Chạy trong thư mục dự án, sau đó mở `http://localhost:8000`.

## Đổi lời chúc, tên và độ khó

Mở `js/config.js` bằng trình soạn thảo và lưu UTF-8:

- `recipientName`, `senderName`, `signature`: người nhận, người gửi và chữ ký.
- `introduction`, `flowerMessages`, `finalLetter`: lời nhắn.
- `photoGallery`, `couplePhoto`, `couplePhotoMessages`: album ảnh và phần ảnh chung.
- `{name}` được tự thay bằng tên người nhận.
- `difficulty.watering`: `width` nhỏ hơn làm vùng tưới hẹp hơn; `period` nhỏ hơn làm giọt chạy nhanh hơn. Giữ đúng ba mức.
- `difficulty.memory`: độ dài chuỗi và thời gian sáng/tắt của từng vòng. Mặc định 3, 4, 5 nhịp, tốc độ tăng dần.
- `logicPuzzles`: ba luống hoa với 3, 4, 5 bông. `clues` là lời gợi ý, `rules` là điều kiện chấm; luôn sửa cả hai cho khớp. Mỗi vòng hiện có đúng một đáp án.

Phần suy luận không đếm ngược. Chạm hai bông để đổi chỗ, rồi kiểm tra. Nếu sai, trò chơi chỉ báo số manh mối đang khớp. Gợi ý nhỏ chỉ mở khi người chơi chủ động chọn.

## Ảnh

Đã có đủ 7 ảnh gốc: sáu ảnh riêng và một ảnh chung. Ảnh yoga nằm trong album và có lời chúc riêng. Khuôn mặt và nội dung ảnh không bị chỉnh sửa.

Thêm ảnh vào `assets/images/`, rồi thêm mục trong `photoGallery`:

```javascript
{
  src: './assets/images/anh-moi.jpg',
  caption: 'Một khoảnh khắc anh muốn giữ.',
  alt: 'Mô tả ngắn về ảnh',
  objectPosition: '50% 50%',
  fit: 'cover'
}
```

Xóa một mục khỏi danh sách để bớt ảnh. Danh sách rỗng vẫn hiện khung minh họa. Dùng `fit: 'contain'` để giữ trọn ảnh; ảnh yoga và ảnh chung đã dùng cách này. `objectPosition` điều chỉnh điểm cắt khi dùng `cover`. Ảnh tải lỗi tự đổi thành minh họa hoa SVG.

## Font và âm thanh

Tiêu đề dùng Lora, nội dung dùng Be Vietnam Pro. Các file font hỗ trợ tiếng Việt và giấy phép OFL được lưu trong `assets/fonts/`. Không cần tải font qua mạng khi xem website. Đừng bỏ thư mục này khi đưa lên GitHub.

Nhạc mặc định tắt và chưa kèm bài nhạc. Muốn thêm, đặt file bạn muốn dùng ở `assets/audio/background.mp3`, đổi `musicAvailable` thành `true`. Người xem phải chủ động bấm nút nhạc. Khi không có file, nút nhạc tự ẩn.

Nguồn font: [Lora](https://github.com/google/fonts/tree/main/ofl/lora) và [Be Vietnam Pro](https://github.com/google/fonts/tree/main/ofl/bevietnampro).

## Đưa lên GitHub Pages

1. Tạo repository của bạn, ví dụ `20-10-for-linh`.
2. Đưa **nội dung bên trong** thư mục dự án vào repository: `index.html` phải nằm ngay ở gốc, bên cạnh `css`, `js`, `assets` và `.nojekyll`.
3. Trong repository, mở **Settings → Pages**.
4. Chọn **Deploy from a branch**, nhánh **main**, thư mục **/(root)** rồi **Save**.
5. Khi GitHub hoàn tất triển khai, mở địa chỉ được hiển thị ở mục Pages. Địa chỉ thường có dạng `https://USERNAME.github.io/20-10-for-linh/`.

Xem [hướng dẫn chính thức của GitHub](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site). Website không cần API key, biến môi trường, cơ sở dữ liệu hoặc bước build.

## Nếu ảnh hoặc font chưa hiện

- Kiểm tra tên file, đuôi `.png`/`.jpg` và chữ hoa/thường có khớp cấu hình không.
- Giữ nguyên cấu trúc thư mục. Đường dẫn ảnh bắt đầu bằng `./assets/`, không đổi thành `/assets/`.
- Đảm bảo đã tải lên toàn bộ `assets/images/` và `assets/fonts/`.
- Tải lại trang bằng Ctrl+Shift+R sau khi cập nhật để bỏ bản cũ trong bộ nhớ đệm.
- Nếu chỉ thấy minh họa hoa, đó là khung dự phòng: ảnh chưa được tìm thấy tại đường dẫn cấu hình.

## Kiểm tra trên điện thoại

Mở link Pages trên Safari/Chrome và trình duyệt trong Messenger. Thử tưới trượt/đúng; nhớ hoa sai rồi thử lại; đổi chỗ hoa; vuốt album; mở ảnh yoga và ảnh chung; đọc thư; ngắm bó hoa; chơi lại. Các nút dùng được bằng Tab và Enter. Escape đóng thiệp hoặc ảnh phóng to.

Website tôn trọng cài đặt giảm chuyển động: tắt hiệu ứng trang trí, làm chậm thước tưới. Thời gian hiển thị các gợi ý ghi nhớ vẫn đủ đọc. Khi tải lại trang, câu chuyện bắt đầu lại; không lưu tiến độ hay gửi dữ liệu người xem đi đâu.

## Trạng thái bàn giao

Đây là mã nguồn và ảnh sẵn để triển khai. Chưa được tự động đưa lên tài khoản GitHub của bạn. Kiểm tra trực tiếp trên iPhone/Android và Messenger trước khi gửi món quà vì bản xem thử trên máy tính không thay thế được thiết bị thật.
