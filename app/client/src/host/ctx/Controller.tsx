import { createContext } from "react";
import { createState, State } from "@ziltek/common/src/state/State";
import { noop } from "@mantine/core";
import { Command } from "@ziltek/common/src/cmd/Command";

export interface IController extends State {
    processCommand: (cmd: Command) => void;
}

export const Controller = createContext<IController>({
    processCommand: noop,
    ...createState(),
});

Controller.displayName = "Controller";
