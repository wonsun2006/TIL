const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const passport = require('passport');

const router = express.Router();

let db;

MongoClient.connect(process.env.DB_URL, (error, client)=>{
    if (error) return console.log(error);

    db = client.db('todoapp');
    
});

router.get('/login', (req,res)=>{
    if(req.user){
        res.redirect('/');
    }else{
        res.render('login.ejs', {user:req.user});
    }
});

router.get('/register-form', (req,res)=>{
    res.render('register-form.ejs', {user:req.user});
});

router.post('/register', (req,res)=>{
    if(req.body.password != req.body.passwordcheck){
        res.write('<head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"></head>');
        res.write("<script>alert('비밀번호 확인이 틀렸습니다.')</script>");
        res.write("<script>window.location=\"/auth/register-form\"</script>");
    }else{
        let insertData = {
            id : req.body.id,
            pw : req.body.password
        }
        db.collection('login').findOne({id:insertData.id}, (error, result)=>{
            if(error){
                console.log(error);
                return false;
            }
            if(!result){
                db.collection('login').insertOne(insertData, (error, result)=>{
                    if(error){
                        console.log(error);
                        alert(error);
                        res.redirect('/register-form');
                    }
                    res.write('<head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"></head>');
                    res.write("<script>alert('회원가입이 완료되었습니다.')</script>");
                    res.write("<script>window.location=\"/auth/login\"</script>");
                });
            }else{
                res.write('<head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"></head>');
                res.write("<script>alert('중복된 아이디입니다.')</script>");
                res.write("<script>window.location=\"/auth/register-form\"</script>");
            }
            
        });
    }
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login-fail'
}), function(req, res){
    console.log(req.user+' login success.');
});

router.get('/login-fail',(req,res)=>{
    res.render('login-fail.ejs', {user:req.user});
});

router.get('/logout', function(req,res,next){
    req.logout((err)=>{
        if(err) next(err);
        req.session.destroy(()=>{
            res.redirect('/');
        });
    });
});

module.exports = router;