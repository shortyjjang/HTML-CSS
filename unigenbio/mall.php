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
			<div class="inner">
				<h2 class="title">유니젠바이오 암 유전자 검사</h2>
				<dl>
					<dt>간편하고 확실하게 검사하세요.</dt>
					<dd><big>암에 대비해야하는 시대, <b>유니젠바이오 암 유전자 검사</b></big>
					전 세계적으로 초고령화 시대가 도래하는 지금, 의료 시장의 패러다임은 치료 중심에서 예방 중심으로 전환하고 있으며 조기발견 및 예방을 통한 건강수명 유지가 어느 때보다 중요해지고 있습니다. 그에 따라 유니젠바이오는 질병 치료에 앞서 현재에서 대처하실 수 있는 예방과 조기진단의 방법으로 효과적인 건강관리를 하실 수 있도록 도와드리고자 합니다.</dd>
				</dl>
				<img src="./_static/images/maill_img1.png" />
				<ul class="test">
					<li class="before"><b>암 발병 전 예측검사</b> 혈액검사만으로 암 발생 전 (전암단계) 고위험군의 발병 위험석을 미리 예측하고, 맞춤 의료 서비스를 위한 과학적 data를 제공합니다.</li>
					<li class="current"><b>암 발병 진단검사</b> 혈액검사만으로 암의 발생고 진행 단계에서 나타나는 바이오 마커를 검사하여, 암 발병 여부를 진단하고, 맞춤 의료 서비스를 위한 과학적 data를 제공합니다.</li>
					<li class="after"><b>예후 추적 검사</b> 암 환자의 암 생존자의 예후 추적 검사로 전이/재발 암 예방을 위한 과학적 data를 제공합니다.</li>
				</ul>
				<dl>
					<dt>유니젠바이오<br /> 암 유전자 검사 절차</dt>
					<dd>유니젠바이오 암 유전자 검사 결과에 따라, 검사의뢰 의료기관 전문의의 판독을 거쳐 최종 검사 결과가 제공됩니다.</dd>
				</dl>
				<ol class="flow">
					<li><span>협력의료기관 방문</span></li>
					<li><span>채혈</span></li>
					<li><span>혈액검사, 유전자검사</span></li>
					<li><span>분석</span></li>
					<li><span>빅데이터 분석</span></li>
					<li><span>결과보고</span></li>
				</ol>
				<dl>
					<dt>암 유전자 검사가 필요하신 분</dt>
					<dd><ul>
						<li>건강검진보다 더 간편하게 소량의 혈액만으로 암 발병 위험성을 알고 싶으신 분</li>
						<li>암 가족력이 있으신 분</li>
						<li>암 생존자 (항암치료 후 재발 위험에 대한 추적검사가 필요하신 분)</li>
					</ul></dd>
				</dl>
			</div>
			<div class="frm">
				<div class="inner">
					<ul class="tab">
						<li><a href="mall.php" class="current">신청 하기</a></li>
						<li><a href="confirmation.php">신청 확인</a></li>
					</ul>
					<h3>UNIGENEBIO<br /> 암 유전자 검사 신청하기</h3>
					<fieldset class="register">
						<ol class="step">
							<li>신청하기</li>
							<li>결제</li>
							<li>예약안내</li>
						</ol>
						<div class="field">
							<p><label class="label">이름<i class="required" title="필수">*</i></label>
							<input type="text" placeholder="이름을 입력해 주세요." class="text" /></p>
							<p><label class="label">생년월일<i class="required" title="필수">*</i></label>
							<input type="text" placeholder="생년월일 6자리를 입력해주세요.(-없이 숫자만입력)" class="text" /></p>
							<p><label class="label">연락처<i class="required" title="필수">*</i></label>
							<input type="text" placeholder="연락처를 입력해주세요.(-없이 숫자만입력)" class="text" /></p>
						</div>
						<div class="btn-area">
							<button class="buttons">예약 및 결제</button>
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
