let Portofolio = require('../models/Portofolio');


let PController = {
    
    getAllPortofolios:function(req, res){
        
        Portofolio.find(function(err, portofolios){
              console.log('potofolios passed');
                console.log(req.user);

            if(err)
                res.send(err.message);
           else {if(req.user){
             res.render('home',{portofolios,username:req.user.name});
            }
                else{
                   // console.log('hi');
                res.render('explore', {portofolios});
          
} }
 }); },
     //a function that creates and savess a picture or a screenshot
    createandsavePortofolio:function(req, res){
        let portofolio = new Portofolio(req.body);
       portofolio.id=req.user.id;
       if(req.files){
        req.files.forEach(function(file){
            if(file.fieldname=="img"){
            portofolio.img="/uploads/"+ file.filename;
            }  else
                {
                    if(file.fieldname==="screenshot")
                    {
                        portofolio.screenshots = "/uploads/"+file.filename;
                    }
                }
        })
       } 

   portofolio.save(function(err, portofolio){
            if(err){
                res.send(err.message)
                console.log(err);
                console.log('hooo')
            }
            else{

                //console.log(portofolio);
                //console.log(req.user._id);
                //console.log(portofolio._id);
                //res.redirect('index');
                
            } 
            }     
); } ,
   //adding a link
put_link:function(req,res){
    var theid=req.user.id
portofolio.findByIdAndUpdate(theid,
{
    $push:{"links":req.body.link}
}, function(err,portofolio){
    if(err){
                res.send(err.message)
                console.log(err);
            } else{
                console.log(portofolio);
                console.log(req.user._id);
                console.log(portofolio._id);
                res.redirect('/users/home/' + req.user.id);
            }
}
)
},
//adding a screenshot
put_screenshot:function(req,res){
var pth = '/uploads/' + req.file.filename;
    var theid=req.user.id

portofolio.findByIdAndUpdate(theid,
{
    $push:{"screenshots":pth}
}, function(err,portofolio){
    if(err){
                res.send(err.message)
                console.log(err);
            } else{
                console.log(portofolio);
                console.log(req.user._id);
                console.log(portofolio._id);
                res.redirect('/users/home/' + req.user.id);
            }
}
)
},
getuser:function(req,res){
    var userid= req.user.id;
    Portofolio.findById(userid, function (err,portofolios ){
        if(err){
           res.send(err)
                console.log(err); 
                console.log('bonne nuit'); 
            } else { if(req.user)
                res.render('home',{portofolios});
                console.log(portofolios);
            }
    }
); },




    findanyportofolio:function(req,res){
        var pid=req.params.id;
        Portofolio.findById(pid, function(err,portofolios){
if(err){
    console.log('hi')
    res.send(err);
} else{
    res.render('explore',{portofolios});
    console.log(portofolios);
}
        });
    }

   
        
    }

module.exports = PController;

