'use strict';
try {
    document.querySelector('#shop-order').addEventListener('submit', function (el) {
        el.preventDefault();
        let username = document.querySelector('#username').value.trim();
        let phone = document.querySelector('#phone').value.trim();
        let email = document.querySelector('#email').value.trim();
        let address = document.querySelector('#address').value.trim();

        // Регулярные выражения для проверки номера телефона и адреса электронной почты
        const phonePattern = /^(\+7|8)\s?\d{2,4}\s?\d{7}$/;
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

        if (!document.querySelector('#rule').checked) {
            // С правилами не согласен
            Swal.fire({
                title: 'Предупреждение',
                text: 'Примите правила',
                icon: 'error',
                confirmButtonText: 'ОК',
            });
            return false;
        }
        if (username === '' || !phone.match(phonePattern) || !email.match(emailPattern) || address === '') {
            Swal.fire({
                title: 'Предупреждение',
                text: 'Заполните все поля корректно',
                icon: 'error',
                confirmButtonText: 'ОК',
            });
            return false;
        }

        console.log(username, phone, email, address);

        fetch('/finish-order', {
            method: 'POST',
            body: JSON.stringify({
                'username': username,
                'phone': phone,
                'address': address,
                'email': email,
                'key': JSON.parse(localStorage.getItem('cart'))
            }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then(function (response) {
                return response.text();
            })
            .then(function (body) {
                if (body == 1) {
                    Swal.fire({
                        title: 'Всё хорошо',
                        text: 'Удачно',
                        icon: 'info',
                        confirmButtonText: 'ОК',
                    });
                } else {
                    Swal.fire({
                        title: 'Возникли проблемы',
                        text: 'Ошибка',
                        icon: 'error',
                        confirmButtonText: 'ОК',
                    });
                }
            })
    });

} catch (error) {}





// function getLocalStorage() {
//     let a = JSON.parse(localStorage.getItem('cart'));
//     return a;
// }

// function showCart(data) {
//     getLocalStorage();
//     let out = '<table><tbody>';
//     let total = 0;
//     for (let key in cart) {
//         out += `<tr><td><a href="/goods?id=${key}">${data[key]['name']}</a></td></tr>`;
//     }
//     out += '</tbody></table>';
//     document.querySelector('.product-title').innerHTML += out;
// }
// document.querySelector('#cart-nav').innerHTML += showCart();