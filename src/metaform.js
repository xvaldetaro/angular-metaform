'use strict';

var getDefault = function(field) {
	if(field.defaultModel) return field.defaultModel;

	if(field.nested === 'object') return {};
	if(field.nested) return [];
	if(field.type == 'text') return '';
	if(field.type == 'bool') return false;
	if(field.type == 'enum') return field.choices[0];
};

angular.module('xvMetaform', [])
.directive('xvMetaformGrid', ['$compile', function($compile) {
	return {
		link: function(scope, element, attrs, ctrl, transcludeFn) {
			element.addClass('container-fluid');
			var childrenScope;

			scope.$watchCollection(attrs.xvMetaformGrid, function(grid) {
				if(childrenScope) childrenScope.$destroy();

				childrenScope = scope.$new();
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
							'].fields" xv-metaform-model="'+attrs.xvMetaformModel+
							'" class="col-xs-12 col-md-'+col.size+
							'"></div>'));
					}
				}
				$compile(element.contents())(childrenScope);
			});
		}
	};
}])
.directive('xvMetaform', ['$compile', '$templateCache', function($compile, $templateCache) {
	return {
		replace: true,
		link: function(scope, element, attrs, ctrl, transcludeFn) {
			var childrenScope;
			var properElement = angular.element($templateCache.get('metaformWrapper-bs.xv'));
			element.replaceWith(properElement);

			scope.$watchCollection(attrs.xvMetaform, function(fields) {
				if(childrenScope) childrenScope.$destroy();

				childrenScope = scope.$new();
				childrenScope.fields = fields;
				scope.$watch(attrs.xvMetaformModel, function(model) {
					childrenScope.model = model;
				});
				properElement.empty();

				for(var i = 0; i < fields.length; i++) {
					var field = fields[i];

					if(typeof(field) !== 'object' || !field.id || !field.type)
						throw new Error('xvMetaform fields must be objects with ids and types');

					// Sets defaults
					field.template = field.template || field.type + '-bs.xv';
					field.subType = field.subType || field.type;
					field.placeholder = field.placeholder || field.label;
					field.label = field.label || field.id;
					field.colspan = field.colspan || 12;

					// Appends a new container element with the directive associated
					properElement.append(
						angular.element('<div></div>')
						.attr('xv-field', 'fields['+i+']')
						.attr('xv-metaform-model', 'model')
					);
				}
				$compile(properElement)(childrenScope);
			});
		}
	};
}])
.directive('xvField', ['$compile','$templateCache', '$q', function($compile, $templateCache, $q) {
	return {
		templateUrl: 'fieldWrapper-bs.xv',
		replace: true,
		link: function(scope, element, attrs, ctrl, transcludeFn) {
			var fieldScope;

			var properElement = angular.element($templateCache.get('fieldWrapper-bs.xv'));
			element.replaceWith(properElement);

			var fieldWatch = $q.defer();
			scope.$watchCollection(attrs.xvField, function(field) {
				if(fieldScope) fieldScope.$destroy();

				fieldScope = scope.$new();
				fieldScope.field = field;
				fieldScope.model = {};

				fieldWatch.resolve(field);

				properElement.empty();
				var nestedElement;
				if(field.nested && field.nested !== 'object') {
					fieldScope.newModel = {};

					nestedElement = angular.element($templateCache.get('array-bs.xv'));
					var innerElement;

					if(field.nested === 'array') {
						fieldScope.newField = angular.extend({}, field);
						fieldScope.newField.nested = false;
						fieldScope.newField.label = 'Add new '+fieldScope.newField.label;

						fieldScope.add = function() {
							fieldScope.model.model.push(angular.extend({}, fieldScope.newModel[field.id]));
							fieldScope.newModel = {};
						};

						innerElement = angular.element($templateCache.get('metaformWrapper-bs.xv'));
						innerElement.append('<div xv-field="newField" '+
							'xv-metaform-model="newModel"></div>');

					} else if(field.nested === 'objectArray') {
						fieldScope.add = function() {
							fieldScope.model.model.push(fieldScope.newModel);
							fieldScope.newModel = {};
						};
						innerElement = angular.element('<div xv-metaform="field.type" '+
							'xv-metaform-model="newModel"></div>');
					}

					fieldScope.remove = function(key) {
						fieldScope.model.model.splice(key, 1);
					};

					nestedElement.find('xvnew').replaceWith(innerElement);

				} else if(field.nested === 'object') {
					fieldScope.model.model = {};

					nestedElement = angular.element($templateCache.get('object-bs.xv'));

					var innerElement = angular.element('<div></div>');
					nestedElement.find('xvnew').replaceWith(innerElement);

					innerElement.attr('xv-metaform', 'field.type');
					innerElement.attr('xv-metaform-model', 'model.model');
				} else {
					nestedElement = angular.element($templateCache.get(field.template));
				}

				properElement.append(nestedElement);
				$compile(properElement)(fieldScope);
			});

			var modelWatch = $q.defer();
			fieldWatch.promise.then(function(field){
				scope.$watch(attrs.xvMetaformModel, function(model) {
					if(!model[field.id])
						model[field.id] = getDefault(field);

					modelWatch.resolve(field);
				});
			});

			var modelFieldWatch = $q.defer();
			modelWatch.promise.then(function(field) {
				scope.$watch(attrs.xvMetaformModel+'[\''+field.id+'\']', function(modelField) {
					fieldScope.model.model = modelField;
					modelFieldWatch.resolve(field);
				});
			});

			modelFieldWatch.promise.then(function(field) {
				fieldScope.$watch('model.model', function(fieldModel) {
					scope[attrs.xvMetaformModel][field.id] = fieldModel;
				});
			});
		}
	};
}]);