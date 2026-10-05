import { Section, SectionHeading } from '@/components/ui/Section';
import { certifications, certIssuers } from '@/data/resume';
import { CertificationGallery } from './CertificationGallery';

export function Certifications() {
  return (
    <Section id="certifications">
      <SectionHeading
        index="05"
        eyebrow="Certificates"
        title="Continuous learning, documented"
        description={`${certifications.length} certificates from ${certIssuers.length} issuers — security fundamentals from Cisco and Fortinet, language and database certificates from HackerRank, and a long run of Udemy courses. Select one to read it.`}
      />
      <CertificationGallery />
    </Section>
  );
}
