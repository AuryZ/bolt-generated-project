# Deployment Documentation

## Build Process
1.  Set the required environment variables.
2.  Run `npm run build` to create a production-ready build.
3.  The output will be in the `dist` directory.

## Environment Variables
-   `VITE_SUPABASE_URL`: The URL of the Supabase project.
-   `VITE_SUPABASE_ANON_KEY`: The anonymous key for the Supabase project.

## Deployment Steps
1.  Deploy the contents of the `dist` directory to a static hosting service (e.g., Netlify, Vercel, GitHub Pages).
2.  Configure the hosting service to serve the `index.html` file for all routes to enable client-side routing.

## Performance Considerations
-   Enable caching for static assets.
-   Use a CDN for media files.
-   Enable compression (e.g., Gzip or Brotli).
-   Set appropriate cache headers.

## Monitoring
-   Monitor API usage.
-   Track error rates.
-   Monitor performance metrics.
-   Set up alerts for critical issues.
