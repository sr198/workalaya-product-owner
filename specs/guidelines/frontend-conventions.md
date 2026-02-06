# Frontend Conventions

Standards for the Next.js web application.

---

## Directory Structure

```
src/
├── app/                  # App Router — pages and layouts only
│   ├── layout.tsx        # Root layout (providers, global styles)
│   ├── page.tsx          # Landing/dashboard page
│   ├── auth/             # Auth pages
│   └── projects/         # Project-related pages
├── components/
│   ├── ui/               # shadcn/ui primitives (Button, Input, Card, etc.)
│   ├── layout/           # Shell components (Header, Sidebar, Breadcrumbs)
│   └── {feature}/        # Feature-specific components (projects/, chat/, etc.)
├── hooks/                # Custom React hooks
├── lib/                  # Utilities (api-client, auth config, helpers)
└── providers/            # React context providers
```

---

## Component Rules

1. **Server Components by default.** Only add `"use client"` when the component needs interactivity, hooks, or browser APIs.
2. **One component per file.** File name matches component name in PascalCase.
3. **Props interface defined inline or co-located.** No separate `types.ts` per component unless shared.
4. **No default exports** except for Next.js page/layout files (required by framework).
5. **shadcn/ui for primitives.** Don't build custom Button, Input, Dialog, etc.

---

## Data Fetching

**Server Components:** Fetch directly in the component using the API client.

**Client Components:** Use React Query (TanStack Query) for:

- Mutations (create, update, delete)
- Polling / real-time updates
- Optimistic updates

```typescript
// Hook pattern
export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: () => apiClient.projects.list(),
  });
}
```

---

## API Client

All backend communication goes through `lib/api-client.ts`:

- Typed methods matching backend routes
- Handles auth token injection
- Consistent error handling

**No raw `fetch()` calls in components or hooks.** Always use the API client.

---

## Styling Rules

1. **Tailwind utility classes** for all styling.
2. **No CSS modules, styled-components, or inline `style` props.**
3. **Use `cn()` utility** (from shadcn/ui) for conditional class merging.
4. **Responsive: mobile-first.** Base styles for mobile, `md:` / `lg:` for larger screens.
5. **Dark mode:** Support via Tailwind's `dark:` variant (implemented in Phase 8).

---

## Form Handling

- Use React Hook Form + Zod resolver
- Zod schemas imported from `@workalaya/shared`
- Same schema validates on frontend AND backend

```typescript
import { projectCreateSchema } from '@workalaya/shared';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const form = useForm({
  resolver: zodResolver(projectCreateSchema),
});
```

---

## State Management

| State Type       | Solution                       |
| ---------------- | ------------------------------ |
| Server state     | React Query                    |
| Form state       | React Hook Form                |
| UI state (local) | useState / useReducer          |
| Global UI state  | React Context (only if needed) |

**No Redux, Zustand, or Jotai** unless complexity clearly demands it.

---

## Error & Loading States

- Every async operation needs loading and error states
- Use Suspense boundaries for Server Component loading
- Use shadcn/ui `Skeleton` components for loading placeholders
- Toast notifications for mutation success/failure (sonner or shadcn toast)

---

## Accessibility

- All interactive elements must be keyboard accessible
- Use semantic HTML (`button`, `nav`, `main`, `section`)
- shadcn/ui components handle most a11y — don't override ARIA attributes
- Form inputs must have associated labels
