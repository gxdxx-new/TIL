## 문자열 비교에서 == 와 equals() 차이점

- #### int와 boolean과 같은 일반적인 데이터 타입의 비교는 == 연산자를 사용하여 비교한다. 
- #### String처럼 Class의 값을 비교할 때는 ==이 아닌 equals() 메서드를 사용하여 비교한다. 

---

### String 변수 생성 시 주소 할당

1. 리터럴을 이용한 방식
   - string constant pool이라는 영역에 존재하게 된다.
2. new 연산자를 이용한 방식
   -  Heap 영역에 존재하게 된다.
   
#### 리터럴을 이용한 String 변수 생성 시 주소 할당 방법

- String을 리터럴로 선언할 경우 내부적으로 String의 intern() 메서드가 호출된다.
- intern() 메서드는 주어진 문자열이 string constant pool에 존재하는지 검색한다.
  - 있다면 그 주솟값을 반환하고
  - 없다면 string constant pool에 넣고 새로운 주솟값을 반환한다.

```java
String str1 = "apple"; // 리터럴을 이용한 방식
String str2 = "apple"; // 리터럴을 이용한 방식
String str3 = new String("example"); // new 연산자를 이용한 방식
String str4 = new String("example"); // new 연산자를 이용한 방식
```

<img src="https://user-images.githubusercontent.com/35963403/162192158-20a4c0b5-0957-431e-8aff-de755db1d7d8.PNG" width="600">

---

### 주솟값 비교(==) vs 값 비교(equals)


#### == 연산자는 비교하고자 하는 두 대상의 주소값을 비교한다.
#### String 클래스의 equals 메서드는 비교하고자 하는 두 대상의 값 자체를 비교한다.

- 기본 타입의 int형, char형 등은 Call by Value 형태로 기본적으로 대상에 주솟값을 가지지 않는 형태로 사용된다.
- 하지만 String과 같은 클래스는 기본적으로 Call by Reference 형태로, 생성 시 주솟값이 부여된다.
- 그렇기에 String 타입을 선언했을 때는 같은 값을 부여하더라도 서로 간의 주솟값이 다르다.

### 문자열 비교 (== 연산자)

```java
public class compare {
    public static void main(String[] args) {
        String s1 = "abcd";
        String s2 = new String("abcd");
		
        if (s1 == s2) {
            System.out.println("두개의 값이 같습니다.");
        } else {
            System.out.println("두개의 값이 같지 않습니다.");
        }
    }
}
```

- == 으로 비교한 두 개의 값은 서로 다르다는 결론이 나오게 된다.
- == 연산자의 경우 참조 타입 변수들 간의 연산은 동일한 객체를 참조하는지, 다른 객체를 참조하는지 알아볼 때 사용된다.
- 참조 타입의 변수의 값은 힙 영역의 객체 주소이므로 결국 주솟값을 비교하는 것이 되어 다르다는 결론이 나온 것이다.
- 그래서 자바에서 문자열을 비교하려면 equals라는 메서드를 활용하여 두 개의 값을 비교해 주어야 한다.

### 문자열 비교 (equals 메서드)

```java
public class compare {
    public static void main(String[] args) {
        String s1 = "abcd";
        String s2 = new String("abcd");
		
        if (s1.equals(s2)) {
            System.out.println("두개의 값이 같습니다.");
        } else {
            System.out.println("두개의 값이 같지 않습니다.");
        }
    }
}
```

- 두 비교 대상의 주솟값이 아닌 데이터 값을 비교하기 때문에 어떻게 String을 생성하느냐에 따라 결과가 달라지지 않고 정확한 비교를 할 수 있다.