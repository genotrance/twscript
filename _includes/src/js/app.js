////
// Base application functions

// Initialization function
function app_init() {
    // Load user settings
    app_load_settings();

    // Detect if mobile device
    app_mobile_detect();

    // Load user information from Twitter
    app_load_user();

    // Load skin
    app_load_skin();
}

////
// Twitter interaction

// Get data from Twitter and render
//   string   method   - method defined in tw_api_map           : tw_api_map[method]
//   string   template - textarea containing template to render : textarea id="template_tpl"
//   function callback - function to call on completion of get  : function ()
//   object   data     - additional data to pass in URL         : {name: value, name: value}
//   string   type     - which tweets to get                    : newer, older, undefined
//   int      tweet_id - reference tweet                        : newer/older with respect to this tweet
function app_get(method, template, callback, data, type, tweet_id) {
	if (data == undefined) data = {};
	
    if (type != undefined) {
    	// Newer or older tweets
    	if (type == "newer") {
    		data = $.extend(data, {since_id: tweet_id});
    	} else {
    		data = $.extend(data, {max_id: tweet_id-1});
    	}
    	
        // Get older/newer than specfied tweet_id
        tw_get(
            method, 
            function (data, stat) {
                data = tw_massage(data);
                out = app_output_template(template, {tweets: data, method: method, type: type});
                div = $("#" + method + "_div");
                if (type == "newer") 
                    div.prepend(out);
                else 
                    div.append(out);

                // Call specified callback
                if (typeof(callback) == "function") callback();
            }, 
            data
        );
    } else {
        // Get latest tweets
        tw_get(
        	method, 
        	function (data, stat) {
            	data = tw_massage(data);
            	app_render_template(template, method, {tweets: data, method: method, type: type});

                // Call specified callback
                if (typeof(callback) == "function") callback();
        	},
        	data
        );
    }
}

// Post data to Twitter and render
//   string   method   - method defined tw_api_map              : tw_api_map[method]
//   string   template - template to render                     : textarea id="template_tpl"
//   object   data     - data to render in template             : {name: value, name: value}
//   function callback - function to call on completion of post : function ()
function app_post(method, template, data, callback) {
    // Render form in iframe
    $("#iframe_id").contents().find("html").html(tw_post(method, template, data));

    // Post form
    $("#iframe_id").contents().find("#" + data["form_id"]).submit();

    // On completion 
    $("#iframe_id").load(function() {
        // Unload load event or infinite loop
        $("#iframe_id").unbind("load");

        // Reset URL to reuse iframe
        window.frames["iframe_id"].location.href = "about:blank";

        // Call specified callback
        if (typeof(callback) == "function") callback();
    });
}

////
// Template rendering

// Render template
//   string template - textarea containing template to render : textarea id="template_tpl"
//   string div      - render template in this div            : div id="div_div"
//   object data     - data to render in template             : [name: value, name: array, name: object]
function app_render_template(template, div, data) {
	$("#" + div + "_div").html(app_output_template(template, data));
}

// Output template
//   string template - textarea containing template to render : textarea id="template_tpl"
//   object data     - data to render in template             : [name: value, name: array, name: object]
function app_output_template(template, data) {
	// Provide user settings and Twitter user information to template
	$.extend(true, data, {
		app_user_settings: app_user_settings,
		tw_user: tw_user,
		tw_user_info: tw_user_info
	});

	return new EJS({text: $("#" + template + "_tpl").text()}).render(data);
}

////
// DIV manipulation

// Create divs in target
//   array  divs   - list of divs to create           : ["home", "replies"] creates id="home_div" ...
//   string target - div to place created divs        : div id="target_div"
//   bool   clear  - clear target div before creation : true, false, undefined
function app_div_create(divs, target, clear) {
	 // Default initialize
	 if (clear == undefined) clear = true;
	
	 if (clear) $("#" + target + "_div").empty();
	 $.each(divs, function (i, div) {
		 $("#" + target + "_div").append('<div id="' + div + '_div" style="display: none;"></div>');
	 });
}

// Hide all divs
//   array  divs   - list of divs to hide : ["home", "replies"]
//   string except - div to show          : home shows id="home_div"
function app_div_hide(divs, except) {
	 // Default initialize
	 except = except || "";
	
	 $.each(divs, function(i, div) {
	     if (div == except) $("#" + div + "_div").show();
	     else $("#" + div + "_div").hide();
	 });
}

// Find active div
//   array divs - list of divs to check : ["home", "replies"] checks id="home_div" ...
function app_div_active(divs) {
	 for (i = 0; i < divs.length; i++) {
	     if ($("#" + divs[i] + "_div").css("display") == "block") return divs[i];
	 }
}

////
// Delayed running of functions

// Run specified callback after timeout
//   int      timeout  - delay in milliseconds        : 10000
//   function callback - function to call after delay : function ()
function app_delayed_run(timeout, callback) {
	$("body").animate({opacity: 1.0}, timeout, callback);
}

// Kill all pending delayed runs
function app_cancel_run() {
	$("body").stop();
}

////
// UI manipulation

// Scroll to top of specified element
//   string id - ID of element to scroll to the top of : main_div
function app_scroll_top(id) {
	$(document).scrollTop($("#" + id).offset().top);
}

// Scroll to bottom of specified element
//   string id - ID of element to scroll to the top of : main_div
function app_scroll_bottom(id) {
	$(document).scrollTop($("#" + id).offset().top+$("#" + id).height());
}
