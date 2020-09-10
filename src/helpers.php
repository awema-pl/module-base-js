<?php

if (!function_exists('notify')) {
    /**
     * Response for server-request module (AWEMA.notify)
     *
     */
    function notify($message, $data = null)
    {
        return array_filter(compact('message', 'data'));
    }
}
