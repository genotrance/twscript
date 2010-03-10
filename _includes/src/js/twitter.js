////
// Twitter API

// Twitter URL
var tw_base_url = [
    "https://api.twitter.com",
    "http://nest.onedd.net/api"
];

// Twitter user information - populated by app_load_user()
var tw_user = "";
var tw_user_info = {};

// Twitter API version
var tw_api_ver = "1";

// Tweet length
var tw_length = 140;

// Twitter API map
var tw_api_map = {
	// Timelines
    home: "statuses/home_timeline",
    replies: "statuses/mentions",
    profile: "statuses/user_timeline",
    
    // Actions
    update: "statuses/update",
    destroy: "statuses/destroy",
    retweet: "statuses/retweet",
    favorite: "favorites/create",
    unfavorite: "favorites/destroy",
    
    // User
    verify_credentials: "account/verify_credentials",
    users_show: "users/show", 
    
    // Social graph
    followers: "followers/ids",
    friendships_show: "friendships/show"
};

// Replacements
//   Syntax:
//     tw_repl_map       = { tweet_field: replace_array, tweet_field_array: tw_repl_map }
//     tweet_field       = name:value fields such as created_at, text, id, etc. Refer Twitter API
//     tweet_field_array = name:array fields such as user, retweeted_status, etc. Refer Twitter API
//     replace_array     = [{ name: string, search: regex, replace: string }, { name: string, replace: function }]
var tw_repl_map = {
    source: 
    [{ 
        // Open Tweet source link in new window
    	name: "open_source_in_new_window",
        search: /href/, 
        replace: "target=_blank href" 
    }],

    text: 
    [{
        // Replace URLs with clickable links with [+] as text, use GWT if mobile device and opted
    	name: "url_with_plus",
        replace: function (val) {
            if (app_get_setting("mobile_device") == "No" || app_get_setting("use_gwt") == "No") {
                repl = '<a href="$&" target=_blank>[+]</a>';
            } else {
                repl = '<a href="http://www.google.com/gwt/n?u=$&" target=_blank>[+]</a>';
            }

            return val.replace(/http[s]*:\/\/[a-zA-Z0-9\/.:~#%&\-_+=,?]+/g, repl);
         }
    },{ 
        // Replace @screen_name with link to Twitter
    	name: "screen_name_url",
        search: /(^| |\.)@([a-zA-Z0-9_]+)/g, 
        replace: '$1<a href="http://twitter.com/$2" target=_blank>@$2</a>' 
    },{
        // Replace #tags with search link
    	name: "hash_tag_url",
        search: /(^| |\.)#([a-zA-Z0-9_]+)/g,
        replace: '$1<a href="http://search.twitter.com/search?q=#$2" target=_blank>#$2</a>'
    }],

    created_at:
    [{
        // Replace date string with localtime
    	name: "date_string",
        replace: function (val) {
             return (new Date(val)).toLocaleTimeString();
        }
    }]
};

// Add or update the tw_repl_map
//	string field   - field in tweet to replace    : tweet[field]
//  string name    - name for this replacement    : open_source_in_new_window
//	object search  - what to search for - a regex : /href/
//  string replace - what to replace with         : "target=_blank href"
function tw_repl_map_update(field, name, search, replace) {
	if (field in tw_repl_map) {
		// Update existing value in tw_repl_map
		for (i = 0; i < tw_repl_map[field].length; i++) {
			// First match name
			if (tw_repl_map[field][i].name == name) {				
				// Update search field if specified
				if (search != null) {
					tw_repl_map[field][i].search = search;
				} 
				
				// Update replace field if specified
				if (replace != null) {
					tw_repl_map[field][i].replace = replace;
				}
				
				break;
			}
		}
	} else {
		// Add new value to tw_repl_map
		
		// Skip if invalid values
		if (field == null || name == null) {
			return;
		}
		
		// If search is regex or string, and replace is strings
		if (search != null && typeof(replace) == "string") {
			tw_repl_map[field] = [{name: name, search: search, replace: replace}];
		}
		
		// If search is null and replace is function
		if (search == null && typeof(replace) == "function") {
			tw_repl_map[field] = [{name: name, replace: replace}];
		}
	}
}

// Filters
//   operation field [not] [like] match [with data] [if|unless field [not] [like] match]
//
//   operations:
//     display: highlight, mute
//     twitter: unfollow, retweet, reply
//   condition:
//     
//
//   mute screen_name xxx unless text contains yyy
//   mute screen_name xxx
//   highlight screen_name xxx if text contains yyy
//   Syntax:

function tw_filter_gen(filter) {
    sp = "[ ]*";
    operation = "[a-z]+";
    field = "[a-z_\.]+";
    not = "((?not)?)";
    like = "((?like)?)";
    match = "(.+)";

//  return filter.replace(new RegExp("/^" + operation + sp + field + sp + not + sp + like + sp + 

    return filter.replace(/^([a-zA-Z]+)[ ]*([a-zA-Z0-9_\.]+)[ ]*((?:not)?)[ ]*((?:like)?)[ ]*([a-zA-Z0-9]+)$/,
        "op: $1, fl: $2, not: $3, like: $4, pat: $5");
}

// Get data from Twitter
//   string   method   - method defined in tw_api_map          : tw_api_map[method]
//   function callback - function to call on completion of get : function (data, status)
//   object   data     - additional data to pass in URL        : {name: value, name: value}
function tw_get(method, callback, data) {
    // Add parameters if specified
    if (data != undefined) {
        $.extend(true, data, {count: app_get_setting("tw_count")});
    } else {
        data = {count: app_get_setting("tw_count")};
    }

    $.ajax({
        type: "GET",
        url: tw_get_url() + "/" + tw_api_map[method] + ".json",
        data: data,
        dataType: "jsonp",
        success: callback,
        error: tw_error
    });
}

// Render template to post data to Twitter
//   string method   - method defined in tw_api_map : tw_api_map[method]
//   string template - template to render           : textarea id="template_tpl"
//   object data     - data to render in template   : {name: value, name: value}
function tw_post(method, template, data) {
    // Add target URL
    $.extend(true, data, {action: tw_get_url() + "/" + tw_api_map[method]});

    // Return rendered template
    return app_output_template(template, data);
}

// Get the Twitter API URL
function tw_get_url() {
    base_url = app_get_setting("tw_base_url");

    // HACK : If birdnest use unversioned API
    if (base_url == tw_base_url[1]) tw_api_ver = "";

    // Append API version to URL
    if (tw_api_ver == "")
        return base_url;
    else
        return base_url + "/" + tw_api_ver;
}
