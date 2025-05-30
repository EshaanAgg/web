import { db, Views, ViewsPerMonth } from "astro:db";

// https://astro.build/db/seed
export default async function seed() {
  await db
    .insert(Views)
    .values({
      slug: "/",
      count: 1,
    })
    .execute();

  await db
    .insert(ViewsPerMonth)
    .values({
      monthYear: "2025-01",
      count: 1,
    })
    .execute();
}
