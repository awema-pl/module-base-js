<?php

namespace AwemaPL\BaseJS;

use Illuminate\Support\Facades\File;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider;

abstract class AwemaProvider extends AuthServiceProvider
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

    public function addSrc()
    {
        (new PackageTools())->addSrc($this->getPackageName());
    }

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

        $distPath = $this->getPath().'/../dist';

        if (File::exists($distPath)){
            $this->publishes([
                $this->getPath().'/../dist' => public_path("assets/awema-pl/{$this->getPackageName()}"),
            ], 'awema-pl-public');
        }

        $this->loadViewsFrom($this->getPath().'/../resources/views', $this->getPackageName());

        $this->addSrc();

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
