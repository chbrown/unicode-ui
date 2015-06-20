/// <reference path="type_declarations/index.d.ts" />
import * as unorm from 'unorm';
import {VNode} from 'virtual-dom';
import h = require('virtual-dom/h');
import create = require('virtual-dom/create-element');
import diff = require('virtual-dom/diff');
import patch = require('virtual-dom/patch');

// import * as unidata from 'unidata';
import unidata = require('unidata');

const log = console.log.bind(console);

function isEmpty(val: any): boolean {
  return (val === undefined) || (val === null) || (val === '');
}

function getCharCodes(str: string): number[] {
  var charCodes = [];
  for (var i = 0; i < str.length; i++) {
    charCodes[i] = str.charCodeAt(i);
  }
  return charCodes;
}

var app = angular.module('app', [
  'ui.router',
  'ngStorage',
  'misc-js/angular-plugins',
]);

function clean(object) {
  if (object === null || object === undefined) {
    return object;
  }
  if (typeof object.toJSON === 'function') {
    return object.toJSON();
  }
  return angular.copy(object);
}

app.config(($stateProvider, $urlRouterProvider) => {
  $urlRouterProvider.otherwise(($injector, $location) => {
    log('otherwise: coming from "%s"', $location.url());
    return '/characters?start=32&end=255&limit=200';
  });

  $stateProvider
  .state('characters', {
    url: '/characters?{start:int}&{end:int}&name&cat&{limit:int}',
    templateUrl: 'templates/characters.html',
    controller: 'charactersCtrl',
  })
  .state('string', {
    url: '/string?input',
    templateUrl: 'templates/string.html',
    controller: 'stringCtrl',
  });
});

app.directive('virtual', () => {
  return {
    restrict: 'E',
    scope: {
      value: '=',
      name: '@',
    },
    link: (scope, el) => {
      var element: Element;
      var vtree: VNode;
      var renderFunction: (value: any) => VNode;
      if (scope['name'] == 'UcdTable') {
        renderFunction = renderUcdTable;
      }
      else if (scope['name'] == 'CharCodesTable') {
        renderFunction = renderCharCodesTable;
      }
      else {
        throw new Error(`Cannot find render function: "${scope['name']}"`);
      }

      function update(value) {
        if (vtree === undefined) {
          vtree = renderFunction(value);
          element = create(vtree)
          // attach to the dom on the first draw
          el[0].appendChild(element);
        }
        else {
          var new_vtree = renderFunction(value);
          var patches = diff(vtree, new_vtree)
          element = patch(element, patches)
          vtree = new_vtree;
        }
      }

      scope.$watch('value', (value) => {
        if (value) {
          update(clean(value));
        }
      }, true);
    }
  };
});

interface Params {
  start: number;
  end: number;
  name: string;
  cat: string;
  limit: number;
}

const characters: unidata.Character[] = unidata.getCharacters();
const blocks: unidata.Block[] = unidata.getBlocks();

app.controller('charactersCtrl', ($scope, $http, $q, $state) => {
  var params: Params = $scope.params = angular.copy($state.params);

  $scope.GeneralCategories = GeneralCategories;
  $scope.blocks = blocks;

  var selectedBlocks = blocks.filter(block => block.startCode == params.start && block.endCode == params.end);
  if (selectedBlocks.length == 1) {
    $scope.selectedBlock = selectedBlocks[0];
  }

  var refresh = $scope.refresh = () => {
    log('refresh params', params);
    // search through all 27,268 characters
    var ignore_start = typeof params.start !== 'number';
    var ignore_end = typeof params.end !== 'number';
    var ignore_name = isEmpty(params.name);
    var ignore_cat = isEmpty(params.cat);
    var matchingCharacters = characters.filter(character => {
      var after_start = ignore_start || (character.code >= params.start);
      var before_end = ignore_end || (character.code <= params.end);
      var name_matches = ignore_name || (character.name.indexOf(params.name) > -1);
      var cat_matches = ignore_cat || ((character.cat || 'L') === params.cat);
      return after_start && before_end && name_matches && cat_matches;
    });
    $scope.totalMatchingCharacters = matchingCharacters.length;
    $scope.limitedMatchingCharacters = matchingCharacters.slice(0, params.limit || 256)
  }

  $scope.$watch('params', (params: Params) => {
    log('params changed', params);
    $state.go('.', params, {notify: false});
    refresh();
  }, true);
});

