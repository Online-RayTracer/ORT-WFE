document.getElementById('mainContentsStartButton').addEventListener('click', () => {
    let ORTData = {
        name: "",
        width: 0,
        height: 0,
        samples: 100,
        cam_location: [0.000, 0.000, 0.000],
        cam_lookat: [0.000, 0.000, 0.000],
        camera_aperture: 0,
        bg_transparent: false,
        bg_color: [],
        objects: [] /*{
            location: [],
            size: 0,
            material: {
                type: 1,
                color: [],
                roughness: 0.0,
                ref_idx: 0
            }
        }*/
    }
    sessionStorage.setItem('ORTData', JSON.stringify(ORTData));
    location.href = '../onlineRayTracer_scenePage/onlineRayTracer_scenePage.html';
})