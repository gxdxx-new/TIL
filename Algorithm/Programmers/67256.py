def solution(numbers, hand):
    result = ""
    keyPad = [[1, 2, 3],
              [4, 5, 6],
              [7, 8, 9],
              ['*', 0, '#']]
    currentLeft = [3, 0]
    currentRight = [3, 2]
    for n in range(len(numbers)):
        if(numbers[n] in [1, 4, 7]):
            result += "L"
            for i in range(len(keyPad)):
                for j in range(len(keyPad[i])):
                    if(numbers[n] == keyPad[i][j]):
                        currentLeft = [i, j]
        elif(numbers[n] in [3, 6, 9]):
            result += "R"
            for i in range(len(keyPad)):
                for j in range(len(keyPad[i])):
                    if(numbers[n] == keyPad[i][j]):
                        currentRight = [i, j]
        else:
            current = []
            for i in range(len(keyPad)):
                for j in range(len(keyPad[i])):
                    if(numbers[n] == keyPad[i][j]):
                        current = [i, j]
            left = abs((currentLeft[0] - current[0])) + abs((currentLeft[1] - current[1]))
            right = abs((currentRight[0] - current[0])) + abs((currentRight[1] - current[1]))
            if(left < right):
                result += "L"
                for i in range(len(keyPad)):
                    for j in range(len(keyPad[i])):
                        if(numbers[n] == keyPad[i][j]):
                            currentLeft = [i, j]
            elif(left > right):
                result += "R"
                for i in range(len(keyPad)):
                    for j in range(len(keyPad[i])):
                        if(numbers[n] == keyPad[i][j]):
                            currentRight = [i, j]
            else:
                if(hand == "left"):
                    result += "L"
                    for i in range(len(keyPad)):
                        for j in range(len(keyPad[i])):
                            if(numbers[n] == keyPad[i][j]):
                                currentLeft = [i, j]
                elif(hand == "right"):
                    result += "R"
                    for i in range(len(keyPad)):
                        for j in range(len(keyPad[i])):
                            if(numbers[n] == keyPad[i][j]):
                                currentRight = [i, j]
                
    
    answer = result
    return answer