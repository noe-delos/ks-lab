"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/@radix-ui+react-use-layout-effect@1.0.1_@types+react@19.0.2_react@19.0.0";
exports.ids = ["vendor-chunks/@radix-ui+react-use-layout-effect@1.0.1_@types+react@19.0.2_react@19.0.0"];
exports.modules = {

/***/ "(ssr)/./node_modules/.pnpm/@radix-ui+react-use-layout-effect@1.0.1_@types+react@19.0.2_react@19.0.0/node_modules/@radix-ui/react-use-layout-effect/dist/index.mjs":
/*!*******************************************************************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/@radix-ui+react-use-layout-effect@1.0.1_@types+react@19.0.2_react@19.0.0/node_modules/@radix-ui/react-use-layout-effect/dist/index.mjs ***!
  \*******************************************************************************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   useLayoutEffect: () => (/* binding */ $9f79659886946c16$export$e5c5a5f917a5871c)\n/* harmony export */ });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"(ssr)/./node_modules/.pnpm/next@15.1.3_@babel+core@7.26.0_react-dom@19.0.0_react@19.0.0__react@19.0.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js\");\n\n\n\n/**\n * On the server, React emits a warning when calling `useLayoutEffect`.\n * This is because neither `useLayoutEffect` nor `useEffect` run on the server.\n * We use this safe version which suppresses the warning by replacing it with a noop on the server.\n *\n * See: https://reactjs.org/docs/hooks-reference.html#uselayouteffect\n */ const $9f79659886946c16$export$e5c5a5f917a5871c = Boolean(globalThis === null || globalThis === void 0 ? void 0 : globalThis.document) ? react__WEBPACK_IMPORTED_MODULE_0__.useLayoutEffect : ()=>{};\n\n\n\n\n\n//# sourceMappingURL=index.mjs.map\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvLnBucG0vQHJhZGl4LXVpK3JlYWN0LXVzZS1sYXlvdXQtZWZmZWN0QDEuMC4xX0B0eXBlcytyZWFjdEAxOS4wLjJfcmVhY3RAMTkuMC4wL25vZGVfbW9kdWxlcy9AcmFkaXgtdWkvcmVhY3QtdXNlLWxheW91dC1lZmZlY3QvZGlzdC9pbmRleC5tanMiLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBZ0U7OztBQUdoRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2SUFBNkksa0RBQXNCOzs7OztBQUs3RjtBQUN0RSIsInNvdXJjZXMiOlsiL2hvbWUvbm9lLWNhbXBvL2RlbG9zL3Byb2pldC9sYWIta3Mva3MtbGFiL25vZGVfbW9kdWxlcy8ucG5wbS9AcmFkaXgtdWkrcmVhY3QtdXNlLWxheW91dC1lZmZlY3RAMS4wLjFfQHR5cGVzK3JlYWN0QDE5LjAuMl9yZWFjdEAxOS4wLjAvbm9kZV9tb2R1bGVzL0ByYWRpeC11aS9yZWFjdC11c2UtbGF5b3V0LWVmZmVjdC9kaXN0L2luZGV4Lm1qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge3VzZUxheW91dEVmZmVjdCBhcyAkZHhsd0gkdXNlTGF5b3V0RWZmZWN0fSBmcm9tIFwicmVhY3RcIjtcblxuXG4vKipcbiAqIE9uIHRoZSBzZXJ2ZXIsIFJlYWN0IGVtaXRzIGEgd2FybmluZyB3aGVuIGNhbGxpbmcgYHVzZUxheW91dEVmZmVjdGAuXG4gKiBUaGlzIGlzIGJlY2F1c2UgbmVpdGhlciBgdXNlTGF5b3V0RWZmZWN0YCBub3IgYHVzZUVmZmVjdGAgcnVuIG9uIHRoZSBzZXJ2ZXIuXG4gKiBXZSB1c2UgdGhpcyBzYWZlIHZlcnNpb24gd2hpY2ggc3VwcHJlc3NlcyB0aGUgd2FybmluZyBieSByZXBsYWNpbmcgaXQgd2l0aCBhIG5vb3Agb24gdGhlIHNlcnZlci5cbiAqXG4gKiBTZWU6IGh0dHBzOi8vcmVhY3Rqcy5vcmcvZG9jcy9ob29rcy1yZWZlcmVuY2UuaHRtbCN1c2VsYXlvdXRlZmZlY3RcbiAqLyBjb25zdCAkOWY3OTY1OTg4Njk0NmMxNiRleHBvcnQkZTVjNWE1ZjkxN2E1ODcxYyA9IEJvb2xlYW4oZ2xvYmFsVGhpcyA9PT0gbnVsbCB8fCBnbG9iYWxUaGlzID09PSB2b2lkIDAgPyB2b2lkIDAgOiBnbG9iYWxUaGlzLmRvY3VtZW50KSA/ICRkeGx3SCR1c2VMYXlvdXRFZmZlY3QgOiAoKT0+e307XG5cblxuXG5cbmV4cG9ydCB7JDlmNzk2NTk4ODY5NDZjMTYkZXhwb3J0JGU1YzVhNWY5MTdhNTg3MWMgYXMgdXNlTGF5b3V0RWZmZWN0fTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4Lm1qcy5tYXBcbiJdLCJuYW1lcyI6W10sImlnbm9yZUxpc3QiOlswXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/.pnpm/@radix-ui+react-use-layout-effect@1.0.1_@types+react@19.0.2_react@19.0.0/node_modules/@radix-ui/react-use-layout-effect/dist/index.mjs\n");

/***/ })

};
;