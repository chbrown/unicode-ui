import * as React from 'react'
import {useHistory} from 'react-router-dom'
import {Character} from 'unidata'

import {Blocks, Characters, GeneralCategories, createCharacterPredicate} from '../unicode'
import {pruneObject} from '../util'
import UcdTable from './UcdTable'

/**
Debounce changes to `value`; the returned value is only updated to match the
given `value` after `ms` milliseconds of not being changed.
*/
function useDebounce<T>(value: T, ms: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState(value)
  React.useEffect(() => {
    // start timer to update value
    const timeoutID = setTimeout(() => {
      setDebouncedValue(value)
    }, ms)
    // effects are cleaned up (if possible) before the next effect runs
    return () => clearTimeout(timeoutID)
  }, [value, ms])
  return debouncedValue
}

interface CharactersParams {
  start: string
  end: string
  name: string
  cat: string
  limit: string
}
const defaultCharactersParams: CharactersParams = {
  start: '32',
  end: '',
  name: '',
  cat: '',
  limit: '256',
}

interface CharactersViewProps {
  location: Location
}

function CharactersView(props: CharactersViewProps) {
  const history = useHistory()
  // initialize params state, reading from location initially
  const [params, setParams] = React.useState(() => {
    const urlSearchParams = new URLSearchParams(props.location.search)
    const customParams = pruneObject({
      start: urlSearchParams.get('start'),
      end: urlSearchParams.get('end'),
      name: urlSearchParams.get('name'),
      cat: urlSearchParams.get('cat'),
      limit: urlSearchParams.get('limit'),
    })
    return {...defaultCharactersParams, ...customParams}
  })
  // persist params to the router (location) whenever they change
  React.useEffect(() => {
    const customParams = Object.entries(params).filter(([key, value]) => {
      return value != defaultCharactersParams[key]
    })
    const urlSearchParams = new URLSearchParams(customParams)
    // TODO: avoid triggering component re-render due to router state change
    history.push({search: urlSearchParams.toString()})
  }, [params])

  const onBlockChange = (ev: React.ChangeEvent<HTMLSelectElement>) => {
    const [start, end] = ev.target.value.split('-')
    setParams(prevParams => ({...prevParams, start, end}))
  }
  const onParamChange = (ev: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const {name, value} = ev.target
    setParams(prevParams => ({...prevParams, [name]: value}))
  }

  const {start, end, name, cat, limit} = params
  // debounce changes to specific params (namely, `name`)
  const debouncedName = useDebounce(name, 250)
  // search through all 29K characters in the unidata character set,
  // pretty much whenever params change, but debouncing on some params
  const characters = React.useMemo(() => {
    const predicate = createCharacterPredicate(
      parseInt(start, 10),
      parseInt(end, 10),
      debouncedName.toUpperCase(),
      cat,
    )
    return Characters.filter(predicate)
  }, [start, end, debouncedName, cat])
  const limitedCharacters = characters.slice(0, parseInt(limit, 10) || 256)

  return (
    <div>
      <div className="hcontrol">
        <label>
          <div><b>Block</b></div>
          <select value={`${start}-${end}`} onChange={onBlockChange} style={{width: '200px'}}>
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
          name="start" value={start} onChange={onParamChange} />
        –
        <input type="number" placeholder="end" style={{width: '70px'}}
          name="end" value={end} onChange={onParamChange} />
      </div>
      <div className="hcontrol">
        <label>
          <div><b>Name</b></div>
          <input name="name" value={name} onChange={onParamChange} />
        </label>
      </div>
      <div className="hcontrol">
        <label>
          <div><b>General Category</b></div>
          <select name="cat" value={cat} onChange={onParamChange} style={{width: '150px'}}>
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
          <input name="limit" type="number" style={{width: '50px'}}
            value={limit.toString()} onChange={onParamChange} />
        </label>
      </div>
      <h3 className="hpad">
        Showing {limitedCharacters.length} of {characters.length} matching characters
      </h3>
      <UcdTable characters={limitedCharacters} />
    </div>
  )
}

export default CharactersView
