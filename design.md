# DocSpot — Comprehensive Design System & Specification (`design.md`)

## 1. Executive Summary & Brand Architecture
**DocSpot** is a modern, iOS-first digital healthcare and telehealth appointment booking application. It simplifies doctor discovery, clinic navigation, calendar scheduling, payments, and asynchronous doctor-patient messaging.

- **Primary Persona:** Patients seeking prompt, friction-free access to specialized medical consultations (Dermatology, Cardiology, Neurology, Pediatrics, etc.).
- **Visual Personality:** Clinical yet warm, approachable, hyper-legible, trustworthy, and modern.
- **Form Factor:** Native iOS Mobile (`~390px × 844px` baseline, Dynamic Island / notch support, rounded corners `r = 44px-48px`, native bottom safe areas).

---

## 2. Color Palette & Token System

### 2.1 Core Brand Colors
| Token Name | Hex Code | Purpose & Semantic Role |
| :--- | :--- | :--- |
| `primary` | `#10B981` | Brand primary (Emerald / Mint Green). Primary actions, active date pills, online status indicators, confirmed states. |
| `primary-hover` | `#059669` | Pressed/active interactive states for emerald elements. |
| `primary-light` | `#ECFDF5` | Soft green tint for badges, active filter tag backgrounds, and subtle highlights. |
| `brand-dark` | `#1E232A` | Primary CTA buttons ("Search", "Confirm Payment", "Book Appointment"), dark floating bottom tab bar. |
| `brand-dark-pressed` | `#0F172A` | Deep charcoal/slate pressed state for dark buttons. |

### 2.2 Functional & Semantic Colors
| Token Name | Hex Code | Purpose & Semantic Role |
| :--- | :--- | :--- |
| `accent-gold` | `#F59E0B` | Rating badges, "Top" doctor badge pill, star rating icons. |
| `accent-gold-bg` | `#FEF3C7` | Soft amber badge background. |
| `badge-red` | `#EF4444` | Unread notifications badge count (e.g. unread message badge count `2`). |
| `chat-bubble-user` | `#10B981` | Sent message bubbles (white text over emerald). |
| `chat-bubble-peer` | `#FFFFFF` | Received message bubbles with soft neutral border/shadow. |
| `category-purple` | `#8B5CF6` | Neurology & specialty icon background tints. |
| `category-coral` | `#F43F5E` | Cardiology & cardiology icon highlights. |
| `category-blue` | `#3B82F6` | Pulmonology, clinic pins & map geolocation marker dots. |
| `category-teal` | `#14B8A6` | Dental & general prevention service tags. |

### 2.3 Neutral & Surface Hierarchy
| Token Name | Hex Code | Purpose & Semantic Role |
| :--- | :--- | :--- |
| `surface-canvas` | `#F6F8FA` | Global screen background (subtle warm light gray/slate). |
| `surface-card` | `#FFFFFF` | Primary card surfaces, modal sheets, list containers, search bars. |
| `surface-muted` | `#F1F5F9` | Inactive segmented controls, slot pills, disabled or unselected date chips. |
| `border-subtle` | `#E2E8F0` | Delicate 1px structural dividers, card outlines, chat input borders. |
| `text-primary` | `#0F172A` | Primary headings, doctor titles, key metrics, pricing. |
| `text-secondary` | `#64748B` | Subheadings, doctor specialties, hospital locations, timestamps. |
| `text-tertiary` | `#94A3B8` | Input placeholders, inactive tab icons, secondary metadata. |

---

## 3. Typography Hierarchy
System Typography: **SF Pro Display / SF Pro Text** (fallback: **Inter**, `-apple-system`, `system-ui`).

