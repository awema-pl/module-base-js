# BaseJS

[![Coverage report](https://repo.pkgkit.com/4GBWO/awema-pl/module-base-js/badges/master/coverage.svg)](https://www.pkgkit.com/)
[![Build status](https://repo.pkgkit.com/4GBWO/awema-pl/module-base-js/badges/master/build.svg)](https://www.pkgkit.com/)
[![Composer Ready](https://www.pkgkit.com/4GBWO/awema-pl/module-base-js/status.svg)](https://www.pkgkit.com/)
[![Downloads](https://www.pkgkit.com/4GBWO/awema-pl/module-base-js/downloads.svg)](https://www.pkgkit.com/)
[![Last version](https://www.pkgkit.com/4GBWO/awema-pl/module-base-js/version.svg)](https://www.pkgkit.com/)


This is where your description should go. Take a look at [contributing.md](contributing.md) to see a to do list.

## Installation

Via Composer

``` bash
$ composer require awema-pl/module-base-js
```

The package will automatically register itself.

You can publish the migration with:

```bash
php artisan vendor:publish --provider="AwemaPL\BaseJS\Providers\BaseJSServiceProvider" --tag="migrations"
```

After the migration has been published you can create the table for BaseJS by running the migrations:

```bash
php artisan migrate
```

You can publish the config file with:

```bash
php artisan vendor:publish --provider="AwemaPL\BaseJS\Providers\BaseJSServiceProvider" --tag="config"
```

Publish js/css files for all awema-pl packages

```
php artisan vendor:publish --tag=awema-public
```

## Examples of use

```php
use AwemaPL\BaseJS\Facades\BaseJS;

BaseJS::lowerStr('Some String'); // 'some string'

BaseJS::count(); // 1
```

## Methods

#### example()

Description some example.

#### count()

Description some count.

#### validate(string $email)

Throws an `InvalidArgumentException` is email is invalid.

## Testing

You can run the tests with:

```bash
composer test
```

## Frontend development

### Stack

- Gulp to run all tasks ( configure in `gulpfile.js` )
- Rollup to bundle javascript ( configure in `rollup.config.js` )
- Babel for transpiling and polyfilling for legacy browsers ( configure in `.babelrc.js` )
- Stylus and PostCSS to process and bundle CSS ( configure in `postcss.config.js` )
- BrowserSync to run dev server ( serves both `/dist` and `/examples` as `http://localhost:3000` )

Target browsers list can be found in `.browserslistrc` and is used by Babel and PostCSS

**Caution** `/dist` folder is cleared each time the Gulp starts. For long-term files saving use `examples` folder

### NPM scripts

`npm run watch` or `npm start` to run dev server with live reload
`npm run build` to build production minified version

## Contributing

Please see [contributing.md](contributing.md) for details and a todolist.

## Security

If you discover any security related issues, please email :author_email instead of using the issue tracker.

## Credits

- [theAlex][link-author]
- [All Contributors][link-contributors]

## License

GNU General Public License v3.0. Please see the [license file](license.md) for more information.

[ico-version]: https://img.shields.io/packagist/v/awemapl/basejs.svg?style=flat-square
[ico-downloads]: https://img.shields.io/packagist/dt/awemapl/basejs.svg?style=flat-square
[ico-travis]: https://img.shields.io/travis/awemapl/basejs/master.svg?style=flat-square
[ico-styleci]: https://styleci.io/repos/12345678/shield

[link-packagist]: https://packagist.org/packages/awemapl/basejs
[link-downloads]: https://packagist.org/packages/awemapl/basejs
[link-travis]: https://travis-ci.org/awemapl/basejs
[link-styleci]: https://styleci.io/repos/12345678
[link-author]: https://github.com/awemapl
[link-contributors]: ../../contributors]
