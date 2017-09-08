window.onload = () => {
    if (!('serviceWorker' in navigator)) return;

    navigator.serviceWorker.register('/sw.js')
        .then(registration => {
            console.log(`ServiceWorker registration successful with scope: ${registration.scope}`)
        })

    const text = document.getElementById('text')
    const saveBtn = document.getElementById('save')
    const loadBtn = document.getElementById('load')

    saveBtn.addEventListener('click', (ev) => {
        // TODO(kaze): post to `/api/data` save the text.value (put to cacheStorge)
    })

    loadBtn.addEventListener('click', (ev) => {
        // TODO(kaze): post to `/api/data` load the text.value (get from cacheStorge)
    })
}
