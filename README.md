# jQuery Form change detect Plugin
Plugin for detecting easily changed formulares. Example of use could be a save button which is only enabled if changes are done in form fields.

## Quick usage example:
```javascript
$(document).ready(function() {
 $('form').formChangeDetect({
   debug: true,
   onElementChange: function(elem, state) {
     $('input[name="lastChanged"]').val($(elem).attr('name'));
 
     var elementsChanged = '';
     $('form').formChangeDetect().getChanged().each(function() {
       elementsChanged += '|' + $(this).attr('name');
     });
   
     $('textarea[name="elementsChanged"]').val(elementsChanged);
   },
   onStatusChange: function(form, state) {
     $('input[name="formStatus"]').val(state);
   },
 });
});
```

## Options
Show some debug output. Possible values: true | false
```javascript
debug: true
```
Triggers function if element status changed from changed to unchanged or unchanged to changed.
```javascript
onElementChange: function() { }
```
Triggers function if form status changed from changed to unchanged or unchanged to changed.
```javascript
onStatusChange: function() { }
```
## Functions

Initiate plugin:
```javascript
$('form').formChangeDetect();
```
Get boolean state about change state:
```javascript
$('form').formChangeDetect().hasChanged();
```
Get object array with changed elements:
```javascript
$('form').formChangeDetect().getChanged();
```
