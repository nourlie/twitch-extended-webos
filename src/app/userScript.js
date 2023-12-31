import "whatwg-fetch";
import "./domrect-polyfill";

import { handleLaunch } from "./utils";

document.addEventListener(
  "webOSRelaunch",
  (evt) => {
    console.info("RELAUNCH:", evt, window.launchParams);
    handleLaunch(evt.detail);
  },
  true
);

import "./twitchchat.js";
import "./ui.js";
