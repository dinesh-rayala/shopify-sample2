class CollectionFilters extends HTMLElement {
  constructor() {
    super();
   
    const filterForm = this.querySelector('form');
    filterForm.addEventListener('input', this.onSubmitHandler.bind(this));
  }

  onSubmitHandler(event) {
    event.preventDefault();
    const formData = new FormData(event.target.closest('form'));
    const filterParams = new URLSearchParams(formData).toString();

    CollectionFilters.updateURLHash(filterParams);
    CollectionFilters.renderPage(filterParams, event);
  }

  static updateURLHash(filterParams) {
    history.pushState({ filterParams }, '', `${window.location.pathname}${filterParams && '?'.concat(filterParams)}`);
  }

  static renderPage(filterParams, event) {
    const sectionId = document.getElementById('ProductGrid').dataset.id;
    const url = `${window.location.pathname}?section_id=${sectionId}&${filterParams}`;
    
    fetch(url)
    .then(response => response.text())
    .then((responseText) => {
      CollectionFilters.renderProductGrid(responseText);
    });
  }

  static renderProductGrid(responseText) {
    const productGridHtml = new DOMParser().parseFromString(responseText, 'text/html').getElementById('ProductGridContainer').innerHTML;
    document.getElementById('ProductGridContainer').innerHTML = productGridHtml;
  }
}

customElements.define('collection-filters', CollectionFilters);