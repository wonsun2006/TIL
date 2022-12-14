import * as express from 'express'
import { MongoClient, Db, WithId, Document, ObjectId } from "mongodb";
import * as bodyParser from 'body-parser';
import * as methodOverride from 'method-override';
import * as dotenv from 'dotenv';
import * as passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import * as session from 'express-session';

dotenv.config();

const authRouter = require('./routes/auth');

declare global {
	namespace Express {
        interface User{
            _id: ObjectId,
            id?:string,
        }
	}
}

interface LoginData extends WithId<Document> {
    id: string;
    pw: string;
}

interface ToDoData extends WithId<Document>{
    id: number,
    제목: string,
    작성자: ObjectId,
    날짜: Date
}

interface CounterData extends WithId<Document> {
    totalPost: number,
    name: string
}

const app = express();

app.use(bodyParser.urlencoded({extended : true}));
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
app.use(session({secret : '비밀코드(추후 수정 필요)', resave : false, saveUninitialized : false}));
app.use(passport.initialize());
app.use(passport.session());

app.use( express.static( "public" ) );
app.use('/auth', authRouter);

let db: Db;

if(process.env != undefined){
    if(process.env.DB_URL != undefined){
        MongoClient.connect(process.env.DB_URL, (error: Error | undefined, client: MongoClient)=>{
            if (error) return console.log(error);

                db = client.db('todoapp');

                app.listen(process.env.PORT, ()=>{
                    console.log(`Connection on ${process.env.PORT}`);
                });
            
        });
    }else{
        console.log('Cannot find DB_URL');
    }
}else{
    console.log('There is no .env data');
}

passport.use(new LocalStrategy({
    usernameField: 'id',
    passwordField: 'password',
    session: true, // 로그인 후 세션 저장할지, 브라우저 종료되도 유지됨.
    passReqToCallback: false, // 아이디 비번 말고도 다른 정보 검증 시
  }, function (id:string, password:string, done) {
    db.collection('login').findOne({ id: id }, function (error, result) {
      if (error) return done(error);
    
      if (!result) return done(null, false, { message: '존재하지않는 아이디입니다.' });
      // 비밀번호 직접 비교시 보안 매우 약함 (암호화 필요)
      if (password == result.pw) {
        return done(null, result);
      } else {
        return done(null, false, { message: '비밀번호가 다릅니다.' });
      }
    })
}));

passport.serializeUser(function(user: Express.User, done){
    if(user?.id != undefined){
        done(null, user.id);
    }
    
});

passport.deserializeUser(function(id: string, done){
    db.collection('login').findOne({id : id}, function(error, result:LoginData|undefined){
        if(result != undefined){
            done(null, result);
        }      
    });
})

function isLogin(req: express.Request, res: express.Response, next: express.NextFunction){
    if(req?.user){
        next();
    }else{
        res.send('로그인이 안되어있습니다.')
    }
}


app.get('/', (req, res)=>{
    res.render('index.ejs', {user:req.user});
});

app.get('/list', (req, res)=>{
    db.collection('post').aggregate([
        {
          $lookup:
            {
              from: "login",
              localField: "작성자",
              foreignField: "_id",
              as: "user_inform"
            }
       }
     ]).toArray((error,result)=>{
        res.render('list.ejs', {user:req.user, posts:result});
    });
});

app.get('/write-form', (req, res)=>{
    res.render('write-form.ejs', {user:req.user});
}); 

app.post('/write', isLogin, (req: express.Request, res: express.Response)=>{
    db.collection('counter').findOne({name: "게시물갯수"}, (error, result:CounterData)=>{
        if(error){
            res.send('DB Data Error');
        }

        if(req.user != undefined){
            const todoData : ToDoData = {
                _id: new ObjectId,
                id: result.totalPost + 1,
                제목: req.body.title,
                작성자: req.user._id,
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
        }
    });
});

app.delete('/delete', (req, res)=>{
    const idToDelete = parseInt(req.body.id);

    let user_search_key;
    if(req.user){
        user_search_key = req.user._id;
    }

    db.collection('post').deleteOne({id:idToDelete, 작성자:user_search_key},(error,result)=>{
        if(error){
            res.send(error);
        }else if(result != undefined){
            if(result.deletedCount==0){
                res.send({message : 'no data'});
            }else{
                res.status(200).send({message : 'success'});
            }
        }else{
            res.send('delete result is undefined');
        }
    });
})

