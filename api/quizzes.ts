// Vercel serverless function to list quizzes via Supabase REST (axios).
// Requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY env vars.
import type { VercelRequest, VercelResponse } from "@vercel/node";
import axios from "axios";

const allowCors = (res: VercelResponse) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "OPTIONS") {
    allowCors(res);
    res.status(204).end();
    return;
  }
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    res.status(500).json({ error: "SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing" });
    return;
  }

  try {
    const { data, status } = await axios.get(`${url}/rest/v1/quizzes`, {
      params: {
        select:
          "id,title,status,description,category,questions,duration,completions,completion_rate,created_at",
        order: "created_at.desc",
      },
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
      },
    });
    allowCors(res);
    res.status(status).json(data);
  } catch (error) {
    const message =
      axios.isAxiosError(error) && error.response
        ? JSON.stringify(error.response.data)
        : (error as Error).message;
    res.status(500).json({ error: message });
  }
}
