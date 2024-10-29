import { useSessionStorage } from "@mantine/hooks";

export const useDebug = () => {
    const [categories, setCategories] = useSessionStorage<Record<string, boolean>>({
        key: "ziltek:debug",
        defaultValue: {},
    });

    return {
        debug: (category: string, ...m: any[]) => {
            //if(!categories[category]) return;
            console.debug(`[${category}]`, ...m);
        },

        categories,
        setCategories,
    };
};
