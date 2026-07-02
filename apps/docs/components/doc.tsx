export function DocHeader({
  title,
  lead,
}: {
  title: string;
  lead?: string;
}) {
  return (
    <header className="mb-8">
      <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
      {lead && <p className="mt-3 text-lg text-muted-foreground">{lead}</p>}
    </header>
  );
}

export function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-10">
      <h2 className="mb-3 text-xl font-semibold tracking-tight">{title}</h2>
      <div className="space-y-3 text-[15px] leading-relaxed text-muted-foreground">
        {children}
      </div>
    </section>
  );
}

export function RefTable({
  head,
  rows,
}: {
  head: string[];
  rows: React.ReactNode[][];
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead className="border-b border-border bg-muted/40">
          <tr>
            {head.map((h) => (
              <th key={h} className="px-4 py-2 text-left font-medium text-muted-foreground">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-2 align-top text-foreground/90">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
