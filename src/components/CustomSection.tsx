import ScrollReveal from "@/components/ScrollReveal";

interface CustomSectionProps {
  id: string;
  title: string;
  content: string;
  backgroundImage?: string;
  backgroundColor?: string;
}

export default function CustomSection({ id, title, content, backgroundImage, backgroundColor }: CustomSectionProps) {
  return (
    <section
      id={id}
      className="py-16 sm:py-20 relative"
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        background: !backgroundImage && backgroundColor ? backgroundColor : undefined,
      }}
    >
      {backgroundImage && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      )}
      <div className="container mx-auto px-4 relative z-10">
        {title && (
          <ScrollReveal>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-8 text-foreground">
              {title}
            </h2>
          </ScrollReveal>
        )}
        {content && (
          <ScrollReveal delay={0.15}>
            <div
              className="prose prose-lg max-w-4xl mx-auto text-foreground/80"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </ScrollReveal>
        )}
      </div>
    </section>
  );
}
