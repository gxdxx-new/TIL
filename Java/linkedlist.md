## LinkedList

- #### 각 노드가 데이터와 포인터를 가지고 한 줄로 연결되어 있는 방식의 자료구조이다.
- #### 노드의 포인터는 이전 노드와 다음 노드를 연결하는 역할을 한다.
- #### 데이터를 추가하거나 삭제할 때 전체의 인덱스가 한 칸씩 뒤로 밀리거나 당겨지지 않기 때문에 ArrayList에 비해 데이터의 추가/삭제가 용이하다.
- #### 하지만 인덱스가 없기 때문에 특정 요소에 접근하기 위해서는 순차 탐색을 해야 해서 탐색 속도가 떨어진다.
- #### 탐색 또는 정렬을 자주 할 경우에는 배열을 사용하고, 데이터의 추가/삭제가 많을 경우에는 LinkedList를 사용하는게 좋다.

<img src="https://user-images.githubusercontent.com/35963403/160769833-3bc14be2-7d49-41bd-87d7-d743ffd3897c.PNG" width="700">

---

### LinkedList 사용법

#### LinkedList 선언

```java
LinkedList list = new LinkedList(); // 타입 미설정 Object로 선언된다.
LinkedList<Student> members = new LinkedList<Student>();    // 타입설정 Student객체만 사용가능
LinkedList<Integer> num = new LinkedList<Integer>();    // 타입설정 int타입만 사용가능
LinkedList<Integer> num2 = new LinkedList<>();  // new에서 타입 파라미터 생략가능
LinkedList<Integer> list2 = new LinkedList<Integer>(Arrays.asList(1,2));    // 생성시 값추가
```

- LinkedList는 초기에 크기를 지정할 수 없다.
- LinkedList를 생성할 때 사용 타입을 명시해주는게 좋다.
- 타입을 설정하지 않고 선언하면 값을 꺼낼 때 캐스팅(casting) 연산이 필요하고 잘못된 타입으로 캐스팅하면 에러가 발생할 수 있다.
- JDK5.0 이후부터 자료형의 안정성을 위해 도입된 제네릭스(Generics) 개념을 이용해 다른 타입의 객체가 add되지 않도록 할 수 있다.
- 제네릭스는 객체 타입만 선언할 수 있기 때문에 기본 타입은 wrapper 클래스를 사용해야 한다.

---

#### LinkedList 값 추가

```java
LinkedList<Integer> list = new LinkedList<Integer>();
list.addFirst(1);   // 가장 앞에 데이터 추가
list.addLast(2);    // 가장 뒤에 데이터 추가
list.add(3);    // 데이터 추가
list.add(1, 10);    // index 1에 데이터 10 추가
```

```java
LinkedList<Student> list = new LinkedList<Student>();
Student student = new Student(name,age);
members.add(student);
members.add(new Member("홍길동",15));
```

- add(index, value) 메소드를 사용한다.
- 인덱스를 생략하면 가장 뒤에 데이터가 추가된다.
- addFirst(value) 메소드를 사용하면 가장 앞에 있는 Header의 값이 변경된다.

<img src="https://user-images.githubusercontent.com/35963403/160770726-2cd762dc-73a0-4e0c-9f8e-294dce0fd02c.PNG" width="500">

---

#### LinkedList 값 삭제

```java
LinkedList<Integer> list = new LinkedList<Integer>(Arrays.asList(1,2,3,4,5));
list.removeFirst(); // 가장 앞의 데이터 제거
list.removeLast(); // 가장 뒤의 데이터 제거
list.remove(); // 생략시 0번째 index제거
list.remove(1); // index 1 제거
list.clear(); // 모든 값 제거
```

- removeFirst() 메소드를 사용하면 가장 앞에 있는 데이터가 삭제된다.
- removeLast()를 사용하면 가장 뒤에 있는 데이터가 삭제된다.
- remove(index, value) 메소드를 사용해 특정 index의 값을 제거할 수도 있다.
- clear() 메소드를 사용하면 값을 전부 삭제한다.

<img src="https://user-images.githubusercontent.com/35963403/160770881-85d5777f-33c7-4b6f-b723-3d764f4a47a4.PNG" width="500">

- 삭제 대상 노드의 이전 노드가 대상 노드의 다음 노드를 가르키게 하고 대상 노드는 삭제된다.

---

#### LinkedList 크기 구하기

```java
LinkedList<Integer> list = new LinkedList<Integer>(Arrays.asList(1,2,3));
System.out.println(list.size()); // list 크기 : 3
```

- size() 메소드를 사용한다.

---

#### LinkedList 값 출력

```java
LinkedList<Integer> list = new LinkedList<Integer>(Arrays.asList(1,2,3));

System.out.println(list.get(0));    // 0번째 index 출력
				
for(Integer i : list) { // for문을 통한 전체출력
    System.out.println(i);
}

Iterator<Integer> iter = list.iterator(); // Iterator 선언 
while(iter.hasNext()){  // 다음값이 있는지 체크
    System.out.println(iter.next()); // 값 출력
}
```

- get(index) 메소드를 사용하면 원하는 index의 값을 리턴받는다.
- get(index) 메소드는 내부의 동작이 순차 탐색으로 이루어져 있어 ArrayList의 get(index) 보다 속도가 느리다.

---

#### LinkedList 값 검색

```java
ArrayList<Integer> list = new ArrayList<Integer>(Arrays.asList(1,2,3));
System.out.println(list.contains(1)); // list에 1이 있는지 검색 : true
System.out.println(list.indexOf(1)); // 1이 있는 index반환 없으면 -1
```

- contains(value) 메소드를 사용하면 찾고자 하는 값을 검색한다.
  - 값이 있으면 true가 리턴되고 값이 없다면 false가 리턴된다.
- indexOf(value) 메소드를 사용하면 값이 있는 index를 찾는다.
  - 값이 없으면 -1을 리턴한다.