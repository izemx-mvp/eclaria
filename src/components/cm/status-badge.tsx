import { Badge } from "@/components/ui/badge";
import { toneFor, type PostStatut } from "@/lib/cm-store";

export function StatusBadge({ statut }: { statut: PostStatut }) {
  return (
    <Badge variant="outline" className={`${toneFor(statut)} gap-1.5`}>
      {statut === "Brouillon" && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {statut}
    </Badge>
  );
}
