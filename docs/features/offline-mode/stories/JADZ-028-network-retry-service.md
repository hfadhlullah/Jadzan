# JADZ-028: Network Monitor & Retry Service (Exponential Backoff)

**Epic:** CORE - Offline Mode
**Layer:** L3-backend (Service Layer)
**Role:** Fullstack
**Estimation:** 2 Points
**Priority:** Must

---

## Objective
Build a `networkService` that monitors the device's network state using `@react-native-community/netinfo`, exposes an `isOnline` reactive state to the app, and implements an exponential backoff retry mechanism for failed Supabase fetches.

## Technical Specifications
*   **Proposed Files:**
    *   `apps/tv/services/networkService.ts`
    *   `apps/tv/store/networkStore.ts` (Zustand — holds `isOnline: boolean`)
*   **Package:** `@react-native-community/netinfo`
*   **`networkService.ts` functions:**
    ```ts
    // Start listening to network changes (call once on app boot)
    startNetworkListener(onOnline: () => void, onOffline: () => void): () => void

    // Wraps any async fn with exponential backoff retry
    withRetry<T>(
        fn: () => Promise<T>,
        options?: { maxRetries?: number; baseDelayMs?: number }
    ): Promise<T>
    ```
*   **Retry Schedule (default):**
    | Attempt | Delay |
    | :--- | :--- |
    | 1st retry | 5 seconds |
    | 2nd retry | 10 seconds |
    | 3rd retry | 30 seconds |
    | 4th+ retry | 60 seconds (capped) |
*   **`networkStore.ts`:**
    ```ts
    interface NetworkStore {
        isOnline: boolean;
        setOnline: (v: boolean) => void;
    }
    ```

## Acceptance Criteria (Technical)
*   [ ] `startNetworkListener` updates `networkStore.isOnline` when connection is gained/lost.
*   [ ] `withRetry(fn)` calls `fn` and if it throws, waits 5s and retries — up to 4 times by default.
*   [ ] On reconnection (`onOnline` fires), a full sync is triggered (config + media + announcements).
*   [ ] `isOnline` change is available globally via Zustand (components can subscribe).
*   [ ] Listener cleanup function is called on app unmount (no dangling listeners).

## Business Rules & Logic
*   Max retry cap is 60 seconds per attempt (no infinite rapid retries).
*   Retry counter resets to 0 after a successful request.
*   `withRetry` should log each attempt to `console.warn` in `__DEV__` mode.
*   Online→Offline transition does NOT interrupt the current display — it only stops new sync attempts.

## Dependencies
*   Depends on: JADZ-003 (Expo app setup), JADZ-027 (persistence service for sync ops)

## Definition of Done
*   [ ] Network listener fires correctly on toggling airplane mode.
*   [ ] `withRetry` retries failed requests with correct delays.
*   [ ] `networkStore.isOnline` updates reactively.
*   [ ] `bun run lint` passes.
*   [ ] Type check clear.
