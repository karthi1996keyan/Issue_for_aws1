const express=require('express');
const appConfig=require('./../../config/appConfig');
const passport=require('passport');

//controllers
const userController=require('./../controllers/userController');

//middlewares
const auth=require('./../middlewares/auth');

let setRoute=(app)=>
{

    let baseUrl=appConfig.apiVersion+'/users';

    app.post(`${baseUrl}/signup`,userController.signUpFunction);

    
    app.post(`${baseUrl}/login`,userController.loginFunction);

    app.post(`${baseUrl}/logout`,auth.isAuthorized,userController.logoutFunction);

    app.put(`${baseUrl}/edit/:userId`,auth.isAuthorized,userController.editUser);

    app.get(`${baseUrl}/view/all`,auth.isAuthorized,userController.getAllUser);
    
    app.get(`${baseUrl}/view/:userId`,auth.isAuthorized,userController.getSingleUser);

    app.post(`${baseUrl}/delete/:userId`,auth.isAuthorized,userController.deleteSingleUser);
    

    app.get(`/auth/google`, passport.authenticate('google',{
        scope: ['profile', 'email']
    }))

    app.get(`/auth/google/callback` ,passport.authenticate('google'),(req, res)=>{
        let responseHTML = '<html><head><title>Main</title></head><body></body><script>res = %value%; window.opener.postMessage(res, "*");window.close();</script></html>'
         responseHTML = responseHTML.replace('%value%', JSON.stringify({
        user: req.user
    }));
    res.status(200).send(responseHTML);
    })
    

}

module.exports=
{
    setRoute:setRoute
}