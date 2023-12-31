#!/usr/bin/env node

const fs = require("fs");

const packageInfo = JSON.parse(fs.readFileSync("package.json"));
const appInfo = JSON.parse(fs.readFileSync("assets/app/appinfo.json"));

fs.writeFileSync(
  "assets/app/appinfo.json",
  `${JSON.stringify(
    {
      ...appInfo,
      version: packageInfo.version,
    },
    null,
    2
  )}\n`
);
