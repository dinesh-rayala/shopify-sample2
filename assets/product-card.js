// class ProductCard extends HTMLElement {
//   constructor() {
//     super();

//     this.addEventListener("click", function (event) {
//       if (event.target.name == "varaintbtn") {
//         this.variantChange(event);
//       }
//     });
//   }

//   variantChange(event) {
//     this.selectedVariant = event.target.dataset.variant;
//     console.log(this.selectedVariant);
//     let variantUrl = `/products/${this.dataset.handle}?view=dinesh&variant=${this.selectedVariant}`;

//     fetch(variantUrl)
//       .then((response) => response.text())
//       .then((data) => {
//         const html = new DOMParser().parseFromString(data, "text/html");
//         const responseCard = html.querySelector("product-card");

//         this.innerHTML = responseCard.innerHTML;
//       });
//   }
// }

// customElements.define("product-card", ProductCard);

class ProductCard extends HTMLElement {
  constructor() {
    super();

    this.variantData = JSON.parse(
      this.querySelector('[type="application/json"]').textContent
    );
    this.addEventListener("change", this.onOptionChange.bind(this));
  }

  onOptionChange() {
    // array of selected options
    const optionContainers = Array.from(
      this.querySelectorAll(".product-card__options")
    );
    this.options = optionContainers.map((options) => {
      return Array.from(options.querySelectorAll("input")).find(
        (radio) => radio.checked
      ).value;
    });

    this.currentVariant = this.variantData.find((variant) => {
      return !variant.options
        .map((option, index) => {
          return this.options[index] === option;
        })
        .includes(false);
    });

    const variant = this.currentVariant.id;
    console.log(variant);
    this.querySelector('[name="id"]').value = variant;
    this.selectedVariant = variant;
    let variantUrl = `/products/${this.dataset.handle}?view=dinesh&variant=${this.selectedVariant}`;

    fetch(variantUrl)
      .then((response) => response.text())
      .then((data) => {
        const html = new DOMParser().parseFromString(data, "text/html");
        const responseCard = html.querySelector("product-card");

        this.innerHTML = responseCard.innerHTML;
      });
  }
}
customElements.define("product-card", ProductCard);
