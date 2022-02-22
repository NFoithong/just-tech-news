const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');

router.get('/', (req, res) => {
    // use res.render instead of res.send because we've hooked up a template engine, and specify which template we want to use. In this case, 
    // we want to render the homepage.handlebars template.
    // res.render('homepage', {
    //     id: 1,
    //     post_url: 'https://handlebarsjs.com/guide/',
    //     title: 'Handlebars Docs',
    //     created_at: new Date(),
    //     vote_count: 10,
    //     comments: [{}, {}],
    //     user: {
    //         username: 'test_user'
    //     }
    // });

    Post.findAll({
        //Query configuration
        attributes: ['id', 'post_url', 'title', 'created_at', [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']],
        include: [
            // include comment model here
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'user_id', 'post_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    })

    .then(dbPostData => {
            console.log(dbPostData[0]);
            const posts = dbPostData.map(post => post.get({ plain: true }));
            // pass a single post object into homepage template
            res.render('homepage', { posts });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});


module.exports = router;