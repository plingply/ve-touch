/**
 * ve-touch 3.1.4
 * created at Tue Jul 09 2019 15:29:37 GMT+0800 (GMT+08:00)
 */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.veTouch = factory());
}(this, function () { 'use strict';

    function __$styleInject(css, ref) {
      if ( ref === void 0 ) ref = {};
      var insertAt = ref.insertAt;

      if (!css || typeof document === 'undefined') { return; }

      var head = document.head || document.getElementsByTagName('head')[0];
      var style = document.createElement('style');
      style.type = 'text/css';

      if (insertAt === 'top') {
        if (head.firstChild) {
          head.insertBefore(style, head.firstChild);
        } else {
          head.appendChild(style);
        }
      } else {
        head.appendChild(style);
      }

      if (style.styleSheet) {
        style.styleSheet.cssText = css;
      } else {
        style.appendChild(document.createTextNode(css));
      }
    }

    var veTouch = {};
    veTouch.touchArr = ["move", "moveleft", "movetop", "moveright", "movebottom", "tap", "press", "dbtap", "scale"];
    veTouch.install = function(vue, options) {
        //添加全局指令111
        vue.directive('touch', {
            inserted: function(el, binding) {

                el.fn = function(el, binding) {
                    var index = veTouch.touchArr.indexOf(binding.arg);
                    if (index >= 0) {
                        if (typeof(binding.value) == 'function') {
                            el[veTouch.touchArr[index]] = binding.value;
                        } else if (typeof(binding.value) == 'object') {
                            el[veTouch.touchArr[index]] = function(e) {
                                return binding.value.methods(e, binding.value.arg)
                            };
                        } else {
                            el[veTouch.touchArr[index]] = function() {
                                console.error("参数错误,请不要用类似fun(a,b)这样的格式作为参数，正确方式为fun或者{methods:fun,arg:{a:1,b:2}}");
                                return binding.value
                            };
                        }
                    }
                };


                el.fn(el, binding);


                var tapObj = {};
                //控制手指触摸


                tapObj.count = 0;
                //判断是否能移动
                tapObj.canMove = false;
                //双击计数器
                tapObj.Dtap = 0;
                //敲击时间
                tapObj.time = 0;
                //触摸结束坐标
                tapObj.distanceX = 0;
                tapObj.distanceY = 0;

                //缩放相关
                tapObj.left = 0;
                tapObj.top = 0;
                tapObj.line = 1;
                tapObj.c = 1;
                tapObj.translate = "translate3d(0,0,0)";
                tapObj.scaleval = "scale(1)";
                tapObj.touch1 = {
                    x: 0,
                    y: 0
                };
                tapObj.touch2 = {
                    x: 0,
                    y: 0
                };
                tapObj.scanmove = true;
                //dbtap
                tapObj.stime = 0;
                tapObj.timelen = 500;
                tapObj.scount = 1;

                tapObj.isTap = function() {
                    return this.time < 150 && Math.abs(this.distanceX) < 2 && Math.abs(this.distanceY) < 2 && this.count == 1 && this.Dtap == 1;
                };
                tapObj.isdbtap = function() {
                    return Math.abs(this.distanceX) < 2 && Math.abs(this.distanceY) < 2 && this.count == 1 && this.Dtap == 2;
                };
                tapObj.isPress = function() {
                    return this.count == 1;
                };
                tapObj.isMove = function() {
                    return this.count == 1 && this.canMove;
                };
                tapObj.moveLeft = function() {
                    return this.distanceX > 30 && Math.abs(this.distanceY) < Math.abs(this.distanceX);
                };
                tapObj.moveRight = function() {
                    return this.distanceX < -30 && Math.abs(this.distanceY) < Math.abs(this.distanceX);
                };
                tapObj.moveTop = function() {
                    return this.distanceY > 30 && Math.abs(this.distanceX) < Math.abs(this.distanceY);
                };
                tapObj.moveBottom = function() {
                    return this.distanceY < -30 && Math.abs(this.distanceX) < Math.abs(this.distanceY);
                };
                tapObj.scale = function() {

                    };
                    //缩放初始化
                if (binding.arg == "scale") {
                    el.style.transform = tapObj.translate + " " + tapObj.scaleval;
                }

                function touchstart(e) {
                    var touches = e.touches[0]; //获取第一个触点
                    var touches_2 = e.touches[1]; //获取第二个触点
                    tapObj.pageX = touches.pageX;
                    tapObj.pageY = touches.pageY;
                    tapObj.time = +new Date();
                    if(tapObj.count >= 1){
                        tapObj.count = 0;
                    }
                    tapObj.count++;
                    tapObj.Dtap = tapObj.count > 1 ? 0 : tapObj.Dtap;
                    tapObj.Dtap++;
                    if (tapObj.Dtap == 1) {
                        tapObj.timeout = setTimeout(function() {
                            tapObj.Dtap = 0;
                        }, 300);
                    }

                    tapObj.canMove = true;

                    if (binding.arg == "press" && tapObj.isPress()) {
                        e.preventDefault();
                        e.stopPropagation();
                        tapObj.Interval = setTimeout(function() {
                            el.press(e);
                            tapObj.count = 0;
                        }, 500);
                    }
                    if (binding.arg == "dbtap" && tapObj.isdbtap()) {
                        if (binding.modifiers.prevent) { e.preventDefault(); }
                        if (binding.modifiers.stop) { e.stopPropagation(); }
                        tapObj.Dtap = 0;
                        clearTimeout(tapObj.timeout);
                        el.dbtap(e);
                    }

                    if (binding.arg == 'scale') {
                        var len = tapObj.translate.substr(12).split(")")[0].split(",");
                        tapObj.left = parseInt(len[0]);
                        tapObj.top = parseInt(len[1]);
                        tapObj.scount++;
                        tapObj.scanmove = touches_2 ? false : true;
                        el.style.transition = "";
                        if (tapObj.stime == 0) {
                            tapObj.stime = new Date().getTime();
                        }

                        if (touches_2) {
                            tapObj.stime = 0;
                            tapObj.touch1.x = touches.pageX;
                            tapObj.touch1.y = touches.pageY;
                            tapObj.touch2.x = touches_2.pageX;
                            tapObj.touch2.y = touches_2.pageY;
                            tapObj.line = parseInt(Math.sqrt(Math.pow(Math.abs(touches.pageX - touches_2.pageX), 2) + Math.pow(Math.abs(touches.pageY - touches_2.pageY), 2)));
                        } else {
                            tapObj.touch1.x = touches.pageX;
                            tapObj.touch1.y = touches.pageY;
                        }
                    }
                }

                function touchend(e) {
                    var touches = e.changedTouches[0];
                    tapObj.time = +new Date() - tapObj.time;
                    tapObj.distanceX = tapObj.pageX - touches.pageX;
                    tapObj.distanceY = tapObj.pageY - touches.pageY;

                    clearTimeout(tapObj.Interval);

                    if (binding.arg == "tap") {
                        if (binding.modifiers.prevent) { e.preventDefault(); }
                        if (binding.modifiers.stop) { e.stopPropagation(); }
                        if (tapObj.isTap()) {
                            el.tap(e);
                        }
                    }

                    if (binding.arg == 'scale') {
                        var sccc = (binding.value && binding.value.sc) ? binding.value.sc : 1;

                        var t = new Date().getTime();
                        if (t - tapObj.stime < tapObj.timelen && tapObj.scount >= 3) {
                            tapObj.translate = "translate3d(0,0,0)";
                            tapObj.scaleval = "scale(" + sccc + ")";
                            el.style.transition = "transform .3s";
                            el.style.transform = tapObj.translate + " " + tapObj.scaleval;
                            tapObj.stime = 0;
                            tapObj.line = 1;
                            tapObj.c = 1;
                            tapObj.scount = 1;
                        }
                    }

                    tapObj.count = 0;
                    tapObj.canMove = false;
                }

                function touchmove(e) {

                    var touches = e.changedTouches[0];
                    var touches_2 = e.changedTouches[1];
                    tapObj.time = +new Date() - tapObj.time;
                    tapObj.distanceX = tapObj.pageX - touches.pageX;
                    tapObj.distanceY = tapObj.pageY - touches.pageY;

                    if (binding.modifiers.stop) {
                        e.stopPropagation();
                    }

                    if (binding.arg == "move") {
                        if (binding.modifiers.prevent) { e.preventDefault(); }
                        if (binding.modifiers.stop) { e.stopPropagation(); }
                        el.move(e);
                    }



                    if (binding.arg == "moveleft") {

                        if (Math.abs(tapObj.distanceX) > Math.abs(tapObj.distanceY) && tapObj.distanceX > 0) {
                            e.preventDefault();
                        }

                        if (tapObj.isMove() && tapObj.moveLeft()) {
                            tapObj.canMove = false;
                            el.moveleft(e);
                        }
                    }

                    if (binding.arg == "moveright") {

                        if (Math.abs(tapObj.distanceX) > Math.abs(tapObj.distanceY) && tapObj.distanceX < 0) {
                            e.preventDefault();
                        }
                        if (tapObj.isMove() && tapObj.moveRight()) {
                            tapObj.canMove = false;
                            el.moveright(e);
                        }
                    }

                    if (binding.arg == "movetop") {

                        if (Math.abs(tapObj.distanceY) > Math.abs(tapObj.distanceX) && tapObj.distanceY > 0) {
                            e.preventDefault();
                        }

                        if (tapObj.isMove() && tapObj.moveTop()) {
                            tapObj.canMove = false;
                            el.movetop(e);
                        }
                    }

                    if (binding.arg == "movebottom") {

                        if (Math.abs(tapObj.distanceY) > Math.abs(tapObj.distanceX) && tapObj.distanceY < 0) {
                            e.preventDefault();
                        }

                        if (tapObj.isMove() && tapObj.moveBottom()) {
                            tapObj.canMove = false;
                            el.movebottom(e);
                        }
                    }

                    if (binding.arg == "scale") {
                        var option = {};
                        option.sc = (binding.value && binding.value.sc) ? binding.value.sc : 1;
                        var isscale = binding.value.isScale === undefined ? true : binding.value.isScale;
                        var ismover = binding.value.ismove === undefined ? true : binding.value.ismove;
                        if (touches_2 && isscale) { //缩放
                            var x1 = touches.pageX;
                            var y1 = touches.pageY;
                            var x2 = touches_2.pageX;
                            var y2 = touches_2.pageY;
                            tapObj.stime = 0;
                            tapObj.scount = 1;
                            tapObj.scanmove = false;
                            // 计算两个手指间的距离
                            var line = parseInt(Math.sqrt(Math.pow(Math.abs(touches.pageX - touches_2.pageX), 2) + Math.pow(Math.abs(touches.pageY - touches_2.pageY), 2)));
                            tapObj.c = (tapObj.c * (line / tapObj.line));
                            if (tapObj.c >= option.sc) {
                                tapObj.scaleval = 'scale3d(' + tapObj.c + ',' + tapObj.c + ',1)'; //通过s
                                el.style.transform = tapObj.translate + " " + tapObj.scaleval;
                                tapObj.line = line;
                                return
                            }
                            tapObj.c = tapObj.c < option.sc ? option.sc : tapObj.c;
                            tapObj.scaleval = 'scale3d(' + tapObj.c + ',' + tapObj.c + ',1)'; //通过s
                            el.style.transform = tapObj.translate + " " + tapObj.scaleval;
                            tapObj.line = line;
                        } else if (!touches_2 && ismover) { //移动
                            if (!tapObj.scanmove) { return }
                            var x1 = touches.pageX;
                            var y1 = touches.pageY;
                            if (Math.abs(tapObj.touch1.x - x1) > 10 || Math.abs(tapObj.touch1.y - y1) > 10) {
                                tapObj.stime = 0;
                                tapObj.scount = 1;
                            }

                            tapObj.translate = "translate3d(" + (tapObj.left + (-1 * (tapObj.touch1.x - x1))) + "px," + (tapObj.top + (-1 * (tapObj.touch1.y - y1))) + "px,0)";
                            el.style.transform = tapObj.translate + " " + tapObj.scaleval;
                        }
                    }
                }
                el.addEventListener("touchstart", touchstart, false);
                el.addEventListener("touchend", touchend, false);
                el.addEventListener("touchmove", touchmove, false);
            },
            update: function(el, binding) {
                el.fn(el, binding);
            }
        });
    };

    return veTouch;

}));
