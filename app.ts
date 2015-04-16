/// <reference path="lib/mithril.d.ts" />
/// <reference path="type_declarations/index.d.ts" />
import * as mithril from 'mithril';

interface Block {
  blockName: string;
  startCode: number;
  endCode: number;
}

/**
1000000000000 is the biggest numeric value defined for any Unicode character
(U+16B61 "PAHAWH HMONG NUMBER TRILLIONS"), so what we have to worry about are
the fractions (which can have negative signs, though
U+0F33 "TIBETAN DIGIT HALF ZERO" is the only one of those)
*/
function evaluateNumericValue(string: string): number {
  if (string === undefined) return undefined;
  if (string === null) return null;
  if (string === '') return null;
  var fraction_match = string.match(/(-?\d+)\/(\d+)/);
  if (fraction_match) {
    var [_, numerator, denominator] = fraction_match;
    return parseInt(numerator, 10) / parseInt(denominator, 10);
  }
  return parseInt(string, 10);
}

enum GeneralCategory {Uppercase_Letter, Lowercase_Letter, Titlecase_Letter, Cased_Letter, Modifier_Letter, Other_Letter, Letter, Nonspacing_Mark, Spacing_Mark, Enclosing_Mark, Mark, Decimal_Number, Letter_Number, Other_Number, Number, Connector_Punctuation, Dash_Punctuation, Open_Punctuation, Close_Punctuation, Initial_Punctuation, Final_Punctuation, Other_Punctuation, Punctuation, Math_Symbol, Currency_Symbol, Modifier_Symbol, Other_Symbol, Symbol, Space_Separator, Line_Separator, Paragraph_Separator, Separator, Control, Format, Surrogate, Private_Use, Unassigned, Other};
enum GeneralCategoryAbbr {Lu, Ll, Lt, LC, Lm, Lo, L, Mn, Mc, Me, M, Nd, Nl, No, N, Pc, Pd, Ps, Pe, Pi, Pf, Po, P, Sm, Sc, Sk, So, S, Zs, Zl, Zp, Z, Cc, Cf, Cs, Co, Cn, C};

enum CanonicalCombiningClass {
  Not_Reordered = 0,
  Overlay = 1,
  Nukta = 7,
  Kana_Voicing = 8,
  Virama = 9,
  Ccc10 = 10,
  // Ccc[11..199] = [11..199], // Fixed position classes
  Attached_Below_Left = 200,
  Attached_Below = 202,
  Marks_attached_at_the_bottom_right = 204,
  Marks_attached_to_the_left = 208,
  Marks_attached_to_the_right = 210,
  Marks_attached_at_the_top_left = 212,
  Attached_Above = 214,
  Attached_Above_Right = 216,
  Below_Left = 218,
  Below = 220,
  Below_Right = 222,
  Left = 224,
  Right = 226,
  Above_Left = 228,
  Above = 230,
  Above_Right = 232,
  Double_Below = 233,
  Double_Above = 234,
  Iota_Subscript = 240
};

/**
Snippet from `Blocks.txt`:

    0000..007F; Basic Latin
    0080..00FF; Latin-1 Supplement
    0100..017F; Latin Extended-A
    0180..024F; Latin Extended-B
    0250..02AF; IPA Extensions

*/
function parseBlocks(txt: string): Block[] {
  return txt
    .split(/\n/)
    .map(line => line.match(/^([A-F0-9]+)\.\.([A-F0-9]+); (.+)$/))
    .filter(match => match !== null)
    .map(match => {
      // var [_, startCode: string, endCode: string, blockName] = match; // doesn't work
      var [_, startCode, endCode, blockName] = match;
      return {
        blockName: blockName,
        startCode: parseInt(startCode, 16),
        endCode: parseInt(endCode, 16),
      };
    });
}

interface Character {
  code: number;
  name: string;
  generalCategory: GeneralCategory;
  combiningClass: CanonicalCombiningClass;
  numberValue: number,
  uppercaseCode: number;
  lowercaseCode: number;
  titlecaseCode: number;
}

