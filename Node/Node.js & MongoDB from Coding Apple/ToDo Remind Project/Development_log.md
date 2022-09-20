# Development Log

    이 프로젝트는 Coding Apple 의 Node.js 와 MongoDB 강의에서 구현한 Todo List Project를 구현할 역량 강화를 위해 다시 학습하는 프로젝트입니다.

## Setting

1. nodemon 모듈 사용

   nodemon 모듈은 수정된 내용을 서버 재시작 없이 즉시 적용되도록 도와주는 모듈이다. 실제로는 재시작을 안하는 것이 아니라, 서버 구동에 관련된 파일이 저장되면, 즉시 서버를 재시작해주는 방식이다.

   처음에 일반적인 설치 방법 "npm install nodemon" 을 시도했으나, "nodemon server.js"가 실행되지 않았다. 결론적인 해결방법은 "npm install -g nodemon" 으로 설치를 한 뒤 다시 해보는 것이었다.

   `npm install -g nodemon`

   이유는 프로젝트의 library가 아니라 시스템에 설치하기 때문이라고 한다. 많은 시도를 하고, 조사를 해보았지만, -g 옵션을 붙이지 않았을 때 nodemon을 찾을 수 없다고 하는 이유를 알 수 없었다. "nodemon server.js"를 사용하기 위해서는 환경 변수 설정, 혹은 -g 옵션을 이용한 설치가 필요해보인다.

2. dotenv 모듈 사용

   개발을 하다보면, 민감한 정보들을 사용할 때가 있다. 예를 들어, 로컬 파일 구조, 비밀번호 등이 있을 것이다.

   이들을 공개하지 않고, 서버에서만 사용하기 위해, .env 파일을 활용한다.

   이 .env 파일은 공개되지 않고, 서버 저장소에만 남으며, 여기에 민감한 정보를 저장, 사용 등을 할 수 있다.

   ```
   require('dotenv').config();
   ```

   dotenv 모듈의 config 함수를 실행하면, .env 파일을 불러온다.

   <br>

   .env

   ```
   변수 이름 = 민감한 정보
   ```

   .env 파일에는 변수에 값을 지정하듯 저장하면 된다.

<br>
## Create Project

1. npm init

   패키지 설치는 대부분 npm으로 이루어질 것이기 때문에, npm 패키지 관리를 package.json에 자동으로 하게 만들 것이다. npm install 명령은 프로젝트를 만드는 명령이라고 생각하면 될 것 같다.

2. npm insall {모듈}

   npm으로 백엔드 구현에 도움이 될 라이브러리를 다수 설치할 것이다. 아래는 설치할 모듈을 나열한 것이다.

   - express : 웹 프레임워크 "Express" 라이브러리
   - mongodb : MongoDB 라이브러리
   - body-parser : request의 내용을 파싱해주는 라이브러리, 사용하지 않으면 request.body는 undefined가 된다.
   - method-override : PUT, DELETE 요청 사용을 위한 라이브러리
   - passport : 공항에서 여권을 검사하듯, 사용자를 검사하기 위한 라이브러리 (로그인)
   - passport-local : 사용자 인증을 위한 라이브러리 (검증)
   - express-session : 세션을 사용하기 위한 라이브러리
   - http : http 서버를 사용하기 위한 라이브러리, 여기서는 소켓을 사용하기 위한 서버를 만든다.
   - socket.io : 소켓을 사용하기 위한 라이브러리. 소켓의 실시간 양방향 통신을 도와줄 것이다.
   - ejs : ejs 파일을 사용하기 위한 모듈이다.
   - dotenv : .env 를 사용하기 위한 모듈이다.

   <br>

   `npm install`

   모듈명 없이 "npm install" 만 한다면 package.json 파일에 기록된 모듈을 모두 설치한다.

<br>

## 백엔드 구현

<br>

### express 서버 생성

```
const express = require('express');
const app = express();

app.listen(8080,()=>{
   console.log("Connection Success!");
});
```

