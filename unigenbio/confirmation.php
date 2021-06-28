<!DOCTYPE html>
<html lang="en">
<head>
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta charset="utf-8">
<meta name="keywords" content="" />
<meta name="description" content="" />
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="apple-mobile-web-app-capable" content="yes">
<title>유니젠바이오</title>
<link rel="shortcut icon" href="/img/logo_ico.ico">
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100;300;400;500;600;900&display=swap" rel="stylesheet">
<link rel="preload" as="style" href="./_static/css/layout.css">
<link href="./_static/css/layout.css" rel="stylesheet" type="text/css" media="all" />
<link href="./_static/css/mall.css" rel="stylesheet" type="text/css" media="all" />
<script src="./_static/js/jquery.min.js"></script>
<script src="./_static/js/common.js"></script>
</head>

<body>
<div id="container-wrapper">
	<?php 
		include '_header.php';
	?>
	<!-- content area -->
	<div class="container">
		<?php 
			include '_cover.php';
		?>
		<div id="content" class="mall">
			<div class="frm">
				<div class="inner">
					<ul class="tab">
						<li><a href="mall.php">신청 하기</a></li>
						<li><a href="confirmation.php" class="current">신청 확인</a></li>
					</ul>
					<h3>UNIGENEBIO<br /> 암 유전자 검사 신청확인</h3>
					<fieldset class="confirmation">
						<div class="field">
							<p><label class="label">연락처<i class="required" title="필수">*</i></label>
							<input type="text" placeholder="연락처를 입력해주세요.(-없이 숫자만입력)" class="text" /></p>
						</div>
						<div class="btn-area">
							<button class="buttons" onclick="$(this).closest('.frm').find('.confirmation').hide().end().find('.success').show();">인증요청</button>
						</div>
					</fieldset>
					<fieldset class="success" style="display:none;">
						<h4><b>신청 및 결제가 완료되셨습니다.</b><br />
						상담직원이 예약을 위해 영업일로 2일이내 안내전화 드리겠습니다.<br />
						감사합니다.</h4>
						<div class="field">
							<p><label class="label">이름</label>
							<input type="text" value="홍 길 동" class="text" readonly /></p>
							<p><label class="label">생년월일</label>
							<input type="text" value="2020.06.29" class="text" readonly /></p>
							<p><label class="label">연락처</label>
							<input type="text" value="010-1234-56789" class="text" readonly /></p>
						</div>
						<div class="btn-area">
							<a href="mall.php" class="buttons back">돌아가기</a>
						</div>
					</fieldset>
				</div>
			</div>
		</div>
	</div>
	<!-- //content area -->
	<?php 
		include '_footer.php';
	?>
</div>


<script>
jQuery(function($){
});

</script>
</body>

</html>
