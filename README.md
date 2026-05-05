# EDU ONEQ landing page

정적 랜딩 페이지입니다. `index.html`을 바로 열어 확인할 수 있고, AWS S3/CloudFront, AWS Amplify, Vercel, Netlify 같은 정적 호스팅에 그대로 배포할 수 있습니다.

## 파일 구성

- `index.html`: 랜딩 페이지 마크업
- `styles.css`: 반응형 디자인과 애니메이션
- `script.js`: 헤더 상태, 스크롤 리빌, Lucide 아이콘 초기화
- `assets/`: 제품 소개서 PDF에서 추출한 AiBU, Docs ONEQ 화면 이미지
- `robots.txt`, `sitemap.xml`: `www.eduoneq.com` 기준 검색엔진 기본 파일

## AWS 권장 배포 흐름

1. S3 버킷을 만들고 정적 웹사이트 파일을 업로드합니다.
2. ACM에서 `www.eduoneq.com` 인증서를 발급합니다. CloudFront를 쓸 경우 인증서는 `us-east-1` 리전에 둡니다.
3. CloudFront 배포를 만들고 S3를 origin으로 연결합니다.
4. Route 53 Hosted Zone을 만들거나, CloudFront 도메인을 후이즈 DNS에 CNAME으로 연결합니다.
5. 후이즈에서 네임서버를 바꿀 수 있다면 Route 53 Hosted Zone의 NS 값 4개로 교체하는 방식이 가장 관리하기 쉽습니다.
6. `www.eduoneq.com`은 CloudFront로 연결하고, 루트 도메인 `eduoneq.com`은 `www.eduoneq.com`으로 리다이렉트합니다.

## 빠른 로컬 확인

브라우저에서 `index.html`을 열면 됩니다. 로컬 서버가 필요하면 아래 명령을 사용할 수 있습니다.

```bash
python3 -m http.server 8000
```

그 다음 `http://localhost:8000`에서 확인합니다.
