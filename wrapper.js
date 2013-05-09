var toString = function (a) { return Object.prototype.toString.call(a); };

function infer_type (value) {
	if (value.hasOwnProperty('type') && value.hasOwnProperty('name')) {
		return value
	}
	
	if (typeof value == 'string') {
		return new StringW('new string field', value);
	}
	else if (typeof value == 'number') {
		return new NumberW('new number field', value);
	}
	else if (typeof value == 'array') {
		return new ArrayW('new array field', value);
	}
	else if (typeof value == 'object') {
		return new ObjectW('new string object', value);
	}
}
var heyo;
function Controls () {
	var o = $('<div></div>').addClass('controls');
	o.append($('<button></button>').html('X').addClass('remove'));
	o.append($('<button></button>').html('123').addClass('number'));
	o.append($('<button></button>').html('abc').addClass('string'));
	o.append($('<button></button>').html('[]').addClass('array'));
	o.append($('<button></button>').html('{}').addClass('object'));
	return o;
}
var rm_field = function (e) {
	heyo = $(e.target);
	var pars = $(e.target).parents('.field');
	if ($(pars[0]).is('#workspace')) {
		// If we're trying to remove the workspace, 
		return;
	}
	if (pars.length == 1) {
		$(pars[0]).remove();
		return;
		// TODO: Circular references!
	}
	var clicked_field = $(pars[0]);
	var clicked_wrapper = clicked_field.data('wrapper');
	var parent_field = $(pars[1]);
	var parent_wrapper = parent_field.data('wrapper');
	var index;
	jQuery.each(parent_wrapper.contents, function (key, value) { if (value == clicked_wrapper) { index = key; } });
	if (index !== undefined) {
		if (parent_wrapper.type == "array") {
			parent_wrapper.contents.splice(index, 1);
		}
		else if (parent_wrapper.type == "object") {
			delete parent_wrapper.contents[index];
		}
		// TODO: Circular references!
	}
	parent_wrapper.updateHTML();
}
var add = function (type) {
	return function (e) {
		var w = $($(e.target).parents('.field')[0]).data('wrapper');
		if (!w) {
			console.log('There was an error figuring out which thing to append to!');
			return;
		}
		w.push(new type());
	}
};
$(document).ready(function() {
	var ws = new ObjectW('workspace');
	$('#workspace-container').append(ws.element);
	ws.element.attr('id', '#workspace');
	$(document).on('click', 'button.remove', rm_field);
	$(document).on('click', 'button.number', add(NumberW));
	$(document).on('click', 'button.string', add(StringW));
	$(document).on('click', 'button.array', add(ArrayW));
	$(document).on('click', 'button.object', add(ObjectW));
});

els = []
count = 0;

function Wrapper(name, type, value) {
	count++;
	this.name = name;
	this.type = type;
	this.contents = value;
	this.element = $('<li></li>').addClass('field ' + type);
	els.push(this.element);
	this.element.data('wrapper', this);
	this.element.append( Controls() );
	this.element.append($('<div></div>').addClass('name').html(this.name));
	this.element.append($('<div></div>').addClass('type').html(this.type));
	this.element.append($('<div></div>').addClass('contents').html(this.contents));
}

