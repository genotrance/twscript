////
// Loading pages

// Load items
function load(method, cancel_refresh, data, type, last_id) {
	if (cancel_refresh == true) {
        // Cancel pending refreshes
        app_cancel_run();
    }

    if (type != undefined) {
        // Get more items
        app_get(
        	method, "theme_tweets", 
        	function () {
        		if (type == "older") app_scroll_bottom("theme_contents_div");
        	}, 
        	data, type, last_id
        );

        // Setup auto refresh
        app_delayed_run(app_get_setting("auto_refresh") * 60000, refresh);
    } else {
        // Set as active
        app_div_hide(divs, method);
        if (method != "profile") $("#profile_details_div").hide();

        if ($("#" + method + "_div").html() == "") {
            // Load first time
            app_get(method, "theme_tweets", null, data);

            // Setup auto refresh
            app_delayed_run(app_get_setting("auto_refresh") * 60000, refresh);
        } else {
            // Load more items
            load_more("newer");
        }
    }
}

// Load more items
function load_more(type, cancel_refresh) {
    // Find active method
    div = app_div_active(divs);
    
    // Get screen_name if profile page and older
    data = {};
    if (div == "profile" && type == "older")
    	data = {screen_name: $("#profile_details_div > a:last").html()};

    // Get last ID in this div
    last_id = get_last_id(div, type);

    // Load 
    load(div, cancel_refresh, data, type, last_id);
}

// Load settings page
function load_settings_page() {
    // Make active div
	app_div_hide(divs, "settings");
	$("#profile_details_div").hide();

	// Render page
    app_render_template("settings", "settings", {});
}

// Load profile page
function load_profile(screen_name) {
	// Load profile
	$("#error").html("Loading...");
	app_get_user(
		function () {
			// Clear message
			$("#error").html("");
			
			// Clear and load recent tweets
			$("#profile_div").html("");
			load("profile", true, {screen_name: screen_name});

			// Render profile details template
			out = app_output_template("profile_details", {user: tw_user_info[screen_name]});
			$("#profile_details_div").html(out).show();
		},
		screen_name
	);	
}

// Get tweet ID for specified method - newer or older type
function get_last_id(method, type) {
    if (type == "newer")
        return $("#" + method + "_div > div.tweet:first").attr("id");
    else if (type == "older") 
        return $("#" + method + "_div > div.tweet:last").attr("id");
}

// Refresh current tab
function refresh() {
    // Load newer items in active div
    load_more("newer");
}
