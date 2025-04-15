# ☁️ Cloudflare Worker Proxy for 한국천문연구원_특일 정보 API

> 공공데이터포털에서 제공하는 **[한국천문연구원_특일 정보 API](https://www.data.go.kr/tcs/dss/selectApiDataDetailView.do?publicDataPk=15012690)**를  
> Cloudflare Worker를 통해 프록시 처리하여 브라우저 또는 서버에서 자유롭게 사용할 수 있도록 구성

---

## 📌 개요

공공데이터포털(`https://apis.data.go.kr`)은 브라우저 환경 또는 일부 서버 환경에서 직접 호출 시 CORS 문제 혹은 IP 차단 등의 문제가 발생할 수 있습니다.  
이 Worker는 해당 문제를 회피하기 위해 **Cloudflare Worker** 위에서 동작하는 경량 API 프록시 서버입니다.

---

## 🚀 주요 기능

- ✅ **지원 엔드포인트:** 원본 API의 `getRestDeInfo`(국경일/공휴일), `getAnniversaryInfo`(기념일), `get24DivisionsInfo`(24절기) 세 가지 엔드포인트만 지원합니다. (다른 엔드포인트는 현재 지원하지 않습니다.)
- ✅ `.env` 또는 Secret 환경변수로 API Key 관리

---

## 📜 라이선스 (License)

이 프로젝트는 MIT 라이선스에 따라 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참고하세요.
