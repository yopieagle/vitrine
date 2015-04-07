//Detect if the browser is mobile
var isMobile = false;
var isiPad = false;

function isMobileFunc() {
    var array_mobileIds = new Array('iphone', 'android', 'ipad', 'ipod');
    var uAgent = navigator.userAgent.toLowerCase();
    for (var i=0; i<array_mobileIds.length; i++) {
		if(uAgent.search(array_mobileIds[i]) > -1) {
			isMobile = true;
			if(array_mobileIds[i] == 'ipad') isiPad = true;
		}
    }
}

function loadCSS(url) {
	var css = document.createElement("link");
	css.setAttribute("rel", "stylesheet");
	css.setAttribute("type", "text/css");
	css.setAttribute("href", url);
	document.getElementsByTagName("head")[0].appendChild(css);	
}

isMobileFunc();

if(!isMobile) {
	//Animation
	loadCSS("layout/plugins/cssanimation/animate.css");
	loadCSS("layout/plugins/cssanimation/delays.css");
	loadCSS("layout/plugins/flexslider/animation_delays.css");
}

//Count num
function countNum(num, content, target, duration) {
	if(duration) {
		var count = 0;
		var speed = parseInt(duration / num);
		var interval = setInterval(function(){
			if(count - 1 < num) {
				target.html(count);
			}
			else {
				target.html(content);
				clearInterval(interval);
			}
			count++;
		}, speed);
	} else {
		target.html(content);
	}
}

