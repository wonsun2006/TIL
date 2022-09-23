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

// primitive types
let primitive : number | string | boolean | 
    null | undefined | number[] | {attr1:number, attr2:string};

// array, object with union
let arrWithUnion : (number|string)[] = ['one', 1];
let objWithUnion : { union: string|number} = {union:"one"};
objWithUnion={union:1};

// any, unknown type
let any:any;
let unknown:unknown;

// void type & parameter?:
function voidFunc(x?:number):void{
    console.log('void function');
}
// voidFunc();

// Narrowing & Assertion

function narrowingFunc(x:number|string):void{
    if(typeof x === 'number'){
        console.log(x+1);
    }else if(typeof x === 'string'){
        console.log(x+1);
    }else{
        console.log('x is not number or string');
    }
}

function assertionFunc(x:number|string):void{
    const temp = x as number;
    console.log(temp+1);
}

// narrowingFunc(1);
// narrowingFunc('1');
// assertionFunc('1');

// readonly Attribute

type NoChangePls = {
    readonly attr : string,
}
  
let noChangeObj :NoChangePls = {
attr: "don't change please"
};
  
// noChangeObj.attr = 'change it!';

// HTML 수정 시 주의점
let changeInnerHTML = document.querySelector('#id');
// let changeInnerHTML = document.querySelector('#id') as HTMLElement; // Assertion
if (changeInnerHTML instanceof HTMLElement) { // use instanceof
    changeInnerHTML.innerHTML = 'HTML Element'
}
if(changeInnerHTML?.innerHTML!=undefined){ // use optional chaining
    changeInnerHTML.innerHTML = 'using optional chaining'
}
if(changeInnerHTML!=null){ // Narrowing
    changeInnerHTML.innerHTML = 'Not null'
}

let aTag = document.querySelector('#link');
// if (aTag instanceof HTMLElement) { // 에러 발생
if (aTag instanceof HTMLAnchorElement) {
  aTag.href = 'https://google.com' 
}

// class 타입 지정
class myClass {
    strData:string;
    constructor (input: string){
      this.strData = input;
    }

    myFunc(input: string):void{
        console.log(input);
    }
  }

// interface
// type MyObjType = { attr1 : string, attr2 : number };

interface MyObjType{
    attr1 : string, 
    attr2 : number
}
interface MyObjType{
    attr3 : string,
    // attr1 : number // 중복 에러
}

interface Parent {
    dna :string,
}
interface Child extends Parent {
    addition :string
}

// & 사용한 속성 중복 -> never type
type MyObjType1 = { attr1 : string }
type MyObjType2 = { attr1 : boolean } & MyObjType1 // 에러 발생은 안함

// const myObj :MyObjType2 = {attr1:true} // 에러 발생