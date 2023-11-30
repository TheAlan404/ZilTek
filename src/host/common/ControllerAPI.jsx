import React from "react";

const DefaultData = {
    melodies: [],
    timetables: [],
};

const ControllerAPI = React.createContext({
    processCommand: ({ type, data }) => {},
    data: DefaultData,
});

export {
    ControllerAPI,
    DefaultData,
}
