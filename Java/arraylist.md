## ArrayList

- #### List 인터페이스를 상속받은 클래스로 크기가 가변적으로 변하는 선형리스트이다.
- #### 일반적인 배열과 같은 순차리스트이다.
- #### 객체들이 추가되어 저장 용량을 초과하면 자동으로 부족한 크기만큼 저장 용량이 늘어난다.

<img src="https://user-images.githubusercontent.com/35963403/160608576-de7317c0-c2a7-4a05-a887-550c3c13f5b2.PNG" width="500">

### ArrayList 사용법

#### ArrayList 선언

```java
ArrayList list = new ArrayList();   // 타입 미설정 Object로 선언된다.
ArrayList<Student> members = new ArrayList<Student>();  // 타입설정 Student객체만 사용가능
ArrayList<Integer> num = new ArrayList<Integer>();  // 타입설정 int타입만 사용가능
ArrayList<Integer> num2 = new ArrayList<>();    // new에서 타입 파라미터 생략가능
ArrayList<Integer> num3 = new ArrayList<Integer>(10);   // 초기 용량(capacity)지정
ArrayList<Integer> list2 = new ArrayList<Integer>(Arrays.asList(1,2,3));    // 생성시 값추가
```

- 타입을 설정하지 않고 선언하면 값을 꺼낼 때 캐스팅(casting) 연산이 필요하고 잘못된 타입으로 캐스팅하면 에러가 발생할 수 있다.
- JDK5.0 이후부터 자료형의 안정성을 위해 도입된 제네릭스(Generics) 개념을 이용해 다른 타입의 객체가 add되지 않도록 할 수 있다.
- 제네릭스는 객체 타입만 선언할 수 있기 때문에 기본 타입은 wrapper 클래스를 사용해야 한다.

#### ArrayList 값 추가

```java
ArrayList<Integer> list = new ArrayList<Integer>();
list.add(3);    // 값 추가
list.add(null); // null값도 add가능
list.add(1,10); // index 1에 10 삽입
```

```java
ArrayList<Student> members = new ArrayList<Student>();
Student student = new Student(name,age);
members.add(student);
members.add(new Member("홍길동",15));
```

- add(index, value)를 사용한다.
- index를 생략하면 ArrayList 맨 뒤에 데이터가 추가된다.
- index 중간에 값을 추가하면 해당 인덱스부터 마지막 인덱스까지 모두 1씩 뒤로 밀려난다.
  - **데이터가 많으면 성능에 영향을 끼치기 때문에 중간에 데이터를 넣을 경우가 많으면 LinkedList를 사용한다.**

#### ArrayList 값 삭제

```java
ArrayList<Integer> list = new ArrayList<Integer>(Arrays.asList(1,2,3));
list.remove(1);  // index 1 제거
list.clear();  // 모든 값 제거
```

- remove(index)를 사용한다.
- 특정 인덱스의 객체를 제거하면 바로 뒤 인덱스부터 마지막 인덱스까지 모두 1씩 앞으로 당겨진다.
- 모든 값을 제거하려면 clear()을 사용한다.

#### ArrayList 크기 구하기

```java
ArrayList<Integer> list = new ArrayList<Integer>(Arrays.asList(1,2,3));
System.out.println(list.size()); // list 크기 : 3
```

- size()를 사용한다.

#### ArrayList 값 출력

```java
ArrayList<Integer> list = new ArrayList<Integer>(Arrays.asList(1,2,3));

System.out.println(list.get(0));    // 0번째 index 출력

for(Integer i : list) { // for문을 통한 전체출력
    System.out.println(i);
}

Iterator iter = list.iterator(); // Iterator 선언 
while(iter.hasNext()){  // 다음값이 있는지 체크
    System.out.println(iter.next()); // 값 출력
}
```

- get(index)를 사용해 원하는 index의 값을 리턴받을 수 있다.

#### ArrayList 값 검색

```java
ArrayList<Integer> list = new ArrayList<Integer>(Arrays.asList(1,2,3));
System.out.println(list.contains(1)); // list에 1이 있는지 검색 : true
System.out.println(list.indexOf(1)); // 1이 있는 index반환 없으면 -1
```

- contains(value) 메소드를 이용해 찾고자 하는 값을 검색할 수 있다.
  - true 또는 false를 리턴한다.
- indexOf(value) 메소드를 이용해 해당 값이 있는 인덱스를 검색할 수 있다.
  - 값이 없으면 -1을 리턴한다.