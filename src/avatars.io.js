// Generated by CoffeeScript 1.3.3
var AvatarsIO;

AvatarsIO = (function() {

  function AvatarsIO(token) {
    this.token = token;
  }

  AvatarsIO.prototype.create = function(selector) {
    return new AvatarsIO.Uploader(this.token, selector);
  };

  return AvatarsIO;

})();

AvatarsIO.Uploader = (function() {

  Uploader.prototype.listeners = {};

  Uploader.prototype.shortcut = '';

  Uploader.prototype.allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];

  function Uploader(token, selector) {
    this.token = token;
    this.selector = selector;
    this.initialize();
    this.emit('init');
  }

  Uploader.prototype.initialize = function() {
    var url,
      _this = this;
    url = "http://avatars.io/v1/upload?authorization=" + this.token + (this.shortcut.length > 0 ? '&shortcut=' + this.shortcut : '');
    this.socket = new easyXDM.Socket({
      remote: url,
      onMessage: function(message, origin) {
        return _this.emit('complete', message);
      }
    });
    if (!this.widget) {
      return this.widget = new AjaxUpload($(this.selector)[0], {
        action: url,
        name: 'avatar',
        allowedExtensions: this.allowedExtensions,
        onSubmit: function() {
          return _this.emit('new');
        }
      });
    }
  };

  Uploader.prototype.setShortcut = function(shortcut) {
    var _this = this;
    this.shortcut = shortcut != null ? shortcut : '';
    return setTimeout(function() {
      if (_this.socket) {
        _this.socket.destroy();
      }
      return _this.initialize();
    }, 100);
  };

  Uploader.prototype.setAllowedExtensions = function(allowedExtensions) {
    this.allowedExtensions = allowedExtensions != null ? allowedExtensions : [];
    if (this.widget) {
      return this.widget._settings.allowedExtensions = this.allowedExtensions;
    }
  };

  Uploader.prototype.on = function(event, listener) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    return this.listeners[event].push(listener);
  };

  Uploader.prototype.emit = function(event, args, context) {
    var listener, _i, _len, _ref;
    if (context == null) {
      context = this;
    }
    if (!this.listeners[event]) {
      return;
    }
    _ref = this.listeners[event];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      listener = _ref[_i];
      listener.apply(context, [args]);
    }
    return void 0;
  };

  return Uploader;

})();
