import { BackToTop } from '@/components/layout/BackToTop';
import { ScrollProgress } from '@/components/layout/ScrollProgress';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { Certifications } from '@/components/sections/Certifications';
import { Contact } from '@/components/sections/Contact';
import { Education } from '@/components/sections/Education';
import { Experience } from '@/components/sections/Experience';
import { Hero } from '@/components/sections/Hero';
import { Projects } from '@/components/sections/Projects';
import { TechStack } from '@/components/sections/TechStack';

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <SiteHeader />
      <main>
        <Hero />
        <Projects />
        <TechStack />
        <Experience />
        <Education />
        <Certifications />
        <Contact />
      </main>
      <SiteFooter />
      <BackToTop />
    </>
  );
}
