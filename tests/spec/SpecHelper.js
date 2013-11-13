beforeEach(function() {
  this.addMatchers({
    toShowCalendar: function( ) {
      return this.actual.next( ".fp-container" ).find( ".fp-cal-container" ).is( ":visible" );
    }, 
    toShowDatePicker: function( ) {
      return this.actual.next( ".fp-container" ).is( ":visible" );
    },
    toHaveActiveStep: function( step ) {
      return this.actual.next( ".fp-container" ).find( ".fp-option.fp-" + step ).hasClass( "active" );
    },
    toHaveDate: function( date, step ) {
      return this.actual[ step ]( ) === date[ step ]( );
    }
  });
});
