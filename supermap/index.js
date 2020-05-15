var layers;
var url="http://support.supermap.com.cn:8090/iserver/services/map-china400/rest/maps/China";
var map = L.map('map', {
  center: [30.57, 114.3],
  minZoom: 9,
  zoom: 12
});

vectorLayer = L.supermap.tiledVectorLayer(url, {
    cacheEnabled: true,
    returnAttributes: true,
    attribution: "Tile Data <span>© <a href='http://support.supermap.com.cn/product/iServer.aspx' target='_blank'>SuperMap iServer</a></span> with <span>© <a href='http://iclient.supermap.io' target='_blank'>SuperMap iClient</a></span>"
}).addTo(map);

function changeStatus() {
  var controlBtn = document.getElementById('controlBtn');
  var input = document.getElementById('input')
  if(input.style.display == 'none') {
    input.style.display = 'block';
    controlBtn.value = '>>'
  } else {
    input.style.display = 'none';
    controlBtn.value = '<<'
  }
}

function draw() {
  if(layers) {
    layers.remove()
  }
  var text = document.getElementById('text').value
  var statesData = formatStr(text)
  console.log(statesData)
  layers =  L.geoJSON(statesData, {
    style: function(feature) {
        switch (feature.properties.party) {
            case 'Polygon': return {color: "green"};
            case 'Point':   return {color: "#0000ff"};
            case 'LineString': return {color: "#ff0000"};
        }
    }
  }).addTo(map);
}

function strToLower (arr) {
  var newarr = []
  arr.forEach(item => {
    var str = item.toLowerCase()
    str = str.charAt(0).toUpperCase() + str.slice(1);
    if(str === 'Linestring') {
      str = 'LineString'
    }
    newarr.push(str)
  })
  return newarr
}

function formatStr (str) {
  var statesData = []
  var lineData = []
  var reg_kh = /\((.+?)\){1,2}/g;
  var reg_word = /[A-Z]+/ig;
  var arr_zb = str.match(reg_kh)
  var type = str.match(reg_word)
  var arr_type = strToLower(type)
  for(var idx in arr_zb) {
    var str_zb 
    if(arr_zb[idx][1] === '('){
      str_zb = arr_zb[idx].slice(2,-2)
    } else {
      str_zb = arr_zb[idx].slice(1,-1)
    }
    var zb_item = str_zb.split(', ')
    var zb = []
    if (arr_type[idx] == 'Polygon') {
      zb[0] = []
    }
    zb_item.forEach((item) => {
      var point = item.split(' ')
      point[0] = parseFloat(point[0].trim())
      point[1] = parseFloat(point[1])
      if (arr_type[idx] == 'Polygon') {
        zb[0].push(point) 
        
      } else if (arr_type[idx] == 'Point') {
        zb = [...point]
      } else if(arr_type[idx] == 'LineString') {
        zb.push(point)   
      }     
    })
    
    var obj = {
      "type": "Feature",
      "properties": {"party": arr_type[idx]},
      "geometry": {
        "type": arr_type[idx],
        "coordinates": zb
      }, 
    }
    if(arr_type[idx] == 'LineString'){
      lineData.push(obj)
    } else {
      statesData.push(obj)
    }
    if(arr_type[idx] == 'Polygon') {
      var point = zb[0][0]
      map.panTo([point[1],point[0]])
    }
    if(arr_type[idx] == 'Point') {
      var point = zb
      map.panTo([point[1],point[0]])
    }
  }
  lineData.length > 0 && lineData.forEach(item => {
    statesData.push(item)
    var point = item.geometry.coordinates[0]
    map.panTo([point[1],point[0]])
  })
  return statesData
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
