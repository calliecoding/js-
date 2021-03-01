(function(){

    function Callie( selector) { // 构造函数; 
        //已知用户会传一个选择器
        //需要返回一个jq对象
        //传递selector选择器，在init里面获取元素
        return new Callie.prototype.init(selector) //new 返回一个新对象
    }

    //原型对象,存放公有方法,所有实例对象都能访问
    Callie.prototype = {
        constructor:Callie,
        init:function(selector){ // 初始化jq元素：把原生节点封装成
            //传来的是选择器，我需要知道是什么选择器，才能使用对应的查找方法

            var arr = null ;
            var obj = {
                id:function(selector){
                    
                }
            }

            
            if(typeof selector === 'string'){//判断参数是不是选择器

                //处理字符串，判断是那种选择器
                function isSelector(selector){}
                    




        }
    }


    window.$ = Callie ; //

})()