// config.ts
interface Config {
    SUPABASE_BUCKET_NAME: string;
  }
  
  export const config: Config = {
    SUPABASE_BUCKET_NAME: process.env.NEXT_PUBLIC_SUPABASE_BUCKET_NAME || '',
  };
  
  if (!config.SUPABASE_BUCKET_NAME) {
    throw new Error('Supabase bucket name is not defined in environment variables.');
  }