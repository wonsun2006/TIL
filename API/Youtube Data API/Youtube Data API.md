# Youtube Data API

## 필요 조건

1. Google 계정

   - Google API 에 엑세스에 사용

2. Google 에 애플리케이션 등록

## 데이터 종류

- activity : 사용자의 활동 데이터

  구독, 컨텐츠 추가 등 모든 활동이 표시되므로, 적당한 필터링이 필요해보인다.

- playlist: 사용자의 플레이리스트를 볼 수 있는 데이터

  플레이리스트에 담겨 있는 영상에 대한 정보를 연동시켜 보려 했지만 아직 방법을 찾지 못했다.

- search result

- subscription

- Videos: 영상 정보를 담은 데이터

  myRating 속성이 있어, like/dislike/none 을 설정해주면 필터링 된다.

  영상에 대한 선호도를 조사할 때, 도움이 될 것으로 보인다.

## Google에 애플리케이션 등록

Youtube API를 사용하기 위해서는 Google Cloud에 애플리케이션을 등록하고, Youtube API를 사용해아한다.

API key 받기, 사용자 인증 OAuth 등 여러 기능들이 있는 것을 알 수 있다.

Youtube API는 무료라고는 하나, 일부 기능들은 유료인 것을 볼 수 있었다.

## API key 받기

Youtube API 를 가장 빨리 사용하는 방법은 애플리케이션에서 API key를 발급 받는 것이다.

Youtube API 문서에서는 기능에 따라 어떤 쿼리를 입력해야하는지 제공해준다.

원하는 기능에 맞추어 파라미터를 설정하고 해당 URL로 이동하면 데이터를 제공해준다.

여기서 문제는 key 값이 만족해야 사용 가능하다는 점이다.

key 파라미터로 들어가는 것이 바로 API key이다.

애플리케이션 - 사용자 인증정보 - API key에서 생성할 수 있다.

생성 후, 원하는 URL에서 key 파라미터에 제공 받은 API key를 넣으면 끝이다.

해당 URL로 이동하면 데이터를 제공받을 것이다.

## URL에서 데이터 받아오기

지금까지 구현하면, API를 통해 데이터를 제공하는 URL을 구한 것이다.

하지만, 이 데이터를 직접 다뤄야 하기 때문에 코드로 불러올 필요가 있다.

GET 방식으로 데이터를 불러오는 것이기에, 특별한 방법이 필요할 것이다.

모듈을 찾아보니 request라는 모듈이 많이 쓰이다가 deprecated 되고,

현재는 axios, node-fetch, got 모듈 등을 사용한다고 한다.

결론적으로는 axios를 사용하기로 결정하였다.

## API key vs OAuth 2

    "Request is missing required authentication credential. Expected OAuth 2 access token, login cookie or other valid authentication credential. See https://developers.google.com/identity/sign-in/web/devconsole-project."

다음은 프로젝트 구현 도중 발생한 에러이다.

