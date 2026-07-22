import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, CalendarDays, Send } from "lucide-react";
import { postsStore, PLATFORM_META, PLATFORM_ICONS, toneFor, type SocialPost } from "@/lib/cm-store";
import { StatusBadge } from "./status-badge";

type ViewKind = "year" | "month" | "week" | "day" | "agenda";
const MONTHS = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
const MONTHS_SHORT = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];
const DOW = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

function startOfWeek(d: Date) {
  const x = new Date(d);
  const day = (x.getDay() + 6) % 7; // Mon=0
  x.setDate(x.getDate() - day);
  x.setHours(0, 0, 0, 0);
  return x;
}
function addDays(d: Date, n: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}
const keyFor = (d: Date) => d.toISOString().slice(0, 10);

export function CalendarTab({ onPostClick }: { onPostClick: (p: SocialPost) => void }) {
  const posts = postsStore.usePosts();
  const [view, setView] = useState<ViewKind>("month");
  const [cursor, setCursor] = useState(new Date());

  const postsByDay = useMemo(() => {
    const m = new Map<string, SocialPost[]>();
    posts
      .filter((p) => p.statut === "Publié" || p.statut === "Planifié")
      .forEach((p) => {
        const arr = m.get(p.date) ?? [];
        arr.push(p);
        m.set(p.date, arr);
      });
    return m;
  }, [posts]);

  const nav = (dir: -1 | 1) => {
    const c = new Date(cursor);
    if (view === "year") c.setFullYear(c.getFullYear() + dir);
    else if (view === "month") c.setMonth(c.getMonth() + dir);
    else if (view === "week") c.setDate(c.getDate() + 7 * dir);
    else c.setDate(c.getDate() + dir);
    setCursor(c);
  };

  const label = () => {
    if (view === "year") return String(cursor.getFullYear());
    if (view === "month") return `${MONTHS[cursor.getMonth()]} ${cursor.getFullYear()}`;
    if (view === "week") {
      const s = startOfWeek(cursor);
      const e = addDays(s, 6);
      return `Semaine du ${s.getDate()} ${MONTHS_SHORT[s.getMonth()]} – ${e.getDate()} ${MONTHS_SHORT[e.getMonth()]} ${e.getFullYear()}`;
    }
    if (view === "day") return `${cursor.getDate()} ${MONTHS_SHORT[cursor.getMonth()]} ${cursor.getFullYear()}`;
    return "Agenda éditorial";
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex items-start flex-wrap gap-3">
          <div>
            <div className="font-semibold">Calendrier éditorial & social</div>
            <div className="text-xs text-muted-foreground">Cliquez un événement pour ouvrir ses détails.</div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="inline-flex rounded-lg border p-0.5 bg-muted/40">
              {(["year", "month", "week", "day", "agenda"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`text-xs px-3 py-1 rounded-md ${view === v ? "bg-background shadow-sm font-semibold" : "text-muted-foreground"}`}
                >
                  {v === "year" ? "Année" : v === "month" ? "Mois" : v === "week" ? "Semaine" : v === "day" ? "Jour" : "Agenda"}
                </button>
              ))}
            </div>
            {view !== "agenda" && (
              <>
                <Button variant="outline" size="sm" onClick={() => setCursor(new Date())}>Aujourd'hui</Button>
                <Button variant="ghost" size="icon" onClick={() => nav(-1)}><ChevronLeft className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => nav(1)}><ChevronRight className="h-4 w-4" /></Button>
              </>
            )}
          </div>
        </div>
        <div className="border-t mt-3 pt-3 flex items-center justify-between flex-wrap gap-2">
          <div className="font-medium text-sm">{label()}</div>
          <div className="flex gap-3 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500" />Publié</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-500" />En attente</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[color:var(--gold)]" />Planifié</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-muted-foreground" />Brouillon</span>
          </div>
        </div>
      </Card>

      {view === "year" && <YearView cursor={cursor} postsByDay={postsByDay} onPickMonth={(m) => { const c = new Date(cursor); c.setMonth(m); setCursor(c); setView("month"); }} />}
      {view === "month" && <MonthView cursor={cursor} postsByDay={postsByDay} onPostClick={onPostClick} onPickDay={(d) => { setCursor(d); setView("day"); }} />}
      {view === "week" && <WeekView cursor={cursor} postsByDay={postsByDay} onPostClick={onPostClick} />}
      {view === "day" && <DayView cursor={cursor} postsByDay={postsByDay} onPostClick={onPostClick} />}
      {view === "agenda" && <AgendaView posts={posts.filter((p) => p.statut !== "Brouillon")} onPostClick={onPostClick} />}
    </div>
  );
}

