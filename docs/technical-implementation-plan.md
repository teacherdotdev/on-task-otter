# 🚀 Technical Implementation Plan

> **Hackathon Goal:** Build a polished classroom focus tool that helps teachers encourage productive work sessions through timers, classroom noise monitoring, and gamified rewards.

---

## 🛠 Tech Stack

* [ ] Vite
* [ ] React
* [ ] CSS (or CSS Modules)
* [ ] Browser Audio APIs
* [ ] localStorage

### Why?

The MVP intentionally avoids a backend to keep development lightweight and focused on delivering a complete classroom experience during the hackathon.

---

## 🎯 MVP Features

The hackathon version of On-task Otter will include:

* [ ] Focus session timer
* [ ] Session setup controls
* [ ] Classroom noise meter
* [ ] Classroom otter
* [ ] Points system
* [ ] Reward shop
* [ ] Session history
* [ ] Data persistence using localStorage

---

## 🏗 Project Structure

```text
src/

components/
    Header/
    Timer/
    SessionSetup/
    NoiseMeter/
    Otter/
    PointsDisplay/
    RewardShop/
    SessionCompleteModal/
    SessionHistory/

hooks/
    useTimer.js
    useMicrophone.js
    useLocalStorage.js

data/
    accessories.js

App.jsx
main.jsx
```

---

## 🖥 Application Architecture

The application will be a **single-page classroom dashboard**. Teachers should be able to open the app and immediately begin a focus session without navigating through multiple screens.

### Classroom Dashboard Layout

```text
----------------------------------

ON-TASK OTTER

----------------------------------

        15:00

      Classroom otter

       Points: 40

----------------------------------

      Noise Meter

----------------------------------

    Session Settings

----------------------------------

       Reward Shop

----------------------------------

     Session History

----------------------------------
```

---

## ⏱ Timer Component

### Responsibilities

* [ ] Start focus sessions
* [ ] Pause sessions
* [ ] Reset timers
* [ ] Track remaining time

### State

```javascript
timeRemaining
isRunning
sessionLength
```

### Suggested Session Lengths

* 5 minutes
* 10 minutes
* 15 minutes
* 20 minutes

---

## 🎓 Session Setup Component

Teachers can select:

### Session Length

* [ ] 5 minutes
* [ ] 10 minutes
* [ ] 15 minutes
* [ ] 20 minutes

### Classroom Activity Type

* [ ] Independent Work
* [ ] Partner Work
* [ ] Presentation

The selected activity type will determine acceptable classroom noise levels.

---

## 🔊 Noise Meter Component

The noise meter is one of the project's most engaging features.

### Responsibilities

* [ ] Access microphone input
* [ ] Measure classroom volume
* [ ] Display current noise levels
* [ ] Compare noise levels to classroom expectations

### Browser APIs

```javascript
navigator.mediaDevices.getUserMedia()
AudioContext
AnalyserNode
```

### Suggested Noise Thresholds

| Activity Type    | Expected Volume  |
| ---------------- | ---------------- |
| Independent Work | Very Quiet       |
| Partner Work     | Moderate         |
| Presentation     | Moderate to Loud |

### Visual Feedback

* 🟢 Green = On Track
* 🟡 Yellow = Getting Loud
* 🔴 Red = Too Loud

> Noise levels should be averaged over short intervals to prevent sudden spikes from affecting the display.

---

## 🐾 Classroom Otter Component

The classroom otter is the primary gamification mechanic.

### Responsibilities

* [ ] Display current accessories
* [ ] Celebrate completed focus sessions
* [ ] Encourage classroom participation

### MVP Assets

* 3 otter bodies
* 3 hats
* 3 accessories

Example:

```javascript
const otter = {
    hat: "party-hat",
    accessory: "glasses"
}
```

Accessories can be layered using simple image assets and CSS positioning.

---

## ⭐ Points System

Students earn classroom points for completing focus sessions.

### Suggested Formula

```javascript
points += sessionLength;
```

