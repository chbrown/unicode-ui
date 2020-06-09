const ALL_BASES = ['dec', 'hex', 'oct', 'bin']

export default {
  get allBases(): string[] {
    return ALL_BASES
  },
  get selectedBases(): Set<string> {
    const data = localStorage.getItem('selectedBases') || ''
    return new Set(data.split(',').filter(s => s))
  },
  set selectedBases(value: Set<string>) {
    const data = [...value].join(',')
    localStorage.setItem('selectedBases', data)
  }
}
