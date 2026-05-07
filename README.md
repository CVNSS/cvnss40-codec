# CVNSS4.0 Codec/IR

**CVNSS4.0 Codec/IR** là bộ mã nguồn tham chiếu để đưa CVNSS4.0 thoát khỏi phạm vi tốc ký cá nhân và tiến tới vai trò **codec / intermediate representation (IR) tiếng Việt** cho phần mềm, dữ liệu, AI biên, QR/NFC/RFID, GIS, Digital Twin và log an ninh.

> Công thức lõi: `CQN → CVN stem + KHD marker + metadata`

## 1. Mục tiêu

Dự án này đóng gói CVNSS4.0 thành một kiến trúc phần mềm nhiều tầng:

- **Encoder**: mã hóa Chữ Quốc Ngữ (CQN) sang CVNSS4.0.
- **Decoder**: giải mã CVNSS4.0 về CQN theo bảng quy tắc hiện có.
- **IR Layer**: tách `stem`, `KHD`, `tone`, `diacritic`, `metadata` cho AI/NLP.
- **ID Layer**: sinh mã định danh ngắn cho QR/NFC/RFID/GIS/Digital Twin.
- **Security Layer**: sinh `CRC8`, `SHA-256`, `recordHash` cho canonical log/audit.
- **CLI**: công cụ dòng lệnh để chuyển đổi nhanh.
- **Web demo**: trang HTML tĩnh có thể mở trực tiếp.
- **Test suite**: các vector kiểm thử ban đầu.

## 2. Cài đặt nhanh

Yêu cầu Node.js >= 18.

```bash
npm install
npm test
npm run demo
npm run serve
```

Chạy CLI trong thư mục dự án:

```bash
node bin/cvnss40.js encode "Qua phà nghiêng ngó lồng gà"
node bin/cvnss40.js decode "Qa fal wizy woj logd gal"
node bin/cvnss40.js ir "Bến Tre ứng dụng GIS và RFID" --json
node bin/cvnss40.js id "Xoài tứ quý Thạnh Hải - lô 2026-A01" --prefix BT
node bin/cvnss40.js audit "Cảm biến RFID ghi nhận độ mặn tại Bến Tre"
```

Sau khi publish lên npm hoặc dùng `npm link`:

```bash
npm link
cvnss40 encode "Trăm năm trong cõi người ta"
```

## 3. Sử dụng như thư viện

```js
const cvnss = require('./src');

const encoded = cvnss.encode('Qua phà nghiêng ngó lồng gà', {
  profile: 'canonical',
  includeTokens: true
});

console.log(encoded.output);
// Qa fal wizy woj logd gal

const decoded = cvnss.decode(encoded.output);
console.log(decoded.output);
// Qua phà nghiêng ngó lồng gà
```

## 4. Các profile chính

| Profile | Mục tiêu | Đầu ra |
|---|---|---|
| `user` | Gõ nhanh, học tốc ký | Chuỗi CVNSS gọn |
| `canonical` | Chuẩn hóa dữ liệu, kiểm thử | Chuỗi CVNSS + metadata tùy chọn |
| `nlp` | AI/NLP, tokenizer | Token stem + KHD + tone + diacritic |
| `id` | QR/NFC/RFID/GIS/Digital Twin | Mã định danh ngắn `CV40-...` |
| `secure` | Log, audit, kiểm chứng | CVNSS + CRC8/SHA-256 |
| `compact` | Thiết bị biên/payload nhỏ | Chuỗi CVNSS ngắn |
| `verbose` | Debug/spec/test suite | Metadata đầy đủ |

## 5. API chính

### `encode(text, options)`

```js
const result = cvnss.encode('tuyết nguyễn xoay', {
  profile: 'canonical',
  includeTokens: true
});
```

Kết quả rút gọn:

```json
{
  "profile": "canonical",
  "output": "tydb wylg xajp",
  "stats": {
    "inputChars": 16,
    "outputChars": 14,
    "compressionRatio": 0.875
  }
}
```

### `decode(text, options)`

```js
const result = cvnss.decode('tydb wylg xajp');
console.log(result.output);
```

### `toIR(text, options)`

Sinh biểu diễn trung gian phục vụ NLP:

```js
const ir = cvnss.toIR('Bến Tre ứng dụng GIS và RFID');
console.log(ir.tokens);
```

Mỗi token word có dạng:

```json
{
  "cqn": "Bến",
  "cvn": "Benb",
  "cvss": "Benb",
  "stem": "Ben",
  "khd": {
    "marker": "b",
    "tone": "sac",
    "diacritic": "hat"
  }
}
```

### `tokenizeForNLP(text)`

```js
const tokens = cvnss.tokenizeForNLP('Bến Tre ứng dụng GIS, RFID và AI biên.');
console.table(tokens);
```

### `makeId(text, options)`

```js
const id = cvnss.makeId('Xoài tứ quý Thạnh Hải - lô 2026-A01', {
  idPrefix: 'BT'
});
console.log(id.output);
```

Dùng cho QR/NFC/RFID/GIS khi không muốn nhồi toàn bộ dữ liệu lên thẻ, mà chỉ lưu khóa định danh ngắn.

### `auditRecord(text, options)`

