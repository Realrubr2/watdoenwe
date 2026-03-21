# We Zien Wel (Flexible Planning Mode)

## Page Purpose
"We Zien Wel" (We'll See) is the flexible planning mode where the group hasn't decided on a specific date or activity yet. This page combines an Ideas Wall with a calendar overlay, allowing users to propose activities and see which dates work best for everyone.

## User Flow
1. User selects "We Zien Wel" mode from dashboard
2. Page displays dual-tab interface: "Wat?" (What) and "Wanneer?" (When)
3. User can view ideas on the Ideas Wall tab
4. User can switch to calendar tab to see date availability
5. System highlights the best matching date when all participants are available
6. User can add new ideas or vote on existing ones
7. User confirms the final plan

## Key Components

### Top App Bar
- **Logo**: "WDW?" in mustard yellow
- **Navigation**: Discover, My Plans, Archive (desktop only)
- **Actions**: Notifications and account circle icons
- **Styling**: Semi-transparent background with backdrop blur

### Hero Section
- **Title**: "We Zien Wel."
- **Subtitle**: "Weekendje met de gang — 12-14 Aug"
- **Collaborative Status**: 
  - Avatar cluster showing participating friends
  - Live voting indicator: "5/8 hebben gestemd"
  - Animated pulse dot for real-time status

### Dual Tab Interface
Two toggle buttons:
1. **"Wat?" (What)** - Ideas Wall tab (active by default)
2. **"Wanneer?" (When)** - Calendar overlay tab

### Ideas Wall Section (Left Column - 7/12 grid)

#### Winning Idea Card (Featured)
- **Border**: 2px primary color border
- **Background**: Primary color with 5% opacity
- **Star Icon**: Indicates winning/popular idea
- **Content**:
  - Icon (restaurant, movie, sports, etc.)
  - Title: "Fancy Diner & Drinks"
  - Description: "Iedereen trekt z'n beste kleren aan voor die nieuwe bistro in Gent"
  - Vote Progress Bar: Visual representation of votes
  - Vote Count: "6 stemmen"
  - Submitted By: "Ingezonden door Jasper"

#### Secondary Idea Cards
- **Layout**: Grid of 2 columns
- **Card Style**: Surface container background with border
- **Hover State**: Border color changes to primary
- **Content**:
  - Icon in top-left
  - Vote count badge in top-right
  - Title and description
  - Vote progress bar at bottom
- **Examples**:
  - "Padel Toernooi" (2 votes)
  - "Open Air Cinema" (1 vote)

#### Add Idea Button
- **Location**: Top-right of Ideas section
- **Icon**: Add circle
- **Text**: "Voeg toe"
- **Action**: Opens modal to add new idea

### Calendar Overlay Section (Right Column - 5/12 grid)

#### Calendar Header
- **Title**: "Wanneer?"
- **Month Badge**: "Augustus" in primary color
- **Navigation**: Previous/Next month arrows

#### Heatmap Calendar
- **Grid**: 7 columns (Mon-Sun)
- **Day Labels**: MA, DI, WO, DO, VR, ZA, ZO
- **Cell Size**: 9x9 aspect ratio
- **Heatmap Logic**:
  - Empty cells for previous month padding
  - Light background for low availability
  - Primary color for high availability
  - Darker primary for perfect match dates

#### Winning Date Highlight
- **Date**: 13 (Saturday)
- **Styling**: 
  - Primary color background
  - White text
  - Ring effect with offset
  - Small dot indicator in top-right
- **Label**: "PERFECT!" badge below date

#### Status Overlay Card
- **Title**: "Geselecteerde Optie"
- **Check Icon**: Filled circle with checkmark
- **Date**: "Zaterdag, 13 Augustus"
- **Message**: "Top datum! Alle 8 vrienden kunnen."
- **Participant Tags**: Colored badges with friend names
- **Action Button**: "Bevestig Planning" (Confirm Planning)

### Mobile Bottom Navigation
- **Feed** icon
- **Add** button (floating, centered, primary color)
- **Group** icon

### Desktop Floating Action Button
- **Position**: Bottom-right corner
- **Icon**: Add
- **Size**: 16x16 (64px)
- **Styling**: Primary color with shadow

## Design Notes

### Color Scheme
- **Primary**: #E4B000 (Mustard Yellow)
- **Secondary**: #5F6200 (Olive Green)
- **Tertiary**: #006A6A (Teal)
- **Background**: #FDFCF4 (Cream)
- **Surface**: #FDFCF4 (Off-white)
- **Text**: #1D1C16 (Dark)

### Layout
- **Desktop**: 12-column grid layout
- **Left Column**: 7 columns for Ideas Wall
- **Right Column**: 5 columns for Calendar (sticky on scroll)
- **Mobile**: Single column, stacked layout
- **Max-width**: 5xl container

### Typography
- **Headings**: Bold, tracking-tight
- **Body**: Medium weight
- **Labels**: Small, uppercase, tracking-wider

### Interactive Elements
- **Tab Buttons**: Active state with background and shadow
- **Idea Cards**: Hover effects with border color change
- **Vote Progress**: Animated width transitions
- **Calendar Cells**: Hover states with color changes

## Features

### Dual-Mode Interface
- Switch between Ideas and Calendar views
- Sticky calendar on desktop for reference while scrolling ideas
- Mobile-optimized single-column layout

### Real-Time Voting
- Vote progress bars show community preference
- Live participant count
- Animated pulse indicator for active voting

### Smart Date Matching
- Heatmap shows availability across all participants
- Highlights perfect match dates
- Shows which friends can attend each date

### Idea Management
- Add new ideas with modal form
- Vote on existing ideas
- See idea submitter information
- Filter by category (implied)

### Collaborative Status
- Avatar cluster shows who's participating
- Vote count shows engagement
- Real-time updates (implied)

## Related Pages
- **Dashboard** - Mode selection hub
- **Vaste Datum** - Fixed date planning alternative
- **Vaste Activiteit** - Fixed activity planning alternative
- **Ideeënmuur** - Dedicated ideas wall view

## HTML Reference
The page uses:
- Tailwind CSS grid system (12-column)
- Material Symbols for icons
- Plus Jakarta Sans font
- Sticky positioning for calendar
- Heatmap visualization with color overlays
- Responsive breakpoints (lg: 1024px)

## Accessibility Notes
- Clear tab labels with icons
- High contrast text on backgrounds
- Semantic HTML for calendar grid
- Icon + text on buttons
- Sufficient touch target sizes
- ARIA labels for interactive elements

## Mobile Considerations
- Single-column layout
- Bottom navigation bar
- Floating action button for adding ideas
- Swipeable tabs (implied)
- Touch-friendly vote buttons

## Notes
- Calendar should update in real-time as votes come in
- Heatmap intensity should increase with more participants available
- Perfect match dates should trigger celebration/highlight animation
- Consider adding "Share Results" functionality
- Track which ideas get most engagement
