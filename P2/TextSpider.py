# coding=utf-8

import re
import requests
import sys

reload(sys)
sys.setdefaultencoding('utf-8')
# 由于读取百度贴吧源代码是会出现编码错误，因此使用sys将编码强制指定为utf-8

html = requests.get('https://tieba.baidu.com/p/5130190182')  
# 获取网页源代码
author = re.findall('&ie=utf-8&fr=pb" target="_blank">(.*?)</a>', html.text, re.S)
content = re.findall('class="d_post_content j_d_post_content ">           (.*?)<img class="', html.text, re.S)
level = re.findall('</span><span class="tail-info">(.*?)</span><span class="tail-info">2017', html.text, re.S)

length = len(author)  # 以表单author元素的个数决定循环的次数

f = open("E:\coding\PyCharm\workspace\web_tasks\P2\content.txt", "w+")  # 打开文件content.txt

for each in range(0, length - 1):  # 使用循环将所有信息输出
    if author[each] != author[0]:  # 如果不是楼主发言，则将本次循环跳过
        continue
    f.writelines(u'回帖楼层：' + unicode(level[each]) + '\n\n')  # 输出回贴楼层，调用unicode()来识别unicode编码
    re.sub('<a (.*?)</a>', ' ', content[each])  # 将<a>标签中的链接去掉
    f.writelines(u'回帖内容：' + unicode(content[each].replace('<br>', '\n')) + '\n')  # 输出回帖内容，同时将所有的<br>标签替换为换行，调用unicode()来识别unicode编码
    f.writelines(u'回帖人：' + author[each] + '\n\n')  # 输出回帖人名称
    
print "down"  # 输出down表示文件输出完成
