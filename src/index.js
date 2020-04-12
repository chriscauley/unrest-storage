export default class Storage {
  constructor(prefix) {
    this.PREFIX = prefix
    this.META = 'META/'
    this.__CACHE = {}
    if (!this.test_supported()) {
      console.warn('Storage not supported, falling back to dummy storage')
      const FAKE_STORAGE = {}
      this._setItem = (key, value) => FAKE_STORAGE[key] = value
      this._removeItem = key => delete FAKE_STORAGE[key]
      this._getItem = key => FAKE_STORAGE[key]
      this.has = this._hasOwnProperty = key => FAKE_STORAGE.hasOwnProperty(key)
    }
    this.times = this.get(this.META + 'times') || {}
    this.keys = this.get(this.META + 'keys') || []
  }

  _ = key => this.PREFIX + key
  _removeItem = (key) => localStorage.removeItem(this._(key))
  _hasOwnProperty= (key) => localStorage.hasOwnProperty(this._(key))
  _getItem(key) {
    if (this.__CACHE[key] === undefined) {
      this.__CACHE[key] = localStorage.getItem(this._(key))
    }
    return this.__CACHE[key]
  }
  _setItem = (key, value) => {
    this.__CACHE[key] = value
    localStorage.setItem(this._(key), value)
  }

  get = (key) => {
    if (this._hasOwnProperty(key)) {
      return JSON.parse(this._getItem(key))
    }
  }

  update = data => Object.entries(data).forEach(([key, value]) => this.set(key, value))
  has = key => this.keys.indexOf(key) !== -1
  list = () => this.keys.map(this.get)

  set(key, value) {
    // store stringified json in localstorage
    if (typeof value === 'undefined') {
      this.remove(key)
      return
    }
    this._setItem(key, JSON.stringify(value))
    this.times[key] = new Date().valueOf()
    if (!this.keys.includes(key)) {
      this.keys.push(key)
    }
    this._save()
    return this.get(key)
  }

  remove(key) {
    // note, removing a key will revert to default (if present), not undefined
    this._removeItem(key)
    this.keys = this.keys.filter(k => k !== key)
    delete this.times[key]
    this._save()
  }

  clear() {
    for (const key in this.times) {
      this.remove(key)
    }
    this._save()
  }

  _save() {
    this._setItem(this.META + 'times', JSON.stringify(this.times))
    this._setItem(this.META + 'keys', JSON.stringify(this.keys))
  }

  test_supported() {
    // incognito safari and older browsers don't support local storage. Use an object in ram as a dummy
    try {
      const rando = Math.random()
      localStorage.setItem(rando, '1')
      localStorage.removeItem(rando)
      return true
    } catch (e) {
      return false
    }
  }
}
