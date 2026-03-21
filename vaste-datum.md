# Vaste Datum (Fixed Date Planning)

## Page Purpose
"Vaste Datum" (Fixed Date) is the planning mode when the date is already decided. Users can browse and propose activities for that specific date, organized in a Pinterest-style masonry layout. This mode focuses on "What should we do?" rather than "When should we do it?"

## User Flow
1. User selects "Vaste Datum" mode from dashboard
2. Page displays the fixed date prominently at the top
3. User sees a masonry grid of activity ideas
4. User can add new activity ideas via the quick-add card
5. User can like/vote on existing activities
6. User can view activity details (location, time, links)
7. User confirms final activity selection

## Key Components

### Top App Bar
- **Logo**: "WDW?" in mustard yellow
- **Navigation**: Discover, My Plans, Archive (desktop only)
- **Actions**: Notifications and account circle icons
- **Styling**: Semi-transparent background with backdrop blur

### Fixed Date Header
- **Label**: "Planning voor" (Planning for)
- **Date**: Large heading "Zaterdag 14 Maart" (Saturday 14 March)
- **Idea Count Badge**: "6 Ideeën" in primary color
- **Layout**: Flex row on desktop, stacked on mobile

### Quick Add Card (Masonry Item)
- **Icon**: Lightbulb
- **Title**: "Nieuw Idee" (New Idea)
- **Textarea**: "Waar heb je zin in?" (What do you feel like?)
- **Button**: "Toevoegen" (Add) with plus icon
- **Styling**: Glass card effect with border

### Activity Cards (Masonry Grid)

#### Card with Image (Full Height)
- **Image**: Activity photo (cocktails, donuts, etc.)
- **Like Badge**: Top-right corner
  - White background with 95% opacity
  - Heart icon + vote count
- **Content Section**:
  - Title: "Signature Cocktails @ Blue Note"
  - Description: "Ze hebben een nieuwe lentekaart met vlierbloesem infusies..."
  - Link Display: Icon + truncated URL
  - Styling: Padding, border, shadow

#### Card without Image (Text-Only)
- **Title**: "Picknick in het Noorderpark"
- **Description**: "Iedereen neemt iets kleins mee. Ik regel de prosecco en glazen!"
- **Like Button**: Top-right with count
- **Participant Avatars**: Colored initials in small circles
- **Styling**: Surface container background

#### Card with Image and Details
- **Image**: Activity photo
- **Like Badge**: Top-right
- **Content**:
  - Title: "Donut Pop-up Store"
  - Description: "Alleen deze zaterdag geopend..."
  - Time & Location**: 
    - Schedule icon: "11:00 - 15:00"
    - Location icon: "Centrum"
  - Styling: Smaller text, secondary color

#### Card with Left Border Accent
- **Border-Left**: 4px primary color
- **Title**: "Reserveren bij 'Opa's'"
- **Description**: "Zeker weten dat we hier willen eten?"
- **Like Button**: Filled heart icon (already liked)
- **Styling**: Indicates action needed or special status

### Masonry Layout
- **Desktop**: 3-column masonry grid
- **Tablet**: 2-column masonry grid
- **Mobile**: 1-column layout
- **Gap**: 1.5rem between items
- **CSS**: CSS column-count property for true masonry

### Floating Action Button
- **Position**: Bottom-right corner (desktop), bottom-center (mobile)
- **Icon**: Add
- **Size**: 64px (16x16 icon)
- **Styling**: Primary color with shadow
- **Action**: Opens add activity modal

### Bottom Navigation (Mobile)
- **Feed**: Auto_awesome icon
- **Schedule**: Calendar icon (active/highlighted)
- **People**: Group icon
- **Share**: Share icon

## Design Notes

### Color Scheme
- **Primary**: #E1AD01 (Mustard Yellow)
- **Secondary**: #31302D (Dark Gray)
- **Tertiary**: #6D5E00 (Dark Mustard)
- **Background**: #FDFCF7 (Cream)
- **Surface**: #FDFCF7 (Off-white)
- **Text**: #1D1C1A (Dark)

### Layout
- **Desktop**: Max-width 7xl container
- **Masonry**: 3 columns on desktop, responsive down to 1
- **Padding**: 6 units (24px) on sides
- **Gap**: 1.5rem between masonry items

### Typography
- **Headings**: Bold, tracking-tight
- **Body**: Medium weight
- **Labels**: Small, uppercase, tracking-wider
- **Font**: Plus Jakarta Sans

### Card Styling
- **Border Radius**: 0.375rem (slightly rounded)
- **Shadow**: sm (subtle shadow)
- **Border**: 1px outline/10 opacity
- **Hover**: Border color changes to primary/50

### Interactive Elements
- **Like Button**: Hover effect, scale on active
- **Add Button**: Scale effect on hover, active state
- **Cards**: Hover effects with border changes

## Features

### Pinterest-Style Layout
- Masonry grid adapts to content height
- Images of varying sizes create visual interest
- Efficient use of space

### Activity Discovery
- Browse multiple activity options
- See photos and descriptions
- View participant interest (likes/votes)
- See who's already interested

### Quick Add Functionality
- Add new ideas directly from the grid
- Textarea for detailed descriptions
- Immediate feedback on submission

### Activity Details
- Location information with icon
- Time/duration display
- External links to venues
- Participant avatars showing interest

### Voting System
- Like/vote on activities
- Vote count displayed on each card
- Visual feedback on interaction

## Related Pages
- **Dashboard** - Mode selection hub
- **We Zien Wel** - Flexible planning alternative
- **Vaste Activiteit** - Fixed activity planning alternative
- **Idieënmuur: Activiteit Toevoegen** - Add activity modal

## HTML Reference
The page uses:
- Tailwind CSS masonry grid (column-count)
- Material Symbols for icons
- Plus Jakarta Sans font
- Responsive breakpoints (md: 768px, lg: 1024px)
- Glass card effects with backdrop blur
- Image optimization with object-cover

## Accessibility Notes
- Clear heading hierarchy
- Alt text on all images
- High contrast text on backgrounds
- Icon + text on buttons
- Sufficient touch target sizes (min 44x44px)
- Semantic HTML structure

## Mobile Considerations
- Single-column masonry layout
- Bottom navigation bar
- Floating action button centered
- Touch-friendly like buttons
- Readable text at all sizes
- Images scale appropriately

## Performance Notes
- Lazy load images as user scrolls
- Optimize image sizes for mobile
- Consider pagination for large activity lists
- Cache activity data

## Notes
- Activities should be sortable by votes, date added, or category
- Consider filtering by activity type (food, sports, culture, etc.)
- Show real-time vote counts
- Allow sharing individual activities
- Track which activities get most engagement
