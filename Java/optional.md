## Optional (옵셔널)

- #### null 또는 실제 값을 value로 갖는 wrapper로 감싸서 NPE(NullPointerException)로부터 자유로워지기 위해 나온 Wrapper 클래스이다.
- #### Java 8에서는 Optional<T<T>> 클래스를 사용해 NPE를 방지할 수 있도록 도와준다.
- #### Optional<T<T>>는 <mark>null이 올 수 있는 값을 감싸는 Wrapper 클래스</mark>로, 참조하더라도 NPE가 발생하지 않도록 도와준다.
- #### Optional 클래스는 아래와 같은 value에 값을 저장하기 때문에 값이 null이더라도 바로 NPE가 발생하지 않고, 클래스이기 때문에 각종 메소드를 제공한다.

```java
public final class Optional<T> { 
    
    // If non-null, the value; if null, indicates no value is present 
    private final T value; 
    
    ... 
}
```

### NPE(NullPointerException)

- NPE를 피하기 위해서는 null 검사 로직을 추가해야 한다.
- null 검사를 해야하는 변수가 많은 경우 코드가 복잡해진다.

```java
List<String> names = getNames(); 
names.sort(); // names가 null이라면 NPE가 발생함 
        
List<String> names = getNames();
// NPE를 방지하기 위해 null 검사를 해야함
if(names != null){ 
    names.sort(); 
}
```

---

### Optional 생성

#### Optional.empty() - 값이 비어있는 경우

- Optional은 Wrapper 클래스이기 때문에 빈 값이 올수도 있는데, 빈 객체는 Optional.empty()로 아래와 같이 생성할 수 있다.
- Optional 클래스는 내부에서 static 변수로 EMPTY 객체를 미리 생성해서 가지고 있다. 
- 빈 객체를 여러 번 생성해줘야 하는 경우에도 1개의 EMPTY 객체를 공유함으로써 메모리를 절약하고 있다.

```java
Optional<String> optional = Optional.empty();

System.out.println(optional); // Optional.empty
System.out.println(optional.isPresent()); // false
``` 

#### Optional.of() - 값이 Null이 아닌 경우

- 어떤 데이터가 null이 아닌 경우에는 Optional.of()로 생성할 수 있다.
- 만약 Optional.of()로 Null을 저장하려고 하면 NPE가 발생한다.

```java
// Optional의 value는 null이 아니다. 
Optional<String> optional = Optional.of("MyName");
```

#### Optional.ofNullable() - 값이 Null일수도, 아닐수도 있는 경우

- 만약 어떤 데이터가 null이 올 수도 있고 아닐 수도 있는 경우에는 Optional.ofNullbale()로 생성할 수 있다. 
- 이후에 orElse 또는 orElseGet 메소드를 이용해서 값이 없는 경우라도 안전하게 값을 가져올 수 있다.


```java
// Optional의 value는 값이 있을 수도 있고 null 일 수도 있다.
Optional<String> optional = Optional.ofNullable(getName());
String name = optional.orElse("anonymous"); // 값이 없다면 "anonymous" 를 리턴
```

---

### Optional 사용법

#### Optional 사용 예시 1

- 기존에는 아래와 같이 null 검사를 한 후에 null일 경우에는 새로운 객체를 생성해주어야 했다.
- Optional<T>와 Lambda를 이용하면 해당 과정을 보다 간단하게 표현할 수 있다.

```java
// Java8 이전 
List<String> names = getNames(); 
List<String> tempNames = list != null ? list : new ArrayList<>(); 

// Optional
List<String> nameList = Optional.ofNullable(getList())
        .orElseGet(() -> new ArrayList<>());
```

#### Optional 사용 예시 2

- 아래와 같이 우편번호를 꺼내는 null 검사 코드가 있다.

```java
public String findPostCode() { 
    UserVO userVO = getUser();
    if (userVO != null) { 
        Address address = userVO.getAddress();
        if (address != null) { 
            String postCode = address.getPostCode();
            if (postCode != null) { 
                return postCode; 
            } 
        } 
    } 
    return "우편번호 없음"; 
}
```

- Optional을 사용하면 아래와 같이 표현할 수 있다.

```java
public String findPostCode() { 
    // 위의 코드를 Optional로 펼쳐놓으면 아래와 같다. 
    Optional<UserVO> userVO = Optional.ofNullable(getUser()); 
    Optional<Address> address = userVO.map(UserVO::getAddress); 
    Optional<String> postCode = address.map(Address::getPostCode);
    String result = postCode.orElse("우편번호 없음"); 
    
    // 그리고 위의 코드를 다음과 같이 축약해서 쓸 수 있다. 
    String result = user.map(UserVO::getAddress) 
        .map(Address::getPostCode) 
        .orElse("우편번호 없음"); 
}
```

#### Optional 사용 예시 3

- 아래와 같이 이름을 대문자로 변경하면서 NPE 처리를 해주는 코드가 있다.

```java
String name = getName(); 
String result = ""; 

try { 
    result = name.toUpperCase(); 
} catch (NullPointerException e) { 
    throw new CustomUpperCaseException();
}
```

- Optional을 사용하면 아래와 같이 표현할 수 있다.

```java
Optional<String> nameOpt = Optional.ofNullable(getName()); 
String result = nameOpt.orElseThrow(CustomUpperCaseExcpetion::new) 
        .toUpperCase();
```

---

### Optional 정리

- Optional은 null 또는 실제 값을 value로 갖는 wrapper로 감싸서 NPE(NullPointerException)로부터 자유로워지기 위해 나온 Wrapper 클래스이다. 
- 또한 Optional은 파라미터로 넘어가는 등이 아니라 반환 타입으로써 제한적으로 사용되도록 설계되었다.
- Optional은 값을 Wrapping하고 다시 풀고, null일 경우에는 대체하는 함수를 호출하는 등의 오버헤드가 있으므로 잘못 사용하면 성능을 저하시킬 수 있다.
- 그렇기 때문에 메소드의 반환 값이 절대 null이 아니라면 Optional을 사용하지 않는 것이 좋다.
- 즉, Optional은 메소드의 결과가 null이 될 수 있으며, null에 의해 오류가 발생할 가능성이 매우 높을 때 반환값으로만 사용되어야 한다.

---

### orElse와 orElseGet의 차이

#### orElse

- 파라미터로 값을 필요로한다.
- 값이 미리 존재하는 경우에 사용한다.

#### orElseGet

- 파라미터로 함수(함수형 인터페이스)를 필요로 한다.
- 값이 미리 존재하지 않는 거의 대부분의 경우에 orElseGet을 사용하면 된다.