express를 사용하기 위해 모듈을 불러오고 (require 함수), express 객체를 만들어, listen 함수를 실행시키면 서버가 열린다. listen 에는 포트번호를 지정하며, Call Back 함수도 지정할 수 있다.

<br>

### ejs 파일 사용

ejs 는 Embedded JavaScript Template의 약자로, node.js 에서 많이 사용하는 템플릿이라고 한다.

기존에는 script 태그를 통해 일일히 변수를 불러왔다면, ejs를 사용해 `<%= 변수 %>` 형식으로 html에 바로 불러올 수 있는 장점이 있다.

먼저, ejs를 사용하기 위해서는 `[express 객체].set('view engine', 'ejs');` 를 실행해야 한다.

```
app.set('view engine', 'ejs);
```

그러면 이제 ejs파일을 불러오기만 하면 된다.

<br>

### GET/POST 라우팅

ejs 파일을 사용할 준비를 했지만, 아직 아무것도 웹 브라우저에 띄우지 못했다.

이를 위해서 express 객체를 통해 화면을 띄울 것이다.

가장 첫 화면은 당연히 주소의 root일 것이다. 그렇기에 GET 방식으로 가장 처음 띄울 화면을 구현할 것이다.

이에 앞서, ejs 파일은 /views/index.ejs 로 생성하였다.

처음은 html만 활용할 것이고, 이 부분은 Front End의 기본적인 부분이기에 설명을 생략하겠다.

또한, 이후 등장하는 ejs, html 파일 등 Front End 관점의 내용들은 생략하겠다.

"주소/" 로 접속 시, index.ejs를 렌더링 해준다.

```
app.get('/', (req, res)=>{
    res.render(__dirname+'/views/index.ejs');
});
```

이후 추가되는 기능에도, 요청 주소에 따른 GET/POST는 똑같이 구현 가능하다.

<br>

### MongoDB 연결하기

서버에서 다룰 데이터는 보통 데이터베이스에 저장한다.

현존하는 데이터베이스는 다양하지만, 이 프로젝트에서는 MongoDB를 사용할 것이다.

```
const MongoClient = require('mongodb').MongoClient;

let db;

MongoClient.connect(process.env.DB_URL, (error, client)=>{
    if (error) return console.log(error);

    db = client.db('todoapp');

    app.listen(8080, ()=>{
        console.log('Connection Success!');
    });
});
```

MongoClient 객체를 통해 DB에 접속하고, 접속 결과로 Call Back 함수를 실행할 수 있다.

이 때, 첫 번째 파라미터는 env 파일의 정보로 되어있는데, 여기에는 DB 아이디 및 비밀번호가 있으므로, 숨겨주었다.

MongoDB 사이트에 로그인 해, 선택한 Cluster에서 Connect를 선택하고, 일치하는 환경에 맞게 메뉴얼을 따라가면 얻을 수 있는 변수이다.

여기서는 Call Back으로 서버.listen을 함으로써 DB 없이 열리지 않게 구현했다.

db라는 전역 변수를 let으로 선언하고, 이후 db를 지정하는 방식을 취했다.

Call Back으로 받은 client 에서 'todoapp'이라는 DB를 불러왔다.

<br>

### Express 에서 views 폴더의 의미

Express 에서는 ejs파일을 render할 때, 절대 경로를 쓰는 것이 맞지만, 'views' 폴더를 자동으로 찾아 그 안의 파일을 불러올 수 있다.

이는 Express 에서 default로 지정한 폴더이며, 변경할 수도 있다.

`Express.set('views', path.join(__dirname, 'views'));`

Express 객체의 속성 중, views 속성이 있는데, 이를 확인하여 렌더링 할 파일을 찾는다.

<br>

### 할일 출력 기능 구현

할일들은 앞서 구현한 DB에 저장되어 있다.

그렇기 때문에 할일 목록을 DB로부터 불러와야 한다.

```
app.get('/list', (req, res)=>{
    db.collection('post').find().toArray(function(error, result){
        res.render('list.ejs', { posts : result });
    });
});
```

