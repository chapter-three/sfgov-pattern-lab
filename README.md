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

### Generate Pattern Lab public instance.

`$ php core/console --generate`

#### Other commands:

`$ php core/console --help`

`$ php core/console --server`   

Only watches the twig template changes:

`$ php core/console --watch`

### Using gulp.

### Documentation

- browserSync script tag added to `pattern-lab/source/_meta/00-head.twig`
- link stylesheet from google Fonts added to `pattern-lab/source/_meta/00-head.twig`
