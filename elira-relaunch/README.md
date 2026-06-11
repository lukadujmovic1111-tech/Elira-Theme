# ELIRA — Soft Performance · Shopify Theme

Kompletter Marken-Relaunch für **Elira**. Eigenständiges Online Store 2.0 Theme,
eng an der Referenz **Exercere** (Broadcast-Ästhetik): Schwarz-Weiß-UI mit Farbfotos,
**Archivo**-Typografie ohne Letter-Spacing, kleine ruhige Buttons, enge Sections,
Fullscreen-Bricks mit kleinem zentriertem Text, transparenter Header über dem Hero.

## Highlights

- **Online Store 2.0** — JSON-Templates, Section Groups, alles im Theme-Editor anpassbar
- **Kompakte Homepage (Exercere-Aufbau)**: Fullscreen-Hero (Bild/Video) → Produkt-Carousel → Editorial-Bricks (halbe Breite) → Kollektions-Brick (volle Breite) → Shop by Activity → Shop by Category → Community-Grid → Newsletter
- **Bricks-Section**: große Bild-/Video-Banner (volle/halbe Breite) mit kleinem zentriertem Titel + Button — für Kampagnen, Kollektionen, Pop-Ups
- **Transparenter Header** über dem Hero, wird beim Scrollen fest & weiß
- **AJAX-Warenkorb** mit Slide-in Drawer, Gratisversand-Fortschritt & Section Rendering API
- **Quick add** auf der Produktkarte (Größen-Pills bzw. Direkt-Add), Hover-Bildwechsel
- **PDP** mit Sticky-Buy-Box, Varianten-Picker (Swatches + Größen-Pills), Accordions, Produkt-Empfehlungen
- **Kollektionsseite** mit Sortierung, Filter-Drawer (Shopify-Facets) und Pagination
- **Suche, 404, Blog/Journal, Kollektionsliste, komplettes Kundenkonto** (Login, Registrierung, Bestellungen, Adressen)
- Deutsche Standardtexte; Mobile-first; A11y-Basics (Skip-Link, ARIA-Labels, Fokus-Zustände)

## Installation

### Variante A — ZIP-Upload (am einfachsten)
1. Den Ordner `elira-relaunch/` als ZIP packen (die Theme-Ordner `assets/`, `config/`, `layout/`, `locales/`, `sections/`, `snippets/`, `templates/` müssen auf oberster Ebene der ZIP liegen).
2. Shopify Admin → **Onlineshop → Themes → Theme hinzufügen → ZIP-Datei hochladen**.
3. Theme **als Vorschau ansehen** und anschließend **veröffentlichen**.

### Variante B — Shopify CLI
```bash
cd elira-relaunch
shopify theme push --store DEIN-STORE.myshopify.com --unpublished
```

## Nach der Installation (5 Minuten)

1. **Navigation**: Unter *Inhalte → Menüs* das Hauptmenü pflegen (z. B. „New In, Bestseller, Shop, Kollektionen, Sale“). Untermenüs erzeugen automatisch das Mega-Menü.
2. **Kollektionen verknüpfen**: Im Theme-Editor bei „Produkt-Carousel“, „Kollektions-Showcase“ und den „Shop-by“-Kacheln die echten Kollektionen auswählen.
3. **Bilder ersetzen**: Alle Sections zeigen ohne eigene Bilder automatisch passende Platzhalter (Unsplash). Eigene Bilder einfach im Theme-Editor hochladen — die Platzhalter verschwinden dann.
4. **Branding**: Theme-Einstellungen → *Branding / Farben / Social Media* prüfen.
5. **Newsletter** nutzt das Shopify-Kundenformular (Tag `newsletter`) — funktioniert ohne App, kompatibel mit Shopify Email & Klarna/Klaviyo-Flows.

## Struktur

```
elira-relaunch/
├── assets/          theme.css (Design-System) · theme.js (Interaktionen, AJAX-Cart)
├── config/          settings_schema.json · settings_data.json
├── layout/          theme.liquid
├── locales/         de.default.json
├── sections/        Header, Footer, Hero, Carousel, Showcases, PDP, Collection, …
├── snippets/        product-card, price, color-swatch-style, cookie-banner
└── templates/       JSON-Templates + Kundenkonto (Liquid)
```

Brand-Guidelines: siehe [`BRANDING.md`](./BRANDING.md).
