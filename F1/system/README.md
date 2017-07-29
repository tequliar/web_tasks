# 可视化学生信息管理系统  
这是一篇关于可视化学生信息管理系统的说明  

------

## 简要介绍
web版学生信息管理系统，包括学生信息的添加、搜索、修改、遍历和删除等功能。 

其中所有的样式对所有浏览器均适配，整个系统实现了响应式布局。

-----

## 说明
由于基于控制台的信息管理系统过于丑陋，所以把可视化界面做了出来。  
本系统的可视化部分基于Bootstrap和jQuery，实现了响应式布局，具有良好的设备与浏览器适配性  
数据存储完全基于localstorage，主要通过新建学生对象，追加入学生数组（数组未指定长度），最后通过JSON.stringify()方法存入localstorage实现。  

-----

## 文件简介  
### [index.html](https://github.com/hyacinthee/web_tasks/blob/master/F1/system/index.html)    
主体文件，主要包括所有的标签、表单和控件。  
其中引用的Bootstrap库，jQuery库均采用外链形式，防止引用失败的情况。  

### [indexStyle.css](https://github.com/hyacinthee/web_tasks/blob/master/F1/system/indexStyle.css)   
样式表，简要调整位置、样式和透明度。  
本系统的样式主要通过Bootstrap实现，仅使用css样式表做微调。  

### [system.js](https://github.com/hyacinthee/web_tasks/blob/master/F1/system/system.js)   
JS文件，本系统最重要的部分。  
全面实现了所有的效果，同时考虑到系统的健壮性，对所有的输入内容均进行了良好的响应。   

-----

## 实现细节  


#### 页面样式  
全面使用了jQuery和Bootstrap的原生样式，是界面美观好看。  


#### 浏览器适配  
针对CSS3并不能在所有浏览器适配的情况，对所有浏览器均进行了适配。  

```
transition: opacity 0.6s;  /*设置透明度变化效果，持续时间0.5s*/
    -moz-transition: opacity 0.6s; /* Firefox 4 */
    -webkit-transition: opacity 0.6s; /* Safari 和 Chrome */
    -o-transition: opacity 0.6s; /* Opera */
```   

#### 响应式布局  
利用Bootstrap的栅格系统，对不同大小的浏览器进行了适配，分别书写了代码。  
通过Bootstrap的.hidden和.visible类名设置不同大小浏览器显示与隐藏。  
例如下面这个例子，在页面过于小的情况下不显示图片。   

```
<div class="pageTwo-text hidden-xs">
        <h1 class="pageTwo-text-h1">
            请选择您所需的功能<img src="picture/caticon.png">
        </h1>
    </div>
    <div class="pageTwo-text visible-xs">
        <h1 class="pageTwo-text-h1">
            请选择您所需的功能
        </h1>
    </div>
```

#### 系统健壮性  
考虑到用户可能有各种各样奇奇怪怪的输入，在JS文件中加入判断方法，在HTML中加入了提示标签，使系统针对不同的输入都有良好的回应。  

```
//判断id是否符合格式
function checkID(id) {
    var idString = String(id);
    if (idString.length != 10) {
        return false;
    } else {
        for (var i = 0; i < idString.length; i++) {
            if (!(idString[i] >= 0 && idString[i] <= 9)) {
                return false;
            }
        }
        return true;
    }

}

//判断id是否已经添加过
function existID(id) {
    var existStuList = JSON.parse(localStorage.getItem("stuList"));
    for (each in existStuList) {
        if (id == existStuList[each].id) {
            return false;
        }
    }
    return true;
}
```

-----

## 页面截图  

### 主界面  
![主界面](http://ots2ozzjq.bkt.clouddn.com/image/hyacinthee/web_tasks/F1/screenshot/%E4%B8%BB%E7%95%8C%E9%9D%A2.jpg)  

### 功能区  
![功能区](http://ots2ozzjq.bkt.clouddn.com/image/hyacinthee/web_tasks/F1/screenshot/%E5%8A%9F%E8%83%BD%E5%8C%BA.jpg)  

### Local Storage  
![Local Storage](http://ots2ozzjq.bkt.clouddn.com/image/hyacinthee/web_tasks/F1/screenshot/Local%20Storage.jpg)  

### 添加信息  
![添加信息](http://ots2ozzjq.bkt.clouddn.com/image/hyacinthee/web_tasks/F1/screenshot/%E6%B7%BB%E5%8A%A0%E4%BF%A1%E6%81%AF.jpg)  

### 添加信息成功  
![添加信息成功](http://ots2ozzjq.bkt.clouddn.com/image/hyacinthee/web_tasks/F1/screenshot/%E6%B7%BB%E5%8A%A0%E4%BF%A1%E6%81%AF%E6%88%90%E5%8A%9F.jpg)  

### 添加信息失败  
![添加信息失败](http://ots2ozzjq.bkt.clouddn.com/image/hyacinthee/web_tasks/F1/screenshot/%E6%B7%BB%E5%8A%A0%E4%BF%A1%E6%81%AF%E5%A4%B1%E8%B4%A5.jpg)  

### 搜索信息  
![搜索信息](http://ots2ozzjq.bkt.clouddn.com/image/hyacinthee/web_tasks/F1/screenshot/%E6%90%9C%E7%B4%A2%E4%BF%A1%E6%81%AF.jpg)  

### 搜索信息成功  
![搜索信息成功](http://ots2ozzjq.bkt.clouddn.com/image/hyacinthee/web_tasks/F1/screenshot/%E6%90%9C%E7%B4%A2%E4%BF%A1%E6%81%AF%E6%88%90%E5%8A%9F.jpg)  

### 搜索信息失败  
![搜索信息失败](http://ots2ozzjq.bkt.clouddn.com/image/hyacinthee/web_tasks/F1/screenshot/%E6%90%9C%E7%B4%A2%E4%BF%A1%E6%81%AF%E5%A4%B1%E8%B4%A5.jpg)  

### 修改信息  
![修改信息](http://ots2ozzjq.bkt.clouddn.com/image/hyacinthee/web_tasks/F1/screenshot/%E4%BF%AE%E6%94%B9%E4%BF%A1%E6%81%AF.jpg)  

### 修改信息成功  
![修改信息成功](http://ots2ozzjq.bkt.clouddn.com/image/hyacinthee/web_tasks/F1/screenshot/%E4%BF%AE%E6%94%B9%E4%BF%A1%E6%81%AF%E6%88%90%E5%8A%9F.jpg)  

### 遍历信息  
![遍历信息](http://ots2ozzjq.bkt.clouddn.com/image/hyacinthee/web_tasks/F1/screenshot/%E4%BF%A1%E6%81%AF%E9%81%8D%E5%8E%86.jpg)  

### 删除信息  
![删除信息](http://ots2ozzjq.bkt.clouddn.com/image/hyacinthee/web_tasks/F1/screenshot/%E4%BF%A1%E6%81%AF%E5%88%A0%E9%99%A4.jpg)  

### 手机界面  
![手机界面](http://ots2ozzjq.bkt.clouddn.com/image/hyacinthee/web_tasks/F1/screenshot/%E6%89%8B%E6%9C%BA%E5%B1%8F%E5%B9%95.jpg)  

### 手机界面添加信息  
![手机界面添加信息](http://ots2ozzjq.bkt.clouddn.com/image/hyacinthee/web_tasks/F1/screenshot/%E6%89%8B%E6%9C%BA%E6%B7%BB%E5%8A%A0%E4%BF%A1%E6%81%AF.jpg)  

