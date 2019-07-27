module.exports = {
  getAllNotes(db){
    return db('notes').select('*');
  },
  getNoteById(db,id){
    return db('notes').select('*').where({id});
  },
  addNewNote(db,newNote){
    return db.insert(newNote).into('notes').returning('*');
  },
  updateNotes(db,id,changes){
    return db('notes').where({id}).update(changes).returning('*');
  },
  deleteNote(db,id){
    return db('notes').where({id}).delete();
  }
};