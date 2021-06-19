Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJmOWM5ZTBjOC1mZDFjLTRkZmItODY0Yy03ZWNjYjViYTNmZmIiLCJpZCI6NDk0MTUsImlhdCI6MTYxODA3MDE5OH0.5H5wEaqWF_o2cswEDR7uu_6okOCoeurod7B_CNoP_bY'

var viewer = new Cesium.Viewer("cesiumContainer", {
    terrainProvider: Cesium.createWorldTerrain(),
    infoBox: false,
    selectionIndicator: false,
    shadows: true,
    shouldAnimate: true,
});

viewer.scene.globe.enableLighting = true;

function Init(){

viewer.scene.globe.depthTestAgainstTerrain = true;
var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
  
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
tileset.readyPromise.then(function (tileset) {
var boundingSphere = tileset.boundingSphere;
var cartographic = Cesium.Cartographic.fromCartesian(
    boundingSphere.center
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

document.querySelector(".infoPanel").style.visibility = "hidden";
var menu = document.getElementById("dropdown");

menu.options[0].onselect = function () {
    colorPure();    
};
menu.options[1].onselect = function () {
    colorHalf();
};

menu.options[2].onselect = function () {
    colorByMaterial();
};

menu.options[3].onselect = function () {
    colorByHeight();
};

menu.options[4].onselect = function () {
    featureBuilding();
};

menu.options[5].onselect = function () {
    highligtAllBuildingsAbove250M();
};

menu.options[6].onselect = function () {
    createModel("SampleData/models/CesiumAir/Cesium_Air.glb",900.0);
};

menu.options[7].onselect = function () {
    roamAction();
};


menu.onchange = function () {
    Sandcastle.reset();
    var item = menu.options[menu.selectedIndex];
    if (item && typeof item.onselect === "function") {
      item.onselect();
    }
};
colorByHeight();
viewer.zoomTo(tileset);
}

function colorByMaterial() {
    viewer.entities.removeAll();
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
          ["true", "color('white')"],
        ],
      },
    });
}

