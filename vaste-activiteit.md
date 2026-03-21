# Vaste Activiteit (Fixed Activity Planning)

## Page Purpose
"Vaste Activiteit" (Fixed Activity) is the planning mode when the activity is already decided. Users can see a calendar showing which dates work best for all participants, with an overlay system displaying individual friend availability. This mode focuses on "When should we do this?" for a specific activity.

## User Flow
1. User selects "Vaste Activiteit" mode from dashboard
2. Page displays the fixed activity name and location prominently
3. User sees participant avatars at the top
4. User views a calendar with availability heatmap
5. Calendar cells show which friends can attend each date
6. System highlights the perfect match date (all participants available)
7. User can see alternative dates with partial availability
8. User confirms the best date for the activity

## Key Components

### Top App Bar
- **Logo**: "WDW?" in mustard yellow
- **Navigation**: Discover, My Plans, Archive (desktop only)
- **Actions**: Notifications and account circle icons
- **Styling**: Semi-transparent background with backdrop blur

### Activity Header Section
- **Label**: "PLANNEN" (uppercase, small, primary color)
- **Activity Title**: Large heading "Midgetgolfen"
- **Location**: 
  - Location icon + "GlowGolf Centrum"
  - Secondary text styling
- **Participant Avatars**: 
  - Colored initials in small squares
  - Border with surface color
  - "+1" badge for additional participants
  - Arranged in a row

### Calendar Container

#### Calendar Header
- **Month/Year**: "Maart 2024"
- **Navigation Arrows**: Previous/Next month buttons
- **Styling**: Flex row with space-between

#### Calendar Grid
- **Structure**: 7 columns (Mon-Sun)
- **Day Labels**: MA, DI, WO, DO, VR, ZA, ZO (uppercase, small, tracking-tighter)
- **Cell Size**: Aspect square (equal width and height)
- **Gap**: 1-3px between cells

#### Calendar Cells - Availability Overlay System

**Empty Cells (Previous Month)**
- Opacity 30%
- Light background

**Regular Cells (No Availability)**
- White background
- Border: 1px outline-variant/20
- Date number in top-left

**Cells with Single Participant**
- Background: White
- Overlay bar: Participant color at 20% opacity
- Avatar cluster in top-right corner (scaled 75%)
- Shows which friend(s) can attend

**Cells with Multiple Participants**
- Background: White
- Multiple overlay bars stacked (one per participant)
- Avatar cluster in top-right (scaled 90%)
- Color intensity increases with more participants

**Perfect Match Cell (All Participants)**
- **Date**: 14 (Saturday)
- **Border**: 2px primary color
- **Background**: White with multiple overlay bars
- **Center Content**:
  - Star icon (filled, primary color)
  - "PERFECT!" text (uppercase, small, bold)
- **Avatar Cluster**: All participant avatars in top-right
- **Shadow**: md (medium shadow)
- **Ring Effect**: 2px ring with offset

#### Legend
- **Location**: Below calendar
- **Content**: Colored squares with participant names
- **Format**: Flex wrap with gap
- **Info Icon**: "Dagen kleuren intenser bij meer matches"

### Matches Section

#### Section Header
- **Icon**: Auto_awesome (filled)
- **Title**: "Beste Tijden" (Best Times)
- **Styling**: Bold, tracking-tight

#### Primary Match Card (Winning Date)
- **Background**: Primary color (mustard)
- **Border-Bottom**: 4px primary/20 opacity
- **Shadow**: lg with hover effect
- **Hover**: Translate up (-translate-y-1)
- **Content**:
  - Label: "ULTIEME MATCH" (uppercase, small, on-primary/70)
  - Date: "Zaterdag 14 maart" (large, bold)
  - Badge: "5/5 Aanwezig" (on-primary background)
  - Description: "De hele groep heeft deze dag groen licht gegeven..."
  - Button: "Nu Vastleggen" (on-primary text, primary background)