function PositionW (name, value) {
	if (!value) { value = {x: 0, y: 0}; }
	Wrapper.call(this, name, 'position', value);
	this.element.children('.contents').html('');
	var handle = $('<span></span>').addClass('position-handle');
	this.element.children('.contents').append(handle);
	this.updateHTML();
}
PositionW.prototype = new Wrapper();
PositionW.prototype.updateHTML = function () {
	var old_name = this.element.children('.name').html();
	if (old_name !== this.name) { this.element.children('.name').html(this.name); }
	var old_type = this.element.children('.type').html();
	if (old_type !== this.type) { this.element.children('.type').html(this.type); }


	set_position_of_element(this.element.children('.contents .position-handle'), this.contents);
	this.element.data('wrapper', this);
}
PositionW.prototype.setValue = function (position) {
	if (!position.x || !position.y) {
		console.log('error setting position of a position handle!');
	}
	set_position_of_element(this.element.children('.contents .position-handle'), this.contents);

function NumberW (name, value) {
	if (!value) { value = 0; }
	Wrapper.call(this, name, 'number', value);
	this.element.children('.contents').remove();
	var input = $('<input></input>').addClass('contents').attr('type', 'number').val(value);
	var s = this;
	input.change(function () { s.setValue($(this).value); });
	this.element.append(input);
	this.updateHTML();
}
NumberW.prototype = new Wrapper();
NumberW.prototype.updateHTML = function () {
	var old_name = this.element.children('.name').html();
	if (old_name !== this.name) { this.element.children('.name').html(this.name); }
	var old_type = this.element.children('.type').html();
	if (old_type !== this.type) { this.element.children('.type').html(this.type); }
	// Check if contents changed?
	this.element.children('.contents').html(this.contents);
	this.element.data('wrapper', this);
};
NumberW.prototype.setValue = function (value) {
	this.contents = value;
	this.updateHTML();
};
NumberW.prototype.process = function () { return this.contents; };

function StringW (name, value) {
	if (!value) { value = ''; }
	Wrapper.call(this, name, 'string', value);
	this.element.children('.contents').remove();
	var input = $('<input></input>').addClass('contents').attr('type', 'text').val(value);
	var s = this;
	input.change(function (e) { s.setValue($(e.target).val()); });
	this.element.append(input);
	this.updateHTML();
}
StringW.prototype = new Wrapper();
StringW.prototype.updateHTML = function () {
	var old_name = this.element.children('.name').html();
	if (old_name !== this.name) { this.element.children('.name').html(this.name); }
	var old_type = this.element.children('.type').html();
	if (old_type !== this.type) { this.element.children('.type').html(this.type); }
	// Check if contents changed.
	this.element.children('.contents').val(this.contents);
	this.element.data('wrapper', this);
};
StringW.prototype.setValue = function (value) {
	this.contents = value;
	this.updateHTML();
};
StringW.prototype.process = function () { return this.contents; };

function ArrayW (name, contents) {
	Wrapper.call(this, name, 'array', []);
	if (contents) { this.setValue(contents); }
	this.updateHTML();
	this.total_count = 0;
}
ArrayW.prototype = new Wrapper();
ArrayW.prototype.updateHTML = function () {
	var old_name = this.element.children('.name').html();
	if (old_name !== this.name) { this.element.children('.name').html(this.name); }
	var old_type = this.element.children('.type').html();
	if (old_type !== this.type) { this.element.children('.type').html(this.type); }

	this.element.children('.contents').children().remove();
	this.element.children('.contents').remove();
	var new_contents = $('<ol></ol>').addClass('contents');
	jQuery.each(this.contents, function (index, value) { value.updateHTML(); new_contents.append(value.element); });
	this.element.append(new_contents);
	this.element.data('wrapper', this);
}
ArrayW.prototype.setValue = function (array) {
	var new_contents = [];
	jQuery.each(array, function (i, value) { new_contents.push( infer_type(value) ); });
	this.contents = new_contents;
	this.updateHTML();
};
ArrayW.prototype.push = function (value) {
	var fresh = infer_type(value);
	if (!fresh.name) {
		fresh.name = "field #" + this.total_count;
	}
	this.total_count++;
	this.contents.push( infer_type(value) );
	this.updateHTML();
};
ArrayW.prototype.process = function() {
	var out = [];
	jQuery.each(this.contents, function(key, value) { out[key] = value.process(); });
	return out;
};

function ObjectW (name, contents) {
	Wrapper.call(this, name, 'object', {});
	if (contents) { this.setValue(contents); }
	this.updateHTML();
	this.total_count = 0;
}
ObjectW.prototype = new Wrapper();
ObjectW.prototype.updateHTML = function () {
	var old_name = this.element.children('.name').html();
	if (old_name !== this.name) { this.element.children('.name').html(this.name); }
	var old_type = this.element.children('.type').html();
	if (old_type !== this.type) { this.element.children('.type').html(this.type); }

	this.element.children('.contents').children().remove();
	this.element.children('.contents').remove();
	var new_contents = $('<ul></ul>').addClass('contents');
	jQuery.each(this.contents, function (key, value) { value.updateHTML(); new_contents.append(value.element); });
	this.element.append(new_contents);
	this.element.data('wrapper', this);
};
ObjectW.prototype.setValue = function (obj) {
	this.extend(obj);
};
ObjectW.prototype.push = function (field) {
	var field_name;
	if (field.name) {
		field_name = field.name;
	}
	else {
		field_name = 'field #' + this.total_count;
	}
	this.total_count++;
	var new_obj = {};
	new_obj[field_name] = infer_type(field);
	this.extend(new_obj);
}
ObjectW.prototype.extend = function (obj) {
	var new_contents = {};
	jQuery.each(obj, function (key, value) { 
			var new_wrapped_object = infer_type(value);
			new_wrapped_object.name = key;
			new_wrapped_object.updateHTML();
			new_contents[key] = new_wrapped_object; 
			});
	jQuery.extend(this.contents, new_contents);
	this.updateHTML();
};
ObjectW.prototype.process = function() {
	var out = {};
	jQuery.each(this.contents, function(key, value) { out[key] = value.process(); });
	return out;
};
