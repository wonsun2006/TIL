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

narrowingFunc(1);
narrowingFunc('1');
assertionFunc('1');