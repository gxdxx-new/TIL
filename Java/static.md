## 정적 (Static)

- #### Static 키워드를 이용해 Static변수와 Static메서드를 만들 수 있다.
- #### 정적 필드와 정적 메서드는 객체(인스턴스)에 소속된 멤버가 아니라 **클래스에 고정된 멤버**이다.
- #### 클래스에 고정되므로 클래스 로더가 클래스를 로딩해서 메서드 메모리 영역에 적재할 때 클래스 별로 관리된다.
- #### 그러므로 클래스의 로딩이 끝나는 즉시 바로 사용할 수 있다.
- #### 객체가 생성되기 이전에 이미 할당이 되어 있으므로 객체의 생성 없이 바로 접근(사용)할 수 있다.
- #### 할당된 메모리는 프로그램이 종료될 때 해제된다.
- #### Static메서드에서는 Static으로 선언되지 않은 변수에 접근할 수 없다.
  - #### 이유: 객체가 생성되기 전에 이미 할당이 되기 때문에
- #### 인스턴스 메서드에서는 Static변수와 Static메서드에 접근할 수 있다.

---

### 정적(Static) 멤버 생성

- Static변수(정적 필드)와 Static메서드(정적 메서드)를 합쳐 정적 멤버라 한다.

<img src="https://user-images.githubusercontent.com/35963403/162667065-00671d6a-b169-4092-84d4-1e95a41225aa.PNG" width="700">

- #### Static 영역

  - Class가 Static 영역에 존재한다.
  - Static 영역에 할당된 메모리(정적 멤버)는 **모든 객체가 공유하는 메모리**가 된다.
    - 멤버를 어디서든지 참조할 수 있게 된다.
  - **Garbage Collector의 관리 영역 밖에 존재**하기 때문에 프로그램 종료시까지 메모리가 할당된 채로 존재한다.
  - 그렇기 때문에 Static을 너무 남발하면 시스템 성능에 악영향을 줄 수 있다.

- #### Heap 영역

  - new 연산을 통해 생성한 객체가 존재한다.
  - Heap 영역의 메모리는 Garbage Collector를 통해 관리 받는다.

---

### 정적(Static) 멤버 선언

- 필드나 메서드를 생성 시 인스턴스로 생성할 지 정적으로 생성할 지에 대한 판단 기준은 **공용으로 사용하느냐**로 결정하면 된다.
- 필드나 메서드 생성 시 Static 키워드를 붙여주면 정적으로 생성된다.

```java
static int num = 0; // 타입 필드 = 초기값
public static void static_method(){} // static 리턴 타입 메소드 {}
```

---

### 정적(Static) 필드 사용 예시

```java
class Number{
    
    static int num = 0; // 클래스 필드
    int num2 = 0; // 인스턴스 필드
    
}

public class Static_ex {
	
    public static void main(String[] args) {
        
    	Number number1 = new Number(); // 첫번째 number
    	Number number2 = new Number(); // 두번쨰 number
    	
    	number1.num++; // 클래스 필드 num을 1증가시킴
    	number1.num2++; // 인스턴스 필드 num을 1증가시킴
    	System.out.println(number2.num); // 두번째 number의 클래스 필드 출력
    	System.out.println(number2.num2); // 두번째 number의 인스턴스 필드 출력
        
    }
}
```

- 인스턴스 변수는 인스턴스가 생성될 때마다 생성되므로 인스턴스마다 각각 다른 값을 가진다.
- **정적 변수는 모든 인스턴스가 하나의 저장 공간을 공유하므로 항상 같은 값**을 가진다.

---

### 정적(Static) 메서드 사용 예시

```java
class Name{
    
    static void print() { // 클래스 메소드
	    System.out.println("내 이름은 홍길동입니다.");
    }

    void print2() { // 인스턴스 메소드
	    System.out.println("내 이름은 이순신입니다.");
    }
    
}

public class Static_ex {
	
    public static void main(String[] args) {
        
        Name.print(); // 인스턴스를 생성하지 않아도 호출이 가능
    	
        Name name = new Name(); // 인스턴스 생성
        name.print2(); // 인스턴스를 생성하여야만 호출이 가능
        
    }
}
```

- **정적 메서드는 클래스가 메모리에 올라갈 때 자동으로 생성**된다.
- 자동으로 생성되기 때문에 정적 메서드는 인스턴스를 생성하지 않아도 호출할 수 있다.