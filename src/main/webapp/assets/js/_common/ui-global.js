// ui-global.js

// 테이블 스크롤 표시 : INUIX custom
const tableScroll = () => {
	const scrollContainers = document.querySelectorAll(".scroll-container");

	if (!scrollContainers.length) return;

	const handleScroll = (container) => {
		const wrap = container.closest(".scroll");
		const currLeft = container.scrollLeft;
		const scrWidth = container.scrollWidth;
		const cliWidth = container.clientWidth;

		if (currLeft === 0) {
			wrap.classList.remove("scroll-ing", "scroll-end");
		} else if (currLeft !== 0 && currLeft + cliWidth < scrWidth) {
			wrap.classList.add("scroll-ing");
			wrap.classList.remove("scroll-end");
		} else {
			wrap.classList.add("scroll-end");
		}
	};

	scrollContainers.forEach((container) => {
		container.addEventListener("scroll", () => handleScroll(container));
	});
};

// displaySettings : INUIX custom 시스템 테마
const displaySettings = () => {
	const adjustDisplay = document.querySelector(".adjust-display");
	if (!adjustDisplay) return;

	const root = document.querySelector("html");
	const objectDocuments = document.querySelectorAll("object");
	const viewModeOptions = adjustDisplay.querySelectorAll(".view-mode-options .krds-form-check input[type=radio]");
	const resetDisplay = document.getElementById("reset_display");

	const defaultViewMode = adjustDisplay.querySelector("#view_mode_light");
	let selectedViewMode = defaultViewMode.value;

	const smoothStyleTransition = (mode, doc = document) => {
		const themeFile = mode === "dark" ? "high-contrast" : mode;
		const cssPath = `../../assets/css/style_${themeFile}.css`;

		const existingLink = doc.querySelector(`link[href="${cssPath}"]`);
		if (existingLink) {
			doc.querySelectorAll('link[href*="style_"]').forEach((link) => {
				if (link !== existingLink) {
					link.remove();
				}
			});
			return;
		}

		// 새 스타일시트 링크 생성
		const newLink = doc.createElement("link");
		newLink.rel = "stylesheet";
		newLink.href = cssPath;

		// 새 스타일시트가 로드되면 기존 스타일시트 제거
		newLink.onload = () => {
			doc.querySelectorAll('link[href*="style_"]').forEach((link) => {
				if (link !== newLink) {
					link.remove();
				}
			});
		};

		// 기존 스타일시트 다음에 새 스타일시트 삽입
		const lastLink = doc.querySelector('link[href*="style_"]:last-of-type');
		if (lastLink) {
			lastLink.after(newLink);
		} else {
			doc.head.appendChild(newLink);
		}
	};

	const setTheme = () => {
		const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
		const mode = isDarkMode ? "dark" : "light";

		// 메인 문서 업데이트
		smoothStyleTransition(mode);

		// 객체 문서 업데이트
		objectDocuments.forEach((obj) => {
			if (obj.contentDocument) {
				smoothStyleTransition(mode, obj.contentDocument);
			}
		});
	};

	const getLocalItem = () => {
		const savedMode = localStorage.getItem("displayMode");
		if (savedMode) {
			selectedViewMode = savedMode;

			viewModeOptions.forEach((option) => {
				if (option.value === savedMode) option.checked = true;
			});
		}
		// 저장된 모드 또는 기본 모드 적용
		applyDisplay();
	};

	const setLocalItem = () => {
		localStorage.setItem("displayMode", selectedViewMode);
	};

	const applyDisplay = () => {
		if (selectedViewMode === "theme") {
			setTheme();
		} else {
			// 메인 문서 업데이트
			smoothStyleTransition(selectedViewMode);

			// 객체 문서 업데이트
			objectDocuments.forEach((obj) => {
				if (obj.contentDocument) {
					smoothStyleTransition(selectedViewMode, obj.contentDocument);
				}
			});
		}

		setLocalItem();
	};

	// 시스템 테마 변경 감지
	const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
	mediaQuery.addEventListener("change", () => {
		if (selectedViewMode === "theme") {
			setTheme();
		}
	});

	// 옵션 선택 이벤트
	viewModeOptions.forEach((option) => {
		option.addEventListener("click", () => {
			selectedViewMode = option.value;
			applyDisplay();
		});
	});

	// 초기화 버튼
	if (resetDisplay) {
		resetDisplay.addEventListener("click", () => {
			defaultViewMode.checked = true;
			selectedViewMode = defaultViewMode.value;
			applyDisplay();
		});
	}

	// 새로운 객체 감시
	const observeObjectChanges = () => {
		const observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				mutation.addedNodes.forEach((node) => {
					if (node.tagName === "OBJECT") {
						const applyThemeToObject = () => {
							if (node.contentDocument) {
								if (selectedViewMode === "theme") {
									const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
									smoothStyleTransition(isDarkMode ? "dark" : "light", node.contentDocument);
								} else {
									smoothStyleTransition(selectedViewMode, node.contentDocument);
								}
							}
						};

						if (node.contentDocument) {
							applyThemeToObject();
						} else {
							node.addEventListener("load", applyThemeToObject);
						}
					}
				});
			});
		});

		observer.observe(document.body, { childList: true, subtree: true });
	};

	// 초기화
	getLocalItem();
	observeObjectChanges();
};