/**
From pdfi
*/

/**
modifiers modify the character after them.
combiners modify the character before them.
*/
var modifier_to_combiner = {
  "\u02C7": "\u030C", // CARON -> COMBINING CARON
  "\u02DB": "\u0328", // OGONEK -> COMBINING OGONEK
  "\u02CA": "\u0301", // MODIFIER LETTER ACUTE ACCENT -> COMBINING ACUTE ACCENT
  "\u02CB": "\u0300", // MODIFIER LETTER GRAVE ACCENT -> COMBINING GRAVE ACCENT
  "\u02C6": "\u0302", // MODIFIER LETTER CIRCUMFLEX ACCENT -> COMBINING CIRCUMFLEX ACCENT
};
/**
These are all the Modifier_Symbol with character codes less than 1000 that have
decompositions. I think these are the ones that we can assume are supposed to
combine with the following character.

The unicode names in the comment after each mapping pair are the key's name.
*/
var decomposable_modifiers = {
  '\u00A8': '\u0308', // DIAERESIS
  '\u00AF': '\u0304', // MACRON
  '\u00B4': '\u0301', // ACUTE ACCENT
  '\u00B8': '\u0327', // CEDILLA
  '\u02D8': '\u0306', // BREVE -> COMBINING BREVE
  '\u02D9': '\u0307', // DOT ABOVE
  '\u02DA': '\u030A', // RING ABOVE
  '\u02DB': '\u0328', // OGONEK
  '\u02DC': '\u0303', // SMALL TILDE
  '\u02DD': '\u030B', // DOUBLE ACUTE ACCENT -> COMBINING DOUBLE ACUTE ACCENT
};
export function normalize(raw: string): string {
  // remove all character codes 0 through 31 (space is 32 == 0x1F)
  var visible = raw.replace(/[\x00-\x1F]/g, '');
  // 2. replace combining characters that are currently combining with a space
  // by the lone combiner so that they'll combine with the following character
  // instead, as intended.
  var decompositions_applied = visible.replace(/[\u00A8\u00AF\u00B4\u00B8\u02D8-\u02DD]/g, (modifier) => {
    log('Success! replacing "%s" with "%s"', modifier, decomposable_modifiers[modifier]);
    return decomposable_modifiers[modifier];
  });
  // 1. replace (modifier, letter) pairs with a single modified-letter character
  //    688 - 767
  var modifiers_applied = decompositions_applied.replace(/([\u02B0-\u02FF])(.)/g, (m0, modifier, modified) => {
    if (modifier in modifier_to_combiner) {
      return modified + modifier_to_combiner[modifier];
    }
    return modifier + modified;
  });

  // and replacing the combining character pairs with precombined characters where possible
  // var canonical = unorm.nfc(normalized);
  return modifiers_applied;
}

function applyNormalization(form: string, input: string): string {
  if (form == 'Original') {
    return input;
  }
  else if (form == 'Custom') {
    return normalize(input);
  }
  else {
    return unorm[form.toLowerCase()](input);
  }
}

app.controller('stringCtrl', ($scope, $http, $state) => {
  var normalizations = ['Original', 'Custom', 'NFC', 'NFD', 'NFKC', 'NFKD'];
  $scope.input = $state.params.input || '';

  $scope.$watch('input', input => {
    $state.go('.', {input: input}, {notify: false});

    $scope.normalizations = normalizations.map(form => {
      var normalized = applyNormalization(form, input);
      return {
        form: form,
        string: normalized,
        charCodes: getCharCodes(normalized),
      };
    });
  })
});

