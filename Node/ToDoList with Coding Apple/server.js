const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const res = require('express/lib/response');
const app = express();
app.use(bodyParser.urlencoded({extended : true}));
app.set('view endgine','ejs');
app.use('/public',express.static('public'));
const methodOverride = require('method-override');
app.use(methodOverride('_method'));
const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');
require('dotenv').config();
const http = require('http').createServer(app);
const { Server } = require("socket.io");
const io = new Server(http);

app.use(session({secret : '비밀코드', resave : true, saveUninitialized : false}));
// 미들웨어 : 요청과 응답 사이 실행하는 코드
app.use(passport.initialize());
app.use(passport.session());

var db;
MongoClient.connect(process.env.DB_URL,
 function(error, client){
    if(error){
        return console.log(error);
    }

    db = client.db('todoapp');

    http.listen(process.env.PORT, function(){
        console.log('listening on ' + process.env.PORT.toString());
    });
});

app.use('/shop', require('./routes/shop.js'));
app.use('/board/sub', require('./routes/board.js'));

app.get('/', function(req, res){
    res.render(__dirname+'/views/index.ejs');
});

app.get('/write', function(req,res){
    res.render(__dirname+'/views/write.ejs');
});


app.get('/list', function(req, res){
    // toArray()는 모두 찾는 경우
    db.collection('post').find().toArray(function(error, result){
        res.render('list.ejs', { posts : result });
    });
});

app.get('/search', function(req, res){
    // 정규식 /문자열/ : 문자열 포함한 것 모두 찾음 find({제목:/req.query.value/})
    // 검색 엔진처럼 구글 검색 방식 적용 ex) 개발 -외주 => "개발"은 들어가고 "외주"는 안들어가는 검색 결과 표시
    // text index는 한중일어에 안좋음. 조사가 많이 들어가는데, MongoDB에서는 정확한 단어 검색하는 듯이 작동
    // 1. 시간 정보로 검색 2. text index를 다르게 만들기 (2글자 이상 검색해야함) 3. MongoDB search index 만들기 서비스
    var search_option = [
        {
            $search:{
                index: 'titleSearch',
                text:{
                    query: req.query.value,
                    path: "제목" // 여러개는 ['제목', '날짜'] 로 가능
                }
            }
        }
        // {$sort:{ _id:1}},
        // {$limit:10},
        // {$project:{제목:1, _id:0, score: {$meta:"searchScore"}}} // 1은 포함 0은 제외, score도 받을 수 있음
    ]
    // aggregate: 여러개 조건 가능
    db.collection('post').aggregate(search_option).toArray(function(error, result){
        res.render('search.ejs', { posts : result });
    });
});

app.delete('/delete', function(req, res){
    req.body._id = parseInt(req.body._id);
    console.log("사용자 id"+req.user._id);
    var data_to_delete = {_id: req.body._id, 작성자: req.user._id}

    db.collection('post').deleteOne(data_to_delete, function(error, result){
        console.log('삭제완료');
        if(error){console.log(error);}
        // 요청 성공 코드 : 200, 요청 코드 실패 : 400
        res.status(200).send({message : '성공했습니다'});
    });
});

// :id -> url parameter, req.params.id
app.get('/detail/:id', function(req, res){
    db.collection('post').findOne({_id : parseInt(req.params.id)}, function(error, result){
        res.render('detail.ejs', {data : result}) ;
    });
    
});

app.get('/edit/:id', function(req, res){
    db.collection('post').findOne({_id : parseInt(req.params.id)}, function(error, result){
        res.render('edit.ejs', {post : result});
    })
    
})

app.put('/edit', function(req, res){
    // $set 없으면 추가, 아니면 업데이트
    db.collection('post').updateOne({_id : parseInt(req.body.id)}, { $set : {제목 : req.body.title, 날짜 : req.body.date}},
    function(error, result){
        console.log('수정완료');
        res.redirect('/list');
    });
});

app.get('/login', function(req,res){
    res.render('login.ejs');
});

// passport.authenticate() "검사해달라"
app.post('/login', passport.authenticate('local', {
    failureRedirect : '/fail'
}), function(req, res){
    console.log(req.user);
    res.redirect('/');
});

app.get('/mypage', isLogin, function(req,res){
    // console.log(req.user);
    res.render('mypage.ejs');
});

function isLogin(req, res, next){
    if(req.user){
        next();
    }else{
        res.send('로그인이 안되어있습니다.');
    }
}



passport.use(new LocalStrategy({
    usernameField: 'id',
    passwordField: 'pw',
    session: true, // 로그인 후 세션 저장할지
    passReqToCallback: false, // 아이디 비번 말고도 다른 정보 검증 시
  }, function (id, pw, done) {
    //console.log(입력한아이디, 입력한비번);
    db.collection('login').findOne({ id: id }, function (error, result) {
      // done(에러, 사용자 정보,)  
      if (error) return done(error);
    
      if (!result) return done(null, false, { message: '존재하지않는 아이디입니다.' });
      // 비밀번호 직접 비교시 보안 매우 약함 (암호화 필요)
      if (pw == result.pw) {
        return done(null, result);
      } else {
        return done(null, false, { message: '비밀번호가 다릅니다.' });
      }
    })
}));

