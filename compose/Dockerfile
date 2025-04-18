FROM php:8.3-fpm-bookworm

RUN apt-get update \
    && apt-get install -y vim \
    && apt-get install -y cron \
    && apt-get install -y git \
    && apt-get install -y lsb-release \
    && apt-get install -y wget \
    && apt-get install -y tree \
    && apt-get install -y zip \
    && apt-get install -y curl \
    && apt-get install -y unzip \
    && apt-get install -y jq \
    && apt-get install -y ntp \
    && apt-get install -y imagemagick\
    && apt-get install -y gnupg2 \
    && apt-get install -y build-essential \
    && apt-get install -y libzip-dev \
    && apt-get install -y libpng-dev \
    && apt-get install -y libjpeg-dev \
    && apt-get install -y libfreetype6-dev \
    && apt-get install -y libmemcached-dev \
    && apt-get install zlib1g-dev \
    && apt-get install -y libxml2-dev \
    && apt-get install -y  libssl-dev \
    && apt-get update && apt-get install -y sqlite3 libsqlite3-dev\
    && apt-get update && apt-get install -y telnet\
    && apt-get install -y default-mysql-client \
    && apt-get install -y nodejs \
    && apt-get install -y npm \
    # =========================================
    && apt-get clean && rm -rf /var/lib/apt/lists/* \

    # =========================================
    && apt-get update && apt-get install -y nodejs npm \
    # =========================================
    &&  git config --global user.email "root@docker" \
    &&  git config --global user.name "Root Docker"

RUN pecl install xdebug memcached


RUN apt-get update \
    && apt-get install -y \
        librabbitmq-dev \
        libpq-dev \
    && pecl install redis amqp \
    && docker-php-ext-enable redis amqp


RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
        gd \
        zip \
        mysqli \
        intl \
        pdo \
        pdo_sqlite \
        pdo_mysql \
        pdo_pgsql \
        bcmath \
    && docker-php-ext-enable xdebug memcached redis amqp \
    && curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

RUN apt install -y protobuf-compiler


# install nginx
RUN apt-get update && apt-get install -y nginx \
    && apt-get install -y nodejs npm \
    && npm install -g n \
    && n stable


# Copie du fichier de configuration Nginx et du site PHP
# COPY nginx/default.conf /etc/nginx/sites-available/default
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Exposition du port 80
EXPOSE 80

# Démarrage de PHP-FPM et Nginx
ENTRYPOINT ["/bin/sh", "-c", "/entrypoint.sh"]
