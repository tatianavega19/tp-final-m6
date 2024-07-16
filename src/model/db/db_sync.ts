import sequelize from ".";

(async () => await sequelize.drop())();

(async () => await sequelize.sync({ force: true }))();