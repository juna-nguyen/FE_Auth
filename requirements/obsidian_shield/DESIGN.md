---
name: Obsidian Shield
colors:
  surface: '#0b1326'
  surface-dim: '#0b1326'
  surface-bright: '#31394d'
  surface-container-lowest: '#060e20'
  surface-container-low: '#131b2e'
  surface-container: '#171f33'
  surface-container-high: '#222a3d'
  surface-container-highest: '#2d3449'
  on-surface: '#dae2fd'
  on-surface-variant: '#c7c4d7'
  inverse-surface: '#dae2fd'
  inverse-on-surface: '#283044'
  outline: '#908fa0'
  outline-variant: '#464554'
  surface-tint: '#c0c1ff'
  primary: '#c0c1ff'
  on-primary: '#1000a9'
  primary-container: '#8083ff'
  on-primary-container: '#0d0096'
  inverse-primary: '#494bd6'
  secondary: '#d0bcff'
  on-secondary: '#3c0091'
  secondary-container: '#571bc1'
  on-secondary-container: '#c4abff'
  tertiary: '#4edea3'
  on-tertiary: '#003824'
  tertiary-container: '#00885d'
  on-tertiary-container: '#000703'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e1e0ff'
  primary-fixed-dim: '#c0c1ff'
  on-primary-fixed: '#07006c'
  on-primary-fixed-variant: '#2f2ebe'
  secondary-fixed: '#e9ddff'
  secondary-fixed-dim: '#d0bcff'
  on-secondary-fixed: '#23005c'
  on-secondary-fixed-variant: '#5516be'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#0b1326'
  on-background: '#dae2fd'
  surface-variant: '#2d3449'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.015em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.04em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.02em
  code-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 18px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 0.75rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

The design system establishes a high-performance, security-focused environment for identity management and Role-Based Access Control (RBAC). The aesthetic merges deep dark-mode minimalism with architectural glassmorphism, delivering an environment of absolute control, crisp reliability, and technical precision.

Targeted at security engineers, platform administrators, and technical leadership, the interface evokes confidence, uncompromised integrity, and operational focus. Visual clutter is stripped away in favor of layered slate panels, razor-thin luminous borders, and purposeful accent hues that communicate privilege tiers and system state instantly.

Interactions are immediate, subtle, and tactile: fine 1px structural outlines light up under interaction, translucent slate backdrops create layered depth without heavy shadows, and typography is engineered for high data-density and rapid visual scanning.

## Colors

The system uses a dark foundation rooted in slate values to prioritize legibility during continuous monitoring:

- **Foundation (Neutrals)**: Canvas sits at `#0F172A` (Slate 900), transitioning to `#0B0F19` for canvas backing and `#1E293B` (Slate 800) for base structural cards. Subtle internal borders use `#334155` (Slate 700), while subdued borders rest at `#1E293B`. Text ranges from `#F8FAFC` (Slate 50) for primary titles to `#94A3B8` (Slate 400) for secondary metadata.
- **Brand & Primary**: Indigo (`#6366F1`) and deep indigo (`#4F46E5`) drive high-intent actions, selected states, and active session paths.
- **RBAC & Hierarchy Tiering**:
  - **Admin / Superuser**: Royal Violet (`#8B5CF6`) and amethyst accents (`#A855F7`), accompanied by soft purple glow highlights.
  - **Standard User / Verified Status**: Emerald (`#10B981`) and mint highlights (`#34D399`), signifying active sessions, safe nodes, and permissions.
  - **Elevated / Auditor / Warning**: Amber (`#F59E0B`) for token expiration and elevated temporary bypasses.
  - **Danger / Revocation / Failure**: Rose (`#F43F5E`) for policy conflicts, brute-force alerts, and identity revocation.

## Typography

The typography pairs **Plus Jakarta Sans** for structural headlines with **Inter** for core functional interfaces.

- **Plus Jakarta Sans** delivers geometry and modern authority to authentication modals, tier summaries, and high-level metric views.
- **Inter** provides neutral clarity across audit streams, granular matrix grids, policy conditions, and dense table views.
- **JetBrains Mono** is embedded for cryptographic keys, hash digests, bearer tokens, IP CIDR ranges, and policy JSON payloads.

Labels and uppercase badges (`label-md`, `label-sm`) utilize slight positive tracking for crisp decipherability against dark surfaces.

## Layout & Spacing

The system runs on a strict 8-point baseline layout with a 12-column adaptive fluid grid for desktop and console workspaces.

- **Desktop (1024px and up)**: 12-column layout, 24px (`gutter`) column separation, 32px (`margin`) outer screen margin. Navigational consoles lock to a persistent 260px sidebar with the main content area scaling dynamically.
- **Tablet (768px - 1023px)**: 8-column layout, 16px gutter, collapsible navigation drawer.
- **Mobile (< 768px)**: 4-column layout, 12px (`gutter-mobile`), 16px (`margin-mobile`). Multi-column access matrices collapse into vertical accordion blocks.

