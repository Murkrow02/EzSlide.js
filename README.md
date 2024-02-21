# ez-slide.js

A simple and easy to use slide show library for web pages.
Inspired by [FullPage.js](https://alvarotrigo.com/fullPage/) but simpler, lighter and... free.

You can use this library in every website you want, even in commercial projects.

## How to use
Simply include the `ez-slide.js` and `ez-slide.css` files in your project and configure the library like this:

```javascript
var slide = new EzSlide({
    containerSelector: '.slide-container',
    slideSelector: '.slide',
    
    
    
    navigation: true,
    keyboard: true,
    onSlideChange: function(index) {
        console.log('Slide changed to ' + index);
    }
});
```