//Init menu
function initMenu() {
	function isScrolledHeader() {
		if($(window).scrollTop() > 0 && !$('body').hasClass('static-menu')) $('header').addClass('scrolled');
		else $('header').removeClass('scrolled');
	}
	
	isScrolledHeader();
	
	var scroll_offset = ($('body').hasClass('static-menu')) ? 0 : -52;
	
	$('.main-menu li a').click(function(e){
		var content = $(this).attr('href');
		var checkURL = content.match(/^#([^\/]+)$/i);
		
		if(checkURL) {
			$.scrollTo($(content), 700, {
				offset:scroll_offset
			});
		} else {
			window.location = content;
		}
		
		e.preventDefault();
	});
	
	$('.main-menu li').click(function () {
		$('.main-menu li').removeClass('current-page-item');
		$(this).addClass('current-page-item');
	});
	
	var lastId;
	var top_menu = $('.main-menu');
	var top_menu_height = top_menu.outerHeight() + 500;
	var menu_items = top_menu.find('a');
	
	scroll_items = menu_items.map(function() {
		var content = $(this).attr('href');
		var checkURL = content.match(/^#([^\/]+)$/i);
		
		if(checkURL) {
			var item = $($(this).attr('href'));
			if(item.length) return item
		}
	});
	
	$(window).scroll(function () {
		isScrolledHeader();
		
		var from_top = $(this).scrollTop() + top_menu_height;
		var cur = scroll_items.map(function() {
			if($(this).offset().top < from_top) return this
		});
		
		cur = cur[cur.length - 1];
		var id = cur && cur.length ? cur[0].id:'';
		
		if(lastId !== id) {
			lastId = id;
			menu_items.parent().removeClass('current-page-item').end().filter('[href=#' + id + ']').parent().addClass('current-page-item');
		}
	});
		
	if(window.location.hash) {
		var destination = window.location.hash;
		window.location.hash = '';
		
		$(window).load(function() {
			setTimeout(function() {
				window.location.hash = destination;
			}, 300);
		});
	}
	
	buildResponsiveMenu();
}

//Build responsive menu
function buildResponsiveMenu() {
	$('#header').append('<div class="block-responsive-menu"><div class="inner"><div class="button"><a href="#">Menu</a></div></div><div class="right-menu"><div class="inner" /></div></div>');
	
	var menu_content = $('.main-menu nav > ul').clone();
	$('#header .right-menu .inner').append(menu_content);
	
	$('.block-responsive-menu .right-menu ul').each(function() {
		$(this).find('> li:last').addClass('last_menu_item');
	});
	
	$('.block-responsive-menu .right-menu li').each(function() {
		if($(this).find('> ul').length > 0) $(this).addClass('has_children');
	});
	
	$('.block-responsive-menu .button a').click(function(e) {
		$('.block-responsive-menu > .right-menu').slideToggle();		
		e.preventDefault();
	});
	
	$('.block-responsive-menu .right-menu .has_children > a').click(function(e) {
		if(!$(this).parent().hasClass('expanded') || $(this).attr('href') == '#') {
			$(this).parent().toggleClass('expanded').find(' > ul').slideToggle();			
			e.preventDefault();
		}
	});
	
	$('.block-responsive-menu .right-menu li a').click(function(e){
		var content = $(this).attr('href');
		var checkURL = content.match(/^#([^\/]+)$/i);
		
		if(checkURL) {
			$.scrollTo($(content), 700);
		} else {
			window.location = content;
		}
		
		$('.block-responsive-menu > .right-menu').slideUp();
		
		e.preventDefault();
	});
}

//Init block animation
function initBlockAnimation() {
	var diff = 50;
	var w_height = $(window).height();
	var sections = $('#content section');
	
	$(window).scroll(function() {
		sections.each(function() {
			var section = $(this);
			if(!section.hasClass('done_animate') && (w_height + $(window).scrollTop() - section.offset().top - diff > 0)) {
				section.addClass('done_animate').trigger('start_animation');
			}
		});
	});
	
	sections.bind('start_animation', function() {
		var section = $(this);
		var id = section.attr('id');
		var animated_items = section.find('.scroll-animated-item');
		
		animated_items.each(function(num) {
			var block = $(this);
			block.addClass('animate' + (num + 1)).addClass(block.attr('data-scroll-animation'));
		});
		
		switch(id) {
			case 'about' :
				window.setTimeout(function() {
					initStats(1500);
					window.setTimeout(function() {
						initSkills(1000);
					}, 1000);
				}, 800);
			break;
		}
	});
	
	$(window).resize(function() {
		w_height = $(window).height();
	});
}

//Init fields
function initFields() {
	$('.w_def_text').each(function() {
		var text = $(this).attr('title');
		
		if($(this).val() == '') {
			$(this).val(text);
		}
	});
	
	$('.w_def_text').bind('click', function() {
		var text = $(this).attr('title');
		
		if($(this).val() == text) {
			$(this).val('');
		}
		
		$(this).focus();
	});
	
	$('.w_def_text').bind('blur', function() {
		var text = $(this).attr('title');
		
		if($(this).val() == '') {
			$(this).val(text);
		}
	});
	
	$('.custom_select:not(.initialized)').each(function() {
		$(this).css('opacity', '0').addClass('initialized');
		$(this).parent().append('<span />');
		var text = $(this).find('option:selected').html();
		$(this).parent().find('span').html(text);
		
		$(this).bind('change', function() {
			var text = $(this).find('option:selected').html();
			$(this).parent().find('span').html(text);
		});
	});
	
	$('.w_focus_mark').bind('focus', function() {
		$(this).parent().addClass('focused');
	});
	
	$('.w_focus_mark').bind('blur', function() {
		$(this).parent().removeClass('focused');
	});
}

//Init pretty photo
function initPrettyPhoto() {
	if(!isMobile || isiPad) {		
		$('a[rel^="prettyPhoto"]').prettyPhoto({
			deeplinking:false,
			keyboard_shortcuts:false,
			slideshow:false,
			counter_separator_label:' of ',
			gallery_markup:'',
			social_tools:'',
			show_title:false,
			horizontal_padding:0,
			ie6_fallback:false,
			theme:'pp_artemis'
		});
	}
}

//Init filter
function initFilter() {
	var container = $('#filtered_container');
	
	container.isotope({
		itemSelector:'article'
	});
	
	$('#filter a').bind('click', function(e) {
		var selector = $(this).attr('href');
		if(selector == 'all') selector = '*'
		else selector = '.' + selector;
		
		container.isotope({
			filter:selector,
			itemSelector:'article'
		});
		
		$('#filter li').removeClass('active');
		$(this).parent().addClass('active');
		
		e.preventDefault();
	});
	
	$('#filter_button').bind('click', function(e) {
		var container = $(this).parents('.block-filter');
		container.toggleClass('opened');
		$('.filter', container).slideToggle(200);		
		e.preventDefault();
	});
	
	$(window).resize(function() {
		container.isotope('reLayout');
	});
}

//Init map
function initMap() {
	var marker;
	var latlng = new google.maps.LatLng(0, 0);
	
	var my_options = {
		zoom:16,
		center:latlng,
		scrollwheel:false,
		scaleControl:false,
		disableDefaultUI:false,
		mapTypeId:google.maps.MapTypeId.ROADMAP
	};
	
	var map = new google.maps.Map(document.getElementById('map'), my_options);
	
	function renderMarkers() {
		var name = $('#contacts .info > h2').text();
		var address = $('#contacts .info .address').text();	
		
		var custom_map = new google.maps.Geocoder();
		
		custom_map.geocode({'address':address}, function(results, status) {
			if(status == google.maps.GeocoderStatus.OK) {
				var location = results[0].geometry.location;
				
				marker = new google.maps.Marker({
					map:map,
					icon:'layout/images/map-marker.png',
					position:location,
					title:name
				});
				
				google.maps.event.addListener(marker, 'click', function() {
					infowindow.open(map, marker);
				});
				
				centerMap();		
				initLinks();
			} else {
				alert("Geocode was failed for the following reason: " + status);
			}
		});
	}
	renderMarkers();
	
	function centerMap() {
		map.setCenter(marker.getPosition());
		marker.setIcon('layout/images/map-marker.png');
	}
	
	function initLinks() {
		$('#view_map').bind('click', function(e) {
			var height = $('.block-contacts').height();
			$('.block-contacts').css('height', height + 'px');
			$('#contacts').addClass('map_only');
			
			e.preventDefault();
		});
		
		$('#view_contacts').bind('click', function(e) {
			$('#contacts').removeClass('map_only');
			$('.block-contacts').css('height', 'auto');
			
			e.preventDefault();
		});
	}
	
	$(window).resize(function() {
		centerMap();
	});
}

//Init services
function initServices() {
	$('#services_wrapper').mCustomScrollbar({
		horizontalScroll:true,
		autoDraggerLength:false,
		mouseWheel:false,
		contentTouchScroll:false,
		advanced:{
			autoExpandHorizontalScroll:true
		}
	});
	
	$(window).resize(function() {
		if($('#services').hasClass('done_animate')) $('#services').addClass('no-animate');
	});
}

//Init projects
function initProjects(target) {
	var col_num = 5;
	if($(window).width() <= 1100) col_num = 4;
	if($(window).width() <= 767) col_num = 2;
	if($(window).width() <= 479) col_num = 1;
	var project_items = $(target + ' article');
	var project_items_width = Math.floor($(window).width() / col_num);
	project_items.css('width', project_items_width + 'px');
}

//Init team slider
function initTeamSlider(target) {
	var flexslider;
	
	function calcWidth() {
		var content_width = $('#header > .inner').width();
		var width = 254;
		if(content_width < 1100) width = 220;
		if(content_width < 940) width = 364;
		if(content_width < 748) width = 420;
		if(content_width < 420) width = 300;
		return width;
	}
	
	function calcMargin() {
		var content_width = $('#header > .inner').width();
		var width = 28;
		if(content_width < 1100) width = 20;
		return width;
	}
	
	$(target).flexslider({
		animation:'slide',
		controlNav:false,
		directionNav:true,
		animationLoop:false,
		slideshow:false,
		itemWidth:calcWidth(),
		itemMargin:calcMargin(),
		useCSS:true,
		touch:false,
		move:1,
		start:function(slider) {
			flexslider = slider;
			$(target).find('.flex-direction-nav li a.flex-prev').html('<i class="icon-left-open"></i>');
			$(target).find('.flex-direction-nav li a.flex-next').html('<i class="icon-right-open"></i>');
		}
	});
	
	$(window).resize(function() {
		flexslider.flexAnimate(0);
		flexslider.vars.itemWidth = calcWidth();
		flexslider.vars.itemMargin = calcMargin();
	});
}

//Init stats
function initStats(duration) {
	$('.block-stats .num').each(function() {
		var container = $(this);
		var num = container.attr('data-num');
		var content = container.attr('data-content');
		
		countNum(num, content, container, duration);
	});
}

//Init skills
function initSkills(duration) {
	$('.block-skills .skill').each(function() {
		var container = $(this).find('.note');
		var num = $(this).find('.level-rail').attr('data-level');
		var content = num + '%';
		if(duration) {
			$(this).find('.level').animate({width:num + '%'}, duration);
		} else {
			$(this).find('.level').css({'width':num + '%'});
		}
		
		countNum(num, content, container, duration);
	});
}

//Init project item
function initProjectItem() {
	var projects_all = $('.projects-container article');
	var projects_quantity = projects_all.length;
	
	function showProject(source) {
		$('.current-project').removeClass('current-project');
		
		var index = projects_all.index(source);
		var project = source.addClass('current-project').find('.project-item').clone();
		
		project.find('.slider > div').attr('id', 'project_item_slider').addClass('flexslider');
		project.find('.flexslider > ul').addClass('slides');
	
		$('#project_item .inner').html(project);
		
		if(index <= 0) {
			$('#project_item .projects-nav.prev').addClass('inactive');
		} else {
			$('#project_item .projects-nav.prev').removeClass('inactive');
		}
		
		if(index >= (projects_quantity - 1)) {
			$('#project_item .projects-nav.next').addClass('inactive');
		} else {
			$('#project_item .projects-nav.next').removeClass('inactive');
		}
		
		$('#project_item .project-zoom').attr('rel', 'prettyPhoto');
		$('#project_item .slider .project-zoom').attr('rel', 'prettyPhoto[pp_gal]');
		initPrettyPhoto();
		
		if(!$('#project_item').hasClass('active')) {
			$('#project_item').addClass('active').slideDown(500);
		}
		
		$('#project_item_slider').flexslider({
			animation:'fade',
			controlNav:false,
			directionNav:true,
			animationLoop:true,
			slideshow:false,
			useCSS:true,
			smoothHeight:true,
			start:function(slider) {
				$('#project_item_slider').find('.flex-direction-nav li a.flex-prev').html('<i class="icon-left-open"></i>');
				$('#project_item_slider').find('.flex-direction-nav li a.flex-next').html('<i class="icon-right-open"></i>');
			}
		});
	}
	
	function hideProject() {
		$('#project_item').removeClass('active').slideUp(300, function() {
			$('.current-project').removeClass('current-project');
			$('#project_item .project-item').remove();
		});
	}
	
	$('a[data-rel^="projectItem"]').click(function(e) {
		e.preventDefault();		
		var project = $(this).parents('article').eq(0);		
		$.scrollTo('#projects', 500, {
			onAfter:function() {
				showProject(project);
			}
		});	
	});
	
	$('#project_item').on('click', '.projects-nav.prev', function(e) {
		e.preventDefault();
		if(!$(this).hasClass('inactive')) {
			var current = projects_all.index($('.projects-container article.current-project'));
			var project = projects_all.eq(current - 1);
			showProject(project);
		}
	});
	
	$('#project_item').on('click', '.projects-nav.next', function(e) {
		e.preventDefault();
		if(!$(this).hasClass('inactive')) {
			var current = projects_all.index($('.projects-container article.current-project'));
			var project = projects_all.eq(current + 1);
			showProject(project);
		}
	});
	
	$('#project_item').on('click', '.project-close', function(e) {
		e.preventDefault();
		hideProject();		
	});
	
}

//Init main slider
function initMainSlider(target) {
	$(target).flexslider({
		animation:'fade',
		controlNav:true,
		directionNav:true,
		animationLoop:true,
		slideshow:true,
		animationSpeed:500,
		useCSS:true,		
		start:function(slider) {
			if(!isMobile) {
				slider.slides.each(function(s) {
					$(this).find('.animated-item').each(function(n) {
						$(this).addClass('animate_item' + n);
					});
				});
				slider.slides.eq(slider.currentSlide).find('.animated-item').each(function(n) {
					var show_animation = $(this).attr('data-animation');
					$(this).addClass(show_animation);
				});
			} else {
				slider.find('.counter').find('.num').each(function() {
					var container = $(this);
					var num = container.attr('data-num');
					var content = container.attr('data-content');
					
					countNum(num, content, container, false);
				});
			}
			
			setHeight();
			
			$(target).find('.flex-direction-nav li a.flex-prev').html('<i class="icon-left-open"></i>');
			$(target).find('.flex-direction-nav li a.flex-next').html('<i class="icon-right-open"></i>');
		},
		before:function(slider) {
			if(!isMobile) {
				slider.slides.eq(slider.currentSlide).find('.animated-item').each(function(n) {
					var show_animation = $(this).attr('data-animation');
					$(this).removeClass(show_animation);
				});
				slider.slides.find('.animated-item').hide();
				
				var counter_block = slider.slides.eq(slider.currentSlide).find('.counter');
				if(counter_block.length > 0) {
					setTimeout(function() {
						counter_block.find('.num').each(function() {
							$(this).html('0');
						});
					}, 300);
				}
			}
		},
		after:function(slider) {
			if(!isMobile) {
				slider.slides.find('.animated-item').show();
				
				slider.slides.eq(slider.currentSlide).find('.animated-item').each(function(n) {
					var show_animation = $(this).attr('data-animation');
					$(this).addClass(show_animation);
				});
				
				var counter_block = slider.slides.eq(slider.currentSlide).find('.counter');
				if(counter_block.length > 0) {
					counter_block.find('.num').each(function() {
						var container = $(this);
						var num = container.attr('data-num');
						var content = container.attr('data-content');
						
						countNum(num, content, container, 1500);
					});
				}
			}
		}
	});
	
	function setHeight() {
		var w_height = $(window).height();
		$(target).height(w_height).find('.slides > li').height(w_height);
		
		$(target).find('.video').each(function() {
			var block = $(this);
			var block_w = block.width();
			var block_h = block.height();
			var video = $('video', block);
			var video_w = video.attr('width');
			var video_h = video.attr('height');
			var ratio = video_w / video_h;			
			var new_video_w = block_w;
			var new_video_h = block_w / ratio;
			
			if(new_video_h < block_h) {
				new_video_h = block_h;
				new_video_w = new_video_h * ratio;
			}
			
			video.css({
				'width':new_video_w+'px',
				'height':new_video_h+'px',
				'margin-left':'-'+(new_video_w/2)+'px',
				'margin-top':'-'+(new_video_h/2)+'px'
			});
		});
	}
	
	$(window).resize(function() {
		setHeight();
	});
}

//Init blog for mobile
function initBlogMobile() {
	var images = $('.block-blog .posts img');
	var total = images.length;
	var count = 0;
	
	$('body').append('<div id="tmp" style="display:none;" />');
	
	function loadImages() {
		$('#tmp').load(images.eq(count).attr('src'), function() {
			count++;
			
			if(count<total) {
				loadImages();
			} else {
				$('.block-blog .posts').isotope({
					itemSelector : 'article'
				});
				
				$(window).resize(function() {
					$('.block-blog .posts').isotope('reLayout');
				});
				
				$('#tmp').remove();
			}
		});
	}
	
	loadImages();
}

//Init blog
function initBlog() {
	$('.block-blog .posts').isotope({
		itemSelector:'article'
	});
	
	$(window).resize(function() {
		$('.block-blog .posts').isotope('reLayout');
	});
}

//Init view more button
function initButtonMore() {
	$('#view_more_button').bind('click', function(e) {
		var target = $(this).attr('data-target');
		var container = $(target);
		var old_content = $('article', container);
		var new_content = old_content.clone().filter(':gt(2)').remove(); //Instead of this do ajax request and get new elements, this line only for demo
		
		if($(target).hasClass('isotope')) {
			$(target).isotope('remove', old_content);
			old_content.remove();
			$(target).isotope('insert', new_content);
		} else {
			$(target).append(content);
		}
		
		initBlogSlider('#blog_slider'); //Remove it
		
		$.scrollTo('#blog', 700);
		
		e.preventDefault();
	});
}

//Init blog slider
function initBlogSlider(target) {
	$(target).flexslider({
		animation:'fade',
		controlNav:false,
		directionNav:true,
		animationLoop:true,
		slideshow:false,
		useCSS:true,
		start:function(slider) {
			$(target).find('.flex-direction-nav li a.flex-prev').html('<i class="icon-left-open"></i>');
			$(target).find('.flex-direction-nav li a.flex-next').html('<i class="icon-right-open"></i>');
		}
	});
}

//Init quote slider
function initQuoteSlider(target) {
	$(target).flexslider({
		animation:'slide',
		controlNav:false,
		directionNav:false,
		animationLoop:true,
		slideshow:true,
		slideshowSpeed:5000,
		animationSpeed:500,
		useCSS:true,
		touch:false,
		move:1
	});
}

//Init scroll links
function initScrollLinks() {
	$('.lnk-scroll').bind('click', function(e) {
		e.preventDefault();
		var destination = $(this).attr('href');
		$.scrollTo(destination, 500);		
	});
}

//Init touch hover
function initTouchHover() {
	$('.hover').bind('click', function() {
		$(this).parent().toggleClass('hovered');
	});
}

//Init contact form
function initContactForm() {
	$('#contact_form').ajaxForm({
		beforeSubmit:function() {
			return initValidation('#contact_form');
		},
		success:function() {
			alert('Your message has been sent!');
			$('#contact_form').resetForm();
		}
	});
}

//Init contact form validation
function initValidation(target) {
	function validate(target) {
		var valid = true;
		
		$(target).find('.req').each(function() {
			if($(this).val() == '') {
				valid = false;
				$(this).parent().addClass('errored');
			} else {
				$(this).parent().removeClass('errored');
			}
		});
		return valid;
	}
	
	$('form.w_validation').submit(function(e) {
		var valid = validate(this);
		if(!valid) e.preventDefault();
	});
	
	if(target) {
		return validate(target);
	}
}

//Init Twitter feed
function initTwitterFeed() {
	$(".tweets").tweet({
		join_text:false,
		username:'flashblue80', //Change username
		modpath:'./layout/plugins/twitter/',
		avatar_size:false,
		count:1,
		auto_join_text_default:' we said, ',
		auto_join_text_ed:' we ',
		auto_join_text_ing:' we were ',
		auto_join_text_reply:' we replied to ',
		auto_join_text_url:' we were checking out ',
		loading_text:'Loading tweets...'
	});	
}

//Remove query loader
function removeQueryLoader() {
	$('.wrapper').css('opacity', 1);
}

//Init all required elements when document ready
$(document).ready(function() {
	initMenu();
	initFields();
	initScrollLinks();
	initServices();
	initPrettyPhoto();
	initProjectItem();	
	initTwitterFeed();
	initButtonMore();
	initContactForm();
	initMap();
	
	if(isMobile) {
		$('body').addClass('touch-device');
		initStats(false);
		initSkills(false);
		initTouchHover();
		initFilter();
		initBlogMobile();
		removeQueryLoader();
		$('.loader').removeClass('loader');		
	} else {
		$('body').addClass('desktop-device').queryLoader2({
			backgroundColor:'#fff',
			barColor:'#ebf1f3',
			barHeight:5,
			percentage:true,
			onComplete:function() {
				removeQueryLoader();
			}
		});
		
		initBlockAnimation();
	}
	
	//Audio player
	$('audio').mediaelementplayer({
		audioWidth:'100%',
		audioHeight:30,
		features:['playpause', 'current', 'progress', 'duration', 'volume']
	});
	
	initMainSlider('#main_slider');
	initProjects('#projects_wrapper');
	initTeamSlider('#team_slider');
	initQuoteSlider('#quote_slider');
});

//Window load
$(window).load(function() {
	initValidation();
	
	if(!isMobile) {
		initFilter();
		initBlog();
		$('.loader').removeClass('loader');
	}
});

//Window resize
$(window).resize(function() {
	initProjects('#projects_wrapper');
});


