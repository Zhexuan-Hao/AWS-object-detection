import requests
import os
import time
import re

from selenium import webdriver


def sign_in():
    d_path = #file driver path here
    driver = webdriver.Chrome(executable_path=d_path)
    driver.get("https://tagtagimagestorage.auth.us-east-1.amazoncognito.com/login?client_id=7i9nfj1hsq4caaj77ifibn3cf2&response_type=token&scope=openid+profile&redirect_uri=https://620t1q00e4.execute-api.us-east-1.amazonaws.com/prod")
    id_token=""
    while(id_token==""):
        for req in driver.requests:
            if (req.response and req.response.headers["Location"]):
                if(re.search(pattern="id_token=.*?&", string=req.response.headers["Location"])):
                    id_token=re.search(pattern="id_token=(.*?)&", string=req.response.headers["Location"]).group(1)
    print("\n id_token:"+id_token)
    driver.quit()
    return id_token

def sign_up():
    d_path = #file driver path here
    driver = webdriver.Chrome(executable_path=d_path)
    driver.get("https://tagtagimagestorage.auth.us-east-1.amazoncognito.com/signup?client_id=7i9nfj1hsq4caaj77ifibn3cf2&response_type=token&scope=openid+profile&redirect_uri=https://620t1q00e4.execute-api.us-east-1.amazonaws.com/prod")
    id_token=""
    while(id_token==""):
        for req in driver.requests:
            if (req.response and req.response.headers["Location"]):
                if(re.search(pattern="id_token=.*?&", string=req.response.headers["Location"])):
                    id_token=re.search(pattern="id_token=(.*?)&", string=req.response.headers["Location"]).group(1)
    print("\n id_token:"+id_token)
    driver.quit()
    return id_token

def sign_out(id_token):
    d_path = #file driver path here
    driver = webdriver.Chrome(executable_path=d_path)
    url="https://tagtagimagestorage.auth.us-east-1.amazoncognito.com/logout?response_type=token&client_id=5d5keodtlciulndhmc4op051m6"
    driver.get(url)
    driver.quit()


