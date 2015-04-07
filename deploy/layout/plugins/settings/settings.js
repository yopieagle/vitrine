var parameters =  new Array();

var settings_block = '<div class="block-settings-wrapper">\
		<div id="block_settings" class="block_settings">\
			<section>\
				<span class="orange" title="Orange" />\
				<span class="green" title="Green" />\
				<span class="blue" title="Blue" />\
				<span class="turquoise" title="Turquoise" />\
				<span class="yellow" title="Yellow" />\
				<span class="grey" title="Grey" />\
			</section>\
			<a href="#" id="settings_close">Close</a>\
		</div>\
	</div>';

//Init color buttons
function initColor() {
	$('.block-settings-wrapper section span').click(function() {	
		var cls = $(this).attr('class');
		$('#logo img').attr('src', 'images/logo-'+cls+'.png');
		$("link.colors").attr('href', 'layout/colors/'+cls+'.css');
	});
}

//Init open/close button	
function initClose() {
	parameters.push('opened');
	
	$('#settings_close').click(function(e) {
		$('body').toggleClass('opened-settings');
		
		if(!$.cookies.get('opened')) {
			$.cookies.set('opened', 'opened-settings');
		} else {
			$.cookies.del('opened');
		}
		
		e.preventDefault();	
	});
}

//Init cookies
function initCookies() {
	for(key in parameters) {
		var name = parameters[key];
		var parameter = $.cookies.get(name);
		if(parameter) {
			$('body').addClass(parameter);
		}
	}
}

$(document).ready(function() {
	$('body').prepend(settings_block);
	initColor();	
	initClose();
	initCookies();
});