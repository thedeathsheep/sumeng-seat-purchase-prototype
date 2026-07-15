# Team Seat Purchase Prototype

Clickable Sumeng team-seat purchase prototype for product and engineering review.

## Live Preview

https://thedeathsheep.github.io/sumeng-seat-purchase-prototype/

## Preview

```text
http://127.0.0.1:4173/
```

## Run

```powershell
npm install
npm run dev -- --host 127.0.0.1 --port 4173
```

Build the GitHub Pages version with:

```powershell
npm run build:pages
```

## Review Flow

1. Use the monthly/annual segmented control to review pricing units.
2. Click `加购席位` and change the number of added seats.
3. Review the prorated amount, prorated credits, and next renewal.
4. Select WeChat or Alipay and complete the mock payment.
5. Use the top-right scenario switch to review the downgrade over-limit state.

## Product Documents

- `../docs/product/team-system/team-seat-purchase-prd-v1.1.md`
- `../docs/product/team-system/team-seat-purchase-decision-table-v1.1.md`
- `../docs/superpowers/specs/2026-07-15-team-seat-purchase-design.md`
- `design-qa.md`
