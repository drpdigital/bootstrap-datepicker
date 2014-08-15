/* global Datepicker, UTCDate, dates */

var DPGlobal = {
    modes: [
        {
            clsName: 'days',
            navFnc: 'Month',
            navStep: 1
        },
        {
            clsName: 'months',
            navFnc: 'FullYear',
            navStep: 1
        },
        {
            clsName: 'years',
            navFnc: 'FullYear',
            navStep: 10
    }],
    isLeapYear: function(year){
        return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0));
    },
    getDaysInMonth: function(year, month){
        return [31, (DPGlobal.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
    },
    validParts: /dd?|DD?|mm?|MM?|yy(?:yy)?/g,
    nonpunctuation: /[^ -\/:-@\[\u3400-\u9fff-`{-~\t\n\r]+/g,
    parseFormat: function(format){
        // IE treats \0 as a string end in inputs (truncating the value),
        // so it's a bad format delimiter, anyway
        var separators = format.replace(this.validParts, '\0').split('\0'),
            parts = format.match(this.validParts);
        if (!separators || !separators.length || !parts || parts.length === 0){
            throw new Error("Invalid date format.");
        }
        return {separators: separators, parts: parts};
    },
    parseDate: function(date, format, language){
        if (!date) {
            return undefined;
        }

        if (date instanceof Date) {
            return date;
        }

        if (typeof format === 'string') {
            format = DPGlobal.parseFormat(format);
        }

        var part_re = /([\-+]\d+)([dmwy])/,
            parts = date.match(/([\-+]\d+)([dmwy])/g),
            part, dir, i;
        if (/^[\-+]\d+[dmwy]([\s,]+[\-+]\d+[dmwy])*$/.test(date)){
            date = new Date();
            for (i=0; i < parts.length; i++){
                part = part_re.exec(parts[i]);
                dir = parseInt(part[1]);
                switch (part[2]){
                    case 'd':
                        date.setUTCDate(date.getUTCDate() + dir);
                        break;
                    case 'm':
                        date = Datepicker.prototype.moveMonth.call(Datepicker.prototype, date, dir);
                        break;
                    case 'w':
                        date.setUTCDate(date.getUTCDate() + dir * 7);
                        break;
                    case 'y':
                        date = Datepicker.prototype.moveYear.call(Datepicker.prototype, date, dir);
                        break;
                }
            }
            return UTCDate(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0);
        }
        parts = date && date.match(this.nonpunctuation) || [];
        date = new Date();
        var parsed = {},
            setters_order = ['yyyy', 'yy', 'M', 'MM', 'm', 'mm', 'd', 'dd'],
            setters_map = {
                yyyy: function(d,v){
                    return d.setUTCFullYear(v);
                },
                yy: function(d,v){
                    return d.setUTCFullYear(2000+v);
                },
                m: function(d,v){
                    if (isNaN(d)) {
                        return d;
                    }
                    v -= 1;
                    while (v < 0) {
                        v += 12;
                    }
                    v %= 12;
                    d.setUTCMonth(v);
                    while (d.getUTCMonth() !== v) {
                        d.setUTCDate(d.getUTCDate()-1);
                    }
                    return d;
                },
                d: function(d,v){
                    return d.setUTCDate(v);
                }
            },
            val, filtered;
        setters_map['M'] = setters_map['MM'] = setters_map['mm'] = setters_map['m'];
        setters_map['dd'] = setters_map['d'];
        date = UTCDate(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
        var fparts = format.parts.slice();
        // Remove noop parts
        if (parts.length !== fparts.length){
            fparts = $(fparts).filter(function(i,p){
                return $.inArray(p, setters_order) !== -1;
            }).toArray();
        }
        // Process remainder
        function match_part(){
            var m = this.slice(0, parts[i].length),
                p = parts[i].slice(0, m.length);
            return m === p;
        }
        if (parts.length === fparts.length){
            var cnt;
            for (i=0, cnt = fparts.length; i < cnt; i++){
                val = parseInt(parts[i], 10);
                part = fparts[i];
                if (isNaN(val)){
                    switch (part){
                        case 'MM':
                            filtered = $(dates[language].months).filter(match_part);
                            val = $.inArray(filtered[0], dates[language].months) + 1;
                            break;
                        case 'M':
                            filtered = $(dates[language].monthsShort).filter(match_part);
                            val = $.inArray(filtered[0], dates[language].monthsShort) + 1;
                            break;
                    }
                }
                parsed[part] = val;
            }
            var _date, s;
            for (i=0; i < setters_order.length; i++){
                s = setters_order[i];
                if (s in parsed && !isNaN(parsed[s])){
                    _date = new Date(date);
                    setters_map[s](_date, parsed[s]);
                    if (!isNaN(_date)) {
                        date = _date;
                    }
                }
            }
        }
        return date;
    },
    formatDate: function(date, format, language){
        if (!date) {
            return '';
        }
        if (typeof format === 'string') {
            format = DPGlobal.parseFormat(format);
        }
        var val = {
            d: date.getUTCDate(),
            D: dates[language].daysShort[date.getUTCDay()],
            DD: dates[language].days[date.getUTCDay()],
            m: date.getUTCMonth() + 1,
            M: dates[language].monthsShort[date.getUTCMonth()],
            MM: dates[language].months[date.getUTCMonth()],
            yy: date.getUTCFullYear().toString().substring(2),
            yyyy: date.getUTCFullYear()
        };
        val.dd = (val.d < 10 ? '0' : '') + val.d;
        val.mm = (val.m < 10 ? '0' : '') + val.m;
        date = [];
        var seps = $.extend([], format.separators);
        for (var i=0, cnt = format.parts.length; i <= cnt; i++){
            if (seps.length) {
                date.push(seps.shift());
            }
            date.push(val[format.parts[i]]);
        }
        return date.join('');
    },
    headTemplate: '<thead>'+
                        '<tr>'+
                            '<th class="prev">&laquo;</th>'+
                            '<th colspan="5" class="datepicker-switch"></th>'+
                            '<th class="next">&raquo;</th>'+
                        '</tr>'+
                    '</thead>',
    contTemplate: '<tbody><tr><td colspan="7"></td></tr></tbody>',
    footTemplate: '<tfoot>'+
                        '<tr>'+
                            '<th colspan="7" class="today"></th>'+
                        '</tr>'+
                        '<tr>'+
                            '<th colspan="7" class="clear"></th>'+
                        '</tr>'+
                    '</tfoot>'
};
DPGlobal.template = '<div class="datepicker">'+
                        '<div class="datepicker-days">'+
                            '<table class=" table-condensed">'+
                                DPGlobal.headTemplate+
                                '<tbody></tbody>'+
                                DPGlobal.footTemplate+
                            '</table>'+
                        '</div>'+
                        '<div class="datepicker-months">'+
                            '<table class="table-condensed">'+
                                DPGlobal.headTemplate+
                                DPGlobal.contTemplate+
                                DPGlobal.footTemplate+
                            '</table>'+
                        '</div>'+
                        '<div class="datepicker-years">'+
                            '<table class="table-condensed">'+
                                DPGlobal.headTemplate+
                                DPGlobal.contTemplate+
                                DPGlobal.footTemplate+
                            '</table>'+
                        '</div>'+
                    '</div>';

$.fn.datepicker.DPGlobal = DPGlobal;
