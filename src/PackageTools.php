<?php

namespace AwemaPL\BaseJS;

use Composer\Console\Application;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\View;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Config;
use Symfony\Component\Console\Input\ArrayInput;
use Symfony\Component\Console\Output\StreamOutput;
use Symfony\Component\Finder\Finder;

/**
 * Class PackageTools
 * @package AwemaPL\BaseJS
 */
class PackageTools
{

    /**
     * Add src config array to all views template
     *
     * @param $package
     */
    public function addSrc($package): void
    {
        if (config('base-js.auto_public_src')){
            $this->copyDistToPublic($package);
        }

        $packageNamespace = "awema-pl/$package";

        if (Cache::has($packageNamespace)) {
            $srcs = Cache::get($packageNamespace);
        } else {

            $version = $this->getAwemaIOPackageVersion($packageNamespace);

            $pattern = array_merge([
                '{package_name}' => $packageNamespace,
                '{package_version}' => $version,
                '{package}' => $package
            ], (array)$this->getDefaultParam($package, 'placeholders'));
            $dist = (array)$this->getDefaultParam($package, 'dist', 'default');

            if ($this->isDevVersion($version)) {
                $url = $this->getDefaultParam($package, 'dev_src_url');
            }else {
                $url = $this->getDefaultParam($package, 'src_url');
            }

            $srcs = [];
            foreach ($dist as $src) {
                $patternWithSrc = array_merge($pattern, ['{src}' => $src]);
                $srcs[$this->getSrcType($src)][$package][] = str_replace(array_keys($patternWithSrc), array_values($patternWithSrc), $url);
            }
            Cache::forever($packageNamespace, $srcs);
        }


        View::composer('*', function ($view) use ($srcs) {
            $viewData = $view->getData('src');
            $viewDataSrc = array_replace_recursive($viewData['src'] ?? [], $srcs);
            $view->with('src', $viewDataSrc);
        });
    }

    /**
     * Get src type
     *
     * @param string $src
     * @return string
     */
    public function getSrcType(string $src)
    {
        if (mb_substr($src, -9) === 'legacy.js') return 'legacy';
        return (new \SplFileInfo($src))->getExtension();
    }

    /**
     * Check if it's a dev version or not
     *
     * @param string $string
     * @return bool
     */
    private function isDevVersion($string)
    {
        return (mb_substr($string, 0, 2, "UTF-8") == "v-");
    }

    /**
     * Get default param
     *
     * @param $package
     * @param string $param
     * @param string|null $default
     * @return mixed
     */
    public function getDefaultParam($package, string $param, string $default = null)
    {
        $default = $default ?: $param;
        $param = Config::get("{$package}.{$param}");
        return $param ?: Config::get("base-js.{$default}");
    }

    /**
     * Get all awema-pl packages version
     *
     * @param string $packageNamespace
     * @param string $key
     * @return string
     */
    public function getAwemaIOPackageVersion(string $packageNamespace, $key = 'awema-pl')
    {
        if (Cache::has($key)) {
            $versions = Cache::get($key);
        } else {
            putenv('HOME='.base_path());

            chdir(base_path());

            $stream = fopen('php://temp', 'w+');

            $output = new StreamOutput($stream);

            $input = new ArrayInput(array('command' => 'show'));

            $application = new Application();

            $application->setAutoExit(false);

            $application->run($input, $output);

            rewind($stream);

            $packages = $this->parseVersionFromComposer(
                explode(PHP_EOL, stream_get_contents($stream))
            );

            fclose($stream);

            $versions = collect($packages)->filter(
                function($i, $k) {
                    return preg_match("/awema-pl/", $k);
                }
            )->toArray();

            Cache::forever($key, $versions);
        }
        return $versions[$packageNamespace] ?? 'undefined';
    }

    /**
     * parse version from composer output
     *
     * @param array $versions
     * @return array
     */
    public function parseVersionFromComposer(array $versions)
    {
        $out = [];
        foreach ($versions as $v) {
            preg_match('/^([^ ]+).*?(v[^ ]+)/', $v, $match);
            if (isset($match[1]) && isset($match[2])) {
                $out[$match[1]] = $match[2];
            }
        }
        return $out;
    }

    /**
     * Copy dist to public
     *
     * @param $package
     * @param string $type
     */
    public function copyDistToPublic($package)
    {
        $distDir = base_path("vendor/awema-pl/module-$package/dist");
        $files = (new Finder())->in($distDir);
        foreach ($files as $file){
            $relativePath = $file->getRelativePathname();
            $path = $file->getRealPath();
            $publicPath  = public_path("assets/awema-pl/$package/$relativePath");
            if ($file->isDir() && !File::exists($publicPath)){
                mkdir($publicPath, 0777, true);
            } else if ($file->isFile() && (!File::exists($publicPath) || hash_file('md5',$path) !==hash_file('md5',$publicPath) )){
                File::copy($path, $publicPath);
                dump('copy');
            }
        }
    }

}
