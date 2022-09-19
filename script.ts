import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function getUser(email: string, password: string) {
   try {
      const user = await prisma.user.findFirst({
         where: {
            AND: [{ email: email }, { password: password }]
         }
      })
      return user
   } catch (err) {
      console.log(err)
   }
}
export async function getUserById(id: string) {
   try {
      const user = await prisma.user.findFirst({
         where: {
            AND: [{ id: id }]
         }
      })
      return user
      // should also return all the products that the user is selling
   } catch (err) {
      console.log(err)
   }
}
export async function createUser(name: string, email: string, password: string) {
   try {
      const user = await prisma.user.create({
         data: {
            name: name,
            email: email,
            password: password
         }
      })
      return user
   } catch (err) {
      console.log(err)
   }
}
export async function addCart(userId: string, productId: string) {
   try {
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
   } catch (err) {
      console.log(err)
   }
}
export async function getCart(userId: string, cartList: string[]) {
   let cartQuery
   try {
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
   } catch (err) {
      console.log(err)
   }
}
export async function getProductById(id: string) {
   try {
      const product = await prisma.product.findUnique({
         where: {
            id: id
         },
      })
      return product
   } catch (err) {
      console.log(err)
   }
}

// for the search BAR
export async function getProductListForSearch(name: string) {
   if (!name) return []
   try {
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
   } catch (err) {
      console.log(err)
   }
}

// for the search result PAGE
export async function getProductListByName(name: string) {
   if (!name) return []
   try {
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
   } catch (err) {
      console.log(err)
   }
}
export async function getProductsByUser(user: string) {
   try {
      const products = await prisma.product.findMany({
         where: {
            sellerId: user,
         }
      })
      return products
   } catch (err) {
      console.log(err)
   }
}
export async function createProduct(product: any, photos: any) {
   try {
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
      })
      return products
   } catch (err) {
      console.log(err)
   }
}
export async function deleteProductById(id: string) {
   try {
      const product = await prisma.product.delete({
         where: {
            id: id,
         }
      })
      return 'producto eliminado con éxito'
   } catch (err) {
      console.log(err)
   }
}
export async function getProductListByCategory(id: string) {
   try {
      const products = await prisma.product.findMany({
         where: {
            categoryId: id,
         },
         take: 20,
      })
      return products
   } catch (err) {
      console.log(err)
   }

}
export async function getOffertsByCategory(category: string) {
   try {
      const products = await prisma.product.findMany({
         where: {
            categoryId: category,
            offert: { gt: 0 },
         },
         take: 20,
      })
      return products
   } catch (err) {
      console.log(err)
   }
}
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
   /*    console.log(await prisma.category.create({
         data: {
            id: 'farmacia',
            name: 'farmacia',
            banner: 'farmacia_banner.png'
         }
      })) */
}

main()
   .catch(e => {
      console.error(e.message)
   })