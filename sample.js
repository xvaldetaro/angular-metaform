'use strict';

angular.module('sample', ['xvMetaform']).controller('SampleCtrl', ['$scope', 
function($scope) {
	$scope.test = 'Hello World';
	$scope.form1 = [
		{ id: 'Name', type: 'text', placeholder: 'Your Name' },
		{ id: 'Email', type: 'text', subType: 'email' },
		{ id: 'Color', type: 'text', subType: 'color' },
		{ id: 'Date', type: 'text', subType: 'date' },
		{ id: 'My Boolean', type: 'bool' },
		{ id: 'My Enum', type: 'enum', choices: ['Opt1', 'Opt2', 'AnotherOpt']}
	];
	$scope.grid1 = [
		[ // row 1
			{ // col 1
				size: 7,
				fields: [
					{ id: 'Name', type: 'text', placeholder: 'Your Name' },
					{ id: 'Email', type: 'text', subType: 'email' }
				]
			},{ // Col 2
				size: 3,
				fields: [
					{ id: 'Color', type: 'text', subType: 'color' },
					{ id: 'Date', type: 'text', subType: 'date' }
				]
			}
		],[ // row 2
			{ // col 1
				size: 4,
				fields: [
					{ id: 'My Boolean', type: 'bool' }
				]
			},{ // Col 2
				size: 6,
				fields: [
					{ id: 'My Enum', type: 'enum', choices: ['Opt1', 'Opt2', 'AnotherOpt']}
				]
			}
		]
	];
	$scope.modelGrid = {};
	$scope.model = {
		Name: 'my name'
	};
}]);