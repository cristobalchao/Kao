/**
 * Kao v0.9
 * 
 *
 * Copyright (c) 2012 Cristobal Chao
 * MIT License
 **/
(function( window, $, undefined ){

	if ( !$.cssHooks ) {

		throw("jQuery 1.4.3+ is needed for this plugin to work");
		return;
	}
	
	function styleSupport( prop ) {
		var vendorProp, supportedProp,
		capProp = prop.charAt(0).toUpperCase() + prop.slice(1),
		prefixes = [ "Moz", "Webkit", "O", "ms" ],
		newprefixes = [ "-moz-", "-webkit-", "-o-", "-ms-" ],
		div = document.createElement( "div" );

		if ( prop in div.style ) {
			supportedProp = prop;
		} else {
			for ( var i = 0; i < prefixes.length; i++ ) {
				vendorProp = prefixes[i] + capProp;
				if ( vendorProp in div.style ) {
					supportedProp = newprefixes[i]+prop;
					break;
				}
			}
		}

		div = null;
		$.support[ prop ] = supportedProp;
		return supportedProp;
	}

	var kao = styleSupport( "transform" );

	$.cssHooks.scale = {
		get: function( elem, computed, extra ) {
			return elem.style[ kao ];
		},
		set: function( elem, value) {
			var _translate = (elem.style[ kao ].indexOf('translate(')  > -1)?elem.style[ kao ].split('translate(')[1]:"";
			(_translate)?_translate = 'translate('+_translate.split(')')[0]+')':null;
			var _rotate = (elem.style[ kao ].indexOf('rotate(')  > -1)?elem.style[ kao ].split('rotate(')[1]:"";
			(_rotate)?_rotate = ' rotate('+_rotate.split(')')[0]+')':null;
			elem.style[ kao ] = "scale("+value.split('px')[0]+")"+_rotate;
		}
	};

	$.cssHooks.translate = {
		get: function( elem, computed, extra ) {
			return elem.style[ kao ];
		},
		set: function( elem, value) {
			var _scale = (elem.style[ kao ].indexOf('scale(') > -1)?elem.style[ kao ].split('scale(')[1]:"";
			var _rotate = (elem.style[ kao ].indexOf('rotate(') > -1)?elem.style[ kao ].split('rotate(')[1]:"";
			(_scale)?_scale = 'scale('+_scale.split(')')[0]+')':null;
			(_rotate)?_rotate = ' rotate('+_rotate.split(')')[0]+')':null;
			if (typeof value[0] === 'string' ){
				_valX = value[0].split('(')[1];
				_valY = value[1].split(')')[0];
				elem.style[ kao ] = "translate("+_valX+","+_valY+") "+_scale+_rotate;
			} else {
				var _x = value[0];
				var _y = value[1];
				elem.style[ kao ] = "translate("+_x+"px,"+_y+"px) "+_scale+_rotate;
			}
		}
	};

	var $numElemRow = "";
	var $x_var;
	var $y_var;
	var $width;
	var $ouWidth;
	var $ouHeight;
	var $activate = false;

	//Allows to create new css rules
	$.fn.cssRule = function (rules){
		$this = this;
		var context=document,stylesheet;
		if(typeof context.styleSheets=='object'){
			if(context.styleSheets.length){
				stylesheet=context.styleSheets[context.styleSheets.length-1];
			}
			if(context.styleSheets.length){
				if(context.createStyleSheet){
					stylesheet=context.createStyleSheet();
				}else{
					context.getElementsByTagName('head')[0].appendChild(context.createElement('style'));
					stylesheet=context.styleSheets[context.styleSheets.length-1];
				}
			}
			if(stylesheet.addRule){
				stylesheet.addRule($this.selector,rules);
			}else{
				stylesheet.insertRule($this.selector + '{' + rules + '}', stylesheet.cssRules.length); 
			}	
		}
	}

	function nextPos(pos){
		var x = parseInt(pos[0]), y = parseInt(pos[1]);
		(2*x < $kao_container.width)?x+=$x_var:y+=$y_var;
		pos[0]=x;pos[1]=y;
		return pos;
	}

	function setNumElemRow(num){
		if (!$numElemRow){
			$numElemRow = num;
		}
	}

	function setWidth(num){
		
		if (!$width){
			$width = num;
		}
	}

	function setoWidth(num){
		if (!$ouWidth){
			$ouWidth = num;
		}
	}

	function setoHeight(num){
		if (!$ouHeight){
			$ouHeight = num;
		}
	}

	function setXVar(num){
		if (!$x_var){
			$x_var = num;
		}
	}

	function setYVar(num){
		if (!$y_var){
			$y_var = num;
		}
	}

	$.fn.getAbsPos = function() {
		var strPos = this.css('translate');
		return strPos;
	}

	$.fn.getAbsPos_x = function() {
		return parseInt(this.getAbsPos()[0]);
	}

	$.fn.getAbsPos_y = function() {
		return parseInt(this.getAbsPos()[1]);
	}

	function getLastPos_y(){
		var max = -1;
		$kao_element.selector.each(function(){
			var value = parseInt($(this).getAbsPos_y());
			(max < value)?max=value:null;
		});

		return max;
	}

	$.fn.getPos_x = function() {
		return this.attr('pos').split(',')[0];
	}

	$.fn.getPos_y = function() {
		return this.attr('pos').split(',')[1];
	}

	function getPos(id_elem){
		if (id_elem >= $kao_element.selector.length) {
			return $kao_element.next_last_pos;
		}else {
			return $($kao_element.selector.selector+'[data-id="'+id_elem+'"]').attr('posIni').split(',');
		}
	}

	$.fn.getSavedPos = function(pos) {
		return this.attr('pos').split(',');
	}

	$.fn.setSavedPos = function(pos) {
		this.attr('pos',pos);
	}

	$.fn.savePos = function() {
		this.attr('pos',this.getAbsPos());
	}

	$.fn.savePosIni = function() {
		this.attr('posIni',this.getAbsPos());
	}

	$.fn.setPos = function(pos) {
		$this = this;
		$(this).css({ translate: pos });
	}

	$.fn.restartToSavedPos = function() {
		$this = this;
		$this.setPos($this.getSavedPos());
	}

	$.fn.isExtended = function() {
		return $kao_container.selector.hasClass('extended');
	}

	$.fn.getDoubleWidth = function() {
		return $kao_element.max_width;
	}

	Array.prototype.findIndex = function(value){
		var ctr = "";
		for (var i=0; i < this.length; i++) {
			if (this[i] == value) {
				return i;
			}
		}
		return ctr;
	};

	$.fn.pushing = function(){
		var clonArr = $.extend(true, [], $kao_element.cells);
		var psArr = clonArr.findIndex($this.attr('data-id'));
		//If the element is on the right, we expand it to the left, and the other way around
		if ($this.hasClass('rElem')){
			var aux = clonArr[psArr-1];
			clonArr[psArr-1] = 'E';
			clonArr[psArr] = aux;
		}else{
			clonArr[psArr] = 'E';
		}

		clonArr.splice(psArr, 0, 'E');

		//Positioning the elements
		for (var i=0;i < clonArr.length;i++) {
			var val = clonArr[i];
			if(val != 'E')  {
				if (i+1 == clonArr.length) {
					$($kao_element.selector.selector+'[data-id="'+val+'"]').css({ translate: $kao_element.last_pos });
				} else {
					$($kao_element.selector.selector+'[data-id="'+val+'"]').css({ translate: getPos(i) });
				}
			}
		}
	}

	function add_effect(elem) {
		//If there are elements to apply effects
		if ($kao_element.subelems_effects) {
			$($kao_element.subelems_effects,elem).css({opacity:0}).animate({opacity:1},$kao_element.time_effect);
		}
	}

	function refreshPage(args){
		if ($kao_element.filter){
			var filterPage = window.location.href.split('#/filter/')[1];
			filterPage = (!filterPage)?'all':filterPage;
			$filter_elem = $($kao_element.filter+'[href="#/filter/'+filterPage+'"]');
			$($kao_element.filter).removeClass('active');
			$filter_elem.addClass('active');
			$filter_elem.filterElements(args);
		}
	}

	$.fn.filterElements = function(args){
		$this = this;
		var arrAux = new Array();
		if ($this.attr('id') === '.*') {
			$kao_element.selector.each(function(){
				arrAux.push($(this).attr('data-id'));
			});
		}else{
			$($this.attr('id')).each(function(){
				arrAux.push($(this).attr('data-id'));
			});
		}
		$kao_element.selector.each(function(){
			if (arrAux.indexOf($(this).attr('data-id')) == -1){
				$(this).css({scale:0.001,opacity:0});
			}
		});
		$kao_element.cells = $.extend(true, [], arrAux);
		$kao_element.selector.css({opacity:0});
		//Positioning the elements
		collapse();
		for (var i=0;i < arrAux.length;i++) {
			var val = arrAux[i];
			
			//if is going to be rElem
			if ((i+1)%(parseInt($numElemRow)) == 0) {
				$($kao_element.selector.selector+'[data-id="'+val+'"]')
					.css({ scale:1,opacity:1,translate: getPos(i), left:0})
					.addClass('rElem')
					.delay($kao_element.time_effect)
					.queue(function() {
						$(this).css({left:'auto'}).dequeue();
					});
			} else /*if not */{
				$($kao_element.selector.selector+'[data-id="'+val+'"]')
					.css({ scale:1,opacity:1,translate: getPos(i), left:0})
					.delay($kao_element.time_effect)
					.queue(function() {
						$(this).removeClass('rElem').dequeue();
					});
			}

			$($kao_element.selector.selector+'[data-id="'+val+'"]').setSavedPos(getPos(i));
		}
		
		$kao_element.last_pos = getPos(i);
	}

	//The element which calls the function will be extended
	//scroll -> Boolean argument: Enable or disable the scrolling which points to the element which is being extended
	$.fn.extend = function() {
		//Always collapsing before extend
		collapse(this);
		$this = this;
		//Adding the tag to the elements which are going to be expended
		$this.tagElements();
		//Increasing the width of the element
		$this.width($this.getDoubleWidth());
		//Pushing other elements
		$this.pushing();
		//Scrolling if is enabled
		if ($kao_element.scroll) {
			$('html,body').animate({scrollTop: parseInt($this.getPos_y())+parseInt($kao_container.selector.offset().top)}, $kao_element.time_effect);
		}
	}

	function extendAll(elements) {
		$kao_element.selector.width($this.getDoubleWidth());
		$kao_element.selector.tagElements(elements);
	}

	$.fn.collapse = function(){
		collapse(this);
	}

	function collapse(elem) {
		add_effect(elem);
		$kao_element.selector.each(function(){
			$(this).restartToSavedPos();
			$(this).unTagElements();
			$(this).width($kao_element.width);

		});
		
	}

	$.fn.unTagElements = function() {
		$this = this;
		if ($kao_element.subelems_to_expand){
			$($kao_element.subelems_to_expand,$this).removeClass('large');
		}
		$this.removeClass('large');
	}

	$.fn.tagElements = function() {
		$this = this;
		if ($kao_element.subelems_to_expand){
			$($kao_element.subelems_to_expand,$this).addClass('large');
		}
		$this.addClass('large'); 		
	}

	function applyRight($elem){
		/*$elem
			.css({ left:0})
			.addClass('rElem')
			.stop()
			.delay($kao_element.time_effect)
			.queue(function(){
				resizingContainer();
				$(this).css({left:'auto'}).dequeue();
		});*/

		$elem
			.css({ left:0})
			.stop()
			.addClass('rElem')
			.delay($kao_element.time_effect)
			.queue(function() {
				$(this).css({left:'auto'}).dequeue();
				//resizingContainer();
			});

	}

	function applyLeft($elem){
		/*$elem
			.css({ left:0})
			.removeClass('rElem')
			.stop()
			.delay($kao_element.time_effect)
			.queue(function() {
				resizingContainer();
				$(this).dequeue();
		});*/

		$elem
			.css({left:0})
			.stop()
			.delay($kao_element.time_effect)
			.queue(function() {
				$(this).removeClass('rElem').dequeue();
				//resizingContainer();

			});
	}

	function initialize() {
		$numElemRow = "";
		var varRPos = $kao_element.oWidth - $kao_element.width + parseInt($kao_element.selector.css("border-right-width"));
		var x=0, y=0, i=0,
		x_var = $kao_element.oWidth + ($kao_element.oWidth-$kao_element.width)/2,
		y_var = parseInt($kao_element.selector.css('marginBottom')) + parseInt($kao_element.selector.css('marginTop')) + $kao_element.oHeight;

		setXVar(x_var);
		setYVar(y_var);
		var nRow = 0;
		$kao_element.selector.each(function(){
			nRow++;
			$(this).attr('data-id',$kao_element.cells[i] = i++);
			(x+x_var <= $kao_container.width)?((x+x_var == $kao_container.width)?(
					setNumElemRow(nRow-1),
					applyRight($(this)),
					rPos = x
				):applyLeft($(this))):(
				setNumElemRow(nRow-1),
				applyRight($(this).prev()),
				applyLeft($(this)),
				y+=y_var,
				rPos = x,
				x=0);
			$(this).css({ translate: [x, y] })
			x+=x_var;
			$(this).savePos();
			$(this).savePosIni();
		});
		
		(x+x_var > $kao_container.width)?(x=0,y+=y_var,applyRight($kao_element.selector.last())):null;
		$kao_element.next_last_pos = [x,y];
		$kao_element.last_pos = $kao_element.next_last_pos;
		$('.rElem').cssRule('right:'+parseInt($kao_container.width-$kao_element.oWidth)+'px;');
		refreshPage('ini');
		window.addEventListener("hashchange", refreshPage, false);
	}

	function ini_kao_container(args){
		var _top = (!args.hasOwnProperty('top'))?0:args.offset().top;

		$kao_container = null;

		$kao_container = {
			selector : args,
			width : args.width(),
			top : _top
		}
	}

	function ini_kao_element(args){

		if (args.hasOwnProperty('options')) {
			var timeEff = (!args.options.hasOwnProperty('time_effect_expanding'))?1000:args.options.time_effect_expanding;
			var enabScroll = (!args.options.hasOwnProperty('scroll'))?false:args.options.scroll;
		} else {
			var timeEff = 1000;
			var enabScroll = false; 
		}
		var filt = (!args.hasOwnProperty('filter'))?null:args.filter;
		var act_exp = (!args.hasOwnProperty('action_expand'))?$activate=true:args.action_expand;
		var act_col = (!args.hasOwnProperty('action_collapse'))?args.jqelement.selector:args.action_collapse;
		setWidth(args.jqelement.width());
		setoWidth(args.jqelement.outerWidth());
		setoHeight(args.jqelement.outerHeight());

		$kao_element_back = args;

		$kao_element = null;

		$kao_element = {
			selector : args.jqelement,
			filter : filt,
			action_expand : act_exp,
			action_collapse : act_col,
			width : $width,
			oWidth :  $ouWidth,
			oHeight : $ouHeight,
			max_width : 2*$ouWidth - ($ouWidth-$width)/2,
			cells : new Array(),
			last_pos : new Array(),
			next_last_pos : new Array(),
			subelems_to_expand : args.subelements_toExpand,
			subelems_effects : args.subelements_effects,
			time_effect : timeEff,
			scroll : enabScroll
		}

		//if (!$activate) {
			//FILTER
			if (args.hasOwnProperty('filter')){
				$($kao_element.filter).live('click',function(){
					//$(this).filterElements();
				});
			}

			(args.hasOwnProperty('action_expand'))?$(this).activate_expanding():null;
			if ($kao_element.action_expand != $kao_element.action_collapse) {
				$($kao_element.action_collapse).live('click', function(e){
					($(this).is($kao_element.selector.selector))?$(this).collapse():$(this).parents($kao_element.selector.selector).collapse();
					resizingContainer();
				});
			}
			$activate = true;
		//}
	}

	$.fn.activate_expanding = function() {
		$($kao_element.action_expand).unbind().bind('click', function(e){
			e.stopPropagation();
			($(this).is($kao_element.selector.selector))?(
				($(this).hasClass('large'))?$(this).collapse():$(this).extend()
				):(
				(
					$(this).parents($kao_element.selector.selector).hasClass('large'))?
				$(this).parents($kao_element.selector.selector).collapse():
				$(this).parents($kao_element.selector.selector).extend()
				);
				resizingContainer();
			});
	}

	function resizeContainer(){
		$kao_container.selector.css({'height' : parseInt($kao_element.selector.last().offset().top + $kao_element.oHeight-$kao_element.selector.first().offset().top)+'px'});
	}

	function resizingContainer(){
		setTimeout(resizeContainer,1000);
	}

	$.fn.kao = function(args) {
		$numElemRow = "";
		$x_var = null;
		$y_var = null;
		$width = null;
		$ouWidth = null;
		$ouHeight = null;
		var $activate = false;
		if (!args) {
			console.log('Missing element/s in arguments on Kao');
			return false;
		}
		$this = this;
		ini_kao_container($this);
		ini_kao_element(args);
		initialize();
		resizingContainer();
	}

	//RESPONSIVENESS
	$(window).bind('resize', function() {
		$kao_container.selector.kao($kao_element_back);
		resizingContainer();
		collapse();
	});

})( window, jQuery );