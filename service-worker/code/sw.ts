interface FetchEvent extends Event {
    request: Request;
    respondWith: (arg: Promise<any>) => void;
}

interface InstallEvent extends Event {
    waitUntil: (arg: Promise<any>) => void
}

const cacheFiles = [
    'cache.js',
]

self.addEventListener('install', (ev: InstallEvent) => {
    ev.waitUntil(
        caches
            .open('my-test-cahce-v1')
            .then(cache => cache.addAll(cacheFiles))
    )
})

self.addEventListener('fetch', (ev: FetchEvent) => {
    const {request} = ev
    ev.respondWith(fetchRespondWith(request))
})

async function fetchRespondWith(request: Request) {
    const cache = await caches.open('my-test-cahce-v1');
    const cacheResponse = await cache.match(request)
    if (cacheResponse) {
        console.log(`Cache [${request.method}] ${request.url}`)
        return cacheResponse
    }

    if (request.url.match(`${location.origin}/api/data`) && request.method === 'POST') {
        const cacheRequest = new Request(request.url, {
            method: 'GET',
            headers: request.headers,
            mode: request.mode,
            credentials: request.credentials,
            redirect: request.redirect
        })
        const body = await request.text()
        cache.put(cacheRequest, new Response(body))
        return new Response()
    }
    console.log(`Fetch [${request.method}] ${request.url}`)
    const response = await fetch(request)
    return response
}
