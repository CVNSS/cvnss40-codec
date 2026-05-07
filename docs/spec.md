# CVNSS4.0 Codec/IR Draft Specification

## 1. Scope

Tài liệu này mô tả cách đóng gói CVNSS4.0 thành một codec / intermediate representation cho tiếng Việt. Mục tiêu không chỉ là tốc ký, mà là tạo lớp biểu diễn có thể xử lý bằng phần mềm.

## 2. Terms

- **CQN**: Chữ Quốc Ngữ, văn bản nguồn/đích chuẩn Unicode.
- **CVN**: Chữ Việt Nhanh, lớp thân rút gọn.
- **KHD**: Ký Hiệu Dấu, chữ cái cuối token thay cho dấu thanh và dấu phụ.
- **CVNSS**: chuỗi đầu ra gồm CVN + KHD.
- **IR**: intermediate representation gồm token, stem, marker, tone, diacritic, metadata.
- **Profile**: cấu hình ứng dụng: user, canonical, nlp, id, secure, compact, verbose.

## 3. Design Principles

1. Không thay thế CQN; dùng song song với CQN.
2. Chuẩn hóa Unicode trước khi mã hóa.
3. Tách phần thân âm tiết và lớp dấu.
4. Bảo toàn URL/email/mã kỹ thuật bằng raw policy.
5. Cho phép nhiều profile nhưng cùng một lõi codec.
6. Có checksum/hash cho lớp định danh và an ninh.
7. Không giả định decoder luôn đơn trị; các phiên bản sau cần trả về danh sách ứng viên khi nhập nhằng.

## 4. Processing Pipeline

```text
Input CQN
  -> normalize
  -> tokenize
  -> classify raw/code/word
  -> encode word via CVNSS table
  -> analyze KHD
  -> output profile
```

## 5. Token Model

```json
{
  "index": 0,
  "type": "word",
  "cqn": "nguyễn",
  "cvn": "wylg",
  "cvss": "wylg",
  "stem": "wyl",
  "khd": {
    "marker": "g",
    "group": "circumflex",
    "tone": "nga",
    "diacritic": "hat"
  }
}
```

## 6. KHD Marker Groups

| Nhóm | Marker | Ý nghĩa |
|---|---|---|
| Nón | B D Q G F | sắc, huyền, hỏi, ngã, nặng + â/ê/ô |
| Trăng/Móc | X K V W H | sắc, huyền, hỏi, ngã, nặng + ă/ơ/ư |
| Không dấu phụ | J L Z S R | sắc, huyền, hỏi, ngã, nặng |
| Thanh ngang | Y O P | nón ngang, trăng/móc ngang, chống nhập nhằng |

## 7. Raw Token Policy

| Token | Canonical | ID | NLP |
|---|---|---|---|
| URL | `[RAW:base64url]` | slug/hash | preserve |
| Email | `[RAW:base64url]` | slug/hash | preserve |
| Mã kỹ thuật | escape hoặc preserve | slug/hash | preserve |
| Số | preserve | preserve/slug | preserve |
| Dấu câu | preserve | có thể bỏ/slug | preserve |

## 8. Conformance Levels

- **Level 0**: encode/decode cơ bản bằng bảng legacy.
- **Level 1**: có normalize + tokenizer + KHD analyzer.
- **Level 2**: có profile canonical/nlp/id/secure.
- **Level 3**: có dictionary ngoại lệ và decode nhiều ứng viên.
- **Level 4**: có test suite lớn và benchmark NLP/GIS/RFID.

Phiên bản hiện tại hướng tới Level 1–2, chưa tuyên bố hoàn toàn Level 3–4.
