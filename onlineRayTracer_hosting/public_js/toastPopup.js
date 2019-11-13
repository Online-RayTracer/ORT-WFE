const toastPopup_wrapper = document.createElement('div');
toastPopup_wrapper.classList.add('toastPopup_wrapper');
toastPopup_wrapper.innerHTML = `<ul id="toastPopupWrapper"></ul>`;
document.body.prepend(toastPopup_wrapper);

function addToast(v, time, color) {
	let toastBox = document.createElement('li');
    toastBox.innerText = v;

    if(color !== undefined) {
        toastBox.style.cssText += `background-color:${color};`;
    } else {
        toastBox.style.cssText += `background-color:#57a99a;`
    }

    if(time !== undefined) {
        console.log('true');
        time *= 1000;
    } else {
        console.log('nope');
        time = 3000;
    }
    console.log(time)

	toastBox.addEventListener('click', () => {
		toastBox.remove();
    })

    setTimeout(() => {
        toastBox.style.cssText += 'opacity:0;';
    }, (time-600));

	setTimeout(() => {
		toastBox.remove();
    }, time);
    
	toastPopupWrapper.prepend(toastBox);
}

/*
    let toastBoxStyle = '';
	let toastBox = document.createElement('li');
    toastBox.innerText = v;

    if(color !== undefined) {
        toastBoxStyle += `backgroundColor: ${color};`;
    } else {
        toastBoxStyle += `background-color: #57a99a;`
    }

    if(time !== undefined) {
        time *= 1000;
    } else {
        time = 3000;
    }

	toastBox.addEventListener('click', () => {
		toastBox.remove();
    })

    setTimeout(() => {
        toastBoxStyle += 'opacity: 0;';
        toastBox.setAttribute('style', toastBoxStyle);
    }, (time-600));

	setTimeout(() => {
		toastBox.remove();
	}, time);
	toastPopupWrapper.prepend(toastBox);

*/