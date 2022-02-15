const { Model, Datatypes } = require('sequelize');
const sequelize = require('../config/connection');

// create our User model
class User extends Model {}

// define table columns and configuration
User.init({
    // Table column definitions go here
    // define an id column
    id: {
        // use the special Sequelize DataTypes object provide what type of data it is
        type: Datatypes.INTEGER,
        // this is the equivalent of SQL's `NOT NULL` option
        allowNull: false,
        // instruct that this is the Primary Key
        primaryKey: true,
        // turn on auto increment
        autoIncrement: true
    },
    // define a username column
    username: {
        type: Datatypes.STRING,
        allowNull: false
    },
    // define an emil column
    email: {
        type: Datatypes.STRING,
        allowNull: false,
        // there cannot be any duplicate email valkues in this table
        unique: true,
        // if allowNull is set to false, we can run our data through validators before creating the table data
        validate: {
            isEmail: true
        }
    },
    // define a password column
    password: {
        type: Datatypes.STRING,
        allowNull: false,
        validate: {
            // this means the password must be at least four charactors long
            len: [4]
        }
    }

}, {
    // Table configuration options go here (https://sequelize.org/v5/manual/models-definition.html#configuration)

    // pass in out imported sequelize connection (the direct connection to our database)
    sequelize,
    // do not automatically create createAt/updateAt timestamp fields
    timestamps: false,
    // do not pluratize name of database table
    freezeTableName: true,
    // use underscores instead of camel-casing (i.e. `comment_text and not `coomentText)
    underscored: true,
    // make it so our model name stays lowercase in  the database
    modelName: 'user'
});

module.exports = User;