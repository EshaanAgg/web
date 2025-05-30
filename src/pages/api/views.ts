 

 

 
import type { APIRoute } from "astro";
import { db, Views, sql, eq } from "astro:db";

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

    return new Response("OK", { status: 200 });
  } catch (error) {
    console.log(`Error incrementing views for ${slug}: `, error);
    return new Response("Internal Server Error", { status: 500 });
  }
};
