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
    <span
      className={cn(
        "text-xs animate-marquee rounded-sm bg-blue-300 text-white px-1 max-w-[100px] whitespace-nowrap overflow-hidden",
        className
      )}
    >
      {propertiesString}
    </span>
  );
}
