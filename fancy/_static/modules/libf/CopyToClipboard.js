// Removed prompt from 'copy-to-clipboard'
// https://github.com/sudodoki/copy-to-clipboard/blob/04386fe925e10fec353e35e81684c5c96920102e/index.js
import deselectCurrent from 'toggle-selection';


export function copyToClipboard (text, options) {
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
    document.body.appendChild(mark);

    range.selectNode(mark);
    selection.addRange(range);

    var successful = document.execCommand('copy');
    if (!successful) {
      console.warn('unable to copy via execCommand')
      window.clipboardData.setData('text', text)
    }
  } catch (err) {
    console.warn(err)
  } finally {
    cb(null);
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
    reselectPrevious();
  }
}
