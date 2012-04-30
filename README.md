
jQuery Image Slide Show Viewer
==============================

A simple jQuery plugin to view full size versions of thumbnails. Open `index.html` in a web browser for more info.

The plugin automatically finds any links within the selected element and uses their `href`’s as images for the slide show. For example:

    :::javascript
    $('.slides').slideShow();

will work with markup like this:

    :::html
    <ul class="slides">
        <li><a href="img-1.png"><img src="img-1-thumb.png" /></a></li>
        <li><a href="img-2.png"><img src="img-2-thumb.png" /></a></li>
        …
    </ul>

And you can also specify a custom selector as the first argument and a custom data attribute to look at for the src, e.g.:

    :::javascript
    $('.slides').slideShow('li', {dataAttr: 'src'});

for markup like this:

    :::html
    <ul class="slides">
        <li data-src="img-1.png"><img src="img-1-thumb.png" /></li>
        <li data-src="img-2.png"><img src="img-2-thumb.png" /></li>
        …
    </ul>
