'use client';

import { useId, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { AlertCircle, Mail, MapPin, Phone } from 'lucide-react';
import { BrandIcon } from '@/components/BrandIcons';
import { Reveal } from '@/components/ui/Reveal';
import { Section, SectionHeading } from '@/components/ui/Section';
import { profile } from '@/data/profile';
import { cn } from '@/lib/cn';
import type { SocialLink } from '@/types';

/**
 * The platforms the client asked for, in order. Only the ones that exist in
 * the profile data are rendered: there is no Facebook or X account in any of
 * Carlo's data or public profiles, and a link is never invented to fill a gap.
 * Adding one to `profile.socials` is all it takes for it to appear here.
 */
const REQUESTED_SOCIALS = ['github', 'linkedin', 'facebook', 'instagram', 'x'] as const;

const socials = REQUESTED_SOCIALS.map((id) =>
  profile.socials.find((social) => social.id === id),
).filter((social): social is SocialLink => Boolean(social));

/** The two facts a hiring manager needs before writing. */
const FACTS: { icon: typeof MapPin; value: string; href?: string }[] = [
  { icon: MapPin, value: profile.location },
  { icon: Phone, value: profile.phone, href: `tel:${profile.phone}` },
];

interface FormValues {
  name: string;
  email: string;
  message: string;
}

type FormErrors = Partial<Record<keyof FormValues, string>>;

const FIELDS = ['name', 'email', 'message'] as const;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};

  if (!values.name.trim()) errors.name = 'Enter your name.';

  if (!values.email.trim()) {
    errors.email = 'Enter your email address.';
  } else if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = 'Enter a valid email address, like name@example.com.';
  }

  if (!values.message.trim()) {
    errors.message = 'Enter a short message.';
  } else if (values.message.trim().length < 10) {
    errors.message = 'Add a little more detail — at least 10 characters.';
  }

  return errors;
}

