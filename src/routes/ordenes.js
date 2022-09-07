const { Router } = require("express");
const router = Router();

const { Product, Order, Orderline, Envio } = require('../db.js');

router.post("/", async (req, res) => {
  try {
    const orden = await Order.create()

    return res.status(200).send(orden)
  } catch (error) {
    res.status(500).json({ msg: err });
  }
})

//ruta post donde se crea la orden de compra
router.put('/put/:id', async (req, res, next) => {
  const {id} = req.params
  const {shipping, metodoDePago} = req.body

  const updatedOrden = await Order.findByPk(id);
  try {
    let totalPrice;

    if(shipping === "Envio a San Nicolas/Mariano Moreno" ){
      let aux = 150
      req.body.productos.map(e =>  aux = aux + e.amount*1)
      totalPrice = aux
      console.log(totalPrice)
    }
    if(shipping === "Envio a Countries"){
      let aux = 200
      req.body.productos.map(e => aux = aux + e.amount*1)
      totalPrice = aux
      console.log(totalPrice)
    } 
    if(shipping === "Retiro en Tienda"){
      let aux = 0
      req.body.productos.map(e =>  aux = aux + e.amount*1)
      totalPrice = aux
      console.log(totalPrice)
    }
    await updatedOrden.update({
      shipping, 
      metodoDePago,
      totalPrice,
    })
    
    // Itera sobre cada {} de orderlines enviado del carrito del front del usuario

    if(req.body.productos){
      await req.body.productos.forEach(async (orderline) => {
        const { productId, quantity, amount } = orderline;
  
        await updatedOrden.addProducts(productId, { through: { quantity: quantity, amount: amount }})
        return
      })
    }
    const tadeo = {
      body: req.body,
      totalPrice,
      id: updatedOrden.id
    }
  
    return res.status(200).send(tadeo)
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
