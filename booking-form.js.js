$( document ).ready(function() {
    $( function() {
      var dateToday = new Date();
      var dates = $("#start-date, #end-date").datepicker({
        defaultDate: "+2d",
        changeMonth: true,
        numberOfMonths: 1,
        minDate: dateToday,
        onSelect: function(selectedDate) {
            var option = this.id == "start-date" ? "minDate" : "maxDate",
            instance = $(this).data("datepicker"),
            date = $.datepicker.parseDate(instance.settings.dateFormat || $.datepicker._defaults.dateFormat, selectedDate, instance.settings);
            dates.not(this).datepicker("option", option, date);
        }
      });
    });
  });

  