Component padding enforces structured hierarchy:
- Inputs, list items, and compact role badges adhere to `space-xs` and `space-sm` increments.
- Glass panels and interactive identity cards rely on `space-lg` to prevent visual collision.

## Elevation & Depth

Visual hierarchy relies on translucent surface planes, frosted glass, and boundary lighting rather than muddy drop shadows.

- **Surface 0 (Base Canvas)**: Deep slate matte (`#0B0F19`), devoid of elevation.
- **Surface 1 (Card & Module Glass)**: `rgba(30, 41, 59, 0.70)` with a 12px backdrop blur (`backdrop-filter: blur(12px)`) and a 1px solid stroke of `#334155` or `rgba(255, 255, 255, 0.08)`.
- **Surface 2 (Flyouts, Dropdowns, Hovered Panels)**: `rgba(30, 41, 59, 0.90)` backed by an inner 1px directional hairline (`rgba(255, 255, 255, 0.12)` on top, fading to transparent on the bottom) to simulate top-down ambient light.
- **Surface 3 (Overlays & Auth Modals)**: `rgba(15, 23, 42, 0.85)` with a 24px blur and a subtle Indigo or Violet tinted border (`rgba(99, 102, 241, 0.25)`).
- **Glow Accents**: Focused items receive a diffuse radial feather (`0 0 24px -4px rgba(99, 102, 241, 0.2)` for primary, `0 0 24px -4px rgba(139, 92, 246, 0.25)` for admin tier components).

## Shapes

The design system uses a calibrated rounded geometry (Level 2) that softens mechanical structures without looking childlike:

- **Inputs, Buttons, and Micro Badges**: 8px (`0.5rem`) corner radius for sharp, dependable interaction targets.
- **Containers, Glass Panels, and Modals**: 16px (`1rem` / `rounded-lg`) corner radius, maintaining structural integrity across both compact cards and full-width RBAC tables.
- **Sheets and Drawers**: 24px (`1.5rem` / `rounded-xl`) on entry borders.
- **Status Pills and Identity Avatars**: Complete pill (`9999px`) styling to contrast with rectangular structural data grids.

## Components

### Buttons
- **Primary**: Background `#6366F1`, hover `#4F46E5`, active `#4338CA`. Text `#FFFFFF` with medium weight. Subtle top border highlight of `rgba(255, 255, 255, 0.2)`. Focus ring: 2px offset with `#6366F1`.
- **Secondary (Glass)**: Background `rgba(30, 41, 59, 0.6)`, border 1px solid `#334155`, text `#F8FAFC`. Hover brings background to `rgba(51, 65, 85, 0.8)` and border to `#64748B`.
- **Admin Action**: Background `linear-gradient(135deg, #8B5CF6, #6D28D9)`, border 1px solid `rgba(168, 85, 247, 0.4)`, text `#FFFFFF`.
- **Destructive**: Background `rgba(244, 63, 94, 0.1)`, border 1px solid `rgba(244, 63, 94, 0.3)`, text `#F43F5E`. Hover transitions to solid `#F43F5E` with `#FFFFFF` text.

### Chips & RBAC Badges
- **Admin Tier**: Royal Violet fill `rgba(139, 92, 246, 0.15)`, text `#C084FC`, border 1px solid `rgba(168, 85, 247, 0.35)`. Prefixed with a crown or geometric node icon.
- **User / Verified**: Emerald fill `rgba(16, 185, 129, 0.12)`, text `#34D399`, border 1px solid `rgba(16, 185, 129, 0.3)`.
- **Revoked / Suspended**: Rose fill `rgba(244, 63, 94, 0.12)`, text `#FB7185`, border 1px solid `rgba(244, 63, 94, 0.3)`.

### Input Fields & Authentication Forms
- **Resting**: Background `rgba(15, 23, 42, 0.6)`, 1px border `#334155`, text `#F8FAFC`, placeholder `#64748B`.
- **Active / Focused**: Border shifts to `#6366F1`, backed by an outer glow of `0 0 0 3px rgba(99, 102, 241, 0.2)`.
- **MFA / OTP Boxes**: 48x56px monospaced boxes with centered Plus Jakarta Sans typography, featuring instant transition to Indigo highlights on keypress.

### Selection Controls (Checkboxes & Radios)
- **Checkboxes**: 18x18px, 4px border radius. Unselected: `#1E293B` with `#475569` border. Selected: `#6366F1` with an inner white checkmark.
- **Permission Matrix Switches**: 36x20px pill toggle. Inactive track `#334155`, active track `#6366F1`. Admin-level master permission toggles use `#8B5CF6`.

### Cards & Glass Panels
- Base containers use `rgba(30, 41, 59, 0.5)` with `backdrop-filter: blur(16px)` and 1px `#1E293B` outlines.
- Hoverable session cards transition their border from `#1E293B` to `#334155`, accompanied by a 1px upward lift (`translateY(-1px)`).

### Access Matrix Grids (Domain Component)
- Distinct two-dimensional grid layouts showing roles against permission scopes (Read, Write, Delete, Grant).
- Intersecting cells utilize binary icon toggles that glow in Emerald for granted standard privileges and Violet for escalated administrative grants.