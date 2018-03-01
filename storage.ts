export default {
  get selectedBases(): Set<string> {
    const data = localStorage.getItem('selectedBases') || ''
    return new Set(data.split(',').filter(s => s))
  },
  set selectedBases(value: Set<string>) {
    const data = [...value].join(',')
    localStorage.setItem('selectedBases', data)
  }
}
