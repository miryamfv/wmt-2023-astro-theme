import contentful, { EntryFieldTypes } from "contentful";

/**
 * Project entry type from Contentful (partial - only the fields we use).
 */
export interface project {
  contentTypeId: "project";
  fields: {
    title: EntryFieldTypes.Text;
    description: EntryFieldTypes.Text;
    url: EntryFieldTypes.Text;
    // thumbnail and other fields may exist but are intentionally left untyped here
    // to match how entries are used in the components.
    thumbnail?: any;
  };
}

/**
 * Small helper to read and validate environment variables.
 * This provides clear, early errors when required Contentful env vars are missing.
 */
function getEnvVar(key: string): string | undefined {
  // access import.meta.env in a safe way
  // Note: env.d.ts in this project declares the CONTENTFUL_* keys for TypeScript.
  // We still defensive-check at runtime to provide useful error messages.
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore - dynamic access on import.meta.env
  return import.meta.env[key];
}

const spaceId = getEnvVar("CONTENTFUL_SPACE_ID");
const previewToken = getEnvVar("CONTENTFUL_PREVIEW_TOKEN");
const deliveryToken = getEnvVar("CONTENTFUL_DELIVERY_TOKEN");
const isDev = Boolean(
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore - some build environments may not type DEV strictly
  import.meta.env.DEV,
);

function buildMissingEnvMessage(missingKeys: string[]) {
  return [
    "Missing required Contentful environment variable(s): " +
      missingKeys.join(", "),
    "",
    "Please add the missing variables to your environment. Example (.env):",
    "  CONTENTFUL_SPACE_ID=your_space_id",
    "  CONTENTFUL_DELIVERY_TOKEN=your_delivery_api_token",
    "  CONTENTFUL_PREVIEW_TOKEN=your_preview_api_token",
    "",
    "Notes:",
    "- When running locally (DEV=true) the code prefers CONTENTFUL_PREVIEW_TOKEN so you can test draft content.",
    "- In production it uses CONTENTFUL_DELIVERY_TOKEN and the host 'cdn.contentful.com'.",
  ].join("\n");
}

// Basic validation and selection of the access token depending on environment
if (!spaceId) {
  throw new Error(buildMissingEnvMessage(["CONTENTFUL_SPACE_ID"]));
}

let accessToken: string | undefined;
let host = isDev ? "preview.contentful.com" : "cdn.contentful.com";

if (isDev) {
  // Prefer preview token during development. If it's not set but delivery token is available,
  // fallback to delivery token with a console warning.
  if (previewToken && previewToken.trim().length > 0) {
    accessToken = previewToken;
    host = "preview.contentful.com";
  } else if (deliveryToken && deliveryToken.trim().length > 0) {
    // allow fallback but warn the developer so they understand what's happening
    // eslint-disable-next-line no-console
    console.warn(
      "CONTENTFUL_PREVIEW_TOKEN is not set. Falling back to CONTENTFUL_DELIVERY_TOKEN in DEV. " +
        "If you expect draft content during development, set CONTENTFUL_PREVIEW_TOKEN.",
    );
    accessToken = deliveryToken;
    host = "cdn.contentful.com";
  } else {
    throw new Error(
      buildMissingEnvMessage([
        "CONTENTFUL_PREVIEW_TOKEN",
        "CONTENTFUL_DELIVERY_TOKEN",
      ]),
    );
  }
} else {
  // Production / non-dev: delivery token is required
  if (deliveryToken && deliveryToken.trim().length > 0) {
    accessToken = deliveryToken;
    host = "cdn.contentful.com";
  } else {
    throw new Error(buildMissingEnvMessage(["CONTENTFUL_DELIVERY_TOKEN"]));
  }
}

// Final runtime sanity check before creating the client
if (!accessToken || accessToken.trim().length === 0) {
  throw new Error(
    buildMissingEnvMessage([
      "CONTENTFUL_DELIVERY_TOKEN",
      "CONTENTFUL_PREVIEW_TOKEN",
    ]),
  );
}

/**
 * Exported Contentful client used across the app.
 * If required env vars are missing, the file will already have thrown an error with
 * actionable guidance instead of letting the lower-level Contentful SDK produce an opaque error.
 */
export const contentfulClient = contentful.createClient({
  space: spaceId,
  accessToken,
  host,
});
