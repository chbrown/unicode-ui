import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {Redirect, Route, Switch} from 'react-router'
import {HashRouter, NavLink} from 'react-router-dom'

import CharactersView from './views/CharactersView'
import StringView from './views/StringView'

import './site.less'

ReactDOM.render((
  <HashRouter>
    <div>
      <nav>
        <NavLink to="/characters" className="tab" activeClassName="current">Character Table</NavLink>
        <NavLink to="/string" className="tab" activeClassName="current">String</NavLink>
      </nav>
      <main>
        <Switch>
          <Route path="/characters" component={CharactersView} />
          <Route path="/string" component={StringView} />
          <Redirect path="*" to="/characters" />
        </Switch>
      </main>
    </div>
  </HashRouter>
), document.getElementById('app'))
