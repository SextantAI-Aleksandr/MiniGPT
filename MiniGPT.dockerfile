FROM bitnami/pytorch:1.13.1

# This builds a slim image with torch and transformers
# for use with huggingface models. It is for CPU useage:
# See https://huggingface.co/docs/transformers/installation


# Install transformers for CPU
RUN pip3 install transformers[torch]

# Install Starlette for serving API requests
RUN pip3 install starlette uvicorn

# Set the transformers cache to a writeable directory: otherwise you get this error:
#  "There was a problem when trying to write in your cache folder (/.cache/huggingface/hub)."
ENV TRANSFORMERS_CACHE=/tmp/xformer_cache

# run the py/download.py file once so you download and save the Huggingface model 
COPY py/download.py /tmp/
RUN python3 /tmp/download.py

# Run the /app/main.py file using uvicorn unless a different command is specified 
CMD python -m uvicorn main:app --host 0.0.0.0 --port 80


