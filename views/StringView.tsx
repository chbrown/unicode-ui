import * as React from 'react'
import * as PropTypes from 'prop-types'
import {parse, stringify} from 'query-string'

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
function charCodeUrl(charCode: number): string {
  return `#/characters?start=${charCode}&end=${charCode}`
}
const CharCodesTable = ({charCodes}: {charCodes: number[]}) => {
  return (
    <table className="string">
      <thead>
        <tr>
          <th></th>
          {charCodes.map((charCode, i) => <th key={i}>{i}</th>)}
        </tr>
      </thead>
      <tbody>
        <tr className="str">
          <th>str</th>
          {charCodes.map((charCode, i) => <td key={i}>{String.fromCharCode(charCodes[i])}</td>)}
        </tr>
        <tr>
          <th>dec</th>
          {charCodes.map((charCode, i) =>
            <td key={i}><a href={charCodeUrl(charCode)}>{charCode.toString()}</a></td>
          )}
        </tr>
        <tr>
          <th>hex</th>
          {charCodes.map((charCode, i) =>
            <td key={i}><a href={charCodeUrl(charCode)}>0x{charCode.toString(16).toUpperCase()}</a></td>
          )}
        </tr>
        <tr>
          <th>oct</th>
          {charCodes.map((charCode, i) =>
            <td key={i}><a href={charCodeUrl(charCode)}>\\{charCode.toString(8)}</a></td>
          )}
        </tr>
      </tbody>
    </table>
  )
}
const NormalizationTable = ({input, form}: {input: string, form: string}) => {
  if (form === 'Custom') {
    input = normalize(input)
  }
  else if (form !== 'Original') {
    input = input.normalize(form)
  }
  const charCodes: number[] = []
  for (let i = 0; i < input.length; i++) {
    charCodes[i] = input.charCodeAt(i)
  }
  return (
    <section className="hpad">
      <h3>{form}: {input}</h3>
      <CharCodesTable charCodes={charCodes} />
    </section>
  )
}
class StringView extends React.Component<{location: Location}, {input: string}> {
  constructor(props) {
    super(props)
    const {input = ''} = parse(this.props.location.search)
    this.state = {input}
  }
  onInputChanged(ev) {
    const input = ev.target.value
    this.setState({input}, () => {
      const search = stringify({input})
      this.context['router'].history.push({search})
    })
  }
  render() {
    const normalizationForms = ['Original', 'Custom', 'NFC', 'NFD', 'NFKC', 'NFKD']
    const {input} = this.state
    return (
      <div>
        <section className="hpad">
          <label>
            <div><b>Input string</b></div>
            <input value={input} onChange={this.onInputChanged.bind(this)} />
          </label>
        </section>
        {normalizationForms.map(form =>
          <NormalizationTable key={form + input} input={input} form={form} />
        )}
      </div>
    )
  }
}
StringView['contextTypes'] = {
  router: PropTypes.object.isRequired,
}

export default StringView
