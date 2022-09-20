# Node.js 쿠키와 인증 공부

## 쿠키란?

http 프로토콜에 포함된 기술로, 세션 인증, 개인화, 트래킹의 기능을 한다.

## 쿠키 생성

쿠키는 헤드에 작성함으로써 생성할 수 있다.

```
response.writeHead(200, {
   'Set-Cookie':[
      'yummy_cookie=choco',
      'tasty_cookie=strawberry'
      ]
});
```

Set-Cookie를 통해 쿠기 값을 저장할 수 있다.

그리고 브라우저에 한번 생성된 쿠키는 사이트가 변경되어도 사라지지 않는다.

쿠키 삭제는 브라우저 개발자 도구에서 할 수 있으므로, 개발에 필요하다면 적극 이용해야겠다.

## 쿠키 읽기

쿠키 정보는 request.headers.cookie 에 담겨 있다.

하지만, 이는 쿠키가 통째로 전달되기 때문에, "a=a1;b=b1" 과 같이 전송된다.

이를 위해 사용할 수 있는 모듈이 있는데, 그것은 cookie 이다.

`npm install cookie -s` 로 설치하고,

```
const cookie = require('cookie');
const cookies = cookie.parse(request.headers.cookie);
```

이렇게 하면, cookies 에 { a:a1, b:b1 } 와 같이 object 형태로 전달되고, 사용하고 싶은 값을 사용하면 된다.

## Session Cookie, Permanent Cookie

이메일 로그인 유지 기능 등을 사용해보면, 브라우저가 꺼졌다 켜져도 로그인 상태가 유지되는 것을 볼 수 있다.

이와 같이 브라우저 종료에도 유지되는 쿠키를 Permanent Cookie, 지금까지 구현했던 브라우저 종료 시 사라지는 쿠키는 Session Cookie라고 한다.

지금까지처럼 그냥 Cookie를 만들면 Session Cookie가 되고, 추가적인 코드를 작성하면 Permanent Cookie가 된다.

Session Cookie

```
response.writeHead(200, {
   'Set-Cookie':[
      'yummy_cookie=choco',
      'tasty_cookie=strawberry'
      ]
});
```

Permanent Cookie

```
response.writeHead(200, {
   'Set-Cookie':[
      'yummy_cookie=choco; Expires=Wed, 21 Oct 2015 07:28:00 GMT',
      `tasty_cookie=strawberry; Max-Age=${60*60*24*30}`
      ]
});
```

Session Cookie는 지금까지와 같이 추가 옵션 없이 구현하면 되고,

Permanent Cookie는 Expires 혹은 Max-Age 옵션을 추가하면 된다.

- Expires: 만료 시간
- Max-Age: 만료 기간 (초 단위)

위의 예시에서는 30일의 만료 기간을 표현하기 위해 초 단위로 계산한 모습이다.

## Cookie Secure & HttpOnly

Cookie는 자칫하면 악용될 수 있기 때문에 조심하여야 한다.

민감한 정보는 기본적으로 Cookie 사용을 자제하겠지만, 만약 보안이 필요한 상황이라면 사용할 수 있는 옵션이 있다.

Secure 는 https 통신일 때만 쿠키를 보여준다.

https는 간단히 말하면 암호화를 통한 통신이다.

서버와 브라우저가 통신하며 SSL 방식으로 암호화하여 정보를 주고 받는다고 한다.

만약 http로 통신한다면, Secure 옵션이 있는 쿠키는 보이지 않는다.

<br>

HttpOnly는 javascript를 통해 document.cookie로 쿠키에 접근하는 것을 막는 옵션이다.

악의로 javascript에서 document.cookie를 호출해 Cookie를 가져갈 수 있기 때문에 막는 것이다.

HttpOnly 옵션을 붙이게 되면, javascript에서 document.cookie를 호출해도, HttpOnly 옵션이 있는 쿠키 정보는 보이지 않는다.

예시 코드는 다음과 같다.

```
response.writeHead(200, {
   'Set-Cookie':[
      'yummy_cookie=choco; Secure; HttpOnly',
      'tasty_cookie=strawberry'
      ]
});
```

다음 예시에서 http로 통신하면, yummy_cookie는 보이지 않고, tasty_cookie만 보인다.

https 로 한다면 모두 보일 것이다.

또한 javascript로 document.cookie를 출력하면, tasty_cookie만 보인다.

## Cookie Path & Domain

쿠키가 드러나는 경로와 도메인을 설정할 수 있다.

이 또한 옵션을 통해 가능한데, 각각 Path 와 Domain 이다.

Path를 설정할 경우, 해당 사이트에서 해당 Path에서만 쿠키가 드러난다.

Domain을 설정할 경우, 해당 도메인만 맞는다면 어떤 페이지든 쿠키가 유지된다.

예시 코드는 다음과 같다.

```
response.writeHead(200, {
   'Set-Cookie':[
      'yummy_cookie=choco; Path=/path',
      'tasty_cookie=strawberry; Domain=사이트.co.kr'
      ]
});
```

만약 이 쿠키가 사이트.co.kr에서 구현한 것이라고 생각해보자.

그렇다면, yummy_cookie는 사이트.co.kr/path 에서만 나오고,

tasty_cookie는 {xxx}.사이트.co.kr의 형태라면 어떤 것이든 쿠키가 나온다.
