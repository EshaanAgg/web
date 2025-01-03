import { defineDb, defineTable, column } from "astro:db";

// https://astro.build/db/config
const Views = defineTable({
  columns: {
    slug: column.text({ primaryKey: true }),
    count: column.number({
      default: 1,
    }),
  },
});

export default defineDb({
  tables: { Views },
});
