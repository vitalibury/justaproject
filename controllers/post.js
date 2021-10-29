import Post from "../models/Post.js";
import Like from "../models/Like.js";
import Comment from "../models/Comment.js";
import errorHandler from "../utils/errorHandler.js";
import mongoose from "mongoose";

export const getAllPosts = async (req, res) => {
    const posts = await Post.aggregate([
      {
        $lookup: {
        from: "likes",
        localField: "likes",
        foreignField: "_id",
        as: "likes"
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user"
        }
      },
      {$unwind: '$user'},
      {$unwind: '$likes'},
      {$sort: {"likes.date": -1}},
      {
        $lookup: {
          from: "users",
          localField: "likes.user",
          foreignField: "_id",
          as: "likes.user"
        }
      },
      {$unwind: {
        path: "$likes.user"
      }},
      {$group: {
        _id: "$_id",
        likes: {$push: "$likes"},
        user: {$first: "$user"},
        date: {$first: "$date"},
        title: {$first: "$title"},
        description: {$first: "$description"},
        imageSrc: {$first: "$imageSrc"},
      }},
      {$addFields: {"likesAmount": {"$size": "$likes"}}},
      { $project: {
        isRated: {
          "$filter": {
            "input": "$likes",
            "as": "likes",
            "cond": { 
              "$eq": [{$toObjectId: "$$likes.user._id"}, {$toObjectId: req.params.id}]
            }
          }
        },
        user: 1,
        date: 1,
        likesAmount: 1,
        title: 1,
        description: 1,
        imageSrc: 1,
        likes: {
          $slice: [ "$likes", 5 ]
          } 
        } 
      },
      {$addFields: {"isRated": {$anyElementTrue: ["$isRated"]}}},
      {$sort: {date: -1}},

    ]);
    try {
    res.status(200).json(posts); 
  } catch (err) {
    errorHandler(res, err);
  }
};

export const getUserPosts = async (req, res) => {
  const posts = await Post.find({user: req.params.id});
  try {
    res.status(200).json(posts);
  } catch (err) {
    errorHandler(res, err);
  }
};

export const createPost = async (req, res) => {
  const post = await new Post({
    title: req.body.title,
    description: req.body.description,
    imageSrc: req.body.imageSrc,
    user: req.params.id
  });
  try {
  await post.save();
  res.status(201).json(post);
  } catch (err) {
    errorHandler(res, err);
  }
};

export const deletePost = async (req, res) => {
  try {
    await Post.deleteOne({_id: req.params.id});
    res.status(200).json({
      message: 'Post has been deleted successfully.'
    });
  } catch(e) {
    errorHandler(res, e);
  }
};

export const getPostWithComments = async (req, res) => {
  try {

    const postArr = await Post.aggregate([
      {$match: {_id: mongoose.Types.ObjectId(req.params.id)}},
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user"
        }
      },
      {$unwind: '$user'},
      {
        $lookup: {
        from: "likes",
        localField: "likes",
        foreignField: "_id",
        as: "likes"
        }
      },
      {$unwind: '$likes'},
      {$sort: {"likes.date": -1}},
      {
        $lookup: {
          from: "users",
          localField: "likes.user",
          foreignField: "_id",
          as: "likes.user"
        }
      },
      {$unwind: {
        path: "$likes.user"
      }},
      {$group: {
        _id: "$_id",
        likes: {$push: "$likes"},
        user: {$first: "$user"},
        date: {$first: "$date"},
        title: {$first: "$title"},
        description: {$first: "$description"},
        imageSrc: {$first: "$imageSrc"},
      }},
      {$addFields: {"likesAmount": {"$size": "$likes"}}},
      { $project: {
        likesAmount: 1,
        user: 1,
        title: 1,
        description: 1,
        imageSrc: 1,
        date: 1,
        isRated: {
          "$filter": {
            "input": "$likes",
            "as": "likes",
            "cond": { 
              "$eq": [{$toObjectId: "$$likes.user._id"}, {$toObjectId: req.params.userId}]
            }
          }
        },
        likes: {
          $slice: [ "$likes", 5 ]
          }
        }
      },
      {$addFields: {"isRated": {$anyElementTrue: ["$isRated"]}}}
    ]);
    const comments = await Comment.find({post: req.params.id})
      .sort({date: -1})
      .populate('user')
      .lean();
      if (comments.length) {
      const modifiedComments = prepareComments(comments);
      postArr[0].comments = modifiedComments;
    } else {
      postArr[0].comments = [];
    }

    res.status(200).json(postArr[0]);
  } catch (e) {
    errorHandler(res, e);
  }
};

