const { Router } = require("express");
const router = Router();
const { Op } = require("sequelize");
const { Product } = require("../db");

//funcionalidad para ponerle un punto a los numeros

router.get("/", async (req, res, next) => {
  try {
    const { name } = req.query;

    let products;
    if (name) {
      products = await Product.findAll({
        where: {
          name: {
            [Op.iLike]: `%${name}%`,
          },
        },
      });
    } else {
      products = await Product.findAll();
    }

    return res.send(products);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const productDetail = await Product.findOne({
      where: {
        id: id,
      },
    });
    return res.status(200).json(productDetail);
  } catch (error) {
    res.status(500).json({ msg: error });
  }
});

router.post("/", async (req, res) => {
  const { name, description, image, price, category} =
    req.body;

  if ((name, description, image, price, category)) {
    Product.create({
      name,
      description,
      image,
      price,
      category,
    });
    return res.send("producto creado correctamente");
  } else {
    return res.status(400).send("Please, insert the information correctly");
  }
});

router.put("/:id", async(req, res) => {
  const { id } = req.params;
  const { name, description, image, price, category, stock, disabled} = req.body;

  try{
  const updatedProduct = await Product.findByPk(id);
  if (!updatedProduct) {
    return res.status(404).send("Product not found");
  }
  await updatedProduct.update({
    name, 
    description, 
    image, 
    price, 
    category, 
    stock, 
    disabled
  });
  res.status(200).send("Product updated successfully");
} catch (error) {
  console.log(error);
}

  
})
module.exports = router;