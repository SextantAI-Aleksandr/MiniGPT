#!/bin/bash

sudo docker stop mini_gpt
sudo docker stop mini_gpt_nginx
sudo docker container rm mini_gpt
sudo docker container rm mini_gpt_nginx

