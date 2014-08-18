'use strict';

var getDefault = function(field) {
	if(field.defaultModel) return field.defaultModel;

	if(field.nested === 'object') return {};
	if(field.nested) return [];
	if(field.type === 'text') return '';
	if(field.type === 'bool') return false;
	if(field.type === 'enum') return field.choices[0];
};

angular.module('xvMetaform', [])
.directive('xvMetaformGr_xvKey', ['$compile', function($compile) {
	return {
		link: function(scope, element, attrs, ctrl, transcludeFn) {
			element.addClass('container-flu_xvKey');
			var childrenScope;

			scope.$watchCollection(attrs.xvMetaformGr_xvKey, function(gr_xvKey) {
				if(childrenScope) childrenScope.$destroy();

				childrenScope = scope.$new();
				childrenScope.gr_xvKey = gr_xvKey;

				element.empty();

				for (var i = 0; i < gr_xvKey.length; i++) {
					var row = gr_xvKey[i];

					if(!row.length) throw new Error('Inval_xvKey row');

					var rowElement = angular.element('<div class="row"></div>');
					element.append(rowElement);

					for (var j = 0; j < row.length; j++) {
						var col = row[j];
						if(!col.fields || !col.fields.length) throw new Error('Inval_xvKey col');

						rowElement.append(angular.element('<div xv-metaform="gr_xvKey['+i+']['+j+
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

					if(typeof(field) !== 'object' || !field._xvKey || !field.type)
						throw new Error('xvMetaform fields must be objects with _xvKeys and types');

					// Sets defaults
					field.template = field.template || field.type + '-bs.xv';
					field.subType = field.subType || field.type;
					field.placeholder = field.placeholder || field.label;
					field.label = field.label || field._xvKey;
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
				var innerElement;
				if(field.nested && field.nested !== 'object') {
					fieldScope.newModel = {};

					nestedElement = angular.element($templateCache.get('array-bs.xv'));

					if(field.nested === 'array') {
						fieldScope.newField = angular.extend({}, field);
						fieldScope.newField.nested = false;
						fieldScope.newField.label = 'Add new '+fieldScope.newField.label;

						fieldScope.add = function() {
							fieldScope.model.model.push(angular.extend({}, fieldScope.newModel[field._xvKey]));
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

					innerElement = angular.element('<div></div>');
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
					if(!model[field._xvKey])
						model[field._xvKey] = getDefault(field);

					modelWatch.resolve(field);
				});
			});

			var modelFieldWatch = $q.defer();
			modelWatch.promise.then(function(field) {
				scope.$watch(attrs.xvMetaformModel+'[\''+field._xvKey+'\']', function(modelField) {
					fieldScope.model.model = modelField;
					modelFieldWatch.resolve(field);
				});
			});

			modelFieldWatch.promise.then(function(field) {
				fieldScope.$watch('model.model', function(fieldModel) {
					scope[attrs.xvMetaformModel][field._xvKey] = fieldModel;
				});
			});
		}
	};
}]);