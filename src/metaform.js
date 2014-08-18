'use strict';


var getDefault = function(field) {
	if(field.defaultModel) return field.defaultModel;

	if(field.type == 'text') return '';
	if(field.type == 'bool') return false;
	if(field.type == 'enum') return field.choices[0];
};

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
						.attr('xv-field', 'fields['+i+']')
						.attr('xv-metaform-model', 'model')
					);
				}
				$compile(element.contents())(childrenScope);
			});
		}
	};
}])
.directive('xvField', ['$compile','$templateCache', function($compile, $templateCache) {
	return {
		link: function(scope, element, attrs, ctrl, transcludeFn) {
			var childrenScope;
			var model = scope.$eval(attrs.xvMetaformModel);

			scope.$watchCollection(attrs.xvField, function(field) {
				if(childrenScope) childrenScope.$destroy();

				childrenScope = scope.$new();
				childrenScope.field = field;
				childrenScope.model = scope.$eval(attrs.xvMetaformModel);
				if(!childrenScope.model[field.id])
					childrenScope.model[field.id] = getDefault(field);

				childrenScope.xvSelect = function(item) {
					childrenScope.model[field.id] = item;
				};

				childrenScope.$watch('model[\''+field.id+'\']', function(selected) {
					scope.xvSelected = selected;
				});

				element.empty();

				var newElement = angular.element($templateCache.get(field.type+'-bs.xv'));
				element.replaceWith(newElement);
				$compile(newElement)(childrenScope);
			});
		}
	};
}])
.directive('xvModel', ['$compile', function($compile) {
	return {
		priority: 1000,
		terminal: true,
		link: function(scope, element, attrs) {
			element.removeAttr('xv-model');
			element.attr('data-ng-model', 'model[\''+scope.field.id+'\']');
			$compile(element)(scope);
		}
	};
}]);