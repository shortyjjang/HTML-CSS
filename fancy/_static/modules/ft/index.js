const Nightmare = require('nightmare')
const { urls } = require('./config')

const nightmare = Nightmare({
  show: true,
  // executionTimeout: 120 * 1000
})

class NightmareTestCase {
  constructor(nightmare) {
    this.nightmare = nightmare || null
    this.setup()
  }
  setup() {
    if (this.nightmare == null) {
      this.nightmare = nightmare
        .authentication('td', 'fc')
        .viewport(1200, 800)
      return this.nightmare
    }
  }
}

class SignInTestCase extends NightmareTestCase {
  run() {
    this.nightmare
      .goto(urls.Login)
      // sign in with specified test username/password.
      .type('.email-frm input[name="username"]', 'jaeho_testcustomer')
      .type('.email-frm input[name="user_password"]', 'jaeho_testcustomerfancy9981')  
      .click('.btn-signin')
      .wait('#navigation .logo')
    return this.nightmare
  }
}

class SaleItemTestCase extends NightmareTestCase {
  run() { 
    this.nightmare
      .goto(urls.SaleItem)
      // 1. Test if 'Add to Cart' works.
      .click('#overlay-thing .sidebar .btn-cart')
      .wait('.cart .btn-checkout')
      // 2. Test if 'Buy Now' works.
      .goto(urls.SaleItem)
      .click('#overlay-thing .sidebar .btn-buy-now')
      .wait('.cart .btn-checkout')
    return this.nightmare
  }
}

class ThingTestCase extends NightmareTestCase {
  async run () { 
    const nm = this.nightmare.goto(urls.SaleItem)
    const visible = await nm.visible('#overlay-thing .button.fancy.fancyd')

    // 1. Test if Fancy/UnFancy works.
    let clickSelector, waitSelector
    if (visible) {
      clickSelector = '#overlay-thing .button.fancy.fancyd'
      waitSelector = '#overlay-thing .button.fancy:not(.fancyd)'
    } else {
      clickSelector = '#overlay-thing .button.fancy'
      waitSelector = '#overlay-thing .button.fancy.fancyd'
    }
    return nm
      .click(clickSelector)
      .wait(waitSelector)
      // 2. Test if 'Share' works
      .goto(urls.SaleItem)
      .click('#overlay-thing .sidebar .menu-container .share')
      .wait('#overlay-thing .sidebar .menu-container #more-share-email')
      .type('#overlay-thing .sidebar .menu-container #more-share-email', 'jaehofancy')
      .wait('#overlay-thing .sidebar #more-share-send .lists a.before-bg-share2')
      .click('#overlay-thing .sidebar #more-share-send .lists a.before-bg-share2')
      .type('#overlay-thing .sidebar #more-share-send .send textarea', 'test message...')
      .click('#overlay-thing .sidebar #more-share-send .send .btn-send')
      // clear
      .end()
      .then(() => { console.log('success') })
      .catch((e) => {
        console.log(e)
      })
  }
}


(async function main() {
  let nm;
  const tc1 = new SignInTestCase()
  nm = tc1.run()
  const tc2 = new SaleItemTestCase(nm)
  nm = tc2.run()
  const tc3 = new ThingTestCase(nm)
  nm = tc3.run()
})()
