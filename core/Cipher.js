const crypto = require('crypto');
const key = '12345678';

// 扩展加密类，如需加密文本内容可以使用此类
class Cipher {

  encode(str) {
    const cipher = crypto.createCipher('des-ecb', key);
    let encrypted = cipher.update(str, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }

  decode(str) {
    const decipher = crypto.createDecipher('des-ecb', key);
    let decrypted = decipher.update(str, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  md5(str) {
    const md5 = crypto.createHash('md5');
    return md5.update(str).digest('hex');
  }
}

module.exports = Cipher;