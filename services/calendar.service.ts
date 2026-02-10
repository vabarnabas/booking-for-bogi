import { db } from "@/db";
import { appointments, customers } from "@/db/schema";

async function getEvents(params?: {
  startDate?: string;
  endDate?: string;
  timezone?: string;
}) {
  const url = new URL(
    `${process.env.CALENDAR_API_URL}/${process.env.CALENDAR_KEY}/events`,
  );

  if (params) {
    if (params.startDate) {
      url.searchParams.append("startDate", params.startDate);
    }
    if (params.endDate) {
      url.searchParams.append("endDate", params.endDate);
    }
    url.searchParams.append("subcalendarId[]", "15143779");
    url.searchParams.append("subcalendarId[]", "15143780");
    if (params.timezone) {
      url.searchParams.append("tz", params.timezone);
    }
  }

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Teamup-Token": `${process.env.CALENDAR_API_KEY}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Error fetching events: ${response.statusText}`);
  }

  const data = await response.json();
  return data.events;
}

async function getAllTimeSlots(date: string, timeFrame: number) {
  const slotInterval = 15;
  const workDayStart = new Date(`${date}T08:00Z`);
  const workDayEnd = new Date(`${date}T17:00Z`);
  const events = await getEvents({
    startDate: workDayStart.toISOString().replace(/\.\d{3}Z$/, "Z"),
    endDate: workDayEnd.toISOString().replace(/\.\d{3}Z$/, "Z"),
  });
  const timeSlots: Array<{ start: Date; end: Date }> = [];
  let slotStart = new Date(workDayStart);

  while (slotStart < workDayEnd) {
    const slotEnd = new Date(slotStart.getTime() + timeFrame * 60000);

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

async function createEvent(
  startDate: string,
  service: string,
  name: string,
  options?: {
    description?: string;
    timeFrame?: number;
  },
) {
  const url = new URL(
    `${process.env.CALENDAR_API_URL}/${process.env.CALENDAR_KEY}/events`,
  );

  url.searchParams.append("inputFormat", "markdown");

  const endDate = new Date(
    new Date(startDate).getTime() + (options?.timeFrame || 30) * 60000,
  );

  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify({
      subcalendar_ids: ["15143779"],
      start_dt: new Date(startDate).toISOString().replace(/\.\d{3}Z$/, "Z"),
      end_dt: endDate.toISOString().replace(/\.\d{3}Z$/, "Z"),
      signup_enabled: false,
      comments_enabled: true,
      attachments: [],
      title: `${service}`,
      notes: options?.description || "Test event created via API",
      who: name,
    }),
    headers: {
      "Teamup-Token": `${process.env.CALENDAR_API_KEY}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Error creating event: ${response.statusText}`);
  }

  const event = await response.json();

  let userId: string;

  const user = await db.query.customers.findFirst({
    where: (customers, { eq }) => eq(customers.name, name),
  });

  if (!user) {
    const insertedUser = await db
      .insert(customers)
      .values({
        name: name,
        phoneNumber: "N/A",
      })
      .returning();
    userId = insertedUser[0].id;
  } else {
    userId = user.id;
  }

  await db.insert(appointments).values({
    name: service,
    startDate: new Date(startDate),
    endDate: endDate,
    notes: options?.description || "",
    eventId: event.event.id,
    customerId: userId,
  });

  return { event, user };
}

async function checkAccess() {
  const response = await fetch(`${process.env.CALENDAR_API_URL}/check-access`, {
    method: "GET",
    headers: {
      "Teamup-Token": `${process.env.CALENDAR_API_KEY}`,
    },
  });

  if (!response.ok) {
    console.log(response);
    throw new Error(`Error checking access: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}

export const CalendarService = {
  getEvents,
  getAllTimeSlots,
  createEvent,
  checkAccess,
};
