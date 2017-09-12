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
    console.log("Welcome 1");

    var Slidin = window.Slidin || {};

    Slidin = (function() {

        console.log("Slidi");

        function Slidin(element, settings) {
            var _ = this, dataSettings;
            console.log("Welcome 3");

            _.defaults =  {
                adaptativeHeigh: false,
                arrows: false,
                prevArrow: '<button class="slidin-prev" aria-label="Previous" type="button">Previous</button>',
                nextArrow: '<button class="slidin-next" aria-label="Next" type="button">Next</button>',
                autoplay: false,
                autoplaySpeed: 3000,
                centerAlign: true,
                dots: false,
                fade: false,
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
            _.$sliderRow = $('.slider-row');

            dataSettings = $(element).data('slidin') || {};
            _.options = $.extend({}, _.defaults, settings, dataSettings);

            //Initial design
            _.setDimension();

            _.init(true);
        }

        return Slidin;
    })();

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
    }

    Slidin.prototype.init = function(creation) {
        console.log("Init");
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
        var _ = this, numOfSliders;
        var maxSliderHeight = 0,
        numOfSliders = $(_.$sliderRow).children();

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
        _.$sliderRow.children().each(function(index, element) {
            $(element).css({
                'width': (100 / _.options.slidersPerView) + '%',
                'display': 'inline-block'
            });
        });
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

   