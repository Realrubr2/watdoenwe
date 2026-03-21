# WDW? Page Documentation Index

## Overview
This index provides a comprehensive guide to all pages in the WDW? (Wat De Week?) social planning application. WDW? is a zero-friction planning tool that helps friends coordinate activities and dates without the hassle of traditional calendar apps.

## Core Concept
WDW? operates on three planning modes:
1. **Vaste Datum** - Date is fixed, choose activities
2. **Vaste Activiteit** - Activity is fixed, choose dates
3. **We Zien Wel** - Flexible planning, decide both date and activity

---

## Page Directory

### Entry Points

#### [`gast-ervaring.md`](gast-ervaring.md) - Guest Experience
**Purpose**: Invitation landing page for guests
- Personalized greeting with host and event information
- Name entry without account creation
- Feature highlights (date pinning, idea sharing)
- Trust messaging ("No account needed")
- **User Type**: Invited guests
- **Next Page**: Dashboard or planning mode

#### [`homepagina.md`](homepagina.md) - Homepage
**Purpose**: Main landing page for new users
- Brand introduction and value proposition
- Three planning mode options
- Call-to-action for starting new plans
- Recent plans display
- **User Type**: New or returning users
- **Next Page**: Dashboard or specific planning mode

---

### Planning Hub

#### [`dashboard.md`](dashboard.md) - Main Planning Hub
**Purpose**: Central hub for plan management
- Three planning mode selection cards
- Recent plans list
- Quick access to active plans
- User status overview
- **User Type**: All authenticated users
- **Next Pages**: Vaste Datum, Vaste Activiteit, We Zien Wel
- **Related**: All planning modes

---

### Planning Modes

#### [`vaste-datum.md`](vaste-datum.md) - Fixed Date Planning
**Purpose**: Plan activities for a specific date
- Pinterest-style masonry grid of activities
- Quick add card for new ideas
- Like/vote functionality
- Activity details (location, time, links)
- **When to Use**: Date is already decided
- **Key Feature**: Activity discovery and voting
- **Related Pages**: Dashboard, Idieënmuur, Idieënmuur: Activiteit Toevoegen

#### [`vaste-activiteit.md`](vaste-activiteit.md) - Fixed Activity Planning
**Purpose**: Find best dates for a specific activity
- Calendar with availability heatmap
- Participant overlay system
- Perfect match date highlighting
- Alternative date suggestions
- **When to Use**: Activity is already decided
- **Key Feature**: Availability visualization
- **Related Pages**: Dashboard, Kalender: Datum Selecteren

#### [`we-zien-wel.md`](we-zien-wel.md) - Flexible Planning
**Purpose**: Collaborative planning without fixed date or activity
- Dual-tab interface (Ideas + Calendar)
- Ideas wall with voting
- Calendar heatmap overlay
- Real-time participant status
- **When to Use**: Group hasn't decided on date or activity
- **Key Feature**: Dual-mode interface with live voting
- **Related Pages**: Dashboard, Idieënmuur

---

### Supporting Interfaces

#### [`kalender-datum-selecteren.md`](kalender-datum-selecteren.md) - Date Selection Calendar
**Purpose**: Interactive date selection with paint/swipe interaction
- Touch-friendly calendar grid
- Paint stroke interaction for multi-date selection
- Participant availability display
- Real-time selection feedback
- **Used By**: Vaste Activiteit mode
- **Key Feature**: Swipe/paint interaction for dates
- **Related Pages**: Vaste Activiteit

#### [`idieënmuur.md`](idieënmuur.md) - Ideas Wall (Mobile)
**Purpose**: Mobile-optimized ideas wall for activity discovery
- 2-column masonry grid layout
- Activity cards with images and details
- Like/vote functionality
- Quick add input card
- **Used By**: Vaste Datum, We Zien Wel
- **Key Feature**: Pinterest-style masonry layout
- **Related Pages**: Vaste Datum, Idieënmuur: Activiteit Toevoegen

