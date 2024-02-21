# ez-slide.js

A simple and easy to use slide show library for web pages.
Inspired by [FullPage.js](https://alvarotrigo.com/fullPage/) but simpler, lighter and... free.

You can use this library in every website you want, even in commercial projects.

## How to use
Simply include the `ez-slide.js` and `ez-slide.css` files in your project and configure the library like this:

```javascript
var slide = new EzSlide({
    containerSelector : '.slides-container',
    slideSelector : '.slide',
    transitionDurationSeconds : 0.5,
    transitionOffsetSeconds : 0.3,
    scrollSensitivity : 8,
    anchorPrefix : 'slide-',
    enableNavigationDots: true,
    
    
    keyboard: true,
    onSlideChange: function(index) {
        console.log('Slide changed to ' + index);
    }
});
```