# 基于jQuery的可定制轮播图插件  

这是一篇关于可定制轮播图插件的说明 

---
## 文件说明

本插件参考Bootstrap的carousel等诸多轮播图样式，基于jQuery库实现，满足要求如下：

- 支持[自动播放](https://github.com/hyacinthee/web_tasks/tree/master/F2#自动播放)/[响应式布局](https://github.com/hyacinthee/web_tasks/tree/master/F2#响应式布局)/[指定图片跳转](https://github.com/hyacinthee/web_tasks/tree/master/F2#指定图片跳转)/[键盘操控](https://github.com/hyacinthee/web_tasks/tree/master/F2#键盘操控)/[图片前后移动](https://github.com/hyacinthee/web_tasks/tree/master/F2#图片前后移动)/[触屏滑动](https://github.com/hyacinthee/web_tasks/tree/master/F2#触屏滑动)等功能，当鼠标位于图片上方时停止自动播放

- 具有**[可定制性](https://github.com/hyacinthee/web_tasks/tree/master/F2#可定制性)**，插件提供参数，允许用户对轮播图的相关属性进行设置，主要包括设置图片切换速度、图片停留时间，开启或关闭键盘控制、指示器显示和响应式布局

- 具有**[健壮性](https://github.com/hyacinthee/web_tasks/tree/master/F2#创建插件)**，使用对象级别的插件开发，为插件定义私有作用域，防止外部代码访问插件内部以及插件污染全局变量，保证了插件的有效运行

- 采用预编译语言Less书写样式，通过编译生成css文件

---
## 插件使用方法

- 引入jQuery库和插件的js文件  
```
<script src="http://code.jquery.com/jquery-3.2.1.min.js"></script>
<script src="https://github.com/stephband/jquery.event.swipe/blob/master/js/jquery.event.swipe.js"></script>
<!--用来支持移动端触屏滑动-->
<script src="carousel.js"></script>
```
- 调用插件  
```
$(document).ready(function (e) {

    var mycarousel = $('<!--这里放置ul标签的父级标签-->').carousel({
        dots: true,
        fluid: true
    })//调用carousel，并传入参数表示允许显示指示器和响应式布局
    
});
```
- 调用插件公用方法
```
    mydata = mycarousel.data('carousel');
    mydata.start();
    mydata.stop();
```

---
## 实现细节

### 创建插件

插件需要一个独立的环境来运行，能且仅能同过接口与外界交互，这就需要将插件封装起来。因此可以定义一个自执行的匿名函数，执行这个函数并传入参数windows.jQuery和false来实现它。

```
(function (e, t) {

    ·····
    
    })(window.jQuery, false);
```
最外层的括号至关重要，有它存在才能保证插件的运行  

分析：  
- 首先, 要清楚两者的区别:  
(function {// code})是表达式, function {// code}是函数声明.     
- 其次, js"预编译"的特点:  
js在"预编译"阶段, 会解释函数声明, 但却会忽略表式.     
- 当js执行到function() {//code}();时, 由于function(){//code}在"预编译"阶段已经被解释过, js会跳过function(){//code}, 试图去执行();, 故会报错;     
- 当js执行到(function {// code})();时, 由于(function {// code})是表达式, js会去对它求解得到返回值, 由于返回值是一 个函数, 故而遇到();时, 便会被执行.

### 可定制性

以键值对的形式储存轮播图用到的一些参数，设立默认值并在其他函数中使用参数名调用它们，这样用户在调用插件是直接传入相应的参数值便可以对轮播图属性进行修改，实现插件的可定制性

参数及默认值：
```
this.opts = {speed: 500, delay: 2500, keys: !t, dots: t, fluid: t};
        //speed表示图片切换的速度,delay表示图片停留的时间,
        //keys表示是否接受键盘控制,dots表示是否显示指示器,fluid表示是否支持响应式布局
```
调用方法并传入参数：

```
$(document).ready(function (e) {
      
    var mycarousel = $('.banner').carousel({
        dots: true,
        fluid: true
    })//调用carousel，并传入参数表示允许显示指示器和响应式布局

});

```

### 指定图片跳转

通过实现move方法，传入参数target(目标图片的index)和allowed(判断是否允许图片切换)实现

```
this.move = function (target, allowed) {
            //取出index为target的li标签，如果当前div的所含元素个数为0，则将target设为0
            if (!this.items.eq(target).length) target = 0; 
            //如果target的值小于0，则将target设为li标签个数减一(及最后一张图)
            if (target < 0) target = this.items.length - 1; 
            var li = this.items.eq(target);     //获取index为t的li标签
            var movePattern = {height: li.outerHeight()};       //移动模式，此时获取div的外部高度
            var moveSpeed = allowed ? 5 : this.opts.speed;      //对r做判断，如果是则切换速度为5，否则为正常的切换速度
            //判断元素是否处于动画状态,当当前ul对象不处于动画时继续执行，防止因为延迟而出现移动多次的情况
            if (!this.ul.is(":animated")) {
                //找到第t个节点,使其处于激活状态；返回当前所有处于激活状态的同级元素，并将其激活状态清除
                carousel.element.find(".dot:eq(" + target + ")").addClass("active").siblings().removeClass("active");
                //调用animate()方法执行CSS属性集的自定义动画，调整div的宽度，同时移动图片
                this.element.animate(movePattern, moveSpeed) && this.ul.animate(e.extend({left: "-" + target + "00%"}, movePattern), moveSpeed, function (li) {
                    carousel.current = target;      //将当前图片的index设置为target
                })
            }
        };
```
实现原理:
- 通过eq()方法找到目标图片的li标签
- 通过:animated选择器判断元素是否处于动画状态，防止因网络延迟而出现的重复移动
- 通过addClass()方法激活相应指示器，通过siblings()和removeClass()方法识别并取消其它指示器的激活状态
- 通过animate方法执行自定义动画，移动图片并调整宽高

### 图片前后移动  

通过实现next()和prev()方法进行图片的前后移动  

```
//公有方法，下一张图
this.next = function () {
    return carousel.stop().move(carousel.current + 1)
};

//公有方法，上一张图
this.prev = function () {
    return carousel.stop().move(carousel.current - 1)
};
```

实质是通过调用move()方法进行图片跳转

然后为左右箭头绑定事件  

```
$('.carousel-arrow').click(function () {

    var fn = this.className.split(' ')[1];
    mydata[fn]();
    
 });
```
根据相应的类名决定前进还是后退

### 自动播放

在插件内实现start()和stop()方法用于控制图片的自动移动
```
//共有方法，开始自动播放图片
this.start = function () {
    //setInterval函数以指定周期调用函数
    carousel.interval = setInterval(function () {
        carousel.move(carousel.current + 1)
    }, carousel.opts.delay)
};

//共有方法，停止自动播放图片
this.stop = function () {
    carousel.interval = clearInterval(carousel.interval);//取出setInterval()返回的ID值,停止周期调用函数
    return carousel;
};
```
在setup()初始化方法中对参数delay进行判断并调用start()和stop()方法，来实现自动播放的功能

```
//如果设定的图片停留时间不为false，则图片开始移动
if (this.opts.delay != t) {
this.start();
this.element.hover(this.stop, this.start)
//当鼠标位于图片上方时，停止图片移动；当鼠标移开时，开始图片移动
}
```

### 键盘操控

在插件中实现key()方法用来捕获键盘按键并作出响应

```
this.keys = function (t) {
    //使用.which属性指示按了哪个键或按钮
    var pressKey = t.which;
    var keyIndex = {37: carousel.prev, 39: carousel.next, 27: carousel.stop};
    if (e.isFunction(keyIndex[pressKey])) {   //从字典中取出值，判断是否为函数，是则调用相应函数
        keyIndex[pressKey]();
    }
};
```
37对应键盘左键，39对应键盘右键，27对应键盘ESC键  
通过键值对的方式实现相应方法，按左键则上一张图，右键则下一张图，按下ESC键则停止自动跳转

### 触屏滑动

主要通过调用外部库jquery.event.swipe捕获移动距离并调用相应方法来实现

```
if (e.event.swipe) {
    this.element.on("swipeleft", carousel.prev).on("swiperight", carousel.next);
}
```

e.event.swipe基于jQuery的e.event.move事件，当移动超过30px时会触发事件并执行相应操作

### 响应式布局
当页面大小发生变化时，使用e(window).resize()方法捕获该事件，执行相应函数调整图片大小，实现响应式布局

```
if (this.opts.fluid) {  //如果允许响应式布局
    var setPictureSize = function () {
        carousel.element.css("width", Math.min(Math.round(carousel.element.outerWidth() / carousel.element.parent().outerWidth() * 100), 100) + "%");
    };
    setPictureSize();
    e(window).resize(setPictureSize);
}
```
考虑带图片不应该无限放大，为避免图片失真，调用数学方法进行判断  
取出 div与父级div的大小比例 和 原大小 中相对较小的那个值  
这样既保证了图片超出轮播图宽度时大小不变(此时仅需要图片超出部分剪切即可)，又保证了过小的图片得到放大

---

## 程序截图

### 简单实例
![简单实例](http://ots2ozzjq.bkt.clouddn.com/image/hyacinthee/web_tasks/F2/screenshot/carousel.jpg)

### 轮播图切换(水平滑动)
![轮播图切换](http://ots2ozzjq.bkt.clouddn.com/image/hyacinthee/web_tasks/F2/screenshot/carousel2.jpg)

### 响应式布局(平板大小)
![平板大小](http://ots2ozzjq.bkt.clouddn.com/image/hyacinthee/web_tasks/F2/screenshot/carousel-sm.jpg)

### 响应式布局(手机大小)
![手机大小](http://ots2ozzjq.bkt.clouddn.com/image/hyacinthee/web_tasks/F2/screenshot/carousel-xs.jpg)

---

## 文件链接

#### [carousel插件](https://github.com/hyacinthee/web_tasks/blob/master/F2/carousel.js)

#### [简单实例](https://github.com/hyacinthee/web_tasks/blob/master/F2/index.html)

#### [Less样式表](https://github.com/hyacinthee/web_tasks/blob/master/F2/style.less)

#### [css样式表](https://github.com/hyacinthee/web_tasks/blob/master/F2/style.css)
