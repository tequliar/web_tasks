# 颜色选择器插件

这是一篇关于颜色选择器插件的说明

---

## 文件说明

本插件基于jQuery实现，出于美观的考虑使用Bootstrap设计界面，通过预编译语言LESS简要调整样式，所满足的要求如下：

- 使用canvas标签结合JS绘制图像
- 支持颜色选择栏和色彩预览条的点击与拖动  
- 实时同步改变画布颜色与相应色值
- 插件健壮性，通过设置方法避免用户错误输入对插件产生干扰

----

## 插件使用方法
- 引入jQuery库和Bootstrap库
```
<script src="http://code.jquery.com/jquery-3.2.1.min.js"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
```

- 调用插件
```
<script type="text/javascript">
    $('.selector').selectColor();
</script>
```

- 定制属性 
```
<script type="text/javascript">
    $('.selector').selectColor({
        color: 'ff0000',	//颜色默认值
        height: 300         //颜色选择器画布的宽高(正方形，宽高相等)
    });
</script>
```

---
## 插件分析  

### canvas绘图  
- 首先说结论：使用canvas只绘制一次是不够的！  
- 由于与HSB色值对应的图像不是一张不同的渐变色图，而是左上角白色，右上角选中颜色，左下和右下纯黑色的图片，因此如果仅仅使用一次canvas绘图是无法实现这种效果的  
- 因此我们需要连续绘制两次。首先，第一次，绘制所选颜色到白色  
```
var color_fields_crea = color_fields_cont.createLinearGradient(30, 0, 330, 0);
color_fields_crea.addColorStop(0, '#ffffff');
color_fields_crea.addColorStop(1, '#'+selColor.HSB2Hex(hsb));
color_fields_cont.fillStyle = color_fields_crea;
color_fields_cont.fillRect(30, 0, 300, 300);
```
- 然后，第二次，绘制黑色到透明色  
```
var my_gradient1 = color_fields_cont.createLinearGradient(0, 0, 0, 300);
my_gradient1.addColorStop(0, 'rgba(0,0,0,0)');
my_gradient1.addColorStop(1, 'rgba(0,0,0,1)');
color_fields_cont.fillStyle = my_gradient1;
color_fields_cont.fillRect(30, 0, 300, 300);
```
- 两次绘制的结果是这个样子  
![](http://ots2ozzjq.bkt.clouddn.com/image/hyacinthee/web_tasks/F3/screenshot/%E9%A2%9C%E8%89%B2%E9%80%89%E6%8B%A9%E5%99%A801.jpg)
- 只有绘制出透明色才能既保证正确显示所选颜色，又能保证左下和右下角呈现黑色

### 颜色处理
- 插件中的方法是不可能将所有类型的色值设置为参数的，因此需要一个色值统一调配，在本插件中全部基于hsb色值统一处理   
- 在输入其他色值时需要将其转换为hsb色值，需要相应方法做处理。对于Hex、HSB、RGB这三种色值来说，一共需要六种转换方法。  
- 本插件依据[RGB、HSB\HSV、HSL三种颜色空间的原理理解与转换](http://blog.csdn.net/cy_tec/article/details/51454046)对色值转换进行了处理

![RGB转换为HSB](http://ots2ozzjq.bkt.clouddn.com/image/hyacinthee/web_tasks/F3/RGB2HSB.jpg)

![HSB转换为RGB](http://ots2ozzjq.bkt.clouddn.com/image/hyacinthee/web_tasks/F3/HSB2RGB.jpg)

### 图像捕获
- 圆形颜色选择器和色调滑块一共有点击和拖动两种功能，如果分别设置监听器就会消耗大量资源，因此可以考虑将两种功能统一起来  
- 考虑到无论是点击还是拖动都经历了鼠标按下和松开的过程，可以以此为切入点设置方法  
```
//滑块被按下时
this.downIndic = function (ev) {
    //this代表调用该方法的垂直色调栏
    var current = {
        select: $('.selector'),
        y: $(this).offset().top     //使用offset().top返回滑块相对于顶端的偏移量
    };
    $(document).mouseup(current, this.upIndic);
    $(document).mousemove(current, this.moveIndic);

    //将change()方法应用到垂直色调栏的标签上
    //同时对HSB中的H值进行修改
    change.apply(
        current.select.data('selectColor').number.eq(4).val(parseInt(360 * (current.select.data('selectColor').height - (ev.pageY - current.y)) / current.select.data('selectColor').height, 10)).get(0),[]
    );
};

//滑块移动时
this.moveIndic = function (ev) {
    //将change()方法应用到颜色选择器的标签上
    //同时对HSB中的H值进行修改
    change.apply(
        ev.data.select.data('selectColor').number.eq(4).val(parseInt(360 * (ev.data.select.data('selectColor').height - Math.max(0, Math.min(ev.data.select.data('selectColor').height, (ev.pageY - ev.data.y)))) / ev.data.select.data('selectColor').height, 10)) .get(0),[]
    );
    return false;
};

//滑块被松开时
this.upIndic = function (ev) {
    //修改RGB和Hex的值
    this.changeRGB(ev.data.select.data('selectColor').color, ev.data.select.get(0));
    this.changeHex(ev.data.select.data('selectColor').color, ev.data.select.get(0));
    //解除事件绑定
    $(document).off('mouseup', this.upIndic);
    $(document).off('mousemove', this.moveIndic);
    return false;
};
```
- 本插件在鼠标按下时捕获鼠标事件并绑定相应方法(dowmIndic())，在鼠标松开时解绑事件(upIndic())，从而实现了图像的捕获处理
---

## 实现细节

### canvas绘图
- 首先需要在HTML文件中添加canvas标签
```
<!--颜色选择器-->
<canvas class="color-fields-canvas" id="color-fields-canvas" width="300" height="300"></canvas>   
<!--垂直色调栏-->
<canvas class="color-bar-canvas" id="color-bar-canvas" width="25" height="300"></canvas>
```
- 然后需要在JS文件中做相应设置
```
//绘制颜色选择框
this.drawFields = function (hsb) {
    var color_fields = $('#color-fields-canvas')[0];
    var color_fields_cont = color_fields.getContext('2d');
    var color_fields_crea = color_fields_cont.createLinearGradient(0, 0, 300, 300);

    //设置渐变颜色
    color_fields_crea.addColorStop(0, '#ffffff');
    color_fields_crea.addColorStop(0.3, '#'+this.HSB2Hex(hsb));
    color_fields_crea.addColorStop(1, '#000000');
    color_fields_cont.fillStyle = color_fields_crea;
    color_fields_cont.fillRect(0, 0, 300, 300);
};

//绘制色调栏
this.drawBar = function() {
    var color_bar = $('#color-bar-canvas')[0];
    //由于jQuery对象没有getContext()方法，必须加上[0]获取dom对象
    var color_bar_cont = color_bar.getContext('2d');
    var color_bar_crea = color_bar_cont.createLinearGradient(0, 0, 25, 300);

    //初始化色带颜色
    color_bar_crea.addColorStop(0, '#ff0000');
    color_bar_crea.addColorStop(0.166, '#ffff00');
    color_bar_crea.addColorStop(0.333, '#00ff00');
    color_bar_crea.addColorStop(0.5, '#00ffff');
    color_bar_crea.addColorStop(0.666, '#0000ff');
    color_bar_crea.addColorStop(0.833, '#ff00ff');
    color_bar_crea.addColorStop(1, '#ff0000');
    color_bar_cont.fillStyle = color_bar_crea;
    color_bar_cont.fillRect(0, 0, 25, 300);
};
```
- 可以看出，关于canvas绘图最重要的就是getcontext()、createLinearFradient()、addColorStop()和fillRect()这几种方法。  
- 需要注意的是，当插件基于jQuery时，使用getContext()方法会发生错误。这是因为jQuery对象没有getContext()方法，必须通过dom对象获取。  
- 解决这个问题很容易，只需要在获取的jQuery对象后加上[0]即可

### 健壮性  
- 处理获取到的颜色  
由于用户可能输入各种类型的色值，在初始化时需要进行判断与处理  
```
if (typeof opt.color == 'string') {   //如果传入string类型的值则按Hex色值处理，typeof()中的圆括号是可选项
    opt.color = this.Hex2HSB(opt.color);
} else if (opt.color.r != undefined && opt.color.g != undefined && opt.color.b != undefined) {    //如果传入rgb三个颜色的值，则按RGB色值处理
    opt.color = this.RGB2HSB(opt.color);
} else if (opt.color.h != undefined && opt.color.s != undefined && opt.color.b != undefined) {    //如果传入hsb三个颜色的值，则按HSB色值处理
    opt.color = this.formatHSB(opt.color);
} else {    //当什么颜色都不存在时返回空
    return this;
}
```
- 数值修复  
考虑到用户可能输入超出范围的数字设置不输入数字，需要设置方法进行处理  
```
//在用户输入值过高或过低时进行数值修复
this.formatHSB = function (hsb) {
    return {
        h: Math.min(360, Math.max(0, hsb.h)),   //h范围0~360
        s: Math.min(100, Math.max(0, hsb.s)),   //s范围0~100
        b: Math.min(100, Math.max(0, hsb.b))    //b范围0~100
    };
};
this.formatRGB = function (rgb) {
    return {
        r: Math.min(255, Math.max(0, rgb.r)),   //r范围0~255
        g: Math.min(255, Math.max(0, rgb.g)),   //g范围0~255
        b: Math.min(255, Math.max(0, rgb.b))    //b范围0~255
    };
};
this.formatHex = function (hex) {
    var len = 6 - hex.length;   //正常十六进制数值有六位，判断输入值的差异
    //由于输入框只能输入六位，所以直接判断不足六位的情况即可
    if (len > 0) {
        var o = [];
        for (var i = 0; i < len; i++) {
            //使用push()方法为数组追加0
            o.push('0');
        }
        o.push(hex);
        //使用join()方法把数组中的所有元素放入一个字符串，赋值给hex
        hex = o.join('');
    }
    return hex;
};
```
对于RGB和HSB色值，只需要调用Math的max()和min()方法限定上下限即可  
对于Hex色值，考虑到可能输入的数值不满六位，故调用方法往前追加0
### 可扩展性
- 颜色选择器的可扩展性较差，这里只设置了默认颜色和选择器画布大小这两个属性  
```
this.defaults = {
    color: 'ff0000',	//颜色默认值
    height: 300         //颜色选择器画布的宽高(正方形，宽高相等)
};
```
- 不过可以考虑增加一些回调函数，用来扩大选择器的功能


--- 

## 程序截图
- 初始化颜色选择器  
![](http://ots2ozzjq.bkt.clouddn.com/image/hyacinthee/web_tasks/F3/screenshot/%E9%A2%9C%E8%89%B2%E9%80%89%E6%8B%A9%E5%99%A801.jpg)

- 使用过程截图  
![](http://ots2ozzjq.bkt.clouddn.com/image/hyacinthee/web_tasks/F3/screenshot/%E9%A2%9C%E8%89%B2%E9%80%89%E6%8B%A9%E5%99%A802.jpg)


---

## 相关链接

[颜色选择器插件](https://github.com/hyacinthee/web_tasks/blob/master/F3/selectColor.js)

[简单实例](https://github.com/hyacinthee/web_tasks/blob/master/F3/index.html)

[Less样式表](https://github.com/hyacinthee/web_tasks/blob/master/F3/style.less)

[CSS样式表](https://github.com/hyacinthee/web_tasks/blob/master/F3/style.css)
