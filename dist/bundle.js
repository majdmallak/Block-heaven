/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/Game.js":
/*!************************!*\
  !*** ./src/js/Game.js ***!
  \************************/
/***/ (() => {

eval("document.addEventListener('DOMContentLoaded', function () {\n  var canvas = document.getElementById('renderCanvas');\n  var engine = new BABYLON.Engine(canvas, true);\n  var createScene = function createScene() {\n    var scene = new BABYLON.Scene(engine);\n    var camera = new BABYLON.ArcRotateCamera(\"Camera\", Math.PI / 2, Math.PI / 4, 5, BABYLON.Vector3.Zero(), scene);\n    camera.attachControl(canvas, true);\n    var light = new BABYLON.HemisphericLight(\"light\", new BABYLON.Vector3(1, 1, 0), scene);\n    var sphere = BABYLON.MeshBuilder.CreateSphere(\"sphere\", {\n      diameter: 2\n    }, scene);\n    return scene;\n  };\n  var scene = createScene();\n  engine.runRenderLoop(function () {\n    return scene.render();\n  });\n  window.addEventListener('resize', function () {\n    return engine.resize();\n  });\n});\n\n//# sourceURL=webpack://babylonjsdreamland2025/./src/js/Game.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/js/Game.js"]();
/******/ 	
/******/ })()
;