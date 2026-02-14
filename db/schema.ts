import { relations } from "drizzle-orm";
import {
  integer,
  jsonb,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const customers = pgTable("customers", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email"),
  phoneNumber: text("phone_number").notNull(),

  status: text("status").notNull().default("active"),

  notes: text("notes"),
});

export const appointments = pgTable("appointments", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),

  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),

  notes: text("notes"),
  eventId: text("event_id").notNull(),

  status: text("status").notNull().default("scheduled"),
  details: jsonb("details").notNull().default({}),

  customerId: uuid("customer_id").notNull(),
});

export const services = pgTable("services", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  duration: integer("duration"),
  price: integer("price"),
  image: text("image"),
});

export const serviceChildToParent = pgTable(
  "service_child_to_parent",
  {
    parentId: uuid("parent_id").notNull(),
    childId: uuid("child_id").notNull(),
  },
  (table) => [primaryKey({ columns: [table.parentId, table.childId] })],
);

export const customerRelations = relations(customers, ({ many }) => ({
  appointments: many(appointments),
}));

export const appointmentRelations = relations(appointments, ({ one }) => ({
  customer: one(customers, {
    fields: [appointments.customerId],
    references: [customers.id],
  }),
}));

export const serviceRelations = relations(services, ({ many }) => ({
  parent: many(serviceChildToParent, {
    relationName: "parentToChild",
  }),
  children: many(serviceChildToParent, {
    relationName: "childToParent",
  }),
}));

export const serviceChildToParentRelations = relations(
  serviceChildToParent,
  ({ one }) => ({
    parent: one(services, {
      fields: [serviceChildToParent.parentId],
      references: [services.id],
      relationName: "childToParent",
    }),
    child: one(services, {
      fields: [serviceChildToParent.childId],
      references: [services.id],
      relationName: "parentToChild",
    }),
  }),
);
