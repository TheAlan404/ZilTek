# ZilTek

School bell app project

TODO finish v0.3.0

TODO open-source

## Technical Summary

ZilTek uses end-to-end communication. There are two types of clients - "host" and "remote".

A host handles the data, filesystem and the bell clock. A remote simply connects to a host via a relay server (using socket.io) to edit data or manage the filesystem.

The folder structure is the following:

- `app/`
  - [`common/`](./app/common): Common TypeScript types for client and relay
  - [`client/`](./app/client): React-based client (host + remote) (also tauri)
  - [`server/`](./app/server): Socket.io server, the "relay"

Having the clock/data/etc logic on the client itself gives us a few advantages:

- The app can run on offline environments
- No server required, every instance of ZilTek is locally run
- The relay does not need to know much about the connected sockets

Hosts accept and deny remote connections according to their database. A remote can only connect to a host if the user of the host client accepts an incoming connection via the user interface OR if the remote has already been previously marked as "trusted" via the user of the host client.

ZilTek has two filesystem interfaces: IndexedDB and *Native (TODO)*. IndexedDB is used on the web app version of the client while the Native fs interface is used on the tauri app. Remote clients can read files via a relay-nested socket.io ACK function (remote -> `RequestFile` -> relay -> `RequestFile` -> host -> `ack(ArrayBuffer)` -> relay -> `ack(ArrayBuffer)` -> remote)
