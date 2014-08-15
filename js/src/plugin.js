/* global opts_from_el, opts_from_locale, DateRangePicker, Datepicker */
/* exported locale_opts, dates */

var old = $.fn.datepicker;

var defaults = {
    autoclose: false,
    beforeShowDay: $.noop,
    calendarWeeks: false,
    clearBtn: false,
    daysOfWeekDisabled: [],
    endDate: Infinity,
    forceParse: true,
    format: 'mm/dd/yyyy',
    keyboardNavigation: true,
    language: 'en',
    minViewMode: 0,
    multidate: false,
    multidateSeparator: ',',
    orientation: "auto",
    rtl: false,
    startDate: -Infinity,
    startView: 0,
    todayBtn: false,
    todayHighlight: false,
    weekStart: 0
};


$.fn.datepicker = function(option){
    var args = Array.apply(null, arguments);
    args.shift();
    var internal_return;

    this.defaults = defaults;

    this.each(function(){
        var $this = $(this),
            data = $this.data('datepicker'),
            options = typeof option === 'object' && option;
        if (!data){
            var elopts = opts_from_el(this, 'date'),
                // Preliminary otions
                xopts = $.extend({}, defaults, elopts, options),
                locopts = opts_from_locale(xopts.language),
                // Options priority: js args, data-attrs, locales, defaults
                opts = $.extend({}, defaults, locopts, elopts, options);
            if ($this.is('.input-daterange') || opts.inputs){
                var ropts = {
                    inputs: opts.inputs || $this.find('input').toArray()
                };
                $this.data('datepicker', (data = new DateRangePicker(this, $.extend(opts, ropts))));
            }
            else {
                $this.data('datepicker', (data = new Datepicker(this, opts)));
            }
        }
        if (typeof option === 'string' && typeof data[option] === 'function'){
            internal_return = data[option].apply(data, args);
            if (internal_return !== undefined)
                return false;
        }
    });
    if (internal_return !== undefined)
        return internal_return;
    else
        return this;
};

var locale_opts = $.fn.datepicker.locale_opts = [
    'format',
    'rtl',
    'weekStart'
];
$.fn.datepicker.Constructor = Datepicker;

var dates = $.fn.datepicker.dates = {
    en: {
        days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
        months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        today: "Today",
        clear: "Clear"
    }
};




/* DATEPICKER NO CONFLICT
* =================== */

$.fn.datepicker.noConflict = function(){
    $.fn.datepicker = old;
    return this;
};





