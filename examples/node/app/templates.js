angular.module('xvMetaform').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('array-bs.xv',
<<<<<<< HEAD
    "<div class=\"panel panel-default\" ng-init=\"collapse = false\"><div class=panel-heading ng-click=\"collapse = !collapse\" style=\"cursor: pointer\"><h3 class=panel-title><a>{{field.label}}</a></h3></div><div class=panel-body ng-show=collapse><div class=\"panel panel-default\"><div class=panel-body><xvnew></xvnew><hr><button class=\"btn btn-success\" type=button ng-click=add()>Add {{field.label}}</button></div></div><ul class=list-group><li class=list-group-item ng-repeat=\"item in model.model\">{{item | json}}</li></ul></div></div>"
=======
    "<div class=\"panel panel-default\"><div class=panel-heading><h3 class=panel-title>{{field.label}}</h3></div><div class=panel-body><div class=\"panel panel-default\"><div class=panel-body><xvnew></xvnew><hr><button class=\"btn btn-success\" type=button ng-click=add()>Add</button></div></div><div ng-repeat=\"item in items\">{{item | json}}</div></div></div>"
>>>>>>> bef992465156c6fd0d4af20e57d6473aa24e6a41
  );


  $templateCache.put('bool-bs.xv',
    "<div class=checkbox><label><input type=checkbox ng-model=model.model> {{field.label}}</label></div>"
  );


  $templateCache.put('enum-bs.xv',
    "<div class=\"panel panel-default\"><div class=panel-heading><h3 class=panel-title>{{field.label}}</h3></div><div class=panel-body><div class=radio data-ng-repeat=\"choice in field.choices\"><label><input type=radio id={{choice}} value={{choice}} ng-model=model.model> {{choice}}</label></div></div></div>"
<<<<<<< HEAD
  );


  $templateCache.put('fieldWrapper-bs.xv',
    "<div class=\"col-xs-12 col-md-{{field.colspan}}\"></div>"
  );


  $templateCache.put('metaformWrapper-bs.xv',
    "<div class=row></div>"
  );


  $templateCache.put('object-bs.xv',
    "<div class=\"panel panel-default\" ng-init=\"collapse = false\"><div class=panel-heading ng-click=\"collapse = !collapse\" style=\"cursor: pointer\"><h3 class=panel-title><a>{{field.label}}</a></h3></div><div class=panel-body ng-show=collapse><xvnew></xvnew></div></div>"
=======
>>>>>>> bef992465156c6fd0d4af20e57d6473aa24e6a41
  );


  $templateCache.put('ref-bs.xv',
<<<<<<< HEAD
    "<div class=\"panel panel-default\"><div class=panel-heading><h3 class=panel-title>{{field.label}}</h3></div><div class=panel-body><div class=\"form-group has-feedback\"><label class=\"control-label sr-only\" for=search{{field.id}}>search{{field.id}}</label><input class=form-control id=search{{field.id}} ng-model=searchText> <span class=\"glyphicon glyphicon-search form-control-feedback\"></span></div><ul class=list-group><li class=list-group-item ng-class=\"{'list-group-item-success': model.model, 'list-group-item-danger': !model.model}\" ng-bind=\"model.model[field.display] || 'Please select:'\"></li></ul><div class=list-group style=\"max-height: 170px; overflow-y:scroll; border-top: solid 1px #dddddd; border-bottom: solid 1px #dddddd; border-radius: 3px\"><a class=list-group-item ng-repeat=\"item in field.list | filter:searchText\" ng-click=\"model.model = item\" ng-class=\"{active: item === model.model}\">{{item[field.display]}}</a></div></div></div>"
=======
    "<div class=\"panel panel-default\"><div class=panel-heading><h3 class=panel-title>{{field.label}}</h3></div><div class=panel-body><div class=\"form-group has-feedback\"><label class=\"control-label sr-only\" for=search{{field.id}}>search{{field.id}}</label><input class=form-control id=search{{field.id}} ng-model=searchText> <span class=\"glyphicon glyphicon-search form-control-feedback\"></span></div><ul class=list-group><li class=list-group-item ng-class=\"{'list-group-item-success': xvSelected, 'list-group-item-danger': !xvSelected}\" ng-bind=\"xvSelected[field.display] || 'Please select:'\"></li></ul><div class=list-group style=\"max-height: 170px; overflow-y:scroll; border-top: solid 1px #dddddd; border-bottom: solid 1px #dddddd; border-radius: 3px\"><a class=list-group-item ng-repeat=\"item in field.list | filter:searchText\" ng-click=\"model.model = item\" ng-class=\"{active: item === model.model}\">{{item[field.display]}}</a></div></div></div>"
>>>>>>> bef992465156c6fd0d4af20e57d6473aa24e6a41
  );


  $templateCache.put('text-bs.xv',
    "<div class=form-group><label for={{field.id}}>{{field.label}}</label><input ng-model=model.model type={{field.subType}} class=form-control id={{field.id}}></div>"
  );

}]);
