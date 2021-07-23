# **배열과 구조체**

---

### 배열이란?

같은 형의 변수를 여러 개 만드는 경우에 사용한다.

- int list1, list2, list3, list4, list5, list6; -> int list[6];

---

### 배열 초기화

- int a[5] = {10, 20, 30, 40, 50};

---

### 배열 ADT

객체: <인덱스, 값> 쌍의 집합이다.

연산:

- create(size) ::= size개의 요소를 저장할 수 있느 배열 생성
- get(A, i) ::= 배열 A의 i번째 요소 반환
- set(A, i, v) ::= 배열 A의 i번째 위치에 값 v 저장

---

### 1차원 배열

```c
int list[6];
list[0] = 100;      // set 연산에 해당
value = list[0];    // get 연산에 해당
```

---

### 2차원 배열

```c
int list[3][5];
```

---

### 구조체

구조체(structure): 타입이 다른 데이터를 하나로 묶는 방법이다.

배열(array): 타입이 같은 데이터들을 하나로 묶는 방법이다.

---

### 구조체의 사용 예

구조체의 선언과 구조체 변수의 생성

```c
struct studentTag
{
    char name[10]; // 문자 배열로 된 이름
    int age;       // 나이를 나타내는 정수값
    double gpa;    // 평균 평점을 나타내는 실수값
}
```

```c
struct studentTag s1;

strcpy(s.name, "Nam");
s.age = 26;
s.gpa = 3.8;
```

---

### typedef

```c
typedef studentTag
{
    char name[10]; // 문자 배열로 된 이름
    int age;       // 나이를 나타내는 정수값
    double gpa;    // 평균 평점을 나타내는 실수값
}
student;

student s;

student s = {"kim", 26, 3.8};
```

---

### typedef 사용 예

```c
#include <stdio.h>

typedef studentTag
{
    char name[10]; // 문자 배열로 된 이름
    int age;       // 나이를 나타내는 정수값
    double gpa;    // 평균 평점을 나타내는 실수값
}
student;

int main(void)
{
    student a = {"kim", 20, 4.3};
    student b = {"park", 21, 4.2};
    return 0;
}
```

---

### 배열의 응용: 다항식

프로그램에서 다항식을 처리하려면 다항식을 위한 자료구조가 필요하다.

- 어떤 자료구조를 사용해야 다항식의 덧셈, 뺄셈, 곱셈, 나눗셈 연산을 할 때 편리하고 효율적일지

배열을 사용한 2가지 방법

- 다항식의 모든 항을 배열에 저장한다.
- 다항식의 0이 아닌 항만을 배열에 저장한다.

### 다항식 표현 방법 #1

- 모든 차수에 대한 계수값을 배열로 저장한다.

- 하나의 다항식을 하나의 배열로 표현한다.

<img width="400" alt="2_1" src="https://user-images.githubusercontent.com/35963403/126744307-2073fea1-33fd-4667-a7c2-031c85a5eb2d.PNG">

```c
#define MAX_DEGREE 101 // 다항식의 최대차수 + 1

typedef struct
{
    int degree;
    float coef[MAX_DEGREE];
} polynomial;

polynomial a = {5, {10, 0, 0, 0, 6, 3}};

// C = A+B 여기서 A와 B는 다항식이다. 구조체가 반환된다.
polynomial poly_add1(polynomial A, polynomial B)
{
    polynomial C;                     // 결과 다항식
    int Apos = 0, Bpos = 0, Cpos = 0; // 배열 인덱스 변수
    int degree_a = A.degree;
    int degree_b = B.degree;
    C.degree = MAX(A.degree, B.degree); // 결과 다항식 차수
    while (Apos <= A.degree && Bpos <= B.degree)
    {
        if (degree_a > degree_b)
        { // A항 > B항
            C.coef[Cpos++] = A.coef[Apos++];
            degree_a--;
        }
        else if (degree_a == degree_b)
        { // A항 == B항
            C.coef[Cpos++] = A.coef[Apos++] + B.coef[Bpos++];
            degree_a--;
            degree_b--;
        }
        else
        { // B항 > A항
            C.coef[Cpos++] = B.coef[Bpos++];
            degree_b--;
        }
    }
    return C;
}
void print_poly(polynomial p)
{
    for (int i = p.degree; i > 0; i--)
        printf("%3.1fx^%d + ", p.coef[p.degree - i], i);
    printf("%3.1f \n", p.coef[p.degree]);
}

// 주함수
int main(void)
{
    polynomial a = {5, {3, 6, 0, 0, 0, 10}};
    polynomial b = {4, {7, 0, 5, 0, 1}};
    polynomial c;
    print_poly(a);
    print_poly(b);
    c = poly_add1(a, b);
    printf(“---------------------------------------------------------\n”);
    print_poly(c);
    return 0;
}
```

