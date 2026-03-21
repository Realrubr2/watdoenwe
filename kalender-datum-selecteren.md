# Kalender: Datum Selecteren (Date Selection Calendar)

## Page Purpose
"Kalender: Datum Selecteren" (Calendar: Select Date) is an interactive date selection interface where users can mark their availability by painting/swiping across multiple dates. This page uses a touch-friendly interaction model where users can drag their finger across dates to indicate which days they're available.

## User Flow
1. User navigates to date selection page
2. Page displays a calendar for the current/selected month
3. User sees dates with participant avatars already marked
4. User can swipe/paint across dates to mark their availability
5. Selected dates get highlighted with a paint stroke effect
6. User sees real-time feedback of selected dates
7. User clicks "Opslaan" (Save) to confirm selection
8. System records user's availability

## Key Components

### Top Navigation
- **Back Arrow**: Navigate back to previous page
- **Title**: "Select Availability"
- **Logo**: "WDW?" in mustard yellow (right side)

### Calendar Month Header
- **Label**: "SPRING 2024" (uppercase, small, secondary color)
- **Month**: "March" (large, bold heading)
- **Navigation Arrows**: Previous/Next month buttons
- **Styling**: Flex row with space-between

### Calendar Grid

#### Day Labels
- **Row**: MON, TUE, WED, THU, FRI, SAT, SUN
- **Styling**: Uppercase, small, bold, secondary color
- **Saturday/Sunday**: Highlighted in mustard yellow
- **Spacing**: Margin-bottom for separation from dates

#### Calendar Cells

**Empty Cells (Previous Month Padding)**
- Background: surface-container-low
- Opacity: 30%
- No interaction

**Regular Date Cells**
- **Background**: surface-container-low
- **Border**: 1px outline-variant/20
- **Border Radius**: 0.5rem (lg)
- **Aspect**: Square (1:1 ratio)
- **Padding**: 0.5rem
- **Content**: Date number (top-left)

**Cells with Participant Avatars**
- **Avatar Cluster**: Top-right corner
- **Avatar Size**: 4x4 (16px)
- **Avatar Style**: Rounded-full, border-2 border-white
- **Scaling**: scale-75 for compact display
- **Stacking**: Negative margin (-space-x-1) for overlap

**Paint Stroke Overlay (Selected Dates)**
- **Class**: "paint-stroke"
- **Background**: rgba(234, 179, 8, 0.25) - Mustard with transparency
- **Backdrop Filter**: blur(4px)
- **Z-Index**: 10
- **Effect**: Creates painted/highlighted appearance

**Interactive Paint Interaction Area**
- **Dates**: 14, 15, 16 (example range)
- **Paint Stroke**: Applied to all selected dates
- **Finger Indicator**: Circular overlay showing touch point
  - Position: Bottom-right with translate
  - Size: 64px outer, 40px inner
  - Background: White with 30% opacity
  - Backdrop blur effect
  - Shadow: xl

### Instructional Text
- **Location**: Below calendar
- **Text**: "Slide your finger across the dates"
- **Count**: "3 dates selected" (in mustard yellow, bold)
- **Styling**: Center-aligned, secondary color

### Floating Action Button (Save)
- **Position**: Fixed bottom-0, full-width
- **Background**: Mustard yellow (#eab308)
- **Hover**: Darker mustard (#d9a507)
- **Text**: "Opslaan" (Save) - uppercase, bold, tracking-widest
- **Icon**: Arrow forward (right side)
- **Shadow**: Large shadow with mustard color
- **Active State**: Scale down on click
- **Padding**: 5 units vertical, 8 units horizontal

### Decorative Background Elements
- **Top-Right Blob**: surface-container rounded-full, blur-100px, opacity-60
- **Bottom-Left Blob**: surface-container-highest rounded-full, blur-80px, opacity-50
- **Z-Index**: -10 (behind content)
- **Purpose**: Visual interest without distraction

## Design Notes

### Color Scheme
- **Primary**: #eab308 (Mustard Yellow)
- **Secondary**: #302950 (Dark Purple)
- **Background**: #faf4ff (Light Purple)
- **Surface**: #faf4ff (Off-white)
- **Text**: #302950 (Dark)

### Layout
- **Max-width**: 4xl container
- **Padding**: 6 units (24px) on sides
- **Margin**: Auto for centering
- **Min-height**: max(884px, 100dvh) for full viewport

### Typography
- **Headings**: Bold, tracking-tight
- **Body**: Medium weight
- **Labels**: Small, uppercase, tracking-widest
- **Font**: Plus Jakarta Sans

### Calendar Styling
- **Grid**: 7 columns
- **Gap**: 0.5rem (2px)
- **Cell Aspect**: Square (1:1)
- **Border Radius**: 0.5rem (lg)
- **Responsive**: Adjusts gap on different screen sizes

### Interactive Elements
- **Paint Stroke**: Smooth transitions
- **Finger Indicator**: Animated appearance
- **Save Button**: Scale effects on hover/active
- **Calendar Cells**: Hover states with color changes

## Features

### Touch-Friendly Date Selection
- Swipe/paint interaction across multiple dates
- Visual feedback with paint stroke effect
- Finger position indicator shows touch point
- Smooth transitions between states

### Real-Time Feedback
- Selected date count displayed
- Paint stroke appears as user drags
- Finger indicator follows touch point
- Immediate visual confirmation

### Participant Visibility
- See which friends are already available on each date
- Avatar clusters show existing availability
- Helps inform selection decisions

### Multi-Date Selection
- Select multiple consecutive dates with single swipe
- Paint stroke effect makes selection clear
- Easy to adjust selection by re-swiping

### Save Functionality
- Clear call-to-action button
- Prominent positioning at bottom
- Hover and active states for feedback
- Confirmation of selection

## Related Pages
- **Vaste Activiteit** - Fixed activity planning (uses this calendar)
- **We Zien Wel** - Flexible planning (alternative date selection)
- **Dashboard** - Planning hub

## HTML Reference
The page uses:
- Tailwind CSS grid system
- Material Symbols for icons
- Plus Jakarta Sans font
- Responsive breakpoints
- Backdrop filter for paint stroke effect
- Absolute positioning for finger indicator
- Fixed positioning for save button

## Accessibility Notes
- Clear heading hierarchy
- High contrast text on backgrounds
- Icon + text on buttons
- Sufficient touch target sizes (min 44x44px)
- Semantic HTML structure
- Instructions provided for interaction
- Alternative text for images

## Mobile Considerations
- Full-screen calendar view
- Touch-optimized interaction
- Large touch targets for dates
- Bottom-fixed save button
- Readable text at all sizes
- Finger indicator shows touch point

## Touch Interaction Details
- **Swipe Detection**: Horizontal/vertical swipe across dates
- **Paint Stroke**: Applied to all dates in swipe path
- **Multi-touch**: Handle single finger only
- **Momentum**: Consider scroll momentum on mobile
- **Haptic Feedback**: Optional vibration on date selection

## Performance Notes
- Smooth animations for paint stroke
- Efficient touch event handling
- Debounce swipe detection
- Optimize re-renders during painting

## Notes
- Consider adding "Clear Selection" button
- Allow clicking individual dates to toggle
- Show visual feedback for already-selected dates
- Consider adding month/year picker for faster navigation
- Track which dates get most selections
- Provide undo functionality
- Consider adding preset options (weekends, weekdays, etc.)
