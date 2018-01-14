"""import base64
from PIL import Image

filename=r'C:\Users\Rob\dev\VisionSystems\OCR\test3.jpg'

image= Image.open(open(filename, 'rb'))
image_read = image.read()
image_64_encode = base64.encodestring(image_read)
image_64_decode = base64.decodestring(image_64_encode)
image_result = open('test3_decode.jpg', 'wb') # create a writable image and write the decoding result
image_result.write(image_64_decode)
"""

"""import base64

def convert(image):
    f = open(image)
    data = f.read()
    f.close()

    string = base64.b64encode(data)
    convert = base64.b64decode(string)

    t = open("example.jpg", "w+")
    t.write(convert)
    t.close()


if __name__ == "__main__":
    convert("C:/Users/Rob/dev/VisionSystems/OCR/test3.jpg")


"""

# base64 encoding converts binary data to plain text
# it stores each group of three binary bytes as a group of four characters from the text set:
#     ABCDEFGHIJKLMNOPQRSTUVWXYZ  abcdefghijklmnopqrstuvwxyz  0123456789+/
#     the = character is used for padding at the end of the data stream
# this way an image file can be represented as a string to transmit or
# a short image can be embedded in code as a string, you can insert newlines at
# convenient locations into this embedded string, they will be ignored when
# decoding with for instance   jpg1 = base64.b64decode(jpg1_b64)
# tested with Python24       vegaseat     06oct2005
import base64
# pick a jpeg file you have and want ...
jpgfile = "C:/Users/Rob/dev/VisionSystems/OCR/test5.jpg"
# note: binary read "rb" is required!
# this gives a one line string ...
#jpg_text = 'jpg1_b64 = \\\n"""' + base64.b64encode(open(jpgfile,"rb").read()) + '"""'
# another option, inserts newlines about every 76 characters, easier to copy and paste!
jpg_text = 'jpg1_b64 = \\\n"""' + base64.encodestring(open(jpgfile,"rb").read()) + '"""'
print jpg_text
# optionally save to a text file
filename = "jpg1_b64.txt"
try:
    fout = open(filename, "w")
    fout.write(jpg_text)
    fout.close()
except IOError:
    print "File %s could not be saved!" % filename