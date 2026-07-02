"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import type { Endpoint } from "@run402/database";
import {
  HTTP_METHODS,
  createEndpointSchema,
  type CreateEndpointInput,
} from "@/lib/validations/endpoint";
import { microsToDollars } from "@/lib/format";

export function EndpointDialog({
  projectId,
  endpoint,
  open,
  onOpenChange,
}: {
  projectId: string;
  endpoint: Endpoint | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const isEdit = Boolean(endpoint);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateEndpointInput>({
    resolver: zodResolver(createEndpointSchema),
    defaultValues: {
      method: "GET",
      path: "",
      name: "",
      description: "",
      price: 0,
      environment: "sandbox",
    },
  });

  // Reset the form whenever the dialog opens (create vs edit).
  React.useEffect(() => {
    if (!open) return;
    reset({
      name: endpoint?.name ?? "",
      description: endpoint?.description ?? "",
      method: endpoint?.method ?? "GET",
      path: endpoint?.path ?? "",
      price: endpoint ? microsToDollars(endpoint.price) : 0,
      environment: endpoint?.environment ?? "sandbox",
    });
  }, [open, endpoint, reset]);

  const onSubmit = async (values: CreateEndpointInput) => {
    const url = isEdit
      ? `/api/v1/projects/${projectId}/endpoints/${endpoint!.id}`
      : `/api/v1/projects/${projectId}/endpoints`;
    const res = await fetch(url, {
      method: isEdit ? "PATCH" : "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(values),
    });
    if (!res.ok) {
      const body = (await res.json().catch(() => null)) as
        | { error?: { message?: string } }
        | null;
      toast.error(body?.error?.message ?? "Failed to save endpoint");
      return;
    }
    toast.success(isEdit ? "Endpoint updated" : "Endpoint created");
    onOpenChange(false);
    router.refresh();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit endpoint" : "New endpoint"}</DialogTitle>
          <DialogDescription>
            Register a route to protect. Method + route must be unique per
            environment.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="ep-name">Name</Label>
            <Input id="ep-name" placeholder="Premium data" {...register("name")} />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-[130px_minmax(0,1fr)] gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="ep-method">Method</Label>
              <Controller
                control={control}
                name="method"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="ep-method">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {HTTP_METHODS.map((m) => (
                        <SelectItem key={m} value={m}>
                          {m}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ep-path">Route</Label>
              <Input id="ep-path" placeholder="/api/premium" className="font-mono" {...register("path")} />
              {errors.path && (
                <p className="text-xs text-destructive">{errors.path.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="ep-price">Price / request</Label>
              <Input id="ep-price" type="number" step="0.001" min="0" placeholder="0.005" {...register("price")} />
              {errors.price && (
                <p className="text-xs text-destructive">{errors.price.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ep-env">Environment</Label>
              <Controller
                control={control}
                name="environment"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="ep-env">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sandbox">Sandbox</SelectItem>
                      <SelectItem value="live" disabled>
                        Live (coming soon)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ep-desc">Description (optional)</Label>
            <Textarea id="ep-desc" placeholder="What does this endpoint return?" {...register("description")} />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="animate-spin" />}
              {isEdit ? "Save changes" : "Create endpoint"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
