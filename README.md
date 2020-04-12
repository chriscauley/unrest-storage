# Storage

This is a wrapper around unrest storage that allows for multiple separate storage objects saved behind a prefix. Data must be json-serializeable. This uses '$_$' as an additional global prefix which can be overridden with `Storage.GLOBAL_PREFIX = 'whatever'`

``` javascript
import Storage from '@unrest/storage'
const last_play = { score: 999, kills: 100, rank: "A+" }

const play_storage = new Storage(YOUR_PREFIX)

// set item
// equivalent to localStorage.setItem('$_$' + YOUR_PREFIX + level_id, JSON.stringify(play))
play_storage.set(level.id, play)

// get item
// equivalent to JSON.parse(localStorage.getItem('$_$' + YOUR_PREFIX + level_id))
play_storage.get(level.id)

// remove item
play_storage.remove(level.id)

// list all
play_storage.list()

// list all keys
play_storage.keys

// bulk update
play_storage.update({ key: value, ...})

// bulk remove
play_storage.clear()
```