/**

Snippet from `UnicodeData.txt`:

    00A0;NO-BREAK SPACE;Zs;0;CS;<noBreak> 0020;;;;N;NON-BREAKING SPACE;;;;
    00A1;INVERTED EXCLAMATION MARK;Po;0;ON;;;;;N;;;;;
    00A2;CENT SIGN;Sc;0;ET;;;;;N;;;;;
    00A3;POUND SIGN;Sc;0;ET;;;;;N;;;;;
    00A4;CURRENCY SIGN;Sc;0;ET;;;;;N;;;;;
    00A5;YEN SIGN;Sc;0;ET;;;;;N;;;;;
    00A6;BROKEN BAR;So;0;ON;;;;;N;BROKEN VERTICAL BAR;;;;

There are 14 ;'s per line, and so there are 15 fields per UnicodeDatum:

0.  Code
1.  Name
2.  General_Category
3.  Canonical_Combining_Class
4.  Bidi_Class
5.  <Decomposition_Type> Decomposition_Mapping
6.  Numeric Value if decimal
7.  Numeric Value if only digit
8.  Numeric Value otherwise
9.  Bidi_Mirrored
10. Unicode_1_Name
11. ISO_Comment
12. Simple_Uppercase_Mapping
13. Simple_Lowercase_Mapping
14. Simple_Titlecase_Mapping

*/
function parseUnicodeData(txt: string): Character[] {
  return txt
    .split(/\n/)
    .map(line => {
      var fields = line.split(';');
      // Code is hexadecimal
      var code = parseInt(fields[0], 16);
      // Name is a string
      var name = fields[1];
      // General_Category is an abbreviation, which we convert to a category name
      var generalCategoryIndex: number = GeneralCategoryAbbr[fields[2]];
      var generalCategory = <GeneralCategory>generalCategoryIndex;
      // Canonical_Combining_Class
      var combiningClass = CanonicalCombiningClass[fields[3]];
      // fields[4]; // Bidi_Class
      // fields[5]; // Decomposition Type & Value
      var numberValue = evaluateNumericValue(fields[8]);
      // fields[9]; // Bidi_Mirrored
      // fields[10]; // Unicode_1_Name (obsolete)
      // fields[11]; // ISO_Comment (obsolete)
      var uppercaseCode = fields[12] && parseInt(fields[12], 16);
      var lowercaseCode = fields[13] && parseInt(fields[13], 16);
      var titlecaseCode = fields[14] && parseInt(fields[14], 16);

      return {
        code: code,
        name: name,
        generalCategory: generalCategory,
        combiningClass: combiningClass,
        numberValue: numberValue,
        uppercaseCode: uppercaseCode,
        lowercaseCode: lowercaseCode,
        titlecaseCode: titlecaseCode,
      };
    });
}

// Mithril app ...

function locationQuery(): {[index: string]: string} {
  var query: {[index: string]: string} = {};
  window.location.search.slice(1).split('&').forEach(arg => {
    var [key, value] = arg.split('=');
    query[key] = decodeURIComponent(value);
  });
  return query;
}

/**
Mithril calls `new controller()`, which sets thisArg to the controller
function itself, instead of the App instance.
*/
class CharacterTableCtrl {
  blocks: mithril.MithrilPromise<Block[]>;
  characters: mithril.MithrilPromise<Character[]>;
  constructor() {
    this.blocks = m.request<Block[]>({
      method: 'GET',
      url: 'ucd/Blocks.txt',
      deserialize: parseBlocks,
    });
    this.characters = m.request<Character[]>({
      method: 'GET',
      url: 'ucd/UnicodeData.txt',
      deserialize: parseUnicodeData,
    });
  }
  setBlock(block: Block) {
    history.pushState(null, '', `?start=${block.startCode}&end=${block.endCode}`);
  }
  getSelectedCharacters(): Character[] {
    var query = locationQuery();
    var selectionStartCode = parseInt(query['start'] || '0', 10);
    var selectionEndCode = parseInt(query['end'] || '255', 10);
    // search through all 27,268 characters
    return this.characters().filter(character => {
      return (character.code >= selectionStartCode) && (character.code <= selectionEndCode);
    });
    return [];
  }
}

