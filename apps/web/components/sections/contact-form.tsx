"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Status = "idle" | "submitting" | "done";

const inputCls =
  "h-11 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground/40 focus:ring-2 focus:ring-ring/15";

export function ContactForm() {
  const [status, setStatus] = React.useState<Status>("idle");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (status !== "idle") return;
    setStatus("submitting");
    // Simulated submission — wire to your backend / email provider.
    setTimeout(() => setStatus("done"), 1200);
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-soft sm:p-8">
      <AnimatePresence mode="wait">
        {status === "done" ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
              <Check className="h-6 w-6" />
            </div>
            <h3 className="mt-5 text-lg font-semibold">Message sent</h3>
            <p className="mt-2 max-w-xs text-sm text-muted-foreground">
              Thanks for reaching out — we’ll get back to you within one business
              day.
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={onSubmit}
            className="space-y-4"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label htmlFor="name" className="text-sm font-medium">
                  Name
                </label>
                <input id="name" name="name" required placeholder="Ada Lovelace" className={inputCls} />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-sm font-medium">
                  Work email
                </label>
                <input id="email" name="email" type="email" required placeholder="ada@company.com" className={inputCls} />
              </div>
            </div>
            <div className="space-y-1.5">
              <label htmlFor="company" className="text-sm font-medium">
                Company
              </label>
              <input id="company" name="company" placeholder="Acme, Inc." className={inputCls} />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="message" className="text-sm font-medium">
                How can we help?
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                placeholder="Tell us about your API and what you’d like to charge for…"
                className={cn(inputCls, "h-auto resize-none py-3")}
              />
            </div>
            <Button type="submit" size="lg" className="w-full" disabled={status === "submitting"}>
              {status === "submitting" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Sending…
                </>
              ) : (
                <>
                  Send message <Send className="h-4 w-4" />
                </>
              )}
            </Button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
