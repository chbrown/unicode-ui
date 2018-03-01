import * as React from 'react'
import * as PropTypes from 'prop-types'
import {parse, stringify} from 'query-string'

import storage from '../storage'
import {normalize, charCodeUrl, charCodeString} from '../util'

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
        {[...storage.selectedBases].map(base =>
          <tr key={base}>
            <th>{base}</th>
            {charCodes.map((charCode, i) =>
              <td key={i}>
                <a href={charCodeUrl(charCode)}>
                  {charCodeString(charCode, base)}
                </a>
              </td>
            )}
          </tr>
        )}
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
