/**
 * Created by ryan on 8/27/15.
 */
'use strict';
function getLocation(href) {
    var match = href.match(/^(https?\:)\/\/(([^:\/?#]*)(?:\:([0-9]+))?)(\/[^?#]*)(\?[^#]*|)(#.*|)$/);
    return match && {
            protocol: match[1],
            host: match[2],
            hostname: match[3],
            port: match[4],
            pathname: match[5],
            search: match[6],
            hash: match[7]
        };
};

self.addEventListener('push', function(event) {
    var request = new Request('/service-worker/get-push-message.json');
    event.waitUntil(
        fetch(request).then(function (response) {
            if (response.status !== 200) {
                throw new Error();
            }
            return response.json().then(function (data) {
                if (!!data.error) {
                    console.error('The API returned an error.', data.error);
                    throw new Error();
                }

                return self.registration.showNotification(data.title, {
                    body: data.body,
                    icon: data.icon,
                    tag: data.tag
                });
            });
        })

    );

});

self.addEventListener('notificationclick', function(event) {
    var res = event.notification.tag.split('|');
    var target_url = res[1];
    if(target_url[0] != '/') {
        var targetUrlData = getLocation(target_url);
        target_url = targetUrlData.pathname + targetUrlData.search + targetUrlData.hash;
    }


    // Android doesn’t close the notification when you click on it
    // See: http://crbug.com/463146
    event.notification.close();

    // This looks to see if the current is already open and
    // focuses if it is
    event.waitUntil(clients.matchAll({
        type: "window"
    }).then(function(clientList) {
        for (var i = 0; i < clientList.length; i++) {
            var client = clientList[i];
            var urlData = getLocation(client.url);
            var url = urlData.pathname + urlData.search + urlData.hash;
            if (url == target_url && 'focus' in client)
                return client.focus();
        }
        if (clients.openWindow)
            return clients.openWindow(target_url);
    }));

});