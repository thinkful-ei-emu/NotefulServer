module.exports = {
  getAllNotes(db){
    return db('notes').select('*');
  },
  getNoteById(db,id){
    return db('notes').select('*').where({id});
  },
  addNewNote(db,newNote){
    return db.insert(newNote).into('notes').returning('*');
  }
};