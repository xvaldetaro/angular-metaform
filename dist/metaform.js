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
angular.module('xvMetaform').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('array-bs.xv',
    "<div class=\"panel panel-default\" ng-init=\"collapse = true\"><div class=panel-heading ng-click=\"collapse = !collapse\" style=\"cursor: pointer\"><h3 class=panel-title><a>{{field.label}}</a></h3></div><div class=panel-body ng-show=collapse><div class=\"panel panel-default\"><div class=panel-body><xvnew></xvnew><hr><button class=\"btn btn-success\" type=button ng-click=add()>Add {{field.label}}</button></div></div><ul class=list-group><li class=list-group-item ng-repeat=\"(key, item) in model.model\">{{item | json}} <button class=\"btn btn-danger\" type=button ng-click=remove(key)><span class=\"glyphicon glyphicon-remove\"></span></button></li></ul></div></div>"
  );


  $templateCache.put('bool-bs.xv',
    "<div class=checkbox><label><input type=checkbox ng-model=model.model> {{field.label}}</label></div>"
  );


  $templateCache.put('enum-bs.xv',
    "<div class=\"panel panel-default\"><div class=panel-heading><h3 class=panel-title>{{field.label}}</h3></div><div class=panel-body><div class=radio data-ng-repeat=\"choice in field.choices\"><label><input type=radio _xvkey={{choice}} value={{choice}} ng-model=model.model> {{choice}}</label></div></div></div>"
  );


  $templateCache.put('fieldWrapper-bs.xv',
    "<div class=\"col-xs-12 col-md-{{field.colspan}}\"></div>"
  );


  $templateCache.put('groupWrapper-bs.xv',
    "<div class=row></div>"
  );


  $templateCache.put('metaformWrapper-bs.xv',
    "<div class=row></div>"
  );


  $templateCache.put('object-bs.xv',
    "<div class=\"panel panel-default\" ng-init=\"collapse = true\"><div class=panel-heading ng-click=\"collapse = !collapse\" style=\"cursor: pointer\"><h3 class=panel-title><a>{{field.label}}</a></h3></div><div class=panel-body ng-show=collapse><xvnew></xvnew></div></div>"
  );


  $templateCache.put('ref-bs.xv',
    "<div class=\"panel panel-default\"><div class=panel-heading><h3 class=panel-title>{{field.label}}</h3></div><div class=panel-body><div class=\"form-group has-feedback\"><label class=\"control-label sr-only\" for=search{{field._xvKey}}>search{{field._xvKey}}</label><input class=form-control _xvkey=search{{field._xvKey}} ng-model=searchText> <span class=\"glyphicon glyphicon-search form-control-feedback\"></span></div><ul class=list-group><li class=list-group-item ng-class=\"{'list-group-item-success': model.model, 'list-group-item-danger': !model.model}\" ng-bind=\"model.model[field.display] || 'Please select:'\"></li></ul><div class=list-group style=\"max-height: 170px; overflow-y:scroll; border-top: sol_xvKey 1px #dddddd; border-bottom: sol_xvKey 1px #dddddd; border-radius: 3px\"><a class=list-group-item ng-repeat=\"item in field.list | filter:searchText\" ng-click=\"model.model = item\" ng-class=\"{active: item === model.model}\">{{item[field.display]}}</a></div></div></div>"
  );


  $templateCache.put('text-bs.xv',
    "<div class=form-group><label for={{field._xvKey}}>{{field.label}}</label><input ng-model=model.model type={{field.subType}} class=form-control _xvkey={{field._xvKey}}></div>"
  );

}]);
