module.exports = {
  presets: [
    ['@babel/preset-env', {
      useBuiltIns: 'usage',
      // targets: { esmodules: true },
      // debug: true,
      exclude: [
          'web.dom.iterable',
          'es6.promise',
          'es6.object.keys',
          'es6.object.assign',
          'es7.promise.finally',
          'es6.string.iterator',
          'es6.function.name'
      ]
    }]
  ]
};
