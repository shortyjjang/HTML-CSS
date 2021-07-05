(function () {
    "use strict";
    // Duplicate detection
    let stripe;
    if (window.FancyApplePay) {
        return;
    }

    const StaticSelector =
        "#container-wrapper .apple-pay-button, #container-wrapper .apple-pay-button-with-text, #wrap .apple-pay-button, #wrap .apple-pay-button-with-text";

    const RunningModes = {
        Static: "Static",
        Dynamic: "Dynamic",
    };

    function didClickOn($targ, selector) {
        return $targ.parents(selector).length > 0 || $targ.is(selector);
    }

    const FancyApplePay = {
        stripeVersion: "v3",
        clicked: false,
        label: "Fancy",
        available: null,
        paymentRequest: null,
        afterAbort() {
            this.clicked = false;
        },
        init(label) {
            stripe = new window.Stripe(window.stripePublishableKey);

            if (label) this.label = label;
            this.paymentRequest = stripe.paymentRequest({
                country: "US",
                currency: "usd",
                total: {
                    label: "Fancy",
                    amount: 10,
                },
                requestPayerName: true,
                requestPayerPhone: true,
                requestShipping: true,
            });
        },
        checkAvailability(callback, data) {
            if (location.args.force_button) {
                callback(true, true);
            }
            if (!data) {
                console.warn("[v2]FancyApplePay.checkAvailability(): data is missing.");
                callback(false, false);
            } else {
                this.paymentRequest.update(data);
            }
            this.paymentRequest.canMakePayment().then((result) => {
                const available = (result && result.applePay) === true;
                this.available = available;
                callback(available, false);
            });
        },
        requestPurchase(mode, requestArgs) {
            if (this.available) {
                this.paymentRequest.show();
            } else if (this.available === null) {
                this.checkAvailability(
                    (available) => {
                        this.available = available;
                        this.paymentRequest.show();
                    },
                    {
                        total: { label: requestArgs.title, amount: (Number(requestArgs.price) * 100) | 0 },
                    }
                );
            } else {
                window.alertify.alert("Apple pay is not available.");
            }
        },
    };

    window.stripeOnload = function stripeOnload() {
        $(function () {
            if (window.stripePublishableKey) {
                stripe = window.Stripe(window.stripePublishableKey);
            }
            FancyApplePay.init();
        });
    };
    if (window.Stripe) {
        window.stripeOnload();
    }

    window.FancyApplePay = FancyApplePay;
})();