export const getPostComments = async (req, res) => {
  try {
    const postComments = await Comment.find({post: req.params.id})
      .sort({date: -1})
      .populate('user')
      .lean();
    const modifiedComments = prepareComments(postComments);
    res.status(200).json(modifiedComments);
  } catch (e) {
    errorHandler(res, e);
  }
};

const prepareComments = (comments) => {
  let level = comments[0].level;
  comments.forEach(comment => {
    if (comment.level > level) {
      level = comment.level;
    }
  });
  for(let i = level; i > 0; i--) {
    comments.forEach(comment => {
      if (comment.level === i) {
        const parentComment = comments.find(elem => String(elem._id) === comment.forComment);
        if (!parentComment.answers) {
          parentComment.answers = [];
        }
        parentComment.answers.push(comment);
      }
    });
  };
  return comments.filter(comment => comment.level === 0);  
};

export const createPostComment = async (req, res) => {
  try {
    const newComment = await new Comment({
      post: req.params.id,
      user: req.body.userId,
      content: req.body.content,
      level: req.body.level,
      forComment: req.body.forComment
    });
    await newComment.save();
    res.status(201).json(newComment);
  } catch (e) {
    errorHandler(res, e);
  }
};

export const deletePostComment = async (req, res) => {
  try {
    await Comment.deleteMany({_id: req.params.id});
    await Comment.deleteMany({forComment: req.params.id});
    res.status(200).json({
      message: 'Comment was deleted successfully.'
    }); // Or sent the post without that comment (maybe only comments without that one)
  } catch(e) {
    errorHandler(res, e);
  }
};

export const changePostRate = async (req, res) => {
  try {
    const currPost = await Post.findById({_id: req.params.id})
      .populate({
        path : 'likes',
        populate : {
          path : 'user'
        }
    });

    const currUserLike = await checkCurrentUserRate(currPost.likes, req.body.userId);
    if (currUserLike) {
      await currPost.depopulate('likes');
      await currPost.likes.pull(currUserLike._id);
      await currPost.save();
      await Like.findByIdAndDelete({_id: currUserLike._id});
    } else {
      const newLike = await new Like({
        user: req.body.userId,
        post: req.params.id
      });
      await newLike.save();
      await currPost.depopulate('likes');
      await currPost.likes.push(newLike._id);
      await currPost.save();
    }

    const postArr = await Post.aggregate([
      {$match: {_id: mongoose.Types.ObjectId(req.params.id)}},
      {
        $lookup: {
        from: "likes",
        localField: "likes",
        foreignField: "_id",
        as: "likes"
        }
      },
      {$unwind: '$likes'},
      {$sort: {"likes.date": -1}},
      {
        $lookup: {
          from: "users",
          localField: "likes.user",
          foreignField: "_id",
          as: "likes.user"
        }
      },
      {$unwind: {
        path: "$likes.user"
      }},
      {$group: {
        _id: "$_id",
        likes: {$push: "$likes"},
      }},
      {$addFields: {"likesAmount": {"$size": "$likes"}}},
      { $project: {
        likesAmount: 1,
        isRated: {
          "$filter": {
            "input": "$likes",
            "as": "likes",
            "cond": { 
              "$eq": [{$toObjectId: "$$likes.user._id"}, {$toObjectId: req.body.userId}]
            }
          }
        },
        likes: {
          $slice: [ "$likes", 5 ]
          }
        }
      },
      {$addFields: {"isRated": {$anyElementTrue: ["$isRated"]}}}
    ]);
    res.status(200).json(postArr[0]);
  } catch(e) {
    errorHandler(res, e);
  }
};

const checkCurrentUserRate = async (likes, id) => {
  const currUserLike = likes.filter(like => {
    return String(like.user._id) === id});
  return currUserLike[0];
};
