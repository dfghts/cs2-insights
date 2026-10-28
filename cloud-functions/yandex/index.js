export async function handler(event, context) {
  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Cache-Control": "public, max-age=60"
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  try {
    const response = await fetch(
      "https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=730"
    );
    if (!response.ok) {
      return {
        statusCode: 502,
        headers,
        body: JSON.stringify({ error: "Steam API unavailable" })
      };
    }
    const body = await response.text();
    return { statusCode: 200, headers, body };
  } catch {
    return {
      statusCode: 502,
      headers,
      body: JSON.stringify({ error: "Unable to reach Steam API" })
    };
  }
}
