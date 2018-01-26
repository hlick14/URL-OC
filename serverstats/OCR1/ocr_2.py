from PIL import Image
import numpy as np
import pytesseract
import cv2
import base64
import os
import StringIO
import gzip
import sys
from io import BytesIO
from socket import socket
reload(sys)
sys.setdefaultencoding('utf-8')
ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
# pytesseract.pytesseract.tesseract_cmd = 'C://tesseract//tesseract.exe'

myList  = range(3, 1000)
myList2  = range(1, 30)
oddsList = [x for x in myList if x % 2 != 0]
oddsList2 = [x for x in myList2 if x % 2 != 0]
NewValue = (((70 - 0) * 100) / 100) + -50


dir = os.path.dirname(__file__)

imageText=os.path.join(dir,'out.txt') 

arglen = len(imageText)
if arglen > 1:
	b64file = open(imageText, 'rb').read()
	# b64file += 'data:image/jpg;base64'+ b64file
	b64file += '=' * (-len(b64file) % 4)  # restore stripped '='s
	imageDecoded = base64.decodestring(b64file)
	image_result = ('current.jpg','wb')
	image_result.write(imageDecoded)
	print 'created image'


	r = open('current.jpg','rb').read()
	img_array = np.asarray(bytearray(r), dtype=np.uint8)
	flags = cv2.COLOR_BGR2GRAY
	uuuimg = cv2.imdecode(img_array, flags)

      
else:
	print('No file specified!')


image = uuuimg;

resized = cv2.resize(image, None, fx=2, fy=2, interpolation= cv2.INTER_CUBIC)
gray=cv2.cvtColor(resized,cv2.COLOR_BGR2GRAY)
blur = cv2.blur(gray, (oddsList2[1], oddsList2[1]))
th2 = cv2.adaptiveThreshold(blur, 255, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY, oddsList[33], NewValue)

filename2='script_img2.png'
cv2.imwrite(filename2,th2)
cv2.imwrite( filename2, th2)
img = Image.open(filename2)

# print(pytesseract.image_to_string(img,lang='eng', config = tessdata_dir_config)) used in node directly
print 'Python Finished'