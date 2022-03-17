'use strict';
window.addEventListener('load', function() {
    const masUrl = [
        'https://www.youtube.com/embed/Mipe1PJBnss',
        'https://www.youtube.com/embed/e3_02Y2lfYQ',
        'https://www.youtube.com/embed/PoSGmTECgF0',
        'https://www.youtube.com/embed/DSC70VDGvBQ',
    ];

    function getRndUrl() {
        return masUrl[parseInt(Math.random(Math.floor()) * masUrl.length)];
    }

    function insertRndUrl() {
        let data = `<iframe width="700" height="500" src=${getRndUrl()} frameborder="0"  allow="accelerometer autoplay clipboard-write encrypted-media gyroscope; picture-in-picture fs" allowfullscreen></iframe>`;
        return data;
    }
    // background-size: contain;
    try {
        document.querySelector('#video').innerHTML = insertRndUrl();
        // document.querySelector('.ytp-cued-thumbnail-overlay-image').style.backgroundSize = 'contain'
    } catch (error) {
        console.log(error);
    }

});