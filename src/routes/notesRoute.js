const route = require('express').Router();
const noteServ = require('../services/notesService');
const parse = require('express').json();

route.get('/',(req,res,next)=>{
  noteServ.getAllNotes(req.app.get('db'))
    .then((results)=>{
      res.status(200)
        .json(results);
    }).catch(next);
}).get('/:id',(req,res)=>{
  //check if id is a valid one
  let id = req.params.id;
  if(isNaN(id))
    return res.status(404).json({error:'note not found'});
  noteServ.getNoteById(req.app.get('db'),id).then((result)=>{
    if(!result[0].name)
      return res.status(404).json({error:'note not found'});
    res.status(200).json(result);
  });
}).patch('/:id',parse, (req,res,next)=>{
  let id, changes;
  if(!isNaN(req.params.id))
    id = req.params.id;
  else
    return res.status(404).json({error:'invalid Id'});
  let {name,content} = req.body;
  if(!name && !content)
    return res.status(400).json({error:'must include either name or content change'});
  else
    changes = {name,content};
  noteServ.updateNotes(req.app.get('db'),id,changes)
    .then((result)=>{
      res.status(201)
        .json(result);
    }).catch(next);


}).delete('/:id',(req,res,next)=>{
  let id;
  if(!isNaN(req.params.id))
    id = req.params.id;
  else
    return res.status(404).json({error:'invalid Id'});
  noteServ.deleteNote(req.app.get('db'),id).then(()=>{
    res.status(204)
      .end();
  }).catch(next);
});

module.exports=route;