import { createInertiaApp } from "@inertiajs/react";
import { createRoot } from "react-dom/client";
import { configureEcho } from "@laravel/echo-react";
import { ComponentType } from "react";

configureEcho({
    broadcaster: "reverb",
    key: import.meta.env.VITE_REVERB_APP_KEY,
    wsHost: import.meta.env.VITE_REVERB_HOST,
    wsPort: import.meta.env.VITE_REVERB_PORT,
    wssPort: import.meta.env.VITE_REVERB_PORT,
    forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? "https") === "https",
    enabledTransports: ["ws", "wss"],
});

createInertiaApp({
    resolve: (name: string): ComponentType => {
        const pages = import.meta.glob("./Pages/**/*.tsx", { eager: true });
        return pages[`./Pages/${name}.tsx`] as ComponentType;
    },
    setup({
        el,
        App,
        props,
    }: {
        el: HTMLElement;
        App: ComponentType;
        props: any;
    }): void {
        const root = createRoot(el);
        root.render(<App {...props} />);
    },
});
