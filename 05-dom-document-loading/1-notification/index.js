export default class NotificationMessage {
  static lastMessage;

  element;

  content;
  duration = 1000;
  type = 'success'; // success | error

  timeoutId;

  constructor(content, { duration, type } = {}) {
    this.content = content;
    this.duration = duration;
    this.type = type;

    const template = this.createTemplate();
    this.element = this.createElement(template);
  }

  // В один момент времени на странице может быть показано только одно сообщение
  show(container = document.body) {
    if (NotificationMessage.lastMessage) {
      NotificationMessage.lastMessage.destroy();
    }

    NotificationMessage.lastMessage = this;
    container.appendChild(this.element);

    this.timeoutId = setTimeout(() => {
      this.remove();
    }, this.duration);
  }

  createElement(template) {
    const element = document.createElement('div');
    element.innerHTML = template;
    return element.firstElementChild;
  }

  createTemplate() {
    return /*html*/ `
      <div class="notification ${this.type}" style="--value:${this.duration}s">
        <div class="timer"></div>
        <div class="inner-wrapper">
          <div class="notification-header">${this.type}</div>
          <div class="notification-body">
            ${this.content}
          </div>
        </div>
      </div>
    `;
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    this.remove();
  }
}
