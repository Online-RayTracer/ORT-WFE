document.getElementById('mainContentsStartButton').addEventListener('click', makeORTData);
document.getElementById('mainContentsExploreButton').addEventListener('click', () => {
    var body = document.getElementsByTagName("body")[0];
    window.scroll({
        behavior: 'smooth',
        top: (document.getElementById('startPageExplore').offsetTop)
    });
})
document.getElementById('exploreStartButton').addEventListener('click', makeORTData);

function makeORTData() {
    let ORTData = {
        name: "",
        width: 0,
        height: 0,
        samples: 100,
        cam_location: [0.000, 0.000, 0.000],
        cam_lookat: [0.000, 0.000, 0.000],
        cam_aperture: 0.0,
        cam_vfov: 0.0,
        light_color: [255.000, 255.000, 255.000],
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
    location.href = '/html/onlineRayTracer_scenePage.html';
}