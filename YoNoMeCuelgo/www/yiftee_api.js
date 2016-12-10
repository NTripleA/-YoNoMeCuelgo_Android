(function($) {

/*---------------------------
 Defaults for Reveal
----------------------------*/

/*---------------------------
 Listener for data-reveal-id attributes
----------------------------*/

	$(document).on('a[data-reveal-id]','click', function(e) {
		e.preventDefault();
		var modalLocation = $(this).attr('data-reveal-id');
		$('#'+modalLocation).reveal($(this).data());
	});

/*---------------------------
 Extend and Execute
----------------------------*/

    $.fn.reveal = function(options) {


        var defaults = {
	    	animation: 'fadeAndPop', //fade, fadeAndPop, none
		    animationspeed: 300, //how fast animtions are
		    closeonbackgroundclick: true, //if you click background will modal close?
		    dismissmodalclass: 'close-reveal-modal' //the class of a button or element that will close an open modal
    	};

        //Extend dem' options
        var options = $.extend({}, defaults, options);

        return this.each(function() {

/*---------------------------
 Global Variables
----------------------------*/
        	var modal = $(this),
        		topMeasure  = parseInt(modal.css('top')),
				topOffset = modal.height() + topMeasure,
          		locked = false,
				modalBG = $('.reveal-modal-bg');

/*---------------------------
 Create Modal BG
----------------------------*/
			if(modalBG.length == 0) {
				modalBG = $('<div class="reveal-modal-bg" />').insertAfter(modal);
			}

/*---------------------------
 Open & Close Animations
----------------------------*/
			//Entrance Animations
			modal.bind('reveal:open', function () {
			  modalBG.unbind('click.modalEvent');
				$('.' + options.dismissmodalclass).unbind('click.modalEvent');
				if(!locked) {
					lockModal();
					if(options.animation == "fadeAndPop") {
						modal.css({'top': $(document).scrollTop()-topOffset, 'opacity' : 0, 'visibility' : 'visible'});
						modalBG.fadeIn(options.animationspeed/2);
						modal.delay(options.animationspeed/2).animate({
							"top": $(document).scrollTop()+topMeasure + 'px',
							"opacity" : 1
						}, options.animationspeed,unlockModal());
					}
					if(options.animation == "fade") {
						modal.css({'opacity' : 0, 'visibility' : 'visible', 'top': $(document).scrollTop()+topMeasure});
						modalBG.fadeIn(options.animationspeed/2);
						modal.delay(options.animationspeed/2).animate({
							"opacity" : 1
						}, options.animationspeed,unlockModal());
					}
					if(options.animation == "none") {
						modal.css({'visibility' : 'visible', 'top':$(document).scrollTop()+topMeasure});
						modalBG.css({"display":"block"});
						unlockModal()
					}
				}
				modal.unbind('reveal:open');
			});

			//Closing Animation
			modal.bind('reveal:close', function () {
			  if(!locked) {
					lockModal();
					if(options.animation == "fadeAndPop") {
						modalBG.delay(options.animationspeed).fadeOut(options.animationspeed);
						modal.animate({
							"top":  $(document).scrollTop()-topOffset + 'px',
							"opacity" : 0
						}, options.animationspeed/2, function() {
							modal.css({'top':topMeasure, 'opacity' : 1, 'visibility' : 'hidden'});
							unlockModal();
						});
					}
					if(options.animation == "fade") {
						modalBG.delay(options.animationspeed).fadeOut(options.animationspeed);
						modal.animate({
							"opacity" : 0
						}, options.animationspeed, function() {
							modal.css({'opacity' : 1, 'visibility' : 'hidden', 'top' : topMeasure});
							unlockModal();
						});
					}
					if(options.animation == "none") {
						modal.css({'visibility' : 'hidden', 'top' : topMeasure});
						modalBG.css({'display' : 'none'});
					}
				}
				modal.unbind('reveal:close');
			});

/*---------------------------
 Open and add Closing Listeners
----------------------------*/
        	//Open Modal Immediately
    	modal.trigger('reveal:open')

			//Close Modal Listeners
			var closeButton = $('.' + options.dismissmodalclass).bind('click.modalEvent', function () {
			  modal.trigger('reveal:close')
			});

			if(options.closeonbackgroundclick) {
				modalBG.css({"cursor":"pointer"})
				modalBG.bind('click.modalEvent', function () {
				  modal.trigger('reveal:close')
				});
			}
			$('body').keyup(function(e) {
        		if(e.which===27){ modal.trigger('reveal:close'); } // 27 is the keycode for the Escape key
			});


/*---------------------------
 Animations Locks
----------------------------*/
			function unlockModal() {
				locked = false;
			}
			function lockModal() {
				locked = true;
			}

        });//each call
    }//orbit plugin call
})(jQuery);


	jQuery(document).ready(function(){
	jQuery(document.body).append('<div id="modalDialog" class="reveal-modal .xlarge"></div>');

	});

	var phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
var emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;


function validateEmail(email) {
	return emailRegex.test(email);
}

function validatePhone(phone) {
	return phoneRegex.test(phone);
}

	function sendGift(options)
	{
		var dataParams = "";


		var api_token = "";

		var recipient_name = "";
		var recipient_email = "";
		var recipient_phone = "";
		var message = "";
		//Check email and phone and print error if there is one

		var sender_name = "";

		var ll = "";
		var ll_label = "";
		var radius = "";
		var query = "";
		var sender_id_hash = "";

		var limit = "";

		if(typeof options.api_token != 'undefined'){
			api_token = options.api_token;
		}
		if(typeof options.recipient_name != 'undefined'){
			recipient_name = options.recipient_name;
		}
		if(typeof options.recipient_email != 'undefined'){
			recipient_email = options.recipient_email;
		}
		if(typeof options.recipient_phone != 'undefined'){
		  recipient_phone = options.recipient_phone;
		}
		if(typeof options.message != 'undefined'){
			message = options.message;
		}
		if(typeof options.sender_name != 'undefined'){
			sender_name = options.sender_name;
		}
		if(typeof options.ll != 'undefined'){
			ll = options.ll;
		}
		if(typeof options.ll_label != 'undefined'){
			ll_label = options.ll_label;
		}
		if(typeof options.radius != 'undefined'){
			radius = options.radius;
		}
		if(typeof options.query != 'undefined'){
			query = options.query;
		}
		if(typeof options.sender_id_hash != 'undefined'){
			sender_id_hash = options.sender_id_hash;
		}
		if(typeof options.limit != 'undefined'){
			limit = options.limit;
		}

		if(api_token == "")
		{
			console.error = "MISSING API_TOKEN PARAMETER.";
		}

		//Check email and phone and print error if there is one
		if(recipient_email == "" && recipient_phone == "")
		{
			console.error = "MISSING EITHER RECIPIENT_EMAIL OR RECIPIENT_PHONE FOR GIFT.";
		}else if(!validateEmail(recipient_email) && !validatePhone(recipient_phone))
		{
			if(recipient_email != "" && !validateEmail(recipient_email))
			{
				console.error = "BAD RECIPIENT_EMAIL PARAMETER: " + recipient_email;
			}
			if(recipient_phone != "" && !validatePhone(recipient_phone))
			{
				console.error = "BAD RECIPIENT_PHONE PARAMETER: " + recipient_phone;
			}
		}

		if(ll == "")
		{
			console.error = "MISSING LL PARAMETER TO SPECIFY LOCATION FOR GIFTS";
		}else if(ll.indexOf(",") == -1)
		{
			console.error = "BAD FORMAT FOR LL PARAMETER: " + ll;
		}




		//Check for ll
		//HAVE DEFAULTS if anything is missing
		dataParams = dataParams + "api_token=" + api_token;
		dataParams = dataParams + "&sender_name=" + sender_name;
		dataParams = dataParams + "&recipient_name=" + recipient_name;
		dataParams = dataParams + "&recipient_email=" + recipient_email;

		dataParams = dataParams + "&recipient_phone=" + recipient_phone;
		dataParams = dataParams + "&ll=" + ll;
		//if location
		dataParams = dataParams + "&ll_label=" + ll_label;
		//if radius
		dataParams = dataParams + "&radius=" + radius;
		dataParams = dataParams + "&message=" + message;
		dataParams = dataParams + "&query=" + query;
		dataParams = dataParams + "&sender_id_hash=" + sender_id_hash;
		dataParams = dataParams + "&limit=" + limit;

		var final_url = "https://app.yiftee.com/api/v1/gifts/send.html?" + dataParams;
		if( /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent) ) {
 			window.location.href = final_url;
		}else{
			jQuery('#modalDialog').html('<iframe onload="hideLoading(jQuery(this).parent())" frameBorder="0" style="border:none" id="videoFrame" src="' + final_url + '" width="600" height="500" frameborder="1" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe><div id="loading_animation_test" style="position:absolute; top:40%; left:40%;"><center><img src="http://www.yiftee.com/assets/loading-gif-animation.gif" /></center></div>');
		  	jQuery('#modalDialog').append('<a class="close-reveal-modal">&#215;</a>');
		  	jQuery('#modalDialog').reveal({
		     animation: 'fadeAndPop',                   //fade, fadeAndPop, none
		     animationspeed: 300,                       //how fast animtions are
		     closeonbackgroundclick: true,              //if you click background will modal close?
		     dismissmodalclass: 'close-reveal-modal'    //the class of a button or element that will close an open modal
		  	});

		  	jQuery(".close-reveal-modal").click(function(){
		    	jQuery("#yifteeFrame").hide();
		    	return false;
		  	});
		}


	}

function hideLoading(ele){
	jQuery(ele).find("#loading_animation_test").hide();
}
