"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const mongodb_1 = require("mongodb");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const dotenv = require("dotenv");
const passport = require("passport");
const passport_local_1 = require("passport-local");
const session = require("express-session");
dotenv.config();
// const express = require('express');
// const MongoClient = require('mongodb').MongoClient;
// const bodyParser = require('body-parser');
// const methodOverride = require('method-override');
// require('dotenv').config();
// const passport = require('passport');
// const LocalStrategy = require('passport-local');
// // const crypto = require('crypto');
// const session = require('express-session');
const authRouter = require('./routes/auth');
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
app.use(session({ secret: '비밀코드(추후 수정 필요)', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static("public"));
app.use('/auth', authRouter);
let db;
if (process.env != undefined) {
    if (process.env.DB_URL != undefined) {
        mongodb_1.MongoClient.connect(process.env.DB_URL, (error, client) => {
            if (error)
                return console.log(error);
            db = client.db('todoapp');
            app.listen(process.env.PORT, () => {
                console.log(`Connection on ${process.env.PORT}`);
            });
        });
    }
    else {
        console.log('Cannot find DB_URL');
    }
}
else {
    console.log('There is no .env data');
}
passport.use(new passport_local_1.Strategy({
    usernameField: 'id',
    passwordField: 'password',
    session: true,
    passReqToCallback: false, // 아이디 비번 말고도 다른 정보 검증 시
}, function (id, password, done) {
    db.collection('login').findOne({ id: id }, function (error, result) {
        if (error)
            return done(error);
        if (!result)
            return done(null, false, { message: '존재하지않는 아이디입니다.' });
        // 비밀번호 직접 비교시 보안 매우 약함 (암호화 필요)
        if (password == result.pw) {
            return done(null, result);
        }
        else {
            return done(null, false, { message: '비밀번호가 다릅니다.' });
        }
    });
}));
passport.serializeUser(function (user, done) {
    if ((user === null || user === void 0 ? void 0 : user.id) != undefined) {
        done(null, user.id);
    }
});
passport.deserializeUser(function (id, done) {
    db.collection('login').findOne({ id: id }, function (error, result) {
        done(null, result);
    });
});
function isLogin(req, res, next) {
    if (req.user) {
        next();
    }
    else {
        res.send('로그인이 안되어있습니다.');
    }
}
app.get('/', (req, res) => {
    res.render('index.ejs', { user: req.user });
});
app.get('/list', (req, res) => {
    db.collection('post').aggregate([
        {
            $lookup: {
                from: "login",
                localField: "작성자",
                foreignField: "_id",
                as: "user_inform"
            }
        }
    ]).toArray((error, result) => {
        res.render('list.ejs', { user: req.user, posts: result });
    });
    // db.collection('post').find().toArray((error, result)=>{
    //     res.render(
    //         'list.ejs', 
    //         { 
    //             user: req.user,
    //             posts: result
    //         });
    // });
});
app.get('/write-form', (req, res) => {
    res.render('write-form.ejs', { user: req.user });
});
app.post('/write', isLogin, (req, res) => {
    db.collection('counter').findOne({ name: "게시물갯수" }, (error, result) => {
        if (error) {
            res.send('DB Data Error');
        }
        todoData = {
            _id: result.totalPost + 1,
            제목: req.body.title,
            작성자: req.user._id,
            날짜: req.body.date
        };
        db.collection('post').insertOne(todoData, (error, result) => {
            if (error) {
                res.send('DB Data Error');
            }
            db.collection('counter').updateOne({ name: "게시물갯수" }, { $inc: { totalPost: 1 } }, (error, result) => {
                if (error) {
                    res.send('DB Data Error');
                }
                res.redirect('/list');
            });
        });
    });
});
app.delete('/delete', (req, res) => {
    const idToDelete = parseInt(req.body._id);
    let user_search_key = "";
    if (req.user) {
        user_search_key = req.user._id;
    }
    db.collection('post').deleteOne({ _id: idToDelete, 작성자: user_search_key }, (error, result) => {
        if (error) {
            res.send(error);
        }
        else if (result.deletedCount == 0) {
            res.send({ message: 'no data' });
        }
        else {
            res.status(200).send({ message: 'success' });
        }
    });
    // db.collection('post').deleteOne({_id : idToDelete},(error, result)=>{
    //     if(error){
    //         alert('failed to delete todo');
    //     }else{
    //         res.status(200).send({message : '삭제 성공'});
    //     }
    // });
});
