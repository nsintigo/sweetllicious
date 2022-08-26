const JWT_KEY_NAME = 'jwt'
const getJWT = () => localStorage.getItem(JWT_KEY_NAME)


window.addEventListener('load', ()=>{
 const token = getJWT();
 if (token) {
  window.location.href='/'
 }
})


const loginUser = async (uri, fields) => {
    try {
      const loginOptions = {
        method: 'POST',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
          Authorization: localStorage.getItem('jwt')
        },
        body: JSON.stringify(fields)
      }
      const response = await fetch(uri, loginOptions)
  
      if (response.status !== 200) {
        const error = await response.json()
        return { error: error.message, value: null }
      } else {
        const { token } = await response.json()
        return { error: null, value: token }
      }
    } catch (error) {
      console.log('Error in loginUser', error.message)
      return { error: error.message, value: null }
    }
  }
  
  const baseUri = 'http://localhost:3300'
  const userSlug = '/api/v1/users/'
  const loginSlug = 'login'
  
  const email = document.querySelector('[name = "email"]')
  const password = document.querySelector('[name = "password"]')
  const loginForm = document.querySelector('#login-form')
  const failureAlert = document.querySelector('#failure-alert')
  
  loginForm.addEventListener('submit', async e => {
    try {
      e.preventDefault()
      const { error: loginUserError, value: token } = await loginUser(
        baseUri.concat(userSlug, loginSlug),
        {
          email: email.value,
          password: password.value
        }
      )
      // if (loginUserError) {
      //   failureAlert.textContent = loginUserError
      //   failureAlert.classList.remove('visually-hidden')
      //   return
      // } else {
      //   failureAlert.classList.add('visually-hidden')
      // }
      if (token) {
        // failureAlert.classList.add('visually-hidden')
        alert('You have successfully login')
        localStorage.setItem('jwt', token)
        localStorage.setItem('userEmail', email.value)
        setTimeout(()=>window.location.href = '/recipes.html',1500)
      }
    } catch (error) {
      console.error('Error in user log in', error)
      alert('Error while logging')
    }
  })
  