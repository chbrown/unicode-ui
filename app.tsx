import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {createHashHistory, useQueries} from 'history';
import {Router, Route, IndexRedirect, hashHistory, useRouterHistory} from 'react-router';
import {Block, Character} from 'unidata';
import {Blocks, Characters, GeneralCategories, CombiningClass} from './unicode';

import './site.less';

// HistoryModule.Location isn't terribly nice to use, since query has type `Object`, not `any`
interface Location {
  pathname: string;
  search: string;
  query: any;
  state: any;
  action: string;
  key: string;
}

function pruneObject<T>(source: T, falsyValues = [undefined, null, '']): T {
  const target: T = {} as any;
  Object.keys(source).forEach(key => {
    const value = source[key];
    if (falsyValues.indexOf(value) === -1) {
      target[key] = value;
    }
  });
  return target;
}

function isEmpty(val: any): boolean {
  return (val === undefined) || (val === null) || (val === '');
}

class UcdRow extends React.Component<{character: Character}, {}> {
  shouldComponentUpdate(nextProps) {
    return nextProps.character !== this.props.character;
  }
  render() {
    const {character} = this.props;
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
    );
  }
}

class UcdTable extends React.Component<{characters: Character[]}, {}> {
  shouldComponentUpdate(nextProps) {
    return (nextProps.characters.length !== this.props.characters.length) ||
      (nextProps.characters !== this.props.characters);
  }
  render() {
    const {characters} = this.props;
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
    );
  }
}

