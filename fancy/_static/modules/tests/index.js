// Shims
window.gettext = s => s;
window.pgettext = s => s;
// https://gist.github.com/sairion/07eb0a3a034ca3617ddd8db5a48c4115
// to prevent actual request.
// $.ajax({ url: 'http://naver.com' }).then().then().then().done().done()...
function fakeAjax(...args) {
  args.reduce((p, n) => { p[n] = () => this; return this; }, this);
  return this
}
$.ajax = _ => new fakeAjax('then', 'fail', 'done', 'success', 'always');

// Tests
require('./FancyUtils-test');
require('./ComponentMountTest');
