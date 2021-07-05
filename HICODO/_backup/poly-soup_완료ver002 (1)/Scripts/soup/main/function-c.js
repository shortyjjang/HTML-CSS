var $timer = 300;
var $couponFullNumb = '';
$(document).ready(function(){

    var sTop = $(window).scrollTop();

    polysoupIncludeHTML();
    polysoupLocationBtn();
    polysoupHeaderEvents();
    polysoupMNavEvents();
    polysouplnbToggle();
    polysoupLnbItemToggle();
    polysoupLayerGuideInset();
    polysoupBbsLikeControl();
    polysoupListItemSetting();
    polysoupCouponSubmitEvent();
    polysoupLearningTopResponsive()
    $(window).resize(function(){
        polysoupLearningTopResponsive();
    })
});
function polysoupIncludeHTML(){
    $('#ps_rev_header').load('./header.html');
    $('#ps_rev_footer').load('./footer.html');
    //$('.ps_rev_pagination').load('./pagination.html');
}
function polysoupLocationBtn(){
    $('.ps_rev_location-p_soup_btn').append('<i class="location-arrow"></i>')
}
function polysoupHeaderEvents(){
    scrollTopChk();
    $(window).resize(function(){
        scrollTopChk();
    })
    $(window).scroll(function(){
        scrollTopChk();
    })
}
function polysoupMNavEvents(){
    $(document).on('click','.ps_rev_m-nav-p_soup_btn',function(){
        if($(this).hasClass('off')){
            cursorDisabled(this);
            delayClassAdd(this,'on');
            $(this).removeClass('off');
            $('.ps_rev_m-menu-overlay').stop().slideDown(600);
            $('html,body').addClass('hidden');
            $('#ps_rev_header .ps_rev_logo').stop().fadeOut(300);
            $('#ps_rev_header .ps_rev_header-right').stop().delay(300).fadeIn(300);
        }else{
            cursorDisabled(this);
            delayClassAdd(this,'off');
            $(this).removeClass('on');
            $('.ps_rev_m-menu-overlay').stop().slideUp(600);
            $('html,body').removeClass('hidden');
            $('#ps_rev_header .ps_rev_header-right').stop().fadeOut(300);
            $('#ps_rev_header .ps_rev_logo').stop().delay(300).fadeIn(300);
        }
    })
    $(window).resize(function(){
        if($(window).innerWidth() > 1200){
            cursorDisabled('.ps_rev_m-nav-p_soup_btn');
            delayClassAdd('.ps_rev_m-nav-p_soup_btn','off');
            $('.ps_rev_m-nav-p_soup_btn').removeClass('on');
            $('.ps_rev_m-menu-overlay').stop().slideUp(600);
            $('html,body').removeClass('hidden');
            // $('#ps_rev_header .ps_rev_header-right').stop().fadeIn(300);
            $('#ps_rev_header .ps_rev_header-right').attr('style','');
            // $('#ps_rev_header .ps_rev_logo').stop().delay(300).fadeIn(300);
            $('#ps_rev_header .ps_rev_logo').attr('style','');
        }
    })
}
function delayClassRemove($method, $class){
    setTimeout(function(){
        $($method).removeClass($class);
    },$timer)
}
function delayClassAdd($method, $class){
    setTimeout(function(){
        $($method).addClass($class);
    },$timer)
}
function cursorDisabled($method){
    $($method).css({pointerEvents:'none'});
    setTimeout(function(){
        $($method).css({pointerEvents:'auto'});
    },$timer)
}
function scrollTopChk(){
    sTop = $(window).scrollTop();
    if(sTop > 30){
        $('#ps_rev_header').addClass('scrolled');
    }else{
        $('#ps_rev_header').removeClass('scrolled');
    };
}
function polysouplnbToggle(){
    const lnbp_soup_btn = $('.ps_rev_lnb-head-p_soup_btn');
    const lnbOverlay = $('.ps_rev_lnb-layout');
    const lnbClass = 'left-in';
    lnbp_soup_btn.click(function(){
        console.log(lnbClass);
        if(lnbOverlay.hasClass(lnbClass)){
            lnbOverlay.removeClass(lnbClass);
            lnbp_soup_btn.find('.p_soup_btn-txt').stop().slideDown(300);
        }else{
            lnbOverlay.addClass(lnbClass);
            lnbp_soup_btn.find('.p_soup_btn-txt').stop().slideUp(300);
        }
    })
}
function polysoupLnbItemToggle(){
    const lnbItemp_soup_btn = $('.ps_rev_lnb-list-items .ps_rev_item-dropdown');
    const lnbItemContent = $('.ps_rev_lnb-list-items .ps_rev_dropdown-items');
    lnbItemp_soup_btn.click(function(){
        lnbItemContent.stop().slideUp();
        $('.ps_rev_item-fold').removeClass('on');
        if(!$(this).siblings(lnbItemContent).is(':visible')){
            $timer = 300;
            for(var i=0; i<$(this).siblings(lnbItemContent).find('a').length; i++){
                if((i*30) >= $timer && (i*30) < 1000){
                    $timer = i*30;
                }
            }
            $(this).siblings(lnbItemContent).stop().slideDown($timer);
            $(this).parents('.ps_rev_item-fold').addClass('on');
        }
    })
}
function polysoupLayerGuideInset(){
    $('.ps_rev_content-flex-box .top-p_soup_btn').click(function(){
        var $thisLeft = $(this).offset().left;
        var parentLeft = $(this).parents('.ps_rev_content-top').offset().left;
        var thisGuide = $('.ps_rev_layer-guide-popup').eq($(this).parents().index())
        $('.ps_rev_layer-guide-popup').stop().slideUp(300);
        console.log($thisLeft - parentLeft, $(this).outerWidth());
        if(!thisGuide.is(':visible')){
            thisGuide.stop().slideDown(300);
            /*if($(window).innerWidth() < $thisLeft - parentLeft + thisGuide.outerWidth()){
                thisGuide.css({
                    left:$thisLeft - parentLeft + $(this).outerWidth() - thisGuide.outerWidth(),
                    right:'auto'
                })
            }else{
                thisGuide.css({
                    left:$thisLeft - parentLeft,
                    right:'auto'
                })
            }*/
            
            thisGuide.css({
                left:$thisLeft - parentLeft + $(this).outerWidth() - thisGuide.outerWidth(),
                right:'auto'
            })
        }
    })
}
function polysoupBbsLikeControl(){
    const likep_soup_btn = $('.ps_rev_item-like');
    const offImg = './Content/images/soup/icon/ico-like-off.png';
    const onImg = './Content/images/soup/icon/ico-like-on.png';
    $(document).on('click','.ps_rev_item-like',function(){
        if($(this).find('img').attr('src') == offImg){
            $(this).find('img').attr('src',onImg);
        }else{
            $(this).find('img').attr('src',offImg);
        };
    });
};
function popupAppend(x){
    var popupInn = [
                        '<p class="p_soup_popup-title">회원가입 완료</p>'+
                        '<p class="p_soup_popup-txt"><span>원활한 서비스이용을 위해 이메일 인증이 필요합니다.</span> <span>아래 버튼을 눌러 이메일 가입인증을 마무리 하여주세요.</span></p>'+
                        '<div class="popup-p_soup_btn-group">'+
                        '    <button class="p_soup_btn ps_rev_p_soup_btn-radius p_soup_btn-fit" type="button" onclick="popupAppend(1);">이메일 인증하기</button>'+
                        '</div>'
                        ,
                        '<p class="p_soup_popup-title">인증 등록 이메일</p>'+
                        '<p class="p_soup_popup-txt"><span>회원가입 후 인증 할 E-MAIL 주소를 입력해 주세요.</span> <span>해당 메일로 인증 코드를 보내드립니다.</span></p>'+
                        '<div class="p_soup_popup-email"><input type="text" name="email1" class="ps_rev_input-c"><span>@</span><input type="text" name="email2" class="ps_rev_input-c"><select name="email-select" class="ps_rev_input-c"><option val="">직접입력</option><option val="naver.com">naver.com</option><option val="kakao.com">kakao.com</option><option val="nate.com">nate.com</option></select></div>'+
                        '<div class="popup-p_soup_btn-group">'+
                        '    <button class="p_soup_btn ps_rev_p_soup_btn-radius p_soup_btn-def p_soup_btn-fit" type="button" onclick="popupAppend(2);">이메일 인증</button><button class="p_soup_btn ps_rev_p_soup_btn-radius p_soup_btn-fit" type="button" onclick="popupAppend(2);">이메일 인증하기</button>'+
                        '</div>'
                        ,
                        '<p class="p_soup_popup-title">입력하신 이메일이 맞습니까?</p>'+
                        '<div class="p_soup_popup-email"><input type="text" name="email-ps_rev_submit-input" class="ps_rev_input-c ps_rev_text-center"></div>'+
                        '<div class="popup-p_soup_btn-group">'+
                        '    <button class="p_soup_btn ps_rev_p_soup_btn-radius p_soup_btn-def p_soup_btn-fit" type="button" onclick="popupAppend(1);">NO</button><button class="p_soup_btn ps_rev_p_soup_btn-radius p_soup_btn-fit" type="button" onclick="popupAppend(3);">YES</button>'+
                        '</div>'
                        ,
                        '<p class="p_soup_popup-title">이메일 등록이 완료되었습니다.</p>'+
                        '<p class="p_soup_popup-txt"><span>입력하신 이메일로 발송된 인증 메일의 링크를</span> <span>클릭하시면 이메일 인증이 완료됩니다.</span></p>'+
                        '<div class="popup-p_soup_btn-group">'+
                        '    <button class="p_soup_btn ps_rev_p_soup_btn-radius p_soup_btn-fit" type="button" onclick="popupRemove();">OK</button>'+
                        '</div>'
                        ,
                        '<p class="p_soup_popup-title">아이디 찾기</p>'+
                        '<p class="p_soup_popup-txt"><span>회원가입 후 인증 할 E-MAIL 주소를 입력해주세요.</span> <span>해당 메일로 인증 코드를 보내드립니다.</span></p>'+
                        '<div class="p_soup_popup-email"><input type="text" name="email1" class="ps_rev_input-c"><span>@</span><input type="text" name="email2" class="ps_rev_input-c"><select name="email-select" class="ps_rev_input-c"><option val="">직접입력</option><option val="naver.com">naver.com</option><option val="kakao.com">kakao.com</option><option val="nate.com">nate.com</option></select></div>'+
                        '<div class="popup-p_soup_btn-group">'+
                        '    <button class="p_soup_btn ps_rev_p_soup_btn-radius p_soup_btn-fit" type="button" onclick="popupAppend(5);">다음단계</button>'+
                        '</div>'
                        ,
                        '<p class="p_soup_popup-title">이메일 등록 인증을 하지 않아 아이디를 찾을 수 없습니다.</p>'+
                        '<p class="p_soup_popup-txt"><span>아래 버튼 메일로 문의 해주세요.</span></p>'+
                        '<div class="popup-p_soup_btn-group">'+
                        '    <button class="p_soup_btn ps_rev_p_soup_btn-radius p_soup_btn-fit" type="button" onclick="popupAppend(6);">관리자 문의</button>'+
                        '</div>'
                        ,
                        '<p class="p_soup_popup-title">해당 이메일의 사용자가 없습니다.</p>'+
                        '<div class="p_soup_popup-email"><input type="text" name="email-ps_rev_submit-input" class="ps_rev_input-c ps_rev_text-center"></div>'+
                        '<div class="popup-p_soup_btn-group">'+
                        '    <button class="p_soup_btn ps_rev_p_soup_btn-radius p_soup_btn-fit" type="button" onclick="popupRemove();">닫기</button>'+
                        '</div>'
                        ,
                        '<p class="p_soup_popup-title">비밀번호 찾기</p>'+
                        '<p class="p_soup_popup-txt"><span>이메일 등록 인증하신 메일주소로 아이디의 비밀번호를 변경 할 수 있는 링크를 보내드립니다.</span></p>'+
                        '<div class="p_soup_popup-email"><input type="text" name="find-password" name="email-ps_rev_submit-input" class="ps_rev_input-c ps_rev_text-center" placeholder="아이디 입력"></div>'+
                        '<div class="popup-p_soup_btn-group">'+
                        '    <button class="p_soup_btn ps_rev_p_soup_btn-radius p_soup_btn-def p_soup_btn-fit" type="button" onclick="popupAppend(8);">이메일 인증</button><button class="p_soup_btn ps_rev_p_soup_btn-radius p_soup_btn-fit" type="button" onclick="popupAppend(8);">다음단계</button>'+
                        '</div>'
                        ,
                        '<p class="p_soup_popup-title">비밀번호 메일발송 완료</p>'+
                        '<p class="p_soup_popup-txt"><span>관련 정보가 메일로 발송되었습니다.</span> <span>받은 메일함을 확인해주시기 바랍니다.</span> <span>(스팸 메일로 자동 분류 될 수 있으므로 전체 메일 확인 필요)</span></p>'+
                        '<div class="popup-p_soup_btn-group">'+
                        '    <button class="p_soup_btn ps_rev_p_soup_btn-radius p_soup_btn-fit" type="button" onclick="popupRemove();">닫기</button>'+
                        '</div>'
                        ,
                        '<p class="p_soup_popup-title">프로젝트를 전달하시겠습니까?</p>'+
                        '<p class="p_soup_popup-txt"><span>이미 인증에 사용된 경로 또는 인증의 유효기간이 지났습니다.</span> <span>마이페이지 이메일 인증 상태를 확인해 주세요.</span></p>'+
                        '<div class="p_soup_popup-input-row">'+
                        '   <span class="p_soup_input-label">전달받는 아이디</span>'+
                        '   <input type="text" class="ps_rev_input-c p_soup_account-stackup-input-bar">'+
                        '   <button class="p_soup_input-btn p_soup_account-stackup-button" type="button">추가</button>'+
                        '</div>'+
                        '<div class="p_soup_popup-input-row">'+
                        '   <span class="p_soup_input-label">프로젝트 이름</span>'+
                        '   <input type="text" class="ps_rev_input-c">'+
                        '</div>'+
                        '<p class="p_soup_account-stack"></p>'+
                        '<div class="popup-p_soup_btn-group">'+
                        '    <button class="p_soup_btn ps_rev_p_soup_btn-radius p_soup_btn-fit p_soup_btn-def" type="button" onclick="popupRemove();">아니오</button>'+
                        '    <button class="p_soup_btn ps_rev_p_soup_btn-radius p_soup_btn-fit" type="button" onclick="popupAppend(10);">네</button>'+
                        '</div>'
                        ,
                        '<p class="p_soup_popup-title">프로젝트를 전달이 완료되었습니다.</p>'+
                        '<div class="popup-p_soup_btn-group">'+
                        '    <button class="p_soup_btn ps_rev_p_soup_btn-radius p_soup_btn-fit" type="button" onclick="popupRemove();">확인</button>'+
                        '</div>'
                        ,
                        '<p class="p_soup_popup-title">선택한 프로젝트를 삭제하시겠습니까?</p>'+
                        '<div class="popup-p_soup_btn-group">'+
                        '    <button class="p_soup_btn ps_rev_p_soup_btn-radius p_soup_btn-fit p_soup_btn-def" type="button" onclick="popupRemove();">아니오</button>'+
                        '    <button class="p_soup_btn ps_rev_p_soup_btn-radius p_soup_btn-fit" type="button" onclick="popupAppend(12);">네</button>'+
                        '</div>'
                        ,
                        '<p class="p_soup_popup-title">프로젝트가 삭제되었습니다.</p>'+
                        '<div class="popup-p_soup_btn-group">'+
                        '    <button class="p_soup_btn ps_rev_p_soup_btn-radius p_soup_btn-fit" type="button" onclick="popupRemove();">확인</button>'+
                        '</div>'
                        ,
                        '<p class="p_soup_popup-title">프로젝트를 복사하시겠습니까?</p>'+
                        '<p class="p_soup_popup-txt"><span>새로운 프로젝트 이름을 입력해 주세요.</span></p>'+
                        '<div class="p_soup_popup-email"><input type="text" class="ps_rev_input-c ps_rev_text-center"></div>'+
                        '<div class="popup-p_soup_btn-group">'+
                        '    <button class="p_soup_btn ps_rev_p_soup_btn-radius p_soup_btn-fit p_soup_btn-def" type="button" onclick="popupRemove();">아니오</button>'+
                        '    <button class="p_soup_btn ps_rev_p_soup_btn-radius p_soup_btn-fit" type="button" onclick="popupAppend(14);">네</button>'+
                        '</div>'
                        ,
                        '<p class="p_soup_popup-title">프로젝트 복사가 완료되었습니다.</p>'+
                        '<div class="popup-p_soup_btn-group">'+
                        '    <button class="p_soup_btn ps_rev_p_soup_btn-radius p_soup_btn-fit" type="button" onclick="popupRemove();">확인</button>'+
                        '</div>'
                        ,
                        '<p class="p_soup_popup-title">이름을 변경하시겠습니까?</p>'+
                        '<p class="p_soup_popup-txt"><span>새로운 프로젝트 이름을 입력해주세요.</span></p>'+
                        '<div class="p_soup_popup-email"><input type="text" class="ps_rev_input-c ps_rev_text-center"></div>'+
                        '<div class="popup-p_soup_btn-group">'+
                        '    <button class="p_soup_btn ps_rev_p_soup_btn-radius p_soup_btn-fit p_soup_btn-def" type="button" onclick="popupRemove();">아니오</button>'+
                        '    <button class="p_soup_btn ps_rev_p_soup_btn-radius p_soup_btn-fit" type="button" onclick="popupAppend(16);">네</button>'+
                        '</div>'
                        ,
                        '<p class="p_soup_popup-title">이름 수정이 완료되었습니다.</p>'+
                        '<div class="popup-p_soup_btn-group">'+
                        '    <button class="p_soup_btn ps_rev_p_soup_btn-radius p_soup_btn-fit" type="button" onclick="popupRemove();">확인</button>'+
                        '</div>'
                        ,
                        '<p class="p_soup_popup-title">코드내려받기 (허용중)</p>'+
                        '<p class="p_soup_popup-txt"><span>코드 내려받기 여부를 선택하여주세요.</span></p>'+
                        '<div class="p_soup_popup-select-tab-wrap">'+
                        '   <label class="p_soup_radio_wrap-type-tab">'+
                        '       <input type="radio" name="p_soup_content-download-allowed" value="1">'+
                        '       <span class="p_soup_radio-tab-txt">허용</span>'+
                        '   </label>'+
                        '   <label class="p_soup_radio_wrap-type-tab">'+
                        '       <input type="radio" name="p_soup_content-download-allowed" value="0">'+
                        '       <span class="p_soup_radio-tab-txt">불허용</span>'+
                        '   </label>'+
                        '</div>'+
                        '<div class="popup-p_soup_btn-group">'+
                        '    <button class="p_soup_btn ps_rev_p_soup_btn-radius p_soup_btn-fit" type="button" onclick="popupAppend(18);">저장</button>'+
                        '</div>'
                        ,
                        '<p class="p_soup_popup-title">코드내려받기 변경완료</p>'+
                        '<div class="popup-p_soup_btn-group">'+
                        '    <button class="p_soup_btn ps_rev_p_soup_btn-radius p_soup_btn-fit" type="button" onclick="popupRemove();">확인</button>'+
                        '</div>'
                        ,
                        '<p class="p_soup_popup-title">VR추천 (추천중)</p>'+
                        '<p class="p_soup_popup-txt"><span>VR추천 여부를 선택하여주세요.</span></p>'+
                        '<div class="p_soup_popup-select-tab-wrap">'+
                        '   <label class="p_soup_radio_wrap-type-tab">'+
                        '       <input type="radio" name="p_soup_content-vr-content-recommend" value="1">'+
                        '       <span class="p_soup_radio-tab-txt">추천</span>'+
                        '   </label>'+
                        '   <label class="p_soup_radio_wrap-type-tab">'+
                        '       <input type="radio" name="p_soup_content-vr-content-recommend" value="0">'+
                        '       <span class="p_soup_radio-tab-txt">비추천</span>'+
                        '   </label>'+
                        '</div>'+
                        '<div class="popup-p_soup_btn-group">'+
                        '    <button class="p_soup_btn ps_rev_p_soup_btn-radius p_soup_btn-fit" type="button" onclick="popupAppend(20);">저장</button>'+
                        '</div>'
                        ,
                        '<p class="p_soup_popup-title">VR추천 여부 변경원료</p>'+
                        '<div class="popup-p_soup_btn-group">'+
                        '    <button class="p_soup_btn ps_rev_p_soup_btn-radius p_soup_btn-fit" type="button" onclick="popupRemove();">확인</button>'+
                        '</div>'
                        ,
                        '<p class="p_soup_popup-title">설명 수정</p>'+
                        '<p class="p_soup_popup-txt"><span>설명 내용을 입력하여주세요.</span></p>'+
                        '<div class="p_soup_popup-email"><textarea rows="7" class="ps_rev_input-c"></textarea></div>'+
                        '<div class="popup-p_soup_btn-group">'+
                        '    <button class="p_soup_btn ps_rev_p_soup_btn-radius p_soup_btn-fit p_soup_btn-def" type="button" onclick="popupRemove();">취소</button>'+
                        '    <button class="p_soup_btn ps_rev_p_soup_btn-radius p_soup_btn-fit" type="button" onclick="popupAppend(22);">저장</button>'+
                        '</div>'
                        ,
                        '<p class="p_soup_popup-title">설명 수정 완료</p>'+
                        '<div class="popup-p_soup_btn-group">'+
                        '    <button class="p_soup_btn ps_rev_p_soup_btn-radius p_soup_btn-fit" type="button" onclick="popupRemove();">확인</button>'+
                        '</div>'
                        ,
                        '<p class="p_soup_popup-title">분류수정</p>'+
                        '<p class="p_soup_popup-txt"><span>분류를 선택하여주세요.</span></p>'+
                        '<div class="p_soup_popup-select-tab-wrap">'+
                        '   <label class="p_soup_radio_wrap-type-tab">'+
                        '       <input type="radio" name="p_soup_content-type-select" value="0">'+
                        '       <span class="p_soup_radio-tab-txt">게임</span>'+
                        '   </label>'+
                        '   <label class="p_soup_radio_wrap-type-tab">'+
                        '       <input type="radio" name="p_soup_content-type-select" value="1">'+
                        '       <span class="p_soup_radio-tab-txt">VR</span>'+
                        '   </label>'+
                        '   <label class="p_soup_radio_wrap-type-tab">'+
                        '       <input type="radio" name="p_soup_content-type-select" value="2">'+
                        '       <span class="p_soup_radio-tab-txt">웹</span>'+
                        '   </label>'+
                        '</div>'+
                        '<div class="popup-p_soup_btn-group">'+
                        '    <button class="p_soup_btn ps_rev_p_soup_btn-radius p_soup_btn-fit" type="button" onclick="popupAppend(24);">저장</button>'+
                        '</div>'
                        ,
                        '<p class="p_soup_popup-title">분류 수정 완료</p>'+
                        '<div class="popup-p_soup_btn-group">'+
                        '    <button class="p_soup_btn ps_rev_p_soup_btn-radius p_soup_btn-fit" type="button" onclick="popupRemove();">확인</button>'+
                        '</div>'
                        ,
                        '<p class="p_soup_popup-title">공유하기</p>'+
                        '<p class="p_soup_popup-txt"><span>이미 인증에 사용된 경로 또는 인증의 유효기간이 지났습니다.</span> <span>마이페이지 이메일 인증 상태를 확인해 주세요.</span></p>'+
                        '<div class="p_soup_popup-form">'+
                        '   <div class="p_soup_popup-input-row">'+
                        '      <span class="p_soup_input-label">내 프로젝트</span>'+
                        '      <input type="text" class="ps_rev_input-c p_soup_account-stackup-input-bar">'+
                        '   </div>'+
                        '   <div class="p_soup_popup-input-row">'+
                        '      <span class="p_soup_input-label">작품이름</span>'+
                        '      <input type="text" class="ps_rev_input-c p_soup_account-stackup-input-bar">'+
                        '   </div>'+
                        '   <div class="p_soup_popup-input-row">'+
                        '      <span class="p_soup_input-label">작품소개</span>'+
                        '      <textarea rows="7" class="ps_rev_input-c p_soup_account-stackup-input-bar"></textarea>'+
                        '   </div>'+
                        '   <div class="p_soup_popup-input-row">'+
                        '      <span class="p_soup_input-label">공개여부</span>'+
                        '      <div class="p_soup_popup-form-chk-wrapper">'+
                        '           <label class="ps_rev_radio-custom-box">'+
                        '               <input type="radio" name="p_soup_post-public">'+
                        '               <i class="ps_rev_radio-custom"></i>'+
                        '               <span class="ps_rev_radio_txt">공개</span>'+
                        '           </label>'+
                        '           <label class="ps_rev_radio-custom-box">'+
                        '               <input type="radio" name="p_soup_post-public">'+
                        '               <i class="ps_rev_radio-custom"></i>'+
                        '               <span class="ps_rev_radio_txt">비공개</span>'+
                        '           </label>'+
                        '       </div>'+
                        '   </div>'+
                        '   <div class="p_soup_popup-input-row">'+
                        '      <span class="p_soup_input-label">블록내려받기</span>'+
                        '      <div class="p_soup_popup-form-chk-wrapper">'+
                        '           <label class="ps_rev_radio-custom-box">'+
                        '               <input type="radio" name="p_soup_post-content-downloadable">'+
                        '               <i class="ps_rev_radio-custom"></i>'+
                        '               <span class="ps_rev_radio_txt">허용</span>'+
                        '           </label>'+
                        '           <label class="ps_rev_radio-custom-box">'+
                        '               <input type="radio" name="p_soup_post-content-downloadable">'+
                        '               <i class="ps_rev_radio-custom"></i>'+
                        '               <span class="ps_rev_radio_txt">허용안함</span>'+
                        '           </label>'+
                        '       </div>'+
                        '   </div>'+
                        '   <div class="p_soup_popup-input-row">'+
                        '      <span class="p_soup_input-label">블록내려받기</span>'+
                        '      <div class="p_soup_popup-form-chk-wrapper">'+
                        '           <label class="ps_rev_chkbox-custom">'+
                        '               <input type="checkbox">'+
                        '               <i class="ps_rev_chkbox-custom-box"></i>'+
                        '               <span class="ps_rev_chkbox-custom-txt"> 맵</span>'+
                        '           </label>'+
                        '           <label class="ps_rev_chkbox-custom">'+
                        '               <input type="checkbox">'+
                        '               <i class="ps_rev_chkbox-custom-box"></i>'+
                        '               <span class="ps_rev_chkbox-custom-txt"> 게임</span>'+
                        '           </label>'+
                        '           <label class="ps_rev_chkbox-custom">'+
                        '               <input type="checkbox">'+
                        '               <i class="ps_rev_chkbox-custom-box"></i>'+
                        '               <span class="ps_rev_chkbox-custom-txt"> VR</span>'+
                        '           </label>'+
                        '       </div>'+
                        '   </div>'+
                        '</div>'+
                        '<div class="popup-p_soup_btn-group">'+
                        '    <button class="p_soup_btn ps_rev_p_soup_btn-radius p_soup_btn-fit" type="button" onclick="popupAppend(26);">공유하기</button>'+
                        '</div>'
                        ,
                        '<p class="p_soup_popup-title">공유하시겠습니까?</p>'+
                        '<p class="p_soup_popup-txt"><span>공유된 작품은 언제든지 비공유로 설정하거나 수정, 삭제가 가능합니다.</span><span>단 상을 받게 되는 경우 삭제 처리가 불가합니다.</span></p>'+
                        '<div class="popup-p_soup_btn-group">'+
                        '    <button class="p_soup_btn ps_rev_p_soup_btn-radius p_soup_btn-fit p_soup_btn-def" type="button" onclick="popupRemove();">공유취소</button>'+
                        '    <button class="p_soup_btn ps_rev_p_soup_btn-radius p_soup_btn-fit" type="button" onclick="popupAppend(27);">저장</button>'+
                        '</div>'
                        ,
                        '<p class="p_soup_popup-title">등록에 성공하였습니다.</p>'+
                        '<p class="p_soup_popup-txt"><span>내 작품 목록으로 이동합니다.</span></p>'+
                        '<div class="popup-p_soup_btn-group">'+
                        '    <button class="p_soup_btn ps_rev_p_soup_btn-radius p_soup_btn-fit" type="button" onclick="popupRemove();">확인</button>'+
                        '</div>'
                        ,
                        '<p class="p_soup_popup-title">다음 코드를 등록하시겠습니까?</p>'+
                        '<div class="p_soup_popup-email"><input type="text" name="coupon-submit-input" name="email-ps_rev_submit-input" class="ps_rev_input-c ps_rev_text-center"></div>'+
                        '<div class="popup-p_soup_btn-group">'+
                        '    <button class="p_soup_btn ps_rev_p_soup_btn-radius p_soup_btn-fit p_soup_btn-def" type="button" onclick="popupRemove();">NO</button>'+
                        '    <button class="p_soup_btn ps_rev_p_soup_btn-radius p_soup_btn-fit" type="button" onclick="popupAppend(29);">YES</button>'+
                        '</div>'
                        ,
                        '<p class="p_soup_popup-title">등록완료</p>'+
                        '<p class="p_soup_popup-txt"><span>상품교환 코드 등록이 완료되었습니다.</span> <span>결제하실 때 사용하실 수 있습니다.</span></p>'+
                        '<div class="popup-p_soup_btn-group">'+
                        '    <button class="p_soup_btn ps_rev_p_soup_btn-radius p_soup_btn-fit" type="button" onclick="popupRemove();">닫기</button>'+
                        '</div>'
                        ,
                        '<p class="p_soup_popup-title">인증 등록 이메일</p>'+
                        '<p class="p_soup_popup-txt"><span>회원가입 후 인증 할 E-MAIL 주소를 입력해 주세요.</span> <span>해당 메일로 인증 코드를 보내드립니다.</span></p>'+
                        '<div class="p_soup_popup-email"><input type="text" name="email1" class="ps_rev_input-c"><span>@</span><input type="text" name="email2" class="ps_rev_input-c"><select name="email-select" class="ps_rev_input-c"><option val="">직접입력</option><option val="naver.com">naver.com</option><option val="kakao.com">kakao.com</option><option val="nate.com">nate.com</option></select></div>'+
                        '<div class="popup-p_soup_btn-group">'+
                        '    <button class="p_soup_btn ps_rev_p_soup_btn-radius p_soup_btn-def p_soup_btn-fit" type="button" onclick="popupRemove();">이메일 인증</button><button class="p_soup_btn ps_rev_p_soup_btn-radius p_soup_btn-fit" type="button" onclick="popupAppend(31);">다음단계</button>'+
                        '</div>'
                        ,
                        '<p class="p_soup_popup-title">입력하신 이메일이 맞습니까?</p>'+
                        '<div class="p_soup_popup-email"><input type="text" name="email-ps_rev_submit-input" class="ps_rev_input-c ps_rev_text-center"></div>'+
                        '<div class="popup-p_soup_btn-group">'+
                        '    <button class="p_soup_btn ps_rev_p_soup_btn-radius p_soup_btn-def p_soup_btn-fit" type="button" onclick="popupRemove();">아니오</button><button class="p_soup_btn ps_rev_p_soup_btn-radius p_soup_btn-fit" type="button" onclick="popupAppend(32);">네</button>'+
                        '</div>'
                        ,
                        '<p class="p_soup_popup-title">인증 이메일 등록이 완료되었습니다.</p>'+
                        '<div class="p_soup_popup-email"><input type="text" name="email-ps_rev_submit-input" class="ps_rev_input-c ps_rev_text-center"></div>'+
                        '<div class="popup-p_soup_btn-group">'+
                        '    <button class="p_soup_btn ps_rev_p_soup_btn-radius p_soup_btn-fit" type="button" onclick="popupAppend(33);">확인</button>'+
                        '</div>'
                        ,
                        '<p class="p_soup_popup-title">이메일 인증을 축하합니다!</p>'+
                        '<p class="p_soup_popup-txt"><span>인증메일 확인 되었습니다. 이제 아이디/ 비밀번호를 분실시에 아래 이메일로 해당 계정의 정보를 받아볼 수 있습니다.</span></p>'+
                        '<div class="p_soup_popup-form">'+
                        '   <div class="p_soup_popup-input-row">'+
                        '      <span class="p_soup_input-label">회원 아이디</span>'+
                        '      <input type="text" class="ps_rev_input-c p_soup_account-stackup-input-bar">'+
                        '   </div>'+
                        '   <div class="p_soup_popup-input-row">'+
                        '      <span class="p_soup_input-label">인증 이메일</span>'+
                        '      <input type="text" class="ps_rev_input-c p_soup_account-stackup-input-bar">'+
                        '   </div>'+
                        '</div>'+
                        '<div class="popup-p_soup_btn-group">'+
                        '    <button class="p_soup_btn ps_rev_p_soup_btn-radius p_soup_btn-fit" type="button" onclick="popupAppend(34);">확인</button>'+
                        '</div>'
                        ,
                        '<p class="p_soup_popup-title">유효하지 않는 인증메일 입니다.</p>'+
                        '<p class="p_soup_popup-txt"><span>이미 인증에 사용된 경로 또는 인증의 유효기간이 지났습니다.</span> <span>마이페이지 이메일 인증 상태를 확인해 주세요.</span></p>'+
                        '<div class="p_soup_popup-form">'+
                        '   <div class="p_soup_popup-input-row">'+
                        '      <span class="p_soup_input-label">회원 아이디</span>'+
                        '      <input type="text" class="ps_rev_input-c p_soup_account-stackup-input-bar">'+
                        '   </div>'+
                        '   <div class="p_soup_popup-input-row">'+
                        '      <span class="p_soup_input-label">인증 이메일</span>'+
                        '      <input type="text" class="ps_rev_input-c p_soup_account-stackup-input-bar">'+
                        '   </div>'+
                        '</div>'+
                        '<div class="popup-p_soup_btn-group">'+
                        '    <button class="p_soup_btn ps_rev_p_soup_btn-radius p_soup_btn-fit" type="button" onclick="popupAppend(35);">확인</button>'+
                        '</div>'
                        ,
                        '<p class="p_soup_popup-title">인증메일을 재전송 하시겠습니까?</p>'+
                        '<div class="p_soup_popup-email"><input type="text" name="email-ps_rev_submit-input" class="ps_rev_input-c ps_rev_text-center"></div>'+
                        '<div class="popup-p_soup_btn-group">'+
                        '    <button class="p_soup_btn ps_rev_p_soup_btn-radius p_soup_btn-def p_soup_btn-fit" type="button" onclick="popupRemove();">아니오</button><button class="p_soup_btn ps_rev_p_soup_btn-radius p_soup_btn-fit" type="button" onclick="popupAppend(36);">네</button>'+
                        '</div>'
                        ,
                        '<p class="p_soup_popup-title">처리중입니다.</p>'+
                        '<div class="p_soup_loading-layout" onclick="popupAppend(37)"><i class="p_soup_loading-bar"></i><i class="p_soup_loading-bar"></i><i class="p_soup_loading-bar"></i></div>'
                        ,
                        '<p class="p_soup_popup-title">인증 이메일 재전송이 완료 되었습니다.</p>'+
                        '<div class="p_soup_popup-email"><input type="text" name="email-ps_rev_submit-input" class="ps_rev_input-c ps_rev_text-center"></div>'+
                        '<div class="popup-p_soup_btn-group">'+
                        '    <button class="p_soup_btn ps_rev_p_soup_btn-radius p_soup_btn-fit" type="button" onclick="popupAppend(38);">확인</button>'+
                        '</div>'
                        ,
                        '<p class="p_soup_popup-title">인증메일을 삭제하시겠습니까?</p>'+
                        '<div class="p_soup_popup-email"><input type="text" name="email-ps_rev_submit-input" class="ps_rev_input-c ps_rev_text-center"></div>'+
                        '<div class="popup-p_soup_btn-group">'+
                        '    <button class="p_soup_btn ps_rev_p_soup_btn-radius p_soup_btn-def p_soup_btn-fit" type="button" onclick="popupRemove();">아니오</button><button class="p_soup_btn ps_rev_p_soup_btn-radius p_soup_btn-fit" type="button" onclick="popupRemove();">삭제</button>'+
                        '</div>'
                        ,
                        '<p class="p_soup_popup-title">비밀번호 변경</p>'+
                        '<p class="p_soup_popup-txt"><span>비밀번호를 변경하시겠습니까?</span></p>'+
                        '<div class="p_soup_popup-email"><input type="text" name="email-ps_rev_submit-input" class="ps_rev_input-c ps_rev_text-center"></div>'+
                        '<div class="popup-p_soup_btn-group">'+
                        '    <button class="p_soup_btn ps_rev_p_soup_btn-radius p_soup_btn-def p_soup_btn-fit" type="button" onclick="popupRemove();">이메일 인증</button><button class="p_soup_btn ps_rev_p_soup_btn-radius p_soup_btn-fit" type="button" onclick="popupAppend(40);">다음단계</button>'+
                        '</div>'
                        ,
                        '<p class="p_soup_popup-title">비밀번호 변경</p>'+
                        '<p class="p_soup_popup-txt"><span>비밀번호는 다음 중 세 가지 이상을 조합하여 만들어야 합니다</span> <span>영문 소문자, 영문 대문자, 숫자, 특수문자</span></p>'+
                        '<div class="p_soup_popup-email"><input type="text" name="email-ps_rev_submit-input" class="ps_rev_input-c ps_rev_text-center"></div>'+
                        '<div class="popup-p_soup_btn-group">'+
                        '    <button class="p_soup_btn ps_rev_p_soup_btn-radius p_soup_btn-fit" type="button" onclick="popupAppend(41);">확인</button>'+
                        '</div>'
                        ,
                        '<p class="p_soup_popup-title">비밀번호 변경</p>'+
                        '<p class="p_soup_popup-txt"><span>비밀번호가 변경되었습니다.</span></p>'+
                        '<div class="p_soup_popup-email"><input type="text" name="email-ps_rev_submit-input" class="ps_rev_input-c ps_rev_text-center"></div>'+
                        '<div class="popup-p_soup_btn-group">'+
                        '    <button class="p_soup_btn ps_rev_p_soup_btn-radius p_soup_btn-fit" type="button" onclick="popupRemove();">확인</button>'+
                        '</div>'
                    ]
    var popupHTML = '<div class="ps_rev_popup-layout">'+
                    '    <div class="ps_rev_layer-popup-bg"></div>'+
                    '    <div class="ps_rev_layer-popup-overlay">'+ popupInn[x] +
                    '    </div>'+
                    '</div>';
    var popupWrap = $('.ps_rev_popup-layout');
    if(popupWrap.length < 1){
        $('body').append(popupHTML);
        $('#ps_rev_header,#ps_rev_footer,#ps_rev_content-overlay').addClass('blured');
        $('.ps_rev_p_soup_btn-shop-location').hide();
        $('html,body').addClass('hidden');
        $('.ps_rev_layer-popup-bg').hide();
        $('.ps_rev_layer-popup-bg').stop().fadeIn(300);
        $('.ps_rev_layer-popup-overlay').hide();
        $('.ps_rev_layer-popup-overlay').stop().fadeIn(300);
    }else{
        $('.ps_rev_layer-popup-overlay').stop().fadeOut(300);
        setTimeout(function(){
            popupWrap.remove();
        },300);
        $('body').append(popupHTML);
        setTimeout(function(){
            $('.ps_rev_layer-popup-bg').show();
            $('.ps_rev_layer-popup-overlay').stop().fadeIn(300);
        },300);
    }
    $(document).on('change','.p_soup_popup-email select[name=email-select]',function(){
        $(this).parents('.p_soup_popup-email').find('input[name=email2]').val($(this).val());
    });
    rowItemLengthChk();
    $(document).on('click','.p_soup_account-stackup-button',function(){
        const stackupVal = $('.p_soup_account-stackup-input-bar').val();
        $('.p_soup_account-stack').append('<span class="p_soup_stackup-account-item">'+stackupVal+'<i class="p_soup_stackup-account-remove"></i></span>')
        $('.p_soup_account-stackup-input-bar').val('');
        rowItemLengthChk();
    });
    $(document).on('click','.p_soup_stackup-account-remove',function(){
        $(this).parents('.p_soup_stackup-account-item').remove();
        rowItemLengthChk();
    })
    polysoupCouponFullEvent($couponFullNumb);
}

