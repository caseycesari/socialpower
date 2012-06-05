if (typeof sp === 'undefined' || !sp) {
  var sp = {};
}
/*
if (typeof sp.components === 'undefined' || !sp.components) {
  var sp.components = {};
}
*/

sp.components = (function ($) { 
  var _self;

  _self = {
    overlay: {
      init: function (overlayElem) {
        _self.overlay.overlayEl = overlayElem || $('div.overlay');
        _self.overlay.mask = $('#overlay-mask');
        this.open(_self.overlay.overlayEl, _self.overlay.mask);
      },

      open: function (overlayEl, mask) {
        mask.fadeIn('1000');
        this.positionOverlay(overlayEl);
        overlayEl.fadeIn('fast');
        this.setUpCloseClickHandlers(mask, overlayEl);
        this.setUpCloseClickHandlers(overlayEl.find('.close'), overlayEl);
      },

      positionOverlay: function (overlayEl) {
        var winH = $(window).height(),
            winW = $(window).width();

        overlayEl.css('top',  winH/2 - overlayEl.height()/2);
        overlayEl.css('left', winW/2 - overlayEl.width()/2);
      },

      setUpCloseClickHandlers: function (clickElem, overlayEl) {
        clickElem.click(function () {
          _self.overlay.close(overlayEl, _self.overlay.mask);
        });
      },

      close: function (overlayEl, mask) {
        mask.hide();
        overlayEl.hide();
      }
    }
  }

  return _self;

})(jQuery);
