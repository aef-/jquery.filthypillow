/* jquery.mudgut v.0.0.0 (prerelease)
 * simple and fancy datetimepicker
 * by aef
 */
( function( $, window, document, undefined ) {
  var pluginName = "filthypillow",
      defaults = { 
        startStep: "day",
        minDateTime: function( ) {
          return moment( );
        },
        maxDateTime: function( ) {
          return moment( ).add( "days", 7 );
        },
      },
      methods = [ "show", "hide", "destroy", "updateDateTime", "changeDateTimeUnit", "setTimeZone" ];

  function FilthyPillow( $element, options ) {
    this.options = $.extend( defaults, options );

    this.$element = $element;
    this.setup( );
  }

  FilthyPillow.prototype = {
    template: '<div class="fp-container">' +
                '<div class="fp-calendar">' +
                  '<span class="fp-month fp-option"></span>/<span class="fp-day fp-option"></span>' +
                '</div>' +
                '<div class="fp-clock">' +
                  '<span class="fp-hour fp-option"></span>:<span class="fp-minute fp-option"></span>' +
                  '<span class="fp-meridiem fp-option"></span>' +
                '</div>' +
                '<div class="fp-save"><button class="btn btn-primary fp-save-button">Save</button></div>' +
                '<div class="fp-description"></div>' +
                '<div class="fp-errors"></div>' +
                '<div class="fp-calendar-calendar"></div>' +
              '</div>',
    currentStep: null, 
    dateTime: null,
    currentTimeZone: null, //null is browser default
    currentDigit: 0, //first or second digit for key press
    isActiveLeadingZero: 0, //user types in 0 as first digit
    steps: [ "month", "day", "hour", "minute", "meridiem" ], 
    stepRegExp: null,
    isError: false, //error is being shown
    isActive: false, //whether the calendar is active or not

    setup: function( ) {
      this.stepRegExp = new RegExp( this.steps.join( "|" ) )
      this.$window = $( window );
      this.$document = $( document );
      this.$body = $( "body" );
      this.id = "filthypillow-" + Math.round( Math.random( ) * 1000 );
 
      this.$container = $( this.template );
      this.$container.attr( "id", this.id );

      this.$calendar = this.$container.find( ".fp-calendar" );
      this.$options = this.$container.find( ".fp-option" );

      this.$month = this.$calendar.find( ".fp-month" );
      this.$day = this.$calendar.find( ".fp-day" );

      this.$clock = this.$container.find( ".fp-clock" );
      this.$hour = this.$clock.find( ".fp-hour" );
      this.$minute = this.$clock.find( ".fp-minute" );
      this.$meridiem = this.$clock.find( ".fp-meridiem" );

      this.$errorBox = this.$container.find( ".fp-errors" );
      this.$saveButton = this.$container.find( ".fp-save-button" );
      this.$descriptionBox = this.$container.find( ".fp-description" );


      this.calendar = new Calendar( this.$container.find( ".fp-calendar-calendar" ), 
      {
        minDateTime: this.options.minDateTime,
        maxDateTime: this.options.maxDateTime,
        onSelectDate: $.proxy( function( year, month, date ) {
          this.updateDateTimeUnit( "month", month, false );
          this.updateDateTimeUnit( "date", date, false );
          this.updateDateTimeUnit( "year", year, false );
        }, this )
      } );

    },
    showError: function( step, errorMessage ) {
      this[ "$" + step ].addClass( "fp-error fp-out-of-range" );
      this.$errorBox.text( errorMessage ).show( );
      this.$saveButton.attr( "disabled", "disabled" );
      this.isError = true;
    },
    hideError: function( step, errorMessage ) {
      this.$container.find( ".fp-error" ).removeClass( "fp-error" );
      this.$errorBox.hide( );
      this.$saveButton.removeAttr( "disabled", "disabled" );
      this.isError = false;
    },
    activateSelectorTool: function( step ) {
      var $element = this[ "$" + step ];
      this.currentStep = step;

      //Highlight element
      this.$container.find( ".active" ).removeClass( "active" );
      $element.addClass( "active" );

      //Reset digit
      this.currentDigit = 0;
      this.isActiveLeadingZero = 0;
      if( step === "day" || step === "month" )
        this.calendar.show( );
      else
        this.calendar.hide( );
    },

    to12Hour: function( value ) {
      if( this.dateTime.format( "A" ) === "PM" && value > 12 )
        return value - 12;
      return value;  
    },

    to24Hour: function( value ) {
      if( this.dateTime.format( "A" ) === "PM" && value < 12 )
        return value + 12;
      else if( this.dateTime.format( "A" ) === "AM" && value > 11 )
        return value - 12;
      return value; 
    },

    formatToMoment: function( step, value ) {
      if( step === "month" )
        return value - 1;
      return value;
    },

    formatFromMoment: function( step, value ) {
      if( step === "month" )
        return value + 1;
      return value;
    },
 
    isValidDigitInput: function( digits ) {
      digits = parseInt( digits, 10 );
      if( this.currentStep === "month" ) {
        if( digits > 12 )
          return false;
      }
      else if( this.currentStep === "day" ) {
        if( digits > this.dateTime.daysInMonth( ) )
          return false;
      }

      return true;
    },

    updateDigit: function( step, digit, value ) {
      var fakeValue, precedingDigit, moveNext = false;

      if( step === "meridiem" )
        return;

      if( step === "day" )
        step = "date"; //see moment getter/setter docs

      if( digit === 1 && value === 0 ) {
        this.isActiveLeadingZero = 1;
        return;
      }

      /*
      console.info( "Value: " + value );
      console.info( "Moment Value: " + value );
      console.info( "Digit: " + digit );
      */
      if( digit === 2 && !this.isActiveLeadingZero ) {
        precedingDigit = this.dateTime.get( step );
        //console.info( "precedingDigitReal: " + precedingDigit );
        if( step === "hour" )
          precedingDigit = this.to12Hour( precedingDigit )
        else
          precedingDigit = this.formatFromMoment( step, precedingDigit );
        //console.info( "precedingDigit: " + precedingDigit );
        fakeValue = parseInt( precedingDigit + "" + value, 10 );
      }
      else
        this.isActiveLeadingZero = 0;

      fakeValue = fakeValue || value;

      if( step === "hour" ) //this is retain the current meridiem
        fakeValue = this.to24Hour( fakeValue );
      else
        fakeValue = this.formatToMoment( step, fakeValue );

      //console.info( "Fake Value: " + fakeValue );

      if( !this.isValidDigitInput( fakeValue ) ) {
        if( this.currentDigit === 2 )
          this.currentDigit = 1;
        return;
      }

      if( this.currentDigit === 2 )
        moveNext = true;
      else if( step === "month" && value > 1 )
        moveNext = true;
      else if( step === "date" && value > 3 )
        moveNext = true;
      else if( step === "hour" && value > 1 )
        moveNext = true;
      else if( step === "minute" && value > 5 )
        moveNext = true;

      this.updateDateTimeUnit( step, fakeValue, moveNext );
    },

    onOptionClick: function( e ) {
      var $target = $( e.target ),
          classes = $target.attr( "class" ),
      //figure out which step was clicked
          step = classes.match( this.stepRegExp );
      if( step.length )
        this.activateSelectorTool( step[ 0 ] );
    },

    onKeyUp: function( e ) {
      if( this.currentStep === "meridiem" )
        return;

      if( e.keyCode === 8 ) //backspace
        this.currentDigit -= 1;

      if( e.keyCode >= 48 && e.keyCode <= 57 ) {//between 0-9
        this.currentDigit += 1;
        this.updateDigit( this.currentStep, this.currentDigit, e.keyCode - 48 );
      }

      if( this.currentDigit === 2 )
        this.currentDigit = 0;
    },

    onKeyDown: function( e ) {
      switch( e.keyCode ) {
        case 38: this.moveUp( ); break; //up
        case 40: this.moveDown( ); break; //down
        case 37: this.moveLeft( ); break; //left
        case 39: this.moveRight( ); break; //right
      }
      if( e.shiftKey && e.keyCode === 9 ) //shift + tab
        this.moveLeft( );
      else if( e.keyCode === 9 ) //tab
        this.moveRight( );

      if( e.keyCode === 13 ) { //enter - lets them save on enter
        this.$saveButton.focus( );
        return true;
      }

      //prevents page from moving left/right/up/down
      return false;
    },

    moveDown: function( ) {
      if( this.currentStep === "meridiem" ) {
        //We do this so the day does not change
        var offset = this.dateTime.format( "H" ) < 12 ? 12 : -12;
        this.changeDateTimeUnit( "hour", offset );
      } 
      else if( this.currentStep === "minute" )
        this.changeDateTimeUnit( this.currentStep, -15 );
      else if( this.currentStep )
        this.changeDateTimeUnit( this.currentStep, -1 );

      this.currentDigit = 0;
    },

    moveUp: function( ) {
      if( this.currentStep === "meridiem" ) {
        //TODO use function
        var offset = parseInt( this.dateTime.format( "H" ), 10 ) < 12 ? 12 : -12;
        this.changeDateTimeUnit( "hour", offset );
      }
      else if( this.currentStep === "minute" )
        this.changeDateTimeUnit( this.currentStep, 15 );
      else if( this.currentStep )
        this.changeDateTimeUnit( this.currentStep, 1 );

      this.currentDigit = 0;
    },

    moveLeft: function( ) {
      if( !this.currentStep ) return;
      var i = this.steps.indexOf( this.currentStep );
      if( i === 0 ) i = this.steps.length - 1;
      else i -= 1;
      this.activateSelectorTool( this.steps[ i ] );
    },

    moveRight: function( ) {
      if( !this.currentStep ) return;
      var i = this.steps.indexOf( this.currentStep );
      if( i === this.steps.length - 1 ) i = 0;
      else i += 1;
      this.activateSelectorTool( this.steps[ i ] );
    },

    onClickToExit: function( e ) {
      var $target = $( e.target );
      if( 
          //TODO: testing for class is shit but closest doesn't work on td day select
          //for some reason
          !/fp-/.test( $target.attr( "class" ) ) &&
          !$target.closest( this.$container ).length && 
          !$target.closest( this.$element ).length ) {
        this.hide( );
      }
    },

    onSave: function( ) {
      this.$element.trigger( "fp:save", [ this.dateTime ] );
    },

    addEvents: function( ) {
      this.$options.on( "click", $.proxy( this.onOptionClick, this ) );
      this.$saveButton.on( "click", $.proxy( this.onSave, this ) );

      this.$document.on( "keydown." + this.id, $.proxy( this.onKeyDown, this ) );
      this.$document.on( "keyup." + this.id, $.proxy( this.onKeyUp, this ) );
      this.$window.on( "click." + this.id, $.proxy( this.onClickToExit, this ) );
    },

    removeEvents: function( ) {

      this.$options.off( "click" );
      this.$saveButton.off( "click" );
      this.$window.off( "click." + this.id );

      this.$document.off( "keydown." + this.id );
      this.$document.off( "keyup." + this.id );
    },
    setDateTime: function( dateObj ) {
      this.dateTime = moment( dateObj );
      this.calendar.setDate( this.dateTime );
    },
    renderDateTime: function( ) {
      this.$month.text( this.dateTime.format( "MM" ) );
      this.$day.text( this.dateTime.format( "DD" ) );
      this.$hour.text( this.dateTime.format( "hh" ) );
      this.$minute.text( this.dateTime.format( "mm" ) );
      this.$meridiem.text( this.dateTime.format( "A" ) );

      this.$descriptionBox.text( this.dateTime.format( "LLLL" ) );
    },
    setInitialDateTime: function( ) {
      var m = moment( ),
          minutes = m.format( "m" );
      m.zone( this.currentTimeZone );

      //Initial value are done in increments of 15 from now. 
      //If the time between now and 15 minutes from now is less than 5 minutes, 
      //go onto the next 15.
      if( minutes <= 10  )
        m.set( "minute", 15 );
      else if( minutes <= 25 )
        m.set( "minute", 30 );
      else if( minutes <= 40 )
        m.set( "minute", 45 );
      else if( minutes <= 55 ) {
        m.set( "minute", 0 );
        m.add( 1, "hours" );
      }
      else if( minutes > 55 ) {
        m.set( "minute", 15 );
        m.add( 1, "hours" );
      }

      this.updateDateTime( m );
    },

    isInRange: function( date ) {
      var minDateTime = this.options.minDateTime( ),
          maxDateTime = this.options.maxDateTime( );
      minDateTime.zone( this.currentTimeZone );
      maxDateTime.zone( this.currentTimeZone );
      return !( date.diff( minDateTime, "seconds" ) < 0 
             || date.diff( maxDateTime, "seconds" ) > 0 )
    },

    setTimeZone: function( zone ) {
      //this.dateTime.zone( zone );
      this.currentTimeZone = zone;
    },

    dateChange: function( ) {
      this.calendar.setDate( this.dateTime );
      if( this.currentStep === "day" || this.currentStep === "month" )
        this.calendar.render( );
    },

    //api
    updateDateTimeUnit: function( unit, value, moveNext ) {
      this.dateTime.set( unit, value );
      this.renderDateTime( );

      if( !this.isInRange( this.dateTime ) )
        this.showError( this.currentStep, "Date is out of range, please fix." );
      else if( this.isError )
        this.hideError( );

      if( !this.isError && moveNext )
        this.moveRight( );

      this.dateChange( );
    },
    changeDateTimeUnit: function( unit, value ) {
      var tmpDateTime = this.dateTime.clone( ).add( value, unit + "s" ),
          isInRange = this.isInRange( tmpDateTime );

      if( !this.isError && !isInRange )
        return;
      else if( isInRange )
        this.hideError( );

      this.dateTime.add( value, unit + "s" );
      this.renderDateTime( );

      this.dateChange( );
    },
    updateDateTime: function( dateObj ) {
      this.setDateTime( dateObj );
      this.renderDateTime( );
      this.dateChange( );
    },
    show: function( ) {
      if( !this.isActive ) {
        this.setInitialDateTime( );
        this.$container.appendTo( this.$element );
        this.activateSelectorTool( this.options.startStep );
        this.addEvents( );
        this.isActive = true;
      }
    },
    hide: function( ) {
      if( this.isActive ) {
        this.$container.remove( );
        this.removeEvents( );
        this.isActive = false;
      }
    },
    destroy: function( ) {
      this.removeEvents( );
      this.removeEventsOnce( );
      this.$container.remove( );
      this.isActive = false;
    }
  };

  function Calendar( $element, options ) {
    var setup, renderDayLabels;

    this.options = $.extend( { }, options );
    this.date = moment( );
    this.$element = $element;

    var template = '<div class="fp-cal-container">' +
                      '<div class="fp-cal-nav">' +
                        '<span class="fp-cal-left">&#9668;</span>' +
                        '<span class="fp-cal-month"></span>' +
                        '<span class="fp-cal-right">&#9658;</span>' +
                      '</div>' +
                      '<table>' +
                        '<thead><tr class="fp-cal-days"></tr></thead>' +
                        '<tbody class="fp-cal-dates"></tbody>' +
                      '</div>' +
                    '</div>',
    dateTemplate = '<td class="fp-cal-date" data-date=""></td>',
    weekTemplate = '<tr class="fp-cal-week"></tr>',
    dayLabelTemplate = '<th class="fp-cal-day-label"></th>';

    this.$container = $( template );
    this.$left = this.$container.find( ".fp-cal-left" );
    this.$right = this.$container.find( ".fp-cal-right" );
    this.$month = this.$container.find( ".fp-cal-month" );
    this.$days = this.$container.find( ".fp-cal-days" );
    this.$dates = this.$container.find( ".fp-cal-dates" );
    this.$dateTemplate = $( dateTemplate );
    this.$weekTemplate = $( weekTemplate );
    this.$dayLabelTemplate = $( dayLabelTemplate );

    this.buildDayLabels( );
  }

  //date {Moment}
  Calendar.prototype.setDate = function( date ) { 
    this.date = date.clone( );
  };

  Calendar.prototype.removeEvents = function( ) {
    this.$right.off( "click" );
    this.$left.off( "click" );
    this.$dates.find( ".fp-cal-date:not( .fp-disabled )" ).off( "click" );
  };

  Calendar.prototype.addEvents = function( ) {
    this.$right.on( "click", $.proxy( this.nextMonth, this ) );
    this.$left.on( "click", $.proxy( this.prevMonth, this ) );
    this.$dates.find( ".fp-cal-date:not( .fp-disabled )" ).on( "click", $.proxy( this.onSelectDate, this ) );
  };

  Calendar.prototype.toggleMonthArrows = function( ) {
    var minDiff = this.date.clone( ).subtract( 'months', 1 ).endOf( "month" )
                           .diff( this.options.minDateTime( ), "seconds" ),
        maxDiff = this.date.clone( ).add( 'months', 1 ).date( 1 )
                           .diff( this.options.maxDateTime( ), "seconds" );

    if( minDiff < 0 )
      this.$left.hide( );
    else
      this.$left.show( );

    if( maxDiff > 0 )
      this.$right.hide( );
    else
      this.$right.show( );

  };
  Calendar.prototype.nextMonth = function( ) {
    this.date.add( "month", 1 );
    this.selectDate( this.date.get( "year" ), this.date.get( "month" ), this.date.get( "date" ) );
    this.render( );
  };

  Calendar.prototype.prevMonth = function( ) {
    this.date.subtract( "month", 1 );
    this.selectDate( this.date.get( "year" ), this.date.get( "month" ), this.date.get( "date" ) );
    this.render( );
  };

  Calendar.prototype.selectDate = function( year, month, date ) {
    if( typeof this.options.onSelectDate === "function" )
      this.options.onSelectDate( year, month, date );
    this.highlightDate( date );
  };

  Calendar.prototype.onSelectDate = function( e ) {
    var $target = $( e.target );
    this.date.add( "months", $target.attr( "data-add-month" ) );

    this.selectDate( this.date.get( "year" ), this.date.get( "month" ), $target.attr( "data-date" ) );
  };
 
  Calendar.prototype.highlightDate = function( date ) {
    this.$dates.find( ".active" ).removeClass( "active" );
    this.$dates.find( ".fp-cal-date-" + date ).addClass( "active" );
  };

  Calendar.prototype.buildTemplate = function( ) {
    this.$month.text( this.date.format( "MMMM YYYY" ) )
               .attr( "data-month", this.date.get( "month" ) + 1 );
    this.toggleMonthArrows( );
    this.buildDates( );
    this.disableOutOfRangeDates( );
    this.highlightDate( this.date.get( "date" ) );
  };

  Calendar.prototype.disableOutOfRangeDates = function( ) {
    var self = this,
        dateTmp,
        $this;

    this.$dates.find( ".fp-cal-date" ).filter( function( ) {
      dateTmp = self.date.clone( );
      $this = $( this );

      if( $this.attr( "data-add-month" ) )
        dateTmp.add( "months", $this.attr( "data-add-month" ) );

      dateTmp.date( $( this ).attr( "data-date" ) );
      return !!( dateTmp.diff( self.options.minDateTime( ), "seconds" ) < 0 || dateTmp.diff( self.options.maxDateTime( ), "seconds" ) > 0 );
    } ).addClass( "fp-disabled" ); 
  };

  Calendar.prototype.buildDayLabels = function( ) {
    //do this for moment's locale setting
    var labelMaker = this.date.clone( );

    for( var i = 0; i < 7; ++i )
      this.$dayLabelTemplate.clone( ).text( 
          labelMaker.day( i ).format( "ddd" ) ).appendTo( this.$days );
  };

  Calendar.prototype.buildDates = function( ) {
    var days = this.date.daysInMonth( ), 
        dateCalc = this.date.clone( ),
        lastDayOfPrevMonth = this.date.clone( ).subtract( 'months', 1 ).endOf( "month" ).date( ),
        $week = this.$weekTemplate.clone( ),
        firstWeekDay = dateCalc.date( 1 ).weekday( ),
        lastWeekDay = dateCalc.date( days ).weekday( ),
        $day, i;
    this.$dates.empty( );
    //calculates previous months days
    for( i = 0; i < firstWeekDay; ++i )
      this.$dateTemplate.clone( )
          .attr( "data-add-month", -1 )
          .attr( "data-date", lastDayOfPrevMonth - i )
          .addClass( "fp-cal-date-prev-" + lastDayOfPrevMonth - i )
          .addClass( "fp-not-in-month" ).text( lastDayOfPrevMonth - i )
          .prependTo( $week ); 

    //fill first week starting from days prior
    for( i = 1; i <= 7 - firstWeekDay; ++i )
      this.$dateTemplate.clone( )
          .addClass( "fp-cal-date-" + i )
          .attr( "data-date", i ).text( i )
          .appendTo( $week ); 

    $week.appendTo( this.$dates );
    $week = this.$weekTemplate.clone( );
    $week.appendTo( this.$dates );

    //Uses i from previous for loop
    for(; i <= days; ++i ) {
      if( ( i + firstWeekDay - 1 ) % 7 === 0 ) {
        $week = this.$weekTemplate.clone( );
        $week.appendTo( this.$dates );
      }
      this.$dateTemplate.clone( )
          .addClass( "fp-cal-date-" + i )
          .attr( "data-date", i ).text( i )
          .appendTo( $week );
    }

    //calculates next months days for remaining week
    for( i = 1; i < 7 - lastWeekDay; ++i )
      this.$dateTemplate.clone( )
          .addClass( "fp-cal-date-next-" + i )
          .attr( "data-add-month", 1 )
          .attr( "data-date", i ).addClass( "fp-not-in-month" ).text( i )
          .appendTo( $week ); 
  };
 
  Calendar.prototype.render = function( ) {
    this.buildTemplate( );
    this.removeEvents( );
    this.addEvents( );
  };

  Calendar.prototype.show = function( ) {
    this.render( );
    this.$container.appendTo( this.$element );
  };

  Calendar.prototype.hide = function( ) {
    this.$container.remove( );
    this.removeEvents( );
  };

  Calendar.prototype.get = function( ) {
    return this.$container;
  };

  $.fn[ pluginName ] = function( optionsOrMethod ) {
    var $eachThis,
        _arguments = Array.prototype.slice.call( arguments ),
        name = "plugin_" + pluginName;
    //Initialize a new version of the plugin
    return this.each(function ( ) {
      $eachThis = $( this );
      if( !$eachThis.data( name ) ) {
        $eachThis.data( name, new FilthyPillow( $eachThis, optionsOrMethod ) );
      }
      else {
        if( ~$.inArray( optionsOrMethod, methods ) ) {
          $eachThis.data( name )[ optionsOrMethod ].apply( $eachThis.data( name ), _arguments.slice( 1, _arguments.length ) );
        }
        else
          console.error( "Method", optionsOrMethod, "does not exist. Did you instantiate filthypillow?" );
      }
    } );
  };
} )( jQuery, window, document );
