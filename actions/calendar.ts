"use server";

export async function getTimeSlots(date: string, duration: number) {
  const slotInterval = 15;
  const workDayStart = new Date(`${date}T08:00Z`);
  const workDayEnd = new Date(`${date}T17:00Z`);

  const url = new URL(
    `${process.env.CALENDAR_API_URL}/${process.env.CALENDAR_KEY}/events`,
  );

  url.searchParams.append(
    "startDate",
    workDayStart.toISOString().replace(/\.\d{3}Z$/, "Z"),
  );
  url.searchParams.append(
    "endDate",
    workDayEnd.toISOString().replace(/\.\d{3}Z$/, "Z"),
  );
  url.searchParams.append("subcalendarId[]", "15143779");
  url.searchParams.append("subcalendarId[]", "15143780");

  const eventsResponse = await fetch(url, {
    headers: {
      "Teamup-Token": `${process.env.CALENDAR_API_KEY}`,
    },
  });

  if (!eventsResponse.ok) {
    throw new Error(`Error fetching events: ${eventsResponse.statusText}`);
  }

  const { events } = await eventsResponse.json();

  const timeSlots: Array<{ start: Date; end: Date }> = [];
  let slotStart = new Date(workDayStart);

  while (slotStart < workDayEnd) {
    const slotEnd = new Date(slotStart.getTime() + duration * 60000);

    // Check if the entire timeFrame duration is free
    const hasConflict = events.some(
      (event: { start_dt: string; end_dt: string }) => {
        const eventStart = new Date(event.start_dt);
        const eventEnd = new Date(event.end_dt);

        // Check if any part of the proposed appointment overlaps with this event
        return slotStart < eventEnd && slotEnd > eventStart;
      },
    );

    if (!hasConflict && slotEnd <= workDayEnd) {
      timeSlots.push({ start: new Date(slotStart), end: slotEnd });
    }

    // Move to next slot interval (15 mins)
    slotStart = new Date(slotStart.getTime() + slotInterval * 60000);
  }

  return timeSlots;
}
