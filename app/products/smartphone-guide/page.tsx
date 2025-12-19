import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Download, Star } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Ultimate Smartphone Buying Guide 2025 - Free Download",
    description: "Get our comprehensive 30-page guide to choosing the perfect smartphone. Includes comparison charts, buying checklist, and expert recommendations.",
};

export default function DigitalProductPage() {
    const features = [
        "30-page comprehensive guide",
        "Detailed comparison charts",
        "Budget recommendations for every price range",
        "Camera quality analysis",
        "Battery life comparisons",
        "5G compatibility guide",
        "Brand reliability ratings",
        "Buying checklist",
        "Common mistakes to avoid",
        "Expert tips and tricks",
    ];

    const testimonials = [
        {
            name: "Sarah M.",
            rating: 5,
            text: "This guide saved me hours of research! I found the perfect phone for my budget.",
        },
        {
            name: "John D.",
            rating: 5,
            text: "Clear, concise, and incredibly helpful. Worth every penny!",
        },
        {
            name: "Emily R.",
            rating: 5,
            text: "The comparison charts alone are worth the price. Highly recommended!",
        },
    ];

    return (
        <div className="container max-w-4xl px-4 py-12">
            {/* Hero Section */}
            <div className="text-center space-y-6 mb-12">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                    Ultimate Smartphone Buying Guide 2025
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Stop wasting time researching. Get our expert guide and choose the perfect smartphone in minutes.
                </p>
                <div className="flex items-center justify-center gap-2">
                    <div className="flex">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        ))}
                    </div>
                    <span className="text-sm text-muted-foreground">4.9/5 from 500+ buyers</span>
                </div>
            </div>

            {/* Product Image/Preview */}
            <div className="mb-12 rounded-lg overflow-hidden border bg-muted/50 aspect-video flex items-center justify-center">
                <div className="text-center space-y-4">
                    <Download className="h-16 w-16 mx-auto text-primary" />
                    <p className="text-lg font-medium">30-Page PDF Guide</p>
                </div>
            </div>

            {/* Pricing Card */}
            <Card className="mb-12 border-primary">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl">Get Instant Access</CardTitle>
                    <CardDescription>One-time payment. Lifetime access.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="text-center">
                        <div className="text-5xl font-bold text-primary">$9.99</div>
                        <p className="text-sm text-muted-foreground mt-2">
                            <span className="line-through">$29.99</span> Limited time offer!
                        </p>
                    </div>
                    <Button size="lg" className="w-full text-lg" asChild>
                        <Link href="https://gumroad.com/YOUR_PRODUCT_LINK" target="_blank">
                            <Download className="mr-2 h-5 w-5" />
                            Buy Now - Instant Download
                        </Link>
                    </Button>
                    <p className="text-xs text-center text-muted-foreground">
                        Secure payment via Gumroad. 30-day money-back guarantee.
                    </p>
                </CardContent>
            </Card>

            {/* What's Included */}
            <div className="mb-12">
                <h2 className="text-3xl font-bold mb-6 text-center">What's Included</h2>
                <div className="grid md:grid-cols-2 gap-4">
                    {features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-3">
                            <Check className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                            <span>{feature}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Testimonials */}
            <div className="mb-12">
                <h2 className="text-3xl font-bold mb-6 text-center">What Buyers Say</h2>
                <div className="grid md:grid-cols-3 gap-6">
                    {testimonials.map((testimonial, index) => (
                        <Card key={index}>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <div className="flex">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                        ))}
                                    </div>
                                </div>
                                <CardTitle className="text-base">{testimonial.name}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">{testimonial.text}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* FAQ */}
            <div className="mb-12">
                <h2 className="text-3xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">What format is the guide?</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                The guide is delivered as a PDF file that you can read on any device or print out.
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Is there a money-back guarantee?</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                Yes! If you're not satisfied within 30 days, we'll refund your purchase, no questions asked.
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Will this guide be updated?</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                Yes! All buyers get free lifetime updates as new smartphones are released.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Final CTA */}
            <Card className="bg-primary text-primary-foreground">
                <CardContent className="p-8 text-center space-y-4">
                    <h2 className="text-3xl font-bold">Ready to Find Your Perfect Smartphone?</h2>
                    <p className="text-lg opacity-90">
                        Join 500+ satisfied customers who made the right choice.
                    </p>
                    <Button size="lg" variant="secondary" className="text-lg" asChild>
                        <Link href="https://gumroad.com/YOUR_PRODUCT_LINK" target="_blank">
                            <Download className="mr-2 h-5 w-5" />
                            Get Instant Access - $9.99
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
