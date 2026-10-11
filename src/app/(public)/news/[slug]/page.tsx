"use client";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty";
import { usePrototype } from "@/hooks/use-prototype";
import { formatDate } from "@/lib/utils";
import { useParams } from "next/navigation";

export default function Page() {
  const { slug } = useParams<{ slug: string }>();
  const { state } = usePrototype();
  const item = state.content.news.find((n) => n.slug === slug);
  if (!item) {
    return (
      <Container className="py-16">
        <EmptyState title="Article not found" description="This news slug is not in the prototype." action={<Button href="/news">News list</Button>} />
      </Container>
    );
  }
  return (
    <Container className="max-w-3xl py-12">
      <p className="text-sm text-gold">{item.isDemo ? "Example announcement" : item.category}</p>
      <h1 className="mt-2 text-3xl font-semibold text-navy">{item.title}</h1>
      <p className="mt-2 text-sm text-muted">{formatDate(item.publishedAt)}</p>
      <p className="mt-6 text-muted">{item.body}</p>
    </Container>
  );
}