/** Mithril doesn't change thisArg when calling view() */
function characterTableView(ctrl: CharacterTableCtrl) {
  var blocks = ctrl.blocks();
  var select = m('select', {
    onchange: function(ev) { ctrl.setBlock(blocks[this.selectedIndex]) }
  }, blocks.map(block => m('option', `${block.blockName} ${block.startCode}-${block.endCode}`)));
  var characters = ctrl.getSelectedCharacters().map(character => {
    return m('tr', [
      m('td', character.code),
      m('td', character.code.toString(16)),
      m('td', character.code.toString(8)),
      m('td', String.fromCharCode(character.code)),
      m('td', character.name),
      m('td', GeneralCategory[character.generalCategory]),
      m('td', character.combiningClass),
      m('td[title=NumberValue]', character.numberValue),
      m('td[title=Uppercase]', String.fromCharCode(character.uppercaseCode)),
      m('td[title=Lowercase]', String.fromCharCode(character.lowercaseCode)),
      m('td[title=Titlecase]', String.fromCharCode(character.titlecaseCode)),
    ]);
  });

  return m('main', [
    m('div', select),
    m('table.characters',
      m('thead', [
        m('th', 'dec'),
        m('th', 'hex'),
        m('th', 'oct'),
        m('th', 'character'),
        m('th', 'name'),
        m('th', 'generalCategory'),
        m('th', 'combiningClass'),
        m('th[title=NumberValue]', '#'),
        m('th[title=Uppercase]', 'UC'),
        m('th[title=Lowercase]', 'LC'),
        m('th[title=Titlecase]', 'TC'),
      ]),
      m('tbody', characters)
    )
  ]);
}

// string app

class StringCtrl {
  public input: string = '';
  constructor() {
    var query = locationQuery();
    this.input = query['input'];
  }
  setString(input: string) {
    history.pushState(null, '', `?input=${input}`);
    this.input = input;
  }
}

function getCharCodes(str: string): number[] {
  var charCodes = [];
  for (var i = 0; i < str.length; i++) {
    charCodes[i] = str.charCodeAt(i);
  }
  return charCodes;
}

function charCodesTable(charCodes: number[]) {
  var indexCells = [];
  var stringCells = [];
  var decCells = [];
  var hexCells = [];
  var octCells = [];
  for (var i = 0; i < charCodes.length; i++) {
    var charCode = charCodes[i];
    indexCells[i] = m('th', [i]);
    stringCells[i] = m('td', [String.fromCharCode(charCodes[i])]);
    decCells[i] = m('td', [charCode]);
    hexCells[i] = m('td', ['0x' + charCode.toString(16).toUpperCase()]);
    octCells[i] = m('td', ['\\' + charCode.toString(8)]);
  }
  return m('table.string', {style: 'margin: 20px 0'}, [
    m('thead', [
      m('tr', [m('th'), indexCells])
    ]),
    m('tbody', [
      m('tr.str', [m('th', ['str']), stringCells]),
      m('tr', [m('th', ['dec']), decCells]),
      m('tr', [m('th', ['hex']), hexCells]),
      m('tr', [m('th', ['oct']), octCells]),
    ])
  ]);
}

function stringMainView(ctrl: StringCtrl) {
  var str = ctrl.input;
  var charCodes = getCharCodes(str);

  var normalizations = ['NFC', 'NFD', 'NFKC', 'NFKD'].map(form => {
    var normalization_str = unorm[form.toLowerCase()](str);
    var normalization_charCodes = getCharCodes(normalization_str);
    return [
      m('h2', [form]),
      charCodesTable(normalization_charCodes)
    ];
  })

  return m('main', [
    m('div', [
      m('input', { onkeyup: function(ev) { ctrl.setString(this.value); }, value: ctrl.input })
    ]),
    m('h2', ['original']),
    charCodesTable(charCodes),
    normalizations
  ]);
}
