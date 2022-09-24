import { FileFormat } from 'aws-sdk/clients/iotsitewise';
import express, { Request, Response } from 'express'
import * as db from './script'

const cookieParser = require('cookie-parser')
const { v4: uuidv4 } = require('uuid');
const path = require('path')
const multer = require('multer')

const fs = require('fs');

//const multerS3 = require('multer-s3')
//const { S3Client } = require('@aws-sdk/client-s3')
const AWS = require('aws-sdk')
AWS.config.update({
   accessKeyId: 'AKIATBB7UP3X4ZXRPBMB',
   secretAccessKey: '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'
})
const s3 = new AWS.S3()

const storage = multer.diskStorage({
   destination: async (req: Request, files: any, cb: CallableFunction) => {
      cb(null, `static/`)
   },
   filename: async (req: Request, files: any, cb: CallableFunction) => {
      //creates a unique id for the img. checks if it exist first
      let filename = ''
      while (true) {
         const name = uuidv4() // ALMOST unique key, better solutions would be the file hash
         const extention = files.originalname.match(/[.]\w+$/)
         if (!fs.existsSync(`static/${name}${extention}`)) {
            filename = `static/${name}${extention}`
            await cb(null, `${name}${extention}`)
            break
         }
      }

      // temp solution to wait for the file to be writen
      let fileContent = ''
      while (!fs.existsSync(filename)) {
         try {
            fileContent = await fs.readFileSync(filename)
         } catch (error) {
            console.log('error')
         }
      }
      console.log(filename)
      const params = {
         Bucket: 'mercadolibre-static',
         Key: filename,
         Body: fileContent,
         ACL: 'public-read',
         ContentType: files.mimetype
      }
      await s3.upload(params, function (err: any, data: any) {
         console.log(err, data)
      })

      fs.unlink(filename, (err: any) => {
         if (err) throw err;
      });
      // console.log(files)
   }
})
const upload = multer({ storage: storage })
const cors = require('cors')
const jwt = require('jsonwebtoken')
const app = express()
const port = process.env.PORT || 3001
const secret = 'jwt_secret'


