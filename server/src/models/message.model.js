import { pgTable, serial, integer, text, timestamp } from "drizzle-orm/pg-core"
import { users } from "./users.model.js"

export const messageTable = pgTable("message_table",{
    id: serial("id").primaryKey(),
    senderId: integer("sender_id").notNull().references(() => users.id),
    receiverId: integer("receiver_id").notNull().references(() => users.id),
    message: text("message").notNull(null),
    image: text("image").default(null),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow()
})