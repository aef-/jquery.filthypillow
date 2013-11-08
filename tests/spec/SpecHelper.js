beforeEach(function() {
  this.addMatchers({
    toBeShowing: function( ) {
      return this.actual.next( ".fp-container" ).is( ":visible" );
    },
    toHaveActiveStep: function( step ) {
      return this.actual.next( ".fp-container" ).find( ".fp-option.fp-" + step ).hasClass( "active" );
    } 
  });
});
