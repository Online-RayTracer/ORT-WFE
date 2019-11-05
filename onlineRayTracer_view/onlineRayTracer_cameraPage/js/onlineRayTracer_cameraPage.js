let cameraData = JSON.parse(sessionStorage.getItem('ORTData'));

window.addEventListener('load', () => {
    putObjects();
})

const camera_box = document.getElementById('camera_box');

let stage = new Konva.Stage({
    container: 'camera_box',
    width: camera_box.clientWidth,
    height: camera_box.clientHeight,
    draggable: true
});

let layer = new Konva.Layer();

let stageRect =  new Konva.Rect({ 
    x:0,
    y:0,
    width: cameraData.width,
    height: cameraData.height,
    fill: 'rgb(74, 74, 74)',
    listening: true
})

layer.add(stageRect);
stage.add(layer);

function putObjects() {
    if(cameraData.objects.length > 0) {
        let fill;
        let stroke;
        cameraData.objects.forEach((v, i) => {
            if(v.material.type === "metal"){
                fill = `rgb(${v.material.color[0]},${v.material.color[1]},${v.material.color[2]})`;
                stroke = 'rgb(145,145,145)';
            } else if(v.material.type === "lambertian") {
                fill = `rgb(${v.material.color[0]},${v.material.color[1]},${v.material.color[2]})`;
                stroke = 'rgb(105,105,105)';
            } else if(v.material.type === "dielectric") {
                fill = 'rgb(249,248,247)';
                stroke = 'rgb(232,231,227)';
            }
            let circle = new Konva.Circle({
                x: v.location[0],
                y: v.location[1],
                radius: v.size,
                fill: fill,
                name: `${i}`,
                stroke: stroke,
                strokeWidth: 2,
                draggable: false
            })

            layer.add(circle);
            stage.add(layer);
        })
    }
}

let scaleBy = 1.1;
stage.on('wheel', e => {
    e.evt.preventDefault();
    let oldScale = stage.scaleX();

    let mousePointTo = {
        x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
        y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale
    };

    let newScale = e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;
    stage.scale({ x: newScale, y: newScale });

    let newPos = {
        x: -(mousePointTo.x - stage.getPointerPosition().x / newScale) * newScale,
        y: -(mousePointTo.y - stage.getPointerPosition().y / newScale) *newScale
    };
    stage.position(newPos);
    stage.batchDraw();
});

const cameraApertureText = document.getElementById('cameraApertureText');

function cameraApertureValue(v) {
    cameraApertureText.value = v;
}