import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutGrid, CalendarDays, Settings2 } from "lucide-react";
import { PostsTab } from "@/components/cm/posts-tab";
import { CalendarTab } from "@/components/cm/calendar-tab";
import { ConfigTab } from "@/components/cm/config-tab";
import type { SocialPost } from "@/lib/cm-store";

export const Route = createFileRoute("/community")({
  component: CommunityPage,
});

function CommunityPage() {
  const [tab, setTab] = useState("social");
  const [detailPost, setDetailPost] = useState<SocialPost | null>(null);

  return (
    <>
      <PageHeader
        title="Community Manager AI"
        description="Agent Rédaction — création IA ou manuelle, validation, planification et publication"
      />
      <div className="flex-1 space-y-6 p-4 md:p-8">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="social"><LayoutGrid className="h-4 w-4 mr-1.5" />Posts sociaux</TabsTrigger>
            <TabsTrigger value="calendar"><CalendarDays className="h-4 w-4 mr-1.5" />Calendrier</TabsTrigger>
            <TabsTrigger value="config"><Settings2 className="h-4 w-4 mr-1.5" />Configuration IA</TabsTrigger>
          </TabsList>

          <TabsContent value="social" forceMount className="mt-6 data-[state=inactive]:hidden">
            <PostsTab detailPost={detailPost} setDetailPost={setDetailPost} />
          </TabsContent>

          <TabsContent value="calendar" className="mt-6">
            <CalendarTab
              onPostClick={(p) => {
                setDetailPost(p);
                setTab("social");
              }}
            />
          </TabsContent>

          <TabsContent value="config" className="mt-6">
            <ConfigTab />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

