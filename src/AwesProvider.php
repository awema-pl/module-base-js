<?php

namespace AwemaPL\BaseJS;

use Illuminate\Support\ServiceProvider;

abstract class AwemaProvider extends ServiceProvider
{

    /**
     * Return package name
     *
     * @return string
     */
    abstract public function getPackageName(): string;

    /**
     * Return package path
     *
     * @return string
     */
    abstract public function getPath(): string;

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        $this->publishes([
            $this->getPath()."/../config/{$this->getPackageName()}.php" => config_path("{$this->getPackageName()}.php"),
        ], 'config');

        $this->publishes([
            $this->getPath().'/../dist' => public_path("static/{$this->getPackageName()}"),
        ], 'awema-public');

        $this->loadViewsFrom($this->getPath().'/../resources/views', $this->getPackageName());

        (new PackageTools())->addSrc($this->getPackageName());
    }

    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        $this->mergeConfigFrom(
            $this->getPath()."/../config/{$this->getPackageName()}.php",
            $this->getPackageName()
        );
    }

}
