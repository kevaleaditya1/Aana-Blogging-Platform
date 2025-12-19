"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AffiliateButton, AffiliateDisclosure } from "@/components/affiliate/affiliate-link";
import { Star, Check, X } from "lucide-react";

interface ProductReviewProps {
    product: {
        name: string;
        image: string;
        price: string;
        rating: number;
        affiliateLink: string;
        pros: string[];
        cons: string[];
        description: string;
        specs?: { label: string; value: string }[];
    };
}

export function ProductReview({ product }: ProductReviewProps) {
    return (
        <div className="space-y-6">
            <AffiliateDisclosure />

            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="md:w-1/3">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full rounded-lg object-cover"
                            />
                        </div>
                        <div className="md:w-2/3 space-y-4">
                            <div>
                                <CardTitle className="text-3xl">{product.name}</CardTitle>
                                <div className="flex items-center gap-2 mt-2">
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`h-5 w-5 ${i < Math.floor(product.rating)
                                                        ? "fill-yellow-400 text-yellow-400"
                                                        : "text-gray-300"
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-lg font-semibold">{product.rating}/5</span>
                                </div>
                            </div>
                            <CardDescription className="text-base">
                                {product.description}
                            </CardDescription>
                            <div className="flex items-center justify-between">
                                <span className="text-3xl font-bold text-primary">{product.price}</span>
                                <AffiliateButton href={product.affiliateLink}>
                                    Buy Now
                                </AffiliateButton>
                            </div>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Check className="h-5 w-5 text-green-500" />
                            Pros
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2">
                            {product.pros.map((pro, index) => (
                                <li key={index} className="flex items-start gap-2">
                                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                                    <span>{pro}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <X className="h-5 w-5 text-red-500" />
                            Cons
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2">
                            {product.cons.map((con, index) => (
                                <li key={index} className="flex items-start gap-2">
                                    <X className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                                    <span>{con}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>

            {product.specs && product.specs.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Specifications</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-2 gap-4">
                            {product.specs.map((spec, index) => (
                                <div key={index} className="flex justify-between border-b pb-2">
                                    <span className="font-medium">{spec.label}:</span>
                                    <span className="text-muted-foreground">{spec.value}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="flex justify-center">
                <AffiliateButton href={product.affiliateLink} className="text-lg px-8 py-4">
                    Check Latest Price on Amazon
                </AffiliateButton>
            </div>
        </div>
    );
}

interface ComparisonTableProps {
    products: {
        name: string;
        image: string;
        price: string;
        rating: number;
        affiliateLink: string;
        features: { [key: string]: string };
    }[];
    comparisonPoints: string[];
}

export function ComparisonTable({ products, comparisonPoints }: ComparisonTableProps) {
    return (
        <div className="space-y-6">
            <AffiliateDisclosure />

            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="border-b">
                            <th className="p-4 text-left">Feature</th>
                            {products.map((product, index) => (
                                <th key={index} className="p-4 text-center">
                                    <div className="space-y-2">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-24 h-24 object-cover rounded mx-auto"
                                        />
                                        <div className="font-semibold">{product.name}</div>
                                        <div className="text-primary font-bold">{product.price}</div>
                                        <AffiliateButton href={product.affiliateLink} variant="secondary">
                                            View Deal
                                        </AffiliateButton>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {comparisonPoints.map((point, index) => (
                            <tr key={index} className="border-b hover:bg-muted/50">
                                <td className="p-4 font-medium">{point}</td>
                                {products.map((product, pIndex) => (
                                    <td key={pIndex} className="p-4 text-center">
                                        {product.features[point] || "-"}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
