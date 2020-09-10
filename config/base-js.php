<?php

return [

    'key' =>  env('PKGKIT_CDN_KEY', 'undefined'),

    'src_url' => '{cdn}/{key}/{package_name}/{package_version}/{src}?v={hash}',
    'dev_src_url' => '/assets/packages/{package}/dist/{src}?v={hash}',

    'placeholders' => [
        '{key}' => env('PKGKIT_CDN_KEY', 'undefined'),
        '{cdn}' => env('PKGKIT_CDN_URL', 'https://s0.pkgkit.com'),
        '{hash}' => date("YmdHis")
        //And system palceholders:
        //{package_name} system package name
        //{package_version} actual package version in a composer
    ],

    'default' => [
        'js/main.js',
        'js/main.legacy.js'
    ],

    //Redefined
    'dist' => [
        'js/main.js'
    ]

];
