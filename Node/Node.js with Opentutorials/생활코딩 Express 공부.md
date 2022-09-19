# Express 공부

## Pretty/Clean/Semantic URL (URL에 :{var})

Pretty URL, Clean URL, Semantic URL 이라는 용어가 등장하는데, 간단하게 말하자면, URL에 query문이 없도록 하는 것이다.

query문이 URL에 있는 것을 좋지 않게 보는 경향이 있고, 많은 사람들이 이 방식을 쓴다고 한다.

Express에서 Pretty URL 방식으로 라우팅을 하는 모습을 자주 볼 수 있다.

```
app.get('/write/:id', (req,res){
    console.log(req.params.id);
});
```

이와 같이 URL 상에 `:` 를 붙여 req.params 에 저장한다.

예시로 /write/33 에 접속하면, req.params.id 값으로 33이 들어가게 된다.

<br>

## 미들웨어

다른 사람들이 만든 이미 구현된 기능들을 사용하는 것

이로써 더 빠른 기능 구현이 가능해짐. (Express의 장점)

<br>

### body-parser

body-parser 가져오기

`const bodyParser = require('body-parser');`

form 태그 가져올 시,

`app.use(bodyParser.urlencoded({ extended: false }));`

json 가져올 시,

`app.use(bodyParser.json());`

결론적으로 body-parser는 req.body 라는 변수를 만들어 데이터를 저장해준다.

## 미들웨어 사용법

```
const middleWare = (req,res,next){
    console.log('It is middleware');
    req.variable = 'variable';
    next();
};

app.use(middleWare);
```

사실은 미들웨어가 req,res,next 파라미터를 받는 함수 형태이며, app.use() 로 사용할 수 있다.

req에 변수를 저장할 수 있으며, 위의 예제로 말하면 이후 실행되는 req.variable에 'variable'이 저장되어 넘겨진다.

next : 다음에 호출될 미들웨어

미들웨어 실행 조건을 제한할 수도 있는데,

```
app.get('*', middleWare);
app.post('/write', middleWare);
```

다음과 같이 GET/POST 방식에 따라 미들웨어 실행 여부를 정할 수 있고, URL까지 제한할 수 있는 모습이다.

또한 이 유형은 지금까지 많이 봐왔는데, 지금까지 구현한 GET/POST 방식의 라우팅 모두 미들웨어가 사용되고 있었다는 점이다.

```
app.get('/URL', (req,res)=>{
    // 구현 내용들
});
```

다음과 같이 라우팅 구현 시, 넘겨줬던 두번째 파라미터가 미들웨어였던 것이다.

이를 통해 Express의 대부분이 미들웨어라는 것과 미들웨어가 Express의 큰 부분을 차지한다고 이해할 수 있다.

Express 코드에서 미들웨어가 실행되는 순서 그대로 실행된다.

## 미들웨어 실행 순서

app.use, app.get, app.post 등 이들 모두 미들웨어를 넣는다.

기본적으로는 코드 순서대로 미들웨어가 실행되며, 특수한 경우 실행 순서가 바뀌기도 한다.

1. 라우팅 URL 같은 경우

   ```
   app.get('/test', (req,res,next){
       console.log('testing mw 1');
       next();
   }
   );
   app.get('/test', (req,res,next){
       console.log('testing mw 2');
       next();
   }
   );
   ```

   다음과 같이 라우팅 URL이 같다고 하더라도, 순서대로 미들웨어를 정상적으로 실행한다.

2. next를 쓰지 않는 경우

   ```
   app.get('/test', (req,res,next){
       console.log('testing mw 1');
   }
   );
   app.get('/test', (req,res,next){
       console.log('testing mw 2');
       next();
   }
   );
   ```

   1번의 예시와 비슷하지만, 첫번째 미들웨어에서 next를 호출하지 않았다.

   이 경우, 두번째 미들웨어는 실행되지 않는다.

   next를 통해 다음 미들웨어를 실행할지 말지 결정할 수도 있다는 것이다.

   전의 미들웨어가 후의 미들웨어 실행을 제어한다고 볼 수 있다.

3. 미들웨어 여러개인 경우

   ```
   app.get('/test', (req,res,next){
      console.log('testing mw 1');
      next();
   },
   (req,res,next){
      console.log('testing mw 2');
      next();
   }
   );
   ```

   파라미터로 미들웨어를 여러개 넣는 것도 가능하다.

   이 경우, 순서대로 정상적으로 미들웨어들이 실행된다.

   첫번째 미들웨어의 next가 두번째 미들웨어를 가리킨다고 해석할 수 있다.

