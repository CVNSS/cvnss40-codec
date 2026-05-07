# Upload to GitHub

## 1. Tạo repository rỗng trên GitHub

Tên gợi ý:

```text
cvnss40-codec
cvnss40-ir
vietnamese-cvnss-codec
```

## 2. Đẩy code

```bash
git init
git add .
git commit -m "Initial CVNSS4.0 codec IR reference implementation"
git branch -M main
git remote add origin https://github.com/<your-account>/cvnss40-codec.git
git push -u origin main
```

## 3. Gắn topics

```text
cvnss, vietnamese, codec, intermediate-representation, nlp, edge-ai, rfid, gis, digital-twin
```

## 4. Việc cần làm trước khi public rộng rãi

- Kiểm tra quyền sử dụng rule table và converter legacy.
- Bổ sung ghi công tác giả CVNSS4.0.
- Bổ sung test vectors nhiều hơn.
- Thêm demo web có giao diện.
- Thêm issue templates và contributing guide.
