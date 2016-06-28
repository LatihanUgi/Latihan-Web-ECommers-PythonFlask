/**
* global javascripts
*
* @type Object
*/



function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds){
            break;
        }
    }
}



;(function($, window, undefined) {
    'use strict';

    window.Global = {
        enable3DHover: false,
        animationspeed: 300,
        fancybox: {
            selector: "a.fancybox",
            lang: {
                picture: 'Picture',
                from: 'from'
            },
            settings: {
                titlePosition: 'over',
                titleFormat: function (title, currentArray, currentIndex, currentOpts) {
                    if (currentArray.length <= 1 && (!title || !title.length)) return false;
                    var titleHTML = '<div class="fancy-simple-title" id="tip-title" style="text-align: left">';
                    if (currentArray.length > 1) {
                        if (title && title.length) titleHTML += '<strong>' + title + '</strong><br />';
                        titleHTML += '<small>' + Global.fancybox.lang.picture + ' ' + (currentIndex + 1) + ' ' + Global.fancybox.lang.from + ' ' + currentArray.length + '</small>';
                    } else {
                        titleHTML += '<strong>' + title + '</strong>';
                    }
                    titleHTML += '</div>';
                    return titleHTML;
                },
                onComplete: function (currentArray, currentIndex, currentOpts) {
                    $("#fancybox-title")
                        .hide()
                        .stop(true, true)
                        .slideDown(currentOpts.changeSpeed);
                    $("#fancybox-wrap").bind('mouseenter', function () {
                        $("#fancybox-title").stop(true, true).slideDown(currentOpts.changeSpeed);
                    }).bind('mouseleave', function () {
                        $("#fancybox-title").stop(true, true).slideUp(currentOpts.changeSpeed);
                    });
                },
                onCleanup: function () {
                    $("#fancybox-wrap").unbind('mouseenter').unbind('mouseleave');
                }
            }
        },

        documentReady: function() {

            $(document).ready(function(){

                //fancybox initialization
                var $facnyboxTargets = $(Global.fancybox.selector);
                if($facnyboxTargets.length > 0) {
                    if($.fancybox) $facnyboxTargets.fancybox(Global.fancybox.settings);
                    else console.error("To use fancybox you need to load the fancybox plugin first: ", $facnyboxTargets);
                }

                //range slider initialization
                var $rangeSliderTargets = $(".range-slider");
                if($rangeSliderTargets.length > 0) {
                    if($.fn.noUiSlider) Global.initRangeSlider($rangeSliderTargets);
                    else console.error("To use range slider you need to load the noUiSlider plugin first: ", $rangeSliderTargets);
                }

                Global.hoverShowToggle("#languages-box-holder", "#languages-box-holder .languages-box");
                Global.hoverShowToggle("#header-cart", "#header-cart .header-quick-cart");

                $(".popup-trigger").each(function(){
                    Global.hoverShowToggle(this, $('.popup-box', this));
                });

                $(".popup-outside-trigger").each(function(){
                    Global.hoverShowOutsideToggle(this, $('.popup-box', this));
                });

                // bind dual button right arrow click
                $(document).on('click', '.button-dual .button-dual-right', function(e) {
                    $(this)
                        .toggleClass("selected")
                        .next(".button-dual-submenu")
                        .stop(true, true)
                        .fadeToggle(Global.animationspeed);

                    e.preventDefault();
                    e.stopPropagation();
                });

                //bind mobile menu opener click
                $("a.click-slide").click(function(e){
                    var $target = $($(this).attr("href"));
                    var show = !$target.hasClass("slide-opened");
                    if (show) {
                        $(".slide-opened").removeClass("slide-opened");
                        $(window).on('scroll', Global.disableScroll);
                        Global.disableScroll();
                    } else {
                        $(window).off('scroll', Global.disableScroll);
                    }
                    $target.toggleClass("slide-opened", show);
                    $("body").toggleClass("mobile-menu-opened", show);
                    e.preventDefault();
                });

                // bind mobile menu close click
                $(".mobile-overlay").click(function(e){
                    $(".slide-opened").removeClass("slide-opened");
                    $("body").removeClass("mobile-menu-opened");
                    $(window).off('scroll', Global.disableScroll);
                });

                //bind mobile sidebar opener click
                $("a[href='#sidebar']").click(function(e){
                    $(".sidebar").toggleClass("sidebar-opened");
                    e.preventDefault();
                });

                // bind submenu main category link click
                $(".expandable-menu > li > a").on('click', function() {
                    if($(this).parent().hasClass("expanded")) return false;
                    if($(this).parent().children("ul").length < 1) return true;

                    $(".expandable-menu .expanded > a")
                        .removeClass("selected")
                        .parent()
                        .children("ul")
                        .stop(true, true)
                        .slideUp(function(){
                            $(this).parent().removeClass("expanded");
                        });

                    $(this)
                        .addClass("selected")
                        .parent()
                        .children("ul")
                        .stop(true, true)
                        .slideDown(function() {
                            $(this).parent().addClass("expanded");
                        });

                    return false;
                });

                //initialize header slider if present
                var $juicyTargets = $(".header-slider .juicy-slider");
                if($juicyTargets.length > 0) {
                    if($.fn.juicy) $juicyTargets.juicy({ autoplay: false });
                    else console.error("To use juicy slider you need to load the juicy plugin first: ", $juicyTargets);
                }

                //initialize custom checkboxes
                Global.initializeCheckboxes(".custom-checkbox");

                //initialize custom checkboxes
                Global.initializeSelectboxes(".custom-selectbox");

                //change pager colors
                Global.changePagerColors(".pager");

                //start page tabs
                $(".shoppie-tabs").each(function(){
                    ShoppieTabs.init(this);
                });
            });

            Global.megaMenu("#main-menu");

            $(window).load(function(){
                Global.megaMenu("#main-menu");
                Global.createThumbnailHover(".blur-hover, .grayscale-hover, .zoom-hover");
            });

            $(window).resize(function(){
                Global.megaMenu("#main-menu");
            });
        },

        disableScroll: function(e) {
            window.scrollTo(0,0);
        },

        /**
        * Initialize mega menu element
        *
        * @param element
        */
        megaMenu: function(element) {
            var $menu = $(element);
            if($menu.length < 1) return false;

            var menuWidth = $menu.outerWidth();

            $(".mega-menu", $menu).each(function(){
                var $menuItem = $(this).parent();
                var $megaMenuActive = $(".mega-menu-active", this);
                var menuItemWidth = $menuItem.outerWidth();

                var position = $menuItem.position();
                position = position.left ? position.left : 0;

                var width = $(this).outerWidth();
                $megaMenuActive.width(menuItemWidth);

                if((position + width) > menuWidth) {
                    $(this).css({ left: "auto", right: 0 });
                    $megaMenuActive.css({ left: "auto", right: (menuWidth - position - menuItemWidth) });
                } else {
                    $(this).css({ left: position });
                }

                //change height of box elements
                $(".mega-menu-box", this).css({ height: '' }).css({ height : $(this).height()});
                $(".mega-menu-box:last", this).addClass("mega-menu-last");

                $(this).css("display", "");
                $menuItem.removeClass('selected');
                Global.hoverShowToggle($menuItem, this);
            });
        },



        /**
        * Show target element on click
        *
        * @param target
        */
        clickShowToggle: function(target) {
            if($(target).is(":visible")) {
                $(target)
                    .stop(true, true)
                    .fadeOut(Global.animationspeed);

                if(Global.enable3DHover)
                    $(target)
                        .addClass("hide-popup")
                        .removeClass("show-popup");
            } else {
                $(target)
                    .stop(true, true)
                    .fadeIn(Global.animationspeed);

                if(Global.enable3DHover)
                    $(target)
                        .addClass("show-popup")
                        .removeClass("hide-popup");
            }
        },



        /**
        * bind hover on element to show target
        *
        * @param element
        * @param target
        */
        hoverShowToggle: function(element, target) {
            $(element).data("target", target);
            $(element).off("click mouseenter mouseleave", Global.hoverClickHandle);
            $(element).on("click mouseenter mouseleave", Global.hoverClickHandle);
        },

        hoverClickHandle: function(e) {
            var show,
                width = $(window).outerWidth(),
                type = e.type,
                $target = $($(this).data("target"));

            if((width > 979 && type == 'click') || (width <= 979 && (type == 'mouseenter' || type == 'mouseleave'))) return true;
            if($(e.target).hasClass('main-menu-item')) e.preventDefault();

            switch(type) {
                case 'click':
                    show = !($target).is(':visible');
                    break;
                case 'mouseenter':
                    show = true;
                    break;
                case 'mouseleave':
                    show = false;
                    break;
            }

            if(show) {
                if(type == 'click') $(this).siblings('.selected').trigger('click');
                $(this).addClass('selected');

                $target
                    .hide()
                    .stop(true)
                    .fadeIn(Global.animationspeed);

                if(Global.enable3DHover)
                    $target
                        .addClass("show-popup")
                        .removeClass("hide-popup");
            } else {
                $(this).removeClass('selected');
                $target
                    .show()
                    .stop(true)
                    .fadeOut(Global.animationspeed);

                if(Global.enable3DHover)
                    $target
                        .addClass("hide-popup")
                        .removeClass("show-popup");
            }
        },


        /**
        * bind hover on element to show popup appended to body
        *
        * @param element
        * @param target
        */
        hoverShowOutsideToggle: function(element, target) {
            $(element).data("target", target);
            $(element)
                .unbind("mouseenter mouseleave")
                .hover(function(){
                    var $self = $(this);
                    var $target = $self.data("target");

                    Global.positionHoverTarget($self, $target);

                    $target
                        .stop(true, true)
                        .fadeIn(Global.animationspeed);

                    if(Global.enable3DHover)
                        $target
                            .addClass("show-popup")
                            .removeClass("hide-popup");

                    $self.data("hovering", true);

            }, function(){
                var $self = $(this);
                var $target = $self.data("target");

                setTimeout(function(){
                    if($target.data('hovering') || $self.data('hovering')) return false;

                    $target
                        .stop(true, true)
                        .fadeOut(Global.animationspeed);

                    if(Global.enable3DHover)
                        $target
                            .addClass("hide-popup")
                            .removeClass("show-popup");

                }, 100);

                $self.data('hovering', false);
            });

            $(target)
                .addClass('popup-box-outside')
                .data("trigger", element)
                .unbind("mouseenter mouseleave")
                .hover(function(){
                    $(this).data("hovering", true);
                    $($(this).data("trigger"))
                        .addClass('selected');

                }, function(){
                    $(this).data("hovering", false);
                    $($(this).data("trigger"))
                        .removeClass('selected')
                        .trigger('mouseleave');
                })
                .appendTo('body');
        },



        /**
        * recalculate position of popup box element to show on right place
        *
        * @param $self
        * @param $target
        */
        positionHoverTarget: function($self, $target) {
            var position = $self.offset();

            var selfDimensions = {
                width: $self.outerWidth(),
                height: $self.outerHeight()
            };

            var targetDimensions = {
                width: $target.outerWidth(),
                height: $target.outerHeight()
            };

            if($target.hasClass('popup-top')) {
                $target.css({
                    left: (position.left + selfDimensions.width / 2) - targetDimensions.width / 2,
                    top: position.top - targetDimensions.height
                });

            } else if($target.hasClass('popup-bottom')) {
                $target.css({
                    left: (position.left + selfDimensions.width / 2) - targetDimensions.width / 2,
                    top: position.top + selfDimensions.height
                });

            } else if($target.hasClass('popup-left')) {
                $target.css({
                    left: position.left - targetDimensions.width,
                    top: (position.top + selfDimensions.height / 2) - targetDimensions.height / 2
                });

            } else if($target.hasClass('popup-right')) {
                $target.css({
                    left: position.left + selfDimensions.width,
                    top: (position.top + selfDimensions.height / 2) - targetDimensions.height / 2
                });
            }
        },



        /**
        * create hover image clone to use CSS effects on it
        *
        * @param target
        */
        createThumbnailHover: function(target) {
            $(target).each(function() {
                var cl = null;
                var classList = $(this).attr("class").split(" ");
                $(classList).each(function(){
                    if(this.indexOf("-hover") != -1) {
                        cl = this.substr(0, this.indexOf("-hover"));
                        return false;
                    }
                });

                var $img = $(this).find("img");
                var $clone = $img.clone();
                var $holder = $("<span />").addClass(cl + "-thumb");

                $holder.append($clone);
                $img.after($holder);
            });
        },



        /**
        * Initialize range slider using noUiSlider plugin
        *
        * @param $targets
        */
        initRangeSlider: function($targets) {
            $targets.each(function(){
                var $slider = $(".range-slider-object", this);

                var range = $(this).data("range").toString();
                if(!range) {
                    console.error("Please specify the range for slider: ", this);
                    return false;
                }

                range = range.split(",");
                if(range.length < 2 || !(range instanceof Array)) {
                    console.error("Specified range needs to be an array of at least 2 items: ", this);
                    return false;
                }

                //map numeric or string range
                if((isNaN(range[0]) || isNaN(range[1])) && range.length > 2) {
                    $slider.data("map", range);
                    range = [0, (range.length - 1)];
                } else {
                    range = $.map(range, Number);
                }

                var start = [range[0], range[1]];
                var min = $(".range-slider-min", this);
                var max = $(".range-slider-max", this);

                if(min.length < 1 || max.length < 1) {
                    console.error("Missing input fields for slider (create input fields with class .range-slider-min and .range-slider-max): ", this);
                    return false;
                }

                //get selected values for the slider
                if(min.val() || max.val()) {
                    if((min.val() && isNaN(min.val())) || (max.val() && isNaN(max.val()))) {
                        var dataMap = $slider.data("map");
                        var minInMap = $.inArray(min.val(), dataMap);
                        var maxInMap = $.inArray(max.val(), dataMap);
                        if(minInMap > -1) start[0] = minInMap;
                        if(maxInMap > -1) start[1] = maxInMap;
                    } else {
                        if(min.val()) start[0] = parseInt(min.val());
                        if(max.val()) start[1] = parseInt(max.val());
                    }
                }

                $slider.data('inputs', { min: min, max: max });
                $slider.noUiSlider({
                    range: range,
                    start: start,
                    step: 1,
                    slide: function(){
                        var $self = $(this);
                        var $inputs = $self.data('inputs');
                        var values = $(this).val();
                        values[0] = parseInt(values[0]);
                        values[1] = parseInt(values[1]);

                        var selected_min = $self.data("map") ? $self.data("map")[values[0]] : values[0];
                        var selected_max = $self.data("map") ? $self.data("map")[values[1]] : values[1];

                        $("a:first .range-selected", this).text(selected_min);
                        $("a:last .range-selected", this).text(selected_max);

                        $inputs.min.val(selected_min);
                        $inputs.max.val(selected_max);
                    },
                    create: function() {
                        $("a:first", this).addClass("active-bg");
                        $("a:last", this).addClass("last");
                        $("div", this)
                            .append(
                                $("<span />")
                                    .addClass("active-bg")
                                    .append($("<span />"))
                                )
                            .append($("<span />").addClass("range-slider-handle"))
                            .append(
                                $("<span />")
                                    .addClass("range-info")
                                    .append($("<span />").addClass("range-selected cream-gradient"))
                                    .append($("<span />").addClass("range-arrow").append($("<span />").addClass("cream-bg")))
                            );

                        var $self = $(this);
                        var values = $(this).val();
                        values[0] = parseInt(values[0]);
                        values[1] = parseInt(values[1]);

                        $("a:first .range-selected", this).text($self.data("map") ? $self.data("map")[values[0]] : values[0]);
                        $("a:last .range-selected", this).text($self.data("map") ? $self.data("map")[values[1]] : values[1]);
                    }
                });
            });
        },


        /**
        * initialize custom checkboxes
        *
        * @param selector
        */
        initializeCheckboxes: function(selector) {
            var $checkboxes = $(selector);
            if($checkboxes.length < 1) return false;

            $checkboxes
                .find("input[type='checkbox']")
                .css({ position: 'absolute', opacity: 0 })
                .on("change", function() {
                    var $self = $(this);
                    if($self.is(":checked")) {
                        $self.parent().addClass("selected");
                        $self.next("span").addClass("active-bg");
                    } else {
                        $self.parent().removeClass("selected");
                        $self.next("span").removeClass("active-bg");
                    }
                })
                .after($("<span />").addClass("transition-color"))
                .trigger("change");
        },

        /**
        * initialize custom checkboxes
        *
        * @param selector
        */
        initializeSelectboxes: function(selector) {
            var $selectboxes = $(selector);
            if($selectboxes.length < 1) return false;

            $selectboxes
                .find("select")
                .on("change", function() {
                    var $self = $(this);
                    $self.next("span").text($("option:selected", $self).text());
                })
                .after($("<i />").addClass("icon-caret-down"))
                .after("<span />")
                .trigger("change");
        },

        /**
        * changes pager page colors according to parent
        *
        * @param selector
        */
        changePagerColors: function(selector) {
            var $pagers = $(selector);

            if($pagers.length < 1) return false;

            $pagers.each(function(){
                var classes = $(this).attr("class")
                    .split(" ")
                    .filter(function(value){
                        return $.inArray(value, ["pager", "align-center", "align-right"]) < 0
                    })
                    .join(" ");
                $(this).removeClass(classes).addClass("pager");
                $(this).children().addClass(classes).removeClass("pager");
            });
        }
    };



    /**
    * javascripts on homepage
    *
    * @type Object
    */

    window.Homepage = {

        documentReady: function() {
            $(document).ready(function(){
                Homepage.initSlider("#juicy-slider");
            });
        },

        initSlider: function(element) {
            $(element).juicy({
                baseWidth: 980,
                baseHeight: 430,
                sequentialFactor: 100,
                disperseFactor: 10,
                timeout: 8000,
                speed: 1300,
                slices: 5,
                effect: 'random',
                easing: 'easeOutQuad',
                /*cuboidsRandom: true,
                maxCuboidsCount: 8,*/
                autoplay: true,

                navFormatter: function($link, type, $navHolder) {

                    //change only thumbs navigation
                    if(type.indexOf('thumbs') !== -1) {

                        //Shoppie specific color classes
                        var colorClasses = '';
                        var classes = $navHolder.attr('class').split(' ');

                        if(classes.length > 1) $(classes).each(function(){
                            if(this.indexOf('bg') !== -1 || this.indexOf('border') !== -1) colorClasses += ' ' + this;
                        });

                        var $wrapper = $('<i />').addClass(colorClasses);
                        $link.children('a').wrap($wrapper);

                        return $link;
                    }
                }
            });
        }
    };



    /**
    * javascripts on product detail page
    *
    * @type Object
    */

    window.Product = {

        documentReady: function() {
            $(document).ready(function(){
                Product.initSlider("#product-gallery", false);
            });
        },

        initSlider: function(element, autoplay) {
            $(element).juicy({
                baseWidth: 250,
                baseHeight: 250,
                speed: 500,
                slices: 6,
                effect: 'boxRainGrow',
                easing: 'swing',
                autoplay: autoplay || false,
                navFormatter: function($link, type, $navHolder) {

                    //change only thumbs navigation
                    if(type.indexOf('thumbs') !== -1) {

                        //Shoppie specific color classes
                        var classes = $navHolder.attr('class').split(' ');
                        if(classes.length > 1) $(classes).each(function(){
                            if(this.indexOf('border') !== -1) $('img', $link).addClass(this.toString());
                        });
                        return $link;
                    }
                }

            // when slider has loaded get percent width for animations
            }).on("sliderReady", function(e){
                var $nav = e.juicy.$navHolders.eq(0) || null;
                var $secondThumb = $("a", $nav).eq(1);

                if($nav == null || $secondThumb == null) return 0;

                var navWidth = $nav.width();
                var itemWidth = $secondThumb.width();
                var itemMargin = parseFloat($secondThumb.css("margin-left"));

                e.juicy.thumbsMoveBy = (itemWidth + itemMargin) / navWidth * 100;
                e.juicy.thumbsMover = $nav.children(".thumbs");

            // on change move thumbnails to correct position
            }).on("beforeChange", function(e){
                var count = e.juicy.itemsCount;
                var current = e.juicy.current;

                if(count < 5) return false;

                if(current > 2 && current < (count - 1)) {
                    var moveTo = e.juicy.thumbsMoveBy * (current - 2);
                    moveTo = moveTo < 0 ? 0 : moveTo;
                } else if(current <= 2) {
                    moveTo = 0;
                }

                $(e.juicy.thumbsMover).stop(true, true).animate({ left: -moveTo + "%" }, 400, "easeOutSine");
            });
        }
    };



    /**
    * Products functions
    *
    * @type Object
    */
    window.Products = {
        ajaxRunning: false,

        /**
        * Load more products using ajax call
        *
        * @param before     element where are other elements appended
        * @param link       element with link where other products are loaded
        * @param number     number of elements to load
        */
        loadMoreProducts: function(before, link, number) {

            if(this.ajaxRunning) return false;
            this.ajaxRunning = true;

            var url = $(link).attr("href");
            $(link).addClass("loading");

            //TODO: remove (setTimeout is here only for showcase)
            setTimeout(function(){
                //TODO: setup ajax to call server which returns HTML product list
                $.ajax({
                    url: url,
                    type: "POST",
                    data: {number : number},
                    dataType: "html",
                    success: function(data) {
                        if(data) $(before).before(data);
                    },
                    complete: function() {
                        $(link).removeClass("loading");
                        Products.ajaxRunning = false;
                    }
                });
            }, 1000);
        }
    };



    /**
    * Contact page functions
    *
    * @type Object
    */
    window.Contact = {

        markerIcon: {
            normal: 'images/icons/icon-custom-marker.png',
            hover: 'images/icons/icon-custom-marker-hover.png'
        },

        /**
        * Initialize map variables andsettings
        *
        * @param target
        * @param options
        */
        initMap: function(target, options) {
            if(typeof options == "undefined") options = {};

            $(window).load(function(){

                var $map = $(target);
                if($map.length < 1) return false;

                var mapData = Contact.getMapData($map);

                var markers;
                if(options.markers instanceof Array && options.markers.length > 0) {
                    markers = mapData.markers.concat(options.markers);
                } else {
                    markers = mapData.markers;
                }

                var center;
                if(options.center instanceof Object) {
                    center = $.extend({}, mapData.center, options.center);
                } else {
                    center = mapData.center;
                }

                if(!center.latlng && !center.address) {
                    console.error("Please set center address of your map use data-latlng: ", $map);
                }

                // custom marker image
                Contact.markerImage = {
                    url: Contact.markerIcon.normal,
                    size: new google.maps.Size(33, 46),
                    origin: new google.maps.Point(0,0),
                    anchor: new google.maps.Point(16, 46)
                };

                Contact.loadGoogleMap($map, center, markers);
            });
        },


        /**
        * bind google map to selected canvas
        *
        * @param $map
        * @param center
        * @param markers
        */
        loadGoogleMap: function($map, center, markers) {
            var geocoder = new google.maps.Geocoder();
            var mapOptions = {
                zoom: center.zoom || 10,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            if(typeof center.latlng != "undefined") {
                mapOptions.center = new google.maps.LatLng(center.latlng.lat, center.latlng.lng);
            } else {
                geocoder.geocode( { 'address': center.address}, function(results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        map.setCenter(results[0].geometry.location);
                    } else {
                        console.error("Geocode was not successful for the following reason: ", status);
                    }
                });
            }

            var map = new google.maps.Map($map[0], mapOptions);

            //map titles are fully loaded
            google.maps.event.addListenerOnce(map, 'tilesloaded', function(){

                //place markers on map
                $(markers).each(function(i){
                    var self = this;

                    //display markers with delay
                    setTimeout(function(){
                        if(typeof self.latlng != "undefined") {
                            Contact.placeMarker(map, new google.maps.LatLng(self.latlng.lat, self.latlng.lng), self.link, self.zoom);
                        } else {
                            geocoder.geocode( { 'address': self.address}, function(results, status) {
                                if (status == google.maps.GeocoderStatus.OK) {
                                    Contact.placeMarker(map, results[0].geometry.location, self.link, self.zoom);
                                } else {
                                    console.error("Geocode was not successful for the following reason: ", status);
                                }
                            });
                        }
                    }, i * 200);
                });
            });
        },

        /**
        * place one marker on map with desired settings
        *
        * @param map
        * @param position
        * @param link
        * @param zoom
        */
        placeMarker: function(map, position, link, zoom) {

            var marker = new google.maps.Marker({
                map: map,
                position: position,
                zoom: zoom,
                animation: google.maps.Animation.DROP,
                parentLink: link,
                icon: Contact.markerImage
            });

            google.maps.event.addListener(marker, 'click', function() {
                Contact.markerBounce(marker);
                map.panTo(marker.position);
            });

            google.maps.event.addListener(marker, 'mouseover', function() {
                marker.setIcon(Contact.markerIcon.hover);
            });
            google.maps.event.addListener(marker, 'mouseout', function() {
                marker.setIcon(Contact.markerIcon.normal);
            });

            if(typeof link != "undefined")  {
                $(link).on("click", function(){
                    Contact.markerBounce(marker);
                    map.panTo(marker.position);

                    if(marker.zoom) map.setZoom(marker.zoom);
                });
            }
        },

        /**
        * Make marker bounce on click
        *
        * @param marker
        */
        markerBounce: function(marker) {
            var m = marker;
            m.setAnimation(google.maps.Animation.BOUNCE);
            marker.setIcon(Contact.markerIcon.hover);

            if(typeof m.parentLink != "undefined") $(m.parentLink).addClass("highlight");

            setTimeout(function(){
                if (m.getAnimation() != null) m.setAnimation(null);
                if(typeof m.parentLink != "undefined") $(m.parentLink).removeClass("highlight");
                marker.setIcon(Contact.markerIcon.normal);
            }, 2100);
        },

        /**
        * Get map data from DOM
        *
        * @param $map
        */
        getMapData: function($map) {
            var center = {
                latlng: $map.data("latlng"),
                address: $map.data("address"),
                zoom: parseInt($map.data("zoom"))
            };
            if(center.latlng) center.latlng = Contact.processLatLng(center.latlng);

            var markers = [];
            $(".pin-to-map").each(function(){
                var $self = $(this);

                var street = $self.children(".street").text();
                var city = $self.children(".city").text();
                var country = $self.children(".country").text();

                var address = "";
                if(street) address = street.replace(/^\s+|\s+$/g, '');
                if(city) address += ", " + city.replace(/^\s+|\s+$/g, '');
                if(country) address += ", " + country.replace(/^\s+|\s+$/g, '');

                var pin = {
                    link: $self,
                    latlng: $self.data("latlng"),
                    address: $self.data("address") || address,
                    zoom: parseInt($self.data("zoom")) || 0
                };

                if(pin.latlng || pin.address) {
                    if(pin.latlng) pin.latlng = Contact.processLatLng(pin.latlng);
                    markers.push(pin);
                } else {
                    console.error("Please set address for this pin or use data-latlng: ", $self);
                }
            });

            return {
                center: center,
                markers: markers
            }
        },

        /**
        * return correct latitude and longtitude parameters
        *
        * latlng
        */
        processLatLng: function(latlng) {
            latlng = latlng.split(",");
            return {
                lat: parseFloat(latlng[0]),
                lng: parseFloat(latlng[1])
            }
        }
    };




    /**
    * Contact page functions
    *
    * @type Object
    */
    window.Compare = {
        container: "",
        column: "",
        row: "",
        table: [],

        documentReady: function() {
            $(document).ready(function(){
                Compare.initCompareTable();
                if(Compare.table.length < 1) return false;

                Compare.resizeCompareTable();

                $(window).load(function(){
                    Compare.resizeCompareTable();
                }).resize(function(){
                    Compare.resizeCompareTable();
                });
            });
        },

        initCompareTable: function() {
            var $container = $(this.container);
            if($container.length < 1) return false;

            $(this.column, $container).each(function(index){
                $(Compare.row, this).each(function(i){
                    if(Compare.table[i] == undefined) Compare.table[i] = [];
                    if(Compare.table[i][index] == undefined) Compare.table[i][index] = $(this);
                })
            });
        },

        resizeCompareTable: function() {
            for(var i in Compare.table) {
                var height = 0, j, $row = [];

                // get max height for rows
                if(Compare.table.hasOwnProperty(i))
                    for(j in Compare.table[i]) {
                        if(Compare.table[i].hasOwnProperty(j)) $row = Compare.table[i][j];
                        if($row.length > 0) {
                            $row.css({ height: "" });
                            var rowHeight = $row.height();
                            if(rowHeight > height) height = rowHeight;
                        }
                    }

                // get height for rows
                if(Compare.table.hasOwnProperty(i))
                    for(j in Compare.table[i]) {
                        if(Compare.table[i].hasOwnProperty(j)) $row = Compare.table[i][j];
                        if($row.length > 0) $row.height(height);
                    }
            }
        }
    };


    /**
    * Responsive related products slider
    *
    * @type Object
    */
    window.ResponsiveSlider = {
        element: null,
        content: null,
        mover: null,
        sliderItems: null,
        sliderItemsSelector: ".scroller-item",
        sliderItemWidth: 0,
        sliderItemsVisible: 0,
        defaultSpeed: 500,
        defaultEasing: "easeOutExpo",
        prevNav: null,
        nextNav: null,


        /**
        * init slider configuration
        *
        * @param holder
        */
        init: function(holder) {
            this.element = $(holder);
            this.content = $(".scroller-content", this.element);
            this.mover = $(".scroller-mover", this.content);
            this.sliderItems = this.mover.children(this.sliderItemsSelector);

            var margin = parseInt($(this.sliderItems).first().css("margin-left").replace("px", ""));
            this.sliderItemWidth = $(this.sliderItems).first().width() + margin * 2;

            this.mover.width(this.sliderItemWidth * this.sliderItems.length);
            this.element.data("curentPosition", 0);

            $(window).load(function(){
                ResponsiveSlider.resize();
            }).resize(function(){
                ResponsiveSlider.resize();
            });

            this.resolvenavigation();
        },


        /**
        * resize event handler to support responsive behaviour
        *
        */
        resize: function() {
            var width = this.element.width();
            this.sliderItemsVisible = Math.floor(width / this.sliderItemWidth);
            this.content.width(this.sliderItemsVisible * this.sliderItemWidth);

            this.resolvenavigation();
        },


        nextItem: function() {
            if(this.element.data("curentPosition") >= (this.sliderItems.length - this.sliderItemsVisible)) return false;
            else this.element.data("curentPosition", this.element.data("curentPosition") + 1);

            this.resolvenavigation();
            this.mover.stop(true, true).animate({ marginLeft: "-=" + this.sliderItemWidth });
        },


        prevItem: function() {
            if(this.element.data("curentPosition") == 0) return false;
            this.element.data("curentPosition", this.element.data("curentPosition") - 1);

            this.resolvenavigation();
            this.mover.stop(true, true).animate({ marginLeft: "+=" + this.sliderItemWidth });
        },

        resolvenavigation: function() {

            //bind navigation events
            $(this.prevNav).unbind("click");
            $(this.prevNav).click(function() { ResponsiveSlider.prevItem() });

            $(this.nextNav).unbind("click");
            $(this.nextNav).click(function() { ResponsiveSlider.nextItem() });

            //first item is visible
            if(this.element.data("curentPosition") == 0 && this.element.data("curentPosition") != (this.sliderItems.length - this.sliderItemsVisible)) {
                $(this.nextNav).removeClass("disabled");
                $(this.prevNav).addClass("disabled");
                $(this.prevNav).unbind("click");

            //last item is visible
            } else if (this.element.data("curentPosition") != 0 && this.element.data("curentPosition") >= (this.sliderItems.length - this.sliderItemsVisible)) {
                $(this.prevNav).removeClass("disabled");
                $(this.nextNav).addClass("disabled");
                $(this.nextNav).unbind("click");

            //first item is allso last item
            } else if (this.element.data("curentPosition") == 0 && this.element.data("curentPosition") >= (this.sliderItems.length - this.sliderItemsVisible)) {
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
    };




    /**
    * Shoppie tabs
    * TODO: comment tabs functions
    */
    window.ShoppieTabs = {

        init: function(element) {
            var $element = $(element);
            if($element.length < 1) return false;

            var $tabs = $element.find("a");
            if($tabs.length < 1) return false;

            $tabs.each(function(){
                var $this = $(this);
                var $target = $($this.attr("href"));

                if($target.length < 1) return false;
                $(this).data("target", $target);

                if($tabs.index(this) == 0) {
                    $this.addClass('selected');
                    $target.show();
                } else {
                    $target.hide();
                }

                ShoppieTabs.bindClickEvent($this, $tabs);
            });
        },

        bindClickEvent: function($tab, $tabs) {

            if($tab.length < 1) return false;

            $tab.off("click").on("click", function(){
                var $this = $(this);

                ShoppieTabs.showTab($this, $tabs);
                return false;
            });
        },

        showTab: function($tab, $tabs) {
            if($tab.length < 1 || $tab.hasClass("selected")) return false;

            var $selected = $tabs.filter(".selected");

            $selected.removeClass("selected");
            $tab.addClass("selected");

            var $target = $tab.data("target");
            var $selectedTarget = $selected.data("target");

            //get target height
            $target.show();
            $selectedTarget.hide();

            var height = $target.parent().height();

            $target.hide();
            $selectedTarget.show();

            $target
                .parent()
                .stop(true, true)
                .animate({ height: height}, 500, function() {
                    $(this).css("height", "");
                });

            $selectedTarget
                .stop(true, true)
                .css({ position: "relative", left: 0 })
                .animate({ left: -100, opacity: 0 }, 250, function(){
                    $(this).css({ position: "", left: "" }).hide();

                    $target
                        .stop(true, true)
                        .css({ position: "relative", opacity: 0, left: 100 })
                        .show()
                        .animate({ left: 0, opacity: 1 }, 250, function () {
                            $(this).css({ position: "", left: "" });
                        });
                });
        }
    };

})(jQuery, window);