-- Additive, idempotent migration for the existing database (no data is removed).
-- Apply before deploying the regenerated Prisma client.
ALTER TABLE "User"
  ADD COLUMN IF NOT EXISTS "welcomeEmailQueuedAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "welcomeEmailId" TEXT;

ALTER TABLE "NewsletterSubscriber"
  ADD COLUMN IF NOT EXISTS "confirmationVersion" TEXT,
  ADD COLUMN IF NOT EXISTS "confirmationExpiresAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "confirmationEmailQueuedAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "confirmationEmailId" TEXT;
