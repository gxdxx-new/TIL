## Priority Queue (우선순위 큐)

- #### 데이터들의 우선순위를 먼저 결정하고 그 우선순위가 높은 데이터가 먼저 나가는 자료구조이다.
- #### 힙(Heap)을 이용해 구현한다.

- #### Priority Queue 특징

  1. 높은 우선순위의 요소를 먼저 꺼내서 처리하는 구조이다.
  2. 내부 요소는 힙으로 구성되어 이진트리 구조로 이루어져 있다.
  3. 내부구조가 힙으로 구성되어 있기 때문에 시간 복잡도는 O(NLogN)이다.

---

### Priority Queue 사용법

#### Priority Queue 선언

```java
import java.util.PriorityQueue; // import

// int형 priorityQueue 선언 (우선순위가 낮은 숫자 순)
PriorityQueue<Integer> priorityQueue = new PriorityQueue<>();

// int형 priorityQueue 선언 (우선순위가 높은 숫자 순)
PriorityQueue<Integer> priorityQueue = new PriorityQueue<>(Collections.reverseOrder());

// String형 priorityQueue 선언 (우선순위가 낮은 숫자 순)
PriorityQueue<String> priorityQueue = new PriorityQueue<>(); 

// String형 priorityQueue 선언 (우선순위가 높은 숫자 순)
PriorityQueue<String> priorityQueue = new PriorityQueue<>(Collections.reverseOrder());
```

- 기본은 작은 숫자가 우선순위를 갖는다.
- Collectinos.reverseOrder() 메서드를 사용하면 큰 숫자가 우선순위를 갖게 된다.

---

#### Priority Queue 값 추가

```java
priorityQueue.add(1);   // priorityQueue 값 1 추가
priorityQueue.add(2);   // priorityQueue 값 2 추가
priorityQueue.offer(3); // priorityQueue 값 3 추가
```

- add(value)
  - 삽입에 성공하면 true를 반환한다.
  - 큐에 여유 공간이 없어 삽입에 실패하면 IllegalStateException을 발생시킨다.
  
<img src="https://user-images.githubusercontent.com/35963403/161709667-b3a18445-af33-4734-af98-e952f24b94a1.jpg" width="300">

---

#### Priority Queue 값 삭제

```java
priorityQueue.poll();   // priorityQueue에 첫번째 값을 반환하고 제거 비어있다면 null
priorityQueue.remove(); // priorityQueue에 첫번째 값 제거
priorityQueue.clear();  // priorityQueue 초기화
```

- 우선순위가 가장 높은 값이 삭제된다.
- poll() 메소드는 큐가 비어있으면 null을 반환한다.

<img src="https://user-images.githubusercontent.com/35963403/161709670-3f2b2d6c-dc46-4c81-b223-e872df1e50d5.jpg" width="300">

---

#### Priority Queue에서 우선순위가 가장 높은 값 출력

```java
PriorityQueue<Integer> priorityQueue = new PriorityQueue<>();   // int형 priorityQueue 선언
priorityQueue.offer(2);     // priorityQueue에 값 2 추가
priorityQueue.offer(1);     // priorityQueue에 값 1 추가
priorityQueue.offer(3);     // priorityQueue에 값 3 추가
priorityQueue.peek();       // priorityQueue에 첫번째 값 참조 = 1
```

- peek() 메서드를 사용하면 우선순위가 가장 높은 값을 출력한다.