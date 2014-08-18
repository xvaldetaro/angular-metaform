angular.module('xvMetaform').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('array-bs.xv',
    "<div class=\"panel panel-default\"><div class=panel-heading><h3 class=panel-title>{{field.label}}</h3></div><div class=panel-body><div class=\"panel panel-default\"><div class=panel-body><xvnew></xvnew><hr><button class=\"btn btn-success\" type=button ng-click=add()>Add</button></div></div><ul class=list-group><li class=list-group-item ng-repeat=\"item in model.model\">{{item | json}}</li></ul></div></div>"
  );


  $templateCache.put('bool-bs.xv',
    "<div class=checkbox><label><input type=checkbox ng-model=model.model> {{field.label}}</label></div>"
  );


  $templateCache.put('enum-bs.xv',
    "<div class=\"panel panel-default\"><div class=panel-heading><h3 class=panel-title>{{field.label}}</h3></div><div class=panel-body><div class=radio data-ng-repeat=\"choice in field.choices\"><label><input type=radio id={{choice}} value={{choice}} ng-model=model.model> {{choice}}</label></div></div></div>"
  );


  $templateCache.put('ref-bs.xv',
    "<div class=\"panel panel-default\"><div class=panel-heading><h3 class=panel-title>{{field.label}}</h3></div><div class=panel-body><div class=\"form-group has-feedback\"><label class=\"control-label sr-only\" for=search{{field.id}}>search{{field.id}}</label><input class=form-control id=search{{field.id}} ng-model=searchText> <span class=\"glyphicon glyphicon-search form-control-feedback\"></span></div><ul class=list-group><li class=list-group-item ng-class=\"{'list-group-item-success': model.model, 'list-group-item-danger': !model.model}\" ng-bind=\"model.model[field.display] || 'Please select:'\"></li></ul><div class=list-group style=\"max-height: 170px; overflow-y:scroll; border-top: solid 1px #dddddd; border-bottom: solid 1px #dddddd; border-radius: 3px\"><a class=list-group-item ng-repeat=\"item in field.list | filter:searchText\" ng-click=\"model.model = item\" ng-class=\"{active: item === model.model}\">{{item[field.display]}}</a></div></div></div>"
  );


  $templateCache.put('text-bs.xv',
    "<div class=form-group><label for={{field.id}}>{{field.label}}</label><input ng-model=model.model type={{field.subType}} class=form-control id={{field.id}}></div>"
  );

}]);
