# Idieënmuur: Activiteit Toevoegen (Add Activity Modal)

## Page Purpose
"Idieënmuur: Activiteit Toevoegen" (Ideas Wall: Add Activity) is a modal overlay that allows users to submit new activity ideas to the ideas wall. It appears on top of the blurred ideas wall background, creating a focused form experience for adding new activities with title, description, location, and category information.

## User Flow
1. User clicks "Add" button or "Voeg toe" link on ideas wall
2. Modal overlay appears with blurred background
3. User fills in activity title
4. User adds description or link
5. User enters location/address
6. User selects activity category
7. User clicks "Toevoegen" (Add) to submit
8. Modal closes and idea appears on wall

## Key Components

### Background Overlay
- **Position**: Fixed, full-screen
- **Background**: Blurred ideas wall content
- **Blur Effect**: blur-sm, grayscale-20%
- **Pointer Events**: none (doesn't interfere with modal)
- **Z-Index**: Lower than modal

#### Blurred Content (Simulated)
- **Top App Bar**: Simulated with blurred styling
- **Masonry Grid**: Blurred activity cards
- **Purpose**: Shows context of where modal appears

### Modal Container
- **Position**: Fixed, centered
- **Z-Index**: 50 (above blur)
- **Background**: surface-container-lowest (white)
- **Shadow**: 2xl (prominent shadow)
- **Overflow**: hidden
- **Max-Width**: lg (512px)
- **Width**: Full on mobile, constrained on desktop

### Modal Header
- **Padding**: 8 units (32px)
- **Padding-Bottom**: 0 (no bottom padding)
- **Layout**: Flex row, space-between
- **Content**:
  - **Left Section**:
    - **Title**: "Voeg iets toe" (Add something) - 3xl, bold, tracking-tight
    - **Subtitle**: "Deel een nieuw idee voor de Idea Wall" (Share a new idea for the Idea Wall) - secondary color, medium
  - **Close Button**:
    - Icon: Close (3xl)
    - Hover: Background color change
    - Padding: 2 units

### Modal Form
- **Padding**: 8 units (32px)
- **Spacing**: 8 units between form groups

#### Form Group 1: Title Field
- **Label**: "Titel" (Title)
  - Styling: xs, bold, uppercase, tracking-widest, mustard color
  - Margin-Bottom: 2 units
- **Input Field**:
  - Background: surface-container-low
  - Border: 0 (no border)
  - Focus: ring-2 ring-mustard
  - Padding: 4 units
  - Font: lg, semibold
  - Placeholder: "Wat gaan we doen?" (What are we going to do?)
  - Text Color: on-surface
  - Placeholder Color: outline-variant

#### Form Group 2: Note/Link Field
- **Label**: "Notitie/Link" (Note/Link)
  - Styling: xs, bold, uppercase, tracking-widest, mustard color
  - Margin-Bottom: 2 units
- **Textarea**:
  - Background: surface-container-low
  - Border: 0 (no border)
  - Focus: ring-2 ring-mustard
  - Padding: 4 units
  - Font: base, on-surface
  - Placeholder: "Beschrijf het idee of plak een link..." (Describe the idea or paste a link...)
  - Rows: 3
  - Resize: none

#### Form Group 3: Address Field
- **Label**: "Adres" (Address)
  - Styling: xs, bold, uppercase, tracking-widest, mustard color
  - Margin-Bottom: 2 units
- **Input Container**: Relative positioning
- **Icon**: Location_on (absolute, left-4, top-1/2, -translate-y-1/2)
- **Input Field**:
  - Background: surface-container-low
  - Border: 0 (no border)
  - Focus: ring-2 ring-mustard
  - Padding: 4 units, pl-12 (left padding for icon)
  - Font: base, on-surface
  - Placeholder: "Waar is het?" (Where is it?)
  - Text Color: on-surface
  - Placeholder Color: outline-variant

#### Category Selection
- **Padding-Top**: 4 units
- **Layout**: Flex wrap with gap-2
- **Label**: Implied (no explicit label)
- **Category Buttons**:
  - **Active Category** (e.g., "Eten"):
    - Background: Mustard (#eab308)
    - Text: White
    - Padding: 4 units horizontal, 2 units vertical
    - Font: xs, bold, uppercase, tracking-widest
  - **Inactive Categories** (e.g., "Cultuur", "Sport", "Overig"):
    - Background: surface-container-high
    - Text: on-surface-variant
    - Padding: 4 units horizontal, 2 units vertical
    - Font: xs, bold, uppercase, tracking-widest
    - Hover: Subtle effects
- **Categories**: Eten, Cultuur, Sport, Overig

### Submit Button
- **Width**: Full-width
- **Padding**: 5 units vertical
- **Background**: Mustard (#eab308)
- **Text**: on-primary-fixed (dark)
- **Font**: Bold, xl, uppercase, tracking-[0.15em]
- **Shadow**: 8px 8px 0px 0px #302950 (offset shadow effect)
- **Active State**: 
  - translate-x-1 translate-y-1 (moves with shadow)
  - shadow-none (shadow disappears)
- **Transition**: all
- **Text**: "Toevoegen" (Add)

## Design Notes

### Color Scheme
- **Primary**: #4647D3 (Purple)
- **Mustard**: #eab308 (Mustard Yellow)
- **Background**: #faf4ff (Light Purple)
- **Surface**: #faf4ff (Off-white)
- **Text**: #302950 (Dark)
- **Secondary**: #5e5680 (Gray-Purple)

### Layout
- **Modal Max-Width**: lg (512px)
- **Padding**: 8 units (32px) on all sides
- **Spacing**: 8 units between form groups
- **Margin**: Auto for centering

### Typography
- **Headings**: Bold, tracking-tight
- **Labels**: Small, uppercase, tracking-widest, mustard color
- **Body**: Medium weight
- **Font**: Plus Jakarta Sans

### Form Styling
- **Input/Textarea Background**: surface-container-low
- **Border**: None (clean look)
- **Focus**: ring-2 ring-mustard (colored ring on focus)
- **Padding**: 4 units (16px)
- **Font**: Semibold for title, regular for others

### Button Styling
- **Background**: Mustard yellow
- **Shadow**: Offset shadow (8px 8px 0px)
- **Active**: Shadow collapses, element moves
- **Transition**: Smooth all transitions

### Modal Styling
- **Border Radius**: 0px (sharp corners)
- **Shadow**: 2xl (prominent)
- **Overflow**: hidden
- **Z-Index**: 50

## Features

### Modal Overlay
- Blurred background shows context
- Focused form experience
- Easy to close with X button
- Prevents accidental clicks outside

### Form Fields
- Title field for activity name
- Note/Link field for descriptions or URLs
- Address field for location
- Category selection for organization

### Category Selection
- Visual feedback for selected category
- Multiple categories to choose from
- Easy to change selection
- Helps organize ideas

### Submit Feedback
- Offset shadow effect on button
- Active state with movement
- Clear visual feedback on interaction
- Satisfying click experience

### Accessibility
- Clear labels for all fields
- High contrast text
- Focus states visible
- Semantic HTML structure

## Related Pages
- **Idieënmuur** - Ideas wall where ideas appear
- **Vaste Datum** - Desktop version of ideas wall
- **We Zien Wel** - Flexible planning with ideas

## HTML Reference
The page uses:
- Tailwind CSS for styling
- Material Symbols for icons
- Plus Jakarta Sans font
- Fixed positioning for modal
- Backdrop blur for background
- Relative positioning for icon in input
- Offset shadow effect on button

## Accessibility Notes
- Clear heading hierarchy
- Labeled form fields
- High contrast text on backgrounds
- Focus states visible on inputs
- Icon + text on buttons
- Sufficient touch target sizes (min 44x44px)
- Semantic HTML structure
- Close button for keyboard users

## Mobile Considerations
- Full-width modal on mobile
- Touch-friendly input fields
- Large submit button
- Readable text at all sizes
- Keyboard appears for text inputs
- Scrollable form if needed

## Form Validation (Implied)
- Title field: Required
- Description: Optional
- Address: Optional
- Category: Required (default selected)
- Submit: Validates before sending

## Performance Notes
- Modal loads quickly
- Form submission is instant (implied)
- No heavy animations
- Lightweight overlay effect

## User Experience Notes
- Pre-select first category (Eten)
- Auto-focus title field on open
- Clear placeholder text
- Helpful labels
- Visual feedback on all interactions
- Easy to cancel (X button)
- Satisfying submit interaction

## Notes
- Consider adding image upload for activities
- Allow editing submitted ideas
- Show confirmation after submission
- Consider adding emoji picker for categories
- Track which categories are most used
- Allow saving draft ideas
- Consider adding activity templates
- Show similar ideas to prevent duplicates
