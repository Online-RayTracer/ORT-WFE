let renderData = JSON.parse(sessionStorage.getItem('ORTData'));

window.addEventListener('load', () => {
    if(renderData == null) {
        location.href = '/html/onlineRayTracer_startPage.html'
    }
})

const renderButton = document.getElementById('renderButton');

renderButton.addEventListener('click', function() {
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
    // axios.post(`/image`, {
    //     data: renderData,
    // })
    // .then((response) => {
    //     if(response.status === 200) {
    //         console.log('Success');
            getImage();
    //     } else {
    //         console.log(`Error: status code[${response.status}]`);
    
    //     }
    // })
    // .catch((reject) => {
    //     console.log("데이터 보내기에 실패하셨습니다." + reject + " and " + Promise.reject(reject.response));
    this.removeEventListener('click', arguments.callee);
    // })
})

function getImage() {
    let i = 0;
    let timer = setInterval(() => {
        renderButton.innerText = `${i}%`;
        i++;
        if(i === 101) {
            clearInterval(timer);
            timer = null;
            showImage();
        }
    }, 100);
}

const renderContents = document.getElementById('renderContents');

const renderImageWrapper = document.getElementById('renderImageWrapper');
const renderTextWrapper = document.getElementById('renderTextWrapper');

function showImage() {
    // axios.get(`??`, {
    //     params: {
            
    //     }
    // })
    // .then((response) => {
    //     if(response.status === 200) {
    //         console.log('success');

    //     } else {
    //         console.log(`Error: status code[${response.status}]`);

    //     }
    // })
    // .catch((reject) => {
    //     console.log("??" + reject + " and " + Promise.reject(reject.response));

    // })
    let renderImageBox = document.createElement('img');
    renderImageBox.setAttribute('id', 'renderImage');
    renderImageBox.setAttribute('class', 'render_image');
    renderImageBox.setAttribute('src', '/src/start_background.png');

    renderImageBox.addEventListener('click', imageClicked);

    renderImageWrapper.appendChild(renderImageBox);

    renderTextWrapper.innerHTML = `
        <a id="renderRestrat" class="render_restart">scene reset and re-start</a>
        <a id="renderDownload" class="render_download">scene download</a>
        <a id="renderContinue" class="render_continue">continue edit scene</a>
    `

    renderButton.innerText = `Download`;
    renderContents.classList.add('render_finished');
    renderButton.addEventListener('click', imageDownload);
}

const popup_showImg = document.getElementById('popup_showImg');
const popup_showImgImage = document.getElementById('popup_showImgImage');

function imageClicked() {
    popup_showImg.classList.remove('hidden');
    popup_showImgImage.setAttribute('src', '/src/start_background.png');
    popup_showImgImage.style.height = popup_showItemImg.naturalHeight;
}

popup_showImg.addEventListener('click', () => {
    popup_showImg.classList.add('hidden');
})

function imageDownload() {
    addToast('다운로드가 완료되셨습니다.', '#28B100; color: #B4FFDC'); // 추후에 변경할 예정

}

