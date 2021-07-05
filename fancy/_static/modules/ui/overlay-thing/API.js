export function deleteThing(thing, callback) {
    alertify.confirm("Remove this from Fancy?", function(ok) {
        if (ok) {
            const param = {
                thing_id: thing.id,
                uid: thing.user.id,
                ntid: thing.ntid,
            };
            $.post("/remove_new_thing.xml", param, function(xml) {
                if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==1) {
                    location.href = $(xml).find("url").text();
                } else if ($(xml).find("status_code").length>0 && $(xml).find("status_code").text()==0) {
                    var msg = $(xml).find("message").text();
                    alertify.alert(msg);
                }
                callback && callback();
            }, "xml");
        } else {
            callback && callback();
        }
    });
}
