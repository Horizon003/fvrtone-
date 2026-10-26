# GitHub upload guide

This ZIP contains the complete source for the **My Favourite One** private interactive love card. It includes the transparent Panda cutout, romantic background track, passcode screen, four mini-games, and all build files.

## Upload to GitHub

1. Create a new GitHub repository.
2. Open the repository and choose **Add file → Upload files**.
3. Upload the extracted ZIP contents, not the ZIP file itself.
4. Commit the files to the `main` branch.

## Deploy on Vercel

Import the GitHub repository into Vercel. The included `vercel.json` sets the install command, build command, and output directory:

- Install: `pnpm install --frozen-lockfile`
- Build: `pnpm build:static`
- Output: `dist/public`

The private card opens only after entering the passcode `150906`. This is a front-end love-card gate, not high-security authentication. After unlocking, the romantic song starts on the first touch/click anywhere on the card; the header button can pause or resume it.

## Local preview

Use Node.js 20+ and run:

```bash
pnpm install
pnpm dev:static
```

Then open `http://localhost:3000`.
