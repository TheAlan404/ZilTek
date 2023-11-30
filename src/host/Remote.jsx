import { useState } from "react";
import { DefaultData } from "./common/ControllerAPI";


const RemoteHost = ({
    proxyUrl,
    exitRemoteMode,

}) => {
    let [data, setData] = useState(DefaultData);

    const processCommand = ({ type, data }) => {
        
    };

    return (
        <ControllerAPI.Provider value={{
            data,
            processCommand,
        }}>

        </ControllerAPI.Provider>
    );
}

export {
    RemoteHost,
};

