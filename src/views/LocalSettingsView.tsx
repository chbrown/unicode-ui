import * as React from 'react'

import storage from '../storage'

function LocalSettingsView() {
  const [selectedBases, setSelectedBases] = React.useState(() => {
    return storage.selectedBases
  })
  const onBaseChanged = (base: string, ev: React.ChangeEvent<HTMLInputElement>) => {
    const {checked} = ev.currentTarget
    if (checked) {
      selectedBases.add(base)
    }
    else {
      selectedBases.delete(base)
    }
    setSelectedBases(selectedBases)
  }
  // update localStorage whenever selectedBases changes
  React.useEffect(() => {
    storage.selectedBases = selectedBases
  }, [selectedBases])

  return (
    <div>
      <section className="hpad">
        <h3>Char Code Bases</h3>
        {storage.allBases.map(base =>
          <div key={base}>
            <label>
              <input type="checkbox"
                     checked={selectedBases.has(base)}
                     onChange={ev => onBaseChanged(base, ev)} />
              {' '}<b>{base}</b>
            </label>
          </div>
        )}

      </section>

    </div>
  )
}

export default LocalSettingsView
