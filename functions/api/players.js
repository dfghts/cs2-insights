export async function onRequest() {
  const url = "https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=730";
  try {
    const response = await fetch(url, { headers: { "Accept": "application/json" } });
    if (!response.ok) return new Response(JSON.stringify({ error: "Steam API unavailable" }), {
      status: 502, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
    const body = await response.text();
    return new Response(body, {
      status: 200,
      headers: { "Content-Type": "application/json", "Cache-Control": "public, max-age=60", "Access-Control-Allow-Origin": "*" }
    });
  } catch {
    return new Response(JSON.stringify({ error: "Unable to reach Steam API" }), {
      status: 502, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  }
}
