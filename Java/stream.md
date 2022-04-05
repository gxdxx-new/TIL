## Stream (스트림)

- #### 자바8부터 추가된 컬렉션의 저장 요소를 하나씩 참조해서 람다식으로 처리할 수 있도록 해주는 반복자이다. 
- #### Iterator와 비슷한 역할을 하지만 람다식으로 요소 처리 코드를 제공하여 코드가 간결하게 해준다.
- #### 내부 반복자를 사용하므로 병렬처리가 쉽다

---

### Iterator과 Stream의 코드 비교

```java
ArrayList<Integer> list = new ArrayList<Integer>(Arrays.asList(1,2,3));
  
Iterator<Integer> iter = list.iterator();
  
while(iter.hasNext()) {
    int num = iter.next();
    System.out.println("값 : "+num);
}
```

- 자바6 이전까지는 ArrayList에서 요소를 순차적으로 출력하기 위해 Iterator 반복자를 사용해야 했다.

```java
ArrayList<Integer> list = new ArrayList<Integer>(Arrays.asList(1,2,3));
  
Stream<Integer> stream = list.stream();
  
stream.forEach(num -> System.out.println("값 : "+num));
```

- 자바8 부터 추가된 스트림을 사용하면 훨씬 단순해진다. 
- stream() 메서드로 스트림 객체를 얻은 후 foreach(num -> System.out.println(num));에서 ArrayList에 있는 요소들을 하나씩 출력한다. 
- stream.forEach()메서드는 Consumer 함수적 인터페이스 타입의 매개값을 가지므로 컬렉션의 요소를 소비할 코드를 람다식으로 만들 수 있다.

---

### Stream 사용법

#### 배열에서의 스트림 활용

```java
// String 배열
String[] strArray = { "홍길동", "이순신", "임꺽정"};
Stream<String> strStream = Arrays.stream(strArray);
strStream.forEach(a -> System.out.print(a + ","));
System.out.println();
		
// int 배열
int[] intArray = { 1, 2, 3, 4, 5 };
IntStream intStream = Arrays.stream(intArray);
intStream.forEach(a -> System.out.print(a + ","));
System.out.println();
```

---

#### 클래스에서의 스트림 활용

```java
class Student {
    private String name;
    private int score;
	
    public Student(String name, int score) {
        this.name = name;
        this.score = score;
    }

    public String getName() { return name; }
    public int getScore() { return score; }
}

public class FromCollectionExample {
    public static void main(String[] args) {
        List<Student> studentList = Arrays.asList(
            new Student("홍길동", 10),
            new Student("이순신", 20),
            new Student("임꺽정", 30)
        );
		
        Stream<Student> stream = studentList.stream();
        stream.forEach(s -> System.out.println("이름 : "+ s.getName()));
    }
}
```