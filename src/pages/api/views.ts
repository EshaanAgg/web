import type { APIRoute } from "astro";
import { db, Views, sql, eq, ViewsPerMonth } from "astro:db";

// Updates the page view count for a given slug.
const updatePageViewCount = async (slug: string) => {
  // Get the current count
  const currentCount = await db
    .select({ count: Views.count })
    .from(Views)
    .where(eq(Views.slug, slug))
    .execute();

  // If the record exists, increment the count
  if (currentCount.length > 0) {
    await db
      .update(Views)
      .set({
        count: sql`${Views.count} + 1`,
      })
      .where(eq(Views.slug, slug))
      .execute();
  } else {
    // Otherwise, create a new record
    await db
      .insert(Views)
      .values({
        slug,
        count: 1,
      })
      .execute();
  }
};

const updateViewsPerMonth = async () => {
  const currentDate = new Date();
  const monthYear = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}`;

  const currentCount = await db
    .select({ count: ViewsPerMonth.count })
    .from(ViewsPerMonth)
    .where(eq(ViewsPerMonth.monthYear, monthYear))
    .execute();

  // If the record exists, increment the count
  if (currentCount.length > 0) {
    await db
      .update(ViewsPerMonth)
      .set({
        count: sql`${ViewsPerMonth.count} + 1`,
      })
      .where(eq(ViewsPerMonth.monthYear, monthYear))
      .execute();
  } else {
    // Otherwise, create a new record
    await db
      .insert(ViewsPerMonth)
      .values({
        monthYear,
        count: 1,
      })
      .execute();
  }
};

export const POST: APIRoute = async ({ request }) => {
  const body: unknown = JSON.parse(await request.text());

  // Validate the request body
  if (typeof body !== "object" || body === null) {
    return new Response("Bad Request", { status: 400 });
  }
  if (!("slug" in body) || typeof body.slug !== "string") {
    return new Response("Bad Request", { status: 400 });
  }

  const slug = body.slug;

  try {
    await Promise.all([updatePageViewCount(slug), updateViewsPerMonth()]);
    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error("Error updating views:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
};
