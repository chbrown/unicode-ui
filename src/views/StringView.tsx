import * as React from 'react'
import {useHistory} from 'react-router-dom'

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

interface StringViewProps {
  location: Location
}

function StringView(props: StringViewProps) {
  const history = useHistory()
  const [input, setInput] = React.useState(() => {
    const searchParams = new URLSearchParams(props.location.search)
    return searchParams.get('input') || ''
  })
  // update (push) history whenever input changes
  React.useEffect(() => {
    const urlSearchParams = new URLSearchParams({input})
    history.push({search: urlSearchParams.toString()})
  }, [input])
  const normalizationForms = ['Original', 'Custom', 'NFC', 'NFD', 'NFKC', 'NFKD']
  return (
    <div>
      <section className="hpad">
        <label>
          <div><b>Input string</b></div>
          <input value={input} onChange={ev => setInput(ev.target.value)} />
        </label>
      </section>
      {normalizationForms.map(form =>
        <NormalizationTable key={form + input} input={input} form={form} />
      )}
    </div>
  )
}

export default StringView
