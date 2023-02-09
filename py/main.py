# Minimal Bitnami Torch + Transformers + Starlette = slimface app 
# Based on https://github.com/tiangolo/uvicorn-gunicorn-starlette-docker

from starlette.applications import Starlette
from starlette.responses import JSONResponse

app = Starlette()


@app.route("/")
async def homepage(request):
    jz = {"message": "Hello From Starlette!"}
    # the query paramaters are accessible as a dict from request.query_params
    jz.update(dict(request.query_params))
    return JSONResponse(jz)
