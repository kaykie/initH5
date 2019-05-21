/* eslint-disable */
export default class Util {
  static isUndefined(value) {
    return typeof value === 'undefined';
  }

  static isDefined(value) {
    return typeof value !== 'undefined';
  }

  static isObject(value) {
    // http://jsperf.com/isobject4
    return value !== null && typeof value === 'object';
  }

  static isString(value) {
    return typeof value === 'string';
  }

  static isNumber(value) {
    return typeof value === 'number';
  }

  static isDate(value) {
    return toString.call(value) === '[object Date]';
  }

  static isFunction(value) {
    return typeof value === 'function';
  }

  static isRegExp(value) {
    return toString.call(value) === '[object RegExp]';
  }

  static isBoolean(value) {
    return typeof value === 'boolean';
  }

  static isElement(node) {
    return !!(node &&
      (node.nodeName  // we are a direct element
        || (node.prop && node.attr && node.find)));  // we have an on and find method part of jQuery API
  }

  static isArray = Array.isArray;

  /**
   * 数字转字符串
   */
  static numToString(num) {
    if (Util.isNumber(num)) {
      return num + '';
    } else {
      return num;
    }
  }

  /*
   * base64格式图片压缩且上线180kB，无下限
   * file:
   * file.url 图片base64
   * callback 回调
   */
  static getImgBase64(base64Url, callback) {
    const that = this;
    const img = new Image();
    img.src = base64Url;
    img.onload = function () {
      const sourceData = {
        sourceW: img.width,
        sourceH: img.height
      };
      const res = {
        resW: img.width,
        resH: img.height,
        url: base64Url,
      };
      let canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      // 如果图片宽小于240，高小于320，需要放大图片( 门禁设备有最小宽高限制 )
      if (res.resH < 320) {
        res.resW = (res.resW * 320) / res.resH;
        res.resH = 320;
      } else if (res.resW < 240) {
        res.resH = (res.resH * 240) / res.resW;
        res.resW = 240;
      } else {
        res.resW = (res.resW * 3) / 4;
        res.resH = (res.resH * 3) / 4;
      }
      canvas.width = res.resW;
      canvas.height = res.resH;
      // 将图片绘制到canvas上
      ctx.drawImage(img, 0, 0, sourceData.sourceW, sourceData.sourceH, 0, 0, res.resW, res.resH);
      res.url = canvas.toDataURL('image/jpeg', 1);

      if (getBase64Size(res.url) > 1024) {
        that.getImgBase64(res.url, callback);
        return;
      }
      callback(res);
      // canvas = null;
    };
  }

  /*
  * 人脸截出来后 放大
  */
  static imgClipHandle({location, url, faceIQA}) {
    let canvas = document.createElement('canvas'),
      img = new Image();
    img.src = url;

    return new Promise((resolve, reject) => {
      img.onload = function () {
        const ctx = canvas.getContext('2d');
        // 如果faceIQA小于60，获取需要放大的比例，将其放大到140(此数值为相对，可更改)
        let ratioX = 140 / faceIQA;
        const offsetX = location.width * ratioX / 2, offsetY = location.height * ratioX / 2;
        // 绘制canvas相关
        canvas.width = location.width * ratioX + offsetX * 2 > this.width * ratioX ? this.width * ratioX : location.width * ratioX + offsetX * 2;
        canvas.height = location.height * ratioX + offsetX * 2 > this.height * ratioX ? this.height * ratioX : location.height * ratioX + offsetY * 2;
        ctx.drawImage(this, -location.x * ratioX + offsetX > 0 ? 0 : -location.x * ratioX + offsetX, -location.y * ratioX + offsetY > 0 ? 0 : -location.y * ratioX + offsetY, this.width * ratioX, this.height * ratioX);
        // document.getElementById('test').appendChild(canvas);
        const base64 = canvas.toDataURL('image/jpeg', 1);
        // 如果裁取出的图片大于200kb 继续压缩
        const size = getBase64Size(base64);
        document.getElementById('test').appendChild(canvas);
        console.log(size);
        if (size > 200) {
          getImgBase64(base64, (res) => {
            resolve(res.url);
          });
          return;
        }
        resolve(base64);


        // img.width = img.width + 200;
        // img.height = img.height + 200;
        // document.getElementById('test').appendChild(this);
        // let imgw = location.width ,
        //   imgH = location.height;
        // let ctx = canvas.getContext('2d');
        // console.log(location);
        // canvas.width = img.width;
        // canvas.height = img.height;
        // 避免图片变形
        // if (location.width < location.height) {
        //   imgw = location.width + 100;
        //   imgH = location.height + 100 - (location.height - location.width);
        //   console.log(imgw + ':' + imgH);
        // } else {
        //   imgw = location.width + 100 - (location.width - location.height);
        //   imgH = location.height + 100;
        //   console.log(imgw + ':' + imgH);
        // }
        // 这种情况不存在，本身加了100px，无论如何图片截取部分都大于100px
        // let differW = newImgSize - (location.width + 100);
        // let differH = newImgSize - (location.height + 100);
        // if (differW > 0) {
        //   imgw = location.width + 100 + differW;
        // }
        // if (differH > 0) {
        //   imgH = location.height + 100 + differH;
        // }
        // ctx.drawImage(
        //   img,
        //   location.x - 50,
        //   location.y - 50,
        //   imgw,
        //   imgH,
        //   0,
        //   0,
        //   newImgSize,
        //   newImgSize
        // );
        // const base64 = canvas.toDataURL('image/jpeg');
        // resolve(base64);
      };
    });

  }


