from flask import Flask, request, jsonify, render_template
from json import loads, dumps
import numpy as np

from PIL import Image
import base64
import torch
import torchvision
import argparse
import cv2

from options.test_options import TestOptions
from models import pix2pix_model, networks
from util import util
from data import find_dataset_using_name, create_dataset

model = networks.define_G(input_nc=3,
                          output_nc=3,  
                          ngf=64, 
                          netG="unet_256")

model = torch.load("./checkpoints/latest_net_G.pth")
# model.load_state_dict(state_dict)
model.eval()

print("model loaded!")
app = Flask(__name__, static_url_path='/static')

@app.route('/')
def home():
    return render_template("home.html")

@app.route('/generate/', methods=['POST'])
def prediction_payload():
    #name = request.json['name']
    #print(request.json)
    s = request.json['image']

    # coords = request.json['coords']
    # print(coords)

    imgdata = base64.b64decode(s)
    filename = 'some_image.jpg'  # I assume you have a way of picking unique filenames
    with open(filename, 'wb') as f:
        f.write(imgdata)

    #q = base64.decodebytes()
    input_image = np.asarray(Image.open('some_image.jpg').convert('RGB'))

    input_transformed = np.transpose(((input_image/255.0)*2.0-1.0),(2,0,1))
    input_tensor = torch.FloatTensor(input_transformed).unsqueeze(0)
    
    out_img = util.tensor2im(model(input_tensor))
    print(out_img.shape)
    
    # 可能用不到
    out_img = cv2.resize(out_img,None,fx=0.5, fy=0.5, interpolation = cv2.INTER_CUBIC)

    
    cv2.imwrite("static/images/outimage.jpg",out_img)

    with open("static/images/outimage.jpg", "rb") as image_file:
        encoded_image = base64.b64encode(image_file.read())
        req_file = encoded_image.decode('utf-8')

    headers = {
    'Content-Type': 'application/json',  # This is important
    }

    payload = dumps({'predicted':req_file})

    piximagecutted()


    return jsonify(payload)





def piximagecutted():
    # 读取模型生成图片
    img = cv2.imread("static/images/outimage.jpg")
    shapes_coords = request.json['shapes_coord']
    print(shapes_coords)

    # x_a, y_a, mouseX - x_a, mouseY - y_a
    #裁剪坐标[y0:y1,x0:x1]
    for i in range(0,len(shapes_coords) ):
        x0 = int(shapes_coords[i][0])
        x1 = int(shapes_coords[i][2]+shapes_coords[i][0])
        y0 = int(shapes_coords[i][1])
        y1 = int(shapes_coords[i][3]+shapes_coords[i][1])
        print(x0,x1,y0,y1)

        cropArea = img[y0:y1,x0:x1]
        route = 'static/images/labelcanvas/imgcutted_'+str(i)+'.png'
        print(route)
        cv2.imwrite(route,cropArea)
        i = i+1



# 发现端口不同会发生一些问题，比如后续贴图的时候会出现重叠
# 这个应该可以视作一个bug，但是需要更多的用户data是否是常见的内容
if __name__ == "__main__":
    app.run(port=1089,debug=True)