### Examples

| Session Length | Points Earned |
| -------------- | ------------- |
| 5 Minutes      | 5             |
| 10 Minutes     | 10            |
| 15 Minutes     | 15            |
| 20 Minutes     | 20            |

### Stored Data

* Total points earned
* Current point balance

---

## 🛍 Reward Shop Component

Teachers can spend classroom points to unlock cosmetic rewards.

### Example Items

```javascript
[
    {
        name: "Sunglasses",
        cost: 20
    },
    {
        name: "Party Hat",
        cost: 30
    },
    {
        name: "Bow Tie",
        cost: 50
    }
]
```

### Features

* [ ] Purchase rewards
* [ ] Equip accessories
* [ ] View unlocked items

---

## 📚 Session History Component

Session history allows teachers to track classroom progress.

### Stored Information

```javascript
[
    {
        date,
        sessionLength,
        pointsEarned
    }
]
```

### Displayed Information

* [ ] Total focus time
* [ ] Completed sessions
* [ ] Points earned
* [ ] Recent classroom activity

---

## 🪝 Custom Hooks

The project will use React's built-in hooks alongside a few custom hooks.

### Built-In Hooks

* `useState`
* `useEffect`

### Custom Hooks

```javascript
useTimer()
useMicrophone()
useLocalStorage()
```

No additional state management libraries are necessary for the MVP.

---

## 💾 Data Persistence

The following data will be stored using `localStorage`:

* [ ] Total points
* [ ] Unlocked accessories
* [ ] Equipped accessories
* [ ] Session history
* [ ] Teacher preferences

Using localStorage keeps the project lightweight and removes the need for authentication or a backend service.

---

## 🔄 User Flow

```text
Teacher opens app
        ↓
Selects session settings
        ↓
Starts focus timer
        ↓
Noise meter monitors classroom volume
        ↓
Students complete session
        ↓
Points are awarded
        ↓
Teacher unlocks classroom rewards
        ↓
Classroom otter gets new accessories
        ↓
Session is saved to history
```

---

## 📋 Development Roadmap

### Phase 1: React Setup

* [ ] Configure React with Vite
* [ ] Create project structure
* [ ] Build dashboard layout

---

### Phase 2: Focus Sessions

* [ ] Build timer component
* [ ] Build session setup component
* [ ] Implement session logic

---

### Phase 3: Gamification

* [ ] Build points system
* [ ] Create session completion modal
* [ ] Display earned rewards

---

### Phase 4: Classroom otter

* [ ] Build otter component
* [ ] Add cosmetic accessories
* [ ] Add initial environment - house
* [ ] Add equip functionality

---

### Phase 5: Reward Shop

* [ ] Create reward data
* [ ] Implement purchasing logic
* [ ] Display unlocked items
* [ ] House decor

---

### Phase 6: Data Persistence

* [ ] Implement localStorage hook
* [ ] Save user progress
* [ ] Restore saved state on page load

---

### Phase 7: Noise Meter

* [ ] Request microphone permissions
* [ ] Measure classroom volume
* [ ] Display visual feedback
* [ ] Configure activity-specific thresholds

---

### Phase 8: Polish

* [ ] Add animations
* [ ] Improve accessibility
* [ ] Improve responsive layout
* [ ] Add classroom-themed styling

---

## 🌱 Future Enhancements

Ideas for future versions of On-task Otter:

* Multiple classroom profiles
* Student avatars
* Classroom analytics dashboard
* Custom reward systems
* Shared classroom progress across devices
* Exportable classroom reports
* Accessibility improvements
* Expanded shop offerings - new locations

---

## 🎉 Hackathon Scope

The MVP goal is intentionally small and polished.

> Teachers can run a classroom focus session, monitor classroom noise levels, reward students with points, and customize a classroom otter that celebrates their progress.

By focusing on a single-page React application and leveraging browser APIs and localStorage, On-task Otter can deliver a complete and engaging classroom experience within the constraints of a hackathon timeline.
