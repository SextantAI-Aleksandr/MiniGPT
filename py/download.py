# This will download a model from Huggingface if it cannot be found locally 
# It is used in ./build-image.sh to add the model once to the Docker image 

from transformers import AutoModelForCausalLM, AutoTokenizer

_ = AutoTokenizer.from_pretrained("microsoft/DialoGPT-medium")
_ = AutoModelForCausalLM.from_pretrained("microsoft/DialoGPT-medium")
