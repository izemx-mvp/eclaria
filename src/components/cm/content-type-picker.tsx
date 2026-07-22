import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sparkles, Instagram, FileText } from "lucide-react";

export function ContentTypePicker({
  open,
  onOpenChange,
  onPick,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onPick: (kind: "post" | "article") => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[color:var(--gold)]" />
            Que voulez-vous créer ?
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3 mt-2">
          <button
            onClick={() => { onPick("post"); onOpenChange(false); }}
            className="stat-primary rounded-xl p-5 text-left border hover:brightness-105 transition"
          >
            <Instagram className="h-6 w-6 text-pink-600 mb-2" />
            <div className="font-semibold">Post réseaux sociaux</div>
            <div className="text-xs opacity-80 mt-1">Multi-médias, drag & drop, publication multi-plateformes.</div>
          </button>
          <button
            onClick={() => { onPick("article"); onOpenChange(false); }}
            className="stat-gold rounded-xl p-5 text-left border hover:brightness-105 transition"
          >
            <FileText className="h-6 w-6 text-[color:var(--gold)] mb-2" />
            <div className="font-semibold">Article de blog</div>
            <div className="text-xs opacity-80 mt-1">Génération IA long format, SEO, couverture, preview complet.</div>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
