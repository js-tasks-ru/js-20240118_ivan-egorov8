class Tooltip {
  static #instance;
  static #indent = 9;
  element;

  #handleDocumentPointerOver = (event) => {
    const tooltip = event.target.dataset.tooltip;
    if (!tooltip) {
      return;
    }
    this.render(tooltip);
  };

  #handleDocumentPointerOut = () => {
    if (this.element?.isConnected) {
      this.#remove();
    }
  };

  #handleDocumentPointerMove = ({ clientX, clientY }) => {
    if (!this.element?.isConnected) {
      return;
    }

    let left = clientX + Tooltip.#indent;
    const top = clientY + Tooltip.#indent;
    const { width: elementWidth } = this.element.getBoundingClientRect();
    const { clientWidth } = document.documentElement;
    const isAtEdge = clientX > clientWidth - elementWidth;

    // чтобы tooltip не уходил за границы экрана справа
    if (isAtEdge) {
      left = clientWidth - elementWidth - indent;
    }
    this.element.style.left = `${left}px`;
    this.element.style.top = `${top}px`;
  };

  constructor() {
    if (Tooltip.#instance) {
      return Tooltip.#instance;
    }

    Tooltip.#instance = this;
  }

  initialize() {
    this.#createListeners();
  }

  render(text) {
    const template = this.#createTemplate(text);
    this.element = this.#createElement(template);
    document.body.append(this.element);
  }

  destroy() {
    this.#remove();
    this.#destroyListeners();
  }

  #createElement(template) {
    const element = document.createElement('div');
    element.innerHTML = template;
    return element.firstElementChild;
  }

  #createTemplate(text) {
    return `<div class="tooltip">${text}</div>`;
  }

  #createListeners() {
    document.addEventListener('pointerover', this.#handleDocumentPointerOver);
    document.addEventListener('pointerout', this.#handleDocumentPointerOut);
    document.addEventListener('pointermove', this.#handleDocumentPointerMove);
  }

  #destroyListeners() {
    document.removeEventListener(
      'pointerover',
      this.#handleDocumentPointerOver
    );
    document.removeEventListener('pointerout', this.#handleDocumentPointerOut);
    document.removeEventListener(
      'pointermove',
      this.#handleDocumentPointerMove
    );
  }

  #remove() {
    if (this.element) {
      this.element.remove();
    }
  }
}

export default Tooltip;
