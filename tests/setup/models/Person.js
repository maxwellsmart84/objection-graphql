'use strict';

var _ = require('lodash');
var Model = require('objection').Model;

/**
 * @extends Model
 * @constructor
 */
function Person() {
  Model.apply(this, arguments);
}

Model.extend(Person);
module.exports = Person;

Person.tableName = 'Person';

Person.Gender = {
  Male: 'Male',
  Female: 'Female'
};

Person.jsonSchema = {
  type: 'object',
  required: ['firstName', 'lastName'],

  properties: {
    id: {type: 'integer'},
    parentId: {type: ['integer', 'null']},
    firstName: {type: 'string', minLength: 1, maxLength: 255},
    lastName: {type: 'string', minLength: 1, maxLength: 255},
    gender: {type: 'string', enum: _.values(Person.Gender)},
    age: {type: ['number', 'null']}

    /*
    address: {
      type: 'object',
      properties: {
        street: {type: 'string'},
        city: {type: 'string'},
        zipCode: {type: 'string'}
      }
    }
    */
  }
};

Person.relationMappings = {
  reviews: {
    relation: Model.OneToManyRelation,
    modelClass: require('./Review'),
    join: {
      from: 'Person.id',
      to: 'Review.reviewerId'
    }
  },

  movies: {
    relation: Model.ManyToManyRelation,
    modelClass: require('./Movie'),
    join: {
      from: 'Person.id',
      through: {
        from: 'Person_Movie.personId',
        to: 'Person_Movie.movieId'
      },
      to: 'Movie.id'
    }
  },

  parent: {
    relation: Model.OneToOneRelation,
    modelClass: Person,
    join: {
      from: 'Person.parentId',
      to: 'Person.id'
    }
  },

  children: {
    relation: Model.OneToManyRelation,
    modelClass: Person,
    join: {
      from: 'Person.id',
      to: 'Person.parentId'
    }
  }
};
