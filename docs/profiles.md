# CVNSS4.0 Profiles

## CVNSS-User

Dành cho gõ nhanh. Ưu tiên dễ dùng, không ép metadata.

## CVNSS-Canonical

Dành cho lưu trữ, so sánh, test suite. Có thể escape raw token.

## CVNSS-NLP

Dành cho mô hình AI. Tách dấu thành đặc trưng riêng:

```text
embedding(token) = embedding(stem) + embedding(tone) + embedding(diacritic)
```

## CVNSS-ID

Dành cho QR/NFC/RFID/GIS. Không lưu toàn bộ dữ liệu trong tag; chỉ lưu mã định danh.

```text
CQN object name -> CVNSS canonical -> slug/hash -> CVNSS-ID
```

## CVNSS-Secure

Dành cho audit log/canonical log.

```text
CVNSS canonical + CRC8 + SHA-256 + optional HMAC
```

## CVNSS-Compact

Dành cho payload nhỏ trên thiết bị biên.

## CVNSS-Verbose

Dành cho debug, test suite, đặc tả.
