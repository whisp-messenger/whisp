/*
 * Copyright (c) 2013. Reflect, Alex K.
 */

/**
 * @fileoverview DB interaction - settings DAO.
 * @author alexeykcontact@gmail.com (Alex K.)
 */

const { USER } = require('./tables');
const { selectEntity, insertEntity, updateEntity } = require('./entity');
const { DB_NAME, logger } = require('../predefined');
const User = require('../../../src/proto/commonjs/user_pb').User;
const { fieldNameFromGetter } = require('../helpers/string');
const { connection } = require('./connection');
const r = require('rethinkdb');


/**
 * Saves settings.
 * @param {string} aId User id.
 */
async function selectUser(aId) {
  return selectEntity(aId, USER);
}


/**
 * @param {string} aEmail.
 * @return {Promise.<proto.User>}
 */
async function selectUserByEmail(aEmail) {
  const emailKeyName = fieldNameFromGetter(User.prototype.getEmail.name);
  try {
    const conn = await connection;
    const users = await r.db(DB_NAME).table(USER).filter({
          [emailKeyName]: aEmail
        }).run(conn);
    return User.fromObject(users[0]);
  } catch (e) {
    logger.log(e);
  }
}


/**
 * @param {proto.User} aUser
 */
async function insertUser(aUser) {
  const id  = await insertEntity(aUser.toObject(), USER);
  return id;
}


/**
 * Saves settings.
 * @param {proto.User} aUser
 */
async function updateUser(aUser) {
  return updateEntity(aUser.toObject(), USER);
}


module.exports = {
  updateUser,
  selectUser,
  selectUserByEmail,
  insertUser,
};