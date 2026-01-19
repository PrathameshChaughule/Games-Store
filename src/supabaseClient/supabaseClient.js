import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY

export const supabase = createClient(supabaseUrl, supabaseKey);

export const getOptimizedImage = (
  fullUrl,
  {
    width = 400,
    height,
    quality = 60,
    resize = "cover"
  } = {}
) => {
  if (!fullUrl) return "";

  // Extract relative path from full Supabase public URL
  const publicIndex = fullUrl.indexOf("/storage/v1/object/public/");
  if (publicIndex === -1) return fullUrl;

  const path = fullUrl.substring(
    publicIndex + "/storage/v1/object/public/".length
  );

  let url = `${supabaseUrl}/storage/v1/render/image/public/${path}?width=${width}&quality=${quality}&resize=${resize}`;

  if (height) url += `&height=${height}`;

  return url;
};


