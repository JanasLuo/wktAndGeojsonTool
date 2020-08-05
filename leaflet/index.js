
var map = L.map('map').setView([
  30.6506221395211790, 114.3123096125275300 // 武汉
  // 28.737590, 115.878260 // 南昌
  // 31.486242, 121.518368 // 上海
  // 39.89941, 116.37207 // 北京
  // 38.87, 115.47  // 保定
  // 30.9398270690073, 113.925285596662 // 孝感
], 12);
var layers;
// var url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' // openstreetmap  wgs84

var url = 'https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw' // mapbox wgs84

// var url = 'http://mt2.google.cn/vt/lyrs=m&scale=2&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}' // 谷歌中国gcj02
var baseLayer = L.tileLayer(url, {
  maxZoom: 18,
}
);
baseLayer.addTo(map)

function changeStatus() {
  var controlBtn = document.getElementById('controlBtn');
  var input = document.getElementById('input')
  if (input.style.display == 'none') {
    input.style.display = 'block';
    controlBtn.value = '>>'
  } else {
    input.style.display = 'none';
    controlBtn.value = '<<'
  }
}

function draw() {
  if (layers) {
    layers.remove()
  }
  var text = document.getElementById('text').value
  var wkts = text.split(";")
  var statesData = []
  wkts.forEach((item) => {
    statesData = statesData.concat(parseWkt(item))
  })
  let center = caculateCenter(statesData[0].geometry)
  center = [center[1], center[0]]
  console.log('statesData', statesData)
  layers = L.geoJSON(statesData, {
    style: function (feature) {
      switch (feature.geometry.type) {
        case 'Polygon': return { color: "#ff0000" };
        case 'Point': return { color: "#0000ff" };
        case 'LineString': return { color: "green" };
      }
    }
  }).addTo(map);
  map.setView(center, 12)
}

function caculateCenter(geometry) {
  const type = geometry.type
  switch (type) {
    case 'Point': return geometry.coordinates;
    case 'LineString': return geometry.coordinates[0];
    case 'Polygon': return geometry.coordinates[0][0];
    case 'MultiPoint': return geometry.coordinates[0];
    case 'MultiLineString': return geometry.coordinates[0][0];
    case 'MultiPolygon': return geometry.coordinates[0][0][0];
  }
}
function parseWkt(str) {
  var geometry = Terraformer.WKT.parse(str);
  console.log('geometry', geometry)
  // 手动调整误差
  // if (geometry.type === 'Polygon') {
  //   geometry.coordinates = geometry.coordinates.map(coordinate => coordinate.map(item => [item[0] - 0.0008, item[1] + 0.0004]))
  // }
  // if (geometry.type === 'MultiPolygon') {
  //   geometry.coordinates = geometry.coordinates.map(coordinates => coordinates.map(coordinate => coordinate.map(item => [item[0] - 0.0008, item[1] + 0.0004])))
  // }
  // 坐标系转换
  if (geometry.type === 'Point') {
    const pArry = geometry.coordinates
    const pObj = window.GeoUtil.transform({ lat: Number(pArry[1]), lng: Number(pArry[0]) }, "wgs84", "gcj02")
    geometry.coordinates = [pObj.lng, pObj.lat]
  }

  return [{
    "type": "Feature",
    "geometry": geometry,
  }]
}

/*
//data格式
[
  {
    "type": "Feature",
    "geometry": {
      "type": Point,
      "coordinates": [30.6506221395211790,114.3123096125275300]
    },
  },
  {
    "type": "Feature",
    "geometry": {
      "type": LineString,
      "coordinates": [[-100, 40], [-105, 45], [-110, 55]]
    },
  },
  {
    "type": "Feature",
    "geometry": {
      "type": Polygon,
      "coordinates": [[
        [-104.05, 48.99],
        [-97.22,  48.98],
        [-96.58,  45.94],
        [-104.03, 45.94],
        [-104.05, 48.99]
      ]]
    },
  }
]
*/