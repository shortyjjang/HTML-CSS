jQuery(function($){
    var roomlist = [], roomscache = {};

    $('#sidebar .hotel')
        .on('click', '.sell', function(event){
            event.preventDefault();

            var $this = $(this), ntid = $this.attr('ntid'), ntoid = $this.attr('ntoid'), login_require = $this.attr('require_login');

            if (login_require && login_require === 'true') return require_login();
            location.href='/sales/create?ntid='+ ntid +'&ntoid='+ntoid;
        })
        .find('div.calendar')
            .datepicker({dateFormat : 'MM d, yy', showOtherMonths: true, selectOtherMonths: true})
            .eq(0)
                .datepicker('option', 'altField', '#check-in')
                .datepicker('option', 'minDate', 1)
                .datepicker('option', 'onSelect', function(dateText, inst){
                    var nextDate = new Date(inst.selectedYear, inst.selectedMonth, inst.selectedDay);
                    nextDate.setDate(nextDate.getDate()+1);

                    $('#check-out').focus();
                    $('#sidebar div.calendar:eq(1)').datepicker('option', 'minDate', nextDate);
                })
            .end()
            .eq(1)
                .datepicker('option', 'altField', '#check-out')
                .datepicker('option', 'minDate', 2)
                .datepicker('option', 'onSelect', function(e){
                    $(this).closest('dl').find('span').text('Check out');
                    $(this).closest('dl').find('input').show();
                    $(this).closest('fieldset').find("dl.people dt").click();
                    $('.btn-check').removeAttr('disabled');
                })
            .end()
        .end()
        .find('dl.calendar .stit').click(function() {
            $(this).find('input').focus();
        }).end()
        .find('dl.calendar input')
            .attr('readonly', true)
            .on('focus', function(){
                $('dl.calendar').removeClass('on');
                $(this).closest('dl').addClass('on');
            })
        .end()
        .find('dl.people')
            .on('click', 'dt', function(){
                $('dl.calendar').removeClass('on');
                $(this).closest('dl').addClass('on');
            })
            .on('change', 'select', function(){
                var adult = $('#adult-people').val(), child = $('#child-people').val();
                var text = adult+' Adult'+(adult>1?'s':'')+', '+child+((child>1 || child === 0)?' Children':' Child');

                $('#sidebar dl.people dt').text(text);
                $(this).prev().find("span.selectBox-label").text( $(this).val() );
            })
        .end()
        .on('click', '.btn-check', function(){
            if($(this).attr('require_login') !== undefined) return require_login();
            if($(this).hasClass('loading')) return;

            $(this).addClass('loading');

            // check avail rooms
            var params = {
                hotelId       : $(this).attr('data-hotel-id'),
                arrivalDate   : $('#check-in').val(),
                departureDate : $('#check-out').val(),
                csrfmiddlewaretoken : window.options.csrfmiddlewaretoken
            };

            var adult = $('#adult-people').val();
            var child = '';

            for(var i=0;i<$('#child-people').val();i++) {
                child +=",10";
            }

            params.rooms = adult + child;

            $.ajax({
                type     : 'post',
                url      : '/ean/hotel/rooms/',
                data     : params,
                cache    : false,
                dataType : 'json',
                success  : function(json){
                    var ean_error = json.EanWsError;
                    var $listUl = $('<ul class="data-list after"></ul>');

                    if (ean_error === null || ean_error === undefined) {

                        roomscache.arrivalDate = json.arrivalDate;
                        roomscache.departureDate = json.departureDate;
                        roomscache.rooms = params.rooms;

                        for (var i=0,c=json.roomlist.length; i < c; i++) {
                            var $li = $('<li></li>');
                            room = json.roomlist[i];
                            roomlist.push(room);

                            var nightly_detail = "";
                            var tax_detail = "";
                            var price, description, long_description;

                            if (room.supplierType == 'E') {
                                if (room.nightlyrates) {
                                    nightly_detail = '$' + parseFloat(room.nightlyrates[0].rate).toFixed(2) + '/night';
                                }
                                price = room.chargeable.total;
                                description = room.RoomType.description;
                                long_description = room.RoomType.descriptionLong;
                            } else {
                                price = room.chargeable.maxNightlyRate;
                                description = room.roomTypeDescription;
                                long_description = "";
                            }

                            $li
                                .append(
                                    $('<span></span>')
                                        .addClass('type')
                                        .append($('<b></b>').html( $('<span/>').html(description).text() + ((room.nonRefundable === true) ? "<br/>* Non Refundable" : "")))
                                )
                                .append(
                                    $('<span></span>')
                                        .addClass('price')
                                        .text(nightly_detail)
                                )
                                .append(
                                    $('<span></span>')
                                        .addClass('total')
                                        .append($('<b></b>').text("$" + parseFloat(price).toFixed(2)))
                                )
                                .append(
                                    $('<span rowspan="2"></span>')
                                        .addClass('button')
                                        .append($('<button type="button"></button>')
                                            .addClass('btns-green-embo')
                                            .addClass('btn-bookit')
                                            .text('Book Now')
                                            .attr('data-index', i+1)
                                            .attr('data-hotel-id', params.hotelId)
                                        )
                                )
                                .append(
                                    $('<div></div>')
                                        .addClass('description')
                                        .html(long_description)
                                );

                            $listUl.append($li);
                        }
						showResult($listUl);
                    } else {
						alertify.alert(ean_error.presentationMessage);
                    }
                },
                error : function(jqXHR, status, error) {
                    alertify.alert('An error occurred during request data.');
                },
                complete : function() {
                    $('.btn-check').removeClass('loading').end();
                }
            });

            return false;
        })
        .end();

    function showResult(html) {
        $('.popup.booking-result').find('.data-list').remove();
        $('.popup.booking-result').find('.data-head').after(html);
        $.dialog("booking-result").open();
    }

    $('#sidebar .description .more').click(function(e) {
        e.preventDefault();
        $(this).closest('.description').addClass('show');
    });

    $('.popup.booking-result').on('click', 'button.btn-bookit', function(e){
        var idx = $(this).data('index');
        var room = roomlist[idx-1];

        var params = {
            hotelId  : $(this).attr('data-hotel-id'),
            rateCode : room.rateCode,
        };

        for(var name in roomscache) {
            params[name] = roomscache[name];
        }

        var query = '';
        for(var name in params) {
            query += '&'+name+'='+params[name];
        }

        if(query) query = query.substr(1);
        location.href = 'https://'+location.host+'/ean/hotel/book/?'+query;
    });
});