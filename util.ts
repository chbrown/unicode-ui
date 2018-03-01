
/**
modifiers modify the character after them.
combiners modify the character before them.
*/
const modifier_to_combiner = {
  "\u02C7": "\u030C", // CARON -> COMBINING CARON
  "\u02DB": "\u0328", // OGONEK -> COMBINING OGONEK
  "\u02CA": "\u0301", // MODIFIER LETTER ACUTE ACCENT -> COMBINING ACUTE ACCENT
  "\u02CB": "\u0300", // MODIFIER LETTER GRAVE ACCENT -> COMBINING GRAVE ACCENT
  "\u02C6": "\u0302", // MODIFIER LETTER CIRCUMFLEX ACCENT -> COMBINING CIRCUMFLEX ACCENT
}

/**
These are all the Modifier_Symbol with character codes less than 1000 that have
decompositions. I think these are the ones that we can assume are supposed to
combine with the following character.

The unicode names in the comment after each mapping pair are the key's name.
*/
const decomposable_modifiers = {
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
}

export function normalize(raw: string): string {
  // remove all character codes 0 through 31 (space is 32 == 0x1F)
  const visible = raw.replace(/[\x00-\x1F]/g, '')
  // 2. replace combining characters that are currently combining with a space
  // by the lone combiner so that they'll combine with the following character
  // instead, as intended.
  const decompositions_applied = visible.replace(/[\u00A8\u00AF\u00B4\u00B8\u02D8-\u02DD]/g, (modifier) => {
    return decomposable_modifiers[modifier]
  })
  // 1. replace (modifier, letter) pairs with a single modified-letter character
  //    688 - 767
  const modifiers_applied = decompositions_applied.replace(/([\u02B0-\u02FF])(.)/g, (m0, modifier, modified) => {
    if (modifier in modifier_to_combiner) {
      return modified + modifier_to_combiner[modifier]
    }
    return modifier + modified
  })
  // and replacing the combining character pairs with precombined characters where possible
  // const canonical = convert_to_nfc(normalized)
  return modifiers_applied
}

export function charCodeUrl(charCode: number): string {
  return `#/characters?start=${charCode}&end=${charCode}`
}

export function charCodeString(charCode: number, base: string): string {
  if (base == 'hex') {
    return `0x${charCode.toString(16).toUpperCase()}`
  }
  else if (base == 'oct') {
    return `\\${charCode.toString(8)}`
  }
  else {
    return charCode.toString()
  }
}
