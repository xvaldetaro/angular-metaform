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
		scope: { formGrid: '=xvMetaformGrid', model: '=xvMetaformModel' },
		controller: ['$scope', function($scope) {
			this.getFormOnGrid = function(row, col) {
				return $scope.formGrid[parseInt(row)][parseInt(col)].fields;
			};

			this.model = $scope.model;
		}],
		link: function(scope, element, attrs, ctrl, transcludeFn) {
			element.addClass('container-fluid');
			var grid = scope.formGrid;
			var childrenScope;

			scope.$watchCollection('formGrid', function(formGrid) {
				if(childrenScope) childrenScope.$destroy();

				childrenScope = scope.$new();

				element.empty();

				for (var i = 0; i < grid.length; i++) {
					var row = grid[i];

					if(!row.length) throw new Error('Invalid row');

					var rowElement = angular.element('<div class="row"></div>');
					element.append(rowElement);

					for (var j = 0; j < row.length; j++) {
						var col = row[j];
						if(!col.fields || !col.fields.length) throw new Error('Invalid col');

						rowElement.append(angular.element('<div xv-metaform class="col-xs-12 col-md-'+col.size+
							'" xv-col="'+j+'" xv-row="'+i+'"></div>'));
					}
				}
				$compile(element.contents())(childrenScope);
			});
		}
	};
}])
.directive('xvMetaform', ['$compile', 'xvFieldGen', function($compile, fgen) {
	return {
		restrict: 'AE',
		require: '^?xvMetaformGrid',
		scope: { xvMetaform: '=', xvMetaformModel: '=xvMetaformModel', col: '@xvCol', row: '@xvRow' },
		link: function(scope, element, attrs, ctrl, transcludeFn) {
			var childrenScope;

			// Get the variables either from a parent xvMetaformGrid or from the view ctrl
			scope.form = scope.xvMetaform;
			scope.model = scope.xvMetaformModel;
			if(ctrl) {
				scope.form = ctrl.getFormOnGrid(scope.row, scope.col);
				scope.model = ctrl.model;
			}

			scope.$watchCollection('form', function(fields) {
				if(childrenScope) childrenScope.$destroy();

				childrenScope = scope.$new();

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
						.attr('xv-'+directiveType+'-field', i)
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
			var index = attrs.xvTextField;
			var field = scope.form[index];

			var newElement = angular.element(fgen.mix(field.templatePrefix, field));
			element.replaceWith(newElement);
			$compile(newElement)(scope);
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
}]);