interface CharactersParams {
  start?: string;
  end?: string;
  name?: string;
  cat?: string;
  limit?: string;
}
const defaultCharactersParams = {
  start: '32',
  end: '',
  name: '',
  cat: '',
  limit: '256',
};
/** search through all 29K characters in the unidata character set */
function findCharacters({start, end, name, cat}: {start: number, end: number, name: string, cat: string}) {
  const ignore_start = isNaN(start);
  const ignore_end = isNaN(end);
  const ignore_name = isEmpty(name);
  const ignore_cat = isEmpty(cat);
  const matchingCharacters = Characters.filter(character => {
    const after_start = ignore_start || (character.code >= start);
    const before_end = ignore_end || (character.code <= end);
    const name_matches = ignore_name || character.name.includes(name);
    const cat_matches = ignore_cat || ((character.cat || 'L') === cat);
    return after_start && before_end && name_matches && cat_matches;
  });
  return matchingCharacters;
}
class CharactersView extends React.Component<{location: Location}, CharactersParams & {characters?: Character[]}> {
  _findCharactersQueued = false;
  constructor() {
    super();
    this.state = Object.assign({characters: []}, defaultCharactersParams);
    this.refreshCharacters();
  }
  componentWillMount() {
    const {start, end, name, cat, limit} = this.props.location.query;
    this.setState(pruneObject({start, end, name, cat, limit}));
  }
  onBlockChange(ev: Event) {
    // not being able to pass raw objects easily in a select is one disadvantage of React
    const [start, end] = (ev.target as HTMLInputElement).value.split('-');
    this.setParams({start, end});
  }
  onCategoryChange(ev: Event) {
    // not being able to pass raw objects easily in a select is one disadvantage of React
    const cat = (ev.target as HTMLInputElement).value;
    this.setParams({cat});
  }
  onParamChange(key: string, ev: Event) {
    const value = (ev.target as HTMLInputElement).value;
    this.setParams({[key]: value});
  }
  /** wrapper around setState */
  setParams(params) {
    // setState's type declarations are wrong. It shouldn't require that the
    // argument be a full state, but only a subset of the state interface.
    this.setState(params, () => {
      const {start, end, name, cat, limit} = pruneObject(this.state);
      const query = pruneObject({start, end, name, cat, limit});
      this.context['router'].push({pathname: this.props.location.pathname, query});
    });
    // recompute matchingCharacters
    this.refreshCharacters();
  }
  /** debounce running findCharacters for 250ms */
  refreshCharacters() {
    if (!this._findCharactersQueued) {
      this._findCharactersQueued = true;
      setTimeout(() => {
        const {start, end, name, cat} = this.state;
        const characters = findCharacters({
          start: parseInt(start, 10),
          end: parseInt(end, 10),
          name: name.toUpperCase(),
          cat,
        });
        this.setState({characters});
        this._findCharactersQueued = false;
      }, 250);
    }
  }
  render() {
    // Blocks and GeneralCategories are globals
    const {start, end, name, cat, limit, characters} = this.state;
    const limitedCharacters = characters.slice(0, parseInt(limit, 10) || 256);
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
    );
  }
}
// TypeScript / React.d.ts chokes on a normal `static contextTypes = { ... }`
CharactersView['contextTypes'] = {
  router: React.PropTypes.object.isRequired,
};

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
};
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
};
export function normalize(raw: string): string {
  // remove all character codes 0 through 31 (space is 32 == 0x1F)
  const visible = raw.replace(/[\x00-\x1F]/g, '');
  // 2. replace combining characters that are currently combining with a space
  // by the lone combiner so that they'll combine with the following character
  // instead, as intended.
  const decompositions_applied = visible.replace(/[\u00A8\u00AF\u00B4\u00B8\u02D8-\u02DD]/g, (modifier) => {
    return decomposable_modifiers[modifier];
  });
  // 1. replace (modifier, letter) pairs with a single modified-letter character
  //    688 - 767
  const modifiers_applied = decompositions_applied.replace(/([\u02B0-\u02FF])(.)/g, (m0, modifier, modified) => {
    if (modifier in modifier_to_combiner) {
      return modified + modifier_to_combiner[modifier];
    }
    return modifier + modified;
  });
  // and replacing the combining character pairs with precombined characters where possible
  // const canonical = convert_to_nfc(normalized);
  return modifiers_applied;
}
function charCodeUrl(charCode: number): string {
  return `#/characters?start=${charCode}&end=${charCode}`;
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
  );
};
const NormalizationTable = ({input, form}: {input: string, form: string}) => {
  if (form === 'Custom') {
    input = normalize(input);
  }
  else if (form !== 'Original') {
    input = input.normalize(form);
  }
  const charCodes: number[] = [];
  for (let i = 0; i < input.length; i++) {
    charCodes[i] = input.charCodeAt(i);
  }
  return (
    <section className="hpad">
      <h3>{form}: {input}</h3>
      <CharCodesTable charCodes={charCodes} />
    </section>
  );
};
class StringView extends React.Component<{location: Location}, {input: string}> {
  constructor() {
    super();
    this.state = {input: ''};
  }
  onInputChanged(ev) {
    const input = ev.target.value;
    this.setState({input});
    const query = pruneObject({input});
    this.context['router'].push({pathname: this.props.location.pathname, query});
  }
  render() {
    const normalizationForms = ['Original', 'Custom', 'NFC', 'NFD', 'NFKC', 'NFKD'];
    const {input} = this.state;
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
    );
  }
}
StringView['contextTypes'] = {
  router: React.PropTypes.object.isRequired,
};

class App extends React.Component<{children: any, location: any}, {}> {
  render() {
    const {pathname} = this.props.location;
    const tabs = [
      {href: "/characters", content: "Character Table"},
      {href: "/string", content: "String"},
    ];
    return (
      <div>
        <nav>
          {tabs.map(tab =>
            <span key={tab.href} className={`tab ${pathname === tab.href ? 'current' : ''}`}>
              <a href={`#${tab.href}`}>{tab.content}</a>
            </span>
          )}
        </nav>
        <main>{this.props.children}</main>
      </div>
    );
  }
}

const appHistory = useRouterHistory(useQueries(createHashHistory))({queryKey: false});

ReactDOM.render((
  <Router history={appHistory}>
    <Route path="/" component={App}>
      <IndexRedirect to="/characters" />
      <Route path="characters" component={CharactersView} />
      <Route path="string" component={StringView} />
    </Route>
  </Router>
), document.getElementById('app'));