function YearView({ cursor, postsByDay, onPickMonth }: { cursor: Date; postsByDay: Map<string, SocialPost[]>; onPickMonth: (m: number) => void }) {
  const year = cursor.getFullYear();
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {MONTHS.map((mName, mi) => {
        const first = new Date(year, mi, 1);
        const days = new Date(year, mi + 1, 0).getDate();
        const events = [...postsByDay.entries()].filter(([k]) => k.startsWith(`${year}-${String(mi + 1).padStart(2, "0")}`)).flatMap(([, v]) => v).length;
        return (
          <button key={mi} onClick={() => onPickMonth(mi)} className="border rounded-lg p-3 text-left hover:bg-muted/30">
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold text-sm">{mName}</div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary">{events}</span>
            </div>
            <div className="grid grid-cols-7 gap-0.5 text-[9px] text-center">
              {DOW.map((d) => <div key={d} className="text-muted-foreground">{d[0]}</div>)}
              {Array.from({ length: (first.getDay() + 6) % 7 }).map((_, i) => <div key={`p${i}`} />)}
              {Array.from({ length: days }).map((_, i) => {
                const d = new Date(year, mi, i + 1);
                const has = postsByDay.has(keyFor(d));
                return (
                  <div key={i} className={`aspect-square flex items-center justify-center rounded ${has ? "bg-primary/20 text-primary font-semibold" : "text-muted-foreground"}`}>
                    {i + 1}
                  </div>
                );
              })}
            </div>
          </button>
        );
      })}
    </div>
  );
}

