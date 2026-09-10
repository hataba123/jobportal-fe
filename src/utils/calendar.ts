/**
 * Utilities for Google Calendar and iCal (.ics) export for interviews.
 */

interface CalendarEventDetails {
  title: string;
  description?: string;
  location?: string;
  startDate: string | Date;
  durationMinutes?: number;
}

function formatGoogleCalendarDate(date: Date): string {
  return date
    .toISOString()
    .replace(/-|:|\.\d{3}/g, "")
    .slice(0, 15) + "Z";
}

export function generateGoogleCalendarUrl({
  title,
  description = "",
  location = "",
  startDate,
  durationMinutes = 60,
}: CalendarEventDetails): string {
  const start = new Date(startDate);
  const end = new Date(start.getTime() + durationMinutes * 60 * 1000);

  const startFormatted = formatGoogleCalendarDate(start);
  const endFormatted = formatGoogleCalendarDate(end);

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${startFormatted}/${endFormatted}`,
    details: description,
    location: location,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function downloadIcsFile({
  title,
  description = "",
  location = "",
  startDate,
  durationMinutes = 60,
  filename = "interview-schedule.ics",
}: CalendarEventDetails & { filename?: string }): void {
  const start = new Date(startDate);
  const end = new Date(start.getTime() + durationMinutes * 60 * 1000);

  const formatIcsDate = (date: Date): string =>
    date
      .toISOString()
      .replace(/-|:|\.\d{3}/g, "")
      .slice(0, 15) + "Z";

  const now = formatIcsDate(new Date());
  const uid = `jobportal-${Date.now()}-${Math.random().toString(36).substring(2, 9)}@jobportal.vn`;

  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//JobPortal Platform//NONSGML v1.0//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${now}`,
    `DTSTART:${formatIcsDate(start)}`,
    `DTEND:${formatIcsDate(end)}`,
    `SUMMARY:${title.replace(/\n/g, "\\n")}`,
    `DESCRIPTION:${description.replace(/\n/g, "\\n")}`,
    `LOCATION:${location.replace(/\n/g, "\\n")}`,
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename.endsWith(".ics") ? filename : `${filename}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
