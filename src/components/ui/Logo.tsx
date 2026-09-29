import Image from "next/image";

/** upGrad School of Technology wordmark (wide, ~3.25:1). Size it by height, e.g. "h-12 w-auto". */
export function Logo({ className = "h-12 w-auto" }: { className?: string }) {
  return <Image src="/assets/usotlogo.png" alt="" aria-hidden="true" width={182} height={56} priority className={className} />;
}
