import { integer, pgTable, varchar, text, json } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  credits: integer().notNull().default(0),
});

export const sessionChatTable = pgTable("session_chats", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  createdBy: varchar().references(() => usersTable.email, {
    onDelete: "cascade",
  }),
  sessionId: varchar({ length: 255 }).notNull(),
  selectedDoctor: json(),
  notes: text().notNull(),
  conversation: json(),
  report: json(),
  createdOn: varchar(),
});
