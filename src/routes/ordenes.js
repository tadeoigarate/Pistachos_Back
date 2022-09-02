const { Router } = require("express");
const router = Router();

const { Product, Order, Orderline, Envio } = require('../db.js');

//ruta post donde se crea la orden de compra
router.post('/', async (req, res, next) => {
  console.log(req.body)
  const {shipping, metodoDePago} = req.body
  try {
    const orden = await Order.create({
      shipping, 
      metodoDePago
    })
    
    // Itera sobre cada {} de orderlines enviado del carrito del front del usuario
    await req.body.productos.forEach(async (orderline) => {
      const { productId, quantity, amount } = orderline;


      await orden.addProducts(productId, { through: { quantity: quantity, amount: amount }})
      return
    })
  
    return res.status(200).send(orden)
  } catch (error) {
    console.log(error)
    new Error(error)
  }
  
  });

//get de las ordenes con la direccion a la que fue enviada y los productos comprados
  router.get('/allOrders', (req, res, next) => {
	Order.findAll({
    include: [
      { model: Product, attributes: ['id','name', 'image', 'price', "category"], through: {
        attributes: ['amount','quantity']
      }},
      {model: Envio}
    ],
	}).then(orders => {
		if (!orders) return res.sendStatus(404);
		return res.status(200).json(orders);
	})
    .catch(error => {
        return res.send(error);
    })
});



//get de las ordenes pero ordenadas por fecha asc 
router.get('/asc', async (req, res) => {

    try {
      const orden = await Order.findAll({
        order: [
          ["buyDate", "ASC"]
        ],
        include: [
          { model: Product, attributes: ['id','name', 'image', 'price', "category"], through: {
            attributes: ['amount','quantity']
          }},
          {model: Envio}
        ]
      })

      if (!orden) return res.send('Orden no encontrada...')

      return res.send(orden)
    } catch (error) {
      res.status(500).json({ msg: err });
    }
});

//get de las ordenes pero ordenadas por fecha desc 
router.get('/desc', async (req, res) => {

    try {
      const orden = await Order.findAll({
        include: [
          { model: Product, attributes: ['id','name', 'image', 'price', "category"], through: {
            attributes: ['amount','quantity']
          }},
          {model: Envio}
        ],
        order: [["buyDate", "DESC"]]
      })

      if (!orden) return res.send('Orden no encontrada...')

      return res.send(orden)
    } catch (error) {
      res.status(500).json({ msg: err });
    }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findOne({
      where: {
        id: id,
      },
	    include: [
          { model: Product, attributes: ['id','name', 'image', 'price', "category"], through: {
            attributes: ['amount','quantity']
          }},
          {model: Envio}
        ],	    
    });
    return res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ msg: error });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedProduct = await Order.findByPk(id);
    if (!deletedProduct) {
      return res.status(404).send("Product not found");
    }
    await deletedProduct.destroy();
    res.status(200).send("Product deleted successfully");
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
