# blistr

track if children of a scrollable element are positioned in the viewport or not.

## usage

```
var blistr = require('blistr');

blistr(parentElement, {

    // How often to re-check what's in view
    interval: 200, // Optional, defaults to 200

    // How close to the viewport to decide that the element is view
    margin: 500, // Optional, defaults to 500

    // Opperation to perform on an element that has entered view.
    enter: function(childElement){
        childElement.style.visibility = null;
    },

    // Opperation to perform on an element that has exited view.
    exit: function(childElement){
        childElement.style.visibility = 'hidden';
    }

});
```

Both `enter` and `exit` will be called seperately from the update `interval`, and timed to requestAnimationFrame.
Modifying the `interval` should have a small impact on performance.