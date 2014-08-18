'use strict';

angular.module('sample', ['xvMetaform']).controller('SampleCtrl', ['$scope', 
function($scope) {
	$scope.test = 'Hello World';
	$scope.form1 = [
		{ _xvKey: 'Name', type: 'text', placeholder: 'Character Name', colspan: 9 },
		{ _xvKey: 'Player Character', type: 'bool', colspan: 3 },
		{
			_xvKey: 'Attributes',
			nested: 'object',
			colspan: 4,
			type: [
				{ _xvKey: 'STR', type: 'text', subType: 'number' },
				{ _xvKey: 'DEX', type: 'text', subType: 'number' },
				{ _xvKey: 'CON', type: 'text', subType: 'number' },
				{ _xvKey: 'WIS', type: 'text', subType: 'number' },
				{ _xvKey: 'INT', type: 'text', subType: 'number' },
				{ _xvKey: 'CHA', type: 'text', subType: 'number' }
			]
		},
		{ _xvKey: 'Race', type: 'enum', choices: ['Human', 'Elf', 'Dwarf'], colspan: 4 },
		{
			_xvKey: 'Class',
			type: 'ref',
			select: '_id',
			display: 'name',
			colspan: 5,
			list: [
				{ _id: '1', name: 'Barbarian'},
				{ _id: '2', name: 'Cleric'},
				{ _id: '3', name: 'Druid'},
				{ _id: '4', name: 'Fighter'},
				{ _id: '5', name: 'Rogue'},
				{ _id: '6', name: 'Wizard'}
			] 
		},
		{
			_xvKey: 'Items',
			nested: 'objectArray',
			type: [
				{ _xvKey: 'Type', type: 'enum', choices: ['Weapon', 'Armor', 'Wearable', 'Consummable'] },
				{ _xvKey: 'Name', type: 'text', placeholder: 'Character Name' },
			]
		},
		{
			_xvKey: 'Feats',
			nested: 'array',
			type: 'ref',
			display: 'name',
			list: [
				{ _id: '1', name: 'Improved Initiative'},
				{ _id: '2', name: 'Combat Casting'},
				{ _id: '3', name: 'Weapon Focus'},
				{ _id: '4', name: 'Point Blank Shot'},
				{ _id: '5', name: 'Dodge'}
			] 
		},
	];

	$scope.model = {};

	$scope.newModel = function() {
		$scope.model = {};
	};
}]);