function notifyFailure (param) { 
    $.post("/create_wallet_request.json", param, 
        function(response) {
            google.wallet.online.notifyTransactionStatus({
                'jwt':response.jwt
            })
            
        }, "json") 
}

function processPayment (param, totalprice) { 
    //param should hold card_uri, googleTransactionId, merchantTransactionId if available 
	$.post("/process_payment_by_google_wallet.json", param, 
        function(response) {            //notify google the result 
            google.wallet.online.notifyTransactionStatus({ 
                'jwt': response.jwt
            }) 
            
            if(response.status_code) 
            {
                //redirect to confirmation 
	    	    location.replace('confirmation')
            }
            else 
            {
                //redirect to cart 
                alert(response.message)

                location.replace('cart')
            }
            //redirection 
        }, "json") 
    }


var handleFullWallet = function (response) {
    //verify jwt 
    var pan = response.pan
    var cvc = response.cvn 

    //for testing purpose, use test card number 
    //var pan = "4111 1111 1111 1111"
    //var cvc = "123"

    param = { 'jwt': response.jwt}//, 'sandbox': 'true'} 
    $.post("/verify_wallet_response.json", param, 
    function(response) { 
        // check verification result for billing address 
        pay = response.json.response.pay
        billingAddress = pay.billingAddress
        
        // and process payment
        var cardData = {
                        name: billingAddress.name,
                        street_address: billingAddress.address1,
                        postal_code:billingAddress.postalCode,
                        country_code:billingAddress.countryCode,
                        card_number: pan,
                        expiration_month: pay.expirationMonth,
                        expiration_year: pay.expirationYear,
                        security_code: cvc
                        };  
     
        balanced.card.create(cardData, balancedCallback);
    
   }, "json") 
    
}

var handleFullWalletFailure = function (response) { 
    location.replace('cart')
} 

function requestFullWallet(param) {

    $.post("/create_wallet_request.json", param, 
        function(response) {
            if(response.status_code) 
            {
                google.wallet.online.requestFullWallet(
                {
                  "jwt" : response.jwt,
                  "success" : handleFullWallet,
                  "failure" : handleFullWalletFailure
                } );

            }
            else
            {
                if(window.console) 
                { 
                    console.log("something went wrong creating full wallet request") 
                }
            }

        }, "json")

}

var changeMWSuccess = function (response) {
    if(response == null) 
        return 

    param = { /*'sandbox': 'true',*/ 'jwt' : response.jwt, 'verify_type': 'changeMaskedWallet' } 
    
    $.post("/verify_wallet_response.json", param, function(response) {
        if(response.status_code)
        {
            email = response.json.response.email 
            card = response.json.response.pay.description[0]
            $('#gw-card-info').html('<li>'+email+'</li><li>'+card+ '</li>'); 
            
            ship = response.json.response.ship 
            if(ship)
            {
                var ship_param = {}
                ship_param['shipping-id'] = ship.objectId

                for(var key in ship.shippingAddress)
                {
                    ship_param[key] = ship.shippingAddress[key]
                }
                $.post("/change_wallet_address.json", ship_param, function(response) 
                { 
                    if(response['status_code'] == 0)
                    {
                        //failed to change address
                        alert(gettext("Failed to change the address, please try again")); 
                        location.replace('/cart')
                    }
                    else if (response['status_code'] == 1) 
                    {
                        //succeeded, reload page. 
                        location.reload(); 
                    }
                })
            }
        }
        else
        {
            if(window.console) 
            { 
                console.log("failed, will not update card info") 
            }
        }
    }, "json")

} 

var changeMWFailure = function (response) { 
}

function updateCardInfo (jwt /*, total_price, transactionId*/) { 
    google.wallet.online.changeMaskedWallet({
        "jwt" : jwt, 
        "success" : changeMWSuccess,
        "failure" : changeMWFailure,
    })
}
