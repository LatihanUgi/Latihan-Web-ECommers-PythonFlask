/**
* Trieda SimpleSlider
*
* 
*
* Copyright (C) 2011  Mighty Sutulustus IV (www.sutulustus.com)
*
*
* LICENSE:
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
* 
* The above copyright notice and this permission notice shall be included in
* all copies or substantial portions of the Software.
* 
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
* THE SOFTWARE.
*
* @package     SimpleSlider
* @author      Mighty Sutulustus IV
* @copyright   20011 Mighty Sutulustus IV
* @link        http://www.sutulustus.com
* @license     http://www.opensource.org/licenses/mit-license.php
*/

(function($){    
    var defaults = {  
        sliderItemsClass: "div",   //slider items class selector
        speed: 400,       //animation duration
        easing: "swing",  //animation easing method
        vertical: false,  //vertical or horizontal slider
        autostart: false, //activate the automatic slider
        direction: 1,     //automatic sliding diraction
        timeoutTime: 0,   //automatic sliding timeout in seconds
        cyclic: false,    //endles slider
        prevNav: null,   //previous navigation button
        nextNav: null,    //next navigation button
        onBeforeSlide: function(index) {},  //navigation start callback
        onAfterSlide: function(index) {}    //navigation end callback
    };
    
    var methods = {
        init: function(opts) { 
            return this.each(function() {  
                var $this = $(this);   
                
                this.sliderItems = null;//slider object
                this.distance = null;   //slider distance
                this.timeout = null;    //timeout
                this.animating = false; //animating switcher
                this.cutentSelected = 0; //curent selected item
                this.sliderItems = new Array(); // slider children
                this.maxIteration = null; //max slider iteration for non cyclic slider
                this.prevNav = $this.parent().prev(".nav").find("a"); //previous navigation button
                this.nextNav = $this.parent().next(".nav").find("a"); //next navigation button
                
                //extend the default options
                this.opts = $.extend({}, defaults, opts);
                
                //options to local variable
                var options = this.opts;     
                
                //if options nav exists
                if(options.prevNav != null) this.prevNav = $(options.prevNav).find("a");
                if(options.nextNav != null) this.nextNav = $(options.nextNav).find("a");
                
                //minimum of 3 elements is necessary
                if($this.children(options.sliderItemsClass).length < 2) return false;
                
                do {
                    //get the slider items
                    this.sliderItems = $this.children(options.sliderItemsClass);    
                    
                    //non cyclic slider dont need to have a minimum of 3 items
                    if(!options.cyclic) break;
                    
                    //clone last element
                    if(this.sliderItems.length < 3) $(this.sliderItems).last().clone().appendTo($this);
                } while(this.sliderItems.length < 3);       
                
                //set default css for slider
                $this.css({
                    position: "absolute",
                    top: 0,
                    left: 0
                });
                
                //resolve navigation links
                methods.resize.apply($(this));  
                methods._resolveNavigation.apply($(this));  
                
                //if autostart then set timeout
                if(options.autostart && options.timeoutTime) {
                    if($this[0].timeout) clearTimeout($this[0].timeout);
                    $this[0].timeout = setTimeout(function() { methods.slide.apply($this, [options.direction]); }, options.timeoutTime * 1000);
                }   
                
                return this;
            });    
        },
        resize: function(){
            this.each(function() {
                var $this = $(this);   
                
                //options to local variable
                var options = this.opts;
                
                //get width and height of children items
                var height = $this.parent().outerHeight();
                var width = $this.parent().outerWidth();
                
                //get scroll distance
                if(options.vertical) {
                    this.distance = $(this.sliderItems[0]).height();
                    $this.css({ width: width, height: height * this.sliderItems.length }); 
                } else {
                    this.distance = $(this.sliderItems[0]).width();
                    $(this.sliderItems).css({ "float": "left" });
                    $this.css({ width: width * this.sliderItems.length, height: height });
                } 
            }); 
        },
        slide: function(direction) {
            this.each(function() {
                var $this = $(this);   
                
                //options to local variable
                var options = this.opts;
                
                //set cutent selected index
                if(direction) {
                    if(this.cutentSelected == (this.sliderItems.length - 1)) {
                        if(options.cyclic) this.cutentSelected = 0;
                        else return false;
                    } else {
                        this.cutentSelected++;    
                    }
                } else {
                    if(this.cutentSelected == 0) {
                        if(options.cyclic) this.cutentSelected = (this.sliderItems.length - 1);
                        else return false;
                    } else {
                        this.cutentSelected--;      
                    }                           
                }
                
                //resolve navigation links
                methods.slideTo.apply($(this), [this.cutentSelected]);
            });    
        },
        
        slideTo: function(index) {
            this.each(function() {
                var $this = $(this);   
                
                //options to local variable
                var options = this.opts;
                
                //before sliding start handler
                options.onBeforeSlide.apply($this[0], [index,this.cutentSelected]);
                
                var previousSlide =  this.cutentSelected;
                this.cutentSelected = index;
                
                //resolve navigation links
                methods._resolveNavigation.apply($(this));  
                
                //vertical and horizontal option
                if(options.vertical) {
                    var to = $(this.sliderItems[index]).position().top;
                    var move = { top: - to }; 
                } else {      
                    var to = $(this.sliderItems[index]).position().left;
                    var move = { left: - to };                  
                } 
                
                
                //stop and start the animation
                $this.stop(true, true).animate(
                    move, 
                    options.speed, 
                    options.easing,
                    (function(previous) {
                       return function(){
                            //after sliding handler
                            options.onAfterSlide.apply($this[0], [index,previous]);
                            
                            //if autostart then set timeout
                            if(options.autostart && options.timeoutTime) {
                                if($this[0].timeout) clearTimeout($this[0].timeout);
                                $this[0].timeout = setTimeout(function() { methods.slide.apply($this, [options.direction]); }, options.timeoutTime * 1000);
                            }
                        };
                    })(previousSlide)
                ); 
            });   
        },
        _slideCyclic: function(direction) {
            this.each(function() {
                var $this = $(this);   
                
                //options to local variable
                var options = this.opts;
                
                //before sliding start handler
                options.onBeforeSlide.apply($this[0], [direction]);
                
                if(this.animating) return false;
                this.animating = true;
                
                //vertical and horizontal option
                if(options.vertical) {
                    var curPosition = $this.position().top;
                    
                    if(direction) var move = { top: curPosition - this.distance };
                    else var move = { top: curPosition + this.distance };
                } else {
                    var curPosition = $this.position().left;
                    
                    if(direction) var move = { left: curPosition - this.distance };
                    else var move = { left: curPosition + this.distance };                  
                } 
                
                //stop and start the animation
                $this.stop(true, true).animate(
                    move, 
                    options.speed, 
                    options.easing, 
                    function(){
                        this.animating = false;
                        
                        //if cyclic reset the slider
                        if(options.cyclic) methods._reset.apply($this, [direction]); ;
                        
                        //after sliding handler
                        options.onAfterSlide.apply($this[0], [direction]);
                        
                        //if autostart then set timeout
                        if(options.autostart && options.timeoutTime) {
                            if($this[0].timeout) clearTimeout($this[0].timeout);
                            $this[0].timeout = setTimeout(function() { methods.slide.apply($this, [options.direction]); }, options.timeoutTime * 1000);
                        }
                    }
                );
            });   
        }, 
        _reset: function(direction) { 
            this.each(function() {  
                var $this = $(this); 
                
                //options to local variable 
                var options = this.opts;
                
                this.sliderItems = $this.children(options.sliderItemsClass);    
                
                if(options.vertical) var move = "top";
                else var move = "left";
                
                //reset direction
                if(direction) {
                    $this.append(this.sliderItems[0]);            
                } else {
                    $this.prepend(this.sliderItems[this.sliderItems.length - 1]);
                }
                $this.css(move, -this.distance);
            });    
        }, 
        _resolveNavigation: function(){
            this.each(function() {  
                var $this = $(this); 
                
                //if navigation exists
                if(this.prevNav != null && this.nextNav != null) {
                    //options to local variable 
                    var options = this.opts;
                    var $that = $(this);
                    
                    //bind navigation events
                    $(this.prevNav).unbind("click");
                    $(this.prevNav).click(function() { methods.slide.apply($that, [0]); });    
                
                    $(this.nextNav).unbind("click");
                    $(this.nextNav).click(function() { methods.slide.apply($that, [1]); });   
                    
                    if(!options.cyclic) {
                        //first item is visible
                        if(this.cutentSelected == 0 && this.cutentSelected != (this.sliderItems.length - 1)) {
                            $(this.nextNav).removeClass("disabled");
                            $(this.prevNav).addClass("disabled");
                            $(this.prevNav).unbind("click");
                        
                        //last item is visible    
                        } else if (this.cutentSelected != 0 && this.cutentSelected == (this.sliderItems.length - 1)) {
                            $(this.prevNav).removeClass("disabled");
                            $(this.nextNav).addClass("disabled");
                            $(this.nextNav).unbind("click");
                            
                        //first item is allso last item
                        } else if (this.cutentSelected == 0 && this.cutentSelected == (this.sliderItems.length - 1)) {
                            $(this.prevNav).addClass("disabled");
                            $(this.prevNav).unbind("click");
                            $(this.nextNav).addClass("disabled");
                            $(this.nextNav).unbind("click");
                            
                        //middle items are selected
                        } else {
                            $(this.prevNav).removeClass("disabled");
                            $(this.nextNav).removeClass("disabled");
                        }
                    }
                }
            });    
        }
    };

    $.fn.simpleSlider = function(method) {
        // Method calling logic
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || ! method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' +  method + ' does not exist on jQuery.simpleSlider');
        } 
    }; 
})(jQuery);