4. next로 특정 지점을 지정한 경우

   ```
   let gotoRoute = true; // or false

   app.get('/test', (req,res,next){
     console.log('testing mw 1');
     if(gotoRoute){
           next('route');
       }else{
           next();
       }
   },
   (req,res,next){
     console.log('testing mw 2');
     next();
   }
   );
   app.get('/test', (req,res,next){
     console.log('testing mw 3');
     next();
   }
   );
   ```

   gotoRoute라는 변수가 true 혹은 false라고 생각하자.

   다음 코드를 보면 gotoRoute가 true일 때, next('route')를 호출하고, false일 때, next()를 호출한다.

   일반적인 next()라면 첫번째 미들웨어 이후, 두번째 미들웨어가 실행되겠지만, next('route')가 호출되면 상황이 달라진다.

   next('route') 호출 시, 다음 파라미터로 전달된 미들웨어가 아니라, 같은 라우팅 URL로 구현된 코드로 넘어간다.

   다음 예시에서는 mw 1에서 mw 3로 간다는 뜻이다.

   그렇기에 조건문에 따라서 어떤 미들웨어를 실행시킬지 지정할 수 있다.

## app.use(express.static('public'))

정적인 파일을 불러오기 위한 함수이다.

다음 코드를 해석하자면, 정적 파일을 public이라는 폴더에서 찾겠다는 의미이다.

정적 파일(static files)이란 이미지, CSS 파일, JS파일 등 변하지 않는 파일을 의미한다.

express.static을 통해 정적 파일을 찾을 폴더를 설정하는 것이며, 이 또한 express에 built in 된 미들웨어이다.

## Error Handling Middleware

Error 발생 시, 실행하는 미들웨어도 설정할 수 있다.

방법은 생각보다 간단하다.

그저, error 파라미터를 추가한 미들웨어를 사용하면 된다.

```
app.use((err, req, res, next)=>{
    console.log('error occurred!');
    console.log(err);
    next();
});
```

그리고 다른 미들웨어에서 next({error 객체}); 를 호출하면 다른 미들웨어들을 무시하고 위에서 구현한 미들웨어로 넘어간다.

의문점:

1. error handling middleware를 꼭 마지막 미들웨어로 작성해야 하나? (다른 라우팅에 걸리지 않은 경우이기 때문에?)

   => error handling middleware 는 next({Error 객체}) 다음으로 와야 작동한다.

   맨 위에 있으면, 아무 에러도 거르지 못할 것이다.

2. error handling middleware에서 next() 하면 그 아래의 미들웨어도 실행될까?

   => 실행된다.

3. next({Error 객체}) 없이, 에러만 발생하면 어떻게 되나?

   => error handling middleware에 걸리지 않는다.

## express.Router

지금까지 app.get, app.post 등 URL 종류 별로 라우팅을 진행했다.

하지만, 이 URL이 너무 많아지면 관리가 힘들어진다.

그 문제를 해결하기 위해, Router를 사용할 수 있다.

먼저 기본적인 아이디어는 수많은 URL을 묶는 것이다.

예를 들어 /write, /list 등이 있었다면, /todo/write, /todo/list 로 나누는 것이다.

겉 보기에는 URL 길이만 늘어났지만, Router를 이용하면, 관리가 쉬워진다.

```
const express = require('express');
const router = express.Router();
const app = express();

...

router.post('/write', (req,res)=>{console.log('write page')});
router.get('/list', (req,res)=>{console.log('list page')});

app.use('/todo', router);
```

다음과 같이 코드를 작성하면, 기존에 app.get, app.post로 했던 것을 router.get, router.post 로 바꾼 것을 볼 수 있다.

너무 많았던 라우팅 작업을 Router에게 맡기는 것이다.

결론적으로 router에 라우팅을 옮기고, 그 router를 app.use를 통해 미들웨어로서 연결시켰다.

이렇게 되면 /todo/wirte 혹은 /todo/list 도 작동하는 것이다.

여기서는 하나의 파일에 모든 router와 app을 넣었지만, router만 다른 파일로 분리시켜 관리한다면 더 수월할 것이다.

## 보안 솔루션

1. Express를 최신 버전으로 유지하라

2. https 연결을 사용하라

3. Helmet 모듈

   Helmet이라는 각종 보안 문제를 막아주는 모듈이 있다.

   `npm install --save helmet`

   ```
   const helmet = require('helmet');
   app.use(helmet());
   ```

4. 쿠키를 조심히 사용하라

5. 모듈끼리 취약점이 있는지 확인하라 ~~(nsp 모듈)~~

   모듈끼리 존재하는 취약점을 찾는 모듈이 있다.

   ~~`npm install nsp -g`~~

   ~~`nsp check`~~

   이라고 하지만, 이 패키지는 deprecated 되었다..

   => 찾아보니 `npm audit` 을 사용하면 알 수 있다고 한다.

## Express Generator

Express 프로젝트를 생성해주는 모듈이 있다.

`npm install express-generator -g`

`express {프로젝트 이름}`

`npm install`

`npm start`

Express Generator로 프로젝트를 생성하면, 어떻게 하라는 가이드가 나온다.

그것을 따라가다 보면, Express 프로젝트에 유용한 모듈이 설치되고, 자동으로 필요할 것 같은 코드들이 작성된다.

만약 완전 새로운 시작을 한다면 고려해볼만한 사항이라고 생각한다.
