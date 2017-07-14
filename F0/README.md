# 登录页面  

这是一篇关于登录页面的简要说明

-----
### 文件目的  
完成登录页面，实现相应功能
### 使用语言  
*HTML* , *css* , *JavaScript* , *PHP*
### 调用库  
[jQuery](http://code.jquery.com/jquery-1.11.1.min.js) , [jQuery.mobile](http://code.jquery.com/mobile/1.4.5/jquery.mobile-1.4.5.min.js)
### 文件功能  
用户登录、处理提交信息(显示用户名密码)、保存密码、登录及注册按钮、密码的显示与隐藏



------

### 设备适配  
本文件调用jQuery和jQueryMobile库，解决了网页在不同设备和浏览器间适配的问题   
同时由于jQuery库本身的强大，对各个标签都有极好的优化，使得页面整体看起来更加舒适

### 处理提交  
本文件采用**基于XAMPP的Apache Web Server**来简单处理登录信息   
将写好的[Service.php](https://github.com/hyacinthee/web_tasks/blob/master/F0/Service.php)拷贝到XAMPP的htdocs文件夹下,并将地址拷贝   
将地址保存在form表单的action属性中，运行后可简单显示登录用户及密码   

### 盒子模型  
本文件使用**基于W3C标准的标准盒子模型**，未使用IE盒子模型  
主要思想是将页面拆分成**头部(header)**、**主体(body)**、**底部**(footer)三大部分，对三大部分分别进行设计   
在主体部分又使用多个div包含不同部分，使用css样式分别进行处理，将表单居中   
针对登陆界面对头部与底部进行简化，不过有需要可以添加导航栏   

### 显示隐藏密码  
在密码框旁添加按钮，同时识别密码框状态   
当密码隐藏时，按钮显示为`SHOW`，用来显示密码，按下则显示密码   
当密码显示时，按钮显示为`HIDE`，用来隐藏密码，按下则隐藏密码   

-----
### 文件链接
[登录页面](https://github.com/hyacinthee/web_tasks/blob/master/F0/log_in.html)    


[处理提交表单的PHP文件](https://github.com/hyacinthee/web_tasks/blob/master/F0/log_in.html)


[css样式表](https://github.com/hyacinthee/web_tasks/blob/master/F0/style.css)

------
### 程序截图

打开页面
![打开页面](https://github.com/hyacinthee/web_tasks/blob/master/F0/ScreenShot/screenshot1.png)

输入用户名和密码
![输入用户名和密码](https://github.com/hyacinthee/web_tasks/blob/master/F0/ScreenShot/screenshot2.png)

显示密码
![显示密码](https://github.com/hyacinthee/web_tasks/blob/master/F0/ScreenShot/screenshot3.png)
