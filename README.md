

# ve-touch中文文档

**地址：github.com/plingply/ve-touch.git**

**测试地址：http://www.callback.ren/ve/touch**

1. v-touch:tap 单击
2. v-touch:press 长按
3. v-touch:move 移动
4. v-touch:moveleft 向左边滑动
5. v-touch:moveright 向右边滑动
6. v-touch:movetop 向上边滑动
7. v-touch:movebottom 向下滑动
8. v-touch:dbtap 双击
9. v-touch:scale 缩放，这个方法后面可不用跟函数
10. v-touch:scale={sc:1,ismove:true,isScale:true} 参数sc是限制的缩放比例，不传默认为1 ismove是否可以移动 isScale是否可以缩放

>修饰符
  1. .stop 阻止事件冒泡
  2. .prevent 阻止浏览器默认事件

>参数
* 	v-touch:tap="fun"
	v-touch:tap="{methods:fun,arg:{a:12,b:23}}"
	只有这两种写法 其他写法暂时不支持！

* 参数说明：默认第一个参数为 event 第二个参数才是自己传入的参数