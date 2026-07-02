"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, Loader2, Plus } from "lucide-react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
  toast,
} from "@run402/ui";
import { KeyField } from "./key-field";
import {
  CURRENCIES,
  createProjectSchema,
  type CreateProjectInput,
} from "@/lib/validations/project";
import type { PublicProject } from "@/lib/data/projects";

type CreateResponse = { project: PublicProject; secretKey: string };

export function CreateProjectDialog({
  trigger,
}: {
  trigger?: React.ReactNode;
}) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [reveal, setReveal] = React.useState<CreateResponse | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateProjectInput>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: { currency: "usd", pricePerRequest: 0 },
  });

  const onSubmit = async (values: CreateProjectInput) => {
    const res = await fetch("/api/v1/projects", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!res.ok) {
      const body = (await res.json().catch(() => null)) as
        | { error?: { message?: string } }
        | null;
      toast.error(body?.error?.message ?? "Failed to create project");
      return;
    }

    const data = (await res.json()) as CreateResponse;
    toast.success("Project created");
    reset();
    setReveal(data);
    router.refresh();
  };

  const handleClose = (next: boolean) => {
    setOpen(next);
    if (!next) {
      setReveal(null);
      reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button>
            <Plus className="h-4 w-4" />
            New project
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-md">
        {reveal ? (
          <RevealKeys data={reveal} onDone={() => handleClose(false)} />
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Create a project</DialogTitle>
              <DialogDescription>
                We&apos;ll generate API keys for this project automatically.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              <div className="space-y-1.5">
                <Label htmlFor="name">Project name</Label>
                <Input id="name" placeholder="Weather API" {...register("name")} />
                {errors.name && (
                  <p className="text-xs text-destructive">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="What does this API do?"
                  {...register("description")}
                />
                {errors.description && (
                  <p className="text-xs text-destructive">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="currency">Currency</Label>
                  <Controller
                    control={control}
                    name="currency"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger id="currency">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {CURRENCIES.map((c) => (
                            <SelectItem key={c} value={c}>
                              {c.toUpperCase()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="price">Price / request</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.001"
                    min="0"
                    placeholder="0.005"
                    {...register("pricePerRequest")}
                  />
                  {errors.pricePerRequest && (
                    <p className="text-xs text-destructive">
                      {errors.pricePerRequest.message}
                    </p>
                  )}
                </div>
              </div>

              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="animate-spin" />}
                  Create project
                </Button>
              </DialogFooter>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function RevealKeys({
  data,
  onDone,
}: {
  data: CreateResponse;
  onDone: () => void;
}) {
  return (
    <>
      <DialogHeader>
        <DialogTitle>Save your secret key</DialogTitle>
        <DialogDescription>
          This is the only time we&apos;ll show your secret key.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
        <div className="flex items-start gap-2 rounded-md border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-700 dark:text-amber-400">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          Store this somewhere safe. You won&apos;t be able to view it again.
        </div>
        <KeyField label="Project ID" value={data.project.id} />
        <KeyField label="Publishable key" value={data.project.publishableKey} />
        <KeyField label="Secret key" value={data.secretKey} secret />
      </div>

      <DialogFooter>
        <Button onClick={onDone}>Done</Button>
      </DialogFooter>
    </>
  );
}
