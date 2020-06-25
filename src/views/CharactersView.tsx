import * as React from 'react'
import {Character} from 'unidata'

import {Blocks, Characters, GeneralCategories, createCharacterPredicate} from '../unicode'
import {pruneObject} from '../util'
import UcdTable from './UcdTable'

interface CharactersParams {
  start?: string
  end?: string
  name?: string
  cat?: string
  limit?: string
}
const defaultCharactersParams = {
  start: '32',
  end: '',
  name: '',
  cat: '',
  limit: '256',
}
class CharactersView extends React.Component<{location: Location}, CharactersParams & {characters?: Character[]}> {
  _findCharactersQueued = false
  constructor(props) {
    super(props)
    this.state = Object.assign({characters: []}, defaultCharactersParams)
    this.refreshCharacters()
  }
  componentWillMount() {
    const urlSearchParams = new URLSearchParams(this.props.location.search)
    const rawState = {
      start: urlSearchParams.get('start'),
      end: urlSearchParams.get('end'),
      name: urlSearchParams.get('name'),
      cat: urlSearchParams.get('cat'),
      limit: urlSearchParams.get('limit'),
    }
    this.setState(pruneObject(rawState))
  }
  onBlockChange(ev: Event) {
    // not being able to pass raw objects easily in a select is one disadvantage of React
    const [start, end] = (ev.target as HTMLInputElement).value.split('-')
    this.setParams({start, end})
  }
  onCategoryChange(ev: Event) {
    // not being able to pass raw objects easily in a select is one disadvantage of React
    const cat = (ev.target as HTMLInputElement).value
    this.setParams({cat})
  }
  onParamChange(key: string, ev: Event) {
    const value = (ev.target as HTMLInputElement).value
    this.setParams({[key]: value})
  }
  /** wrapper around setState that persists selected state to the router/URL */
  setParams(params) {
    this.setState(params, () => {
      const {start, end, name, cat, limit} = this.state
      const search = new URLSearchParams(pruneObject({start, end, name, cat, limit})).toString()
      this.context['router'].history.push({search})
    })
    // recompute matchingCharacters
    this.refreshCharacters()
  }
  /** debounce running findCharacters for 250ms */
  refreshCharacters() {
    if (!this._findCharactersQueued) {
      this._findCharactersQueued = true
      setTimeout(() => {
        const {start, end, name, cat} = this.state
        const predicate = createCharacterPredicate(
          parseInt(start, 10),
          parseInt(end, 10),
          name.toUpperCase(),
          cat,
        )
        // search through all 29K characters in the unidata character set
        const characters = Characters.filter(predicate)
        this.setState({characters})
        this._findCharactersQueued = false
      }, 250)
    }
  }
  render() {
    // Blocks and GeneralCategories are globals
    const {start, end, name, cat, limit, characters} = this.state
    const limitedCharacters = characters.slice(0, parseInt(limit, 10) || 256)
    return (
      <div>
        <div className="hcontrol">
          <label>
            <div><b>Block</b></div>
            <select value={`${start}-${end}`} onChange={this.onBlockChange.bind(this)} style={{width: '200px'}}>
              <option key="custom">-- Custom --</option>
              <option key="all" value="-">All ({Characters.length})</option>
              {Blocks.map(({blockName, startCode, endCode}) =>
                <option key={blockName} value={`${startCode}-${endCode}`}>
                  {blockName} ({1 + endCode - startCode})
                </option>
              )}
            </select>
          </label>
        </div>
        <div className="hcontrol">
          <label>
            <div><b>Range</b></div>
          </label>
          <input type="number" placeholder="start" style={{width: '70px'}}
            value={start} onChange={this.onParamChange.bind(this, 'start')} />
          –
          <input type="number" placeholder="end" style={{width: '70px'}}
            value={end} onChange={this.onParamChange.bind(this, 'end')} />
        </div>
        <div className="hcontrol">
          <label>
            <div><b>Name</b></div>
            <input value={name} onChange={this.onParamChange.bind(this, 'name')} />
          </label>
        </div>
        <div className="hcontrol">
          <label>
            <div><b>General Category</b></div>
            <select value={cat} onChange={this.onCategoryChange.bind(this)} style={{width: '150px'}}>
              <option value="">-- All --</option>
              {Object.keys(GeneralCategories).map(cat =>
                <option key={cat} value={cat}>{GeneralCategories[cat]}</option>
              )}
            </select>
          </label>
        </div>
        <div className="hcontrol">
          <label>
            <div><b>Limit</b></div>
            <input type="number" style={{width: '50px'}}
              value={limit.toString()} onChange={this.onParamChange.bind(this, 'limit')} />
          </label>
        </div>
        <h3 className="hpad">
          Showing {limitedCharacters.length} of {characters.length} matching characters
        </h3>
        <UcdTable characters={limitedCharacters} />
      </div>
    )
  }
}

export default CharactersView
