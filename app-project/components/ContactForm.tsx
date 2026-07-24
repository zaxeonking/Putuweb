"use client";

import { useState, FormEvent } from "react";
import toast from "react-hot-toast";
import { IconCheckCircle, IconSend } from "./icons";

interface FieldErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [company, setCompany] = useState(""); // honeypot
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  function validate(): boolean {
    const errors: FieldErrors = {};
    if (!name.trim()) errors.name = "Please enter your name.";
    if (!email.trim()) {
      errors.email = "Please enter your email.";
    } else if (!EMAIL_PATTERN.test(email.trim())) {
      errors.email = "Please enter a valid email address.";
    }
    if (!subject.trim()) errors.subject = "Please enter a subject.";
    if (!message.trim()) {
      errors.message = "Please enter a message.";
    } else if (message.trim().length < 10) {
      errors.message = "Message should be at least 10 characters.";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message, honeypot: company }),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        setFormError(data.error ?? "Something went wrong. Please try again.");
        toast.error(data.error ?? "Couldn't send your message.");
        return;
      }

      toast.success("Message sent!");
      setIsSubmitted(true);
    } catch {
      setFormError("Network error. Please check your connection and try again.");
      toast.error("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center rounded-xl border border-ink-100 bg-white px-6 py-14 text-center shadow-card">
        <IconCheckCircle className="h-12 w-12 text-emerald-500" />
        <h2 className="mt-4 font-display text-xl font-semibold text-ink-900">
          Thanks — your message is on its way
        </h2>
        <p className="mt-2 max-w-sm text-sm text-ink-600">
          We typically reply within one to two business days. We'll get back
          to you at the email address you provided.
        </p>
        <button
          type="button"
          onClick={() => {
            setIsSubmitted(false);
            setName("");
            setEmail("");
            setSubject("");
            setMessage("");
          }}
          className="mt-6 rounded-md border border-ink-200 px-4 py-2 text-sm font-medium text-ink-700 hover:border-ink-900 hover:text-ink-900"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5 rounded-xl border border-ink-100 bg-white p-6 shadow-card sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="block text-sm font-medium text-ink-700">
            Name
          </label>
          <input
            id="contact-name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-md border border-ink-200 px-3 py-2 text-sm text-ink-900 outline-none focus:border-ink-900"
            aria-invalid={Boolean(fieldErrors.name)}
            aria-describedby={fieldErrors.name ? "contact-name-error" : undefined}
          />
          {fieldErrors.name && (
            <p id="contact-name-error" className="mt-1 text-xs text-red-600">
              {fieldErrors.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="contact-email" className="block text-sm font-medium text-ink-700">
            Email
          </label>
          <input
            id="contact-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-md border border-ink-200 px-3 py-2 text-sm text-ink-900 outline-none focus:border-ink-900"
            aria-invalid={Boolean(fieldErrors.email)}
            aria-describedby={fieldErrors.email ? "contact-email-error" : undefined}
          />
          {fieldErrors.email && (
            <p id="contact-email-error" className="mt-1 text-xs text-red-600">
              {fieldErrors.email}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="contact-subject" className="block text-sm font-medium text-ink-700">
          Subject
        </label>
        <input
          id="contact-subject"
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="mt-1 w-full rounded-md border border-ink-200 px-3 py-2 text-sm text-ink-900 outline-none focus:border-ink-900"
          aria-invalid={Boolean(fieldErrors.subject)}
          aria-describedby={fieldErrors.subject ? "contact-subject-error" : undefined}
        />
        {fieldErrors.subject && (
          <p id="contact-subject-error" className="mt-1 text-xs text-red-600">
            {fieldErrors.subject}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="contact-message" className="block text-sm font-medium text-ink-700">
          Message
        </label>
        <textarea
          id="contact-message"
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="mt-1 w-full rounded-md border border-ink-200 px-3 py-2 text-sm text-ink-900 outline-none focus:border-ink-900"
          aria-invalid={Boolean(fieldErrors.message)}
          aria-describedby={fieldErrors.message ? "contact-message-error" : undefined}
        />
        {fieldErrors.message && (
          <p id="contact-message-error" className="mt-1 text-xs text-red-600">
            {fieldErrors.message}
          </p>
        )}
      </div>

      {/* Honeypot field, hidden from real users */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="contact-company">Company</label>
        <input
          id="contact-company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
      </div>

      {formError && (
        <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {formError}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full items-center justify-center gap-2 rounded-md bg-ink-900 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-ink-800 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {isSubmitting ? "Sending..." : "Send message"}
        {!isSubmitting && <IconSend className="h-4 w-4" />}
      </button>
    </form>
  );
}
