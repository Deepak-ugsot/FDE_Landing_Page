import { InverseCorner } from "@/components/ui/InverseCorner";
import { HeroConsole } from "./HeroConsole";

const accent = "var(--color-accent)";

/**
 * The accent showcase panel. On desktop it is the reference's stepped shape:
 * a tab on the top-right, the lower-left stepped in, and the bottom-right
 * stepped in further, joined by concave fillets.
 */
export function HeroPanel() {
  return (
    <>
      {/* Mobile / tablet: rounded panel with the top-right tab only */}
      <div className="relative mt-20 lg:hidden">
        <div className="absolute -top-10 right-0 h-11 w-20 rounded-t-3xl bg-accent" />
        <InverseCorner at="tl" color={accent} className="-top-6 right-20" />
        <div className="rounded-[28px] rounded-tr-none bg-accent px-4 pt-10 sm:px-10">
          <HeroConsole />
        </div>
      </div>

      {/* Desktop: stepped shape built from overlapping blocks */}
      <div className="relative mt-28 hidden h-[430px] lg:block">
        <div className="absolute inset-x-0 top-0 h-[170px] rounded-l-[32px] bg-accent" />
        <div className="absolute top-0 right-0 left-16 h-[300px] rounded-br-[32px] bg-accent" />
        <div className="absolute top-0 right-[22%] bottom-0 left-16 rounded-b-[32px] bg-accent" />
        <div className="absolute -top-12 right-0 h-[52px] w-24 rounded-t-3xl bg-accent" />

        <InverseCorner at="tl" color={accent} className="-top-6 right-24" />
        <InverseCorner at="bl" color={accent} className="top-[170px] left-10" />
        <InverseCorner at="br" color={accent} className="top-[300px] right-[calc(22%-24px)]" />

        <div className="absolute right-[22%] bottom-0 left-16 flex justify-center px-8">
          <div className="w-full max-w-[720px]">
            <HeroConsole />
          </div>
        </div>
      </div>
    </>
  );
}
