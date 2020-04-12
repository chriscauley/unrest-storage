//const Storage = require('../dist').default
import Storage from '../src'

const basic = () => {
  // this test covers basic functionality
  const storage = new Storage("prefix")

  // items can be saved and recalled from storage
  storage.set("foo", "bar")
  expect(storage.get('foo')).toBe("bar")
  expect(storage.keys.length).toBe(1)
  expect(storage.has('foo')).toBe(true)
  expect(storage.list()).toEqual(["bar"])

  // items can be overwritten
  storage.set("foo", {what: 'ever'})
  expect(storage.get('foo')).toEqual({what: 'ever'})
  expect(storage.keys.length).toBe(1)

  storage.update({foo: 'bar', arst: 'neio'})
  expect(storage.keys).toEqual(['foo', 'arst'])

  storage.remove('foo')
  expect(storage.get('foo')).toBe(undefined)

}

test('Storage', () => {
  basic()

  // creating a new storage with the same prefix uses the same values as the previous storage
  // this is meant to emulate refreshing the browser
  const storage2 = new Storage("prefix")
  expect(storage2.get('arst')).toEqual('neio')
})

test('Storage.set(key, undefined) deletes', () => {
  // '' and 0 are the only falsey values that can be stored
  // this is becaus null, false, and undef
  const storage = new Storage("remove-prefix")
  storage.update({foo: 'bar'})
  storage.set('foo', undefined)
  expect(storage.keys).toEqual([])
})

test('Storage.clear deletes everything', () => {
  const storage = new Storage("clear-prefix")
  storage.update({foo: 'bar'})
  storage.clear()
  expect(storage.keys).toEqual([])
})

test('dummy storage', () => {
  // removing global.localStorage emulates window.localStorage
  const { localStorage, console } = global
  delete global.localStorage
  global.console = { warn: () => {}}
  basic()
  global.localStorage = localStorage
  global.console = console
})