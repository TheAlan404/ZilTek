import { ChangesContext } from "./ChangesContext"
import { BaseRouter } from "../BaseRouter.tsx"
import { useSet } from "@mantine/hooks";

export const App = () => {
    const dirty = useSet<string>();

    return (
        <ChangesContext.Provider value={{
            dirty,
        }}>
            <BaseRouter />
        </ChangesContext.Provider>
    )
}
