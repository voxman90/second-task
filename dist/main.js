/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
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
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./component.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./component.js":
/*!**********************!*\
  !*** ./component.js ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _css_fonts_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./css/fonts.scss */ \"./css/fonts.scss\");\n/* harmony import */ var _css_fonts_scss__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_css_fonts_scss__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _css_colors_type_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./css/colors_type.scss */ \"./css/colors_type.scss\");\n/* harmony import */ var _css_colors_type_scss__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_css_colors_type_scss__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _project_common_block_logo_logo_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./project/common.block/logo/logo.scss */ \"./project/common.block/logo/logo.scss\");\n/* harmony import */ var _project_common_block_logo_logo_scss__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_project_common_block_logo_logo_scss__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _project_common_block_logo_logo_right_branch_scss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./project/common.block/logo/logo__right-branch.scss */ \"./project/common.block/logo/logo__right-branch.scss\");\n/* harmony import */ var _project_common_block_logo_logo_right_branch_scss__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_project_common_block_logo_logo_right_branch_scss__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var _project_common_block_logo_logo_left_branch_scss__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./project/common.block/logo/logo__left-branch.scss */ \"./project/common.block/logo/logo__left-branch.scss\");\n/* harmony import */ var _project_common_block_logo_logo_left_branch_scss__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_project_common_block_logo_logo_left_branch_scss__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var _project_common_block_logo_logo_circle_scss__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./project/common.block/logo/logo__circle.scss */ \"./project/common.block/logo/logo__circle.scss\");\n/* harmony import */ var _project_common_block_logo_logo_circle_scss__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_project_common_block_logo_logo_circle_scss__WEBPACK_IMPORTED_MODULE_5__);\n/* harmony import */ var _project_common_block_logo_logo_color_change_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./project/common.block/logo/logo_color-change.js */ \"./project/common.block/logo/logo_color-change.js\");\n/* harmony import */ var _project_common_block_logo_logo_color_change_js__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_project_common_block_logo_logo_color_change_js__WEBPACK_IMPORTED_MODULE_6__);\n/* harmony import */ var _project_common_block_logo_logo_normal_size_scss__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./project/common.block/logo/logo_normal-size.scss */ \"./project/common.block/logo/logo_normal-size.scss\");\n/* harmony import */ var _project_common_block_logo_logo_normal_size_scss__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_project_common_block_logo_logo_normal_size_scss__WEBPACK_IMPORTED_MODULE_7__);\n/* harmony import */ var _project_common_block_logo_logo_small_size_scss__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./project/common.block/logo/logo_small-size.scss */ \"./project/common.block/logo/logo_small-size.scss\");\n/* harmony import */ var _project_common_block_logo_logo_small_size_scss__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_project_common_block_logo_logo_small_size_scss__WEBPACK_IMPORTED_MODULE_8__);\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\n\n//# sourceURL=webpack:///./component.js?");

/***/ }),

/***/ "./css/colors_type.scss":
/*!******************************!*\
  !*** ./css/colors_type.scss ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// extracted by mini-css-extract-plugin\n\n//# sourceURL=webpack:///./css/colors_type.scss?");

/***/ }),

/***/ "./css/fonts.scss":
/*!************************!*\
  !*** ./css/fonts.scss ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// extracted by mini-css-extract-plugin\n\n//# sourceURL=webpack:///./css/fonts.scss?");

/***/ }),

/***/ "./project/common.block/logo/logo.scss":
/*!*********************************************!*\
  !*** ./project/common.block/logo/logo.scss ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// extracted by mini-css-extract-plugin\n\n//# sourceURL=webpack:///./project/common.block/logo/logo.scss?");

/***/ }),

/***/ "./project/common.block/logo/logo__circle.scss":
/*!*****************************************************!*\
  !*** ./project/common.block/logo/logo__circle.scss ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// extracted by mini-css-extract-plugin\n\n//# sourceURL=webpack:///./project/common.block/logo/logo__circle.scss?");

/***/ }),

/***/ "./project/common.block/logo/logo__left-branch.scss":
/*!**********************************************************!*\
  !*** ./project/common.block/logo/logo__left-branch.scss ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// extracted by mini-css-extract-plugin\n\n//# sourceURL=webpack:///./project/common.block/logo/logo__left-branch.scss?");

/***/ }),

/***/ "./project/common.block/logo/logo__right-branch.scss":
/*!***********************************************************!*\
  !*** ./project/common.block/logo/logo__right-branch.scss ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// extracted by mini-css-extract-plugin\n\n//# sourceURL=webpack:///./project/common.block/logo/logo__right-branch.scss?");

/***/ }),

