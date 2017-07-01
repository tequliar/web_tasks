# coding=utf-8

# 更多说明请访问 https://github.com/hyacinthee/web_tasks/blob/master/P2/PhotoSpider.md#图片爬虫photospider

import re
import requests

# 首先将抓取的网页源代码保存在source.txt文件里
# 读取源代码文件
f = open('source.txt', 'r')
html = f.read()
f.close()

# 匹配图片网址
pic_url = re.findall('" data-lazy="(.*?)" alt="', html, re.S)  # 调用re库的findall方法找到所有的网页地址，调用re.S识别换行符
i = 0
for each in pic_url:  # 循环输出图片
    print 'now downloading: ' + each
    pic = requests.get(each)  # 调用requests库的get方法获得图片
    fp = open('E:\\picture\\spider2\\' + str(i) + '.jpg', 'wb')
    fp.write(pic.content)  # 将图片保存到本地
    fp.close()
    i += 1
