(function ($, undefined) {
	'use strict';
	
	/**
		* Creates an instance of Carousel.
		*
		* @constructor
		* @this {Carousel}
		* @param {object} $container The container.
		* @param {object} opts Options.
	*/
	var Carousel = function ($container, opts) {
		if ($container === undefined || !$($container.length)) { return; }
		if (!this instanceof Carousel) { return new Carousel($container, opts); }
		var _this = this; 
		
		opts = opts || {};
		opts.prevBtn = opts.prevBtn || {};
		opts.nextBtn = opts.nextBtn || {};
		
		_this.$container = $($container);
		
		_this.cfg = opts = {
			$scrollWrap: (typeof opts.$scrollWrap === 'object') ? opts.$scrollWrap : _this.$container.find('.carousel_wrap'),
			$scrollContent: (typeof opts.$scrollContent === 'object') ? opts.$scrollContent : _this.$container.find('.scroller_content'),
			mouseWheel: (typeof opts.mouseWheel === 'boolean') ? opts.mouseWheel : true,
			easing: (typeof opts.easing === 'string') ? opts.easing : 'easeOutQuad',
			duration: (typeof opts.duration === 'number') ? opts.duration : 400,
			scrollY: (typeof opts.scrollY === 'boolean') ? opts.scrollY : false,
			scrollX: (typeof opts.scrollX === 'boolean') ? opts.scrollX : true,
			prevBtn: {
				id: (typeof opts.prevBtn.id === 'string') ? opts.prevBtn.id : 'scroller_' + Math.random() + '_prev',
				cssClassName: (typeof opts.prevBtn.cssClassName === 'string') ? opts.prevBtn.cssClassName : 'scroll_prev scroll_toggle',
				text: (typeof opts.prevBtn.text === 'string') ? opts.prevBtn.text : 'Previous'
			},
			nextBtn: {
				id: (typeof opts.nextBtn.id === 'string') ? opts.nextBtn.id : 'scroller_' + Math.random() + '_prev',
				cssClassName: (typeof opts.nextBtn.cssClassName === 'string') ? opts.nextBtn.cssClassName : 'scroll_next scroll_toggle',
				text: (typeof opts.nextBtn.text === 'string') ? opts.nextBtn.text : 'Next'
			},
			slideSelector: (typeof opts.slideSelector === 'string') ? opts.slideSelector : '.slide',
			initial: (typeof opts.initial === 'number') ? opts.initial : 0,
			numSlidesToShow: (typeof opts.numSlidesToShow === 'number') ? opts.numSlidesToShow : 3,
			debug: (typeof opts.debug === 'boolean') ? opts.debug : false,
			onLoad: (typeof opts.onLoad === 'function') ? opts.onLoad : function () {}
		};
		
		_this.$scrollWrap = _this.cfg.$scrollWrap.css({
			'position': 'relative',
			'overflow': 'hidden'
		});
		_this.$scrollContent = _this.cfg.$scrollContent.css({
			'position': 'relative'
		});
		
		_this.$slides = _this.$scrollWrap.find(_this.cfg.slideSelector);
		_this.current = _this.cfg.initial;
		
		if (_this.$slides.length > 0) {
			_this.init();
		}
	};
	Carousel.prototype = {
		init: function () {
			var _this = this;
			_this.addDOM();
			_this.reset();
			_this.goTo(_this.current);
		},
		addDOM: function () {
			var _this = this,
				cfg = _this.cfg,
				$innerDivPrev = $('<div>').html(cfg.prevBtn.text),
				$innerDivNext = $('<div>').html(cfg.nextBtn.text);
				
			_this.$prevBtn = $('<div>').addClass(cfg.prevBtn.cssClassName).html($innerDivPrev).attr({
				'id': cfg.prevBtn.id
			}).insertBefore(_this.$scrollWrap);
			
			_this.$nextBtn = $('<div>').addClass(cfg.nextBtn.cssClassName).html($innerDivNext).attr({
				'id': cfg.nextBtn.id
			}).insertAfter(_this.$scrollWrap);
		},
		reset: function () {
			var _this = this,
				cfg = _this.cfg,
				numSlides;
				
			_this.$slides = _this.$scrollWrap.find(_this.cfg.slideSelector);
			numSlides = _this.$slides.length;
			
			//vertical
			if (cfg.scrollY) {
				var slideHeight = _this.$slides.outerHeight(true),
					scrollWrapHeight = slideHeight * cfg.numSlidesToShow;
				
				_this.$scrollWrap.height(scrollWrapHeight);
				_this.$scrollContent.height(slideHeight * numSlides);
				
				_this.amountToSlide = scrollWrapHeight;
				_this.slideLength = Math.ceil(_this.$scrollContent.height() / _this.amountToSlide);
			}
			//horizontal
			if (cfg.scrollX) { 
				var slideWidth = _this.$slides.outerWidth(true),
					scrollWrapWidth = slideWidth * cfg.numSlidesToShow;
				_this.$scrollWrap.width(scrollWrapWidth);
				_this.$scrollContent.width(slideWidth * numSlides);
				_this.amountToSlide = scrollWrapWidth;
				_this.slideLength = Math.ceil(_this.$scrollContent.width() / _this.amountToSlide);
			}
			
			_this.$prevBtn.on('click', function (ev) {
				ev.preventDefault();
				if (_this.current === 0) { return; }
				_this.goTo(_this.current - 1);
			});
			
			_this.$nextBtn.on('click', function (ev) {
				ev.preventDefault();
				if (_this.current === _this.slideLength - 1) { return; }
				_this.goTo(_this.current + 1);
			});
			cfg.onLoad();
		},
		goTo: function (idx) {
			var _this = this,
				cfg = _this.cfg,
				left = cfg.scrollX ? -(_this.amountToSlide * idx) : 0,
				top = cfg.scrollY ? -(_this.amountToSlide * idx) : 0;
	
			_this.$prevBtn.removeClass('disabled');
			_this.$nextBtn.removeClass('disabled');
			
			if (idx === 0) {
				_this.$prevBtn.addClass('disabled');
			}
			if (idx === _this.slideLength - 1) {
				_this.$nextBtn.addClass('disabled');
			}
			
			_this.$scrollContent.transition({
				x: left,
				y: top,
				duration: cfg.duration,
				easing: cfg.easing
			});
			
			_this.current = idx;
		}
	};
	
	window.Carousel = Carousel;
	
}(window.jQuery));