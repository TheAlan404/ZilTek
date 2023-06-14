export default async (url, opts = {}, onprogress = (()=>{})) => {
    let res = await fetch(url, opts);
    const reader = res.body.getReader();
    const contentLength = +res.headers.get('Content-Length');

    // Step 3: read the data
    let receivedLength = 0; // received that many bytes at the moment
    let chunks = []; // array of received binary chunks (comprises the body)
    while(true) {
        const {done, value} = await reader.read();

        if (done) {
            break;
        }

        chunks.push(value);
        receivedLength += value.length;

        onprogress(receivedLength / contentLength);
    }

    let all = new Blob(chunks);
    return all;
}