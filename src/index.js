const BASE_URL = "https://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const allowedPaths = ["/getRestDeInfo", "/getAnniversaryInfo", "/get24DivisionsInfo"];

    // Preflight 요청 처리
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': '*',
        },
      });
    }

    if (allowedPaths.includes(url.pathname)) {
      const params = url.searchParams;

      if (!params.has("serviceKey")) {
        params.set("serviceKey", env.datagokr_serviceKey);
      }

      const targetUrl = `${BASE_URL}${url.pathname}?${params.toString()}`;

      try {
        const response = await fetch(targetUrl, {
          method: "GET",
          headers: {
            'X-Real-IP': request.headers.get('CF-Connecting-IP'),
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
            'X-Forwarded-For': '',
            'X-Forwarded-Host': '',
            'X-Forwarded-Proto': '',
          }
        });

        const headers = {
          'Content-Type': response.headers.get('content-type') || 'application/xml',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': '*',
        };

        return new Response(response.body, {
          status: response.status,
          headers,
        });

      } catch (e) {
        return new Response(`Fetch Error: ${e.message}`, {
          status: 500,
          headers: { 'Content-Type': 'text/plain' },
        });
      }
    }

    return new Response("Not Found", { status: 404 });
  }
};