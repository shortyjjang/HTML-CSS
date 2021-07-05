(function(FancyBackbone, _, console) {
    if (console) {
        FancyBackbone.Etc.Console = {
            log: _.bind(console.log, console),
            error: _.bind(console.error, console),
            dir: _.bind(console.dir, console),
            trace: _.bind(console.trace, console),
        };
    } else {
        FancyBackbone.Etc.Console = {
            log: function() { },
            error: function() { },
            dir: function() { },
            trace: function() { },
        };
    }
}) (FancyBackbone, _, console);