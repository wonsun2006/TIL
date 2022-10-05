# Node.js 공부

## Axios

Axios는 node.js와 브라우저를 위한 Promise 기반 HTTP 클라이언트라고 한다.

보통 데이터를 불러오기 위한 비동기 동작을 위해 사용하는 Promise를 지원한다는 의미이다.

간단한 사용법을 말하자면,

```
const config = {
        // 설정 입력
    };
    axios.get(`데이터 가져올 URL`, config)
        .then(function (response) {
        console.log(response.data);
        console.log(response.status);
        console.log(response.statusText);
        console.log(response.headers);
        console.log(response.config);
    });
```

정도가 있다.

정말 간단하게도, 저 코드를 실행하면, GET 방식으로 해당 URL에서 받은 데이터를 response라는 변수로 넣어준다.

## passport 모듈 GoogleStrategy

passport 모듈은 인증할 때 많이 사용한다.

이전에는 로컬 인증을 공부했었지만, 구글 인증 또한 가능하다.

기존에는 LocalStrategy를 사용했다면, 이제 GoogleStrategy를 사용하면 된다.

```
passport.use(new GoogleStrategy(
        {
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL: `http://localhost:${process.env.PORT}/auth/google/callback`,
        },
        function(accessToken, refreshToken, profile, done) {
            user_token = accessToken;
            done(null, profile);
        }
));
```

OAuth 인증을 하며 사용한 코드이다.

OAuth 인증에 client ID, client secret, callback URL이 필요했었기에, 설정했다.

당연히 Google Cloud와 일치해야 한다.

결과로 받은 Token 및 profile 등을 사용하면 되겠다.

```
passport.serializeUser(function(data, done){
    done(null, data);
})
passport.deserializeUser(function(data:Express.User, done){
    console.log('serialize');
    done(null, data);
})
```

passport 사용 시, 필요한 serializeUser, deserializeUser 를 설정해주고,

```
googleRouter.get('/', passport.authenticate('google', {
    scope:['profile', 'email', 'https://www.googleapis.com/auth/youtube']
}));
googleRouter.get('/callback', passport.authenticate('google', {
    successRedirect: '../../',
    failureRedirect: '/login-fail'
}));
```

GET 방식으로 구글 인증을 요청하면 된다.

여기서 scope 설정에 따라 사용하려는 특정이 허용/제한 될 수 있다.

## Passport deserializeUser 호출 안되는 이슈

Passport 에서 serializeUser, deserializeUser 함수가 있다.

인증을 마치고 인증 데이터를 저장하기 위해 거치게 되는 함수들이다.

- serializeUser : 세션을 생성, 인증 데이터를 저장.
- deserializeUser : request.user 객체에 인증 데이터 저장.

하지만, deserializeUser 가 호출되지 않으며, request.user 객체에 데이터가 저장되지 않는 현상이 발견되었다.

결론적으로 session 설정 시, `cookie:{secure:true}` 가 문제였다.

```
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
  }))
```

secure 속성을 false로 바꾸어주니 바로 해결되었다.

더 자세하게 알아보니, cookie의 secure 속성은 https 방식일 때만 쿠키 데이터를 넘긴다는 옵션이었다.

문제가 발생한 프로젝트에서는 계속 http://localhost/ 기준으로 사용하였기에, 세션에서 쿠키 데이터를 넘기지 않았던 것이다.

암호화 등 보안적으로 더 안전하다고 하는 https 방식으로 하는 것이 좋겠지만, 현 상황에서는 개발 단계이기 때문에 추후 수정할 것을 기약하며, http 방식으로 진행하였다.

## mysql 모듈 사용

`npm install mysql`

처음에는 먼저 mysql의 연결을 생성한다.

mysql 모듈에서 간단한 함수로 제공한다.

```
import mysql from 'mysql';

export const connection = mysql.createConnection({
  host     : [호스트],
  user     : [DB 유저],
  password : [DB 비밀번호],
  database : [DB 이름]
});
```

선택한 DB의 호스트, 유저, 비밀번호, 이름 등 정보를 입력하고, Connection 객체를 생성한다.

이 Connection 객체로 실제 DB에 연결하고, SQL 쿼리문을 실행하면 DB가 수행을 한다.

```
connection.connect();
connection.query(`SQL 쿼리`, function (error, results, fields) {
    if (error)
        throw error;
    console.log(results);
});
connection.end();
```

`connection.connect` : DB의 연결을 시작한다.
`connection.query` : DB에 쿼리문을 요청하고, 에러 시 error, 결과값 있을 시 results를 반환해준다. fields에는 results의 field 데이터가 들어온다.
`connection.end()` : DB 연결을 종료한다.

잘 사용한다면, 에러 없이 정상적인 결과를 보내주겠지만, 여기 두 가지 에러를 겪을 수 있었다.

1. Error: Cannot enqueue Handshake after invoking quit.

   첫 번째 에러는 connect가 된 상태에서 connect를 중복되어 불렀을 때 발생한다.

   mysql.createConnection 함수에서 이미 connect 객체는 생성되고, 연결은 된 상태이다.

   여기서 connection.connect를 한번 더 불러오게 되면, 문제가 발생한다.

   이미 createConnection으로 객체를 불러왔다면, connect를 한 번 더 사용할 필요가 없겠다.

2. Error: Cannot enqueue Query after invoking quit.

   두 번째 에러는 connection.end 이후 DB에 요청을 보내려 할 때 발생한다.

   connection.end는 Connection을 종료하는 듯 보인다.

   다시 같은 Connection 객체를 connect하려 해도 실패하고, 새로 createConnection 함수를 불러와야만 사용할 수 있었다.

   end 함수는 Connection을 완전히 종료하는 듯 보인다.
