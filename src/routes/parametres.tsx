import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { CheckCircle2, XCircle, Plus, Trash2, Instagram, Facebook, MessageCircle, Music2 } from "lucide-react";

export const Route = createFileRoute("/parametres")({
  component: ParametresPage,
});

interface Utilisateur {
  id: string;
  nom: string;
  email: string;
  role: "Administrateur" | "Éditeur" | "Lecture seule";
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
  ]);
  const [newUser, setNewUser] = useState({ nom: "", email: "" });

  const toggleCanal = (nom: string) => {
    setCanauxState((cs) =>
      cs.map((c) => (c.nom === nom ? { ...c, connecte: !c.connecte } : c)),
    );
    toast.success(`Canal ${nom} mis à jour`);
  };

  const addUser = () => {
    if (!newUser.nom.trim() || !newUser.email.trim()) return;
    setUsers((u) => [
      ...u,
      { id: Date.now().toString(), nom: newUser.nom, email: newUser.email, role: "Éditeur" },
    ]);
    setNewUser({ nom: "", email: "" });
    toast.success("Utilisateur ajouté");
  };

  const removeUser = (id: string) => {
    setUsers((u) => u.filter((x) => x.id !== id));
    toast.info("Utilisateur retiré");
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
              <div
                key={c.nom}
                className="flex items-center justify-between rounded-lg border border-border bg-card p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                    <c.icon className="h-5 w-5 text-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{c.nom}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {c.connecte ? (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                          <span className="text-xs text-primary">Connecté</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">Non connecté</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <Button
                  variant={c.connecte ? "outline" : "default"}
                  size="sm"
                  onClick={() => toggleCanal(c.nom)}
                >
                  {c.connecte ? "Déconnecter" : "Connecter"}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Utilisateurs internes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
                {users.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">{u.nom}</TableCell>
                    <TableCell className="text-muted-foreground">{u.email}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{u.role}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => removeUser(u.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="flex flex-col sm:flex-row gap-2 border-t border-border pt-4">
              <Input
                placeholder="Nom"
                value={newUser.nom}
                onChange={(e) => setNewUser({ ...newUser, nom: e.target.value })}
              />
              <Input
                placeholder="Email"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              />
              <Button onClick={addUser}>
                <Plus className="h-4 w-4 mr-1" />
                Ajouter
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
