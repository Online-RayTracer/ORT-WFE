const sceneContents = document.querySelector('.sceneContents');

const sceneName = document.getElementById('sceneName');
const sceneResolutionX = document.getElementById('sceneResolutionX');
const sceneResolutionY = document.getElementById('sceneResolutionY');
const sceneQualityText = document.getElementById("sceneQualityText");
let sceneData = JSON.parse(sessionStorage.getItem('ORTData'));

window.addEventListener('load', () => {
	sceneName.value = sceneData.name;
	sceneResolutionX.value = sceneData.resolution_width;
	sceneResolutionY.value = sceneData.resolution_length;
	// sceneQualityText.value = sceneData.
})



document.getElementById('sceneSaveButton').addEventListener('click', sceneSave);
document.getElementById('goto_objectsP').addEventListener('click', gotoObjectsPage);


function saveSceneData() {
	sceneData.name = sceneName.value;
	sceneData.resolution_width = sceneResolutionX.value;
	sceneData.resolution_length = sceneResolutionY.value;
	sessionStorage.setItem('ORTData', JSON.stringify(sceneData));
}

let isSceneDataSaved = false;

function sceneSave() {
	sceneContents.setAttribute('class', 'sceneContents');

	if(sceneName.value === '') {
		alert('Name의 값을 정해주세요.');
		sceneContents.classList.add('fillName');
	} else if(sceneResolutionX.value === '' && sceneResolutionY.value === '') {
		alert('Resolution의 값을 정해주세요.');
		sceneContents.classList.add('fillResolution');
	} else if(sceneQualityText.value === '') {
		alert('Quality의 값을 정해주세요.');
		sceneContents.classList.add('fillQuality');
	} else {
		saveSceneData();
		isceneDataSaved = true;
		alert('데이터 저장이 완료되었습니다.');
	}
}

function gotoObjectsPage() {
	if (isSceneDataSaved) {
		location.href = '../onlineRayTracer_objectsPage/onlineRayTracer_objectsPage.html';
	} else if(sceneName.value === '') {
		alert('Name의 값을 정해주세요.');
		sceneContents.classList.add('fillName');
	} else if(sceneResolutionX.value === '' && sceneResolutionY.value === '') {
		alert('Resolution의 값을 정해주세요.');
		sceneContents.classList.add('fillResolution');
	} else if(sceneQualityText.value === '') {
		alert('Quality의 값을 정해주세요.');
		sceneContents.classList.add('fillQuality');
	} else {
		sceneSave();
		location.href = '../onlineRayTracer_objectsPage/onlineRayTracer_objectsPage.html';
	}
}

function sceneQualityRangeValue(v) {
	sceneQualityText.value = v;
}


