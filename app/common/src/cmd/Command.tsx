import { createFactory, Enum } from "@alan404/enum";
import { Melody } from "../Melody";
import { ScheduleCommand } from "./ScheduleCommand";
import { MaintenanceCommand } from "./MaintenanceCommand";
import { FilesystemCommand } from "./FilesystemCommand";
import { MelodyCommand } from "./MelodyCommand";

export const Command = createFactory<Command>();
export type Command = Enum<{
    ToggleSystemEnabled: boolean;
    ForceStop: void;
    ForcePlayMelody: Melody;
    
    Schedule: ScheduleCommand;
    Maintenance: MaintenanceCommand;
    Filesystem: FilesystemCommand;
    Melody: MelodyCommand;
}>


