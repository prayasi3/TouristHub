function PageHeader({ eyebrow, title, description, actions, compact = false }) {
  return (
    <section className={`hero-panel animate-float-in ${compact ? "mb-6" : "mb-8"}`}>
      <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          {eyebrow ? <span className="section-kicker">{eyebrow}</span> : null}
          <h1 className={`${compact ? "mt-4 text-3xl font-bold sm:text-4xl" : "display-title mt-5"}`}>
            {title}
          </h1>
          {description ? (
            <p className="mt-4 max-w-2xl text-sm leading-7 text-ink-900/70 sm:text-base">
              {description}
            </p>
          ) : null}
        </div>

        {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
      </div>
    </section>
  );
}

export default PageHeader;
