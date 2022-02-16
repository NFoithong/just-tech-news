// bcrypt is an adaptive hash function based on a cryptographic algorithm that 
// provides additional security measures like a salt to protect against certain attack strategies
const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../config/connection');

// create our User model
class User extends Model {
    // set up method to run on instance data (per user) to check password
    checkPassword(loginPw) {
        return bcrypt.compareSync(loginPw, this.password);
    }
}

// define table columns and configuration
User.init({
        // Table column definitions go here
        // define an id column
        id: {
            // use the special Sequelize DataTypes object provide what type of data it is
            type: DataTypes.INTEGER,
            // this is the equivalent of SQL's `NOT NULL` option
            allowNull: false,
            // instruct that this is the Primary Key
            primaryKey: true,
            // turn on auto increment
            autoIncrement: true
        },

        // define a username column
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // define an emil column
        email: {
            type: DataTypes.STRING,
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
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                // this means the password must be at least four charactors long
                len: [4]
            }
        }
    },

    {
        hooks: {
            // set up beforeCretae lifecycle "hook" functionality
            // beforeCreate(userData) {
            //     return bcrypt.hash(userData.password, 10).then(newUserData => {
            //         return newUserData;
            //     });
            // }

            // async/await
            async beforeCreate(newUserData) {
                newUserData.password = await bcrypt.hash(newUserData.password, 10);
                return newUserData;
            },
            // set up beforeUpdate lifecycle "hook" functionality
            async beforeUpdate(updatedUserData) {
                updatedUserData.password = await bcrypt.hash(updatedUserData.passowrd, 10);
                return updatedUserData;
            }
        },
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