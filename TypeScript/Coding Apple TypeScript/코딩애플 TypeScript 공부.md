# TypeScript 공부

TypeScript는 JavaScript 문법에 Type을 추가한 것이다.

JavaScript는 Dynamic Typing 을 통해, 자유롭고 동적인 타이핑이 가능하다.

예를 들어 1+'2'는 3이라는 결과를 나타낸다.

이런 Dynamic Typing은 작은 프로젝트에서는 편리함과 함께 유용한 기능으로서 작용하지만, 큰 프로젝트에서는 각종 타입 에러를 불러오는 등 더 힘들게 하는 부분이다.

이 문제를 해결하기 위해 TypeScript 가 등장하였고, 많은 대형 프로젝트에서 TypeScript를 사용하고 있다.

어떤 타입인지 명시하기 때문에, 에러를 더 자세히 알려주고, 오타를 고쳐주기도 한다.

## 컴파일 필요

TypeScript의 파일 확장자명은 ts이다.

이 ts 파일은 많은 브라우저에서 해석하지 못한다.

그렇기 때문에 ts 파일을 js 파일로 컴파일 할 필요가 있다.

먼저 tsconfig.json 파일을 생성하여

```
"compilerOptions": {
    "target": "es5",
    "module": "commonjs",
  }
```

를 입력한다.

나의 경우, 아예 리액트 프로젝트를 자동으로 만들어 module은 esnext가 입력되었다.

그리고 나서 tsc -w 를 터미널에 입력하면 컴파일이 시작된다.

종료하지 않는 한, 계속 ts 파일을 컴파일하여 js 파일로 바꾸어 준다.

## 타입 지정 문법

```
// 문자열 타입 지정
let myName: string = "myname";
// 문자열 배열 타입 지정
let keywords :string[] = ['my', 'name'];
// Object 타입 지정
let age :{
    age : number,
    birth? : number
} = { age : 123 };
age = { age: 456, birth: 220922 };
// union 타입 지정 (여러 타입 지정)
let dynamicVar :string | number = 'dynamic';
dynamicVar=123;
// 새로운 타입 선언 (값 자체를 줄 수도 있음)
type NewType = number | number[] | 'only';
let newVar :NewType = 1;
newVar = [2,3,4];
newVar = 'only';
// 함수 타입 지정 (입/출력 타입)
function timesTwo(x :number) :number{
    return x * 2
}
// 배열 순서 별 타입 지정
type ArrType = [number, boolean];
let arrType:ArrType = [111, true];
// key 타입 별 value 타입 지정
type ManyKey = {
    [key :string] : number,
};
let manyKey :ManyKey = {
    key1 : 1,
    key2 : 2,
};
// class 타입 지정
class MyClass {
    attribute;
    constructor(attribute :string){
      this.attribute = attribute;
    }
}
```

## compilerOptions 설정

```
"compilerOptions": {
    "target": "es5",
    "module": "commonjs",
    "noImplicitAny": true,
    "strictNullChecks": true
  }
```

- target: 어떤 버전의 javascript로 바꿀지
- module: 모듈 임포트 방식 (commonjs는 require, esnext는 import)
- noImplicitAny: any가 의도치 않게 사용되면 에러 표시
- strictNullChecks: null 혹은 undefined에 특정 작업을 시도할 경우 에러 표시

## Primitive Type

```
let primitive : number | string | boolean |
    null | undefined | number[] | {attr1:number, attr2:string};
```

이와 같이 primitive type들이 존재한다.

사실 이들은 일일히 명시하지 않아도 된다.

변수에 값을 지정해주면, 알아서 타입을 지정해준다.

타입을 직접 명시할지 말지는 개인 판단에 따르면 될 것 같다.

## union 활용 배열 타입 지정

```
let arrWithUnion : (number|string)[] = ['one', 1];
let objWithUnion : { union: string|number} = {union:"one"};
objWithUnion={union:1};
```

이렇게 선언하면, 배열에는 number 혹은 string 아무거나 올 수 있고,

object에는 union 속성이 number 혹은 string 이면 된다.

## any, unknown Type

```
let any:any;
let unknown:unknown;
```

any 타입은 type 체크를 해제하는 타입이다.

unknown은 모든 타입이 가능한 타입이다.

만약 unknown 타입에 사칙연산을 시도하면 에러가 발생한다.

반면에 any는 위와 같은 상황에서 에러가 발생하지 않는다.

unknown이 any보다 더 엄격히 타입 체크를 한다고 보면 된다.

## TypeScript 타입 체크의 엄격함

unknown으로 타입 지정한 변수에 숫자를 선언해도 사칙연산은 불가능하다.

사칙연산은 number에만 허용되기 때문이다.

