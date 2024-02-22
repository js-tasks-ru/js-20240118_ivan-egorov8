const DRAGGING_CSS_NAME = 'range-slider_dragging';

const directionEnum = {
  left: 'left',
  right: 'right',
};

const directionsMap = {
  thumbLeft: directionEnum.left,
  thumbRight: directionEnum.right,
};

export default class DoubleSlider {
  element;
  subElements = [];
  min;
  max;

  #formatValue;
  #selected;
  #dragging = {
    isActive: false,
    element: null,
    direction: '',
  };
  #elementPositionLeft;
  #elementWidth;

  #handleElementPointerDown = ({ target }) => {
    const isThumbElement = (element) =>
      [this.subElements.thumbRight, this.subElements.thumbLeft].includes(
        element
      );
    if (!isThumbElement(target)) {
      return;
    }
    this.#dragging = {
      isActive: true,
      element: target,
      direction: directionsMap[target.dataset.element],
    };

    const { left, width } = this.subElements.inner.getBoundingClientRect();
    this.#elementPositionLeft = left;
    this.#elementWidth = width;

    this.element.classList.add(DRAGGING_CSS_NAME);
  };

  #handleDocumentPointerUp = () => {
    if (!this.element.isConnected || !this.#dragging.isActive) {
      return;
    }
    this.#resetDragging();
    this.element.classList.remove(DRAGGING_CSS_NAME);
    const rangeSelect = new CustomEvent('range-select', {
      bubles: true,
      detail: this.#selected,
    });

    this.element.dispatchEvent(rangeSelect);
  };

  #handleDocumentPointerMove = ({ clientX }) => {
    if (!this.element.isConnected || !this.#dragging.isActive) {
      return;
    }
    this.#updateThumbPosition(clientX);
  };

  constructor({
    min = 0,
    max = 100,
    formatValue = (value) => value,
    selected = {
      from: min,
      to: max,
    },
  } = {}) {
    this.min = min;
    this.max = max;
    this.#formatValue = formatValue;
    this.#selected = selected;

    this.element = this.#createElement();
    this.#selectSubElements();
    this.#createListeners();
  }

  destroy() {
    this.#destroyListeners();
    this.#remove();
  }

  #resetDragging() {
    this.#dragging = {
      isActive: false,
      element: null,
      direction: '',
    };
  }

  #createTemplate() {
    const left =
      Math.round(
        ((this.#selected.from - this.min) / (this.max - this.min)) * 100
      ) + '%';
    const right =
      Math.round(
        ((this.max - this.#selected.to) / (this.max - this.min)) * 100
      ) + '%';

    return `
      <div class="range-slider">
        <span data-element="from">
          ${this.#formatValue(this.#selected.from)}
        </span>
          <div data-element="inner" class="range-slider__inner">
              <span data-element="progress" class="range-slider__progress" style="left: ${left}; right: ${right};"></span>
              <span data-element="thumbLeft" class="range-slider__thumb-left" style="left: ${left};"></span>
              <span data-element="thumbRight" class="range-slider__thumb-right" style="right: ${right};"></span>
          </div>
        <span data-element="to">
          ${this.#formatValue(this.#selected.to)}
        </span>
      </div>
    `;
  }

  #createElement() {
    const element = document.createElement('div');
    element.innerHTML = this.#createTemplate();
    return element.firstElementChild;
  }

  #selectSubElements() {
    this.element.querySelectorAll('[data-element]').forEach((element) => {
      this.subElements[element.dataset.element] = element;
    });
  }

  #createListeners() {
    this.element.addEventListener(
      'pointerdown',
      this.#handleElementPointerDown
    );
    document.addEventListener('pointerup', this.#handleDocumentPointerUp);
    document.addEventListener('pointermove', this.#handleDocumentPointerMove);
  }

  #destroyListeners() {
    this.element.removeEventListener(
      'pointerdown',
      this.#handleElementPointerDown
    );
    document.removeEventListener('pointerup', this.#handleDocumentPointerUp);
    document.removeEventListener(
      'pointermove',
      this.#handleDocumentPointerMove
    );
  }

  #updateThumbPosition(clientX) {
    const position = this.#getThumbPosition(clientX);

    const { direction } = this.#dragging;
    const { left, right } = directionEnum;

    const percentage = (direction === left ? position : 1 - position) * 100;
    const side = direction === left ? left : right;

    this.#dragging.element.style[side] = `${percentage}%`;
    this.subElements.progress.style[side] = `${percentage}%`;

    const value = Math.round(this.min + position * (this.max - this.min));
    this.subElements[
      direction === left ? 'from' : 'to'
    ].textContent = `${this.#formatValue(value)}`;

    if (direction === left) {
      this.#selected.from = value;
    } else {
      this.#selected.to = value;
    }
  }

  #getThumbPosition(clientX) {
    const position = (clientX - this.#elementPositionLeft) / this.#elementWidth;
    if (position < 0) {
      return 0;
    }
    if (position > 1) {
      return 1;
    }
    const { direction } = this.#dragging;
    const { left, right } = directionEnum;

    if (direction === left) {
      // позиция правого бегунка
      const positionThumbRight =
        1 - parseFloat(this.subElements.thumbRight.style.right) / 100;
      return Math.min(position, positionThumbRight);
    }
    // позиция левого бегунка
    const positionThumbLeft =
      parseFloat(this.subElements.thumbLeft.style.left) / 100;
    return Math.max(position, positionThumbLeft);
  }

  #remove() {
    if (this.element) {
      this.element.remove();
    }
  }
}
