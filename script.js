"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOffertsByCategory = exports.getProductListByCategory = exports.createProduct = exports.getProductListByName = exports.getProductListForSearch = exports.getProductById = exports.getCart = exports.addCart = exports.createUser = exports.getUserById = exports.getUser = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function getUser(email, password) {
    const user = await prisma.user.findFirst({
        where: {
            AND: [{ email: email }, { password: password }]
        }
    });
    return user;
}
exports.getUser = getUser;
async function getUserById(id) {
    const user = await prisma.user.findFirst({
        where: {
            AND: [{ id: id }]
        }
    });
    return user;
    // should also return all the products that the user is selling
}
exports.getUserById = getUserById;
async function createUser(name, email, password) {
    await prisma.user.deleteMany();
    const user = await prisma.user.create({
        data: {
            name: name,
            email: email,
            password: password
        }
    });
    return user;
}
exports.createUser = createUser;
async function addCart(userId, productId) {
    const { cart } = await prisma.user.update({
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
    return await getCart('', cart);
}
exports.addCart = addCart;
async function getCart(userId, cartList) {
    let cartQuery;
    if (userId) {
        const cart = await prisma.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                cart: true,
            },
        });
        cartQuery = await prisma.product.findMany({
            where: {
                id: { in: cart ? cart.cart : [] },
            },
        });
    }
    else {
        cartQuery = await prisma.product.findMany({
            where: {
                id: { in: cartList },
            },
        });
    }
    return cartQuery;
}
exports.getCart = getCart;
async function getProductById(id) {
    const product = await prisma.product.findUnique({
        where: {
            id: id
        },
    });
    return product;
}
exports.getProductById = getProductById;
async function getProductListForSearch(name) {
    if (!name)
        return [];
    const products = await prisma.product.findMany({
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
}
exports.getProductListForSearch = getProductListForSearch;
async function getProductListByName(name) {
    if (!name)
        return [];
    const products = await prisma.product.findMany({
        where: {
            name: {
                contains: name,
                mode: 'insensitive',
            },
        },
        take: 20, //return only 6
    });
    return products;
}
exports.getProductListByName = getProductListByName;
async function createProduct(product, photos) {
    const products = await prisma.product.create({
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
}
exports.createProduct = createProduct;
async function getProductListByCategory(id) {
    const products = await prisma.product.findMany({
        where: {
            categoryId: id,
        },
        take: 20,
    });
    return products;
}
exports.getProductListByCategory = getProductListByCategory;
async function getOffertsByCategory(category) {
    const products = await prisma.product.findMany({
        where: {
            categoryId: category,
            offert: { gt: 0 },
        },
        take: 20,
    });
}
exports.getOffertsByCategory = getOffertsByCategory;
async function main() {
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
}
main()
    .catch(e => {
    console.error(e.message);
});
//# sourceMappingURL=script.js.map