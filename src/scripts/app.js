/* global _, io, moment, ColorThief */
angular
  .module('PVL', ['ngAnimate', 'ngMaterial'])
  .constant('io', io)
  .constant('jQuery', $)
  .constant('moment', moment)
  .constant('_', _)
  .constant('ColorThief', ColorThief);