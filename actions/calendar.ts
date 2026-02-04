"use server";

export async function getTimeSlots(date: string, duration: number) {
  const url = new URL(`${process.env.APP_URL}/api/calendar/timeslots`);
  url.searchParams.append("date", date);
  url.searchParams.append("timeFrame", duration.toString());

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Error fetching time slots: ${response.statusText}`);
  }

  const timeSlots = await response.json();
  return timeSlots as Array<{ start: string; end: string }>;
}
