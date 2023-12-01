import { cn } from "@/lib/utils";

export default function PropertiesString({
  propertiesString,
  className,
}: {
  propertiesString: string | null | undefined;
  className?: string;
}) {
  if (!propertiesString) return null;
  return (
    <div className={cn("rounded-sm bg-blue-300 text-white px-1 max-w-[80px] whitespace-nowrap overflow-hidden", className)}>
      <p className="text-xs animate-marquee">{propertiesString}</p>
    </div>
  );
}
