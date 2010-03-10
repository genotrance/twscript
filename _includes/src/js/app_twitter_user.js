////
// User specific Twitter functions

// Get authenticated or specified user's information from Twitter
//   function callback    - function to call on completion : function ()
//   string   screen_name - screen_name whose info to load : name, undefined
function app_load_user(callback, screen_name) {
	if (screen_name == undefined) {
		// Get authenticated user's info
	    tw_get("verify_credentials", function (data, status) {
	        tw_user = data.screen_name;
	        tw_user_info[data.screen_name.toLowerCase()] = $.extend(true, {}, data);
	        
	    	// Execute callback
	    	if (callback != undefined && typeof(callback) == "function") {
	    		callback();
	    	}	        
	    });
	} else {
		// Get specified user's info
		tw_get("users_show", function (data, status) {
			tw_user_info[data.screen_name.toLowerCase()] = $.extend(true, {}, data);
		
			// Execute callback
			if (callback != undefined && typeof(callback) == "function") {
				callback();
			}
		}, {screen_name: screen_name});
	}	
}

// Get specified user's information - load if not cached
//   function callback    - function to call on completion : function ()
//   string   screen_name - screen_name whose info to load : name
function app_get_user(callback, screen_name) {
	// Lowercase for search
	screen_name = screen_name.toLowerCase();
	
	// Load user info if not already available
	if (!(screen_name in tw_user_info)) {
		app_load_user(
			function () {
				if (screen_name in tw_user_info) {
			    	// Execute callback
			    	if (callback != undefined && typeof(callback) == "function") {
			    		callback();
			    	}
				}
			}, 
			screen_name
		);
		return;
	}
	
	// Execute callback
	if (callback != undefined && typeof(callback) == "function") {
		callback();
	}	        
}