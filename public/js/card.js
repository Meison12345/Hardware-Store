'use strict';

let cart = {};

document.querySelectorAll('.add-to-cart').forEach(function(el) {
    el.addEventListener('click', addToCart);
});

if (localStorage.getItem('cart')) {
    cart = JSON.parse(localStorage.getItem('cart'));
    ajaxGetGoodsInfo();
}

function addToCart() {
    let goodsId = this.dataset.goods_id;
    if (cart[goodsId]) {
        cart[goodsId]++;
    } else {
        cart[goodsId] = 1;
    }
    console.log(cart);
    ajaxGetGoodsInfo();
}

function ajaxGetGoodsInfo() {
    updateLocalStorageCart();
    fetch('/get-goods-info', {
            method: 'POST',
            body: JSON.stringify({
                key: Object.keys(cart)
            }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(function(responce) {
            return responce.text();
        })
        .then(function(body) {
            console.log(body);
            showCart(JSON.parse(body));
        })
}

// function showCart(data) {
//     let out = '<table><tbody>';
//     let total = 0;
//     for (let key in cart) {
//         out += `<tr><td><img src=${data[key]['image']} alt=${data[key]['name']}><a href="/goods?id=${key}">${data[key]['name']}</a></td></tr>`;
//     }
//     out += '</tbody></table>';
//     document.querySelector('#cart-nav').innerHTML += out;
// }

function showCart(data) {
    let out = '';
    let total = 0;
    for (let key in cart) {
        // out += `<tr><td colspan="4"><a href="/goods?id=${key}">${data[key]['name']}</a></tr>`;
        // out += `<tr><td><i class="far fa-minus-square cart-minus" data-goods_id="${key}"></i></td>`;
        // out += `<td>${cart[key]}</td>`;
        // out += `<td><i class="far fa-plus-square cart-plus" data-goods_id="${key}"></i></td>`;
        // out += `<td>${formatPrice(data[key]['cost'] * cart[key])} ₽ </td>`
        // out += '</tr>';
        // out += `<img src="img/${data[key]['image']}">`;

        out += `<div class="cart-order">
                    <a href="/goods?id=${key}" class="cart-order-link">
                        <img src="img/${data[key]['image']}" width="100" class="cart-oreder-image">
                    ${data[key]['name']}</a>
                        <div class="cart-order-bottom">
                            <p class="cart-order-text">КОЛИЧЕСТВО: ${cart[key]}</p>
                            <i class="far fa-minus-square cart-minus cart-oreder-btn" data-goods_id="${key}"></i>
                            <i class="far fa-plus-square cart-plus cart-oreder-btn" data-goods_id="${key}"></i>
                        </div>
                </div>`;

        total += cart[key] * data[key]['cost'];
    }
    out += `<h3>ИТОГО: ${formatPrice(total)} ₽</h3>`;
    try {
        document.querySelector('#cart-nav').innerHTML = out;
    } catch (error) {
        console.log(error);
    }
    document.querySelectorAll('.cart-minus').forEach(function(element) {
        element.addEventListener('click', cartMinus);
    });
    document.querySelectorAll('.cart-plus').forEach(function(element) {
        element.addEventListener('click', cartPlus);
    });
}

function cartPlus() {
    let goodsId = this.dataset.goods_id;
    cart[goodsId]++;
    ajaxGetGoodsInfo();
}


function cartMinus() {
    let goodsId = this.dataset.goods_id;
    if (cart[goodsId] - 1 > 0) {
        cart[goodsId]--;
    } else {
        delete(cart[goodsId]);
    }
    ajaxGetGoodsInfo();
}

function updateLocalStorageCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function formatPrice(price) {
    return price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$& ');
}