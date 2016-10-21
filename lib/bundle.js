/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _board = __webpack_require__(1);
	
	var _board2 = _interopRequireDefault(_board);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	document.addEventListener('DOMContentLoaded', function () {
	  start();
	  $("#restart").on("click", restart);
	});
	
	function restart() {
	  $("#end-modal").toggleClass("show");
	  start();
	}
	
	function start() {
	  var stage = new createjs.Stage("board");
	  var board = new _board2.default(stage);
	  board.start();
	}

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _game = __webpack_require__(2);
	
	var _game2 = _interopRequireDefault(_game);
	
	var _asset_loader = __webpack_require__(10);
	
	var _asset_loader2 = _interopRequireDefault(_asset_loader);
	
	var _util_func = __webpack_require__(3);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Board = function () {
	  function Board(stage) {
	    var _this = this;
	
	    _classCallCheck(this, Board);
	
	    this.stage = stage;
	    this.render = this.render.bind(this);
	    this.run = this.run.bind(this);
	    this.levelScreen = $("#modal");
	    $(".close").on("click", function () {
	      _this.game.paused = false;
	      _this.levelScreen.toggleClass("show");
	    });
	  }
	
	  _createClass(Board, [{
	    key: 'start',
	    value: function start() {
	      this.assets = new _asset_loader2.default(this.render);
	    }
	  }, {
	    key: 'run',
	    value: function run() {
	      var game = this.game;
	      var stage = this.stage;
	
	      if (game.player.gameOver) {
	        window.clearInterval(this.interval);
	        $("#end-modal").toggleClass("show");
	      } else {
	        this.game.tick();
	        this.stage.update();
	      }
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var board = this;
	      this.game = new _game2.default(this.stage, this.assets, this.levelScreen);
	
	      var game = this.game;
	      var stage = this.stage;
	      var assets = this.assets;
	
	      game.player.draw(stage);
	      (0, _util_func.objEach)(game.enemies, function (enemy) {
	        enemy.draw(stage);
	      });
	
	      this.interval = window.setInterval(this.run, 30);
	    }
	  }]);
	
	  return Board;
	}();
	
	exports.default = Board;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _main = __webpack_require__(4);
	
	var _main2 = _interopRequireDefault(_main);
	
	var _enemy = __webpack_require__(6);
	
	var _enemy2 = _interopRequireDefault(_enemy);
	
	var _util_func = __webpack_require__(3);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Game = function () {
	  function Game(stage, assets, levelScreen) {
	    _classCallCheck(this, Game);
	
	    this.level = 1;
	    this.stage = stage;
	    this.assets = assets;
	    this.paused = true;
	    this.player = new _main2.default({
	      name: "",
	      hp: 2,
	      lvl: 1,
	      att: 1,
	      def: 1,
	      exp: 0,
	      expToLevel: 2,
	      pos: [250, 250],
	      color: "#0c0",
	      stage: stage,
	      swing: assets.swing,
	      body: assets.char,
	      levelScreen: levelScreen,
	      pause: this.pauseToggle()
	    });
	    this.enemies = {};
	    this.setName = this.setName.bind(this);
	    this.createEnemies();
	    $("#initial-modal").toggleClass("show");
	    $("#start").on("click", this.setName);
	  }
	
	  _createClass(Game, [{
	    key: 'setName',
	    value: function setName(e) {
	      e.preventDefault();
	      var name = $("#name-input")[0].value;
	      this.player.name = name;
	      this.player.display.update(this.player);
	      $("#initial-modal").toggleClass("show");
	      $("#start").off("click", this.setName);
	      this.paused = false;
	    }
	  }, {
	    key: 'tick',
	    value: function tick() {
	      var player = this.player;
	      var enemies = this.enemies;
	      var stage = this.stage;
	      var paused = this.paused;
	
	      if (!paused) {
	        player.step();
	        this.checkCollisions();
	        (0, _util_func.objEach)(enemies, function (enemy) {
	          enemy.step();
	        });
	        if (Object.keys(enemies).length === 0) {
	          this.nextLevel();
	        }
	      }
	    }
	  }, {
	    key: 'pauseToggle',
	    value: function pauseToggle() {
	      var game = this;
	      return function () {
	        game.paused = !game.paused;
	      };
	    }
	  }, {
	    key: 'checkCollisions',
	    value: function checkCollisions() {
	      var player = this.player;
	      var stage = this.stage;
	      var enemies = this.enemies;
	
	      (0, _util_func.objEach)(enemies, function (enemy) {
	        if ((0, _util_func.isCircleRectCollide)(enemy.hitBox, player.hitBox)) {
	          var vec = (0, _util_func.normalize)(player.pos, enemy.pos);
	          var body = player.takeDmg(enemy.att, vec);
	          if (body) {
	            player.die();
	          }
	        }
	
	        if (player.attacking && !player.attacked) {
	          if ((0, _util_func.isCircle2Collide)(player.swingBox, enemy.hitBox)) {
	            var _vec = (0, _util_func.normalize)(enemy.pos, player.pos);
	            var _body = enemy.takeDmg(player.att, _vec);
	            if (_body && !player.attacked) {
	              delete enemies[enemy.name];
	              stage.removeChild(_body);
	              player.gainExp(enemy.exp);
	            }
	            player.attacked = true;
	          }
	        }
	      });
	    }
	  }, {
	    key: 'createEnemies',
	    value: function createEnemies() {
	      var lvl = this.level;
	      for (var i = 0; i < lvl; i++) {
	        var r1 = Math.floor(Math.random() * 500);
	        var r2 = Math.floor(Math.random() * 500);
	        var enemy = new _enemy2.default({
	          name: "Crab" + i,
	          stage: this.stage,
	          hp: lvl * 2,
	          lvl: lvl,
	          att: lvl + lvl,
	          def: lvl,
	          exp: lvl,
	          spd: lvl,
	          pos: [r1, r2],
	          color: "#c00",
	          crab: this.assets.generateCrab()
	        });
	        this.enemies[enemy.name] = enemy;
	      }
	    }
	  }, {
	    key: 'nextLevel',
	    value: function nextLevel() {
	      var stage = this.stage;
	      var enemies = this.enemies;
	
	      this.level += 1;
	      this.createEnemies();
	      (0, _util_func.objEach)(enemies, function (enemy) {
	        enemy.draw(stage);
	      });
	    }
	  }]);
	
	  return Game;
	}();
	
	exports.default = Game;

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.sumArr = sumArr;
	exports.sample = sample;
	exports.getSkew = getSkew;
	exports.objEach = objEach;
	exports.normalize = normalize;
	exports.isCircleRectCollide = isCircleRectCollide;
	exports.isCircle2Collide = isCircle2Collide;
	function sumArr(arr1, arr2) {
	  var sum = [];
	  for (var i = 0; i < arr1.length; i++) {
	    sum[i] = arr1[i] + arr2[i];
	  }
	  return sum;
	}
	
	function sample(arr) {
	  return arr[Math.floor(Math.random() * arr.length)];
	}
	
	function getSkew(x, y, posX, posY) {
	  var yDiff = y - posY;
	  var xDiff = x - posX;
	
	  return Math.atan2(yDiff, xDiff) * 180 / Math.PI + 180;
	}
	
	function objEach(obj, func) {
	  var keys = Object.keys(obj);
	  for (var i = 0; i < keys.length; i++) {
	    func(obj[keys[i]]);
	  }
	}
	
	function normalize(p1, p2) {
	  var x = p1[0] - p2[0];
	  var y = p1[1] - p2[1];
	  var dist = Math.sqrt(x * x + y * y);
	  if (dist !== 0) {
	    return [x / dist, y / dist];
	  }
	}
	
	function isCircleRectCollide(c1, r1) {
	  var distX = Math.abs(c1.x - r1.x - r1.w / 2);
	  var distY = Math.abs(c1.y - r1.y - r1.h / 2);
	
	  if (distX > r1.w / 2 + c1.r) {
	    return false;
	  }
	  if (distY > r1.h / 2 + c1.r) {
	    return false;
	  }
	
	  if (distX <= r1.w / 2) {
	    return true;
	  }
	  if (distY <= r1.h / 2) {
	    return true;
	  }
	
	  var dx = distX - r1.w / 2;
	  var dy = distY - r1.h / 2;
	  return dx * dx + dy * dy <= c1.r * c1.r;
	}
	
	function isCircle2Collide(c1, c2) {
	  var dx = c1.x - c2.x;
	  var dy = c1.y - c2.y;
	  var distance = Math.sqrt(dx * dx + dy * dy);
	  return distance < c1.r + c2.r;
	}

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };
	
	var _entity_obj = __webpack_require__(5);
	
	var _entity_obj2 = _interopRequireDefault(_entity_obj);
	
	var _user_display = __webpack_require__(7);
	
	var _user_display2 = _interopRequireDefault(_user_display);
	
	var _util_func = __webpack_require__(3);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var Character = function (_Entity) {
	  _inherits(Character, _Entity);
	
	  function Character(options) {
	    _classCallCheck(this, Character);
	
	    var _this = _possibleConstructorReturn(this, (Character.__proto__ || Object.getPrototypeOf(Character)).call(this, options));
	
	    _this.stage = options.stage;
	    _this.swing = options.swing;
	    _this.pause = options.pause;
	    _this.body = options.body;
	    _this.expToLevel = options.expToLevel;
	    _this.spd = 3;
	    _this.attr = 0;
	    _this.attrShow = $("#attr");
	    _this.animation = "warpin";
	    _this.setKeys();
	    _this.attacking = false;
	    _this.attacked = false;
	    _this.display = new _user_display2.default(_this);
	    _this.levelScreen = options.levelScreen;
	    _this.removeSwing = _this.removeSwing.bind(_this);
	    _this.removeBody = _this.removeBody.bind(_this);
	    _this.useKey = _this.useKey.bind(_this);
	    _this.stopKey = _this.stopKey.bind(_this);
	    _this.attack = _this.attack.bind(_this);
	    _this.handleStatUp = _this.handleStatUp.bind(_this);
	    _this.bindKeys();
	
	    _this.swingBox = {
	      x: 0,
	      y: 0,
	      r: 20
	    };
	
	    _this.hitBox = {
	      x: _this.pos[0] + 7,
	      y: _this.pos[1] + 6,
	      w: 15,
	      h: 24
	    };
	
	    $(".plus").on("click", _this.handleStatUp);
	    return _this;
	  }
	
	  _createClass(Character, [{
	    key: 'setKeys',
	    value: function setKeys() {
	      this.keys = {
	        87: false,
	        65: false,
	        83: false,
	        68: false
	      };
	    }
	  }, {
	    key: 'takeDmg',
	    value: function takeDmg(att, dir) {
	      if (!this.dead) {
	        var val = _get(Character.prototype.__proto__ || Object.getPrototypeOf(Character.prototype), 'takeDmg', this).call(this, att, dir);
	        this.display.update(this);
	        return val;
	      }
	    }
	  }, {
	    key: 'step',
	    value: function step() {
	      var char = this;
	      var keys = char.keys;
	      var attacking = char.attacking;
	      var dead = char.dead;
	
	      if (!attacking && !dead) {
	        (0, _util_func.objEach)(keys, function (key) {
	          if (key) {
	            if (key === 87) {
	              char.checkAnimation("moveU");
	              char.move([0, -1]);
	            } else if (key === 65) {
	              char.checkAnimation("moveL");
	              char.move([-1, 0]);
	            } else if (key === 83) {
	              char.checkAnimation("moveD");
	              char.move([0, 1]);
	            } else if (key === 68) {
	              char.checkAnimation("moveR");
	              char.move([1, 0]);
	            }
	          }
	        });
	      }
	      this.hitBox.x = this.pos[0] + 7;
	      this.hitBox.y = this.pos[1] + 6;
	    }
	  }, {
	    key: 'die',
	    value: function die() {
	      if (!this.dead) {
	        this.body.addEventListener("animationend", this.removeBody);
	        this.body.gotoAndPlay("warpout");
	        this.dead = true;
	      }
	    }
	  }, {
	    key: 'gainExp',
	    value: function gainExp(exp) {
	      this.exp += exp;
	      if (this.exp >= this.expToLevel) {
	        this.levelUp();
	      }
	      this.display.update(this);
	    }
	  }, {
	    key: 'removeBody',
	    value: function removeBody() {
	      var body = this.body;
	      var stage = this.stage;
	
	      body.removeEventListener("animationend", this.removeBoddy);
	      stage.removeChild(body);
	      this.gameOver = true;
	    }
	  }, {
	    key: 'checkAnimation',
	    value: function checkAnimation(anim) {
	      var currAnim = this.body.currentAnimation;
	      if (currAnim !== anim && currAnim !== "moveU" && currAnim !== "moveD") {
	        this.animation = anim;
	        this.changeAnim = true;
	      }
	    }
	  }, {
	    key: 'levelUp',
	    value: function levelUp() {
	      this.lvl += 1;
	      this.maxHp += 2;
	      this.hp = this.maxHp;
	      this.exp = 0;
	      this.attr = 2;
	      this.expToLevel = 2 * this.lvl;
	      this.display.update(this);
	      this.pause();
	      this.levelScreen.toggleClass("show");
	    }
	  }, {
	    key: 'receiveStats',
	    value: function receiveStats() {
	      this.pause();
	      this.display.update(this);
	    }
	  }, {
	    key: 'attack',
	    value: function attack(e) {
	      var swing = this.swing;
	      var stage = this.stage;
	      var pos = this.pos;
	
	      if (!this.attacking) {
	        var skew = (0, _util_func.getSkew)(e.offsetX, e.offsetY, pos[0], pos[1]);
	        this.attacking = true;
	        this.adjustSwing(swing, skew, pos);
	        stage.addChild(swing);
	        this.skew += 20;
	        swing.addEventListener("animationend", this.removeSwing);
	        swing.gotoAndPlay("attack");
	      }
	    }
	  }, {
	    key: 'adjustSwing',
	    value: function adjustSwing(swing, skew, pos) {
	      var rads = skew * Math.PI / 180;
	      var xAdj = 60 * Math.cos(rads);
	      var yAdj = 60 * Math.sin(rads);
	      swing.x = pos[0] + 15 - xAdj + yAdj / 2;
	      swing.y = pos[1] + 15 - yAdj - xAdj / 2;
	      this.swingBox.x = pos[0] + 15 - 32 * Math.cos(rads);
	      this.swingBox.y = pos[1] + 16 - 33 * Math.sin(rads);
	      swing.width = 50;
	      swing.height = 50;
	      swing.skewX = skew;
	      swing.skewY = skew;
	    }
	  }, {
	    key: 'removeSwing',
	    value: function removeSwing() {
	      var swing = this.swing;
	      var stage = this.stage;
	      var text = this.text;
	
	      this.attacking = false;
	      this.attacked = false;
	      swing.removeEventListener("animationend", this.removeSwing);
	      stage.removeChild(swing);
	    }
	  }, {
	    key: 'bindKeys',
	    value: function bindKeys() {
	      document.addEventListener("keydown", this.useKey);
	      document.addEventListener("keyup", this.stopKey);
	      $("#board").on("click", this.attack);
	    }
	  }, {
	    key: 'useKey',
	    value: function useKey(e) {
	      var keys = this.keys;
	      if (Object.keys(keys).includes(e.keyCode.toString())) {
	        keys[e.keyCode] = e.keyCode;
	      }
	    }
	  }, {
	    key: 'stopKey',
	    value: function stopKey(e) {
	      var keys = this.keys;
	      if (Object.keys(keys).includes(e.keyCode.toString())) {
	        keys[e.keyCode] = false;
	      }
	    }
	  }, {
	    key: 'handleStatUp',
	    value: function handleStatUp(e) {
	      this[e.currentTarget.dataset.stat] += 1;
	      this.attr -= 1;
	      this.display.update(this);
	
	      if (this.attr <= 0) {
	        this.levelScreen.toggleClass("show");
	        this.receiveStats();
	      }
	    }
	  }]);
	
	  return Character;
	}(_entity_obj2.default);
	
	exports.default = Character;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _util_func = __webpack_require__(3);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Entity = function () {
	  function Entity(options) {
	    _classCallCheck(this, Entity);
	
	    var name = options.name;
	    var lvl = options.lvl;
	    var hp = options.hp;
	    var att = options.att;
	    var def = options.def;
	    var pos = options.pos;
	    var spd = options.spd;
	    var exp = options.exp;
	
	    this.name = name;
	    this.lvl = lvl;
	    this.maxHp = hp;
	    this.hp = hp;
	    this.att = att;
	    this.def = def;
	    this.pos = pos;
	    this.exp = exp;
	    this.spd = spd || 1;
	    this.animation = "stand";
	    this.changeAnim = false;
	  }
	
	  _createClass(Entity, [{
	    key: "draw",
	    value: function draw(stg) {
	      var pos = this.pos;
	      var body = this.body;
	      var animation = this.animation;
	
	      stg.addChild(body);
	      body.x = pos[0];
	      body.y = pos[1];
	      body.gotoAndPlay(animation);
	    }
	  }, {
	    key: "move",
	    value: function move(dir) {
	      var body = this.body;
	      var spd = this.spd;
	      var changeAnim = this.changeAnim;
	      var animation = this.animation;
	
	      if (changeAnim) {
	        body.gotoAndPlay(animation);
	        this.changeAnim = false;
	      }
	      dir = [dir[0] * spd, dir[1] * spd];
	      var newPos = this.checkBounds((0, _util_func.sumArr)(this.pos, dir));
	      this.pos = newPos;
	      body.x = newPos[0];
	      body.y = newPos[1];
	    }
	  }, {
	    key: "takeDmg",
	    value: function takeDmg(attk, vec) {
	      this.hp -= attk;
	      var scale = 20 * attk / this.spd;
	      this.move([scale * vec[0], scale * vec[1]], true);
	      if (this.hp <= 0) {
	        return this.body;
	      }
	    }
	  }, {
	    key: "checkBounds",
	    value: function checkBounds(pos) {
	      var bounds = this.body.getBounds();
	      var max = 500 - bounds.width;
	      var min = this.enemy ? bounds.width : 0;
	      if (pos[0] > max) {
	        pos[0] = max;
	      } else if (pos[0] < min && (!this.enemy || this.body.scaleX === -1)) {
	        pos[0] = min;
	      }
	      if (pos[1] > max) {
	        pos[1] = max;
	      } else if (pos[1] < 0) {
	        pos[1] = 0;
	      }
	      return pos;
	    }
	  }]);
	
	  return Entity;
	}();
	
	exports.default = Entity;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };
	
	var _entity_obj = __webpack_require__(5);
	
	var _entity_obj2 = _interopRequireDefault(_entity_obj);
	
	var _util_func = __webpack_require__(3);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var Enemy = function (_Entity) {
	  _inherits(Enemy, _Entity);
	
	  function Enemy(options) {
	    _classCallCheck(this, Enemy);
	
	    var _this = _possibleConstructorReturn(this, (Enemy.__proto__ || Object.getPrototypeOf(Enemy)).call(this, options));
	
	    _this.stage = options.stage;
	    _this.moveTypes = [[0, 0], [0, 1], [1, 0], [1, 1], [0, -1], [-1, 0], [-1, -1]];
	    _this.steps = 0;
	    _this.dir = [];
	    _this.enemy = true;
	    _this.body = options.crab;
	    _this.hitBox = {
	      x: _this.pos[0] + 16,
	      y: _this.pos[1] + 16,
	      r: 14
	    };
	    return _this;
	  }
	
	  _createClass(Enemy, [{
	    key: 'move',
	    value: function move(dir, attacked) {
	      var body = this.body;
	
	      if (attacked) {
	        this.steps = 0;
	      } else if (this.steps > 0) {
	        this.steps -= 1;
	        dir = this.dir;
	      } else {
	        this.dir = dir;
	        this.steps = 10;
	        if (dir[0] === 1) {
	          body.gotoAndPlay("moveR");
	          if (body.scaleX === -1) {
	            this.pos[0] -= 33;
	            body.scaleX = 1;
	          }
	        } else if (dir[0] === 0) {
	          body.gotoAndPlay("stand");
	        } else if (dir[0] === -1) {
	          body.gotoAndPlay("moveR");
	          if (body.scaleX === 1) {
	            this.pos[0] += 33;
	            body.scaleX = -1;
	          }
	        }
	      }
	      _get(Enemy.prototype.__proto__ || Object.getPrototypeOf(Enemy.prototype), 'move', this).call(this, dir);
	      var x = this.pos[0] + 16;
	      if (body.scaleX === -1) {
	        x -= 33;
	      }
	      this.hitBox.x = x;
	      this.hitBox.y = this.pos[1] + 16;
	    }
	  }, {
	    key: 'step',
	    value: function step() {
	      this.move((0, _util_func.sample)(this.moveTypes));
	    }
	  }]);
	
	  return Enemy;
	}(_entity_obj2.default);
	
	exports.default = Enemy;

