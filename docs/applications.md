# Application Patterns

## 1. AI/NLP

- Khôi phục dấu tiếng Việt.
- Sửa lỗi ASR/OCR.
- Tokenizer stem + KHD.
- Embedding riêng cho thanh điệu.
- Chuẩn hóa truy vấn tìm kiếm.

## 2. QR/NFC/RFID

Không nhồi toàn bộ dữ liệu lên thẻ. Dùng CVNSS-ID làm khóa:

```text
Tag payload: CV40-XOAI-TU-QUY-AB12CD34
Database: full product / GIS / traceability record
```

## 3. GIS/Digital Twin

Gắn `cvnss40_id` vào GeoJSON feature hoặc asset record để liên kết đối tượng vật lý và bản sao số.

## 4. Edge AI/IoT

Dùng profile compact cho payload nhỏ, secure cho log kiểm chứng.

## 5. Hành chính / dữ liệu chuẩn hóa

Dùng profile canonical để chuẩn hóa tên địa danh, hồ sơ, văn bản, bản ghi log.