function polysoupCouponSubmitEvent(){
    var couponBaseInput = $('.p_soup_coupon-submit-input-wrap input[type=text]');
    var couponItemMaxLength = 4;
    couponBaseInput.keyup(function(){
        if($(this).val().length >= couponItemMaxLength){
            $('.p_soup_coupon-submit-input-wrap input[type=text][name=coupon-base-input' +( $(this).index() / 2 + 1) + ']').focus();
        }
        var couponFullValue = '';
        for(var i=0; i<couponBaseInput.length;i++){
            couponFullValue = couponFullValue + couponBaseInput.eq(i).val();
        }
        $couponFullNumb = couponFullValue;
    });
}
function polysoupCouponFullEvent(numb){
    var couponInput = 'input[name=coupon-submit-input]';
    var couponFullValue = $(couponInput).val(numb.substr(0,24));
    couponFullValue = numb + '';
    var couponInputDashLength = numb.length;
    var couponValueAry = new Array();
    for(var i=0; i<couponInputDashLength; i += 4){
        couponValueAry.push(couponFullValue.substring(i,i+4));
    }
    var valTxt = '';
    for(var i=0; i<couponValueAry.length;i++){
        if(i + 1 == couponValueAry.length){
            valTxt += couponValueAry[i]
        }else{
            valTxt += couponValueAry[i] + '-';
        }
    };
    $(couponInput).val(valTxt);
    var reg = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi;
    $(document).on('keyup',couponInput,function(){
        $(this).val($(this).val().replace(reg,''));

        
        var couponValueAryType = new Array();
        for(var i=0; i<$(this).val().length; i += 4){
            couponValueAryType.push($(this).val().substring(i,i+4));
        }
        var valTxtType = '';
        for(var i=0; i<couponValueAryType.length;i++){
            if(i + 1 == couponValueAryType.length){
                valTxtType += couponValueAryType[i]
            }else{
                valTxtType += couponValueAryType[i] + '-';
            }
        };
        $(couponInput).val(valTxtType.substr(0,24));
    })
    $(document).on('keydown',couponInput,function(){
        $(this).trigger('keyup');
    })
}
function rowItemLengthChk(){
    const itemLength = $('.p_soup_account-stack').find('.p_soup_stackup-account-item').length;
    if(itemLength > 0){
        $('.p_soup_account-stack').show();
    }else{
        $('.p_soup_account-stack').hide();
    }
}
function popupRemove(){
    $('.ps_rev_layer-popup-bg').stop().fadeOut(300);
    $('.ps_rev_layer-popup-overlay').stop().fadeOut(300);
    $('#ps_rev_header,#ps_rev_footer,#ps_rev_content-overlay').removeClass('blured');
    setTimeout(function(){
        $('.ps_rev_popup-layout').remove();
        $('.ps_rev_p_soup_btn-shop-location').show();
        $('html,body').removeClass('hidden');
    },300);
}
function polysoupListItemSetting(){
    var setItemList = $('.ps_rev_bbs-item-list>li .ps_rev_item-controls-list');
    var setItemBtn = $('.ps_rev_item_control-btn')
    var contentItemToSet = '.ps_rev_bbs-item-list>li'
    setItemBtn.click(function(){
        if($(this).parents(contentItemToSet).hasClass('p_soup_set-on')){
            $(contentItemToSet).removeClass('p_soup_set-on');
            setItemList.stop().slideUp(300);
        }else{
            $(contentItemToSet).removeClass('p_soup_set-on');
            $(this).parents(contentItemToSet).addClass('p_soup_set-on');
            setItemList.stop().slideUp(300);
            $(this).siblings(setItemList).stop().slideDown(300);
        }
    })
}
function polysoupLearningTopResponsive(){
    var $btnGroup = $('.top-p_soup_btn-group');
    var $contentTopW = $('.ps_rev_content-top').innerWidth();
    var $btnGroupW = $btnGroup.outerWidth();
    if($btnGroupW > $contentTopW){        
        $btnGroup.css({width:'100%'});
        $btnGroup.slick({
            autoplay:false,
            arrows:false,
            dots:false,
            infinite:false,
            variableWidth:true,
            swipeToSlide:true,
            touchMove:true,
            
        })
    }else{
        $btnGroup.slick('unslick');
        $btnGroup.css({width:'auto'})
    }
}