<?php

namespace AwemaPL\BaseJS;

use AwemaPL\BaseJS\AwemaProvider;
use AwemaPL\BaseJS\Exceptions\ExampleException;
use AwemaPL\BaseJS\Exceptions\ExceptionHandler2;
use AwemaPL\BaseJS\Exceptions\Contracts\PublicException as PublicExceptionContract;
use Illuminate\Support\Str;
use AwemaPL\BaseJS\Exceptions\HandlerDecorator;
use AwemaPL\BaseJS\Exceptions\HandlersRepository;
use Illuminate\Contracts\Debug\ExceptionHandler;

class BaseJSServiceProvider extends AwemaProvider
{

    public function boot()
    {
        // register a custom renderer to redirect the user back and show validation errors
        $this->app->make(ExceptionHandler::class)->renderer(function (PublicExceptionContract $e, $request) {
            return response()->json([
                'error'=>[
                    'code' =>$e->getErrorCode(),
                    'message' =>$e->getErrorMessage(),
                    'status' =>$e->getErrorHttpStatus(),
                    'userMessage' =>$e->getErrorUserMessage(),
                    'details' =>$e->getErrorDetails(),
                ]
            ], $e->getErrorHttpStatus(), ['Content-Type' => 'application/json;charset=UTF-8', 'Charset' => 'utf-8'], JSON_UNESCAPED_UNICODE);
        });

        // register a custom reporter to log all exceptions that are instances of - or extend - DebugException
        $this->app->make(ExceptionHandler::class)->reporter(function (PublicExceptionContract $e) {
            if ($e->isErrorReport()){
                $this->app['log']->error($e->getMessage(), ['exception' =>$e]);
            }
            return $e;
        });

        parent::boot();
        if (file_exists($file = __DIR__ . '/helpers.php')) {
            require_once $file;
        }
    }

    public function register()
    {
        parent::register();
        $this->registerExceptionHandlersRepository();
        $this->extendExceptionHandler();
    }

    public function getPackageName(): string
    {
        return 'base-js';
    }

    public function getPath(): string
    {
        return __DIR__;
    }

    /**
     * Register the custom exception handlers repository.
     *
     * @return void
     */
    private function registerExceptionHandlersRepository()
    {
        $this->app->singleton(HandlersRepository::class, HandlersRepository::class);
    }

    /**
     * Extend the Laravel default exception handler.
     *
     * @return void
     */
    private function extendExceptionHandler()
    {
        $this->app->extend(ExceptionHandler::class, function (ExceptionHandler $handler, $app) {
            return new HandlerDecorator($handler, $app[HandlersRepository::class]);
        });
    }
}
