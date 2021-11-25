def solution(lottos, win_nums):
    rank = [6, 6, 5, 4, 3, 2, 1]
    zero = lottos.count(0)   
    correct = 0
    for num in lottos:
        if num in win_nums:
            correct += 1 
    
    answer = [rank[correct + zero], rank[correct]]
    
    return answer