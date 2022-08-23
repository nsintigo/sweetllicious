const { Comment: CommentModel } = require('../models/comments')

const getComments = async (req, res) => {
  try {
    const commentId = req.loggedInUser._id.toString()
    const commentsList = await CommentModel.find({ commentId }).exec()
    res.send(commentsList)
    return
  } catch (err) {
    res.status(500).send(err)
  }
}

const createComment = async (req, res) => {
  try {
    // throw new Error('some error')
    const { comment } = req.body
    const commentId = req.loggedInUser._id
    const newComment = await commentModel.create({ comment, commentId })
    res.send(newComment)
    return
  } catch (err) {
    res.status(500).send(err.message)
  }
}

const updateComment = async (req, res) => {
  try {
    const { _id } = req.params
    const { comment } = req.body
    if (!_id) res.status(404).send('Not Found')

    const commentInfo = await CommentModel.findById(_id).exec()
    if (req.loggedInUser._id.toString() !== commentInfo?.commentId?.toString()) {
      res
        .status(401)
        .send({ errorMsg: 'you do not have access to edit this comment' })
      return
    }

    await CommentModel.updateOne({ _id }, { comment }).exec()
    const updatedComment = await CommentModel.findById(_id).exec()
    res.send(updatedComment)
  } catch (err) {
    res.status(500).send('Server error')
  }
}

const deleteComment = async (req, res) => {
  try {
    const { _id } = req.params
    if (!_id) res.status(404).send('Not Found')

    const commentInfo = await CommentModel.findById(_id).exec()
    if (req.loggedInUser._id.toString() !== commentInfo?.commentId?.toString()) {
      res
        .status(401)
        .send({ errorMsg: 'you do not have access to delete this book' })
      return
    }

    await CommentModel.findByIdAndDelete(_id).exec()
    res.send({ message: `comment with id: ${_id} has been delete successfully` })
  } catch (err) {
    res.status(500).send('Server error')
  }
}



module.exports = {getComments, createComment, updateComment, deleteComment}
