# 🚀 Quick Fix Reference for Infinite Loops

## Most Common Fixes

### 1. Zustand Selector Returning Array/Object

```tsx
// ❌ BAD
const items = useStore(state => state.items.filter(i => i.active));

// ✅ FIXED
const items = useStore(state => state.items);
const filtered = useMemo(() => items.filter(i => i.active), [items]);
```

### 2. Multiple Store Values

```tsx
// ❌ BAD
const { a, b } = useStore(state => ({ a: state.a, b: state.b }));

// ✅ FIXED
import { shallow } from 'zustand/shallow';
const { a, b } = useStore(state => ({ a: state.a, b: state.b }), shallow);
```

### 3. MUI TextField with Store

```tsx
// ❌ BAD
<TextField value={search} onChange={(e) => setSearch(e.target.value)} />

// ✅ FIXED
const handleChange = useCallback((e) => setSearch(e.target.value), [setSearch]);
<TextField value={search} onChange={handleChange} />
```

### 4. Computed Store Value

```tsx
// ❌ BAD (in store)
filteredItems: get().items.filter(...)

// ✅ FIXED (in store)
getFilteredItems: () => {
  const state = get();
  return state.items.filter(...);
}

// ✅ FIXED (in component)
const items = useStore(state => state.items);
const getFiltered = useStore(state => state.getFilteredItems);
const filtered = useMemo(() => getFiltered(), [items, getFiltered]);
```

### 5. useEffect Dependencies

```tsx
// ❌ BAD
useEffect(() => {
  doSomething(config);
}, [config]); // config is new object each time

// ✅ FIXED
const configValue = useStore(state => state.config.value);
useEffect(() => {
  doSomething({ value: configValue });
}, [configValue]); // Primitive value
```

## Debugging Steps

1. **Add detector hook:**
```tsx
import { useInfiniteLoopDetector } from '../utils/useInfiniteLoopDetector';

const Component = () => {
  useInfiniteLoopDetector('ComponentName');
  // ... rest
};
```

2. **Check React DevTools Profiler** - See render frequency

3. **Add console logs:**
```tsx
console.log('Component render', { items, filter });
```

4. **Check Zustand selectors** - Are they returning new references?

5. **Check useEffect dependencies** - Are they stable?



