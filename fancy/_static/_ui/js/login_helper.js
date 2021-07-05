if ((document.location.host.toLowerCase() != "www.thefancy.com")) {
    var lytHost = '/login';
    if($('input.next_url').length){
        var next_url = $('input.next_url').val();
        if (next_url != '/'){
            lytHost = lytHost+"?next="+next_url;
        }
    }
    $('#content form').attr('action',lytHost);
};

$(document).ready(function() {
});