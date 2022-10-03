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
