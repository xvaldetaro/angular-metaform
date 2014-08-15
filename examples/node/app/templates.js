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
