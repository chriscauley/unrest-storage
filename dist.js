"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Storage = /*#__PURE__*/function () {
  function Storage(prefix) {
    var _this = this;

    _classCallCheck(this, Storage);

    _defineProperty(this, "_", function (key) {
      return _this.PREFIX + key;
    });

    _defineProperty(this, "_removeItem", function (key) {
      return localStorage.removeItem(_this._(key));
    });

    _defineProperty(this, "_hasOwnProperty", function (key) {
      return localStorage.hasOwnProperty(_this._(key));
    });

    _defineProperty(this, "_setItem", function (key, value) {
      _this.__CACHE[key] = value;
      localStorage.setItem(_this._(key), value);
    });

    _defineProperty(this, "get", function (key) {
      if (_this._hasOwnProperty(key)) {
        return JSON.parse(_this._getItem(key));
      }
    });

    _defineProperty(this, "update", function (data) {
      return Object.entries(data).forEach(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            key = _ref2[0],
            value = _ref2[1];

        return _this.set(key, value);
      });
    });

    _defineProperty(this, "has", function (key) {
      return _this.keys.indexOf(key) !== -1;
    });

    _defineProperty(this, "list", function () {
      return _this.keys.map(_this.get);
    });

    this.PREFIX = prefix;
    this.META = 'META/';
    this.__CACHE = {};

    if (!this.test_supported()) {
      console.warn('Storage not supported, falling back to dummy storage');
      var FAKE_STORAGE = {};

      this._setItem = function (key, value) {
        return FAKE_STORAGE[key] = value;
      };

      this._removeItem = function (key) {
        return delete FAKE_STORAGE[key];
      };

      this._getItem = function (key) {
        return FAKE_STORAGE[key];
      };

      this.has = this._hasOwnProperty = function (key) {
        return FAKE_STORAGE.hasOwnProperty(key);
      };
    }

    this.times = this.get(this.META + 'times') || {};
    this.keys = this.get(this.META + 'keys') || [];
  }

  _createClass(Storage, [{
    key: "_getItem",
    value: function _getItem(key) {
      if (this.__CACHE[key] === undefined) {
        this.__CACHE[key] = localStorage.getItem(this._(key));
      }

      return this.__CACHE[key];
    }
  }, {
    key: "set",
    value: function set(key, value) {
      // store stringified json in localstorage
      if (typeof value === 'undefined') {
        this.remove(key);
        return;
      }

      this._setItem(key, JSON.stringify(value));

      this.times[key] = new Date().valueOf();

      if (!this.keys.includes(key)) {
        this.keys.push(key);
      }

      this._save();

      return this.get(key);
    }
  }, {
    key: "remove",
    value: function remove(key) {
      // note, removing a key will revert to default (if present), not undefined
      this._removeItem(key);

      this.keys = this.keys.filter(function (k) {
        return k !== key;
      });
      delete this.times[key];

      this._save();
    }
  }, {
    key: "clear",
    value: function clear() {
      for (var key in this.times) {
        this.remove(key);
      }

      this._save();
    }
  }, {
    key: "_save",
    value: function _save() {
      this._setItem(this.META + 'times', JSON.stringify(this.times));

      this._setItem(this.META + 'keys', JSON.stringify(this.keys));
    }
  }, {
    key: "test_supported",
    value: function test_supported() {
      // incognito safari and older browsers don't support local storage. Use an object in ram as a dummy
      try {
        var rando = Math.random();
        localStorage.setItem(rando, '1');
        localStorage.removeItem(rando);
        return true;
      } catch (e) {
        console.warn('No local storage found. Falling back.');
      }
    }
  }]);

  return Storage;
}();

exports["default"] = Storage;
