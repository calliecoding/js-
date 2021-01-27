
//使用闭包，避免写在全局

(function(){
    //getElementsByClassName 兼容

    if(! document.getElementsByClassName){
        document.getElementsByClassName = function(eleClassName){
            var aEle = document.getElementsByTagName('*'),//通配符，获取页面所有节点
            reg = new RegExp("\\b"+eleClassName+"\\b"),
            arrEle = [];
            for(var i = 0,len=aEle.length;i<len; i++){
                if(reg.test(aEle[i].className)){ //匹配节点的className
                    arrEle.push(aEle[i]); //找到节点
                }
            }
            return arrEle
        }
    }
    



    //trim 兼容
    if(!String.prototype.trim){ //判断trim方法是否存在
        String.prototype.trim = function(){
            this.replace(/(^\s+) | ($\s+)/g, '') //用空字符串替代首位空格
        }
    }






    //工具类(构造函数)
    function Callie(selector){
        
       return new Callie.prototype.init(selector) //
    }
    
    //所有工具类都有一个 初始化的方法
    Callie.prototype = {
        constructor : Callie,
        init: function(selector){ /* init初始化，用于获取元素/包装元素，返回对象 */
            //自定义数组,只有数组才可以遍历
            
            var arr = null;
            var obj = { //存放获取元素的方法 ，先判断是什么方法
                    id : function(selector){
                        var dom = document.getElementById(selector.slice(1))

                        dom = null ? [] : [dom]
                        
                        return dom
                    },

                    className : function(selector){

                        //getElementsByClassName 要做兼容
                        return document.getElementsByClassName(selector.slice(1))
                    },

                    tag : function(selector){


                        return document.getElementsByTagName(selector)
                    },
                    html : function(selector){//创建元素
                        
                         //创建一个空的div
                        var div = document.createElement('div');

                        div.innerHTML = selector;

                        div.children //取出节点，返回一个HTMLCollection集合
                    },
                    //css3 选择器
                    css3 : function(selector){
                        return document.querySelectorAll(selector)
                    },
                }
            
           
            //判断参数是哪个获取元素的方法
            
            if(typeof selector === 'string'){//进来的是选择条件
                
               //去除首尾空格
                selector = selector.trim(selector)   //trim 只兼容到 9 ，为了兼容 IE8，所以要做兼容
                

                //判断是选择器还是创建标签  
                function isSelector (str){//str就是选择条件的字符串
                    
                    if(/^</.test(str)){ //以尖括号开头的一定是创建标签
                        return 'html'
                    }else if(/[+～>\s]/.test(str)){//判断css3 选择器: + ～ > ｜s
                        return 'css3'

                    }else if(/^\./.test(str)){ //判断单个类选择器

                        return 'className'
                    }else if(/^#/.test(str)){ //判断id选择器

                        return 'id'
                    }else if(/^\w+$/.test(str)){ //判断单个标签

                        return 'tag'
                    }
                    
                }


                //调用obj里面的函数
               arr = obj[isSelector(selector)](selector)


            }else if(typeof selector === 'Object'){
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

           Callie.each(arr,function(v, i, obj){ // 回调的参数 ：当前对象 下标 原对象
               

              /*   if(i === 2){ //筛选一个 ，跳过当前循环
                    
                    return true
                  
                }else if(i > 3){ //筛选前几个， 结束整个循环

                    return false
                } */

            this[i] = v;
            // console.log(this);
            },this)

            this.length = arr.length

        },

        on:function(){

        }
    }


    //设置init原型 = Callie类的原型
    Callie.prototype.init.prototype = Callie.prototype


    //静态方法
    Callie.each = function(obj,fn, that){ // 遍历对象 回调函数 可选参数（改变this指向）

        for (let i = 0; i < obj.length; i++) {
            var bool = fn.call(that || obj[i], obj[i], i, obj)
            
            if(bool === false){

                break; //结束整个for循环
            }else if(bool === true){
                continue //跳出当前循环
            }
        }

    }


    Callie.type = function (obj) {

        //获取object原型的toString方法
        var toString = Object.prototype.toString

        var type = {
            
            "number":'number',
            "string":'string',
            "boolean":'boolean',
            "undefined":'undefined',
            "[object RegExp]":'regExp',
            "[object Null]":'null',
            "[object Array]":'array',
            "[object Date]":'date',
            "[object Function]":'function',
            "[object Math]":'math',
            "[object Object]":'object'
        }

        return type[typeof obj] || type[toString.call(obj)]

    }

    
    //设置变量$为全局属性，从而在全局范围内可以访问到
    window.$ = Callie

}(window,document,undefined)) //封装工具类的时候，会把一些常用的东西传进去，因为很低版本的IE中，undefined是可以被修改的

