'use strict';

const cvnss = require('../src');

const feature = {
  type: 'Feature',
  geometry: { type: 'Point', coordinates: [106.375, 10.243] },
  properties: {
    province: 'Vĩnh Long',
    oldProvince: 'Bến Tre',
    assetName: 'Điểm quan trắc mặn Cửa Đại',
    objectType: 'salinity_sensor'
  }
};

const idSeed = `${feature.properties.objectType}|${feature.properties.assetName}|${feature.geometry.coordinates.join(',')}`;
const id = cvnss.makeId(idSeed, { idPrefix: 'GIS' });
feature.properties.cvnss40_id = id.output;
feature.properties.cvnss40_canonical = cvnss.encode(idSeed).output;
console.log(JSON.stringify(feature, null, 2));
