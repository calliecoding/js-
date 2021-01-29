
//使用闭包，避免写在全局

(function () {



    //getElementsByClassName 兼容
    if (!document.getElementsByClassName) {
        document.getElementsByClassName = function (eleClassName) {
            var aEle = document.getElementsByTagName('*'),//通配符，获取页面所有节点
                reg = new RegExp("\\b" + eleClassName + "\\b"),
                arrEle = [];
            for (var i = 0, len = aEle.length; i < len; i++) {
                if (reg.test(aEle[i].className)) { //匹配节点的className
                    arrEle.push(aEle[i]); //找到节点
                }
            }
            return arrEle
        }
    }


    //trim 兼容
    if (!String.prototype.trim) { //判断trim方法是否存在
        String.prototype.trim = function () {
            this.replace(/(^\s+) | ($\s+)/g, '') //用空字符串替代首位空格
        }
    }


    //阻止默认行为的兼容
    if (!Event.prototype.preventDefault) {
        //低版本IE
        Event.prototype.preventDefault = function () {
            window.event.returnValue = false
        }
    }
    //阻止冒泡的兼容
    if (!Event.prototype.stopPropagation) {
        //低版本IE
        Event.prototype.stopPropagation = function () {
            window.event.cancelBubble = true
        }
    }

    //将添加到dom身上的函数事件存储
    function _addEvent(data) { //data对象里面的参数：dom事件节点, type事件数组, fn事件函数


        /* 
        
        //一个事件名，绑定多个事件
                div.events = {
                    'click':{
                        say:fn,
                        hi:fn,
                        anonymous:[fn,fn,fn]  //为什么用数组存？因为用对象存还有取名字
                    }
                    'mouseenter':{
                        say:fn,
                        hi:fn,
                        anonymous:[fn,fn,fn]  //为什么用数组存？因为用对象存还有取名字
                    }
                }
        */



        //判断 data.dom.events是否存在，否：之前没有绑定过任何事件，这是第一次绑定事件
        if (typeof data.dom.events === 'undefined') {
            data.dom.events = {}
        }

        //判断之前有没有绑定过同类型事件
        if (typeof data.dom.events[data.type[0]] === 'undefined') { //type[0]一定是事件名

            data.dom.events[data.type[0]] = {}
            data.dom.events[data.type[0]].anonymous = [];
            //判断初始情况，给对应的值，方便后续的存储
        }


        //判断有没有自定义事件的名字,如[click,sayhi]
        if (typeof data.type[1] === 'undefined') {
            //匿名事件函数，存到anonymous里，形成anonymous:[fn,fn,fn]
            data.dom.events[data.type[0]].anonymous.push(data.fn)
        } else {
            //有名事件函数
            //type[0] 事件名， type[1] 事件函数名字
            /* 
                div.events = {
                    'click':{
                        say:fn,
                        hi:fn,
                        anonymous:[fn,fn,fn]  //为什么用数组存？因为用对象存还有取名字
                    }
            */
            data.dom.events[data.type[0]][data.type[1]] = data.fn


        }

    }


    //兼容removeEventListener  
    function _removeEvent(dom, type, fn, bool) {

        if (dom.removeEventListener) {
            //主流浏览器
            dom.removeEventListener(type, fn, bool)
        } else {
            dom.detachEventListener('on' + type, fn)
        }
    }


    //工具类(构造函数)
    function Callie(selector) {

        return new Callie.prototype.init(selector) //
    }

    //所有工具类都有一个 初始化的方法
    Callie.prototype = {
        constructor: Callie,

        /* init初始化，用于获取元素/包装元素，返回对象 */
        init: function (selector) {
            //自定义数组,只有数组才可以遍历

            var arr = null;
            var obj = { //存放获取元素的方法 ，先判断是什么方法
                id: function (selector) {
                    var dom = document.getElementById(selector.slice(1))

                    //判断当前dom是不是null
                    return dom === null ? [] : [dom]
                },

                className: function (selector) {

                    //getElementsByClassName 要做兼容
                    return document.getElementsByClassName(selector.slice(1))
                },

                tag: function (selector) {


                    return document.getElementsByTagName(selector)
                },
                html: function (selector) {//创建元素

                    //创建一个空的div
                    var div = document.createElement('div');

                    div.innerHTML = selector;

                    div.children //取出节点，返回一个HTMLCollection集合
                },
                //css3 选择器
                css3: function (selector) {
                    return document.querySelectorAll(selector)
                },
            }


            //判断参数是哪个获取元素的方法
            if (typeof selector === 'string') {//进来的是选择条件

                //去除首尾空格
                selector = selector.trim()   //trim 只兼容到 9 ，为了兼容 IE8，所以要做兼容


                //判断是选择器还是创建标签  
                function isSelector(str) {//str就是选择条件的字符串

                    if (/^</.test(str)) { //以尖括号开头的一定是创建标签
                        return 'html'
                    } else if (/[+～>\s]/.test(str)) {//判断css3 选择器: + ～ > ｜s
                        return 'css3'

                    } else if (/^\./.test(str)) { //判断单个类选择器

                        return 'className'
                    } else if (/^#/.test(str)) { //判断id选择器

                        return 'id'
                    } else if (/^\w+$/.test(str)) { //判断单个标签

                        return 'tag'
                    }

                }


                //调用obj里面的函数
                arr = obj[isSelector(selector)](selector)


            } else if (typeof selector === 'object') {
                //进来的是节点对象
                arr = [selector]; //包在数组里，数组才可以遍历


            }

            for (let i = 0; i < arr.length; i++) {
                this[i] = arr[i]
                this.length = arr.length
            }

            /*  输出的格式
            {
                 0:ele1,
                 1:ele2,
             }
             */

            Callie.each(arr, function (v, i, obj) { // 回调的参数 ：当前对象 下标 原对象


                /*   if(i === 2){ //筛选一个 ，跳过当前循环
                      
                      return true
                    
                  }else if(i > 3){ //筛选前几个， 结束整个循环
  
                      return false
                  } */

                this[i] = v;
                // console.log(this);
            }, this)

            this.length = arr.length

        },

        /* 获取或设置元素的文本内容 */
        html: function (str) {
            if (Callie.type(str) === 'undefined') {
                //html函数中没有穿参数时，就是获取元素
                //如：$('div').html()
                var val = this[0].innerHTML
                return val

            } else {
                //设置文本内容
                //如，$('div').html('hello')
                //节点集合，遍历设置文本内容
                Callie.each(this, function (v) { //this拿到实例对象
                    v.innerHTML = str
                })
                //链式操作，返回this
                return this

            }
        },
        /* 封装on方法,添加事件函数 */
        on: function (eventType, fn) {

            //非字符串不做操作
            if (typeof eventType !== 'string') return;

            //去除空格，拿到有效事件名
            var arr = eventType.trim().split(/\s+/)

            //遍历实例对象  $('div')
            for (var i = 0, len = this.length; i < len; i++) {
                //取出每个dom节点，绑定事件


                (function (i, that) {
                    //that 代表当前jq对象中的元素

                    //遍历事件名，因为可能传递多个事件名 click mouseenter
                    for (var j = 0, len2 = arr.length; j < len2; j++) {
                        var type = arr[j].split(/\./);
                        // console.log(type);


                        if (type[0] === 'mousewheel') {
                            //判断是火狐还是其他浏览器事件
                            function _eventWheelFn(e) {
                                //兼容事件对象
                                e = e || window.event;

                                //对方向值做处理
                                var dir = e.wheelDelta / 120 || -e.detail / 3;

                                //执行函数，判断return值，来阻止默认行为
                                if (fn.call(that, e, dir) === false) {
                                    e.preventDefault();
                                }
                            }

                            //判断滚轮事件名是哪个, 对象的事件不存在时，为null
                            type[0] = (that.onmousewheel === null) ? 'mousewheel' : 'DOMMouseScroll'

                            eventFnName = _eventWheelFn



                        } else {
                            //阻止事件默认行为，阻止冒泡
                            function _eventFn(e) {
                                //兼容事件对象
                                e = e || window.event;

                                if (fn.call(that, e) === false) {
                                    e.preventDefault();
                                }
                            }

                            eventFnName = _eventFn



                        }

                        //添加事件函数,因为attachEvent 默认不支持捕获，为了统一，所以addEventListener也要设置成不支持捕获
                        that.addEventListener ? that.addEventListener(type[0], eventFnName, false) : that.attachEvent('on' + type[0], eventFnName)

                        //存储对应的事件函数
                        _addEvent({
                            dom: that,
                            type: type,
                            fn: eventFnName
                        })

                    }

                }(i, this[i])) //传递this

            }

        },

        /* 封装off方法,移除事件函数*/
        off: function (eventType) {
            if (typeof eventType === 'undefined') {
                //$('div').off()
                //解绑元素上，所有事件类型，上的所有事件函数
                Callie.each(this, function (v) {
                    //v 表示当前元素

                    for (var key1 in v.events) {
                        //key1 ：事件类型的名字 ，如click mouseenter

                        for (var key2 in v.events[key1]) {
                            //key2 :事件函数的名字， 如sayhi:fn


                            //如何解绑 anonymous 里面的匿名函数？ 遍历进行解绑
                            if (Callie.type(v.events[key1][key2]) === 'function') { //
                                //给有名函数进行解绑
                                _removeEvent(v, key1, v.events[key1][key2], false)


                            } else {
                                //给匿名函数进行解绑
                                //遍历 anonymous数组,进行解绑


                                for (var j = 0, len = v.events[key1].anonymous.length; j < len; j++) {
                                    _removeEvent(v, key1, v.events[key1].anonymous[j], false)

                                }

                            }

                        }



                    }

                    //解绑后，释放内存
                    delete v.events;//或者v.events = {}
                })


            } else if (typeof eventType === 'string') { //安装需求解绑事件
                //$('div').off(‘str’)
                //得到事件名数组
                var arr = eventType.trim().split(/\s+/);  //处理字符串，如['click','mouseenter']

                // console.log(arr);
                //每个数据类型都有toString方法
                //arr..toString() 实现数组降纬    [''].toString() === ''
                if (arr.toString() === '') { //$('div').off(‘ ’)
                    return this
                }

                //对事件名数组进行遍历,
                for (var i = 0, len = arr.length; i < len; i++) {
                    //拆分事件名、事件函数
                    var type = arr[i].split(/\./)
                    // console.log(type);//如["click", "sayhi"]


                    //遍历实例对象，取到节点元素，解绑元素上对应的事件
                    Callie.each(this, function (v) {

                        //判断是否是火狐，修改滚动事件名
                        if (type[0] === 'mousewheel') {
                            type[0] = (v.onmousewheel === null) ? 'mousewheel' : 'DOMMouseScroll'
                        }

                        //判断事件函数，是有名函数，还是匿名函数
                        if (type.length > 1) { //如["click", "sayhi"]
                            //解绑有名的事件函数
                            _removeEvent(v, type[0], v.events[type[0]][type[1]], false)

                            //删除属性
                            delete v.events[type[0]][type[1]]

                        } else {//如["click"]
                            //解绑同类型事件  ； 可以写在else里面，因为判断的时，进来的是["click"]

                            //解绑同一事件类型中，的所有匿名事件，如结果click事件的所有匿名函数
                            for (var z = 0, len = v.events.length; z < len; z++) {
                                _removeEvent(v, type[0], v.events[type[0]].anonymous, false);
                            }

                            //解绑同一事件类型中，的有名的事件函数
                            for (var key3 in v.events[type[0]]) {
                                // console.log(v.events[type[0]]);
                                //判断是不是anonymous
                                if (!(v.events[type[0]][key3] instanceof Array)) {
                                    //不是anonymous时，解绑所有函数
                                    _removeEvent(v, type[0], v.events[type[0]][key3], false)
                                }
                            }
                            // console.log(v.events[type[0]]);

                            //删除 事件类型
                            delete v.events[type[0]]
                        }

                        console.log(v.events);


                    })


                }

            }
        },

        /* 封装text方法，获取或设置元素的文本内容 */
        text: function (str) {

            if (typeof str === 'undefined') {
                //获取文本内容
                //$('#wrap').text() 
                //默认获取第0个元素的文本内容
                return this[0].innerText
            } else if (typeof str === 'string') {
                //遍历节点，设置文本内容
                Callie.each(this, function (v) {
                    v.innerText = str
                })
                return this
            }

        },

        /* 获取元素的value值 */
        value: function (str) {
            //只有表单元素有value值
            //判断是不是表单元素
            if (typeof str === 'undefined') {
                //获取value值
                try {
                    return this[0].value
                } catch {
                    throw Error('只有表单元素能获取value值')
                }

            } else if (typeof str === 'string') {
                //设置value值
                Callie.each(this, function (v) {
                    v.value = str
                })
                return this
            }
        },
        /* 通过下标取到对应元素，返回jq对象 */
        eq: function (index) {
            var len = this.length;

            if (index >= len || index < 0) {
                throw Error('超出length长度')
            }

            //this[0] 返回的是原生dom节点，但需要的是JQ对象
            //调用init方法   注意new
            return new this.init(this[index])
        },

        /* 封装addClass */
        addClass: function (cName) {
            if (typeof cName === 'string') {
                var arrCName = cName.trim().split(/\s+/);

                //排除空串
                if (arrCName.toString() === '') return this;


                //遍历元素，添加类名
                Callie.each(this, function (v) {

                    /*  类名去重 */
                    //拿到元素本身的类名,拼接
                    var arrEleClass = null;
                    if (v.className === '') {
                        arrEleClass = arrCName
                    } else {

                        arrEleClass = v.className.trim().split(/\s+/).concat(arrCName)
                    }

                    for (var i = 0; i < arrEleClass.length; i++) { //从前往后取数据

                        for (var j = arrEleClass.length - 1; j > i; j--) { //从后往前取数据
                            if (arrEleClass[i] === arrEleClass[j]) {
                                //删除重复项
                                arrEleClass.splice(j, 1);
                            }

                        }

                    }

                    //arrEleClass 现在是非重复项的数组

                    //添加类名
                    v.className = arrEleClass.join(' ')

                })
            }
        },
        /* 封装 removeClass */
        removeClass: function (cName) {
            if (typeof cName === 'undefined') {
                //‘
                Callie.each(this, function (v) {
                    v.className = ''
                })

            } else if (typeof cName === 'string') {
                //去除多个类名

                //处理参数，的多余空格
                var arrCName = cName.trim().split(/\s+/);

                if (arrCName.toString() === '') return this;

                //移除传入的类名
                Callie.each(this, function (v) {
                    if (v.className.toString() === '') return this;

                    //得到元素本身存在的类名
                    var arrEleClass = v.className.trim().split(/\s+/);


                    for (var i = 0; i < arrCName.length; i++) {

                        //对元素本身已经存在的类名数组进行遍历，删除符合条件的类名
                        //删除的时候，倒着删除

                        for (var j = arrEleClass.length - 1; j >= 0; j--) {

                            if (arrEleClass[j] === arrCName[i]) {
                                arrEleClass.splice(j, 1)
                            }
                        }

                    }

                    // console.log(arrEleClass);

                    v.className = arrEleClass.join(' ')
                })

            }
        },


        /* 判断类名是否存在 */
        hasClass: function (cName) {
            //$('#wrap').hasClass('box1')，只传递一个参数


            var isClass = false;

            //遍历jq对象
            Callie.each(this, function (v) {

                //去除参数，前后的字符串
                cName = cName.trim()

                var reg = new RegExp('\\b' + cName + '\\b') //匹配单词边界
                if (reg.test(v.className)) { //匹配到
                    isClass = true;
                    return false; //结束当前到遍历， 封装的each方法里有
                }
            })

            return isClass;
        },

        /* 判断类名是否存在 */
        toggleClass: function (cName) {

            //遍历元素，toggleClass
            Callie.each(this, function (v) {
                //each 方法里面的this指向某一元素,是原生节点
                //hasClass是JQ对象的方法，是原生节点
                //为了调用方法，把原生节点 包装成JQ对象

                var that = Callie(v);


                if (that.hasClass(cName)) {
                    //有类名，删除
                    that.removeClass(cName)

                } else {
                    //没有类名，添加
                    that.addClass(cName)
                }
            })
            return this
        },

        /* 利用静态方法上的each，封装each  */
        each: function (fn) {

            Callie.each(this, function (v, i, arr) {
                var bool = fn.call(v, v, i, arr)
                if (bool !== 'undefined') {
                    return bool
                }
            })

        },

        /* 获取css、设置css */
        css: function (arg1, arg2) {

            var type = Callie.type(arg1),
                unit = '';//用来存单位值  
            if (type === 'string') { //判断第一个参数是不是字符串

                //判断是设置css，还是获取css
                if (!!arg2) {
                    //存在第二个参数，设置css

                    //判断哪些属性可以带单位，哪些样式属性不能带单位
                    var regEx = /width|height|margin|top|right|left|bottom|fontSize/i;

                    if (regEx.test(arg1)) {
                        //需要带单位的样式属性

                        //判断是数值还是auto; 如margin:auto

                        if (!isNaN(arg2 / 1)) {
                            //true 是数字，带单位
                            unit = 'px'
                        }

                    }

                    this.each(function () {
                        console.log(this); //this 指向进来的元素
                        this.style[arg1] = arg2 + unit
                    })

                    return this

                } else {
                    //获取
                    //判断是不是主流浏览器
                    if (window.getComputedStyle) {
                        //

                        return getComputedStyle(this[0])[arg1]
                    } else {
                        return this[0].currentStyle[arr1]
                    }
                }

            } else if (type === 'object') { //参数是{}
                for (var key in arg1) {
                    this.css(key, arg1[key]) //调用自己写好的
                }

                return this
            }
        },

        /* 操作自定义标签属性 */
        attr: function (arg1, arg2) {
            var type = Callie.type(arg1);

            if (type === 'string') { //判断第一个参数是不是字符串

                //判断是设置css，还是获取css
                if (!!arg2) {
                    //存在第二个参数，设置css
                    this.each(function () {
                        //console.log(this); //this 指向进来的元素
                        this.setAttribute(arg1, arg2)
                    })

                    return this

                } else {
                    //获取
                    //判断是不是主流浏览器
                    return this[0].getAttribute(arg1)

                }

            } else if (type === 'object') { //参数是{}
                for (var key in arg1) {
                    this.attr(key, arg1[key]) //调用自己写好的方法
                }
                return this
            }

        },

        /* 操作合法的标签属性 , prop在操控布尔值属性时，能正确返回布尔值*/
        prop: function (arg1, arg2) {
            var type = Callie.type(arg1);

            if (type === 'string') { //判断第一个参数是不是字符串

                //判断是设置css，还是获取css
                if (!!arg2) {
                    //存在第二个参数，设置css
                    this.each(function () {
                        //console.log(this); //this 指向进来的元素
                        this[arg1] = arg2
                    })

                    return this

                } else {
                    //获取
                    //判断是不是主流浏览器
                    return this[0][arg1]

                }

            } else if (type === 'object') { //参数是{}
                for (var key in arg1) {
                    this.prop(key, arg1[key]) //调用自己写好的方法
                }
                return this
            }
        },

        removeAttr: function (str) {
            if (Callie.type(str) === 'undefined') return this;
            var arr = str.trim().split(/\s+/);
            this.each(function (v) {
                //v 表示当前元素

                //遍历arr ，移除多个属性
                Callie.each(arr, function (attr) {
                    v.removeAttribute(attr)
                })
            })

            return this
        },

        /* 节点添加 */
        appendTo: function (select) {

            var that = this;

            /* 
                select 可以是
                JQ对象
                css选择器
                节点对象
            */

            //想得到一个包含select的对象,因为需要这个元素可遍历
            //判断是不是JQ对象
            if (!(select instanceof Callie)) {//不是jq对象时
                //包装成jq对象，方便后面遍历
                select = Callie(select)
            }


            // console.log(that); //拿到父元素
            select.each(function (v) {  //遍历父jq对象
                //v 代表当前元素

                var fragment = document.createDocumentFragment();
                that.each(function () {//遍历子jq对象
                    var node = this.cloneNode(true);//深克隆节点，克隆文本，不克隆事件

                    //克隆事件，并绑定
                    for (var key1 in this.events) {//遍历this上的events事件，key是事件类型

                        for (var key2 in this.events[key1]) {//k是事件函数的名字
                            //遍历事件类型下，对应的有名和无名的事件函数

                            //有名函数直接绑定，匿名函数需要遍历数组

                            if (key2 === 'anonymous') {
                                //对匿名函数进行绑定,还需要遍历
                                Callie.each(this.events[key1][key2], function () {
                                    Callie(node).on(key1, this)
                                })

                            } else {
                                //对有名函数进行绑定
                                Callie(node).on(key1 + '.' + key2, this.events[key1][key2])

                            }

                        }
                    }




                    fragment.appendChild(node)

                    //移除本身节点
                    //判断 this.parentNode是否存在
                    this.parentNode && this.parentNode.removeChild(this)
                })

                //将文档碎片，添加到父元素内部
                this.appendChild(fragment)
            })

            return this
        },

        /* 节点添加 */
        append: function (select) {
            if (!select) return;
            
            //判断是不是JQ对象
            if (!(select instanceof Callie)) {//不是jq对象时
                //传的css选择器或者节点
                //包装成jq对象，方便后面遍历
                Callie(select).appendTo(this)
            }else{ //是jq对象时
                select.appendTo(this)
            }
            return this
        },

        /* 移除节点 */
        remove:function(select){
            /* 
            不传：移除所有节点

            传递：节点，css选择器
            */

            var type = Callie.type(select);

            if (type === 'undefined') {  //移除所有子节点
               
                this.each(function(){
                    this.innerHTML = ''
                })                
            }else if(select instanceof Callie){ //传入是jq对象

                this.each(function(v){
                    //v代表父节点
                    
                    select.each(function(){
                        if(this.parentNode === v){//判断是不是父节点的子节点
                            v.removeChild(this)
                        }
                    })
                })

            }else if(type === 'string'){ //传入的是子如此
                var jq = Callie(select); //包装成jq对象，

                this.each(function(v){
                    //v代表父节点
                    
                    jq.each(function(){
                        if(this.parentNode === v){//判断是不是父节点的子节点
                            v.removeChild(this)
                        }
                    })
                })

            }
        }




    }


    //设置init原型 = Callie类的原型
    Callie.prototype.init.prototype = Callie.prototype


    /* 封装 each 方法
    
    静态方法
    */

    Callie.each = function (obj, fn, that) { // 遍历对象 回调函数 可选参数（改变this指向）

        for (let i = 0; i < obj.length; i++) {
            var bool = fn.call(that || obj[i], obj[i], i, obj) //回调函数的参数：节点对象，下标，原对象

            if (bool === false) {

                break; //结束整个for循环
            } else if (bool === true) {
                continue //跳出当前循环
            }
        }

    }

    /* 封装type 方法 */
    Callie.type = function (obj) {

        //获取object原型的toString方法
        var toString = Object.prototype.toString

        var type = {
            "number": 'number',
            "string": 'string',
            "boolean": 'boolean',
            "undefined": 'undefined',
            "[object RegExp]": 'regExp',
            "[object Null]": 'null',
            "[object Array]": 'array',
            "[object Date]": 'date',
            "[object Function]": 'function',
            "[object Math]": 'math',
            "[object Object]": 'object'
        }


        return type[typeof obj] || type[toString.call(obj)]

    }


    //设置变量$为全局属性，从而在全局范围内可以访问到
    window.$ = Callie

}(window, document, undefined)) //封装工具类的时候，会把一些常用的东西传进去，因为很低版本的IE中，undefined是可以被修改的

//获取元素


/*原生JS获取元素时，返回值的规律
id获取元素时，
    获取成功时：返回单个节点标签
    没有获取到的时候，返回null

class获取元素时，
     获取成功时：返回一个HTMLCollection集合，集合里面是标签节点
     没有获取到的时候，返回一个HTMLCollection集合，集合里面是[]

tag获取元素时，
    与class获取元素相同

querySelectorAll获取元素时：
    获取成功时：返回一个NodeList集合，集合里面是标签节点
    没有获取到的时候，返回一个NodeList集合，集合里面是[]

总结：大多数返回的是一个类数组集合，只有id获取返回的单个节点



*/



/* 如何创建元素？
用户传入 $('<div></div>')时

当用户传入 $('<div><p></p></div>')
<div><p></p></div>   这部分节点要如何创建？

在body节点 放入子节点
document.body.innerHTML = '<div><p></p></div>'
通过document.body.children 获取子节点 ,返回的也是HTMLCollection集合

同理在封装时，我们可以创建一个不存在的节点，再获取它的子节点

*/


/* 判断传入的选择器，是id？className？Tag？

1. 传递的是字符串，说明传的是选择器
2. 进来的是对象，说明进来的是节点


*/