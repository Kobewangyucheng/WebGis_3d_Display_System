var viewer = null;
var tileset = null;
function init_3d() {
    Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJmOWM5ZTBjOC1mZDFjLTRkZmItODY0Yy03ZWNjYjViYTNmZmIiLCJpZCI6NDk0MTUsImlhdCI6MTYxODA3MDE5OH0.5H5wEaqWF_o2cswEDR7uu_6okOCoeurod7B_CNoP_bY'

    
    viewer = new Cesium.Viewer("cesiumContainer");

    //禁用冲突检测，开启地下可视化
    viewer.scene.screenSpaceCameraController.enableCollisionDetection = false;

    t_3dinit();

    document.querySelector(".infoPanel").style.visibility = "hidden";
    var menu = document.getElementById("dropdown");

    menu.options[0].onselect = function () {
        removeCoordinatePickingOnLeftClick();
        colorByMaterial();
    };
    menu.options[2].onselect = function () {
        removeCoordinatePickingOnLeftClick();
        colorByHeight();
    };

    menu.options[1].onselect = function () {
        // Default to Space Needle as the central location
        colorByDistanceToCoordinate(47.62051, -122.34931);
        document.querySelector(".infoPanel").style.visibility = "visible";
        // Add left click input to select a building to and extract its coordinates
        handler.setInputAction(function (movement) {
          viewer.selectedEntity = undefined;
          var pickedBuilding = viewer.scene.pick(movement.position);
          if (pickedBuilding) {
            var pickedLatitude = pickedBuilding.getProperty(
              "cesium#latitude"
            );
            var pickedLongitude = pickedBuilding.getProperty(
              "cesium#longitude"
            );
            colorByDistanceToCoordinate(pickedLatitude, pickedLongitude);
          }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
      };
      menu.onchange = function () {
        Sandcastle.reset();
        var item = menu.options[menu.selectedIndex];
        if (item && typeof item.onselect === "function") {
          item.onselect();
        }
      };
}
function t_3dinit(){
    var scene = viewer.scene;

    var height = 0.0;

    var url = "data/3ddata/NewYork/tileset.json";
    tileset = new Cesium.Cesium3DTileset({
    url: url,
    // skipLevelOfDetail : true,
	// baseScreenSpaceError : 1024,
	// skipScreenSpaceErrorFactor : 16,
	// skipLevels : 1,
	// immediatelyLoadDesiredLevelOfDetail : false,
	// loadSiblings : false,
	// cullWithChildrenBounds : true,
    // dynamicScreenSpaceError : true,
	// dynamicScreenSpaceErrorDensity : 0.00278,
	// dynamicScreenSpaceErrorFactor : 4.0,
	// dynamicScreenSpaceErrorHeightFalloff : 0.25

    });

    // tileset.style = new Cesium.Cesium3DTileStyle({
    //     color: {
    //         conditions: [
    //             ["${height} >= 300", "rgba(45, 0, 75, 0.5)"],
    //             ["${height} >= 200", "rgb(102, 71, 151)"],
    //             ["${height} >= 100", "rgb(170, 162, 204)"],
    //             ["${height} >= 50", "rgb(224, 226, 238)"],
    //             ["${height} >= 25", "rgb(252, 230, 200)"],
    //             ["${height} >= 10", "rgb(248, 176, 87)"],
    //             ["${height} >= 5", "rgb(198, 106, 11)"],
    //             ["true", "rgb(127, 59, 8)"]
    //         ]
    //     }
    // });

    tileset.readyPromise.then(function (tileset) {
    var boundingSphere = tileset.boundingSphere;
    var cartographic = Cesium.Cartographic.fromCartesian(
        boundingSphere.center
    );
    var lng = cartographic.longitude;
    var lat = cartographic.latitude;
    var height = cartographic.height;
    var from = Cesium.Cartesian3.fromRadians(lng, lat, height);
    var to = Cesium.Cartesian3.fromRadians(lng, lat, 0.0);
    var offset = Cesium.Cartesian3.subtract(
        to,
        from,
        new Cesium.Cartesian3()
    );
          
    var newModelMatrix = new Cesium.Matrix4();
    newModelMatrix = Cesium.Matrix4.multiplyByTranslation(
        tileset.modelMatrix,
        offset,
        newModelMatrix
        );
        tileset.modelMatrix = newModelMatrix;
    });

    scene.primitives.add(tileset);

    viewer.zoomTo(tileset);
}

function colorByMaterial() {
    tileset.style = new Cesium.Cesium3DTileStyle({
      defines: {
        material: "${feature['building:material']}",
      },
      color: {
        conditions: [
          ["${material} === null", "color('white')"],
          ["${material} === 'glass'", "color('skyblue', 0.5)"],
          ["${material} === 'concrete'", "color('grey')"],
          ["${material} === 'brick'", "color('indianred')"],
          ["${material} === 'stone'", "color('lightslategrey')"],
          ["${material} === 'metal'", "color('lightgrey')"],
          ["${material} === 'steel'", "color('lightsteelblue')"],
          ["true", "color('white')"], // This is the else case
        ],
      },
    });
  }

function colorByDistanceToCoordinate(pickedLatitude, pickedLongitude) {
    tileset.style = new Cesium.Cesium3DTileStyle({
      defines: {
        distance:
          "distance(vec2(${feature['cesium#longitude']}, ${feature['cesium#latitude']}), vec2(" +
          pickedLongitude +
          "," +
          pickedLatitude +
          "))",
      },
      color: {
        conditions: [
          ["${distance} > 0.014", "color('blue')"],
          ["${distance} > 0.010", "color('green')"],
          ["${distance} > 0.006", "color('yellow')"],
          ["${distance} > 0.0001", "color('red')"],
          ["true", "color('white')"],
        ],
      },
    });
}

function colorByHeight(){
    tileset.style = new Cesium.Cesium3DTileStyle({
        color: {
            conditions: [
                ["${height} >= 300", "rgba(45, 0, 75, 0.5)"],
                ["${height} >= 200", "rgb(102, 71, 151)"],
                ["${height} >= 100", "rgb(170, 162, 204)"],
                ["${height} >= 50", "rgb(224, 226, 238)"],
                ["${height} >= 25", "rgb(252, 230, 200)"],
                ["${height} >= 10", "rgb(248, 176, 87)"],
                ["${height} >= 5", "rgb(198, 106, 11)"],
                ["true", "rgb(127, 59, 8)"]
            ]
        }
    });
}

  