function MonthView({ cursor, postsByDay, onPostClick, onPickDay }: { cursor: Date; postsByDay: Map<string, SocialPost[]>; onPostClick: (p: SocialPost) => void; onPickDay: (d: Date) => void }) {
  const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
  const startPad = (first.getDay() + 6) % 7;
  const days = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
  const cells: (Date | null)[] = [];
  for (let i = 0; i < startPad; i++) cells.push(null);
  for (let i = 1; i <= days; i++) cells.push(new Date(cursor.getFullYear(), cursor.getMonth(), i));
  while (cells.length % 7) cells.push(null);
  const today = new Date();

  return (
    <Card className="overflow-hidden py-0">
      <div className="grid grid-cols-7 bg-muted/30 text-[11px] font-semibold">
        {DOW.map((d) => <div key={d} className="px-2 py-2">{d}</div>)}
      </div>
      <div className="grid grid-cols-7">
        {cells.map((d, i) => {
          if (!d) return <div key={i} className="min-h-[130px] border-t border-l first:border-l-0" />;
          const events = postsByDay.get(keyFor(d)) ?? [];
          const isToday = isSameDay(d, today);
          return (
            <div key={i} className="min-h-[130px] border-t border-l first:border-l-0 p-1.5 space-y-1">
              <button onClick={() => onPickDay(d)} className={`h-6 w-6 rounded-full flex items-center justify-center text-xs ${isToday ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}>
                {d.getDate()}
              </button>
              {events.slice(0, 3).map((p) => (
                <button
                  key={p.id}
                  onClick={() => onPostClick(p)}
                  className={`w-full text-left text-[10px] px-1.5 py-0.5 rounded border truncate flex items-center gap-1 ${toneFor(p.statut)}`}
                >
                  <span className="flex -space-x-1">
                    {p.platforms.slice(0, 2).map((pl) => {
                      const Icon = PLATFORM_ICONS[pl];
                      return <Icon key={pl} className={`h-2.5 w-2.5 ${PLATFORM_META[pl].color}`} />;
                    })}
                  </span>
                  {p.heure && <span className="font-mono">{p.heure}</span>}
                  <span className="truncate">{p.titre}</span>
                </button>
              ))}
              {events.length > 3 && (
                <button onClick={() => onPickDay(d)} className="text-[10px] text-muted-foreground hover:underline">+{events.length - 3} autres</button>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function WeekView({ cursor, postsByDay, onPostClick }: { cursor: Date; postsByDay: Map<string, SocialPost[]>; onPostClick: (p: SocialPost) => void }) {
  const start = startOfWeek(cursor);
  const today = new Date();
  return (
    <div className="grid md:grid-cols-7 gap-2">
      {Array.from({ length: 7 }).map((_, i) => {
        const d = addDays(start, i);
        const events = (postsByDay.get(keyFor(d)) ?? []).sort((a, b) => (a.heure ?? "").localeCompare(b.heure ?? ""));
        return (
          <Card key={i} className="p-2 min-h-[220px]">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-semibold">{DOW[i]}</div>
              <div className={`h-6 w-6 rounded-full text-xs flex items-center justify-center ${isSameDay(d, today) ? "bg-primary text-primary-foreground" : ""}`}>{d.getDate()}</div>
            </div>
            <div className="space-y-1">
              {events.length === 0 ? (
                <div className="text-[11px] italic text-muted-foreground">Aucune publication</div>
              ) : (
                events.map((p) => (
                  <button key={p.id} onClick={() => onPostClick(p)} className={`w-full text-left text-[11px] px-2 py-1 rounded border ${toneFor(p.statut)}`}>
                    <div className="opacity-70 font-mono">{p.heure}</div>
                    <div className="flex items-center gap-1 line-clamp-2"><Send className="h-3 w-3 shrink-0" /><span>{p.titre}</span></div>
                  </button>
                ))
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
}

function DayView({ cursor, postsByDay, onPostClick }: { cursor: Date; postsByDay: Map<string, SocialPost[]>; onPostClick: (p: SocialPost) => void }) {
  const events = postsByDay.get(keyFor(cursor)) ?? [];
  return (
    <Card className="p-0 overflow-hidden">
      <div className="grid grid-cols-[80px_1fr]">
        {Array.from({ length: 12 }).map((_, i) => {
          const hour = 8 + i;
          const rowEvents = events.filter((p) => p.heure && parseInt(p.heure.slice(0, 2), 10) === hour);
          return (
            <>
              <div key={`h${hour}`} className="font-mono text-[11px] text-muted-foreground bg-muted/20 px-2 py-3 border-t border-r">{String(hour).padStart(2, "0")}:00</div>
              <div key={`c${hour}`} className="border-t p-2 space-y-1 min-h-[64px]">
                {rowEvents.map((p) => (
                  <button key={p.id} onClick={() => onPostClick(p)} className={`w-full text-left px-2 py-1.5 rounded border ${toneFor(p.statut)}`}>
                    <div className="flex items-center gap-2 text-xs">
                      <Send className="h-3 w-3" />
                      <span className="font-mono opacity-70">{p.heure}</span>
                      <span className="font-semibold">{p.titre}</span>
                      <StatusBadge statut={p.statut} />
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">{p.platforms.join(" · ")} · {p.auteur}</div>
                  </button>
                ))}
              </div>
            </>
          );
        })}
      </div>
      {events.length === 0 && (
        <div className="p-10 text-center text-muted-foreground">
          <CalendarDays className="h-10 w-10 mx-auto mb-2 opacity-40" />
          <div className="text-sm">Aucune publication ce jour</div>
        </div>
      )}
    </Card>
  );
}

function AgendaView({ posts, onPostClick }: { posts: SocialPost[]; onPostClick: (p: SocialPost) => void }) {
  const groups = useMemo(() => {
    const m = new Map<string, SocialPost[]>();
    posts.slice().sort((a, b) => a.date.localeCompare(b.date)).forEach((p) => {
      const arr = m.get(p.date) ?? [];
      arr.push(p);
      m.set(p.date, arr);
    });
    return [...m.entries()];
  }, [posts]);

  if (groups.length === 0) return <Card className="p-10 text-center text-muted-foreground">Aucun article planifié</Card>;
  return (
    <div className="space-y-4">
      {groups.map(([date, evs]) => (
        <Card key={date} className="p-4">
          <div className="font-semibold text-sm mb-3">{date}</div>
          <div className="space-y-1.5">
            {evs.map((p) => (
              <button key={p.id} onClick={() => onPostClick(p)} className={`w-full flex items-center gap-3 px-3 py-2 rounded border text-left ${toneFor(p.statut)}`}>
                <Send className="h-4 w-4" />
                <span className="w-12 font-mono text-xs opacity-70">{p.heure}</span>
                <span className="flex-1 truncate">{p.titre}</span>
                <StatusBadge statut={p.statut} />
              </button>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}
