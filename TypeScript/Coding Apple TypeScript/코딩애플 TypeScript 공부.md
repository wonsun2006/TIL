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
