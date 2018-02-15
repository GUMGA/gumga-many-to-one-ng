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
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	__webpack_require__.p = "/dist/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function () {
  'use strict';

  ManyToOne.$inject = ['$templateCache', '$uibModal', '$compile', '$timeout'];

  function ManyToOne($templateCache, $uibModal, $compile, $timeout) {
    controller.$inject = ['$scope', '$element', '$attrs', '$transclude'];

    function controller($scope, $element, $attrs, $transclude) {
      var manyToOneCtrl = this,
          ngModelCtrl = void 0,
          ngModelCtrlReset = void 0;

      manyToOneCtrl.$onInit = function () {
        var ERR_MSGS = {
          noValue: 'É necessário um atributo value no componente gumgaManyToOne',
          noField: 'É necessário um atributo field no componente gumgaManyToOne',
          noSearch: 'É necessário uma função de busca no componente gumgaManyToOne'
        };

        var possibleAttributes = ['loadingText', 'onSelect', 'value', 'list', 'searchMethod', 'field', 'onNewValueAdded', 'onValueSelected', 'onValueVisualizationOpened', 'onValueVisualizationClosed', 'tabindex'];

        var template = false;

        var cache = getCookie(getKeyCookie());

        if (cache) {
          manyToOneCtrl.favoriteModel = JSON.parse(cache);
        }

        if ($attrs.debug && manyToOneCtrl.activeFavorite) {
          console.log('Cookie: ', getCookie(getKeyCookie()));
        }

        if ($attrs.debug) {
          console.log('ngModel: ', manyToOneCtrl.value);
          console.log('activeFavorite: ', manyToOneCtrl.activeFavorite);
        }

        if (!manyToOneCtrl.value && manyToOneCtrl.favoriteModel && manyToOneCtrl.activeFavorite) {
          manyToOneCtrl.value = angular.copy(manyToOneCtrl.favoriteModel);
        }

        if (!$attrs.value) console.error(ERR_MSGS.noValue);
        if (!$attrs.field) console.error(ERR_MSGS.noField);

        manyToOneCtrl.ev = {};
        manyToOneCtrl.list = manyToOneCtrl.list || [];
        manyToOneCtrl.ev.onNewValueAdded = $attrs.onNewValueAdded ? manyToOneCtrl.onNewValueAdded : angular.noop;
        manyToOneCtrl.ev.onSelect = $attrs.onSelect ? manyToOneCtrl.onSelect : angular.noop;
        manyToOneCtrl.ev.onValueVisualizationOpened = $attrs.onValueVisualizationOpened ? $attrs.onValueVisualizationOpened : angular.noop;
        manyToOneCtrl.ev.onValueVisualizationClosed = $attrs.onValueVisualizationClosed ? $attrs.onValueVisualizationClosed : angular.noop;
        manyToOneCtrl.field = $attrs.field || '';
        // manyToOneCtrl.description                   = $attrs.description                                         || false
        manyToOneCtrl.modalTitle = $attrs.modalTitle || 'Visualizador de Registro';
        manyToOneCtrl.modalFields = $attrs.modalFields ? $attrs.modalFields.split(',') : [manyToOneCtrl.field];
        manyToOneCtrl.postFields = $attrs.postFields ? $attrs.postFields.split(',') : [manyToOneCtrl.field];
        manyToOneCtrl.displayClear = manyToOneCtrl.hasOwnProperty('displayClear') ? manyToOneCtrl.displayClear : true;
        manyToOneCtrl.displayInfo = manyToOneCtrl.hasOwnProperty('displayInfo') ? manyToOneCtrl.displayInfo : true;
        manyToOneCtrl.editable = manyToOneCtrl.hasOwnProperty('editable') ? manyToOneCtrl.editable : true;
        manyToOneCtrl.async = manyToOneCtrl.hasOwnProperty('async') ? manyToOneCtrl.async : true;
        // manyToOneCtrl.showDescripion                = !!manyToOneCtrl.description

        function mirrorAttributes() {
          var isOneOfPossibles = function isOneOfPossibles(attribute) {
            return possibleAttributes.filter(function (value) {
              return attribute == value;
            }).length > 0;
          };
          return Object.keys($attrs.$attr).filter(function (value) {
            return !isOneOfPossibles(value);
          }).reduce(function (prev, next) {
            return prev += next + '="' + $attrs[next] + '"';
          }, '');
        }

        manyToOneCtrl.displayInfoButton = displayInfoButton;
        manyToOneCtrl.modelValueIsObject = modelValueIsObject;
        manyToOneCtrl.disabledDisplayInfo = disabledDisplayInfo;
        manyToOneCtrl.displayPlusButton = displayPlusButton;
        manyToOneCtrl.displayClearButton = displayClearButton;
        manyToOneCtrl.clearModel = clearModel;
        manyToOneCtrl.openInfo = openInfo;
        manyToOneCtrl.valueToAdd = '';
        manyToOneCtrl.afterSelect = afterSelect;
        manyToOneCtrl.openTypehead = openTypehead;
        manyToOneCtrl.showTypeheadAndHideMatch = showTypeheadAndHideMatch;

        manyToOneCtrl.proxySearch = function () {
          var param = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

          if (!manyToOneCtrl.async) {
            if (param) param = param.toLowerCase();
            return manyToOneCtrl.list.filter(function (listItem) {
              return listItem[manyToOneCtrl.field].toLowerCase().indexOf(param) != -1;
            });
          } else {
            return manyToOneCtrl.searchMethod({ param: param }).then(function (data) {
              if (data.filter(function (dataItem) {
                return dataItem[manyToOneCtrl.field] == param;
              }).length > 0 || !manyToOneCtrl.authorizeAdd) {
                return data;
              }
              if (param) {
                var objToAppend = {};
                objToAppend[manyToOneCtrl.field] = manyToOneCtrl.valueToAdd;
                return data.concat(objToAppend);
              }
              return data;
            });
          }
        };

        manyToOneCtrl.proxySave = function (val, abc) {
          if (!abc) return;
          manyToOneCtrl.isTypeaheadOpen = true;
          var controllerAs = 'ctrl';
          var resolve = { value: function value() {
              return val;
            } };
          controller.$inject = ['$scope', '$uibModalInstance', 'value'];
          function controller($scope, $uibModalInstance, value) {
            var ctrl = this;
            ctrl.object = value;
            ctrl.cancel = function (obj) {
              return $uibModalInstance.dismiss('cancel');
            };
            ctrl.save = function (obj) {
              return $uibModalInstance.close(obj);
            };
          }

          function mountModalBody() {
            var fields = manyToOneCtrl.postFields;
            return fields.reduce(function (prev, next) {
              var field = next.indexOf(':') != -1 ? next.trim().substring(0, next.indexOf(':')) : next.trim();
              var required = next.indexOf(':') != -1 ? next.trim().substring(next.indexOf(':') + 1, next.length) : 'false';
              return prev += '\n                  <div class="form-group">\n                    <label>' + field + '</label>\n                    <input type="text" class="form-control" ' + (required == 'required' ? required : '') + ' ng-model="ctrl.object.' + field + '" />\n                  </div>';
            }, ' ');
          }

          var template = '\n                <div class="modal-header">\n                  <h3 class="modal-title">' + manyToOneCtrl.modalTitle + '</h3>\n                </div>\n                <div class="modal-body">\n                  <form name="formNew">\n                    ' + mountModalBody() + '\n                  </form>\n                </div>\n                <div class="modal-footer">\n                  <button type="button" class="btn btn-default" ng-click="ctrl.cancel(ctrl.object)">Retornar</button>\n                  <button type="button" class="btn btn-primary" ng-disabled="!formNew.$valid" ng-click="ctrl.save(ctrl.object)">Salvar</button>\n                </div>';

          $uibModal.open({ controller: controller, template: template, controllerAs: controllerAs, resolve: resolve }).result.then(function (value) {
            manyToOneCtrl.postMethod({ value: value }).then(function (dataFromPostMethod) {
              manyToOneCtrl.value = dataFromPostMethod.data.data;
              ngModelCtrl.$viewValue = dataFromPostMethod.data.data;
            });
          }, function (reject) {
            delete manyToOneCtrl.value;
          });
        };

        function displayClearButton() {
          return manyToOneCtrl.displayClear;
        }

        function displayInfoButton() {
          return manyToOneCtrl.displayInfo;
        }

        function getKeyCookie() {
          var user = sessionStorage.getItem('user');
          if (user) {
            user = JSON.parse(user);
            return (user.instanceOrganizationHierarchyCode || '') + 'favorite-' + $attrs.name;
          } else {
            return 'favorite-' + $attrs.name;
          }
        }

        function modelValueIsObject() {
          if (manyToOneCtrl.disabled) return true;
          if (!manyToOneCtrl.value) return true;
          return !(_typeof(manyToOneCtrl.value) === 'object');
        }

        function disabledDisplayInfo() {
          return !(_typeof(manyToOneCtrl.value) === 'object');
        }

        function clearModel() {
          manyToOneCtrl.visible = 'typeahead';
          if (manyToOneCtrl.onDeselect) {
            manyToOneCtrl.onDeselect({ value: angular.copy(manyToOneCtrl.value) });
          }
          delete manyToOneCtrl.value;
          document.getElementById('typeahead-' + manyToOneCtrl.field + '-' + $attrs.value).focus();
        }

        function openTypehead() {
          if (manyToOneCtrl.value) {
            delete manyToOneCtrl.value;
            showTypeheadAndHideMatch();
          } else {
            if (manyToOneCtrl.isTypeaheadOpen) return;
            document.getElementById('typeahead-' + manyToOneCtrl.field + '-' + $attrs.value).focus();
          }
        }

        function showTypeheadAndHideMatch() {
          manyToOneCtrl.visible = 'typeahead';

          $timeout(function () {
            manyToOneCtrl.value = angular.copy(manyToOneCtrl.inputMatchValue);
            openTypehead();
            delete manyToOneCtrl.inputMatchValue;
          });
        }

        manyToOneCtrl.isTypeaheadOpen = true;

        function displayPlusButton() {
          return manyToOneCtrl.postMethod && (typeof ngModelCtrl.$$rawModelValue === 'string' || ngModelCtrl.$$rawModelValue instanceof String) && ngModelCtrl.$$rawModelValue.length > 0;
        }

        function handlingInputVisible() {
          if (manyToOneCtrl.inputMatch) {
            var span = document.getElementById('match-' + manyToOneCtrl.field + '-' + $attrs.value);
            var inputMatch = manyToOneCtrl.inputMatch.replace(/{/g, '{{').replace(/}/g, '}}').replace(/item/g, 'manyToOneCtrl.value');
            var update = '<span style="display: none;" id="match-' + manyToOneCtrl.field + '-' + $attrs.value + '">' + inputMatch + '</span>';
            angular.element(span).replaceWith($compile(update)($scope));
            $timeout(function () {
              var content = document.getElementById('match-' + manyToOneCtrl.field + '-' + $attrs.value);
              manyToOneCtrl.inputMatchValue = content.innerHTML;
              manyToOneCtrl.visible = 'inputMatchValue';
            });
          } else {
            manyToOneCtrl.visible = 'typeahead';
          }
        }

        function afterSelect($item, $model, $label, $event, isBtn, match) {
          handlingInputVisible();
          if (!$model.id && manyToOneCtrl.authorizeAdd) {
            manyToOneCtrl.proxySave($model, isBtn);
          }
          ngModelCtrl.$setValidity('manyToOne', true);
          if (manyToOneCtrl.ev.onSelect) manyToOneCtrl.ev.onSelect({ value: $model });
        }

        function openInfo() {
          var object = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
          var $event = arguments[1];


          manyToOneCtrl.isTypeaheadOpen = true;
          $event.stopImmediatePropagation();
          $event.preventDefault();
          controller.$inject = ['$scope', '$uibModalInstance'];

          function controller($scope, $uibModalInstance) {
            $scope.close = function () {
              return $uibModalInstance.close();
            };
          }

          function mountModalBody() {
            var fields = manyToOneCtrl.modalFields;
            return fields.reduce(function (prev, next) {
              return prev += '\n                  <div class="form-group">\n                    ' + (typeof object[next] === 'string' || object[next] instanceof String ? '<label>' + next + '</label>' : ' ') + '\n                    ' + (typeof object[next] === 'string' || object[next] instanceof String ? '<input type="text" class="form-control" value="' + object[next] + '" disabled />' : ' ') + '\n                  </div>';
            }, ' ');
          }

          var template = '\n              <div class="modal-header">\n                <h3 class="modal-title">' + manyToOneCtrl.modalTitle + '</h3>\n              </div>\n              <div class="modal-body">\n                ' + mountModalBody() + '\n              </div>\n              ';
          $uibModal.open({ controller: controller, template: template });
        }

        $transclude($scope, function (cloneEl) {
          angular.forEach(cloneEl, function (cl) {
            var element = angular.element(cl)[0];
            if (element.nodeName && element.nodeName === 'MATCH') {
              template = true;
              manyToOneCtrl.match = element.innerHTML;
            }
          });
        });

        // POR FAVOR NAO REMOVE ESSA FUNÇÃO ELA É ESSENCIAL
        manyToOneCtrl.keyUp = function ($event) {
          if ($event.target.value == '' && $event.keyCode != 40 && $event.keyCode != 38) {
            angular.element($event.target).blur();
            $timeout(function () {
              return angular.element($event.target).focus();
            }, 500);
          }
        };

        function setCookie(name, value, days) {
          var expires = "";
          if (days) {
            var date = new Date();
            date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
            expires = "; expires=" + date.toUTCString();
          }
          document.cookie = name + "=" + (value || "") + expires + "; path=/";
        }

        function getCookie(name) {
          var nameEQ = name + "=";
          var ca = document.cookie.split(';');
          for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
              c = c.substring(1, c.length);
            }if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
          }
          return null;
        }

        function eraseCookie(name) {
          document.cookie = name + '=; Max-Age=-99999999;';
        }

        manyToOneCtrl.favorite = function ($event, model) {
          if (angular.equals(model, manyToOneCtrl.favoriteModel)) {
            eraseCookie(getKeyCookie());
            delete manyToOneCtrl.favoriteModel;
            return;
          }
          setCookie(getKeyCookie(), JSON.stringify(model), 999999);
          manyToOneCtrl.favoriteModel = model;
        };

        manyToOneCtrl.isFavorite = function (model) {
          return angular.equals(model, manyToOneCtrl.favoriteModel);
        };

        manyToOneCtrl.inputBlur = function (event) {
          delete manyToOneCtrl.noResults;
          if (!manyToOneCtrl.value) {
            ngModelCtrl.$viewValue = '';
            ngModelCtrl.$render();
          }
        };

        manyToOneCtrl.inputClick = function () {
          if (!manyToOneCtrl.value) {
            $element.find('input').blur();
            manyToOneCtrl.openTypehead();
          }
        };

        /*  */
        var baseTemplate = '\n            <style>\n              gumga-many-to-one [uib-typeahead-popup].dropdown-menu{\n                  width: 100%;\n              }\n              gumga-many-to-one a.result {\n                display: flex;\n                height: 42px;\n                align-items: center;\n              }\n              gumga-many-to-one a.result > span.str{\n                display: flex;\n              }\n              gumga-many-to-one input{\n                color: #999 !important;\n                padding-right: 32px;\n                font-size: 1.6rem !important;\n              }\n              gumga-many-to-one button.left-button{\n                padding: 0; width: 32px; padding-top: 10px; padding-bottom: 3px;\n              }\n              gumga-many-to-one input.form-control.ng-valid-many-to-one{\n                color: #555 !important;\n              }\n              gumga-many-to-one i.favorite{\n                color: #ccc;\n              }\n              gumga-many-to-one i.favorite.full{\n                color: #d9d90d;\n              }\n              gumga-many-to-one i.favorite:hover{\n                cursor: pointer; \n              }\n              gumga-many-to-one .input-group button.btn[ng-click="manyToOneCtrl.openTypehead()"]{\n                z-index: 2;\n              }\n              gumga-many-to-one .progress {\n                max-width: 100%;\n                overflow: hidden;\n                background: #ddd;\n                left: 0;\n                width: 100%;\n                border-radius: 0;\n                height: 2px;\n                bottom: 0;\n                margin: 0;\n                padding: 0;\n                bottom: 0;\n                height: 3px;\n                z-index: 4;\n              }\n              gumga-many-to-one .indeterminate {\n                position: absolute;\n                width: 100%;\n                height: 2px;\n                transform: translateZ(0);\n              }\n              gumga-many-to-one .indeterminate:before, .indeterminate:after {\n                content: \'\';\n                position: absolute;\n                background-color: #001eff;\n                top: 0;\n                left: 0;\n                width: 100%;\n                height: 100%;\n              }\n              gumga-many-to-one .indeterminate:before {\n                animation: indeterminate 3s cubic-bezier(0.195, 0.36, 0.945, 1.65) infinite;\n              }\n              gumga-many-to-one .indeterminate:after {\n                animation: indeterminate 3s cubic-bezier(0.9, -0.59, 0.715, 1.045) infinite;\n              }\n              \n              @keyframes indeterminate {\n                0% {\n                  width: 0%;\n                  transform: translateX(-100%);\n                }\n                100% {\n                  width: 100%;\n                  transform: translateX(100%);\n                }\n              }\n              gumga-many-to-one input.form-control.gmd.size-55{\n                padding-right: 55px;\n              }\n              gumga-many-to-one input.form-control.gmd.size-25{\n                padding-right: 25px;\n              }\n              gumga-many-to-one.gmd .dropdown-menu > .active > a, gumga-many-to-one.gmd .dropdown-menu > .active > a:focus, gumga-many-to-one.gmd .dropdown-menu > .active > a:hover{\n                cursor: pointer;\n              }\n            </style>\n            <div style="position: relative;">\n              <div class="progress indeterminate" ng-show="manyToOneCtrl.typeaheadLoading"></div>\n              <div style="width: 100%;" ng-class="{\'input-group\': (manyToOneCtrl.displayInfoButton() && manyToOneCtrl.modelValueIsObject()) || manyToOneCtrl.displayClearButton()}">\n                  <input type="text"\n                         ng-init="manyToOneCtrl.visible = \'typeahead\'"\n                         ng-show="manyToOneCtrl.visible == \'typeahead\'"\n                         id="typeahead-' + manyToOneCtrl.field + '-' + $attrs.value + '"\n                         class="form-control gmd inputahead"\n                         tabindex="' + manyToOneCtrl.tabSeq + '"\n                         ng-click="manyToOneCtrl.inputClick()"\n                         ng-disabled="manyToOneCtrl.disabled"\n                         ng-readonly="manyToOneCtrl.readonly"\n                         ng-model="manyToOneCtrl.value"\n                         ng-blur="manyToOneCtrl.inputBlur($event)"\n                         onfocus="this.classList.add(\'focused\')"\n                         ng-class="{\'size-25\' : manyToOneCtrl.modelValueIsObject() && manyToOneCtrl.displayClearButton(), \'size-55\' : !(manyToOneCtrl.modelValueIsObject() && manyToOneCtrl.displayClearButton())}"\n                         ng-keyup="manyToOneCtrl.keyUp($event)"\n                         onblur="this.classList.remove(\'focused\')"\n                         ng-model-options="{ debounce: ' + (manyToOneCtrl.debounce || 1000) + ' }"\n                         uib-typeahead="$value as $value[manyToOneCtrl.field] for $value in manyToOneCtrl.proxySearch($viewValue)"\n                         typeahead-loading="manyToOneCtrl.typeaheadLoading" ' + mirrorAttributes() + '\n                         typeahead-template-url="manyToOneTemplate' + manyToOneCtrl.field + '-' + $attrs.value + '.html"\n                         typeahead-is-open="manyToOneCtrl.isTypeaheadOpen"\n                         typeahead-editable="' + manyToOneCtrl.editable + '"\n                         typeahead-show-hint="true"\n                         typeahead-min-length="0"\n                         typeahead-on-select="manyToOneCtrl.afterSelect($item, $model, $label, $event, \'isNotButton\', manyToOneCtrl.match)"\n                         typeahead-no-results="manyToOneCtrl.noResults"\n                         autocomplete="off"/>\n                         <div ng-show="manyToOneCtrl.noResults" style="position: absolute; left: 0; width: 100%; top: 34px; background: #FFF; z-index: 999; padding: 15px; border-top: 1px solid #ccc; box-shadow: 0 2px 4px rgba(0,0,0,0.175);">\n                          {{' + manyToOneCtrl.messageNoResult + ' || \'Nenhum resultado foi encontrado.\'}}\n                         </div>\n                  <input type="text" ng-keyup="manyToOneCtrl.showTypeheadAndHideMatch()" ng-model="manyToOneCtrl.inputMatchValue" class="form-control" ng-show="manyToOneCtrl.visible == \'inputMatchValue\'"/>\n                  <div ng-show="manyToOneCtrl.typeaheadLoading && manyToOneCtrl.loadingText" style="position: absolute; top: 40px;">\n                  <i class="glyphicon glyphicon-refresh"></i>\n                  {{manyToOneCtrl.loadingText}}\n                </div>\n                <span ng-hide="true" id="match-' + manyToOneCtrl.field + '-' + $attrs.value + '"></span>\n                <div class="input-group-btn input-group-btn-icon" style="position: absolute; right: {{manyToOneCtrl.modelValueIsObject() && manyToOneCtrl.displayClearButton() ? \'25px;\' : manyToOneCtrl.displayInfo ? \'87px\' : \'55px\'}};" ng-show="(manyToOneCtrl.displayInfoButton() && manyToOneCtrl.modelValueIsObject()) || manyToOneCtrl.displayClearButton()">\n                  <button type="button" style="z-index: 2;" class="left-button btn btn-default gmd" ng-show="!manyToOneCtrl.modelValueIsObject() && manyToOneCtrl.displayClearButton()" ng-click="manyToOneCtrl.clearModel()">\n                    <i ng-show="manyToOneCtrl.useGumgaLayout()" class="material-icons" style="font-size: 15px;">close</i>\n                    <i ng-show="!manyToOneCtrl.useGumgaLayout()" class="glyphicon glyphicon-remove" style="font-size: 15px;"></i>\n                  </button>\n                  <button type="button" class="btn btn-default gmd"\n                          style="padding-bottom: 7px;"\n                          ng-click="manyToOneCtrl.openTypehead()">\n                    <span class="caret"></span>                    \n                  </button>\n                  <button type="button" style="z-index: 9;" class="left-button btn btn-default gmd" ng-show="!manyToOneCtrl.modelValueIsObject() && manyToOneCtrl.displayInfoButton()" ng-disabled="manyToOneCtrl.disabledDisplayInfo()" ng-click="manyToOneCtrl.openInfo(manyToOneCtrl.value, $event)">\n                    <i class="material-icons" style="font-size: 15px;">remove_red_eye</i>\n                  </button>\n                </div>\n              </div>\n            </div>';

        var templateForInnerMatch = !template ? '<span ng-bind-html="match.model.' + manyToOneCtrl.field + ' | uibTypeaheadHighlight:query"></span>' : '<span>' + manyToOneCtrl.match + '</span>';

        var templateForMatch = '\n            <a class="col-md-12 result gmd" style="white-space: normal;">\n              <span class="col-md-10 str" ng-click="manyToOneCtrl.select()">\n                ' + templateForInnerMatch + '\n                <span ng-show="$parent.$parent.$parent.$parent.manyToOneCtrl.valueToAdd == match.label && $parent.$parent.$parent.$parent.manyToOneCtrl.valueToAdd.length > 0 && !match.model.id && !!$parent.$parent.$parent.$parent.manyToOneCtrl.authorizeAdd">(novo)</span><br>\n              </span>\n              <span class="col-md-2">\n                <span class="icon text-right" ng-if="' + manyToOneCtrl.displayInfo + '" ng-click="$parent.$parent.$parent.$parent.manyToOneCtrl.openInfo(match.model, $event)" ng-hide="$parent.$parent.$parent.$parent.manyToOneCtrl.valueToAdd == match.label && !match.label.id">\n                  <i class="material-icons" style="font-size: 17px; vertical-align: middle; padding-top: 5px;">remove_red_eye</i>\n                </span>\n                <span style="float: right;" ng-show="$parent.$parent.$parent.$parent.manyToOneCtrl.activeFavorite">\n                  <i ng-show="!$parent.$parent.$parent.$parent.manyToOneCtrl.isFavorite(match.model)" \n                     title="Favoritar"\n                     ng-click="$parent.$parent.$parent.$parent.manyToOneCtrl.favorite($event, match.model)" \n                     class="material-icons favorite">star_border</i>\n\n                  <i ng-show="$parent.$parent.$parent.$parent.manyToOneCtrl.isFavorite(match.model)"\n                     title="Favoritar" \n                     ng-click="$parent.$parent.$parent.$parent.manyToOneCtrl.favorite($event, match.model)" \n                     class="material-icons favorite full">star</i>\n                </span>\n              </span>\n              <div class="clearfix"></div>\n            </a>\n            ';

        $templateCache.put('manyToOneTemplate' + manyToOneCtrl.field + '-' + $attrs.value + '.html', templateForMatch);

        var element = angular.element(baseTemplate),
            input = element.find('input'),
            form = $element.parent();
        while (form[0].nodeName != 'FORM') {
          form = form.parent();
        }var formController = $scope.$parent[form.attr('name')];

        $element.append($compile(element)($scope));

        ngModelCtrl = input.controller('ngModel');
        ngModelCtrlReset = angular.copy(ngModelCtrl);

        formController.$addControl(ngModelCtrl);

        ngModelCtrl.$viewChangeListeners.push(function () {
          // console.log('$viewChangeListeners', ngModelCtrl.$viewValue)
        });

        ngModelCtrl.$validators.manyToOne = function (modelValue, viewValue) {
          return modelValue ? !(typeof modelValue === 'string' || modelValue instanceof String) : true;
        };

        manyToOneCtrl.useGumgaLayout = function () {
          try {
            return !!angular.module('gumga.layout');
          } catch (error) {
            return false;
          }
        };

        if (!modelValueIsObject()) {
          handlingInputVisible();
        }

        $scope.$watch(function () {
          return ngModelCtrl.$$rawModelValue;
        }, function (i) {
          if (ngModelCtrl.$$rawModelValue == '') {
            delete ngModelCtrl.$$rawModelValue;
            delete manyToOneCtrl.value;
          } else {
            manyToOneCtrl.valueToAdd = ngModelCtrl.$$rawModelValue;
          }
        });
      };
    }

    return {
      restrict: 'E',
      replace: true,
      transclude: true,
      scope: {
        value: '=',
        loadingText: '@?',
        inputMatch: '@?',
        searchMethod: '&',
        postMethod: '&?',
        onSelect: '&?',
        activeFavorite: '=?',
        onDeselect: '&?',
        list: '=?',
        authorizeAdd: '=?',
        disabled: '=?',
        readonly: '=?',
        displayInfo: '=?',
        displayClear: '=?',
        editable: '=?',
        tabSeq: '=?',
        async: '=?',
        debounce: '@?'
      },
      controllerAs: 'manyToOneCtrl',
      bindToController: true,
      controller: controller
    };
  }
  angular.module('gumga.manytoone', ['ui.bootstrap']).directive('gumgaManyToOne', ManyToOne);
})();

/***/ })
/******/ ]);