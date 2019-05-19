
const apiKey = "8f814ac78249451392a966d1ba138cad"

const options = {
    headers: new Headers({
      "X-Api-Key": apiKey})
  };

function getRepos(handle) {
    const url = `https://api.github.com/users/${handle}/repos`;
    fetch(url)
        .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw Error(response.statusText);
        })
        .then(responseJson => displayResults(responseJson))
        .catch(error => {
            alert(error)
        })

}

function displayResults(responseJson) {
    let user = responseJson[0].owner.login;
    let userHandleInfo = `<h2>${user}</h2>`;
    $('.results').append(userHandleInfo)
    for (let i = 0; i < responseJson.length; i++) {
        $('.results').append(`
        <div><h4>${responseJson[i].name}</h4>
        <a href="${responseJson[i].html_url}">${responseJson[i].html_url}</a>
        <p>${responseJson[i].description}</p>
        </div>
        `)};
    $('.results').show();
}    


function listenForFormSubmit() {
    $('form').submit(event => {
        event.preventDefault();
        $('.results').empty();
        var userHandle = $('#handleInput').val();
        getRepos(userHandle);
    })
}

$(function initialize() {
    console.log("waiting for user selection");
    listenForFormSubmit();
})