

使用手册

# 元素获取

## #id

### 概述

根据给定的ID匹配元素，并以对象的形式返回

### 示例

#### HTML 代码:

```html
<div id="wrap">id="wrap"</div>
```

#### jQuery 代码:

```js
$('#wrap')
```

#### 结果:

```
 {0: div#wrap, length: 1}
```



## .class

### 概述

根据给定的css类名匹配元素，并以对象的形式返回



### 示例

#### HTML 代码:

```html
<div class="box">class = box</div>
<div class="box">class = box</div>
```

#### jQuery 代码:

```js
$('.box')
```

#### 结果:

```
 {0: div.box, 1: div.box, 2: div.box, length: 2}
```



## element

### 概述

根据给定的元素标签名匹配所有元素，并以对象的形式返回

### 示例

#### HTML 代码:

```html
<p>第一个p标签</p>
<p>第二个p标签</p>
```

#### jQuery 代码:

```js
$('p')
```

#### 结果:

```
 {0: p, 1: p, length: 2}
```

## ancestor descendant

### 概述

在给定的祖先元素下匹配所有的后代元素，并以对象的形式返回



### 示例

#### HTML 代码:

```html
<form>
  <label>Name:</label>
  <input name="name" />
  <fieldset>
      <label>Newsletter:</label>
      <input name="newsletter" />
 </fieldset>
</form>
<input name="none" />
```

#### jQuery 代码:

```js
$("form input")
```

#### 结果:

```
  {0: input, 1: input, length: 2}
```



## parent &gt; child

### 概述

在给定的父元素下匹配所有的子元素，并以对象的形式返回



### 示例

#### HTML 代码:

```html
<form>
  <label>Name:</label>
  <input name="name" />
  <fieldset>
    <label>Newsletter:</label>
    <input name="newsletter" />
  </fieldset>
</form>
<input name="none" />
```

#### jQuery 代码:

```js
$("form > input")
```

#### 结果:

```
 {0: div#wrap, length: 1}
```

## prev + next

### 概述

匹配所有紧接在 prev 元素后的 next 元素，并以对象的形式返回



### 示例

#### HTML 代码:

```html
<form>
  <label>Name:</label>
  <input name="name" />
  <fieldset>
    <label>Newsletter:</label>
    <input name="newsletter" />
  </fieldset>
</form>
<input name="none" />
```

#### jQuery 代码:

```js
$("label + input")
```

#### 结果:

```
 {0: input, 1: input, length: 2}
```

## prev ~ siblings

### 概述

匹配 prev 元素之后的所有 siblings 元素，并以对象的形式返回

### 示例

#### HTML 代码:

```html
<form>
  <label>Name:</label>
  <input name="name" />
  <fieldset>
    <label>Newsletter:</label>
    <input name="newsletter" />
  </fieldset>
</form>
<input name="none" />
```

#### jQuery 代码:

```js
$("form ~ input")
```

#### 结果:

```
 {0: input, length: 1}
```



## 节点对象包装成jQ对象

### 概述

把节点包装成对象

### 示例

#### HTML 代码:

```html
<div id="wrap">id="wrap"</div>
```

#### jQuery 代码:

```js
$(wrap)
```

#### 结果:

```
 {0: div#wrap, length: 1}
```



## 创建节点对象

### 概述

创建节点对象，并以对象的形式返回

### 示例

#### jQuery 代码:

```js
$('<div class ='test'><p></p></div>')
```

#### 结果:

```
 {0: div.test, length: 1}
```



# 属性

## html

### 概述

获取或设置元素的html内容

### 示例

#### HTML 代码:

```html
<p class="box1">class="box1" <span>span</span></p>
<p class="box2">class="box2"</p>
<div></div>
```

#### jQuery 代码:

```js
console.log( '取得第一个匹配元素的html内容。',$('p').html() );
console.log( '设置html内容',$('div').html('hi') );
console.log( '给所有匹配的节点设置html',$('p').html('<span style="color:red">html内容</span>') );
```

#### 结果:

```
 class="box1" <span>span</span>
 {0: div, length: 1}
 {0: p.box1, 1: p.box2, length: 2}
```



## text

### 概述

取得/设置所有匹配元素的内容

### 示例

```js
//返回p元素的文本内容
$('p').text() 

//设置所有 span 元素的文本内容
$('span').text('一个span')
```

## value

### 概述

获取/设置表单元素的value值

### 示例

#### HTML 代码:

```html
<div id="wrap">id="wrap"</div>
```

#### jQuery 代码:

```js
//获取value
$('input').value()

//设置value
$('input').value('设置value值')
```





## eq

### 概述

获取当前链式操作中第N个jQuery对象，返回jQuery对象，

### 示例

#### HTML 代码:

