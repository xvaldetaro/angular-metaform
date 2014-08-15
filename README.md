Angular Metaform
=================

This project contains directives that generate a form based on a JSON description. The description may include only fields or grid layout and fields. The output fields and layout are based on templates which may be customized. The default templates use Bootstrap's grid system and form controls. Check out the [live example](http://xvaldetaro.github.io/angular-metaform/).

## Installation

I have never made a bower package so I guess this commit is happening in order to tag and publish it. so I guess you will be able to ```bower install angular-metaform``` shortly. If not, you may checkout this repo and use the ```dist/metaform.min.js``` or ```dist/metaform.js```. Notice that these files already contain the default templates embedded. Therefore you only need to include one of them in your project.

## Usage

### Creating a form without layout

Use the ```xvMetaform``` directive for creating form without layout. The description JSON for layoutless forms is just an array of description objects. E.g.:

```javascript
// On the defining scope:
$scope.formDescription = [
  { id: 'Name', type: 'text', placeholder: 'Your Name' },
  { id: 'Email', type: 'text', subType: 'email' },
  { id: 'Color', type: 'text', subType: 'color' },
  { id: 'Date', type: 'text', subType: 'date' },
  { id: 'My Boolean', type: 'bool' },
  { id: 'My Enum', type: 'enum', choices: ['Opt1', 'Opt2', 'AnotherOpt']}
];

$scope.model = {};
```

```html
<!-- On the html -->
<div xv-metaform="formDescription" xv-metaform-model="model"></div>

```

The ```xvMetaformModel``` attribute declares which object will bind to the form fields.

### The Description Object

The directive uses the description to generate and bind the form. There are only 2 required properties, which the directive uses internally:

* ```id```: Name of property that binds to the model in ```xvMetaformModel``` attribute. Furthermore, it is used for css attricutes in the form controls
* ```type```: Used for determine how and which template to compile the field.

The other properties are optional and will be passed as context for the template. 

### The Field Templates
Lets Take a look at the templates to understand how the properties are used:

```html
<!-- src/templates/text-bs.html (becomes text-bs.xv after build) -->
<div class="form-group">
	<label for="{{id}}">{{label}}</label>
	<input data-ng-model="model['{{id}}']" type="{{subType}}" class="form-control" id="{{id}}">
</div>
```

Notice that the html contains variables to be interpolated inside curly brackets ```{{}}```. This can be a bit confusing as it has the same syntax of a regular angular template, but it is used differently. These templates are compiled and interpolated before being placed inside your html by the ```xvMetaform``` directive. This interpolation is made using the Description Object provided to ```xvMetaform```.

If the template above was to be compiled for the definition object:

```javascript
{ id: 'MyEmail', type: 'text', subType: 'email' },```

it would result in the following html:

```html
<!-- src/templates/text-bs.html (becomes text-bs.xv after build) -->
<div class="form-group">
	<label for="MyEmail">MyEmail</label>
	<input data-ng-model="model['MyEmail']" type="email" class="form-control" id="MyEmail">
</div>
```

Notice that most of the ```javascript undefined``` properties fall back to id or some other more semantically similar property. E.g. the ```label``` property fell back to ```id``` property.

### Using your own templates

Although I just started developing this, it is already possible to change your templates. Just mind that you need to include the slots with ```{{}}``` for interpolation inside and you **must** reference the model by ```html data-ng-model="model['{{id}}']"```

The current default templates are located inside src/templates and they all follow a naming patterns of ```<prefix>-bs.html``` however, inside the js code, these are referenced as ```<prefix>-bs.xv```. This change happens during the build process where all templates are concatenated and stuffed inside a singular angular module (see[grunt-angular-templates](https://github.com/ericclemmons/grunt-angular-templates) and my [gruntfile](https://github.com/xvaldetaro/angular-metaform/blob/master/Gruntfile.js) for details)

In order to use your own templates, you can replace the default ones, which I do not recommend or change the ```suffix``` configuration of the ```xvFieldGen``` service provider:

```javascript 
angular.module('yourModule')
.config(['xvFieldGenProvider', function(xvFieldGenProvider) {
	// default is '-bs.xv'
	xvFieldGenProvider = '-mySuffix-.myinitials';
}]);

/* 
Now xvMetaform will look for templates in the form <prefix>-mySuffix-.myinitials inside 
$templateCache service. I.e. text-mySuffix-.myinitials if decription.type == 'text'
*/
```

I intend to provide an attribute that enables to config per directive what suffix to use.

### Creating a Form with Grid Layout

The grid layout follows [bootstraps grid system](http://getbootstrap.com/css/#grid) with ```md``` size. All columns are xs-12 as well, so they will be always stacked on smaller devices.

A grid form uses the ```xvMetaformGrid``` directive instead of ```xvMetaform```. It expects a grid of description objects and sizes, whereas ```xvMetaform``` only a list of description objects. The grid is a list of rows, which is a list of columns. The column is an object that contains 2 properties:

* ```size``` can be a number in ```1-12``` range. Maps directly to bs ```col-xd-{{size}}```. Notice that you may embed other useful bs classes inside it such as ```3 col-sm-10 col-md-offset-1```...

* ```fields``` contains the list of description objects of that column. **Equal** to a regular ```xvMetaform``` definition object.

Notice that the model for a grid form works the same as for a regular form. So make sure you do not repeat ```id```s. Remember, the grid is only for layout purposes. for separate form with overlapping properties you should use separate forms.

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
