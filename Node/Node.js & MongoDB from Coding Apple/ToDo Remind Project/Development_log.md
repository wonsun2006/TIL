# Development Log

    이 프로젝트는 Coding Apple 의 Node.js 와 MongoDB 강의에서 구현한 Todo List Project를 구현할 역량 강화를 위해 다시 학습하는 프로젝트입니다.

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
