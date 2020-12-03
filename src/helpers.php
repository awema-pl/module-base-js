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

if (!function_exists('notifyMessage')) {

    /**
     * Flash notify message
     *
     */
    function notifyMessage($message, $config = [])
    {
        $defaultConfig = [
            'status'=>'success'
        ];
        $config = array_merge($defaultConfig, $config);
        $config['message'] = $message;
        session()->flash('notifyMessage', $config);
    }
}
