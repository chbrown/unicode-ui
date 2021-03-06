import {getBlocks, getCharacters, Character} from 'unidata'

export const Characters = getCharacters()
export const Blocks = getBlocks()

export const GeneralCategories = {
  Lu: "Uppercase_Letter",
  Ll: "Lowercase_Letter",
  Lt: "Titlecase_Letter",
  LC: "Cased_Letter",
  Lm: "Modifier_Letter",
  Lo: "Other_Letter",
  L:  "Letter",
  Mn: "Nonspacing_Mark",
  Mc: "Spacing_Mark",
  Me: "Enclosing_Mark",
  M:  "Mark",
  Nd: "Decimal_Number",
  Nl: "Letter_Number",
  No: "Other_Number",
  N:  "Number",
  Pc: "Connector_Punctuation",
  Pd: "Dash_Punctuation",
  Ps: "Open_Punctuation",
  Pe: "Close_Punctuation",
  Pi: "Initial_Punctuation",
  Pf: "Final_Punctuation",
  Po: "Other_Punctuation",
  P:  "Punctuation",
  Sm: "Math_Symbol",
  Sc: "Currency_Symbol",
  Sk: "Modifier_Symbol",
  So: "Other_Symbol",
  S:  "Symbol",
  Zs: "Space_Separator",
  Zl: "Line_Separator",
  Zp: "Paragraph_Separator",
  Z:  "Separator",
  Cc: "Control",
  Cf: "Format",
  Cs: "Surrogate",
  Co: "Private_Use",
  Cn: "Unassigned",
  C:  "Other"
}

export const CombiningClass = {
  0: "Not_Reordered",
  1: "Overlay",
  7: "Nukta",
  8: "Kana_Voicing",
  9: "Virama",
  10: "Ccc10",
  // Ccc[11..199] = [11..199], // Fixed position classes
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
}

export function createCharacterPredicate(start: number, end: number, name: string, cat: string) {
  const ignore_start = isNaN(start)
  const ignore_end = isNaN(end)
  const ignore_name = !name
  const ignore_cat = !cat
  return (character: Character) => (
    (ignore_start || (character.code >= start)) && // ✔︎ after start
    (ignore_end || (character.code <= end)) && // ✔︎ before end
    (ignore_name || character.name.includes(name)) && // ✔︎ name matches
    (ignore_cat || ((character.cat || 'L') === cat)) // ✔︎ cat matches
  )
}
