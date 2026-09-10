/**
 * Silences one known-bad console.error coming out of @splinetool/runtime.
 *
 * The published scene behind <SplineRobot /> has a broken state transition:
 * an animation on the `HAND_R` object targets state
 * `9a0fe2d2-eccc-487b-aa91-931c3dbe2a79`, which no longer exists on that
 * object — its only remaining state is `46b358fe-3904-45c9-9bcb-c299fecbf8af`.
 *
 * The runtime rebuilds that tween every time the animation loop completes,
 * throws `new Error("Missing property")`, catches it inside `buildTimeline`,
 * and logs the bare message with `console.error(err.message)`. So it repeats
 * for as long as the scene is on screen, and Next.js reports every one as a
 * "Console Error" in the dev overlay. Nothing else breaks — the scene still
 * renders; only that one HAND_R transition is dead. Upgrading the runtime
 * does not help: 1.12.92 throws from the same place as 1.12.29.
 *
 * The durable fix belongs in the Spline editor — repoint or delete that
 * transition and re-publish the scene. Until then this drops that single
 * exact message and leaves every other console.error untouched.
 *
 * Called at module scope rather than from an effect: the scene can complete
 * its first animation loop before React has hydrated the component, so an
 * effect-based install would race the first few errors.
 */
const SPLINE_NOISE = "Missing property"

let installed = false

export function silenceSplineStateNoise() {
    if (installed || typeof window === "undefined") return
    installed = true

    const base = console.error
    console.error = (...args: unknown[]) => {
        // Spline logs the bare message, so the call is a single string
        // argument. Anything else is somebody else's error — pass it on.
        if (args.length === 1 && args[0] === SPLINE_NOISE) return
        base.apply(console, args as Parameters<typeof console.error>)
    }
}
