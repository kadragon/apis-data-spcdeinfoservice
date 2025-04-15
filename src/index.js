const BASE_URL = "https://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
	const allowedPaths = ["/getRestDeInfo", "/getAnniversaryInfo", "/get24DivisionsInfo"];

    if (allowedPaths.includes(url.pathname)) {
      const query = url.search; // ?serviceKey=...&solYear=...&solMonth=...

      const params = url.searchParams;

      // serviceKey가 없으면 env에서 자동 추가
      if (!params.has("serviceKey")) {
        params.set("serviceKey", env.datagokr_serviceKey);
      }

      const targetUrl = `${BASE_URL}${url.pathname}?${params.toString()}`;

      const response = await fetch(targetUrl, {
        method: "GET",
        headers: {
          // 클라이언트 IP 전달
          'X-Real-IP': request.headers.get('CF-Connecting-IP'),

          // 프록시 요청 흔적 제거
          'X-Forwarded-For': '',
          'X-Forwarded-Host': '',
          'X-Forwarded-Proto': '',

          // 브라우저처럼 보이도록 User-Agent 설정
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        }
      });

      return new Response(response.body, {
        status: response.status,
        headers: {
          'Content-Type': response.headers.get('content-type') || 'application/xml',
        },
      });
    }

    // 그 외 경로는 404 처리
    return new Response("Not Found", { status: 404 });
  }
};