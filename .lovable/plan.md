

# Reclassify 2 Exercises: Mobilidade → Drenagem

## What

Update `movement_type` from `'Mobilidade'` to `'Drenagem'` for two pain-10 exercises:
1. **Rotação de Tornozelos** (id: `4895639f-a129-49cd-b0b6-172c36eafa85`)
2. **Flexão e Extensão dos Pés** (id: `2eb21447-b830-4fc1-bc6e-44634cde5140`)

## How

Two SQL UPDATE statements via the database insert tool:

```sql
UPDATE exercises SET movement_type = 'Drenagem' WHERE id = '4895639f-a129-49cd-b0b6-172c36eafa85';
UPDATE exercises SET movement_type = 'Drenagem' WHERE id = '2eb21447-b830-4fc1-bc6e-44634cde5140';
```

## Verification

After updates, confirm both rows show `movement_type = 'Drenagem'`.

No code changes needed — this is a data-only fix.

