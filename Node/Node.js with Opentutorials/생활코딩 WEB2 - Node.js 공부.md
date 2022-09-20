# Node 공부

## URL

Uniform Resource Locator

일반 사용자들이 웹 사이트에 접속하기 위해 주소창에 입력하는 것이다.

더 자세히 말하자면, 웹 서버의 리소스 위치를 표현한다고 볼 수 있다.

`https://opentutorials.org:3000/main?id=HTML&page=12`

위와 같은 예시를 들 수 있다.

크게 https , opentutoirals.org , 3000 , main , id=HTML&page=12 로 나눌 수 있다.

각각 protocol, host(domain), port, path, query string 으로 부르기도 한다.

 - protocol : 통신 규약, 네트워킹을 위한 약속이라고 보면 된다.
 - host : domain이라고도 부르며, 인터넷에 연결된 컴퓨터라고 설명하지만, CS 관점으로 본다면, DNS와 연결시켜 생각할 수도 있겠다.
 - port : 하나의 host에 여러 서버가 존재할 수 있다. 이 때, 어떤 서버에 연결해야할지 헷갈리기 때문에 port를 지정해주어야 한다. default 값은 80이다. (포트번호 미입력 시, 80번 포트로 간다.)
 - path : 컴퓨터에서 경로이다.
 - query string : URL을 통해 서버에 데이터를 보낸다. 여기서는 GET방식이라고 볼 수 있다.

## CRUD

 - Create

 - Read

 - Update

 - Delete

## File System 모듈

Node.js 기본 내장 모듈 중에, 파일 시스템을 활용할 수 있는 모듈이 있다.

그 중에서 많이 사용하는 것은 

```
const fs = require('fs');
fs.readFile(파일 이름, 콜백 함수);
```
일 것이다.

웹 사이트를 사용자에게 보여줘야 하는 웹 서버 입장에서는 html, ejs 등의 파일을 읽을 필요가 있다.

이 때 사용하는 것이 fs.readFile이다.

이 외에도 mkdir, open, close 등 로컬 컴퓨터에서 사용하는 듯한 함수들도 확인할 수 있었다.


## == 와 === 차이

엄밀히 말하면, javascript의 문법이지만, 한번 짚고 넘어가기로 했다.

공통점은 두 피연산자가 같은지를 비교하는 의미를 갖는다는 것이고,

차이점은 == 는 타입이 다를 시, 적당히 변환시켜 같으면 true, 다르면 false를 반환하고, === 는 타입도 비교하여 같으면 true, 다르면 false를 반환한다는 것이다.

예시
```
1 == 1      // true
1 == '1'    // true
true == 1   // true
true == '1' // true
true == 'true' // false
```

## Redirection & HTTP Status Code 302

웹 사이트를 구현할 때, Redirection이 필요한 상황이 많다.

이를 Response Head에 작성함으로써 구현할 수 있다.

```
response.writeHead( 302 , { Location: 리다이렉트 주소 } );
```

여기서 302 라는 HTTP Status Code를 볼 수 있는데, 쉽게 말해 URI가 일시적으로 변경되었다는 의미이다.

HTTP Status Code에 대해 간략하 정리하자면,

- 1xx(정보) : 요청을 받았으며 프로세스를 계속 진행합니다.

- 2xx(성공) : 요청을 성공적으로 받았으며 인식했고 수용하였습니다.

- 3xx(리다이렉션) : 요청 완료를 위해 추가 작업 조치가 필요합니다.

- 4xx(클라이언트 오류) : 요청의 문법이 잘못되었거나 요청을 처리할 수 없습니다.

- 5xx(서버 오류) : 서버가 명백히 유효한 요청에 대한 충족을 실패했습니다.

[출처] https://www.whatap.io/ko/blog/40/

<br>

## Coding Apple 강의 프로젝트와의 차이점

### Coding Apple

- express 사용
- GET/POST 방식 전송 시, 라우팅을 개별적으로 구현하여 가독성이 좋았다.
- 서버 생성을 express 객체를 통해 진행하였다.
- body-parser 모듈로 POST 로 전송한 데이터 파싱
- DB에 데이터 저장

### 생활코딩

- express 미사용
- html 서버에서 조건문으로 각 URL 유형마다 처리하다 보니, 가독성이 상대적으로 떨어졌다.
- html 모듈을 통해 서버 생성을 진행하였다.
- querystring 모듈로 POST 로 전송한 데이터 파싱
- 로컬 폴더에 데이터 저장

## 모듈화

Javascript에서 모듈화는 간단하다.

`module.exports = 모듈화할 값`

만 하면 끝난다.

개별적인 파일에 변수를 만들고 그 변수를 module.exports 라는 값에 초기화하면 끝이다.

그리고 다른 파일에서 항상 그래왔듯, require(모듈 경로) 를 하면 모듈을 import한 결과를 반환한다.

module.exports에 초기화했던 값이 나오는 것이다.

## 보안 이슈

보안은 서비스 운영에 있어서 빼놓을 수 없는 이슈이다.

웹 사이트는 개발자 모드 등 여러 방법으로 소스를 보기가 쉽다.

그렇기에 서비스 개발자 입장에서는 보안에 더 신경써야 한다.

여러 보안 이슈가 있겠지만 여기서 다룬 몇 가지를 기록하려 한다.

1. root 폴더로의 접근
    
    여기서는 GET 방식으로 파일 경로를 직접 입력하여 파일을 렌더링했다.
    
    하지만 이 방법의 문제점은 root 폴더까지 접근할 수 있다는 점이다.
    
    그렇게 되면, 웹 서비스 폴더 전체를 볼 수 있게 되고, 웹 서비스에서 가리고 싶던 컨텐츠 또한 공개되는 것이다.

    그렇기에 여기서는 path.parse 라는 함수를 통해, 매개변수로 경로를 수정하여 root 폴더에 접근할 경우를 차단하였다.

    경로를 입력 받고, 그 경로를 파싱하여, 파일의 이름만 가져오는 것이다.

    이 예제에서는 root 폴더에 파일이 바로 있었기에 특수한 케이스로 볼 수 있겠다.

    하지만, 대부분의 경우 폴더로 구분하여 보여주는 경우도 많기 때문에 조건문 등의 추가적인 작업이 필요해 보인다.

    하지만 핵심은 root 폴더를 사용자에게는 최대한 가리는 것이 좋고, 접근하지 못하게 하는 것이 보안점에서는 유리하다는 것이다.

2. XSS 공격 기법

    아주 기본적인 해킹 기법으로 봤던 공격 기법이다.

    웹에서는 form 태그, input 태그를 많이 볼 수 있는데, input 태그에 의도적으로 특이한 값을 넣어 해킹하는 것이다.

    script 문 자체를 입력하여 javascript 상에서 특정 동작이 가능하게 되는 것이다.

    이를 통해, 상대방의 브라우저의 세션을 가로채는 등 여러 보안적인 문제가 발생할 수 있다.

    여기서는 sanitize-html 모듈을 사용해 해결하였다.

    ```
    const sanitizedHTML = require('sanitized-html');
    let input_text = "<script>console.log('testing XSS');</script>";
    let output_text = sanitizedHTML(input_text);
    console.log(output_text);
    ```

    이를 통해, 텍스트 자체를 보여줄 수도 있고, 필터링하여 제거할 수도 있다.

    물론 필터링하기 위해서는 추가적으로 입력이 필요하다.

    