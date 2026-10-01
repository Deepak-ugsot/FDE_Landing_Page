export type Feature = {
  title: string;
  body: string;
  /** Decorative illustration drawn inside the card's accent panel (absolutely positioned). */
  visual: React.ReactNode;
};

/**
 * Centered heading over a full-width grid of illustrated cards (1, 2 then 3 columns), spanning
 * the same container as the other sections. Each card's visual sits on an accent-gradient
 * panel; on hover the card lifts and the visual nudges forward.
 */
export function FeatureSections({
  id,
  eyebrow,
  title,
  description,
  features,
  children,
}: {
  id?: string;
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  features: Feature[];
  /** Rendered under the cards, e.g. a call to action. */
  children?: React.ReactNode;
}) {
  return (
    <section id={id} className="w-full py-16 lg:py-24">
      <div className="mx-auto max-w-[1328px] px-5 sm:px-8 lg:px-12">
        <div className="mx-auto mb-12 flex max-w-2xl flex-col items-center gap-5 text-center lg:mb-16">
          {eyebrow && (
            <p className="flex items-center gap-2.5 font-display text-base font-bold">
              <span className="size-2 rounded-full bg-accent" aria-hidden="true" />
              {eyebrow}
            </p>
          )}
          <h2 className="font-display text-[clamp(2.25rem,4.2vw,3.5rem)] leading-[1.05] font-light tracking-[-0.01em]">
            {title}
          </h2>
          {description && <p className="max-w-md text-base leading-relaxed text-mist">{description}</p>}
        </div>

        <ul className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <li key={f.title} className="group transition duration-300 hover:-translate-y-1">
              <div
                aria-hidden="true"
                className="relative aspect-[16/10] overflow-hidden sm:aspect-[10/7] rounded-3xl bg-[radial-gradient(120%_90%_at_20%_0%,var(--color-accent-light),var(--color-accent)_45%,var(--color-accent-deep))]"
              >
                <div className="absolute inset-0 origin-bottom-right transition duration-500 group-hover:scale-[1.03]">
                  {f.visual}
                </div>
              </div>
              <h3 className="mt-5 font-display text-2xl leading-tight font-normal">{f.title}</h3>
              <p className="mt-2 text-base leading-relaxed text-paper/60">{f.body}</p>
            </li>
          ))}
        </ul>

        {children && <div className="mt-14 flex justify-center">{children}</div>}
      </div>
    </section>
  );
}

export default FeatureSections;
