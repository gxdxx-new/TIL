<img src="https://user-images.githubusercontent.com/35963403/163756958-bef3508b-493f-4e13-a658-63550d0b95e9.PNG" width="800">

- 처음부터 배열을 정렬하고 거기에서 i번째 ~ j번째 숫자를 선택하면 틀리게 된다.
- 정렬된 배열의 i번째 ~ j번째와 정렬되지 않은 배열의 i번째 ~ j번쨰 숫자들은 다르기 때문이다.
- 따라서 2차원 배열 commands에서 각각 숫자들을 추출해 정렬시켜야 된다.

```java
import java.util.*;

class Solution {
    public ArrayList<Integer> solution(int[] array, int[][] commands) {
        ArrayList<Integer> answer = new ArrayList<>();
        
        for (int[] command : commands) {
            
            int startIndex = command[0] - 1;
            int endIndex = command[1] - 1;
            int findIndex = command[2] - 1;
            int[] findArray = new int[endIndex - startIndex + 1];
            
            for (int i = 0; i < findArray.length; i++) {
                findArray[i] = array[startIndex + i];
            }
            
            Arrays.sort(findArray);
            
            answer.add(findArray[findIndex]);
            
        }
        
        return answer;
    }
}
```