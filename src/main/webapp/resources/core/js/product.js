require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*!
 * baguetteBox.js
 * @author  feimosi
 * @version 1.4.0
 * @url https://github.com/feimosi/baguetteBox.js
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.baguetteBox = factory();
    }
}(this, function () {

    // SVG shapes used on the buttons
    var leftArrow = '<svg width="44" height="60">' +
            '<polyline points="30 10 10 30 30 50" stroke="rgb(0,0,0)" stroke-width="4"' +
              'stroke-linecap="butt" fill="none" stroke-linejoin="round"/>' +
            '</svg>',
        rightArrow = '<svg width="44" height="60">' +
            '<polyline points="14 10 34 30 14 50" stroke="rgb(0,0,0)" stroke-width="4"' +
              'stroke-linecap="butt" fill="none" stroke-linejoin="round"/>' +
            '</svg>',
        closeX = '<svg width="30" height="30">' +
            '<g stroke="rgb(0, 0, 0)" stroke-width="4">' +
            '<line x1="5" y1="5" x2="25" y2="25"/>' +
            '<line x1="5" y1="25" x2="25" y2="5"/>' +
            '</g></svg>';
    // Global options and their defaults
    var options = {}, defaults = {
        captions: true,
        buttons: 'auto',
        async: false,
        preload: 2,
        animation: 'slideIn',
        afterShow: null,
        afterHide: null,
        // callback when image changes with `currentIndex` and `imagesElements.length` as parameters
        onChange: null
    };
    // Object containing information about features compatibility
    var supports = {};
    // DOM Elements references
    var overlay, slider, previousButton, nextButton, closeButton;
    // Current image index inside the slider and displayed gallery index
    var currentIndex = 0, currentGallery = -1;
    // Touch event start position (for slide gesture)
    var touchStartX;
    // If set to true ignore touch events because animation was already fired
    var touchFlag = false;
    // Regex pattern to match image files
    var regex = /.+\.(gif|jpe?g|png|webp)/i;
    // Array of all used galleries (DOM elements)
    var galleries = [];
    // 2D array of galleries and images inside them
    var imagesMap = [];
    // Array containing temporary images DOM elements
    var imagesElements = [];
    // Event handlers
    var imagedEventHandlers = {};
    var overlayClickHandler = function(event) {
        // When clicked on the overlay (outside displayed image) close it
        if(event.target && event.target.nodeName !== 'IMG' && event.target.nodeName !== 'FIGCAPTION')
            hideOverlay();
    };
    var previousButtonClickHandler = function(event) {
        /*jshint -W030 */
        event.stopPropagation ? event.stopPropagation() : event.cancelBubble = true;
        showPreviousImage();
    };
    var nextButtonClickHandler = function(event) {
        /*jshint -W030 */
        event.stopPropagation ? event.stopPropagation() : event.cancelBubble = true;
        showNextImage();
    };
    var closeButtonClickHandler = function(event) {
        /*jshint -W030 */
        event.stopPropagation ? event.stopPropagation() : event.cancelBubble = true;
        hideOverlay();
    };
    var touchstartHandler = function(event) {
        // Save x axis position
        touchStartX = event.changedTouches[0].pageX;
    };
    var touchmoveHandler = function(event) {
        // If action was already triggered return
        if(touchFlag)
            return;
        /*jshint -W030 */
        event.preventDefault ? event.preventDefault() : event.returnValue = false;
        touch = event.touches[0] || event.changedTouches[0];
        // Move at least 40 pixels to trigger the action
        if(touch.pageX - touchStartX > 40) {
            touchFlag = true;
            showPreviousImage();
        } else if (touch.pageX - touchStartX < -40) {
            touchFlag = true;
            showNextImage();
        }
    };
    var touchendHandler = function(event) {
        touchFlag = false;
    };

    // forEach polyfill for IE8
    // http://stackoverflow.com/a/14827443/1077846
    if(![].forEach) {
        Array.prototype.forEach = function(callback, thisArg) {
            for(var i = 0; i < this.length; i++)
                callback.call(thisArg, this[i], i, this);
        };
    }

    // filter polyfill for IE8
    // https://gist.github.com/eliperelman/1031656
    if(![].filter) {
        Array.prototype.filter = function(a, b, c, d, e) {
            /*jshint -W030 */
            c=this;d=[];for(e=0;e<c.length;e++)a.call(b,c[e],e,c)&&d.push(c[e]);return d;
        };
    }

    // Script entry point
    function run(selector, userOptions) {
        // Fill supports object
        supports.transforms = testTransformsSupport();
        supports.svg = testSVGSupport();

        buildOverlay();
        bindImageClickListeners(selector, userOptions);
    }

    function bindImageClickListeners(selector, userOptions) {
        // For each gallery bind a click event to every image inside it
        galleries = document.querySelectorAll(selector);
        [].forEach.call(galleries, function(galleryElement) {
            if(userOptions && userOptions.filter)
                regex = userOptions.filter;
            // Filter 'a' elements from those not linking to images
            var tags = galleryElement.getElementsByTagName('a');
            tags = [].filter.call(tags, function(element) {
                return regex.test(element.href);
            });

            // Get all gallery images and save them in imagesMap with custom options
            var galleryID = imagesMap.length;
            imagesMap.push(tags);
            imagesMap[galleryID].options = userOptions;

            [].forEach.call(imagesMap[galleryID], function(imageElement, imageIndex) {
                var imageElementClickHandler = function(event) {
                    /*jshint -W030 */
                    event.preventDefault ? event.preventDefault() : event.returnValue = false;
                    prepareOverlay(galleryID);
                    showOverlay(imageIndex);
                };
                imagedEventHandlers[imageElement] = imageElementClickHandler;
                bind(imageElement, 'click', imageElementClickHandler);
            });
        });
    }

    function unbindImageClickListeners() {
        [].forEach.call(galleries, function(galleryElement) {
            var galleryID = imagesMap.length - 1;
            [].forEach.call(imagesMap[galleryID], function(imageElement, imageIndex) {
                unbind(imageElement, 'click', imagedEventHandlers[imageElement]);
            });
            imagesMap.pop();
        });
    }

    function buildOverlay() {
        overlay = getByID('baguetteBox-overlay');
        // Check if the overlay already exists
        if(overlay) {
            slider = getByID('baguetteBox-slider');
            previousButton = getByID('previous-button');
            nextButton = getByID('next-button');
            closeButton = getByID('close-button');
            return;
        }
        // Create overlay element
        overlay = create('div');
        overlay.id = 'baguetteBox-overlay';
        document.getElementsByTagName('body')[0].appendChild(overlay);
        // Create gallery slider element
        slider = create('div');
        slider.id = 'baguetteBox-slider';
        overlay.appendChild(slider);
        // Create all necessary buttons
        previousButton = create('button');
        previousButton.id = 'previous-button';
        previousButton.innerHTML = supports.svg ? leftArrow : '&lt;';
        overlay.appendChild(previousButton);

        nextButton = create('button');
        nextButton.id = 'next-button';
        nextButton.innerHTML = supports.svg ? rightArrow : '&gt;';
        overlay.appendChild(nextButton);

        closeButton = create('button');
        closeButton.id = 'close-button';
        closeButton.innerHTML = supports.svg ? closeX : 'X';
        overlay.appendChild(closeButton);

        previousButton.className = nextButton.className = closeButton.className = 'baguetteBox-button';

        bindEvents();
    }

    function keyDownHandler(event) {
        switch(event.keyCode) {
            case 37: // Left arrow
                showPreviousImage();
                break;
            case 39: // Right arrow
                showNextImage();
                break;
            case 27: // Esc
                hideOverlay();
                break;
        }
    }

    function bindEvents() {
        bind(overlay, 'click', overlayClickHandler);
        bind(previousButton, 'click', previousButtonClickHandler);
        bind(nextButton, 'click', nextButtonClickHandler);
        bind(closeButton, 'click', closeButtonClickHandler);
        bind(overlay, 'touchstart', touchstartHandler);
        bind(overlay, 'touchmove', touchmoveHandler);
        bind(overlay, 'touchend', touchendHandler);
    }

    function unbindEvents() {
        unbind(overlay, 'click', overlayClickHandler);
        unbind(previousButton, 'click', previousButtonClickHandler);
        unbind(nextButton, 'click', nextButtonClickHandler);
        unbind(closeButton, 'click', closeButtonClickHandler);
        unbind(overlay, 'touchstart', touchstartHandler);
        unbind(overlay, 'touchmove', touchmoveHandler);
        unbind(overlay, 'touchend', touchendHandler);
    }

    function prepareOverlay(galleryIndex) {
        // If the same gallery is being opened prevent from loading it once again
        if(currentGallery === galleryIndex)
            return;
        currentGallery = galleryIndex;
        // Update gallery specific options
        setOptions(imagesMap[galleryIndex].options);
        // Empty slider of previous contents (more effective than .innerHTML = "")
        while(slider.firstChild)
            slider.removeChild(slider.firstChild);
        imagesElements.length = 0;
        // Prepare and append images containers
        for(var i = 0, fullImage; i < imagesMap[galleryIndex].length; i++) {
            fullImage = create('div');
            fullImage.className = 'full-image';
            fullImage.id = 'baguette-img-' + i;
            imagesElements.push(fullImage);
            slider.appendChild(imagesElements[i]);
        }
    }

    function setOptions(newOptions) {
        if(!newOptions)
            newOptions = {};
        // Fill options object
        for(var item in defaults) {
            options[item] = defaults[item];
            if(typeof newOptions[item] !== 'undefined')
                options[item] = newOptions[item];
        }
        /* Apply new options */
        // Change transition for proper animation
        slider.style.transition = slider.style.webkitTransition = (options.animation === 'fadeIn' ? 'opacity .4s ease' :
            options.animation === 'slideIn' ? '' : 'none');
        // Hide buttons if necessary
        if(options.buttons === 'auto' && ('ontouchstart' in window || imagesMap[currentGallery].length === 1))
            options.buttons = false;
        // Set buttons style to hide or display them
        previousButton.style.display = nextButton.style.display = (options.buttons ? '' : 'none');
    }

    function showOverlay(chosenImageIndex) {
        if(overlay.style.display === 'block')
            return;

        bind(document, 'keydown', keyDownHandler);
        currentIndex = chosenImageIndex;
        loadImage(currentIndex, function() {
            preloadNext(currentIndex);
            preloadPrev(currentIndex);
        });

        updateOffset();
        overlay.style.display = 'block';
        // Fade in overlay
        setTimeout(function() {
            overlay.className = 'visible';
            if(options.afterShow)
                options.afterShow();
        }, 50);
        if(options.onChange)
            options.onChange(currentIndex, imagesElements.length);
    }

    function hideOverlay() {
        if(overlay.style.display === 'none')
            return;

        unbind(document, 'keydown', keyDownHandler);
        // Fade out and hide the overlay
        overlay.className = '';
        setTimeout(function() {
            overlay.style.display = 'none';
            if(options.afterHide)
                options.afterHide();
        }, 500);
    }

    function loadImage(index, callback) {
        var imageContainer = imagesElements[index];
        if(typeof imageContainer === 'undefined')
            return;

        // If image is already loaded run callback and return
        if(imageContainer.getElementsByTagName('img')[0]) {
            if(callback)
                callback();
            return;
        }
        // Get element reference, optional caption and source path
        imageElement = imagesMap[currentGallery][index];
        imageCaption = (typeof(options.captions) === 'function') ?
                            options.captions.call(imagesMap[currentGallery], imageElement) :
                            imageElement.getAttribute('data-caption') || imageElement.title;
        imageSrc = getImageSrc(imageElement);
        // Prepare image container elements
        var figure = create('figure');
        var image = create('img');
        var figcaption = create('figcaption');
        imageContainer.appendChild(figure);
        // Add loader element
        figure.innerHTML = '<div class="spinner">' +
            '<div class="double-bounce1"></div>' +
            '<div class="double-bounce2"></div>' +
            '</div>';
        // Set callback function when image loads
        image.onload = function() {
            // Remove loader element
            var spinner = document.querySelector('#baguette-img-' + index + ' .spinner');
            figure.removeChild(spinner);
            if(!options.async && callback)
                callback();
        };
        image.setAttribute('src', imageSrc);
        figure.appendChild(image);
        // Insert caption if available
        if(options.captions && imageCaption) {
            figcaption.innerHTML = imageCaption;
            figure.appendChild(figcaption);
        }
        // Run callback
        if(options.async && callback)
            callback();
    }

    // Get image source location, mostly used for responsive images
    function getImageSrc(image) {
        // Set default image path from href
        var result = imageElement.href;
        // If dataset is supported find the most suitable image
        if(image.dataset) {
            var srcs = [];
            // Get all possible image versions depending on the resolution
            for(var item in image.dataset) {
                if(item.substring(0, 3) === 'at-' && !isNaN(item.substring(3)))
                    srcs[item.replace('at-', '')] = image.dataset[item];
            }
            // Sort resolutions ascending
            keys = Object.keys(srcs).sort(function(a, b) {
                return parseInt(a) < parseInt(b) ? -1 : 1;
            });
            // Get real screen resolution
            var width = window.innerWidth * window.devicePixelRatio;
            // Find the first image bigger than or equal to the current width
            var i = 0;
            while(i < keys.length - 1 && keys[i] < width)
                i++;
            result = srcs[keys[i]] || result;
        }
        return result;
    }

    // Return false at the right end of the gallery
    function showNextImage() {
        var returnValue;
        // Check if next image exists
        if(currentIndex <= imagesElements.length - 2) {
            currentIndex++;
            updateOffset();
            preloadNext(currentIndex);
            returnValue = true;
        } else if(options.animation) {
            slider.className = 'bounce-from-right';
            setTimeout(function() {
                slider.className = '';
            }, 400);
            returnValue = false;
        }
        if(options.onChange)
            options.onChange(currentIndex, imagesElements.length);
        return returnValue;
    }

    // Return false at the left end of the gallery
    function showPreviousImage() {
        var returnValue;
        // Check if previous image exists
        if(currentIndex >= 1) {
            currentIndex--;
            updateOffset();
            preloadPrev(currentIndex);
            returnValue = true;
        } else if(options.animation) {
            slider.className = 'bounce-from-left';
            setTimeout(function() {
                slider.className = '';
            }, 400);
            returnValue = false;
        }
        if(options.onChange)
            options.onChange(currentIndex, imagesElements.length);
        return returnValue;
    }

    function updateOffset() {
        var offset = -currentIndex * 100 + '%';
        if(options.animation === 'fadeIn') {
            slider.style.opacity = 0;
            setTimeout(function() {
                /*jshint -W030 */
                supports.transforms ?
                    slider.style.transform = slider.style.webkitTransform = 'translate3d(' + offset + ',0,0)'
                    : slider.style.left = offset;
                slider.style.opacity = 1;
            }, 400);
        } else {
            /*jshint -W030 */
            supports.transforms ?
                slider.style.transform = slider.style.webkitTransform = 'translate3d(' + offset + ',0,0)'
                : slider.style.left = offset;
        }
    }

    // CSS 3D Transforms test
    function testTransformsSupport() {
        var div = create('div');
        return typeof div.style.perspective !== 'undefined' || typeof div.style.webkitPerspective !== 'undefined';
    }

    // Inline SVG test
    function testSVGSupport() {
        var div = create('div');
        div.innerHTML = '<svg/>';
        return (div.firstChild && div.firstChild.namespaceURI) == 'http://www.w3.org/2000/svg';
    }

    function preloadNext(index) {
        if(index - currentIndex >= options.preload)
            return;
        loadImage(index + 1, function() { preloadNext(index + 1); });
    }

    function preloadPrev(index) {
        if(currentIndex - index >= options.preload)
            return;
        loadImage(index - 1, function() { preloadPrev(index - 1); });
    }

    function bind(element, event, callback) {
        if(element.addEventListener)
            element.addEventListener(event, callback, false);
        else // IE8 fallback
            element.attachEvent('on' + event, callback);
    }

    function unbind(element, event, callback) {
        if(element.removeEventListener)
            element.removeEventListener(event, callback, false);
        else // IE8 fallback
            element.detachEvent('on' + event, callback);
    }

    function getByID(id) {
        return document.getElementById(id);
    }

    function create(element) {
        return document.createElement(element);
    }

    function destroyPlugin() {
        unbindEvents();
        unbindImageClickListeners();
        unbind(document, 'keydown', keyDownHandler);
        document.getElementsByTagName('body')[0].removeChild(document.getElementById('baguetteBox-overlay'));
        currentIndex = 0;
        currentGallery = -1;
        galleries.length = 0;
        imagesMap.length = 0;
    }

    return {
        run: run,
        destroy: destroyPlugin,
        showNext: showNextImage,
        showPrevious: showPreviousImage
    };

}));
},{}],2:[function(require,module,exports){
/* Chosen v1.1.0 | (c) 2011-2013 by Harvest | MIT License, https://github.com/harvesthq/chosen/blob/master/LICENSE.md */
!function(){var a,AbstractChosen,Chosen,SelectParser,b,c={}.hasOwnProperty,d=function(a,b){function d(){this.constructor=a}for(var e in b)c.call(b,e)&&(a[e]=b[e]);return d.prototype=b.prototype,a.prototype=new d,a.__super__=b.prototype,a};SelectParser=function(){function SelectParser(){this.options_index=0,this.parsed=[]}return SelectParser.prototype.add_node=function(a){return"OPTGROUP"===a.nodeName.toUpperCase()?this.add_group(a):this.add_option(a)},SelectParser.prototype.add_group=function(a){var b,c,d,e,f,g;for(b=this.parsed.length,this.parsed.push({array_index:b,group:!0,label:this.escapeExpression(a.label),children:0,disabled:a.disabled}),f=a.childNodes,g=[],d=0,e=f.length;e>d;d++)c=f[d],g.push(this.add_option(c,b,a.disabled));return g},SelectParser.prototype.add_option=function(a,b,c){return"OPTION"===a.nodeName.toUpperCase()?(""!==a.text?(null!=b&&(this.parsed[b].children+=1),this.parsed.push({array_index:this.parsed.length,options_index:this.options_index,value:a.value,text:a.text,html:a.innerHTML,selected:a.selected,disabled:c===!0?c:a.disabled,group_array_index:b,classes:a.className,style:a.style.cssText})):this.parsed.push({array_index:this.parsed.length,options_index:this.options_index,empty:!0}),this.options_index+=1):void 0},SelectParser.prototype.escapeExpression=function(a){var b,c;return null==a||a===!1?"":/[\&\<\>\"\'\`]/.test(a)?(b={"<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;","`":"&#x60;"},c=/&(?!\w+;)|[\<\>\"\'\`]/g,a.replace(c,function(a){return b[a]||"&amp;"})):a},SelectParser}(),SelectParser.select_to_array=function(a){var b,c,d,e,f;for(c=new SelectParser,f=a.childNodes,d=0,e=f.length;e>d;d++)b=f[d],c.add_node(b);return c.parsed},AbstractChosen=function(){function AbstractChosen(a,b){this.form_field=a,this.options=null!=b?b:{},AbstractChosen.browser_is_supported()&&(this.is_multiple=this.form_field.multiple,this.set_default_text(),this.set_default_values(),this.setup(),this.set_up_html(),this.register_observers())}return AbstractChosen.prototype.set_default_values=function(){var a=this;return this.click_test_action=function(b){return a.test_active_click(b)},this.activate_action=function(b){return a.activate_field(b)},this.active_field=!1,this.mouse_on_container=!1,this.results_showing=!1,this.result_highlighted=null,this.allow_single_deselect=null!=this.options.allow_single_deselect&&null!=this.form_field.options[0]&&""===this.form_field.options[0].text?this.options.allow_single_deselect:!1,this.disable_search_threshold=this.options.disable_search_threshold||0,this.disable_search=this.options.disable_search||!1,this.enable_split_word_search=null!=this.options.enable_split_word_search?this.options.enable_split_word_search:!0,this.group_search=null!=this.options.group_search?this.options.group_search:!0,this.search_contains=this.options.search_contains||!1,this.single_backstroke_delete=null!=this.options.single_backstroke_delete?this.options.single_backstroke_delete:!0,this.max_selected_options=this.options.max_selected_options||1/0,this.inherit_select_classes=this.options.inherit_select_classes||!1,this.display_selected_options=null!=this.options.display_selected_options?this.options.display_selected_options:!0,this.display_disabled_options=null!=this.options.display_disabled_options?this.options.display_disabled_options:!0},AbstractChosen.prototype.set_default_text=function(){return this.default_text=this.form_field.getAttribute("data-placeholder")?this.form_field.getAttribute("data-placeholder"):this.is_multiple?this.options.placeholder_text_multiple||this.options.placeholder_text||AbstractChosen.default_multiple_text:this.options.placeholder_text_single||this.options.placeholder_text||AbstractChosen.default_single_text,this.results_none_found=this.form_field.getAttribute("data-no_results_text")||this.options.no_results_text||AbstractChosen.default_no_result_text},AbstractChosen.prototype.mouse_enter=function(){return this.mouse_on_container=!0},AbstractChosen.prototype.mouse_leave=function(){return this.mouse_on_container=!1},AbstractChosen.prototype.input_focus=function(){var a=this;if(this.is_multiple){if(!this.active_field)return setTimeout(function(){return a.container_mousedown()},50)}else if(!this.active_field)return this.activate_field()},AbstractChosen.prototype.input_blur=function(){var a=this;return this.mouse_on_container?void 0:(this.active_field=!1,setTimeout(function(){return a.blur_test()},100))},AbstractChosen.prototype.results_option_build=function(a){var b,c,d,e,f;for(b="",f=this.results_data,d=0,e=f.length;e>d;d++)c=f[d],b+=c.group?this.result_add_group(c):this.result_add_option(c),(null!=a?a.first:void 0)&&(c.selected&&this.is_multiple?this.choice_build(c):c.selected&&!this.is_multiple&&this.single_set_selected_text(c.text));return b},AbstractChosen.prototype.result_add_option=function(a){var b,c;return a.search_match?this.include_option_in_results(a)?(b=[],a.disabled||a.selected&&this.is_multiple||b.push("active-result"),!a.disabled||a.selected&&this.is_multiple||b.push("disabled-result"),a.selected&&b.push("result-selected"),null!=a.group_array_index&&b.push("group-option"),""!==a.classes&&b.push(a.classes),c=document.createElement("li"),c.className=b.join(" "),c.style.cssText=a.style,c.setAttribute("data-option-array-index",a.array_index),c.innerHTML=a.search_text,this.outerHTML(c)):"":""},AbstractChosen.prototype.result_add_group=function(a){var b;return a.search_match||a.group_match?a.active_options>0?(b=document.createElement("li"),b.className="group-result",b.innerHTML=a.search_text,this.outerHTML(b)):"":""},AbstractChosen.prototype.results_update_field=function(){return this.set_default_text(),this.is_multiple||this.results_reset_cleanup(),this.result_clear_highlight(),this.results_build(),this.results_showing?this.winnow_results():void 0},AbstractChosen.prototype.reset_single_select_options=function(){var a,b,c,d,e;for(d=this.results_data,e=[],b=0,c=d.length;c>b;b++)a=d[b],a.selected?e.push(a.selected=!1):e.push(void 0);return e},AbstractChosen.prototype.results_toggle=function(){return this.results_showing?this.results_hide():this.results_show()},AbstractChosen.prototype.results_search=function(){return this.results_showing?this.winnow_results():this.results_show()},AbstractChosen.prototype.winnow_results=function(){var a,b,c,d,e,f,g,h,i,j,k,l,m;for(this.no_results_clear(),e=0,g=this.get_search_text(),a=g.replace(/[-[\]{}()*+?.,\\^$|#\s]/g,"\\$&"),d=this.search_contains?"":"^",c=new RegExp(d+a,"i"),j=new RegExp(a,"i"),m=this.results_data,k=0,l=m.length;l>k;k++)b=m[k],b.search_match=!1,f=null,this.include_option_in_results(b)&&(b.group&&(b.group_match=!1,b.active_options=0),null!=b.group_array_index&&this.results_data[b.group_array_index]&&(f=this.results_data[b.group_array_index],0===f.active_options&&f.search_match&&(e+=1),f.active_options+=1),(!b.group||this.group_search)&&(b.search_text=b.group?b.label:b.html,b.search_match=this.search_string_match(b.search_text,c),b.search_match&&!b.group&&(e+=1),b.search_match?(g.length&&(h=b.search_text.search(j),i=b.search_text.substr(0,h+g.length)+"</em>"+b.search_text.substr(h+g.length),b.search_text=i.substr(0,h)+"<em>"+i.substr(h)),null!=f&&(f.group_match=!0)):null!=b.group_array_index&&this.results_data[b.group_array_index].search_match&&(b.search_match=!0)));return this.result_clear_highlight(),1>e&&g.length?(this.update_results_content(""),this.no_results(g)):(this.update_results_content(this.results_option_build()),this.winnow_results_set_highlight())},AbstractChosen.prototype.search_string_match=function(a,b){var c,d,e,f;if(b.test(a))return!0;if(this.enable_split_word_search&&(a.indexOf(" ")>=0||0===a.indexOf("["))&&(d=a.replace(/\[|\]/g,"").split(" "),d.length))for(e=0,f=d.length;f>e;e++)if(c=d[e],b.test(c))return!0},AbstractChosen.prototype.choices_count=function(){var a,b,c,d;if(null!=this.selected_option_count)return this.selected_option_count;for(this.selected_option_count=0,d=this.form_field.options,b=0,c=d.length;c>b;b++)a=d[b],a.selected&&(this.selected_option_count+=1);return this.selected_option_count},AbstractChosen.prototype.choices_click=function(a){return a.preventDefault(),this.results_showing||this.is_disabled?void 0:this.results_show()},AbstractChosen.prototype.keyup_checker=function(a){var b,c;switch(b=null!=(c=a.which)?c:a.keyCode,this.search_field_scale(),b){case 8:if(this.is_multiple&&this.backstroke_length<1&&this.choices_count()>0)return this.keydown_backstroke();if(!this.pending_backstroke)return this.result_clear_highlight(),this.results_search();break;case 13:if(a.preventDefault(),this.results_showing)return this.result_select(a);break;case 27:return this.results_showing&&this.results_hide(),!0;case 9:case 38:case 40:case 16:case 91:case 17:break;default:return this.results_search()}},AbstractChosen.prototype.clipboard_event_checker=function(){var a=this;return setTimeout(function(){return a.results_search()},50)},AbstractChosen.prototype.container_width=function(){return null!=this.options.width?this.options.width:""+this.form_field.offsetWidth+"px"},AbstractChosen.prototype.include_option_in_results=function(a){return this.is_multiple&&!this.display_selected_options&&a.selected?!1:!this.display_disabled_options&&a.disabled?!1:a.empty?!1:!0},AbstractChosen.prototype.search_results_touchstart=function(a){return this.touch_started=!0,this.search_results_mouseover(a)},AbstractChosen.prototype.search_results_touchmove=function(a){return this.touch_started=!1,this.search_results_mouseout(a)},AbstractChosen.prototype.search_results_touchend=function(a){return this.touch_started?this.search_results_mouseup(a):void 0},AbstractChosen.prototype.outerHTML=function(a){var b;return a.outerHTML?a.outerHTML:(b=document.createElement("div"),b.appendChild(a),b.innerHTML)},AbstractChosen.browser_is_supported=function(){return"Microsoft Internet Explorer"===window.navigator.appName?document.documentMode>=8:/iP(od|hone)/i.test(window.navigator.userAgent)?!1:/Android/i.test(window.navigator.userAgent)&&/Mobile/i.test(window.navigator.userAgent)?!1:!0},AbstractChosen.default_multiple_text="Select Some Options",AbstractChosen.default_single_text="Select an Option",AbstractChosen.default_no_result_text="No results match",AbstractChosen}(),a=jQuery,a.fn.extend({chosen:function(b){return AbstractChosen.browser_is_supported()?this.each(function(){var c,d;c=a(this),d=c.data("chosen"),"destroy"===b&&d?d.destroy():d||c.data("chosen",new Chosen(this,b))}):this}}),Chosen=function(c){function Chosen(){return b=Chosen.__super__.constructor.apply(this,arguments)}return d(Chosen,c),Chosen.prototype.setup=function(){return this.form_field_jq=a(this.form_field),this.current_selectedIndex=this.form_field.selectedIndex,this.is_rtl=this.form_field_jq.hasClass("chosen-rtl")},Chosen.prototype.set_up_html=function(){var b,c;return b=["chosen-container"],b.push("chosen-container-"+(this.is_multiple?"multi":"single")),this.inherit_select_classes&&this.form_field.className&&b.push(this.form_field.className),this.is_rtl&&b.push("chosen-rtl"),c={"class":b.join(" "),style:"width: "+this.container_width()+";",title:this.form_field.title},this.form_field.id.length&&(c.id=this.form_field.id.replace(/[^\w]/g,"_")+"_chosen"),this.container=a("<div />",c),this.is_multiple?this.container.html('<ul class="chosen-choices"><li class="search-field"><input type="text" value="'+this.default_text+'" class="default" autocomplete="off" style="width:25px;" /></li></ul><div class="chosen-drop"><ul class="chosen-results"></ul></div>'):this.container.html('<a class="chosen-single chosen-default" tabindex="-1"><span>'+this.default_text+'</span><div><b></b></div></a><div class="chosen-drop"><div class="chosen-search"><input type="text" autocomplete="off" /></div><ul class="chosen-results"></ul></div>'),this.form_field_jq.hide().after(this.container),this.dropdown=this.container.find("div.chosen-drop").first(),this.search_field=this.container.find("input").first(),this.search_results=this.container.find("ul.chosen-results").first(),this.search_field_scale(),this.search_no_results=this.container.find("li.no-results").first(),this.is_multiple?(this.search_choices=this.container.find("ul.chosen-choices").first(),this.search_container=this.container.find("li.search-field").first()):(this.search_container=this.container.find("div.chosen-search").first(),this.selected_item=this.container.find(".chosen-single").first()),this.results_build(),this.set_tab_index(),this.set_label_behavior(),this.form_field_jq.trigger("chosen:ready",{chosen:this})},Chosen.prototype.register_observers=function(){var a=this;return this.container.bind("mousedown.chosen",function(b){a.container_mousedown(b)}),this.container.bind("mouseup.chosen",function(b){a.container_mouseup(b)}),this.container.bind("mouseenter.chosen",function(b){a.mouse_enter(b)}),this.container.bind("mouseleave.chosen",function(b){a.mouse_leave(b)}),this.search_results.bind("mouseup.chosen",function(b){a.search_results_mouseup(b)}),this.search_results.bind("mouseover.chosen",function(b){a.search_results_mouseover(b)}),this.search_results.bind("mouseout.chosen",function(b){a.search_results_mouseout(b)}),this.search_results.bind("mousewheel.chosen DOMMouseScroll.chosen",function(b){a.search_results_mousewheel(b)}),this.search_results.bind("touchstart.chosen",function(b){a.search_results_touchstart(b)}),this.search_results.bind("touchmove.chosen",function(b){a.search_results_touchmove(b)}),this.search_results.bind("touchend.chosen",function(b){a.search_results_touchend(b)}),this.form_field_jq.bind("chosen:updated.chosen",function(b){a.results_update_field(b)}),this.form_field_jq.bind("chosen:activate.chosen",function(b){a.activate_field(b)}),this.form_field_jq.bind("chosen:open.chosen",function(b){a.container_mousedown(b)}),this.form_field_jq.bind("chosen:close.chosen",function(b){a.input_blur(b)}),this.search_field.bind("blur.chosen",function(b){a.input_blur(b)}),this.search_field.bind("keyup.chosen",function(b){a.keyup_checker(b)}),this.search_field.bind("keydown.chosen",function(b){a.keydown_checker(b)}),this.search_field.bind("focus.chosen",function(b){a.input_focus(b)}),this.search_field.bind("cut.chosen",function(b){a.clipboard_event_checker(b)}),this.search_field.bind("paste.chosen",function(b){a.clipboard_event_checker(b)}),this.is_multiple?this.search_choices.bind("click.chosen",function(b){a.choices_click(b)}):this.container.bind("click.chosen",function(a){a.preventDefault()})},Chosen.prototype.destroy=function(){return a(this.container[0].ownerDocument).unbind("click.chosen",this.click_test_action),this.search_field[0].tabIndex&&(this.form_field_jq[0].tabIndex=this.search_field[0].tabIndex),this.container.remove(),this.form_field_jq.removeData("chosen"),this.form_field_jq.show()},Chosen.prototype.search_field_disabled=function(){return this.is_disabled=this.form_field_jq[0].disabled,this.is_disabled?(this.container.addClass("chosen-disabled"),this.search_field[0].disabled=!0,this.is_multiple||this.selected_item.unbind("focus.chosen",this.activate_action),this.close_field()):(this.container.removeClass("chosen-disabled"),this.search_field[0].disabled=!1,this.is_multiple?void 0:this.selected_item.bind("focus.chosen",this.activate_action))},Chosen.prototype.container_mousedown=function(b){return this.is_disabled||(b&&"mousedown"===b.type&&!this.results_showing&&b.preventDefault(),null!=b&&a(b.target).hasClass("search-choice-close"))?void 0:(this.active_field?this.is_multiple||!b||a(b.target)[0]!==this.selected_item[0]&&!a(b.target).parents("a.chosen-single").length||(b.preventDefault(),this.results_toggle()):(this.is_multiple&&this.search_field.val(""),a(this.container[0].ownerDocument).bind("click.chosen",this.click_test_action),this.results_show()),this.activate_field())},Chosen.prototype.container_mouseup=function(a){return"ABBR"!==a.target.nodeName||this.is_disabled?void 0:this.results_reset(a)},Chosen.prototype.search_results_mousewheel=function(a){var b;return a.originalEvent&&(b=-a.originalEvent.wheelDelta||a.originalEvent.detail),null!=b?(a.preventDefault(),"DOMMouseScroll"===a.type&&(b=40*b),this.search_results.scrollTop(b+this.search_results.scrollTop())):void 0},Chosen.prototype.blur_test=function(){return!this.active_field&&this.container.hasClass("chosen-container-active")?this.close_field():void 0},Chosen.prototype.close_field=function(){return a(this.container[0].ownerDocument).unbind("click.chosen",this.click_test_action),this.active_field=!1,this.results_hide(),this.container.removeClass("chosen-container-active"),this.clear_backstroke(),this.show_search_field_default(),this.search_field_scale()},Chosen.prototype.activate_field=function(){return this.container.addClass("chosen-container-active"),this.active_field=!0,this.search_field.val(this.search_field.val()),this.search_field.focus()},Chosen.prototype.test_active_click=function(b){var c;return c=a(b.target).closest(".chosen-container"),c.length&&this.container[0]===c[0]?this.active_field=!0:this.close_field()},Chosen.prototype.results_build=function(){return this.parsing=!0,this.selected_option_count=null,this.results_data=SelectParser.select_to_array(this.form_field),this.is_multiple?this.search_choices.find("li.search-choice").remove():this.is_multiple||(this.single_set_selected_text(),this.disable_search||this.form_field.options.length<=this.disable_search_threshold?(this.search_field[0].readOnly=!0,this.container.addClass("chosen-container-single-nosearch")):(this.search_field[0].readOnly=!1,this.container.removeClass("chosen-container-single-nosearch"))),this.update_results_content(this.results_option_build({first:!0})),this.search_field_disabled(),this.show_search_field_default(),this.search_field_scale(),this.parsing=!1},Chosen.prototype.result_do_highlight=function(a){var b,c,d,e,f;if(a.length){if(this.result_clear_highlight(),this.result_highlight=a,this.result_highlight.addClass("highlighted"),d=parseInt(this.search_results.css("maxHeight"),10),f=this.search_results.scrollTop(),e=d+f,c=this.result_highlight.position().top+this.search_results.scrollTop(),b=c+this.result_highlight.outerHeight(),b>=e)return this.search_results.scrollTop(b-d>0?b-d:0);if(f>c)return this.search_results.scrollTop(c)}},Chosen.prototype.result_clear_highlight=function(){return this.result_highlight&&this.result_highlight.removeClass("highlighted"),this.result_highlight=null},Chosen.prototype.results_show=function(){return this.is_multiple&&this.max_selected_options<=this.choices_count()?(this.form_field_jq.trigger("chosen:maxselected",{chosen:this}),!1):(this.container.addClass("chosen-with-drop"),this.results_showing=!0,this.search_field.focus(),this.search_field.val(this.search_field.val()),this.winnow_results(),this.form_field_jq.trigger("chosen:showing_dropdown",{chosen:this}))},Chosen.prototype.update_results_content=function(a){return this.search_results.html(a)},Chosen.prototype.results_hide=function(){return this.results_showing&&(this.result_clear_highlight(),this.container.removeClass("chosen-with-drop"),this.form_field_jq.trigger("chosen:hiding_dropdown",{chosen:this})),this.results_showing=!1},Chosen.prototype.set_tab_index=function(){var a;return this.form_field.tabIndex?(a=this.form_field.tabIndex,this.form_field.tabIndex=-1,this.search_field[0].tabIndex=a):void 0},Chosen.prototype.set_label_behavior=function(){var b=this;return this.form_field_label=this.form_field_jq.parents("label"),!this.form_field_label.length&&this.form_field.id.length&&(this.form_field_label=a("label[for='"+this.form_field.id+"']")),this.form_field_label.length>0?this.form_field_label.bind("click.chosen",function(a){return b.is_multiple?b.container_mousedown(a):b.activate_field()}):void 0},Chosen.prototype.show_search_field_default=function(){return this.is_multiple&&this.choices_count()<1&&!this.active_field?(this.search_field.val(this.default_text),this.search_field.addClass("default")):(this.search_field.val(""),this.search_field.removeClass("default"))},Chosen.prototype.search_results_mouseup=function(b){var c;return c=a(b.target).hasClass("active-result")?a(b.target):a(b.target).parents(".active-result").first(),c.length?(this.result_highlight=c,this.result_select(b),this.search_field.focus()):void 0},Chosen.prototype.search_results_mouseover=function(b){var c;return c=a(b.target).hasClass("active-result")?a(b.target):a(b.target).parents(".active-result").first(),c?this.result_do_highlight(c):void 0},Chosen.prototype.search_results_mouseout=function(b){return a(b.target).hasClass("active-result")?this.result_clear_highlight():void 0},Chosen.prototype.choice_build=function(b){var c,d,e=this;return c=a("<li />",{"class":"search-choice"}).html("<span>"+b.html+"</span>"),b.disabled?c.addClass("search-choice-disabled"):(d=a("<a />",{"class":"search-choice-close","data-option-array-index":b.array_index}),d.bind("click.chosen",function(a){return e.choice_destroy_link_click(a)}),c.append(d)),this.search_container.before(c)},Chosen.prototype.choice_destroy_link_click=function(b){return b.preventDefault(),b.stopPropagation(),this.is_disabled?void 0:this.choice_destroy(a(b.target))},Chosen.prototype.choice_destroy=function(a){return this.result_deselect(a[0].getAttribute("data-option-array-index"))?(this.show_search_field_default(),this.is_multiple&&this.choices_count()>0&&this.search_field.val().length<1&&this.results_hide(),a.parents("li").first().remove(),this.search_field_scale()):void 0},Chosen.prototype.results_reset=function(){return this.reset_single_select_options(),this.form_field.options[0].selected=!0,this.single_set_selected_text(),this.show_search_field_default(),this.results_reset_cleanup(),this.form_field_jq.trigger("change"),this.active_field?this.results_hide():void 0},Chosen.prototype.results_reset_cleanup=function(){return this.current_selectedIndex=this.form_field.selectedIndex,this.selected_item.find("abbr").remove()},Chosen.prototype.result_select=function(a){var b,c;return this.result_highlight?(b=this.result_highlight,this.result_clear_highlight(),this.is_multiple&&this.max_selected_options<=this.choices_count()?(this.form_field_jq.trigger("chosen:maxselected",{chosen:this}),!1):(this.is_multiple?b.removeClass("active-result"):this.reset_single_select_options(),c=this.results_data[b[0].getAttribute("data-option-array-index")],c.selected=!0,this.form_field.options[c.options_index].selected=!0,this.selected_option_count=null,this.is_multiple?this.choice_build(c):this.single_set_selected_text(c.text),(a.metaKey||a.ctrlKey)&&this.is_multiple||this.results_hide(),this.search_field.val(""),(this.is_multiple||this.form_field.selectedIndex!==this.current_selectedIndex)&&this.form_field_jq.trigger("change",{selected:this.form_field.options[c.options_index].value}),this.current_selectedIndex=this.form_field.selectedIndex,this.search_field_scale())):void 0},Chosen.prototype.single_set_selected_text=function(a){return null==a&&(a=this.default_text),a===this.default_text?this.selected_item.addClass("chosen-default"):(this.single_deselect_control_build(),this.selected_item.removeClass("chosen-default")),this.selected_item.find("span").text(a)},Chosen.prototype.result_deselect=function(a){var b;return b=this.results_data[a],this.form_field.options[b.options_index].disabled?!1:(b.selected=!1,this.form_field.options[b.options_index].selected=!1,this.selected_option_count=null,this.result_clear_highlight(),this.results_showing&&this.winnow_results(),this.form_field_jq.trigger("change",{deselected:this.form_field.options[b.options_index].value}),this.search_field_scale(),!0)},Chosen.prototype.single_deselect_control_build=function(){return this.allow_single_deselect?(this.selected_item.find("abbr").length||this.selected_item.find("span").first().after('<abbr class="search-choice-close"></abbr>'),this.selected_item.addClass("chosen-single-with-deselect")):void 0},Chosen.prototype.get_search_text=function(){return this.search_field.val()===this.default_text?"":a("<div/>").text(a.trim(this.search_field.val())).html()},Chosen.prototype.winnow_results_set_highlight=function(){var a,b;return b=this.is_multiple?[]:this.search_results.find(".result-selected.active-result"),a=b.length?b.first():this.search_results.find(".active-result").first(),null!=a?this.result_do_highlight(a):void 0},Chosen.prototype.no_results=function(b){var c;return c=a('<li class="no-results">'+this.results_none_found+' "<span></span>"</li>'),c.find("span").first().html(b),this.search_results.append(c),this.form_field_jq.trigger("chosen:no_results",{chosen:this})},Chosen.prototype.no_results_clear=function(){return this.search_results.find(".no-results").remove()},Chosen.prototype.keydown_arrow=function(){var a;return this.results_showing&&this.result_highlight?(a=this.result_highlight.nextAll("li.active-result").first())?this.result_do_highlight(a):void 0:this.results_show()},Chosen.prototype.keyup_arrow=function(){var a;return this.results_showing||this.is_multiple?this.result_highlight?(a=this.result_highlight.prevAll("li.active-result"),a.length?this.result_do_highlight(a.first()):(this.choices_count()>0&&this.results_hide(),this.result_clear_highlight())):void 0:this.results_show()},Chosen.prototype.keydown_backstroke=function(){var a;return this.pending_backstroke?(this.choice_destroy(this.pending_backstroke.find("a").first()),this.clear_backstroke()):(a=this.search_container.siblings("li.search-choice").last(),a.length&&!a.hasClass("search-choice-disabled")?(this.pending_backstroke=a,this.single_backstroke_delete?this.keydown_backstroke():this.pending_backstroke.addClass("search-choice-focus")):void 0)},Chosen.prototype.clear_backstroke=function(){return this.pending_backstroke&&this.pending_backstroke.removeClass("search-choice-focus"),this.pending_backstroke=null},Chosen.prototype.keydown_checker=function(a){var b,c;switch(b=null!=(c=a.which)?c:a.keyCode,this.search_field_scale(),8!==b&&this.pending_backstroke&&this.clear_backstroke(),b){case 8:this.backstroke_length=this.search_field.val().length;break;case 9:this.results_showing&&!this.is_multiple&&this.result_select(a),this.mouse_on_container=!1;break;case 13:a.preventDefault();break;case 38:a.preventDefault(),this.keyup_arrow();break;case 40:a.preventDefault(),this.keydown_arrow()}},Chosen.prototype.search_field_scale=function(){var b,c,d,e,f,g,h,i,j;if(this.is_multiple){for(d=0,h=0,f="position:absolute; left: -1000px; top: -1000px; display:none;",g=["font-size","font-style","font-weight","font-family","line-height","text-transform","letter-spacing"],i=0,j=g.length;j>i;i++)e=g[i],f+=e+":"+this.search_field.css(e)+";";return b=a("<div />",{style:f}),b.text(this.search_field.val()),a("body").append(b),h=b.width()+25,b.remove(),c=this.container.outerWidth(),h>c-10&&(h=c-10),this.search_field.css({width:h+"px"})}},Chosen}(AbstractChosen)}.call(this);
},{}],3:[function(require,module,exports){
/*!
 * # Semantic UI 1.11.4 - Dimmer
 * http://github.com/semantic-org/semantic-ui/
 *
 *
 * Copyright 2014 Contributors
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 */

;(function ( $, window, document, undefined ) {

"use strict";

$.fn.dimmer = function(parameters) {
  var
    $allModules     = $(this),

    time            = new Date().getTime(),
    performance     = [],

    query           = arguments[0],
    methodInvoked   = (typeof query == 'string'),
    queryArguments  = [].slice.call(arguments, 1),

    returnedValue
  ;

  $allModules
    .each(function() {
      var
        settings        = ( $.isPlainObject(parameters) )
          ? $.extend(true, {}, $.fn.dimmer.settings, parameters)
          : $.extend({}, $.fn.dimmer.settings),

        selector        = settings.selector,
        namespace       = settings.namespace,
        className       = settings.className,
        error           = settings.error,

        eventNamespace  = '.' + namespace,
        moduleNamespace = 'module-' + namespace,
        moduleSelector  = $allModules.selector || '',

        clickEvent      = ('ontouchstart' in document.documentElement)
          ? 'touchstart'
          : 'click',

        $module = $(this),
        $dimmer,
        $dimmable,

        element   = this,
        instance  = $module.data(moduleNamespace),
        module
      ;

      module = {

        preinitialize: function() {
          if( module.is.dimmer() ) {
            $dimmable = $module.parent();
            $dimmer   = $module;
          }
          else {
            $dimmable = $module;
            if( module.has.dimmer() ) {
              if(settings.dimmerName) {
                $dimmer = $dimmable.children(selector.dimmer).filter('.' + settings.dimmerName);
              }
              else {
                $dimmer = $dimmable.children(selector.dimmer);
              }
            }
            else {
              $dimmer = module.create();
            }
          }
        },

        initialize: function() {
          module.debug('Initializing dimmer', settings);
          if(settings.on == 'hover') {
            $dimmable
              .on('mouseenter' + eventNamespace, module.show)
              .on('mouseleave' + eventNamespace, module.hide)
            ;
          }
          else if(settings.on == 'click') {
            $dimmable
              .on(clickEvent + eventNamespace, module.toggle)
            ;
          }
          if( module.is.page() ) {
            module.debug('Setting as a page dimmer', $dimmable);
            module.set.pageDimmer();
          }

          if( module.is.closable() ) {
            module.verbose('Adding dimmer close event', $dimmer);
            $dimmer
              .on(clickEvent + eventNamespace, module.event.click)
            ;
          }
          module.set.dimmable();
          module.instantiate();
        },

        instantiate: function() {
          module.verbose('Storing instance of module', module);
          instance = module;
          $module
            .data(moduleNamespace, instance)
          ;
        },

        destroy: function() {
          module.verbose('Destroying previous module', $dimmer);
          $module
            .removeData(moduleNamespace)
          ;
          $dimmable
            .off(eventNamespace)
          ;
          $dimmer
            .off(eventNamespace)
          ;
        },

        event: {
          click: function(event) {
            module.verbose('Determining if event occured on dimmer', event);
            if( $dimmer.find(event.target).length === 0 || $(event.target).is(selector.content) ) {
              module.hide();
              event.stopImmediatePropagation();
            }
          }
        },

        addContent: function(element) {
          var
            $content = $(element)
          ;
          module.debug('Add content to dimmer', $content);
          if($content.parent()[0] !== $dimmer[0]) {
            $content.detach().appendTo($dimmer);
          }
        },

        create: function() {
          var
            $element = $( settings.template.dimmer() )
          ;
          if(settings.variation) {
            module.debug('Creating dimmer with variation', settings.variation);
            $element.addClass(className.variation);
          }
          if(settings.dimmerName) {
            module.debug('Creating named dimmer', settings.dimmerName);
            $element.addClass(settings.dimmerName);
          }
          $element
            .appendTo($dimmable)
          ;
          return $element;
        },

        show: function(callback) {
          callback = $.isFunction(callback)
            ? callback
            : function(){}
          ;
          module.debug('Showing dimmer', $dimmer, settings);
          if( (!module.is.dimmed() || module.is.animating()) && module.is.enabled() ) {
            module.animate.show(callback);
            settings.onShow.call(element);
            settings.onChange.call(element);
          }
          else {
            module.debug('Dimmer is already shown or disabled');
          }
        },

        hide: function(callback) {
          callback = $.isFunction(callback)
            ? callback
            : function(){}
          ;
          if( module.is.dimmed() || module.is.animating() ) {
            module.debug('Hiding dimmer', $dimmer);
            module.animate.hide(callback);
            settings.onHide.call(element);
            settings.onChange.call(element);
          }
          else {
            module.debug('Dimmer is not visible');
          }
        },

        toggle: function() {
          module.verbose('Toggling dimmer visibility', $dimmer);
          if( !module.is.dimmed() ) {
            module.show();
          }
          else {
            module.hide();
          }
        },

        animate: {
          show: function(callback) {
            callback = $.isFunction(callback)
              ? callback
              : function(){}
            ;
            if(settings.useCSS && $.fn.transition !== undefined && $dimmer.transition('is supported')) {
              if(settings.opacity !== 'auto') {
                module.set.opacity();
              }
              $dimmer
                .transition({
                  animation   : settings.transition + ' in',
                  queue       : false,
                  duration    : module.get.duration(),
                  useFailSafe : true,
                  onStart     : function() {
                    module.set.dimmed();
                  },
                  onComplete  : function() {
                    module.set.active();
                    callback();
                  }
                })
              ;
            }
            else {
              module.verbose('Showing dimmer animation with javascript');
              module.set.dimmed();
              if(settings.opacity == 'auto') {
                settings.opacity = 0.8;
              }
              $dimmer
                .stop()
                .css({
                  opacity : 0,
                  width   : '100%',
                  height  : '100%'
                })
                .fadeTo(module.get.duration(), settings.opacity, function() {
                  $dimmer.removeAttr('style');
                  module.set.active();
                  callback();
                })
              ;
            }
          },
          hide: function(callback) {
            callback = $.isFunction(callback)
              ? callback
              : function(){}
            ;
            if(settings.useCSS && $.fn.transition !== undefined && $dimmer.transition('is supported')) {
              module.verbose('Hiding dimmer with css');
              $dimmer
                .transition({
                  animation   : settings.transition + ' out',
                  queue       : false,
                  duration    : module.get.duration(),
                  useFailSafe : true,
                  onStart     : function() {
                    module.remove.dimmed();
                  },
                  onComplete  : function() {
                    module.remove.active();
                    callback();
                  }
                })
              ;
            }
            else {
              module.verbose('Hiding dimmer with javascript');
              module.remove.dimmed();
              $dimmer
                .stop()
                .fadeOut(module.get.duration(), function() {
                  module.remove.active();
                  $dimmer.removeAttr('style');
                  callback();
                })
              ;
            }
          }
        },

        get: {
          dimmer: function() {
            return $dimmer;
          },
          duration: function() {
            if(typeof settings.duration == 'object') {
              if( module.is.active() ) {
                return settings.duration.hide;
              }
              else {
                return settings.duration.show;
              }
            }
            return settings.duration;
          }
        },

        has: {
          dimmer: function() {
            if(settings.dimmerName) {
              return ($module.children(selector.dimmer).filter('.' + settings.dimmerName).length > 0);
            }
            else {
              return ( $module.children(selector.dimmer).length > 0 );
            }
          }
        },

        is: {
          active: function() {
            return $dimmer.hasClass(className.active);
          },
          animating: function() {
            return ( $dimmer.is(':animated') || $dimmer.hasClass(className.animating) );
          },
          closable: function() {
            if(settings.closable == 'auto') {
              if(settings.on == 'hover') {
                return false;
              }
              return true;
            }
            return settings.closable;
          },
          dimmer: function() {
            return $module.is(selector.dimmer);
          },
          dimmable: function() {
            return $module.is(selector.dimmable);
          },
          dimmed: function() {
            return $dimmable.hasClass(className.dimmed);
          },
          disabled: function() {
            return $dimmable.hasClass(className.disabled);
          },
          enabled: function() {
            return !module.is.disabled();
          },
          page: function () {
            return $dimmable.is('body');
          },
          pageDimmer: function() {
            return $dimmer.hasClass(className.pageDimmer);
          }
        },

        can: {
          show: function() {
            return !$dimmer.hasClass(className.disabled);
          }
        },

        set: {
          opacity: function(opacity) {
            var
              opacity    = settings.opacity || opacity,
              color      = $dimmer.css('background-color'),
              colorArray = color.split(','),
              isRGBA     = (colorArray && colorArray.length == 4)
            ;
            if(isRGBA) {
              colorArray[3] = opacity + ')';
              color         = colorArray.join(',');
            }
            else {
              color = 'rgba(0, 0, 0, ' + opacity + ')';
            }
            module.debug('Setting opacity to', opacity);
            $dimmer.css('background-color', color);
          },
          active: function() {
            $dimmer.addClass(className.active);
          },
          dimmable: function() {
            $dimmable.addClass(className.dimmable);
          },
          dimmed: function() {
            $dimmable.addClass(className.dimmed);
          },
          pageDimmer: function() {
            $dimmer.addClass(className.pageDimmer);
          },
          disabled: function() {
            $dimmer.addClass(className.disabled);
          }
        },

        remove: {
          active: function() {
            $dimmer
              .removeClass(className.active)
            ;
          },
          dimmed: function() {
            $dimmable.removeClass(className.dimmed);
          },
          disabled: function() {
            $dimmer.removeClass(className.disabled);
          }
        },

        setting: function(name, value) {
          module.debug('Changing setting', name, value);
          if( $.isPlainObject(name) ) {
            $.extend(true, settings, name);
          }
          else if(value !== undefined) {
            settings[name] = value;
          }
          else {
            return settings[name];
          }
        },
        internal: function(name, value) {
          if( $.isPlainObject(name) ) {
            $.extend(true, module, name);
          }
          else if(value !== undefined) {
            module[name] = value;
          }
          else {
            return module[name];
          }
        },
        debug: function() {
          if(settings.debug) {
            if(settings.performance) {
              module.performance.log(arguments);
            }
            else {
              module.debug = Function.prototype.bind.call(console.info, console, settings.name + ':');
              module.debug.apply(console, arguments);
            }
          }
        },
        verbose: function() {
          if(settings.verbose && settings.debug) {
            if(settings.performance) {
              module.performance.log(arguments);
            }
            else {
              module.verbose = Function.prototype.bind.call(console.info, console, settings.name + ':');
              module.verbose.apply(console, arguments);
            }
          }
        },
        error: function() {
          module.error = Function.prototype.bind.call(console.error, console, settings.name + ':');
          module.error.apply(console, arguments);
        },
        performance: {
          log: function(message) {
            var
              currentTime,
              executionTime,
              previousTime
            ;
            if(settings.performance) {
              currentTime   = new Date().getTime();
              previousTime  = time || currentTime;
              executionTime = currentTime - previousTime;
              time          = currentTime;
              performance.push({
                'Name'           : message[0],
                'Arguments'      : [].slice.call(message, 1) || '',
                'Element'        : element,
                'Execution Time' : executionTime
              });
            }
            clearTimeout(module.performance.timer);
            module.performance.timer = setTimeout(module.performance.display, 100);
          },
          display: function() {
            var
              title = settings.name + ':',
              totalTime = 0
            ;
            time = false;
            clearTimeout(module.performance.timer);
            $.each(performance, function(index, data) {
              totalTime += data['Execution Time'];
            });
            title += ' ' + totalTime + 'ms';
            if(moduleSelector) {
              title += ' \'' + moduleSelector + '\'';
            }
            if($allModules.length > 1) {
              title += ' ' + '(' + $allModules.length + ')';
            }
            if( (console.group !== undefined || console.table !== undefined) && performance.length > 0) {
              console.groupCollapsed(title);
              if(console.table) {
                console.table(performance);
              }
              else {
                $.each(performance, function(index, data) {
                  console.log(data['Name'] + ': ' + data['Execution Time']+'ms');
                });
              }
              console.groupEnd();
            }
            performance = [];
          }
        },
        invoke: function(query, passedArguments, context) {
          var
            object = instance,
            maxDepth,
            found,
            response
          ;
          passedArguments = passedArguments || queryArguments;
          context         = element         || context;
          if(typeof query == 'string' && object !== undefined) {
            query    = query.split(/[\. ]/);
            maxDepth = query.length - 1;
            $.each(query, function(depth, value) {
              var camelCaseValue = (depth != maxDepth)
                ? value + query[depth + 1].charAt(0).toUpperCase() + query[depth + 1].slice(1)
                : query
              ;
              if( $.isPlainObject( object[camelCaseValue] ) && (depth != maxDepth) ) {
                object = object[camelCaseValue];
              }
              else if( object[camelCaseValue] !== undefined ) {
                found = object[camelCaseValue];
                return false;
              }
              else if( $.isPlainObject( object[value] ) && (depth != maxDepth) ) {
                object = object[value];
              }
              else if( object[value] !== undefined ) {
                found = object[value];
                return false;
              }
              else {
                module.error(error.method, query);
                return false;
              }
            });
          }
          if ( $.isFunction( found ) ) {
            response = found.apply(context, passedArguments);
          }
          else if(found !== undefined) {
            response = found;
          }
          if($.isArray(returnedValue)) {
            returnedValue.push(response);
          }
          else if(returnedValue !== undefined) {
            returnedValue = [returnedValue, response];
          }
          else if(response !== undefined) {
            returnedValue = response;
          }
          return found;
        }
      };

      module.preinitialize();

      if(methodInvoked) {
        if(instance === undefined) {
          module.initialize();
        }
        module.invoke(query);
      }
      else {
        if(instance !== undefined) {
          instance.invoke('destroy');
        }
        module.initialize();
      }
    })
  ;

  return (returnedValue !== undefined)
    ? returnedValue
    : this
  ;
};

$.fn.dimmer.settings = {

  name        : 'Dimmer',
  namespace   : 'dimmer',

  debug       : false,
  verbose     : true,
  performance : true,

  // name to distinguish between multiple dimmers in context
  dimmerName  : false,

  // whether to add a variation type
  variation   : false,

  // whether to bind close events
  closable    : 'auto',

  // whether to use css animations
  useCSS      : true,

  // css animation to use
  transition  : 'fade',

  // event to bind to
  on          : false,

  // overriding opacity value
  opacity     : 'auto',

  // transition durations
  duration    : {
    show : 500,
    hide : 500
  },

  onChange    : function(){},
  onShow      : function(){},
  onHide      : function(){},

  error   : {
    method   : 'The method you called is not defined.'
  },

  selector: {
    dimmable : '.dimmable',
    dimmer   : '.ui.dimmer',
    content  : '.ui.dimmer > .content, .ui.dimmer > .content > .center'
  },

  template: {
    dimmer: function() {
     return $('<div />').attr('class', 'ui dimmer');
    }
  },

  className : {
    active     : 'active',
    animating  : 'animating',
    dimmable   : 'dimmable',
    dimmed     : 'dimmed',
    disabled   : 'disabled',
    hide       : 'hide',
    pageDimmer : 'page',
    show       : 'show'
  }

};

})( jQuery, window , document );
},{}],4:[function(require,module,exports){
/*!
 * Scroll Lock v1.1.1
 * https://github.com/MohammadYounes/jquery-scrollLock
 *
 * Copyright (c) 2014 Mohammad Younes
 * Licensed under the MIT license.
 */
(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['jquery'], factory);
  } else {
    // Browser globals
    factory(jQuery);
  }
}(function ($) {

  var eventName = "onmousewheel" in window ? (("ActiveXObject" in window) ? "wheel" : "mousewheel") : "DOMMouseScroll";
  var eventNamespace = ".scrollLock";

  var old = $.fn.scrollLock;
  $.fn.scrollLock = function (toggle, selector, force) {

    if (typeof selector !== 'string')
      selector = null;

    if ((toggle !== undefined && !toggle) || toggle === 'off')
      return this.each(function () {
        $(this).off(eventNamespace);
      });
    else
      return this.each(function () {
        $(this).on(eventName + eventNamespace, selector, function (event) {
          //allow zooming
          if (!event.ctrlKey) {
            var $this = $(this);
            if (force === true || hasVerticalScroll($this)) {
              //Support for nested scrollable blocks (see https://github.com/MohammadYounes/jquery-scrollLock/issues/4)
              event.stopPropagation();
              var scrollTop = $this.scrollTop(),
                  scrollHeight = $this.prop('scrollHeight'),
                  clientHeight = $this.prop('clientHeight'),
                  delta = event.originalEvent.wheelDelta || (-1 * event.originalEvent.detail) || (-1 * event.originalEvent.deltaY),
                  deltaY = 0
              ;
              if (event.type === "wheel") {
                var ratio = $this.height() / $(window).height();
                deltaY = event.originalEvent.deltaY * ratio;
              }
              if (delta > 0 && scrollTop + deltaY <= 0 || delta < 0 && scrollTop + deltaY >= scrollHeight - clientHeight) {
                event.preventDefault();
                if (deltaY)
                  $this.scrollTop(scrollTop + deltaY);
              }
            }
          }
        });
      });
  };
  function hasVerticalScroll($element) {
    var clientWidth = $element.prop('clientWidth'),
        offsetWidth = $element.prop('offsetWidth'),
        borderRightWidth = parseInt($element.css('border-right-width'), 10),
        borderLeftWidth = parseInt($element.css('border-left-width'), 10)
    ;

    return clientWidth + borderLeftWidth + borderRightWidth < offsetWidth;
  }
  // no conflict
  $.fn.scrollLock.noConflict = function () {
    $.fn.scrollLock = old;
    return this;
  };
}));

},{}],5:[function(require,module,exports){
/*! noUiSlider - 7.0.10 - 2014-12-27 14:50:46 */

/*jslint browser: true */
/*jslint white: true */

(function( $ ){

	'use strict';


	// Removes duplicates from an array.
	function unique(array) {
		return $.grep(array, function(el, index) {
			return index === $.inArray(el, array);
		});
	}

	// Round a value to the closest 'to'.
	function closest ( value, to ) {
		return Math.round(value / to) * to;
	}

	// Checks whether a value is numerical.
	function isNumeric ( a ) {
		return typeof a === 'number' && !isNaN( a ) && isFinite( a );
	}

	// Rounds a number to 7 supported decimals.
	function accurateNumber( number ) {
		var p = Math.pow(10, 7);
		return Number((Math.round(number*p)/p).toFixed(7));
	}

	// Sets a class and removes it after [duration] ms.
	function addClassFor ( element, className, duration ) {
		element.addClass(className);
		setTimeout(function(){
			element.removeClass(className);
		}, duration);
	}

	// Limits a value to 0 - 100
	function limit ( a ) {
		return Math.max(Math.min(a, 100), 0);
	}

	// Wraps a variable as an array, if it isn't one yet.
	function asArray ( a ) {
		return $.isArray(a) ? a : [a];
	}

	// Counts decimals
	function countDecimals ( numStr ) {
		var pieces = numStr.split(".");
		return pieces.length > 1 ? pieces[1].length : 0;
	}


	var
	// Cache the document selector;
	/** @const */
	doc = $(document),
	// Make a backup of the original jQuery/Zepto .val() method.
	/** @const */
	$val = $.fn.val,
	// Namespace for binding and unbinding slider events;
	/** @const */
	namespace = '.nui',
	// Determine the events to bind. IE11 implements pointerEvents without
	// a prefix, which breaks compatibility with the IE10 implementation.
	/** @const */
	actions = window.navigator.pointerEnabled ? {
		start: 'pointerdown',
		move: 'pointermove',
		end: 'pointerup'
	} : window.navigator.msPointerEnabled ? {
		start: 'MSPointerDown',
		move: 'MSPointerMove',
		end: 'MSPointerUp'
	} : {
		start: 'mousedown touchstart',
		move: 'mousemove touchmove',
		end: 'mouseup touchend'
	},
	// Re-usable list of classes;
	/** @const */
	Classes = [
/*  0 */  'noUi-target'
/*  1 */ ,'noUi-base'
/*  2 */ ,'noUi-origin'
/*  3 */ ,'noUi-handle'
/*  4 */ ,'noUi-horizontal'
/*  5 */ ,'noUi-vertical'
/*  6 */ ,'noUi-background'
/*  7 */ ,'noUi-connect'
/*  8 */ ,'noUi-ltr'
/*  9 */ ,'noUi-rtl'
/* 10 */ ,'noUi-dragable'
/* 11 */ ,''
/* 12 */ ,'noUi-state-drag'
/* 13 */ ,''
/* 14 */ ,'noUi-state-tap'
/* 15 */ ,'noUi-active'
/* 16 */ ,''
/* 17 */ ,'noUi-stacking'
	];


// Value calculation

	// Determine the size of a sub-range in relation to a full range.
	function subRangeRatio ( pa, pb ) {
		return (100 / (pb - pa));
	}

	// (percentage) How many percent is this value of this range?
	function fromPercentage ( range, value ) {
		return (value * 100) / ( range[1] - range[0] );
	}

	// (percentage) Where is this value on this range?
	function toPercentage ( range, value ) {
		return fromPercentage( range, range[0] < 0 ?
			value + Math.abs(range[0]) :
				value - range[0] );
	}

	// (value) How much is this percentage on this range?
	function isPercentage ( range, value ) {
		return ((value * ( range[1] - range[0] )) / 100) + range[0];
	}


// Range conversion

	function getJ ( value, arr ) {

		var j = 1;

		while ( value >= arr[j] ){
			j += 1;
		}

		return j;
	}

	// (percentage) Input a value, find where, on a scale of 0-100, it applies.
	function toStepping ( xVal, xPct, value ) {

		if ( value >= xVal.slice(-1)[0] ){
			return 100;
		}

		var j = getJ( value, xVal ), va, vb, pa, pb;

		va = xVal[j-1];
		vb = xVal[j];
		pa = xPct[j-1];
		pb = xPct[j];

		return pa + (toPercentage([va, vb], value) / subRangeRatio (pa, pb));
	}

	// (value) Input a percentage, find where it is on the specified range.
	function fromStepping ( xVal, xPct, value ) {

		// There is no range group that fits 100
		if ( value >= 100 ){
			return xVal.slice(-1)[0];
		}

		var j = getJ( value, xPct ), va, vb, pa, pb;

		va = xVal[j-1];
		vb = xVal[j];
		pa = xPct[j-1];
		pb = xPct[j];

		return isPercentage([va, vb], (value - pa) * subRangeRatio (pa, pb));
	}

	// (percentage) Get the step that applies at a certain value.
	function getStep ( xPct, xSteps, snap, value ) {

		if ( value === 100 ) {
			return value;
		}

		var j = getJ( value, xPct ), a, b;

		// If 'snap' is set, steps are used as fixed points on the slider.
		if ( snap ) {

			a = xPct[j-1];
			b = xPct[j];

			// Find the closest position, a or b.
			if ((value - a) > ((b-a)/2)){
				return b;
			}

			return a;
		}

		if ( !xSteps[j-1] ){
			return value;
		}

		return xPct[j-1] + closest(
			value - xPct[j-1],
			xSteps[j-1]
		);
	}


// Entry parsing

	function handleEntryPoint ( index, value, that ) {

		var percentage;

		// Wrap numerical input in an array.
		if ( typeof value === "number" ) {
			value = [value];
		}

		// Reject any invalid input, by testing whether value is an array.
		if ( Object.prototype.toString.call( value ) !== '[object Array]' ){
			throw new Error("noUiSlider: 'range' contains invalid value.");
		}

		// Covert min/max syntax to 0 and 100.
		if ( index === 'min' ) {
			percentage = 0;
		} else if ( index === 'max' ) {
			percentage = 100;
		} else {
			percentage = parseFloat( index );
		}

		// Check for correct input.
		if ( !isNumeric( percentage ) || !isNumeric( value[0] ) ) {
			throw new Error("noUiSlider: 'range' value isn't numeric.");
		}

		// Store values.
		that.xPct.push( percentage );
		that.xVal.push( value[0] );

		// NaN will evaluate to false too, but to keep
		// logging clear, set step explicitly. Make sure
		// not to override the 'step' setting with false.
		if ( !percentage ) {
			if ( !isNaN( value[1] ) ) {
				that.xSteps[0] = value[1];
			}
		} else {
			that.xSteps.push( isNaN(value[1]) ? false : value[1] );
		}
	}

	function handleStepPoint ( i, n, that ) {

		// Ignore 'false' stepping.
		if ( !n ) {
			return true;
		}

		// Factor to range ratio
		that.xSteps[i] = fromPercentage([
			 that.xVal[i]
			,that.xVal[i+1]
		], n) / subRangeRatio (
			that.xPct[i],
			that.xPct[i+1] );
	}


// Interface

	// The interface to Spectrum handles all direction-based
	// conversions, so the above values are unaware.

	function Spectrum ( entry, snap, direction, singleStep ) {

		this.xPct = [];
		this.xVal = [];
		this.xSteps = [ singleStep || false ];
		this.xNumSteps = [ false ];

		this.snap = snap;
		this.direction = direction;

		var index, ordered = [ /* [0, 'min'], [1, '50%'], [2, 'max'] */ ];

		// Map the object keys to an array.
		for ( index in entry ) {
			if ( entry.hasOwnProperty(index) ) {
				ordered.push([entry[index], index]);
			}
		}

		// Sort all entries by value (numeric sort).
		ordered.sort(function(a, b) { return a[0] - b[0]; });

		// Convert all entries to subranges.
		for ( index = 0; index < ordered.length; index++ ) {
			handleEntryPoint(ordered[index][1], ordered[index][0], this);
		}

		// Store the actual step values.
		// xSteps is sorted in the same order as xPct and xVal.
		this.xNumSteps = this.xSteps.slice(0);

		// Convert all numeric steps to the percentage of the subrange they represent.
		for ( index = 0; index < this.xNumSteps.length; index++ ) {
			handleStepPoint(index, this.xNumSteps[index], this);
		}
	}

	Spectrum.prototype.getMargin = function ( value ) {
		return this.xPct.length === 2 ? fromPercentage(this.xVal, value) : false;
	};

	Spectrum.prototype.toStepping = function ( value ) {

		value = toStepping( this.xVal, this.xPct, value );

		// Invert the value if this is a right-to-left slider.
		if ( this.direction ) {
			value = 100 - value;
		}

		return value;
	};

	Spectrum.prototype.fromStepping = function ( value ) {

		// Invert the value if this is a right-to-left slider.
		if ( this.direction ) {
			value = 100 - value;
		}

		return accurateNumber(fromStepping( this.xVal, this.xPct, value ));
	};

	Spectrum.prototype.getStep = function ( value ) {

		// Find the proper step for rtl sliders by search in inverse direction.
		// Fixes issue #262.
		if ( this.direction ) {
			value = 100 - value;
		}

		value = getStep(this.xPct, this.xSteps, this.snap, value );

		if ( this.direction ) {
			value = 100 - value;
		}

		return value;
	};

	Spectrum.prototype.getApplicableStep = function ( value ) {

		// If the value is 100%, return the negative step twice.
		var j = getJ(value, this.xPct), offset = value === 100 ? 2 : 1;
		return [this.xNumSteps[j-2], this.xVal[j-offset], this.xNumSteps[j-offset]];
	};

	// Outside testing
	Spectrum.prototype.convert = function ( value ) {
		return this.getStep(this.toStepping(value));
	};

/*	Every input option is tested and parsed. This'll prevent
	endless validation in internal methods. These tests are
	structured with an item for every option available. An
	option can be marked as required by setting the 'r' flag.
	The testing function is provided with three arguments:
		- The provided value for the option;
		- A reference to the options object;
		- The name for the option;

	The testing function returns false when an error is detected,
	or true when everything is OK. It can also modify the option
	object, to make sure all values can be correctly looped elsewhere. */

	/** @const */
	var defaultFormatter = { 'to': function( value ){
		return value.toFixed(2);
	}, 'from': Number };

	function testStep ( parsed, entry ) {

		if ( !isNumeric( entry ) ) {
			throw new Error("noUiSlider: 'step' is not numeric.");
		}

		// The step option can still be used to set stepping
		// for linear sliders. Overwritten if set in 'range'.
		parsed.singleStep = entry;
	}

	function testRange ( parsed, entry ) {

		// Filter incorrect input.
		if ( typeof entry !== 'object' || $.isArray(entry) ) {
			throw new Error("noUiSlider: 'range' is not an object.");
		}

		// Catch missing start or end.
		if ( entry.min === undefined || entry.max === undefined ) {
			throw new Error("noUiSlider: Missing 'min' or 'max' in 'range'.");
		}

		parsed.spectrum = new Spectrum(entry, parsed.snap, parsed.dir, parsed.singleStep);
	}

	function testStart ( parsed, entry ) {

		entry = asArray(entry);

		// Validate input. Values aren't tested, as the public .val method
		// will always provide a valid location.
		if ( !$.isArray( entry ) || !entry.length || entry.length > 2 ) {
			throw new Error("noUiSlider: 'start' option is incorrect.");
		}

		// Store the number of handles.
		parsed.handles = entry.length;

		// When the slider is initialized, the .val method will
		// be called with the start options.
		parsed.start = entry;
	}

	function testSnap ( parsed, entry ) {

		// Enforce 100% stepping within subranges.
		parsed.snap = entry;

		if ( typeof entry !== 'boolean' ){
			throw new Error("noUiSlider: 'snap' option must be a boolean.");
		}
	}

	function testAnimate ( parsed, entry ) {

		// Enforce 100% stepping within subranges.
		parsed.animate = entry;

		if ( typeof entry !== 'boolean' ){
			throw new Error("noUiSlider: 'animate' option must be a boolean.");
		}
	}

	function testConnect ( parsed, entry ) {

		if ( entry === 'lower' && parsed.handles === 1 ) {
			parsed.connect = 1;
		} else if ( entry === 'upper' && parsed.handles === 1 ) {
			parsed.connect = 2;
		} else if ( entry === true && parsed.handles === 2 ) {
			parsed.connect = 3;
		} else if ( entry === false ) {
			parsed.connect = 0;
		} else {
			throw new Error("noUiSlider: 'connect' option doesn't match handle count.");
		}
	}

	function testOrientation ( parsed, entry ) {

		// Set orientation to an a numerical value for easy
		// array selection.
		switch ( entry ){
		  case 'horizontal':
			parsed.ort = 0;
			break;
		  case 'vertical':
			parsed.ort = 1;
			break;
		  default:
			throw new Error("noUiSlider: 'orientation' option is invalid.");
		}
	}

	function testMargin ( parsed, entry ) {

		if ( !isNumeric(entry) ){
			throw new Error("noUiSlider: 'margin' option must be numeric.");
		}

		parsed.margin = parsed.spectrum.getMargin(entry);

		if ( !parsed.margin ) {
			throw new Error("noUiSlider: 'margin' option is only supported on linear sliders.");
		}
	}

	function testLimit ( parsed, entry ) {

		if ( !isNumeric(entry) ){
			throw new Error("noUiSlider: 'limit' option must be numeric.");
		}

		parsed.limit = parsed.spectrum.getMargin(entry);

		if ( !parsed.limit ) {
			throw new Error("noUiSlider: 'limit' option is only supported on linear sliders.");
		}
	}

	function testDirection ( parsed, entry ) {

		// Set direction as a numerical value for easy parsing.
		// Invert connection for RTL sliders, so that the proper
		// handles get the connect/background classes.
		switch ( entry ) {
		  case 'ltr':
			parsed.dir = 0;
			break;
		  case 'rtl':
			parsed.dir = 1;
			parsed.connect = [0,2,1,3][parsed.connect];
			break;
		  default:
			throw new Error("noUiSlider: 'direction' option was not recognized.");
		}
	}

	function testBehaviour ( parsed, entry ) {

		// Make sure the input is a string.
		if ( typeof entry !== 'string' ) {
			throw new Error("noUiSlider: 'behaviour' must be a string containing options.");
		}

		// Check if the string contains any keywords.
		// None are required.
		var tap = entry.indexOf('tap') >= 0,
			drag = entry.indexOf('drag') >= 0,
			fixed = entry.indexOf('fixed') >= 0,
			snap = entry.indexOf('snap') >= 0;

		parsed.events = {
			tap: tap || snap,
			drag: drag,
			fixed: fixed,
			snap: snap
		};
	}

	function testFormat ( parsed, entry ) {

		parsed.format = entry;

		// Any object with a to and from method is supported.
		if ( typeof entry.to === 'function' && typeof entry.from === 'function' ) {
			return true;
		}

		throw new Error( "noUiSlider: 'format' requires 'to' and 'from' methods.");
	}

	// Test all developer settings and parse to assumption-safe values.
	function testOptions ( options ) {

		var parsed = {
			margin: 0,
			limit: 0,
			animate: true,
			format: defaultFormatter
		}, tests;

		// Tests are executed in the order they are presented here.
		tests = {
			'step': { r: false, t: testStep },
			'start': { r: true, t: testStart },
			'connect': { r: true, t: testConnect },
			'direction': { r: true, t: testDirection },
			'snap': { r: false, t: testSnap },
			'animate': { r: false, t: testAnimate },
			'range': { r: true, t: testRange },
			'orientation': { r: false, t: testOrientation },
			'margin': { r: false, t: testMargin },
			'limit': { r: false, t: testLimit },
			'behaviour': { r: true, t: testBehaviour },
			'format': { r: false, t: testFormat }
		};

		// Set defaults where applicable.
		options = $.extend({
			'connect': false,
			'direction': 'ltr',
			'behaviour': 'tap',
			'orientation': 'horizontal'
		}, options);

		// Run all options through a testing mechanism to ensure correct
		// input. It should be noted that options might get modified to
		// be handled properly. E.g. wrapping integers in arrays.
		$.each( tests, function( name, test ){

			// If the option isn't set, but it is required, throw an error.
			if ( options[name] === undefined ) {

				if ( test.r ) {
					throw new Error("noUiSlider: '" + name + "' is required.");
				}

				return true;
			}

			test.t( parsed, options[name] );
		});

		// Pre-define the styles.
		parsed.style = parsed.ort ? 'top' : 'left';

		return parsed;
	}

// Class handling

	// Delimit proposed values for handle positions.
	function getPositions ( a, b, delimit ) {

		// Add movement to current position.
		var c = a + b[0], d = a + b[1];

		// Only alter the other position on drag,
		// not on standard sliding.
		if ( delimit ) {
			if ( c < 0 ) {
				d += Math.abs(c);
			}
			if ( d > 100 ) {
				c -= ( d - 100 );
			}

			// Limit values to 0 and 100.
			return [limit(c), limit(d)];
		}

		return [c,d];
	}


// Event handling

	// Provide a clean event with standardized offset values.
	function fixEvent ( e ) {

		// Prevent scrolling and panning on touch events, while
		// attempting to slide. The tap event also depends on this.
		e.preventDefault();

		// Filter the event to register the type, which can be
		// touch, mouse or pointer. Offset changes need to be
		// made on an event specific basis.
		var  touch = e.type.indexOf('touch') === 0
			,mouse = e.type.indexOf('mouse') === 0
			,pointer = e.type.indexOf('pointer') === 0
			,x,y, event = e;

		// IE10 implemented pointer events with a prefix;
		if ( e.type.indexOf('MSPointer') === 0 ) {
			pointer = true;
		}

		// Get the originalEvent, if the event has been wrapped
		// by jQuery. Zepto doesn't wrap the event.
		if ( e.originalEvent ) {
			e = e.originalEvent;
		}

		if ( touch ) {
			// noUiSlider supports one movement at a time,
			// so we can select the first 'changedTouch'.
			x = e.changedTouches[0].pageX;
			y = e.changedTouches[0].pageY;
		}

		if ( mouse || pointer ) {

			// Polyfill the pageXOffset and pageYOffset
			// variables for IE7 and IE8;
			if( !pointer && window.pageXOffset === undefined ){
				window.pageXOffset = document.documentElement.scrollLeft;
				window.pageYOffset = document.documentElement.scrollTop;
			}

			x = e.clientX + window.pageXOffset;
			y = e.clientY + window.pageYOffset;
		}

		event.points = [x, y];
		event.cursor = mouse;

		return event;
	}


// DOM additions

	// Append a handle to the base.
	function addHandle ( direction, index ) {

		var handle = $('<div><div/></div>').addClass( Classes[2] ),
			additions = [ '-lower', '-upper' ];

		if ( direction ) {
			additions.reverse();
		}

		handle.children().addClass(
			Classes[3] + " " + Classes[3]+additions[index]
		);

		return handle;
	}

	// Add the proper connection classes.
	function addConnection ( connect, target, handles ) {

		// Apply the required connection classes to the elements
		// that need them. Some classes are made up for several
		// segments listed in the class list, to allow easy
		// renaming and provide a minor compression benefit.
		switch ( connect ) {
			case 1:	target.addClass( Classes[7] );
					handles[0].addClass( Classes[6] );
					break;
			case 3: handles[1].addClass( Classes[6] );
					/* falls through */
			case 2: handles[0].addClass( Classes[7] );
					/* falls through */
			case 0: target.addClass(Classes[6]);
					break;
		}
	}

	// Add handles to the slider base.
	function addHandles ( nrHandles, direction, base ) {

		var index, handles = [];

		// Append handles.
		for ( index = 0; index < nrHandles; index += 1 ) {

			// Keep a list of all added handles.
			handles.push( addHandle( direction, index ).appendTo(base) );
		}

		return handles;
	}

	// Initialize a single slider.
	function addSlider ( direction, orientation, target ) {

		// Apply classes and data to the target.
		target.addClass([
			Classes[0],
			Classes[8 + direction],
			Classes[4 + orientation]
		].join(' '));

		return $('<div/>').appendTo(target).addClass( Classes[1] );
	}

function closure ( target, options, originalOptions ){

// Internal variables

	// All variables local to 'closure' are marked $.
	var $Target = $(target),
		$Locations = [-1, -1],
		$Base,
		$Handles,
		$Spectrum = options.spectrum,
		$Values = [],
	// libLink. For rtl sliders, 'lower' and 'upper' should not be inverted
	// for one-handle sliders, so trim 'upper' it that case.
		triggerPos = ['lower', 'upper'].slice(0, options.handles);

	// Invert the libLink connection for rtl sliders.
	if ( options.dir ) {
		triggerPos.reverse();
	}

// Helpers

	// Shorthand for base dimensions.
	function baseSize ( ) {
		return $Base[['width', 'height'][options.ort]]();
	}

	// External event handling
	function fireEvents ( events ) {

		// Use the external api to get the values.
		// Wrap the values in an array, as .trigger takes
		// only one additional argument.
		var index, values = [ $Target.val() ];

		for ( index = 0; index < events.length; index += 1 ){
			$Target.trigger(events[index], values);
		}
	}

	// Returns the input array, respecting the slider direction configuration.
	function inSliderOrder ( values ) {

		// If only one handle is used, return a single value.
		if ( values.length === 1 ){
			return values[0];
		}

		if ( options.dir ) {
			return values.reverse();
		}

		return values;
	}

// libLink integration

	// Create a new function which calls .val on input change.
	function createChangeHandler ( trigger ) {
		return function ( ignore, value ){
			// Determine which array position to 'null' based on 'trigger'.
			$Target.val( [ trigger ? null : value, trigger ? value : null ], true );
		};
	}

	// Called by libLink when it wants a set of links updated.
	function linkUpdate ( flag ) {

		var trigger = $.inArray(flag, triggerPos);

		// The API might not have been set yet.
		if ( $Target[0].linkAPI && $Target[0].linkAPI[flag] ) {
			$Target[0].linkAPI[flag].change(
				$Values[trigger],
				$Handles[trigger].children(),
				$Target
			);
		}
	}

	// Called by libLink to append an element to the slider.
	function linkConfirm ( flag, element ) {

		// Find the trigger for the passed flag.
		var trigger = $.inArray(flag, triggerPos);

		// If set, append the element to the handle it belongs to.
		if ( element ) {
			element.appendTo( $Handles[trigger].children() );
		}

		// The public API is reversed for rtl sliders, so the changeHandler
		// should not be aware of the inverted trigger positions.
		// On rtl slider with one handle, 'lower' should be used.
		if ( options.dir && options.handles > 1 ) {
			trigger = trigger === 1 ? 0 : 1;
		}

		return createChangeHandler( trigger );
	}

	// Place elements back on the slider.
	function reAppendLink ( ) {

		var i, flag;

		// The API keeps a list of elements: we can re-append them on rebuild.
		for ( i = 0; i < triggerPos.length; i += 1 ) {
			if ( this.linkAPI && this.linkAPI[(flag = triggerPos[i])] ) {
				this.linkAPI[flag].reconfirm(flag);
			}
		}
	}

	target.LinkUpdate = linkUpdate;
	target.LinkConfirm = linkConfirm;
	target.LinkDefaultFormatter = options.format;
	target.LinkDefaultFlag = 'lower';

	target.reappend = reAppendLink;


	// Handler for attaching events trough a proxy.
	function attach ( events, element, callback, data ) {

		// This function can be used to 'filter' events to the slider.

		// Add the noUiSlider namespace to all events.
		events = events.replace( /\s/g, namespace + ' ' ) + namespace;

		// Bind a closure on the target.
		return element.on( events, function( e ){

			// jQuery and Zepto (1) handle unset attributes differently,
			// but always falsy; #208
			if ( !!$Target.attr('disabled') ) {
				return false;
			}

			// Stop if an active 'tap' transition is taking place.
			if ( $Target.hasClass( Classes[14] ) ) {
				return false;
			}

			e = fixEvent(e);
			e.calcPoint = e.points[ options.ort ];

			// Call the event handler with the event [ and additional data ].
			callback ( e, data );
		});
	}

	// Handle movement on document for handle and range drag.
	function move ( event, data ) {

		var handles = data.handles || $Handles, positions, state = false,
			proposal = ((event.calcPoint - data.start) * 100) / baseSize(),
			h = handles[0][0] !== $Handles[0][0] ? 1 : 0;

		// Calculate relative positions for the handles.
		positions = getPositions( proposal, data.positions, handles.length > 1);

		state = setHandle ( handles[0], positions[h], handles.length === 1 );

		if ( handles.length > 1 ) {
			state = setHandle ( handles[1], positions[h?0:1], false ) || state;
		}

		// Fire the 'slide' event if any handle moved.
		if ( state ) {
			fireEvents(['slide']);
		}
	}

	// Unbind move events on document, call callbacks.
	function end ( event ) {

		// The handle is no longer active, so remove the class.
		$('.' + Classes[15]).removeClass(Classes[15]);

		// Remove cursor styles and text-selection events bound to the body.
		if ( event.cursor ) {
			$('body').css('cursor', '').off( namespace );
		}

		// Unbind the move and end events, which are added on 'start'.
		doc.off( namespace );

		// Remove dragging class.
		$Target.removeClass(Classes[12]);

		// Fire the change and set events.
		fireEvents(['set', 'change']);
	}

	// Bind move events on document.
	function start ( event, data ) {

		// Mark the handle as 'active' so it can be styled.
		if( data.handles.length === 1 ) {
			data.handles[0].children().addClass(Classes[15]);
		}

		// A drag should never propagate up to the 'tap' event.
		event.stopPropagation();

		// Attach the move event.
		attach ( actions.move, doc, move, {
			start: event.calcPoint,
			handles: data.handles,
			positions: [
				$Locations[0],
				$Locations[$Handles.length - 1]
			]
		});

		// Unbind all movement when the drag ends.
		attach ( actions.end, doc, end, null );

		// Text selection isn't an issue on touch devices,
		// so adding cursor styles can be skipped.
		if ( event.cursor ) {

			// Prevent the 'I' cursor and extend the range-drag cursor.
			$('body').css('cursor', $(event.target).css('cursor'));

			// Mark the target with a dragging state.
			if ( $Handles.length > 1 ) {
				$Target.addClass(Classes[12]);
			}

			// Prevent text selection when dragging the handles.
			$('body').on('selectstart' + namespace, false);
		}
	}

	// Move closest handle to tapped location.
	function tap ( event ) {

		var location = event.calcPoint, total = 0, to;

		// The tap event shouldn't propagate up and cause 'edge' to run.
		event.stopPropagation();

		// Add up the handle offsets.
		$.each( $Handles, function(){
			total += this.offset()[ options.style ];
		});

		// Find the handle closest to the tapped position.
		total = ( location < total/2 || $Handles.length === 1 ) ? 0 : 1;

		location -= $Base.offset()[ options.style ];

		// Calculate the new position.
		to = ( location * 100 ) / baseSize();

		if ( !options.events.snap ) {
			// Flag the slider as it is now in a transitional state.
			// Transition takes 300 ms, so re-enable the slider afterwards.
			addClassFor( $Target, Classes[14], 300 );
		}

		// Find the closest handle and calculate the tapped point.
		// The set handle to the new position.
		setHandle( $Handles[total], to );

		fireEvents(['slide', 'set', 'change']);

		if ( options.events.snap ) {
			start(event, { handles: [$Handles[total]] });
		}
	}

	// Attach events to several slider parts.
	function events ( behaviour ) {

		var i, drag;

		// Attach the standard drag event to the handles.
		if ( !behaviour.fixed ) {

			for ( i = 0; i < $Handles.length; i += 1 ) {

				// These events are only bound to the visual handle
				// element, not the 'real' origin element.
				attach ( actions.start, $Handles[i].children(), start, {
					handles: [ $Handles[i] ]
				});
			}
		}

		// Attach the tap event to the slider base.
		if ( behaviour.tap ) {

			attach ( actions.start, $Base, tap, {
				handles: $Handles
			});
		}

		// Make the range dragable.
		if ( behaviour.drag ){

			drag = $Base.find( '.' + Classes[7] ).addClass( Classes[10] );

			// When the range is fixed, the entire range can
			// be dragged by the handles. The handle in the first
			// origin will propagate the start event upward,
			// but it needs to be bound manually on the other.
			if ( behaviour.fixed ) {
				drag = drag.add($Base.children().not( drag ).children());
			}

			attach ( actions.start, drag, start, {
				handles: $Handles
			});
		}
	}


	// Test suggested values and apply margin, step.
	function setHandle ( handle, to, noLimitOption ) {

		var trigger = handle[0] !== $Handles[0][0] ? 1 : 0,
			lowerMargin = $Locations[0] + options.margin,
			upperMargin = $Locations[1] - options.margin,
			lowerLimit = $Locations[0] + options.limit,
			upperLimit = $Locations[1] - options.limit;

		// For sliders with multiple handles,
		// limit movement to the other handle.
		// Apply the margin option by adding it to the handle positions.
		if ( $Handles.length > 1 ) {
			to = trigger ? Math.max( to, lowerMargin ) : Math.min( to, upperMargin );
		}

		// The limit option has the opposite effect, limiting handles to a
		// maximum distance from another. Limit must be > 0, as otherwise
		// handles would be unmoveable. 'noLimitOption' is set to 'false'
		// for the .val() method, except for pass 4/4.
		if ( noLimitOption !== false && options.limit && $Handles.length > 1 ) {
			to = trigger ? Math.min ( to, lowerLimit ) : Math.max( to, upperLimit );
		}

		// Handle the step option.
		to = $Spectrum.getStep( to );

		// Limit to 0/100 for .val input, trim anything beyond 7 digits, as
		// JavaScript has some issues in its floating point implementation.
		to = limit(parseFloat(to.toFixed(7)));

		// Return false if handle can't move.
		if ( to === $Locations[trigger] ) {
			return false;
		}

		// Set the handle to the new position.
		handle.css( options.style, to + '%' );

		// Force proper handle stacking
		if ( handle.is(':first-child') ) {
			handle.toggleClass(Classes[17], to > 50 );
		}

		// Update locations.
		$Locations[trigger] = to;

		// Convert the value to the slider stepping/range.
		$Values[trigger] = $Spectrum.fromStepping( to );

		linkUpdate(triggerPos[trigger]);

		return true;
	}

	// Loop values from value method and apply them.
	function setValues ( count, values ) {

		var i, trigger, to;

		// With the limit option, we'll need another limiting pass.
		if ( options.limit ) {
			count += 1;
		}

		// If there are multiple handles to be set run the setting
		// mechanism twice for the first handle, to make sure it
		// can be bounced of the second one properly.
		for ( i = 0; i < count; i += 1 ) {

			trigger = i%2;

			// Get the current argument from the array.
			to = values[trigger];

			// Setting with null indicates an 'ignore'.
			// Inputting 'false' is invalid.
			if ( to !== null && to !== false ) {

				// If a formatted number was passed, attemt to decode it.
				if ( typeof to === 'number' ) {
					to = String(to);
				}

				to = options.format.from( to );

				// Request an update for all links if the value was invalid.
				// Do so too if setting the handle fails.
				if ( to === false || isNaN(to) || setHandle( $Handles[trigger], $Spectrum.toStepping( to ), i === (3 - options.dir) ) === false ) {

					linkUpdate(triggerPos[trigger]);
				}
			}
		}
	}

	// Set the slider value.
	function valueSet ( input ) {

		// LibLink: don't accept new values when currently emitting changes.
		if ( $Target[0].LinkIsEmitting ) {
			return this;
		}

		var count, values = asArray( input );

		// The RTL settings is implemented by reversing the front-end,
		// internal mechanisms are the same.
		if ( options.dir && options.handles > 1 ) {
			values.reverse();
		}

		// Animation is optional.
		// Make sure the initial values where set before using animated
		// placement. (no report, unit testing);
		if ( options.animate && $Locations[0] !== -1 ) {
			addClassFor( $Target, Classes[14], 300 );
		}

		// Determine how often to set the handles.
		count = $Handles.length > 1 ? 3 : 1;

		if ( values.length === 1 ) {
			count = 1;
		}

		setValues ( count, values );

		// Fire the 'set' event. As of noUiSlider 7,
		// this is no longer optional.
		fireEvents(['set']);

		return this;
	}

	// Get the slider value.
	function valueGet ( ) {

		var i, retour = [];

		// Get the value from all handles.
		for ( i = 0; i < options.handles; i += 1 ){
			retour[i] = options.format.to( $Values[i] );
		}

		return inSliderOrder( retour );
	}

	// Destroy the slider and unbind all events.
	function destroyTarget ( ) {

		// Unbind events on the slider, remove all classes and child elements.
		$(this).off(namespace)
			.removeClass(Classes.join(' '))
			.empty();

		delete this.LinkUpdate;
		delete this.LinkConfirm;
		delete this.LinkDefaultFormatter;
		delete this.LinkDefaultFlag;
		delete this.reappend;
		delete this.vGet;
		delete this.vSet;
		delete this.getCurrentStep;
		delete this.getInfo;
		delete this.destroy;

		// Return the original options from the closure.
		return originalOptions;
	}

	// Get the current step size for the slider.
	function getCurrentStep ( ) {

		// Check all locations, map them to their stepping point.
		// Get the step point, then find it in the input list.
		var retour = $.map($Locations, function( location, index ){

			var step = $Spectrum.getApplicableStep( location ),

				// As per #391, the comparison for the decrement step can have some rounding issues.
				// Round the value to the precision used in the step.
				stepDecimals = countDecimals(String(step[2])),

				// Get the current numeric value
				value = $Values[index],

				// To move the slider 'one step up', the current step value needs to be added.
				// Use null if we are at the maximum slider value.
				increment = location === 100 ? null : step[2],

				// Going 'one step down' might put the slider in a different sub-range, so we
				// need to switch between the current or the previous step.
				prev = Number((value - step[2]).toFixed(stepDecimals)),

				// If the value fits the step, return the current step value. Otherwise, use the
				// previous step. Return null if the slider is at its minimum value.
				decrement = location === 0 ? null : (prev >= step[1]) ? step[2] : (step[0] || false);

			return [[decrement, increment]];
		});

		// Return values in the proper order.
		return inSliderOrder( retour );
	}

	// Get the original set of options.
	function getOriginalOptions ( ) {
		return originalOptions;
	}


// Initialize slider

	// Throw an error if the slider was already initialized.
	if ( $Target.hasClass(Classes[0]) ) {
		throw new Error('Slider was already initialized.');
	}

	// Create the base element, initialise HTML and set classes.
	// Add handles and links.
	$Base = addSlider( options.dir, options.ort, $Target );
	$Handles = addHandles( options.handles, options.dir, $Base );

	// Set the connect classes.
	addConnection ( options.connect, $Target, $Handles );

	// Attach user events.
	events( options.events );

// Methods

	target.vSet = valueSet;
	target.vGet = valueGet;
	target.destroy = destroyTarget;

	target.getCurrentStep = getCurrentStep;
	target.getOriginalOptions = getOriginalOptions;

	target.getInfo = function(){
		return [
			$Spectrum,
			options.style,
			options.ort
		];
	};

	// Use the public value method to set the start values.
	$Target.val( options.start );

}


	// Run the standard initializer
	function initialize ( originalOptions ) {

		// Test the options once, not for every slider.
		var options = testOptions( originalOptions, this );

		// Loop all items, and provide a new closed-scope environment.
		return this.each(function(){
			closure(this, options, originalOptions);
		});
	}

	// Destroy the slider, then re-enter initialization.
	function rebuild ( options ) {

		return this.each(function(){

			// The rebuild flag can be used if the slider wasn't initialized yet.
			if ( !this.destroy ) {
				$(this).noUiSlider( options );
				return;
			}

			// Get the current values from the slider,
			// including the initialization options.
			var values = $(this).val(), originalOptions = this.destroy(),

				// Extend the previous options with the newly provided ones.
				newOptions = $.extend( {}, originalOptions, options );

			// Run the standard initializer.
			$(this).noUiSlider( newOptions );

			// Place Link elements back.
			this.reappend();

			// If the start option hasn't changed,
			// reset the previous values.
			if ( originalOptions.start === newOptions.start ) {
				$(this).val(values);
			}
		});
	}

	// Access the internal getting and setting methods based on argument count.
	function value ( ) {
		return this[0][ !arguments.length ? 'vGet' : 'vSet' ].apply(this[0], arguments);
	}

	// Override the .val() method. Test every element. Is it a slider? Go to
	// the slider value handling. No? Use the standard method.
	// Note how $.fn.val expects 'this' to be an instance of $. For convenience,
	// the above 'value' function does too.
	$.fn.val = function ( arg ) {

		// this === instanceof $

		function valMethod( a ){
			return a.hasClass(Classes[0]) ? value : $val;
		}

		// If no value is passed, this is 'get'.
		if ( !arguments.length ) {
			var first = $(this[0]);
			return valMethod(first).call(first);
		}

		var isFunction = $.isFunction(arg);

		// Return the set so it remains chainable. Make sure not to break
		// jQuery's .val(function( index, value ){}) signature.
		return this.each(function( i ){

			var val = arg, $t = $(this);

			if ( isFunction ) {
				val = arg.call(this, i, $t.val());
			}

			valMethod($t).call($t, val);
		});
	};

// Extend jQuery/Zepto with the noUiSlider method.
	$.fn.noUiSlider = function ( options, rebuildFlag ) {

		switch ( options ) {
			case 'step': return this[0].getCurrentStep();
			case 'options': return this[0].getOriginalOptions();
		}

		return ( rebuildFlag ? rebuild : initialize ).call(this, options);
	};

}( window.jQuery || window.Zepto ));


// wNumb formatting

(function(){

	'use strict';

var
/** @const */ FormatOptions = [
	'decimals',
	'thousand',
	'mark',
	'prefix',
	'postfix',
	'encoder',
	'decoder',
	'negativeBefore',
	'negative',
	'edit',
	'undo'
];

// General

	// Reverse a string
	function strReverse ( a ) {
		return a.split('').reverse().join('');
	}

	// Check if a string starts with a specified prefix.
	function strStartsWith ( input, match ) {
		return input.substring(0, match.length) === match;
	}

	// Check is a string ends in a specified postfix.
	function strEndsWith ( input, match ) {
		return input.slice(-1 * match.length) === match;
	}

	// Throw an error if formatting options are incompatible.
	function throwEqualError( F, a, b ) {
		if ( (F[a] || F[b]) && (F[a] === F[b]) ) {
			throw new Error(a);
		}
	}

	// Check if a number is finite and not NaN
	function isValidNumber ( input ) {
		return typeof input === 'number' && isFinite( input );
	}

	// Provide rounding-accurate toFixed method.
	function toFixed ( value, decimals ) {
		var scale = Math.pow(10, decimals);
		return ( Math.round(value * scale) / scale).toFixed( decimals );
	}


// Formatting

	// Accept a number as input, output formatted string.
	function formatTo ( decimals, thousand, mark, prefix, postfix, encoder, decoder, negativeBefore, negative, edit, undo, input ) {

		var originalInput = input, inputIsNegative, inputPieces, inputBase, inputDecimals = '', output = '';

		// Apply user encoder to the input.
		// Expected outcome: number.
		if ( encoder ) {
			input = encoder(input);
		}

		// Stop if no valid number was provided, the number is infinite or NaN.
		if ( !isValidNumber(input) ) {
			return false;
		}

		// Rounding away decimals might cause a value of -0
		// when using very small ranges. Remove those cases.
		if ( decimals !== false && parseFloat(input.toFixed(decimals)) === 0 ) {
			input = 0;
		}

		// Formatting is done on absolute numbers,
		// decorated by an optional negative symbol.
		if ( input < 0 ) {
			inputIsNegative = true;
			input = Math.abs(input);
		}

		// Reduce the number of decimals to the specified option.
		if ( decimals !== false ) {
			input = toFixed( input, decimals );
		}

		// Transform the number into a string, so it can be split.
		input = input.toString();

		// Break the number on the decimal separator.
		if ( input.indexOf('.') !== -1 ) {
			inputPieces = input.split('.');

			inputBase = inputPieces[0];

			if ( mark ) {
				inputDecimals = mark + inputPieces[1];
			}

		} else {

		// If it isn't split, the entire number will do.
			inputBase = input;
		}

		// Group numbers in sets of three.
		if ( thousand ) {
			inputBase = strReverse(inputBase).match(/.{1,3}/g);
			inputBase = strReverse(inputBase.join( strReverse( thousand ) ));
		}

		// If the number is negative, prefix with negation symbol.
		if ( inputIsNegative && negativeBefore ) {
			output += negativeBefore;
		}

		// Prefix the number
		if ( prefix ) {
			output += prefix;
		}

		// Normal negative option comes after the prefix. Defaults to '-'.
		if ( inputIsNegative && negative ) {
			output += negative;
		}

		// Append the actual number.
		output += inputBase;
		output += inputDecimals;

		// Apply the postfix.
		if ( postfix ) {
			output += postfix;
		}

		// Run the output through a user-specified post-formatter.
		if ( edit ) {
			output = edit ( output, originalInput );
		}

		// All done.
		return output;
	}

	// Accept a sting as input, output decoded number.
	function formatFrom ( decimals, thousand, mark, prefix, postfix, encoder, decoder, negativeBefore, negative, edit, undo, input ) {

		var originalInput = input, inputIsNegative, output = '';

		// User defined pre-decoder. Result must be a non empty string.
		if ( undo ) {
			input = undo(input);
		}

		// Test the input. Can't be empty.
		if ( !input || typeof input !== 'string' ) {
			return false;
		}

		// If the string starts with the negativeBefore value: remove it.
		// Remember is was there, the number is negative.
		if ( negativeBefore && strStartsWith(input, negativeBefore) ) {
			input = input.replace(negativeBefore, '');
			inputIsNegative = true;
		}

		// Repeat the same procedure for the prefix.
		if ( prefix && strStartsWith(input, prefix) ) {
			input = input.replace(prefix, '');
		}

		// And again for negative.
		if ( negative && strStartsWith(input, negative) ) {
			input = input.replace(negative, '');
			inputIsNegative = true;
		}

		// Remove the postfix.
		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/slice
		if ( postfix && strEndsWith(input, postfix) ) {
			input = input.slice(0, -1 * postfix.length);
		}

		// Remove the thousand grouping.
		if ( thousand ) {
			input = input.split(thousand).join('');
		}

		// Set the decimal separator back to period.
		if ( mark ) {
			input = input.replace(mark, '.');
		}

		// Prepend the negative symbol.
		if ( inputIsNegative ) {
			output += '-';
		}

		// Add the number
		output += input;

		// Trim all non-numeric characters (allow '.' and '-');
		output = output.replace(/[^0-9\.\-.]/g, '');

		// The value contains no parse-able number.
		if ( output === '' ) {
			return false;
		}

		// Covert to number.
		output = Number(output);

		// Run the user-specified post-decoder.
		if ( decoder ) {
			output = decoder(output);
		}

		// Check is the output is valid, otherwise: return false.
		if ( !isValidNumber(output) ) {
			return false;
		}

		return output;
	}


// Framework

	// Validate formatting options
	function validate ( inputOptions ) {

		var i, optionName, optionValue,
			filteredOptions = {};

		for ( i = 0; i < FormatOptions.length; i+=1 ) {

			optionName = FormatOptions[i];
			optionValue = inputOptions[optionName];

			if ( optionValue === undefined ) {

				// Only default if negativeBefore isn't set.
				if ( optionName === 'negative' && !filteredOptions.negativeBefore ) {
					filteredOptions[optionName] = '-';
				// Don't set a default for mark when 'thousand' is set.
				} else if ( optionName === 'mark' && filteredOptions.thousand !== '.' ) {
					filteredOptions[optionName] = '.';
				} else {
					filteredOptions[optionName] = false;
				}

			// Floating points in JS are stable up to 7 decimals.
			} else if ( optionName === 'decimals' ) {
				if ( optionValue >= 0 && optionValue < 8 ) {
					filteredOptions[optionName] = optionValue;
				} else {
					throw new Error(optionName);
				}

			// These options, when provided, must be functions.
			} else if ( optionName === 'encoder' || optionName === 'decoder' || optionName === 'edit' || optionName === 'undo' ) {
				if ( typeof optionValue === 'function' ) {
					filteredOptions[optionName] = optionValue;
				} else {
					throw new Error(optionName);
				}

			// Other options are strings.
			} else {

				if ( typeof optionValue === 'string' ) {
					filteredOptions[optionName] = optionValue;
				} else {
					throw new Error(optionName);
				}
			}
		}

		// Some values can't be extracted from a
		// string if certain combinations are present.
		throwEqualError(filteredOptions, 'mark', 'thousand');
		throwEqualError(filteredOptions, 'prefix', 'negative');
		throwEqualError(filteredOptions, 'prefix', 'negativeBefore');

		return filteredOptions;
	}

	// Pass all options as function arguments
	function passAll ( options, method, input ) {
		var i, args = [];

		// Add all options in order of FormatOptions
		for ( i = 0; i < FormatOptions.length; i+=1 ) {
			args.push(options[FormatOptions[i]]);
		}

		// Append the input, then call the method, presenting all
		// options as arguments.
		args.push(input);
		return method.apply('', args);
	}

	/** @constructor */
	function wNumb ( options ) {

		if ( !(this instanceof wNumb) ) {
			return new wNumb ( options );
		}

		if ( typeof options !== "object" ) {
			return;
		}

		options = validate(options);

		// Call 'formatTo' with proper arguments.
		this.to = function ( input ) {
			return passAll(options, formatTo, input);
		};

		// Call 'formatFrom' with proper arguments.
		this.from = function ( input ) {
			return passAll(options, formatFrom, input);
		};
	}

	/** @export */
	window.wNumb = wNumb;

}());


/*jslint browser: true */
/*jslint white: true */

(function( $ ){

	'use strict';

// Helpers

	// Test in an object is an instance of jQuery or Zepto.
	function isInstance ( a ) {
		return a instanceof $ || ( $.zepto && $.zepto.isZ(a) );
	}


// Link types

	function fromPrefix ( target, method ) {

		// If target is a string, a new hidden input will be created.
		if ( typeof target === 'string' && target.indexOf('-inline-') === 0 ) {

			// By default, use the 'html' method.
			this.method = method || 'html';

			// Use jQuery to create the element
			this.target = this.el = $( target.replace('-inline-', '') || '<div/>' );

			return true;
		}
	}

	function fromString ( target ) {

		// If the string doesn't begin with '-', which is reserved, add a new hidden input.
		if ( typeof target === 'string' && target.indexOf('-') !== 0 ) {

			this.method = 'val';

			var element = document.createElement('input');
				element.name = target;
				element.type = 'hidden';
			this.target = this.el = $(element);

			return true;
		}
	}

	function fromFunction ( target ) {

		// The target can also be a function, which will be called.
		if ( typeof target === 'function' ) {
			this.target = false;
			this.method = target;

			return true;
		}
	}

	function fromInstance ( target, method ) {

		if ( isInstance( target ) && !method ) {

		// If a jQuery/Zepto input element is provided, but no method is set,
		// the element can assume it needs to respond to 'change'...
			if ( target.is('input, select, textarea') ) {

				// Default to .val if this is an input element.
				this.method = 'val';

				// Fire the API changehandler when the target changes.
				this.target = target.on('change.liblink', this.changeHandler);

			} else {

				this.target = target;

				// If no method is set, and we are not auto-binding an input, default to 'html'.
				this.method = 'html';
			}

			return true;
		}
	}

	function fromInstanceMethod ( target, method ) {

		// The method must exist on the element.
		if ( isInstance( target ) &&
			(typeof method === 'function' ||
				(typeof method === 'string' && target[method]))
		) {
			this.method = method;
			this.target = target;

			return true;
		}
	}

var
/** @const */
	creationFunctions = [fromPrefix, fromString, fromFunction, fromInstance, fromInstanceMethod];


// Link Instance

/** @constructor */
	function Link ( target, method, format ) {

		var that = this, valid = false;

		// Forward calls within scope.
		this.changeHandler = function ( changeEvent ) {
			var decodedValue = that.formatInstance.from( $(this).val() );

			// If the value is invalid, stop this event, as well as it's propagation.
			if ( decodedValue === false || isNaN(decodedValue) ) {

				// Reset the value.
				$(this).val(that.lastSetValue);
				return false;
			}

			that.changeHandlerMethod.call( '', changeEvent, decodedValue );
		};

		// See if this Link needs individual targets based on its usage.
		// If so, return the element that needs to be copied by the
		// implementing interface.
		// Default the element to false.
		this.el = false;

		// Store the formatter, or use the default.
		this.formatInstance = format;

		// Try all Link types.
		/*jslint unparam: true*/
		$.each(creationFunctions, function(i, fn){
			valid = fn.call(that, target, method);
			return !valid;
		});
		/*jslint unparam: false*/

		// Nothing matched, throw error.
		if ( !valid ) {
			throw new RangeError("(Link) Invalid Link.");
		}
	}

	// Provides external items with the object value.
	Link.prototype.set = function ( value ) {

		// Ignore the value, so only the passed-on arguments remain.
		var args = Array.prototype.slice.call( arguments ),
			additionalArgs = args.slice(1);

		// Store some values. The actual, numerical value,
		// the formatted value and the parameters for use in 'resetValue'.
		// Slice additionalArgs to break the relation.
		this.lastSetValue = this.formatInstance.to( value );

		// Prepend the value to the function arguments.
		additionalArgs.unshift(
			this.lastSetValue
		);

		// When target is undefined, the target was a function.
		// In that case, provided the object as the calling scope.
		// Branch between writing to a function or an object.
		( typeof this.method === 'function' ?
			this.method :
			this.target[ this.method ] ).apply( this.target, additionalArgs );
	};


// Developer API

/** @constructor */
	function LinkAPI ( origin ) {
		this.items = [];
		this.elements = [];
		this.origin = origin;
	}

	LinkAPI.prototype.push = function( item, element ) {
		this.items.push(item);

		// Prevent 'false' elements
		if ( element ) {
			this.elements.push(element);
		}
	};

	LinkAPI.prototype.reconfirm = function ( flag ) {
		var i;
		for ( i = 0; i < this.elements.length; i += 1 ) {
			this.origin.LinkConfirm(flag, this.elements[i]);
		}
	};

	LinkAPI.prototype.remove = function ( flag ) {
		var i;
		for ( i = 0; i < this.items.length; i += 1 ) {
			this.items[i].target.off('.liblink');
		}
		for ( i = 0; i < this.elements.length; i += 1 ) {
			this.elements[i].remove();
		}
	};

	LinkAPI.prototype.change = function ( value ) {

		if ( this.origin.LinkIsEmitting ) {
			return false;
		}

		this.origin.LinkIsEmitting = true;

		var args = Array.prototype.slice.call( arguments, 1 ), i;
		args.unshift( value );

		// Write values to serialization Links.
		// Convert the value to the correct relative representation.
		for ( i = 0; i < this.items.length; i += 1 ) {
			this.items[i].set.apply(this.items[i], args);
		}

		this.origin.LinkIsEmitting = false;
	};


// jQuery plugin

	function binder ( flag, target, method, format ){

		if ( flag === 0 ) {
			flag = this.LinkDefaultFlag;
		}

		// Create a list of API's (if it didn't exist yet);
		if ( !this.linkAPI ) {
			this.linkAPI = {};
		}

		// Add an API point.
		if ( !this.linkAPI[flag] ) {
			this.linkAPI[flag] = new LinkAPI(this);
		}

		var linkInstance = new Link ( target, method, format || this.LinkDefaultFormatter );

		// Default the calling scope to the linked object.
		if ( !linkInstance.target ) {
			linkInstance.target = $(this);
		}

		// If the Link requires creation of a new element,
		// Pass the element and request confirmation to get the changehandler.
		// Set the method to be called when a Link changes.
		linkInstance.changeHandlerMethod = this.LinkConfirm( flag, linkInstance.el );

		// Store the linkInstance in the flagged list.
		this.linkAPI[flag].push( linkInstance, linkInstance.el );

		// Now that Link have been connected, request an update.
		this.LinkUpdate( flag );
	}

	/** @export */
	$.fn.Link = function( flag ){

		var that = this;

		// Delete all linkAPI
		if ( flag === false ) {

			return that.each(function(){

				// .Link(false) can be called on elements without Links.
				// When that happens, the objects can't be looped.
				if ( !this.linkAPI ) {
					return;
				}

				$.map(this.linkAPI, function(api){
					api.remove();
				});

				delete this.linkAPI;
			});
		}

		if ( flag === undefined ) {

			flag = 0;

		} else if ( typeof flag !== 'string') {

			throw new Error("Flag must be string.");
		}

		return {
			to: function( a, b, c ){
				return that.each(function(){
					binder.call(this, flag, a, b, c);
				});
			}
		};
	};

}( window.jQuery || window.Zepto ));
},{}],6:[function(require,module,exports){
/*!
 * # Semantic UI 1.11.4 - Modal
 * http://github.com/semantic-org/semantic-ui/
 *
 *
 * Copyright 2014 Contributors
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 */

;(function ( $, window, document, undefined ) {

"use strict";

$.fn.modal = function(parameters) {
  var
    $allModules    = $(this),
    $window        = $(window),
    $document      = $(document),
    $body          = $('body'),

    moduleSelector = $allModules.selector || '',

    time           = new Date().getTime(),
    performance    = [],

    query          = arguments[0],
    methodInvoked  = (typeof query == 'string'),
    queryArguments = [].slice.call(arguments, 1),

    requestAnimationFrame = window.requestAnimationFrame
      || window.mozRequestAnimationFrame
      || window.webkitRequestAnimationFrame
      || window.msRequestAnimationFrame
      || function(callback) { setTimeout(callback, 0); },

    returnedValue
  ;

  $allModules
    .each(function() {
      var
        settings    = ( $.isPlainObject(parameters) )
          ? $.extend(true, {}, $.fn.modal.settings, parameters)
          : $.extend({}, $.fn.modal.settings),

        selector        = settings.selector,
        className       = settings.className,
        namespace       = settings.namespace,
        error           = settings.error,

        eventNamespace  = '.' + namespace,
        moduleNamespace = 'module-' + namespace,

        $module         = $(this),
        $context        = $(settings.context),
        $close          = $module.find(selector.close),

        $allModals,
        $otherModals,
        $focusedElement,
        $dimmable,
        $dimmer,

        element         = this,
        instance        = $module.data(moduleNamespace),

        elementNamespace,
        id,
        observer,
        module
      ;
      module  = {

        initialize: function() {
          module.verbose('Initializing dimmer', $context);

          module.create.id();
          module.create.dimmer();
          module.refreshModals();

          module.verbose('Attaching close events', $close);
          module.bind.events();
          module.observeChanges();
          module.instantiate();
        },

        instantiate: function() {
          module.verbose('Storing instance of modal');
          instance = module;
          $module
            .data(moduleNamespace, instance)
          ;
        },

        create: {
          dimmer: function() {
            var
              defaultSettings = {
                debug      : settings.debug,
                dimmerName : 'modals',
                duration   : {
                  show     : settings.duration,
                  hide     : settings.duration
                }
              },
              dimmerSettings = $.extend(true, defaultSettings, settings.dimmerSettings)
            ;
            if($.fn.dimmer === undefined) {
              module.error(error.dimmer);
              return;
            }
            module.debug('Creating dimmer with settings', dimmerSettings);
            $dimmable = $context.dimmer(dimmerSettings);
            if(settings.detachable) {
              module.verbose('Modal is detachable, moving content into dimmer');
              $dimmable.dimmer('add content', $module);
            }
            $dimmer = $dimmable.dimmer('get dimmer');
          },
          id: function() {
            id = (Math.random().toString(16) + '000000000').substr(2,8);
            elementNamespace = '.' + id;
            module.verbose('Creating unique id for element', id);
          }
        },

        destroy: function() {
          module.verbose('Destroying previous modal');
          $module
            .removeData(moduleNamespace)
            .off(eventNamespace)
          ;
          $window.off(elementNamespace);
          $close.off(eventNamespace);
          $context.dimmer('destroy');
        },

        observeChanges: function() {
          if('MutationObserver' in window) {
            observer = new MutationObserver(function(mutations) {
              module.debug('DOM tree modified, refreshing');
              module.refresh();
            });
            observer.observe(element, {
              childList : true,
              subtree   : true
            });
            module.debug('Setting up mutation observer', observer);
          }
        },

        refresh: function() {
          module.remove.scrolling();
          module.cacheSizes();
          module.set.screenHeight();
          module.set.type();
          module.set.position();
        },

        refreshModals: function() {
          $otherModals = $module.siblings(selector.modal);
          $allModals   = $otherModals.add($module);
        },

        attachEvents: function(selector, event) {
          var
            $toggle = $(selector)
          ;
          event = $.isFunction(module[event])
            ? module[event]
            : module.toggle
          ;
          if($toggle.length > 0) {
            module.debug('Attaching modal events to element', selector, event);
            $toggle
              .off(eventNamespace)
              .on('click' + eventNamespace, event)
            ;
          }
          else {
            module.error(error.notFound, selector);
          }
        },

        bind: {
          events: function() {
            $close.on('click' + eventNamespace, module.event.close);
            $window.on('resize' + elementNamespace, module.event.resize);
          }
        },

        get: {
          id: function() {
            return (Math.random().toString(16) + '000000000').substr(2,8);
          }
        },

        event: {
          close: function() {
            module.verbose('Closing element pressed');
            if( $(this).is(selector.approve) ) {
              if(settings.onApprove.call(element) !== false) {
                module.hide();
              }
              else {
                module.verbose('Approve callback returned false cancelling hide');
              }
            }
            else if( $(this).is(selector.deny) ) {
              if(settings.onDeny.call(element) !== false) {
                module.hide();
              }
              else {
                module.verbose('Deny callback returned false cancelling hide');
              }
            }
            else {
              module.hide();
            }
          },
          click: function(event) {
            if( $(event.target).closest($module).length === 0 ) {
              module.debug('Dimmer clicked, hiding all modals');
              if( module.is.active() ) {
                module.remove.clickaway();
                if(settings.allowMultiple) {
                  module.hide();
                }
                else {
                  module.hideAll();
                }
              }
            }
          },
          debounce: function(method, delay) {
            clearTimeout(module.timer);
            module.timer = setTimeout(method, delay);
          },
          keyboard: function(event) {
            var
              keyCode   = event.which,
              escapeKey = 27
            ;
            if(keyCode == escapeKey) {
              if(settings.closable) {
                module.debug('Escape key pressed hiding modal');
                module.hide();
              }
              else {
                module.debug('Escape key pressed, but closable is set to false');
              }
              event.preventDefault();
            }
          },
          resize: function() {
            if( $dimmable.dimmer('is active') ) {
              requestAnimationFrame(module.refresh);
            }
          }
        },

        toggle: function() {
          if( module.is.active() || module.is.animating() ) {
            module.hide();
          }
          else {
            module.show();
          }
        },

        show: function(callback) {
          callback = $.isFunction(callback)
            ? callback
            : function(){}
          ;
          module.refreshModals();
          module.showModal(callback);
        },

        hide: function(callback) {
          callback = $.isFunction(callback)
            ? callback
            : function(){}
          ;
          module.refreshModals();
          module.hideModal(callback);
        },

        showModal: function(callback) {
          callback = $.isFunction(callback)
            ? callback
            : function(){}
          ;
          if( module.is.animating() || !module.is.active() ) {

            module.showDimmer();
            module.cacheSizes();
            module.set.position();
            module.set.screenHeight();
            module.set.type();
            module.set.clickaway();

            if( !settings.allowMultiple && $otherModals.filter('.' + className.active).length > 0) {
              module.debug('Other modals visible, queueing show animation');
              module.hideOthers(module.showModal);
            }
            else {
              settings.onShow.call(element);
              if(settings.transition && $.fn.transition !== undefined && $module.transition('is supported')) {
                module.debug('Showing modal with css animations');
                $module
                  .transition({
                    debug       : settings.debug,
                    animation   : settings.transition + ' in',
                    queue       : settings.queue,
                    duration    : settings.duration,
                    useFailSafe : true,
                    onComplete : function() {
                      settings.onVisible.apply(element);
                      module.add.keyboardShortcuts();
                      module.save.focus();
                      module.set.active();
                      module.set.autofocus();
                      callback();
                    }
                  })
                ;
              }
              else {
                module.debug('Showing modal with javascript');
                $module
                  .fadeIn(settings.duration, settings.easing, function() {
                    settings.onVisible.apply(element);
                    module.add.keyboardShortcuts();
                    module.save.focus();
                    module.set.active();
                    callback();
                  })
                ;
              }
            }
          }
          else {
            module.debug('Modal is already visible');
          }
        },

        hideModal: function(callback, keepDimmed) {
          callback = $.isFunction(callback)
            ? callback
            : function(){}
          ;
          module.debug('Hiding modal');
          settings.onHide.call(element);

          if( module.is.animating() || module.is.active() ) {
            if(settings.transition && $.fn.transition !== undefined && $module.transition('is supported')) {
              module.remove.active();
              $module
                .transition({
                  debug       : settings.debug,
                  animation   : settings.transition + ' out',
                  queue       : settings.queue,
                  duration    : settings.duration,
                  useFailSafe : true,
                  onStart     : function() {
                    if(!module.othersActive() && !keepDimmed) {
                      module.hideDimmer();
                    }
                    module.remove.keyboardShortcuts();
                  },
                  onComplete : function() {
                    settings.onHidden.call(element);
                    module.restore.focus();
                    callback();
                  }
                })
              ;
            }
            else {
              module.remove.active();
              if( !module.othersActive() ) {
                module.hideDimmer();
              }
              module.remove.keyboardShortcuts();
              $module
                .fadeOut(settings.duration, settings.easing, function() {
                  settings.onHidden.call(element);
                  module.restore.focus();
                  callback();
                })
              ;
            }
          }
        },

        showDimmer: function() {
          if($dimmable.dimmer('is animating') || !$dimmable.dimmer('is active') ) {
            module.debug('Showing dimmer');
            $dimmable.dimmer('show');
          }
          else {
            module.debug('Dimmer already visible');
          }
        },

        hideDimmer: function() {
          if( $dimmable.dimmer('is animating') || ($dimmable.dimmer('is active')) ) {
            $dimmable.dimmer('hide', function() {
              if(settings.transition && $.fn.transition !== undefined && $module.transition('is supported')) {
                module.remove.clickaway();
                module.remove.screenHeight();
              }
            });
          }
          else {
            module.debug('Dimmer is not visible cannot hide');
            return;
          }
        },

        hideAll: function(callback) {
          var
            $visibleModals = $allModals.filter(':visible')
          ;
          callback = $.isFunction(callback)
            ? callback
            : function(){}
          ;
          if( $visibleModals.length > 0 ) {
            module.debug('Hiding all visible modals');
            module.hideDimmer();
            $visibleModals
              .modal('hide modal', callback)
            ;
          }
        },

        hideOthers: function(callback) {
          var
            $visibleModals = $otherModals.filter(':visible')
          ;
          callback = $.isFunction(callback)
            ? callback
            : function(){}
          ;
          if( $visibleModals.length > 0 ) {
            module.debug('Hiding other modals', $otherModals);
            $visibleModals
              .modal('hide modal', callback, true)
            ;
          }
        },

        othersActive: function() {
          return ($otherModals.filter('.' + className.active).length > 0);
        },

        add: {
          keyboardShortcuts: function() {
            module.verbose('Adding keyboard shortcuts');
            $document
              .on('keyup' + eventNamespace, module.event.keyboard)
            ;
          }
        },

        save: {
          focus: function() {
            $focusedElement = $(document.activeElement).blur();
          }
        },

        restore: {
          focus: function() {
            if($focusedElement && $focusedElement.length > 0) {
              $focusedElement.focus();
            }
          }
        },

        remove: {
          active: function() {
            $module.removeClass(className.active);
          },
          clickaway: function() {
            if(settings.closable) {
              $dimmer
                .off('click' + elementNamespace)
              ;
            }
          },
          screenHeight: function() {
            if(module.cache.height > module.cache.pageHeight) {
              module.debug('Removing page height');
              $body
                .css('height', '')
              ;
            }
          },
          keyboardShortcuts: function() {
            module.verbose('Removing keyboard shortcuts');
            $document
              .off('keyup' + eventNamespace)
            ;
          },
          scrolling: function() {
            $dimmable.removeClass(className.scrolling);
            $module.removeClass(className.scrolling);
          }
        },

        cacheSizes: function() {
          var
            modalHeight = $module.outerHeight()
          ;
          if(module.cache === undefined || modalHeight !== 0) {
            module.cache = {
              pageHeight    : $(document).outerHeight(),
              height        : modalHeight + settings.offset,
              contextHeight : (settings.context == 'body')
                ? $(window).height()
                : $dimmable.height()
            };
          }
          module.debug('Caching modal and container sizes', module.cache);
        },

        can: {
          fit: function() {
            return ( ( module.cache.height + (settings.padding * 2) ) < module.cache.contextHeight);
          }
        },

        is: {
          active: function() {
            return $module.hasClass(className.active);
          },
          animating: function() {
            return $module.transition('is supported')
              ? $module.transition('is animating')
              : $module.is(':visible')
            ;
          },
          scrolling: function() {
            return $dimmable.hasClass(className.scrolling);
          },
          modernBrowser: function() {
            // appName for IE11 reports 'Netscape' can no longer use
            return !(window.ActiveXObject || "ActiveXObject" in window);
          }
        },

        set: {
          autofocus: function() {
            if(settings.autofocus) {
              var
                $inputs    = $module.find(':input:visible'),
                $autofocus = $inputs.filter('[autofocus]'),
                $input     = ($autofocus.length > 0)
                  ? $autofocus
                  : $inputs
              ;
              $input.first().focus();
            }
          },
          clickaway: function() {
            if(settings.closable) {
              $dimmer
                .on('click' + elementNamespace, module.event.click)
              ;
            }
          },
          screenHeight: function() {
            if( module.can.fit() ) {
              $body.css('height', '');
            }
            else {
              module.debug('Modal is taller than page content, resizing page height');
              $body
                .css('height', module.cache.height + (settings.padding / 2) )
              ;
            }
          },
          active: function() {
            $module.addClass(className.active);
          },
          scrolling: function() {
            $dimmable.addClass(className.scrolling);
            $module.addClass(className.scrolling);
          },
          type: function() {
            if(module.can.fit()) {
              module.verbose('Modal fits on screen');
              if(!module.othersActive) {
                module.remove.scrolling();
              }
            }
            else {
              module.verbose('Modal cannot fit on screen setting to scrolling');
              module.set.scrolling();
            }
          },
          position: function() {
            module.verbose('Centering modal on page', module.cache);
            if(module.can.fit()) {
              $module
                .css({
                  top: '',
                  marginTop: -(module.cache.height / 2)
                })
              ;
            }
            else {
              $module
                .css({
                  marginTop : '',
                  top       : $document.scrollTop()
                })
              ;
            }
          }
        },

        setting: function(name, value) {
          module.debug('Changing setting', name, value);
          if( $.isPlainObject(name) ) {
            $.extend(true, settings, name);
          }
          else if(value !== undefined) {
            settings[name] = value;
          }
          else {
            return settings[name];
          }
        },
        internal: function(name, value) {
          if( $.isPlainObject(name) ) {
            $.extend(true, module, name);
          }
          else if(value !== undefined) {
            module[name] = value;
          }
          else {
            return module[name];
          }
        },
        debug: function() {
          if(settings.debug) {
            if(settings.performance) {
              module.performance.log(arguments);
            }
            else {
              module.debug = Function.prototype.bind.call(console.info, console, settings.name + ':');
              module.debug.apply(console, arguments);
            }
          }
        },
        verbose: function() {
          if(settings.verbose && settings.debug) {
            if(settings.performance) {
              module.performance.log(arguments);
            }
            else {
              module.verbose = Function.prototype.bind.call(console.info, console, settings.name + ':');
              module.verbose.apply(console, arguments);
            }
          }
        },
        error: function() {
          module.error = Function.prototype.bind.call(console.error, console, settings.name + ':');
          module.error.apply(console, arguments);
        },
        performance: {
          log: function(message) {
            var
              currentTime,
              executionTime,
              previousTime
            ;
            if(settings.performance) {
              currentTime   = new Date().getTime();
              previousTime  = time || currentTime;
              executionTime = currentTime - previousTime;
              time          = currentTime;
              performance.push({
                'Name'           : message[0],
                'Arguments'      : [].slice.call(message, 1) || '',
                'Element'        : element,
                'Execution Time' : executionTime
              });
            }
            clearTimeout(module.performance.timer);
            module.performance.timer = setTimeout(module.performance.display, 100);
          },
          display: function() {
            var
              title = settings.name + ':',
              totalTime = 0
            ;
            time = false;
            clearTimeout(module.performance.timer);
            $.each(performance, function(index, data) {
              totalTime += data['Execution Time'];
            });
            title += ' ' + totalTime + 'ms';
            if(moduleSelector) {
              title += ' \'' + moduleSelector + '\'';
            }
            if( (console.group !== undefined || console.table !== undefined) && performance.length > 0) {
              console.groupCollapsed(title);
              if(console.table) {
                console.table(performance);
              }
              else {
                $.each(performance, function(index, data) {
                  console.log(data['Name'] + ': ' + data['Execution Time']+'ms');
                });
              }
              console.groupEnd();
            }
            performance = [];
          }
        },
        invoke: function(query, passedArguments, context) {
          var
            object = instance,
            maxDepth,
            found,
            response
          ;
          passedArguments = passedArguments || queryArguments;
          context         = element         || context;
          if(typeof query == 'string' && object !== undefined) {
            query    = query.split(/[\. ]/);
            maxDepth = query.length - 1;
            $.each(query, function(depth, value) {
              var camelCaseValue = (depth != maxDepth)
                ? value + query[depth + 1].charAt(0).toUpperCase() + query[depth + 1].slice(1)
                : query
              ;
              if( $.isPlainObject( object[camelCaseValue] ) && (depth != maxDepth) ) {
                object = object[camelCaseValue];
              }
              else if( object[camelCaseValue] !== undefined ) {
                found = object[camelCaseValue];
                return false;
              }
              else if( $.isPlainObject( object[value] ) && (depth != maxDepth) ) {
                object = object[value];
              }
              else if( object[value] !== undefined ) {
                found = object[value];
                return false;
              }
              else {
                return false;
              }
            });
          }
          if ( $.isFunction( found ) ) {
            response = found.apply(context, passedArguments);
          }
          else if(found !== undefined) {
            response = found;
          }
          if($.isArray(returnedValue)) {
            returnedValue.push(response);
          }
          else if(returnedValue !== undefined) {
            returnedValue = [returnedValue, response];
          }
          else if(response !== undefined) {
            returnedValue = response;
          }
          return found;
        }
      };

      if(methodInvoked) {
        if(instance === undefined) {
          module.initialize();
        }
        module.invoke(query);
      }
      else {
        if(instance !== undefined) {
          instance.invoke('destroy');
        }
        module.initialize();
      }
    })
  ;

  return (returnedValue !== undefined)
    ? returnedValue
    : this
  ;
};

$.fn.modal.settings = {

  name           : 'Modal',
  namespace      : 'modal',

  debug          : false,
  verbose        : true,
  performance    : true,

  allowMultiple  : false,
  detachable     : true,
  closable       : true,
  autofocus      : true,

  dimmerSettings : {
    closable : false,
    useCSS   : true
  },

  context        : 'body',

  queue          : false,
  duration       : 300,
  easing         : 'easeOutExpo',
  offset         : 0,
  transition     : 'scale',

  padding        : 50,

  onShow         : function(){},
  onHide         : function(){},

  onVisible      : function(){},
  onHidden       : function(){},

  onApprove      : function(){ return true; },
  onDeny         : function(){ return true; },

  selector    : {
    close    : '.close, .actions .button',
    approve  : '.actions .positive, .actions .approve, .actions .ok',
    deny     : '.actions .negative, .actions .deny, .actions .cancel',
    modal    : '.ui.modal'
  },
  error : {
    dimmer    : 'UI Dimmer, a required component is not included in this page',
    method    : 'The method you called is not defined.',
    notFound  : 'The element you specified could not be found'
  },
  className : {
    active    : 'active',
    animating : 'animating',
    scrolling : 'scrolling'
  }
};


})( jQuery, window , document );

},{}],7:[function(require,module,exports){
/** Notify.js - v0.3.1 - 2014/06/29
 * http://notifyjs.com/
 * Copyright (c) 2014 Jaime Pillora - MIT
 */
(function(window,document,$,undefined) {
'use strict';

var Notification, addStyle, blankFieldName, coreStyle, createElem, defaults, encode, find, findFields, getAnchorElement, getStyle, globalAnchors, hAligns, incr, inherit, insertCSS, mainPositions, opposites, parsePosition, pluginClassName, pluginName, pluginOptions, positions, realign, stylePrefixes, styles, vAligns,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

pluginName = 'notify';

pluginClassName = pluginName + 'js';

blankFieldName = pluginName + "!blank";

positions = {
  t: 'top',
  m: 'middle',
  b: 'bottom',
  l: 'left',
  c: 'center',
  r: 'right'
};

hAligns = ['l', 'c', 'r'];

vAligns = ['t', 'm', 'b'];

mainPositions = ['t', 'b', 'l', 'r'];

opposites = {
  t: 'b',
  m: null,
  b: 't',
  l: 'r',
  c: null,
  r: 'l'
};

parsePosition = function(str) {
  var pos;
  pos = [];
  $.each(str.split(/\W+/), function(i, word) {
    var w;
    w = word.toLowerCase().charAt(0);
    if (positions[w]) {
      return pos.push(w);
    }
  });
  return pos;
};

styles = {};

coreStyle = {
  name: 'core',
  html: "<div class=\"" + pluginClassName + "-wrapper\">\n  <div class=\"" + pluginClassName + "-arrow\"></div>\n  <div class=\"" + pluginClassName + "-container\"></div>\n</div>",
  css: "." + pluginClassName + "-corner {\n  position: fixed;\n  margin: 5px;\n  z-index: 1050;\n}\n\n." + pluginClassName + "-corner ." + pluginClassName + "-wrapper,\n." + pluginClassName + "-corner ." + pluginClassName + "-container {\n  position: relative;\n  display: block;\n  height: inherit;\n  width: inherit;\n  margin: 3px;\n}\n\n." + pluginClassName + "-wrapper {\n  z-index: 1;\n  position: absolute;\n  display: inline-block;\n  height: 0;\n  width: 0;\n}\n\n." + pluginClassName + "-container {\n  display: none;\n  z-index: 1;\n  position: absolute;\n}\n\n." + pluginClassName + "-hidable {\n  cursor: pointer;\n}\n\n[data-notify-text],[data-notify-html] {\n  position: relative;\n}\n\n." + pluginClassName + "-arrow {\n  position: absolute;\n  z-index: 2;\n  width: 0;\n  height: 0;\n}"
};

stylePrefixes = {
  "border-radius": ["-webkit-", "-moz-"]
};

getStyle = function(name) {
  return styles[name];
};

addStyle = function(name, def) {
  var cssText, elem, fields, _ref;
  if (!name) {
    throw "Missing Style name";
  }
  if (!def) {
    throw "Missing Style definition";
  }
  if (!def.html) {
    throw "Missing Style HTML";
  }
  if ((_ref = styles[name]) != null ? _ref.cssElem : void 0) {
    if (window.console) {
      console.warn("" + pluginName + ": overwriting style '" + name + "'");
    }
    styles[name].cssElem.remove();
  }
  def.name = name;
  styles[name] = def;
  cssText = "";
  if (def.classes) {
    $.each(def.classes, function(className, props) {
      cssText += "." + pluginClassName + "-" + def.name + "-" + className + " {\n";
      $.each(props, function(name, val) {
        if (stylePrefixes[name]) {
          $.each(stylePrefixes[name], function(i, prefix) {
            return cssText += "  " + prefix + name + ": " + val + ";\n";
          });
        }
        return cssText += "  " + name + ": " + val + ";\n";
      });
      return cssText += "}\n";
    });
  }
  if (def.css) {
    cssText += "/* styles for " + def.name + " */\n" + def.css;
  }
  if (cssText) {
    def.cssElem = insertCSS(cssText);
    def.cssElem.attr('id', "notify-" + def.name);
  }
  fields = {};
  elem = $(def.html);
  findFields('html', elem, fields);
  findFields('text', elem, fields);
  return def.fields = fields;
};

insertCSS = function(cssText) {
  var elem;
  elem = createElem("style");
  elem.attr('type', 'text/css');
  $("head").append(elem);
  try {
    elem.html(cssText);
  } catch (e) {
    elem[0].styleSheet.cssText = cssText;
  }
  return elem;
};

findFields = function(type, elem, fields) {
  var attr;
  if (type !== 'html') {
    type = 'text';
  }
  attr = "data-notify-" + type;
  return find(elem, "[" + attr + "]").each(function() {
    var name;
    name = $(this).attr(attr);
    if (!name) {
      name = blankFieldName;
    }
    return fields[name] = type;
  });
};

find = function(elem, selector) {
  if (elem.is(selector)) {
    return elem;
  } else {
    return elem.find(selector);
  }
};

pluginOptions = {
  clickToHide: true,
  autoHide: true,
  autoHideDelay: 5000,
  arrowShow: true,
  arrowSize: 5,
  breakNewLines: true,
  elementPosition: 'bottom',
  globalPosition: 'top right',
  style: 'bootstrap',
  className: 'error',
  showAnimation: 'slideDown',
  showDuration: 400,
  hideAnimation: 'slideUp',
  hideDuration: 200,
  gap: 5
};

inherit = function(a, b) {
  var F;
  F = function() {};
  F.prototype = a;
  return $.extend(true, new F(), b);
};

defaults = function(opts) {
  return $.extend(pluginOptions, opts);
};

createElem = function(tag) {
  return $("<" + tag + "></" + tag + ">");
};

globalAnchors = {};

getAnchorElement = function(element) {
  var radios;
  if (element.is('[type=radio]')) {
    radios = element.parents('form:first').find('[type=radio]').filter(function(i, e) {
      return $(e).attr('name') === element.attr('name');
    });
    element = radios.first();
  }
  return element;
};

incr = function(obj, pos, val) {
  var opp, temp;
  if (typeof val === 'string') {
    val = parseInt(val, 10);
  } else if (typeof val !== 'number') {
    return;
  }
  if (isNaN(val)) {
    return;
  }
  opp = positions[opposites[pos.charAt(0)]];
  temp = pos;
  if (obj[opp] !== undefined) {
    pos = positions[opp.charAt(0)];
    val = -val;
  }
  if (obj[pos] === undefined) {
    obj[pos] = val;
  } else {
    obj[pos] += val;
  }
  return null;
};

realign = function(alignment, inner, outer) {
  if (alignment === 'l' || alignment === 't') {
    return 0;
  } else if (alignment === 'c' || alignment === 'm') {
    return outer / 2 - inner / 2;
  } else if (alignment === 'r' || alignment === 'b') {
    return outer - inner;
  }
  throw "Invalid alignment";
};

encode = function(text) {
  encode.e = encode.e || createElem("div");
  return encode.e.text(text).html();
};

Notification = (function() {

  function Notification(elem, data, options) {
    if (typeof options === 'string') {
      options = {
        className: options
      };
    }
    this.options = inherit(pluginOptions, $.isPlainObject(options) ? options : {});
    this.loadHTML();
    this.wrapper = $(coreStyle.html);
    if (this.options.clickToHide) {
      this.wrapper.addClass("" + pluginClassName + "-hidable");
    }
    this.wrapper.data(pluginClassName, this);
    this.arrow = this.wrapper.find("." + pluginClassName + "-arrow");
    this.container = this.wrapper.find("." + pluginClassName + "-container");
    this.container.append(this.userContainer);
    if (elem && elem.length) {
      this.elementType = elem.attr('type');
      this.originalElement = elem;
      this.elem = getAnchorElement(elem);
      this.elem.data(pluginClassName, this);
      this.elem.before(this.wrapper);
    }
    this.container.hide();
    this.run(data);
  }

  Notification.prototype.loadHTML = function() {
    var style;
    style = this.getStyle();
    this.userContainer = $(style.html);
    return this.userFields = style.fields;
  };

  Notification.prototype.show = function(show, userCallback) {
    var args, callback, elems, fn, hidden,
      _this = this;
    callback = function() {
      if (!show && !_this.elem) {
        _this.destroy();
      }
      if (userCallback) {
        return userCallback();
      }
    };
    hidden = this.container.parent().parents(':hidden').length > 0;
    elems = this.container.add(this.arrow);
    args = [];
    if (hidden && show) {
      fn = 'show';
    } else if (hidden && !show) {
      fn = 'hide';
    } else if (!hidden && show) {
      fn = this.options.showAnimation;
      args.push(this.options.showDuration);
    } else if (!hidden && !show) {
      fn = this.options.hideAnimation;
      args.push(this.options.hideDuration);
    } else {
      return callback();
    }
    args.push(callback);
    return elems[fn].apply(elems, args);
  };

  Notification.prototype.setGlobalPosition = function() {
    var align, anchor, css, key, main, pAlign, pMain, _ref;
    _ref = this.getPosition(), pMain = _ref[0], pAlign = _ref[1];
    main = positions[pMain];
    align = positions[pAlign];
    key = pMain + "|" + pAlign;
    anchor = globalAnchors[key];
    if (!anchor) {
      anchor = globalAnchors[key] = createElem("div");
      css = {};
      css[main] = 0;
      if (align === 'middle') {
        css.top = '45%';
      } else if (align === 'center') {
        css.left = '45%';
      } else {
        css[align] = 0;
      }
      anchor.css(css).addClass("" + pluginClassName + "-corner");
      $("body").append(anchor);
    }
    return anchor.prepend(this.wrapper);
  };

  Notification.prototype.setElementPosition = function() {
    var arrowColor, arrowCss, arrowSize, color, contH, contW, css, elemH, elemIH, elemIW, elemPos, elemW, gap, mainFull, margin, opp, oppFull, pAlign, pArrow, pMain, pos, posFull, position, wrapPos, _i, _j, _len, _len1, _ref;
    position = this.getPosition();
    pMain = position[0], pAlign = position[1], pArrow = position[2];
    elemPos = this.elem.position();
    elemH = this.elem.outerHeight();
    elemW = this.elem.outerWidth();
    elemIH = this.elem.innerHeight();
    elemIW = this.elem.innerWidth();
    wrapPos = this.wrapper.position();
    contH = this.container.height();
    contW = this.container.width();
    mainFull = positions[pMain];
    opp = opposites[pMain];
    oppFull = positions[opp];
    css = {};
    css[oppFull] = pMain === 'b' ? elemH : pMain === 'r' ? elemW : 0;
    incr(css, 'top', elemPos.top - wrapPos.top);
    incr(css, 'left', elemPos.left - wrapPos.left);
    _ref = ['top', 'left'];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      pos = _ref[_i];
      margin = parseInt(this.elem.css("margin-" + pos), 10);
      if (margin) {
        incr(css, pos, margin);
      }
    }
    gap = Math.max(0, this.options.gap - (this.options.arrowShow ? arrowSize : 0));
    incr(css, oppFull, gap);
    if (!this.options.arrowShow) {
      this.arrow.hide();
    } else {
      arrowSize = this.options.arrowSize;
      arrowCss = $.extend({}, css);
      arrowColor = this.userContainer.css("border-color") || this.userContainer.css("background-color") || 'white';
      for (_j = 0, _len1 = mainPositions.length; _j < _len1; _j++) {
        pos = mainPositions[_j];
        posFull = positions[pos];
        if (pos === opp) {
          continue;
        }
        color = posFull === mainFull ? arrowColor : 'transparent';
        arrowCss["border-" + posFull] = "" + arrowSize + "px solid " + color;
      }
      incr(css, positions[opp], arrowSize);
      if (__indexOf.call(mainPositions, pAlign) >= 0) {
        incr(arrowCss, positions[pAlign], arrowSize * 2);
      }
    }
    if (__indexOf.call(vAligns, pMain) >= 0) {
      incr(css, 'left', realign(pAlign, contW, elemW));
      if (arrowCss) {
        incr(arrowCss, 'left', realign(pAlign, arrowSize, elemIW));
      }
    } else if (__indexOf.call(hAligns, pMain) >= 0) {
      incr(css, 'top', realign(pAlign, contH, elemH));
      if (arrowCss) {
        incr(arrowCss, 'top', realign(pAlign, arrowSize, elemIH));
      }
    }
    if (this.container.is(":visible")) {
      css.display = 'block';
    }
    this.container.removeAttr('style').css(css);
    if (arrowCss) {
      return this.arrow.removeAttr('style').css(arrowCss);
    }
  };

  Notification.prototype.getPosition = function() {
    var pos, text, _ref, _ref1, _ref2, _ref3, _ref4, _ref5;
    text = this.options.position || (this.elem ? this.options.elementPosition : this.options.globalPosition);
    pos = parsePosition(text);
    if (pos.length === 0) {
      pos[0] = 'b';
    }
    if (_ref = pos[0], __indexOf.call(mainPositions, _ref) < 0) {
      throw "Must be one of [" + mainPositions + "]";
    }
    if (pos.length === 1 || ((_ref1 = pos[0], __indexOf.call(vAligns, _ref1) >= 0) && (_ref2 = pos[1], __indexOf.call(hAligns, _ref2) < 0)) || ((_ref3 = pos[0], __indexOf.call(hAligns, _ref3) >= 0) && (_ref4 = pos[1], __indexOf.call(vAligns, _ref4) < 0))) {
      pos[1] = (_ref5 = pos[0], __indexOf.call(hAligns, _ref5) >= 0) ? 'm' : 'l';
    }
    if (pos.length === 2) {
      pos[2] = pos[1];
    }
    return pos;
  };

  Notification.prototype.getStyle = function(name) {
    var style;
    if (!name) {
      name = this.options.style;
    }
    if (!name) {
      name = 'default';
    }
    style = styles[name];
    if (!style) {
      throw "Missing style: " + name;
    }
    return style;
  };

  Notification.prototype.updateClasses = function() {
    var classes, style;
    classes = ['base'];
    if ($.isArray(this.options.className)) {
      classes = classes.concat(this.options.className);
    } else if (this.options.className) {
      classes.push(this.options.className);
    }
    style = this.getStyle();
    classes = $.map(classes, function(n) {
      return "" + pluginClassName + "-" + style.name + "-" + n;
    }).join(' ');
    return this.userContainer.attr('class', classes);
  };

  Notification.prototype.run = function(data, options) {
    var d, datas, name, type, value,
      _this = this;
    if ($.isPlainObject(options)) {
      $.extend(this.options, options);
    } else if ($.type(options) === 'string') {
      this.options.className = options;
    }
    if (this.container && !data) {
      this.show(false);
      return;
    } else if (!this.container && !data) {
      return;
    }
    datas = {};
    if ($.isPlainObject(data)) {
      datas = data;
    } else {
      datas[blankFieldName] = data;
    }
    for (name in datas) {
      d = datas[name];
      type = this.userFields[name];
      if (!type) {
        continue;
      }
      if (type === 'text') {
        d = encode(d);
        if (this.options.breakNewLines) {
          d = d.replace(/\n/g, '<br/>');
        }
      }
      value = name === blankFieldName ? '' : '=' + name;
      find(this.userContainer, "[data-notify-" + type + value + "]").html(d);
    }
    this.updateClasses();
    if (this.elem) {
      this.setElementPosition();
    } else {
      this.setGlobalPosition();
    }
    this.show(true);
    if (this.options.autoHide) {
      clearTimeout(this.autohideTimer);
      return this.autohideTimer = setTimeout(function() {
        return _this.show(false);
      }, this.options.autoHideDelay);
    }
  };

  Notification.prototype.destroy = function() {
    return this.wrapper.remove();
  };

  return Notification;

})();

$[pluginName] = function(elem, data, options) {
  if ((elem && elem.nodeName) || elem.jquery) {
    $(elem)[pluginName](data, options);
  } else {
    options = data;
    data = elem;
    new Notification(null, data, options);
  }
  return elem;
};

$.fn[pluginName] = function(data, options) {
  $(this).each(function() {
    var inst;
    inst = getAnchorElement($(this)).data(pluginClassName);
    if (inst) {
      return inst.run(data, options);
    } else {
      return new Notification($(this), data, options);
    }
  });
  return this;
};

$.extend($[pluginName], {
  defaults: defaults,
  addStyle: addStyle,
  pluginOptions: pluginOptions,
  getStyle: getStyle,
  insertCSS: insertCSS
});

$(function() {
  insertCSS(coreStyle.css).attr('id', 'core-notify');
  $(document).on('click', "." + pluginClassName + "-hidable", function(e) {
    return $(this).trigger('notify-hide');
  });
  return $(document).on('notify-hide', "." + pluginClassName + "-wrapper", function(e) {
    var _ref;
    return (_ref = $(this).data(pluginClassName)) != null ? _ref.show(false) : void 0;
  });
});

}(window,document,jQuery));

$.notify.addStyle("bootstrap", {
  html: "<div>\n<span data-notify-text></span>\n</div>",
  classes: {
    base: {
      "font-weight": "bold",
      "padding": "10px 15px 10px 14px",
      "text-shadow": "0 1px 0 rgba(255, 255, 255, 0.5)",
      "background-color": "#fcf8e3",
      "border": "1px solid #fbeed5",
      "border-radius": "4px",
      "white-space": "nowrap",
      "padding-left": "31px",
      "background-repeat": "no-repeat",
      "background-position": "6px 9px",
      "font-size": "14px",
      "box-shadow": "0 2px 2px rgba(0,0,0,.5)",
      "-webkit-font-smoothing": "antialiased"
    },
    error: {
      "color": "#983E3C",
      "background-color": "#F2DEDE",
      "border-color": "#EED3D7",
      "background-image": "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAtRJREFUeNqkVc1u00AQHq+dOD+0poIQfkIjalW0SEGqRMuRnHos3DjwAH0ArlyQeANOOSMeAA5VjyBxKBQhgSpVUKKQNGloFdw4cWw2jtfMOna6JOUArDTazXi/b3dm55socPqQhFka++aHBsI8GsopRJERNFlY88FCEk9Yiwf8RhgRyaHFQpPHCDmZG5oX2ui2yilkcTT1AcDsbYC1NMAyOi7zTX2Agx7A9luAl88BauiiQ/cJaZQfIpAlngDcvZZMrl8vFPK5+XktrWlx3/ehZ5r9+t6e+WVnp1pxnNIjgBe4/6dAysQc8dsmHwPcW9C0h3fW1hans1ltwJhy0GxK7XZbUlMp5Ww2eyan6+ft/f2FAqXGK4CvQk5HueFz7D6GOZtIrK+srupdx1GRBBqNBtzc2AiMr7nPplRdKhb1q6q6zjFhrklEFOUutoQ50xcX86ZlqaZpQrfbBdu2R6/G19zX6XSgh6RX5ubyHCM8nqSID6ICrGiZjGYYxojEsiw4PDwMSL5VKsC8Yf4VRYFzMzMaxwjlJSlCyAQ9l0CW44PBADzXhe7xMdi9HtTrdYjFYkDQL0cn4Xdq2/EAE+InCnvADTf2eah4Sx9vExQjkqXT6aAERICMewd/UAp/IeYANM2joxt+q5VI+ieq2i0Wg3l6DNzHwTERPgo1ko7XBXj3vdlsT2F+UuhIhYkp7u7CarkcrFOCtR3H5JiwbAIeImjT/YQKKBtGjRFCU5IUgFRe7fF4cCNVIPMYo3VKqxwjyNAXNepuopyqnld602qVsfRpEkkz+GFL1wPj6ySXBpJtWVa5xlhpcyhBNwpZHmtX8AGgfIExo0ZpzkWVTBGiXCSEaHh62/PoR0p/vHaczxXGnj4bSo+G78lELU80h1uogBwWLf5YlsPmgDEd4M236xjm+8nm4IuE/9u+/PH2JXZfbwz4zw1WbO+SQPpXfwG/BBgAhCNZiSb/pOQAAAAASUVORK5CYII=)"
    },
    success: {
      "color": "#2C582D",
      "background-color": "#DFF0D8",
      "border-color": "#D6E9C6",
      "background-image": "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAutJREFUeNq0lctPE0Ecx38zu/RFS1EryqtgJFA08YCiMZIAQQ4eRG8eDGdPJiYeTIwHTfwPiAcvXIwXLwoXPaDxkWgQ6islKlJLSQWLUraPLTv7Gme32zoF9KSTfLO7v53vZ3d/M7/fIth+IO6INt2jjoA7bjHCJoAlzCRw59YwHYjBnfMPqAKWQYKjGkfCJqAF0xwZjipQtA3MxeSG87VhOOYegVrUCy7UZM9S6TLIdAamySTclZdYhFhRHloGYg7mgZv1Zzztvgud7V1tbQ2twYA34LJmF4p5dXF1KTufnE+SxeJtuCZNsLDCQU0+RyKTF27Unw101l8e6hns3u0PBalORVVVkcaEKBJDgV3+cGM4tKKmI+ohlIGnygKX00rSBfszz/n2uXv81wd6+rt1orsZCHRdr1Imk2F2Kob3hutSxW8thsd8AXNaln9D7CTfA6O+0UgkMuwVvEFFUbbAcrkcTA8+AtOk8E6KiQiDmMFSDqZItAzEVQviRkdDdaFgPp8HSZKAEAL5Qh7Sq2lIJBJwv2scUqkUnKoZgNhcDKhKg5aH+1IkcouCAdFGAQsuWZYhOjwFHQ96oagWgRoUov1T9kRBEODAwxM2QtEUl+Wp+Ln9VRo6BcMw4ErHRYjH4/B26AlQoQQTRdHWwcd9AH57+UAXddvDD37DmrBBV34WfqiXPl61g+vr6xA9zsGeM9gOdsNXkgpEtTwVvwOklXLKm6+/p5ezwk4B+j6droBs2CsGa/gNs6RIxazl4Tc25mpTgw/apPR1LYlNRFAzgsOxkyXYLIM1V8NMwyAkJSctD1eGVKiq5wWjSPdjmeTkiKvVW4f2YPHWl3GAVq6ymcyCTgovM3FzyRiDe2TaKcEKsLpJvNHjZgPNqEtyi6mZIm4SRFyLMUsONSSdkPeFtY1n0mczoY3BHTLhwPRy9/lzcziCw9ACI+yql0VLzcGAZbYSM5CCSZg1/9oc/nn7+i8N9p/8An4JMADxhH+xHfuiKwAAAABJRU5ErkJggg==)"
    },
    info: {
      "color": "#25566F",
      "background-color": "#D9EDF7",
      "border-color": "#BCE8F1",
      "background-image": "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3QYFAhkSsdes/QAAA8dJREFUOMvVlGtMW2UYx//POaWHXg6lLaW0ypAtw1UCgbniNOLcVOLmAjHZolOYlxmTGXVZdAnRfXQm+7SoU4mXaOaiZsEpC9FkiQs6Z6bdCnNYruM6KNBw6YWewzl9z+sHImEWv+vz7XmT95f/+3/+7wP814v+efDOV3/SoX3lHAA+6ODeUFfMfjOWMADgdk+eEKz0pF7aQdMAcOKLLjrcVMVX3xdWN29/GhYP7SvnP0cWfS8caSkfHZsPE9Fgnt02JNutQ0QYHB2dDz9/pKX8QjjuO9xUxd/66HdxTeCHZ3rojQObGQBcuNjfplkD3b19Y/6MrimSaKgSMmpGU5WevmE/swa6Oy73tQHA0Rdr2Mmv/6A1n9w9suQ7097Z9lM4FlTgTDrzZTu4StXVfpiI48rVcUDM5cmEksrFnHxfpTtU/3BFQzCQF/2bYVoNbH7zmItbSoMj40JSzmMyX5qDvriA7QdrIIpA+3cdsMpu0nXI8cV0MtKXCPZev+gCEM1S2NHPvWfP/hL+7FSr3+0p5RBEyhEN5JCKYr8XnASMT0xBNyzQGQeI8fjsGD39RMPk7se2bd5ZtTyoFYXftF6y37gx7NeUtJJOTFlAHDZLDuILU3j3+H5oOrD3yWbIztugaAzgnBKJuBLpGfQrS8wO4FZgV+c1IxaLgWVU0tMLEETCos4xMzEIv9cJXQcyagIwigDGwJgOAtHAwAhisQUjy0ORGERiELgG4iakkzo4MYAxcM5hAMi1WWG1yYCJIcMUaBkVRLdGeSU2995TLWzcUAzONJ7J6FBVBYIggMzmFbvdBV44Corg8vjhzC+EJEl8U1kJtgYrhCzgc/vvTwXKSib1paRFVRVORDAJAsw5FuTaJEhWM2SHB3mOAlhkNxwuLzeJsGwqWzf5TFNdKgtY5qHp6ZFf67Y/sAVadCaVY5YACDDb3Oi4NIjLnWMw2QthCBIsVhsUTU9tvXsjeq9+X1d75/KEs4LNOfcdf/+HthMnvwxOD0wmHaXr7ZItn2wuH2SnBzbZAbPJwpPx+VQuzcm7dgRCB57a1uBzUDRL4bfnI0RE0eaXd9W89mpjqHZnUI5Hh2l2dkZZUhOqpi2qSmpOmZ64Tuu9qlz/SEXo6MEHa3wOip46F1n7633eekV8ds8Wxjn37Wl63VVa+ej5oeEZ/82ZBETJjpJ1Rbij2D3Z/1trXUvLsblCK0XfOx0SX2kMsn9dX+d+7Kf6h8o4AIykuffjT8L20LU+w4AZd5VvEPY+XpWqLV327HR7DzXuDnD8r+ovkBehJ8i+y8YAAAAASUVORK5CYII=)"
    },
    warn: {
      "color": "#7B6236",
      "background-color": "#FCF8E3",
      "border-color": "#FBEED5",
      "background-image": "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAABJlBMVEXr6eb/2oD/wi7/xjr/0mP/ykf/tQD/vBj/3o7/uQ//vyL/twebhgD/4pzX1K3z8e349vK6tHCilCWbiQymn0jGworr6dXQza3HxcKkn1vWvV/5uRfk4dXZ1bD18+/52YebiAmyr5S9mhCzrWq5t6ufjRH54aLs0oS+qD751XqPhAybhwXsujG3sm+Zk0PTwG6Shg+PhhObhwOPgQL4zV2nlyrf27uLfgCPhRHu7OmLgAafkyiWkD3l49ibiAfTs0C+lgCniwD4sgDJxqOilzDWowWFfAH08uebig6qpFHBvH/aw26FfQTQzsvy8OyEfz20r3jAvaKbhgG9q0nc2LbZxXanoUu/u5WSggCtp1anpJKdmFz/zlX/1nGJiYmuq5Dx7+sAAADoPUZSAAAAAXRSTlMAQObYZgAAAAFiS0dEAIgFHUgAAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfdBgUBGhh4aah5AAAAlklEQVQY02NgoBIIE8EUcwn1FkIXM1Tj5dDUQhPU502Mi7XXQxGz5uVIjGOJUUUW81HnYEyMi2HVcUOICQZzMMYmxrEyMylJwgUt5BljWRLjmJm4pI1hYp5SQLGYxDgmLnZOVxuooClIDKgXKMbN5ggV1ACLJcaBxNgcoiGCBiZwdWxOETBDrTyEFey0jYJ4eHjMGWgEAIpRFRCUt08qAAAAAElFTkSuQmCC)"
    }
  }
});

},{}],8:[function(require,module,exports){
/**
 * @name Owl Carousel - code name Phenix
 * @author Bartosz Wojciechowski
 * @release 2014
 * Licensed under MIT
 *
 * @version 2.0.0-beta.1.8
 * @versionNotes Not compatibile with Owl Carousel <2.0.0
 */

/*

{0,0}
 )_)
 ""

To do:

* Lazy Load Icon
* prevent animationend bubling
* itemsScaleUp
* Test Zepto

Callback events list:

onInitBefore
onInitAfter
onResponsiveBefore
onResponsiveAfter
onTransitionStart
onTransitionEnd
onTouchStart
onTouchEnd
onChangeState
onLazyLoaded
onVideoPlay
onVideoStop

Custom events list:

next.owl
prev.owl
goTo.owl
jumpTo.owl
addItem.owl
removeItem.owl
refresh.owl
play.owl
stop.owl
stopVideo.owl

*/


;(function ( $, window, document, undefined ) {

	var defaults = {
		items:				3,
		loop:				false,
		center:				false,

		mouseDrag:			true,
		touchDrag:			true,
		pullDrag: 			true,
		freeDrag:			false,

		margin:				0,
		stagePadding:		0,

		merge:				false,
		mergeFit:			true,
		autoWidth:			false,
		autoHeight:			false,

		startPosition:		0,
		URLhashListener:	false,

		nav: 				false,
		navRewind:			true,
		navText: 			['prev','next'],
		slideBy:			1,
		dots: 				true,
		dotsEach:			false,
		dotData:			false,

		lazyLoad:			false,
		lazyContent:		false,

		autoplay:			false,
		autoplayTimeout:	5000,
		autoplayHoverPause:	false,

		smartSpeed:			250,
		fluidSpeed:			false,
		autoplaySpeed:		false,
		navSpeed:			false,
		dotsSpeed:			false,
		dragEndSpeed:		false,

		responsive: 		{},
		responsiveRefreshRate : 200,
		responsiveBaseElement: window,
		responsiveClass:	false,

		video:				false,
		videoHeight:		false,
		videoWidth:			false,

		animateOut:			false,
		animateIn:			false,

		fallbackEasing:		'swing',

		callbacks:			false,
		info: 				false,

		nestedItemSelector:	false,
		itemElement:		'div',
		stageElement:		'div',

		//Classes and Names
		themeClass: 		'owl-theme',
		baseClass:			'owl-carousel',
		itemClass:			'owl-item',
		centerClass:		'center',
		activeClass: 		'active',
		navContainerClass:	'owl-nav',
		navClass:			['owl-prev','owl-next'],
		controlsClass:		'owl-controls',
		dotClass: 			'owl-dot',
		dotsClass:			'owl-dots',
		autoHeightClass:	'owl-height'

	};

	// Reference to DOM elements
	// Those with $ sign are jQuery objects

	var dom = {
		el:			null,	// main element
		$el:		null,	// jQuery main element
		stage:		null,	// stage
		$stage:		null,	// jQuery stage
		oStage:		null,	// outer stage
		$oStage:	null,	// $ outer stage
		$items:		null,	// all items, clones and originals included
		$oItems:	null,	// original items
		$cItems:	null,	// cloned items only
		$cc:		null,
		$navPrev:	null,
		$navNext:	null,
		$page:		null,
		$nav:		null,
		$content:	null
	};

	/**
	 * Variables
	 * @since 2.0.0
	 */

	// Only for development process

	// Widths

	var width = {
		el:			0,
		stage:		0,
		item:		0,
		prevWindow:	0,
		cloneLast:  0
	};

	// Numbers

	var num = {
		items:				0,
		oItems: 			0,
		cItems:				0,
		active:				0,
		merged:				[],
		nav:				[],
		allPages:			0
	};

	// Positions

	var pos = {
		start:		0,
		max:		0,
		maxValue:	0,
		prev:		0,
		current:	0,
		currentAbs:	0,
		currentPage:0,
		stage:		0,
		items:		[],
		lsCurrent:	0
	};

	// Drag/Touches

	var drag = {
		start:		0,
		startX:		0,
		startY:		0,
		current:	0,
		currentX:	0,
		currentY:	0,
		offsetX:	0,
		offsetY:	0,
		distance:	null,
		startTime:	0,
		endTime:	0,
		updatedX:	0,
		targetEl:	null
	};

	// Speeds

	var speed = {
		onDragEnd: 	300,
		nav:		300,
		css2speed:	0

	};

	// States

	var state = {
		isTouch:		false,
		isScrolling:	false,
		isSwiping:		false,
		direction:		false,
		inMotion:		false,
		autoplay:		false,
		lazyContent:	false
	};

	// Event functions references

	var e = {
		_onDragStart:	null,
		_onDragMove:	null,
		_onDragEnd:		null,
		_transitionEnd: null,
		_resizer:		null,
		_responsiveCall:null,
		_goToLoop:		null,
		_checkVisibile: null,
		_autoplay:		null,
		_pause:			null,
		_play:			null,
		_stop:			null
	};

	function Owl( element, options ) {

		// add basic Owl information to dom element

		element.owlCarousel = {
			'name':		'Owl Carousel',
			'author':	'Bartosz Wojciechowski',
			'version':	'2.0.0-beta.1.8',
			'released':	'03.05.2014'
		};

		// Attach variables to object
		// Only for development process

		this.options = 		$.extend( {}, defaults, options);
		this._options =		$.extend( {}, defaults, options);
		this.dom =			$.extend( {}, dom);
		this.width =		$.extend( {}, width);
		this.num =			$.extend( {}, num);
		this.pos =			$.extend( {}, pos);
		this.drag =			$.extend( {}, drag);
		this.speed =		$.extend( {}, speed);
		this.state =		$.extend( {}, state);
		this.e =			$.extend( {}, e);

		this.dom.el =		element;
		this.dom.$el =		$(element);
		this.init();
	}

	/**
	 * init
	 * @since 2.0.0
	 */

	Owl.prototype.init = function(){

		this.fireCallback('onInitBefore');

		//Add base class
		if(!this.dom.$el.hasClass(this.options.baseClass)){
			this.dom.$el.addClass(this.options.baseClass);
		}

		//Add theme class
		if(!this.dom.$el.hasClass(this.options.themeClass)){
			this.dom.$el.addClass(this.options.themeClass);
		}

		//Add theme class
		if(this.options.rtl){
			this.dom.$el.addClass('owl-rtl');
		}

		// Check support
		this.browserSupport();

		// Sort responsive items in array
		this.sortOptions();

		// Update options.items on given size
		this.setResponsiveOptions();

		if(this.options.autoWidth && this.state.imagesLoaded !== true){
			var imgs = this.dom.$el.find('img');
			if(imgs.length){
				this.preloadAutoWidthImages(imgs);
				return false;
			}
		}

		// Get and store window width
		// iOS safari likes to trigger unnecessary resize event
		this.width.prevWindow = this.windowWidth();

		// create stage object
		this.createStage();

		// Append local content
		this.fetchContent();

		// attach generic events
		this.eventsCall();

		// attach custom control events
		this.addCustomEvents();

		// attach generic events
		this.internalEvents();

		this.dom.$el.addClass('owl-loading');
		this.refresh(true);
		this.dom.$el.removeClass('owl-loading').addClass('owl-loaded');
		this.fireCallback('onInitAfter');
	};

	/**
	 * sortOptions
	 * @desc Sort responsive sizes
	 * @since 2.0.0
	 */

	Owl.prototype.sortOptions = function(){

		var resOpt = this.options.responsive;
		this.responsiveSorted = {};
		var keys = [],
		i, j, k;
		for (i in resOpt){
			keys.push(i);
		}

		keys = keys.sort(function (a, b) {return a - b;});

		for (j = 0; j < keys.length; j++){
			k = keys[j];
			this.responsiveSorted[k] = resOpt[k];
		}

	};

	/**
	 * setResponsiveOptions
	 * @since 2.0.0
	 */

	Owl.prototype.setResponsiveOptions = function(){
		if(this.options.responsive === false){return false;}

		var width = this.windowWidth();
		var resOpt = this.options.responsive;
		var i,j,k, minWidth;

		// overwrite non resposnive options
		for(k in this._options){
			if(k !== 'responsive'){
				this.options[k] = this._options[k];
			}
		}

		// find responsive width
		for (i in this.responsiveSorted){
			if(i<= width){
				minWidth = i;
				// set responsive options
				for(j in this.responsiveSorted[minWidth]){
					this.options[j] = this.responsiveSorted[minWidth][j];
				}

			}
		}
		this.num.breakpoint = minWidth;

		// Responsive Class
		if(this.options.responsiveClass){
			this.dom.$el.attr('class',
				function(i, c){
				return c.replace(/\b owl-responsive-\S+/g, '');
			}).addClass('owl-responsive-'+minWidth);
		}


	};

	/**
	 * optionsLogic
	 * @desc Update option logic if necessery
	 * @since 2.0.0
	 */

	Owl.prototype.optionsLogic = function(){
		// Toggle Center class
		this.dom.$el.toggleClass('owl-center',this.options.center);

		// Scroll per - 'page' option will scroll per visible items number
		// You can set this to any other number below visible items.
		if(this.options.slideBy && this.options.slideBy === 'page'){
			this.options.slideBy = this.options.items;
		} else if(this.options.slideBy > this.options.items){
			this.options.slideBy = this.options.items;
		}

		// if items number is less than in body
		if(this.options.loop && this.num.oItems < this.options.items){
			this.options.loop = false;
		}

		if(this.num.oItems < 2){
			this.options.loop = false;
			this.options.dots = false;
			this.options.nav = false;
			this.options.mouseDrag = false;
			this.options.touchDrag = false;
			this.options.pullDrag = false;
			this.options.freeDrag = false;
		}

		if(this.num.oItems <= this.options.items){
			this.options.navRewind = false;
		}

		if(this.options.autoWidth){
			this.options.stagePadding = false;
			this.options.dotsEach = 1;
			this.options.merge = false;
		}
		if(this.state.lazyContent){
			this.options.loop = false;
			this.options.merge = false;
			this.options.dots = false;
			this.options.freeDrag = false;
			this.options.lazyContent = true;
		}

		if((this.options.animateIn || this.options.animateOut) && this.options.items === 1 && this.support3d){
			this.state.animate = true;
		} else {this.state.animate = false;}

	};

	/**
	 * createStage
	 * @desc Create stage and Outer-stage elements
	 * @since 2.0.0
	 */

	Owl.prototype.createStage = function(){
		var oStage = document.createElement('div');
		var stage = document.createElement(this.options.stageElement);

		oStage.className = 'owl-stage-outer';
		stage.className = 'owl-stage';

		oStage.appendChild(stage);
		this.dom.el.appendChild(oStage);

		this.dom.oStage = oStage;
		this.dom.$oStage = $(oStage);
		this.dom.stage = stage;
		this.dom.$stage = $(stage);

		oStage = null;
		stage = null;
	};

	/**
	 * createItem
	 * @desc Create item container
	 * @since 2.0.0
	 */

	Owl.prototype.createItem = function(){
		var item = document.createElement(this.options.itemElement);
		item.className = this.options.itemClass;
		return item;
	};

	/**
	 * fetchContent
	 * @since 2.0.0
	 */

	Owl.prototype.fetchContent = function(extContent){
		if(extContent){
			this.dom.$content = (extContent instanceof jQuery) ? extContent : $(extContent);
		}
		else if(this.options.nestedItemSelector){
			this.dom.$content= this.dom.$el.find('.'+this.options.nestedItemSelector).not('.owl-stage-outer');
		}
		else {
			this.dom.$content= this.dom.$el.children().not('.owl-stage-outer');
		}
		// content length
		this.num.oItems = this.dom.$content.length;

		// init Structure
		if(this.num.oItems !== 0){
			this.initStructure();
		}
	};


	/**
	 * initStructure
	 * @param [refresh] - if refresh and not lazyContent then dont create normal structure
	 * @since 2.0.0
	 */

	Owl.prototype.initStructure = function(){

		// lazyContent needs at least 3*items

		if(this.options.lazyContent && this.num.oItems >= this.options.items*3){
			this.state.lazyContent = true;
		} else {
			this.state.lazyContent = false;
		}

		if(this.state.lazyContent){

			// start position
			this.pos.currentAbs = this.options.items;

			//remove lazy content from DOM
			this.dom.$content.remove();

		} else {
			// create normal structure
			this.createNormalStructure();
		}
	};

	/**
	 * createNormalStructure
	 * @desc Create normal structure for small/mid weight content
	 * @since 2.0.0
	 */

	Owl.prototype.createNormalStructure = function(){
		for(var i = 0; i < this.num.oItems; i++){
			// fill 'owl-item' with content
			var item = this.fillItem(this.dom.$content,i);
			// append into stage
			this.dom.$stage.append(item);
		}
		this.dom.$content = null;
	};

	/**
	 * createCustomStructure
	 * @since 2.0.0
	 */

	Owl.prototype.createCustomStructure = function(howManyItems){
		for(var i = 0; i < howManyItems; i++){
			var emptyItem = this.createItem();
			var item = $(emptyItem);

			this.setData(item,false);
			this.dom.$stage.append(item);
		}
	};

	/**
	 * createLazyContentStructure
	 * @desc Create lazyContent structure for large content and better mobile experience
	 * @since 2.0.0
	 */

	Owl.prototype.createLazyContentStructure = function(refresh){
		if(!this.state.lazyContent){return false;}

		// prevent recreate - to do
		if(refresh && this.dom.$stage.children().length === this.options.items*3){
			return false;
		}
		// remove items from stage
		this.dom.$stage.empty();

		// create custom structure
		this.createCustomStructure(3*this.options.items);
	};

	/**
	 * fillItem
	 * @desc Fill empty item container with provided content
	 * @since 2.0.0
	 * @param [content] - string/$dom - passed owl-item
	 * @param [i] - index in jquery object
	 * return $ new object
	 */

	Owl.prototype.fillItem = function(content,i){
		var emptyItem = this.createItem();
		var c = content[i] || content;
		// set item data
		var traversed = this.traversContent(c);
		this.setData(emptyItem,false,traversed);
		return $(emptyItem).append(c);
	};

	/**
	 * traversContent
	 * @since 2.0.0
	 * @param [c] - content
	 * return object
	 */

	Owl.prototype.traversContent = function(c){
		var $c = $(c), dotValue, hashValue;
		if(this.options.dotData){
			dotValue = $c.find('[data-dot]').andSelf().data('dot');
		}
		// update URL hash
		if(this.options.URLhashListener){
			hashValue = $c.find('[data-hash]').andSelf().data('hash');
		}
		return {
			dot : dotValue || false,
			hash : hashValue  || false
		};
	};


	/**
	 * setData
	 * @desc Set item jQuery Data
	 * @since 2.0.0
	 * @param [item] - dom - passed owl-item
	 * @param [cloneObj] - $dom - passed clone item
	 */


	Owl.prototype.setData = function(item,cloneObj,traversed){
		var dot,hash;
		if(traversed){
			dot = traversed.dot;
			hash = traversed.hash;
		}
		var itemData = {
			index:		false,
			indexAbs:	false,
			posLeft:	false,
			clone:		false,
			active:		false,
			loaded:		false,
			lazyLoad:	false,
			current:	false,
			width:		false,
			center:		false,
			page:		false,
			hasVideo:	false,
			playVideo:	false,
			dot:		dot,
			hash:		hash
		};

		// copy itemData to cloned item

		if(cloneObj){
			itemData = $.extend({}, itemData, cloneObj.data('owl-item'));
		}

		$(item).data('owl-item', itemData);
	};

	/**
	 * updateLocalContent
	 * @since 2.0.0
	 */

	Owl.prototype.updateLocalContent = function(){
		this.dom.$oItems = this.dom.$stage.find('.'+this.options.itemClass).filter(function(){
			return $(this).data('owl-item').clone === false;
		});

		this.num.oItems = this.dom.$oItems.length;
		//update index on original items

		for(var k = 0; k<this.num.oItems; k++){
			var item = this.dom.$oItems.eq(k);
			item.data('owl-item').index = k;
		}
	};

	/**
	 * checkVideoLinks
	 * @desc Check if for any videos links
	 * @since 2.0.0
	 */

	Owl.prototype.checkVideoLinks = function(){
		if(!this.options.video){return false;}
		var videoEl,item;

		for(var i = 0; i<this.num.items; i++){

			item = this.dom.$items.eq(i);
			if(item.data('owl-item').hasVideo){
				continue;
			}

			videoEl = item.find('.owl-video');
			if(videoEl.length){
				this.state.hasVideos = true;
				this.dom.$items.eq(i).data('owl-item').hasVideo = true;
				videoEl.css('display','none');
				this.getVideoInfo(videoEl,item);
			}
		}
	};

	/**
	 * getVideoInfo
	 * @desc Get Video ID and Type (YouTube/Vimeo only)
	 * @since 2.0.0
	 */

	Owl.prototype.getVideoInfo = function(videoEl,item){

		var info, type, id,
			vimeoId = videoEl.data('vimeo-id'),
			youTubeId = videoEl.data('youtube-id'),
			width = videoEl.data('width') || this.options.videoWidth,
			height = videoEl.data('height') || this.options.videoHeight,
			url = videoEl.attr('href');

		if(vimeoId){
			type = 'vimeo';
			id = vimeoId;
		} else if(youTubeId){
			type = 'youtube';
			id = youTubeId;
		} else if(url){
			id = url.match(/(http:|https:|)\/\/(player.|www.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com))\/(video\/|embed\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/);

			if (id[3].indexOf('youtu') > -1) {
				type = 'youtube';
			} else if (id[3].indexOf('vimeo') > -1) {
				type = 'vimeo';
			}
			id = id[6];
		} else {
			throw new Error('Missing video link.');
		}

		item.data('owl-item').videoType = type;
		item.data('owl-item').videoId = id;
		item.data('owl-item').videoWidth = width;
		item.data('owl-item').videoHeight = height;

		info = {
			type: type,
			id: id
		};

		// Check dimensions
		var dimensions = width && height ? 'style="width:'+width+'px;height:'+height+'px;"' : '';

		// wrap video content into owl-video-wrapper div
		videoEl.wrap('<div class="owl-video-wrapper"'+dimensions+'></div>');

		this.createVideoTn(videoEl,info);
	};

	/**
	 * createVideoTn
	 * @desc Create Video Thumbnail
	 * @since 2.0.0
	 */

	Owl.prototype.createVideoTn = function(videoEl,info){

		var tnLink,icon,height;
		var customTn = videoEl.find('img');
		var srcType = 'src';
		var lazyClass = '';
		var that = this;

		if(this.options.lazyLoad){
			srcType = 'data-src';
			lazyClass = 'owl-lazy';
		}

		// Custom thumbnail

		if(customTn.length){
			addThumbnail(customTn.attr(srcType));
			customTn.remove();
			return false;
		}

		function addThumbnail(tnPath){
			icon = '<div class="owl-video-play-icon"></div>';

			if(that.options.lazyLoad){
				tnLink = '<div class="owl-video-tn '+ lazyClass +'" '+ srcType +'="'+ tnPath +'"></div>';
			} else{
				tnLink = '<div class="owl-video-tn" style="opacity:1;background-image:url(' + tnPath + ')"></div>';
			}
			videoEl.after(tnLink);
			videoEl.after(icon);
		}

		if(info.type === 'youtube'){
			var path = "http://img.youtube.com/vi/"+ info.id +"/hqdefault.jpg";
			addThumbnail(path);
		} else
		if(info.type === 'vimeo'){
			$.ajax({
				type:'GET',
				url: 'http://vimeo.com/api/v2/video/' + info.id + '.json',
				jsonp: 'callback',
				dataType: 'jsonp',
				success: function(data){
					var path = data[0].thumbnail_large;
					addThumbnail(path);
					if(that.options.loop){
						that.updateItemState();
					}
				}
			});
		}
	};

	/**
	 * stopVideo
	 * @since 2.0.0
	 */

	Owl.prototype.stopVideo = function(){
		this.fireCallback('onVideoStop');
		var item = this.dom.$items.eq(this.state.videoPlayIndex);
		item.find('.owl-video-frame').remove();
		item.removeClass('owl-video-playing');
		this.state.videoPlay = false;
	};

	/**
	 * playVideo
	 * @since 2.0.0
	 */

	Owl.prototype.playVideo = function(ev){
		this.fireCallback('onVideoPlay');

		if(this.state.videoPlay){
			this.stopVideo();
		}
		var videoLink,videoWrap,
			target = $(ev.target || ev.srcElement),
			item = target.closest('.'+this.options.itemClass);

		var videoType = item.data('owl-item').videoType,
			id = item.data('owl-item').videoId,
			width = item.data('owl-item').videoWidth || Math.floor(item.data('owl-item').width - this.options.margin),
			height = item.data('owl-item').videoHeight || this.dom.$stage.height();

		if(videoType === 'youtube'){
			videoLink = "<iframe width=\""+ width +"\" height=\""+ height +"\" src=\"http://www.youtube.com/embed/" + id + "?autoplay=1&v=" + id + "\" frameborder=\"0\" allowfullscreen></iframe>";
		} else if(videoType === 'vimeo'){
			videoLink = '<iframe src="http://player.vimeo.com/video/'+ id +'?autoplay=1" width="'+ width +'" height="'+ height +'" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';
		}

		item.addClass('owl-video-playing');
		this.state.videoPlay = true;
		this.state.videoPlayIndex = item.data('owl-item').indexAbs;

		videoWrap = $('<div style="height:'+ height +'px; width:'+ width +'px" class="owl-video-frame">' + videoLink + '</div>');
		target.after(videoWrap);
	};

	/**
	 * loopClone
	 * @desc Make a clones for infinity loop
	 * @since 2.0.0
	 */

	Owl.prototype.loopClone = function(){
		if(!this.options.loop || this.state.lazyContent || this.num.oItems < this.options.items){return false;}

		var firstClone,	lastClone, i,
			num	=		this.options.items,
			lastNum =	this.num.oItems-1;

		// if neighbour margin then add one more duplicat
		if(this.options.stagePadding && this.options.items === 1){
			num+=1;
		}
		this.num.cItems = num * 2;

		for(i = 0; i < num; i++){
			// Clone item
			var first =		this.dom.$oItems.eq(i).clone(true,true);
			var last =		this.dom.$oItems.eq(lastNum-i).clone(true,true);
			firstClone = 	$(first[0]).addClass('cloned');
			lastClone = 	$(last[0]).addClass('cloned');

			// set clone data
			// Somehow data has reference to same data id in cash

			this.setData(firstClone[0],first);
			this.setData(lastClone[0],last);

			firstClone.data('owl-item').clone = true;
			lastClone.data('owl-item').clone = true;

			this.dom.$stage.append(firstClone);
			this.dom.$stage.prepend(lastClone);

			firstClone = lastClone = null;
		}

		this.dom.$cItems = this.dom.$stage.find('.'+this.options.itemClass).filter(function(){
			return $(this).data('owl-item').clone === true;
		});
	};

	/**
	 * reClone
	 * @desc Update Cloned elements
	 * @since 2.0.0
	 */

	Owl.prototype.reClone = function(){
		// remove cloned items
		if(this.dom.$cItems !== null){ // && (this.num.oItems !== 0 && this.num.oItems <= this.options.items)){
			this.dom.$cItems.remove();
			this.dom.$cItems = null;
			this.num.cItems = 0;
		}

		if(!this.options.loop){
			return;
		}
		// generete new elements
		this.loopClone();
	};

	/**
	 * calculate
	 * @desc Update item index data
	 * @since 2.0.0
	 */

	Owl.prototype.calculate = function(){

		var i,j,k,dist,posLeft=0,fullWidth=0;

		// element width minus neighbour
		this.width.el = this.dom.$el.width() - (this.options.stagePadding*2);

		//to check
		this.width.view = this.dom.$el.width();

		// calculate width minus addition margins
		var elMinusMargin = this.width.el - (this.options.margin * (this.options.items === 1 ? 0 : this.options.items -1));

		// calculate element width and item width
		this.width.el =  	this.width.el + this.options.margin;
		this.width.item = 	((elMinusMargin / this.options.items) + this.options.margin).toFixed(3);

		this.dom.$items = 	this.dom.$stage.find('.owl-item');
		this.num.items = 	this.dom.$items.length;

		//change to autoWidths
		if(this.options.autoWidth){
			this.dom.$items.css('width','');
		}

		// Set grid array
		this.pos.items = 	[];
		this.num.merged = 	[];
		this.num.nav = 		[];

		// item distances
		if(this.options.rtl){
			dist = this.options.center ? -((this.width.el)/2) : 0;
		} else {
			dist = this.options.center ? (this.width.el)/2 : 0;
		}

		this.width.mergeStage = 0;

		// Calculate items positions
		for(i = 0; i<this.num.items; i++){

			// check merged items

			if(this.options.merge){
				var mergeNumber = this.dom.$items.eq(i).find('[data-merge]').attr('data-merge') || 1;
				if(this.options.mergeFit && mergeNumber > this.options.items){
					mergeNumber = this.options.items;
				}
				this.num.merged.push(parseInt(mergeNumber));
				this.width.mergeStage += this.width.item * this.num.merged[i];
			} else {
				this.num.merged.push(1);
			}

			// Array based on merged items used by dots and navigation
			if(this.options.loop){
				if(i>=this.num.cItems/2 && i<this.num.cItems/2+this.num.oItems){
					this.num.nav.push(this.num.merged[i]);
				}
			} else {
				this.num.nav.push(this.num.merged[i]);
			}

			var iWidth = this.width.item * this.num.merged[i];

			// autoWidth item size
			if(this.options.autoWidth){
				iWidth = this.dom.$items.eq(i).width() + this.options.margin;
				if(this.options.rtl){
					this.dom.$items[i].style.marginLeft = this.options.margin + 'px';
				} else {
					this.dom.$items[i].style.marginRight = this.options.margin + 'px';
				}

			}
			// push item position into array
			this.pos.items.push(dist);

			// update item data
			this.dom.$items.eq(i).data('owl-item').posLeft = posLeft;
			this.dom.$items.eq(i).data('owl-item').width = iWidth;

			// dist starts from middle of stage if center
			// posLeft always starts from 0
			if(this.options.rtl){
				dist += iWidth;
				posLeft += iWidth;
			} else{
				dist -= iWidth;
				posLeft -= iWidth;
			}

			fullWidth -= Math.abs(iWidth);

			// update position if center
			if(this.options.center){
				this.pos.items[i] = !this.options.rtl ? this.pos.items[i] - (iWidth/2) : this.pos.items[i] + (iWidth/2);
			}
		}

		if(this.options.autoWidth){
			this.width.stage = this.options.center ? Math.abs(fullWidth) : Math.abs(dist);
		} else {
			this.width.stage = Math.abs(fullWidth);
		}

		//update indexAbs on all items
		var allItems = this.num.oItems + this.num.cItems;

		for(j = 0; j< allItems; j++){
			this.dom.$items.eq(j).data('owl-item').indexAbs = j;
		}

		// Set Min and Max
		this.setMinMax();

		// Recalculate grid
		this.setSizes();
	};

	/**
	 * setMinMax
	 * @since 2.0.0
	 */

	Owl.prototype.setMinMax = function(){

		// set Min
		var minimum = this.dom.$oItems.eq(0).data('owl-item').indexAbs;
		this.pos.min = 0;
		this.pos.minValue = this.pos.items[minimum];

		// set max position
		if(!this.options.loop){
			this.pos.max = this.num.oItems-1;
		}

		if(this.options.loop){
			this.pos.max = this.num.oItems+this.options.items;
		}

		if(!this.options.loop && !this.options.center){
			this.pos.max = this.num.oItems-this.options.items;
		}

		if(this.options.loop && this.options.center){
			this.pos.max = this.num.oItems+this.options.items;
		}

		//set max value
		this.pos.maxValue = this.pos.items[this.pos.max];

		//Max for autoWidth content
		if((!this.options.loop && !this.options.center && this.options.autoWidth) || (this.options.merge && !this.options.center) ){
			var revert = this.options.rtl ? 1 : -1;
			for (i = 0; i < this.pos.items.length; i++) {
				if( (this.pos.items[i] * revert) < this.width.stage-this.width.el ){
					this.pos.max = i+1;
				}
			}
			this.pos.maxValue = this.options.rtl ? this.width.stage-this.width.el : -(this.width.stage-this.width.el);
			this.pos.items[this.pos.max] = this.pos.maxValue;
		}

		// Set loop boundries
		if(this.options.center){
			this.pos.loop = this.pos.items[0]-this.pos.items[this.num.oItems];
		} else {
			this.pos.loop = -this.pos.items[this.num.oItems];
		}

		//if is less items
		if(this.num.oItems < this.options.items && !this.options.center){
			this.pos.max = 0;
			this.pos.maxValue = this.pos.items[0];
		}
	};

	/**
	 * setSizes
	 * @desc Set sizes on elements (from collectData function)
	 * @since 2.0.0
	 */

	Owl.prototype.setSizes = function(){

		// show neighbours
		if(this.options.stagePadding !== false){
			this.dom.oStage.style.paddingLeft = 	this.options.stagePadding + 'px';
			this.dom.oStage.style.paddingRight = 	this.options.stagePadding + 'px';
		}

		// CRAZY FIX!!! Doublecheck this!
		//if(this.width.stagePrev > this.width.stage){
		if(this.options.rtl){
			window.setTimeout(function(){
				this.dom.stage.style.width = this.width.stage + 'px';
			}.bind(this),0);
		} else{
			this.dom.stage.style.width = this.width.stage + 'px';
		}

		for(var i=0; i<this.num.items; i++){

			// Set items width
			if(!this.options.autoWidth){
				this.dom.$items[i].style.width = this.width.item - (this.options.margin) + 'px';
			}
			// add margin
			if(this.options.rtl){
				this.dom.$items[i].style.marginLeft = this.options.margin + 'px';
			} else {
				this.dom.$items[i].style.marginRight = this.options.margin + 'px';
			}

			if(this.num.merged[i] !== 1 && !this.options.autoWidth){
				this.dom.$items[i].style.width = (this.width.item * this.num.merged[i]) - (this.options.margin) + 'px';
			}
		}

		// save prev stage size
		this.width.stagePrev = this.width.stage;
	};

	/**
	 * responsive
	 * @desc Responsive function update all data by calling refresh()
	 * @since 2.0.0
	 */

	Owl.prototype.responsive = function(){

		if(!this.num.oItems){return false;}
		// If El width hasnt change then stop responsive
		var elChanged = this.isElWidthChanged();
		if(!elChanged){return false;}

		// if Vimeo Fullscreen mode
		var fullscreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;
		if(fullscreenElement){
			if($(fullscreenElement.parentNode).hasClass('owl-video-frame')){
				this.setSpeed(0);
				this.state.isFullScreen = true;
			}
		}

		if(fullscreenElement && this.state.isFullScreen && this.state.videoPlay){
			return false;
		}

		// Comming back from fullscreen
		if(this.state.isFullScreen){
			this.state.isFullScreen = false;
			return false;
		}

		// check full screen mode and window orientation
		if (this.state.videoPlay) {
			if(this.state.orientation !== window.orientation){
				this.state.orientation = window.orientation;
				return false;
			}
		}

		this.fireCallback('onResponsiveBefore');
		this.state.responsive = true;
		this.refresh();
		this.state.responsive = false;
		this.fireCallback('onResponsiveAfter');
	};

	/**
	 * refresh
	 * @desc Refresh method is basically collection of functions that are responsible for Owl responsive functionality
	 * @since 2.0.0
	 */

	Owl.prototype.refresh = function(init){

		if(this.state.videoPlay){
			this.stopVideo();
		}

		// Update Options for given width
		this.setResponsiveOptions();

		//set lazy structure
		this.createLazyContentStructure(true);

		// update info about local content
		this.updateLocalContent();

		// udpate options
		this.optionsLogic();

		// if no items then stop
		if(this.num.oItems === 0){
			if(this.dom.$page !== null){
				this.dom.$page.hide();
			}
			return false;
		}

		// Hide and Show methods helps here to set a proper widths.
		// This prevents Scrollbar to be calculated in stage width
		this.dom.$stage.addClass('owl-refresh');

		// Remove clones and generate new ones
		this.reClone();

		// calculate
		this.calculate();

		//aaaand show.
		this.dom.$stage.removeClass('owl-refresh');

		// to do
		// lazyContent last position on refresh
		if(this.state.lazyContent){
			this.pos.currentAbs = this.options.items;
		}

		this.initPosition(init);

		// jump to last position
		if(!this.state.lazyContent && !init){
			this.jumpTo(this.pos.current,false); // fix that
		}

		//Check for videos ( YouTube and Vimeo currently supported)
		this.checkVideoLinks();

		this.updateItemState();

		// Update controls
		this.rebuildDots();

		this.updateControls();

		// update drag events
		//this.updateEvents();

		// update autoplay
		this.autoplay();

		this.autoHeight();

		this.state.orientation = window.orientation;

		this.watchVisibility();
	};

	/**
	 * updateItemState
	 * @desc Update information about current state of items (visibile, hidden, active, etc.)
	 * @since 2.0.0
	 */

	Owl.prototype.updateItemState = function(update){

		if(!this.state.lazyContent){
			this.updateActiveItems();
		} else {
			this.updateLazyContent(update);
		}

		if(this.options.center){
			this.dom.$items.eq(this.pos.currentAbs)
			.addClass(this.options.centerClass)
			.data('owl-item').center = true;
		}

		if(this.options.lazyLoad){
			this.lazyLoad();
		}
	};

	/**
	 * updateActiveItems
	 * @since 2.0.0
	 */


	Owl.prototype.updateActiveItems = function(){
		var i,j,item,ipos,iwidth,wpos,stage,outsideView,foundCurrent;
		// clear states
		for(i = 0; i<this.num.items; i++){
			this.dom.$items.eq(i).data('owl-item').active = false;
			this.dom.$items.eq(i).data('owl-item').current = false;
			this.dom.$items.eq(i).removeClass(this.options.activeClass).removeClass(this.options.centerClass);
		}

		this.num.active = 0;
		stageX = this.pos.stage;
		view = this.options.rtl ? this.width.view : -this.width.view;

		for(j = 0; j<this.num.items; j++){

				item = this.dom.$items.eq(j);
				ipos = item.data('owl-item').posLeft;
				iwidth = item.data('owl-item').width;
				outsideView = this.options.rtl ? ipos + iwidth : ipos - iwidth;

			if( (this.op(ipos,'<=',stageX) && (this.op(ipos,'>',stageX + view))) ||
				(this.op(outsideView,'<',stageX) && this.op(outsideView,'>',stageX + view))
				){

				this.num.active++;

				if(this.options.freeDrag && !foundCurrent){
					foundCurrent = true;
					this.pos.current = item.data('owl-item').index;
					this.pos.currentAbs = item.data('owl-item').indexAbs;
				}

				item.data('owl-item').active = true;
				item.data('owl-item').current = true;
				item.addClass(this.options.activeClass);

				if(!this.options.lazyLoad){
					item.data('owl-item').loaded = true;
				}
				if(this.options.loop && (this.options.lazyLoad || this.options.center)){
					this.updateClonedItemsState(item.data('owl-item').index);
				}
			}
		}
	};

	/**
	 * updateClonedItemsState
	 * @desc Set current state on sibilings items for lazyLoad and center
	 * @since 2.0.0
	 */

	Owl.prototype.updateClonedItemsState = function(activeIndex){

		//find cloned center
		var center, $el,i;
		if(this.options.center){
			center = this.dom.$items.eq(this.pos.currentAbs).data('owl-item').index;
		}

		for(i = 0; i<this.num.items; i++){
			$el = this.dom.$items.eq(i);
			if( $el.data('owl-item').index === activeIndex ){
				$el.data('owl-item').current = true;
				if($el.data('owl-item').index === center ){
					$el.addClass(this.options.centerClass);
				}
			}
		}
	};

	/**
	 * updateLazyPosition
	 * @desc Set current state on sibilings items for lazyLoad and center
	 * @since 2.0.0
	 */

	Owl.prototype.updateLazyPosition = function(){
		var jumpTo = this.pos.goToLazyContent || 0;

		this.pos.lcMovedBy = Math.abs(this.options.items - this.pos.currentAbs);

		if(this.options.items < this.pos.currentAbs ){
			this.pos.lcCurrent += this.pos.currentAbs - this.options.items;
			this.state.lcDirection = 'right';
		} else if(this.options.items > this.pos.currentAbs ){
			this.pos.lcCurrent -= this.options.items - this.pos.currentAbs;
			this.state.lcDirection = 'left';
		}

		this.pos.lcCurrent = jumpTo !== 0 ? jumpTo : this.pos.lcCurrent;

		if(this.pos.lcCurrent >= this.dom.$content.length){
			this.pos.lcCurrent = this.pos.lcCurrent-this.dom.$content.length;
		} else if(this.pos.lcCurrent < -this.dom.$content.length+1){
			this.pos.lcCurrent = this.pos.lcCurrent+this.dom.$content.length;
		}

		if(this.options.startPosition>0){
			this.pos.lcCurrent = this.options.startPosition;
			this._options.startPosition = this.options.startPosition = 0;
		}

		this.pos.lcCurrentAbs = this.pos.lcCurrent < 0 ? this.pos.lcCurrent+this.dom.$content.length : this.pos.lcCurrent;

	};

	/**
	 * updateLazyContent
	 * @param [update] - boolean - update call by content manipulations
	 * @since 2.0.0
	 */

	Owl.prototype.updateLazyContent = function(update){

		if(this.pos.lcCurrent === undefined){
			this.pos.lcCurrent = 0;
			this.pos.current = this.pos.currentAbs = this.options.items;
		}

		if(!update){
			this.updateLazyPosition();
		}
		var i,j,item,contentPos,content,freshItem,freshData;

		if(this.state.lcDirection !== false){
			for(i = 0; i<this.pos.lcMovedBy; i++){

				if(this.state.lcDirection === 'right'){
					item = this.dom.$stage.find('.owl-item').eq(0); //.appendTo(this.dom.$stage);
					item.appendTo(this.dom.$stage);
				}
				if(this.state.lcDirection === 'left'){
					item = this.dom.$stage.find('.owl-item').eq(-1);
					item.prependTo(this.dom.$stage);
				}
				item.data('owl-item').active = false;
			}
		}

		// recollect
		this.dom.$items = this.dom.$stage.find('.owl-item');

		for(j = 0; j<this.num.items; j++){
			// to do
			this.dom.$items.eq(j).removeClass(this.options.centerClass);

			// get Content
			contentPos = this.pos.lcCurrent + j - this.options.items;// + this.options.startPosition;

			if(contentPos >= this.dom.$content.length){
				contentPos = contentPos - this.dom.$content.length;
			}
			if(contentPos < -this.dom.$content.length){
				contentPos = contentPos + this.dom.$content.length;
			}

			content = this.dom.$content.eq(contentPos);
			freshItem = this.dom.$items.eq(j);
			freshData = freshItem.data('owl-item');

			if(freshData.active === false || this.pos.goToLazyContent !== 0 || update === true){

				freshItem.empty();
				freshItem.append(content.clone(true,true));
				freshData.active = true;
				freshData.current = true;
				if(!this.options.lazyLoad){
					freshData.loaded = true;
				} else {
					freshData.loaded = false;
				}
			}
		}

		this.pos.goToLazyContent = 0;
		this.pos.current = this.pos.currentAbs = this.options.items;
		this.setSpeed(0);
		this.animStage(this.pos.items[this.options.items]);
	};

	/**
	 * eventsCall
	 * @desc Save internal event references and add event based functions like transitionEnd,responsive etc.
	 * @since 2.0.0
	 */

	Owl.prototype.eventsCall = function(){
		// Save events references
		this.e._onDragStart =	function(e){this.onDragStart(e);		}.bind(this);
		this.e._onDragMove =	function(e){this.onDragMove(e);			}.bind(this);
		this.e._onDragEnd =		function(e){this.onDragEnd(e);			}.bind(this);
		this.e._transitionEnd =	function(e){this.transitionEnd(e);		}.bind(this);
		this.e._resizer =		function(){this.responsiveTimer();		}.bind(this);
		this.e._responsiveCall =function(){this.responsive();			}.bind(this);
		this.e._preventClick =	function(e){this.preventClick(e);		}.bind(this);
		this.e._goToHash =		function(){this.goToHash();				}.bind(this);
		this.e._goToPage =		function(e){this.goToPage(e);			}.bind(this);
		this.e._ap = 			function(){this.autoplay();				}.bind(this);
		this.e._play = 			function(){this.play();					}.bind(this);
		this.e._pause = 		function(){this.pause();				}.bind(this);
		this.e._playVideo = 	function(e){this.playVideo(e);			}.bind(this);

		this.e._navNext = function(e){
			if($(e.target).hasClass('disabled')){return false;}
			e.preventDefault();
			this.next();
		}.bind(this);

		this.e._navPrev = function(e){
			if($(e.target).hasClass('disabled')){return false;}
			e.preventDefault();
			this.prev();
		}.bind(this);

	};

	/**
	 * responsiveTimer
	 * @desc Check Window resize event with 200ms delay / this.options.responsiveRefreshRate
	 * @since 2.0.0
	 */

	Owl.prototype.responsiveTimer = function(){
		if(this.windowWidth() === this.width.prevWindow){
			return false;
		}
		window.clearInterval(this.e._autoplay);
		window.clearTimeout(this.resizeTimer);
		this.resizeTimer = window.setTimeout(this.e._responsiveCall, this.options.responsiveRefreshRate);
		this.width.prevWindow = this.windowWidth();
	};

	/**
	 * internalEvents
	 * @desc Checks for touch/mouse drag options and add necessery event handlers.
	 * @since 2.0.0
	 */

	Owl.prototype.internalEvents = function(){
		var isTouch = isTouchSupport();
		var isTouchIE = isTouchSupportIE();

		if(isTouch && !isTouchIE){
			this.dragType = ['touchstart','touchmove','touchend','touchcancel'];
		} else if(isTouch && isTouchIE){
			this.dragType = ['MSPointerDown','MSPointerMove','MSPointerUp','MSPointerCancel'];
		} else {
			this.dragType = ['mousedown','mousemove','mouseup'];
		}

		if( (isTouch || isTouchIE) && this.options.touchDrag){
			//touch cancel event
			this.on(document, this.dragType[3], this.e._onDragEnd);

		} else {
			// firefox startdrag fix - addeventlistener doesnt work here :/
			this.dom.$stage.on('dragstart', function() {return false;});

			if(this.options.mouseDrag){
				//disable text select
				this.dom.stage.onselectstart = function(){return false;};
			} else {
				// enable text select
				this.dom.$el.addClass('owl-text-select-on');
			}
		}

		// Video Play Button event delegation
		this.dom.$stage.on(this.dragType[2], '.owl-video-play-icon', this.e._playVideo);

		if(this.options.URLhashListener){
			this.on(window, 'hashchange', this.e._goToHash, false);
		}

		if(this.options.autoplayHoverPause){
			var that = this;
			this.dom.$stage.on('mouseover', this.e._pause );
			this.dom.$stage.on('mouseleave', this.e._ap );
		}

		// Catch transitionEnd event
		if(this.transitionEndVendor){
			this.on(this.dom.stage, this.transitionEndVendor, this.e._transitionEnd, false);
		}

		// Responsive
		if(this.options.responsive !== false){
			this.on(window, 'resize', this.e._resizer, false);
		}

		this.updateEvents();
	};

	/**
	 * updateEvents
	 * @since 2.0.0
	 */

	Owl.prototype.updateEvents = function(){

		if(this.options.touchDrag && (this.dragType[0] === 'touchstart' || this.dragType[0] === 'MSPointerDown')){
			this.on(this.dom.stage, this.dragType[0], this.e._onDragStart,false);
		} else if(this.options.mouseDrag && this.dragType[0] === 'mousedown'){
			this.on(this.dom.stage, this.dragType[0], this.e._onDragStart,false);

		} else {
			this.off(this.dom.stage, this.dragType[0], this.e._onDragStart);
		}
	};

	/**
	 * onDragStart
	 * @desc touchstart/mousedown event
	 * @since 2.0.0
	 */

	Owl.prototype.onDragStart = function(event){
		var ev = event.originalEvent || event || window.event;
		// prevent right click
		if (ev.which === 3) {
			return false;
		}

		if(this.dragType[0] === 'mousedown'){
			this.dom.$stage.addClass('owl-grab');
		}

		this.fireCallback('onTouchStart');
		this.drag.startTime = new Date().getTime();
		this.setSpeed(0);
		this.state.isTouch = true;
		this.state.isScrolling = false;
		this.state.isSwiping = false;
		this.drag.distance = 0;

		// if is 'touchstart'
		var isTouchEvent = ev.type === 'touchstart';
		var pageX = isTouchEvent ? event.targetTouches[0].pageX : (ev.pageX || ev.clientX);
		var pageY = isTouchEvent ? event.targetTouches[0].pageY : (ev.pageY || ev.clientY);

		//get stage position left
		this.drag.offsetX = this.dom.$stage.position().left - this.options.stagePadding;
		this.drag.offsetY = this.dom.$stage.position().top;

		if(this.options.rtl){
			this.drag.offsetX = this.dom.$stage.position().left + this.width.stage - this.width.el + this.options.margin;
		}

		//catch position // ie to fix
		if(this.state.inMotion && this.support3d){
			var animatedPos = this.getTransformProperty();
			this.drag.offsetX = animatedPos;
			this.animStage(animatedPos);
		} else if(this.state.inMotion && !this.support3d ){
			this.state.inMotion = false;
			return false;
		}

		this.drag.startX = pageX - this.drag.offsetX;
		this.drag.startY = pageY - this.drag.offsetY;

		this.drag.start = pageX - this.drag.startX;
		this.drag.targetEl = ev.target || ev.srcElement;
		this.drag.updatedX = this.drag.start;

		// to do/check
		//prevent links and images dragging;
		//this.drag.targetEl.draggable = false;

		this.on(document, this.dragType[1], this.e._onDragMove, false);
		this.on(document, this.dragType[2], this.e._onDragEnd, false);
	};

	/**
	 * onDragMove
	 * @desc touchmove/mousemove event
	 * @since 2.0.0
	 */

	Owl.prototype.onDragMove = function(event){
		if (!this.state.isTouch){
			return;
		}

		if (this.state.isScrolling){
			return;
		}

		var neighbourItemWidth=0;
		var ev = event.originalEvent || event || window.event;

		// if is 'touchstart'
		var isTouchEvent = ev.type == 'touchmove';
		var pageX = isTouchEvent ? ev.targetTouches[0].pageX : (ev.pageX || ev.clientX);
		var pageY = isTouchEvent ? ev.targetTouches[0].pageY : (ev.pageY || ev.clientY);

		// Drag Direction
		this.drag.currentX = pageX - this.drag.startX;
		this.drag.currentY = pageY - this.drag.startY;
		this.drag.distance = this.drag.currentX - this.drag.offsetX;

		// Check move direction
		if (this.drag.distance < 0) {
			this.state.direction = this.options.rtl ? 'right' : 'left';
		} else if(this.drag.distance > 0){
			this.state.direction = this.options.rtl ? 'left' : 'right';
		}
		// Loop
		if(this.options.loop){
			if(this.op(this.drag.currentX, '>', this.pos.minValue) && this.state.direction === 'right' ){
				this.drag.currentX -= this.pos.loop;
			}else if(this.op(this.drag.currentX, '<', this.pos.maxValue) && this.state.direction === 'left' ){
				this.drag.currentX += this.pos.loop;
			}
		} else {
			// pull
			var minValue = this.options.rtl ? this.pos.maxValue : this.pos.minValue;
			var maxValue = this.options.rtl ? this.pos.minValue : this.pos.maxValue;
			var pull = this.options.pullDrag ? this.drag.distance / 5 : 0;
			this.drag.currentX = Math.max(Math.min(this.drag.currentX, minValue + pull), maxValue + pull);
		}



		// Lock browser if swiping horizontal

		if ((this.drag.distance > 8 || this.drag.distance < -8)) {
			if (ev.preventDefault !== undefined) {
				ev.preventDefault();
			} else {
				ev.returnValue = false;
			}
			this.state.isSwiping = true;
		}

		this.drag.updatedX = this.drag.currentX;

		// Lock Owl if scrolling
		if ((this.drag.currentY > 16 || this.drag.currentY < -16) && this.state.isSwiping === false) {
			 this.state.isScrolling = true;
			 this.drag.updatedX = this.drag.start;
		}

		this.animStage(this.drag.updatedX);
	};

	/**
	 * onDragEnd
	 * @desc touchend/mouseup event
	 * @since 2.0.0
	 */

	Owl.prototype.onDragEnd = function(event){
		if (!this.state.isTouch){
			return;
		}
		if(this.dragType[0] === 'mousedown'){
			this.dom.$stage.removeClass('owl-grab');
		}

		this.fireCallback('onTouchEnd');

		//prevent links and images dragging;
		//this.drag.targetEl.draggable = true;

		//remove drag event listeners

		this.state.isTouch = false;
		this.state.isScrolling = false;
		this.state.isSwiping = false;

		//to check
		if(this.drag.distance === 0 && this.state.inMotion !== true){
			this.state.inMotion = false;
			return false;
		}

		// prevent clicks while scrolling

		this.drag.endTime = new Date().getTime();
		var compareTimes = this.drag.endTime - this.drag.startTime;
		var distanceAbs = Math.abs(this.drag.distance);

		//to test
		if(distanceAbs > 3 || compareTimes > 300){
			this.removeClick(this.drag.targetEl);
		}

		var closest = this.closest(this.drag.updatedX);

		this.setSpeed(this.options.dragEndSpeed, false, true);
		this.animStage(this.pos.items[closest]);

		//if pullDrag is off then fire transitionEnd event manually when stick to border
		if(!this.options.pullDrag && this.drag.updatedX === this.pos.items[closest]){
			this.transitionEnd();
		}

		this.drag.distance = 0;

		this.off(document, this.dragType[1], this.e._onDragMove);
		this.off(document, this.dragType[2], this.e._onDragEnd);
	};

	/**
	 * removeClick
	 * @desc Attach preventClick function to disable link while swipping
	 * @since 2.0.0
	 * @param [target] - clicked dom element
	 */

	Owl.prototype.removeClick = function(target){
		this.drag.targetEl = target;
		this.on(target,'click', this.e._preventClick, false);
	};

	/**
	 * preventClick
	 * @desc Add preventDefault for any link and then remove removeClick event hanlder
	 * @since 2.0.0
	 */

	Owl.prototype.preventClick = function(ev){
		if(ev.preventDefault) {
			ev.preventDefault();
		}else {
			ev.returnValue = false;
		}
		if(ev.stopPropagation){
			ev.stopPropagation();
		}
		this.off(this.drag.targetEl,'click',this.e._preventClick,false);
	};

	/**
	 * getTransformProperty
	 * @desc catch stage position while animate (only css3)
	 * @since 2.0.0
	 */

	Owl.prototype.getTransformProperty = function(){
		var transform = window.getComputedStyle(this.dom.stage, null).getPropertyValue(this.vendorName + 'transform');
		//var transform = this.dom.$stage.css(this.vendorName + 'transform')
		transform = transform.replace(/matrix(3d)?\(|\)/g, '').split(',');
		var matrix3d = transform.length === 16;

		return matrix3d !== true ? transform[4] : transform[12];
	};

	/**
	 * closest
	 * @desc Get closest item after touchend/mouseup
	 * @since 2.0.0
	 * @param [x] - curent position in pixels
	 * return position in pixels
	 */

	Owl.prototype.closest = function(x){
		var newX = 0,
			pull = 30;

		if(!this.options.freeDrag){
			// Check closest item
			for(var i = 0; i< this.num.items; i++){
				if(x > this.pos.items[i]-pull && x < this.pos.items[i]+pull){
					newX = i;
				}else if(this.op(x,'<',this.pos.items[i]) && this.op(x,'>',this.pos.items[i+1 || this.pos.items[i] - this.width.el]) ){
					newX = this.state.direction === 'left' ? i+1 : i;
				}
			}
		}
		//non loop boundries
		if(!this.options.loop){
			if(this.op(x,'>',this.pos.minValue)){
				newX = x = this.pos.min;
			} else if(this.op(x,'<',this.pos.maxValue)){
				newX = x = this.pos.max;
			}
		}

		if(!this.options.freeDrag){
			// set positions
			this.pos.currentAbs = newX;
			this.pos.current = this.dom.$items.eq(newX).data('owl-item').index;
		} else {
			this.updateItemState();
			return x;
		}

		return newX;
	};

	/**
	 * animStage
	 * @desc animate stage position (both css3/css2) and perform onChange functions/events
	 * @since 2.0.0
	 * @param [x] - curent position in pixels
	 */

	Owl.prototype.animStage = function(pos){

		// if speed is 0 the set inMotion to false
		if(this.speed.current !== 0 && this.pos.currentAbs !== this.pos.min){
			this.fireCallback('onTransitionStart');
			this.state.inMotion = true;
		}

		var posX = this.pos.stage = pos,
			style = this.dom.stage.style;

		if(this.support3d){
			translate = 'translate3d(' + posX + 'px'+',0px, 0px)';
			style[this.transformVendor] = translate;
		} else if(this.state.isTouch){
			style.left = posX+'px';
		} else {
			this.dom.$stage.animate({left: posX},this.speed.css2speed, this.options.fallbackEasing, function(){
				if(this.state.inMotion){
					this.transitionEnd();
				}
			}.bind(this));
		}

		this.onChange();
	};

	/**
	 * updatePosition
	 * @desc Update current positions
	 * @since 2.0.0
	 * @param [pos] - number - new position
	 */

	Owl.prototype.updatePosition = function(pos){

		// if no items then stop
		if(this.num.oItems === 0){return false;}
		// to do
		//if(pos > this.num.items){pos = 0;}
		if(pos === undefined){return false;}

		//pos - new current position
		var nextPos = pos;
		this.pos.prev = this.pos.currentAbs;

		if(this.state.revert){
			this.pos.current = this.dom.$items.eq(nextPos).data('owl-item').index;
			this.pos.currentAbs = nextPos;
			return;
		}

		if(!this.options.loop){
			if(this.options.navRewind){
				nextPos = nextPos > this.pos.max ? this.pos.min : (nextPos < 0 ? this.pos.max : nextPos);
			} else {
				nextPos = nextPos > this.pos.max ? this.pos.max : (nextPos <= 0 ? 0 : nextPos);
			}
		} else {
			nextPos = nextPos >= this.num.oItems ? this.num.oItems-1 : nextPos;
		}

		this.pos.current = this.dom.$oItems.eq(nextPos).data('owl-item').index;
		this.pos.currentAbs = this.dom.$oItems.eq(nextPos).data('owl-item').indexAbs;

	};

	/**
	 * setSpeed
	 * @since 2.0.0
	 * @param [speed] - number
	 * @param [pos] - number - next position - use this param to calculate smartSpeed
	 * @param [drag] - boolean - if drag is true then smart speed is disabled
	 * return speed
	 */

	Owl.prototype.setSpeed = function(speed,pos,drag) {
		var s = speed,
			nextPos = pos;

		if((s === false && s !== 0 && drag !== true) || s === undefined){

			//Double check this
			// var nextPx = this.pos.items[nextPos];
			// var currPx = this.pos.stage
			// var diff = Math.abs(nextPx-currPx);
			// var s = diff/1
			// if(s>1000){
			// 	s = 1000;
			// }

			var diff = Math.abs(nextPos - this.pos.prev);
			diff = diff === 0 ? 1 : diff;
			if(diff>6){diff = 6;}
			s = diff * this.options.smartSpeed;
		}

		if(s === false && drag === true){
			s = this.options.smartSpeed;
		}

		if(s === 0){s=0;}

		if(this.support3d){
			var style = this.dom.stage.style;
			style.webkitTransitionDuration = style.MsTransitionDuration = style.msTransitionDuration = style.MozTransitionDuration = style.OTransitionDuration = style.transitionDuration = (s / 1000) + 's';
		} else{
			this.speed.css2speed = s;
		}
		this.speed.current = s;
		return s;
	};

	/**
	 * jumpTo
	 * @since 2.0.0
	 * @param [pos] - number - next position - use this param to calculate smartSpeed
	 * @param [update] - boolean - if drag is true then smart speed is disabled
	 */

	Owl.prototype.jumpTo = function(pos,update){
		if(this.state.lazyContent){
			this.pos.goToLazyContent = pos;
		}
		this.updatePosition(pos);
		this.setSpeed(0);
		this.animStage(this.pos.items[this.pos.currentAbs]);
		if(update !== true){
			this.updateItemState();
		}
	};

	/**
	 * goTo
	 * @since 2.0.0
	 * @param [pos] - number
	 * @param [speed] - speed in ms
	 * @param [speed] - speed in ms
	 */

	Owl.prototype.goTo = function(pos,speed){
		if(this.state.lazyContent && this.state.inMotion){
			return false;
		}

		this.updatePosition(pos);

		if(this.state.animate){speed = 0;}
		this.setSpeed(speed,this.pos.currentAbs);

		if(this.state.animate){this.animate();}
		this.animStage(this.pos.items[this.pos.currentAbs]);

	};

	/**
	 * next
	 * @since 2.0.0
	 */

	Owl.prototype.next = function(optionalSpeed){
		var s = optionalSpeed || this.options.navSpeed;
		if(this.options.loop && !this.state.lazyContent){
			this.goToLoop(this.options.slideBy, s);
		}else{
			this.goTo(this.pos.current + this.options.slideBy, s);
		}
	};

	/**
	 * prev
	 * @since 2.0.0
	 */

	Owl.prototype.prev = function(optionalSpeed){
		var s = optionalSpeed || this.options.navSpeed;
		if(this.options.loop && !this.state.lazyContent){
			this.goToLoop(-this.options.slideBy, s);
		}else{
			this.goTo(this.pos.current-this.options.slideBy, s);
		}
	};

	/**
	 * goToLoop
	 * @desc Go to given position if loop is enabled - used only internal
	 * @since 2.0.0
	 * @param [distance] - number -how far to go
	 * @param [speed] - number - speed in ms
	 */

	Owl.prototype.goToLoop = function(distance,speed){

		var revert = this.pos.currentAbs,
			prevPosition = this.pos.currentAbs,
			newPosition = this.pos.currentAbs + distance,
			direction = prevPosition - newPosition < 0 ? true : false;

		this.state.revert = true;

		if(newPosition < 1 && direction === false){

			this.state.bypass = true;
			revert = this.num.items - (this.options.items-prevPosition) - this.options.items;
			this.jumpTo(revert,true);

		} else if(newPosition >= this.num.items - this.options.items && direction === true ){

			this.state.bypass = true;
			revert = prevPosition - this.num.oItems;
			this.jumpTo(revert,true);

		}
		window.clearTimeout(this.e._goToLoop);
		this.e._goToLoop = window.setTimeout(function(){
			this.state.bypass = false;
			this.goTo(revert + distance, speed);
			this.state.revert = false;

		}.bind(this), 30);
	};

	/**
	 * initPosition
	 * @since 2.0.0
	 */

	Owl.prototype.initPosition = function(init){

		if( !this.dom.$oItems || !init || this.state.lazyContent ){return false;}
		var pos = this.options.startPosition;

		if(this.options.startPosition === 'URLHash'){
			pos = this.options.startPosition = this.hashPosition();
		} else if(typeof this.options.startPosition !== Number && !this.options.center){
			this.options.startPosition = 0;
		}
		this.dom.oStage.scrollLeft = 0;
		this.jumpTo(pos,true);
	};

	/**
	 * goToHash
	 * @since 2.0.0
	 */

	Owl.prototype.goToHash = function(){
		var pos = this.hashPosition();
		if(pos === false){
			pos = 0;
		}
		this.dom.oStage.scrollLeft = 0;
		this.goTo(pos,this.options.navSpeed);
	};

	/**
	 * hashPosition
	 * @desc Find hash in URL then look into items to find contained ID
	 * @since 2.0.0
	 * return hashPos - number of item
	 */

	Owl.prototype.hashPosition = function(){
		var hash = window.location.hash.substring(1),
			hashPos;
		if(hash === ""){return false;}

		for(var i=0;i<this.num.oItems; i++){
			if(hash === this.dom.$oItems.eq(i).data('owl-item').hash){
				hashPos = i;
			}
		}
		return hashPos;
	};

	/**
	 * Autoplay
	 * @since 2.0.0
	 */

	Owl.prototype.autoplay = function(){
		if(this.options.autoplay && !this.state.videoPlay){
			window.clearInterval(this.e._autoplay);
			this.e._autoplay = window.setInterval(this.e._play, this.options.autoplayTimeout);
		} else {
			window.clearInterval(this.e._autoplay);
			this.state.autoplay=false;
		}
	};

	/**
	 * play
	 * @param [timeout] - Integrer
	 * @param [speed] - Integrer
	 * @since 2.0.0
	 */

	Owl.prototype.play = function(timeout, speed){

		// if tab is inactive - doesnt work in <IE10
		if(document.hidden === true){return false;}

		// overwrite default options (custom options are always priority)
		if(!this.options.autoplay){
			this._options.autoplay = this.options.autoplay = true;
			this._options.autoplayTimeout = this.options.autoplayTimeout = timeout || this.options.autoplayTimeout || 4000;
			this._options.autoplaySpeed = speed || this.options.autoplaySpeed;
		}

		if(this.options.autoplay === false || this.state.isTouch || this.state.isScrolling || this.state.isSwiping || this.state.inMotion){
			window.clearInterval(this.e._autoplay);
			return false;
		}

		if(!this.options.loop && this.pos.current >= this.pos.max){
			window.clearInterval(this.e._autoplay);
			this.goTo(0);
		} else {
			this.next(this.options.autoplaySpeed);
		}
		this.state.autoplay=true;
	};

	/**
	 * stop
	 * @since 2.0.0
	 */

	Owl.prototype.stop = function(){
		this._options.autoplay = this.options.autoplay = false;
		this.state.autoplay = false;
		window.clearInterval(this.e._autoplay);
	};

	Owl.prototype.pause = function(){
		window.clearInterval(this.e._autoplay);
	};

	/**
	 * transitionEnd
	 * @desc event used by css3 animation end and $.animate callback like transitionEnd,responsive etc.
	 * @since 2.0.0
	 */

	Owl.prototype.transitionEnd = function(event){

		// if css2 animation then event object is undefined
		if(event !== undefined){
			event.stopPropagation();

			// Catch only owl-stage transitionEnd event
			var eventTarget = event.target || event.srcElement || event.originalTarget;
			if(eventTarget !== this.dom.stage){
				return false;
			}
		}

		this.state.inMotion = false;
		this.updateItemState();
		this.autoplay();
		this.fireCallback('onTransitionEnd');
	};

	/**
	 * isElWidthChanged
	 * @desc Check if element width has changed
	 * @since 2.0.0
	 */

	Owl.prototype.isElWidthChanged = function(){
		var newElWidth = 	this.dom.$el.width() - this.options.stagePadding,//to check
			prevElWidth = 	this.width.el + this.options.margin;
		return newElWidth !== prevElWidth;
	};

	/**
	 * windowWidth
	 * @desc Get Window/responsiveBaseElement width
	 * @since 2.0.0
	 */

	Owl.prototype.windowWidth = function() {
		if(this.options.responsiveBaseElement !== window){
			this.width.window =  $(this.options.responsiveBaseElement).width();
		} else if (window.innerWidth){
			this.width.window = window.innerWidth;
		} else if (document.documentElement && document.documentElement.clientWidth){
			this.width.window = document.documentElement.clientWidth;
		}
		return this.width.window;
	};

	/**
	 * Controls
	 * @desc Calls controls container, navigation and dots creator
	 * @since 2.0.0
	 */

	Owl.prototype.controls = function(){
		var cc = document.createElement('div');
		cc.className = this.options.controlsClass;
		this.dom.$el.append(cc);
		this.dom.$cc = $(cc);
	};

	/**
	 * updateControls
	 * @since 2.0.0
	 */

	Owl.prototype.updateControls = function(){

		if(this.dom.$cc === null && (this.options.nav || this.options.dots)){
			this.controls();
		}

		if(this.dom.$nav === null && this.options.nav){
			this.createNavigation(this.dom.$cc[0]);
		}

		if(this.dom.$page === null && this.options.dots){
			this.createDots(this.dom.$cc[0]);
		}

		if(this.dom.$nav !== null){
			if(this.options.nav){
				this.dom.$nav.show();
				this.updateNavigation();
			} else {
				this.dom.$nav.hide();
			}
		}

		if(this.dom.$page !== null){
			if(this.options.dots){
				this.dom.$page.show();
				this.updateDots();
			} else {
				this.dom.$page.hide();
			}
		}
	};

	/**
	 * createNavigation
	 * @since 2.0.0
	 * @param [cc] - dom element - Controls Container
	 */

	Owl.prototype.createNavigation = function(cc){

		// Create nav container
		var nav = document.createElement('div');
		nav.className = this.options.navContainerClass;
		cc.appendChild(nav);

		// Create left and right buttons
		var navPrev = document.createElement('div'),
			navNext = document.createElement('div');

		navPrev.className = this.options.navClass[0];
		navNext.className = this.options.navClass[1];

		nav.appendChild(navPrev);
		nav.appendChild(navNext);

		this.dom.$nav = $(nav);
		this.dom.$navPrev = $(navPrev).html(this.options.navText[0]);
		this.dom.$navNext = $(navNext).html(this.options.navText[1]);

		// add events to do
		//this.on(navPrev, this.dragType[2], this.e._navPrev, false);
		//this.on(navNext, this.dragType[2], this.e._navNext, false);

		//FF fix?
		this.dom.$nav.on(this.dragType[2], '.'+this.options.navClass[0], this.e._navPrev);
		this.dom.$nav.on(this.dragType[2], '.'+this.options.navClass[1], this.e._navNext);
	};

	/**
	 * createNavigation
	 * @since 2.0.0
	 * @param [cc] - dom element - Controls Container
	 */

	Owl.prototype.createDots = function(cc){

		// Create dots container
		var page = document.createElement('div');
		page.className = this.options.dotsClass;
		cc.appendChild(page);

		// save reference
		this.dom.$page = $(page);

		// add events
		//this.on(page, this.dragType[2], this.e._goToPage, false);

		// FF fix? To test!
		var that = this;
		this.dom.$page.on(this.dragType[2], '.'+this.options.dotClass, goToPage);

		function goToPage(e){
			e.preventDefault();
			var page = $(this).data('page');
			that.goTo(page,that.options.dotsSpeed);
		}
		// build dots
		this.rebuildDots();
	};

	/**
	 * goToPage
	 * @desc Event used by dots
	 * @since 2.0.0
	 */

	// Owl.prototype.goToPage = function(e){
	// 	console.log(e.taget);
	// 	var page = $(e.currentTarget).data('page')
	// 	this.goTo(page,this.options.dotsSpeed);
	// 	return false;
	// };

	/**
	 * rebuildDots
	 * @since 2.0.0
	 */

	Owl.prototype.rebuildDots = function(){
		if(this.dom.$page === null){return false;}
		var each, dot, span, counter = 0, last = 0, i, page=0, roundPages = 0;

		each = this.options.dotsEach || this.options.items;

		// display full dots if center
		if(this.options.center || this.options.dotData){
			each = 1;
		}

		// clear dots
		this.dom.$page.html('');

		for(i = 0; i < this.num.nav.length; i++){

			if(counter >= each || counter === 0){

				dot = document.createElement('div');
				dot.className = this.options.dotClass;
				span = document.createElement('span');
				dot.appendChild(span);
				var $dot = $(dot);

				if(this.options.dotData){
					$dot.html(this.dom.$oItems.eq(i).data('owl-item').dot);
				}

				$dot.data('page',page);
				$dot.data('goToPage',roundPages);

				this.dom.$page.append(dot);

				counter = 0;
				roundPages++;
			}

			this.dom.$oItems.eq(i).data('owl-item').page = roundPages-1;

			//add merged items
			counter += this.num.nav[i];
			page++;
		}
		// find rest of dots
		if(!this.options.loop && !this.options.center){
			for(var j = this.num.nav.length-1; j >= 0; j--){
				last += this.num.nav[j];
				this.dom.$oItems.eq(j).data('owl-item').page = roundPages-1;
				if(last >= each){
					break;
				}
			}
		}

		this.num.allPages = roundPages-1;
	};

	/**
	 * updateDots
	 * @since 2.0.0
	 */

	Owl.prototype.updateDots = function(){
		var dots = this.dom.$page.children();
		var itemIndex = this.dom.$oItems.eq(this.pos.current).data('owl-item').page;

		for(var i = 0; i < dots.length; i++){
			var dotPage = dots.eq(i).data('goToPage');

			if(dotPage===itemIndex){
				this.pos.currentPage = i;
				dots.eq(i).addClass('active');
			}else{
				dots.eq(i).removeClass('active');
			}
		}
	};

	/**
	 * updateNavigation
	 * @since 2.0.0
	 */

	Owl.prototype.updateNavigation = function(){

		var isNav = this.options.nav;

		this.dom.$navNext.toggleClass('disabled',!isNav);
		this.dom.$navPrev.toggleClass('disabled',!isNav);

		if(!this.options.loop && isNav && !this.options.navRewind){

			if(this.pos.current <= 0){
				this.dom.$navPrev.addClass('disabled');
			}
			if(this.pos.current >= this.pos.max){
				this.dom.$navNext.addClass('disabled');
			}
		}
	};

	Owl.prototype.insertContent = function(content){
		this.dom.$stage.empty();
		this.fetchContent(content);
		this.refresh();
	};

	/**
	 * addItem - Add an item
	 * @since 2.0.0
	 * @param [content] - dom element / string '<div>content</div>'
	 * @param [pos] - number - position
	 */

	Owl.prototype.addItem = function(content,pos){
		pos = pos || 0;

		if(this.state.lazyContent){
			this.dom.$content = this.dom.$content.add($(content));
			this.updateItemState(true);
		} else {
			// wrap content
			var item = this.fillItem(content);
			// if carousel is empty then append item
			if(this.dom.$oItems.length === 0){
				this.dom.$stage.append(item);
			} else {
				// append item
				var it = this.dom.$oItems.eq(pos);
				if(pos !== -1){it.before(item);} else {it.after(item);}
			}
			// update and calculate carousel
			this.refresh();
		}

	};

	/**
	 * removeItem - Remove an Item
	 * @since 2.0.0
	 * @param [pos] - number - position
	 */

	Owl.prototype.removeItem = function(pos){
		if(this.state.lazyContent){
			this.dom.$content.splice(pos,1);
			this.updateItemState(true);
		} else {
			this.dom.$oItems.eq(pos).remove();
			this.refresh();
		}
	};

	/**
	 * addCustomEvents
	 * @desc Add custom events by jQuery .on method
	 * @since 2.0.0
	 */

	Owl.prototype.addCustomEvents = function(){

		this.e.next = function(e,s){this.next(s);			}.bind(this);
		this.e.prev = function(e,s){this.prev(s);			}.bind(this);
		this.e.goTo = function(e,p,s){this.goTo(p,s);		}.bind(this);
		this.e.jumpTo = function(e,p){this.jumpTo(p);		}.bind(this);
		this.e.addItem = function(e,c,p){this.addItem(c,p);	}.bind(this);
		this.e.removeItem = function(e,p){this.removeItem(p);}.bind(this);
		this.e.refresh = function(e){this.refresh();		}.bind(this);
		this.e.destroy = function(e){this.destroy();		}.bind(this);
		this.e.autoHeight = function(e){this.autoHeight(true);}.bind(this);
		this.e.stop = function(){this.stop();				}.bind(this);
		this.e.play = function(e,t,s){this.play(t,s);		}.bind(this);
		this.e.insertContent = function(e,d){this.insertContent(d);	}.bind(this);

		this.dom.$el.on('next.owl',this.e.next);
		this.dom.$el.on('prev.owl',this.e.prev);
		this.dom.$el.on('goTo.owl',this.e.goTo);
		this.dom.$el.on('jumpTo.owl',this.e.jumpTo);
		this.dom.$el.on('addItem.owl',this.e.addItem);
		this.dom.$el.on('removeItem.owl',this.e.removeItem);
		this.dom.$el.on('destroy.owl',this.e.destroy);
		this.dom.$el.on('refresh.owl',this.e.refresh);
		this.dom.$el.on('autoHeight.owl',this.e.autoHeight);
		this.dom.$el.on('play.owl',this.e.play);
		this.dom.$el.on('stop.owl',this.e.stop);
		this.dom.$el.on('stopVideo.owl',this.e.stop);
		this.dom.$el.on('insertContent.owl',this.e.insertContent);

	};

	/**
	 * on
	 * @desc On method for adding internal events
	 * @since 2.0.0
	 */

	Owl.prototype.on = function (element, event, listener, capture) {

		if (element.addEventListener) {
			element.addEventListener(event, listener, capture);
		}
		else if (element.attachEvent) {
			element.attachEvent('on' + event, listener);
		}
	};

	/**
	 * off
	 * @desc Off method for removing internal events
	 * @since 2.0.0
	 */

	Owl.prototype.off = function (element, event, listener, capture) {
		if (element.removeEventListener) {
			element.removeEventListener(event, listener, capture);
		}
		else if (element.detachEvent) {
			element.detachEvent('on' + event, listener);
		}
	};

	/**
	 * fireCallback
	 * @since 2.0.0
	 * @param event - string - event name
	 * @param data - object - additional options - to do
	 */

	Owl.prototype.fireCallback = function(event, data){
		if(!this.options.callbacks){return;}

		if(this.dom.el.dispatchEvent){

			// dispatch event
			var evt = document.createEvent('CustomEvent');

			//evt.initEvent(event, false, true );
			evt.initCustomEvent(event, true, true, data);
			return this.dom.el.dispatchEvent(evt);

		} else if (!this.dom.el.dispatchEvent){

			//	There is no clean solution for custom events name in <=IE8
			//	But if you know better way, please let me know :)
			return this.dom.$el.trigger(event);
		}
	};

	/**
	 * watchVisibility
	 * @desc check if el is visible - handy if Owl is inside hidden content (tabs etc.)
	 * @since 2.0.0
	 */

	Owl.prototype.watchVisibility = function(){

		// test on zepto
		if(!isElVisible(this.dom.el)) {
			this.dom.$el.addClass('owl-hidden');
			window.clearInterval(this.e._checkVisibile);
			this.e._checkVisibile = window.setInterval(checkVisible.bind(this),500);
		}

		function isElVisible(el) {
		    return el.offsetWidth > 0 && el.offsetHeight > 0;
		}

		function checkVisible(){
			if (isElVisible(this.dom.el)) {
				this.dom.$el.removeClass('owl-hidden');
				this.refresh();
				window.clearInterval(this.e._checkVisibile);
			}
		}
	};

	/**
	 * onChange
	 * @since 2.0.0
	 */

	Owl.prototype.onChange = function(){

		if(!this.state.isTouch && !this.state.bypass && !this.state.responsive ){

			if (this.options.nav || this.options.dots) {
				this.updateControls();
			}
			this.autoHeight();

			this.fireCallback('onChangeState');
		}

		if(!this.state.isTouch && !this.state.bypass){
			// set Status to do
			this.storeInfo();

			// stopVideo
			if(this.state.videoPlay){
				this.stopVideo();
			}
		}
	};

	/**
	 * storeInfo
	 * store basic information about current states
	 * @since 2.0.0
	 */

	Owl.prototype.storeInfo = function(){
		var currentPosition = this.state.lazyContent ? this.pos.lcCurrentAbs || 0 : this.pos.current;
		var allItems = this.state.lazyContent ? this.dom.$content.length-1 : this.num.oItems;

		this.info = {
			items: 			this.options.items,
			allItems:		allItems,
			currentPosition:currentPosition,
			currentPage:	this.pos.currentPage,
			allPages:		this.num.allPages,
			autoplay:		this.state.autoplay,
			windowWidth:	this.width.window,
			elWidth:		this.width.el,
			breakpoint:		this.num.breakpoint
		};

		if (typeof this.options.info === 'function') {
			this.options.info.apply(this,[this.info,this.dom.el]);
		}
	};

	/**
	 * autoHeight
	 * @since 2.0.0
	 */

	Owl.prototype.autoHeight = function(callback){
		 if(this.options.autoHeight !== true && callback !== true){
			return false;
		}
		if(!this.dom.$oStage.hasClass(this.options.autoHeightClass)){
			this.dom.$oStage.addClass(this.options.autoHeightClass);
		}

		var loaded = this.dom.$items.eq(this.pos.currentAbs);
		var stage = this.dom.$oStage;
		var iterations = 0;

		var isLoaded = window.setInterval(function() {
			iterations += 1;
			if(loaded.data('owl-item').loaded){
				stage.height(loaded.height() + 'px');
				clearInterval(isLoaded);
			} else if(iterations === 500){
				clearInterval(isLoaded);
			}
		}, 100);
	};

	/**
	 * preloadAutoWidthImages
	 * @desc still to test
	 * @since 2.0.0
	 */

	Owl.prototype.preloadAutoWidthImages = function(imgs){
		var loaded = 0;
		var that = this;
		imgs.each(function(i,el){
			var $el = $(el);
			var img = new Image();

			img.onload = function(){
				loaded++;
				$el.attr('src',img.src);
				$el.css('opacity',1);
				if(loaded >= imgs.length){
					that.state.imagesLoaded = true;
					that.init();
				}
			}

			img.src = $el.attr('src') ||  $el.attr('data-src') || $el.attr('data-src-retina');;
		})
	};

	/**
	 * lazyLoad
	 * @desc lazyLoad images
	 * @since 2.0.0
	 */

	Owl.prototype.lazyLoad = function(){
		var attr = isRetina() ? 'data-src-retina' : 'data-src';
		var src, img,i;

		for(i = 0; i < this.num.items; i++){
			var $item = this.dom.$items.eq(i);

			if( $item.data('owl-item').current === true && $item.data('owl-item').loaded === false){
				img = $item.find('.owl-lazy');
				src = img.attr(attr);
				src = src || img.attr('data-src');
				if(src){
					img.css('opacity','0');
					this.preload(img,$item);
				}
			}
		}
	};

	/**
	 * preload
	 * @since 2.0.0
	 */

	 Owl.prototype.preload = function(images,$item){
		var that = this; // fix this later

		images.each(function(i,el){
			var $el = $(el);
			var img = new Image();

			img.onload = function(){

				$item.data('owl-item').loaded = true;
				if($el.is('img')){
					$el.attr('src',img.src);
				}else{
					$el.css('background-image','url(' + img.src + ')');
				}

				$el.css('opacity',1);
				that.fireCallback('onLazyLoaded');
			};
			img.src = $el.attr('data-src') || $el.attr('data-src-retina');
			setTimeout(function(){
			  $el.parent().removeClass('owl-lazy-parent');
			  $el.removeAttr('data-src').removeClass('owl-lazy');
			}, 500);
		});
	 };

	/**
	 * animate
	 * @since 2.0.0
	 */

	 Owl.prototype.animate = function(){

		var prevItem = this.dom.$items.eq(this.pos.prev),
			prevPos = Math.abs(prevItem.data('owl-item').width) * this.pos.prev,
			currentItem = this.dom.$items.eq(this.pos.currentAbs),
			currentPos = Math.abs(currentItem.data('owl-item').width) * this.pos.currentAbs;

		if(this.pos.currentAbs === this.pos.prev){
			return false;
		}

		var pos = currentPos - prevPos;
		var tIn = this.options.animateIn;
		var tOut = this.options.animateOut;
		var that = this;

		removeStyles = function(){
			$(this).css({
                "left" : ""
            })
            .removeClass('animated owl-animated-out owl-animated-in')
            .removeClass(tIn)
            .removeClass(tOut);

            that.transitionEnd();
        };

		if(tOut){
			prevItem
			.css({
				"left" : pos + "px"
			})
			.addClass('animated owl-animated-out '+tOut)
			.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', removeStyles);
		}

		if(tIn){
			currentItem
			.addClass('animated owl-animated-in '+tIn)
			.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', removeStyles);
		}
	 };

	/**
	 * destroy
	 * @desc Remove Owl structure and events :(
	 * @since 2.0.0
	 */

	Owl.prototype.destroy = function(){

		window.clearInterval(this.e._autoplay);

		if(this.dom.$el.hasClass(this.options.themeClass)){
			this.dom.$el.removeClass(this.options.themeClass);
		}

		if(this.options.responsive !== false){
			this.off(window, 'resize', this.e._resizer);
		}

		if(this.transitionEndVendor){
			this.off(this.dom.stage, this.transitionEndVendor, this.e._transitionEnd);
		}

		if(this.options.mouseDrag || this.options.touchDrag){
			this.off(this.dom.stage, this.dragType[0], this.e._onDragStart);
			if(this.options.mouseDrag){
				this.off(document, this.dragType[3], this.e._onDragStart);
			}
			if(this.options.mouseDrag){
				this.dom.$stage.off('dragstart', function() {return false;});
				this.dom.stage.onselectstart = function(){};
			}
		}

		if(this.options.URLhashListener){
			this.off(window, 'hashchange', this.e._goToHash);
		}

		this.dom.$el.off('next.owl',this.e.next);
		this.dom.$el.off('prev.owl',this.e.prev);
		this.dom.$el.off('goTo.owl',this.e.goTo);
		this.dom.$el.off('jumpTo.owl',this.e.jumpTo);
		this.dom.$el.off('addItem.owl',this.e.addItem);
		this.dom.$el.off('removeItem.owl',this.e.removeItem);
		this.dom.$el.off('refresh.owl',this.e.refresh);
		this.dom.$el.off('autoHeight.owl',this.e.autoHeight);
		this.dom.$el.off('play.owl',this.e.play);
		this.dom.$el.off('stop.owl',this.e.stop);
		this.dom.$el.off('stopVideo.owl',this.e.stop);
		this.dom.$stage.off('click',this.e._playVideo);

		if(this.dom.$cc !== null){
			this.dom.$cc.remove();
		}
		if(this.dom.$cItems !== null){
			this.dom.$cItems.remove();
		}
		this.e = null;
		this.dom.$el.data('owlCarousel',null);
		delete this.dom.el.owlCarousel;

		this.dom.$stage.unwrap();
		this.dom.$items.unwrap();
		this.dom.$items.contents().unwrap();
		this.dom = null;
	};

	/**
	 * Opertators
	 * @desc Used to calculate RTL
	 * @param [a] - Number - left side
	 * @param [o] - String - operator
	 * @param [b] - Number - right side
	 * @since 2.0.0
	 */

	Owl.prototype.op = function(a,o,b){
		var rtl = this.options.rtl;
		switch(o) {
			case '<':
				return rtl ? a > b : a < b;
			case '>':
				return rtl ? a < b : a > b;
			case '>=':
				return rtl ? a <= b : a >= b;
			case '<=':
				return rtl ? a >= b : a <= b;
			default:
				break;
		}
	};

	/**
	 * Opertators
	 * @desc Used to calculate RTL
	 * @since 2.0.0
	 */

	Owl.prototype.browserSupport = function(){
		this.support3d = isPerspective();

		if(this.support3d){
			this.transformVendor = isTransform();

			// take transitionend event name by detecting transition
			var endVendors = ['transitionend','webkitTransitionEnd','transitionend','oTransitionEnd'];
			this.transitionEndVendor = endVendors[isTransition()];

			// take vendor name from transform name
			this.vendorName = this.transformVendor.replace(/Transform/i,'');
			this.vendorName = this.vendorName !== '' ? '-'+this.vendorName.toLowerCase()+'-' : '';
		}

		this.state.orientation = window.orientation;
	};

	// Pivate methods

	// CSS detection;
	function isStyleSupported(array){
		var p,s,fake = document.createElement('div'),list = array;
		for(p in list){
			s = list[p];
			if(typeof fake.style[s] !== 'undefined'){
				fake = null;
				return [s,p];
			}
		}
		return [false];
	}

	function isTransition(){
		return isStyleSupported(['transition','WebkitTransition','MozTransition','OTransition'])[1];
	}

	function isTransform() {
		return isStyleSupported(['transform','WebkitTransform','MozTransform','OTransform','msTransform'])[0];
	}

	function isPerspective(){
		return isStyleSupported(['perspective','webkitPerspective','MozPerspective','OPerspective','MsPerspective'])[0];
	}

	function isTouchSupport(){
		return 'ontouchstart' in window || !!(navigator.msMaxTouchPoints);
	}

	function isTouchSupportIE(){
		return window.navigator.msPointerEnabled;
	}

	function isRetina(){
		return window.devicePixelRatio > 1;
	}

	$.fn.owlCarousel = function ( options ) {
		return this.each(function () {
			if (!$(this).data('owlCarousel')) {
				$(this).data( 'owlCarousel',
				new Owl( this, options ));
			}
		});

	};

})( window.Zepto || window.jQuery, window,  document );

//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
//The bind() method creates a new function that, when called, has its this keyword set to the provided value, with a given sequence of arguments preceding any provided when the new function is called.

if (!Function.prototype.bind) {
  Function.prototype.bind = function (oThis) {
	if (typeof this !== 'function') {
		// closest thing possible to the ECMAScript 5 internal IsCallable function
		throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
	}

	var aArgs = Array.prototype.slice.call(arguments, 1),
		fToBind = this,
		fNOP = function () {},
		fBound = function () {
			return fToBind.apply(this instanceof fNOP && oThis ? this : oThis, aArgs.concat(Array.prototype.slice.call(arguments)));
		};
	fNOP.prototype = this.prototype;
	fBound.prototype = new fNOP();
	return fBound;
  };
}

},{}],9:[function(require,module,exports){
$( function()
{
    var targets = $( '[rel~=tooltip]' ),
        target  = false,
        tooltip = false,
        title   = false;

    targets.bind( 'mouseenter', function()
    {
        target  = $( this );
        tip     = target.attr( 'title' );
        tooltip = $( '<div id="tooltip"></div>' );

        if( !tip || tip == '' )
            return false;

        target.removeAttr( 'title' );
        tooltip.css( 'opacity', 0 )
               .html( tip )
               .appendTo( 'body' );

        var init_tooltip = function()
        {
            if( $( window ).width() < tooltip.outerWidth() * 1.5 )
                tooltip.css( 'max-width', $( window ).width() / 2 );
            else
                tooltip.css( 'max-width', 340 );

            var pos_left = target.offset().left + ( target.outerWidth() / 2 ) - ( tooltip.outerWidth() / 2 ),
                pos_top  = target.offset().top - tooltip.outerHeight() - 20;

            if( pos_left < 0 )
            {
                pos_left = target.offset().left + target.outerWidth() / 2 - 20;
                tooltip.addClass( 'left' );
            }
            else
                tooltip.removeClass( 'left' );

            if( pos_left + tooltip.outerWidth() > $( window ).width() )
            {
                pos_left = target.offset().left - tooltip.outerWidth() + target.outerWidth() / 2 + 20;
                tooltip.addClass( 'right' );
            }
            else
                tooltip.removeClass( 'right' );

            if( pos_top < 0 )
            {
                var pos_top  = target.offset().top + target.outerHeight();
                tooltip.addClass( 'top' );
            }
            else
                tooltip.removeClass( 'top' );

            tooltip.css( { left: pos_left, top: pos_top } )
                   .animate( { top: '+=10', opacity: 1 }, 50 );
        };

        init_tooltip();
        $( window ).resize( init_tooltip );

        var remove_tooltip = function()
        {
            tooltip.animate( { top: '-=10', opacity: 0 }, 50, function()
            {
                $( this ).remove();
            });

            target.attr( 'title', tip );
        };

        target.bind( 'mouseleave', remove_tooltip );
        tooltip.bind( 'click', remove_tooltip );
    });
});
},{}],10:[function(require,module,exports){
/*!
 * # Semantic UI 1.11.4 - Transition
 * http://github.com/semantic-org/semantic-ui/
 *
 *
 * Copyright 2014 Contributors
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 */

;(function ( $, window, document, undefined ) {

"use strict";

$.fn.transition = function() {
  var
    $allModules     = $(this),
    moduleSelector  = $allModules.selector || '',

    time            = new Date().getTime(),
    performance     = [],

    moduleArguments = arguments,
    query           = moduleArguments[0],
    queryArguments  = [].slice.call(arguments, 1),
    methodInvoked   = (typeof query === 'string'),

    requestAnimationFrame = window.requestAnimationFrame
      || window.mozRequestAnimationFrame
      || window.webkitRequestAnimationFrame
      || window.msRequestAnimationFrame
      || function(callback) { setTimeout(callback, 0); },

    returnedValue
  ;
  $allModules
    .each(function(index) {
      var
        $module  = $(this),
        element  = this,

        // set at run time
        settings,
        instance,

        error,
        className,
        metadata,
        animationStart,
        animationEnd,
        animationName,

        namespace,
        moduleNamespace,
        eventNamespace,
        module
      ;

      module = {

        initialize: function() {

          // get full settings
          settings        = module.get.settings.apply(element, moduleArguments);

          // shorthand
          className       = settings.className;
          error           = settings.error;
          metadata        = settings.metadata;

          // define namespace
          eventNamespace  = '.' + settings.namespace;
          moduleNamespace = 'module-' + settings.namespace;
          instance        = $module.data(moduleNamespace) || module;

          // get vendor specific events
          animationEnd    = module.get.animationEndEvent();
          animationName   = module.get.animationName();
          animationStart  = module.get.animationStartEvent();

          if(methodInvoked) {
            methodInvoked = module.invoke(query);
          }

          // method not invoked, lets run an animation
          if(methodInvoked === false) {
            module.verbose('Converted arguments into settings object', settings);
            if(settings.interval) {
              module.delay(settings.animate);
            }
            else  {
              module.animate();
            }
            module.instantiate();
          }
        },

        instantiate: function() {
          module.verbose('Storing instance of module', module);
          instance = module;
          $module
            .data(moduleNamespace, instance)
          ;
        },

        destroy: function() {
          module.verbose('Destroying previous module for', element);
          $module
            .removeData(moduleNamespace)
          ;
        },

        refresh: function() {
          module.verbose('Refreshing display type on next animation');
          delete module.displayType;
        },

        forceRepaint: function() {
          module.verbose('Forcing element repaint');
          var
            $parentElement = $module.parent(),
            $nextElement = $module.next()
          ;
          if($nextElement.length === 0) {
            $module.detach().appendTo($parentElement);
          }
          else {
            $module.detach().insertBefore($nextElement);
          }
        },

        repaint: function() {
          module.verbose('Repainting element');
          var
            fakeAssignment = element.offsetWidth
          ;
        },

        delay: function(interval) {
          var
            isReverse = (settings.reverse === true),
            shouldReverse = (settings.reverse == 'auto' && module.get.direction() == className.outward),
            delay
          ;
          interval = (typeof interval !== undefined)
            ? interval
            : settings.interval
          ;
          delay = (isReverse || shouldReverse)
            ? ($allModules.length - index) * settings.interval
            : index * settings.interval
          ;
          module.debug('Delaying animation by', delay);
          setTimeout(module.animate, delay);
        },

        animate: function(overrideSettings) {
          settings = overrideSettings || settings;
          if(!module.is.supported()) {
            module.error(error.support);
            return false;
          }
          module.debug('Preparing animation', settings.animation);
          if(module.is.animating()) {
            if(settings.queue) {
              if(!settings.allowRepeats && module.has.direction() && module.is.occurring() && module.queuing !== true) {
                module.debug('Animation is currently occurring, preventing queueing same animation', settings.animation);
              }
              else {
                module.queue(settings.animation);
              }
              return false;
            }
            else if(!settings.allowRepeats && module.is.occurring()) {
              module.debug('Animation is already occurring, will not execute repeated animation', settings.animation);
              return false;
            }
            else {
              module.debug('New animation started, completing previous early', settings.animation);
              module.complete();
            }
          }
          if( module.can.animate() ) {
            module.set.animating(settings.animation);
          }
          else {
            module.error(error.noAnimation, settings.animation, element);
          }
        },

        reset: function() {
          module.debug('Resetting animation to beginning conditions');
          module.remove.animationCallbacks();
          module.restore.conditions();
          module.remove.animating();
        },

        queue: function(animation) {
          module.debug('Queueing animation of', animation);
          module.queuing = true;
          $module
            .one(animationEnd + '.queue' + eventNamespace, function() {
              module.queuing = false;
              module.repaint();
              module.animate.apply(this, settings);
            })
          ;
        },

        complete: function (event) {
          module.debug('Animation complete', settings.animation);
          module.remove.completeCallback();
          module.remove.failSafe();
          if(!module.is.looping()) {
            if( module.is.outward() ) {
              module.verbose('Animation is outward, hiding element');
              module.restore.conditions();
              module.hide();
              settings.onHide.call(this);
            }
            else if( module.is.inward() ) {
              module.verbose('Animation is outward, showing element');
              module.restore.conditions();
              module.show();
              settings.onShow.call(this);
            }
            else {
              module.restore.conditions();
            }
            module.remove.animation();
            module.remove.animating();
          }
          settings.onComplete.call(this);
        },

        has: {
          direction: function(animation) {
            var
              hasDirection = false
            ;
            animation = animation || settings.animation;
            if(typeof animation === 'string') {
              animation = animation.split(' ');
              $.each(animation, function(index, word){
                if(word === className.inward || word === className.outward) {
                  hasDirection = true;
                }
              });
            }
            return hasDirection;
          },
          inlineDisplay: function() {
            var
              style = $module.attr('style') || ''
            ;
            return $.isArray(style.match(/display.*?;/, ''));
          }
        },

        set: {
          animating: function(animation) {
            animation = animation || settings.animation;
            if(!module.is.animating()) {
              module.save.conditions();
            }
            module.remove.direction();
            module.remove.completeCallback();
            if(module.can.transition() && !module.has.direction()) {
              module.set.direction();
            }
            module.remove.hidden();
            module.set.display();
            $module
              .addClass(className.animating + ' ' + className.transition + ' ' + animation)
              .addClass(animation)
              .one(animationEnd + '.complete' + eventNamespace, module.complete)
            ;
            if(settings.useFailSafe) {
              module.add.failSafe();
            }
            module.set.duration(settings.duration);
            settings.onStart.call(this);
            module.debug('Starting tween', animation, $module.attr('class'));
          },
          duration: function(animationName, duration) {
            duration = duration || settings.duration;
            duration = (typeof duration == 'number')
              ? duration + 'ms'
              : duration
            ;
            if(duration || duration === 0) {
              module.verbose('Setting animation duration', duration);
              $module
                .css({
                  '-webkit-animation-duration': duration,
                  '-moz-animation-duration': duration,
                  '-ms-animation-duration': duration,
                  '-o-animation-duration': duration,
                  'animation-duration':  duration
                })
              ;
            }
          },
          display: function() {
            var
              style              = module.get.style(),
              displayType        = module.get.displayType(),
              overrideStyle      = style + 'display: ' + displayType + ' !important;'
            ;
            $module.css('display', '');
            module.refresh();
            if( $module.css('display') !== displayType ) {
              module.verbose('Setting inline visibility to', displayType);
              $module
                .attr('style', overrideStyle)
              ;
            }
          },
          direction: function() {
            if($module.is(':visible') && !module.is.hidden()) {
              module.debug('Automatically determining the direction of animation', 'Outward');
              $module
                .removeClass(className.inward)
                .addClass(className.outward)
              ;
            }
            else {
              module.debug('Automatically determining the direction of animation', 'Inward');
              $module
                .removeClass(className.outward)
                .addClass(className.inward)
              ;
            }
          },
          looping: function() {
            module.debug('Transition set to loop');
            $module
              .addClass(className.looping)
            ;
          },
          hidden: function() {
            if(!module.is.hidden()) {
              $module
                .addClass(className.transition)
                .addClass(className.hidden)
              ;
            }
            if($module.css('display') !== 'none') {
              module.verbose('Overriding default display to hide element');
              $module
                .css('display', 'none')
              ;
            }
          },
          visible: function() {
            $module
              .addClass(className.transition)
              .addClass(className.visible)
            ;
          }
        },

        save: {
          displayType: function(displayType) {
            $module.data(metadata.displayType, displayType);
          },
          transitionExists: function(animation, exists) {
            $.fn.transition.exists[animation] = exists;
            module.verbose('Saving existence of transition', animation, exists);
          },
          conditions: function() {
            var
              clasName = $module.attr('class') || false,
              style    = $module.attr('style') || ''
            ;
            $module.removeClass(settings.animation);
            module.remove.direction();
            module.cache = {
              className : $module.attr('class'),
              style     : module.get.style()
            };
            module.verbose('Saving original attributes', module.cache);
          }
        },

        restore: {
          conditions: function() {
            if(module.cache === undefined) {
              return false;
            }
            if(module.cache.className) {
              $module.attr('class', module.cache.className);
            }
            else {
              $module.removeAttr('class');
            }
            if(module.cache.style) {
              module.verbose('Restoring original style attribute', module.cache.style);
              $module.attr('style', module.cache.style);
            }
            else {
              module.verbose('Clearing style attribute');
              $module.removeAttr('style');
            }
            module.verbose('Restoring original attributes', module.cache);
          }
        },

        add: {
          failSafe: function() {
            var
              duration = module.get.duration()
            ;
            module.timer = setTimeout(function() {
              $module.trigger(animationEnd);
            }, duration + settings.failSafeDelay);
            module.verbose('Adding fail safe timer', module.timer);
          }
        },

        remove: {
          animating: function() {
            $module.removeClass(className.animating);
          },
          animation: function() {
            $module
              .css({
                '-webkit-animation' : '',
                '-moz-animation'    : '',
                '-ms-animation'     : '',
                '-o-animation'      : '',
                'animation'         : ''
              })
            ;
          },
          animationCallbacks: function() {
            module.remove.queueCallback();
            module.remove.completeCallback();
          },
          queueCallback: function() {
            $module.off('.queue' + eventNamespace)
          },
          completeCallback: function() {
            $module.off('.complete' + eventNamespace);
          },
          display: function() {
            $module.css('display', '');
          },
          direction: function() {
            $module
              .removeClass(className.inward)
              .removeClass(className.outward)
            ;
          },
          failSafe: function() {
            module.verbose('Removing fail safe timer', module.timer);
            if(module.timer) {
              clearTimeout(module.timer);
            }
          },
          hidden: function() {
            $module.removeClass(className.hidden);
          },
          visible: function() {
            $module.removeClass(className.visible);
          },
          looping: function() {
            module.debug('Transitions are no longer looping');
            if( module.is.looping() ) {
              module.reset();
              $module
                .removeClass(className.looping)
              ;
            }
          },
          transition: function() {
            $module
              .removeClass(className.visible)
              .removeClass(className.hidden)
            ;
          }
        },
        get: {
          settings: function(animation, duration, onComplete) {
            // single settings object
            if(typeof animation == 'object') {
              return $.extend(true, {}, $.fn.transition.settings, animation);
            }
            // all arguments provided
            else if(typeof onComplete == 'function') {
              return $.extend({}, $.fn.transition.settings, {
                animation  : animation,
                onComplete : onComplete,
                duration   : duration
              });
            }
            // only duration provided
            else if(typeof duration == 'string' || typeof duration == 'number') {
              return $.extend({}, $.fn.transition.settings, {
                animation : animation,
                duration  : duration
              });
            }
            // duration is actually settings object
            else if(typeof duration == 'object') {
              return $.extend({}, $.fn.transition.settings, duration, {
                animation : animation
              });
            }
            // duration is actually callback
            else if(typeof duration == 'function') {
              return $.extend({}, $.fn.transition.settings, {
                animation  : animation,
                onComplete : duration
              });
            }
            // only animation provided
            else {
              return $.extend({}, $.fn.transition.settings, {
                animation : animation
              });
            }
            return $.fn.transition.settings;
          },
          direction: function(animation) {
            // quickest manually specified direction
            animation = animation || settings.animation;
            if(typeof animation === 'string') {
              animation = animation.split(' ');
              $.each(animation, function(index, word){
                if(word === className.inward) {
                  return className.inward;
                }
                else if(word === className.outward) {
                  return className.outward;
                }
              });
            }
            // slower backup
            if( !module.can.transition() ) {
              return 'static';
            }
            if($module.is(':visible') && !module.is.hidden()) {
              return className.outward;
            }
            else {
              return className.inward;
            }
          },
          duration: function(duration) {
            duration = duration || settings.duration;
            if(duration === false) {
              duration = $module.css('animation-duration') || 0;
            }
            return (typeof duration === 'string')
              ? (duration.indexOf('ms') > -1)
                ? parseFloat(duration)
                : parseFloat(duration) * 1000
              : duration
            ;
          },
          displayType: function() {
            if(settings.displayType) {
              return settings.displayType;
            }
            if($module.data(metadata.displayType) === undefined) {
              // create fake element to determine display state
              module.can.transition(true);
            }
            return $module.data(metadata.displayType);
          },
          style: function() {
            var
              style = $module.attr('style') || ''
            ;
            return style.replace(/display.*?;/, '');
          },
          transitionExists: function(animation) {
            return $.fn.transition.exists[animation];
          },
          animationName: function() {
            var
              element     = document.createElement('div'),
              animations  = {
                'animation'       :'animationName',
                'OAnimation'      :'oAnimationName',
                'MozAnimation'    :'mozAnimationName',
                'WebkitAnimation' :'webkitAnimationName'
              },
              animation
            ;
            for(animation in animations){
              if( element.style[animation] !== undefined ){
                return animations[animation];
              }
            }
            return false;
          },
          animationStartEvent: function() {
            var
              element     = document.createElement('div'),
              animations  = {
                'animation'       :'animationstart',
                'OAnimation'      :'oAnimationStart',
                'MozAnimation'    :'mozAnimationStart',
                'WebkitAnimation' :'webkitAnimationStart'
              },
              animation
            ;
            for(animation in animations){
              if( element.style[animation] !== undefined ){
                return animations[animation];
              }
            }
            return false;
          },
          animationEndEvent: function() {
            var
              element     = document.createElement('div'),
              animations  = {
                'animation'       :'animationend',
                'OAnimation'      :'oAnimationEnd',
                'MozAnimation'    :'mozAnimationEnd',
                'WebkitAnimation' :'webkitAnimationEnd'
              },
              animation
            ;
            for(animation in animations){
              if( element.style[animation] !== undefined ){
                return animations[animation];
              }
            }
            return false;
          }

        },

        can: {
          transition: function(forced) {
            var
              elementClass      = $module.attr('class'),
              tagName           = $module.prop('tagName'),
              animation         = settings.animation,
              transitionExists  = module.get.transitionExists(animation),
              $clone,
              currentAnimation,
              inAnimation,
              directionExists,
              displayType
            ;
            if( transitionExists === undefined || forced) {
              module.verbose('Determining whether animation exists');
              $clone = $('<' + tagName + ' />').addClass( elementClass ).insertAfter($module);
              currentAnimation = $clone
                .addClass(animation)
                .removeClass(className.inward)
                .removeClass(className.outward)
                .addClass(className.animating)
                .addClass(className.transition)
                .css(animationName)
              ;
              inAnimation = $clone
                .addClass(className.inward)
                .css(animationName)
              ;
              displayType = $clone
                .attr('class', elementClass)
                .removeAttr('style')
                .removeClass(className.hidden)
                .removeClass(className.visible)
                .show()
                .css('display')
              ;
              module.verbose('Determining final display state', displayType);
              module.save.displayType(displayType);

              $clone.remove();
              if(currentAnimation != inAnimation) {
                module.debug('Direction exists for animation', animation);
                directionExists = true;
              }
              else if(currentAnimation == 'none' || !currentAnimation) {
                module.debug('No animation defined in css', animation);
                return;
              }
              else {
                module.debug('Static animation found', animation, displayType);
                directionExists = false;
              }
              module.save.transitionExists(animation, directionExists);
            }
            return (transitionExists !== undefined)
              ? transitionExists
              : directionExists
            ;
          },
          animate: function() {
            // can transition does not return a value if animation does not exist
            return (module.can.transition() !== undefined);
          }
        },

        is: {
          animating: function() {
            return $module.hasClass(className.animating);
          },
          inward: function() {
            return $module.hasClass(className.inward);
          },
          outward: function() {
            return $module.hasClass(className.outward);
          },
          looping: function() {
            return $module.hasClass(className.looping);
          },
          occurring: function(animation) {
            animation = animation || settings.animation;
            animation = '.' + animation.replace(' ', '.');
            return ( $module.filter(animation).length > 0 );
          },
          visible: function() {
            return $module.is(':visible');
          },
          hidden: function() {
            return $module.css('visibility') === 'hidden';
          },
          supported: function() {
            return(animationName !== false && animationEnd !== false);
          }
        },

        hide: function() {
          module.verbose('Hiding element');
          if( module.is.animating() ) {
            module.reset();
          }
          module.remove.display();
          module.remove.visible();
          module.set.hidden();
          module.repaint();
        },

        show: function(display) {
          module.verbose('Showing element', display);
          module.remove.hidden();
          module.set.visible();
          module.set.display();
          module.repaint();
        },

        toggle: function() {
          if( module.is.visible() ) {
            module.hide();
          }
          else {
            module.show();
          }
        },

        stop: function() {
          module.debug('Stopping current animation');
          $module.trigger(animationEnd);
        },

        stopAll: function() {
          module.debug('Stopping all animation');
          module.remove.queueCallback();
          $module.trigger(animationEnd);
        },

        clear: {
          queue: function() {
            module.debug('Clearing animation queue')
            module.remove.queueCallback();
          }
        },

        enable: function() {
          module.verbose('Starting animation');
          $module.removeClass(className.disabled);
        },

        disable: function() {
          module.debug('Stopping animation');
          $module.addClass(className.disabled);
        },

        setting: function(name, value) {
          module.debug('Changing setting', name, value);
          if( $.isPlainObject(name) ) {
            $.extend(true, settings, name);
          }
          else if(value !== undefined) {
            settings[name] = value;
          }
          else {
            return settings[name];
          }
        },
        internal: function(name, value) {
          if( $.isPlainObject(name) ) {
            $.extend(true, module, name);
          }
          else if(value !== undefined) {
            module[name] = value;
          }
          else {
            return module[name];
          }
        },
        debug: function() {
          if(settings.debug) {
            if(settings.performance) {
              module.performance.log(arguments);
            }
            else {
              module.debug = Function.prototype.bind.call(console.info, console, settings.name + ':');
              module.debug.apply(console, arguments);
            }
          }
        },
        verbose: function() {
          if(settings.verbose && settings.debug) {
            if(settings.performance) {
              module.performance.log(arguments);
            }
            else {
              module.verbose = Function.prototype.bind.call(console.info, console, settings.name + ':');
              module.verbose.apply(console, arguments);
            }
          }
        },
        error: function() {
          module.error = Function.prototype.bind.call(console.error, console, settings.name + ':');
          module.error.apply(console, arguments);
        },
        performance: {
          log: function(message) {
            var
              currentTime,
              executionTime,
              previousTime
            ;
            if(settings.performance) {
              currentTime   = new Date().getTime();
              previousTime  = time || currentTime;
              executionTime = currentTime - previousTime;
              time          = currentTime;
              performance.push({
                'Name'           : message[0],
                'Arguments'      : [].slice.call(message, 1) || '',
                'Element'        : element,
                'Execution Time' : executionTime
              });
            }
            clearTimeout(module.performance.timer);
            module.performance.timer = setTimeout(module.performance.display, 100);
          },
          display: function() {
            var
              title = settings.name + ':',
              totalTime = 0
            ;
            time = false;
            clearTimeout(module.performance.timer);
            $.each(performance, function(index, data) {
              totalTime += data['Execution Time'];
            });
            title += ' ' + totalTime + 'ms';
            if(moduleSelector) {
              title += ' \'' + moduleSelector + '\'';
            }
            if($allModules.length > 1) {
              title += ' ' + '(' + $allModules.length + ')';
            }
            if( (console.group !== undefined || console.table !== undefined) && performance.length > 0) {
              console.groupCollapsed(title);
              if(console.table) {
                console.table(performance);
              }
              else {
                $.each(performance, function(index, data) {
                  console.log(data['Name'] + ': ' + data['Execution Time']+'ms');
                });
              }
              console.groupEnd();
            }
            performance = [];
          }
        },
        // modified for transition to return invoke success
        invoke: function(query, passedArguments, context) {
          var
            object = instance,
            maxDepth,
            found,
            response
          ;
          passedArguments = passedArguments || queryArguments;
          context         = element         || context;
          if(typeof query == 'string' && object !== undefined) {
            query    = query.split(/[\. ]/);
            maxDepth = query.length - 1;
            $.each(query, function(depth, value) {
              var camelCaseValue = (depth != maxDepth)
                ? value + query[depth + 1].charAt(0).toUpperCase() + query[depth + 1].slice(1)
                : query
              ;
              if( $.isPlainObject( object[camelCaseValue] ) && (depth != maxDepth) ) {
                object = object[camelCaseValue];
              }
              else if( object[camelCaseValue] !== undefined ) {
                found = object[camelCaseValue];
                return false;
              }
              else if( $.isPlainObject( object[value] ) && (depth != maxDepth) ) {
                object = object[value];
              }
              else if( object[value] !== undefined ) {
                found = object[value];
                return false;
              }
              else {
                return false;
              }
            });
          }
          if ( $.isFunction( found ) ) {
            response = found.apply(context, passedArguments);
          }
          else if(found !== undefined) {
            response = found;
          }

          if($.isArray(returnedValue)) {
            returnedValue.push(response);
          }
          else if(returnedValue !== undefined) {
            returnedValue = [returnedValue, response];
          }
          else if(response !== undefined) {
            returnedValue = response;
          }
          return (found !== undefined)
            ? found
            : false
          ;
        }
      };
      module.initialize();
    })
  ;
  return (returnedValue !== undefined)
    ? returnedValue
    : this
  ;
};

// Records if CSS transition is available
$.fn.transition.exists = {};

$.fn.transition.settings = {

  // module info
  name          : 'Transition',

  // debug content outputted to console
  debug         : false,

  // verbose debug output
  verbose       : true,

  // performance data output
  performance   : true,

  // event namespace
  namespace     : 'transition',

  // delay between animations in group
  interval      : 0,

  // whether group animations should be reversed
  reverse       : 'auto',

  // animation callback event
  onStart       : function() {},
  onComplete    : function() {},
  onShow        : function() {},
  onHide        : function() {},

  // whether timeout should be used to ensure callback fires in cases animationend does not
  useFailSafe   : true,

  // delay in ms for fail safe
  failSafeDelay : 100,

  // whether EXACT animation can occur twice in a row
  allowRepeats  : false,

  // Override final display type on visible
  displayType   : false,

  // animation duration
  animation     : 'fade',
  duration      : false,

  // new animations will occur after previous ones
  queue         : true,

  metadata : {
    displayType: 'display'
  },

  className   : {
    animating  : 'animating',
    disabled   : 'disabled',
    hidden     : 'hidden',
    inward     : 'in',
    loading    : 'loading',
    looping    : 'looping',
    outward    : 'out',
    transition : 'transition',
    visible    : 'visible'
  },

  // possible errors
  error: {
    noAnimation : 'There is no css animation matching the one you specified.',
    repeated    : 'That animation is already occurring, cancelling repeated animation',
    method      : 'The method you called is not defined',
    support     : 'This browser does not support CSS animations'
  }

};


})( jQuery, window , document );

},{}],11:[function(require,module,exports){
/** Verify.js - v0.0.1 - 2013/06/12
 * https://github.com/jpillora/verify
 * Copyright (c) 2013 Jaime Pillora - MIT
 */

(function(window,document,undefined) {
(function($) {

  if(window.console === undefined)
    window.console = { isFake: true };

  var fns = ["log","warn","info","group","groupCollapsed","groupEnd"];
  for (var i = fns.length - 1; i >= 0; i--)
    if(window.console[fns[i]] === undefined)
      window.console[fns[i]] = $.noop;

  if(!$) return;

  var I = function(i){ return i; };

  function log() {
    if(this.suppressLog)
      return;
    cons('log', this, arguments);
  }

  function warn() {
    cons('warn', this, arguments);
  }

  function info() {
    cons('info', this, arguments);
  }

  function cons(type, opts, args) {
    if(window.console === undefined ||
       window.console.isFake === true)
      return;

    var a = $.map(args,I);
    a[0] = [opts.prefix, a[0], opts.postfix].join('');
    var grp = $.type(a[a.length-1]) === 'boolean' ? a.pop() : null;

    //if(a[0]) a[0] = getName(this) + a[0];
    if(grp === true) window.console.group(a[0]);
    if(a[0] && grp === null)
      if(window.navigator.userAgent.indexOf("MSIE") >= 0)
        window.console.log(a.join(','));
      else
        window.console[type].apply(window.console, a);
    if(grp === false) window.console.groupEnd();
  }

  function withOptions(opts) {
    return {
      log:  function() { log.apply(opts, arguments); },
      warn: function() { warn.apply(opts, arguments); },
      info: function() { info.apply(opts, arguments); }
    };
  }

  var console = function(opts) {
    opts = $.extend({}, console.defaults, opts);
    return withOptions(opts);
  };

  console.defaults = {
    suppressLog: false,
    prefix: '',
    postfix: ''
  };

  $.extend(console, withOptions(console.defaults));

  if($.console === undefined)
    $.console = console;

  $.consoleNoConflict = console;

}(jQuery));

//plugin wide ajax cache
var ajaxCache = { loading: {}, loaded: {} } ;

//callable from user defined rules. alias: r.ajax
function ajaxHelper(userOpts, r) {

  var defaults = {
        method: "GET",
        timeout: 15 * 1000
      },
      exec = r._exec,
      promptContainer = exec.type === "GroupRuleExecution" ?
          exec.element.domElem :
          r.field,
      userSuccess = userOpts.success,
      userError   = userOpts.error,
      options = exec.element.options,
      serialised = JSON ? JSON.stringify(userOpts) : guid();

  function onErrorDefault(e) {
    log("ajax error");
    r.callback("There has been an error");
  }

  var userCallbacks = {
    success: userSuccess,
    error: userError || onErrorDefault
  };

  //already completed
  if(ajaxCache.loaded[serialised]) {

    var args = ajaxCache.loaded[serialised],
        success = userCallbacks.success;

    success.apply(r, args);
    return;
  }

  //this request is in progress,
  //store callbacks for when first request completes
  if(!ajaxCache.loading[serialised])
    ajaxCache.loading[serialised] = [];
  ajaxCache.loading[serialised].push(userCallbacks);

  if(ajaxCache.loading[serialised].length !== 1) return;

  options.prompt(promptContainer, "Checking...", "load");

  function intercept() {
    options.prompt(promptContainer, false);

    var reqs = ajaxCache.loading[serialised];
    while(reqs.length)
      reqs.pop().success.apply(r,arguments);

    ajaxCache.loaded[serialised] = arguments;
  }

  var realCallbacks = {
    success: intercept,
    error: intercept
  };

  exec.ajax = $.ajax($.extend(defaults, userOpts, realCallbacks));
}



// var guid = function() {
//   return (((1 + Math.random()) * 65536) | 0).toString(16).substring(1);
// };

var guid = function() {
  return guid.curr++;
};
guid.curr = 1;

$.fn.verifyScrollView = function(onComplete) {
  var field = $(this).first();
  if(field.length !== 1) return $(this);
  return $(this).verifyScrollTo(field, onComplete);
};

$.fn.verifyScrollTo = function( target, options, callback ){
  if(typeof options == 'function' && arguments.length == 2){ callback = options; options = target; }
  var settings = $.extend({
    scrollTarget  : target,
    offsetTop     : 50,
    duration      : 500,
    easing        : 'swing'
  }, options);
  return this.each(function(){
    var scrollPane = $(this);
    var scrollTarget = (typeof settings.scrollTarget == "number") ? settings.scrollTarget : $(settings.scrollTarget);
    var scrollY = (typeof scrollTarget == "number") ? scrollTarget : scrollTarget.offset().top + scrollPane.scrollTop() - parseInt(settings.offsetTop, 10);
    scrollPane.animate({scrollTop : scrollY }, parseInt(settings.duration, 10), settings.easing, function(){
      if (typeof callback == 'function') { callback.call(this); }
    });
  });
};

$.fn.equals = function(that) {
  if($(this).length !== that.length)
    return false;
  for(var i=0,l=$(this).length;i<l;++i)
    if($(this)[i] !== that[i])
      return false;
  return true;
};


// Inspired by base2 and Prototype

var Class = null;

(function(){
  var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
  // The base Class implementation (does nothing)
  Class = function(){};

  // Create a new Class that inherits from this class
  Class.extend = function(prop) {
    var _super = this.prototype;

    // Instantiate a base class (but only create the instance,
    // don't run the init constructor)
    initializing = true;
    var prototype = new this();
    initializing = false;

    // Copy the properties over onto the new prototype
    for (var name in prop) {
      // Check if we're overwriting an existing function
      prototype[name] = typeof prop[name] == "function" &&
        typeof _super[name] == "function" && fnTest.test(prop[name]) ?
        (function(name, fn){
          return function() {
            var tmp = this._super;

            // Add a new ._super() method that is the same method
            // but on the super-class
            this._super = _super[name];

            // The method only need to be bound temporarily, so we
            // remove it when we're done executing
            var ret = fn.apply(this, arguments);
            this._super = tmp;

            return ret;
          };
        })(name, prop[name]) :
        prop[name];
    }

    // The dummy class constructor
    function Class() {
      // All construction is actually done in the init method
      if ( !initializing && this.init )
        this.init.apply(this, arguments);
    }

    // Populate our constructed prototype object
    Class.prototype = prototype;

    // Enforce the constructor to be what we expect
    Class.prototype.constructor = Class;

    // And make this class extendable
    Class.extend = arguments.callee;

    return Class;
  };
})();
var Set = Class.extend({
  //class variables
  init: function(items, name) {
    //instance variables
    if(name)
      this.name = name;
    else
      this.name = "Set_"+guid();
    this.array = [];
    this.addAll(items);
  },

  indexOf: function(obj) {
    for(var i = 0, l = this.array.length;i<l; ++i)
      if($.isFunction(obj) ?
          obj(this.get(i)) :
          this.equals(this.get(i),obj))
        return i;
    return -1;
  },

  //obj can be a filter function or an object to 'equals' against
  find: function(obj) {
    return this.get(this.indexOf(obj)) || null;
  },

  get: function(i) {
    return this.array[i];
  },
  //truthy find
  has: function(item) {
    return !!this.find(item);
  },
  add: function(item) {
    if(!this.has(item)) {
      this.array.push(item);
      return true;
    }
    return false;
  },
  addAll: function(items) {
    if(!items) return 0;
    if(!$.isArray(items)) items = [items];
    var count = 0;
    for(var i = 0, l = items.length; i<l; ++i)
      if(this.add(items[i]))
        count++;
    return count;
  },
  remove: function(item) {
    var newSet = [];
    for(var i = 0, l = this.array.length; i<l; ++i)
      if(!this.equals(this.get(i),item))
        newSet.push(this.get(i));

    this.array = newSet;
    return item;
  },
  removeAll: function() {
    this.array = [];
  },
  equals: function(i1, i2) {
    if(i1 && i2 && i1.equals !== undefined && i2.equals !== undefined)
      return i1.equals(i2);
    else
      return i1 === i2;
  },
  each: function(fn) {
    for(var i = 0, l = this.array.length; i<l; ++i)
      if( fn(this.get(i)) === false)
        return;
  },
  map: function(fn) {
    return $.map(this.array,fn);
  },
  filter: function(fn) {
    return $.grep(this.array, fn);
  },
  size: function() {
    return this.array.length;
  },
  getArray: function() {
    return this.array;
  }
});
var TypedSet = Set.extend({
  init: function(type, items, name) {
    this.type = type;
    this._super(items, name);
  },
  add: function(item) {
    if(item instanceof this.type)
      this._super(item);
    else
      this.log("add failed - invalid type")
  }
});
var Utils = {

  //object create implementation
  create: function (o) {
    function F() {}
    F.prototype = o;
    return new F();
  },

  //bind method
  bind: $.proxy,

  //check options - throws a warning if the option doesn't exist
  checkOptions: function(opts) {
    if(!opts) return;
    for(var key in opts)
      if(globalOptions[key] === undefined)
        warn("Invalid option: '" + key + "'");
  },

  //append to arguments[i]
  appendArg: function(args, expr, i) {
      if(!i) i = 0;
      var a = [].slice.call(args, i);
      a[i] = expr + a[i];
      return a;
  },

  //memoize.js - by @addyosmani, @philogb, @mathias
  // with a few useful tweaks from @DmitryBaranovsk
  memoize: function( fn ) {
    return function () {
      var args = Array.prototype.slice.call(arguments),
      hash = "",
      i  = args.length,
      currentArg = null;
      while(i--){
        currentArg = args[i];
        hash += (currentArg === Object(currentArg)) ?
              JSON.stringify(currentArg) : currentArg;
        fn.memoize || (fn.memoize = {});
      }
      return (hash in fn.memoize) ? fn.memoize[hash] :
      fn.memoize[hash] = fn.apply( this , args );
    };
  },

  dateToString: function(date) {
    return date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
  },

  parseDate: function(dateStr) {
    //format check
    var m = dateStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if(!m) return null;

    var date;
    //parse with jquery ui's date picker
    if($.datepicker !== undefined) {
      try {
        var epoch = $.datepicker.parseDate("dd/mm/yy", dateStr);
        date = new Date(epoch);
      } catch(e) { return null; }
    //simple regex parse
    } else {
      date = new Date(parseInt(m[3], 10),parseInt(m[2], 10)-1,parseInt(m[1], 10));
    }

    return date;
  },

  /**
   * returns true if we are in a RTLed document
   * @param {jqObject} field
   */
  isRTL: function(field) {
    var $document = $(document);
    var $body = $('body');
    var rtl =
      (field && field.hasClass('rtl')) ||
      (field && (field.attr('dir') || '').toLowerCase()==='rtl') ||
      $document.hasClass('rtl') ||
      ($document.attr('dir') || '').toLowerCase()==='rtl' ||
      $body.hasClass('rtl') ||
      ($body.attr('dir') || '').toLowerCase()==='rtl';
    return Boolean(rtl);
  }
};


var VERSION = "0.0.1",
    cons = $.consoleNoConflict({ prefix: 'verify.js: ' }),
    log  = cons.log,
    warn = cons.warn,
    info = cons.info;



/* ===================================== *
 * Plugin Settings/Variables
 * ===================================== */

var globalOptions = {
  // Display log messages flag
  debug: false,
  // Auto initialise forms (on DOM ready)
  autoInit: true,
  // Attribute used to find validators
  validateAttribute: "data-validate",
  // Name of the event triggering field validation
  validationEventTrigger: "blur",
  // Automatically scroll viewport to the first error
  scroll: true,
  // Focus on the first input
  focusFirstField: true,
  // Hide error while the user is changing
  hideErrorOnChange: false,
  // Whether to skip the hidden fields
  skipHiddenFields: true,
  // Whether to skip the hidden fields
  skipDisabledFields: true,
  // What class name to apply to the 'errorContainer'
  errorClass: "error",
  // Filter method to find element to apply error class
  errorContainer: function (e) {
    return e;
  },
  // Filter method to find element which reskins the current element
  reskinContainer: function (e) {
    return e;
  },
  //Before form-submit hook
  beforeSubmit: function(e, result) {
    return result;
  },
  //tracking method
  track: $.noop,
  //whether to show prompts
  showPrompt: true,
  //prompt method,
  prompt: function(element, text, opts) {
    // if($.type($.notify) === 'function') {
    //   if(!opts) opts = {color: 'red'};
    //   $.notify(element, text, opts);
    // }
    var target = element.siblings(".Alert");
    if (element.parent().hasClass('js-validate-select')) {
      target = element.parent('.js-validate-select').siblings(".Alert");
    }
    if (text) {
      target.addClass("is-active");
      target.children(".Alert-inner").html(text);
    } else {
      target.removeClass("is-active");
      setTimeout(function(){
        target.children(".Alert-inner").html('');
      }, 300);
    }

  }
};

//option object creator inheriting from globals
function CustomOptions(opts) {
  $.extend(true, this, opts);



}
CustomOptions.prototype = globalOptions;

/* ===================================== *
 * Base Class
 * ===================================== */

var BaseClass = Class.extend({
  name: "Class",
  toString: function() {
    return (this.type ? this.type + ": ":'') +
           (this.name ? this.name + ": ":'');
  },
  log: function() {
    if(!globalOptions.debug) return;
    log.apply(this, Utils.appendArg(arguments, this.toString()));
  },
  warn: function() {
    warn.apply(this, Utils.appendArg(arguments, this.toString()));
  },
  info: function() {
    info.apply(this, Utils.appendArg(arguments, this.toString()));
  },
  bind: function(name) {
    var prop = this[name];
    if(prop && $.isFunction(prop))
        this[name] = Utils.bind(prop,this);
  },
  bindAll: function() {
    for(var propName in this)
      this.bind(propName);
  },
  //enforce asynchronicity
  nextTick: function(fn, args, ms) {
    var _this = this;
    return window.setTimeout(function() {
      fn.apply(_this, args);
    }, ms || 0);
  }
});
// the Rule class will store all state relating to
// the user definition, all rule state from the DOM
// will be passes into the function inside an
// instance of a RuleExecution

var Rule = BaseClass.extend({

  init: function(name, userObj){
    this.name = name;

    if(!$.isPlainObject(userObj))
      return this.warn("rule definition must be a function or an object");

    this.type = userObj.__ruleType;

    //construct user obj inheriting parent
    this.extendInterface(userObj.extend);
    //does not inherit
    if(!this.userObj) this.userObj = {};
    //clone object to keep a canonical version intact
    $.extend(this.userObj, userObj);
    //infer 'fn' property
    this.buildFn();
    //rule is ready to be used
    this.ready = this.fn !== undefined;
  },

  extendInterface: function(parentName) {

    if(!parentName || typeof parentName !== 'string')
      return;

    //circular dependancy check - not extending itself or any of it's parents
    var p, name = parentName, names = [];
    while(name) {
      if(name === this.name)
        return this.error("Rule already extends '%s'", name);
      p = ruleManager.getRawRule(name);
      name = p ? p.extend : null;
    }
    //extend using another validator -> validator name
    var parentRule = ruleManager.getRule(parentName);
    if(!parentRule)
      return this.warn("Rule missing '%s'", name);

    this.parent = parentRule;

    //type check
    if(!(parentRule instanceof Rule))
      return this.error("Cannot extend: '"+otherName+"' invalid type");

    this.userObj = Utils.create(parentRule.userObj);
    this.userObj.parent = parentRule.userObj;
  },

  buildFn: function() {
    //handle object.fn
    if($.isFunction(this.userObj.fn)) {

      //createe ref on the rule
      this.fn = this.userObj.fn;

    //handle object.regexp
    } else if($.type(this.userObj.regex) === "regexp") {

      //build regex function
      this.fn = (function(regex) {
        return function(r) {
          var re = new RegExp(regex);
          if(!r.val().match(re))
            return r.message || "Invalid Format";
          return true;
        };

      })(this.userObj.regex);

    } else {
      return this.error("Rule has no function");
    }
  },

  //the 'this's in these interface mixins
  //refer to the rule 'r' object
  defaultInterface: {
    log: log,
    warn: warn,
    ajax: function(userOpts) {
      ajaxHelper(userOpts, this);
    }
  },

  defaultFieldInterface: {
    val: function() {
      return this.field.val.apply(this.field,arguments);
    }
  },

  defaultGroupInterface: {
    val: function(id, newVal) {
      var field = this.field(id);
      if(field) return newVal === undefined ? field.val() : field.val(newVal);
    },
    field: function(id) {
      var elems = $.grep(this._exec.members, function(exec) {
        return exec.id === id;
      });

      var elem = elems.length ? elems[0].element.domElem : null;

      if(!elem)
        this.warn("Cannot find group element with id: '" + id + "'");
      return elem;
    },
    fields: function() {
      return $().add($.map(this._exec.members, function(exec) {
        return exec.element.domElem;
      }));
    }
  },

  //build public ruleInterface the 'r' rule object
  buildInterface: function(exec) {
    var objs = [];

    objs.push({});
    //user object has lowest precedence!
    objs.push(this.userObj);
    objs.push(this.defaultInterface);
    if(this.type === 'field') {
      objs.push(this.defaultFieldInterface);
      objs.push({ field: exec.element.domElem });
    }
    if(this.type === 'group')
      objs.push(this.defaultGroupInterface);

    objs.push({
      prompt: exec.element.options.prompt,
      form:  exec.element.form.domElem,
      callback: exec.callback,
      args: exec.args,
      _exec: exec
    });

    return $.extend.apply(this,objs);
  }
});

/* ===================================== *
 * Rules Manager (Plugin Wide)
 * ===================================== */

var ruleManager = null;
(function() {

  //regex parser - with pre 'one(1,2),three.scope(6,7),five)'
  var parseString = function(str) {

    var chars = str.split(""),
        rule, rules = [],
        c, m, depth = 0;

    //replace argument commas with semi-colons
    // TODO allow escaping of '(' ')' ','
    for(var i = 0, l = chars.length; i<l; ++i) {
      c = chars[i];
      if(c === '(') depth++;
      if(c === ')') depth--;
      if(depth > 1) return null;
      if(c === ',' && depth === 1) chars[i] = ";";
    }

    //bracket check
    if(depth !== 0) return null;

    //convert string in format: "name.scope#id(args...)" to object
    $.each(chars.join('').split(','), function(i, rule) {
      //regex doc:      NAME  . SCOPE   # ID      ( PARAM;PARAM* )
      m = rule.match(/^(\w+)(\.(\w+))?(\#(\w+))?(\(([^;\)]+(\;[^;\)]+)*)\))?$/);
      if(!m) return warn("Invalid validate attribute: " + str);
      rule = {};
      rule.name = m[1];
      if(m[3]) rule.scope = m[3];
      if(m[5]) rule.id = m[5];
      rule.args = m[7] ? m[7].split(';') : [];
      rules.push(rule);
    });
    return rules;
  };

  var parseStringMemo = Utils.memoize(parseString);

  //privates
  var rawRules = {},
      builtRules = {};

  var addRules = function(type,obj) {
    //check format, insert type
    for(var name in obj){
      if(rawRules[name])
        warn("validator '%s' already exists", name);

      //functions get auto-objectified
      if($.isFunction(obj[name]))
        obj[name] = { fn: obj[name] };
      //
      obj[name].__ruleType = type;
    }

    //deep extend rules by obj
    $.extend(true, rawRules, obj);
  };

  //public
  var addFieldRules = function(obj) {
    addRules('field', obj);
  };

  var addGroupRules = function(obj) {
    addRules('group', obj);
  };

  var updateRules = function(obj) {

    var data = {};
    //check format, insert type
    for(var name in obj) {

      if(rawRules[name])
        data[name] = obj[name];
      else
        warn("cannot update validator '%s' doesn't exist yet", name);

      //rebuild
      if(builtRules[name])
        delete builtRules[name];
    }

    $.extend(true, rawRules, data);
  };

  var getRawRule = function(name) {
    return rawRules[name];
  };

  var getRule = function(name) {
    var r = builtRules[name],
        obj = rawRules[name];

    if(!obj)
      warn("Missing rule: " + name);
    else if(!r)
      r = builtRules[name] = new Rule(name, obj);

    return r;
  };

  //extract an objectified version of the "data-validate" attribute
  var parseAttribute = function(element) {
    var attrName = element.form.options.validateAttribute,
        attr = element.domElem.attr(attrName);
    if(!attr) return null;
    return parseStringMemo(attr);
  };

  //add a rule property to the above object
  var parseElement = function(element) {

    var required = false,
        type = null,
        attrResults = null,
        results = [];

    if(element.type !== 'ValidationField')
      return warn("Cannot get rules from invalid type");

    if(!element.domElem)
      return results;

    attrResults = this.parseAttribute(element);

    if(!attrResults || !attrResults.length)
      return results;

    //add rule instances
    $.each(attrResults, function(i, result) {
      //special required case
      if(/required/.test(result.name))
        required = true;

      result.rule = getRule(result.name);

      if(result.rule)
        results.push(result);
    });

    results.required = required;
    return results;
  };

  //public interface
  ruleManager = {
    addFieldRules: addFieldRules,
    addGroupRules: addGroupRules,
    getRule: getRule,
    getRawRule: getRawRule,
    parseString: parseString,
    parseAttribute: parseAttribute,
    parseElement: parseElement
  };

}());


var ValidationForm = null;
(function() {

  /* ===================================== *
   * Element Super Class
   * ===================================== */

  var ValidationElement = BaseClass.extend({

    type: "ValidationElement",
    init: function(domElem) {

      if(!domElem || !domElem.length)
        throw "Missing Element";

      this.domElem = domElem;
      this.bindAll();
      this.name = this.domElem.attr('name') ||
                  this.domElem.attr('id') ||
                  guid();
      this.execution = null;

      if(domElem.data('verify'))
        return false;

      domElem.data('verify',this);
      return true;
    },

    equals: function(that) {
      var e1, e2;

      if( this.domElem )
        e1 = this.domElem;
      else
        return false;

      if( that.jquery )
        e2 = that;
      else if( that instanceof ValidationElement && that.domElem )
        e2 = that.domElem;

      if(e1 && e2)
        return e1.equals(e2);

      return false;
    }

  });

  /* ===================================== *
   * Field Wrapper
   * ===================================== */

  var ValidationField = ValidationElement.extend({

    //class variables
    type: "ValidationField",
    init: function(domElem, form) {

      this._super(domElem);

      //instance variables
      this.form = form;
      this.options = form.options;
      this.groups = form.groups;
      this.ruleNames = null;
      this.touched = false;
    },

    //for use with $(field).validate(callback);
    validate: function(callback) {
      if(!callback) callback = $.noop;

      var exec = new FieldExecution(this);

      exec.execute().done(function() {
        callback(true);
      }).fail(function() {
        callback(false);
      });
      return;
    },

    update: function() {
      this.rules = ruleManager.parseElement(this);

      //manage this field within shared groups
      for(var i = 0; i < this.rules.length; ++i) {
        var r = this.rules[i];
        //skip uninitialised and field rules
        if(!r.rule) continue;
        if(r.rule.type !== 'group') continue;
        //shared groups map
        if(!this.groups[r.name])
          this.groups[r.name] = {};
        //calculate scope
        var scope = r.scope || 'default';
        if(!this.groups[r.name][scope])
          this.groups[r.name][scope] = new TypedSet(ValidationField);
        //add self to group
        this.groups[r.name][scope].add(this);
      }

    },

    handleResult: function(exec) {

      var opts = this.options,
          reskinElem = opts.reskinContainer(this.domElem);

      if(!reskinElem || !reskinElem.length)
        return this.warn("No reskin element found. Check 'reskinContainer' option.");

      //handle first error
      // if(!exec.success &&
      //    exec.parent.type === 'FormExecution' &&
      //    !exec.parent.handledError) {
      //   exec.parent.handledError = true;
      //   this.scrollFocus(reskinElem);
      // }

      //show prompt
      if(opts.showPrompt)
        opts.prompt(reskinElem, exec.response);

      //toggle error classes
      var container = opts.errorContainer(reskinElem);
      if(container && container.length)
        container.toggleClass(opts.errorClass, !exec.success);

      //track event
      this.options.track(
        'Validate',
        [this.form.name,this.name].join(' '),
        exec.success ? 'Valid' : exec.response ? '"'+exec.response+'"' : 'Silent Fail'
      );
    },

    //listening for 'validate' event
    scrollFocus: function(reskinElem) {

      var callback = $.noop;
      if(this.options.focusFirstField)
        callback = function() {
          reskinElem.focus();
        };

      if (this.options.scroll)
        reskinElem.verifyScrollView(callback);
      else if(this.options.focusFirstField)
        field.focus();
    }

  });

  /* ===================================== *
   * Form Wrapper
   * ===================================== */

  ValidationForm = ValidationElement.extend({

    /* ===================================== *
     * Instance variables
     * ===================================== */
    type: "ValidationForm",

    init: function(domElem, options) {
      //sanity checks
      this._super(domElem);

      if(!domElem.is("form"))
        throw "Must be a form";

      this.options = new CustomOptions(options);

      this.fields = new TypedSet(ValidationField);
      this.groups = {};
      this.fieldByName = {};
      this.invalidFields = {};
      this.fieldHistory = {};
      this.submitResult = undefined;
      this.submitPending = false;
      this.cache = {
        ruleNames: {},
        ajax: { loading: {}, loaded: {} }
      };

      $(document).ready(this.domReady);
    },

    extendOptions: function(opts) {
      $.extend(true, this.options, opts);
    },

    domReady: function() {
      this.bindEvents();
      this.updateFields();
      this.log("bound to " + this.fields.size() + " elems");
    },

    bindEvents: function() {
      this.domElem
        .on("keyup.jqv", "input", this.onKeyup)
        .on("blur.jqv", "input[type=text]:not(.hasDatepicker),input:not([type].hasDatepicker),textarea", this.onValidate)
        .on("change.jqv", "input[type=text].hasDatepicker,select,[type=checkbox],[type=radio]", this.onValidate)
        .on("submit.jqv", this.onSubmit)
        .trigger("initialised.jqv");
    },

    unbindEvents: function() {
      this.domElem.off(".jqv");
    },

    updateFields: function() {
      var sel = "["+this.options.validateAttribute+"]";
      this.domElem.find(sel).each(this.updateField);
    },

    //creates new validation elements
    //adds them to the form
    updateField: function(i, domElem) {
      if(i.jquery !== undefined) domElem = i;
      if(domElem.jquery === undefined)
        domElem = $(domElem);

      var fieldSelector = "input:not([type=hidden]),select,textarea",
          field, fieldElem;

      if(!domElem.is(fieldSelector))
        return this.warn("Validators will not work on container elements ("+domElem.prop('tagName')+"). Please use INPUT, SELECT or TEXTAREA.");

      fieldElem = domElem;

      field = this.fields.find(fieldElem);

      if(!field) {
        field = new ValidationField(fieldElem, this);
        this.fields.add(field);
      }

      field.update();

      return field;
    },

    /* ===================================== *
     * Event Handlers
     * ===================================== */

    onSubmit: function(event) {

      var submitForm = false;

      if(this.submitPending)
        this.warn("pending...");

      //no result -> begin
      if(!this.submitPending &&
          this.submitResult === undefined) {

        this.submitPending = true;
        this.validate(this.doSubmit);

      //have result
      } else if (this.submitResult !== undefined) {
        submitForm = this.options.beforeSubmit.call(this.domElem, event, this.submitResult);
      }

      if(!submitForm) event.preventDefault();
      return submitForm;
    },

    doSubmit: function(success) {
      this.log('doSubmit', success);
      this.submitPending = false;
      this.submitResult = success;
      this.domElem.submit(); //trigger onSubmit, though with a result
      this.submitResult = undefined;
    },

    onKeyup: function(event) {
      if(this.options.hideErrorOnChange)
        this.options.prompt($(event.currentTarget), null);
    },

    //user triggered validate field event
    onValidate: function(event) {
      var domElem = $(event.currentTarget);
      var field = domElem.data('verify') || this.updateField(domElem);
      field.log("validate");
      field.validate($.noop);
    },

    /* ===================================== *
     * Validate Form
     * ===================================== */

    validate: function(callback) {
      if(!callback) callback = $.noop;

      this.updateFields();

      var exec = new FormExecution(this);

      exec.execute().done(function() {
        callback(true);
      }).fail(function() {
        callback(false);
      });
      return;
    }
  });

})();
// only exposing two classes
var FormExecution = null,
    FieldExecution = null;

//instantiated inside private scope
(function() {

  var STATUS = {
    NOT_STARTED: 0,
    RUNNING: 1,
    COMPLETE: 2
  };

  //super class
  //set in private scope
  var Execution = BaseClass.extend({

    type: "Execution",

    init: function(element, parent) {
      //corresponding <Form|Field>Element class

      this.element = element;
      if(element) {
        this.prevExec = element.execution;
        element.execution = this;
        this.options = this.element.options;
        this.domElem = element.domElem;
      }
      //parent Execution class
      this.parent = parent;
      this.name = '#'+guid();
      this.status = STATUS.NOT_STARTED;
      this.bindAll();

      //deferred object
      this.d = this.restrictDeferred();
      this.d.done(this.executePassed);
      this.d.fail(this.executeFailed);

    },

    isPending: function() {
      return this.prevExec && this.prevExec.status !== STATUS.COMPLETE;
    },

    toString: function() {
      return this._super() + "[" + this.element.name + (!this.rule ? "" : ":" + this.rule.name) + "] ";
    },

    //execute in sequence, stop on fail
    serialize: function(objs) {

      var fns = this.mapExecutables(objs);

      if(!$.isArray(fns) || fns.length === 0)
        return this.resolve();

      var pipeline = fns[0](),
          i = 1, l = fns.length;

      this.log("SERIALIZE", l);

      if(!pipeline || !pipeline.pipe)
        throw "Invalid Deferred Object";

      for(;i < l;i++)
        pipeline = pipeline.pipe(fns[i]);

      //link pipeline
      pipeline.done(this.resolve).fail(this.reject);

      return this.d.promise();
    },

    //execute all at once,
    parallelize: function(objs) {

      var fns = this.mapExecutables(objs);

      var _this = this,
          n = 0, i = 0, l = fns.length,
          rejected = false;

      this.log("PARALLELIZE", l);

      if(!$.isArray(fns) || l === 0)
        return this.resolve();

      function pass(response) {
        n++;
        if(n === l) _this.resolve(response);
      }

      function fail(response) {
        if(rejected) return;
        rejected = true;
        _this.reject(response);
      }

      //execute all at once
      for(; i<l; ++i ) {
        var dd = fns[i]();
        if(!dd || !dd.done || !dd.fail)
          throw "Invalid Deferred Object";
        dd.done(pass).fail(fail);
      }

      return this.d.promise();
    },

    mapExecutables: function(objs) {
      return $.map(objs, function(o) {
        if($.isFunction(o)) return o;
        if($.isFunction(o.execute)) return o.execute;
        throw "Invalid executable";
      });
    },

    linkPass: function(that) {
      that.d.done(this.resolve);
    },
    linkFail: function(that) {
      that.d.fail(this.reject);
    },
    link: function(that) {
      this.linkPass(that);
      this.linkFail(that);
    },

    execute: function() {

      var p = this.parent,
          ps = [];
      while(p) {
        ps.unshift(p.name);
        p = p.parent;
      }
      var gap = "(" + ps.join(' < ') + ")";

      this.log(this.parent ? gap : '', 'executing...');
      this.status = STATUS.RUNNING;
      if(this.domElem)
        this.domElem.triggerHandler("validating");

      return true;
    },

    executePassed: function(response) {
      this.success = true;
      this.response = this.filterResponse(response);
      this.executed();
    },
    executeFailed: function(response) {
      this.success = false;
      this.response = this.filterResponse(response);
      this.executed();
    },

    executed: function() {
      this.status = STATUS.COMPLETE;

      this.log((this.success ? 'Passed' : 'Failed') + ": " + this.response);

      if(this.domElem)
        this.domElem.triggerHandler("validated", this.success);
    },

    //resolves or rejects the execution's deferred object 'd'
    resolve: function(response) {
      return this.resolveOrReject(true, response);
    },
    reject: function(response) {
      return this.resolveOrReject(false, response);
    },
    resolveOrReject: function(success, response) {
      var fn = success ? '__resolve' : '__reject';
      if(!this.d || !this.d[fn]) throw "Invalid Deferred Object";
      this.nextTick(this.d[fn], [response], 0);
      return this.d.promise();
    },
    filterResponse: function(response) {
      if(typeof response === 'string')
        return response;
      return null;
    },
    restrictDeferred: function(d) {
      if(!d) d = $.Deferred();
      d.__reject = d.reject;
      d.__resolve = d.resolve;
      d.reject = d.resolve = function() {
        console.error("Use execution.resolve|reject()");
      };
      return d;
    }

  });

  //set in plugin scope
  FormExecution = Execution.extend({
    type: "FormExecution",

    init: function(form) {
      this._super(form);
      this.ajaxs = [];

      //prepare child executables
      this.children = this.element.fields.map($.proxy(function(f) {
        return new FieldExecution(f, this);
      }, this));
    },

    execute: function() {
      this._super();

      if(this.isPending()) {
        this.warn("pending... (waiting for %s)", this.prevExec.name);
        return this.reject();
      }

      this.log("exec fields #" + this.children.length);
      return this.parallelize(this.children);
    }

  });

  //set in plugin scope
  FieldExecution = Execution.extend({
    type: "FieldExecution",

    init: function(field, parent) {
      this._super(field, parent);
      if(parent instanceof FormExecution)
        this.formExecution = parent;
      field.touched = true;
      this.children = [];
    },

    execute: function() {
      this._super();

      if(this.isPending()) {
        this.warn("pending... (waiting for %s)", this.prevExec.name);
        return this.reject();
      }

      //execute rules
      var ruleParams = ruleManager.parseElement(this.element);

      //skip check
      this.skip = this.skipValidations(ruleParams);
      if(this.skip)
        return this.resolve();

      //ready
      this.children = $.map(ruleParams, $.proxy(function(r) {
        if(r.rule.type === 'group')
          return new GroupRuleExecution(r, this);
        else
          return new RuleExecution(r, this);
      }, this));

      // this.log("exec rules #%s", this.children.length);
      return this.serialize(this.children);
    },

    skipValidations: function(ruleParams) {

      //no rules
      if(ruleParams.length === 0) {
        this.log("skip (no validators)");
        return true;
      }

      //not required
      if(!ruleParams.required && !$.trim(this.domElem.val())) {
        this.warn("skip (not required)");
        return true;
      }

      //custom-form-elements.js hidden fields
      if(this.options.skipHiddenFields &&
         // this.options.reskinContainer(this.domElem).is(':hidden')) {
        this.options.reskinContainer(this.domElem).attr('type') == 'hidden') {
        this.log("skip (hidden)");
        return true;
      }

      //skip disabled
      if(this.options.skipDisabledFields &&
         this.domElem.is('[disabled]')) {
        this.log("skip (disabled)");
        return true;
      }

      return false;
    },

    executed: function() {
      this._super();

      //pass error to element
      var i, exec = this,
          children = this.children;
      for(i = 0; i < children.length; ++i)
        if(children[i].success === false) {
          exec = children[i];
          break;
        }
      this.element.handleResult(exec);
    }

  });

  //set in private scope
  var RuleExecution = Execution.extend({
    type: "RuleExecution",

    init: function(ruleParamObj, parent) {
      this._super(null, parent);

      this.rule = ruleParamObj.rule;
      this.args = ruleParamObj.args;
      this.element = this.parent.element;
      this.options = this.element.options;
      this.rObj = {};
    },

    //the function that gets called when
    //rules return or callback
    callback: function(response) {
      clearTimeout(this.t);
      this.callbackCount++;
      this.log(this.rule.name + " (cb:" + this.callbackCount + "): " + response);

      if(this.callbackCount > 1)
        return;

      if(response === undefined)
        this.warn("Undefined result");

      //success
      if(response === true)
        this.resolve(response);
      else
        this.reject(response);

    },

    timeout: function() {
      this.warn("timeout!");
      this.callback("Timeout");
    },

    execute: function() {
      this._super();
      this.callbackCount = 0;

      //sanity checks
      if(!this.element || !this.rule.ready) {
        this.warn(this.element ? 'not  ready.' : 'invalid parent.');
        return this.resolve();
      }

      this.t = setTimeout(this.timeout, 10000);
      this.r = this.rule.buildInterface(this);
      //finally execute validator

      var response;
      try {
        response = this.rule.fn(this.r);
      } catch(e) {
        response = true;
        console.error("Error caught in validation rule: '" + this.rule.name +
                      "', skipping.\nERROR: " + e.toString() + "\nSTACK:" + e.stack);
      }

      //used return statement
      if(response !== undefined)
        this.nextTick(this.callback, [response]);

      return this.d.promise();
    }

  });

  var GroupRuleExecution = RuleExecution.extend({

    type: "GroupRuleExecution",

    init: function(ruleParamObj, parent) {
      this._super(ruleParamObj, parent);
      this.groupName = ruleParamObj.name;
      this.id = ruleParamObj.id;
      this.scope = ruleParamObj.scope || 'default';
      this.group = this.element.groups[this.groupName][this.scope];
      if(!this.group)
        throw "Missing Group Set";
      if(this.group.size() === 1)
        this.warn("Group only has 1 field. Consider a field rule.");
    },

    execute: function() {

      var sharedExec = this.group.exec,
          parentExec = this.parent,
          originExec = parentExec && parentExec.parent,
          groupOrigin = originExec instanceof GroupRuleExecution,
          fieldOrigin = !originExec,
          formOrigin = originExec instanceof FormExecution,
          _this = this, i, j, field, exec, child,
          isMember = false;

      if(!sharedExec || sharedExec.status === STATUS.COMPLETE) {
        this.log("MASTER");
        this.members = [this];
        this.executeGroup = this._super;
        sharedExec = this.group.exec = this;

        if(formOrigin)
          sharedExec.linkFail(originExec);

      } else {

        this.members = sharedExec.members;
        for(i = 0; i < this.members.length; ++i)
          if(this.element === this.members[i].element)
            isMember = true;

        if(isMember) {
          //start a new execution - reject old
          this.log("ALREADY A MEMBER OF %s", sharedExec.name);
          this.reject();
          return;

        } else {
          this.log("SLAVE TO %s", sharedExec.name);
          this.members.push(this);
          this.link(sharedExec);
          if(this.parent) sharedExec.linkFail(this.parent);
        }
      }

      if(fieldOrigin)
      for(i = 0; i < this.group.size(); ++i) {
        field = this.group.get(i);

        if(this.element === field)
          continue;

        this.log("CHECK:", field.name);
        //let the user make their way onto
        // the field first - silent fail!
        if(!field.touched) {
          this.log("FIELD NOT READY: ", field.name);
          return this.reject();
        }

        exec = field.execution;
        //silent fail unfinished
        if(exec && exec.status !== STATUS.COMPLETE)
          exec.reject();

        this.log("STARTING ", field.name);
        exec = new FieldExecution(field, this);
        exec.execute();
      }

      var groupSize = this.group.size(),
          execSize = sharedExec.members.length;

      if(groupSize === execSize&&
         sharedExec.status === STATUS.NOT_STARTED) {
        sharedExec.log("RUN");
        sharedExec.executeGroup();
      } else {
        this.log("WAIT (" + execSize + "/" + groupSize + ")");
      }

      return this.d.promise();
    },

    filterResponse: function(response) {
      if(!response || !this.members.length)
        return this._super(response);

      var isObj = $.isPlainObject(response),
          isStr = (typeof response === 'string');

      if(isStr && this === this.group.exec) return response;
      if(isObj && response[this.id]) return response[this.id];

      return null;
    }

  });

})();
$.fn.validate = function(callback) {
  var validator = $(this).data('verify');
  if(validator)
    validator.validate(callback);
  else
    warn("element does not have verifyjs attached");
};

$.fn.validate.version = VERSION;

$.fn.verify = function(userOptions) {
  return this.each(function() {

    //get existing form class this element
    var form = $.verify.forms.find($(this));

    //unbind and destroy form
    if(userOptions === false || userOptions === "destroy") {
      if(form) {
        form.unbindEvents();
        $.verify.forms.remove(form);
      }
      return;
    }

    Utils.checkOptions(userOptions);
    if(form) {
      form.extendOptions(userOptions);
      form.updateFields();
    } else {
      form = new ValidationForm($(this), userOptions);
      $.verify.forms.add(form);
    }

  });
};

$.verify = function(options) {
  Utils.checkOptions(options);
  $.extend(globalOptions, options);
};

$.extend($.verify, {
  version: VERSION,
  updateRules: ruleManager.updateRules,
  addRules: ruleManager.addFieldRules,
  addFieldRules: ruleManager.addFieldRules,
  addGroupRules: ruleManager.addGroupRules,
  log: info,
  warn: warn,
  defaults: globalOptions,
  globals: globalOptions,
  utils: Utils,
  forms: new TypedSet(ValidationForm, [], "FormSet"),
  _hidden: {
    ruleManager: ruleManager
  }
});

/* ===================================== *
 * Auto attach on DOM ready
 * ===================================== */

$(function() {
  if(globalOptions.autoInit)
  $("form").filter(function() {
    return $(this).find("[" + globalOptions.validateAttribute + "]").length > 0;
  }).verify();
});



(function($) {

  if($.verify === undefined) {
    window.alert("Please include verify.js before each rule file");
    return;
  }

  $.verify.addFieldRules({
    /* Regex validators
     * - at plugin load, 'regex' will be transformed into validator function 'fn' which uses 'message'
     */
    currency: {
      regex: /^\-?\$?\d{1,2}(,?\d{3})*(\.\d+)?$/,
      message: "Invalid monetary value"
    },
    name: {
      regex: /^([a-zA-Z][a-zA-Z0-9]+([\s-_;.,])*[a-zA-Z0-9]+)$/,
      message: "Acest camp poate contine doar caractere alfanumerice, - si spatiu."
    },
    email: {
      regex: /^(([^<>()\[\]\\.,;:\s@\"]+(\.[^<>()\[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      message: "Adresa de mail invalida"
    },
    url: {
      regex: /^https?:\/\/[\-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[\-A-Za-z0-9+&@#\/%=~_|]/,
      message: "Invalid URL"
    },
    alphanumeric: {
      regex: /^[0-9A-Za-z]+$/,
      message: "Foloseste numai cifre si litere"
    },
    street_number: {
      regex: /^\d+[A-Za-z]?(-\d+)?[A-Za-z]?$/,
      message: "Street Number only"
    },
    number: {
      regex: /^\d+$/,
      message: "Foloseste numai cifre"
    },
    numberSpace: {
      regex: /^[\d\ ]+$/,
      message: "Foloseste numai cifre si spatii"
    },
    postcode: {
      regex: /^\d{4}$/,
      message: "Cod postal invalid"
    },
    date: {
      fn: function(r) {
        if($.verify.utils.parseDate(r.val()))
          return true;
        return r.message;
      },
      message: "Invalid date"
    },
    required: {

      fn: function(r) {
        return r.requiredField(r, r.field);
      },

      requiredField: function(r, field) {
        var v = field.val();

        switch (field.prop("type")) {
          case "radio":
          case "checkbox":
            var name = field.attr("name");
            var group = field.data('fieldGroup');

            if(!group) {
              group = r.form.find("input[name='" + name + "']");
              field.data('fieldGroup', group);
            }

            if (group.is(":checked"))
              break;

            if (group.size() === 1)
              return r.messages.single;

            return r.messages.multiple;

          default:
            if (! $.trim(v))
              return r.messages.all;
            break;
        }
        return true;
      },
      messages: {
        "all": "Acest camp este obligatoriu",
        "multiple": "Selecteaza o optiune",
        "single": "Acest camp este obligatoriu"
      }
    },
    regex: {
      fn: function(r) {
        var re;
        try {
          var str = r.args[0];
          re = new RegExp(str);
        } catch(error) {
          r.warn("Invalid regex: " + str);
          return true;
        }

        if(!r.val().match(re))
          return r.args[1] || r.message;
        return true;
      },
      message: "Invalid format"
    },
    //an alias
    pattern: {
      extend: 'regex'
    },
    asyncTest: function(r) {

      r.prompt(r.field, "Asteapta...");
      setTimeout(function() {
        r.callback();
      },2000);

    },
    phone: function(r) {
      r.val(r.val().replace(/\D/g,''));
      var v = r.val();
      if(!v.match(/^\+?[\d\s]+$/))
        return "Foloseste numai cifre si spatii";
      if(v.match(/^\+/))
        return true; //allow all international
      if(!v.match(/^0/))
        return "Numarul trebuie sa inceapa cu 0";
      if(v.replace(/\s/g,"").length !== 10)
        return "Trebuie sa contina 10 cifre";
      return true;
    },
    requiredIfVisible : function(r) {
        if(r.field.is(':visible') == false) {
            return true;
        }
        var v = r.val();
        return ($.trim(v).length > 0 ? true : 'Acest camp este obligatoriu');
    },

    sumaCredit: function(r) {
      suma = $.trim(r.val());
      if ( suma < 300 || suma > 22000 ) {
        return 'Oferta valabila pentru finantari intre 300 si 22.000 lei.';
      }
    },

    credexCheck: function(r){

      var msg = null;
      var eligibil = true
      var dateObj = new Date();
      prag_angajat = 700;
      prag_pensionar = 400;

      luna = parseInt($('#altex_credex_vechime_luna').val());
      an = parseInt($('#altex_credex_vechime_an').val());
      statut = $('#altex_credex_statut').val();
      venit = $('#altex_credex_venit').val();
      $('#alert-credex').hide();

      if(isNaN(venit) === false && typeof luna != 'undefined' && luna > 0 && an >= 1950 && statut && parseInt(venit) >= 0)
      {
        vechime = (dateObj.getUTCMonth() + 1 + 12 * dateObj.getUTCFullYear()) - (luna + 12 * an);

        if(statut == 'Angajat' && (vechime < 3 || venit < prag_angajat))
        {
          eligibil = false;
        }

        if(statut == 'Pensionar' && venit < prag_pensionar)
        {
          eligibil = false;
        }

        if(statut == 'PFA' && (vechime < 12 || venit < prag_angajat))
        {
          eligibil = false;
        }

        if(statut == 'Altele')
        {
          eligibil = false;
        }

        if(!eligibil)
        {
          msg = "Ne pare rau, dar momentan nu indepliniti conditiile de eligibilitate pentru finantarea produselor prin credit online. Va invitam sa finalizati comanda online alegand o alta modalitate de plata! Va multumim";
        }
      }

      if(msg)
      {
        $('#alert-credex').children().html(msg)
        $('#alert-credex').show();
      }
      return true;

    },

    requiredIfPaymentMethodIsCredex : function(r) {
      if(r.field.is(':visible') == false) {
          return true;
      }
      var cnp_value = $.trim(r.val());
      var i=0 , year=0 , hashResult=0 , cnp=[] , hashTable=[2,7,9,1,4,6,3,5,8,2,7,9];
      if( cnp_value.length !== 13 ) { return 'CNP-ul nu este valid'; }
      for( i=0 ; i<13 ; i++ ) {
        cnp[i] = parseInt( cnp_value.charAt(i) , 10 );
        if( isNaN( cnp[i] ) ) { return 'CNP-ul nu este valid'; }
        if( i < 12 ) { hashResult = hashResult + ( cnp[i] * hashTable[i] ); }
      }
      hashResult = hashResult % 11;
      if( hashResult === 10 ) { hashResult = 1; }
      year = (cnp[1]*10)+cnp[2];
      switch( cnp[0] ) {
        case 1  : case 2 : { year += 1900; } break;
        case 3  : case 4 : { year += 1800; } break;
        case 5  : case 6 : { year += 2000; } break;
        case 7  : case 8 : case 9 : { year += 2000; if( year > ( parseInt( new Date().getYear() , 10 ) - 14 ) ) { year -= 100; } } break;
        default : { return 'CNP-ul nu este valid'; }
      }
      if( year < 1800 || year > 2099 ) { return 'CNP-ul nu este valid'; }


      return (  cnp[12] === hashResult ? true : 'CNP-ul nu este valid');
    },
    cif: function(r){
        var v = r.val();
        var prefix = "";
        if (v.toUpperCase().indexOf("RO") == 0) {
            console.log("index");
            prefix = "RO";
            v = v.replace(/ro\s*/i, "");
            console.log(v);
          }

        if (v.length > 10)
            return "CIF invalid";

        var regex = /^([0-9]{1,9})([0-9])$/;
        var patt = new RegExp(regex);
        var matches = patt.exec(v);
        if(!matches)
            return "CIF invalid";

        var code = matches[1];
        var crc = matches[2];

        v = v.split("").reverse().join("").substr(1);
        var tk = "753217532".split("").reverse().join("");
        var s = 0;
        for (var i = 0; i < v.length; i++)
          s += v.charAt(i) * tk.charAt(i);
        var c = s * 10 % 11;
        if (!(c < 10))
          c = 0;

        if (crc != c) {
          return "CIF invalid";
        }

        return true;
    },
    size: function(r){
      var v = r.val(), exactOrLower = r.args[0], upper = r.args[1];
      if(exactOrLower !== undefined && upper === undefined) {
        var exact = parseInt(exactOrLower, 10);
        if(r.val().length !== exact)
          return  "Trebuie sa fie "+exact+" caractere";
      } else if(exactOrLower !== undefined && upper !== undefined) {
        var lower = parseInt(exactOrLower, 10);
        upper = parseInt(upper, 10);
        if(v.length < lower || upper < v.length)
          return "Trebuie sa fie intre "+lower+" si "+upper+" caractere";
      } else {
        r.warn("size validator parameter error on field: " + r.field.attr('name'));
      }

      return true;
    },
    min: function(r) {
      var v = r.val(), min = parseInt(r.args[0], 10);
      if(v.length < min)
        return "Trebuie sa aibe cel putin " + min + " caractere";
      return true;
    },
    max: function(r) {
      var v = r.val(), max = parseInt(r.args[0], 10);
      if(v.length > max)
        return "Trebuie sa aibe cel mult " + max + " caractere";
      return true;
    },
    decimal: function(r) {
      var vStr = r.val(),
          places = r.args[0] ? parseInt(r.args[0], 10) : 2;

      if(!vStr.match(/^\d+(,\d{3})*(\.\d+)?$/))
        return "Invalid decimal value";

      var v = parseFloat(vStr.replace(/[^\d\.]/g,'')),
          factor = Math.pow(10,places);

      v = (Math.round(v*factor)/factor);
      r.field.val(v);

      return true;
    },
    minVal: function(r) {
      var v = parseFloat(r.val().replace(/[^\d\.]/g,'')),
          suffix = r.args[1] || '',
          min = parseFloat(r.args[0]);
      if(v < min)
        return "Trebuie sa fie mai mare decat " + min + suffix;
      return true;
    },
    maxVal: function(r) {
      var v = parseFloat(r.val().replace(/[^\d\.]/g,'')),
          suffix = r.args[1] || '',
          max = parseFloat(r.args[0]);
      if(v > max)
        return "Trebuie sa fie mai mic decat " + max + suffix;
      return true;
    },
    rangeVal: function(r) {
      var v = parseFloat(r.val().replace(/[^\d\.]/g,'')),
          prefix = r.args[2] || '',
          suffix = r.args[3] || '',
          min = parseFloat(r.args[0]),
          max = parseFloat(r.args[1]);
      if(v > max || v < min)
        return "Must be between " + prefix + min + suffix + "\nand " + prefix + max + suffix;
      return true;
    },

    agreement: function(r){
      if(!r.field.is(":checked"))
        return "Trebuie sa accepti pentru a continua";
      return true;
    },
    minAge: function(r){
      var age = parseInt(r.args[0],10);
      if(!age || isNaN(age)) {
        console.log("WARNING: Invalid Age Param: " + age);
        return true;
      }
      var currDate = new Date();
      var minDate = new Date();
      minDate.setFullYear(minDate.getFullYear() - age);
      var fieldDate = $.verify.utils.parseDate(r.val());

      if(fieldDate === "Invalid Date")
        return "Invalid Date";
      if(fieldDate > minDate)
        return "You must be at least " + age;
      return true;
    }
  });

  // Group validation rules
  $.verify.addGroupRules({

    dateRange: function(r) {
      var start = r.field("start"),
          end = r.field("end");

      if(start.length === 0 || end.length === 0) {
        r.warn("Missing dateRange fields, skipping...");
        return true;
      }

      var startDate = $.verify.utils.parseDate(start.val());
      if(!startDate)
        return "Invalid Start Date";

      var endDate = $.verify.utils.parseDate(end.val());
      if(!endDate)
        return "Invalid End Date";

      if(startDate >= endDate)
        return "Start Date must come before End Date";

      return true;
    },

    requiredAll: {
      extend: 'required',
      fn: function(r) {

        var size = r.fields().length,
            message,
            passes = [], fails = [];

        r.fields().each(function(i, field) {
          message = r.requiredField(r, field);
          if(message === true)
            passes.push(field);
          else
            fails.push({ field: field, message:message });
        });

        if(passes.length > 0 && fails.length > 0) {
          $.each(fails, function(i, f) {
            r.prompt(f.field, f.message);
          });
          return false;
        }

        return true;
      }
    }

  });

})(jQuery);
}(window,document));

},{}],12:[function(require,module,exports){
var global = require('core/global');
if(loadModules instanceof Object) {
    var loaded = [];
    /** LOAD ALL REQUIRED MODULES ***/
    for (name in loadModules) {
        try {
            var options = loadModules[name];
            if(loaded.indexOf(name) == -1) {
                var modLoaded = require('local' + '/' + name);
                loaded.push(modLoaded);
                if(modLoaded.hasOwnProperty('init')) {
                    modLoaded.init(options);
                }
            }
        } catch (err){
            console.log('Code :' + err.code);
            console.log('Message :' + err.message);
        }
    }
    /*** RUN ALL FOUND MODULES ***/
    loaded.forEach(function(module){
        if(module.hasOwnProperty('run')) {
            module.run();
        }
    });
    /*** ALL PAGES FUNCTIONALITY ***/
    require('core/toggle');
}


},{"core/global":"core/global","core/toggle":"core/toggle"}],13:[function(require,module,exports){
module.exports = function(abstract) {
    var abstract = abstract || {};
    var template = {
        _template : '<a class="Header-infoLink Header-infoLink--hello" href="<%= url %>"><%= message %></a>',
        _placeholder : '.js-container-auth',
        _defaultData : {url : GLOBAL.getUrl('customer/account/create'), message : 'Nelogat'}
    };
    $.extend(template, abstract);
    return template;
}(require('core/template'));

},{"core/template":"core/template"}],14:[function(require,module,exports){
module.exports = function(abstract){
    var abstract = abstract || {};
    var template = {
        _template : '<a href="#cont" class="Header-contLink"> <span class="Header-contNume">Contul meu</span></a>'
                    +'<div class="Header-contWindow js-Header-contWindow">'
                    +'<div class="Header-contWindow-loggedIn">'
                    +'<ul>'
                    +'<% _.each(links,function(item){ %>'
                    +'<li class="Header-contWindow-loggedIn"><a class="Header-contWindowTrigger" href="<%= item.link %>"><%= item.text %></a></li>'
                    +'<% }) %>'
                    +'</ul>'
                    +'</div>'
                    +'</div>',
        _placeholder : '#js-Header-cont',
        _defaultData : { message : 'Contul meu'}
    };
    $.extend(template, abstract);
    return template;
}(require('core/template'));

},{"core/template":"core/template"}],15:[function(require,module,exports){
module.exports = function(abstract){
    var abstract = abstract || {};
    var template = {
        _template : '<div class="Header-contWindow-loggedIn">'
                    +'<ul>'
                    +'<% _.each(links, function(item){ %>'
                    +'<li class="Header-contWindowItem">'
                    +'<a href="<%= item.link %>" class="Header-contWindowTrigger"><%= item.text %></a>'
                    +'</li>'
                    +'<% }) %>'
                    +'</ul>'
                    +'</div>',
        _placeholder : '#js-Header-cont-mobile',
        _defaultData : { links : []}
    };
    $.extend(template, abstract);
    return template;
}(require('core/template'));

},{"core/template":"core/template"}],16:[function(require,module,exports){
module.exports = function(abstract) {
    var abstract = abstract || {};
    var template = {
        _template : ''+
        '<div id="js-container-bugreport" class="ui newsletterModal small modal">' +
            '<i class="close icon">X</i>' +
            '<div class="header">' +
                '<div class="u-marginTop--0 ProdusPage-header u-borderNone u-padding--0">' +
                    '<h1>Raporteaza o problema</h1>' +
                '</div>' +
            '</div>' +
            '<form id="js-bugreport-form" action="" method="post">'+
            '<div class="content">' +
            '			<label for="bugreport_name">Nume</label>' +
            '			<input type="text" id="bugreport_name" name="bugreport_name" data-validate="required,name">' +
            '			<div class="Alert Alert-validate">' +
            '				<div class="Alert-inner Alert--small Alert--error"></div>' +
            '			</div>' +
            '			<label for="bugreport_email">Adresa email</label>' +
            '			<input type="email" id="bugreport_email" name="bugreport_email" data-validate="required,email">' +
            '			<div class="Alert Alert-validate">' +
            '				<div class="Alert-inner Alert--small Alert--error"></div>' +
            '			</div>' +
            '			<label for="bugreport_message">Detalii despre problema</label>' +
            '			<textarea id="bugreport_message" name="bugreport_message" data-validate="required"></textarea>' +
            '			<div class="Alert Alert-validate">' +
            '				<div class="Alert-inner Alert--small Alert--error"></div>' +
            '			</div>' +
            '</div>' +
            '<div class="actions">' +
            '	<a href="#" id="bugreport-form-submit" class="Button Button-primary u-margin--0">Trimite</a>' +
            '</div>' +
        '</form>' +
        '</div>',
        _placeholder : ['#js-container-bugreport'],
        _pushToBody : true,
        _data : {  }
    };

    var resulted = {};
    $.extend(resulted, abstract, template);
    return resulted;
}(require('core/template'));
},{"core/template":"core/template"}],17:[function(require,module,exports){
module.exports = function(abstract) {
    var abstract = abstract || {};
    var template = {
        _template : null,
        _placeholder : ['#js-book-form-modal'],
        _pushToBody : true,
        _data : { idErp : null }
    };

    var resulted = {};
    $.extend(resulted, abstract, template);
    return resulted;
}(require('core/template'));

},{"core/template":"core/template"}],18:[function(require,module,exports){
module.exports = function(abstract) {
    var abstract = abstract || {};
    var template = {
        _template : null,
        _placeholder : ['#js-book-modal .Rezerva-magazine'],
        _data : { stores : {} }
    };

    var resulted = {};
    $.extend(resulted, abstract, template);
    return resulted;
}(require('core/template'));

},{"core/template":"core/template"}],19:[function(require,module,exports){
module.exports = function(abstract) {
    var abstract = abstract || {};
    var template = {
        _template : null,
        _placeholder : ['#js-book-modal'],
        _pushToBody : true,
        _data : { regions : {} ,  product : null }
    };

    var resulted = {};
    $.extend(resulted, abstract, template);
    return resulted;
}(require('core/template'));

},{"core/template":"core/template"}],20:[function(require,module,exports){
module.exports = function(abstract) {
    var abstract = abstract || {};
    var template = {
        _template : '<% if(_.keys(list).length > 0) { %>'
                   +'<div class="Compare" id="js-compare-placeholder">'
                   +'<div class="Compare-title js-showCompare">Compara produse (<%= _.keys(list).length %>)</div>'
                   +'<div class="Compare-list">'
                   +'<ul class="Compare-products">'
                   +'<% _.each(_.keys(list), function(key){ %>'
                   +'<li class="Compare-product">'
                   +'<img class="Compare-productImage" src="<%= list[key].img %>" alt="<%= list[key].name %>" width="35" height="35" />'
                   +'<a class="Compare-productTitle" href="<%= list[key].href %>"><%= list[key].name %></a>'
                   +'<div class="Compare-productRemove"  rel="<%= key %>" >x</div>'
                   +'</li>'
                   +'<% }); %>'
                   +'</ul>'
                   +'<div class="u-padding--5">'
                   +'<button class="Button Button--block Button--small Button-primary">Compara</button>'
                   +'</div>'
                   +'</div>'
                   +'</div>'
                   +'<% } %>',
        _placeholder : ['#js-compare-placeholder'],
        _data : { list : {} ,  as : 0 }
    };

    $.extend(template, abstract);
    template._pushToBody = true;
    return template;
}(require('core/template'));

},{"core/template":"core/template"}],21:[function(require,module,exports){
module.exports = function(abstract) {
    var abstract = abstract || {};
    var template = {
        _template : '' +
            '<div id="js-gift-modal" class="ui adaugaCadouriModal small modal">' +
                '<i class="close icon">X</i>' +
                '<div class="header">' +
                    '<div class="u-marginTop--0 ProdusPage-header u-borderNone u-padding--0">' +
                        '<h1>Alege un cadou</h1>' +
                    '</div>' +
                '</div>' +
                '<div class="content">' +
                    '<div class="Produs u-textAlignCenter">' +
                        '<input value="<%= productWithGift.giftOptions %>" type="hidden" name="gift_options" />' +
                        '<div class="Produs-photoWrapper">' +
                            '<a href="<%= productWithGift.url %>" title="<%= productWithGift.title %>" class="Produs-photoTrigger">' +
                                '<img src="<%= productWithGift.image %>" width="180" height="180" alt="<%= productWithGift.title %>" />' +
                                '<% if (originalPrice.discountDisplay) { %>' +
                                    '<div class="Reducere2"><%= (originalPrice.int - price.int) %></div>' +
                                '<% } %>' +
                            '</a>' +
                        '</div>' +
                    '</div>' +

                    '<div class="Price <% if (originalPrice.discountDisplay) { %>Price--discount<% } %>">' +
                        '<div class="Price-current">' +
                            '<span class="Price-int"><%= price.int %></span>' +
                            '<sup class="Price-dec">,<%= price.decimal %></sup>' +
                            '<span class="Price-currency"><%= price.currency %></span>' +
                        '</div>' +
                        '<% if (originalPrice.discountDisplay) { %>' +
                        '<div class="Price-old">' +
                                '<%= originalPrice.int %>,<% originalPrice.decimal %>' +
                        '</div>' +
                        '<% } %>' +
                    '</div>' +

                    '<% if ( productWithGift.stockStatus ) { %>' +
                    '<div class="Status">' +
                        '<div class="Status-stoc"><%= productWithGift.stockStatus %></div>' +
                    '</div>' +
                    '<% } %>'+

                    '<div class="Produs-description">' +
                        '<h4 class="Produs-nameHeading">' +
                            '<a href="<%= productWithGift.url %>" title="<%= productWithGift.title %>">' +
                                '<%= productWithGift.name %>' +
                            '</a>' +
                        '</h4>' +
                    '</div>' +
                '</div>' +

                '<% if(_.keys(giftsList).length > 0) { %>' +
                    '<div class="Cadouri u-dMargin--20">' +
                        '<h1 class="ProductGrid-heading">Cadouri:</h1>' +
                        '<ul class="Cadouri-list">' +
                        '<% _.each(_.keys(giftsList), function(key){ %>' +
                            '<li class="Cadouri-cadou">' +
                            '<% if(productWithGift.giftOptions == "2"){ %>' +
                                '<% var checked = true; %>' +
                                '<a href="<%= giftsList[key].url %>" title="<%= giftsList[key].title %>" target="_blank" class="Cadouri-produsImg">' +
                                    '<img src="<%= giftsList[key].img %>" width="80" height="80" alt="<%= giftsList[key].title %>" />' +
                                '</a>' +
                                '<h3 class="Cadouri-produsName">' +
                                    '<a class="u-bodyColorLink" href="<%= giftsList[key].url %>" target="_blank" title="<%= giftsList[key].title %>">' +
                                        '<%= giftsList[key].name %>' +
                                    '</a>' +
                                '</h3>' +
                                '<div class="Cadouri-check">' +
                                    '<input id="<%= productWithGift.id + giftsList[key].id %>" type="radio" name="gift_product" value="<%= giftsList[key].id %>" ' +
            '<% if(checked) { %> checked="checked" <% } %>' +
            '<% checked = false; %> class="radio icheck"/>' +
                                    '<label for="<%= productWithGift.id + giftsList[key].id %>" class="icheck-label iradio"><span>Alege</span></label>' +
                                '</div>' +
                            '<% } else { %>' +
                                '<a href="<%= giftsList[key].url %>" title="<%= giftsList[key].title %>" target="_blank" class="Cadouri-produsImg">' +
                                    '<img src="<%= giftsList[key].img %>" width="80" height="80" alt="<%= giftsList[key].title %>" />' +
                                '</a>' +
                                '<h3 class="Cadouri-produsName">' +
                                    '<a class="u-bodyColorLink" href="<%= giftsList[key].url %>" target="_blank" title="<%= giftsList[key].title %>">' +
                                        '<%= giftsList[key].name %>' +
                                    '</a>' +
                                '</h3>' +
                                '<div class="Cadouri-check">' +
                                    '<input class="checkbox icheck" id="<%= productWithGift.id + giftsList[key].id %>" type="checkbox" name="gift_products[]" value="<%= giftsList[key].id %>" checked="checked" />' +
                                    '<label for="<%= productWithGift.id + giftsList[key].id %>" class="icheck-label iradio"><span>Alege</span></label>' +
                                '</div>' +
                            '<% } %>' +
                            '</li>' +
                        '<% }); %>' +
                    '</ul>' +
                '</div>' +
                '<% } %>' +
                '<div class="actions">' +
/*
                    '<button class="Button u-margin--0 u-floatLeft js-closeModal" tabindex="-1">' +
                        'Inapoi la cumparaturi' +
                    '</button>' +
*/
                    '<button title="Adauga in cos" class="Button Button-primary Button-adaugaInCos Button-adaugaInCos--red js-trigger-cart-add-gift-modal" tabindex="-1">' +
                        'Adauga in cos' +
                    '</button>' +
                '</div>' +
            '</div>',
        _placeholder : ['#js-gift-modal'],
        _pushToBody : true,
        _data : { giftsList : {} , productWithGift : {}, price : {}, originalPrice : {} }
    };
    var resulted = {};
    $.extend(resulted, abstract, template);
    return resulted;
}(require('core/template'));
},{"core/template":"core/template"}],22:[function(require,module,exports){
module.exports = function(abstract) {
    var abstract = abstract || {};
    var template = {
        _template : ''+
        '<div id="js-gift-modal" class="ui adaugaModal small modal">' +
            '<i class="close icon">X</i>' +
                '<div class="header">' +
                    '<div class="u-marginTop--0 ProdusPage-header u-borderNone u-padding--0">' +
                        '<h1>Produsele au fost adaugate in cos</h1>' +
                    '</div>' +
                '</div>' +
                '<div class="content">' +
                    '<% _.each(products, function(product){ %>' +
                    '<div class="Grid">' +
                        '<div class="Grid-cols--3">' +
                            '<img src="<%= product.img %>" alt="">' +
                        '</div>' +
                        '<div class="Grid-cols--9">' +
                            '<h3><%= product.name %></h3>' +
                            '<div class="ProdusPage-sku">COD PRODUS: <%= product.sku %></div>' +
                        '</div>' +
                    '</div>' +
                    '<% }) %>' +
                '</div>' +
                '<div class="actions">' +
                    '<button class="Button u-margin--0 u-floatLeft js-closeModal">Inapoi la cumparaturi</button>' +
                    '<a href="<%= checkoutUrl %>" class="Button Button-primary  u-margin--0">Vezi cosul</a>' +
                '</div>' +
        '</div>',
        _placeholder : ['#js-gift-modal'],
        _pushToBody : true,
        _data : {  }
    };

    var resulted = {};
    $.extend(resulted, abstract, template);
    return resulted;
}(require('core/template'));
},{"core/template":"core/template"}],23:[function(require,module,exports){
module.exports = function(abstract) {
    var abstract = abstract || {};
    var template = {
        _template : ''+
        '<div id="js-add-to-cart-modal" class="ui adaugaModal small modal">' +
            '<i class="close icon">X</i>' +
                '<div class="header">' +
                    '<div class="u-marginTop--0 ProdusPage-header u-borderNone u-padding--0">' +
                        '<h1>Produsul a fost adaugat in cos</h1>' +
                    '</div>' +
                '</div>' +
                '<div class="content">' +
                    '<% _.each(products, function(product){ %>' +
                    '<div class="Grid">' +
                        '<div class="Grid-cols--3">' +
                            '<img src="<%= product.img %>" alt="">' +
                        '</div>' +
                        '<div class="Grid-cols--9">' +
                            '<h3><%= product.name %></h3>' +
                            '<div class="ProdusPage-sku">COD PRODUS: <%= product.sku %></div>' +
                        '</div>' +
                    '</div>' +
                    '<% }) %>' +
                '</div>' +
                '<div class="actions">' +
                    '<button class="Button u-margin--0 u-floatLeft js-closeModal">Inapoi la cumparaturi</button>' +
                    '<a href="<%= checkoutUrl %>" class="Button Button-primary  u-margin--0">Vezi cosul</a>' +
                '</div>' +
        '</div>',
        _placeholder : ['#js-add-to-cart-modal'],
        _pushToBody : true,
        _data : {  }
    };

    var resulted = {};
    $.extend(resulted, abstract, template);
    return resulted;
}(require('core/template'));
},{"core/template":"core/template"}],24:[function(require,module,exports){
/**
 * Created by emanuel on 12.06.2015.
 */
module.exports = function(abstract) {
    var abstract = abstract || {};
    var template = {
        _template : '' +
            '<% _.each(questions, function(question){ %>' +
            '<li class="Review-item">' +
                '<div class="Review-header">' +
                    '<div class="Review-headerColumn">' +
                        '<span class="Review-name"><%= question["nickname"] %></span>' +
                        ' <span class="Review-date">acum <%= question["created_at"] %></span>' +
                    '</div>' +
                    '<div class="Review-headerColumn">' +
                        '<div class="Review-votes">' +
                        //    '<%= question["title"] %>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
                '<div class="Review-content">' +
                    '<p><%= question["details"] %></p>' +
                '</div>' +
                '<div class="Review-footer">' +
                    '<div class="Review-headerColumn">' +
                        '<% if(question["answers"]){ %>' +
                            '<button class="Review-button u-underline u-marginRight--10 js-trigger-view-comments">' +
                                '<% if(question["answers"].length == 1){ %>Un raspuns<% } else { %><%= question["answers"].length %> raspunsuri<% } %>' +
                            '</button>'+
                        '<% } %>' +
                        '<button class="Review-button u-underline js-trigger-add-comment">' +
                            'Adauga un raspuns' +
                        '</button>' +
                    '</div>' +
                '</div>' +
                '<div class="Comment">' +
                    '<% if(question["answers"]){ %>' +
                        '<ul class="Comment-list">' +
                            '<% _.each(question["answers"], function(answer){ %>' +
                                '<li class="Comment-item">' +
                                    '<div class="Comment-header">' +
                                        '<div class="Comment-headerColumn">' +
                                            '<div class="Comment-name">' +
                                                '<%= answer["nickname"] %>' +
                                            '</div>' +
                                            '<div class="Comment-date">' +
                                                'acum <%= answer["created_at"] %>' +
                                            '</div>' +
                                        '</div>' +
                                    '</div>' +
                                    '<div class="Comment-content">' +
                                        '<p>' +
                                            '<%= answer["details"] %>' +
                                        '</p>' +
                                    '</div>' +
                                '</li>' +
                            '<% }) %>' +
                        '</ul>' +
                    '<% } %>' +
                    '<div class="Comment-form">' +
                        '<h4 class="Comment-formTitle">' +
                            'Adauga un raspuns' +
                        '</h4>' +
                        '<form action="<%= reviewsURL %>" method="post">' +
                            '<input type="hidden" name="id" value="<%= question[\'id\'] %>">' +
                            '<input type="text" name="nickname" value="" placeholder="Nickname">' +
                            '<textarea name="details" rows="10" class="Comment-formText" placeholder="Raspuns"></textarea>' +
                            '<button class="Button Button--block Button-primary js-trigger-send-question-answer">' +
                                'Trimite' +
                            '</button>' +
                        '</form>' +
                    '</div>' +
                '</div>' +
            '</li>' +
            '<% }) %>',
        _placeholder : ['#js-questions-more ul.Review-list'],
        _pushToElem : true,
        _data : { questions : {}, reviewsURL : {} }
    };

    var resulted = {};
    $.extend(resulted, abstract, template);
    return resulted;
}(require('core/template'));
},{"core/template":"core/template"}],25:[function(require,module,exports){
module.exports = function(abstract) {
    var abstract = abstract || {};
    var template = {
        _template :   '<% if(cookieData.length > 0) { %>'
                    + '<div class="ProductGrid">'
                    +   '<h2 class="ProductGrid-heading">Produse vizualizate recent</h1>'
                    +   '<ul class="ProductGrid-list ProductGrid-5to2 js-recentlyViewedList">'
                    +     '<% _.each(cookieData,function(produs){ %>'
                    +       '<li class="ProductGrid-item">'
                    +         '<div class="Produs ">'
                    +           '<div class="Produs-photoWrapper">'
                    +             '<a href="<%= produs.url %>" class="Produs-photoTrigger">'
                    +               '<img src="<%= produs.img %>" width="150" height="150" alt="<%= produs.name %>" class="Produs-photo"/>'
                    +             '</a>'
                    +           '</div>'
                    +           '<div class="Produs-listRightColumn">'
                    +             '<div class="Produs-description">'
                    +               '<h4 class="Produs-nameHeading">'
                    +                 '<a href="<%= produs.url %>" class="Produs-name">'
                    +                   '<% if(produs.res == 1) { %>'
                    +                      '<span class="u-textUppercase u-color--red u-bold">Produs resigilat: </span>'
                    +                   '<% } %>'
                    +                   '<%= produs.name %>'
                    +                 '</a>'
                    +               '</h4>'
                    +             '</div>'
                    +             '<div class="Produs-rating Produs-rating--<%= produs.rating %>">'
                    +               '<a href="<%= produs.url %>#reviews" class="Produs-ratingNr">'
                    +                 ' <%= produs.recenzii %> <%= (produs.recenzii == "1") ? "recenzie" : "recenzii" %>'
                    +               '</a>'
                    +             '</div>'
                    +           '</div>'
                    +         '</div>'
                    +       '</li>'
                    +     '<% }) %>'
                    +   '</ul>'
                    + '</div>'
                    + '<% } %>',
        _placeholder : '#vazute-recent'
    };

    $.extend(template, abstract);
    return template;
}(require('core/template'));

},{"core/template":"core/template"}],26:[function(require,module,exports){
/**
 * Created by emanuel on 12.06.2015.
 */
module.exports = function(abstract) {
    var abstract = abstract || {};
    var template = {
        _template : '' +
            '<% _.each(reviews, function(review){ %>' +
            '<li class="Review-item">' +
                '<div class="Review-header">' +
                    '<div class="Review-headerColumn">' +
                        '<span class="Review-name"><%= review["title"] %></span>' +
                        ' <span class="Review-date">acum <%= review["created_at"] %></span>' +
                    '</div>' +
                '</div>' +
                '<div class="Review-content">' +
                    '<p><%= review["details"] %></p>' +
                '</div>' +
            '</li>' +
            '<% }) %>',
        _placeholder : ['#js-reviews-more ul.Review-list'],
        _pushToElem : true,
        _data : { reviews : {}, reviewsURL : {} }
    };

    var resulted = {};
    $.extend(resulted, abstract, template);
    return resulted;
}(require('core/template'));
},{"core/template":"core/template"}],27:[function(require,module,exports){
module.exports = function(abstract) {
    var abstract = abstract || {};
    var template = {
        _template : ''+
        '<div id="js-container-stockalert" class="ui newsletterModal small modal">' +
            '<i class="close icon">X</i>' +
            '<div class="header">' +
                '<div class="u-marginTop--0 ProdusPage-header u-borderNone u-padding--0">' +
                    '<h1>Abonare alerta stoc</h1>' +
                '</div>' +
            '</div>' +
            '<form id="js-stockalert-form" action="<%= formUrl %>" method="post">'+
            '<div class="content">' +
            'Aboneaza-te pentru a fi notificat cand produsul <strong><%= productName %></strong> reintra in stoc.'+
            '<br /><br />' +
            // '	<div class="Grid">' +
            // '		<div class="Grid-cols--6 u-paddingLeft--15">' +
            '			<label for="register_email">Adresa email</label>' +
            '			<input type="email" id="register_email" name="register_email" data-validate="required,email">' +
            '			<div class="Alert Alert-validate">' +
            '				<div class="Alert-inner Alert--small Alert--error"></div>' +
            '			</div>' +
            // '		</div>' +
            // '	</div>' +
            '</div>' +
            '<div class="actions">' +
            '	<a href="#" id="stockalert-form-submit" class="Button Button-primary u-margin--0">Aboneaza-ma</a>' +
            '</div>' +
        '</form>' +
        '</div>',
        _placeholder : ['#js-container-stockalert'],
        _pushToBody : true,
        _data : {  }
    };

    var resulted = {};
    $.extend(resulted, abstract, template);
    return resulted;
}(require('core/template'));
},{"core/template":"core/template"}],28:[function(require,module,exports){
module.exports = function(abstract) {
    var abstract = abstract || {};
    var template = {
        _template : ''+
        '<div id="js-address-edit-mode-unsaved-container" class="ui newsletterModal small modal">' +
            '<i class="close icon">X</i>' +
            '<div class="header">' +
                '<div class="u-marginTop--0 ProdusPage-header u-borderNone u-padding--0">' +
                    '<h1>Adresa nu a fost salvata</h1>' +
                '</div>' +
            '</div>' +
            '<form id="js-newsletter-form" action="" method="post">'+
            '<div class="content">' +
            '   <div class="Alert"><div class="Alert-inner Alert--error u-displayBlock">Adresa nu a fost salvata. Doriti sa continuati cu adresa selectata sau sa salvati modificarile?</div></div>' +
            '</div>' +
            '<div class="actions">' +
            '   <button class="Button u-margin--0 u-floatLeft js-closeModal">Vrau sa salvez adresa</button>' +
            '	<a href="#" id="newslettter-form-submit" class="Button Button-primary  u-margin--0">Nu vreau sa salvez adresa</a>' +
            '</div>' +
        '</form>' +
        '</div>',
        _placeholder : ['#js-address-edit-mode-unsaved-container'],
        _pushToBody : true,
        _data : {  }
    };

    var resulted = {};
    $.extend(resulted, abstract, template);
    return resulted;
}(require('core/template'));

},{"core/template":"core/template"}],29:[function(require,module,exports){
module.exports = function(abstract) {
    var abstract = abstract || {};
    var template = {
        _template : ''+
        '<div id="js-container-rates-form" class="ui newsletterModal small modal">' +
            '<i class="close icon">X</i>' +
            '<div class="header">' +
                '<div class="u-marginTop--0 ProdusPage-header u-borderNone u-padding--0">' +
                    '<h1>Aplica acum</h1>' +
                '</div>' +
            '</div>' +
            '<form id="js-rates-form" action="" method="post">'+
            '<div class="content">' +
            '	<div class="Grid">' +
            '		<div class="Grid-cols--6 u-paddingLeft--5">' +
            '			<label for="register_email">Prenume</label>' +
            '			<input type="text" id="rates_name_first" name="rates_name_first" data-validate="required,name">' +
            '			<div class="Alert Alert-validate">' +
            '				<div class="Alert-inner Alert--small Alert--error"></div>' +
            '			</div>' +
            '		</div>' +
            '		<div class="Grid-cols--6 u-paddingLeft--5">' +
            '			<label for="register_email">Nume</label>' +
            '			<input type="text" id="rates_name_last" name="rates_name_last" data-validate="required,name">' +
            '			<div class="Alert Alert-validate">' +
            '				<div class="Alert-inner Alert--small Alert--error"></div>' +
            '			</div>' +
            '		</div>' +
            '	</div>' +
            '	<div class="Grid">' +
            '		<div class="Grid-cols--6 u-paddingLeft--5">' +
            '			<label for="register_email">Telefon</label>' +
            '			<input type="text" id="rates_phone" name="rates_phone" data-validate="required,number,size(10)">' +
            '			<div class="Alert Alert-validate">' +
            '				<div class="Alert-inner Alert--small Alert--error"></div>' +
            '			</div>' +
            '		</div>' +
            '		<div class="Grid-cols--6 u-paddingLeft--5">' +
            '			<label for="register_email">Email</label>' +
            '			<input type="email" id="rates_email" name="rates_email" data-validate="required,email">' +
            '			<div class="Alert Alert-validate">' +
            '				<div class="Alert-inner Alert--small Alert--error"></div>' +
            '			</div>' +
            '		</div>' +
            '	</div>' +
            '	<div class="Grid">' +
            '		<div class="Grid-cols--6 u-paddingLeft--5">' +
            '			<label for="register_email">CNP</label>' +
            '			<input type="text" id="rates_cnp" name="rates_cnp" data-validate="required,requiredIfPaymentMethodIsCredex">' +
            '			<div class="Alert Alert-validate">' +
            '				<div class="Alert-inner Alert--small Alert--error"></div>' +
            '			</div>' +
            '		</div>' +
            '	</div>' +
            '       <input name="rates_acord" id="rates_acord" checked="checked" type="checkbox" class="icheck required-entry" data-validate="required" value="1" />' +
            '			<label for="rates_acord" class="icheck-label icheckbox"><small>Sunt de acord cu verificarea CNP-ului in Biroul de Credit. <a style="color:#d71440; font-weight:bold;" target="_blank" href="/acord-prelucrare-date-cu-caracter-personal">Vezi detalii.</a><small></label>' +
            '			<div class="Alert Alert-validate">' +
            '				<div class="Alert-inner Alert--small Alert--error"></div>' +
            '			</div>' +
            '</div>' +
            '<div class="actions">' +
            '	<a href="#" id="rates-form-submit" class="Button Button-primary u-margin--0">Aplica acum!</a>' +
            '</div>' +
            '</form>' +
        '</div>',
        _placeholder : ['#js-container-rates-form'],
        _pushToBody : true,
        _data : {  }
    };

    var resulted = {};
    $.extend(resulted, abstract, template);
    return resulted;
}(require('core/template'));
},{"core/template":"core/template"}],30:[function(require,module,exports){
module.exports = function(abstract) {
    var abstract = abstract || {};
    var template = {
        _template : ''+
        '<div id="js-container-rates" class="ui newsletterModal small modal">' +
            '<i class="close icon">X</i>' +
            '<div class="header">' +
                '<div class="u-marginTop--0 ProdusPage-header u-borderNone u-padding--0">' +
                    '<h1>Calculeaza-ti rata online</h1>' +
                '</div>' +
            '</div>' +
            '<form id="js-newsletter-form" action="" method="post">'+
            '<div class="content">' +
            '   <input type="hidden" id="rates_amount" name="rates_amount" data-validate="required" value="<%=productValue%>">' +
            '   <input type="hidden" id="product_sku" name="product_sku" value="<%=productSku%>">'+
            '   <input type="hidden" id="product_name" name="product_name" value="<%=productName%>">'+

            '	<div class="Grid">' +
            '		<div class="Grid-cols--6 u-paddingRight--15">' +
            '           <h2>Valoare produs: </h2>' +
            '       </div>' +
            '       <div class="Grid-cols--6">' +
            '          <div class="Price ">' +
            '              <div class="Price-current">' +
            '                   <span class="Price-int"><%=productValue%></span>' +
            '                   <sup class="Price-dec">,90</sup>' +
            '                   <span class="Price-currency">lei</span>' +
            '               </div>' +
            '           </div>' +
            '       </div>' +
            '   </div>' +
            '   <div class="Grid u-marginBottom--10">' +
            '       <div class="Grid-cols--6 u-paddingRight--15">' +
            '           <h2>Numar de rate:</h2>' +
            '       </div>' +
            '       <div class="Grid-cols--3">' +
            '           <select name="rates_period" id="rates_period" class="chosen-select"  data-validate="required" title="">' +
                            '<option value="60">60</option>'+
                            '<option value="48">48</option>'+
                            '<option value="36">36</option>'+
                            '<option value="24">24</option>'+
                            '<option value="12">12</option>'+
            '           </select>'+
            '           <div class="Alert Alert-validate">' +
            '               <div class="Alert-inner Alert--small Alert--error"></div>' +
            '           </div>' +
            '       </div>' +
            '   </div>' +
            '   <div class="Grid" id="rate_display">'+
            '       <div class="Grid-cols--6 u-paddingRight--15">' +
            '           <h2>Rata lunara: </h2>' +
            '       </div>' +
            '       <div class="Grid-cols--6">' +
            '          <div class="Price ">' +
            '              <div class="Price-current">' +
            '                   <span class="Price-int" id="rate_value">1.800</span>' +
            '                   <sup class="Price-dec">,00</sup>' +
            '                   <span class="Price-currency">lei</span>' +
            '              </div>' +
            '          </div>' +
            '       </div>' +
            '   </div>' +
            '</div>' +
            '<div class="actions">' +
                '<button onclick="location.href=\'/solutii-de-finantare/credit-online/\';" class="js-trigger-rates-calc Button u-margin--0 u-floatLeft js-closeModal" tabindex="1">' +
                    'Vezi detalii' +
                '</button>' +
                '<button title="Adauga in cos" class="js-trigger-rates-apply Button Button-primary u-margin--0" tabindex="-1">' +
                    'Aplica acum' +
                '</button>' +
            '</div>' +

        '</form>' +
        '</div>',
        _placeholder : ['#js-container-rates'],
        _pushToBody : true,
        _data : {  }
    };

    var resulted = {};
    $.extend(resulted, abstract, template);
    return resulted;
}(require('core/template'));
},{"core/template":"core/template"}],31:[function(require,module,exports){
module.exports = function(abstract) {
    var abstract = abstract || {};
    var template = {
        _template : '<div class="ui  dimmer" id="js-ajax-placeholder">'
                    +'<div class="ui text large loader">'
                    +'<% if(null == msg) { %> Va rugam asteptati... <% } else { %> <%= msg %> <% } %>'
                    +'</div>'
                    +'</div>',
        _placeholder : ['#js-ajax-placeholder'],
        _data : { msg : null }
    };
    $.extend(template, abstract);
    template._pushToBody = true;
    return template;
}(require('core/template'));

},{"core/template":"core/template"}],32:[function(require,module,exports){
module.exports = function(abstract) {
    var abstract = abstract || {};
    var template = {
        _template : '<% if(items.length > 0) { %>'
                   +'<a class="Header-infoLink Header-infoLink--checkout" href="<%= url %>">Finalizeaza comanda</a>'
                   +'<% } %>',
        _placeholder : '.js-container-finalizeaza',
        _data : {url : GLOBAL.getUrl('checkout/onepage')}
    };
    $.extend(template, abstract);
    return template;
}(require('core/template'));

},{"core/template":"core/template"}],33:[function(require,module,exports){
module.exports = function(abstract){
    var abstract = abstract || {};
    var template = {
        _template :'<% if (placeholderName == "browser") { %>'
                   +'<a href="#" class="Header-cosLink js-header-cos-toggle <% if(products.length > 0) { print %>is-withProducts<% } %>">'
                   +'<div class="Header-cosTitle">Cosul meu</div>'
                   +'<% if(products.length > 0) { %>'
                   +'<div class="Header-cosQty"> <%= cartQty %> </div>'
                   +'<% } %>'
                   +'</a>'
                   +'<div class="Header-cosWindow">'
                   +'<% } %>'
                   +'<div class="Header-cosWindow-<% if(products.length == 0) { print %>without<% } else { %>with<% } %>" >'
                   +'<% if(products.length == 0) { %>'
                   +'Nu ai produse in cos.'
                   +'<% } else { %>'
                   +'<ul class="Header-cosWindowList">'
                   +'<% _.each(products, function(item){ %>'
                   +'<li class="Header-cosWindowItem">'
                   +'<a href="<%= item.href %>" class="Header-cosWindow-productImage"><img width="50" height="50" alt="<%= item.title %>" src="<%= item.img %>" /></a>'
                   +'<div class="Header-cosWindow-productDetail">'
                   +'<div class="Header-cosWindow-productName"><a href="<%= item.href %>"><%= item.title %></a></div>'
                   +'<div class="Header-cosWindow-productQty"> <%= item.qty %> buc.</div>'
                   +'</div>'
                   +'<button class="Button Button--small Header-cosWindow-productRemove js-trigger-cart-remove" rel="<%= item.id %>">X</button>'
                   +'</li>'
                   +'<% }) %>'
                   +'</ul>'
                   +'<div class="u-padding--10 u-borderTopSolid"><a href="<%= cartUrl %>" class="Button Button--block Button-primary u-margin--0">Vezi cosul</a></div>'
                   +'<% } %>'
                   +'</div>'
                   +'<% if (placeholderName == "browser") { %>'
                   +'</div>'
                   +'<% } %>',
        _placeholder : {browser :'#js-Header-cos', mobile :'#js-Header-cos-mobile'},
        _data : { products : []},
    };
    $.extend(template, abstract);
    return template;
}(require('core/template'));

},{"core/template":"core/template"}],34:[function(require,module,exports){
module.exports = function(abstract) {
    var abstract = abstract || {};
    var template = {
        _template : ''+
        '<div id="js-container-newsletter" class="ui newsletterModal small modal">' +
            '<i class="close icon">X</i>' +
            '<div class="header">' +
                '<div class="u-marginTop--0 ProdusPage-header u-borderNone u-padding--0">' +
                    '<h1>Aboneaza-te la newsletter</h1>' +
                '</div>' +
            '</div>' +
            '<form id="js-newsletter-form" action="" method="post">'+
            '<div class="content">' +
            // '	<div class="Grid">' +
            // '		<div class="Grid-cols--6 u-paddingLeft--15">' +
            '			<label for="register_email">Adresa email</label>' +
            '			<input type="email" id="register_email" name="register_email" data-validate="required,email">' +
            '			<div class="Alert Alert-validate">' +
            '				<div class="Alert-inner Alert--small Alert--error"></div>' +
            '			</div>' +
            // '		</div>' +
            // '	</div>' +
            '</div>' +
            '<div class="actions">' +
            '	<a href="#" id="newslettter-form-submit" class="Button Button-primary u-margin--0">Aboneaza-ma</a>' +
            '</div>' +
        '</form>' +
        '</div>',
        _placeholder : ['#js-container-newsletter'],
        _pushToBody : true,
        _data : {  }
    };

    var resulted = {};
    $.extend(resulted, abstract, template);
    return resulted;
}(require('core/template'));
},{"core/template":"core/template"}],35:[function(require,module,exports){
module.exports = function(abstract) {
    var abstract = abstract || {};
    var template = {
        _template : '' +
            '<div id="js-gift-modal" class="ui adaugaCadouriModal small modal">' +
                '<i class="close icon">X</i>' +
                '<div class="header">' +
                    '<div class="u-marginTop--0 ProdusPage-header u-borderNone u-padding--0">' +
                        '<h1>Alege un cadou</h1>' +
                    '</div>' +
                '</div>' +
                '<div class="content">' +
                    '<% if(_.keys(prodsList).length > 0) { %>' +
                        '<input value="<%= pack.giftOptions %>" type="hidden" name="gift_options" />' +
                        '<% _.each(_.keys(prodsList), function(key){ %>' +
                            '<div class="Grid">' +
                                '<div class="Grid-cols--3">' +
                                    '<img src="<%= prodsList[key].img %>" width="100" height="100" alt="<%= prodsList[key].title %>" />' +
                                '</div>' +
                                '<div class="Grid-cols--9">' +
                                    '<h3><%= prodsList[key].name %></h3>' +
                                    '<div class="ProdusPage-sku">COD PRODUS: <%= prodsList[key].sku %></div>' +
                                '</div>' +
                            '</div>' +
                        '<% }); %>' +
                    '<% } %>' +
                '</div>' +

                '<% if(_.keys(giftsList).length > 0) { %>' +
                    '<div class="Cadouri u-dMargin--20">' +
                        '<h1 class="ProductGrid-heading">Cadouri:</h1>' +
                        '<ul class="Cadouri-list">' +
                        '<% _.each(_.keys(giftsList), function(key){ %>' +
                            '<li class="Cadouri-cadou">' +
                            '<% if(productWithGift.giftOptions == "2"){ %>' +
                                '<% var checked = true; %>' +
                                '<a href="<%= giftsList[key].url %>" title="<%= giftsList[key].title %>" target="_blank" class="Cadouri-produsImg">' +
                                    '<img src="<%= giftsList[key].img %>" width="80" height="80" alt="<%= giftsList[key].title %>" />' +
                                '</a>' +
                                '<h3 class="Cadouri-produsName">' +
                                    '<a class="u-bodyColorLink" href="<%= giftsList[key].url %>" target="_blank" title="<%= giftsList[key].title %>">' +
                                        '<%= giftsList[key].name %>' +
                                    '</a>' +
                                '</h3>' +
                                '<div class="Cadouri-check">' +
                                    '<input id="<%= productWithGift.id + giftsList[key].id %>" type="radio" name="gift_product" value="<%= giftsList[key].id %>" ' +
            '<% if(checked) { %> checked="checked" <% } %>' +
            '<% checked = false; %> class="radio icheck"/>' +
                                    '<label for="<%= productWithGift.id + giftsList[key].id %>" class="icheck-label iradio"><span>Alege</span></label>' +
                                '</div>' +
                            '<% } else { %>' +
                                '<a href="<%= giftsList[key].url %>" title="<%= giftsList[key].title %>" target="_blank" class="Cadouri-produsImg">' +
                                    '<img src="<%= giftsList[key].img %>" width="80" height="80" alt="<%= giftsList[key].title %>" />' +
                                '</a>' +
                                '<h3 class="Cadouri-produsName">' +
                                    '<a class="u-bodyColorLink" href="<%= giftsList[key].url %>" target="_blank" title="<%= giftsList[key].title %>">' +
                                        '<%= giftsList[key].name %>' +
                                    '</a>' +
                                '</h3>' +
                                '<div class="Cadouri-check">' +
                                    '<input class="checkbox icheck" id="<%= productWithGift.id + giftsList[key].id %>" type="checkbox" name="gift_products[]" value="<%= giftsList[key].id %>" checked="checked" />' +
                                    '<label for="<%= productWithGift.id + giftsList[key].id %>" class="icheck-label iradio"><span>Alege</span></label>' +
                                '</div>' +
                            '<% } %>' +
                            '</li>' +
                        '<% }); %>' +
                    '</ul>' +
                '</div>' +
                '<% } %>' +
                '<div class="actions">' +
/*
                    '<button class="Button u-margin--0 u-floatLeft js-closeModal" tabindex="-1">' +
                        'Inapoi la cumparaturi' +
                    '</button>' +
*/
                    '<button title="Adauga in cos" class="Button Button-primary Button-adaugaInCos Button-adaugaInCos--red js-trigger-cart-add-gift-modal" tabindex="-1">' +
                        'Adauga in cos' +
                    '</button>' +
                '</div>' +
            '</div>',
        _placeholder : ['#js-gift-modal'],
        _pushToBody : true,
        _data : { giftsList : {} , productWithGift : {}, prodsList : {}, pack : {} }
    };
    var resulted = {};
    $.extend(resulted, abstract, template);
    return resulted;
}(require('core/template'));
},{"core/template":"core/template"}],36:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      }
      throw TypeError('Uncaught, unspecified "error" event.');
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        len = arguments.length;
        args = new Array(len - 1);
        for (i = 1; i < len; i++)
          args[i - 1] = arguments[i];
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    len = arguments.length;
    args = new Array(len - 1);
    for (i = 1; i < len; i++)
      args[i - 1] = arguments[i];

    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    var m;
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.listenerCount = function(emitter, type) {
  var ret;
  if (!emitter._events || !emitter._events[type])
    ret = 0;
  else if (isFunction(emitter._events[type]))
    ret = 1;
  else
    ret = emitter._events[type].length;
  return ret;
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],37:[function(require,module,exports){
(function(g,f){"use strict";var h=function(e){if("object"!==typeof e.document)throw Error("Cookies.js requires a `window` with a `document` object");var b=function(a,d,c){return 1===arguments.length?b.get(a):b.set(a,d,c)};b._document=e.document;b._cacheKeyPrefix="cookey.";b._maxExpireDate=new Date("Fri, 31 Dec 9999 23:59:59 UTC");b.defaults={path:"/",secure:!1};b.get=function(a){b._cachedDocumentCookie!==b._document.cookie&&b._renewCache();return b._cache[b._cacheKeyPrefix+a]};b.set=function(a,d,c){c=b._getExtendedOptions(c); c.expires=b._getExpiresDate(d===f?-1:c.expires);b._document.cookie=b._generateCookieString(a,d,c);return b};b.expire=function(a,d){return b.set(a,f,d)};b._getExtendedOptions=function(a){return{path:a&&a.path||b.defaults.path,domain:a&&a.domain||b.defaults.domain,expires:a&&a.expires||b.defaults.expires,secure:a&&a.secure!==f?a.secure:b.defaults.secure}};b._isValidDate=function(a){return"[object Date]"===Object.prototype.toString.call(a)&&!isNaN(a.getTime())};b._getExpiresDate=function(a,d){d=d||new Date; "number"===typeof a?a=Infinity===a?b._maxExpireDate:new Date(d.getTime()+1E3*a):"string"===typeof a&&(a=new Date(a));if(a&&!b._isValidDate(a))throw Error("`expires` parameter cannot be converted to a valid Date instance");return a};b._generateCookieString=function(a,b,c){a=a.replace(/[^#$&+\^`|]/g,encodeURIComponent);a=a.replace(/\(/g,"%28").replace(/\)/g,"%29");b=(b+"").replace(/[^!#$&-+\--:<-\[\]-~]/g,encodeURIComponent);c=c||{};a=a+"="+b+(c.path?";path="+c.path:"");a+=c.domain?";domain="+c.domain: "";a+=c.expires?";expires="+c.expires.toUTCString():"";return a+=c.secure?";secure":""};b._getCacheFromString=function(a){var d={};a=a?a.split("; "):[];for(var c=0;c<a.length;c++){var e=b._getKeyValuePairFromCookieString(a[c]);d[b._cacheKeyPrefix+e.key]===f&&(d[b._cacheKeyPrefix+e.key]=e.value)}return d};b._getKeyValuePairFromCookieString=function(a){var b=a.indexOf("="),b=0>b?a.length:b;return{key:decodeURIComponent(a.substr(0,b)),value:decodeURIComponent(a.substr(b+1))}};b._renewCache=function(){b._cache= b._getCacheFromString(b._document.cookie);b._cachedDocumentCookie=b._document.cookie};b._areEnabled=function(){var a="1"===b.set("cookies.js",1).get("cookies.js");b.expire("cookies.js");return a};b.enabled=b._areEnabled();return b},e="object"===typeof g.document?h(g):h;"function"===typeof define&&define.amd?define(function(){return e}):"object"===typeof exports?("object"===typeof module&&"object"===typeof module.exports&&(exports=module.exports=e),exports.Cookies=e):g.Cookies=e})("undefined"===typeof window? this:window);
},{}],38:[function(require,module,exports){
/*!
 * jQuery JavaScript Library v1.9.1
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2005, 2012 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-2-4
 */
(function( window, undefined ) {

// Can't do this because several apps including ASP.NET trace
// the stack via arguments.caller.callee and Firefox dies if
// you try to trace through "use strict" call chains. (#13335)
// Support: Firefox 18+
//"use strict";
var
	// The deferred used on DOM ready
	readyList,

	// A central reference to the root jQuery(document)
	rootjQuery,

	// Support: IE<9
	// For `typeof node.method` instead of `node.method !== undefined`
	core_strundefined = typeof undefined,

	// Use the correct document accordingly with window argument (sandbox)
	document = window.document,
	location = window.location,

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$,

	// [[Class]] -> type pairs
	class2type = {},

	// List of deleted data cache ids, so we can reuse them
	core_deletedIds = [],

	core_version = "1.9.1",

	// Save a reference to some core methods
	core_concat = core_deletedIds.concat,
	core_push = core_deletedIds.push,
	core_slice = core_deletedIds.slice,
	core_indexOf = core_deletedIds.indexOf,
	core_toString = class2type.toString,
	core_hasOwn = class2type.hasOwnProperty,
	core_trim = core_version.trim,

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		return new jQuery.fn.init( selector, context, rootjQuery );
	},

	// Used for matching numbers
	core_pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,

	// Used for splitting on whitespace
	core_rnotwhite = /\S+/g,

	// Make sure we trim BOM and NBSP (here's looking at you, Safari 5.0 and IE)
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	rquickExpr = /^(?:(<[\w\W]+>)[^>]*|#([\w-]*))$/,

	// Match a standalone tag
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,

	// JSON RegExp
	rvalidchars = /^[\],:{}\s]*$/,
	rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,
	rvalidescape = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
	rvalidtokens = /"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([\da-z])/gi,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	},

	// The ready event handler
	completed = function( event ) {

		// readyState === "complete" is good enough for us to call the dom ready in oldIE
		if ( document.addEventListener || event.type === "load" || document.readyState === "complete" ) {
			detach();
			jQuery.ready();
		}
	},
	// Clean-up method for dom ready events
	detach = function() {
		if ( document.addEventListener ) {
			document.removeEventListener( "DOMContentLoaded", completed, false );
			window.removeEventListener( "load", completed, false );

		} else {
			document.detachEvent( "onreadystatechange", completed );
			window.detachEvent( "onload", completed );
		}
	};

jQuery.fn = jQuery.prototype = {
	// The current version of jQuery being used
	jquery: core_version,

	constructor: jQuery,
	init: function( selector, context, rootjQuery ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					context = context instanceof jQuery ? context[0] : context;

					// scripts is true for back-compat
					jQuery.merge( this, jQuery.parseHTML(
						match[1],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[1] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {
							// Properties of context are called as methods if possible
							if ( jQuery.isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[2] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( elem.id !== match[2] ) {
							return rootjQuery.find( selector );
						}

						// Otherwise, we inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || rootjQuery ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return rootjQuery.ready( selector );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	},

	// Start with an empty selector
	selector: "",

	// The default length of a jQuery object is 0
	length: 0,

	// The number of elements contained in the matched element set
	size: function() {
		return this.length;
	},

	toArray: function() {
		return core_slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num == null ?

			// Return a 'clean' array
			this.toArray() :

			// Return just the object
			( num < 0 ? this[ this.length + num ] : this[ num ] );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;
		ret.context = this.context;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	ready: function( fn ) {
		// Add the callback
		jQuery.ready.promise().done( fn );

		return this;
	},

	slice: function() {
		return this.pushStack( core_slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[j] ] : [] );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},

	end: function() {
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: core_push,
	sort: [].sort,
	splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
	var src, copyIsArray, copy, name, options, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	noConflict: function( deep ) {
		if ( window.$ === jQuery ) {
			window.$ = _$;
		}

		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	},

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
		if ( !document.body ) {
			return setTimeout( jQuery.ready );
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );

		// Trigger any bound ready events
		if ( jQuery.fn.trigger ) {
			jQuery( document ).trigger("ready").off("ready");
		}
	},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray || function( obj ) {
		return jQuery.type(obj) === "array";
	},

	isWindow: function( obj ) {
		return obj != null && obj == obj.window;
	},

	isNumeric: function( obj ) {
		return !isNaN( parseFloat(obj) ) && isFinite( obj );
	},

	type: function( obj ) {
		if ( obj == null ) {
			return String( obj );
		}
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ core_toString.call(obj) ] || "object" :
			typeof obj;
	},

	isPlainObject: function( obj ) {
		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		try {
			// Not own constructor property must be Object
			if ( obj.constructor &&
				!core_hasOwn.call(obj, "constructor") &&
				!core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
				return false;
			}
		} catch ( e ) {
			// IE8,9 Will throw exceptions on certain host objects #9897
			return false;
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.

		var key;
		for ( key in obj ) {}

		return key === undefined || core_hasOwn.call( obj, key );
	},

	isEmptyObject: function( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	},

	error: function( msg ) {
		throw new Error( msg );
	},

	// data: string of html
	// context (optional): If specified, the fragment will be created in this context, defaults to document
	// keepScripts (optional): If true, will include scripts passed in the html string
	parseHTML: function( data, context, keepScripts ) {
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		if ( typeof context === "boolean" ) {
			keepScripts = context;
			context = false;
		}
		context = context || document;

		var parsed = rsingleTag.exec( data ),
			scripts = !keepScripts && [];

		// Single tag
		if ( parsed ) {
			return [ context.createElement( parsed[1] ) ];
		}

		parsed = jQuery.buildFragment( [ data ], context, scripts );
		if ( scripts ) {
			jQuery( scripts ).remove();
		}
		return jQuery.merge( [], parsed.childNodes );
	},

	parseJSON: function( data ) {
		// Attempt to parse using the native JSON parser first
		if ( window.JSON && window.JSON.parse ) {
			return window.JSON.parse( data );
		}

		if ( data === null ) {
			return data;
		}

		if ( typeof data === "string" ) {

			// Make sure leading/trailing whitespace is removed (IE can't handle it)
			data = jQuery.trim( data );

			if ( data ) {
				// Make sure the incoming data is actual JSON
				// Logic borrowed from http://json.org/json2.js
				if ( rvalidchars.test( data.replace( rvalidescape, "@" )
					.replace( rvalidtokens, "]" )
					.replace( rvalidbraces, "")) ) {

					return ( new Function( "return " + data ) )();
				}
			}
		}

		jQuery.error( "Invalid JSON: " + data );
	},

	// Cross-browser xml parsing
	parseXML: function( data ) {
		var xml, tmp;
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		try {
			if ( window.DOMParser ) { // Standard
				tmp = new DOMParser();
				xml = tmp.parseFromString( data , "text/xml" );
			} else { // IE
				xml = new ActiveXObject( "Microsoft.XMLDOM" );
				xml.async = "false";
				xml.loadXML( data );
			}
		} catch( e ) {
			xml = undefined;
		}
		if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
			jQuery.error( "Invalid XML: " + data );
		}
		return xml;
	},

	noop: function() {},

	// Evaluates a script in a global context
	// Workarounds based on findings by Jim Driscoll
	// http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
	globalEval: function( data ) {
		if ( data && jQuery.trim( data ) ) {
			// We use execScript on Internet Explorer
			// We use an anonymous function so that context is window
			// rather than jQuery in Firefox
			( window.execScript || function( data ) {
				window[ "eval" ].call( window, data );
			} )( data );
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	},

	// args is for internal usage only
	each: function( obj, callback, args ) {
		var value,
			i = 0,
			length = obj.length,
			isArray = isArraylike( obj );

		if ( args ) {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			}
		}

		return obj;
	},

	// Use native String.trim function wherever possible
	trim: core_trim && !core_trim.call("\uFEFF\xA0") ?
		function( text ) {
			return text == null ?
				"" :
				core_trim.call( text );
		} :

		// Otherwise use our own trimming functionality
		function( text ) {
			return text == null ?
				"" :
				( text + "" ).replace( rtrim, "" );
		},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArraylike( Object(arr) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				core_push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		var len;

		if ( arr ) {
			if ( core_indexOf ) {
				return core_indexOf.call( arr, elem, i );
			}

			len = arr.length;
			i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

			for ( ; i < len; i++ ) {
				// Skip accessing in sparse arrays
				if ( i in arr && arr[ i ] === elem ) {
					return i;
				}
			}
		}

		return -1;
	},

	merge: function( first, second ) {
		var l = second.length,
			i = first.length,
			j = 0;

		if ( typeof l === "number" ) {
			for ( ; j < l; j++ ) {
				first[ i++ ] = second[ j ];
			}
		} else {
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, inv ) {
		var retVal,
			ret = [],
			i = 0,
			length = elems.length;
		inv = !!inv;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			retVal = !!callback( elems[ i ], i );
			if ( inv !== retVal ) {
				ret.push( elems[ i ] );
			}
		}

		return ret;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var value,
			i = 0,
			length = elems.length,
			isArray = isArraylike( elems ),
			ret = [];

		// Go through the array, translating each of the items to their
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}
		}

		// Flatten any nested arrays
		return core_concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		var args, proxy, tmp;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		args = core_slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context || this, args.concat( core_slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	// Multifunctional method to get and set values of a collection
	// The value/s can optionally be executed if it's a function
	access: function( elems, fn, key, value, chainable, emptyGet, raw ) {
		var i = 0,
			length = elems.length,
			bulk = key == null;

		// Sets many values
		if ( jQuery.type( key ) === "object" ) {
			chainable = true;
			for ( i in key ) {
				jQuery.access( elems, fn, i, key[i], true, emptyGet, raw );
			}

		// Sets one value
		} else if ( value !== undefined ) {
			chainable = true;

			if ( !jQuery.isFunction( value ) ) {
				raw = true;
			}

			if ( bulk ) {
				// Bulk operations run against the entire set
				if ( raw ) {
					fn.call( elems, value );
					fn = null;

				// ...except when executing function values
				} else {
					bulk = fn;
					fn = function( elem, key, value ) {
						return bulk.call( jQuery( elem ), value );
					};
				}
			}

			if ( fn ) {
				for ( ; i < length; i++ ) {
					fn( elems[i], key, raw ? value : value.call( elems[i], i, fn( elems[i], key ) ) );
				}
			}
		}

		return chainable ?
			elems :

			// Gets
			bulk ?
				fn.call( elems ) :
				length ? fn( elems[0], key ) : emptyGet;
	},

	now: function() {
		return ( new Date() ).getTime();
	}
});

jQuery.ready.promise = function( obj ) {
	if ( !readyList ) {

		readyList = jQuery.Deferred();

		// Catch cases where $(document).ready() is called after the browser event has already occurred.
		// we once tried to use readyState "interactive" here, but it caused issues like the one
		// discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			setTimeout( jQuery.ready );

		// Standards-based browsers support DOMContentLoaded
		} else if ( document.addEventListener ) {
			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", completed, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", completed, false );

		// If IE event model is used
		} else {
			// Ensure firing before onload, maybe late but safe also for iframes
			document.attachEvent( "onreadystatechange", completed );

			// A fallback to window.onload, that will always work
			window.attachEvent( "onload", completed );

			// If IE and not a frame
			// continually check to see if the document is ready
			var top = false;

			try {
				top = window.frameElement == null && document.documentElement;
			} catch(e) {}

			if ( top && top.doScroll ) {
				(function doScrollCheck() {
					if ( !jQuery.isReady ) {

						try {
							// Use the trick by Diego Perini
							// http://javascript.nwbox.com/IEContentLoaded/
							top.doScroll("left");
						} catch(e) {
							return setTimeout( doScrollCheck, 50 );
						}

						// detach all dom ready events
						detach();

						// and execute any waiting functions
						jQuery.ready();
					}
				})();
			}
		}
	}
	return readyList.promise( obj );
};

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

function isArraylike( obj ) {
	var length = obj.length,
		type = jQuery.type( obj );

	if ( jQuery.isWindow( obj ) ) {
		return false;
	}

	if ( obj.nodeType === 1 && length ) {
		return true;
	}

	return type === "array" || type !== "function" &&
		( length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj );
}

// All jQuery objects should point back to these
rootjQuery = jQuery(document);
// String to Object options format cache
var optionsCache = {};

// Convert String-formatted options into Object-formatted ones and store in cache
function createOptions( options ) {
	var object = optionsCache[ options ] = {};
	jQuery.each( options.match( core_rnotwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	});
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		( optionsCache[ options ] || createOptions( options ) ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,
		// Last fire value (for non-forgettable lists)
		memory,
		// Flag to know if list was already fired
		fired,
		// End of the loop when firing
		firingLength,
		// Index of currently firing callback (modified by remove if needed)
		firingIndex,
		// First callback to fire (used internally by add and fireWith)
		firingStart,
		// Actual callback list
		list = [],
		// Stack of fire calls for repeatable lists
		stack = !options.once && [],
		// Fire callbacks
		fire = function( data ) {
			memory = options.memory && data;
			fired = true;
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingLength = list.length;
			firing = true;
			for ( ; list && firingIndex < firingLength; firingIndex++ ) {
				if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {
					memory = false; // To prevent further calls using add
					break;
				}
			}
			firing = false;
			if ( list ) {
				if ( stack ) {
					if ( stack.length ) {
						fire( stack.shift() );
					}
				} else if ( memory ) {
					list = [];
				} else {
					self.disable();
				}
			}
		},
		// Actual Callbacks object
		self = {
			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {
					// First, we save the current length
					var start = list.length;
					(function add( args ) {
						jQuery.each( args, function( _, arg ) {
							var type = jQuery.type( arg );
							if ( type === "function" ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && type !== "string" ) {
								// Inspect recursively
								add( arg );
							}
						});
					})( arguments );
					// Do we need to add the callbacks to the
					// current firing batch?
					if ( firing ) {
						firingLength = list.length;
					// With memory, if we're not firing then
					// we should call right away
					} else if ( memory ) {
						firingStart = start;
						fire( memory );
					}
				}
				return this;
			},
			// Remove a callback from the list
			remove: function() {
				if ( list ) {
					jQuery.each( arguments, function( _, arg ) {
						var index;
						while( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
							list.splice( index, 1 );
							// Handle firing indexes
							if ( firing ) {
								if ( index <= firingLength ) {
									firingLength--;
								}
								if ( index <= firingIndex ) {
									firingIndex--;
								}
							}
						}
					});
				}
				return this;
			},
			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ? jQuery.inArray( fn, list ) > -1 : !!( list && list.length );
			},
			// Remove all callbacks from the list
			empty: function() {
				list = [];
				return this;
			},
			// Have the list do nothing anymore
			disable: function() {
				list = stack = memory = undefined;
				return this;
			},
			// Is it disabled?
			disabled: function() {
				return !list;
			},
			// Lock the list in its current state
			lock: function() {
				stack = undefined;
				if ( !memory ) {
					self.disable();
				}
				return this;
			},
			// Is it locked?
			locked: function() {
				return !stack;
			},
			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				args = args || [];
				args = [ context, args.slice ? args.slice() : args ];
				if ( list && ( !fired || stack ) ) {
					if ( firing ) {
						stack.push( args );
					} else {
						fire( args );
					}
				}
				return this;
			},
			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},
			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};
jQuery.extend({

	Deferred: function( func ) {
		var tuples = [
				// action, add listener, listener list, final state
				[ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ],
				[ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ],
				[ "notify", "progress", jQuery.Callbacks("memory") ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				then: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;
					return jQuery.Deferred(function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {
							var action = tuple[ 0 ],
								fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];
							// deferred[ done | fail | progress ] for forwarding actions to newDefer
							deferred[ tuple[1] ](function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise()
										.done( newDefer.resolve )
										.fail( newDefer.reject )
										.progress( newDefer.notify );
								} else {
									newDefer[ action + "With" ]( this === promise ? newDefer.promise() : this, fn ? [ returned ] : arguments );
								}
							});
						});
						fns = null;
					}).promise();
				},
				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Keep pipe for back-compat
		promise.pipe = promise.then;

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 3 ];

			// promise[ done | fail | progress ] = list.add
			promise[ tuple[1] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(function() {
					// state = [ resolved | rejected ]
					state = stateString;

				// [ reject_list | resolve_list ].disable; progress_list.lock
				}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
			}

			// deferred[ resolve | reject | notify ]
			deferred[ tuple[0] ] = function() {
				deferred[ tuple[0] + "With" ]( this === deferred ? promise : this, arguments );
				return this;
			};
			deferred[ tuple[0] + "With" ] = list.fireWith;
		});

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( subordinate /* , ..., subordinateN */ ) {
		var i = 0,
			resolveValues = core_slice.call( arguments ),
			length = resolveValues.length,

			// the count of uncompleted subordinates
			remaining = length !== 1 || ( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

			// the master Deferred. If resolveValues consist of only a single Deferred, just use that.
			deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

			// Update function for both resolve and progress values
			updateFunc = function( i, contexts, values ) {
				return function( value ) {
					contexts[ i ] = this;
					values[ i ] = arguments.length > 1 ? core_slice.call( arguments ) : value;
					if( values === progressValues ) {
						deferred.notifyWith( contexts, values );
					} else if ( !( --remaining ) ) {
						deferred.resolveWith( contexts, values );
					}
				};
			},

			progressValues, progressContexts, resolveContexts;

		// add listeners to Deferred subordinates; treat others as resolved
		if ( length > 1 ) {
			progressValues = new Array( length );
			progressContexts = new Array( length );
			resolveContexts = new Array( length );
			for ( ; i < length; i++ ) {
				if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
					resolveValues[ i ].promise()
						.done( updateFunc( i, resolveContexts, resolveValues ) )
						.fail( deferred.reject )
						.progress( updateFunc( i, progressContexts, progressValues ) );
				} else {
					--remaining;
				}
			}
		}

		// if we're not waiting on anything, resolve the master
		if ( !remaining ) {
			deferred.resolveWith( resolveContexts, resolveValues );
		}

		return deferred.promise();
	}
});
jQuery.support = (function() {

	var support, all, a,
		input, select, fragment,
		opt, eventName, isSupported, i,
		div = document.createElement("div");

	// Setup
	div.setAttribute( "className", "t" );
	div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";

	// Support tests won't run in some limited or non-browser environments
	all = div.getElementsByTagName("*");
	a = div.getElementsByTagName("a")[ 0 ];
	if ( !all || !a || !all.length ) {
		return {};
	}

	// First batch of tests
	select = document.createElement("select");
	opt = select.appendChild( document.createElement("option") );
	input = div.getElementsByTagName("input")[ 0 ];

	a.style.cssText = "top:1px;float:left;opacity:.5";
	support = {
		// Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
		getSetAttribute: div.className !== "t",

		// IE strips leading whitespace when .innerHTML is used
		leadingWhitespace: div.firstChild.nodeType === 3,

		// Make sure that tbody elements aren't automatically inserted
		// IE will insert them into empty tables
		tbody: !div.getElementsByTagName("tbody").length,

		// Make sure that link elements get serialized correctly by innerHTML
		// This requires a wrapper element in IE
		htmlSerialize: !!div.getElementsByTagName("link").length,

		// Get the style information from getAttribute
		// (IE uses .cssText instead)
		style: /top/.test( a.getAttribute("style") ),

		// Make sure that URLs aren't manipulated
		// (IE normalizes it by default)
		hrefNormalized: a.getAttribute("href") === "/a",

		// Make sure that element opacity exists
		// (IE uses filter instead)
		// Use a regex to work around a WebKit issue. See #5145
		opacity: /^0.5/.test( a.style.opacity ),

		// Verify style float existence
		// (IE uses styleFloat instead of cssFloat)
		cssFloat: !!a.style.cssFloat,

		// Check the default checkbox/radio value ("" on WebKit; "on" elsewhere)
		checkOn: !!input.value,

		// Make sure that a selected-by-default option has a working selected property.
		// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
		optSelected: opt.selected,

		// Tests for enctype support on a form (#6743)
		enctype: !!document.createElement("form").enctype,

		// Makes sure cloning an html5 element does not cause problems
		// Where outerHTML is undefined, this still works
		html5Clone: document.createElement("nav").cloneNode( true ).outerHTML !== "<:nav></:nav>",

		// jQuery.support.boxModel DEPRECATED in 1.8 since we don't support Quirks Mode
		boxModel: document.compatMode === "CSS1Compat",

		// Will be defined later
		deleteExpando: true,
		noCloneEvent: true,
		inlineBlockNeedsLayout: false,
		shrinkWrapBlocks: false,
		reliableMarginRight: true,
		boxSizingReliable: true,
		pixelPosition: false
	};

	// Make sure checked status is properly cloned
	input.checked = true;
	support.noCloneChecked = input.cloneNode( true ).checked;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Support: IE<9
	try {
		delete div.test;
	} catch( e ) {
		support.deleteExpando = false;
	}

	// Check if we can trust getAttribute("value")
	input = document.createElement("input");
	input.setAttribute( "value", "" );
	support.input = input.getAttribute( "value" ) === "";

	// Check if an input maintains its value after becoming a radio
	input.value = "t";
	input.setAttribute( "type", "radio" );
	support.radioValue = input.value === "t";

	// #11217 - WebKit loses check when the name is after the checked attribute
	input.setAttribute( "checked", "t" );
	input.setAttribute( "name", "t" );

	fragment = document.createDocumentFragment();
	fragment.appendChild( input );

	// Check if a disconnected checkbox will retain its checked
	// value of true after appended to the DOM (IE6/7)
	support.appendChecked = input.checked;

	// WebKit doesn't clone checked state correctly in fragments
	support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE<9
	// Opera does not clone events (and typeof div.attachEvent === undefined).
	// IE9-10 clones events bound via attachEvent, but they don't trigger with .click()
	if ( div.attachEvent ) {
		div.attachEvent( "onclick", function() {
			support.noCloneEvent = false;
		});

		div.cloneNode( true ).click();
	}

	// Support: IE<9 (lack submit/change bubble), Firefox 17+ (lack focusin event)
	// Beware of CSP restrictions (https://developer.mozilla.org/en/Security/CSP), test/csp.php
	for ( i in { submit: true, change: true, focusin: true }) {
		div.setAttribute( eventName = "on" + i, "t" );

		support[ i + "Bubbles" ] = eventName in window || div.attributes[ eventName ].expando === false;
	}

	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	// Run tests that need a body at doc ready
	jQuery(function() {
		var container, marginDiv, tds,
			divReset = "padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;",
			body = document.getElementsByTagName("body")[0];

		if ( !body ) {
			// Return for frameset docs that don't have a body
			return;
		}

		container = document.createElement("div");
		container.style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px";

		body.appendChild( container ).appendChild( div );

		// Support: IE8
		// Check if table cells still have offsetWidth/Height when they are set
		// to display:none and there are still other visible table cells in a
		// table row; if so, offsetWidth/Height are not reliable for use when
		// determining if an element has been hidden directly using
		// display:none (it is still safe to use offsets if a parent element is
		// hidden; don safety goggles and see bug #4512 for more information).
		div.innerHTML = "<table><tr><td></td><td>t</td></tr></table>";
		tds = div.getElementsByTagName("td");
		tds[ 0 ].style.cssText = "padding:0;margin:0;border:0;display:none";
		isSupported = ( tds[ 0 ].offsetHeight === 0 );

		tds[ 0 ].style.display = "";
		tds[ 1 ].style.display = "none";

		// Support: IE8
		// Check if empty table cells still have offsetWidth/Height
		support.reliableHiddenOffsets = isSupported && ( tds[ 0 ].offsetHeight === 0 );

		// Check box-sizing and margin behavior
		div.innerHTML = "";
		div.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;";
		support.boxSizing = ( div.offsetWidth === 4 );
		support.doesNotIncludeMarginInBodyOffset = ( body.offsetTop !== 1 );

		// Use window.getComputedStyle because jsdom on node.js will break without it.
		if ( window.getComputedStyle ) {
			support.pixelPosition = ( window.getComputedStyle( div, null ) || {} ).top !== "1%";
			support.boxSizingReliable = ( window.getComputedStyle( div, null ) || { width: "4px" } ).width === "4px";

			// Check if div with explicit width and no margin-right incorrectly
			// gets computed margin-right based on width of container. (#3333)
			// Fails in WebKit before Feb 2011 nightlies
			// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
			marginDiv = div.appendChild( document.createElement("div") );
			marginDiv.style.cssText = div.style.cssText = divReset;
			marginDiv.style.marginRight = marginDiv.style.width = "0";
			div.style.width = "1px";

			support.reliableMarginRight =
				!parseFloat( ( window.getComputedStyle( marginDiv, null ) || {} ).marginRight );
		}

		if ( typeof div.style.zoom !== core_strundefined ) {
			// Support: IE<8
			// Check if natively block-level elements act like inline-block
			// elements when setting their display to 'inline' and giving
			// them layout
			div.innerHTML = "";
			div.style.cssText = divReset + "width:1px;padding:1px;display:inline;zoom:1";
			support.inlineBlockNeedsLayout = ( div.offsetWidth === 3 );

			// Support: IE6
			// Check if elements with layout shrink-wrap their children
			div.style.display = "block";
			div.innerHTML = "<div></div>";
			div.firstChild.style.width = "5px";
			support.shrinkWrapBlocks = ( div.offsetWidth !== 3 );

			if ( support.inlineBlockNeedsLayout ) {
				// Prevent IE 6 from affecting layout for positioned elements #11048
				// Prevent IE from shrinking the body in IE 7 mode #12869
				// Support: IE<8
				body.style.zoom = 1;
			}
		}

		body.removeChild( container );

		// Null elements to avoid leaks in IE
		container = div = tds = marginDiv = null;
	});

	// Null elements to avoid leaks in IE
	all = select = fragment = opt = a = input = null;

	return support;
})();

var rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
	rmultiDash = /([A-Z])/g;

function internalData( elem, name, data, pvt /* Internal Use Only */ ){
	if ( !jQuery.acceptData( elem ) ) {
		return;
	}

	var thisCache, ret,
		internalKey = jQuery.expando,
		getByName = typeof name === "string",

		// We have to handle DOM nodes and JS objects differently because IE6-7
		// can't GC object references properly across the DOM-JS boundary
		isNode = elem.nodeType,

		// Only DOM nodes need the global jQuery cache; JS object data is
		// attached directly to the object so GC can occur automatically
		cache = isNode ? jQuery.cache : elem,

		// Only defining an ID for JS objects if its cache already exists allows
		// the code to shortcut on the same path as a DOM node with no cache
		id = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey;

	// Avoid doing any more work than we need to when trying to get data on an
	// object that has no data at all
	if ( (!id || !cache[id] || (!pvt && !cache[id].data)) && getByName && data === undefined ) {
		return;
	}

	if ( !id ) {
		// Only DOM nodes need a new unique ID for each element since their data
		// ends up in the global cache
		if ( isNode ) {
			elem[ internalKey ] = id = core_deletedIds.pop() || jQuery.guid++;
		} else {
			id = internalKey;
		}
	}

	if ( !cache[ id ] ) {
		cache[ id ] = {};

		// Avoids exposing jQuery metadata on plain JS objects when the object
		// is serialized using JSON.stringify
		if ( !isNode ) {
			cache[ id ].toJSON = jQuery.noop;
		}
	}

	// An object can be passed to jQuery.data instead of a key/value pair; this gets
	// shallow copied over onto the existing cache
	if ( typeof name === "object" || typeof name === "function" ) {
		if ( pvt ) {
			cache[ id ] = jQuery.extend( cache[ id ], name );
		} else {
			cache[ id ].data = jQuery.extend( cache[ id ].data, name );
		}
	}

	thisCache = cache[ id ];

	// jQuery data() is stored in a separate object inside the object's internal data
	// cache in order to avoid key collisions between internal data and user-defined
	// data.
	if ( !pvt ) {
		if ( !thisCache.data ) {
			thisCache.data = {};
		}

		thisCache = thisCache.data;
	}

	if ( data !== undefined ) {
		thisCache[ jQuery.camelCase( name ) ] = data;
	}

	// Check for both converted-to-camel and non-converted data property names
	// If a data property was specified
	if ( getByName ) {

		// First Try to find as-is property data
		ret = thisCache[ name ];

		// Test for null|undefined property data
		if ( ret == null ) {

			// Try to find the camelCased property
			ret = thisCache[ jQuery.camelCase( name ) ];
		}
	} else {
		ret = thisCache;
	}

	return ret;
}

function internalRemoveData( elem, name, pvt ) {
	if ( !jQuery.acceptData( elem ) ) {
		return;
	}

	var i, l, thisCache,
		isNode = elem.nodeType,

		// See jQuery.data for more information
		cache = isNode ? jQuery.cache : elem,
		id = isNode ? elem[ jQuery.expando ] : jQuery.expando;

	// If there is already no cache entry for this object, there is no
	// purpose in continuing
	if ( !cache[ id ] ) {
		return;
	}

	if ( name ) {

		thisCache = pvt ? cache[ id ] : cache[ id ].data;

		if ( thisCache ) {

			// Support array or space separated string names for data keys
			if ( !jQuery.isArray( name ) ) {

				// try the string as a key before any manipulation
				if ( name in thisCache ) {
					name = [ name ];
				} else {

					// split the camel cased version by spaces unless a key with the spaces exists
					name = jQuery.camelCase( name );
					if ( name in thisCache ) {
						name = [ name ];
					} else {
						name = name.split(" ");
					}
				}
			} else {
				// If "name" is an array of keys...
				// When data is initially created, via ("key", "val") signature,
				// keys will be converted to camelCase.
				// Since there is no way to tell _how_ a key was added, remove
				// both plain key and camelCase key. #12786
				// This will only penalize the array argument path.
				name = name.concat( jQuery.map( name, jQuery.camelCase ) );
			}

			for ( i = 0, l = name.length; i < l; i++ ) {
				delete thisCache[ name[i] ];
			}

			// If there is no data left in the cache, we want to continue
			// and let the cache object itself get destroyed
			if ( !( pvt ? isEmptyDataObject : jQuery.isEmptyObject )( thisCache ) ) {
				return;
			}
		}
	}

	// See jQuery.data for more information
	if ( !pvt ) {
		delete cache[ id ].data;

		// Don't destroy the parent cache unless the internal data object
		// had been the only thing left in it
		if ( !isEmptyDataObject( cache[ id ] ) ) {
			return;
		}
	}

	// Destroy the cache
	if ( isNode ) {
		jQuery.cleanData( [ elem ], true );

	// Use delete when supported for expandos or `cache` is not a window per isWindow (#10080)
	} else if ( jQuery.support.deleteExpando || cache != cache.window ) {
		delete cache[ id ];

	// When all else fails, null
	} else {
		cache[ id ] = null;
	}
}

jQuery.extend({
	cache: {},

	// Unique for each copy of jQuery on the page
	// Non-digits removed to match rinlinejQuery
	expando: "jQuery" + ( core_version + Math.random() ).replace( /\D/g, "" ),

	// The following elements throw uncatchable exceptions if you
	// attempt to add expando properties to them.
	noData: {
		"embed": true,
		// Ban all objects except for Flash (which handle expandos)
		"object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
		"applet": true
	},

	hasData: function( elem ) {
		elem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];
		return !!elem && !isEmptyDataObject( elem );
	},

	data: function( elem, name, data ) {
		return internalData( elem, name, data );
	},

	removeData: function( elem, name ) {
		return internalRemoveData( elem, name );
	},

	// For internal use only.
	_data: function( elem, name, data ) {
		return internalData( elem, name, data, true );
	},

	_removeData: function( elem, name ) {
		return internalRemoveData( elem, name, true );
	},

	// A method for determining if a DOM node can handle the data expando
	acceptData: function( elem ) {
		// Do not set data on non-element because it will not be cleared (#8335).
		if ( elem.nodeType && elem.nodeType !== 1 && elem.nodeType !== 9 ) {
			return false;
		}

		var noData = elem.nodeName && jQuery.noData[ elem.nodeName.toLowerCase() ];

		// nodes accept data unless otherwise specified; rejection can be conditional
		return !noData || noData !== true && elem.getAttribute("classid") === noData;
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		var attrs, name,
			elem = this[0],
			i = 0,
			data = null;

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = jQuery.data( elem );

				if ( elem.nodeType === 1 && !jQuery._data( elem, "parsedAttrs" ) ) {
					attrs = elem.attributes;
					for ( ; i < attrs.length; i++ ) {
						name = attrs[i].name;

						if ( !name.indexOf( "data-" ) ) {
							name = jQuery.camelCase( name.slice(5) );

							dataAttr( elem, name, data[ name ] );
						}
					}
					jQuery._data( elem, "parsedAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each(function() {
				jQuery.data( this, key );
			});
		}

		return jQuery.access( this, function( value ) {

			if ( value === undefined ) {
				// Try to fetch any internally stored data first
				return elem ? dataAttr( elem, key, jQuery.data( elem, key ) ) : null;
			}

			this.each(function() {
				jQuery.data( this, key, value );
			});
		}, null, value, arguments.length > 1, null, true );
	},

	removeData: function( key ) {
		return this.each(function() {
			jQuery.removeData( this, key );
		});
	}
});

function dataAttr( elem, key, data ) {
	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {

		var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();

		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
					data === "false" ? false :
					data === "null" ? null :
					// Only convert to a number if it doesn't change the string
					+data + "" === data ? +data :
					rbrace.test( data ) ? jQuery.parseJSON( data ) :
						data;
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			jQuery.data( elem, key, data );

		} else {
			data = undefined;
		}
	}

	return data;
}

// checks a cache object for emptiness
function isEmptyDataObject( obj ) {
	var name;
	for ( name in obj ) {

		// if the public data object is empty, the private is still empty
		if ( name === "data" && jQuery.isEmptyObject( obj[name] ) ) {
			continue;
		}
		if ( name !== "toJSON" ) {
			return false;
		}
	}

	return true;
}
jQuery.extend({
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = jQuery._data( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || jQuery.isArray(data) ) {
					queue = jQuery._data( elem, type, jQuery.makeArray(data) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		hooks.cur = fn;
		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// not intended for public consumption - generates a queueHooks object, or returns the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return jQuery._data( elem, key ) || jQuery._data( elem, key, {
			empty: jQuery.Callbacks("once memory").add(function() {
				jQuery._removeData( elem, type + "queue" );
				jQuery._removeData( elem, key );
			})
		});
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[0], type );
		}

		return data === undefined ?
			this :
			this.each(function() {
				var queue = jQuery.queue( this, type, data );

				// ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[0] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},
	// Based off of the plugin by Clint Helfers, with permission.
	// http://blindsignals.com/index.php/2009/07/jquery-delay/
	delay: function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
		type = type || "fx";

		return this.queue( type, function( next, hooks ) {
			var timeout = setTimeout( next, time );
			hooks.stop = function() {
				clearTimeout( timeout );
			};
		});
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},
	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while( i-- ) {
			tmp = jQuery._data( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
});
var nodeHook, boolHook,
	rclass = /[\t\r\n]/g,
	rreturn = /\r/g,
	rfocusable = /^(?:input|select|textarea|button|object)$/i,
	rclickable = /^(?:a|area)$/i,
	rboolean = /^(?:checked|selected|autofocus|autoplay|async|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped)$/i,
	ruseDefault = /^(?:checked|selected)$/i,
	getSetAttribute = jQuery.support.getSetAttribute,
	getSetInput = jQuery.support.input;

jQuery.fn.extend({
	attr: function( name, value ) {
		return jQuery.access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each(function() {
			jQuery.removeAttr( this, name );
		});
	},

	prop: function( name, value ) {
		return jQuery.access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		name = jQuery.propFix[ name ] || name;
		return this.each(function() {
			// try/catch handles cases where IE balks (such as removing a property on window)
			try {
				this[ name ] = undefined;
				delete this[ name ];
			} catch( e ) {}
		});
	},

	addClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).addClass( value.call( this, j, this.className ) );
			});
		}

		if ( proceed ) {
			// The disjunction here is for better compressibility (see removeClass)
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					" "
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}
					elem.className = jQuery.trim( cur );

				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = arguments.length === 0 || typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).removeClass( value.call( this, j, this.className ) );
			});
		}
		if ( proceed ) {
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					""
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) >= 0 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}
					elem.className = value ? jQuery.trim( cur ) : "";
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value,
			isBool = typeof stateVal === "boolean";

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( i ) {
				jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					state = stateVal,
					classNames = value.match( core_rnotwhite ) || [];

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space separated list
					state = isBool ? state : !self.hasClass( className );
					self[ state ? "addClass" : "removeClass" ]( className );
				}

			// Toggle whole class name
			} else if ( type === core_strundefined || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					jQuery._data( this, "__className__", this.className );
				}

				// If the element has a class name or if we're passed "false",
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				this.className = this.className || value === false ? "" : jQuery._data( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ",
			i = 0,
			l = this.length;
		for ( ; i < l; i++ ) {
			if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) >= 0 ) {
				return true;
			}
		}

		return false;
	},

	val: function( value ) {
		var ret, hooks, isFunction,
			elem = this[0];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] || jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?
					// handle most common string cases
					ret.replace(rreturn, "") :
					// handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each(function( i ) {
			var val,
				self = jQuery(this);

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, self.val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += "";
			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map(val, function ( value ) {
					return value == null ? "" : value + "";
				});
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	valHooks: {
		option: {
			get: function( elem ) {
				// attributes.value is undefined in Blackberry 4.7 but
				// uses .value. See #6932
				var val = elem.attributes.value;
				return !val || val.specified ? elem.value : elem.text;
			}
		},
		select: {
			get: function( elem ) {
				var value, option,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one" || index < 0,
					values = one ? null : [],
					max = one ? index + 1 : options.length,
					i = index < 0 ?
						max :
						one ? index : 0;

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// oldIE doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&
							// Don't return options that are disabled or in a disabled optgroup
							( jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null ) &&
							( !option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var values = jQuery.makeArray( value );

				jQuery(elem).find("option").each(function() {
					this.selected = jQuery.inArray( jQuery(this).val(), values ) >= 0;
				});

				if ( !values.length ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	},

	attr: function( elem, name, value ) {
		var hooks, notxml, ret,
			nType = elem.nodeType;

		// don't get/set attributes on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === core_strundefined ) {
			return jQuery.prop( elem, name, value );
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( notxml ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] || ( rboolean.test( name ) ? boolHook : nodeHook );
		}

		if ( value !== undefined ) {

			if ( value === null ) {
				jQuery.removeAttr( elem, name );

			} else if ( hooks && notxml && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				elem.setAttribute( name, value + "" );
				return value;
			}

		} else if ( hooks && notxml && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
			return ret;

		} else {

			// In IE9+, Flash objects don't have .getAttribute (#12945)
			// Support: IE9+
			if ( typeof elem.getAttribute !== core_strundefined ) {
				ret =  elem.getAttribute( name );
			}

			// Non-existent attributes return null, we normalize to undefined
			return ret == null ?
				undefined :
				ret;
		}
	},

	removeAttr: function( elem, value ) {
		var name, propName,
			i = 0,
			attrNames = value && value.match( core_rnotwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( (name = attrNames[i++]) ) {
				propName = jQuery.propFix[ name ] || name;

				// Boolean attributes get special treatment (#10870)
				if ( rboolean.test( name ) ) {
					// Set corresponding property to false for boolean attributes
					// Also clear defaultChecked/defaultSelected (if appropriate) for IE<8
					if ( !getSetAttribute && ruseDefault.test( name ) ) {
						elem[ jQuery.camelCase( "default-" + name ) ] =
							elem[ propName ] = false;
					} else {
						elem[ propName ] = false;
					}

				// See #9699 for explanation of this approach (setting first, then removal)
				} else {
					jQuery.attr( elem, name, "" );
				}

				elem.removeAttribute( getSetAttribute ? name : propName );
			}
		}
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
					// Setting the type on a radio button after the value resets the value in IE6-9
					// Reset value to default in case type is set after value during creation
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	propFix: {
		tabindex: "tabIndex",
		readonly: "readOnly",
		"for": "htmlFor",
		"class": "className",
		maxlength: "maxLength",
		cellspacing: "cellSpacing",
		cellpadding: "cellPadding",
		rowspan: "rowSpan",
		colspan: "colSpan",
		usemap: "useMap",
		frameborder: "frameBorder",
		contenteditable: "contentEditable"
	},

	prop: function( elem, name, value ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set properties on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		if ( notxml ) {
			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				return ( elem[ name ] = value );
			}

		} else {
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
				return ret;

			} else {
				return elem[ name ];
			}
		}
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {
				// elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				var attributeNode = elem.getAttributeNode("tabindex");

				return attributeNode && attributeNode.specified ?
					parseInt( attributeNode.value, 10 ) :
					rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
						0 :
						undefined;
			}
		}
	}
});

// Hook for boolean attributes
boolHook = {
	get: function( elem, name ) {
		var
			// Use .prop to determine if this attribute is understood as boolean
			prop = jQuery.prop( elem, name ),

			// Fetch it accordingly
			attr = typeof prop === "boolean" && elem.getAttribute( name ),
			detail = typeof prop === "boolean" ?

				getSetInput && getSetAttribute ?
					attr != null :
					// oldIE fabricates an empty string for missing boolean attributes
					// and conflates checked/selected into attroperties
					ruseDefault.test( name ) ?
						elem[ jQuery.camelCase( "default-" + name ) ] :
						!!attr :

				// fetch an attribute node for properties not recognized as boolean
				elem.getAttributeNode( name );

		return detail && detail.value !== false ?
			name.toLowerCase() :
			undefined;
	},
	set: function( elem, value, name ) {
		if ( value === false ) {
			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
			// IE<8 needs the *property* name
			elem.setAttribute( !getSetAttribute && jQuery.propFix[ name ] || name, name );

		// Use defaultChecked and defaultSelected for oldIE
		} else {
			elem[ jQuery.camelCase( "default-" + name ) ] = elem[ name ] = true;
		}

		return name;
	}
};

// fix oldIE value attroperty
if ( !getSetInput || !getSetAttribute ) {
	jQuery.attrHooks.value = {
		get: function( elem, name ) {
			var ret = elem.getAttributeNode( name );
			return jQuery.nodeName( elem, "input" ) ?

				// Ignore the value *property* by using defaultValue
				elem.defaultValue :

				ret && ret.specified ? ret.value : undefined;
		},
		set: function( elem, value, name ) {
			if ( jQuery.nodeName( elem, "input" ) ) {
				// Does not return so that setAttribute is also used
				elem.defaultValue = value;
			} else {
				// Use nodeHook if defined (#1954); otherwise setAttribute is fine
				return nodeHook && nodeHook.set( elem, value, name );
			}
		}
	};
}

// IE6/7 do not support getting/setting some attributes with get/setAttribute
if ( !getSetAttribute ) {

	// Use this for any attribute in IE6/7
	// This fixes almost every IE6/7 issue
	nodeHook = jQuery.valHooks.button = {
		get: function( elem, name ) {
			var ret = elem.getAttributeNode( name );
			return ret && ( name === "id" || name === "name" || name === "coords" ? ret.value !== "" : ret.specified ) ?
				ret.value :
				undefined;
		},
		set: function( elem, value, name ) {
			// Set the existing or create a new attribute node
			var ret = elem.getAttributeNode( name );
			if ( !ret ) {
				elem.setAttributeNode(
					(ret = elem.ownerDocument.createAttribute( name ))
				);
			}

			ret.value = value += "";

			// Break association with cloned elements by also using setAttribute (#9646)
			return name === "value" || value === elem.getAttribute( name ) ?
				value :
				undefined;
		}
	};

	// Set contenteditable to false on removals(#10429)
	// Setting to empty string throws an error as an invalid value
	jQuery.attrHooks.contenteditable = {
		get: nodeHook.get,
		set: function( elem, value, name ) {
			nodeHook.set( elem, value === "" ? false : value, name );
		}
	};

	// Set width and height to auto instead of 0 on empty string( Bug #8150 )
	// This is for removals
	jQuery.each([ "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
			set: function( elem, value ) {
				if ( value === "" ) {
					elem.setAttribute( name, "auto" );
					return value;
				}
			}
		});
	});
}


// Some attributes require a special call on IE
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !jQuery.support.hrefNormalized ) {
	jQuery.each([ "href", "src", "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
			get: function( elem ) {
				var ret = elem.getAttribute( name, 2 );
				return ret == null ? undefined : ret;
			}
		});
	});

	// href/src property should get the full normalized URL (#10299/#12915)
	jQuery.each([ "href", "src" ], function( i, name ) {
		jQuery.propHooks[ name ] = {
			get: function( elem ) {
				return elem.getAttribute( name, 4 );
			}
		};
	});
}

if ( !jQuery.support.style ) {
	jQuery.attrHooks.style = {
		get: function( elem ) {
			// Return undefined in the case of empty string
			// Note: IE uppercases css property names, but if we were to .toLowerCase()
			// .cssText, that would destroy case senstitivity in URL's, like in "background"
			return elem.style.cssText || undefined;
		},
		set: function( elem, value ) {
			return ( elem.style.cssText = value + "" );
		}
	};
}

// Safari mis-reports the default selected property of an option
// Accessing the parent's selectedIndex property fixes it
if ( !jQuery.support.optSelected ) {
	jQuery.propHooks.selected = jQuery.extend( jQuery.propHooks.selected, {
		get: function( elem ) {
			var parent = elem.parentNode;

			if ( parent ) {
				parent.selectedIndex;

				// Make sure that it also works with optgroups, see #5701
				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
			return null;
		}
	});
}

// IE6/7 call enctype encoding
if ( !jQuery.support.enctype ) {
	jQuery.propFix.enctype = "encoding";
}

// Radios and checkboxes getter/setter
if ( !jQuery.support.checkOn ) {
	jQuery.each([ "radio", "checkbox" ], function() {
		jQuery.valHooks[ this ] = {
			get: function( elem ) {
				// Handle the case where in Webkit "" is returned instead of "on" if a value isn't specified
				return elem.getAttribute("value") === null ? "on" : elem.value;
			}
		};
	});
}
jQuery.each([ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = jQuery.extend( jQuery.valHooks[ this ], {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
			}
		}
	});
});
var rformElems = /^(?:input|select|textarea)$/i,
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|contextmenu)|click/,
	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {
		var tmp, events, t, handleObjIn,
			special, eventHandle, handleObj,
			handlers, type, namespaces, origType,
			elemData = jQuery._data( elem );

		// Don't attach events to noData or text/comment nodes (but allow plain objects)
		if ( !elemData ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !(events = elemData.events) ) {
			events = elemData.events = {};
		}
		if ( !(eventHandle = elemData.handle) ) {
			eventHandle = elemData.handle = function( e ) {
				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== core_strundefined && (!e || jQuery.event.triggered !== e.type) ?
					jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
					undefined;
			};
			// Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
			eventHandle.elem = elem;
		}

		// Handle multiple events separated by a space
		// jQuery(...).bind("mouseover mouseout", fn);
		types = ( types || "" ).match( core_rnotwhite ) || [""];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend({
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join(".")
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !(handlers = events[ type ]) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener/attachEvent if the special events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					// Bind the global event handler to the element
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );

					} else if ( elem.attachEvent ) {
						elem.attachEvent( "on" + type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {
		var j, handleObj, tmp,
			origCount, t, events,
			special, handlers, type,
			namespaces, origType,
			elemData = jQuery.hasData( elem ) && jQuery._data( elem );

		if ( !elemData || !(events = elemData.events) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( core_rnotwhite ) || [""];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[2] && new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces, elemData.handle ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			delete elemData.handle;

			// removeData also checks for emptiness and clears the expando if empty
			// so use it instead of delete
			jQuery._removeData( elem, "events" );
		}
	},

	trigger: function( event, data, elem, onlyHandlers ) {
		var handle, ontype, cur,
			bubbleType, special, tmp, i,
			eventPath = [ elem || document ],
			type = core_hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = core_hasOwn.call( event, "namespace" ) ? event.namespace.split(".") : [];

		cur = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf(".") >= 0 ) {
			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split(".");
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf(":") < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		event.isTrigger = true;
		event.namespace = namespaces.join(".");
		event.namespace_re = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === (elem.ownerDocument || document) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( (cur = eventPath[i++]) && !event.isPropagationStopped() ) {

			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( jQuery._data( cur, "events" ) || {} )[ event.type ] && jQuery._data( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && jQuery.acceptData( cur ) && handle.apply && handle.apply( cur, data ) === false ) {
				event.preventDefault();
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( (!special._default || special._default.apply( elem.ownerDocument, data ) === false) &&
				!(type === "click" && jQuery.nodeName( elem, "a" )) && jQuery.acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Can't use an .isFunction() check here because IE6/7 fails that test.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && elem[ type ] && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					try {
						elem[ type ]();
					} catch ( e ) {
						// IE<9 dies on focus/blur to hidden element (#1486,#12518)
						// only reproducible on winXP IE8 native, not IE9 in IE8 mode
					}
					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event );

		var i, ret, handleObj, matched, j,
			handlerQueue = [],
			args = core_slice.call( arguments ),
			handlers = ( jQuery._data( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[0] = event;
		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( (matched = handlerQueue[ i++ ]) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( (handleObj = matched.handlers[ j++ ]) && !event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or
				// 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.namespace_re || event.namespace_re.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
							.apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( (event.result = ret) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var sel, handleObj, matches, i,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		// Black-hole SVG <use> instance trees (#13180)
		// Avoid non-left-click bubbling in Firefox (#3861)
		if ( delegateCount && cur.nodeType && (!event.button || event.type !== "click") ) {

			for ( ; cur != this; cur = cur.parentNode || this ) {

				// Don't check non-elements (#13208)
				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.nodeType === 1 && (cur.disabled !== true || event.type !== "click") ) {
					matches = [];
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matches[ sel ] === undefined ) {
							matches[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) >= 0 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matches[ sel ] ) {
							matches.push( handleObj );
						}
					}
					if ( matches.length ) {
						handlerQueue.push({ elem: cur, handlers: matches });
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( delegateCount < handlers.length ) {
			handlerQueue.push({ elem: this, handlers: handlers.slice( delegateCount ) });
		}

		return handlerQueue;
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop, copy,
			type = event.type,
			originalEvent = event,
			fixHook = this.fixHooks[ type ];

		if ( !fixHook ) {
			this.fixHooks[ type ] = fixHook =
				rmouseEvent.test( type ) ? this.mouseHooks :
				rkeyEvent.test( type ) ? this.keyHooks :
				{};
		}
		copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = new jQuery.Event( originalEvent );

		i = copy.length;
		while ( i-- ) {
			prop = copy[ i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Support: IE<9
		// Fix target property (#1925)
		if ( !event.target ) {
			event.target = originalEvent.srcElement || document;
		}

		// Support: Chrome 23+, Safari?
		// Target should not be a text node (#504, #13143)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		// Support: IE<9
		// For mouse/key events, metaKey==false if it's undefined (#3368, #11328)
		event.metaKey = !!event.metaKey;

		return fixHook.filter ? fixHook.filter( event, originalEvent ) : event;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split(" "),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
		filter: function( event, original ) {
			var body, eventDoc, doc,
				button = original.button,
				fromElement = original.fromElement;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add relatedTarget, if necessary
			if ( !event.relatedTarget && fromElement ) {
				event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	special: {
		load: {
			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		click: {
			// For checkbox, fire native event so checked state will be right
			trigger: function() {
				if ( jQuery.nodeName( this, "input" ) && this.type === "checkbox" && this.click ) {
					this.click();
					return false;
				}
			}
		},
		focus: {
			// Fire native event if possible so blur/focus sequence is correct
			trigger: function() {
				if ( this !== document.activeElement && this.focus ) {
					try {
						this.focus();
						return false;
					} catch ( e ) {
						// Support: IE<9
						// If we error on focus to hidden element (#1486, #12518),
						// let .trigger() run the handlers
					}
				}
			},
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === document.activeElement && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Even when returnValue equals to undefined Firefox will still show alert
				if ( event.result !== undefined ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	},

	simulate: function( type, elem, event, bubble ) {
		// Piggyback on a donor event to simulate a different one.
		// Fake originalEvent to avoid donor's stopPropagation, but if the
		// simulated event prevents default then we do the same on the donor.
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{ type: type,
				isSimulated: true,
				originalEvent: {}
			}
		);
		if ( bubble ) {
			jQuery.event.trigger( e, null, elem );
		} else {
			jQuery.event.dispatch.call( elem, e );
		}
		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}
};

jQuery.removeEvent = document.removeEventListener ?
	function( elem, type, handle ) {
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle, false );
		}
	} :
	function( elem, type, handle ) {
		var name = "on" + type;

		if ( elem.detachEvent ) {

			// #8545, #7054, preventing memory leaks for custom events in IE6-8
			// detachEvent needed property on element, by name of that event, to properly expose it to GC
			if ( typeof elem[ name ] === core_strundefined ) {
				elem[ name ] = null;
			}

			elem.detachEvent( name, handle );
		}
	};

jQuery.Event = function( src, props ) {
	// Allow instantiation without the 'new' keyword
	if ( !(this instanceof jQuery.Event) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = ( src.defaultPrevented || src.returnValue === false ||
			src.getPreventDefault && src.getPreventDefault() ) ? returnTrue : returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;
		if ( !e ) {
			return;
		}

		// If preventDefault exists, run it on the original event
		if ( e.preventDefault ) {
			e.preventDefault();

		// Support: IE
		// Otherwise set the returnValue property of the original event to false
		} else {
			e.returnValue = false;
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;
		if ( !e ) {
			return;
		}
		// If stopPropagation exists, run it on the original event
		if ( e.stopPropagation ) {
			e.stopPropagation();
		}

		// Support: IE
		// Set the cancelBubble property of the original event to true
		e.cancelBubble = true;
	},
	stopImmediatePropagation: function() {
		this.isImmediatePropagationStopped = returnTrue;
		this.stopPropagation();
	}
};

// Create mouseenter/leave events using mouseover/out and event-time checks
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mousenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
});

// IE submit delegation
if ( !jQuery.support.submitBubbles ) {

	jQuery.event.special.submit = {
		setup: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Lazy-add a submit handler when a descendant form may potentially be submitted
			jQuery.event.add( this, "click._submit keypress._submit", function( e ) {
				// Node name check avoids a VML-related crash in IE (#9807)
				var elem = e.target,
					form = jQuery.nodeName( elem, "input" ) || jQuery.nodeName( elem, "button" ) ? elem.form : undefined;
				if ( form && !jQuery._data( form, "submitBubbles" ) ) {
					jQuery.event.add( form, "submit._submit", function( event ) {
						event._submit_bubble = true;
					});
					jQuery._data( form, "submitBubbles", true );
				}
			});
			// return undefined since we don't need an event listener
		},

		postDispatch: function( event ) {
			// If form was submitted by the user, bubble the event up the tree
			if ( event._submit_bubble ) {
				delete event._submit_bubble;
				if ( this.parentNode && !event.isTrigger ) {
					jQuery.event.simulate( "submit", this.parentNode, event, true );
				}
			}
		},

		teardown: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Remove delegated handlers; cleanData eventually reaps submit handlers attached above
			jQuery.event.remove( this, "._submit" );
		}
	};
}

// IE change delegation and checkbox/radio fix
if ( !jQuery.support.changeBubbles ) {

	jQuery.event.special.change = {

		setup: function() {

			if ( rformElems.test( this.nodeName ) ) {
				// IE doesn't fire change on a check/radio until blur; trigger it on click
				// after a propertychange. Eat the blur-change in special.change.handle.
				// This still fires onchange a second time for check/radio after blur.
				if ( this.type === "checkbox" || this.type === "radio" ) {
					jQuery.event.add( this, "propertychange._change", function( event ) {
						if ( event.originalEvent.propertyName === "checked" ) {
							this._just_changed = true;
						}
					});
					jQuery.event.add( this, "click._change", function( event ) {
						if ( this._just_changed && !event.isTrigger ) {
							this._just_changed = false;
						}
						// Allow triggered, simulated change events (#11500)
						jQuery.event.simulate( "change", this, event, true );
					});
				}
				return false;
			}
			// Delegated event; lazy-add a change handler on descendant inputs
			jQuery.event.add( this, "beforeactivate._change", function( e ) {
				var elem = e.target;

				if ( rformElems.test( elem.nodeName ) && !jQuery._data( elem, "changeBubbles" ) ) {
					jQuery.event.add( elem, "change._change", function( event ) {
						if ( this.parentNode && !event.isSimulated && !event.isTrigger ) {
							jQuery.event.simulate( "change", this.parentNode, event, true );
						}
					});
					jQuery._data( elem, "changeBubbles", true );
				}
			});
		},

		handle: function( event ) {
			var elem = event.target;

			// Swallow native change events from checkbox/radio, we already triggered them above
			if ( this !== elem || event.isSimulated || event.isTrigger || (elem.type !== "radio" && elem.type !== "checkbox") ) {
				return event.handleObj.handler.apply( this, arguments );
			}
		},

		teardown: function() {
			jQuery.event.remove( this, "._change" );

			return !rformElems.test( this.nodeName );
		}
	};
}

// Create "bubbling" focus and blur events
if ( !jQuery.support.focusinBubbles ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler while someone wants focusin/focusout
		var attaches = 0,
			handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
			};

		jQuery.event.special[ fix ] = {
			setup: function() {
				if ( attaches++ === 0 ) {
					document.addEventListener( orig, handler, true );
				}
			},
			teardown: function() {
				if ( --attaches === 0 ) {
					document.removeEventListener( orig, handler, true );
				}
			}
		};
	});
}

jQuery.fn.extend({

	on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
		var type, origFn;

		// Types can be a map of types/handlers
		if ( typeof types === "object" ) {
			// ( types-Object, selector, data )
			if ( typeof selector !== "string" ) {
				// ( types-Object, data )
				data = data || selector;
				selector = undefined;
			}
			for ( type in types ) {
				this.on( type, selector, data, types[ type ], one );
			}
			return this;
		}

		if ( data == null && fn == null ) {
			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if ( fn == null ) {
			if ( typeof selector === "string" ) {
				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {
				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			return this;
		}

		if ( one === 1 ) {
			origFn = fn;
			fn = function( event ) {
				// Can use an empty set, since event contains the info
				jQuery().off( event );
				return origFn.apply( this, arguments );
			};
			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		return this.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		});
	},
	one: function( types, selector, data, fn ) {
		return this.on( types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {
			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {
			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {
			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each(function() {
			jQuery.event.remove( this, types, fn, selector );
		});
	},

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {
		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ? this.off( selector, "**" ) : this.off( types, selector || "**", fn );
	},

	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},
	triggerHandler: function( type, data ) {
		var elem = this[0];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
});
/*!
 * Sizzle CSS Selector Engine
 * Copyright 2012 jQuery Foundation and other contributors
 * Released under the MIT license
 * http://sizzlejs.com/
 */
(function( window, undefined ) {

var i,
	cachedruns,
	Expr,
	getText,
	isXML,
	compile,
	hasDuplicate,
	outermostContext,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsXML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,
	sortOrder,

	// Instance-specific data
	expando = "sizzle" + -(new Date()),
	preferredDoc = window.document,
	support = {},
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),

	// General-purpose constants
	strundefined = typeof undefined,
	MAX_NEGATIVE = 1 << 31,

	// Array methods
	arr = [],
	pop = arr.pop,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf if we can't use a native one
	indexOf = arr.indexOf || function( elem ) {
		var i = 0,
			len = this.length;
		for ( ; i < len; i++ ) {
			if ( this[i] === elem ) {
				return i;
			}
		}
		return -1;
	},


	// Regular expressions

	// Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",
	// http://www.w3.org/TR/css3-syntax/#characters
	characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

	// Loosely modeled on CSS identifier characters
	// An unquoted value should be a CSS identifier http://www.w3.org/TR/css3-selectors/#attribute-selectors
	// Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = characterEncoding.replace( "w", "w#" ),

	// Acceptable operators http://www.w3.org/TR/selectors/#attribute-selectors
	operators = "([*^$|!~]?=)",
	attributes = "\\[" + whitespace + "*(" + characterEncoding + ")" + whitespace +
		"*(?:" + operators + whitespace + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + identifier + ")|)|)" + whitespace + "*\\]",

	// Prefer arguments quoted,
	//   then not containing pseudos/brackets,
	//   then attribute selectors/non-parenthetical expressions,
	//   then anything else
	// These preferences are here to reduce the number of selectors
	//   needing tokenize in the PSEUDO preFilter
	pseudos = ":(" + characterEncoding + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + attributes.replace( 3, 8 ) + ")*)|.*)\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([\\x20\\t\\r\\n\\f>+~])" + whitespace + "*" ),
	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + characterEncoding + ")" ),
		"CLASS": new RegExp( "^\\.(" + characterEncoding + ")" ),
		"NAME": new RegExp( "^\\[name=['\"]?(" + characterEncoding + ")['\"]?\\]" ),
		"TAG": new RegExp( "^(" + characterEncoding.replace( "w", "w*" ) + ")" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rsibling = /[\x20\t\r\n\f]*[+~]/,

	rnative = /^[^{]+\{\s*\[native code/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rescape = /'|\\/g,
	rattributeQuotes = /\=[\x20\t\r\n\f]*([^'"\]]*)[\x20\t\r\n\f]*\]/g,

	// CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = /\\([\da-fA-F]{1,6}[\x20\t\r\n\f]?|.)/g,
	funescape = function( _, escaped ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		return high !== high ?
			escaped :
			// BMP codepoint
			high < 0 ?
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	};

// Use a stripped-down slice if we can't use a native one
try {
	slice.call( preferredDoc.documentElement.childNodes, 0 )[0].nodeType;
} catch ( e ) {
	slice = function( i ) {
		var elem,
			results = [];
		while ( (elem = this[i++]) ) {
			results.push( elem );
		}
		return results;
	};
}

/**
 * For feature detection
 * @param {Function} fn The function to test for native support
 */
function isNative( fn ) {
	return rnative.test( fn + "" );
}

/**
 * Create key-value caches of limited size
 * @returns {Function(string, Object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var cache,
		keys = [];

	return (cache = function( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key += " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key ] = value);
	});
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created div and expects a boolean result
 */
function assert( fn ) {
	var div = document.createElement("div");

	try {
		return fn( div );
	} catch (e) {
		return false;
	} finally {
		// release memory in IE
		div = null;
	}
}

function Sizzle( selector, context, results, seed ) {
	var match, elem, m, nodeType,
		// QSA vars
		i, groups, old, nid, newContext, newSelector;

	if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
		setDocument( context );
	}

	context = context || document;
	results = results || [];

	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	if ( (nodeType = context.nodeType) !== 1 && nodeType !== 9 ) {
		return [];
	}

	if ( !documentIsXML && !seed ) {

		// Shortcuts
		if ( (match = rquickExpr.exec( selector )) ) {
			// Speed-up: Sizzle("#ID")
			if ( (m = match[1]) ) {
				if ( nodeType === 9 ) {
					elem = context.getElementById( m );
					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE, Opera, and Webkit return items
						// by name instead of ID
						if ( elem.id === m ) {
							results.push( elem );
							return results;
						}
					} else {
						return results;
					}
				} else {
					// Context is not a document
					if ( context.ownerDocument && (elem = context.ownerDocument.getElementById( m )) &&
						contains( context, elem ) && elem.id === m ) {
						results.push( elem );
						return results;
					}
				}

			// Speed-up: Sizzle("TAG")
			} else if ( match[2] ) {
				push.apply( results, slice.call(context.getElementsByTagName( selector ), 0) );
				return results;

			// Speed-up: Sizzle(".CLASS")
			} else if ( (m = match[3]) && support.getByClassName && context.getElementsByClassName ) {
				push.apply( results, slice.call(context.getElementsByClassName( m ), 0) );
				return results;
			}
		}

		// QSA path
		if ( support.qsa && !rbuggyQSA.test(selector) ) {
			old = true;
			nid = expando;
			newContext = context;
			newSelector = nodeType === 9 && selector;

			// qSA works strangely on Element-rooted queries
			// We can work around this by specifying an extra ID on the root
			// and working up from there (Thanks to Andrew Dupont for the technique)
			// IE 8 doesn't work on object elements
			if ( nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
				groups = tokenize( selector );

				if ( (old = context.getAttribute("id")) ) {
					nid = old.replace( rescape, "\\$&" );
				} else {
					context.setAttribute( "id", nid );
				}
				nid = "[id='" + nid + "'] ";

				i = groups.length;
				while ( i-- ) {
					groups[i] = nid + toSelector( groups[i] );
				}
				newContext = rsibling.test( selector ) && context.parentNode || context;
				newSelector = groups.join(",");
			}

			if ( newSelector ) {
				try {
					push.apply( results, slice.call( newContext.querySelectorAll(
						newSelector
					), 0 ) );
					return results;
				} catch(qsaError) {
				} finally {
					if ( !old ) {
						context.removeAttribute("id");
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Detect xml
 * @param {Element|Object} elem An element or a document
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var doc = node ? node.ownerDocument || node : preferredDoc;

	// If no document and documentElement is available, return
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Set our document
	document = doc;
	docElem = doc.documentElement;

	// Support tests
	documentIsXML = isXML( doc );

	// Check if getElementsByTagName("*") returns only elements
	support.tagNameNoComments = assert(function( div ) {
		div.appendChild( doc.createComment("") );
		return !div.getElementsByTagName("*").length;
	});

	// Check if attributes should be retrieved by attribute nodes
	support.attributes = assert(function( div ) {
		div.innerHTML = "<select></select>";
		var type = typeof div.lastChild.getAttribute("multiple");
		// IE8 returns a string for some attributes even when not present
		return type !== "boolean" && type !== "string";
	});

	// Check if getElementsByClassName can be trusted
	support.getByClassName = assert(function( div ) {
		// Opera can't find a second classname (in 9.6)
		div.innerHTML = "<div class='hidden e'></div><div class='hidden'></div>";
		if ( !div.getElementsByClassName || !div.getElementsByClassName("e").length ) {
			return false;
		}

		// Safari 3.2 caches class attributes and doesn't catch changes
		div.lastChild.className = "e";
		return div.getElementsByClassName("e").length === 2;
	});

	// Check if getElementById returns elements by name
	// Check if getElementsByName privileges form controls or returns elements by ID
	support.getByName = assert(function( div ) {
		// Inject content
		div.id = expando + 0;
		div.innerHTML = "<a name='" + expando + "'></a><div name='" + expando + "'></div>";
		docElem.insertBefore( div, docElem.firstChild );

		// Test
		var pass = doc.getElementsByName &&
			// buggy browsers will return fewer than the correct 2
			doc.getElementsByName( expando ).length === 2 +
			// buggy browsers will return more than the correct 0
			doc.getElementsByName( expando + 0 ).length;
		support.getIdNotName = !doc.getElementById( expando );

		// Cleanup
		docElem.removeChild( div );

		return pass;
	});

	// IE6/7 return modified attributes
	Expr.attrHandle = assert(function( div ) {
		div.innerHTML = "<a href='#'></a>";
		return div.firstChild && typeof div.firstChild.getAttribute !== strundefined &&
			div.firstChild.getAttribute("href") === "#";
	}) ?
		{} :
		{
			"href": function( elem ) {
				return elem.getAttribute( "href", 2 );
			},
			"type": function( elem ) {
				return elem.getAttribute("type");
			}
		};

	// ID find and filter
	if ( support.getIdNotName ) {
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== strundefined && !documentIsXML ) {
				var m = context.getElementById( id );
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return m && m.parentNode ? [m] : [];
			}
		};
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
	} else {
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== strundefined && !documentIsXML ) {
				var m = context.getElementById( id );

				return m ?
					m.id === id || typeof m.getAttributeNode !== strundefined && m.getAttributeNode("id").value === id ?
						[m] :
						undefined :
					[];
			}
		};
		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};
	}

	// Tag
	Expr.find["TAG"] = support.tagNameNoComments ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== strundefined ) {
				return context.getElementsByTagName( tag );
			}
		} :
		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Name
	Expr.find["NAME"] = support.getByName && function( tag, context ) {
		if ( typeof context.getElementsByName !== strundefined ) {
			return context.getElementsByName( name );
		}
	};

	// Class
	Expr.find["CLASS"] = support.getByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== strundefined && !documentIsXML ) {
			return context.getElementsByClassName( className );
		}
	};

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21),
	// no need to also add to buggyMatches since matches checks buggyQSA
	// A support test would require too much code (would include document ready)
	rbuggyQSA = [ ":focus" ];

	if ( (support.qsa = isNative(doc.querySelectorAll)) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( div ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explictly
			// setting a boolean content attribute,
			// since its presence should be enough
			// http://bugs.jquery.com/ticket/12359
			div.innerHTML = "<select><option selected=''></option></select>";

			// IE8 - Some boolean attributes are not treated correctly
			if ( !div.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:checked|disabled|ismap|multiple|readonly|selected|value)" );
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}
		});

		assert(function( div ) {

			// Opera 10-12/IE8 - ^= $= *= and empty values
			// Should not select anything
			div.innerHTML = "<input type='hidden' i=''/>";
			if ( div.querySelectorAll("[i^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:\"\"|'')" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":enabled").length ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			div.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = isNative( (matches = docElem.matchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.webkitMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( div ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( div, "div" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( div, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = new RegExp( rbuggyMatches.join("|") );

	// Element contains another
	// Purposefully does not implement inclusive descendent
	// As in, an element does not contain itself
	contains = isNative(docElem.contains) || docElem.compareDocumentPosition ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	// Document order sorting
	sortOrder = docElem.compareDocumentPosition ?
	function( a, b ) {
		var compare;

		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		if ( (compare = b.compareDocumentPosition && a.compareDocumentPosition && a.compareDocumentPosition( b )) ) {
			if ( compare & 1 || a.parentNode && a.parentNode.nodeType === 11 ) {
				if ( a === doc || contains( preferredDoc, a ) ) {
					return -1;
				}
				if ( b === doc || contains( preferredDoc, b ) ) {
					return 1;
				}
				return 0;
			}
			return compare & 4 ? -1 : 1;
		}

		return a.compareDocumentPosition ? -1 : 1;
	} :
	function( a, b ) {
		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;

		// Parentless nodes are either documents or disconnected
		} else if ( !aup || !bup ) {
			return a === doc ? -1 :
				b === doc ? 1 :
				aup ? -1 :
				bup ? 1 :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	// Always assume the presence of duplicates if sort doesn't
	// pass them to our comparison function (as in Google Chrome).
	hasDuplicate = false;
	[0, 0].sort( sortOrder );
	support.detectDuplicates = hasDuplicate;

	return document;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	// rbuggyQSA always contains :focus, so no need for an existence check
	if ( support.matchesSelector && !documentIsXML && (!rbuggyMatches || !rbuggyMatches.test(expr)) && !rbuggyQSA.test(expr) ) {
		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch(e) {}
	}

	return Sizzle( expr, document, null, [elem] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	var val;

	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	if ( !documentIsXML ) {
		name = name.toLowerCase();
	}
	if ( (val = Expr.attrHandle[ name ]) ) {
		return val( elem );
	}
	if ( documentIsXML || support.attributes ) {
		return elem.getAttribute( name );
	}
	return ( (val = elem.getAttributeNode( name )) || elem.getAttribute( name ) ) && elem[ name ] === true ?
		name :
		val && val.specified ? val.value : null;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

// Document sorting and removing duplicates
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		i = 1,
		j = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		for ( ; (elem = results[i]); i++ ) {
			if ( elem === results[ i - 1 ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	return results;
};

function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && ( ~b.sourceIndex || MAX_NEGATIVE ) - ( ~a.sourceIndex || MAX_NEGATIVE );

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

// Returns a function to use in pseudos for input types
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

// Returns a function to use in pseudos for buttons
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

// Returns a function to use in pseudos for positionals
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		for ( ; (node = elem[i]); i++ ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (see #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[5] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[4] ) {
				match[2] = match[4];

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeName ) {
			if ( nodeName === "*" ) {
				return function() { return true; };
			}

			nodeName = nodeName.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
			};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( elem.className || (typeof elem.getAttribute !== strundefined && elem.getAttribute("class")) || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, outerCache, node, diff, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) {
										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {
							// Seek `elem` from a previously-cached index
							outerCache = parent[ expando ] || (parent[ expando ] = {});
							cache = outerCache[ type ] || [];
							nodeIndex = cache[0] === dirruns && cache[1];
							diff = cache[0] === dirruns && cache[2];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									outerCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						// Use previously-cached element index if available
						} else if ( useCache && (cache = (elem[ expando ] || (elem[ expando ] = {}))[ type ]) && cache[0] === dirruns ) {
							diff = cache[1];

						// xml :nth-child(...) or :nth-last-child(...) or :nth(-last)?-of-type(...)
						} else {
							// Use the same loop as above to seek `elem` from the start
							while ( (node = ++nodeIndex && node && node[ dir ] ||
								(diff = nodeIndex = 0) || start.pop()) ) {

								if ( ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) && ++diff ) {
									// Cache the index of each encountered element
									if ( useCache ) {
										(node[ expando ] || (node[ expando ] = {}))[ type ] = [ dirruns, diff ];
									}

									if ( node === elem ) {
										break;
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf.call( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifider
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsXML ?
						elem.getAttribute("xml:lang") || elem.getAttribute("lang") :
						elem.lang) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": function( elem ) {
			return elem.disabled === false;
		},

		"disabled": function( elem ) {
			return elem.disabled === true;
		},

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is only affected by element nodes and content nodes(including text(3), cdata(4)),
			//   not comment, processing instructions, or others
			// Thanks to Diego Perini for the nodeName shortcut
			//   Greater than "@" means alpha characters (specifically not starting with "#" or "?")
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeName > "@" || elem.nodeType === 3 || elem.nodeType === 4 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			// IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc)
			// use getAttribute instead to test this case
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === elem.type );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

function tokenize( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( tokens = [] );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push( {
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			} );
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push( {
					value: matched,
					type: type,
					matches: match
				} );
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
}

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		checkNonElements = base && dir === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var data, cache, outerCache,
				dirkey = dirruns + " " + doneName;

			// We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});
						if ( (cache = outerCache[ dir ]) && cache[0] === dirkey ) {
							if ( (data = cache[1]) === true || data === cachedruns ) {
								return data === true;
							}
						} else {
							cache = outerCache[ dir ] = [ dirkey ];
							cache[1] = matcher( elem, context, xml ) || cachedruns;
							if ( cache[1] === true ) {
								return true;
							}
						}
					}
				}
			}
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf.call( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf.call( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			return ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector( tokens.slice( 0, i - 1 ) ).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	// A counter to specify which element is currently being matched
	var matcherCachedRuns = 0,
		bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, expandContext ) {
			var elem, j, matcher,
				setMatched = [],
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				outermost = expandContext != null,
				contextBackup = outermostContext,
				// We must always have either seed elements or context
				elems = seed || byElement && Expr.find["TAG"]( "*", expandContext && context.parentNode || context ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1);

			if ( outermost ) {
				outermostContext = context !== document && context;
				cachedruns = matcherCachedRuns;
			}

			// Add elements passing elementMatchers directly to results
			// Keep `i` a string if there are no elements so `matchedCount` will be "00" below
			for ( ; (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context, xml ) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
						cachedruns = ++matcherCachedRuns;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// Apply set filters to unmatched elements
			matchedCount += i;
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, group /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !group ) {
			group = tokenize( selector );
		}
		i = group.length;
		while ( i-- ) {
			cached = matcherFromTokens( group[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );
	}
	return cached;
};

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function select( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		match = tokenize( selector );

	if ( !seed ) {
		// Try to minimize operations if there is only one group
		if ( match.length === 1 ) {

			// Take a shortcut and set the context if the root selector is an ID
			tokens = match[0] = match[0].slice( 0 );
			if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
					context.nodeType === 9 && !documentIsXML &&
					Expr.relative[ tokens[1].type ] ) {

				context = Expr.find["ID"]( token.matches[0].replace( runescape, funescape ), context )[0];
				if ( !context ) {
					return results;
				}

				selector = selector.slice( tokens.shift().value.length );
			}

			// Fetch a seed set for right-to-left matching
			i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
			while ( i-- ) {
				token = tokens[i];

				// Abort if we hit a combinator
				if ( Expr.relative[ (type = token.type) ] ) {
					break;
				}
				if ( (find = Expr.find[ type ]) ) {
					// Search, expanding context for leading sibling combinators
					if ( (seed = find(
						token.matches[0].replace( runescape, funescape ),
						rsibling.test( tokens[0].type ) && context.parentNode || context
					)) ) {

						// If seed is empty or no tokens remain, we can return early
						tokens.splice( i, 1 );
						selector = seed.length && toSelector( tokens );
						if ( !selector ) {
							push.apply( results, slice.call( seed, 0 ) );
							return results;
						}

						break;
					}
				}
			}
		}
	}

	// Compile and execute a filtering function
	// Provide `match` to avoid retokenization if we modified the selector above
	compile( selector, match )(
		seed,
		context,
		documentIsXML,
		results,
		rsibling.test( selector )
	);
	return results;
}

// Deprecated
Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Easy API for creating new setFilters
function setFilters() {}
Expr.filters = setFilters.prototype = Expr.pseudos;
Expr.setFilters = new setFilters();

// Initialize with the default document
setDocument();

// Override sizzle attribute retrieval
Sizzle.attr = jQuery.attr;
jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.pseudos;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;


})( window );
var runtil = /Until$/,
	rparentsprev = /^(?:parents|prev(?:Until|All))/,
	isSimple = /^.[^:#\[\.,]*$/,
	rneedsContext = jQuery.expr.match.needsContext,
	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend({
	find: function( selector ) {
		var i, ret, self,
			len = this.length;

		if ( typeof selector !== "string" ) {
			self = this;
			return this.pushStack( jQuery( selector ).filter(function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			}) );
		}

		ret = [];
		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, this[ i ], ret );
		}

		// Needed because $( selector, context ) becomes $( context ).find( selector )
		ret = this.pushStack( len > 1 ? jQuery.unique( ret ) : ret );
		ret.selector = ( this.selector ? this.selector + " " : "" ) + selector;
		return ret;
	},

	has: function( target ) {
		var i,
			targets = jQuery( target, this ),
			len = targets.length;

		return this.filter(function() {
			for ( i = 0; i < len; i++ ) {
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},

	not: function( selector ) {
		return this.pushStack( winnow(this, selector, false) );
	},

	filter: function( selector ) {
		return this.pushStack( winnow(this, selector, true) );
	},

	is: function( selector ) {
		return !!selector && (
			typeof selector === "string" ?
				// If this is a positional/relative selector, check membership in the returned set
				// so $("p:first").is("p:last") won't return true for a doc with two "p".
				rneedsContext.test( selector ) ?
					jQuery( selector, this.context ).index( this[0] ) >= 0 :
					jQuery.filter( selector, this ).length > 0 :
				this.filter( selector ).length > 0 );
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			ret = [],
			pos = rneedsContext.test( selectors ) || typeof selectors !== "string" ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( ; i < l; i++ ) {
			cur = this[i];

			while ( cur && cur.ownerDocument && cur !== context && cur.nodeType !== 11 ) {
				if ( pos ? pos.index(cur) > -1 : jQuery.find.matchesSelector(cur, selectors) ) {
					ret.push( cur );
					break;
				}
				cur = cur.parentNode;
			}
		}

		return this.pushStack( ret.length > 1 ? jQuery.unique( ret ) : ret );
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[0] && this[0].parentNode ) ? this.first().prevAll().length : -1;
		}

		// index in selector
		if ( typeof elem === "string" ) {
			return jQuery.inArray( this[0], jQuery( elem ) );
		}

		// Locate the position of the desired element
		return jQuery.inArray(
			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[0] : elem, this );
	},

	add: function( selector, context ) {
		var set = typeof selector === "string" ?
				jQuery( selector, context ) :
				jQuery.makeArray( selector && selector.nodeType ? [ selector ] : selector ),
			all = jQuery.merge( this.get(), set );

		return this.pushStack( jQuery.unique(all) );
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter(selector)
		);
	}
});

jQuery.fn.andSelf = jQuery.fn.addBack;

function sibling( cur, dir ) {
	do {
		cur = cur[ dir ];
	} while ( cur && cur.nodeType !== 1 );

	return cur;
}

jQuery.each({
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return jQuery.dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return jQuery.sibling( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return jQuery.sibling( elem.firstChild );
	},
	contents: function( elem ) {
		return jQuery.nodeName( elem, "iframe" ) ?
			elem.contentDocument || elem.contentWindow.document :
			jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var ret = jQuery.map( this, fn, until );

		if ( !runtil.test( name ) ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			ret = jQuery.filter( selector, ret );
		}

		ret = this.length > 1 && !guaranteedUnique[ name ] ? jQuery.unique( ret ) : ret;

		if ( this.length > 1 && rparentsprev.test( name ) ) {
			ret = ret.reverse();
		}

		return this.pushStack( ret );
	};
});

jQuery.extend({
	filter: function( expr, elems, not ) {
		if ( not ) {
			expr = ":not(" + expr + ")";
		}

		return elems.length === 1 ?
			jQuery.find.matchesSelector(elems[0], expr) ? [ elems[0] ] : [] :
			jQuery.find.matches(expr, elems);
	},

	dir: function( elem, dir, until ) {
		var matched = [],
			cur = elem[ dir ];

		while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
			if ( cur.nodeType === 1 ) {
				matched.push( cur );
			}
			cur = cur[dir];
		}
		return matched;
	},

	sibling: function( n, elem ) {
		var r = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				r.push( n );
			}
		}

		return r;
	}
});

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, keep ) {

	// Can't pass null or undefined to indexOf in Firefox 4
	// Set to 0 to skip string check
	qualifier = qualifier || 0;

	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep(elements, function( elem, i ) {
			var retVal = !!qualifier.call( elem, i, elem );
			return retVal === keep;
		});

	} else if ( qualifier.nodeType ) {
		return jQuery.grep(elements, function( elem ) {
			return ( elem === qualifier ) === keep;
		});

	} else if ( typeof qualifier === "string" ) {
		var filtered = jQuery.grep(elements, function( elem ) {
			return elem.nodeType === 1;
		});

		if ( isSimple.test( qualifier ) ) {
			return jQuery.filter(qualifier, filtered, !keep);
		} else {
			qualifier = jQuery.filter( qualifier, filtered );
		}
	}

	return jQuery.grep(elements, function( elem ) {
		return ( jQuery.inArray( elem, qualifier ) >= 0 ) === keep;
	});
}
function createSafeFragment( document ) {
	var list = nodeNames.split( "|" ),
		safeFrag = document.createDocumentFragment();

	if ( safeFrag.createElement ) {
		while ( list.length ) {
			safeFrag.createElement(
				list.pop()
			);
		}
	}
	return safeFrag;
}

var nodeNames = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|" +
		"header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
	rinlinejQuery = / jQuery\d+="(?:null|\d+)"/g,
	rnoshimcache = new RegExp("<(?:" + nodeNames + ")[\\s/>]", "i"),
	rleadingWhitespace = /^\s+/,
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
	rtagName = /<([\w:]+)/,
	rtbody = /<tbody/i,
	rhtml = /<|&#?\w+;/,
	rnoInnerhtml = /<(?:script|style|link)/i,
	manipulation_rcheckableType = /^(?:checkbox|radio)$/i,
	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptType = /^$|\/(?:java|ecma)script/i,
	rscriptTypeMasked = /^true\/(.*)/,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,

	// We have to close these tags to support XHTML (#13200)
	wrapMap = {
		option: [ 1, "<select multiple='multiple'>", "</select>" ],
		legend: [ 1, "<fieldset>", "</fieldset>" ],
		area: [ 1, "<map>", "</map>" ],
		param: [ 1, "<object>", "</object>" ],
		thead: [ 1, "<table>", "</table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

		// IE6-8 can't serialize link, script, style, or any html5 (NoScope) tags,
		// unless wrapped in a div with non-breaking characters in front of it.
		_default: jQuery.support.htmlSerialize ? [ 0, "", "" ] : [ 1, "X<div>", "</div>"  ]
	},
	safeFragment = createSafeFragment( document ),
	fragmentDiv = safeFragment.appendChild( document.createElement("div") );

wrapMap.optgroup = wrapMap.option;
wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

jQuery.fn.extend({
	text: function( value ) {
		return jQuery.access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().append( ( this[0] && this[0].ownerDocument || document ).createTextNode( value ) );
		}, null, value, arguments.length );
	},

	wrapAll: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapAll( html.call(this, i) );
			});
		}

		if ( this[0] ) {
			// The elements to wrap the target around
			var wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone(true);

			if ( this[0].parentNode ) {
				wrap.insertBefore( this[0] );
			}

			wrap.map(function() {
				var elem = this;

				while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
					elem = elem.firstChild;
				}

				return elem;
			}).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapInner( html.call(this, i) );
			});
		}

		return this.each(function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		});
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each(function(i) {
			jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	},

	append: function() {
		return this.domManip(arguments, true, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				this.appendChild( elem );
			}
		});
	},

	prepend: function() {
		return this.domManip(arguments, true, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				this.insertBefore( elem, this.firstChild );
			}
		});
	},

	before: function() {
		return this.domManip( arguments, false, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		});
	},

	after: function() {
		return this.domManip( arguments, false, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		});
	},

	// keepData is for internal use only--do not document
	remove: function( selector, keepData ) {
		var elem,
			i = 0;

		for ( ; (elem = this[i]) != null; i++ ) {
			if ( !selector || jQuery.filter( selector, [ elem ] ).length > 0 ) {
				if ( !keepData && elem.nodeType === 1 ) {
					jQuery.cleanData( getAll( elem ) );
				}

				if ( elem.parentNode ) {
					if ( keepData && jQuery.contains( elem.ownerDocument, elem ) ) {
						setGlobalEval( getAll( elem, "script" ) );
					}
					elem.parentNode.removeChild( elem );
				}
			}
		}

		return this;
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; (elem = this[i]) != null; i++ ) {
			// Remove element nodes and prevent memory leaks
			if ( elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem, false ) );
			}

			// Remove any remaining nodes
			while ( elem.firstChild ) {
				elem.removeChild( elem.firstChild );
			}

			// If this is a select, ensure that it displays empty (#12336)
			// Support: IE<9
			if ( elem.options && jQuery.nodeName( elem, "select" ) ) {
				elem.options.length = 0;
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function () {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		});
	},

	html: function( value ) {
		return jQuery.access( this, function( value ) {
			var elem = this[0] || {},
				i = 0,
				l = this.length;

			if ( value === undefined ) {
				return elem.nodeType === 1 ?
					elem.innerHTML.replace( rinlinejQuery, "" ) :
					undefined;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				( jQuery.support.htmlSerialize || !rnoshimcache.test( value )  ) &&
				( jQuery.support.leadingWhitespace || !rleadingWhitespace.test( value ) ) &&
				!wrapMap[ ( rtagName.exec( value ) || ["", ""] )[1].toLowerCase() ] ) {

				value = value.replace( rxhtmlTag, "<$1></$2>" );

				try {
					for (; i < l; i++ ) {
						// Remove element nodes and prevent memory leaks
						elem = this[i] || {};
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch(e) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function( value ) {
		var isFunc = jQuery.isFunction( value );

		// Make sure that the elements are removed from the DOM before they are inserted
		// this can help fix replacing a parent with child elements
		if ( !isFunc && typeof value !== "string" ) {
			value = jQuery( value ).not( this ).detach();
		}

		return this.domManip( [ value ], true, function( elem ) {
			var next = this.nextSibling,
				parent = this.parentNode;

			if ( parent ) {
				jQuery( this ).remove();
				parent.insertBefore( elem, next );
			}
		});
	},

	detach: function( selector ) {
		return this.remove( selector, true );
	},

	domManip: function( args, table, callback ) {

		// Flatten any nested arrays
		args = core_concat.apply( [], args );

		var first, node, hasScripts,
			scripts, doc, fragment,
			i = 0,
			l = this.length,
			set = this,
			iNoClone = l - 1,
			value = args[0],
			isFunction = jQuery.isFunction( value );

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( isFunction || !( l <= 1 || typeof value !== "string" || jQuery.support.checkClone || !rchecked.test( value ) ) ) {
			return this.each(function( index ) {
				var self = set.eq( index );
				if ( isFunction ) {
					args[0] = value.call( this, index, table ? self.html() : undefined );
				}
				self.domManip( args, table, callback );
			});
		}

		if ( l ) {
			fragment = jQuery.buildFragment( args, this[ 0 ].ownerDocument, false, this );
			first = fragment.firstChild;

			if ( fragment.childNodes.length === 1 ) {
				fragment = first;
			}

			if ( first ) {
				table = table && jQuery.nodeName( first, "tr" );
				scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
				hasScripts = scripts.length;

				// Use the original fragment for the last item instead of the first because it can end up
				// being emptied incorrectly in certain situations (#8070).
				for ( ; i < l; i++ ) {
					node = fragment;

					if ( i !== iNoClone ) {
						node = jQuery.clone( node, true, true );

						// Keep references to cloned scripts for later restoration
						if ( hasScripts ) {
							jQuery.merge( scripts, getAll( node, "script" ) );
						}
					}

					callback.call(
						table && jQuery.nodeName( this[i], "table" ) ?
							findOrAppend( this[i], "tbody" ) :
							this[i],
						node,
						i
					);
				}

				if ( hasScripts ) {
					doc = scripts[ scripts.length - 1 ].ownerDocument;

					// Reenable scripts
					jQuery.map( scripts, restoreScript );

					// Evaluate executable scripts on first document insertion
					for ( i = 0; i < hasScripts; i++ ) {
						node = scripts[ i ];
						if ( rscriptType.test( node.type || "" ) &&
							!jQuery._data( node, "globalEval" ) && jQuery.contains( doc, node ) ) {

							if ( node.src ) {
								// Hope ajax is available...
								jQuery.ajax({
									url: node.src,
									type: "GET",
									dataType: "script",
									async: false,
									global: false,
									"throws": true
								});
							} else {
								jQuery.globalEval( ( node.text || node.textContent || node.innerHTML || "" ).replace( rcleanScript, "" ) );
							}
						}
					}
				}

				// Fix #11809: Avoid leaking memory
				fragment = first = null;
			}
		}

		return this;
	}
});

function findOrAppend( elem, tag ) {
	return elem.getElementsByTagName( tag )[0] || elem.appendChild( elem.ownerDocument.createElement( tag ) );
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	var attr = elem.getAttributeNode("type");
	elem.type = ( attr && attr.specified ) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	var match = rscriptTypeMasked.exec( elem.type );
	if ( match ) {
		elem.type = match[1];
	} else {
		elem.removeAttribute("type");
	}
	return elem;
}

// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var elem,
		i = 0;
	for ( ; (elem = elems[i]) != null; i++ ) {
		jQuery._data( elem, "globalEval", !refElements || jQuery._data( refElements[i], "globalEval" ) );
	}
}

function cloneCopyEvent( src, dest ) {

	if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
		return;
	}

	var type, i, l,
		oldData = jQuery._data( src ),
		curData = jQuery._data( dest, oldData ),
		events = oldData.events;

	if ( events ) {
		delete curData.handle;
		curData.events = {};

		for ( type in events ) {
			for ( i = 0, l = events[ type ].length; i < l; i++ ) {
				jQuery.event.add( dest, type, events[ type ][ i ] );
			}
		}
	}

	// make the cloned public data object a copy from the original
	if ( curData.data ) {
		curData.data = jQuery.extend( {}, curData.data );
	}
}

function fixCloneNodeIssues( src, dest ) {
	var nodeName, e, data;

	// We do not need to do anything for non-Elements
	if ( dest.nodeType !== 1 ) {
		return;
	}

	nodeName = dest.nodeName.toLowerCase();

	// IE6-8 copies events bound via attachEvent when using cloneNode.
	if ( !jQuery.support.noCloneEvent && dest[ jQuery.expando ] ) {
		data = jQuery._data( dest );

		for ( e in data.events ) {
			jQuery.removeEvent( dest, e, data.handle );
		}

		// Event data gets referenced instead of copied if the expando gets copied too
		dest.removeAttribute( jQuery.expando );
	}

	// IE blanks contents when cloning scripts, and tries to evaluate newly-set text
	if ( nodeName === "script" && dest.text !== src.text ) {
		disableScript( dest ).text = src.text;
		restoreScript( dest );

	// IE6-10 improperly clones children of object elements using classid.
	// IE10 throws NoModificationAllowedError if parent is null, #12132.
	} else if ( nodeName === "object" ) {
		if ( dest.parentNode ) {
			dest.outerHTML = src.outerHTML;
		}

		// This path appears unavoidable for IE9. When cloning an object
		// element in IE9, the outerHTML strategy above is not sufficient.
		// If the src has innerHTML and the destination does not,
		// copy the src.innerHTML into the dest.innerHTML. #10324
		if ( jQuery.support.html5Clone && ( src.innerHTML && !jQuery.trim(dest.innerHTML) ) ) {
			dest.innerHTML = src.innerHTML;
		}

	} else if ( nodeName === "input" && manipulation_rcheckableType.test( src.type ) ) {
		// IE6-8 fails to persist the checked state of a cloned checkbox
		// or radio button. Worse, IE6-7 fail to give the cloned element
		// a checked appearance if the defaultChecked value isn't also set

		dest.defaultChecked = dest.checked = src.checked;

		// IE6-7 get confused and end up setting the value of a cloned
		// checkbox/radio button to an empty string instead of "on"
		if ( dest.value !== src.value ) {
			dest.value = src.value;
		}

	// IE6-8 fails to return the selected option to the default selected
	// state when cloning options
	} else if ( nodeName === "option" ) {
		dest.defaultSelected = dest.selected = src.defaultSelected;

	// IE6-8 fails to set the defaultValue to the correct value when
	// cloning other types of input fields
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			i = 0,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone(true);
			jQuery( insert[i] )[ original ]( elems );

			// Modern browsers can apply jQuery collections as arrays, but oldIE needs a .get()
			core_push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
});

function getAll( context, tag ) {
	var elems, elem,
		i = 0,
		found = typeof context.getElementsByTagName !== core_strundefined ? context.getElementsByTagName( tag || "*" ) :
			typeof context.querySelectorAll !== core_strundefined ? context.querySelectorAll( tag || "*" ) :
			undefined;

	if ( !found ) {
		for ( found = [], elems = context.childNodes || context; (elem = elems[i]) != null; i++ ) {
			if ( !tag || jQuery.nodeName( elem, tag ) ) {
				found.push( elem );
			} else {
				jQuery.merge( found, getAll( elem, tag ) );
			}
		}
	}

	return tag === undefined || tag && jQuery.nodeName( context, tag ) ?
		jQuery.merge( [ context ], found ) :
		found;
}

// Used in buildFragment, fixes the defaultChecked property
function fixDefaultChecked( elem ) {
	if ( manipulation_rcheckableType.test( elem.type ) ) {
		elem.defaultChecked = elem.checked;
	}
}

jQuery.extend({
	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var destElements, node, clone, i, srcElements,
			inPage = jQuery.contains( elem.ownerDocument, elem );

		if ( jQuery.support.html5Clone || jQuery.isXMLDoc(elem) || !rnoshimcache.test( "<" + elem.nodeName + ">" ) ) {
			clone = elem.cloneNode( true );

		// IE<=8 does not properly clone detached, unknown element nodes
		} else {
			fragmentDiv.innerHTML = elem.outerHTML;
			fragmentDiv.removeChild( clone = fragmentDiv.firstChild );
		}

		if ( (!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) &&
				(elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem) ) {

			// We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			// Fix all IE cloning issues
			for ( i = 0; (node = srcElements[i]) != null; ++i ) {
				// Ensure that the destination node is not null; Fixes #9587
				if ( destElements[i] ) {
					fixCloneNodeIssues( node, destElements[i] );
				}
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0; (node = srcElements[i]) != null; i++ ) {
					cloneCopyEvent( node, destElements[i] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		destElements = srcElements = node = null;

		// Return the cloned set
		return clone;
	},

	buildFragment: function( elems, context, scripts, selection ) {
		var j, elem, contains,
			tmp, tag, tbody, wrap,
			l = elems.length,

			// Ensure a safe fragment
			safe = createSafeFragment( context ),

			nodes = [],
			i = 0;

		for ( ; i < l; i++ ) {
			elem = elems[ i ];

			if ( elem || elem === 0 ) {

				// Add nodes directly
				if ( jQuery.type( elem ) === "object" ) {
					jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

				// Convert non-html into a text node
				} else if ( !rhtml.test( elem ) ) {
					nodes.push( context.createTextNode( elem ) );

				// Convert html into DOM nodes
				} else {
					tmp = tmp || safe.appendChild( context.createElement("div") );

					// Deserialize a standard representation
					tag = ( rtagName.exec( elem ) || ["", ""] )[1].toLowerCase();
					wrap = wrapMap[ tag ] || wrapMap._default;

					tmp.innerHTML = wrap[1] + elem.replace( rxhtmlTag, "<$1></$2>" ) + wrap[2];

					// Descend through wrappers to the right content
					j = wrap[0];
					while ( j-- ) {
						tmp = tmp.lastChild;
					}

					// Manually add leading whitespace removed by IE
					if ( !jQuery.support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
						nodes.push( context.createTextNode( rleadingWhitespace.exec( elem )[0] ) );
					}

					// Remove IE's autoinserted <tbody> from table fragments
					if ( !jQuery.support.tbody ) {

						// String was a <table>, *may* have spurious <tbody>
						elem = tag === "table" && !rtbody.test( elem ) ?
							tmp.firstChild :

							// String was a bare <thead> or <tfoot>
							wrap[1] === "<table>" && !rtbody.test( elem ) ?
								tmp :
								0;

						j = elem && elem.childNodes.length;
						while ( j-- ) {
							if ( jQuery.nodeName( (tbody = elem.childNodes[j]), "tbody" ) && !tbody.childNodes.length ) {
								elem.removeChild( tbody );
							}
						}
					}

					jQuery.merge( nodes, tmp.childNodes );

					// Fix #12392 for WebKit and IE > 9
					tmp.textContent = "";

					// Fix #12392 for oldIE
					while ( tmp.firstChild ) {
						tmp.removeChild( tmp.firstChild );
					}

					// Remember the top-level container for proper cleanup
					tmp = safe.lastChild;
				}
			}
		}

		// Fix #11356: Clear elements from fragment
		if ( tmp ) {
			safe.removeChild( tmp );
		}

		// Reset defaultChecked for any radios and checkboxes
		// about to be appended to the DOM in IE 6/7 (#8060)
		if ( !jQuery.support.appendChecked ) {
			jQuery.grep( getAll( nodes, "input" ), fixDefaultChecked );
		}

		i = 0;
		while ( (elem = nodes[ i++ ]) ) {

			// #4087 - If origin and destination elements are the same, and this is
			// that element, do not do anything
			if ( selection && jQuery.inArray( elem, selection ) !== -1 ) {
				continue;
			}

			contains = jQuery.contains( elem.ownerDocument, elem );

			// Append to fragment
			tmp = getAll( safe.appendChild( elem ), "script" );

			// Preserve script evaluation history
			if ( contains ) {
				setGlobalEval( tmp );
			}

			// Capture executables
			if ( scripts ) {
				j = 0;
				while ( (elem = tmp[ j++ ]) ) {
					if ( rscriptType.test( elem.type || "" ) ) {
						scripts.push( elem );
					}
				}
			}
		}

		tmp = null;

		return safe;
	},

	cleanData: function( elems, /* internal */ acceptData ) {
		var elem, type, id, data,
			i = 0,
			internalKey = jQuery.expando,
			cache = jQuery.cache,
			deleteExpando = jQuery.support.deleteExpando,
			special = jQuery.event.special;

		for ( ; (elem = elems[i]) != null; i++ ) {

			if ( acceptData || jQuery.acceptData( elem ) ) {

				id = elem[ internalKey ];
				data = id && cache[ id ];

				if ( data ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Remove cache only if it was not already removed by jQuery.event.remove
					if ( cache[ id ] ) {

						delete cache[ id ];

						// IE does not allow us to delete expando properties from nodes,
						// nor does it have a removeAttribute function on Document nodes;
						// we must handle all of these cases
						if ( deleteExpando ) {
							delete elem[ internalKey ];

						} else if ( typeof elem.removeAttribute !== core_strundefined ) {
							elem.removeAttribute( internalKey );

						} else {
							elem[ internalKey ] = null;
						}

						core_deletedIds.push( id );
					}
				}
			}
		}
	}
});
var iframe, getStyles, curCSS,
	ralpha = /alpha\([^)]*\)/i,
	ropacity = /opacity\s*=\s*([^)]*)/,
	rposition = /^(top|right|bottom|left)$/,
	// swappable if display is none or starts with table except "table", "table-cell", or "table-caption"
	// see here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rmargin = /^margin/,
	rnumsplit = new RegExp( "^(" + core_pnum + ")(.*)$", "i" ),
	rnumnonpx = new RegExp( "^(" + core_pnum + ")(?!px)[a-z%]+$", "i" ),
	rrelNum = new RegExp( "^([+-])=(" + core_pnum + ")", "i" ),
	elemdisplay = { BODY: "block" },

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: 0,
		fontWeight: 400
	},

	cssExpand = [ "Top", "Right", "Bottom", "Left" ],
	cssPrefixes = [ "Webkit", "O", "Moz", "ms" ];

// return a css property mapped to a potentially vendor prefixed property
function vendorPropName( style, name ) {

	// shortcut for names that are not vendor prefixed
	if ( name in style ) {
		return name;
	}

	// check for vendor prefixed names
	var capName = name.charAt(0).toUpperCase() + name.slice(1),
		origName = name,
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in style ) {
			return name;
		}
	}

	return origName;
}

function isHidden( elem, el ) {
	// isHidden might be called from jQuery#filter function;
	// in that case, element will be second argument
	elem = el || elem;
	return jQuery.css( elem, "display" ) === "none" || !jQuery.contains( elem.ownerDocument, elem );
}

function showHide( elements, show ) {
	var display, elem, hidden,
		values = [],
		index = 0,
		length = elements.length;

	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		values[ index ] = jQuery._data( elem, "olddisplay" );
		display = elem.style.display;
		if ( show ) {
			// Reset the inline display of this element to learn if it is
			// being hidden by cascaded rules or not
			if ( !values[ index ] && display === "none" ) {
				elem.style.display = "";
			}

			// Set elements which have been overridden with display: none
			// in a stylesheet to whatever the default browser style is
			// for such an element
			if ( elem.style.display === "" && isHidden( elem ) ) {
				values[ index ] = jQuery._data( elem, "olddisplay", css_defaultDisplay(elem.nodeName) );
			}
		} else {

			if ( !values[ index ] ) {
				hidden = isHidden( elem );

				if ( display && display !== "none" || !hidden ) {
					jQuery._data( elem, "olddisplay", hidden ? display : jQuery.css( elem, "display" ) );
				}
			}
		}
	}

	// Set the display of most of the elements in a second loop
	// to avoid the constant reflow
	for ( index = 0; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}
		if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
			elem.style.display = show ? values[ index ] || "" : "none";
		}
	}

	return elements;
}

jQuery.fn.extend({
	css: function( name, value ) {
		return jQuery.access( this, function( elem, name, value ) {
			var len, styles,
				map = {},
				i = 0;

			if ( jQuery.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	},
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		var bool = typeof state === "boolean";

		return this.each(function() {
			if ( bool ? state : isHidden( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		});
	}
});

jQuery.extend({
	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {
					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Exclude the following css properties to add px
	cssNumber: {
		"columnCount": true,
		"fillOpacity": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		// normalize float css property
		"float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {
		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = jQuery.camelCase( name ),
			style = elem.style;

		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// convert relative number strings (+= or -=) to relative numbers. #7345
			if ( type === "string" && (ret = rrelNum.exec( value )) ) {
				value = ( ret[1] + 1 ) * ret[2] + parseFloat( jQuery.css( elem, name ) );
				// Fixes bug #9237
				type = "number";
			}

			// Make sure that NaN and null values aren't set. See: #7116
			if ( value == null || type === "number" && isNaN( value ) ) {
				return;
			}

			// If a number was passed in, add 'px' to the (except for certain CSS properties)
			if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
				value += "px";
			}

			// Fixes #8908, it can be done more correctly by specifing setters in cssHooks,
			// but it would mean to define eight (for every problematic property) identical functions
			if ( !jQuery.support.clearCloneStyle && value === "" && name.indexOf("background") === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value, extra )) !== undefined ) {

				// Wrapped to prevent IE from throwing errors when 'invalid' values are provided
				// Fixes bug #5509
				try {
					style[ name ] = value;
				} catch(e) {}
			}

		} else {
			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var num, val, hooks,
			origName = jQuery.camelCase( name );

		// Make sure that we're working with the right name
		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( elem.style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		//convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Return, converting to number if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || jQuery.isNumeric( num ) ? num || 0 : val;
		}
		return val;
	},

	// A method for quickly swapping in/out CSS properties to get correct calculations
	swap: function( elem, options, callback, args ) {
		var ret, name,
			old = {};

		// Remember the old values, and insert the new ones
		for ( name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		ret = callback.apply( elem, args || [] );

		// Revert the old values
		for ( name in options ) {
			elem.style[ name ] = old[ name ];
		}

		return ret;
	}
});

// NOTE: we've included the "window" in window.getComputedStyle
// because jsdom on node.js will break without it.
if ( window.getComputedStyle ) {
	getStyles = function( elem ) {
		return window.getComputedStyle( elem, null );
	};

	curCSS = function( elem, name, _computed ) {
		var width, minWidth, maxWidth,
			computed = _computed || getStyles( elem ),

			// getPropertyValue is only needed for .css('filter') in IE9, see #12537
			ret = computed ? computed.getPropertyValue( name ) || computed[ name ] : undefined,
			style = elem.style;

		if ( computed ) {

			if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
				ret = jQuery.style( elem, name );
			}

			// A tribute to the "awesome hack by Dean Edwards"
			// Chrome < 17 and Safari 5.0 uses "computed value" instead of "used value" for margin-right
			// Safari 5.1.7 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels
			// this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
			if ( rnumnonpx.test( ret ) && rmargin.test( name ) ) {

				// Remember the original values
				width = style.width;
				minWidth = style.minWidth;
				maxWidth = style.maxWidth;

				// Put in the new values to get a computed value out
				style.minWidth = style.maxWidth = style.width = ret;
				ret = computed.width;

				// Revert the changed values
				style.width = width;
				style.minWidth = minWidth;
				style.maxWidth = maxWidth;
			}
		}

		return ret;
	};
} else if ( document.documentElement.currentStyle ) {
	getStyles = function( elem ) {
		return elem.currentStyle;
	};

	curCSS = function( elem, name, _computed ) {
		var left, rs, rsLeft,
			computed = _computed || getStyles( elem ),
			ret = computed ? computed[ name ] : undefined,
			style = elem.style;

		// Avoid setting ret to empty string here
		// so we don't default to auto
		if ( ret == null && style && style[ name ] ) {
			ret = style[ name ];
		}

		// From the awesome hack by Dean Edwards
		// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

		// If we're not dealing with a regular pixel number
		// but a number that has a weird ending, we need to convert it to pixels
		// but not position css attributes, as those are proportional to the parent element instead
		// and we can't measure the parent instead because it might trigger a "stacking dolls" problem
		if ( rnumnonpx.test( ret ) && !rposition.test( name ) ) {

			// Remember the original values
			left = style.left;
			rs = elem.runtimeStyle;
			rsLeft = rs && rs.left;

			// Put in the new values to get a computed value out
			if ( rsLeft ) {
				rs.left = elem.currentStyle.left;
			}
			style.left = name === "fontSize" ? "1em" : ret;
			ret = style.pixelLeft + "px";

			// Revert the changed values
			style.left = left;
			if ( rsLeft ) {
				rs.left = rsLeft;
			}
		}

		return ret === "" ? "auto" : ret;
	};
}

function setPositiveNumber( elem, value, subtract ) {
	var matches = rnumsplit.exec( value );
	return matches ?
		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 1 ] - ( subtract || 0 ) ) + ( matches[ 2 ] || "px" ) :
		value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
	var i = extra === ( isBorderBox ? "border" : "content" ) ?
		// If we already have the right measurement, avoid augmentation
		4 :
		// Otherwise initialize for horizontal or vertical properties
		name === "width" ? 1 : 0,

		val = 0;

	for ( ; i < 4; i += 2 ) {
		// both box models exclude margin, so add it if we want it
		if ( extra === "margin" ) {
			val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
		}

		if ( isBorderBox ) {
			// border-box includes padding, so remove it if we want content
			if ( extra === "content" ) {
				val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// at this point, extra isn't border nor margin, so remove border
			if ( extra !== "margin" ) {
				val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		} else {
			// at this point, extra isn't content, so add padding
			val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// at this point, extra isn't content nor padding, so add border
			if ( extra !== "padding" ) {
				val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	return val;
}

function getWidthOrHeight( elem, name, extra ) {

	// Start with offset property, which is equivalent to the border-box value
	var valueIsBorderBox = true,
		val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		styles = getStyles( elem ),
		isBorderBox = jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

	// some non-html elements return undefined for offsetWidth, so check for null/undefined
	// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
	// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
	if ( val <= 0 || val == null ) {
		// Fall back to computed then uncomputed css if necessary
		val = curCSS( elem, name, styles );
		if ( val < 0 || val == null ) {
			val = elem.style[ name ];
		}

		// Computed unit is not pixels. Stop here and return.
		if ( rnumnonpx.test(val) ) {
			return val;
		}

		// we need the check for style in case a browser which returns unreliable values
		// for getComputedStyle silently falls back to the reliable elem.style
		valueIsBorderBox = isBorderBox && ( jQuery.support.boxSizingReliable || val === elem.style[ name ] );

		// Normalize "", auto, and prepare for extra
		val = parseFloat( val ) || 0;
	}

	// use the active box-sizing model to add/subtract irrelevant styles
	return ( val +
		augmentWidthOrHeight(
			elem,
			name,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles
		)
	) + "px";
}

// Try to determine the default display value of an element
function css_defaultDisplay( nodeName ) {
	var doc = document,
		display = elemdisplay[ nodeName ];

	if ( !display ) {
		display = actualDisplay( nodeName, doc );

		// If the simple way fails, read from inside an iframe
		if ( display === "none" || !display ) {
			// Use the already-created iframe if possible
			iframe = ( iframe ||
				jQuery("<iframe frameborder='0' width='0' height='0'/>")
				.css( "cssText", "display:block !important" )
			).appendTo( doc.documentElement );

			// Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
			doc = ( iframe[0].contentWindow || iframe[0].contentDocument ).document;
			doc.write("<!doctype html><html><body>");
			doc.close();

			display = actualDisplay( nodeName, doc );
			iframe.detach();
		}

		// Store the correct default display
		elemdisplay[ nodeName ] = display;
	}

	return display;
}

// Called ONLY from within css_defaultDisplay
function actualDisplay( name, doc ) {
	var elem = jQuery( doc.createElement( name ) ).appendTo( doc.body ),
		display = jQuery.css( elem[0], "display" );
	elem.remove();
	return display;
}

jQuery.each([ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {
				// certain elements can have dimension info if we invisibly show them
				// however, it must have a current display style that would benefit from this
				return elem.offsetWidth === 0 && rdisplayswap.test( jQuery.css( elem, "display" ) ) ?
					jQuery.swap( elem, cssShow, function() {
						return getWidthOrHeight( elem, name, extra );
					}) :
					getWidthOrHeight( elem, name, extra );
			}
		},

		set: function( elem, value, extra ) {
			var styles = extra && getStyles( elem );
			return setPositiveNumber( elem, value, extra ?
				augmentWidthOrHeight(
					elem,
					name,
					extra,
					jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
					styles
				) : 0
			);
		}
	};
});

if ( !jQuery.support.opacity ) {
	jQuery.cssHooks.opacity = {
		get: function( elem, computed ) {
			// IE uses filters for opacity
			return ropacity.test( (computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "" ) ?
				( 0.01 * parseFloat( RegExp.$1 ) ) + "" :
				computed ? "1" : "";
		},

		set: function( elem, value ) {
			var style = elem.style,
				currentStyle = elem.currentStyle,
				opacity = jQuery.isNumeric( value ) ? "alpha(opacity=" + value * 100 + ")" : "",
				filter = currentStyle && currentStyle.filter || style.filter || "";

			// IE has trouble with opacity if it does not have layout
			// Force it by setting the zoom level
			style.zoom = 1;

			// if setting opacity to 1, and no other filters exist - attempt to remove filter attribute #6652
			// if value === "", then remove inline opacity #12685
			if ( ( value >= 1 || value === "" ) &&
					jQuery.trim( filter.replace( ralpha, "" ) ) === "" &&
					style.removeAttribute ) {

				// Setting style.filter to null, "" & " " still leave "filter:" in the cssText
				// if "filter:" is present at all, clearType is disabled, we want to avoid this
				// style.removeAttribute is IE Only, but so apparently is this code path...
				style.removeAttribute( "filter" );

				// if there is no filter style applied in a css rule or unset inline opacity, we are done
				if ( value === "" || currentStyle && !currentStyle.filter ) {
					return;
				}
			}

			// otherwise, set new filter values
			style.filter = ralpha.test( filter ) ?
				filter.replace( ralpha, opacity ) :
				filter + " " + opacity;
		}
	};
}

// These hooks cannot be added until DOM ready because the support test
// for it is not run until after DOM ready
jQuery(function() {
	if ( !jQuery.support.reliableMarginRight ) {
		jQuery.cssHooks.marginRight = {
			get: function( elem, computed ) {
				if ( computed ) {
					// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
					// Work around by temporarily setting element display to inline-block
					return jQuery.swap( elem, { "display": "inline-block" },
						curCSS, [ elem, "marginRight" ] );
				}
			}
		};
	}

	// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
	// getComputedStyle returns percent when specified for top/left/bottom/right
	// rather than make the css module depend on the offset module, we just check for it here
	if ( !jQuery.support.pixelPosition && jQuery.fn.position ) {
		jQuery.each( [ "top", "left" ], function( i, prop ) {
			jQuery.cssHooks[ prop ] = {
				get: function( elem, computed ) {
					if ( computed ) {
						computed = curCSS( elem, prop );
						// if curCSS returns percentage, fallback to offset
						return rnumnonpx.test( computed ) ?
							jQuery( elem ).position()[ prop ] + "px" :
							computed;
					}
				}
			};
		});
	}

});

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.hidden = function( elem ) {
		// Support: Opera <= 12.12
		// Opera reports offsetWidths and offsetHeights less than zero on some elements
		return elem.offsetWidth <= 0 && elem.offsetHeight <= 0 ||
			(!jQuery.support.reliableHiddenOffsets && ((elem.style && elem.style.display) || jQuery.css( elem, "display" )) === "none");
	};

	jQuery.expr.filters.visible = function( elem ) {
		return !jQuery.expr.filters.hidden( elem );
	};
}

// These hooks are used by animate to expand properties
jQuery.each({
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// assumes a single number if not a string
				parts = typeof value === "string" ? value.split(" ") : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( !rmargin.test( prefix ) ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
});
var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

jQuery.fn.extend({
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map(function(){
			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		})
		.filter(function(){
			var type = this.type;
			// Use .is(":disabled") so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !manipulation_rcheckableType.test( type ) );
		})
		.map(function( i, elem ){
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val ){
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					}) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		}).get();
	}
});

//Serialize an array of form elements or a set of
//key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, value ) {
			// If value is a function, invoke it and return its value
			value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
			s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
		};

	// Set traditional to true for jQuery <= 1.3.2 behavior.
	if ( traditional === undefined ) {
		traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		});

	} else {
		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" ).replace( r20, "+" );
};

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( jQuery.isArray( obj ) ) {
		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				add( prefix, v );

			} else {
				// Item is non-scalar (array or object), encode its numeric index.
				buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, add );
			}
		});

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {
		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {
		// Serialize scalar item.
		add( prefix, obj );
	}
}
jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
});

jQuery.fn.hover = function( fnOver, fnOut ) {
	return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
};
var
	// Document location
	ajaxLocParts,
	ajaxLocation,
	ajax_nonce = jQuery.now(),

	ajax_rquery = /\?/,
	rhash = /#.*$/,
	rts = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rurl = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,

	// Keep a copy of the old load method
	_load = jQuery.fn.load,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat("*");

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
try {
	ajaxLocation = location.href;
} catch( e ) {
	// Use the href attribute of an A element
	// since IE will modify it given document.location
	ajaxLocation = document.createElement( "a" );
	ajaxLocation.href = "";
	ajaxLocation = ajaxLocation.href;
}

// Segment location into parts
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( core_rnotwhite ) || [];

		if ( jQuery.isFunction( func ) ) {
			// For each dataType in the dataTypeExpression
			while ( (dataType = dataTypes[i++]) ) {
				// Prepend if requested
				if ( dataType[0] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					(structure[ dataType ] = structure[ dataType ] || []).unshift( func );

				// Otherwise append
				} else {
					(structure[ dataType ] = structure[ dataType ] || []).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if( typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[ dataTypeOrTransport ] ) {
				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		});
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var deep, key,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || (deep = {}) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

jQuery.fn.load = function( url, params, callback ) {
	if ( typeof url !== "string" && _load ) {
		return _load.apply( this, arguments );
	}

	var selector, response, type,
		self = this,
		off = url.indexOf(" ");

	if ( off >= 0 ) {
		selector = url.slice( off, url.length );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( jQuery.isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax({
			url: url,

			// if "type" variable is undefined, then "GET" method will be used
			type: type,
			dataType: "html",
			data: params
		}).done(function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery("<div>").append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		}).complete( callback && function( jqXHR, status ) {
			self.each( callback, response || [ jqXHR.responseText, status, jqXHR ] );
		});
	}

	return this;
};

// Attach a bunch of functions for handling common AJAX events
jQuery.each( [ "ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend" ], function( i, type ){
	jQuery.fn[ type ] = function( fn ){
		return this.on( type, fn );
	};
});

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {
		// shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		return jQuery.ajax({
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		});
	};
});

jQuery.extend({

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: ajaxLocation,
		type: "GET",
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /xml/,
			html: /html/,
			json: /json/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": window.String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var // Cross-domain detection vars
			parts,
			// Loop variable
			i,
			// URL without anti-cache param
			cacheURL,
			// Response headers as string
			responseHeadersString,
			// timeout handle
			timeoutTimer,

			// To know if global events are to be dispatched
			fireGlobals,

			transport,
			// Response headers
			responseHeaders,
			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),
			// Callbacks context
			callbackContext = s.context || s,
			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context && ( callbackContext.nodeType || callbackContext.jquery ) ?
				jQuery( callbackContext ) :
				jQuery.event,
			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks("once memory"),
			// Status-dependent callbacks
			statusCode = s.statusCode || {},
			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},
			// The jqXHR state
			state = 0,
			// Default abort message
			strAbort = "canceled",
			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( (match = rheaders.exec( responseHeadersString )) ) {
								responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match == null ? null : match;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					var lname = name.toLowerCase();
					if ( !state ) {
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( state < 2 ) {
							for ( code in map ) {
								// Lazy-add the new callback in a way that preserves old ones
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						} else {
							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR ).complete = completeDeferred.add;
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || ajaxLocation ) + "" ).replace( rhash, "" ).replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().match( core_rnotwhite ) || [""];

		// A cross-domain request is in order when we have a protocol:host:port mismatch
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] !== ajaxLocParts[ 1 ] || parts[ 2 ] !== ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? 80 : 443 ) ) !=
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? 80 : 443 ) ) )
			);
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( state === 2 ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		fireGlobals = s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger("ajaxStart");
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		cacheURL = s.url;

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				cacheURL = ( s.url += ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + s.data );
				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add anti-cache in url if needed
			if ( s.cache === false ) {
				s.url = rts.test( cacheURL ) ?

					// If there is already a '_' parameter, set its value
					cacheURL.replace( rts, "$1_=" + ajax_nonce++ ) :

					// Otherwise add one to the end
					cacheURL + ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ajax_nonce++;
			}
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
				s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
			// Abort if not done already and return
			return jqXHR.abort();
		}

		// aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}
			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = setTimeout(function() {
					jqXHR.abort("timeout");
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch ( e ) {
				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );
				// Simply rethrow otherwise
				} else {
					throw e;
				}
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// If successful, handle type chaining
			if ( status >= 200 && status < 300 || status === 304 ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader("Last-Modified");
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader("etag");
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 ) {
					isSuccess = true;
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					isSuccess = true;
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					isSuccess = ajaxConvert( s, response );
					statusText = isSuccess.state;
					success = isSuccess.data;
					error = isSuccess.error;
					isSuccess = !error;
				}
			} else {
				// We extract error from statusText
				// then normalize statusText and status for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger("ajaxStop");
				}
			}
		}

		return jqXHR;
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	}
});

/* Handles responses to an ajax request:
 * - sets all responseXXX fields accordingly
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {
	var firstDataType, ct, finalDataType, type,
		contents = s.contents,
		dataTypes = s.dataTypes,
		responseFields = s.responseFields;

	// Fill responseXXX fields
	for ( type in responseFields ) {
		if ( type in responses ) {
			jqXHR[ responseFields[type] ] = responses[ type ];
		}
	}

	// Remove auto dataType and get content-type in the process
	while( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {
		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}
		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

// Chain conversions given the request and the original response
function ajaxConvert( s, response ) {
	var conv2, current, conv, tmp,
		converters = {},
		i = 0,
		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice(),
		prev = dataTypes[ 0 ];

	// Apply the dataFilter if provided
	if ( s.dataFilter ) {
		response = s.dataFilter( response, s.dataType );
	}

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	// Convert to each sequential dataType, tolerating list modification
	for ( ; (current = dataTypes[++i]); ) {

		// There's only work to do if current dataType is non-auto
		if ( current !== "*" ) {

			// Convert response if prev dataType is non-auto and differs from current
			if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split(" ");
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {
								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.splice( i--, 0, current );
								}

								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s["throws"] ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return { state: "parsererror", error: conv ? e : "No conversion from " + prev + " to " + current };
						}
					}
				}
			}

			// Update prev for next iteration
			prev = current;
		}
	}

	return { state: "success", data: response };
}
// Install script dataType
jQuery.ajaxSetup({
	accepts: {
		script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /(?:java|ecma)script/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
});

// Handle cache's special case and global
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
		s.global = false;
	}
});

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function(s) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {

		var script,
			head = document.head || jQuery("head")[0] || document.documentElement;

		return {

			send: function( _, callback ) {

				script = document.createElement("script");

				script.async = true;

				if ( s.scriptCharset ) {
					script.charset = s.scriptCharset;
				}

				script.src = s.url;

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function( _, isAbort ) {

					if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

						// Handle memory leak in IE
						script.onload = script.onreadystatechange = null;

						// Remove the script
						if ( script.parentNode ) {
							script.parentNode.removeChild( script );
						}

						// Dereference the script
						script = null;

						// Callback if not abort
						if ( !isAbort ) {
							callback( 200, "success" );
						}
					}
				};

				// Circumvent IE6 bugs with base elements (#2709 and #4378) by prepending
				// Use native DOM manipulation to avoid our domManip AJAX trickery
				head.insertBefore( script, head.firstChild );
			},

			abort: function() {
				if ( script ) {
					script.onload( undefined, true );
				}
			}
		};
	}
});
var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup({
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( ajax_nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" && !( s.contentType || "" ).indexOf("application/x-www-form-urlencoded") && rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( ajax_rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters["script json"] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always(function() {
			// Restore preexisting value
			window[ callbackName ] = overwritten;

			// Save back as free
			if ( s[ callbackName ] ) {
				// make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		});

		// Delegate to script
		return "script";
	}
});
var xhrCallbacks, xhrSupported,
	xhrId = 0,
	// #5280: Internet Explorer will keep connections alive if we don't abort on unload
	xhrOnUnloadAbort = window.ActiveXObject && function() {
		// Abort all pending requests
		var key;
		for ( key in xhrCallbacks ) {
			xhrCallbacks[ key ]( undefined, true );
		}
	};

// Functions to create xhrs
function createStandardXHR() {
	try {
		return new window.XMLHttpRequest();
	} catch( e ) {}
}

function createActiveXHR() {
	try {
		return new window.ActiveXObject("Microsoft.XMLHTTP");
	} catch( e ) {}
}

// Create the request object
// (This is still attached to ajaxSettings for backward compatibility)
jQuery.ajaxSettings.xhr = window.ActiveXObject ?
	/* Microsoft failed to properly
	 * implement the XMLHttpRequest in IE7 (can't request local files),
	 * so we use the ActiveXObject when it is available
	 * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
	 * we need a fallback.
	 */
	function() {
		return !this.isLocal && createStandardXHR() || createActiveXHR();
	} :
	// For all other browsers, use the standard XMLHttpRequest object
	createStandardXHR;

// Determine support properties
xhrSupported = jQuery.ajaxSettings.xhr();
jQuery.support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
xhrSupported = jQuery.support.ajax = !!xhrSupported;

// Create transport if the browser can provide an xhr
if ( xhrSupported ) {

	jQuery.ajaxTransport(function( s ) {
		// Cross domain only allowed if supported through XMLHttpRequest
		if ( !s.crossDomain || jQuery.support.cors ) {

			var callback;

			return {
				send: function( headers, complete ) {

					// Get a new xhr
					var handle, i,
						xhr = s.xhr();

					// Open the socket
					// Passing null username, generates a login popup on Opera (#2865)
					if ( s.username ) {
						xhr.open( s.type, s.url, s.async, s.username, s.password );
					} else {
						xhr.open( s.type, s.url, s.async );
					}

					// Apply custom fields if provided
					if ( s.xhrFields ) {
						for ( i in s.xhrFields ) {
							xhr[ i ] = s.xhrFields[ i ];
						}
					}

					// Override mime type if needed
					if ( s.mimeType && xhr.overrideMimeType ) {
						xhr.overrideMimeType( s.mimeType );
					}

					// X-Requested-With header
					// For cross-domain requests, seeing as conditions for a preflight are
					// akin to a jigsaw puzzle, we simply never set it to be sure.
					// (it can always be set on a per-request basis or even using ajaxSetup)
					// For same-domain requests, won't change header if already provided.
					if ( !s.crossDomain && !headers["X-Requested-With"] ) {
						headers["X-Requested-With"] = "XMLHttpRequest";
					}

					// Need an extra try/catch for cross domain requests in Firefox 3
					try {
						for ( i in headers ) {
							xhr.setRequestHeader( i, headers[ i ] );
						}
					} catch( err ) {}

					// Do send the request
					// This may raise an exception which is actually
					// handled in jQuery.ajax (so no try/catch here)
					xhr.send( ( s.hasContent && s.data ) || null );

					// Listener
					callback = function( _, isAbort ) {
						var status, responseHeaders, statusText, responses;

						// Firefox throws exceptions when accessing properties
						// of an xhr when a network error occurred
						// http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE)
						try {

							// Was never called and is aborted or complete
							if ( callback && ( isAbort || xhr.readyState === 4 ) ) {

								// Only called once
								callback = undefined;

								// Do not keep as active anymore
								if ( handle ) {
									xhr.onreadystatechange = jQuery.noop;
									if ( xhrOnUnloadAbort ) {
										delete xhrCallbacks[ handle ];
									}
								}

								// If it's an abort
								if ( isAbort ) {
									// Abort it manually if needed
									if ( xhr.readyState !== 4 ) {
										xhr.abort();
									}
								} else {
									responses = {};
									status = xhr.status;
									responseHeaders = xhr.getAllResponseHeaders();

									// When requesting binary data, IE6-9 will throw an exception
									// on any attempt to access responseText (#11426)
									if ( typeof xhr.responseText === "string" ) {
										responses.text = xhr.responseText;
									}

									// Firefox throws an exception when accessing
									// statusText for faulty cross-domain requests
									try {
										statusText = xhr.statusText;
									} catch( e ) {
										// We normalize with Webkit giving an empty statusText
										statusText = "";
									}

									// Filter status for non standard behaviors

									// If the request is local and we have data: assume a success
									// (success with no data won't get notified, that's the best we
									// can do given current implementations)
									if ( !status && s.isLocal && !s.crossDomain ) {
										status = responses.text ? 200 : 404;
									// IE - #1450: sometimes returns 1223 when it should be 204
									} else if ( status === 1223 ) {
										status = 204;
									}
								}
							}
						} catch( firefoxAccessException ) {
							if ( !isAbort ) {
								complete( -1, firefoxAccessException );
							}
						}

						// Call complete if needed
						if ( responses ) {
							complete( status, statusText, responses, responseHeaders );
						}
					};

					if ( !s.async ) {
						// if we're in sync mode we fire the callback
						callback();
					} else if ( xhr.readyState === 4 ) {
						// (IE6 & IE7) if it's in cache and has been
						// retrieved directly we need to fire the callback
						setTimeout( callback );
					} else {
						handle = ++xhrId;
						if ( xhrOnUnloadAbort ) {
							// Create the active xhrs callbacks list if needed
							// and attach the unload handler
							if ( !xhrCallbacks ) {
								xhrCallbacks = {};
								jQuery( window ).unload( xhrOnUnloadAbort );
							}
							// Add to list of active xhrs callbacks
							xhrCallbacks[ handle ] = callback;
						}
						xhr.onreadystatechange = callback;
					}
				},

				abort: function() {
					if ( callback ) {
						callback( undefined, true );
					}
				}
			};
		}
	});
}
var fxNow, timerId,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rfxnum = new RegExp( "^(?:([+-])=|)(" + core_pnum + ")([a-z%]*)$", "i" ),
	rrun = /queueHooks$/,
	animationPrefilters = [ defaultPrefilter ],
	tweeners = {
		"*": [function( prop, value ) {
			var end, unit,
				tween = this.createTween( prop, value ),
				parts = rfxnum.exec( value ),
				target = tween.cur(),
				start = +target || 0,
				scale = 1,
				maxIterations = 20;

			if ( parts ) {
				end = +parts[2];
				unit = parts[3] || ( jQuery.cssNumber[ prop ] ? "" : "px" );

				// We need to compute starting value
				if ( unit !== "px" && start ) {
					// Iteratively approximate from a nonzero starting point
					// Prefer the current property, because this process will be trivial if it uses the same units
					// Fallback to end or a simple constant
					start = jQuery.css( tween.elem, prop, true ) || end || 1;

					do {
						// If previous iteration zeroed out, double until we get *something*
						// Use a string for doubling factor so we don't accidentally see scale as unchanged below
						scale = scale || ".5";

						// Adjust and apply
						start = start / scale;
						jQuery.style( tween.elem, prop, start + unit );

					// Update scale, tolerating zero or NaN from tween.cur()
					// And breaking the loop if scale is unchanged or perfect, or if we've just had enough
					} while ( scale !== (scale = tween.cur() / target) && scale !== 1 && --maxIterations );
				}

				tween.unit = unit;
				tween.start = start;
				// If a +=/-= token was provided, we're doing a relative animation
				tween.end = parts[1] ? start + ( parts[1] + 1 ) * end : end;
			}
			return tween;
		}]
	};

// Animations created synchronously will run synchronously
function createFxNow() {
	setTimeout(function() {
		fxNow = undefined;
	});
	return ( fxNow = jQuery.now() );
}

function createTweens( animation, props ) {
	jQuery.each( props, function( prop, value ) {
		var collection = ( tweeners[ prop ] || [] ).concat( tweeners[ "*" ] ),
			index = 0,
			length = collection.length;
		for ( ; index < length; index++ ) {
			if ( collection[ index ].call( animation, prop, value ) ) {

				// we're done with this property
				return;
			}
		}
	});
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = animationPrefilters.length,
		deferred = jQuery.Deferred().always( function() {
			// don't match elem in the :animated selector
			delete tick.elem;
		}),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),
				// archaic crash bug won't allow us to use 1 - ( 0.5 || 0 ) (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length ; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ]);

			if ( percent < 1 && length ) {
				return remaining;
			} else {
				deferred.resolveWith( elem, [ animation ] );
				return false;
			}
		},
		animation = deferred.promise({
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, { specialEasing: {} }, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,
					// if we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length ; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// resolve when we played the last frame
				// otherwise, reject
				if ( gotoEnd ) {
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		}),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length ; index++ ) {
		result = animationPrefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			return result;
		}
	}

	createTweens( animation, props );

	if ( jQuery.isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		})
	);

	// attach callbacks from options
	return animation.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );
}

function propFilter( props, specialEasing ) {
	var value, name, index, easing, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = jQuery.camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( jQuery.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// not quite $.extend, this wont overwrite keys already present.
			// also - reusing 'index' from above because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

jQuery.Animation = jQuery.extend( Animation, {

	tweener: function( props, callback ) {
		if ( jQuery.isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.split(" ");
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length ; index++ ) {
			prop = props[ index ];
			tweeners[ prop ] = tweeners[ prop ] || [];
			tweeners[ prop ].unshift( callback );
		}
	},

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			animationPrefilters.unshift( callback );
		} else {
			animationPrefilters.push( callback );
		}
	}
});

function defaultPrefilter( elem, props, opts ) {
	/*jshint validthis:true */
	var prop, index, length,
		value, dataShow, toggle,
		tween, hooks, oldfire,
		anim = this,
		style = elem.style,
		orig = {},
		handled = [],
		hidden = elem.nodeType && isHidden( elem );

	// handle queue: false promises
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always(function() {
			// doing this makes sure that the complete handler will be called
			// before this completes
			anim.always(function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			});
		});
	}

	// height/width overflow pass
	if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {
		// Make sure that nothing sneaks out
		// Record all 3 overflow attributes because IE does not
		// change the overflow attribute when overflowX and
		// overflowY are set to the same value
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Set display property to inline-block for height/width
		// animations on inline elements that are having width/height animated
		if ( jQuery.css( elem, "display" ) === "inline" &&
				jQuery.css( elem, "float" ) === "none" ) {

			// inline-level elements accept inline-block;
			// block-level elements need to be inline with layout
			if ( !jQuery.support.inlineBlockNeedsLayout || css_defaultDisplay( elem.nodeName ) === "inline" ) {
				style.display = "inline-block";

			} else {
				style.zoom = 1;
			}
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		if ( !jQuery.support.shrinkWrapBlocks ) {
			anim.always(function() {
				style.overflow = opts.overflow[ 0 ];
				style.overflowX = opts.overflow[ 1 ];
				style.overflowY = opts.overflow[ 2 ];
			});
		}
	}


	// show/hide pass
	for ( index in props ) {
		value = props[ index ];
		if ( rfxtypes.exec( value ) ) {
			delete props[ index ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {
				continue;
			}
			handled.push( index );
		}
	}

	length = handled.length;
	if ( length ) {
		dataShow = jQuery._data( elem, "fxshow" ) || jQuery._data( elem, "fxshow", {} );
		if ( "hidden" in dataShow ) {
			hidden = dataShow.hidden;
		}

		// store state if its toggle - enables .stop().toggle() to "reverse"
		if ( toggle ) {
			dataShow.hidden = !hidden;
		}
		if ( hidden ) {
			jQuery( elem ).show();
		} else {
			anim.done(function() {
				jQuery( elem ).hide();
			});
		}
		anim.done(function() {
			var prop;
			jQuery._removeData( elem, "fxshow" );
			for ( prop in orig ) {
				jQuery.style( elem, prop, orig[ prop ] );
			}
		});
		for ( index = 0 ; index < length ; index++ ) {
			prop = handled[ index ];
			tween = anim.createTween( prop, hidden ? dataShow[ prop ] : 0 );
			orig[ prop ] = dataShow[ prop ] || jQuery.style( elem, prop );

			if ( !( prop in dataShow ) ) {
				dataShow[ prop ] = tween.start;
				if ( hidden ) {
					tween.end = tween.start;
					tween.start = prop === "width" || prop === "height" ? 1 : 0;
				}
			}
		}
	}
}

function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || "swing";
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			if ( tween.elem[ tween.prop ] != null &&
				(!tween.elem.style || tween.elem.style[ tween.prop ] == null) ) {
				return tween.elem[ tween.prop ];
			}

			// passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails
			// so, simple values such as "10px" are parsed to Float.
			// complex values such as "rotate(1rad)" are returned as is.
			result = jQuery.css( tween.elem, tween.prop, "" );
			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {
			// use step hook for back compat - use cssHook if its there - use .style if its
			// available and use plain properties where available
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.style && ( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null || jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Remove in 2.0 - this supports IE8's panic based approach
// to setting things on disconnected nodes

Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.each([ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
});

jQuery.fn.extend({
	fadeTo: function( speed, to, easing, callback ) {

		// show any hidden elements after setting opacity to 0
		return this.filter( isHidden ).css( "opacity", 0 ).show()

			// animate to the value specified
			.end().animate({ opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {
				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );
				doAnimation.finish = function() {
					anim.stop( true );
				};
				// Empty animations, or finishing resolves immediately
				if ( empty || jQuery._data( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each(function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = jQuery._data( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// start the next in the queue if the last step wasn't forced
			// timers currently will call their complete callbacks, which will dequeue
			// but only if they were gotoEnd
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		});
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each(function() {
			var index,
				data = jQuery._data( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// enable finishing flag on private data
			data.finish = true;

			// empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.cur && hooks.cur.finish ) {
				hooks.cur.finish.call( this );
			}

			// look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// turn off finishing flag
			delete data.finish;
		});
	}
});

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		attrs = { height: type },
		i = 0;

	// if we include width, step value is 1 to do all cssExpand values,
	// if we don't include width, step value is 2 to skip over Left and Right
	includeWidth = includeWidth? 1 : 0;
	for( ; i < 4 ; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx("show"),
	slideUp: genFx("hide"),
	slideToggle: genFx("toggle"),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
});

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			jQuery.isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
	};

	opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
		opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

	// normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( jQuery.isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p*Math.PI ) / 2;
	}
};

jQuery.timers = [];
jQuery.fx = Tween.prototype.init;
jQuery.fx.tick = function() {
	var timer,
		timers = jQuery.timers,
		i = 0;

	fxNow = jQuery.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];
		// Checks the timer has not already been removed
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	if ( timer() && jQuery.timers.push( timer ) ) {
		jQuery.fx.start();
	}
};

jQuery.fx.interval = 13;

jQuery.fx.start = function() {
	if ( !timerId ) {
		timerId = setInterval( jQuery.fx.tick, jQuery.fx.interval );
	}
};

jQuery.fx.stop = function() {
	clearInterval( timerId );
	timerId = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,
	// Default speed
	_default: 400
};

// Back Compat <1.8 extension point
jQuery.fx.step = {};

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.animated = function( elem ) {
		return jQuery.grep(jQuery.timers, function( fn ) {
			return elem === fn.elem;
		}).length;
	};
}
jQuery.fn.offset = function( options ) {
	if ( arguments.length ) {
		return options === undefined ?
			this :
			this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
	}

	var docElem, win,
		box = { top: 0, left: 0 },
		elem = this[ 0 ],
		doc = elem && elem.ownerDocument;

	if ( !doc ) {
		return;
	}

	docElem = doc.documentElement;

	// Make sure it's not a disconnected DOM node
	if ( !jQuery.contains( docElem, elem ) ) {
		return box;
	}

	// If we don't have gBCR, just use 0,0 rather than error
	// BlackBerry 5, iOS 3 (original iPhone)
	if ( typeof elem.getBoundingClientRect !== core_strundefined ) {
		box = elem.getBoundingClientRect();
	}
	win = getWindow( doc );
	return {
		top: box.top  + ( win.pageYOffset || docElem.scrollTop )  - ( docElem.clientTop  || 0 ),
		left: box.left + ( win.pageXOffset || docElem.scrollLeft ) - ( docElem.clientLeft || 0 )
	};
};

jQuery.offset = {

	setOffset: function( elem, options, i ) {
		var position = jQuery.css( elem, "position" );

		// set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		var curElem = jQuery( elem ),
			curOffset = curElem.offset(),
			curCSSTop = jQuery.css( elem, "top" ),
			curCSSLeft = jQuery.css( elem, "left" ),
			calculatePosition = ( position === "absolute" || position === "fixed" ) && jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1,
			props = {}, curPosition = {}, curTop, curLeft;

		// need to be able to calculate position if either top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;
		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {
			options = options.call( elem, i, curOffset );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );
		} else {
			curElem.css( props );
		}
	}
};


jQuery.fn.extend({

	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset,
			parentOffset = { top: 0, left: 0 },
			elem = this[ 0 ];

		// fixed elements are offset from window (parentOffset = {top:0, left: 0}, because it is it's only offset parent
		if ( jQuery.css( elem, "position" ) === "fixed" ) {
			// we assume that getBoundingClientRect is available when computed position is fixed
			offset = elem.getBoundingClientRect();
		} else {
			// Get *real* offsetParent
			offsetParent = this.offsetParent();

			// Get correct offsets
			offset = this.offset();
			if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
				parentOffset = offsetParent.offset();
			}

			// Add offsetParent borders
			parentOffset.top  += jQuery.css( offsetParent[ 0 ], "borderTopWidth", true );
			parentOffset.left += jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true );
		}

		// Subtract parent offsets and element margins
		// note: when an element has margin: auto the offsetLeft and marginLeft
		// are the same in Safari causing offset.left to incorrectly be 0
		return {
			top:  offset.top  - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true)
		};
	},

	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || document.documentElement;
			while ( offsetParent && ( !jQuery.nodeName( offsetParent, "html" ) && jQuery.css( offsetParent, "position") === "static" ) ) {
				offsetParent = offsetParent.offsetParent;
			}
			return offsetParent || document.documentElement;
		});
	}
});


// Create scrollLeft and scrollTop methods
jQuery.each( {scrollLeft: "pageXOffset", scrollTop: "pageYOffset"}, function( method, prop ) {
	var top = /Y/.test( prop );

	jQuery.fn[ method ] = function( val ) {
		return jQuery.access( this, function( elem, method, val ) {
			var win = getWindow( elem );

			if ( val === undefined ) {
				return win ? (prop in win) ? win[ prop ] :
					win.document.documentElement[ method ] :
					elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : jQuery( win ).scrollLeft(),
					top ? val : jQuery( win ).scrollTop()
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length, null );
	};
});

function getWindow( elem ) {
	return jQuery.isWindow( elem ) ?
		elem :
		elem.nodeType === 9 ?
			elem.defaultView || elem.parentWindow :
			false;
}
// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name }, function( defaultExtra, funcName ) {
		// margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return jQuery.access( this, function( elem, type, value ) {
				var doc;

				if ( jQuery.isWindow( elem ) ) {
					// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
					// isn't a whole lot we can do. See pull request at this URL for discussion:
					// https://github.com/jquery/jquery/pull/764
					return elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height], whichever is greatest
					// unfortunately, this causes bug #3838 in IE6/8 only, but there is currently no good, small way to fix it.
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?
					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable, null );
		};
	});
});
// Limit scope pollution from any deprecated API
// (function() {

// })();
// Expose jQuery to the global object
window.jQuery = window.$ = jQuery;

// Expose jQuery as an AMD module, but only for AMD loaders that
// understand the issues with loading multiple versions of jQuery
// in a page that all might call define(). The loader will indicate
// they have special allowances for multiple jQuery versions by
// specifying define.amd.jQuery = true. Register as a named module,
// since jQuery can be concatenated with other files that may use define,
// but not use a proper concatenation script that understands anonymous
// AMD modules. A named AMD is safest and most robust way to register.
// Lowercase jquery is used because AMD module names are derived from
// file names, and jQuery is normally delivered in a lowercase file name.
// Do this after creating the global so that if an AMD module wants to call
// noConflict to hide this version of jQuery, it will work.
if ( typeof define === "function" && define.amd && define.amd.jQuery ) {
	define( "jquery", [], function () { return jQuery; } );
}

})( window );
},{}],39:[function(require,module,exports){
//     Underscore.js 1.8.3
//     http://underscorejs.org
//     (c) 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `exports` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var
    push             = ArrayProto.push,
    slice            = ArrayProto.slice,
    toString         = ObjProto.toString,
    hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind,
    nativeCreate       = Object.create;

  // Naked function reference for surrogate-prototype-swapping.
  var Ctor = function(){};

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.8.3';

  // Internal function that returns an efficient (for current engines) version
  // of the passed-in callback, to be repeatedly applied in other Underscore
  // functions.
  var optimizeCb = function(func, context, argCount) {
    if (context === void 0) return func;
    switch (argCount == null ? 3 : argCount) {
      case 1: return function(value) {
        return func.call(context, value);
      };
      case 2: return function(value, other) {
        return func.call(context, value, other);
      };
      case 3: return function(value, index, collection) {
        return func.call(context, value, index, collection);
      };
      case 4: return function(accumulator, value, index, collection) {
        return func.call(context, accumulator, value, index, collection);
      };
    }
    return function() {
      return func.apply(context, arguments);
    };
  };

  // A mostly-internal function to generate callbacks that can be applied
  // to each element in a collection, returning the desired result â either
  // identity, an arbitrary callback, a property matcher, or a property accessor.
  var cb = function(value, context, argCount) {
    if (value == null) return _.identity;
    if (_.isFunction(value)) return optimizeCb(value, context, argCount);
    if (_.isObject(value)) return _.matcher(value);
    return _.property(value);
  };
  _.iteratee = function(value, context) {
    return cb(value, context, Infinity);
  };

  // An internal function for creating assigner functions.
  var createAssigner = function(keysFunc, undefinedOnly) {
    return function(obj) {
      var length = arguments.length;
      if (length < 2 || obj == null) return obj;
      for (var index = 1; index < length; index++) {
        var source = arguments[index],
            keys = keysFunc(source),
            l = keys.length;
        for (var i = 0; i < l; i++) {
          var key = keys[i];
          if (!undefinedOnly || obj[key] === void 0) obj[key] = source[key];
        }
      }
      return obj;
    };
  };

  // An internal function for creating a new object that inherits from another.
  var baseCreate = function(prototype) {
    if (!_.isObject(prototype)) return {};
    if (nativeCreate) return nativeCreate(prototype);
    Ctor.prototype = prototype;
    var result = new Ctor;
    Ctor.prototype = null;
    return result;
  };

  var property = function(key) {
    return function(obj) {
      return obj == null ? void 0 : obj[key];
    };
  };

  // Helper for collection methods to determine whether a collection
  // should be iterated as an array or as an object
  // Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
  // Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
  var getLength = property('length');
  var isArrayLike = function(collection) {
    var length = getLength(collection);
    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
  };

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles raw objects in addition to array-likes. Treats all
  // sparse array-likes as if they were dense.
  _.each = _.forEach = function(obj, iteratee, context) {
    iteratee = optimizeCb(iteratee, context);
    var i, length;
    if (isArrayLike(obj)) {
      for (i = 0, length = obj.length; i < length; i++) {
        iteratee(obj[i], i, obj);
      }
    } else {
      var keys = _.keys(obj);
      for (i = 0, length = keys.length; i < length; i++) {
        iteratee(obj[keys[i]], keys[i], obj);
      }
    }
    return obj;
  };

  // Return the results of applying the iteratee to each element.
  _.map = _.collect = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length,
        results = Array(length);
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      results[index] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  };

  // Create a reducing function iterating left or right.
  function createReduce(dir) {
    // Optimized iterator function as using arguments.length
    // in the main function will deoptimize the, see #1991.
    function iterator(obj, iteratee, memo, keys, index, length) {
      for (; index >= 0 && index < length; index += dir) {
        var currentKey = keys ? keys[index] : index;
        memo = iteratee(memo, obj[currentKey], currentKey, obj);
      }
      return memo;
    }

    return function(obj, iteratee, memo, context) {
      iteratee = optimizeCb(iteratee, context, 4);
      var keys = !isArrayLike(obj) && _.keys(obj),
          length = (keys || obj).length,
          index = dir > 0 ? 0 : length - 1;
      // Determine the initial value if none is provided.
      if (arguments.length < 3) {
        memo = obj[keys ? keys[index] : index];
        index += dir;
      }
      return iterator(obj, iteratee, memo, keys, index, length);
    };
  }

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`.
  _.reduce = _.foldl = _.inject = createReduce(1);

  // The right-associative version of reduce, also known as `foldr`.
  _.reduceRight = _.foldr = createReduce(-1);

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, predicate, context) {
    var key;
    if (isArrayLike(obj)) {
      key = _.findIndex(obj, predicate, context);
    } else {
      key = _.findKey(obj, predicate, context);
    }
    if (key !== void 0 && key !== -1) return obj[key];
  };

  // Return all the elements that pass a truth test.
  // Aliased as `select`.
  _.filter = _.select = function(obj, predicate, context) {
    var results = [];
    predicate = cb(predicate, context);
    _.each(obj, function(value, index, list) {
      if (predicate(value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, predicate, context) {
    return _.filter(obj, _.negate(cb(predicate)), context);
  };

  // Determine whether all of the elements match a truth test.
  // Aliased as `all`.
  _.every = _.all = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (!predicate(obj[currentKey], currentKey, obj)) return false;
    }
    return true;
  };

  // Determine if at least one element in the object matches a truth test.
  // Aliased as `any`.
  _.some = _.any = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (predicate(obj[currentKey], currentKey, obj)) return true;
    }
    return false;
  };

  // Determine if the array or object contains a given item (using `===`).
  // Aliased as `includes` and `include`.
  _.contains = _.includes = _.include = function(obj, item, fromIndex, guard) {
    if (!isArrayLike(obj)) obj = _.values(obj);
    if (typeof fromIndex != 'number' || guard) fromIndex = 0;
    return _.indexOf(obj, item, fromIndex) >= 0;
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
      var func = isFunc ? method : value[method];
      return func == null ? func : func.apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, _.property(key));
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs) {
    return _.filter(obj, _.matcher(attrs));
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.find(obj, _.matcher(attrs));
  };

  // Return the maximum element (or element-based computation).
  _.max = function(obj, iteratee, context) {
    var result = -Infinity, lastComputed = -Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value > result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iteratee, context) {
    var result = Infinity, lastComputed = Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value < result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed < lastComputed || computed === Infinity && result === Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Shuffle a collection, using the modern version of the
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/FisherâYates_shuffle).
  _.shuffle = function(obj) {
    var set = isArrayLike(obj) ? obj : _.values(obj);
    var length = set.length;
    var shuffled = Array(length);
    for (var index = 0, rand; index < length; index++) {
      rand = _.random(0, index);
      if (rand !== index) shuffled[index] = shuffled[rand];
      shuffled[rand] = set[index];
    }
    return shuffled;
  };

  // Sample **n** random values from a collection.
  // If **n** is not specified, returns a single random element.
  // The internal `guard` argument allows it to work with `map`.
  _.sample = function(obj, n, guard) {
    if (n == null || guard) {
      if (!isArrayLike(obj)) obj = _.values(obj);
      return obj[_.random(obj.length - 1)];
    }
    return _.shuffle(obj).slice(0, Math.max(0, n));
  };

  // Sort the object's values by a criterion produced by an iteratee.
  _.sortBy = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value: value,
        index: index,
        criteria: iteratee(value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(behavior) {
    return function(obj, iteratee, context) {
      var result = {};
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index) {
        var key = iteratee(value, index, obj);
        behavior(result, value, key);
      });
      return result;
    };
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key].push(value); else result[key] = [value];
  });

  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your index values will be unique.
  _.indexBy = group(function(result, value, key) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key]++; else result[key] = 1;
  });

  // Safely create a real, live array from anything iterable.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (isArrayLike(obj)) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return isArrayLike(obj) ? obj.length : _.keys(obj).length;
  };

  // Split a collection into two arrays: one whose elements all satisfy the given
  // predicate, and one whose elements all do not satisfy the predicate.
  _.partition = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var pass = [], fail = [];
    _.each(obj, function(value, key, obj) {
      (predicate(value, key, obj) ? pass : fail).push(value);
    });
    return [pass, fail];
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[0];
    return _.initial(array, array.length - n);
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array.
  _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[array.length - 1];
    return _.rest(array, Math.max(0, array.length - n));
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, n == null || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, _.identity);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, strict, startIndex) {
    var output = [], idx = 0;
    for (var i = startIndex || 0, length = getLength(input); i < length; i++) {
      var value = input[i];
      if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
        //flatten current level of array or arguments object
        if (!shallow) value = flatten(value, shallow, strict);
        var j = 0, len = value.length;
        output.length += len;
        while (j < len) {
          output[idx++] = value[j++];
        }
      } else if (!strict) {
        output[idx++] = value;
      }
    }
    return output;
  };

  // Flatten out an array, either recursively (by default), or just one level.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, false);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iteratee, context) {
    if (!_.isBoolean(isSorted)) {
      context = iteratee;
      iteratee = isSorted;
      isSorted = false;
    }
    if (iteratee != null) iteratee = cb(iteratee, context);
    var result = [];
    var seen = [];
    for (var i = 0, length = getLength(array); i < length; i++) {
      var value = array[i],
          computed = iteratee ? iteratee(value, i, array) : value;
      if (isSorted) {
        if (!i || seen !== computed) result.push(value);
        seen = computed;
      } else if (iteratee) {
        if (!_.contains(seen, computed)) {
          seen.push(computed);
          result.push(value);
        }
      } else if (!_.contains(result, value)) {
        result.push(value);
      }
    }
    return result;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(flatten(arguments, true, true));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    var result = [];
    var argsLength = arguments.length;
    for (var i = 0, length = getLength(array); i < length; i++) {
      var item = array[i];
      if (_.contains(result, item)) continue;
      for (var j = 1; j < argsLength; j++) {
        if (!_.contains(arguments[j], item)) break;
      }
      if (j === argsLength) result.push(item);
    }
    return result;
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = flatten(arguments, true, true, 1);
    return _.filter(array, function(value){
      return !_.contains(rest, value);
    });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    return _.unzip(arguments);
  };

  // Complement of _.zip. Unzip accepts an array of arrays and groups
  // each array's elements on shared indices
  _.unzip = function(array) {
    var length = array && _.max(array, getLength).length || 0;
    var result = Array(length);

    for (var index = 0; index < length; index++) {
      result[index] = _.pluck(array, index);
    }
    return result;
  };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
  _.object = function(list, values) {
    var result = {};
    for (var i = 0, length = getLength(list); i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // Generator function to create the findIndex and findLastIndex functions
  function createPredicateIndexFinder(dir) {
    return function(array, predicate, context) {
      predicate = cb(predicate, context);
      var length = getLength(array);
      var index = dir > 0 ? 0 : length - 1;
      for (; index >= 0 && index < length; index += dir) {
        if (predicate(array[index], index, array)) return index;
      }
      return -1;
    };
  }

  // Returns the first index on an array-like that passes a predicate test
  _.findIndex = createPredicateIndexFinder(1);
  _.findLastIndex = createPredicateIndexFinder(-1);

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iteratee, context) {
    iteratee = cb(iteratee, context, 1);
    var value = iteratee(obj);
    var low = 0, high = getLength(array);
    while (low < high) {
      var mid = Math.floor((low + high) / 2);
      if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
    }
    return low;
  };

  // Generator function to create the indexOf and lastIndexOf functions
  function createIndexFinder(dir, predicateFind, sortedIndex) {
    return function(array, item, idx) {
      var i = 0, length = getLength(array);
      if (typeof idx == 'number') {
        if (dir > 0) {
            i = idx >= 0 ? idx : Math.max(idx + length, i);
        } else {
            length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
        }
      } else if (sortedIndex && idx && length) {
        idx = sortedIndex(array, item);
        return array[idx] === item ? idx : -1;
      }
      if (item !== item) {
        idx = predicateFind(slice.call(array, i, length), _.isNaN);
        return idx >= 0 ? idx + i : -1;
      }
      for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
        if (array[idx] === item) return idx;
      }
      return -1;
    };
  }

  // Return the position of the first occurrence of an item in an array,
  // or -1 if the item is not included in the array.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);
  _.lastIndexOf = createIndexFinder(-1, _.findLastIndex);

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (stop == null) {
      stop = start || 0;
      start = 0;
    }
    step = step || 1;

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var range = Array(length);

    for (var idx = 0; idx < length; idx++, start += step) {
      range[idx] = start;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Determines whether to execute a function as a constructor
  // or a normal function with the provided arguments
  var executeBound = function(sourceFunc, boundFunc, context, callingContext, args) {
    if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
    var self = baseCreate(sourceFunc.prototype);
    var result = sourceFunc.apply(self, args);
    if (_.isObject(result)) return result;
    return self;
  };

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = function(func, context) {
    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
    var args = slice.call(arguments, 2);
    var bound = function() {
      return executeBound(func, bound, context, this, args.concat(slice.call(arguments)));
    };
    return bound;
  };

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context. _ acts
  // as a placeholder, allowing any combination of arguments to be pre-filled.
  _.partial = function(func) {
    var boundArgs = slice.call(arguments, 1);
    var bound = function() {
      var position = 0, length = boundArgs.length;
      var args = Array(length);
      for (var i = 0; i < length; i++) {
        args[i] = boundArgs[i] === _ ? arguments[position++] : boundArgs[i];
      }
      while (position < arguments.length) args.push(arguments[position++]);
      return executeBound(func, bound, this, this, args);
    };
    return bound;
  };

  // Bind a number of an object's methods to that object. Remaining arguments
  // are the method names to be bound. Useful for ensuring that all callbacks
  // defined on an object belong to it.
  _.bindAll = function(obj) {
    var i, length = arguments.length, key;
    if (length <= 1) throw new Error('bindAll must be passed function names');
    for (i = 1; i < length; i++) {
      key = arguments[i];
      obj[key] = _.bind(obj[key], obj);
    }
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memoize = function(key) {
      var cache = memoize.cache;
      var address = '' + (hasher ? hasher.apply(this, arguments) : key);
      if (!_.has(cache, address)) cache[address] = func.apply(this, arguments);
      return cache[address];
    };
    memoize.cache = {};
    return memoize;
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){
      return func.apply(null, args);
    }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = _.partial(_.delay, _, 1);

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  _.throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    if (!options) options = {};
    var later = function() {
      previous = options.leading === false ? 0 : _.now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };
    return function() {
      var now = _.now();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, args, context, timestamp, result;

    var later = function() {
      var last = _.now() - timestamp;

      if (last < wait && last >= 0) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
          if (!timeout) context = args = null;
        }
      }
    };

    return function() {
      context = this;
      args = arguments;
      timestamp = _.now();
      var callNow = immediate && !timeout;
      if (!timeout) timeout = setTimeout(later, wait);
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }

      return result;
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return _.partial(wrapper, func);
  };

  // Returns a negated version of the passed-in predicate.
  _.negate = function(predicate) {
    return function() {
      return !predicate.apply(this, arguments);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var args = arguments;
    var start = args.length - 1;
    return function() {
      var i = start;
      var result = args[start].apply(this, arguments);
      while (i--) result = args[i].call(this, result);
      return result;
    };
  };

  // Returns a function that will only be executed on and after the Nth call.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Returns a function that will only be executed up to (but not including) the Nth call.
  _.before = function(times, func) {
    var memo;
    return function() {
      if (--times > 0) {
        memo = func.apply(this, arguments);
      }
      if (times <= 1) func = null;
      return memo;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = _.partial(_.before, 2);

  // Object Functions
  // ----------------

  // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
  var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
  var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
                      'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

  function collectNonEnumProps(obj, keys) {
    var nonEnumIdx = nonEnumerableProps.length;
    var constructor = obj.constructor;
    var proto = (_.isFunction(constructor) && constructor.prototype) || ObjProto;

    // Constructor is a special case.
    var prop = 'constructor';
    if (_.has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);

    while (nonEnumIdx--) {
      prop = nonEnumerableProps[nonEnumIdx];
      if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
        keys.push(prop);
      }
    }
  }

  // Retrieve the names of an object's own properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = function(obj) {
    if (!_.isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve all the property names of an object.
  _.allKeys = function(obj) {
    if (!_.isObject(obj)) return [];
    var keys = [];
    for (var key in obj) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var values = Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };

  // Returns the results of applying the iteratee to each element of the object
  // In contrast to _.map it returns an object
  _.mapObject = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys =  _.keys(obj),
          length = keys.length,
          results = {},
          currentKey;
      for (var index = 0; index < length; index++) {
        currentKey = keys[index];
        results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
      }
      return results;
  };

  // Convert an object into a list of `[key, value]` pairs.
  _.pairs = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var pairs = Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [keys[i], obj[keys[i]]];
    }
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    var keys = _.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = createAssigner(_.allKeys);

  // Assigns a given object with all the own properties in the passed-in object(s)
  // (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
  _.extendOwn = _.assign = createAssigner(_.keys);

  // Returns the first key on an object that passes a predicate test
  _.findKey = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = _.keys(obj), key;
    for (var i = 0, length = keys.length; i < length; i++) {
      key = keys[i];
      if (predicate(obj[key], key, obj)) return key;
    }
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(object, oiteratee, context) {
    var result = {}, obj = object, iteratee, keys;
    if (obj == null) return result;
    if (_.isFunction(oiteratee)) {
      keys = _.allKeys(obj);
      iteratee = optimizeCb(oiteratee, context);
    } else {
      keys = flatten(arguments, false, false, 1);
      iteratee = function(value, key, obj) { return key in obj; };
      obj = Object(obj);
    }
    for (var i = 0, length = keys.length; i < length; i++) {
      var key = keys[i];
      var value = obj[key];
      if (iteratee(value, key, obj)) result[key] = value;
    }
    return result;
  };

   // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj, iteratee, context) {
    if (_.isFunction(iteratee)) {
      iteratee = _.negate(iteratee);
    } else {
      var keys = _.map(flatten(arguments, false, false, 1), String);
      iteratee = function(value, key) {
        return !_.contains(keys, key);
      };
    }
    return _.pick(obj, iteratee, context);
  };

  // Fill in a given object with default properties.
  _.defaults = createAssigner(_.allKeys, true);

  // Creates an object that inherits from the given prototype object.
  // If additional properties are provided then they will be added to the
  // created object.
  _.create = function(prototype, props) {
    var result = baseCreate(prototype);
    if (props) _.extendOwn(result, props);
    return result;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Returns whether an object has a given set of `key:value` pairs.
  _.isMatch = function(object, attrs) {
    var keys = _.keys(attrs), length = keys.length;
    if (object == null) return !length;
    var obj = Object(object);
    for (var i = 0; i < length; i++) {
      var key = keys[i];
      if (attrs[key] !== obj[key] || !(key in obj)) return false;
    }
    return true;
  };


  // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a === 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className !== toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, regular expressions, dates, and booleans are compared by value.
      case '[object RegExp]':
      // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return '' + a === '' + b;
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive.
        // Object(NaN) is equivalent to NaN
        if (+a !== +a) return +b !== +b;
        // An `egal` comparison is performed for other numeric values.
        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a === +b;
    }

    var areArrays = className === '[object Array]';
    if (!areArrays) {
      if (typeof a != 'object' || typeof b != 'object') return false;

      // Objects with different constructors are not equivalent, but `Object`s or `Array`s
      // from different frames are.
      var aCtor = a.constructor, bCtor = b.constructor;
      if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
                               _.isFunction(bCtor) && bCtor instanceof bCtor)
                          && ('constructor' in a && 'constructor' in b)) {
        return false;
      }
    }
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

    // Initializing stack of traversed objects.
    // It's done here since we only need them for objects and arrays comparison.
    aStack = aStack || [];
    bStack = bStack || [];
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] === a) return bStack[length] === b;
    }

    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);

    // Recursively compare objects and arrays.
    if (areArrays) {
      // Compare array lengths to determine if a deep comparison is necessary.
      length = a.length;
      if (length !== b.length) return false;
      // Deep compare the contents, ignoring non-numeric properties.
      while (length--) {
        if (!eq(a[length], b[length], aStack, bStack)) return false;
      }
    } else {
      // Deep compare objects.
      var keys = _.keys(a), key;
      length = keys.length;
      // Ensure that both objects contain the same number of properties before comparing deep equality.
      if (_.keys(b).length !== length) return false;
      while (length--) {
        // Deep compare each member
        key = keys[length];
        if (!(_.has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return true;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))) return obj.length === 0;
    return _.keys(obj).length === 0;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) === '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError.
  _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) === '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE < 9), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return _.has(obj, 'callee');
    };
  }

  // Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
  // IE 11 (#1621), and in Safari 8 (#1929).
  if (typeof /./ != 'function' && typeof Int8Array != 'object') {
    _.isFunction = function(obj) {
      return typeof obj == 'function' || false;
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj !== +obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, key) {
    return obj != null && hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iteratees.
  _.identity = function(value) {
    return value;
  };

  // Predicate-generating functions. Often useful outside of Underscore.
  _.constant = function(value) {
    return function() {
      return value;
    };
  };

  _.noop = function(){};

  _.property = property;

  // Generates a function for a given object that returns a given property.
  _.propertyOf = function(obj) {
    return obj == null ? function(){} : function(key) {
      return obj[key];
    };
  };

  // Returns a predicate for checking whether an object has a given set of
  // `key:value` pairs.
  _.matcher = _.matches = function(attrs) {
    attrs = _.extendOwn({}, attrs);
    return function(obj) {
      return _.isMatch(obj, attrs);
    };
  };

  // Run a function **n** times.
  _.times = function(n, iteratee, context) {
    var accum = Array(Math.max(0, n));
    iteratee = optimizeCb(iteratee, context, 1);
    for (var i = 0; i < n; i++) accum[i] = iteratee(i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // A (possibly faster) way to get the current timestamp as an integer.
  _.now = Date.now || function() {
    return new Date().getTime();
  };

   // List of HTML entities for escaping.
  var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
  };
  var unescapeMap = _.invert(escapeMap);

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  var createEscaper = function(map) {
    var escaper = function(match) {
      return map[match];
    };
    // Regexes for identifying a key that needs to be escaped
    var source = '(?:' + _.keys(map).join('|') + ')';
    var testRegexp = RegExp(source);
    var replaceRegexp = RegExp(source, 'g');
    return function(string) {
      string = string == null ? '' : '' + string;
      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
    };
  };
  _.escape = createEscaper(escapeMap);
  _.unescape = createEscaper(unescapeMap);

  // If the value of the named `property` is a function then invoke it with the
  // `object` as context; otherwise, return it.
  _.result = function(object, property, fallback) {
    var value = object == null ? void 0 : object[property];
    if (value === void 0) {
      value = fallback;
    }
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\u2028|\u2029/g;

  var escapeChar = function(match) {
    return '\\' + escapes[match];
  };

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  // NB: `oldSettings` only exists for backwards compatibility.
  _.template = function(text, settings, oldSettings) {
    if (!settings && oldSettings) settings = oldSettings;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset).replace(escaper, escapeChar);
      index = offset + match.length;

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      } else if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      } else if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }

      // Adobe VMs need the match returned to produce the correct offest.
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + 'return __p;\n';

    try {
      var render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled source as a convenience for precompilation.
    var argument = settings.variable || 'obj';
    template.source = 'function(' + argument + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function. Start chaining a wrapped Underscore object.
  _.chain = function(obj) {
    var instance = _(obj);
    instance._chain = true;
    return instance;
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var result = function(instance, obj) {
    return instance._chain ? _(obj).chain() : obj;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    _.each(_.functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result(this, func.apply(_, args));
      };
    });
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
      return result(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  _.each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result(this, method.apply(this._wrapped, arguments));
    };
  });

  // Extracts the result from a wrapped and chained object.
  _.prototype.value = function() {
    return this._wrapped;
  };

  // Provide unwrapping proxy for some methods used in engine operations
  // such as arithmetic and JSON stringification.
  _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;

  _.prototype.toString = function() {
    return '' + this._wrapped;
  };

  // AMD registration happens at the end for compatibility with AMD loaders
  // that may not enforce next-turn semantics on modules. Even though general
  // practice for AMD registration is to be anonymous, underscore registers
  // as a named module because, like jQuery, it is a base library that is
  // popular enough to be bundled in a third party lib, but not be part of
  // an AMD load request. Those cases could generate an error when an
  // anonymous define() is called outside of a loader request.
  if (typeof define === 'function' && define.amd) {
    define('underscore', [], function() {
      return _;
    });
  }
}.call(this));

},{}],"core/cookie":[function(require,module,exports){
module.exports = function() {

}

},{}],"core/global":[function(require,module,exports){
module.exports = function() {
    return {
        GLOBAL : undefined,

        EVENT_GLOBAL_WINDOW_CLICK : 'EVENT_GLOBAL_WINDOW_CLICK',

        version : '0.0.0.1',

        loadShim : function (){
            require('jquery');
            /** set cookie on global ***/
            this.GLOBAL.Cookie = require('cookies');
            this.GLOBAL.Translator = require('translator')();
            require('tooltip');
        },
        init : function() {
            if(typeof this.GLOBAL == 'undefined') {
                this.GLOBAL = {};
            }
            if (typeof window == 'undefined') {
               this.GLOBAL = GLOBAL;
            } else {
               this.GLOBAL =  window;
            }
            this.GLOBAL.Version  = this.version;

            this.GLOBAL.GLOBAL = this;

            this.loadShim();

            if(typeof modulesData != 'undefined') {
                this.modulesData = JSON.parse(modulesData);
            }

            var $this = this;

            $(window).click(function(ev) {
                /** DISPATCH EVENT ON WINDOW CLICK **/
                $this.dispatch($this.EVENT_GLOBAL_WINDOW_CLICK, null);
            });

            require('core/validate');

            return this;
        },

        getModuleData : function(name) {
            if(typeof this.modulesData[name] == 'undefined') {
                return false;
            }
            return this.modulesData[name];
        },

        setGlobalVariable : function(name, value) {
            this.GLOBAL[name] = value;
            return this;
        },

        registerEvent : function(eventName) {
            if(typeof this.GLOBAL.Events == 'undefined') {
                this.GLOBAL.Events = [];
            }
            if(-1 == this.GLOBAL.Events.indexOf(eventName)) {
                return this;
            }
            this.GLOBAL.Events.push(eventName);
            return this;
        },
        getBaseUrl : function (secure) {
            if(typeof secure == 'undefined') {
                secure = false;
            }
            if(typeof location == 'undefined') {
                return '';
            }
            return secure ? 'https' : 'http' + "://" + location.host + '/';
        },
        getUrl : function(url, secure) {
            if('undefined' == typeof secure) {
                secure = false;
            }
            return this.getBaseUrl(secure) + url;
        },
        isSecure : function() {
            return false
        },
        dispatch : function(name, args) {
            require('core/helper').event.dispatch(name,args);
            return this;
        },
        listen : function(name, observer) {
            require('core/helper').event.listen(name, observer);
            return this;
        },
        log : function(msg) {
            this.dispatch('EVENT_LOG_MSG', msg);
            return this;
        },
        translate : function(key, placeholders) {
            return this.GLOBAL.Translator.translate(key, placeholders);
        }
    }.init();
}();

},{"cookies":37,"core/helper":"core/helper","core/validate":"core/validate","jquery":38,"tooltip":9,"translator":"core/translator"}],"core/helper":[function(require,module,exports){
module.exports = function(){
    return {
        event : {
            _emiter : undefined,
            getEmiter : function() {
                if(typeof this._emiter == 'undefined') {
                    var ee = require('events').EventEmitter;
                    this._emiter = new ee;
                }
                return this._emiter;
            },
            dispatch : function(name, args) {
                this.getEmiter().emit(name, args);
                return this;
            },
            listen : function(name, observer) {
                this.getEmiter().on(name, observer);
                return this;
            }
        }
    };
}();

},{"events":36}],"core/log":[function(require,module,exports){
module.exports = function() {
    return {

        EVENT_LOG_MSG : 'EVENT_LOG_MSG',

        init : function() {
            this.registerListener();
            return this;
        },
        registerListener : function() {
            GLOBAL.listen(this.LOG_EVENT,function(msg) {
                console.log(msg);
            });
            return this;
        },
    }.init();
}();

},{}],"core/template":[function(require,module,exports){
module.exports = function() {
    return {
         _ : undefined,

        _data : undefined,

        _template : undefined,

        _placeholder : undefined,

        _defaultData : undefined,

        _pushToBody : false,

        _pushToElem : false,

        init : function() {
            this._ = require('underscore');
            return this;
        },

        getData : function() {
            if(typeof this._data == 'undefined') {
                return {};
            }
            return this._data;
        },

        setData : function(data) {
            this._data = data;
            return this;
        },
        getDataItem : function(name) {
            if('undefined' == typeof this._data[name]){
                return null;
            }
            return this._data[name];
        },
        setDataItem : function (name, value) {
            if('undefined' == typeof name ) {
                return this;
            }
            if('undefined' == typeof value ) {
                return this;
            }
            if(typeof this._data == 'undefined') {
                this._data = {};
            }
            this._data[name] = value;
            return this;
        },

        getTemplate : function() {
            if(typeof this._template == 'undefined') {
                return '';
            }
            return this._template;
        },

        setTemplate : function(template) {
            this._template = template;
            return this;
        },

        getContent : function(template) {
            if(typeof template == 'undefined') {
                template = this.getTemplate();
           }
            return this._.template(template)(this.getData());
        },

        toHtml : function() {
            if(typeof this._placeholder == 'undefined') {
                return;
            }
            if('string' == typeof this._placeholder) {
                this._placeholder = [this._placeholder];
            }
            for(name in this._placeholder) {
                this.setDataItem('placeholderName', name);
                var content = this.getContent();
                if(this._pushToBody) {
                    $(this._placeholder[name]).remove();
                    $('body').append(content);
                } else if(this._pushToElem) {
                    if($(this._placeholder[name])) {
                        $(this._placeholder[name]).append(content);
                    }
                } else {
                    $(this._placeholder[name]).html(content);
                }
            }
        },
    }.init();
}();

},{"underscore":39}],"core/toggle":[function(require,module,exports){
module.exports = function() {
    return {
        JS_TRIGGER_HOLDER : '.js-trigger-toggle',
        JS_HIDE_ON_WINDOW_CLICK : '.js-hide-on-window-click',
        init : function() {
            var $obj = this;
            $(this.JS_TRIGGER_HOLDER).each(function(key, el){
                var $this = $(el);
                $this.click(function(ev){
                    var $evThis = $(this);
                    var toggleTypes = $(this).data('toggle-type');
                    if('undefined' == typeof toggleTypes) {
                       $obj.toggleDefault($this, ev);
                    } else {
                        var types = toggleTypes.split('|');
                        types.forEach(function(each) {
                            if('rel-class' == each) {
                                $obj.toggleRelClass($this,ev);
                            } else if('class' == each) {
                                $obj.toggleClass($this, ev);
                            } else if ('tabs' == each) {
                                $obj.toggleTabs($this, ev);
                            } else if ('checkbox-radio' == each) {
                                $obj.toggleCheckboxRadio($this, ev);
                            } else {
                                $obj.toggleDefault($this, ev);
                            }
                        });
                    }
                });
            });
            this.handleWindowClick();
            return this;
        },

        toggleCheckboxRadio : function ($this, ev) {
            if('undefined' != typeof ev) {
                ev.stopPropagation();
            }
            var package = $this.data('toggle-package');
            if('undefined' == typeof package) {
                return;
            }
            if($this.is(':checked')) {
                $(package).not($this).prop('checked', false);
            }
        },

        toggleTabs :function($this, ev) {
            if('undefined' != typeof ev) {
                ev.preventDefault();
                ev.stopPropagation();
            }
            var relByParent = $this.data('toggle-switcher-rel');
            var toggleClass = $this.data('toggle-class');
            var toggleContentClass = $this.data('toggle-content-class');
            var toggleContentRel = $this.data('toggle-content');

            if('undefined' == typeof toggleContentRel) {
                return ;
            }
            if('undefined' == typeof relByParent) {
                return ;
            }
            if('undefined' == typeof toggleClass) {
                return;
            }
            if('undefined' == typeof toggleContentClass) {
                toggleContentClass = toggleClass;
            }
            if($this.hasClass(toggleClass)) {
                return;
            }
            $this.parent().find(relByParent).each(function(){
                var elem = $(this);
                var hideToggleContentRel = elem.data('toggle-content');

                if(!elem.hasClass(toggleClass)) {
                   return;
                }
                elem.removeClass(toggleClass);
                $(hideToggleContentRel).removeClass(toggleContentClass);
            });
            $this.addClass(toggleClass);
            $(toggleContentRel).addClass(toggleContentClass);
        },

        toggleDefault : function($this, eve) {
            if('undefined' != typeof eve) {
                eve.preventDefault();
                eve.stopPropagation();
            }
            var show = $this.data('toggle-show');
            var hide = $this.data('toggle-hide');
            var toggleClass = $this.data('toggle-show-class');
            if('undefined' != typeof show) {
                if('undefined' != typeof toggleClass) {
                    var wasShowed = $(show).hasClass(toggleClass);
                } else {
                    var wasShowed = $(show).is(':visible');
                }
            }

            if('undefined' != typeof hide ) {
                if('undefined' == typeof toggleClass) {
                    $(hide).hide();
                } else {
                     $(hide).removeClass(toggleClass);
                }
            }

            if('undefined' != typeof wasShowed && !wasShowed) {
                if('undefined' == typeof toggleClass) {
                    $(show).show().unbind('click').click(function(ev){
                        ev.stopPropagation();
                    });
                } else {
                    $(show).addClass(toggleClass).unbind('click').click(function(ev){
                        ev.stopPropagation();
                    });
                }
            }
        },
        toggleClass : function($this, ev) {
            if('undefined' != typeof ev) {
                ev.preventDefault();
                ev.stopPropagation();
            }
            var toggleClass = $this.data('toggle-class');
            var toggleClassBrothers = $this.data('toggle-class-brothers');
            if('undefined' == typeof toggleClass) {
                return;
            }
            var wasActive = $this.hasClass(toggleClass);
            if('undefined' != typeof toggleClassBrothers) {
                $(toggleClassBrothers).removeClass(toggleClass);
            }
            if(wasActive) {
                $this.removeClass(toggleClass);
            } else {
                $this.addClass(toggleClass);
            }
        },
        toggleRelClass : function($this, ev) {
            if('undefined' != typeof ev) {
                ev.preventDefault();
                ev.stopPropagation();
            }
            var toggleRelClass = $this.data('toggle-rel-class');
            var toggleShowRel = $this.data('toggle-show-rel');
            var toggleRelBrothers = $this.data('toggle-rel-brothers');
            if('undefined' == typeof toggleRelClass) {
                return;
            }
            var rel = $this.find(toggleShowRel)
            var wasActive = rel.hasClass(toggleRelClass);

            if('undefined' != typeof toggleRelBrothers) {
                $(toggleRelBrothers).removeClass(toggleRelClass);
            }
            if(wasActive) {
                rel.removeClass(toggleRelClass);
            } else {
                rel.addClass(toggleRelClass);
            }
        },

        handleWindowClick : function() {
            var $this = this;
            GLOBAL.listen('EVENT_GLOBAL_WINDOW_CLICK', function(){
                $($this.JS_HIDE_ON_WINDOW_CLICK).each(function() {
                    var obj = $(this);
                    var hideClass = obj.data('hide-class-on-window-click');
                    if('undefined' != typeof hideClass) {
                        obj.removeClass(hideClass);
                    } else {
                        obj.hide();
                    }
                });
            });
        },
    }.init();
}();

},{}],"core/translator":[function(require,module,exports){
module.exports = function() {
    return {
        /**
         * Event to dispatch in order to init translations
         */
        EVENT_INIT_TRANSLATOR : 'EVENT_INIT_TRANSLATOR',
        /**
         * The translations available
         */
        translations : {},

        init : function () {
            this.listen();
            return this;
        },
        listen : function() {
            GLOBAL.listen(this.EVENT_INIT_TRANSLATOR, this.initTranslator.bind(this));
        },
        /**
         * Listener for EVENT_INIT_TRANSLATOR
         * @param object translations  Object with key - value string pairs
         * @return self instance
         */
        initTranslator : function(translations) {
            if (typeof Translations !== 'object') {
                return;
            }
            var validTranslations = true;
            try {
                Object.keys(Translations).forEach(function(key) {
                    if (typeof key !== 'string' || typeof Translations[key] !== 'string') {
                        throw BreakException;
                    }
                });
            } catch(e) {
                validTranslations = false;
            }
            if (validTranslations) {
                this.translations = Translations;
            }
            return this;
        },
        /**
         * Translate a string
         * @param string key Key to translate
         * @param array placeholderValues Placeholder values (optional, if key contains placeholders like %1, %2, ...)
         * @return string The translated value
         */
        translate : function(key, placeholderValues) {
            if (typeof key !== 'string') {
                return '';
            }
            var returnValue = key;
            if ( Translations.hasOwnProperty(key)) {
                returnValue =  Translations[key];
            }
            if (typeof placeholderValues !== 'undefined'
                && placeholderValues.constructor === Array
            ) {
                for (var i = 0; i < placeholderValues.length; i++) {
                    returnValue.replace('%' + (i + 1), placeholderValues[i]);
                }
            }
            return returnValue;
        },
        /**
         * Add a new translation.
         * @param string key Value to translate.
         * @param string translation The translation.
         * @return self instance
         */
        add : function(key, translation) {
            if (typeof key === 'string' && typeof translation === 'string') {
                Translations[key] = translation;
            }
            return this;
        }
    }.init();
};
},{}],"core/validate":[function(require,module,exports){
module.exports = function() {
        return {
            EVENT_INIT_FORM  : 'EVENT_INIT_FORM',
            init : function () {
                require('verify');
                this.listen();
                return this;
            },
            listen : function() {
                GLOBAL.listen(this.EVENT_INIT_FORM, this.formInit.bind(this));
            },
            formInit : function(selector) {
                $(selector).verify()
            },
        }.init();
}();

},{"verify":11}],"local/account":[function(require,module,exports){
module.exports = function() {
    return {
        JS_TRIGGER_REGION_SELECTOR : '.js-region-selector',
        JS_TRIGGER_CITY_SELECTOR : '.js-city-selector',

        init : function() {
            require('chosen');
            this.listen();
        },
        initRegionSelector : function() {
            var $this = this;
            //hidden
            if ('undefined' == typeof countryRegions) {
                return;
            }
            var regions = '<option value=""></option>';
            Object.keys(countryRegions.RO).forEach(function(key) {
                regions += '<option value="' + key + '">' + countryRegions.RO[key].name + '</option>';
            });

            $($this.JS_TRIGGER_REGION_SELECTOR).html(regions);
            $($this.JS_TRIGGER_REGION_SELECTOR).trigger('chosen:updated');
            $($this.JS_TRIGGER_REGION_SELECTOR).change(function() {
                var obj = $(this);
                var val = obj.val();
                var city = obj.parent().parent().find($this.JS_TRIGGER_CITY_SELECTOR);
                if ('undefined' == typeof countryRegions.RO[val]['cities']) {
                    return;
                }
                var citylist = '<option value=""></option>';
                Object.keys(countryRegions.RO[val]['cities']).forEach(function(key) {
                    var loc = countryRegions.RO[val]['cities'][key]['localitate'];
                    citylist += '<option value="' + loc + '">' + loc + '</option>';
                });
                city.html(citylist);
                city.trigger('chosen:updated');
            });
        },
        setDefaultsForRegionSelector : function(regionSelectorId, citySelectorId, selectedRegionId, selectedCityId) {

            if ('undefined' == typeof countryRegions) {
                return;
            }
            var regions = '<option value=""></option>';
            Object.keys(countryRegions.RO).forEach(function(key) {
                selected = '';
                if (key == selectedRegionId) {
                    selected = ' selected ';
                }
                regions += '<option value="' + key + '" ' + selected + '>' + countryRegions.RO[key].name + '</option>';
            });

            $('select[id="' + regionSelectorId + '"]').html(regions);
            $('select[id="' + regionSelectorId + '"]').trigger('chosen:updated');

            var city = $('select[id="' + citySelectorId + '"]');
            if ('undefined' == typeof countryRegions.RO[selectedRegionId]['cities']) {
                return;
            }
            var citylist = '<option value=""></option>';
            Object.keys(countryRegions.RO[selectedRegionId]['cities']).forEach(function(key) {
                var loc = countryRegions.RO[selectedRegionId]['cities'][key]['localitate'];
                selectedCity = '';
                if (selectedCityId.toLowerCase() == loc.toLowerCase()) {
                    selectedCity = ' selected ';
                }
                citylist += '<option value="' + loc + '" ' + selectedCity + '>' + loc + '</option>';
            });
            city.html(citylist);
            city.trigger('chosen:updated');

        },
        initRegionAndCitySelectors : function() {
            var $this = this;
            $(".js-trigger-address-edit-form").each(function(el) {
                var regionSelectorId = $($this.JS_TRIGGER_REGION_SELECTOR).attr('id');
                var citySelectorId = $($this.JS_TRIGGER_CITY_SELECTOR).attr('id');
                var regionId = $($this.JS_TRIGGER_REGION_SELECTOR).attr('data-region-id');
                var cityId = $($this.JS_TRIGGER_CITY_SELECTOR).attr('data-city-id');

                if (regionId != 0) {
                    $this.setDefaultsForRegionSelector(regionSelectorId, citySelectorId, regionId, cityId);
                }
            });
        },
        initDiferenta : function() {
            var $this = this;

            $(".js-order-selector").change(function() {
                var url = GLOBAL.getUrl('diferenta/index/getItems/');
                $.ajax({
                    url : url,
                    method : "POST",
                    data : {
                        order_id : $(".js-order-selector").val()
                    },
                    dataType : "json",
                    beforeSend : function() {
                        GLOBAL.dispatch('EVENT_AJAX_CALL_BEFORE', 'Va rugam asteptati ...');
                    }
                }).done(function(data) {
                    GLOBAL.dispatch('EVENT_AJAX_CALL_AFTER');
                    try {
                        var obj = data;
                        if (obj.success !== true) {
                            GLOBAL.dispatch('EVENT_NOTICE_ERROR', obj);
                        } else {
                            var products = $('.js-product-selector');
                            var productlist = '<option value=""></option>';
                            Object.keys(obj.items).forEach(function(key) {
                                productlist += '<option value="' + key + '">' + obj.items[key] + '</option>';
                            });
                            products.html(productlist);
                            products.trigger('chosen:updated');
                        }
                    } catch (Error) {
                        GLOBAL.dispatch('EVENT_NOTICE_ERROR', 'A aparut o eroare neasteptata');
                    }
                });
            });
        },
        setRma : function(order_id_class, email_class, return_class) {
            var $this = this;

            var url = GLOBAL.getUrl('rma/index/availableProducts/');
            $.ajax({
                url : url,
                method : "POST",
                data : {
                    order_id : $(order_id_class).val(),
                    email : $(email_class).val()
                },
                beforeSend : function() {
                    GLOBAL.dispatch('EVENT_AJAX_CALL_BEFORE', 'Va rugam asteptati ...');
                }
            }).done(function(data) {
                GLOBAL.dispatch('EVENT_AJAX_CALL_AFTER');
                $(return_class).html(data);

                $this.initRegionSelector();
                $this.initRegionAndCitySelectors();
            });
        },
        initRma : function() {
            var $this = this;

            $(".js-rma-selector").change(function() {
                $this.setRma(".js-rma-selector", ".js-rma-email", ".js-rma-fill");
            });

            $(".js-rma-submit").click(function() {
                $this.setRma(".js-rma-id", ".js-rma-email", ".js-rma-fill");
            });
        },
        initOrders : function() {
            var $this = this;

            $(".js-catalog-list-filter-select").unbind('change').change(function(ev) {
                ev.preventDefault();
                var elem = $(this);
                var url = null;
                if (elem.is('a')) {
                    url = elem.attr('href');
                } else if (elem.is('select')) {
                    url = $(this).val();
                } /* else {
                    console.log(type);
                } */
                if (null != url) {
                    window.location = url;
                }
            });
        },
        listen : function() {
            this.initRegionSelector();
            this.initRegionAndCitySelectors();
            this.initDiferenta();
            this.initRma();
            this.initOrders();

            $('.chosen-select').chosen({
                width : '100%'
            });

            // Litte validation hack
            if ($('#fact_pers_fiz').is(':checked')) {
                $('.p-checkout-persoanaJuridica [data-validate]').each(function() {
                    $(this).attr({
                        "data-validate-n" : $(this).attr('data-validate')
                    }).removeAttr('data-validate')
                });
            }

            $('#fact_pers_jur').click(function(ev) {
                $('.p-checkout-persoanaJuridica [data-validate-n]').each(function() {
                    $(this).attr({
                        "data-validate" : $(this).attr('data-validate-n')
                    }).removeAttr('data-validate-n')
                });
            });

            $('#fact_pers_fiz').click(function(ev) {
                $('.p-checkout-persoanaJuridica [data-validate]').each(function() {
                    $(this).attr({
                        "data-validate-n" : $(this).attr('data-validate')
                    }).removeAttr('data-validate')
                });
            });
        }
    };
}();
},{"chosen":2}],"local/acredit":[function(require,module,exports){
module.exports = function() {
    return {

        JS_ACREDIT_FORM                 : "#js-acredit-form",

        JS_TRIGGER_ACREDIT_CALCULEAZA   : "#js-trigger-acredit-calculeaza",
        JS_TRIGGER_ACREDIT_SUM          : "#js-acredit-creditsum",
        JS_TRIGGER_ACREDIT_MONTHS       : "#js-acredit-creditmonths",

        JS_BOX_EFG                      : "#js-acredit-efgBox",
        JS_BOX_BRD                      : "#js-acredit-brdBox",

        JS_CREDIT_EFG                   : "#js-acredit-efgCredit",
        JS_CREDIT_BRD                   : "#js-acredit-brdCredit",

        init : function() {

            $(this.JS_TRIGGER_ACREDIT_SUM).focus();

            this.attachEvents();
        },
        attachEvents: function() {
            var $this = this;

            $(this.JS_BOX_EFG).hide();
            $(this.JS_BOX_BRD).hide();

            $(this.JS_TRIGGER_ACREDIT_CALCULEAZA).click(function(ev){
                ev.preventDefault();
                $this.calculeaza();
            });
        },
        calculeaza: function() {

            var $this = this;

            $($this.JS_BOX_BRD).hide();
            $($this.JS_BOX_EFG).hide();

            var acreditForm = $($this.JS_ACREDIT_FORM);
            acreditForm.verify({debug:true});
            acreditForm.validate(function(success) {
                if(!success) {
                    return;
                }
                if(isNaN($($this.JS_TRIGGER_ACREDIT_SUM).val())){
                    GLOBAL.dispatch('EVENT_NOTICE_ERROR', "Suma trebuie sa fie de tip numeric!");
                }else if($($this.JS_TRIGGER_ACREDIT_SUM).val() < 1){
                    GLOBAL.dispatch('EVENT_NOTICE_ERROR', "Suma trebuie sa fie mai mare ca 1!");
                }else{
                    $($this.JS_CREDIT_EFG).html($this.efg(parseFloat($($this.JS_TRIGGER_ACREDIT_SUM).val()), parseFloat($($this.JS_TRIGGER_ACREDIT_MONTHS).val()), 18, 0, 4.5));
                    $($this.JS_BOX_EFG).fadeIn();

                    if($($this.JS_TRIGGER_ACREDIT_SUM).val() >= 600 && $($this.JS_TRIGGER_ACREDIT_SUM).val() <= 20000 && $($this.JS_TRIGGER_ACREDIT_MONTHS).val() >= 12 && $($this.JS_TRIGGER_ACREDIT_MONTHS).val() <= 60) {
                        $($this.JS_CREDIT_BRD).html($this.brd(parseFloat($($this.JS_TRIGGER_ACREDIT_SUM).val()), parseFloat($($this.JS_TRIGGER_ACREDIT_MONTHS).val()), 100, 4));
                        $($this.JS_BOX_BRD).fadeIn();
                    }
                }

                return false;
            });
        },
        efg: function(pret, perioada, dobanda, comision, comision_adm){
		    to=(1+(dobanda/100)/12);
		    total = pret*(dobanda/100)/12*perioada/(1-comision)/(1-1/Math.pow(to,perioada))/perioada+comision_adm;
			return Math.round(total);//total.toFixed(2);
		},
		brd: function(pret, perioada, comision_ana, comision_adm){
			dob = 0;
		    if(pret >= 600 && pret <= 20000 && perioada >= 12 && perioada <= 60) {
		    	dob = 0.33;
		    }

		    to = (1+(dob/12));
		    total = ((pret+comision_ana)*(dob/12))/(1-1/Math.pow(to,perioada))+comision_adm;
			return Math.round(total);
		}
    };
}();
},{}],"local/auth/facebook":[function(require,module,exports){
module.exports = function(){
    return {
        JS_TRIGGER_LOGIN : '.js-trigger-login-with-fb',

        init : function (){
          this.initFacebookElems();
          this.attachEvents();
        },
        initFacebookElems : function () {
           $('body').append($('<div>').attr('id', 'fb-root'));

           var e = document.createElement('script');
           e.async = true;
           e.src = document.location.protocol + '//connect.facebook.net/en_US/all.js';
           document.getElementById('fb-root').appendChild(e);
           window.fbAsyncInit = function() {
               FB.init({
                   appId: GLOBAL.getModuleData('fb-app-id'),
                   cookie: true,
                   xfbml: true,
                   oauth: true
               });

               FB.Event.subscribe('auth.login', function(response) {
                   window.location.reload();
               });

               FB.Event.subscribe('auth.logout', function(response) {
                   window.location.reload();
               });
           };
        },
        attachEvents : function() {
            var $this = this;
            $(this.JS_TRIGGER_LOGIN).click(function(){
                FB.login(function(response) {
                    if (response.authResponse) {
                        $this.login();
                    } else {
                        GLOBAL.dispatch('EVENT_AJAX_CALL_BEFORE', 'Pagina se reincarca');
                        window.location.reload();
                    }
                }, {scope:'email'});
                return false;
            });
        },
        login : function () {
            GLOBAL.dispatch('EVENT_AJAX_CALL_BEFORE', 'Pagina se reincarca');
            document.location.href=GLOBAL.getUrl("easyauth/user/facebookconnect/?referer=" + GLOBAL.getModuleData('current-url'));
        }
    };
}();

},{}],"local/auth":[function(require,module,exports){
module.exports = function(){
    return {

        EVENT_AUTH_STATUS_CHANGE : 'EVENT_AUTH_STATUS_CHANGE',
        EVENT_AUTHLINKS_SHOW : 'EVENT_AUTHLINKS_SHOW',
        EVENT_AUTHLINKS_HIDE : 'EVENT_AUTHLINKS_HIDE',

        HEADER_CONT_PLACEHOLDER : '#js-Header-cont',

        HEADER_CONT_FORM_PLACEHOLDER : '.js-Header-contWindow',
        HEADER_FOLLOW_ORDER : '.js-Follow-order',

        JS_HOLDER : null,

        init : function() {
            var esi = require('local/esi');
            esi.addSubpart('auth', this.handleResponse.bind(this));
            this.listen();
            this.attachEvents();
            return this;
        },
        listen : function() {
            GLOBAL.listen('EVENT_MINICART_SHOW', this.hideLinks.bind(this));
            GLOBAL.listen('EVENT_MINICART_SHOW', this.cartActive.bind(this));
            GLOBAL.listen('EVENT_MINICART_HIDE', this.cartInactive.bind(this));
            GLOBAL.listen('EVENT_GLOBAL_WINDOW_CLICK', this.hideLinks.bind(this));
        },

        getLinks : function() {


            var array = [];
            array.push({link : GLOBAL.getUrl('customer/account/') , text : 'Panou de control'});
            array.push({link : GLOBAL.getUrl('sales/order/history/') , text : 'Comenzile mele'});
            array.push({link : GLOBAL.getUrl('customer/account/edit/') , text : 'Informatii cont'});
            array.push({link : GLOBAL.getUrl('customer/address/') , text : 'Adrese'});
            array.push({link : GLOBAL.getUrl('diferenta/') , text : GLOBAL.translate('Diferenta')});
            array.push({link : GLOBAL.getUrl('rma/index/clientrequests/') , text : 'Cereri returnare'});
            array.push({link : GLOBAL.getUrl('customer/account/logout/') , text : 'Iesi din cont'});
            return array;
        },



        handleResponse : function(response) {
            if(response.isLoggedIn) {
                var template = require('local/auth/greet');
                template.setData({ url : GLOBAL.getUrl('customer/account'), message : 'Salut, '+ response.fullname});
                template.toHtml();

                var contulMeuTemplate = require('local/auth/headerlinks');
                contulMeuTemplate.setData({ message : response.fullname, links : this.getLinks()});
                contulMeuTemplate.toHtml();

                var contulMeuTemplateMobile = require('local/auth/headerlinksmobile');
                contulMeuTemplateMobile.setData({ message : response.fullname, links : this.getLinks()})
                contulMeuTemplateMobile.toHtml();

            }
            this._stopPropagation();
            GLOBAL.dispatch(this.EVENT_AUTH_STATUS_CHANGE,response.isLoggedIn);
            return this;
        },
        attachEvents : function() {
            this._handleLogin();
        },

        _stopPropagation : function () {
            if(this.JS_HOLDER != null) {
                this.JS_HOLDER.click(function(ev){
                    ev.stopPropagation();
                });
            }
        },
        showLinks : function() {
            if(this.JS_HOLDER == null) {
                return this;
            }
            if(!this.JS_HOLDER.hasClass('is-active')){
                this.JS_HOLDER.addClass('is-active');
            }
            GLOBAL.dispatch(this.EVENT_AUTHLINKS_SHOW, null);
        },

        hideLinks : function() {
            if(this.JS_HOLDER == null) {
                return this;
            }
            if(this.JS_HOLDER.hasClass('is-active')){
                this.JS_HOLDER.removeClass('is-active');
            }
            GLOBAL.dispatch(this.EVENT_AUTHLINKS_HIDE, null);
        },
        cartActive: function() {
            if(this.JS_HOLDER == null) {
                return this;
            }
            if(!this.JS_HOLDER.hasClass('is-cosActive')){
                this.JS_HOLDER.addClass('is-cosActive');
            }
        },
        cartInactive: function() {
            if(this.JS_HOLDER == null) {
                return this;
            }
            if(this.JS_HOLDER.hasClass('is-cosActive')){
                this.JS_HOLDER.removeClass('is-cosActive');
            }
        },
        _handleLogin : function() {
            this.JS_HOLDER = $(this.HEADER_CONT_PLACEHOLDER);
            var $this = this;
            this.JS_HOLDER.click(function(ev){
                var target = $(ev.target);
                /** TOOGLE ONLY ON RIGHT TARGETS **/
                if(!target.hasClass('Header-contNume') && !target.hasClass('Header-contLink')) {
                    return this;
                }
                ev.preventDefault();
                if($this.JS_HOLDER.hasClass('is-active')) {
                   $this.hideLinks();
                } else {
                   $this.showLinks();
                }
            });
            this._stopPropagation();
        },
    };
}();

},{"local/auth/greet":13,"local/auth/headerlinks":14,"local/auth/headerlinksmobile":15,"local/esi":"local/esi"}],"local/bugreport":[function(require,module,exports){
module.exports = function() {
    return {

        JS_TRIGGER_BUGREPORT : ".js-trigger-report-a-bug",
        JS_BUGREPORT_CONTAINER : '#js-container-bugreport',
        JS_TRIGGER_BUGREPORT_SUBMIT : '#bugreport-form-submit',
        JS_BUGREPORT_FORM : '#js-bugreport-form',

        init : function() {
            //this.listen();
            this.attachEvents();
        },
        attachEvents : function () {
            var $this = this;
            $(this.JS_TRIGGER_BUGREPORT).click(function(ev){
                ev.preventDefault();
                var template = require('local/bugreport/template');
                template.toHtml();
                $this.showModal();
                $this.attachOnBugReportForm();
            });

        },
        attachOnBugReportForm : function() {
            var $this = this;
            $(this.JS_TRIGGER_BUGREPORT_SUBMIT).click(function(ev){

                ev.preventDefault();

                var url = GLOBAL.getUrl('bugreport/index/new/');
                var $data = {};

                $data['source'] = 'bugreport/index/new';
                $data['email'] = $('#bugreport_email').val();
                $data['name'] = $('#bugreport_name').val();
                $data['message'] = $('#bugreport_message').val();

                var newsletterForm = $($this.JS_BUGREPORT_FORM);
                newsletterForm.verify({debug:true});
                newsletterForm.validate(function(success) {
                    if(!success) {
                        return;
                    }
                    $.ajax({
                        url : url,
                        data : $data,
                        type : 'POST',
                        beforeSend : function() {
                            GLOBAL.dispatch('EVENT_AJAX_CALL_BEFORE', 'Raportare problema');
                        }
                    }).done(function(data){
                       var obj = data;
                        GLOBAL.dispatch('EVENT_AJAX_CALL_AFTER');
                       if(obj.error == true ) {
                           GLOBAL.dispatch('EVENT_NOTICE_ERROR', obj.msg);
                       } else {
                           GLOBAL.dispatch('EVENT_CLEAR_MODALS');
                           GLOBAL.dispatch('EVENT_NOTICE_SUCCESS', obj.msg);
                       }
                    });

                });


            });
        },
        showModal : function() {
            GLOBAL.dispatch('EVENT_SHOW_MODAL', this.JS_BUGREPORT_CONTAINER);
        }
    };
}();
},{"local/bugreport/template":16}],"local/campaignleads":[function(require,module,exports){
module.exports = function() {
    return {

        JS_TRIGGER_COLLECT : ".js-trigger-lead-collect",
        JS_COLLECT_FORM : "#lead-collector-form",

        init : function() {
            GLOBAL.listen('JSON_RENDER', this.listen.bind(this));
        },
        listen : function() {


            var $this = this;

            $(this.JS_TRIGGER_COLLECT).click(function(ev){
		if($(this).data('sku')) {
                    $('#sku').val($(this).data('sku'));
                }
                ev.preventDefault();

                $('.modal').modal('show');
                var collectorForm = $($this.JS_COLLECT_FORM);
                collectorForm.verify({debug:true});
                collectorForm.validate(function(success) {
                    if(!success) {
                        return;
                    }

                    var url = GLOBAL.getUrl('lc/save');

                    $.ajax({
                        url : url,
                        data : collectorForm.serialize(),
                        type : 'POST',

                    }).done(function(data){
                        var obj = data;
                       if(obj.error == true ) {
                           alert('A intervenit o eroare! Va rugam incercati din nou!');
                       } else {
                           $('.modal').modal('hide');
                       }
                    });

                });

            });

        }
    };
}();

},{}],"local/cardcadou":[function(require,module,exports){
module.exports = function() {
    return {

        JS_TRIGGER_CARDCADOU_ADD : ".js-trigger-cardcadou-cart-add",
        JS_CARDCADOU_FORM : '#js-cardcadou-form',

        JS_CART_ADD_MODAL : '#js-add-to-cart-modal',

        init : function() {
            this.attachEvents();
        },
        showModal : function() {
            GLOBAL.dispatch('EVENT_SHOW_MODAL', this.JS_CART_ADD_MODAL);
        },
        attachEvents : function () {
            var $this = this;

            $('#valoare_card').change(function(){
                $('#other_value').val('');
                if ($('#valoare_card').val() == 0) {
                    $('.other_value').show();
                    $('#other_value').attr('data-validate', 'required');
                    $('#valoare_card').removeAttr('data-validate');
                } else {
                    $('.other_value').hide();
                    $('#valoare_card').attr('data-validate', 'required');
                    $('#other_value').removeAttr('data-validate');
                }
            });

            $(this.JS_TRIGGER_CARDCADOU_ADD).click(function(ev){
                ev.preventDefault();
                var url = GLOBAL.getUrl('card-cadou/index/sendcardJson');



                var cardCadouForm = $($this.JS_CARDCADOU_FORM);
                cardCadouForm.verify({debug:true});
                cardCadouForm.validate(function(success) {

                    if(!success) {
                        return;
                    }

                    $data = cardCadouForm.serialize();


                    $.ajax({
                        url : url,
                        type : 'POST',
                        data : $data,
                        beforeSend : function() {
                            GLOBAL.dispatch('EVENT_AJAX_CALL_BEFORE', 'Produsul este adaugat in cos...');
                        },
                    }).done(function(data){
                        GLOBAL.dispatch('EVENT_AJAX_CALL_AFTER');
                        try {
                            var obj = data;
                            if(obj.error == true ) {
                                GLOBAL.dispatch('EVENT_NOTICE_ERROR', obj.msg);
                            } else {
                                GLOBAL.dispatch('EVENT_NOTICE_SUCCESS', obj.msg);
                                require('local/minicart').initMiniCart(obj.list);
                                // console.log(obj.products);
                                // console.log(obj.list);
                                var template = require('local/catalog/template/product.js');
                                template.setDataItem('products', obj.products);
                                template.setDataItem('checkoutUrl', GLOBAL.getUrl('checkout/onepage/'));
                                template.toHtml();
                                $this.showModal();
                                $($this.JS_CART_ADD_MODAL + ' .js-closeModal').click(function(){
                                    GLOBAL.dispatch('EVENT_REMOVE_MODAL', $this.JS_CART_ADD_MODAL);
                                });
                            }
                        } catch (Error) {
                            GLOBAL.dispatch('EVENT_NOTICE_ERROR', 'A aparut o eroare neasteptata. Va rugam sa incercati mai tarziu.');
                        }
                  });
                });

            });

            $('#layout_card').change(function() {

                if ($(this).val() === '') {
                    $('#layout-preview').html('');
                } else {
                    var cardId = $(this).val();

                    var cardLayoutData = GLOBAL.getModuleData('card_multilayout_data');
                    cardLayoutData = JSON.parse(atob(cardLayoutData));

                    $('#layout-preview').html('<img src="' + cardLayoutData[cardId] + '" />');
                }
            });

        },
    };
}();
},{"local/catalog/template/product.js":23,"local/minicart":"local/minicart"}],"local/carousel":[function(require,module,exports){
module.exports = function(){
    return {
        _defaults : {
            // singleItem : true, //deprecated
            items: 1,
            slideSpeed : 200,
            // navigation: true, //deprecated
            // navigationText: ["<",">"], //deprecated
            nav:true,
            navText: ["<", ">"],
            // pagination:true, //deprecated
            dots: true,
            autoplay: true
        },
        init : function(options) {
            require('owlCarousel');
            if('undefined' != typeof options['multiple'] && 'undefined' != typeof options['items']) {
               this.handleMultiple(options);
            } else {
                this.initItem(options);
            }
        },

        initItem : function(options) {
            if(typeof options['_placeholder'] == 'undefined') {
                return;
            }
            var placeholder = options['_placeholder'];
            delete options['_placeholder'];
            var resulted = {};
            $.extend(resulted, this._defaults, options);
            Object.keys(resulted).forEach(function(key){
                if('string' != typeof resulted[key]) {
                    return;
                }
                if(resulted[key].toLowerCase() == 'false') {
                    resulted[key] = false;
                    return;
                }
                if(resulted[key].toLowerCase() == 'true') {
                    resulted[key] = true;
                    return;
                }
                if('itemsCustom' == key) {
                    resulted[key] = eval(resulted[key]);
                }
                if('afterAction' == key) {
                    resulted[key] = new Function(resulted[key]);
                }
                if('afterInit' == key) {
                    resulted[key] = new Function(resulted[key]);
                }
            });
            $(placeholder).owlCarousel(resulted);
        },

        handleMultiple : function (options) {
            if('undefined' == typeof options['multiple'] || 'undefined' == typeof options['items']) {
                return;
            }
            var items = options['items'].split('|');
            var $this = this;
            items.forEach(function(each){
                if('undefined' == typeof options[each]) {
                    return;
                }
                $this.initItem(options[each]);
            });
        }
    };
}();

},{"owlCarousel":8}],"local/catalog/accessorysearch":[function(require,module,exports){
/**
 * Created by george.b on 10.09.2015.
 */

module.exports = function() {
    return {

        JS_TRIGGER_SEARCH_ACCESSORY_SELECT_SUBCATEGORY : ".js-trigger-search-accessory-select-subcategory",
        JS_TRIGGER_SEARCH_ACCESSORY_SELECT_BRAND : ".js-trigger-search-accessory-select-brand",
        JS_TRIGGER_SEARCH_ACCESSORY_SUBMIT : ".js-trigger-search-accessory-submit",

        init : function() {
            this.attachEvents();
        },

        listen : function() {
        },

        run : function() {
        },

        searchAccessories : function () {
            $(this.JS_TRIGGER_SEARCH_ACCESSORY_SUBMIT).click(function(ev){
                ev.preventDefault();
                var form = $('#search-accessories');
                var currentUrl = window.location.href;
                var subcategory = $('#ast-category').val();
                var brand = $('#ast-brand').val();
                var compatibilityAttr = $('#ast-model').find(':selected').attr('data-attribute_set_name');
                var model = $('#ast-model').val();
                var formAction = '';
                if(subcategory) {
                    formAction = currentUrl + '/' + subcategory.toLocaleLowerCase();
                }else{
                    return false;
                }
                if(brand) {
                    formAction = formAction + "/filtru/brand/" + brand.toLocaleLowerCase();
                }
                if(compatibilityAttr != undefined) {
                    formAction = formAction + '/' + compatibilityAttr.toLocaleLowerCase().replace(/_/g, '-').replace(/ /g, '-') + '-compatibilitate';
                }
                if(model) {
                    formAction = formAction + '/' + model.toLocaleLowerCase().replace(/ /g, '-');
                }
                form.attr('action', formAction);
                form.submit();
                GLOBAL.dispatch('EVENT_AJAX_CALL_BEFORE', 'Cautam rezultate...');
            });
        },

        attachEvents : function() {

            var $this = this;
            this.searchAccessories();

            $(this.JS_TRIGGER_SEARCH_ACCESSORY_SELECT_SUBCATEGORY).change(function(ev) {
                ev.preventDefault();
                var url = GLOBAL.getUrl('category-accessories-search/index/getCompatibleBrands');
                var brandSel = $('#ast-brand');
                var selectBrand = "Selecteaza brand";
                var categoryId = $('#' + event.target.getAttribute('id')).find(':selected').attr('data-category-id');
                $.ajax({
                    url : url,
                    type : 'GET',
                    dataType: 'json',
                    data : {compatible_brand_attribute_id: categoryId},
                    beforeSend : function() {
                        GLOBAL.dispatch('EVENT_AJAX_CALL_BEFORE', 'Aplicam filtrul...');
                    }
                }).done(function(data){
                    GLOBAL.dispatch('EVENT_AJAX_CALL_AFTER');
                    try {
                        var obj = data;
                        if(obj.error == true ) {
                            GLOBAL.dispatch('EVENT_NOTICE_ERROR', obj.msg);
                            brandSel.find('option')
                                .remove()
                                .end()
                                .append($("<option>")
                                    .attr('value','')
                                    .text(selectBrand))
                            ;
                            brandSel.prop('disabled', 'disabled');
                        } else {
                            //GLOBAL.dispatch('EVENT_NOTICE_SUCCESS', obj.msg);
                            if(obj.response) {
                                brandSel.find('option')
                                    .remove()
                                    .end()
                                    .append($("<option>")
                                        .attr('value','')
                                        .text(selectBrand))
                                ;
                                $.each(obj.response, function(index, element) {
                                    brandSel.append($("<option>")
                                        .attr('value',element.compatible_brand_value)
                                        .attr('data-attribute_set_id', element.attribute_set_id)
                                        .attr('data-compatible_brand_id', element.compatible_brand_id)
                                        .text(element.compatible_brand_value))
                                    ;
                                });
                                brandSel.prop('disabled', false);
                            }else{
                                brandSel.find('option')
                                    .remove()
                                    .end()
                                    .append($("<option>")
                                        .attr('value','')
                                        .text(selectBrand))
                                ;
                                brandSel.prop('disabled', 'disabled');
                            }
                        }
                    } catch (Error) {
                        GLOBAL.dispatch('EVENT_NOTICE_ERROR', 'A aparut o eroare neasteptata');
                    }
                });
            });

            $(this.JS_TRIGGER_SEARCH_ACCESSORY_SELECT_BRAND).change(function(ev) {
                ev.preventDefault();
                var url = GLOBAL.getUrl('category-accessories-search/index/getCompatibleModels');
                var modelSel = $('#ast-model');
                var selectModel = "Selecteaza model";
                var attributeSetId = $('#ast-brand').find(':selected').attr('data-attribute_set_id');
                var compatibleBrandId = $('#ast-brand').find(':selected').attr('data-compatible_brand_id');
                $.ajax({
                    url : url,
                    type : 'GET',
                    dataType: 'json',
                    data: {attribute_set_id: attributeSetId, compatible_brand_attribute_id: compatibleBrandId},
                    beforeSend : function() {
                        GLOBAL.dispatch('EVENT_AJAX_CALL_BEFORE', 'Aplicam filtrul...');
                    }
                }).done(function(data){
                    GLOBAL.dispatch('EVENT_AJAX_CALL_AFTER');
                    try {
                        var obj = data;
                        if(obj.error == true ) {
                            GLOBAL.dispatch('EVENT_NOTICE_ERROR', obj.msg);
                            modelSel.find('option')
                                .remove()
                                .end()
                                .append($("<option>")
                                    .attr('value','')
                                    .text(selectModel))
                            ;
                            modelSel.prop('disabled', 'disabled');;
                        } else {
                            //GLOBAL.dispatch('EVENT_NOTICE_SUCCESS', obj.msg);
                            if(obj.response) {
                                modelSel.prop('disabled', false);
                                modelSel.find('option')
                                    .remove()
                                    .end()
                                    .append($("<option>")
                                        .attr('value','')
                                        .text(selectModel))
                                ;
                                $.each(data.response, function(index, element) {
                                    modelSel.append($("<option>")
                                        .attr('value',element.model_name)
                                        .attr('data-model_brand_id', element.model_brand_id)
                                        .attr('data-attribute_set_name', element.attribute_set_name)
                                        .text(element.model_name))
                                    ;
                                });
                                modelSel.prop('disabled', false);
                            }else{
                                modelSel.find('option')
                                    .remove()
                                    .end()
                                    .append($("<option>")
                                        .attr('value','')
                                        .text(selectModel))
                                ;
                                modelSel.prop('disabled', 'disabled');
                            }
                        }
                    } catch (Error) {
                        GLOBAL.dispatch('EVENT_NOTICE_ERROR', 'A aparut o eroare neasteptata');
                    }
                });
            });

        },

        showModal : function() {
        }
    };
}();

},{}],"local/catalog/book":[function(require,module,exports){
module.exports = function() {
    return {
        JS_TRIGGER_BOOK : ".js-trigger-book",
        JS_BOOK_CONTAINER : '#js-book-modal',
        JS_BOOK_FORM_CONTAINER : '#js-book-form-modal',
        JS_BOOK_FORM_ID : '#form-book-in-store',
        JS_TRIGGER_BOOK_PRODUCT : ".js-trigger-book-product",

        stores : null,

        productId : null,

        init : function() {
            require('chosen');
            this.listen();
            this.attachEvents();
        },

        showModal : function() {
            GLOBAL.dispatch('EVENT_SHOW_MODAL', this.JS_BOOK_CONTAINER);
        },
        showModalForm : function () {
            GLOBAL.dispatch('EVENT_SHOW_MODAL', this.JS_BOOK_FORM_CONTAINER);
            GLOBAL.dispatch('EVENT_INIT_FORM', this.JS_BOOK_FORM_ID);
        },

        getStoresForRegion : function (regionId) {
            var ret = [];
            if(null == this.stores) {
                return ret;
            }
            this.stores.forEach(function(each){
                if(each['region_id'] == regionId) {
                    ret.push(each);
                }
            });
            return ret;
        },
        attachOnBookForm : function() {
            var $this = this;
            var $date = new Date();

            $(this.JS_TRIGGER_BOOK_PRODUCT).click(function(ev){
                ev.preventDefault();
                var idErp = $(this).data('id-erp');
                if('undefined' == typeof idErp) {
                    return;
                }
                var url = GLOBAL.getUrl('storepickupv2/storepicker/saveNew');
                var $data = {};
                $($this.JS_BOOK_FORM_ID).validate(function(success){
                    if(!success) {
                        return;
                    }
                    if (window._checkTrdActionValue_ != undefined && _checkTrdActionValue_)
                    {
                        $data['tracking_code'] = encodeURIComponent(_checkTrdActionValue_);
                    }
                    $data['magazin'] = idErp;
                    $data['product'] = $this.productId;
                    $data['extraWarranty'] = 0;
                    $data['email'] = $('#book-email').val();
                    $data['name'] = $('#book-name').val();
                    $data['phone'] = $('#book-phone').val();
                    $data['unique_id'] = $date.getTime() + $data['email'];

                    if($('#check_button_newsletter').is(':checked')) {
                        $data['newsletter'] = 'true';
                    }
                    $.ajax({
                        url : url,
                        data : $data,
                        type : 'POST',
                        beforeSend : function() {
                            GLOBAL.dispatch('EVENT_CLEAR_MODALS');
                            GLOBAL.dispatch('EVENT_AJAX_CALL_BEFORE', 'Rezervam produsul...');
                        },
                    }).done(function(data){
                       var obj = data;
                        GLOBAL.dispatch('EVENT_AJAX_CALL_AFTER');
                       if(obj.error == true ) {
                           GLOBAL.dispatch('EVENT_NOTICE_ERROR', obj.msg);
                       } else {
                           //GLOBAL.dispatch('EVENT_CLEAR_MODALS');
                           GLOBAL.dispatch('EVENT_NOTICE_SUCCESS', obj.msg);
                       }
                    });
                });

            });
        },
        attachOnListChange : function() {
            var $this = this;
            $(this.JS_BOOK_CONTAINER + ' .js-trigger-book-here').click(function(ev){
                ev.preventDefault();
                var id_erp = $(this).data('book-erp');
                if('undefined' == typeof id_erp) {
                    return;
                }
                var template = require('local/catalog/template/book-form');
                template.setDataItem('idErp', id_erp);
                template.toHtml();
                $this.showModalForm();
                $this.attachOnBookForm();
            });
        },
        attachOnBook : function () {
            var $this = this;
            $(this.JS_BOOK_CONTAINER + ' .chosen-select').chosen({width : '100%'});
            $(this.JS_BOOK_CONTAINER + ' .chosen-select').change(function(ev){
                var value = $(this).val();
                var stores =  $this.getStoresForRegion(value);
                var template = require('local/catalog/template/book-list');
                template.setDataItem('stores', stores);
                template.toHtml();
                $this.attachOnListChange();
            });
        },

        attachEvents : function () {
            var $this = this;
            $(this.JS_TRIGGER_BOOK).click(function(ev){
                ev.preventDefault();
                var id = $(this).data('product-id');
                if('undefined' == typeof id) {
                    GLOBAL.dispatch('EVENT_NOTICE_ERROR', 'Produsul nu poate fi rezervat');
                    return;
                }
                $this.productId = id;
                var data = {};
                data['product_id'] = id;
                var url = GLOBAL.getUrl('storepickupv2/storepicker/getAjaxBook');
                var template = require('local/catalog/template/book');
                var templateForm = require('local/catalog/template/book-form');
                var templateList = require('local/catalog/template/book-list');
                if(null == template.getTemplate()) {
                    data['template'] = true;
                }
                if(null == templateForm.getTemplate()) {
                    data['templateForm'] = true;
                }
                if(null == templateList.getTemplate()) {
                    data['templateList'] = true;
                }

                $.ajax({
                    url : url,
                    type : 'POST',
                    data : data,
                    beforeSend : function() {
                        GLOBAL.dispatch('EVENT_AJAX_CALL_BEFORE', 'Cautam produsul in peste 100 de magazine...');
                    },
                }).done(function(data){
                   var obj = data;
                    GLOBAL.dispatch('EVENT_AJAX_CALL_AFTER');
                   if(obj.error == true ) {
                       GLOBAL.dispatch('EVENT_NOTICE_ERROR', obj.msg);
                   } else {
                       GLOBAL.dispatch('EVENT_NOTICE_SUCCESS', obj.msg);
                       if('undefined' != typeof obj['content']['template']){
                            template.setTemplate(obj['content']['template']);
                       }

                       if('undefined' != typeof obj['content']['templateForm']){
                            templateForm.setTemplate(obj['content']['templateForm']);
                       }
                       if('undefined' != typeof obj['content']['product']) {
                            templateForm.setDataItem('product', obj['content']['product']);
                       }

                       if('undefined' != typeof obj['content']['templateList']){
                            templateList.setTemplate(obj['content']['templateList']);
                       }

                       if('undefined' != typeof obj['content']['regions']) {
                        template.setDataItem('regions', obj['content']['regions']);
                       }
                       if('undefined' != typeof obj['content']['stores']) {
                        $this.stores = obj['content']['stores'];
                       }
                       template.toHtml();
                       $this.attachOnBook();
                       $this.showModal();
                   }
                });
                //gaq.push(["_trackEvent", "Rezerva in magazin start", "click", "pagina listing",, true]);
            });

        },
        listen : function() {
            GLOBAL.listen('EVENT_CATALOG_LIST_INITED', this.attachEvents.bind(this));
        }
    };
}();

},{"chosen":2,"local/catalog/template/book":19,"local/catalog/template/book-form":17,"local/catalog/template/book-list":18}],"local/catalog/compare":[function(require,module,exports){
module.exports = function(){
    return {

        JS_TRIGGER_COMPARE : '.js-trigger-compare',

        JS_COMPARE_LIST_PLACEHOLDER : '#js-compare-placeholder',

        list : {},

        as : null,

        LIMIT_COMPARABLE : 4,

        init : function() {
            var esi = require('local/esi');
            esi.addSubpart('compare', this.handleResponse.bind(this));
            this.listen();
            return this;
        },

        run : function() {
            this.attachEvents();
        },

        listen : function() {
            GLOBAL.listen('EVENT_CATALOG_LIST_INITED', this.attachEvents.bind(this));
            GLOBAL.listen('EVENT_CATALOG_LIST_INITED', this.resetMarkers.bind(this));
        },

        handleResponse : function(response) {
            this.createCompareList(response);
            return this;
        },

        createCompareList : function(data) {
            var template = require('local/catalog/template/compare');
            template.setData(data);
            template.toHtml();
            this.list = data.list;
            this.as = data.as;
            var $this = this;


            this.attachListEvents();
            return this;
        },

        toogleList : function() {
            var list = $(this.JS_COMPARE_LIST_PLACEHOLDER + ' .Compare-list');
            var $this = this;
            if(list.hasClass('is-visible')) {
                list.removeClass('is-visible');
            } else {
                list.addClass('is-visible');
            }
        },

        showList : function() {
            var list = $(this.JS_COMPARE_LIST_PLACEHOLDER + ' .Compare-list');
            if(list.hasClass('is-visible')) {
                return;
            }
            list.addClass('is-visible');
        },

        attachListEvents : function() {
            var $this = this;
            $(this.JS_COMPARE_LIST_PLACEHOLDER + ' .js-showCompare').click(function(){
                $this.toogleList();
            });



            $(this.JS_COMPARE_LIST_PLACEHOLDER + ' .Button-primary').click(function(){
                window.open(GLOBAL.getUrl('catalog/product_compare/index/') , '_blank');
            });

            $(this.JS_COMPARE_LIST_PLACEHOLDER + ' .Compare-productRemove').click(function(){
                var id = $(this).attr('rel');
                $this.removeFromCompare(id);
            });

            this.resetMarkers();

        },

        checkChangeAS : function(newAs) {
            if (this.as == null) {
                return true;
            }
            if('AS-' + this.as != newAs) {
                if(!confirm('Produsul pe care incarcati sa il adaugati nu poate fi comparat cu celelalte produse. Doriti sa stergeti celelalte produse?')) {
                    return false;
                }
                return true;
            }
            return true;
        },

        markAsChecked :function(id) {
            if($('#check_compare_' + id).length == 0) {
                return;
            }
            $('#check_compare_' + id).prop('checked', true);
        },

        isChecked : function(id) {
            if($('#check_compare_' + id).length == 0) {
                return false;
            }
            return $('#check_compare_' + id).prop('checked');
        },

        markAsUnchecked : function(id) {
            if($('#check_compare_' + id).length == 0) {
                return;
            }
            $('#check_compare_' + id).prop('checked', false);
        },

        addToCompare : function(id) {
            var $this = this;
            var url = GLOBAL.getUrl('catalog/product_compare/add/product/'+id+'/');
            $.ajax({
                url : url,
                beforeSend : function() {
                    GLOBAL.dispatch('EVENT_AJAX_CALL_BEFORE', 'Va rugam asteptati ...');
                },
            }).done(function(data) {
                GLOBAL.dispatch('EVENT_AJAX_CALL_AFTER');
                try {
                    var obj = JSON.parse(data);
                    if(obj.error == true ) {
                        GLOBAL.dispatch('EVENT_NOTICE_ERROR', obj.msg);
                    } else {
                        $this.createCompareList(obj.data);
                        GLOBAL.dispatch('EVENT_NOTICE_SUCCESS', obj.msg);
                        $this.markAsChecked(id);
                        $this.showList();
                    }
                } catch (Error) {
                    GLOBAL.dispatch('EVENT_NOTICE_ERROR', 'A aparut o eroare neasteptata');
                }
            });
        },

        removeFromCompare : function(id) {
            var $this = this;
            var url = GLOBAL.getUrl('catalog/product_compare/remove/product/'+id+'/');
            $.ajax({
                url : url,
                beforeSend : function() {
                    GLOBAL.dispatch('EVENT_AJAX_CALL_BEFORE', 'Va rugam asteptati ...');
                },
            }).done(function(data) {
                GLOBAL.dispatch('EVENT_AJAX_CALL_AFTER');
                try {
                    var obj = JSON.parse(data);
                    if(obj.error == true ) {
                        GLOBAL.dispatch('EVENT_NOTICE_ERROR', obj.msg);
                    } else {
                        $this.createCompareList(obj.data);
                        GLOBAL.dispatch('EVENT_NOTICE_SUCCESS', obj.msg);
                        $this.markAsUnchecked(id);
                        $this.showList();
                    }
                } catch (Error) {
                    GLOBAL.dispatch('EVENT_NOTICE_ERROR', 'A aparut o eroare neasteptata');
                }
            });
        },

        resetMarkers : function() {
            var $this = this;
            $(this.JS_TRIGGER_COMPARE).each(function(){
                var id = $(this).data('product-id');
                if('undefined' == typeof id) {
                    return ;
                }
                $this.markAsUnchecked(id);
            });
            Object.keys(this.list).forEach(function(id){
                $this.markAsChecked(id);
            });
        },

        attachEvents : function() {
            var $this = this;
            $(this.JS_TRIGGER_COMPARE).click(function(ev){
                ev.preventDefault();

                var as = $(this).data('product-as');
                var id = $(this).data('product-id');
                if('undefined' == typeof as) {
                    return ;
                }

                if('undefined' == typeof id) {
                    return ;
                }

                var add = !$this.isChecked(id);

                if(add) {
                    if(!$this.checkChangeAS(as)) {
                        return;
                    }
                    if(Object.keys($this.list).length + 1 > $this.LIMIT_COMPARABLE) {
                        GLOBAL.dispatch('EVENT_NOTICE_ERROR', 'Nu pot fi adaugate mai mult de 4 produse la comparatie');
                        return ;
                    }
                    $this.addToCompare(id);
                } else {
                    $this.removeFromCompare(id);
                }
            });
        },
    };
}();

},{"local/catalog/template/compare":20,"local/esi":"local/esi"}],"local/catalog/customerviewed":[function(require,module,exports){
module.exports = function() {
    return {

    	CUSTOMERVIEWED_ACTIVE: "#customerviewed-box",
    	DATA_FIELD: "#customerviewed_data",

        init : function() {
        	var sendData = GLOBAL.getModuleData('prediction_data');

        	if (sendData) {
	        	var esi = require('local/esi');
	            esi.addSubpart('prediction', this.handleResponse.bind(this), {data: sendData});
	            this.listen();
        	}
            return this;
        },

        listen : function() {
            return;
        },

        run : function() {
            return;
        },

        handleResponse: function() {
        	return;
        },
    };
}();
},{"local/esi":"local/esi"}],"local/catalog/list":[function(require,module,exports){
module.exports = function() {
    return {

        CONTAINER_PRODUCT_LIST : '#js-viewGrid-target',
        OBJ_CONTAINER_PRODUCT_LIST : null,

        JS_LIST_MODE_SWITCHER : '.js-catalog-list-filter-mode',
        JS_LIST_FILTER : '.js-catalog-list-filter',
        JS_LIST_FILTER_SELECT: '.js-catalog-list-filter-select',
        JS_SLIDER_FILTER : '#js-trigger-slider',
        JS_LIST_PAGINATE : '.js-catalog-list-paginate',


        JS_TRIGGER_SHOW_FILTER : '.js-trigger-show-filter',
        JS_TRIGGER_SHOW_VIEW  :  '.js-trigger-show-view',

        JS_TRIGGER_PRODUCT_LIST_GIFT : ".js-trigger-product-list-gift",
        JS_SHOW_MODAL_GIFT : "#js-gift-modal",
        JS_TRIGGER_PRODUCT_GIFT : ".js-trigger-product-gift-add-to-cart",
        JS_TRIGGER_PRODUCT_GIFT_MODAL : ".js-trigger-cart-add-gift-modal",

        COOKIE_LIST_MODE_NAME : 'category_display_mode',


        EVENT_CATALOG_LIST_INITED : 'EVENT_CATALOG_LIST_INITED',

        init : function() {
            this.listen();
            require('nouislider');
            //GLOBAL.dispatch(this.EVENT_CATALOG_LIST_INITED);
        },

        listenForMobile : function() {
           $(this.JS_TRIGGER_SHOW_FILTER).on('click touchend', function (e) {
                e.preventDefault();
                $('.main > .l-container').dimmer({
                    dimmerName: 'dimmer--context',
                    onHide: function(){
                        $('.Filtre-container').removeClass('is-active');
                    }
                }).dimmer('show');
                $('.Filtre-container').addClass('is-active');
            });
            $(this.JS_TRIGGER_SHOW_VIEW).on('click touchend', function (e) {
                e.preventDefault();
                $('.main > .l-container').dimmer({
                    dimmerName: 'dimmer--context',
                    onHide: function(){
                        $('.ViewSettings').removeClass('is-active');
                    }
                }).dimmer('show');
                $('.ViewSettings').addClass('is-active');
            });

        },

        listenForAddToCartWithGifts: function(){
            var $this = this;
            $(this.JS_TRIGGER_PRODUCT_LIST_GIFT).click(function(ev) {
                ev.preventDefault();
                var productId = $(this).data('product-id');
                var url = GLOBAL.getUrl('produse-cadou/ajax/indexJson/product/' + productId + '/');
                $.ajax({
                    url : url,
                    type : 'POST',
                    data : {},
                    beforeSend : function() {
                        GLOBAL.dispatch('EVENT_AJAX_CALL_BEFORE', 'Produsul este adaugat in cos...');
                    }
                }).done(function(data){
                    GLOBAL.dispatch('EVENT_AJAX_CALL_AFTER');
                    try {
                        var obj = data;
                        if(obj.error == true ) {
                            GLOBAL.dispatch('EVENT_NOTICE_ERROR', obj.msg);
                        } else {
                            //GLOBAL.dispatch('EVENT_NOTICE_SUCCESS', obj.msg);
                            var template = require('local/catalog/template/gift');
                            template.setDataItem('productWithGift', obj.product);
                            template.setDataItem('price', obj.price);
                            template.setDataItem('originalPrice', obj.originalPrice);
                            template.setDataItem('giftsList', obj.giftsList);
                            template.toHtml();
                            $this.showModalGift();
                            $this.listenForAddToCartWithGiftsModal(obj.product.id);
                            $($this.JS_SHOW_MODAL_GIFT + ' .js-closeModal').click(function(){
                                GLOBAL.dispatch('EVENT_REMOVE_MODAL', $this.JS_SHOW_MODAL_GIFT);
                            });
                        }
                    } catch (Error) {
                        GLOBAL.dispatch('EVENT_NOTICE_ERROR', 'A aparut o eroare neasteptata. Va rugam sa reincercati.');
                    }
                });
            });
        },


        listenForAddToCartWithGiftsModal: function(productId){
            var $this = this;
            $(this.JS_TRIGGER_PRODUCT_GIFT_MODAL).click(function(ev) {
                ev.preventDefault();
                var url = GLOBAL.getUrl('checkout/cart/add/');
                var gift_option = '';
                var data = {};
                $($this.JS_SHOW_MODAL_GIFT).find('input').each(function(key, elem){
                    var input = $(elem);
                    if(input.attr("name") == "gift_options"){
                        gift_option = input.val();
                    }
                });

                if(gift_option == 2){
                    var gift = '';
                } else {
                    var gift = [];
                }

                $($this.JS_SHOW_MODAL_GIFT).find('input').each(function(key, elem){
                    var input = $(elem);
                    if(input.attr("name") == "gift_product" && input.attr("checked")){
                        gift = input.val();
                    }
                    if(input.attr("name") == "gift_products[]" && input.attr("checked")){
                        gift[gift.length++] = input.val();
                    }
                });

                if(gift_option == 2){
                    data = {'gift_product' : gift, 'product': productId};
                } else {
                    data = {'gift_products[]' : gift, 'product': productId};
                }

                $.ajax({
                    url : url,
                    type : 'POST',
                    data : data,
                    beforeSend : function() {
                        GLOBAL.dispatch('EVENT_AJAX_CALL_BEFORE', 'Produsul este adaugat in cos...');
                    }
                }).done(function(data){
                    GLOBAL.dispatch('EVENT_AJAX_CALL_AFTER');
                    try {
                        var obj = data;
                        if(obj.error == true ) {
                            GLOBAL.dispatch('EVENT_NOTICE_ERROR', obj.msg);
                        } else {
                            GLOBAL.dispatch('EVENT_NOTICE_SUCCESS', obj.msg);
                            require('local/minicart').initMiniCart(obj.list);

                            var template = require('local/catalog/template/gift_product.js');
                            template.setDataItem('products', obj.products);
                            template.setDataItem('checkoutUrl', GLOBAL.getUrl('checkout/onepage/'));
                            template.toHtml();
                            $this.showModalGift();
                            $($this.JS_SHOW_MODAL_GIFT + ' .js-closeModal').click(function(){
                                GLOBAL.dispatch('EVENT_REMOVE_MODAL', $this.JS_SHOW_MODAL_GIFT);
                            });
                        }
                    } catch (Error) {
                        GLOBAL.dispatch('EVENT_NOTICE_ERROR', 'A aparut o eroare neasteptata. Va rugam sa reincercati.');
                    }
                });
            });
        },

        showModalGift : function () {
            GLOBAL.dispatch('EVENT_SHOW_MODAL', this.JS_SHOW_MODAL_GIFT);
        },


        listen : function() {
            GLOBAL.listen(this.EVENT_CATALOG_LIST_INITED, this.attachEvents.bind(this));
        },


        run : function () {
            this.attachEvents();
            this.setDisplayMode();
        },

        setDisplayMode : function() {
            if('list' == Cookie.get(this.COOKIE_LIST_MODE_NAME)) {
                this.setListMode();
            } else {
                this.setGridMode();
            }
            return this;
        },

        execFilter : function(url, scroll) {
            var $this = this;
            var ajaxurl = url;
            if (!history.pushState) {
                window.location.href = url;
            }
            $.ajax({
                url : ajaxurl,
                data: {'m-ajax': 1},
                beforeSend : function() {
                    GLOBAL.dispatch('EVENT_AJAX_CALL_BEFORE', 'Aplicam filtrul...');
                },
            }).done(function(data) {
                if('undefined' == typeof data) {
                    return this;
                }
                var parsed = JSON.parse(data);
                if('undefined' == typeof parsed){
                    return this;
                }
                if(parsed.hasOwnProperty('title')) {
                    document.title = parsed.title;
                    history.pushState({}, parsed.title, url);
                }
                if(parsed.hasOwnProperty('update')) {
                    $this.updateSections(parsed.update);
                    if ( !$('.Filtre-container').hasClass('is-active') ) {
                        // $('.ViewSettings').addClass('is-active');
                        $('.main > .l-container').dimmer().dimmer('hide');
                        if (scroll) {
                            $('html, body').animate({
                                scrollTop: $("#js-viewGrid-target").offset().top - 100
                            }, 200);
                        };
                    };
                    GLOBAL.dispatch('EVENT_AJAX_CALL_AFTER');
                    GLOBAL.dispatch($this.EVENT_CATALOG_LIST_INITED);
                }

            });
        },

        updateSections : function(update) {
            if('object' != typeof update) {
                return this;
            }
            $.each(update, function(selector, html) {
                var selected = $(selector);
                if (selected.length) {
                    var first = $(selected[0]);
                    if (selected.length > 1) {
                        selected.slice(1).remove();
                    }
                    first.replaceWith(html);
                }
            });
        },

        attachSlider : function() {
            var priceFrom = parseInt($('#price-range-from').text()) || 0;
            var priceTo = parseInt($('#price-range-to').text()) || 0;
            var minFrom = parseInt($('#price-min-from').text()) || 0;
            var maxTo = parseInt($('#price-max-to').text()) || 0;
            var $this = this;
            $(this.JS_SLIDER_FILTER).noUiSlider({
				start: [ priceFrom, priceTo],
				connect: true,
				range: {
					'min': minFrom,
					'max': maxTo
				},
				format:  wNumb({
					decimals: 0,
					mark: ',',
					thousand: ''
				})
            });
            $(this.JS_SLIDER_FILTER).Link('lower').to($('#price-range-from'));
            $(this.JS_SLIDER_FILTER).Link('upper').to($('#price-range-to'));
            $(this.JS_SLIDER_FILTER).on({
                set : function() {
                    var range = $($this.JS_SLIDER_FILTER).val();
                    var from = range[0];
                    var to = range[1];
                    if(from == minFrom && to == maxTo) {
                        from = null, to = null;
                    }
                    var url = $this.getPriceRangeUrl(from, to);
                    $this.execFilter(url);
                }
            });
        },

        getPriceRangeUrl : function(from, to) {
            var currentUrl = $(location).attr('href');
            if(currentUrl.substr(-1) == '#') {
                currentUrl = currentUrl.substr(0, currentUrl.length - 1);
            }
            if(currentUrl.substr(-1) != '/') {
                currentUrl = currentUrl +'/';
            }
            if(from == null && to == null) {
               currentUrl = currentUrl.replace(/\/price\/[0-9]+,[0-9]+\// , '/');
            } else if(currentUrl.search('/price/[0-9]+,[0-9]+/') == -1) {
                var filter = '';
                if(currentUrl.search('/filtru/') == -1){
                    filter = 'filtru/';
                }
                currentUrl = currentUrl + filter + 'price/' + from + ',' + to + '/';
            } else {
               currentUrl = currentUrl.replace(/\/price\/[0-9]+,[0-9]+\// , '/price/' + from+ ',' + to + '/');
            }
            return currentUrl;
        },

        listenShowMore : function(e) {
            var $this = this;
            $(".Show-more").on( "click", function(e) {
                e.preventDefault();
                var parent = $( this ).parent('li');
                parent.find('ul li').each(function(key, elem){
                    var lielem = $(elem);
                    if(lielem.hasClass('hidden-list')){
                        lielem.show();
                    }
                });
                $( this ).hide();
                parent.find('.Show-less').show();
            });

            $(".Show-less").on( "click", function(e) {
                e.preventDefault();
                var parent = $( this ).parent('li');
                parent.find('ul li').each(function(key, elem){
                    var lielem = $(elem);
                    if(lielem.hasClass('hidden-list')){
                        lielem.hide();
                    }
                });
                $( this ).hide();
                parent.find('.Show-more').show();
            });

        },

        attachEvents : function() {
            this.OBJ_CONTAINER_PRODUCT_LIST = $(this.CONTAINER_PRODUCT_LIST);
            var $this = this;

            $(this.JS_LIST_MODE_SWITCHER).unbind('change').change(function(){
                if($(this).val() == 'list') {
                    $this.setListMode();
                } else {
                    $this.setGridMode();
                }
                Cookie.set($this.COOKIE_LIST_MODE_NAME, $(this).val());
            });

            /** attach on slider **/
            this.attachSlider();


            $(this.JS_LIST_FILTER_SELECT).unbind('change').change(function(ev) {
                ev.preventDefault();
                var elem = $(this);
                var url = null;
                if(elem.is('a')) {
                    url = elem.attr('href');
                } else if(elem.is('select')) {
                    url = $(this).val();
                } /* else {
                    console.log(type);
                } */
                if(null != url) {
                    if(url.indexOf("catalogsearch/result") > -1){
                        window.location.assign(url);
                    }else{
                        $this.execFilter(url);
                    }
                }
            });

            $(this.JS_LIST_FILTER).unbind('click').click(function(ev) {
                ev.preventDefault();
                var elem = $(this);
                var url = null;
                if(elem.is('a')) {
                    url = elem.attr('href');
                } else if(elem.is('select')) {
                    url = $(this).val();
                } /* else {
                    console.log(type);
                } */
                if(null != url) {
                    if(url.indexOf("catalogsearch/result") > -1){
                        window.location.assign(url);
                    } else {
                        $this.execFilter(url);
                    }
                }
            });

            $(this.JS_LIST_PAGINATE).unbind('click').click(function(ev) {
                ev.preventDefault();
                var elem = $(this);
                var url = null;
                var scroll = true;
                if(elem.is('a')) {
                    url = elem.attr('href');
                } /* else {
                    console.log(type);
                } */
                if(null != url) {
                    if(url.indexOf("catalogsearch/result") > -1){
                        window.location.assign(url);
                    } else {
                        // Url-ul nu trebuie sa contina parametrii cu (? = & ) altfel se poate ajunge la situatii in care nu mai aplica filtrele care vin dupa acesti parametrii
                        url = url.replace("?", "/");
                        url = url.replace(/&/g, "/");
                        url = url.replace(/=/g, "/");
                        $this.execFilter(url, scroll);
                    }
                }
            });

            this.listenForMobile();
            this.listenForAddToCartWithGifts();
            this.listenShowMore();
        },

        setListMode : function() {
            if(this.OBJ_CONTAINER_PRODUCT_LIST == null) {
                return this;
            }
            if($(this.JS_LIST_MODE_SWITCHER).val() != 'list') {
                $(this.JS_LIST_MODE_SWITCHER).find('option[value=list]').attr('selected', 'selected');
            }
            if(!this.OBJ_CONTAINER_PRODUCT_LIST.hasClass('ProductGrid-list--listView')) {
                this.OBJ_CONTAINER_PRODUCT_LIST.addClass('ProductGrid-list--listView');
            }
            return this;
        },
        setGridMode : function() {
            if(this.OBJ_CONTAINER_PRODUCT_LIST == null) {
                return this;
            }

            if($(this.JS_LIST_MODE_SWITCHER).val() != 'grid') {
                $(this.JS_LIST_MODE_SWITCHER).find('option[value=grid]').attr('selected', 'selected');
            }

            if(this.OBJ_CONTAINER_PRODUCT_LIST.hasClass('ProductGrid-list--listView')) {
                this.OBJ_CONTAINER_PRODUCT_LIST.removeClass('ProductGrid-list--listView');
            }
            return this;
        }
    };
}();

},{"local/catalog/template/gift":21,"local/catalog/template/gift_product.js":22,"local/minicart":"local/minicart","nouislider":5}],"local/catalog/product":[function(require,module,exports){
module.exports = function() {
    return {

        JS_TRIGGER_ADD : ".js-trigger-cart-add",
        JS_TRIGGER_WARRANTY : ".js-catalog-warranty",
        JS_TRIGGER_MOBILE : ".js-catalog-mobile",
		JS_TRIGGER_BUYBACK : ".js-catalog-buyback",
        JS_TRIGGER_SERVICII : ".js-catalog-servinstall",
        JS_CART_ADD_MODAL : '#js-add-to-cart-modal',
        JS_TRIGGER_WARRANTY_SELECT : '.js-trigger-warranty-select',
        JS_TRIGGER_MOBILE_SELECT : '.js-trigger-mobile-select',
        JS_TRIGGER_SERVICII_SELECT : '.js-trigger-servinstall-select',
        JS_TRIGGER_BUYBACK_SELECT : '.js-trigger-buyback-select',
        CADOURI_LIST : '#Cadouri-list',
        HASH_LINKS : '.js-gotoHash',
        STICKY_LINKS : '.js-gotoSticky',
        STICKY_LINKS_TAB : 'is-tabTarget',
        PRODUS_STICKY: '#ProdusSticky',
        DID_SCROLL: false,


        init : function() {
            this.listen();
        },

        listen : function() {
            GLOBAL.listen('EVENT_CATALOG_LIST_INITED', this.attachEvents.bind(this));
            GLOBAL.listen('RECENTLY_VIEWED_INSERTED', this.stickyLinksClick.bind(this));

            this.checkPageHash();
            this.hashLinksClick();
            this.stickyLinksClick();

            var baguetteBox = require('baguetteBox');
            baguetteBox.run('#js-trigger-product-carousel');


            resigilateList = $(".js-resigilateList").children().length;

            if (resigilateList > 5) {

                var owlCarousel = require('owlCarousel');
                // Se pune numai daca sunt peste 5 si mai sus (nu ultima sectiune pe pagina)
                    var resigilateOwl = $(".js-resigilateList");
                    resigilateOwl.owlCarousel({
                        items : 5,
                        responsive: {
                            0:{ items:2 },
                            520:{ items:3 },
                            750:{ items:4 },
                            1000:{ items:5 }
                        },
                        dots: false,
                        dotsSpeed: 200,
                        nav:true,
                        navText: ["<", ">"],
                        onInitialized : resigilateCallback()
                    });

            }

            similarList = $(".js-similarList").children().length;

            if (similarList > 5) {

                var owlCarousel = require('owlCarousel');
                // Se pune numai daca sunt peste 5 si mai sus (nu ultima sectiune pe pagina)
                    var similarOwl = $(".js-similarList");
                    similarOwl.owlCarousel({
                        items : 5,
                        responsive: {
                            0:{ items:2 },
                            520:{ items:3 },
                            750:{ items:4 },
                            1000:{ items:5 }
                        },
                        dots: false,
                        dotsSpeed: 200,
                        nav:true,
                        navText: ["<", ">"],
                        onInitialized : similarCallback()
                    });

            }


            accesoriesList = $(".js-accesoriesList").children().length;

            if (accesoriesList > 5) {

                var owlCarousel = require('owlCarousel');
                // Se pune numai daca sunt peste 5 si mai sus (nu ultima sectiune pe pagina)
                    var accesoriesOwl = $(".js-accesoriesList");
                    accesoriesOwl.owlCarousel({
                        items : 5,
                        responsive: {
                            0:{ items:2 },
                            520:{ items:3 },
                            750:{ items:4 },
                            1000:{ items:5 }
                        },
                        dots: false,
                        dotsSpeed: 200,
                        nav:true,
                        navText: ["<", ">"],
                        onInitialized : accesoriesCallback()
                    });

            }

            function accesoriesCallback(event) {
                accesoriesOwl.removeClass("ProductGrid-5to2");
            }

            function similarCallback(event) {
                similarOwl.removeClass("ProductGrid-5to2");
            }

            function resigilateCallback(event) {
                resigilateOwl.removeClass("ProductGrid-5to2");
            }

            if ( $(this.PRODUS_STICKY).length && !$(".MobileMenu").is(':visible')) {
                this.scrollLis();
            };

        },

        scrollLis: function() {
            $(window).scroll(function() {
                this.DID_SCROLL = true;
            });
            var $self = this;
            setInterval(function() {
                if ( this.DID_SCROLL ) {
                    this.DID_SCROLL = false;
                    $self.stickyPosition();
                }
            }, 250);
        },

        stickyPosition: function() {
            var $afterElem = $('.ProdusPage-main');
            var stickyPosition = $afterElem.position().top + $afterElem.outerHeight(true);

            if ( $(window).scrollTop() >= stickyPosition ) {
                $(this.PRODUS_STICKY).addClass('is-active')
            } else {
                $(this.PRODUS_STICKY).removeClass('is-active');
            };
        },

        stickyLinksClick : function() {
            var $this = this;
            $(this.STICKY_LINKS).click(function(e){
                e.preventDefault();
                var href = $(this).attr('href');

                if ( $(this).hasClass($this.STICKY_LINKS_TAB) ) {
                    var hash = href.substring(href.indexOf('#'));
                    $this.openTabAndScroll(hash, - 70);
                } else {
                    $('html, body').scrollTop($(href).offset().top - 90);
                };

            });
        },

        hashLinksClick : function() {
            var $this = this;
            $(this.HASH_LINKS).click(function(e){
                e.preventDefault();
                var href = $(this).attr('href');
                var hash = href.substring(href.indexOf('#'));
                $this.openTabAndScroll(hash);
            });
        },

        checkPageHash : function() {
            if (window.location.hash !== "") {
                var hash = window.location.hash;
                this.openTabAndScroll(hash);
            };
        },

        openTabAndScroll : function(hash, margin) {
            var margin = margin || 0;
            if ( $(".Tabs-navEntry[data-toggle-content='" + hash + "']")[0] ) {
                $('.Tabs-navEntry').removeClass('is-active');
                $(".Tabs-navEntry[data-toggle-content='" + hash + "']").addClass('is-active');
                $('.Tabs-contentEntry').removeClass('is-active');
                $(hash).addClass('is-active');
                $('html, body').scrollTop($('.Tabs').offset().top + margin);
            };
        },

        run : function() {
            this.attachEvents();
        },

        attachEvents : function() {
            var $this = this;

            $(this.JS_TRIGGER_WARRANTY_SELECT).on('change', function() {
                $($this.JS_TRIGGER_WARRANTY_SELECT).not(this).prop('checked', false);
            });

            $(this.JS_TRIGGER_MOBILE_SELECT).on('change', function() {
                $($this.JS_TRIGGER_MOBILE_SELECT).not(this).prop('checked', false);
            });

            $(this.JS_TRIGGER_BUYBACK_SELECT).on('change', function() {
                $($this.JS_TRIGGER_BUYBACK_SELECT).not(this).prop('checked', false);
            });

            $(this.JS_TRIGGER_SERVICII_SELECT).on('change', function() {
                $($this.JS_TRIGGER_SERVICII_SELECT).not(this).prop('checked', false);
            });

            $(this.JS_TRIGGER_ADD).click(function(ev){
                ev.preventDefault();
                var productId = $(this).data('product-id');
                var warrantyId = $($this.JS_TRIGGER_WARRANTY + ':checked').val();
                var buybackId = $($this.JS_TRIGGER_BUYBACK + ':checked').val();
                var mobileId = $($this.JS_TRIGGER_MOBILE + ':checked').val();
                var serviciiId = $($this.JS_TRIGGER_SERVICII + ':checked').val();

                if('undefined' == typeof productId) {
                    GLOBAL.dispatch('EVENT_NOTICE_ERROR', 'Produsul nu poate fi adaugat in cos.');
                    return;
                }

                var gift_option = '';
                var data = {};
                $($this.CADOURI_LIST).find('input').each(function(key, elem) {
                    var input = $(elem);
                    if (input.attr("name") == "gift_options") {
                        gift_option = input.val();
                    }
                });

                if(gift_option == 2){
                    var gift = '';
                } else {
                    var gift = [];
                }

                $($this.CADOURI_LIST).find('input').each(function(key, elem){
                    var input = $(elem);
                    if(input.attr("name") == "gift_product" && input.is(":checked")){
                        gift = input.val();
                    }
                    if(input.attr("name") == "gift_products[]" && input.is(":checked")){
                        gift[gift.length++] = input.val();
                    }
                });

                if(gift_option == 2){
                    data['gift_product'] = gift;
                } else {
                    data['gift_products[]'] = gift;
                }

                data['product'] = productId;
                if('undefined' != typeof  warrantyId) {
                    data['extragarantie_for'] = productId;
                    data['extragarantie'] = warrantyId;
                }
                if('undefined' != typeof mobileId) {
                    data['mobile_for'] = productId;
                    data['mobile'] = mobileId;
                }
                if('undefined' != typeof  buybackId) {
                    data['buyback_for'] = productId;
                    data['buyback'] = buybackId;
                }
                if('undefined' != typeof  serviciiId) {
                    data['servinstall_for'] = productId;
                    data['servinstall'] = serviciiId;
                }

                var url = GLOBAL.getUrl('checkout/cart/add/product/' + productId + '/');
                $.ajax({
                    url : url,
                    type : 'POST',
                    data : data,
                    beforeSend : function() {
                        GLOBAL.dispatch('EVENT_AJAX_CALL_BEFORE', 'Produsul este adaugat in cos...');
                    },
                }).done(function(data){
                    GLOBAL.dispatch('EVENT_AJAX_CALL_AFTER');
                    try {
                        var obj = data;
                        if(obj.error == true ) {
                            GLOBAL.dispatch('EVENT_NOTICE_ERROR', obj.msg);
                        } else {
                            //GLOBAL.dispatch('EVENT_NOTICE_SUCCESS', obj.msg);
                            require('local/minicart').initMiniCart(obj.list);

                            var template = require('local/catalog/template/product.js');
                            template.setDataItem('products', obj.products);
                            template.setDataItem('checkoutUrl', GLOBAL.getUrl('checkout/onepage/'));
                            template.toHtml();
                            $this.showModal();
                            $($this.JS_CART_ADD_MODAL + ' .js-closeModal').click(function(){
                                GLOBAL.dispatch('EVENT_REMOVE_MODAL', $this.JS_CART_ADD_MODAL);
                            });
                        }
                    } catch (Error) {
                        GLOBAL.dispatch('EVENT_NOTICE_ERROR', 'A aparut o eroare neasteptata. Va rugam incercati mai tarziu.');
                    }
              });
            });
        },
        showModal : function() {
            GLOBAL.dispatch('EVENT_SHOW_MODAL', this.JS_CART_ADD_MODAL);
        }
    };
}();


},{"baguetteBox":1,"local/catalog/template/product.js":23,"local/minicart":"local/minicart","owlCarousel":8}],"local/catalog/recentlyviewed":[function(require,module,exports){
module.exports = function() {
    return {

    	PRODUCT_DATA: '#js-ProductData',
    	COOKIE_NAME: 'recentVizualizate',
    	COOKIE_EXPIRATION: 30,
    	PRODUCT_EXPIRATION: 30,
    	MAX_PRODUCTS: 8,
    	STICKY_LINKS: '.js-stickyLinks',

    	init: function() {
    		this.Cookies = require('cookies');

    		var cookieData = []
    		cookieData = this.checkCookie();

    		var pageProductData = this.checkPageProductData();

    		// if cookie -> expire products
    		if (cookieData != false) {
    			cookieData = this.expireProducts(cookieData);
    			this.show(cookieData, pageProductData);
    		};

    		// if page data -> insert product
    		if (pageProductData != false) {
    			this.addProduct(pageProductData, cookieData);
    		};

    	},


    	/**
    	 * Check if cookie exists, return product list or false
    	 */
    	checkCookie: function() {
    		var myCookie = this.Cookies.get(this.COOKIE_NAME);

    		if (typeof(myCookie) != 'undefined' && myCookie != null) {
    			var decodedString = atob(myCookie);
    		    return JSON.parse(decodedString);
    		} else {
    		    return false;
    		}
    	},


    	/**
    	 * Check if page product data exists, return data or false
    	 */
    	checkPageProductData: function() {

    		if ( $(this.PRODUCT_DATA).length != 0 ) {
    			var pageData = JSON.parse( $(this.PRODUCT_DATA).html() );

    			if (pageData !== null && typeof pageData === 'object') {
    			    return pageData;
    			} else {
    			    return false;
    			}
    		} else {
    			return false;
    		}
    	},


    	/**
    	 * Expire products from list
    	 */
    	expireProducts: function(cookieData) {
    		var today = new Date();
    		var expira;

    		cookieData = cookieData.filter(function(el) {
    			expira = new Date(el["expiration"]);
    			return expira >= today;
    		});

    		return(cookieData);
    	},


    	/**
    	 * Add product to list
    	 */
    	addProduct: function(product, cookie) {
    		var productExpiration = new Date();
    		productExpiration.setDate(productExpiration.getDate() + this.PRODUCT_EXPIRATION);
    		product["expiration"] = productExpiration;

    		var cookieData = [];

    		if (cookie != false) {
    			cookieData = cookie;
    		}

    		// stergem toate produsele cu acelasi sku
    		cookieData = cookieData.filter(function(el) {
    			return el["sku"] !== product["sku"];
    		});

    		// facem loc daca sunt mai multe produse decat max
    		cookieData.splice(this.MAX_PRODUCTS - 1, cookieData.length);

    		// se introduce produsul primul
    		cookieData.unshift(product);

    		// scrie cookie
    		this.writeCookie(cookieData);
    	},


    	/**
    	 * Write cookie
    	 */
    	writeCookie: function(cookie) {
    		var cookieExpiration = new Date();
    		cookieExpiration.setDate(cookieExpiration.getDate() + this.COOKIE_EXPIRATION);

    		var cookieData = JSON.stringify(cookie);
    		var encodedString = btoa(cookieData);
    		this.Cookies.set(this.COOKIE_NAME, encodedString, { expires: cookieExpiration });

    		if (this.Cookies.enabled) {
    			this.checkWrittenCookie(encodedString, cookie);
    		}
    	},

    	/**
    	 * Check if cookie write
    	 */
    	checkWrittenCookie: function(encodedString, cookie) {
    		var myCookie = this.Cookies.get(this.COOKIE_NAME);
    		if (encodedString === myCookie) {
    			return null;
    		} else {
    			cookie.pop();
    			this.writeCookie(cookie);
    		};
    	},


    	/**
    	 * Show products
    	 */
    	show: function(cookieData, product) {

    		if (product != false) {
				cookieData = cookieData.filter(function(el) {
					return el["sku"] !== product["sku"];
				});
			}

    		var template = require('local/catalog/template/recentlyviewed');
    		template.setData({'cookieData': cookieData});
    		template.toHtml();

    		if (cookieData.length > 5) {
    			var owlCarousel = require('owlCarousel');

    			var carousel = $(".js-recentlyViewedList");

    			carousel.owlCarousel({
    			    items : 5,
    			    responsive: {
    			        0:{ items:2 },
    			        520:{ items:3 },
    			        750:{ items:4 },
    			        1000:{ items:5 }
    			    },
    			    dots: false,
    			    dotsSpeed: 200,
    			    nav:true,
    			    navText: ["<", ">"],
    			    onInitialized : carouselCallback()
    			});
    		};

    		function carouselCallback(event) {
    		    carousel.removeClass("ProductGrid-5to2");
    		}

    		$(this.STICKY_LINKS).append('<a href="#vazute-recent" class="ProdusSticky-link u-bodyColorLink js-gotoSticky">Produse vizualizate recent</a>')
    		GLOBAL.dispatch('RECENTLY_VIEWED_INSERTED');
    	},

    };
}();



},{"cookies":37,"local/catalog/template/recentlyviewed":25,"owlCarousel":8}],"local/catalog/review":[function(require,module,exports){
/**
 * Created by emanuel on 09.06.2015.
 */

module.exports = function() {
    return {

        JS_TRIGGER_SHOW_COMMENT_FORM : ".js-trigger-add-comment",
        JS_TRIGGER_VIEW_COMMENTS : ".js-trigger-view-comments",
        JS_TRIGGER_SEND_COMMENT : ".js-trigger-send-comment",

        JS_TRIGGER_SEND_REVIEW : ".js-trigger-send-review",
        JS_TRIGGER_VOTE : ".js-trigger-vote",
        JS_TRIGGER_SEND_QUESTION : ".js-trigger-send-question",
        JS_TRIGGER_SEND_QUESTION_ANSWER : ".js-trigger-send-question-answer",
        JS_TOGGLE_REVIEWS : ".js-toggle-reviews",
        JS_TRIGGER_SEE_MORE_QUESTIONS : ".js-trigger-see-more-questions",
        JS_TRIGGER_SEE_MORE_REVIEWS     : '.js-trigger-see-more-reviews',

        init : function() {
            this.attachEvents();
        },

        listen : function() {
        },

        run : function() {
        },

        viewComments : function () {
            $(this.JS_TRIGGER_VIEW_COMMENTS).unbind('click').click(function(ev){
                ev.preventDefault();
                var $list = $(this).parents(".Review-item").children(".Comment").children(".Comment-list");
                var $form = $(this).parents(".Review-item").children(".Comment").children(".Comment-form");

                if ($list.hasClass("is-active")) {
                    $list.removeClass("is-active")
                    $form.removeClass("is-active");
                } else {
                    $list.addClass("is-active");
                    $form.addClass("is-active");
                };
            });
        },

        showCommentForm : function () {
            $(this.JS_TRIGGER_SHOW_COMMENT_FORM).unbind('click').click(function(ev){
                ev.preventDefault();
                var $list = $(this).parents(".Review-item").children(".Comment").children(".Comment-list");
                var $form = $(this).parents(".Review-item").children(".Comment").children(".Comment-form");
                if ($list.hasClass("is-active")) {
                    $('html, body').animate({
                        scrollTop: $form.offset().top
                    }, 300);
                } else {
                    $form.toggleClass("is-active");
                }
            });
        },

        attachEvents : function() {

            var $this = this;
            this.showCommentForm();
            this.viewComments();

            $(this.JS_TRIGGER_SEND_REVIEW).click(function(ev) {
                ev.preventDefault();
                var url = GLOBAL.getUrl('reviews/reviews/saveJson/');
                var data = {};
                var reviewForm = $(this).parents("form:first");
                data['productId'] = reviewForm.children('[name="productId"]').val();
                // the html must not be changed
                // reviewForm.children('[name="stars"]:checked').val();
                data['stars'] = $('div.Produs-ratingForm [name="stars"]:checked').val();
                data['nickname'] = reviewForm.children('[name="nickname"]').val();
                data['title'] = reviewForm.children('[name="title"]').val();
                data['details'] = reviewForm.children('[name="details"]').val();
                $.ajax({
                    url : url,
                    type : 'POST',
                    data : data,
                    beforeSend : function() {
                        GLOBAL.dispatch('EVENT_AJAX_CALL_BEFORE', 'Recenzia ta este adaugata!');
                    }
                }).done(function(data){
                    GLOBAL.dispatch('EVENT_AJAX_CALL_AFTER');
                    try {
                        var obj = data;
                        if(obj.error == true ) {
                            GLOBAL.dispatch('EVENT_NOTICE_ERROR', obj.msg);
                        } else {
                            GLOBAL.dispatch('EVENT_NOTICE_SUCCESS', obj.msg);
                            reviewForm.find("input[type=text], textarea").val("");
                        }
                    } catch (Error) {
                        GLOBAL.dispatch('EVENT_NOTICE_ERROR', 'A aparut o eroare neasteptata');
                    }
                });
            });

            $(this.JS_TRIGGER_VOTE).click(function(ev) {
                ev.preventDefault();
                var url = $(this).attr('href');
                $.ajax({
                    url : url,
                    type : 'POST',
                    data : {},
                    beforeSend : function() {
                        GLOBAL.dispatch('EVENT_AJAX_CALL_BEFORE', 'Comentariul se voteaza!');
                    }
                }).done(function(data){
                    GLOBAL.dispatch('EVENT_AJAX_CALL_AFTER');
                    try {
                        var obj = data;
                        if(obj.error == true ) {
                            GLOBAL.dispatch('EVENT_NOTICE_ERROR', obj.msg);
                        } else {
                            GLOBAL.dispatch('EVENT_NOTICE_SUCCESS', obj.msg);
                            //var review = require('local/catalog/template/review');
                            //GLOBAL.reviewId = obj.review;
                            //review.toHtml();
                            $('#js-review-vote-links-' + obj.review).html('<span class="u-verticalMiddle">Votul tau a fost adaugat. Multumim!</span>');
                        }
                    } catch (Error) {
                        GLOBAL.dispatch('EVENT_NOTICE_ERROR', Error);
                    }
                });
            });

            this.sendComment();

            this.sendQuestionAnswer();

            $(this.JS_TRIGGER_SEND_QUESTION).click(function(ev) {
                ev.preventDefault();
                var url = GLOBAL.getUrl('reviews/questions/saveJson/');
                var data = {};
                var reviewForm = $(this).parents("form:first");
                data['productId'] = reviewForm.children('[name="productId"]').val();
                data['nickname'] = reviewForm.children('[name="nickname"]').val();
                data['title'] = reviewForm.children('[name="title"]').val();
                data['details'] = reviewForm.children('[name="details"]').val();
                $.ajax({
                    url : url,
                    type : 'POST',
                    data : data,
                    beforeSend : function() {
                        GLOBAL.dispatch('EVENT_AJAX_CALL_BEFORE', 'Intrebarea se adauga!');
                    }
                }).done(function(data){
                    GLOBAL.dispatch('EVENT_AJAX_CALL_AFTER');
                    try {
                        var obj = data;
                        if(obj.error == true ) {
                            GLOBAL.dispatch('EVENT_NOTICE_ERROR', obj.msg);
                        } else {
                            GLOBAL.dispatch('EVENT_NOTICE_SUCCESS', obj.msg);
                            reviewForm.find("input[type=text], textarea").val("");
                        }
                    } catch (Error) {
                        GLOBAL.dispatch('EVENT_NOTICE_ERROR', 'A aparut o eroare neasteptata');
                    }
                });
            });

            $(this.JS_TOGGLE_REVIEWS).click(function(ev){
                ev.preventDefault();
                $('.Tabs-navList li').each(function(key, elem){
                    var lielem = $(elem);
                    if(lielem.attr('data-toggle-content') != '#reviews'){
                        lielem.removeClass('is-active');
                    } else {
                        lielem.addClass('is-active');
                    }
                });
                $('.Tabs-contentList li').each(function(key, elem){
                    var lielem = $(elem);
                    if(lielem.attr('id') != 'reviews'){
                        lielem.removeClass('is-active');
                    } else {
                        lielem.addClass('is-active');
                    }
                });
                $('html, body').animate({
                    scrollTop: $('#reviews').offset().top
                }, 300);
            });

            $(this.JS_TRIGGER_SEE_MORE_QUESTIONS).click(function(ev){
                ev.preventDefault();
                var $$this = $(this);
                var url = GLOBAL.getUrl('reviews/questions/getQuestionsListJson/');
                var productId = $$this.data('product-id');
                var questionLimit = $$this.data('question-limit');

                $.ajax({
                    url : url,
                    type : 'POST',
                    data : {productId : productId, questionLimit : questionLimit},
                    beforeSend : function() {
                        GLOBAL.dispatch('EVENT_AJAX_CALL_BEFORE', 'Afisam toate intrebarile!');
                    }
                }).done(function(data){
                    GLOBAL.dispatch('EVENT_AJAX_CALL_AFTER');
                    try {
                        var obj = data;
                        if(obj.error == true ) {
                            GLOBAL.dispatch('EVENT_NOTICE_ERROR', obj.msg);
                        } else {
                            GLOBAL.dispatch('EVENT_NOTICE_SUCCESS', obj.msg);
                            limit = obj.questionLimit;
                            if(questionLimit + 5 < limit) {
                                $$this.data('question-limit', questionLimit + 5);
                            } else {
                                $$this.hide();
                            }


                            var template = require('local/catalog/template/question');
                            template.setDataItem('questions', obj.questions);
                            template.setDataItem('reviewsURL', GLOBAL.getUrl('reviews/questionAnswers/saveJson/'));
                            template.toHtml();
                            // reattaching events
                            $this.viewComments();
                            $this.sendQuestionAnswer();
                            $this.showCommentForm();
                        }
                    } catch (Error) {
                        GLOBAL.dispatch('EVENT_NOTICE_ERROR', 'A aparut o eroare neasteptata');
                    }
                });
            });


            $(this.JS_TRIGGER_SEE_MORE_REVIEWS).click(function(ev){
                ev.preventDefault();
                var $$this = $(this);
                var url = GLOBAL.getUrl('reviews/reviews/getJsonReviewsList/');
                var productId = $$this.data('product-id');
                var reviewsLimit = $$this.data('reviews-limit');

                $.ajax({
                    url : url,
                    type : 'POST',
                    data : {productId : productId, reviewsLimit : reviewsLimit},
                    beforeSend : function() {
                        GLOBAL.dispatch('EVENT_AJAX_CALL_BEFORE', 'Afisam toate recenziile!');
                    }
                }).done(function(data){
                    GLOBAL.dispatch('EVENT_AJAX_CALL_AFTER');
                    try {
                        var obj = data;
                        if(obj.error == true ) {
                            GLOBAL.dispatch('EVENT_NOTICE_ERROR', obj.msg);
                        } else {
                            GLOBAL.dispatch('EVENT_NOTICE_SUCCESS', obj.msg);
                            limit = obj.reviewsLimit;
                            if(reviewsLimit + 5 < limit) {
                                $$this.data('reviews-limit', reviewsLimit + 5);
                            } else {
                                $$this.hide();
                            }


                            var template = require('local/catalog/template/reviews');
                            template.setDataItem('reviews', obj.reviews);
                            template.toHtml();
                            // reattaching events
                            $this.viewComments();
                            $this.showCommentForm();
                        }
                    } catch (Error) {
                        GLOBAL.dispatch('EVENT_NOTICE_ERROR', 'A aparut o eroare neasteptata');
                    }
                });
            });

        },

        sendComment : function () {
            $(this.JS_TRIGGER_SEND_COMMENT).click(function(ev) {
                ev.preventDefault();
                var url = GLOBAL.getUrl('reviews/answers/saveJson/');
                var data = {};
                var commentForm = $(this).parents("form:first");
                data['id'] = commentForm.children('[name="id"]').val();
                data['nickname'] = commentForm.children('[name="nickname"]').val();
                data['details'] = commentForm.children('[name="details"]').val();
                $.ajax({
                    url : url,
                    type : 'POST',
                    data : data,
                    beforeSend : function() {
                        GLOBAL.dispatch('EVENT_AJAX_CALL_BEFORE', 'Comentariul se adauga!');
                    }
                }).done(function(data){
                    GLOBAL.dispatch('EVENT_AJAX_CALL_AFTER');
                    try {
                        var obj = data;
                        if(obj.error == true ) {
                            GLOBAL.dispatch('EVENT_NOTICE_ERROR', obj.msg);
                        } else {
                            GLOBAL.dispatch('EVENT_NOTICE_SUCCESS', obj.msg);
                            commentForm.find("input[type=text], textarea").val("");
                        }
                    } catch (Error) {
                        GLOBAL.dispatch('EVENT_NOTICE_ERROR', 'A aparut o eroare neasteptata');
                    }
                });
            });
        },

        sendQuestionAnswer : function () {
            $(this.JS_TRIGGER_SEND_QUESTION_ANSWER).unbind('click').click(function(ev) {
                ev.preventDefault();
                var url = GLOBAL.getUrl('reviews/questionAnswers/saveJson/');
                var data = {};
                var commentForm = $(this).parents("form:first");
                data['id'] = commentForm.children('[name="id"]').val();
                data['nickname'] = commentForm.children('[name="nickname"]').val();
                data['details'] = commentForm.children('[name="details"]').val();
                $.ajax({
                    url : url,
                    type : 'POST',
                    data : data,
                    beforeSend : function() {
                        GLOBAL.dispatch('EVENT_AJAX_CALL_BEFORE', 'Raspunsul se adauga!');
                    }
                }).done(function(data){
                    GLOBAL.dispatch('EVENT_AJAX_CALL_AFTER');
                    try {
                        var obj = data;
                        if(obj.error == true ) {
                            GLOBAL.dispatch('EVENT_NOTICE_ERROR', obj.msg);
                        } else {
                            GLOBAL.dispatch('EVENT_NOTICE_SUCCESS', obj.msg);
                            commentForm.find("input[type=text], textarea").val("");
                        }
                    } catch (Error) {
                        GLOBAL.dispatch('EVENT_NOTICE_ERROR', 'A aparut o eroare neasteptata');
                    }
                });
            });
        },


        showModal : function() {
        }
    };
}();

},{"local/catalog/template/question":24,"local/catalog/template/reviews":26}],"local/catalog/stockalert":[function(require,module,exports){
module.exports = function() {
    return {

        JS_TRIGGER_STOCKALERT : ".js-triggerStockAlert",
        JS_STOCKALERT_CONTAINER : '#js-container-stockalert',
        JS_TRIGGER_STOCKALERT_SUBMIT : '#stockalert-form-submit',
        JS_STOCKALERT_FORM : '#js-stockalert-form',

        init : function() {
            this.attachEvents();
        },
        attachEvents : function () {
            var $this = this;

            $(this.JS_TRIGGER_STOCKALERT).click(function(ev){
                ev.preventDefault();

                var productId = $(this).data('product-id');
                var productName = $(this).data('product-name');

                var template = require('local/catalog/template/stockalert');
                template.setDataItem('productName', productName);
                template.setDataItem('formUrl', $(this).attr('href'));
                template.toHtml();
                $this.showModal();
                $this.attachOnStockalertForm();
            });

        },
        attachOnStockalertForm : function() {
            var $this = this;
            $(this.JS_TRIGGER_STOCKALERT_SUBMIT).click(function(ev){

                ev.preventDefault();

                var $data = {};

                $data['email'] = $('#register_email').val();

                var stockalertForm = $($this.JS_STOCKALERT_FORM);

                stockalertForm.verify({debug:true});
                stockalertForm.validate(function(success) {
                    if(!success) {
                        return;
                    }

                    $.ajax({
                        url : stockalertForm.attr('action'),
                        data : $data,
                        type : 'POST',
                        beforeSend : function() {
                            GLOBAL.dispatch('EVENT_CLEAR_MODALS');
                            GLOBAL.dispatch('EVENT_AJAX_CALL_BEFORE', 'Abonare alerta stoc');
                        }
                    }).done(function(data){
                        GLOBAL.dispatch('EVENT_AJAX_CALL_AFTER');
                        var obj = JSON.parse(data);
                        if(obj.error == true ) {
                            GLOBAL.dispatch('EVENT_NOTICE_ERROR', obj.message);
                        } else {
                            GLOBAL.dispatch('EVENT_CLEAR_MODALS');
                            GLOBAL.dispatch('EVENT_NOTICE_SUCCESS', obj.message);
                        }
                    });

                });


            });
        },
        showModal : function() {
            GLOBAL.dispatch('EVENT_SHOW_MODAL', this.JS_STOCKALERT_CONTAINER);
        }
    };
}();
},{"local/catalog/template/stockalert":27}],"local/catalog":[function(require,module,exports){
module.exports = function() {
    return {
    };
}();

},{}],"local/checkout":[function(require,module,exports){
module.exports = function() {
    return {
        JS_TRIGGER_CART_UPDATE : '.js-trigger-cart-update',
        JS_TRIGGER_CART_DELETE : '.js-trigger-cart-delete',

        JS_CART_FORM_ID : '#cart-form',
        JS_CHECKOUT_FORM_ID : '#checkout-form-container',

        JS_CHECKOUT_LOGIN_FORM_ID : '#login-form',

        JS_TRIGGER_CHECKOUT_SUBMIT : '.js-trigger-checkout-submit',

        JS_TRIGGER_CHECKOUT_LOGIN : '.js-trigger-checkout-login',

        JS_ADDRESS_EDIT_MODE_UNSAVED_CONTAINER : '#js-address-edit-mode-unsaved-container',

        JS_CART_TRIGGER_WARRANTY_SELECT : '.js-cart-trigger-warranty-select',

        JS_TRIGGER_YEAR_SELECTOR : '.js-year-selector',
        JS_TRIGGER_MONTH_SELECTOR : '.js-month-selector',

        IS_ADDRESS_EDIT_MODE : false,

        init : function() {
            require('chosen');
            this.listen();
        },
        initRegionSelector : function() {
            if('undefined' == typeof countryRegions ) {
                return;
            }
            var regions = '<option value=""></option>';
            Object.keys(countryRegions.RO).forEach(function(key){
                regions += '<option value="'+key+'">'+countryRegions.RO[key].name+'</option>';
            });

            $('.js-region-selector').html(regions);
            $('.js-region-selector').trigger('chosen:updated');
            $('.js-region-selector').change(function(){
                var obj = $(this);
                var val = obj.val();
                var city = obj.parent().parent().find('.js-city-selector');
                if('undefined' == typeof countryRegions.RO[val]['cities']) {
                    return;
                }
                var citylist = '<option value=""></option>';
                var locArray = [];
                Object.keys(countryRegions.RO[val]['cities']).forEach(function(key){
                    var loc = countryRegions.RO[val]['cities'][key]['localitate'];
                    locArray.push(loc);
                });
                locArray.sort();
                locArray.forEach(function(localitate){
                    citylist += '<option value="'+localitate+'">' + localitate + '</option>';
                });
                city.html(citylist);
                city.trigger('chosen:updated');
            });
        },
        listenChangeShippingAddress : function() {
            $('#shipping-address-select').change(function(){
                var $this = $(this);
                var value = $this.val();
                $('.shipping-address-form').hide();
                if($('#shipping-address-form-'+value).length) {
                    $('#shipping-address-form-'+value).show();
                    $('#shipping_address_id').val(value);
                    $('#shipping_save_in_address_book').prop('checked', false);
                } else {
                    $('#shipping-new-address-form').show();
                    $('#shipping_address_id').val('');
                }
            }).trigger('change');
        },
        listenChangeBillingAddress : function() {
            $('.billing-address-select').change(function(){
                var $this = $(this);
                var value = $this.val();

                $('.billing-address-form').hide();
                if($('#billing-address-form-'+value).length) {
                    $('#js-address-billing-edit-form-'+value).hide();
                    $('#js-address-billing-show-form-'+value).show();
                    $('#billing-address-form-'+value).show();
                    $('#billing_address_id').val(value);
                    $('#billing_save_in_address_book').prop('checked', false);
                    $('#billing-type-new-address-form').hide();
                } else {
                    //$('#checkout-billing-fizica').show();
                    $('#billing-type-new-address-form').show();
                    $('#billing_address_id').val('');
                }
            }).trigger('change');
        },
        setDefaultsForRegionSelector : function (regionSelectorId, citySelectorId, selectedRegionId, selectedCityId) {

            if('undefined' == typeof countryRegions ) {
                return;
            }
            var regions = '<option value=""></option>';
            Object.keys(countryRegions.RO).forEach(function(key){
                selected = '';
                if ( key == selectedRegionId ) {
                    selected = ' selected ';
                }
                regions += '<option value="'+key+'" '+selected+'>'+countryRegions.RO[key].name+'</option>';
            });

            $('select[id="'+regionSelectorId+'"]').html(regions);
            $('select[id="'+regionSelectorId+'"]').trigger('chosen:updated');


                var city = $('select[id="'+citySelectorId+'"]');
                if('undefined' == typeof countryRegions.RO[selectedRegionId]['cities']) {
                    return;
                }
                var citylist = '<option value=""></option>';
                Object.keys(countryRegions.RO[selectedRegionId]['cities']).forEach(function(key){
                    var loc = countryRegions.RO[selectedRegionId]['cities'][key]['localitate'];
                    selectedCity = '';
                    if ( selectedCityId.toLowerCase() == loc.toLowerCase() ) {
                        selectedCity = ' selected ';
                    }
                    citylist += '<option value="'+loc+'" '+selectedCity+'>' + loc + '</option>';
                });
                city.html(citylist);
                city.trigger('chosen:updated');

        },
        listenModifyBillingAddress : function(e) {
            var $this = this;
            $(".js-trigger-address-billing-edit-form").on( "click", function(e) {
                e.preventDefault();
                var editFormId = $( this ).data('toggle-edit-form');
                var showFormId = $( this ).data('toggle-show-form');

                $('#'+editFormId).show();
                $('#'+showFormId).hide();
            });

        },
        listenSaveBillingAddres : function() {
            var $this = this;
            $(".js-trigger-billing-address-save").on( "click", function(e) {

                addressId = $(this).data('address-id');
                e.preventDefault();

                var url = GLOBAL.getUrl('checkout/onepage/saveCustomAddress/');

                var billingAddressId = $('#billing--address-select').val();
                var shippingAddressId = $('#shipping-address-select').is(':visible') ? $('#shipping-address-select').val() : 0;

                $data = $('#js-address-billing-edit-form-'+addressId).serialize();
                $data += '&selected_billing_id=' + billingAddressId;
                $data += '&selected_shipping_id=' + shippingAddressId;


                $('#js-address-billing-edit-form-'+addressId).validate(function(success) {
                    if(!success) {
                        GLOBAL.dispatch('EVENT_NOTICE_WARNING', 'Verificati campurile adresei de facturare!');
                        return;
                    }
                    $.ajax({
                        type : 'POST',
                        data : $data,
                        url : url,
                        beforeSend : function() {
                            GLOBAL.dispatch('EVENT_AJAX_CALL_BEFORE', 'Va rugam asteptati ...');
                        },
                    }).done(function(data){
                        GLOBAL.dispatch('EVENT_AJAX_CALL_AFTER');
                        try {
                            var obj = data;
                            if(obj.error == true ) {
                                GLOBAL.dispatch('EVENT_NOTICE_ERROR', obj.msg);
                            } else {
                                GLOBAL.dispatch('EVENT_CLEAR_MODALS');
                                GLOBAL.dispatch('EVENT_NOTICE_SUCCESS', obj.msg);
                                $this.initRegionSelector();
                                if('undefined' != typeof data.billing) {
                                    $('#checkout-onepage-billing-addresses').html(data.billing);
                                    $this.initBillingAddress();
                                }
                                if('undefined' != typeof data.shipping) {
                                    $('#checkout-onepage-shipping-addresses').html(data.shipping);
                                    $this.initShippingAddress();
                                }
                            }

                        } catch (Error) {
                            GLOBAL.dispatch('EVENT_NOTICE_ERROR', 'A aparut o eroare neasteptata.');
                        }
                    });
                });
            });
        },
        initShippingAddress : function() {
            this.listenForShippingAddressSwitch();
            this.listenChangeShippingAddress();
            $('#checkout-onepage-shipping-addresses').find('.chosen-select').chosen({width: '100%'});
        },
        initRegionAndCitySelectors : function() {
            var $this = this;
            $(".js-trigger-address-billing-edit-form").each(function(el){
                var editFormId = $( this ).data('toggle-edit-form');
                var showFormId = $( this ).data('toggle-show-form');
                var regionSelectorId = $('#'+editFormId+' .js-region-selector').attr('id');
                var citySelectorId = $('#'+editFormId+' .js-city-selector').attr('id');
                var regionId = $( this ).data('region-id');
                var cityId = $( this ).data('city-id');
                $this.setDefaultsForRegionSelector(regionSelectorId, citySelectorId, regionId, cityId);
            });
        },
        initBillingAddress : function() {
            this.listenForPfPjChange();
            this.listenChangeBillingAddress();
            this.initRegionAndCitySelectors();
            this.listenModifyBillingAddress();
            this.listenSaveBillingAddres();
            this.startValidatorForBilling();
            $('#checkout-onepage-billing-addresses').find('.chosen-select').chosen({width: '100%'});
        },
        startValidatorForBilling : function (){
            $('#checkout-onepage-billing-addresses .billing-address-form form').each(function(el){
                var $el = $(this);
                $el.verify({debug:true});
            });
        },
        parseParams : function(p) {
            var params = {};
            var pairs = p.split('&');
            for (var i=0; i<pairs.length; i++) {
            var pair = pairs[i].split('=');
            var accessors = [];
            var name = decodeURIComponent(pair[0]), value = decodeURIComponent(pair[1]);

            var name = name.replace(/\[([^\]]*)\]/g, function(k, acc) { accessors.push(acc); return ""; });
            accessors.unshift(name);
            var o = params;

            for (var j=0; j<accessors.length-1; j++) {
            var acc = accessors[j];
            var nextAcc = accessors[j+1];
            if (!o[acc]) {
            if ((nextAcc == "") || (/^[0-9]+$/.test(nextAcc)))
            o[acc] = [];
            else
            o[acc] = {};
            }
            o = o[acc];
            }
            acc = accessors[accessors.length-1];
            if (acc == "")
            o.push(value);
            else
            o[acc] = value;
            }
            return params;
        },

        cleanSavedAddresses : function(data, except) {
            Object.keys(data).forEach(function(each) {
                if(each.match(/shipping\-[0-9]+/)) {
                    delete data[each];
                }
            });
            return data;
        },

        clearShipping : function(data, billing) {
            var tmp = this.cleanSavedAddresses(data);
            if('undefined' != typeof tmp['same_as_billing'] && tmp['same_as_billing'] == '1') {
                if('undefined' != typeof billing) {
                    tmp = billing;
                }
                tmp['shipping_address_id'] = '';
                tmp['same_as_billing'] = '1';
                tmp['save_in_address_book'] = '0';
            } else {
                //tmp = this.cleanSavedAddresses(tmp);
                //tmp['shipping_address_id'] = '';
                tmp['same_as_billing'] = '0';
            }
            delete tmp['billing'];

            return JSON.stringify(tmp);
        },
        cleanBilling : function(data) {
            if('undefined' != data['billing_address_id']) {
                var billingId = data['billing_address_id'];
            }
            return data;
        },
        listenForShippingAddressSwitch : function() {
            $('.js-shipping-address-change').click(function() {
                if($('#billing_use_for_shipping_yes').is(':checked')) {
                    $('#shipping-address-container').show();
                    $('#shipping_same_as_billing').val('0');
                } else if ($('#billing_use_for_shipping_no').is(':checked')) {
                    $('#shipping-address-container').hide();
                    $('#shipping_same_as_billing').val('1');
                }
            });
        },

        listenForPaymentMethodSwitch : function () {
            $('.js-trigger-switch-payment-method').click(function(){
                var code = $(this).data('payment-code');
                if('undefined' == typeof code) {
                    return;
                }
                $('.js-payment-form-container').hide();
                $('#payment-form-container-'+code).show();
            });
        },

        listenForPayuCardSwitch : function () {
            $('.js-trigger-switch-payu-card').click(function(){
                var card = $(this).attr('id');
                if('undefined' == typeof card) {
                    return;
                }
                $('.js-card-data-container').addClass('u-hide');
                $('#' + card + '-data').removeClass('u-hide');
            });
        },

        checkShowPfOrPj : function() {
            if($('#fact_pers_fiz').is(':checked')) {
                $('.p-checkout-persoanaFizica').show();
                $('.p-checkout-persoanaJuridica').hide();
            } else {
                $('.p-checkout-persoanaFizica').hide();
                $('.p-checkout-persoanaJuridica').show();
            }
        },
        listenForPfPjChange : function () {
            this.checkShowPfOrPj();
            var $this = this;
            $('input[name="radio_button_fact"]').change(function(){
                $this.checkShowPfOrPj();
            });
        },
        listenForProductsWarranty : function () {
            var $this = this;

            $('.js-cart-warranty, .js-cart-buyback').click(function(ev){
	            $($this.JS_CART_FORM_ID).submit();
                $($this.JS_CART_TRIGGER_WARRANTY_SELECT).attr('disabled', 'disabled');
                GLOBAL.dispatch('EVENT_AJAX_CALL_BEFORE', 'Produsul este adaugat in cos...');
            });
        },
        listenForProductsServicii : function () {
            var $this = this;

            $('.js-cart-servinstall').click(function(ev){
                $($this.JS_CART_FORM_ID).submit();
            });
        },
        validateShipping : function(successForm) {
            var differentAddress = $('#billing_use_for_shipping_no').is(':checked');
            var savedAddress = $('#shipping-address-select').val();
            if(differentAddress && savedAddress == '' ) {
                return successForm;
            }
            return true;
        },
        validateCredex : function(tooltip){
            var isCredexSelected = $('#p_method_altex_credex').is(':checked');
            if(isCredexSelected)
            {
                $('#checkout-payment-method').validate();
                var msg = null;
                var dateObj = new Date();
                var eligibil = true;
                var cnpInvalid = false;
                var reject = false;
                prag_angajat = 700;
                prag_pensionar = 400;

                var cnp_value = $.trim($('#altex_credex_cnp').val());
                var i=0 , year=0 , hashResult=0 , cnp=[] , hashTable=[2,7,9,1,4,6,3,5,8,2,7,9];
                if( cnp_value.length !== 13 ) { cnpInvalid = true; }
                for( i=0 ; i<13 ; i++ ) {
                    cnp[i] = parseInt( cnp_value.charAt(i) , 10 );
                    if( isNaN( cnp[i] ) ) { cnpInvalid = true; }
                    if( i < 12 ) { hashResult = hashResult + ( cnp[i] * hashTable[i] ); }
                }
                hashResult = hashResult % 11;
                if( hashResult === 10 ) { hashResult = 1; }
                year = (cnp[1]*10)+cnp[2];
                switch( cnp[0] ) {
                    case 1  : case 2 : { year += 1900; } break;
                    case 3  : case 4 : { year += 1800; } break;
                    case 5  : case 6 : { year += 2000; } break;
                    case 7  : case 8 : case 9 : { year += 2000; if( year > ( parseInt( new Date().getYear() , 10 ) - 14 ) ) { year -= 100; } } break;
                    default : { cnpInvalid = true; }
                }
                if( year < 1800 || year > 2099 ) { cnpInvalid = true; }
                if (  cnp[12] !== hashResult) {cnpInvalid = true}

                if(cnpInvalid)
                {
                    cnpMsg = 'CNP-ul nu este valid';
                }

                if($('#altex_credex_vechime_luna').val())


                luna = parseInt($('#altex_credex_vechime_luna').val());
                an = parseInt($('#altex_credex_vechime_an').val());
                statut = $('#altex_credex_statut').val();
                venit = $('#altex_credex_venit').val();
                agreement = $('#altex_credex_check_agreement').is(':checked');

                if(typeof luna != 'undefined' && luna > 0 && an >= 1950 && statut && venit.length != 0 && agreement && cnp_value.length != 0)
                {
                    vechime = (dateObj.getUTCMonth() + 1 + 12 * dateObj.getUTCFullYear()) - (luna + 12 * an);

                    if(statut == 'Angajat' && (vechime < 3 || venit < prag_angajat))
                    {
                        eligibil = false;
                    }

                    if(statut == 'Pensionar' && venit < prag_pensionar)
                    {
                        eligibil = false;
                    }

                    if(statut == 'PFA' && (vechime < 12 || venit < prag_angajat))
                    {
                        eligibil = false;
                    }

                    if(statut == 'Altele')
                    {
                        eligibil = false;
                    }

                    if(!eligibil)
                    {
                        msg = "Ne pare rau, dar momentan nu indepliniti conditiile de eligibilitate pentru finantarea produselor prin credit online. Va invitam sa finalizati comanda online alegand o alta modalitate de plata!\nVa multumim";
                    }
                }
                else
                {
                    if(tooltip)
                    {
                        GLOBAL.dispatch('EVENT_NOTICE_WARNING', 'Completati toate campurile creditului');
                    }

                    return false;
                }

                if(isNaN(venit))
                {
                    msg = 'In campul venit pot fi introduse numai cifre'
                }

                if(cnpInvalid && cnp_value.length != 0)
                {
                    if(tooltip)
                    {
                        GLOBAL.dispatch('EVENT_NOTICE_WARNING', cnpMsg);
                    }
                    reject = true;
                }

                if(msg)
                {
                    if(tooltip)
                    {
                        GLOBAL.dispatch('EVENT_NOTICE_WARNING', msg);
                    }
                    reject = true;
                }
                if(reject)
                {
                    return false;
                }
            }
            return true;
        },
        saveOrder : function ($data) {
            var url = GLOBAL.getUrl('checkout/onepage/saveNewOrder/');
            $.ajax({
                type : 'POST',
                data : $data,
                url : url,
                beforeSend : function() {
                    GLOBAL.dispatch('EVENT_AJAX_CALL_BEFORE', {msg: 'Va rugam asteptati...', closable: false});
                },
            }).done(function(data){
                GLOBAL.dispatch('EVENT_AJAX_CALL_AFTER');
                try {
                    var obj = JSON.parse(data);
                    if('undefined' != typeof obj.error) {
                        GLOBAL.dispatch('EVENT_NOTICE_ERROR', obj.error);
                    } else if(obj.success == true) {
                        if('undefined' != typeof obj.redirect) {
                            GLOBAL.dispatch('EVENT_AJAX_CALL_BEFORE', 'Veti fi redirectionat catre pagina de plata...');
                            window.location = obj.redirect;
                        } else {
                            GLOBAL.dispatch('EVENT_NOTICE_SUCCESS', 'Comanda a fost inregistrata cu succes.');
                            GLOBAL.dispatch('EVENT_AJAX_CALL_BEFORE', 'Pagina se reincarca...');
                            window.location = GLOBAL.getUrl('checkout/onepage/success/');
                        }
                    }
                } catch (Error) {
                    GLOBAL.dispatch('EVENT_NOTICE_ERROR', 'A aparut o eroare neasteptata');
                }
            });
        },
        validatePaymentMethod : function() {
            var paymentMethodForm = $('#checkout-payment-method');
            if(paymentMethodForm.length && paymentMethodForm.find('input[name="payment[method]"]:checked').length == 0) {
                GLOBAL.dispatch('EVENT_NOTICE_WARNING', 'Selectati o metoda de plata');
                return false;
            }
            return true;
        },
        displayBillingAddress : function() {
            var id = $('#billing--address-select').val();
            if(id != '') {
                var form =  $('#js-address-billing-edit-form-'+id);
                var display = $('#js-address-billing-show-form-'+id);
                if(form.length) {
                    form.validate(function(success){
                        if(!success) {
                            display.hide();
                            form.show();
                        }
                    });
                }
            }

            return;
        },
        showModal : function() {
            GLOBAL.dispatch('EVENT_SHOW_MODAL', this.JS_ADDRESS_EDIT_MODE_UNSAVED_CONTAINER);
        },
        listen : function() {
            this.listenForPaymentMethodSwitch();
            this.listenForPayuCardSwitch();
            this.initRegionSelector();

            this.initBillingAddress();
            this.initShippingAddress();

            this.listenForLogin();
            this.listenForCartUpdate();
            this.listenForProductsWarranty();
            this.listenForProductsServicii();
            this.initYearSelector();

            $('.chosen-select').chosen({width: '100%'});
            var $this = this;

            $(this.JS_TRIGGER_CHECKOUT_SUBMIT).click(function(){

                if ( 1==2 && $this.IS_ADDRESS_EDIT_MODE ) {
                    var template = require('local/checkout/template/modal-address-edit-unsaved');
                    template.toHtml();
                    $this.showModal();
                    return false;
                }


                //location.replace(GLOBAL.getUrl('checkout/success/'));
                var billingData = {};
                var shippingData = {};
                var shippingMethodData = {};
                var paymentMethodData = {};

                var $data = {};
                var valid = true;
                var pfPj = 1;

                if($('.p-checkout-persoanaFizica').is(':visible')) {
                    var billingForm = $('#checkout-billing-fizica');
                } else if($('.p-checkout-persoanaJuridica').is(':visible')) {
                    var billingForm = $('#checkout-billing-juridica');
                    pfPj = 2;
                } else {
                    var addrId = $('#billing--address-select').val();
                    var billingForm = $('#js-address-billing-edit-form-' + addrId);
                }

                var shippingForm = $('#co-shipping-form');
                var shippingMethodForm = $('#co-shipping-method-form');
                var paymentMethodForm = $('#checkout-payment-method');

                billingForm.verify({debug:true});
                shippingForm.verify({debug:true});
                shippingMethodForm.verify({debug:true});
                paymentMethodForm.verify({debug:true});

                billingData = billingForm.serialize();
                billingData = decodeURIComponent(billingData).replace(/\+/g, " ");
                billingData = $this.parseParams(billingData);

                billingData['pfpj_tip_pers'] = pfPj;
                billingData['save_in_address_book']  =  $('#billing_save_in_address_book').length  &&
                                                        $('#billing_save_in_address_book').is(':checked') ? '1' : '0';

                billingData['use_for_shipping'] = $('#billing_use_for_shipping_yes').is(':checked') ? '1' : '0';

                shippingData = shippingForm.serialize();
                shippingData = decodeURIComponent(shippingData).replace(/\+/g, " ");
                shippingData = $this.parseParams(shippingData);

                shippingData['save_in_address_book'] = $('#shipping_save_in_address_book').length &&
                                                        $('#shipping_save_in_address_book').is(':checked') ? '1' : '0';

                shippingMethodData = shippingMethodForm.find('input[name="shipping_method"]:checked').val();
                paymentMethodData = paymentMethodForm.serialize();

                /** HACK PENTRU METODA DE PLATA **/
                if(!$this.validatePaymentMethod()) {
                    return;
                }

                $this.validateCredex(true)

                billingForm.validate(function(successBill){
                    if(!successBill) {
                        $this.displayBillingAddress();
                        GLOBAL.dispatch('EVENT_NOTICE_WARNING', 'Verificati campurile adresei de facturare!');
                        return;
                    }
                    shippingMethodForm.validate(function(successShipMet) {
                        if(!successShipMet) {
                            GLOBAL.dispatch('EVENT_NOTICE_WARNING', 'Verificati campurile adresei de livrare!');
                            return;
                        }
                        shippingForm.validate(function(successShip) {
                            if(!$this.validateShipping(successShip)) {
                                return;
                            }
                            $data['billing'] = JSON.stringify(billingData);
                            $data['billing'] = $this.cleanBilling($data['billing']);

                            $data['shipping'] = $this.clearShipping(shippingData, billingData);
                            $data['payment'] = paymentMethodData;
                            $data['shipping_method'] = shippingMethodData;
                            $data['subscribe_to_news'] = $('#subscribe_to_news').is(':checked') ? '1' : '0';
                            $data['checkout_comment'] = $('#checkout_comment').val();

                            if (window._checkTrdActionValue_ != undefined && _checkTrdActionValue_)
                            {
                                $data['tracking_code'] = encodeURIComponent(_checkTrdActionValue_);
                            }

                            if(!$this.validateCredex())
                            {
                                return;
                            }

                            // console.log($data);
                            $this.saveOrder($data);
                        });
                    });
                });
            });
        },
        initYearSelector : function() {
            var $this = this;
            //hidden

            $($this.JS_TRIGGER_YEAR_SELECTOR).trigger('chosen:updated');
            $($this.JS_TRIGGER_YEAR_SELECTOR).change(function() {console.log('asda');
                var dateObj = new Date();
                var obj = $(this);
                var val = obj.val();
                var month = obj.parent().parent().parent().parent().find($this.JS_TRIGGER_MONTH_SELECTOR);
                var months = '<option value=""></option>';

                if(val == dateObj.getUTCFullYear())
                {

                    for(m = 1; m <= dateObj.getUTCMonth() + 1; m++)
                    {
                        months += '<option value="' + m + '">' + m + '</option>';
                    }

                }
                else
                {
                    for(m = 1; m <= 12; m++)
                    {
                        months += '<option value="' + m + '">' + m + '</option>';
                    }
                }

                month.html(months);
                month.trigger('chosen:updated');

            });
        },
        listenForLogin : function() {
            var $this = this;
            $($this.JS_CHECKOUT_LOGIN_FORM_ID).verify({debug: true});
            $(this.JS_TRIGGER_CHECKOUT_LOGIN).click(function(ev){
                ev.preventDefault();
                $($this.JS_CHECKOUT_LOGIN_FORM_ID).validate(function(success){
                    if(!success){
                        return false;
                    }
                    var href = $($this.JS_CHECKOUT_LOGIN_FORM_ID).prop('action');
                    if('undefined' == typeof href) {
                        return false;
                    }
                    var $data = $($this.JS_CHECKOUT_LOGIN_FORM_ID).serializeArray();
                    $.ajax({
                        type : 'POST',
                        data : $data,
                        url : href,
                        beforeSend : function() {
                            GLOBAL.dispatch('EVENT_AJAX_CALL_BEFORE', 'Va rugam asteptati...');
                        },
                    }).done(function(data){
                        GLOBAL.dispatch('EVENT_AJAX_CALL_AFTER');
                        try {
                            var obj = data;
                            if(obj.error == true ) {
                                GLOBAL.dispatch('EVENT_NOTICE_ERROR', obj.msg);
                            } else {
                                GLOBAL.dispatch('EVENT_NOTICE_SUCCESS', obj.msg);
                                GLOBAL.dispatch('EVENT_AJAX_CALL_BEFORE', 'Pagina se reincarca...');
                                location.reload();
                            }
                        } catch (Error) {
                            GLOBAL.dispatch('EVENT_NOTICE_ERROR', 'A aparut o eroare neasteptata');
                        }
                    });
                    return false;
                });
            });
        },
        listenForCartUpdate : function() {
            var $this = this;
            $(this.JS_TRIGGER_CART_UPDATE).click(function(ev){
                ev.preventDefault();
                $($this.JS_CART_FORM_ID).submit();
            });
        }
    };
}();

},{"chosen":2,"local/checkout/template/modal-address-edit-unsaved":28}],"local/credex":[function(require,module,exports){
module.exports = function() {
    return {

        JS_TRIGGER_RATES        : ".js-trigger-rate-display",
        JS_RATES_CONTAINER      : '#js-container-rates',

        JS_RATES_CONTAINER_FORM : '#js-container-rates-form',

        JS_TRIGGER_RATES_CALC   : ".js-trigger-rates-calc",
        JS_TRIGGER_RATES_APPLY  : ".js-trigger-rates-apply",

        JS_RATES_FORM           : '#js-rates-form',
        JS_TRIGGER_RATES_SUBMIT : "#rates-form-submit",

        init : function() {
            //console.log(this.calculateRates());

            this.attachEvents();
        },
        attachEvents : function () {
            var $this = this;
            $(this.JS_TRIGGER_RATES).click(function(ev){
                ev.preventDefault();
                var template = require('local/credex/template/rates');
                var obj = new Object();
                obj['product'] = $(this).data('product-price');
                obj['productName'] = $(this).data('product-name');
                obj['productSku'] = $(this).data('product-sku');
                template.setDataItem('productValue', obj.product);
                template.setDataItem('productName', obj.productName);
                template.setDataItem('productSku', obj.productSku);

                template.toHtml();
                $($this.JS_RATES_CONTAINER + ' .chosen-select').chosen({width : '100%'});
                $this.updateRates(obj.product, 60);
                $this.showRatesModal();

                $this.attachOnRatesForm();

            });

        },
        attachOnRatesForm :  function() {
            var $this = this;
            $(this.JS_TRIGGER_RATES_CALC).click(function(ev) {
                ev.preventDefault();
                var loanValue = $('#rates_amount').val();
                var loanMonths = $('#rates_period').val();
                $this.updateRates(loanValue, loanMonths);
            });

            $(this.JS_TRIGGER_RATES_APPLY).click(function(ev) {
                ev.preventDefault();
                var template = require('local/credex/template/form');
                template.toHtml();
                $this.showFormModal();
                $this.attachOnForm();
            });

            $(this.JS_RATES_CONTAINER + ' .chosen-select').change(function(ev){
                var loanValue = $('#rates_amount').val();
                var loanMonths = $('#rates_period').val();
                $this.updateRates(loanValue, loanMonths);
            });

        },

        attachOnForm : function() {

            var $this = this;

            var loanValue = $('#rates_amount').val();
            var loanMonths = $('#rates_period').val();

           $(this.JS_TRIGGER_RATES_SUBMIT).click(function(ev) {
                ev.preventDefault();

                var url = GLOBAL.getUrl('credex/index/lead');

                var newsletterForm = $($this.JS_RATES_FORM);
                newsletterForm.verify({debug:true});
                newsletterForm.validate(function(success) {
                    if(!success) {
                        return;
                    }
                    var $data = {};
                    $data['loan_value'] = loanValue;
                    $data['loan_months'] = loanMonths;
                    $data['product_name'] = $('#product_name').val();
                    $data['product_sku'] = $('#product_sku').val();
                    $data['rates_name_first'] = $('#rates_name_first').val();
                    $data['rates_name_last'] = $('#rates_name_last').val();
                    $data['rates_phone'] = $('#rates_phone').val();
                    $data['rates_email'] = $('#rates_email').val();
                    $data['rates_cnp'] = $('#rates_cnp').val();

                    $.ajax({
                        url : url,
                        data : $data,
                        type : 'POST',
                        beforeSend : function() {
                            GLOBAL.dispatch('EVENT_CLEAR_MODALS');
                            GLOBAL.dispatch('EVENT_AJAX_CALL_BEFORE', 'Datele tale sunt inregistrate...');
                        }
                    }).done(function(data){
                        GLOBAL.dispatch('EVENT_AJAX_CALL_AFTER');
                        var obj = data;
                       if(obj.error == true ) {
                           GLOBAL.dispatch('EVENT_NOTICE_ERROR', obj.msg);
                       } else {
                           GLOBAL.dispatch('EVENT_CLEAR_MODALS');
                           GLOBAL.dispatch('EVENT_NOTICE_SUCCESS', obj.msg);
                       }
                    });

                });




            });

        },

        updateRates : function(loanValue, loanMonths) {
            var $this = this;
            rates  = $this.calculateRates(loanValue, loanMonths);
            $('#rate_display').hide();
            $('#rate_value').html(rates['without_alico']);
            $('#rate_display').show();
        },

        showRatesModal : function() {
            GLOBAL.dispatch('EVENT_SHOW_MODAL', this.JS_RATES_CONTAINER);
        },
        showFormModal : function() {
            GLOBAL.dispatch('EVENT_SHOW_MODAL', this.JS_RATES_CONTAINER_FORM);
        },
        calculateRates: function (loanValue, loanMonths) {
            var $this = this;
            var loan = parseInt(loanValue);
            var interest = 31/100;
            var management_fee = $this.getManagementFee(loanValue);

            var alico = 0.357/100;
            var tenor = parseInt(loanMonths);
            with_alico = Math.round(this.pmt(interest/12, tenor, (-1 * (loan+management_fee ) *(1+alico*tenor))));
            without_alico = Math.round(this.pmt(interest/12, tenor, (-1 * (loan+management_fee ) *(1+0*tenor))));

            var rates = new Object();
            rates['with_alico'] = with_alico;
            rates['without_alico'] = without_alico;
            return rates;

        },

        pmt: function(rate, nper, pv, fv, type) {
            if (!fv) fv = 0;
            if (!type) type = 0;

            if (rate == 0) return -(pv + fv)/nper;

            var pvif = Math.pow(1 + rate, nper);
            var pmt = rate / (pvif - 1) * -(pv * pvif + fv);

            if (type == 1) {
                pmt /= (1 + rate);
            };

            return pmt;
        },

        getManagementFee: function(value) {
            if ( value > 3400 ) return 692.75;
            if ( value > 2125 ) return 403.75;
            if ( value > 1275 ) return 250.75;
            return 140.25;
        }
    };
}();

},{"local/credex/template/form":29,"local/credex/template/rates":30}],"local/credit-magazin":[function(require,module,exports){
module.exports = function() {
    return {

        JS_TRIGGER_LEAD_COLLECT : ".js-trigger-lead-collect",
        JS_LEAD_COLLECT_FORM : '#lead-collect-form',

        init : function() {
            this.attachEvents();
        },
        attachEvents : function () {
            var $this = this;

            require('chosen');

            $('.chosen-select').chosen({width: '75%'});

            $(this.JS_TRIGGER_LEAD_COLLECT).click(function(ev){
                ev.preventDefault();

                var url = GLOBAL.getUrl('lc/save/');

                var collectorForm = $($this.JS_LEAD_COLLECT_FORM);
                collectorForm.verify({debug:true});
                collectorForm.validate(function(success) {
                    if(!success) {
                        return;
                    }
                    console.log( collectorForm.serialize());
                    $.ajax({
                        url : url,
                        data : collectorForm.serialize(),
                        type : 'POST',
                        beforeSend : function() {
                            GLOBAL.dispatch('EVENT_CLEAR_MODALS');
                            GLOBAL.dispatch('EVENT_AJAX_CALL_BEFORE', 'Trimitem datele tale magazinului.');
                        }
                    }).done(function(data){
                        GLOBAL.dispatch('EVENT_AJAX_CALL_AFTER');
                        var obj = data;
                       if(obj.error == true ) {
                           GLOBAL.dispatch('EVENT_NOTICE_ERROR', obj.msg);
                       } else {
                           GLOBAL.dispatch('EVENT_CLEAR_MODALS');
                           GLOBAL.dispatch('EVENT_NOTICE_SUCCESS', 'Unul din agentii nostri te va contacta in curand.');
                       }
                    });

                });

            });

        },
    };
}();

},{"chosen":2}],"local/credit-online-simple":[function(require,module,exports){
module.exports = function() {
    return {

        JS_TRIGGER_LEAD_COLLECT : ".js-trigger-lead-collect",
        JS_LEAD_COLLECT_FORM : '#lead-collect-form',

        init : function() {
            this.attachEvents();
        },
        attachEvents : function () {
            var $this = this;

            var loanValue = $('#suma').val();
            var loanMonths = 24;
            $this.updateRates(loanValue, loanMonths);

            $('#suma').on('click focusin', function() {
                this.value = '';
            });

            $( "#suma" ).change(function() {

                var loanValue = parseInt($('#suma').val());

                var loanMonths = 24;
                if (loanValue >= 1500 && loanValue <= 22000) {
                   $this.updateRates(loanValue, loanMonths);
                   $('#rate_display_container').show();
                   $('#rate_display_container_text').hide();
                }
                else {
                    $('#rate_display_container').hide();
                    $('#rate_display_container_text').show();
                }

            });

            $( "#rate" ).change(function() {
                var loanValue =  parseInt($('#suma').val());
                var loanMonths = parseInt($('#rate').val());
                if (loanValue >= 1500 && loanValue <= 22000) {
                   $this.updateRates(loanValue, loanMonths);
                   $('#rate_display_container').show();
                   $('#rate_display_container_text').hide();
                }
                else {
                    $('#rate_display_container').hide();
                    $('#rate_display_container_text').show();
                }
            });

            $(this.JS_TRIGGER_LEAD_COLLECT).click(function(ev){
                ev.preventDefault();

                var url = GLOBAL.getUrl('credex/index/lead/');

                var collectorForm = $($this.JS_LEAD_COLLECT_FORM);
                collectorForm.verify({debug:true});
                collectorForm.validate(function(success) {
                    if(!success) {
                        return;
                    }
                    console.log( collectorForm.serialize());
                    $.ajax({
                        url : url,
                        data : collectorForm.serialize(),
                        type : 'POST',
                        beforeSend : function() {
                            GLOBAL.dispatch('EVENT_CLEAR_MODALS');
                            GLOBAL.dispatch('EVENT_AJAX_CALL_BEFORE', 'Datele tale sunt salvate...');
                        }
                    }).done(function(data){
                        GLOBAL.dispatch('EVENT_AJAX_CALL_AFTER');
                        var obj = data;
                       if(obj.error == true ) {
                           GLOBAL.dispatch('EVENT_NOTICE_ERROR', obj.msg);
                       } else {
                           GLOBAL.dispatch('EVENT_CLEAR_MODALS');
                           GLOBAL.dispatch('EVENT_NOTICE_SUCCESS', 'Datele au fost salvate. Veti fi contactat in cel mai scurt timp.');
                       }
                    });

                });

            });

        },

        updateMonths : function(loanValue) {
            months = [24];

            var $el = $("#rate");
            $el.empty();
            $.each(months, function(value, text) {
                $el.append($("<option></option>").attr("value", text).text(text));
            });

        },

        updateRates : function(loanValue, loanMonths) {
            var $this = this;
            finalRate  = $this.calculateRates(parseInt(loanValue ) + 100, 24);
            $('#rate_display').hide();
            $('#rate_value').html(finalRate);
            $('#rate_display').show();
        },

        calculateRates: function (loanValue, loanMonths) {
            var $this = this;
            var loan = parseInt(loanValue);
            /*var interest = 31/100;
            var management_fee = $this.getManagementFee(loanValue);

            var alico = 0.357/100;*/
            var tenor = parseInt(loanMonths);
            /*with_alico = Math.round(this.pmt(interest/12, tenor, (-1 * (loan+management_fee ) *(1+alico*tenor))));
            without_alico = Math.round(this.pmt(interest/12, tenor, (-1 * (loan+management_fee ) *(1+0*tenor))));

            var rates = new Object();
            rates['with_alico'] = with_alico;
            rates['without_alico'] = without_alico;
            return without_alico;*/

            return Math.round(loan/tenor);
        },

        pmt: function(rate, nper, pv, fv, type) {
            if (!fv) fv = 0;
            if (!type) type = 0;

            if (rate == 0) return -(pv + fv)/nper;

            var pvif = Math.pow(1 + rate, nper);
            var pmt = rate / (pvif - 1) * -(pv * pvif + fv);

            if (type == 1) {
                pmt /= (1 + rate);
            };

            return pmt;
        },

        getManagementFee: function(value) {
            if ( value > 3400 ) return 692.75;
            if ( value > 2125 ) return 403.75;
            if ( value > 1275 ) return 250.75;
            return 140.25;
        }


    };
}();

},{}],"local/credit-online":[function(require,module,exports){
module.exports = function() {
    return {

        JS_TRIGGER_LEAD_COLLECT : ".js-trigger-lead-collect",
        JS_LEAD_COLLECT_FORM : '#lead-collect-form',

        init : function() {
            this.attachEvents();
        },
        attachEvents : function () {
            var $this = this;

            var loanValue = $('#suma').val();
            var loanMonths = $('#rate').val();
            $this.updateRates(loanValue, loanMonths);

            $('#suma').on('click focusin', function() {
                this.value = '';
            });

            $( "#suma" ).change(function() {

                var loanValue = parseInt($('#suma').val());

                $this.updateMonths(loanValue);


                var loanMonths = parseInt($('#rate').val());
                if (loanValue >= 300 && loanValue <= 22000) {
                   $this.updateRates(loanValue, loanMonths);
                   $('#rate_display_container').show();
                   $('#rate_display_container_text').hide();
                }
                else {
                    $('#rate_display_container').hide();
                    $('#rate_display_container_text').show();
                }

            });
            $( "#rate" ).change(function() {
                var loanValue =  parseInt($('#suma').val());
                var loanMonths = parseInt($('#rate').val());
                if (loanValue >= 300 && loanValue <= 22000) {
                   $this.updateRates(loanValue, loanMonths);
                   $('#rate_display_container').show();
                   $('#rate_display_container_text').hide();
                }
                else {
                    $('#rate_display_container').hide();
                    $('#rate_display_container_text').show();
                }
            });

            $(this.JS_TRIGGER_LEAD_COLLECT).click(function(ev){
                ev.preventDefault();

                var url = GLOBAL.getUrl('credex/index/lead/');

                var collectorForm = $($this.JS_LEAD_COLLECT_FORM);
                collectorForm.verify({debug:true});
                collectorForm.validate(function(success) {
                    if(!success) {
                        return;
                    }
                    console.log( collectorForm.serialize());
                    $.ajax({
                        url : url,
                        data : collectorForm.serialize(),
                        type : 'POST',
                        beforeSend : function() {
                            GLOBAL.dispatch('EVENT_CLEAR_MODALS');
                            GLOBAL.dispatch('EVENT_AJAX_CALL_BEFORE', 'Datele tale sunt salvate...');
                        }
                    }).done(function(data){
                        GLOBAL.dispatch('EVENT_AJAX_CALL_AFTER');
                        var obj = data;
                       if(obj.error == true ) {
                           GLOBAL.dispatch('EVENT_NOTICE_ERROR', obj.msg);
                       } else {
                           GLOBAL.dispatch('EVENT_CLEAR_MODALS');
                           GLOBAL.dispatch('EVENT_NOTICE_SUCCESS', 'Datele au fost salvate. Veti fi contactat in cel mai scurt timp.');
                       }
                    });

                });

            });

        },

        updateMonths : function(loanValue) {
            months = [6, 12, 18, 24, 36, 48, 60];

            var $el = $("#rate");
            $el.empty();
            $.each(months, function(value, text) {
                $el.append($("<option></option>").attr("value", text).text(text));
            });

        },

        updateRates : function(loanValue, loanMonths) {
            var $this = this;
            finalRate  = $this.calculateRates(parseInt(loanValue), parseInt(loanMonths));
            $('#rate_display').hide();
            $('#rate_value').html(finalRate);
            $('#rate_display').show();
        },

        calculateRates: function (loanValue, loanMonths) {
            var $this = this;
            var loan = parseInt(loanValue);
            var interest = 31/100;
            var management_fee = $this.getManagementFee(loanValue);

            var alico = 0.357/100;
            var tenor = parseInt(loanMonths);
            with_alico = Math.round(this.pmt(interest/12, tenor, (-1 * (loan+management_fee ) *(1+alico*tenor))));
            without_alico = Math.round(this.pmt(interest/12, tenor, (-1 * (loan+management_fee ) *(1+0*tenor))));

            var rates = new Object();
            rates['with_alico'] = with_alico;
            rates['without_alico'] = without_alico;
            return without_alico;




        },

        pmt: function(rate, nper, pv, fv, type) {
            if (!fv) fv = 0;
            if (!type) type = 0;

            if (rate == 0) return -(pv + fv)/nper;

            var pvif = Math.pow(1 + rate, nper);
            var pmt = rate / (pvif - 1) * -(pv * pvif + fv);

            if (type == 1) {
                pmt /= (1 + rate);
            };

            return pmt;
        },

        getManagementFee: function(value) {
            if ( value > 3400 ) return 692.75;
            if ( value > 2125 ) return 403.75;
            if ( value > 1275 ) return 250.75;
            return 140.25;
        }
    };
}();

},{}],"local/credit-order":[function(require,module,exports){
module.exports = function() {
    return {

        JS_TRIGER_DISPLAY_RATES : '.js-trigger-rates-select',

        COOKIE_NAME: 'rates-display',
    	COOKIE_EXPIRATION: 30,

        init : function() {
            this.Cookies = require('cookies');
            this.attachEvents();
            this.checkCookie();
        },
        attachEvents : function () {
            var $this = this;

            $(this.JS_TRIGER_DISPLAY_RATES).click(function(){
	            if ( this.checked ) {
                    $this.writeCookie(1);
                }
                else {
                    $this.writeCookie(0);
                }
            });

        },

        writeCookie: function(value) {
    		var cookieExpiration = new Date();
    		cookieExpiration.setDate(cookieExpiration.getDate() + this.COOKIE_EXPIRATION);


    		this.Cookies.set(this.COOKIE_NAME, value, { expires: cookieExpiration });


    	},

        checkCookie : function() {
            path = window.location.pathname;
            if ( ( path == '/checkout/onepage/' || path == '/checkout/onepage' ) && this.Cookies.get(this.COOKIE_NAME) == 1 ) {
                $('#rates-display-banner').show();
            }
            else {
                $('#rates-display-banner').hide();
            }
        }
    };
}();

},{"cookies":37}],"local/esi":[function(require,module,exports){
module.exports = function(){
    return {
        subparts : [],
        url : null,
        inited : false,
        init : function () {
            if(this.inited){
                return this;
            }
            this.url = GLOBAL.getUrl('esi/cache/getall', false);
            this.inited = true;
            return this;
        },
        addSubpart : function(name, handler, params) {
            this.subparts.push({name : name, handler : handler , params : params});
            return this;
        },
        getSubpartsNames : function() {
            var list = {};
            this.subparts.forEach(function(each){
                list[each.name] = ( 'undefined' == typeof each.params ?  1 : each.params);
            });
            return list;
        },
        run : function() {
            var $this = this;
            $.ajax({
                url : $this.url,
                data : $this.getSubpartsNames(),
                method : 'POST',
            }).done(function(json){
                if(typeof json == 'undefined') {
                    return ;
                }
                $this.subparts.forEach(function(obj) {
                    if(json.hasOwnProperty(obj.name)) {
                        obj.handler(json[obj.name]);
                    }
                });
            });
        },
    };
}();

},{}],"local/leadcollector":[function(require,module,exports){
module.exports = function() {
    return {

        JS_TRIGGER_COLLECT : ".js-trigger-lead-collect",
        JS_COLLECT_FORM : "#lead-collector-form",

        init : function() {
			this.listen();
        },
        listen : function() {
            var $this = this;


            $(this.JS_TRIGGER_COLLECT).click(function(ev){
                ev.preventDefault();

                var collectorForm = $($this.JS_COLLECT_FORM);
                collectorForm.verify({debug:true});
                collectorForm.validate(function(success) {
                    if(!success) {
                        return;
                    }

                    var url = GLOBAL.getUrl('lc/save');

                    $.ajax({
                        url : url,
                        data : collectorForm.serialize(),
                        type : 'POST',

                    }).done(function(data){
                        var obj = data;
                       if(obj.error == true ) {
                           $this.goToStep(3);
                       } else {
                           $this.goToStep(2);
                       }
                    });

                });

            });

        },

        goToStep : function(id) {
            $('.steps').first().hide();
            $('#step-'+id).first().show();
        }

    };
}();
},{}],"local/locatii":[function(require,module,exports){
module.exports = function() {
    return {
        init : function() {
            require('chosen');
			this.listen();
        },
        listen : function() {
            $('.chosen-select').chosen({width: '100%'});
        }
    };
}();

},{"chosen":2}],"local/mainmenu":[function(require,module,exports){
module.exports = function(){
    return {


        PRODUSE_MENU_TRIGGER : '.ProduseMenu-trigger',
        PRODUSE_MENU_CONTENT : '.ProduseMenu-content',

        MainMenuToggle : false,
        MainMenuTrigger : '',
        MainMenuTriggerParent : '',

        init : function() {
            require('scrollLock');
            this.attachEvents();
            $('.ProduseMenu-subcategorii').scrollLock();
            return this;
        },

        attachEvents : function() {
            this._handleTrigger();
        },

        bindMainMenuListeners : function() {
            var object = this;
            $(".MainMenu-trigger").click( function(e) {
                object.MainMenuTrigger = $(this);

                if (object.MainMenuTrigger.hasClass('is-parent')) {
                    e.preventDefault();
                    object.MainMenuTriggerParent = $(this).parent();

                    if (!object.MainMenuToggle) {
                        object.openMainMenu();

                    } else if ( object.MainMenuToggle && !$(object.MainMenuTriggerParent).hasClass("is-active") ) {
                        object.closeMainMenu();
                        object.openMainMenu();

                    } else {
                        object.closeMainMenu();
                    };
                };

            })

            $(".ProduseMenu-trigger")
            .click( function(e) {
                e.preventDefault();
                thisParent = $(this).parent();

                if ( $('body').hasClass('homepage') && !$(".MobileMenu").is(':visible')) {
                    object.closeMainMenu();
                }

                if ( $(thisParent).hasClass("is-active") ) {
                    $(".ProduseMenu").removeClass("is-childClicked");
                    $(thisParent).removeClass("is-active");

                } else {

                    $(".ProduseMenu").addClass("is-childClicked");
                    $(thisParent).siblings(".ProduseMenu-item").removeClass("is-active");
                    $(thisParent).addClass("is-active");

                    if ( $('body').hasClass('homepage') && !$(".MobileMenu").is(':visible') ) {
                        $(document).click( function() {
                            $(".ProduseMenu").removeClass("is-childClicked");
                            $(".ProduseMenu-item").removeClass("is-active");
                        });
                        $(document).on( 'keydown', function ( e ) {
                            if ( e.keyCode === 27 ) { // ESC
                                $(".ProduseMenu").removeClass("is-childClicked");
                                $(".ProduseMenu-item").removeClass("is-active");
                            }
                        });
                        $(".ProduseMenu-item").click( function(event) {
                            event.stopPropagation();
                        });
                    };


                    if (!$(".MobileMenu").is(':visible')) {

                        $scrollContainer = $(thisParent).find(".ProduseMenu-subcategorii")

                        if ($scrollContainer.scrollTop() < $scrollContainer.prop('scrollHeight') - $scrollContainer.height() - 85) {
                            $scrollContainer.next(".ProduseMenu-subcategorii-scroll").fadeIn(100);
                        }

                        $scrollContainer.scroll(function(e) {
                            if ($scrollContainer.scrollTop() >= $scrollContainer.prop('scrollHeight') - $scrollContainer.height() - 85) {
                                $scrollContainer.next(".ProduseMenu-subcategorii-scroll").fadeOut(100);
                            }
                            else {
                                $scrollContainer.next(".ProduseMenu-subcategorii-scroll").fadeIn(100);
                            }
                        });

                        $(thisParent).find(".ProduseMenu-promovate-imagine[data-src]").each(function() {
                            $(this).attr("src", $(this).data('src')).removeAttr('data-src');
                        });

                    };
                }; //else
            }); //click function
        },

        unbindMainMenuListeners : function() {
            $(".ProduseMenu-trigger").unbind();
            $(".MainMenu-trigger").unbind();
        },

        closeMainMenu : function() {
            var active = $(".MainMenu-item.is-active");
            active.children("ul").removeClass("is-active");
            active.removeClass("is-active");

            this.MainMenuToggle = false;

            $(document).unbind();
            $(".MainMenu-item").unbind();
        },

        openMainMenu : function() {
            var object = this;
            $(this.MainMenuTriggerParent).addClass("is-active");
            this.MainMenuTrigger.siblings("ul").addClass("is-active");
            this.MainMenuToggle = true;
            if (!$(".MobileMenu").is(':visible')) {
                $(document).click( function() {
                    if (object.MainMenuToggle) {
                        object.closeMainMenu();
                    }
                });
                $(document).on( 'keydown', function ( e ) {
                    if ( e.keyCode === 27 ) { // ESC
                        if (object.MainMenuToggle) {
                            object.closeMainMenu();
                        }
                    }
                });
                $(".MainMenu-item").click( function(event) {
                    event.stopPropagation();
                });
            };
        },

        resetMainMenu : function() {
            this.closeMainMenu();
            this.MainMenuToggle = false;
            this.unbindMainMenuListeners();
            $(".ProduseMenu-item.is-active").removeClass("is-active");
            $(".ProduseMenu").removeClass("is-childClicked");
        },

        _handleTrigger : function() {
            // var $this = this;

            this.bindMainMenuListeners();
        },

    };
}();

},{"scrollLock":4}],"local/messages":[function(require,module,exports){
module.exports = function() {
    return {
    EVENT_AJAX_CALL_BEFORE : 'EVENT_AJAX_CALL_BEFORE',
    EVENT_AJAX_CALL_AFTER : 'EVENT_AJAX_CALL_AFTER',
    EVENT_NOTICE_ERROR : 'EVENT_NOTICE_ERROR',
    EVENT_NOTICE_SUCCESS : 'EVENT_NOTICE_SUCCESS',
    EVENT_NOTICE_INFO : 'EVENT_NOTICE_INFO',
    EVENT_NOTICE_WARNING : 'EVENT_NOTICE_WARNING',
    EVENT_SHOW_MODAL : 'EVENT_SHOW_MODAL',
    EVENT_CLEAR_MODALS : 'EVENT_CLEAR_MODALS',
    EVENT_REMOVE_MODAL : 'EVENT_REMOVE_MODAL',

    JS_AJAX_PLACEHOLDER : '#js-ajax-placeholder',

        init : function(){
            this.listen();
            require('notify');
            require('dimmer');
            require('modal');
            require('transition');
            return this;
        },

        listen : function () {
            GLOBAL.listen(this.EVENT_AJAX_CALL_BEFORE, this.ajaxBefore.bind(this));
            GLOBAL.listen(this.EVENT_AJAX_CALL_AFTER, this.ajaxAfter.bind(this));
            GLOBAL.listen(this.EVENT_NOTICE_ERROR, this.displayError.bind(this));
            GLOBAL.listen(this.EVENT_NOTICE_SUCCESS, this.displaySuccess.bind(this));
            GLOBAL.listen(this.EVENT_NOTICE_INFO, this.displayInfo.bind(this));
            GLOBAL.listen(this.EVENT_NOTICE_WARNING, this.displayWarning.bind(this));
            GLOBAL.listen(this.EVENT_SHOW_MODAL, this.showModal.bind(this));
            GLOBAL.listen(this.EVENT_CLEAR_MODALS, this.clearModals.bind(this));
            GLOBAL.listen(this.EVENT_REMOVE_MODAL, this.removeModal.bind(this));
            return this;
        },

        displaySuccess : function(msg) {
            $.notify(msg, 'success');
        },

        displayError : function(msg) {
            $.notify(msg, 'error');
        },

        displayInfo : function(msg) {
            $.notify(msg, 'info');
        },

        displayWarning : function(msg) {
            $.notify(msg, 'warn');
        },

        ajaxBefore : function(msg) {
            var template = require('local/messages/template/ajax.js');

            if (msg !== null && typeof msg === 'object' && msg.closable === false) {
                template.setDataItem('msg', msg.msg);
                template.toHtml();
                $(this.JS_AJAX_PLACEHOLDER).dimmer({closable: false}).dimmer('show');
            } else {
                template.setDataItem('msg', msg);
                template.toHtml();
                $(this.JS_AJAX_PLACEHOLDER).dimmer('show');
            };
        },

        ajaxAfter : function() {
            $(this.JS_AJAX_PLACEHOLDER).dimmer('hide');
        },

        showModal : function (selector) {
            $(selector).modal('show');
        },

        clearModals : function() {
            $('.modal').modal('hide');
            $('.modals').remove();
        },

        removeModal : function(selector) {
            $(selector).modal('hide');
            $(selector).parent().remove();
        }
    };
}();

},{"dimmer":3,"local/messages/template/ajax.js":31,"modal":6,"notify":7,"transition":10}],"local/minicart":[function(require,module,exports){
module.exports = function() {
    return {
        EVENT_MINICART_INIT : 'EVENT_MINICART_INIT',
        EVENT_MINICART_SHOW : 'EVENT_MINICART_SHOW',
        EVENT_MINICART_HIDE : 'EVENT_MINICART_HIDE',

        JS_MINICART_PLACEHOLDER : '#js-Header-cos',
        JS_MINICART_MOBILE_PLACEHOLDER : '#js-Header-cos-mobile',
        JS_MOBILE_MINICART_CONTAINER : '#js-mobile-cart-container',

        JS_HOLDER : null,

        init : function() {
            var esi = require('local/esi');
            esi.addSubpart('minicart', this.handleResponse.bind(this));
            this.listen();
            return this;
        },
        listen : function() {
            GLOBAL.listen('EVENT_AUTHLINKS_SHOW', this.hideMinicart.bind(this));
            GLOBAL.listen('EVENT_GLOBAL_WINDOW_CLICK', this.hideMinicart.bind(this));
        },
        handleResponse : function(items) {
            this.initMiniCart(items);
        },
        initMiniCart : function(items) {
            var finalizeaza = require('local/minicart/finalizeaza');
            finalizeaza.setDataItem('items',items);
            finalizeaza.toHtml();
            var minicart = require('local/minicart/minicart');
            var totalQty = 0;
            items.forEach(function(item){
                totalQty += parseInt(item.qty);
            });
            minicart.setData({products: items, cartUrl : GLOBAL.getUrl('checkout/onepage/'), cartQty:totalQty}).toHtml();
            $(this.JS_MOBILE_MINICART_CONTAINER).text(items.length == 0 ? 'Cos' : 'Cos (' + totalQty + ') ');
            this.attachEvents();
        },
        showMinicart : function() {
            if(this.JS_HOLDER == null) {
                return this;
            }
            if(!this.JS_HOLDER.hasClass('is-active')){
                this.JS_HOLDER.addClass('is-active');
            }
            GLOBAL.dispatch(this.EVENT_MINICART_SHOW, null);
        },
        hideMinicart : function() {
            if(this.JS_HOLDER == null) {
                return this;
            }
            if(this.JS_HOLDER.hasClass('is-active')){
                this.JS_HOLDER.removeClass('is-active');
            }
            GLOBAL.dispatch(this.EVENT_MINICART_HIDE, null);

        },
        _stopPropagation : function() {
            if(this.JS_HOLDER != null) {
                this.JS_HOLDER.click(function(ev){
                    ev.stopPropagation();
                });
            }
        },

        attachCartRemoval : function(){
          //if(null == this.JS_HOLDER) {
          //    return;
          //}
            var $this = this;
            this.JS_HOLDER.find('.js-trigger-cart-remove').click(function(ev) {
                var id = $(this).attr('rel');
                var url = GLOBAL.getUrl('checkout/cart/ajaxdelete/id/'+ id + '/');
                $.ajax({
                    url : url,
                    beforeSend : function() {
                        GLOBAL.dispatch('EVENT_AJAX_CALL_BEFORE', 'Produsul este sters din cos...');
                    },
                }).done(function(data){
                    GLOBAL.dispatch('EVENT_AJAX_CALL_AFTER');
                    try {
                        var obj = data;
                        if(obj.error == true ) {
                            GLOBAL.dispatch('EVENT_NOTICE_ERROR', obj.msg);
                        } else {
                            GLOBAL.dispatch('EVENT_NOTICE_SUCCESS', obj.msg);
                            $this.initMiniCart(obj.list);
                        }
                    } catch (Error) {
                        GLOBAL.dispatch('EVENT_NOTICE_ERROR', 'A aparut o eroare neasteptata');
                    }
                });
            });

        },

        attachEvents : function() {
            $('.js-header-cos-toggle').unbind('click');
            var $this = this;
            this.JS_HOLDER = $(this.JS_MINICART_PLACEHOLDER + ' , ' + this.JS_MINICART_MOBILE_PLACEHOLDER);
            this.attachCartRemoval();

            $('.js-header-cos-toggle').click(function(){
                if($this.JS_HOLDER.hasClass('is-active')) {
                    $this.hideMinicart();
                } else {
                    $this.showMinicart();
                }
            });
            this._stopPropagation();
        },
    };
}();

},{"local/esi":"local/esi","local/minicart/finalizeaza":32,"local/minicart/minicart":33}],"local/newsletter":[function(require,module,exports){
module.exports = function() {
    return {

        JS_TRIGGER_NEWSLETTER : ".js-triggerAboneazaModal",
        JS_NEWSLETTER_CONTAINER : '#js-container-newsletter',
        JS_TRIGGER_NEWSLETTER_SUBMIT : '#newslettter-form-submit',
        JS_NEWSLETTER_FORM : '#js-newsletter-form',

        init : function() {
            //this.listen();
            this.attachEvents();
        },
        attachEvents : function () {
            var $this = this;
            $(this.JS_TRIGGER_NEWSLETTER).click(function(ev){
                ev.preventDefault();
                var template = require('local/newsletter/template');
                template.toHtml();
                $this.showModal();
                $this.attachOnNewsletterForm();
            });

        },
        attachOnNewsletterForm : function() {
            var $this = this;
            $(this.JS_TRIGGER_NEWSLETTER_SUBMIT).click(function(ev){
                $('.modal').modal('show');
                ev.preventDefault();

                var url = GLOBAL.getUrl('newsletter/subscriber/newJson/');
                var $data = {};

                $data['source'] = 'newsletter/new';
                $data['email'] = $('#register_email').val();

                var newsletterForm = $($this.JS_NEWSLETTER_FORM);
                newsletterForm.verify({debug:true});
                newsletterForm.validate(function(success) {
                    if(!success) {
                        return;
                    }

                    $.ajax({
                        url : url,
                        data : $data,
                        type : 'POST',
                        beforeSend : function() {
                            GLOBAL.dispatch('EVENT_CLEAR_MODALS');
                            GLOBAL.dispatch('EVENT_AJAX_CALL_BEFORE', 'Abonare Newsletter');
                        }
                    }).done(function(data){
                        GLOBAL.dispatch('EVENT_AJAX_CALL_AFTER');
                        var obj = data;
                       if(obj.error == true ) {
                           GLOBAL.dispatch('EVENT_NOTICE_ERROR', obj.msg);
                       } else {
                           GLOBAL.dispatch('EVENT_CLEAR_MODALS');
                           GLOBAL.dispatch('EVENT_NOTICE_SUCCESS', obj.msg);
                       }
                    });

                });


            });
        },
        showModal : function() {
            GLOBAL.dispatch('EVENT_SHOW_MODAL', this.JS_NEWSLETTER_CONTAINER);
        }
    };
}();
},{"local/newsletter/template":34}],"local/optimo":[function(require,module,exports){
module.exports = function() {
    return {

        init : function() {
            this.attachEvents();
        },
        attachEvents : function () {
            var $this = this;

            var loanValue = $('#suma').val();
            var loanMonths = $('#rate').val();
            $this.updateRates(loanValue, loanMonths);

            $('#suma').on('click focusin', function() {
                this.value = '';
            });

            $( "#suma" ).change(function() {
                var loanValue = parseInt($('#suma').val());
                $this.updateMonths(loanValue);
                var loanMonths = parseInt($('#rate').val());
                $this.updateRates(loanValue, loanMonths);
                $('#rate_display_container').show();
                $('#rate_display_container_text').hide();
            });
            $( "#rate" ).change(function() {
                var loanValue =  parseInt($('#suma').val());
                var loanMonths = parseInt($('#rate').val());
                $this.updateRates(loanValue, loanMonths);

            });

        },

        updateMonths : function(loanValue) {
            months = [18, 24, 36];
            var $el = $("#rate");
            $el.empty();
            $.each(months, function(value, text) {
                $el.append($("<option></option>").attr("value", text).text(text));
            });

        },

        updateRates : function(loanValue, loanMonths) {
            var $this = this;
            finalRate  = $this.calculateRates(parseInt(loanValue), parseInt(loanMonths));
            $('#rate_display').hide();
            $('#rate_value').html(finalRate);
            $('#rate_display').show();
        },

        calculateRates: function (loanValue, loanMonths) {
            var dobanda = 0.19;
            var x = (dobanda / 12) * loanValue;
            var y = 1 - Math.pow((1+(dobanda / 12)),-1 * loanMonths);
            var rata = x / y;
            return rata.toFixed(2);
        },
    };
}();

},{}],"local/packages":[function(require,module,exports){
module.exports = function() {
    return {

        JS_TRIGGER_ADD : ".js-trigger-package-add",
        JS_CART_ADD_MODAL : '#js-add-to-cart-modal',
        JS_TRIGGER_PACKET_GIFT : '.js-trigger-package-gift-add',
        CADOURI_LIST : '#Cadouri-list',
        JS_SHOW_MODAL_GIFT : "#js-gift-modal",
        JS_TRIGGER_PRODUCT_GIFT_MODAL : ".js-trigger-cart-add-gift-modal",

        init : function() {
            this.listen();
        },
        listen : function() {
            GLOBAL.listen('EVENT_CATALOG_LIST_INITED', this.attachEvents.bind(this));
        },

        run : function() {
            this.attachEvents();
        },

        attachEvents : function() {
            var $this = this;
            $(this.JS_TRIGGER_ADD).click(function(ev){
                ev.preventDefault();
                var packageId = $(this).data('package-id');

                if('undefined' == typeof packageId) {
                    GLOBAL.dispatch('EVENT_NOTICE_ERROR', 'Pachetul nu poate fi adaugat in cos.');
                    return;
                }

                var gift_option = '';
                var data = {};
                $($this.CADOURI_LIST).find('input').each(function(key, elem) {
                    var input = $(elem);
                    if (input.attr("name") == "gift_options") {
                        gift_option = input.val();
                    }
                });

                if(gift_option == 2){
                    var gift = '';
                } else {
                    var gift = [];
                }

                $($this.CADOURI_LIST).find('input').each(function(key, elem){
                    var input = $(elem);
                    if(input.attr("name") == "gift_product" && input.attr("checked")){
                        gift = input.val();
                    }
                    if(input.attr("name") == "gift_products[]" && input.attr("checked")){
                        gift[gift.length++] = input.val();
                    }
                });

                if(gift_option == 2){
                    data['gift_product'] = gift;
                } else {
                    data['gift_products[]'] = gift;
                }

                data['id'] = packageId;

                var url = GLOBAL.getUrl('pachete/add/indexJson/' + packageId + '/');
                $.ajax({
                    url : url,
                    type : 'POST',
                    data : data,
                    beforeSend : function() {
                        GLOBAL.dispatch('EVENT_AJAX_CALL_BEFORE', 'Pachetul este adaugat in cos...');
                    },
                }).done(function(data){
                    GLOBAL.dispatch('EVENT_AJAX_CALL_AFTER');
                    try {
                        var obj = data;
                        if(obj.error == true ) {
                            GLOBAL.dispatch('EVENT_NOTICE_ERROR', obj.msg);
                        } else {
                            GLOBAL.dispatch('EVENT_NOTICE_SUCCESS', obj.msg);
                            require('local/minicart').initMiniCart(obj.list);

                            var template = require('local/catalog/template/product.js');
                            template.setDataItem('products', obj.products);
                            template.setDataItem('checkoutUrl', GLOBAL.getUrl('checkout/onepage/'));
                            template.toHtml();
                            $this.showModal();
                            $($this.JS_CART_ADD_MODAL + ' .js-closeModal').click(function(){
                                GLOBAL.dispatch('EVENT_REMOVE_MODAL', $this.JS_CART_ADD_MODAL);
                            });
                        }
                    } catch (Error) {
                        GLOBAL.dispatch('EVENT_NOTICE_ERROR', 'A aparut o eroare neasteptata');
                    }
              });
            });
            this.listenForAddToCartWithGifts();
        },

        listenForAddToCartWithGifts: function(){
            var $this = this;
            $(this.JS_TRIGGER_PACKET_GIFT).click(function(ev) {
                ev.preventDefault();
                var productId = $(this).data('product-id');
                var packId = $(this).data('package-id');
                var url = GLOBAL.getUrl('produse-cadou/ajax/indexPacheteJson/product/' + productId + '/pack/' + packId + '/');
                $.ajax({
                    url : url,
                    type : 'POST',
                    data : {},
                    beforeSend : function() {
                        GLOBAL.dispatch('EVENT_AJAX_CALL_BEFORE', 'Produsul este adaugat in cos...');
                    }
                }).done(function(data){
                    GLOBAL.dispatch('EVENT_AJAX_CALL_AFTER');
                    try {
                        var obj = data;
                        if(obj.error == true ) {
                            GLOBAL.dispatch('EVENT_NOTICE_ERROR', obj.msg);
                        } else {
                            GLOBAL.dispatch('EVENT_NOTICE_SUCCESS', obj.msg);
                            var template = require('local/packages/template/gift');
                            template.setDataItem('productWithGift', obj.product);
                            template.setDataItem('pack', obj.pack);
                            template.setDataItem('giftsList', obj.giftsList);
                            template.setDataItem('prodsList', obj.prodsList);
                            template.toHtml();
                            $this.showModalGift();
                            $this.listenForAddToCartWithGiftsModal(obj.product.id, obj.pack.id);
                            $($this.JS_SHOW_MODAL_GIFT + ' .js-closeModal').click(function(){
                                GLOBAL.dispatch('EVENT_REMOVE_MODAL', $this.JS_SHOW_MODAL_GIFT);
                            });
                        }
                    } catch (Error) {
                        GLOBAL.dispatch('EVENT_NOTICE_ERROR', 'A aparut o eroare neasteptata');
                    }
                });
            });
        },

        listenForAddToCartWithGiftsModal: function(productId, id){
            var $this = this;
            $(this.JS_TRIGGER_PRODUCT_GIFT_MODAL).click(function(ev) {
                ev.preventDefault();
                var url = GLOBAL.getUrl('pachete/add/indexJson/');
                var gift_option = '';

                $($this.JS_SHOW_MODAL_GIFT).find('input').each(function(key, elem){
                    var input = $(elem);
                    if(input.attr("name") == "gift_options"){
                        gift_option = input.val();
                    }
                });

                if(gift_option == 2){
                    var gift = '';
                } else {
                    var gift = [];
                }

                $($this.JS_SHOW_MODAL_GIFT).find('input').each(function(key, elem){
                    var input = $(elem);
                    if(input.attr("name") == "gift_product" && input.attr("checked")){
                        gift = input.val();
                    }
                    if(input.attr("name") == "gift_products[]" && input.attr("checked")){
                        gift[gift.length++] = input.val();
                    }
                });

                if(gift_option == 2){
                    data = {'gift_product' : gift, 'product': productId, 'id': id};
                } else {
                    data = {'gift_products[]' : gift, 'product': productId, 'id': id};
                }

                $.ajax({
                    url : url,
                    type : 'POST',
                    data : data,
                    beforeSend : function() {
                        GLOBAL.dispatch('EVENT_AJAX_CALL_BEFORE', 'Produsul este adaugat in cos...');
                    }
                }).done(function(data){
                    GLOBAL.dispatch('EVENT_AJAX_CALL_AFTER');
                    try {
                        var obj = data;
                        if(obj.error == true ) {
                            // Inchidem modalul anterior - de alegere cadouri
                            GLOBAL.dispatch('EVENT_REMOVE_MODAL', $this.JS_SHOW_MODAL_GIFT);
                            GLOBAL.dispatch('EVENT_NOTICE_ERROR', obj.msg);
                        } else {
                            GLOBAL.dispatch('EVENT_NOTICE_SUCCESS', obj.msg);
                            require('local/minicart').initMiniCart(obj.list);

                            var template = require('local/catalog/template/gift_product.js');
                            template.setDataItem('products', obj.products);
                            template.setDataItem('checkoutUrl', GLOBAL.getUrl('checkout/onepage/'));
                            template.toHtml();
                            // Inchidem modalul anterior - de alegere cadouri
                            GLOBAL.dispatch('EVENT_REMOVE_MODAL', $this.JS_SHOW_MODAL_GIFT);
                            $this.showModal();
                            $($this.JS_CART_ADD_MODAL + ' .js-closeModal').click(function(){
                                GLOBAL.dispatch('EVENT_REMOVE_MODAL', $this.JS_CART_ADD_MODAL);
                            });
                        }
                    } catch (Error) {
                        // Inchidem modalul anterior - de alegere cadouri
                        GLOBAL.dispatch('EVENT_REMOVE_MODAL', $this.JS_SHOW_MODAL_GIFT);
                        GLOBAL.dispatch('EVENT_NOTICE_ERROR', 'A aparut o eroare neasteptata');
                    }
                });
            });
        },

        showModalGift : function () {
            GLOBAL.dispatch('EVENT_SHOW_MODAL', this.JS_SHOW_MODAL_GIFT);
        },

        showModal : function() {
            GLOBAL.dispatch('EVENT_SHOW_MODAL', this.JS_CART_ADD_MODAL);
        }
    };
}();

},{"local/catalog/template/gift_product.js":22,"local/catalog/template/product.js":23,"local/minicart":"local/minicart","local/packages/template/gift":35}],"local/sales":[function(require,module,exports){
module.exports = function() {
    return {
        JS_TRIGGER_GUEST_EMAIL : '.js-Trigger-guestSalesEmail',
        JS_TRIGGER_GUEST_PHONE : '.js-Trigger-guestSalesPhone',

        init : function() {
            this.listen();
        },

        listen : function() {
            $this = this;
            $('#oar_type_phone').click(function(ev) {
                $($this.JS_TRIGGER_GUEST_EMAIL).hide();
                $($this.JS_TRIGGER_GUEST_PHONE).show();
            });

            $('#oar_type_email').click(function(ev) {
                $($this.JS_TRIGGER_GUEST_PHONE).hide();
                $($this.JS_TRIGGER_GUEST_EMAIL).show();
            });
        }
    };
}();
},{}],"local/sticky":[function(require,module,exports){
module.exports = function() {
    return {

        JS_TRIGGER_STICKY_FOOTER_CLOSE  : ".js-trigger-sticky-footer-close",
        JS_TRIGGER_STICKY_FOOTER_SHOW   : '.js-trigger-sticky-footer-show',

        init : function() {
            this.showStickyFooter();
            this.attachEvents();
        },
        attachEvents : function () {
            var $this = this;
             $(this.JS_TRIGGER_STICKY_FOOTER_CLOSE).click(function(ev){
                ev.preventDefault();
                $this.closeStickyFooterAndWriteCookie();
            });

        },
        showStickyFooter : function() {
            var $this = this;
            var canShow = $this.readCookie('can_show_sticky_footer');
            if ( canShow != '0') {
                $($this.JS_TRIGGER_STICKY_FOOTER_SHOW).addClass('is-active');
            }
        },
        closeStickyFooterAndWriteCookie : function() {
            var $this = this;
            $this.eraseCookie('can_show_sticky_footer');
            $this.createCookie('can_show_sticky_footer', '0', 3);
            $($this.JS_TRIGGER_STICKY_FOOTER_SHOW).removeClass('is-active');
        },
        createCookie : function(name,value,days) {
            var $this = this;
            if (days) {
                var date = new Date();
                date.setTime(date.getTime()+(days*24*60*60*1000));
                var expires = "; expires="+date.toGMTString();
            }
            else {
                var expires = "";
            }
            document.cookie = name+"="+value+expires+"; path=/";
        },
        readCookie : function (name) {
            var $this = this;
            var nameEQ = name + "=";
            var ca = document.cookie.split(';');
            for(var i=0;i < ca.length;i++) {
                var c = ca[i];
                while (c.charAt(0)==' ') c = c.substring(1,c.length);
                    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
            }
            return null;
        },

        eraseCookie : function (name) {
            var $this = this;
            $this.createCookie(name,"",-1);
        },
    };
}();
},{}]},{},[12]);
