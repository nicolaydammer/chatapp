import { createInertiaApp } from "@inertiajs/react";
import { createRoot } from "react-dom/client";
import { configureEcho } from "@laravel/echo-react";
import { ComponentType } from "react";

configureEcho({
    broadcaster: "reverb",
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
