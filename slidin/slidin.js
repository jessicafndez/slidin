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
                fullWidth: true,
                loop: false,
                marginInSliders: 1,
                maxHeight: 5,
                photoBorder: false,
                photoBorderColor: '#ffffff',
                photoBorderDimension: 5,
                photoBorderShadow: true,
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

            self.initialNumSliders = 0;

            self.loadAll();
        }
        return Slidin;
    })();


    Slidin.prototype.loadAll = function() {
        var self = this;

        $(document).ready(function() {
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


    Slidin.prototype.build = function() {
        var self = this;

        self.numOfSliders = self.$sliderRow.children().length;
        self.numOfSliders -= 1;
        $(self.$sliderRow).children().addClass('slidin-slide');

        self.initialNumSliders = self.$sliderRow.children().length;
        console.log("Initial: " + self.initialNumSliders);

        self.$sliderRow.children().each(function(index, element) {
            $(element).attr('slider-index', index);
        });

        $(".slider-row .slidin-slide:first").addClass('slider-selected');
        self.cloneSliders();
        self.setDimension();
        self.setStyles();

        if(!self.options.loop) {
            $('.prevArrow').append(self.options.prevArrow);
            $('.nextArrow').append(self.options.nextArrow);
        }

        self.paintDots();
        self.paintActiveDot();

        self.$sliderRow.css({
            'transform': 'translateX(-'+ self.$sliderRow.children().width() +'px)'
        });
    }


    Slidin.prototype.buildCarousel = function(indexStart) {
        var self = this,
            animateSpeedTransition = self.options.speed/2;

        var newIndex = parseInt(indexStart);

        var movementX = self.$sliderRow.children(':first').width() * (-1 * newIndex) - (self.options.marginInSliders*2);
        var movementLeft = movementX + self.$sliderRow.children(':first').width() - (self.options.marginInSliders*2);

        clearInterval(self.sliderAnimation);

        console.log("--------------------------");
        console.log("go to: " + indexStart);
        console.log("MovementStart: " + movementX);
        console.log("movementEnd: " + movementLeft);
        console.log("--------------------------");

        self.numOfSliders = self.$sliderRow.children().length;

        //This is to go next
        $(".dinamic-carousel .slider-row").animate({marginLeft: movementX}, animateSpeedTransition, function() {
            self.removeSelecteds();
            self.removeClones();
            $(this).find(".slidin-slide:last").after($(this).find(".slidin-slide:first"));
          //  $(".slider-row .slidin-slide:first").addClass('slider-selected');
            self.$sliderRow.children().eq(indexStart -1).addClass("slider-selected");
            self.cloneSliders();
            self.paintActiveDotSwap(indexStart); 
            $(this).css({marginLeft: movementLeft});
        });

        //This is go back

    }


    Slidin.prototype.cloneSliders = function() {
        var self = this;

        var firstClone = $(".slidin-slide:first").clone();
        var lastClone = $(".slidin-slide:last").clone();
        lastClone.prependTo($(".slider-row")).addClass("slider-clone").removeClass('slider-selected');
        firstClone.appendTo($(".slider-row")).addClass("slider-clone").removeClass('slider-selected');
    }


    Slidin.prototype.changeCurrentSlider = function(currentIndex) {
        var self = this;

        self.$sliderRow.children().removeClass("slider-selected");
        self.$sliderRow.children().eq(currentIndex).addClass("slider-selected");
        self.currentSlider = currentIndex;
    }


    Slidin.prototype.dotsHandler = function() {
        var self = this,
        dotPressed = $('.slidin-paginator-bullet');

        dotPressed.click(function(){
            var dotIndex = $(this).attr('dot-index');
            self.dotGoTo(dotIndex)
        });
    }
    
    /***** DOING *****/
    Slidin.prototype.dotGoTo = function(dotIndex) {
        var self = this,
            animateSpeedTransition = self.options.speed/2;

        var newIndex = parseInt(dotIndex);
        var movementDiff = newIndex - actualX;
        var actualX = parseInt($('.slidin-slide.slider-selected').attr('slider-index')); 
        var movementX = (self.$sliderRow.children(':first').width() * (-1 * newIndex) - (self.options.marginInSliders*(newIndex + 1))  
            - (self.$sliderRow.children(':first').width()*(-1*actualX)));
       
        var movementLeft = movementX + self.$sliderRow.children(':first').width() + (self.options.marginInSliders*(actualX));


        clearInterval(self.sliderAnimation);

        console.log("--------------------------");
        console.log("go to: " + newIndex);
        console.log("Actual: " + actualX);
        console.log("MovementStart: " + movementX);
        console.log("movementEnd: " + movementLeft);
        console.log("--------------------------");

        //This is to go next
        $(".dinamic-carousel .slider-row").animate({marginLeft: movementX}, animateSpeedTransition, function() {
            self.removeSelecteds();
            self.removeClones();
            $(this).find(".slidin-slide:last").after($(this).find(".slidin-slide:first"));
            $(".slider-row .slidin-slide:first").addClass('slider-selected');
            //self.$sliderRow.children().eq(dotIndex -1).addClass("slider-selected");
            self.cloneSliders();
            self.paintActiveDotSwap(newIndex); 
            $(this).css({marginLeft: movementLeft});
        });
    }


    Slidin.prototype.paintActiveDot = function() {
        var self = this;

        if(self.options.dots) {
            self.removeActiveDot();
            var slidinSelected = $('.slidin-slide.slider-selected').attr('slider-index');
            $('.slidin-paginator-bullet').eq(slidinSelected).addClass('slidin-paginator-bullet-active');
        }
    }


    Slidin.prototype.paintActiveDotSwap = function(index) {
        var self = this;

        self.removeActiveDot();
        $('.slidin-paginator-bullet').eq(index).addClass('slidin-paginator-bullet-active');
    }


    Slidin.prototype.paintNextActiveDot = function() {
        var self = this;

        if(self.options.dots) {
            self.removeActiveDot();
            var slidinSelected = $('.slidin-slide.slider-selected').attr('slider-index');
            
            slidinSelected++;
            if(slidinSelected==(self.numOfSliders-2)) {
                slidinSelected = 0;
            }
            
            $('.slidin-paginator-bullet').eq(slidinSelected).addClass('slidin-paginator-bullet-active');
        }
    }


    Slidin.prototype.paintDots = function() {
        var self = this;

        if(self.options.dots) {
            $('.slidin-paginator').css({
                'display': 'block'
            });
            
            $('<div class="slidin-paginator-bullets"/>').appendTo('.slidin-paginator');
            for(var i=0; i<self.numOfSliders+1; i++) {
                $('<div class="slidin-paginator-bullet"/>').appendTo('.slidin-paginator-bullets');
            }

            $('.slidin-paginator-bullets').children().each(function(index, element) {
                $(element).attr('dot-index', index);
            });

            self.dotsHandler();
        }   
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
            slidersWidth = self.$sliderRow.children().width();

        $(".dinamic-carousel .slider-row").animate({marginLeft: slidersWidth}, 1000, function() {
            self.removeSelecteds();
            self.removeClones();
            $(this).find(".slidin-slide:first").before($(this).find(".slidin-slide:last"));
            $(".slider-row .slidin-slide:first").addClass('slider-selected');
            self.cloneSliders();
            self.paintActiveDot(); 
            $(this).css({marginLeft: 0});
        });
    }


    Slidin.prototype.handleNextSlider = function() {
        var self = this,
            slidersWidth = self.$sliderRow.children().width();

        console.log("Moving: " + slidersWidth);
 
        $(".dinamic-carousel .slider-row").animate({marginLeft: -slidersWidth}, 1000, function() {
            self.removeSelecteds();
            self.removeClones();
            $(this).find(".slidin-slide:last").after($(this).find(".slidin-slide:first"));
            $(".slider-row .slidin-slide:first").addClass('slider-selected');
            self.cloneSliders();
            self.paintActiveDot(); 
            $(this).css({marginLeft: -0});
        });
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
    }


    Slidin.prototype.loopMode = function() {
        var self = this,
            animateSpeedTransition = self.options.speed/2;

        var movementX = self.$sliderRow.children(':first').width() * (-1) - (self.options.marginInSliders*2);
        console.log("R: " + self.$sliderRow.width());

        console.log("W: " + movementX);

        self.numOfSliders = self.$sliderRow.children().length;
        self.sliderAnimation = setInterval(function() {
            $(".dinamic-carousel .slider-row").animate({marginLeft: movementX}, animateSpeedTransition, function() {
                self.removeSelecteds();
                self.removeClones();
                $(this).find(".slidin-slide:last").after($(this).find(".slidin-slide:first"));
                $(".slider-row .slidin-slide:first").addClass('slider-selected');
                self.cloneSliders();
                self.paintActiveDot(); 
                $(this).css({marginLeft: -0});
            });
        }, self.options.speed);
    }


    Slidin.prototype.loopModeDotsPosition = function(indexPosition) {
        var self = this,
        animateSpeedTransition = self.options.speed/2;

        var movementX = self.$sliderRow.children(':first').width() * (-1) * indexPosition - (self.options.marginInSliders*2);
  
        console.log("------------");
        console.log("W: " + movementX);
        console.log("-------------");

        self.numOfSliders = self.$sliderRow.children().length;

        self.buildCarousel(indexPosition);
    }

  
    Slidin.prototype.normalMode = function() {
        var self = this;
    }


    Slidin.prototype.pauseHoverSlider = function() {
        var self = this,
            list = $('.slidin-list');
        

        /*
        list.mouseover(function(){
            self.stopSlider();
        });
        
        list.mouseout(function(){
            self.playSlide();     
        });
        */
    }


    Slidin.prototype.removeSelecteds = function() {
        this.$sliderRow.children().removeClass("slider-selected");
    }


    Slidin.prototype.removeClones = function() {
        this.$sliderRow.find(".slider-clone").remove()
    }


    Slidin.prototype.removeActiveDot = function() {
        $('.slidin-paginator-bullets').children().removeClass("slidin-paginator-bullet-active");
    }


    Slidin.prototype.playSlide = function() {
        var self = this;

        if(self.options.fade === true) {
            self.fadeMode();
        }
        else if(self.options.loop === true) {
            console.log("loop mode here");
            self.loopMode();
        }
        else {
            console.log("Normal mode here");
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
        var self = this,
            sliderArray = self.$sliderRow.children();

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
        
        if(self.options.fullWidth) {
            var slidinW = $('.slidin-slide').eq(1).width() + (self.options.photoBorderDimension*2) + 20;
            var slidinH = $('.slidin-slide').eq(1).height() + 50;

            $('.slidin').css({
                'padding-top': 'auto',
                'margin-left': '0px',
                'height': slidinH
            });

            sliderArray.each(function() {
                $(this).find('img').css({
                    'width': '100%'  
                });
            });
        }
        else { 
            var firstChildWidth = self.$sliderRow.children(':first').width() + (2*self.options.photoBorderDimension);
            sliderArray.each(function() {
                console.log(this);
              
            });
        }

        self.$sliderRow.children().each(function(index, element) {
            if(self.options.marginInSliders>0) {
                $(element).css({
                    'margin': '10px',
                    'margin-left': self.options.marginInSliders + self.options.photoBorderDimension,
                });
            }
        });

        if(self.options.marginInSliders>0) {
            var singleSliderWidth = self.$sliderRow.children().width() 
            + (self.options.marginInSliders * 2)
            + (self.options.photoBorderDimension * 2);
            var singleSliderMargin = (self.options.marginInSliders*2) + (self.options.photoBorderDimension*2);
        }
        else {
            var singleSliderWidth = self.$sliderRow.children().width() + self.options.photoBorderDimension;
            var singleSliderMargin = 0;
        }

        self.$slider.css({
            'width': singleSliderWidth
        });
        
        self.slidesNumber = self.$sliderRow.children().length;

        var sliderWidth = self.$sliderRow.children().width();
        var totalSlidersWidth = sliderWidth * self.slidesNumber 
        + (self.options.marginInSliders*self.slidesNumber*2)
        + (self.options.photoBorderDimension*self.slidesNumber*2);

        $(".dinamic-carousel .slider-row").css({
            'width': totalSlidersWidth
        });
        
        self.$slideTrack = (self.slidesNumber === 0) ?
            $('<div class="slidin-track"/>').appendTo(_.$slider) :
            self.$sliderRow.wrapAll('<div class="slidin-track"/>').parent();

        self.$slidersList = self.$slideTrack.wrap('<div class="slidin-list"/>').parent();    

        $('.slidin-list').css({
            'margin-left': -singleSliderMargin
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


    Slidin.prototype.setStyles = function() {
        var self = this,
            sliderArray = self.$sliderRow.children();

        if(self.options.photoBorder) {
            var customBorder = self.options.photoBorderDimension + "px solid " + self.options.photoBorderColor;
            sliderArray.each(function() {
                $(this).find('img').css({
                    'border': customBorder  
                });
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

   