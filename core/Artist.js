const fs = require('fs');
const path = require('path');
const staticPath =  '/upload/';
const rootPath = path.join(process.cwd(), '/static/', staticPath);

class Artist{

  getAlbums() {
    return new Promise((resolve) => {
      let albums = [];
      fs.readdir(rootPath, (err, dirs) => {

        if(err) resolve([]);

        if(dirs && dirs.length) {
          let len = dirs.length, stats;
          while (len--) {
            stats = fs.statSync(rootPath + dirs[len]);
            if (stats.isDirectory()) {
              albums.push(dirs[len]);
            }
          }
          resolve(albums);
        }else{
          resolve([]);
        }
      });
    });
  }

  getPicturesByAlbum (album, limit) {
    if(!album) return false;
    if(album.lastIndexOf('/') === -1) album = album + '/';
    return new Promise((resolve) => {
      const albumPath = path.join(rootPath, album);
      let photos = [];
      fs.readdir(albumPath, (err, files) => {
        if(err || !files) resolve([]);
        files = files.filter(v => v.indexOf('_thumb.') !== -1);
        let len = files.length, stats;
        while (len--) {
          stats = fs.statSync(albumPath + files[len]);
          if (stats.isFile()) {
            let file = files[len];
            let fileName = file.split('.')[0];
            let o = {
              image: path.join(staticPath, album, file),
            };
            try{
              o.meta = fs.readFileSync(path.join(albumPath, fileName.replace('_thumb', '')+'.txt'));
            }catch (e) {}
            photos.push(o);
          }
        }
        resolve({
          photos: limit ? photos.splice(0, limit) : photos,
          count: files.length - limit > 0
        });
      });
    });
  }

  async getAllPictures(limit) {
    const albums = await this.getAlbums();
    let len = albums.length, album;
    let data = [];
    for (let i = 0; i < len; i++) {
      album = albums[i];
      let pictures = await this.getPicturesByAlbum(album, limit);
      if(!pictures.photos.length) continue;
      data.push({
        album : {
          name: album,
          day: album.slice(-2),
          date: album.slice(0,4) + '-' + album.slice(4,6)
        },
        pictures
      });
    }
    return data;
  }
}

module.exports = Artist;