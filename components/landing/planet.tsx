import { cn } from "@/lib/utils"

/**
 * The Earth horizon used by the hero and the final CTA.
 * The artwork is a pre-projected SVG globe (Europe / Africa / Asia view)
 * so the top arc can be cropped exactly like the design.
 */
export function Planet({
  className,
  imageClassName,
}: {
  className?: string
  imageClassName?: string
}) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      <div
        className={cn(
          "absolute top-0 left-1/2 aspect-square w-[92%] min-w-[900px] -translate-x-1/2 bg-cover bg-top bg-no-repeat",
          imageClassName,
        )}
        style={{ backgroundImage: "url('/earth.svg')" }}
      />
    </div>
  )
}
