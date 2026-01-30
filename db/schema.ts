import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const customers = pgTable("customers", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email"),
  phoneNumber: text("phone_number"),

  notes: text("notes"),
});

export const appointments = pgTable("appointments", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),

  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),

  notes: text("notes"),
  eventId: text("event_id").notNull(),

  customerId: uuid("customer_id").notNull(),
});

export const customerRelations = relations(customers, ({ many }) => ({
  appointments: many(appointments),
}));

export const appointmentRelations = relations(appointments, ({ one }) => ({
  customer: one(customers, {
    fields: [appointments.customerId],
    references: [customers.id],
  }),
}));