| Hierarchy Level | Font Size | Line Height | Weight | Letter Spacing | Context Usage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Display / H1** | 24px (1.5rem) | 32px | Bold (700) | -0.02em | Greeting ("Hello, Amanda"), Modal Titles ("Booking confirmed"). |
| **H2 / Screen Title** | 20px (1.25rem)| 26px | SemiBold (600) | -0.01em | Navigation Titles ("Review & Pay", "Messages", "What doctor?"). |
| **Section Header** | 16px (1.0rem) | 22px | SemiBold (600) | -0.005em | "Upcoming appointments", "Reason for visit", "Payment method". |
| **Doctor Name / Card Title** | 16px (1.0rem) | 22px | SemiBold (600) | 0.0em | "Mary Andersen", "Adam Hendroin". |
| **Body / Readout** | 14px (0.875rem)| 20px | Regular (400) / Med (500) | 0.0em | Message copy, clinical address, service descriptions. |
| **Metadata / Microcopy** | 12px (0.75rem)| 16px | Medium (500) | +0.01em | Timestamps, slot counts ("6 slots"), review counts, sub-labels. |
| **Button Label** | 15px (0.9375rem)| 20px | SemiBold (600) | 0.0em | "Search", "Book Appointment", "Confirm Payment", "Next". |

---

## 4. Spacing, Elevation & Geometry

### 4.1 Corner Radii
- **Pill / Fully Rounded (`rounded-full`):** 9999px — Applied to buttons, search pills, filter chips ("Nearby", "Today", "Online"), calendar date chips, bottom dock bar.
- **Card Large (`rounded-3xl`):** 24px–28px — Applied to primary bottom sheets, doctor profile cards, appointment highlight card.
- **Card Medium (`rounded-2xl`):** 16px–20px — Applied to service list items, category grid cells, message list items.
- **Inner Element (`rounded-xl`):** 12px — Applied to time slot chips, icon backdrop squares.

### 4.2 Shadows & Elevation
- **Card Shadow (Soft Float):** `box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.05), 0 2px 6px -1px rgba(15, 23, 42, 0.02);`
- **Bottom Navigation Dock:** `box-shadow: 0 10px 30px -4px rgba(15, 23, 42, 0.25);`
- **Modal Sheet Elevation:** `box-shadow: 0 -12px 40px 0 rgba(15, 23, 42, 0.08);`

### 4.3 Spacing Grid
- Base unit: **4px / 8px scale**
- Card Padding: `16px` to `20px`
- Screen Horizontal Gutter: `16px` (or `20px` for spacious headers)
- Stack Item Gap: `12px` between list rows, `16px` between content blocks, `24px` between major sections.

---

## 5. Key Layout Patterns & Component Architecture

### 5.1 Global App Shell & Navigation
- **Floating Pill Bottom Navigation Dock:**
  - Dark container (`#1E232A`), height `64px`, rounded `9999px`, with 4 core destinations:
    1. **Home** (`LucideHome`)
    2. **Appointments / Calendar** (`LucideCalendar`)
    3. **Messages** (`LucideMessageSquare` / `LucideMessageCircle`)
    4. **Settings / Profile** (`LucideSettings`)
  - Active tab rendered inside a white or high-contrast pill capsule with textual label and icon.
- **iOS Status Bar:**
  - Standard `9:41` time, signal bars, WiFi, and battery icon with support for Dynamic Island cutout.

### 5.2 Discovery & Search Screen Flow (Screens 1 & 4)
- **Top Header:** User avatar, greeting ("Hello, Amanda"), location selector pill with downward chevron ("Paris, France").
- **Search Bar:** Full-width pill input with leading magnifying glass icon and trailing filter toggle button.
- **Specialty Category Grid:** 2×3 or 2×4 rounded white tiles with soft tinted 3D/flat specialty icons (Dental, Cardiology, Neurology, Nephrology, Pulmonology, More).
- **Appointment Highlight Card:** Two-tone layout (e.g. green date card block "Monday 21 Jan" paired with doctor card and quick route map thumbnail).
- **Map View & Geolocation Markers:** Interactive map showing clinic pins with doctor profile photos and gold rating chips (`★ 4.8`, `★ 5.0`).
- **Doctor Preview Card:** Bottom sheet containing doctor photo, name, specialty, distance ("0.3 km from you"), pricing, and rating.

