var mongoose = require('mongoose');

var PortofolioSchema = mongoose.Schema(
{
name:String,
img : String,
links: [String],
screenshots: [String]
});
var Portofolio = mongoose.model("Portofolio",PortofolioSchema);
module.exports = Portofolio;