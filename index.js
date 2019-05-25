
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
        // This is an example of where I'd like to see even more logical variable naming and functional programming...
        // At the very least I would want to see something like
        let result = responseJson[i];

        // so that your later references can be `result.name` rather than `responseJson[i].name`, etc.
        $('.results').append(`
        <div><h4>${result.name}</h4>
        <a href="${result.html_url}">${result.html_url}</a>
        <p>${result.description}</p>
        </div>
        `); // you did not have a semicolon here which is necessary for the end of a statement
    } // you did have a semicolon here which is not necessary after a for loop
    
    // What this `result` naming really lets you do for maximal readability,
    // is to transform it into a functional programming style 
    // (rather than your "procedural" style of a for loop)

    // you can easily move that backtick string into a callback function:
    function htmlForResult(result){
        return `<div><h4>${result.name}</h4><a href="${result.html_url}">${result.html_url}</a><p>${result.description}</p></div>`;
    }

    // then you can "map" that function onto your data and build all your HTML at once:
    let html = responseJson.map(htmlForResult);
        
    // and append it all in one fell swoop
    $('.results').append(html);


    // Or you may like the single-statement inline version better, 
    // which can even chain on the show at the end,
    // and also looks good as its own function:
    function showResults(json){
        $('.results').append(
            json.map(
                function htmlForResult(result){
                    return `<div>
                        <h4>${result.name}</h4>
                        <a href="${result.html_url}">${result.html_url}</a>
                        <p>${result.description}</p>
                    </div>`;
                }
            )
        ).show();
    }
    // so you could move that function to global scope and call it with one line:
    showResults(responseJson);

    // and since showResults would do the showing, you wouldn't need this one as a separate line:
    $('.results').show();

    // For maximum logical naming, I would even rename almost all my variables and functions 
    // to no longer talk about a "response" or a "result" which are mechanical terms, 
    // but talk about a "userSearchResponse" and a "userResult" or something like that,
    // - not only to make it more logical and readable when dealing with one resource
    // - but under the assumption that your app may fetch multiple resources
    //   and you want to be able to distinguish one "result" from another
    // - since different resources usually means different data formatting
    //   and different visual HTML/CSS representation
    // - so how to "display a result" might vary greatly
    // - you will want to reserve that ultra-generic language like "response" and "result"
    //   for the layers of your app which are generic, and can work with any resource
    //   (like the layer of the fetch() response handler which asks `if(response.ok)`)
    //   which is totally general, and applies to any resource, so is okay staying with the general word "response".
    // Does that make sense?
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
