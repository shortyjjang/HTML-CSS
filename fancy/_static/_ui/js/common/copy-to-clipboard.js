
(function () {
    'use strict';

    function deselectCurrent() {
        var selection = document.getSelection();
        if (!selection.rangeCount) {
            return function () {};
        }
        var active = document.activeElement;

        var ranges = [];
        for (var i = 0; i < selection.rangeCount; i++) {
            ranges.push(selection.getRangeAt(i));
        }

        switch (active.tagName.toUpperCase()) { // .toUpperCase handles XHTML
            case 'INPUT':
            case 'TEXTAREA':
            active.blur();
            break;

            default:
            active = null;
            break;
        }

        selection.removeAllRanges();
        return function () {
            selection.type === 'Caret' &&
            selection.removeAllRanges();

            if (!selection.rangeCount) {
            ranges.forEach(function(range) {
                selection.addRange(range);
            });
            }

            active &&
            active.focus();
        };
    }

    var cb, reselectPrevious, range, selection, mark;
    function prepareClipboard(text, options){
        var cb, reselectPrevious, range, selection, mark;
        if (!options) { options = {}; }
        cb = options.cb || Function.prototype;
        try {
            reselectPrevious = deselectCurrent();

            range = document.createRange();
            selection = document.getSelection();

            mark = document.createElement('mark');
            mark.textContent = text;
            // used to conserve newline, etc
            mark.style.whiteSpace = 'pre';
            mark.style.opacity = '0';
            document.body.appendChild(mark);

            range.selectNode(mark);
            selection.addRange(range);
        
        } catch (err) {
            console.warn(err);
        }
    }

    function copyToClipboard(text, options) {

        if(text){
            prepareClipboard(text, options);
        }

        try{
            var successful = document.execCommand('copy');
            
            if (!successful) {
                console.warn('unable to copy via execCommand')
                if(window.clipboardData){
                    window.clipboardData.setData('text/plain', text)
                }
            }
        } catch (err) {
            console.warn(err)
        } finally {
            cb && cb(null);
            if (selection) {
                if (typeof selection.removeRange == 'function') {
                    selection.removeRange(range);
                } else {
                    selection.removeAllRanges();
                }
            }
            if (mark) {
                document.body.removeChild(mark);
            }
            reselectPrevious && reselectPrevious();
        }
    }

    window.prepareClipboard = prepareClipboard;
    window.copyToClipboard = copyToClipboard;
})()