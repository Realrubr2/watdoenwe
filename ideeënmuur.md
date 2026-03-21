# Idieënmuur (Ideas Wall - Mobile View)

## Page Purpose
The "Idieënmuur" (Ideas Wall) is the mobile-optimized view for browsing and voting on activity ideas for a specific date. It displays ideas in a Pinterest-style masonry grid layout, allowing users to discover activities, vote on favorites, and add new ideas. This is the primary interface for idea discovery and curation on mobile devices.

## User Flow
1. User navigates to ideas wall for a specific date
2. Page displays date and planning context
3. User sees masonry grid of activity ideas
4. User can scroll through ideas
5. User can like/vote on ideas
6. User can add new ideas via input card
7. User can view idea details
8. User can share or save favorite ideas

## Key Components

### Top App Bar
- **Menu Icon**: Hamburger menu (left)
- **Logo**: "WDW?" in primary color (center)
- **Profile Avatar**: User profile image (right)
- **Styling**: Semi-transparent background with backdrop blur
- **Position**: Fixed top, z-50

### Page Header Section
- **Title**: "Planning voor Zaterdag 14 Maart" (Planning for Saturday 14 March)
- **Subtitle**: "Verzamel ideeën en stem op je favorieten" (Collect ideas and vote on your favorites)
- **Styling**: Large heading with mustard accent on date
- **Spacing**: Margin-bottom for separation

