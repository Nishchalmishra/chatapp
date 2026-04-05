import {pgTable, serial, text, timestamp} from "drizzle-orm/pg-core"

export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    avatar: text("avatar").default(null),
    username: text("username").notNull(),
    email: text("email").notNull().unique(),
    password: text("password").notNull(),
    refreshToken : text("refreshToken").default(null),
    createdAT: timestamp("created_at").notNull().defaultNow(),
    updatedAt : timestamp("updated_at").notNull().defaultNow()
})