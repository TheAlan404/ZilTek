export const downloadWithProgress = async (url: string, onProgress: (progress: number) => void) => {
    let req = await fetch(url);
    let contentLength = req.headers.get("Content-Length");
    let total = parseInt(contentLength, 10);

    let loaded = 0;
    let res = new Response(new ReadableStream({
        async start(controller) {
            const reader = req.body?.getReader();
            while(true) {
                if(!reader) break;
                const { done, value } = await reader.read();
                if (done) break;
                loaded += value.length;
                onProgress((loaded / total) * 100);
                controller.enqueue(value);
            }
            controller.close();
        },
    }));

    return await res.blob();
}
