import Link from "next/link";
import {
  Badge,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@run402/ui";
import type { PublicProject } from "@/lib/data/projects";
import { formatDate, formatPrice } from "@/lib/format";

const statusVariant = {
  active: "success",
  paused: "warning",
  archived: "secondary",
} as const;

export function ProjectsTable({ projects }: { projects: PublicProject[] }) {
  return (
    <Card className="overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Name</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Requests</TableHead>
            <TableHead className="text-right">Revenue</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <TableRow key={project.id}>
              <TableCell>
                <Link href={`/projects/${project.id}`} className="group block">
                  <span className="font-medium group-hover:underline">
                    {project.name}
                  </span>
                  <span className="block text-xs text-muted-foreground">
                    {formatPrice(project.pricePerRequest, project.currency)} / request
                  </span>
                </Link>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatDate(project.createdAt)}
              </TableCell>
              <TableCell>
                <Badge variant={statusVariant[project.status]}>{project.status}</Badge>
              </TableCell>
              <TableCell className="text-right tabular-nums text-muted-foreground">
                —
              </TableCell>
              <TableCell className="text-right tabular-nums text-muted-foreground">
                —
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
