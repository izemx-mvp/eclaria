import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  ShoppingBag,
  MessageSquareWarning,
  Sparkles,
  Images,
  Settings,
  LogOut,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { EclariaLogo, EclariaWordmark } from "@/components/logo";
import { signOut } from "@/lib/auth";
import { toast } from "sonner";

const items = [
  { title: "Tableau de bord", url: "/", icon: LayoutDashboard },
  { title: "Commandes", url: "/commandes", icon: ShoppingBag },
  { title: "Réclamations", url: "/reclamations", icon: MessageSquareWarning },
  { title: "Community Manager", url: "/community", icon: Sparkles },
  { title: "Galerie", url: "/galerie", icon: Images },
  { title: "Paramètres", url: "/parametres", icon: Settings },
];

export function AppSidebar() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut();
    toast.success("Déconnexion réussie");
    navigate({ to: "/login" });
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center px-2 py-3 group-data-[collapsible=icon]:justify-center">
          <div className="group-data-[collapsible=icon]:block hidden">
            <div className="h-8 w-8">
              <EclariaLogo />
            </div>
          </div>
          <div className="group-data-[collapsible=icon]:hidden">
            <EclariaWordmark />
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Pilotage</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const active = item.url === "/" ? pathname === "/" : pathname.startsWith(item.url);
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild isActive={active} tooltip={item.title}>
                      <Link to={item.url} className="flex items-center gap-2">
                        <item.icon className="h-4 w-4 shrink-0" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border">
        <div className="flex items-center gap-2 px-2 py-1.5 text-xs text-sidebar-foreground/70 group-data-[collapsible=icon]:hidden">
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          Agents IA actifs
        </div>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} tooltip="Se déconnecter">
              <LogOut className="h-4 w-4" />
              <span>Se déconnecter</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
