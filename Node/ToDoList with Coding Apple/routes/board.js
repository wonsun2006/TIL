var router = require('express').Router();

// 모든 router에 미들웨어 적용 router.use(페이지, 미들웨어)

router.get('/sports', function(req, res){
    res.send('스포츠 용품 파는 페이지입니다.');
 });
 
 router.get('/game', function(req, res){
    res.send('게임 용품 파는 페이지입니다.');
 }); 

 module.exports = router;