# coding=utf-8

import re
import requests
import sys

reload(sys)
sys.setdefaultencoding('utf-8')

html = requests.get('https://tieba.baidu.com/p/5130190182')
author = re.findall('&ie=utf-8&fr=pb" target="_blank">(.*?)</a>', html.text, re.S)
content = re.findall('class="d_post_content j_d_post_content ">           (.*?)<img class="', html.text, re.S)
level = re.findall('</span><span class="tail-info">(.*?)</span><span class="tail-info">2017', html.text, re.S)
# reply_time = re.findall('</span><span class="tail-info">(\d\d\d\d-\d\d-\d\d)</span></div><ul', html.text, re.S)
length = len(author)
f = open("E:\coding\PyCharm\workspace\web_tasks\P2\content.txt", "w+")
for each in range(0, length - 1):
    if author[each] != author[0]:
        continue
    f.writelines(u'回帖楼层：' + unicode(level[each]) + '\n\n')
    # f.writelines(u'回帖时间：' + str(reply_time[each]) + '\n')
    re.sub('<a (.*?)</a>', ' ', content[each])
    f.writelines(u'回帖内容：' + unicode(content[each].replace('<br>', '\n')) + '\n')
    f.writelines(u'回帖人：' + author[each] + '\n\n')
print "down"
