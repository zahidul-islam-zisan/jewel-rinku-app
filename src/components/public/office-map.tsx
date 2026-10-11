import { company } from "@/lib/company";
import { cn } from "@/lib/utils";

export function OfficeMap({
  className,
  heightClassName = "h-[320px] md:h-[500px]",
}: {
  className?: string;
  heightClassName?: string;
}) {
  return (
    <div className={cn("overflow-hidden rounded-lg border border-border bg-white", className)}>
      <iframe
        title={`${company.mapPlaceName} office location`}
        src={company.mapEmbedUrl}
        className={cn("w-full border-0", heightClassName)}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    </div>
  );
}

export function OfficeDirectionsLinks({ className }: { className?: string }) {
  return (
    <p className={cn("flex flex-wrap gap-4 text-sm", className)}>
      <a
        className="font-medium text-teal hover:underline"
        href={company.mapOpenUrl}
        target="_blank"
        rel="noreferrer"
      >
        Open in Google Maps
      </a>
      <a
        className="font-medium text-teal hover:underline"
        href={company.mapDirectionsUrl}
        target="_blank"
        rel="noreferrer"
      >
        Get directions
      </a>
    </p>
  );
}
