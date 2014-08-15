/* global dates, locale_opts */
/* exported UTCToday, opts_from_el, opts_from_locale */

function UTCDate(){
    return new Date(Date.UTC.apply(Date, arguments));
}
function UTCToday(){
    var today = new Date();
    return UTCDate(today.getFullYear(), today.getMonth(), today.getDate());
}

var DateArray = (function(){
    var extras = {
        get: function(i){
            return this.slice(i)[0];
        },
        contains: function(d){
            // Array.indexOf is not cross-browser;
            // $.inArray doesn't work with Dates
            var val = d && d.valueOf();
            for (var i=0, l=this.length; i < l; i++) {
                if (this[i].valueOf() === val) {
                    return i;
                }
            }
            return -1;
        },
        remove: function(i){
            this.splice(i,1);
        },
        replace: function(new_array){
            if (!new_array) {
                return;
            }
            if (!$.isArray(new_array)) {
                new_array = [new_array];
            }
            this.clear();
            this.push.apply(this, new_array);
        },
        clear: function(){
            this.length = 0;
        },
        copy: function(){
            var a = new DateArray();
            a.replace(this);
            return a;
        }
    };

    return function(){
        var a = [];
        a.push.apply(a, arguments);
        $.extend(a, extras);
        return a;
    };
})();


function opts_from_el(el, prefix){
    // Derive options from element data-attrs
    var data = $(el).data(),
        out = {}, inkey,
        replace = new RegExp('^' + prefix.toLowerCase() + '([A-Z])');
    prefix = new RegExp('^' + prefix.toLowerCase());
    function re_lower(_,a){
        return a.toLowerCase();
    }
    for (var key in data) {
        if (prefix.test(key)){
            inkey = key.replace(replace, re_lower);
            out[inkey] = data[key];
        }
    }
    return out;
}

function opts_from_locale(lang){
    // Derive options from locale plugins
    var out = {};
    // Check if "de-DE" style date is available, if not language should
    // fallback to 2 letter code eg "de"
    if (!dates[lang]){
        lang = lang.split('-')[0];
        if (!dates[lang]) {
            return;
        }
    }
    var d = dates[lang];
    $.each(locale_opts, function(i,k){
        if (k in d) {
            out[k] = d[k];
        }
    });
    return out;
}
