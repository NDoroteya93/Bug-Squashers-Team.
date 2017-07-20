function DeleteSavedListing(id) {
    var saved_listings = r_cookie("saved_listings");

    if (saved_listings.indexOf(id + ",") != -1) {
        saved_listings = saved_listings.replace(id + ",", "");

        document.cookie = "saved_listings=" + saved_listings;

        $("#save_" + id).removeAttr("href");
        $("#save_" + id).removeClass('btn-default').addClass('btn-success');
        $("#save_" + id).text("Deleted");
    }
}

function SaveListing(id) {
    var saved_listings = r_cookie("saved_listings");

    if (saved_listings.indexOf(id + ",") != -1) {

    } else {

        saved_listings += id + ",";
        document.cookie = "saved_listings=" + saved_listings;

        $("#save_" + id).removeAttr("href");
        $("#save_" + id).removeClass('btn-default').addClass('btn-success');
        $("#save_" + id).text("Saved");
    }
}

function r_cookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i].trim();
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}

function sub_loc_select(x) {
    if (x == "") return;

    if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    } else {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            show_sub_locs(xmlhttp.responseText, x);
        }
    }
    if (loc_type == "admin") {
        xmlhttp.open("GET", "../include/suggest_location.php?location=" + x + "&q=", true);
    } else {
        xmlhttp.open("GET", "include/suggest_location.php?location=" + x + "&q=", true);
    }
    xmlhttp.send(null);

}
var up_html = new Array();
var i_last_level = -1;

function show_sub_locs(text, x) {
    var i_level = (x.split(".").length - 1);

    for (i = i_level; i <= 4; i++) {
        document.getElementById("sub_locations" + i).innerHTML = "";
    }

    var new_html = "";
    var splitArray = text.split("~");

    var j = 0;
    for (j = 0; j < splitArray.length; j++) {
        var location = splitArray[j].split("#");

        if (location[0] == "no suggestion") {


        } else {
            new_html += "<option value=\"" + location[1] + "\">" + location[0] + "</option>";
        }
    }

    if (new_html != "") {
        new_html = '<select onChange="sub_loc_select(this.value)" type="text" class="form-control input-sm" id="location' + i_level + '" name="location' + i_level + '">' +
            '<option value="">' + m_all + '</option>' + new_html + '</select>';
        document.getElementById("sub_locations" + i_level).innerHTML = new_html;
    }

    i_last_level = i_level
}

function GoBack() {
    history.back();
}

function ShowHide(div_name) {

    if (document.getElementById(div_name).style.display == "block") {
        document.getElementById(div_name).style.display = "none";
    } else {
        document.getElementById(div_name).style.display = "block";
    }

}