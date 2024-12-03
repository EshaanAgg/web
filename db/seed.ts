import { db, Views } from "astro:db";

// https://astro.build/db/seed
export default async function seed() {
  await db
    .insert(Views)
    .values({
      slug: "/",
      count: 1,
    })
    .execute();
}
