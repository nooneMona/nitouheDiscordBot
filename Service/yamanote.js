import { CountryYamanote } from "./Yamanote/CountryYamanote.js";

export class Yamanote {

  constructor() {
    this.state = yamanoteStateTypes.stop;
    this.mode = null;
  }

  async onMessage(msg) {
    switch(this.state) {
      case yamanoteStateTypes.stop:
        this.onMessageStopped(msg);
      case yamanoteStateTypes.select:
        this.onMessageSelecting(msg);
      case yamanoteStateTypes.ongoing:
        this.onMessageOngoing(msg);
    }
  }

  onMessageStopped(msg) {
    if (msg.content === 'yamanote') {
      msg.reply('山手線ゲームはじまるどー finishで終了');
      this.state = yamanoteStateTypes.select
    }
  }

  onMessageSelecting(msg) {
    if (msg.content === 'country') {
      msg.reply('国モードだお〜');
      this.state = yamanoteStateTypes.ongoing;
      this.engine = new CountryYamanote();
    }
  }

  onMessageOngoing(msg) {
    if (msg.content === 'finish') {
      msg.reply('ぶははー');
      this.state = yamanoteStateTypes.stop;
      return;
    }
    const answer = this.engine.answer(msg.content);
    if (answer) msg.react(answer);
  }

}

const yamanoteStateTypes = {
  stop: 'stop',
  select: 'select',
  ongoing: 'ongoing',
  result: 'result'
}

const yamanoteModeTypes = {
  country: 'country'
}