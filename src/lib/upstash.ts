const UPSTASH_URL = process.env.UPSTASH_REDIS_URL!
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_TOKEN!

export async function upstashExec(command: string, ...args: string[]): Promise<{ result: any; error?: string }> {
  const res = await fetch(UPSTASH_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${UPSTASH_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify([command, ...args]),
  })
  return res.json()
}
