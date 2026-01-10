# 🔥 React Infinite Loop Debug Guide

## Table of Contents
1. [Common Causes](#common-causes)
2. [Zustand-Specific Issues](#zustand-specific-issues)
3. [MUI Input Issues](#mui-input-issues)
4. [React Hooks Issues](#react-hooks-issues)
5. [Context API Issues](#context-api-issues)
6. [Diagnostic Checklist](#diagnostic-checklist)

---

## Common Causes

### 1. Zustand Store Selectors Returning New References

#### ❌ BAD - Causes Infinite Loop
```tsx
// Component re-renders infinitely because selector returns new array each time
const Component = () => {
  const filteredItems = useStore((state) => 
    state.items.filter(item => item.active) // NEW ARRAY EVERY RENDER!
  );
  
  return <div>{filteredItems.map(...)}</div>;
};
```

**Why it fails:**
- Zustand uses `useSyncExternalStore` internally
- `getSnapshot` returns a new array reference each render
- React sees "new value" → triggers re-render → creates new array → infinite loop

#### ✅ FIXED - Use useMemo
```tsx
const Component = () => {
  const items = useStore((state) => state.items);
  const activeFilter = useStore((state) => state.activeFilter);
  
  const filteredItems = useMemo(
    () => items.filter(item => item.active === activeFilter),
    [items, activeFilter] // Only recalculate when dependencies change
  );
  
  return <div>{filteredItems.map(...)}</div>;
};
```

#### ✅ FIXED - Use Shallow Comparison
```tsx
import { shallow } from 'zustand/shallow';

const Component = () => {
  // Shallow compares the object, prevents re-render if values unchanged
  const { items, activeFilter } = useStore(
    (state) => ({
      items: state.items,
      activeFilter: state.activeFilter
    }),
    shallow // Critical!
  );
  
  const filteredItems = useMemo(
    () => items.filter(item => item.active === activeFilter),
    [items, activeFilter]
  );
  
  return <div>{filteredItems.map(...)}</div>;
};
```

#### ✅ FIXED - Move Filtering to Store
```tsx
// In store
const useStore = create((set, get) => ({
  items: [],
  activeFilter: true,
  getFilteredItems: () => {
    const state = get();
    return state.items.filter(item => item.active === state.activeFilter);
  }
}));

// In component
const Component = () => {
  // Still need useMemo if getFilteredItems returns new array
  const filteredItems = useMemo(
    () => useStore.getState().getFilteredItems(),
    [useStore((state) => state.items), useStore((state) => state.activeFilter)]
  );
  
  return <div>{filteredItems.map(...)}</div>;
};
```

---

### 2. MUI Controlled Inputs with Zustand

#### ❌ BAD - Direct Store Access in onChange
```tsx
const Component = () => {
  const value = useStore((state) => state.search);
  const setValue = useStore((state) => state.setSearch);
  
  return (
    <TextField
      value={value}
      onChange={(e) => setValue(e.target.value)} // Can cause issues
    />
  );
};
```

#### ✅ FIXED - Use useCallback
```tsx
const Component = () => {
  const value = useStore((state) => state.search);
  const setValue = useStore((state) => state.setSearch);
  
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  }, [setValue]);
  
  return (
    <TextField
      value={value}
      onChange={handleChange}
    />
  );
};
```

#### ✅ FIXED - Use Local State with Debounce
```tsx
const Component = () => {
  const [localValue, setLocalValue] = useState('');
  const setStoreValue = useStore((state) => state.setSearch);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setStoreValue(localValue);
    }, 300);
    return () => clearTimeout(timer);
  }, [localValue, setStoreValue]);
  
  return (
    <TextField
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
    />
  );
};
```

---

### 3. Computed Values in Zustand Store

#### ❌ BAD - Computed Value as Store Property
```tsx
const useStore = create((set, get) => ({
  items: [],
  // This creates new array every time store is accessed!
  filteredItems: get().items.filter(item => item.active)
}));
```

#### ✅ FIXED - Computed as Function
```tsx
const useStore = create((set, get) => ({
  items: [],
  activeFilter: true,
  getFilteredItems: () => {
    const state = get();
    return state.items.filter(item => 
      item.active === state.activeFilter
    );
  }
}));

// In component - MUST use useMemo
const Component = () => {
  const items = useStore((state) => state.items);
  const activeFilter = useStore((state) => state.activeFilter);
  const getFilteredItems = useStore((state) => state.getFilteredItems);
  
  const filteredItems = useMemo(
    () => getFilteredItems(),
    [items, activeFilter, getFilteredItems]
  );
  
  return <div>{filteredItems.map(...)}</div>;
};
```

---

### 4. useEffect Dependencies

#### ❌ BAD - Missing or Wrong Dependencies
```tsx
const Component = () => {
  const items = useStore((state) => state.items);
  
  useEffect(() => {
    // items changes → effect runs → might update store → items changes → loop
    processItems(items);
  }, []); // Missing items dependency!
  
  return <div>...</div>;
};
```

#### ❌ BAD - Object/Array in Dependencies
```tsx
const Component = () => {
  const config = useStore((state) => state.config); // New object each render
  
  useEffect(() => {
    doSomething(config);
  }, [config]); // config is new object each time → infinite loop
};
```

#### ✅ FIXED - Extract Primitive Values
```tsx
const Component = () => {
  const configValue = useStore((state) => state.config.value);
  const configEnabled = useStore((state) => state.config.enabled);
  
  useEffect(() => {
    doSomething({ value: configValue, enabled: configEnabled });
  }, [configValue, configEnabled]); // Primitives are stable
};
```

#### ✅ FIXED - Use useMemo for Objects
```tsx
const Component = () => {
  const configValue = useStore((state) => state.config.value);
  const configEnabled = useStore((state) => state.config.enabled);
  
  const config = useMemo(
    () => ({ value: configValue, enabled: configEnabled }),
    [configValue, configEnabled]
  );
  
  useEffect(() => {
    doSomething(config);
  }, [config]);
};
```

---

### 5. State Updates in Render

#### ❌ BAD - setState During Render
```tsx
const Component = () => {
  const [count, setCount] = useState(0);
  
  // NEVER DO THIS - Causes infinite loop
  if (count < 10) {
    setCount(count + 1); // Triggers re-render → runs again → infinite
  }
  
  return <div>{count}</div>;
};
```

#### ✅ FIXED - Use useEffect
```tsx
const Component = () => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    if (count < 10) {
      setCount(count + 1);
    }
  }, [count]);
  
  return <div>{count}</div>;
};
```

---

### 6. Context Value Creating New Object

#### ❌ BAD - New Object Each Render
```tsx
const ContextProvider = ({ children }) => {
  const [state, setState] = useState({});
  
  // New object every render → all consumers re-render
  return (
    <Context.Provider value={{ state, setState }}>
      {children}
    </Context.Provider>
  );
};
```

#### ✅ FIXED - Memoize Context Value
```tsx
const ContextProvider = ({ children }) => {
  const [state, setState] = useState({});
  
  const value = useMemo(
    () => ({ state, setState }),
    [state] // Only recreate when state changes
  );
  
  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  );
};
```

---

### 7. Custom Hooks Returning New References

#### ❌ BAD - New Object Each Call
```tsx
const useCustomHook = () => {
  const data = useStore((state) => state.data);
  
  // New object every render
  return {
    data,
    process: () => processData(data)
  };
};

const Component = () => {
  const { data, process } = useCustomHook();
  
  useEffect(() => {
    process();
  }, [process]); // process is new function each time → infinite loop
};
```

#### ✅ FIXED - Memoize Return Value
```tsx
const useCustomHook = () => {
  const data = useStore((state) => state.data);
  
  const process = useCallback(() => {
    processData(data);
  }, [data]);
  
  return useMemo(
    () => ({ data, process }),
    [data, process]
  );
};
```

---

### 8. MUI TextField with Zustand - Complete Example

#### ❌ BAD - Direct Store Update
```tsx
const SearchInput = () => {
  const search = useStore((state) => state.search);
  const setSearch = useStore((state) => state.setSearch);
  
  return (
    <TextField
      value={search}
      onChange={(e) => {
        setSearch(e.target.value); // Can cause issues with MUI's internal state
      }}
    />
  );
};
```

#### ✅ FIXED - Stable Handler
```tsx
const SearchInput = () => {
  const search = useStore((state) => state.search);
  const setSearch = useStore((state) => state.setSearch);
  
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value);
    },
    [setSearch]
  );
  
  return (
    <TextField
      value={search}
      onChange={handleChange}
    />
  );
};
```

#### ✅ FIXED - Local State Pattern
```tsx
const SearchInput = () => {
  const [localValue, setLocalValue] = useState('');
  const setSearch = useStore((state) => state.setSearch);
  
  // Sync local to store on blur or debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(localValue);
    }, 300);
    return () => clearTimeout(timer);
  }, [localValue, setSearch]);
  
  return (
    <TextField
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
    />
  );
};
```

---

## Diagnostic Checklist

### Step 1: Identify the Source
- [ ] Check browser console for exact error location
- [ ] Look for "getSnapshot" errors (Zustand/useSyncExternalStore)
- [ ] Look for "Maximum update depth" (React state loop)
- [ ] Check React DevTools Profiler for re-render patterns

### Step 2: Check Zustand Selectors
- [ ] Are selectors returning new arrays/objects?
  ```tsx
  // BAD
  useStore(state => state.items.filter(...))
  
  // GOOD
  const items = useStore(state => state.items);
  const filtered = useMemo(() => items.filter(...), [items]);
  ```
- [ ] Are you using `shallow` for object selectors?
  ```tsx
  // BAD
  useStore(state => ({ a: state.a, b: state.b }))
  
  // GOOD
  useStore(state => ({ a: state.a, b: state.b }), shallow)
  ```
- [ ] Are computed values in store functions, not properties?

### Step 3: Check useEffect Dependencies
- [ ] Are all dependencies included?
- [ ] Are dependencies primitive values (not objects/arrays)?
- [ ] Is there a setState in useEffect that updates a dependency?

### Step 4: Check MUI Components
- [ ] Are controlled inputs using stable onChange handlers?
- [ ] Are TextField values coming from store directly?
- [ ] Consider using local state + debounce for search inputs

### Step 5: Check Context Providers
- [ ] Is context value memoized?
- [ ] Are context consumers using useMemo for derived values?

### Step 6: Check Custom Hooks
- [ ] Do hooks return stable references?
- [ ] Are returned functions wrapped in useCallback?
- [ ] Are returned objects wrapped in useMemo?

### Step 7: Performance Debugging
```tsx
// Add this to identify re-renders
const Component = () => {
  console.log('Component render'); // Check how often this logs
  
  useEffect(() => {
    console.log('Effect ran'); // Check effect frequency
  }, [dependencies]);
  
  // ... rest of component
};
```

### Step 8: React DevTools
- [ ] Enable "Highlight updates" in React DevTools
- [ ] Use Profiler to see render frequency
- [ ] Check which props/state are changing

---

## Quick Fix Template

```tsx
// ❌ BEFORE - Infinite Loop
const Component = () => {
  const filtered = useStore(state => 
    state.items.filter(item => item.active)
  );
  
  return <div>{filtered.map(...)}</div>;
};

// ✅ AFTER - Fixed
const Component = () => {
  // 1. Get primitive/stable values from store
  const items = useStore(state => state.items);
  const activeFilter = useStore(state => state.activeFilter);
  
  // 2. Use useMemo for computed values
  const filtered = useMemo(
    () => items.filter(item => item.active === activeFilter),
    [items, activeFilter]
  );
  
  // 3. Memoize callbacks
  const handleClick = useCallback((id) => {
    // handler logic
  }, [/* dependencies */]);
  
  return <div>{filtered.map(...)}</div>;
};
```

---

## Common Patterns to Avoid

1. ❌ **Filtering in selector**: `useStore(s => s.items.filter(...))`
2. ❌ **Object destructuring without shallow**: `useStore(s => ({ a: s.a, b: s.b }))`
3. ❌ **Computed store properties**: `filteredItems: get().items.filter(...)`
4. ❌ **setState in render**: `if (condition) setState(...)`
5. ❌ **New objects in useEffect deps**: `useEffect(() => {}, [newObject])`
6. ❌ **Unstable context values**: `<Context.Provider value={{ a, b }}>`
7. ❌ **Direct store updates in MUI onChange**: `onChange={(e) => setStore(e.target.value)}`

---

## Testing for Infinite Loops

```tsx
// Add this helper to detect infinite loops
const useInfiniteLoopDetector = (componentName: string) => {
  const renderCount = useRef(0);
  
  useEffect(() => {
    renderCount.current = 0;
  }, []);
  
  renderCount.current++;
  
  if (renderCount.current > 50) {
    console.error(`⚠️ Possible infinite loop in ${componentName}`);
    console.trace();
  }
};

// Use in component
const Component = () => {
  useInfiniteLoopDetector('Component');
  // ... rest of component
};
```

---

## Final Notes

- **Always use `useMemo` for computed values from Zustand**
- **Always use `shallow` when selecting multiple store values**
- **Always use `useCallback` for event handlers passed to MUI components**
- **Never create new objects/arrays in selectors**
- **Never call setState during render**
- **Always memoize context values**



