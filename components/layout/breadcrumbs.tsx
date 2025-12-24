import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
    label: string;
    href: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
    const allItems = [{ label: "Home", href: "/" }, ...items];

    return (
        <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 text-sm text-muted-foreground">
                {allItems.map((item, index) => (
                    <li key={item.href} className="flex items-center gap-2">
                        {index === 0 && <Home className="h-4 w-4" />}
                        {index > 0 && <ChevronRight className="h-4 w-4" />}
                        {index === allItems.length - 1 ? (
                            <span className="font-medium text-foreground">{item.label}</span>
                        ) : (
                            <Link
                                href={item.href}
                                className="hover:text-foreground transition-colors"
                            >
                                {item.label}
                            </Link>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}
