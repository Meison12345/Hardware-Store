'use strict';
const express = require('express');
const app = express();
const port = 5000;

/** Настройка области видимости папок*/
app.use(express.static('public'));
/** Задаём шаблонизатор*/
app.set('view engine', 'pug');
/** Подключение модуля Mysql2*/
const mysql = require('mysql2');
/** Настраивание модуля*/
app.use(express.json());
/** Подключение nodemailer*/
const nodemailer = require('nodemailer');
/**Подключение SweetAlert2 */
// const Swal = require('sweetalert2');

let con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'shop'
});

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

app.listen(port, () => {
    console.log(`node express work on ${port}`);
});

//Главная
app.get('/', function(req, res) {
    let cat = new Promise(function(resolve, reject) {
        con.query(
            "select id, name, cost, image, category from (select id,name,cost,image,category, if(if(@curr_category != category, @curr_category := category, '') != '', @k := 0, @k := @k + 1) as ind   from goods, ( select @curr_category := '' ) v ) goods where ind < 3",
            function(error, result, field) {
                if (error) return reject(error);
                resolve(result);
            }
        );
    });
    let catDescription = new Promise(function(resolve, reject) {
        con.query(
            "SELECT * FROM category",
            function(error, result, field) {
                if (error) return reject(error);
                resolve(result);
            }
        );
    });
    Promise.all([cat, catDescription]).then(function(value) {
        console.log(value[1]);
        res.render('index', {
            goods: JSON.parse(JSON.stringify(value[0])),
            cat: JSON.parse(JSON.stringify(value[1])),
        });
    });
});

//Категории
app.get('/cat', (req, res) => {
    let catId = req.query.id;
    let cat = new Promise((res, rej) => {
        con.query('SELECT * FROM category WHERE id = ' + catId, (error, result) => {
            if (error) rej(error);
            res(result);
        });
    });

    let goods = new Promise((res, rej) => {
        con.query('SELECT * FROM goods WHERE category=' + catId, (error, result) => {
            if (error) rej(error);
            res(result);
        });
    });

    Promise.all([cat, goods]).then((value) => {
        console.log(value);
        res.render('cat', {
            cat: JSON.parse(JSON.stringify(value[0])),
            goods: JSON.parse(JSON.stringify(value[1]))
        })
    });
});

//Товары
app.get('/goods', function(req, res) {
    // console.log(req.query.id);
    con.query('SELECT * FROM goods WHERE id=' + req.query.id, function(error, result, fiels) {
        if (error) throw error;
        res.render('goods', {
            goods: JSON.parse(JSON.stringify(result)),
        });
    });
});

//Корзина
app.get('/order', function(req, res) {
    res.render('order');
});



app.post('/get-category-list', function(req, res) {
    // console.log(req);
    con.query('SELECT id, category FROM category', function(error, result, fiels) {
        if (error) throw error;
        // console.log(result);
        res.json(result);
    });
});


app.post('/get-goods-info', function(req, res) {
    // console.log(req.body.key);
    if (req.body.key.length != 0) {
        con.query('SELECT id, name, image, cost FROM shop.goods WHERE id IN(' + req.body.key.join(',') + ');', function(error, result, fiels) {
            if (error) throw error;
            console.log(result);
            let goods = {};
            for (let i = 0; i < result.length; i++) {
                goods[result[i]['id']] = result[i];
            }
            res.json(goods);
        });
    } else {
        res.send('0');
    }
});


app.post('/finish-order', function(req, res) {
    console.log(req.body);
    if (req.body.key.length != 0) {
        let key = Object.keys(req.body.key);
        con.query(
            'SELECT id,name,cost FROM goods WHERE id IN (' + key.join(',') + ')',
            function(error, result, fields) {
                if (error) throw error;
                console.log(result);
                sendMail(req.body, result).catch(console.error);
                res.send('1');
            });
    } else {
        res.send('0');
    }
});

async function sendMail(data, result) {
    let res = '<h2>Order in lite shop</h2>';
    let total = 0;
    let res_text = '';
    for (let i = 0; i < result.length; i++) {
        res += `<p>${result[i]['name']} - ${data.key[result[i]['id']]} - ${result[i]['cost'] * data.key[result[i]['id']]} ₽</p>`;
        total += result[i]['cost'] * data.key[result[i]['id']];
    }
    console.log(res);
    res += '<hr>';
    res += `Итого ${total} ₽`;
    res += `<hr>Телефон: ${data.phone}`;
    res += `<hr>Имя: ${data.username}`;
    res += `<hr>Адрес: ${data.address}`;
    res += `<hr>Почта: ${data.email}`;

    let testAccount = await nodemailer.createTestAccount();

    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: testAccount.user, // generated ethereal user
            pass: testAccount.pass // generated ethereal password
        }
    });

    let mailOption = {
        from: '<89606138203@mail.ru>',
        to: "89606138203@mail.ru," + data.email,
        subject: "Магазин ТехноЭра",
        text: res_text,
        html: res
    };

    let info = await transporter.sendMail(mailOption);
    console.log("MessageSent: %s", info.messageId);
    console.log("PreviewSent: %s", nodemailer.getTestMessageUrl(info));
    return true;
}