  /*
   * base64图片旋转
   * file:
   * file.url 图片base64
   * callback 回调
   */
  static setBase64Rotate(file, callback) {
    const img = new Image(), result = file;
    img.src = file.url;
    img.onload = function () {
      let canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.translate(img.width / 2, img.height / 2);
      ctx.rotate(90 * Math.PI / 180);
      ctx.drawImage(img, 0 - img.height / 2, 0 - img.width / 2, img.height, img.width);
      result.url = canvas.toDataURL('image/jpeg', 1);
      callback(result);
    };
  }

  /*
   * base64格式图片获取size
   * base64url base64
   */
  static getBase64Size(base64url) {
    let str = base64url.replace('data:image/jpeg;base64,', '');
    let equalIndex = str.indexOf('=');
    if (str.indexOf('=') > 0) {
      str = str.substring(0, equalIndex);
    }
    let strLength = str.length;
    let size = (strLength - (strLength / 8 * 2)) / 1024;
    console.log(size);
    return parseInt(size);
  }

}

/*
  * base64格式图片压缩且上线180kB，无下限
  * file:
  * file.url 图片base64
  * callback 回调
  */
function getImgBase64(base64Url, callback) {
  const that = this;
  console.log(that);
  const img = new Image();
  const sizeOrigin = getBase64Size(base64Url);
  // console.log(that.getBase64Size(file.url))
  img.src = base64Url;
  img.onload = function () {
    const sourceData = {
      sourceW: img.width,
      sourceH: img.height
    };
    const res = {
      resW: img.width,
      resH: img.height,
      url: base64Url,
      size: sizeOrigin
    };
    let canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (res.resH < 320) {
      res.resW = (res.resW * 320) / res.resH;
      res.resH = 320;
    } else if (res.resW < 240) {
      res.resH = (res.resH * 240) / res.resW;
      res.resW = 240;
    } else {
      res.resW = (res.resW * 3) / 4;
      res.resH = (res.resH * 3) / 4;
    }
    canvas.width = res.resW;
    canvas.height = res.resH;
    ctx.drawImage(img, 0, 0, sourceData.sourceW, sourceData.sourceH, 0, 0, res.resW, res.resH);
    res.url = canvas.toDataURL('image/jpeg', 1);
    if (getBase64Size(res.url) > 220) {
      getImgBase64(res.url, callback);
      return;
    }
    callback(res);
    // canvas = null;
  };
}


/*
   * base64格式图片获取size
   * base64url base64
   */
function getBase64Size(base64url) {
  let str = base64url.replace('data:image/jpeg;base64,', '');
  let equalIndex = str.indexOf('=');
  if (str.indexOf('=') > 0) {
    str = str.substring(0, equalIndex);
  }
  let strLength = str.length;
  let size = (strLength - (strLength / 8 * 2)) / 1024;
  console.log(size);
  return parseInt(size);
}