/***/ },
/* 7 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var UserDisplay = function () {
	  function UserDisplay(char) {
	    _classCallCheck(this, UserDisplay);
	
	    this.update(char);
	  }
	
	  _createClass(UserDisplay, [{
	    key: 'update',
	    value: function update(char) {
	      var name = char.name;
	      var lvl = char.lvl;
	      var hp = char.hp;
	      var att = char.att;
	      var def = char.def;
	      var color = char.color;
	      var spd = char.spd;
	      var exp = char.exp;
	      var expToLevel = char.expToLevel;
	      var attr = char.attr;
	
	      this.name = name;
	      this.lvl = lvl;
	      this.hp = hp;
	      this.att = att;
	      this.def = def;
	      this.spd = spd;
	      this.color = color;
	      this.exp = exp;
	      this.attr = attr;
	      this.expToLevel = expToLevel;
	      this.render();
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      $('.name').text(this.name);
	      $('.lvl').text(this.lvl);
	      $('.hp').text(this.hp);
	      $('.att').text(this.att);
	      $('.def').text(this.def);
	      $('.spd').text(this.spd);
	      $('.exp').text(this.exp + "/" + this.expToLevel);
	      $('#attr').text(this.attr);
	    }
	  }]);
	
	  return UserDisplay;
	}();
	
	exports.default = UserDisplay;

/***/ },
/* 8 */,
/* 9 */,
/* 10 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Assets = function () {
	  function Assets(callback) {
	    _classCallCheck(this, Assets);
	
	    this.callback = callback;
	    this.manifest = [{ src: "sword_swing.png", id: "swing" }, { src: "crab.png", id: "crab" }, { src: "character.png", id: "char" }];
	    this.loader = new createjs.LoadQueue(false);
	    this.handleComplete = this.handleComplete.bind(this);
	    this.setSprites();
	  }
	
	  _createClass(Assets, [{
	    key: "setSprites",
	    value: function setSprites() {
	      this.loader.addEventListener("complete", this.handleComplete);
	      this.loader.loadManifest(this.manifest, true, "./assets/art/");
	    }
	  }, {
	    key: "handleComplete",
	    value: function handleComplete() {
	      var loader = this.loader;
	
	      this.swing = new createjs.Sprite(new createjs.SpriteSheet({
	        images: [loader.getResult("swing")],
	        frames: {
	          width: 50, height: 50,
	          regX: 0, regY: 0
	        },
	        animations: {
	          attack: [0, 11, "attack"]
	        }
	      }));
	      this.char = new createjs.Sprite(new createjs.SpriteSheet({
	        images: [loader.getResult("char")],
	        frames: {
	          width: 32, height: 32,
	          regX: 0, regY: 0
	        },
	        animations: {
	          stand: [3, 3],
	          standl: [0, 0],
	          standr: [1, 1],
	          standd: [2, 2],
	          moveL: [12, 18, "standl", 0.5],
	          moveR: [24, 30, "standr", 0.5],
	          moveD: [36, 42, "standd", 0.5],
	          moveU: [48, 54, "stand", 0.5],
	          warpout: [60, 71, "warpin", 0.5],
	          warpin: [72, 83, "stand"]
	        }
	      }));
	      this.callback();
	    }
	  }, {
	    key: "generateCrab",
	    value: function generateCrab() {
	      var loader = this.loader;
	
	      return new createjs.Sprite(new createjs.SpriteSheet({
	        images: [loader.getResult("crab")],
	        frames: {
	          width: 32, height: 32,
	          regX: 0, regY: 0
	        },
	        animations: {
	          stand: [0, 3, "stand", 0.5],
	          moveR: [4, 8, "moveR", 0.4]
	        }
	      }));
	    }
	  }]);
	
	  return Assets;
	}();
	
	exports.default = Assets;

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map