'use strict';


function getCategoryList() {
    fetch('/get-category-list', {
        method: 'POST',
    }).then(function (responce) {
        return responce.text();
    }).then(function (body) {
        console.log(body);
        showCategoryList(JSON.parse(body));
    });
}

function showCategoryList(data) {
    console.log(data);
    let out = '<ul class="left-nav__ul"><li><a href="/">Главная</a></li>';
    for(let i =0;i<data.length;i++){
        out+=`<li><a href="/cat?id=${data[i]['id']}">${data[i]['category']}</a></li>`;
    }
    out+= '</ul>';
    document.querySelector('.left-nav').innerHTML = out;
}

getCategoryList();