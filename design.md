# Design Systeem: Zero Friction (Mustard Edition)

## 1. Visuele Identiteit & Core Principes
Het doel van het "Zero Friction" design systeem is om een gebruikerservaring te bieden die zo min mogelijk weerstand oproept. Het design is functioneel, ruimtelijk en modern.

**Core Principes:**
- **Zero Friction:** Acties moeten binnen 30 seconden voltooid kunnen worden.
- **Transparante Hiërarchie:** Gebruik van overlays en transparantie om diepte en context te geven zonder de gebruiker te overweldigen.
- **Consistentie:** Uniforme knoppen, hoeken en kleuren over alle apparaten heen (Mobile & Desktop).

---

## 2. Kleurenpalet
We gebruiken een specifiek okergeel (Mustard) als primaire actiekleur, ondersteund door een rustig, professioneel palet van paars- en grijstinten.

### Primair (Actie)
- **Mustard Yellow:** `#EAB308` (Tailwind: `yellow-500`)
  - Gebruik voor: Primaire knoppen, actieve iconen, belangrijke koppen en accenten.

### Secundair & Achtergrond
- **Deep Purple (Text/Icons):** `#302950`
  - Gebruik voor: Hoofdtekst, logo, en donkere iconen.
- **Soft Lavender (BG):** `#FAF4FF`
  - Gebruik voor: De algemene achtergrond van de app.
- **Muted Lavender (UI Surfaces):** `#F4EEFF`
  - Gebruik voor: Kaarten, sectie-achtergronden en subtiele scheidingen.

### Heatmap & Overlay Kleuren
Voor de kalender overlays gebruiken we transparante kleuren (30% opacity) die bij overlapping intenser worden:
- **Jan (Blauw):** `rgba(70, 71, 211, 0.3)`
- **Lisa (Groen):** `rgba(34, 197, 94, 0.3)`
- **Mark (Rood):** `rgba(239, 68, 68, 0.3)`
- **Sarah (Oranje):** `rgba(249, 115, 22, 0.3)`

---

## 3. Typografie
We gebruiken **Plus Jakarta Sans** voor een moderne, leesbare en vriendelijke uitstraling.

- **Headlines:** Bold / Black, Tracking `-0.02em`, Deep Purple.
- **Body:** Medium, Deep Purple, Line-height `1.5`.
- **Labels/Captions:** Semibold, Uppercase, Tracking `0.05em`.

---

## 4. UI Componenten & Regels

### Hoeken & Vormen (Border Radius)
- **Standaard Radius:** `4px` tot `8px` (Semi-square).
- We vermijden extreem ronde "pill" vormen voor knoppen en kaarten om een strakker, professioneler uiterlijk te behouden.

### Knoppen (Buttons)
- **Primary Button:** Solid Mustard Yellow (`#EAB308`), White text, Bold, Uppercase, `4px` radius.
- **Secondary Button:** Transparent met Deep Purple border of Soft Lavender fill.
- **Interaction:** Subtiele schaduw (`shadow-lg`) bij hover/active states.

### Kalender & Overlays
- ** Heatmap:** Gebruik 30% transparantie per gebruiker. Waar kleuren overlappen, telt de opacity op voor een visuele verzadiging.
- **User Icons:** Plaats icoontjes van beschikbare gebruikers altijd in de rechterbovenhoek van een datum-cel.

---

## 5. Mobile UX Specifieke Regels
- **Geen Bottom Bar:** Navigatie gebeurt via een Top Bar of directe actieknoppen in de flow.
- **Duim-vriendelijk:** Belangrijke actieknoppen staan onderaan het scherm (Fixed) of centraal in het blikveld.
- **Modals:** Gebruik full-screen of semi-transparante overlays voor "Voeg iets toe" acties om focus te behouden.