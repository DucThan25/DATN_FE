import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

export const echo = new Echo({
    broadcaster: 'pusher',
    key: process.env.VUE_APP_PUSHER_APP_KEY, 
    cluster: process.env.VUE_APP_PUSHER_APP_CLUSTER,
    encrypted: true,
    //authHost: 'http://127.0.0.1:8000',
    authEndpoint: 'http://localhost:8000/broadcasting/auth',
    // forceTLS: true,
    
    
});