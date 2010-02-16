////
// Twitter actions

// Reply to a Tweet
function reply(id) {
    $("#post_a").click();
    screen_name = $.trim($("#n" + id).text());
    $("#update").val("@" + screen_name + " ");
    $("#in_reply_to_status_id").val(id);
    update_length();
    $("#update").focus();
}

// Old-style retweet
function old_retweet(id) {
	$("#post_a").click();
    screen_name = $.trim($("#n" + id).text());
    update = "RT @" + screen_name + " " + $.trim($("#t" + id).text());
    $("#update").val(update.substr(0, 140));
    $("#in_reply_to_status_id").val("");
    update_length();
    $("#update").focus();
}

// Destroy a tweet
function destroy(id) {
    $("#error").html("Deleting...");
    app_tw_destroy(id, function() {
        $("#" + id).fadeOut();
        $("#error").html("");
    });
}

// New retweet
function retweet(id) {
    $("#error").html("Retweeting...");
    app_tw_retweet(id, function() {
        $("#error").html("");
    });
}

// Favorite a tweet
function favorite(id) {
    $("#error").html("Marking favorite...");
    app_tw_favorite(id, function() {
        $("#" + id).addClass("favorite");
        $("#error").html("");
    });
}

// unFavorite a tweet
function unfavorite(id) {
    $("#error").html("Removing favorite...");
    app_tw_unfavorite(id, function() {
        $("#" + id).removeClass("favorite");
        $("#error").html("");
    });
}
