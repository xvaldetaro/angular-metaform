'use strict';

angular.module('xvMetaform', [])
.provider('xvFieldGen', function() {
	this.defaultTemplateSuffix = '-bs.xv';

	this.$get = ['$interpolate', '$templateCache', function($interpolate, $templateCache) {
		return {
			mix: function(template, context) {
				var temp = $templateCache.get(template+this.templateSuffix);
				var exp = $interpolate(temp);
				return exp(context);
			},
			templateSuffix: this.defaultTemplateSuffix
		};
	}];
})
.directive('xvMetaformGrid', ['$compile', function($compile) {
	return {
		priority: 1000,
		terminal: true,
		link: function(scope, element, attrs, ctrl, transcludeFn) {
			element.addClass('container-fluid');
			var childrenScope;

			scope.$watchCollection(attrs.xvMetaformGrid, function(grid) {
				if(childrenScope) childrenScope.$destroy();

				childrenScope = scope.$new();
				childrenScope.model = scope.$eval(attrs.xvMetaformModel);
				childrenScope.grid = grid;

				element.empty();

				for (var i = 0; i < grid.length; i++) {
					var row = grid[i];

					if(!row.length) throw new Error('Invalid row');

					var rowElement = angular.element('<div class="row"></div>');
					element.append(rowElement);

					for (var j = 0; j < row.length; j++) {
						var col = row[j];
						if(!col.fields || !col.fields.length) throw new Error('Invalid col');

						rowElement.append(angular.element('<div xv-metaform="grid['+i+']['+j+
							'].fields" xv-metaform-model="model" class="col-xs-12 col-md-'+col.size+
							'></div>'));
					}
				}
				$compile(element.contents())(childrenScope);
			});
		}
	};
}])
.directive('xvMetaform', ['$compile', 'xvFieldGen', function($compile, fgen) {
	return {
		link: function(scope, element, attrs, ctrl, transcludeFn) {
			var childrenScope;

			scope.$watchCollection(attrs.xvMetaform, function(fields) {
				if(childrenScope) childrenScope.$destroy();

				childrenScope = scope.$new();
				childrenScope.fields = fields;
				childrenScope.model = scope.$eval(attrs.xvMetaformModel);
				element.empty();

				for(var i = 0; i < fields.length; i++) {
					var field = fields[i];

					if(typeof(field) !== 'object' || !field.id || !field.type)
						throw new Error('xvMetaform fields must be objects with ids and types');

					// Sets defaults
					field.templatePrefix = field.templatePrefix || field.type;
					field.subType = field.subType || field.type;
					field.label = field.label || field.id;
					field.placeholder = field.placeholder || field.label;

					// Directive type defaults to field type
					var directiveType = field.directiveType || field.type;

					// Appends a new container element with the directive associated
					element.append(
						angular.element('<div></div>')
						.attr('xv-'+directiveType+'-field', 'fields['+i+']')
						.attr('xv-metaform-model', 'model')
					);
				}
				$compile(element.contents())(childrenScope);
			});
		}
	};
}])
.directive('xvTextField', ['$compile','xvFieldGen', function($compile, fgen) {
	return {
		link: function(scope, element, attrs, ctrl, transcludeFn) {
			var childrenScope;

			scope.$watchCollection(attrs.xvTextField, function(field) {
				if(childrenScope) childrenScope.$destroy();

				childrenScope = scope.$new();
				childrenScope.field = field;
				childrenScope.model = scope.$eval(attrs.xvMetaformModel);
				element.empty();

				var newElement = angular.element(fgen.mix(field.templatePrefix, field));
				element.replaceWith(newElement);
				$compile(newElement)(childrenScope);
			});
		}
	};
}])
.directive('xvBoolField', ['$compile','xvFieldGen', function($compile, fgen) {
	return {
		link: function(scope, element, attrs, ctrl, transcludeFn) {
			var index = attrs.xvBoolField;
			var field = scope.form[index];
			
			if(!scope.model[field.id]) {
				scope.model[field.id] = field.defaultModel || false;
			}
			element.append(fgen.mix(field.templatePrefix, field));
			$compile(element.contents())(scope);
		}
	};
}])
.directive('xvEnumField', ['$compile','xvFieldGen', function($compile, fgen) {
	return {
		link: function(scope, element, attrs, ctrl, transcludeFn) {
			var index = attrs.xvEnumField;
			var field = scope.form[index];
			var choices = field.choices;
			
			if(!scope.model[field.id]) {
				scope.model[field.id] = field.defaultModel || choices[0];
			}

			var context = angular.extend({}, field);			
			for(var i = 0; i < choices.length; i++) {
				context.value = choices[i];
				element.append(fgen.mix(field.templatePrefix, context));
			}
			$compile(element.contents())(scope);
		}
	};
}])
.directive('xvRefField', ['$compile','xvFieldGen', function($compile, fgen) {
	return {
		link: function(scope, element, attrs, ctrl, transcludeFn) {
			var index = attrs.xvRefField;
			var field = scope.form[index];

			var newElement = angular.element(fgen.mix(field.templatePrefix, field));
			element.replaceWith(newElement);
			$compile(newElement)(scope);
		}
	};
}]);
angular.module('xvMetaform').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('bool-bs.xv',
    "<div class=checkbox><label><input type=checkbox data-ng-model=\"model['{{id}}']\"> {{label}}</label></div>"
  );


  $templateCache.put('enum-bs.xv',
    "<div class=radio><label><input type=radio id={{value}} value={{value}} data-ng-model=\"model['{{id}}']\"> {{value}}</label></div>"
  );


  $templateCache.put('text-bs.xv',
    "<div class=form-group><label for={{id}}>{{label}}</label><input data-ng-model=\"model['{{id}}']\" type={{subType}} class=form-control id={{id}}></div>"
  );

}]);
