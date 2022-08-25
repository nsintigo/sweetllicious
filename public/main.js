let commentsArr = []
const uri = 'http://localhost:3300/api/v1/comments'
const JWT_KEY_NAME = 'jwt'
/* show & hide error message */
// const errorMsg = document.querySelector('.danger')
// const errorMsgText = document.querySelector('.text-error')
// const userEmailPlaceholder = document.querySelector('#user-email')
const logoutBtn = document.querySelector('#logout-btn')

const showErrorMsg = err => {
  // errorMsgText.innerText =
  //   err.message || 'Error while deleting the comment from list'
  // errorMsg.style.display = 'block'
  console.error(err.message)
}
// const hideErrorMsg = () => (errorMsg.style.display = 'none')

const getJWT = () => localStorage.getItem(JWT_KEY_NAME)

window.addEventListener('load', async () => {
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: getJWT()
    }
  }
  try {
    console.log(getJWT())
    if (getJWT()){
      console.log('some')
      logoutBtn.hidden = false
    }
    const response = await fetch(uri, options)
    const data = await response.json()

    if (Array.isArray(data)) {
      commentsArr = data.reverse()
      const lastIndex = data.length - 1
      console.log(commentsArr)
      commentsArr.forEach(comment => {
        createComment(comment)
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
  console.log(comment)

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
      // hideErrorMsg()
      resolve(data) // return data
    } catch (err) {
      // showErrorMsg(err)
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
      // hideErrorMsg()
    } catch (err) {
      // showErrorMsg(err)
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
    console.log(id, index)
    if (index !== -1) {
      const options = {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: getJWT(),
        }
      }
      try {
        const response = await fetch(`${uri}/${id}`, options)
        await response.json()
        // hideErrorMsg()
        resolve()
      } catch (err) {
        // showErrorMsg(err)
        reject(err)
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
// commentUserText.addEventListener('focus', () => hideErrorMsg())

/* comment list */
const commentList = document.querySelector('#comment-text')

const createComment = comment => {
  const { comment: userCommentText, _id: id } = comment

  if (!userCommentText || !id) {
    return
  }

    /*<div> comment-list </div>*/
    const commentLi = document.querySelector('.comments-list')

    /*<div> card-body </div>*/
    const commentBody = document.createElement('div')
    commentLi.appendChild(commentBody)
    commentBody.setAttribute('id', id);
    commentBody.classList.add(
      'card',
      'mt-4',
      'col-md-6',
      'bg-ligth'
      )
    
      /* <div> card-body </div> */
      const commentCard = document.createElement('div')
      commentBody.appendChild(commentCard)
      commentCard.classList.add('card-body')

      /*<p> comment-text </p> */
      const commentContent =  document.createElement('p')
      commentCard.appendChild(commentContent)
      commentContent.innerText = userCommentText
      commentContent.classList.add('card-text')
      commentContent.setAttribute('contenteditable', true)

     
      /* <button> editComment-Btn </button>*/
      const editButtom = document.createElement('button')
      commentCard.appendChild(editButtom)
      editButtom.classList.add('btn', 'btn-primary')
      editButtom.innerText = 'Edit'

      editButtom.addEventListener('click', () => {
        commentContent.setAttribute('contenteditable', true)
        commentContent.focus()
        // hideErrorMsg()
      })

       /* <button> deleteComment-Btn </button>*/
       const deleteButtom = document.createElement('button')
       commentCard.appendChild(deleteButtom)
       deleteButtom.classList.add('btn','btn-primary','mx-2') 
       deleteButtom.innerText = 'Delete'
      
       deleteButtom.addEventListener('click', () => {
        console.log('delete button click', id)
         deleteComment(id)
         .then(() => commentBody.remove())
         .catch(err => showErrorMsg(err))
       })
 
 

      commentContent.addEventListener('focus', () => {
        // hideErrorMsg()
      })

    commentContent.addEventListener('blur', () => {
      if (!commentContent.textContent) {
          deleteComment(id)
          .then(() => commentBody.remove())
          .catch(err => showErrorMsg(err))
        return
      }
      commentContent.setAttribute('contenteditable', false)
      updateCommentText(commentContent)
  })

}

/* Add to do event handling */
addCommentBtn.addEventListener('click', (e) => {
  e.preventDefault();
  console.log(commentUserText.value);
  const userEmail = localStorage.getItem('userEmail');
  if (!commentUserText.value) return
  saveComment({ comment: commentUserText.value, userEmail })
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

logoutBtn.addEventListener('click', e => {
  e.preventDefault()
  localStorage.clear()
  clearCookies(JWT_KEY_NAME)
  window.location.href = '/login.html'
})


