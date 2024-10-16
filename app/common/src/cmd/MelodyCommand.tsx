import { createFactory, Enum } from "@alan404/enum";
import { Melody } from "../Melody";
import { ListAction } from "./ListAction";

export const MelodyCommand = createFactory<MelodyCommand>();
export type MelodyCommand = Enum<{
    EditQuickMelodies: ListAction<Melody>;
}>;
