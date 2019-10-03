document.getElementById('mainContentsStartButton').addEventListener('click', () => {
    let ORTData = {
        name: "",
        resolution_width: 0,
        resolution_length: 0,
        quality: 0,
        camera_location: "",
        camera_watch_location: "",
        camera_iris: 0,
        background_transparency: false,
        background_color: "",
        object: {
            location: "",
            size: 0,
            material: {
                type: 0,
                color: "",
                Roughness: 0.0,
                Refractive_index: 0
            }
        }
    }
    sessionStorage.setItem('ORTData', JSON.stringify(ORTData));
    location.href = '../onlineRayTracer_scenePage/onlineRayTracer_scenePage.html';
})