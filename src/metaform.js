'use strict';

var getDefault = function(field) {
	if(field.defaultModel) return field.defaultModel;

	if(field.array) return [];
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
.directive('xvMetaform', ['$compile', function($compile) {
	return {
		link: function(scope, element, attrs, ctrl, transcludeFn) {
			var childrenScope;

			scope.$watchCollection(attrs.xvMetaform, function(fields) {
				if(childrenScope) childrenScope.$destroy();

				childrenScope = scope.$new();
				childrenScope.fields = fields;
				scope.$watch(attrs.xvMetaformModel, function(model) {
					childrenScope.model = model;
				});
				element.empty();

				for(var i = 0; i < fields.length; i++) {
					var field = fields[i];

					if(typeof(field) !== 'object' || !field.id || !field.type)
						throw new Error('xvMetaform fields must be objects with ids and types');

					if(field.array) {
						field.arrayTemplatePrefix = 'array';
					} 

					// Sets defaults
					field.templatePrefix = field.templatePrefix || field.type;
					field.subType = field.subType || field.type;
					field.placeholder = field.placeholder || field.label;
					field.label = field.label || field.id;

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
.directive('xvField', ['$compile','$templateCache', '$q', function($compile, $templateCache, $q) {
	return {
		link: function(scope, element, attrs, ctrl, transcludeFn) {
			var fieldScope;

			var fieldWatch = $q.defer();
			scope.$watchCollection(attrs.xvField, function(field) {
				if(fieldScope) fieldScope.$destroy();

				fieldScope = scope.$new();
				fieldScope.field = field;
				fieldScope.model = {};

				fieldWatch.resolve(field);

				element.empty();
				var newElement;
				if(field.array) {
					fieldScope.newModel = {};

					newElement = angular.element($templateCache.get(field.arrayTemplatePrefix+'-bs.xv'));
					var addElement = angular.element('<div></div>');
					newElement.find('xvnew').replaceWith(addElement);
					addElement.attr('xv-metaform-model', 'newModel');

					if(field.array === true) {
						fieldScope.newField = angular.extend({}, field);
						fieldScope.newField.array = false;
						fieldScope.newField.label = 'Add new '+fieldScope.newField.label;

						fieldScope.add = function() {
							fieldScope.model.model.push(fieldScope.newModel[field.id]);
							fieldScope.newModel = {};
						};

						addElement.attr('xv-field', 'newField');
					} else if(field.array === 'object') {
						fieldScope.add = function() {
							fieldScope.model.model.push(fieldScope.newModel);
							fieldScope.newModel = {};
						};

						addElement.attr('xv-metaform', 'field.type');
					}

				} else {
					newElement = angular.element($templateCache.get(field.templatePrefix+'-bs.xv'));
				}

				element.replaceWith(newElement);
				$compile(newElement)(fieldScope);
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