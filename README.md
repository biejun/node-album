# node-album
一个基于Koa框架的Nodejs相册系统。它无需使用数据库，上传的照片自动按日期归档，支持为照片添加文字描述，自动生成缩略图，轻松管理你的照片。 
### 适用场景 
* NAS照片存储
* 内网照片共享

### 安装

    $ npm install

或者

    $ yarn install
    
### 运行

    $ node app

### 界面预览
![preview](https://github.com/biejun/node-album/blob/master/preview.png)

### 帮助
如何删除照片？  
上传的照片存放在static/upload/目录下，并按日期归类，可直接在文件目录中删除相应照片及同名缩略图（名称中包含_thumb的即为缩略图）。
