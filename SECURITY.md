# Security Policy

This package provides checksum/hash utilities for audit-log integrity, but it is not a full security system.

## Do

- Use `secure` profile for canonical logs.
- Add HMAC secret for trusted internal pipelines.
- Store original CQN and CVNSS canonical together when auditability matters.
- Treat decoder ambiguity explicitly.

## Do not

- Use CVNSS as encryption.
- Put secrets in QR/NFC/RFID payload.
- Assume short hashes are collision-proof IDs in high-risk systems.