DB에서 post라는 collection이 만들어져 있다.

여기서 조건 없이 모든 데이터를 가져오고 배열 형태로 반환한다. (result 파라미터로 저장된다.)

그리고 posts 라는 변수로 반환 받은 result를 list.ejs로 보내준다.

list.ejs에서 이 posts를 활용할 것이다.

```
<%
   for(let i = 0; i<posts.length; i++){
%>
      <ul class="list-group">
         <li class="list-group-item"><%= posts[i].제목%></li>
      </ul>
<%
   }
%>
```

list.ejs의 body 태그 안에 위의 코드를 추가하였다.

server.js에서 구현하여 list.ejs로 넘겨준 posts 데이터를 활용한 모습이다.

script 태그 내에서 posts라는 변수를 직접 접근할 수 있고, 배열로 받았으니, 배열 크기로 iterate하여 모든 데이터를 순서대로 출력해준 것이다.

posts를 DB에서 가져온대로 출력은 성공적이었다.

여기서는 기존에 사용하던 post 라는 collection을 그대로 사용하였지만, 이후 todo라는 collection을 추가하여 더 많은 정보를 담을 계획이다.

<br>

### 할일 추가 기능 구현

추가 기능은 버튼을 통해 작성 폼으로 넘어가고, 제출 버튼 클릭 시 DB에 추가하는 로직을 구성하였다.

그렇기에 먼저 list.ejs에 추가 버튼을 만들고, 버튼 클릭 시, /write-form으로 라우팅 되도록 구현하였다.

```
app.get('/write-form', (req, res)=>{
    res.render('write-form.ejs');
});
```

이후 write-form.ejs 파일에서는 form 태그와 input 태그들로 사용자가 입력할 수 있도록 구현하였고, 버튼으로 submit 시, POST 방식으로 /write로 이동하도록 하였다.

먼저 최종적인 라우팅 구현 코드는 다음과 같다.

```
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
```

먼저 ToDo를 생성한 순서로 DB를 관리하기 위해서, \_id 속성을 관리하기로 했다.

순차적으로 생성된 ToDo에 \_id를 부여하기로 하였고, 그 순번을 관리하기 위해, counter라는 collection에 "게시물갯수"라는 name, totalPost 라는 ToDo 갯수를 저장하였다.

코드를 확인해보면, 먼저 counter의 totalPost 데이터를 확인한다.

totalPost는 ToDo 총 갯수이므로, 입력받은 데이터는 총 갯수 + 1 의 \_id를 받을 것이다.

그래서 todoData라는 Object를 만들어 입력 받은 데이터를 저장하였다.

그리고 나서, post 라는 collection에 todoData를 추가하였다.

마지막으로, 방금 추가한 데이터로 인해 ToDo 총 갯수가 +1 되었으므로, $inc 를 활용하여 totalPost 값을 1 증가시켰다.

모든 작업을 완료하고, 사용자는 list를 보고 싶어할 것으로 생각하여 /list로 리다이렉트 했다.

<br>

### JQuery fadeOut() 안되는 현상

```
<div class="test1">
    <button class="test">test</button>
</div>

<script>
    $(".test").click((e)=>{
        let elem = $(this);
        console.log(elem);
        elem.parent('div').fadeOut();
    })
</script>
```

할일 삭제를 동적으로 보여주기 위해, Ajax와 JQuery를 활용하여 사라질 데이터를 fade out 시키기로 했다.

그러나 강의와 유사한 코드를 작성했음에도, fade out이 동작하지 않는 현상을 보았다.

시도 1 : elem.parent('div') 를 찾지 못했을 것이라 예상

처음에는 elem.parent('div') 를 찾지 못하는 것으로 생각하여, parent 대신 parents('클래스명') 혹은 closest('클래스명') 을 시도했으나 fade out은 동작하지 않았다.

시도 2 : elem = $(this) 가 작동하지 않았을 것이라 예상

