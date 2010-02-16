////
// Variables and Initialization

// Theme settings
theme_settings = {
    theme_main_color: {
        desc: "Main theme color",
        check: app_is_hex_color,
        value: "#0000EE"
    },
    theme_fav_color: {
        desc: "Color of favorite tweets",
        check: app_is_hex_color,
        value: "#DD00DD"
    },
    theme_high_color: {
        desc: "Color of highlighed tweets",
        check: app_is_hex_color,
        value: "#FF0000"
    }
};

// DIVs to create
divs = ["home", "replies", "profile", "settings"];

// Initialization
function theme_init() {
    // Register settings
    app_add_settings(theme_settings);
    
    // Change tw_repl_map
    tw_repl_map_update("text", "screen_name_url", null, '$1<a href="#" onclick="load_profile(\'$2\');return false;">@$2</a>');

    // Render contents
    app_render_template("theme_contents", "theme_contents", {});
}

// Onload function
function theme_onload() {
    app_div_create(divs, "theme_contents", false);
    load("home");
}
