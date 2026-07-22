import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const PAGE_SIZE = 8;

export function usePagedSlice<T>(items: T[], page: number, pageSize: number = PAGE_SIZE) {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * pageSize;
  return {
    slice: items.slice(start, start + pageSize),
    totalPages,
    safePage,
    start,
    end: Math.min(start + pageSize, items.length),
    total: items.length,
  };
}

export function DataPagination({
  page,
  totalPages,
  onPageChange,
  start,
  end,
  total,
  itemLabel = "résultats",
}: {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
  start: number;
  end: number;
  total: number;
  itemLabel?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 px-1 text-sm text-muted-foreground">
      <div>
        {total === 0 ? "Aucun" : `${start + 1}–${end} sur ${total}`} {itemLabel}
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page <= 1}
        >
          <ChevronLeft className="h-4 w-4" />
          Précédent
        </Button>
        <span className="tabular-nums text-foreground">
          {page} / {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page >= totalPages}
        >
          Suivant
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
