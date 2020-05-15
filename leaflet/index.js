
var map = L.map('map').setView([
  // 30.6506221395211790, 114.3123096125275300
  // 28.737590, 115.878260
  31.486242, 121.518368
], 12);
var layers;
var baseLayer = L.tileLayer(
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data &copy; <a href=" ">OpenStreetMap</a > contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a >, Imagery © <a href="http://cloudmade.com">CloudMade</a >',
  maxZoom: 18
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
  console.log('geometry', geometry)
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