import { createFactory, Enum } from "@alan404/enum";
import { Data } from "../data/Data";

export const MaintenanceCommand = createFactory<MaintenanceCommand>();
export type MaintenanceCommand = Enum<{
    SetAllData: Data;
    ClearAllData: void;
}>;