// id로 세션을 저장시키는 코드 (로그인 성공시 실행)
// 결과가 user로 저장됨.
passport.serializeUser(function(user, done){
done(null,user.id);
});

// 이 세션 데이터를 가진 사람을 DB에서 찾음 (마이페이지 접속시 실행)
passport.deserializeUser(function(id, done){
db.collection('login').findOne({id : id}, function(error, result){
    done(null, result);
})
})

// passport 밑에 해야함
app.post('/register', function(req, res){
db.collection('login').insertOne({id:req.body.id, pw:req.body.pw}, function(error, result){
    res.redirect('/');
});
});

app.post('/add', function(req, res){
    res.send('전송완료');
    // MongoDB에는 auto increment 직접 구현 필요 
    db.collection('counter').findOne({name : '게시물갯수'}, function(error, result){
        console.log(req.user._id);
        var totalPost = result.totalPost
        var postData = {_id: totalPost+1, 작성자: req.user._id, 제목: req.body.title, 날짜: req.body.date}
        db.collection('post').insertOne(postData, function(error, result){
            console.log('저장완료');
            // updateMany() 한번에 많이 수정
            // $set : 값으로 수정, $inc : 증가 수치
            db.collection('counter').updateOne({name : '게시물갯수'},{$inc : {totalPost:1}},function(error, result){
                if(error){
                    return console.log(error);
                }
            });
        });
    });
    
});

let multer = require('multer');
var storage = multer.diskStorage({
    destination : function(req, file, cb){
        cb(null, './public/image')
    },
    filename : function(req, file, cb){
        cb(null, file.originalname)
    },
    filefilter : function(req, file, cb){

    }
});

var upload = multer({storage : storage});

app.get('/upload', function(req,res){
    // 이미지는 DB 보다 하드에 저장 많이 함. 용량 더 작음.
    res.render('upload.ejs');
});

// upload.array 하면 여러개 가능
app.post('/upload', upload.single('profile'), function(req, res){
    res.send('업로드완료');
});

app.get('/image/:imageName',function(req,res){
    res.sendFile(__dirname + '/public/image/' + req.params.imageName);
});

const { ObjectId } = require('mongodb');

app.post('/chatroom', isLogin, function(req, res){
    var data = {
        title : '채팅방',
        member : [ObjectId(req.body.chattedId), req.user._id],
        date : new Date()
    }
    db.collection('chatroom').insertOne(data).then((result)=>{
        res.send('채팅방 생성 성공');
    });
});

app.get('/chat', isLogin, function(req, res){
    db.collection('chatroom').find({member : req.user._id}).toArray().then((result)=>{
        res.render('chat.ejs', { data : result });
    });
});

app.post('/message', isLogin, function(req,res){
    var data = {
        parent: req.body.parent,
        content: req.body.content,
        userid: req.user._id,
        date: new Date()
    }

    db.collection('message').insertOne(data).then(()=>{
        console.log('채팅 저장 완료');
        res.send('채팅 DB 저장');
    })
});

app.get('/message/:id', isLogin, function(req, res){
    // 헤더 수정. 실시간 소통 가능해짐
    res.writeHead(200, {
        "Connection":"keep-alive",
        "Content-Type":"text/event-stream",
        "Cache-Control":"no-cache"
    });

    db.collection('message').find({ parent : req.params.id }).toArray()
    .then((result)=>{
        res.write('event: test\n');
        res.write('data: ' + JSON.stringify(result) + '\n\n');
    });

    const pipeline = [
        { $match: { 'fullDocument.parent' : req.params.id } }
    ];
    const changeStream = db.collection('message').watch(pipeline);
    
    changeStream.on('change', (result) => {
        res.write('event: test\n')
        res.write('data: '+JSON.stringify([result.fullDocument])+'\n\n');
        console.log(result.fullDocument);
    });
    
});

app.get('/socket', function(req, res){
    res.render('socket.ejs');
});

io.on('connection', function(socket){
    console.log('유저 접속됨');

    socket.on('user-send', function(data){
        console.log(data);

        // socket.join('chatroom1')

        // 유저에게 보냄
        // io.emit('broadcast', data);
        
        // io.to(socket.id) 접속한 이 유저에게만 메시지 보냄
        io.to(socket.id).emit('broadcast', data);
    });

    socket.on('joinroom', function(){
        // 채팅방 넣어주기(만들기)
        socket.join('chatroom1');
    })

    socket.on('chatroom1-send', function(data){
        // 채팅방 넣어주기(만들기)
        // 채팅방으로만 broadcast도 가능, 이전에는 socket.id 로 보냈었음.
        io.to('chatroom1').emit('broadcast', data);
    })
});

// react 프로젝트와 연동 시, 주의점
// app.use() 로 파일 경로 포함한다고 해야함
// react에서 router 처리를 했다면 app.get('*', function(){}) 로 알아서 처리하게 할것