```html
<div class="box">box1</div>
<div class="box">box2</div>
<div class="box">box3</div>
```

#### jQuery 代码:

```js
$('.box').eq(1)
```

## css

### 概述

获取/设置元素的css属性

### 示例

#### HTML 代码:

```html
<div id="wrap">id="wrap"</div>
<p>一个标签</p>
```

#### jQuery 代码:

```js
$('#wrap').css('width') ;  //默认获取第0个元素的属性值 

$('#wrap').css('width','200px') ;  //设置属性值


$('#wrap').css({ //设置多个属性值
  height:100,
  width:100
}) ;  
```

## attr

### 概述

获取/设置元素的自定义标签属性值

### 示例

#### HTML 代码:

```html
<div id="wrap">id="wrap"</div>
<p>一个标签</p>
```

#### jQuery 代码:

```js
$('#wrap').attr('mywidth') //获取

$('#wrap').attr('mywidth','我的自定义属性') //设置

$('#wrap').attr({ //设置多个attr
  myheight:'100',
  mywidth:'222'
}) ; 
```



## prop

### 概述

获取/设置元素的合法的标签属性值

### 示例

#### jQuery 代码:

```js
$('input').prop('checked')   //获取
  $('input').prop('checked',true) //设置 


$('input').prop({ //设置多个合法属性
  attr
  title:'100',
  checked:true
}) ; 
```



# 类名操作

## addClass

### 概述

为每个匹配的元素添加指定的类名。

### 示例



```js
//遇到重名class，自动去重
$('div').addClass('box2 box2 box1 box3') ;
```





## removeClass

### 概述

从所有匹配的元素中删除全部或者指定的类。

### 示例

```js
 //移除所有类名
$('.box').removeClass() ;
 //移除所有类名
$('.box').removeClass('box1') ; 
```



## hasClass

### 概述

判断元素是否包含类名，返回布尔值

### 示例

```js
 //移除所有类名
$('.box').removeClass() ;
 //移除所有类名
$('.box').removeClass('box1') ; 
```



## toggleClass

### 概述

如果存在（不存在）就删除（添加）一个类。

### 示例

```js
$("p").toggleClass("selected");
```



# 文档处理

## append()

### 概述

向每个匹配的元素内部追加内容。

### 示例

```js
$("p").append("<b>Hello</b>");
```



## appendTo()

### 概述

把所有匹配的元素追加到另一个指定的元素元素集合中。

### 示例

```js
$("p").appendTo("div");
```



## remove

### 概述

从父节点中移除子节点

### 示例

从DOM中把所有段落删除

#### HTML 代码:

```
<p>Hello</p> how are <p>you?</p>
```

#### jQuery 代码:

```
$("p").remove();
```

#### 结果:

```
how are
```

# 事件

## on 

### 概述

在选择元素上绑定一个或多个事件的事件处理函数

### 示例

```js
//绑定匿名事件函数
$('div').on('click ',function(e){
  console.log(111);
}) 

//绑定有名事件函数
$('div').on('click.sayhello ',function(e){
  console.log();
})

//同类型事件，绑定多个函数
$('div').on('click,click.sayhello ',function(e){
  console.log();
})

//绑定多个事件
$('div').on('mouseenter,click.sayhello ',function(e){
  console.log();
})
```



## off

### 概述

事件解绑

### 示例

## jQuery 代码:

```js
$('div').off()  //解绑所有事件
$('div').off('click')  //解绑单一类型的事件
$('#wrap').off('click.hi')  //解绑单个类型的有名函数
$('div').off('click.sayhi mouseenter')  //同时解绑多个事件
```

#### 结果:

```
 {0: div#wrap, length: 1}
```



# 工具

## each

### 概述

以每一个匹配的元素作为上下文来执行一个函数。

### 示例

迭代两个图像，并设置它们的 src 属性。注意:此处 this 指代的是 DOM 对象而非 jQuery 对象。

#### HTML 代码:

```html
<img/><img/>
```

#### jQuery 代码:

```js
$("img").each(function(){
   this.src = "test.jpg";
 });
```

#### 结果:

```
[ <img src="test0.jpg" />, <img src="test1.jpg" /> ]
```



## type

### 概述

检测数据类型

### 示例

#### jQuery 代码:

```js
'基础型数据'
$.type(123)) === 'number'
$.type(NaN)) === 'number'
$.type(true)) === 'boolean'
$.type(undefined)) === 'undefined'
$.type(null)) === 'null'
$.type("hello")) === 'string'
$.type(Symbol())) === 'symbol'


'引用型数据'

$.type({})) === 'object'
$.type(/\w/)) === 'regExp'
$.type([1,2])) === 'array'
$.type(function () { })) === 'function'
$.type(new Date())) === 'date'
$.type(Math)) === 'math'
```




