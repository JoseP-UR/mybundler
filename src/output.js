
    (function (moduleMapping) {
        function require(id) {
            var [func, map] = moduleMapping[id];
    
            function scopedRequire(relativePath) {
                return require(map[relativePath])
            };
    
            var module = { exports: {} };
    
            func(scopedRequire, module, module.exports);
    
            return module.exports;
        }
    
        require(1);
    })({
        1: [
            function(require, module, exports) {
                "use strict";

var _action = _interopRequireDefault(require("./action.js"));

var _user = _interopRequireDefault(require("./user.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

console.log(_action["default"].getMessage('test'));
console.log(_user["default"]);
            },
            {"./action.js":2,"./user.js":3}
        ],2: [
            function(require, module, exports) {
                "use strict";

var _user = _interopRequireDefault(require("./user.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function getMessage(user) {
  var selected = _user["default"].users.filter(function (item) {
    return item.name == user;
  })[0];

  return selected.message;
}

;
module.exports = {
  getMessage: getMessage
};
            },
            {"./user.js":4}
        ],3: [
            function(require, module, exports) {
                "use strict";

var userData = {
  users: [{
    name: "test",
    message: "Hello World"
  }, {
    name: "another",
    message: "hi"
  }]
};
module.exports = userData;
            },
            {}
        ],4: [
            function(require, module, exports) {
                "use strict";

var userData = {
  users: [{
    name: "test",
    message: "Hello World"
  }, {
    name: "another",
    message: "hi"
  }]
};
module.exports = userData;
            },
            {}
        ],
    })
    