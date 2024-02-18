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

  sort(fieldId, order) {
    const { sortType, sortable } = this.#headerConfig.find(
      (item) => item.id === fieldId
    );
    if (!sortable) {
      return;
    }
    this.#hideAllSortingArrows();
    this.#setSortingArrow(fieldId, order);

    const sortedData = this.#sortData(fieldId, order, sortType);
    this.#updateBody(sortedData);
  }

  destroy() {
    this.#remove();
  }

  #render() {
    const template = this.#createTemplate();
    this.element = this.#createElement(template);
  }

  #createElement(template) {
    const element = document.createElement('div');
    element.innerHTML = template;
    return element.firstElementChild;
  }

  #createTemplate() {
    return `
      <div class="sortable-table">
        <div data-element="header" class="sortable-table__header sortable-table__row">
          ${this.#createHeaderTemplate()}
        </div>

        <div data-element="body" class="sortable-table__body">
          ${this.#createBodyTemplate(this.#data)}
        </div>
      </div>
    `;
  }

  #createHeaderCellTemplate({ id, title, sortable = false }) {
    return `
      <div class="sortable-table__cell" data-id="${id}"
        ${sortable ? 'data-sortable' : ''}>
        <span>${title}</span>
        <span data-element="arrow" class="sortable-table__sort-arrow">
          <span class="sort-arrow"></span>
        </span>
      </div>
    `;
  }

  #createHeaderTemplate() {
    return this.#headerConfig
      .map((item) => this.#createHeaderCellTemplate(item))
      .join('');
  }

  #setSortingArrow(fieldId, order) {
    const sortingHeaderCell = this.subElements.header.querySelector(
      `.sortable-table__cell[data-id="${fieldId}"]`
    );

    sortingHeaderCell.dataset.order = order;
  }

  /**
   * Скрыть стрелки сортировок для всех колонок
   */
  #hideAllSortingArrows() {
    const allHeaderCells = this.subElements.header.querySelectorAll(
      '.sortable-table__cell[data-id]'
    );

    allHeaderCells.forEach((column) => {
      column.dataset.order = '';
    });
  }

  #createDataRowTemplate(item) {
    return `
      <a href="/products/${item.id}" class="sortable-table__row">
        ${this.#createDataCellsTemplate(item)}
      </a>
    `;
  }

  #createDataCellsTemplate(rowData) {
    return this.#headerConfig
      .map(({ id, template }) => {
        if (template) {
          return template(rowData[id]);
        }
        return `
        <div class="sortable-table__cell">${rowData[id]}</div>
      `;
      })
      .join('');
  }

  #createBodyTemplate(data) {
    return data.map((item) => this.#createDataRowTemplate(item)).join('');
  }

  #selectSubElements() {
    this.element.querySelectorAll('[data-element]').forEach((element) => {
      this.subElements[element.dataset.element] = element;
    });
  }

  #sortData(fieldId, order, sortType) {
    const copiedData = [...this.#data];

    const sortingFunction = this.#getSortingFunction(fieldId, order, sortType);
    return copiedData.sort(sortingFunction);
  }

  #getSortingFunction(fieldId, order, sortType) {
    const direction = order === 'asc' ? 1 : -1;
    if (sortType === 'string') {
      return (a, b) =>
        direction * a[fieldId].localeCompare(b[fieldId], ['ru', 'en']);
    }
    return (a, b) => direction * (a[fieldId] - b[fieldId]);
  }

  #updateBody(data) {
    this.subElements.body.innerHTML = this.#createBodyTemplate(data);
  }

  #remove() {
    this.element.remove();
  }
}
