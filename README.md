# StyleListener
Javascript class to listen for changes an a specific elements style attribute.

## Features
* Cross-browser (works in IE8)
* No dependencies (does not require jQuery or any other 3rd party JS libraries)
* Easy to use!

## Usage

#### HTML Include:
```html
<script type="text/javascript" src="path/to/build/style-listener.min.js"></script>
```

#### Basic:
*Listen for **any** changes to an elements style attribute*
```javascript
// Create listener object
var listener = new StyleListener({
	// ID of the element to listen for style changes
	elementId: 'myElement',

	// OR you can provide the element object directly
	// * If both options are provided, only the "element" option will be used
	element: document.getElementById('myElement')

	// Function to be executed when #myElement style attribute changes
	callback: function() {
		alert('#myElement style attribute has changed!');
	}
});

// Start the listener
listener.start();

// You can stop the listener anytime (stop executing callback function on changes)
listener.stop();
```

#### Advanced:
*Listen for **specific** changes to an elements style attribute*
```javascript
// Create listener object
var listener = new StyleListener({
	// Polling frequency in milliseconds (fallback for IE8/browsers without addEventListener support)
    pollFreq: 250, // Optional, defaults to 250ms

	// Element to listen on
	element: document.querySelector('#myElement')

    // Specific style property/value pairs to listen for
    trigger: {
        'display': 'block',
        'background-color': 'black',
        'color': 'white',
    },

    // Function to be executed when #myElement has the styles set above
    callback: function() {
        alert('#myElement style contains: "display:block; background-color:black; color:white;"');
    }
});

// Start the listener
listener.start();

// You can stop the listener anytime (stop executing callback function on changes)
listener.stop();
```
