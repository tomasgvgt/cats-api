const API_URL_RANDOM = `https://api.thecatapi.com/v1/images/search`;
const API_URL_FAVORITES =  `https://api.thecatapi.com/v1/favourites/`;
const API_URL_UPLOAD = 'https://api.thecatapi.com/v1/images/upload'
const API_KEY = 'live_XMxrMX21ky6gDgiToz9VkABhLkajHSJvIKqAB9hZ8efetDkJaLw37AodJRuL8boR';

const fetchRandCatButton = document.getElementById('fetchRandCats');
const uploadCatButton = document.getElementById('uploadButton');
const spanFetchError = document.getElementById('fetchError');



//Fetching random cats with promises

// fetch(urlAPI).
//     then(response=>response.json()).
//     then(data=>{
//         catImg.src = data[0].url;
//     }).
//     catch(error=>console.log(error));

//Fetching with async/await

async function postFavCat(urlAPI, imgId){
    const response = await fetch(`${urlAPI}?api_key=${API_KEY}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            image_id : imgId,
            })

    })
    console.log('Post Response: ' +response);
}

async function deleteFavCat(urlAPI, imgId){
    const response = await fetch(`${urlAPI}${imgId}`, {
        method: 'DELETE',
        headers: {
            'x-api-key': API_KEY
        }
    });
    console.log('Delete response: '  + response.message);
}

async function uploadCat(urlAPI){
    const form = document.getElementById('uploadForm');
    const formData = new FormData(form);
    console.log(formData.get('file'));

    const data = await fetch(urlAPI, {
        method: 'POST',
        headers: {
            'x-api-key': API_KEY,
        },
        body: formData,
    })
    console.log(data);
}

async function fetchRandomCats(urlAPI, limit){
    try{
        const response = await fetch(`${urlAPI}?limit=${limit}`);
        if(response.status !== 200){
            spanFetchError.innerHTML = `There was an error ${response.status}`
        }
        const data = await response.json();
        return data;
    }catch(error){
        console.log(error)
    }
}

async function loadRandCats(callback, urlAPI, limit){
    const data = await callback(urlAPI, limit);
    let imgId;
    let buttonId;
    let catImg;
    let catButton;

    if (data.length !== 0){
        for(let i = 0; i < limit; i++){
            imgId = `randCat${i + 1}`;
            catImg  = document.getElementById(imgId);
            catImg.src = data[i].url;
            buttonId = `save${i+1}`;
            catButton = document.getElementById(buttonId);
            catButton.addEventListener("click", postFavCat.bind(null, API_URL_FAVORITES, data[i].id))
        }
    }
    console.log(data);
}

async function fetchFavCats(urlAPI){
    try{
        const response = await fetch(urlAPI,{
            method: 'GET',
            headers: {
                'x-api-key': API_KEY
            }
        });
        if(response.status !== 200){
            spanFetchError.innerHTML = `There was an error ${response.status}`
        }
        const data = await response.json();
        return data;

    }catch(error){
         console.log(error);
    }
}

async function loadFavCats(callback, urlAPI){
    const data = await callback(urlAPI);
    console.log(data.length);
    if (data.length !== 0){
        //CREATE ALL THE HTML ELEMENTS NECESARY TO INSERT IMGS
        let section = document.createElement('section');
        section.setAttribute('id', 'favCats');
        let title = document.createElement('h2');
        title.innerHTML = 'Favorites';
        document.body.appendChild(section);
        section.appendChild(title);

        for(let i = 0; i < data.length; i++){
            let article = document.createElement('article');
            let img = document.createElement('img');
            img.height = 200;
            img.src = data[i].image.url;
            let button = document.createElement('button');
            button.innerHTML = 'Remove from favorites';
            button.addEventListener('click', deleteFavCat.bind(null, API_URL_FAVORITES, data[i].id));

            section.appendChild(article);
            article.appendChild(img);
            article.appendChild(button);
        }
    }
    console.log(data);
}


loadRandCats(fetchRandomCats, API_URL_RANDOM, 2);
loadFavCats(fetchFavCats, API_URL_FAVORITES, 2)
fetchRandCatButton.addEventListener("click",loadRandCats.bind(null, fetchRandomCats, API_URL_RANDOM, 2));
uploadCatButton.addEventListener('click', uploadCat.bind(null, API_URL_UPLOAD))