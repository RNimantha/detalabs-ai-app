export async function GET(request: Request) {
  const host = new URL(request.url).host; // captures the subdomain
  return new Response(JSON.stringify({ host }), {
    headers: { 'content-type': 'application/json' },
  });
}
