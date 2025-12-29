# Metadata Guide - React Router v7

## Overview

React Router v7 uses `meta()` functions in route files to define page metadata (title, description, Open Graph tags, etc.). This metadata is automatically injected into the `<head>` of your HTML.

## Current Implementation

All routes in your application have `meta()` functions that return:

- Page titles
- Meta descriptions

## Basic Usage

### Static Metadata

```typescript
export function meta() {
  return [
    { title: "Page Title - LASU Quiz" },
    { name: "description", content: "Page description" },
  ];
}
```

### Dynamic Metadata (with route params)

```typescript
export function meta({ params }: Route.MetaArgs) {
  return [
    { title: `Quiz ${params.id} - LASU Quiz` },
    { name: "description", content: "Take the quiz" },
  ];
}
```

### Metadata with Loader Data

```typescript
export function meta({ data }: Route.MetaArgs) {
  return [
    { title: `${data.quiz.title} - LASU Quiz` },
    { name: "description", content: data.quiz.description },
  ];
}
```

## Available Metadata Options

### Standard Meta Tags

```typescript
export function meta() {
  return [
    // Page title
    { title: "Page Title" },

    // Meta description
    { name: "description", content: "Page description" },

    // Keywords
    { name: "keywords", content: "quiz, education, learning" },

    // Author
    { name: "author", content: "LASU Computer Science" },

    // Viewport (usually in root layout)
    { name: "viewport", content: "width=device-width, initial-scale=1" },

    // Robots
    { name: "robots", content: "index, follow" },
  ];
}
```

### Open Graph Tags (Social Media)

```typescript
export function meta() {
  return [
    { title: "Page Title" },
    { name: "description", content: "Description" },

    // Open Graph
    { property: "og:title", content: "Page Title" },
    { property: "og:description", content: "Description" },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://yourdomain.com/page" },
    { property: "og:image", content: "https://yourdomain.com/image.jpg" },

    // Twitter Card
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "Page Title" },
    { name: "twitter:description", content: "Description" },
    { name: "twitter:image", content: "https://yourdomain.com/image.jpg" },
  ];
}
```

### Link Tags

For link tags (favicons, stylesheets, etc.), use the `links()` function:

```typescript
export function links() {
  return [
    { rel: "icon", href: "/favicon.ico" },
    { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
    { rel: "canonical", href: "https://yourdomain.com/page" },
  ];
}
```

## Examples in Your App

### Home Page

```typescript
// app/routes/_index.tsx
export function meta() {
  return [
    { title: "LASU Quiz App - Home" },
    {
      name: "description",
      content: "Welcome to the Computer Science Quiz Application",
    },
  ];
}
```

### Dynamic Route

```typescript
// app/routes/student/quiz.$id.tsx
export function meta({ params }: Route.MetaArgs) {
  return [
    { title: `Quiz ${params.id} - LASU Quiz` },
    { name: "description", content: "Take the quiz" },
  ];
}
```

## Best Practices

1. **Always include a title** - Required for SEO and user experience
2. **Keep descriptions concise** - 150-160 characters for optimal display
3. **Use dynamic data when available** - Loader data can provide context
4. **Add Open Graph tags** - For better social media sharing
5. **Include canonical URLs** - Prevent duplicate content issues

## Enhanced Metadata Example

Here's a comprehensive example with all metadata options:

```typescript
export function meta({ data, params }: Route.MetaArgs) {
  const baseUrl = "https://lasuquiz.com";
  const pageUrl = `${baseUrl}/student/quiz/${params.id}`;

  return [
    // Basic SEO
    { title: `${data.quiz.title} - LASU Quiz` },
    { name: "description", content: data.quiz.description },
    { name: "keywords", content: "quiz, computer science, education" },

    // Open Graph
    { property: "og:title", content: data.quiz.title },
    { property: "og:description", content: data.quiz.description },
    { property: "og:type", content: "website" },
    { property: "og:url", content: pageUrl },
    { property: "og:image", content: `${baseUrl}/og-image.jpg` },

    // Twitter
    { name: "twitter:card", content: "summary" },
    { name: "twitter:title", content: data.quiz.title },
    { name: "twitter:description", content: data.quiz.description },

    // Canonical
    { tag: "link", rel: "canonical", href: pageUrl },
  ];
}
```

## How It Works

1. React Router calls the `meta()` function for each route
2. The returned array is processed by the `<Meta />` component in `root.tsx`
3. Meta tags are injected into the `<head>` of the HTML
4. Search engines and social media platforms read these tags

## Testing Metadata

1. **View Source** - Check the HTML `<head>` section
2. **Browser DevTools** - Inspect the `<head>` element
3. **Social Media Debuggers**:
   - Facebook: https://developers.facebook.com/tools/debug/
   - Twitter: https://cards-dev.twitter.com/validator
   - LinkedIn: https://www.linkedin.com/post-inspector/
