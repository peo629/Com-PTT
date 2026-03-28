# CoM-PTT — City of Melbourne Push-to-Talk Application

## Development Prompt Package v1.0.0

**Target Model:** Claude Opus 4.6
**Platform:** React Native (Expo SDK 55 / React Native 0.83 / React 19.2)
**Build System:** EAS Build + EAS Workflows CI/CD
**Last Updated:** 2026-03-28

-----

## TABLE OF CONTENTS

1. [System Prompt](#1-system-prompt)
1. [Project Identity & Scope](#2-project-identity--scope)
1. [Architecture & Technology Stack](#3-architecture--technology-stack)
1. [Application Features Specification](#4-application-features-specification)
1. [Component Architecture](#5-component-architecture)
1. [Navigation & Route Structure](#6-navigation--route-structure)
1. [State Management Architecture](#7-state-management-architecture)
1. [Real-Time Communication Layer](#8-real-time-communication-layer)
1. [Map & Location Services](#9-map--location-services)
1. [PTT Voice Engine](#10-ptt-voice-engine)
1. [SOS / Code 1 Emergency System](#11-sos--code-1-emergency-system)
1. [Code 2 — Network Roster](#12-code-2--network-roster)
1. [Live Location Request Protocol](#13-live-location-request-protocol)
1. [UI/UX Specification](#14-uiux-specification)
1. [Security & Permissions](#15-security--permissions)
1. [EAS Build & Deployment Configuration](#16-eas-build--deployment-configuration)
1. [CI/CD Workflows](#17-cicd-workflows)
1. [Testing Strategy](#18-testing-strategy)
1. [File & Folder Structure](#19-file--folder-structure)
1. [Session Handoff Protocol](#20-session-handoff-protocol)
1. [Code Quality Rules](#21-code-quality-rules)
1. [Skill-Gated Development & Verification Protocol](#22-skill-gated-development--verification-protocol)

-----

## 1. SYSTEM PROMPT

Paste the block below verbatim into the system prompt field (or as the first message in a new conversation) before beginning any development work.

> **Design note:** This prompt uses direct constraints and quality standards rather than
> role-play framing. Research into LLM output quality indicates that persona-based prompts
> (“You are a senior engineer…”) can reduce the model’s internal self-checking — the model
> prioritises performing the character over validating its own output. Constraint-based
> prompts produce more rigorous, self-verified code.
> 
> This prompt also integrates a **skill-gated development protocol** — domain-specific
> reference documents are loaded autonomously before code is written (preventing errors at
> the source) and a **production-code-quality verification gate** runs silently before every
> delivery (catching anything that slipped through). Skills are cached on first load per
> session to avoid context window saturation.

```text
PROJECT CONTEXT
CoM-PTT is a production Push-to-Talk application for City of Melbourne (CoM) parking 
enforcement officers. All code produced in this conversation is for this project.

PLATFORM & SDK REQUIREMENTS
All code must target the following versions exactly. Do not use deprecated or removed APIs.
  - Expo SDK 55 / React Native 0.83 / React 19.2
  - New Architecture ONLY (Legacy Architecture was removed in SDK 55)
  - Hermes engine (default runtime)
  - Expo Router for all navigation (file-based routing under src/app/)
  - EAS Build for all native builds; EAS Workflows for CI/CD
  - Architecture reference: https://docs.expo.dev/tutorial/create-your-first-app/
  - All code must be deployable via EAS Build for Android APK generation and iOS archive

CODE OUTPUT STANDARDS
Every file produced must meet ALL of the following criteria before it is presented:
  1. Production-ready — no stubs, no TODOs, no placeholder values, no incomplete logic.
  2. Correctly typed TypeScript with strict mode — zero use of `any` or `@ts-ignore`.
  3. Immediately runnable inside the project without modification.
  4. Self-verified — before presenting code, re-read it and confirm:
     (a) all imports resolve to real modules in the dependency list,
     (b) all referenced types/interfaces exist,
     (c) all async operations have error handling,
     (d) no breaking changes to existing files unless explicitly approved.

MANDATORY API CHOICES (use ONLY these)
  - `process.env.EXPO_OS` — NOT `Platform.OS`
  - `expo-image` — NOT the intrinsic `<Image>` component
  - `expo-audio` — NOT `expo-av` (deprecated)
  - `react-native-safe-area-context` — NOT React Native's built-in SafeAreaView
  - `useWindowDimensions` — NOT `Dimensions.get()`
  - Scrollable root content MUST use `<ScrollView contentInsetAdjustmentBehavior="automatic" />`

STYLE & STRUCTURE RULES
  - Inline styles (JavaScript objects) by default. StyleSheet.create is permitted ONLY when 
    styles are reused across 3+ components.
  - No Tailwind CSS, no CSS files.
  - Filenames: kebab-case (e.g., patrol-map.tsx, ptt-button.tsx).
  - NEVER co-locate components, types, hooks, or utilities inside the app/ directory.
  - tsconfig.json path aliases configured; prefer aliases over deep relative imports.
  - All colour values referenced from src/constants/colors.ts — no inline hex in components.

PRESERVATION & CHANGE CONTROL
  - NEVER introduce breaking changes to existing files without presenting the change and 
    receiving explicit written approval.
  - When modifying existing files, preserve ALL existing functionality, styling, and 
    configuration unless the modification specifically requires a change.
  - When modifying, list every file affected upfront with a one-line summary before presenting code.

RESPONSE FORMAT
  - Lead every response with the deliverable (code, config, file).
  - Explain decisions briefly AFTER the code block, not before.
  - If a task is ambiguous, state assumptions and proceed — do not stall for clarification 
    on trivial details.
  - When errors or limitations are encountered, state them plainly with proposed solutions.

SKILL-GATED DEVELOPMENT PROTOCOL
Before writing code for any task domain, autonomously load the relevant skill file(s) using
the `view` tool. This is not optional — the skill must be read BEFORE the first line of code
is written for that domain. The full domain-to-skill mapping is defined in Section 22 of the
prompt package.

Caching rules:
  - READ ONCE PER SESSION: When a skill is loaded for the first time in a conversation,
    its guidance applies for the remainder of the session. Do not re-read the same skill
    file for subsequent tasks in the same domain.
  - TRACK LOADED SKILLS: Maintain an internal list of which skills have been loaded this
    session. Before loading a skill, check whether it has already been loaded.
  - MULTI-SKILL TASKS: Some tasks require multiple skills (e.g., creating a component that
    will be deployed requires both building-native-ui AND expo-deployment on first encounter
    of each). Load each independently on first encounter.
  - MINIMAL LOADING: Only load skills relevant to the current task. Do not preload all
    skills at session start — this wastes context.

Skill categories:
  (a) DEVELOPMENT SKILLS — loaded before writing code for a domain:
      building-native-ui, expo-deployment, expo-cicd-workflows, expo-dev-client,
      expo-api-routes, native-data-fetching, upgrading-expo
  (b) VERIFICATION SKILL — loaded once at session start, applied before every code delivery:
      production-code-quality

PRE-DELIVERY VERIFICATION GATE
Before presenting ANY code output, execute the following verification pass. This gate
applies to every file, every response, with no exceptions.

  Step 1 — INVENTORY: List all functions, components, exports, and integration points in the
           file being produced or modified.
  Step 2 — COMPATIBILITY CHECK: Confirm the output is compatible with:
           (a) the project's dependency versions (SDK 55 / RN 0.83 / React 19.2),
           (b) all existing files that import from or are imported by the affected file,
           (c) the mandatory API choices listed above.
  Step 3 — BREAKING CHANGE SCAN: Compare the output against the original file (if modifying).
           If ANY export signature, prop interface, or behavioural contract has changed:
           → STOP. Present the change. Request explicit approval. Do not deliver.
  Step 4 — FUNCTIONALITY PRESERVATION: Confirm every feature present in the original file
           remains in the modified output. Missing features block delivery.
  Step 5 — SELF-ASSESSMENT: Re-read the complete output and verify:
           (a) all imports resolve, (b) all types exist, (c) async has error handling,
           (d) no dead code, (e) no console.log, (f) JSDoc on all exports,
           (g) colours use constants not inline hex.

  If any step fails, fix the issue and re-run the gate before presenting.
  Do NOT narrate the gate execution to the user unless a blocker is found. The gate
  runs silently — the user sees only verified output.
```

-----

## 2. PROJECT IDENTITY & SCOPE

|Field                     |Value                                                                                                            |
|--------------------------|-----------------------------------------------------------------------------------------------------------------|
|**Project Name**          |CoM-PTT                                                                                                          |
|**Slug**                  |`com-ptt`                                                                                                        |
|**Bundle ID (iOS)**       |`au.gov.melbourne.comptt`                                                                                        |
|**Package Name (Android)**|`au.gov.melbourne.comptt`                                                                                        |
|**Owner (Expo)**          |*(set to your Expo account or org)*                                                                              |
|**Purpose**               |Real-time push-to-talk voice, live location tracking, and emergency alerting for CoM parking enforcement officers|
|**Target Users**          |Patrol officers, dispatch operators, field supervisors                                                           |
|**Platforms**             |Android (primary — CoM-issued devices), iOS (secondary)                                                          |

### User Roles

|Role          |Capabilities                                                                                               |
|--------------|-----------------------------------------------------------------------------------------------------------|
|**Officer**   |PTT send/receive, SOS activation, location sharing (approval required), Code 2 visibility                  |
|**Dispatch**  |PTT to all / to one, live location requests to any officer, Code 1 resolution authority, Code 2 roster view|
|**Supervisor**|All Dispatch capabilities + live location requests officer-to-officer oversight                            |

-----

## 3. ARCHITECTURE & TECHNOLOGY STACK

### Core Dependencies

```
expo@^55.0.0                    # Expo SDK 55
react-native@0.83.x             # React Native (New Architecture only)
react@19.2.x                    # React 19.2
expo-router@^5.x                # File-based routing (src/app/)
expo-location@^18.x             # GPS + heading
expo-audio@^1.x                 # Audio recording & playback (NOT expo-av)
expo-image@^3.x                 # Optimised image component
expo-haptics@^14.x              # Haptic feedback (iOS)
expo-notifications@^1.x         # Push notifications (SOS alerts)
expo-secure-store@^14.x         # Credential storage
expo-task-manager@^12.x         # Background location tasks
expo-keep-awake@^14.x           # Prevent screen lock during patrol
react-native-maps@^1.x          # Google Maps / Apple Maps
react-native-gesture-handler@^2 # Drag gestures (PTT button)
react-native-reanimated@^3      # Animations (PTT pulse, SOS flash)
@react-native-community/netinfo # Network state detection
```

### Backend Services (External — not built in this prompt)

The app communicates with a backend that provides:

|Service    |Protocol                         |Purpose                                                            |
|-----------|---------------------------------|-------------------------------------------------------------------|
|Auth       |REST / JWT                       |Officer sign-in, role assignment                                   |
|Signalling |WebSocket (Socket.IO or plain WS)|PTT channel management, SOS propagation, location request handshake|
|Voice Relay|WebRTC or UDP relay server       |Half-duplex audio streaming                                        |
|Presence   |WebSocket                        |Code 2 online roster, heartbeat                                    |
|Location   |WebSocket                        |Live location pin broadcast (approved shares)                      |


> **Instruction to Claude:** When building components that depend on backend APIs, create a typed service layer under `src/services/` with clearly defined interfaces. Use mock implementations during development that can be swapped for real endpoints. Every service file must export both the interface and the mock.

-----

## 4. APPLICATION FEATURES SPECIFICATION

### 4.1 — Live Map View

**Description:** Full-screen interactive map displaying the officer’s real-time position with a directional heading indicator.

**Requirements:**

- Map occupies the full viewport behind all overlays.
- User’s position shown as a **directional arrowhead marker** (not a circle dot) — the arrowhead rotates to match the device’s compass heading, indicating direction of travel.
- Map auto-centres on the user by default; a re-centre FAB appears when the user manually pans away.
- Approved live-location pins from other officers render as distinct markers (different colour, labelled with callsign).
- SOS pins render as pulsing red markers with highest z-index.
- Map provider: Google Maps on Android, Apple Maps on iOS (configurable).

### 4.2 — Push-to-Talk Button (PTT)

**Description:** A floating, draggable overlay button for initiating and receiving voice transmissions.

**Idle State:**

- Light grey (#D1D5DB), 60% opacity.
- Circular, 72dp diameter.
- Freely draggable to any screen edge; snaps to nearest edge on release.
- Subtle shadow to distinguish from map.

**Active Transmitting State:**

- Solid green (#16A34A), 100% opacity.
- Press-and-hold to transmit; release to stop.
- Pulsing ring animation while transmitting.
- Haptic feedback on press (iOS).

**Active Receiving State:**

- Solid green (#16A34A), 100% opacity.
- Speaker icon overlay while receiving.
- Callsign of transmitting officer displayed in a toast/chip above the button.

**Behaviour:**

- Half-duplex: only one officer transmits at a time per channel.
- If the channel is busy, pressing PTT queues the officer or shows a “channel busy” indicator.

### 4.3 — PTT Communication Modes

|Mode               |Initiator|Target        |Description                                                               |
|-------------------|---------|--------------|--------------------------------------------------------------------------|
|**1:1 Officer**    |Officer  |Officer       |Private inter-officer voice call. Selected from contacts or Code 2 roster.|
|**Dispatch → Many**|Dispatch |All officers  |Broadcast voice to all signed-on officers simultaneously.                 |
|**Dispatch → 1**   |Dispatch |Single officer|Private voice from dispatch to a specific officer.                        |
|**1 → Many**       |Officer  |All officers  |Officer responds to a callout; all officers hear.                         |
|**1 → Dispatch**   |Officer  |Dispatch only |Private voice response from officer to dispatch.                          |

**Channel Selection:** A minimal channel-picker UI in the bottom drawer or a quick-select gesture (e.g., swipe up on PTT for channel list).

### 4.4 — SOS / Man Down / Code 1

**Activation Methods:**

1. **Hardware trigger:** Press the device power button **three times in rapid succession** (< 2 seconds total).
1. **Software trigger:** Tap the **SOS banner button** in the bottom slide-up drawer.

**On Activation (Sounding Officer’s Device):**

1. Immediately begin transmitting a 15-second priority audio window — **all other transmissions on the sounding officer’s network are blocked for 15 seconds**.
1. Send an SOS event via WebSocket to every user in the sounding officer’s **federated network contact list**.
1. Device enters SOS mode: screen displays a full-width flashing red/white banner with “CODE 1 ACTIVE” and the officer’s callsign.

**On All Receiving Devices:**

1. A **flashing visual banner** appears at the top of the screen — red/white alternating at 500ms intervals.
1. An **audible alarm tone** sounds immediately:
- Overrides device volume (plays at max volume).
- Overrides Do Not Disturb / silent mode.
- Alarm continues until the receiving officer **presses the banner notification**.
1. When the banner is pressed:
- The alarm silences on that device.
- A **pin is dropped on the receiver’s map** at the sounding officer’s **live GPS coordinates**.
- The pin updates in real-time (live location) until Code 1 is resolved.

**Resolution:**

- Only **Dispatch** or **Supervisor** can resolve a Code 1.
- Resolution broadcasts a “Code 1 Cleared” event; all SOS pins and banners are removed network-wide.
- The sounding officer’s device exits SOS mode.

### 4.5 — Live Location Request

**Request Flow:**

|Requester |Target |Permitted?|
|----------|-------|----------|
|Dispatch  |Officer|✅ Yes     |
|Supervisor|Officer|✅ Yes     |
|Officer   |Officer|✅ Yes     |

**Protocol:**

1. Requester selects target officer from the Code 2 roster or contacts.
1. Requester taps “Request Location.”
1. Target officer receives a **modal prompt** with three options:
- **Approve** — shares live location.
- **Standby** — defers; requester sees “Standby” status. Target can approve or decline later.
- **Decline** — no location shared; requester is notified.
1. If **Approved:**
- A live location marker of the target officer is placed on the **requester’s map only** (not network-wide).
- Marker is visible for **5 minutes** then **self-deletes** automatically.
- A countdown timer is shown to the requester.

### 4.6 — Code 2 — Network Roster

**Description:** Displayed within the bottom slide-up drawer. Shows all officers currently signed in on their device (network presence — NOT location based).

**Requirements:**

- List updates in real-time via WebSocket presence channel.
- Each entry shows: callsign, role badge (Officer / Dispatch / Supervisor), online duration, signal strength indicator.
- Tapping an entry opens a context menu: PTT 1:1, Request Location, View Profile.
- Officers appear when they sign in; disappear when they sign out or lose connection for > 30 seconds (grace period).
- Search/filter bar at top of roster.

-----

## 5. COMPONENT ARCHITECTURE

All components live under `src/components/`. Use kebab-case filenames. One component per file.

```
src/components/
├── map/
│   ├── patrol-map.tsx              # Main map wrapper (react-native-maps)
│   ├── officer-marker.tsx          # Directional arrowhead for current user
│   ├── peer-location-marker.tsx    # Approved live-location pins (other officers)
│   ├── sos-marker.tsx              # Pulsing red SOS pin
│   └── re-centre-fab.tsx           # "Return to my location" floating button
├── ptt/
│   ├── ptt-button.tsx              # Draggable PTT overlay
│   ├── ptt-pulse-ring.tsx          # Animated ring during transmit
│   ├── channel-picker.tsx          # Channel/mode selector
│   └── transmission-toast.tsx      # Incoming callsign display
├── sos/
│   ├── sos-banner.tsx              # Flashing CODE 1 banner (receiver)
│   ├── sos-trigger-button.tsx      # SOS activation in drawer
│   ├── sos-active-overlay.tsx      # Full-screen SOS mode (sender)
│   └── sos-alarm-controller.tsx    # Audio alarm logic (max vol, override DND)
├── drawer/
│   ├── bottom-drawer.tsx           # Slide-up drawer shell
│   ├── code2-roster.tsx            # Online officers list
│   ├── roster-entry.tsx            # Single officer row
│   └── roster-search.tsx           # Filter/search bar
├── location/
│   ├── location-request-modal.tsx  # Approve / Standby / Decline prompt
│   ├── location-request-sender.tsx # Outbound request UI
│   └── location-countdown.tsx      # 5-min auto-delete timer display
├── auth/
│   ├── auth-gate.tsx               # Auth state wrapper
│   ├── sign-in-screen.tsx          # Login form
│   └── role-badge.tsx              # Officer / Dispatch / Supervisor chip
└── ui/
    ├── icon-button.tsx             # Reusable icon button
    ├── status-chip.tsx             # Generic status indicator
    └── loading-spinner.tsx         # Activity indicator
```

-----

## 6. NAVIGATION & ROUTE STRUCTURE

Using Expo Router with the `src/app/` directory (SDK 55 default template convention).

```
src/app/
├── _layout.tsx                     # Root layout — auth gate, providers, global overlays
├── (auth)/
│   ├── _layout.tsx                 # Stack for auth screens
│   └── sign-in.tsx                 # Sign-in screen
├── (main)/
│   ├── _layout.tsx                 # Main layout — map + overlays (no tabs needed)
│   ├── index.tsx                   # Patrol map screen (default route)
│   ├── channel-select.tsx          # Channel picker (presented as formSheet)
│   └── officer-profile.tsx         # Officer detail (presented as modal)
├── (drawer)/
│   ├── _layout.tsx                 # Drawer-specific stack
│   ├── code2-roster.tsx            # Code 2 online roster (formSheet detent 0.6)
│   └── sos-panel.tsx               # SOS trigger + status (formSheet detent 0.4)
└── location-request.tsx            # Location request modal (presentation: "modal")
```

**Root Layout (`src/app/_layout.tsx`) responsibilities:**

1. Wrap in `<AuthGate>` — redirect unauthenticated users to `(auth)/sign-in`.
1. Provide global context providers: `<WebSocketProvider>`, `<PTTProvider>`, `<LocationProvider>`, `<SOSProvider>`, `<PresenceProvider>`.
1. Render the PTT button overlay at the root level (above all screens).
1. Render the SOS banner overlay at the root level (above PTT button).

-----

## 7. STATE MANAGEMENT ARCHITECTURE

Use React Context + `useReducer` for each domain. No external state library required for this scope.

```
src/providers/
├── auth-provider.tsx         # JWT, user role, callsign
├── websocket-provider.tsx    # Single WS connection, reconnection logic
├── ptt-provider.tsx          # Channel state, transmit/receive status, queue
├── location-provider.tsx     # Own GPS, heading, approved peer locations
├── sos-provider.tsx          # SOS active state, sounding officer, resolution
└── presence-provider.tsx     # Code 2 roster data, online/offline events
```

```
src/hooks/
├── use-location-tracking.ts  # expo-location foreground + background subscription
├── use-heading.ts            # Compass heading for arrowhead rotation
├── use-ptt-audio.ts          # expo-audio record/playback for PTT
├── use-sos-alarm.ts          # Alarm audio, volume override, DND bypass
├── use-power-button.ts       # Triple-press detection (Android KeyEvent listener)
├── use-draggable.ts          # Gesture handler for PTT button drag + edge snap
└── use-countdown-timer.ts    # Generic countdown (used for location 5-min expiry)
```

```
src/services/
├── auth-service.ts           # Login, token refresh
├── signalling-service.ts     # WebSocket event emitter/listener abstraction
├── voice-service.ts          # WebRTC / audio relay setup
├── presence-service.ts       # Heartbeat, roster sync
├── location-service.ts       # Location request send/respond, live pin broadcast
├── sos-service.ts            # SOS event emission, network block, resolution
└── types.ts                  # Shared TypeScript interfaces for all services
```

-----

## 8. REAL-TIME COMMUNICATION LAYER

### WebSocket Events Schema

Define all events as a discriminated union in `src/services/types.ts`.

```typescript
// Outbound (client → server)
type ClientEvent =
  | { type: 'ptt:start'; channel: ChannelId; }
  | { type: 'ptt:stop'; channel: ChannelId; }
  | { type: 'ptt:audio'; channel: ChannelId; data: ArrayBuffer; }
  | { type: 'sos:activate'; location: GeoCoord; }
  | { type: 'sos:resolve'; sosId: string; }
  | { type: 'location:request'; targetOfficerId: string; }
  | { type: 'location:respond'; requestId: string; response: 'approve' | 'standby' | 'decline'; }
  | { type: 'location:update'; coord: GeoCoord; }  // live pin broadcast while approved
  | { type: 'presence:heartbeat'; }
  | { type: 'presence:sign-in'; callsign: string; role: UserRole; }
  | { type: 'presence:sign-out'; };

// Inbound (server → client)
type ServerEvent =
  | { type: 'ptt:channel-busy'; channel: ChannelId; speaker: string; }
  | { type: 'ptt:channel-free'; channel: ChannelId; }
  | { type: 'ptt:audio'; channel: ChannelId; speaker: string; data: ArrayBuffer; }
  | { type: 'sos:alert'; sosId: string; officerCallsign: string; location: GeoCoord; }
  | { type: 'sos:location-update'; sosId: string; location: GeoCoord; }
  | { type: 'sos:resolved'; sosId: string; resolvedBy: string; }
  | { type: 'location:incoming-request'; requestId: string; requesterCallsign: string; requesterRole: UserRole; }
  | { type: 'location:request-response'; requestId: string; response: 'approve' | 'standby' | 'decline'; }
  | { type: 'location:peer-update'; officerId: string; coord: GeoCoord; expiresAt: string; }
  | { type: 'presence:roster-sync'; roster: RosterEntry[]; }
  | { type: 'presence:officer-online'; entry: RosterEntry; }
  | { type: 'presence:officer-offline'; officerId: string; };
```

-----

## 9. MAP & LOCATION SERVICES

### Foreground Location

```typescript
// src/hooks/use-location-tracking.ts
import * as Location from 'expo-location';

// Request: Location.requestForegroundPermissionsAsync()
// Watch:   Location.watchPositionAsync({ accuracy: Location.Accuracy.BestForNavigation, distanceInterval: 2 })
// Heading: Location.watchHeadingAsync() — feeds arrowhead rotation
```

### Background Location (SOS & active patrol)

```typescript
// src/hooks/use-location-tracking.ts (background segment)
import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';

const BACKGROUND_LOCATION_TASK = 'com-ptt-background-location';

TaskManager.defineTask(BACKGROUND_LOCATION_TASK, ({ data, error }) => {
  // Forward location updates to SOS service when Code 1 is active
});

// Request: Location.requestBackgroundPermissionsAsync()
// Start:   Location.startLocationUpdatesAsync(BACKGROUND_LOCATION_TASK, { accuracy: Location.Accuracy.High, distanceInterval: 5 })
```

### Officer Marker (Directional Arrowhead)

The `<OfficerMarker>` component renders a custom SVG arrowhead rotated by the current compass heading. Use `react-native-maps` `<Marker>` with a custom child view containing an SVG arrow, rotated via `transform: [{ rotate: '${heading}deg' }]`.

-----

## 10. PTT VOICE ENGINE

### Audio Pipeline

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐     ┌──────────────┐
│ expo-audio   │────▶│ Opus encoder │────▶│ WebSocket/WebRTC│────▶│ Relay Server │
│ Recording    │     │ (JS or native│     │ binary frames   │     │              │
│              │     │  codec)      │     │                 │     │              │
└─────────────┘     └──────────────┘     └─────────────────┘     └──────────────┘

┌──────────────┐     ┌──────────────┐     ┌─────────────────┐
│ Relay Server │────▶│ Opus decoder │────▶│ expo-audio       │
│              │     │              │     │ Playback         │
└──────────────┘     └──────────────┘     └─────────────────┘
```

**Key decisions:**

- Use `expo-audio` for recording and playback (NOT expo-av which is deprecated).
- Audio format: Opus codec at 16kHz mono for low-bandwidth, low-latency voice.
- Chunk size: 20ms frames streamed over WebSocket as binary messages.
- Half-duplex enforcement: client-side state machine prevents simultaneous record + play on the same channel.

-----

## 11. SOS / CODE 1 EMERGENCY SYSTEM

### Triple Power-Button Detection (Android)

```typescript
// src/hooks/use-power-button.ts
// Android only — listen for ACTION_SCREEN_OFF events via a native module or
// expo-screen-orientation / DeviceEventEmitter.
// Track timestamps of consecutive power-button presses.
// If 3 presses occur within 2000ms → trigger SOS.
// On iOS, use the software trigger only (hardware interception not permitted).
```

### SOS Alarm Audio (Receiver)

```typescript
// src/hooks/use-sos-alarm.ts
// 1. Load alarm audio asset at app startup.
// 2. On SOS event:
//    a. Set audio mode: expo-audio playsInSilentMode = true, interruptionMode = 'duckOthers'
//    b. Set volume to maximum programmatically.
//    c. Play alarm in loop.
//    d. On banner press → stop alarm, drop pin.
// 3. DND override: use expo-notifications with a high-priority channel (Android)
//    that bypasses DND ("alarm" category with IMPORTANCE_MAX).
```

### SOS State Machine

```
                  ┌──────────┐
                  │  IDLE    │
                  └────┬─────┘
                       │ triple-press or SOS button
                       ▼
                  ┌──────────┐
        ┌─────── │ ACTIVE   │ ──────────────────┐
        │         └────┬─────┘                    │
        │              │ 15s priority window       │
   (sounding)          ▼                    (all receivers)
        │         ┌──────────┐              ┌──────────┐
        │         │TRANSMIT  │              │ ALERTING │
        │         │BLOCKED   │              │ (alarm + │
        │         │(network) │              │  banner) │
        │         └────┬─────┘              └────┬─────┘
        │              │ 15s expires              │ banner pressed
        │              ▼                          ▼
        │         ┌──────────┐              ┌──────────┐
        │         │ LIVE     │              │ TRACKING │
        │         │ TRACKING │              │ (pin on  │
        │         │ (sender) │              │  map)    │
        │         └────┬─────┘              └────┬─────┘
        │              │                          │
        └──────────────┴──────┬───────────────────┘
                              │ Dispatch/Supervisor resolves
                              ▼
                         ┌──────────┐
                         │ RESOLVED │
                         └──────────┘
```

-----

## 12. CODE 2 — NETWORK ROSTER

### Presence Heartbeat

- Client sends `presence:heartbeat` every 10 seconds.
- Server marks officer offline after 30 seconds without heartbeat (grace period for network blips).
- On sign-in, server broadcasts `presence:officer-online` to all connected clients.
- On sign-out or timeout, server broadcasts `presence:officer-offline`.

### Roster Entry Interface

```typescript
interface RosterEntry {
  officerId: string;
  callsign: string;
  role: 'officer' | 'dispatch' | 'supervisor';
  onlineSince: string;        // ISO 8601
  signalStrength: 'strong' | 'moderate' | 'weak';
  isInSOS: boolean;           // Code 1 active flag
}
```

-----

## 13. LIVE LOCATION REQUEST PROTOCOL

### Request Lifecycle

```
Requester                        Server                         Target Officer
    │                               │                                │
    │── location:request ──────────▶│                                │
    │                               │── location:incoming-request ──▶│
    │                               │                                │
    │                               │◀── location:respond ───────────│
    │◀── location:request-response ─│         (approve/standby/decline)
    │                               │                                │
    │   [if approved]               │                                │
    │                               │◀── location:update ────────────│ (every 3s for 5 min)
    │◀── location:peer-update ──────│                                │
    │         (live pin)            │                                │
    │                               │                                │
    │   [5 min expires]             │                                │
    │   (pin auto-removed)          │   (server stops forwarding)    │  (target stops sending)
```

### Auto-Expiry

- The `location:peer-update` event includes an `expiresAt` ISO timestamp.
- Client-side `useCountdownTimer` hook removes the marker when the timer reaches zero.
- Server-side also enforces the 5-minute window — stops forwarding updates after expiry.

-----

## 14. UI/UX SPECIFICATION

### Colour Palette

|Token               |Hex      |Usage                          |
|--------------------|---------|-------------------------------|
|`--bg-primary`      |`#1A1A2E`|Map overlay backgrounds, drawer|
|`--bg-surface`      |`#16213E`|Cards, roster entries          |
|`--text-primary`    |`#EAEAEA`|Primary text                   |
|`--text-secondary`  |`#A0A0B0`|Secondary / muted text         |
|`--accent-green`    |`#16A34A`|PTT active, online status      |
|`--accent-red`      |`#DC2626`|SOS, offline, alerts           |
|`--accent-amber`    |`#F59E0B`|Standby, warnings              |
|`--ptt-idle`        |`#D1D5DB`|PTT button idle                |
|`--ptt-idle-opacity`|`0.6`    |PTT button idle opacity        |
|`--sos-flash-a`     |`#DC2626`|SOS banner colour A            |
|`--sos-flash-b`     |`#FFFFFF`|SOS banner colour B            |

### PTT Button Specifications

|Property           |Value                                             |
|-------------------|--------------------------------------------------|
|Shape              |Circle                                            |
|Diameter           |72dp                                              |
|Idle colour        |`#D1D5DB` at 60% opacity                          |
|Active colour      |`#16A34A` at 100% opacity                         |
|Icon (idle)        |Microphone outline                                |
|Icon (transmitting)|Microphone filled + pulse ring                    |
|Icon (receiving)   |Speaker filled                                    |
|Drag behaviour     |Free drag; snaps to nearest screen edge on release|
|Z-index            |Above map, below SOS banner                       |

### SOS Banner Specifications

|Property   |Value                                                               |
|-----------|--------------------------------------------------------------------|
|Position   |Top of screen, full width                                           |
|Height     |64dp                                                                |
|Animation  |Alternating red/white background at 500ms                           |
|Text       |“⚠ CODE 1 — {callsign}” in bold white (on red) / bold red (on white)|
|Z-index    |Highest — above all other UI elements                               |
|Interaction|Tap to silence alarm + drop pin                                     |

### Bottom Drawer

|Property    |Value                                       |
|------------|--------------------------------------------|
|Presentation|`formSheet` with `sheetGrabberVisible: true`|
|Detents     |`[0.15, 0.5, 0.85]` — peek, half, full      |
|Peek content|SOS trigger button + channel indicator      |
|Half content|Code 2 roster (scrollable)                  |
|Full content|Roster + SOS panel + settings               |

-----

## 15. SECURITY & PERMISSIONS

### Required Permissions

```json
// app.json plugins and permissions
{
  "expo": {
    "plugins": [
      ["expo-location", {
        "locationAlwaysAndWhenInUsePermission": "CoM-PTT needs your location to show your position on the patrol map and to share your location during emergencies.",
        "isAndroidBackgroundLocationEnabled": true
      }],
      ["expo-audio", {
        "microphonePermission": "CoM-PTT needs microphone access for push-to-talk voice communication."
      }],
      ["expo-notifications", {
        "sounds": ["./assets/sounds/sos-alarm.wav"]
      }]
    ],
    "android": {
      "permissions": [
        "ACCESS_FINE_LOCATION",
        "ACCESS_BACKGROUND_LOCATION",
        "RECORD_AUDIO",
        "FOREGROUND_SERVICE",
        "FOREGROUND_SERVICE_LOCATION",
        "VIBRATE",
        "WAKE_LOCK",
        "RECEIVE_BOOT_COMPLETED"
      ]
    },
    "ios": {
      "infoPlist": {
        "NSLocationAlwaysAndWhenInUseUsageDescription": "CoM-PTT needs your location for patrol tracking and emergency response.",
        "NSLocationWhenInUseUsageDescription": "CoM-PTT needs your location to show your position on the map.",
        "NSMicrophoneUsageDescription": "CoM-PTT needs microphone access for push-to-talk.",
        "UIBackgroundModes": ["location", "audio", "remote-notification"]
      }
    }
  }
}
```

### Authentication

- JWT-based auth stored in `expo-secure-store`.
- Domain restriction: `@melbournecity.gov.au` or `@gov.au` email addresses only.
- Token refresh on 401 response; redirect to sign-in on refresh failure.

-----

## 16. EAS BUILD & DEPLOYMENT CONFIGURATION

### eas.json

```json
{
  "cli": {
    "version": ">= 16.0.1",
    "appVersionSource": "remote"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      },
      "env": {
        "API_BASE_URL": "https://dev-api.comptt.melbourne.vic.gov.au",
        "WS_URL": "wss://dev-ws.comptt.melbourne.vic.gov.au"
      }
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      },
      "env": {
        "API_BASE_URL": "https://staging-api.comptt.melbourne.vic.gov.au",
        "WS_URL": "wss://staging-ws.comptt.melbourne.vic.gov.au"
      }
    },
    "production": {
      "autoIncrement": true,
      "android": {
        "buildType": "app-bundle"
      },
      "ios": {
        "resourceClass": "m-medium"
      },
      "env": {
        "API_BASE_URL": "https://api.comptt.melbourne.vic.gov.au",
        "WS_URL": "wss://ws.comptt.melbourne.vic.gov.au"
      }
    }
  },
  "submit": {
    "production": {
      "android": {
        "serviceAccountKeyPath": "./google-service-account.json",
        "track": "internal"
      }
    }
  }
}
```

### app.json Key Fields

```json
{
  "expo": {
    "name": "CoM-PTT",
    "slug": "com-ptt",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "comptt",
    "newArchEnabled": true,
    "userInterfaceStyle": "dark",
    "splash": {
      "image": "./assets/images/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#1A1A2E"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/adaptive-icon.png",
        "backgroundColor": "#1A1A2E"
      },
      "package": "au.gov.melbourne.comptt",
      "config": {
        "googleMaps": {
          "apiKey": "GOOGLE_MAPS_API_KEY"
        }
      }
    },
    "ios": {
      "bundleIdentifier": "au.gov.melbourne.comptt",
      "supportsTablet": false
    },
    "web": {
      "bundler": "metro"
    }
  }
}
```

-----

## 17. CI/CD WORKFLOWS

### `.eas/workflows/development.yml`

```yaml
name: Development Build

on:
  push:
    branches: [develop]

jobs:
  build-android-dev:
    type: build
    params:
      platform: android
      profile: development

  build-ios-dev:
    type: build
    params:
      platform: ios
      profile: development
```

### `.eas/workflows/preview.yml`

```yaml
name: Preview Build

on:
  push:
    branches: [staging]

jobs:
  build-android-preview:
    type: build
    params:
      platform: android
      profile: preview

  build-ios-preview:
    type: build
    params:
      platform: ios
      profile: preview
```

### `.eas/workflows/production.yml`

```yaml
name: Production Release

on:
  push:
    branches: [main]

jobs:
  build-android-prod:
    type: build
    params:
      platform: android
      profile: production

  submit-android:
    type: submit
    needs: [build-android-prod]
    params:
      platform: android
      profile: production

  build-ios-prod:
    type: build
    params:
      platform: ios
      profile: production
```

-----

## 18. TESTING STRATEGY

|Layer       |Tool                                  |Scope                                        |
|------------|--------------------------------------|---------------------------------------------|
|Unit        |Jest + React Native Testing Library   |Hooks, services, utility functions           |
|Component   |Jest + RNTL                           |Individual component rendering, interactions |
|Integration |Detox (or Maestro)                    |Full user flows: sign-in → PTT → SOS         |
|E2E (manual)|EAS Preview builds on physical devices|Radio performance, GPS accuracy, alarm volume|

### Critical Test Scenarios

1. **PTT latency** — measure time from button press to audio arriving on receiver.
1. **SOS alarm override** — verify alarm plays on device set to Do Not Disturb at zero volume.
1. **Triple power-button detection** — verify 3 presses within 2s triggers SOS; 2 presses does not.
1. **Location pin expiry** — verify pin disappears after exactly 5 minutes.
1. **Network reconnection** — verify WebSocket reconnects and roster re-syncs after network drop.
1. **Half-duplex enforcement** — verify two officers cannot transmit simultaneously on the same channel.
1. **SOS network block** — verify all non-SOS transmissions are blocked for 15 seconds on SOS activation.

-----

## 19. FILE & FOLDER STRUCTURE

```
com-ptt/
├── .eas/
│   └── workflows/
│       ├── development.yml
│       ├── preview.yml
│       └── production.yml
├── assets/
│   ├── images/
│   │   ├── icon.png
│   │   ├── adaptive-icon.png
│   │   └── splash.png
│   └── sounds/
│       └── sos-alarm.wav
├── src/
│   ├── app/                        # Expo Router routes (file-based)
│   │   ├── _layout.tsx
│   │   ├── (auth)/
│   │   │   ├── _layout.tsx
│   │   │   └── sign-in.tsx
│   │   ├── (main)/
│   │   │   ├── _layout.tsx
│   │   │   ├── index.tsx
│   │   │   ├── channel-select.tsx
│   │   │   └── officer-profile.tsx
│   │   ├── (drawer)/
│   │   │   ├── _layout.tsx
│   │   │   ├── code2-roster.tsx
│   │   │   └── sos-panel.tsx
│   │   └── location-request.tsx
│   ├── components/                 # Reusable UI components
│   │   ├── map/
│   │   ├── ptt/
│   │   ├── sos/
│   │   ├── drawer/
│   │   ├── location/
│   │   ├── auth/
│   │   └── ui/
│   ├── providers/                  # React Context providers
│   │   ├── auth-provider.tsx
│   │   ├── websocket-provider.tsx
│   │   ├── ptt-provider.tsx
│   │   ├── location-provider.tsx
│   │   ├── sos-provider.tsx
│   │   └── presence-provider.tsx
│   ├── hooks/                      # Custom hooks
│   │   ├── use-location-tracking.ts
│   │   ├── use-heading.ts
│   │   ├── use-ptt-audio.ts
│   │   ├── use-sos-alarm.ts
│   │   ├── use-power-button.ts
│   │   ├── use-draggable.ts
│   │   └── use-countdown-timer.ts
│   ├── services/                   # API / WebSocket service layer
│   │   ├── auth-service.ts
│   │   ├── signalling-service.ts
│   │   ├── voice-service.ts
│   │   ├── presence-service.ts
│   │   ├── location-service.ts
│   │   ├── sos-service.ts
│   │   └── types.ts
│   ├── constants/
│   │   ├── colors.ts               # Colour palette tokens
│   │   ├── config.ts               # API URLs, timeouts, thresholds
│   │   └── channels.ts             # PTT channel definitions
│   └── utils/
│       ├── format-duration.ts
│       ├── geo-utils.ts
│       └── audio-utils.ts
├── app.json
├── eas.json
├── tsconfig.json
├── package.json
└── README.md
```

-----

## 20. SESSION HANDOFF PROTOCOL

When ending a development session, Claude must produce a session handoff document containing:

```markdown
# CoM-PTT Session Handoff — [DATE]

## Completed This Session
- [List every file created or modified with a one-line summary]

## Current Build State
- Expo readiness: [score or status]
- Last successful build profile: [development/preview/production]
- Known build errors: [list or "none"]

## Outstanding Items
- [Prioritised list of next tasks]

## Blockers
- [Any issues requiring external resolution]

## Files Changed
| File | Action | Summary |
|------|--------|---------|
| `src/components/ptt/ptt-button.tsx` | Created | Draggable PTT overlay with idle/active states |
| ... | ... | ... |

## Next Session Start Command
[Exact prompt to paste to resume work]
```

-----

## 21. CODE QUALITY RULES

These rules are non-negotiable and apply to every file produced:

1. **TypeScript strict mode** — `"strict": true` in tsconfig.json. No `any` types. No `@ts-ignore`.
1. **Every exported function and component** has JSDoc comments.
1. **Every hook** returns a clearly typed object or tuple.
1. **Every service method** returns a typed Promise.
1. **Error handling** — all async operations wrapped in try/catch with typed error responses.
1. **No console.log in production code** — use a logging utility that can be disabled.
1. **Single Responsibility** — one component/hook/service per file.
1. **No dead code** — no commented-out blocks, no unused imports.
1. **Consistent naming:**
- Files: `kebab-case.tsx`
- Components: `PascalCase`
- Hooks: `useCamelCase`
- Services: `camelCase`
- Constants: `SCREAMING_SNAKE_CASE`
- Types/Interfaces: `PascalCase`
1. **All colours** referenced from `src/constants/colors.ts` — no inline hex values in components.

-----

## 22. SKILL-GATED DEVELOPMENT & VERIFICATION PROTOCOL

This section defines the autonomous skill-loading workflow and pre-delivery verification gate referenced in the system prompt. These are not suggestions — they are mandatory process steps.

### 22.1 — Skill Loading Rules

|Rule                   |Detail                                                                                                                           |
|-----------------------|---------------------------------------------------------------------------------------------------------------------------------|
|**Autonomous**         |Claude decides which skill(s) to load based on the task domain. The user does not need to instruct this.                         |
|**Pre-code**           |The relevant skill MUST be read BEFORE the first line of code is written for that domain.                                        |
|**Cache on first load**|Each skill is read once per conversation session. On subsequent tasks in the same domain, use the already-loaded knowledge.      |
|**Track loaded state** |Maintain an internal record of loaded skills. Before calling `view` on a skill, check if it has already been loaded this session.|
|**Minimal loading**    |Only load skills relevant to the current task. Never preload all skills at conversation start.                                   |
|**Multi-skill tasks**  |If a task spans multiple domains, load each relevant skill independently (on first encounter only).                              |

### 22.2 — Domain-to-Skill Mapping

The table below maps every development task domain to the skill file(s) that must be loaded before code production begins.

|Task Domain                                                                             |Skill File(s) to Load                                                                |When to Load                                                            |
|----------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------|------------------------------------------------------------------------|
|**Any UI component creation** (screens, overlays, buttons, markers, drawers)            |`/mnt/skills/user/building-native-ui/SKILL.md`                                       |First time a component is created or significantly modified this session|
|**Route/navigation structure** (_layout.tsx, screen files, tabs, stacks, modals, sheets)|`/mnt/skills/user/building-native-ui/SKILL.md` → then `references/route-structure.md`|First time routes are created or restructured                           |
|**Animations** (PTT pulse, SOS flash, marker transitions)                               |`/mnt/skills/user/building-native-ui/SKILL.md` → then `references/animations.md`     |First time animation code is written                                    |
|**Audio** (PTT recording, playback, SOS alarm)                                          |`/mnt/skills/user/building-native-ui/SKILL.md` → then `references/media.md`          |First time audio code is written                                        |
|**Data persistence** (secure store, SQLite, cached state)                               |`/mnt/skills/user/building-native-ui/SKILL.md` → then `references/storage.md`        |First time local storage code is written                                |
|**Network requests** (REST auth, WebSocket setup, API calls)                            |`/mnt/skills/user/native-data-fetching/SKILL.md`                                     |First time a service or data-fetching hook is written                   |
|**EAS Build configuration** (eas.json, build profiles, APK/AAB, credentials)            |`/mnt/skills/user/expo-deployment/SKILL.md`                                          |First time eas.json or build config is created/modified                 |
|**CI/CD workflow files** (.eas/workflows/*.yml)                                         |`/mnt/skills/user/expo-cicd-workflows/SKILL.md`                                      |First time a workflow YAML is created or modified                       |
|**Development client builds** (dev client, TestFlight, internal distribution)           |`/mnt/skills/user/expo-dev-client/SKILL.md`                                          |First time a dev build is configured                                    |
|**API routes** (server-side Expo Router endpoints)                                      |`/mnt/skills/user/expo-api-routes/SKILL.md`                                          |First time an API route is created                                      |
|**SDK version changes** (upgrading, dependency resolution)                              |`/mnt/skills/user/upgrading-expo/SKILL.md`                                           |If any SDK upgrade or dependency conflict is encountered                |
|**Code quality verification** (pre-delivery gate)                                       |`/mnt/skills/user/production-code-quality/SKILL.md`                                  |Once at session start — applies to ALL deliveries for the entire session|

### 22.3 — Pre-Delivery Verification Gate (Detailed)

This is the expanded specification of the verification gate defined in the system prompt. It runs silently before every code delivery.

```
┌─────────────────────────────────────────────────────────┐
│                    TASK RECEIVED                         │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│  PHASE 1: SKILL LOADING                                 │
│                                                         │
│  1. Identify task domain(s) from the mapping table      │
│  2. For each domain, check: has skill been loaded?      │
│     ├── YES → skip, use cached knowledge                │
│     └── NO  → call `view` on the skill file             │
│              → mark as loaded for this session           │
│  3. Also check: has production-code-quality been loaded? │
│     ├── YES → proceed                                   │
│     └── NO  → load it now (session-wide gate)           │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│  PHASE 2: CODE PRODUCTION                               │
│                                                         │
│  Write code informed by the loaded skill guidance.      │
│  Apply all system prompt constraints (API choices,      │
│  style rules, structure rules).                         │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│  PHASE 3: PRE-DELIVERY VERIFICATION                     │
│  (runs silently — user sees only the result)            │
│                                                         │
│  Step 1 — INVENTORY                                     │
│    List all exports, props, integration points.         │
│                                                         │
│  Step 2 — COMPATIBILITY                                 │
│    Confirm SDK 55 / RN 0.83 / React 19.2 compliance.   │
│    Confirm mandatory API choices used correctly.        │
│    Confirm imports resolve to real project modules.     │
│                                                         │
│  Step 3 — BREAKING CHANGE SCAN (modifications only)     │
│    Compare against original file.                       │
│    ├── No breaking changes → proceed                    │
│    └── Breaking change found → HALT, present to user,  │
│        request approval before continuing               │
│                                                         │
│  Step 4 — FUNCTIONALITY PRESERVATION (modifications)    │
│    Every original feature must still be present.        │
│    Missing feature → fix before delivery.               │
│                                                         │
│  Step 5 — SELF-ASSESSMENT CHECKLIST                     │
│    ☐ All imports resolve                                │
│    ☐ All types/interfaces exist                         │
│    ☐ Async operations have try/catch                    │
│    ☐ No dead code or unused imports                     │
│    ☐ No console.log                                     │
│    ☐ JSDoc on all exports                               │
│    ☐ Colours from constants, not inline hex             │
│    ☐ Filenames in kebab-case                            │
│    ☐ No co-located code in app/ directory               │
│                                                         │
│  ANY FAILURE → fix and re-run gate before delivery      │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│  PHASE 4: DELIVER TO USER                               │
│                                                         │
│  Present verified code. Explain decisions briefly       │
│  after the code block.                                  │
└─────────────────────────────────────────────────────────┘
```

### 22.4 — Context Budget Awareness

Skill files vary in size. To prevent context saturation:

|Concern                     |Mitigation                                                                                                                                                 |
|----------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------|
|**Large skill files**       |Read the SKILL.md root file first. Only read sub-references (e.g., `references/animations.md`) when that specific sub-topic is needed for the current task.|
|**Multiple skills per task**|Acceptable — but limit to the skills directly relevant. A component task needs `building-native-ui` but does NOT need `expo-cicd-workflows`.               |
|**Long sessions**           |If context is becoming constrained, summarise retained skill knowledge into key constraints rather than re-reading files.                                  |
|**Redundant loads**         |The caching rule prevents this. A skill loaded at message 3 still applies at message 30.                                                                   |

### 22.5 — Session Handoff Addendum

When producing a session handoff document (Section 20), include a **Skills Loaded** section:

```markdown
## Skills Loaded This Session
| Skill | Loaded At | Domain |
|-------|-----------|--------|
| production-code-quality | Message 1 | Verification gate |
| building-native-ui | Message 2 | PTT button component |
| native-data-fetching | Message 5 | WebSocket service layer |
```

This allows the next session to pre-load the same skills if continuing the same work stream, rather than discovering them incrementally.

-----

## USAGE INSTRUCTIONS

### Starting a New Session

Paste the **System Prompt** (Section 1) as your first message or into the system prompt field, then follow with:

```
I'm working on CoM-PTT. Here is the full prompt package:
[paste this entire document]

Let's begin with: [specific task, e.g., "scaffold the project and create the root layout with all providers"]
```

### Incremental Development

For subsequent sessions, paste the **System Prompt** (Section 1) plus the most recent **Session Handoff** document, then state the next task.

### Recommended Build Order

1. **Project scaffold** — `npx create-expo-app@latest com-ptt --template default@sdk-55`, install dependencies, configure `app.json`, `eas.json`, `tsconfig.json`.
1. **Route structure** — all `_layout.tsx` files and screen stubs.
1. **Auth flow** — `auth-provider.tsx`, `auth-gate.tsx`, sign-in screen.
1. **Map + location** — `patrol-map.tsx`, `officer-marker.tsx`, `use-location-tracking.ts`, `use-heading.ts`.
1. **PTT button** — `ptt-button.tsx`, `use-draggable.ts`, idle/active states.
1. **WebSocket layer** — `websocket-provider.tsx`, `signalling-service.ts`.
1. **PTT audio** — `use-ptt-audio.ts`, `voice-service.ts`, channel picker.
1. **SOS system** — `sos-provider.tsx`, `sos-banner.tsx`, `use-sos-alarm.ts`, `use-power-button.ts`.
1. **Code 2 roster** — `presence-provider.tsx`, `code2-roster.tsx`, bottom drawer.
1. **Location requests** — `location-service.ts`, `location-request-modal.tsx`, pin rendering + countdown.
1. **Polish** — animations, haptics, edge cases, error states.
1. **CI/CD** — EAS workflow files, first preview build.

-----

*End of Prompt Package — CoM-PTT v1.0.0*