#### [`idieënmuur-activiteit-toevoegen.md`](idieënmuur-activiteit-toevoegen.md) - Add Activity Modal
**Purpose**: Modal form for submitting new activity ideas
- Title, description, location fields
- Category selection
- Blurred background overlay
- Offset shadow button effect
- **Used By**: Idieënmuur, Vaste Datum
- **Key Feature**: Focused form experience with modal overlay
- **Related Pages**: Idieënmuur, Vaste Datum

---

## User Journey Maps

### New Guest Journey
```
Gast Ervaring (Guest Experience)
    ↓
Enter Name
    ↓
Dashboard
    ↓
Select Planning Mode
    ↓
Vaste Datum / Vaste Activiteit / We Zien Wel
```

### Existing User Journey
```
Homepagina (Homepage)
    ↓
Dashboard
    ↓
Select Planning Mode or Recent Plan
    ↓
Vaste Datum / Vaste Activiteit / We Zien Wel
```

### Fixed Date Planning Flow
```
Dashboard
    ↓
Vaste Datum (Ideas Wall)
    ↓
Browse Ideas / Add New Idea
    ↓
Idieënmuur: Activiteit Toevoegen (Modal)
    ↓
Vote on Ideas
    ↓
Confirm Activity Selection
```

### Fixed Activity Planning Flow
```
Dashboard
    ↓
Vaste Activiteit (Calendar with Heatmap)
    ↓
View Availability
    ↓
Kalender: Datum Selecteren (Paint Dates)
    ↓
Mark Availability
    ↓
Confirm Best Date
```

### Flexible Planning Flow
```
Dashboard
    ↓
We Zien Wel (Dual-Tab Interface)
    ↓
Tab 1: Browse Ideas / Add Ideas
    ↓
Tab 2: View Calendar / Mark Availability
    ↓
System Suggests Best Date + Activity
    ↓
Confirm Plan
```

---

## Design System Overview

### Color Palette
- **Primary**: #E1AD01 (Mustard Yellow) - Main brand color
- **Secondary**: #31302D (Dark Gray) - Secondary actions
- **Tertiary**: #006A6A (Teal) - Accents
- **Background**: #FDFCF7 (Cream) - Page background
- **Surface**: #FDFCF7 (Off-white) - Card backgrounds
- **Text**: #2E2B1D (Dark) - Primary text

### Typography
- **Font Family**: Plus Jakarta Sans
- **Headings**: Bold, tracking-tight
- **Body**: Medium weight
- **Labels**: Small, uppercase, tracking-wider

### Layout Patterns
- **Desktop**: Max-width 7xl container
- **Mobile**: Full-width with padding
- **Responsive Breakpoints**: md (768px), lg (1024px)
- **Spacing**: 4-unit base (16px)

### Interactive Elements
- **Buttons**: Scale effects on hover/active
- **Cards**: Hover effects with border/shadow changes
- **Forms**: Focus states with colored rings
- **Navigation**: Active state highlighting

---

## Feature Matrix

| Feature | Vaste Datum | Vaste Activiteit | We Zien Wel |
|---------|------------|-----------------|------------|
| Ideas Wall | ✓ | ✗ | ✓ |
| Calendar | ✗ | ✓ | ✓ |
| Voting | ✓ | ✗ | ✓ |
| Availability Heatmap | ✗ | ✓ | ✓ |
| Add Ideas | ✓ | ✗ | ✓ |
| Mark Dates | ✗ | ✓ | ✓ |
| Participant Overlay | ✗ | ✓ | ✗ |
| Real-Time Updates | ✓ | ✓ | ✓ |

---

## Mobile vs Desktop Considerations

### Mobile-Specific Pages
- [`gast-ervaring.md`](gast-ervaring.md) - Mobile-first design
- [`idieënmuur.md`](idieënmuur.md) - 2-column masonry
- [`kalender-datum-selecteren.md`](kalender-datum-selecteren.md) - Touch-optimized

### Desktop-Specific Features
- Sticky calendar in We Zien Wel
- Floating status bar on Dashboard
- Full navigation menu
- Larger grid layouts

### Responsive Patterns
- Single column → Multi-column at md breakpoint
- Bottom navigation (mobile) → Top navigation (desktop)
- Floating action buttons → Desktop FAB
- Touch-friendly sizes maintained across all devices

