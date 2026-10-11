"use client";

import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { usePrototype } from "@/hooks/use-prototype";
import { applicationStatusLabel } from "@/lib/status-rules";
import { downloadText, toCsv } from "@/lib/utils";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function Page() {
  const { state } = usePrototype();
  const byStatus = Object.entries(
    state.applications.reduce<Record<string, number>>((a, x) => {
      a[x.status] = (a[x.status] ?? 0) + 1;
      return a;
    }, {}),
  ).map(([status, count]) => ({ status: applicationStatusLabel(status as never), count }));
  const inquiries = Object.entries(
    state.inquiries.reduce<Record<string, number>>((a, x) => {
      a[x.status] = (a[x.status] ?? 0) + 1;
      return a;
    }, {}),
  ).map(([status, count]) => ({ status, count }));
  const vacancies = state.jobs.map((j) => ({
    title: j.title,
    applications: state.applications.filter((a) => a.jobId === j.id).length,
  }));

  return (
    <div>
      <div className="flex justify-between">
        <h1 className="text-2xl font-semibold text-navy">Reports</h1>
        <Button
          variant="outline"
          onClick={() =>
            downloadText(
              "demo-report.csv",
              toCsv(byStatus.map((r) => ({ metric: r.status, count: r.count }))),
            )
          }
        >
          Export demo report
        </Button>
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardBody className="h-72">
            <h2 className="mb-2 font-semibold">Applications by status</h2>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byStatus}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="status" hide />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#176B60" />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <h2 className="font-semibold">Inquiries by status</h2>
            <ul className="mt-3 text-sm">
              {inquiries.map((i) => (
                <li key={i.status} className="flex justify-between py-1">
                  <span>{i.status}</span><span>{i.count}</span>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      </div>
      <h2 className="mt-8 font-semibold">Vacancy performance (application counts)</h2>
      <ul className="mt-3 text-sm">
        {vacancies.map((v) => (
          <li key={v.title} className="flex justify-between border-b border-border py-2">
            <span>{v.title}</span><span>{v.applications}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
