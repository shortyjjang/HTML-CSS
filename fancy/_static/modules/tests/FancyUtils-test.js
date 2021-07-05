import { assert } from 'chai';


describe('FancyUtils', function(){
    const FancyUtils = require('../FancyUtils');
    it('isEmpty()', function () {
        const { isEmpty } = FancyUtils;
        assert.isTrue(isEmpty());
        //assert.isTrue(isEmpty(false));
        assert.isTrue(isEmpty(null));
        assert.isTrue(isEmpty({}));
        assert.isTrue(isEmpty([]));
    });

    it('formatDuration()', function () {
        const { formatDuration } = FancyUtils;
        assert.equal(formatDuration(undefined), '00:00')
        assert.equal(formatDuration('foo'), '00:00')
        assert.equal(formatDuration(5), '00:05')
        assert.equal(formatDuration(70), '01:10')
    });

    it('proportionFormat()', function () {
        const { proportionFormat } = FancyUtils;
        assert.equal(proportionFormat(0.1), '10%')
        assert.equal(proportionFormat(0.111), '11.1%')
        assert.equal(proportionFormat(NaN), '')
    });

    it('getConciseNumberString()', function () {
        const { getConciseNumberString } = FancyUtils;
        assert.equal(getConciseNumberString(1), '1');
        assert.equal(getConciseNumberString(12), '12');
        assert.equal(getConciseNumberString(123), '123');
        assert.equal(getConciseNumberString(1234), '1.2K');
        assert.equal(getConciseNumberString(5000), '5K');
        assert.equal(getConciseNumberString(1234567), '1.2M');
        assert.equal(getConciseNumberString(7000000), '7M');
        assert.equal(getConciseNumberString(1234567890), '1.2B');
        assert.equal(getConciseNumberString(9000000000), '9B');
    });
});
