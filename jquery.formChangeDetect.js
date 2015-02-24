/*!
 * jQuery form change detect Plugin 0.1
 *
 * https://github.com/prodigy7/formChangeDetect
 *
 * Copyright 2015 Manuel Bernhardt
 * Released under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 */

(function($) {

$.extend($.fn, {

	// http://docs.jquery.com/Plugins/Validation/validate
	formChangeDetect: function(options) {

		// if nothing is selected, return nothing; can't chain anyway
		if(!this.length) {
			if(options && options.debug && window.console) {
				console.warn("Nothing selected, can't detect anything, returning nothing.");
			}
			return;
		}

		// check if a validator for this form was already created
		var formChangeDetect = $.data(this[0], "formChangeDetect");
		if (formChangeDetect) {
			return formChangeDetect;
		}

		formChangeDetect = new $.formChangeDetect(options, this[0]);
		$.data(this[0], "formChangeDetect", formChangeDetect);

		return formChangeDetect;
	},

	formHasChanged: function() {
		var hasChanged = false;
		if($(this[0]).is("form")) {
			form = this;
			form.formChangeDetect().elementRange().each(function() {
				if(form.formChangeDetect().hasChanged(this)) {
					hasChanged = true;
				}
			});
		}

		return(hasChanged);
	}
});

// constructor for validator
$.formChangeDetect = function( options, form ) {
	this.settings = $.extend(true, {}, $.formChangeDetect.defaults, options);
	this.currentForm = form;
	this.init();
};

// set defaults
$.extend($.formChangeDetect, {

	defaults: {
		debug: false,
		onElementChange: function() {},
		onStatusChange: function() {},
	},

	setDefaults: function(settings) {
		$.extend($.formChangeDetect.defaults, settings);
	},

	prototype: {

		init: function() {

			var formChangeDetect = this;
			$(formChangeDetect).data('hasChanged', false);

			// Apply checksums
			$.formChangeDetect.elementRange(this).each(function() {
				formChangeDetect.addEventHandler(this);
			});
		},

		addEventHandler: function(element) {

			var formChangeDetect = this;

			switch(element.type) {
				case 'text':
				case 'password':
				case 'number':
				case 'search':
				case 'tel':
				case 'url':
				case 'email':
				case 'datetime':
				case 'date':
				case 'month':
				case 'week':
				case 'time':
				case 'datetime-local':
				case 'range':
				case 'color':
				case 'textarea':
				case 'select-one':
				case 'select-multiple':
					$(element).data('hashcode', $.formChangeDetect.hashcode($.formChangeDetect.getValue($(element))));
					$(element).data('hasChanged', false);
					$(element).bind('input paste, keyUp, change', function() {

						var changeState = null;
						var onElementChangeEvent = false;
						var onStatusChangeEvent = false;

						if($.formChangeDetect.hasChanged(element)) {
							if($(element).data('hasChanged') != true) {
								$(element).data('hasChanged', true);
								$.formChangeDetect.debug(formChangeDetect, 'Value has changed', 'info');

								onElementChangeEvent = true;
							}
						} else {
							if($(element).data('hasChanged') == true) {
								$(element).data('hasChanged', false);
								$.formChangeDetect.debug(formChangeDetect, 'Value has not changed', 'info');

								onElementChangeEvent = true;
							}
						}

						if(onElementChangeEvent) {
							if(typeof(formChangeDetect.settings.onElementChange) == 'function') {
								formChangeDetect.settings.onElementChange(element, $(element).data('hasChanged'));
							}
						}

						if($(formChangeDetect).data('hasChanged') != formChangeDetect.hasChanged()) {
							$(formChangeDetect).data('hasChanged', formChangeDetect.hasChanged());

							if(typeof(formChangeDetect.settings.onStatusChange) == 'function') {
								formChangeDetect.settings.onStatusChange(formChangeDetect, $(formChangeDetect).data('hasChanged'));
							}
						}

						return(true);
					});
				break;

				case 'checkbox':
				case 'radio':
					$(element).data('hashcode', $(element).is(':checked'));
					$(element).data('hasChanged', false);
					$(element).bind('change', function() {

						var changeState = null;
						var onElementChangeEvent = false;
						var onStatusChangeEvent = false;

						if($.formChangeDetect.hasChanged(element)) {
							if($(element).data('hasChanged') != true) {
								$(element).data('hasChanged', true);
								$.formChangeDetect.debug(formChangeDetect, 'Value has changed', 'info');

								onElementChangeEvent = true;
							}
						} else {
							if($(element).data('hasChanged') == true) {
								$(element).data('hasChanged', false);
								$.formChangeDetect.debug(formChangeDetect, 'Value has not changed', 'info');

								onElementChangeEvent = true;
							}
						}

						if(onElementChangeEvent) {
							if(typeof(formChangeDetect.settings.onElementChange) == 'function') {
								formChangeDetect.settings.onElementChange(element, $(element).data('hasChanged'));
							}
						}

						if($(formChangeDetect).data('hasChanged') != formChangeDetect.hasChanged()) {
							$(formChangeDetect).data('hasChanged', formChangeDetect.hasChanged());

							if(typeof(formChangeDetect.settings.onStatusChange) == 'function') {
								formChangeDetect.settings.onStatusChange(formChangeDetect, $(formChangeDetect).data('hasChanged'));
							}
						}

						return(true);
					});
				break;

				default:
					$.formChangeDetect.debug(formChangeDetect, 'Type "' + element.type + '" currently not handled (1)', 'warn');
				break;
			}
		},

		hasChanged: function() {
			form = this;
			var changed = false;

			$.formChangeDetect.elementRange(form).each(function() {
				if($.formChangeDetect.hasChanged(this)) {
					changed = true;
				}
			});
			return(changed);
		},

		getChanged: function() {
			form = this;

			return($.formChangeDetect.elementRange(form).filter(function() {
				return /true/i.test($(this).data("hasChanged"));
			}));
		},
	},

	hasChanged: function(element) {
		var formChangeDetect = this;
		switch(element.type) {
			case 'text':
			case 'password':
			case 'number':
			case 'search':
			case 'tel':
			case 'url':
			case 'email':
			case 'datetime':
			case 'date':
			case 'month':
			case 'week':
			case 'time':
			case 'datetime-local':
			case 'range':
			case 'color':
			case 'textarea':
			case 'select-one':
			case 'select-multiple':
				if(formChangeDetect.hashcode($.formChangeDetect.getValue($(element))) != $(element).data('hashcode')) {
					return(true);
				} else {
					return(false);
				}
			break;

			case 'checkbox':
			case 'radio':
				if($(element).is(':checked') != $(element).data('hashcode')) {
					return(true);
				} else {
					return(false);
				}
			break;

			default:
				$.formChangeDetect.debug('Type "' + element.type + '" currently not handled (2)', 'warn');
			break;
		}
	},

	getValue: function(element) {
		switch(typeof(element.val())) {
			case 'object':
				value = element.val().join('|');
			break;

			case 'string':
				value = element.val();
			break;
		}
		return(value);
	},

	elementRange: function(form) {
		return($(form.currentForm).find(":text, [type='radio'], [type='checkbox'], [type='password'], [type='file'], select, textarea, " +
			"[type='number'], [type='search'] ,[type='tel'], [type='url'], " +
			"[type='email'], [type='datetime'], [type='date'], [type='month'], " +
			"[type='week'], [type='time'], [type='datetime-local'], " +
			"[type='range'], [type='color']")
		)
	},

	hashcode: function(string) {
		var hash = 0, i, chr, len;
		if (string.length == 0) return hash;

		for (i = 0, len = string.length; i < len; i++) {
			chr	= string.charCodeAt(i);
			hash	= ((hash << 5) - hash) + chr;
			hash	|= 0; // Convert to 32bit integer
		}
		return hash;
	},

	debug: function(formChangeDetect, string, type) {
		if(formChangeDetect.settings && formChangeDetect.settings.debug && window.console) {
			switch(type) {
				case 'info':
					console.info(string);
				break;

				case 'warn':
					console.warn(string);
				break;
			}
		}
	},
});

}(jQuery));
