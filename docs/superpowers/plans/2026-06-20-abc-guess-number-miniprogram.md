# ABC Guess Number Mini Program Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a native WeChat Mini Program puzzle game named `ABC猜数字`.

**Architecture:** Use a single page state machine for home, setup, play, success, answer reveal, and history views. Keep password generation, validation, and A/B/C scoring in `utils/game.js` so it can be tested independently from the Mini Program page.

**Tech Stack:** WeChat Mini Program native WXML/WXSS/JS, CommonJS utility module, Node.js `assert` smoke tests for game rules.

---

### Task 1: Scaffold Mini Program

**Files:**
- Create: `project.config.json`
- Create: `app.json`
- Create: `app.js`
- Create: `app.wxss`
- Create: `pages/index/index.json`

- [x] **Step 1: Add native Mini Program config**

Create a one-page app using `pages/index/index` as the entry page.

- [x] **Step 2: Add global app shell**

Create a minimal `App({})` and shared page background styles.

### Task 2: Game Rules

**Files:**
- Create: `utils/game.js`
- Create: `tests/game.test.js`

- [x] **Step 1: Implement password validation**

Accept exactly four digits, allow leading zero, and reject repeated digits with `数据不能重复，请重新输入`.

- [x] **Step 2: Implement password generation**

Generate four unique digits with no first-digit restriction.

- [x] **Step 3: Implement expanded result scoring**

Return strings like `ABBC`, `CCCC`, or `AAAA`, with all `A` characters first, then `B`, then `C`.

- [x] **Step 4: Add Node smoke tests**

Cover leading zero validation, duplicate rejection, A/B/C scoring, and generated uniqueness.

### Task 3: Page State And Interactions

**Files:**
- Create: `pages/index/index.js`
- Create: `pages/index/index.wxml`

- [x] **Step 1: Implement home actions**

Home shows `开始游戏`, `双人模式`, and `历史记录`.

- [x] **Step 2: Implement single-player mode**

Starting single-player generates a password and opens the guessing view.

- [x] **Step 3: Implement two-player setup**

Player one enters a valid hidden password before player two guesses.

- [x] **Step 4: Implement play controls**

Guessing view includes submit, `退出`, and `公布答案`; reveal records `未猜出`.

- [x] **Step 5: Implement history table**

Persist records in local storage with `日期`, `模式`, and `猜测次数`.

### Task 4: Visual Design

**Files:**
- Create: `pages/index/index.wxss`

- [x] **Step 1: Style game screens**

Use a polished compact game-console aesthetic, clear hierarchy, and touch-friendly buttons.

- [x] **Step 2: Style history table**

Make the three required columns readable on mobile screens.

### Task 5: Verification

**Files:**
- Read: `tests/game.test.js`

- [x] **Step 1: Run rule tests**

Run `node tests/game.test.js`; expected output is `game tests passed`.

- [x] **Step 2: Check workspace status**

Run `git status --short` and confirm only intended files were created.
