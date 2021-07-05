window.addEventListener('DOMContentLoaded', function() {
    runInlineScripts();
});

function runInlineScripts() {
    var scripts = document.getElementsByTagName("script")

    for (var i = 0; i < scripts.length; i++) {
        var type = scripts[i].getAttribute("type");
        if (type && type.toLowerCase() == 'text/delayscript') {
            scripts[i].parentNode.replaceChild((function (delayscript) {
                var script = document.createElement('script');
                script.type = 'text/javascript';
                script.innerHTML = delayscript.innerHTML;

                return script;
            })(scripts[i]), scripts[i]);
        }
    }
}