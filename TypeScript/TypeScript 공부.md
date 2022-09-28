# TypeScript 공부

## package.json의 "type"="module" 변경으로 인한 수정요소

간단히 말하자면, type은 모듈 방식을 설정하는 것인데, 과거에는 Commonjs를 사용했다가 요즘은 ES 모듈을 사용한다고 한다.

제목처럼 type의 값을 module로 변경하면 ES 모듈을 사용하게 된다.

그럼으로 인해 많은 변경점이 발생했다.

1. tsconfig 옵션 변경
   - "" -> "moduleResolution": "node"
   - "module": "ES6" -> "module": "ES6"
2. 모듈 불러오기 방식 변경

   기존에 `require('모듈')` 방식으로 모듈을 불러왔는데, 이제는 `import 선택 as 이름 from '모듈'` 방식으로 모듈을 불러와야 했다.

3. 상대경로 모듈 불러오기 이슈

   상대경로를 통해 모듈을 불러오면, ts파일에서는 확장자명 없이 불러온다.

   그런데, 컴파일 되면 이것이 그대로 확장자명 없이 들어간다.

   그 상태로 서버를 구동하면 에러가 발생하고, 확장자명을 .js 로 지정해주어야 한다.

   하지만 이는 손이 많이 가는 작업이니, 실행 시 옵션을 주기로 했다.

   `nodemon --experimental-specifier-resolution=node server.js`

   --experimental-specifier-resolution=node 옵션을 주어 실행하면, 경로를 찾는 듯 하다.

   하지만 experimental인만큼 시험적인 기능이니, 완벽한 해결책이라고 보기 힘들 듯 하다.

   P.S. 실행 명령이 너무 길어 스크립트로 저장하였다.
