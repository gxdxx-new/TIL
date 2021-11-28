def solution(array, commands):
    answer = []
    for command in commands:
        i = command[0]-1
        j = command[1]-1
        k = command[2]-1
        result = sorted(array[i:j+1])

        answer.append(result[k])
        
    return answer

array = [1, 5, 2, 6, 3, 7, 4]
commands = [[2, 5, 3], [4, 4, 1], [1, 7, 3]]
solution(array, commands)