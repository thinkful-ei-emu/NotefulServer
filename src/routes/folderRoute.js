const route = require('express').Router();
const folderServ = require('../services/foldersService');
const noteServ = require('../services/notesService');
const parse = require('express').json();

route.get('/',(req,res,next)=>{
  folderServ.getAllfolders(req.app.get('db')).then((result)=>{
    res.status(200).json(result).catch(next);
  });
}).post('/',parse,(req,res,next)=>{//adding a new folder
  if(req.headers['content-type'] !== 'application/json')
    return res.status(400).json({error:'request must be in json'});
  let {name} = req.body;
  if(!name)
    return res.status(400).json({error:'name is required'});
  let newFolder = {name};
  folderServ.addNewFolder(req.app.get('db'),newFolder)
    .then((result)=>{
      res.status(201)
        .json(result);
    }).catch(next);
}).post('/:id',parse,(req,res,next)=>{ //adding a new not to a specific folder
  let folder_id, newNote;
  let {name, content} = req.body;
  if(!isNaN(req.params.id))
    folder_id = req.params.id;
  else
    return res.status(404).json({error:'can not insert into invalid folder'});
  if(!name || !content)
    res.status(400).json({error:' must include both name and content'});
  else
    newNote = {name,content,folder_id};
  noteServ.addNewNote(req.app.get('db'),newNote).then((results)=>{
    res.status(201)
      .location(req.path + '/' + results.id)
      .json(results);
  }).catch(next);

}).patch(()=>{}).delete('/:id',(req,res,next)=>{
  let folder_id;
  if(!isNaN(req.params.id))
    folder_id = req.params.id;
  else
    return res.status(404).json({error:'can not insert into invalid folder'});
  folderServ.deleteFolder(req.app.get('db'),folder_id)
    .then((results)=>{
      res.status(204).end();
    }).catch(next);
});
module.exports=route;