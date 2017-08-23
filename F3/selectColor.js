(function ($) {
    var selectColor = function () {

    //********************************************定义并初始化参数***************************************************
        this.defaults = {
            color: 'ff0000',	//颜色默认值
            height: 300         //颜色选择器画布的宽高(正方形，宽高相等)
        };

        var selColor = this;

    //**********************************************构造方法********************************************************
        this.init = function (opt) {
            //调用extend()方法合并对象，将默认值与用户自定义整合到一起
            opt = $.extend({}, this.defaults, opt || {});//将一个空对象做为第一个参数,防止调用extend时将defaults的值改变
            //使用任意存在色值来调用方法设置HSB颜色
            if (typeof opt.color == 'string') {   //如果传入string类型的值则按Hex色值处理，typeof()中的圆括号是可选项
                opt.color = this.Hex2HSB(opt.color);
            } else if (opt.color.r != undefined && opt.color.g != undefined && opt.color.b != undefined) {    //如果传入rgb三个颜色的值，则按RGB色值处理
                opt.color = this.RGB2HSB(opt.color);
            } else if (opt.color.h != undefined && opt.color.s != undefined && opt.color.b != undefined) {    //如果传入hsb三个颜色的值，则按HSB色值处理
                opt.color = this.formatHSB(opt.color);
            } else {    //当什么颜色都不存在时返回空
                return this;
            }

            var selecter = $('.selector');
            var options = $.extend({}, opt);    //options用来专门处理用户的设置
            options.origColor = opt.color;      //设置默认颜色
            //首先对canvas标签进行绘制
            this.drawFields(options.origColor); //初始化颜色选择框
            this.drawBar(); //初始化色调栏
            //设置颜色输入框
            options.number = $('input').change(this.change);      //在RGB和HSB色值栏发生变化时调用change()方法
            $('.color-slider').mousedown(this.downIncrement);      //当增减箭头被按下时调用相应方法实现数值改变
            //设置颜色选择器
            options.fields = $('.color-fields').mousedown(this.downSelector);       //按下颜色选择器时调用相应方法
            options.circleSelector = $('.color-circle-selector');       //获取圆形颜色选择器
            //插件的存储部分，包括获取元素、色调滑块、即时颜色与获取颜色
            options.el = this;
            options.indic = $('.color-indic');      //获取色调滑块
            options.bar = $('.color-bar').mousedown(this.downIndic);     //为垂直色调栏绑定事件，在鼠标按下时调用方法
            options.selectedColor = $('.color-selected');
            //填充默认颜色
            selecter.data('selectColor', options);
            this.changeRGB(options.color,selecter.get(0));
            this.changeHSB(options.color,selecter.get(0));
            this.changeHex(options.color,selecter.get(0));
            this.setIndic(options.color,selecter.get(0));
            this.setSelector(options.color,selecter.get(0));
            this.setSelected(options.color,selecter.get(0));
        };

    //**********************************************功能性方法******************************************************
        //***********************在输入框边上的增减箭头****************************
        this.downIncrement = function (ev) {
            var number = $(this).parent().find('input');    //找到与箭头相对应的input标签
            //捕获当前数值栏的一些数据
            var current = {
                el: $(this).parent(),
                //数值上限，根据h和hsb位置判断最大值
                max: this.parentNode.className.indexOf('-hsb-h') > 0 ? 360 : (this.parentNode.className.indexOf('-hsb') > 0 ? 100 : 255),
                y: ev.pageY,
                number: number,
                val: parseInt(number.val(), 10)     //用来显示当前所选择区域的值
            };
            $(document).mouseup(current, selColor.upIncrement);
            $(document).mousemove(current, selColor.moveIncrement);
        };
        this.moveIncrement = function (current) {
            current.data.number.val(Math.max(0, Math.min(current.data.max, parseInt(current.data.val - current.pageY + current.data.y, 10))));
            selColor.change.apply(current.data.number.get(0),[]);
            return false;
        };
        //鼠标松开时解除方法
        this.upIncrement = function (current) {
            selColor.change.apply(current.data.number.get(0),[]);
            current.data.el.find('input');
            $(document).off('mouseup', selColor.upIncrement);
            $(document).off('mousemove', selColor.moveIncrement);
            return false;
        };

        //********************************色调滑块功能***********************************
        //滑块被按下时
        this.downIndic = function (ev) {
            //this代表调用该方法的垂直色调栏
            var current = {
                select: $('.selector'),
                y: $(this).offset().top     //使用offset().top返回滑块相对于顶端的偏移量
            };
            $(document).mouseup(current, selColor.upIndic);
            $(document).mousemove(current, selColor.moveIndic);

            //将change()方法应用到垂直色调栏的标签上
            //同时对HSB中的H值进行修改
            selColor.change.apply(
                current.select.data('selectColor')
                    .number.eq(4).val(parseInt(360 * (current.select.data('selectColor').height - (ev.pageY - current.y)) / current.select.data('selectColor').height, 10))
                    .get(0),
                []
            );
        };

        //滑块移动时
        this.moveIndic = function (ev) {
            //将change()方法应用到颜色选择器的标签上
            //同时对HSB中的H值进行修改
            selColor.change.apply(
                ev.data.select.data('selectColor')
                //由于在移动过程中，鼠标的位置可能超出颜色选择器，导致鼠标位置与滑块位置之差可能过大或出现负数，需要对最大最小值进行限定
                    .number.eq(4).val(parseInt(360 * (ev.data.select.data('selectColor').height - Math.max(0, Math.min(ev.data.select.data('selectColor').height, (ev.pageY - ev.data.y)))) / ev.data.select.data('selectColor').height, 10))
                    .get(0),
                []
            );
            return false;
        };

        //滑块被松开时
        this.upIndic = function (ev) {
            //修改RGB和Hex的值
            selColor.changeRGB(ev.data.select.data('selectColor').color, ev.data.select.get(0));
            selColor.changeHex(ev.data.select.data('selectColor').color, ev.data.select.get(0));
            //解除事件绑定
            $(document).off('mouseup', selColor.upIndic);
            $(document).off('mousemove', selColor.moveIndic);
            return false;
        };

        //*******************************颜色选择器功能************************************
        //选择器被按下时
        this.downSelector = function (ev) {
            //使用preventDefault取消事件的默认动作
            ev.preventDefault ? ev.preventDefault() : ev.returnValue = false;
            //获取颜色选择器本身以及选择器的位置
            var current = {
                select: $('.selector'),
                pos: $(this).offset()   //pos用于计算偏移量
            };

            //事件绑定
            $(document).mouseup(current, selColor.upSelector);
            $(document).mousemove(current, selColor.moveSelector);

            selColor.change.apply(
                current.select.data('selectColor').number
                //计算鼠标相对于顶部的偏移量，将其保存为B值
                    .eq(6).val(parseInt(100 * (current.select.data('selectColor').height - (ev.pageY - current.pos.top)) / current.select.data('selectColor').height, 10)).end()
                //计算鼠标相对与左端的偏移量，将其保存为S值
                    .eq(5).val(parseInt(100 * (ev.pageX - current.pos.left) / current.select.data('selectColor').height, 10))
                    .get(0),
                []
            );
        };

        this.moveSelector = function (ev) {
            selColor.change.apply(
                ev.data.select.data('selectColor').number
                //计算鼠标相对于顶部的偏移量，将其保存为B值，同时对其出现越界时的情况进行处理
                    .eq(6).val(parseInt(100 * (ev.data.select.data('selectColor').height - Math.max(0, Math.min(ev.data.select.data('selectColor').height, (ev.pageY - ev.data.pos.top)))) / ev.data.select.data('selectColor').height, 10)).end()
                //计算鼠标相对与左端的偏移量，将其保存为S值，同时对其出现越界时的情况进行处理
                    .eq(5).val(parseInt(100 * (Math.max(0, Math.min(ev.data.select.data('selectColor').height, (ev.pageX - ev.data.pos.left)))) / ev.data.select.data('selectColor').height, 10))
                    .get(0),
                []
            );
            return false;
        };

        this.upSelector = function (ev) {
            //修改RGB和Hex的值
            selColor.changeRGB(ev.data.select.data('selectColor').color, ev.data.select.get(0));
            selColor.changeHex(ev.data.select.data('selectColor').color, ev.data.select.get(0));
            //解除事件绑定
            $(document).off('mouseup', selColor.upSelector);
            $(document).off('mousemove', selColor.moveSelector);
            return false;
        };

    //***********************************************图像方法***********************************************************
        //*********************canvas绘图**************************
        //绘制颜色选择框
        this.drawFields = function (hsb) {
            var color_fields = $('#color-fields-canvas')[0];//jQuery对象没有getContext()方法，必须通过dom对象获取
            var color_fields_cont = color_fields.getContext('2d');

            //第一次绘制，所选颜色到白色
            var color_fields_crea = color_fields_cont.createLinearGradient(30, 0, 330, 0);
            color_fields_crea.addColorStop(0, '#ffffff');
            color_fields_crea.addColorStop(1, '#'+selColor.HSB2Hex(hsb));
            color_fields_cont.fillStyle = color_fields_crea;
            color_fields_cont.fillRect(0, 0, 300, 300);

            // 第二次填充，黑色到透明
            var my_gradient1 = color_fields_cont.createLinearGradient(0, 0, 0, 300);
            my_gradient1.addColorStop(0, 'rgba(0,0,0,0)');
            my_gradient1.addColorStop(1, 'rgba(0,0,0,1)');
            color_fields_cont.fillStyle = my_gradient1;
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
            color_bar_crea.addColorStop(0.166, '#ff00ff');
            color_bar_crea.addColorStop(0.333, '#0000ff');
            color_bar_crea.addColorStop(0.5, '#00ffff');
            color_bar_crea.addColorStop(0.666, '#00ff00');
            color_bar_crea.addColorStop(0.833, '#ffff00');
            color_bar_crea.addColorStop(1, '#ff0000');
            color_bar_cont.fillStyle = color_bar_crea;
            color_bar_cont.fillRect(0, 0, 25, 300);
        };

        //*********************添加数值************************
        this.changeRGB = function (hsb, select) {
            var rgb = selColor.HSB2RGB(hsb);
            $('.color-rgb span').val('('+rgb.r+','+rgb.g+','+rgb.b+')');
            $(select).data('selectColor').number
                .eq(1).val(rgb.r).end()
                .eq(2).val(rgb.g).end()
                .eq(3).val(rgb.b).end();
            //val()方法为各个颜色框追加数值
        };
        //由于hsb色值可能出现小数，所以使用round()方法四舍五入进行调整
        this.changeHSB = function (hsb, select) {
            $(select).data('selectColor').number
                .eq(4).val(Math.round(hsb.h * 10) / 10).end()
                .eq(5).val(Math.round(hsb.s * 10) / 10).end()
                .eq(6).val(Math.round(hsb.b * 10) / 10).end();
        };
        this.changeHex = function (hsb, select) {
            $(select).data('selectColor').number
                .eq(0).val(selColor.HSB2Hex(hsb));
        };

        //设置圆形颜色选择器位置
        this.setSelector = function (hsb, select) {
            //重新绘制画布
            selColor.drawFields({h: hsb.h, s: 100, b: 100});
            $(select).data('selectColor').circleSelector.css({
                //画布正方形区域，高度与宽度相等
                left: parseInt($(select).data('selectColor').height * hsb.s / 100, 10),//与左端的距离，以十进制转化为数值
                top: parseInt($(select).data('selectColor').height * (100 - hsb.b) / 100, 10)//与顶端的距离，以十进制转化为数值
            });
        };

        //设置色调滑块的位置
        //hsb中的h代表色相，因此通过h的值就能判断色调滑块在垂直色调栏中的位置
        this.setIndic = function (hsb, select) {
            $(select).data('selectColor').indic.css('top',
                parseInt($(select).data('selectColor').height - $(select).data('selectColor').height * hsb.h / 360, 10));
        };

        //设置即时颜色框的颜色
        this.setSelected = function (hsb, select) {
            $(select).data('selectColor').selectedColor.css('backgroundColor', '#' + selColor.HSB2Hex(hsb));
        };

        //当颜色改变时调用的函数
        this.change = function () {
            var select = $('.selector'), col;
            //使用parentNode属性获取父节点
            if (this.className.indexOf('-hex') > 0) {    //如果发生改变的是hex值，则将新的hex转化为HSB
                select.data('selectColor').color = col = selColor.Hex2HSB(selColor.formatHex(this.value));
            } else if (this.className.indexOf('-hsb') > 0) {     //如果发生改变的是HSB值，直接对HSB进行存储
                select.data('selectColor').color = col = selColor.formatHSB({
                    h: parseInt(select.data('selectColor').number.eq(4).val(), 10),
                    s: parseInt(select.data('selectColor').number.eq(5).val(), 10),
                    b: parseInt(select.data('selectColor').number.eq(6).val(), 10)
                });
            } else {    //如果发生改变的是RGB值，则将新的RGB转化为HSB
                select.data('selectColor').color = col = selColor.RGB2HSB(selColor.formatRGB({
                    r: parseInt(select.data('selectColor').number.eq(1).val(), 10),
                    g: parseInt(select.data('selectColor').number.eq(2).val(), 10),
                    b: parseInt(select.data('selectColor').number.eq(3).val(), 10)
                }));
            }
            //修改各颜色类型的数值
            //使用get()方法获取颜色选择器的id
            selColor.changeRGB(col, select.get(0));
            selColor.changeHex(col, select.get(0));
            selColor.changeHSB(col, select.get(0));

            //对圆形选择器、色相指示器的位置以及新颜色框的颜色进行设定
            selColor.setSelector(col, select.get(0));
            selColor.setIndic(col, select.get(0));
            selColor.setSelected(col, select.get(0));
        };

    //*********************************************数值处理方法*******************************************************
        //*******************************数值修复*****************************
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

        //**********************************颜色类型转换******************************
        this.Hex2RGB = function (hex) {
            var hex = parseInt(((hex.indexOf('#') > -1) ? hex.substring(1) : hex), 16);
            //首先判断这个hex值是否含有‘#’,如果有则从第二个位置解析(使用substring()方法从第二个位置开始提取字符串)，否则直接解析
            //使用parseInt()方法，传入参数16，即以十六进制解析字符串
            return {r: hex >> 16, g: (hex & 0x00FF00) >> 8, b: (hex & 0x0000FF)};
            //在hex值中，前两位代表r,中间两位代表g,后两位代表b,因此考虑使用为运算符找到相应的RGB
            //由于十六进制中一个数字代表四位，所以每移动两个数字就要移动八位
            //使用按位与&符号提取出相应位置的数字，最终获得RGB值
        };

        this.Hex2HSB = function (hex) {
            return selColor.RGB2HSB(selColor.Hex2RGB(hex));
        };

        this.RGB2HSB = function (rgb) {
            var hsb = {
                h: 0,
                s: 0,
                b: 0
            };
            var min = Math.min(rgb.r, rgb.g, rgb.b);
            var max = Math.max(rgb.r, rgb.g, rgb.b);
            var delta = max - min;
            hsb.b = max;
            hsb.s = max != 0 ? 255 * delta / max : 0;
            if (hsb.s != 0) {
                if (rgb.r == max) {
                    hsb.h = (rgb.g - rgb.b) / delta;
                } else if (rgb.g == max) {
                    hsb.h = 2 + (rgb.b - rgb.r) / delta;
                } else {
                    hsb.h = 4 + (rgb.r - rgb.g) / delta;
                }
            } else {
                hsb.h = -1;
            }
            hsb.h *= 60;
            if (hsb.h < 0) {
                hsb.h += 360;
            }
            hsb.s *= 100 / 255;
            hsb.b *= 100 / 255;
            return hsb;
        };

        this.HSB2RGB = function (hsb) {
            var rgb = {};
            var h = Math.round(hsb.h);
            var s = Math.round(hsb.s * 255 / 100);
            var b = Math.round(hsb.b * 255 / 100);
            if (s == 0) {
                rgb.r = rgb.g = rgb.b = b;
            } else {
                var t1 = b;
                var t2 = (255 - s) * b / 255;
                var t3 = (t1 - t2) * (h % 60) / 60;
                if (h == 360) h = 0;
                if (h < 60) {
                    rgb.r = t1;
                    rgb.b = t2;
                    rgb.g = t2 + t3
                }
                else if (h < 120) {
                    rgb.g = t1;
                    rgb.b = t2;
                    rgb.r = t1 - t3
                }
                else if (h < 180) {
                    rgb.g = t1;
                    rgb.r = t2;
                    rgb.b = t2 + t3
                }
                else if (h < 240) {
                    rgb.b = t1;
                    rgb.r = t2;
                    rgb.g = t1 - t3
                }
                else if (h < 300) {
                    rgb.b = t1;
                    rgb.g = t2;
                    rgb.r = t2 + t3
                }
                else if (h < 360) {
                    rgb.r = t1;
                    rgb.g = t2;
                    rgb.b = t1 - t3
                }
                else {
                    rgb.r = 0;
                    rgb.g = 0;
                    rgb.b = 0
                }
            }
            //使用round()方法四舍五入避免出现小数点
            return {r: Math.round(rgb.r), g: Math.round(rgb.g), b: Math.round(rgb.b)};
        };

        this.RGB2Hex = function (rgb) {
            //通过toString()方法将RGB色值以十六进制形式转化为字符串保存在数组中
            var hex = [
                rgb.r.toString(16),
                rgb.g.toString(16),
                rgb.b.toString(16)
            ];
            //对色值过小的颜色字符串追加0
            $.each(hex, function (nr, val) {
                if (val.length == 1) {
                    hex[nr] = '0' + val;
                }
            });
            //通过join()方法将数组转化为字符串
            return hex.join('');
        };

        this.HSB2Hex = function (hsb) {
            return selColor.RGB2Hex(selColor.HSB2RGB(hsb));
        };
    };


    //*********************************************对外接口********************************************************

    $.fn.selectColor = function (opt) {
        (new selectColor).init(opt);
    };

})(jQuery);
