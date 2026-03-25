// Lightweight render debug — activate with: localStorage.setItem('levvia_debug_render', '1')
// Deactivate with: localStorage.removeItem('levvia_debug_render')

const isActive = () => {
  try { return localStorage.getItem('levvia_debug_render') === '1'; } catch { return false; }
};

const counters: Record<string, number> = {};
const mountTimes: Record<string, number> = {};

export function debugRender(component: string, state?: Record<string, unknown>) {
  if (!isActive()) return;
  counters[component] = (counters[component] || 0) + 1;
  const count = counters[component];
  if (count <= 200 || count % 50 === 0) {
    console.log(`🔄 [${component}] render #${count}`, state ?? '');
  }
  if (count === 50) {
    console.warn(`⚠️ [${component}] 50 renders — possible loop!`);
  }
  if (count === 200) {
    console.error(`🔴 [${component}] 200 renders — INFINITE LOOP DETECTED`);
  }
}

export function debugMount(component: string) {
  if (!isActive()) return;
  mountTimes[component] = (mountTimes[component] || 0) + 1;
  console.log(`✅ [${component}] MOUNT #${mountTimes[component]}`);
}

export function debugUnmount(component: string) {
  if (!isActive()) return;
  console.log(`❌ [${component}] UNMOUNT (was mount #${mountTimes[component] || '?'})`);
}

export function debugEvent(source: string, event: string, data?: unknown) {
  if (!isActive()) return;
  console.log(`📡 [${source}] ${event}`, data ?? '');
}

export function debugStateChange(component: string, key: string, prev: unknown, next: unknown) {
  if (!isActive()) return;
  if (prev !== next) {
    console.log(`📝 [${component}] ${key}: ${JSON.stringify(prev)} → ${JSON.stringify(next)}`);
  }
}

// Returns current counters for overlay
export function getDebugCounters() {
  return { ...counters };
}

export function getMountCounters() {
  return { ...mountTimes };
}

export function isDebugActive() {
  return isActive();
}
