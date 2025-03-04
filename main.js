import { checkAll } from "./js/checker.js";

const publickey = "BLA0fdKCDGwXsUXeNNery52icIYEaPlDXVD-qkqRCSmxzObJH_Wt1ge2ZXuCE5GZAzIGMwNo1eOhLYcTdveNHng";

document.getElementById('enabler').addEventListener('click', async () => {
    if (!('serviceWorker' in navigator)) {
        console.error('Service Worker not supported in this browser.');
        return;
    }

    try {
        const registration = await navigator.serviceWorker.register('./service-worker.js');

        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
            console.error('Permission not granted for notifications.');
            return;
        }

        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(publickey)
        });

        // TODO : change to real server when done
        await fetch('https://nathan-pc.taile828dd.ts.net/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(subscription),
        });
    } catch (error) {
        console.error(error);
    }

    checkAll();
});

// document.getElementById('enabler').addEventListener('click', async () => {
//     const registration = await navigator.serviceWorker.ready;
//     if (registration.active) {
//         registration.active.postMessage({
//             type: 'simulate-push',
//             payload: {
//                 title: 'THREAT DETECTED',
//                 body: 'Threat at \"Lakeforest Mall\"',
//                 icon: 'https://www.soteria-security.us/assets/images/logo.svg'
//             }
//         });
//     } else {
//         console.error('No active Service Worker found.');
//     }
// });

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}
