/* Global Variables */

const baseURL = 'http://api.openweathermap.org/data/2.5/weather?q='
const apiKey = '&appid=297d714c461b021c0e0eac76978ccbad&units=metric'

// Create a new date instance dynamically with JS
let d = new Date()
let newDate = d.getMonth() + '.' + d.getDate() + '.' + d.getFullYear()

/** Personal API key for OpenWeatherMap API */

//Event listener to add function to existing HTML DOM element
document.getElementById('generate').addEventListener('click', performAction)

//Function called by event listener - here the performAction function handles the name of the city entered by the user and the user's feelings as entered by the user and executes the getWeather function.
function performAction (e) {
  const newCity = document.getElementById('city').value
  const feelings = document.getElementById('feelings').value
  console.log(newDate)

  getWeather(baseURL, newCity, apiKey).then(function (data) {
    console.log(data)

    //then forward the data received from the API (done by invoking the getWeather function) to the server via a post request along with the date (done automatically by JavaScript) and the user's feelings (entered by the user)
    //the server will store the date, the temperature and the content
    postData('http://localhost:8080/add', {
      date: newDate,
      temp: data.main.temp,
      content: feelings
    })

    //after the data is sent to the server we update the user interface
    updateUI()
  })
}

//Funnction to GET Web API data (by using fetch) - the getWeather function uses 'fetch' to obtain the weather information from the OpenWeatherMap API
const getWeather = async (baseURL, newCity, apiKey) => {
  const res = await fetch(`${baseURL}${newCity}${apiKey}`)
  try {
    const data = await res.json()
    return data
  } catch (error) {
    console.log('error', error)
  }
}

//Function to POST data - in order for the app to post the data to the server,i.e. to make a POST request, it invokes an async function 'postData' and uses the POST route that is set up in the server.js file
//the server will receive and store the date, the temperature and the user's feelings in the data object

const postData = async (
  url = '/add',
  data = { date: newDate, temp: data.list[0].main.temp, content: feelings }
) => {
  console.log(data)
  const response = await fetch(url, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    },
    //Body data type must match 'Content-Type' header
    body: JSON.stringify(data) //Create JSON string from a JavaScript object
  })
  try {
    const newData = await response.json()
    console.log(newData)
    return newData
  } catch (error) {
    console.log('error', error)
  }
}

//Function to GET projectData - the app sends a GET request to the server to receive the data by invoking an async function 'updateUI' and using the GET route 'all' set up in the server.js file
//the function amends the values of the data's objects so they can reflect the value that is being stored for them in the server by using inner.HTML

const updateUI = async () => {
  const request = await fetch('http://localhost:8080/all')
  try {
    const allData = await request.json()
    document.getElementById('date').innerHTML = `Date: ${allData.date}`
    document.getElementById('temp').innerHTML = `Temperature: ${allData.temp}`
    document.getElementById('content').innerHTML = `I feel: ${allData.content}`
  } catch (error) {
    console.log('error', error)
  }
}
