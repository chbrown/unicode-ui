import * as React from 'react'
import * as PropTypes from 'prop-types'

import storage from '../storage'

interface LocalSettingsState {
  selectedBases: Set<string>
}

class LocalSettingsView extends React.Component<{}, LocalSettingsState> {
  constructor(props) {
    super(props)
    const {selectedBases} = storage
    this.state = {selectedBases}
  }
  onBaseChanged(base: string, ev: React.ChangeEvent<HTMLInputElement>) {
    const {checked} = ev.currentTarget
    const {selectedBases} = this.state
    if (checked) {
      selectedBases.add(base)
    }
    else {
      selectedBases.delete(base)
    }
    this.setState({selectedBases}, () => {
      storage.selectedBases = selectedBases
    })
  }
  render() {
    const {selectedBases} = this.state
    return (
      <div>
        <section className="hpad">
          <h3>Char Code Bases</h3>
          {storage.allBases.map(base =>
            <div key={base}>
              <label>
                <input type="checkbox"
                       checked={selectedBases.has(base)}
                       onChange={this.onBaseChanged.bind(this, base)} />
                {' '}<b>{base}</b>
              </label>
            </div>
          )}

        </section>

      </div>
    )
  }
}

export default LocalSettingsView
