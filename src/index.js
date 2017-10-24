(function() {
    var veTouch = {}
    veTouch.install = function(vue, options) {
        //添加全局指令111
        vue.directive('touch', {
            inserted: function(el, binding) {

                el.touchArr = ["move", "moveleft", "moveright", "movebottom", "tap", "press", "dbtap"];

                el.fn = function(el,binding) {
                    for (var i = 0; i < el.touchArr.length; i++) {
                        if (binding.arg == el.touchArr[i]) {
                            if (typeof(binding.value) == 'function') {
                                el[el.touchArr[i]] = binding.value;
                            } else if (typeof(binding.value) == 'object') {
                                el[el.touchArr[i]] = function() {
                                    return binding.value.methods(binding.value.arg)
                                };
                            } else {
                                el[el.touchArr[i]] = function() {
                                    console.error("参数错误,请不要用类似fun(a,b)这样的格式作为参数，正确方式为fun或者{methods:fun,arg:{a:1,b:2}}")
                                    return binding.value
                                };
                            }
                            break;
                        }
                    }
                }

                el.fn(el,binding);


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

                tapObj.isTap = function() {
                    return this.time < 150 && Math.abs(this.distanceX) < 2 && Math.abs(this.distanceY) < 2 && this.count == 1 && this.Dtap == 1;
                }
                tapObj.isdbtap = function() {
                    return Math.abs(this.distanceX) < 2 && Math.abs(this.distanceY) < 2 && this.count == 1 && this.Dtap == 2;
                }
                tapObj.isPress = function() {
                    return this.count == 1;
                }
                tapObj.isMove = function() {
                    return this.count == 1 && this.canMove;
                }
                tapObj.moveLeft = function(arr) {
                    return this.distanceX > 30 && Math.abs(this.distanceY) < Math.abs(this.distanceX);
                }
                tapObj.moveRight = function(arr) {
                    return this.distanceX < -30 && Math.abs(this.distanceY) < Math.abs(this.distanceX);
                }
                tapObj.moveTop = function(arr) {
                    return this.distanceY > 30 && Math.abs(this.distanceX) < Math.abs(this.distanceY);
                }
                tapObj.moveBottom = function(arr) {
                    return this.distanceY < -30 && Math.abs(this.distanceX) < Math.abs(this.distanceY);
                }

                function touchstart(e) {
                    var touches = e.touches[0];
                    tapObj.pageX = touches.pageX;
                    tapObj.pageY = touches.pageY;
                    tapObj.time = +new Date();
                    tapObj.count++;
                    tapObj.Dtap = tapObj.count > 1 ? 0 : tapObj.Dtap;
                    tapObj.Dtap++;
                    if (tapObj.Dtap == 1) {
                        tapObj.timeout = setTimeout(function() {
                            tapObj.Dtap = 0;
                        }, 300)
                    }

                    tapObj.canMove = true;

                    if (binding.arg == "press" && tapObj.isPress()) {
                        if (binding.modifiers.prevent) e.preventDefault();
                        if (binding.modifiers.stop) e.stopPropagation();
                        tapObj.Interval = setTimeout(function() {
                            el.press();
                            tapObj.count = 0;
                        }, 500)
                    }
                    if (binding.arg == "dbtap" && tapObj.isdbtap()) {
                        if (binding.modifiers.prevent) e.preventDefault();
                        if (binding.modifiers.stop) e.stopPropagation();
                        tapObj.Dtap = 0;
                        clearTimeout(tapObj.timeout);
                        el.dbtap();
                    }
                }

                function touchend(e) {
                    var touches = e.changedTouches[0];
                    tapObj.time = +new Date() - tapObj.time;
                    tapObj.distanceX = tapObj.pageX - touches.pageX;
                    tapObj.distanceY = tapObj.pageY - touches.pageY;

                    clearTimeout(tapObj.Interval);

                    if (binding.arg == "tap") {
                        if (binding.modifiers.prevent) e.preventDefault();
                        if (binding.modifiers.stop) e.stopPropagation();
                        if (tapObj.isTap()) {
                            el.tap();
                        }
                    }

                    tapObj.count = 0;
                    tapObj.canMove = false;
                }

                function touchmove(e) {
                    var touches = e.changedTouches[0];
                    tapObj.time = +new Date() - tapObj.time;
                    tapObj.distanceX = tapObj.pageX - touches.pageX;
                    tapObj.distanceY = tapObj.pageY - touches.pageY;

                    if (binding.modifiers.stop) {
                        e.stopPropagation();
                    }

                    if (binding.arg == "move") {
                        if (binding.modifiers.prevent) e.preventDefault();
                        if (binding.modifiers.stop) e.stopPropagation();
                        el.move();
                    }



                    if (binding.arg == "moveleft") {

                        if (Math.abs(tapObj.distanceX) > Math.abs(tapObj.distanceY) && tapObj.distanceX > 0) {
                            e.preventDefault();
                        }

                        if (tapObj.isMove() && tapObj.moveLeft()) {
                            tapObj.canMove = false;
                            el.moveleft();
                        }
                    }

                    if (binding.arg == "moveright") {

                        if (Math.abs(tapObj.distanceX) > Math.abs(tapObj.distanceY) && tapObj.distanceX < 0) {
                            e.preventDefault();
                        }
                        if (tapObj.isMove() && tapObj.moveRight()) {
                            tapObj.canMove = false;
                            el.moveright();
                        }
                    }

                    if (binding.arg == "movetop") {

                        if (Math.abs(tapObj.distanceY) > Math.abs(tapObj.distanceX) && tapObj.distanceY > 0) {
                            e.preventDefault();
                        }

                        if (tapObj.isMove() && tapObj.moveTop()) {
                            tapObj.canMove = false;
                            el.movetop();
                        }
                    }

                    if (binding.arg == "movebottom") {

                        if (Math.abs(tapObj.distanceY) > Math.abs(tapObj.distanceX) && tapObj.distanceY < 0) {
                            e.preventDefault();
                        }

                        if (tapObj.isMove() && tapObj.moveBottom()) {
                            tapObj.canMove = false;
                            el.movebottom();
                        }
                    }
                }
                el.addEventListener("touchstart", touchstart, false);
                el.addEventListener("touchend", touchend, false);
                el.addEventListener("touchmove", touchmove, false);
            },
            update: function(el, binding) {
                el.fn(el,binding);
            }
        })
    }

    if (typeof exports == "object") {
        module.exports = veTouch
    } else if (typeof define == "function" && define.amd) {
        define([], function() {
            return veTouch
        })
    } else if (window.Vue) {
        // veTouch.install(Vue);
        Vue.use(veTouch)
    }
})()
