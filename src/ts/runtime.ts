import type { EventObject, Variable } from "./types"

export class HuopaBlocksRuntime {
    constructor(vars: Record<string, Variable>) {
        this.variables = vars;
    };

    variables: Record<string, Variable>
    targets: Array<string> = [];
    events: EventObject = { start: [] };
    threads: Thread[] = [];

    getTime() {
        return performance.now()
    }

    runThread(thread: Thread) {
        if (thread.stopped) return;
        if (thread.paused !== 0 && thread.paused > performance.now()) {
            requestAnimationFrame(() => this.runThread(thread));
            return;
        }

        thread.paused = 0;

        try {
            const res = thread.gen.next();
            if (res.done) {
                thread.stopped = true;
                thread.onStop();
            }
        } catch (e) {
            console.error("[RUNTIME] Thread crashed:", e);
            thread.stopped = true;
            thread.crashed = true;
            thread.onStop();
            thread.onCrash(e);
        }

        if (!thread.stopped) requestAnimationFrame(() => this.runThread(thread));
    }

    singularThreadStart(t: Thread, onStop?: Function) {
        const factory = this.events.start[0] 
        if (!factory) return false;
        const thread = new Thread();
        thread.gen = factory(thread)();
        thread.onStop = () => { this.resetState(); if (onStop) onStop(); else t.onStop() };
        thread.onCrash = t.onCrash;
        this.runThread(thread);
        return true;
    }

    stopAllThreads() {
        this.threads.forEach(t => {
            t.onStop();
            t.stopped = true;
        });
    }

    resetState() {
        this.events = { start: [] };
        this.threads = [];
    }
}

export class Thread {
    gen!: Generator;
    crashed: boolean = false;
    stopped: boolean = false;
    paused: number = 0;

    onCrash: Function = (e: Error) => {};

    onStop: Function = () => {};
}