//npm i express cheerio
//scripts changes
//npm i request
//npm i request-promise

const express = require("express");
const app = express();

const request = require("request-promise")
const cheerio = require("cheerio")

const PORT = process.env.PORT || 5000;

app.use(express.json());


app.get("/", (req, res) => {
    res.send("Welcome to tours api");
})

const placetovisit = async () => {

    let packages = [];
    const html = await request.get("https://www.holidify.com/country/india/places-to-visit.html");
    // console.log(html);
    const $ = cheerio.load(html);
    $("div.card.content-card").map((index, element) => {

        const obj = $(element).find("div.card-body > p:nth-child(1)").text();
        const desc = $(element).find("div.card-body > p:nth-child(2)").text();
        const besttime = $(element).find("div.card-body > p:nth-child(3)").text();
        const title = $(element).find("a > h3:nth-child(1)").text();
        const rating = $(element).find("a > div.position-relative > span > b").text();
        const link = $(element).find("a").attr("href");
        // const image = $(element).find("a > div.position-relative > div.collection-scrollable.slick-initialized.slick-sider.slick-dotted > img").attr("src");

        const package = {
            title: title,
            desc: desc,
            besttime: besttime,
            rating: rating,
            link: link,
        }
        packages.push(package)

    }).get();

    // packages.forEach(e => {
    //     console.log(e);
    // })

    return packages;
}

app.get("/tours", async (req, res) => {
    try {
        const packages = await placetovisit();
        res.json(packages);
    } catch (error) {
        res.json(error)
    }
})

app.listen(PORT, () => console.log(`Server running on port : ${PORT}`))