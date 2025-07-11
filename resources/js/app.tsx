import { createInertiaApp } from "@inertiajs/react";
import { createRoot } from "react-dom/client";
import { configureEcho } from "@laravel/echo-react";

configureEcho({
    broadcaster: "reverb",
});

createInertiaApp({
    resolve: (name: string) => {
        const pages = import.meta.glob("./Pages/**/*.tsx", { eager: true });
        return pages[`./Pages/${name}.tsx`];
    },
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(<App {...props} />);
    },
});
