let cameraData = JSON.parse(sessionStorage.getItem('ORTData'));

window.addEventListener('load', () => {
    if(cameraData == null) {
        location.href = '/html/onlineRayTracer_startPage.html'
    }
    camera_positionX.value = cameraData.cam_location[0];
    camera_positionY.value = cameraData.cam_location[1];
    camera_positionZ.value = cameraData.cam_location[2];
    point_positionX.value = cameraData.cam_lookat[0];
    point_positionY.value = cameraData.cam_lookat[1];
    point_positionZ.value = cameraData.cam_lookat[2];
    cameraApertureRange.value = cameraData.cam_aperture;
    cameraApertureText.value = cameraData.cam_aperture;
})

const camera_box = document.getElementById('camera_box');

let stage = new Konva.Stage({
    x: camera_box.clientWidth/2,
    y: camera_box.clientHeight/2,
    container: 'camera_box',
    width: camera_box.clientWidth,
    height: camera_box.clientHeight,
    draggable: true
});

let layer = new Konva.Layer();

let imageRect = new Image();

let stageRect =  new Konva.Rect({ 
    x:-cameraData.width/2,
    y:-cameraData.height/2,
    width: cameraData.width,
    height: cameraData.height,
    fill: 'rgb(74, 74, 74)',
    listening: true
})
layer.add(stageRect);

let rowLine = new Konva.Line({
    points: [stageRect.getX(), -1, -stageRect.getX(), -1],
    stroke: 'white',
    strokeWidth: 3
})
layer.add(rowLine);

let columnLine = new Konva.Line({
    points: [-1, stageRect.getY(), -1, -stageRect.getY()],
    stroke: 'white',
    strokeWidth: 3
})
layer.add(columnLine);

stage.add(layer);

let imageCamera = new Image();
let imagePoint = new Image();

imageCamera.src = '/src/camera.png';
imagePoint.src = '/src/point.png';

let cLc = cameraData.cam_location;
let cLa = cameraData.cam_lookat;

if(cLc[0] === 0 && cLc[1] === 0 && cLc[2] === 0 && cLa[0] === 0 && cLa[1] === 0 && cLa[2] === 0) {
    cameraData.cam_location = [-(cameraData.width/4), 0, 0];
    cameraData.cam_lookat = [(cameraData.width/4), 0, 0];
}

let camera = new Konva.Image({
    x: cameraData.cam_location[0],
    y: -cameraData.cam_location[1],
    image: imageCamera,
    width: 100,
    height: 100,
    draggable: true,
    offset: {
        x: 50,
        y: 50
    }
});

let point = new Konva.Image({
    x: cameraData.cam_lookat[0],
    y: -cameraData.cam_lookat[1],
    image: imagePoint,
    width: 50,
    height: 50,
    draggable: true,
    offset: {
        x: 25,
        y: 25
    }
});

let line = new Konva.Line({
    points: [camera.getX()+50, camera.getY(), point.getX(), point.getY()],
    stroke: 'white',
    strokeWidth: 4
});

moveLine();

function moveLine(){
    let cameraX = camera.getX();
    let cameraY = camera.getY();
    let pointX = point.getX();
    let pointY = point.getY();
    
    const dx = pointX - cameraX;
    const dy = pointY - cameraY;
    let angle = Math.atan2(-dy, dx);
    
    let degree = ((Math.atan2(pointY-cameraY, pointX-cameraX)*180)/Math.PI);
    // console.log(degree,'도');

    const radius = 50;

    cameraX = cameraX - radius * Math.cos(angle + Math.PI);
    cameraY = cameraY + radius * Math.sin(angle + Math.PI);

    camera.rotation(degree);

    let p = [cameraX, cameraY, pointX, pointY];
    line.setPoints(p);
    layer.draw();
}

layer.add(camera);

layer.add(point);

layer.add(line);
imageCamera.onload = () => {
    stage.add(layer);
};
imagePoint.onload = () => {
    stage.add(layer);
};

let scaleBy = 1.1;
stage.on('wheel', (e) => {
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
    if(cameraData.objects.length > 0) {
        camera_withObjects.classList.toggle('cameraWidthObjects');
        if(isWidthObject) {
            removeObjects();
            isWidthObject = false;
            addToast('object가 제거되었습니다.');
        } else {
            putObjects();
            isWidthObject = true;
            addToast('object가 추가되었습니다.');
        }
    } else {
        addToast('object가 없습니다.');
    }
})

camera.on('mouseover', () => {
    document.body.style.cursor = 'pointer';
});

camera.on('mouseout', () => {
    document.body.style.cursor = 'default';
});

camera.on('dragmove', () => {
    moveLine();
    cameraMove();
});

point.on('mouseover', () => {
    document.body.style.cursor = 'pointer';
});

point.on('mouseout', () => {
    document.body.style.cursor = 'default';
});

