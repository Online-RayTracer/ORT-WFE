const objects_box = document.getElementById('objects_box');

let objectsData = JSON.parse(sessionStorage.getItem('ORTData'));

window.addEventListener('load', () => {
    objects_box.style = `width: ${objectsData.width}px; height: ${objectsData.height}px;`;
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

let stage = new Konva.Stage({
    container: 'objects_box',
    width: objectsData.width,
    height: objectsData.height
});

let circleIndex = objectsData.objects.length;

function addCircle(layer) {

    let randX = Math.random() * stage.width();
    let randY = Math.random() * stage.height();
    let radius = 6;
    let color = 'rgb(255,0,0)';
    let circle = new Konva.Circle({
        x: randX,
        y: randY,
        radius: radius,
        fill: color,
        name: `${circleIndex}`,
        stroke: 'white',
        strokeWidth: 1,
        draggable: false
    });

    layer.add(circle);

    stage.add(layer);

    circleIndex++;
    objectStructure = {
        location: [parseInt(randX), parseInt(randY), 000],
        size: radius,
        material: {
            type: "metal",
            color: [255, 0, 0],
            roughness: 0.0,
        }
    }
    objectsData.objects.push(objectStructure);
}



let layer = new Konva.Layer();
var dragLayer = new Konva.Layer();

stage.add(dragLayer)

// for (let n = 0; n < 1; n++) {
//     addCircle(layer);
// }

function putObjects() {
    if(objectsData.objects.length > 0) {
        objectsData.objects.forEach((v, i) => {
            let circle = new Konva.Circle({
                x: v.location[0],
                y: v.location[1],
                radius: v.size,
                fill: `rgb(${v.material.color[0]},${v.material.color[1]},${v.material.color[2]})`,
                name: `${i}`,
                stroke: 'white',
                strokeWidth: 1,
                draggable: false
            })
            layer.add(circle);
        
            stage.add(layer);
        })
    }
}

let objectTarget = {};

let objDeleteList = [];

// stage.on('click', (e) => {
//     objectInitialization();
// })

layer.on('click', (e) => {
    // event.stopPropagation();
    console.log('it clicked', e.target);
    if (Object.getOwnPropertyNames(objectTarget).length !== 0) {
        objectTarget.setAttrs({
            draggable: false,
            strokeWidth: 1
        })
    }
    objectTarget = e.target;
    getTargetData();
    objectTarget.setAttrs({
        draggable: true,
        strokeWidth: 4
    })
    layer.draw();
})

layer.on('mouseover', function() {
    document.body.style.cursor = 'pointer';
});

layer.on('mouseout', function() {
    document.body.style.cursor = 'default';
});

layer.on('dragmove', (e) => {
    // objectTarget.moveTo(dragLayer);
    // stage.draw();
    objectMove();
})

document.getElementById('object_random').addEventListener('click', () => {objectRandom()})

document.getElementById('object_delete').addEventListener('click', () => {objectDelete()});

document.getElementById('object_create').addEventListener('click', () => {addCircle(layer)});

function objectRandom() {
    objects_sideBar.classList.remove('metal');
    objects_sideBar.classList.remove('nonMetal');
    objects_sideBar.classList.remove('glass');
    objects_sideBar.classList.add('random');
}

function objectDelete() {
    if (Object.getOwnPropertyNames(objectTarget).length !== 0) {
        objDeleteList.push(parseInt(objectTarget.attrs.name));
        objectTarget.remove();
        layer.draw();
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
    }
});

const objects_sideBar = document.querySelector('.objects_sideBar');

document.getElementById('object_metal').addEventListener('click', () => {choseSurface(0)});
document.getElementById('object_nonMetal').addEventListener('click', () => {choseSurface(1)});
document.getElementById('object_glass').addEventListener('click', () => {choseSurface(2)});

function choseSurface(s) {
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
        }
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
        }
        
    } else if (s === 2) {
        objects_sideBar.classList.add('glass');
        objectsData.objects[objectTarget.attrs.name].material = {
            type: "dielectric",
            ref_idx: 0.0
        }
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
        objectRoughnessRange.value = obj.material.roughness;

    } else if(obj.material.type === "lambertian") {
        objects_sideBar.classList.add('nonMetal');

        colorPicker.color.setChannel('rgb', 'r', obj.material.color[0]);
        colorPicker.color.setChannel('rgb', 'g', obj.material.color[1]);
        colorPicker.color.setChannel('rgb', 'b', obj.material.color[2]);

    } else if(obj.material.type === "dielectric") {
        objects_sideBar.classList.add('glass');

        objectRefractiveRange.value = obj.material.ref_idx;
        objectRefractiveRange.value = obj.material.ref_idx;

    }
}

function objectMove() {
    object_positionX.value = parseInt(objectTarget.attrs.x);
    object_positionY.value = parseInt(objectTarget.attrs.y);
    objectsData.objects[objectTarget.attrs.name].location[0] = parseInt(objectTarget.attrs.x);
    objectsData.objects[objectTarget.attrs.name].location[1] = parseInt(objectTarget.attrs.y);
}

