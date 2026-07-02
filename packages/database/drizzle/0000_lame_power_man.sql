CREATE TYPE "public"."environment" AS ENUM('sandbox', 'live');--> statement-breakpoint
CREATE TYPE "public"."http_method" AS ENUM('GET', 'POST', 'PUT', 'PATCH', 'DELETE');--> statement-breakpoint
CREATE TYPE "public"."project_status" AS ENUM('active', 'paused', 'archived');--> statement-breakpoint
CREATE TYPE "public"."endpoint_status" AS ENUM('active', 'disabled');--> statement-breakpoint
CREATE TYPE "public"."api_key_type" AS ENUM('publishable', 'secret');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('pending', 'paid', 'refunded', 'expired');--> statement-breakpoint
CREATE TYPE "public"."token_status" AS ENUM('valid', 'used', 'expired', 'revoked');--> statement-breakpoint
CREATE TABLE "project" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"publishable_key" text NOT NULL,
	"secret_key_hash" text NOT NULL,
	"secret_key_preview" text NOT NULL,
	"currency" text DEFAULT 'usd' NOT NULL,
	"price_per_request" integer DEFAULT 0 NOT NULL,
	"status" "project_status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "project_publishable_key_unique" UNIQUE("publishable_key")
);
--> statement-breakpoint
CREATE TABLE "endpoint" (
	"id" text PRIMARY KEY NOT NULL,
	"project_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"method" "http_method" DEFAULT 'GET' NOT NULL,
	"path" text NOT NULL,
	"price" integer DEFAULT 0 NOT NULL,
	"environment" "environment" DEFAULT 'sandbox' NOT NULL,
	"status" "endpoint_status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "endpoint_project_route_unique" UNIQUE("project_id","method","path","environment")
);
--> statement-breakpoint
CREATE TABLE "api_key" (
	"id" text PRIMARY KEY NOT NULL,
	"project_id" text NOT NULL,
	"type" "api_key_type" NOT NULL,
	"key" text NOT NULL,
	"key_hash" text,
	"environment" "environment" DEFAULT 'sandbox' NOT NULL,
	"last_used" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payment" (
	"id" text PRIMARY KEY NOT NULL,
	"project_id" text NOT NULL,
	"endpoint_id" text NOT NULL,
	"amount" integer NOT NULL,
	"currency" text DEFAULT 'usd' NOT NULL,
	"status" "payment_status" DEFAULT 'pending' NOT NULL,
	"provider" text DEFAULT 'mock' NOT NULL,
	"environment" "environment" DEFAULT 'sandbox' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payment_token" (
	"token" text PRIMARY KEY NOT NULL,
	"project_id" text NOT NULL,
	"endpoint_id" text NOT NULL,
	"payment_id" text NOT NULL,
	"status" "token_status" DEFAULT 'valid' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "request_log" (
	"id" text PRIMARY KEY NOT NULL,
	"project_id" text NOT NULL,
	"endpoint_id" text,
	"method" text NOT NULL,
	"path" text NOT NULL,
	"status_code" integer NOT NULL,
	"payment_status" text NOT NULL,
	"environment" "environment" DEFAULT 'sandbox' NOT NULL,
	"duration_ms" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "endpoint" ADD CONSTRAINT "endpoint_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "api_key" ADD CONSTRAINT "api_key_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment" ADD CONSTRAINT "payment_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment" ADD CONSTRAINT "payment_endpoint_id_endpoint_id_fk" FOREIGN KEY ("endpoint_id") REFERENCES "public"."endpoint"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_token" ADD CONSTRAINT "payment_token_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_token" ADD CONSTRAINT "payment_token_endpoint_id_endpoint_id_fk" FOREIGN KEY ("endpoint_id") REFERENCES "public"."endpoint"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_token" ADD CONSTRAINT "payment_token_payment_id_payment_id_fk" FOREIGN KEY ("payment_id") REFERENCES "public"."payment"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "request_log" ADD CONSTRAINT "request_log_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "request_log" ADD CONSTRAINT "request_log_endpoint_id_endpoint_id_fk" FOREIGN KEY ("endpoint_id") REFERENCES "public"."endpoint"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "project_user_idx" ON "project" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "endpoint_project_idx" ON "endpoint" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "api_key_project_idx" ON "api_key" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "payment_project_idx" ON "payment" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "payment_token_endpoint_idx" ON "payment_token" USING btree ("endpoint_id");--> statement-breakpoint
CREATE INDEX "request_log_project_idx" ON "request_log" USING btree ("project_id","created_at");