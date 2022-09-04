"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db = __importStar(require("./script"));
const cookieParser = require('cookie-parser');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const storage = multer.diskStorage({
    destination: async (req, files, cb) => {
        cb(null, `static/`);
    },
    filename: (req, files, cb) => {
        //creates a unique id for the img. checks if it exist first
        while (true) {
            const name = uuidv4();
            const extention = files.originalname.match(/[.]\w+$/);
            if (!fs.existsSync(`static/${name}${extention}`)) {
                cb(null, `${name}${extention}`);
                break;
            }
        }
    }
});
const upload = multer({ storage: storage });
const cors = require('cors');
const jwt = require('jsonwebtoken');
const app = (0, express_1.default)();
const port = process.env.PORT || 3001;
const secret = 'jwt_secret';
app.use(cors({
    origin: 'https://mercado-libre-clone-repo.herokuapp.com',
    //origin: 'https://mercado-libre-clon.web.app',
    //origin: 'http://localhost:3001',
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(cookieParser('Cookie_Secret'));
app.use(express_1.default.static('public'));
app.use(express_1.default.static('static'));
function authorizeUser(req, res, next) {
    const token = req.cookies.token;
    console.log("cookies: ", req.cookies);
    console.log("token: ", req.cookies.token);
    if (!token) {
        return res.status(200).send({ error: { message: 'Unauthorize' } }); //401 = Unauthorize
    }
    jwt.verify(token, secret, (err, user) => {
        if (err)
            return res.status(200).send({ error: { message: 'Forbidden' } }); //403 = Forbidden
        console.log(user);
        req.headers.user = user; //creates new prop user but cant directly in req because of type restrictions
        next();
    });
}
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
// doesnt work..
/* app.get('/manifest.json', (req: Request, res: Response) => {
   res.sendFile(path.join(__dirname, 'public', 'manifest.json'));
})
app.get('/static/js/:file', (req: Request, res: Response) => {
   console.log('js' + req.params.file)
   let options = {
      root: path.join(__dirname)
   }
   res.sendFile(`./public/static/js/${req.params.file}`, options)
   //res.sendFile(path.join('./', 'public', 'static', 'js', `${req.params.file}`));
})
app.get('/static/css/:file', (req: Request, res: Response) => {
   let options = {
      root: path.join(__dirname)
   }
   res.sendFile(`./public/static/css/${req.params.file}`, options)
   res.sendFile(path.join(__dirname, 'public', 'static', 'css', `${req.params.file}`));
}) */
app.post('/login', async (req, res, next) => {
    const { email, password } = req.body;
    try {
        if (!(email && password)) {
            //400 = Bad req
            res.status(200).send({ error: { message: 'Please provide full credentials' } });
        }
        else {
            const user = await db.getUser(email, password);
            if (!user) {
                res.status(200).json({ error: { message: 'Unauthorize' } });
                return;
            }
            let token;
            try {
                //Creating jwt token
                token = jwt.sign({ userId: user.id, email: user.email }, secret, { expiresIn: "168h" } // 1 week
                );
            }
            catch (err) {
                console.error(err);
                const error = new Error("Error! Something went wrong creating the token.");
                return next(error);
            }
            console.log('jwt: ' + token);
            res.cookie('token', token, { maxAge: 30 * 24 * 60 * 60 }); // attach the cookie to the res
            res.status(200).json({
                success: true,
                data: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                }
            });
        }
    }
    catch (err) {
        console.error(err);
        const error = new Error("Error! Something went wrong.");
        return next(error);
    }
});
app.get('/user', authorizeUser, async (req, res, next) => {
    const { userId } = req.query;
    return await db.getUserById(userId);
    //should also return all the products that the user is selling
});
app.post('/user', async (req, res) => {
    const { name, email, password } = req.body;
    if (!(name && email && password)) {
        //400 = Bad req
        res.status(200).send({ error: { message: 'Please provide full credentials' } });
    }
    else {
        res.status(200).json(await db.createUser(name, email, password));
    }
});
app.get('/cart', authorizeUser, async (req, res, next) => {
    const id = req.cookies.id;
    if (!id)
        return [];
    const cart = await db.getCart(id, []);
    res.status(200).json({
        cart: cart
    });
});
app.post('/cart', authorizeUser, async (req, res, next) => {
    const id = req.cookies.id;
    const product = req.body.productId; // _localhost/cart?id=*
    if (!id && !product)
        res.status(400).send({ error: { message: 'Empty info' } });
    const cart = await db.addCart(id, product);
    res.status(200).json({
        cart: cart
    });
});
app.get('/product', async (req, res, next) => {
    const { name } = req.query;
    const products = await db.getProductListForSearch(name);
    res.status(200).json({
        succes: true,
        data: {
            products: products
        }
    });
});
app.get('/products_list', async (req, res, next) => {
    const { name } = req.query;
    const products = await db.getProductListByName(name);
    res.status(200).json({
        succes: true,
        data: {
            products: products
        }
    });
});
app.get('/product/:id', async (req, res, next) => {
    const id = req.params.id;
    const product = await db.getProductById(id);
    res.status(200).json(product);
});
app.post('/product', authorizeUser, upload.array('photos'), async (req, res, next) => {
    res.status(200).json(await db.createProduct(req.body, req.files.map((file) => file.path)));
});
app.get('/category', async (req, res, next) => {
    const { name } = req.query;
    const products = await db.getProductListByCategory(name);
    res.status(200).json({
        products: products
    });
});
app.get('/category/offerts/:name', async (req, res, next) => {
    const { name } = req.query;
    res.status(200).json(await db.getOffertsByCategory(name));
});
/* app.get('*', (req: Request, res: Response) => {
   res.sendFile(path.join(__dirname, 'public', 'index.html'));
}) */
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
//# sourceMappingURL=server.js.map