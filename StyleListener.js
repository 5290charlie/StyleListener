var StyleListener = (function() {
    function StyleListener(options) {
        if (typeof options === 'undefined') {
            options = {};
        }

        this.isPolling = false;
        this.pollFreq = 250;
        this.elementId = '';
        this.trigger = {};
        this.callback = function() {};

        if (typeof options.pollFreq === 'number') {
            this.pollFreq = options.pollFreq;
        }

        if (typeof options.elementId === 'string') {
            this.elementId = options.elementId;
        }

        if (typeof options.trigger === 'object') {
            this.trigger = options.trigger;
        }

        if (typeof options.callback === 'function') {
            this.callback = options.callback;
        }

    }

    StyleListener.prototype.init = function() {
        var _this = this;

        if (_this.isValid()) {
            _this.sanitize();

            if (_this.getElement().addEventListener) {
                _this.getElement().addEventListener('DOMAttrModified', function (e) { _this.listen(e) }, false);
            } else {
                _this.isPolling = true;
                _this.poll();
            }
        }
    };

    StyleListener.prototype.sanitize = function() {
        var _this = this;
        var trigger = _this.trigger;

        _this.trigger = {};

        for (prop in trigger) {
            _this.trigger[prop.toLowerCase()] = (typeof trigger[prop] === 'string' ? trigger[prop].toLowerCase() : trigger[prop]);
        }
    };

    StyleListener.prototype.poll = function() {
        var _this = this;

        setTimeout(function() {
            if (_this.getElement()) {
                _this.checkStyle(_this.getElement().getAttribute('style'));
            }
        }, _this.pollFreq);
    };

    StyleListener.prototype.listen = function(e) {
        var _this = this;

        if (e.attrName === 'style') {
            _this.checkStyle(e.newValue);
        }
    };

    StyleListener.prototype.checkStyle = function(style_attr) {
        var _this = this;
        var style = _this.buildStyleFromString(style_attr);
        var triggered = true;

        for (prop in _this.trigger) {
            triggered = triggered && (typeof style[prop] !== 'undefined' && style[prop] == _this.trigger[prop]);
        }

        if (triggered) {
            _this.callback();
        } else if (_this.isPolling) {
            _this.poll();
        }
    };

    StyleListener.prototype.isValid = function() {
        var _this = this;

        return (_this.getElement() && typeof _this.trigger === 'object' && typeof _this.callback === 'function');
    };

    StyleListener.prototype.buildStyleFromString = function(str_style) {
        var style = {};
        var rules = str_style.split(';');

        for (i in rules) {
            var rule = rules[i];
            var parts = rule.split(':');

            if (parts.length == 2) {
                for (j in parts) {
                    parts[j] = parts[j].replace(/^\s+|\s+$/g, '').toLowerCase();
                }

                style[parts[0]] = parts[1];
            }
        }

        return style;
    };

    StyleListener.prototype.getElement = function() {
        var _this = this;

        return document.getElementById(_this.elementId);
    };

    return StyleListener;
})();