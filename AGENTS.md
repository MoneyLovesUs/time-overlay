<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Production release

- Production uses `pnpm release:solo`: build locally in linux/amd64 Docker,
  then upload `.vercel/output` with `vercel deploy --prebuilt --prod`.
- Git automatic deployments are disabled for every branch in `vercel.json`.
  Merging/pushing code is not a production release. Do not use Dashboard
  Redeploy, ordinary `vercel --prod`, or any remote-build fallback.
- `pnpm release:solo --build-only` validates a clean committed branch without
  deploying. Actual production release requires clean main equal to origin/main.
- Read `docs/deploy/local-prebuilt-release.md` before releasing. Credentials
  stay in Vercel/runtime or owner-only files outside the repository; never print
  values, commit environment files, or upload them as source.
- Verify deployment metadata, production target, canonical aliases and smoke
  results. Roll back by promoting an already verified deployment.
