import db from "@boozebunk-trpc/db";
import { productImagesTable } from "@boozebunk-trpc/db/schema/productImages";
import { sql } from "drizzle-orm";

// --- SERP API CALL FUNCTION ---
async function fetchImageFromSerp(brand: string, productName: string): Promise<string | undefined> {
  const query = `${brand} ${productName} bottle`;
  const url = `https://serpapi.com/search.json?q=${encodeURIComponent(query)}&tbm=isch&ijn=0&api_key=${process.env.SERPAPI_KEY}`;

  try {
    console.log(`[SERP API CALL] Searching for: ${query}`);
    const response = await fetch(url);

    if (!response.ok) {
      console.error(`SERP API Error: ${response.status} ${response.statusText}`);
      return undefined;
    }

    const data = (await response.json()) as {
      images_results?: Array<{ original?: string; thumbnail?: string }>;
    };

    // Check for results and return the original URL of the first image
    if (data.images_results && data.images_results.length > 0) {
      const result = data.images_results[0];
      if (result) {
        return result.original || result.thumbnail;
      }
    }

    return undefined;
  } catch (err) {
    console.error("Failed to execute SERP API call:", err);
    return undefined;
  }
}

/**
 * Retrieves the image URL from cache or fetches it from SERP API and caches it.
 * This function is non-blocking to the main application flow.
 * @returns The direct external image URL, or undefined if not found.
 */
export async function getImageUrlAndCache(
  brand: string,
  product: string,
): Promise<string | undefined> {
  // 1. CHECK CACHE (Database)
  // const cachedImage = await db.query.images.findFirst({
  //   where: and(
  //     eq(productImagesTable.brandName, brand),
  //     eq(productImagesTable.productName, product),
  //   ),
  // });

  // if (cachedImage) {
  //   console.log(`[CACHE HIT] Found external URL for ${product}.`);
  //   return cachedImage.imageUrl; // Cache hit: Use stored URL
  // }

  // CASE - 1. Fuzzy Search for similar entries in case of minor typos
  const inputSearchPhrase = (brand + " " + product).toLowerCase().trim();

  const fuzzyMatches = await db
    .select()
    .from(productImagesTable)
    .where(
      sql`SIMILARITY(LOWER(TRIM(${productImagesTable.brandName} || ' ' || ${productImagesTable.productName})), ${inputSearchPhrase}) > 0.4`,
    )
    .orderBy(
      sql`SIMILARITY(LOWER(TRIM(${productImagesTable.brandName} || ' ' || ${productImagesTable.productName})), ${inputSearchPhrase}) DESC`,
    )
    .limit(1);

  if (fuzzyMatches.length > 0) {
    console.log(`[CACHE FUZZY HIT] Found similar external URL for ${product}.`);
    return fuzzyMatches[0]?.imageUrl; // Cache hit: Use stored URL
  }

  // CASE - 2. CACHE MISS: Call external API (Costly Operation)
  const externalImageUrl = await fetchImageFromSerp(brand, product);

  if (!externalImageUrl) {
    console.log(`[SERP FAIL] No image found for ${product}.`);
    return undefined;
  }

  try {
    await db
      .insert(productImagesTable)
      .values({
        brandName: brand,
        productName: product,
        imageUrl: externalImageUrl,
      })
      .onConflictDoNothing({
        target: [productImagesTable.brandName, productImagesTable.productName],
      });

    console.log("[CACHE WRITE] Stored new URL.");
  } catch (e) {
    // This catch handles conflicts if two users try to upload the same product image simultaneously
    console.warn("Conflict occurred while saving image URL, continuing with the fetched URL. ", e);
  }

  return externalImageUrl;
}
