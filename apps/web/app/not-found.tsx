import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[80vh] items-center overflow-hidden">
      <div className="pointer-events-none absolute inset-0 grid-bg [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black,transparent)]" />
      <div className="container-edge relative text-center">
        <p className="font-mono text-sm text-muted-foreground">
          HTTP 404 · Not Found
        </p>
        <h1 className="mt-4 text-8xl font-semibold tracking-[-0.04em] sm:text-9xl">
          404
        </h1>
        <p className="mx-auto mt-4 max-w-md text-pretty text-lg text-muted-foreground">
          This route isn’t protected — because it doesn’t exist. Let’s get you
          back to something that pays.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              Back home
            </Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link href="/docs">
              <BookOpen className="h-4 w-4" />
              Read the docs
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
