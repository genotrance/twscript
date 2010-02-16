////
// Popup menu

// Show popup
function show_popup(name, data, x, y, hide) {
    // Remove existing popup
    if ($("#" + name + "_div").length != 0) $("#" + name + "_div").remove();
    
    // Generate menu div
    data = $.extend(data, {left: x, top: y});
    $("body").append(app_output_template(name, data));

    // Register event to hide
    $(document).bind("click", [name, data], hide);
}

// Hide popup
function hide_popup(e, hide, loop) {
	// Check if event object available
	if (e == undefined) return;
	
	// Get user data from event
	name = e.data[0];
	data = e.data[1];
	
    // Return if no popup displayed
    if ($("#" + name + "_div").length == 0) return;

	// Get click_exempt from data
	if ("click_exempt" in data)
		click_exempt = data["click_exempt"];
	else
		click_exempt = [];
	
    // Default initialize
    if (loop == undefined) loop = false;

    // Extend exempt clickable objects
    click_exempt.push(name + "_a");
    click_exempt.push(name + "_div");
    
    // Get click target
    elem = e.target;
    
    // Check if click outside exempt objects
    while (elem != null) {
    	for (i = 0; i < click_exempt.length; i++) {
    		if (elem.id == click_exempt[i]) return;
    	}
        
        if (loop == false) break;
        
        elem = elem.parentNode;
    }

    // Remove since click was outside
    $("#" + name + "_div").remove();
    $(document).unbind("click", hide);
}

// Show menu
function show_menu() {
	id = $("#menu_a");
	show_popup("menu", {}, id.offset().left, id.offset().top+id.height(), hide_menu);
}

// Hide menu
function hide_menu(e) {
	hide_popup(e, hide_menu);
}

// Show post
function show_post() {
	id = $("#top_hr");
	show_popup("post", {click_exempt: ["tweet_actions_div"]}, id.offset().left, id.offset().top, hide_post);
	$("#update").focus();
}

// Hide post
function hide_post(e) {
	hide_popup(e, hide_post, true);
}

// Show actions
function show_actions(id) {
	data = 	{
		// Template data
	    tweet_id: id,
	    screen_name: $.trim($("#n" + id).text()),
	    is_favorite: ($("#" + id).hasClass("favorite"))?true:false,
	    		
	    // Hide click exempt
	    click_exempt: ["a" + id]
    };

	nid = $("#n" + id);
	show_popup("tweet_actions", data, nid.offset().left+nid.width(), nid.offset().top+nid.height(), hide_actions);
}

// Hide actions
function hide_actions(e) {
	hide_popup(e, hide_actions);
}
