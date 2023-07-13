/*global navigate*/
import "./spatial-navigation-polyfill.js";
import "./ui.css";

import { configRead, configWrite } from "./config";
import {
  updateChatWidth,
  updateChatJoinBtn,
  updateChannelEmotes,
} from "./twitchchat.js";

// We handle key events ourselves.
window.__spatialNavigation__.keyMode = "NONE";

const ARROW_KEY_CODE = { 37: "left", 38: "up", 39: "right", 40: "down" };

const uiContainer = document.createElement("div");
uiContainer.classList.add("twch-ui-container");
uiContainer.style["display"] = "none";
uiContainer.setAttribute("tabindex", 0);
uiContainer.addEventListener(
  "focus",
  () => console.info("uiContainer focused!"),
  true
);
uiContainer.addEventListener(
  "blur",
  () => console.info("uiContainer blured!"),
  true
);

uiContainer.addEventListener(
  "keydown",
  (evt) => {
    console.info("uiContainer key event:", evt.type, evt.charCode);
    if (evt.charCode !== 404 && evt.charCode !== 172) {
      if (evt.keyCode in ARROW_KEY_CODE) {
        navigate(ARROW_KEY_CODE[evt.keyCode]);
      } else if (evt.keyCode === 13) {
        // "OK" button
        document.querySelector(":focus").click();
      } else if (evt.keyCode === 27) {
        // Back button
        uiContainer.style.display = "none";
        uiContainer.blur();
      }
      evt.preventDefault();
      evt.stopPropagation();
    }
  },
  true
);

uiContainer.innerHTML = `
<h1 style="border-bottom: 2px solid;padding-bottom: 20px;">webOS <span style="color:#6C4AA9">Twitch</span> Extended</h1>
<label for="__bttv"><input type="checkbox" id="__bttv" /> Enable BetterTTV(bttv) emotes</label>
<label for="__7tv"><input type="checkbox" id="__7tv" /> Enable 7Tv emotes</label>
<label for="__ffz"><input type="checkbox" id="__ffz" /> Enable Frankerfacez(ffz) emotes</label>
<label for="__chatBtn"><input type="checkbox" id="__chatBtn" /> Remove "Join the conversation" button</label>
  <label for="__chatWidth" style="display:flex">
    <div class="chat__width">
      <button class="chat__width_btn" id="__chatWidth_decrease">
      <span><</span>
      </button>
      <span class="chat__title" id="__chatTitle">""</span>
      <button class="chat__width_btn" id="__chatWidth_add">
      <span>></span>
      </button>
    </div>Chat width (25% standart)
  </label>`;

document.querySelector("body").appendChild(uiContainer);

uiContainer.querySelector("#__bttv").checked = configRead("enableBttv");
uiContainer.querySelector("#__bttv").addEventListener("change", (evt) => {
  configWrite("enableBttv", evt.target.checked);

  handleUpdateChatJoinBtn();
});

uiContainer.querySelector("#__7tv").checked = configRead("enableSevenTv");
uiContainer.querySelector("#__7tv").addEventListener("change", (evt) => {
  configWrite("enableSevenTv", evt.target.checked);

  handleUpdateChatJoinBtn();
});

uiContainer.querySelector("#__ffz").checked = configRead("enableFfz");
uiContainer.querySelector("#__ffz").addEventListener("change", (evt) => {
  configWrite("enableFfz", evt.target.checked);

  handleUpdateChatJoinBtn();
});

uiContainer.querySelector("#__chatBtn").checked =
  configRead("removeChatJoinBtn");
uiContainer.querySelector("#__chatBtn").addEventListener("change", (evt) => {
  configWrite("removeChatJoinBtn", evt.target.checked);

  //updating the button visibility status
  updateChatJoinBtn();
});

const handleUpdateChatJoinBtn = () => {
  //requesting a new list by providers in config
  updateChannelEmotes();
};

let chatWidthElement = uiContainer.querySelector("#__chatTitle");
chatWidthElement.textContent = configRead("chatWidth") + "%";

uiContainer
  .querySelector("#__chatWidth_decrease")
  .addEventListener("click", (_) => {
    let minValue = 10;
    let value = configRead("chatWidth");

    if (value < minValue) {
      value = minValue;
    }

    if (value > minValue) {
      value = configRead("chatWidth") - 1;
      configWrite("chatWidth", value);
      chatWidthElement.textContent = value + "%";

      updateChatWidth();
    }
  });

uiContainer.querySelector("#__chatWidth_add").addEventListener("click", (_) => {
  let maxValue = 50;
  let value = configRead("chatWidth");

  if (value > maxValue) {
    value = maxValue;
  }

  if (value < maxValue) {
    value = configRead("chatWidth") + 1;
    configWrite("chatWidth", value);
    chatWidthElement.textContent = value + "%";

    updateChatWidth();
  }
});

//чекбоксы для настроек

const eventHandler = (evt) => {
  console.info(
    "Key event:",
    evt.type,
    evt.charCode,
    evt.keyCode,
    evt.defaultPrevented
  );
  if (
    evt.charCode == 404 ||
    evt.charCode == 172 ||
    evt.keyCode == 404 ||
    evt.keyCode == 172
  ) {
    console.info("Taking over!");
    evt.preventDefault();
    evt.stopPropagation();
    if (evt.type === "keydown") {
      if (uiContainer.style.display === "none") {
        console.info("Showing and focusing!");
        uiContainer.style.display = "block";
        uiContainer.focus();
      } else {
        console.info("Hiding!");
        uiContainer.style.display = "none";
        uiContainer.blur();
      }
    }
    return false;
  }
  return true;
};

// Red, Green, Yellow, Blue
// 403, 404, 405, 406
// ---, 172, 170, 191
document.addEventListener("keydown", eventHandler, true);
document.addEventListener("keypress", eventHandler, true);
document.addEventListener("keyup", eventHandler, true);

export function showNotification(text, time = 3000) {
  if (!document.querySelector(".twch-notification-container")) {
    console.info("Adding notification container");
    const c = document.createElement("div");
    c.classList.add("twch-notification-container");
    document.body.appendChild(c);
  }

  const elm = document.createElement("div");
  const elmInner = document.createElement("div");
  elmInner.innerText = text;
  elmInner.classList.add("message");
  elmInner.classList.add("message-hidden");
  elm.appendChild(elmInner);
  document.querySelector(".twch-notification-container").appendChild(elm);

  setTimeout(() => {
    elmInner.classList.remove("message-hidden");
  }, 100);
  setTimeout(() => {
    elmInner.classList.add("message-hidden");
    setTimeout(() => {
      elm.remove();
    }, 1000);
  }, time);
}

setTimeout(() => {
  showNotification("Press [GREEN] to open Twitch configuration screen");
}, 2000);
