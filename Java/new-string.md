## String 객체 생성 2가지 방식의 차이점 (new String() vs "")

## new String과 ""의 차이

#### Java에서 문자열은 Heap 영역 내의 String Pool이라는 곳에서 따로 관리하게 된다.

- "" 으로 선언된 String은 **String Pool에 추가**가 되고 해당 값을 참조 값으로 가지게 된다.
- 반면 new String()으로 생성된 String은 String Pool이 아닌 **Heap 영역에 새로운 객체를 등록**하게 된다.
- 즉, 위 두 방법으로 객체를 생성하였을 경우 각 객체의 메모리상의 위치가 다른 것이다.

```java
String s1 = "don";
String s2 = new String("don");
```

- s1처럼 큰 따옴표로 String 객체를 생성하면
  - 먼저 String pool에 같은 값이 있는지 확인하고 있으면 그 주소값을 리턴하고,
  - 없으면 새로운 객체를 만들어 String pool에 할당한 뒤 그 주소값을 리턴한다.
- s2처럼 new로 생성하면
  - 다른 객체들처럼 강제로 Heap 영역에 생성하고 그 주소값을 리턴한다.
  - (new로 생성한 String 객체에서 intern() 메소드를 사용하면 String pool에서 같은 값을 갖는 메모리를 가져올 수 있다.)