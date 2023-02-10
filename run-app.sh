#!/bin/bash

if [[ "$1" == "--cli" ]]; then 
	# For qa.py development using a CLI:
	# Run $ ./run-app.sh --cli
	sudo docker run -v "${PWD}/py:/app" --rm -ti -p 80:80 mini_gpt:1.0 /bin/bash
else 
	# For normal usage:
	# Run $ ./run-app.sh
	sudo docker run -d -v "${PWD}/py:/app" --rm --name mini_gpt -p 15080:80 mini_gpt:1.0

	sudo docker run -d \
		-p "0.0.0.0:80:80" \
		-v "$PWD/nginx.conf:/etc/nginx/nginx.conf:ro" \
		-v "$PWD/html:/html" \
		--name="mini_gpt_nginx" \
		nginx:mainline
fi

