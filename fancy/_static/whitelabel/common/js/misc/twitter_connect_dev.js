$(document).ready(function() {
    $('a.twitter,button.twitter').click(function() {
        showTwitterSignup();
    });
});

function showTwitterSignup(){
    var json = {
        'first_name':'snsuser',
        'last_name':'twitter',
        'email':'jaemok+twitter@dev.fancy.com',
        'username':'jaemok_twitter',
    }

    $('.signup .frm .sns')
        .find('[name=email]').val(json.email||"").end()
        .find('[name=firstname]').val(json.first_name||"").end()
        .find('[name=lastname]').val(json.last_name||"").end()
        .find('[name=username]').val(json.username||"").end()
        .find('[name=next_url]').val(json.next_url_after_login||"/").end()
        .trigger('open', 'twitter');
};
