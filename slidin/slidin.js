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
                adaptativeSlider: true,
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
                responsiveSlider: true,
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
            self.sliderAnimation = "";
            dataSettings = $(element).data('slidin') || {};
            self.options = $.extend({}, self.defaults, settings, dataSettings);

            self.loadAll();
        }
        return Slidin;
    })();

    Slidin.prototype.loadAll = function() {
        var self = this;
        $(window).on("load", function(){
            self.init(true);
            self.handleArrows();
            self.pauseHoverSlider();
            self.slidersEffects();
            self.autoPlay();
        });
    }

    Slidin.prototype.autoPlay = function() {
        var self = this;
        if(self.options.autoPlay) {
            self.startSlider(); 
        }
        else {
            console.log("autoplay none");
        }
    }

    Slidin.prototype.blind = function() {

    }

    Slidin.prototype.build = function() {
        var self = this;
        var maxSliderHeight = 0;

        self.numOfSliders = self.$sliderRow.children().length;
        self.numOfSliders -= 1;
        $(self.$sliderRow).children().addClass('slidin-slide');

        self.$sliderRow.children().each(function(index, element) {
            $(element).attr('slider-index', index);
        });

        self.setDimension();
    }

    Slidin.prototype.changeCurrentSlider = function(currentIndex) {
        var self = this;
        self.$sliderRow.children().removeClass("slider-selected");
        self.$sliderRow.children().eq(currentIndex).addClass("slider-selected");
        self.currentSlider = currentIndex;
    }

    Slidin.prototype.getCurrentSlider = function() {
        return this.currentSlider;
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
        if(currentIndex > 0) {
            self.changeCurrentSlider(currentIndex-1);
            self.moveSlider();
        }
        else {
            //no idea
        }
    }

    Slidin.prototype.handleNextSlider = function() {
        var self = this,
            currentIndex = self.getCurrentSlider();
        if(currentIndex < self.numOfSliders) {
            self.changeCurrentSlider(currentIndex+1);
            self.stopSlider();
            self.playSlide();
        }   
        else {
            //No idea
        }
    }

    Slidin.prototype.init = function(creation) {
        var self = this;
        if (!$(self.$slider).hasClass('slidin-initialized')) {
            $(self.$slider).addClass('slidin-initialized');
            self.build();
        }
    };

    Slidin.prototype.fadeMode = function() {
        var self = this;   
        self.sliderAnimation = setInterval(function() {
            currentIndex = self.getCurrentSlider();

            if (currentIndex == (self.$sliderRow.children().length) - 1) {
                currentIndex = 0;
            } else {
                currentIndex++;
            }

            /*
            $('.slidin-slide:first').fadeIn('slow', function(){
                $('.slidin-slide:last').after($('.slidin-slide:first')); 
            });
            */
            /*
            $(".slidin-slide:first").slideUp(function() {
                $(this).insertBefore(".slidin-slide:last").slideDown();
            });
            */

            var fadeSpeed = parseInt(self.options.speed/2, 10);
            /*
            $('.slidin-slide:first').fadeOut(fadeSpeed);
            $('.slidin-slide:last').after($('.slidin-slide:first'));
            $('.slidin-slide:first').fadeIn(fadeSpeed);
            */

            $('.slidin-slide:first').fadeOut(fadeSpeed);
            $('.slidin-slide:last').after($('.slidin-slide:first'));
            $('.slidin-slide:first').fadeIn(fadeSpeed - 100);
       
            self.changeCurrentSlider(currentIndex);
        }, self.options.speed);
    }

    Slidin.prototype.loopMode = function() {
        console.log("In loop mode");
        var self = this,
            currentTransition = (-self.$slider.children().width())*self.getCurrentSlider();
        
        self.$slideTrack.css({
            'width': (self.$slider.children().width() * (self.numOfSliders +1)) + 50
        });

        self.sliderAnimation = setInterval(function() {
            currentIndex = self.getCurrentSlider();
            currentTransition = (-400)*currentIndex;
            if(currentIndex == (self.$sliderRow.children().length) -1) {
                clearInterval(self.sliderAnimation);
                $('.slidin-slide:last').after($('.slidin-slide:first')); 
                currentIndex = 0;
                self.loopMode();
            }
            else {
                currentIndex++;
                //$('.slidin-slide:last').after($('.slidin-slide:first')); 
            }
            self.$sliderRow.css({
                'transform': 'translateX('+ currentTransition +'px)'
            });
            self.changeCurrentSlider(currentIndex);
        }, self.options.speed);
    }

    Slidin.prototype.moveSlider = function(currentTransition) {
        var self = this,
            currentTransition = (-350)*self.getCurrentSlider();
        console.log("Moving animation");
        self.$sliderRow.css({
            'transform': 'translateX('+ currentTransition +'px)'
        });
    }

    Slidin.prototype.normalMode = function() {
        var self = this;
        self.sliderAnimation = setInterval(function() {
            currentIndex = self.getCurrentSlider();
            currentTransition = (-350)*currentIndex;
            if(currentIndex == (self.$sliderRow.children().length) -1) {
                clearInterval(self.sliderAnimation);
            }
            else {
                currentIndex++;
                $('.slidin-slide:last').after($('.slidin-slide:first')); 
            }
            self.changeCurrentSlider(currentIndex);
        }, self.options.speed);
    }

    Slidin.prototype.pauseHoverSlider = function() {
        var self = this,
            list = $('.slidin-list');
        
        list.mouseover(function(){
            clearInterval(self.sliderAnimation);
            console.log("Its on hover");
        });
        
        list.mouseout(function(){
            console.log("Lets continuuu");
            self.playSlide();
        });
    }

    Slidin.prototype.playSlide = function() {
        var self = this;
        if(self.options.fade === true) {
            self.fadeMode();
        }
        else if(self.options.loop === true) {
            self.loopMode();
        }
        else {
            self.normalMode();
        }
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

    Slidin.prototype.setDimension = function() {
        var self = this;
        if(self.options.vertical === false) {
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

      //  self.carouselWidth = self.maxWidth * (self.numOfSliders);
     //   self.$sliderRow.css("width", "100%");

        self.slidesNumber = self.$sliderRow.children().length;
        self.$slideTrack = (self.slidesNumber === 0) ?
            $('<div class="slidin-track"/>').appendTo(_.$slider) :
            self.$sliderRow.wrapAll('<div class="slidin-track"/>').parent();

        self.$slidersList = self.$slideTrack.wrap('<div class="slidin-list"/>').parent();    

        if(self.options.adaptativeSlider === true) {
            $('.slidin-slide').css('width', self.$slidersList .width());
            $('.slidin-slide img').css('width', self.$slidersList.width());
        }
        else {
            $('.slidin-slide').css('width', 'auto');
        }
        $('.slidin-slide img').width(self.$slidersList.width());

        var normalImageHeight = $('.slidin-slide img').height();
        $(self.$slider).css({
            'height':  normalImageHeight,
        });
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

    Slidin.prototype.slidersEffects = function() {
        var self = this;

    }

    Slidin.prototype.stopSlider = function() {
        var self = this;
        clearInterval(self.sliderAnimation);
    }

    Slidin.prototype.startSlider = function() {
        var self = this,
            initialFadeIn = 1000,
            fadeTime = 2500,
            currentIndex = self.getCurrentSlider();

        $('.slidin-slide').eq(currentIndex).fadeIn(initialFadeIn);
        self.playSlide();
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

   