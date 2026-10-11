import { JobForm } from "@/components/admin/job-form";

export default function Page() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-navy">New vacancy</h1>
      <JobForm />
    </div>
  );
}