// allMenuSetting : INUIX custom
const allMenuSetting = () => {
	let $allmenuOpener = null;

	const allmenuControl = (status, opener) => {
		$allmenuOpener = $(opener);
		if (status === "open") {
			$("body").toggleClass("allmenu-opened");
		} else if (status === "close") {
			$("body").removeClass("allmenu-opened");
			$allmenuOpener.focus();
		}
	};

	// Event Binding
	$(document)
		.on("click", ".btn-allmenu-open", function (e) {
			e.preventDefault();
			allmenuControl("open", $(this));
		})
		.on("click", ".btn-allmenu-close", function (e) {
			e.preventDefault();
			const opener = $allmenuOpener ? $allmenuOpener : $(".btn-allmenu-open");
			allmenuControl("close", opener);
		});
};

// favoriteButton : INUIX custom
const favoriteButton = () => {
	const buttons = document.querySelectorAll(".btn-favorit");

	if (buttons.length > 0) {
		buttons.forEach((button) => {
			button.addEventListener("click", function () {
				this.classList.toggle("active");
				const isFavorited = this.classList.contains("active");
				const text = this.querySelector(".sr-only");

				if (isFavorited) {
					text.textContent = "즐겨찾기 제거";
				} else {
					text.textContent = "즐겨찾기 추가";
				}
			});
		});
	}
};

// Sidebar : INUIX custom
// const sidebarSetting = () => {
// 	const snbSetting = () => {
// 		$(".snb-list ul").each(function () {
// 			$(this).parent("li").addClass("collapse");
// 		});

// 		if (!$(".sidebar-area").hasClass("sidebar-floating")) {
// 			$(".snb-list li.on>ul, .allmenu-list li.on>ul").each(function () {
// 				$(this).show();
// 			});
// 		}
// 	};

// 	$(document).on("click", ".snb-list .collapse > a, .allmenu-list .collapse > a", function (e) {
// 		e.preventDefault();
// 		$(this).next("ul").slideToggle("fast").parent("li").toggleClass("on");
// 	});

// 	if ($(".sidebar-area").length > 0) {
// 		snbSetting();
// 	}
// };
const sidebarSetting = () => {
	const snbSetting = () => {
		$(".snb-list ul").each(function () {
			$(this).parent("li").addClass("collapse");
		});

		if (!$(".sidebar-area").hasClass("sidebar-floating")) {
			$(".snb-list li.on>ul, .allmenu-list li.on>ul").each(function () {
				$(this).show();
			});
		}
	};

	$(document).on("click", ".snb-list .collapse > a, .allmenu-list .collapse > a", function (e) {
		// 축소모드(nav-collapsed)에서는 클릭 이벤트를 처리하지 않음
		if ($(".wrapper").hasClass("nav-collapsed")) {
			return;
		}

		e.preventDefault();
		$(this).next("ul").slideToggle("fast").parent("li").toggleClass("on");
	});

	if ($(".sidebar-area").length > 0) {
		snbSetting();
	}
};

// Favorite Menu : INUIX custom
const favoritSetting = () => {
	const favoritInit = () => {
		$(".favorit-list ul").each(function () {
			$(this).parent("li").addClass("collapse");
		});

		// 활성화된 메뉴 표시
		$(".favorit-list li.on>ul").each(function () {
			$(this).show();
		});
	};

	// 즐겨찾기 메뉴 클릭 이벤트
	$(document).on("click", ".favorit-list .collapse > a", function (e) {
		e.preventDefault();
		$(this).next("ul").slideToggle("fast").parent("li").toggleClass("on");
	});

	// 즐겨찾기 메뉴가 있을 경우 초기화
	if ($(".favorit-menu").length > 0) {
		favoritInit();
	}
};

// modalDrag : INUIX custom
const modalDrag = () => {
	const draggableModals = document.querySelectorAll(".modal-drag");

	if (!draggableModals.length) return;

	draggableModals.forEach((modal) => {
		$(modal).draggable({
			appendTo: "body",
			containment: "parent", // 부모 요소 내에서만 이동 가능
			scroll: false,
			handle: ".modal-header", // 헤더 영역으로만 드래그 가능하도록 제한
			start: function (event, ui) {
				$(this).css("transform", "none");
			}
		});
	});
};

