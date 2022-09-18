const express = require('express');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

const app = express();

let db;

MongoClient.connect(process.env.DB_URL, (error, client)=>{
    if (error) return console.log(error);

    db = client.db('todoapp');

    app.listen(8080, ()=>{
        console.log('Connection Success!');
    });
    
});

app.set('view engine', 'ejs');

app.get('/', (req, res)=>{
    res.render('index.ejs');
});

app.get('/list', (req, res)=>{
    db.collection('post').find().toArray((error, result)=>{
        res.render('list.ejs', { posts : result });
    });
});

app.get('/write-form', (req, res)=>{
    res.render('write-form.ejs');
}); 