실행결과

```c
3.0x^5 + 6.0x^4 + 0.0x^3 + 0.0x^2 + 0.0x^1 + 10.0
7.0x^4 + 0.0x^3 + 5.0x^2 + 0.0x^1 + 1.0
---------------------------------------------------------
3.0x^5 + 13.0x^4 + 0.0x^3 + 5.0x^2 + 0.0x^1 + 11.0
```

### 다항식 표현 방법 #2

- 다항식에서 0이 아닌 항만을 배열에 저장한다.
- (계수, 차수) 형식으로 배열에 저장한다.
  - ex) 10x^5+6x+3 -> ((10,5), (6,1), (3,0))

```c
#define MAX_TERMS 101
struct
{
    float coef;
    int expon;
} terms[MAX_TERMS] = {{8, 3}, {7, 1}, {1, 0}, {10, 3}, {3, 2}, {1, 0}};

int avail = 6;

// 두 개의 정수를 비교
char compare(int a, int b)
{
    if (a > b)
        return '>';
    else if (a == b)
        return '=';
    else
        return '<';
}

// 새로운 항을 다항식에 추가한다.
void attach(float coef, int expon)
{
    if (avail > MAX_TERMS)
    {
        fprintf(stderr, "항의 개수가 너무 많음\n");
        exit(1);
    }
    terms[avail].coef = coef;
    terms[avail++].expon = expon;
}

// C = A + B
poly_add2(int As, int Ae, int Bs, int Be, int *Cs, int *Ce)
{
    float tempcoef;
    *Cs = avail;
    while (As <= Ae && Bs <= Be)
        switch (compare(terms[As].expon, terms[Bs].expon))
        {
        case '>': // A의 차수 > B의 차수
            attach(terms[As].coef, terms[As].expon);
            As++;
            break;
        case '=': // A의 차수 == B의 차수
            tempcoef = terms[As].coef + terms[Bs].coef;
            if (tempcoef)
                attach(tempcoef, terms[As].expon);
            As++;
            Bs++;
            break;
        case '<': // A의 차수 < B의 차수
            attach(terms[Bs].coef, terms[Bs].expon);
            Bs++;
            break;
        }
    // A의 나머지 항들을 이동함
    for (; As <= Ae; As++)
        attach(terms[As].coef, terms[As].expon);
    // B의 나머지 항들을 이동함
    for (; Bs <= Be; Bs++)
        attach(terms[Bs].coef, terms[Bs].expon);
    *Ce = avail - 1;
}

void print_poly(int s, int e)
{
    for (int i = s; i < e; i++)
        printf("%3.1fx^%d + ", terms[i].coef, terms[i].expon);
    printf("%3.1fx^%d\n", terms[e].coef, terms[e].expon);
}

int main(void)
{
    int As = 0, Ae = 2, Bs = 3, Be = 5, Cs, Ce; // A = 0~2, B = 3~5 번째 인덱스에 저장되어있음
    poly_add2(As, Ae, Bs, Be, &Cs, &Ce);
    print_poly(As, Ae);
    print_poly(Bs, Be);
    printf(“-----------------------------------------------------------------------------\n”);
    print_poly(Cs, Ce);
    return 0;
}
```
