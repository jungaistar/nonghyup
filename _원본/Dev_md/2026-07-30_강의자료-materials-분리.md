# 2026-07-30 강의자료 분리 — public/ → aebonlee/materials

## 배경

전역 CLAUDE.md **§3.8 자산 보호 원칙 2층**에 따른 작업이다.

취지는 "내가 만든 사이트를 누구도 그대로 가져가지 못하게". 그런데 실측해 보니 강의자료가
**빌드 산출물(`public/`)에 그대로 들어 있어 사이트를 통째로 긁으면 자료까지 같이 딸려갔다.**
`contents.dreamitbiz.com/image-guide.pdf` 12MB가 인증 없이 HTTP 200으로 받아지는 것을 확인했다.

리포를 private으로 돌려도 이건 막히지 않는다. 배포된 Pages 사이트는 private 리포에서도 계속 공개되기 때문이다
(ahp-basic·pytorch26이 private인데 사이트 HTTP 200으로 실증됨). 그래서 **자료를 번들 밖으로 빼는 것**이 유일한 해법이었다.

## 한 일

이 사이트의 자료 **3건**을 `aebonlee/materials` 리포로 옮기고, 사이트는 정본 주소를 참조하게 했다.

- 실습 샘플 CSV 3종(거래처 주문·고객문의 처리·월별 사료판매)

정본 주소 형식:

```
https://raw.githubusercontent.com/aebonlee/materials/main/nonghyupsaryo/<파일명>
```

`BlockRenderer.jsx`가 `${base}samples/${encodeURIComponent(f.file)}`로 조립하던 것을 정본 주소로 바꿨다. 한글 파일명이라 `encodeURIComponent`는 유지했다.

이 3건은 최초 수집에서 놓쳤던 것이다(`.csv`를 빠뜨렸다).

## 검증

- `vite build` 통과
- **`dist/`에 문서 파일 0건** — `find dist -iname '*.pdf' -o -iname '*.pptx' -o -iname '*.doc*' -o -iname '*.ipynb' -o -iname '*.zip'` 결과 없음.
  즉 이제 사이트를 통째로 복제해도 자료는 딸려가지 않는다.
- 정본 raw 주소 HTTP 200 실측 (한글 파일명 포함, URL 인코딩 확인)

## 주의

**`aebonlee/materials`는 반드시 public으로 유지해야 한다.**
private으로 바꾸면 토큰 없는 요청이 404가 되어 이 사이트의 자료 링크가 끊긴다.
사이트 리포를 일괄 private 전환할 때 materials는 대상에서 제외할 것.

## 관련

- 전역 규칙: CLAUDE.md §3.8
- 자료 정본: https://github.com/aebonlee/materials
- 전수 감사 기록: https://github.com/aebonlee/dreamit-1000