```
axios.get(`https://www.googleapis.com/youtube/v3/videos?part=snippet&myRating=like&maxResults=25&key=${process.env.API_KEY}`)
    .then(function (response: AxiosResponse) {
});
```

논의를 위해 자세한 코드들은 생략하였다.

대략적으로 설명하자면, Axios를 활용하여 GET방식으로 해당 URL에서 데이터를 가져오는 과정이다.

하지만, 해당 URL에 접속하니 언급한 에러가 발생했다.

결론적으로 그 이유는 OAuth 2 인증이 필요한 작업에 OAuth 2 인증을 하지 않았기 때문이다.

코드 상 API_KEY 는 말 그대로 Youtube API 에서 API key를 가져온 것이다.

하지만 API key는 개인 사용자의 데이터에 접근하지 못한다고 한다.

그렇기 때문에 개인 사용자와 관련된 데이터들은 OAuth 2 인증이 필요하며, 인증하지 않았기에 에러가 발생했다는 것이다.

추후, OAuth 2 인증 기능을 구현할 필요가 있을 것으로 보인다.

참고로, API key로는 가장 유명한 영상들 등 개인 사용자와 무관한 데이터는 접근할 수 있는 것으로 보인다.

## OAuth2 인증

Youtube Data API의 일부 기능은 OAuth2 인증이 필요하다.

Google에서는 서버 사이드에서 OAuth2를 요청하고 사용할 방법을 안내한다.

https://developers.google.com/youtube/v3/guides/auth/server-side-web-apps

1. 액세스 토큰 받기

   여러 파라미터와 함께 `https://accounts.google.com/o/oauth2/auth`

   로 GET 요청을 해야한다.

   필수 파라미터는

   client_id, redirect_uri, response_type, scope 가 있으며 다음과 같이 GET 요청을 했다.

   ```
       res.redirect(`https://accounts.google.com/o/oauth2/auth?client_id=${process.env.CLIENT_ID}&redirect_uri=http://localhost:8080/oauth2callback&scope=https://www.googleapis.com/auth/youtube&response_type=code`);

   ```

   - client_id: Google Cloud에 만든 애플리케이션에서 OAuth 2.0 클라이언트 ID의 ID 데이터
   - redirect_uri: 결과 데이터를 보내줄 URI (리다이렉트 됨)

   redirect URI는 Google Cloud OAuth 2.0 클라이언트 ID 설정에서 승인된 리디렉션 URI로 등록해야 작동한다.

   - scope: 권한 요청할 범위 (공식 문서에 정리되어 있으니 참고)
   - response_type: 응답 데이터 형식 (code, token 등이 있다. 공식 문서 참고)

   그 결과로 권한 요청 페이지로 이동한다.

2. 사용자 동의 결정

   권한 요청 페이지에서 권한을 허용하면 이전에 설정했던 redirect_uri로 데이터를 전달한다.

3. Google의 응답 처리

   위에서 code 형태 데이터를 요청했으니 code 형태의 데이터를 받을 것이다.

   이 code는 token으로 교환할 수 있는 code이다.

   GET 방식의 파라미터로 전달이 되며, code라는 key로 전달 받는다.

   그렇기에 request.query.code로 이후 활용하면 된다.

4. 인증 코드를 갱신 토큰 및 액세스 토큰으로 교환

   이후 code 데이터, 여러 파라미터와 함께 `https://accounts.google.com/o/oauth2/token`으로 토큰을 요청할 수 있다.

   - code: 3단계에서 Google이 redirect_uri로 반환한 인증 코드입니다.
   - client_id: 애플리케이션의 OAuth 2.0 클라이언트 ID로, 이 값은 Google APIs console에 표시됩니다.
   - client_secret: 클라이언트 ID와 연결된 클라이언트 비밀번호로, 이 값은 Google APIs console에 표시됩니다.
   - redirect_uri: 클라이언트 ID에 대해 등록된 redirect_uri입니다.
   - grant_type: 이 값은 authorization_code로 설정합니다.

   위의 파라미터들과 함께 해당 URI로 POST 요청 하면 된다.

   Axios로 구현하게 되면

   ```
   axios.post('https://accounts.google.com/o/oauth2/token',{
           code: req.query.code,
           client_id: process.env.CLIENT_ID,
           client_secret: process.env.CLIENT_PW,
           redirect_uri:`http://localhost:${process.env.PORT}/oauth2callback`,
           grant_type:'authorization_code'
       }).then(function(response:AxiosResponse){
           console.log(response.data);
       }).catch(function(error){
           console.log(error);
       });
   ```

   결과도 정상적으로 출력되며, 이제서야 token을 얻게 되며, 이제 token을 이용한 개인 데이터에 접근할 수 있다.

   5. 응답 처리 및 토큰 저장

   사실상 여기서 설명할 것은 크지 않다.

   받은 데이터를 잘 저장하면 되며, 형식은 다음과 같다.

   ```
    {
        "access_token" : 토큰 값,
        "token_type" : "Bearer",
        "expires_in" : 3600,
        "refresh_token" : 리프레시 토큰 값
    }
   ```

## 토큰은 어디에 저장할까?

Youtube Data API 일부 기능을 위해 토큰을 받아 왔고, 사용자가 매번 인증하는 어려움을 해결하기 위해, 한번의 인증으로 토큰을 저장할 필요가 있다.

하지만 토큰이라는 것이 개인 데이터에 접근할 수 있게되는 요소이고, 보안적인 측면이 고려되지 않을 수 없다.

그렇다면 이 토큰을 어디에 저장할까?

결론적으로 간단히 말하자면

> access 토큰은 로컬 변수, refresh 토큰은 쿠키 httpsonly 속성으로

이다.

    1. 리프레시 토큰은 HTTP ONLY SECURE 쿠키에 저장하자.
    2. 액세스 토큰은 프로그램상 자바스크립트 로컬 변수에 저장하고, http 헤더에 bearer 토큰으로 담아서 매 요청마다 보내도록 하자.
    3. 로컬스토리지는 사용하지 말자. (보안에 매우 취약)

출처: https://simsimjae.tistory.com/482 [104%:티스토리]

크게 3가지 방법이 있겠지만, 각각의 장단점들로 인해 저렇게 정리되었다.

더 자세한 내용은 출처를 확인하길 바란다.