삭제 버튼이 선택된 할일만 삭제해야 했기 때문에 this 사용을 필수적이었다.

그러나 console.log 를 통한 $(this) 출력 결과, 선택한 버튼이 나오지 않은 것으로 확인했다.

수차례 구글링한 결과 문제점의 원인을 발견하였다.

발견한 글에 의하면,

"An arrow function expression has a shorter syntax than a function expression and does not have its own this, arguments, super, or new.target."

즉, ()=>{} 형태의 함수에는 this, arguments, super, new.target을 사용할 수 없다는 것이다.

위의 코드는 콜백함수로 arrow function을 사용했기 때문에 this가 비어있는 값으로 된 것이다.

결론적으로 2가지 수정안을 고려해보았다.

- 1안

  ```
  <div "test1">
      <button class="test">test</button>
  </div>

  <script>
      $(".test").click(function(e){
          let elem = $(this);
          elem.parent('div').fadeOut();
      })
  </script>
  ```

- 2안

  ```
  <div class="test1">
      <button class="test">test</button>
  </div>

  <script>
      $(".test").click((e)=>{
          $(e.target).parent('div').fadeOut();
      })
  </script>
  ```

1안을 선택한다면, $(this)를 사용할 수 있는 function(){} 형태의 콜백 함수를 사용할 것이고,

2안을 선택한다면, arrow function을 사용하는 대신, parameter로 받은 e(Event 객체)로 e.target에 접근하여, 버튼을 선택할 것이다.

이번 오류 수정으로 function(){} 와 arrow function 사이의 차이점을 알 수 있었다.

기존에는 단순히 표기법의 단순화라고 생각했지만, 사실상, function(){} 형태가 더 많은 정보를 담고 있었고, arrow function은 가벼운 대신 this, arguments, super 등을 사용할 수 없다는 점이 있었다.

this, super 등을 사용하는 경우가 많은데, 이 때 조심히 사용해야할 것 같다.

무조건 새로운 표기법만이 좋은 것은 아니라는 생각을 했다.

<br>

### 회원가입 구현

로그인 관련 기능들은 router로 auth라는 이름으로 관리하기로 했다.

```
const authRouter = require('./routes/auth');
app.use('/auth', authRouter);
```

./routes/auth.js 에는 Express.Router 객체를 export 하였고, 그 안에서 로그인 관련 기능을 구현했다.

로그인 관련 기능에는 DB 접근이 필수적이었는데, DB객체는 server.js에 있었다.

server.js 의 db 변수를 가져오려 시도했지만 실패하고, auth.js에 새로 DB 객체를 선언하기로 했다.

```
const MongoClient = require('mongodb').MongoClient;

let db;

MongoClient.connect(process.env.DB_URL, (error, client)=>{
    if (error) return console.log(error);
    db = client.db('todoapp');
});
```

그 뒤로 로그인을 위한 라우팅과 회원가입을 위한 라우팅을 설정했다.

```
router.get('/login', (req,res)=>{
    res.render('login.ejs');
});

router.get('/register-form', (req,res)=>{
    res.render('register-form.ejs');
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
```

로그인은 그저 페이지만 띄우기로 했고, 로그인 페이지 안에 회원가입 버튼을 만들었다.

회원가입 버튼을 누르면 회원가입 페이지로 넘어가고, 그 안에 정보를 입력하면 회원가입이 된다.

회원가입 시, 보통 ID 중복을 막고, 비밀번호와 비밀번호 확인란의 일치 여부를 확인하기 때문에, DB 접근하는 함수의 콜백 함수로 그 기능들을 구현하였다.

이 과정에서 res.write로 javascript 함수를 사용하는데, 이는 브라우저에 경고창을 띄우고 리다이렉트를 하기 위함이다.

특히, 한글을 경고창에 띄울 때, UTF-8 인코딩이 안되는데, 그를 위한 처리를 html `<head>` 에 해주어야 한다.

또한, res.write를 해버려서 res.redirect가 되지 않기에, javascript 함수로 redirect 했다.
