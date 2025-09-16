// 자동 배포 테스트 중

/* 
	본 JS는 퍼블리싱 편의를 위해 
	중복되는 공통 레이아웃 영역을 로드할 목적으로 작성된 문서입니다.
	서버 언어로 레이아웃을 구성하게되면 오류를 유발하는 코드이오니
	Back-End 개발시 이 파일을 반드시 삭제해 주세요 :)
*/

$(function () {
	var previewDomain = "pms.inseq.co.kr";
	var pathDepth = window.location.pathname.split("/").length;
	var siteCode = window.location.pathname.split("/")[pathDepth - 3];

	// 경로를 변수로 설정
	var includePath = "../_include/";
	// var srcRoot = '/asset/_guide/';

	if (window.location.hostname == previewDomain && window.location.pathname.split("/")[2].length > 0) {
		var branch = window.location.pathname.split("/")[2];
		// console.log("%cPMS상에서 미리보기시 이미지가 상대경로 강제치환처리되어 404 (Not Found) 오류가 뜰 수 있습니다. 이미지가 잘 노출되고 있음에도 오류가 뜨는 경우 개발 적용시 사라질 오류이니 무시해 주세요. 로컬서버에서 확인했을 때 오류 없으면 됩니다.\n- leroro@inseq.co.kr", "color:blue;");
		console.log("branch : " + branch);
	} else {
		console.log("local");
	}

	$("#header")
		.not(".header-global-search")
		.load(includePath + "inc-header.html #header > *", function () {
			// 전체메뉴 스크롤 작동
			// if ($.isFunction(window.desktopAllmenu)) desktopAllmenu();
			// if ($.isFunction(window.mobileAllmenu)) mobileAllmenu();
			// 사이트별 로고 적용
			// var logoPath = $("#logo img").attr("src");
			// logoPath = logoPath.replace("www", siteCode);
			// $("#logo img").attr("src", logoPath);
			// 뉴스 사이트 Desktop 모드 전체메뉴 버튼 제거
			// if (siteCode == "news") {
			// 	$("#header .btn-allmenu-open").addClass("d-down-md");
			// }
			// Top 네비 활성화
			// $(".top-nav-list li").removeClass("on");
			// $(".top-nav-list ." + siteCode).addClass("on");
		});
	$(".content-header").load(includePath + "inc-content-header.html .content-header > *", function () {});
	$("#breadcrumb").load(includePath + "inc-breadcrumb.html #breadcrumb > *", function () {
		favoriteButton();
	});
	$("#sidebar").load(includePath + "inc-sidebar.html #sidebar > *", function () {
		// if ($.isFunction(window.snbSetting)) snbSetting();
		sidebarSetting();
		favoritSetting();
		krds_tab.init();
		inuix_layerPopup.init();
		displaySettings();
	});
});
