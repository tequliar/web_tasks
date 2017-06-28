# coding=utf-8


def fibonacci(num):
    arr = [0, 1]
    print 0
    print 1
    # 先将前两项打印

    if num < 2:
        return arr[num]
    else:
        numsmall = 0
        numbig = 1
        global numnext
        # 定义全局变量

        for i in range(num - 2):
            numnext = numsmall + numbig
            numsmall = numbig
            numbig = numnext
            print numnext
        # 如果num大于2，再使用for循环计算斐波那契数列的值，并将该值打印
        return numnext


fibonacci(100)
# 调用方法，进行测试