function objectDataChanged(k, v) {
    let obj = objectsData.objects[objectTarget.attrs.name]
    if(k === 'x') {
        objectTarget.setAttrs({
            x:parseInt(object_positionX.value)
        })
        obj.location[0] = parseInt(object_positionX.value);
    } else if(k === 'y') {
        objectTarget.setAttrs({
            y:parseInt(object_positionY.value)
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
        console.log('init!', v);
        obj.material.roughness = parseFloat(v);
    } else if(k === 're') {
        obj.material.ref_idx = parseFloat(v);
    }

    layer.draw();
}

function objectInitialization() {
    objectTarget = {};
    object_positionX.value = 0;
    object_positionY.value = 0;
    object_positionZ.value = 0;
    objectRadiusRange.value = 0;
    objectRadiusText.value = 0;
}

document.querySelectorAll('.sideBar_menu > ul > li').forEach((v, i) => {
    if(i >= 1) {
        v.addEventListener('click', () => {saveObjectsData();})
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

// let nowZoom = 100;

// function zoomOut() {   // 화면크기축소
//     nowZoom = nowZoom - 10;
//     if(nowZoom <= 70) nowZoom = 70;   // 화면크기 최대 축소율 70%
//     zooms();
// }

// function zoomIn() {   // 화면크기확대
//     nowZoom = nowZoom + 20;
//     if(nowZoom >= 200) nowZoom = 200;   // 화면크기 최대 확대율 200%
//     zooms();
// }

// function zoomReset() {
//     nowZoom = 100;   // 원래 화면크기로 되돌아가기
//     zooms();
// }

// const objects_main = document.querySelector('.objects_main');

// function zooms() {
//     objects_main.style.zoom = nowZoom + "%";
//     if(nowZoom == 70) {
//         alert("더 이상 축소할 수 없습니다.");   // 화면 축소율이 70% 이하일 경우 경고창
//     }
//     if(nowZoom == 200) {
//         alert("더 이상 확대할 수 없습니다.");   // 화면 확대율이 200% 이상일 경우 경고창
//     }
// }

// let ctrlPressed = false;
// let scrollUpDown = objects_main.scrollTop;
// let scroll = objects_main.scrollTop;

// window.addEventListener('keydown', (e) => {
//     if (e.keyCode === 17) {
//         console.log('ctrlDown');
//         ctrlPressed = true;
//     }
// });

// window.addEventListener('keyup', (e) => {
//     if (e.keyCode === 17) {
//         console.log('ctrlUp');
//         ctrlPressed = false;
//     }
// });




// objects_main.addEventListener('scroll', (e) => {
//     scroll = objects_main.scrollTop;
//     if(scroll < scrollUpDown && ctrlPressed) {
//         console.log('scrollUp');
//         nowZoom = nowZoom + 20;
//         if(nowZoom >= 200) nowZoom = 200;   // 화면크기 최대 확대율 200%
//         zooms();
//     } else if(ctrlPressed) {
//         console.log('scrollDown');   // 화면크기축소
//         nowZoom = nowZoom - 10;
//         if(nowZoom <= 70) nowZoom = 70;   // 화면크기 최대 축소율 70%
//         zooms();
//     }

//     scrollUpDown = scroll;
// });

// new ScrollZoom($('#slide'),4,0.5)
// function ScrollZoom(container,max_scale,factor){
//     var target = container.children().first()
//     var size = {w:target.width(),h:target.height()}
//     var pos = {x:0,y:0}
//     var zoom_target = {x:0,y:0}
//     var zoom_point = {x:0,y:0}
//     var scale = 1
//     target.css('transform-origin','0 0')
//     target.on("mousewheel DOMMouseScroll",scrolled)

//     function scrolled(e){
//         var offset = container.offset()
//         zoom_point.x = e.pageX - offset.left
//         zoom_point.y = e.pageY - offset.top

//         e.preventDefault();
//         var delta = e.delta || e.originalEvent.wheelDelta;
//         if (delta === undefined) {
//         //we are on firefox
//         delta = e.originalEvent.detail;
//         }
//         delta = Math.max(-1,Math.min(1,delta)) // cap the delta to [-1,1] for cross browser consistency

//         // determine the point on where the slide is zoomed in
//         zoom_target.x = (zoom_point.x - pos.x)/scale
//         zoom_target.y = (zoom_point.y - pos.y)/scale

//         // apply zoom
//         scale += delta*factor * scale
//         scale = Math.max(1,Math.min(max_scale,scale))

//         // calculate x and y based on zoom
//         pos.x = -zoom_target.x * scale + zoom_point.x
//         pos.y = -zoom_target.y * scale + zoom_point.y


//         // Make sure the slide stays in its container area when zooming out
//         if(pos.x>0)
//             pos.x = 0
//         if(pos.x+size.w*scale<size.w)
//             pos.x = -size.w*(scale-1)
//         if(pos.y>0)
//             pos.y = 0
//         if(pos.y+size.h*scale<size.h)
//             pos.y = -size.h*(scale-1)

//         update()
//     }

//     function update(){
//         target.css('transform','translate('+(pos.x)+'px,'+(pos.y)+'px) scale('+scale+','+scale+')')
//     }
// }
