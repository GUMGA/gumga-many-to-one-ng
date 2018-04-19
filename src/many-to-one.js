(function () {
  'use strict';

  ManyToOne.$inject = ['$templateCache', '$uibModal', '$compile', '$timeout'];

  function ManyToOne($templateCache, $uibModal, $compile, $timeout) {
    controller.$inject = ['$scope', '$element', '$attrs', '$transclude'];

    function controller($scope, $element, $attrs, $transclude) {
      let manyToOneCtrl = this, ngModelCtrl, ngModelCtrlReset;

      manyToOneCtrl.withStriped = $element.hasClass('striped');
      
      manyToOneCtrl.page = 1;

      $scope.$watch('manyToOneCtrl.lastParam', (value) => {
        $scope.$value = value;
      });

      const infiniteScroll = () => {
        manyToOneCtrl.infiniteDisabled = true;
        manyToOneCtrl.page++;
        manyToOneCtrl.proxySearch(manyToOneCtrl.lastParam, 10, manyToOneCtrl.page, true);
      };

      const startInfinityScroll = () => {
        $element.ready(() => {
          const elm = $element.find('ul[uib-typeahead-popup]');
          angular.element(elm).scroll((evt) => {
            let disabled = manyToOneCtrl.hasOwnProperty('infiniteDisabled') ? manyToOneCtrl.infiniteDisabled : false;
            if (elm.scrollTop() + elm.innerHeight() >= elm[0].scrollHeight && !disabled){
              infiniteScroll();
            }
          });
        })

      }

      manyToOneCtrl.$onInit = () => {

        const ERR_MSGS = {
          noValue: 'É necessário um atributo value no componente gumgaManyToOne',
          noField: 'É necessário um atributo field no componente gumgaManyToOne',
          noSearch: 'É necessário uma função de busca no componente gumgaManyToOne'
        }

        const possibleAttributes = ['loadingText', 'onSelect', 'value', 'list', 'searchMethod', 'field', 'onNewValueAdded', 'onValueSelected', 'onValueVisualizationOpened', 'onValueVisualizationClosed', 'tabindex']

        let template = false;

        let cache = getCookie(getKeyCookie());

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

        if (!$attrs.value) console.error(ERR_MSGS.noValue)
        if (!$attrs.field) console.error(ERR_MSGS.noField)

        manyToOneCtrl.ev = {}
        manyToOneCtrl.list = manyToOneCtrl.list || []
        manyToOneCtrl.ev.onNewValueAdded = $attrs.onNewValueAdded ? manyToOneCtrl.onNewValueAdded : angular.noop
        manyToOneCtrl.ev.onSelect = $attrs.onSelect ? manyToOneCtrl.onSelect : angular.noop
        manyToOneCtrl.ev.onValueVisualizationOpened = $attrs.onValueVisualizationOpened ? $attrs.onValueVisualizationOpened : angular.noop
        manyToOneCtrl.ev.onValueVisualizationClosed = $attrs.onValueVisualizationClosed ? $attrs.onValueVisualizationClosed : angular.noop
        manyToOneCtrl.field = $attrs.field || ''
        // manyToOneCtrl.description                   = $attrs.description                                         || false
        manyToOneCtrl.modalTitle = $attrs.modalTitle || 'Visualizador de Registro'
        manyToOneCtrl.modalFields = $attrs.modalFields ? $attrs.modalFields.split(',') : [manyToOneCtrl.field]
        manyToOneCtrl.postFields = $attrs.postFields ? $attrs.postFields.split(',') : [manyToOneCtrl.field]
        manyToOneCtrl.displayClear = manyToOneCtrl.hasOwnProperty('displayClear') ? manyToOneCtrl.displayClear : true
        manyToOneCtrl.displayInfo = manyToOneCtrl.hasOwnProperty('displayInfo') ? manyToOneCtrl.displayInfo : true
        manyToOneCtrl.editable = manyToOneCtrl.hasOwnProperty('editable') ? manyToOneCtrl.editable : true
        manyToOneCtrl.async = manyToOneCtrl.hasOwnProperty('async') ? manyToOneCtrl.async : true
        // manyToOneCtrl.showDescripion                = !!manyToOneCtrl.description

        function mirrorAttributes() {
          const isOneOfPossibles = attribute => possibleAttributes.filter(value => attribute == value).length > 0;
          return Object.keys($attrs.$attr).filter((value) => !isOneOfPossibles(value)).reduce((prev, next) => prev += `${next}="${$attrs[next]}"`, '');
        }

        manyToOneCtrl.displayInfoButton = displayInfoButton
        manyToOneCtrl.modelValueIsObject = modelValueIsObject
        manyToOneCtrl.disabledDisplayInfo = disabledDisplayInfo
        manyToOneCtrl.displayPlusButton = displayPlusButton
        manyToOneCtrl.displayClearButton = displayClearButton
        manyToOneCtrl.clearModel = clearModel
        manyToOneCtrl.openInfo = openInfo
        manyToOneCtrl.valueToAdd = ''
        manyToOneCtrl.afterSelect = afterSelect
        manyToOneCtrl.openTypehead = openTypehead
        manyToOneCtrl.showTypeheadAndHideMatch = showTypeheadAndHideMatch

        manyToOneCtrl.typeData = [];

        manyToOneCtrl.proxySearch = (param = '', pageSize = 10, page = 1, byInfinity) => {
          if(!byInfinity && manyToOneCtrl.lastParam == param){
            return;
          }
          if (!manyToOneCtrl.async) {
            if (param) param = param.toLowerCase();
            return manyToOneCtrl.list.filter(listItem => {
              return listItem[manyToOneCtrl.field].toLowerCase().indexOf(param) != -1;
            })
          } else {
            manyToOneCtrl.typeaheadLoading = true;
            manyToOneCtrl.lastParam = param;
            manyToOneCtrl.searchMethod({ param, pageSize, page }).then((resp) => {
              let data = resp.data && resp.data.values && Array.isArray(resp.data.values) ? resp.data.values : resp;  
              
              if(manyToOneCtrl.infinityPagination){
                if(page > 1){
                  data = manyToOneCtrl.lastArray.concat(data);
                }
                manyToOneCtrl.lastArray = angular.copy(data);
              }
              
              if (param && !manyToOneCtrl.infinityPagination && manyToOneCtrl.authorizeAdd) {
                let objToAppend = {};
                objToAppend[manyToOneCtrl.field] = manyToOneCtrl.valueToAdd;
                data = data.concat(objToAppend)
              }
              
              $timeout(() => {
                manyToOneCtrl.typeaheadLoading = false;
                manyToOneCtrl.infiniteDisabled = false;
                manyToOneCtrl.typeData = data;
                manyToOneCtrl.ngModelCtrl.$viewValue = "";
                manyToOneCtrl.inputElm[0].dispatchEvent(new Event('focus'));
                manyToOneCtrl.ngModelCtrl.$viewValue = param;
              })
            })
          }
        }

        manyToOneCtrl.proxySave = (val, abc) => {
          if (!abc) return
          manyToOneCtrl.isTypeaheadOpen = true;
          const controllerAs = 'ctrl'
          const resolve = { value: () => val }
          controller.$inject = ['$scope', '$uibModalInstance', 'value']
          function controller($scope, $uibModalInstance, value) {
            let ctrl = this;
            ctrl.object = value
            ctrl.cancel = obj => $uibModalInstance.dismiss('cancel');
            ctrl.save = obj => $uibModalInstance.close(obj);
          }

          function mountModalBody() {
            let fields = manyToOneCtrl.postFields;
            return fields.reduce((prev, next) => {
              let field = next.indexOf(':') != -1 ? next.trim().substring(0, next.indexOf(':')) : next.trim();
              let required = next.indexOf(':') != -1 ? next.trim().substring(next.indexOf(':') + 1, next.length) : 'false';
              return prev += `
                  <div class="form-group">
                    <label>${field}</label>
                    <input type="text" class="form-control" ${required == 'required' ? required : ''} ng-model="ctrl.object.${field}" />
                  </div>`;
            }, ' ');
          }

          let template = `
                <div class="modal-header">
                  <h3 class="modal-title">${manyToOneCtrl.modalTitle}</h3>
                </div>
                <div class="modal-body">
                  <form name="formNew">
                    ${mountModalBody()}
                  </form>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-default" ng-click="ctrl.cancel(ctrl.object)">Retornar</button>
                  <button type="button" class="btn btn-primary" ng-disabled="!formNew.$valid" ng-click="ctrl.save(ctrl.object)">Salvar</button>
                </div>`;


          $uibModal
            .open({ controller, template, controllerAs, resolve })
            .result
            .then(value => {
              manyToOneCtrl.postMethod({ value }).then(
                dataFromPostMethod => {
                  manyToOneCtrl.value = dataFromPostMethod.data.data
                  ngModelCtrl.$viewValue = dataFromPostMethod.data.data
                }
              )
            }, reject => {
              delete manyToOneCtrl.value;
            })
        }

        manyToOneCtrl.getRegisterStyle = () => {
          const height = manyToOneCtrl.inputElm.height() + 
                        $element.find('ul.dropdown-menu[uib-typeahead-popup]').height();
          return {
            top: height + 18
          };
        }

        manyToOneCtrl.isOpenTyp = () => {
          const elm = $element.find('ul.dropdown-menu[uib-typeahead-popup] > *');
          return elm && elm.scope && elm.scope() && elm.scope().isOpen && elm.scope().isOpen();
        }

        function displayClearButton() {
          return manyToOneCtrl.displayClear
        }

        function displayInfoButton() {
          return manyToOneCtrl.displayInfo
        }

        function getKeyCookie() {
          let user = sessionStorage.getItem('user');
          if (user) {
            user = JSON.parse(user);
            return (user.instanceOrganizationHierarchyCode || '') + 'favorite-' + $attrs.name;
          } else {
            return 'favorite-' + $attrs.name;
          }
        }

        function modelValueIsObject() {
          if (manyToOneCtrl.disabled) return true
          if (!manyToOneCtrl.value) return true;
          return !(typeof manyToOneCtrl.value === 'object')
        }

        function disabledDisplayInfo() {
          return !(typeof manyToOneCtrl.value === 'object')
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
          manyToOneCtrl.opened = true;
          if (manyToOneCtrl.value) {
            delete manyToOneCtrl.value;
            showTypeheadAndHideMatch();
          } else {
            if (manyToOneCtrl.isTypeaheadOpen) return;
            document.getElementById('typeahead-' + manyToOneCtrl.field + '-' + $attrs.value).focus();
          }
          delete manyToOneCtrl.lastParam;
          manyToOneCtrl.page = 1;
          manyToOneCtrl.proxySearch('');
        }

        function showTypeheadAndHideMatch() {
          manyToOneCtrl.visible = 'typeahead';

          $timeout(() => {
            manyToOneCtrl.value = angular.copy(manyToOneCtrl.inputMatchValue);
            openTypehead();
            delete manyToOneCtrl.inputMatchValue;
          })

        }

        manyToOneCtrl.isTypeaheadOpen = true;

        function displayPlusButton() {
          return manyToOneCtrl.postMethod
            && (typeof ngModelCtrl.$$rawModelValue === 'string' || ngModelCtrl.$$rawModelValue instanceof String)
            && ngModelCtrl.$$rawModelValue.length > 0
        }

        function handlingInputVisible() {
          if (manyToOneCtrl.inputMatch) {
            let span = document.getElementById('match-' + manyToOneCtrl.field + '-' + $attrs.value);
            let inputMatch = manyToOneCtrl.inputMatch.replace(/{/g, '{{').replace(/}/g, '}}').replace(/item/g, 'manyToOneCtrl.value');
            let update = '<span style="display: none;" id="match-' + manyToOneCtrl.field + '-' + $attrs.value + '">' + inputMatch + '</span>';
            angular.element(span).replaceWith($compile(update)($scope))
            $timeout(() => {
              let content = document.getElementById('match-' + manyToOneCtrl.field + '-' + $attrs.value);
              manyToOneCtrl.inputMatchValue = content.innerHTML;
              manyToOneCtrl.visible = 'inputMatchValue';
            });
          } else {
            manyToOneCtrl.visible = 'typeahead';
          }
        }

        function afterSelect($item, $model, $label, $event, isBtn, match) {
          delete manyToOneCtrl.opened;
          handlingInputVisible();
          if (!$model.id && manyToOneCtrl.authorizeAdd) {
            manyToOneCtrl.proxySave($model, isBtn);
          }
          ngModelCtrl.$setValidity('manyToOne', true);
          if (manyToOneCtrl.ev.onSelect) manyToOneCtrl.ev.onSelect({ value: $model });
          $timeout(() => {
            delete manyToOneCtrl.lastParam;
            manyToOneCtrl.page = 1;
          }, 1000)
        }

        function openInfo(object = {}, $event) {

          manyToOneCtrl.isTypeaheadOpen = true;
          $event.stopImmediatePropagation()
          $event.preventDefault()
          controller.$inject = ['$scope', '$uibModalInstance']

          function controller($scope, $uibModalInstance) {
            $scope.close = () => $uibModalInstance.close()
          }

          function mountModalBody() {
            let fields = manyToOneCtrl.modalFields
            return fields.reduce((prev, next) => {
              return prev += `
                  <div class="form-group">
                    ${ (typeof object[next] === 'string' || object[next] instanceof String) ? `<label>${next}</label>` : ' '}
                    ${ (typeof object[next] === 'string' || object[next] instanceof String) ? `<input type="text" class="form-control" value="${object[next]}" disabled />` : ' '}
                  </div>`
            }, ' ')
          }

          let template = `
              <div class="modal-header">
                <h3 class="modal-title">${manyToOneCtrl.modalTitle}</h3>
              </div>
              <div class="modal-body">
                ${mountModalBody()}
              </div>
              `
          $uibModal.open({ controller, template })

        }

        const observeClickBtnRegister = () => {
          $element.find('gmto-register-button').click((evt) => {
            manyToOneCtrl.onRegisterClick({ param: manyToOneCtrl.lastParam });
          });
        }

        $transclude($scope, cloneEl => {
          angular.forEach(cloneEl, cl => {
            let element = angular.element(cl)[0];
            if (element.nodeName && element.nodeName === 'MATCH') {
              template = true
              manyToOneCtrl.match = element.innerHTML
            }
            if (element.nodeName && element.nodeName === 'GMTO-REGISTER') {
              manyToOneCtrl.templateRegister = element.innerHTML;
            }
          });
        })

        manyToOneCtrl.keyUp = ($event) => {
          if(manyToOneCtrl.keyDebounce){
            $timeout.cancel( manyToOneCtrl.keyDebounce );
          }
          if ($event.target.value == '' && $event.keyCode != 40 && $event.keyCode != 38 && manyToOneCtrl.lastValue != $event.target.value) {
            manyToOneCtrl.lastValue = $event.target.value;
            angular.element($event.target).blur();
            $timeout(() => angular.element($event.target).focus());
          }
          manyToOneCtrl.keyDebounce = $timeout(() => {
            manyToOneCtrl.page = 1;
            manyToOneCtrl.lastArray = [];
            manyToOneCtrl.proxySearch($event.target.value);
          }, manyToOneCtrl.debounce || 1000);
        }

        function setCookie(name, value, days) {
          var expires = "";
          if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
          }
          document.cookie = name + "=" + (value || "") + expires + "; path=/";
        }

        function getCookie(name) {
          var nameEQ = name + "=";
          var ca = document.cookie.split(';');
          for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
          }
          return null;
        }

        function eraseCookie(name) {
          document.cookie = name + '=; Max-Age=-99999999;';
        }

        manyToOneCtrl.favorite = ($event, model) => {
          if ($event) $event.stopPropagation();
          if (angular.equals(model, manyToOneCtrl.favoriteModel)) {
            eraseCookie(getKeyCookie());
            delete manyToOneCtrl.favoriteModel;
            return;
          }
          setCookie(getKeyCookie(), JSON.stringify(model), 999999);
          manyToOneCtrl.favoriteModel = model;
        }

        manyToOneCtrl.isFavorite = model => {
          return angular.equals(model, manyToOneCtrl.favoriteModel);
        }

        manyToOneCtrl.inputBlur = (event) => {
          delete manyToOneCtrl.opened;
          delete manyToOneCtrl.noResults;
          if (!manyToOneCtrl.value) {
            ngModelCtrl.$viewValue = '';
            ngModelCtrl.$render();
          }
        };

        manyToOneCtrl.inputFocus = (event) => {
          $timeout(() => {
            manyToOneCtrl.opened = true;
            manyToOneCtrl.proxySearch(manyToOneCtrl.lastParam);
          })
        }

        manyToOneCtrl.inputClick = () => {
          if (manyToOneCtrl.typeaheadLoading || manyToOneCtrl.opened) return;
          if (!manyToOneCtrl.value) {
            $element.find('input').blur();
            manyToOneCtrl.openTypehead();
            $element.find('input').focus();
          }
        }

        /*  */
        let baseTemplate = `
            <style>
              gumga-many-to-one [uib-typeahead-popup].dropdown-menu{
                  width: 100%;
                  max-height: 210px;
                  overflow: auto;
              }
              gumga-many-to-one .item-striped{
                background-color: #f5f5f5;
              }
              gumga-many-to-one a.result {
                display: flex;
                height: 42px;
                align-items: center;
              }
              gumga-many-to-one a.result > span.str{
                display: flex;
              }
              gumga-many-to-one input{
                color: #999 !important;
                padding-right: 32px;
                font-size: 1.6rem !important;
              }
              gumga-many-to-one button.left-button{
                padding: 0; width: 32px; padding-top: 10px; padding-bottom: 3px;
              }
              gumga-many-to-one input.form-control.ng-valid-many-to-one{
                color: #555 !important;
              }
              gumga-many-to-one i.favorite{
                color: #ccc;
              }
              gumga-many-to-one i.favorite.full{
                color: #d9d90d;
              }
              gumga-many-to-one i.favorite:hover{
                cursor: pointer; 
              }
              gumga-many-to-one .input-group button.btn[ng-click="manyToOneCtrl.openTypehead()"]{
                z-index: 3;
              }
              gumga-many-to-one .progress {
                max-width: 100%;
                overflow: hidden;
                background: #ddd;
                left: 0;
                width: 100%;
                border-radius: 0;
                height: 2px;
                bottom: 0;
                margin: 0;
                padding: 0;
                bottom: 0;
                height: 3px;
                z-index: 4;
              }
              gumga-many-to-one .indeterminate {
                position: absolute;
                width: 100%;
                height: 2px;
                transform: translateZ(0);
              }
              gumga-many-to-one .indeterminate:before, .indeterminate:after {
                content: '';
                position: absolute;
                background-color: #001eff;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
              }
              gumga-many-to-one .indeterminate:before {
                animation: indeterminate 3s cubic-bezier(0.195, 0.36, 0.945, 1.65) infinite;
              }
              gumga-many-to-one .indeterminate:after {
                animation: indeterminate 3s cubic-bezier(0.9, -0.59, 0.715, 1.045) infinite;
              }
              
              @keyframes indeterminate {
                0% {
                  width: 0%;
                  transform: translateX(-100%);
                }
                100% {
                  width: 100%;
                  transform: translateX(100%);
                }
              }
              gumga-many-to-one input.form-control.gmd.size-55{
                padding-right: 55px;
              }
              gumga-many-to-one input.form-control.gmd.size-25{
                padding-right: 25px;
              }
              gumga-many-to-one.gmd .dropdown-menu > .active > a.item-not-striped, gumga-many-to-one.gmd .dropdown-menu > .active > a.item-not-striped:focus, gumga-many-to-one.gmd .dropdown-menu > .active > a.item-not-striped:hover{
                background: #FFF;
              }
              gumga-many-to-one.gmd .dropdown-menu > .active > a, gumga-many-to-one.gmd .dropdown-menu > .active > a:focus, gumga-many-to-one.gmd .dropdown-menu > .active > a:hover{
                cursor: pointer;
              }

              gumga-many-to-one .dropdown-menu>li>a{
                padding: 3px 0px;
              }

              gumga-many-to-one .register-container{
                position: absolute;
                left: 0;
                width: 100%;
                background: #0C82C6;
                border: none;
                padding: 0 14px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.175);
                z-index: 9999;
                color: #FFF;
                display: flex;
                align-items: center;
                height: 54px;
              }

              gumga-many-to-one .register-container * {
                margin: 0;
              }

              gumga-many-to-one gmto-register-label{
                flex: 1;
              }

              gumga-many-to-one gmto-register-button{
                padding: 8px 16px 8px 16px;
                border-radius: 3px;
                float: right;
                background: #0CCFB2;
                cursor: pointer;
                text-transform: uppercase;
              }

            </style>
            <div style="position: relative;">
              <div class="progress indeterminate" ng-show="manyToOneCtrl.typeaheadLoading"></div>
              <div style="width: 100%;" ng-class="{'input-group': (manyToOneCtrl.displayInfoButton() && manyToOneCtrl.modelValueIsObject()) || manyToOneCtrl.displayClearButton()}">
                  <input type="text"
                         ng-init="manyToOneCtrl.visible = 'typeahead'"
                         ng-show="manyToOneCtrl.visible == 'typeahead'"
                         id="typeahead-${manyToOneCtrl.field}-${$attrs.value}"
                         class="form-control gmd inputahead"
                         tabindex="${manyToOneCtrl.tabSeq}"
                         ng-click="manyToOneCtrl.inputClick()"
                         ng-disabled="manyToOneCtrl.disabled"
                         ng-readonly="manyToOneCtrl.readonly"
                         ng-model="manyToOneCtrl.value"
                         ng-focus="manyToOneCtrl.inputFocus($event)"
                         ng-blur="manyToOneCtrl.inputBlur($event)"
                         onfocus="this.classList.add('focused')"
                         ng-class="{'size-25' : manyToOneCtrl.modelValueIsObject() && manyToOneCtrl.displayClearButton(), 'size-55' : !(manyToOneCtrl.modelValueIsObject() && manyToOneCtrl.displayClearButton())}"
                         ng-keyup="manyToOneCtrl.keyUp($event)"
                         onblur="this.classList.remove('focused')"
                         ng-model-options="{ debounce: ${manyToOneCtrl.debounce || 1000} }"
                         uib-typeahead="$value as $value[manyToOneCtrl.field] for $value in manyToOneCtrl.typeData"
                          ${mirrorAttributes()}
                         typeahead-template-url="manyToOneTemplate${manyToOneCtrl.field}-${$attrs.value}.html"
                         typeahead-is-open="manyToOneCtrl.isTypeaheadOpen"
                         typeahead-editable="${manyToOneCtrl.editable}"
                         typeahead-show-hint="true"
                         typeahead-min-length="0"
                         typeahead-on-select="manyToOneCtrl.afterSelect($item, $model, $label, $event, 'isNotButton', manyToOneCtrl.match)"
                         typeahead-no-results="manyToOneCtrl.noResults"
                         autocomplete="off"/>
                         <div ng-show="manyToOneCtrl.noResults && !manyToOneCtrl.typeaheadLoading" style="position: absolute; left: 0; width: 100%; top: 34px; background: #FFF; z-index: 999; padding: 15px; border-top: 1px solid #ccc; box-shadow: 0 2px 4px rgba(0,0,0,0.175);">
                          {{${manyToOneCtrl.messageNoResult} || 'Nenhum resultado foi encontrado.'}}
                         </div>
                  <input type="text" ng-keyup="manyToOneCtrl.showTypeheadAndHideMatch()" ng-model="manyToOneCtrl.inputMatchValue" class="form-control" ng-show="manyToOneCtrl.visible == 'inputMatchValue'"/>
                  <div ng-show="manyToOneCtrl.typeaheadLoading && manyToOneCtrl.loadingText" style="position: absolute; top: 40px;">
                    <i class="glyphicon glyphicon-refresh"></i>
                    {{manyToOneCtrl.loadingText}}
                  </div>


                <span ng-hide="true" id="match-${manyToOneCtrl.field}-${$attrs.value}"></span>
                <div class="input-group-btn input-group-btn-icon" style="position: absolute; right: {{manyToOneCtrl.modelValueIsObject() && manyToOneCtrl.displayClearButton() ? '25px;' : manyToOneCtrl.displayInfo ? '87px' : '55px'}};" ng-show="(manyToOneCtrl.displayInfoButton() && manyToOneCtrl.modelValueIsObject()) || manyToOneCtrl.displayClearButton()">
                  <button type="button" style="z-index: 3;" class="left-button btn btn-default gmd" ng-show="!manyToOneCtrl.modelValueIsObject() && manyToOneCtrl.displayClearButton()" ng-click="manyToOneCtrl.clearModel()">
                    <i ng-show="manyToOneCtrl.useGumgaLayout()" class="material-icons" style="font-size: 15px;">close</i>
                    <i ng-show="!manyToOneCtrl.useGumgaLayout()" class="glyphicon glyphicon-remove" style="font-size: 15px;"></i>
                  </button>
                  <button type="button" class="btn btn-default gmd"
                          style="padding-bottom: 7px;"
                          ng-click="manyToOneCtrl.openTypehead()">
                    <span class="caret"></span>                    
                  </button>
                  <button type="button" style="z-index: 3;" class="left-button btn btn-default gmd" ng-show="!manyToOneCtrl.modelValueIsObject() && manyToOneCtrl.displayInfoButton()" ng-disabled="manyToOneCtrl.disabledDisplayInfo()" ng-click="manyToOneCtrl.openInfo(manyToOneCtrl.value, $event)">
                    <i class="material-icons" style="font-size: 15px;">remove_red_eye</i>
                  </button>
                </div>
              </div>
              <div ng-style="manyToOneCtrl.getRegisterStyle()" class="register-container" ng-show="!manyToOneCtrl.value && (manyToOneCtrl.opened || manyToOneCtrl.isOpenTyp()) && manyToOneCtrl.lastParam">
                ${ manyToOneCtrl.templateRegister }
              </div>
            </div>`


        let templateForInnerMatch = (!template) ? `<span ng-bind-html="match.model.${manyToOneCtrl.field} | uibTypeaheadHighlight:query"></span>` : `<span>${manyToOneCtrl.match}</span>`

        let templateForMatch = `
            <a class="col-md-12 result gmd {{ $parent.$parent.$parent.$parent.manyToOneCtrl.withStriped ? ($parent.$index % 2 == 0 ? 'item-striped' : 'item-not-striped') : '' }}" style="white-space: normal;">
              <span class="col-md-10 str" ng-click="manyToOneCtrl.select()">
                ${templateForInnerMatch}
                <span ng-show="$parent.$parent.$parent.$parent.manyToOneCtrl.valueToAdd == match.label && $parent.$parent.$parent.$parent.manyToOneCtrl.valueToAdd.length > 0 && !match.model.id && !!$parent.$parent.$parent.$parent.manyToOneCtrl.authorizeAdd">(novo)</span><br>
              </span>
              <span class="col-md-2">
                <span class="icon text-right" ng-if="${manyToOneCtrl.displayInfo}" ng-click="$parent.$parent.$parent.$parent.manyToOneCtrl.openInfo(match.model, $event)" ng-hide="$parent.$parent.$parent.$parent.manyToOneCtrl.valueToAdd == match.label && !match.label.id">
                  <i class="material-icons" style="font-size: 17px; vertical-align: middle; padding-top: 5px;">remove_red_eye</i>
                </span>
                <span style="float: right;" ng-show="$parent.$parent.$parent.$parent.manyToOneCtrl.activeFavorite">
                  <i ng-show="!$parent.$parent.$parent.$parent.manyToOneCtrl.isFavorite(match.model) && match.model.id" 
                     title="Favoritar"
                     ng-click="$parent.$parent.$parent.$parent.manyToOneCtrl.favorite($event, match.model)" 
                     class="material-icons favorite">star_border</i>

                  <i ng-show="$parent.$parent.$parent.$parent.manyToOneCtrl.isFavorite(match.model) && match.model.id"
                     title="Favoritar" 
                     ng-click="$parent.$parent.$parent.$parent.manyToOneCtrl.favorite($event, match.model)" 
                     class="material-icons favorite full">star</i>
                </span>
              </span>
              <div class="clearfix"></div>
            </a>
            `

        $templateCache.put(`manyToOneTemplate${manyToOneCtrl.field}-${$attrs.value}.html`, templateForMatch)

        let element = angular.element(baseTemplate),
          input = element.find('input'),
          form = $element.parent()
        while (form[0].nodeName != 'FORM') form = form.parent();
        let formController = $scope.$parent[form.attr('name')]

        $element.append($compile(element)($scope))

        ngModelCtrl = input.controller('ngModel')
        ngModelCtrlReset = angular.copy(ngModelCtrl)
        manyToOneCtrl.ngModelCtrl = ngModelCtrl;
        manyToOneCtrl.inputElm = input;
        formController.$addControl(ngModelCtrl);

        ngModelCtrl.$validators.manyToOne = (modelValue, viewValue) => {
          return modelValue ? !(typeof modelValue === 'string' || modelValue instanceof String) : true
        }

        manyToOneCtrl.useGumgaLayout = () => {
          try {
            return !!angular.module('gumga.layout');
          } catch (error) {
            return false;
          }
        }

        if (!modelValueIsObject()) {
          handlingInputVisible();
        }

        $scope.$watch(() => ngModelCtrl.$$rawModelValue, (i) => {
          if (ngModelCtrl.$$rawModelValue == '') {
            delete ngModelCtrl.$$rawModelValue;
            delete manyToOneCtrl.value;
          } else {
            manyToOneCtrl.valueToAdd = ngModelCtrl.$$rawModelValue;
          }
        })

        if (manyToOneCtrl.infinityPagination) {
          startInfinityScroll();
        }

        observeClickBtnRegister();
      }

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
        onRegisterClick: '&?',
        list: '=?',
        authorizeAdd: '=?',
        disabled: '=?',
        readonly: '=?',
        displayInfo: '=?',
        displayClear: '=?',
        editable: '=?',
        tabSeq: '=?',
        async: '=?',
        infinityPagination: '=?',
        debounce: '@?'
      },
      controllerAs: 'manyToOneCtrl',
      bindToController: true,
      controller
    }
  }
  angular.module('gumga.manytoone', ['ui.bootstrap'])
    .directive('gumgaManyToOne', ManyToOne);
})();