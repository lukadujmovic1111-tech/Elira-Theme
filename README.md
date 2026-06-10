# ELIRA STUDIO — Premium Shopify Theme

Maßgeschneidertes Online Store 2.0 Theme für **Elira** — hochwertige Damen-Activewear
für Yoga, Pilates, Fitness und einen aktiven Lifestyle.

Designphilosophie: warm-minimalistisch, viel Weißraum, ruhige Typografie (Archivo +
Cormorant-Akzente), Pill-Buttons, dezente Mikro-Animationen — Premium-Feel auf dem
Niveau führender Athleisure-DTC-Brands, aber als eigenständige Marke.

---

## Struktur

```
assets/        base.css (Designsystem) · elira.js (Cart, Variant-Picker, Suche, Animationen)
config/        settings_schema.json · settings_data.json
layout/        theme.liquid · password.liquid
locales/       de.default.json · en.json
sections/      Header, Footer, Hero, Bestseller, Kategorien, USPs, Reviews, Community, PDP, …
snippets/      product-card, price, icon, color-swatch, pagination, …
templates/     JSON-Templates (OS 2.0) + customers/ + gift_card.liquid
```

## Features

**Startseite** — Hero (Vollbild, LCP-optimiert), Marquee, Bestseller-Slider,
Kategorie-Grid, Lifestyle-Split-Banner, USP-Sektion, Editorial-Banner, Neuheiten,
Kundenbewertungen, Instagram/Community-Galerie, Newsletter (10 %-Incentive).

**Produktseite** — Galerie (mobil Swipe-Carousel, Desktop Editorial-Grid),
Farb-Swatches mit 40+ Farb-Mapping (DE/EN), Größen-Pills mit
Verfügbarkeits-Anzeige, Größentabellen-Modal, Sticky Add-to-Cart, Low-Stock-Hinweis,
Trust-Leiste, Akkordeons (Beschreibung/Material/Versand), "Mach den Look komplett"
(Recommendations API), Bewertungs-Sterne via `reviews.rating` Metafelder.

**Conversion** — AJAX-Cart-Drawer mit Gratisversand-Fortschrittsbalken & Upsells
("Dazu passt"), Quick-Add auf Produktkarten (inkl. Größenwahl bei 1-Options-Produkten),
Predictive Search, Sale-Badges mit Prozent, Announcement-Rotation.

**Technik** — Mobile-first, ein CSS- + ein JS-File (Vanilla, defer), responsive
Bilder mit `srcset`, Lazy Loading, `fetchpriority=high` für Hero/PDP-Bild,
Section Rendering API für Cart-Updates, Storefront-Filter & Sortierung,
Reveal-Animationen mit `IntersectionObserver` (respektiert `prefers-reduced-motion`),
Onboarding-Platzhalter (Theme sieht auch ohne Inhalte fertig aus).

---

## Installation

### Variante A — Shopify GitHub-Integration (empfohlen)
1. Shopify Admin → **Onlineshop → Themes → Theme hinzufügen → Aus GitHub verbinden**
2. Dieses Repository + Branch wählen — fertig. Pushes deployen automatisch.

### Variante B — Shopify CLI
```bash
npm install -g @shopify/cli @shopify/theme
shopify theme dev --store dein-store.myshopify.com    # Live-Preview
shopify theme push                                     # Hochladen
```

## Einrichtung nach der Installation (≈ 15 Min.)

1. **Navigation** (Admin → Onlineshop → Navigation)
   - `main-menu`: z. B. *Shop* (mit Unterpunkten Leggings, Sport-BHs, Shorts, Sets, Kleider),
     *Yoga*, *Pilates*, *Über Elira*, *Sale* — Unterpunkte erzeugen automatisch das Mega-Menü.
   - `footer`: Versand, Rückgaben, Größentabelle, FAQ, Kontakt, Impressum.

2. **Kollektionen anlegen** und im Theme-Editor zuweisen:
   Bestseller, Neuheiten, Leggings, Yoga, Pilates, Sets, Sport-BHs, Kleider, Sale.
   (Hero-Buttons, Bestseller-/Neuheiten-Slider und Kategorie-Kacheln im Editor verknüpfen.)

3. **Theme-Einstellungen** (Editor → ⚙️): Logo, Farben, Gratisversand-Schwelle,
   Social-Links, Upsell-Kollektion für den Cart-Drawer.

4. **Bilder hochladen**: Hero (2400×1350 + mobil 1100×1600), Kategorie-Kacheln (900×1200),
   Lifestyle-Banner (2400×1200), Community-Quadrate (800×800).

5. **Seiten anlegen**: Größentabelle (im PDP-Block "Variantenauswahl" verknüpfen),
   Kontakt (Template `page.contact`), Über uns, FAQ, Versand, Rückgaben.

6. **Produkt-Tags** für Badges: `Neu` bzw. `Bestseller`.
   Optionen heißen idealerweise **Farbe** und **Größe** (Color/Size funktioniert ebenfalls).

## Anpassung

- **Farben/Typo**: CSS-Tokens in `assets/base.css` (`:root`) bzw. Theme-Einstellungen.
- **Neue Sektionen**: Jede Sektion hat Presets und ist im Editor frei kombinierbar.
- **Bewertungs-Apps**: Produkt-Blöcke unterstützen App-Blöcke (`@app`).
