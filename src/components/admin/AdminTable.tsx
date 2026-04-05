import Link from "next/link";
import { DeleteButton } from "@/components/admin/DeleteButton";

export interface AdminTableColumn<T> {
  header: string;
  render: (row: T) => React.ReactNode;
}

interface AdminTableProps<T extends { id: string }> {
  columns: AdminTableColumn<T>[];
  rows: T[];
  editHref: (row: T) => string;
  deleteAction: (formData: FormData) => Promise<void>;
  newHref: string;
  emptyMessage?: string;
}

export function AdminTable<T extends { id: string }>({
  columns,
  rows,
  editHref,
  deleteAction,
  newHref,
  emptyMessage = "No items yet.",
}: AdminTableProps<T>) {
  return (
    <div>
      <div className="flex justify-end mb-6">
        <Link
          href={newHref}
          className="bg-amber text-bg-deep font-label text-[0.7rem] font-semibold tracking-[0.18em] uppercase px-5 py-2.5 transition-opacity hover:opacity-80 no-underline"
        >
          + New
        </Link>
      </div>

      {rows.length === 0 ? (
        <p className="text-cream-dim font-body text-sm">{emptyMessage}</p>
      ) : (
        <div className="border border-border overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-bg-raised border-b border-border">
                {columns.map((col) => (
                  <th
                    key={col.header}
                    className="text-left px-4 py-3 font-label text-[0.7rem] tracking-[0.2em] uppercase text-cream-dim"
                  >
                    {col.header}
                  </th>
                ))}
                <th className="px-4 py-3 font-label text-[0.7rem] tracking-[0.2em] uppercase text-cream-dim text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={row.id}
                  className={`border-b border-border last:border-0 ${
                    i % 2 === 0 ? "bg-bg-surface" : "bg-bg-deep"
                  }`}
                >
                  {columns.map((col) => (
                    <td
                      key={col.header}
                      className="px-4 py-3 text-[0.85rem] text-cream font-body"
                    >
                      {col.render(row)}
                    </td>
                  ))}
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-4">
                      <Link
                        href={editHref(row)}
                        className="font-label text-[0.75rem] tracking-[0.15em] uppercase text-teal-light hover:text-cream transition-colors no-underline"
                      >
                        Edit
                      </Link>
                      <DeleteButton id={row.id} deleteAction={deleteAction} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
