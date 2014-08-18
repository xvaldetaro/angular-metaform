'use strict';

angular.module('sample', ['xvMetaform']).controller('SampleCtrl', ['$scope', 
function($scope) {
	$scope.test = 'Hello World';
	$scope.form1 = [
		// { id: 'Name', type: 'text', placeholder: 'Your Name' },
		// { id: 'Email', type: 'text', subType: 'email' },
		// { id: 'Color', type: 'text', subType: 'color' },
		// { id: 'Date', type: 'text', subType: 'date' },
		// { id: 'My Boolean', type: 'bool' },
		// { id: 'My Enum', type: 'enum', choices: ['Opt1', 'Opt2', 'AnotherOpt']},
		// {
		// 	id: 'Friend',
		// 	type: 'ref',
		// 	select: '_id',
		// 	display: 'name',
		// 	list: [
		// 		{ _id: '1', name: 'Jose'},
		// 		{ _id: '2', name: 'Alex'},
		// 		{ _id: '3', name: 'Aegon'},
		// 		{ _id: '4', name: 'Jurema'},
		// 		{ _id: '5', name: 'Pele'}
		// 	] 
		// }
		{
			id: 'Languages',
			array: true,
			type: 'text'
		}
		//,{
		// 	id: 'Feats',
		// 	array: true,
		// 	type: 'ref',
		// 	display: 'name',
		// 	list: [
		// 		{ _id: '1', name: 'Jose'},
		// 		{ _id: '2', name: 'Alex'},
		// 		{ _id: '3', name: 'Aegon'},
		// 		{ _id: '4', name: 'Jurema'},
		// 		{ _id: '5', name: 'Pele'}
		// 	] 
		// },
		// {
		// 	id: 'Items',
		// 	array: 'object',
		// 	type: [
		// 		{ id: 'Name', type: 'text', placeholder: 'Your Name' },
		// 		{ id: 'Email', type: 'text', subType: 'email' }
		// 	]
		// }
	];
	$scope.newModel = function() {
		$scope.modelGrid = {};
	};
	$scope.newName = function() {
		$scope.modelGrid.Name = 'newname';
	};
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