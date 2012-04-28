/*!
 * Slide Show
 *
 * Copyright 2012, Peter Coles - http://mrcoles.com/
 * Licensed under the MIT license.
 * http://mrcoles.com/media/mit-license.txt
 * Date: Fri April 27 20:00:00 2012 -0500
 */
(function($, undefined) {

    //TODO - preload prev && next?
    //TODO - text too? and elt?

    var $viewer, $img, $prev, $next,
        srcs, index,
        imgWidth, imgHeight, imgFitted,
        viewerId = 'slide-show',
        active = false,
        initialized = false;

    function showViewer() {
        active = true;
        $viewer.addClass('show');
    }

    function hideViewer() {
        active = false;
        imgWidth = imgHeight = srcs = null;
        $viewer.removeClass('show');
    }

    function render(isFirst) {
        isFirst = $img.hide();
        var img = new Image();
        img.onload = function() {
            imgWidth = img.width;
            imgHeight = img.height;
            $img.attr('height', 'auto').attr('width', 'auto').attr('src', srcs[index]).show();
            imgFitted = false;
            fitImg();
            img = null;
        };
        img.onerror = function() {
            var src = srcs[index];
            showNext();
            img = null;
            console.log('Error loading img! ' + src);
        };
        img.src = srcs[index];
    }

    function fitImg() {
        var hr, wr, r, img, wH = window.innerHeight, wW = window.innerWidth;
        if (imgHeight <= wH && imgWidth <= wW) {
            if (imgFitted) {
                imgFitted = false;
                img = $img[0];
                img.width = 'auto';
                img.height = 'auto';
            }
        } else {
            hr = wH / imgHeight,
            wr = wW / imgWidth;
            r = hr < wr ? hr : wr;
            img = $img[0];
            img.width = imgWidth * r;
            img.height = imgHeight * r;
        }
    }

    function next(doPrev) {
        return function(evt) {
            evt && evt.preventDefault();
            if (srcs && srcs.length) {
                index = index + (doPrev ? -1 : 1);
                if (index < 0) { index = srcs.length - 1; }
                else if (index >= srcs.length) { index = 0; }
                render();
            } else {
                hideViewer();
            }
        };
    }

    var showNext = next();
    var showPrev = next(true);

    function init() {
        if (!initialized) {
            initialized = true;

            $viewer = $('<div>', {
                id: viewerId,
                click: function(evt) {
                    if (evt.target === this) {
                        hideViewer();
                    }
                }
            }).appendTo('body');

            $img = $('<img>').appendTo($viewer);

            $prev = $('<a>', {
                'class': 'prev',
                html: '<em>previous</em>',
                href: '#previous',
                click: showPrev
            }).appendTo($viewer);

            $next = $('<a>', {
                'class': 'prev next',
                html: '<em>next</em>',
                href: '#next',
                click: showNext
            }).appendTo($viewer);

            var keyActions = {27: hideViewer, 39: showNext, 37: showPrev};
            $(document).keyup(function(evt) {
                active && keyActions[evt.keyCode] && keyActions[evt.keyCode]();
            });

            $(window).resize(function() {
                active && imgHeight && imgWidth &&
                    (imgFitted || imgHeight > window.innerHeight || imgWidth > window.innerWidth) &&
                    fitImg();
            });
        }
    }

    var slideShow = $.slideShow = function (_srcs, _index) {
        if (_srcs && _srcs.length) {
            init();
            srcs = _srcs;
            index = _index && _index >= 0 && _index < srcs.length ? _index : 0;
            render(true);
            showViewer();
        }
    };

    // $('.foo').slideShow('a.image');
    // $('.foo').slideShow('li', {dataAttr: 'src'}); // if <li data-src="...">foo</li>

    $.fn.slideShow = function(selector, cfg) {
        if (cfg === undefined && $.isPlainObject(selector)) {
            cfg = selector;
            selector = undefined;
        }

        cfg = $.extend({
            elts: 'a',
            dataAttr: null
        }, cfg);

        if (selector) cfg.elts = selector;

        return this.each(function() {
            var $this = $(this);
            $this
                .on('click', cfg.elts, function(evt) {
                    evt.preventDefault();
                    var self = this;
                    var index = 0;
                    var srcs = $this.find(cfg.elts).map(function(i, elt) {
                        if (elt === self) { index = i; }
                        var src = cfg.imgDataAttr ? $(elt).data(cfg.imgDataAttr) : elt.href;
                        return src;
                    });
                    slideShow(srcs, index);
                });
        });
    };
})(jQuery);
