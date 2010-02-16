////
// User Settings API

// Default application settings
//   Syntax:
//     app_user_settings = { setting_name: setting_number, setting_name: setting_options }
//     setting_number   = { desc: "Description", value: 123, check: app_is_numeric }
//     setting_options  = { desc: "Description", options: ["1", "2"], value: 0 }
var app_user_settings = {
    skin: {
        desc: "Application Skin",
        options: {{ page.skins }},
        value: 0
    },
    tw_base_url: {
        desc: "Twitter API URL",
        options: tw_base_url,
        value: 0
    },
    tw_count: {
        desc: "#Statuses to load at a time",
        check: app_is_numeric,
        value: 25
    },
    auto_refresh: {
        desc: "Auto refresh in minutes",
        check: app_is_numeric,
        value: 3
    },
    mobile_device: {
        desc: "Force mobile mode",
        options: ["No", "Yes"],
        value: 0
    },
    use_gwt: {
        desc: "Use GWT in mobile mode",
        options: ["No", "Yes"],
        value: 1
    }
};

// Get specified setting value
//   string name - key in app_user_settings : tw_count
function app_get_setting(name) {
    if (name in app_user_settings) {
        if ("options" in app_user_settings[name])
            return app_user_settings[name]["options"][app_user_settings[name]["value"]];
        else
            return app_user_settings[name]["value"];
    } else {
        return null;
    }
}

// Set specified setting to value
//   string name  - key in app_user_settings                        : tw_count
//   string value - value to set to (convert to offset for options) : 5
function app_set_setting(name, value) {
    if (name in app_user_settings) {
        if ("options" in app_user_settings[name]) {
            $.each(app_user_settings[name]["options"], function (key, val) {
                if (val == value) app_user_settings[name]["value"] = key;
            });
        } else
            app_user_settings[name]["value"] = value;
    }
}

// Save user settings as a cookie
//   string form - ID of form if called from form or undefined : form onsubmit="app_save_settings(this);"
function app_save_settings(form) {
    // Create settings values object
    settings = {};
    $.each(app_user_settings, function (key, val) {
        if (form != undefined) {
            // Get data from form
            value = $("#" + key).val();

            // Check value
            if ("check" in val) {
                if (app_user_settings[key]["check"](value) == false) {
                    $("#" + key).css("color", "red");
                    return false;
                } else
                    $("#" + key).css("color", "black");
            }

            // Save setting
            settings[key] = value;
        } else 
            // Use default value
            settings[key] = app_get_setting(key);
    });

    // Save settings in browser
    $.cookie('twscript_user_settings', $.toJSON(settings), {expires: 365});

    // Reinit application
    app_init();

    // Return false to stop reload
    return false;
}

// Load user settings from cookie
function app_load_settings() {
    settings = $.evalJSON($.cookie('twscript_user_settings'));
    if (settings != null) {
        $.each(settings, function (key, val) {
            app_set_setting(key, val);
        });
    } else {
        app_save_settings();
    }
}

// Add additional settings for themes
//   object settings - settings to add to global settings : Refer app_user_settings syntax
function app_add_settings(settings) {
    $.extend(true, app_user_settings, settings);
    app_load_settings();
}

// Check if value is numeric
//   string val - value to check if numeric : 5
function app_is_numeric(val) {
    if (val.match(/^[\d]+$/) == null) 
        return false;
    else 
        return true;
}

// Check if value is hexadecimal color
function app_is_hex_color(val) {
    if (val.match(/^#[\da-fA-F]+$/) == null)
        return false;
    else
        return true;
}
