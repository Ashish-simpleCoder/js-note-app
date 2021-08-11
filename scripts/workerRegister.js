if('serviceWorker' in navigator){
    navigator.serviceWorker.register('/dist/serviceWorker.js')
    .then((reg)=>console.log('serviceworker registered',reg))
    .catch(err=>console.log('service worker not registered',err))
}