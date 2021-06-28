# **자바스크립트**
## **1. 호출 스택, 이벤트 루프**
---

### 1.1. 호출 스택
```javascript
function first() {
    second();
    console.log('첫 번째');
}
function second() {
    third();
    console.log('두 번째');
}
function third() {
    console.log('세 번째');
}
first();
```
* 위 코드의 순서: 세 번째 -> 두 번째 -> 첫 번째
* 쉽게 파악하는 방법 : 호출 스택 그리기
<br/><br/>
<img src="./image/callStack.png" width="400" height="200">
    * Anonymous는 가상의 전역 컨텍스트(항상 있다고 생각하는게 좋음)
    * 함수 호출 순서대로 쌓이고, 역순으로 실행됨
    * 함수 실행이 완료되면 스택에서 빠짐
<br/><br/>

```javascript
function run() {
    console.log('3초 후 실행');
}
console.log('시작');
setTimeout(run, 3000);  // 비동기 코드, 3초 뒤에 run() 호출
console.log('끝');

```
* 위 코드는 시작 -> 끝 -> 3초 후 실행
* 비동기 코드 때문에 호출 스택만으로는 설명이 안되고 이벤트 루프도 봐야됨
<br/><br/>

### 1.2. 이벤트 루프
<img src="./image/eventLoop.png" width="500" height="300"><br/>
* 이벤트 루프: 이벤트 발생(setTimeout 등)이 발생할 때 호출할 콜백 함수들(위의 그림에서는 run)을 관리하고, 호출할 순서를 결정하는 역할
* 태스크 큐: 이벤트 발생 후 호출되어야 할 콜백 함수들이 순서대로 기다리는 공간
* 백그라운드: 타이머나 I/O 작업 콜백, 이벤트 리스너들이 대기하는 공간. 여러 작업이 동시에 실행될 수 있음
* 호출 스택과 백그라운드는 동시에 실행됨<br/>

<img src="./image/eventLoop2.png" width="500" height="300"><br/>
* 코드에서 setTimeout이 호출될 때 콜백 함수 run은 백그라운드로 보내지고 3초 뒤 백그라운드에서 태스크 큐로 보내짐<br/>
* setTimeout과 anonymous가 실행 완료된 후 호출 스택이 완전히 비워지면 이벤트 루프가 태스크 큐의 콜백을 호출 스택으로 올림
* 이벤트 루프가 태스크 큐의 콜백을 호출 스택으로 올림
    * 호출 스택이 완전히 비워져야만 올림
    * 호출 스택에 함수가 많이 차 있으면 그것들을 처리하느라 3초가 지난 후에도 run 함수가 태스크 큐에서 대기하게 됨 -> 타이머가 정확하지 않을 수 있는 이유<br/>

<img src="./image/eventLoop4.png" width="500" height="300"><br/>
* run이 호출 스택에서 실행되고, 완료 후 호출 스택에서 나감
    * 이벤트 루프는 태스크 큐에 다음 함수가 들어올 때까지 계속 대기
    * 태스크 큐는 실제로 여러 개고, 태스크 큐들과 함수들 간의 순서를 이벤트 루프가 결정함
    * 태스크 큐에선 우선순위에 따라 호출 스택으로 이동
<br/><br/>

## **2. ES2015++**
---
### 2.1. var
* ES2015 이전에는 var 키워드로 변수를 선언
    * 문제점: 중복 선언이 가능해서 오류 발생 가능
    * ES2015부터는 const와 let이 대체
    * const, let: 블록 스코프(Block Scope)
    * var: 함수 스코프(Function Scope)
* 함수 스코프: var 키워드로 선언한 변수는 오로지 함수의 블록만을 지역 스코프로 인정하기 때문에 함수 외부에서 var 키워드로 선언한 변수는 코드 블록 내에서 선언해도 모두 전역 변수가 됨. 전역 변수가 남발될 수 있기 때문에 조심해야함
* 호이스팅(hoisting): var 키워드로 변수를 선언하면 변수 호이스팅에 의해 변수 선언문이 스코프의 제일 위로 올려져서 실행됨
    * let, const도 호이스팅이 일어나지만 초기화 되기전까지 temporal dead zone에 머물게 구현되어 있어서 
```javascript
if (true) {
    var x = 3;
}
console.log(x); // 3

if (true) {
    const y = 3;
}
console.log(y); // Uncaught ReferenceError: y is not defined
```
기존 : 함수 스코프(function() {}이 스코프의 기준점)
* 다른 언어와는 달리 if나 for, while은 영향을 미치지 못함
* const와 let은 함수 및 블록({})에도 별도의 스코프를 가짐<br/>

### 2.2. const, let
```javascript
const a = 0;
a = 1;  // Uncaught TypeError: Assignment to constant variable

let b = 0;
b = 1;  // 1

const c;    // unCaught SyntaxError: Missing initializier in const declaration
```
* const: 반드시 선언과 동시에 초기화해야 됨
* const 키워드로 선언된 변수에 객체를 할당하는 경우에는 값을 변경 가능
* let: 중복 선언할 경우 에러를 출력
    * 블록안에서 지역변수로 동작하기 때문에 전역변수의 남발을 막을 수 있음
