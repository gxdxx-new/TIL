<img src="https://user-images.githubusercontent.com/35963403/163756957-c49fdb59-9852-46a8-8ae4-d7f50d560a0d.PNG" width="700">

```java
class Solution {
    public long[] solution(int x, int n) {
        long[] answer = new long[n];
        
        answer[0] = x;
        for (int i = 1; i < n; i++) {
            answer[i] = answer[i - 1] + x;
        }
        
        return answer;
    }
}
```