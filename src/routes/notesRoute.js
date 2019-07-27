const route = require('express').Router();
const noteServ = require('../services/notesService');

route.get('/',(req,res,next)=>{
  noteServ.getAllNotes(req.app.get('db'))
    .then((results)=>{
      res.status(200)
        .json(results);
    }).catch(next);
}).post((req,res)=>{}).get('/:id',(req,res)=>{
  //check if id is a valid one
  let id = req.params.id;
  if(isNaN(id))
    return res.status(404).json({error:'note not found'});
  noteServ.getNoteById(req.app.get('db'),id).then((result)=>{
    if(!result[0].name)
      return res.status(404).json({error:'note not found'});
    res.status(200).json(result);
  });
}).patch('/:id',()=>{}).delete('/:id',()=>{});

module.exports=route;