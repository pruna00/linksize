browser.runtime.onInstalled.addListener(function () {
    browser.contextMenus.create({
        id: "link-size",
        title: "Link Size",
        contexts: ["link"],
    });
});

browser.contextMenus.onClicked.addListener(get_link_meta);

function get_link_meta(info){
    var xhr = new XMLHttpRequest();
    xhr.open("HEAD", info.linkUrl, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            var size = xhr.getResponseHeader("Content-Length");
            var time = xhr.getResponseHeader("Last-Modified");
            var result;
            if (size && size != "0") {
                var time_str = "-";
                if (time)
                    time_str = new Date (time).toLocaleString();

                result = "Size: " + formatBytes(size) + 
                        (size > 1024 ? " (" + size + " bytes)" : "") + "\\n\\n" + 
                        "Last modified: " + time_str;
            } else
                result = "Server did not return link size.";

            browser.tabs.executeScript({code : "alert(\"" + info.linkUrl + "\\n\\n" + result + "\")"});  // hack for firefox
            // alert(url + "\n\n" + result); // doesn't work in firefox
        }
    }

    xhr.send();

}

function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';

    const decimals = 2;
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
}


