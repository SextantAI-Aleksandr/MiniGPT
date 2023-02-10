#!/bin/bash
# this deploys a NGINX container that serves all your websites! 
# EXAMPLE USAGE:
# $ ./spinup.sh prod up
# $ ./spinup.sh prod down
# $ ./spinup.sh dev up
# $ ./spinup.sh dev down


mode="$1" # dev or prod
action="$2" # up or down


if [ $mode == "dev" ]; then 
	port_http="50080"
	port_https="50443"
	WEBLOG="/var/log/html_dev"
elif [ $mode == "prod" ]; then 
	port_http="80"
	port_https="443"
	WEBLOG="/var/log/html"
else 
	echo "The first argument must be 'dev' or 'prod' !"
	exit 1
fi 

container_name="html_nginx_$mode"
 
if [ $action == "up" ]; then
	sudo mkdir -p $WEBLOG
        sudo chown -R $USER:$USER $WEBLOG
	echo "spinning up $container_name"
	sudo docker run -d \
		-p "0.0.0.0:$port_http:80" \
		-p "0.0.0.0:$port_https:443" \
		-v "$WEBLOG:/host/logs" \
		-v "$HOME/Repos/Sextant/html/pages:/host/html:ro" \
		-v "$HOME/Repos/Sextant/zenith/zenith_js:/host/html/zenith_js:ro" \
		-v "$HOME/Repos/Sextant/spindrift/html:/host/spindrift:ro" \
		-v "$HOME/Repos/Sextant/html/nginx/nginx.conf:/etc/nginx/nginx.conf:ro" \
		-v "$HOME/.secrets/cloudflare_certs:/etc/ssl:ro" \
		--restart=on-failure \
		--name=$container_name \
		html_nginx:prod
elif [ $action == "down" ]; then
	echo "shutting down and removing $container_name"
	sudo docker stop $container_name 
	sudo docker container rm $container_name 
else 
	echo "Error! The second argument must be 'up' or 'down'"
	exit 1
fi



