var router = require('express').Router();

router.get('/shirts', function(req, res){
    res.send('셔츠 파는 페이지입니다.');
 });
 
 router.get('/pants', function(req, res){
    res.send('바지 파는 페이지입니다.');
 }); 

 module.exports = router;