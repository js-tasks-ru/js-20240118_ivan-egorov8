// type: "success" | "error"
// В один момент времени на странице может быть показано только одно сообщение
export default class NotificationMessage {
  constructor(content, { duration, type }) {
    this.content = content;
    this.duration = duration;
    this.type = type;
  }

  show() {
    // @TODO
  }

  createTemplate() {
    return /*html*/`
      <div class="notification success" style="--value:20s">
        <div class="timer"></div>
        <div class="inner-wrapper">
          <div class="notification-header">success</div>
          <div class="notification-body">
            Hello world
          </div>
        </div>
      </div>
    `;
  }
}
