module.exports = function (sequelize, DataTypes) {
  return sequelize.define('item', {
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1,250]
      }
    },
    daysleftstillgood: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        isNumeric: true,
        min:1
      }
    }
  });
};
