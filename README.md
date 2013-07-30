general-editor
==============

A visual editing environment for certain kinds of data.

-----

What I doin':
* enclose data types in wrappers
* associate to the wrappers HTML templates for editing data types
* what do you do about data types that change the HTML containers?
Specific example:

I want many of my objects to be defined by a position. How do I make it so that changing the position anchor/control, such that it also changes the location on screen of the HTML of the overall object?

Okay, as it was, I was going to (eventually) have at least two positional datatyypes:
* Vector: a relative position, defined as an offset from the owner.
* Position: an absolute position, defined irrespective of the owner's position.

But maybe instead I need at least three?
* Vector
* Position
* PositionContainer: exactly the same as an object, but with an associated position, so that when you change the position's value, it changes the container's on-screen location.

You could even have it translate back and forth transparently between them, I guess!

This seems more and more like an MVC thing. I should read about those.
