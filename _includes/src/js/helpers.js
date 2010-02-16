////
// INTERNAL
// --------

////
// Application internal

// Initialize on startup
$(document).ready(function () {
    app_init();
});

// Clear events on unload
$(window).bind("beforeunload", function(e) {
    app_cancel_run(true);
});

// Detect mobile devices
function app_mobile_detect() {
    // Don't detect if user specified mobile device
    if (app_get_setting("mobile_device") == "Yes") {
        return;
    }

    // Detect based on user agent
    uagent = navigator.userAgent.toLowerCase();

    if ((uagent.search("iphone") > -1) ||
        (uagent.search("ipod") > -1) ||
        (uagent.search("android") > -1) ||
        (uagent.search("blackberry") > -1) ||
        (uagent.search("webos") > -1) ||
        (uagent.search("series60") > -1) ||
        (uagent.search("symbian") > -1) ||
        (uagent.search("windows ce") > -1)
    ) {
        app_set_setting("mobile_device", "Yes");
    }
}

// Load selected skin
function app_load_skin() {
    // Get user specified skin
    skin = app_get_setting("skin");

    // Load HTML templates
    $("#theme_templates").load("skins/" + skin + ".html", function () {
        // Load JS
        app_load_script("skins/" + skin + ".js", function () {
            // Load main application template
            app_render_template("theme_init", "theme", {});
        });
    });
}

////
// Twitter internal

// Handle Twitter errors
function tw_error(req, stat, err) {
    if (stat != null) {
        alert("Error: " + stat);
        return;
        $("#error").text("Error: " + stat);

        // Clear error after 10 seconds
        app_delayed_run(10000, function() {
            $("#error").text("");
        });
    }
}

// Massage JSON data received from Twitter
function tw_massage(data) {
    $.each(data, function(key, val) {
    	// Save user information
    	if ("user" in val) {
    		tw_user_info[val["user"]["screen_name"].toLowerCase()] = $.extend(true, {}, val["user"]);
    	}
        data[key] = tw_massage_map(data[key], tw_repl_map);
    });

    return data;
}

// Massage tweet data recursively
function tw_massage_map(data, map) {
    if (!data) return data;

    $.each(map, function (key, val) {
        if ($.isArray(val) == true) {
            data[key + "_orig"] = data[key];
            $.each(val, function (i, repl) {
                if (typeof(repl["replace"]) == "function")
                    data[key] = repl["replace"](data[key]);
                else
                    data[key] = data[key].replace(repl["search"], repl["replace"]);
            });
        } else {
            data[key] = tw_massage_map(data[key], map[key]);
        }
    });

    return data;
}
