## **순차 탐색**

---

- 리스트 안에 있는 특정한 데이터를 찾기 위해 앞에서부터 데이터를 하나씩 차례대로 확인한다.
- 보통 정렬되지 않은 리스트에서 사용한다.
- 데이터가 아무리 많아도 항상 원하는 데이터를 찾을 수 있다.
- 데이터의 개수가 N개일 때 최대 N번의 비교 연산이 필요하다.
  - 최악의 경우 시간 복잡도는 O(N)이다.

```python
# 순차 탐색 소스코드 구현
def sequential_search(n, target, array):
    # 각 원소를 하나씩 확인하며
    for i in range(n):
        # 현재의 원소가 찾고자 하는 원소와 동일한 경우
        if array[i] == target:
            return i + 1    # 현재의 위치 반환(인덱스는 0부터 시작하므로 1 더하기)

print("생성할 데이터 개수와 찾을 문자열을 입력하세요.")
input_data = input().split()
n = int(input_data[0])  # 원소의 개수
target = input_data[1]  # 찾고자 하는 문자열

print("앞서 적은 원소 개수만큼 문자열을 입력하세요.")
array = input().split()

# 순차 탐색 수행 결과 출력

print(sequential_search(n, target, array))
```

## **이진 탐색**

---

- **배열 내부의 데이터가 정렬되어 있어야 사용할 수 있다.**
- 탐색 범위를 절반씩 좁혀가며 데이터를 탐색한다.
- 위치를 나타내는 변수 3개를 사용한다.
  - 시작점, 끝점, 중간점
- 찾으려는 데이터와 중간점 위치에 있는 데이터를 반복적으로 비교해서 원하는 데이터를 찾는다.
- 한 번 확인할 때마다 확인하는 원소의 개수가 절반씩 줄어든다.
  - 시간복잡도가 O(logN)이다.

```python
# 이진 탐색 소스코드 구현(재귀 함수)
def binary_search(array, target, start, end):
    if start > end:
        return None
    mid = (start + end) // 2
    # 찾은 경우 중간점 인덱스 반환
    if array[mid] == target:
        return mid
    # 중간점의 값보다 찾고자 하는 값이 작은 경우 왼쪽 확인
    elif array[mid] > target:
        return binary_search(array, target, start, mid - 1)
    # 중간점의 값보다 찾고자 하는 값이 큰 경우 오른쪽 확인
    else:
        return binary_search(array, target, mid + 1, end)

# n(원소의 개수)과 target(찾고자 하는 문자열) 입력받기
n, target = list(map(int, input().split()))
# 전체 원소 입력받기
array = list(map(int, input().split()))

# 이진 탐색 수행 결과 출력
result = binary_search(array, target, 0, n - 1)
if result == None:
    print("원소가 존재하지 않습니다.")
else:
    print(result + 1)
```

```python
# 이진 탐색 소스코드 구현(반복문)
def binary_search(array, target, start, end):
    while start <= end:
        mid = (start + end) // 2
        # 찾은 경우 중간점 인덱스 반환
        if array[mid] == target:
            return mid
        # 중간점의 값보다 찾고자 하는 값이 작은 경우 왼쪽 확인
        elif array[mid] > target:
            end = mid - 1
        # 중간점의 값보다 찾고자 하는 값이 큰 경우 오른쪽 확인
        else:
            start = mid + 1
    return None

# n(원소의 개수)과 target(찾고자 하는 문자열) 입력받기
n, target = list(map(int, input().split()))
# 전체 원소 입력받기
array = list(map(int, input().split()))

# 이진 탐색 수행 결과 출력
result = binary_search(array, target, 0, n - 1)
if result == None:
    print("원소가 존재하지 않습니다.")
else:
    print(result + 1)
```

## **이진 탐색 트리**

---

### **트리 자료구조의 특징**

- 트리는 부모 노드와 자식 노드의 관계로 표현된다.
- 트리의 최상단 노드를 루트 노드라고 한다.
- 트리의 최하단 노드를 단말 노드라고 한다.
- 트리에서 일부를 떼어내도 트리 구조이며 이를 서브 트리라 한다.
- 트리는 파일 시스템과 같이 계층적이고 정렬된 데이터를 다루기에 적합하다.

### **이진 탐색 트리의 특징**

- 부모 노드보다 왼쪽 자식 노드가 작다.
- 부모 노드보다 오른쪽 자식 노드가 크다.
- **왼쪽 자식 노드 < 부모 노드 < 오른쪽 자식 노드**

### **데이터를 조회하는 과정**

1. 루트 노드부터 방문한다.
   - 루트 노드보다 찾는 값이 작으면 왼쪽 자식 노드를 방문한다.
   - 루트 노드보다 찾는 값이 크면 오른쪽 자식 노드를 방문한다.
2. 루트 노드의 자식 노드가 부모 노드가 되고 자식 노드와 값을 비교한다.
   - 부모 노드보다 찾는 값이 작으면 왼쪽 자식 노드를 방문한다.
   - 부모 노드보다 찾는 값이 크면 오른쪽 자식 노드를 방문한다.
3. 부모 노드(현재 방문한 노드)값과 찾는 값이 같으면 탐색을 마친다.

### **빠르게 입력받기**

- 입력 데이터가 많은 경우
  - input() 함수: 동작 속도가 느려 시간 초과가 발생할 수 있다.
  - sys 라이브러리의 readline() 함수를 이용해야 한다.

```python
import sys
# 하나의 문자열 데이터 입력받기
input_data = sys.stdin.readline().rstrip()

# 입력받은 문자열 그대로 출력
print(input_data)
```

- readline()으로 입력하면 입력 후 Enter가 줄 바꿈 기호로 입력된다.
  - 이 공백 문자를 제거하려면 rstrip() 함수를 사용한다.

### **파라메트릭 서치(Parametric Search)**

- 최적화 문제를 결정 문제로 바꾸어 해결하는 기법이다.
  - 결정 문제: '예' 혹은 '아니오'로 답하는 문제
- 원하는 조건을 만족하는 가장 알맞은 값을 찾는 문제에 주로 사용한다.