### Add Idea Input Card
- **Background**: Mustard container (#FEF9C3)
- **Border-Left**: 4px mustard accent
- **Padding**: 5 units
- **Margin-Bottom**: 8 units
- **Layout**: Flex row with gap
- **Content**:
  - **Label**: "Voeg iets toe" (Add something) - uppercase, small, bold, tracking-widest
  - **Input Field**: 
    - Background: Transparent
    - Border-Bottom: 2px mustard/30
    - Focus: Border-bottom mustard
    - Placeholder: "Wat gaan we doen?" (What are we going to do?)
    - Font: Semibold
  - **Add Button**: 
    - Background: Mustard
    - Text: White
    - Icon: Add
    - Padding: 3 units
    - Shadow: sm
    - Hover: Shadow-md

### Masonry Grid Layout
- **CSS**: column-count property
- **Desktop**: 2 columns
- **Mobile**: 2 columns (as shown in HTML)
- **Gap**: 1rem (16px)
- **Item Margin**: 1rem bottom

#### Masonry Item Styling
- **Break-Inside**: avoid (prevents items from breaking across columns)
- **Margin-Bottom**: 1rem
- **Class**: masonry-item

### Activity Idea Cards

#### Card with Image (Full Height)
- **Background**: surface-container-lowest (white)
- **Border**: 1px outline-variant/20
- **Shadow**: sm
- **Overflow**: hidden
- **Content**:
  - **Image Container**: 
    - Aspect: 4/5 (portrait)
    - Overflow: hidden
    - Image: object-cover
  - **Like Badge** (Top-Right):
    - Background: white/95 with backdrop blur
    - Padding: 0.5 units
    - Border: 1px outline-variant/10
    - Shadow: sm
    - Content: Heart icon (filled, error color) + count
  - **Text Section** (Padding: 3 units):
    - Title: Bold, sm, leading-tight
    - Description: 11px, secondary color, leading-relaxed, line-clamp-2
    - Spacing: Margin-top 1 unit

#### Card without Image (Text-Only)
- **Background**: surface-container-lowest (white)
- **Border**: 1px outline-variant/20
- **Shadow**: sm
- **Padding**: 3 units
- **Content**:
  - **Title**: Bold, sm, leading-tight
  - **Description**: 11px, secondary color, leading-relaxed, line-clamp-2
  - **Like Button** (Top-Right):
    - Heart icon (outline)
    - Count
    - Hover: Text color changes to primary

#### Card with Image and Details
- **Similar to image card**
- **Additional Details**:
  - Time: Schedule icon + "11:00 - 15:00"
  - Location: Location icon + "Centrum"
  - Styling: 11px, secondary color

### Like/Vote Functionality
- **Button**: Flex row with gap
- **Icon**: Heart (outline or filled)
- **Count**: Vote count displayed
- **Hover**: Color changes to primary
- **Active**: Scale effect
- **Filled Heart**: Indicates user has already voted

### Responsive Masonry
- **Mobile**: 2 columns (as shown)
- **Tablet**: 2 columns
- **Desktop**: 2 columns (can be adjusted)
- **Gap**: Consistent 1rem

## Design Notes

### Color Scheme
- **Primary**: #4647D3 (Purple)
- **Mustard**: #EAB308 (Mustard Yellow)
- **Mustard Container**: #FEF9C3 (Light Mustard)
- **Background**: #faf4ff (Light Purple)
- **Surface**: #faf4ff (Off-white)
- **Text**: #302950 (Dark)
- **Secondary**: #5e5680 (Gray-Purple)

### Layout
- **Max-width**: md (448px) for mobile
- **Padding**: 4 units (16px) on sides
- **Margin**: Auto for centering
- **Padding-Bottom**: 12 units for bottom spacing

### Typography
- **Headings**: Bold, tracking-tight
- **Body**: Medium weight
- **Labels**: Small, uppercase, tracking-widest
- **Font**: Plus Jakarta Sans

### Card Styling
- **Border Radius**: 0px (sharp corners)
- **Shadow**: sm (subtle)
- **Border**: 1px outline-variant/20
- **Overflow**: hidden for images

### Masonry Styling
- **Column-Count**: 2
- **Column-Gap**: 1rem
- **Break-Inside**: avoid on items
- **Responsive**: Adjusts at breakpoints

### Interactive Elements
- **Like Button**: Hover effects, scale on active
- **Add Button**: Scale on hover, active state
- **Cards**: Hover effects with subtle changes

## Features

### Pinterest-Style Masonry
- Efficient use of space
- Images of varying sizes create visual interest
- Responsive layout adapts to screen size
- Smooth scrolling experience

### Idea Discovery
- Browse multiple activity options
- See photos and descriptions
- View participant interest (likes/votes)
- See location and time information

### Quick Add Functionality
- Add new ideas directly from the grid
- Textarea for detailed descriptions
- Immediate feedback on submission
- Prominent placement at top

### Voting System
- Like/vote on activities
- Vote count displayed on each card
- Visual feedback on interaction
- See which ideas are most popular

### Activity Details
- Location information with icon
- Time/duration display
- Participant avatars showing interest
- Descriptions for context

## Related Pages
- **Vaste Datum** - Desktop version of ideas wall
- **We Zien Wel** - Flexible planning with ideas
- **Idieënmuur: Activiteit Toevoegen** - Add activity modal
- **Dashboard** - Planning hub

## HTML Reference
The page uses:
- Tailwind CSS masonry grid (column-count)
- Material Symbols for icons
- Plus Jakarta Sans font
- Responsive breakpoints
- Line-clamp for text truncation
- Object-cover for image scaling

## Accessibility Notes
- Clear heading hierarchy
- Alt text on all images
- High contrast text on backgrounds
- Icon + text on buttons
- Sufficient touch target sizes (min 44x44px)
- Semantic HTML structure
- Color not sole indicator (uses icons/text)

## Mobile Considerations
- 2-column masonry layout
- Touch-friendly like buttons
- Readable text at all sizes
- Images scale appropriately
- Bottom padding for scrolling
- Top app bar stays visible

## Performance Notes
- Lazy load images as user scrolls
- Optimize image sizes for mobile
- Consider pagination for large idea lists
- Cache idea data
- Debounce like button clicks

## Touch Interaction Details
- **Like Button**: Tap to toggle like state
- **Card**: Tap to view details (implied)
- **Add Button**: Tap to submit new idea
- **Scroll**: Smooth scrolling through masonry

## Notes
- Ideas should be sortable by votes, date added, or category
- Consider filtering by activity type (food, sports, culture, etc.)
- Show real-time vote counts
- Allow sharing individual ideas
- Track which ideas get most engagement
- Consider adding comments/discussion on ideas
- Show idea submitter information
- Allow editing own ideas
