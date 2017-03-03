let Project = require('../models/Portofolio');

let ProjectController = {
    
    getAllProjects:function(req, res){
        
        Project.find(function(err, projects){
            
            if(err)
                res.send(err.message);
            else {if(req.user){
             res.render('home',{projects,username:req.user.name});
            }
              else
                res.render('home', {projects});
        }
          
        });
    },

    createProject:function(req, res){
        let project = new Project(req.body);

        project.save(function(err, project){
            if(err){
                res.send(err.message)
                console.log(err);
            }
            else{

                console.log(project);
                res.redirect('/users/home');
            }
        })
    }
}

module.exports = ProjectController;