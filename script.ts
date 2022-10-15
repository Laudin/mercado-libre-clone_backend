import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function getUser(email: string, password: string) {
   const user = await prisma.user.findFirst({
      where: {
         AND: [{ email: email }, { password: password }]
      }
   })
   return user
}
export async function getUserById(id: string) {
   const user = await prisma.user.findFirst({
      where: {
         AND: [{ id: id }]
      }
   })
   return user
   // should also return all the products that the user is selling
}
export async function createUser(name: string, email: string, password: string) {
   await prisma.user.deleteMany()
   const user = await prisma.user.create({
      data: {
         name: name,
         email: email,
         password: password
      }
   })
   return user
}
export async function addCart(userId: string, productId: string) {
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
   })
   return await getCart('', cart)
}
export async function getCart(userId: string, cartList: string[]) {
   let cartQuery
   if (userId) {
      const cart = await prisma.user.findUnique({
         where: {
            id: userId,
         },
         select: {
            cart: true,
         },
      })
      cartQuery = await prisma.product.findMany({
         where: {
            id: { in: cart ? cart.cart : [] },
         },
      })

   } else {
      cartQuery = await prisma.product.findMany({
         where: {
            id: { in: cartList },
         },
      })

   }
   return cartQuery
}
export async function getProductById(id: string) {
   const product = await prisma.product.findUnique({
      where: {
         id: id
      },
   })
   return product
}
export async function getProductListForSearch(name: string) {
   if (!name) return []
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
   })
   return products
}
export async function getProductListByName(name: string) {
   if (!name) return []
   const products = await prisma.product.findMany({
      where: {
         name: {
            contains: name,
            mode: 'insensitive',
         },
      },
      take: 20, //return only 6
   })
   return products
}
export async function createProduct(product: any, photos: any) {
   const products = await prisma.product.create({
      data: {
         name: product.name,
         brand: product.brand,
         model: product.model,
         stock: parseInt(product.stock),
         state: product.state,
         category: {
            connectOrCreate: {
               where: {
                  name: product.category,
               },
               create: {
                  name: product.category,
               },
            },
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
   })
   return products
}
export async function getProductListByCategory(name: string) {
   const products = await prisma.product.findMany({
      where: {
         categoryName: name
      },
      take: 20, //return only 2
   })
   return products
}
async function main() {
   //console.log(await prisma.user.deleteMany({}))
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
      console.error(e.message)
   })