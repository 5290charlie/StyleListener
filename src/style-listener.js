var StyleListener = (function() {
    /**
     * Constructor with options as only argument
     *
     * @param options
     * @constructor
     */
    function StyleListener(options) {
        // Need to reference options as an object, set it to empty if it is undefined
        if (typeof options === 'undefined') {
            options = {};
        }

        // Set member defaults
        this.element   = null;
        this.elementId = '';
        this.trigger   = {};
        this.pollFreq  = 250;
        this.isPolling = false;
        this.prevStyle = '';
        this.callback  = null;

        // Overwrite poll frequency if valid option is provided
        if (typeof options.pollFreq === 'number' && options.pollFreq > 0) {
            this.pollFreq = options.pollFreq;
        }

        // Overwrite element if a valid option is provided
        if (typeof options.element === 'object') {
            this.element = options.element;

        // Overwrite element using id if a valid option is provided
        } else if (typeof options.elementId === 'string') {
            this.elementId = options.elementId;
            this.element = document.getElementById(this.elementId);
        }

        // Overwrite trigger object if a valid option is provided
        if (typeof options.trigger === 'object') {
            this.trigger = options.trigger;
        }

        // Overwrite callback function if a valid option is provided
        if (typeof options.callback === 'function') {
            this.callback = options.callback;
        }
    }

    /**
     * Initialize the listener
     */
    StyleListener.prototype.init = function() {
        // Maintain a version of the listener as _this ("this" can change scope!)
        var _this = this;

        // Verify the validity of the listener settings
        if (_this.isValid()) {
            // Sanitizing the trigger values (make all strings lower-case for consistency)
            _this.sanitize();

            // Initialize the style tracking variable "prevStyle"
            _this.trackStyle();

            // Verify the browser is not webkit, and the addEventListener method exists
            if (!_this.isWebkit() && _this.getElement().addEventListener) {
                // Attach an event listener on the desired element to listen for change(s) in DOM attributes
                _this.getElement().addEventListener('DOMAttrModified', function (e) { _this.listen(e) }, false);

            // The browser does not support event listeners, use setTimeout polling instead
            } else {
                // Set polling flag to true
                _this.isPolling = true;

                // Begin polling for changes
                _this.poll();
            }
        }
    };

    /**
     * Standardize properties and values of the trigger for this listener to lower-case (strings only)
     */
    StyleListener.prototype.sanitize = function() {
        // Maintain a version of the listener as _this ("this" can change scope!)
        var _this = this;

        // Make a copy of the trigger
        var trigger = _this.trigger;

        // Reset the trigger for this listener to an empty object
        _this.trigger = {};

        // Loop through copied trigger, and refill this listener's trigger with lower-case keys/values
        for (prop in trigger) {
            _this.trigger[prop.toLowerCase()] = (typeof trigger[prop] === 'string' ? trigger[prop].toLowerCase() : trigger[prop]);
        }
    };

    /**
     * Set the tracking variable "prevStyle" to the current style attribute value
     */
    StyleListener.prototype.trackStyle = function() {
        // Maintain a version of the listener as _this ("this" can change scope!)
        var _this = this;

        // Load default (initial style attribute content)
        _this.prevStyle = _this.getElement().getAttribute('style');
    };

    /**
     * Poll for changes with recursive timeouts instead of listening
     */
    StyleListener.prototype.poll = function() {
        // Maintain a version of the listener as _this ("this" can change scope!)
        var _this = this;

        setTimeout(function() {
            if (_this.getElement() && _this.getElement().getAttribute('style')) {
                _this.checkStyle(_this.getElement().getAttribute('style'));
            } else {
                _this.poll();
            }
        }, _this.pollFreq);
    };

    /**
     * Main listening function (this is called whenever the element has an attribute modified)
     *
     * @param e Attribute changing event
     */
    StyleListener.prototype.listen = function(e) {
        // Maintain a version of the listener as _this ("this" can change scope!)
        var _this = this;

        // Only applies to the style attribute
        if (e.attrName === 'style') {
            // Check the style (using string of attribute's new value)
            _this.checkStyle(e.newValue);
        }
    };

    /**
     * Check the current style of the element, and compare to the designated styles to trigger the callback
     *
     * @param style_attr The current style attribute of the desired element
     */
    StyleListener.prototype.checkStyle = function(style_attr) {
        // Maintain a version of the listener as _this ("this" can change scope!)
        var _this = this;

        // Default triggered to difference in style attribute
        var triggered = _this.prevStyle != _this.getElement().getAttribute('style');

        // Build a style object from the attribute string
        var style = _this.buildStyleFromString(style_attr);

        // Loop through all styles defined in the trigger
        for (prop in _this.trigger) {
            // For triggered to remain true, each property/value pair in _this.trigger must exist in the style attribute
            triggered = triggered && (typeof style[prop] !== 'undefined' && style[prop] == _this.trigger[prop]);
        }

        // If triggered is still true, the element has the desired style(s)
        if (triggered) {
            // Run callback function
            _this.callback(_this);

            // Update the style attribute tracking variable "prevStyle"
            _this.trackStyle();
        }

        // If we are polling, keep polling
        if (_this.isPolling) {
            _this.poll();
        }
    };

    /**
     * Check validity of the current listener
     *
     * @returns {Element|boolean}
     */
    StyleListener.prototype.isValid = function() {
        // Maintain a version of the listener as _this ("this" can change scope!)
        var _this = this;

        // Verify element exists and all required members are valid
        return (
            _this.getElement() &&
            typeof _this.trigger === 'object' &&
            typeof _this.callback === 'function' &&
            (typeof _this.pollFreq === 'number' && _this.pollFreq > 0)
        );
    };

    /**
     * Detect whether or not current user agent (browser) is webkit (chrome or safari)
     *
     * @returns {boolean}
     */
    StyleListener.prototype.isWebkit = function() {
        var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
        var isSafari = /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);

        return (isChrome || isSafari);
    };

    /**
     * Take the style attribute (as a string) and turn it into an object indexed by property
     *
     * @param str_style
     * @returns {{}}
     */
    StyleListener.prototype.buildStyleFromString = function(str_style) {
        // Initialize an empty object for the style
        var style = {};

        // Get a list of rules from the style attribute (split on semicolon)
        var rules = str_style.split(';');

        // Loop through all style rules
        for (i in rules) {
            // Set a variable for the current rule
            var rule = rules[i];

            // Split the current rule into property and value parts
            var parts = rule.split(':');

            // Ensure there are exactly 2 parts to each rule
            if (parts.length == 2) {
                // Trim and force lower-case on all parts
                for (j in parts) {
                    parts[j] = parts[j].replace(/^\s+|\s+$/g, '').toLowerCase();
                }

                // Insert this property/value pair into the style object
                style[parts[0]] = parts[1];
            }
        }

        // Return the constructed style object
        return style;
    };

    /**
     * Simple wrapping of getElementById for the target element
     *
     * @returns {Element}
     */
    StyleListener.prototype.getElement = function() {
        return this.element;
    };

    return StyleListener;
})();
