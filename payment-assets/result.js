(function () {
  'use strict';
  if (window.location.pathname !== '/payment/') {
    window.history.replaceState(null, '', '/payment/');
  }
}());