---

## Common Components

### Top App Bar
- Logo: "WDW?" in primary color
- Navigation: Menu (mobile) / Full nav (desktop)
- Actions: Notifications, Profile
- Styling: Semi-transparent with backdrop blur

### Bottom Navigation (Mobile)
- Feed / Add / Calendar / People / Settings
- Floating action button for primary action
- Fixed positioning at bottom

### Cards
- Border: 1px outline-variant/20
- Shadow: sm (subtle)
- Border Radius: 0.375rem
- Hover: Border color changes to primary

### Buttons
- Primary: Mustard background, dark text
- Secondary: Border with primary color
- Active: Scale down effect
- Hover: Scale up effect

### Forms
- Labels: Small, uppercase, tracking-widest
- Inputs: surface-container-low background, no border
- Focus: ring-2 ring-primary
- Placeholder: Secondary color text

---

## Accessibility Features

### All Pages Include
- Clear heading hierarchy
- High contrast text (WCAG AA compliant)
- Icon + text on buttons
- Sufficient touch target sizes (min 44x44px)
- Semantic HTML structure
- Focus states visible on interactive elements

### Specific Implementations
- Calendar: Color + pattern for availability
- Ideas Wall: Alt text on all images
- Forms: Associated labels for all inputs
- Navigation: ARIA labels on icon buttons

---

## Performance Optimization

### Image Optimization
- Lazy loading for masonry grids
- Object-cover for consistent sizing
- Responsive image sizes

### Data Caching
- Cache plan data
- Cache participant availability
- Cache recent plans list

### Interaction Optimization
- Debounce swipe detection
- Throttle scroll events
- Optimize re-renders

---

## Future Enhancements

### Potential Features
- Image upload for activities
- Comments/discussion on ideas
- Activity templates
- Emoji picker for categories
- Search/filter functionality
- Plan sharing and invitations
- Notifications for plan updates
- Dark mode support

### Scalability Considerations
- Pagination for large idea lists
- Infinite scroll for masonry grids
- Real-time updates via WebSocket
- Offline support with service workers

---

## Documentation Maintenance

### When to Update
- New pages are added
- Design system changes
- User flows are modified
- Features are added/removed
- Accessibility improvements

### Version Control
- Keep documentation in sync with code
- Update related pages when one changes
- Maintain consistency across all docs
- Review quarterly for accuracy

---

## Quick Reference

### By User Type
- **New Guest**: Start with [`gast-ervaring.md`](gast-ervaring.md)
- **Returning User**: Start with [`homepagina.md`](homepagina.md) or [`dashboard.md`](dashboard.md)
- **Planning Date**: Use [`vaste-datum.md`](vaste-datum.md)
- **Planning Activity**: Use [`vaste-activiteit.md`](vaste-activiteit.md)
- **Flexible Planning**: Use [`we-zien-wel.md`](we-zien-wel.md)

### By Device
- **Mobile**: Focus on [`gast-ervaring.md`](gast-ervaring.md), [`idieënmuur.md`](idieënmuur.md), [`kalender-datum-selecteren.md`](kalender-datum-selecteren.md)
- **Desktop**: All pages with enhanced layouts
- **Tablet**: Responsive versions of all pages

### By Feature
- **Ideas Management**: [`idieënmuur.md`](idieënmuur.md), [`idieënmuur-activiteit-toevoegen.md`](idieënmuur-activiteit-toevoegen.md)
- **Calendar/Dates**: [`kalender-datum-selecteren.md`](kalender-datum-selecteren.md), [`vaste-activiteit.md`](vaste-activiteit.md)
- **Planning Modes**: [`vaste-datum.md`](vaste-datum.md), [`vaste-activiteit.md`](vaste-activiteit.md), [`we-zien-wel.md`](we-zien-wel.md)

---

## Related Documentation

- **Architecture**: See `architecture.md` for system design
- **Design System**: See `design.md` for detailed design specifications
- **Project README**: See `README.md` for project overview

---

**Last Updated**: March 21, 2026
**Documentation Version**: 1.0
**Total Pages Documented**: 9
