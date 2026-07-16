import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Experience from "@/components/Experience";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { locales, isLocale } from "@/i18n/config";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// solo le locale note sono valide; qualsiasi altra -> 404
export const dynamicParams = false;

const section = "mx-auto max-w-[1100px] scroll-mt-[88px] px-4 py-12";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <main>
      <Header locale={locale} />
      <section id="hero" className="mx-auto max-w-[1100px] scroll-mt-[88px] px-4 pb-12 pt-16">
        <Hero locale={locale} />
      </section>
      <section id="skills" className={section}>
        <Skills locale={locale} />
      </section>
      <section id="projects" className={section}>
        <Projects locale={locale} />
      </section>
      <section id="experiences" className={section}>
        <Experience locale={locale} />
      </section>
      <section id="contact" className={section}>
        <Contact locale={locale} />
      </section>
      <footer className="mx-auto max-w-[1100px] px-4 pb-10 pt-2">
        <Footer locale={locale} />
      </footer>
    </main>
  );
}
