/**
1000000000000 is the biggest numeric value defined for any Unicode character
(U+16B61 "PAHAWH HMONG NUMBER TRILLIONS"), so what we have to worry about are
the fractions (which can have negative signs, though
U+0F33 "TIBETAN DIGIT HALF ZERO" is the only one of those)
*/
function evaluateNumericValue(string) {
    if (string === undefined)
        return undefined;
    if (string === null)
        return null;
    if (string === '')
        return null;
    var fraction_match = string.match(/(-?\d+)\/(\d+)/);
    if (fraction_match) {
        var _ = fraction_match[0], numerator = fraction_match[1], denominator = fraction_match[2];
        return parseInt(numerator, 10) / parseInt(denominator, 10);
    }
    return parseInt(string, 10);
}
var GeneralCategory;
(function (GeneralCategory) {
    GeneralCategory[GeneralCategory["Uppercase_Letter"] = 0] = "Uppercase_Letter";
    GeneralCategory[GeneralCategory["Lowercase_Letter"] = 1] = "Lowercase_Letter";
    GeneralCategory[GeneralCategory["Titlecase_Letter"] = 2] = "Titlecase_Letter";
    GeneralCategory[GeneralCategory["Cased_Letter"] = 3] = "Cased_Letter";
    GeneralCategory[GeneralCategory["Modifier_Letter"] = 4] = "Modifier_Letter";
    GeneralCategory[GeneralCategory["Other_Letter"] = 5] = "Other_Letter";
    GeneralCategory[GeneralCategory["Letter"] = 6] = "Letter";
    GeneralCategory[GeneralCategory["Nonspacing_Mark"] = 7] = "Nonspacing_Mark";
    GeneralCategory[GeneralCategory["Spacing_Mark"] = 8] = "Spacing_Mark";
    GeneralCategory[GeneralCategory["Enclosing_Mark"] = 9] = "Enclosing_Mark";
    GeneralCategory[GeneralCategory["Mark"] = 10] = "Mark";
    GeneralCategory[GeneralCategory["Decimal_Number"] = 11] = "Decimal_Number";
    GeneralCategory[GeneralCategory["Letter_Number"] = 12] = "Letter_Number";
    GeneralCategory[GeneralCategory["Other_Number"] = 13] = "Other_Number";
    GeneralCategory[GeneralCategory["Number"] = 14] = "Number";
    GeneralCategory[GeneralCategory["Connector_Punctuation"] = 15] = "Connector_Punctuation";
    GeneralCategory[GeneralCategory["Dash_Punctuation"] = 16] = "Dash_Punctuation";
    GeneralCategory[GeneralCategory["Open_Punctuation"] = 17] = "Open_Punctuation";
    GeneralCategory[GeneralCategory["Close_Punctuation"] = 18] = "Close_Punctuation";
    GeneralCategory[GeneralCategory["Initial_Punctuation"] = 19] = "Initial_Punctuation";
    GeneralCategory[GeneralCategory["Final_Punctuation"] = 20] = "Final_Punctuation";
    GeneralCategory[GeneralCategory["Other_Punctuation"] = 21] = "Other_Punctuation";
    GeneralCategory[GeneralCategory["Punctuation"] = 22] = "Punctuation";
    GeneralCategory[GeneralCategory["Math_Symbol"] = 23] = "Math_Symbol";
    GeneralCategory[GeneralCategory["Currency_Symbol"] = 24] = "Currency_Symbol";
    GeneralCategory[GeneralCategory["Modifier_Symbol"] = 25] = "Modifier_Symbol";
    GeneralCategory[GeneralCategory["Other_Symbol"] = 26] = "Other_Symbol";
    GeneralCategory[GeneralCategory["Symbol"] = 27] = "Symbol";
    GeneralCategory[GeneralCategory["Space_Separator"] = 28] = "Space_Separator";
    GeneralCategory[GeneralCategory["Line_Separator"] = 29] = "Line_Separator";
    GeneralCategory[GeneralCategory["Paragraph_Separator"] = 30] = "Paragraph_Separator";
    GeneralCategory[GeneralCategory["Separator"] = 31] = "Separator";
    GeneralCategory[GeneralCategory["Control"] = 32] = "Control";
    GeneralCategory[GeneralCategory["Format"] = 33] = "Format";
    GeneralCategory[GeneralCategory["Surrogate"] = 34] = "Surrogate";
    GeneralCategory[GeneralCategory["Private_Use"] = 35] = "Private_Use";
    GeneralCategory[GeneralCategory["Unassigned"] = 36] = "Unassigned";
    GeneralCategory[GeneralCategory["Other"] = 37] = "Other";
})(GeneralCategory || (GeneralCategory = {}));
;
var GeneralCategoryAbbr;
(function (GeneralCategoryAbbr) {
    GeneralCategoryAbbr[GeneralCategoryAbbr["Lu"] = 0] = "Lu";
    GeneralCategoryAbbr[GeneralCategoryAbbr["Ll"] = 1] = "Ll";
    GeneralCategoryAbbr[GeneralCategoryAbbr["Lt"] = 2] = "Lt";
    GeneralCategoryAbbr[GeneralCategoryAbbr["LC"] = 3] = "LC";
    GeneralCategoryAbbr[GeneralCategoryAbbr["Lm"] = 4] = "Lm";
    GeneralCategoryAbbr[GeneralCategoryAbbr["Lo"] = 5] = "Lo";
    GeneralCategoryAbbr[GeneralCategoryAbbr["L"] = 6] = "L";
    GeneralCategoryAbbr[GeneralCategoryAbbr["Mn"] = 7] = "Mn";
    GeneralCategoryAbbr[GeneralCategoryAbbr["Mc"] = 8] = "Mc";
    GeneralCategoryAbbr[GeneralCategoryAbbr["Me"] = 9] = "Me";
    GeneralCategoryAbbr[GeneralCategoryAbbr["M"] = 10] = "M";
    GeneralCategoryAbbr[GeneralCategoryAbbr["Nd"] = 11] = "Nd";
    GeneralCategoryAbbr[GeneralCategoryAbbr["Nl"] = 12] = "Nl";
    GeneralCategoryAbbr[GeneralCategoryAbbr["No"] = 13] = "No";
    GeneralCategoryAbbr[GeneralCategoryAbbr["N"] = 14] = "N";
    GeneralCategoryAbbr[GeneralCategoryAbbr["Pc"] = 15] = "Pc";
    GeneralCategoryAbbr[GeneralCategoryAbbr["Pd"] = 16] = "Pd";
    GeneralCategoryAbbr[GeneralCategoryAbbr["Ps"] = 17] = "Ps";
    GeneralCategoryAbbr[GeneralCategoryAbbr["Pe"] = 18] = "Pe";
    GeneralCategoryAbbr[GeneralCategoryAbbr["Pi"] = 19] = "Pi";
    GeneralCategoryAbbr[GeneralCategoryAbbr["Pf"] = 20] = "Pf";
    GeneralCategoryAbbr[GeneralCategoryAbbr["Po"] = 21] = "Po";
    GeneralCategoryAbbr[GeneralCategoryAbbr["P"] = 22] = "P";
    GeneralCategoryAbbr[GeneralCategoryAbbr["Sm"] = 23] = "Sm";
    GeneralCategoryAbbr[GeneralCategoryAbbr["Sc"] = 24] = "Sc";
    GeneralCategoryAbbr[GeneralCategoryAbbr["Sk"] = 25] = "Sk";
    GeneralCategoryAbbr[GeneralCategoryAbbr["So"] = 26] = "So";
    GeneralCategoryAbbr[GeneralCategoryAbbr["S"] = 27] = "S";
    GeneralCategoryAbbr[GeneralCategoryAbbr["Zs"] = 28] = "Zs";
    GeneralCategoryAbbr[GeneralCategoryAbbr["Zl"] = 29] = "Zl";
    GeneralCategoryAbbr[GeneralCategoryAbbr["Zp"] = 30] = "Zp";
    GeneralCategoryAbbr[GeneralCategoryAbbr["Z"] = 31] = "Z";
    GeneralCategoryAbbr[GeneralCategoryAbbr["Cc"] = 32] = "Cc";
    GeneralCategoryAbbr[GeneralCategoryAbbr["Cf"] = 33] = "Cf";
    GeneralCategoryAbbr[GeneralCategoryAbbr["Cs"] = 34] = "Cs";
    GeneralCategoryAbbr[GeneralCategoryAbbr["Co"] = 35] = "Co";
    GeneralCategoryAbbr[GeneralCategoryAbbr["Cn"] = 36] = "Cn";
    GeneralCategoryAbbr[GeneralCategoryAbbr["C"] = 37] = "C";
})(GeneralCategoryAbbr || (GeneralCategoryAbbr = {}));
;
var CanonicalCombiningClass;
(function (CanonicalCombiningClass) {
    CanonicalCombiningClass[CanonicalCombiningClass["Not_Reordered"] = 0] = "Not_Reordered";
    CanonicalCombiningClass[CanonicalCombiningClass["Overlay"] = 1] = "Overlay";
    CanonicalCombiningClass[CanonicalCombiningClass["Nukta"] = 7] = "Nukta";
    CanonicalCombiningClass[CanonicalCombiningClass["Kana_Voicing"] = 8] = "Kana_Voicing";
    CanonicalCombiningClass[CanonicalCombiningClass["Virama"] = 9] = "Virama";
    CanonicalCombiningClass[CanonicalCombiningClass["Ccc10"] = 10] = "Ccc10";
    // Ccc[11..199] = [11..199], // Fixed position classes
    CanonicalCombiningClass[CanonicalCombiningClass["Attached_Below_Left"] = 200] = "Attached_Below_Left";
    CanonicalCombiningClass[CanonicalCombiningClass["Attached_Below"] = 202] = "Attached_Below";
    CanonicalCombiningClass[CanonicalCombiningClass["Marks_attached_at_the_bottom_right"] = 204] = "Marks_attached_at_the_bottom_right";
    CanonicalCombiningClass[CanonicalCombiningClass["Marks_attached_to_the_left"] = 208] = "Marks_attached_to_the_left";
    CanonicalCombiningClass[CanonicalCombiningClass["Marks_attached_to_the_right"] = 210] = "Marks_attached_to_the_right";
    CanonicalCombiningClass[CanonicalCombiningClass["Marks_attached_at_the_top_left"] = 212] = "Marks_attached_at_the_top_left";
    CanonicalCombiningClass[CanonicalCombiningClass["Attached_Above"] = 214] = "Attached_Above";
    CanonicalCombiningClass[CanonicalCombiningClass["Attached_Above_Right"] = 216] = "Attached_Above_Right";
    CanonicalCombiningClass[CanonicalCombiningClass["Below_Left"] = 218] = "Below_Left";
    CanonicalCombiningClass[CanonicalCombiningClass["Below"] = 220] = "Below";
    CanonicalCombiningClass[CanonicalCombiningClass["Below_Right"] = 222] = "Below_Right";
    CanonicalCombiningClass[CanonicalCombiningClass["Left"] = 224] = "Left";
    CanonicalCombiningClass[CanonicalCombiningClass["Right"] = 226] = "Right";
    CanonicalCombiningClass[CanonicalCombiningClass["Above_Left"] = 228] = "Above_Left";
    CanonicalCombiningClass[CanonicalCombiningClass["Above"] = 230] = "Above";
    CanonicalCombiningClass[CanonicalCombiningClass["Above_Right"] = 232] = "Above_Right";
    CanonicalCombiningClass[CanonicalCombiningClass["Double_Below"] = 233] = "Double_Below";
    CanonicalCombiningClass[CanonicalCombiningClass["Double_Above"] = 234] = "Double_Above";
    CanonicalCombiningClass[CanonicalCombiningClass["Iota_Subscript"] = 240] = "Iota_Subscript";
})(CanonicalCombiningClass || (CanonicalCombiningClass = {}));
;
/**
Snippet from `Blocks.txt`:

    0000..007F; Basic Latin
    0080..00FF; Latin-1 Supplement
    0100..017F; Latin Extended-A
    0180..024F; Latin Extended-B
    0250..02AF; IPA Extensions

*/
function parseBlocks(txt) {
    return txt
        .split(/\n/)
        .map(function (line) { return line.match(/^([A-F0-9]+)\.\.([A-F0-9]+); (.+)$/); })
        .filter(function (match) { return match !== null; })
        .map(function (match) {
        // var [_, startCode: string, endCode: string, blockName] = match; // doesn't work
        var _ = match[0], startCode = match[1], endCode = match[2], blockName = match[3];
        return {
            blockName: blockName,
            startCode: parseInt(startCode, 16),
            endCode: parseInt(endCode, 16),
        };
    });
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
function parseUnicodeData(txt) {
    return txt
        .split(/\n/)
        .map(function (line) {
        var fields = line.split(';');
        // Code is hexadecimal
        var code = parseInt(fields[0], 16);
        // Name is a string
        var name = fields[1];
        // General_Category is an abbreviation, which we convert to a category name
        var generalCategoryIndex = GeneralCategoryAbbr[fields[2]];
        var generalCategory = generalCategoryIndex;
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
function locationQuery() {
    var query = {};
    window.location.search.slice(1).split('&').forEach(function (arg) {
        var _a = arg.split('='), key = _a[0], value = _a[1];
        query[key] = decodeURIComponent(value);
    });
    return query;
}
var CharacterTableCtrl = (function () {
    function CharacterTableCtrl() {
        this.blocks = m.request({
            method: 'GET',
            url: 'ucd/Blocks.txt',
            deserialize: parseBlocks,
        });
        this.characters = m.request({
            method: 'GET',
            url: 'ucd/UnicodeData.txt',
            deserialize: parseUnicodeData,
        });
    }
    CharacterTableCtrl.prototype.setBlock = function (block) {
        history.pushState(null, '', "?start=" + block.startCode + "&end=" + block.endCode);
    };
    CharacterTableCtrl.prototype.getSelectedCharacters = function () {
        var query = locationQuery();
        var selectionStartCode = parseInt(query['start'] || '0', 10);
        var selectionEndCode = parseInt(query['end'] || '255', 10);
        // search through all 27,268 characters
        return this.characters().filter(function (character) {
            return (character.code >= selectionStartCode) && (character.code <= selectionEndCode);
        });
        return [];
    };
    return CharacterTableCtrl;
})();
var CharacterTableApp = (function () {
    function CharacterTableApp() {
    }
    /** Mithril doesn't change thisArg when calling view() */
    CharacterTableApp.view = function (ctrl) {
        var blocks = ctrl.blocks();
        var select = m('select', {
            onchange: function (ev) { ctrl.setBlock(blocks[this.selectedIndex]); }
        }, blocks.map(function (block) { return m('option', block.blockName + " " + block.startCode + "-" + block.endCode); }));
        var characters = ctrl.getSelectedCharacters().map(function (character) {
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
            m('table.characters', m('thead', [
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
            ]), m('tbody', characters))
        ]);
    };
    /**
    Mithril calls `new controller()`, which sets thisArg to the controller
    function itself, instead of the App instance.
    */
    CharacterTableApp.controller = CharacterTableCtrl;
    return CharacterTableApp;
})();