export function Contact() {
  const [values, setValues] = useState<FormValues>({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [opened, setOpened] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const nameId = useId();
  const emailId = useId();
  const messageId = useId();
  const errorId = useMemo(
    () => ({
      name: `${nameId}-error`,
      email: `${emailId}-error`,
      message: `${messageId}-error`,
    }),
    [nameId, emailId, messageId],
  );

  const update = (field: keyof FormValues) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = event.target.value;
    setValues((previous) => ({ ...previous, [field]: value }));
    // Clear a field's error the moment it is corrected. Leaving
    // aria-invalid="true" on a field the visitor has already fixed tells a
    // screen-reader user their input is still wrong.
    setErrors((previous) => {
      if (!previous[field]) return previous;
      if (validate({ ...values, [field]: value })[field]) return previous;
      const next = { ...previous };
      delete next[field];
      return next;
    });
    setOpened(false);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validate(values);
    setErrors(nextErrors);

    const firstInvalid = FIELDS.find((field) => nextErrors[field]);
    if (firstInvalid) {
      setOpened(false);
      formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }

    const subject = `Portfolio enquiry from ${values.name.trim()}`;
    const body = `Name: ${values.name.trim()}\nEmail: ${values.email.trim()}\n\n${values.message.trim()}`;
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
    setOpened(true);
  };

  const inputClass =
    'mt-2 w-full rounded-card border border-border bg-background/60 px-4 py-3 text-sm text-foreground placeholder:text-muted focus-visible:border-accent';

  return (
    <Section id="contact">
      <SectionHeading
        index="06"
        eyebrow="Contact"
        title={profile.availability}
        description="Email is the fastest route. The form opens your own mail app with the message ready to send — nothing is stored on a server."
      />

      {/* The address is the primary action, so it gets the title treatment. */}
      <Reveal y={40}>
        <a
          href={`mailto:${profile.email}`}
          className="block break-all font-display text-title font-semibold tracking-title text-foreground underline-offset-[6px] hover:underline hover:decoration-accent"
        >
          {profile.email}
        </a>
      </Reveal>

      <div className="mt-8 grid gap-8 sm:gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
        <Reveal y={40}>
          <form
            ref={formRef}
            noValidate
            onSubmit={handleSubmit}
            className="rounded-card border border-border bg-surface p-4 sm:p-7"
          >
            <div>
              <label htmlFor={nameId} className="block text-sm font-medium text-foreground">
                Name
              </label>
              <input
                id={nameId}
                name="name"
                type="text"
                autoComplete="name"
                required
                value={values.name}
                onChange={update('name')}
                aria-invalid={errors.name ? true : undefined}
                aria-describedby={errors.name ? errorId.name : undefined}
                className={inputClass}
              />
              {errors.name ? (
                <p id={errorId.name} className="mt-2 flex items-start gap-2 text-sm text-foreground">
                  <AlertCircle size={15} aria-hidden="true" className="mt-0.5 shrink-0 text-accent" />
                  <span>{errors.name}</span>
                </p>
              ) : null}
            </div>

            <div className="mt-5">
              <label htmlFor={emailId} className="block text-sm font-medium text-foreground">
                Email
              </label>
              <input
                id={emailId}
                name="email"
                type="email"
                autoComplete="email"
                required
                value={values.email}
                onChange={update('email')}
                aria-invalid={errors.email ? true : undefined}
                aria-describedby={errors.email ? errorId.email : undefined}
                className={inputClass}
              />
              {errors.email ? (
                <p id={errorId.email} className="mt-2 flex items-start gap-2 text-sm text-foreground">
                  <AlertCircle size={15} aria-hidden="true" className="mt-0.5 shrink-0 text-accent" />
                  <span>{errors.email}</span>
                </p>
              ) : null}
            </div>

            <div className="mt-5">
              <label htmlFor={messageId} className="block text-sm font-medium text-foreground">
                Message
              </label>
              <textarea
                id={messageId}
                name="message"
                rows={5}
                required
                value={values.message}
                onChange={update('message')}
                aria-invalid={errors.message ? true : undefined}
                aria-describedby={errors.message ? errorId.message : undefined}
                className={cn(inputClass, 'resize-y')}
              />
              {errors.message ? (
                <p id={errorId.message} className="mt-2 flex items-start gap-2 text-sm text-foreground">
                  <AlertCircle size={15} aria-hidden="true" className="mt-0.5 shrink-0 text-accent" />
                  <span>{errors.message}</span>
                </p>
              ) : null}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <button
                type="submit"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-accent px-5 text-sm font-semibold text-on-accent"
              >
                <Mail size={16} aria-hidden="true" />
                Open email draft
              </button>
              <p className="text-xs leading-relaxed text-muted">
                Opens your mail app. Nothing is sent from this page.
              </p>
            </div>

            <p role="status" aria-live="polite" className="mt-4 text-sm text-muted">
              {opened ? (
                <>
                  Your mail app should be open with the message ready to send. If it did not open, email{' '}
                  <a
                    href={`mailto:${profile.email}`}
                    className="font-medium text-foreground underline underline-offset-4 hover:decoration-accent"
                  >
                    {profile.email}
                  </a>{' '}
                  directly.
                </>
              ) : null}
            </p>
          </form>
        </Reveal>

        <Reveal y={40}>
          <h3 className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
            Elsewhere
          </h3>

          <ul className="mt-4 flex flex-wrap gap-3">
            {socials.map((social, index) => (
              <Reveal as="li" key={social.id} y={40} delay={index * 0.12}>
                {/* The anchor holds a fixed 44px box in every animation state —
                    only the glyph pops, so the hit area can never shrink. */}
                <a
                  href={social.url}
                  target={social.url.startsWith('mailto:') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  aria-label={`${social.label} — ${social.handle}`}
                  className="grid h-11 w-11 place-items-center rounded-full border border-border bg-surface text-muted hover:text-foreground"
                >
                  <Reveal as="span" y={0} scale={0.9} delay={index * 0.12} className="grid place-items-center">
                    <BrandIcon name={social.icon} size={18} />
                  </Reveal>
                </a>
              </Reveal>
            ))}
          </ul>

          <ul className="mt-6 space-y-3 border-t border-border pt-5 text-sm text-muted sm:mt-8 sm:pt-6">
            {FACTS.map(({ icon: Icon, value, href }) => (
              <li key={value} className="flex items-center gap-2">
                <Icon size={15} aria-hidden="true" className="shrink-0" />
                {href ? (
                  <a href={href} className="hover:text-foreground">
                    {value}
                  </a>
                ) : (
                  value
                )}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </Section>
  );
}
