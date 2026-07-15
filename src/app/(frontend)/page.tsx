import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Experience from "@/components/Experience";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const section = "mx-auto max-w-[1100px] scroll-mt-[88px] px-4 py-12";

export default function Page() {
  return (
    <main>
      <Header />
      <section id="hero" className="mx-auto max-w-[1100px] scroll-mt-[88px] px-4 pb-12 pt-16">
        <Hero />
      </section>
      <section id="skills" className={section}>
        <Skills />
      </section>
      <section id="projects" className={section}>
        <Projects />
      </section>
      <section id="experiences" className={section}>
        <Experience />
      </section>
      <section id="contact" className={section}>
        <Contact />
      </section>
      <footer className="mx-auto max-w-[1100px] px-4 pb-10 pt-2">
        <Footer />
      </footer>
    </main>
  );
}
