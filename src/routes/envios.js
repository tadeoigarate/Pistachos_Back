const { Router } = require("express");
const router = Router();
const {Envio} = require("../db")

router.post("/:orderId", async (req, res) => {
    const {barrio, lote, manzana, nombreCompleto, referencia, telefono } = req.body;
    const {orderId} = req.params
  
    if (barrio, lote, manzana, nombreCompleto, telefono) {
      Envio.create({
        barrio, 
        lote, 
        manzana, 
        nombreCompleto, 
        referencia, 
        telefono,
        orderId
      });
      return res.send("direccion creada correctamente");
    } else {
      return res.status(400).send("Please, insert the information correctly");
    }
  });

  router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const envio = await Envio.findOne({
        where: {
          orderId: id,
        },
      });
      return res.status(200).json(envio);
    } catch (error) {
      res.status(500).json({ msg: error });
    }
  });

module.exports = router;
