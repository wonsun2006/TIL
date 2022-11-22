# OAuth

## OAuth 란?

OAuth는 Open Authorization이라는 뜻이며, 간단히 말하자면 보안을 대신해주는 접근이라고 보면 된다.

API라기보다는 standard라고 보는 것이 더 정확하다.

OAuth 1.0a와 OAuth 2.0 두 가지 버전이 있지만, 두 버전 사이에는 호환성이 없고, 현재는 거의 OAuth 2.0만 사용한다고 보면 된다.

## OAuth 작동 방식

OAuth는 HTTP Basic Authentication으로 구현되었다.

HTTP Basic Authentication이란, 말 그대로 HTTP 기본 인증 방식이며, ID와 비밀번호를 통한 인증 방식이다.

HTTP Basic Authentication는 아직 많은 API 인증에서 사용되고 있는데, 기존의 ID와 비밀번호를 이용한 대신, API key ID와 secret을 활용한다.

## OAuth 권한 부여 방식

출처: https://charming-kyu.tistory.com/36

OAuth 권한 부여 방식에 대해 아주 잘 정리된 블로그가 있었다.

이해가 부족하다면 블로그를 참고하는 것도 좋은 방법이다.

OAuth의 권한 부여 방식은 총 4가지이다.

1. Authorization Code Grant
2. Implicit Grant
3. Resource Owner Password Credentials Grant
4. Client Credentials Grant

1,2번 방식은 외부 클라이언트(서비스)에서 OAuth 인증 사용 시 방식이고, 3,4번 방식은 내부 클라이언트, 즉 스스로 운영하는 서비스에서 OAuth 인증을 제공할 때 사용하는 방식이라고 보면 된다.

기본적으로 OAuth 인증을 위해서는 인증 서버와 리소스 서버가 필요하다.

인증 서버: OAuth를 통해 인증된 대상에게 Token 제공

리소스 서버: Access Token을 받으면, 요청된 리소스 제공 (ex. 사진, 영상, 데이터)

1. Authorization Code Grant

![Authorization Code Grant](./images/OAuth%20Authorization%20Code%20Grant.png)

4가지 중에서 가장 기본적인 방식이다.

Access Token 뿐만 아니라 Refresh Token도 사용할 수 있다.

유저가 서비스에 사용 요청을 보내면, 서비스에서 인증 서버로 승인 코드를 요청한다.

이때 승인 코드 요청 시, Access Token을 받을 redirection url도 함께 전송한다.

이후, 인증 서버는 로그인을 위한 창을 출력한다.

사용자가 로그인 창에서 로그인을 하고, 성공 시, 인증 서버가 서비스에게 "승인 코드"를 전달한다.

그리고 서비스는 이 승인 코드를 통해 Access Token을 받을 수 있다.

서비스가 승인 코드로 Access Token을 요청하면, 인증 서버가 Access Token을 전달해준다.

이후, 서비스는 Access Token을 리소스 서버로 전송하여, 자원을 요청할 수 있게 된다.

<br>

### Youtube API 예시

현재 Youtube API 관련 프로젝트를 진행 중이니, 예시를 들어본다.

프로젝트는 사용자의 Youtube 데이터를 불러와 서비스를 제공하는 형식이다.

이 또한 Authorization Code Grant 방식을 사용한다.

먼저 사용자가 서비스를 사용하려 서비스에 접근한다.

그러면 서비스는 인증 서버에 Google Login을 할 수 있는 로그인 페이지를 사용자에게 보이도록 요청한다. (승인 코드를 요청한다.)

인증 서버에서는 Google Login 페이지를 사용자에게 보여주고, 사용자는 서비스를 이용하기 위해 로그인을 할 것이다.

로그인을 성공하고, 인증 서버는 권한 부여 코드를 서비스에게 전달한다.

서비스는 그 코드로 Access Token을 요청한다.

이후 서비스는 제공 받은 Access Token으로 Youtube API 데이터를 불러온다. (리소스 서버에서 데이터를 제공한다.)

<br>

사용자는 정보 제공을 동의하며 로그인을 진행하며, 서비스는 사용자의 로그인 정보를 알지 못하기 때문에, 보안적으로 큰 이슈는 없어 보인다.

<br>

2. Implicit Grant

![Implicit Grant](./images/OAuth%20Implicit%20Grant.png)

Code 없이 Access Token만 전달하는 방식이다.

Refresh Token은 사용할 수 없다.

URL로 Access Token을 전달하기 때문에 보안적인 위험 요소가 있다.

그렇기에 보안적인 위험을 낮추기 위해 Access Token의 유효 기간을 짧게 설정한다.

그래도 간소화로 인해 응답성, 효율성이 높아져 빨라진다는 장점이 있다.

자격증명을 지키기 힘든 클라이언트에서 사용한다고 한다.

3. Resource Owner Password Credentials Grant

![Resource Owner Password Credentials Grant](./images/OAuth%20Resource%20Owner%20Password%20Credentials%20Grant.png)

이 방식은 직접 인증 서버, 리소스 서버를 운영하는 클라이언트에서 사용하는 방식이다.

사용자로부터 username, password를 받아 인증 서버에 Access Token을 요청한다.

직접 username과 password를 사용하기 때문에 다른 서비스에서 사용해서는 안된다.

Refresh Token도 사용 가능하다.

4. Client Credentials Grant

![Client Credentials Grant](./images/OAuth%20Client%20Credentials%20Grant.png)

클라이언트가 자격증명을 이용해 Access Token을 요청하는 방식이다.

클라이언트가 자격증명을 안전하게 지킬 수 있다는 가정 하에 사용해야 한다.

간단한 방식으로 인해 클라이언트 입장에서 꽤 사용될 것으로 보인다.

Refresh Token은 사용할 수 없다고 한다.
