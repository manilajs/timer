(function($) {
  function Countdown(options) {
    this.$timer = $(options.$timer);
    this.$date = $(options.$date);
    this.date = options.date;
    this.initialize();
  }

  Countdown.prototype = {
    initialize: function() {
      this.update();
      $("title").html(this.getDateString());
    },

    update: function() {
      var self = this;

      var val = this.getTimeLeft();
      this.$timer.html(val);
      this.$date.html(this.getDateString());

      setTimeout($.proxy(this.update, this), 1000);
    },

    getMoment: function() {
      return moment(this.date);
    },

    //=> "Today at 9:00PM"
    getDateString: function() {
      return this.getMoment().calendar();
    },

    //=> "34 minutes"
    getTimeLeft: function() {
      var diff = this.getMoment().diff();

      if (diff > 0) return "" + sToDuration(diff / 1000);
      else return "now";
    }
  };

  function getSearch() {
    var str = window.location.search || '';
    return decodeURIComponent(str
      .replace(/\+/g, ' ')
      .replace(/\/$/, '')
      .replace(/\/$/, '')
      .replace(/^\?q=/, ''));
  }

  $(function() {
    $("textarea").autoexpand();

    var hash = getSearch().replace(/^in /, '+');
    var date = Date.parse(hash);

    if (date) {
      $("[role~='countdown_page']").removeClass('hide');
      new Countdown({
        $timer: $("[role~='timer_value']"),
        $date: $("[role~='timer_date']"),
        date: date
      });
    } else {
      $("[role~='message']").removeClass('hide');
    }
  });

  function sToDuration(n) {
    var units = [
      { secs: 86400, name: ["day", "days"] },
      { secs: 3600,  name: ["hour", "hours"] },
      { secs: 60,    name: ["minute", "minutes"] },
      { secs: 1,     name: ["second", "seconds"] }
    ];

    var remaining = n;
    var result = [];

    for (var i=0; i<units.length; ++i) {
      var unit = units[i];
      if (remaining >= unit.secs) {
        var number = parseInt(remaining / unit.secs, 10);
        remaining -= number * unit.secs;

        if (number === 1) {
          result.push("" + number + " " + unit.name[0]);
        } else {
          result.push("" + number + " " + unit.name[1]);
        }
      }
    }

    return result.join(" ");
  }

  window.sToDuration = sToDuration;
})(jQuery);
