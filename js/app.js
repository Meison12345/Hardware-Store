'use strict';
const formButton = document.querySelector('.form-button');

formButton.addEventListener('click', function (e) {
    e.preventDefault();
    const nameBrand =  document.querySelector('#name-brand').value.trim();
    const townCreated = document.querySelector('#town-created').value.trim();
    const brandView = document.querySelector('#brand-view').value;
    const nameFace = document.querySelector('#name-face').value.trim();
    const countShop = document.querySelector('#count-shop').value.trim();
    const contactFace = document.querySelector('#contact-face').value.trim();
    const contacnNumber = document.querySelector('#contact-number').value.trim();
    const contactEmail = document.querySelector('#contact-email').value.trim();

    // if()

    console.log(nameBrand,
        townCreated,
        brandView,
        nameFace,
        countShop,
        contactFace,
        contacnNumber,
        contactEmail,
        formButton);
})