// 사이드바 설정 : 축소/확장 기능 : INUIX custom
const sidebarCollapseControl = () => {
	// 미디어 쿼리 확인 함수
	const isDesktop = () => window.innerWidth >= 1024;
	let currentMode = isDesktop() ? "desktop" : "mobile";

	// 탭 상태를 초기화하는 함수
	const resetTabsToDefault = () => {
		$("#sidebar .tab ul[role='tablist'] li").removeClass("active").attr("aria-selected", "false");
		$("#sidebar .tab-conts-wrap > .tab-conts").removeClass("active");
		$("#sidebar .tab ul[role='tablist'] > li:first-child").addClass("active").attr("aria-selected", "true");
		$("#sidebar .tab-conts-wrap > .tab-conts:first-child").addClass("active");
	};

	// 초기 로드 및 사이드바 상태 설정
	const initSidebarState = () => {
		if (!isDesktop()) {
			$(".wrapper").removeClass("nav-collapsed");
			return;
		}

		// 데스크톱일 때만 저장된 상태 적용
		const navCollapseState = localStorage.getItem("navCollapsed") || "false";

		if (navCollapseState === "true") {
			$(".wrapper").addClass("nav-collapsed");
			// navClose();
			$("#sidebar .tab-conts-wrap > .tab-conts").removeClass("active");
			$("#sidebar .tab-conts-wrap > .tab-conts:first-child").addClass("active");
		} else {
			$(".wrapper").removeClass("nav-collapsed");
		}
	};

	// 초기 상태 설정
	initSidebarState();

	// 사이드바 축소/확장 버튼 클릭 이벤트
	$(document).on("click", ".btn-collapse", function () {
		if (!isDesktop()) return;

		const wrapper = $(".wrapper");
		let isCollapsed;

		if (wrapper.hasClass("nav-collapsed")) {
			// 확장 모드로 전환
			wrapper.removeClass("nav-collapsed");
			isCollapsed = false;

			// 확장 모드일 때 이전에 저장된 탭 상태 복원
			const previousActiveTab = localStorage.getItem("previousActiveTab");
			if (previousActiveTab === "second-tab") {
				$("#sidebar .tab-conts-wrap > .tab-conts:first-child").removeClass("active");
				$("#sidebar .tab-conts-wrap > .tab-conts:nth-child(2)").addClass("active");
				localStorage.removeItem("previousActiveTab");
			}
		} else {
			// 축소 모드로 전환
			wrapper.addClass("nav-collapsed");
			isCollapsed = true;

			const secondTabActive = !$("#sidebar .tab ul[role='tablist'] li:first-child").hasClass("active");

			if (secondTabActive) {
				localStorage.setItem("previousActiveTab", "second-tab");
				$("#sidebar .tab-conts-wrap > .tab-conts").removeClass("active");
				$("#sidebar .tab-conts-wrap > .tab-conts:first-child").addClass("active");
			}
		}

		// 로컬 스토리지에 상태 저장
		localStorage.setItem("navCollapsed", isCollapsed);

		$(window).trigger("resize");
	});

	// 탭 버튼 클릭 이벤트
	$(document).on("click", ".tab .btn-tab", function (e) {
		if (!isDesktop() || !$(".wrapper").hasClass("nav-collapsed")) {
			return true;
		}

		// 사이드바가 축소되어 있는 경우
		const tabIndex = $(this).closest("li").index();
		e.preventDefault();

		const activeTabIndex = $("#sidebar .tab-conts-wrap > .tab-conts.active").index();
		if (activeTabIndex !== 0) {
			$("#sidebar .tab-conts-wrap > .tab-conts").removeClass("active");
			$("#sidebar .tab-conts-wrap > .tab-conts:first-child").addClass("active");
		}

		if (tabIndex === 1) {
			localStorage.setItem("previousActiveTab", "second-tab");
		}

		return false;
	});

	// 화면 크기 변경 시 이벤트
	$(window).on("resize", function () {
		// 현재 모드 확인
		const newMode = isDesktop() ? "desktop" : "mobile";
		if (newMode !== currentMode) {
			resetTabsToDefault();
			if (newMode === "mobile") {
				$(".wrapper").removeClass("nav-collapsed");
			} else {
				initSidebarState();
			}
			currentMode = newMode;
		}
	});
};

//로딩바 애니메이션
// 로딩 바를 보여주는 함수
function showLoadingBar() {
	let loadingOverlay = document.getElementById("loading-overlay");
	if (loadingOverlay) {
		loadingOverlay.classList.remove("hidden");
	}
}

// 로딩 바를 감추는 함수
function hideLoadingBar() {
	let loadingOverlay = document.getElementById("loading-overlay");
	if (loadingOverlay) {
		loadingOverlay.classList.add("hidden");
	}
}

// 실행
document.addEventListener("DOMContentLoaded", () => {
	displaySettings();
	allMenuSetting();
	favoriteButton();
	modalDrag();
	sidebarCollapseControl();
	showLoadingBar();

	// sidebarSetting();
	// favoritSetting();

	setTimeout(() => {
		hideLoadingBar();
	}, 500);

	const hasScrollContainer = document.querySelector(".scroll-container");
	if (hasScrollContainer) {
		tableScroll();
	}
});
