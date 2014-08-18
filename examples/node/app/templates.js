angular.module('xvMetaform').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('bool-bs.xv',
    "<div class=checkbox><label><input type=checkbox xv-model> {{field.label}}</label></div>"
  );


  $templateCache.put('enum-bs.xv',
    "<div class=\"panel panel-default\"><div class=panel-heading><h3 class=panel-title>{{field.label}}</h3></div><div class=panel-body><div class=radio data-ng-repeat=\"choice in field.choices\"><label><input type=radio id={{choice}} value={{choice}} xv-model> {{choice}}</label></div></div></div>"
  );


  $templateCache.put('enumOption-bs.xv',
    "<div class=radio><label><input type=radio id={{field.value}} value={{value}} data-ng-model=\"model['{{id}}']\"> {{field.value}}</label></div>"
  );


  $templateCache.put('ref-bs.xv',
    "<div class=\"panel panel-default\"><div class=panel-heading><h3 class=panel-title>{{field.label}}</h3></div><div class=panel-body><div class=\"form-group has-feedback\"><label class=\"control-label sr-only\" for=search{{field.id}}>search{{field.id}}</label><input class=form-control id=search{{field.id}} ng-model=searchText> <span class=\"glyphicon glyphicon-search form-control-feedback\"></span></div><ul class=list-group><li class=list-group-item ng-class=\"{'list-group-item-success': xvSelected, 'list-group-item-danger': !xvSelected}\" ng-bind=\"xvSelected[field.display] || 'Please select:'\"></li></ul><div class=list-group style=\"max-height: 170px; overflow-y:scroll; border-top: solid 1px #dddddd; border-bottom: solid 1px #dddddd; border-radius: 3px\"><a class=list-group-item ng-repeat=\"item in field.list | filter:searchText\" ng-click=xvSelect(item) ng-class=\"{active: item == xvSelected}\">{{item[field.display]}}</a></div></div></div>"
  );


  $templateCache.put('text-bs.xv',
    "<div class=form-group><label for={{field.id}}>{{field.label}}</label><input xv-model type={{field.subType}} class=form-control id={{field.id}}></div>"
  );

}]);