var GeneralCategories = {
  "Lu": "Uppercase_Letter",
  "Ll": "Lowercase_Letter",
  "Lt": "Titlecase_Letter",
  "LC": "Cased_Letter",
  "Lm": "Modifier_Letter",
  "Lo": "Other_Letter",
  "L": "Letter",
  "Mn": "Nonspacing_Mark",
  "Mc": "Spacing_Mark",
  "Me": "Enclosing_Mark",
  "M": "Mark",
  "Nd": "Decimal_Number",
  "Nl": "Letter_Number",
  "No": "Other_Number",
  "N": "Number",
  "Pc": "Connector_Punctuation",
  "Pd": "Dash_Punctuation",
  "Ps": "Open_Punctuation",
  "Pe": "Close_Punctuation",
  "Pi": "Initial_Punctuation",
  "Pf": "Final_Punctuation",
  "Po": "Other_Punctuation",
  "P": "Punctuation",
  "Sm": "Math_Symbol",
  "Sc": "Currency_Symbol",
  "Sk": "Modifier_Symbol",
  "So": "Other_Symbol",
  "S": "Symbol",
  "Zs": "Space_Separator",
  "Zl": "Line_Separator",
  "Zp": "Paragraph_Separator",
  "Z": "Separator",
  "Cc": "Control",
  "Cf": "Format",
  "Cs": "Surrogate",
  "Co": "Private_Use",
  "Cn": "Unassigned",
  "C": "Other"
};

var CombiningClass = {
  0: "Not_Reordered",
  1: "Overlay",
  7: "Nukta",
  8: "Kana_Voicing",
  9: "Virama",
  10: "Ccc10",
  // C"cc[11..199] = [11..199], // Fixed position classe"s
  200: "Attached_Below_Left",
  202: "Attached_Below",
  204: "Marks_attached_at_the_bottom_right",
  208: "Marks_attached_to_the_left",
  210: "Marks_attached_to_the_right",
  212: "Marks_attached_at_the_top_left",
  214: "Attached_Above",
  216: "Attached_Above_Right",
  218: "Below_Left",
  220: "Below",
  222: "Below_Right",
  224: "Left",
  226: "Right",
  228: "Above_Left",
  230: "Above",
  232: "Above_Right",
  233: "Double_Below",
  234: "Double_Above",
  240: "Iota_Subscript",
};

function renderUcdTable(characters: unidata.Character[]): VNode {
  var rows = characters.map(character => {
    return h('tr', [
      h('td.num', character.code.toString()),
      h('td.num', character.code.toString(16).toUpperCase()),
      h('td.num', character.code.toString(8)),
      h('td.str', String.fromCharCode(character.code)),
      h('td', character.name),
      h('td', GeneralCategories[character.cat]),
      h('td', CombiningClass[character.comb]),
      h('td', [character.decompType, ' ', (character.decomp || []).map(code => '0x' + code.toString(16)).join(' ')]),
      h('td[title=NumberValue]', character.num),
      h('td[title=Uppercase]', String.fromCharCode(character.upper)),
      h('td[title=Lowercase]', String.fromCharCode(character.lower)),
      h('td[title=Titlecase]', String.fromCharCode(character.title)),
    ]);
  });

  return h('table.characters.fill.padded.lined.striped', [
    h('thead', [
      h('tr', [
        h('th', 'dec'),
        h('th', 'hex'),
        h('th', 'oct'),
        h('th', 'Character'),
        h('th', 'Name'),
        h('th', 'GeneralCategory'),
        h('th', 'CombiningClass'),
        h('th', 'Decomposition'),
        h('th[title=NumberValue]', '#'),
        h('th[title=Uppercase]', 'UC'),
        h('th[title=Lowercase]', 'LC'),
        h('th[title=Titlecase]', 'TC'),
      ])
    ]),
    h('tbody', rows)
  ]);
}

function renderCharCodesTable(charCodes: number[]): VNode {
  var indexCells = [h('th', '')];
  var stringCells = [h('th', 'str')];
  var decCells = [h('th', 'dec')];
  var hexCells = [h('th', 'hex')];
  var octCells = [h('th', 'oct')];
  for (var i = 0; i < charCodes.length; i++) {
    var charCode = charCodes[i];
    var url = `#/characters?start=${charCode}&end=${charCode}`;
    indexCells[i] = h('th', i.toString());
    stringCells[i] = h('td', String.fromCharCode(charCodes[i]));
    decCells[i] = h('td', [h('a', {href: url}, [charCode.toString()])]);
    hexCells[i] = h('td', [h('a', {href: url}, ['0x' + charCode.toString(16).toUpperCase()])]);
    octCells[i] = h('td', [h('a', {href: url}, ['\\' + charCode.toString(8)])]);
  }
  return h('table.string', [
    h('thead', [
      h('tr', indexCells)
    ]),
    h('tbody', [
      h('tr.str', stringCells),
      h('tr', decCells),
      h('tr', hexCells),
      h('tr', octCells),
    ])
  ]);
}
