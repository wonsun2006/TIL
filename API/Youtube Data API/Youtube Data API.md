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
