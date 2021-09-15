## **input()**
---
### 사용자 입력
input은 입력되는 모든 것을 **문자열**로 취급한다.
```python
>>> a = input()
Life is too short, you need python
>>> a
'Life is too short, you need python'
```

### 프롬프트를 띄워서 사용자 입력 받기
사용자에게 입력받을 때 input()의 괄호 안에 문자열을 입력하여 프롬프트를 띄울 수 있다.
```python
>>> number = input("숫자를 입력하세요:")
숫자를 입력하세요:
```

### + 연산
따음표로 둘러싸인 문자열을 연속해서 쓰면 + 연산을 한 것과 같다.
```python
>>> print("life" "is" "too short")
lifeistoo short
>>> print("life" + "is" + "too short")
lifeistoo short
```

### 콤마
콤마(,)를 사용하면 문자열 사이에 띄어쓰기를 할 수 있다.
```python
>>> print("life", "is", "too short")
life is too short
```
또한 문자열 자료형과 정수 자료형을 같이 출력할 수 있게 해준다.

### 한 줄에 결괏값 출력하기
매개변수 end를 사용해 끝 문자를 지정하면 한 줄에 결괏값을 이어서 출력할 수 있다.
```python
>>> for i in range(10):
...     print(i, end=' ')
...
0 1 2 3 4 5 6 7 8 9
```

### list(map(int, input().split()))
- input()으로 입력받은 문자열을 split()을 이용해 공백으로 나눈 리스트로 바꾼 뒤에, map을 이용하여 해당 리스트의 모든 원소에 int() 함수를 적용한다. 최종적으로 그 결과를 list()로 다시 바꿈으로써 입력받은 문자열을 띄어쓰기로 구분하여 각각 숫자 자료형으로 저장하게 된다.

## **sys.stdin.readline()**
---
**모듈**이란 함수나 변수 또는 클래스를 모아 놓은 파일이다.

sys 모듈은 파이썬 인터프리터가 제공하는 변수와 함수를 직접 제어할 수 있게 해주는 모듈이다.

input() 함수는 동작 속도가 느리기 때문에 입력의 개수가 많은 경우에는 sys.stdin.readline() 함수를 이용하는게 좋다.

input() 함수와 마찬가지로 입력되는 모든 것을 **문자열로 취급한다.**

input()과 sys.stdin.readline()의 차이
- sys.stdin.readline()은 한번에 읽어와 버퍼에 저장한다.
- input()은 하나씩 누를 때마다 데이터를 버퍼에 저장한다.

이 함수를 이용해서 입력하면 엔터(Enter)가 줄 바꿈 기호로 입력되기 때문에 이 공백 문자를 제거하려면 **rstrip()** 함수를 사용해야 한다.
- int()로 감쌀 경우 줄 바꿈 기호가 자동으로 사라져서 rstrip() 함수를 사용하지 않아도 된다.

### split() 함수와 strip() 함수 비교
- split() 함수 : 문자열 내부에 있는 공백 또는 특별한 문자를 구분해서, <mark>**리스트로 만든다.**</mark>
- strip() 함수 : 문자열 앞뒤의 공백 또는 특별한 문자를 삭제한다.

### readline() 사용 예시
```python
import sys

# 문자열 입력받기
data = sys.stdin.readline().rstrip()

# 입력받은 문자열 정수로 바꾸기
# data = int(input()) 와 같다.
data = int(sys.stdin.readline())

# 한 줄에 여러 개 입력받아서 리스트로 만들기
# data = input().split() 와 같다.
# 문자열 리스트가 된다.
data = sys.stdin.readline().split()

# data = list(map(int, input().split())) 와 같다.
# 정수형 리스트가 된다.
data = list(map(int, sys.stdin.readline().split()))
```