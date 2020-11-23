<?php
return [
    'key' => env('PKGKIT_CDN_KEY', 'undefined'),
    'src_url' => '{cdn}/assets/{package_name}/{src}?v={hash}',
    'dev_src_url' => '/assets/packages/{package}/dist/{src}?v={hash}',
    'placeholders' => [
        '{key}' => env('PKGKIT_CDN_KEY', 'undefined'),
        '{cdn}' => env('APP_URL', 'https://localhost'),
        '{hash}' => date("YmdHis")
        //And system palceholders:
        //{package_name} system package name
        //{package_version} actual package version in a composer
    ],
    // this resources has been auto load to layout
    'default' => [
        'js/main.js',
        'js/main.legacy.js',
    ],
    //Redefined
    'dist' => [
        'js/main.js'
    ]
];