function colorPure(){
    viewer.entities.removeAll();
     tileset.style = new Cesium.Cesium3DTileStyle({
        color: "rgba(255,0,0,1)"
    });
}
function colorHalf(){
    viewer.entities.removeAll();
    tileset.style = new Cesium.Cesium3DTileStyle({
       color: "rgba(0,0,255,0.2)"
   });
}
function colorByHeight(){
    viewer.entities.removeAll();
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

function colorByLan(){
    viewer.entities.removeAll();
    tileset.style = new Cesium.Cesium3DTileStyle({
        color: {
          conditions: [
            ["${lng} >= 117.004261", "rgba(106,2,0, 0.5)"],
            ["${lng} >= 116.724998", "rgba(154,47,3,0.5)"],
            ["${lng} >= 116.511400", "rgba(180,97,22,0.5)"],
            ["${lng} >= 116.362656", "rgba(224,143,42,0.5)"],
            ["${lng} >= 116.281208", "rgba(249,177,55,0.5)"],
            ["${lng} >= 116.204001", "rgba(254,200,89,0.5)"],
            ["${lng} >= 116.070695", "rgba(254,227,95,0.5)"],
            ["true", "rgba(254,255,129,0.5)"]
          ]
        }
    });

}

function highligtAllBuildingsAbove250M(){
    viewer.entities.removeAll();
    tileset.style = new Cesium.Cesium3DTileStyle({
        color: {
            conditions:[
                ["${height} >= 250","color('cyan',0.9)"],
                ["true","color('white')"],
            ]
        }
    });
}

function removeCoordinatePickingOnLeftClick() {
    document.querySelector(".infoPanel").style.visibility = "hidden";
    handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
}

function featureBuilding(){
    viewer.entities.removeAll();

    var initialPosition = Cesium.Cartesian3.fromDegrees(
        -74.01881302800248,
        40.69114333714821,
        753
      );
      var initialOrientation = new Cesium.HeadingPitchRoll.fromDegrees(
        21.27879878293835,
        -21.34390550872461,
        0.0716951918898415
      );
      viewer.scene.camera.setView({
        destination: initialPosition,
        orientation: initialOrientation,
        endTransform: Cesium.Matrix4.IDENTITY,
      });
      
}

function Inspecter(buildingHeight){
    viewer.extend(Cesium.viewerCesium3DTilesInspectorMixin);
    var inspectorViewModel = viewer.cesium3DTilesInspector.viewModel;

    var tileset = new Cesium.Cesium3DTileset({
        url: Cesium.IonResource.fromAssetId(75343),
        });
    viewer.scene.primitives.add(tileset);

    tileset.readyPromise.then(function () {
    viewer.zoomTo(
        tileset,
        new Cesium.HeadingPitchRange(
         0.0,
        -0.5,
        tileset.boundingSphere.radius / 4.0
        )
        );
    });
}

function createModel(url, height) {
    viewer.entities.removeAll();
  
    var position = Cesium.Cartesian3.fromDegrees(
        -74.01881302800248,
        40.69114333714821,
      height
    );
    var heading = Cesium.Math.toRadians(290);
    var pitch = 0;
    var roll = 0;
    var hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
    var orientation = Cesium.Transforms.headingPitchRollQuaternion(
      position,
      hpr
    );
  
    var entity = viewer.entities.add({
      name: url,
      position: position,
      orientation: orientation,
      model: {
        uri: url,
        minimumPixelSize: 128,
        maximumScale: 20000,
      },
    });
    viewer.trackedEntity = entity;
  }


let start = Cesium.JulianDate.fromDate(new Date(2017,7,11));
    // 结束时间
let stop = Cesium.JulianDate.addSeconds(start, 360, new Cesium.JulianDate());
     
function roamAction(){
    let data = [];
    data[0] = [{longitude:116.405419, dimension:39.918034, height:0, time:0},{longitude:116.2821, dimension:39.918145, height:0, time:40},{longitude:115.497402, dimension:39.344641, height:70000, time:100},{longitude:107.942392, dimension:29.559967, height:70000, time:280}, {longitude:106.549265, dimension:29.559967, height:0, time:360}];
    data[1] = [{longitude:116.405419, dimension:39.918034, height:0, time:0},{longitude:117.034586, dimension:39.881202, height:0, time:40},{longitude:116.340088, dimension:38.842224, height:70000, time:100},{longitude:113.489176, dimension:23.464017, height:70000, time:280}, {longitude:113.262084, dimension:23.13901, height:0, time:360}];
    data[2] = [{longitude:118.838979, dimension:32.073514, height:0, time:0},{longitude:118.438838, dimension:32.03777, height:0, time:40},{longitude:117.802406, dimension:31.91231, height:70000, time:100},{longitude:104.043645, dimension:35.993845, height:70000, time:280}, {longitude:101.807224, dimension:36.660972, height:0, time:360}];
    data[3] = [{longitude:-73.7812, dimension:40.6276, height:46, time:0},{longitude:-73.7891, dimension:40.6169, height:244, time:40},{longitude:-73.8076, dimension:40.5929, height:556, time:100},{longitude:-73.8136, dimension:40.5628, height:770, time:280}, {longitude:-73.6716, dimension:40.5831, height:1715, time:360}
    ,{longitude:-73.6523, dimension:40.5984, height:1905, time:320} ,{longitude:-73.6618, dimension:40.6827, height:2958, time:340} ,{longitude:-73.6686, dimension:40.7065, height:2797, time:360} ,{longitude:-73.6935, dimension:40.7928, height:3246, time:380} ,{longitude:-73.7073, dimension:40.8394, height:3353, time:400}
    ,{longitude:-73.7224, dimension:40.89, height:3528, time:420} ,{longitude:-73.7377, dimension:40.9398, height:3741, time:440} ,{longitude:-73.7706, dimension:41.0463, height:4275, time:460} ,{longitude:-73.8153, dimension:41.1022, height:4572, time:480} ,{longitude:-73.8899, dimension:41.1499, height:4884, time:500}
    ,{longitude:-73.9684, dimension:41.2159, height:5220, time:520} ,{longitude:-74.0087, dimension:41.2481, height:5456, time:540} ,{longitude:-74.1248, dimension:41.3411, height:5814, time:560} ,{longitude:-74.1958, dimension:41.398, height:6119, time:580} ,{longitude:-74.3216, dimension:41.4983, height:6553, time:600}
    ,{longitude:-74.3749, dimension:41.5405, height:6690, time:620} ,{longitude:-74.4872, dimension:41.6291, height:7026, time:640} ,{longitude:-74.6021, dimension:41.7196, height:7460, time:660} ,{longitude:-74.6593, dimension:41.7645, height:7628, time:680} ,{longitude:-74.7758, dimension:41.8555, height:7894, time:700}
    ];
    viewer.clock.startTime = start.clone();
    viewer.clock.currentTime = start.clone();
    viewer.clock.stopTime  = stop.clone();
    viewer.clock.multiplier = 10;
    viewer.timeline.zoomTo(start,stop);
    viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP;
     
    viewer.camera.flyTo({
        destination:Cesium.Cartesian3.fromDegrees(-73.7819,40.6544,15000)
    })
    for(let j=0; j<data.length; j++){
        let property = computeFlight(data[j]);
        //console.log(property)
        // 添加模型
        let planeModel = viewer.entities.add({
            // 和时间轴关联
            availability : new Cesium.TimeIntervalCollection([new Cesium.TimeInterval({
                start : start,
                stop : stop
            })]),
            position: property,
            orientation: new Cesium.VelocityOrientationProperty(property),
            // 模型数据
            model: {
                uri: 'SampleData/models/CesiumAir/Cesium_Air.glb',
                minimumPixelSize:128
            }
        });
    }
}
function computeFlight(source) {
    let property = new Cesium.SampledPositionProperty();
    for(let i=0; i<source.length; i++){
        let time = Cesium.JulianDate.addSeconds(start, source[i].time, new Cesium.JulianDate);
        let position = Cesium.Cartesian3.fromDegrees(source[i].longitude, source[i].dimension, source[i].height);
        property.addSample(time, position);
    }
    return property;
}
