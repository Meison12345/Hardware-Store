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
/** Настраивание модул*/
app.use(express.json());
/** Подключение nodemailer*/
const nodemailer = require('nodemailer');

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

app.get('/', (req, res) => {
    // console.log(req);
    // let cat = new Promise(resolve,reject)
    con.query("SELECT * FROM shop.goods", (error, result, field) => {
        if (error) throw error;
        // console.log(result);
        // resolve(result);
        let goods = {};
        for (let i = 0; i < result.length; i++) {
            goods[result[i]['id']] = result[i];
        }
        // console.log(goods);
        console.log(JSON.parse(JSON.stringify(goods)));
        res.render('index', {
            foo: 2,
            bar: 'hello',
            goods: JSON.parse(JSON.stringify(goods))
        });
    });
});


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