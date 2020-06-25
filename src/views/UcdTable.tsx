import * as React from 'react'
import {Character} from 'unidata'

import storage from '../storage'
import {charCodeString} from '../util'
import {GeneralCategories, CombiningClass} from '../unicode'

interface UcdRowProps {
  character: Character
  bases: string[]
}

function PureUcdRow(props: UcdRowProps) {
  const {bases, character} = props
  return (
    <tr>
      {bases.map(base =>
        <td key={base} className="num">
          {charCodeString(character.code, base)}
        </td>
      )}
      <td className="str">{String.fromCodePoint(character.code)}</td>
      <td>{character.name}</td>
      <td>{GeneralCategories[character.cat]}</td>
      <td>{CombiningClass[character.comb]}</td>
      <td>{character.decompType} {(character.decomp || []).map(code => '0x' + code.toString(16)).join(' ')}</td>
      <td title="NumberValue">{character.num}</td>
      <td title="Uppercase">{character.upper && String.fromCodePoint(character.upper)}</td>
      <td title="Lowercase">{character.lower && String.fromCodePoint(character.lower)}</td>
      <td title="Titlecase">{character.title && String.fromCodePoint(character.title)}</td>
    </tr>
  )
}
const UcdRow = React.memo(PureUcdRow, (prevProps, nextProps) => prevProps.character === nextProps.character)

interface UcdTableProps {
  characters: Character[]
}

function UcdTable(props: UcdTableProps) {
  const {characters} = props
  const bases = [...storage.selectedBases]
  return (
    <table className="characters fill padded lined striped">
      <thead>
        <tr>
          {bases.map(base =>
            <th key={base}>{base}</th>
          )}
          <th>Character</th>
          <th>Name</th>
          <th>GeneralCategory</th>
          <th title="CombiningClass">Comb</th>
          <th title="Decomposition">Decomp</th>
          <th title="NumberValue">#</th>
          <th title="Uppercase">UC</th>
          <th title="Lowercase">LC</th>
          <th title="Titlecase">TC</th>
        </tr>
      </thead>
      <tbody>
        {characters.map((character, i) =>
          <UcdRow key={i} character={character} bases={bases} />
        )}
      </tbody>
    </table>
  )
}

export default UcdTable
