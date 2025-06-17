import fs from "fs";
import moment from "moment";
import { GROUPS } from "./config.js";

const holidays = JSON.parse(fs.readFileSync("./holidays.json", "utf-8"));

export function getTodayGroup(date = moment()) {
  const day = date.format("dddd");
  const dateStr = date.format("YYYY-MM-DD");

  if (day === "Sunday" || holidays.includes(dateStr)) {
    return null;
  }

  const index = getRotationIndex(date);
  return ["TEAM1", "TEAM2", "TEAM3"][index % 3];
}

function getRotationIndex(date) {
  const startDate = moment("2025-06-17");
  let count = 0;

  for (let d = startDate.clone(); d.isSameOrBefore(date); d.add(1, "day")) {
    const dateStr = d.format("YYYY-MM-DD");
    if (d.format("dddd") !== "Sunday" && !holidays.includes(dateStr)) {
      count++;
    }
  }

  return count - 1;
}

export function getGroupMembers(groupKey) {
  return GROUPS[groupKey] || [];
}
