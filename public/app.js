/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _imageLoader = __webpack_require__(2);

	var _imageLoader2 = _interopRequireDefault(_imageLoader);

	var _createImageNodeUsingTemplate = __webpack_require__(6);

	var _createImageNodeUsingTemplate2 = _interopRequireDefault(_createImageNodeUsingTemplate);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/// Core application example for a photo browser. The app uses the Flickr API
	/// to generate a set of images and reference their various sizes

	__webpack_require__(7);


	document.addEventListener('DOMContentLoaded', initialize);

	function initialize() {
	  var state = {
	    photos: [],
	    currentPhotoIndex: null
	  };

	  // Initialize router
	  window.addEventListener("hashchange", function () {
	    return updateRoute(state);
	  });

	  // Tap lightbox to close
	  document.querySelector('.lightbox').addEventListener('click', function () {
	    window.location.hash = '#';
	  });

	  // Load data
	  var imageLoader = new _imageLoader2.default(state, function () {
	    return displayResults(state);
	  });
	  imageLoader.loadImages();

	  updateRoute(state);
	}

	function updateRoute(state) {
	  var currentPhotoIndex = window.location.hash.slice(7);

	  state.currentPhotoIndex = currentPhotoIndex ? Number(currentPhotoIndex) : null;

	  updateView(state);
	}

	/// When results arrive, populate DOM
	function displayResults(state) {
	  var container = document.createElement('div');
	  var photos = state.photos;


	  for (var i = 0; i < photos.length; i++) {
	    var node = (0, _createImageNodeUsingTemplate2.default)({
	      photo: photos[i],
	      templateId: 'photo',
	      size: 's'
	    });
	    node.href = '#photo=' + i;
	    container.appendChild(node);
	  }

	  container.classList.add('photos');

	  // Replace whole subtree in one operation
	  var previousContainer = document.querySelector('.photos');
	  previousContainer.parentNode.replaceChild(container, previousContainer);

	  updateView(state);
	}

	/// Called whenever the state of the application changes
	function updateView(state) {
	  var photos = state.photos;
	  var currentPhotoIndex = state.currentPhotoIndex;

	  var lightbox = document.querySelector('.lightbox');
	  var previousLink = lightbox.querySelector('.previous');
	  var nextLink = lightbox.querySelector('.next');
	  var showLightbox = typeof currentPhotoIndex === 'number';

	  // Remove loading spinner once we have photos
	  if (photos.length) {
	    document.body.classList.remove('is-initial-load');
	  }

	  lightbox.classList.toggle('is-active', showLightbox);

	  if (!showLightbox) {
	    return;
	  }

	  // Update light box contents
	  var hasPrevious = currentPhotoIndex;
	  var hasNext = currentPhotoIndex < photos.length - 1;

	  previousLink.classList.toggle('is-active', hasPrevious);
	  if (hasPrevious) {
	    previousLink.href = '#photo=' + (currentPhotoIndex - 1);
	  }

	  nextLink.classList.toggle('is-active', hasNext);
	  if (hasNext) {
	    nextLink.href = '#photo=' + (currentPhotoIndex + 1);
	  }

	  var photo = (0, _createImageNodeUsingTemplate2.default)({
	    photo: photos[currentPhotoIndex],
	    templateId: 'lightbox-photo',
	    size: 'l'
	  });
	  var container = lightbox.querySelector('.photo-container');
	  container.innerHTML = '';
	  container.appendChild(photo);
	}

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _httpRequest = __webpack_require__(3);

	var _httpRequest2 = _interopRequireDefault(_httpRequest);

	var _getProperty = __webpack_require__(4);

	var _getProperty2 = _interopRequireDefault(_getProperty);

	var _unwrap = __webpack_require__(5);

	var _unwrap2 = _interopRequireDefault(_unwrap);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	// For now, the request configuration is just static
	var baseUrl = 'https://api.flickr.com/services/rest/';
	var config = {
	  api_key: '36357bcc49eb2158337eeb5520448f4c',
	  method: 'flickr.photosets.getPhotos',
	  photoset_id: '72157637612059163',
	  per_page: 60,
	  extras: ['description', 'url_l', 'url_s'].join(','),
	  format: 'json'
	};
	var queryString = Object.keys(config).map(function (key) {
	  return key + '=' + config[key];
	}).join('&');
	var url = baseUrl + '?' + queryString;

	var ImageLoader = function () {
	  function ImageLoader(state, update) {
	    _classCallCheck(this, ImageLoader);

	    this.state = state;
	    this.update = update;
	  }

	  _createClass(ImageLoader, [{
	    key: 'loadImages',
	    value: function loadImages() {
	      (0, _httpRequest2.default)('get', url, this.onSuccess.bind(this), this.onFailure.bind(this));
	    }
	  }, {
	    key: 'onSuccess',
	    value: function onSuccess(xhr) {
	      var response;

	      try {
	        response = JSON.parse((0, _unwrap2.default)(xhr.response));
	      } catch (error) {
	        console.warn('Invalid JSON response from server', error);
	      }

	      var results = (0, _getProperty2.default)(response, 'photoset.photo');
	      if (results == null) {
	        console.warn('Unexpected data in JSON response from server', response);
	        return;
	      }

	      Array.prototype.push.apply(this.state.photos, results);

	      this.update();
	    }
	  }, {
	    key: 'onFailure',
	    value: function onFailure() {
	      console.error('Failed to retrieve data set!');
	    }
	  }]);

	  return ImageLoader;
	}();

	exports.default = ImageLoader;

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = httpRequest;
	/// *Barebones* tool to encapsulate the XHR details around running http requests

	function httpRequest() {
	  var method = arguments.length <= 0 || arguments[0] === undefined ? 'get' : arguments[0];
	  var url = arguments[1];
	  var onSuccess = arguments.length <= 2 || arguments[2] === undefined ? noOp : arguments[2];
	  var onError = arguments.length <= 3 || arguments[3] === undefined ? noOp : arguments[3];

	  var xhr = new XMLHttpRequest();

	  xhr.onload = function () {
	    httpSuccess(xhr.status) ? onSuccess(xhr) : onError(xhr);
	  };

	  xhr.open(method, url, true);

	  return xhr.send();
	}

	function httpSuccess(status) {
	  return status >= 200 && status < 300;
	}

	function noOp() {}

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	exports.default = getProperty;
	/// Looks up an object property chain, if the property is not found it returns undefined.
	///
	/// Ex: getProperty({ a: { b: { c: true } } }, 'a.b.c') // true

	function getProperty(object, path) {
	  var pathSegments = path.split('.');
	  var currentContext = object;

	  while (pathSegments.length > 0) {
	    var segment = pathSegments.shift();
	    if ((typeof currentContext === 'undefined' ? 'undefined' : _typeof(currentContext)) !== 'object') {
	      return;
	    }
	    currentContext = currentContext[segment];
	  };

	  return currentContext;
	}

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = unwrap;
	// For some reason, the response string is wrapped in `jsonFlickrApi(…)`
	function unwrap(jsonString) {
	  return jsonString.replace(/^jsonFlickrApi\(/, '').replace(/\)$/, '');
	}

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = createImageNodeUsingTemplate;
	function createImageNodeUsingTemplate(_ref) {
	  var templateId = _ref.templateId;
	  var photo = _ref.photo;
	  var size = _ref.size;

	  var resultNode = createNodeFromTemplate(templateId);
	  var image = resultNode.querySelector('img');
	  var description = photo.description._content;

	  resultNode.classList.add('is-loading');
	  resultNode.description = description;
	  image.onload = function () {
	    resultNode.classList.remove('is-loading');
	  };
	  resultNode.querySelector('.description').textContent = description;

	  // Start loading
	  image.src = photo['url_' + size];

	  return resultNode;
	}

	function createNodeFromTemplate(templateId) {
	  return document.querySelector('#template-' + templateId).childNodes[0].cloneNode(true);
	}

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(8);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(10)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/sass-loader/index.js!./app.sass", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/sass-loader/index.js!./app.sass");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(9)();
	// imports


	// module
	exports.push([module.id, "div[id^=template] {\n  display: none; }\n\n* {\n  box-sizing: border-box; }\n\nbody {\n  font-family: sans-serif;\n  margin: 0;\n  padding: 100px 0 0; }\n\nh1, .photos {\n  opacity: 1;\n  transition: opacity .4s; }\n  .is-initial-load h1, .is-initial-load .photos {\n    opacity: 0; }\n\n.spinner {\n  position: absolute;\n  top: 50%;\n  left: 0;\n  right: 0;\n  text-align: center;\n  transition: .4s;\n  opacity: 0;\n  text-transform: uppercase; }\n  .is-initial-load .spinner {\n    opacity: .3; }\n\nh1 {\n  font-family: 'Lato', sans-serif;\n  font-weight: 300;\n  text-align: center;\n  position: fixed;\n  background: rgba(255, 255, 255, 0.95);\n  border-bottom: 1px solid rgba(0, 0, 0, 0.1);\n  width: 100%;\n  padding: 30px;\n  top: 0;\n  margin: 0;\n  z-index: 1; }\n\n.photos {\n  display: flex;\n  justify-content: center;\n  align-items: space-between;\n  flex-wrap: wrap; }\n\n.photo {\n  flex: 1;\n  flex-basis: 240px;\n  margin: 20px;\n  text-decoration: none;\n  color: #111;\n  line-height: 1.4em; }\n  .photo:hover {\n    opacity: .9; }\n  .photo .image {\n    height: 240px;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    flex-direction: column; }\n    .photo .image img {\n      box-shadow: 0 0 3px black; }\n  .photo .description {\n    text-align: center;\n    padding: 20px 0;\n    font-size: 14px;\n    font-weight: 300; }\n\n.lightbox {\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  transition: .4s;\n  z-index: 2;\n  display: flex;\n  justify-content: stretch;\n  align-items: center;\n  opacity: 0;\n  pointer-events: none;\n  padding: 20px; }\n  .lightbox.is-active {\n    opacity: 1;\n    pointer-events: all; }\n  .lightbox .close,\n  .lightbox .previous,\n  .lightbox .next {\n    border-radius: 15px;\n    background: rgba(255, 255, 255, 0.2);\n    color: white;\n    text-decoration: none;\n    text-transform: uppercase;\n    text-align: center; }\n    .lightbox .close:hover,\n    .lightbox .previous:hover,\n    .lightbox .next:hover {\n      background: rgba(255, 255, 255, 0.4); }\n  .lightbox .close {\n    position: absolute;\n    bottom: 20px;\n    left: 50%;\n    margin-left: -100px;\n    width: 200px;\n    padding: 20px 0; }\n  .lightbox .previous,\n  .lightbox .next {\n    flex: none;\n    width: 150px;\n    position: relative;\n    padding: 100px 0;\n    opacity: 0;\n    pointer-events: none; }\n    .lightbox .previous.is-active,\n    .lightbox .next.is-active {\n      opacity: 1;\n      pointer-events: all; }\n  .lightbox .photo-container {\n    flex: 1;\n    position: relative;\n    height: 100%;\n    margin: 0 20px;\n    padding: 80px 0 100px;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    line-height: 0;\n    text-align: center; }\n    .lightbox .photo-container .image,\n    .lightbox .photo-container img {\n      max-width: 100%;\n      max-height: 100%;\n      width: auto;\n      height: auto;\n      position: relative; }\n    .lightbox .photo-container .description {\n      display: block;\n      font-weight: bold;\n      color: white;\n      line-height: 1.5em;\n      padding: 15px;\n      max-width: 700px;\n      margin: 0 auto; }\n  .lightbox:before {\n    content: '';\n    background: rgba(0, 0, 0, 0.8);\n    position: absolute;\n    top: 0;\n    left: 0;\n    right: 0;\n    bottom: 0; }\n", ""]);

	// exports


/***/ },
/* 9 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ }
/******/ ]);