/**
 * Juicy Slider - 3D Image Layer slider with Nivo slider fallback
 * jquery.juicy.js v1.0
 *
 * Copyright 2013, Adamantium Solutions
 * http://www.adamantium.sk
 */

 // TODO: keyboard navigation
 // TODO: add comments to every function
 // TODO: add debug messages
 // TODO: create callback events
 // TODO: great demo site
 // TODO: submit to code canyon
 // TODO: video support
 // TODO: many other themes
 // TODO: interactive slider builder
 // TODO: wp version
 // TODO: php version

;(function($, window, undefined) {
    'use strict';

    // ======================= imagesLoaded Plugin ===============================
    // https://github.com/desandro/imagesloaded

    // $('#my-container').imagesLoaded(myFunction)
    // execute a callback when all images have loaded.
    // needed because .load() doesn't work on cached images

    // callback function gets image collection as argument
    // this is the container

    // original: mit license. paul irish. 2010.
    // contributors: Oren Solomianik, David DeSandro, Yiannis Chatzikonstantinou

    // blank image data-uri bypasses webkit log warning (thx doug jones)
    var BLANK = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';

    $.fn.imagesLoaded = function( callback ) {
        var $this = this,
            deferred = $.isFunction($.Deferred) ? $.Deferred() : 0,
            hasNotify = $.isFunction(deferred.notify),
            $images = $this.find('img').add( $this.filter('img') ),
            loaded = [],
            proper = [],
            broken = [];

        // Register deferred callbacks
        if ($.isPlainObject(callback)) {
            $.each(callback, function (key, value) {
                if (key === 'callback') {
                    callback = value;
                } else if (deferred) {
                    deferred[key](value);
                }
            });
        }

        function doneLoading() {
            var $proper = $(proper),
                $broken = $(broken);

            if (deferred) {
                if (broken.length) {
                    deferred.reject($images, $proper, $broken);
                } else {
                    deferred.resolve($images);
                }
            }

            if ($.isFunction(callback)) {
                callback.call($this, $images, $proper, $broken);
            }
        }

        function imgLoaded(img, isBroken) {
            // don't proceed if BLANK image, or image is already loaded
            if(img.src === BLANK || $.inArray( img, loaded ) !== -1) {
                return;
            }

            // store element in loaded images array
            loaded.push(img);

            // keep track of broken and properly loaded images
            if (isBroken) {
                broken.push(img);
            } else {
                proper.push(img);
            }

            // cache image and its state for future calls
            $.data(img, 'imagesLoaded', {isBroken: isBroken, src: img.src});

            // trigger deferred progress method if present
            if (hasNotify) {
                deferred.notifyWith($(img), [isBroken, $images, $(proper), $(broken)]);
            }

            // call doneLoading and clean listeners if all images are loaded
            if ( $images.length === loaded.length ){
                setTimeout( doneLoading );
                $images.unbind( '.imagesLoaded' );
            }
        }

        // if no images, trigger immediately
        if (!$images.length) {
            doneLoading();
        } else {
            $images.bind('load.imagesLoaded error.imagesLoaded', function(event){
                // trigger imgLoaded
                imgLoaded(event.target, event.type === 'error');
            }).each(function(i, el) {
                var src = el.src;

                // find out if this image has been already checked for status
                // if it was, and src has not changed, call imgLoaded on it
                var cached = $.data(el, 'imagesLoaded');
                if (cached && cached.src === src ) {
                    imgLoaded(el, cached.isBroken);
                    return;
                }

                // if complete is true and browser supports natural sizes, try
                // to check for image status manually
                if (el.complete && el.naturalWidth !== undefined) {
                    imgLoaded(el, el.naturalWidth === 0 || el.naturalHeight === 0);
                    return;
                }

                // cached images don't fire load sometimes, so we reset src, but only when
                // dealing with IE, or image is complete (loaded) and failed manual check
                // webkit hack from http://groups.google.com/group/jquery-dev/browse_thread/thread/eee6ab7b2da50e1f
                if (el.readyState || el.complete) {
                    el.src = BLANK;
                    el.src = src;
                }
            });
        }

        return deferred ? deferred.promise($this) : $this;
    };

    
    
    /*
     * jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
     *
     * Uses the built in easing capabilities added In jQuery 1.1
     * to offer multiple easing options
     *
     * TERMS OF USE - jQuery Easing
     * 
     * Open source under the BSD License. 
     * 
     * Copyright Â© 2008 George McGinley Smith
     * All rights reserved.
     * 
     * Redistribution and use in source and binary forms, with or without modification, 
     * are permitted provided that the following conditions are met:
     * 
     * Redistributions of source code must retain the above copyright notice, this list of 
     * conditions and the following disclaimer.
     * Redistributions in binary form must reproduce the above copyright notice, this list 
     * of conditions and the following disclaimer in the documentation and/or other materials 
     * provided with the distribution.
     * 
     * Neither the name of the author nor the names of contributors may be used to endorse 
     * or promote products derived from this software without specific prior written permission.
     * 
     * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
     * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
     * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
     *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
     *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
     *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
     * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
     *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
     * OF THE POSSIBILITY OF SUCH DAMAGE. 
     *
    */

    // t: current time, b: begInnIng value, c: change In value, d: duration

    jQuery.easing['jswing']=jQuery.easing['swing'];jQuery.extend(jQuery.easing,{def:'easeOutQuad',swing:function(x,t,b,c,d){return jQuery.easing[jQuery.easing.def](x,t,b,c,d);},easeInQuad:function(x,t,b,c,d){return c*(t/=d)*t+b;},easeOutQuad:function(x,t,b,c,d){return-c*(t/=d)*(t-2)+b;},easeInOutQuad:function(x,t,b,c,d){if((t/=d/2)<1)return c/2*t*t+b;return-c/2*((--t)*(t-2)-1)+b;},easeInCubic:function(x,t,b,c,d){return c*(t/=d)*t*t+b;},easeOutCubic:function(x,t,b,c,d){return c*((t=t/d-1)*t*t+1)+b;},easeInOutCubic:function(x,t,b,c,d){if((t/=d/2)<1)return c/2*t*t*t+b;return c/2*((t-=2)*t*t+2)+b;},easeInQuart:function(x,t,b,c,d){return c*(t/=d)*t*t*t+b;},easeOutQuart:function(x,t,b,c,d){return-c*((t=t/d-1)*t*t*t-1)+b;},easeInOutQuart:function(x,t,b,c,d){if((t/=d/2)<1)return c/2*t*t*t*t+b;return-c/2*((t-=2)*t*t*t-2)+b;},easeInQuint:function(x,t,b,c,d){return c*(t/=d)*t*t*t*t+b;},easeOutQuint:function(x,t,b,c,d){return c*((t=t/d-1)*t*t*t*t+1)+b;},easeInOutQuint:function(x,t,b,c,d){if((t/=d/2)<1)return c/2*t*t*t*t*t+b;return c/2*((t-=2)*t*t*t*t+2)+b;},easeInSine:function(x,t,b,c,d){return-c*Math.cos(t/d*(Math.PI/2))+c+b;},easeOutSine:function(x,t,b,c,d){return c*Math.sin(t/d*(Math.PI/2))+b;},easeInOutSine:function(x,t,b,c,d){return-c/2*(Math.cos(Math.PI*t/d)-1)+b;},easeInExpo:function(x,t,b,c,d){return(t==0)?b:c*Math.pow(2,10*(t/d-1))+b;},easeOutExpo:function(x,t,b,c,d){return(t==d)?b+c:c*(-Math.pow(2,-10*t/d)+1)+b;},easeInOutExpo:function(x,t,b,c,d){if(t==0)return b;if(t==d)return b+c;if((t/=d/2)<1)return c/2*Math.pow(2,10*(t-1))+b;return c/2*(-Math.pow(2,-10*--t)+2)+b;},easeInCirc:function(x,t,b,c,d){return-c*(Math.sqrt(1-(t/=d)*t)-1)+b;},easeOutCirc:function(x,t,b,c,d){return c*Math.sqrt(1-(t=t/d-1)*t)+b;},easeInOutCirc:function(x,t,b,c,d){if((t/=d/2)<1)return-c/2*(Math.sqrt(1-t*t)-1)+b;return c/2*(Math.sqrt(1-(t-=2)*t)+1)+b;},easeInElastic:function(x,t,b,c,d){var s=1.70158;var p=0;var a=c;if(t==0)return b;if((t/=d)==1)return b+c;if(!p)p=d*.3;if(a<Math.abs(c)){a=c;var s=p/4;}
    else var s=p/(2*Math.PI)*Math.asin(c/a);return-(a*Math.pow(2,10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p))+b;},easeOutElastic:function(x,t,b,c,d){var s=1.70158;var p=0;var a=c;if(t==0)return b;if((t/=d)==1)return b+c;if(!p)p=d*.3;if(a<Math.abs(c)){a=c;var s=p/4;}
    else var s=p/(2*Math.PI)*Math.asin(c/a);return a*Math.pow(2,-10*t)*Math.sin((t*d-s)*(2*Math.PI)/p)+c+b;},easeInOutElastic:function(x,t,b,c,d){var s=1.70158;var p=0;var a=c;if(t==0)return b;if((t/=d/2)==2)return b+c;if(!p)p=d*(.3*1.5);if(a<Math.abs(c)){a=c;var s=p/4;}
    else var s=p/(2*Math.PI)*Math.asin(c/a);if(t<1)return-.5*(a*Math.pow(2,10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p))+b;return a*Math.pow(2,-10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p)*.5+c+b;},easeInBack:function(x,t,b,c,d,s){if(s==undefined)s=1.70158;return c*(t/=d)*t*((s+1)*t-s)+b;},easeOutBack:function(x,t,b,c,d,s){if(s==undefined)s=1.70158;return c*((t=t/d-1)*t*((s+1)*t+s)+1)+b;},easeInOutBack:function(x,t,b,c,d,s){if(s==undefined)s=1.70158;if((t/=d/2)<1)return c/2*(t*t*(((s*=(1.525))+1)*t-s))+b;return c/2*((t-=2)*t*(((s*=(1.525))+1)*t+s)+2)+b;},easeInBounce:function(x,t,b,c,d){return c-jQuery.easing.easeOutBounce(x,d-t,0,c,d)+b;},easeOutBounce:function(x,t,b,c,d){if((t/=d)<(1/2.75)){return c*(7.5625*t*t)+b;}else if(t<(2/2.75)){return c*(7.5625*(t-=(1.5/2.75))*t+.75)+b;}else if(t<(2.5/2.75)){return c*(7.5625*(t-=(2.25/2.75))*t+.9375)+b;}else{return c*(7.5625*(t-=(2.625/2.75))*t+.984375)+b;}},easeInOutBounce:function(x,t,b,c,d){if(t<d/2)return jQuery.easing.easeInBounce(x,t*2,0,c,d)*.5+b;return jQuery.easing.easeOutBounce(x,t*2-d,0,c,d)*.5+c*.5+b;}});
    
    /*!
     * jQuery Transit - CSS3 transitions and transformations
     * (c) 2011-2012 Rico Sta. Cruz <rico@ricostacruz.com>
     * MIT Licensed.
     *
     * http://ricostacruz.com/jquery.transit
     * http://github.com/rstacruz/jquery.transit
     */
    (function(k){k.transit={version:"0.9.9",propertyMap:{marginLeft:"margin",marginRight:"margin",marginBottom:"margin",marginTop:"margin",paddingLeft:"padding",paddingRight:"padding",paddingBottom:"padding",paddingTop:"padding"},enabled:true,useTransitionEnd:false};var d=document.createElement("div");var q={};function b(v){if(v in d.style){return v}var u=["Moz","Webkit","O","ms"];var r=v.charAt(0).toUpperCase()+v.substr(1);if(v in d.style){return v}for(var t=0;t<u.length;++t){var s=u[t]+r;if(s in d.style){return s}}}function e(){d.style[q.transform]="";d.style[q.transform]="rotateY(90deg)";return d.style[q.transform]!==""}var a=navigator.userAgent.toLowerCase().indexOf("chrome")>-1;q.transition=b("transition");q.transitionDelay=b("transitionDelay");q.transform=b("transform");q.transformOrigin=b("transformOrigin");q.transform3d=e();var i={transition:"transitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd",WebkitTransition:"webkitTransitionEnd",msTransition:"MSTransitionEnd"};var f=q.transitionEnd=i[q.transition]||null;for(var p in q){if(q.hasOwnProperty(p)&&typeof k.support[p]==="undefined"){k.support[p]=q[p]}}d=null;k.cssEase={_default:"ease","in":"ease-in",out:"ease-out","in-out":"ease-in-out",snap:"cubic-bezier(0,1,0.5,1)",bounce:'cubic-bezier(0.0, 0.35, 0.5, 1.3)',linear:'linear',swing:'ease-in-out',easeInCubic:'cubic-bezier(0.550, 0.055, 0.675, 0.190)',easeOutCubic:"cubic-bezier(0.215,0.61,0.355,1)",easeInOutCubic:"cubic-bezier(0.645,0.045,0.355,1)",easeInCirc:"cubic-bezier(0.6,0.04,0.98,0.335)",easeOutCirc:"cubic-bezier(0.075,0.82,0.165,1)",easeInOutCirc:"cubic-bezier(0.785,0.135,0.15,0.86)",easeInExpo:"cubic-bezier(0.95,0.05,0.795,0.035)",easeOutExpo:"cubic-bezier(0.19,1,0.22,1)",easeInOutExpo:"cubic-bezier(1,0,0,1)",easeInQuad:"cubic-bezier(0.55,0.085,0.68,0.53)",easeOutQuad:"cubic-bezier(0.25,0.46,0.45,0.94)",easeInOutQuad:"cubic-bezier(0.455,0.03,0.515,0.955)",easeInQuart:"cubic-bezier(0.895,0.03,0.685,0.22)",easeOutQuart:"cubic-bezier(0.165,0.84,0.44,1)",easeInOutQuart:"cubic-bezier(0.77,0,0.175,1)",easeInQuint:"cubic-bezier(0.755,0.05,0.855,0.06)",easeOutQuint:"cubic-bezier(0.23,1,0.32,1)",easeInOutQuint:"cubic-bezier(0.86,0,0.07,1)",easeInSine:"cubic-bezier(0.47,0,0.745,0.715)",easeOutSine:"cubic-bezier(0.39,0.575,0.565,1)",easeInOutSine:"cubic-bezier(0.445,0.05,0.55,0.95)",easeInBack:"cubic-bezier(0.6,-0.28,0.735,0.045)",easeOutBack:"cubic-bezier(0.175,0.885,0.32,1.275)",easeInOutBack:"cubic-bezier(0.68,-0.55,0.265,1.55)"};k.cssHooks["transit:transform"]={get:function(r){return k(r).data("transform")||new j()},set:function(s,r){var t=r;if(!(t instanceof j)){t=new j(t)}if(q.transform==="WebkitTransform"&&!a){s.style[q.transform]=t.toString(true)}else{s.style[q.transform]=t.toString()}k(s).data("transform",t)}};k.cssHooks.transform={set:k.cssHooks["transit:transform"].set};if(k.fn.jquery<"1.8"){k.cssHooks.transformOrigin={get:function(r){return r.style[q.transformOrigin]},set:function(r,s){r.style[q.transformOrigin]=s}};k.cssHooks.transition={get:function(r){return r.style[q.transition]},set:function(r,s){r.style[q.transition]=s}}}n("scale");n("translate");n("rotate");n("rotateX");n("rotateY");n("rotate3d");n("skewX");n("skewY");n("x",true);n("y",true);function j(r){if(typeof r==="string"){this.parse(r)}return this}j.prototype={setFromString:function(t,s){var r=(typeof s==="string")?s.split(","):(s.constructor===Array)?s:[s];r.unshift(t);j.prototype.set.apply(this,r)},set:function(s){var r=Array.prototype.slice.apply(arguments,[1]);if(this.setter[s]){this.setter[s].apply(this,r)}else{this[s]=r.join(",")}},get:function(r){if(this.getter[r]){return this.getter[r].apply(this)}else{return this[r]||0}},setter:{rotate:function(r){this.rotate=o(r,"deg")},rotateX:function(r){this.rotateX=o(r,"deg")},rotateY:function(r){this.rotateY=o(r,"deg")},scale:function(r,s){if(s===undefined){s=r}this.scale=r+","+s},skewX:function(r){this.skewX=o(r,"deg")},skewY:function(r){this.skewY=o(r,"deg")},perspective:function(r){this.perspective=o(r,"px")},x:function(r){this.set("translate",r,null)},y:function(r){this.set("translate",null,r)},translate:function(r,s){if(this._translateX===undefined){this._translateX=0}if(this._translateY===undefined){this._translateY=0}if(r!==null&&r!==undefined){this._translateX=o(r,"px")}if(s!==null&&s!==undefined){this._translateY=o(s,"px")}this.translate=this._translateX+","+this._translateY}},getter:{x:function(){return this._translateX||0},y:function(){return this._translateY||0},scale:function(){var r=(this.scale||"1,1").split(",");if(r[0]){r[0]=parseFloat(r[0])}if(r[1]){r[1]=parseFloat(r[1])}return(r[0]===r[1])?r[0]:r},rotate3d:function(){var t=(this.rotate3d||"0,0,0,0deg").split(",");for(var r=0;r<=3;++r){if(t[r]){t[r]=parseFloat(t[r])}}if(t[3]){t[3]=o(t[3],"deg")}return t}},parse:function(s){var r=this;s.replace(/([a-zA-Z0-9]+)\((.*?)\)/g,function(t,v,u){r.setFromString(v,u)})},toString:function(t){var s=[];for(var r in this){if(this.hasOwnProperty(r)){if((!q.transform3d)&&((r==="rotateX")||(r==="rotateY")||(r==="perspective")||(r==="transformOrigin"))){continue}if(r[0]!=="_"){if(t&&(r==="scale")){s.push(r+"3d("+this[r]+",1)")}else{if(t&&(r==="translate")){s.push(r+"3d("+this[r]+",0)")}else{s.push(r+"("+this[r]+")")}}}}}return s.join(" ")}};function m(s,r,t){if(r===true){s.queue(t)}else{if(r){s.queue(r,t)}else{t()}}}function h(s){var r=[];k.each(s,function(t){t=k.camelCase(t);t=k.transit.propertyMap[t]||k.cssProps[t]||t;t=c(t);if(k.inArray(t,r)===-1){r.push(t)}});return r}function g(s,v,x,r){var t=h(s);if(k.cssEase[x]){x=k.cssEase[x]}var w=""+l(v)+" "+x;if(parseInt(r,10)>0){w+=" "+l(r)}var u=[];k.each(t,function(z,y){u.push(y+" "+w)});return u.join(", ")}k.fn.transition=k.fn.transit=function(z,s,y,C){var D=this;var u=0;var w=true;if(typeof s==="function"){C=s;s=undefined}if(typeof y==="function"){C=y;y=undefined}if(typeof z.easing!=="undefined"){y=z.easing;delete z.easing}if(typeof z.duration!=="undefined"){s=z.duration;delete z.duration}if(typeof z.complete!=="undefined"){C=z.complete;delete z.complete}if(typeof z.queue!=="undefined"){w=z.queue;delete z.queue}if(typeof z.delay!=="undefined"){u=z.delay;delete z.delay}if(typeof s==="undefined"){s=k.fx.speeds._default}if(typeof y==="undefined"){y=k.cssEase._default}s=l(s);var E=g(z,s,y,u);var B=k.transit.enabled&&q.transition;var t=B?(parseInt(s,10)+parseInt(u,10)):0;if(t===0){var A=function(F){D.css(z);if(C){C.apply(D)}if(F){F()}};m(D,w,A);return D}var x={};var r=function(H){var G=false;var F=function(){if(G){D.unbind(f,F)}if(t>0){D.each(function(){this.style[q.transition]=(x[this]||null)})}if(typeof C==="function"){C.apply(D)}if(typeof H==="function"){H()}};if((t>0)&&(f)&&(k.transit.useTransitionEnd)){G=true;D.bind(f,F)}else{window.setTimeout(F,t)}D.each(function(){if(t>0){this.style[q.transition]=E}k(this).css(z)})};var v=function(F){this.offsetWidth;r(F)};m(D,w,v);return this};function n(s,r){if(!r){k.cssNumber[s]=true}k.transit.propertyMap[s]=q.transform;k.cssHooks[s]={get:function(v){var u=k(v).css("transit:transform");return u.get(s)},set:function(v,w){var u=k(v).css("transit:transform");u.setFromString(s,w);k(v).css({"transit:transform":u})}}}function c(r){return r.replace(/([A-Z])/g,function(s){return"-"+s.toLowerCase()})}function o(s,r){if((typeof s==="string")&&(!s.match(/^[\-0-9\.]+$/))){return s}else{return""+s+r}}function l(s){var r=s;if(k.fx.speeds[r]){r=k.fx.speeds[r]}return o(r,"ms")}k.transit.getTransitionValue=g})(jQuery);             
    
    // Delegate .transition() calls to .animate()
    // if the browser can't do CSS transitions.
    if (!$.support.transition) $.fn.transition = $.fn.animate;
    
    
    /*
    * @fileOverview TouchSwipe - jQuery Plugin
    * @version 1.6.3
    *
    * @author Matt Bryson http://www.github.com/mattbryson
    * @see https://github.com/mattbryson/TouchSwipe-Jquery-Plugin
    * @see http://labs.skinkers.com/touchSwipe/
    * @see http://plugins.jquery.com/project/touchSwipe
    *
    * Copyright (c) 2010 Matt Bryson
    * Dual licensed under the MIT or GPL Version 2 licenses.
    */
    (function(e){var o="left",n="right",d="up",v="down",c="in",w="out",l="none",r="auto",k="swipe",s="pinch",x="tap",i="doubletap",b="longtap",A="horizontal",t="vertical",h="all",q=10,f="start",j="move",g="end",p="cancel",a="ontouchstart" in window,y="TouchSwipe";var m={fingers:1,threshold:75,cancelThreshold:null,pinchThreshold:20,maxTimeThreshold:null,fingerReleaseThreshold:250,longTapThreshold:500,doubleTapThreshold:200,swipe:null,swipeLeft:null,swipeRight:null,swipeUp:null,swipeDown:null,swipeStatus:null,pinchIn:null,pinchOut:null,pinchStatus:null,click:null,tap:null,doubleTap:null,longTap:null,triggerOnTouchEnd:true,triggerOnTouchLeave:false,allowPageScroll:"auto",fallbackToMouseEvents:true,excludedElements:"button, input, select, textarea, a, .noSwipe"};e.fn.swipe=function(D){var C=e(this),B=C.data(y);if(B&&typeof D==="string"){if(B[D]){return B[D].apply(this,Array.prototype.slice.call(arguments,1))}else{e.error("Method "+D+" does not exist on jQuery.swipe")}}else{if(!B&&(typeof D==="object"||!D)){return u.apply(this,arguments)}}return C};e.fn.swipe.defaults=m;e.fn.swipe.phases={PHASE_START:f,PHASE_MOVE:j,PHASE_END:g,PHASE_CANCEL:p};e.fn.swipe.directions={LEFT:o,RIGHT:n,UP:d,DOWN:v,IN:c,OUT:w};e.fn.swipe.pageScroll={NONE:l,HORIZONTAL:A,VERTICAL:t,AUTO:r};e.fn.swipe.fingers={ONE:1,TWO:2,THREE:3,ALL:h};function u(B){if(B&&(B.allowPageScroll===undefined&&(B.swipe!==undefined||B.swipeStatus!==undefined))){B.allowPageScroll=l}if(B.click!==undefined&&B.tap===undefined){B.tap=B.click}if(!B){B={}}B=e.extend({},e.fn.swipe.defaults,B);return this.each(function(){var D=e(this);var C=D.data(y);if(!C){C=new z(this,B);D.data(y,C)}})}function z(a0,aq){var av=(a||!aq.fallbackToMouseEvents),G=av?"touchstart":"mousedown",au=av?"touchmove":"mousemove",R=av?"touchend":"mouseup",P=av?null:"mouseleave",az="touchcancel";var ac=0,aL=null,Y=0,aX=0,aV=0,D=1,am=0,aF=0,J=null;var aN=e(a0);var W="start";var T=0;var aM=null;var Q=0,aY=0,a1=0,aa=0,K=0;var aS=null;try{aN.bind(G,aJ);aN.bind(az,a5)}catch(ag){e.error("events not supported "+G+","+az+" on jQuery.swipe")}this.enable=function(){aN.bind(G,aJ);aN.bind(az,a5);return aN};this.disable=function(){aG();return aN};this.destroy=function(){aG();aN.data(y,null);return aN};this.option=function(a8,a7){if(aq[a8]!==undefined){if(a7===undefined){return aq[a8]}else{aq[a8]=a7}}else{e.error("Option "+a8+" does not exist on jQuery.swipe.options")}};function aJ(a9){if(ax()){return}if(e(a9.target).closest(aq.excludedElements,aN).length>0){return}var ba=a9.originalEvent?a9.originalEvent:a9;var a8,a7=a?ba.touches[0]:ba;W=f;if(a){T=ba.touches.length}else{a9.preventDefault()}ac=0;aL=null;aF=null;Y=0;aX=0;aV=0;D=1;am=0;aM=af();J=X();O();if(!a||(T===aq.fingers||aq.fingers===h)||aT()){ae(0,a7);Q=ao();if(T==2){ae(1,ba.touches[1]);aX=aV=ap(aM[0].start,aM[1].start)}if(aq.swipeStatus||aq.pinchStatus){a8=L(ba,W)}}else{a8=false}if(a8===false){W=p;L(ba,W);return a8}else{ak(true)}}function aZ(ba){var bd=ba.originalEvent?ba.originalEvent:ba;if(W===g||W===p||ai()){return}var a9,a8=a?bd.touches[0]:bd;var bb=aD(a8);aY=ao();if(a){T=bd.touches.length}W=j;if(T==2){if(aX==0){ae(1,bd.touches[1]);aX=aV=ap(aM[0].start,aM[1].start)}else{aD(bd.touches[1]);aV=ap(aM[0].end,aM[1].end);aF=an(aM[0].end,aM[1].end)}D=a3(aX,aV);am=Math.abs(aX-aV)}if((T===aq.fingers||aq.fingers===h)||!a||aT()){aL=aH(bb.start,bb.end);ah(ba,aL);ac=aO(bb.start,bb.end);Y=aI();aE(aL,ac);if(aq.swipeStatus||aq.pinchStatus){a9=L(bd,W)}if(!aq.triggerOnTouchEnd||aq.triggerOnTouchLeave){var a7=true;if(aq.triggerOnTouchLeave){var bc=aU(this);a7=B(bb.end,bc)}if(!aq.triggerOnTouchEnd&&a7){W=ay(j)}else{if(aq.triggerOnTouchLeave&&!a7){W=ay(g)}}if(W==p||W==g){L(bd,W)}}}else{W=p;L(bd,W)}if(a9===false){W=p;L(bd,W)}}function I(a7){var a8=a7.originalEvent;if(a){if(a8.touches.length>0){C();return true}}if(ai()){T=aa}a7.preventDefault();aY=ao();Y=aI();if(a6()){W=p;L(a8,W)}else{if(aq.triggerOnTouchEnd||(aq.triggerOnTouchEnd==false&&W===j)){W=g;L(a8,W)}else{if(!aq.triggerOnTouchEnd&&a2()){W=g;aB(a8,W,x)}else{if(W===j){W=p;L(a8,W)}}}}ak(false)}function a5(){T=0;aY=0;Q=0;aX=0;aV=0;D=1;O();ak(false)}function H(a7){var a8=a7.originalEvent;if(aq.triggerOnTouchLeave){W=ay(g);L(a8,W)}}function aG(){aN.unbind(G,aJ);aN.unbind(az,a5);aN.unbind(au,aZ);aN.unbind(R,I);if(P){aN.unbind(P,H)}ak(false)}function ay(bb){var ba=bb;var a9=aw();var a8=aj();var a7=a6();if(!a9||a7){ba=p}else{if(a8&&bb==j&&(!aq.triggerOnTouchEnd||aq.triggerOnTouchLeave)){ba=g}else{if(!a8&&bb==g&&aq.triggerOnTouchLeave){ba=p}}}return ba}function L(a9,a7){var a8=undefined;if(F()||S()){a8=aB(a9,a7,k)}else{if((M()||aT())&&a8!==false){a8=aB(a9,a7,s)}}if(aC()&&a8!==false){a8=aB(a9,a7,i)}else{if(al()&&a8!==false){a8=aB(a9,a7,b)}else{if(ad()&&a8!==false){a8=aB(a9,a7,x)}}}if(a7===p){a5(a9)}if(a7===g){if(a){if(a9.touches.length==0){a5(a9)}}else{a5(a9)}}return a8}function aB(ba,a7,a9){var a8=undefined;if(a9==k){aN.trigger("swipeStatus",[a7,aL||null,ac||0,Y||0,T]);if(aq.swipeStatus){a8=aq.swipeStatus.call(aN,ba,a7,aL||null,ac||0,Y||0,T);if(a8===false){return false}}if(a7==g&&aR()){aN.trigger("swipe",[aL,ac,Y,T]);if(aq.swipe){a8=aq.swipe.call(aN,ba,aL,ac,Y,T);if(a8===false){return false}}switch(aL){case o:aN.trigger("swipeLeft",[aL,ac,Y,T]);if(aq.swipeLeft){a8=aq.swipeLeft.call(aN,ba,aL,ac,Y,T)}break;case n:aN.trigger("swipeRight",[aL,ac,Y,T]);if(aq.swipeRight){a8=aq.swipeRight.call(aN,ba,aL,ac,Y,T)}break;case d:aN.trigger("swipeUp",[aL,ac,Y,T]);if(aq.swipeUp){a8=aq.swipeUp.call(aN,ba,aL,ac,Y,T)}break;case v:aN.trigger("swipeDown",[aL,ac,Y,T]);if(aq.swipeDown){a8=aq.swipeDown.call(aN,ba,aL,ac,Y,T)}break}}}if(a9==s){aN.trigger("pinchStatus",[a7,aF||null,am||0,Y||0,T,D]);if(aq.pinchStatus){a8=aq.pinchStatus.call(aN,ba,a7,aF||null,am||0,Y||0,T,D);if(a8===false){return false}}if(a7==g&&a4()){switch(aF){case c:aN.trigger("pinchIn",[aF||null,am||0,Y||0,T,D]);if(aq.pinchIn){a8=aq.pinchIn.call(aN,ba,aF||null,am||0,Y||0,T,D)}break;case w:aN.trigger("pinchOut",[aF||null,am||0,Y||0,T,D]);if(aq.pinchOut){a8=aq.pinchOut.call(aN,ba,aF||null,am||0,Y||0,T,D)}break}}}if(a9==x){if(a7===p||a7===g){clearTimeout(aS);if(V()&&!E()){K=ao();aS=setTimeout(e.proxy(function(){K=null;aN.trigger("tap",[ba.target]);if(aq.tap){a8=aq.tap.call(aN,ba,ba.target)}},this),aq.doubleTapThreshold)}else{K=null;aN.trigger("tap",[ba.target]);if(aq.tap){a8=aq.tap.call(aN,ba,ba.target)}}}}else{if(a9==i){if(a7===p||a7===g){clearTimeout(aS);K=null;aN.trigger("doubletap",[ba.target]);if(aq.doubleTap){a8=aq.doubleTap.call(aN,ba,ba.target)}}}else{if(a9==b){if(a7===p||a7===g){clearTimeout(aS);K=null;aN.trigger("longtap",[ba.target]);if(aq.longTap){a8=aq.longTap.call(aN,ba,ba.target)}}}}}return a8}function aj(){var a7=true;if(aq.threshold!==null){a7=ac>=aq.threshold}return a7}function a6(){var a7=false;if(aq.cancelThreshold!==null&&aL!==null){a7=(aP(aL)-ac)>=aq.cancelThreshold}return a7}function ab(){if(aq.pinchThreshold!==null){return am>=aq.pinchThreshold}return true}function aw(){var a7;if(aq.maxTimeThreshold){if(Y>=aq.maxTimeThreshold){a7=false}else{a7=true}}else{a7=true}return a7}function ah(a7,a8){if(aq.allowPageScroll===l||aT()){a7.preventDefault()}else{var a9=aq.allowPageScroll===r;switch(a8){case o:if((aq.swipeLeft&&a9)||(!a9&&aq.allowPageScroll!=A)){a7.preventDefault()}break;case n:if((aq.swipeRight&&a9)||(!a9&&aq.allowPageScroll!=A)){a7.preventDefault()}break;case d:if((aq.swipeUp&&a9)||(!a9&&aq.allowPageScroll!=t)){a7.preventDefault()}break;case v:if((aq.swipeDown&&a9)||(!a9&&aq.allowPageScroll!=t)){a7.preventDefault()}break}}}function a4(){var a8=aK();var a7=U();var a9=ab();return a8&&a7&&a9}function aT(){return !!(aq.pinchStatus||aq.pinchIn||aq.pinchOut)}function M(){return !!(a4()&&aT())}function aR(){var ba=aw();var bc=aj();var a9=aK();var a7=U();var a8=a6();var bb=!a8&&a7&&a9&&bc&&ba;return bb}function S(){return !!(aq.swipe||aq.swipeStatus||aq.swipeLeft||aq.swipeRight||aq.swipeUp||aq.swipeDown)}function F(){return !!(aR()&&S())}function aK(){return((T===aq.fingers||aq.fingers===h)||!a)}function U(){return aM[0].end.x!==0}function a2(){return !!(aq.tap)}function V(){return !!(aq.doubleTap)}function aQ(){return !!(aq.longTap)}function N(){if(K==null){return false}var a7=ao();return(V()&&((a7-K)<=aq.doubleTapThreshold))}function E(){return N()}function at(){return((T===1||!a)&&(isNaN(ac)||ac===0))}function aW(){return((Y>aq.longTapThreshold)&&(ac<q))}function ad(){return !!(at()&&a2())}function aC(){return !!(N()&&V())}function al(){return !!(aW()&&aQ())}function C(){a1=ao();aa=event.touches.length+1}function O(){a1=0;aa=0}function ai(){var a7=false;if(a1){var a8=ao()-a1;if(a8<=aq.fingerReleaseThreshold){a7=true}}return a7}function ax(){return !!(aN.data(y+"_intouch")===true)}function ak(a7){if(a7===true){aN.bind(au,aZ);aN.bind(R,I);if(P){aN.bind(P,H)}}else{aN.unbind(au,aZ,false);aN.unbind(R,I,false);if(P){aN.unbind(P,H,false)}}aN.data(y+"_intouch",a7===true)}function ae(a8,a7){var a9=a7.identifier!==undefined?a7.identifier:0;aM[a8].identifier=a9;aM[a8].start.x=aM[a8].end.x=a7.pageX||a7.clientX;aM[a8].start.y=aM[a8].end.y=a7.pageY||a7.clientY;return aM[a8]}function aD(a7){var a9=a7.identifier!==undefined?a7.identifier:0;var a8=Z(a9);a8.end.x=a7.pageX||a7.clientX;a8.end.y=a7.pageY||a7.clientY;return a8}function Z(a8){for(var a7=0;a7<aM.length;a7++){if(aM[a7].identifier==a8){return aM[a7]}}}function af(){var a7=[];for(var a8=0;a8<=5;a8++){a7.push({start:{x:0,y:0},end:{x:0,y:0},identifier:0})}return a7}function aE(a7,a8){a8=Math.max(a8,aP(a7));J[a7].distance=a8}function aP(a7){return J[a7].distance}function X(){var a7={};a7[o]=ar(o);a7[n]=ar(n);a7[d]=ar(d);a7[v]=ar(v);return a7}function ar(a7){return{direction:a7,distance:0}}function aI(){return aY-Q}function ap(ba,a9){var a8=Math.abs(ba.x-a9.x);var a7=Math.abs(ba.y-a9.y);return Math.round(Math.sqrt(a8*a8+a7*a7))}function a3(a7,a8){var a9=(a8/a7)*1;return a9.toFixed(2)}function an(){if(D<1){return w}else{return c}}function aO(a8,a7){return Math.round(Math.sqrt(Math.pow(a7.x-a8.x,2)+Math.pow(a7.y-a8.y,2)))}function aA(ba,a8){var a7=ba.x-a8.x;var bc=a8.y-ba.y;var a9=Math.atan2(bc,a7);var bb=Math.round(a9*180/Math.PI);if(bb<0){bb=360-Math.abs(bb)}return bb}function aH(a8,a7){var a9=aA(a8,a7);if((a9<=45)&&(a9>=0)){return o}else{if((a9<=360)&&(a9>=315)){return o}else{if((a9>=135)&&(a9<=225)){return n}else{if((a9>45)&&(a9<135)){return v}else{return d}}}}}function ao(){var a7=new Date();return a7.getTime()}function aU(a7){a7=e(a7);var a9=a7.offset();var a8={left:a9.left,right:a9.left+a7.outerWidth(),top:a9.top,bottom:a9.top+a7.outerHeight()};return a8}function B(a7,a8){return(a7.x>a8.left&&a7.x<a8.right&&a7.y>a8.top&&a7.y<a8.bottom)}}})(jQuery);
     
    /**
     * detect support of transitions without modernizr
     * @return {boolean}
     */
    function has3DSupport() {
        var sTranslate3D = "translate3d(0px, 0px, 0px)";

        var eTemp = document.createElement("div");

        eTemp.style.cssText = "  -moz-transform:"    + sTranslate3D +
                              "; -ms-transform:"     + sTranslate3D +
                              "; -o-transform:"      + sTranslate3D +
                              "; -webkit-transform:" + sTranslate3D +
                              "; transform:"         + sTranslate3D;
        var rxTranslate = /translate3d\(0px, 0px, 0px\)/g;
        var asSupport = eTemp.style.cssText.match(rxTranslate);
        return (asSupport !== null && asSupport.length == 1);
    }
    
    
    
    // global
    var $window = $(window);
     
    
    /**
     * Juicy Slider - 3D Image Layer slider with Nivo slider fallback
     * jquery.juicy.js v1.0
     *
     * Copyright 2013, Adamantium Solutions
     * http://www.adamantium.sk
     */ 
    $.Juicy = function(options, element) {
        //this element
        this.$el = $(element);
        this.$wrapper = this.$el.parent('.juicy-wrapper');
        
        // support for css 3d transforms and css transitions
        this.support3d = has3DSupport();
        
        // current image index
        this.current = 0;
                
        this._init(options); 
    };
    
    $.Juicy.defaults = {
        baseWidth: null,
        baseHeight: null,
        effect: 'vertical3D',
        fallback: 'boxRandom',
        slices: 5,
        speed: 500,
        autoplay: true,
        timeout: 5000,
        easing: 'easeOutQuad',
        pauseOnHover: true,
        
        //default layer options
        showLayersAt: 500,
        showLayersEffect: "slide",
        showLayersDirection: "right",
        
        hideLayersAt: 0,
        hideLayersEffect: "slide",
        hideLayersDirection: "left",
        
        debug: false,
        
        //callbacks
        navFormatter: null // function($link, type, $navHolder){ }   
    };
     
    $.Juicy.prototype = {

        _init: function(options) {
            
            // options
            this.options = $.extend(true, {}, $.Juicy.defaults, options);
            this.sliceboxOptions = $.extend(true, {}, $.JuicySlicebox.defaults, options);
            this.nivoOptions = $.extend(true, {}, $.JuicyNivoSlider.defaults, options);
            
            //wrapper is necessary
            if(this.$wrapper.length < 1) {
                logError('please put juicy slider inside a .juicy-wrapper element');
                return false;
            }
            
            // all the items
            this.$items = this.$el.children('li');                
            
            // total number of items
            this.itemsCount = this.$items.length;
            
            // if there's no items return
            if(this.itemsCount === 0) return false;  
            
            // initialize Slicebox slider
            this.slicebox = new $.JuicySlicebox(this.sliceboxOptions, this.$el, this.$items);
            
            // initialize Nivo slider
            this.nivoslider = new $.JuicyNivoSlider(this.nivoOptions, this.$el, this.$items);
            
            this.slicebox.juicy = this; 
            this.nivoslider.juicy = this;
                
            // preload the images
            var self = this;
            this.$el.imagesLoaded(function() {

                // we need to hide the items except first one (current default value)
                var $current = self.$items.eq(self.current).css('display', 'block').addClass('juicy-current');

                // get real size of image
                var i = new Image();
                i.src = $current.find('img').attr('src');
                self.realWidth = i.width;

                // assuming all images with same size
                self._setSize();
                self._initEvents();

                //trigger slider ready event
                self.$el.trigger({
                    type: 'sliderReady',
                    juicy: self
                });

                self.isReady = true; 
                self._debug("images loaded");  //debug
                
                //show first layers
                self._showLayers();
            });
            
            //build navigation elements
            this._buildNavigation();
            
            //resolve selected bullet navigation
            this._resolveNavigation();
            
            //hide layers
            this.$items.each(function(){ 
                $(this)
                    .find("*")
                    .filter(function() {
                        var show = self._processDataToJSON($(this).data('show'));
                        return show.at !== undefined;
                    })
                    .css({ visibility: 'hidden' });
            });

            return true;
        },
        
        _navigate: function(dir, pos) {

            //disable navigation when background is animating
            if(this.slicebox.isAnimating || !this.isReady || this.itemsCount < 2 || this.nivoslider.running || this.current == pos) {
                return false;                                          
            }
            
            this.prev = this.current;
            
            // if position is passed
            if(pos !== undefined) {
                this.current = pos;
            
            // if not check the boundaries
            } else if(dir === 'next') {
                this.current = this.current < this.itemsCount - 1 ? this.current + 1 : 0;

            } else if(dir === 'prev') {
                this.current = this.current > 0 ? this.current - 1 : this.itemsCount - 1;
            }
            
            if(this.$items[this.current] == null) return false;
            
            //resolve selected bullet navigation
            this._resolveNavigation();
            
            //hide progress bar
            this.$progressBar
                .stop(true, false)
                .fadeOut(200);
            
            //get effect for next item from data-change attribute
            var changeEffects = this._processDataToJSON(this.$items.eq(this.current).data('change'), {
                effect: this.options.effect,
                slices: this.options.slices,
                speed: this.options.speed,
                easing: this.options.easing
            });
            
            var self = this;
            
            if($.inArray(changeEffects.effect, ['vertical3D', 'horizontal3D', 'random3D']) !== -1 && !this.support3d) {
                changeEffects.effect = this.options.fallback;   
            } 
            
            //choose slicebox slider to handle animation
            if($.inArray(changeEffects.effect, ['vertical3D', 'horizontal3D', 'random3D']) !== -1) {
                this._hideAllLayers(function(){
                    self._useSlicebox(changeEffects, dir);    
                });                                           
            
            //choose nivo slider for these animations        
            } else {
                if($.inArray(changeEffects.effect, ['sliceDown', 'sliceDownLeft', 'sliceDownRight', 'sliceUp', 'sliceUpRight', 'sliceUpLeft', 'sliceUpDown', 'sliceUpDownRight', 'sliceUpDownLeft', 'fold', 'fade', 'random', 'slideInRight', 'slideInLeft', 'boxRandom', 'boxRain', 'boxRainReverse', 'boxRainGrow', 'boxRainGrowReverse']) === -1) {
                    changeEffects.effect = this.options.fallback;    
                }
                
                this._hideAllLayers(function(){
                    self._useNivo(changeEffects, dir);       
                });                                       
            }

            return true;
        },
        
        _useSlicebox: function(changeEffects, dir) {
            
            this.slicebox.isAnimating = true;
                
            var options = { };
            this.slicebox.changeOptions(this.sliceboxOptions);
            
            //change options of slider accordingly to data change attribute
            options.orientation = changeEffects.effect.substr(0,1);
            options.cuboidsCount = changeEffects.slices;
            options.speed = changeEffects.speed;
            options.easing = changeEffects.easing;
            
            if(options.orientation == 'r') {
                options.cuboidsRandom = true;
                options.maxCuboidsCount = changeEffects.slices;
            } else {
                options.cuboidsRandom = this.sliceboxOptions.cuboidsRandom;
                options.maxCuboidsCount = this.sliceboxOptions.maxCuboidsCount;
            }
            
            //trigger event before slide
            this.$el.trigger({
                type: 'beforeChange',  
                slider: 'slicebox',
                juicy: this
            });
            
            //set busy classes
            this.$el.addClass('juicy-busy juicy-slicebox-animating');

            this.slicebox.changeOptions(options, this.sliceboxOptions);
            this.slicebox.layout(dir);
            this.slicebox.rotate();
        },

        _useNivo: function(changeEffects) {

            this.nivoslider.running = true;

            var options = { }; var ratio;
            this.nivoslider.changeOptions(this.nivoOptions);

            //change options of slider accordingly to data change attribute
            options.effect = changeEffects.effect;
            options.slices = changeEffects.slices;
            options.speed = changeEffects.speed;
            options.easing = changeEffects.easing;

            if(this.size.width > this.size.height) {
                ratio = Math.round(this.size.width / (this.size.height + 0.00001));
                options.boxCols = options.slices;
                options.boxRows = Math.round(options.slices / ratio);

            } else {
                ratio = Math.round(this.size.height / (this.size.width + 0.00001));
                options.boxCols = Math.round(options.slices / ratio);
                options.boxRows = options.slices;
            }

            //trigger event before slide
            this.$el.trigger({
                type: 'beforeChange',
                slider: 'nivoslider',
                juicy: this
            });

            //set busy classes
            this.$el.addClass('juicy-busy juicy-nivo-animating');

            this.nivoslider.changeOptions(options, this.nivoOptions);
            this.nivoslider.nivoRun();
        },

        _showLayers: function() {

            //get layers properties
            this._processLayers();

            var $item = this.$items.eq(this.current);
            if($item.length > 0) {
                var layers = $item.data('layers');

                //get max duration for slide autoplay
                this.autoPlayDuration = this.options.timeout;
                if(this.autoPlayDuration < $item.data('maxDuration')) this.autoPlayDuration = $item.data('maxDuration');

                if(layers !== undefined && layers.length > 0) {

                    //show and hide layers
                    for(var i in layers) {
                        if(layers.hasOwnProperty(i)) {
                            var layer = layers[i];
                            layer.reset();

                            var handlerFunction = function(layer) {
                                layer.showTimeout = setTimeout(function(){ layer.showLayer(); }, layer.show.at || 0);

                                if(layer.hide.at)
                                    layer.hideTimeout = setTimeout(function(){ layer.hideLayer(); }, layer.hide.at);
                            };

                            handlerFunction(layer);
                        }
                    }
                }

                this._toggleTimer(true);
            }
        },

        _toggleTimer: function(reset) {

            //disable timer when background is animating
            if(this.slicebox.isAnimating || this.nivoslider.running || !this.options.autoplay) { return false; }

            if(reset) {
                this.autoPlayProgress = 0;
                this.autoPlayAnimating = false;
                this.$progressBar
                    .stop(true, false)
                    .css({ width: this.autoPlayProgress + '%' })
                    .fadeIn(200);
            }

            if(this.autoPlayAnimating && !this.paused) {
                this.$progressBar.stop(true, false);
                this.autoPlayAnimating = false;

            } else if(!this.paused && !this.hovering) {
                this.autoPlayAnimating = true;

                var self = this;

                this.$progressBar
                    .css({ width: this.autoPlayProgress + '%' })
                    .animate({ width: 100 + '%' }, {
                        duration: this.autoPlayDuration - this.autoPlayProgress / 100 * this.autoPlayDuration,
                        easing: 'linear',
                        step: function(pos) {
                            self.autoPlayProgress = pos;
                        },
                        complete: function() {
                            self.autoPlayProgress = 0;
                            self.autoPlayAnimating = false;

                            self.next();
                        }
                    });
            }

            return true;
        },

        _hideAllLayers: function(callback) {

            var $item = this.$items.eq(this.prev);
            if($item.length > 0) {
                var layers = $item.data('layers');
                var count = 0;

                if(layers !== undefined && layers.length > 0) {

                    this._debug("hiding all layers...");  //debug
                    var self = this;

                    for(var i in layers) {
                        if(layers.hasOwnProperty(i)) {
                            var layer = layers[i];

                            layer.hideLayer(function(){
                                if(++count == layers.length) {
                                    callback.call();
                                    self._debug("...all layers hidden");
                                }
                            });
                        }
                    }
                } else {
                    callback.call();
                }
            }
        },

        _navigationFinished: function() {

            //remove busy classes
            this.$el.removeClass('juicy-busy juicy-nivo-animating juicy-slicebox-animating');
            this._showLayers();
        },
        
        _processDataToJSON: function(data, defaults) {
            var parsedJSON = { };
            
            //change default setings from data attribute
            if(data != null) {
                $(data.split(/\s+/)).each(function(index, item) {
                    var type = item.split(':');
                    if(type.length = 2) parsedJSON[type[0]] = isNaN(type[1]) ? type[1] : parseFloat(type[1]);
                });
            }
            
            return defaults ? $.extend(true, {}, defaults, parsedJSON) : parsedJSON;
        },           
        
        _setSize: function() {

            this.topMargin = 0;
        
            var $visible = this.$items.eq(this.current).find('img.juicy-bg:first');   
            var visibleHeight = $visible.height();   
            var maxHeight = parseFloat(this.$wrapper.css('max-height'));
            
            if(!this.options.baseWidth || !this.options.baseHeight) {
                var $clone = $visible.clone();
                $("body").append($clone);
                
                this.options.baseWidth = $clone.width();
                this.options.baseHeight = $clone.height();
                $clone.remove();
            }
            
            //choose correct height on resize
            var height;
            if(maxHeight) {
                if(maxHeight > visibleHeight) {
                    height = visibleHeight;
                } else {
                    height = maxHeight;
                    this.topMargin = (visibleHeight - maxHeight) / 2;
                }  
            } else {
                height = $visible.height();
            }

            //check if slider canvas can be resized
            if(this.resizeTimeout) clearTimeout(this.resizeTimeout);
            if(this.$el.hasClass('juicy-busy') || height == 0) {
                var self = this;
                this.resizeTimeout = setTimeout(function(){ self._setSize() }, 50);
                return false;
            }

            //center image vertically with margin
            this.$el.css({ height: height });
            $('img.juicy-bg', this.$items).css({ marginTop: -this.topMargin });
            
            this.size = {
                width: $visible.width(),
                height: height,
                widthRatio: $visible.width() / this.options.baseWidth,
                heightRatio: height / this.options.baseHeight
            };  
            
            var $item = this.$items.eq(this.current);
            if($item.length > 0) {
                var layers = $item.data('layers');
                
                if(layers !== undefined && layers.length > 0) {
                    for(var i in layers) if(layers.hasOwnProperty(i)) layers[i].changeSizes();
                }
            }

            return true;
        },
        
        _initEvents: function() {
            var self = this;
            $window.on('resize', function() { self._setSize(); });

            //disable click on image link
            $('a', this.$el)
                .has('.juicy-bg')
                .on('click', function() { 
                    if(!$(this).data('tapped')) return false;
                    else $(this).data('tapped', false);
                    return true;
                });
            
            //mobile swipe events
            this.$el.swipe({
                swipeLeft: function() {
                    self.previous();
                },
                swipeRight: function() {
                    self.next();
                },
                tap: function() {
                    $('a', self.$items[self.current])
                        .has('.juicy-bg')
                        .data('tapped', true);
                }, 
                threshold: 100,
                excludedElements: ".noSwipe",
                triggerOnTouchLeave: true
            });
            
            //bind pause on hover events
            if(this.options.pauseOnHover) {
                this.$el.hover(function(){
                    self.hovering = true;
                    if(!self.paused) self._toggleTimer(false);
                    
                }, function(){
                    self.hovering = false;
                    if(!self.paused) self._toggleTimer(false);
                });
            }
        },
        
        _buildNavigation: function() {
            
            //build progress bar
            this.$progressBar = $('<div />').css({ width: 0 + '%' }); 
            $('<div />')
                .addClass('juicy-progress')
                .append(this.$progressBar)
                .appendTo(this.$wrapper);
            
            this.$navHolders = $('.juicy-slider-nav', this.$wrapper);
            if(this.$navHolders.length < 1) return false;
                 
            var self = this;

            //iterate through all navigation holders
            this.$navHolders.each(function(){
                var $parent = $(this),
                    params = $parent.data('type').split(' '),
                    useNumbers = false;
                
                $(params).each(function(i){  
                    var $link = $('<a href="#" />').addClass(params[i]);
                    var $holder= $('<div />').addClass(params[i]);
                    
                    //choose correct type
                    switch(params[i]) {
                        case 'prev':
                            $link.click(function(){ self.previous(); return false; });
                            break;
                            
                        case 'next':
                            $link.click(function(){ self.next(); return false; });
                            break;
                            
                        case 'play':
                            $link.addClass(self.options.autoplay ? 'juicy-selected' : '');
                            $link.click(function(){ self.play(); return false; });
                            break;
                            
                        case 'pause':
                            $link.click(function(){ self.pause(); return false; });
                            break;
                            
                        case 'play-pause':
                            $link.addClass(self.options.autoplay ? 'playing' : 'paused');
                            $link.click(function(){ self.togglePlayPause(); return false; });
                            break;
                        
                        //load bullets 
                        case 'bullets-nr':   
                            useNumbers = true;
                        case 'bullets':
                            self.$items.each(function(i){
                                var $clone = $link.clone();
                                if(useNumbers) $clone.text(i + 1);
                                
                                $clone
                                    .click(function(){ self.jumpTo(i); return false; })
                                    .attr('class', null);
                                $holder.append($clone);
                            });
                            
                            $link = $holder;
                            break;
                        
                        //load bullets and thumbnails    
                        case 'bullets-nr-thumbs':
                            useNumbers = true;
                        case 'bullets-thumbs':
                        case 'thumbs':
                            self.$items.each(function(i){
                                var url = $('.juicy-bg', this).data('thumb');
                                
                                if(url) {
                                    var $clone = $link.clone();
                                    if(useNumbers) $clone.text(i + 1);
                                    
                                    var $img = $('<img />').attr('src', url);
                                    var $span = $('<span />').append($img);
                                    $clone
                                        .click(function(){ self.jumpTo(i); return false; })
                                        .attr('class', null)
                                        .append($span);
                                        
                                    $holder.append($clone);
                                }
                            });
                            
                            $link = $holder;   
                            break;
                    }
                    
                    //formatter callback
                    if(typeof self.options.navFormatter === 'function') {
                        var formattedLink = self.options.navFormatter($link, params[i], $parent);  
                        if($(formattedLink).length > 0) $link = formattedLink;   
                    }

                    //append nav elements to holder
                    $parent.append($link);
                });
            });

            return true;
        },
        
        _resolveNavigation: function () {
            var self = this;
            
            $('.juicy-slider-nav .bullets, .juicy-slider-nav .bullets-nr, .juicy-slider-nav .thumbs, .juicy-slider-nav .bullets-nr-thumbs, .juicy-slider-nav .bullets-thumbs', this.$wrapper)
                .each(function(){
                    $('a', this).removeClass('juicy-selected');
                    $('a', this).eq(self.current).addClass('juicy-selected');
                });
        },
        
        _processLayers: function() {
            
            this._debug("processing layers..."); //debug
            
            // get current item
            var $item = this.$items.eq(this.current);
            
            if($item.data('layers') !== undefined && $item.data('layers').length > 0) {
                this._debug("...layers are processed");  //debug
                return false;   
            }
            
            var layers = [ ];
            var max = 0;
           
            var self = this;
            
            //find all layers in curent item
            $item
                .find(".juicy-layer")
                .filter(function() {
                    var show = self._processDataToJSON($(this).data('show'));
                    return show.at !== undefined;
                })
                .css({ visibility: 'visible' })
                .each(function(){
                    var $layer = $(this);
                    
                    //get layer show settings
                    var show = self._processDataToJSON($layer.data('show'), {
                        at: self.options.showLayersAt,
                        effect: self.options.showLayersEffect,
                        direction: self.options.showLayersDirection,
                        speed: self.options.speed,
                        easing: self.options.easing
                    });
                    
                    //get layer hide settings
                    var hide = self._processDataToJSON($layer.data('hide'), {
                        at: self.options.hideLayersAt,
                        effect: self.options.hideLayersEffect,
                        direction: self.options.hideLayersDirection,
                        speed: self.options.speed,
                        easing: self.options.easing
                    });
                    
                    //create new juicyLayer
                    var juicyLayer = new $.JuicyLayer(this, self, show, hide);
                    layers.push(juicyLayer);
                    
                    var duration = show.at + show.speed;
                    if(max < duration) max = duration;
                })
                .css({ visibility: 'hidden' });
            
            //max duration to show a layer
            $item.data('maxDuration', max);
            $item.data('layers', layers);
            
            this._debug("...layers processed");  //debug
            return true;
        },
         
        _debug: function(message) {
            if(window.console && this.options.debug) {
                window.console.log(message);
            }                                   
        },
        
        
        /**
        * Public methods
        */
        
        previous: function() {
            this._navigate('prev');
        },
        
        next: function() {
            this._navigate('next');
        },
        
        jumpTo: function(pos) {
            this._navigate(null, pos);
        },
        
        play: function() {
            if(!this.paused) return false;
            
            $('.juicy-slider-nav > .play', this.$wrapper).addClass('juicy-selected');
            $('.juicy-slider-nav > .pause', this.$wrapper).removeClass('juicy-selected');
            $('.juicy-slider-nav > .play-pause', this.$wrapper).removeClass('paused').addClass('playing');
            
            this.autoPlayAnimating = false;  
            this.paused = false;
            this._toggleTimer();
            return true;
        },
        
        pause: function() {
            if(this.paused) return false;
            
            $('.juicy-slider-nav > .play', this.$wrapper).removeClass('juicy-selected');
            $('.juicy-slider-nav > .pause', this.$wrapper).addClass('juicy-selected');
            $('.juicy-slider-nav > .play-pause', this.$wrapper).addClass('paused').removeClass('playing');
            
            this.paused = true;
            this.$progressBar.stop(true, false);
            this.autoPlayAnimating = true;
            return true;
        },
        
        togglePlayPause: function() {
            if(this.paused) this.play();
            else this.pause();
        }
    };
     
    
    $.JuicyLayer = function(element, juicy, show, hide) {
        this.$el = $(element);
        this.juicy = juicy;
        
        this.show = show;
        this.hide = hide;  
        
        this.showTimeout = null;
        this.hideTimeout = null;
        
        this._configureDefaults();
    };

    /**
    * specify values for effects hidden and visible status
    */
    $.JuicyLayer.effects = {
        
        slide: function(layer, direction) {
            var styles = {
                // direction
                left: {
                    // statuses
                    hidden:  { left: -(layer.defaults.outerWidth / layer.juicy.options.baseWidth * 100) + '%' },
                    visible: { left: layer.leftPercent + '%' }
                },
                right: {
                    // statuses
                    hidden:  { left: '100%' },
                    visible: { left: layer.leftPercent + '%' }
                },
                top: {
                    // statuses
                    hidden:  { top: -(layer.defaults.outerHeight / layer.juicy.options.baseHeight * 100) + '%' },
                    visible: { top: layer.topPercent + '%' }
                },
                bottom: {
                    // statuses
                    hidden:  { top: '100%' },
                    visible: { top: layer.topPercent + '%' }
                } 
            };
            
            return styles[direction || 'left'];
        },
        
        shift: function(layer, direction) {
            var styles = {
                // direction
                left: {
                    // statuses
                    hidden:  { left: layer.leftPercent - 10 + '%' },
                    visible: { left: layer.leftPercent + '%' }
                },
                right: {
                    // statuses
                    hidden:  { left: layer.leftPercent + 10 + '%' },
                    visible: { left: layer.leftPercent + '%' }
                },
                top: {
                    // statuses
                    hidden:  { top: layer.topPercent - 10 + '%' },
                    visible: { top: layer.topPercent + '%' }
                },
                bottom: {
                    // statuses
                    hidden:  { top: layer.topPercent + 10 + '%' },
                    visible: { top: layer.topPercent + '%' }
                } 
            };
            
            return styles[direction || 'left'];
        },
        
        roll: function(layer, direction) {
            var styles = {
                // direction
                left: {
                    // statuses
                    hidden:  { rotate: layer.defaults.rotate - 20 + 'deg', scale: layer.defaults.scale },
                    visible: { rotate: layer.defaults.rotate + 'deg', scale: layer.defaults.scale }
                },
                right: {
                    // statuses
                    hidden:  { rotate: layer.defaults.rotate + 20 + 'deg', scale: layer.defaults.scale },
                    visible: { rotate: layer.defaults.rotate + 'deg', scale: layer.defaults.scale }
                }
            };
            
            styles.top = styles.left;
            styles.bottom = styles.right;
            
            return styles[direction || 'left'];
        },
        
        fade: function(layer, direction) {
            var styles = {
                // direction
                left: {
                    // statuses
                    hidden:  { opacity: 0 },
                    visible: { opacity: 1 }
                }
            };
            
            styles.top = styles.bottom = styles.right = styles.left;
            
            return styles[direction || 'left'];
        },
        
        scale: function(layer, direction) {
            var styles = {
                // direction
                left: {
                    // statuses
                    hidden:  { scale: 0, rotate: layer.defaults.rotate + 'deg'  },
                    visible: { scale: 1, rotate: layer.defaults.rotate + 'deg' }
                }
            };
            
            styles.top = styles.bottom = styles.right = styles.left;
            
            return styles[direction || 'left'];
        }
    };
    
    $.JuicyLayer.prototype = {

        _configureDefaults: function() {
            
            var $container = $("<div />")
                .css({
                    width: this.juicy.options.baseWidth,
                    height: this.juicy.options.baseHeight,
                    position: 'absolute'
                });
            
            this.$el.wrap($container);
            
            // get default rotate and scale transformation
            var tr = this.$el.css('-webkit-transform') ||
                     this.$el.css('-moz-transform') ||
                     this.$el.css('-ms-transform') ||
                     this.$el.css('-o-transform') ||
                     this.$el.css('transform') ||
                     false; 

            // rotation matrix - http://en.wikipedia.org/wiki/Rotation_matrix
            if(tr != false && tr != 'none') {
                var values = tr.split('(')[1].split(')')[0].split(',');
                var a = values[0];
                var b = values[1];
                //var c = values[2];
                //var d = values[3];

                var scale = Math.round(Math.sqrt(a * a + b * b) * 100) / 100;
                var angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
            }
            
            //set defaults
            this.defaults = {
                width: this.$el.width(),   
                height: this.$el.height(),
                outerWidth: this.$el.outerWidth(),   
                outerHeight: this.$el.outerHeight(),
                fontSize: parseInt(this.$el.css('font-size')), 
                lineHeight: parseInt(this.$el.css('line-height')),
                scale: scale || 1,
                rotate: angle || 0
            };  
            
            this.properties = [
                'margin-left', 'margin-right', 'margin-top', 'margin-bottom',
                'padding-left', 'padding-right', 'padding-top', 'padding-bottom', 
                'border-left-width', 'border-right-width', 'border-top-width', 'border-bottom-width'
            ]; 
            
            for (var i in this.properties) {
                if(this.properties.hasOwnProperty(i)) {
                    this.defaults[this.properties[i]] = parseInt(this.$el.css(this.properties[i]));
                }
            }

            var left = parseInt(this.$el.css('left')) || this.$el.position().left;
            var top = parseInt(this.$el.css('top')) || this.$el.position().top;
            
            this.leftPercent = left / this.juicy.options.baseWidth * 100;
            this.topPercent = top / this.juicy.options.baseHeight * 100; 
            
            this.$el.unwrap();
            $container.remove();
            
            this.$el.css({
                left: this.leftPercent + '%',
                top: this.topPercent + '%'
            });
            
            this.changeSizes();  
        },
        
        _calculateWithRatio: function(value, ratio) {
            return ratio > 1 ? value :  value * ratio
        },
        
        _combineStyles: function(styles, direction) {
            
            var self = this;
            var animationStyles = { hidden: { }, visible: { } };
            var found = false;
            
            $(styles.split('-')).each(function(){
                if($.JuicyLayer.effects.hasOwnProperty(this)) {
                    found = true;
                    
                    var effects = $.JuicyLayer.effects[this](self, direction);
                    animationStyles = $.extend(true, {}, animationStyles, effects);      
                }                                                                        
            });
            
            return found ? animationStyles : false;
        },
        
        reset: function() {
            var animationStyles = this._combineStyles(this.show.effect, this.show.direction);
            this.$el
                .stop(true, true)
                .css(animationStyles['hidden']);
                
            this.isVisible = false;  
            
            if(this.showTimeout != null) clearTimeout(this.showTimeout);
            if(this.hideTimeout != null) clearTimeout(this.hideTimeout);
        },
        
        changeSizes: function() {
            
            this.sizes = {
                width: this._calculateWithRatio(this.defaults.width, this.juicy.size.widthRatio),
                height: this._calculateWithRatio(this.defaults.height, this.juicy.size.heightRatio),
                fontSize: Math.floor(this._calculateWithRatio(this.defaults.fontSize, this.juicy.size.widthRatio)) + 'px', 
                lineHeight: Math.floor(this._calculateWithRatio(this.defaults.lineHeight, this.juicy.size.widthRatio)) + 'px'
            };
            
            for (var i in this.properties) {
                if(this.properties.hasOwnProperty(i)) {
                    this.sizes[this.properties[i]] = this._calculateWithRatio(this.defaults[this.properties[i]], this.juicy.size.widthRatio) + 'px';
                }
            }

            this.$el.css(this.sizes);
        },
        
        //TODO put in one function
        showLayer: function(callback) {
            
            if(!this.show.effect) {
                if(typeof callback === 'function') callback.call();
                return false;  
            } 
            
            var animationStyles = this._combineStyles(this.show.effect, this.show.direction);
            
            if(!animationStyles) {
                if(typeof callback === 'function') callback.call();
                return false;
            }
            
            this.$el
                .stop(true, true)
                .css(animationStyles['hidden'])
                .css({ visibility: 'visible' });
            
            this.isVisible = true;
            
            this.$el
                .stop(true, true)
                .transition(animationStyles['visible'], this.show.speed, this.show.easing, function(){
                    if(typeof callback === 'function') callback.call();
                });
            return true;
        },
        
        hideLayer: function(callback) {  
            
            if(!this.hide.effect || !this.isVisible) {
                if(typeof callback === 'function') callback.call();
                return false;
            }
            
            //clear timeout
            if(this.showTimeout != null) clearTimeout(this.showTimeout);
            
            var animationStyles = this._combineStyles(this.hide.effect, this.hide.direction);
            
            if(!animationStyles) {
                if(typeof callback === 'function') callback.call();
                return false;
            }
            
            this.$el
                .stop(true, true)
                .css(animationStyles['visible']);
            
            var self = this;
            this.$el
                .stop(true, true)
                .transition(animationStyles['hidden'], this.hide.speed, this.hide.easing, function(){
                    $(this).css({ visibility : 'hidden' });
                    $(this).css(animationStyles['visible']);
                    
                    self.isVisible = false;
                    if(typeof callback === 'function') callback.call();
                });
            return true;
        }
    }; 
        
    
    
    
    
    
    /**
     * jquery.slicebox.js v1.1.0
     * http://www.codrops.com
     *
     * Licensed under the MIT license.
     * http://www.opensource.org/licenses/mit-license.php
     * 
     * Copyright 2012, Codrops
     * http://www.codrops.com
     */    
     
    $.JuicySlicebox = function(options, element, items) {
        this.$el = element;
        this._init(options, items);
    };    
        
    $.JuicySlicebox.defaults = {
        // (v)ertical, (h)orizontal or (r)andom
        orientation: 'v',
        // perspective value
        perspective: 1200,
        // number of slices / cuboids
        // needs to be an odd number 15 => number > 0 (if you want the limit higher, change the _validate function).
        cuboidsCount: 5,
        // if true then the number of slices / cuboids is going to be random (cuboidsCount is overwitten)
        cuboidsRandom: false,
        // the range of possible number of cuboids if cuboidsRandom is true
        // it is strongly recommended that you do not set a very large number :)
        maxCuboidsCount: 5,
        // each cuboid will move x pixels left / top (depending on orientation). The middle cuboid doesn't move. the middle cuboid's neighbors will move disperseFactor pixels
        disperseFactor: 0,
        // color of the hidden sides
        colorHiddenSides: '#222',
        // the animation will start from left to right. The left most cuboid will be the first one to rotate
        // this is the interval between each rotation in ms
        sequentialFactor: 150,
        // animation speed
        // this is the speed that takes "1" cuboid to rotate
        speed: 600,
        // transition easing
        easing: 'swing'
    };

    $.JuicySlicebox.prototype = {

        _init: function(options, items) {
            
            // options
            this.options = $.extend(true, {}, $.JuicySlicebox.defaults, options);
            this._validate();

            // all the items
            this.$items = items;
            
            // total number of items
            this.itemsCount = this.$items.length;
            
            // if there's no items return
            if(this.itemsCount === 0) return false;           

            // control if the slicebox is animating
            this.isAnimating = false;
            return true;
        },
        
        _validate: function() {

            if(this.options.cuboidsCount < 0){
                this.options.cuboidsCount = 1;
                
            } else if(this.options.cuboidsCount > 12) { 
                this.options.cuboidsCount = 12;

            } else if(this.options.cuboidsCount %2 === 0) {
                ++this.options.cuboidsCount;
            }
            
            if(this.options.maxCuboidsCount < 0){          
                this.options.maxCuboidsCount = 1;

            } else if(this.options.maxCuboidsCount > 12) { 
                this.options.maxCuboidsCount = 12;

            } else if(this.options.maxCuboidsCount %2 === 0) {
                ++this.options.maxCuboidsCount;
            }
            
            if(this.options.disperseFactor < 0) {             
                this.options.disperseFactor = 0;                
            }
            
            if(this.options.orientation !== 'v' && this.options.orientation !== 'h' && this.options.orientation !== 'r') {
                this.options.orientation = 'v';                                                                             
            }
        }, 
        
        // after finished animation
        _finished: function() {
            this.$el.css('overflow', 'hidden');
            this.isAnimating = false;
            this.$box.remove();
            
            var $current = this.$items.eq(this.juicy.current);
            $current.css('display', 'block'); // show() makes it inline style
            
            setTimeout(function() {
                $current.addClass('juicy-current');
            }, 0);
            
            //trigger event after slide
            this.$el.trigger({
                type: 'afterChange',
                slider: 'slicebox',
                juicy: this.juicy
            }); 
            
            this.juicy._navigationFinished();
        },
        
        layout: function(dir) {

            var orientation = this.options.orientation;

            if(orientation === 'r') {  
                orientation = Math.floor(Math.random() * 2) === 0 ? 'v' : 'h';   
            }

            if(this.options.cuboidsRandom) {
                this.options.cuboidsCount = Math.floor(Math.random() * this.options.maxCuboidsCount + 1);  
            }
            
            this._validate();
            
            var boxStyle = {
                    'width': this.juicy.size.width,
                    'height': this.juicy.size.height,
                    'perspective': this.options.perspective + 'px'
                },
                config = $.extend(this.options, {
                    size: this.juicy.size,
                    items: this.$items,
                    direction: dir,
                    prev: this.juicy.prev,
                    current: this.juicy.current,
                    topMargin: this.juicy.topMargin,
                    o: orientation
                });

            this.$box = $('<div>').addClass('juicy-perspective').css(boxStyle).appendTo(this.$el);  
            this.cuboids = [];            
            this.$el.css('overflow', 'visible');

            for(var i = 0; i < this.options.cuboidsCount; ++i) {   
                var cuboid = new $.JuicySliceboxCuboid(config, i);                  
                this.$box.append(cuboid.getEl());   
                this.cuboids.push(cuboid);  
            }     
        },
        
        rotate: function() {
            // hide current item
            this.$items.eq(this.juicy.prev).removeClass('juicy-current').hide();

            var self = this;
            for(var i = 0; i < this.options.cuboidsCount; ++i) {
                var cuboid = this.cuboids[i];

                cuboid.rotate(function(pos) {
                    if(pos === self.options.cuboidsCount - 1) {
                        self._finished();       
                    }
                }); 
            }  
        },
        
        changeOptions: function(options, defaults) {
            // options
            this.options = $.extend(true, {}, defaults, options);
            this._validate();   
        }                      
    };

    $.JuicySliceboxCuboid = function(config, pos) {
        this.config = config;
        this.pos = pos;
        this.side = 1;
        this._setSize();
        this._configureStyles(); 
    };

    $.JuicySliceboxCuboid.prototype = {

        _setSize: function() {
            this.size = {
                width: this.config.o === 'v' ? Math.floor(this.config.size.width / this.config.cuboidsCount) : this.config.size.width,
                height: this.config.o === 'v' ? this.config.size.height : Math.floor(this.config.size.height / this.config.cuboidsCount)
            };
            // extra space to fix gaps
            this.extra = this.config.o === 'v' ? this.config.size.width - (this.size.width * this.config.cuboidsCount) : this.config.size.height - (this.size.height * this.config.cuboidsCount);
        },
        
        _configureStyles: function() {

            // style for the cuboid element
            // set z-indexes based on the cuboid's position
            var middlepos = Math.ceil(this.config.cuboidsCount / 2),
                positionStyle = this.pos < middlepos ? {
                    zIndex : (this.pos + 1) * 100,
                    left : (this.config.o === 'v') ? this.size.width * this.pos : 0,
                    top : (this.config.o === 'v') ? 0 : this.size.height * this.pos
                }: {
                    zIndex : (this.config.cuboidsCount - this.pos) * 100,
                    left : (this.config.o === 'v') ? this.size.width * this.pos : 0,
                    top : (this.config.o === 'v') ? 0 : this.size.height * this.pos
                };

            // how much this cuboid is going to move (left or top values)
            this.disperseFactor = this.config.disperseFactor * ( ( this.pos + 1 ) - middlepos );
             
            var easing = $.cssEase[this.config.easing] ? $.cssEase[this.config.easing] : this.config.easing ;
            this.style = $.extend({
                '-webkit-transition': '-webkit-transform ' + this.config.speed + 'ms ' + easing,
                '-moz-transition': '-moz-transform ' + this.config.speed + 'ms ' + easing,
                '-o-transition': '-o-transform ' + this.config.speed + 'ms ' + easing,
                '-ms-transition': '-ms-transform ' + this.config.speed + 'ms ' + easing,
                'transition': 'transform ' + this.config.speed + 'ms ' + easing
            }, positionStyle, this.size);
            
            this.animationStyles = {
                side1 : (this.config.o === 'v') ? {'transform': 'translate3d(0, 0, -' + (this.size.height / 2) + 'px)'} : {'transform': 'translate3d(0, 0, -' + (this.size.width / 2) + 'px)'},
                side2 : (this.config.o === 'v') ? {'transform': 'translate3d(0, 0, -' + (this.size.height / 2) + 'px) rotate3d(1, 0, 0, -90deg)'} : {'transform' : 'translate3d(0, 0, -' + (this.size.width / 2) + 'px ) rotate3d(0, 1, 0, -90deg)'},
                side3 : (this.config.o === 'v') ? {'transform': 'translate3d(0, 0, -' + (this.size.height / 2) + 'px) rotate3d(1, 0, 0, -180deg)'} : {'transform' : 'translate3d(0, 0, -' + (this.size.width / 2) + 'px ) rotate3d(0, 1, 0, -180deg)'},
                side4 : (this.config.o === 'v') ? {'transform': 'translate3d(0, 0, -' + (this.size.height / 2) + 'px) rotate3d(1, 0, 0, -270deg)'} : {'transform' : 'translate3d(0, 0, -' + (this.size.width / 2) + 'px ) rotate3d(0, 1, 0, -270deg)'}
            };

            var measure = (this.config.o === 'v') ? this.size.height : this.size.width;

            this.sidesStyles = {
                frontSideStyle : {
                    width : (this.config.o === 'v') ? this.size.width + this.extra : this.size.width,
                    height : (this.config.o === 'v') ? this.size.height : this.size.height + this.extra,
                    backgroundColor : this.config.colorHiddenSides,
                    transform : 'rotate3d(0, 1, 0, 0deg) translate3d(0, 0, ' + (measure / 2) + 'px)'
                },
                backSideStyle : {
                    width : this.size.width,
                    height : this.size.height,
                    backgroundColor : this.config.colorHiddenSides,
                    transform : 'rotate3d(0, 1, 0, 180deg ) translate3d(0, 0, ' + (measure / 2) + 'px) rotateZ(180deg)'
                },
                rightSideStyle : {
                    width : measure,
                    height : (this.config.o === 'v') ? this.size.height : this.size.height + this.extra,
                    left : (this.config.o === 'v') ? this.size.width / 2 - this.size.height / 2 : 0,
                    backgroundColor : this.config.colorHiddenSides,
                    transform : 'rotate3d(0, 1, 0, 90deg) translate3d(0, 0, ' + (this.size.width / 2) + 'px)'
                },
                leftSideStyle : {
                    width : measure,
                    height : ( this.config.o === 'v' ) ? this.size.height : this.size.height + this.extra,
                    left : ( this.config.o === 'v' ) ? this.size.width / 2 - this.size.height / 2  : 0,
                    backgroundColor : this.config.colorHiddenSides,
                    transform : 'rotate3d(0, 1, 0, -90deg) translate3d(0, 0, ' + (this.size.width / 2) + 'px)'
                },
                topSideStyle : {
                    width : (this.config.o === 'v') ? this.size.width + this.extra : this.size.width,
                    height : measure,
                    top : (this.config.o === 'v') ? 0 : this.size.height / 2 - this.size.width / 2,
                    backgroundColor : this.config.colorHiddenSides,
                    transform : 'rotate3d(1, 0, 0, 90deg ) translate3d( 0, 0, ' + (this.size.height / 2) + 'px)'
                },
                bottomSideStyle : {
                    width : (this.config.o === 'v') ? this.size.width + this.extra : this.size.width,
                    height : measure,
                    top : (this.config.o === 'v') ? 0 : this.size.height / 2 - this.size.width / 2,
                    backgroundColor : this.config.colorHiddenSides,
                    transform : 'rotate3d(1, 0, 0, -90deg) translate3d(0, 0, ' + (this.size.height / 2) + 'px)'
                }
            };
        },
        
        _showImage: function(imgPos) {

            var sideIdx,
                $item = this.config.items.eq(imgPos),  
                imgParam = {
                    'background-size': this.config.size.width + 'px auto'
                };

            imgParam.backgroundImage = 'url(' + $item.find('img.juicy-bg').attr('src') + ')';
            
            switch(this.side) {                              
                case 1: sideIdx = 0; break;
                case 2: sideIdx = (this.config.o === 'v') ? 4 : 2; break;
                case 3: sideIdx = 1; break;
                case 4: sideIdx = (this.config.o === 'v') ? 5 : 3; break;
            }
            
            var top = (this.config.o === 'v') ? 0 : -(this.pos * this.size.height);
            if(this.config.topMargin) top -= this.config.topMargin;
            
            imgParam.backgroundPosition = (this.config.o === 'v') ? - (this.pos * this.size.width) + 'px ' + top + 'px' : '0px ' + top + 'px';
            this.$el.children().eq(sideIdx).css(imgParam);        
        },
        
        getEl: function() { 
            this.$el = $('<div/>').css( this.style)
                    .css(this.animationStyles.side1)
                    .append($('<div/>').addClass('juicy-side').css(this.sidesStyles.frontSideStyle))
                    .append($('<div/>').addClass('juicy-side').css(this.sidesStyles.backSideStyle))
                    .append($('<div/>').addClass('juicy-side').css(this.sidesStyles.rightSideStyle))
                    .append($('<div/>').addClass('juicy-side').css(this.sidesStyles.leftSideStyle))
                    .append($('<div/>').addClass('juicy-side').css(this.sidesStyles.topSideStyle))
                    .append($('<div/>').addClass('juicy-side').css(this.sidesStyles.bottomSideStyle));
            
            this._showImage(this.config.prev); 
            return this.$el;  
        },
        
        rotate: function(callback) {

            var self = this, animationStyle;

            setTimeout(function() {
                
                if(self.config.direction === 'next') {     
                    switch(self.side) {
                        case 1: animationStyle = self.animationStyles.side2; self.side = 2; break;
                        case 2: animationStyle = self.animationStyles.side3; self.side = 3; break;
                        case 3: animationStyle = self.animationStyles.side4; self.side = 4; break;
                        case 4: animationStyle = self.animationStyles.side1; self.side = 1; break;
                    }
                } else {   
                    switch(self.side) {
                        case 1: animationStyle = self.animationStyles.side4; self.side = 4; break;
                        case 2: animationStyle = self.animationStyles.side1; self.side = 1; break;
                        case 3: animationStyle = self.animationStyles.side2; self.side = 2; break;
                        case 4: animationStyle = self.animationStyles.side3; self.side = 3; break;
                    }
                }

                self._showImage(self.config.current);
                
                var animateOut = {}, animateIn = {};
                
                if(self.config.o === 'v') {
                    animateOut.left = '+=' + self.disperseFactor + 'px';
                    animateIn.left = '-=' + self.disperseFactor + 'px';  
                } else if(self.config.o === 'h') {
                    animateOut.top = '+=' + self.disperseFactor + 'px';
                    animateIn.top = '-=' + self.disperseFactor + 'px'; 
                }
                
                self.$el.css(animationStyle).animate(animateOut, self.config.speed / 2).animate(animateIn, self.config.speed / 2, function() {
                    if(callback) {
                        callback.call(self, self.pos);   
                    }         
                });

            }, this.config.sequentialFactor * this.pos + 30 );   
        }  
    };
    
    
    
    
    
    /*
     * jQuery Nivo Slider v3.2
     * http://nivo.dev7studios.com
     *
     * Copyright 2012, Dev7studios
     * Free to use and abuse under the MIT license.
     * http://www.opensource.org/licenses/mit-license.php
     */

    $.JuicyNivoSlider = function(options, element, items) {
        this.$el = $(element);
        this._init(options, items);
    };
    
    $.JuicyNivoSlider.defaults = {
        effect: 'random',
        slices: 15,
        boxCols: 8,
        boxRows: 4,
        speed: 500,
        easing: 'swing'
    }; 
    
    $.JuicyNivoSlider.prototype = {
        
        _init: function (options, items) {
            
            // Defaults are below
            this.settings = $.extend({}, $.JuicyNivoSlider.defaults, options);

            // Useful variables. Play carefully.
            this.running = false;
            
            this.$items = $(items);
        },
        
        // Add slices for slice animations
        _createSlices: function() {
            
            var $item = this.$items.eq(this.juicy.current);
            
            for(var i = 0; i < this.settings.slices; i++){
                var sliceWidth = Math.round(this.juicy.size.width / this.settings.slices);
                
                if(i === this.settings.slices - 1){
                    this.$el.append(
                        $('<div class="juicy-slice" name="' + i + '"><img src="' + $item.find('img.juicy-bg').attr('src') + '" style="position:absolute; width:' + this.juicy.size.width + 'px; height:auto; display:block !important; top:0; left:-' + ((sliceWidth + (i * sliceWidth)) - sliceWidth) + 'px;" /></div>').css({ 
                            left: sliceWidth * i, 
                            width: this.juicy.size.width - sliceWidth * i,
                            height: this.juicy.size.height, 
                            opacity: 0,
                            overflow: 'hidden'
                        })
                    );
                } else {
                    this.$el.append(
                        $('<div class="juicy-slice" name="' + i + '"><img src="' + $item.find('img.juicy-bg').attr('src') + '" style="position:absolute; width:' + this.juicy.size.width + 'px; height:auto; display:block !important; top:0; left:-' + ((sliceWidth + (i * sliceWidth)) - sliceWidth) + 'px;" /></div>').css({ 
                            left: sliceWidth * i, 
                            width: sliceWidth,
                            height: this.juicy.size.height,
                            opacity: 0,
                            overflow: 'hidden'
                        })
                    );
                }
            }
            
            if(this.juicy.topMargin) $('img:first', $('.juicy-slice', this.$el)).css({ marginTop: -this.juicy.topMargin });  
        },
        
        // Add boxes for box animations
        _createBoxes: function(){
            
            var $item = this.$items.eq(this.juicy.current);
            
            var boxWidth = Math.round(this.juicy.size.width / this.settings.boxCols),
                boxHeight = Math.round(this.juicy.size.height / this.settings.boxRows);
            
            for(var rows = 0; rows < this.settings.boxRows; rows++){
                for(var cols = 0; cols < this.settings.boxCols; cols++){
                    if(cols === this.settings.boxCols - 1){
                        this.$el.append(
                            $('<div class="juicy-box" name="' + cols + '" rel="' + rows + '"><img src="' + $item.find('img.juicy-bg').attr('src') + '" style="position:absolute; width:' + this.juicy.size.width + 'px; height:auto; display:block; top:-' + (boxHeight * rows) + 'px; left:-' + (boxWidth*cols) + 'px;" /></div>').css({ 
                                opacity: 0,
                                left: boxWidth * cols, 
                                top: boxHeight * rows,
                                height: boxHeight,
                                width: this.juicy.size.width - boxWidth * cols   
                            })
                        );
                        
                    } else {
                        this.$el.append(
                            $('<div class="juicy-box" name="' + cols + '" rel="' + rows + '"><img src="' + $item.find('img.juicy-bg').attr('src') + '" style="position:absolute; width:' + this.juicy.size.width + 'px; height:auto; display:block; top:-' + (boxHeight * rows) + 'px; left:-' + (boxWidth*cols) + 'px;" /></div>').css({ 
                                opacity: 0,
                                left: boxWidth * cols, 
                                top: boxHeight * rows,
                                width: boxWidth,
                                height: boxHeight
                            })
                        );
                    }
                }
            }
            
            if(this.juicy.topMargin) $('img:first', $('.juicy-box', this.$el)).css({ marginTop: -this.juicy.topMargin });  
        },  
        
        //shuffles an array
        _shuffle: function(arr){
            for(var j, x, i = arr.length; i; j = parseInt(Math.random() * i, 10), x = arr[--i], arr[i] = arr[j], arr[j] = x);
            return arr;
        },
          
        // after finished animation
        _finished: function() {
            this.running = false; 
                
            this.$items.eq(this.juicy.prev).removeClass('juicy-current').hide();
            this.$items.eq(this.juicy.current).addClass('juicy-current').css('display', 'block');
            
            // Remove any slices from last transition
            $('.juicy-slice', this.$el).remove();
            
            // Remove any boxes from last transition
            $('.juicy-box', this.$el).remove();
            
            //trigger event after slide
            this.$el.trigger({
                type: 'afterChange',
                slider: 'nivoslider',
                juicy: this.juicy
            }); 
            
            this.juicy._navigationFinished();   
        },
        
        // Public run method
        nivoRun: function(){          
            
            var self = this;
            
            var currentEffect = this.settings.effect,
                anims = '';
                
            // Generate random effect
            if(this.settings.effect === 'random'){
                anims = ['sliceDown', 'sliceDownLeft', 'sliceDownRight', 'sliceUp', 'sliceUpRight', 'sliceUpLeft', 'sliceUpDown', 'sliceUpDownRight', 'sliceUpDownLeft', 'fold', 'fade', 'slideInRight', 'slideInLeft', 'boxRandom', 'boxRain', 'boxRainReverse', 'boxRainGrow', 'boxRainGrowReverse'];
                
                currentEffect = anims[Math.floor(Math.random() * (anims.length + 1))];
                if(currentEffect === undefined) { currentEffect = 'fade'; }
            }
            
            // Run random effect from specified set (eg: effect:'fold,fade')
            if(this.settings.effect.indexOf(',') !== -1){
                anims = this.settings.effect.split(',');
                
                currentEffect = anims[Math.floor(Math.random() * (anims.length))];
                if(currentEffect === undefined) { currentEffect = 'fade'; }
            }
            var timeBuff = 0,
                i = 0,
                slices = '',
                firstSlice = '',
                totalBoxes = '',
                boxes = '';
            
            // sliceDown, sliceDownRight, sliceDownLeft
            if(currentEffect === 'sliceDown' || currentEffect === 'sliceDownRight' || currentEffect === 'sliceDownLeft') {
                
                this._createSlices();
                timeBuff = 0;
                i = 0;
                
                slices = $('.juicy-slice', this.$el);
                if(currentEffect === 'sliceDownLeft') { slices = $('.juicy-slice', this.$el)._reverse(); }
                
                slices.each(function(){
                    var slice = $(this);
                    var origHeight = slice.height();
                    slice.css({ top: 0, height: 0 });
                    
                    if(i === self.settings.slices - 1){
                        setTimeout(function(){
                            slice.transition({ opacity: 1, height: origHeight }, self.settings.speed, self.settings.easing, function(){ self._finished(); });
                        }, (100 + timeBuff));
                        
                    } else {
                        setTimeout(function(){
                            slice.transition({ opacity: 1, height: origHeight }, self.settings.speed, self.settings.easing);
                        }, (100 + timeBuff));
                    }
                    timeBuff += 50;
                    i++;
                });
            
            // sliceUp, sliceUpRight, sliceUpLeft    
            } else if(currentEffect === 'sliceUp' || currentEffect === 'sliceUpRight' || currentEffect === 'sliceUpLeft') {
                
                this._createSlices();
                timeBuff = 0;
                i = 0;
                
                slices = $('.juicy-slice', this.$el);
                if(currentEffect === 'sliceUpLeft') { slices = $('.juicy-slice', this.$el)._reverse(); }
                
                slices.each(function(){
                    var slice = $(this);  
                    slice.css({ bottom: 0, top: '100%' });
                    
                    if(i === self.settings.slices - 1){
                        setTimeout(function(){
                            slice.transition({ opacity: 1, top: '0%' }, self.settings.speed, self.settings.easing, function(){ self._finished(); });
                        }, (100 + timeBuff));
                        
                    } else {
                        setTimeout(function(){
                            slice.transition({ opacity: 1, top: '0%' }, self.settings.speed, self.settings.easing);
                        }, (100 + timeBuff));
                    }
                    timeBuff += 50;
                    i++;
                });
             
            // sliceUpDown, sliceUpDownRight, sliceUpDownLeft
            } else if(currentEffect === 'sliceUpDown' || currentEffect === 'sliceUpDownRight' || currentEffect === 'sliceUpDownLeft'){
                
                this._createSlices();
                timeBuff = 0;
                i = 0;
                var v = 0;
                
                slices = $('.juicy-slice', this.$el);
                if(currentEffect === 'sliceUpDownLeft') { slices = $('.juicy-slice', this.$el)._reverse(); }
                
                slices.each(function(){
                    var slice = $(this), origHeight = slice.height(), animate;
                    if(i === 0){
                        slice.css({ top: 0, height: 0 });
                        animate = { opacity: 1, height: origHeight };
                        i++;
                    } else {
                        slice.css({ bottom: 0, top: '100%' });
                        animate = { opacity: 1, top: '0%' };
                        i = 0;
                    }
                    
                    if(v === self.settings.slices-1){
                        setTimeout(function(){
                            slice.transition(animate, self.settings.speed, self.settings.easing, function(){ self._finished(); });
                        }, (100 + timeBuff));
                        
                    } else {
                        setTimeout(function(){
                            slice.transition(animate, self.settings.speed, self.settings.easing);
                        }, (100 + timeBuff));
                    }
                    timeBuff += 50;
                    v++;
                });
             
            // fold   
            } else if(currentEffect === 'fold'){
                
                this._createSlices();
                timeBuff = 0;
                i = 0;
                
                $('.juicy-slice', this.$el).each(function(){
                    var slice = $(this);
                    var origWidth = slice.width();
                    slice.css({ top: 0, width: 0 });
                    
                    if(i === self.settings.slices - 1){
                        setTimeout(function(){
                            slice.transition({ width: origWidth, opacity: 1 }, self.settings.speed, self.settings.easing, function(){ self._finished(); });
                        }, (100 + timeBuff));
                        
                    } else {
                        setTimeout(function(){
                            slice.transition({ width: origWidth, opacity: 1 }, self.settings.speed, self.settings.easing);
                        }, (100 + timeBuff));
                    }
                    timeBuff += 50;
                    i++;
                });
           
            // fade        
            } else if(currentEffect === 'fade'){
                this._createSlices();
                
                firstSlice = $('.juicy-slice:first', this.$el);
                firstSlice.css({
                    width: this.juicy.size.width
                });
    
                firstSlice.transition({ opacity: 1 }, (this.settings.speed * 2), self.settings.easing, function(){ self._finished(); });
            
            // slideInRight            
            } else if(currentEffect === 'slideInRight'){
                this._createSlices();
                
                firstSlice = $('.juicy-slice:first', this.$el);
                firstSlice.css({
                    width: 0,
                    opacity: 1
                });

                firstSlice.transition({ width: this.juicy.size.width }, (this.settings.speed * 2), self.settings.easing, function(){ self._finished(); });
            
            // slideInLeft        
            } else if(currentEffect === 'slideInLeft'){
                this._createSlices();
                
                firstSlice = $('.juicy-slice:first', this.$el);
                firstSlice.css({
                    width: 0,
                    opacity: 1,
                    left: '',
                    right: 0
                });

                firstSlice.transition({ width: this.juicy.size.width }, (this.settings.speed * 2), self.settings.easing, function(){ 
                    // Reset positioning
                    firstSlice.css({
                        left: 0,
                        right: ''
                    });
                    self._finished(); 
                });
            
            // boxRandom            
            } else if(currentEffect === 'boxRandom'){
                this._createBoxes();
                
                totalBoxes = this.settings.boxCols * this.settings.boxRows;
                i = 0;
                timeBuff = 0;

                boxes = this._shuffle($('.juicy-box', this.$el));
                boxes.each(function(){
                    var box = $(this);
                    if(i === totalBoxes - 1){
                        setTimeout(function(){
                            box.transition({ opacity: 1 }, self.settings.speed, self.settings.easing, function(){ self._finished(); });
                        }, (100 + timeBuff));
                        
                    } else {
                        setTimeout(function(){
                            box.transition({ opacity: 1 }, self.settings.speed, self.settings.easing);
                        }, (100 + timeBuff));
                    }
                    timeBuff += 10;     
                    i++;
                });
             
            // boxRain, boxRainReverse, boxRainGrow, boxRainGrowReverse              
            } else if(currentEffect === 'boxRain' || currentEffect === 'boxRainReverse' || currentEffect === 'boxRainGrow' || currentEffect === 'boxRainGrowReverse'){
                this._createBoxes();
                
                totalBoxes = this.settings.boxCols * this.settings.boxRows;
                i = 0;
                timeBuff = 0;
                
                // Split boxes into 2D array
                var rowIndex = 0;
                var colIndex = 0;
                var box2Darr = [];
                box2Darr[rowIndex] = [];
                boxes = $('.juicy-box', this.$el);
                if(currentEffect === 'boxRainReverse' || currentEffect === 'boxRainGrowReverse'){
                    boxes = $('.juicy-box', this.$el)._reverse();
                }
                boxes.each(function(){
                    box2Darr[rowIndex][colIndex] = $(this);
                    colIndex++;
                    if(colIndex === self.settings.boxCols){
                        rowIndex++;
                        colIndex = 0;
                        box2Darr[rowIndex] = [];
                    }
                });
                
                // Run animation
                for(var cols = 0; cols < (this.settings.boxCols * 2); cols++){
                    var prevCol = cols;
                    for(var rows = 0; rows < this.settings.boxRows; rows++){
                        if(prevCol >= 0 && prevCol < this.settings.boxCols){
                            /* Due to some weird JS bug with loop vars 
                            being used in setTimeout, this is wrapped
                            with an anonymous function call */
                            (function(row, col, time, i, totalBoxes) {
                                var box = $(box2Darr[row][col]);
                                var w = box.width();
                                var h = box.height();
                                if(currentEffect === 'boxRainGrow' || currentEffect === 'boxRainGrowReverse'){
                                    box.width(0).height(0);
                                }
                                if(i === totalBoxes - 1){
                                    setTimeout(function(){
                                        box.transition({ opacity: 1, width: w, height: h }, self.settings.speed / 1.3, self.settings.easing, function(){ self._finished(); });
                                    }, (100 + time));
                                } else {
                                    setTimeout(function(){
                                        box.transition({ opacity: 1, width: w, height: h }, self.settings.speed / 1.3, self.settings.easing);
                                    }, (100 + time));
                                }
                            })(rows, prevCol, timeBuff, i, totalBoxes);
                            i++;
                        }
                        prevCol--;
                    }
                    timeBuff += 50;
                }
            }           
        },
        
        //change options on the fly
        changeOptions: function(options, defaults) {
            // options
            this.settings = $.extend(true, {}, defaults, options);
        }
    };

    $.fn._reverse = [].reverse;
    
    
    
    
        
        
        
    var logError = function(message) {
        if(window.console) {
            window.console.error(message);
        }                                   
    };
    
    $.fn.juicy = function(options) { 
        this.each(function() {
            var self = $.data(this, 'juicy');
            
            if(typeof options === 'string') {
                var args = Array.prototype.slice.call(arguments, 1);
                
                if(!self) {
                    logError('cannot call methods on juicy slider prior to initialization; ' +
                    'attempted to call method ' + options);
                    return;               
                }
                
                if(!$.isFunction(self[options]) || options.charAt(0) === '_') {
                    logError('no such method ' + options + ' for juicy slider self');
                    return;                                                     
                }
                
                self[options].apply(self, args);
            
            } else {     
                if(self) {      
                    self._init();  
                } else {             
                    self = $.data(this, 'juicy', new $.Juicy(options, this));
                }
            } 
        });
        
        return this;
    }; 
})(jQuery, window);   