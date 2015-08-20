/**
 * @fileOverview IntroView - jQuery Plugin
 * @version 1.0.0
 *
 * @author BathTimeFish http://www.github.com/bathtimefish
 * @author rockymanobi https://github.com/rockymanobi
 * @see https://github.com/Nextremer/jquery-introview
 *
 * Copyright (c) 2015 BathTimeFish
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 */
(function($){

	$.fn.introview=function(config){

		function Introview(settings) {
			this.slideLefts = [];	// ページのleft位置配列
			this.pageNo = {	//ページNo情報
				"current": 0,
				"first": 0,
				"last": 0,
				"over": null,
				"finish": null
			};
			this.animation = settings.animation || Introview.JQ_ANIMATE;
			this.selector = settings.selector || console.error('selector not specified');
			this.duration = settings.duration || 500;
			this.easing = settings.easing || "easeOutQuart";
			this.finishCallback = settings.finishCallback || function(){};
			this.initialize();
		}

		// CONSTANTS
		Object.defineProperty(Introview, "JQ_ANIMATE", { value: 'jqAnimate' });
		Object.defineProperty(Introview, "CSS_ANIMATE", { value: 'cssAnimate' });

		/**
		 * 初期化処理
		 */
		Introview.prototype.initialize = function() {

			this._$el = $(this.selector)
			this._setDefaultSlideLefts();
			this._setPageNo();
			this._setPageLeft();
			// DOM構造をセットアップ
			this._setUpDom();
			this.pageNo.current = 1;
			// 最初の slide-noを取得する
			this.pageNo.first = $(this.selector + '>section').first().attr('data-page-no');
			// 最後の slide-noを取得する
			this.pageNo.last = $(this.selector + '>section').last().attr('data-page-no');
			// ポインタコントロールの設定
			this._setPointerControl();
			this._setPointerActive(1);
			// スワイプコントロールの設定
			this._setSwipeControl();
			// スキップコントロールの設定
			this._setSkipControl();
			// 方向コントロールの設定 <- PCでのデバッグ用
			//this._setArrowControl();
		};

		Introview.prototype.show = function(){
			this._$el.addClass( "show-step0" );
			var that = this;
			setTimeout(function(){
				that._$el.addClass( "show-step1" );
			},400);
		}

		Introview.prototype.hide = function(){
			this._$el.removeClass( "show-step1" );
			var that = this;
			setTimeout(function(){
				that._$el.removeClass( "show-step0" );
			},400);
		}
		Introview.prototype.start = function(){
			this._jumpToThePageNo( this.pageNo.first );
			this.show();
		}

		/**
		 * DefaultのslideLefts値を設定する
		 */
		Introview.prototype._setDefaultSlideLefts = function() {
			var count = $(this.selector + '>section').length;
			var val = 0;
			for(var i=0;i<count; i++) {
				var left = (val).toString() + '%';
				this.slideLefts.push(left);
				val = parseInt(val) + 100;
			}
		};

		/**
		 * 各pageにleftを設定する
		 */
		Introview.prototype._setPageLeft = function() {
			var val = 0;
			var that = this;
			$(this.selector + '>section').each(function() {
				var left = val.toString() + '%';
				that._setLeft( $(this), left );
				val = parseInt(val) + 100;
			});
		};


		/**
		 * 指定したjqオブジェクトの、left 値を指定する
		 */
		Introview.prototype._setLeft = function( $target,  val ){
			if( this.animation === Introview.CSS_ANIMATE ){
				$target.css('transform', "translateX(" + val + ")");
			}else{
				$target.css('left', val);
			}
		};

		/**
		 * section要素に data-page-noを付与する
		 */
		Introview.prototype._setPageNo = function() {
			var count = 1;
			$(this.selector + '>section').each(function() {
				$(this).attr('data-page-no', count);
				count++;
			});
		};

		/**
		 * section要素にセンタリング用Divを追加する
		 */
		Introview.prototype._setInnerDiv = function() {
			$(this.selector + '>section').each(function() {
                var elDiv = $('<div>');
                $(this).children().each(function() {
                    elDiv.append($(this));
                });
                $(this).children().remove();
                $(this).append(elDiv);
            });
        };

		/**
		 * ページを移動する
		 */
		Introview.prototype._move = function() {
			if(this.pageNo.current <= this.pageNo.last && this.pageNo.current >= this.pageNo.first && !this.pageNo.over && !this.pageNo.finish) {
				var count = 0;
				var that = this;
				$(this.selector + '>section').each(function() {
					var props = { 'left': that.slideLefts[count] };
					that._animate( $(this), props );
					count++;
				});
			} else if(this.pageNo.finish) {
				this.finishCallback( this );
			}
		};


		/**
		 * 指定したjqオブジェクトをアニメーションさせる
		 */
		Introview.prototype._animate = function( $target,  props ){
			if( this.animation === Introview.CSS_ANIMATE ){
				$target.css({ "transform": "translateX(" + props.left + ")" });
			}else{
				$target.animate(props, this.duration, this.easing);
			}
		}

		/**
		 * Left値に任意の値を加算する
		 */
		Introview.prototype._appendSlideLeftValues = function(val) {
			if(!val) return false;
			for(var i=0; i<this.slideLefts.length; i++) {
				var newVal = parseInt(this.slideLefts[i]) + parseInt(val);
				this.slideLefts[i] = ( newVal).toString() + '%';
			}
		};

		/**
		 * カレント位置情報をセットする
		 */
		Introview.prototype._setCurrentPageNo = function(val) {
			this.pageNo.current = parseInt(this.pageNo.current) + parseInt(val);
			if(this.pageNo.current < this.pageNo.first) {
				this.pageNo.current = this.pageNo.first;
				this.pageNo.over = true;
			} else if(this.pageNo.current > this.pageNo.last) {
				this.pageNo.current = this.pageNo.last;
				this.pageNo.over = true;
				this.pageNo.finish = true;
			} else {
				this.pageNo.over = false;
				this.pageNo.finish = false;
			}
		};

		/**
		 * 指定ポインタをアクティブにする
		 */
		Introview.prototype._setPointerActive = function(current) {
			$('div.introview-pointer-item>a').each(function() {
				if($(this).attr('data-page-no') === current.toString()) {
					$(this).addClass('active');
				} else {
					$(this).removeClass('active');
				}
			});
		};

		/**
		 * 方向ボタンを設定する (デバッグ用)
		 */
		Introview.prototype._setArrowControl = function() {
			var that = this;
			var elDiv = $("<div>").addClass("introview-buttons-wrapper");
			var elLeft = $("<button>", {"id": "left"}).text('←');
			var elRight = $("<button>", {"id": "right"}).text('→');
			elDiv.append(elLeft).append(elRight);
			$(this.selector).append(elDiv);
			$("#left").click(function() {
				that._setCurrentPageNo(-1);
				if(that.pageNo.current >= that.pageNo.first && !that.pageNo.over) {
					that._appendSlideLeftValues(100);
					that._setPointerActive(that.pageNo.current);
				}
				that._move();
			});
			$("#right").click(function() {
				that._setCurrentPageNo(1);
				if(that.pageNo.current <=that.pageNo.last && !that.pageNo.over) {
					that._appendSlideLeftValues(-100);
					that._setPointerActive(that.pageNo.current);
				}
				that._move();
			});
		};

		/**
		 * ポインタを設定する
		 */
		Introview.prototype._setPointerControl = function() {
			var that = this;
			var elDiv = $("<div>").addClass("introview-pointer-wrapper");
			$(this.selector + '>section').each(function() {
				var pageNo = $(this).attr('data-page-no');
				var elItem = $("<div>").addClass('introview-pointer-item');
				var elA = $("<a>", {"href": "#"}).attr('data-page-no', pageNo).text('*');
				elItem.append(elA);
				elDiv.append(elItem);
			});
			$(this.selector).append(elDiv);
			$("div.introview-pointer-wrapper a").click(function() {
				var selectedPageNo = $(this).attr('data-page-no');
				that._jumpToThePageNo( selectedPageNo );
			});
		};

		Introview.prototype._jumpToThePageNo = function(pageNo){
			var step = parseInt(pageNo) - parseInt(this.pageNo.current);
			if(step != 0) this._setCurrentPageNo(step);
			var leftStep = step * 100 * -1;
			this._appendSlideLeftValues(leftStep);
			this._move();
			this._setPointerActive(pageNo);
		}

		Introview.prototype._setSwipeControl = function() {
			var that = this;
			$(this.selector).swipe( {	// Use jquery Touch Swipe Plugin
				swipe:function(event, direction, distance, duration, fingerCount, fingerData) {
					if(direction === 'right') {
						that._setCurrentPageNo(-1);
						if(that.pageNo.current >= that.pageNo.first && !that.pageNo.over) {
							that._appendSlideLeftValues(100);
						}
						that._move();
						that._setPointerActive(that.pageNo.current);
					} else if(direction === 'left') {
						that._setCurrentPageNo(1);
						if(that.pageNo.current <=that.pageNo.last && !that.pageNo.over) {
							that._appendSlideLeftValues(-100);
						}
						that._move();
						that._setPointerActive(that.pageNo.current);
					}
				},
				//Default is 75px, set to 0 for demo so any distance triggers swipe
				threshold:0
			});
		};

		Introview.prototype._setUpDom = function(){
			this._setInnerDiv();
			this._$el.addClass("introview-wrapper");

			var durationInSec = this.duration / 1000;
			var easingText = "cubic-bezier(0.165, 0.84, 0.44, 1)";
			this._$el.find('section').css({
				"-webkit-transition" : "-webkit-transform " +  durationInSec + "s " + easingText,
				"-moz-transition" : "-moz-transform " +  durationInSec + "s " + easingText,
				"transition" : "transform " +  durationInSec + "s " + easingText,
			});
		};

		Introview.prototype._setSkipControl = function() {
			var that = this;
			var elDiv = $('<div>').addClass('introview-skip-wrapper');
			var elItem = $('<div>').addClass('introview-skip-item');
			var elA = $('<a>').attr('href', '#').text('Skip');
			elItem.append(elA);
			elDiv.append(elItem);
			$(this.selector).append(elDiv);
			$('div.introview-skip-item>a').click(function() {
				that.pageNo.finish = true;
				that._move();
			});
		};

		var defaults={
			"selector": this.selector || null,
			"duration": 500,
			"easing": "easeOutQuart",
			"finishCallback": function(){}
		};
		var options=$.extend(defaults, config);
		return new Introview(defaults);

	};

})(jQuery);


