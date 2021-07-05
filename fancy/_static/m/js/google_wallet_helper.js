function notifyFailure (param) { 
    $.post("/create_wallet_request.json", param, 
        function(response) {
            google.wallet.online.notifyTransactionStatus({
                'jwt':response.jwt
            })
            
        }, "json") 
}

function processPayment (param) { 
    //param should hold card_uri, googleTransactionId, merchantTransactionId if available 
    console.log("will process payment with parameter", param) 
	$.post("process_payment_by_google_wallet.json", param, 
        function(response) {            //notify google the result 
            google.wallet.online.notifyTransactionStatus({ 
                'jwt': response.jwt
            }) 
            
            if(response.status_code) 
            {
                console.log('succeeded') 
                //redirect to confirmation 
                location.replace('confirmation')
            }
            else 
            {
                console.log('failed', response) 
                //redirect to cart 
                alert(response.message)

                location.replace('cart')
            }
            //redirection 
        }, "json") 
    }


var handleFullWallet = function (response) {
    console.log("response of full wallet request:", response) 
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
   	console.log("card data", cardData) 
     
    balanced.card.create(cardData, balancedGWCallback);
    
   }, "json") 
    
}

var handleFullWalletFailure = function (response) { 
    console.log("handle full wallet failure", response) 
} 

function requestFullWallet(param) {
    console.log("will request full wallet", param)

    $.post("/create_wallet_request.json", param, 
        function(response) {
            console.log('got response from create_wallet_request for Full Wallet Request', response) 
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
                console.log("something went wrong creating full wallet request") 
            }

        }, "json")

}

var changeMWSuccess = function (response) {
    console.log('changeMWSuccess', response) 
    if(response == null) 
        return 

    param = { /*'sandbox': 'true',*/ 'jwt' : response.jwt, 'verify_type': 'changeMaskedWallet' } 
    
    $.post("/verify_wallet_response.json", param, function(response) {
        if(response.status_code)
        {
            console.log("succeeded, will update card info", response) 
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
                        alert("Failed to change the address, please try again") 
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
            console.log("failed, will not update card info") 
        }
    }, "json")

} 

var changeMWFailure = function (response) { 
    console.log('changeMWFailure', response) 
}

function updateCardInfo (jwt){ //total_price, transactionId) { 
    console.log("will update card info")
        
    google.wallet.online.changeMaskedWallet({
        "jwt" : jwt, 
        "success" : changeMWSuccess,
        "failure" : changeMWFailure,
    }) 
    
    /*
        //get new jwt
        var param = {} 
        //param['sandbox'] = 'true' 
        param['type'] = 'masked' 
        param['totalprice'] = total_price
        param['google_id'] = transactionId
        param['merchantId'] = 
        //param['totalprice'] = {{total_price}} 
        //param['googleTransactionId'] = {{google_wallet.googleTransactionId}}

        $.post("/create_wallet_request.json", param, 
            function(response) { 
                console.log('got response from create_wallet_request', response) 
                if(response.status_code)
                {
                    jwt = response.jwt 
                    
                    google.wallet.online.changeMaskedWallet({
                        "jwt" : jwt, 
                        "success" : changeMWSuccess,
                        "failure" : changeMWFailure,
                    }) 
                }
                else
                {
                    console.log("got error") 
                }
            }, "json") 

    //return false 
    */ 
}

// $('#gw_update_card_link').click(function() { updateCardInfo(); } );