point.on('dragmove', () => {
    moveLine();
    pointMove()
});

function removeObjects() {
    layer.removeChildren();
    layer.add(stageRect);
    layer.add(rowLine);
    layer.add(columnLine);
    layer.add(camera);
    layer.add(point);
    layer.add(line);
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
                y: -v.location[1],
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
        line.moveToTop();
        layer.draw();
    }
}

const camera_positionX = document.getElementById('camera_positionX');
const camera_positionY = document.getElementById('camera_positionY');
const camera_positionZ = document.getElementById('camera_positionZ');

function cameraMove() {
    camera_positionX.value = parseInt(camera.attrs.x);
    camera_positionY.value = -parseInt(camera.attrs.y);
    cameraData.cam_location[0] = parseInt(camera.attrs.x);
    cameraData.cam_location[1] = -parseInt(camera.attrs.y);
}

const point_positionX = document.getElementById('point_positionX');
const point_positionY = document.getElementById('point_positionY');
const point_positionZ = document.getElementById('point_positionZ');

function pointMove() {
    point_positionX.value = parseInt(point.attrs.x);
    point_positionY.value = -parseInt(point.attrs.y);
    cameraData.cam_lookat[0] = parseInt(point.attrs.x);
    cameraData.cam_lookat[1] = -parseInt(point.attrs.y);
}

const cameraApertureRange = document.getElementById('cameraApertureRange');
const cameraApertureText = document.getElementById('cameraApertureText');

cameraApertureRange.value = cameraData.cam_aperture;
cameraApertureText.value = cameraData.cam_aperture;

function cameraApertureValue(v) {
    cameraApertureText.value = v;
    cameraDataChanged('ca', v);
}

const cameraVforRange = document.getElementById('cameraVforRange');
const cameraVforText = document.getElementById('cameraVforText');

cameraVforRange.value = cameraData.cam_vfov;
cameraVforText.value = cameraData.cam_vfov;

function cameraVforValue(v) {
    cameraVforText.value = v;
    cameraDataChanged('vf', v);
}

function cameraDataChanged(k, v) {
    if(k === 'cx') {
        camera.setAttrs({
            x:parseInt(camera_positionX.value)
        })
        cameraData.cam_location[0] = parseInt(camera_positionX.value);
    } else if(k === 'cy') {
        camera.setAttrs({
            y:-parseInt(camera_positionY.value)
        })
        cameraData.cam_location[1] = parseInt(camera_positionY.value);
    } else if(k === 'cz') {
        cameraData.cam_location[2] = parseInt(camera_positionZ.value);
    } else if(k === 'px') {
        point.setAttrs({
            x:parseInt(point_positionX.value)
        })
        cameraData.cam_lookat[0] = parseInt(point_positionX.value);
    } else if(k === 'py') {
        point.setAttrs({
            y:-parseInt(point_positionY.value)
        })
        cameraData.cam_lookat[1] = parseInt(point_positionY.value);
    } else if(k === 'pz') {
        cameraData.cam_lookat[2] = parseInt(point_positionZ.value);
    } else if(k === 'ca') {
        cameraData.cam_aperture = parseFloat(v);
    } else if(k === 'vf') {
        cameraData.cam_vfov = parseFloat(v);
    }
    moveLine();
}

document.getElementById('cameraPositionDefault').addEventListener('click', () => {
    cameraData.cam_location = [0.000, 0.000, 0.000];
    camera.setAttrs({
        x: 0,
        y: 0
    });
    camera_positionX.value = 0;
    camera_positionY.value = 0;
    camera_positionZ.value = 0;
    moveLine();
    addToast('카메라 위치가 기본값으로 변경되셨습니다.');
})

document.getElementById('cameraApertureDefault').addEventListener('click', () => {
    cameraData.cam_aperture = 0.0;
    cameraApertureRange.value = 0.0;
    cameraApertureText.value = 0.0;
    addToast('카메라 위치가 기본값으로 변경되셨습니다.');
})

document.getElementById('cameraVforDefault').addEventListener('click', () => {
    cameraData.cam_vfov = 0.0;
    cameraVforRange.value = 0.0;
    cameraVforText.value = 0.0;
    addToast('카메라 각도가 기본값으로 변경되셨습니다.');
})

document.getElementById('camera_front').addEventListener('click', () => {
    addToast('아직 없는 기능입니다.', '#F8D308');
})

document.getElementById('camera_right').addEventListener('click', () => {
    addToast('아직 없는 기능입니다.', '#F8D308');
})

document.querySelectorAll('.sideBar_menu > ul > li').forEach((v, i) => {
    if(i !== 2) {
        v.addEventListener('click', () => {
            saveCameraData();
            addToast('페이지 이동중입니다 잠시만 기다려주세요', undefined, 10);
        })
    }
})

function saveCameraData() {
	sessionStorage.setItem('ORTData', JSON.stringify(cameraData));
}