// @ts-nocheck
const JWT_KEY_NAME = 'jwt'
const getJWT = () => localStorage.getItem(JWT_KEY_NAME)


window.addEventListener('load', ()=>{
 const token = getJWT();
 if (token) {
  window.location.href='/'
 }
})

const registerUser = async (uri, fields) => {
    try {
      const createOptions = {
        method: 'POST',
        headers: {
          'Content-type': 'application/json; charset=UTF-8'
        },
        body: JSON.stringify(fields)
      }
      const response = await fetch(uri, createOptions)
      const user = await response.json()
      return { error: null, value: user }
    } catch (error) {
      console.log('Error in registerUser', error.message)
      return { error: error.message, value: null }
    }
  }
  
  const baseUri = 'http://localhost:3300/'
  const userSlug = 'api/v1/users/'
  const registerSlug = 'register/'
  
  const username = document.querySelector('[name = "username"]')
  const email = document.querySelector('[name = "email"]')
  const password = document.querySelector('[name = "password"]')
  const registerForm = document.querySelector('#register-form')
  const failureAlert = document.querySelector('#failure-alert')
  const successAlert = document.querySelector('#success-alert')
  
  registerForm.addEventListener('submit', async e => {
    try {
      e.preventDefault()
  
      const { error: registerUserError, value: registeredUser } =
        await registerUser(baseUri.concat(userSlug, registerSlug), {
          name: username.value,
          email: email.value,
          password: password.value
        })
  
      // if (registerUserError) {
      //   failureAlert.classList.remove('visually-hidden')
      //   successAlert.classList.add('visually-hidden')
      //   failureAlert.textContent = registerUserError
      //   return
      // } else {
      //   failureAlert.classList.add('visually-hidden')
      // }
  
      if (registeredUser) {
        // failureAlert.classList.add('visually-hidden')
        // successAlert.classList.remove('visually-hidden')
        window.location='/login.html'
      } else {
        // failureAlert.innerHTML = registeredUser.message
        // failureAlert.classList.remove('visually-hidden')
        // successAlert.classList.add('visually-hidden')
      }
    } catch (error) {
      console.error('Error in user log in', error)
      alert('Error while logging')
    }
  })
  