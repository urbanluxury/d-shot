interface PageHeroProps {
  title: string;
  subtitle?: string;
  label?: string;
}

export function PageHero({title, subtitle, label}: PageHeroProps) {
  return (
    <section className="relative py-32 md:py-40 overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute w-full h-full object-cover"
        >
          <source src="https://d-shot.b-cdn.net/hero-video.mp4" type="video/mp4" />
        </video>
      </div>
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/75 to-black"></div>

      {/* Content */}
      <div className="container relative z-10">
        <div className="max-w-3xl">
          {label && (
            <p className="text-white/80 uppercase tracking-widest text-sm font-semibold mb-4">
              {label}
            </p>
          )}
          <h1 className="text-5xl md:text-7xl font-display uppercase text-white mb-4 drop-shadow-lg">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xl text-champagne">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
