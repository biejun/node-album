# node-album
基于Koa框架的Node相册库。它无需数据库，而且还支持添加照片描述，自动归档和生成缩略图，轻松管理你的照片。 
### 适用场景 
* NAS照片存储
* 内网照片共享

### 安装

    $ npm install
    
### 运行

    $ node app

如果已全局安装nodemon模块，可直接运行命令：

    $ npm start

### 界面预览
![preview](https://github.com/biejun/node-album/blob/master/preview.png)

### 帮助
如何删除照片？  
照片存放在static/upload/目录下，并按上传日期分类到了不同文件夹中，直接在文件夹中删除相应照片及同名缩略图（名称中包含_thumb的即为缩略图）即可。
