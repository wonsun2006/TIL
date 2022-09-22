// 문자열 타입 지정
var myName = "myname";
// 문자열 배열 타입 지정
var keywords = ['my', 'name'];
// Object 타입 지정
var age = { age: 123 };
age = { age: 456, birth: 220922 };
// union 타입 지정 (여러 타입 지정)
var dynamicVar = 'dynamic';
dynamicVar = 123;
var newVar = 1;
newVar = [2, 3, 4];
newVar = 'only';
// 함수 타입 지정 (입/출력 타입)
function timesTwo(x) {
    return x * 2;
}
var arrType = [111, true];
var manyKey = {
    key1: 1,
    key2: 2,
};
// class 타입 지정
var MyClass = /** @class */ (function () {
    function MyClass(attribute) {
        this.attribute = attribute;
    }
    return MyClass;
}());
// primitive types
var primitive;
// array, object with union
var arrWithUnion = ['one', 1];
var objWithUnion = { union: "one" };
objWithUnion = { union: 1 };
// any, unknown type
var any;
var unknown;
// void type & parameter?:
function voidFunc(x) {
    console.log('void function');
}
// voidFunc();
// Narrowing & Assertion
function narrowingFunc(x) {
    if (typeof x === 'number') {
        console.log(x + 1);
    }
    else if (typeof x === 'string') {
        console.log(x + 1);
    }
    else {
        console.log('x is not number or string');
    }
}
function assertionFunc(x) {
    var temp = x;
    console.log(temp + 1);
}
narrowingFunc(1);
narrowingFunc('1');
assertionFunc('1');
