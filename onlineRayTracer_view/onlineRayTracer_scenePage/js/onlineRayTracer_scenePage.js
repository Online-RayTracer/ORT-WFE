const sceneContents = document.querySelector('.sceneContents');

const sceneName = document.getElementById('sceneName');
const sceneResolutionX = document.getElementById('sceneResolutionX');
const sceneResolutionY = document.getElementById('sceneResolutionY');
const sceneQualityRange = document.getElementById('sceneQualityRange');
const sceneQualityText = document.getElementById("sceneQualityText");
let sceneData = JSON.parse(sessionStorage.getItem('ORTData'));

window.addEventListener('load', () => {
	sceneName.value = sceneData.name;
	sceneResolutionX.value = sceneData.width;
	sceneResolutionY.value = sceneData.height;
	sceneQualityRange.value = sceneData.samples;
	sceneQualityText.value = sceneData.samples;
})

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
			case 1: location.href = '../onlineRayTracer_cameraPage/onlineRayTracer_cameraPage.html'; break;
			case 2: location.href = '../onlineRayTracer_backgroundPage/onlineRayTracer_backgroundPage.html'; break;
			case 3: location.href = '../onlineRayTracer_renderPage/onlineRayTracer_renderPage.html'; break;
		}
	}
}

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