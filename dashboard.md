# Dashboard (Main Planning Hub)

## Page Purpose
The Dashboard is the central hub where users can start new plans or access existing ones. It presents three planning mode options in an editorial-style bento grid layout, allowing users to choose between fixed date, fixed activity, or flexible planning modes. This is the primary entry point after login or guest entry.

## User Flow
1. User logs in or enters as guest
2. Dashboard displays three planning mode options
3. User selects desired planning mode
4. User is directed to the appropriate planning interface
5. User can also view recent plans
6. User can access settings or profile

## Key Components

### Top App Bar
- **Logo**: "WDW?" in mustard yellow
- **Navigation**: Menu icon (mobile), full nav (desktop)
- **Title**: "WDW?" centered
- **Profile**: User profile icon/avatar
- **Styling**: Semi-transparent background with backdrop blur

### Hero Section
- **Label**: "Editorial Planner" (uppercase, small, mustard color)
- **Heading**: "Wat gaan we doen?" (What are we going to do?)
- **Subheading**: "Kies een startpunt voor je activiteit" (Choose a starting point for your activity)
- **Layout**: Flex column with spacing
- **Styling**: Large, bold heading with primary color accent

### Main CTA Button
- **Text**: "START NIEUW PLAN" (uppercase, bold)
- **Icon**: Add circle
- **Background**: Mustard gradient (from #E1AD01 to #ffd966)
- **Text Color**: Dark (on-mustard)
- **Size**: Full-width, 5 units height
- **Styling**: Bold text, gap between text and icon
- **Hover**: Scale effect
- **Active**: Scale down effect
- **Shadow**: md

### Planning Modes Grid (Bento Layout)

#### Mode 1: "Ik weet wanneer" (I know when)
- **Grid Position**: Full width (col-span-1 on mobile, col-span-1 on desktop)
- **Height**: 44 units (176px)
- **Background**: surface-container-lowest (white)
- **Border**: Left border 4px mustard (mustard-accent)
- **Shadow**: sm
- **Content**:
  - **Icon**: Calendar_today (primary color, 3xl)
  - **Title**: "Ik weet wanneer" (bold, xl)
  - **Subtitle**: "(Vaste datum)" (secondary color, medium)
- **Layout**: Flex column, justify-between
- **Hover**: Subtle effects

#### Mode 2: "Ik weet wat" (I know what)
- **Grid Position**: Half width (col-span-1 in 2-column row)
- **Height**: 48 units (192px)
- **Background**: surface-container-lowest (white)
- **Border**: Left border 4px mustard (mustard-accent)
- **Shadow**: sm
- **Content**:
  - **Icon**: Restaurant (primary color, 3xl)
  - **Title**: "Ik weet wat" (bold, lg)
  - **Subtitle**: "(Vaste activiteit)" (secondary color, medium)
- **Layout**: Flex column, justify-between

#### Mode 3: "Geen idee nog" (No idea yet)
- **Grid Position**: Half width (col-span-1 in 2-column row)
- **Height**: 48 units (192px)
- **Background**: surface-container-high (light gray)
- **Shadow**: sm
- **Content**:
  - **Icon**: Help (primary color, 3xl)
  - **Decorative Icon**: Help outline (120px, opacity-10, absolute)
  - **Title**: "Geen idee nog" (bold, lg)
  - **Subtitle**: "(We zien wel)" (secondary color, medium)
- **Layout**: Flex column, justify-between, relative positioning

### Grid Layout
- **Desktop**: 1 column for mode 1, 2 columns for modes 2-3
- **Mobile**: Single column, stacked
- **Gap**: 1 unit (4px)
- **Responsive**: Adjusts at md breakpoint (768px)

### Recent Plans Section
- **Title**: "Recente Plannen" (Recent Plans)
- **Label Styling**: Small, uppercase, tracking-wider, secondary color with opacity
- **Spacing**: Gap of 1 unit

#### Recent Plan Item
- **Layout**: Flex row with gap
- **Background**: surface (white)
- **Padding**: 4 units
- **Border**: 1px outline-variant/10
- **Content**:
  - **Icon Container**: 12x12 (48px), mustard background with 10% opacity
  - **Icon**: Group (mustard color)
  - **Plan Title**: "Weekendje Ardennen" (bold, sm)
  - **Plan Status**: "In afwachting van datum" (secondary color, uppercase, tracking-tighter, xs)
  - **Chevron**: Right arrow icon (outline-variant color)
- **Hover**: Subtle effects
- **Spacing**: Flex-1 for title section to push chevron right

### Mobile Bottom Navigation
- **Position**: Fixed bottom
- **Layout**: Flex row, space-around
- **Background**: surface/90 with backdrop blur
- **Padding**: 8 units bottom, 4 units top
- **Border-Top**: 1px outline-variant/10
- **Z-Index**: 50

#### Navigation Items
1. **Feed**: Auto_awesome icon, "Feed" label
2. **Add** (Floating): Primary color background, centered, -mt-10 for overlap
3. **Calendar**: Calendar_today icon, "Schedule" label

### Desktop Floating Status Bar
- **Position**: Fixed bottom-8 right-8
- **Background**: surface-container-lowest with shadow
- **Border**: 1px white/50 with backdrop blur
- **Padding**: 6 units
- **Z-Index**: 40
- **Content**:
  - **Avatar Cluster**: 3 user avatars with -space-x-3
  - **Divider**: Vertical line
  - **Status Text**: "2 actieve plannen" (bold, sm)
  - **Action Icon**: Open in new (primary color, xl)

## Design Notes

### Color Scheme
- **Primary**: #E1AD01 (Mustard Yellow)
- **Secondary**: #31302D (Dark Gray)
- **Background**: #FDFCF7 (Cream)
- **Surface**: #FDFCF7 (Off-white)
- **Text**: #2E2B1D (Dark)

### Layout
- **Desktop**: Max-width 7xl container
- **Mobile**: Full-width with padding
- **Padding**: 6 units on sides
- **Spacing**: Generous gaps between sections

### Typography
- **Headings**: Bold, tracking-tight
- **Body**: Medium weight
- **Labels**: Small, uppercase, tracking-wider
- **Font**: Plus Jakarta Sans

### Card Styling
- **Border Radius**: 0.375rem (slightly rounded)
- **Shadow**: sm (subtle)
- **Border**: 1px outline-variant/10
- **Left Border Accent**: 4px mustard for mode cards

### Interactive Elements
- **Buttons**: Scale on hover, active state
- **Cards**: Hover effects with subtle changes
- **Navigation**: Active state highlighting

## Features

### Three Planning Modes
- **Vaste Datum**: When date is fixed, choose activities
- **Vaste Activiteit**: When activity is fixed, choose dates
- **We Zien Wel**: Flexible planning, decide both date and activity

### Quick Access
- Large CTA button for starting new plans
- Recent plans list for quick access to ongoing plans
- Clear mode descriptions for user guidance

### Editorial Design
- Bento grid layout for visual interest
- Varied card heights create dynamic layout
- Icons and colors guide user attention
- Clean, minimal aesthetic

### User Context
- Avatar cluster shows active participants
- Active plan count provides status overview
- Recent plans show engagement

## Related Pages
- **Vaste Datum** - Fixed date planning mode
- **Vaste Activiteit** - Fixed activity planning mode
- **We Zien Wel** - Flexible planning mode
- **Gast Ervaring** - Guest entry point

## HTML Reference
The page uses:
- Tailwind CSS grid system
- Material Symbols for icons
- Plus Jakarta Sans font
- Responsive breakpoints (md: 768px)
- Gradient backgrounds
- Backdrop blur effects
- Flex layout for navigation

## Accessibility Notes
- Clear heading hierarchy
- High contrast text on backgrounds
- Icon + text on buttons and navigation
- Sufficient touch target sizes (min 44x44px)
- Semantic HTML structure
- Clear labels for all interactive elements

## Mobile Considerations
- Single-column layout
- Bottom navigation bar
- Floating action button for adding plans
- Touch-friendly card sizes
- Readable text at all sizes
- Full-width CTA button

## Performance Notes
- Lazy load recent plans
- Cache plan data
- Optimize avatar images
- Consider pagination for many recent plans

## Notes
- Recent plans should be sorted by last activity
- Consider adding search/filter for plans
- Show plan status indicators (pending, active, completed)
- Allow quick actions on recent plans (edit, share, delete)
- Track which mode is most popular
- Consider adding tutorial/onboarding for new users
- Show notifications for plan updates
