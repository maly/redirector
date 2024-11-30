# Docker NGINX Proxy companion for redirecting

A simple way to redirect your apex domains to new domains.

## Concept

1. Set TXT record in a DNS this way: TXT _redirector.foo.com bar.com
2. set A record for foo.com to the server IP
3. Redirector will do the rest.

## Usage

1. Copy `docker-compose.yml.example` to `docker-compose.yml` and edit it.
2. Run `docker compose up -d`

