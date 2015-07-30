# StyleListener
Javascript class to listen for changes an a specific elements style attribute.

## Usage
#### HTML:
```html
<script type="text/javascript" src="StyleListener.js"></script>
```

#### Javascript:
```javascript
// Create listener object
var listener = new StyleListener({
	// Polling frequency in milliseconds (fallback for IE8/browsers without addEventListener support)
	pollFreq: 250,

	// ID of the element to listen for style changes
	elementId: 'myElement',
	
	// Style property/value pairs to listen for
	trigger: {
		'display': 'none'
	},

	// Function to be executed when #myElement has the styles set above
	callback: function() {
		alert('myElement is now display:none');
	}
});

// Initialize the listener
listener.init();
```
