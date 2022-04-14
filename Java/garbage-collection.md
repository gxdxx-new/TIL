## Garbage Collection (가비지 컬렉션)

- #### JVM의 가비지 컬렉터(Garbage Collector, GC)가 불필요한 메모리(가비지)를 주기적으로 삭제해준다.

```java
Person person = new Person(); 
person.setName("don"); 
person = null; 

// 가비지 발생
person = new Person(); 
person.setName("dondon");
```

- 명시적으로 불필요한 데이터를 표현하기 위해 null으로 선언해준다.
- 기존의 don으로 생성된 person 객체는 더이상 참조를 하지 않고 사용이 되지 않아서 Garbage가 되었다.
- 자바에서는 이러한 메모리 누수 방지를 위해 가비지 컬렉터가 주기적으로 검사해 메모리를 청소해준다.

---

## Minor GC와 Major GC

- JVM의 Heap 영역은 다음의 2가지를 전제로 설계되었다.
  - 대부분의 객체는 금방 접근 불가능한 상태가 된다.
  - 오래된 객체에서 새로운 객체로의 참조는 아주 적게 존재한다.

- 즉, **객체는 대부분 일회성이고, 메모리에 오랫동안 남아있는 경우는 드물다**.
- 그래서 객체의 생존 기간에 따라 물리적인 Heap 영역을 **Young, Old 영역**으로 나누게 되었다.
- Perm 영역은 Java8부터 제거되었다.

<img src="https://user-images.githubusercontent.com/35963403/163115822-cfd84427-ceea-4ebf-8a85-7e6128a3b9b7.PNG" width="400">

- ### Young 영역(Young Generation)
  - 새롭게 생성된 객체가 **할당**(Allocation)되는 영역이다.
  - 대부분의 객체가 금방 접근 불가능한 상태가 되기 때문에, 많은 객체가 Young 영역에 생성되었다가 사라진다.
  - Young 영역에 대한 가비지 컬렉션(Garbage Collection)을 **Minor GC**라 부른다.

- ### Old 영역(Old Generation)
  - Young영역에서 접근 가능한 상태를 유지하여 살아남은 객체가 **복사**되는 영역이다.
  - Young 영역보다 크게 할당되며, 영역의 크기가 큰 만큼 가비지는 적게 발생한다.
  - Old 영역에 대한 가비지 컬렉션(Garbage Collection)을 **Major GC** 또는 Full GC라 부른다.

### Old 영역이 Young 영역보다 크게 할당되는 이유?

- Young 영역의 수명이 짧은 객체들은 큰 공간을 필요로 하지 않는다.
- 큰 객체들은 Young 영역이 아니라 바로 Old 영역에 할당되기 때문이다.

### 카드 테이블 (Card Table)

<img src="https://user-images.githubusercontent.com/35963403/163116763-b42822cf-7859-4d2d-8020-bfd6429ec4f0.PNG" width="400">

- 예외적인 상황으로 **Old 영역에 있는 객체가 Young 영역의 객체를 참조하는 경우를 대비**해
- Old 영역에 512 bytes의 덩어리로 되어 있는 카드 테이블이 존재한다.
- 카드 테이블에는 Old 영역에 있는 객체가 Young 영역의 객체를 참조할 때 마다 그에 대한 정보가 표시된다.
- Young 영역에서 가비지 컬렉션(Minor GC)가 실행될 때 모든 Old 영역에 존재하는 객체를 검사하여 참조되지 않는 Young 영역의 객체를 식별하는 것이 비효율적이기 때문에 도입되었다.
- 그렇기 때문에 **Young 영역에서 가비지 컬렉션이 진행될 때 카드 테이블만 조회하여 GC의 대상인지 식별**한다.

---

## Garbage Collection (가비지 컬렉션) 동작 방식

- 가비지 컬렉션이 실행될 때 다음의 2가지 공통적인 단계를 따른다.

    ### 1. Stop The World

  - 가비지 컬렉션을 실행하기 위해 **JVM이 애플리케이션의 실행을 멈추는 작업**이다.
  - GC가 실행될 때는 GC를 실행하는 쓰레드를 제외한 모든 쓰레드들의 작업이 중단되고, GC가 완료되면 작업이 재개된다.
  - GC의 성능 개선을 위해 튜닝을 할 때 보통 stop-the-world의 시간을 줄이는 작업을 한다.

  ### 2. Mark and Sweep

  - #### Mark: 사용되는 메모리와 사용되지 않는 메모리를 식별하는 작업이다.
    - Stop The World를 통해 모든 작업을 중단시키면, 
    - GC는 스택의 모든 변수 또는 접근 가능한 객체를 스캔하면서 각각이 어떤 객체를 참고하고 있는지 탐색한다.
  - #### Sweep: Mark 단계에서 사용되지 않는 메모리로 식별된 메모리를 해제(제거)하는 작업이다.

  - #### Compact: Sweep 후에 분산된 객체들을 Heap의 시작 주소로 모아 메모리가 할당된 부분과 그렇지 않은 부분으로 압축하는 작업

  <img src="https://user-images.githubusercontent.com/35963403/163120957-415b7aa7-8ec5-4308-92ac-493bd1368797.PNG" width="600">

  - Compact 작업은 가비지 컬렉터 종류에 따라 하지 않는 경우도 있다.