/***/ "./project/common.block/logo/logo_color-change.js":
/*!********************************************************!*\
  !*** ./project/common.block/logo/logo_color-change.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("document.addEventListener(\"DOMContentLoaded\", function() { \r\n// color for linear-gradient  \r\n    const colorPurple = ['#BC9CFF', '#8BA4F9'];\r\n    const colorGreen = ['#6FCF97', '#66D2EA'];\r\n// create linear-gradient element for SVG\r\n    function createLinearGradient(colorFirst, colorSecond, uniqueId) {\r\n        let elementDefs = document.createElementNS(\"http://www.w3.org/2000/svg\",\"defs\");\r\n        console.log(elementDefs);\r\n        // create linearGradient tag and add attributes\r\n        let elementLinearGradient = document.createElementNS(\"http://www.w3.org/2000/svg\", \"linearGradient\");\r\n        elementLinearGradient.setAttribute('id', uniqueId);\r\n        elementLinearGradient.setAttribute('gradientTransform', 'rotate(90)');\r\n        console.log(elementLinearGradient);\r\n        // create first stop tag and add attributes\r\n        let elementStopFirst = document.createElementNS(\"http://www.w3.org/2000/svg\", \"stop\");\r\n        elementStopFirst.setAttribute('offset', \"0%\");\r\n        elementStopFirst.setAttribute('stop-color', colorFirst);\r\n        console.log(elementStopFirst);\r\n        // create second stop tag and add attributes\r\n        let elementStopSecond = document.createElementNS(\"http://www.w3.org/2000/svg\", \"stop\");\r\n        elementStopSecond.setAttribute('offset', \"100%\");\r\n        elementStopSecond.setAttribute('stop-color', colorSecond);\r\n        console.log(elementStopSecond);\r\n        /* building a hierarchy of tags\r\n         * defs\r\n         * | linearGradient\r\n         * | | stop\r\n         * | | stop\r\n         */\r\n        elementLinearGradient.appendChild(elementStopFirst);\r\n        console.log(elementLinearGradient); \r\n        elementLinearGradient.appendChild(elementStopSecond); \r\n        console.log(elementLinearGradient);   \r\n        elementDefs.appendChild(elementLinearGradient);\r\n        console.log(elementDefs);\r\n        return elementDefs;\r\n    }\r\n// collect all logo in document and add gradient\r\n    let elementList = document.querySelectorAll(\".logo_color-change\");\r\n    for (let element of elementList) {\r\n        // create random Id\r\n        let randomString = Math.random().toString(36).substr(2, 10);\r\n        // change Circle\r\n        let logoCircle = element.querySelector(\".logo__circle\");\r\n        logoCircle.appendChild(createLinearGradient(colorPurple[0], colorPurple[1], randomString+\"0\"));\r\n        logoCircle.firstChild.setAttribute(\"fill\", \"url(#\"+randomString+\"0)\");\r\n        logoCircle.firstChild.setAttribute(\"fill-opacity\", \"1\");\r\n        // change LeftBranch\r\n        let logoLeftBranch = element.querySelector(\".logo__left-branch\");\r\n        logoLeftBranch.appendChild(createLinearGradient(colorPurple[0], colorPurple[1], randomString+\"1\"));\r\n        logoLeftBranch.firstChild.setAttribute(\"fill\", \"url(#\"+randomString+\"1)\");\r\n        logoLeftBranch.firstChild.setAttribute(\"fill-opacity\", \"1\");\r\n        // change RightBranch\r\n        let logoRightBranch = element.querySelector(\".logo__right-branch\");\r\n        logoRightBranch.appendChild(createLinearGradient(colorGreen[0], colorGreen[1], randomString+\"2\"));\r\n        logoRightBranch.firstChild.setAttribute(\"fill\", \"url(#\"+randomString+\"2)\");\r\n        logoRightBranch.firstChild.setAttribute(\"fill-opacity\", \"1\");\r\n    };\r\n});\n\n//# sourceURL=webpack:///./project/common.block/logo/logo_color-change.js?");

/***/ }),

/***/ "./project/common.block/logo/logo_normal-size.scss":
/*!*********************************************************!*\
  !*** ./project/common.block/logo/logo_normal-size.scss ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// extracted by mini-css-extract-plugin\n\n//# sourceURL=webpack:///./project/common.block/logo/logo_normal-size.scss?");

/***/ }),

/***/ "./project/common.block/logo/logo_small-size.scss":
/*!********************************************************!*\
  !*** ./project/common.block/logo/logo_small-size.scss ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// extracted by mini-css-extract-plugin\n\n//# sourceURL=webpack:///./project/common.block/logo/logo_small-size.scss?");

/***/ })

/******/ });