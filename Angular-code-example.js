
angular
  .module('UI')
  // ------------------------------------------------
  //  ySpinner
  // ------------------------------------------------
  .directive('ySpinner',['$compile', function($compile) {
    'use strict';

    return {
      restrict: 'EA',
      scope: {
        ySpinner: '=',
        ySpinnerHideContent: '@',
        ySpinnerSize: '@',
        ySpinnerTopPosition: '@',
        ySpinnerTopPadding: '@',
        ySpinnerLeftPosition: '@',
        ySpinnerLeftPadding: '@',
        ySpinnerColor: '@'
      },
      link: function($scope, element, $attrs) {

        /*
         *  Set spinner size
         */
        var width  = 50;
        var height = 50;
        var radius = 20;
        $scope.strokeColor = $scope.ySpinnerColor === 'blue' ? "#6DA9BD" : "white";
        var spinnerTemplate = '<span style="position: absolute; z-index: 1000; display: inline-block;" class="spinner loader"><svg class="circular"><circle class="path" cx="' + width / 2 + '" cy="' + height / 2 + '" r="' + radius + '" fill="none" stroke="{{strokeColor}}" stroke-width="2" stroke-miterlimit="10"/></svg></span>';
        var compiledTemplate = $compile(spinnerTemplate)($scope);
        var spinnerContainer = $(compiledTemplate);

        var setContentVisibility;

        if (!$attrs.ySpinnerHideContent || $attrs.ySpinnerHideContent=='false') {
          setContentVisibility = _.noop;
        } else if ($attrs.ySpinnerHideContent == 'opacity') {
          setContentVisibility = function(visible) {
            element.children().not(spinnerContainer).css('opacity', visible ? 1: 0);
          }
        } else {
          setContentVisibility = function(visible) {
            element.children().not(spinnerContainer).css('display', visible ? 'block': 'none');
          }
        }

        $scope.$watch('ySpinner', function(newVal, oldVal) {

          if (newVal == true) {
            /*
             *  Store original height and width of element
             */
            var originalHeight = $(element).outerHeight();
            var originalWidth = $(element).outerWidth();

            /*
             *  Store original paddings
             */
            var originalPaddingLeft = parseInt($(element).css('padding-left').replace('px', ''));
            var originalPaddingRight = parseInt($(element).css('padding-right').replace('px', ''));
            var originalPaddingTop = parseInt($(element).css('padding-top').replace('px', ''));
            var originalPaddingBottom = parseInt($(element).css('padding-bottom').replace('px', ''));        

            /*
             *  Position size
             */
            var topPosition, leftPosition;
            if (!$scope.shouldHideContent()) {
              var spinnerPaddingLeft = $scope.usingCustomPaddingLeft() ? $scope.ySpinnerLeftPadding : originalPaddingLeft;
              var spinnerPaddingTop = $scope.usingCustomPaddingTop() ? $scope.ySpinnerTopPadding : originalPaddingTop;

              // Set top position
              if ($scope.isSmall()) {
                topPosition = 15;
                spinnerContainer.css('zoom', 0.4);
                if (!element.hasClass('search')) {
                  $scope.buttonLabel = element.text();
                  element.html("&nbsp;");
                  topPosition = 15;
                  leftPosition =  originalWidth + parseInt(spinnerPaddingLeft);
                } else {
                  topPosition = 20;
                  leftPosition = 12;
                }
              } else {
                var position = element.hasClass('realtime') ? 'absolute' : 'relative';
                spinnerContainer.css('position', position);
                topPosition = $scope.isVerticallyCentered() ? (originalPaddingTop + ((originalHeight - originalPaddingTop - originalPaddingBottom - height) / 2)) : spinnerPaddingTop;
                leftPosition = $scope.isHorizontallyCentered() ? (spinnerPaddingLeft + ((originalWidth - spinnerPaddingLeft - originalPaddingRight - width) / 2)) : spinnerPaddingLeft;
              }
            } else {
              topPosition = 0;
              leftPosition = 0;
            }

            setContentVisibility(false);
            element.prepend(compiledTemplate);

            spinnerContainer.css('top', topPosition+'px');
            spinnerContainer.css('left', leftPosition+'px');
            spinnerContainer.css('width', width);
            spinnerContainer.css('height', height);
            spinnerContainer.css('display', 'block');

            spinnerContainer.children('.circular').css('width', width);
            spinnerContainer.children('.circular').css('height', height);
          } else {
            spinnerContainer.remove();
            setContentVisibility(true);
            if ($scope.buttonLabel) {
              element.text($scope.buttonLabel);
            }
          }
        });
      },
      controller: function($scope) {

        $scope.usingCustomPaddingLeft = function() {
          return angular.isDefined($scope.ySpinnerLeftPadding);
        };


        $scope.usingCustomPaddingTop = function() {
          return angular.isDefined($scope.ySpinnerTopPadding);
        };


        $scope.shouldHideContent = function() {
          return ($scope.ySpinnerHideContent == true);
        };


        $scope.isSmall = function() {
          return ($scope.ySpinnerSize == 'small');
        };


        $scope.isBig = function() {
          return !$scope.isSmall();
        };


        $scope.isVerticallyCentered = function() {
          return $scope.ySpinnerTopPosition == 'middle';
        };


        $scope.isHorizontallyCentered = function() {
          return $scope.ySpinnerLeftPosition == 'center';          
        };
      }
    };
  }]);
