let cameraData = JSON.parse(sessionStorage.getItem('ORTData'));

window.addEventListener('load', () => {
    
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

let imageCamera = new Image();
let imagePoint = new Image();

imageCamera.src = 'https://lh3.google.com/u/0/d/1ZipdYg3E1U9WXuKs_152CytgZBBIUN3I=w1920-h888-iv1';
imagePoint.src = 'https://lh3.google.com/u/0/d/1mbtvqBZMN43s7d6Jzr_HP1ikE6sUQ7P0=w1920-h888-iv1';

let camera = new Konva.Image({
    x: (cameraData.width/2-100),
    y: (cameraData.height/2-50),
    image: imageCamera,
    width: 100,
    height: 100,
    draggable: true
});

let point = new Konva.Image({
    x: (cameraData.width/2+100),
    y: (cameraData.height/2-25),
    image: imagePoint,
    width: 50,
    height: 50,
    draggable: true
});

let line = new Konva.Line({
    points: [(camera.getX()+100), (camera.getY()+50), (point.getX()+25), (point.getY()+25)],
    stroke: 'white',
    strokeWidth: 4
});

layer.add(line);

function moveLine(e){
    let cameraX = (camera.getX()+50);
    let cameraY = (camera.getY()+50);
    let pointX = (point.getX()+25);
    let pointY = (point.getY()+25);
    
    const dx = pointX - cameraX;
    const dy = pointY - cameraY;
    let angle = Math.atan2(-dy, dx);

    const radius = 50;

    cameraX = cameraX + -radius * Math.cos(angle + Math.PI);
    cameraY = cameraY + radius * Math.sin(angle + Math.PI);

    let degreeCenterX = Math.abs((camera.getX()+50) - cameraX);
    let degreeCenterY = Math.abs((camera.getY()+50) - cameraY);


    let p = [cameraX, cameraY, pointX, pointY];
    line.setPoints(p);
    layer.draw();
}

camera.on('mouseover', () => {
    document.body.style.cursor = 'pointer';
});

camera.on('mouseout', () => {
    document.body.style.cursor = 'default';
});

camera.on('dragmove', moveLine);

layer.add(camera);

point.on('mouseover', () => {
    document.body.style.cursor = 'pointer';
});

point.on('mouseout', () => {
    document.body.style.cursor = 'default';
});

point.on('dragmove', moveLine);

layer.add(point);

setTimeout(() => {
    stage.add(layer);
}, 500)

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

const camera_withObjects = document.getElementById('camera_withObjects');

let isWidthObject = false;

camera_withObjects.addEventListener('click', () => {
    camera_withObjects.classList.toggle('cameraWidthObjects');
    if(isWidthObject) {
        removeObjects();
        isWidthObject = false;
    } else {
        putObjects();
        isWidthObject = true;
    }
})

function removeObjects() {
    layer.removeChildren();
    layer.add(stageRect);
    layer.add(camera);
    layer.add(point);
    stage.add(layer);
}

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
        point.moveToTop();
        camera.moveToTop();
        layer.draw();
    }
}

const cameraApertureText = document.getElementById('cameraApertureText');

function cameraApertureValue(v) {
    cameraApertureText.value = v;
}