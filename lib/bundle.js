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
	
	var _asset_loader = __webpack_require__(10);
	
	var _asset_loader2 = _interopRequireDefault(_asset_loader);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	document.addEventListener('DOMContentLoaded', function () {
	  start();
	  $("#restart").on("click", restart);
	  $("#board").on("contextmenu", function (e) {
	    return false;
	  });
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
	
	var _util_func = __webpack_require__(5);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Board = function () {
	  function Board(stage) {
	    var _this = this;
	
	    _classCallCheck(this, Board);
	
	    this.stage = stage;
	    this.ticker = createjs.Ticker;
	    this.ticker.framerate = 60;
	    this.render = this.render.bind(this);
	    this.run = this.run.bind(this);
	    this.levelScreen = $("#modal");
	    $(".close").on("click", function () {
	      _this.game.paused = false;
	      _this.levelScreen.toggleClass("show");
	    });
	
	    this.backgroundMusic = new Audio("./assets/sounds/background.wav");
	    this.gameSounds = {
	      hit: new Audio("./assets/sounds/hit.ogg"),
	      death: new Audio("./assets/sounds/death.ogg"),
	      crab_death: new Audio("./assets/sounds/crab_death.ogg"),
	      level: new Audio("./assets/sounds/level.ogg")
	    };
	
	    this.backgroundMusic.play();
	
	    this.backgroundMusic.addEventListener("ended", function () {
	      _this.backgroundMusic.currentTime = 0;
	      _this.backgroundMusic.play();
	    }, true);
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
	        this.stage.removeAllChildren();
	        this.ticker.removeAllEventListeners("tick");
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
	      this.game = new _game2.default(this.stage, this.assets, this.levelScreen, this.gameSounds);
	
	      var game = this.game;
	      var stage = this.stage;
	      var assets = this.assets;
	
	      game.player.draw(stage);
	      (0, _util_func.objEach)(game.enemies, function (enemy) {
	        enemy.draw(stage);
	      });
	
	      this.ticker.addEventListener("tick", this.run);
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
	
	var _main = __webpack_require__(3);
	
	var _main2 = _interopRequireDefault(_main);
	
	var _enemy = __webpack_require__(8);
	
	var _enemy2 = _interopRequireDefault(_enemy);
	
	var _util_func = __webpack_require__(5);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Game = function () {
	  function Game(stage, assets, levelScreen, sounds) {
	    _classCallCheck(this, Game);
	
	    this.sounds = sounds;
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
	      spd: 5,
	      exp: 0,
	      expToLevel: 2,
	      pos: [250, 250],
	      color: "#0c0",
	      stage: stage,
	      swing: assets.swing,
	      body: assets.char,
	      levelScreen: levelScreen,
	      pause: this.pauseToggle(),
	      level: this.sounds.level
	    });
	    this.enemies = {};
	    this.items = [];
	    this.floors = [];
	    this.walls = [];
	    this.setName = this.setName.bind(this);
	    this.addItem = this.addItem.bind(this);
	    this.createEnemies();
	    $("#initial-modal").toggleClass("show");
	    $("#start").on("click", this.setName);
	    this.drawFloor();
	  }
	
	  _createClass(Game, [{
	    key: 'drawFloor',
	    value: function drawFloor() {
	      for (var i = 0; i < 20; i++) {
	        for (var j = 0; j < 20; j++) {
	          var obj = void 0;
	          var prop = void 0;
	          if (j === 0 || j === 19 || i === 0 || i === 19) {
	            obj = new createjs.Bitmap(this.assets.generateRandomWall());
	            prop = "walls";
	          } else {
	            obj = new createjs.Bitmap(this.assets.generateRandomFloor());
	            prop = "floors";
	          }
	          obj.scaleX = 0.52;
	          obj.scaleY = 0.52;
	          obj.x = 25 * i;
	          obj.y = 25 * j;
	          this[prop].push(obj);
	          this.stage.addChild(obj);
	        }
	      }
	    }
	  }, {
	    key: 'updateFloor',
	    value: function updateFloor() {
	      var floors = this.floors;
	      var walls = this.walls;
	      var assets = this.assets;
	
	      for (var i = 0; i < floors.length; i++) {
	        floors[i].image = assets.generateRandomFloor();
	      }
	      for (var _i = 0; _i < walls.length; _i++) {
	        walls[_i].image = assets.generateRandomWall();
	      }
	    }
	  }, {
	    key: 'setName',
	    value: function setName(e) {
	      e.preventDefault();
	      var name = $("#name-input")[0].value;
	      if (name === "") {
	        window.alert("Shy? Just tell me your name.");
	      } else {
	        this.player.name = name;
	        this.player.display.update(this.player);
	        $("#initial-modal").toggleClass("show");
	        $("#start").off("click", this.setName);
	        $("input").blur();
	
	        this.player.setItems(name);
	        this.paused = false;
	      }
	    }
	  }, {
	    key: 'tick',
	    value: function tick() {
	      var _this = this;
	
	      var player = this.player;
	      var enemies = this.enemies;
	      var stage = this.stage;
	      var paused = this.paused;
	
	      if (player.hp > 0) {
	        (function () {
	          var pos = player.pos;
	          if (!paused) {
	            player.step();
	            _this.checkCollisions();
	            (0, _util_func.objEach)(enemies, function (enemy) {
	              enemy.step(pos);
	            });
	            if (Object.keys(enemies).length === 0) {
	              _this.nextLevel();
	            }
	          }
	        })();
	      }
	    }
	  }, {
	    key: 'addItem',
	    value: function addItem(item) {
	      this.items.push(item);
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
	      var _this2 = this;
	
	      var player = this.player;
	      var stage = this.stage;
	      var enemies = this.enemies;
	      var items = this.items;
	
	      (0, _util_func.objEach)(enemies, function (enemy) {
	        if (!player.invic && (0, _util_func.isCircleRectCollide)(enemy.hitBox, player.hitBox)) {
	          var vec = (0, _util_func.normalize)(player.pos, enemy.pos);
	          var body = player.takeDmg(enemy.att, vec);
	          player.invincible();
	          _this2.sounds.hit.play();
	          if (body) {
	            _this2.sounds.death.play();
	            player.die();
	          }
	        }
	        var currentItems = items.slice(0);
	        for (var i = 0; i < currentItems.length; i++) {
	          if ((0, _util_func.isCircleRectCollide)(currentItems[i].hitBox, player.hitBox)) {
	            currentItems[i].pickUp(stage, player);
	            items.splice(i, 1);
	          }
	        }
	
	        if (player.attacking && !player.attacked) {
	          if ((0, _util_func.isCircle2Collide)(player.swingBox, enemy.hitBox)) {
	            var _vec = (0, _util_func.normalize)(enemy.pos, player.pos);
	            var _body = enemy.takeDmg(player.att, _vec);
	            _this2.sounds.hit.play();
	            if (_body && !player.attacked) {
	              _this2.sounds.crab_death.play();
	              delete enemies[enemy.name];
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
	        var r1 = Math.floor(Math.random() * 390) + 60;
	        var r2 = Math.floor(Math.random() * 390) + 60;
	        var enemy = new _enemy2.default({
	          name: "Crab" + i,
	          stage: this.stage,
	          hp: lvl * 2,
	          lvl: lvl,
	          att: lvl * 1.5,
	          def: lvl,
	          exp: lvl / 2,
	          spd: lvl * 0.8,
	          pos: [r1, r2],
	          color: "#c00",
	          crab: this.assets.generateCrab(),
	          newBag: this.assets.newBag,
	          addItem: this.addItem
	        });
	        this.enemies[enemy.name] = enemy;
	      }
	    }
	  }, {
	    key: 'nextLevel',
	    value: function nextLevel() {
	      var game = this;
	      var stage = this.stage;
	      var enemies = this.enemies;
	
	      this.level += 1;
	      this.player.invincible();
	      this.updateFloor();
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
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };
	
	var _entity_obj = __webpack_require__(4);
	
	var _entity_obj2 = _interopRequireDefault(_entity_obj);
	
	var _user_display = __webpack_require__(6);
	
	var _user_display2 = _interopRequireDefault(_user_display);
	
	var _inventory = __webpack_require__(7);
	
	var _inventory2 = _interopRequireDefault(_inventory);
	
	var _item = __webpack_require__(9);
	
	var _item2 = _interopRequireDefault(_item);
	
	var _util_func = __webpack_require__(5);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var Character = function (_Entity) {
	  _inherits(Character, _Entity);
	
	  function Character(options) {
	    _classCallCheck(this, Character);
	
	    var _this = _possibleConstructorReturn(this, (Character.__proto__ || Object.getPrototypeOf(Character)).call(this, options));
	
	    _this.equipped = {};
	    _this.level = options.level;
	    _this.swing = options.swing;
	    _this.pause = options.pause;
	    _this.inventory = new _inventory2.default();
	    _this.body = options.body;
	    _this.invic = false;
	    _this.expToLevel = options.expToLevel;
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
	    _this.toggleEquip = _this.toggleEquip.bind(_this);
	    _this.removeItem = _this.removeItem.bind(_this);
	    $(".equip").on("click", _this.toggleEquip);
	    $(".delete").on("click", _this.removeItem);
	    return _this;
	  }
	
	  _createClass(Character, [{
	    key: 'setItems',
	    value: function setItems(name) {
	      var items = JSON.parse(localStorage.getItem(name));
	      if (!items) {
	        return;
	      }
	      for (var i = 0; i < items.length; i++) {
	        var item = new _item2.default(items[i]);
	        this.inventory.addItem(item);
	      }
	    }
	  }, {
	    key: 'invincible',
	    value: function invincible() {
	      var player = this;
	      this.invic = true;
	      window.setTimeout(function () {
	        return player.invic = false;
	      }, 500);
	    }
	  }, {
	    key: 'removeItem',
	    value: function removeItem(e) {
	      e.preventDefault();
	      var idx = e.target.dataset.id;
	      var item = this.inventory.getItem(idx);
	      if (this.equipped[item.id]) {
	        this.unequip(item);
	      }
	      this.inventory.removeItem(idx);
	    }
	  }, {
	    key: 'toggleEquip',
	    value: function toggleEquip(e) {
	      e.preventDefault();
	      var idx = e.target.dataset.id;
	      var item = this.inventory.getItem(idx);
	      if (this.equipped[item.id]) {
	        this.unequip(item, idx);
	      } else {
	        this.equip(item, idx);
	      }
	    }
	  }, {
	    key: 'equip',
	    value: function equip(item, idx) {
	      if (Object.keys(this.equipped).length < 3) {
	        this.equipped[item.id] = item;
	        this[item.stat] += item[item.stat];
	        if (item.stat === "maxHp") {
	          this.hp += item[item.stat];
	        }
	        this.display.update(this);
	        item.equipped = true;
	        $("#item" + idx).addClass("equipped");
	      }
	    }
	  }, {
	    key: 'unequip',
	    value: function unequip(item, idx) {
	      this[item.stat] -= item[item.stat];
	      if (item.stat === "maxHp") {
	        this.hp -= item[item.stat];
	      }
	      delete this.equipped[item.id];
	      this.display.update(this);
	      item.equipped = false;
	      $("#item" + idx).removeClass("equipped");
	    }
	  }, {
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
	        localStorage.setItem(this.name, this.getEquipped());
	        $(".equip").off("click", this.toggleEquip);
	        $(".delete").off("click", this.removeItem);
	      }
	    }
	  }, {
	    key: 'getEquipped',
	    value: function getEquipped() {
	      var items = [];
	      var keys = Object.keys(this.equipped);
	      for (var i = 0; i < keys.length; i++) {
	        items.push(this.equipped[keys[i]]);
	      }
	
	      return JSON.stringify(items);
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
	      this.level.play();
	      this.lvl += 1;
	      this.maxHp += 2;
	      this.hp = this.maxHp;
	      this.exp = 0;
	      this.attr = 4;
	      this.expToLevel = this.lvl * this.lvl;
	      this.display.update(this);
	      this.pause();
	
	      $(".plus").on("click", this.handleStatUp);
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
	        $(".plus").off("click", this.handleStatUp);
	        this.levelScreen.toggleClass("show");
	        this.receiveStats();
	      }
	    }
	  }]);
	
	  return Character;
	}(_entity_obj2.default);
	
	exports.default = Character;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _util_func = __webpack_require__(5);
	
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
	    var stage = options.stage;
	
	    this.name = name;
	    this.lvl = lvl;
	    this.maxHp = hp;
	    this.hp = hp;
	    this.att = att;
	    this.def = def;
	    this.pos = pos;
	    this.exp = exp;
	    this.stage = stage;
	    this.spd = spd || 1;
	    this.animation = "stand";
	    this.changeAnim = false;
	  }
	
	  _createClass(Entity, [{
	    key: "takeDmg",
	    value: function takeDmg(attk, vec) {
	      var dmg = attk - this.def;
	      if (dmg < 1) {
	        dmg = 1;
	      }
	      this.hp -= dmg;
	      var scale = (60 + 10 * attk) / this.spd;
	      this.move([scale * vec[0], scale * vec[1]], true);
	      if (this.hp <= 0) {
	        return this.body;
	      }
	    }
	  }, {
	    key: "draw",
	    value: function draw(stg) {
	      var pos = this.pos;
	      var body = this.body;
	      var animation = this.animation;
	
	      body.zIndex = 500;
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
	      dir = [dir[0] * (spd / 5), dir[1] * (spd / 5)];
	      var newPos = this.checkBounds((0, _util_func.sumArr)(this.pos, dir));
	      this.pos = newPos;
	      body.x = newPos[0];
	      body.y = newPos[1];
	    }
	  }, {
	    key: "checkBounds",
	    value: function checkBounds(pos) {
	      var bounds = this.body.getBounds();
	      var xMax = 475 - bounds.width;
	      var yMax = 475 - bounds.height;
	      var min = this.enemy && this.body.scaleX === -1 ? 20 + bounds.width : 20;
	      if (this.enemy && this.body.scaleX === -1) {
	        xMax = 500;
	      } else if (!this.enemy) {
	        xMax = 450;
	      }
	      if (pos[0] > xMax) {
	        pos[0] = xMax;
	      } else if (pos[0] < min) {
	        pos[0] = min;
	      }
	      if (pos[1] > yMax) {
	        pos[1] = yMax;
	      } else if (pos[1] < 20) {
	        pos[1] = 20;
	      }
	      return pos;
	    }
	  }]);
	
	  return Entity;
	}();
	
	exports.default = Entity;

/***/ },
/* 5 */
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
	exports.distance = distance;
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
	
	function distance(p1, p2) {
	  var x = p1[0] - p2[0];
	  var y = p1[1] - p2[1];
	  return Math.sqrt(x * x + y * y);
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
/* 6 */
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
	      this.hp = hp < 0 ? 0 : hp;
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
/* 7 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Inventory = function () {
	  function Inventory() {
	    _classCallCheck(this, Inventory);
	
	    this.inventory = [];
	    this.num = this.inventory.length;
	    this.removeItem = this.removeItem.bind(this);
	    this.render();
	  }
	
	  _createClass(Inventory, [{
	    key: "addItem",
	    value: function addItem(item) {
	      if (this.inventory.length < 6) {
	        item.id = this.num;
	        this.num++;
	        this.inventory.push(item);
	        this.render();
	      }
	    }
	  }, {
	    key: "removeItem",
	    value: function removeItem(i) {
	      this.inventory.splice(i, 1);
	      this.render();
	    }
	  }, {
	    key: "getItem",
	    value: function getItem(i) {
	      if (this.inventory[i]) {
	        return this.inventory[i];
	      }
	    }
	  }, {
	    key: "render",
	    value: function render() {
	      for (var i = 0; i < 6; i++) {
	        var $item = $("#item" + i);
	        var $del = $("#item" + i + " .delete");
	        var $eq = $("#item" + i + " .equip");
	
	        $del.hide();
	        $eq.hide();
	        $item.removeClass("weapon");
	        $item.removeClass("boots");
	        $item.removeClass("amulet");
	        $item.removeClass("armor");
	        $item.removeClass("held");
	        $item.removeClass("equipped");
	        if (this.inventory[i]) {
	          this.inventory[i].pos = i;
	          switch (this.inventory[i].stat) {
	            case "att":
	              $item.addClass("weapon");
	              break;
	            case "spd":
	              $item.addClass("boots");
	              break;
	            case "maxHp":
	              $item.addClass("amulet");
	              break;
	            case "def":
	              $item.addClass("armor");
	              break;
	          }
	          if (this.inventory[i].equipped) {
	            $item.addClass("equipped");
	          }
	          $item.addClass("held");
	          $del.show();
	          $eq.show();
	        }
	      }
	    }
	  }]);
	
	  return Inventory;
	}();
	
	exports.default = Inventory;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };
	
	var _entity_obj = __webpack_require__(4);
	
	var _entity_obj2 = _interopRequireDefault(_entity_obj);
	
	var _item = __webpack_require__(9);
	
	var _item2 = _interopRequireDefault(_item);
	
	var _util_func = __webpack_require__(5);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var Enemy = function (_Entity) {
	  _inherits(Enemy, _Entity);
	
	  function Enemy(options) {
	    _classCallCheck(this, Enemy);
	
	    var _this = _possibleConstructorReturn(this, (Enemy.__proto__ || Object.getPrototypeOf(Enemy)).call(this, options));
	
	    _this.stats = ['maxHp', 'att', 'def', 'spd'];
	    _this.moveTypes = [[0, 0], [0, 1], [1, 0], [1, 1], [0, -1], [-1, 0], [-1, -1]];
	    _this.steps = 0;
	    _this.dir = [];
	    _this.enemy = true;
	    _this.body = options.crab;
	    _this.newBag = options.newBag;
	    _this.hitBox = {
	      x: _this.pos[0] + 16,
	      y: _this.pos[1] + 16,
	      r: 14
	    };
	    _this.addItem = options.addItem;
	
	    _this.removeBody = _this.removeBody.bind(_this);
	    return _this;
	  }
	
	  _createClass(Enemy, [{
	    key: 'move',
	    value: function move(dir, attacked, chase) {
	      var body = this.body;
	
	
	      if (attacked) {
	        this.steps = 0;
	      } else if (this.steps > 0) {
	        this.steps -= 1;
	        dir = chase ? dir : this.dir;
	      } else {
	        this.dir = dir;
	        this.steps = 30;
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
	    key: 'takeDmg',
	    value: function takeDmg(attk, vec) {
	      var dead = _get(Enemy.prototype.__proto__ || Object.getPrototypeOf(Enemy.prototype), 'takeDmg', this).call(this, attk, vec);
	      if (dead) {
	        this.body.addEventListener("animationend", this.removeBody);
	        this.body.gotoAndPlay("die");
	        return dead;
	      }
	    }
	  }, {
	    key: 'removeBody',
	    value: function removeBody() {
	      var body = this.body;
	      var stage = this.stage;
	
	      body.removeEventListener("animationend", this.removeBody);
	      this.dropItem();
	      stage.removeChild(body);
	    }
	  }, {
	    key: 'step',
	    value: function step(pos) {
	      var dis = (0, _util_func.distance)(this.pos, pos);
	      if (dis < 100) {
	        var vec = (0, _util_func.normalize)(this.pos, pos);
	        var x = -vec[0] / Math.abs(vec[0]);
	        var y = -vec[1] / Math.abs(vec[1]);
	        if (x !== x) {
	          x = 0;
	        }
	        if (y !== y) {
	          y = 0;
	        }
	
	        var dir = [x, y];
	
	        this.move(dir, false, true);
	      }
	      this.move((0, _util_func.sample)(this.moveTypes), false, false);
	    }
	  }, {
	    key: 'dropItem',
	    value: function dropItem() {
	      var stats = {};
	      stats.stat = (0, _util_func.sample)(this.stats);
	      var x = this.pos[0] - 33;
	      stats[stats.stat] = this.lvl;
	      if (this.body.scaleX !== -1) {
	        x = this.pos[0];
	      }
	      var y = this.pos[1];
	      var item = new _item2.default(stats, x, y, this.newBag());
	      item.draw(this.stage);
	      this.addItem(item);
	    }
	  }]);
	
	  return Enemy;
	}(_entity_obj2.default);
	
	exports.default = Enemy;

/***/ },
/* 9 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Item = function () {
	  function Item(stats, x, y, body) {
	    _classCallCheck(this, Item);
	
	    this.id = null;
	    this.pos = null;
	    this.equipped = false;
	    this.stat = stats.stat;
	    this[this.stat] = stats[this.stat];
	    if (body) {
	      this.body = body;
	      this.body.x = x;
	      this.body.y = y;
	      this.hitBox = {
	        x: x + 12,
	        y: y + 15,
	        r: 10
	      };
	    }
	  }
	
	  _createClass(Item, [{
	    key: "draw",
	    value: function draw(stage) {
	      stage.addChild(this.body);
	    }
	  }, {
	    key: "pickUp",
	    value: function pickUp(stage, player) {
	      stage.removeChild(this.body);
	      player.inventory.addItem(this);
	    }
	  }]);
	
	  return Item;
	}();
	
	exports.default = Item;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _util_func = __webpack_require__(5);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Assets = function () {
	  function Assets(callback) {
	    _classCallCheck(this, Assets);
	
	    this.callback = callback;
	    this.manifest = [{ src: "sword_swing.png", id: "swing" }, { src: "crab.png", id: "crab" }, { src: "character.png", id: "char" }, { src: "floors/floor1.png", id: "f1" }, { src: "floors/floor2.png", id: "f2" }, { src: "floors/floor3.png", id: "f3" }, { src: "floors/wall1.webp", id: "w1" }, { src: "floors/wall2.webp", id: "w2" }, { src: "bag.png", id: "bag" }];
	    this.loader = this.loader || new createjs.LoadQueue(false);
	    this.handleComplete = this.handleComplete.bind(this);
	    this.newBag = this.newBag.bind(this);
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
	          attack: [0, 11, "attack", 0.7]
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
	          moveL: [12, 18, "standl", 0.2],
	          moveR: [24, 30, "standr", 0.2],
	          moveD: [36, 42, "standd", 0.2],
	          moveU: [48, 51, "stand", 0.2],
	          warpout: [60, 71, "warpin", 0.2],
	          warpin: [72, 83, "stand"]
	        }
	      }));
	      this.floors = [loader.getResult("f1"), loader.getResult("f2"), loader.getResult("f3")];
	
	      this.walls = [loader.getResult("w1"), loader.getResult("w2")];
	
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
	          stand: [0, 3, "stand", 0.15],
	          moveR: [4, 7, "moveR", 0.15],
	          die: [24, 27, "die", 0.15]
	        }
	      }));
	    }
	  }, {
	    key: "generateRandomFloor",
	    value: function generateRandomFloor() {
	      return (0, _util_func.sample)(this.floors);
	    }
	  }, {
	    key: "generateRandomWall",
	    value: function generateRandomWall() {
	      return (0, _util_func.sample)(this.walls);
	    }
	  }, {
	    key: "newBag",
	    value: function newBag() {
	      return new createjs.Bitmap(this.loader.getResult("bag"));
	    }
	  }]);
	
	  return Assets;
	}();
	
	exports.default = Assets;

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map