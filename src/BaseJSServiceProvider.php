<?php

namespace AwemaPL\BaseJS;

use AwemaPL\BaseJS\AwemaProvider;

class BaseJSServiceProvider extends AwemaProvider
{

    public function boot()
    {
        parent::boot();

        if (file_exists($file = __DIR__ . '/helpers.php'))
        {
            require_once $file;
        }
    }

    public function getPackageName(): string
    {
        return 'base-js';
    }

    public function getPath(): string
    {
        return __DIR__;
    }
}
