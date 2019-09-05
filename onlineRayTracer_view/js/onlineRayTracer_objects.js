// import { ENETDOWN } from "constants";

// import { isContext } from "vm";

// const objects_wrapper = document.getElementById('objects_wrapper');
// let objects = document.querySelectorAll('.objects_wrapper > div');

// function objectsClicked(el) {
//     objects.forEach(objects => {
//         objects.classList.remove('is-active');
//         objects.removeAttribute('style');
//     });

//     el.classList.add('is-active');
// }


// objects.forEach((objects, index) => {
//     objects.addEventListener('click', (e) => { objectsClicked(e.target)});
//     objects.classList.contains('is-active') && objectsClicked(objects);
// });

// function objectAdd() {
    
// }

const object_xLocationBox = document.getElementById('object_xLocationBox');
const object_yLocationBox = document.getElementById('object_yLocationBox');
const canvas = document.getElementById("object_xyLocation");
const ctx = canvas.getContext("2d");
let ispresed = false;

window.addEventListener('load', () => {
    canvas.addEventListener("mousedown", object_xyDraw_down);
    canvas.addEventListener("mouseup", object_xyDraw_up);
    canvas.addEventListener("mousemove", object_xyDraw);
    canvas.addEventListener("mouseout", object_xyDraw_up);
    if(canvas.getContext){
        ctx.strokeStyle = '#707070';
        ctx.lineWidth = 3;
        ctx.moveTo(125, 0);
        ctx.lineTo(125, 250);
        ctx.moveTo(0, 125);
        ctx.lineTo(250, 125);
        ctx.stroke();
        ctx.beginPath();
        ctx.strokeStyle = '#FF0000';
        ctx.lineWidth = 3;
        ctx.arc(125, 125, 15, 0, Math.PI * 2);
        ctx.moveTo(115, 135);
        ctx.lineTo(135, 115);
        ctx.moveTo(115, 115);
        ctx.lineTo(135, 135);
        ctx.stroke();
        ctx.beginPath();
    }
})

function object_xyDraw_down() {
    ispresed = true;
}

function object_xyDraw_up() {
    ispresed = false;
}


function getMousePos(canvas, evt) {
    let rect = canvas.getBoundingClientRect(),
        scaleX = canvas.width / rect.width,
        scaleY = canvas.height / rect.height;

    return {
        x: (evt.clientX - rect.left) * scaleX,
        y: (evt.clientY - rect.top) * scaleY
    }
}


function object_xyDraw(evt) {
    if(ispresed) {
        let mousePos = getMousePos(canvas, evt);
        posx = mousePos.x;
        posy = mousePos.y;
        
        ctx.beginPath();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#707070';
        ctx.moveTo(125, 0);
        ctx.lineTo(125, 250);
        ctx.moveTo(0, 125);
        ctx.lineTo(250, 125);
        ctx.stroke();
        ctx.beginPath();
        ctx.strokeStyle = '#FF0000';
        ctx.lineWidth = 3;
        ctx.arc(posx, posy, 15, 0, Math.PI * 2);
        ctx.moveTo((posx+10), (posy-10));
        ctx.lineTo((posx-10), (posy+10));
        ctx.moveTo((posx+10), (posy+10));
        ctx.lineTo((posx-10), (posy-10));
        ctx.stroke();
        object_xLocationBox.value = Math.round(posx)-125;
        object_yLocationBox.value = Math.round(posy)-125;
        console.log(`x: ${Math.round(posx)}, u: ${Math.round(posy)}`);
    }
  }





