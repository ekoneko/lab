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
    ev.respondWith(
        caches.open('my-test-cahce-v1')
            .then(cache => cache.match(request))
            .then(response => {
                if (response) {
                    console.log(`Cache [${request.method}] ${request.url}`)
                    return response
                } else {
                    console.log(`Fetch [${request.method}] ${request.url}`)
                    return fetch(request)
                }
            })
    )
})
