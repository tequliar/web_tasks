## 图片爬虫(PhotoSpider)
这是一篇关于[图片爬虫](https://github.com/hyacinthee/web_tasks/blob/master/P2/PhotoSpider.py)的简要说明
*****************
### 爬虫目的
爬取图片网站某一主题的图片并保存在本地
### 爬虫目标网站
[免费图片 - Pixabay](https://pixabay.com/zh/photos/?q=book&hp=&image_type=&cat=&min_width=&min_height=)
### 使用语言
python
### 调用库
re(正则表达式)、requests(仅用于保存图片)
### 爬取结果
成功爬取了关于book这个主题的77张图片
*****************
### 网页分析
首先使用chrome的查看网页源代码功能找到本次爬虫的目标，通过使用定位功能定位到某张图片的具体代码   
如下所示

```
<div class="item" data-w="640" data-h="521">
	<a href="/zh/%E7%9B%92-%E7%BA%B8%E6%9D%BF-%E5%8C%85-%E5%8C%85%E8%A3%B9-%E6%A3%95%E8%89%B2-%E4%BC%A0%E9%80%92-%E8%BF%90%E8%BE%93-
	%E4%B9%A6-%E8%AE%B0%E5%BD%95-%E5%8F%91%E9%80%81-158523/">
		<img src="/static/img/blank.gif" data-lazy-srcset="https://cdn.pixabay.com/photo/2013/07/13/11/43/box-158523__340.png 1x, 
https://cdn.pixabay.com/photo/2013/07/13/11/43/box-158523__480.png 2x" data-lazy="https://cdn.pixabay.com/photo/2013/07/13/11/43/box-158523__340.png" alt="盒, 纸板,包, 包裹, 棕色, 传递, 运输, 书, 记录, 发送, Rss" title="盒, 纸板, 包, 包裹, 棕色, 传递, 运输, 书, 记录, 发送">
	</a>
	<div>
<div class="counts hide-xs hide-sm "><em data-href="/zh/photos/like/158523/" class="ajax">
	<i class="icon icon_like"></i> 31</em><em data-href="/zh/accounts/favorite/photo/158523/" class="ajax">
	<i class="icon icon_favorite"></i> 17</em><em data-location="/zh/%E7%9B%92-%E7%BA%B8%E6%9D%BF-%E5%8C%85-%E5%8C%85%E8%A3%B9-%E6%A3%95%E8%89%B2-%E4%BC%A0%E9%80%92-%E8%BF%90%E8%BE%93-%E4%B9%A6-%E8%AE%B0%E5%BD%95-%E5%8F%91%E9%80%81-158523/#comments">
	<i class="icon icon_comment"></i> 9</em></div><a href="/users/30363/">OpenClipart-Vectors</a>
	</div>
</div> 
```

可以明显看出
> data-lazy="https://cdn.pixabay.com/photo/2013/07/13/11/43/box-158523__340.png"  

这句明显指向图片的地址，打开验证后果然是这样

因此可以考虑使用正则表达式*'" data-lazy="(.\*?)"" alt="'*，用*(.\*?)*来匹配需要的网址

*******
### 编写程序
由于在文字爬虫中通过requests库实现了网页源代码的获取，本图片爬虫采取另外一种方式：人工抓取网页源代码

这样的好处是定位准确，不易出现乱码或者匹配失误的情况

首先将抓取的网页源代码保存在source.txt文件里

然后获取源代码文件
```
f = open('source.txt', 'r')
html = f.read()
f.close()
```

调用re库的findall方法找到所有的网页地址，调用re.S识别换行符
```
pic_url = re.findall('" data-lazy="(.*?)"" alt="', html, re.S)
```

调用requests库的get方法获得图片
```
pic = requests.get(each)
```

将图片保存到本地，程序结束
```
fp = open('E:\\picture\\spider\\' + str(i) + '.jpg', 'wb')
fp.write(pic.content)
fp.close()
```

****
### 截图

![爬取过程中](https://github.com/hyacinthee/web_tasks/blob/master/P2/PhotoSpider.png)

![爬取结果](https://github.com/hyacinthee/web_tasks/blob/master/P2/result.png)

*****
### 相关爬虫
[文字爬虫(TextSpider)](https://github.com/hyacinthee/web_tasks/blob/master/P2/TextSpider.py)

[文字爬虫的说明](https://github.com/hyacinthee/web_tasks/blob/master/P2/TextSpider.md)
