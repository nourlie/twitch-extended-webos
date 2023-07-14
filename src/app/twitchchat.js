// import { getAllEmotes } from "./test";
import { getChannelEmotes, parseMessage } from "./twitchEmotes/twitchEmotes";

import { configRead } from "./config";

import "./ui.css";

let pathname = window.location.pathname;
console.log("Current pathname: " + pathname);

let locationObserver = null;
let isChatLoaded = false;
let chatAside = null;
let channelName = null;
let isFullScreen = false;

function observer() {
  if (locationObserver) {
    locationObserver.disconnect();
    console.log("locationObserver disconected");
  }

  let bodyList = document.querySelector("body");

  locationObserver = new MutationObserver(function () {
    if (pathname != window.location.pathname) {
      pathname = window.location.pathname;
      console.log(
        "Sleeping few secounds after location change.. Current pathname: " +
          pathname
      );

      isChatLoaded = false;

      setTimeout(function () {
        locationChanged();
      }, 4000);
    }
  });

  let config = {
    childList: true,
    subtree: true,
  };

  locationObserver.observe(bodyList, config);
  console.log("Observing..");
}

if (!pathname.startsWith("/embed")) {
  observer();
}

export const updateChatWidth = () => {
  let aside = chatAside || document.getElementsByTagName("aside");
  let videoSection = document.getElementsByTagName("section");

  if (aside[0] && videoSection[0]) {
    if (
      window.screen.width === parseInt(getComputedStyle(videoSection[0]).width)
    ) {
      isFullScreen = true;
    }

    let videoContainer = videoSection[0].querySelectorAll(
      '[class^="ScCoreButton-sc-"]'
    );

    let fullScreenButton = videoContainer[videoContainer.length - 1];

    if (fullScreenButton) {
      fullScreenButton.addEventListener("click", (event) => {
        isFullScreen = !isFullScreen;
        updateVideoWidth(videoSection[0], aside[0]);
      });
      updateVideoWidth(videoSection[0], aside[0]);
    }
  }
};

const updateVideoWidth = (videoSection, aside) => {
  let chatConfigWidth = configRead("chatWidth");

  videoSection.style.width = isFullScreen
    ? "100vw"
    : 100 - chatConfigWidth + "vw";

  aside.style.width = chatConfigWidth + "vw";
  aside.style.transform = isFullScreen
    ? `translateX(${chatConfigWidth}vw)`
    : "none";
};

export const updateChatJoinBtn = () => {
  let aside = chatAside || document.getElementsByTagName("aside");

  if (aside[0]) {
    let joinButton = aside[0].firstChild.lastChild.children[2];

    if (joinButton) {
      joinButton.style.display = configRead("removeChatJoinBtn")
        ? "none"
        : "block";
    }
  }
};

export const updateChannelEmotes = (nickName = channelName) => {
  if (nickName && chatAside) {
    getChannelEmotes(nickName);
  }
};

function readChat() {
  let streamerNickname = pathname.substring(1);
  channelName = streamerNickname;
  console.log("Reading chat for " + streamerNickname);

  // Get the div element that contains the chat message texts
  let aside = document.getElementsByTagName("aside");

  const chatMessageElRegex = /^css-(\S+\s){3}\S+$/;

  if (aside[0]) {
    chatAside = aside;

    updateChannelEmotes();
    updateChatWidth();
    updateChatJoinBtn();

    let chatElement = aside[0].querySelector('[class^="css-"]');

    if (chatElement && chatElement.classList.length === 10) {
      let chat = chatElement;
      // Create an instance of MutationObserver and provide the callback function
      let observer = new MutationObserver(function (mutationsList) {
        for (let mutation of mutationsList) {
          if (mutation.type === "childList") {
            mutation.addedNodes.forEach((x) => {
              if (x.firstChild) {
                x.firstChild.childNodes.forEach((node) => {
                  if (
                    node.tagName === "SPAN" &&
                    chatMessageElRegex.test(node.className)
                  ) {
                    node.innerHTML = parseMessage(node.outerText);
                  }
                });
              }
            });
          }
        }
      });
      // Set up observing changes inside the div element
      observer.observe(chat, { childList: true });
      isChatLoaded = true;
      console.log("Chat loaded");
    }
  }
}

async function locationChanged() {
  console.log("Location changed.");
  if (
    pathname == "/" ||
    pathname.startsWith("/settings") ||
    pathname.startsWith("/directory") ||
    pathname.startsWith("/search") ||
    pathname.startsWith("/videos") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/embed") ||
    pathname.endsWith("/home")
  ) {
    console.log("Non chat location. Skipping chat add. Path:" + pathname);
    channelName = null;
    chatAside = null;
    isFullScreen = false;
    return;
  } else if (!isChatLoaded) {
    readChat();
  }
}

locationChanged();
