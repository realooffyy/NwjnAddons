import PogOject from "../../PogData/index.js";

export let data = new PogOject("NwjnAddons", {
  "newUser": true,
  "newMsg": "",

  "power": "Unknown",
  "tuning": "Unknown",
  "enrich": "Unknown",
  "mp": "Unknown",

  "gummy": 0,
  "wisp": 0,
  "lastMini": {},
  "blacklist": {},

  "Clock": {
    "x": 50,
    "y": 50,
    "scale": 1.5
  },
  "Reaper": {
    "x": 60,
    "y": 60,
    "scale": 1.5
  },
  "FatalTempo": {
    "x": 70,
    "y": 70,
    "scale": 1.5
  }
}, "/data/.User.json");
data.autosave(3)