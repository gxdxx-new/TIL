def solution(n, lost, reserve):
    lost.sort()
    reserve.sort()
    answer = n - len(lost)
    
    for i in range(len(lost)):
        if lost[i] in reserve:
            reserve.remove(lost[i])
            lost[i] = -1
            answer += 1
    
    for i in range(len(lost)):
        if lost[i] - 1 in reserve:
            reserve.remove(lost[i]-1)
            answer += 1
        elif lost[i] + 1 in reserve:
            reserve.remove(lost[i]+1)
            answer += 1
    
    return answer

n = 5
lost = [2, 4]
reserve = [1, 3, 5]
solution(n, lost, reserve)