export default class SortableTable {
  element;
  subElements = [];
  #headerConfig = [];
  #data = [];

  constructor(headerConfig = [], data = []) {
    this.#headerConfig = headerConfig;
    this.#data = data;

    this.#render();
    this.#selectSubElements();
  }

  #render() {
    const template = this.#createTemplate();
    this.element = this.#createElement(template);
  }

  sort() {
    // TODO: реализовать
  }

  #createElement(template) {
    const element = document.createElement('div');
    element.innerHTML = template;
    return element.firstElementChild;
  }

  #createTemplate() {
    return /*html*/ `
      <div class="sortable-table">
        <div data-element="header" class="sortable-table__header sortable-table__row">
          ${this.#createHeaderTemplate()}
        </div>

        <div data-element="body" class="sortable-table__body">
          ${this.#createBodyTemplate()}
        </div>
      </div>
    `;
  }

  #createHeaderCellTemplate({ id, title, sortable = false }) {
    return /*html*/ `
      <div class="sortable-table__cell" data-id="${id}" data-sortable="${sortable}">
        <span>${title}</span>
      </div>
    `;
  }

  #createHeaderTemplate() {
    return this.#headerConfig
      .map((item) => this.#createHeaderCellTemplate(item))
      .join('');
  }

  #createDataRowTemplate(item) {
    return /*html*/ `
      <a href="/products/${item.id}" class="sortable-table__row">
        ${this.#createDataCellsTemplate(item)}
      </a>
    `;
  }

  #createDataCellsTemplate(dataRow) {
    return this.#headerConfig.map(({id, template}) => {
      if (template) {
        return template(dataRow[id]);
      }
      return /*html*/ `
        <div class="sortable-table__cell">${dataRow[id]}</div>
      `;
    }).join('');
  }

  #createBodyTemplate() {
    return this.#data.map((item) => this.#createDataRowTemplate(item)).join('');
  }

  #remove() {
    this.element.remove();
  }

  #selectSubElements() {
    this.element.querySelectorAll('[data-element]').forEach((element) => {
      this.subElements[element.dataset.element] = element;
    });
  }

  destroy() {
    this.#remove();
  }
}
