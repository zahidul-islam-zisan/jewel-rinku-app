import { ManpowerRequest } from "@/components/public/manpower-request";

export const metadata = {
  title: "Submit manpower request",
  description: "Demonstration multi-step manpower request form. Submissions stay in this browser only.",
};

export default function Page() {
  return <ManpowerRequest />;
}
