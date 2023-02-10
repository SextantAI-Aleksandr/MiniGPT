# This file contains the logic for doing Q&A based on Reddit conversations
# Intro to DialoGPT https://huggingface.co/microsoft/DialoGPT-medium?text=Hey+my+name+is+Julien%21+How+are+you%3F 

print('qa.py: Loading libraries...')
from os import environ 
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch


class SageQnA:

    def __init__(self, model_name=None):
        if model_name == None:
            model_name = environ.get('MODEL', 'microsoft/DialoGPT-medium')
        # set immutable properties
        self.model_name = model_name 
        self.tokenizer = AutoTokenizer.from_pretrained(model_name, padding_side='left')
        self.model = AutoModelForCausalLM.from_pretrained(model_name)
        # set mutable properties
        self.step = 0
        self.chat_history_ids = None 

    def answer(self, question: str) -> str:
        # encode the new user input, add the eos_token and return a tensor in Pytorch
        new_user_input_ids = self.tokenizer.encode(question + self.tokenizer.eos_token, return_tensors='pt')
        # generate a response while limiting the total chat history to 1000 tokens, 
        self.chat_history_ids = self.model.generate(new_user_input_ids, max_length=1000, pad_token_id=self.tokenizer.eos_token_id)
        self.step += 1 
        # pretty print last ouput tokens from bot
        ans = self.tokenizer.decode(self.chat_history_ids[:, new_user_input_ids.shape[-1]:][0], skip_special_tokens=True)
        return ans 


if __name__ == '__main__':
    # if you run this file by itself, take user input for dialog
    print('qa.py: Instantiating a SageQnA...')
    sqa = SageQnA()
    print('qa.py: Ready!')
    while True:
        question = input('\n> Question: ')
        answer = sqa.answer(question)
        print('> Answer: {}'.format(answer)) 
