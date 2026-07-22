import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import {
  CheckCircle2, XCircle, Plus, Trash2, Pencil, Search,
  Instagram, Facebook, MessageCircle, Music2,
} from "lucide-react";

export const Route = createFileRoute("/parametres")({
  component: ParametresPage,
});

type Role = "Administrateur" | "Éditeur" | "Lecture seule";
interface Utilisateur {
  id: string;
  nom: string;
  email: string;
  role: Role;
}

const canaux = [
  { nom: "WhatsApp Business", icon: MessageCircle, connecte: true },
  { nom: "Instagram", icon: Instagram, connecte: true },
  { nom: "Facebook", icon: Facebook, connecte: true },
  { nom: "TikTok", icon: Music2, connecte: false },
];

function ParametresPage() {
  const [nomBoutique, setNomBoutique] = useState("Eclaria Parapharmacie");
  const [catalogue, setCatalogue] = useState("Catalogue Odoo (connecté)");
  const [canauxState, setCanauxState] = useState(canaux);
  const [users, setUsers] = useState<Utilisateur[]>([
    { id: "1", nom: "Sarah Larbi", email: "sarah@eclaria.dz", role: "Administrateur" },
    { id: "2", nom: "Yanis Bensalah", email: "yanis@eclaria.dz", role: "Éditeur" },
    { id: "3", nom: "Lina Mansouri", email: "lina@eclaria.dz", role: "Lecture seule" },
    { id: "4", nom: "Karim Ould", email: "karim@eclaria.dz", role: "Éditeur" },
    { id: "5", nom: "Nora Benhamed", email: "nora@eclaria.dz", role: "Administrateur" },
  ]);
  const [search, setSearch] = useState("");
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<Utilisateur | null>(null);
  const [toDelete, setToDelete] = useState<Utilisateur | null>(null);

  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) => u.nom.toLowerCase().includes(q) || u.email.toLowerCase().includes(q),
    );
  }, [users, search]);

  const toggleCanal = (nom: string) => {
    setCanauxState((cs) => cs.map((c) => (c.nom === nom ? { ...c, connecte: !c.connecte } : c)));
    const c = canauxState.find((x) => x.nom === nom);
    toast.success(`Canal ${nom} ${c?.connecte ? "déconnecté" : "connecté"}`);
  };

  return (
    <>
      <PageHeader title="Paramètres" description="Configuration de la boutique et des accès" />
      <div className="flex-1 space-y-6 p-4 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Informations générales</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Nom de la boutique</Label>
              <Input value={nomBoutique} onChange={(e) => setNomBoutique(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label>Catalogue produits</Label>
              <Input value={catalogue} onChange={(e) => setCatalogue(e.target.value)} className="mt-1" />
            </div>
            <div className="sm:col-span-2 flex justify-end">
              <Button onClick={() => toast.success("Informations enregistrées")}>Enregistrer</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Canaux connectés</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {canauxState.map((c) => (
              <div key={c.nom} className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                    <c.icon className="h-5 w-5 text-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{c.nom}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {c.connecte ? (
                        <><CheckCircle2 className="h-3.5 w-3.5 text-primary" /><span className="text-xs text-primary">Connecté</span></>
                      ) : (
                        <><XCircle className="h-3.5 w-3.5 text-muted-foreground" /><span className="text-xs text-muted-foreground">Non connecté</span></>
                      )}
                    </div>
                  </div>
                </div>
                <Button variant={c.connecte ? "outline" : "default"} size="sm" onClick={() => toggleCanal(c.nom)}>
                  {c.connecte ? "Déconnecter" : "Connecter"}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <CardTitle className="text-base">Utilisateurs internes</CardTitle>
              <Button size="sm" onClick={() => setCreating(true)}>
                <Plus className="h-4 w-4 mr-1" /> Ajouter un utilisateur
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un utilisateur…"
                value={search} onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      Aucun utilisateur trouvé.
                    </TableCell>
                  </TableRow>
                )}
                {filteredUsers.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">{u.nom}</TableCell>
                    <TableCell className="text-muted-foreground">{u.email}</TableCell>
                    <TableCell><Badge variant="secondary">{u.role}</Badge></TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => setEditing(u)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setToDelete(u)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <UserDialog
        open={creating || !!editing}
        initial={editing}
        onClose={() => { setCreating(false); setEditing(null); }}
        onSave={(u) => {
          if (editing) {
            setUsers((us) => us.map((x) => (x.id === u.id ? u : x)));
            toast.success("Utilisateur modifié");
          } else {
            setUsers((us) => [...us, { ...u, id: Date.now().toString() }]);
            toast.success("Utilisateur ajouté");
          }
          setCreating(false); setEditing(null);
        }}
      />

      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Retirer l'utilisateur ?</AlertDialogTitle>
            <AlertDialogDescription>
              {toDelete && `${toDelete.nom} n'aura plus accès à l'interface Eclaria.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (toDelete) {
                  setUsers((u) => u.filter((x) => x.id !== toDelete.id));
                  toast.success("Utilisateur retiré");
                }
                setToDelete(null);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Retirer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function UserDialog({
  open, initial, onClose, onSave,
}: {
  open: boolean;
  initial: Utilisateur | null;
  onClose: () => void;
  onSave: (u: Utilisateur) => void;
}) {
  const [nom, setNom] = useState(initial?.nom ?? "");
  const [email, setEmail] = useState(initial?.email ?? "");
  const [role, setRole] = useState<Role>(initial?.role ?? "Éditeur");

  // Sync when opening on a new item
  useMemo(() => {
    setNom(initial?.nom ?? "");
    setEmail(initial?.email ?? "");
    setRole(initial?.role ?? "Éditeur");
  }, [initial, open]);

  const submit = () => {
    if (!nom.trim() || !email.trim()) {
      toast.error("Nom et email requis");
      return;
    }
    onSave({ id: initial?.id ?? "", nom, email, role });
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{initial ? "Modifier l'utilisateur" : "Nouvel utilisateur"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>Nom</Label>
            <Input value={nom} onChange={(e) => setNom(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label>Email</Label>
            <Input value={email} type="email" onChange={(e) => setEmail(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label>Rôle</Label>
            <Select value={role} onValueChange={(v) => setRole(v as Role)}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Administrateur">Administrateur</SelectItem>
                <SelectItem value="Éditeur">Éditeur</SelectItem>
                <SelectItem value="Lecture seule">Lecture seule</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Annuler</Button>
          <Button onClick={submit}>{initial ? "Enregistrer" : "Ajouter"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
