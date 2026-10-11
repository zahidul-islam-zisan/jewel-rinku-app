"use client";

import { Card, CardBody } from "@/components/ui/card";
import { usePrototype } from "@/hooks/use-prototype";
import { applicationStatusLabel, isJobOpen } from "@/lib/status-rules";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function Page() {
  const { state } = usePrototype();
  const openJobs = state.jobs.filter(isJobOpen).length;
  const newInquiries = state.inquiries.filter((i) => i.status === "new").length;
  const reviewApps = state.applications.filter((a) =>
    ["submitted", "under-review", "documents-pending"].includes(a.status),
  ).length;
  const upcoming = state.interviews.filter((i) => i.outcome === "scheduled").length;
  const pendingDocs = state.documents.filter((d) => d.reviewStatus === "pending").length;

  const statusCounts = Object.entries(
    state.applications.reduce<Record<string, number>>((acc, a) => {
      acc[a.status] = (acc[a.status] ?? 0) + 1;
      return acc;
    }, {}),
  ).map(([name, value]) => ({ name: applicationStatusLabel(name as never), value }));

  const months = ["May", "Jun", "Jul", "Aug", "Sep"];
  const trend = months.map((m, i) => ({
    name: m,
    applications: 4 + i * 2,
    inquiries: 1 + i,
  }));

  const colors = ["#10243A", "#176B60", "#C6A66B", "#21845B", "#B7791F", "#C24141", "#687481"];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-navy">Dashboard</h1>
      <p className="text-sm text-muted">Mock operational metrics for this prototype dataset.</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {[
          ["New employer inquiries", newInquiries, "/admin/employer-inquiries"],
          ["Published jobs (open)", openJobs, "/admin/jobs"],
          ["Active applications", state.applications.length, "/admin/applications"],
          ["Requiring review", reviewApps, "/admin/applications"],
          ["Upcoming interviews", upcoming, "/admin/interviews"],
          ["Pending document reviews", pendingDocs, "/admin/documents"],
        ].map(([l, v, href]) => (
          <Link key={String(l)} href={String(href)}>
            <Card>
              <CardBody>
                <p className="text-sm text-muted">{l}</p>
                <p className="mt-1 text-2xl font-semibold text-navy">{v}</p>
              </CardBody>
            </Card>
          </Link>
        ))}
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardBody className="h-72">
            <h2 className="mb-2 font-semibold text-navy">Applications by status</h2>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusCounts} dataKey="value" nameKey="name" outerRadius={80} label>
                  {statusCounts.map((_, i) => (
                    <Cell key={i} fill={colors[i % colors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="h-72">
            <h2 className="mb-2 font-semibold text-navy">Monthly trend (illustrative seed)</h2>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="applications" fill="#176B60" />
                <Bar dataKey="inquiries" fill="#C6A66B" />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardBody>
            <h2 className="font-semibold text-navy">Recent inquiries</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {state.inquiries.slice(0, 5).map((i) => (
                <li key={i.id} className="flex justify-between">
                  <span>{i.reference} · {i.companyName}</span>
                  <span className="text-muted">{i.status}</span>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <h2 className="font-semibold text-navy">Recent activity</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {state.audit.slice(0, 6).map((a) => (
                <li key={a.id}>
                  {a.action} · {a.actor} · {formatDate(a.createdAt)}
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
