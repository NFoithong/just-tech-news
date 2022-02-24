const router = require('express').Router();
// const { json } = require('express/lib/response');
const sequelize = require('../../config/connection');
const { Post, User, Vote, Comment } = require('../../models');
// get all users
router.get('/', (req, res) => {
    console.log('=================');
    Post.findAll({
            //Query configuration
            attributes: ['id', 'post_url', 'title', 'created_at', [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']],
            order: [
                ['created_at', 'DESC']
            ],
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
        .then(dbPostData => res.json(dbPostData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// get a single post
router.get('/:id', (req, res) => {
    Post.findOne({
            where: {
                id: req.params.id
            },
            attributes: ['id', 'post_url', 'title', 'created_at', [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']],
            include: [{
                model: Comment,
                attributes: ['id', 'comment_text', 'user_id', 'post_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            }, {
                model: User,
                attributes: ['username']
            }]
        })
        .then(dbPostData => {
            if (!dbPostData) {
                res.status(404).json({ message: 'Mo post found with this id' });
                return;
            }
            res.json(dbPostData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// create a post
router.post('/', (req, res) => {
    if (req.session) {
        Post.create({
                title: req.body.title,
                post_url: req.body.post_url,
                user_id: req.body.user_id
            })
            .then(dbPostData => res.json(dbPostData))
            .catch(err => {
                console.log(err);
                res.status(500).json(err);
            });
    }
});

// PUT /api/posts/upvote
//create the vote
router.put('/upvote', (req, res) => {
    // make sure the session exists first
    if (req.session) {
        // pass session id along with all destructured properties on req.body
        Post.upvote({...req.body, user_id: req.session.user_id }, { Vote, Comment, User })
            .then(updateVoteData => res.json(updateVoteData))
            .catch(err => {
                console.log(err);
                res.status(500).json(err);
            });
    }
});
// custom static method created in models/Post.js
// Post.upvote(req.body, { Vote })
//     .then(updatedPostData => res.json(updatedPostData))
//     .catch(err => {
//         console.log(err);
//         res.status(400).json(err);
//     });

// Vote.create below updated by above custom static method
// Vote.create({
//         user_id: req.body.user_id,
//         post_id: req.body.post_id
//     })
//     // .then(dbPostData => res.json(dbPostData))
//     // .catch(err =>
//     //     res.status(500).json(err));
//     .then(() => {
//         // then find the post we just voted on
//         return Post.findOne({
//                 where: {
//                     id: req.body.post_id
//                 },
//                 attributes: [
//                     'id',
//                     'post_url',
//                     'title',
//                     'created_at'
//                     // use raw MySQL aggregate function query to get a count of how many votes the post has and return it under the name 'vote_count'
//                     [
//                         sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'),
//                         'vot_count'
//                     ]
//                 ]

//             })
//             .then(dbPostData => res.json(dbPostData))
//             .catch(err =>
//                 res.status(400).json(err));
//     });

// create an update post
router.put('/:id', (req, res) => {
    Post.update({
            tilte: req.body.title
        }, {
            where: {
                id: req.params.id
            }
        })
        .then(dbPostData => {
            if (!dbPostData) {
                res.status(404).json({ message: 'No post found with this id' });
                return;
            }
            res.json(dbPostData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// delete a post
router.delete('/:id', (req, res) => {
    Post.destroy({
            where: {
                id: req.params.id
            }
        })
        .then(dbPostData => {
            if (!dbPostData) {
                res.status(404).json({ message: 'Np post found with this id' });
                return;
            }
            res.json(dbPostData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
})

module.exports = router;