let objectsData = JSON.parse(sessionStorage.getItem('ORTData'));

window.addEventListener('load', () => {
    if(objectsData == null) {
        location.href = '/html/onlineRayTracer_startPage.html'
    }
    putObjects();
})

let objectStructure = {
    // location: [],
    // size: 0,
    // material: {
    //     type: "",
    //     color: [],
    //     Roughness: 0.0,
    //     Refractive_index: 0
    // }
}

const objects_box = document.getElementById('objects_box');

let stage = new Konva.Stage({
    x: objectsData.width/2,
    y: objectsData.height/2,
    container: 'objects_box',
    width: objects_box.clientWidth,
    height: objects_box.clientHeight,
    draggable: true
});

let layer = new Konva.Layer();

let stageRect =  new Konva.Rect({ 
    x:-objectsData.width/2,
    y:-objectsData.height/2,
    width: objectsData.width,
    height: objectsData.height,
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

let circleIndex = objectsData.objects.length;

function addCircle(kind) {
    let X, Y, radius, color, roughness;
    if(kind === 'random') {
        X = parseInt((Math.random()-0.5) * (objectsData.width));
        Y = parseInt((Math.random()-0.5) * (objectsData.height));
        radius = parseInt(Math.random() * 50) + 9;
        color = `rgb(${parseInt(Math.random() * 255)},${parseInt(Math.random() * 255)},${parseInt(Math.random() * 255)})`;
        roughness = Math.random().toFixed(1);
    } else {
        X = 0;
        Y = 0;
        radius = 10;
        color = 'rgb(255,0,0)';
        roughness = 0;
    }
    let circle = new Konva.Circle({
        x: X,
        y: Y,
        radius: radius,
        fill: color,
        name: `${circleIndex}`,
        stroke: 'rgb(145,145,145)',
        strokeWidth: 2,
        draggable: false
    });
    circleIndex++;

    circle.on('click', (e) => {
        // console.log('it clicked', e.target);
        if (Object.getOwnPropertyNames(objectTarget).length !== 0) {
            objectTarget.setAttrs({
                draggable: false,
                strokeWidth: 2
            })
        }
        objectTarget = e.target;
        getTargetData();
        objectTarget.setAttrs({
            draggable: true,
            strokeWidth: 5
        })
        layer.draw();
    })
    
    circle.on('mouseover', () => {
        document.body.style.cursor = 'pointer';
    });
    
    circle.on('mouseout', () => {
        document.body.style.cursor = 'default';
    });
    
    circle.on('dragmove', (e) => {
        objectMove();
    })

    layer.add(circle);

    stage.add(layer);

    objectStructure = {
        location: [X, -Y, 000],
        size: radius,
        material: {
            type: "metal",
            color: [parseInt(color.substring(color.indexOf('(')+1, color.indexOf(','))), parseInt(color.substring(color.indexOf(',')+1, color.lastIndexOf(','))), parseInt(color.substring(color.lastIndexOf(',')+1, color.indexOf(')')))],
            roughness: roughness,
        }
    }
    objectsData.objects.push(objectStructure);
}


function putObjects() {
    if(objectsData.objects.length > 0) {
        let fill;
        let stroke;
        objectsData.objects.forEach((v, i) => {
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

            circle.on('click', (e) => {
                // console.log('it clicked', e.target);
                if (Object.getOwnPropertyNames(objectTarget).length !== 0) {
                    objectTarget.setAttrs({
                        draggable: false,
                        strokeWidth: 2
                    })
                }
                objectTarget = e.target;
                getTargetData();
                objectTarget.setAttrs({
                    draggable: true,
                    strokeWidth: 5
                })
                layer.draw();
            })
            
            circle.on('mouseover', () => {
                document.body.style.cursor = 'pointer';
            });
            
            circle.on('mouseout', () => {
                document.body.style.cursor = 'default';
            });
            
            circle.on('dragmove', (e) => {
                objectMove();
            })
            layer.add(circle);
        
            stage.add(layer);
        })
    } else {
        setTimeout(()=> {
            addToast('안녕하세요.');
        }, 500);
        setTimeout(()=> {
            addToast('object를 생성하시려면 create버튼을 눌러주세요.');
        }, 1500);
        setTimeout(()=> {
            addToast('object를 클릭하시면 데이터를 수정하실 수 있습니다.');
        }, 2500);
        setTimeout(()=> {
            addToast('자유롭게 이용해보세요.');
        }, 3500);
    }
}

let objectTarget = {};

let objDeleteList = [];

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

stageRect.on('click', setDefaultAll);

function setDefaultAll() {
    if (Object.getOwnPropertyNames(objectTarget).length !== 0) {
        objectTarget.setAttrs({
            draggable: false,
            strokeWidth: 2
        })
        layer.draw();
        object_positionX.value = 0;
        object_positionY.value = 0;
        object_positionZ.value = 0;
        objectRadiusRange.value = 0;
        objectRadiusText.value = 0;
        objectRoughnessRange.value = 0;
        objectRoughnessText.value = 0;
        objectRefractiveRange.value = 0;
        objectRefractiveText.value = 0;
        colorPicker.color.setChannel('rgb', 'r', 255);
        colorPicker.color.setChannel('rgb', 'g', 0);
        colorPicker.color.setChannel('rgb', 'b', 0);
        objects_sideBar.classList.remove('metal');
        objects_sideBar.classList.remove('nonMetal');
        objects_sideBar.classList.remove('glass');
        objectTarget = {};
    }
}

document.getElementById('object_reset').addEventListener('click', () => {objectReset()})

document.getElementById('object_random').addEventListener('click', () => {objectRandom()})

document.getElementById('object_delete').addEventListener('click', () => {objectDelete()});

document.getElementById('object_create').addEventListener('click', () => {addCircle()});

function objectReset() {
    if(confirm('초기화 됩니다. 계속 하시겠습니까?')) {
        setDefaultAll();
        layer.removeChildren();
        objectsData.objects = [];
        objectTarget = {};
        objDeleteList = [];
        circleIndex = 0;
        layer.add(stageRect);
        layer.add(rowLine);
        layer.add(columnLine);
            
        stage.add(layer);
    }
}

function objectRandom() {
    objects_sideBar.classList.remove('metal');
    objects_sideBar.classList.remove('nonMetal');
    objects_sideBar.classList.remove('glass');
    objects_sideBar.classList.add('random');
}

const objectRandomText = document.getElementById('objectRandomText');

document.getElementById('objectRandomSave').addEventListener('click', () => {objectRandomMake()})

objectRandomText.addEventListener('keyup', (e) => { if(e.keyCode === 13) {objectRandomMake()} })

function objectRandomMake() {
    if (Object.getOwnPropertyNames(objectTarget).length !== 0) {
        objectTarget.setAttrs({
            draggable: false,
            strokeWidth: 2
        })
        setDefaultAll();
    }
    for(let i = 0; i < parseInt(objectRandomText.value); i++) {
        addCircle('random');
    }
    objects_sideBar.classList.remove('random');
}

function objectDelete() {
    if (Object.getOwnPropertyNames(objectTarget).length !== 0) {
        objDeleteList.push(parseInt(objectTarget.attrs.name));
        objectTarget.remove();
        layer.draw();
        setDefaultAll();
    } else if(objectsData.objects.length === objDeleteList.length) {
        addToast('먼저 create버튼을 눌러 object를 만들어 주세요.', '#ea5e5e');
    } else {
        addToast('oject를 클릭후 변경해주세요.', '#6f9a8d');
    }
}

const objectRadiusText = document.getElementById('objectRadiusText');

function objectRadiusValue(v) {
    objectRadiusText.value = v;
    objectDataChanged('ra', v);
}

const objectRoughnessText = document.getElementById('objectRoughnessText');

function objectRoughnessValue(v) {
    objectRoughnessText.value = v;
    objectDataChanged('ro', v);
}

const objectRefractiveText = document.getElementById('objectRefractiveText');

function objectRefractiveValue(v) {
    objectRefractiveText.value = v;
    objectDataChanged('re', v);
}

let colorPicker = new iro.ColorPicker("#objectcolorPicker", {
    width: 130,
    color: "#ff0000",
    sliderHeight: 10
});

colorPicker.on('input:move', (color) => {
    if (Object.getOwnPropertyNames(objectTarget).length !== 0) {
        objectTarget.setAttrs({
            fill: color.rgbString
        });
        objectsData.objects[objectTarget.attrs.name].material.color[0] = color.rgb.r;
        objectsData.objects[objectTarget.attrs.name].material.color[1] = color.rgb.g;
        objectsData.objects[objectTarget.attrs.name].material.color[2] = color.rgb.b;
        layer.draw();
    } else if(objectsData.objects.length === objDeleteList.length) {
        addToast('먼저 create버튼을 눌러 object를 만들어 주세요.', '#ea5e5e');
    } else {
        addToast('oject를 클릭후 변경해주세요.', '#6f9a8d');
    }
});

const objects_sideBar = document.querySelector('.objects_sideBar');

document.getElementById('object_metal').addEventListener('click', () => {choseSurface(0)});
document.getElementById('object_nonMetal').addEventListener('click', () => {choseSurface(1)});
document.getElementById('object_glass').addEventListener('click', () => {choseSurface(2)});

function choseSurface(s) {
    if (Object.getOwnPropertyNames(objectTarget).length !== 0) {
        objects_sideBar.classList.remove('metal');
        objects_sideBar.classList.remove('nonMetal');
        objects_sideBar.classList.remove('glass');
        if(s === 0) {
            objects_sideBar.classList.add('metal');
            if(objectsData.objects[objectTarget.attrs.name].material.type == "lambertian") {
                let objcolor = objectTarget.attrs.fill;
                objectsData.objects[objectTarget.attrs.name].material = {
                    type: "metal",
                    color: [parseInt(objcolor.substring(objcolor.indexOf('(')+1, objcolor.indexOf(','))), parseInt(objcolor.substring(objcolor.indexOf(',')+1, objcolor.lastIndexOf(','))), parseInt(objcolor.substring(objcolor.lastIndexOf(',')+1, objcolor.indexOf(')')))],
                    roughness: 0.0
                }
            } else {
                objectsData.objects[objectTarget.attrs.name].material = {
                    type: "metal",
                    color: [255, 0, 0],
                    roughness: 0.0
                }
                objectTarget.setAttrs({
                    fill: 'rgb(255,0,0)'
                });
                colorPicker.color.setChannel('rgb', 'r', 255);
                colorPicker.color.setChannel('rgb', 'g', 0);
                colorPicker.color.setChannel('rgb', 'b', 0);
            }
            objectTarget.setAttrs({
                stroke: 'rgb(145,145,145)'
            });

        } else if (s === 1) {
            objects_sideBar.classList.add('nonMetal');
            if(objectsData.objects[objectTarget.attrs.name].material.type == "metal") {
                let objcolor = objectTarget.attrs.fill;
                objectsData.objects[objectTarget.attrs.name].material = {
                    type: "lambertian",
                    color: [parseInt(objcolor.substring(objcolor.indexOf('(')+1, objcolor.indexOf(','))), parseInt(objcolor.substring(objcolor.indexOf(',')+1, objcolor.lastIndexOf(','))), parseInt(objcolor.substring(objcolor.lastIndexOf(',')+1, objcolor.indexOf(')')))]
                }
            } else {
                objectsData.objects[objectTarget.attrs.name].material = {
                    type: "lambertian",
                    color: [255, 0, 0]
                }
                objectTarget.setAttrs({
                    fill: 'rgb(255,0,0)'
                });
                colorPicker.color.setChannel('rgb', 'r', 255);
                colorPicker.color.setChannel('rgb', 'g', 0);
                colorPicker.color.setChannel('rgb', 'b', 0);
            }
            objectTarget.setAttrs({
                stroke: 'rgb(105,105,105)'
            });
            
        } else if (s === 2) {
            objects_sideBar.classList.add('glass');
            objectsData.objects[objectTarget.attrs.name].material = {
                type: "dielectric",
                ref_idx: 0.0
            }
            objectTarget.setAttrs({
                fill: 'rgb(249,248,247)',
                stroke: 'rgb(232,231,227)'
            });
        }
        layer.draw();
    } else if(objectsData.objects.length === objDeleteList.length) {
        addToast('먼저 create버튼을 눌러 object를 만들어 주세요.', '#ea5e5e');
    } else {
        addToast('oject를 클릭후 변경해주세요.', '#6f9a8d');
    }
}

const object_positionX = document.getElementById('object_positionX');
const object_positionY = document.getElementById('object_positionY');
const object_positionZ = document.getElementById('object_positionZ');

const objectRadiusRange = document.getElementById('objectRadiusRange');
const objectRoughnessRange = document.getElementById('objectRoughnessRange');
const objectRefractiveRange = document.getElementById('objectRefractiveRange');

function getTargetData() {
    let obj = objectsData.objects[objectTarget.attrs.name];

    object_positionX.value = obj.location[0];
    object_positionY.value = obj.location[1];
    object_positionZ.value = obj.location[2];

    objectRadiusRange.value = obj.size;
    objectRadiusText.value = obj.size;
    
    objects_sideBar.classList.remove('metal');
    objects_sideBar.classList.remove('nonMetal');
    objects_sideBar.classList.remove('glass');

    if(obj.material.type === "metal") {
        objects_sideBar.classList.add('metal');

        colorPicker.color.setChannel('rgb', 'r', obj.material.color[0]);
        colorPicker.color.setChannel('rgb', 'g', obj.material.color[1]);
        colorPicker.color.setChannel('rgb', 'b', obj.material.color[2]);

        objectRoughnessRange.value = obj.material.roughness;
        objectRoughnessText.value = obj.material.roughness;

    } else if(obj.material.type === "lambertian") {
        objects_sideBar.classList.add('nonMetal');

        colorPicker.color.setChannel('rgb', 'r', obj.material.color[0]);
        colorPicker.color.setChannel('rgb', 'g', obj.material.color[1]);
        colorPicker.color.setChannel('rgb', 'b', obj.material.color[2]);

    } else if(obj.material.type === "dielectric") {
        objects_sideBar.classList.add('glass');

        objectRefractiveRange.value = obj.material.ref_idx;
        objectRefractiveText.value = obj.material.ref_idx;

    }
}

function objectMove() {
    object_positionX.value = parseInt(objectTarget.attrs.x);
    object_positionY.value =- parseInt(objectTarget.attrs.y);
    objectsData.objects[objectTarget.attrs.name].location[0] = parseInt(objectTarget.attrs.x);
    objectsData.objects[objectTarget.attrs.name].location[1] = -parseInt(objectTarget.attrs.y);
}

function objectDataChanged(k, v) {
    if (Object.getOwnPropertyNames(objectTarget).length !== 0) {
        let obj = objectsData.objects[objectTarget.attrs.name]
        if(k === 'x') {
            objectTarget.setAttrs({
                x:parseInt(object_positionX.value)
            })
            obj.location[0] = parseInt(object_positionX.value);
        } else if(k === 'y') {
            objectTarget.setAttrs({
                y:-parseInt(object_positionY.value)
            })
            obj.location[1] = parseInt(object_positionY.value);
        } else if(k === 'z') {
            obj.location[2] = parseInt(object_positionZ.value);
        } else if(k === 'ra') {
            objectTarget.setAttrs({
                radius: v
            })
            obj.size = parseInt(v);
        } else if(k === 'ro') {
            obj.material.roughness = parseFloat(v);
        } else if(k === 're') {
            obj.material.ref_idx = parseFloat(v);
        }

        layer.draw();
    } else if(objectsData.objects.length === objDeleteList.length) {
        addToast('먼저 create버튼을 눌러 object를 만들어 주세요.', '#ea5e5e');
    } else {
        addToast('oject를 클릭후 변경해주세요.', '#6f9a8d');
    }
}

document.getElementById('objectPositionDefault').addEventListener('click', () => {
    if (Object.getOwnPropertyNames(objectTarget).length !== 0) {
        let obj = objectsData.objects[objectTarget.attrs.name];
        obj.location[0] = 0;
        obj.location[1] = 0;
        obj.location[2] = 0;
        objectTarget.setAttrs({
            x:0,
            y:0
        })
        object_positionX.value = 0;
        object_positionY.value = 0;
        object_positionZ.value = 0;
        layer.draw();
        addToast('위치값이 기본값으로 변경되셨습니다.', '#000272');
    } else if(objectsData.objects.length === objDeleteList.length) {
        addToast('먼저 create버튼을 눌러 object를 만들어 주세요.', '#ea5e5e');
    } else {
        addToast('oject를 클릭후 변경해주세요.', '#6f9a8d');
    }
})

document.getElementById('objectRadiusDefault').addEventListener('click', () => {
    if (Object.getOwnPropertyNames(objectTarget).length !== 0) {
        objectTarget.setAttrs({
            radius: 10
        })
        objectsData.objects[objectTarget.attrs.name].size = 10;
        objectRadiusRange.value = 10;
        objectRadiusText.value = 10;
        layer.draw();
        addToast('크기값이 기본값으로 변경되셨습니다.', '#341677');
    } else if(objectsData.objects.length === objDeleteList.length) {
        addToast('먼저 create버튼을 눌러 object를 만들어 주세요.', '#ea5e5e');
    } else {
        addToast('oject를 클릭후 변경해주세요.', '#6f9a8d');
    }
})

document.getElementById('objectSurfaceDefault').addEventListener('click', () => {
    if (Object.getOwnPropertyNames(objectTarget).length !== 0) {
        objects_sideBar.classList.add('metal');
        if(objectsData.objects[objectTarget.attrs.name].material.type == "lambertian") {
            objects_sideBar.classList.remove('nonMetal');
            let objcolor = objectTarget.attrs.fill;
            objectsData.objects[objectTarget.attrs.name].material = {
                type: "metal",
                color: [parseInt(objcolor.substring(objcolor.indexOf('(')+1, objcolor.indexOf(','))), parseInt(objcolor.substring(objcolor.indexOf(',')+1, objcolor.lastIndexOf(','))), parseInt(objcolor.substring(objcolor.lastIndexOf(',')+1, objcolor.indexOf(')')))],
                roughness: 0.0
            }
        } else if(objectsData.objects[objectTarget.attrs.name].material.type == "dielectric") {
            objects_sideBar.classList.remove('glass');
            objectsData.objects[objectTarget.attrs.name].material = {
                type: "metal",
                color: [255, 0, 0],
                roughness: 0.0
            }
            objectTarget.setAttrs({
                fill: 'rgb(255,0,0)'
            });
            colorPicker.color.setChannel('rgb', 'r', 255);
            colorPicker.color.setChannel('rgb', 'g', 0);
            colorPicker.color.setChannel('rgb', 'b', 0);
        }
        objectTarget.setAttrs({
            stroke: 'rgb(145,145,145)'
        });
        layer.draw();
        addToast('재질이 기본재질로 변경되셨습니다.', '#a32f80');
    } else if(objectsData.objects.length === objDeleteList.length) {
        addToast('먼저 create버튼을 눌러 object를 만들어 주세요.', '#ea5e5e');
    } else {
        addToast('oject를 클릭후 변경해주세요.', '#6f9a8d');
    }
})

document.getElementById('objectRoughnessDefault').addEventListener('click', () => {
    if (Object.getOwnPropertyNames(objectTarget).length !== 0) {
        objectsData.objects[objectTarget.attrs.name].material.roughness = 0.0;
        objectRoughnessRange.value = 0.0;
        objectRoughnessText.value = 0.0;
        addToast('거칠기가 기본값으로 변경되셨습니다.', '#233714');
    } else if(objectsData.objects.length === objDeleteList.length) {
        addToast('먼저 create버튼을 눌러 object를 만들어 주세요.', '#ea5e5e');
    } else {
        addToast('oject를 클릭후 변경해주세요.', '#6f9a8d');
    }
})

document.getElementById('objectColorsDefault').addEventListener('click', () => {
    if (Object.getOwnPropertyNames(objectTarget).length !== 0) {
        objectsData.objects[objectTarget.attrs.name].material.color = [255, 0, 0];
        objectTarget.setAttrs({
            fill: 'rgb(255,0,0)'
        });
        colorPicker.color.setChannel('rgb', 'r', 255);
        colorPicker.color.setChannel('rgb', 'g', 0);
        colorPicker.color.setChannel('rgb', 'b', 0);
        layer.draw();
        addToast('색상이 기본색상으로 변경되셨습니다.', '#1fab89');
    } else if(objectsData.objects.length === objDeleteList.length) {
        addToast('먼저 create버튼을 눌러 object를 만들어 주세요.', '#ea5e5e');
    } else {
        addToast('oject를 클릭후 변경해주세요.', '#6f9a8d');
    }
})

document.getElementById('objectRefractiveDefault').addEventListener('click', () => {
    objectsData.objects[objectTarget.attrs.name].material.ref_idx = 0.0;
    objectRefractiveRange.value = 0.0;
    objectRefractiveText.value = 0.0;
    addToast('굴절률이 기본값으로 변경되셨습니다.', '#10316b');
})

document.getElementById('objectRandomDefault').addEventListener('click', () => {
    objectRandomText.value = 0;
    addToast('랜덤값이 기본값으로 변경되셨습니다.', '#3e64ff');
})

document.getElementById('object_front').addEventListener('click', () => {
    addToast('아직 없는 기능입니다.', '#F8D308; color: #000000'); // 추후에 변경할 예정
})

document.getElementById('object_right').addEventListener('click', () => {
    addToast('아직 없는 기능입니다.', '#F8D308; color: #000000'); // 추후에 변경할 예정
})

document.querySelectorAll('.sideBar_menu > ul > li').forEach((v, i) => {
    if(i !== 1) {
        v.addEventListener('click', () => {
            saveObjectsData();
            addToast('페이지 이동중입니다 잠시만 기다려주세요', undefined, 10);
        })
    }
})

function saveObjectsData() {
    if(objDeleteList.length > 0) {
        objDeleteList.sort((a, b) => {
            return b - a;
        });
        for(let v of objDeleteList) {
            objectsData.objects.splice(v, 1);
        }
    }
	sessionStorage.setItem('ORTData', JSON.stringify(objectsData));

}