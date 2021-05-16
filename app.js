$(document).ready(function () {
    const movieList = document.querySelector('.movies');
    const singleMovie = document.querySelector('.single-movie');
    const api_key = '29f5a505ab10e67a9b3e17cd5c792cc9';
    const api_root = 'https://api.themoviedb.org/3';
    const image_path = 'https://image.tmdb.org/t/p/w200';
    function sendRequest(path = '', cb, isArray = true) {
        $.ajax(api_root + path + '?api_key=' + api_key, {
            beforeSend: function () {
                cb(false);
            }
        })
            .fail(function (data) {
                if (isArray) {
                    handleFail(movieList)
                } else {
                    handleFail(singleMovie);
                }
            })
            .done(function (data) {
                if (isArray) {
                    cb(true, data.results);
                } else {
                    cb(true, data)
                }
            })
    }
    const path = window.location.pathname;
    if (path.includes('index')) {
        sendRequest('/movie/popular', getMovies);
    } else if (path.includes('about')) {
        const urlParams = new URLSearchParams(window.location.search);
        const id = parseInt(urlParams.get('id'));
        if (Number.isInteger(id)) {
            sendRequest('/movie/' + id, getSingle, false)
        }
    }
    function getSingle(isFetched = true, item = {}) {
        $(singleMovie).html('');
        var spin =
            `<div class="d-flex justify-content-center m-5">` +
            `<div class="spinner-border text-primary" style="width: 6rem; height: 6rem;" role="status">` +
            `<span class="sr-only">Loading...</span>` +
            `</div>` +
            `</div>`;

        if (isFetched === false && !Object.keys(item).length) {
            // $(singleMovie).html('Loading...');
            singleMovie.insertAdjacentHTML('beforeend', spin)
        } else if (isFetched && Object.keys(item).length) {
            var html =
                `<div class="col-md-3 mx-3">` +
                `<img class="about-pic" src="%src%" alt="" />` +
                `</div>` +
                `<div class="col-md-8 m-0">` +
                `<h2 class="text-light h5">%title%</h2>` +
                `<span class="text-muted">%year%</span>` +
                `<p class="h6 text-light my-3">%content%</p>` +
                `<a href="./index.html" class="btn btn-danger"><-- Back</a>` +
                `</div>`


            html = html.replace('%title%', item.title);
            html = html.replace('%year%', item.release_date);
            html = html.replace('%src%', image_path + item.poster_path);
            html = html.replace('%content%', item.overview)

            singleMovie.insertAdjacentHTML('beforeend', html)
        }

    }
    function getMovies(isFetched = true, movies = []) {
        $(movieList).html('');
        var spin =
            `<div class="d-flex justify-content-center m-5">` +
            `<div class="spinner-border text-primary" style="width: 6rem; height: 6rem;" role="status">` +
            `<span class="sr-only">Loading...</span>` +
            `</div>` +
            `</div>`;

        if (isFetched === false && !movies.length) {
            // $(movieList).html('Loading...');
            movieList.insertAdjacentHTML('beforeend', spin)
        } else if (isFetched && movies.length) {
            $(movies).each(function (index, item) {
                var html =
                    `<div class="col-md-3 my-3">` +
                    `<a href="./about.html?id=%id%" class="card1">` +
                    `<img src="%src%" alt="" width="100%" />` +
                    `<p class="h6 mt-2 text-light">%title%</p>` +
                    `<p>%date%</p>` +
                    `</a>` +
                    `</div>`

                html = html.replace('%src%', image_path + item.poster_path);
                html = html.replace('%title%', item.original_title);
                html = html.replace('%date%', item.release_date);
                html = html.replace('%id%', item.id);
                movieList.insertAdjacentHTML('beforeend', html)
            })
        } else {
            alert('Not Found 404')
        }
    }

    function handleFail(el, text) {
        console.log(1);
    }
})