#### Secondary Match Card (Alternative)
- **Background**: White
- **Border**: 2px outline-variant/30
- **Hover**: Border changes to primary/50
- **Content**:
  - Label: "ALTERNATIEF" (uppercase, small, primary color)
  - Date: "Zaterdag 2 maart"
  - Badge: "4/5 Aanwezig" (surface-variant background)
  - Description: "Bijna iedereen kan, alleen de laatste persoon moet nog bevestigen."
  - Button: "Details bekijken" (primary border, primary text)

### Mobile Painter Tool (Mobile Only)
- **Position**: Fixed bottom-32
- **Background**: White with border
- **Content**:
  - Edit square icon
  - "Beschikbaarheid" label
  - Divider line
  - User avatar (primary color)
  - Block icon (unavailable)
- **Styling**: Rounded, shadow, z-40

### Bottom Navigation (Mobile)
- **Explore**: Explore icon
- **Calendar**: Calendar icon (active, primary background)
- **People**: Group icon
- **Settings**: Settings icon

## Design Notes

### Color Scheme
- **Primary**: #E1AD01 (Mustard Yellow)
- **Secondary**: #31302D (Dark Gray)
- **Tertiary**: #006A6A (Teal)
- **Background**: #FDFCF7 (Cream)
- **Surface**: #FDFCF7 (Off-white)
- **Text**: #211A00 (Dark)

### Layout
- **Desktop**: Max-width 7xl container
- **Mobile**: Full-width with padding
- **Padding**: 4-10 units depending on section
- **Spacing**: Generous gaps between sections

### Typography
- **Headings**: Bold, tracking-tight
- **Body**: Medium weight
- **Labels**: Small, uppercase, tracking-widest
- **Font**: Plus Jakarta Sans

### Calendar Styling
- **Border Radius**: 0.375rem (slightly rounded)
- **Cell Aspect**: Square (1:1 ratio)
- **Overlay Opacity**: 20-25% for participant colors
- **Avatar Size**: 4x4 (16px) in cells

### Interactive Elements
- **Buttons**: Scale on hover, active state
- **Cards**: Hover effects with shadow/border changes
- **Calendar Cells**: Hover states with border changes

## Features

### Availability Heatmap
- Visual representation of participant availability
- Color-coded by participant
- Intensity increases with more participants
- Easy to spot perfect match dates

### Overlay System
- Multiple participant colors stacked on single cell
- Avatar cluster shows exactly who can attend
- Mix-blend-mode for visual layering

### Smart Date Matching
- Highlights perfect match dates (all participants)
- Shows alternative dates with partial availability
- Displays participant count for each date

### Participant Tracking
- Avatar cluster at top shows all participants
- Color-coded avatars in calendar
- Legend explains color mapping
- "+1" badge for additional participants

### Action Cards
- Primary match card for best option
- Secondary match card for alternatives
- Clear call-to-action buttons
- Descriptive text for each option

## Related Pages
- **Dashboard** - Mode selection hub
- **We Zien Wel** - Flexible planning alternative
- **Vaste Datum** - Fixed date planning alternative
- **Kalender: Datum Selecteren** - Date selection interface

## HTML Reference
The page uses:
- Tailwind CSS grid system
- Material Symbols for icons
- Plus Jakarta Sans font
- Responsive breakpoints (md: 768px, lg: 1024px)
- Mix-blend-mode for overlay effects
- Aspect-square for calendar cells
- Flex layout for avatar clusters

## Accessibility Notes
- Clear heading hierarchy
- High contrast text on backgrounds
- Icon + text on buttons
- Sufficient touch target sizes (min 44x44px)
- Semantic HTML structure
- Color not sole indicator (uses patterns/text)
- Legend explains color coding

## Mobile Considerations
- Single-column layout
- Bottom navigation bar
- Painter tool for marking availability
- Touch-friendly calendar cells
- Readable text at all sizes
- Floating action button for editing

## Performance Notes
- Lazy load calendar data
- Cache participant availability
- Optimize avatar images
- Consider pagination for large groups

## Notes
- Calendar should update in real-time as participants mark availability
- Heatmap intensity should dynamically adjust
- Perfect match dates should trigger celebration animation
- Consider adding "Share Results" functionality
- Track which dates get most interest
- Allow participants to mark tentative availability
