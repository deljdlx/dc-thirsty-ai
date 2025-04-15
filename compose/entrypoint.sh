#!/bin/sh
# Démarre PHP-FPM
php-fpm -D

# Démarre Nginx
nginx -g 'daemon off;'
