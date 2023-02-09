#!/bin/bash

if [[ "$1" == "--dev" ]]; then 
	# For qa.py development using a CLI:
	# Run $ ./run-app.sh --dev
	sudo docker run -v "${PWD}/py:/app" --rm -ti -p 80:80 mini_gpt:1.0 /bin/bash
else 
	# For normal usage:
	# Run $ ./run-app.sh
	sudo docker run -v "${PWD}/py:/app" --rm --name mini_gpt -p 80:80 mini_gpt:1.0
fi

