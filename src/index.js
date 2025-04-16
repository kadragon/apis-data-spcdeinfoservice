const BASE_URL = "https://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const allowedPaths = new Set(["/getRestDeInfo", "/getAnniversaryInfo", "/get24DivisionsInfo"]);
    
    // Preflight 요청 처리
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    if (allowedPaths.has(url.pathname)) {
      const params = url.searchParams;

      if (!env.datagokr_serviceKey) {
        return new Response(JSON.stringify({
          error: "Missing environment variable",
          message: "datagokr_serviceKey is not defined in the environment",
        }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      params.set("serviceKey", env.datagokr_serviceKey);

      const targetUrl = `${BASE_URL}${url.pathname}?${params.toString()}`;

      const userAgents = [
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 13_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.6167.140 Safari/537.36"
      ];
      const randomUserAgent = userAgents[Math.floor(Math.random() * userAgents.length)];

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000); // 10초

      try {
        const response = await fetch(targetUrl, {
          method: "GET",
          headers: {
            'User-Agent': randomUserAgent,
          },
          signal: controller.signal

        });
        clearTimeout(timeout);

        const headers = {
          // 기본 응답이 XML이므로 기본값으로 'application/xml' 사용
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
        console.error("Fetch Error:", e);

        return new Response(JSON.stringify({
          error: "Fetch Error",
          message: e.message,
        }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': '*',
          },
        });
      }
    }

    return new Response("Not Found", { status: 404 });
  }
};