function InstrumentImage({ label, src }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <div className="flex h-44 items-center justify-center overflow-hidden rounded-lg border border-border bg-surface p-2">
        <img src={src} alt={label} className="max-h-full max-w-full object-contain" />
      </div>
    </div>
  );
}

/** Scanned deed photos; renders nothing when the estate has none. */
export function InstrumentImages({ estate }) {
  const images = [
    { label: 'صورة الصك الورقي', src: estate.old_handwritten_photo },
    { label: 'صورة الصك الإلكتروني', src: estate.photo_of_the_electronic },
    { label: 'صورة الحجة القوية', src: estate.strong_argument_photo },
  ].filter((image) => image.src);

  if (images.length === 0) return null;

  return (
    <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
      {images.map((image) => (
        <InstrumentImage key={image.label} {...image} />
      ))}
    </div>
  );
}
