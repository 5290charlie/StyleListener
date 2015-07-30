# StyleListener
Javascript class to listen for changes an a specific elements style attribute.

## Usage
#### HTML:
```html
<script type="text/javascript" src="StyleListener.js"></script>
```

#### Javascript:
```javascript
var listener = new StyleListener({
	callback: popPR,
	elementId: 'preloader',
	trigger: {
		'display': 'none'
	}    
});
    
listener.init();
```
