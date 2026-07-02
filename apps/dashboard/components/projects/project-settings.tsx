"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
import type { PublicProject } from "@/lib/data/projects";
import {
  CURRENCIES,
  updateProjectSchema,
  type UpdateProjectInput,
} from "@/lib/validations/project";
import { microsToDollars } from "@/lib/format";

export function ProjectSettings({ project }: { project: PublicProject }) {
  const router = useRouter();
  const [confirmText, setConfirmText] = React.useState("");
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<UpdateProjectInput>({
    resolver: zodResolver(updateProjectSchema),
    defaultValues: {
      name: project.name,
      description: project.description ?? "",
      currency: project.currency as UpdateProjectInput["currency"],
      pricePerRequest: microsToDollars(project.pricePerRequest),
    },
  });

  const onSubmit = async (values: UpdateProjectInput) => {
    const res = await fetch(`/api/v1/projects/${project.id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(values),
    });
    if (!res.ok) {
      toast.error("Failed to save settings");
      return;
    }
    toast.success("Settings saved");
    router.refresh();
  };

  const onDelete = async () => {
    setDeleting(true);
    const res = await fetch(`/api/v1/projects/${project.id}`, { method: "DELETE" });
    if (!res.ok) {
      setDeleting(false);
      toast.error("Failed to delete project");
      return;
    }
    toast.success("Project deleted");
    router.push("/projects");
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">General</CardTitle>
          <CardDescription>Update your project details and pricing.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div className="space-y-1.5">
              <Label htmlFor="name">Project name</Label>
              <Input id="name" {...register("name")} />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" {...register("description")} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="currency">Default currency</Label>
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
                <Input id="price" type="number" step="0.001" min="0" {...register("pricePerRequest")} />
                {errors.pricePerRequest && (
                  <p className="text-xs text-destructive">
                    {errors.pricePerRequest.message}
                  </p>
                )}
              </div>
            </div>
            <Button type="submit" disabled={isSubmitting || !isDirty}>
              {isSubmitting && <Loader2 className="animate-spin" />}
              Save changes
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle className="text-base text-destructive">Danger zone</CardTitle>
          <CardDescription>
            Deleting a project removes its endpoints and keys permanently.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            This action cannot be undone.
          </p>
          <Button variant="destructive" onClick={() => setDeleteOpen(true)}>
            Delete project
          </Button>
        </CardContent>
      </Card>

      <AlertDialog
        open={deleteOpen}
        onOpenChange={(o) => {
          setDeleteOpen(o);
          if (!o) setConfirmText("");
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete “{project.name}”?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently deletes the project, its endpoints, and API keys.
              Type <strong>{project.name}</strong> to confirm.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Input
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder={project.name}
            aria-label="Type project name to confirm"
          />
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={confirmText !== project.name || deleting}
              onClick={onDelete}
            >
              {deleting && <Loader2 className="h-4 w-4 animate-spin" />}
              Delete project
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
