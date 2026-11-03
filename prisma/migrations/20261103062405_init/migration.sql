-- CreateEnum
CREATE TYPE "member_status" AS ENUM ('pending', 'confirmed', 'unsubscribed');

-- CreateTable
CREATE TABLE "members" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "first_name" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "address" TEXT NOT NULL DEFAULT '',
    "college" TEXT NOT NULL,
    "matriculation_year" TEXT NOT NULL,
    "alumni_number" TEXT NOT NULL DEFAULT '',
    "notes" TEXT NOT NULL DEFAULT '',
    "status" "member_status" NOT NULL DEFAULT 'pending',
    "consent_data_processing" BOOLEAN NOT NULL,
    "consent_necessary_emails" BOOLEAN NOT NULL,
    "consent_events" BOOLEAN NOT NULL DEFAULT false,
    "consent_share_oxford" BOOLEAN NOT NULL DEFAULT false,
    "consent_share_third_parties" BOOLEAN NOT NULL DEFAULT false,
    "consent_comm_groups" BOOLEAN NOT NULL DEFAULT false,
    "consent_volunteer" BOOLEAN NOT NULL DEFAULT false,
    "consent_text_version" TEXT NOT NULL,
    "confirm_token_hash" TEXT,
    "confirm_expires_at" TIMESTAMPTZ(6),
    "confirmed_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partners" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "first_name" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "company" TEXT NOT NULL DEFAULT '',
    "telephone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "request" TEXT NOT NULL DEFAULT '',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "partners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "consent_log" (
    "id" SERIAL NOT NULL,
    "member_id" UUID NOT NULL,
    "source" TEXT NOT NULL,
    "before" JSONB,
    "after" JSONB NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "consent_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "status_requests" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "member_id" UUID NOT NULL,
    "requested_changes" JSONB NOT NULL,
    "token_hash" TEXT NOT NULL,
    "expires_at" TIMESTAMPTZ(6) NOT NULL,
    "used_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "status_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admins" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "password_hash" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rate_limits" (
    "key" TEXT NOT NULL,
    "window_start" TIMESTAMPTZ(6) NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "rate_limits_pkey" PRIMARY KEY ("key","window_start")
);

-- CreateIndex
CREATE UNIQUE INDEX "members_email_key" ON "members"("email");

-- CreateIndex
CREATE INDEX "members_status_idx" ON "members"("status");

-- CreateIndex
CREATE INDEX "members_confirm_token_hash_idx" ON "members"("confirm_token_hash");

-- CreateIndex
CREATE INDEX "status_requests_token_hash_idx" ON "status_requests"("token_hash");

-- CreateIndex
CREATE UNIQUE INDEX "admins_email_key" ON "admins"("email");

-- AddForeignKey
ALTER TABLE "consent_log" ADD CONSTRAINT "consent_log_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "status_requests" ADD CONSTRAINT "status_requests_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Rules Prisma's schema language cannot express
ALTER TABLE "members" ADD CONSTRAINT members_notes_len CHECK (char_length("notes") <= 500);
ALTER TABLE "members" ADD CONSTRAINT members_required_consents CHECK ("consent_data_processing" AND "consent_necessary_emails");
ALTER TABLE "members" ADD CONSTRAINT members_email_lower CHECK ("email" = lower("email"));
ALTER TABLE "partners" ADD CONSTRAINT partners_request_len CHECK (char_length("request") <= 500);
ALTER TABLE "admins" ADD CONSTRAINT admins_email_lower CHECK ("email" = lower("email"));
