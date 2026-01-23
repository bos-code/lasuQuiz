// Vercel serverless function to list Clerk users.
// Requires environment variable CLERK_SECRET_KEY (do NOT expose to the client).
import axios from "axios";

export default async function handler(req: any, res: any) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.status(204).end();
    return;
  }

  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const secretKey = process.env.CLERK_SECRET_KEY;
  if (!secretKey) {
    res.status(500).json({ error: "CLERK_SECRET_KEY is not set" });
    return;
  }

  const limit = Math.min(Number(req.query.limit) || 100, 200);
  const offset = Number(req.query.offset) || 0;

  try {
    const { data, status } = await axios.get(
      "https://api.clerk.com/v1/users",
      {
        params: { limit, offset },
        headers: {
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    res.status(status).json(data);
  } catch (error) {
    const message =
      axios.isAxiosError(error) && error.response
        ? JSON.stringify(error.response.data)
        : (error as Error).message;
    res.status(500).json({ error: message });
  }
}