### 5.3 Doctor Profile & Detail View (Screen 4 right)
- **Hero Profile Header:** Centered large circular avatar with verified "Top" badge.
- **Key Metric Trio Pills:**
  - Patients count (e.g. "2k Patients")
  - Experience (e.g. "7 years Experience")
  - Rate/Pricing (e.g. "€25/h Price Range")
- **Review Summary:** Rating star with score and review count ("4.8 (1,2k reviews)").
- **Hospital Affiliation:** Mercy Hospital, spoken languages tag list ("Speaks French, English, Spanish").
- **Tabbed Sub-navigation:** "Services", "Reviews", "Education", "Rewards" horizontal tab row with green active indicator bar.
- **Expandable Service Rows:** Rounded items with icon, title, subtitle, and right disclosure chevron (`›`).
- **Sticky Footer Action:** Fixed "Book Appointment" primary button with quick message bubble button.

### 5.4 Scheduling & Booking Flow (Screen 3)
- **Month Picker & Date Strip:** Horizontal calendar strip showing Day of Week, Day Number, and available slots count badge. Selected day highlighted in solid green pill (`#10B981`).
- **Time Slot Matrix:** Categorized by time of day:
  - *Morning* (e.g., `11:00 - 11:30`, `12:00 - 12:30`)
  - *Day / Afternoon* (e.g., `13:30 - 14:30`, `15:00 - 15:30`, `15:30 - 16:00` selected)
  - *Evening* (e.g., `17:30`)
- **Review & Pay Screen:**
  - Doctor summary card with "Top" badge.
  - Date & Time card with inline "Change" link.
  - Location address card.
  - Freeform "Reason for visit" text input ("Describe your symptoms and complaints").
  - Payment method card displaying saved card icon (Mastercard) and masked number (`4556`).
- **Confirmation Modal / Sheet:**
  - Success icon: Green circle with white checkmark.
  - Title: "Booking confirmed".
  - Secondary confirmation copy.
  - Direct integration action: "Add To Calendar" pill.
  - Appointment recap row and primary "View Details" button.

### 5.5 Telehealth & Direct Chat Flow (Screen 2)
- **Inbox / Message List:**
  - Segmented control pills: "All", "General", "Support".
  - Chat list rows with doctor avatar, name, last message snippet, timestamp, and unread notification badge.
- **Active Consultation Thread:**
  - Top bar with back chevron, doctor avatar, active status indicator ("Online now"), and more options `...`.
  - Photo attachment card (e.g. patient sharing clinical photo of skin issue).
  - Patient chat bubbles: Green background (`#10B981`), white text, bottom-right alignment, delivery checkmarks.
  - Doctor chat bubbles: White background, dark text, avatar positioned alongside first bubble.
  - Voice memo player card: Waveform scrubber, play button, duration counter (`00:00 / 00:32`), and timestamp.
  - Chat input bar: Rounded pill container with attachment icon (`image`), voice recording icon (`mic`), and "Send a message..." placeholder.

---

## 6. Accessibility & Motion Principles
1. **WCAG Contrast Compliance:**
   - Dark button (`#1E232A`) and green buttons (`#10B981`) maintain high contrast (> 4.5:1) with white text.
   - Text secondary (`#64748B`) against white containers maintains 4.6:1 contrast for small text legibility.
2. **Hit Targets:**
   - All interactive pills, calendar slots, and buttons possess a minimum touch target of `44px × 44px`.
3. **Motion Guidance:**
   - Sheet presentations: Smooth iOS spring animation (`cubic-bezier(0.32, 0.72, 0, 1)`).
   - Date selection transitions: Subtle 200ms scale bounce on active selection.
