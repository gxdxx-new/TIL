# **스택**

---

### 스택

- 쌓아놓은 더미와 같다.

---

### 스택의 특징

후입선출(LIFO: Last-In First-Out)

- 가장 최근에 들어온 데이터가 가장 먼저 나간다.

---

시스템 스택을 이용한 함수 호출

<img width="400" alt="4-1" src="https://user-images.githubusercontent.com/35963403/127445684-c455b018-11b5-4eeb-b22b-ec7094509732.PNG">

---

### 스택 추상 데이터 타입(ADT)

- 객체: 0개 이상의 원소를 가지는 유한 선형 리스트
- 연산:
  - create(size) ::=
    - 최대 크기가 size인 공백 스택을 생성한다.
  - is_full(s) ::=
    - if(스택의 원소수 == size) return TRUE;
    - else return FALSE;
  - is_empty(s) ::=
    - if(스택의 원소수 == 0) return TRUE;
    - else return FALSE;
  - push(s, item) ::=
    - if( is_full(s) ) return ERROR_STACKFULL;
    - else 스택의 맨 위에 item을 추가한다.
  - pop(s) ::=
    - if( is_empty(s) ) return ERROR_STACKEMPTY;
    - else 스택의 맨 위의 원소를 제거해서 반환한다.
  - peek(s) ::=
    - if( is_empty(s) ) return ERROR_STACKEMPTY;
    - else 스택의 맨 위의 원소를 제거하지 않고 반환한다.

---

### 스택의 연산

- push(): 스택에 데이터를 추가한다.
- pop(): 스택에서 데이터를 삭제한다.
- is_empty(s): 스택이 비어있는지 검사한다.
- is_full(s): 스택이 가득 찼는지 검사한다.
- create(): 스택을 생성한다.
- peak(s): 요소를 스택에서 제거하지 않고 보기만 하는 연산이다.
  - pop 연산은 요소를 스택에서 완전히 삭제하면서 가져온다.

---

### 배열을 이용한 스택의 구현

- 1차원 배열 stack[]
- 스택에서 가장 최근에 입력되었던 자료를 가리키는 top 변수
- 가장 먼저 들어온 요소는 stack[0]에, 가장 최근에 들어온 요소는 stack[top]에 저장
- 스택이 공백상태이면 top은 -1

---

### is_empty 연산 구현

```c
is_empty(S):

if top == -1
    then return TRUE
    else return FALSE
```

---

### is_full 연산 구현

```c
is_full(S):

if top == (MAX_STACK_SIZE - 1)
    then return TRUE
    else return FALSE
```

---

### push 연산 구현

```c
push(S, x):

if is_full(S)
    then error "overflow"
    else top<-top+1
        stack[top]<-x
```

---

### pop 연산 구현

```c
pop(S, x):

if is_empty(S)
    then error "underflow"
    else e<-stack[top]
        top<-top-1
        return e
```

---

### 전역 변수로 구현하기

```c
#include <stdio.h>
#include <stdlib.h>

#define MAX_STACK_SIZE 100 // 스택의 최대 크기

typedef int element; // 데이터의 자료형
element stack[MAX_STACK_SIZE]; // 1차원 배열
int top = -1;

// 공백 상태 검출 함수
int is_empty()
{
    return (top == -1);
}

// 포화 상태 검출 함수
int is_full()
{
    return (top == (MAX_STACK_SIZE - 1));
}

// 삽입 함수
void push(element item)
{
    if (is_full()) {
        fprintf(stderr, "스택 포화 에러\n");
        return;
    }
    stack[++top] = item;
}

// 삭제 함수
element pop()
{
    if (is_empty()) {
        fprintf(stderr, "스택 공백 에러\n");
        exit(1);
    }
    return stack[top--];
}

int main(void)
{
    push(1);
    push(2);
    push(3);

    printf("%d\n", pop());
    printf("%d\n", pop());
    printf("%d\n", pop());

    return 0;
}
```

```c
// console
3
2
1
```

---

### 구조체 배열 사용하기

```c
#define MAX_STACK_SIZE 100

typedef int element;
typedef struct {
 element data[MAX_STACK_SIZE];
 int top;
} StackType;

// 스택 초기화 함수
void init_stack(StackType *s)
{
    s->top = -1;
}

// 공백 상태 검출 함수
int is_empty(StackType *s)
{
    return (s->top == -1);
}

// 포화 상태 검출 함수
int is_full(StackType *s)
{
    return (s->top == (MAX_STACK_SIZE - 1));
}

// 삽입함수
void push(StackType *s, element item)
{
    if (is_full(s)) {
        fprintf(stderr, "스택 포화 에러\n");
        return;
    }
    s->data[++(s->top)] = item;
}

// 삭제함수
element pop(StackType *s)
{
    if (is_empty(s)) {
        fprintf(stderr, "스택 공백 에러\n");
        exit(1);
    }
    return s->data[(s->top)--];
}

int main(void)
{
    StackType s;

    init_stack(&s);

    push(&s, 1);
    push(&s, 2);
    push(&s, 3);

    printf("%d\n", pop(&s));
    printf("%d\n", pop(&s));
    printf("%d\n", pop(&s));
}
```

```c
// console
3
2
1
```

---

### 동적 스택

```c
...
int main(void)
{
    StackType *s;
    s = (StackType *)malloc(sizeof(StackType));

    init_stack(s);

    push(s, 1);
    push(s, 2);
    push(s, 3);

    printf("%d\n", pop(s));
    printf("%d\n", pop(s));
    printf("%d\n", pop(s));

    free(s);
}
```

---

### 동적 배열 스택

malloc()을 호출해서 실행 시간에 메모리를 할당 받아 스택을 생성한다.

```c
typedef int element;
typedef struct {
    element *data; // data는 포인터로 정의된다.
    int capacity; // 현재 크기
    int top;
} StackType;

void push(StackType *s, element item)
{
    if (is_full(s)) {
        s->capacity *= 2;
        s->data = (element *)realloc(s->data, s->capacity * sizeof(element));
    }
    s->data[++(s->top)] = item;
}
...
```

---
