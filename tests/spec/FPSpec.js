describe("FilthyPillow", function() {
  var now = new Date( ),
      keys = {
        LEFT_ARROW: 37,
        RIGHT_ARROW: 39,
        UP_ARROW: 38,
        DOWN_ARROW: 40,
        TAB: 9
      };
      $fp1, $fp2, $fp3, $fp4, $fp5, $fp6, $fp7, $fp8, $fp9, $document;

  function triggerKey( type, keyCode, shiftKey ) {
    var e = $.Event( type );
    e.which = keyCode;
    e.shiftKey = shiftKey;
    $document.trigger( e ); 
  }
  beforeEach(function() {
    $document = $( document );

    $fp1 = $( ".filthypillow-1" );
    $fp1.filthypillow( );

    $fp2 = $( ".filthypillow-2" );
    $fp2.filthypillow( );

    $fp3 = $( ".filthypillow-3" ); //never gets destroyed
    $fp3.filthypillow( );

    $fp4 = $( ".filthypillow-4" );
    $fp4.filthypillow( { 
      startStep: "month"
    } );

    $fp5 = $( ".filthypillow-5" );
    $fp5.filthypillow( { 
      startStep: "meridiem"
    } );
 
    $fp6 = $( ".filthypillow-6" );
    $fp7 = $( ".filthypillow-7" );
    $fp8 = $( ".filthypillow-8" );
    $fp9 = $( ".filthypillow-9" );
  });
  afterEach(function() {
    $fp1.filthypillow( "destroy" );
    $fp2.filthypillow( "destroy" );

    $fp4.filthypillow( "destroy" );
    $fp5.filthypillow( "destroy" );
  });

  describe( "Behavior", function( ) {
    it("should hide when non-calendar is clicked", function() {
      $fp1.filthypillow( "show" );
      $fp1.click( );
      expect($fp1).toBeShowing( );
      $( "body" ).click( );
      expect($fp1).not.toBeShowing( );
    });
  } );
 
  describe( "Configuration", function( ) {
    it("should start on step declared in initialization", function() {
      $fp4.filthypillow( "show" );
      expect($fp4).toHaveActiveStep( "month" );
    });
  } );

  describe( "API", function( ) {
    it("should be destroyable", function() {
      var show = function( ) {
        $fp3.filthypillow( "destroy" );
        $fp3.filthypillow( "show" );
      };
      expect($fp3).not.toBeShowing( );
      expect( show ).toThrow( );
    });

    it("should show when show function is called", function() {
      $fp1.filthypillow( "show" );
      expect($fp1).toBeShowing( );
    });

    it("should hide when hide function is called", function() {
      $fp1.filthypillow( "hide" );
      expect($fp1).not.toBeShowing( );
    });

    it("should set date when updateDateTime is called", function() {
      $fp1.filthypillow( "updateDateTime", now );
      expect($fp1).not.toBeShowing( );
    }); 
  } );

  describe( "Hotkeys", function( ) {
    it("should go to previous step on <LEFT ARROW>", function() {
      $fp1.filthypillow( "show" );
      triggerKey( "keydown", keys.LEFT_ARROW );
      expect($fp1).toHaveActiveStep( "month" );
    } );
    it("should go to previous step on <SHIFT> + <TAB>", function() {
      $fp1.filthypillow( "show" );
      triggerKey( "keydown", keys.TAB, true );
      expect($fp1).toHaveActiveStep( "month" );
    } );

    it("should go to last step on wrap around <LEFT ARROW>", function() {
      $fp4.filthypillow( "show" );
      triggerKey( "keydown", keys.LEFT_ARROW );
      expect($fp4).toHaveActiveStep( "meridiem" );
    } ); 

    it("should go to next step on <RIGHT ARROW>", function() {
      $fp1.filthypillow( "show" );
      triggerKey( "keydown", keys.RIGHT_ARROW );
      expect($fp1).toHaveActiveStep( "hour" );
    } ); 

    it("should go to next step on <TAB>", function() {
      $fp1.filthypillow( "show" );
      triggerKey( "keydown", keys.TAB );
      expect($fp1).toHaveActiveStep( "hour" );
    } ); 
 
    it("should go to first step on wrap around <RIGHT ARROW>", function() {
      $fp5.filthypillow( "show" );
      triggerKey( "keydown", keys.RIGHT_ARROW );
      expect($fp5).toHaveActiveStep( "month" );
    } );  

    //TODO must hceck if fp:save is triggered
    it("should save <ENTER>>", function() {
    } );   

    it("should increment month by 1 <UP ARROW>", function() {
    } );   

    it("should increment day by 1 <UP ARROW>", function() {
    } );

    it("should increment hour by 1 <UP ARROW>", function() {
    } ); 
 
    it("should increment minute by 15 <UP ARROW>", function() {
    } ); 

    it("should toggle meridiem", function() {
    } ); 
  });

} );
 
