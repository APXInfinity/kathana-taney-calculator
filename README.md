# Kathana Taney Calculator

Fan-made Taney and in-game Rupiah calculator for Kathana Online.

## Public site

https://apxinfinity.github.io/kathana-taney-calculator/

## Features

- Taney pack comparison (420, 860, 1,750, 2,640 and 4,000 Taney)
- Live USD-based exchange rates with offline fallback and optional manual conversion rate
- **Player market prices:** enter the current listed Taney asking price for each in-game Rupiah bundle: **5M, 10M, 20M and 50M**
- Bundle prices are entered separately; no longer assumes a fixed 185 Taney / 5M exchange
- Editable prices persist via the visitor's browser localStorage; blank bundles are excluded
- For requested Rupiah amounts in multiples of 5M, the calculator finds the **cheapest exact combination** of priced bundles, rather than extrapolating from one bundle
- Market comparison shows each bundle's Taney cost per 1M Rupiah
- Multiple-currency comparison including PHP, IDR, BRL, CNY, KRW and AED
- Responsive single-page interface

## How to use the player market calculator

1. Look up Rupiah bundle prices listed by players inside Kathana.
2. Enter the asking prices in Taney under **Player-listed Rupiah prices**. Leave any unknown price blank.
3. Click **Save current prices**. Your values are retained on that browser/device.
4. Enter the desired Rupiah amount (5M increments) to see the cheapest combination and its estimated local-currency value.

**Privacy and data accuracy:** These are manual, visitor-entered prices stored only in that visitor's browser. They are not shared with other visitors, verified by the site, or automatically retrieved from live player listings. Clearing website storage also clears saved prices. No default player prices are included. To add a community-wide public price feed later, a backend/service and moderation controls are required.

## Notes

In-game Rupiah is a Kathana currency. It is not Indonesian rupiah (IDR). Taney pack conversions are estimates and actual checkout prices may vary with taxes, regional prices, bank/card fees and foreign exchange rates.
