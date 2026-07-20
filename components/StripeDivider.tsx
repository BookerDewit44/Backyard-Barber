// Barber-pole stripe in the brand yellow/black — a nod to the "Backyard Barber"
// name, used to break up homepage sections.
export default function StripeDivider() {
  return (
    <div
      aria-hidden="true"
      className="h-1.5 w-full"
      style={{
        backgroundImage:
          "repeating-linear-gradient(135deg, var(--color-primary) 0 14px, var(--color-ink) 14px 28px)",
      }}
    />
  );
}
