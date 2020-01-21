<?php

return [
    'driver' => envfile('FCM_PROTOCOL', 'http'),
    'log_enabled' => false,

    'http' => [
        'server_key' => envfile('FCM_SERVER_KEY', 'AIzaSyDvuBF7cCo-S6PFJkyB4jWrfIyj4nN6XP8'),
        'sender_id' => envfile('FCM_SENDER_ID', '909680633283'),
        'server_send_url' => 'https://fcm.googleapis.com/fcm/send',
        'server_group_url' => 'https://android.googleapis.com/gcm/notification',
        'timeout' => 30.0, // in second
    ],
];
