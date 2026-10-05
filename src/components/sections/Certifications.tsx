import { Section, SectionHeading } from '@/components/ui/Section';
import { certifications, certIssuers } from '@/data/resume';
import { CertificationGallery } from './CertificationGallery';

export function Certifications() {
  return (
    <Section id="certifications">
      <SectionHeading
        index="05"
        eyebrow="Certificates"
        title={`${certifications.length} certificates`}
        description={`${certIssuers.length} issuers: security, databases, web.`}
      />
      <CertificationGallery />
    </Section>
  );
}
