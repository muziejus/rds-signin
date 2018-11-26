pidfile "puma.pid"
bind "tcp://0.0.0.0:9292"
workers Integer(ENV['WEB_CONCURRENCY'] || 1)
threads_count = Integer(ENV['MAX_THREADS'] || 5)
threads threads_count, threads_count

rackup "config.ru"
stdout_redirect 'access.log', 'error.log'

daemonize
