# Rule Engineering Notes

## 1. Lớp CVN

Nhóm quy tắc chính:

1. Bỏ bớt dấu sắc ở chữ cuối c/p/t.
2. Y → I; UY → Y, giữ AY/ÂY.
3. Phụ âm đầu: PH→F, QU→Q, K→C, KH→K, D→Z, Đ→D, GI→J, GH→G, NG/NGH→W.
4. Phụ âm cuối: NG→G, NH→H, CH→K.
5. Rút gọn 56 vần dài bằng nguyên âm ghép + chữ cái cuối.

## 2. Lớp KHD

KHD là 18 chữ cái đặt cuối từ để thay dấu phụ và dấu thanh.

```js
const markers = require('../src').khdTable();
```

## 3. Ngoại lệ cần phát triển thêm

- Tên riêng người Việt.
- Địa danh hành chính.
- Từ nước ngoài.
- Email/URL.
- Mã sản phẩm.
- Ký hiệu khoa học.
- Văn bản pháp lý.
- Từ viết tắt như AI, GIS, RFID, IoT.

## 4. Test Vector Format

```json
{
  "id": "TC-0001",
  "input_cqn": "tuyết",
  "expected_cvss": "tydb",
  "profile": "canonical",
  "notes": "Vần uyêt → yd, sắc+nón → b"
}
```
