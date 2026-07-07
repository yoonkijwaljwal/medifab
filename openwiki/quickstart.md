# MEDIFAB OpenWiki quickstart

Cafe24 쇼핑몰 스킨 저장소입니다. 로컬에서 단독 실행되지 않으며, Cafe24 서버에서 렌더링됩니다.

## 저장소 구조

| 경로 | 설명 |
|------|------|
| `skin3/` | **현재 작업 중인 스킨** — MEDIFAB 커스텀 디자인·페이지 |
| `skin2/` | 이전/참고용 스킨 (일부 파일만 유지) |

주요 작업 대상은 `skin3/`입니다.

## skin3 핵심 디렉터리

| 경로 | 역할 |
|------|------|
| `layout/basic/` | 공통 레이아웃 (`layout.html`, header, footer, sidebar) |
| `layout/basic/css/` | 전역 CSS (`common.css`, `layout.css` — 수정 시 주의) |
| `layout/basic/js/` | 전역 JS (`basic.js`, `layout.js`, `main.js`) |
| `css/module/` | 페이지·모듈별 CSS (신규 스타일은 여기에) |
| `js/module/` | 페이지·모듈별 JS |
| `shopinfo/` | 회사소개 등 정적 서브페이지 |
| `product/`, `order/`, `member/`, `myshop/` | Cafe24 쇼핑몰 기능 모듈 |
| `board/` | 게시판 |
| `SkinImg/` | 이미지·아이콘 에셋 |
| `svg/` | SVG 아이콘 HTML 조각 |

## Cafe24 스킨 문법 (필수)

페이지 HTML 상단 패턴:

```html
<!--@layout(/layout/basic/layout.html)-->
<!--@css(/css/module/.../about.css)-->
<!--@js(/js/module/.../about.js)-->
```

**수정 금지 요소** (Cafe24 엔진 전용):

- `module="..."` 속성
- `{$변수}` 템플릿 변수
- `<!--#ez="..."-->` EZ 마커
- `<!--@layout-->`, `<!--@css-->`, `<!--@js-->` 경로만 올바르게 추가

## 페이지 개발 흐름

1. `layout/basic/layout.html`이 header / sidebar / footer를 감쌈
2. 각 페이지는 `section path` + `section titleArea` 패턴 유지 (기존 `shopinfo/company.html` 참고)
3. 피그마 커스텀 영역은 **페이지 루트 클래스** (`pg-{페이지약어}`) 하나로 감싸기
4. CSS는 `css/module/` 하위 페이지별 파일로 분리
5. 신규 파일 생성 전 사용자 확인

현재 커스텀 페이지 예: `skin3/index.html` (`pg-home`)

## Cursor 규칙과의 관계

| 규칙 | 역할 |
|------|------|
| `skin3/.cursor/rules/openwiki-context.mdc` | 이 위키를 먼저 참고하도록 안내 |
| `skin3/.cursor/rules/figma-page-dev.mdc` | **skin3 UI 작업 시 우선 적용** — 타이포, 클래스명, CSS/JS 규칙 |

피그마·스타일·클래스명 관련 세부 규칙은 **figma-page-dev 규칙이 우선**입니다. 이 위키는 프로젝트 구조·Cafe24 패턴 이해용입니다.

## 문서 맵

- [Cafe24 스킨 아키텍처](architecture/cafe24-skin.md)

## OpenWiki CLI 갱신

문서를 AI로 재생성·갱신하려면:

```bash
openwiki --init    # 최초 생성 (대화형 — API 키 설정 필요)
openwiki --update  # 변경 반영
```

API 키는 `~/.openwiki/.env`에 저장됩니다.
