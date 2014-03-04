var Countdown = function(duration, onTick, onComplete) {
    var ONE_MINUTE = 60;

    var secondsLeft = 0;
    var totalSecondsLeft = Math.round(duration);
    var interval = null;

    var tick = function() {
      if (totalSecondsLeft > 0) {
        var minutesLeft = Math.floor(totalSecondsLeft / ONE_MINUTE);
        onTick(minutesLeft, secondsLeft);
        if( secondsLeft == 0) {
          secondsLeft = (duration >= ONE_MINUTE ? ONE_MINUTE : duration) 
        }
        secondsLeft -= 1; 
        totalSecondsLeft -= 1;
      } else {
        clearInterval(interval);
        onComplete();
      }
    };

    var self = {
      resume: function () {
        interval = setInterval(tick, 1000);
      },
      pause: function() {
        clearInterval(interval);
      },
      reset: function() {
        self.pause();
        totalSecondsLeft = Math.round(duration);
        mSecondsLeft = 0;
      }
    };

    self.resume();
    tick();

    return self;
  };
function Clock(selector) {
  this.$clock = $(selector);
  this.countdown = null;
};

Clock.prototype.start = function () {
  var self = this;

  if (this.countdown) {
    this.countdown.resume();
    return;
  }

  var formatWithLeadingZero = function (value) {
    return value < 10 ? '0' + value : value;
  };

  var onTick = function (minutesLeft, secondsLeft) {
    var minutes = formatWithLeadingZero(minutesLeft);
    var seconds = formatWithLeadingZero(secondsLeft);
    self.$clock.html(minutes + ':' + seconds);
  };

  var onComplete = function () {
    self.reset();
    alert('Game Over');
  };

  this.countdown = new Countdown(1 * 60, onTick, onComplete);
};

Clock.prototype.pause = function () {
  var self = this;
  if (!this.countdown) return;
  this.countdown.pause(); 
};

Clock.prototype.reset = function () {
  var self = this;
  if (!this.countdown) return;
  this.countdown.reset(); 
  delete this.countdown;
  self.$clock.html('00:00');
};

var App = (function(){
    var db = localStorage;
    var clock = null;

    function initialize() {	
      clock = new Clock('#clock');
      bindEvents();
    }

    function bindEvents() {
      $("#start").on('click', function() {
        clock.start()
        $('#pause').show();
        $(this).hide();
      });
      $("#stop" ).on('click', function () {
        clock.reset();
      });        
      $("#pause" ).on('click', function () {
        clock.pause();
        $('#start').show();
        $(this).hide();
      });        
    }

    return { initialize: initialize };
})();


