
let commentsArr = []
const uri = 'http://localhost:3300/api/v1/comments'
const JWT_KEY_NAME = 'jwt'
/* show & hide error message */
const errorMsg = document.querySelector('.danger')
const errorMsgText = document.querySelector('.text-error')
const userEmailPlaceholder = document.querySelector('#user-email')
const logoutBtn = document.querySelector('#logout')

// const showErrorMsg = err => {
//   errorMsgText.innerText =
//     err.message || 'Error while deleting the comment from list'
//   errorMsg.style.display = 'block'
//   console.error(err.message)
// }
const hideErrorMsg = () => (errorMsg.style.display = 'none')

const getJWT = () => localStorage.getItem(JWT_KEY_NAME)

window.addEventListener('load', async () => {
  console.log(getJWT())
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: getJWT()
    }
  }
  try {
    const response = await fetch(uri, options)
    console.log(response);
    const data = await response.json()
    console.log('response data ',data )

    if (Array.isArray(data)) {
      commentsArr = data
      const lastIndex = data.length - 1
      data.forEach(t => {
        createComment(t)
      })
    }

    // const userEmail = localStorage.getItem('userEmail')
    // userEmailPlaceholder.textContent = userEmail //.split('@')[0]
  } catch (err) {
    // showErrorMsg(err)
    console.error(err)
  }
})

const saveComment = async comment => {
  return new Promise(async (resolve, reject) => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: getJWT()
      },
      body: JSON.stringify(comment)
    }
    try {
      const response = await fetch(uri, options)
      const data = await response.json()
      hideErrorMsg()
      resolve(data) // return data
    } catch (err) {
      showErrorMsg(err)
      reject(err) // throw err
    }
  })
}

const updateComment = async comment => {
  return new Promise(async (resolve, reject) => {
    const options = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: getJWT()
      },
      body: JSON.stringify(comment)
    }
    try {
      const response = await fetch(`${uri}/${comment._id}`, options)
      const data = await response.json()
      resolve(data)
      hideErrorMsg()
    } catch (err) {
      showErrorMsg(err)
      reject(err)
    }
  })
}

const toggleIsCompleted = (id, commentText, evt) => {
  const index = commentsArr.findIndex(comment => comment._id === id)
  if (index !== -1) {
    commentsArr[index].isCompleted = !commentsArr[index].isCompleted
    updateComment(commentsArr[index])
      .then(() => {
        // no action
      })
      .catch(err => {
        commentsArr[index].isCompleted = !commentsArr[index].isCompleted
        evt.target.checked = commentsArr[index].isCompleted
        showErrorMsg(err)
      })
      .finally(() => {
        commentsArr[index].isCompleted
          ? commentText.classList.add('strike')
          : commentText.classList.remove('strike')
      })
  }
}


const deleteComment = async id => {
  return new Promise(async (resolve, reject) => {
    const index = commentsArr.findIndex(comment => comment._id === id)
    if (index !== -1) {
      const options = {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: getJWT()
        }
      }
      try {
        const response = await fetch(`${uri}/${id}`, options)
        await response.json()
        hideErrorMsg()
        resolve()
      } catch (err) {
        showErrorMsg(err)
        reject(error)
      }
    }
  })
}

const updateCommentText = (id, comment) => {
  const index = commentsArr.findIndex(comment => comment._id === id)
  if (index !== -1) {
    const prevCommentText = commentsArr[index].comment
    updateComment({ ...commentsArr[index], comment: comment.textContent })
      .then(() => {
        commentsArr[index].comment = comment.textContent
      })
      .catch(err => {
        commentsArr[index].comment = prevCommentText
        comment.textContent = prevCommentText
        showErrorMsg(err)
      })
  }
}

/* add to do component */
const commentUserText = document.querySelector('#comment-value')
const addCommentBtn = document.querySelector('#add-comment-btn')
const editCommentBtn = document.querySelector('#editComment-Btn')
const deleteCommentBtn = document.querySelector('#deleteComment-Btn')
commentUserText.addEventListener('focus', () => hideErrorMsg())

/* comment list */
const commentList = document.querySelector('#comment-text')

const createComment = comment => {
  const { Comment: userCommentText, _id: id } = comment

  if (!userCommentText || !id) {
    return
  }

  /*<div> comment-list 
     <div> card mt-4 col-md-6 bg-ligth commentBody
       <div> card-body 
        <p> comment-text </p>
        <a> editComment-Btn </a>
        <a> deleteComment-Btn </a>
       </div>
      </div>
    </div>*/

    /*<div> comment-list </div>*/
    const commentLi = document.createElement('div')
    commentLi.classList.add('comment-list')
    commentLi.appendChild(commentBody)

    /*<div> card-body </div>*/
    const commentBody = document.createElement('div')
    commentBody.classList.add(
      'card',
      'mt-4',
      'col-md-6',
      'bg-ligth'
      )
      commentBody.appendChild(commentCard)
    
      /* <div> card-body </div> */
      const commentCard = document.createElement('div')
      commentCard.classList.add('card-body')
      commentCard.appendChild(commentContent)
      commentCard.appendChild(deleteButtom)
      commentCard.appendChild(editButtom)

      /*<p> comment-text </p> */
      const commentContent =  document.createElement('p')
      commentContent.innerText = userCommentText
      commentContent.classList.add('card-text')
      commentContent.setAttribute('contenteditable', true)
      if (isCompleted) commentContent.classList.add('strike')

      /* <a> deleteComment-Btn </a>*/
      const deleteButtom = document.createElement('a')
      deleteButtom.classList.add('card-link', deleteButtom) 

      deleteButtom.addEventListener('click', () => {
        deleteComment()
        .then(() => commentLi())
        .catch(err => showErrorMsg(err))
      })


      /* <a> editComment-Btn </a>*/
      const editButtom = document.createElement('a')
      editButtom.classList.add('card-link', 'editButtom')

      editButtom.addEventListener('click', () => {
        commentContent.setAttribute('contenteditable', true)
        commentContent.focus()
        hideErrorMsg()
      })

      commentContent.addEventListener('focus', () => {
        hideErrorMsg()
      })

    commentContent.addEventListener('blur', () => {
      if (!commentContent.textContent) {
          deleteComment()
          .then(() => commentLi.remove())
          .catch(err => showErrorMsg(err))
        return
      }
      commentContent.setAttribute('contenteditable', false)
      updateCommentText(commentContent)
  })

}

/* Add to do event handling */
addCommentBtn.addEventListener('click', () => {
  if (!commentUserText.value) return
  saveComment({ Comment: commentUserText.value })
    .then(comment => {
      createComment(comment)
      commentUserText.value = ''
      commentsArr.push(comment)
    })
    .catch(err => showErrorMsg(err))
})

const clearCookies = name => {
  document.cookie = name + '=; Max-Age=-99999999;'
}

// logoutBtn.addEventListener('click', e => {
//   e.preventDefault()
//   localStorage.clear()
//   clearCookies(JWT_KEY_NAME)
//   window.location.href = '/login'
// })


