import ical, { type CalendarResponse, type ParameterValue } from 'node-ical';

const calendarId = '7f2b1143d393e8c53987a92ebce4fdd71e6ce99d355ad6a7b3c95063d7d500af@group.calendar.google.com';
const timeZone = 'America/Indiana/Indianapolis';
const feed = `https://calendar.google.com/calendar/ical/${encodeURIComponent(calendarId)}/public/basic.ics`;
const calendar = new URL('https://calendar.google.com/calendar/embed');
calendar.search = new URLSearchParams({ src: calendarId, ctz: timeZone }).toString();
export const calendarUrl = calendar.href;

const hour = 60 * 60 * 1000;
const day = 24 * hour;
const localDate = new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' });
const dateRange = new Intl.DateTimeFormat('en-US', { timeZone: 'UTC', month: 'short', day: 'numeric' });
const dateLabel = new Intl.DateTimeFormat('en-US', { timeZone, weekday: 'short', month: 'short', day: 'numeric' });
const timeLabel = new Intl.DateTimeFormat('en-US', { timeZone, hour: 'numeric', minute: '2-digit' });
const weekday = new Intl.DateTimeFormat('en-US', { timeZone, weekday: 'short' });

let lastCalendar: { data: CalendarResponse; fetchedAt: number } | undefined;
let retryAt = 0;
let refresh: Promise<void> | undefined;

async function loadCalendar() {
  const now = Date.now();
  if (now >= retryAt) {
    refresh ??= (async () => {
      try {
        const response = await fetch(feed, { signal: AbortSignal.timeout(4500) });
        if (!response.ok) throw new Error(`Calendar returned HTTP ${response.status}`);
        const body = await response.text();
        if (!body.startsWith('BEGIN:VCALENDAR') || !body.trimEnd().endsWith('END:VCALENDAR')) {
          throw new Error('Calendar returned an invalid iCal file');
        }
        lastCalendar = { data: ical.sync.parseICS(body), fetchedAt: Date.now() };
        retryAt = Date.now() + 2 * 60 * 1000;
      } catch (error) {
        console.warn('Could not refresh makerspace hours:', error);
        retryAt = Date.now() + 20 * 1000;
      }
    })().finally(() => { refresh = undefined; });
    await refresh;
  }
  return lastCalendar;
}

function eventText(value?: ParameterValue) {
  return (typeof value === 'string' ? value : value?.val)?.trim() ?? '';
}

export function formatSchedule(data: CalendarResponse | undefined, now = new Date()) {
  // UTC dates here are labels for local calendar days, so DST cannot shift the date range.
  const today = localDate.format(now);
  const firstDay = new Date(`${today}T00:00:00Z`);
  const lastDay = new Date(firstDay.valueOf() + 6 * day);
  const lastKey = lastDay.toISOString().slice(0, 10);
  const range = dateRange.formatRange(firstDay, lastDay);
  const window = { from: now, to: new Date(lastDay.valueOf() + day + 12 * hour), expandOngoing: true };
  const entries = Object.values(data ?? {})
    .flatMap((event) => event?.type === 'VEVENT' && event.start ? ical.expandRecurringEvent(event, window) : [])
    .filter(({ event, start, end, isFullDay }) =>
      !isFullDay && event.status !== 'CANCELLED' && event.class !== 'PRIVATE' &&
      end > now && localDate.format(start) <= lastKey)
    .sort((a, b) => a.start.valueOf() - b.start.valueOf())
    .map(({ start, end, summary, event }) => ({
      date: dateLabel.format(start),
      day: weekday.format(start),
      time: timeLabel.formatRange(start, end),
      title: eventText(summary),
      location: eventText(event.location),
      description: eventText(event.description),
    }));

  return { range, entries };
}

export async function getShopHours() {
  const snapshot = await loadCalendar();
  const age = snapshot ? Date.now() - snapshot.fetchedAt : Infinity;
  const status = age < 2 * 60 * 1000 ? 'current' : age < hour ? 'delayed' : 'unavailable';
  return { ...formatSchedule(status === 'unavailable' ? undefined : snapshot?.data), status };
}
