/* DATEPICKER DATA-API
* ================== */

$(document).on(
    'focus.datepicker.data-api click.datepicker.data-api',
    '[data-provide="datepicker"]',
    function(e){
        var $this = $(this);
        if ($this.data('datepicker'))
            return;
        e.preventDefault();
        // component click requires us to explicitly show it
        $this.datepicker('show');
    }
);


$(function(){
    $('[data-provide="datepicker-inline"]').datepicker();
});
