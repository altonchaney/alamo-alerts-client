import { Header } from "./Header";

interface HeroBannerProps {
  heroImageUrl: string;
}

export function HeroBanner({ heroImageUrl }: HeroBannerProps) {
  return (
    <section className="hero">
      <div
        className="background-image"
        style={{ backgroundImage: `url(${heroImageUrl})` }}
      />
      <Header />
    </section>
  );
}
