import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";

export default function NotFound() {
  return (
    <Container className="py-24 text-center">
      <p className="text-sm font-medium text-teal">404</p>
      <h1 className="mt-2 text-3xl font-semibold text-navy">Page not found</h1>
      <p className="mx-auto mt-3 max-w-md text-muted">
        This route does not exist in the Jewel Rinku Enterprise prototype. Check the address or return home.
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <Button href="/">Home</Button>
        <Button href="/jobs" variant="outline">
          Browse demo jobs
        </Button>
      </div>
    </Container>
  );
}
