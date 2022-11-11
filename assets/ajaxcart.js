class AjaxCart extends HTMLElement {
  constructor() {
    super();
    this.initClickEvents();
  }

  initClickEvents() {
    this.previousElementSibling.addEventListener('click', this.close);
    this.querySelector('ajaxcart-header button').addEventListener('click', this.close);
  }

  open(refresh = true){
    document.body.classList.add('overflow-hidden');
    this.closest('.ajax-cart').classList.add('is--open');

    // Refresh cart only if required
    if(refresh) this.refreshCart();
  }

  close(){
    document.body.classList.remove('overflow-hidden');
    this.closest('.ajax-cart').classList.remove('is--open');
  }

  refreshCart(cartElement = false) {
    if(!cartElement){
      fetch("/cart?view=ajaxcart")
      .then((response) => response.text())
      .then((responseText) => {
        this.replaceCart(responseText);
      });
    } else {
      this.replaceCart(cartElement);
    }
  }

  replaceCart(cartElement){
    const html = new DOMParser().parseFromString(cartElement, 'text/html');
    const source = html.querySelector('.ajax-cart');
    const destination = this.closest('.ajax-cart');
    if (source && destination) destination.innerHTML = source.innerHTML;
  }
}
customElements.define('ajax-cart', AjaxCart);


class AjaxcartItem extends HTMLElement {
  constructor() {
    super();


    this.input = this.querySelector('input');

    this.querySelectorAll('ajaxcart-item-quantity button').forEach(
      (button) => button.addEventListener('click', this.onClick.bind(this))
    );

    this.querySelector('ajaxcart-item-remove button').addEventListener('click', (event) => {
      this.updateQuantity(this.dataset.itemKey, 0);
    });

    
  }


  onClick(event) {
    event.preventDefault();
    // const previous = this.input.value;
    
  if(event.target.name === 'plus'){ this.input.stepUp()}
  else{ this.input.stepDown() }
  console.log(this.input.value);
  console.log(this.dataset.itemKey);
  this.updateQuantity(this.dataset.itemKey, this.input.value);
  }
  
  updateQuantity(lineKey, quantity) {
    const data  = {
      id: lineKey,
      quantity: quantity
    }
    console.log(lineKey);
    fetch('/cart/change.js', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json', 
        'Accept': 'application/json' 
      },
      body: JSON.stringify(data),
    })
    .then((response) => response.text())
    .then((responseText) => {
      document.querySelector('ajax-cart').refreshCart();
    });
  }
}
customElements.define('ajaxcart-item', AjaxcartItem);

// variant
class AjaxcartVariants extends HTMLElement {
  constructor() {
    super();
    this.addEventListener('change', this.onVariantChange);
  }

  onVariantChange(event) {
    // Get changed variant ID
    this.selectedVariant = this.querySelector('select').value;

    // Get current variant ID
    this.currentVariant = this.getVariantData().find((variant) => {
      return variant.id == this.selectedVariant;
    });

    this.changeVariant(event);
  }

  getVariantData() {
    this.variantData = this.variantData || JSON.parse(this.querySelector('[type="application/json"]').textContent);
    return this.variantData;
  }

  changeVariant(event) {
    const itemToRemove = event.target.dataset.itemKey;
    const itemToAdd = this.currentVariant.id;

    let data = {
      updates: {
        [itemToRemove]: 0,
        [itemToAdd]: 1
      }
    }

    fetch('/cart/update.js', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json', 
        'Accept': 'application/json' 
      },
      body: JSON.stringify(data),
    })
    .then((response) => {
      document.querySelector('ajax-cart').refreshCart();
    });
  }
}

customElements.define('ajaxcart-variants', AjaxcartVariants);

