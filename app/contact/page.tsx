import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const metadata: Metadata = {
    title: "Contact Us - Ashitya",
    description: "Get in touch with the Ashitya team.",
};

export default function ContactPage() {
    return (
        <div className="container px-4 md:px-6 py-12 md:py-20 max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tighter mb-8">
                Contact Us
            </h1>
            <div className="grid gap-8">
                <div className="prose prose-zinc dark:prose-invert max-w-none">
                    <p>
                        Have a tip, a question, or just want to say hi? We'd love to hear
                        from you. Fill out the form below or email us at{" "}
                        <a href="mailto:contact@ashitya.com">contact@ashitya.com</a>.
                    </p>
                </div>
                <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label htmlFor="name" className="text-sm font-medium">
                                Name
                            </label>
                            <Input id="name" placeholder="Your name" />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium">
                                Email
                            </label>
                            <Input id="email" type="email" placeholder="Your email" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="message" className="text-sm font-medium">
                            Message
                        </label>
                        <textarea
                            id="message"
                            className="flex min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Your message..."
                        />
                    </div>
                    <Button type="submit" size="lg">
                        Send Message
                    </Button>
                </form>
            </div>
        </div>
    );
}
