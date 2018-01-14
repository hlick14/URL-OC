import cv2
import numpy as np

img = cv2.imread('C:/Users/Rob/dev/VisionSystems/OCR/test3.jpg')

grayscaled = cv2.cvtColor(img,cv2.COLOR_BGR2GRAY)


th = cv2.adaptiveThreshold(grayscaled, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 171, 1)
cv2.imshow('original',img)
cv2.imshow('Adaptive threshold',th)
cv2.waitKey(0)
cv2.destroyAllWindows()


#b,g,r = cv2.split(th)           # get b,g,r
#rgb_img = cv2.merge([r,g,b])     # switch it to rgb

# Denoising
dst = cv2.fastNlMeansDenoisingColored(th,None,10,10,7,21)