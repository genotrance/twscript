////
// Posting related

// Update length and color
function update_length() {
	len = $("#update").val().length;
	color = "rgb(" + Math.floor(len/tw_length*255) + ",0,0)";
	$("#update_len").html(tw_length-len);
	$("#update_len").css("color", color);
	$("#update").css("color", color);
}

//Process update
function process_update() {
	// Verify length not 0 or greater than tw_length
	status = $("#update").val();
	if (status.length > tw_length || status.length == 0) return false;

	// Get value and clear
	in_reply_to_status_id = $("#in_reply_to_status_id").val();
	hide_post();

    // Set message
    $("#error").html("Updating...");

    // Post status
    app_tw_update(status, in_reply_to_status_id, function () {
    	// Remove post
    	$(document).click();
    	
        // Clear message
        $("#error").html("");
        
        // Load home after posting
        load("home", true);
    });
}

// Clear update form
function clear_post() {
    $("#update").val("");
    $("#in_reply_to_status_id").val("");
    update_length();
}
