export function generateCalendarLink(reminderText) {
  const now = new Date();
  const match = reminderText.match(/in (\d+) (day|week|month)s?/i);

  if (!match) return "#";

  const amount = parseInt(match[1]);
  const unit = match[2];

  const reminderDate = new Date(now);
  if (unit === "day") reminderDate.setDate(now.getDate() + amount);
  if (unit === "week") reminderDate.setDate(now.getDate() + amount * 7);
  if (unit === "month") reminderDate.setMonth(now.getMonth() + amount);

  const start = reminderDate.toISOString().replace(/[-:]|(\.\d{3})/g, "").slice(0, 15) + "00Z";
  const end = new Date(reminderDate.getTime() + 30 * 60000)
    .toISOString()
    .replace(/[-:]|(\.\d{3})/g, "")
    .slice(0, 15) + "00Z";

  const details = encodeURIComponent("HealthSnap follow-up reminder");
  const text = encodeURIComponent("Follow-up Appointment");
  const location = encodeURIComponent("Clinic or Telehealth");

  return `https://www.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${start}/${end}&details=${details}&location=${location}`;
}
