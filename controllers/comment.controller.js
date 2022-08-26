const { Comment: CommentModel } = require('../db/models')

const getComments = async (req, res) => {
  try {
    const commentsList = await CommentModel.find({  }).exec()
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
    const userId = req.loggedInUser._id
    const newComment = await CommentModel.create({ comment, userId })
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
    if (req.loggedInUser._id.toString() !== commentInfo?.userId?.toString()) {
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
    console.log(_id)
    if (!_id) res.status(404).send('Not Found')

    const commentInfo = await CommentModel.findById(_id).exec()
    if (req.loggedInUser._id.toString() !== commentInfo?.userId?.toString()) {
      res
        .status(401)
        .send({ errorMsg: 'you do not have access to delete this comment' })
      return
    }

    await CommentModel.findByIdAndDelete(_id).exec()
    res.send({ message: `comment with id: ${_id} has been delete successfully` })
  } catch (err) {
    res.status(500).send('Server error')
  }
}



module.exports = {getComments, createComment, updateComment, deleteComment}