app.use(cors({
   origin: 'https://mercado-libre-clone-repo.herokuapp.com',
   //origin: 'https://mercado-libre-clone-page.web.app',
   //origin: 'http://localhost:3001',
   credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser('Cookie_Secret'))

// serve files that are in /public directory to the req from the /public path prefix
app.use('/public', express.static(path.join(__dirname, 'public')))
app.use('/static/js', express.static(path.join(__dirname, 'public', 'static', 'js')))
//app.use('/static', express.static(path.join(__dirname, 'static')))

app.get('/images', (req: Request, res: Response, next: CallableFunction) => {
   const getImage = async () => {
      const data = s3.getSignedUrl('getObject', {
         Bucket: 'mercadolibre-static',
         Key: 'static/82b71b9e-6a95-4c1a-88ec-4ee1553db617.png'
      })
      console.log(data)
      return data
   }
   const encode = (data: any) => {
      let buf = Buffer.from(data);
      let base64 = buf.toString('base64');
      return base64
   }

   getImage().then((img: any) => {
      //console.log(img.Body)
      res.send(img)
   })
})


function authorizeUser(req: Request, res: Response, next: CallableFunction) {
   const token = req.cookies.token

   console.log("cookies: ", req.cookies)
   console.log("token: ", req.cookies.token)

   if (!token) {
      return res.status(200).send({ error: { message: 'Unauthorize' } })   //401 = Unauthorize
   }

   jwt.verify(token, secret, (err: any, user: any) => {
      if (err) return res.status(200).send({ error: { message: 'Forbidden' } }) //403 = Forbidden

      console.log(user)

      req.headers.user = user   //creates new prop user but cant directly in req because of type restrictions

      next()
   })
}

app.get('/', (req: Request, res: Response) => {
   res.sendFile(path.join(__dirname, 'index.html'));
})

app.post('/login', async (req: Request, res: Response, next: CallableFunction) => {
   const { email, password } = req.body
   try {
      if (!(email && password)) {
         //400 = Bad req
         res.status(200).send({ error: { message: 'Please provide full credentials' } })
      } else {
         const user = await db.getUser(email as string, password as string)
         if (!user) {
            res.status(200).json({ error: { message: 'Unauthorize' } })
            return
         }
         let token;
         try {
            //Creating jwt token
            token = jwt.sign(
               { userId: user.id, email: user.email },
               secret,
               { expiresIn: "168h" } // 1 week
            );
         } catch (err) {
            console.error(err);
            const error = new Error("Error! Something went wrong creating the token.");
            return next(error);
         }

         console.log('jwt: ' + token)

         res.cookie('token', token, { maxAge: 30 * 24 * 60 * 60 }) // attach the cookie to the res
         res.status(200).json({
            success: true,
            data: {
               id: user.id,
               name: user.name,
               email: user.email,
            }
         })
      }
   } catch (err) {
      console.error(err)
      const error = new Error("Error! Something went wrong.");
      return next(error);
   }
})
app.get('/user', authorizeUser, async (req: Request, res: Response, next: CallableFunction) => {
   const { userId } = req.query
   return await db.getUserById(userId as string)
   //should also return all the products that the user is selling
})
app.post('/user', async (req: Request, res: Response) => {
   const { name, email, password } = req.body
   if (!(name && email && password)) {
      //400 = Bad req
      res.status(200).send({ error: { message: 'Please provide full credentials' } })
   } else {
      res.status(200).json(
         await db.createUser(name as string, email as string, password as string)
      )
   }
})

app.get('/cart', authorizeUser, async (req: Request, res: Response, next: CallableFunction) => {
   const id = req.cookies.id
   if (!id) return []
   const cart = await db.getCart(id, [])
   res.status(200).json({
      cart: cart
   })
})
app.post('/cart', authorizeUser, async (req: Request, res: Response, next: CallableFunction) => {
   const id = req.cookies.id
   const product = req.body.productId as string // _localhost/cart?id=*
   if (!id && !product) res.status(400).send({ error: { message: 'Empty info' } })
   const cart = await db.addCart(id, product)
   res.status(200).json({
      cart: cart
   })
})

app.get('/product', async (req: Request, res: Response, next: CallableFunction) => {
   const { name } = req.query
   const products = await db.getProductListForSearch(name as string)
   res.status(200).json({
      succes: true,
      data: {
         products: products
      }
   })
})
app.get('/products_list', async (req: Request, res: Response, next: CallableFunction) => {
   const { name } = req.query
   const products = await db.getProductListByName(name as string)
   res.status(200).json({
      succes: true,
      data: {
         products: products
      }
   })
})
app.get('/product/:id', async (req: Request, res: Response, next: CallableFunction) => {
   const id = req.params.id
   const product = await db.getProductById(id)
   res.status(200).json(
      product
   )
})
app.get('/product/user/:id', async (req: Request, res: Response, next: CallableFunction) => {
   const id = req.params.id
   res.status(200).json({
      succes: true,
      data: await db.getProductsByUser(id)
   })
})
app.post('/product', authorizeUser, upload.array('photos'), async (req: any, res: Response, next: CallableFunction) => {
   res.status(200).json(
      await db.createProduct(req.body, req.files.map((file: any) => file.path))
   )
})
app.delete('/product/:id', authorizeUser, async (req: Request, res: Response, next: CallableFunction) => {
   const id = req.params.id
   res.status(200).json({
      succes: true,
      data: await db.deleteProductById(id)
   })
})

app.get('/category/:name', async (req: Request, res: Response, next: CallableFunction) => {
   const { name } = req.params
   const products = await db.getProductListByCategory(name as string)
   res.status(200).json({
      products: products
   })
})
app.get('/category/offerts/:name', async (req: any, res: Response, next: CallableFunction) => {
   const { name } = req.query
   res.status(200).json(
      await db.getOffertsByCategory(name as string)
   )
})

app.post('/upload', upload.array('photos'), async (req: any, res: Response, next: CallableFunction) => {
   res.status(200).json({
      message: 'imagen subida con éxito'
   })
})

app.get('*', (req: Request, res: Response) => {
   res.sendFile(path.join(__dirname, 'index.html'));
})

app.listen(port, () => {
   console.log(`Server listening on port ${port}`)
})

module.exports = {
   app,
   port
}