# PlateStack

A React + Vite barbell plate calculator with kg and lbs support.

## Features

- Toggle between kilograms and pounds
- Enter a target weight and display plates per side
- Add custom plates manually
- Use specialty bar settings (technique, standard, squat, custom)
- Save preferences locally in the browser
- Premium features include warmup builder and percentage calculator

## Local development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the dev server:
   ```bash
   npm run dev
   ```
3. Build for production:
   ```bash
   npm run build
   ```

## Notes

- `@supabase/supabase-js` was removed because it was not used in the app.
- `platestack-main/`, `dist/`, and `.vite/` are cleanup artifacts and should not be part of source control.
