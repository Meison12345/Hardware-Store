'use strict';

var express = require('express');

var app = express();
var port = 5000;
/** Настройка области видимости папок*/

app.use(express["static"]('public'));
/** Задаём шаблонизатор*/

app.set('view engine', 'pug');
/** Подключение модуля Mysql2*/

var mysql = require('mysql2');
/** Настраивание модуля*/


app.use(express.json());
/** Подключение nodemailer*/

var nodemailer = require('nodemailer');

var con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'shop'
});
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
app.listen(port, function () {
  console.log("node express work on ".concat(port));
}); //Главная

app.get('/', function (req, res) {
  var cat = new Promise(function (resolve, reject) {
    con.query("select id, name, cost, image, category from (select id,name,cost,image,category, if(if(@curr_category != category, @curr_category := category, '') != '', @k := 0, @k := @k + 1) as ind   from goods, ( select @curr_category := '' ) v ) goods where ind < 3", function (error, result, field) {
      if (error) return reject(error);
      resolve(result);
    });
  });
  var catDescription = new Promise(function (resolve, reject) {
    con.query("SELECT * FROM category", function (error, result, field) {
      if (error) return reject(error);
      resolve(result);
    });
  });
  Promise.all([cat, catDescription]).then(function (value) {
    console.log(value[1]);
    res.render('index', {
      goods: JSON.parse(JSON.stringify(value[0])),
      cat: JSON.parse(JSON.stringify(value[1]))
    });
  });
}); //Категории

app.get('/cat', function (req, res) {
  var catId = req.query.id;
  var cat = new Promise(function (res, rej) {
    con.query('SELECT * FROM category WHERE id = ' + catId, function (error, result) {
      if (error) rej(error);
      res(result);
    });
  });
  var goods = new Promise(function (res, rej) {
    con.query('SELECT * FROM goods WHERE category=' + catId, function (error, result) {
      if (error) rej(error);
      res(result);
    });
  });
  Promise.all([cat, goods]).then(function (value) {
    console.log(value);
    res.render('cat', {
      cat: JSON.parse(JSON.stringify(value[0])),
      goods: JSON.parse(JSON.stringify(value[1]))
    });
  });
}); //Товары

app.get('/goods', function (req, res) {
  // console.log(req.query.id);
  con.query('SELECT * FROM goods WHERE id=' + req.query.id, function (error, result, fiels) {
    if (error) throw error;
    res.render('goods', {
      goods: JSON.parse(JSON.stringify(result))
    });
  });
}); //Корзина

app.get('/order', function (req, res) {
  res.render('order');
});
app.post('/get-category-list', function (req, res) {
  // console.log(req);
  con.query('SELECT id, category FROM category', function (error, result, fiels) {
    if (error) throw error; // console.log(result);

    res.json(result);
  });
});
app.post('/get-goods-info', function (req, res) {
  // console.log(req.body.key);
  if (req.body.key.length != 0) {
    con.query('SELECT id, name, image, cost FROM shop.goods WHERE id IN(' + req.body.key.join(',') + ');', function (error, result, fiels) {
      if (error) throw error;
      console.log(result);
      var goods = {};

      for (var i = 0; i < result.length; i++) {
        goods[result[i]['id']] = result[i];
      }

      res.json(goods);
    });
  } else {
    res.send('0');
  }
});