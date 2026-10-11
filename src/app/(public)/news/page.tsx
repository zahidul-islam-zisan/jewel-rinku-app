"use client";

import { Container, PageHero } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { Card, CardBody } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty";
import { usePrototype } from "@/hooks/use-prototype";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

export default function Page() {
  const { state } = usePrototype();
  const items = state.content.news;
  return (
    <>
      <PageHero title="News" description="Example announcements for the prototype. They are not official press releases unless verified." />
      <Container className="space-y-4 py-12">
        {items.length === 0 ? (
          <EmptyState title="No announcements" description="When verified news exists, it will appear here." />
        ) : (
          items.map((n) => (
            <Link key={n.id} href={`/news/${n.slug}`}>
              <Card>
                <CardBody>
                  <div className="flex gap-2">
                    <Badge>{n.category}</Badge>
                    {n.isDemo ? <Badge tone="gold">Example</Badge> : null}
                  </div>
                  <h2 className="mt-2 font-semibold text-navy">{n.title}</h2>
                  <p className="mt-1 text-xs text-muted">{formatDate(n.publishedAt)}</p>
                  <p className="mt-2 text-sm text-muted">{n.excerpt}</p>
                </CardBody>
              </Card>
            </Link>
          ))
        )}
      </Container>
    </>
  );
}
