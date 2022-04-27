'use strict';
try {


    document.querySelector('#shop-order').addEventListener('submit', function (el) {
        el.preventDefault();
        let username = document.querySelector('#username').value.trim();
        let phone = document.querySelector('#phone').value.trim();
        let email = document.querySelector('#email').value.trim();
        let address = document.querySelector('#address').value.trim();

        if (!document.querySelector('#rule').checked) {
            //С правилами не согласен
            Swal.fire({
                title: 'Предупреждение',
                text: 'Примите правила',
                // type: 'info',
                icon: 'error',
                confirmButtonText: 'ОК',
            });
            return false;
        }
        if (username == '' || phone == '' || email == '' || address == '') {
            Swal.fire({
                title: 'Предупреждение',
                text: 'Заполните все поля',
                // type: 'info',
                icon: 'error',
                confirmButtonText: 'ОК',
            });
        }

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
                        type: 'info',
                        // icon: 'error',
                        confirmButtonText: 'ОК',
                    });
                } else {
                    Swal.fire({
                        title: 'Возникли проблемы',
                        text: 'Ошибка',
                        // type: 'info',
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