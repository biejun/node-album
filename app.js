const Koa = require('koa');
const Router = require('koa-router');
const views = require('koa-views');
const body = require('koa-body');
const staticCache = require('koa-static-cache');
const app = new Koa();
const route = new Router();
const path = require('path');
const ejs = require('ejs');

const Upload = require('./core/Upload');
const Artist = require('./core/Artist');

const port = 8888;

app.use(body({ multipart: true }));
app.use(views(path.join(__dirname, '/views'), { extension: 'ejs' }));
app.use(staticCache(path.join(__dirname, './static'), { dynamic: true }, {
  maxAge: 365 * 24 * 60 * 60
}));

route.get('/', async (ctx) => {
  let data = await new Artist().getAllPictures(8);
	await ctx.render('index', { data });
});

route.get('/album/:name', async (ctx) => {
  let album = ctx.params.name;
  let data = await new Artist().getPicturesByAlbum(album);
	await ctx.render('album', { album: {
      name: album,
      day: album.slice(-2),
      date: album.slice(0,4) + '-' + album.slice(4,6)
    }, data });
});

route.post('/upload', async (ctx) => {
  const files = ctx.request.files.file;
  const text = ctx.request.body.text;
  const up = new Upload();
  const type = Object.prototype.toString.call(files);
  if(type === '[object Array]') {
    let len = files.length;
    while (len--) {
      await up.putFile(files[len], text);
    }
  }else{
    await up.putFile(files, text);
  }
  ctx.redirect('/');
});

app.use(async (ctx, next) =>{
    ctx.state = {
      website: require('./config/website.config'),
      prod: require('./config/prod.config'),
    };
    await next();
});

app.use(async(ctx, next) => {
	const start = Date.now();
	await next();
	const ms = Date.now() - start;
	ctx.set('X-Response-Time', `${ms}ms`);
});

app.use(route.routes());

app.listen(port);
console.log(`Server started at localhost: ${port}`);