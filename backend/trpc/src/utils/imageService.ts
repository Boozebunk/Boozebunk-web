import { TRPCError } from "@trpc/server";
import { sql } from "drizzle-orm";

import db from "@boozebunk-trpc/db";
import { productImagesTable } from "@boozebunk-trpc/db/schema/productImages";

async function fetchImageFromSerp(brand: string, productName: string): Promise<string | undefined> {
  const query = `${brand} ${productName} bottle`;
  const url = `https://serpapi.com/search.json?q=${encodeURIComponent(query)}&tbm=isch&ijn=0&api_key=${process.env.SERPAPI_KEY}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      console.error(`SERP API Error: ${response.status} ${response.statusText}`);
      return undefined;
    }

    const data = (await response.json()) as {
      images_results?: Array<{ original?: string; thumbnail?: string }>;
    };

    if (data.images_results && data.images_results.length > 0) {
      const result = data.images_results[0];
      if (result) {
        return result.original || result.thumbnail;
      }
    }

    return undefined;
  } catch (err) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: `Failed to fetch image from SERP API. Please try again later. ${err}`,
      cause: err,
    });
  }
}

export async function getImageUrlAndCache(
  brand: string,
  product: string,
): Promise<string | undefined> {
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
    return fuzzyMatches[0]?.imageUrl;
  }

  // CASE - 2. CACHE MISS: Call external API (Costly Operation)
  const externalImageUrl = await fetchImageFromSerp(brand, product);

  if (!externalImageUrl) {
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
  } catch (err) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: `Failed to cache image URL in the database. Please try again later. ${err}`,
      cause: err,
    });
  }

  return externalImageUrl;
}
