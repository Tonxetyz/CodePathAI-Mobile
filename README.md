# CodePath AI Mobile

**A Duolingo-style mobile app that gamifies learning prompt engineering and AI-assisted coding.**

<p>
  <img alt="Expo" src="https://img.shields.io/badge/Expo-~57-000020?style=flat&logo=expo&logoColor=white">
  <img alt="React Native" src="https://img.shields.io/badge/React_Native-0.86-20232A?style=flat&logo=react&logoColor=61DAFB">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-6.0-3178C6?style=flat&logo=typescript&logoColor=white">
  <img alt="NativeWind" src="https://img.shields.io/badge/NativeWind-Tailwind_CSS-38BDF8?style=flat&logo=tailwindcss&logoColor=white">
  <img alt="State" src="https://img.shields.io/badge/State-React_Hooks-61DAFB?style=flat">
  <img alt="Platform" src="https://img.shields.io/badge/Built_with-Expo_%26_EAS-000020?style=flat&logo=expo&logoColor=white">
  <a href="./LICENSE"><img alt="License" src="https://img.shields.io/badge/License-MIT-yellow.svg"></a>
</p>

[Try it on Expo](#getting-started) · [Features](#key-features) · [Quick Start](#getting-started) · [Architecture](#project-structure)

---

<div align="center">
  <img src=".github/hero.png" alt="CodePath AI running on a phone" width="480">
</div>

---

## Key Features

- 🗺️ **Skill-tree world map** — lessons are laid out as a branching path of nodes (`prompt-builder`, `prompt-duel`, `code-fix`, `brief-to-prompt`, boss battles) that unlock sequentially as previous nodes are completed. Built with `components/map/WorldMap.tsx` + `mapData.ts`.
- 🧪 **Interactive Prompt Lab** — users assemble a prompt, tick off quality checklist chips (clear role, output format, error handling) and get live pass/fail feedback, mimicking how a real prompt gets reviewed before being sent to an AI. See `LabPage` in `components/PromptLabScreen.tsx`.
- 🐛 **Code-fix challenges** — real, syntactically valid Python snippets are rendered with a highlighted risky line; the learner picks the bug (missing timeout, unhandled HTTP error, etc.) and receives an explanation, teaching defensive coding habits. See `SnippetsPage` and `components/lessons/CodeFixLesson.tsx`.
- 🐙 **OctoMate, the animated mascot** — a hand-built companion with mood states (`idle` / `happy` / `sad` / `thinking`), bobbing/tilting/eye-tracking animations via the React Native `Animated` API, and a confetti burst on success. See `components/octo/OctoMate.tsx` and `Confetti.tsx`.
- 💻 **PC / Claude Code terminal sync** — a bottom sheet generates a 6-digit code and QR-style pattern so a prompt composed on the phone can be copied straight into a desktop terminal via the clipboard. See `components/sync/PcSyncSheet.tsx` (uses `expo-clipboard`).
- 🏆 **Full gamification loop** — XP, daily streaks, a league leaderboard, a shop for streak shields / XP boosts, daily quests, and a community feed, all driven by local component state in `PromptLabScreen.tsx`.

## Tech Stack

| Technology | Used for |
|---|---|
| [Expo](https://expo.dev) (~57) | App runtime, bundling, and dev tooling |
| [React Native](https://reactnative.dev) 0.86 + [React](https://react.dev) 19 | Core UI framework |
| [TypeScript](https://www.typescriptlang.org) | Static typing across components and screens |
| [NativeWind](https://www.nativewind.dev) 4 + [Tailwind CSS](https://tailwindcss.com) | Utility-first styling in React Native (`tailwind.config.js`, `global.css`) |
| React state (`useState`) | App state — no external state library; state lives in `PromptLabScreen.tsx` and is passed down via props |
| [react-native-reanimated](https://docs.swmansion.com/react-native-reanimated/) / `react-native-worklets` | Animation runtime backing gesture/animation-heavy screens |
| [react-native-svg](https://github.com/software-mansion/react-native-svg) | Vector icon rendering (required by `lucide-react-native`) |
| [lucide-react-native](https://lucide.dev) | Icon set used throughout the UI |
| `expo-linear-gradient` | Gradient backgrounds |
| `expo-clipboard` | Copy-to-clipboard for the PC sync feature |
| `expo-status-bar` | Status bar styling |
| `react-native-safe-area-context` | Safe-area-aware layout |
| `react-native-web` + `react-dom` | Optional web target via Expo's Metro web bundler |

## Getting Started

```bash
# 1. Clone the repo
git clone https://github.com/Tonxetyz/CodePathAI-Mobile.git
cd CodePathAI-Mobile

# 2. Install dependencies
npm install

# 3. Start the Expo dev server
npx expo start
```

Then press `a` (Android), `i` (iOS), or `w` (web) in the Expo CLI, or scan the QR code with Expo Go on your phone.

> **Note:** `lucide-react-native` currently declares a peer dependency on React 18, even though this app runs on React 19 via Expo. `.npmrc` sets `legacy-peer-deps=true` so `npm install` doesn't fail on that check.

## Project Structure

```text
CodePathAI-Mobile/
├── App.tsx                              # App entry point, SafeAreaProvider, status bar
├── app.json                             # Expo app configuration (name, icon, scheme)
├── global.css                           # Tailwind directives for NativeWind
├── tailwind.config.js                   # NativeWind/Tailwind design tokens
├── metro.config.js                      # Metro bundler wired up for NativeWind
├── babel.config.js                      # Babel config for NativeWind
├── assets/                              # App icon and static image assets
└── components/
    ├── PromptLabScreen.tsx              # Main screen: tabs, gamification, navigation
    ├── types.ts                         # Shared types (Tab, LessonId, LessonResult, ...)
    ├── map/
    │   ├── WorldMap.tsx                 # Skill-tree map rendering lesson nodes
    │   └── mapData.ts                   # Lesson/module definitions for the map
    ├── lessons/
    │   ├── LessonModal.tsx              # Routes an active lesson id to its lesson screen
    │   ├── PromptBuilderLesson.tsx      # "Build a prompt" lesson type
    │   ├── PromptSlotBuilder.tsx        # Drag/pick prompt-slot building block
    │   ├── PromptDuelLesson.tsx         # "Which prompt is better" lesson type
    │   ├── CodeFixLesson.tsx            # "Spot the bug" code lesson type
    │   ├── BriefToPromptLesson.tsx      # "Turn a brief into a prompt" lesson type
    │   └── LessonChrome.tsx             # Shared lesson header/progress chrome
    ├── octo/
    │   ├── OctoMate.tsx                 # Animated mascot companion
    │   └── Confetti.tsx                 # Success celebration effect
    └── sync/
        └── PcSyncSheet.tsx              # QR/code sheet for syncing prompts to a PC terminal
```

---

## License

Released under the [MIT License](./LICENSE).
