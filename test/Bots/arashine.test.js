import Arashine from '../../Bots/arashine.js';

jest.useFakeTimers();

const generateBanMock = (done, shouldBeCalled) => {
  const shouldBeCalledFunc = option => {
    expect(option.days).toBe(7);
    done();
  }
  const shouldNotBeCalledFunc = option => {
    expect(true).toBe(false);
  }
  return shouldBeCalled ? shouldBeCalledFunc : shouldNotBeCalledFunc;
}

const generateDeleteMock = (done, shouldBeCalled) => {
  const shouldBeCalledFunc = () => {
    done();
  }
  const shouldNotBeCalledFunc = () => {
    expect(true).toBe(false);
  }
  return shouldBeCalled ? shouldBeCalledFunc : shouldNotBeCalledFunc;
}

// 時間でBANする機能を回避
test("３回同じ発言をした人はBANされる", async done => {
  const msgMock = {
    member: { 
      id: "14142",
      ban: generateBanMock(done, false),
    },
    delete: generateDeleteMock(done, false),
    content: "arashidesuo",
    mentions: {
      everyone: false,
      roles: {
        size: 0
      }
    }
  }
  var arashine = new Arashine();
  arashine.onMessage(msgMock);
  arashine.onMessage(msgMock);
  var lastMsgMock = { ... msgMock }
  setTimeout(async () => {
    lastMsgMock.member.ban = generateBanMock(done, true);
    arashine.onMessage(lastMsgMock);
  });
  done()
});

test("everyoneにメンションしてる人は消される", async done => {
  const msgMock = {
    member: { 
      id: "14142",
      ban: generateBanMock(done, false),
    },
    delete: generateDeleteMock(done, true),
    content: "arashidesuo",
    mentions: {
      everyone: true,
      roles: {
        size: 0
      }
    }
  }
  var arashine = new Arashine();
  await arashine.onMessage(msgMock);
  done()
});

test("rolesにメンションしてる人は消される", async done => {
  const msgMock = {
    member: { 
      id: "14142",
      ban: generateBanMock(done, false),
    },
    delete: generateDeleteMock(done, true),
    content: "arashidesuo",
    mentions: {
      everyone: false,
      roles: {
        size: 3
      }
    }
  }
  var arashine = new Arashine();
  await arashine.onMessage(msgMock);
  done()
});

// 時間でBANする機能を回避
test("2回の発言ではBANされず、3回目に繰り返す発言を変更したら、5回目じゃないとBANされない", async done => {
  const msgMock = {
    member: { 
      id: "14142",
      ban: generateBanMock(done, false),
    },
    delete: generateDeleteMock(done, false),
    content: "arashidesuo",
    mentions: {
      everyone: false,
      roles: {
        size: 0
      }
    }
  }
  var arashine = new Arashine();
  await arashine.onMessage(msgMock);
  await arashine.onMessage(msgMock);
  var changeMsgMock = { ... msgMock }
  changeMsgMock.content = "kaetayo-akkya-";
  setTimeout(async () => {
    await arashine.onMessage(changeMsgMock);
    await arashine.onMessage(changeMsgMock);
    var willBanMsgMock = { ... changeMsgMock }
    setTimeout(async () => {
      willBanMsgMock.member.ban = generateBanMock(done, true);
      await arashine.onMessage(willBanMsgMock);
    }, 5000);
  }, 5000);
  done();
})