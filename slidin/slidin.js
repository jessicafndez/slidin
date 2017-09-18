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
            var self = this, dataSettings;
            console.log("*** Welcome to Slin Carousel ***");

            self.defaults =  {
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

            self.defaultInit = {
                $list: null
            }

            $.extend(self, self.defaultInit);

            self.$slider = $(element);
            self.$sliderRow = $('.slider-row');

            self.maxImageHeight = 0;
            self.maxWidth = 0;
            self.numOfSliders = 0;
            self.carouselWidth = 0;

            self.currentSlider = 0;

            dataSettings = $(element).data('slidin') || {};
            self.options = $.extend({}, self.defaults, settings, dataSettings);

            self.loadAll();
        }
        return Slidin;
    })();

    Slidin.prototype.loadAll = function() {
        var self = this;
        $(window).on("load", function(){
            self.setDimension();
            self.handleArrows();
            self.init(true);
            self.autoPlay();
        });
    }

    Slidin.prototype.handleArrows = function() {
        var self = this;
        self.leftArrow = $('.slidin-prev');
        self.rightArrow = $('.slidin-next');

        self.setArrows();
        
        self.leftArrow.click(function(){
            self.handlePrevSlider();
        });
    
        self.rightArrow.click(function() {
            self.handleNextSlider();
        });
    }

    Slidin.prototype.handlePrevSlider = function() {
        var self = this,
            currentIndex = self.getCurrentSlider();

            console.log("Current index: " + currentIndex);

        if(currentIndex > 0) {
            self.changeCurrentSlider(currentIndex-1);
            self.moveLeft();
        }
        else {
            //no idea
        }
    }

    Slidin.prototype.handleNextSlider = function() {
        console.log("***Right***");
        var self = this,
            currentIndex = self.getCurrentSlider();
        if(currentIndex < self.numOfSliders) {
            self.changeCurrentSlider(currentIndex+1);
            self.moveRight();
        }   
        else {
            //No idea
        }
    }

    Slidin.prototype.moveRight = function() {
        var self = this;
        console.log("Current: " + self.getCurrentSlider());
        var currentTransition = (-350) * self.getCurrentSlider();
        console.log("Righ transition: " + currentTransition);
        self.move(currentTransition);
    }

    Slidin.prototype.moveLeft = function() {
        var self = this;
        console.log("Current: " + self.getCurrentSlider());
        var currentPosition = 350 + (-350 * self.getCurrentSlider() -1);
      //  var currentTransition = (350) * self.getCurrentSlider();
        console.log("Left transition: " + currentPosition);
        self.move(currentPosition);
    }

    Slidin.prototype.move = function(currentTransition) {
        var self = this;
        self.$sliderRow.css({
            'transform': 'translateX('+ currentTransition +'px)'
        });
    }

    Slidin.prototype.setArrows = function() {
        var self = this;
        if(!self.options.arrows) {
            $('.slidin-arrow').css({
                'display': 'none',
                'visibility': 'hidden'
            });
        }
    }
    Slidin.prototype.setDots = function() {
        var self = this;
        if(!self.options.dots) {
            $('.slidin-dots').css({
                'display': 'none',
                'visibility': 'hidden'
            });
        }
    }
   
    Slidin.prototype.setDimension = function() {
        var self = this;
        if(self.options.vertical === false) {
            console.log("horizontal");
            if (self.options.centerAlign === true) {
                self.$list.css({
                    padding: ('0px ' + self.options.centerPadding)
                });
            }
        }
        else {
            console.log("vertical");
        }

        self.$sliderRow.children().each(function(index, element) {
            if(self.$slider.children().width()>self.maxWidth) {
                self.maxWidth=self.$slider.children().width() + 100;
            }
        });

        $(self.$slider).css({
            'height':  self.maxImageHeight + 100,
        });

        self.slidesNumber = self.$sliderRow.children().length;
        self.$slideTrack = (self.slidesNumber === 0) ?
            $('<div class="slidin-track"/>').appendTo(_.$slider) :
            self.$sliderRow.wrapAll('<div class="slidin-track"/>').parent();

        self.$slidersList = self.$slideTrack.wrap('<div class="slidin-list"/>').parent();    
    }

    Slidin.prototype.init = function(creation) {
        var self = this;
        if (!$(self.$slider).hasClass('slidin-initialized')) {
            $(self.$slider).addClass('slidin-initialized');
            self.build();
            self.animateSlider();
        }
        else {
            console.log("Has");
        }
    };

    Slidin.prototype.build = function() {
        var self = this;
        var maxSliderHeight = 0;

        self.numOfSliders = self.$sliderRow.children().length;
        self.carouselWidth = self.maxWidth * (self.numOfSliders);
        self.$sliderRow.css("width", self.carouselWidth);

        //0 is a number!
        self.numOfSliders -= 1;

        $(self.$sliderRow).children().addClass('slidin-slide');

        //Add Index to each slider image
        self.$sliderRow.children().each(function(index, element) {
            $(element).attr('slider-index', index);

            if(index > 0) {
                //$(element).css('display', 'none');
            }
        });
    }

    Slidin.prototype.animateSlider =  function() {
        var self = this;
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
        var self = this;
        if(self.options.autoPlay) {
            self.loopMode();
            self.startSlider(); 
        }
        else {
            console.log("autoplay none");
        }
    }

    Slidin.prototype.loopMode = function() {
        var self = this;

        //clone first image
    }

    Slidin.prototype.getCurrentSlider = function() {
        return this.currentSlider;
    }

    Slidin.prototype.startSlider = function() {
        var self = this;

        var firstClone = $('.slidin-slide').eq(0).clone();
    //    var secondClone = $('.slidin-slide').eq(1).clone();
     //   var preLastClone = $('.slidin-slide').eq(_.numOfSliders - 2).clone();
        var lastClone = $('.slidin-slide').eq(self.numOfSliders - 1).clone();

        var initialFadeIn = 1000;
        var fadeTime = 2500;       
        var currentIndex = self.getCurrentSlider();

        $('.slidin-slide').eq(currentIndex).fadeIn(initialFadeIn);
   
        // _.$slider.find(_.$sliderRow).append(firstClone, secondClone);
        // _.$slider.find(_.$sliderRow).prepend(preLastClone, lastClone);

        self.$slider.find(self.$sliderRow).append(firstClone);
        self.$slider.find(self.$sliderRow).prepend(lastClone);

        self.playSlide();
    }

    Slidin.prototype.playSlide = function() {
        var self = this;

        var sliderAnimation = setInterval(function() {
            currentIndex = self.getCurrentSlider();
            var currentTransition = (-350) * currentIndex;
           // $('.slidin-slide').eq(currentIndex).fadeOut(fadeTime);

            if (currentIndex == (self.$sliderRow.children().length) - 1) {
                currentIndex = 0;
            } else {
                currentIndex++;
            }
        
            self.$sliderRow.css({
                'transform': 'translateX('+ currentTransition +'px)'
            });
      
            self.changeCurrentSlider(currentIndex);
        }, self.options.speed);
    }

    Slidin.prototype.changeCurrentSlider = function(currentIndex) {
        var self = this;
        self.$sliderRow.children().removeClass("slider-selected");
        self.$sliderRow.children().eq(currentIndex).addClass("slider-selected");
        self.currentSlider = currentIndex;
    }

    $.fn.slidin = function() {
        var self = this,
            opt = arguments[0],
            args = Array.prototype.slice.call(arguments, 1),
            l = self.length,
            i,
            ret;
        for (i = 0; i < l; i++) {
            if (typeof opt == 'object' || typeof opt == 'undefined')
                self[i].slick = new Slidin(self[i], opt);
            else
                ret = self[i].slick[opt].apply(self[i].slick, args);
            if (typeof ret != 'undefined') return ret;
        }
        return self;
    };

}));

   