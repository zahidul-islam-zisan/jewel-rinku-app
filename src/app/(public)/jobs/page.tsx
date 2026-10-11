import { JobsExplorer } from "@/components/public/jobs-explorer";

export const metadata = {
  title: "Job opportunities",
  description: "Demo overseas vacancies for the Jewel Rinku Enterprise prototype. These are not live offers.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <JobsExplorer />;
}
