# Gast Ervaring (Guest Experience)

## Page Purpose
The guest experience landing page is the entry point for invited guests. It welcomes users by name, displays the invitation details, and allows them to enter the planning without requiring an account.

## User Flow
1. Guest receives invitation link
2. Page loads with personalized greeting ("Hi [Name]!")
3. Guest sees who invited them and what event they're invited to
4. Guest enters their name in the input field
5. Guest clicks "Bekijk het plan" (View the plan) to proceed
6. Guest is directed to the planning interface

## Key Components

### Header Section
- **Branding**: "WDW?" logo with "Wat De Week?" tagline
- **Location**: Top center of page
- **Styling**: Mustard yellow primary color (#E1B000)

### Welcome Card
- **Avatar Cluster**: Host profile image + sparkle icon
- **Greeting**: "Hi [Guest Name]!"
- **Invitation Text**: "[Host Name] nodigt je uit voor '[Event Name]'"
- **Name Input Field**: Labeled "Je naam" with placeholder "Hoe mogen we je noemen?"
- **CTA Button**: "Bekijk het plan" with arrow icon

### Feature Bento Grid
Two feature cards highlighting key benefits:
1. **Data Pinnen** (Calendar icon)
   - "Geef aan wanneer je vrij bent zonder account"
2. **Ideeën Delen** (Lightbulb icon)
   - "Gooi je wildste plannen op de Ideas Wall"

### Footer
- **Trust Badge**: "Geen account nodig" (No account needed)
- **Security Icons**: Verified user, lock, and security symbols
- **Message**: "WDW? helpt vrienden samen te komen zonder de ruis van traditionele agenda's"

### Decorative Elements
- Abstract background blobs (mustard and secondary colors with blur effect)
- Atmospheric images of friends (desktop only, rotated with opacity)

## Design Notes

### Color Scheme
- **Primary**: #E1AD01 (Mustard Yellow)
- **Background**: #FFFCF0 (Cream)
- **Surface**: #FDFCF7 (Off-white)
- **Text**: #2E2B1D (Dark brown)

### Layout
- **Mobile-first responsive design**
- **Max-width container**: Centered content
- **Spacing**: Generous padding for breathing room
- **Border Radius**: 0.5rem (slightly rounded corners)

### Typography
- **Font Family**: Plus Jakarta Sans
- **Heading**: Bold, tracking-tighter for compact look
- **Body**: Medium weight for readability

### Interactive Elements
- **Input Field**: Floating label, focus state with primary color border
- **Button**: Full-width, hover effect with scale, active state with scale-down
- **Hover States**: Smooth transitions on all interactive elements

## Features

### Zero Friction Entry
- No account creation required
- Single name input field
- Clear call-to-action
- Trust messaging to reduce friction

### Personalization
- Guest name displayed in greeting
- Host name and event name shown
- Avatar of host displayed

### Mobile Optimization
- Full-screen layout
- Touch-friendly button sizes
- Readable text at all sizes
- Decorative images hidden on mobile

## Related Pages
- **Homepagina** - Main landing page for non-invited users
- **Dashboard** - Planning hub after guest enters name
- **Datum Prikken** - Date selection page guest proceeds to

## HTML Reference
The guest experience page uses:
- Tailwind CSS for styling
- Material Symbols for icons
- Plus Jakarta Sans font
- Responsive grid layout
- Backdrop blur effects for decorative elements

## Accessibility Notes
- Clear label for name input
- High contrast text on background
- Semantic HTML structure
- Icon + text on buttons for clarity
- Sufficient touch target sizes (min 44x44px)

## Notes
- Page should auto-fill guest name if passed via URL parameter
- Consider adding email verification for guest list management
- Track guest engagement metrics from this page