---

### Minor GC 동작 방식

- Young 영역은 1개의 Eden 영역과 2개의 Survivor 영역, 총 3가지로 나뉘어진다.

> **Eden 영역**: 새로 생성된 객체가 할당되는 영역이다.

> **Survivor 영역**: 최소 1번의 GC 이상 살아남은 객체가 존재하는 영역이다.

- 객체가 새롭게 생성되면 Young 영역 중에서도 Eden 영역에 할당(Allocation)이 된다.
- **Eden 영역이 꽉 차면 Minor GC가 발생**하게 되는데, 사용되지 않는 메모리는 해제되고,
- 사용중이라 Eden 영역에 남게된 객체는 Survivor 영역으로 옮겨지게 된다.
- Survivor 영역은 총 2개이지만 반드시 1개의 영역에만 데이터가 존재해야 한다.

#### Young 영역에서의 동작 순서

1. 새로 생성된 객체가 Eden 영역에 할당된다.
2. 객체가 계속 생성되어 Eden 영역이 꽉차게 되고 Minor GC가 실행된다. 
   - Eden 영역에서 사용되지 않는 객체의 메모리가 해제된다.
   - Eden 영역에서 살아남은 객체는 1개의 Survivor 영역으로 이동된다.
3. 1~2번의 과정이 반복되다가 **Survivor 영역이 가득 차게 되면 Survivor 영역의 살아남은 객체를 다른 Survivor 영역으로 이동**시킨다.(1개의 Survivor 영역은 반드시 빈 상태가 된다.)
4. 이러한 과정을 반복하여 계속해서 **살아남은 객체는 Old 영역으로 이동**(Promotion)된다.

#### Object Header

- 객체의 생존 횟수를 카운트하기 위해 Minor GC에서 객체가 살아남은 횟수를 의미하는 age를 Object Header에 기록한다.
- 그리고 Minor GC가 실행될 때 Object Header에 기록된 age를 보고 Promotion 여부를 결정한다.
- 또한 Survivor 영역 중 1개는 반드시 사용이 되어야 한다. 
- 만약 두 Survivor 영역에 모두 데이터가 존재하거나, 모두 사용량이 0이라면 현재 시스템이 정상적인 상황이 아님을 파악할 수 있다.

<img src="https://user-images.githubusercontent.com/35963403/163119631-3e502fc3-9a6b-4acf-aee2-bd3f572764e1.PNG" width="800">

### bump the pointer 와 TLABs(Thread-Local Allocation Buffers)

- HotSpot JVM에서는 Eden 영역에 객체를 빠르게 할당하기 위해 bump the pointer와 TLABs라는 기술을 사용한다.

#### bump the pointer

- **Eden 영역에 마지막으로 할당된 객체의 주소를 캐싱해두는 것**이다.
- 새로운 객체를 위해 유효한 메모리를 탐색할 필요 없이, 마지막 주소의 다음 주소를 사용하게 함으로써 속도를 높이고 있다.
- 이를 통해 새로운 객체를 할당할 때 객체의 크기가 Eden 영역에 적합한지만 판별하면 되므로 빠르게 메모리 할당을 할 수 있다.
- 싱글 쓰레드 환경이라면 문제가 없겠지만 멀티쓰레드 환경이라면 객체를 Eden 영역에 할당할 때 락(Lock)을 걸어 동기화를 해주어야 한다. 

#### TLABs

- 멀티 쓰레드 환경에서의 성능 문제를 해결하기 위해 HotSpot JVM은 추가로 TLABs라는 기술을 도입했다. 
- **각각의 쓰레드마다 Eden 영역에 객체를 할당하기 위한 주소를 부여함으로써 동기화 작업 없이 빠르게 메모리를 할당하도록 하는 기술**이다. 
- 각각의 쓰레드는 자신이 갖는 주소에만 객체를 할당함으로써 동기화 없이 bump the poitner를 통해 빠르게 객체를 할당하도록 하고 있다.

---

### Major GC 동작 방식

- Young 영역에서 오래 살아남은 객체는 Old 영역으로 Promotion된다.
- Major GC는 **객체들이 계속 Promotion 되어 Old 영역의 메모리가 부족해지면** 발생한다.
- Young 영역은 Old 영역보다 크키가 작아서 GC가 0.5초에서 1초 사이에 끝나기 때문에 Minor GC는 애플리케이션에 크게 영향을 주지 않는다.
- 하지만 Old 영역은 Young 영역보다 크며 Young 영역을 참조할 수도 있다. 
- 그렇기 때문에 Major GC는 일반적으로 Minor GC보다 시간이 오래걸리며, 10배 이상의 시간을 사용한다.

---

### Garbage Collection 내용 요약

|GC 종류|Minor GC|Major GC|
|---|---|---|
|대상|Young Generation|Old Generation|
|실행 시점|Eden 영역이 꽉 찬 경우|Old 영역이 꽉 찬 경우|
|실행 속도|빠르다|느리다|