그렇다면 javascript에서 문자열 + 1 은 가능한데, number | string은 어떨까?

예를 들어,

```
let testPlus: number|string = 1;
testPlus+1;
```

을 하면 에러가 발생한다.

TypeScript에서는 number|string을 새로운 타입으로 보기 때문이다.

number에도 +는 되고, string에도 +는 되지만, number|string에는 +가 안되는 것이다.

## void 타입

```
function voidFunc(x?:number):void{
    console.log('void function');
}
voidFunc();
```

반환 값이 없도록 하고 싶을 때 void 타입을 사용하면 된다.

또한 함수에서 parameter를 지정하되, parameter를 넣지 않게도 가능하게 하고 싶다면 ?를 사용하면 된다.

여기서 parameter?:타입 은 parameter:타입|undefined 와 같다고 한다.

## Narrowing & Assertion

TypeScript에서는 number|string 타입에 대해서는 +가 안되는 것을 전에 배웠다.

```
function errorFunc(x:number|string):void{
    console.log(x+1);
}
```

다음과 같은 코드도 에러가 발생했을 것이다.

에러의 주 원인은 타입이 애매하기 때문인데, number와 string중 하나로 확정지어 주면 해결할 수 있다.

```
function narrowingFunc(x:number|string):void{
    if(typeof x === 'number'){
        console.log(x+1);
    }else if(typeof x === 'string'){
        console.log(x+1);
    }else{
        console.log('x is not number or string');
    }
}
narrowingFunc(1);
narrowingFunc('1');
```

다음과 같이 typeof 를 통해 조건문을 구현해주면 에러가 발생하지 않는다.

typeof x 는 x의 타입을 string 형태로 반환한다.

이를 통해 number인지 string인지 조건을 걸어 각각 작업을 진행하면된다.

위 함수를 1 과 '1'을 넣어본 결과 각각 2, '11'을 출력하였다.

위와 같이 type을 확정지어 주는 작업을 Narrowing이라 한다.

타입이 애매할 때, Narrowing을 사용할 수 있지만, Assertion이라는 것도 활용할 수 있다.

```
function assertionFunc(x:number|string):void{
    const temp = x as number;
    console.log(temp+1);
}
assertionFunc(1);
assertionFunc('1');
```

다음 코드를 보면 x as number라는 코드를 볼 수 있다.

x 를 number로서 보겠다는 의미이다.

이렇게 되면 에러가 발생하지 않는다.

하지만 문제점이 있다.

x가 string이 입력되어도 에러가 발생하지 않는다.

에러 체크가 무뎌진다는 의미이다.

실제로 1과 '1'을 넣어보면, 2와 '11'을 출력하며, 작동은 잘 한다.

하지만 의도된대로 코딩하지 못하는 경우가 발생할 수 있다.

그렇기 때문에 Assertion은 유의하여 사용할 필요가 있다.

Coding Apple 에서는 Assertion을 사용할 상황을 몇 가지 제시해주었다.

1. 변수의 타입이 확실한 상황
2. 에러 발생 이유를 모르고, 임시로 이 상황을 해결하고 싶을 때

이러한 설명을 들어보니, Assertion 보다는 Narrowing 이 더 안전하겠다는 생각이 들었다.

실제로 대부분 Assertion으로 해결할 수 있는 상황은 Narrowing으로 해결할 수 있다고 한다.

그래도 Assertion을 활용한 코드가 더 간결하고, 특수한 상황에 사용할 수 있다는 점에서 무조건 배제하지는 말아야 겠다.

아래는 특수한 케이스이다.

```
type Person = {
    name : string
}
function 변환기<T>(data: string): T {
    return JSON.parse(data) as T;
}
const jake = 변환기<Person>('{"name":"kim"}');
```

Coding Apple의 코드를 발췌해왔다.

Person이라는 object 형태의 타입을 지정하였다.

그리고 `JSON.parse(data)` 라는 코드를 볼 수 있는데, 이를 실행하면 객체를 반환할 것이다.

이 Object 타입은 Person 타입과 다르다.

하지만 이 값을 Person 타입으로 사용하고 싶을 경우, 타입을 변환해야 하기 때문에, 다음과 같이 Assertion을 진행한 것이다.

주어진 데이터를 처리하고 T 타입으로 변경해주는 함수를 구현한 것이다.

## readonly 속성

만약 Object 값이 있는데, 그 속성을 변치 않게 하고 싶을 수가 있다.

이런 경우, 사용할 수 있는 방법이 있다.

```
type NoChangePls = {
  readonly attr : string,
}

let noChangeObj :NoChangePls = {
  attr : 'don't change please'
}

noChangeObj.attr = 'change it!'
```

다음과 같이 readonly 속성을 주면, 누군가 그 속성을 변경하려 할 때, 에러가 발생한다.

