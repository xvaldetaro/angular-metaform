'use strict';

angular.module('sample', ['xvMetaform']).controller('SampleCtrl', ['$scope', 
function($scope) {
	$scope.test = 'Hello World';
	$scope.form1 = [
		{ _xvKey: 'Name', type: 'text', placeholder: 'Your Name' },
		{ _xvKey: 'Email', type: 'text', subType: 'email' },
		{ _xvKey: 'Color', type: 'text', subType: 'color' },
		{ _xvKey: 'Date', type: 'text', subType: 'date' },
		{ _xvKey: 'My Boolean', type: 'bool' },
		{ _xvKey: 'My Enum', type: 'enum', choices: ['Opt1', 'Opt2', 'AnotherOpt']},
		{
			_xvKey: 'Friend',
			type: 'ref',
			select: '_id',
			display: 'name',
			list: [
				{ _id: '1', name: 'Jose'},
				{ _id: '2', name: 'Alex'},
				{ _id: '3', name: 'Aegon'},
				{ _id: '4', name: 'Jurema'},
				{ _id: '5', name: 'Pele'}
			] 
		},
		{
			_xvKey: 'Items',
			nested: 'objectArray',
			type: [
				{ _xvKey: 'Name', type: 'text', placeholder: 'Your Name' },
				{ _xvKey: 'owner', type: 'text' },
				{
					_xvKey: 'Feats',
					nested: 'array',
					type: 'ref',
					display: 'name',
					list: [
						{ _id: '1', name: 'Jose'},
						{ _id: '2', name: 'Alex'},
						{ _id: '3', name: 'Aegon'},
						{ _id: '4', name: 'Jurema'},
						{ _id: '5', name: 'Pele'}
					] 
				},
				{
					_xvKey: 'Attributes',
					nested: 'object',
					colspan: 3,
					type: [
						{ _xvKey: 'STR', type: 'text', subType: 'number' },
						{ _xvKey: 'DEX', type: 'text', subType: 'number' },
						{ _xvKey: 'CON', type: 'text', subType: 'number' }
					]
				}
			]
		}
	];
	$scope.newModel = function() {
		$scope.model = {};
	};
	$scope.newName = function() {
		$scope.model.Items = [];
	};
	$scope.gr_xvKey1 = [
		[ // row 1
			{ // col 1
				size: 7,
				fields: [
					{ _xvKey: 'Name', type: 'text', placeholder: 'Your Name' },
					{ _xvKey: 'Email', type: 'text', subType: 'email' }
				]
			},{ // Col 2
				size: 3,
				fields: [
					{ _xvKey: 'Color', type: 'text', subType: 'color' },
					{ _xvKey: 'Date', type: 'text', subType: 'date' }
				]
			}
		],[ // row 2
			{ // col 1
				size: 4,
				fields: [
					{ _xvKey: 'My Boolean', type: 'bool' }
				]
			},{ // Col 2
				size: 6,
				fields: [
					{ _xvKey: 'My Enum', type: 'enum', choices: ['Opt1', 'Opt2', 'AnotherOpt']}
				]
			}
		]
	];
	$scope.modelGr_xvKey = {};
	$scope.model = {
		Name: 'my name'
	};
}]);