const sceneContents = document.querySelector('.sceneContents');

const sceneName = document.getElementById('sceneName');
const sceneResolutionX = document.getElementById('sceneResolutionX');
const sceneResolutionY = document.getElementById('sceneResolutionY');
const sceneQualityRange = document.getElementById('sceneQualityRange');
const sceneQualityText = document.getElementById("sceneQualityText");
let sceneData = JSON.parse(sessionStorage.getItem('ORTData'));

window.addEventListener('load', () => {
    if(sceneData == null) {
        location.href = '../onlineRayTracer_startPage/onlineRayTracer_startPage.html'
    }
	sceneName.value = sceneData.name;
	sceneResolutionX.value = sceneData.width;
	sceneResolutionY.value = sceneData.height;
	sceneQualityRange.value = sceneData.samples;
	sceneQualityText.value = sceneData.samples;
	colorPicker.color.setChannel('rgb', 'r', sceneData.light_color[0]);
	colorPicker.color.setChannel('rgb', 'g', sceneData.light_color[1]);
	colorPicker.color.setChannel('rgb', 'b', sceneData.light_color[2]);
	sceneColorBox.setAttribute('style', `background-color: ${colorPicker.color.hexString};`)
	sceneColorText.innerText = colorPicker.color.hexString;
})

let colorPicker = new iro.ColorPicker("#scenecolorPicker", {
    width: 220,
	color: "#ff0000",
	sliderHeight: 10
});

const sceneColorBox = document.getElementById('sceneColorBox');
const sceneColorText = document.getElementById('sceneColorText');

colorPicker.on('input:move', (color) => {
	sceneData.light_color[0] = color.rgb.r;
	sceneData.light_color[1] = color.rgb.g;
	sceneData.light_color[2] = color.rgb.b;
	sceneColorBox.setAttribute('style', `background-color: ${colorPicker.color.hexString};`)
	sceneColorText.innerText = colorPicker.color.hexString;
});

document.getElementById('sceneSaveButton').addEventListener('click', sceneSave);

function sceneSave(k) {
	sceneContents.setAttribute('class', 'sceneContents');

	if(sceneName.value === '') {
		addToast('Name의 값을 정해주세요.');
		sceneContents.classList.add('fillName');
	} else if(sceneResolutionX.value === '' && sceneResolutionY.value === '') {
		addToast('Resolution의 값을 정해주세요.');
		sceneContents.classList.add('fillResolution');
	} else if(sceneQualityText.value === '') {
		addToast('Quality의 값을 정해주세요.');
		sceneContents.classList.add('fillQuality');
	} else {
		saveSceneData();
		addToast('데이터 저장이 완료되었습니다.');
		switch(k) {
			case 0: location.href = '../onlineRayTracer_objectsPage/onlineRayTracer_objectsPage.html'; break;
			case 2: location.href = '../onlineRayTracer_cameraPage/onlineRayTracer_cameraPage.html'; break;
			case 3: location.href = '../onlineRayTracer_renderPage/onlineRayTracer_renderPage.html'; break;
		}
	}
}

document.querySelectorAll('.sideBar_menu > ul > li').forEach((v, i) => {
    if(i !== 1) {
        v.addEventListener('click', () => {sceneSave(i);})
    }
})

function saveSceneData() {
	sceneData.name = sceneName.value;
	sceneData.width = sceneResolutionX.value;
	sceneData.height = sceneResolutionY.value;
	sceneData.samples = sceneQualityText.value;
	sessionStorage.setItem('ORTData', JSON.stringify(sceneData));
}

function sceneQualityRangeValue(v) {
	sceneQualityText.value = v;
}

const toastPopupWrapper = document.getElementById('toastPopupWrapper');

function addToast(v) {
	let toastBox = document.createElement('li');
	toastBox.innerText = v;
	toastBox.addEventListener('click', () => {
		toastBox.remove();
	})
	setTimeout(()=> {
		toastBox.remove();
	}, 3000);
	toastPopupWrapper.prepend(toastBox);
}