물론, 실행해보면 무시하고 실행된다. 

TypeScript 는 단지 에디터 상으로만 에러를 표시한다. 주의하자.

## Object 로 선언한 타입들 합치기

```
type ObjA = { a: number };
type ObjB = { b: number };
type ObjAB = ObjA & ObjB;
```

다음과 같이 ObjA 와 ObjB 라는 타입을 선언했는데, 두 타입을 합치고 싶다면,

즉, 다음과 같은 타입을 만들고 싶다면,

```
{
    a: number,
    b: number
}
```

& 연산자로 타입을 합칠 수 있다.

위의 ObjAB가 그 기능을 사용한 예시이다.

## 값이 아닌 타입을 비교하는 TypeScript
```
var data = {
  name : 'kim'
}

function myFunc(a : 'kim') {

}
myFunc(data.name)
```

다음 코드에서 myFunc는 에러가 발생한다.

myFunc에서 a는 'kim'이라는 타입을 갖기로 했는데, data.name은 'kim'이라는 값이지, 'kim'이라는 타입이 아니다.

TypeScript는 값이 아닌 타입을 체크한다는 것을 기억하자.

## 화살표 함수 활용

arrow function으로도 타입을 지정할 수 있다.

```
type ArrowType = (a:number, b:string)=>boolean;
```
다음과 같이 arrow function 형태로 함수 형태의 타입을 선언할 수 있다.

## HTML 값 사용 시 주의점

### document.getElementById() 

javascript 에서는 document.getElementById() 같이 특정 id나 class 등으로 HTML 요소를 찾을 수 있다.

게다가 그 요소를 수정할 수도 있는데, TypeScript 사용 시, 몇가지 고려해야할 사항들이 있다.

아래는 코딩애플의 예시를 참고하였다.
```
let 제목 = document.querySelector('#title');
제목.innerHTML = '반갑소'
```
다음 코드에서는 에러가 발생한다.

제목.innerHTML 이 union 타입이라고 나온다.

보면 innerHTML의 타입은 Element | null 이라고 한다.

이를 해결하기 위해서는 여러 해결책이 있다.

1. Narrowing
    ```
    let 제목 = document.querySelector('#title');
    if (제목 != null) {
        제목.innerHTML = '반갑소'
    }
    ```
    기존에 union type 에서 Narrowing 하듯 처리하면 된다.

2. instanceof
    ```
    let 제목 = document.querySelector('#title');
    if (제목 instanceof HTMLElement) {
        제목.innerHTML = '반갑소'
    }
    ```

    instanceof 는 왼쪽 피연산자가 오른쪽 피연산자를 기반으로 한 객체인지 true/false를 반환한다.

    이를 통해 어떤 클래스를 갖는지 확인하는 조건문을 구현할 수 있다.

3. Assertion
    ```
    let 제목 = document.querySelector('#title') as HTMLElement;
    제목.innerHTML = '반갑소'
    ```

    기존에 Assertion을 하듯 구현하면 된다.

    하지만, Assertion의 불안정한 특성 때문에 개인적으로 선호하지 않을 것 같다.

4. optional chaining
    ```
    let 제목 = document.querySelector('#title');
    if (제목?.innerHTML != undefined) {
        제목.innerHTML = '반갑소'
    }
    ```

    optional chaining 연산자라는 것이 있다.

    `객체?.속성` 에서 '?' 가 그것이다.

    이 ?의 의미는 객체가 존재하면 속성을 제대로 사용하고, 아니라면 undefined 를 반환한다는 의미이다.

5. strict 설정 제거

    이러한 null로 인한 에러들은 compile option에서 strictNullChecks 옵션을 true로 했기 때문이다.

    null인 것을 특정 목적으로 사용하려 할 때, 오류로 감지하는 것이다.

    이 설정을 false로 바꾸거나 제거하면, 위에서 발생한 에러들이 사라질 것이다.

    하지만 그만큼 엄격한 타입 체킹이 안된다는 단점도 있을 것이다.

5가지 방법들을 알아보았는데, 개인적인 생각으로는 Assertion이나 strict 설정 제거는 선호하지 않을 것 같다.

이 두 방법은 상대적으로 자유로워지나, TypeScript로 얻게 되는 엄격한 타입 에러 체크라는 장점을 줄이는 듯 보이기 때문에 선호하지 않을 것 같다.

만약 사용하게 된다면 기본적으로 Narrowing, instanceof 를 사용하고,

가독성을 위해 optional chaining을 사용하게 될 것 같다.

optional chaining의 경우, 어느 정도 자유로워지는 느낌이 들지만, 추후 사용해보며 단점을 알아가야 할 것 같다.

### 태그의 속성 변경

javascript를 통해 태그의 속성을 변경할 수도 있다.

