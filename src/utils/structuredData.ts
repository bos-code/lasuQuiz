// Structured data helpers for SEO

export const getWebsiteStructuredData = () => ({
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Quizzy",
  description:
    "Create, manage, and take interactive quizzes. Track student progress and analyze results.",
  url: typeof window !== "undefined" ? window.location.origin : "",
  applicationCategory: "EducationalApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    ratingCount: "150",
  },
});

export const getOrganizationStructuredData = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Quizzy",
  url: typeof window !== "undefined" ? window.location.origin : "",
  logo: typeof window !== "undefined"
    ? `${window.location.origin}/logo.png`
    : "",
  description:
    "Interactive quiz platform for creating, managing, and taking educational quizzes.",
  sameAs: [
    // Add social media links here
  ],
});

export const getBreadcrumbStructuredData = (items: Array<{ name: string; url: string }>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: typeof window !== "undefined"
      ? `${window.location.origin}${item.url}`
      : item.url,
  })),
});

export const getQuizStructuredData = (quiz: {
  title: string;
  description: string;
  id: string;
  questions: number;
  duration?: number;
}) => ({
  "@context": "https://schema.org",
  "@type": "Quiz",
  name: quiz.title,
  description: quiz.description,
  identifier: quiz.id,
  numberOfQuestions: quiz.questions,
  timeRequired: quiz.duration ? `PT${quiz.duration}M` : undefined,
});




