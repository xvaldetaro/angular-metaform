Angular Metaform
=================

This project provides a directive that generates forms based on **data description** and not view description. Usually, directives that generate forms dynamically are based on view description, i.e. an array of html input fields described in JSON. Conversely, Angular-metaform has an approach similar to a mongoose model, where the JSON describes an actual data document. [Checkout the live example](http://xvaldetaro.github.io/angular-metaform)

The supporting data types are: 

* ```text``` Based on its ```subtype``` property it can be any text based html input.
* ```bool``` Checkbox
* ```enum``` Radio options from a list provided in the description.
* ```ref``` Reference to another object. Requires a list o references provided in the description.
* ```object``` A sub object that recursively supports every object (can recurse infinitely).
* ```array``` Array of any of the supported types

## Installation

I have never made a bower package so I guess this commit is happening in order to tag and publish it. so I guess you will be able to ```bower install angular-metaform``` shortly. If not, you may checkout this repo and use the ```dist/metaform.min.js``` or ```dist/metaform.js```. Notice that these files already contain the default templates embedded. Therefore you only need to include one of them in your project.

## Usage

### Creating a form

Use the ```xvMetaform``` directive for creating form. The description JSON is an array of description objects. E.g.:

```javascript
// On the defining scope:
$scope.formDescription = [
  { id: 'Name', type: 'text', placeholder: 'Your Name' },
  { id: 'Email', type: 'text', subType: 'email' },
  { id: 'My Boolean', type: 'bool' },
  ...
];

$scope.model = {};
```

```html
<!-- On the html -->
<div xv-metaform="formDescription" xv-metaform-model="model"></div>

```

The ```xvMetaformModel``` attribute declares which object will bind to the form fields.

### The Description Object

There are only 2 required properties, which the directive uses internally:

* ```_xvKey```: Name of property that binds to the model in ```xvMetaformModel``` attribute.
* ```type```: Used to determine how and which template to compile the field.

The other properties are optional and will be passed in the scope to the template. 

### The Field Templates
The templates are located in ```src/templates```. The templates have access to anything put inside the field description object.

The bool type template:

```html
<!-- src/templates/text-bs.html (becomes text-bs.xv after build) -->
<div class="checkbox">
	<label>
		<input type="checkbox" ng-model="model.model" value="">
		{{field.label}}
	</label>
</div>
```

## Building

The source files are in ```src/```. In order to build (embed, aggregate, minify) just ```npm install``` in the root project folder, then ```grunt```. The output files will be at ```dist/```.

### Node example

Simple example that uses express to create a simple webserver, watches files for changes, lints and embed templates.

```npm install```

```grunt ```

### Static Example

Just an ```index.html``` with a ```gruntfile.js``` that copies files from src and node example to a ```/examples/static/dist/``` folder. 
Just run 
```npm install
grunt``

then open ```/examples/static/dist/index.html```
