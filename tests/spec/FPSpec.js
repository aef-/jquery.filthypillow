describe("FilthyPillow", function() {
  var now, oct2013,
      keys = {
        LEFT_ARROW: 37,
        RIGHT_ARROW: 39,
        UP_ARROW: 38,
        DOWN_ARROW: 40,
        TAB: 9,
        ENTER: 13,
        ZERO: 48,
        ONE: 49,
        TWO: 50,
        FOUR: 52,
        NUMPAD_ZERO: 96,
        NUMPAD_ONE: 97
      },
      $fp1, $fp2, $fp3, $fp4, $fp5, $fp6, $fp7, $fp8, $fp9, $fp10, $fp11, $fp12, $document;

  function triggerKey( type, keyCode, shiftKey ) {
    var e = $.Event( type );
    e.which = keyCode;
    e.shiftKey = shiftKey;
    $document.trigger( e );
  }

  beforeEach(function() {
    setFixtures(
      '<input class="filthypillow-1"/>' +
      '<input class="filthypillow-2"/>' +
      '<input class="filthypillow-3"/>' +
      '<input class="filthypillow-4"/>' +
      '<input class="filthypillow-5"/>' +
      '<input class="filthypillow-6"/>' +
      '<input class="filthypillow-7"/>' +
      '<input class="filthypillow-8"/>' +
      '<input class="filthypillow-9"/>' +
      '<input class="filthypillow-10"/>' +
      '<input class="filthypillow-12"/>' +
      '<form action="javascript:void(0)" id="fp11-form"><input class="filthypillow-11"/><input type="submit" value="Submit"/></form>'
    );


    oct2013 = moment( { date: 1, month: 9, year: 2013 } );
    now = moment( );
    $document = $( document );

    $fp1 = $( ".filthypillow-1" );
    $fp1.filthypillow( {
      initialDateTime: function( m ) {
        return m.hour( 1 );
      }
    } );

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
    $fp6.filthypillow( {
      minDateTime: function( ) {
        return moment( );
      },
      maxDateTime: function( ) {
        return moment( );
      }
    } );

    $fp7 = $( ".filthypillow-7" );
    $fp7.filthypillow( {
      minDateTime: function( ) {
        return moment( );
      },
      maxDateTime: function( ) {
        return moment( );
      },
			exitOnBackgroundClick: false,
			calendar: {
				isPinned: true
			}
    } );

    $fp8 = $( ".filthypillow-8" );
    $fp8.filthypillow( {
      enableCalendar: false
    } );
    $fp9 = $( ".filthypillow-9" );
    $fp9.filthypillow( {
      steps: [ "month", "day" ]
    } );
    $fp10 = $( ".filthypillow-10" );
    $fp10.filthypillow( {
      calendar: {
        saveOnDateSelect: true
      }
    } );
    $fp11form = $( "#fp11-form" );
    $fp11 = $( ".filthypillow-11" );
    $fp11.filthypillow( {
      minuteStepSize: 2,
      startStep: "minute"
    } );

    $fp12 = $( ".filthypillow-12" );
    $fp12.filthypillow( {
      enable24HourTime: true,
      initialDateTime: function( m ) {
        return m.hour( 1 );
      }
    } );

  } );

  afterEach(function() {
    $fp1.filthypillow( "destroy" );
    $fp2.filthypillow( "destroy" );

    $fp4.filthypillow( "destroy" );
    $fp5.filthypillow( "destroy" );

    $fp7.filthypillow( "destroy" );

    $fp8.filthypillow( "destroy" );
    $fp9.filthypillow( "destroy" );
    $fp10.filthypillow( "destroy" );
    $fp11.filthypillow( "destroy" );
    $fp12.filthypillow( "destroy" );
  } );

  describe( "Behavior", function( ) {
    it("should hide when non-calendar is clicked", function() {
      $fp1.filthypillow( "show" );
      $fp1.click( );
      expect($fp1).toShowDatePicker( );
      $( "body" ).click( );
      expect($fp1).not.toShowDatePicker( );
    });

    it("should activate month on click", function() {
      $fp1.filthypillow( "show" );
      $fp1.next( ".fp-container" ).find( ".fp-month" ).click( );
      expect($fp1).toHaveActiveStep( "month" );
    });

    it("should activate day on click", function() {
      $fp4.filthypillow( "show" );
      $fp4.next( ".fp-container" ).find( ".fp-day" ).click( );
      expect($fp4).toHaveActiveStep( "day" );
    });

    it("should activate hour on click", function() {
      $fp1.filthypillow( "show" );
      $fp1.next( ".fp-container" ).find( ".fp-hour" ).click( );
      expect($fp1).toHaveActiveStep( "hour" );
    });

    it("should activate minute on click", function() {
      $fp1.filthypillow( "show" );
      $fp1.next( ".fp-container" ).find( ".fp-minute" ).click( );
      expect($fp1).toHaveActiveStep( "minute" );
    });

    it("should activate meridiem on click", function() {
      $fp1.filthypillow( "show" );
      $fp1.next( ".fp-container" ).find( ".fp-meridiem" ).click( );
      expect($fp1).toHaveActiveStep( "meridiem" );
    });

    it("should save on click", function() {
      var spyEvent = spyOnEvent($fp1.selector,'fp:save')
      $fp1.filthypillow( "show" );
      $fp1.next( ".fp-container" ).find( ".fp-save-button" ).click( );
      expect( spyEvent ).toHaveBeenTriggered( );
    });

    it("should show calendar when month is active", function() {
      $fp1.filthypillow( "show" );
      $fp1.next( ".fp-container" ).find( ".fp-month" ).click( );
      expect($fp1).toShowCalendar( );
    });

    it("should show calendar when day is active", function() {
      $fp4.filthypillow( "show" );
      $fp4.next( ".fp-container" ).find( ".fp-day" ).click( );
      expect($fp4).toShowCalendar( );
    });

    it("should hide calendar when hour is active", function() {
      $fp1.filthypillow( "show" );
      $fp1.next( ".fp-container" ).find( ".fp-hour" ).click( );
      expect($fp1).not.toShowCalendar( );
    });

    it("should hide calendar when minute is active", function() {
      $fp1.filthypillow( "show" );
      $fp1.next( ".fp-container" ).find( ".fp-minute" ).click( );
      expect($fp1).not.toShowCalendar( );
    });

    it("should hide calendar when meridiem is active", function() {
      $fp1.filthypillow( "show" );
      $fp1.next( ".fp-container" ).find( ".fp-meridiem" ).click( );
      expect($fp1).not.toShowCalendar( );
    });

    it("should move to next month on right arrow calendar click", function() {
      $fp1.filthypillow( "show" );
      $fp1.next( ".fp-container" ).find( ".fp-cal-right" ).click( );
      expect( $fp1.filthypillow( "getDate" ) ).toHaveDate( now.add( "month", 1 ), "month" );
    });

    it("should move to previous month on left arrow calendar click", function() {
      $fp1.filthypillow( "show" );
      $fp1.next( ".fp-container" ).find( ".fp-cal-left" ).click( );
      expect( $fp1.filthypillow( "getDate" ) ).toHaveDate( now.subtract( "month", 1 ), "month" );
    });

    it("should activate date on calendar select", function() {
      $fp1.filthypillow( "show" );
      $fp1.filthypillow( "updateDateTime", oct2013 );
      $fp1.next( ".fp-container" ).find( ".fp-cal-date-2").click( );

      expect( $fp1.next( ".fp-container" ).find( ".fp-cal-date-2") ).toHaveClass( "active" );
      expect( $fp1.filthypillow( "getDate" ) ).toHaveDate( oct2013.add( "day", 1 ), "date" );
    });

    it("should move to previous month when date selected on calendar is of previous month", function() {
      $fp1.filthypillow( "show" );
      $fp1.filthypillow( "updateDateTime", oct2013 );
      $fp1.next( ".fp-container" ).find( ".fp-not-in-month[data-date='"+30+"']" ).click( );
      expect( $fp1.filthypillow( "getDate" ) ).toHaveDate( oct2013.subtract( "month", 1 ), "month" );
    });

    it("should move to next month when date selected on calendar is of next month", function() {
      $fp1.filthypillow( "show" );
      $fp1.filthypillow( "updateDateTime", oct2013 );
      $fp1.next( ".fp-container" ).find( ".fp-not-in-month[data-date='"+1+"']" ).click( );
      expect( $fp1.filthypillow( "getDate" ) ).toHaveDate( oct2013.add( "month", 1 ), "month" );
    });

    it("should show error when date is inputed that is before or after min/maxDateTime configuration", function() {
      $fp6.filthypillow( "show" );
      triggerKey( "keyup", keys.ZERO );
      triggerKey( "keyup", keys.FOUR );
      expect( $fp6.next( ".fp-container" ).find( ".fp-errors" ) ).toBeVisible( );
    });

    it("should hide error when datepicker is reopened", function() {
      $fp6.filthypillow( "show" );
      triggerKey( "keyup", keys.ZERO );
      triggerKey( "keyup", keys.FOUR );
      expect( $fp6.next( ".fp-container" ).find( ".fp-errors" ) ).toBeVisible( );
      $fp6.filthypillow( "hide" );
      $fp6.filthypillow( "show" );
      expect( $fp6.next( ".fp-container" ).find( ".fp-errors" ) ).not.toBeVisible( );
    }); 
  } );

  describe( "Configuration", function( ) {
    it("should start on step declared in initialization", function() {
      $fp4.filthypillow( "show" );
      expect($fp4).toHaveActiveStep( "month" );
		});

		it("should not hide when non-calendar is clicked exitOnCalendarClick is false", function() {
      $fp7.filthypillow( "show" );
      $fp7.click( );
      expect($fp7).toShowDatePicker( );
      $( "body" ).click( );
      expect($fp7).toShowDatePicker( );
    });

    it("should be able to set step size for minutes", function() {
      $fp11.filthypillow( "show" );
      expect($fp11).toHaveActiveStep( "minute" );
      triggerKey( "keydown", keys.UP_ARROW);
      expect($fp11.filthypillow( "getDate" ) ).toHaveDate( now.add( "minute", 2 ), "minute" );
		});

    it("should show error when the selection of a date is previous to minDateTime", function() {
      $fp6.filthypillow( "show" );
      expect( $fp6.next( ".fp-container" ).find( ".fp-errors" ) ).not.toBeVisible( );
      triggerKey( "keydown", keys.DOWN_ARROW );
      expect( $fp6.next( ".fp-container" ).find( ".fp-errors" ) ).toBeVisible( );
    });

		it("should keep calendar any date/time box is active and pinned config is set to true", function() {
      $fp7.filthypillow( "show" );
      $fp7.next( ".fp-container" ).find( ".fp-month" ).click( );
      expect($fp7).toShowCalendar( );
      $fp7.next( ".fp-container" ).find( ".fp-day" ).click( );
      expect($fp7).toShowCalendar( );
      $fp7.next( ".fp-container" ).find( ".fp-hour" ).click( );
      expect($fp7).toShowCalendar( );
      $fp7.next( ".fp-container" ).find( ".fp-minute" ).click( );
      expect($fp7).toShowCalendar( );
      $fp7.next( ".fp-container" ).find( ".fp-meridiem" ).click( );
      expect($fp7).toShowCalendar( );
    });

    it("should show error when the selection of a date is previous to minDateTime", function() {
      $fp6.filthypillow( "show" );
      expect( $fp6.next( ".fp-container" ).find( ".fp-errors" ) ).not.toBeVisible( );
      triggerKey( "keydown", keys.UP_ARROW);
      expect( $fp6.next( ".fp-container" ).find( ".fp-errors" ) ).toBeVisible( );
    });

    it("should hide calendar left and right arrow", function() {
      $fp6.filthypillow( "show" );
      expect( $fp6.next( ".fp-container" ).find( ".fp-cal-left" ) ).not.toBeVisible( );
      expect( $fp6.next( ".fp-container" ).find( ".fp-cal-right" ) ).not.toBeVisible( );
    });
    it("should prevent any calendar days from being clickable", function() {
      $fp6.filthypillow( "show" );
      $fp6.filthypillow( "updateDateTime", oct2013 );
      $fp6.next( ".fp-container" ).find( ".fp-not-in-month[data-date='"+1+"']" ).click( );
      expect( $fp6.filthypillow( "getDate" ) ).toHaveDate( oct2013, "month" );
      expect( $fp6.next( ".fp-container" ).find( ".fp-cal-date" ) ).toHaveClass( "fp-disabled" );
    });
    it("should set date on initialization", function() {
      $fp1.filthypillow( "show" );
      expect($fp1.filthypillow( "getDate" ) ).toHaveDate( now.hour( 1 ), "hour" );
    });
    it("should not show calendar popup when disabled", function() {
      $fp8.filthypillow( "show" );
      expect($fp8).not.toShowCalendar( );
    });

    it("should skip meridiem when 24 hour time is enabled", function() {
      $fp12.filthypillow( "show" );
      $fp12.next( ".fp-container" ).find( ".fp-minute" ).click( );
      triggerKey( "keydown", keys.RIGHT_ARROW );
      expect($fp12).toHaveActiveStep( "month" );
    });

    it("should hide meridiem when 24 hour time is enabled", function() {
      $fp12.filthypillow( "show" );
      var $meridiem = $fp12.next( ".fp-container" ).find( ".fp-meridiem" );
      expect( $meridiem ).not.toBeVisible( );
      expect( $meridiem ).toBeEmpty( );
    });

    it("should disable excluded steps from being activated", function() {
      $fp9.filthypillow( "show" );
      expect($fp9).toHaveActiveStep( "day" );
      triggerKey( "keydown", keys.RIGHT_ARROW );
      expect($fp9).toHaveActiveStep( "month" );
      triggerKey( "keydown", keys.LEFT_ARROW );
      expect($fp9).toHaveActiveStep( "day" );

      $fp9.next( ".fp-container" ).find( ".fp-minute" ).click( );
      expect($fp9).toHaveActiveStep( "day" );
    });
    it("should save on appropriate date select", function() {
      var spyEvent = spyOnEvent($fp10.selector,'fp:save')
      $fp10.filthypillow( "show" );
      $fp10.next( ".fp-container" ).find( ".fp-cal-left" ).click( );
      expect( spyEvent ).not.toHaveBeenTriggered( );
      $fp10.filthypillow( "updateDateTime", oct2013 );
      $fp10.next( ".fp-container" ).find( ".fp-not-in-month[data-date='"+30+"']" ).click( );
      expect( spyEvent ).not.toHaveBeenTriggered( );

      $fp10.next( ".fp-container" ).find( ".fp-cal-date-2").click( );
      expect( spyEvent ).toHaveBeenTriggered( );
    }); 
  } );

  describe( "API", function( ) {
    it("should be destroyable", function() {
      var show = function( ) {
        $fp3.filthypillow( "destroy" );
        $fp3.filthypillow( "show" );
      };
      expect($fp3).not.toShowDatePicker( );
      expect( show ).toThrow( );
    });

	it("should return invalid for dates with errors", function() {
      $fp6.filthypillow( "show" );
      triggerKey( "keyup", keys.ZERO );
      triggerKey( "keyup", keys.FOUR );
      expect( $fp6.filthypillow( "isValid" ) ).not.toBeTruthy( );
    });

	it("should return valid for dates without errors", function() {
      $fp1.filthypillow( "show" );
      expect( $fp6.filthypillow( "isValid" ) ).toBeTruthy( );
    });

    it("should show when show function is called", function() {
      $fp1.filthypillow( "show" );
      expect($fp1).toShowDatePicker( );
    });

    it("should hide when hide function is called", function() {
      $fp1.filthypillow( "hide" );
      expect($fp1).not.toShowDatePicker( );
    });

    it("should get date", function() {
      $fp1.filthypillow( "show" );
      var date = $fp1.filthypillow( "getDate" );
      expect(date).toBeTruthy( );
    });

    it("should set date when updateDateTime is called", function() {
      $fp1.filthypillow( "show" );
      $fp1.filthypillow( "updateDateTime", now.add( "year", 1 ) );
      expect( $fp1.filthypillow( "getDate" ) ).toHaveDate( now, "year" );
    });

    it("should change specific date unit", function() {
      $fp1.filthypillow( "updateDateTime", now.add( "year", 1 ) );
      expect( $fp1.filthypillow( "getDate" ) ).toHaveDate( now, "year" );
    } );

    it("should set dates timezone", function() {
      $fp1.filthypillow( "show" );
      $fp1.filthypillow( "setTimeZone", 160 );
      expect( $fp1.filthypillow( "getDate" ).zone( ) ).toEqual( 160 );
      var date = $fp1.filthypillow( "getDate" ).subtract( "hour", 1 );
      $fp1.filthypillow( "setTimeZone", 220 );
      expect( $fp1.filthypillow( "getDate" ) ).toHaveDate( date, "hour" );
    } );
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

    it("should save <ENTER>", function() {
      var spyEvent = spyOnEvent($fp1.selector,'fp:save')
      $fp1.filthypillow( "show" );
      triggerKey( "keydown", keys.ENTER );
      expect( spyEvent ).toHaveBeenTriggered( );
    } );

    it("should not save on <ENTER> when date is out of range", function() {
      var spyEvent = spyOnEvent($fp7.selector,'fp:save')
      $fp7.filthypillow( "show" );
      $fp7.filthypillow( "updateDateTime", moment( ).subtract( "months", 1 ) );
      triggerKey( "keydown", keys.ENTER );
      expect( spyEvent ).not.toHaveBeenTriggered( );
    } );

    it("should trigger fp:datetimechange on calendar select", function () {
      $fp1.filthypillow( "updateDateTime", oct2013 );
      var spyEvent = spyOnEvent($fp1.selector,'fp:datetimechange');
      $fp1.filthypillow( "show" );
      $fp1.next( ".fp-container" ).find( ".fp-cal-date-2").click( );
      expect(spyEvent).toHaveBeenTriggered( );
    } );

    it("should trigger fp:datetimechange on date change", function () {
      var spyEvent = spyOnEvent($fp1.selector,'fp:datetimechange');
      $fp1.filthypillow( "show" );
      triggerKey( "keydown", keys.UP_ARROW );
      expect(spyEvent).toHaveBeenTriggered( );
    } );

    it("should trigger fp:datetimechange on time change", function () {
      var spyEvent = spyOnEvent($fp1.selector,'fp:datetimechange');
      $fp1.filthypillow( "show" );
      triggerKey( "keydown", keys.RIGHT_ARROW );
      triggerKey( "keydown", keys.UP_ARROW );
      expect(spyEvent).toHaveBeenTriggered( );
    } );

    it("should increment month by 1 <UP ARROW>", function() {
      $fp4.filthypillow( "show" );
      triggerKey( "keydown", keys.UP_ARROW );
      expect( $fp4.filthypillow( "getDate" ) ).toHaveDate( now.add( "month", 1 ), "month" );
    } );

    it("should increment day by 1 <UP ARROW>", function() {
      $fp1.filthypillow( "show" );
      triggerKey( "keydown", keys.UP_ARROW );
      expect( $fp1.filthypillow( "getDate" ) ).toHaveDate( now.add( "day", 1 ), "date" );
    } );

    it("should increment hour by 1 <UP ARROW>", function() {
      $fp1.filthypillow( "show" );
      triggerKey( "keydown", keys.RIGHT_ARROW );
      triggerKey( "keydown", keys.UP_ARROW );
      expect( $fp1.filthypillow( "getDate" ) ).toHaveDate( now.hour( 2 ), "hour" );
    } );

    it("should set month to January and move to next step <0><1>", function() {
      $fp1.filthypillow( "show" );
      triggerKey( "keydown", keys.LEFT_ARROW );
      triggerKey( "keyup", keys.ZERO );
      triggerKey( "keyup", keys.ONE );
      expect( $fp1 ).toHaveActiveStep( "day" );
      expect( $fp1.filthypillow( "getDate" ) ).toHaveDate( now.month( 0 ), "month" );
    } );

    it("should set month to January and move to next step <numpad><0><1>", function() {
      $fp1.filthypillow( "show" );
      triggerKey( "keydown", keys.LEFT_ARROW );
      triggerKey( "keyup", keys.NUMPAD_ZERO );
      triggerKey( "keyup", keys.NUMPAD_ONE );
      expect( $fp1 ).toHaveActiveStep( "day" );
      expect( $fp1.filthypillow( "getDate" ) ).toHaveDate( now.month( 0 ), "month" );
    } );
 

    it("should set month to January and not move to next step <1>", function() {
      $fp1.filthypillow( "show" );
      triggerKey( "keydown", keys.LEFT_ARROW );
      triggerKey( "keyup", keys.ONE );
      expect( $fp1 ).toHaveActiveStep( "month" );
      expect( $fp1.filthypillow( "getDate" ) ).toHaveDate( now.month( 0 ), "month" );
    } );

    it("should set date to 4 and move to next step <4>", function() {
      $fp1.filthypillow( "show" );
      triggerKey( "keyup", keys.FOUR );
      expect( $fp1 ).toHaveActiveStep( "hour" );
      expect( $fp1.filthypillow( "getDate" ) ).toHaveDate( now.date( 4 ), "date" );
    } );

    it("should set date to 1 and not move to next step <1>", function() {
      $fp1.filthypillow( "show" );
      triggerKey( "keyup", keys.ONE );
      expect( $fp1 ).toHaveActiveStep( "day" );
      expect( $fp1.filthypillow( "getDate" ) ).toHaveDate( now.date( 1 ), "date" );
    } );

    it("should set date to 14 and move to next step <1><4>", function() {
      $fp1.filthypillow( "show" );
      triggerKey( "keyup", keys.ONE );
      triggerKey( "keyup", keys.FOUR );
      expect( $fp1 ).toHaveActiveStep( "hour" );
      expect( $fp1.filthypillow( "getDate" ) ).toHaveDate( now.date( 14 ), "date" );
    } );

    it("should set hour to 4 and move to next step <4>", function() {
      $fp1.filthypillow( "show" );
      triggerKey( "keydown", keys.RIGHT_ARROW );
      triggerKey( "keyup", keys.FOUR );
      expect( $fp1 ).toHaveActiveStep( "minute" );
      expect( $fp1.filthypillow( "getDate" ) ).toHaveDate( now.hour( 4 ), "hour" );
    } );

    it("should increment hour by 1 <UP ARROW> when calendar is enabled", function() {
      $fp12.filthypillow( "show" );
      triggerKey( "keydown", keys.RIGHT_ARROW );
      triggerKey( "keydown", keys.UP_ARROW );
      expect( $fp12.filthypillow( "getDate" ) ).toHaveDate( now.hour( 2 ), "hour" );
    } );

    it("should increment hour by 1 <UP ARROW> when 24 hour time is enabled", function() {
      $fp12.filthypillow( "show" );
      triggerKey( "keydown", keys.RIGHT_ARROW );
      triggerKey( "keydown", keys.UP_ARROW );
      expect( $fp12 ).toHaveShown( "02", "hour" );
    } );

    it("should decrease hour by 1 <UP ARROW> when 24 hour time is enabled", function() {
      $fp12.filthypillow( "show" );
      triggerKey( "keydown", keys.RIGHT_ARROW );
      triggerKey( "keydown", keys.DOWN_ARROW );
      expect( $fp12 ).toHaveShown( "00", "hour" );
    } );

    it("should go to 23 <DOWN ARROW> when 24 hour time is enabled", function() {
      $fp12.filthypillow( "show" );
      triggerKey( "keydown", keys.RIGHT_ARROW );
      triggerKey( "keydown", keys.DOWN_ARROW );
      triggerKey( "keydown", keys.DOWN_ARROW );
      expect( $fp12 ).toHaveShown( "23", "hour" );
    } );

    it("should set hour to 20 and move to next step <2><0> when 24 hour time is enabled", function() {
      $fp12.filthypillow( "show" );
      triggerKey( "keydown", keys.RIGHT_ARROW );
      triggerKey( "keyup", keys.TWO );
      triggerKey( "keyup", keys.ZERO );
      expect( $fp12 ).toHaveActiveStep( "minute" );
      expect( $fp12 ).toHaveShown( 20, "hour" );
    } );

    it("should set hour to 2X and not move to next step when 24 hour time is enabled", function() {
      $fp12.filthypillow( "show" );
      triggerKey( "keydown", keys.RIGHT_ARROW );
      triggerKey( "keyup", keys.TWO );
      expect( $fp12 ).toHaveActiveStep( "hour" );
      expect( $fp12 ).toHaveShown( 2, "hour" );
    } );


    it("should set hour to 10 and move to next step <1><0>", function() {
      $fp1.filthypillow( "show" );
      triggerKey( "keydown", keys.RIGHT_ARROW );
      triggerKey( "keyup", keys.ONE );
      triggerKey( "keyup", keys.ZERO );
      expect( $fp1 ).toHaveActiveStep( "minute" );
      expect( $fp1.filthypillow( "getDate" ) ).toHaveDate( now.hour( 10 ), "hour" );
    } );

    it("should toggle meridiem", function() {
      $fp1.filthypillow( "show" );
      var currentMeridiem = $fp1.filthypillow( "getDate" ).format( "a" )
      triggerKey( "keydown", keys.RIGHT_ARROW );
      triggerKey( "keydown", keys.RIGHT_ARROW );
      triggerKey( "keydown", keys.RIGHT_ARROW );
      triggerKey( "keydown", keys.UP_ARROW );
      expect( $fp1.filthypillow( "getDate" ).format( "a" ) ).not.toEqual( currentMeridiem );
      triggerKey( "keydown", keys.UP_ARROW );
      expect( $fp1.filthypillow( "getDate" ).format( "a" ) ).toEqual( currentMeridiem );
    } );
  });
} );

