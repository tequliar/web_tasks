//使用对象级别的插件开发
//定义一个自执行的匿名函数，执行这个function并传入参数windows.jQuery和false、
//为插件定义私有作用域，防止外部代码访问插件内部以及插件污染全局变量

(function (e, t) {
    if (!e)return t;    //检测用户传进来的参数是否合法
    var carousel = function () {

        //*******************************************定义并初始化参数********************************************************

        this.element = t;   //el存储div
        this.items = t;     //items存储所有的li标签
        this.sizes = [];    //sizes存储每个li标签的宽高
        this.max = [0, 0];  //第一个参数表示最大宽度，第二个参数表示最大高度
        this.current = 0;   //current表示当前图片的index
        this.interval = t;  //用于记录setInterval()返回的ID值
        this.opts = {speed: 500, delay: 2500, keys: !t, dots: t, fluid: t, swipe: t};
        //speed表示图片切换的速度,delay表示图片停留的时间,keys表示是否接受键盘控制,
        //dots表示是否显示指示器,fluid表示是否支持响应式布局,swipe表示是否允许触摸滑动
        var carousel = this;

        //*********************************************类的构造方法**********************************************************

        //jQueryObject表示jQuery对象，options表示用户的选项
        this.init = function (jQueryObject, options) {
            this.element = jQueryObject;    //获取div
            this.ul = jQueryObject.children("ul");     //获取div的直接子元素ul
            this.max = [jQueryObject.outerWidth(), jQueryObject.outerHeight()];   //记录div的外部宽高(不含margin的其它部分)
            this.items = this.ul.children("li").each(this.calculate);
            //用items存储所有li标签，通过each循环每一个li标签，调用calculate方法存储每个标签的宽高，并找到最大宽高
            this.opts = e.extend(this.opts, options);     //调用extend()方法，将用户的设置与默认值合并并保存
            this.setup();
            return this;
        };

        //calculate()方法用于存储当前宽高并与最大宽高比对。
        this.calculate = function (t) {
            var object = e(this);
            var width = object.outerWidth();
            var height = object.outerHeight();
            carousel.sizes[t] = [width, height];    //在数组的第t+1个元素中存储当前的宽高
            if (width > carousel.max[0]) carousel.max[0] = width;
            if (height > carousel.max[1]) carousel.max[1] = height;
            //如果当前宽高是最大宽高，则调用max数组进行存储
        };


        //*********************************************图片初始化以及开关相应功能*********************************************

        //在setup中对设置标签的css样式，同时根据参数调控相应的功能
        this.setup = function () {
            this.element.css({overflow: "hidden", width: carousel.max[0], height: this.items.first().outerHeight()});
            //设置div的css样式，overflow设置为hidden，将超出div的部分隐藏，设置宽高为：最大宽度的宽，第一张图片的高
            this.ul.css({width: this.items.length * 100 + "%", position: "relative"});
            //设置ul的css样式，使用相对定位,有几张图片就将ul的宽度设为几倍
            this.items.css("width", 100 / this.items.length + "%");
            //设置li的css样式，有几张图片就将当前图片的宽度设置为ul宽度的几分之一
            //以上两部正好既保证了ul宽度适中，有保证了li宽度不变

            //如果设定的图片停留时间不为false，则图片开始移动
            if (this.opts.delay != t) {
                this.start();
                this.element.hover(this.stop, this.start)
                //当鼠标位于图片上方时，停止图片移动；当鼠标移开时，开始图片移动
            }

            //设置键盘的控制和指示器的显示

            //当逻辑或||时，找到为true的分项就停止处理，并返回该分项的值，否则执行完，并返回最后分项的值
            //当逻辑与&&时，找到为false的分项就停止处理，并返回该分项的值。
            this.opts.keys && e(document).keydown(this.keys);

            this.opts.dots && this.dots();

            //如果支持响应式布局
            if (this.opts.fluid) {
                var setPictureSize = function () {
                    carousel.element.css("width", Math.min(Math.round(carousel.element.outerWidth() / carousel.element.parent().outerWidth() * 100), 100) + "%");
                    //设置div的宽度倍数，为 div与父级div的大小比例 和 原大小 中相对较小的那个值，Math.round表示四舍五入
                    //这样既保证了图片超出轮播图宽度时大小不变(此时仅需要图片超出部分剪切即可)，又保证了过小的图片得到放大
                };
                setPictureSize();
                e(window).resize(setPictureSize);//当调整浏览器窗口的大小时，发生 resize 事件，将r事件与其绑定。一旦发生大小改变，则触发事件
            }

            //如果允许触屏滑动
            if (this.opts.swipe) {
                this.element.on("swipeleft",function () {
                    carousel.next();
                });
                this.element.on("swiperight",function () {
                    carousel.prev();
                });
            }
        };

        //**************************************************图片操作方法****************************************************


        //共有方法，图片移动
        //target表示目标图片，allowed表示是否允许图片切换
        this.move = function (target, allowed) {
            if (!this.items.eq(target).length) target = 0;  //取出index为target的li标签，如果当前div的所含元素个数为0，则将t设为0
            if (target < 0) target = this.items.length - 1; //如果target的值小于0，则将target设为li标签个数减一(及最后一张图)
            var li = this.items.eq(target);  //获取index为t的li标签
            var movePattern = {height: li.outerHeight()};  //移动模式，此时获取div的外部高度
            var moveSpeed = allowed ? 5 : this.opts.speed;//对r做判断，如果是则切换速度为5，否则为正常的切换速度
            if (!this.ul.is(":animated")) {//判断元素是否处于动画状态,当当前ul对象不处于动画时继续执行，防止因为延迟而出现移动多次的情况
                //找到第t个节点,使其处于激活状态；返回当前所有处于激活状态的同级元素，并将其激活状态清除
                carousel.element.find(".dot:eq(" + target + ")").addClass("active").siblings().removeClass("active");
                //调用animate()方法执行CSS属性集的自定义动画，调整div的宽度，同时移动图片
                this.element.animate(movePattern, moveSpeed) && this.ul.animate(e.extend({left: "-" + target + "00%"}, movePattern), moveSpeed, function (li) {
                    carousel.current = target; //将当前图片的index设置为target
                    e.isFunction(carousel.opts.complete) && !allowed && carousel.opts.complete(carousel.element)
                })
            }
        };

        //公有方法，开始自动播放图片
        this.start = function () {
            //setInterval函数以指定周期调用函数
            carousel.interval = setInterval(function () {
                carousel.move(carousel.current + 1)
            }, carousel.opts.delay)
        };

        //公有方法，停止自动播放图片
        this.stop = function () {
            carousel.interval = clearInterval(carousel.interval);//取出setInterval()返回的ID值,停止周期调用函数
            return carousel;
        };

        //公有方法，判断用户按下了哪个键，并执行相应动作
        this.keys = function (t) {
            //使用.which属性指示按了哪个键或按钮
            var pressKey = t.which;
            //按左键则上一张图，右键则下一张图，按下ESC键则停止自动跳转
            var keyIndex = {37: carousel.prev, 39: carousel.next, 27: carousel.stop};
            if (e.isFunction(keyIndex[pressKey])) {   //从字典中取出值，判断是否为函数，是则调用相应函数
                keyIndex[pressKey]();
            }
        };

        //公有方法，下一张图
        this.next = function () {
            return carousel.stop().move(carousel.current + 1)
        };

        //公有方法，上一张图
        this.prev = function () {
            return carousel.stop().move(carousel.current - 1)
        };

        //公有方法，显示指示器
        this.dots = function () {
            var addDots = '<ol class="dots">';    //添加有序列表
            e.each(this.items, function (e) {
                addDots += '<li class="dot' + (e < 1 ? " active" : "") + '">' + (e + 1) + "</li>"
            });
            addDots += "</ol>";
            //追加HTML后添加点击事件，对当前指示器对应的图片进行跳转
            this.element.addClass("has-dots").append(addDots).find(".dot").click(function () {
                carousel.move(e(this).index())
            })
        }
    };

    //******************************************************对外接口********************************************************

    e.fn.carousel = function (options) {
        var num = this.length;
        //使插件支持jQuery选择器
        //使用return关键字使得方法支持链式调用
        return this.each(function (i) {      //这里的this 就是 jQuery对象
            var jq = e(this);       //获取当前对应的jQuery对象
            var mycarousel = (new carousel).init(jq, options); //创建一个carousel对象，并调用init方法进行初始化，将iQuery对象和用户自定义属性作为参数传进去
            jq.data("carousel" + (num > 1 ? "-" + (i + 1) : ""), mycarousel)//调用data()方法进行赋值
        })
    }

})(window.jQuery, false);
