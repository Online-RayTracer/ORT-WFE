document.getElementById('mainContentsStartButton').addEventListener('click', () => {
    let ORTData = {
        name: "",
        width: 0,
        height: 0,
        samples: 100,
        cam_location: [0.000, 0.000, 0.000],
        cam_lookat: [0.000, 0.000, 0.000],
        cam_aperture: 0.0,
        light_color: [0.000, 0.000, 0.000],
        objects: [] /*{
            location: [],
            size: 0,
            material: {
                type: "metal or lambertian or dielectric",
                color: [],
                roughness: 0.0,
                ref_idx: 0
            }
        }*/
    }
    sessionStorage.setItem('ORTData', JSON.stringify(ORTData));
    location.href = '../onlineRayTracer_scenePage/onlineRayTracer_scenePage.html';
})