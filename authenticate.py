from browsermobproxy import Server
from selenium import webdriver
import re

def sign_in():
    # Start the proxy server
    server = Server("D:/browsermob-proxy")
    server.start()
    proxy = server.create_proxy()

    # Configure the Selenium driver to use the proxy
    chrome_options = webdriver.ChromeOptions()
    chrome_options.add_argument('--proxy-server={0}'.format(proxy.proxy))
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chrome_options)

    # Start recording network traffic
    proxy.new_har("har")

    driver.get("https://fit5225assignment2.auth.us-east-1.amazoncognito.com/login?client_id=7o9kdhn6j4g1mq1r6eq0tj6bd7&response_type=token&scope=email+openid+phone&redirect_uri=https%3A%2F%2Fyxdcduftn7.execute-api.us-east-1.amazonaws.com%2Fprod")
    id_token = ""
    while (id_token == ""):
        har = proxy.har  # Get the recorded HAR (HTTP Archive) data
        for entry in har['log']['entries']:
            if entry['response']['status'] == 302:
                location = entry['response']['headers'].get('Location')
                if location and re.search(pattern=r"id_token=.*?&", string=location):
                    id_token = re.search(pattern=r"id_token=(.*?)&", string=location).group(1)
                    break

    # Stop the proxy server and quit the driver
    server.stop()
    driver.quit()

    return id_token



