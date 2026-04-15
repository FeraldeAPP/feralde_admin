# Skeleton Loaders Guide

This directory contains reusable skeleton loading components for the admin dashboard. These components provide professional, animated loading states while data is being fetched.

## Available Skeleton Components

### Table Components
- **`TableSkeleton`** - Full table with header and rows
  ```tsx
  import { TableSkeleton } from '@/components/loading/SkeletonLoaders';
  
  {isLoading && <TableSkeleton rowCount={8} columnCount={6} />}
  ```

- **`TableRowSkeleton`** - Single table row
  ```tsx
  <TableRowSkeleton columnCount={5} />
  ```

### Card Components
- **`CardSkeleton`** - Generic card with title, description, and actions
  ```tsx
  {isLoading && <CardSkeleton />}
  ```

- **`DetailPageSkeleton`** - Full detail page layout with multiple cards
  ```tsx
  {isLoading && <DetailPageSkeleton />}
  ```

### Form Components
- **`FormSkeleton`** - Form with input fields and buttons
  ```tsx
  {isLoading && <FormSkeleton fieldCount={6} />}
  ```

### Grid/List Components
- **`GridCardSkeleton`** - Single grid card
- **`GridSkeleton`** - Multiple grid cards
  ```tsx
  {isLoading && <GridSkeleton cardCount={6} columns={3} />}
  ```

- **`ListItemSkeleton`** - Single list item
- **`ListSkeleton`** - Multiple list items
  ```tsx
  {isLoading && <ListSkeleton itemCount={5} />}
  ```

### Dashboard Components
- **`StatsCardSkeleton`** - Single stat/metric card
- **`StatsGridSkeleton`** - Multiple stat cards
  ```tsx
  {isLoading && <StatsGridSkeleton cardCount={4} />}
  ```

## How to Apply to Pages

### 1. Import the skeleton component
```tsx
import { TableSkeleton } from '@/components/loading/SkeletonLoaders';
```

### 2. Replace loading text with skeleton
**Before:**
```tsx
{isLoading && (
    <div className="py-16 text-center text-sm text-stone-400">
        Loading products...
    </div>
)}
```

**After:**
```tsx
{isLoading && <TableSkeleton rowCount={8} columnCount={6} />}
```

## Pages to Update

The following pages need skeleton loaders applied:

### Table Pages (Use `TableSkeleton`)
- [ ] ProductsPage
- [ ] OrdersPage
- [ ] DistributorsPage
- [ ] AnnouncementsPage
- [ ] CategoriesPage
- [ ] BundlesPage
- [ ] WalletsPage
- [ ] CommissionsPage
- [ ] AccountingPage
- [ ] UsersPage
- [ ] PromoCodesPage
- [ ] ShippingMethodsPage
- [ ] InventoryPage

### Detail Pages (Use `DetailPageSkeleton` or `FormSkeleton`)
- [ ] ProductDetailPage
- [ ] OrderDetailPage
- [ ] DistributorDetailPage

### Dashboard/Stats Pages (Use `StatsGridSkeleton`)
- [ ] DashboardPage
- [ ] LeaderboardPage

### Grid/Card Pages (Use `GridSkeleton`)
- [ ] MarketingPage

### List Pages (Use `ListSkeleton`)
- [ ] TrainingPage
- [ ] ProfilePage

## Customization

To adjust row counts, column counts, or card counts, pass the appropriate props:

```tsx
// Table with 12 rows and 5 columns
<TableSkeleton rowCount={12} columnCount={5} />

// Form with 8 fields
<FormSkeleton fieldCount={8} />

// Grid with 12 cards in 4 columns
<GridSkeleton cardCount={12} columns={4} />

// List with 10 items
<ListSkeleton itemCount={10} />

// Dashboard with 6 stat cards
<StatsGridSkeleton cardCount={6} />
```

## Styling

All skeleton components use Tailwind CSS and the `Skeleton` component from shadcn/ui. They automatically feature:
- Pulse animation
- Rounded corners
- Muted background color
- Responsive sizing

No additional styling is needed beyond the component usage.
