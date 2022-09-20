const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
require('dotenv').config();
var passport = require('passport');
var LocalStrategy = require('passport-local');
var crypto = require('crypto');

const authRouter = require('./routes/auth');

const app = express();

app.use(bodyParser.urlencoded({extended : true}));
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));

app.use('/auth', authRouter);

let db;

MongoClient.connect(process.env.DB_URL, (error, client)=>{
    if (error) return console.log(error);

    db = client.db('todoapp');

    app.listen(8080, ()=>{
        console.log('Connection Success!');
    });
    
});

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

app.post('/write', (req, res)=>{
    db.collection('counter').findOne({name: "게시물갯수"}, (error, result)=>{
        if(error){
            res.send('DB Data Error');
        }

        todoData = {
            _id: result.totalPost+1,
            제목: req.body.title,
            작성자: req.body.writer,
            날짜: req.body.date
        }

        db.collection('post').insertOne(todoData, (error, result)=>{
            if(error){
                res.send('DB Data Error');
            }

            db.collection('counter').updateOne({name: "게시물갯수"},{$inc : {totalPost:1}},(error, result)=>{
                if(error){
                    res.send('DB Data Error');
                }
                res.redirect('/list');
            });
        });
    });
});

app.delete('/delete', (req, res)=>{
    const idToDelete = parseInt(req.body._id);

    db.collection('post').deleteOne({_id : idToDelete},(error, result)=>{
        if(error){
            alert('failed to delete todo');
        }else{
            res.status(200).send({message : '삭제 성공'});
        }
    });
})

