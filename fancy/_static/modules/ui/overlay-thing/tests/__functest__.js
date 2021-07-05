// Test `fancy.rest_api.v1.things.view#ThingRestAPIViewMixin`
(() => {
    console.time('__functest__');
    var fail = 0;
    // var restify = id => '/rest-api/v1/things/' + String(id) + '?owner=true&external_apps=true';
    var tests = [
        { describe: 'thing (w/o sale item)', url: '/rest-api/v1/things/320994740050859080?owner=true&external_apps=true&added_list=true', method: 'GET' },
        { describe: 'thing (w/ sale item)', url: '/rest-api/v1/things/1370?owner=true&external_apps=true&added_list=true', method: 'GET' },
        { describe: 'hotel thing', url: '/rest-api/v1/things/201438475361195178?owner=true&external_apps=true&added_list=true', method: 'GET' },
        { describe: 'fancybox thing', url: '/rest-api/v1/things/563893537234485647?owner=true&external_apps=true&added_list=true', method: 'GET' },
        { describe: 'has launch app', url: '/rest-api/v1/things/189217819718582923?owner=true&external_apps=true&added_list=true', method: 'GET' },
        // TODO: add giftcard thing
    ];

    var promises = [];
    tests.forEach((test, idx) => {
        promises.push(new Promise((resolve) => {
            $.get(
                test.url
            )
            .success(res => {
                tests[idx].result = { type: 'success', result: res };
                resolve();
            })
            .fail(res => {
                tests[idx].result = { type: 'fail', result: res };
                console.log('TEST FAIL!:', idx, test.describe);
                console.log('REASON:', res.responseText.substr(0, 250));
                console.table(res);
                fail += 1;
                resolve();
            });
        }));
    });

    Promise.all(promises).then(() => {
        var countMsg = '';
        if (fail === 0) {
            countMsg = '(without failure)';
        } else {
            countMsg = `(with ${fail} failed test(s))`;
        }
        console.log(`Test done ${countMsg}`);
        tests.forEach(test => {
            console.table(test.result);
        });
        console.timeEnd('__functest__');
    });
})();

function generalCrawl() {
    $('#container-wrapper .wrapper-content')
        .find('a:visible')
        .filter((i, e) => {
            const href = e.getAttribute('href');
            return /\/(sales|things)\/(\d+)/.test(href);
        });    
}

const PROD_IDS = {
    'Hotel': '261198231',
    'Plain Thing': '762115838516923052',
    'SaleItem': '1166465746897739405',
    'Vanity': '773136280337782604',
    'App': '1092705965951684495',
    'Giftcard': '191021139391156225',
};
