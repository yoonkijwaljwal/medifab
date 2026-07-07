# Cafe24 스킨 아키텍처

## 렌더링 모델

```
Cafe24 서버
  └── layout/basic/layout.html  (공통 셸)
        ├── header / sidebar / footer
        └── 각 페이지 HTML (index.html, shopinfo/company.html, …)
              └── module="..." 블록 → Cafe24가 데이터 주입
```

로컬에서는 HTML/CSS/JS 파일 편집만 가능합니다. `{$변수}`, `module` 블록의 실제 데이터는 Cafe24 환경에서만 확인할 수 있습니다.

## 레이아웃 계층

**`skin3/layout/basic/layout.html`**

- 전역 CSS: `common.css` (전체 페이지 영향 — 신중히 수정), `layout.css` (MEDIFAB 타이포 토큰 `--mf-*` 포함)
- 전역 JS: `basic.js`, `layout.js`, `common.js`
- EZ(이지) 모듈: `<!--@js(/ez/init.js)-->`, `data-ez-module` 속성

**페이지 파일**

- `<!--@layout(/layout/basic/layout.html)-->` 로 레이아웃 상속
- 본문은 Cafe24 표준 `section` 구조 + 커스텀 `pg-*` 루트

## CSS 전략

| 범위 | 파일 | 주의 |
|------|------|------|
| 전역 | `layout/basic/css/common.css`, `layout.css` | 변경 최소화 |
| 모듈/페이지 | `css/module/{영역}/{이름}.css` | 신규 스타일 기본 위치 |
| 메인 | `layout/basic/css/main.css` | `index.html` 전용 |

신규 스타일은 **페이지 루트 아래 스코프**:

```css
.pg-about .about-hero { ... }
```

`!important` 사용 금지. Cafe24 기존 클래스(`ec-base-*`, `xans-*`)는 유지·재사용.

## JS 전략

- 전역: `layout/basic/js/`, `js/common.js`
- 모듈: `js/module/{영역}/{이름}.js`
- jQuery·Cafe24 모듈과 충돌 주의
- DOM 훅: `data-*` 속성 권장

## 클래스 네이밍 (요약)

- 페이지 루트: `pg-{약어}` (예: `pg-home`, `pg-about`)
- 섹션: `{약어}-{역할}` (예: `home-hero`, `about-intro`)
- kebab-case, 2~3단어 이내
- 상세 규칙 → `skin3/.cursor/rules/figma-page-dev.mdc`

## 주요 소스 참조

- 홈 커스텀: `skin3/index.html`, `layout/basic/css/main.css`, `layout/basic/js/main.js`
- 서브페이지 패턴: `skin3/shopinfo/company.html`
- 타이포 토큰: `skin3/layout/basic/css/layout.css` (`:root` `--mf-*`)

## 작업 시 체크리스트

1. `module`, `{$변수}`, EZ 마커를 건드리지 않았는가
2. CSS가 `pg-*` 루트로 스코프되어 있는가
3. 전역 CSS 수정 없이 페이지 전용 CSS로 해결했는가
4. JS가 기존 Cafe24 스크립트와 충돌하지 않는가
