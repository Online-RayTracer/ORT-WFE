let renderData = JSON.parse(sessionStorage.getItem('ORTData'));

window.addEventListener('load', () => {
    if(renderData == null) {
        location.href = '/html/onlineRayTracer_startPage.html'
    }
})

const renderButton = document.getElementById('renderButton');

let ar  = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

let imgName = '';
let timer;

renderButton.addEventListener('click', function() {
    console.log('Rendering Start Time : ', new Date());
    for(let i = 0; i < 3; i++) {
        renderData.light_color[i] = parseFloat((renderData.light_color[i] / 255).toFixed(3));
    }
    renderData.objects.forEach((v) => {
        if(v.material.type === "metal" || v.material.type === "lambertian") {
            for(let i = 0; i < 3; i++) {
                v.material.color[i] = parseFloat((v.material.color[i] / 255).toFixed(3));
            }
        }
    });

    
    addToast('레이트레이싱 중입니다.', '#23374d');
    setTimeout(() => {
        addToast('커피 한잔 마시면서 기다리고 계세요..', '#7A4F38', 7);
    }, 3000)
    renderButton.innerText = `0%`;
    let i = 1;
    timer = setInterval(() => {
        renderButton.innerText = `${i}%`;
        i++;
        if(i === 100) {
            clearInterval(timer);
            timer = null;
        }
    }, 5000);

    for(let i = 0; i < 16; i++) {
        imgName += ar.charAt(Math.floor(Math.random() * ar.length));
    };
    
    axios.post(`http://15.165.0.14:8080/api/renderer`, {
        name: imgName += '.png',
        width: renderData.width,
        height: renderData.height,
        samples: renderData.samples,
        cam_location: renderData.cam_location,
        cam_lookat: renderData.cam_lookat,
        cam_aperture: renderData.cam_aperture,
        cam_vfov: renderData.cam_vfov,
        light_color: renderData.light_color,
        objects: renderData.objects
    })
    .then((response) => {
        if(response.status === 200) {
            console.log('Success', response);
            showImage(response.data);

        } else {
            console.log(`Error: status code[${response.status}]`);
    
        }
    })
    .catch((reject) => {
        console.log("렌더링에 실패하셨습니다." + reject + " and " + Promise.reject(reject.response));
        clearInterval(timer);
        timer = null;
        renderButton.innerText = 'ERR';
    })
    this.removeEventListener('click', arguments.callee);
})

const renderContents = document.getElementById('renderContents');

const renderImageWrapper = document.getElementById('renderImageWrapper');
const renderTextWrapper = document.getElementById('renderTextWrapper');

let responseImage;

function showImage(img) {
    clearInterval(timer);
    timer = null;
    responseImage = img;
    console.log('Rendering End Time : ', new Date())
    
    let renderImageBox = document.createElement('img');
    renderImageBox.setAttribute('id', 'renderImage');
    renderImageBox.setAttribute('class', 'render_image');
    renderImageBox.setAttribute('src', responseImage);

    renderImageBox.addEventListener('click', imageClicked);

    renderImageWrapper.appendChild(renderImageBox);

    renderTextWrapper.innerHTML = `
        <a id="renderRestrat" class="render_restart">scene reset and re-start</a>
        <a id="renderDownload" class="render_download">scene download</a>
        <a id="renderContinue" class="render_continue">continue edit scene</a>
    `

    renderButton.innerText = `Download`;
    renderContents.classList.add('render_finished');
    renderButton.addEventListener('click', () => {
        addToast('다운로드가 완료되셨습니다.', '#28B100; color: #B4FFDC'); // 추후에 변경할 예정
    });
    renderButton.setAttribute('download',`${renderData.name}`);
    renderButton.setAttribute('href', responseImage);
}

const popup_showImg = document.getElementById('popup_showImg');
const popup_showImgImage = document.getElementById('popup_showImgImage');

function imageClicked() {
    let popup_showImg = document.createElement('div');
    let popup_showImgImage = document.createElement('img');

    popup_showImg.setAttribute('id', 'popup_showImg');
    popup_showImg.setAttribute('class', 'popup-showImg');
    popup_showImg.addEventListener('click', () => {
        popup_showImg.remove();
    })

    popup_showImgImage.setAttribute('id', 'popup_showImgImage');
    popup_showImgImage.setAttribute('class', 'popup-showImgImage');
    popup_showImgImage.setAttribute('src', responseImage);
    popup_showImgImage.style.height = popup_showImgImage.naturalHeight;

    popup_showImg.appendChild(popup_showImgImage);
    
    document.body.appendChild(popup_showImg);

}

