import emoteUrls from "./emoteCdn.js";
import { configRead } from "../config.js";

let emoteListByProviders = null;

const getProviderList = () => {
  let providers = {
    bttv: configRead("enableBttv"),
    sevenTv: configRead("enableSevenTv"),
    ffz: configRead("enableFfz"),
  };

  return JSON.stringify(providers);
};

const mergeAllEmotes = (emotes) => {
  let mergedArrayList;
  for (let provider in emotes) {
    let mergedEmotes = [].concat(
      ...(emotes[provider]?.global || []),
      ...(emotes[provider]?.channel || [])
    );

    //merge global and channel
    emotes[provider] = mergedEmotes.map((emote) => {
      return {
        name: emote.code || emote.name,
        provider: emote.code ? "bttv" : emote.status ? "ffz" : "7tv",
        id: emote.id,
      };
    });
    //all providers in one
    let mergedArray = [].concat(...Object.values(emotes));

    mergedArrayList = mergedArray;
  }
  return mergedArrayList;
};

export const getChannelEmotes = async (channelName) => {
  let myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  let requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: getProviderList(),
  };

  fetch(
    `https://twitch-user-emotes.cyclic.app/getChannelEmotes?username=${channelName}`,
    requestOptions
  )
    .then((response) => response.json())
    .then((result) => {
      emoteListByProviders = mergeAllEmotes(result);
    })
    .catch((error) => console.log("error", error));
};

const getEmoteLink = (provider, id) => {
  switch (provider) {
    case "bttv": {
      return emoteUrls.BTTV.CDN(id);
    }
    case "7tv": {
      return emoteUrls.SevenTV.CDN(id);
    }
    case "ffz": {
      return emoteUrls.FFZ.CDN(id);
    }
  }
};

export const parseMessage = (message) => {
  if (emoteListByProviders) {
    const words = message.split(" ");

    const replacedWords = words.map((word) => {
      let emote = emoteListByProviders.find((x) => x.name === word) || null;

      if (emote) {
        let emoteImage = `<img class="message-emote" src="${getEmoteLink(
          emote.provider,
          emote.id
        )}" loading="lazy" decoding="async"/>`;
        return emoteImage.trim();
      }
      return word.trim();
    });

    const replacedMessage = replacedWords.join(" ");

    return replacedMessage;
  } else {
    return message;
  }
};
