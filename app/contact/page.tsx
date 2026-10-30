import { PublicForm } from "@/components/public-form";
import { CONTACT_EMAIL } from "@/lib/site";
export default function ContactPage() {
 return <div className="mx-auto max-w-3xl space-y-8 px-4 py-12 md:py-20">
  <h1 className="text-3xl font-bold md:text-5xl">Contact Aana</h1>
  <p>Send a question, feedback or a story suggestion using this form, or email <a className="underline break-all" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.</p>
  <div className="glass-card rounded-3xl p-5 md:p-8"><PublicForm kind="contact" /></div>
 </div>;
}
