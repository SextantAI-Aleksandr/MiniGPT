# Minimal Bitnami Torch + Transformers + Starlette = slimface app 
# Based on https://github.com/tiangolo/uvicorn-gunicorn-starlette-docker


from starlette.applications import Starlette
from starlette.responses import JSONResponse
from qa import SageQnA 

sqa = SageQnA()
app = Starlette()


@app.route("/")
async def homepage(request):
    question = request.query_params.get('q', None)
    if not question:
        return JSONResponse({ 'status': 400, 'message':'I have a question: What is your question?' })
    if not question.endswith('?'):
        question += '?'
    answer = sqa.answer(question)
    print('\nQ: {}'.format(question))
    print('A: {}'.format(answer))
    return JSONResponse({ 'status': 200, 'message':answer })