```js
const audit = cvnss.auditRecord('Cảm biến ghi nhận độ mặn 3,5‰', {
  sourceId: 'edge-node-BT-001'
});
console.log(audit.integrity.sha256);
```

## 6. Cấu trúc thư mục

```text
cvnss40-codec/
├─ bin/                  # CLI
├─ data/                 # test vectors
├─ docs/                 # đặc tả, API, profile, roadmap
├─ examples/             # ví dụ ứng dụng
├─ src/
│  ├─ legacy/            # converter gốc/legacy được bọc lại
│  ├─ utils/             # normalize, tokenize, checksum
│  ├─ codec.js           # encoder/decoder/IR/ID/audit
│  ├─ constants.js
│  ├─ khd.js
│  ├─ profiles.js
│  └─ index.js
├─ test/                 # node:test
├─ web/                  # demo HTML tĩnh
├─ LICENSE
├─ NOTICE.md
└─ README.md
```

## 7. Kiến trúc codec

```text
CQN Unicode
   ↓ normalize NFC / whitespace / raw token policy
Token stream
   ↓ word / number / code / email / URL / punctuation
CVNSS encoder
   ↓ legacy rule table + KHD analyzer
CVNSS canonical output
   ↓ optional
IR tokens / NLP features / CVNSS-ID / audit hash
```

## 8. Ứng dụng mẫu

### 8.1. NLP / Edge AI

```bash
node examples/nlp-tokenizer.js
```

Tạo đặc trưng `stem + marker + tone + diacritic` để mô hình AI có thể học riêng phần thân âm tiết và lớp dấu.

### 8.2. Truy xuất nguồn gốc / RFID

```bash
node examples/traceability-id.js
```

Sinh mã ngắn cho lô sản phẩm. Dữ liệu đầy đủ vẫn nằm trong database/cloud/edge server.

### 8.3. GIS / Digital Twin

```bash
node examples/gis-digital-twin.js
```

Gắn `cvnss40_id` vào GeoJSON feature để liên kết đối tượng vật lý với bản sao số.

### 8.4. Audit log

```bash
node examples/security-audit-log.js
```

Sinh record có `crc8`, `sha256`, `recordHash` để kiểm chứng dữ liệu.

## 9. REST API nội bộ

Chạy server HTTP không cần dependency ngoài:

```bash
npm run serve
```

Test nhanh:

```bash
curl -X POST http://127.0.0.1:8787/encode -H "content-type: application/json" -d "{\"text\":\"Bến Tre ứng dụng GIS\"}"
```

Endpoint chính: `/encode`, `/decode`, `/ir`, `/id`, `/audit`, `/health`.

## 10. Mở web demo

Mở file:

```text
web/index.html
```

Trang web demo không cần server, không cần internet.

## 11. Lưu ý kỹ thuật

- Bộ chuyển đổi legacy hiện được đặt trong `src/legacy/cvnss4-converter.js`.
- API mới không sửa trực tiếp bảng legacy, mà bọc thêm các lớp normalize, tokenize, profile, IR, ID và security.
- Decoder là `best-effort` theo bảng hiện có. Một số trường hợp tên riêng, từ mượn, mã kỹ thuật, URL/email nên được bảo toàn hoặc escape.
- Trước khi công bố chính thức, nên mở rộng `data/test-vectors.json` thành bộ kiểm thử lớn gồm từ đơn, từ ghép, địa danh, tên riêng, văn bản hành chính, kỹ thuật, mã sản phẩm.

## 12. Hướng đưa lên GitHub

```bash
git init
git add .
git commit -m "Initial CVNSS4.0 codec IR reference implementation"
git branch -M main
git remote add origin https://github.com/<your-account>/cvnss40-codec.git
git push -u origin main
```

## 13. Roadmap

- [ ] Chuẩn hóa đặc tả `CVNSS4.0 Core Specification`.
- [ ] Tách bảng rule thành JSON chính thức.
- [ ] Thêm dictionary địa danh/tên riêng.
- [ ] Thêm chế độ decode trả về nhiều ứng viên khi nhập nhằng.
- [ ] Thêm benchmark NLP: khôi phục dấu, sửa lỗi ASR/OCR.
- [ ] Thêm gói Python tương thích.
- [ ] Thêm API REST Fastify/FastAPI.
- [ ] Thêm plugin QGIS/GIS demo.
- [ ] Thêm bộ test 10.000+ vector.

## 14. Ghi công

Dự án này là một scaffold kỹ thuật nhằm đóng gói CVNSS4.0 do Long Ngo phát triển theo hướng codec/IR, phục vụ nghiên cứu và thử nghiệm trong các lĩnh vực phần mềm, dữ liệu, NLP, AI biên, QR/NFC/RFID, GIS, Digital Twin và hệ thống định danh số. Dự án trân trọng ghi nhận và cảm ơn hai đồng tác giả Kiều Trường Lâm và Trần Tư Bình — nhóm tác giả công trình Chữ VN Song Song 4.0 — đã xây dựng, công bố và phổ biến hệ thống công thức CVNSS4.0. Khi công bố công khai, tái sử dụng hoặc phát triển tiếp, người dùng cần ghi rõ nguồn công thức CVNSS4.0, đồng thời kiểm tra quyền sử dụng đối với rule table, tài liệu gốc và converter legacy theo nội dung trong NOTICE.md.
