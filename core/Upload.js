const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const staticPath =  '/upload/';
const rootPath = path.join(process.cwd(), '/static/', staticPath);

class Upload{

  constructor (ext = '.jpg,.png,.jpeg') {
    // Set up file extension name
    this.exts = ext;
  }

  stat (path) {
    // node 8+ util.promisify(fs.stat);
    return new Promise((resolve) => {
      fs.stat(path, (err, stats) => resolve(err ? null : stats))
    })
  }

  isExist (path) {
    return new Promise((resolve) => {
      fs.access(path, (err) => resolve(!(err && err.code === 'ENOENT')))
    })
  }

  mkdir (dir) {
    // node 10+ { recursive: true }
    return new Promise((resolve) => {
      fs.mkdir(dir, err => resolve(err));
    })
  }

  getYMD() {
    const date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth()+1;
    let day = date.getDate();
    if(month<10) month = '0'+month;
    if(day<10) day = '0'+day;
    return `${year}${month}${day}`;
  }

  getFileExt (fileName) {
    return fileName.split('.').pop();
  }

  createFileName (fileName) {
    const ext = this.getFileExt(fileName);
    if(!ext || this.exts.indexOf(ext.toLowerCase()) === -1) return false;
    return +new Date() + Math.floor(Math.random() * 10000);
  }

  async deepDir (dir) {
    let stat = await this.stat(dir);
    if (stat && stat.isDirectory()) {
      return true
    } else if (stat) {
      return false
    }

    let tempDir = path.parse(dir);
    let status = await this.deepDir(tempDir.dir);
    if (status) {
      await this.mkdir(dir)
    }
    return status;
  }

  async putFile(file, text) {
    const date = this.getYMD();
    const fileDir = rootPath + date;
    const hasDir = await this.deepDir(fileDir);
    if(hasDir) {
      const reader = fs.createReadStream(file.path);
      const fileName = this.createFileName(file.name);
			let ext = this.getFileExt(file.name);
      if(fileName && ext) {
				ext = ext.toLowerCase();
        // 如果存在照片描述文本，文本将会保存为txt格式，存放到照片目录
        if(text) {
          fs.writeFileSync(path.join(fileDir, fileName + '.txt'), text);
        }

        const filePath = path.join(fileDir, fileName + '.' + ext);
        const fileThumbPath = path.join(fileDir, fileName + '_thumb.' + ext);
        const writeFileStream = fs.createWriteStream(filePath);
        const writeThumbStream = fs.createWriteStream(fileThumbPath);

        // 缩略图宽度
        let thumbnailWidth = 200;

        // 照片压缩并生成缩略图
        if(ext === 'jpeg' || ext === 'jpg') {
          reader.pipe(sharp().rotate().resize(thumbnailWidth)).pipe(writeThumbStream);
          reader.pipe(sharp().rotate().jpeg({
            quality: 90,
            chromaSubsampling: '4:4:4'
          })).pipe(writeFileStream);

        }else{
          reader.pipe(sharp().resize(thumbnailWidth)).pipe(writeThumbStream);
          reader.pipe(writeFileStream);
        }
        return new Promise((resolve) => {
          writeThumbStream.on('close', () => resolve(true));
        });
      }
    }
  }
}

module.exports = Upload;