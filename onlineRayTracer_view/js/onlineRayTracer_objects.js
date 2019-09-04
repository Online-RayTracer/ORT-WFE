
const objects_wrapper = document.getElementById('objects_wrapper');
let objects = document.querySelectorAll('.objects_wrapper > div');

function objectsClicked(el) {
    objects.forEach(objects => {
        objects.classList.remove('is-active');
        objects.removeAttribute('style');
    });

    el.classList.add('is-active');
}


objects.forEach((objects, index) => {
    objects.addEventListener('click', (e) => { objectsClicked(e.target)});
    objects.classList.contains('is-active') && objectsClicked(objects);
});

function objectAdd() {
    
}

window.addEventListener('load', () => {
    var canvas = document.getElementById("object_xyLocation");
    if(canvas.getContext){
        var ctx = canvas.getContext("2d");

        ctx.beginPath();
        ctx.moveTo(150, 0);
        ctx.lineTo(150, 150);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(0, 75);
        ctx.lineTo(300, 75);
        ctx.stroke();
    }
})

