# Design System

이 앱의 디자인 시스템은 현재의 캐주얼한 파티 게임 톤을 유지하면서, 화면마다 반복되던 Tailwind 조합을 의미 기반 토큰과 공통 컴포넌트로 정리하기 위한 기준입니다.

## UX States

- `entry`: 사용자가 게임 또는 모드를 처음 선택하는 상태
- `selection`: 카드, 선택지, 방 만들기/참가처럼 결정을 내리는 상태
- `progress`: 게임 진행, 턴, 타이머, 점수처럼 현재 상황을 보여주는 상태
- `waiting`: 멀티플레이어 대기실, 다른 플레이어 차례, 연결 대기 상태
- `error`: 연결 실패, 잘못된 라우트, 예상치 못한 오류 상태
- `result`: 라운드 결과, 투표 결과, 게임 종료 상태
- `exit`: 나가기, 다시 시작, 메인 메뉴 복귀 상태

## Tokens

- `themeByTone`: 브랜드와 5개 게임별 배경, accent gradient, focus ring, soft surface를 정의합니다.
- `surface`: glass panel, subtle panel, dark chip 같은 반복 surface를 정의합니다.
- `radius`: control, panel, feature, pill 반경을 분리합니다.
- `motion`: hover/active 동작을 표준화하고 reduced motion 환경을 고려합니다.

## Component Rules

- 모든 주요 CTA는 `Button`을 사용합니다.
- 배경과 장식은 `PageShell`을 사용합니다.
- 유리 패널은 `GlassPanel`을 사용합니다.
- 선택 가능한 게임/모드 카드는 `GameCard`를 사용하고 `aria-pressed` 또는 명확한 label을 제공합니다.
- 정보, 오류, 빈 상태는 `EmptyState` 또는 `StatusBadge`로 표현합니다.
- 텍스트 입력은 `TextInput`으로 통일하고 label/help/error를 함께 제공합니다.

## Multiplayer UX

- 방 만들기/참가 실패 시 사용자가 입력 화면에 머물러야 합니다.
- 연결 중에는 CTA에 loading 상태를 표시합니다.
- 시작 불가 상태는 버튼 disabled만 두지 말고 이유 문구를 함께 보여줍니다.
- 모바일에서는 채팅을 기본 접힘 상태로 두고 게임 CTA와 겹치지 않게 합니다.
