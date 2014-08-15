var DateRangePicker = function(element, options) {

    this.element = $(element);
    this.inputs = $.map(options.inputs, function(i){
        return i.jquery ? i[0] : i;
    });
    delete options.inputs;

    $(this.inputs)
        .datepicker(options)
        .bind('changeDate', $.proxy(this.dateUpdated, this));

    this.pickers = $.map(this.inputs, function(i){
        return $(i).data('datepicker');
    });
    this.updateDates();
};

DateRangePicker.prototype.updateDates = function() {
    this.dates = $.map(this.pickers, function(i){
        return i.getUTCDate();
    });
    this.updateRanges();
};

DateRangePicker.prototype.updateRanges = function() {
    var range = $.map(this.dates, function(d){
        return d.valueOf();
    });
    $.each(this.pickers, function(i, p){
        p.setRange(range);
    });
};

DateRangePicker.prototype.dateUpdated = function(e) {
    // `this.updating` is a workaround for preventing infinite recursion
    // between `changeDate` triggering and `setUTCDate` calling.  Until
    // there is a better mechanism.
    if (this.updating)
        return;
    this.updating = true;

    var dp = $(e.target).data('datepicker'),
        new_date = dp.getUTCDate(),
        i = $.inArray(e.target, this.inputs),
        l = this.inputs.length;
    if (i === -1)
        return;

    $.each(this.pickers, function(i, p){
        if (!p.getUTCDate())
            p.setUTCDate(new_date);
    });

    if (new_date < this.dates[i]){
        // Date being moved earlier/left
        while (i >= 0 && new_date < this.dates[i]){
            this.pickers[i--].setUTCDate(new_date);
        }
    }
    else if (new_date > this.dates[i]){
        // Date being moved later/right
        while (i < l && new_date > this.dates[i]){
            this.pickers[i++].setUTCDate(new_date);
        }
    }
    this.updateDates();

    delete this.updating;
};

DateRangePicker.prototype.remove = function() {
    $.map(this.pickers, function(p){ p.remove(); });
    delete this.element.data().datepicker;
};
