const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define("order", {
    shipping: {
        type: DataTypes.ENUM('Retiro en Tienda','Envio a San Nicolas/Mariano Moreno', 'Envio a Countries' ),
        allowNull: true
    },
    buyDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: true,
    },
    metodoDePago: {
      type: DataTypes.ENUM('Mercado Pago','Efectivo', "Transferencia"),
      allowNull: true
    }
  })
}