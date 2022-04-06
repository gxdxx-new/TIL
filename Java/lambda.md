## 람다식 (Lambda Expressions)

- #### 식별자 없이 실행 가능한 메서드이다.
- #### 함수를 하나의 식으로 표헌한다.
- #### 메서드의 이름이 필요 없기 때문에, 익명 함수(Anonymous Function)의 한 종류이다.

---

### 람다식의 장단점

#### 람다식 장점

1. 코드를 간결하게 만들 수 있다.
2. 식에 개발자의 의도가 명확히 드러나므로 가독성이 향상된다.
3. 함수를 만드는 과정 없이 한번에 처리할 수 있기에 코딩하는 시간이 줄어든다.
4. 병렬 프로그래밍에 용이하다.

#### 람다식 단점

1. 람다를 사용하면서 만드는 익명 함수는 재사용이 불가능하다.
2. 디버깅이 까다롭다.
3. 람다를 남발하면 코드가 지저분해질 수 있다. (비슷한 함수를 계속 중복 생성할 가능성이 높다)
4. 재귀로 만들 경우에는 다소 부적합하다.

---

### 람다식 사용법

```
(매개변수, ...) -> { 실행문 ... }
```

- (매개변수, ...)는 오른쪽 중괄호 { } 블록을 실행하기 위해 필요한 값을 제공하는 역할을 한다.
- 매개변수 이름은 자유롭게 지정할 수 있고 인자타입을 명시하지 않아도 된다.

---

### 람다식과 일반 메서드 비교

```java
@FunctionalInterface
interface Say{
    int something(int a,int b);
}
class Person{
    public void hi(Say line) {
	int number = line.something(3,4);
	System.out.println("Number is " + number);
    }
}
```

#### 람다식 사용 X

```java
Person person = new Person();

person.hi(new Say() {
    
    public int something(int a, int b) {
	    System.out.println("parameter number is " + a + "," + b);
	    return 7;
    }
    
});
```

#### 람다식 사용 O

```java
Person person = new Person();

person.hi((a,b) -> {
    
    System.out.println("parameter number is " + a + "," + b);
    return 7;
    
});
```

---

### 람다식 간단 예제

#### 1. 두 개의 숫자 더하기

```java
interface Compare{
    public int compareTo(int a, int b);
}

public class Ramda2 {
    
    //람다식 문법 (매개변수 목록) -> { 실행문 }
    public static void exec(Compare com) {
        int k = 10;
	    int m = 20;
	    int value = com.compareTo(k, m);
	    System.out.println(value);
    }
    
    public static void main(String[] args) {
	    exec((i,j) -> {
	        return i+j;
	    });
    }
}
```

---

#### 2. 두 개의 숫자 중 큰 수 찾기

```java
import extendsss.main;

public class Ramda3 { 
    
    @FunctionalInterface//함수형 인터페이스 체크 어노테이션
    public interface MyNumber{
	  int getMax(int num1, int num2);
    }
    
    public static void main(String[] args) {
        MyNumber max = (x,y) -> (x >= y) ? x : y;
	    System.out.println(max.getMax(10, 30));
    }
    
}
```

---

#### 3. Runnable 인스턴스 생성

```java
public class RunnableEx {
    
    public static void main(String[] args) {
        
        Runnable runnable = () -> {
            for (int i = 0; i < 30; i++) {
                System.out.println(i);
            }
        };
        
        Thread thread = new Thread(runnable);
        thread.start();
        
    }
    
}
```

---

#### 4. Thread 호출

```java
Thread thread = new Thread( () -> {
    
    for (int i = 0; i < 10; i++) {
        System.out.println(i);
    }
    
});
```