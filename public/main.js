
let commentsArr = []
const uri = 'http://localhost:3000/api/v1/comments'
const JWT_KEY_NAME = 'jwt'
/* show & hide error message */
const errorMsg = document.querySelector('.danger')
const errorMsgText = document.querySelector('.text-error')
const userEmailPlaceholder = document.querySelector('#user-email')
const logoutBtn = document.querySelector('#logout')

const showErrorMsg = err => {
  errorMsgText.innerText =
    err.message || 'Error while deleting the comment from list'
  errorMsg.style.display = 'block'
  console.error(err.message)
}
const hideErrorMsg = () => (errorMsg.style.display = 'none')

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
    const response = await fetch(uri, options)
    const data = await response.json()

    if (Array.isArray(data)) {
      commentsArr = data
      const lastIndex = data.length - 1
      data.forEach(t => {
        createComment(t)
      })
    }

    const userEmail = localStorage.getItem('userEmail')
    userEmailPlaceholder.textContent = userEmail //.split('@')[0]
  } catch (err) {
    showErrorMsg(err)
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

  /*
  /* <li></li> 
  const todoLi = document.createElement('li')
  todoLi.classList.add('list-group-item')

  /* <div></div> 
  const todoMainDiv = document.createElement('div')
  todoMainDiv.classList.add(
    'd-flex',
    'align-items-center',
    'justify-content-between',
    'my-1'
  )
  todoLi.appendChild(todoMainDiv)

  /* <div></div> 
  const leftDiv = document.createElement('div')
  leftDiv.classList.add('d-flex')
  todoMainDiv.appendChild(leftDiv)

  /* <div></div> 
  const rightDiv = document.createElement('div')
  todoMainDiv.appendChild(rightDiv)

  /* <input type='checkbox'> 
  const markCompleteCb = document.createElement('input')
  markCompleteCb.setAttribute('type', 'checkbox')
  markCompleteCb.setAttribute('id', id)
  markCompleteCb.classList.add('form-check-input')
  markCompleteCb.checked = isCompleted
  const cbId = markCompleteCb.getAttribute('id')

  /* <p></p> 
  const todoText = document.createElement('p')
  todoText.innerText = userInputText
  todoText.classList.add('ms-3')
  todoText.setAttribute('contenteditable', true)
  leftDiv.appendChild(markCompleteCb)
  leftDiv.appendChild(todoText)
  if (isCompleted) todoText.classList.add('strike')

  markCompleteCb.addEventListener('click', evt => {
    toggleIsCompleted(cbId, todoText, evt)
  })*/

  /* <span></span>
  const deleteBtn = document.createElement('span')
  deleteBtn.innerHTML = deleteIconSVG
  rightDiv.appendChild(deleteBtn)*/

  deleteCommentBtn.addEventListener('click', () => {
    deleteComment()
      .then(() => todoLi.remove())
      .catch(err => showErrorMsg(err))
  })

  /* <span></span> 
  const editBtn = document.createElement('span')
  editBtn.innerHTML = editIconSVG
  rightDiv.appendChild(editBtn)*/

  editBtn.addEventListener('click', () => {
    todoText.setAttribute('contenteditable', true)
    todoText.focus()
    hideErrorMsg()
  })

  todoText.addEventListener('focus', () => {
    hideErrorMsg()
  })
  todoText.addEventListener('blur', () => {
    if (!todoText.textContent) {
      deleteTodo(cbId)
        .then(() => todoLi.remove())
        .catch(err => showErrorMsg(err))
      return
    }
    todoText.setAttribute('contenteditable', false)
    editTodoText(cbId, todoText)
  })
  /* <ul></ul> */
  todoList.appendChild(todoLi)

  // img.setAttribute('src', book.coverPhoto)
}

/* Add to do event handling */
addTodoBtn.addEventListener('click', () => {
  if (!todoUserText.value) return
  saveTodo({ toDo: todoUserText.value })
    .then(todo => {
      createTodo(todo)
      todoUserText.value = ''
      todoArr.push(todo)
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
  window.location.href = '/login'
})


