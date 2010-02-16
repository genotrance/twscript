////
// PUBLIC API
// ----------

// Post update to Twitter including replies and old style retweets
//   string status                - Text to send as update             : "Hello World"
//   string in_reply_to_status_id - ID of tweet which this is reply to : 123456790 or ""
//   function callback            - function to call on completion     : function ()
function app_tw_update(status, in_reply_to_status_id, callback) {
    // Post update
    app_post(
        "update", "update",
        {
            form_id: "update_form",
            status: status.replace(/"/g, "&quot;"),
            in_reply_to_status_id: in_reply_to_status_id
        },
        callback
    );
}

// Perform specified action on Twitter status
//   string   method   - action to perform              : tw_api_map[method] - destroy, retweet, favorite, unfavorite
//   string   tweet_id - ID of the tweet to act on      : 123456789
//   function callback - function to call on completion : function ()
function app_tw_status_action(method, tweet_id, callback) {
    // Perform status action
    app_post(
        method, "status_action",
        {
            form_id: method + "_form",
            tweet_id: tweet_id
        },
        callback
    );
}

// Delete an update on Twitter - have to own the tweet to destroy
//   string   tweet_id - ID of the tweet to destroy     : 123456789
//   function callback - function to call on completion : function ()
function app_tw_destroy(tweet_id, callback) {
    app_tw_status_action("destroy", tweet_id, callback);
}

// Retweet an update on Twitter
//   string   tweet_id - ID of the tweet to retweet     : 123456789
//   function callback - function to call on completion : function ()
function app_tw_retweet(tweet_id, callback) {
    app_tw_status_action("retweet", tweet_id, callback);
}

// Favorite an update on Twitter
//   string   tweet_id - ID of the tweet to favorite    : 123456789
//   function callback - function to call on completion : function ()
function app_tw_favorite(tweet_id, callback) {
    app_tw_status_action("favorite", tweet_id, callback);
}

// Unfavorite an update on Twitter
//   string   tweet_id - ID of the tweet to unfavorite  : 123456789
//   function callback - function to call on completion : function ()
function app_tw_unfavorite(tweet_id, callback) {
    app_tw_status_action("unfavorite", tweet_id, callback);
}