하지만, 그냥 instanceof HTMLElement를 하게 되면 에러가 발생할 수 있다.

```
let 링크 = document.querySelector('#link');
if (링크 instanceof HTMLElement) {
  링크.href = 'https://kakao.com' //에러남 ㅅㄱ
}
```
이 코드는 link라는 id를 가진 a 태그를 선택하여 href 속성을 변경하는 코드이다.

하지만 해당 코드는 링크.href 에서 에러가 발생한다.

그 이유는 링크가 HTMLElement에 href 속성이 없다고 한다.

HTMLElement를 HTMLAnchorElement로 변경하면 에러가 사라진다.

이는 HTMLAnchorElement에 href 속성이 있기 때문이다.

HTMLElement는 HTMLAnchorElement을 포함해 여러 종류의 HTML Element 클래스를 포함한다고 한다.

각 클래스마다 속성도 다른 것이다.

그렇기에 태그의 속성을 수정하기 위해서는 적합한 클래스를 찾는 것에 주의해야 한다.

## class 타입 지정

```
class myClass {
    strData:string;
    constructor (input: string){
      this.strData = input;
    }

    myFunc(input: string):void{
        console.log(input);
    }
}
```
class 에서도 타입 지정이 들어간다.

class 에서는 필드 값을 지정할 수 있는데, 위 예시에서는 strData가 필드 값이다.

필드 값에도 타입 지정을 한 것을 볼 수 있다.

class에는 constructor를 구현할 수 있는데, 그곳에도 타입 지정이 들어간다.

함수 형태이다보니, parameter에 타입 지정이 되었는데, 반환값은 그렇지 않은 모습이다.

이는 어차피 constructor가 object로 반환되니, 할 필요가 없어서 그렇다.

그리고 myFunc라는 함수를 볼 수 있는데, 이는 prototype.myFunc를 지정한 것과 같은 효과를 지닌다.

이것 또한 함수이기 때문에 타입 지정을 하였다. 

## interface

우리는 Object 속성마다 타입 지정하는 방법을 배웠다.

```
type MyObjType = { attr1 : string, attr2 : number };
```
그런데 Object를 타입 지정할 때, interface라는 것을 활용할 수 있다.

```
interface MyObjType{
    attr1 : string, 
    attr2 : number
}
```
이 interface를 활용한 코드는 type으로 한 것과 유사하게 작동한다.

```
interface Parent {
    dna :string,
}
interface Child extends Parent {
    addition :string,
}
```
interface의 장점은 type과 다르게 extends를 사용할 수 있다.

위의 예시에서 Child는 Parent를 extends 하는데, 이렇게 되면 Child에 Parent의 dna 속성을 받아온다.

extends 하는 interface에 찾고 있는 속성이 없으면 extends 되는 interface에서 그 속성을 찾는다고 보면 되며, 이는 extends를 계속하는 한 반복된다고 보면 된다.

계속해서 extends 되는 interface를 찾는 것이다.

또 하나 type과 interface 사이 차이점이라 한다면, type은 중복 선언이 안되고, interface는 가능하다.

```
type MyObjType = { attr1 : string, attr2 : number };
type MyObjType = { attr3 : boolean}; // 에러 발생
```

```
interface MyObjType{
    attr1 : string, 
    attr2 : number
}
interface MyObjType{
    attr3 : boolean // 에러 없음
}
```
type을 활용한 구현은 에러가 발생하고, interface를 활용한 구현은 에러가 발생하지 않는다.

하지만 여기서 주의해야할 점은 속성의 중복 선언은 불가능하다는 점이다.

```
interface MyObjType{
    attr1 : string, 
    attr2 : number
}
interface MyObjType{
    attr1 : boolean // 에러 발생
}
```
여기서 보면 같은 interface에 같은 attr1 속성을 다른 타입으로 지정하였다.

이렇게 지정하면 attr1을 string과 boolean을 동시에 만족해야 하기 때문에 말이 안된다.

이런 관점에서 &도 확인해보자.

```
type MyObjType1 = { attr1 : string }
type MyObjType2 = { attr1 : boolean } & MyObjType1

const myObj :MyObjType2 = {attr1:true} // 에러 발생
```

다음은 예전에 배웠던 &를 활용한 구현이다.

선언 시에는 MyObjType2에 에러가 발생하지 않는다. 

속성의 이름이 같고, 타입이 다른데도 구현은 가능했다.

string과 boolean을 동시에 만족하는 attr1를 선언해야하는 상황이 되었다.

이 경우, 그 속성에 값을 선언할 때 에러가 발생한다.

never 타입이라고 하며, 타입 체크를 해준다.

&는 자유로워지지만 타입 체크에 약해지는 단점을 볼 수 있었다.

