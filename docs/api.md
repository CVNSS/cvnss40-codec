# API Reference

```js
const cvnss = require('cvnss40-codec');
```

## encode(text, options)

Mã hóa CQN sang CVNSS4.0.

Options:

```js
{
  profile: 'canonical',
  includeTokens: false,
  integrity: false,
  normalize: {
    unicode: 'NFC',
    collapseSpaces: false,
    trim: false
  },
  idPrefix: 'CV40',
  slugLength: 48,
  secret: undefined
}
```

Returns:

```js
{
  version,
  specVersion,
  profile,
  input,
  normalized,
  output,
  tokens,
  stats,
  integrity,
  warnings
}
```

## decode(text, options)

Giải mã CVNSS4.0 về CQN.

```js
const r = cvnss.decode('Qa fal wizy woj logd gal');
console.log(r.output);
```

## toIR(text, options)

Mã hóa theo profile `nlp` và luôn trả tokens.

## tokenizeForNLP(text)

Trả về mảng token gọn gồm `cqn`, `cvss`, `stem`, `marker`, `tone`, `diacritic`.

## makeId(text, options)

Sinh mã định danh ngắn.

```js
cvnss.makeId('Bến Tre - cảm biến mặn', { idPrefix: 'GIS' });
```

## auditRecord(text, options)

Sinh bản ghi audit.

```js
cvnss.auditRecord('Nội dung log', { sourceId: 'edge-node-01' });
```

## khdTable()

Trả bảng marker KHD.

## analyzeKhd(token)

Phân tích token CVNSS thành stem + marker.
