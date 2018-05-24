# SFGOV Pattern Library.

## this project uses:

- pattern-lab/edition-twig-standard

## Requirements:

- php-cli
- nodejs
- composer

## TODO:

- check versions for php-cli
- add gulp
- migrate all scss from uswds to pattern lab using protons.
- add gulp to watch SCSS and JS

### Installation:

`$ cd pattern-lab`

`$ composer install`

  answer the questions asked:
  
  - the path ./public/ already exists. merge or replace with the contents of pattern-lab/styleguidekit-assets-default package? `M`
  - update the config option styleguideKitPath? `n`

`$ php pattern-lab/core/console --generate`

`$ npm install`

### Generate Pattern Lab public instance.

`$ php core/console --generate`

#### Other commands:

`$ php core/console --help`

`$ php core/console --server`   

Only watches the twig template changes:

`$ php core/console --watch`

### Using gulp.

just run:

`$ gulp`

### Documentation

- browserSync script tag added to `pattern-lab/source/_meta/00-head.twig`
- link stylesheet from google Fonts added to `pattern-lab/source/_meta/00-head.twig`

# TODO:

- replace bourbon neat with something similar to css grid, like susy3.
- implement JS atomic arrangement and compilation.
