import * as React from 'react'
import {Character} from 'unidata'

import {GeneralCategories, CombiningClass} from '../unicode'

class UcdRow extends React.Component<{character: Character}, {}> {
  shouldComponentUpdate(nextProps) {
    return nextProps.character !== this.props.character
  }
  render() {
    const {character} = this.props
    return (
      <tr>
        <td className="num">{character.code.toString()}</td>
        <td className="num">{character.code.toString(16).toUpperCase()}</td>
        <td className="num">{character.code.toString(8)}</td>
        <td className="num">{character.code.toString(2)}</td>
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
}

class UcdTable extends React.Component<{characters: Character[]}, {}> {
  shouldComponentUpdate(nextProps) {
    return (nextProps.characters.length !== this.props.characters.length) ||
      (nextProps.characters !== this.props.characters)
  }
  render() {
    const {characters} = this.props
    return (
      <table className="characters fill padded lined striped">
        <thead>
          <tr>
            <th>dec</th>
            <th>hex</th>
            <th>oct</th>
            <th>bin</th>
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
            <UcdRow key={i} character={character} />
          )}
        </tbody>
      </table>
    )
  }
}

export default UcdTable
