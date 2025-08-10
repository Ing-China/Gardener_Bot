import { GROUPS, HOLIDAYS } from "./config.js";

export function getTodayGroup(date = new Date()) {
  const dateStr = formatDate(date);
  const dayOfWeek = date.getDay();

  // Skip only holidays (temporarily allow Sundays for testing)
  if (HOLIDAYS.includes(dateStr)) {
    return null;
  }

  const index = getRotationIndex(date);
  return ["TEAM3", "TEAM1", "TEAM2"][index % 3];
}

function getRotationIndex(date) {
  const startDate = new Date("2025-08-08");
  let count = 0;

  // Count working days from start date to current date
  const currentDate = new Date(startDate);

  while (currentDate <= date) {
    const dateStr = formatDate(currentDate);
    const dayOfWeek = currentDate.getDay();

    if (dayOfWeek !== 0 && !HOLIDAYS.includes(dateStr)) {
      count++;
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return count - 1;
}

export function getGroupMembers(groupKey) {
  return GROUPS[groupKey] || [];
}

function formatDate(date) {
  return date.toISOString().split("T")[0];
}
