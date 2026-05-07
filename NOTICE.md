# NOTICE

This repository is a reference engineering scaffold for CVNSS4.0 as a Vietnamese codec / intermediate representation.

CVNSS4.0 rules are based on the public formula commonly described as:

- CQN: Chữ Quốc Ngữ source/target text.
- CVN: Chữ Việt Nhanh shortened stem layer.
- KHD: Ký Hiệu Dấu, final marker letters representing tone and vowel-diacritic information.

The source formula materials state that CVNSS4.0 was authored by Kiều Trường Lâm and Trần Tư Bình and registered in 2020. Before publishing a public or commercial repository, verify licensing/permission for the rule tables and any existing converter code you include. This scaffold keeps the legacy converter in `src/legacy/` and layers a modern codec/IR API around it.

Recommended repository policy:

1. Keep this NOTICE.
2. Attribute the original CVNSS4.0 authors in README and docs.
3. Replace or validate the legacy rule table with an independently reviewed table before a formal release.
4. Add an explicit conformance test suite before claiming complete compatibility.
