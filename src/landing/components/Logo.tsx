import Image from "next/image";

/** IFH smiling-house mark: the real brand file (same as the main site header), never a redraw. */
export function LogoMark({
  className,
  priority,
  sizes = "40px",
}: {
  className?: string;
  priority?: boolean;
  /** Rendered CSS width, so the right file size is picked. */
  sizes?: string;
}) {
  return (
    <Image
      className={className}
      src="/assets/logo.png"
      alt=""
      width={1174}
      height={774}
      sizes={sizes}
      priority={priority}
      aria-hidden="true"
    />
  );
}
