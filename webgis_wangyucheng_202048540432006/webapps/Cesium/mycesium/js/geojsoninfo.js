function init() {
    Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJmOWM5ZTBjOC1mZDFjLTRkZmItODY0Yy03ZWNjYjViYTNmZmIiLCJpZCI6NDk0MTUsImlhdCI6MTYxODA3MDE5OH0.5H5wEaqWF_o2cswEDR7uu_6okOCoeurod7B_CNoP_bY'

    var viewer = null;
    viewer = new Cesium.Viewer("cesiumContainer");
    Cesium.GeoJsonDataSource.load('./data/GeoJson/nmg.json').then(function (dataSource) {
    viewer.dataSources.add(dataSource);
    var entities = dataSource.entities.values;
    for (var i = 0; i < entities.length; i++) {
      var entity = entities[i];
      // 构造随机颜色
      var color = Cesium.Color.fromRandom({alpha:0.6});
      entity.polygon.material = color;
      entity.polygon.outline = false;
      var polyPositions = entity.polygon.hierarchy.getValue(Cesium.JulianDate.now()).positions;
      var polyCenter = Cesium.BoundingSphere.fromPoints(polyPositions).center;
      polyCenter = Cesium.Ellipsoid.WGS84.scaleToGeodeticSurface(polyCenter);
      viewer.entities.add({
        position: polyCenter,
        label: {
          font:"24px sans-serif",
          text: entity.properties.name,
          showBackground: true,
          scale: 0.6,
          horizontalOrigin: Cesium.horizontalOrigin.center,
          verticalOrigin: Cesium.verticalOrigin.BOTTOM
        }
      })
    }
});
}