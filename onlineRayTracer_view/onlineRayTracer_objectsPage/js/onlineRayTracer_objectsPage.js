const objects_box = document.getElementById('objects_box');

let objectsData = JSON.parse(sessionStorage.getItem('ORTData'));

window.addEventListener('load', () => {
    objects_box.style = `width: ${objectsData.resolution_width}px;height: ${objectsData.resolution_length}px;`;
})

let resolution_width = objectsData.resolution_width;
let resolution_length = objectsData.resolution_length;

let stage = new Konva.Stage({
    container: 'objects_box',
    width: resolution_width,
    height: resolution_length
});

function addCircle(layer) {
    let color = 'red';

    let randX = Math.random() * stage.width();
    let randY = Math.random() * stage.height();
    let circle = new Konva.Circle({
        x: randX,
        y: randY,
        radius: 6,
        fill: color,
        name: 'i.toString()'
    });

    layer.add(circle);

    stage.add(layer);
    stage.add(dragLayer);
}

let layersArr = [];
let layer = new Konva.Layer();

layersArr.push(layer);

let dragLayer = new Konva.Layer();

var tooltipLayer = new Konva.Layer();

var tooltip = new Konva.Text({
    text: '',
    fontFamily: 'Calibri',
    fontSize: 12,
    padding: 5,
    visible: false,
    fill: 'black',
    opacity: 0.75,
    textFill: 'white'
});

tooltipLayer.add(tooltip);
stage.add(tooltipLayer);

for (let n = 0; n < 1; n++) {
    addCircle(layer);
}

// stage.add(layer);
// stage.add(dragLayer);

stage.on('mousedown', (evt) => {
    let circle = evt.target;
    let layer = circle.getLayer();

    circle.moveTo(dragLayer);
    layer.draw();
    circle.startDrag();
});

layer.on('mousemove', function(e) {
    // update tooltip
    var mousePos = stage.getPointerPosition();
    tooltip.position({
        x: mousePos.x + 5,
        y: mousePos.y - 10
    });
    tooltip.text(
        'node: ' + e.target.name() + ', color: ' + e.target.fill()
    );
    tooltip.show();
    tooltipLayer.draw();
});

layer.on('mouseout', function() {
    tooltip.hide();
    tooltipLayer.draw();
});

document.getElementById('object_create').addEventListener('click', () => {addCircle(layer)})

/*
var stage = new Konva.Stage({
    container: 'container',
    width: width,
    height: height
});

var circlesLayer = new Konva.Layer(); = layer
var tooltipLayer = new Konva.Layer(); = 이건 새로운거

for (var i = 0; i < 10000; i++) {
    var color = red;

    var randX = Math.random() * stage.width();
    var randY = Math.random() * stage.height();
    var circle = new Konva.Circle({
        x: randX,
        y: randY,
        radius: 3,
        fill: color,
        name: i.toString()
    });

    circlesLayer.add(circle);
}

var tooltip = new Konva.Text({
    text: '',
    fontFamily: 'Calibri',
    fontSize: 12,
    padding: 5,
    visible: false,
    fill: 'black',
    opacity: 0.75,
    textFill: 'white'
});

tooltipLayer.add(tooltip);
stage.add(circlesLayer);
stage.add(tooltipLayer);

circlesLayer.on('mousemove', function(e) {
    // update tooltip
    var mousePos = stage.getPointerPosition();
    tooltip.position({
        x: mousePos.x + 5,
        y: mousePos.y + 5
    });
    tooltip.text(
        'node: ' + e.target.name() + ', color: ' + e.target.fill()
    );
    tooltip.show();
    tooltipLayer.draw();
});
circlesLayer.on('mouseout', function() {
    tooltip.hide();
    tooltipLayer.draw();
});
*/





const objectRadiusText = document.getElementById('objectRadiusText');

function objectRadiusValue(v) {
    objectRadiusText.value = v;
}

const objectRoughnessText = document.getElementById('objectRoughnessText');

function objectRoughnessValue(v) {
    objectRoughnessText.value = v;
}

let colorPicker = new iro.ColorPicker("#objectcolorPicker", {
    width: 130,
    color: "#ff0000",
    sliderHeight: 10
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
    } else if (s === 1) {
        objects_sideBar.classList.add('nonMetal');
    } else if (s === 2) {
        objects_sideBar.classList.add('glass');
    }
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
