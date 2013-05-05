function ns_elem () { // Call with elem_assist(tag, ns[, attributes_i, ns_i[, attributes_none]])
	if (typeof arguments[0] === "undefined") {
		console.log('There was an error in the element assist function. Called with no valid tag name!');
	}
	var elem;
	if (typeof arguments[1] === "string") {
		// The second argument is a namespace. This is why this function even exists, people!
		elem = document.createElementNS(arguments[1], arguments[0]);
		for (var i=2; i<arguments.length; i+=2) {
			// Iterate through pairs of arguments.
			if (typeof arguments[i+1] === "undefined") {
				// Un-namespaced set of attributes.
				for (var key in arguments[i]) {
					elem.setAttribute(key, arguments[i][key]);
				}
				// As below, unnecessary break; statement here.
				break;
			}
			else {
				for (var key in arguments[i]) {
					elem.setAttributeNS(arguments[i+1], key, arguments[i][key]);
				}
			}
		}
	}
	else {
		elem = document.createElement(arguments[0]);
		for (var i=1; i<arguments.length; i+=2) {
			// Iterate through pairs of arguments, which should be attributes, namespace, attributes, namespace, etc., until a final attributes.
			if (typeof arguments[i+1] === "undefined") {
				// If the second argument is undefined, then we're done with namespaced attributes.
				for (var key in arguments[i]) {
					elem.setAttribute(key, arguments[i][key]);
				}
				// This break is actually unnecessary; it'll break out on the next iteration of the loop.
				break;
			}
			else {
				for (var key in arguments[i]) {
					elem.setAttributeNS(arguments[i+1], key, arguments[i][key]);
				}
			}
		}
	}
	return elem;
}


function object_from_field (field) {
	var field = $(field);
	var output;
	if (field.is('.object')) {
		output = {};
		field.children('.contents').children().each(function() { output[$(this).children('.field-name').val()] = object_from_field($(this)); });
	}
	else if (field.is('.array')) {
		output = [];
		field.children('.contents').children().each(function() { output.push( object_from_field($(this))); });
	}
	else if (field.is('.reference')) {
		output = null;

		if (field.children('.contents')
		output = field.children('.contents').val();
	}
	return output;
}

function field_from_object (obj) {
	var o;
	if (toString.call(obj) === '[object Array]') {
		// Array!
		o = add_array_to(target)();
		for (var i=0; i<obj.length; i++) {
			o.children('.contents').append(field_from_object(obj[i]));
		}
	}
	else if (toString.call(obj) === '[object Object]') {
		// Object!
		o = add_object_to(target)();
		for (key in obj) {
			k = key;
			o.children('.contents').append(field_from_object(obj[k]).children('.field-name').val(k));
		}
	}
	else if (toString.call(obj) === '[object Number]') {
		o = add_field('range')(target)();
		o.children('.contents').val(obj);
	} 
	else {
		o = add_field('text')(target)();
		o.children('.contents').val(obj);
	}
	return o;
}
