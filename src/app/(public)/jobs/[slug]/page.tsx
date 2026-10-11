import { JobDetail } from "@/components/public/job-detail";

export const metadata = {
  title: "Vacancy details",
  robots: { index: false, follow: false },
};

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <JobDetail slug={slug} />;
}
