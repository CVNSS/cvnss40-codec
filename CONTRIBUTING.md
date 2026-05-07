# Contributing

## Priority Contributions

1. Add more test vectors in `data/test-vectors.json`.
2. Review CVNSS4.0 rule table accuracy.
3. Add exception dictionaries for proper names, địa danh, technical codes.
4. Improve ambiguous decoder candidate ranking.
5. Add Python and REST API ports.

## Test Rules

Every rule change must include at least one test vector.

```bash
npm test
```

## Commit Style

```text
feat: add GIS ID profile
fix: correct khd marker analysis
spec: update raw token policy
bench: add NLP benchmark vector
```
