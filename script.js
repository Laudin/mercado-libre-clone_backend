"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOffertsByCategory = exports.getProductListByCategory = exports.createProduct = exports.getProductListByName = exports.getProductListForSearch = exports.getProductById = exports.getCart = exports.addCart = exports.createUser = exports.getUserById = exports.getUser = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function getUser(email, password) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield prisma.user.findFirst({
            where: {
                AND: [{ email: email }, { password: password }]
            }
        });
        return user;
    });
}
exports.getUser = getUser;
function getUserById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield prisma.user.findFirst({
            where: {
                AND: [{ id: id }]
            }
        });
        return user;
        // should also return all the products that the user is selling
    });
}
exports.getUserById = getUserById;
function createUser(name, email, password) {
    return __awaiter(this, void 0, void 0, function* () {
        yield prisma.user.deleteMany();
        const user = yield prisma.user.create({
            data: {
                name: name,
                email: email,
                password: password
            }
        });
        return user;
    });
}
exports.createUser = createUser;
function addCart(userId, productId) {
    return __awaiter(this, void 0, void 0, function* () {
        const { cart } = yield prisma.user.update({
            where: {
                id: userId,
            },
            select: {
                cart: true,
            },
            data: {
                cart: {
                    push: productId,
                }
            }
        });
        return yield getCart('', cart);
    });
}
exports.addCart = addCart;
function getCart(userId, cartList) {
    return __awaiter(this, void 0, void 0, function* () {
        let cartQuery;
        if (userId) {
            const cart = yield prisma.user.findUnique({
                where: {
                    id: userId,
                },
                select: {
                    cart: true,
                },
            });
            cartQuery = yield prisma.product.findMany({
                where: {
                    id: { in: cart ? cart.cart : [] },
                },
            });
        }
        else {
            cartQuery = yield prisma.product.findMany({
                where: {
                    id: { in: cartList },
                },
            });
        }
        return cartQuery;
    });
}
exports.getCart = getCart;
function getProductById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const product = yield prisma.product.findUnique({
            where: {
                id: id
            },
        });
        return product;
    });
}
exports.getProductById = getProductById;
function getProductListForSearch(name) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!name)
            return [];
        const products = yield prisma.product.findMany({
            where: {
                name: {
                    contains: name,
                    mode: 'insensitive',
                },
            },
            select: {
                id: true,
                name: true,
            },
            take: 6, //return only 6
        });
        return products;
    });
}
exports.getProductListForSearch = getProductListForSearch;
function getProductListByName(name) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!name)
            return [];
        const products = yield prisma.product.findMany({
            where: {
                name: {
                    contains: name,
                    mode: 'insensitive',
                },
            },
            take: 20, //return only 6
        });
        return products;
    });
}
exports.getProductListByName = getProductListByName;
function createProduct(product, photos) {
    return __awaiter(this, void 0, void 0, function* () {
        const products = yield prisma.product.create({
            data: {
                name: product.name,
                brand: product.brand,
                model: product.model,
                stock: parseInt(product.stock),
                state: product.state,
                category: {
                    connect: { id: product.category }
                },
                photos: photos,
                price: parseFloat(product.price),
                description: product.description,
                seller: {
                    connect: { id: product.sellerId },
                },
            },
            include: {
                seller: true,
            }
        });
        return products;
    });
}
exports.createProduct = createProduct;
function getProductListByCategory(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const products = yield prisma.product.findMany({
            where: {
                categoryId: id,
            },
            take: 20,
        });
        return products;
    });
}
exports.getProductListByCategory = getProductListByCategory;
function getOffertsByCategory(category) {
    return __awaiter(this, void 0, void 0, function* () {
        const products = yield prisma.product.findMany({
            where: {
                categoryId: category,
                offert: { gt: 0 },
            },
            take: 20,
        });
    });
}
exports.getOffertsByCategory = getOffertsByCategory;
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        // console.log(await prisma.product.deleteMany({}))
        // console.log(await prisma.category.deleteMany({}))
        //console.log(await prisma.product.findMany({}))
        /* console.log(await prisma.product.findMany({
           where: {
              name: { contains: '' }
           },
           select: {
              id: true,
              name: true,
           },
           take: 6, //return only 6
        })) */
        /*    await prisma.user.create({
              data: {
                 name: 'Genos',
                 email: 'sabriimaidanaa1@gmail.com',
                 password: '741963'
              }
           })
           await prisma.user.create({
              data: {
                 name: 'Morph',
                 email: 'gastonlaudin@gmail.com',
                 password: '1234'
              }
           }) */
        /* const query = await prisma.product.create({
           data: {
              name: 'Cafetera',
              price: 49.99,
              description: 'Hace Cafe',
              sellerId: '24cc86e8-e985-497d-a630-3f89e774d66d',
              categoryName: 'Electrodomésticos'
           }
        }) */
        /* const query = await prisma.category.create({
           data: {
              name: 'Electrodomésticos'
           }
        }) */
        //console.log(product)
    });
}
main()
    .catch(e => {
    console.error(e.message);
});
//# sourceMappingURL=script.js.map