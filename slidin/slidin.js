;(function(factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof exports !== 'undefined') {
        module.exports = factory(require('jquery'));
    } else {
        factory(jQuery);
    }
}
(function($) {
    var Slidin = window.Slidin || {};
    Slidin = (function() {

        function Slidin(element, settings) {
            var _ = this, dataSettings;
            console.log("Welcome 3");

            _.defaults =  {
                adaptativeHeigh: false,
                arrows: false,
                prevArrow: '<button class="slidin-prev" aria-label="Previous" type="button">Previous</button>',
                nextArrow: '<button class="slidin-next" aria-label="Next" type="button">Next</button>',
                autoPlay: false,
                autoplaySpeed: 3000,
                centerAlign: true,
                dots: false,
                fade: false,
                loop: false,
                maxHeight: 5,
                sliderPerRow: 1,
                sliderToShow: 1,
                slidesToScroll: 1,
                slidersPerView: 1,
                speed: 500,
                vertical: true,
            }

            _.defaultInit = {
                $list: null
            }

            //Adding to 'this'
            $.extend(_, _.defaultInit);

            //Variables
            _.$slider = $(element);

            //in future we need to clean this sh**
            _.$sliderRow = $('.slider-row');

            //Max heigh of our slider
            _.maxImageHeight = 0;
            _.maxWidth = 0;

            _.numOfSliders = 0;

            //Current slider
            _.currentSlider = 0;

            //Special functions

            dataSettings = $(element).data('slidin') || {};
            _.options = $.extend({}, _.defaults, settings, dataSettings);

            _.loadAll();
        }

        return Slidin;
    })();

    Slidin.prototype.loadAll = function() {
        var _ = this;
        $(window).on("load", function(){
            //Initial design
            _.setDimension();
            _.setArrows();

            _.handleArrows();

            _.init(true);
            _.autoPlay();
        });
    }

    Slidin.prototype.handleArrows = function() {
        var _ = this;
        
        _.leftArrow = $('.slidin-prev');
        _.rightArrow = $('.slidin-next');
        
        _.leftArrow.click(function(){
           _.handlePrevSlider();
        });

        _.rightArrow.click(function() {
            _.handleNextSlider();
        });
    }

    Slidin.prototype.handlePrevSlider = function() {
        var _ = this,
             actualSlider = _.getCurrentSlider();

        //Loop model enable
        if(_.options.loop) {
            //Mean we aren't in first slider
            if($('.slider-selected').prev().length) {
                _.changeCurrentSlider(actualSlider-1);
            }
            else {
                //go to last slider
                _.changeCurrentSlider(_.numOfSliders);
            }
        }
        else {

        }
    }

    Slidin.prototype.handleNextSlider = function() {
        console.log("R");
    }

    Slidin.prototype.setArrows = function() {
        var _ = this;
        if(!_.options.arrows) {
            $('.slidin-arrow').css({
                'display': 'none',
                'visibility': 'hidden'
            });
        }
    }

    Slidin.prototype.setDots = function() {
        var _ = this;
        if(!_.options.dots) {
            $('.slidin-dots').css({
                'display': 'none',
                'visibility': 'hidden'
            });
        }
    }
   
    Slidin.prototype.setDimension = function() {
        var _ = this;

        //Sliders horizontal
        if(_.options.vertical === false) {
            console.log("horizontal");
            if (_.options.centerAlign === true) {
                _.$list.css({
                    padding: ('0px ' + _.options.centerPadding)
                });
            }
        }
        //Sliders vertical
        else {
            console.log("vertical");
        }

        _.$sliderRow.children().each(function(index, element) {
            /*
            if($(element).children().height()>_.maxImageHeight) {
                _.maxImageHeight=$(element).children().height();
            }
            */
            if($(element).children().width()>_.maxWidth) {
                _.maxWidth=$(element).children().width() + 100;
            }
        });

        $(_.$slider).css({
            'height':  _.maxImageHeight + 100,
        });
        /*
        $(_.$sliderRow).css({
            'width': _.maxWidth
        });
        */

        _.slidesNumber = _.$sliderRow.children().length;

        _.$slideTrack = (_.slidesNumber === 0) ?
            $('<div class="slidin-track"/>').appendTo(_.$slider) :
            _.$sliderRow.wrapAll('<div class="slidin-track"/>').parent();

        _.$slidersList = _.$slideTrack.wrap('<div class="slidin-list"/>').parent();
        /*
        _.$slidersList.css({
            'width': _.maxWidth,
            'margin': "0 auto"
        });
        */
        
    }

    Slidin.prototype.init = function(creation) {
        var _ = this;
        if (!$(_.$slider).hasClass('slidin-initialized')) {
            $(_.$slider).addClass('slidin-initialized');

            /*Call to constructor functions*/
            _.build();
            _.animateSlider();
        }
        else {
            console.log("Has");
        }
    };

    Slidin.prototype.build = function() {
        var _ = this;
        var maxSliderHeight = 0;
        _.numOfSliders = $(_.$sliderRow).children();

        $(_.$sliderRow).children().addClass('slidin-slide');

        //Add Index to each slider image
        _.$sliderRow.children().each(function(index, element) {
            $(element).attr('slider-index', index);

            if(index > 0) {
                //$(element).css('display', 'none');
            }
        });
    }

    Slidin.prototype.animateSlider =  function() {
        var _ = this;
        /*
        _.$sliderRow.children().each(function(index, element) {
            $(element).css({
                'width': (100 / _.options.slidesToScroll) + '%',
                'display': 'inline-block'
            });
        });
        */
    }

    Slidin.prototype.autoPlay = function() {
        var _ = this;
        if(_.options.autoPlay) {
            //If not given, take default speed
            console.log("autoplay yes");

            //Clone first slider
            _.loopMode();

            //Star slider animation
            _.startSlider();
            
        }
        else {
            console.log("autoplay none");
        }
    }

    Slidin.prototype.loopMode = function() {
        var _ = this;
    }

    Slidin.prototype.getCurrentSlider = function() {
        var _ = this;
        return _.currentSlider;
    }

    Slidin.prototype.startSlider = function() {
        //Start with first slider
        var _ = this;

        var sliderAnimation = setInterval(function() {
            var currentIndex = _.getCurrentSlider();
            _.changeCurrentSlider(currentIndex);

            var currentTransition = (-350) * currentIndex;
            _.$sliderRow.css({
                'transform': 'translateX('+ currentTransition +'px)'
            });

            currentIndex++;
            if(currentIndex == _.$sliderRow.children().length) {
                if(_.options.loop === true) {
                    currentIndex = 0;
                }
                else {
                    clearInterval(sliderAnimation);
                }
            }  
        }, _.options.speed);
    }

    Slidin.prototype.changeCurrentSlider = function(currentIndex) {
        var _ = this;
        _.$sliderRow.children().removeClass("slider-selected");
        _.$sliderRow.children().eq(currentIndex).addClass("slider-selected");
        _.currentSlider = currentIndex;
    }

    $.fn.slidin = function() {
        var _ = this,
            opt = arguments[0],
            args = Array.prototype.slice.call(arguments, 1),
            l = _.length,
            i,
            ret;
        for (i = 0; i < l; i++) {
            if (typeof opt == 'object' || typeof opt == 'undefined')
                _[i].slick = new Slidin(_[i], opt);
            else
                ret = _[i].slick[opt].apply(_[i].slick, args);
            if (typeof ret != 'undefined') return ret;
        }
        return _;
    };

}));

   