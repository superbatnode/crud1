

async function uploadController(req, res, next) {

    console.log(req.file);
    res.json({ connection: "done" });
}
module.exports = uploadController; 
