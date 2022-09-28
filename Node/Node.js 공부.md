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
