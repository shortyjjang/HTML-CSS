$(function(){

	// Multifunctional method to get and set values of a collection
	// The value/s can optionally be executed if it's a function
	var access = jQuery.access = function( elems, fn, key, value, chainable, emptyGet, raw ) {
		var i = 0,
			length = elems.length,
			bulk = key == null;

		// Sets many values
		if ( jQuery.type( key ) === "object" ) {
			chainable = true;
			for ( i in key ) {
				jQuery.access( elems, fn, i, key[i], true, emptyGet, raw );
			}

		// Sets one value
		} else if ( value !== undefined ) {
			chainable = true;

			if ( !jQuery.isFunction( value ) ) {
				raw = true;
			}

			if ( bulk ) {
				// Bulk operations run against the entire set
				if ( raw ) {
					fn.call( elems, value );
					fn = null;

				// ...except when executing function values
				} else {
					bulk = fn;
					fn = function( elem, key, value ) {
						return bulk.call( jQuery( elem ), value );
					};
				}
			}

			if ( fn ) {
				for ( ; i < length; i++ ) {
					fn( elems[i], key, raw ? value : value.call( elems[i], i, fn( elems[i], key ) ) );
				}
			}
		}

		return chainable ?
			elems :

			// Gets
			bulk ?
				fn.call( elems ) :
				length ? fn( elems[0], key ) : emptyGet;
	};
	// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
	jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
		jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name }, function( defaultExtra, funcName ) {
			// margin is only for outerHeight, outerWidth
			jQuery.fn[ funcName ] = function( margin, value ) {
				var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
					extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

				return access( this, function( elem, type, value ) {
					var doc;

					if ( jQuery.isWindow( elem ) ) {
						// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
						// isn't a whole lot we can do. See pull request at this URL for discussion:
						// https://github.com/jquery/jquery/pull/764
						return elem.document.documentElement[ "client" + name ];
					}

					// Get document width or height
					if ( elem.nodeType === 9 ) {
						doc = elem.documentElement;

						// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height], whichever is greatest
						// unfortunately, this causes bug #3838 in IE6/8 only, but there is currently no good, small way to fix it.
						return Math.max(
							elem.body[ "scroll" + name ], doc[ "scroll" + name ],
							elem.body[ "offset" + name ], doc[ "offset" + name ],
							doc[ "client" + name ]
						);
					}

					return value === undefined ?
						// Get width or height on the element, requesting but not forcing parseFloat
						jQuery.css( elem, type, extra ) :

						// Set width or height on the element
						jQuery.style( elem, type, value, extra );
				}, type, chainable ? margin : undefined, chainable, null );
			};
		});
	});

	var stepValue1 = {10:1, 100:5, 600:50, 3500:100, 25000:500};	
	var stepValue3p = {10:1, 100:10, 600:50, 2500:100};
	var stepValue3ft3 = {10:1, 100:10, 1000:100, 10000:1000, 160000:10000};
	var stepValue3m3 = {10:1, 100:10, 1000:50, 4500:100};
	var stepValue3 = stepValue3p;
	var stepValue4 = {50:1, 350:10, 1350:50};
	var volumnUnit = 'p';

	function maxStep(step){
		var sum = 0;
		var prevStep = 0;
		for(var k in step){
			k = parseInt(k);
			prevStep += (k-sum)/step[k];
			sum = k;			
		} 
		return prevStep;
	}
	function convertValue(step, v){
		var sum = 0;
		var prevStep = 0;
		for(var k in step){
			k = parseInt(k);
			var v2 = sum + (v-prevStep)*step[k];
			if( v2<=k ){
				return v2;
			}
			prevStep += (k-sum)/step[k];
			sum = k;			
		}
	}
	function closestStep(step, v){
		var sum = 0;
		var prevStep = 0;
		for(var k in step){
			k = parseInt(k);
			if( v<=k ){
				var remain = v-sum;				
				var valueStep = prevStep + Math.ceil(remain/step[k]);
			
				return valueStep;
			}
			prevStep += (k-sum)/step[k];
			sum = k;			
		}
		return maxStep(step);
	}

	function fnChangeProcesser1(event, ui){
		var max = maxStep(stepValue1);
		var v = ui.value;
		var v2 = convertValue(stepValue1, v);
		$( this).closest('.graph').find('.amount1').find('small').css('left', (v/max*100)+'%').text(v2);
		if (ui.value == max) {$( this).closest('.graph').find('.amount1').hide().end().find('div.tooltip').show();
		}else{$( this).closest('.graph').find('.amount1').show().end().find('div.tooltip').hide();}
		if($( ".popup.warehouse-pricing .processer1" ).slider('option',"value")!=v){
			$( ".popup.warehouse-pricing .processer1" ).slider('option',"value",v);
		}
		updateOverview();
	}

	function fnChangeProcesser2(event, ui){
		$( this).closest('.graph').find('.amount2').find('small').css('left',((ui.value-10)*10)/19+'%').text( (ui.value/10).toFixed(1) ) ;
		if($( ".popup.warehouse-pricing .processer2" ).slider('option',"value")!=ui.value){
			$( ".popup.warehouse-pricing .processer2" ).slider('option',"value",ui.value);
		}
		updateOverview();
	}

	function fnChangeProcesser3(event, ui){
		var max = maxStep(stepValue3);
		var v = ui.value;
		var v2 = convertValue(stepValue3, v);
		$( this).closest('.graph').find('.amount3').find('small').css('left', (v/max*100)+'%').text(v2);
		if($( ".popup.warehouse-pricing .processer3" ).slider('option',"value")!=ui.value){
			$( ".popup.warehouse-pricing .processer3" ).slider('option',"value",ui.value);
		}
		updateOverview();
	}

	function fnChangeProcesser4(event, ui){
		var max = maxStep(stepValue4);
		var v = ui.value;
		var v2 = convertValue(stepValue4, v);
		$( this).closest('.graph').find('.amount4').find('small').css('left', (v/max*100-(v/max*100>50?0:1))+'%').text(v2);
		if($( ".popup.warehouse-pricing .processer4" ).slider('option',"value")!=ui.value){
			$( ".popup.warehouse-pricing .processer4" ).slider('option',"value",ui.value);
		}
		updateOverview();
	}

	$( ".popup.warehouse-pricing .processer1" ).slider({
		range: "min",
		value: 0,
		min: 0,
		max: maxStep(stepValue1),
		change: fnChangeProcesser1,
		slide: fnChangeProcesser1
	});

	$( ".popup.warehouse-pricing .processer2" ).slider({
		range: "min",
		value: 10,
		min: 10,
		max: 200,
		change: fnChangeProcesser2,
		slide: fnChangeProcesser2
	});

	$( ".popup.warehouse-pricing .processer3" ).slider({
		range: "min",
		value: 0,
		min: 0,
		max: maxStep(stepValue3),
		change: fnChangeProcesser3,
		slide: fnChangeProcesser3
	});

	$( ".popup.warehouse-pricing .processer4" ).slider({
		range: "min",
		value: 1,
		min: 1,
		max: maxStep(stepValue4),
		change: fnChangeProcesser4,
		slide: fnChangeProcesser4
	});

	// trigger change event to initialize the state
	$('.popup.warehouse-pricing .processer').each(function(){
		var $slider = $(this), value = $slider.slider('option', 'value');
		$slider.slider('option', 'value', value);
	});

	$("ul.type li a").click(function(e){
		e.preventDefault();
		var prevType = "p";
		if( $("ul.type li a.current").hasClass("ft3")) prevType = "ft3";
		if( $("ul.type li a.current").hasClass("m3")) prevType = "m3";

		var $el = $(e.currentTarget);
		$el.closest('.type').find('a').removeClass('current');
		$el.addClass('current');
		var type = "p";
		if( $el.hasClass("ft3")) type = "ft3";
		if( $el.hasClass("m3")) type = "m3";

		if(prevType == type) return;

		var val = convertValue(stepValue3, $( ".popup.warehouse-pricing .processer3" ).slider('option',"value") );
		if(prevType == "ft3") val = val / 64;
		else if(prevType == "m3") val = val / 1.812278;

		switch(type){
			case "p":
				stepValue3 = stepValue3p;
				$(".storage span.max:eq(0)").html("2,500+");
                $('ol.switch li.num2 .matrix').text('Pallets');
				break;
			case "ft3":
				stepValue3 = stepValue3ft3;
				val = val * 64;
				$(".storage span.max:eq(0)").html("160,000+");
                $('ol.switch li.num2 .matrix').text('ft³');
				break;
			case "m3":
				stepValue3 = stepValue3m3;
				val = val * 1.812278;
				$(".storage span.max:eq(0)").html("4,500+");
                $('ol.switch li.num2 .matrix').text('m³');
				break;
		}
		$( ".popup.warehouse-pricing .processer3" ).slider("option","max", maxStep(stepValue3) );
		$( ".popup.warehouse-pricing .processer3" ).slider("option","value", closestStep(stepValue3, val) );
	});

    var small_box_inch = '6” W x 6” L x 6” H';
    var med_box_inch = '12” W x 8” L x 8” H';
    var lg_box_inch = '24” W x 12” L x 12” H';
    var small_box_cm = '15cm x 15cm x 15cm';
    var med_box_cm = '30cm x 20cm x 20cm';
    var lg_box_cm = '60cm x 30cm x 30cm';

    $("ul.type.after a.inch").click(function(e){
        $("ul.type.after a.cm").removeClass('current');
        $("ul.type.after a.inch").addClass('current');

        $("ul.after.boxes li.s .size").text(small_box_inch);
        $("ul.after.boxes li.m .size").text(med_box_inch);
        $("ul.after.boxes li.l .size").text(lg_box_inch);
    });

    $("ul.type.after a.cm").click(function(e){
        $("ul.type.after a.inch").removeClass('current');
        $("ul.type.after a.cm").addClass('current');

        $("ul.after.boxes li.s .size").text(small_box_cm);
        $("ul.after.boxes li.m .size").text(med_box_cm);
        $("ul.after.boxes li.l .size").text(lg_box_cm);
    });

    $("ul.after.boxes input").change(function(e){
        var total_w = 0, total_l = 0, total_h = 0;
        var num_pallet = 0;
        var num_s = $("ul.after.boxes li.s input").val();
        var num_m = $("ul.after.boxes li.m input").val();
        var num_l = $("ul.after.boxes li.l input").val();

        total_w = 6*num_s + 12*num_m + 24*num_l;
        total_l = 6*num_s + 8*num_m + 12*num_l;
        total_h = 6*num_s + 8*num_m + 12*num_l;

        num_pallet = total_w / 48.0 > total_l / 48.0 ? total_w / 48.0 : total_l /48.0;
        num_pallet = num_pallet > total_h / 48.0 ? num_pallet : total_h /48.0;

        $("p.amount input").val(Math.ceil(num_pallet));
    });

    $("button.btn-continue").click(function(e){
        $('.warehouse-pricing .storing-size').hide();
		$("ul.type li a.pallets").trigger("click");
		var pallets = parseInt($("p.amount input").val());
		var step = closestStep(stepValue3, pallets);		

		$( ".popup.warehouse-pricing .processer3" ).slider('option',"value", step);
    });


	function updateOverview(){
		var orderPerMonth = convertValue(stepValue1, $( ".popup.warehouse-pricing .processer1" ).slider('option',"value") );
		$(".switch li:eq(0) b").html(orderPerMonth);

		var vFactor = 1;
		if(orderPerMonth<=1000) vFactor = 1.16;
		else if(orderPerMonth<=5000) vFactor = 1.13;
		else if(orderPerMonth<=15000) vFactor = 1.1;
		else vFactor = 1.07;

		var avgPerOrder = $( ".popup.warehouse-pricing .processer2" ).slider('option',"value")/10;
		var volume = convertValue(stepValue3, $( ".popup.warehouse-pricing .processer3" ).slider('option',"value"));
		var pallets = volume;
		if( $("ul.type li a.current").hasClass("ft3")) pallets = pallets/64;
		if( $("ul.type li a.current").hasClass("m3")) pallets = pallets/1.812278;

		var sku = convertValue(stepValue4, $( ".popup.warehouse-pricing .processer4" ).slider('option',"value") );
		$(".switch li:eq(1) b:eq(0)").html( volume );
		$(".switch li:eq(1) b:eq(1)").html( sku );

		var inbound = 0.6 * vFactor * orderPerMonth * 1.15;
		var outboundShipped = orderPerMonth * 1.08;
		var outboundAdditional = 0;
		if(orderPerMonth * avgPerOrder - orderPerMonth > 0){
			outboundAdditional = 0.4 * vFactor * (orderPerMonth * avgPerOrder - orderPerMonth);
		}
		var warehousinglocation = orderPerMonth>0? (sku * 1 + (orderPerMonth* 1.15)/20)*0.55*vFactor : 0 ;
		var warehousingpallet = pallets * 3 * vFactor;

		var handling = inbound + outboundShipped + outboundAdditional;
		var handlingPerOrder = handling / orderPerMonth;
		var handlingPerItem = handling / orderPerMonth / avgPerOrder;
		var storage = warehousingpallet + warehousinglocation;

		var total = handling + storage;

		$("._handling").html(numeral(handling.toString()).format("$0,0.00"));
		$("._avg_per_order").html(numeral(handlingPerOrder.toString()).format("$0,0.00"));
		$("._avg_per_item").html(numeral(handlingPerItem.toString()).format("$0,0.00"));
		$("._storage").html(numeral(storage.toString()).format("$0,0.00"));
		$("._total").html(numeral(total.toString()).format("$0,0.00"));
	}

	updateOverview();

});
